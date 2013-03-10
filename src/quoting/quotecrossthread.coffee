QuoteCT =
  init: ->
    Main.callbacks.push @node

  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    for quote in post.quotes
      unless quote.hash and quote.hostname is 'boards.4chan.org' and !/catalog$/.test quote.pathname
        # Make sure this isn't a link to the board we're on.
        continue
      path = quote.pathname.split '/'

      # If quote leads to a different thread id and is located on the same board.
      if path[1] is g.BOARD and path[3] isnt post.threadID
        # \u00A0 is nbsp
        $.add quote, $.tn '\u00A0(Cross-thread)'
    return