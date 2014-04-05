TrashQueue =
  init: -> return

  add: (video) ->
    if video isnt @killNext and @killNext
      post = Get.postFromNode @killNext
      delete post?.file?.fullImage
      $.rm @killNext
    @killNext = video

  remove: (video) ->
    if video is @killNext
      delete @killNext

