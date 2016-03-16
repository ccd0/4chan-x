PruneReplies =
  init: ->
    return unless g.VIEW is 'thread' and not Conf['Quote Threading']

    label = UI.checkbox 'Prune Replies', 'Show Last'
    el = $.el 'span',
      title: 'Maximum number of replies to show.'
    ,
      <%= html(' <input type="number" name="Max Replies" min="0" step="1" value="${Conf["Max Replies"]}" class="field">') %>
    $.prepend el, label

    @inputs =
      enabled: label.firstElementChild
      replies: el.lastElementChild

    $.on @inputs.enabled, 'change', $.cb.checked
    $.on @inputs.replies, 'change', $.cb.value

    Header.menu.addEntry
      el:    el
      order: 190

    Thread.callbacks.push
      name: 'Prune Replies'
      cb:   @node

  position: 0
  hidden: 0
  total: 0

  node: ->
    PruneReplies.thread = @
    PruneReplies.total = @posts.keys.length - 1
    $.on PruneReplies.inputs.enabled, 'change', PruneReplies.setEnabled
    $.on PruneReplies.inputs.enabled, 'change', PruneReplies.update
    if Conf['Prune Replies']
      PruneReplies.setEnabled()
      PruneReplies.update()

  setEnabled: ->
    PruneReplies.container or= $.frag()
    onOff = if Conf['Prune Replies'] then $.on else $.off
    onOff PruneReplies.inputs.replies, 'change',       PruneReplies.update
    onOff d,                           'ThreadUpdate', PruneReplies.update

  update: (e) ->
    if e and e.type is 'ThreadUpdate' and not e.detail[404]
      PruneReplies.total += e.detail.newPosts.length

    hidden2 = if Conf['Prune Replies']
      Math.max(PruneReplies.total - +Conf["Max Replies"], 0)
    else
      0

    {posts, OP} = PruneReplies.thread

    if PruneReplies.hidden < hidden2
      while PruneReplies.hidden < hidden2 and PruneReplies.position < posts.keys.length
        post = posts[posts.keys[PruneReplies.position++]]
        if post.isReply and not post.isFetchedQuote
          $.add PruneReplies.container, post.nodes.root
          PruneReplies.hidden++

    else if PruneReplies.hidden > hidden2
      frag = $.frag()
      while PruneReplies.hidden > hidden2 and PruneReplies.position > 0
        post = posts[posts.keys[--PruneReplies.position]]
        if post.isReply and not post.isFetchedQuote
          $.prepend frag, post.nodes.root
          PruneReplies.hidden--
      $.after OP.nodes.root, frag
      $.event 'PostsInserted'
