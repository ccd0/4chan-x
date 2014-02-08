QuoteMarkers =
  init: ->
    return if !Conf['Quote Markers']

    Post.callbacks.push
      name: 'Quote Markers'
      cb:   @node
  node: ->
    {board, thread} = if @isClone then @context else @
    for quotelink in @nodes.quotelinks
      QuoteMarkers.parseQuotelink board, thread, @, quotelink, !!@isClone
    return
  parseQuotelink: (board, thread, post, quotelink, mayReset, customText) ->
    markers = []
    {boardID, threadID, postID} = Get.postDataFromLink quotelink

    if QR.db?.get {boardID, threadID, postID}
      markers.push 'You'

    if board.ID is boardID
      if thread.ID is postID
        markers.push 'OP'

      if threadID and threadID isnt thread.ID # threadID is 0 for deadlinks
        markers.push 'Cross-thread'

    if $.hasClass quotelink, 'deadlink'
      markers.push 'Dead'

    text = if customText
      customText
    else if boardID is post.board.ID
      ">>#{postID}"
    else
      ">>>/#{boardID}/#{postID}"
    if markers.length
      quotelink.textContent = "#{text}\u00A0(#{markers.join '/'})"
    else if mayReset
      quotelink.textContent = text
