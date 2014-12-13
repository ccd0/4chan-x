AntiAutoplay =
  init: ->
    return if !Conf['Disable Autoplaying Sounds']
    @stop audio for audio in $$ 'audio[autoplay]', doc
    window.addEventListener 'loadstart', ((e) => @stop e.target), true

  stop: (audio) ->
    return unless audio.autoplay
    audio.pause()
    audio.autoplay = false
    return if audio.controls
    audio.controls = true
    $.addClass audio, 'controls-added'
