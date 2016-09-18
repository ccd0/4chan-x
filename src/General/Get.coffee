Get =
  threadExcerpt: (thread) ->
    {OP} = thread
    excerpt = "/#{thread.board}/ - " + (
      OP.info.subject?.trim() or
      OP.info.commentDisplay.replace(/\n+/g, ' // ') or
      OP.file?.name or
      OP.info.nameBlock)
    return "#{excerpt[...70]}..." if excerpt.length > 73
    excerpt
  threadFromRoot: (root) ->
    g.threads["#{g.BOARD}.#{root.id[1..]}"]
  threadFromNode: (node) ->
    Get.threadFromRoot $.x 'ancestor::div[@class="thread"]', node
  postFromRoot: (root) ->
    return null unless root?
    post  = g.posts[root.dataset.fullID]
    index = root.dataset.clone
    if index then post.clones[index] else post
  postFromNode: (root) ->
    Get.postFromRoot $.x '(ancestor::div[contains(@class,"postContainer") or contains(@class,"catalog-thread")][1]|following::div[contains(@class,"postContainer")][1])', root
  postDataFromLink: (link) ->
    if link.hostname is 'boards.4chan.org'
      path     = link.pathname.split /\/+/
      boardID  = path[1]
      threadID = path[3]
      postID   = link.hash[2..]
    else # resurrected quote
      {boardID, threadID, postID} = link.dataset
      threadID or= 0
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

  scriptData: ->
    for script in $$ 'script:not([src])', d.head
      return script.textContent if /\bcooldowns *=/.test script.textContent
    ''
