AutoGIF =
  init: ->
    return if !Conf['Auto-GIF'] or g.BOARD.ID in ['gif', 'wsg']

    Post.callbacks.push
      name: 'Auto-GIF'
      cb:   @node
    CatalogThread.callbacks.push
      name: 'Auto-GIF'
      cb:   @catalogNode
  node: ->
    return if @isClone or @isHidden or @thread.isHidden or !@file?.isImage
    {thumb, URL} = @file
    return unless /gif$/.test(URL) and !/spoiler/.test thumb.src
    if @file.isSpoiler
      # Revealed spoilers do not have height/width set, this fixes auto-gifs dimensions.
      {style} = thumb
      style.maxHeight = style.maxWidth = if @isReply then '125px' else '250px'
    AutoGIF.replaceThumbnail thumb, URL
  catalogNode: ->
    {OP} = @thread
    return unless OP.file?.isImage
    {URL} = OP.file
    return unless /gif$/.test URL
    AutoGIF.replaceThumbnail @nodes.thumb, URL, true
  replaceThumbnail: (thumb, URL, isBackground) ->
    gif = $.el 'img'
    $.on gif, 'load', ->
      # Replace the thumbnail once the GIF has finished loading.
      if isBackground
        thumb.style.backgroundImage = "url(#{URL})"
      else
        thumb.src = URL
    gif.src = URL

