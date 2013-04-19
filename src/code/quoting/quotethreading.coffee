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
    # Random access list
    #
    # 'Array' implementation is very awkward - mid-object inserts, loop to find
    # quoted post, loop to find inserted post(!), loop to find distance from
    # threaded post to thread root
    #
    # Of course, implementing your own data structure can be awkward.
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

    return if @thread.OP is qpost

    qroot = qpost.nodes.root
    threadContainer = qroot.nextSibling
    if threadContainer?.className isnt 'threadContainer'
      threadContainer = $.el 'div',
        className: 'threadContainer'
      $.after qroot, threadContainer

    $.add threadContainer, @nodes.root

  toggle: ->
    thread = $ '.thread'
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

# Keybind comes later.
#  public:
#    toggle: ->
#      control = $.id 'threadingControl'
#      control.checked = not control.checked
#      QuoteThreading.toggle.call control