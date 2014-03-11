RevealSpoilers =
  init: ->
    return if !Conf['Reveal Spoiler Thumbnails']

    Post.callbacks.push
      cb:   @node

  node: ->
    return if @isClone or !@file?.isSpoiler
    {thumb} = @file
    thumb.removeAttribute 'style'
    thumb.src = @file.thumbURL
