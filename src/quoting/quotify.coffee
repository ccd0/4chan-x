Quotify =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    for deadlink in $$ '.deadlink', post.blockquote
      quote = deadlink.textContent
      a = $.el 'a',
        # \u00A0 is nbsp
        textContent: "#{quote}\u00A0(Dead)"

      continue unless id = quote.match(/\d+$/)
      id = id[0]

      if m = quote.match /^>>>\/([a-z\d]+)/
        board = m[1]
      else if postBoard
        board = postBoard
      else
        # Get the post's board, whether it's inlined or not.
        board = postBoard = $('a[title="Highlight this post"]', post.el).pathname.split('/')[1]

      if board is g.BOARD and $.id "p#{id}"
        a.href = "#p#{id}"
        a.className = 'quotelink'
      else
        a.href =
          Redirect.to
            board: board
            threadID: 0
            postID: id
        a.className = 'deadlink'
        a.target = '_blank'
        if Redirect.post board, id
          $.addClass a, 'quotelink'
          # XXX WTF Scriptish/Greasemonkey?
          # Setting dataset attributes that way doesn't affect the HTML,
          # but are, I suspect, kept as object key/value pairs and GC'd later.
          # a.dataset.board = board
          # a.dataset.id = id
          a.setAttribute 'data-board', board
          a.setAttribute 'data-id', id
      $.replace deadlink, a
    return