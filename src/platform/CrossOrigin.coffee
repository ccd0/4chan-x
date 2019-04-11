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
    eventPageRequest {type: 'ajax', url, headers, responseType: 'arraybuffer'}, ({response, responseHeaderString}) ->
      response = new Uint8Array(response) if response
      cb response, responseHeaderString
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
        cb data, xhr.responseHeaders
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
    CrossOrigin.binary url, (data, headers) ->
      return cb null unless data?
      name = url.match(/([^\/]+)\/*$/)?[1]
      contentType        = headers.match(/Content-Type:\s*(.*)/i)?[1]
      contentDisposition = headers.match(/Content-Disposition:\s*(.*)/i)?[1]
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

  Request: class Request
    status: 0
    statusText: ''
    response: null
    responseHeaderString: null
    getResponseHeader: (headerName) ->
      if !@responseHeaders? and @responseHeaderString?
        @responseHeaders = {}
        for header in @responseHeaderString.split('\r\n')
          if (i = header.indexOf(':')) >= 0
            key = header[...i].trim().toLowerCase()
            val = header[i+1..].trim()
            @responseHeaders[key] = val
      (@responseHeaders or {})[headerName.toLowerCase()] ? null
    abort: ->
    onloadend: ->

  # Attempts to fetch `url` in JSON format using cross-origin privileges, if available.
  # Interface is a subset of that of $.ajax.
  # Options:
  #   `onloadend` - called with the returned object as `this` on success or error/abort/timeout.
  #   `timeout` - time limit for request
  #   `headers` - request headers
  # Returned object properties:
  #   `status` - HTTP status (0 if connection not successful)
  #   `statusText` - HTTP status text
  #   `response` - decoded response body
  #   `abort` - function for aborting the request (silently fails on some platforms)
  #   `getResponseHeader` - function for reading response headers
  ajax: (url, options={}) ->
    {onloadend, timeout, headers} = options

    <% if (type === 'userscript') { %>
    unless GM?.xmlHttpRequest? or GM_xmlhttpRequest?
      return $.ajax url, options
    <% } %>

    req = new CrossOrigin.Request()
    req.onloadend = onloadend

    <% if (type === 'userscript') { %>
    gmReq = (GM?.xmlHttpRequest or GM_xmlhttpRequest) {
      method: 'GET'
      url
      headers
      timeout
      onload: (xhr) ->
        try
          response = if xhr.responseText then JSON.parse(xhr.responseText) else null
          $.extend req, {
            response
            status: xhr.status
            statusText: xhr.statusText
            responseHeaderString: xhr.responseHeaders
          }
        req.onloadend()
      onerror:   -> req.onloadend()
      onabort:   -> req.onloadend()
      ontimeout: -> req.onloadend()
    }
    if gmReq and typeof gmReq.abort is 'function'
      req.abort = ->
        try
          gmReq.abort()
    <% } %>

    <% if (type === 'crx') { %>
    eventPageRequest {type: 'ajax', url, responseType: 'json', headers, timeout}, (result) ->
      if result.status
        $.extend req, result
      req.onloadend()
    <% } %>

    req

  cache: (url, cb) ->
    $.cache url, cb,
      ajax: CrossOrigin.ajax

  permission: (cb) ->
    <% if (type === 'crx') { %>
    eventPageRequest {type: 'permission'}, -> cb()
    <% } %>
    <% if (type === 'userscript') { %>
    cb()
    <% } %>
