DownloadLink =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Menu'] or !Conf['Download Link']

    a = $.el 'a',
      className: 'download-link'
      textContent: 'Download file'

    <% if (type === 'userscript') { %>
    unless chrome?
      # Firefox places same-origin restrictions on links with the download attribute.
      $.on a, 'click', (e) ->
        return true if @protocol is 'blob:'
        e.preventDefault()
        CrossOrigin.request @href, (blob) =>
          if blob
            @href = URL.createObjectURL blob
            @click()
          else
            new Notice 'error', "Could not download #{file.URL}", 30
    <% } %>

    $.event 'AddMenuEntry',
      type: 'post'
      el: a
      order: 100
      open: ({file}) ->
        return false unless file
        a.href     = file.URL
        a.download = file.name
        true
