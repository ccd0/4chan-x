Unread =
  init: ->
    return if g.VIEW isnt 'thread' or
      !Conf['Unread Count'] and
      !Conf['Unread Favicon'] and
      !Conf['Unread Line'] and
      !Conf['Scroll to Last Read Post'] and
      !Conf['Thread Watcher'] and
      !Conf['Desktop Notifications'] and
      !Conf['Quote Threading']

    @db = new DataBoard 'lastReadPosts', @sync
    @hr = $.el 'hr',
      id: 'unread-line'
    @posts = new RandomAccessList
    @postsQuotingYou = new Set

    Thread.callbacks.push
      name: 'Unread'
      cb:   @node
    Post.callbacks.push
      name: 'Unread'
      cb:   @addPost

  readCount: 0

  node: ->
    Unread.thread = @
    Unread.title  = d.title
    Unread.lastReadPost = Unread.db.get
      boardID: @board.ID
      threadID: @ID
      defaultValue: 0
    for ID in @posts.keys when +ID <= Unread.lastReadPost
      Unread.readCount++
    $.one d, '4chanXInitFinished',      Unread.ready
    $.on  d, 'ThreadUpdate',            Unread.onUpdate
    $.on  d, 'scroll visibilitychange', Unread.read
    $.on  d, 'visibilitychange',        Unread.setLine if Conf['Unread Line'] and not Conf['Quote Threading']

  ready: ->
    if Conf['Quote Threading']
      QuoteThreading.force()
    else
      Unread.setLine true if Conf['Unread Line']
      Unread.read()
      Unread.update()
    Unread.scroll() if Conf['Scroll to Last Read Post'] and not Conf['Quote Threading']

  scroll: ->
    # Let the header's onload callback handle it.
    return if (hash = location.hash.match /\d+/) and hash[0] of Unread.thread.posts

    # Scroll to the last displayed non-deleted read post.
    {posts} = Unread.thread
    for i in [Unread.readCount-1..0] by -1
      {root} = posts[posts.keys[i]].nodes
      if root.getBoundingClientRect().height
        Header.scrollToIfNeeded root, true
        break
    return

  sync: ->
    return unless Unread.lastReadPost?
    lastReadPost = Unread.db.get
      boardID: Unread.thread.board.ID
      threadID: Unread.thread.ID
      defaultValue: 0
    return unless Unread.lastReadPost < lastReadPost
    Unread.lastReadPost = lastReadPost

    postIDs = Unread.thread.posts.keys
    for i in [Unread.readCount...postIDs.length] by 1
      ID = postIDs[i]
      break if +ID > Unread.lastReadPost
      Unread.posts.rm ID
      Unread.postsQuotingYou.delete ID
      Unread.readCount++

    Unread.setLine() if Conf['Unread Line'] and not Conf['Quote Threading']
    Unread.update()

  addPost: ->
    return if @isClone or @ID <= Unread.lastReadPost or !@isReply or @isHidden or QR.db?.get {
      boardID:  @board.ID
      threadID: @thread.ID
      postID:   @ID
    }
    Unread.posts.push @
    Unread.addPostQuotingYou @

  addPostQuotingYou: (post) ->
    for quotelink in post.nodes.quotelinks when QR.db?.get Get.postDataFromLink quotelink
      Unread.postsQuotingYou.add post.ID
      Unread.openNotification post
      return

  openNotification: (post) ->
    return unless Header.areNotificationsEnabled
    notif = new Notification "#{post.info.nameBlock} replied to you",
      body: post.info[if Conf['Remove Spoilers'] or Conf['Reveal Spoilers'] then 'comment' else 'commentSpoilered']
      icon: Favicon.logo
    notif.onclick = ->
      Header.scrollToIfNeeded post.nodes.root, true
      window.focus()
    notif.onshow = ->
      setTimeout ->
        notif.close()
      , 7 * $.SECOND

  onUpdate: (e) ->
    if !e.detail[404]
      # Force line on visible threads if there were no unread posts previously.
      Unread.setLine(!Unread.hr.parentNode) if Conf['Unread Line'] and not Conf['Quote Threading']
      Unread.read()
    Unread.update()

  readSinglePost: (post) ->
    {ID} = post
    {posts} = Unread
    return unless posts[ID]
    posts.rm ID
    Unread.postsQuotingYou.delete ID
    Unread.saveLastReadPost()
    Unread.update()

  read: $.debounce 100, (e) ->
    return if d.hidden or !Unread.posts.length
    height  = doc.clientHeight

    {posts} = Unread
    count = 0
    while post = posts.first
      break unless Header.getBottomOf(post.data.nodes.root) > -1 # post is not completely read
      {ID, data} = post
      count++
      posts.rm ID
      Unread.postsQuotingYou.delete ID

      if Conf['Mark Quotes of You'] and QR.db?.get {
        boardID:  data.board.ID
        threadID: data.thread.ID
        postID:   ID
      }
        QuoteYou.lastRead = data.nodes.root

    return unless count
    Unread.saveLastReadPost()
    Unread.update() if e

  saveLastReadPost: $.debounce 2 * $.SECOND, ->
    postIDs = Unread.thread.posts.keys
    for i in [Unread.readCount...postIDs.length] by 1
      ID = postIDs[i]
      break if Unread.posts[ID]
      Unread.lastReadPost = +ID
      Unread.readCount++
    return if Unread.thread.isDead and !Unread.thread.isArchived
    Unread.db.forceSync()
    Unread.db.set
      boardID:  Unread.thread.board.ID
      threadID: Unread.thread.ID
      val:      Unread.lastReadPost

  setLine: (force) ->
    return unless d.hidden or force is true
    return $.rm Unread.hr unless Unread.posts.length
    {posts} = Unread.thread
    for i in [Unread.readCount-1..0] by -1
      return $.after posts[posts.keys[i]].nodes.root, Unread.hr
    return

  update: ->
    count = Unread.posts.length
    countQuotingYou = Unread.postsQuotingYou.size

    if Conf['Unread Count']
      titleQuotingYou = if Conf['Quoted Title'] and countQuotingYou then '(!) ' else ''
      titleCount = if count or !Conf['Hide Unread Count at (0)'] then "(#{count}) " else ''
      titleDead = if Unread.thread.isDead
        Unread.title.replace '-', (if Unread.thread.isArchived then '- Archived -' else '- 404 -')
      else
        Unread.title
      d.title = "#{titleQuotingYou}#{titleCount}#{titleDead}"

    return unless Conf['Unread Favicon']

    Favicon.el.href =
      if Unread.thread.isDead
        if countQuotingYou
          Favicon.unreadDeadY
        else if count
          Favicon.unreadDead
        else
          Favicon.dead
      else
        if count
          if countQuotingYou
            Favicon.unreadY
          else
            Favicon.unread
        else
          Favicon.default

    <% if (type === 'userscript') { %>
    # `favicon.href = href` doesn't work on Firefox.
    $.add d.head, Favicon.el
    <% } %>
