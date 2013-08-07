Unread =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Unread Count'] and !Conf['Unread Tab Icon']

    @db = new DataBoard 'lastReadPosts', @sync
    @hr = $.el 'hr',
      id: 'unread-line'
    @posts = []
    @postsQuotingYou = []

    Thread::callbacks.push
      name: 'Unread'
      cb:   @node

  node: ->
    Unread.thread = @
    Unread.title  = d.title
    Unread.lastReadPost = Unread.db.get
      boardID: @board.ID
      threadID: @ID
      defaultValue: 0
    $.on d, '4chanXInitFinished',      Unread.ready
    $.on d, 'ThreadUpdate',            Unread.onUpdate
    $.on d, 'scroll visibilitychange', Unread.read
    $.on d, 'visibilitychange',        Unread.setLine if Conf['Unread Line']

  ready: ->
    $.off d, '4chanXInitFinished', Unread.ready
    posts = []
    for ID, post of Unread.thread.posts
      posts.push post if post.isReply
    Unread.addPosts posts
    return unless Conf['Scroll to Last Read Post']
    Unread.scroll()

  scroll: ->
    # Let the header's onload callback handle it.
    return if (hash = location.hash.match /\d+/) and hash[0] of Unread.thread.posts
    if Unread.posts.length
      # Scroll to a non-hidden, non-OP post that's before the first unread post.
      post = Unread.posts[0]
      while root = $.x 'preceding-sibling::div[contains(@class,"replyContainer")][1]', post.nodes.root
        break unless (post = Get.postFromRoot root).isHidden
      return unless root
      onload = -> root.scrollIntoView false if checkPosition root
    else
      # Scroll to the last read post.
      posts  = Object.keys Unread.thread.posts
      {root} = Unread.thread.posts[posts[posts.length - 1]].nodes
      onload = -> Header.scrollToPost root if checkPosition root
    checkPosition = (target) ->
      # Don't scroll to the target if
      #  - it's visible.
      #  - we've scrolled past it.
      {top, height} = target.getBoundingClientRect()
      top + height - doc.clientHeight > 0
    # Prevent the browser to scroll back to
    # the previous scroll location on page load.
    $.on window, 'load', onload

  sync: ->
    lastReadPost = Unread.db.get
      boardID: Unread.thread.board.ID
      threadID: Unread.thread.ID
      defaultValue: 0
    return unless Unread.lastReadPost < lastReadPost
    Unread.lastReadPost = lastReadPost
    Unread.readArray Unread.posts
    Unread.readArray Unread.postsQuotingYou
    Unread.setLine()
    Unread.update()

  addPosts: (posts) ->
    for post in posts
      {ID} = post
      if ID <= Unread.lastReadPost or post.isHidden
        continue
      if QR.db
        data =
          boardID:  post.board.ID
          threadID: post.thread.ID
          postID:   post.ID
        continue if QR.db.get data
      Unread.posts.push post
      Unread.addPostQuotingYou post
    if Conf['Unread Line']
      # Force line on visible threads if there were no unread posts previously.
      Unread.setLine Unread.posts[0] in posts
    Unread.read()
    Unread.update()

  addPostQuotingYou: (post) ->
    return unless QR.db
    for quotelink in post.nodes.quotelinks
      if QR.db.get Get.postDataFromLink quotelink
        Unread.postsQuotingYou.push post
    return

  onUpdate: (e) ->
    if e.detail[404]
      Unread.update()
    else
      Unread.addPosts e.detail.newPosts

  readSinglePost: (post) ->
    return if (i = Unread.posts.indexOf post) is -1
    Unread.posts.splice i, 1
    if i is 0
      Unread.lastReadPost = post.ID
      Unread.saveLastReadPost()
    if (i = Unread.postsQuotingYou.indexOf post) isnt -1
      Unread.postsQuotingYou.splice i, 1
    Unread.update()

  readArray: (arr) ->
    for post, i in arr
      break if post.ID > Unread.lastReadPost
    arr.splice 0, i

  read: (e) ->
    return if d.hidden or !Unread.posts.length
    height = doc.clientHeight
    for post, i in Unread.posts
      {bottom} = post.nodes.root.getBoundingClientRect()
      break if bottom > height # post is not completely read
    return unless i

    Unread.lastReadPost = Unread.posts.splice(0, i)[i - 1].ID
    Unread.saveLastReadPost()
    Unread.readArray Unread.postsQuotingYou
    Unread.update() if e

  saveLastReadPost: ->
    return if Unread.thread.isDead
    Unread.db.set
      boardID:  Unread.thread.board.ID
      threadID: Unread.thread.ID
      val:      Unread.lastReadPost

  setLine: (force) ->
    return unless d.hidden or force is true
    if post = Unread.posts[0]
      {root} = post.nodes
      if root isnt $ '.thread > .replyContainer', root.parentNode # not the first reply
        $.before root, Unread.hr
    else
      $.rm Unread.hr

  update: <% if (type === 'crx') { %>(dontrepeat) <% } %>->
    count = Unread.posts.length

    if Conf['Unread Count']
      d.title = "#{if count or !Conf['Hide Unread Count at (0)'] then "(#{count}) " else ''}#{if g.DEAD then "/#{g.BOARD}/ - 404" else "#{Unread.title}"}"
      <% if (type === 'crx') { %>
      # XXX Chrome bug where it doesn't always update the tab title.
      # crbug.com/124381
      # Call it one second later,
      # but don't display outdated unread count.
      unless dontrepeat
        setTimeout ->
          d.title = ''
          Unread.update true
        , $.SECOND
      <% } %>

    return unless Conf['Unread Tab Icon']

    Favicon.el.href =
      if g.DEAD
        if Unread.postsQuotingYou.length
          Favicon.unreadDeadY
        else if count
          Favicon.unreadDead
        else
          Favicon.dead
      else
        if count
          if Unread.postsQuotingYou.length
            Favicon.unreadY
          else
            Favicon.unread
        else
          Favicon.default

    <% if (type === 'userscript') { %>
    # `favicon.href = href` doesn't work on Firefox.
    $.add d.head, Favicon.el
    <% } %>
