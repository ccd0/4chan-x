AntiAutoplay =
  init: ->
    return if !Conf['Disable Autoplaying Sounds']
    $.ready @ready

  ready: ->
    for audio in $$ 'audio[autoplay]'
      audio.pause()
      audio.autoplay = false
      audio.controls = true
