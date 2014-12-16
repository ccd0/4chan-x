AntiAutoplay =
  init: ->
    return if !Conf['Disable Autoplaying Sounds']
    $.addClass doc, 'anti-autoplay'
    @stop audio for audio in $$ 'audio[autoplay]', doc
    window.addEventListener 'loadstart', ((e) => @stop e.target), true
    Post.callbacks.push
      name: 'Disable Autoplaying Sounds'
      cb:   @node
    $.ready => @stopYoutube d.body

  stop: (audio) ->
    return unless audio.autoplay
    audio.pause()
    audio.autoplay = false
    return if audio.controls
    audio.controls = true
    $.addClass audio, 'controls-added'

  node: ->
    AntiAutoplay.stopYoutube @nodes.root

  stopYoutube: (root) ->
    for iframe in $$ 'iframe[src*="youtube"][src*="autoplay=1"]', root
      iframe.src = iframe.src.replace(/\?autoplay=1&?/, '?').replace('&autoplay=1', '')
