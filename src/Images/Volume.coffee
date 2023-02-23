Volume =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and
      (Conf['Image Expansion'] or Conf['Image Hover'] or Conf['Image Hover in Catalog'] or Conf['Gallery'])

    $.sync 'Allow Sound', (x) ->
      Conf['Allow Sound'] = x
      # TODO check if inputs exits
      Volume.inputs.unmute.checked = x

    $.sync 'Default Volume', (x) ->
      Conf['Default Volume'] = x
      # TODO check if inputs exits
      Volume.inputs.volume.value = x

    if Conf['Mouse Wheel Volume']
      Callbacks.Post.push
        name: 'Mouse Wheel Volume'
        cb:   @node

    return if g.SITE.noAudio?(g.BOARD)

    if Conf['Mouse Wheel Volume']
      Callbacks.CatalogThread.push
        name: 'Mouse Wheel Volume'
        cb:   @catalogNode

    unmuteEntry = UI.checkbox 'Allow Sound', 'Allow Sound'
    unmuteEntry.title = Config.main['Images and Videos']['Allow Sound'][1]

    volumeEntry = $.el 'label',
      title: 'Default volume for videos.'
    $.extend volumeEntry,
      `{innerHTML: "<input name=\"Default Volume\" type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" value=\"" + E(Conf["Default Volume"]) + "\"> Volume"}`

    @inputs =
      unmute: unmuteEntry.firstElementChild
      volume: volumeEntry.firstElementChild

    $.on @inputs.unmute, 'change', $.cb.checked
    $.on @inputs.volume, 'change', $.cb.value

    Header.menu.addEntry {el: unmuteEntry, order: 200}
    Header.menu.addEntry {el: volumeEntry, order: 201}

  setup: (video) ->
    video.muted  = !Conf['Allow Sound']
    video.volume = Conf['Default Volume']
    $.on video, 'volumechange', Volume.change

  change: ->
    {muted, volume} = @
    items =
      'Allow Sound': !muted
      'Default Volume': volume
    for key, val of items when Conf[key] is val
      delete items[key]
    $.set items
    $.extend Conf, items
    if Volume.inputs
      Volume.inputs.unmute.checked = !muted
      Volume.inputs.volume.value = volume

  node: ->
    return if g.SITE.noAudio?(@board)
    for file in @files when file.isVideo
      $.on file.thumb,                                'wheel', Volume.wheel.bind(Header.hover) if file.thumb
      $.on ($('.file-info', file.text) or file.link), 'wheel', Volume.wheel.bind(file.thumbLink)
    return

  catalogNode: ->
    file = @thread.OP.files[0]
    return unless file?.isVideo
    $.on @nodes.thumb, 'wheel', Volume.wheel.bind(Header.hover)

  wheel: (e) ->
    return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey
    return if not (el = $ 'video:not([data-md5])', @)
    return if el.muted or not $.hasAudio el
    volume = el.volume + 0.1
    volume *= 1.1 if e.deltaY < 0
    volume /= 1.1 if e.deltaY > 0
    el.volume = $.minmax volume - 0.1, 0, 1
    e.preventDefault()
