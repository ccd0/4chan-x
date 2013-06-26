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

    unless @isReply = $.hasClass post, 'reply'
      @thread.OP = @
      @thread.isSticky = !!$ '.stickyIcon', info
      @thread.isClosed = !!$ '.closedIcon', info

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

    @parseComment()
    @parseQuotes()
    @parseFile()

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
      {hash} = quotelink
      continue unless hash

      # Don't add catalog links. (>>>/b/catalog or >>>/b/search)
      {pathname} = quotelink
      continue if /catalog$/.test pathname

      # Don't add rules links. (>>>/a/rules)
      # Don't add text-board quotelinks. (>>>/img/1234)
      continue if quotelink.hostname isnt 'boards.4chan.org'

      @nodes.quotelinks.push quotelink

      # Don't count capcode replies as quotes in OPs. (Admin/Mod/Dev Replies: ...)
      continue if !@isReply and $.hasClass quotelink.parentNode.parentNode, 'capcodeReplies'

      # Basically, only add quotes that link to posts on an imageboard.
      quotes["#{pathname.split('/')[1]}.#{hash[2..]}"] = true
    return if @isClone
    @quotes = Object.keys quotes

  parseFile: ->
    return unless (fileEl = $ '.file', @nodes.post) and thumb = $ 'img[data-md5]', fileEl
    # Supports JPG/PNG/GIF/PDF.
    # Flash files are not supported.
    alt      = thumb.alt
    anchor   = thumb.parentNode
    fileInfo = fileEl.firstElementChild
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
    @file.thumbURL = if that.isArchived
      thumb.src
    else
      "#{location.protocol}//thumbs.4chan.org/#{board}/thumb/#{@file.URL.match(/(\d+)\./)[1]}s.jpg"
    @file.name = $('span[title]', fileInfo).title
    <% if (type === 'crx') { %>
    # replace %22 with quotes, see:
    # crbug.com/81193
    # webk.it/62107
    # https://www.w3.org/Bugs/Public/show_bug.cgi?id=16909
    # http://www.whatwg.org/specs/web-apps/current-work/#multipart-form-data
    @file.name = @file.name.replace /%22/g, '"'
    <% } %>
    if @file.isImage = /(jpg|png|gif)$/i.test @file.name
      @file.dimensions = @file.text.textContent.match(/\d+x\d+/)[0]

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
          textContent: if @isReply then '[Deleted]' else '[Dead]'
      $.after $('input', @nodes.info), strong
    strong.textContent = if file then '[File deleted]' else if @isReply then '[Deleted]' else '[Dead]'

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
