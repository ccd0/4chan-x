Video =
  start: (video) ->
    return unless video.paused
    {controls} = video
    video.controls = false
    video.play()
    # Hacky workaround for Firefox forever-loading bug for very short videos
    if controls
      $.asap (-> (video.readyState >= 3 and video.currentTime <= Math.max 0.1, (video.duration - 0.5)) or !d.contains video), ->
        video.controls = true
      , 500

