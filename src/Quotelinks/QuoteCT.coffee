QuoteCT =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Mark Cross-thread Quotes']

    # \u00A0 is nbsp
    @text = '\u00A0(Cross-thread)'
    Post::callbacks.push
      name: 'Mark Cross-thread Quotes'
      cb:   @node
  node: ->
    # Stop there if it's a clone of a post in the same thread.
    return if @isClone and @thread is @context.thread

    {board, thread} = if @isClone then @context else @
    for quotelink in @nodes.quotelinks
      {boardID, threadID} = Get.postDataFromLink quotelink
      continue unless threadID # deadlink
      if @isClone
        quotelink.textContent = quotelink.textContent.replace QuoteCT.text, ''
      if boardID is board.ID and threadID isnt thread.ID
        $.add quotelink, $.tn QuoteCT.text
    return
