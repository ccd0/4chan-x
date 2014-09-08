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

  node: (force) ->
    return unless @file
    {isImage, isVideo, thumb, URL} = @file
    if @isClone and @file.videoThumb
      ImageLoader.play thumb
    return if @isClone or @isHidden or @thread.isHidden or !(isImage or isVideo)
    type     = if (match = URL.match(/\.([^.]+)$/)[1].toUpperCase()) is 'JPEG' then 'JPG' else match
    replace  = Conf["Replace #{type}"] and !/spoiler/.test thumb.src
    prefetch = (Conf['prefetch'] and g.VIEW is 'thread') or force
    return unless replace or prefetch
    el = $.el if isImage then 'img' else 'video'
    if replace
      if @file.isSpoiler
        # Revealed spoilers do not have height/width set, this fixes the image's dimensions.
        thumb.style.maxHeight = thumb.style.maxWidth = if @isReply then '125px' else '250px'
      if isImage
        $.on el, 'load', => ImageLoader.replaceImage @
      else
        $.one el, 'loadeddata', => ImageLoader.replaceVideo @, el
    ImageLoader.queueDownload el, URL

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
    ImageLoader.play video unless post.isFetchedQuote

  play: (video) ->
    if Conf['Autoplay']
      $.asap (-> doc.contains video), ->
        if Header.isNodeVisible video
          video.play()

  toggle: ->
    enabled = Conf['prefetch'] = @checked
    if enabled
      g.BOARD.posts.forEach (post) -> ImageLoader.node.call post, true
    return
