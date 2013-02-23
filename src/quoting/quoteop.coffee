QuoteOP =
  init: ->
    ExpandComment.callbacks.push @node
    Main.callbacks.push @node

  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    for quote in post.quotes
      if quote.hash[2..] is post.threadID
        # \u00A0 is nbsp
        $.add quote, $.tn '\u00A0(OP)'
    return