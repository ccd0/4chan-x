DownloadLink =
  init: ->
    <% if (type === 'userscript') { %>
    # Firefox won't let us download cross-domain content.
    return
    <% } %>
    return if g.VIEW is 'catalog' or !Conf['Menu'] or !Conf['Download Link']

    # Test for download feature support.
    return unless 'download' of $.el 'a'

    a = $.el 'a',
      className: 'download-link'
      textContent: 'Download file'
    $.event 'AddMenuEntry',
      type: 'post'
      el: a
      order: 70
      open: ({file}) ->
        return false unless file
        a.href     = file.URL
        a.download = file.name
        true