QuoteBacklink =
  # Backlinks appending need to work for:
  #  - previous, same, and following posts.
  #  - existing and yet-to-exist posts.
  #  - newly fetched posts.
  #  - clones.
  # XXX what about order for fetched posts?
  #
  # First callback creates a map of quoted -> [quoters],
  # and append backlinks to posts that already have containers.
  # Second callback creates, fill and append containers.
  init: ->
    return if !Conf['Quote Backlinks']

    format = Conf['backlink'].replace /%id/g, "' + id + '"
    @funk  = Function 'id', "return '#{format}'"
    @frag  = $.nodes [$.tn(' '), $.el 'a', className: 'backlink']
    @map   = {}
    Post.callbacks.push
      name: 'Quote Backlinking Part 1'
      cb:   @firstNode
    Post.callbacks.push
      name: 'Quote Backlinking Part 2'
      cb:   @secondNode
  firstNode: ->
    return if @isClone
    for quoteID in @quotes
      (QuoteBacklink.map[quoteID] or= []).push @fullID
      continue unless (post = g.posts[quoteID]) and container = post?.nodes.backlinkContainer
      for container in [container].concat post.clones.map((clone) -> clone.nodes.backlinkContainer)
        $.add container, QuoteBacklink.buildBacklink @
    return
  secondNode: ->
    # Don't backlink the OP.
    return unless @isReply or Conf['OP Backlinks']
    if @isClone
      @nodes.backlinkContainer = $ '.backlink-container', @nodes.info
      return
    @nodes.backlinkContainer = container = $.el 'span',
      className: 'backlink-container'
    if @fullID of QuoteBacklink.map
      for quoteID in QuoteBacklink.map[@fullID]
        if post = g.posts[quoteID] # Post hasn't been collected since.
          $.add container, QuoteBacklink.buildBacklink post
    $.add @nodes.info, container
  buildBacklink: (post) ->
    frag = QuoteBacklink.frag.cloneNode true
    a = frag.lastElementChild
    a.href = "/#{post.board}/res/#{post.thread}#p#{post}"
    a.textContent = text = QuoteBacklink.funk post.ID
    if post.isDead
      $.addClass a, 'deadlink'
    if post.isHidden
      $.addClass a, 'filtered'
    if Conf['Quote Markers']
      QuoteMarkers.parseQuotelink post.board, post.thread, post, a, false, text
    if Conf['Quote Previewing']
      $.on a, 'mouseover', QuotePreview.mouseover
    if Conf['Quote Inlining']
      $.on a, 'click', QuoteInline.toggle
    frag
