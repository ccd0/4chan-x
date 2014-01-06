###
  <3 aeosynth
###

QuoteThreading =
  init: ->
    return unless Conf['Quote Threading'] and g.VIEW is 'thread'

    @enabled = true
    @controls = $.el 'span',
      innerHTML: '<label><input id=threadingControl type=checkbox checked> Threading</label>'

    input = $ 'input', @controls
    $.on input, 'change', QuoteThreading.toggle

    $.event 'AddMenuEntry',
      type:  'header'
      el:    @controls
      order: 98

    $.on d, '4chanXInitFinished', QuoteThreading.setup unless Conf['Unread Count']

    Post.callbacks.push
      name: 'Quote Threading'
      cb:   @node

  setup: ->
    $.off d, '4chanXInitFinished', QuoteThreading.setup

    post.cb.call post for ID, post of g.posts when post.cb

    QuoteThreading.hasRun = true

  node: ->
    return if @isClone or not QuoteThreading.enabled
    if @thread.OP is @
      Unread.posts.push @ if Conf['Unread Count']
      return

    {quotes, ID, fullID} = @
    {posts} = g
    if !(post = posts[fullID]) or post.isHidden # Filtered
      Unread.posts.push @ if Conf['Unread Count']
      return

    keys = []
    len = "#{g.BOARD}".length + 1
    for quote in quotes when quote[len..] < ID
      keys.push quote if quote of posts

    unless keys.length is 1
      Unread.posts.push @ if Conf['Unread Count']
      return

    @threaded = keys[0]
    @cb       = QuoteThreading.nodeinsert

  nodeinsert: ->
    post    = g.posts[@threaded]
    {posts} = Unread

    if @thread.OP is post
      posts.push @ if Conf['Unread Count']
      return false

    if QuoteThreading.hasRun
      height  = doc.clientHeight
      {bottom, top} = post.nodes.root.getBoundingClientRect()

      # Post is unread or is fully visible.
      unless posts?[post.ID] or ((bottom < height) and (top > 0))
        posts.push @ if Conf['Unread Count']
        return false

    {root} = post.nodes
    unless $.hasClass root, 'threadOP'
      $.addClass root, 'threadOP'
      threadContainer = $.el 'div',
        className: 'threadContainer'
      $.after root, threadContainer
    else
      threadContainer = root.nextSibling
      post = Get.postFromRoot $.x 'descendant::div[contains(@class,"postContainer")][last()]', threadContainer

    $.add threadContainer, @nodes.root

    if not Conf['Unread Count'] or @ID < Unread.lastReadPost
      @prev = true # Force Unread Count to ignore this post
      return true

    posts.push @ unless posts[@ID]

    if posts[post.ID]
      posts.after post, @
      return true

    if (ID = posts.closest post.ID) isnt -1
      posts.after posts[ID], @
    else
      posts.prepend @

    return true

  toggle: ->
    if Conf['Unread Count']
      Unread.posts = new RandomAccessList
      Unread.ready()

    thread  = $ '.thread'
    replies = $$ '.thread > .replyContainer, .threadContainer > .replyContainer', thread
    QuoteThreading.enabled = @checked
    if @checked
      QuoteThreading.hasRun = false
      for reply in replies
        node = Get.postFromRoot reply
        if node.cb
          node.cb.call node
        else
          QuoteThreading.node.call node
          node.cb.call node if node.cb
      QuoteThreading.hasRun = true
    else
      replies.sort (a, b) ->
        aID = Number a.id[2..]
        bID = Number b.id[2..]
        aID - bID
      $.add thread, replies
      containers = $$ '.threadContainer', thread
      $.rm container for container in containers
      $.rmClass post, 'threadOP' for post in $$ '.threadOP'
    Unread.read() if Conf['Unread Count']

  kb: ->
    control = $.id 'threadingControl'
    control.checked = not control.checked
    QuoteThreading.toggle.call control