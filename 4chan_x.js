(function() {
  var $, $$, BOARD, DAY, PAGENUM, REPLY, _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, a, arr, as, autoWatch, b, board, callback, callbacks, clearHidden, close, config, cutoff, delform, down, el, expandComment, expandThread, favEmpty, favNormal, favicon, getTime, getValue, head, hiddenReplies, hiddenThreads, hide, hideReply, hideThread, html, i, i1, id, iframe, iframeLoad, iframeLoop, img, inAfter, inBefore, input, inputs, l, l1, lastChecked, magic, minimize, mousedown, mousemove, mouseup, move, n, navtopr, nodeInserted, nop, now, omitted, onloadComment, onloadThread, options, optionsSave, parseResponse, position, quickReply, r, remove, replace, replyNav, report, show, showReply, showThread, slice, span, stopPropagation, submit, tag, text, thread, threadF, threads, up, watch, watchX, watched, watcher, watcherUpdate, x, xhrs;
  var __hasProp = Object.prototype.hasOwnProperty;
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
    'Quick Report': true,
    'Auto Watch': true,
    'Anonymize': false
  };
  getValue = function(name) {
    return GM_getValue(name, config[name]);
  };
  x = function(path, root) {
    root || (root = document.body);
    return document.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
  };
  $ = function(selector, root) {
    root || (root = document.body);
    return root.querySelector(selector);
  };
  $$ = function(selector, root) {
    var _a, _b, _c, _d, node, result;
    root || (root = document.body);
    result = root.querySelectorAll(selector);
    _a = []; _c = result;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      node = _c[_b];
      _a.push(node);
    }
    return _a;
  };
  inBefore = function(root, el) {
    return root.parentNode.insertBefore(el, root);
  };
  inAfter = function(root, el) {
    return root.parentNode.insertBefore(el, root.nextSibling);
  };
  tag = function(el) {
    return document.createElement(el);
  };
  hide = function(el) {
    return (el.style.display = 'none');
  };
  show = function(el) {
    return (el.style.display = '');
  };
  remove = function(el) {
    return el.parentNode.removeChild(el);
  };
  replace = function(root, el) {
    return root.parentNode.replaceChild(el, root);
  };
  getTime = function() {
    return Math.floor(new Date().getTime() / 1000);
  };
  n = function(tag, props) {
    var _a, el, key, val;
    el = document.createElement(tag);
    if (props) {
      _a = props;
      for (key in _a) {
        if (!__hasProp.call(_a, key)) continue;
        val = _a[key];
        (el[key] = val);
      }
    }
    return el;
  };
  slice = function(arr, id) {
    var _a, i, l;
    i = 0;
    l = arr.length;
    _a = [];
    while ((i < l)) {
      if (id === arr[i].id) {
        arr.splice(i, 1);
        return arr;
      }
      i++;
    }
    return _a;
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
      if (type === 'b') {
        return value === 'true';
      } else if (type === 'n') {
        return Number(value);
      } else {
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
      if (GM_getValue('Auto Watch')) {
        html = $('b').innerHTML;
        _a = html.match(/<!-- thread:(\d+),no:(\d+) -->/);
        nop = _a[0];
        thread = _a[1];
        id = _a[2];
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
  _b = location.pathname.split('/');
  nop = _b[0];
  BOARD = _b[1];
  magic = _b[2];
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
    var _c, _d, checked, div, hiddenNum, option;
    if (div = $('#options')) {
      return remove(div);
    } else {
      hiddenNum = hiddenReplies.length + hiddenThreads.length;
      div = tag('div');
      div.id = 'options';
      div.className = 'reply';
      position(div);
      html = '<div class="move">4chan X</div><div>';
      _d = config;
      for (option in _d) {
        if (!__hasProp.call(_d, option)) continue;
        _c = _d[option];
        checked = getValue(option) ? "checked" : "";
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
    var _c, a, name, p, span, text, trip;
    if (p = this.parentNode) {
      div = p;
      hiddenThreads.push({
        id: div.id,
        timestamp: getTime()
      });
      GM_setValue("hiddenThreads/" + (BOARD) + "/", JSON.stringify(hiddenThreads));
    }
    hide(div);
    if (getValue('Show Stubs')) {
      a = tag('a');
      if (span = $('.omittedposts', div)) {
        n = Number(span.textContent.match(/\d+/)[0]);
      } else {
        n = 0;
      }
      n += $$('table', div).length;
      text = n === 1 ? "1 reply" : ("" + (n) + " replies");
      name = $('span.postername', div).textContent;
      trip = ((typeof (_c = ($('span.postername + span.postertrip', div))) === "undefined" || _c === null) ? undefined : _c.textContent) || '';
      a.textContent = ("[ + ] " + (name) + (trip) + " (" + (text) + ")");
      a.className = 'pointer';
      a.addEventListener('click', showThread, true);
      return inBefore(div, a);
    }
  };
  threadF = function(current) {
    var _c, _d, _e, a, div, hidden;
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
    _d = hiddenThreads;
    for (_c = 0, _e = _d.length; _c < _e; _c++) {
      hidden = _d[_c];
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
    var _c, a, div, name, p, table, trip;
    if (p = this.parentNode) {
      reply = p.nextSibling;
      hiddenReplies.push({
        id: reply.id,
        timestamp: getTime()
      });
      GM_setValue("hiddenReplies/" + (BOARD) + "/", JSON.stringify(hiddenReplies));
    }
    name = $('span.commentpostername', reply).textContent;
    trip = ((typeof (_c = ($('span.postertrip', reply))) === "undefined" || _c === null) ? undefined : _c.textContent) || '';
    table = x('ancestor::table', reply);
    hide(table);
    if (getValue('Show Stubs')) {
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
    var _c, _d, _e, div, input, inputs;
    div = this.parentNode.parentNode;
    inputs = $$('input', div);
    _d = inputs;
    for (_c = 0, _e = _d.length; _c < _e; _c++) {
      input = _d[_c];
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
      span = tag('span');
      span.textContent = error;
      span.className = 'error';
      return qr.appendChild(span);
    } else {
      remove(qr);
      return (window.location = 'javascript:Recaptcha.reload()');
    }
  };
  submit = function(e) {
    var recaptcha, span;
    if (span = this.nextSibling) {
      remove(span);
    }
    recaptcha = $('#recaptcha_response_field', this);
    if (!recaptcha.value) {
      e.preventDefault();
      span = n('span', {
        className: 'error',
        textContent: 'You forgot to type in the verification.'
      });
      this.parentNode.appendChild(span);
      alert('You forgot to type in the verification.');
      return recaptcha.focus();
    } else {
      return (this.style.visibility = 'collapse');
    }
  };
  minimize = function() {
    var form;
    form = this.parentNode.nextSibling;
    return form.style.visibility ? (form.style.visibility = '') : (form.style.visibility = 'collapse');
  };
  quickReply = function(e) {
    var _c, _d, _e, _f, bf, clone, closeB, div, form, input, minimizeB, qr, script, selection, text, textarea, xpath;
    e.preventDefault();
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
      minimizeB = n('a', {
        textContent: '_',
        className: 'pointer',
        title: 'minimize'
      });
      minimizeB.addEventListener('click', minimize, true);
      div.appendChild(minimizeB);
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
      $('input[name=recaptcha_response_field]', form).id = '';
      if (bf = $('.bf', clone)) {
        remove(bf);
      }
      _d = $$('script', clone);
      for (_c = 0, _e = _d.length; _c < _e; _c++) {
        script = _d[_c];
        remove(script);
      }
      clone.addEventListener('submit', submit, true);
      clone.target = 'iframe';
      if (!REPLY) {
        xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]';
        input = n('input', {
          value: x(xpath, this).name,
          type: 'hidden',
          name: 'resto'
        });
        clone.appendChild(input);
      }
      qr.appendChild(clone);
      document.body.appendChild(qr);
    }
    selection = window.getSelection();
    id = (typeof (_f = (x('preceding::span[@id][1]', selection.anchorNode))) === "undefined" || _f === null) ? undefined : _f.id;
    text = selection.toString();
    textarea = $('textarea', qr);
    textarea.focus();
    textarea.value += '>>' + this.parentNode.id.match(/\d+$/)[0] + '\n';
    return text && id === this.parentNode.id ? textarea.value += (">" + (text) + "\n") : null;
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
    var _c, input;
    _c = this.nextElementSibling.getAttribute('href').substring(1).split('/');
    board = _c[0];
    nop = _c[1];
    id = _c[2];
    watched[board] = slice(watched[board], id);
    GM_setValue('watched', JSON.stringify(watched));
    watcherUpdate();
    if (input = $("input[name=\"" + (id) + "\"]")) {
      favicon = input.previousSibling;
      return (favicon.src = favEmpty);
    }
  };
  watcherUpdate = function() {
    var _c, _d, _e, _f, _g, a, div, link, old;
    div = tag('div');
    _d = watched;
    for (board in _d) {
      if (!__hasProp.call(_d, board)) continue;
      _c = _d[board];
      _f = watched[board];
      for (_e = 0, _g = _f.length; _e < _g; _e++) {
        thread = _f[_e];
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
    var _c, _d, _e, _f, _g, _h, _i, _j, _k, div, next, opbq, replies, reply;
    _c = parseResponse(responseText);
    replies = _c[0];
    opbq = _c[1];
    span.textContent = span.textContent.replace('X Loading...', '- ');
    span.previousSibling.innerHTML = opbq.innerHTML;
    while ((next = span.nextSibling) && !next.clear) {
      remove(next);
    }
    if (next) {
      _d = []; _f = replies;
      for (_e = 0, _g = _f.length; _e < _g; _e++) {
        reply = _f[_e];
        _d.push(inBefore(next, x('ancestor::table', reply)));
      }
      return _d;
    } else {
      div = span.parentNode;
      _h = []; _j = replies;
      for (_i = 0, _k = _j.length; _i < _k; _i++) {
        reply = _j[_i];
        _h.push(div.appendChild(x('ancestor::table', reply)));
      }
      return _h;
    }
  };
  expandThread = function() {
    var _c, _d, _e, num, prev, span, table, xhr;
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
    _d = xhrs;
    for (_c = 0, _e = _d.length; _c < _e; _c++) {
      xhr = _d[_c];
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
    var _c, _d, _e, _f, _g, bq, op, opbq, replies, reply;
    _c = href.match(/(\d+)#(\d+)/);
    nop = _c[0];
    op = _c[1];
    id = _c[2];
    _d = parseResponse(responseText);
    replies = _d[0];
    opbq = _d[1];
    if (id === op) {
      html = opbq.innerHTML;
    } else {
      _f = replies;
      for (_e = 0, _g = _f.length; _e < _g; _e++) {
        reply = _f[_e];
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
    var _c, _d, _e, _f, callback, qr, target;
    target = e.target;
    if (target.nodeName === 'TABLE') {
      _c = []; _e = callbacks;
      for (_d = 0, _f = _e.length; _d < _f; _d++) {
        callback = _e[_d];
        _c.push(callback(target));
      }
      return _c;
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
  if (getValue('Reply Hiding')) {
    callbacks.push(function(root) {
      var _c, _d, _e, _f, _g, _h, _i, _j, next, obj, td, tds;
      tds = $$('td.doubledash', root);
      _c = []; _e = tds;
      for (_d = 0, _f = _e.length; _d < _f; _d++) {
        td = _e[_d];
        _c.push((function() {
          a = tag('a');
          a.textContent = '[ - ]';
          a.className = 'pointer';
          a.addEventListener('click', hideReply, true);
          replace(td.firstChild, a);
          next = td.nextSibling;
          id = next.id;
          _g = []; _i = hiddenReplies;
          for (_h = 0, _j = _i.length; _h < _j; _h++) {
            obj = _i[_h];
            _g.push(obj.id === id ? hideReply(next) : null);
          }
          return _g;
        })());
      }
      return _c;
    });
  }
  if (getValue('Quick Reply')) {
    iframe = tag('iframe');
    hide(iframe);
    iframe.name = 'iframe';
    iframe.addEventListener('load', iframeLoad, true);
    document.body.appendChild(iframe);
    callbacks.push(function(root) {
      var _c, _d, _e, _f, quote, quotes;
      quotes = $$('a.quotejs:not(:first-child)', root);
      _c = []; _e = quotes;
      for (_d = 0, _f = _e.length; _d < _f; _d++) {
        quote = _e[_d];
        _c.push(quote.addEventListener('click', quickReply, true));
      }
      return _c;
    });
  }
  if (getValue('Quick Report')) {
    callbacks.push(function(root) {
      var _c, _d, _e, _f, arr, el;
      arr = $$('span[id^=no]', root);
      _c = []; _e = arr;
      for (_d = 0, _f = _e.length; _d < _f; _d++) {
        el = _e[_d];
        _c.push((function() {
          a = tag('a');
          a.textContent = '[ ! ]';
          a.className = 'pointer';
          a.addEventListener('click', report, true);
          inAfter(el, a);
          return inAfter(el, document.createTextNode(' '));
        })());
      }
      return _c;
    });
  }
  if (getValue('Thread Watcher')) {
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
    _d = inputs;
    for (_c = 0, _e = _d.length; _c < _e; _c++) {
      input = _d[_c];
      img = tag('img');
      id = input.name;
      _g = threads;
      for (_f = 0, _h = _g.length; _f < _h; _f++) {
        thread = _g[_f];
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
  if (getValue('Anonymize')) {
    callbacks.push(function(root) {
      var _i, _j, _k, _l, _m, _n, _o, name, names, trip, trips;
      names = $$('span.postername, span.commentpostername', root);
      _j = names;
      for (_i = 0, _k = _j.length; _i < _k; _i++) {
        name = _j[_i];
        name.innerHTML = 'Anonymous';
      }
      trips = $$('span.postertrip', root);
      _l = []; _n = trips;
      for (_m = 0, _o = _n.length; _m < _o; _m++) {
        trip = _n[_m];
        _l.push(trip.parentNode.nodeName === 'A' ? remove(trip.parentNode) : remove(trip));
      }
      return _l;
    });
  }
  if (getValue('Reply Navigation')) {
    callbacks.push(function(root) {
      var _i, _j, _k, _l, arr, down, el, span, up;
      arr = $$('span[id^=norep]', root);
      _i = []; _k = arr;
      for (_j = 0, _l = _k.length; _j < _l; _j++) {
        el = _k[_j];
        _i.push((function() {
          span = tag('span');
          up = tag('a');
          up.textContent = '▲';
          up.className = 'pointer';
          up.addEventListener('click', replyNav, true);
          down = tag('a');
          down.textContent = '▼';
          down.className = 'pointer';
          down.addEventListener('click', replyNav, true);
          span.appendChild(document.createTextNode(' '));
          span.appendChild(up);
          span.appendChild(document.createTextNode(' '));
          span.appendChild(down);
          return inAfter(el, span);
        })());
      }
      return _i;
    });
  }
  if (!REPLY) {
    if (getValue('Thread Hiding')) {
      delform = $('form[name=delform]');
      document.addEventListener('DOMNodeInserted', stopPropagation, true);
      threadF(delform.firstChild);
      document.removeEventListener('DOMNodeInserted', stopPropagation, true);
    }
    if (getValue('Auto Watch')) {
      $('form[name="post"]').addEventListener('submit', autoWatch, true);
    }
    if (getValue('Thread Navigation')) {
      arr = $$('div > span.filesize, form > span.filesize');
      i = 0;
      l = arr.length;
      l1 = l + 1;
      _j = arr;
      for (_i = 0, _k = _j.length; _i < _k; _i++) {
        el = _j[_i];
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
    if (getValue('Thread Expansion')) {
      omitted = $$('span.omittedposts');
      _m = omitted;
      for (_l = 0, _n = _m.length; _l < _n; _l++) {
        span = _m[_l];
        a = tag('a');
        a.className = 'pointer omittedposts';
        a.textContent = ("+ " + (span.textContent));
        a.addEventListener('click', expandThread, true);
        replace(span, a);
      }
    }
    if (getValue('Comment Expansion')) {
      as = $$('span.abbr a');
      _p = as;
      for (_o = 0, _q = _p.length; _o < _q; _o++) {
        a = _p[_o];
        a.addEventListener('click', expandComment, true);
      }
    }
  }
  _s = callbacks;
  for (_r = 0, _t = _s.length; _r < _t; _r++) {
    callback = _s[_r];
    callback();
  }
  document.body.addEventListener('DOMNodeInserted', nodeInserted, true);
})();
