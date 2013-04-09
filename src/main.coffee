class Board
  toString: -> @ID

  constructor: (@ID) ->
    @threads = {}
    @posts   = {}

    g.boards[@] = @

class Thread
  callbacks: []
  toString: -> @ID

  constructor: (ID, @board) ->
    @ID     = +ID
    @fullID = "#{@board}.#{@ID}"
    @posts  = {}

    g.threads[@fullID] = board.threads[@] = @

  kill: ->
    @isDead = true
    @timeOfDeath = Date.now()

class Post
  callbacks: []
  toString: -> @ID

  constructor: (root, @thread, @board, that={}) ->
    @ID     = +root.id[2..]
    @fullID = "#{@board}.#{@ID}"

    post = $ '.post',     root
    info = $ '.postInfo', post
    @nodes =
      root: root
      post: post
      info: info
      comment: $ '.postMessage', post
      quotelinks: []
      backlinks: info.getElementsByClassName 'backlink'

    @info = {}
    if subject        = $ '.subject',      info
      @nodes.subject  = subject
      @info.subject   = subject.textContent
    if name           = $ '.name',         info
      @nodes.name     = name
      @info.name      = name.textContent
    if email          = $ '.useremail',    info
      @nodes.email    = email
      @info.email     = decodeURIComponent email.href[7..]
    if tripcode       = $ '.postertrip',   info
      @nodes.tripcode = tripcode
      @info.tripcode  = tripcode.textContent
    if uniqueID       = $ '.posteruid',    info
      @nodes.uniqueID = uniqueID
      @info.uniqueID  = uniqueID.firstElementChild.textContent
    if capcode        = $ '.capcode.hand', info
      @nodes.capcode  = capcode
      @info.capcode   = capcode.textContent.replace '## ', ''
    if flag           = $ '.countryFlag',  info
      @nodes.flag     = flag
      @info.flag      = flag.title
    if date           = $ '.dateTime',     info
      @nodes.date     = date
      @info.date      = new Date date.dataset.utc * 1000
    if Conf['Quick Reply']
      @info.yours     = QR.db.get
        boardID:  @board
        threadID: @thread
        postID:   @ID


    @parseComment()
    @parseQuotes()

    if (file = $ '.file', post) and thumb = $ 'img[data-md5]', file
      # Supports JPG/PNG/GIF/PDF.
      # Flash files are not supported.
      alt      = thumb.alt
      anchor   = thumb.parentNode
      fileInfo = file.firstElementChild
      @file    =
        info:  fileInfo
        text:  fileInfo.firstElementChild
        thumb: thumb
        URL:   anchor.href
        size:  alt.match(/[\d.]+\s\w+/)[0]
        MD5:   thumb.dataset.md5
        isSpoiler: $.hasClass anchor, 'imgspoiler'
      size  = +@file.size.match(/[\d.]+/)[0]
      unit  = ['B', 'KB', 'MB', 'GB'].indexOf @file.size.match(/\w+$/)[0]
      size *= 1024 while unit-- > 0
      @file.sizeInBytes = size
      @file.thumbURL =
        if that.isArchived
          thumb.src
        else
          "#{location.protocol}//thumbs.4chan.org/#{board}/thumb/#{@file.URL.match(/(\d+)\./)[1]}s.jpg"
      # replace %22 with quotes, see:
      # crbug.com/81193
      # webk.it/62107
      # https://www.w3.org/Bugs/Public/show_bug.cgi?id=16909
      # http://www.whatwg.org/specs/web-apps/current-work/#multipart-form-data
      @file.name = $('span[title]', fileInfo).title.replace /%22/g, '"'
      if @file.isImage = /(jpg|png|gif)$/i.test @file.name
        @file.dimensions = @file.text.textContent.match(/\d+x\d+/)[0]

    unless @isReply = $.hasClass post, 'reply'
      @thread.OP = @
      @thread.isSticky = !!$ '.stickyIcon', @nodes.info
      @thread.isClosed = !!$ '.closedIcon', @nodes.info

    @clones = []
    g.posts[@fullID] = thread.posts[@] = board.posts[@] = @
    @kill() if that.isArchived

  parseComment: ->
    # Get the comment's text.
    # <br> -> \n
    # Remove:
    #   'Comment too long'...
    #   Admin/Mod/Dev replies. (/q/)
    #   EXIF data. (/p/)
    #   Rolls. (/tg/)
    #   Preceding and following new lines.
    #   Trailing spaces.
    bq = @nodes.comment.cloneNode true
    for node in $$ '.abbr, .capcodeReplies, .exif, b', bq
      $.rm node
    text = []
    # XPathResult.ORDERED_NODE_SNAPSHOT_TYPE === 7
    nodes = d.evaluate './/br|.//text()', bq, null, 7, null
    for i in [0...nodes.snapshotLength]
      text.push if data = nodes.snapshotItem(i).data then data else '\n'
    @info.comment = text.join('').trim().replace /\s+$/gm, ''

  parseQuotes: ->
    quotes = {}
    for quotelink in $$ '.quotelink', @nodes.comment
      # Don't add board links. (>>>/b/)
      hash = quotelink.hash
      continue unless hash

      # Don't add catalog links. (>>>/b/catalog or >>>/b/search)
      pathname = quotelink.pathname
      continue if /catalog$/.test pathname

      # Don't add rules links. (>>>/a/rules)
      # Don't add text-board quotelinks. (>>>/img/1234)
      continue if quotelink.hostname isnt 'boards.4chan.org'

      @nodes.quotelinks.push quotelink

      # Don't count capcode replies as quotes. (Admin/Mod/Dev Replies: ...)
      continue if quotelink.parentNode.parentNode.className is 'capcodeReplies'

      # Basically, only add quotes that link to posts on an imageboard.
      quotes["#{pathname.split('/')[1]}.#{hash[2..]}"] = true
    return if @isClone
    @quotes = Object.keys quotes

  kill: (file, now) ->
    now or= new Date()
    if file
      return if @file.isDead
      @file.isDead = true
      @file.timeOfDeath = now
      $.addClass @nodes.root, 'deleted-file'
    else
      return if @isDead
      @isDead = true
      @timeOfDeath = now
      $.addClass @nodes.root, 'deleted-post'

    unless strong = $ 'strong.warning', @nodes.info
      strong = $.el 'strong',
          className: 'warning'
          textContent: '[Deleted]'
      $.after $('input', @nodes.info), strong
    strong.textContent = if file then '[File deleted]' else '[Deleted]'

    return if @isClone
    for clone in @clones
      clone.kill file, now

    return if file
    # Get quotelinks/backlinks to this post
    # and paint them (Dead).
    for quotelink in Get.allQuotelinksLinkingTo @
      continue if $.hasClass quotelink, 'deadlink'
      $.add quotelink, $.tn '\u00A0(Dead)'
      $.addClass quotelink, 'deadlink'
    return
  # XXX tmp fix for 4chan's racing condition
  # giving us false-positive dead posts.
  resurrect: ->
    delete @isDead
    delete @timeOfDeath
    $.rmClass @nodes.root, 'deleted-post'
    strong = $ 'strong.warning', @nodes.info
    # no false-positive files
    if @file and @file.isDead
      strong.textContent = '[File deleted]'
    else
      $.rm strong

    return if @isClone
    for clone in @clones
      clone.resurrect()

    for quotelink in Get.allQuotelinksLinkingTo @
      if $.hasClass quotelink, 'deadlink'
        quotelink.textContent = quotelink.textContent.replace '\u00A0(Dead)', ''
        $.rmClass quotelink, 'deadlink'
    return
  addClone: (context) ->
    new Clone @, context
  rmClone: (index) ->
    @clones.splice index, 1
    for clone in @clones[index..]
      clone.nodes.root.setAttribute 'data-clone', index++
    return

