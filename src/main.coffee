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
    @ID = +ID
    @posts = {}

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
    @ID = +root.id[2..]

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
      @info.uniqueID  = uniqueID.textContent
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
      # Don't add text-board quotelinks. (>>>/img/1234)
      # Don't count capcode replies as quotes. (Admin/Mod/Dev Replies: ...)
      # Only add quotes that link to posts on an imageboard.
      if quotelink.hash
        @nodes.quotelinks.push quotelink
        continue if quotelink.parentNode.parentNode.className is 'capcodeReplies'
        quotes["#{quotelink.pathname.split('/')[1]}.#{quotelink.hash[2..]}"] = true
    @quotes = Object.keys quotes

    if (file = $ '.file', post) and thumb = $ 'img[data-md5]', file
      # Supports JPG/PNG/GIF/PDF.
      # Flash files are not supported.
      alt    = thumb.alt
      anchor = thumb.parentNode
      fileInfo = file.firstElementChild
      @file  =
        info:  fileInfo
        text:  fileInfo.firstElementChild
        thumb: thumb
        URL:   anchor.href
        MD5:   thumb.dataset.md5
        isSpoiler: $.hasClass anchor, 'imgspoiler'
      size = +alt.match(/\d+(\.\d+)?/)[0]
      unit = ['B', 'KB', 'MB', 'GB'].indexOf alt.match(/\w+$/)[0]
      while unit--
        size *= 1024
      @file.size = size
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

    # Get quote/backlinks to this post,
    # and paint them (Dead).
    # First:
    #   In every posts,
    #   if it did quote this post,
    #   get all their backlinks.
    # Second:
    #   If we have quote backlinks,
    #   in all posts this post quoted,
    #   and their clones,
    #   get all of their backlinks.
    # Third:
    #   In all collected links,
    #   apply (Dead) if relevant.
    quotelinks = []
    num = "#{@board}.#{@}"
    for ID, post of g.posts
      if -1 < post.quotes.indexOf num
        for post in [post].concat post.clones
          quotelinks.push.apply quotelinks, post.nodes.quotelinks
    if Conf['Quote Backlinks']
      for quote in @quotes
        post = g.posts[quote]
        for post in [post].concat post.clones
          quotelinks.push.apply quotelinks, Array::slice.call post.nodes.backlinks
    for quotelink in quotelinks
      continue if $.hasClass quotelink, 'deadlink'
      {board, postID} = Get.postDataFromLink quotelink
      if board is @board.ID postID is @ID
        $.add quotelink, $.tn '\u00A0(Dead)'
        $.addClass quotelinks, 'deadlink'
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
    for key in ['ID', 'board', 'thread', 'info', 'quotes', 'isReply']
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

    # root.hidden = false # post hiding
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
    if g.REPLY = pathname[2] is 'res'
      g.THREAD = +pathname[3]

    switch location.hostname
      when 'boards.4chan.org'
        Main.initHeader()
        Main.initFeatures()
      when 'sys.4chan.org'
        return
      when 'images.4chan.org'
        $.ready ->
          if Conf['404 Redirect'] and d.title is '4chan - 404 Not Found'
            path = location.pathname.split '/'
            url  = Redirect.image path[1], path[3]
            location.href = url if url
        return

  initHeader: ->
    $.addStyle Main.css
    Main.header = $.el 'div',
      className: 'reply'
      innerHTML: '<div class=extra></div>'
    $.ready Main.initHeaderReady
  initHeaderReady: ->
    header = Main.header
    $.prepend d.body, header

    if nav = $.id 'boardNavDesktop'
      header.id = nav.id
      $.prepend header, nav
      nav.id = nav.className = null
      nav.lastElementChild.hidden = true
      settings = $.el 'span',
        id: 'settings'
        innerHTML: '[<a href=javascript:;>Settings</a>]'
      $.on settings.firstElementChild, 'click', Main.settings
      $.add nav, settings
      $("a[href$='/#{g.BOARD}/']", nav)?.className = 'current'

    $.addClass d.body, $.engine
    $.addClass d.body, 'fourchan_x'

    # disable the mobile layout
    $('link[href*=mobile]', d.head)?.disabled = true
    $.id('boardNavDesktopFoot')?.hidden = true

  initFeatures: ->
    if Conf['Disable 4chan\'s extension']
      settings = JSON.parse(localStorage.getItem '4chan-settings') or {}
      settings.disableAll = true
      localStorage.setItem '4chan-settings', JSON.stringify settings

    if Conf['Resurrect Quotes']
      try
        Quotify.init()
      catch err
        # XXX handle error
        $.log err, 'Resurrect Quotes'

    if Conf['Quote Inline']
      try
        QuoteInline.init()
      catch err
        # XXX handle error
        $.log err, 'Quote Inline'

    if Conf['Quote Preview']
      try
        QuotePreview.init()
      catch err
        # XXX handle error
        $.log err, 'Quote Preview'

    if Conf['Quote Backlinks']
      try
        QuoteBacklink.init()
      catch err
        # XXX handle error
        $.log err, 'Quote Backlinks'

    if Conf['Indicate OP Quotes']
      try
        QuoteOP.init()
      catch err
        # XXX handle error
        $.log err, 'Indicate OP Quotes'

    if Conf['Indicate Cross-thread Quotes']
      try
        QuoteCT.init()
      catch err
        # XXX handle error
        $.log err, 'Indicate Cross-thread Quotes'

    if Conf['Time Formatting']
      try
        Time.init()
      catch err
        # XXX handle error
        $.log err, 'Time Formatting'

    if Conf['File Info Formatting']
      try
        FileInfo.init()
      catch err
        # XXX handle error
        $.log err, 'File Info Formatting'

    if Conf['Sauce']
      try
        Sauce.init()
      catch err
        # XXX handle error
        $.log err, 'Sauce'

    if Conf['Reveal Spoilers']
      try
        RevealSpoilers.init()
      catch err
        # XXX handle error
        $.log err, 'Reveal Spoilers'

    if Conf['Auto-GIF']
      try
        AutoGIF.init()
      catch err
        # XXX handle error
        $.log err, 'Auto-GIF'

    if Conf['Image Hover']
      try
        ImageHover.init()
      catch err
        # XXX handle error
        $.log err, 'Image Hover'

    if Conf['Thread Updater']
      try
        ThreadUpdater.init()
      catch err
        # XXX handle error
        $.log err, 'Thread Updater'

    $.ready Main.initFeaturesReady
  initFeaturesReady: ->
    if d.title is '4chan - 404 Not Found'
      if Conf['404 Redirect'] and g.REPLY
        location.href = Redirect.thread g.BOARD, g.THREAD, location.hash
      return

    return unless $.id 'navtopright'

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
          # XXX handle error
          # Post parser crashed for post No.#{threadChild.id[2..]}
          $.log threadChild, err

    Main.callbackNodes Thread, threads, true
    Main.callbackNodes Post,   posts,   true

  callbackNodes: (klass, nodes, notify) ->
    # get the nodes' length only once
    len = nodes.length
    for callback in klass::callbacks
      try
        for i in [0...len]
          callback.cb.call nodes[i]
      catch err
        # XXX handle error if notify
        $.log callback.name, 'crashed. error:', err.message, nodes[i], err
    return

  settings: ->
    alert 'Here be settings'

  css: """<%= grunt.file.read('css/style.css') %>"""

Main.init()
