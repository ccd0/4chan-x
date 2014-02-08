Quotify =
  init: ->
    return if !Conf['Resurrect Quotes']

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
      # Don't add 'deadlink' when quotifying in an archived post,
      # and we don't know if the post died yet.
      a = $.el 'a',
        href: "/#{boardID}/res/#{post.thread}#p#{postID}"
        className: if post.isDead then 'quotelink deadlink' else 'quotelink'
        textContent: quote
      $.extend a.dataset, {boardID, threadID: post.thread.ID, postID}
    else if redirect = Redirect.to 'thread', {boardID, postID}
      # Replace the .deadlink span if we can redirect.
      a = $.el 'a',
        href:        redirect
        className:   'deadlink'
        textContent: quote
        target:      '_blank'
      if Redirect.to 'post', {boardID, postID}
        # Make it function as a normal quote if we can fetch the post.
        $.addClass a, 'quotelink'
        $.extend a.dataset, {boardID, postID}

    unless quoteID in @quotes
      @quotes.push quoteID

    unless a
      deadlink.textContent = "#{quote}\u00A0(Dead)" if Conf['Quote Markers']
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
