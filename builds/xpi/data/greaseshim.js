function GM_openInTab(_url) {
  self.port.emit("GM_openInTab", _url);
  return; // Should return the Window object
};

function GM_setValue(_name, _value) {
  localStorage[_name] = _value;
  return;
};

function GM_getValue(_name, _default) {
  if (localStorage[_name] === null && _default === null) return null;
  return (localStorage[_name] || _default);
};

function GM_deleteValue(_name) {
  localStorage.removeItem(_name);
  return;
};

function GM_listValues() {
  return Object.keys(localStorage);
};

function GM_setClipboard(_text) {
  self.port.emit("GM_setClipboard", _text);
};

//Deprecated
function GM_log(_message) {
  console.log(_message);
  return;
};

function GM_xmlhttpRequest(_details) {
  //Ugly hack? Race condition? Memory leak?
  _onload = _details.onload;
  _context = _details.context;
  self.port.emit("GM_xmlhttpRequest", _details);
};

self.port.on("callback_GM_xmlhttpRequest", function(_response) {
  _response.context = _context;
  _onload(_response);
});

function GM_addStyle(_css) {
  self.port.emit("GM_addStyle", _css);
}

var GM_info = new Object();
GM_info.version = '1.15';
GM_info.scriptWillUpdate = true;

//To do
function GM_registerMenuCommand(_caption, _commandFunc, _accessKey) {
  return;
}

self.port.on("load-userscript", function(_script) {
  eval(_script);
});
