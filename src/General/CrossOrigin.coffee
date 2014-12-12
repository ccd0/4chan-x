CrossOrigin = do ->
  <% if (type === 'crx') { %>
  eventPageRequest = do ->
    callbacks = []
    chrome.runtime.onMessage.addListener (data) ->
      callbacks[data.id] data
      delete callbacks[data.id]
    (url, responseType, cb) ->
      chrome.runtime.sendMessage {url, responseType}, (id) ->
        callbacks[id] = cb
  <% } %>

  file: do ->
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

    (url, cb) ->
      <% if (type === 'crx') { %>
      if /^https:\/\//.test(url) or location.protocol is 'http:'
        $.ajax url,
          responseType: 'blob'
          onload: ->
            return cb null unless @readyState is @DONE and @status is 200
            contentType        = @getResponseHeader 'Content-Type'
            contentDisposition = @getResponseHeader 'Content-Disposition'
            cb (makeBlob @response, contentType, contentDisposition, url)
          onerror: ->
            cb null
      else
        eventPageRequest url, 'arraybuffer', ({response, contentType, contentDisposition, error}) ->
          return cb null if error
          cb (makeBlob new Uint8Array(response), contentType, contentDisposition, url)
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

  json: do ->
    callbacks = {}
    responses = {}
    (url, cb) ->
      <% if (type === 'crx') { %>
      if /^https:\/\//.test(url) or location.protocol is 'http:'
        return $.cache url, (-> cb @response), responseType: 'json'
      <% } %>
      if responses[url]
        cb responses[url]
        return
      if callbacks[url]
        callbacks[url].push cb
        return
      callbacks[url] = [cb]
      <% if (type === 'userscript') { %>
      GM_xmlhttpRequest
        method: "GET"
        url: url+''
        onload: (xhr) ->
          response = JSON.parse xhr.responseText
          cb response for cb in callbacks[url]
          delete callbacks[url]
          responses[url] = response
        onerror: ->
          delete callbacks[url]
        onabort: ->
          delete callbacks[url]
      <% } %>
      <% if (type === 'crx') { %>
      eventPageRequest url, 'json', ({response, error}) ->
        if error
          delete callbacks[url]
        else
          cb response for cb in callbacks[url]
          delete callbacks[url]
          responses[url] = response
      <% } %>
