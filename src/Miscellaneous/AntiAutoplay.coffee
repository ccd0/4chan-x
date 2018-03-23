AntiAutoplay =
  init: ->
    return if !Conf['Disable Autoplaying Sounds']
    $.addClass doc, 'anti-autoplay'
    @stop audio for audio in $$ 'audio[autoplay]', doc
    window.addEventListener 'loadstart', ((e) => @stop e.target), true
    Callbacks.Post.push
      name: 'Disable Autoplaying Sounds'
      cb:   @node
    $.ready => @process d.body

  stop: (audio) ->
    return unless audio.autoplay
    audio.pause()
    audio.autoplay = false
    return if audio.controls
    audio.controls = true
    $.addClass audio, 'controls-added'

  node: ->
    AntiAutoplay.process @nodes.comment

  process: (root) ->
    for iframe in $$ 'iframe[src*="youtube"][src*="autoplay=1"]', root
      AntiAutoplay.processVideo iframe, 'src'
    for object in $$ 'object[data*="youtube"][data*="autoplay=1"]', root
      AntiAutoplay.processVideo object, 'data'
    return

  processVideo: (el, attr) ->
    el[attr] = el[attr].replace(/\?autoplay=1&?/, '?').replace('&autoplay=1', '')
    el.style.display = 'block' if window.getComputedStyle(el).display is 'none'
    $.addClass el, 'autoplay-removed'
