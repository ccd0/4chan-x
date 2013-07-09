Main =
  init: (items) ->
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
    for db in DataBoards
      Conf[db] = boards: {}
    Conf['selectedArchives'] = {}
    Conf['archives'] = Redirect.archives
    $.get Conf, Main.initFeatures

    $.on d, '4chanMainInit', Main.initStyle

  initFeatures: (items) ->
    Conf = items

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
    initFeature 'Index Navigation',         Nav
    initFeature 'Keybinds',                 Keybinds
    # c.timeEnd 'All initializations'

    $.on d, 'AddCallback', Main.addCallback
    $.ready Main.initReady

  initStyle: ->
    $.off d, '4chanMainInit', Main.initStyle
    return if !Main.isThisPageLegit() or $.hasClass doc, 'fourchan-x'
    # disable the mobile layout
    $('link[href*=mobile]', d.head)?.disabled = true
    <% if (type === 'crx') { %>
    $.addClass doc, 'webkit'
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

    unless $.hasClass doc, 'fourchan-x'
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

    <% if (type === 'userscript') { %>
    el = $.el 'span'
    el.style.flex = 'test'
    if el.style.flex is 'test'
      el.innerHTML = """
      Firefox is not correctly set up and some <%= meta.name %> features will be displayed incorrectly.<br>
      Follow the instructions of the <a href='<%= meta.page %>' target=_blank>install guide</a> to fix it.
      """
      new Notification 'warning', el, 30
    <% } %>

    $.event '4chanXInitFinished'
    Main.checkUpdate()

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

  checkUpdate: ->
    return unless Conf['Check for Updates'] and Main.isThisPageLegit()
    # Check for updates after 7 days since the last update.
    # After that, check for updates every day if we still haven't updated.
    now  = Date.now()
    freq = 7 * $.DAY
    items =
      lastupdate:  0
      lastchecked: 0
    $.get items, (items) ->
      if items.lastupdate > now - freq or items.lastchecked > now - $.DAY
        return
      $.ajax '<%= meta.page %><%= meta.buildsPath %>version', onload: ->
        return unless @status is 200
        version = @response
        return unless /^\d\.\d+\.\d+$/.test version
        if g.VERSION is version
          # Don't check for updates too frequently if there wasn't one in a 'long' time.
          $.set 'lastupdate', now
          return
        $.set 'lastchecked', now
        # dmichnowicz
        # 19 juin 2013 09:39:28
        # innerHTML is not allowed in conjunction with external resources: [...]
        #
        # mayhemydg
        # 19 juin 2013 09:43:14
        # Will it be good if I make sure to match a version number?
        #
        # dmichnowicz
        # 19 juin 2013 09:46:12
        # Yes.
        #
        # mayhemydg
        # 19 juin 2013 13:04:30
        # Well actually there is nothing to fix, the following code makes sure this is a
        # valid version number and precedes the innerHTML part: [see /^\d\.\d+\.\d+$/.test]
        #
        # dmichnowicz
        # 21 juin 2013 04:52:37
        # OK but anyway please remove that line of code.
        el = $.el 'span',
          textContent: "Update: <%= meta.name %> v#{version} is out, get it "
        el.innerHTML += '<a href=<%= meta.page %> target=_blank>here</a>.'
        new Notification 'info', el, 120

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
      {stack} = d.error
      <% if (type === 'userscript') { %>
      # Before:
      # someFn@file:///C:/Users/<USER>/AppData/Roaming/Mozilla/Firefox/Profiles/<garbage>.default/gm_scripts/4chan_X/4chan-X.user.js:line_number
      # someFn@file:///home/<USER>/.mozilla/firefox/<garbage>.default/gm_scripts/4chan_X/4chan-X.user.js:line_number
      # After:
      # someFn@4chan-X.user.js:line_number
      stack = stack.replace /file:\/{3}.+\//g, '' if stack
      <% } %>
      "#{d.message} #{stack}"
    ).join '\n'
    return unless errors
    $.ajax '<%= meta.page %>errors', {},
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
