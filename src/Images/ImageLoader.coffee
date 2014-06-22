ImageLoader =
  init: ->
    return unless Conf["Image Prefetching"] or Conf["Replace JPG"] or Conf["Replace PNG"] or Conf["Replace GIF"] or Conf["Replace WEBM"]

    Post.callbacks.push
      name: 'Image Replace'
      cb:   @node

    Thread.callbacks.push
      name: 'Image Replace'
      cb:   @thread

    prefetch = $.el 'label',
      innerHTML: '<input type=checkbox name="prefetch"> Prefetch Images'

    @el = prefetch.firstElementChild
    $.on @el, 'change', @toggle

    Header.menu.addEntry
      el: prefetch
      order: 104

  thread: ->
    ImageLoader.thread = @

  node: ->
    return unless @file
    {isImage, isVideo} = @file
    return if @isClone or @isHidden or @thread.isHidden or !(isImage or isVideo)
    {thumb, URL} = @file
    {style} = thumb
    type = if (match = URL.match(/\.([^.]+)$/)[1].toUpperCase()) is 'JPEG' then 'JPG' else match
    replace = "Replace #{type}"
    return unless (Conf[replace] and !/spoiler/.test thumb.src) or (Conf['prefetch'] and g.VIEW is 'thread')
    if @file.isSpoiler
      # Revealed spoilers do not have height/width set, this fixes the image's dimensions.
      style.maxHeight = style.maxWidth = if @isReply then '125px' else '250px'
    file = $.el if isImage then 'img' else 'video'
    if Conf[replace]
      if isVideo
      
        file.alt          = thumb.alt
        file.dataset.md5  = thumb.dataset.md5
        file.style.height = style.height
        file.style.width  = style.width
        file.style.maxHeight = style.maxHeight
        file.style.maxWidth  = style.maxWidth
        file.loop     = true
        file.autoplay = Conf['Autoplay']
        if Conf['Image Hover']
          $.on file, 'mouseover', ImageHover.mouseover
      cb = =>
        $.off file, 'load loadedmetadata', cb
        # Replace the thumbnail once the file has finished loading.
        if isVideo
          $.replace thumb, file
          @file.thumb = file # XXX expanding requires the post.file.thumb node.
          return
        thumb.src = URL
      $.on file, 'load loadedmetadata', cb
    file.src = URL

  toggle: ->
    enabled = Conf['prefetch'] = @checked
    if enabled
      g.BOARD.posts.forEach (post) -> ImageLoader.node.call post
    return