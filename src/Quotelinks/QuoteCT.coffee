QuoteCT =
  init: ->
    return if g.VIEW not in ['index', 'thread'] or !Conf['Mark Cross-thread Quotes']

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    # \u00A0 is nbsp
    @mark = $.el 'span',
      textContent: '\u00A0(Cross-thread)'
      className:   'qmark-ct'
    Callbacks.Post.push
      name: 'Mark Cross-thread Quotes'
      cb:   @node
  node: ->
    # Stop there if it's a clone of a post in the same thread.
    return if @isClone and @thread is @context.thread

    {board, thread} = @context
    for quotelink in @nodes.quotelinks
      {boardID, threadID} = Get.postDataFromLink quotelink
      continue unless threadID # deadlink
      if @isClone
        $.rm $('.qmark-ct', quotelink)
      if boardID is board.ID and threadID isnt thread.ID
        $.add quotelink, QuoteCT.mark.cloneNode(true)
    return
