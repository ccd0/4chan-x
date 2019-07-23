ExpandThread =
  statuses: {}
  init: ->
    return if not (g.VIEW is 'index' and Conf['Thread Expansion'])
    if Conf['JSON Index']
      $.on d, 'IndexRefreshInternal', @onIndexRefresh
    else
      Callbacks.Thread.push
        name: 'Expand Thread'
        cb: -> ExpandThread.setButton @

  setButton: (thread) ->
    return if not (thread.nodes.root and (a = $ '.summary', thread.nodes.root))
    a.textContent = g.SITE.Build.summaryText '+', a.textContent.match(/\d+/g)...
    a.style.cursor = 'pointer'
    $.on a, 'click', ExpandThread.cbToggle
  
  disconnect: (refresh) ->
    return if g.VIEW is 'thread' or !Conf['Thread Expansion']
    for threadID, status of ExpandThread.statuses
      if (oldReq = status.req)
        delete status.req
        oldReq.abort()
      delete ExpandThread.statuses[threadID]

    $.off d, 'IndexRefreshInternal', @onIndexRefresh unless refresh

  onIndexRefresh: ->
    ExpandThread.disconnect true
    g.BOARD.threads.forEach (thread) ->
      ExpandThread.setButton thread

  cbToggle: (e) ->
    return if $.modifiedClick e
    e.preventDefault()
    ExpandThread.toggle Get.threadFromNode @

  cbToggleBottom: (e) ->
    return if $.modifiedClick e
    e.preventDefault()
    thread = Get.threadFromNode @
    $.rm @ # remove before fixing bottom of thread position
    {bottom} = thread.nodes.root.getBoundingClientRect()
    ExpandThread.toggle thread
    window.scrollBy 0, (thread.nodes.root.getBoundingClientRect().bottom - bottom)

  toggle: (thread) ->
    return if not (thread.nodes.root and (a = $ '.summary', thread.nodes.root))
    if thread.ID of ExpandThread.statuses
      ExpandThread.contract thread, a, thread.nodes.root
    else
      ExpandThread.expand thread, a

  expand: (thread, a) ->
    ExpandThread.statuses[thread] = status = {}
    a.textContent = g.SITE.Build.summaryText '...', a.textContent.match(/\d+/g)...
    status.req = $.cache g.SITE.urls.threadJSON({boardID: thread.board.ID, threadID: thread.ID}), ->
      return if @ isnt status.req # aborted
      delete status.req
      ExpandThread.parse @, thread, a
    status.numReplies = $$(g.SITE.selectors.postContainer + g.SITE.selectors.relative.replyHighlight, thread.nodes.root).length

  contract: (thread, a, threadRoot) ->
    status = ExpandThread.statuses[thread]
    delete ExpandThread.statuses[thread]
    if (oldReq = status.req)
      delete status.req
      oldReq.abort()
      a.textContent = g.SITE.Build.summaryText '+', a.textContent.match(/\d+/g)... if a
      return

    replies = $$ '.thread > .replyContainer', threadRoot
    replies = replies[...(-status.numReplies)] if status.numReplies
    postsCount = 0
    filesCount = 0
    for reply in replies
      # rm clones
      inlined.click() while inlined = $ '.inlined', reply if Conf['Quote Inlining']
      postsCount++
      filesCount++ if 'file' of Get.postFromRoot reply
      $.rm reply
    if Index.enabled # otherwise handled by Main.addPosts
      $.event 'PostsRemoved', null, a.parentNode
    a.textContent = g.SITE.Build.summaryText '+', postsCount, filesCount
    $.rm $('.summary-bottom', threadRoot)

  parse: (req, thread, a) ->
    if req.status not in [200, 304]
      a.textContent = if req.status then "Error #{req.statusText} (#{req.status})" else 'Connection Error'
      return

    g.SITE.Build.spoilerRange[thread.board] = req.response.posts[0].custom_spoiler

    posts      = []
    postsRoot  = []
    filesCount = 0
    for postData in req.response.posts
      continue if postData.no is thread.ID
      if (post = thread.posts[postData.no]) and not post.isFetchedQuote
        filesCount++ if 'file' of post
        {root} = post.nodes
        postsRoot.push root
        continue
      root = g.SITE.Build.postFromObject postData, thread.board.ID
      post = new Post root, thread, thread.board
      filesCount++ if 'file' of post
      posts.push post
      postsRoot.push root
    Main.callbackNodes 'Post', posts
    $.after a, postsRoot
    $.event 'PostsInserted', null, a.parentNode

    postsCount    = postsRoot.length
    a.textContent = g.SITE.Build.summaryText '-', postsCount, filesCount

    if root
      a2 = a.cloneNode true
      a2.classList.add 'summary-bottom'
      $.on a2, 'click', ExpandThread.cbToggleBottom
      $.after root, a2
