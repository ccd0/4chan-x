RevealSpoilers =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Reveal Spoiler Thumbnails']

    Post.callbacks.push
      cb:   @node

  node: ->
    return if @isClone or !@file?.isSpoiler
    {thumb} = @file
    thumb.removeAttribute 'style'
    thumb.src = @file.thumbURL
