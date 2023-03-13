/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// loosely follows the jquery api:
// http://api.jquery.com/
// not chainable
const $ = (selector, root=d.body) => root.querySelector(selector);

$.DAY = 24 * (
  $.HOUR = 60 * (
    $.MINUTE = 60 * (
      $.SECOND = 1000
    )
  )
);

$.id = id => d.getElementById(id);

$.ready = function(fc) {
  if (d.readyState !== 'loading') {
    $.queueTask(fc);
    return;
  }
  var cb = function() {
    $.off(d, 'DOMContentLoaded', cb);
    return fc();
  };
  return $.on(d, 'DOMContentLoaded', cb);
};

$.formData = function(form) {
  if (form instanceof HTMLFormElement) {
    return new FormData(form);
  }
  const fd = new FormData();
  for (var key in form) {
    var val = form[key];
    if (val) {
      if ((typeof val === 'object') && 'newName' in val) {
        fd.append(key, val, val.newName);
      } else {
        fd.append(key, val);
      }
    }
  }
  return fd;
};

$.extend = function(object, properties) {
  for (var key in properties) {
    var val = properties[key];
    object[key] = val;
  }
};

$.dict = () => Object.create(null);

$.dict.clone = function(obj) {
  if ((typeof obj !== 'object') || (obj === null)) {
    return obj;
  } else if (obj instanceof Array) {
    const arr = [];
    for (let i = 0, end = obj.length; i < end; i++) {
      arr.push($.dict.clone(obj[i]));
    }
    return arr;
  } else {
    const map = Object.create(null);
    for (var key in obj) {
      var val = obj[key];
      map[key] = $.dict.clone(val);
    }
    return map;
  }
};

$.dict.json = str => $.dict.clone(JSON.parse(str));

$.hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

$.getOwn = function(obj, key) {
  if (Object.prototype.hasOwnProperty.call(obj, key)) { return obj[key]; } else { return undefined; }
};

