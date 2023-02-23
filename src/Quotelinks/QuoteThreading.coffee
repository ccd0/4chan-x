###
  <3 aeosynth
###

QuoteThreading =
  init: ->
    return unless Conf['Quote Threading'] and g.VIEW is 'thread'

    @controls = $.el 'label',
      `{innerHTML: "<input id=\"threadingControl\" name=\"Thread Quotes\" type=\"checkbox\"> Threading"}`

    @threadNewLink = $.el 'span',
      className: 'brackets-wrap threadnewlink'
      hidden: true
    $.extend @threadNewLink, `{innerHTML: "<a href=\"javascript:;\">Thread New Posts</a>"}`

    @input = $('input', @controls)
    @input.checked = Conf['Thread Quotes']

    $.on @input, 'change', @setEnabled
    $.on @input, 'change', @rethread
    $.on @threadNewLink.firstElementChild, 'click', @rethread
    $.on d, '4chanXInitFinished', => @ready = true

    Header.menu.addEntry @entry =
      el:    @controls
      order: 99

    Callbacks.Thread.push
      name: 'Quote Threading'
      cb:   @setThread

    Callbacks.Post.push
      name: 'Quote Threading'
      cb:   @node

  parent:   $.dict()
  children: $.dict()
  inserted: $.dict()

  toggleThreading: ->
    @setThreadingState !Conf['Thread Quotes']

  setThreadingState: (enabled) ->
    @input.checked = enabled
    @setEnabled.call @input
    @rethread.call @input

  setEnabled: ->
    if @checked
      $.set 'Prune All Threads', false
      other = ReplyPruning.inputs?.enabled
      if other?.checked
        other.checked = false
        $.event 'change', null, other
    $.cb.checked.call @

  setThread: ->
    QuoteThreading.thread = @
    $.asap (-> !Conf['Thread Updater'] or $ '.navLinksBot > .updatelink'), ->
      ($.add navLinksBot, [$.tn(' '), QuoteThreading.threadNewLink] if (navLinksBot = $ '.navLinksBot'))

  node: ->
    return if @isFetchedQuote or @isClone or !@isReply

    parents = new Set()
    lastParent = null
    for quote in @quotes when parent = g.posts.get(quote)
      if not parent.isFetchedQuote and parent.isReply and parent.ID < @ID
        parents.add parent.ID
        lastParent = parent if not lastParent or parent.ID > lastParent.ID

    return unless lastParent

    ancestor = lastParent
    while ancestor = QuoteThreading.parent[ancestor.fullID]
      parents.delete ancestor.ID

    if parents.size is 1
      QuoteThreading.parent[@fullID] = lastParent

  descendants: (post) ->
    posts = [post]
    if children = QuoteThreading.children[post.fullID]
      for child in children
        posts = posts.concat QuoteThreading.descendants child
    posts

  insert: (post) ->
    return false if not (
      Conf['Thread Quotes'] and
      (parent = QuoteThreading.parent[post.fullID]) and
      !QuoteThreading.inserted[post.fullID]
    )

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

  rethread: ->
    return unless QuoteThreading.ready
    {thread} = QuoteThreading
    {posts} = thread

    QuoteThreading.threadNewLink.hidden = true

    if Conf['Thread Quotes']
      posts.forEach QuoteThreading.insert
    else
      nodes = []
      Unread.order = new RandomAccessList()
      QuoteThreading.inserted = $.dict()
      posts.forEach (post) ->
        return if post.isFetchedQuote
        Unread.order.push post
        nodes.push post.nodes.root if post.isReply
        if QuoteThreading.children[post.fullID]
          delete QuoteThreading.children[post.fullID]
          $.rmClass post.nodes.root, 'threadOP'
          $.rm post.nodes.threadContainer
          delete post.nodes.threadContainer
      $.add thread.nodes.root, nodes

    Unread.position = Unread.order.first
    Unread.updatePosition()
    Unread.setLine true
    Unread.read()
    Unread.update()
