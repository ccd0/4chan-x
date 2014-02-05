ExpandThread =
  init: ->
    return if g.VIEW isnt 'index' or !Conf['Thread Expansion']
    @statuses = {}
    $.on d, 'IndexRefresh', @onIndexRefresh

  setButton: (thread) ->
    return unless a = $.x 'following-sibling::a[contains(@class,"summary")][1]', thread.OP.nodes.root
    a.textContent = ExpandThread.text '+', a.textContent.match(/\d+/g)...
    $.on a, 'click', ExpandThread.cbToggle

  onIndexRefresh: ->
    for threadID, status of ExpandThread.statuses
      status.req?.abort()
      delete ExpandThread.statuses[threadID]
    for threadID, thread of g.BOARD.threads
      ExpandThread.setButton thread
    return

  text: (status, posts, files) ->
    text = [status]
    text.push "#{posts} post#{if posts > 1 then 's' else ''}"
    text.push "and #{files} image repl#{if files > 1 then 'ies' else 'y'}" if +files
    text.push if status is '-' then 'shown' else 'omitted'
    text.join(' ') + '.'

  cbToggle: (e) ->
    return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
    e.preventDefault()
    ExpandThread.toggle Get.threadFromNode @

  toggle: (thread) ->
    threadRoot = thread.OP.nodes.root.parentNode
    return unless a = $ '.summary', threadRoot
    if thread.ID of ExpandThread.statuses
      ExpandThread.contract thread, a, threadRoot
    else
      ExpandThread.expand   thread, a, threadRoot
  expand: (thread, a, threadRoot) ->
    ExpandThread.statuses[thread] = status = {}
    a.textContent = ExpandThread.text '...', a.textContent.match(/\d+/g)...
    status.req = $.cache "//a.4cdn.org/#{thread.board}/res/#{thread}.json", ->
      delete status.req
      ExpandThread.parse @, thread, a
  contract: (thread, a, threadRoot) ->
    status = ExpandThread.statuses[thread]
    delete ExpandThread.statuses[thread]
    if status.req
      status.req.abort()
      a.textContent = ExpandThread.text '+', a.textContent.match(/\d+/g)... if a
      return

    replies = $$ '.thread > .replyContainer', threadRoot
    if Conf['Show Replies']
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
    a.textContent = ExpandThread.text '+', postsCount, filesCount
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
      if post = thread.posts[postData.no]
        filesCount++ if 'file' of post
        postsRoot.push post.nodes.root
        continue
      root = Build.postFromObject postData, thread.board.ID
      post = new Post root, thread, thread.board
      filesCount++ if 'file' of post
      posts.push post
      postsRoot.push root
    Main.callbackNodes Post, posts
    $.after a, postsRoot
    a.textContent = ExpandThread.text '-', postsRoot.length, filesCount
