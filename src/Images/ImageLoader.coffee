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

    $.on d, 'PostsInserted', ->
      {thumbsToPlay} = ImageLoader
      ImageLoader.thumbsToPlay = []
      ImageLoader.play thumb for thumb in thumbsToPlay
      g.posts.forEach ImageLoader.prefetch

    return unless Conf['Image Prefetching']

    prefetch = $.el 'label',
      <%= html('<input type="checkbox" name="prefetch"> Prefetch Images') %>

    @el = prefetch.firstElementChild
    $.on @el, 'change', ->
      if Conf['prefetch'] = @checked
        g.posts.forEach ImageLoader.prefetch

    Header.menu.addEntry
      el: prefetch
      order: 104

  node: ->
    if @isClone
      ImageLoader.play @file.thumb if @file?.videoThumb
    else
      ImageLoader.prefetch @

  prefetch: (post) ->
    {file} = post
    return unless file
    {isImage, isVideo, thumb, URL} = file
    return if !(isImage or isVideo) or post.isHidden or post.thread.isHidden or file.isPrefetched
    type    = if (match = URL.match(/\.([^.]+)$/)[1].toUpperCase()) is 'JPEG' then 'JPG' else match
    replace = Conf["Replace #{type}"] and !/spoiler/.test thumb.src
    return unless replace or Conf['prefetch']
    return unless [post, post.clones...].some (clone) -> doc.contains clone.nodes.root
    file.isPrefetched = true
    el = $.el if isImage then 'img' else 'video'
    if replace
      if isImage
        $.on el, 'load', => ImageLoader.replaceImage post
      else
        $.one el, 'loadeddata', => ImageLoader.replaceVideo post, el
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
    ImageLoader.play video if doc.contains(video) or post.isClone

  thumbsToPlay: []

  play: (thumb) ->
    return unless Conf['Autoplay']
    if doc.contains thumb
      # Quote previews are off screen when inserted into document, but quickly moved on screen.
      thumb.play() if Header.isNodeVisible(thumb) or $.id('qp')?.contains thumb
    else
      ImageLoader.thumbsToPlay.push thumb
