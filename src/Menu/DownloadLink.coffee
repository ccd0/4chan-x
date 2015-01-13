DownloadLink =
  init: ->
    return if g.VIEW not in ['index', 'thread'] or !Conf['Menu'] or !Conf['Download Link']

    a = $.el 'a',
      className: 'download-link'
      textContent: 'Download file'

    # Specifying the filename with the download attribute only works for same-origin links.
    $.on a, 'click', ImageCommon.download

    Menu.menu.addEntry
      el: a
      order: 100
      open: ({file}) ->
        return false unless file
        a.href     = file.URL
        a.download = file.name
        true