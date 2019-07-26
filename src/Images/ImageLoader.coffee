ImageLoader =
  init: ->
    return unless g.VIEW in ['index', 'thread', 'archive']
    return unless Conf['Image Prefetching'] or
      Conf['Replace JPG'] or Conf['Replace PNG'] or Conf['Replace GIF'] or Conf['Replace WEBM']

    Callbacks.Post.push
      name: 'Image Replace'
      cb:   @node

    $.on d, 'PostsInserted', ->
      g.posts.forEach ImageLoader.prefetchAll

    if Conf['Replace WEBM']
      $.on d, 'scroll visibilitychange 4chanXInitFinished PostsInserted', @playVideos

    return unless Conf['Image Prefetching'] and g.VIEW in ['index', 'thread']

    prefetch = $.el 'label',
      `<%= html('<input type="checkbox" name="prefetch"> Prefetch Images') %>`

    @el = prefetch.firstElementChild
    $.on @el, 'change', @toggle

    Header.menu.addEntry
      el: prefetch
      order: 98

  node: ->
    return if @isClone
    for file in @files
      ImageLoader.replaceVideo @, file if Conf['Replace WEBM'] and file.isVideo
      ImageLoader.prefetch @, file
    return

  replaceVideo: (post, file) ->
    {thumb} = file
    video = $.el 'video',
      preload:     'none'
      loop:        true
      muted:       true
      poster:      thumb.src or thumb.dataset.src
      textContent: thumb.alt
      className:   thumb.className
    video.setAttribute 'muted', 'muted'
    video.dataset.md5 = thumb.dataset.md5
    video.style[attr] = thumb.style[attr] for attr in ['height', 'width', 'maxHeight', 'maxWidth']
    video.src         = file.url
    $.replace thumb, video
    file.thumb      = video
    file.videoThumb = true

  prefetch: (post, file) ->
    {isImage, isVideo, thumb, url} = file
    return if file.isPrefetched or !(isImage or isVideo) or post.isHidden or post.thread.isHidden
    type    = if (match = url.match(/\.([^.]+)$/)[1].toUpperCase()) is 'JPEG' then 'JPG' else match
    replace = Conf["Replace #{type}"] and !/spoiler/.test(thumb.src or thumb.dataset.src)
    return unless replace or Conf['prefetch']
    return if $.hasClass doc, 'catalog-mode'
    return unless [post, post.clones...].some (clone) -> doc.contains clone.nodes.root
    file.isPrefetched = true
    if file.videoThumb
      clone.file.thumb.preload = 'auto' for clone in post.clones
      thumb.preload = 'auto'
      # XXX Cloned video elements with poster in Firefox cause momentary display of image loading icon.
      if $.engine is 'gecko'
        $.on thumb, 'loadeddata', -> @removeAttribute 'poster'
      return

    el = $.el if isImage then 'img' else 'video'
    if replace and isImage
      $.on el, 'load', ->
        clone.file.thumb.src = url for clone in post.clones
        thumb.src = url
    el.src = url

  prefetchAll: (post) ->
    for file in post.files
      ImageLoader.prefetch post, file
    return

  toggle: ->
    if Conf['prefetch'] = @checked
      g.posts.forEach ImageLoader.prefetchAll
    return

  playVideos: ->
    # Special case: Quote previews are off screen when inserted into document, but quickly moved on screen.
    qpClone = $.id('qp')?.firstElementChild
    g.posts.forEach (post) ->
      for post in [post, post.clones...]
        for file in post.files when file.videoThumb
          {thumb} = file
          if Header.isNodeVisible(thumb) or post.nodes.root is qpClone then thumb.play() else thumb.pause()
      return
