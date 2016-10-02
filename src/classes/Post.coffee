class Post
  toString: -> @ID

  constructor: (root, @thread, @board) ->
    <% if (readJSON('/.tests_enabled')) { %>
    @normalizedOriginal = Build.Test.normalize root
    <% } %>

    @ID      = +root.id[2..]
    @fullID  = "#{@board}.#{@ID}"
    @context = @

    root.dataset.fullID = @fullID

    @nodes = @parseNodes root

    unless (@isReply = $.hasClass @nodes.post, 'reply')
      @thread.OP = @
      @thread.isArchived = !!$ '.archivedIcon', @nodes.info
      @thread.isSticky   = !!$ '.stickyIcon', @nodes.info
      @thread.isClosed   = @thread.isArchived or !!$ '.closedIcon', @nodes.info
      @thread.kill() if @thread.isArchived

    @info =
      nameBlock: if Conf['Anonymize'] then 'Anonymous' else @nodes.nameBlock.textContent.trim()
      subject:   @nodes.subject?.textContent or undefined
      name:      @nodes.name?.textContent
      tripcode:  @nodes.tripcode?.textContent
      uniqueID:  @nodes.uniqueID?.firstElementChild.textContent
      capcode:   @nodes.capcode?.textContent.replace '## ', ''
      pass:      @nodes.pass?.title.match(/\d*$/)[0]
      flagCode:  @nodes.flag?.className.match(/flag-(\w+)/)?[1].toUpperCase()
      flag:      @nodes.flag?.title
      date:      if @nodes.date then new Date(@nodes.date.dataset.utc * 1000)

    @parseComment()
    @parseQuotes()
    @parseFile()

    @isDead   = false
    @isHidden = false

    @clones = []
    <% if (readJSON('/.tests_enabled')) { %>
    return if arguments[3] is 'forBuildTest'
    <% } %>
    if g.posts[@fullID]
      @isRebuilt = true
      @clones = g.posts[@fullID].clones
      clone.origin = @ for clone in @clones

    @board.posts.push  @ID, @
    @thread.posts.push @ID, @
    g.posts.push   @fullID, @

  parseNodes: (root) ->
    post = $ '.post',     root
    info = $ '.postInfo', post
    nodes =
      root:       root
      post:       post
      info:       info
      subject:    $ '.subject',            info
      name:       $ '.name',               info
      email:      $ '.useremail',          info
      tripcode:   $ '.postertrip',         info
      uniqueID:   $ '.posteruid',          info
      capcode:    $ '.capcode.hand',       info
      pass:       $ '.n-pu',               info
      flag:       $ '.flag, .countryFlag', info
      date:       $ '.dateTime',           info
      nameBlock:  $ '.nameBlock',          info
      quote:      $ '.postNum > a:nth-of-type(2)', info
      reply:      $ '.replylink',          info
      comment:    $ '.postMessage', post
      links:      []
      quotelinks: []
      archivelinks: []

    # XXX Edge invalidates HTMLCollections when an ancestor node is inserted into another node.
    # https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7560353/
    if $.engine is 'edge'
      Object.defineProperty nodes, 'backlinks',
        configurable: true
        enumerable:   true
        get: -> info.getElementsByClassName 'backlink'
    else
      nodes.backlinks = info.getElementsByClassName 'backlink'

    nodes

  parseComment: ->
    # Merge text nodes and remove empty ones.
    @nodes.comment.normalize()

    # Get the comment's text.
    # <br> -> \n
    # Remove:
    #   'Comment too long'...
    #   EXIF data. (/p/)
    #   Rolls. (/tg/)
    #   Fortunes. (/s4s/)
    bq = @nodes.comment.cloneNode true
    for node in $$ '.abbr + br, .exif, b, .fortune', bq
      $.rm node
    if abbr = $ '.abbr', bq
      $.rm abbr
    @info.comment = @nodesToText bq
    if abbr
      @info.comment = @info.comment.replace /\n\n$/, ''

    # Hide spoilers.
    # Remove:
    #   Preceding and following new lines.
    #   Trailing spaces.
    commentDisplay = @info.comment
    unless Conf['Remove Spoilers'] or Conf['Reveal Spoilers']
      spoilers = $$ 's', bq
      if spoilers.length
        for node in spoilers
          $.replace node, $.tn '[spoiler]'
        commentDisplay = @nodesToText bq
    @info.commentDisplay = commentDisplay.trim().replace /\s+$/gm, ''

  nodesToText: (bq) ->
    text = ""
    nodes = $.X './/br|.//text()', bq
    i = 0
    while node = nodes.snapshotItem i++
      text += node.data or '\n'
    text

  parseQuotes: ->
    @quotes = []
    # XXX https://github.com/4chan/4chan-JS/issues/77
    # 4chan currently creates quote links inside [code] tags; ignore them
    for quotelink in $$ ':not(pre) > .quotelink', @nodes.comment
      @parseQuote quotelink
    return

  parseQuote: (quotelink) ->
    # Only add quotes that link to posts on an imageboard.
    # Don't add:
    #  - board links. (>>>/b/)
    #  - catalog links. (>>>/b/catalog or >>>/b/search)
    #  - rules links. (>>>/a/rules)
    #  - text-board quotelinks. (>>>/img/1234)
    match = quotelink.href.match ///
      ^https?://boards\.4chan\.org/+
      ([^/]+) # boardID
      /+(?:res|thread)/+\d+(?:[/?][^#]*)?#p
      (\d+)   # postID
      $
    ///
    return unless match or (@isClone and quotelink.dataset.postID) # normal or resurrected quote

    @nodes.quotelinks.push quotelink

    return if @isClone

    # ES6 Set when?
    fullID = "#{match[1]}.#{match[2]}"
    @quotes.push fullID unless fullID in @quotes

  parseFile: ->
    return unless fileEl = $ '.file', @nodes.post
    return unless link   = $ '.fileText > a, .fileText-original > a', fileEl
    return unless info   = link.nextSibling?.textContent.match /\(([\d.]+ [KMG]?B).*\)/
    fileText = fileEl.firstElementChild
    @file =
      text:       fileText
      link:       link
      url:        link.href
      name:       fileText.title or link.title or link.textContent
      size:       info[1]
      isImage:    /(jpg|png|gif)$/i.test link.href
      isVideo:    /webm$/i.test link.href
      dimensions: info[0].match(/\d+x\d+/)?[0]
      tag:        info[0].match(/,[^,]*, ([a-z]+)\)/i)?[1]
    size  = +@file.size.match(/[\d.]+/)[0]
    unit  = ['B', 'KB', 'MB', 'GB'].indexOf @file.size.match(/\w+$/)[0]
    size *= 1024 while unit-- > 0
    @file.sizeInBytes = size
    if (thumb = $ '.fileThumb > [data-md5]', fileEl)
      $.extend @file,
        thumb:     thumb
        thumbURL:  if m = link.href.match(/\d+(?=\.\w+$)/) then "#{location.protocol}//i.4cdn.org/#{@board}/#{m[0]}s.jpg"
        MD5:       thumb.dataset.md5
        isSpoiler: $.hasClass thumb.parentNode, 'imgspoiler'

  kill: (file) ->
    if file
      return if @isDead or @file.isDead
      @file.isDead = true
      $.addClass @nodes.root, 'deleted-file'
    else
      return if @isDead
      @isDead = true
      $.rmClass  @nodes.root, 'deleted-file'
      $.addClass @nodes.root, 'deleted-post'

    unless (strong = $ 'strong.warning', @nodes.info)
      strong = $.el 'strong',
        className: 'warning'
      $.after $('input', @nodes.info), strong
    strong.textContent = if file then '[File deleted]' else '[Deleted]'

    return if @isClone
    for clone in @clones
      clone.kill file

    return if file
    # Get quotelinks/backlinks to this post
    # and paint them (Dead).
    for quotelink in Get.allQuotelinksLinkingTo @ when not $.hasClass quotelink, 'deadlink'
      quotelink.textContent = quotelink.textContent + '\u00A0(Dead)'
      $.addClass quotelink, 'deadlink'
    return

  # XXX Workaround for 4chan's racing condition
  # giving us false-positive dead posts.
  resurrect: ->
    @isDead = false
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
      quotelink.textContent = quotelink.textContent.replace '\u00A0(Dead)', ''
      $.rmClass quotelink, 'deadlink'
    return

  collect: ->
    g.posts.rm @fullID
    @thread.posts.rm @
    @board.posts.rm @

  addClone: (context, contractThumb) ->
    new Post.Clone @, context, contractThumb

  rmClone: (index) ->
    @clones.splice index, 1
    for clone in @clones[index..]
      clone.nodes.root.dataset.clone = index++
    return
