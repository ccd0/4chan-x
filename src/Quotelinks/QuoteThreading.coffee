###
  <3 aeosynth
###

QuoteThreading =
  init: ->
    return unless Conf['Quote Threading'] and g.VIEW is 'thread'

    @enabled = true
    @controls = $.el 'span',
      <%= html('<label><input id="threadingControl" type="checkbox" checked> Threading</label>') %>

    @threadNewLink = $.el 'span',
      className: 'brackets-wrap threadnewlink'
      hidden: true
    $.extend @threadNewLink, <%= html('<a href="javascript:;">Thread New Posts</a>') %>
    
    @input = $('input', @controls)

    $.on @input, 'change', @cb.thread
    $.on @threadNewLink.firstElementChild, 'click', @cb.click
    $.one d, '4chanXInitFinished', @cb.thread

    Header.menu.addEntry @entry =
      el:    @controls
      order: 98

    Thread.callbacks.push
      name: 'Quote Threading'
      cb:   @setThread

    Post.callbacks.push
      name: 'Quote Threading'
      cb:   @node

  parent:   {}
  children: {}
  inserted: {}

  disconnect: ->
    return unless Conf['Quote Threading'] and g.VIEW is 'thread'

    Header.menu.rmEntry @entry

    @parent   = {}
    @children = {}
    @inserted = {}

    $.off @input, 'change', @cb.thread
    $.off d, '4chanXInitFinished', @cb.thread

    delete @enabled
    delete @controls
    delete @entry
    delete @input

    Thread.callbacks.disconnect 'Quote Threading'
    Post.callbacks.disconnect   'Quote Threading'

  setThread: ->
    QuoteThreading.thread = @
    $.asap (-> !Conf['Thread Updater'] or $ '.navLinksBot > .updatelink'), ->
      $.add $('.navLinksBot'), [$.tn(' '), QuoteThreading.threadNewLink]

  node: ->
    return if @isFetchedQuote or @isClone or !@isReply
    {thread} = QuoteThreading
    parents = (parent for quote in @quotes when (parent = g.posts[quote]) and
      not parent.isFetchedQuote and parent.isReply and parent.ID <= @ID
    )

    if parents.length is 1
      QuoteThreading.parent[@fullID] = parents[0]

  descendants: (post) ->
    posts = [post]
    if children = QuoteThreading.children[post.fullID]
      for child in children
        posts = posts.concat QuoteThreading.descendants child
    posts

  insert: (post) ->
    return false unless QuoteThreading.enabled and
      (parent = QuoteThreading.parent[post.fullID]) and
      !QuoteThreading.inserted[post.fullID]

    descendants = QuoteThreading.descendants post
    if !Unread.posts.has(parent.ID)
      if (do -> return true for x in descendants when Unread.posts.has x.ID)
        QuoteThreading.threadNewLink.hidden = false
        return false

    {order} = Unread
    children = (QuoteThreading.children[parent.fullID] or= [])
    threadContainer = parent.nodes.threadContainer or $.el 'div', className: 'threadContainer'
    nodes = [post.nodes.root]
    nodes.push post.nodes.threadContainer if post.nodes.threadContainer

    i = children.length
    i-- while (child = children[i]) and child.ID >= post.ID
    if i isnt children.length
      next = children[i]
      order.before order[next.ID], order[x.ID] for x in descendants
      children.splice i, 0, post
      $.before next.nodes.root, nodes
    else
      prev = parent
      while (prev2 = QuoteThreading.children[prev.fullID]) and prev2.length
        prev = prev2[prev2.length-1]
      order.after order[prev.ID], order[x.ID] for x in descendants by -1
      children.push post
      $.add threadContainer, nodes

    QuoteThreading.inserted[post.fullID] = true

    unless parent.nodes.threadContainer
      parent.nodes.threadContainer = threadContainer
      $.addClass parent.nodes.root, 'threadOP'
      $.after parent.nodes.root, threadContainer

    return true

  rethread: (enabled = true) ->
    {thread} = QuoteThreading
    {posts} = thread

    if QuoteThreading.enabled = enabled
      posts.forEach QuoteThreading.insert
    else
      nodes = []
      Unread.order = new RandomAccessList()
      QuoteThreading.inserted = {}
      posts.forEach (post) ->
        return if post.isFetchedQuote
        Unread.order.push post
        nodes.push post.nodes.root if post.isReply
        if QuoteThreading.children[post.fullID]
          delete QuoteThreading.children[post.fullID]
          $.rmClass post.nodes.root, 'threadOP'
          $.rm post.nodes.threadContainer
          delete post.nodes.threadContainer
      $.add thread.OP.nodes.root.parentNode, nodes

    Unread.position = Unread.order.first
    Unread.updatePosition()
    Unread.setLine true
    Unread.read()
    Unread.update()
  
  cb:
    thread: -> QuoteThreading.rethread QuoteThreading.input.checked
    click: ->
      QuoteThreading.threadNewLink.hidden = true
      QuoteThreading.cb.thread()