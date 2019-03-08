requestID = 0

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  id = requestID
  requestID++
  sendResponse id
  handlers[request.type] request, (response) ->
    chrome.tabs.sendMessage sender.tab.id, {id, data: response}

handlers =
  ajax: (request, cb) ->
    if request.responseType is 'arraybuffer'
      # Cross-origin image fetching. Need permission.
      chrome.permissions.contains
        origins: ['*://*/']
      , (result) ->
        if result
          ajax request, cb
        else
          chrome.permissions.request
            origins: ['*://*/']
          , ->
            ajax request, cb
      return true
    else
      # JSON fetching from non-HTTPS archive.
      ajax request, cb

ajax = (request, cb) ->
  xhr = new XMLHttpRequest()
  xhr.open 'GET', request.url, true
  xhr.responseType = request.responseType
  xhr.timeout = request.timeout
  xhr.addEventListener 'load', ->
    {status, statusText, response} = @
    if @readyState is @DONE && xhr.status is 200
      if request.responseType is 'arraybuffer'
        response = [new Uint8Array(response)...]
        contentType = @getResponseHeader 'Content-Type'
        contentDisposition = @getResponseHeader 'Content-Disposition'
      cb {status, statusText, response, contentType, contentDisposition}
    else
      cb {status, statusText, response, error: true}
  , false
  xhr.addEventListener 'error', ->
    cb {error: true}
  , false
  xhr.addEventListener 'abort', ->
    cb {error: true}
  , false
  xhr.addEventListener 'timeout', ->
    cb {error: true}
  , false
  xhr.send()
