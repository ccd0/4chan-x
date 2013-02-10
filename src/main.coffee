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

    # XXX Can't check when parsing single posts
    #     move to Post constructor? unless @isReply
    # postInfo  = $ '.postInfo', root.firstElementChild
    # @isClosed = !!$ 'img[title=Closed]', postInfo
    # @isSticky = !!$ 'img[title=Sticky]', postInfo

    g.threads["#{board}.#{@}"] = board.threads[@] = @

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
    if subject        = $ '.subject',     info
      @nodes.subject  = subject
      @info.subject   = subject.textContent
    if name           = $ '.name',        info
      @nodes.name     = name
      @info.name      = name.textContent
    if email          = $ '.useremail',   info
      @nodes.email    = email
      @info.email     = decodeURIComponent email.href[7..]
    if tripcode       = $ '.postertrip',  info
      @nodes.tripcode = tripcode
      @info.tripcode  = tripcode.textContent
    if uniqueID       = $ '.posteruid',   info
      @nodes.uniqueID = uniqueID
      @info.uniqueID  = uniqueID.firstElementChild.textContent
    if capcode        = $ '.capcode',     info
      @nodes.capcode  = capcode
      @info.capcode   = capcode.textContent
    if flag           = $ '.countryFlag', info
      @nodes.flag     = flag
      @info.flag      = flag.title
    if date           = $ '.dateTime',    info
      @nodes.date     = date
      @info.date      = new Date date.dataset.utc * 1000

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
    @quotes = Object.keys quotes

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

    @isReply = $.hasClass post, 'reply'
    @clones  = []
    g.posts["#{board}.#{@}"] = thread.posts[@] = board.posts[@] = @
    @kill() if that.isArchived

  kill: (img) ->
    if @file and !@file.isDead
      @file.isDead = true
    return if img
    @isDead = true
    $.addClass @nodes.root, 'dead'
    # XXX style dead posts.

    # Get quote/backlinks to this post
    # and paint them (Dead).
    for quotelink in Get.allQuotelinksLinkingTo @
      continue if $.hasClass quotelink, 'deadlink'
      $.add quotelink, $.tn '\u00A0(Dead)'
      $.addClass quotelink, 'deadlink'
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
    # $.rmClass post, 'highlight' # keybind navigation

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

    for quotelink in $$ '.quotelink', @nodes.comment
      # See comments in Post's constructor.
      if quotelink.hash or $.hasClass quotelink, 'deadlink'
        @nodes.quotelinks.push quotelink

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

    @isDead  = true if origin.isDead
    @isClone = true
    index = origin.clones.push(@) - 1
    root.setAttribute 'data-clone', index


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
    for key, val of Conf
      Conf[key] = $.get key, val

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
      g.THREAD = +pathname[3]

    switch location.hostname
      when 'sys.4chan.org'
        return
      when 'images.4chan.org'
        $.ready ->
          if Conf['404 Redirect'] and d.title is '4chan - 404 Not Found'
            url = Redirect.image pathname[1], pathname[3]
            location.href = url if url
        return

    $.addStyle Main.css
    $.addClass d.documentElement, $.engine
    $.addClass d.documentElement, 'fourchan_x'

    initFeature = (name, module) ->
      console.time "#{name} initialization"
      try
        module.init()
      catch err
        Main.handleErrors
          message: "\"#{name}\" initialization crashed."
          error: err
      console.timeEnd "#{name} initialization"

    console.time 'All initializations'
    initFeature 'Header',                   Header
    initFeature 'Settings',                 Settings
    initFeature 'Resurrect Quotes',         Quotify
    initFeature 'Filter',                   Filter
    initFeature 'Thread Hiding',            ThreadHiding
    initFeature 'Reply Hiding',             ReplyHiding
    initFeature 'Recursive',                Recursive
    initFeature 'Menu',                     Menu
    initFeature 'Report Link',              ReportLink
    initFeature 'Thread Hiding (Menu)',     ThreadHiding.menu
    initFeature 'Reply Hiding (Menu)',      ReplyHiding.menu
    initFeature 'Delete Link',              DeleteLink
    initFeature 'Filter (Menu)',            Filter.menu
    initFeature 'Download Link',            DownloadLink
    initFeature 'Archive Link',             ArchiveLink
    initFeature 'Quote Inline',             QuoteInline
    initFeature 'Quote Preview',            QuotePreview
    initFeature 'Quote Backlinks',          QuoteBacklink
    initFeature 'Mark OP Quotes',           QuoteOP
    initFeature 'Mark Cross-thread Quotes', QuoteCT
    initFeature 'Anonymize',                Anonymize
    initFeature 'Time Formatting',          Time
    initFeature 'File Info Formatting',     FileInfo
    initFeature 'Sauce',                    Sauce
    initFeature 'Reveal Spoilers',          RevealSpoilers
    initFeature 'Auto-GIF',                 AutoGIF
    initFeature 'Image Hover',              ImageHover
    initFeature 'Thread Updater',           ThreadUpdater
    console.timeEnd 'All initializations'

    $.ready Main.initReady

  initReady: ->
    if d.title is '4chan - 404 Not Found'
      $.rmClass d.documentElement, 'fourchan_x'
      if Conf['404 Redirect'] and g.VIEW is 'thread'
        location.href = Redirect.to
          board: g.BOARD
          threadID: g.THREAD
          postID: location.hash
      return

    # disable the mobile layout
    $('link[href*=mobile]', d.head)?.disabled = true

    threads = []
    posts   = []

    for boardChild in $('.board').children
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

  callbackNodes: (klass, nodes) ->
    # get the nodes' length only once
    len = nodes.length
    for callback in klass::callbacks
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
    Main.handleErrors errors if errors

  handleErrors: (errors) ->
    unless 'length' of errors
      error = errors
    else if errors.length is 1
      error = errors[0]
    if error
      new Notification 'error', Main.parseError(error), 15
      return

    div = $.el 'div',
      innerHTML: "#{errors.length} errors occured. [<a href=javascript:;>show</a>]"
    $.on div.lastElementChild, 'click', ->
      if @textContent is 'show'
        @textContent = 'hide'
        logs.hidden  = false
      else
        @textContent = 'show'
        logs.hidden  = true

    logs = $.el 'div',
      hidden: true
    for error in errors
      $.add logs, Main.parseError error

    new Notification 'error', [div, logs], 30

  parseError: (data) ->
    {message, error} = data
    $.log message, error.stack
    message = $.el 'div',
      textContent: message
    error = $.el 'div',
      textContent: error
    [message, error]

  css: """<%= grunt.file.read('css/style.css') %>"""

Main.init()
