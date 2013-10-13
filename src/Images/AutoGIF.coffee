AutoGIF =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Auto-GIF'] or g.BOARD.ID in ['gif', 'wsg']

    Post.callbacks.push
      name: 'Auto-GIF'
      cb:   @node
  node: ->
    return if @isClone or @isHidden or @thread.isHidden or !@file?.isImage
    {thumb, URL} = @file
    return unless /gif$/.test(URL) and !/spoiler/.test thumb.src
    if @file.isSpoiler
      # Revealed spoilers do not have height/width set, this fixes auto-gifs dimensions.
      {style} = thumb
      style.maxHeight = style.maxWidth = if @isReply then '125px' else '250px'
    gif = $.el 'img'
    $.on gif, 'load', ->
      # Replace the thumbnail once the GIF has finished loading.
      thumb.src = URL
    gif.src = URL
