Quotify =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Resurrect Quotes']

    Post::callbacks.push
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
    if deadlink.parentNode.className is 'prettyprint'
      # Don't quotify deadlinks inside code tags,
      # un-`span` them.
      $.replace deadlink, [deadlink.childNodes...]
      return

    quote = deadlink.textContent
    return unless postID = quote.match(/\d+$/)?[0]
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
          href:        "/#{boardID}/#{post.thread}/res/#p#{postID}"
          className:   'quotelink'
          textContent: quote
      else
        # Replace the .deadlink span if we can redirect.
        a = $.el 'a',
          href:        "/#{boardID}/#{post.thread}/res/#p#{postID}"
          className:   'quotelink deadlink'
          target:      '_blank'
          textContent: "#{quote}\u00A0(Dead)"
        a.setAttribute 'data-boardid',  boardID
        a.setAttribute 'data-threadid', post.thread.ID
        a.setAttribute 'data-postid',   postID
    else if redirect = Redirect.to 'thread', {boardID, threadID: 0, postID}
      # Replace the .deadlink span if we can redirect.
      a = $.el 'a',
        href:        redirect
        className:   'deadlink'
        target:      '_blank'
        textContent: "#{quote}\u00A0(Dead)"
      if Redirect.to 'post', {boardID, postID}
        # Make it function as a normal quote if we can fetch the post.
        $.addClass a,  'quotelink'
        a.setAttribute 'data-boardid', boardID
        a.setAttribute 'data-postid',  postID

    unless quoteID in @quotes
      @quotes.push quoteID

    unless a
      deadlink.textContent = "#{quote}\u00A0(Dead)"
      return

    $.replace deadlink, a
    if $.hasClass a, 'quotelink'
      @nodes.quotelinks.push a
