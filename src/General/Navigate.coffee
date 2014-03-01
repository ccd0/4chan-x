Navigate =
  path:  window.location.pathname
  init: ->
    return if g.VIEW is 'catalog' or g.BOARD.ID is 'f' or !Conf['JSON Navigation']

    $.ready -> 
      # blink/webkit throw a popstate on page load. Not what we want.
      $.on window, 'popstate', Navigate.popstate

    @title = -> return

    Thread.callbacks.push
      name: 'Navigate'
      cb:   @thread

    Post.callbacks.push
      name: 'Navigate'
      cb:   @post

  thread: ->
    return if g.VIEW is 'thread' # The reply link only exists in index view
    replyLink = $ 'a.replylink', @OP.nodes.info
    $.on replyLink, 'click', Navigate.navigate

  post: ->
    # We don't need to reload the thread inside the thread
    return if g.VIEW is 'thread' and @thread.ID is g.THREADID
    postlink = $ 'a[title="Highlight this post"]', @nodes.info
    $.on postlink, 'click', Navigate.navigate

    return unless Conf['Quote Hash Navigation']
    for hashlink in $$ '.hashlink', @nodes.comment
      $.on hashlink, 'click', Navigate.navigate
    return

  clean: ->
    # Garbage collection
    g.threads.forEach (thread) -> thread.collect()
    QuoteBacklink.containers = {}

    $.rmAll $('.board')

  features: [
    ['Thread Excerpt',   ThreadExcerpt]
    ['Unread Count',     Unread]
    ['Quote Threading',  QuoteThreading]
    ['Thread Stats',     ThreadStats]
    ['Thread Updater',   ThreadUpdater]
    ['Thread Expansion', ExpandThread]
  ]

  disconnect: ->
    for [name, feature] in Navigate.features
      try
        feature.disconnect()
      catch err
        errors = [] unless errors
        errors.push
          message: "Failed to disconnect feature #{name}."
          error:   err

      Main.handleErrors errors if errors

    return

  reconnect: ->
    for [name, feature] in Navigate.features
      try
        feature.init()
      catch err
        errors = [] unless errors
        errors.push
          message: "Failed to reconnect feature #{name}."
          error:   err
    Main.handleErrors errors if errors
    return

  ready: (name, feature, condition) ->
    try
      feature() if condition
    catch err
      error = [
        message: "#{name} Failed."
        error:   err
      ]
    Main.handleErrors error if error
    QR.generatePostableThreadsList()

  updateContext: (view) ->
    g.DEAD = false

    unless view is g.VIEW
      $.rmClass doc, g.VIEW
      $.addClass doc, view

    oldView = g.VIEW
    g.VIEW = view
    {
      index: ->
        return if oldView is g.VIEW
        delete g.THREADID
        QR.link.textContent = 'Start a Thread'
        $.off d, 'ThreadUpdate', QR.statusCheck
        $.on  d, 'IndexRefresh', QR.generatePostableThreadsList
      thread: ->
        g.THREADID = +window.location.pathname.split('/')[3]
        return if oldView is g.VIEW
        QR.link.textContent = 'Reply to Thread'
        $.on  d, 'ThreadUpdate', QR.statusCheck
        $.off d, 'IndexRefresh', QR.generatePostableThreadsList
    }[g.VIEW]()

  updateBoard: (boardID) ->
    fullBoardList   = $ '#full-board-list', Header.boardList
    $.rmClass $('.current', fullBoardList), 'current'
    $.addClass $("a[href*='/#{boardID}/']", fullBoardList), 'current'
    Header.generateBoardList Conf['boardnav'].replace /(\r\n|\n|\r)/g, ' '

    QR.flagsInput()

    $.cache '//a.4cdn.org/boards.json', ({target}) ->
      return unless target.status is 200

      try
        for aboard in target.response.boards when aboard.board is boardID
          board = aboard
          break

      catch err
        Main.handleErrors [
          message: "Navigation failed to update board name."
          error: err
        ]
        return false

      return unless board
      Navigate.updateTitle board
      Navigate.updateSFW !!board.ws_board

  updateSFW: (sfw) ->
    # TODO: think of a better name for this. Changes style, too.
    Favicon.el.href = "//s.4cdn.org/image/favicon#{if sfw then '-ws' else ''}.ico"
    $.add d.head, Favicon.el # Changing the href alone doesn't update the icon on Firefox

    return if Favicon.SFW is sfw # Board SFW status hasn't changed

    Favicon.SFW = sfw
    Favicon.update()
    findStyle = (type, base) ->
      style = d.cookie.match new RegExp "\b#{type}\_style\=([^;]+);\b"
      return ["#{type}_style", (if style then style[1] else base)]

    style = findStyle (if sfw
      ['ws',  'Yotsuba B New']
    else
      ['nws', 'Yotsuba New'])...

    $.globalEval "var style_group = '#{style[0]}'"

    $('link[title=switch]', d.head).href = $("link[title='#{style[1]}']", d.head).href

    Main.setClass()

  updateTitle: ({board, title}) ->
    $.rm subtitle if subtitle = $ '.boardSubtitle'
    $('.boardTitle').textContent = d.title = "/#{board}/ - #{title}"

  navigate: (e) ->
    return if @hostname isnt 'boards.4chan.org' or window.location.hostname is 'rs.4chan.org' or
      (e and (e.shiftKey or e.ctrlKey or (e.type is 'click' and e.button isnt 0))) # Not simply a left click

    $.addClass Index.button, 'fa-spin'

    path = @pathname.split '/'
    path.shift() if path[0] is ''
    [boardID, view, threadID] = path

    return if 'f' in [boardID, g.BOARD.ID]
    e.preventDefault() if e
    Navigate.title = -> return

    delete Index.pageNum

    path = @pathname
    path += @hash if @hash

    history.pushState null, '', path unless @id is 'popState'
    Navigate.path = @pathname

    if threadID
      view = 'thread'
    else
      pageNum = view
      view = 'index' # path is "/boardID/". See the problem?

    {indexMode, indexSort} = @dataset
    if indexMode and Conf['Index Mode'] isnt indexMode
      $.set 'Index Mode', indexMode
      Conf['Index Mode'] = indexMode
      Index.selectMode.value = indexMode
      Index.cb.mode()
    if indexSort and Conf['Index Sort'] isnt indexSort
      $.set 'Index Sort', indexSort
      Conf['Index Sort'] = indexSort
      Index.selectSort.value = indexSort
      Index.cb.sort()

    if view is g.VIEW and boardID is g.BOARD.ID
      Navigate.updateContext view
    else # We've navigated somewhere we weren't before!
      Navigate.disconnect()
      Navigate.updateContext view
      Navigate.clean()
      Navigate.reconnect()

    if boardID is g.BOARD.ID
      Navigate.title = -> d.title = $('.boardTitle').textContent if view is 'index'
    else
      g.BOARD = new Board boardID
      Navigate.title = -> Navigate.updateBoard boardID

    if view is 'index'
      Index.update pageNum

    # Moving from index to thread or thread to thread
    else
      Navigate.updateSFW Favicon.SFW
      {load} = Navigate
      Navigate.req = $.ajax "//a.4cdn.org/#{boardID}/res/#{threadID}.json",
        onabort:   load
        onloadend: load

      setTimeout (->
        if Navigate.req and !Navigate.notice
          Navigate.notice = new Notice 'info', 'Loading thread...'
      ), 3 * $.SECOND

  load: (e) ->
    $.rmClass Index.button, 'fa-spin'
    {req, notice} = Navigate
    notice?.close()
    delete Navigate.req
    delete Navigate.notice

    if e.type is 'abort' or req.status isnt 200
      req.onloadend = null
      new Notice 'warning', "Failed to load thread.#{if req.status then " #{req.status}" else ''}"
      return

    Navigate.title()

    try
      Navigate.parse req.response.posts
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

  parse: (data) ->
    board = g.BOARD
    Navigate.threadRoot = threadRoot = Build.thread board, OP = data.shift(), true
    thread = new Thread OP.no, board

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
      post = Build.postFromObject obj, board
      makePost post
      $.add threadRoot, post

    Main.handleErrors errors if errors

    Main.callbackNodes Thread, [thread]
    Main.callbackNodes Post,   posts

    Navigate.ready 'Quote Threading', QuoteThreading.force, Conf['Quote Threading'] and not Conf['Unread Count']

    Navigate.buildThread()
    Header.hashScroll.call window

  buildThread: ->
    board = $ '.board'
    $.rmAll board
    $.add board, [Navigate.threadRoot, $.el 'hr']

    if Conf['Unread Count']
      Navigate.ready 'Unread Count', Unread.ready, Conf['Unread Count']

  popstate: ->
    return if window.location.pathname is Navigate.path
    a = $.el 'a',
      href: window.location
      id:   'popState'

    Navigate.navigate.call a
