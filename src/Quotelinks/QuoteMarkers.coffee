QuoteMarkers =
  init: ->
    if Conf['Highlight Own Posts']
      $.addClass doc, 'highlight-own'

    if Conf['Highlight Posts Quoting You']
      $.addClass doc, 'highlight-you'

    Post.callbacks.push
      name: 'Quote Markers'
      cb:   @node

  node: ->
    {parseQuotelink} = QuoteMarkers
    for quotelink in @nodes.quotelinks
      parseQuotelink @, quotelink, !!@isClone
    return

  parseQuotelink: (post, quotelink, mayReset, customText) ->
    {board, thread} = if post.isClone then post.context else post
    markers = []
    {boardID, threadID, postID} = Get.postDataFromLink quotelink

    if QR.db.get {boardID, threadID, postID}
      markers.push 'You' if Conf['Mark Quotes of You']
      $.addClass post.nodes.root, 'quotesYou'

    if board.ID is boardID
      if Conf['Mark OP Quotes'] and thread.ID is postID
        markers.push 'OP'

      if Conf['Mark Cross-thread Quotes'] and (threadID and threadID isnt thread.ID) # threadID is 0 for deadlinks
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
      quotelink.textContent = "#{text}\u00A0(#{markers.join '|'})"
    else if mayReset
      quotelink.textContent = text
