class Post
  toString: -> @ID

  constructor: (root, @thread, @board) ->
    <% if (readJSON('/.tests_enabled')) { %>
    @normalizedOriginal = Build.Test.normalize root
    <% } %>

    @ID       = +root.id.match(/\d*$/)[0]
    @threadID = @thread.ID
    @boardID  = @board.ID
    @fullID   = "#{@board}.#{@ID}"
    @context  = @
    @isReply  = (@ID isnt @threadID)

    root.dataset.fullID = @fullID

    @nodes = @parseNodes root

    if not @isReply
      @thread.OP = @
      for key in ['isSticky', 'isClosed', 'isArchived']
        @thread[key] = if (selector = Site.selectors.icons[key]) then !!$(selector, @nodes.info) else false
      if @thread.isArchived
        @thread.isClosed = true
        @thread.kill()

    @info =
      subject:   @nodes.subject?.textContent or undefined
      name:      @nodes.name?.textContent
      email:     if @nodes.email then decodeURIComponent(@nodes.email.href.replace(/^mailto:/, ''))
      tripcode:  @nodes.tripcode?.textContent
      uniqueID:  @nodes.uniqueID?.textContent
      capcode:   @nodes.capcode?.textContent.replace '## ', ''
      pass:      @nodes.pass?.title.match(/\d*$/)[0]
      flagCode:  @nodes.flag?.className.match(/flag-(\w+)/)?[1].toUpperCase()
      flagCodeTroll: @nodes.flag?.src?.match(/(\w+)\.gif$/)?[1].toUpperCase()
      flag:      @nodes.flag?.title
      date:      if @nodes.date then new Date(@nodes.date.getAttribute('datetime')?.trim() or (@nodes.date.dataset.utc * 1000))

    if Conf['Anonymize']
      @info.nameBlock = 'Anonymous'
    else
      @info.nameBlock = "#{@info.name or ''} #{@info.tripcode or ''}".trim()
    @info.nameBlock += " ## #{@info.capcode}"     if @info.capcode
    @info.nameBlock += " (ID: #{@info.uniqueID})" if @info.uniqueID

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
    s = Site.selectors
    post = $(s.post, root) or root
    info = $ s.infoRoot, post
    nodes =
      root:       root
      bottom:     if @isReply or !Site.isOPContainerThread then root else $(s.opBottom, root)
      post:       post
      info:       info
      comment:    $ s.comment, post
      quotelinks: []
      archivelinks: []
      embedlinks:   []
    for key, selector of s.info
      nodes[key] = $ selector, info
    Site.parseNodes?(@, nodes)
    nodes.uniqueIDRoot or= nodes.uniqueID

    # XXX Edge invalidates HTMLCollections when an ancestor node is inserted into another node.
    # https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7560353/
    if $.engine is 'edge'
      Object.defineProperty nodes, 'backlinks',
        configurable: true
        enumerable:   true
        get: -> post.getElementsByClassName 'backlink'
    else
      nodes.backlinks = post.getElementsByClassName 'backlink'

    nodes

  parseComment: ->
    # Merge text nodes and remove empty ones.
    @nodes.comment.normalize()

    # Get the comment's text.
    # <br> -> \n
    # Remove:
    #   'Comment too long'...
    #   EXIF data. (/p/)
    @nodes.commentClean = bq = @nodes.comment.cloneNode true
    Site.cleanComment?(bq)
    @info.comment = @nodesToText bq

  commentDisplay: ->
    # Get the comment's text for display purposes (e.g. notifications, excerpts).
    # In addition to what's done in generating `@info.comment`, remove:
    #   Spoilers. (filter to '[spoiler]')
    #   Rolls. (/tg/, /qst/)
    #   Fortunes. (/s4s/)
    #   Preceding and following new lines.
    #   Trailing spaces.
    bq = @nodes.commentClean.cloneNode true
    @cleanSpoilers bq unless Conf['Remove Spoilers'] or Conf['Reveal Spoilers']
    Site.cleanCommentDisplay?(bq)
    @nodesToText(bq).trim().replace(/\s+$/gm, '')

  commentOrig: ->
    # Get the comment's text for reposting purposes.
    bq = @nodes.commentClean.cloneNode true
    Site.insertTags?(bq)
    @nodesToText bq

  nodesToText: (bq) ->
    text = ""
    nodes = $.X './/br|.//text()', bq
    i = 0
    while node = nodes.snapshotItem i++
      text += node.data or '\n'
    text

  cleanSpoilers: (bq) ->
    spoilers = $$ Site.selectors.spoiler, bq
    for node in spoilers
      $.replace node, $.tn '[spoiler]'
    return

  parseQuotes: ->
    @quotes = []
    for quotelink in $$ Site.selectors.quotelink, @nodes.comment
      @parseQuote quotelink
    return

  parseQuote: (quotelink) ->
    # Only add quotes that link to posts on an imageboard.
    # Don't add:
    #  - board links. (>>>/b/)
    #  - catalog links. (>>>/b/catalog or >>>/b/search)
    #  - rules links. (>>>/a/rules)
    #  - text-board quotelinks. (>>>/img/1234)
    match = quotelink.href.match Site.regexp.quotelink
    return unless match or (@isClone and quotelink.dataset.postID) # normal or resurrected quote

    @nodes.quotelinks.push quotelink

    return if @isClone

    # ES6 Set when?
    fullID = "#{match[1]}.#{match[3]}"
    @quotes.push fullID unless fullID in @quotes

  parseFile: ->
    file = {}
    for key, selector of Site.selectors.file
      file[key] = $ selector, @nodes.root
    file.thumbLink = file.thumb?.parentNode

    return if not (file.text and file.link)
    return if not Site.parseFile @, file

    $.extend file,
      url:     file.link.href
      isImage: /(jpe?g|png|gif|bmp)$/i.test file.link.href
      isVideo: /(webm|mp4)$/i.test file.link.href
    size  = +file.size.match(/[\d.]+/)[0]
    unit  = ['B', 'KB', 'MB', 'GB'].indexOf file.size.match(/\w+$/)[0]
    size *= 1024 while unit-- > 0
    file.sizeInBytes = size

    @file = file

  @deadMark =
    # \u00A0 is nbsp
    $.el 'span',
      textContent: '\u00A0(Dead)'
      className:   'qmark-dead'

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

    if not (strong = $ 'strong.warning', @nodes.info)
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
      $.add quotelink, Post.deadMark.cloneNode(true)
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
      $.rm $('.qmark-dead', quotelink)
      $.rmClass quotelink, 'deadlink'
    return

  collect: ->
    g.posts.rm @fullID
    @thread.posts.rm @
    @board.posts.rm @

  addClone: (context, contractThumb) ->
    # Callbacks may not have been run yet due to anti-browser-lock delay in Main.callbackNodesDB.
    Callbacks.Post.execute @
    new Post.Clone @, context, contractThumb

  rmClone: (index) ->
    @clones.splice index, 1
    for clone in @clones[index..]
      clone.nodes.root.dataset.clone = index++
    return

  setCatalogOP: (isCatalogOP) ->
    @nodes.root.classList.toggle 'catalog-container', isCatalogOP
    @nodes.root.classList.toggle 'opContainer', !isCatalogOP
    @nodes.post.classList.toggle 'catalog-post', isCatalogOP
    @nodes.post.classList.toggle 'op', !isCatalogOP
    @nodes.post.style.left = @nodes.post.style.right = null
