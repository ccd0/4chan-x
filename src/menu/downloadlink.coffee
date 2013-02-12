DownloadLink =
  init: ->
    # Test for download feature support.
    return unless $.el('a').download?
    a = $.el 'a',
      className: 'download_link'
      textContent: 'Download file'
    Menu.addEntry
      el: a
      open: (post) ->
        unless post.img
          return false
        a.href     = post.img.parentNode.href
        fileText   = post.fileInfo.firstElementChild
        a.download =
          if Conf['File Info Formatting']
            fileText.dataset.filename
          else
            $('span', fileText).title
        true