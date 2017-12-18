Main =
  init: ->
    # XXX Work around Pale Moon / old Firefox + GM 1.15 bug where script runs in iframe with wrong window.location.
    return if d.body and not $ 'title', d.head

    # XXX dwb userscripts extension reloads scripts run at document-start when replaceState/pushState is called.
    # XXX Firefox reinjects WebExtension content scripts when extension is updated / reloaded.
    try
      w = window
      w = (w.wrappedJSObject or w) if $.platform is 'crx'
      return if '<%= meta.name %> antidup' of w
      w['<%= meta.name %> antidup'] = true

    if location.hostname is 'www.google.com'
      if location.pathname is '/recaptcha/api/noscript'
        $.ready -> Captcha.noscript.initFrame()
        return
      $.get 'Captcha Fixes', true, ({'Captcha Fixes': enabled}) ->
        if enabled
          $.ready -> Captcha.fixes.init()
      return

    # Don't run inside ad iframes.
    try
      return if window.frameElement and window.frameElement.src in ['', 'about:blank']

    # Don't run inside MathJax popups.
    return if location.hostname is 'boards.4chan.org' and d.documentElement and not d.doctype

    # Detect multiple copies of 4chan X
    return if doc and $.hasClass(doc, 'fourchan-x')
    $.asap docSet, ->
      $.addClass doc, 'fourchan-x', 'seaweedchan'
      $.addClass doc, "ua-#{$.engine}" if $.engine
    $.on d, '4chanXInitFinished', ->
      if Main.expectInitFinished
        delete Main.expectInitFinished
      else
        new Notice 'error', 'Error: Multiple copies of 4chan X are enabled.'
        $.addClass doc, 'tainted'

    # Flatten default values from Config into Conf
    flatten = (parent, obj) ->
      if obj instanceof Array
        Conf[parent] = obj[0]
      else if typeof obj is 'object'
        for key, val of obj
          flatten key, val
      else # string or number
        Conf[parent] = obj
      return

    # XXX Remove document-breaking ad
    $.onExists doc, '#delform > .adg-rects', $.rm

    flatten null, Config

    for db in DataBoard.keys
      Conf[db] = boards: {}
    Conf['boardConfig'] = boards: {}
    Conf['archives'] = Redirect.archives
    Conf['selectedArchives'] = {}
    Conf['cooldowns'] = {}
    Conf['Index Sort'] = {}
    Conf["Last Long Reply Thresholds #{i}"] = {} for i in [0...2]

    # XXX old key names
    Conf['Except Archives from Encryption'] = false
    Conf['JSON Navigation'] = true
    Conf['Oekaki Links'] = true
    Conf['Show Name and Subject'] = false
    Conf['QR Shortcut'] = true
    Conf['Bottom QR Link'] = true
    Conf['Toggleable Thread Watcher'] = true

    # Enforce JS whitelist
    ($.getSync or $.get) {'jsWhitelist': Conf['jsWhitelist']}, ({jsWhitelist}) ->
      $.addCSP "script-src #{jsWhitelist.replace(/^#.*$/mg, '').replace(/[\s;]+/g, ' ').trim()}"

    # Get saved values as items
    items = {}
    items[key] = undefined for key of Conf
    items['previousversion'] = undefined
    ($.getSync or $.get) items, (items) ->
      if !$.perProtocolSettings and (items['Redirect to HTTPS'] ? Conf['Redirect to HTTPS']) and location.protocol isnt 'https:'
        location.replace('https:' + location.host + location.pathname + location.search + location.hash)
        return
      $.asap docSet, ->

        # Don't hide the local storage warning behind a settings panel.
        if $.cantSet
          # pass

        # Fresh install
        else if !items.previousversion?
          Main.ready ->
            $.set 'previousversion', g.VERSION
            Settings.open()

        # Migrate old settings
        else if items.previousversion isnt g.VERSION
          Main.upgrade items

        # Combine default values with saved values
        for key, val of Conf
          Conf[key] = items[key] ? val

        Main.initFeatures()

  upgrade: (items) ->
    {previousversion} = items
    changes = Settings.upgrade items, previousversion
    items.previousversion = changes.previousversion = g.VERSION
    $.set changes, ->
      if items['Show Updated Notifications'] ? true
        el = $.el 'span',
          <%= html(meta.name + ' has been updated to <a href="' + meta.changelog + '" target="_blank">version ${g.VERSION}</a>.') %>
        new Notice 'info', el, 15

  initFeatures: ->
    {hostname, search} = location
    pathname = location.pathname.split /\/+/
    g.BOARD = new Board pathname[1] unless hostname is 'www.4chan.org'

    if hostname in ['boards.4chan.org', 'sys.4chan.org', 'www.4chan.org']
      $.global ->
        document.documentElement.classList.add 'js-enabled'
        window.FCX = {}
      Main.jsEnabled = $.hasClass doc, 'js-enabled'

    switch hostname
      when 'www.4chan.org'
        $.onExists doc, 'body', -> $.addStyle CSS.www
        Captcha.replace.init()
        return
      when 'sys.4chan.org'
        if pathname[2] is 'imgboard.php'
          if /\bmode=report\b/.test search
            Report.init()
          else if (match = search.match /\bres=(\d+)/)
            $.ready ->
              if Conf['404 Redirect'] and $.id('errmsg')?.textContent is 'Error: Specified thread does not exist.'
                Redirect.navigate 'thread', {
                  boardID: g.BOARD.ID
                  postID:  +match[1]
                }
        else if pathname[2] is 'post'
          PostSuccessful.init()
        return

    if ImageHost.test hostname
      return unless pathname[2] and not /[sm]\.jpg$/.test(pathname[2])
      $.asap (-> d.readyState isnt 'loading'), ->
        if Conf['404 Redirect'] and d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found']
          Redirect.navigate 'file', {
            boardID:  g.BOARD.ID
            filename: pathname[pathname.length - 1]
          }
        else if video = $ 'video'
          if Conf['Volume in New Tab']
            Volume.setup video
          if Conf['Loop in New Tab']
            video.loop = true
            video.controls = false
            video.play()
            ImageCommon.addControls video
      return

    return unless hostname is 'boards.4chan.org'

    if pathname[2] in ['thread', 'res']
      g.VIEW     = 'thread'
      g.THREADID = +pathname[3]
    else if pathname[2] in ['catalog', 'archive']
      g.VIEW = pathname[2]
    else if pathname[2].match /^\d*$/
      g.VIEW = 'index'
    else
      return

    g.threads = new SimpleDict()
    g.posts   = new SimpleDict()

    # set up CSS when <head> is completely loaded
    $.onExists doc, 'body', Main.initStyle

    # c.time 'All initializations'
    for [name, feature] in Main.features
      # c.time "#{name} initialization"
      try
        feature.init()
      catch err
        Main.handleErrors
          message: "\"#{name}\" initialization crashed."
          error: err
      # finally
      #   c.timeEnd "#{name} initialization"

    # c.timeEnd 'All initializations'

    $.ready Main.initReady

  initStyle: ->
    return if !Main.isThisPageLegit()

    # disable the mobile layout
    $('link[href*=mobile]', d.head)?.disabled = true
    $.addClass doc, if g.VIEW is 'thread' then 'thread-view' else g.VIEW
    $.onExists doc, '.ad-cnt, .adg-rects > .desktop', (ad) -> $.onExists ad, 'img, iframe', -> $.addClass doc, 'ads-loaded'
    $.addClass doc, 'autohiding-scrollbar' if Conf['Autohiding Scrollbar']
    $.ready ->
      if d.body.clientHeight > doc.clientHeight and (window.innerWidth is doc.clientWidth) isnt Conf['Autohiding Scrollbar']
        Conf['Autohiding Scrollbar'] = !Conf['Autohiding Scrollbar']
        $.set 'Autohiding Scrollbar', Conf['Autohiding Scrollbar']
        $.toggleClass doc, 'autohiding-scrollbar'
    $.addStyle CSS.boards, 'fourchanx-css'
    Main.bgColorStyle = $.el 'style', id: 'fourchanx-bgcolor-css'

    keyboard = false
    $.on d, 'mousedown', -> keyboard = false
    $.on d, 'keydown', (e) -> (keyboard = true if e.keyCode is 9) # tab
    window.addEventListener 'focus', (-> doc.classList.toggle 'keyboard-focus', keyboard), true

    Main.setClass()

  setClass: ->
    if g.VIEW is 'catalog'
      $.addClass doc, $.id('base-css').href.match(/catalog_(\w+)/)[1].replace('_new', '').replace /_+/g, '-'
      return

    style          = 'yotsuba-b'
    mainStyleSheet = $ 'link[title=switch]', d.head
    styleSheets    = $$ 'link[rel="alternate stylesheet"]', d.head
    setStyle = ->
      $.rmClass doc, style
      style = null
      for styleSheet in styleSheets
        if styleSheet.href is mainStyleSheet?.href
          style = styleSheet.title.toLowerCase().replace('new', '').trim().replace /\s+/g, '-'
          style = styleSheet.href.match(/[a-z]*(?=[^/]*$)/)[0] if style is '_special'
          style = null unless style in ['yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'photon', 'tomorrow', 'spooky']
          break
      if style
        $.addClass doc, style
        $.rm Main.bgColorStyle
      else
        # Determine proper background color for dialogs if 4chan is using a special stylesheet.
        div = $.el 'div',
          className: 'reply'
        div.style.cssText = 'position: absolute; visibility: hidden;'
        $.add d.body, div
        bgColor = window.getComputedStyle(div).backgroundColor
        $.rm div
        Main.bgColorStyle.textContent = """
          .dialog, .suboption-list > div:last-of-type, :root.catalog-hover-expand .catalog-container:hover > .post {
            background-color: #{bgColor};
          }
        """
        $.after $.id('fourchanx-css'), Main.bgColorStyle
    setStyle()
    return unless mainStyleSheet
    new MutationObserver(setStyle).observe mainStyleSheet, {
      attributes: true
      attributeFilter: ['href']
    }

  initReady: ->
    # XXX Sometimes threads don't 404 but are left over as stubs containing one garbage reply post.
    if g.VIEW is 'thread' and (d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found'] or ($('.board') and not $('.opContainer')))
      ThreadWatcher.set404 g.BOARD.ID, g.THREADID, ->
        if Conf['404 Redirect']
          Redirect.navigate 'thread',
            boardID:  g.BOARD.ID
            threadID: g.THREADID
            postID:   +location.hash.match /\d+/ # post number or 0
          , "/#{g.BOARD}/"
      return

    return if d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found']

    if g.VIEW in ['index', 'thread'] and not $('.board + *')
      msg = $.el 'div',
        <%= html('The page didn&#039;t load completely.<br>Some features may not work unless you <a href="javascript:;">reload</a>.') %>
      $.on $('a', msg), 'click', -> location.reload()
      new Notice 'warning', msg

    # Parse HTML or skip it and start building from JSON.
    unless Conf['JSON Index'] and g.VIEW is 'index'
      Main.initThread() 
    else
      Main.expectInitFinished = true
      $.event '4chanXInitFinished'

  initThread: ->
    if (board = $ '.board')
      threads = []
      posts   = []

      for threadRoot in $$ '.board > .thread', board
        thread = new Thread +threadRoot.id[1..], g.BOARD
        thread.nodes.root = threadRoot
        threads.push thread
        for postRoot in $$('.thread > .postContainer', threadRoot) when $('.postMessage', postRoot)
          try
            posts.push new Post postRoot, thread, g.BOARD
          catch err
            # Skip posts that we failed to parse.
            unless errors
              errors = []
            errors.push
              message: "Parsing of Post No.#{postRoot.id.match(/\d+/)} failed. Post will be skipped."
              error: err
      Main.handleErrors errors if errors

      if g.VIEW is 'thread'
        scriptData = Get.scriptData()
        threads[0].postLimit = /\bbumplimit *= *1\b/.test scriptData
        threads[0].fileLimit = /\bimagelimit *= *1\b/.test scriptData
        threads[0].ipCount   = if m = scriptData.match /\bunique_ips *= *(\d+)\b/ then +m[1]

      if g.BOARD.ID is 'f' and g.VIEW is 'thread'
        $.ajax "#{location.protocol}//a.4cdn.org/f/thread/#{g.THREADID}.json",
          timeout: $.MINUTE
          onloadend: ->
            if @response and posts[0].file
              posts[0].file.text.dataset.md5 = posts[0].file.MD5 = @response.posts[0].md5

      Main.callbackNodes 'Thread', threads
      Main.callbackNodesDB 'Post', posts, ->
        QuoteThreading.insert post for post in posts
        Main.expectInitFinished = true
        $.event '4chanXInitFinished'

    else
      Main.expectInitFinished = true
      $.event '4chanXInitFinished'

  callbackNodes: (klass, nodes) ->
    i = 0
    cb = Callbacks[klass]
    while node = nodes[i++]
      cb.execute node
    return

  callbackNodesDB: (klass, nodes, cb) ->
    i   = 0
    cbs = Callbacks[klass]
    fn  = ->
      return false if not (node = nodes[i])
      cbs.execute node
      ++i % 25

    softTask = ->
      while fn()
        continue
      unless nodes[i]
        (cb() if cb)
        return
      setTimeout softTask, 0 

    softTask()

  handleErrors: (errors) ->
    # Detect conflicts with 4chan X v2
    if d.body and $.hasClass(d.body, 'fourchan_x') and not $.hasClass(doc, 'tainted')
      new Notice 'error', 'Error: Multiple copies of 4chan X are enabled.'
      $.addClass doc, 'tainted'

    unless errors instanceof Array
      error = errors
    else if errors.length is 1
      error = errors[0]
    if error
      new Notice 'error', Main.parseError(error, Main.reportLink([error])), 15
      return

    div = $.el 'div',
      <%= html('${errors.length} errors occurred.&{Main.reportLink(errors)} [<a href="javascript:;">show</a>]') %>
    $.on div.lastElementChild, 'click', ->
      [@textContent, logs.hidden] = if @textContent is 'show' then (
        ['hide', false]
      ) else (
        ['show', true]
      )

    logs = $.el 'div',
      hidden: true
    for error in errors
      $.add logs, Main.parseError error

    new Notice 'error', [div, logs], 30

  parseError: (data, reportLink) ->
    c.error data.message, data.error.stack
    message = $.el 'div',
      <%= html('${data.message}?{reportLink}{&{reportLink}}') %>
    error = $.el 'div',
      textContent: "#{data.error.name or 'Error'}: #{data.error.message or 'see console for details'}"
    lines = data.error.stack?.match(/\d+(?=:\d+\)?$)/mg)?.join().replace(/^/, ' at ') or ''
    context = $.el 'div',
      textContent: "(<%= meta.name %> <%= meta.fork %> v#{g.VERSION} #{$.platform} on #{$.engine}#{lines})"
    [message, error, context]

  reportLink: (errors) ->
    data = errors[0]
    title  = data.message
    title += " (+#{errors.length - 1} other errors)" if errors.length > 1
    details = ''
    addDetails = (text) ->
      unless encodeURIComponent(title + details + text + '\n').length > <%= meta.newIssueMaxLength - meta.newIssue.replace(/%(title|details)/, '').length %>
        details += text + '\n'
    addDetails """
      [Please describe the steps needed to reproduce this error.]

      Script: <%= meta.name %> <%= meta.fork %> v#{g.VERSION} #{$.platform}
      User agent: #{navigator.userAgent}
      URL: #{location.href}
    """
    addDetails '\n' + data.error
    addDetails data.error.stack.replace(data.error.toString(), '').trim() if data.error.stack
    addDetails '\n`' + data.html + '`' if data.html
    details = details.replace /file:\/{3}.+\//g, '' # Remove local file paths
    url = "<%= meta.newIssue.replace('%title', '#{encodeURIComponent title}').replace('%details', '#{encodeURIComponent details}') %>"
    <%= html('<span class="report-error"> [<a href="${url}" target="_blank">report</a>]</span>') %>

  isThisPageLegit: ->
    # 404 error page or similar.
    unless 'thisPageIsLegit' of Main
      Main.thisPageIsLegit = location.hostname is 'boards.4chan.org' and
        !$('link[href*="favicon-status.ico"]', d.head) and
        d.title not in ['4chan - Temporarily Offline', '4chan - Error', '504 Gateway Time-out']
    Main.thisPageIsLegit

  ready: (cb) ->
    $.ready ->
      (cb() if Main.isThisPageLegit())

  features: [
    ['Polyfill',                  Polyfill]
    ['Board Configuration',       BoardConfig]
    ['Normalize URL',             NormalizeURL]
    ['Captcha Configuration',     Captcha.replace]
    ['Image Host Rewriting',      ImageHost]
    ['Redirect',                  Redirect]
    ['Header',                    Header]
    ['Catalog Links',             CatalogLinks]
    ['Settings',                  Settings]
    ['Index Generator',           Index]
    ['Disable Autoplay',          AntiAutoplay]
    ['Announcement Hiding',       PSAHiding]
    ['Fourchan thingies',         Fourchan]
    ['Color User IDs',            IDColor]
    ['Highlight by User ID',      IDHighlight]
    ['Count Posts by ID',         IDPostCount]
    ['Custom CSS',                CustomCSS]
    ['Thread Links',              ThreadLinks]
    ['Linkify',                   Linkify]
    ['Reveal Spoilers',           RemoveSpoilers]
    ['Resurrect Quotes',          Quotify]
    ['Filter',                    Filter]
    ['Thread Hiding Buttons',     ThreadHiding]
    ['Reply Hiding Buttons',      PostHiding]
    ['Recursive',                 Recursive]
    ['Strike-through Quotes',     QuoteStrikeThrough]
    ['Quick Reply Personas',      QR.persona]
    ['Quick Reply',               QR]
    ['Cooldown',                  QR.cooldown]
    ['Pass Link',                 PassLink]
    ['Menu',                      Menu]
    ['Index Generator (Menu)',    Index.menu]
    ['Report Link',               ReportLink]
    ['Copy Text Link',            CopyTextLink]
    ['Thread Hiding (Menu)',      ThreadHiding.menu]
    ['Reply Hiding (Menu)',       PostHiding.menu]
    ['Delete Link',               DeleteLink]
    ['Filter (Menu)',             Filter.menu]
    ['Edit Link',                 QR.oekaki.menu]
    ['Download Link',             DownloadLink]
    ['Archive Link',              ArchiveLink]
    ['Quote Inlining',            QuoteInline]
    ['Quote Previewing',          QuotePreview]
    ['Quote Backlinks',           QuoteBacklink]
    ['Mark Quotes of You',        QuoteYou]
    ['Mark OP Quotes',            QuoteOP]
    ['Mark Cross-thread Quotes',  QuoteCT]
    ['Anonymize',                 Anonymize]
    ['Time Formatting',           Time]
    ['Relative Post Dates',       RelativeDates]
    ['File Info Formatting',      FileInfo]
    ['Fappe Tyme',                FappeTyme]
    ['Gallery',                   Gallery]
    ['Gallery (menu)',            Gallery.menu]
    ['Sauce',                     Sauce]
    ['Image Expansion',           ImageExpand]
    ['Image Expansion (Menu)',    ImageExpand.menu]
    ['Reveal Spoiler Thumbnails', RevealSpoilers]
    ['Image Loading',             ImageLoader]
    ['Image Hover',               ImageHover]
    ['Volume Control',            Volume]
    ['WEBM Metadata',             Metadata]
    ['Comment Expansion',         ExpandComment]
    ['Thread Expansion',          ExpandThread]
    ['Favicon',                   Favicon]
    ['Unread',                    Unread]
    ['Quote Threading',           QuoteThreading]
    ['Thread Stats',              ThreadStats]
    ['Thread Updater',            ThreadUpdater]
    ['Thread Watcher',            ThreadWatcher]
    ['Thread Watcher (Menu)',     ThreadWatcher.menu]
    ['Mark New IPs',              MarkNewIPs]
    ['Index Navigation',          Nav]
    ['Keybinds',                  Keybinds]
    ['Banner',                    Banner]
    ['Flash Features',            Flash]
    ['Reply Pruning',             ReplyPruning]
    <% if (readJSON('/.tests_enabled')) { %>
    ['Build Test',                Build.Test]
    <% } %>
  ]
