CrossOrigin = do ->

  handleBlob = (urlBlob, contentType, contentDisposition, url, cb) ->
    name = url.match(/([^\/]+)\/*$/)?[1]
    mime = contentType?.match(/[^;]*/)[0] or 'application/octet-stream'
    match =
      contentDisposition?.match(/\bfilename\s*=\s*"((\\"|[^"])+)"/i)?[1] or
      contentType?.match(/\bname\s*=\s*"((\\"|[^"])+)"/i)?[1]
    if match
      name = match.replace /\\"/g, '"'
    blob = new Blob([urlBlob], {type: mime})
    blob.name = name
    cb blob

  handleUrl = (url, cb) ->
    <% if (type === 'crx') { %>
    xhr = new XMLHttpRequest();
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = (e) ->
      if @readyState is @DONE && xhr.status is 200
        contentType = @getResponseHeader('Content-Type')
        contentDisposition = @getResponseHeader('Content-Disposition')
        handleBlob @response, contentType, contentDisposition, url, cb
      else
        cb null
    xhr.onerror = (e) ->
      cb null
    xhr.send()
    <% } %>

    <% if (type === 'userscript') { %>
    GM_xmlhttpRequest
      method: "GET"
      url: url
      overrideMimeType: "text/plain; charset=x-user-defined"
      onload: (xhr) ->
        r = xhr.responseText
        data = new Uint8Array(r.length)
        i = 0
        while i < r.length
          data[i] = r.charCodeAt(i)
          i++
        contentType = xhr.responseHeaders.match(/Content-Type:\s*(.*)/i)?[1]
        contentDisposition = xhr.responseHeaders.match(/Content-Disposition:\s*(.*)/i)?[1]
        handleBlob data, contentType, contentDisposition, url, cb
      onerror: (xhr) ->
        cb null
    <% } %>

  return {request: handleUrl}

