ImageLoader =
  init: ->
    return if g.VIEW is 'catalog'
    return unless Conf["Image Prefetching"] or Conf["Replace JPG"] or Conf["Replace PNG"] or Conf["Replace GIF"] or Conf["Replace WEBM"]

    Post.callbacks.push
      name: 'Image Replace'
      cb:   @node

    if Conf['Replace WEBM'] and Conf['Autoplay']
      $.on d, 'scroll visibilitychange', ->
        g.posts.forEach (post) ->
          for post in [post, post.clones...] when post.file?.videoThumb
            {thumb} = post.file
            if Header.isNodeVisible thumb then thumb.play() else thumb.pause()
          return

    return unless Conf['Image Prefetching']

    prefetch = $.el 'label',
      <%= html('<input type="checkbox" name="prefetch"> Prefetch Images') %>

    @el = prefetch.firstElementChild
    $.on @el, 'change', @toggle

    Header.menu.addEntry
      el: prefetch
      order: 104

  node: ->
    return unless @file
    {thumb} = @file
    return unless @file.isImage or @file.isVideo
    type    = if (match = @file.URL.match(/\.([^.]+)$/)[1].toUpperCase()) is 'JPEG' then 'JPG' else match
    replace = Conf["Replace #{type}"] and !/spoiler/.test thumb.src
    return unless replace or Conf['prefetch']
    if replace and @file.isSpoiler
      # Revealed spoilers do not have height/width set, this fixes the image's dimensions.
      thumb.style.maxHeight = thumb.style.maxWidth = if @isReply then '125px' else '250px'
    cb = =>
      thumb.play() if @file.videoThumb and Conf['Autoplay'] and Header.isNodeVisible thumb
      origin = if @isClone then @origin else @
      ImageLoader.prefetch origin, replace unless origin.file.isPrefetched
    cb() if doc.contains @nodes.root
    $.on @nodes.root, 'PostInserted', cb

  prefetch: (post, replace) ->
    {file} = post
    file.isPrefetched = true
    el = $.el if file.isImage then 'img' else 'video'
    if replace
      if file.isImage
        $.on el, 'load', => ImageLoader.replaceImage post
      else
        $.one el, 'loadeddata', => ImageLoader.replaceVideo post, el
    ImageLoader.queueDownload el, file.URL

  queueDownload: do ->
    busy  = false
    items = []
    load  = (el, url) ->
      $.one el, 'load loadedmetadata error', ->
        busy = false
        if item = items.shift()
          [el2, url2] = item
          load el2, url2
      el.src = url
      busy = true
    (el, url) ->
      if busy
        items.push [el, url]
      else
        load el, url

  replaceImage: (post) ->
    # Replace thumbnail in this post and any clones added before the file was loaded.
    for post in [post, post.clones...]
      post.file.thumb.src = post.file.URL
    return

  replaceVideo: (post, video) ->
    {file} = post
    {thumb} = file
    {style} = thumb
    if !post.isClone then for clone in post.clones
      # Replace the thumbnail in clones added before the file was loaded.
      video2 = $.el 'video'
      $.one video2, 'loadeddata', => ImageLoader.replaceVideo clone, video2
      video2.src = video.src
    if chrome?
      # This supresses black screen flashes in Chromium, but causes loading image icon flash in Firefox.
      video.poster = thumb.src
    video.loop            = true
    video.textContent     = thumb.alt
    video.dataset.md5     = thumb.dataset.md5
    video.style.height    = style.height
    video.style.width     = style.width
    video.style.maxHeight = style.maxHeight
    video.style.maxWidth  = style.maxWidth
    video.className       = thumb.className
    $.on video, 'mouseover', ImageHover.mouseover if Conf['Image Hover']
    $.replace thumb, video
    file.thumb      = video
    file.videoThumb = true
    video.play() if Conf['Autoplay'] and Header.isNodeVisible video

  toggle: ->
    enabled = Conf['prefetch'] = @checked
    if enabled
      g.BOARD.posts.forEach (post) -> ImageLoader.prefetch post
    return
