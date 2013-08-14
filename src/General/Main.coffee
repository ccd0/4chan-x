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
    Conf['archives'] = Redirect.archives
    $.get Conf, (items) ->
      $.extend Conf, items
      <% if (type === 'crx') { %>
      unless items
        new Notification 'error', $.el 'span',
          innerHTML: """
          It seems like your <%= meta.name %> settings became corrupted due to a <a href="https://code.google.com/p/chromium/issues/detail?id=261623" target=_blank>Chrome bug</a>.<br>
          Unfortunately, you'll have to <a href="https://github.com/MayhemYDG/4chan-x/wiki/FAQ#known-problems" target=_blank>fix it yourself</a>.
          """
        # Track resolution of this bug.
        Main.logError
          message: 'Chrome Storage API bug'
          error: new Error chrome.runtime.lastError.message or 'no lastError.message'
      <% } %>
      Main.initFeatures()

    $.on d, '4chanMainInit', Main.initStyle

  initFeatures: ->
    switch location.hostname
      when 'api.4chan.org'
        return
      when 'sys.4chan.org'
        Report.init()
        return
      when 'images.4chan.org'
        $.ready ->
          if Conf['404 Redirect'] and d.title is '4chan - 404 Not Found'
            Redirect.init()
            pathname = location.pathname.split '/'
            URL = Redirect.to 'file',
              boardID:  g.BOARD.ID
              filename: pathname[pathname.length - 1]
            location.replace URL if URL
        return

    initFeature = (name, module) ->
      # c.time "#{name} initialization"
      try
        module.init()
      catch err
        Main.handleErrors
          message: "\"#{name}\" initialization crashed."
          error: err
      # finally
      #   c.timeEnd "#{name} initialization"

    # c.time 'All initializations'
    initFeature 'Polyfill',                 Polyfill
    initFeature 'Header',                   Header
    initFeature 'Settings',                 Settings
    initFeature 'Announcement Hiding',      PSAHiding
    initFeature 'Fourchan thingies',        Fourchan
    initFeature 'Custom CSS',               CustomCSS
    initFeature 'Redirect',                 Redirect
    initFeature 'Resurrect Quotes',         Quotify
    initFeature 'Filter',                   Filter
    initFeature 'Thread Hiding',            ThreadHiding
    initFeature 'Reply Hiding',             PostHiding
    initFeature 'Recursive',                Recursive
    initFeature 'Strike-through Quotes',    QuoteStrikeThrough
    initFeature 'Quick Reply',              QR
    initFeature 'Menu',                     Menu
    initFeature 'Report Link',              ReportLink
    initFeature 'Thread Hiding (Menu)',     ThreadHiding.menu
    initFeature 'Reply Hiding (Menu)',      PostHiding.menu
    initFeature 'Delete Link',              DeleteLink
    initFeature 'Filter (Menu)',            Filter.menu
    initFeature 'Download Link',            DownloadLink
    initFeature 'Archive Link',             ArchiveLink
    initFeature 'Quote Inlining',           QuoteInline
    initFeature 'Quote Previewing',         QuotePreview
    initFeature 'Quote Backlinks',          QuoteBacklink
    initFeature 'Mark Quotes of You',       QuoteYou
    initFeature 'Mark OP Quotes',           QuoteOP
    initFeature 'Mark Cross-thread Quotes', QuoteCT
    initFeature 'Anonymize',                Anonymize
    initFeature 'Time Formatting',          Time
    initFeature 'Relative Post Dates',      RelativeDates
    initFeature 'File Info Formatting',     FileInfo
    initFeature 'Sauce',                    Sauce
    initFeature 'Image Expansion',          ImageExpand
    initFeature 'Image Expansion (Menu)',   ImageExpand.menu
    initFeature 'Reveal Spoilers',          RevealSpoilers
    initFeature 'Auto-GIF',                 AutoGIF
    initFeature 'Image Hover',              ImageHover
    initFeature 'Comment Expansion',        ExpandComment
    initFeature 'Thread Expansion',         ExpandThread
    initFeature 'Thread Excerpt',           ThreadExcerpt
    initFeature 'Favicon',                  Favicon
    initFeature 'Unread',                   Unread
    initFeature 'Thread Stats',             ThreadStats
    initFeature 'Thread Updater',           ThreadUpdater
    initFeature 'Thread Watcher',           ThreadWatcher
    initFeature 'Thread Watcher (Menu)',    ThreadWatcher.menu
    initFeature 'Index Navigation',         Nav
    initFeature 'Keybinds',                 Keybinds
    initFeature 'Show Dice Roll',           Dice
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
    if d.title is '4chan - 404 Not Found'
      if Conf['404 Redirect'] and g.VIEW is 'thread'
        href = Redirect.to 'thread',
          boardID:  g.BOARD.ID
          threadID: g.THREADID
          postID:   +location.hash.match /\d+/ # post number or 0
        location.replace href or "/#{g.BOARD}/"
      return

    # Something might have gone wrong!
    Main.initStyle()

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
      Main.callbackNodes Post, posts

    if $.hasClass d.body, 'fourchan_x'
      Main.v2Detected = true
      alert '4chan X v2 detected: Disable it or v3 will break.'

    try
      localStorage.getItem '4chan-settings'
    catch err
      new Notification 'warning', 'Cookies need to be enabled on 4chan for <%= meta.name %> to properly function.', 30

    $.event '4chanXInitFinished'

  callbackNodes: (klass, nodes) ->
    # get the nodes' length only once
    len = nodes.length
    for callback in klass::callbacks
      # c.profile callback.name
      for i in [0...len]
        node = nodes[i]
        try
          callback.cb.call node
        catch err
          unless errors
            errors = []
          errors.push
            message: "\"#{callback.name}\" crashed on #{klass.name} No.#{node} (/#{node.board}/)."
            error: err
      # c.profileEnd callback.name
    Main.handleErrors errors if errors

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
    Klass::callbacks.push obj.callback

  handleErrors: (errors) ->
    unless errors instanceof Array
      error = errors
    else if errors.length is 1
      error = errors[0]
    if error
      new Notification 'error', Main.parseError(error), 15
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

    new Notification 'error', [div, logs], 30

  parseError: (data) ->
    Main.logError data
    message = $.el 'div',
      textContent: data.message
    error = $.el 'div',
      textContent: data.error
    [message, error]

  errors: []
  logError: (data) ->
    unless Main.errors.length
      $.on window, 'unload', Main.postErrors
    c.error data.message, data.error.stack
    Main.errors.push data

  postErrors: ->
    return if Main.v2Detected
    errors = Main.errors.filter((d) -> !!d.error.stack).map((d) ->
      <% if (type === 'userscript') { %>
      # Before:
      # someFn@file:///C:/Users/<USER>/AppData/Roaming/Mozilla/Firefox/Profiles/<garbage>.default/gm_scripts/4chan_X/4chan-X.user.js:line_number
      # someFn@file:///home/<USER>/.mozilla/firefox/<garbage>.default/gm_scripts/4chan_X/4chan-X.user.js:line_number
      # After:
      # someFn@4chan-X.user.js:line_number
      {name, message, stack} = d.error
      stack = stack.replace /file:\/{3}.+\//g, ''
      "#{d.message} #{name}: #{message} #{stack}"
      <% } else { %>
      "#{d.message} #{d.error.stack}"
      <% } %>
    ).join '\n'
    return unless errors
    $.ajax '<%= meta.page %>errors', null,
      sync: true
      form: $.formData
        n: "<%= meta.name %> v#{g.VERSION}"
        t: '<%= type %>'
        ua:  window.navigator.userAgent
        url: window.location.href
        e: errors

  isThisPageLegit: ->
    # 404 error page or similar.
    unless 'thisPageIsLegit' of Main
      Main.thisPageIsLegit = location.hostname is 'boards.4chan.org' and
        !$('link[href*="favicon-status.ico"]', d.head) and
        d.title not in ['4chan - Temporarily Offline', '4chan - Error', '504 Gateway Time-out']
    Main.thisPageIsLegit

  css: """
  <%= grunt.file.read('css/style.css') %>
  <%= grunt.file.read('css/yotsuba.css') %>
  <%= grunt.file.read('css/yotsuba-b.css') %>
  <%= grunt.file.read('css/futaba.css') %>
  <%= grunt.file.read('css/burichan.css') %>
  <%= grunt.file.read('css/tomorrow.css') %>
  <%= grunt.file.read('css/photon.css') %>
  """

Main.init()
