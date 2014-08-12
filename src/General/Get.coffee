Get =
  threadExcerpt: (thread) ->
    {OP} = thread
    excerpt = "/#{thread.board}/ - " + (
      OP.info.subject?.trim() or
      OP.info.comment.replace(/\n+/g, ' // ') or
      Conf['Anonymize'] and 'Anonymous' or
      $('.nameBlock', OP.nodes.info).textContent.trim())
    return "#{excerpt[...70]}..." if excerpt.length > 73
    excerpt
  threadFromRoot: (root) ->
    g.threads["#{g.BOARD}.#{root.id[1..]}"]
  threadFromNode: (node) ->
    Get.threadFromRoot $.x 'ancestor::div[@class="thread"]', node
  postFromRoot: (root) ->
    link    = $ 'a[title="Link to this post"]', root
    boardID = link.pathname.split('/')[1]
    postID  = link.hash[2..]
    index   = root.dataset.clone
    post    = g.posts["#{boardID}.#{postID}"]
    if index then post.clones[index] else post
  postFromNode: (root) ->
    Get.postFromRoot $.x '(ancestor::div[contains(@class,"postContainer")][1]|following::div[contains(@class,"postContainer")][1])', root
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
      $.cache "//a.4cdn.org/#{boardID}/thread/#{threadID}.json", ->
        Get.fetchedPost @, boardID, threadID, postID, root, context
    else
      Get.archivedPost boardID, postID, root, context
  insert: (post, root, context) ->
    # Stop here if the container has been removed while loading.
    return unless root.parentNode
    clone = post.addClone context, ($.hasClass root, 'dialog')
    Main.callbackNodes Clone, [clone]

    # Get rid of the side arrows.
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
      unless Get.archivedPost boardID, postID, root, context
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
      unless Get.archivedPost boardID, postID, root, context
        $.addClass root, 'warning'
        root.textContent = "Post No.#{postID} was not found."
      return

    board = g.boards[boardID] or
      new Board boardID
    thread = g.threads["#{boardID}.#{threadID}"] or
      new Thread threadID, board
    post = new Post Build.postFromObject(post, boardID), thread, board
    post.isFetchedQuote = true
    Main.callbackNodes Post, [post]
    Get.insert post, root, context
  archivedPost: (boardID, postID, root, context) ->
    return false unless Conf['Resurrect Quotes']
    return false unless url = Redirect.to 'post', {boardID, postID}
    if /^https:\/\//.test(url) or location.protocol is 'http:'
      $.cache url,
        -> Get.parseArchivedPost @response, boardID, postID, root, context
      ,
        responseType: 'json'
        withCredentials: url.archive.withCredentials
      return true
    else if Conf['Except Archives from Encryption']
      CrossOrigin.json url, (response) ->
        {media} = response
        if media then for key of media when /_link$/.test key
          # Image/thumbnail URLs loaded over HTTP can be modified in transit.
          # Require them to be HTTP so that no referrer is sent to them from an HTTPS page.
          delete media[key] unless /^http:\/\//.test media[key]
        Get.parseArchivedPost response, boardID, postID, root, context
      return true
    return false
  parseArchivedPost: (data, boardID, postID, root, context) ->
    # In case of multiple callbacks for the same request,
    # don't parse the same original post more than once.
    if post = g.posts["#{boardID}.#{postID}"]
      Get.insert post, root, context
      return

    if data.error
      $.addClass root, 'warning'
      root.textContent = data.error
      return

    # https://github.com/eksopl/fuuka/blob/master/Board/Yotsuba.pm#L413-452
    # https://github.com/eksopl/asagi/blob/master/src/main/java/net/easymodo/asagi/Yotsuba.java#L109-138
    comment = (data.comment or '').split /(\n|\[\/?(?:b|spoiler|code|moot|banned)\])/
    comment = for text, i in comment
      if i % 2 is 1
        Get.archiveTags[text]
      else
        greentext = text[0] is '>'
        text = text.replace /(\[\/?[a-z]+):lit(\])/, '$1$2'
        text = for text2, j in text.split /(>>(?:>\/[a-z\d]+\/)?\d+)/g
          if j % 2 is 1
            <%= html('<span class="deadlink">${text2}</span>') %>
          else
            <%= html('${text2}') %>
        text = <%= html('@{text}') %>
        text = <%= html('<span class="quote">&{text}</span>') %> if greentext
        text
    comment = <%= html('@{comment}') %>

    threadID = +data.thread_num
    o =
      # id
      postID:   postID
      threadID: threadID
      boardID:  boardID
      # info
      name:     data.name
      capcode:  switch data.capcode
        when 'M' then 'mod'
        when 'A' then 'admin'
        when 'D' then 'developer'
      tripcode: data.trip
      uniqueID: data.poster_hash
      email:    data.email or ''
      subject:  data.title
      flagCode: data.poster_country
      flagName: data.poster_country_name
      date:     data.fourchan_date
      dateUTC:  data.timestamp
      comment:  comment
      # file
    if data.media?.media_filename
      o.file =
        name:      data.media.media_filename
        timestamp: data.media.media_orig
        url:       data.media.media_link or data.media.remote_media_link or
                     "//i.4cdn.org/#{boardID}/#{encodeURIComponent data.media[if boardID is 'f' then 'media_filename' else 'media_orig']}"
        height:    data.media.media_h
        width:     data.media.media_w
        MD5:       data.media.media_hash
        size:      data.media.media_size
        turl:      data.media.thumb_link or "//t.4cdn.org/#{boardID}/#{data.media.preview_orig}"
        theight:   data.media.preview_h
        twidth:    data.media.preview_w
        isSpoiler: data.media.spoiler is '1'
      o.file.tag = JSON.parse(data.media.exif).Tag if boardID is 'f'

    board = g.boards[boardID] or
      new Board boardID
    thread = g.threads["#{boardID}.#{threadID}"] or
      new Thread threadID, board
    post = new Post Build.post(o), thread, board, {isArchived: true}
    post.file.thumbURL = o.file.turl if post.file
    post.isFetchedQuote = true
    Main.callbackNodes Post, [post]
    Get.insert post, root, context
  archiveTags:
    '\n':         <%= html('<br>') %>
    '[b]':        <%= html('<b>') %>
    '[/b]':       <%= html('</b>') %>
    '[spoiler]':  <%= html('<s>') %>
    '[/spoiler]': <%= html('</s>') %>
    '[code]':     <%= html('<pre class="prettyprint">') %>
    '[/code]':    <%= html('</pre>') %>
    '[moot]':     <%= html('<div style="padding:5px;margin-left:.5em;border-color:#faa;border:2px dashed rgba(255,0,0,.1);border-radius:2px">') %>
    '[/moot]':    <%= html('</div>') %>
    '[banned]':   <%= html('<strong style="color: red;">') %>
    '[/banned]':  <%= html('</strong>') %>
