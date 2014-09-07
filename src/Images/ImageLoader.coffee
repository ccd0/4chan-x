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
          if post.file?.videoThumb
            {thumb} = post.file
            visible = !d.hidden and Header.isNodeVisible thumb
            if visible then thumb.play() else thumb.pause()

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
    {style} = thumb
    type = if (match = URL.match(/\.([^.]+)$/)[1].toUpperCase()) is 'JPEG' then 'JPG' else match
    replace  = Conf["Replace #{type}"] and !/spoiler/.test thumb.src
    prefetch = (Conf['prefetch'] and g.VIEW is 'thread') or force
    return unless replace or prefetch
    el = $.el if isImage then 'img' else 'video'
    if replace
      if @file.isSpoiler
        # Revealed spoilers do not have height/width set, this fixes the image's dimensions.
        style.maxHeight = style.maxWidth = if @isReply then '125px' else '250px'
      if isVideo
        el.textContent     = thumb.alt
        el.dataset.md5     = thumb.dataset.md5
        el.style.height    = style.height
        el.style.width     = style.width
        el.style.maxHeight = style.maxHeight
        el.style.maxWidth  = style.maxWidth
        el.loop            = true
        el.className       = thumb.className
      cb = =>
        $.off el, 'load loadeddata', cb
        ImageLoader.replace @, el
      $.on el, 'load loadeddata', cb
    ImageLoader.queue.push [el, URL]
    ImageLoader.next() unless ImageLoader.busy

  busy: false
  queue: []

  loadend: ->
    $.off @, 'load loadeddata error', ImageLoader.loadend
    ImageLoader.busy = false
    ImageLoader.next()

  next: ->
    return if ImageLoader.busy
    if [el, URL] = ImageLoader.queue.shift()
      $.on el, 'load loadeddata error', ImageLoader.loadend
      el.src = URL
      ImageLoader.busy = true

  replace: (post, el) ->
    {file} = post
    {isVideo, thumb} = file
    if !post.isClone
      # Replace the thumbnail in clones added before the file was loaded.
      for clone in post.clones when !isVideo or !$.hasClass clone.nodes.root.parentNode, 'dialog'
        ImageLoader.replace clone, el.cloneNode true
    if isVideo
      $.on el, 'mouseover', ImageHover.mouseover if Conf['Image Hover']
      $.replace thumb, el
      file.videoThumb = true
      file.thumb = el
      ImageLoader.play el unless post.isFetchedQuote
    else
      thumb.src = file.URL

  play: (video) ->
    if Conf['Autoplay']
      $.asap (-> doc.contains video), ->
        if !d.hidden and Header.isNodeVisible video
          video.play()

  toggle: ->
    enabled = Conf['prefetch'] = @checked
    if enabled
      g.BOARD.posts.forEach (post) -> ImageLoader.node.call post, true
    return
