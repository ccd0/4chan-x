Quotify =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Resurrect Quotes']

    Post.callbacks.push
      name: 'Resurrect Quotes'
      cb:   @node
  node: ->
    for deadlink in $$ '.deadlink', @nodes.comment
      if @isClone
        if $.hasClass deadlink, 'quotelink'
          @nodes.quotelinks.push deadlink
      else
        Quotify.parseDeadlink.call @, deadlink
    return

  parseDeadlink: (deadlink) ->
    if $.hasClass deadlink.parentNode, 'prettyprint'
      # Don't quotify deadlinks inside code tags,
      # un-`span` them.
      # This won't be necessary once 4chan
      # stops quotifying inside code tags:
      # https://github.com/4chan/4chan-JS/issues/77
      Quotify.fixDeadlink deadlink
      return

    quote = deadlink.textContent
    return unless postID = quote.match(/\d+$/)?[0]
    if postID[0] is '0'
      # Fix quotelinks that start with a `0`.
      Quotify.fixDeadlink deadlink
      return
    boardID = if m = quote.match /^>>>\/([a-z\d]+)/
      m[1]
    else
      @board.ID
    quoteID = "#{boardID}.#{postID}"

    if post = g.posts[quoteID]
      unless post.isDead
        # Don't (Dead) when quotifying in an archived post,
        # and we know the post still exists.
        a = $.el 'a',
          href:        "/#{boardID}/res/#{post.thread}#p#{postID}"
          className:   'quotelink'
          textContent: quote
      else
        # Replace the .deadlink span if we can redirect.
        a = $.el 'a',
          href:        "/#{boardID}/res/#{post.thread}#p#{postID}"
          className:   'quotelink deadlink'
          target:      '_blank'
          textContent: "#{quote}\u00A0(Dead)"
        $.extend a.dataset, {boardID, threadID: post.thread.ID, postID}
    else if redirect = Redirect.to 'thread', {boardID, threadID: 0, postID}
      # Replace the .deadlink span if we can redirect.
      a = $.el 'a',
        href:        redirect
        className:   'deadlink'
        target:      '_blank'
        textContent: "#{quote}\u00A0(Dead)"
      if Redirect.to 'post', {boardID, postID}
        # Make it function as a normal quote if we can fetch the post.
        $.addClass a, 'quotelink'
        $.extend a.dataset, {boardID, postID}

    unless quoteID in @quotes
      @quotes.push quoteID

    unless a
      deadlink.textContent = "#{quote}\u00A0(Dead)"
      return

    $.replace deadlink, a
    if $.hasClass a, 'quotelink'
      @nodes.quotelinks.push a

  fixDeadlink: (deadlink) ->
    if !(el = deadlink.previousSibling) or el.nodeName is 'BR'
      green = $.el 'span',
        className: 'quote'
      $.before deadlink, green
      $.add green, deadlink
    $.replace deadlink, [deadlink.childNodes...]
