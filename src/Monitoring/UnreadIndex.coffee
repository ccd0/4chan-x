UnreadIndex =
  lastReadPost: $.dict()
  hr:           $.dict()
  markReadLink: $.dict()

  init: ->
    return unless g.VIEW is 'index' and Conf['Remember Last Read Post'] and Conf['Unread Line in Index']

    @enabled = true
    @db = new DataBoard 'lastReadPosts', @sync

    Callbacks.Thread.push
      name: 'Unread Line in Index'
      cb:   @node

    $.on d, 'IndexRefreshInternal', @onIndexRefresh
    $.on d, 'PostsInserted PostsRemoved', @onPostsInserted

  node: ->
    UnreadIndex.lastReadPost[@fullID] = UnreadIndex.db.get(
      boardID: @board.ID
      threadID: @ID
    ) or 0
    if !Index.enabled # let onIndexRefresh handle JSON Index
      UnreadIndex.update @

  onIndexRefresh: (e) ->
    return if e.detail.isCatalog
    for threadID in e.detail.threadIDs
      thread = g.threads.get(threadID)
      UnreadIndex.update thread

  onPostsInserted: (e) ->
    return if e.target is Index.root # onIndexRefresh handles this case
    thread = Get.threadFromNode e.target
    return if !thread or thread.nodes.root isnt e.target
    wasVisible = !!UnreadIndex.hr[thread.fullID]?.parentNode
    UnreadIndex.update thread
    if Conf['Scroll to Last Read Post'] and e.type is 'PostsInserted' and !wasVisible and !!UnreadIndex.hr[thread.fullID]?.parentNode
      Header.scrollToIfNeeded UnreadIndex.hr[thread.fullID], true

  sync: ->
    g.threads.forEach (thread) ->
      lastReadPost = UnreadIndex.db.get(
        boardID: thread.board.ID
        threadID: thread.ID
      ) or 0
      if lastReadPost isnt UnreadIndex.lastReadPost[thread.fullID]
        UnreadIndex.lastReadPost[thread.fullID] = lastReadPost
        if thread.nodes.root?.parentNode
          UnreadIndex.update thread

  update: (thread) ->
    lastReadPost = UnreadIndex.lastReadPost[thread.fullID]
    repliesShown = 0
    repliesRead = 0
    firstUnread = null
    thread.posts.forEach (post) ->
      if post.isReply and thread.nodes.root.contains(post.nodes.root)
        repliesShown++
        if post.ID <= lastReadPost
          repliesRead++
        else if (!firstUnread or post.ID < firstUnread.ID) and !post.isHidden and !QuoteYou.isYou(post)
          firstUnread = post

    hr = UnreadIndex.hr[thread.fullID]
    if firstUnread and (repliesRead or (lastReadPost is thread.OP.ID and (!$(g.SITE.selectors.summary, thread.nodes.root) or thread.ID of ExpandThread.statuses)))
      if !hr
        hr = UnreadIndex.hr[thread.fullID] = $.el 'hr',
          className: 'unread-line'
      $.before firstUnread.nodes.root, hr
    else
      $.rm hr

    hasUnread = if repliesShown
      firstUnread or !repliesRead
    else if Index.enabled
      thread.lastPost > lastReadPost
    else
      thread.OP.ID > lastReadPost
    thread.nodes.root.classList.toggle 'unread-thread', hasUnread

    link = UnreadIndex.markReadLink[thread.fullID]
    if !link
      link = UnreadIndex.markReadLink[thread.fullID] = $.el 'a',
        className: 'unread-mark-read brackets-wrap'
        href: 'javascript:;'
        textContent: 'Mark Read'
      $.on link, 'click', UnreadIndex.markRead
    if (divider = $ g.SITE.selectors.threadDivider, thread.nodes.root) # divider inside thread as in Tinyboard
      $.before divider, link
    else
      $.add thread.nodes.root, link

  markRead: ->
    thread = Get.threadFromNode @
    UnreadIndex.lastReadPost[thread.fullID] = thread.lastPost
    UnreadIndex.db.set
      boardID:  thread.board.ID
      threadID: thread.ID
      val:      thread.lastPost
    $.rm UnreadIndex.hr[thread.fullID]
    thread.nodes.root.classList.remove 'unread-thread'
    ThreadWatcher.update g.SITE.ID, thread.board.ID, thread.ID,
      last: thread.lastPost
      unread: 0
      quotingYou: 0
