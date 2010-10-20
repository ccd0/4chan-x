(function() {
  var $, $$, AEOS, BOARD, DAY, PAGENUM, REPLY, THREAD_ID, _i, _j, _len, _len2, _ref, _ref2, a, addTo, arr, as, autoWatch, autohide, b, board, callback, callbacks, clearHidden, close, config, cutoff, d, delform, down, el, expandComment, expandThread, favEmpty, favNormal, favicon, getConfig, getTime, head, hiddenReplies, hiddenThreads, hide, hideReply, hideThread, href, html, i, i1, id, iframe, iframeLoad, iframeLoop, img, inAfter, inBefore, input, inputs, l, l1, lastChecked, magic, n, navtopr, nodeInserted, nop, now, omitted, onloadComment, onloadThread, options, optionsSave, parseResponse, pathname, quickReply, r, recaptcha, recaptchaListener, recaptchaReload, redirect, remove, replace, replyNav, report, show, showReply, showThread, slice, span, src, stopPropagation, submit, text, textContent, thread, threadF, threads, tn, up, watch, watchX, watched, watcher, watcherUpdate, x, xhrs;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty;
  config = {
    'Thread Hiding': true,
    'Reply Hiding': true,
    'Show Stubs': true,
    'Thread Navigation': true,
    'Reply Navigation': true,
    'Thread Watcher': true,
    'Thread Expansion': true,
    'Comment Expansion': true,
    'Quick Reply': true,
    'Persistent QR': false,
    'Quick Report': true,
    'Auto Watch': true,
    'Anonymize': false,
    '404 Redirect': true,
    'Post in Title': true
  };
  AEOS = {
    init: function() {
      if (typeof GM_deleteValue === 'undefined') {
        window.GM_setValue = function(name, value) {
          value = (typeof value)[0] + value;
          return localStorage.setItem(name, value);
        };
        window.GM_getValue = function(name, defaultValue) {
          var type, value;
          if (!(value = localStorage.getItem(name))) {
            return defaultValue;
          }
          type = value[0];
          value = value.substring(1);
          switch (type) {
            case 'b':
              return value === 'true';
            case 'n':
              return Number(value);
            default:
              return value;
          }
        };
        window.GM_addStyle = function(css) {
          var style;
          style = document.createElement('style');
          style.type = 'text/css';
          style.textContent = css;
          return document.getElementsByTagName('head')[0].appendChild(style);
        };
      }
      return GM_addStyle('\
            div.dialog {\
                border: 1px solid;\
            }\
            div.dialog > div.move {\
                cursor: move;\
            }\
            div.dialog label,\
            div.dialog a {\
                cursor: pointer;\
            }\
        ');
    },
    makeDialog: function(id, position) {
      var dialog, left, top;
      dialog = document.createElement('div');
      dialog.className = 'reply dialog';
      dialog.id = id;
      switch (position) {
        case 'topleft':
          left = '0px';
          top = '0px';
          break;
        case 'topright':
          left = null;
          top = '0px';
          break;
        case 'bottomleft':
          left = '0px';
          top = null;
          break;
        case 'bottomright':
          left = null;
          top = null;
          break;
      }
      left = GM_getValue("" + (id) + "Left", left);
      top = GM_getValue("" + (id) + "Top", top);
      if (left) {
        dialog.style.left = left;
      } else {
        dialog.style.right = '0px';
      }
      if (top) {
        dialog.style.top = top;
      } else {
        dialog.style.bottom = '0px';
      }
      return dialog;
    },
    move: function(e) {
      var div;
      div = this.parentNode;
      AEOS.div = div;
      AEOS.dx = e.clientX - div.offsetLeft;
      AEOS.dy = e.clientY - div.offsetTop;
      AEOS.width = document.body.clientWidth - div.offsetWidth;
      AEOS.height = document.body.clientHeight - div.offsetHeight;
      document.addEventListener('mousemove', AEOS.moveMove, true);
      return document.addEventListener('mouseup', AEOS.moveEnd, true);
    },
    moveMove: function(e) {
      var bottom, div, left, right, top;
      div = AEOS.div;
      left = e.clientX - AEOS.dx;
      if (left < 20) {
        left = '0px';
      } else if (AEOS.width - left < 20) {
        left = '';
      }
      right = left ? '' : '0px';
      div.style.left = left;
      div.style.right = right;
      top = e.clientY - AEOS.dy;
      if (top < 20) {
        top = '0px';
      } else if (AEOS.height - top < 20) {
        top = '';
      }
      bottom = top ? '' : '0px';
      div.style.top = top;
      return (div.style.bottom = bottom);
    },
    moveEnd: function() {
      var div, id;
      document.removeEventListener('mousemove', AEOS.moveMove, true);
      document.removeEventListener('mouseup', AEOS.moveEnd, true);
      div = AEOS.div;
      id = div.id;
      GM_setValue("" + (id) + "Left", div.style.left);
      return GM_setValue("" + (id) + "Top", div.style.top);
    }
  };
  AEOS.init();
  d = document;
  $ = function(selector, root) {
    root || (root = d.body);
    return root.querySelector(selector);
  };
  $$ = function(selector, root) {
    var _i, _len, _ref, _result, node, result;
    root || (root = d.body);
    result = root.querySelectorAll(selector);
    _result = []; _ref = result;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      _result.push(node);
    }
    return _result;
  };
  addTo = function(parent) {
    var _i, _len, _ref, _result, child, children;
    children = __slice.call(arguments, 1);
    _result = []; _ref = children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _result.push(parent.appendChild(child));
    }
    return _result;
  };
  getConfig = function(name) {
    return GM_getValue(name, config[name]);
  };
  getTime = function() {
    return Math.floor(new Date().getTime() / 1000);
  };
  hide = function(el) {
    return (el.style.display = 'none');
  };
  inAfter = function(root, el) {
    return root.parentNode.insertBefore(el, root.nextSibling);
  };
  inBefore = function(root, el) {
    return root.parentNode.insertBefore(el, root);
  };
  n = function(tag, props) {
    var _ref, el, event, funk, key, l, val;
    el = d.createElement(tag);
    if (props) {
      if (l = props.listener) {
        delete props.listener;
        _ref = l;
        event = _ref[0];
        funk = _ref[1];
        el.addEventListener(event, funk, true);
      }
      _ref = props;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        val = _ref[key];
        (el[key] = val);
      }
    }
    return el;
  };
  remove = function(el) {
    return el.parentNode.removeChild(el);
  };
  replace = function(root, el) {
    return root.parentNode.replaceChild(el, root);
  };
  show = function(el) {
    return (el.style.display = '');
  };
  slice = function(arr, id) {
    var _result, i, l;
    i = 0;
    l = arr.length;
    _result = [];
    while ((i < l)) {
      if (id === arr[i].id) {
        arr.splice(i, 1);
        return arr;
      }
      i++;
    }
    return _result;
  };
  tn = function(s) {
    return d.createTextNode(s);
  };
  x = function(path, root) {
    root || (root = d.body);
    return d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
  };
  watched = JSON.parse(GM_getValue('watched', '{}'));
  if (location.hostname.split('.')[0] === 'sys') {
    if (b = $('table font b')) {
      GM_setValue('error', b.firstChild.textContent);
    } else {
      GM_setValue('error', '');
      if (getConfig('Auto Watch')) {
        html = $('b').innerHTML;
        _ref = html.match(/<!-- thread:(\d+),no:(\d+) -->/);
        nop = _ref[0];
        thread = _ref[1];
        id = _ref[2];
        if (thread === '0') {
          board = $('meta', d).content.match(/4chan.org\/(\w+)\//)[1];
          watched[board] || (watched[board] = []);
          watched[board].push({
            id: id,
            text: GM_getValue('autoText')
          });
          GM_setValue('watched', JSON.stringify(watched));
        }
      }
    }
    return null;
  }
  pathname = location.pathname.substring(1).split('/');
  _ref = pathname;
  BOARD = _ref[0];
  magic = _ref[1];
  if (magic === 'res') {
    REPLY = magic;
    THREAD_ID = pathname[2];
  } else {
    PAGENUM = parseInt(magic) || 0;
  }
  xhrs = [];
  r = null;
  iframeLoop = false;
  callbacks = [];
  head = $('head', d);
  if (!(favicon = $('link[rel="shortcut icon"]', head))) {
    favicon = n('link', {
      rel: 'shortcut icon',
      href: 'http://static.4chan.org/image/favicon.ico'
    });
    addTo(head, favicon);
  }
  favNormal = favicon.href;
  favEmpty = 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==';
  hiddenThreads = JSON.parse(GM_getValue("hiddenThreads/" + (BOARD) + "/", '[]'));
  hiddenReplies = JSON.parse(GM_getValue("hiddenReplies/" + (BOARD) + "/", '[]'));
  lastChecked = GM_getValue('lastChecked', 0);
  now = getTime();
  DAY = 24 * 60 * 60;
  if (lastChecked < now - 1 * DAY) {
    cutoff = now - 7 * DAY;
    while (hiddenThreads.length) {
      if (hiddenThreads[0].timestamp > cutoff) {
        break;
      }
      hiddenThreads.shift();
    }
    while (hiddenReplies.length) {
      if (hiddenReplies[0].timestamp > cutoff) {
        break;
      }
      hiddenReplies.shift();
    }
    GM_setValue("hiddenThreads/" + (BOARD) + "/", JSON.stringify(hiddenThreads));
    GM_setValue("hiddenReplies/" + (BOARD) + "/", JSON.stringify(hiddenReplies));
    GM_setValue('lastChecked', now);
  }
  GM_addStyle('\
    #watcher {\
        position: absolute;\
    }\
    #watcher > div.move {\
        text-decoration: underline;\
        padding: 5px 5px 0 5px;\
    }\
    #watcher > div:last-child {\
        padding: 0 5px 5px 5px;\
    }\
    span.error {\
        color: red;\
    }\
    #qr.auto:not(:hover) form {\
        visibility: collapse;\
    }\
    #qr span.error {\
        position: absolute;\
        bottom: 0;\
        left: 0;\
    }\
    #qr {\
        position: fixed;\
    }\
    #qr > div {\
        text-align: right;\
    }\
    #qr > form > div, /* ad */\
    #qr td.rules {\
        display: none;\
    }\
    #options {\
        position: fixed;\
        padding: 5px;\
        text-align: right;\
    }\
    span.navlinks {\
        position: absolute;\
        right: 5px;\
    }\
    span.navlinks > a {\
        font-size: 16px;\
        text-decoration: none;\
    }\
    .pointer {\
        cursor: pointer;\
    }\
');
  clearHidden = function() {
    GM_deleteValue("hiddenReplies/" + (BOARD) + "/");
    GM_deleteValue("hiddenThreads/" + (BOARD) + "/");
    this.value = "hidden: 0";
    hiddenReplies = [];
    return (hiddenThreads = []);
  };
  options = function() {
    var _i, _ref2, checked, div, hiddenNum, option;
    if (div = $('#options')) {
      return remove(div);
    } else {
      div = AEOS.makeDialog('options', 'center');
      hiddenNum = hiddenReplies.length + hiddenThreads.length;
      html = '<div class="move">4chan X</div><div>';
      _ref2 = config;
      for (option in _ref2) {
        if (!__hasProp.call(_ref2, option)) continue;
        _i = _ref2[option];
        checked = getConfig(option) ? "checked" : "";
        html += ("<label>" + (option) + "<input " + (checked) + " name=\"" + (option) + "\" type=\"checkbox\"></label><br>");
      }
      html += ("<input type=\"button\" value=\"hidden: " + (hiddenNum) + "\"><br>");
      html += '<a name="save">save</a> <a name="cancel">cancel</a></div>';
      div.innerHTML = html;
      $('div.move', div).addEventListener('mousedown', AEOS.move, true);
      $('input[type="button"]', div).addEventListener('click', clearHidden, true);
      $('a[name="save"]', div).addEventListener('click', optionsSave, true);
      $('a[name="cancel"]', div).addEventListener('click', close, true);
      return addTo(d.body, div);
    }
  };
  showThread = function() {
    var div;
    div = this.nextSibling;
    show(div);
    hide(this);
    id = div.id;
    slice(hiddenThreads, id);
    return GM_setValue("hiddenThreads/" + (BOARD) + "/", JSON.stringify(hiddenThreads));
  };
  hideThread = function(div) {
    var _ref2, _ref3, a, name, num, p, span, text, trip;
    if (p = this.parentNode) {
      div = p;
      hiddenThreads.push({
        id: div.id,
        timestamp: getTime()
      });
      GM_setValue("hiddenThreads/" + (BOARD) + "/", JSON.stringify(hiddenThreads));
    }
    hide(div);
    if (getConfig('Show Stubs')) {
      if (span = $('.omittedposts', div)) {
        num = Number(span.textContent.match(/\d+/)[0]);
      } else {
        num = 0;
      }
      num += $$('table', div).length;
      text = num === 1 ? "1 reply" : ("" + (num) + " replies");
      name = $('span.postername', div).textContent;
      trip = ((typeof (_ref3 = ((_ref2 = $('span.postername + span.postertrip', div)))) === "undefined" || _ref3 === null) ? undefined : _ref3.textContent) || '';
      a = n('a', {
        textContent: ("[ + ] " + (name) + (trip) + " (" + (text) + ")"),
        className: 'pointer',
        listener: ['click', showThread]
      });
      return inBefore(div, a);
    }
  };
  threadF = function(current) {
    var _i, _len, _ref2, a, div, hidden;
    div = n('div', {
      className: 'thread'
    });
    a = n('a', {
      textContent: '[ - ]',
      className: 'pointer',
      listener: ['click', hideThread]
    });
    addTo(div, a);
    inBefore(current, div);
    while ((!current.clear)) {
      addTo(div, current);
      current = div.nextSibling;
    }
    addTo(div, current);
    current = div.nextSibling;
    id = $('input[value="delete"]', div).name;
    div.id = id;
    _ref2 = hiddenThreads;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      hidden = _ref2[_i];
      if (id === hidden.id) {
        hideThread(div);
      }
    }
    current = current.nextSibling.nextSibling;
    return current.nodeName !== 'CENTER' ? threadF(current) : null;
  };
  showReply = function() {
    var div, table;
    div = this.parentNode;
    table = div.nextSibling;
    show(table);
    remove(div);
    id = $('td.reply, td.replyhl', table).id;
    slice(hiddenReplies, id);
    return GM_setValue("hiddenReplies/" + (BOARD) + "/", JSON.stringify(hiddenReplies));
  };
  hideReply = function(reply) {
    var _ref2, _ref3, a, div, name, p, table, trip;
    if (p = this.parentNode) {
      reply = p.nextSibling;
      hiddenReplies.push({
        id: reply.id,
        timestamp: getTime()
      });
      GM_setValue("hiddenReplies/" + (BOARD) + "/", JSON.stringify(hiddenReplies));
    }
    name = $('span.commentpostername', reply).textContent;
    trip = ((typeof (_ref3 = ((_ref2 = $('span.postertrip', reply)))) === "undefined" || _ref3 === null) ? undefined : _ref3.textContent) || '';
    table = x('ancestor::table', reply);
    hide(table);
    if (getConfig('Show Stubs')) {
      a = n('a', {
        textContent: ("[ + ] " + (name) + " " + (trip)),
        className: 'pointer',
        listener: ['click', showReply]
      });
      div = n('div');
      addTo(div, a);
      return inBefore(table, div);
    }
  };
  optionsSave = function() {
    var _i, _len, _ref2, div, input, inputs;
    div = this.parentNode.parentNode;
    inputs = $$('input', div);
    _ref2 = inputs;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      input = _ref2[_i];
      GM_setValue(input.name, input.checked);
    }
    return remove(div);
  };
  close = function() {
    var div;
    div = this.parentNode.parentNode;
    return remove(div);
  };
  iframeLoad = function() {
    var _ref2, _ref3, error, qr, span;
    if (iframeLoop = !iframeLoop) {
      return null;
    }
    $('iframe').src = 'about:blank';
    qr = $('#qr');
    if (error = GM_getValue('error')) {
      span = n('span', {
        textContent: error,
        className: 'error'
      });
      addTo(qr, span);
      (typeof (_ref3 = ((_ref2 = $('input[title=autohide]:not(:checked)', qr)))) === "undefined" || _ref3 === null) ? undefined : _ref3.click();
    } else if (REPLY && getConfig('Persistent QR')) {
      $('textarea', qr).value = '';
      $('input[name=recaptcha_response_field]', qr).value = '';
    } else {
      remove(qr);
    }
    return recaptchaReload();
  };
  submit = function(e) {
    var _ref2, _ref3, recaptcha, span;
    if (span = this.nextSibling) {
      remove(span);
    }
    recaptcha = $('input[name=recaptcha_response_field]', this);
    if (recaptcha.value) {
      return (typeof (_ref3 = ((_ref2 = $('#qr input[title=autohide]:not(:checked)')))) === "undefined" || _ref3 === null) ? undefined : _ref3.click();
    } else {
      e.preventDefault();
      span = n('span', {
        className: 'error',
        textContent: 'You forgot to type in the verification.'
      });
      addTo(this.parentNode, span);
      alert('You forgot to type in the verification.');
      return recaptcha.focus();
    }
  };
  autohide = function() {
    var klass, qr;
    qr = $('#qr');
    klass = qr.className;
    if (klass.indexOf('auto') === -1) {
      klass += ' auto';
    } else {
      klass = klass.replace(' auto', '');
    }
    return (qr.className = klass);
  };
  quickReply = function(e) {
    var _i, _len, _ref2, _ref3, autohideB, clone, closeB, form, input, qr, script, selection, text, textarea, titlebar, xpath;
    if (!(qr = $('#qr'))) {
      qr = AEOS.makeDialog('qr', 'topleft');
      titlebar = n('div', {
        innerHTML: 'Quick Reply ',
        className: 'move',
        listener: ['mousedown', AEOS.move]
      });
      addTo(qr, titlebar);
      autohideB = n('input', {
        type: 'checkbox',
        className: 'pointer',
        title: 'autohide',
        listener: ['click', autohide]
      });
      closeB = n('a', {
        textContent: 'X',
        className: 'pointer',
        title: 'close',
        listener: ['click', close]
      });
      addTo(titlebar, autohideB, tn(' '), closeB);
      form = $('form[name=post]');
      clone = form.cloneNode(true);
      _ref2 = $$('script', clone);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        script = _ref2[_i];
        remove(script);
      }
      $('input[name=recaptcha_response_field]', clone).addEventListener('keydown', recaptchaListener, true);
      clone.addEventListener('submit', submit, true);
      clone.target = 'iframe';
      if (!REPLY) {
        xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]';
        input = n('input', {
          type: 'hidden',
          name: 'resto',
          value: x(xpath, this).name
        });
        addTo(clone, input);
      }
      addTo(qr, clone);
      addTo(d.body, qr);
    }
    if (e) {
      e.preventDefault();
      (typeof (_ref3 = ((_ref2 = $('input[title=autohide]:checked', qr)))) === "undefined" || _ref3 === null) ? undefined : _ref3.click();
      selection = window.getSelection();
      id = (typeof (_ref3 = ((_ref2 = x('preceding::span[@id][1]', selection.anchorNode)))) === "undefined" || _ref3 === null) ? undefined : _ref3.id;
      text = selection.toString();
      textarea = $('textarea', qr);
      textarea.focus();
      textarea.value += '>>' + this.parentNode.id.match(/\d+$/)[0] + '\n';
      return text && id === this.parentNode.id ? textarea.value += (">" + (text) + "\n") : null;
    }
  };
  watch = function() {
    var text;
    id = this.nextSibling.name;
    if (this.src[0] === 'd') {
      this.src = favNormal;
      text = ("/" + (BOARD) + "/ - ") + x('following-sibling::blockquote', this).textContent.slice(0, 25);
      watched[BOARD] || (watched[BOARD] = []);
      watched[BOARD].push({
        id: id,
        text: text
      });
    } else {
      this.src = favEmpty;
      watched[BOARD] = slice(watched[BOARD], id);
    }
    GM_setValue('watched', JSON.stringify(watched));
    return watcherUpdate();
  };
  watchX = function() {
    var _ref2, input;
    _ref2 = this.nextElementSibling.getAttribute('href').substring(1).split('/');
    board = _ref2[0];
    nop = _ref2[1];
    id = _ref2[2];
    watched[board] = slice(watched[board], id);
    GM_setValue('watched', JSON.stringify(watched));
    watcherUpdate();
    if (input = $("input[name=\"" + (id) + "\"]")) {
      favicon = input.previousSibling;
      return (favicon.src = favEmpty);
    }
  };
  watcherUpdate = function() {
    var _i, _j, _len, _ref2, _ref3, a, board, div, link, old, thread;
    div = n('div');
    _ref2 = watched;
    for (board in _ref2) {
      if (!__hasProp.call(_ref2, board)) continue;
      _i = _ref2[board];
      _ref3 = watched[board];
      for (_j = 0, _len = _ref3.length; _j < _len; _j++) {
        thread = _ref3[_j];
        a = n('a', {
          textContent: 'X',
          className: 'pointer',
          listener: ['click', watchX]
        });
        link = n('a', {
          textContent: thread.text,
          href: ("/" + (board) + "/res/" + (thread.id))
        });
        addTo(div, a, tn(' '), link, n('br'));
      }
    }
    old = $('#watcher div:last-child');
    return replace(old, div);
  };
  parseResponse = function(responseText) {
    var body, opbq, replies;
    body = n('body', {
      innerHTML: responseText
    });
    replies = $$('td.reply', body);
    opbq = $('blockquote', body);
    return [replies, opbq];
  };
  onloadThread = function(responseText, span) {
    var _i, _len, _ref2, _result, div, next, opbq, replies, reply;
    _ref2 = parseResponse(responseText);
    replies = _ref2[0];
    opbq = _ref2[1];
    span.textContent = span.textContent.replace('X Loading...', '- ');
    span.previousSibling.innerHTML = opbq.innerHTML;
    while ((next = span.nextSibling) && !next.clear) {
      remove(next);
    }
    if (next) {
      _result = []; _ref2 = replies;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        reply = _ref2[_i];
        _result.push(inBefore(next, x('ancestor::table', reply)));
      }
      return _result;
    } else {
      div = span.parentNode;
      _result = []; _ref2 = replies;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        reply = _ref2[_i];
        _result.push(addTo(div, x('ancestor::table', reply)));
      }
      return _result;
    }
  };
  expandThread = function() {
    var _i, _len, _ref2, num, prev, span, table, xhr;
    id = x('preceding-sibling::input[1]', this).name;
    span = this;
    if (span.textContent[0] === '-') {
      num = board === 'b' ? 3 : 5;
      table = x("following::br[@clear][1]/preceding::table[" + (num) + "]", span);
      while ((prev = table.previousSibling) && (prev.nodeName === 'TABLE')) {
        remove(prev);
      }
      span.textContent = span.textContent.replace('-', '+');
      return null;
    }
    span.textContent = span.textContent.replace('+', 'X Loading...');
    _ref2 = xhrs;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      xhr = _ref2[_i];
      if (xhr.id === id) {
        onloadThread(xhr.r.responseText, span);
        return null;
      }
    }
    r = new XMLHttpRequest();
    r.onload = function() {
      return onloadThread(this.responseText, span);
    };
    r.open('GET', "res/" + (id), true);
    r.send();
    return xhrs.push({
      r: r,
      id: id
    });
  };
  onloadComment = function(responseText, a, href) {
    var _i, _len, _ref2, bq, op, opbq, replies, reply;
    _ref2 = href.match(/(\d+)#(\d+)/);
    nop = _ref2[0];
    op = _ref2[1];
    id = _ref2[2];
    _ref2 = parseResponse(responseText);
    replies = _ref2[0];
    opbq = _ref2[1];
    if (id === op) {
      html = opbq.innerHTML;
    } else {
      _ref2 = replies;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        reply = _ref2[_i];
        if (reply.id === id) {
          html = $('blockquote', reply).innerHTML;
        }
      }
    }
    bq = x('ancestor::blockquote', a);
    return (bq.innerHTML = html);
  };
  expandComment = function(e) {
    var a, href;
    e.preventDefault();
    a = this;
    href = a.getAttribute('href');
    r = new XMLHttpRequest();
    r.onload = function() {
      return onloadComment(this.responseText, a, href);
    };
    r.open('GET', href, true);
    r.send();
    return xhrs.push({
      r: r,
      id: href.match(/\d+/)[0]
    });
  };
  report = function() {
    var input;
    input = x('preceding-sibling::input[1]', this);
    input.click();
    $('input[value="Report"]').click();
    return input.click();
  };
  nodeInserted = function(e) {
    var _i, _len, _ref2, _result, callback, qr, target;
    target = e.target;
    if (target.nodeName === 'TABLE') {
      _result = []; _ref2 = callbacks;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        callback = _ref2[_i];
        _result.push(callback(target));
      }
      return _result;
    } else if (target.id === 'recaptcha_challenge_field' && (qr = $('#qr'))) {
      $('#recaptcha_image img', qr).src = "http://www.google.com/recaptcha/api/image?c=" + target.value;
      return ($('#recaptcha_challenge_field', qr).value = target.value);
    }
  };
  autoWatch = function() {
    var autoText;
    autoText = $('textarea', this).value.slice(0, 25);
    return GM_setValue('autoText', "/" + (BOARD) + "/ - " + (autoText));
  };
  stopPropagation = function(e) {
    return e.stopPropagation();
  };
  replyNav = function() {
    var direction, op;
    if (REPLY) {
      return (window.location = this.textContent === '▲' ? '#navtop' : '#navbot');
    } else {
      direction = this.textContent === '▲' ? 'preceding' : 'following';
      op = x("" + (direction) + "::span[starts-with(@id, 'nothread')][1]", this).id;
      return (window.location = ("#" + (op)));
    }
  };
  recaptchaReload = function() {
    return (window.location = 'javascript:Recaptcha.reload()');
  };
  recaptchaListener = function(e) {
    return e.keyCode === 8 && this.value === '' ? recaptchaReload() : null;
  };
  redirect = function() {
    var url;
    switch (BOARD) {
      case 'a':
      case 'g':
      case 'lit':
      case 'sci':
      case 'tv':
        url = ("http://green-oval.net/cgi-board.pl/" + (BOARD) + "/thread/" + (THREAD_ID) + "#p");
        break;
      case 'cgl':
      case 'jp':
      case 'm':
      case 'tg':
        url = ("http://archive.easymodo.net/cgi-board.pl/" + (BOARD) + "/thread/" + (THREAD_ID) + "#p");
        break;
      default:
        url = ("http://boards.4chan.org/" + (BOARD));
    }
    return (location.href = url);
  };
  if (navtopr = $('#navtopr a')) {
    text = navtopr.nextSibling;
    a = n('a', {
      textContent: 'X',
      className: 'pointer',
      listener: ['click', options]
    });
    inBefore(text, tn(' / '));
    inBefore(text, a);
  } else if (getConfig('404 Redirect') && d.title === '4chan - 404') {
    redirect();
  } else {
    return null;
  }
  _ref = $$('#recaptcha_table a');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    el.tabIndex = 1;
  }
  recaptcha = $('#recaptcha_response_field');
  recaptcha.addEventListener('keydown', recaptchaListener, true);
  if (getConfig('Reply Hiding')) {
    callbacks.push(function(root) {
      var _j, _k, _len2, _len3, _ref2, _ref3, _result, _result2, next, obj, td, tds;
      tds = $$('td.doubledash', root);
      _result = []; _ref2 = tds;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        td = _ref2[_j];
        _result.push((function() {
          a = n('a', {
            textContent: '[ - ]',
            className: 'pointer',
            listener: ['click', hideReply]
          });
          replace(td.firstChild, a);
          next = td.nextSibling;
          id = next.id;
          _result2 = []; _ref3 = hiddenReplies;
          for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
            obj = _ref3[_k];
            _result2.push(obj.id === id ? hideReply(next) : null);
          }
          return _result2;
        })());
      }
      return _result;
    });
  }
  if (getConfig('Quick Reply')) {
    iframe = n('iframe', {
      name: 'iframe',
      listener: ['load', iframeLoad]
    });
    hide(iframe);
    addTo(d.body, iframe);
    callbacks.push(function(root) {
      var _j, _len2, _ref2, _result, quote, quotes;
      quotes = $$('a.quotejs:not(:first-child)', root);
      _result = []; _ref2 = quotes;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        quote = _ref2[_j];
        _result.push(quote.addEventListener('click', quickReply, true));
      }
      return _result;
    });
    recaptcha.id = '';
  }
  if (getConfig('Quick Report')) {
    callbacks.push(function(root) {
      var _j, _len2, _ref2, _result, arr, el;
      arr = $$('span[id^=no]', root);
      _result = []; _ref2 = arr;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        el = _ref2[_j];
        _result.push((function() {
          a = n('a', {
            textContent: '[ ! ]',
            className: 'pointer',
            listener: ['click', report]
          });
          inAfter(el, a);
          return inAfter(el, tn(' '));
        })());
      }
      return _result;
    });
  }
  if (getConfig('Thread Watcher')) {
    watcher = AEOS.makeDialog('watcher', 'topleft');
    watcher.innerHTML = '<div class="move">Thread Watcher</div><div></div>';
    $('div', watcher).addEventListener('mousedown', AEOS.move, true);
    addTo(d.body, watcher);
    watcherUpdate();
    threads = watched[BOARD] || [];
    inputs = $$('form > input[value="delete"], div > input[value="delete"]');
    _ref = inputs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      id = input.name;
      _ref2 = threads;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        thread = _ref2[_j];
        if (id === thread.id) {
          src = favNormal;
          break;
        }
      }
      src || (src = favEmpty);
      img = n('img', {
        src: src,
        className: 'pointer',
        listener: ['click', watch]
      });
      inBefore(input, img);
    }
  }
  if (getConfig('Anonymize')) {
    callbacks.push(function(root) {
      var _k, _len3, _ref3, _result, name, names, trip, trips;
      names = $$('span.postername, span.commentpostername', root);
      _ref3 = names;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        name = _ref3[_k];
        name.innerHTML = 'Anonymous';
      }
      trips = $$('span.postertrip', root);
      _result = []; _ref3 = trips;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        trip = _ref3[_k];
        _result.push(trip.parentNode.nodeName === 'A' ? remove(trip.parentNode) : remove(trip));
      }
      return _result;
    });
  }
  if (getConfig('Reply Navigation')) {
    callbacks.push(function(root) {
      var _k, _len3, _ref3, _result, arr, down, el, span, up;
      arr = $$('span[id^=norep]', root);
      _result = []; _ref3 = arr;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        el = _ref3[_k];
        _result.push((function() {
          span = n('span');
          up = n('a', {
            textContent: '▲',
            className: 'pointer',
            listener: ['click', replyNav]
          });
          down = n('a', {
            textContent: '▼',
            className: 'pointer',
            listener: ['click', replyNav]
          });
          addTo(span, tn(' '), up, tn(' '), down);
          return inAfter(el, span);
        })());
      }
      return _result;
    });
  }
  if (REPLY) {
    if (getConfig('Quick Reply') && getConfig('Persistent QR')) {
      quickReply();
      $('#qr input[title=autohide]').click();
    }
    if (getConfig('Post in Title')) {
      if (!(text = $('span.filetitle').textContent)) {
        text = $('blockquote').textContent;
      }
      if (text) {
        d.title = ("/" + (BOARD) + "/ - " + (text));
      }
    }
  } else {
    if (getConfig('Thread Hiding')) {
      delform = $('form[name=delform]');
      d.addEventListener('DOMNodeInserted', stopPropagation, true);
      threadF(delform.firstChild);
      d.removeEventListener('DOMNodeInserted', stopPropagation, true);
    }
    if (getConfig('Auto Watch')) {
      $('form[name="post"]').addEventListener('submit', autoWatch, true);
    }
    if (getConfig('Thread Navigation')) {
      arr = $$('div > span.filesize, form > span.filesize');
      i = 0;
      l = arr.length;
      l1 = l + 1;
      _ref = arr;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        if (i !== 0) {
          textContent = '▲';
          href = ("#" + (i));
        } else if (PAGENUM !== 0) {
          textContent = '◀';
          href = ("" + (PAGENUM - 1));
        } else {
          textContent = '▲';
          href = "#navtop";
        }
        up = n('a', {
          className: 'pointer',
          textContent: textContent,
          href: href
        });
        span = n('span', {
          className: 'navlinks',
          id: ++i
        });
        i1 = i + 1;
        down = n('a', {
          className: 'pointer'
        });
        if (i1 === l1) {
          down.textContent = '▶';
          down.href = ("" + (PAGENUM + 1) + "#1");
        } else {
          down.textContent = '▼';
          down.href = ("#" + (i1));
        }
        addTo(span, up, tn(' '), down);
        inBefore(el, span);
      }
      if (location.hash === '#1') {
        window.location = window.location;
      }
    }
    if (getConfig('Thread Expansion')) {
      omitted = $$('span.omittedposts');
      _ref = omitted;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        span = _ref[_i];
        a = n('a', {
          className: 'pointer omittedposts',
          textContent: ("+ " + (span.textContent)),
          listener: ['click', expandThread]
        });
        replace(span, a);
      }
    }
    if (getConfig('Comment Expansion')) {
      as = $$('span.abbr a');
      _ref = as;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        a.addEventListener('click', expandComment, true);
      }
    }
  }
  _ref = callbacks;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    callback = _ref[_i];
    callback();
  }
  d.body.addEventListener('DOMNodeInserted', nodeInserted, true);
}).call(this);
