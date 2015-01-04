RevealSpoilers =
  init: ->
    return if g.VIEW not in ['index', 'thread'] or !Conf['Reveal Spoiler Thumbnails']

    Post.callbacks.push
      cb:   @node

  node: ->
    return if @isClone or !@file?.isSpoiler
    {thumb} = @file
    # Remove old width and height.
    thumb.removeAttribute 'style'
    # Enforce thumbnail size if thumbnail is replaced.
    thumb.style.maxHeight = thumb.style.maxWidth = if @isReply then '125px' else '250px'
    thumb.src = @file.thumbURL
