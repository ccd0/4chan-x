<% if (type === 'crx') { %>
eventPageRequest = do ->
  callbacks = []
  chrome.runtime.onMessage.addListener (response) ->
    callbacks[response.id] response.data
    delete callbacks[response.id]
  (params, cb) ->
    chrome.runtime.sendMessage params, (id) ->
      callbacks[id] = cb

<% } %>
CrossOrigin =
  binary: (url, cb, headers={}) ->
    # XXX https://forums.lanik.us/viewtopic.php?f=64&t=24173&p=78310
    url = url.replace /^((?:https?:)?\/\/(?:\w+\.)?4c(?:ha|d)n\.org)\/adv\//, '$1//adv/'
    <% if (type === 'crx') { %>
    eventPageRequest {type: 'ajax', url, responseType: 'arraybuffer'}, ({response, contentType, contentDisposition, error}) ->
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
  # Interface is a subset of that of $.ajax.
  # Returns an object with `status`, `statusText`, `response` properties, all initially set falsy.
  # On success, populates the properties.
  # Both on success or error/abort/timeout, calls `options.onloadend` with the returned object as `this`.
  ajax: (url, options={}) ->
    {onloadend, timeout} = options

    <% if (type === 'userscript') { %>
    unless GM?.xmlHttpRequest? or GM_xmlhttpRequest?
      return $.ajax url, options
    <% } %>

    req =
      status: 0
      statusText: ''
      response: null

    <% if (type === 'userscript') { %>
    (GM?.xmlHttpRequest or GM_xmlhttpRequest)
      method: "GET"
      url: url+''
      timeout: timeout
      onload: (xhr) ->
        try
          response = JSON.parse(xhr.responseText)
          $.extend req, {response, status: xhr.status, statusText: xhr.statusText}
        onloadend.call(req)
      onerror:   -> onloadend.call(req)
      onabort:   -> onloadend.call(req)
      ontimeout: -> onloadend.call(req)
    <% } %>

    <% if (type === 'crx') { %>
    eventPageRequest {type: 'ajax', url, responseType: 'json', timeout}, (result) ->
      if result.status
        $.extend req, result
      onloadend.call(req)
    <% } %>

    req

  cache: (url, cb, options={}, extra={}) ->
    extra.ajax = CrossOrigin.ajax
    $.cache url, cb, options, extra

  permission: (cb) ->
    <% if (type === 'crx') { %>
    eventPageRequest {type: 'permission'}, -> cb()
    <% } %>
    <% if (type === 'userscript') { %>
    cb()
    <% } %>
