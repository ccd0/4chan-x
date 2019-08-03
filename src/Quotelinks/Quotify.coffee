Quotify =
  init: ->
    return if g.VIEW not in ['index', 'thread'] or !Conf['Resurrect Quotes']

    $.addClass doc, 'resurrect-quotes'

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    Callbacks.Post.push
      name: 'Resurrect Quotes'
      cb:   @node

  node: ->
    if @isClone
      @nodes.archivelinks = $$ 'a.linkify.quotelink', @nodes.comment
      return
    for link in $$ 'a.linkify', @nodes.comment
      Quotify.parseArchivelink.call @, link
    for deadlink in $$ '.deadlink', @nodes.comment
      Quotify.parseDeadlink.call @, deadlink
    return

  parseArchivelink: (link) ->
    return if not (m = link.pathname.match /^\/([^/]+)\/thread\/S?(\d+)\/?$/)
    return if link.hostname in ['boards.4chan.org', 'boards.4channel.org']
    boardID  = m[1]
    threadID = m[2]
    postID   = link.hash.match(/^#[pq]?(\d+)$|$/)[1] or threadID
    if Redirect.to 'post', {boardID, postID}
      $.addClass link, 'quotelink'
      $.extend link.dataset, {boardID, threadID, postID}
      @nodes.archivelinks.push link

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
    return if not (postID = quote.match(/\d+$/)?[0])
    if postID[0] is '0'
      # Fix quotelinks that start with a `0`.
      Quotify.fixDeadlink deadlink
      return
    boardID = if m = quote.match /^>>>\/([a-z\d]+)/
      m[1]
    else
      @board.ID
    quoteID = "#{boardID}.#{postID}"

    if post = g.posts.get(quoteID)
      unless post.isDead
        # Don't (Dead) when quotifying in an archived post,
        # and we know the post still exists.
        a = $.el 'a',
          href:        g.SITE.Build.postURL boardID, post.thread.ID, postID
          className:   'quotelink'
          textContent: quote
      else
        # Replace the .deadlink span if we can redirect.
        a = $.el 'a',
          href:        g.SITE.Build.postURL boardID, post.thread.ID, postID
          className:   'quotelink deadlink'
          textContent: quote
        $.add a, Post.deadMark.cloneNode(true)
        $.extend a.dataset, {boardID, threadID: post.thread.ID, postID}

    else
      redirect = Redirect.to 'thread', {boardID, threadID: 0, postID}
      fetchable = Redirect.to 'post', {boardID, postID}
      if redirect or fetchable
        # Replace the .deadlink span if we can redirect or fetch the post.
        a = $.el 'a',
          href:        redirect or 'javascript:;'
          className:   'deadlink'
          textContent: quote
        $.add a, Post.deadMark.cloneNode(true)
        if fetchable
          # Make it function as a normal quote if we can fetch the post.
          $.addClass a, 'quotelink'
          $.extend a.dataset, {boardID, postID}

    @quotes.push quoteID unless quoteID in @quotes

    unless a
      $.add deadlink, Post.deadMark.cloneNode(true)
      return

    $.replace deadlink, a
    if $.hasClass a, 'quotelink'
      @nodes.quotelinks.push a

  fixDeadlink: (deadlink) ->
    if not (el = deadlink.previousSibling) or el.nodeName is 'BR'
      green = $.el 'span',
        className: 'quote'
      $.before deadlink, green
      $.add green, deadlink
    $.replace deadlink, [deadlink.childNodes...]
