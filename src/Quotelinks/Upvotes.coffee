Upvotes =
  text: '\u305D\u3046\u3060\u306D'
  count: {}

  init: ->
    return unless g.VIEW is 'thread' and Conf['Upvotes']
    @regexp = new RegExp "(?:^>.*\\n)+\\s*#{@text}", 'gm'
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

    quotes = {}
    for context in @info.comment.match(Upvotes.regexp) or []
      for quote in context.match(/>>\d+/g) or []
        quotes[quote[2..]] = true
    for quote of quotes
      Upvotes.increment "#{g.BOARD}.#{quote}"

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
