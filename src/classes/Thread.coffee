class Thread
  toString: -> @ID

  constructor: (@ID, @board) ->
    @threadID   = @ID
    @boardID    = @board.ID
    @siteID     = g.SITE.ID
    @fullID     = "#{@board}.#{@ID}"
    @posts      = new SimpleDict()
    @isDead     = false
    @isHidden   = false
    @isSticky   = false
    @isClosed   = false
    @isArchived = false
    @postLimit  = false
    @fileLimit  = false
    @lastPost   = 0
    @ipCount    = undefined
    @json       = null

    @OP = null
    @catalogView = null

    @nodes =
      root: null

    @board.threads.push @ID, @
    g.threads.push  @fullID, @

  setPage: (pageNum) ->
    {info, reply} = @OP.nodes
    if not (icon = $ '.page-num', info)
      icon = $.el 'span', className: 'page-num'
      $.replace reply.parentNode.previousSibling, [$.tn(' '), icon, $.tn(' ')]
    icon.title       = "This thread is on page #{pageNum} in the original index."
    icon.textContent = "[#{pageNum}]"
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
    @setIcon 'Sticky',   @isSticky
    @setIcon 'Closed',   @isClosed and !@isArchived
    @setIcon 'Archived', @isArchived

  setIcon: (type, status) ->
    typeLC = type.toLowerCase()
    icon = $ ".#{typeLC}Icon", @OP.nodes.info
    return if !!icon is status

    unless status
      $.rm icon.previousSibling
      $.rm icon
      $.rm $ ".#{typeLC}Icon", @catalogView.nodes.icons if @catalogView
      return
    icon = $.el 'img',
      src: "#{g.SITE.Build.staticPath}#{typeLC}#{g.SITE.Build.gifIcon}"
      alt:   type
      title: type
      className: "#{typeLC}Icon retina"
    if g.BOARD.ID is 'f'
      icon.style.cssText = 'height: 18px; width: 18px;'

    root = if type isnt 'Sticky' and @isSticky
      $ '.stickyIcon', @OP.nodes.info
    else
      $('.page-num', @OP.nodes.info) or @OP.nodes.quote
    $.after root, [$.tn(' '), icon]

    return unless @catalogView
    (if type is 'Sticky' and @isClosed then $.prepend else $.add) @catalogView.nodes.icons, icon.cloneNode()

  kill: ->
    @isDead = true

  collect: ->
    n = 0
    @posts.forEach (post) ->
      if post.clones.length
        n++
      else
        post.collect()
    unless n
      g.threads.rm @fullID
      @board.threads.rm @
