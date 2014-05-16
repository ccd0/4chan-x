ImageLoader =
  init: ->
    return if g.VIEW is 'catalog'
    return unless Conf["Image Prefetching"] or Conf["Replace JPG"] or Conf["Replace PNG"] or Conf["Replace GIF"]

    Post.callbacks.push
      name: 'Image Replace'
      cb:   @node
    
    Thread.callbacks.push
      name: 'Image Replace'
      cb:   @thread
    
    return unless Conf['Image Prefetching'] and g.VIEW is 'thread'
    
    prefetch = $.el 'label',
      innerHTML: '<input type="checkbox" name="prefetch"> Prefetch Images'

    @el = prefetch.firstElementChild
    $.on @el, 'change', @toggle

    $.event 'AddMenuEntry',
      type: 'header'
      el: prefetch
      order: 104
  
  thread: ->
    ImageLoader.thread = @

  node: ->
    return if @isClone or @isHidden or @thread.isHidden or !@file?.isImage
    {thumb, URL} = @file
    return unless (Conf[string = "Replace #{if (type = (URL.match /\w{3}$/)[0].toUpperCase()) is 'PEG' then 'JPG' else type}"] and !/spoiler/.test thumb.src) or Conf['prefetch']
    if @file.isSpoiler
      # Revealed spoilers do not have height/width set, this fixes the image's dimensions.
      {style} = thumb
      style.maxHeight = style.maxWidth = if @isReply then '125px' else '250px'
    img = $.el 'img'
    if Conf[string]
      $.on img, 'load', ->
        # Replace the thumbnail once the GIF has finished loading.
        thumb.src = URL
    img.src = URL

  toggle: ->
    enabled = Conf['prefetch'] = @checked
    if enabled
      ImageLoader.thread.posts.forEach ImageLoader.node.call
    return
