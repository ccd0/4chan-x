Index =
  init: ->
    return if g.VIEW isnt 'index'

    Index.button = $.el 'a',
      className: 'index-refresh-shortcut fa fa-refresh'
      title: 'Refresh Index'
      href: 'javascript:;'
    $.on Index.button, 'click', Index.update
    Header.addShortcut Index.button, 1

    modeEntry =
      el: $.el 'span', textContent: 'Index mode'
      subEntries: [
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Mode" value="paged"> Paged' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Mode" value="all pages"> All threads' }
      ]
    for label in modeEntry.subEntries
      input = label.el.firstChild
      input.checked = Conf['Index Mode'] is input.value
      $.on input, 'change', $.cb.value
      $.on input, 'change', @cb.mode

    sortEntry =
      el: $.el 'span', textContent: 'Sort by'
      subEntries: [
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="bump"> Bump order' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="birth"> Creation date' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="replycount"> Reply count' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="filecount"> File count' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="lastreply"> Last reply' }
      ]
    for label in sortEntry.subEntries
      input = label.el.firstChild
      input.checked = Conf['Index Sort'] is input.value
      $.on input, 'change', $.cb.value
      $.on input, 'change', @cb.sort

    $.event 'AddMenuEntry',
      type: 'header'
      el: $.el 'span',
        textContent: 'Index Navigation'
      order: 90
      subEntries: [modeEntry, sortEntry]

    $.addClass doc, 'index-loading'
    Index.togglePagelist()
    Index.root = $.el 'div', className: 'board'
    Index.update()
    $.asap (-> $('.board', doc) or d.readyState isnt 'loading'), ->
      $.replace $('.board'), Index.root
      $.rmClass doc, 'index-loading'

  cb:
    mode: ->
      Index.togglePagelist()
      Index.buildIndex()
    sort: ->
      Index.sort()
      Index.buildIndex()

  togglePagelist: ->
    (if Conf['Index Mode'] is 'paged' then $.rmClass else $.addClass) doc, 'index-hide-pagelist'

  update: ->
    return unless navigator.onLine
    Index.req?.abort()
    Index.notice?.close()
    Index.notice = new Notice 'info', 'Refreshing index...'
    Index.req = $.ajax "//api.4chan.org/#{g.BOARD}/catalog.json",
      onabort:   Index.load
      onloadend: Index.load
    ,
      whenModified: true
    $.addClass Index.button, 'fa-spin'
  load: (e) ->
    $.rmClass Index.button, 'fa-spin'
    {req, notice} = Index
    delete Index.req
    delete Index.notice

    if e.type is 'abort'
      req.onloadend = null
      notice.close()
      return

    try
      Index.parse JSON.parse req.response if req.status is 200
    catch err
      c.error err.stack
      # network error or non-JSON content for example.
      notice.setType 'error'
      notice.el.lastElementChild.textContent = 'Index refresh failed.'
      setTimeout notice.close, 2 * $.SECOND
      return

    notice.setType 'success'
    notice.el.lastElementChild.textContent = 'Index refreshed!'
    setTimeout notice.close, $.SECOND

    Header.scrollTo Index.root if Index.root.getBoundingClientRect().top < 0
  parse: (pages) ->
    Index.parseThreadList pages
    Index.buildAll()
    Index.sort()
    Index.buildIndex()
  parseThreadList: (pages) ->
    Index.threadsNumPerPage = pages[0].threads.length
    Index.liveThreadData    = pages.reduce ((arr, next) -> arr.concat next.threads), []
    Index.liveThreadIDs     = Index.liveThreadData.map (data) -> data.no
    for threadID, thread of g.BOARD.threads when thread.ID not in Index.liveThreadIDs
      thread.collect()
    return
  buildAll: ->
    Index.nodes = []
    threads     = []
    posts       = []
    for threadData in Index.liveThreadData
      threadRoot = Build.thread g.BOARD, threadData
      Index.nodes.push threadRoot, $.el 'hr'
      if thread = g.BOARD.threads[threadData.no]
        thread.setStatus 'Sticky', !!threadData.sticky
        thread.setStatus 'Closed', !!threadData.closed
      else
        thread = new Thread threadData.no, g.BOARD
        threads.push thread
      postRoots = $$ '.thread > .postContainer', threadRoot
      for postRoot in postRoots when postRoot.id.match(/\d+/)[0] not of thread.posts
        try
          posts.push new Post postRoot, thread, g.BOARD
        catch err
          # Skip posts that we failed to parse.
          unless errors
            errors = []
          errors.push
            message: "Parsing of Post No.#{postRoot.id.match /\d+/} failed. Post will be skipped."
            error: err
    Main.handleErrors errors if errors

    # Add the threads and <hr>s in a container to make sure all features work.
    $.nodes Index.nodes
    Main.callbackNodes Thread, threads
    Main.callbackNodes Post,   posts
  sort: ->
    switch Conf['Index Sort']
      when 'bump'
        sortedThreadIDs = Index.liveThreadIDs
      when 'birth'
        sortedThreadIDs = [Index.liveThreadIDs...].sort (a, b) -> b - a
      when 'replycount'
        sortedThreadIDs = [Index.liveThreadData...].sort((a, b) -> b.replies - a.replies).map (data) -> data.no
      when 'filecount'
        sortedThreadIDs = [Index.liveThreadData...].sort((a, b) -> b.images - a.images).map (data) -> data.no
      when 'lastreply'
        sortedThreadIDs = [Index.liveThreadData...].sort((a, b) ->
          a = a.last_replies[a.last_replies.length - 1] if 'last_replies' of a
          b = b.last_replies[b.last_replies.length - 1] if 'last_replies' of b
          b.no - a.no
        ).map (data) -> data.no
    Index.sortedNodes = []
    for threadID in sortedThreadIDs
      i = Index.liveThreadIDs.indexOf(threadID) * 2
      Index.sortedNodes.push Index.nodes[i], Index.nodes[i + 1]
    return unless Conf['Filter']
    # Put the highlighted thread & <hr> on top of the index
    # while keeping the original order they appear in.
    offset = 0
    for threadRoot, i in Index.sortedNodes by 2 when Get.threadFromRoot(threadRoot).isOnTop
      Index.sortedNodes.splice offset++ * 2, 0, Index.sortedNodes.splice(i, 2)...
    return
  buildIndex: ->
    if Conf['Index Mode'] is 'paged'
      pageNum = +window.location.pathname.split('/')[2]
      nodesPerPage = Index.threadsNumPerPage * 2
      nodes = Index.sortedNodes.slice nodesPerPage * pageNum, nodesPerPage * (pageNum + 1)
    else
      nodes = Index.sortedNodes
    $.event 'IndexRefresh'
    $.rmAll Index.root
    $.add Index.root, nodes
