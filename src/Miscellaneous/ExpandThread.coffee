ExpandThread =
  statuses: {}
  init: ->
    return if g.VIEW is 'thread' or !Conf['Thread Expansion']
    if Conf['JSON Index']
      $.on d, 'IndexRefreshInternal', @onIndexRefresh
    else
      Callbacks.Thread.push
        name: 'Expand Thread'
        cb: -> ExpandThread.setButton @

  setButton: (thread) ->
    return unless thread.nodes.root and (a = $ '.summary', thread.nodes.root)
    a.textContent = Build.summaryText '+', a.textContent.match(/\d+/g)...
    a.style.cursor = 'pointer'
    $.on a, 'click', ExpandThread.cbToggle
  
  disconnect: (refresh) ->
    return if g.VIEW is 'thread' or !Conf['Thread Expansion']
    for threadID, status of ExpandThread.statuses
      status.req?.abort()
      delete ExpandThread.statuses[threadID]

    $.off d, 'IndexRefreshInternal', @onIndexRefresh unless refresh

  onIndexRefresh: ->
    ExpandThread.disconnect true
    g.BOARD.threads.forEach (thread) ->
      ExpandThread.setButton thread

  cbToggle: (e) ->
    return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
    e.preventDefault()
    ExpandThread.toggle Get.threadFromNode @

  toggle: (thread) ->
    threadRoot = thread.nodes.root
    return unless a = $ '.summary', threadRoot
    if thread.ID of ExpandThread.statuses
      ExpandThread.contract thread, a, threadRoot
    else
      ExpandThread.expand thread, a

  expand: (thread, a) ->
    ExpandThread.statuses[thread] = status = {}
    a.textContent = Build.summaryText '...', a.textContent.match(/\d+/g)...
    status.req = $.cache "//a.4cdn.org/#{thread.board}/thread/#{thread}.json", ->
      delete status.req
      ExpandThread.parse @, thread, a

  contract: (thread, a, threadRoot) ->
    status = ExpandThread.statuses[thread]
    delete ExpandThread.statuses[thread]
    if status.req
      status.req.abort()
      a.textContent = Build.summaryText '+', a.textContent.match(/\d+/g)... if a
      return

    replies = $$ '.thread > .replyContainer', threadRoot
    if !Conf['JSON Index'] or Conf['Show Replies']
      num = if thread.isSticky
        1
      else switch g.BOARD.ID
        # XXX boards config
        when 'b', 'vg' then 3
        when 't' then 1
        else 5
      replies = replies[...-num]
    postsCount = 0
    filesCount = 0
    for reply in replies
      # rm clones
      inlined.click() while inlined = $ '.inlined', reply if Conf['Quote Inlining']
      postsCount++
      filesCount++ if 'file' of Get.postFromRoot reply
      $.rm reply
    a.textContent = Build.summaryText '+', postsCount, filesCount

  parse: (req, thread, a) ->
    if req.status not in [200, 304]
      a.textContent = "Error #{req.statusText} (#{req.status})"
      return

    Build.spoilerRange[thread.board] = req.response.posts[0].custom_spoiler

    posts      = []
    postsRoot  = []
    filesCount = 0
    for postData in req.response.posts
      continue if postData.no is thread.ID
      if (post = thread.posts[postData.no]) and not post.isFetchedQuote
        filesCount++ if 'file' of post
        postsRoot.push post.nodes.root
        continue
      root = Build.postFromObject postData, thread.board.ID
      post = new Post root, thread, thread.board
      filesCount++ if 'file' of post
      posts.push post
      postsRoot.push root
    Main.callbackNodes 'Post', posts
    $.after a, postsRoot
    $.event 'PostsInserted'

    postsCount    = postsRoot.length
    a.textContent = Build.summaryText '-', postsCount, filesCount
