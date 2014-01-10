Navigate =
  init: ->
    return if g.VIEW is 'catalog' or g.BOARD.ID is 'f'
    $.on window, 'popstate', Navigate.popstate

    Thread.callbacks.push
      name: 'Navigate'
      cb:   @thread

    Post.callbacks.push
      name: 'Navigate'
      cb:   @post

  thread: ->
    return if g.VIEW is 'thread' # The reply link only exist in index view
    replyLink = $ 'a.replylink', @OP.nodes.info
    $.on replyLink, 'click', Navigate.navigate

  post: ->
    # We don't need to reload the thread inside the thread
    return if g.VIEW is 'thread' and not @isClone
    postLink = $ 'a[title="Highlight this post"]', @nodes.info
    $.on postLink, 'click', Navigate.navigate

  clean: ->
    {posts, threads} = g

    # Garbage collection
    g.posts         = {}
    g.threads       = {}
    g.BOARD.posts   = {}
    g.BOARD.threads = {}

    # Delete nodes
    $.rmAll $ '.board'

  disconnect: ->
    features = if g.VIEW is 'thread'
      [
        ['Thread Updater',  ThreadUpdater]
        ['Unread Count',    Unread]
        ['Quote Threading', QuoteThreading]
        ['Thread Stats',    ThreadStats]
      ]
    else
      []

    for [name, feature] in features
      try
        feature.disconnect.call feature
      catch err
        errors = [] unless errors
        errors.push
          message: "Failed to disconnect feature #{name}."
          error:   err

      Main.handleErrors errors if errors

    return

  updateContext: (view) ->
    $.rmClass doc, g.VIEW
    $.addClass doc, view
    g.VIEW = view

  navigate: (e) ->
    return if @hostname isnt 'boards.4chan.org' or window.location.hostname is 'rs.4chan.org'

    path = @pathname.split '/'
    hash = @hash
    path.shift() if path[0] is ''
    [boardID, view, threadID] = path

    return if view is 'catalog' or 'f' in [boardID, g.BOARD.ID]

    e.preventDefault() if e
    history.pushState null, '', @pathname unless @id is 'popState'

    view = if threadID
      'thread'
    else
      view or 'index' # path is "/boardID/". See the problem?

    if view isnt g.VIEW
      Navigate.disconnect()
      Navigate.clean()
      Navigate.updateContext view

    if view is 'index'
      Navigate.updateBoard boardID unless boardID is g.BOARD.ID
      Index.update()

    # Moving from index to thread or thread to thread
    else
      onload = (e) -> Navigate.load e, hash
      Navigate.req = $.ajax "//a.4cdn.org/#{boardID}/res/#{threadID}.json",
        onabort:   onload
        onloadend: onload

      # Navigate.refresh {boardID, view, threadID}

  load: (e) ->
    $.rmClass Index.button, 'fa-spin'
    {req, notice} = Navigate
    delete Navigate.req
    delete Navigate.notice

    if e.type is 'abort'
      req.onloadend = null
      return

    try
      if req.status is 200
        Navigate.parse JSON.parse(req.response).posts
    catch err
      console.error 'Navigate failure:'
      console.log err
      # network error or non-JSON content for example.
      if notice
        notice.setType 'error'
        notice.el.lastElementChild.textContent = 'Navigation Failed.'
        setTimeout notice.close, 2 * $.SECOND
      else
        new Notice 'error', 'Navigation Failed.', 2
      return

    Navigate.buildThread()

    Header.scrollToIfNeeded $ '.board'

  parse: (data) ->
    board = g.BOARD
    threadRoot = Build.thread board, OP = data.shift(), true
    thread = new Thread OP.no, board

    nodes  = [threadRoot]
    posts  = []
    errors = null

    makePost = (postNode) ->
      try
        posts.push new Post postNode, thread, board
      catch err
        # Skip posts that we failed to parse.
        errors = [] unless errors
        errors.push
          message: "Parsing of Post No.#{thread.ID} failed. Post will be skipped."
          error: err

    makePost $('.opContainer', threadRoot)

    for obj in data
      nodes.push post = Build.postFromObject obj, board
      makePost post

    Main.handleErrors errors if errors

    # Add the thread to a container to make sure all features work.
    $.nodes Navigate.nodes = nodes
    Main.callbackNodes Thread, [thread]
    Main.callbackNodes Post,   posts

  buildThread: ->
    board = $ '.board'
    $.rmAll board
    $.add board, Navigate.nodes

  popstate: -> <% if (type === 'crx') { %> Navigate.popstate = -> <% } %> # blink/webkit throw a popstate on page load. Not what we want.
    a = $.el 'a',
      href: window.location
      id:   'popState'

    Navigate.navigate.call a

  updateBoard: (boardID) ->
    g.BOARD = new Board boardID

    req = null

    onload = (e) ->
      if e.type is 'abort'
        req.onloadend = null
        return

      return unless req.status is 200

      try
        for board in JSON.parse(req.response).boards
          return Navigate.updateTitle board if board.board is boardID

      catch err
        Main.handleErrors [
          message: "Navigation failed to update board name."
          error: err
        ]

      Header.setBoardList()

    req = $.ajax '//a.4cdn.org/boards.json',
      onabort:   onload
      onloadend: onload

  updateTitle: (board) ->
    $.rm subtitle if subtitle = $ '.boardSubtitle'
    $('.boardTitle').innerHTML = d.title = "/#{board.board}/ - #{board.title}"

  refresh: (context) ->
    return
    {boardID, view, threadID} = context

    # Refresh features
    feature.refresh() for [name, feature] in Main.features when feature.refresh
    return
