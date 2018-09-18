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
CrossOrigin =
  binary: (url, cb, headers={}) ->
    # XXX https://forums.lanik.us/viewtopic.php?f=64&t=24173&p=78310
    url = url.replace /^((?:https?:)?\/\/(?:\w+\.)?4c(?:ha|d)n\.org)\/adv\//, '$1//adv/'
    <% if (type === 'crx') { %>
    parts = url.split '/'
    if parts[0] is location.protocol and parts[1] is '' and ImageHost.test(parts[2])
      xhr = new XMLHttpRequest()
      xhr.open 'GET', url, true
      xhr.setRequestHeader key, value for key, value of headers
      xhr.responseType = 'arraybuffer'
      xhr.onload = ->
        return cb null unless @readyState is @DONE and @status in [200, 206]
        contentType        = @getResponseHeader 'Content-Type'
        contentDisposition = @getResponseHeader 'Content-Disposition'
        cb new Uint8Array(@response), contentType, contentDisposition
      xhr.onerror = xhr.onabort = ->
        cb null
      xhr.send()
    else
      eventPageRequest url, 'arraybuffer', ({response, contentType, contentDisposition, error}) ->
        return cb null if error
        cb new Uint8Array(response), contentType, contentDisposition
    <% } %>
    <% if (type === 'userscript') { %>
    # Use workaround for binary data in Greasemonkey versions < 3.2, in Pale Moon for all GM versions, and in JS Blocker (Safari).
    workaround = $.engine is 'gecko' and GM_info? and /^[0-2]\.|^3\.[01](?!\d)/.test(GM_info.version)
    workaround or= /PaleMoon\//.test(navigator.userAgent)
    workaround or= GM_info?.script?.includeJSB?
    options =
      method: "GET"
      url: url
      headers: headers
      onload: (xhr) ->
        if workaround
          r = xhr.responseText
          data = new Uint8Array r.length
          i = 0
          while i < r.length
            data[i] = r.charCodeAt i
            i++
        else
          data = new Uint8Array xhr.response
        contentType        = xhr.responseHeaders.match(/Content-Type:\s*(.*)/i)?[1]
        contentDisposition = xhr.responseHeaders.match(/Content-Disposition:\s*(.*)/i)?[1]
        cb data, contentType, contentDisposition
      onerror: ->
        cb null
      onabort: ->
        cb null
    if workaround
      options.overrideMimeType = 'text/plain; charset=x-user-defined'
    else
      options.responseType = 'arraybuffer'
    (GM?.xmlHttpRequest or GM_xmlhttpRequest) options
    <% } %>

  file: (url, cb) ->
    CrossOrigin.binary url, (data, contentType, contentDisposition) ->
      return cb null unless data?
      name = url.match(/([^\/]+)\/*$/)?[1]
      mime = contentType?.match(/[^;]*/)[0] or 'application/octet-stream'
      match =
        contentDisposition?.match(/\bfilename\s*=\s*"((\\"|[^"])+)"/i)?[1] or
        contentType?.match(/\bname\s*=\s*"((\\"|[^"])+)"/i)?[1]
      if match
        name = match.replace /\\"/g, '"'
      if GM_info?.script?.includeJSB?
        # Content type comes back as 'text/plain; charset=x-user-defined'; guess from filename instead.
        mime = QR.typeFromExtension[name.match(/[^.]*$/)[0].toLowerCase()] or 'application/octet-stream'
      blob = new Blob([data], {type: mime})
      blob.name = name
      cb blob

  # Attempts to fetch `url` in JSON format using cross-origin privileges, if available.
  # On success, calls `cb` with a `this` containing properties `status`, `statusText`, `response` and caches result.
  # On error/abort, calls `cb` with a `this` of `{}`.
  # If `bypassCache` is true, ignores previously cached results.
  json: do ->
    callbacks = {}
    results = {}
    success = (url, result) ->
      for cb in callbacks[url]
        $.queueTask -> cb.call result
      delete callbacks[url]
      results[url] = result
    failure = (url) ->
      for cb in callbacks[url]
        $.queueTask -> cb.call {}
      delete callbacks[url]

    (url, cb, bypassCache) ->
      <% if (type === 'userscript') { %>
      unless GM?.xmlHttpRequest? or GM_xmlhttpRequest?
        if bypassCache
          $.cleanCache (url2) -> url2 is url
        if (req = $.cache url, cb, responseType: 'json')
          $.on req, 'abort error', -> cb.call({})
        else
          cb.call {}
        return
      <% } %>

      if bypassCache
        delete results[url]
      if results[url]
        cb.call results[url]
        return
      if callbacks[url]
        callbacks[url].push cb
        return
      callbacks[url] = [cb]

      <% if (type === 'userscript') { %>
      (GM?.xmlHttpRequest or GM_xmlhttpRequest)
        method: "GET"
        url: url+''
        onload: (xhr) ->
          {status, statusText} = xhr
          try
            response = JSON.parse(xhr.responseText)
            success url, {status, statusText, response}
          catch
            failure url
        onerror: -> failure(url)
        onabort: -> failure(url)
      <% } %>
      <% if (type === 'crx') { %>
      eventPageRequest url, 'json', (result) ->
        if result.status
          success url, result
        else
          failure url
      <% } %>
