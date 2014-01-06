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
    $.on input, 'change', @toggle

    $.event 'AddMenuEntry',
      type:  'header'
      el:    @controls
      order: 98

    $.on d, '4chanXInitFinished', @setup unless Conf['Unread Count']

    Post.callbacks.push
      name: 'Quote Threading'
      cb:   @node

  setup: ->
    $.off d, '4chanXInitFinished', QuoteThreading.setup

    post.cb() for ID, post of g.posts when post.cb
    QuoteThreading.hasRun = true

  node: ->
    {posts} = g
    return if @isClone or not QuoteThreading.enabled
    Unread.posts.push @ if Conf['Unread Count']

    return if @thread.OP is @ or !(post = posts[@fullID]) or post.isHidden # Filtered

    keys = []
    len = g.BOARD.ID.length + 1
    keys.push quote for quote in @quotes when (quote[len..] < @ID) and quote of posts

    return unless keys.length is 1

    @threaded = keys[0]
    @cb       = QuoteThreading.nodeinsert

  nodeinsert: ->
    post    = g.posts[@threaded]
    {posts} = Unread

    return false if @thread.OP is post

    if QuoteThreading.hasRun
      height  = doc.clientHeight
      {bottom, top} = post.nodes.root.getBoundingClientRect()

      # Post is unread or is fully visible.
      return false unless posts?[post.ID] or ((bottom < height) and (top > 0))

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

    return true unless Conf['Unread Count']

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

    if QuoteThreading.enabled = @checked
      QuoteThreading.hasRun = false
      for reply in replies
        post = Get.postFromRoot reply
        # QuoteThreading calculates whether or not posts should be threaded based on content
        # and then threads them based on thread context, so regardless of whether or not it
        # actually threads them all eligible posts WILL have a cb. Magic.
        post.cb() if post.cb
      QuoteThreading.hasRun = true

    else
      replies.sort (a, b) -> Number(a.id[2..]) - Number(b.id[2..])
      $.add thread, replies
      containers = $$ '.threadContainer', thread
      $.rm container for container in containers
      $.rmClass post, 'threadOP' for post in $$ '.threadOP'
    Unread.read() if Conf['Unread Count']

  kb: ->
    control = $.id 'threadingControl'
    control.checked = not control.checked
    QuoteThreading.toggle.call control