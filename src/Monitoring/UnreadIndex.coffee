UnreadIndex =
  hasUnread: {}
  markReadLink: {}

  init: ->
    return unless g.VIEW is 'index' and Conf['Remember Last Read Post'] and Conf['Mark Read from Index']

    @db = new DataBoard 'lastReadPosts', @sync

    if Index.enabled
      $.on d, 'IndexRefreshInternal',
        @onIndexRefresh
    else
      Callbacks.Thread.push
        name: 'Mark Read from Index'
        cb:   @node

    Callbacks.Post.push
      name: 'Mark Read from Index'
      cb:   @addPost

  onIndexRefresh: ->
    g.threads.forEach (thread) ->
      UnreadIndex.addMarkReadLink thread
      UnreadIndex.update thread

  node: ->
    UnreadIndex.addMarkReadLink @
    UnreadIndex.update @

  addPost: ->
    if @ID is @thread.lastPost
      UnreadIndex.update @thread

  sync: ->
    g.threads.forEach UnreadIndex.update

  addMarkReadLink: (thread) ->
    return unless thread.nodes.root
    link = UnreadIndex.markReadLink[thread.fullID]
    unless link
      link = UnreadIndex.markReadLink[thread.fullID] = $.el 'a',
        className: 'unread-mark-read brackets-wrap'
        href: 'javascript:;'
        textContent: 'Mark Read'
      $.on link, 'click', UnreadIndex.markRead
    if link.parentNode isnt thread.nodes.root
      $.add thread.nodes.root, link

  update: (thread) ->
    return unless thread.nodes.root
    lastReadPost = UnreadIndex.db.get(
      boardID: thread.board.ID
      threadID: thread.ID
    ) or 0
    hasUnread = (lastReadPost < thread.lastPost)
    if hasUnread isnt UnreadIndex.hasUnread[thread.fullID]
      thread.nodes.root.classList.toggle 'unread-thread', hasUnread

  markRead: ->
    thread = Get.threadFromNode @
    UnreadIndex.db.set
      boardID:  thread.board.ID
      threadID: thread.ID
      val:      thread.lastPost
    UnreadIndex.update thread
    ThreadWatcher.update thread.board.ID, thread.ID,
      unread: 0
      quotingYou: false
