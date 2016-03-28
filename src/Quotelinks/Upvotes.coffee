Upvotes =
  text: '\u305D\u3046\u3060\u306D'
  count: {}

  init: ->
    return unless g.VIEW is 'thread' and Conf['Upvotes']
    Post.callbacks.push
      name: 'Upvotes'
      cb:   @node

  node: ->
    return if @isFetchedQuote or @origin?.isFetchedQuote

    if @isClone
      @nodes.vote = $ '.upvote', @nodes.info
      $.on @nodes.vote, 'click', Upvotes.vote
      return

    a = $.el 'a',
      className:   'upvote'
      href:        'javascript:;'
      textContent: '+'
    $.add @nodes.info, a
    @nodes.vote = a
    $.on a, 'click', Upvotes.vote

    Upvotes.count[@fullID] = 0

    if @quotes.length is 1 and @info.comment.indexOf(Upvotes.text) >= 0
      Upvotes.increment @quotes[0]

  increment: (fullID) ->
    return unless fullID of Upvotes.count
    count = ++Upvotes.count[fullID]
    post = g.posts[fullID]
    for post in [post, post.clones...]
      post.nodes.vote.textContent = "#{Upvotes.text}x#{count}"
    return

  vote: ->
    return unless QR.postingIsEnabled
    QR.quote.call @
    {com} = QR.nodes
    text = "#{Upvotes.text}\n"
    pos = com.selectionStart
    com.value = com.value[..pos] + text + com.value[pos...]
    pos += text.length
    com.setSelectionRange pos, pos
    $.event 'input', null, com
