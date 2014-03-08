Get =
  threadExcerpt: (thread) ->
    {OP} = thread
    excerpt = OP.info.subject?.trim() or
      OP.info.comment.replace(/\n+/g, ' // ') or
      OP.getNameBlock()
    if excerpt.length > 70
      excerpt = "#{excerpt[...67]}..."
    "/#{thread.board}/ - #{excerpt}"
  threadFromRoot: (root) ->
    g.threads["#{g.BOARD}.#{root.id[1..]}"]
  threadFromNode: (node) ->
    Get.threadFromRoot $.x 'ancestor::div[@class="thread"]', node
  postFromRoot: (root) ->
    post = g.posts[root.dataset.fullID]
    if index = root.dataset.clone then post.clones[index] else post
  postFromNode: (node) ->
    Get.postFromRoot $.x 'ancestor::div[contains(@class,"postContainer")][1]', node
  contextFromNode: (node) ->
    Get.postFromRoot $.x 'ancestor::div[parent::div[@class="thread"]][1]', node
  postDataFromLink: (link) ->
    if link.hostname is 'boards.4chan.org'
      path     = link.pathname.split '/'
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
    fullID = {post}
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
  postClone: (boardID, threadID, postID, root, context) ->
    if post = g.posts["#{boardID}.#{postID}"]
      Get.insert post, root, context
      return

    root.textContent = "Loading post No.#{postID}..."
    if threadID
      $.cache "//a.4cdn.org/#{boardID}/res/#{threadID}.json", ->
        Get.fetchedPost @, boardID, threadID, postID, root, context
    else if url = Redirect.to 'post', {boardID, postID}
      $.cache url,
        -> Get.archivedPost @, boardID, postID, root, context
      ,
        responseType: 'json'
        withCredentials: url.archive.withCredentials
  insert: (post, root, context) ->
    # Stop here if the container has been removed while loading.
    return unless root.parentNode
    clone = post.addClone context
    Main.callbackNodes Clone, [clone]

    # Get rid of the side arrows/stubs.
    {nodes} = clone
    $.rmAll nodes.root
    $.add nodes.root, nodes.post

    $.rmAll root
    $.add root, nodes.root
  fetchedPost: (req, boardID, threadID, postID, root, context) ->
    # In case of multiple callbacks for the same request,
    # don't parse the same original post more than once.
    if post = g.posts["#{boardID}.#{postID}"]
      Get.insert post, root, context
      return

    {status} = req
    unless status in [200, 304]
      # The thread can die by the time we check a quote.
      if url = Redirect.to 'post', {boardID, postID}
        $.cache url,
          -> Get.archivedPost @, boardID, postID, root, context
        ,
          withCredentials: url.archive.withCredentials
      else
        $.addClass root, 'warning'
        root.textContent =
          if status is 404
            "Thread No.#{threadID} 404'd."
          else
            "Error #{req.statusText} (#{req.status})."
      return

    {posts} = req.response
    Build.spoilerRange[boardID] = posts[0].custom_spoiler
    for post in posts
      break if post.no is postID # we found it!

    if post.no isnt postID
      # The post can be deleted by the time we check a quote.
      if url = Redirect.to 'post', {boardID, postID}
        $.cache url,
          -> Get.archivedPost @, boardID, postID, root, context
        ,
          withCredentials: url.archive.withCredentials
      else
        $.addClass root, 'warning'
        root.textContent = "Post No.#{postID} was not found."
      return

    board = g.boards[boardID] or
      new Board boardID
    thread = g.threads["#{boardID}.#{threadID}"] or
      new Thread threadID, board
    post = new Post Build.postFromObject(post, boardID), thread, board
    Main.callbackNodes Post, [post]
    Get.insert post, root, context
  archivedPost: (req, boardID, postID, root, context) ->
    # In case of multiple callbacks for the same request,
    # don't parse the same original post more than once.
    if post = g.posts["#{boardID}.#{postID}"]
      Get.insert post, root, context
      return

    data = req.response
    if data.error
      $.addClass root, 'warning'
      root.textContent = data.error
      return

    # convert comment to html
    bq = $.el 'blockquote', textContent: data.comment # set this first to convert text to HTML entities
    # https://github.com/eksopl/fuuka/blob/master/Board/Yotsuba.pm#L413-452
    # https://github.com/eksopl/asagi/blob/master/src/main/java/net/easymodo/asagi/Yotsuba.java#L109-138
    bq.innerHTML = bq.innerHTML.replace ///
      \n
      |
      \[/?[a-z]+(:lit)?\]
    ///g, Get.parseMarkup

    comment = bq.innerHTML
      # greentext
      .replace /(^|>)(&gt;[^<$]*)(<|$)/g, '$1<span class=quote>$2</span>$3'
      # quotes
      .replace /((&gt;){2}(&gt;\/[a-z\d]+\/)?\d+)/g, '<span class=deadlink>$1</span>'

    threadID = +data.thread_num
    o =
      # id
      postID:   postID
      threadID: threadID
      boardID:  boardID
      # info
      name:     data.name_processed
      capcode:  switch data.capcode
        when 'M' then 'mod'
        when 'A' then 'admin'
        when 'D' then 'developer'
      tripcode: data.trip
      uniqueID: data.poster_hash
      email:    if data.email then encodeURI data.email else ''
      subject:  data.title_processed
      flagCode: data.poster_country
      flagName: data.poster_country_name_processed
      date:     data.fourchan_date
      dateUTC:  data.timestamp
      comment:  comment
      # file
    if data.media?.media_filename
      o.file =
        name:      data.media.media_filename_processed
        timestamp: data.media.media_orig
        url:       data.media.media_link or data.media.remote_media_link
        height:    data.media.media_h
        width:     data.media.media_w
        MD5:       data.media.media_hash
        size:      data.media.media_size
        turl:      data.media.thumb_link or "//t.4cdn.org/#{boardID}/thumb/#{data.media.preview_orig}"
        theight:   data.media.preview_h
        twidth:    data.media.preview_w
        isSpoiler: data.media.spoiler is '1'

    board = g.boards[boardID] or
      new Board boardID
    thread = g.threads["#{boardID}.#{threadID}"] or
      new Thread threadID, board
    post = new Post Build.post(o, true), thread, board, {isArchived: true}
    $('.page-num', post.nodes.info)?.hidden = true
    Main.callbackNodes Post, [post]
    Get.insert post, root, context
  parseMarkup: (text) ->
    {
      '\n':         '<br>'
      '[b]':        '<b>'
      '[/b]':       '</b>'
      '[spoiler]':  '<s>'
      '[/spoiler]': '</s>'
      '[code]':     '<pre class=prettyprint>'
      '[/code]':    '</pre>'
      '[moot]':     '<div style="padding:5px;margin-left:.5em;border-color:#faa;border:2px dashed rgba(255,0,0,.1);border-radius:2px">'
      '[/moot]':    '</div>'
      '[banned]':   '<strong style="color: red;">'
      '[/banned]':  '</strong>'
    }[text] or text.replace ':lit', ''
