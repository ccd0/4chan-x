Navigate =
  path:  window.location.pathname
  init: ->
    return if g.BOARD.ID is 'f' or !Conf['JSON Navigation']

    <% if (type === 'crx') { %>
    # blink/webkit throw a popstate on page load. Not what we want.
    popstateHack = -> 
      $.off window, 'popstate', popstateHack
      $.on  window, 'popstate', Navigate.popstate

    $.on window, 'popstate', popstateHack
    <% } else { %>
    $.on  window, 'popstate', Navigate.popstate
    <% } %>
    
    $.ready ->
      Navigate.makeBreadCrumb window.location, g.VIEW, g.BOARD.ID, g.THREADID
      $.add Index.navLinks, Navigate.el

    @title = -> return

    @el = $.el 'span',
      id: 'breadCrumb'

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

  post: -> # Allows us to navigate via JSON from thread to thread by hashes and quote highlights.
    # We don't need to reload the thread inside the thread
    unless g.VIEW is 'thread' and @thread.ID is g.THREADID
      $.on $('a[title="Highlight this post"]', @nodes.info), 'click', Navigate.navigate

    return unless (linktype = if Conf['Quote Inlining'] and Conf['Quote Hash Navigation']
      '.hashlink'
    else if !Conf['Quote Inlining']
      '.quotelink'
    else
      null
    )

    Navigate.quoteLink $$ linktype, @nodes.comment

  quoteLink: (links) ->
    for link in links
      Navigate.singleQuoteLink link
    return

  singleQuoteLink: (link) ->
    {boardID, threadID} = Get.postDataFromLink link
    if g.VIEW is 'index' or boardID isnt g.BOARD.ID or threadID isnt g.THREADID
      $.on link, 'click', Navigate.navigate

  clean: ->
    # Garbage collection
    g.threads.forEach (thread) -> thread.collect()
    QuoteBacklink.map = {} if Conf['Quote Backlinks'] # Containers can get pretty icky.
    $.rmAll $ '.board'

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

  updateContext: (view) ->
    g.DEAD     = false
    g.THREADID = +window.location.pathname.split('/')[3] if view is 'thread'

    return if view is g.VIEW

    $.rmClass  doc, g.VIEW
    $.addClass doc, view

    {
      index: ->
        delete g.THREADID
        QR.link.textContent = 'Start a Thread'
        Index.cb.toggleCatalogMode() if Conf['Index Mode'] is 'catalog'

      thread: ->
        QR.link.textContent = 'Reply to Thread'
        $.rmClass doc, 'catalog-mode' if Conf['Index Mode'] is 'catalog'
    }[view]()

    g.VIEW = view

  updateBoard: (boardID) ->
    fullBoardList   = $ '#full-board-list', Header.boardList
    $.rmClass $('.current', fullBoardList), 'current'
    $.addClass $("a[href*='/#{boardID}/']", fullBoardList), 'current'
    Header.generateBoardList Conf['boardnav'].replace /(\r\n|\n|\r)/g, ' '

    QR.flagsInput()

    $.cache '//a.4cdn.org/boards.json', ->
      try
        return unless @status is 200
        for aboard in @response.boards when aboard.board is boardID
          board = aboard
          break

      catch err
        Main.handleErrors [
          message: "Navigation failed to update board name."
          error: err
        ]

      return unless board
      Navigate.updateTitle board
      Navigate.updateSFW !!board.ws_board

  updateSFW: (sfw) ->
    Favicon.el.href = Favicon.default = "//s.4cdn.org/image/favicon#{if sfw then '-ws' else ''}.ico"

    # Changing the href alone doesn't update the icon on Firefox
    $.add d.head, Favicon.el

    return if Favicon.SFW is sfw # Board SFW status hasn't changed

    Favicon.SFW = sfw
    Favicon.update()

    findStyle = (type, base) ->
      style = d.cookie.match new RegExp "\b#{type}\_style\=([^;]+);\b"
      return ["#{type}_style", (if style then style[1] else base)]

    style = if sfw
      findStyle 'ws',  'Yotsuba B New'
    else
      findStyle 'nws', 'Yotsuba New'

    $.globalEval "var style_group = '#{style[0]}'"

    $('link[title=switch]', d.head).href = $("link[title='#{style[1]}']", d.head).href

    Main.setClass()

  updateTitle: ({board, title}) ->
    $.rm subtitle if subtitle = $ '.boardSubtitle'
    $('.boardTitle').textContent = d.title = "/#{board}/ - #{title}"

  setMode: (a) ->
    {indexMode, indexSort} = a.dataset
    result = false
    if indexMode and Conf['Index Mode'] isnt indexMode
      $.set 'Index Mode', Conf['Index Mode'] = Index.selectMode.value = indexMode
      Index.cb.mode()
      result = true

    if indexSort and Conf['Index Sort'] isnt indexSort
      $.set 'Index Sort', Conf['Index Sort'] = Index.selectSort.value = indexSort
      Index.cb.sort()
      result = true
    
    return result

  navigate: (e) ->
    return if @hostname isnt 'boards.4chan.org' or window.location.hostname is 'rs.4chan.org'
    if e
      if e.shiftKey or e.ctrlKey or (e.type is 'click' and e.button isnt 0) # Not simply a left click
        Navigate.setMode @ unless e?.button is 2 # Right Click
        return 

    if @pathname is Navigate.path
      if g.VIEW is 'thread'
        ThreadUpdater.update()
      else
        unless Index.searchTest()
          if Navigate.setMode @
            Index.buildIndex()
          else
            Index.update()
      e?.preventDefault()
      return

    $.addClass Index.button, 'fa-spin'

    [_, boardID, view, threadID] = @pathname.split '/'

    return if 'f' in [boardID, g.BOARD.ID]
    e?.preventDefault()
    Index.clearSearch() if Index.isSearching
    Navigate.title = -> return

    delete Index.pageNum
    $.rmAll Header.hover

    if threadID
      view = 'thread'
    else
      pageNum = view
      view = 'index' # path is "/boardID/". See the problem?

    path = @pathname
    path += @hash if @hash and view is 'thread'

    Navigate.makeBreadCrumb @href, view, boardID, threadID

    history.pushState null, '', path unless @id is 'popState'
    Navigate.path = @pathname

    Navigate.setMode @

    unless view is 'index' and 'index' is g.VIEW and boardID is g.BOARD.ID
      Navigate.disconnect()
      Navigate.updateContext view
      Navigate.clean()
      Navigate.reconnect()

    if boardID is g.BOARD.ID
      Navigate.title = -> d.title = $('.boardTitle').textContent if view is 'index'
    else
      g.BOARD = new Board boardID
      Navigate.title = -> Navigate.updateBoard boardID

    Navigate.updateSFW Favicon.SFW

    if view is 'index'
      return Index.update pageNum

    # Moving from index to thread or thread to thread
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

  makeBreadCrumb: (href, view, boardID, threadID) ->
    breadCrumb = $.el 'span',
      className: 'crumb'
      innerHTML: "<a href=#{href}>/#{boardID}/ - #{view.charAt(0).toUpperCase()}#{view.slice 1}#{if threadID then " No.#{threadID}" else ''}</a> &gt; "

    $.on breadCrumb.firstElementChild, 'click', Navigate.navigate

    {el} = Navigate
    $.add el, breadCrumb
    $.rm el.firstChild if el.children.length > 5

  parse: (data) ->
    posts      = []
    errors     = null
    board      = g.BOARD
    threadRoot = Build.thread board, OP = data[0], true
    thread     = new Thread OP.no, board

    makePost = (postNode) ->
      try
        posts.push new Post postNode, thread, board
      catch err
        # Skip posts that we failed to parse.
        errors = [] unless errors
        errors.push
          message: "Parsing of Post No.#{postNode.ID} failed. Post will be skipped."
          error: err

    makePost $('.opContainer', threadRoot)

    i = 0
    while obj = data[++i]
      post = Build.postFromObject obj, board
      makePost post
      $.add threadRoot, post

    Thread.callbacks.execute [thread]
    Post.callbacks.execute   posts

    QuoteThreading.force() if Conf['Quote Threading'] and not Conf['Unread Count']

    board = $ '.board'
    $.rmAll board
    $.add board, [threadRoot, $.el 'hr']

    Unread.ready() if Conf['Unread Count']

    QR.generatePostableThreadsList()
    Header.hashScroll.call window

    Main.handleErrors errors if errors

  popstate: ->
    a = $.el 'a',
      href: window.location
      id:   'popState'

    Navigate.navigate.call a