$.ajax = (function() {
  let pageXHR;
  if (window.wrappedJSObject && !XMLHttpRequest.wrappedJSObject) {
    pageXHR = XPCNativeWrapper(window.wrappedJSObject.XMLHttpRequest);
  } else {
    pageXHR = XMLHttpRequest;
  }

  (function(url, options={}) {
    if (options.responseType == null) { options.responseType = 'json'; }
    if (!options.type) { options.type = (options.form && 'post') || 'get'; }
    // XXX https://forums.lanik.us/viewtopic.php?f=64&t=24173&p=78310
    url = url.replace(/^((?:https?:)?\/\/(?:\w+\.)?(?:4chan|4channel|4cdn)\.org)\/adv\//, '$1//adv/');
    // <% if (type === 'crx') { %>
    // # XXX https://bugs.chromium.org/p/chromium/issues/detail?id=920638
    // if Conf['Work around CORB Bug'] and g.SITE.software is 'yotsuba' and !options.testCORB and FormData.prototype.entries
    //   return $.ajaxPage url, options
    // <% } %>
    const {onloadend, timeout, responseType, withCredentials, type, onprogress, form, headers} = options;
    const r = new pageXHR();
    try {
      r.open(type, url, true);
      const object = headers || {};
      for (var key in object) {
        var value = object[key];
        r.setRequestHeader(key, value);
      }
      $.extend(r, {onloadend, timeout, responseType, withCredentials});
      $.extend(r.upload, {onprogress});
      // connection error or content blocker
      $.on(r, 'error', function() { if (!r.status) { return c.warn(`4chan X failed to load: ${url}`); } });
      // <% if (type === 'crx') { %>
      // # XXX https://bugs.chromium.org/p/chromium/issues/detail?id=920638
      // $.on r, 'load', ->
      //   if !Conf['Work around CORB Bug'] and r.readyState is 4 and r.status is 200 and r.statusText is '' and r.response is null
      //     $.set 'Work around CORB Bug', (Conf['Work around CORB Bug'] = Date.now())
      // <% } %>
      r.send(form);
    } catch (err) {
      // XXX Some content blockers in Firefox (e.g. Adblock Plus and NoScript) throw an exception instead of simulating a connection error.
      if (err.result !== 0x805e0006) { throw err; }
      r.onloadend = onloadend;
      $.queueTask($.event, 'error',   null, r);
      $.queueTask($.event, 'loadend', null, r);
    }
    return r;
  });

// <% if (type === 'crx') { %>
// # XXX https://bugs.chromium.org/p/chromium/issues/detail?id=920638
// do ->
  let requestID = 0;
  const requests = $.dict();

  $.ajaxPageInit = function() {
    $.global(function() {
      window.FCX.requests = Object.create(null);

      document.addEventListener('4chanXAjax', function(e) {
        let fd, r;
        const {url, timeout, responseType, withCredentials, type, onprogress, form, headers, id} = e.detail;
        window.FCX.requests[id] = (r = new XMLHttpRequest());
        r.open(type, url, true);
        const object = headers || {};
        for (var key in object) {
          var value = object[key];
          r.setRequestHeader(key, value);
        }
        r.responseType = responseType === 'document' ? 'text' : responseType;
        r.timeout = timeout;
        r.withCredentials = withCredentials;
        if (onprogress) {
          r.upload.onprogress = function(e) {
            const {loaded, total} = e;
            const detail = {loaded, total, id};
            return document.dispatchEvent(new CustomEvent('4chanXAjaxProgress', {bubbles: true, detail}));
          };
        }
        r.onloadend = function() {
          delete window.FCX.requests[id];
          const {status, statusText, response} = this;
          const responseHeaderString = this.getAllResponseHeaders();
          const detail = {status, statusText, response, responseHeaderString, id};
          return document.dispatchEvent(new CustomEvent('4chanXAjaxLoadend', {bubbles: true, detail}));
        };
        // connection error or content blocker
        r.onerror = function() {
          if (!r.status) { return console.warn(`4chan X failed to load: ${url}`); }
        };
        if (form) {
          fd = new FormData();
          for (var entry of form) {
            fd.append(entry[0], entry[1]);
          }
        } else {
          fd = null;
        }
        return r.send(fd);
      }
      , false);

      return document.addEventListener('4chanXAjaxAbort', function(e) {
        let r;
        if (!(r = window.FCX.requests[e.detail.id])) { return; }
        return r.abort();
      }
      , false);
    });

    $.on(d, '4chanXAjaxProgress', function(e) {
      let req;
      if (!(req = requests[e.detail.id])) { return; }
      return req.upload.onprogress.call(req.upload, e.detail);
    });

    return $.on(d, '4chanXAjaxLoadend', function(e) {
      let req;
      if (!(req = requests[e.detail.id])) { return; }
      delete requests[e.detail.id];
      if (e.detail.status) {
        for (var key of ['status', 'statusText', 'response', 'responseHeaderString']) {
          req[key] = e.detail[key];
        }
        if (req.responseType === 'document') {
          req.response = new DOMParser().parseFromString(e.detail.response, 'text/html');
        }
      }
      return req.onloadend();
    });
  };

  return $.ajaxPage = function(url, options={}) {
    let req;
    let {onloadend, timeout, responseType, withCredentials, type, onprogress, form, headers} = options;
    const id = requestID++;
    requests[id] = (req = new CrossOrigin.Request());
    $.extend(req, {responseType, onloadend});
    req.upload = {onprogress};
    req.abort = () => $.event('4chanXAjaxAbort', {id});
    if (form) { form = Array.from(form.entries()); }
    $.event('4chanXAjax', {url, timeout, responseType, withCredentials, type, onprogress: !!onprogress, form, headers, id});
    return req;
  };
})();
// <% } %>

// Status Code 304: Not modified
// With the `If-Modified-Since` header we only receive the HTTP headers and no body for 304 responses.
// This saves a lot of bandwidth and CPU time for both the users and the servers.
$.lastModified = $.dict();
$.whenModified = function(url, bucket, cb, options={}) {
  let t;
  const {timeout, ajax} = options;
  const params = [];
  // XXX https://bugs.chromium.org/p/chromium/issues/detail?id=643659
  if ($.engine === 'blink') { params.push(`s=${bucket}`); }
  if (url.split('/')[2] === 'a.4cdn.org') { params.push(`t=${Date.now()}`); }
  const url0 = url;
  if (params.length) { url += '?' + params.join('&'); }
  const headers = $.dict();
  if ((t = $.lastModified[bucket]?.[url0]) != null) {
    headers['If-Modified-Since'] = t;
  }
  const r = (ajax || $.ajax)(url, {
    onloadend() {
      ($.lastModified[bucket] || ($.lastModified[bucket] = $.dict()))[url0] = this.getResponseHeader('Last-Modified');
      return cb.call(this);
    },
    timeout,
    headers
  });
  return r;
};

(function() {
  const reqs = $.dict();
  $.cache = function(url, cb, options={}) {
    let req;
    const {ajax} = options;
    if (req = reqs[url]) {
      if (req.callbacks) {
        req.callbacks.push(cb);
      } else {
        $.queueTask(() => cb.call(req, {isCached: true}));
      }
      return req;
    }
    const onloadend = function() {
      if (!this.status) {
        delete reqs[url];
      }
      for (cb of this.callbacks) {
        (cb => $.queueTask(() => cb.call(this, {isCached: false})))(cb);
      }
      return delete this.callbacks;
    };
    req = (ajax || $.ajax)(url, {onloadend});
    req.callbacks = [cb];
    return reqs[url] = req;
  };
  return $.cleanCache = function(testf) {
    for (var url in reqs) {
      if (testf(url)) {
        delete reqs[url];
      }
    }
  };
})();

$.cb = {
  checked() {
    if ($.hasOwn(Conf, this.name)) {
      $.set(this.name, this.checked);
      return Conf[this.name] = this.checked;
    }
  },
  value() {
    if ($.hasOwn(Conf, this.name)) {
      $.set(this.name, this.value.trim());
      return Conf[this.name] = this.value;
    }
  }
};

$.asap = function(test, cb) {
  if (test()) {
    return cb();
  } else {
    return setTimeout($.asap, 25, test, cb);
  }
};

$.onExists = function(root, selector, cb) {
  let el;
  if (el = $(selector, root)) {
    return cb(el);
  }
  var observer = new MutationObserver(function() {
    if (el = $(selector, root)) {
      observer.disconnect();
      return cb(el);
    }
  });
  return observer.observe(root, {childList: true, subtree: true});
};

$.addStyle = function(css, id, test='head') {
  const style = $.el('style',
    {textContent: css});
  if (id != null) { style.id = id; }
  $.onExists(doc, test, () => $.add(d.head, style));
  return style;
};

$.addCSP = function(policy) {
  const meta = $.el('meta', {
    httpEquiv: 'Content-Security-Policy',
    content:   policy
  }
  );
  if (d.head) {
    $.add(d.head, meta);
    return $.rm(meta);
  } else {
    const head = $.add((doc || d), $.el('head'));
    $.add(head, meta);
    return $.rm(head);
  }
};

$.x = function(path, root) {
  if (!root) { root = d.body; }
  // XPathResult.ANY_UNORDERED_NODE_TYPE === 8
  return d.evaluate(path, root, null, 8, null).singleNodeValue;
};

$.X = function(path, root) {
  if (!root) { root = d.body; }
  // XPathResult.ORDERED_NODE_SNAPSHOT_TYPE === 7
  return d.evaluate(path, root, null, 7, null);
};

$.addClass = function(el, ...classNames) {
  for (var className of classNames) { el.classList.add(className); }
};

$.rmClass = function(el, ...classNames) {
  for (var className of classNames) { el.classList.remove(className); }
};

$.toggleClass = (el, className) => el.classList.toggle(className);

$.hasClass = (el, className) => el.classList.includes(className);

$.rm = el => el?.remove();

$.rmAll = root => // https://gist.github.com/MayhemYDG/8646194
root.textContent = null;

$.tn = s => d.createTextNode(s);

$.frag = () => d.createDocumentFragment();

$.nodes = function(nodes) {
  if (!(nodes instanceof Array)) {
    return nodes;
  }
  const frag = $.frag();
  for (var node of nodes) {
    frag.appendChild(node);
  }
  return frag;
};

$.add = (parent, el) => parent.appendChild($.nodes(el));

$.prepend = (parent, el) => parent.insertBefore($.nodes(el), parent.firstChild);

$.after = (root, el) => root.parentNode.insertBefore($.nodes(el), root.nextSibling);

$.before = (root, el) => root.parentNode.insertBefore($.nodes(el), root);

$.replace = (root, el) => root.parentNode.replaceChild($.nodes(el), root);

$.el = function(tag, properties, properties2) {
  const el = d.createElement(tag);
  if (properties) { $.extend(el, properties); }
  if (properties2) { $.extend(el, properties2); }
  return el;
};

$.on = function(el, events, handler) {
  for (var event of events.split(' ')) {
    el.addEventListener(event, handler, false);
  }
};

$.off = function(el, events, handler) {
  for (var event of events.split(' ')) {
    el.removeEventListener(event, handler, false);
  }
};

$.one = function(el, events, handler) {
  var cb = function(e) {
    $.off(el, events, cb);
    return handler.call(this, e);
  };
  return $.on(el, events, cb);
};

$.event = function(event, detail, root=d) {
  // <% if (type === 'userscript') { %>
  if ((detail != null) && (typeof cloneInto === 'function')) {
    detail = cloneInto(detail, d.defaultView);
  }
  // <% } %>
  return root.dispatchEvent(new CustomEvent(event, {bubbles: true, cancelable: true, detail}));
};

// <% if (type === 'userscript') { %>
// XXX Make $.event work in Pale Moon with GM 3.x (no cloneInto function).
(function() {
  if (!/PaleMoon\//.test(navigator.userAgent) || (+GM_info?.version?.split('.')[0] < 2) || (typeof cloneInto !== 'undefined')) { return; }

  try {
    return new CustomEvent('x', {detail: {}});
  } catch (err) {
    const unsafeConstructors = {
      Object: unsafeWindow.Object,
      Array:  unsafeWindow.Array
    };
    var clone = function(obj) {
      let constructor;
      if ((obj != null) && (typeof obj === 'object') && (constructor = unsafeConstructors[obj.constructor.name])) {
        const obj2 = new constructor();
        for (var key in obj) { var val = obj[key]; obj2[key] = clone(val); }
        return obj2;
      } else {
        return obj;
      }
    };
    return $.event = (event, detail, root=d) => root.dispatchEvent(new CustomEvent(event, {bubbles: true, cancelable: true, detail: clone(detail)}));
  }
})();
// <% } %>

$.modifiedClick = e => e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || (e.button !== 0);

// <% if (type === 'userscript') { %>
$.open =
  (GM?.openInTab != null) ?
    GM.openInTab
  : (typeof GM_openInTab !== 'undefined' && GM_openInTab !== null) ?
    GM_openInTab
  :
    url => window.open(url, '_blank');
// <% } else { %>
$.open =
  url => window.open(url, '_blank');
// <% } %>

$.debounce = function(wait, fn) {
  let lastCall = 0;
  let timeout  = null;
  let that     = null;
  let args     = null;
  const exec = function() {
    lastCall = Date.now();
    return fn.apply(that, args);
  };
  return function() {
    args = arguments;
    that = this;
    if (lastCall < (Date.now() - wait)) {
      return exec();
    }
    // stop current reset
    clearTimeout(timeout);
    // after wait, let next invocation execute immediately
    return timeout = setTimeout(exec, wait);
  };
};

$.queueTask = (function() {
  // inspired by https://www.w3.org/Bugs/Public/show_bug.cgi?id=15007
  const taskQueue = [];
  const execTask = function() {
    const task = taskQueue.shift();
    const func = task[0];
    const args = Array.prototype.slice.call(task, 1);
    return func.apply(func, args);
  };
  if (window.MessageChannel) {
    const taskChannel = new MessageChannel();
    taskChannel.port1.onmessage = execTask;
    return function() {
      taskQueue.push(arguments);
      return taskChannel.port2.postMessage(null);
    };
  } else { // XXX Firefox
    return function() {
      taskQueue.push(arguments);
      return setTimeout(execTask, 0);
    };
  }
})();

$.global = function(fn, data) {
  if (doc) {
    const script = $.el('script',
      {textContent: `(${fn}).call(document.currentScript.dataset);`});
    if (data) { $.extend(script.dataset, data); }
    $.add((d.head || doc), script);
    $.rm(script);
    return script.dataset;
  } else {
    // XXX dwb
    try {
      fn.call(data);
    } catch (error) {}
    return data;
  }
};

$.bytesToString = function(size) {
  let unit = 0; // Bytes
  while (size >= 1024) {
    size /= 1024;
    unit++;
  }
  // Remove trailing 0s.
  size =
    unit > 1 ?
      // Keep the size as a float if the size is greater than 2^20 B.
      // Round to hundredth.
      Math.round(size * 100) / 100
    :
      // Round to an integer otherwise.
      Math.round(size);
  return `${size} ${['B', 'KB', 'MB', 'GB'][unit]}`;
};

$.minmax = (value, min, max) => value < min ?
  min
:
  value > max ?
    max
  :
    value;

$.hasAudio = video => video.mozHasAudio || !!video.webkitAudioDecodedByteCount;

$.luma = rgb => (rgb[0] * 0.299) + (rgb[1] * 0.587) + (rgb[2] * 0.114);

$.unescape = function(text) {
  if (text == null) { return text; }
  return text.replace(/<[^>]*>/g, '').replace(/&(amp|#039|quot|lt|gt|#44);/g, c => ({'&amp;': '&', '&#039;': "'", '&quot;': '"', '&lt;': '<', '&gt;': '>', '&#44;': ','})[c]);
};

$.isImage = url => /\.(jpe?g|png|gif|bmp|webp)$/i.test(url);
$.isVideo = url => /\.(webm|mp4|ogv)$/i.test(url);

$.engine = (function() {
  if (/Edge\//.test(navigator.userAgent)) { return 'edge'; }
  if (/Chrome\//.test(navigator.userAgent)) { return 'blink'; }
  if (/WebKit\//.test(navigator.userAgent)) { return 'webkit'; }
  if (/Gecko\/|Goanna/.test(navigator.userAgent)) { return 'gecko'; } // Goanna = Pale Moon 26+
})();

$.platform = '<%= type %>';

$.hasStorage = (function() {
  try {
    if (localStorage.getItem(g.NAMESPACE + 'hasStorage') === 'true') { return true; }
    localStorage.setItem(g.NAMESPACE + 'hasStorage', 'true');
    return localStorage.getItem(g.NAMESPACE + 'hasStorage') === 'true';
  } catch (error) {
    return false;
  }
})();

$.item = function(key, val) {
  const item = $.dict();
  item[key] = val;
  return item;
};

$.oneItemSugar = fn => (function(key, val, cb) {
  if (typeof key === 'string') {
    return fn($.item(key, val), cb);
  } else {
    return fn(key, val);
  }
});

$.syncing = $.dict();

$.securityCheck = function(data) {
  if (location.protocol !== 'https:') {
    return delete data['Redirect to HTTPS'];
  }
};

// <% if (type === 'crx') { %>
// https://developer.chrome.com/extensions/storage.html
$.oldValue = {
  local: $.dict(),
  sync:  $.dict()
};

chrome.storage.onChanged.addListener(function(changes, area) {
  for (var key in changes) {
    var oldValue = $.oldValue.local[key] ?? $.oldValue.sync[key];
    $.oldValue[area][key] = $.dict.clone(changes[key].newValue);
    var newValue = $.oldValue.local[key] ?? $.oldValue.sync[key];
    var cb = $.syncing[key];
    if (cb && (JSON.stringify(newValue) !== JSON.stringify(oldValue))) {
      cb(newValue, key);
    }
  }
});
$.sync = (key, cb) => $.syncing[key] = cb;
$.forceSync = function() {  };

$.crxWorking = function() {
  try {
    if (chrome.runtime.getManifest()) {
      return true;
    }
  } catch (error) {}
  if (!$.crxWarningShown) {
    const msg = $.el('div',
      {innerHTML: '4chan X seems to have been updated. You will need to <a href="javascript:;">reload</a> the page.'});
    $.on($('a', msg), 'click', () => location.reload());
    new Notice('warning', msg);
    $.crxWarningShown = true;
  }
  return false;
};

$.get = $.oneItemSugar(function(data, cb) {
  if (!$.crxWorking()) { return; }
  const results = {};
  const get = function(area) {
    let keys = Object.keys(data);
    // XXX slow performance in Firefox
    if (($.engine === 'gecko') && (area === 'sync') && (keys.length > 3)) {
      keys = null;
    }
    return chrome.storage[area].get(keys, function(result) {
      let key;
      result = $.dict.clone(result);
      if (chrome.runtime.lastError) {
        c.error(chrome.runtime.lastError.message);
      }
      if (keys === null) {
        const result2 = $.dict();
        for (key in result) { var val = result[key]; if ($.hasOwn(data, key)) { result2[key] = val; } }
        result = result2;
      }
      for (key in data) {
        $.oldValue[area][key] = result[key];
      }
      results[area] = result;
      if (results.local && results.sync) {
        $.extend(data, results.sync);
        $.extend(data, results.local);
        return cb(data);
      }
    });
  };
  get('local');
  return get('sync');
});

(function() {
  const items = {
    local: $.dict(),
    sync:  $.dict()
  };

  const exceedsQuota = (key, value) => // bytes in UTF-8
  unescape(encodeURIComponent(JSON.stringify(key))).length + unescape(encodeURIComponent(JSON.stringify(value))).length > chrome.storage.sync.QUOTA_BYTES_PER_ITEM;

  $.delete = function(keys) {
    if (!$.crxWorking()) { return; }
    if (typeof keys === 'string') {
      keys = [keys];
    }
    for (var key of keys) {
      delete items.local[key];
      delete items.sync[key];
    }
    chrome.storage.local.remove(keys);
    return chrome.storage.sync.remove(keys);
  };

  const timeout = {};
  var setArea = function(area, cb) {
    const data = $.dict();
    $.extend(data, items[area]);
    if (!Object.keys(data).length || (timeout[area] > Date.now())) { return; }
    return chrome.storage[area].set(data, function() {
      let err;
      let key;
      if (err = chrome.runtime.lastError) {
        c.error(err.message);
        setTimeout(setArea, $.MINUTE, area);
        timeout[area] = Date.now() + $.MINUTE;
        return cb?.(err);
      }

      delete timeout[area];
      for (key in data) { if (items[area][key] === data[key]) { delete items[area][key]; } }
      if (area === 'local') {
        for (key in data) { var val = data[key]; if (!exceedsQuota(key, val)) { items.sync[key] = val; } }
        setSync();
      } else {
        chrome.storage.local.remove(((() => {
          const result = [];
          for (key in data) {
            if (!(key in items.local)) {
              result.push(key);
            }
          }
          return result;
        })()));
      }
      return cb?.();
    });
  };

  var setSync = $.debounce($.SECOND, () => setArea('sync'));

  $.set = $.oneItemSugar(function(data, cb) {
    if (!$.crxWorking()) { return; }
    $.securityCheck(data);
    $.extend(items.local, data);
    return setArea('local', cb);
  });

  return $.clear = function(cb) {
    if (!$.crxWorking()) { return; }
    items.local = $.dict();
    items.sync  = $.dict();
    let count = 2;
    let err   = null;
    const done  = function() {
      if (chrome.runtime.lastError) {
        c.error(chrome.runtime.lastError.message);
      }
      if (err == null) { err = chrome.runtime.lastError; }
      if (!--count) { return cb?.(err); }
    };
    chrome.storage.local.clear(done);
    return chrome.storage.sync.clear(done);
  };
})();
// <% } else { %>

// http://wiki.greasespot.net/Main_Page
// https://tampermonkey.net/documentation.php

if ((GM?.deleteValue != null) && window.BroadcastChannel && (typeof GM_addValueChangeListener === 'undefined' || GM_addValueChangeListener === null)) {

  $.syncChannel = new BroadcastChannel(g.NAMESPACE + 'sync');

  $.on($.syncChannel, 'message', e => (() => {
    const result = [];
    for (var key in e.data) {
      var cb;
      var val = e.data[key];
      if (cb = $.syncing[key]) {
        result.push(cb($.dict.json(JSON.stringify(val)), key));
      }
    }
    return result;
  })());

  $.sync = (key, cb) => $.syncing[key] = cb;

  $.forceSync = function() {};

  $.delete = function(keys, cb) {
    let key;
    if (!(keys instanceof Array)) {
      keys = [keys];
    }
    return Promise.all((() => {
      const result = [];
      for (key of keys) {         result.push(GM.deleteValue(g.NAMESPACE + key));
      }
      return result;
    })()).then(function() {
      const items = $.dict();
      for (key of keys) { items[key] = undefined; }
      $.syncChannel.postMessage(items);
      return cb?.();
    });
  };

  $.get = $.oneItemSugar(function(items, cb) {
    const keys = Object.keys(items);
    return Promise.all(keys.map((key) => GM.getValue(g.NAMESPACE + key))).then(function(values) {
      for (let i = 0; i < values.length; i++) {
        var val = values[i];
        if (val) {
          items[keys[i]] = $.dict.json(val);
        }
      }
      return cb(items);
    });
  });

  $.set = $.oneItemSugar(function(items, cb) {
    $.securityCheck(items);
    return Promise.all((() => {
      const result = [];
      for (var key in items) {
        var val = items[key];
        result.push(GM.setValue(g.NAMESPACE + key, JSON.stringify(val)));
      }
      return result;
    })()).then(function() {
      $.syncChannel.postMessage(items);
      return cb?.();
    });
  });

  $.clear = cb => GM.listValues().then(keys => $.delete(keys.map(key => key.replace(g.NAMESPACE, '')), cb)).catch( () => $.delete(Object.keys(Conf).concat(['previousversion', 'QR Size', 'QR.persona']), cb));
} else {

  if (typeof GM_deleteValue === 'undefined' || GM_deleteValue === null) {
    $.perProtocolSettings = true;
  }

  if (typeof GM_deleteValue !== 'undefined' && GM_deleteValue !== null) {
    $.getValue   = GM_getValue;
    $.listValues = () => GM_listValues(); // error when called if missing
  } else if ($.hasStorage) {
    $.getValue = key => localStorage.getItem(key);
    $.listValues = () => (() => {
      const result = [];
      for (var key in localStorage) {
        if (key.slice(0, g.NAMESPACE.length) === g.NAMESPACE) {
          result.push(key);
        }
      }
      return result;
    })();
  } else {
    $.getValue   = function() {};
    $.listValues = () => [];
  }

  if (typeof GM_addValueChangeListener !== 'undefined' && GM_addValueChangeListener !== null) {
    $.setValue    = GM_setValue;
    $.deleteValue = GM_deleteValue;
  } else if (typeof GM_deleteValue !== 'undefined' && GM_deleteValue !== null) {
    $.oldValue = $.dict();
    $.setValue = function(key, val) {
      GM_setValue(key, val);
      if (key in $.syncing) {
        $.oldValue[key]   = val;
        if ($.hasStorage) { return localStorage.setItem(key, val); } // for `storage` events
      }
    };
    $.deleteValue = function(key) {
      GM_deleteValue(key);
      if (key in $.syncing) {
        delete $.oldValue[key];
        if ($.hasStorage) { return localStorage.removeItem(key); } // for `storage` events
      }
    };
    if (!$.hasStorage) { $.cantSync = true; }
  } else if ($.hasStorage) {
    $.oldValue = $.dict();
    $.setValue = function(key, val) {
      if (key in $.syncing) { $.oldValue[key]   = val; }
      return localStorage.setItem(key, val);
    };
    $.deleteValue = function(key) {
      if (key in $.syncing) { delete $.oldValue[key]; }
      return localStorage.removeItem(key);
    };
  } else {
    $.setValue = function() {};
    $.deleteValue = function() {};
    $.cantSync = ($.cantSet = true);
  }

  if (typeof GM_addValueChangeListener !== 'undefined' && GM_addValueChangeListener !== null) {
    $.sync = (key, cb) => $.syncing[key] = GM_addValueChangeListener(g.NAMESPACE + key, function(key2, oldValue, newValue, remote) {
      if (remote) {
        if (newValue !== undefined) { newValue = $.dict.json(newValue); }
        return cb(newValue, key);
      }
    });
    $.forceSync = function() {};
  } else if ((typeof GM_deleteValue !== 'undefined' && GM_deleteValue !== null) || $.hasStorage) {
    $.sync = function(key, cb) {
      key = g.NAMESPACE + key;
      $.syncing[key] = cb;
      return $.oldValue[key] = $.getValue(key);
    };

    (function() {
      const onChange = function({key, newValue}) {
        let cb;
        if (!(cb = $.syncing[key])) { return; }
        if (newValue != null) {
          if (newValue === $.oldValue[key]) { return; }
          $.oldValue[key] = newValue;
          return cb($.dict.json(newValue), key.slice(g.NAMESPACE.length));
        } else {
          if ($.oldValue[key] == null) { return; }
          delete $.oldValue[key];
          return cb(undefined, key.slice(g.NAMESPACE.length));
        }
      };
      $.on(window, 'storage', onChange);

      return $.forceSync = function(key) {
        // Storage events don't work across origins
        // e.g. http://boards.4chan.org and https://boards.4chan.org
        // so force a check for changes to avoid lost data.
        key = g.NAMESPACE + key;
        return onChange({key, newValue: $.getValue(key)});
      };
    })();
  } else {
    $.sync = function() {};
    $.forceSync = function() {};
  }

  $.delete = function(keys) {
    if (!(keys instanceof Array)) {
      keys = [keys];
    }
    for (var key of keys) {
      $.deleteValue(g.NAMESPACE + key);
    }
  };

  $.get = $.oneItemSugar((items, cb) => $.queueTask($.getSync, items, cb));

  $.getSync = function(items, cb) {
    for (var key in items) {
      var val2;
      if (val2 = $.getValue(g.NAMESPACE + key)) {
        try {
          items[key] = $.dict.json(val2);
        } catch (err) {
          // XXX https://github.com/ccd0/4chan-x/issues/2218
          if (!/^(?:undefined)*$/.test(val2)) {
            throw err;
          }
        }
      }
    }
    return cb(items);
  };

  $.set = $.oneItemSugar(function(items, cb) {
    $.securityCheck(items);
    return $.queueTask(function() {
      for (var key in items) {
        var value = items[key];
        $.setValue(g.NAMESPACE + key, JSON.stringify(value));
      }
      return cb?.();
    });
  });

  $.clear = function(cb) {
    // XXX https://github.com/greasemonkey/greasemonkey/issues/2033
    // Also support case where GM_listValues is not defined.
    $.delete(Object.keys(Conf));
    $.delete(['previousversion', 'QR Size', 'QR.persona']);
    try {
      $.delete($.listValues().map(key => key.replace(g.NAMESPACE, '')));
    } catch (error) {}
    return cb?.();
  };
}

// <% } %>
