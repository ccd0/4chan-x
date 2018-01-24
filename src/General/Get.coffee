Get =
  threadExcerpt: (thread) ->
    {OP} = thread
    excerpt = ("/#{thread.board}/ - ") + (
      OP.info.subject?.trim() or
      OP.commentDisplay().replace(/\n+/g, ' // ') or
      OP.file?.name or
      "No.#{OP}")
    return "#{excerpt[...70]}..." if excerpt.length > 73
    excerpt
  threadFromRoot: (root) ->
    return null unless root?
    g.threads["#{root.dataset.board or g.BOARD.ID}.#{root.id.match(/\d*$/)[0]}"]
  threadFromNode: (node) ->
    Get.threadFromRoot $.x "ancestor-or-self::#{Site.xpath.thread}", node
  postFromRoot: (root) ->
    return null unless root?
    post  = g.posts[root.dataset.fullID]
    index = root.dataset.clone
    if index then post.clones[index] else post
  postFromNode: (root) ->
    Get.postFromRoot $.x "ancestor-or-self::#{Site.xpath.postContainer}[1]", root
  postDataFromLink: (link) ->
    if link.dataset.postID # resurrected quote
      {boardID, threadID, postID} = link.dataset
      threadID or= 0
    else
      match = link.href.match Site.regexp.quotelink
      [boardID, threadID, postID] = match[1..]
      postID or= threadID
    return {
      boardID:  boardID
      threadID: +threadID
      postID:   +postID
    }
  allQuotelinksLinkingTo: (post) ->
    # Get quotelinks & backlinks linking to the given post.
    quotelinks = []
    {posts} = g
    {fullID} = post
    handleQuotes = (qPost, type) ->
      quotelinks.push qPost.nodes[type]...
      quotelinks.push clone.nodes[type]... for clone in qPost.clones
      return
    # First:
    #   In every posts,
    #   if it did quote this post,
    #   get all their backlinks.
    posts.forEach (qPost) ->
      if fullID in qPost.quotes
        handleQuotes qPost, 'quotelinks'

    # Second:
    #   If we have quote backlinks:
    #   in all posts this post quoted
    #   and their clones,
    #   get all of their backlinks.
    if Conf['Quote Backlinks']
      handleQuotes qPost, 'backlinks' for quote in post.quotes when qPost = posts[quote]

    # Third:
    #   Filter out irrelevant quotelinks.
    quotelinks.filter (quotelink) ->
      {boardID, postID} = Get.postDataFromLink quotelink
      boardID is post.board.ID and postID is post.ID
