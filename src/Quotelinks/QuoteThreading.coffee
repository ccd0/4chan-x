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

    $.on d, '4chanXInitFinished', @setup

    Post.callbacks.push
      name: 'Quote Threading'
      cb:   @node

  setup: ->
    $.off d, '4chanXInitFinished', QuoteThreading.setup
    {posts} = g

    for ID, post of posts
      if post.cb
        post.cb.call post

    QuoteThreading.hasRun = true

  node: ->
    return if @isClone or not QuoteThreading.enabled or @thread.OP is @
    
    {replies} = Unread

    {quotes, ID, fullID} = @
    {posts} = g
    return if !(post = posts[fullID]) or post.isHidden # Filtered

    uniq = {}
    len = "#{g.BOARD}".length + 1
    for quote in quotes
      qid = quote
      continue unless qid[len..] < ID
      if qid of posts
        uniq[qid[len..]] = true

    keys = Object.keys uniq
    return unless keys.length is 1

    @threaded = "#{g.BOARD}.#{keys[0]}"
    @cb       = QuoteThreading.nodeinsert

  nodeinsert: ->
    qpost   = g.posts[@threaded]

    delete @threaded
    delete @cb

    return false if @thread.OP is qpost

    if QuoteThreading.hasRun
      height  = doc.clientHeight
      {bottom, top} = qpost.nodes.root.getBoundingClientRect()

      # Post is unread or is fully visible.
      return false unless Unread.posts[qpost.ID] or ((bottom < height) and (top > 0))

    qroot = qpost.nodes.root
    unless $.hasClass qroot, 'threadOP'
      $.addClass qroot, 'threadOP'
      threadContainer = $.el 'div',
        className: 'threadContainer'
      $.after qroot, threadContainer
    else
      threadContainer = qroot.nextSibling

    $.add threadContainer, @nodes.root
    return true

  toggle: ->
    Unread.replies = new RandomAccessList
    thread  = $ '.thread'
    replies = $$ '.thread > .replyContainer, .threadContainer > .replyContainer', thread
    QuoteThreading.enabled = @checked
    if @checked
      QuoteThreading.hasRun = false
      for reply in replies
        QuoteThreading.node.call node = Get.postFromRoot reply
        node.cb() if node.cb
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
    Unread.update true

  kb: ->
    control = $.id 'threadingControl'
    control.click()