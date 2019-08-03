requestID = 0

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  id = requestID
  requestID++
  sendResponse id
  handlers[request.type] request, (response) ->
    chrome.tabs.sendMessage sender.tab.id, {id, data: response}

handlers =
  permission: (request, cb) ->
    origins = request.origins or ['*://*/']
    chrome.permissions.contains {origins}, (result) ->
      if result
        cb result
      else
        chrome.permissions.request {origins}, (result) ->
          if chrome.runtime.lastError
            cb false
          else
            cb result

  ajax: (request, cb) ->
    xhr = new XMLHttpRequest()
    xhr.open 'GET', request.url, true
    xhr.responseType = request.responseType
    xhr.timeout = request.timeout
    for key, value of (request.headers or {})
      xhr.setRequestHeader key, value
    xhr.addEventListener 'load', ->
      {status, statusText, response} = @
      responseHeaderString = @getAllResponseHeaders()
      if response and request.responseType is 'arraybuffer'
        response = [new Uint8Array(response)...]
      cb {status, statusText, response, responseHeaderString}
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