class Clone extends Post
  constructor: (@origin, @context) ->
    for key in ['ID', 'fullID', 'board', 'thread', 'info', 'quotes', 'isReply']
      # Copy or point to the origin's key value.
      @[key] = origin[key]

    {nodes} = origin
    root = nodes.root.cloneNode true
    post = $ '.post',     root
    info = $ '.postInfo', post
    @nodes =
      root: root
      post: post
      info: info
      comment: $ '.postMessage', post
      quotelinks: []
      backlinks: info.getElementsByClassName 'backlink'

    # Remove inlined posts inside of this post.
    for inline  in $$ '.inline',  post
      $.rm inline
    for inlined in $$ '.inlined', post
      $.rmClass inlined, 'inlined'

    root.hidden = false # post hiding
    $.rmClass root, 'forwarded' # quote inlining
    $.rmClass post, 'highlight' # keybind navigation, ID highlighting

    if nodes.subject
      @nodes.subject  = $ '.subject',     info
    if nodes.name
      @nodes.name     = $ '.name',        info
    if nodes.email
      @nodes.email    = $ '.useremail',   info
    if nodes.tripcode
      @nodes.tripcode = $ '.postertrip',  info
    if nodes.uniqueID
      @nodes.uniqueID = $ '.posteruid',   info
    if nodes.capcode
      @nodes.capcode  = $ '.capcode',     info
    if nodes.flag
      @nodes.flag     = $ '.countryFlag', info
    if nodes.date
      @nodes.date     = $ '.dateTime',    info

    @parseQuotes()

    if origin.file
      # Copy values, point to relevant elements.
      # See comments in Post's constructor.
      @file = {}
      for key, val of origin.file
        @file[key] = val
      file = $ '.file', post
      @file.info  = file.firstElementChild
      @file.text  = @file.info.firstElementChild
      @file.thumb = $ 'img[data-md5]', file
      @file.fullImage = $ '.full-image', file

    @isDead  = true if origin.isDead
    @isClone = true
    index = origin.clones.push(@) - 1
    root.setAttribute 'data-clone', index


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
    $.get Conf, Main.initFeatures

    $.on d, '4chanMainInit', Main.initStyle

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

    $.get "userThemes", {}, (item) ->
      for name, theme of item["userThemes"]
        Themes[name] = theme

    $.get "userMascots", {}, (item) ->
      for name, mascot of item["userMasctos"]
        Mascots[name] = mascot

    if Conf["NSFW/SFW Mascots"]
      g.MASCOTSTRING = "Enabled Mascots #{g.TYPE}"
    else
      g.MASCOTSTRING = "Enabled Mascots"

    items =
      'Enabled Mascots':      []
      'Enabled Mascots sfw':  []
      'Enabled Mascots nsfw': []
      'Deleted Mascots':      []
    
    $.get items, (items) ->
      for key, val of items
        Conf[key] = val

    switch location.hostname
      when 'sys.4chan.org'
        Report.init()
        return
      when 'images.4chan.org'
        $.ready ->
          if Conf['404 Redirect'] and d.title is '4chan - 404 Not Found'
            url = Redirect.image pathname[1], pathname[3]
            location.href = url if url
        return

    initFeatures = (features) ->
      for name, module of features
        # c.time "#{name} initialization"
        try
          do module.init
        catch err
          Main.handleErrors
            message: "\"#{name}\" initialization crashed."
            error: err
        # finally
        #   c.timeEnd "#{name} initialization"
      return

    # c.time 'All initializations'

    initFeatures
      'Polyfill':                 Polyfill
      'Emoji':                    Emoji
      'Style':                    Style
      'Rice':                     Rice
      'Banner':                   Banner
      'Announcements':            GlobalMessage
      'Header':                   Header
      'Catalog Links':            CatalogLinks
      'Settings':                 Settings
      'Fourchan thingies':        Fourchan
      'Custom CSS':               CustomCSS
      'Linkify':                  Linkify
      'Resurrect Quotes':         Quotify
      'Filter':                   Filter
      'Thread Hiding':            ThreadHiding
      'Reply Hiding':             PostHiding
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
      'Sauce':                    Sauce
      'Image Expansion':          ImageExpand
      'Image Expansion (Menu)':   ImageExpand.menu
      'Reveal Spoilers':          RevealSpoilers
      'Image Replace':            ImageReplace
      'Image Hover':              ImageHover
      'Comment Expansion':        ExpandComment
      'Thread Expansion':         ExpandThread
      'Thread Excerpt':           ThreadExcerpt
      'Favicon':                  Favicon
      'Unread':                   Unread
      'Thread Updater':           ThreadUpdater
      'Thread Stats':             ThreadStats
      'Thread Watcher':           ThreadWatcher
      'Index Navigation':         Nav
      'Keybinds':                 Keybinds

    # c.timeEnd 'All initializations'

    $.on d, 'AddCallback',   Main.addCallback
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
      Main.callbackNodes Post, posts

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
