ImageReplace =
  init: ->
    return if g.VIEW is 'catalog'

    Post::callbacks.push
      name: 'Image Replace'
      cb:   @node

  node: ->
    return if @isClone or @isHidden or @thread.isHidden or !@file?.isImage
    {thumb, URL} = @file
    return unless Conf["Replace #{if (type = (URL.match /\w{3}$/)[0].toUpperCase()) is 'PEG' then 'JPG' else type}"] and !/spoiler/.test thumb.src
    if @file.isSpoiler
      # Revealed spoilers do not have height/width set, this fixes auto-gifs dimensions.
      {style} = thumb
      style.maxHeight = style.maxWidth = if @isReply then '125px' else '250px'
    img = $.el 'img'
    $.on img, 'load', ->
      # Replace the thumbnail once the GIF has finished loading.
      thumb.src = URL
    img.src = URL