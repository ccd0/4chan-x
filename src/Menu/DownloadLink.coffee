DownloadLink =
  init: ->
    return if !g.VIEW is 'catalog' or !Conf['Menu'] or !Conf['Download Link']

    a = $.el 'a',
      className: 'download-link'
      textContent: 'Download file'
    $.event 'AddMenuEntry',
      type: 'post'
      el: a
      order: 100
      open: ({file}) ->
        return false unless file
        a.href     = file.URL
        a.download = file.name
        true