TrashQueue =
  init: -> return

  add: (video, post) ->
    return if post.file.isSaved
    if @killNext and video isnt @killNext
      delete @killNextPost?.file?.fullImage
      $.rm @killNext
    @killNext = video
    @killNextPost = post

  remove: (video) ->
    if video is @killNext
      delete @killNext

