Main =
  init: (items) ->
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
    # Unflattened Config.
    $.extend Conf,
      'userThemes':           []
      'userMascots':          []
      'Enabled Mascots':      []
      'Enabled Mascots sfw':  []
      'Enabled Mascots nsfw': []
      'Deleted Mascots':      []
      'Hidden Categories':    ["Questionable"]
      'archivers':            {}

    $.get Conf, Main.initFeatures

  initFeatures: (items) ->
    Conf = items

    pathname = location.pathname.split '/'
    g.BOARD  = new Board pathname[1]
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

    # Check if the current board we're on is SFW or not, so we can handle options that need to know that.
    if ['b', 'd', 'e', 'gif', 'h', 'hc', 'hm', 'hr', 'pol', 'r', 'r9k', 'rs', 's', 'soc', 't', 'u', 'y'].contains g.BOARD
      g.TYPE = 'nsfw'

    $.extend Themes,  Conf["userThemes"]
    $.extend Mascots, Conf["userMascots"]

    if Conf["NSFW/SFW Mascots"]
      g.MASCOTSTRING = "Enabled Mascots #{g.TYPE}"
    else
      g.MASCOTSTRING = "Enabled Mascots"

    if Conf["NSFW/SFW Themes"]
      Conf["theme"] = Conf["theme_#{g.TYPE}"]

    switch location.hostname
      when 'api.4chan.org'
        return
      when 'sys.4chan.org'
        Report.init()
        return
      when 'images.4chan.org'
        $.ready ->
          if Conf['404 Redirect'] and d.title is '4chan - 404 Not Found'
            url = Redirect.image pathname[1], pathname[3]
            location.href = url if url
        return

    init = (features) ->
      for name, module of features
        # c.time "#{name} initialization"
        try
          module.init()
        catch err
          Main.handleErrors
            message: "\"#{name}\" initialization crashed."
            error: err
        # finally
        #   c.timeEnd "#{name} initialization"
      return

    # c.time 'All initializations'

    init
      'Polyfill':                 Polyfill
      'Emoji':                    Emoji
      'Style':                    Style
      'Rice':                     Rice
      'Banner':                   Banner
      'Announcements':            GlobalMessage
      'Redirection':              Redirect
      'Header':                   Header
      'Catalog Links':            CatalogLinks
      'Settings':                 Settings
      'Announcement Hiding':      PSAHiding
      'Fourchan thingies':        Fourchan
      'Emoji':                    Emoji
      'Color User IDs':           IDColor
      'Remove Spoilers':          RemoveSpoilers
      'Custom CSS':               CustomCSS
      'Linkify':                  Linkify
      'Resurrect Quotes':         Quotify
      'Filter':                   Filter
      'Thread Hiding Buttons':    ThreadHiding
      'Reply Hiding Buttons':     PostHiding
      'Recursive':                Recursive
      'Strike-through Quotes':    QuoteStrikeThrough
      'Quick Reply':              QR
      'Menu':                     Menu
      'Report Link':              ReportLink
      'Thread Hiding (Menu)':     ThreadHiding.menu
      'Reply Hiding (Menu)':      PostHiding.menu
      'Delete Link':              DeleteLink
      'Filter (Menu)':            Filter.menu
      'Download Link':            DownloadLink
      'Archive Link':             ArchiveLink
      'Quote Inlining':           QuoteInline
      'Quote Previewing':         QuotePreview
      'Quote Backlinks':          QuoteBacklink
      'Mark Quotes of You':       QuoteYou
      'Mark OP Quotes':           QuoteOP
      'Mark Cross-thread Quotes': QuoteCT
      'Anonymize':                Anonymize
      'Time Formatting':          Time
      'Relative Post Dates':      RelativeDates
      'File Info Formatting':     FileInfo
      'Fappe Tyme':               FappeTyme
      'Sauce':                    Sauce
      'Image Expansion':          ImageExpand
      'Image Expansion (Menu)':   ImageExpand.menu
      'Reveal Spoilers':          RevealSpoilers
      'Image Replace':            ImageReplace
      'Image Hover':              ImageHover
      'Fappe Tyme':               FappeTyme
      'Comment Expansion':        ExpandComment
      'Thread Expansion':         ExpandThread
      'Thread Excerpt':           ThreadExcerpt
      'Favicon':                  Favicon
      'Unread':                   Unread
      'Quote Threading':          QuoteThreading
      'Thread Updater':           ThreadUpdater
      'Thread Stats':             ThreadStats
      'Thread Watcher':           ThreadWatcher
      'Index Navigation':         Nav
      'Keybinds':                 Keybinds

    # c.timeEnd 'All initializations'

    $.on d, 'AddCallback', Main.addCallback
    $.ready Main.initReady

  initReady: ->
    if d.title is '4chan - 404 Not Found'
      if Conf['404 Redirect'] and g.VIEW is 'thread'
        href = Redirect.to
          boardID:  g.BOARD.ID
          threadID: g.THREADID
          postID:   +location.hash.match /\d+/ # post number or 0
        location.href = href or "/#{g.BOARD}/"
      return

    if board = $ '.board'
      threads = []
      posts   = []

      for boardChild in board.children
        continue unless $.hasClass boardChild, 'thread'
        thread = new Thread boardChild.id[1..], g.BOARD
        threads.push thread
        for threadChild in boardChild.children
          continue unless $.hasClass threadChild, 'postContainer'
          try
            posts.push new Post threadChild, thread, g.BOARD
          catch err
            # Skip posts that we failed to parse.
            unless errors
              errors = []
            errors.push
              message: "Parsing of Post No.#{threadChild.id.match(/\d+/)} failed. Post will be skipped."
              error: err
      Main.handleErrors errors if errors

      Main.callbackNodes Thread, threads
      Main.callbackNodesDB Post, posts, ->
        $.event '4chanXInitFinished'
        Main.checkUpdate()

      return

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

  callbackNodesDB: (klass, nodes, cb) ->
    queue = []
    softTask =  ->
      task = queue.shift()
      func = task[0]
      args = Array::slice.call task, 1
      func.apply func, args
      return unless queue.length
      if (queue.length % 7) is 0
        setTimeout softTask, 0
      else
        softTask()

    # get the nodes' length only once
    len    = nodes.length
    i      = 0
    errors = null

    func = (node, i) ->
      for callback in klass::callbacks
        try
          callback.cb.call node
        catch err
          unless errors
            errors = []
          errors.push
            message: "\"#{callback.name}\" crashed on #{klass.name} No.#{node} (/#{node.board}/)."
            error: err
      # finish
      if i is len
        Main.handleErrors errors if errors
        cb() if cb

    while i < len
      node = nodes[i]
      queue.push [func, node, ++i]

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
    Klass::callbacks.push obj.callback

  checkUpdate: ->
    return unless Conf['Check for Updates'] and Main.isThisPageLegit()
    # Check for updates after:
    #  - 6 hours since the last update on Opera because it lacks auto-updating.
    #  - 7 days since the last update on Chrome/Firefox.
    # After that, check for updates every day if we still haven't updated.
    now  = Date.now()
    freq = <% if (type === 'userjs') { %>6 * $.HOUR<% } else { %>7 * $.DAY<% } %>
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
        el = $.el 'span',
          innerHTML: "Update: <%= meta.name %> v#{version} is out, get it <a href=<%= meta.page %> target=_blank>here</a>."
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
    errors = Main.errors.map (d) -> d.message + ' ' + d.error.stack
    $.ajax '<%= meta.page %>errors', {},
      sync: true
      form: $.formData
        n: "<%= meta.name %> v#{g.VERSION}"
        t: '<%= type %>'
        ua:  window.navigator.userAgent
        url: window.location.href
        e: errors.join '\n'

  isThisPageLegit: ->
    # 404 error page or similar.
    unless 'thisPageIsLegit' of Main
      Main.thisPageIsLegit = location.hostname is 'boards.4chan.org' and
        !$('link[href*="favicon-status.ico"]', d.head) and
        d.title not in ['4chan - Temporarily Offline', '4chan - Error']
    Main.thisPageIsLegit

Main.init()
