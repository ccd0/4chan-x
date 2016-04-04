ReplyPruning =
  init: ->
    return unless g.VIEW is 'thread' and Conf['Reply Pruning']

    if Conf['Quote Threading'] and Conf['Thread Quotes'] and Conf['Prune Replies']
      Conf['Prune Replies'] = false
      $.set 'Prune Replies', false

    @container = $.frag()

    @summary = $.el 'span',
      hidden:    true
      className: 'summary'
      style:     'cursor: pointer;'
    $.on @summary, 'click', =>
      @inputs.enabled.checked = !@inputs.enabled.checked
      $.event 'change', null, @inputs.enabled

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
  hiddenFiles: 0
  total: 0
  totalFiles: 0

  setEnabled: ->
    other = QuoteThreading.input
    if @checked and other?.checked
      other.checked = false
      $.event 'change', null, other
    $.cb.checked.call @

  showIfHidden: (id) ->
    if ReplyPruning.container?.getElementById id
      ReplyPruning.inputs.enabled.checked = false
      $.event 'change', null, ReplyPruning.inputs.enabled

  node: ->
    ReplyPruning.thread = @

    @posts.forEach (post) ->
      if post.isReply
        ReplyPruning.total++
        ReplyPruning.totalFiles++ if post.file

    $.after @OP.nodes.root, ReplyPruning.summary

    $.on ReplyPruning.inputs.enabled, 'change', ReplyPruning.update
    $.on ReplyPruning.inputs.replies, 'change', ReplyPruning.update
    $.on d, 'ThreadUpdate', ReplyPruning.updateCount
    $.on d, 'ThreadUpdate', ReplyPruning.update

    ReplyPruning.update()

  updateCount: (e) ->
    return if e.detail[404]
    for fullID in e.detail.newPosts
      ReplyPruning.total++
      ReplyPruning.totalFiles++ if g.posts[fullID].file
    return

  update: ->
    hidden2 = if Conf['Prune Replies']
      Math.max(ReplyPruning.total - +Conf["Max Replies"], 0)
    else
      0

    {posts} = ReplyPruning.thread

    if ReplyPruning.hidden < hidden2
      while ReplyPruning.hidden < hidden2 and ReplyPruning.position < posts.keys.length
        post = posts[posts.keys[ReplyPruning.position++]]
        if post.isReply and not post.isFetchedQuote
          $.add ReplyPruning.container, post.nodes.root
          ReplyPruning.hidden++
          ReplyPruning.hiddenFiles++ if post.file

    else if ReplyPruning.hidden > hidden2
      frag = $.frag()
      while ReplyPruning.hidden > hidden2 and ReplyPruning.position > 0
        post = posts[posts.keys[--ReplyPruning.position]]
        if post.isReply and not post.isFetchedQuote
          $.prepend frag, post.nodes.root
          ReplyPruning.hidden--
          ReplyPruning.hiddenFiles-- if post.file
      $.after ReplyPruning.summary, frag
      $.event 'PostsInserted'

    ReplyPruning.summary.textContent = if Conf['Prune Replies']
      Build.summaryText '+', ReplyPruning.hidden, ReplyPruning.hiddenFiles
    else
      Build.summaryText '-', ReplyPruning.total, ReplyPruning.totalFiles
    ReplyPruning.summary.hidden = (ReplyPruning.total <= +Conf["Max Replies"])
