RevealSpoilers =
  init: ->
    return unless g.VIEW in ['index', 'thread', 'archive'] and Conf['Reveal Spoiler Thumbnails']

    Callbacks.Post.push
      name: 'Reveal Spoiler Thumbnails'
      cb:   @node

  node: ->
    return if @isClone
    for file in @files when file.thumb and file.isSpoiler
      {thumb} = file
      # Remove old width and height.
      thumb.removeAttribute 'style'
      # Enforce thumbnail size if thumbnail is replaced.
      thumb.style.maxHeight = thumb.style.maxWidth = if @isReply then '125px' else '250px'
      if thumb.src
        thumb.src = file.thumbURL
      else
        thumb.dataset.src = file.thumbURL
    return
