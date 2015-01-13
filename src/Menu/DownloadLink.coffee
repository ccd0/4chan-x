DownloadLink =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Download Link']

    a = $.el 'a',
      className: 'download-link'
      textContent: 'Download file'

    # Specifying the filename with the download attribute only works for same-origin links.
    $.on a, 'click', @download

    Menu.menu.addEntry
      el: a
      order: 100
      open: ({file}) ->
        return false unless file
        a.href     = file.URL
        a.download = file.name
        true

  download: (e) ->
    return true if @protocol is 'blob:'
    e.preventDefault()
    CrossOrigin.file @href, (blob) =>
      if blob
        @href = URL.createObjectURL blob
        @click()
      else
        new Notice 'error', "Could not download #{@href}", 30