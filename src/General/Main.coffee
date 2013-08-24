Main =
  init: ->
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
      'Hidden Categories':    ["Questionable"]
      'userThemes':           {}
      'userMascots':          {}
      'selectedArchives':     {}
      'CachedTitles':         {}

    $.get Conf, (items) ->
      # TempFix for accidental declaration as an array. Remove by 2.4.?
      $.set 'userMascots', items.userMascots = {} if items.userMascots instanceof Array
      $.set 'userThemes',  items.userThemes  = {} if items.userThemes  instanceof Array
      $.extend Conf, items
      <% if (type === 'crx') { %>
      unless items
        new Notice 'error', $.el 'span',
          innerHTML: """
          It seems like your <%= meta.name %> settings became corrupted due to a <a href="https://code.google.com/p/chromium/issues/detail?id=261623" target=_blank>Chrome bug</a>.<br>
          Unfortunately, you'll have to <a href="https://github.com/MayhemYDG/4chan-x/wiki/FAQ#known-problems" target=_blank>fix it yourself</a>.
          """
        # Track resolution of this bug.
        Main.logError
          message: 'Chrome Storage API bug'
          error: new Error '~'
      <% } %>
      Main.initFeatures()

  initFeatures: ->

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
    if ['b', 'd', 'e', 'gif', 'h', 'hc', 'hm', 'hr', 'pol', 'r', 'r9k', 'rs', 's', 's4s', 'soc', 't', 'u', 'y'].contains g.BOARD.ID
      g.TYPE = 'nsfw'
    else
      g.TYPE = 'sfw'

    $.extend Themes,  Conf["userThemes"]
    $.extend Mascots, Conf["userMascots"]

    if Conf["NSFW/SFW Mascots"]
      g.MASCOTSTRING = "Enabled Mascots #{g.TYPE}"
    else
      g.MASCOTSTRING = "Enabled Mascots"

    if Conf["NSFW/SFW Themes"]
      Conf["theme"] = Conf["theme_#{g.TYPE}"]

    return if g.BOARD.ID in ['z', 'fk'] then Style.init()

    switch location.hostname
      when '4chan.org', 'www.4chan.org'
        g.VIEW = 'home'
        Style.init()
        return
      when 'api.4chan.org'
        return
      when 'sys.4chan.org'
        g.VIEW = 'report'
        Style.init()
        Report.init()
        return
      when 'images.4chan.org'
        $.ready ->
          if Conf['404 Redirect'] and ['4chan - Temporarily Offline', '4chan - 404 Not Found'].contains d.title
            Redirect.init()
            pathname = location.pathname.split '/'
            URL = Redirect.to 'file',
              boardID:  g.BOARD.ID
              filename: pathname[pathname.length - 1]
            location.replace URL if URL
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
      'Polyfill':                  Polyfill
      'Emoji':                     Emoji
      'Style':                     Style
      'Mascots':                   MascotTools
      'Rice':                      Rice
      'Banner':                    Banner
      'Announcements':             GlobalMessage
      'Archive Redirection':       Redirect
      'Header':                    Header
      'Catalog Links':             CatalogLinks
      'Settings':                  Settings
      'Announcement Hiding':       PSAHiding
      'Fourchan thingies':         Fourchan
      'Color User IDs':            IDColor
      'Reveal Spoilers':           RemoveSpoilers
      'Custom CSS':                CustomCSS
      'Linkify':                   Linkify
      'Resurrect Quotes':          Quotify
      'Filter':                    Filter
      'Thread Hiding Buttons':     ThreadHiding
      'Reply Hiding Buttons':      PostHiding
      'Recursive':                 Recursive
      'Strike-through Quotes':     QuoteStrikeThrough
      'Quick Reply':               QR
      'Menu':                      Menu
      'Report Link':               ReportLink
      'Thread Hiding (Menu)':      ThreadHiding.menu
      'Reply Hiding (Menu)':       PostHiding.menu
      'Delete Link':               DeleteLink
      'Filter (Menu)':             Filter.menu
      'Download Link':             DownloadLink
      'Archive Link':              ArchiveLink
      'Quote Inlining':            QuoteInline
      'Quote Previewing':          QuotePreview
      'Quote Backlinks':           QuoteBacklink
      'Mark Quotes of You':        QuoteYou
      'Mark OP Quotes':            QuoteOP
      'Mark Cross-thread Quotes':  QuoteCT
      'Anonymize':                 Anonymize
      'Time Formatting':           Time
      'Relative Post Dates':       RelativeDates
      'File Info Formatting':      FileInfo
      'Fappe Tyme':                FappeTyme
      'Gallery':                   Gallery
      'Sauce':                     Sauce
      'Image Expansion':           ImageExpand
      'Image Expansion (Menu)':    ImageExpand.menu
      'Reveal Spoiler Thumbnails': RevealSpoilers
      'Image Loading':             ImageLoader
      'Image Hover':               ImageHover
      'Comment Expansion':         ExpandComment
      'Thread Expansion':          ExpandThread
      'Thread Excerpt':            ThreadExcerpt
      'Favicon':                   Favicon
      'Unread':                    Unread
      'Quote Threading':           QuoteThreading
      'Thread Updater':            ThreadUpdater
      'Thread Stats':              ThreadStats
      'Thread Watcher':            ThreadWatcher
      'Thread Watcher (Menu)':     ThreadWatcher.menu
      'Index Navigation':          Nav
      'Keybinds':                  Keybinds
      'Show Dice Roll':            Dice

    # c.timeEnd 'All initializations'

    $.on d, 'AddCallback', Main.addCallback
    $.ready Main.initReady

  initReady: ->
    if ['4chan - Temporarily Offline', '4chan - 404 Not Found'].contains d.title
      if Conf['404 Redirect'] and g.VIEW is 'thread'
        href = Redirect.to 'thread',
          boardID:  g.BOARD.ID
          threadID: g.THREADID
          postID:   +location.hash.match /\d+/ # post number or 0
        location.replace href or "/#{g.BOARD}/"
      return

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

    try
      localStorage.getItem '4chan-settings'
    catch err
      new Notice 'warning', 'Cookies need to be enabled on 4chan for <%= meta.name %> to properly function.', 30
      Main.disableReports = true

    $.event '4chanXInitFinished'

  callbackNodes: (klass, nodes) ->
    # get the nodes' length only once
    len = nodes.length
    for callback in klass::callbacks
      # c.profile callback.name
      i = 0
      while i < len
        node = nodes[i++]
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
    Main.logError data
    message = $.el 'div',
      textContent: data.message
    error = $.el 'div',
      textContent: data.error
    [message, error]

  errors: []
  logError: (data) ->
    c.error data.message, data.error.stack
    Main.errors.push data

  isThisPageLegit: ->
    # 404 error page or similar.
    unless 'thisPageIsLegit' of Main
      Main.thisPageIsLegit = location.hostname is 'boards.4chan.org' and
        !$('link[href*="favicon-status.ico"]', d.head) and
        d.title not in ['4chan - Temporarily Offline', '4chan - Error', '504 Gateway Time-out']
    Main.thisPageIsLegit

Main.init()
