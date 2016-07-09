QuoteOP =
  init: ->
    return if g.VIEW not in ['index', 'thread'] or !Conf['Mark OP Quotes']

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    # \u00A0 is nbsp
    @text = '\u00A0(OP)'
    Callbacks.Post.push
      name: 'Mark OP Quotes'
      cb:   @node

  node: ->
    # Stop there if it's a clone of a post in the same thread.
    return if @isClone and @thread is @context.thread
    # Stop there if there's no quotes in that post.
    return unless (quotes = @quotes).length
    {quotelinks} = @nodes

    # rm (OP) from cross-thread quotes.
    if @isClone and @thread.fullID in quotes
      i = 0
      while quotelink = quotelinks[i++]
        quotelink.textContent = quotelink.textContent.replace QuoteOP.text, ''

    {fullID} = @context.thread
    # add (OP) to quotes quoting this context's OP.

    return unless fullID in quotes
    i = 0
    while quotelink = quotelinks[i++]
      {boardID, postID} = Get.postDataFromLink quotelink
      if "#{boardID}.#{postID}" is fullID
        $.add quotelink, $.tn QuoteOP.text
    return
