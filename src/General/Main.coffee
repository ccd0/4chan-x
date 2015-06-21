Main =
  init: ->
    if location.hostname is 'www.google.com'
      if location.pathname is '/recaptcha/api/noscript'
        $.ready -> Captcha.noscript.initFrame()
        return
      if location.pathname is '/recaptcha/api/fallback'
        $.ready -> Captcha.v2.initFrame()
      $.get 'Captcha Fixes', true, ({'Captcha Fixes': enabled}) ->
        if enabled
          $.ready -> Captcha.fixes.init()
      return

    if location.hostname is 'www.4chan.org'
      $.onExists d.documentElement, 'body', false, -> $.addStyle Main.cssWWW
      Conf = {'captchaLanguage': Config.captchaLanguage}
      $.get Conf, (items) ->
        $.extend Conf, items
        Captcha.language.fixPage()
      return

    g.threads = new SimpleDict()
    g.posts   = new SimpleDict()

    pathname = location.pathname.split '/'
    g.BOARD  = new Board pathname[1]
    return if g.BOARD.ID in ['z', 'fk']
    g.VIEW   =
      switch pathname[2]
        when 'res', 'thread'
          'thread'
        when 'catalog', 'archive', 'post'
          pathname[2]
        else
          'index'
    return if g.VIEW is 'catalog' and g.BOARD.ID is 'f'
    return if g.VIEW is 'archive' and g.BOARD.ID in ['b', 'f']
    if g.VIEW is 'thread'
      g.THREADID = +pathname[3]

    # flatten Config into Conf
    # and get saved or default values
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

    $.get Conf, (items) ->
      $.extend Conf, items
      # XXX temporarily set here so old versions update to correct setting
      Conf['Fixed Thread Watcher'] ?= Conf['Toggleable Thread Watcher']
      $.asap (-> doc = d.documentElement), Main.initFeatures

    # set up CSS when <head> is completely loaded
    $.asap (-> doc = d.documentElement), ->
      $.onExists doc, 'body', false, Main.initStyle

  initFeatures: ->
    if location.hostname in ['boards.4chan.org', 'sys.4chan.org']
      $.globalEval 'document.documentElement.classList.add("js-enabled");'

    switch location.hostname
      when 'a.4cdn.org'
        return
      when 'sys.4chan.org'
        Report.init()
        PostSuccessful.init() if g.VIEW is 'post'
        return
      when 'i.4cdn.org'
        $.asap (-> d.readyState isnt 'loading'), ->
          if Conf['404 Redirect'] and d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found']
            Redirect.init()
            pathname = location.pathname.split '/'
            URL = Redirect.to 'file',
              boardID:  g.BOARD.ID
              filename: pathname[pathname.length - 1]
            Redirect.navigate URL
          else if video = $ 'video'
            if Conf['Volume in New Tab']
              Volume.setup video
            if Conf['Loop in New Tab']
              video.loop = true
              video.controls = false
              video.play()
              ImageCommon.addControls video
        return

    if Conf['Normalize URL'] and g.VIEW is 'thread'
      pathname = location.pathname.split '/'
      if pathname[2] isnt 'thread' or pathname.length > 4
        pathname[2] = 'thread'
        history.replaceState null, '', pathname[0...4].join('/') + location.hash

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
    $.addClass doc, if chrome? then 'blink' else 'gecko'
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
        if styleSheet.href is mainStyleSheet.href
          style = styleSheet.title.toLowerCase().replace('new', '').trim().replace /\s+/g, '-'
          break
      $.addClass doc, style
    setStyle()
    return unless mainStyleSheet
    new MutationObserver(setStyle).observe mainStyleSheet,
      attributes: true
      attributeFilter: ['href']

  initReady: ->
    if d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found']
      if g.VIEW is 'thread'
        ThreadWatcher.set404 g.BOARD.ID, g.THREADID, ->
          if Conf['404 Redirect']
            href = Redirect.to 'thread',
              boardID:  g.BOARD.ID
              threadID: g.THREADID
              postID:   +location.hash.match /\d+/ # post number or 0
            Redirect.navigate href, "/#{g.BOARD}/"
      return

    # 4chan Pass Link
    if styleSelector = $.id 'styleSelector'
      passLink = $.el 'a',
        textContent: '4chan Pass'
        href: 'javascript:;'
      $.on passLink, 'click', ->
        window.open '//sys.4chan.org/auth',
          'This will steal your data.'
          'left=0,top=0,width=500,height=255,toolbar=0,resizable=0'
      $.before styleSelector.previousSibling, [$.tn '['; passLink, $.tn ']\u00A0\u00A0']

    # Parse HTML or skip it and start building from JSON.
    unless Conf['JSON Navigation'] and g.VIEW is 'index'
      Main.initThread() 
    else
      $.event '4chanXInitFinished'

    $.get 'previousversion', null, ({previousversion}) ->
      return if previousversion is g.VERSION
      if previousversion
        el = $.el 'span',
          <%= html(meta.name + ' has been updated to <a href="' + meta.repo + 'blob/' + meta.mainBranch + '/CHANGELOG.md" target="_blank">version ${g.VERSION}</a>.') %>
        new Notice 'info', el, 15
      else
        Settings.open()
      $.set 'previousversion', g.VERSION

    if Conf['Show Support Message']
      <% if (type === 'userscript') { %>
      GMver = GM_info.version.split '.'
      for v, i in "<%= meta.min.greasemonkey %>".split '.'
        continue if v is GMver[i]
        (v < GMver[i]) or new Notice 'warning', "Your version of Greasemonkey is outdated (v#{GM_info.version} instead of v<%= meta.min.greasemonkey %> minimum) and <%= meta.name %> may not operate correctly.", 30
        break
      <% } %>

      try
        localStorage.getItem '4chan-settings'
      catch err
        new Notice 'warning', 'Cookies need to be enabled on 4chan for <%= meta.name %> to operate properly.', 30

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
      new Notice 'error', Main.parseError(error), 15
      return

    div = $.el 'div',
      <%= html('${errors.length} errors occurred. [<a href="javascript:;">show</a>]') %>
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

  parseError: (data) ->
    c.error data.message, data.error.stack
    message = $.el 'div',
      textContent: data.message
    error = $.el 'div',
      textContent: "#{data.error.name or 'Error'}: #{data.error.message or 'see console for details'}"
    [message, error]

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

  css: `<%= importCSS('font-awesome', 'noscript', 'style', 'yotsuba', 'yotsuba-b', 'futaba', 'burichan', 'tomorrow', 'photon') %>`

  cssWWW: `<%= importCSS('noscript', 'www') %>`

  features: [
    ['Polyfill',                  Polyfill]
    ['Captcha Language',          Captcha.language]
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
    ['Linkify',                   Linkify]
    ['Reveal Spoilers',           RemoveSpoilers]
    ['Resurrect Quotes',          Quotify]
    ['Filter',                    Filter]
    ['Thread Hiding Buttons',     ThreadHiding]
    ['Reply Hiding Buttons',      PostHiding]
    ['Recursive',                 Recursive]
    ['Strike-through Quotes',     QuoteStrikeThrough]
    ['Quick Reply',               QR]
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
