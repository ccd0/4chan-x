requestID = 0

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  if request.responseType is 'arraybuffer'
    # Cross-origin image fetching. Need permission.
    chrome.permissions.contains
      origins: ['*://*/']
    , (result) ->
      if result
        ajax request, sender, sendResponse
      else
        chrome.permissions.request
          origins: ['*://*/']
        , ->
          ajax request, sender, sendResponse
    return true
  else
    # JSON fetching from non-HTTPS archive.
    ajax request, sender, sendResponse

ajax = (request, sender, sendResponse) ->
  id = requestID
  requestID++
  sendResponse id

  xhr = new XMLHttpRequest()
  xhr.open 'GET', request.url, true
  xhr.responseType = request.responseType
  xhr.addEventListener 'load', ->
    if @readyState is @DONE && xhr.status is 200
      {response} = @
      if request.responseType is 'arraybuffer'
        response = [new Uint8Array(response)...]
        contentType = @getResponseHeader 'Content-Type'
        contentDisposition = @getResponseHeader 'Content-Disposition'
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
