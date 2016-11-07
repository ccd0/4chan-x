class Fetcher
  constructor: (@boardID, @threadID, @postID, @root, @quoter) ->
    if post = g.posts["#{@boardID}.#{@postID}"]
      @insert post
      return

    @root.textContent = "Loading post No.#{@postID}..."
    if @threadID
      $.cache "//a.4cdn.org/#{@boardID}/thread/#{@threadID}.json", (e, isCached) =>
        @fetchedPost e.target, isCached
    else
      @archivedPost()

  insert: (post) ->
    # Stop here if the container has been removed while loading.
    return unless @root.parentNode
    clone = post.addClone @quoter.context, ($.hasClass @root, 'dialog')
    Main.callbackNodes 'Post', [clone]

    # Get rid of the side arrows/stubs.
    {nodes} = clone
    $.rmAll nodes.root
    $.add nodes.root, nodes.post

    # Indicate links to the containing post.
    for quote in clone.nodes.quotelinks.concat [clone.nodes.backlinks...]
      {boardID, postID} = Get.postDataFromLink quote
      if postID is @quoter.ID and boardID is @quoter.board.ID
        $.addClass quote, 'forwardlink'

    # Set up flag CSS for cross-board links to boards with flags
    if clone.nodes.flag and not (Fetcher.flagCSS or= $ 'link[href^="//s.4cdn.org/css/flags."]')
      cssVersion = $('link[href^="//s.4cdn.org/css/"]')?.href.match(/\d+(?=\.css$)|$/)[0] or Date.now()
      Fetcher.flagCSS = $.el 'link',
        rel: 'stylesheet'
        href: "//s.4cdn.org/css/flags.#{cssVersion}.css"
      $.add d.head, Fetcher.flagCSS

    $.rmAll @root
    $.add @root, nodes.root
    $.event 'PostsInserted'

  fetchedPost: (req, isCached) ->
    # In case of multiple callbacks for the same request,
    # don't parse the same original post more than once.
    if post = g.posts["#{@boardID}.#{@postID}"]
      @insert post
      return

    {status} = req
    unless status is 200
      # The thread can die by the time we check a quote.
      return if @archivedPost()

      $.addClass @root, 'warning'
      @root.textContent =
        if status is 404
          "Thread No.#{@threadID} 404'd."
        else
          "Error #{req.statusText} (#{req.status})."
      return

    {posts} = req.response
    Build.spoilerRange[@boardID] = posts[0].custom_spoiler
    for post in posts
      break if post.no is @postID # we found it!

    if post.no isnt @postID
      # Cached requests can be stale and must be rechecked.
      if isCached
        api = "//a.4cdn.org/#{@boardID}/thread/#{@threadID}.json"
        $.cleanCache (url) -> url is api
        $.cache api, (e) =>
          @fetchedPost e.target, false
        return

      # The post can be deleted by the time we check a quote.
      return if @archivedPost()

      $.addClass @root, 'warning'
      @root.textContent = "Post No.#{@postID} was not found."
      return

    board = g.boards[@boardID] or
      new Board @boardID
    thread = g.threads["#{@boardID}.#{@threadID}"] or
      new Thread @threadID, board
    post = new Post Build.postFromObject(post, @boardID), thread, board
    post.isFetchedQuote = true
    Main.callbackNodes 'Post', [post]
    @insert post

  archivedPost: ->
    return false unless Conf['Resurrect Quotes']
    return false if not (url = Redirect.to 'post', {@boardID, @postID})
    archive = Redirect.data.post[@boardID]
    if /^https:\/\//.test(url) or location.protocol is 'http:'
      $.cache url, (e) =>
        @parseArchivedPost e.target.response, url, archive
      ,
        responseType: 'json'
        withCredentials: archive.withCredentials
      return true
    else if Conf['Exempt Archives from Encryption']
      CrossOrigin.json url, (response) =>
        {media} = response
        if media then for key of media when /_link$/.test key
          # Image/thumbnail URLs loaded over HTTP can be modified in transit.
          # Require them to be from an HTTP host so that no referrer is sent to them from an HTTPS page.
          delete media[key] unless media[key]?.match /^http:\/\//
        @parseArchivedPost response, url, archive
      return true
    return false

  parseArchivedPost: (data, url, archive) ->
    # In case of multiple callbacks for the same request,
    # don't parse the same original post more than once.
    if post = g.posts["#{@boardID}.#{@postID}"]
      @insert post
      return

    unless data?
      $.addClass @root, 'warning'
      @root.textContent = "Error fetching Post No.#{@postID} from #{archive.name}."
      return

    if data.error
      $.addClass @root, 'warning'
      @root.textContent = data.error
      return

    # https://github.com/eksopl/asagi/blob/v0.4.0b74/src/main/java/net/easymodo/asagi/YotsubaAbstract.java#L82-L129
    # https://github.com/FoolCode/FoolFuuka/blob/800bd090835489e7e24371186db6e336f04b85c0/src/Model/Comment.php#L368-L428
    # https://github.com/bstats/b-stats/blob/6abe7bffaf6e5f523498d760e54b110df5331fbb/inc/classes/Yotsuba.php#L157-L168
    comment = (data.comment or '').split /(\n|\[\/?(?:b|spoiler|code|moot|banned|fortune(?: color="#\w+")?|i|red|green|blue)\])/
    comment = for text, i in comment
      if i % 2 is 1
        tag = @archiveTags[text.replace(/\ .*\]/, ']')]
        if typeof tag is 'function' then tag(text) else tag
      else
        greentext = text[0] is '>'
        text = text.replace /(\[\/?[a-z]+):lit(\])/g, '$1$2'
        text = for text2, j in text.split /(>>(?:>\/[a-z\d]+\/)?\d+)/g
          <%= html('?{j % 2}{<span class="deadlink">${text2}</span>}{${text2}}') %>
        text = <%= html('?{greentext}{<span class="quote">@{text}</span>}{@{text}}') %>
        text
    comment = <%= html('@{comment}') %>

    @threadID = +data.thread_num
    o =
      ID:       @postID
      threadID: @threadID
      boardID:  @boardID
      isReply:  @postID isnt @threadID
    o.info =
      subject:  data.title
      email:    data.email
      name:     data.name or ''
      tripcode: data.trip
      capcode:  switch data.capcode
        when 'M' then 'Mod'
        when 'A' then 'Admin'
        when 'D' then 'Developer'
      uniqueID: data.poster_hash
      flagCode: data.poster_country
      flag:     data.poster_country_name
      dateUTC:  data.timestamp
      dateText: data.fourchan_date
      commentHTML: comment
    delete o.info.uniqueID if o.info.capcode
    if data.media?.media_filename
      # Fix URLs missing origin
      for key, val of data.media when /_link$/.test(key) and val?[0] is '/'
        data.media[key] = url.split('/', 3).join('/') + val
      o.file =
        name:      data.media.media_filename
        url:       data.media.media_link or data.media.remote_media_link or
                     if @boardID is 'f'
                       "#{location.protocol}//i.4cdn.org/#{@boardID}/#{encodeURIComponent data.media.media_filename}"
                     else
                       "#{location.protocol}//#{if data.no % 3 then 'i.4cdn.org' else 'is.4chan.org'}/#{@boardID}/#{encodeURIComponent data.media.media_orig}"
        height:    data.media.media_h
        width:     data.media.media_w
        MD5:       data.media.media_hash
        size:      $.bytesToString data.media.media_size
        thumbURL:  data.media.thumb_link or "#{location.protocol}//i.4cdn.org/#{@boardID}/#{data.media.preview_orig}"
        theight:   data.media.preview_h
        twidth:    data.media.preview_w
        isSpoiler: data.media.spoiler is '1'
      o.file.dimensions = "#{o.file.width}x#{o.file.height}" unless /\.pdf$/.test o.file.url
      o.file.tag = JSON.parse(data.media.exif).Tag if @boardID is 'f' and data.media.exif

    board = g.boards[@boardID] or
      new Board @boardID
    thread = g.threads["#{@boardID}.#{@threadID}"] or
      new Thread @threadID, board
    post = new Post Build.post(o), thread, board
    post.kill()
    post.file.thumbURL = o.file.thumbURL if post.file
    post.isFetchedQuote = true
    Main.callbackNodes 'Post', [post]
    @insert post

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
    '[fortune]':  (text) -> <%= html('<span class="fortune" style="color:${text.match(/#\\w+|$/)[0]}"><b>') %>
    '[/fortune]': <%= html('</b></span>') %>
    '[i]':        <%= html('<span class="mu-i">') %>
    '[/i]':       <%= html('</span>') %>
    '[red]':      <%= html('<span class="mu-r">') %>
    '[/red]':     <%= html('</span>') %>
    '[green]':    <%= html('<span class="mu-g">') %>
    '[/green]':   <%= html('</span>') %>
    '[blue]':     <%= html('<span class="mu-b">') %>
    '[/blue]':    <%= html('</span>') %>
