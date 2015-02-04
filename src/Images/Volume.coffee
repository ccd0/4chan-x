Volume =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and
      (Conf['Image Expansion'] or Conf['Image Hover'] or Conf['Image Hover in Catalog'] or Conf['Gallery'])

    $.sync 'Allow Sound', (x) ->
      Conf['Allow Sound'] = x
      Volume.inputs?.unmute.checked = x

    $.sync 'Default Volume', (x) ->
      Conf['Default Volume'] = x
      Volume.inputs?.volume.value = x

    return unless g.BOARD.ID in ['gif', 'wsg']

    unmuteEntry = UI.checkbox 'Allow Sound', 'Allow Sound'
    unmuteEntry.title = Config.main['Images and Videos']['Allow Sound'][1]

    volumeEntry = $.el 'label',
      title: 'Default volume for videos.'
    $.extend volumeEntry,
      <%= html('<input name="Default Volume" type="range" min="0" max="1" step="0.01" value="${Conf["Default Volume"]}"> Volume') %>

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
    $.set items
    $.extend Conf, items
    if Volume.inputs
      Volume.inputs.unmute.checked = !muted
      Volume.inputs.volume.value = volume
