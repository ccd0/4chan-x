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
    return
  setStatus: (type, status) ->
    name = "is#{type}"
    return if @[name] is status
    @[name] = status
    return unless @OP
    typeLC = type.toLowerCase()
    unless status
      $.rm $ ".#{typeLC}Icon", @OP.nodes.info
      return
    icon = $.el 'img',
      src: "//s.4cdn.org/image/#{typeLC}#{if window.devicePixelRatio >= 2 then '@2x' else ''}.gif"
      alt:   type
      title: type
      className: "#{typeLC}Icon"
    root = if type is 'Closed' and @isSticky
      $ '.stickyIcon', @OP.nodes.info
    else
      $ '[title="Quote this post"]', @OP.nodes.info
    $.after root, [$.tn(' '), icon]

  kill: ->
    @isDead = true
    @timeOfDeath = Date.now()

  collect: ->
    for postID, post in @posts
      post.collect()
    delete g.threads[@fullID]
    delete @board.threads[@]
