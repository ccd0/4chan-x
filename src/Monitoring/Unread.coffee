Unread =
  init: ->
    return if g.VIEW isnt 'thread' or
      !Conf['Unread Count'] and
      !Conf['Unread Favicon'] and
      !Conf['Unread Line'] and
      !Conf['Desktop Notifications'] and
      !(Conf['Thread Watcher'] and Conf['Show Unread Count'])

    @db = new DataBoard 'lastReadPosts', @sync
    @hr = $.el 'hr',
      id: 'unread-line'
    @posts = new RandomAccessList
    @postsQuotingYou = {}

    Thread.callbacks.push
      name: 'Unread'
      cb:   @node

  node: ->
    Unread.thread = @
    Unread.title  = d.title
    Unread.db.forceSync()
    Unread.lastReadPost = Unread.db.get
      boardID: @board.ID
      threadID: @ID
      defaultValue: 0
    $.on d, '4chanXInitFinished',      Unread.ready
    $.on d, 'ThreadUpdate',            Unread.onUpdate
    $.on d, 'scroll visibilitychange', Unread.read
    $.on d, 'visibilitychange',        Unread.setLine if Conf['Unread Line'] and not Conf['Quote Threading']

  ready: ->
    $.off d, '4chanXInitFinished', Unread.ready
    unless Conf['Quote Threading']
      posts = []
      Unread.thread.posts.forEach (post) -> posts.push post if post.isReply
      Unread.addPosts posts
    QuoteThreading.force() if Conf['Quote Threading']
    Unread.scroll() if Conf['Scroll to Last Read Post'] and not Conf['Quote Threading']

  scroll: ->
    # Let the header's onload callback handle it.
    return if (hash = location.hash.match /\d+/) and hash[0] of Unread.thread.posts
    if post = Unread.posts.first
      # Scroll to a non-hidden, non-OP post that's before the first unread post.
      while root = $.x 'preceding-sibling::div[contains(@class,"replyContainer")][1]', post.data.nodes.root
        break unless (post = Get.postFromRoot root).isHidden
      return unless root
      down = true
    else
      # Scroll to the last read post.
      {posts} = Unread.thread
      {keys}  = posts
      {root}  = posts[keys[keys.length - 1]].nodes

    # Scroll to the target unless we scrolled past it.
    Header.scrollTo root, down if Header.getBottomOf(root) < 0

  sync: ->
    return unless Unread.lastReadPost?
    lastReadPost = Unread.db.get
      boardID: Unread.thread.board.ID
      threadID: Unread.thread.ID
      defaultValue: 0
    return unless Unread.lastReadPost < lastReadPost
    Unread.lastReadPost = lastReadPost

    post = Unread.posts.first
    while post
      break if post.ID > Unread.lastReadPost
      {ID} = post
      post = post.next
      Unread.posts.rm ID
      delete Unread.postsQuotingYou[ID]

    Unread.setLine() if Conf['Unread Line'] and not Conf['Quote Threading']
    Unread.update()

  addPost: (post) ->
    return if post.ID <= Unread.lastReadPost or post.isHidden or QR.db?.get {
      boardID:  post.board.ID
      threadID: post.thread.ID
      postID:   post.ID
    }
    Unread.posts.push post
    Unread.addPostQuotingYou post

  addPosts: (posts) ->
    for post in posts
      Unread.addPost post
    if Conf['Unread Line'] and not Conf['Quote Threading']
      # Force line on visible threads if there were no unread posts previously.
      Unread.setLine Unread.posts.first?.data in posts
    Unread.read()
    Unread.update()

  addPostQuotingYou: (post) ->
    for quotelink in post.nodes.quotelinks when QR.db?.get Get.postDataFromLink quotelink
      Unread.postsQuotingYou[post.ID] = post
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
    if e.detail[404]
      Unread.update()
    else if !QuoteThreading.enabled
      Unread.addPosts(g.posts[fullID] for fullID in e.detail.newPosts)
    else
      Unread.read()
      Unread.update()

  readSinglePost: (post) ->
    {ID} = post
    {posts} = Unread
    return unless posts[ID]
    if post is posts.first and !(Conf['Quote Threading'] and Unread.posts.length)
      Unread.lastReadPost = ID
      Unread.saveLastReadPost()
    posts.rm ID
    delete Unread.postsQuotingYou[ID]
    Unread.update()

  read: $.debounce 100, (e) ->
    return if d.hidden or !Unread.posts.length
    height  = doc.clientHeight

    {posts} = Unread
    maxID = 0
    while post = posts.first
      break unless Header.getBottomOf(post.data.nodes.root) > -1 # post is not completely read
      {ID, data} = post
      maxID = Math.max maxID, ID
      posts.rm ID
      delete Unread.postsQuotingYou[ID]

      if Conf['Mark Quotes of You'] and QR.db?.get {
        boardID:  data.board.ID
        threadID: data.thread.ID
        postID:   ID
      }
        QuoteYou.lastRead = data.nodes.root

    return unless maxID

    unless Conf['Quote Threading'] and posts.length
      Unread.lastReadPost = maxID if Unread.lastReadPost < maxID or !Unread.lastReadPost
      Unread.saveLastReadPost()
    Unread.update() if e

  saveLastReadPost: $.debounce 2 * $.SECOND, ->
    return if Unread.thread.isDead and !Unread.thread.isArchived
    Unread.db.set
      boardID:  Unread.thread.board.ID
      threadID: Unread.thread.ID
      val:      Unread.lastReadPost

  setLine: (force) ->
    return unless d.hidden or force is true
    return $.rm Unread.hr unless post = Unread.posts.first
    if $.x 'preceding-sibling::div[contains(@class,"replyContainer")]', post.data.nodes.root # not the first reply
      $.before post.data.nodes.root, Unread.hr

  update: ->
    count = Unread.posts.length
    countQuotingYou = Object.keys(Unread.postsQuotingYou).length

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
