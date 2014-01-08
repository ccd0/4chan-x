Main =
  init: ->
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
    Conf['CachedTitles']     = []
    $.get Conf, (items) ->
      $.extend Conf, items
      Main.initFeatures()

    $.on d, '4chanMainInit', Main.initStyle

  initFeatures: ->
    switch location.hostname
      when 'a.4cdn.org'
        return
      when 'sys.4chan.org'
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
    for name, module of Main.features
      # c.time "#{name} initialization"
      try
        module.init()
      catch err
        Main.handleErrors
          message: "\"#{name}\" initialization crashed."
          error: err
      # finally
      #   c.timeEnd "#{name} initialization"
    # c.timeEnd 'All initializations'

    $.on d, 'AddCallback', Main.addCallback
    $.ready Main.initReady

  initStyle: ->
    $.off d, '4chanMainInit', Main.initStyle
    return if !Main.isThisPageLegit() or $.hasClass doc, 'fourchan-x'
    # disable the mobile layout
    $('link[href*=mobile]', d.head)?.disabled = true
    <% if (type === 'crx') { %>
    $.addClass doc, 'blink'
    <% } else { %>
    $.addClass doc, 'gecko'
    <% } %>
    $.addClass doc, 'fourchan-x'
    $.addClass doc, 'seaweedchan'
    $.addClass doc, g.VIEW
    $.addStyle Main.css

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

    if g.VIEW is 'thread' and threadRoot = $ '.thread'
      thread = new Thread +threadRoot.id[1..], g.BOARD
      posts  = []
      for postRoot in $$ '.thread > .postContainer', threadRoot
        try
          posts.push post = new Post postRoot, thread, g.BOARD, {isOriginalMarkup: true}
        catch err
          # Skip posts that we failed to parse.
          errors = [] unless errors
          errors.push
            message: "Parsing of Post No.#{postRoot.id.match /\d+/} failed. Post will be skipped."
            error: err
      Main.handleErrors errors if errors

      Main.callbackNodes Thread, [thread]
      Main.callbackNodesDB Post, posts, ->
        $.event '4chanXInitFinished'

      if styleSelector = $.id 'styleSelector'
        passLink = $.el 'a',
          textContent: '4chan Pass'
          href: 'javascript:;'
        $.on passLink, 'click', ->
          window.open '//sys.4chan.org/auth',
            'This will steal your data.'
            'left=0,top=0,width=500,height=255,toolbar=0,resizable=0'
        $.before styleSelector.previousSibling, [$.tn '['; passLink, $.tn ']\u00A0\u00A0']

      return

    <% if (type === 'userscript') { %>
    GMver = GM_info.version.split '.'
    for v, i in "<%= meta.min.greasemonkey %>".split '.'
      break if v < GMver[i]
      continue if v is GMver[i]
      new Notice 'warning', "Your version of Greasemonkey is outdated (v#{GM_info.version} instead of v<%= meta.min.greasemonkey %> minimum) and <%= meta.name %> may not operate correctly.", 30
      break
    <% } %>

    try
      localStorage.getItem '4chan-settings'
    catch err
      new Notice 'warning', 'Cookies need to be enabled on 4chan for <%= meta.name %> to operate properly.', 30

  callbackNodes: (klass, nodes) ->
    i = 0
    cb = klass.callbacks
    while node = nodes[i++]
      cb.execute node
    return

  callbackNodesDB: (klass, nodes, cb) ->
    errors = null
    len    = 0
    i      = 0

    {callbacks} = klass

    softTask = ->
      node = nodes[i++]
      callbacks.execute node
      return cb() if len is i and cb
      unless i % 7
        setTimeout softTask, 0
      else
        softTask()

    len = nodes.length
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
    
  features:
    'Polyfill': Polyfill
    'Redirect': Redirect
    'Header': Header
    'Catalog Links': CatalogLinks
    'Settings': Settings
    'Index Generator': Index
    'Announcement Hiding': PSAHiding
    'Fourchan thingies': Fourchan
    'Emoji': Emoji
    'Color User IDs': IDColor
    'Custom CSS': CustomCSS
    'Linkify': Linkify
    'Reveal Spoilers': RemoveSpoilers
    'Resurrect Quotes': Quotify
    'Filter': Filter
    'Thread Hiding Buttons': ThreadHiding
    'Reply Hiding Buttons': PostHiding
    'Recursive': Recursive
    'Strike-through Quotes': QuoteStrikeThrough
    'Quick Reply': QR
    'Menu': Menu
    'Report Link': ReportLink
    'Thread Hiding (Menu)': ThreadHiding.menu
    'Reply Hiding (Menu)': PostHiding.menu
    'Delete Link': DeleteLink
    'Filter (Menu)': Filter.menu
    'Download Link': DownloadLink
    'Archive Link': ArchiveLink
    'Quote Inlining': QuoteInline
    'Quote Previewing': QuotePreview
    'Quote Backlinks': QuoteBacklink
    'Mark Quotes of You': QuoteYou
    'Mark OP Quotes': QuoteOP
    'Mark Cross-thread Quotes': QuoteCT
    'Anonymize': Anonymize
    'Time Formatting': Time
    'Relative Post Dates': RelativeDates
    'File Info Formatting': FileInfo
    'Fappe Tyme': FappeTyme
    'Gallery': Gallery
    'Gallery (menu)': Gallery.menu
    'Sauce': Sauce
    'Image Expansion': ImageExpand
    'Image Expansion (Menu)': ImageExpand.menu
    'Reveal Spoiler Thumbnails': RevealSpoilers
    'Image Loading': ImageLoader
    'Image Hover': ImageHover
    'Thread Expansion': ExpandThread
    'Thread Excerpt': ThreadExcerpt
    'Favicon': Favicon
    'Unread': Unread
    'Quote Threading': QuoteThreading
    'Thread Stats': ThreadStats
    'Thread Updater': ThreadUpdater
    'Thread Watcher': ThreadWatcher
    'Thread Watcher (Menu)': ThreadWatcher.menu
    'Index Navigation': Nav
    'Keybinds': Keybinds
    'Show Dice Roll': Dice
    'Banner': Banner
    
  clean: ->
    {posts, threads} = g
    delete posts[id]   for id of posts   when posts.hasOwnProperty   id
    delete threads[id] for id of threads when threads.hasOwnProperty id

  disconnect: ->
    # Disconnect active features that _can_ be disconnected
    feature.disconnect() for name, feature of Main.features when feature.disconnect

    # Clean Post and Thread callbacks
    Post.callbacks.clear()
    Thread.callbacks.clear()

    # Clean the board, as we'll be dumping shit here
    $.rmAll $ '.board'

  navigate: (e) ->
    return unless @hostname is 'boards.4chan.org'
    # Lets have a good idea of what we should we should be expecting for this kind of feature
    [_, boardID, view, threadID] = @pathname.split '/'

    return if view is 'catalog'
    e.preventDefault()

    if threadID
      view = 'thread'
    else
      view = view or 'index'

    # Moving from thread to thread or index to index.
    if view is g.VIEW
      if view is 'index'
        if boardID is g.BOARD.ID
          return Index.update()
        Main.clean()
        Main.updateBoard boardID
        Index.update()
        
      else
        Main.refresh {boardID, view, threadID}

    else
      Main.disconnect()

  updateBoard: (boardID) ->
    g.BOARD = new Board boardID

    req = null

    onload = (e) ->
      if e.type is 'abort'
        req.onloadend = null
        return

      try
        return unless req.status is 200

        o = JSON.parse req.response
        for board in o.boards
          if board.board is boardID
            break

        Main.updateTitle board

      catch err
        Main.handleErrors [
          message: "Index Failure."
          error: err
        ]

    req = $.ajax '//a.4cdn.org/boards.json',
      onabort:   onload
      onloadend: onload

  updateTitle: (board) ->
    $.rm subtitle if subtitle = $ '.boardSubtitle'
    $('.boardTitle').innerHTML = d.title = "/#{board.board}/ - #{board.title}"

  refresh: (context) ->
    {boardID, view, threadID} = context

    if view is 'thread'
      # Refresh thread features
      Main.features[name].thread() for name of Main.features
    else
      # Refresh index features
      Main.features[name].index()  for name of Main.features

Main.init()
