Main =
  init: ->
    g.threads = new SimpleDict
    g.posts   = new SimpleDict

    pathname = location.pathname.split '/'
    g.BOARD  = new Board pathname[1]
    return if g.BOARD.ID in ['z', 'fk']
    g.VIEW   =
      switch pathname[2]
        when 'res'
          'thread'
        when 'catalog'
          'catalog'
        else
          'index'
    if g.VIEW is 'catalog'
      $.ready Index.addCatalogSwitch
      return
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
      when '4chan.org', 'www.4chan.org'
        g.VIEW = 'home'
        Style.init()
        return
      when 'a.4cdn.org'
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
        return

    # c.time 'All initializations'
    init = (name, feature) ->
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

    init 'Emoji',                     Emoji
    init 'Style',                     Style
    init 'Mascots',                   MascotTools
    init 'Rice',                      Rice
    init 'Announcements',             GlobalMessage
    init 'Polyfill',                  Polyfill
    init 'Redirect',                  Redirect
    init 'Header',                    Header
    init 'Catalog Links',             CatalogLinks
    init 'Settings',                  Settings
    init 'Index Generator',           Index
    init 'Announcement Hiding',       PSAHiding
    init 'Fourchan thingies',         Fourchan
    init 'Emoji',                     Emoji
    init 'Color User IDs',            IDColor
    init 'Custom CSS',                CustomCSS
    init 'Linkify',                   Linkify
    init 'Reveal Spoilers',           RemoveSpoilers
    init 'Resurrect Quotes',          Quotify
    init 'Filter',                    Filter
    init 'Reply Hiding Buttons',      PostHiding
    init 'Recursive',                 Recursive
    init 'Strike-through Quotes',     QuoteStrikeThrough
    init 'Quick Reply',               QR
    init 'Menu',                      Menu
    init 'Report Link',               ReportLink
    init 'Reply Hiding (Menu)',       PostHiding.menu
    init 'Delete Link',               DeleteLink
    init 'Filter (Menu)',             Filter.menu
    init 'Download Link',             DownloadLink
    init 'Archive Link',              ArchiveLink
    init 'Quote Inlining',            QuoteInline
    init 'Quote Previewing',          QuotePreview
    init 'Quote Backlinks',           QuoteBacklink
    init 'Quote Markers',             QuoteMarkers
    init 'Anonymize',                 Anonymize
    init 'Time Formatting',           Time
    init 'Relative Post Dates',       RelativeDates
    init 'File Info Formatting',      FileInfo
    init 'Fappe Tyme',                FappeTyme
    init 'Gallery',                   Gallery
    init 'Gallery (menu)',            Gallery.menu
    init 'Sauce',                     Sauce
    init 'Image Expansion',           ImageExpand
    init 'Image Expansion (Menu)',    ImageExpand.menu
    init 'Reveal Spoiler Thumbnails', RevealSpoilers
    init 'Image Loading',             ImageLoader
    init 'Image Hover',               ImageHover
    init 'Thread Expansion',          ExpandThread
    init 'Comment Expansion',         ExpandComment
    init 'Thread Excerpt',            ThreadExcerpt
    init 'Favicon',                   Favicon
    init 'Unread',                    Unread
    init 'Quote Threading',           QuoteThreading
    init 'Thread Stats',              ThreadStats
    init 'Thread Updater',            ThreadUpdater
    init 'Thread Watcher',            ThreadWatcher
    init 'Thread Watcher (Menu)',     ThreadWatcher.menu
    init 'Index Navigation',          Nav
    init 'Keybinds',                  Keybinds
    init 'Show Dice Roll',            Dice
    init 'Banner',                    Banner
    init 'Navigate',                  Navigate
    init 'Flash Features',            Flash

    $.on d, 'AddCallback', Main.addCallback
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

    # Parse HTML or skip it and start building from JSON.
    unless Conf['JSON Navigation'] and g.VIEW is 'index'
      Main.initThread()
    else
      $.event '4chanXInitFinished'

    <% if (type === 'userscript') { %>
    test = $.el 'span'
    test.classList.add 'a', 'b'
    if test.className isnt 'a b'
      new Notice 'warning', "Your version of Firefox is outdated (v<%= meta.min.firefox %> minimum) and <%= meta.name %> may not operate correctly.", 30

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

      Main.callbackNodes Thread, threads
      Main.callbackNodesDB Post, posts, ->
        $.event '4chanXInitFinished'

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

  addCallback: (e) ->
    obj = e.detail
    unless typeof obj.callback.name is 'string'
      throw new Error "Invalid callback name: #{obj.callback.name}"
    switch obj.type
      when 'Post'
        Klass = Post
      when 'Thread'
        Klass = Thread
      else
        return
    obj.callback.isAddon = true
    Klass.callbacks.push obj.callback

  handleErrors: (errors) ->
    unless errors instanceof Array
      error = errors
    else if errors.length is 1
      error = errors[0]
    if error
      new Notice 'error', Main.parseError(error), 15
      return

    div = $.el 'div',
      innerHTML: "#{errors.length} errors occurred. [<a href=javascript:;>show</a>]"
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
      textContent: data.error
    [message, error]

  isThisPageLegit: ->
    # 404 error page or similar.
    unless 'thisPageIsLegit' of Main
      Main.thisPageIsLegit = location.hostname is 'boards.4chan.org' and
        !$('link[href*="favicon-status.ico"]', d.head) and
        d.title not in ['4chan - Temporarily Offline', '4chan - Error', '504 Gateway Time-out']
    Main.thisPageIsLegit

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

Main.init()
