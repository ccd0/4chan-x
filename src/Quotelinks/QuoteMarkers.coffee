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

  cb:
    seek: (type) ->
      if Conf['Mark Quotes of You'] and post = QuoteMarkers.cb.findPost type
        QuoteMarkers.cb.scroll post

    findPost: (type) ->
      posts = $$ '.quotesYou'
      unless QuoteMarkers.lastRead
        unless post = QuoteMarkers.lastRead = posts[0]
          new Notice 'warning', 'No posts are currently quoting you, loser.', 20
          return
        unless Get.postFromRoot(post).isHidden
          return post
      else
        post = QuoteMarkers.lastRead

      len   = posts.length - 1
      index = i = posts.indexOf post
      while true
        break if index is (
          i = if i is 0
            len
          else if i is len
            0
          else if type is 'prev'
            i - 1
          else
            i + 1
        )
        post = posts[i]
        return post unless Get.postFromRoot(post).isHidden

    scroll: (post) ->
      $.rmClass highlight, 'highlight' if highlight = $ '.highlight'
      QuoteMarkers.lastRead = post
      window.location.hash = "##{post.id}"
      Header.scrollTo post
      $.addClass $('.post', post), 'highlight'

