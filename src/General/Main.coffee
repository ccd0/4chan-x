Main =
  init: ->
    if location.hostname is 'www.google.com'
      return $.ready -> Captcha.noscript.initFrame()

    g.threads = new SimpleDict
    g.posts   = new SimpleDict

    pathname = location.pathname.split '/'
    g.BOARD  = new Board pathname[1]
    return if g.BOARD.ID in ['z', 'fk']
    g.VIEW   =
      switch pathname[2]
        when 'res', 'thread'
          'thread'
        when 'catalog'
          'catalog'
        when 'archive'
          'archive'
        else
          'index'
    if g.VIEW is 'catalog'
      return Index.catalogSwitch()
    if g.VIEW is 'thread'
      g.THREADID = +pathname[3]
      g.SLUG = pathname[4] if pathname[4]?
      if pathname[2] isnt 'thread'
        pathname[2] = 'thread'
        history.replaceState null, '', pathname.slice(0,4).join('/') + location.hash

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

    $.extend Conf,
      'Enabled Mascots':      []
      'Enabled Mascots sfw':  []
      'Enabled Mascots nsfw': []
      'Deleted Mascots':      []
      'Hidden Categories':    ["Custom", "Questionable"]
      'userThemes':           {}
      'userMascots':          {}
      'selectedArchives':     {}
      'CachedTitles':         {}

    $.get Conf, (items) ->
      $.extend Conf, items
      $.asap (-> Favicon.el = $ 'link[rel="shortcut icon"]', d.head), Main.initFeatures

  initFeatures: ->
    # Check if the current board we're on is SFW or not, so we can handle options that need to know that.

    Favicon.el.type = 'image/x-icon'
    {href}          = Favicon.el
    Favicon.SFW     = /ws\.ico$/.test href
    Favicon.default = href
    g.TYPE = if Favicon.SFW then 'sfw' else 'nsfw'

    $.extend Themes,  Conf["userThemes"]
    $.extend Mascots, Conf["userMascots"]

    return if g.BOARD.ID in ['z', 'fk'] then Style.init()

    Main.setThemeString()
    Main.setMascotString()

    switch location.hostname
      when 'a.4cdn.org'
        return
      when '4chan.org', 'www.4chan.org'
        g.TYPE = 'sfw'
        g.VIEW = 'home'
        Main.setThemeString()
        Style.init()
        return
      when 'sys.4chan.org'
        g.VIEW = 'report'
        Style.init()
        Report.init()
        return
      when 'i.4cdn.org'
        $.ready ->
          if Conf['404 Redirect'] and d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found']
            Redirect.init()
            pathname = location.pathname.split '/'
            URL = Redirect.to 'file',
              boardID:  g.BOARD.ID
              filename: pathname[pathname.length - 1]
            location.replace URL if URL
          else if Conf['Loop in New Tab'] and video = $ 'video'
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

  initReady: ->
    if d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found']
      if Conf['404 Redirect'] and g.VIEW is 'thread'
        href = Redirect.to 'thread',
          boardID:  g.BOARD.ID
          threadID: g.THREADID
          postID:   +location.hash.match /\d+/ # post number or 0
        location.replace href or "/#{g.BOARD}/"
      return

    if styleSelector = $.id 'styleSelector'
      passLink = $.el 'a',
        textContent: '4chan Pass'
        href: 'javascript:;'
      $.on passLink, 'click', ->
        window.open '//sys.4chan.org/auth',
          'This will steal your data.'
          'left=0,top=0,width=500,height=255,toolbar=0,resizable=0'
      $.before styleSelector.previousSibling, [$.tn '['; passLink, $.tn ']\u00A0\u00A0']
      # Completely disable the mobile layout
      $('link[href*="mobile"]', d.head).disabled = true

    # Parse HTML or skip it and start building from JSON.
    if !Conf['JSON Navigation'] or g.VIEW is 'thread'
      Main.initThread()

    # JSON Navigation may not load on a page that has flags, so force their CSS to always be available.
    $.add d.head, $.el 'link',
      href: "//s.4cdn.org/css/flags.556.css"
      rel:  "stylesheet"

    $.event '4chanXInitFinished'

    <% if (type === 'userscript') { %>
    if Conf['Show Support Message']
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

      Thread.callbacks.execute threads
      Post.callbacks.execute   posts

    $.get 'previousversion', null, ({previousversion}) ->
      return if previousversion is g.VERSION
      if previousversion
        changelog = '<%= meta.repo %>blob/<%= meta.mainBranch %>/CHANGELOG.md'
        el = $.el 'span',
          innerHTML: "<%= meta.name %> has been updated to <a href='#{changelog}' target=_blank>version #{g.VERSION}</a>."
        new Notice 'info', el, 15
      else
        Settings.open()
      $.set 'previousversion', g.VERSION

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

  setMascotString: ->
    type = "Enabled Mascots"
    if Conf["NSFW/SFW Mascots"]
      type += " #{g.TYPE}"
    g.MASCOTSTRING = type

  setThemeString: ->
    type = "theme"
    if Conf["NSFW/SFW Themes"]
      type += "_#{g.TYPE}"
    g.THEMESTRING = type

  features: [
    ['Style',                     Style]
    ['Mascots',                   MascotTools]
    ['Rice',                      Rice]
    ['Announcements',             GlobalMessage]
    ['Polyfill',                  Polyfill]
    ['Redirect',                  Redirect]
    ['Header',                    Header]
    ['Catalog Links',             CatalogLinks]
    ['Settings',                  Settings]
    ['Index Generator',           Index]
    ['Disable Autoplay',          AntiAutoplay]
    ['Announcement Hiding',       PSAHiding]
    ['Fourchan thingies',         Fourchan]
    ['Color User IDs',            IDColor]
    ['Custom CSS',                CustomCSS]
    ['Linkify',                   Linkify]
    ['Reveal Spoilers',           RemoveSpoilers]
    ['Resurrect Quotes',          Quotify]
    ['Filter',                    Filter]
    ['Reply Hiding Buttons',      PostHiding]
    ['Recursive',                 Recursive]
    ['Strike-through Quotes',     QuoteStrikeThrough]
    ['Quick Reply',               QR]
    ['Menu',                      Menu]
    ['Index Generator (Menu)',    Index.menu]
    ['Report Link',               ReportLink]
    ['Reply Hiding (Menu)',       PostHiding.menu]
    ['Delete Link',               DeleteLink]
    ['Filter (Menu)',             Filter.menu]
    ['Download Link',             DownloadLink]
    ['Archive Link',              ArchiveLink]
    ['Quote Inlining',            QuoteInline]
    ['Quote Previewing',          QuotePreview]
    ['Quote Backlinks',           QuoteBacklink]
    ['Quote Markers',             QuoteMarkers]
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
    ['Show Dice Roll',            Dice]
    ['Banner',                    Banner]
    ['Navigate',                  Navigate]
    ['Flash Features',            Flash]
  ]


Main.init()
