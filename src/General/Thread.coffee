class Thread
  @callbacks = []
  toString: -> @ID

  constructor: (@ID, @board) ->
    @fullID    = "#{@board}.#{@ID}"
    @posts     = {}
    @isSticky  = false
    @isClosed  = false
    @postLimit = false
    @fileLimit = false

    g.threads[@fullID] = board.threads[@] = @

  setPage: (pageNum) ->
    icon = $ '.page-num', @OP.nodes.post
    for key in ['title', 'textContent']
      icon[key] = icon[key].replace /\d+/, pageNum
    $('.page-count', @catalogView).textContent = pageNum if @catalogView
  setStatus: (type, status) ->
    name = "is#{type}"
    return if @[name] is status
    @[name] = status
    return unless @OP
    typeLC = type.toLowerCase()
    unless status
      $.rm $ ".#{typeLC}Icon", @OP.nodes.info
      $.rm $ ".#{typeLC}Icon", @catalogView if @catalogView
      return

    icon = $.el 'img',
      src: "#{Build.staticPath}#{typeLC}#{Build.gifIcon}"
      alt:   type
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
    root = $ '.thread-icons', @catalogView
    (if type is 'Sticky' and @isClosed then $.prepend else $.add) root, icon.cloneNode()

  getCatalogView: ->
    return @catalogView if @catalogView
    @catalogView = Build.threadCatalog @

  kill: ->
    @isDead = true
    @timeOfDeath = Date.now()

  collect: ->
    for postID, post of @posts
      post.collect()
    delete g.threads[@fullID]
    delete @board.threads[@]
