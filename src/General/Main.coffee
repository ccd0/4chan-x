Main =
  init: ->
    # XXX Work around Pale Moon / old Firefox + GM 1.15 bug where script runs in iframe with wrong window.location.
    return if d.body and not $ 'title', d.head

    # XXX dwb userscripts extension reloads scripts run at document-start when replaceState/pushState is called.
    return if window['<%= meta.name %> antidup']
    window['<%= meta.name %> antidup'] = true

    if location.hostname is 'www.google.com'
      $.get 'Captcha Fixes', true, ({'Captcha Fixes': enabled}) ->
        if enabled
          $.ready -> Captcha.fixes.init()
      return

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

    flatten null, Config

    for db in DataBoard.keys
      Conf[db] = boards: {}
    Conf['selectedArchives'] = {}
    Conf['cooldowns'] = {}

    # XXX old key names
    Conf['Except Archives from Encryption'] = false

    # Get saved values as items
    items = {}
    items[key] = undefined for key of Conf
    items['previousversion'] = undefined
    $.get items, (items) ->
      $.asap (-> doc = d.documentElement), ->

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
    changes = {previousversion: g.VERSION}
    $.extend changes, Settings.upgrade(items, previousversion)
    $.extend items, changes
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
        $.onExists doc, 'body', false, -> $.addStyle Main.cssWWW
        Captcha.replace.init()
        return
      when 'sys.4chan.org'
        if pathname[2] is 'imgboard.php'
          if /\bmode=report\b/.test search
            Report.init()
          else if (match = search.match /\bres=(\d+)/)
            $.ready ->
              if Conf['404 Redirect'] and $.id('errmsg')?.textContent is 'Error: Specified thread does not exist.'
                Redirect.navigate 'thread',
                  boardID: g.BOARD.ID
                  postID:  +match[1]
        else if pathname[2] is 'post'
          PostSuccessful.init()
        return
      when 'i.4cdn.org'
        return unless pathname[2] and not /s\.jpg$/.test(pathname[2])
        $.asap (-> d.readyState isnt 'loading'), ->
          if Conf['404 Redirect'] and d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found']
            Redirect.navigate 'file',
              boardID:  g.BOARD.ID
              filename: pathname[pathname.length - 1]
          else if video = $ 'video'
            if Conf['Volume in New Tab']
              Volume.setup video
            if Conf['Loop in New Tab']
              video.loop = true
              video.controls = false
              video.play()
              ImageCommon.addControls video
        return

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
    $.onExists doc, 'body', false, Main.initStyle

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
    return if !Main.isThisPageLegit() or $.hasClass doc, 'fourchan-x'

    # disable the mobile layout
    $('link[href*=mobile]', d.head)?.disabled = true
    $.addClass doc, 'fourchan-x', 'seaweedchan'
    $.addClass doc, if g.VIEW is 'thread' then 'thread-view' else g.VIEW
    $.addClass doc, $.engine if $.engine
    $.addStyle Main.css, 'fourchanx-css'

    keyboard = false
    $.on d, 'mousedown', -> keyboard = false
    $.on d, 'keydown', (e) -> keyboard = true if e.keyCode is 9 # tab
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
      for styleSheet in styleSheets
        if styleSheet.href is mainStyleSheet?.href
          style = styleSheet.title.toLowerCase().replace('new', '').trim().replace /\s+/g, '-'
          break
      $.addClass doc, style
    setStyle()
    return unless mainStyleSheet
    new MutationObserver(setStyle).observe mainStyleSheet,
      attributes: true
      attributeFilter: ['href']

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

    # Parse HTML or skip it and start building from JSON.
    unless Conf['JSON Navigation'] and g.VIEW is 'index'
      Main.initThread() 
    else
      $.event '4chanXInitFinished'

  initThread: ->
    if board = $ '.board'
      threads = []
      posts   = []

      for threadRoot in $$ '.board > .thread', board
        thread = new Thread +threadRoot.id[1..], g.BOARD
        threads.push thread
        for postRoot in $$ '.thread > .postContainer', threadRoot
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

      Main.callbackNodes Thread, threads
      Main.callbackNodesDB Post, posts, ->
        QuoteThreading.insert post for post in posts
        $.event '4chanXInitFinished'

    else
      $.event '4chanXInitFinished'

  callbackNodes: (klass, nodes) ->
    i = 0
    cb = klass.callbacks
    while node = nodes[i++]
      cb.execute node
    return

  callbackNodesDB: (klass, nodes, cb) ->
    i   = 0
    cbs = klass.callbacks
    fn  = ->
      return false unless node = nodes[i]
      cbs.execute node
      ++i % 25

    softTask = ->
      while fn()
        continue
      unless nodes[i]
        cb() if cb
        return
      setTimeout softTask, 0 

    softTask()

  handleErrors: (errors) ->
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
      [@textContent, logs.hidden] = if @textContent is 'show'
        ['hide', false]
      else
        ['show', true]

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
      textContent: "(<%= meta.name %> <%= meta.fork %> v#{g.VERSION} <%= type %> on #{$.engine}#{lines})"
    [message, error, context]

  reportLink: (errors) ->
    data = errors[0]
    title  = data.message
    title += " (+#{errors.length - 1} other errors)" if errors.length > 1
    details = """
      [Please describe the steps needed to reproduce this error.]

      Script: <%= meta.name %> <%= meta.fork %> v#{g.VERSION} <%= type %>
      User agent: #{navigator.userAgent}
      URL: #{location.href}

      #{data.error}
      #{data.error.stack?.replace(data.error.toString(), '').trim() or ''}
    """
    details = details.replace /file:\/{3}.+\//g, '' # Remove local file paths
    url = "<%= meta.newIssue.replace('%title', '#{encodeURIComponent title}').replace('%details', '#{encodeURIComponent details}') %>"
    <%= html(' [<a href="${url}" target="_blank">report</a>]') %>

  isThisPageLegit: ->
    # 404 error page or similar.
    unless 'thisPageIsLegit' of Main
      Main.thisPageIsLegit = location.hostname is 'boards.4chan.org' and
        !$('link[href*="favicon-status.ico"]', d.head) and
        d.title not in ['4chan - Temporarily Offline', '4chan - Error', '504 Gateway Time-out']
    Main.thisPageIsLegit

  ready: (cb) ->
    $.ready ->
      cb() if Main.isThisPageLegit()

  css: `<%= importCSS('font-awesome', 'style', 'yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon', 'supports') %>`

  cssWWW: `<%= importCSS('www') %>`

  features: [
    ['Polyfill',                  Polyfill]
    ['Normalize URL',             NormalizeURL]
    ['Captcha Configuration',     Captcha.replace]
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
    ['Quick Reply',               QR]
    ['Cooldown',                  QR.cooldown]
    ['Oekaki Links',              QR.oekaki]
    ['Pass Link',                 PassLink]
    ['Menu',                      Menu]
    ['Index Generator (Menu)',    Index.menu]
    ['Report Link',               ReportLink]
    ['Thread Hiding (Menu)',      ThreadHiding.menu]
    ['Reply Hiding (Menu)',       PostHiding.menu]
    ['Delete Link',               DeleteLink]
    ['Filter (Menu)',             Filter.menu]
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
    ['Thread Excerpt',            ThreadExcerpt]
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
    <% if (tests_enabled) { %>
    ['Build Test',                BuildTest]
    <% } %>
  ]

Main.init()
