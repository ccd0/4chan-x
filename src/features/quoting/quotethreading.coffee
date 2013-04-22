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
      order: 115

    $.on d, '4chanXInitFinished', @setup

    Post::callbacks.push
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
    {posts} = g
    qpost   = posts[@threaded]

    delete @threaded
    delete @cb

    return false if @thread.OP is qpost 
    
    if QuoteThreading.hasRun
      height  = doc.clientHeight
      {bottom, top} = qpost.nodes.root.getBoundingClientRect()

      # Post is unread or is fully visible.
      return false unless Unread.posts.contains(qpost) or ((bottom < height) and (top > 0))

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
    thread  = $ '.thread'
    replies = $$ '.thread > .replyContainer, .threadContainer > .replyContainer', thread
    QuoteThreading.enabled = @checked
    if @checked
      nodes = (Get.postFromNode reply for reply in replies)
      Unread.node.call    node for node in nodes
      QuoteThreading.node node for node in nodes
    else
      replies.sort (a, b) ->
        aID = Number a.id[2..]
        bID = Number b.id[2..]
        aID - bID
      $.add thread, replies
      containers = $$ '.threadContainer', thread
      $.rm container for container in containers
      Unread.update true

  kb: ->
      control = $.id 'threadingControl'
      control.click()