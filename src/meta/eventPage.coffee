handlers = {}

requestID = 0

handlers.ajax = (request, sender, sendResponse) ->
  id = requestID
  requestID++
  sendResponse id

  xhr = new XMLHttpRequest()
  xhr.open 'GET', request.url, true
  xhr.responseType = request.responseType
  xhr.addEventListener 'load', ->
    if @readyState is @DONE && xhr.status is 200
      contentType = @getResponseHeader 'Content-Type'
      contentDisposition = @getResponseHeader 'Content-Disposition'
      {response} = @
      if request.responseType is 'arraybuffer'
        response = [new Uint8Array(response)...]
      chrome.tabs.sendMessage sender.tab.id, {id, response, contentType, contentDisposition}
    else
      chrome.tabs.sendMessage sender.tab.id, {id, error: true}
  , false
  xhr.addEventListener 'error', ->
    chrome.tabs.sendMessage sender.tab.id, {id, error: true}
  , false
  xhr.addEventListener 'abort', ->
    chrome.tabs.sendMessage sender.tab.id, {id, error: true}
  , false
  xhr.send()

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  handlers[request.type] request, sender, sendResponse
