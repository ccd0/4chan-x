StrikethroughQuotes =
  init: ->
    Main.callbacks.push @node

  node: (post) ->
    return if post.isInlined
    for quote in post.quotes
      continue unless quote.hash and (el = $.id quote.hash[1..]) and quote.hostname is 'boards.4chan.org' and !/catalog$/.test(quote.pathname) and el.hidden
      $.addClass quote, 'filtered'
      if Conf['Recursive Filtering'] and post.ID isnt post.threadID
        show_stub = !!$.x 'preceding-sibling::div[contains(@class,"stub")]', el
        ReplyHiding.hide post.root, show_stub
    return