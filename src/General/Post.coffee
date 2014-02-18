class Post
  @callbacks = []
  toString: -> @ID

  constructor: (root, @thread, @board, that={}) ->
    @ID     = +root.id[2..]
    @fullID = "#{@board}.#{@ID}"

    @cleanup root if that.isOriginalMarkup
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
    if subject        = $ '.subject',            info
      @nodes.subject  = subject
      @info.subject   = subject.textContent
    if name           = $ '.name',               info
      @nodes.name     = name
      @info.name      = name.textContent
    if email          = $ '.useremail',          info
      @nodes.email    = email
      @info.email     = decodeURIComponent email.href[7..]
    if tripcode       = $ '.postertrip',         info
      @nodes.tripcode = tripcode
      @info.tripcode  = tripcode.textContent
    if uniqueID       = $ '.posteruid',          info
      @nodes.uniqueID = uniqueID
      @info.uniqueID  = uniqueID.firstElementChild.textContent
    if capcode        = $ '.capcode.hand',       info
      @nodes.capcode  = capcode
      @info.capcode   = capcode.textContent.replace '## ', ''
    if flag           = $ '.flag, .countryFlag', info
      @nodes.flag     = flag
      @info.flag      = flag.title
    if date           = $ '.dateTime',           info
      @nodes.date     = date
      @info.date      = new Date date.dataset.utc * 1000

    @parseComment()
    @parseQuotes()
    @parseFile that

    @isDead   = false
    @isHidden = false

    @clones = []
    g.posts[@fullID] = thread.posts[@] = board.posts[@] = @
    @kill() if that.isArchived

  parseComment: ->
    # Merge text nodes and remove empty ones.
    @nodes.comment.normalize()
    # Get the comment's text.
    # <br> -> \n
    # Remove:
    #   EXIF data. (/p/)
    #   Rolls. (/tg/)
    #   Preceding and following new lines.
    #   Trailing spaces.
    bq = @nodes.comment.cloneNode true
    for node in $$ '.abbr, .exif, b', bq
      $.rm node
    text = []
    # XPathResult.ORDERED_NODE_SNAPSHOT_TYPE === 7
    nodes = d.evaluate './/br|.//text()', bq, null, 7, null
    for i in [0...nodes.snapshotLength] by 1
      text.push nodes.snapshotItem(i).data or '\n'
    @info.comment = text.join('').trim().replace /\s+$/gm, ''

  parseQuotes: ->
    @quotes = []
    for quotelink in $$ '.quotelink', @nodes.comment
      @parseQuote quotelink
    return

  parseQuote: (quotelink) ->
    # Only add quotes that link to posts on an imageboard.
    # Don't add:
    #  - board links. (>>>/b/)
    #  - catalog links. (>>>/b/catalog or >>>/b/search)
    #  - rules links. (>>>/a/rules)
    #  - text-board quotelinks. (>>>/img/1234)
    return unless match = quotelink.href.match ///
      boards\.4chan\.org/
      ([^/]+) # boardID
      /res/\d+#p
      (\d+)   # postID
      $
    ///

    @nodes.quotelinks.push quotelink

    return if @isClone

    # ES6 Set when?
    fullID = "#{match[1]}.#{match[2]}"
    @quotes.push fullID if @quotes.indexOf(fullID) is -1

  parseFile: (that) ->
    return unless (fileEl = $ '.file', @nodes.post) and thumb = $ 'img[data-md5]', fileEl
    # Supports JPG/PNG/GIF/PDF.
    # Flash files are not supported.
    anchor   = thumb.parentNode
    fileText = fileEl.firstElementChild
    @file    =
      text:  fileText
      thumb: thumb
      URL:   anchor.href
      size:  thumb.alt.match(/[\d.]+\s\w+/)[0]
      MD5:   thumb.dataset.md5
      isSpoiler: $.hasClass anchor, 'imgspoiler'
    size  = +@file.size.match(/[\d.]+/)[0]
    unit  = ['B', 'KB', 'MB', 'GB'].indexOf @file.size.match(/\w+$/)[0]
    size *= 1024 while unit-- > 0
    @file.sizeInBytes = size
    @file.thumbURL = if that.isArchived
      thumb.src
    else
      "#{location.protocol}//t.4cdn.org/#{@board}/thumb/#{@file.URL.match(/(\d+)\./)[1]}s.jpg"
    @file.name = if nameNode = $ 'span', fileText
      nameNode.title or nameNode.textContent
    else
      fileText.title
    <% if (type === 'crx') { %>
    # replace %22 with quotes, see:
    # crbug.com/81193
    # webk.it/62107
    # https://www.w3.org/Bugs/Public/show_bug.cgi?id=16909
    # http://www.whatwg.org/specs/web-apps/current-work/#multipart-form-data
    @file.name = @file.name.replace /%22/g, '"'
    <% } %>
    if @file.isImage = /(jpg|png|gif)$/i.test @file.name
      @file.dimensions = fileText.textContent.match(/\d+x\d+/)[0]

  cleanup: (root) ->
    for node in $$ '.mobile', root
      $.rm node
    for node in $$ '.desktop', root
      $.rmClass node, 'desktop'
    return

  kill: (file) ->
    if file
      return if @file.isDead
      @file.isDead = true
      $.addClass @nodes.root, 'deleted-file'
    else
      return if @isDead
      @isDead = true
      $.addClass @nodes.root, 'deleted-post'

    unless strong = $ 'strong.warning', @nodes.info
      strong = $.el 'strong',
          className: 'warning'
          textContent: if @isReply then '[Deleted]' else '[Dead]'
      $.after $('input', @nodes.info), strong
    strong.textContent = if file then '[File deleted]' else if @isReply then '[Deleted]' else '[Dead]'

    return if @isClone
    for clone in @clones
      clone.kill file

    return if file
    # Get quotelinks/backlinks to this post
    # and paint them (Dead).
    for quotelink in Get.allQuotelinksLinkingTo @ when not $.hasClass quotelink, 'deadlink'
      $.addClass quotelink, 'deadlink'
      continue unless Conf['Quote Markers']
      QuoteMarkers.parseQuotelink Get.postFromNode(quotelink), quotelink, true
    return
  # XXX tmp fix for 4chan's racing condition
  # giving us false-positive dead posts.
  resurrect: ->
    delete @isDead
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

    for quotelink in Get.allQuotelinksLinkingTo @ when $.hasClass quotelink, 'deadlink'
      $.rmClass quotelink, 'deadlink'
      continue unless Conf['Quote Markers']
      QuoteMarkers.parseQuotelink Get.postFromNode(quotelink), quotelink, true
    return

  collect: ->
    @kill()
    delete g.posts[@fullID]
    delete @thread.posts[@]
    delete @board.posts[@]

  addClone: (context) ->
    new Clone @, context
  rmClone: (index) ->
    @clones.splice index, 1
    for clone in @clones[index..]
      clone.nodes.root.dataset.clone = index++
    return
