(function() {
  var $, $$, BOARD, DAY, PAGENUM, REPLY, _i, _j, _len, _len2, _ref, _ref2, a, addTo, arr, as, autoWatch, autohide, b, board, callback, callbacks, clearHidden, close, config, cutoff, delform, down, el, expandComment, expandThread, favEmpty, favNormal, favicon, getConfig, getTime, head, hiddenReplies, hiddenThreads, hide, hideReply, hideThread, html, i, i1, id, iframe, iframeLoad, iframeLoop, img, inAfter, inBefore, input, inputs, l, l1, lastChecked, magic, mousedown, mousemove, mouseup, move, n, navtopr, nodeInserted, nop, now, omitted, onloadComment, onloadThread, options, optionsSave, parseResponse, position, quickReply, r, remove, replace, replyNav, report, show, showReply, showThread, slice, span, stopPropagation, submit, tag, text, thread, threadF, threads, tn, up, watch, watchX, watched, watcher, watcherUpdate, x, xhrs;
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
    'Anonymize': false
  };
  $ = function(selector, root) {
    root || (root = document.body);
    return root.querySelector(selector);
  };
  $$ = function(selector, root) {
    var _i, _len, _ref, _result, node, result;
    root || (root = document.body);
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
    var _ref, el, key, val;
    el = document.createElement(tag);
    if (props) {
      _ref = props;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        val = _ref[key];
        (el[key] = val);
      }
    }
    return el;
  };
  position = function(el) {
    var id, left, top;
    id = el.id;
    if (left = GM_getValue("" + (id) + "Left", '0px')) {
      el.style.left = left;
    } else {
      el.style.right = '0px';
    }
    return (top = GM_getValue("" + (id) + "Top", '0px')) ? (el.style.top = top) : (el.style.bottom = '0px');
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
  tag = function(el) {
    return document.createElement(el);
  };
  tn = function(s) {
    return document.createTextNode(s);
  };
  x = function(path, root) {
    root || (root = document.body);
    return document.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
  };
  if (typeof GM_deleteValue === 'undefined') {
    this.GM_setValue = function(name, value) {
      value = (typeof value)[0] + value;
      return localStorage.setItem(name, value);
    };
    this.GM_getValue = function(name, defaultValue) {
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
    this.GM_addStyle = function(css) {
      var style;
      style = tag('style');
      style.type = 'text/css';
      style.textContent = css;
      return $('head', document).appendChild(style);
    };
  }
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
          board = $('meta', document).content.match(/4chan.org\/(\w+)\//)[1];
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
  _ref = location.pathname.split('/');
  nop = _ref[0];
  BOARD = _ref[1];
  magic = _ref[2];
  if (magic === 'res') {
    REPLY = magic;
  } else {
    PAGENUM = parseInt(magic) || 0;
  }
  xhrs = [];
  r = null;
  iframeLoop = false;
  move = {};
  callbacks = [];
  head = $('head', document);
  if (!(favicon = $('link[rel="shortcut icon"]', head))) {
    favicon = tag('link');
    favicon.rel = 'shortcut icon';
    favicon.href = 'http://static.4chan.org/image/favicon.ico';
    head.appendChild(favicon);
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
        border: 1px solid;\
    }\
    #watcher div.move {\
        text-decoration: underline;\
        padding: 5px 5px 0 5px;\
    }\
    #watcher div:last-child {\
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
        border: 1px solid;\
    }\
    #qr > div {\
        text-align: right;\
    }\
    #qr > form > div {/* ad */\
        display: none;\
    }\
    #qr td.rules {\
        display: none;\
    }\
    #options {\
        position: fixed;\
        border: 1px solid;\
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
    .move {\
        cursor: move;\
    }\
    .pointer, #options label, #options a {\
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
      hiddenNum = hiddenReplies.length + hiddenThreads.length;
      div = tag('div');
      div.id = 'options';
      div.className = 'reply';
      position(div);
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
      $('div', div).addEventListener('mousedown', mousedown, true);
      $('input[type="button"]', div).addEventListener('click', clearHidden, true);
      $('a[name="save"]', div).addEventListener('click', optionsSave, true);
      $('a[name="cancel"]', div).addEventListener('click', close, true);
      return document.body.appendChild(div);
    }
  };
  mousedown = function(e) {
    var div, l, t;
    div = this.parentNode;
    move.div = div;
    move.clientX = e.clientX;
    move.clientY = e.clientY;
    move.bodyX = document.body.clientWidth;
    move.bodyY = document.body.clientHeight;
    l = div.style.left;
    move.divX = l ? parseInt(l) : move.bodyX - div.offsetWidth;
    t = div.style.top;
    move.divY = t ? parseInt(t) : move.bodyY - div.offsetHeight;
    window.addEventListener('mousemove', mousemove, true);
    return window.addEventListener('mouseup', mouseup, true);
  };
  mousemove = function(e) {
    var div, left, realX, realY, top;
    div = move.div;
    realX = move.divX + (e.clientX - move.clientX);
    left = realX < 20 ? 0 : realX;
    if (move.bodyX - div.offsetWidth - realX < 20) {
      div.style.left = '';
      div.style.right = '0px';
    } else {
      div.style.left = left + 'px';
      div.style.right = '';
    }
    realY = move.divY + (e.clientY - move.clientY);
    top = realY < 20 ? 0 : realY;
    if (move.bodyY - div.offsetHeight - realY < 20) {
      div.style.top = '';
      return (div.style.bottom = '0px');
    } else {
      div.style.top = top + 'px';
      return (div.style.bottom = '');
    }
  };
  mouseup = function() {
    id = move.div.id;
    GM_setValue("" + (id) + "Left", move.div.style.left);
    GM_setValue("" + (id) + "Top", move.div.style.top);
    window.removeEventListener('mousemove', mousemove, true);
    return window.removeEventListener('mouseup', mouseup, true);
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
    var _ref2, _ref3, a, name, p, span, text, trip;
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
      a = tag('a');
      if (span = $('.omittedposts', div)) {
        n = Number(span.textContent.match(/\d+/)[0]);
      } else {
        n = 0;
      }
      n += $$('table', div).length;
      text = n === 1 ? "1 reply" : ("" + (n) + " replies");
      name = $('span.postername', div).textContent;
      trip = ((typeof (_ref3 = ((_ref2 = $('span.postername + span.postertrip', div)))) === "undefined" || _ref3 === null) ? undefined : _ref3.textContent) || '';
      a.textContent = ("[ + ] " + (name) + (trip) + " (" + (text) + ")");
      a.className = 'pointer';
      a.addEventListener('click', showThread, true);
      return inBefore(div, a);
    }
  };
  threadF = function(current) {
    var _i, _len, _ref2, a, div, hidden;
    div = tag('div');
    div.className = 'thread';
    a = tag('a');
    a.textContent = '[ - ]';
    a.className = 'pointer';
    a.addEventListener('click', hideThread, true);
    div.appendChild(a);
    inBefore(current, div);
    while ((!current.clear)) {
      div.appendChild(current);
      current = div.nextSibling;
    }
    div.appendChild(current);
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
      a = tag('a');
      a.textContent = ("[ + ] " + (name) + " " + (trip));
      a.className = 'pointer';
      a.addEventListener('click', showReply, true);
      div = tag('div');
      div.appendChild(a);
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
    var error, qr, span;
    if (iframeLoop = !iframeLoop) {
      return null;
    }
    $('iframe').src = 'about:blank';
    qr = $('#qr');
    if (error = GM_getValue('error')) {
      $('form', qr).style.visibility = '';
      span = n('span', {
        textContent: error,
        className: 'error'
      });
      qr.appendChild(span);
    } else if (REPLY && getConfig('Persistent QR')) {
      $('textarea', qr).value = '';
      $('input[name=recaptcha_response_field]', qr).value = '';
    } else {
      remove(qr);
    }
    return (window.location = 'javascript:Recaptcha.reload()');
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
      this.parentNode.appendChild(span);
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
    var _i, _len, _ref2, _ref3, autohideB, clone, closeB, div, form, input, qr, script, selection, text, textarea, xpath;
    if (!(qr = $('#qr'))) {
      qr = tag('div');
      qr.id = 'qr';
      qr.className = 'reply';
      position(qr);
      div = tag('div');
      div.innerHTML = 'Quick Reply ';
      div.className = 'move';
      div.addEventListener('mousedown', mousedown, true);
      qr.appendChild(div);
      autohideB = n('input', {
        type: 'checkbox',
        className: 'pointer',
        title: 'autohide'
      });
      autohideB.addEventListener('click', autohide, true);
      div.appendChild(autohideB);
      div.appendChild(document.createTextNode(' '));
      closeB = n('a', {
        textContent: 'X',
        className: 'pointer',
        title: 'close'
      });
      closeB.addEventListener('click', close, true);
      div.appendChild(closeB);
      form = $('form[name=post]');
      clone = form.cloneNode(true);
      _ref2 = $$('script', clone);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        script = _ref2[_i];
        remove(script);
      }
      clone.addEventListener('submit', submit, true);
      clone.target = 'iframe';
      if (!REPLY) {
        xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]';
        input = n('input', {
          type: 'hidden',
          name: 'resto',
          value: x(xpath, this).name
        });
        clone.appendChild(input);
      }
      qr.appendChild(clone);
      document.body.appendChild(qr);
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
    div = tag('div');
    _ref2 = watched;
    for (board in _ref2) {
      if (!__hasProp.call(_ref2, board)) continue;
      _i = _ref2[board];
      _ref3 = watched[board];
      for (_j = 0, _len = _ref3.length; _j < _len; _j++) {
        thread = _ref3[_j];
        a = tag('a');
        a.textContent = 'X';
        a.className = 'pointer';
        a.addEventListener('click', watchX, true);
        div.appendChild(a);
        div.appendChild(document.createTextNode(' '));
        link = tag('a');
        link.textContent = thread.text;
        link.href = ("/" + (board) + "/res/" + (thread.id));
        div.appendChild(link);
        div.appendChild(tag('br'));
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
        _result.push(div.appendChild(x('ancestor::table', reply)));
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
  if (!(navtopr = $('#navtopr a'))) {
    return null;
  }
  text = navtopr.nextSibling;
  a = tag('a');
  a.textContent = 'X';
  a.className = 'pointer';
  a.addEventListener('click', options, true);
  inBefore(text, document.createTextNode(' / '));
  inBefore(text, a);
  _ref = $$('#recaptcha_table a');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    el.tabIndex = 1;
  }
  if (getConfig('Reply Hiding')) {
    callbacks.push(function(root) {
      var _j, _k, _len2, _len3, _ref2, _ref3, _result, _result2, next, obj, td, tds;
      tds = $$('td.doubledash', root);
      _result = []; _ref2 = tds;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        td = _ref2[_j];
        _result.push((function() {
          a = tag('a');
          a.textContent = '[ - ]';
          a.className = 'pointer';
          a.addEventListener('click', hideReply, true);
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
      name: 'iframe'
    });
    hide(iframe);
    iframe.addEventListener('load', iframeLoad, true);
    document.body.appendChild(iframe);
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
    $('#recaptcha_response_field').id = '';
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
            className: 'pointer'
          });
          a.addEventListener('click', report, true);
          inAfter(el, a);
          return inAfter(el, document.createTextNode(' '));
        })());
      }
      return _result;
    });
  }
  if (getConfig('Thread Watcher')) {
    watcher = tag('div');
    watcher.innerHTML = '<div class="move">Thread Watcher</div><div></div>';
    watcher.className = 'reply';
    watcher.id = 'watcher';
    position(watcher);
    $('div', watcher).addEventListener('mousedown', mousedown, true);
    document.body.appendChild(watcher);
    watcherUpdate();
    threads = watched[BOARD] || [];
    inputs = $$('form > input[value="delete"], div > input[value="delete"]');
    _ref = inputs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      img = tag('img');
      id = input.name;
      _ref2 = threads;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        thread = _ref2[_j];
        if (id === thread.id) {
          img.src = favNormal;
          break;
        }
      }
      img.src || (img.src = favEmpty);
      img.className = 'pointer';
      img.addEventListener('click', watch, true);
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
            className: 'pointer'
          });
          up.addEventListener('click', replyNav, true);
          down = n('a', {
            textContent: '▼',
            className: 'pointer'
          });
          down.addEventListener('click', replyNav, true);
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
  } else {
    if (getConfig('Thread Hiding')) {
      delform = $('form[name=delform]');
      document.addEventListener('DOMNodeInserted', stopPropagation, true);
      threadF(delform.firstChild);
      document.removeEventListener('DOMNodeInserted', stopPropagation, true);
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
        up = tag('a');
        up.className = 'pointer';
        if (i !== 0) {
          up.textContent = '▲';
          up.href = ("#" + (i));
        } else if (PAGENUM !== 0) {
          up.textContent = '◀';
          up.href = ("" + (PAGENUM - 1));
        } else {
          up.textContent = '▲';
          up.href = "#navtop";
        }
        span = tag('span');
        span.className = 'navlinks';
        span.id = ++i;
        i1 = i + 1;
        down = tag('a');
        down.className = 'pointer';
        span.appendChild(up);
        span.appendChild(document.createTextNode(' '));
        span.appendChild(down);
        if (i1 === l1) {
          down.textContent = '▶';
          down.href = ("" + (PAGENUM + 1) + "#1");
        } else {
          down.textContent = '▼';
          down.href = ("#" + (i1));
        }
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
        a = tag('a');
        a.className = 'pointer omittedposts';
        a.textContent = ("+ " + (span.textContent));
        a.addEventListener('click', expandThread, true);
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
  document.body.addEventListener('DOMNodeInserted', nodeInserted, true);
}).call(this);
