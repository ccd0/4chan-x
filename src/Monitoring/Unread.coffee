Unread =
  init: ->
    return unless g.VIEW is 'thread' and (
      Conf['Unread Count'] or
      Conf['Unread Favicon'] or
      Conf['Unread Line'] or
      Conf['Remember Last Read Post'] or
      Conf['Desktop Notifications'] or
      Conf['Quote Threading']
    )

    if Conf['Remember Last Read Post']
      $.sync 'Remember Last Read Post', (enabled) -> Conf['Remember Last Read Post'] = enabled
      @db = new DataBoard 'lastReadPosts', @sync

    @hr = $.el 'hr',
      id: 'unread-line'
      className: 'unread-line'
    @posts = new Set()
    @postsQuotingYou = new Set()
    @order = new RandomAccessList()
    @position = null

    Callbacks.Thread.push
      name: 'Unread'
      cb:   @node

    Callbacks.Post.push
      name: 'Unread'
      cb:   @addPost

    <% if (readJSON('/.tests_enabled')) { %>
    testLink = $.el 'a',
      textContent: 'Test Post Order'
    $.on testLink, 'click', ->
      list1 = (x.ID for x in Unread.order.order())
      list2 = (+x.id.match(/\d*$/)[0] for x in $$ (if Site.isOPContainerThread then "#{Site.selectors.thread}, " else '') + Site.selectors.postContainer)
      pass = do ->
        return false unless list1.length is list2.length
        for i in [0...list1.length] by 1
          return false if list1[i] isnt list2[i]
        true
      if pass
        new Notice 'success', "Orders same (#{list1.length} posts)", 5
      else
        new Notice 'warning', 'Orders differ.', 30
        c.log list1
        c.log list2
    Header.menu.addEntry
      el: testLink
    <% } %>

  node: ->
    Unread.thread = @
    Unread.title  = d.title
    Unread.lastReadPost = Unread.db?.get(
      boardID: @board.ID
      threadID: @ID
    ) or 0
    Unread.readCount = 0
    Unread.readCount++ for ID in @posts.keys when +ID <= Unread.lastReadPost
    $.one d, '4chanXInitFinished', Unread.ready
    $.on  d, 'ThreadUpdate',       Unread.onUpdate

  ready: ->
    Unread.scroll() if Conf['Remember Last Read Post'] and Conf['Scroll to Last Read Post']
    Unread.setLine true
    Unread.read()
    Unread.update()
    $.on  d, 'scroll visibilitychange', Unread.read
    $.on  d, 'visibilitychange',        Unread.setLine if Conf['Unread Line']

  positionPrev: ->
    if Unread.position then Unread.position.prev else Unread.order.last

  scroll: ->
    # Let the header's onload callback handle it.
    return if (hash = location.hash.match /\d+/) and hash[0] of Unread.thread.posts

    position = Unread.positionPrev()
    while position
      {bottom} = position.data.nodes
      if !bottom.getBoundingClientRect().height
        # Don't try to scroll to posts with display: none
        position = position.prev
      else
        Header.scrollToIfNeeded bottom, true
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
      ID = +postIDs[i]
      unless Unread.thread.posts[ID].isFetchedQuote
        break if ID > Unread.lastReadPost
        Unread.posts.delete ID
        Unread.postsQuotingYou.delete ID
      Unread.readCount++

    Unread.updatePosition()
    Unread.setLine()
    Unread.update()

  addPost: ->
    return if @isFetchedQuote or @isClone
    Unread.order.push @
    return if @ID <= Unread.lastReadPost or @isHidden or QuoteYou.isYou(@)
    Unread.posts.add @ID
    Unread.addPostQuotingYou @
    Unread.position ?= Unread.order[@ID]

  addPostQuotingYou: (post) ->
    for quotelink in post.nodes.quotelinks when QuoteYou.db?.get Get.postDataFromLink quotelink
      Unread.postsQuotingYou.add post.ID
      Unread.openNotification post
      return

  openNotification: (post) ->
    return unless Header.areNotificationsEnabled
    notif = new Notification "#{post.info.nameBlock} replied to you",
      body: post.commentDisplay()
      icon: Favicon.logo
    notif.onclick = ->
      Header.scrollToIfNeeded post.nodes.bottom, true
      window.focus()
    notif.onshow = ->
      setTimeout ->
        notif.close()
      , 7 * $.SECOND

  onUpdate: (e) ->
    if !e.detail[404]
      Unread.setLine()
      Unread.read()
    Unread.update()

  readSinglePost: (post) ->
    {ID} = post
    return unless Unread.posts.has ID
    Unread.posts.delete ID
    Unread.postsQuotingYou.delete ID
    Unread.updatePosition()
    Unread.saveLastReadPost()
    Unread.update()

  read: $.debounce 100, (e) ->
    # Update the lastReadPost when hidden posts are added to the thread.
    if !Unread.posts.size and Unread.readCount isnt Unread.thread.posts.keys.length
      Unread.saveLastReadPost()

    return if d.hidden or !Unread.posts.size

    count = 0
    while Unread.position
      {ID, data} = Unread.position
      {bottom} = data.nodes
      break unless !bottom.getBoundingClientRect().height or # post has been hidden
        Header.getBottomOf(bottom) > -1                      # post is completely read
      count++
      Unread.posts.delete ID
      Unread.postsQuotingYou.delete ID
      Unread.position = Unread.position.next

    return unless count
    Unread.updatePosition()
    Unread.saveLastReadPost()
    (Unread.update() if e)

  updatePosition: ->
    while Unread.position and !Unread.posts.has Unread.position.ID
      Unread.position = Unread.position.next
    return

  saveLastReadPost: $.debounce 2 * $.SECOND, ->
    $.forceSync 'Remember Last Read Post'
    return unless Conf['Remember Last Read Post'] and Unread.db
    postIDs = Unread.thread.posts.keys
    for i in [Unread.readCount...postIDs.length] by 1
      ID = +postIDs[i]
      unless Unread.thread.posts[ID].isFetchedQuote
        break if Unread.posts.has ID
        Unread.lastReadPost = ID
      Unread.readCount++
    return if Unread.thread.isDead and !Unread.thread.isArchived
    Unread.db.set
      boardID:  Unread.thread.board.ID
      threadID: Unread.thread.ID
      val:      Unread.lastReadPost

  setLine: (force) ->
    return unless Conf['Unread Line']
    if Unread.hr.hidden or d.hidden or (force is true)
      if (Unread.linePosition = Unread.positionPrev())
        $.after (Unread.linePosition.data.nodes.bottom), Unread.hr
      else
        $.rm Unread.hr
    Unread.hr.hidden = Unread.linePosition is Unread.order.last

  update: ->
    count = Unread.posts.size
    countQuotingYou = Unread.postsQuotingYou.size

    if Conf['Unread Count']
      titleQuotingYou = if Conf['Quoted Title'] and countQuotingYou then '(!) ' else ''
      titleCount = if count or !Conf['Hide Unread Count at (0)'] then "(#{count}) " else ''
      titleDead = if Unread.thread.isDead
        Unread.title.replace '-', (if Unread.thread.isArchived then '- Archived -' else '- 404 -')
      else
        Unread.title
      d.title = "#{titleQuotingYou}#{titleCount}#{titleDead}"

    Unread.saveThreadWatcherCount()

    if Conf['Unread Favicon'] and Site.software is 'yotsuba'
      {isDead} = Unread.thread
      Favicon.el.href =
        if countQuotingYou
          Favicon[if isDead then 'unreadDeadY' else 'unreadY']
        else if count
          Favicon[if isDead then 'unreadDead' else 'unread']
        else
          Favicon[if isDead then 'dead' else 'default']
      # `favicon.href = href` doesn't work on Firefox.
      $.add d.head, Favicon.el

  saveThreadWatcherCount: $.debounce 2 * $.SECOND, ->
    $.forceSync 'Remember Last Read Post'
    if Conf['Remember Last Read Post'] and (!Unread.thread.isDead or Unread.thread.isArchived)
      ThreadWatcher.update Unread.thread.board.ID, Unread.thread.ID,
        isDead: Unread.thread.isDead
        unread: Unread.posts.size
        quotingYou: !!(if !Conf['Require OP Quote Link'] and QuoteYou.isYou(Unread.thread.OP) then Unread.posts.size else Unread.postsQuotingYou.size)
