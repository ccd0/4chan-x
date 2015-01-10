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

    $.on $('input', @controls), 'change', ->
      QuoteThreading.rethread @checked
    $.on @threadNewLink.firstElementChild, 'click', ->
      QuoteThreading.threadNewLink.hidden = true
      QuoteThreading.rethread true

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

  setThread: ->
    QuoteThreading.thread = @
    $.asap (-> !Conf['Thread Updater'] or $ '.navLinksBot > .updatelink'), ->
      $.add $('.navLinksBot'), [$.tn(' '), QuoteThreading.threadNewLink]

  node: ->
    return if @isFetchedQuote or @isClone or !@isReply
    {thread} = QuoteThreading
    parents = for quote in @quotes
      parent = g.posts[quote]
      continue if !parent or parent.isFetchedQuote or !parent.isReply or parent.ID >= @ID
      parent
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
    if !Unread.posts.has(parent.ID) and descendants.some((x) -> Unread.posts.has(x.ID))
      QuoteThreading.threadNewLink.hidden = false
      return false

    {order} = Unread
    children = (QuoteThreading.children[parent.fullID] or= [])
    threadContainer = parent.nodes.threadContainer or $.el 'div', className: 'threadContainer'
    nodes = [post.nodes.root]
    nodes.push post.nodes.threadContainer if post.nodes.threadContainer

    i = children.length
    i-- for child in children by -1 when child.ID >= post.ID
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

  rethread: (enabled) ->
    {thread} = QuoteThreading
    {posts} = thread

    if QuoteThreading.enabled = enabled
      posts.forEach QuoteThreading.insert
    else
      nodes = []
      Unread.order = new RandomAccessList
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
