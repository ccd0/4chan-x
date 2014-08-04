CrossOrigin = do ->

  makeBlob = (urlBlob, contentType, contentDisposition, url) ->
    name = url.match(/([^\/]+)\/*$/)?[1]
    mime = contentType?.match(/[^;]*/)[0] or 'application/octet-stream'
    match =
      contentDisposition?.match(/\bfilename\s*=\s*"((\\"|[^"])+)"/i)?[1] or
      contentType?.match(/\bname\s*=\s*"((\\"|[^"])+)"/i)?[1]
    if match
      name = match.replace /\\"/g, '"'
    blob = new Blob([urlBlob], {type: mime})
    blob.name = name
    blob

  file = (url, cb) ->
    <% if (type === 'crx') { %>
    $.ajax url,
      responseType: 'blob'
      onload: ->
        return cb null unless @readyState is @DONE and @status is 200
        contentType        = @getResponseHeader 'Content-Type'
        contentDisposition = @getResponseHeader 'Content-Disposition'
        cb (makeBlob @response, contentType, contentDisposition, url)
      onerror: ->
        cb null
    <% } %>
    <% if (type === 'userscript') { %>
    GM_xmlhttpRequest
      method: "GET"
      url: url
      overrideMimeType: "text/plain; charset=x-user-defined"
      onload: (xhr) ->
        r = xhr.responseText
        data = new Uint8Array r.length
        i = 0
        while i < r.length
          data[i] = r.charCodeAt i
          i++
        contentType        = xhr.responseHeaders.match(/Content-Type:\s*(.*)/i)?[1]
        contentDisposition = xhr.responseHeaders.match(/Content-Disposition:\s*(.*)/i)?[1]
        cb (makeBlob data, contentType, contentDisposition, url)
      onerror: ->
        cb null
    <% } %>

  {file}
