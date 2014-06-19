Main =
  init: ->
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
        else
          'index'
    if g.VIEW is 'thread'
      g.THREADID = +pathname[3]
      if pathname[2] isnt 'thread' or pathname.length > 4
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
    Conf['selectedArchives'] = {}
    Conf['CachedTitles']     = []
    $.get Conf, (items) ->
      $.extend Conf, items
      $.asap (-> doc = d.documentElement), Main.initFeatures

    $.on d, '4chanMainInit', Main.initStyle

  initFeatures: ->
    switch location.hostname
      when 'a.4cdn.org'
        return
      when 'sys.4chan.org'
        Report.init()
        return
      when 'i.4cdn.org'
        $.asap (-> d.readyState isnt 'loading'), ->
          if Conf['404 Redirect'] and d.title in ['4chan - Temporarily Offline', '4chan - 404 Not Found']
            Redirect.init()
            pathname = location.pathname.split '/'
            URL = Redirect.to 'file',
              boardID:  g.BOARD.ID
              filename: pathname[pathname.length - 1]
            location.replace URL if URL
          else if Conf['Loop in New Tab'] and video = $ 'video'
            Video.configure video
            $.on video, 'click', ->
              if !video.controls
                if video.paused then video.play() else video.pause()
        return

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
    $.off d, '4chanMainInit', Main.initStyle
    return if !Main.isThisPageLegit() or $.hasClass doc, 'fourchan-x'
    # disable the mobile layout
    $('link[href*=mobile]', d.head)?.disabled = true
    $.addClass doc, 'fourchan-x', 'seaweedchan', g.VIEW, '<% if (type === 'crx') { %>blink<% } else { %>gecko<% } %>'
    $.addStyle Main.css

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
      if Conf['404 Redirect'] and g.VIEW is 'thread'
        href = Redirect.to 'thread',
          boardID:  g.BOARD.ID
          threadID: g.THREADID
          postID:   +location.hash.match /\d+/ # post number or 0
        location.replace href or "/#{g.BOARD}/"
      return

    # Something might have gone wrong!
    Main.initStyle()

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

    return unless Conf['Show Support Message']
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

      Main.callbackNodes Thread, threads
      Main.callbackNodesDB Post, posts, ->
        $.event '4chanXInitFinished'

    else
      $.event '4chanXInitFinished'

    $.get 'previousversion', null, ({previousversion}) ->
      return if previousversion is g.VERSION
      if previousversion
        el = $.el 'span',
          innerHTML: '<%= meta.name %> has been updated to <a href="<%= meta.repo %>blob/<%= meta.mainBranch %>/CHANGELOG.md" target="_blank">version <%= version %></a>.'
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

  handleErrors: (errors) ->
    unless errors instanceof Array
      error = errors
    else if errors.length is 1
      error = errors[0]
    if error
      new Notice 'error', Main.parseError(error), 15
      return

    div = $.el 'div',
      innerHTML: "#{+errors.length} errors occurred. [<a href='javascript:;'>show</a>]"
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

  css: """
  <%= grunt.file.read('src/General/css/font-awesome.css').replace(/\s+/g, ' ').replace(/\\/g, '\\\\').trim() %>
  <%= grunt.file.read('src/General/css/style.css').replace(/\s+/g, ' ').trim() %>
  <%= grunt.file.read('src/General/css/yotsuba.css').replace(/\s+/g, ' ').trim() %>
  <%= grunt.file.read('src/General/css/yotsuba-b.css').replace(/\s+/g, ' ').trim() %>
  <%= grunt.file.read('src/General/css/futaba.css').replace(/\s+/g, ' ').trim() %>
  <%= grunt.file.read('src/General/css/burichan.css').replace(/\s+/g, ' ').trim() %>
  <%= grunt.file.read('src/General/css/tomorrow.css').replace(/\s+/g, ' ').trim() %>
  <%= grunt.file.read('src/General/css/photon.css').replace(/\s+/g, ' ').trim() %>
  """

  features: [
    ['Polyfill',                  Polyfill]
    ['Redirect',                  Redirect]
    ['Header',                    Header]
    ['Catalog Links',             CatalogLinks]
    ['Settings',                  Settings]
    ['Index Generator',           Index]
    ['Announcement Hiding',       PSAHiding]
    ['Fourchan thingies',         Fourchan]
    ['Emoji',                     Emoji]
    ['Color User IDs',            IDColor]
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
    ['Index Navigation',          Nav]
    ['Keybinds',                  Keybinds]
    ['Show Dice Roll',            Dice]
    ['Banner',                    Banner]
  ]

Main.init()
