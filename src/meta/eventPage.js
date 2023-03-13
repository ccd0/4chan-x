/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
let requestID = 0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const id = requestID;
  requestID++;
  sendResponse(id);
  return handlers[request.type](request, response => chrome.tabs.sendMessage(sender.tab.id, {id, data: response}));});

var handlers = {
  permission(request, cb) {
    const origins = request.origins || ['*://*/'];
    return chrome.permissions.contains({origins}, function(result) {
      if (result) {
        return cb(result);
      } else {
        return chrome.permissions.request({origins}, function(result) {
          if (chrome.runtime.lastError) {
            return cb(false);
          } else {
            return cb(result);
          }
        });
      }
    });
  },

  ajax(request, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', request.url, true);
    xhr.responseType = request.responseType;
    xhr.timeout = request.timeout;
    const object = request.headers || {};
    for (var key in object) {
      var value = object[key];
      xhr.setRequestHeader(key, value);
    }
    xhr.addEventListener('load', function() {
      let {status, statusText, response} = this;
      const responseHeaderString = this.getAllResponseHeaders();
      if (response && (request.responseType === 'arraybuffer')) {
        response = [...Array.from(new Uint8Array(response))];
      }
      return cb({status, statusText, response, responseHeaderString});
    }
    , false);
    xhr.addEventListener('error', () => cb({error: true})
    , false);
    xhr.addEventListener('abort', () => cb({error: true})
    , false);
    xhr.addEventListener('timeout', () => cb({error: true})
    , false);
    return xhr.send();
  }
};
