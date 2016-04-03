ReplyPruning =
  init: ->
    return unless g.VIEW is 'thread' and Conf['Reply Pruning']

    if Conf['Quote Threading'] and Conf['Thread Quotes'] and Conf['Prune Replies']
      Conf['Prune Replies'] = false
      $.set 'Prune Replies', false

    @container = $.frag()

    label = UI.checkbox 'Prune Replies', 'Show Last'
    el = $.el 'span',
      title: 'Maximum number of replies to show.'
    ,
      <%= html(' <input type="number" name="Max Replies" min="0" step="1" value="${Conf["Max Replies"]}" class="field">') %>
    $.prepend el, label

    @inputs =
      enabled: label.firstElementChild
      replies: el.lastElementChild

    $.on @inputs.enabled, 'change', @setEnabled
    $.on @inputs.replies, 'change', $.cb.value

    Header.menu.addEntry
      el:    el
      order: 190

    Thread.callbacks.push
      name: 'Reply Pruning'
      cb:   @node

  position: 0
  hidden: 0
  total: 0

  setEnabled: ->
    other = QuoteThreading.input
    if @checked and other?.checked
      other.checked = false
      $.event 'change', null, other
    $.cb.checked.call @

  node: ->
    ReplyPruning.thread = @
    ReplyPruning.total = @posts.keys.length - 1
    $.on ReplyPruning.inputs.enabled, 'change', ReplyPruning.update
    $.on ReplyPruning.inputs.replies, 'change', ReplyPruning.update
    $.on d, 'ThreadUpdate', ReplyPruning.update

  update: (e) ->
    if e and e.type is 'ThreadUpdate' and not e.detail[404]
      ReplyPruning.total += e.detail.newPosts.length

    hidden2 = if Conf['Prune Replies']
      Math.max(ReplyPruning.total - +Conf["Max Replies"], 0)
    else
      0

    {posts, OP} = ReplyPruning.thread

    if ReplyPruning.hidden < hidden2
      while ReplyPruning.hidden < hidden2 and ReplyPruning.position < posts.keys.length
        post = posts[posts.keys[ReplyPruning.position++]]
        if post.isReply and not post.isFetchedQuote
          $.add ReplyPruning.container, post.nodes.root
          ReplyPruning.hidden++

    else if ReplyPruning.hidden > hidden2
      frag = $.frag()
      while ReplyPruning.hidden > hidden2 and ReplyPruning.position > 0
        post = posts[posts.keys[--ReplyPruning.position]]
        if post.isReply and not post.isFetchedQuote
          $.prepend frag, post.nodes.root
          ReplyPruning.hidden--
      $.after OP.nodes.root, frag
      $.event 'PostsInserted'
