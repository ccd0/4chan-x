class Thread
  @callbacks = []
  toString: -> @ID

  constructor: (@ID, @board) ->
    @fullID    = "#{@board}.#{@ID}"
    @posts     = {}
    @isDead    = false
    @isHidden  = false
    @isOnTop   = false
    @isPinned  = false
    @isSticky  = false
    @isClosed  = false
    @postLimit = false
    @fileLimit = false

    @OP = null
    @catalogView = null

    g.threads[@fullID] = board.threads[@] = @

  setPage: (pageNum) ->
    icon = $ '.page-num', @OP.nodes.info
    for key in ['title', 'textContent']
      icon[key] = icon[key].replace /\d+/, pageNum
    @catalogView.nodes.pageCount.textContent = pageNum if @catalogView
  setCount: (type, count, reachedLimit) ->
    return unless @catalogView
    el = @catalogView.nodes["#{type}Count"]
    el.textContent = count
    (if reachedLimit then $.addClass else $.rmClass) el, 'warning'
  setStatus: (type, status) ->
    name = "is#{type}"
    return if @[name] is status
    @[name] = status
    return unless @OP
    typeLC = type.toLowerCase()
    unless status
      $.rm $ ".#{typeLC}Icon", @OP.nodes.info
      $.rm $ ".#{typeLC}Icon", @catalogView.nodes.icons if @catalogView
      return

    icon = $.el 'img',
      src: "#{Build.staticPath}#{typeLC}#{Build.gifIcon}"
      title: type
      className: "#{typeLC}Icon"
    root = if type is 'Closed' and @isSticky
      $ '.stickyIcon', @OP.nodes.info
    else if g.VIEW is 'index'
      $ '.page-num', @OP.nodes.info
    else
      $ '[title="Quote this post"]', @OP.nodes.info
    $.after root, [$.tn(' '), icon]

    return unless @catalogView
    (if type is 'Sticky' and @isClosed then $.prepend else $.add) @catalogView.nodes.icons, icon.cloneNode()

  pin: ->
    @isPinned = true
    $.addClass @catalogView.nodes.root, 'pinned' if @catalogView
  unpin: ->
    @isPinned = false
    $.rmClass  @catalogView.nodes.root, 'pinned' if @catalogView

  kill: ->
    @isDead = true

  collect: ->
    for postID, post of @posts
      post.collect()
    delete g.threads[@fullID]
    delete @board.threads[@]
