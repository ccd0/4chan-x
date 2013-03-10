StrikethroughQuotes =
  init: ->
    Main.callbacks.push @node

  node: (post) ->
    return if post.isInlined
    for quote in post.quotes
      continue unless quote.hash and (el = $.id "p#{quote.hash[2..]}") and quote.hostname is 'boards.4chan.org' and !/catalog$/.test(quote.pathname) and el.hidden
      $.addClass quote, 'filtered'
      if Conf['Recursive Filtering'] and post.ID isnt post.threadID
        ReplyHiding.hide post.root
    return