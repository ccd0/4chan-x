var data = require("sdk/self").data;
var Request = require("sdk/request").Request;
var tabs = require("sdk/tabs");
var system = require("sdk/system");
if (system.platform !== 'android') {
  // Clipboard is not supported on Android
  var clipboard = require("sdk/clipboard");
}
var pageMod = require("sdk/page-mod");
pageMod.PageMod({
  include: ["*.4chan.org", "*.4cdn.org"],
  contentScriptFile: data.url("greaseshim.js"),
  contentScriptWhen: "start",
  onAttach: function(worker) {
    worker.port.emit("load-userscript", data.load("4chan-X.user.js"));
    
    //GM_openInTab
    worker.port.on("GM_openInTab", function(url) {
      tabs.open(url);
    });
    
    //GM_setClipboard
    worker.port.on("GM_setClipboard", function(text) {
      if (system.platform !== 'android') {
        // Clipboard is not supported on Android
        clipboard.set(text);
      }
    });
    
    //GM_xmlhttpRequest
    worker.port.on("GM_xmlhttpRequest", function(details) {
      request = new Object();
      request.url = details.url;
      if (details.headers) {
        request.headers = details.headers;
        if (details.headers["Content-Type"]) {request.contentType = details.headers["Content-Type"]};
      };
      if (details.data) {request.content = encodeURIComponent(details.data)};
      if (details.overrideMimeType) {request.overrideMimeType = details.overrideMimeType};
    
      request.onComplete = function(response) {
        response.finalUrl = details.url;
        response.responseText = response.text;
        for (var headerName in response.headers) {
          _string = headerName + ": " + response.headers[headerName] + " \n";
          response.responseHeaders += _string;
        }
        response.readyState = 4;
        worker.port.emit("callback_GM_xmlhttpRequest", response);
      }
    
      xhr = Request(request);
      
      switch(details.method){
        case "GET":
          xhr.get();
          break;
        case "POST":
          xhr.post();
          break;
        case "HEAD":
          xhr.head();
          break;
        case "PUT":
          xhr.put();
          break;
        default: xhr.get();
      }
    });
   
    //GM_addStyle
    worker.port.on("GM_addStyle", function(css) {
      tabs.activeTab.attach({
        contentScript: "var style = document.createElement('style');" +
        "style.type = 'text/css';" +
        "style.innerHTML = '" + css + "';" +
        "document.head.appendChild(style);"
      });
    });
    
  }
});