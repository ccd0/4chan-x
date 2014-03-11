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
    addNodes = (post, that) ->
      $.add post.nodes.backlinkContainer, QuoteBacklink.buildBacklink post, that
    for quoteID in @quotes
      (QuoteBacklink.map[quoteID] or= []).push @fullID
      continue unless (post = g.posts[quoteID])? and container = post.nodes.backlinkContainer
      addNodes post, @
      for post in post.clones
        addNodes post, @
    return

  secondNode: ->
    # Don't backlink the OP.
    return unless @isReply or Conf['OP Backlinks']
    if @isClone
      @nodes.backlinkContainer = $ '.backlink-container', @nodes.info
      for backlink in @nodes.backlinks
        QuoteMarkers.parseQuotelink @, backlink, true, QuoteBacklink.funk Get.postDataFromLink(backlink).postID
      return
    @nodes.backlinkContainer = container = $.el 'span',
      className: 'backlink-container'
    if @fullID of QuoteBacklink.map
      for quoteID in QuoteBacklink.map[@fullID]
        if post = g.posts[quoteID] # Post hasn't been collected since.
          $.add container, QuoteBacklink.buildBacklink @, post
    $.add @nodes.info, container


  buildBacklink: (quoted, quoter) ->
    frag = QuoteBacklink.frag.cloneNode true
    a = frag.lastElementChild
    a.href = "/#{quoter.board}/res/#{quoter.thread}#p#{quoter}"
    a.textContent = text = QuoteBacklink.funk quoter.ID
    if quoter.isDead
      $.addClass a, 'deadlink'
    if quoter.isHidden
      $.addClass a, 'filtered'
    QuoteMarkers.parseQuotelink quoted, a, false, text
    if Conf['Quote Previewing']
      $.on a, 'mouseover', QuotePreview.mouseover
    if Conf['Quote Inlining']
      $.on a, 'click', QuoteInline.toggle
      if Conf['Quote Hash Navigation']
        hash = QuoteInline.qiQuote a, quoter.isHidden
    if Conf['JSON Navigation']
      if hash
        Navigate.singleQuoteLink hash
      else unless Conf['Quote Inlining']
        Navigate.singleQuoteLink a
    frag
