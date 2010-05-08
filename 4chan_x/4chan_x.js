(function(){
  var $, $$, BOARD, PAGENUM, REPLY, _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, a, arr, as, autoWatch, b, board, callback, callbacks, close, config, cutoff, day, delform, down, el, expandComment, expandThread, favEmpty, favNormal, favicon, getTime, getValue, head, hiddenReplies, hiddenThreads, hide, hideReply, hideThread, html, i, i1, id, iframe, iframeLoad, iframeLoop, img, inAfter, inBefore, input, inputs, l, l1, lastChecked, magic, minimize, mousedown, mousemove, mouseup, move, nodeInserted, nop, now, omitted, onloadComment, onloadThread, options, optionsSave, parseResponse, position, quickReply, r, remove, replace, replyNav, report, show, showReply, showThread, slice, span, stopPropagation, submit, tag, text, thread, threadF, threads, up, watch, watchX, watched, watcher, watcherUpdate, x, xhrs;
  var __hasProp = Object.prototype.hasOwnProperty;
  //todo: remove close()?, make hiddenReplies/hiddenThreads local, comments, gc
  //todo: remove stupid 'obj', arr el, make hidden an object, smarter xhr, text(), @this, images, clear hidden
  //todo: watch - add board in updateWatcher?, redundant move divs?, redo css / hiding, manual clear
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
  getValue = function getValue(name) {
    return GM_getValue(name, config[name]);
  };
  x = function x(path, root) {
    root = root || document.body;
    return document.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
  };
  $ = function $(selector, root) {
    root = root || document.body;
    return root.querySelector(selector);
  };
  $$ = function $$(selector, root) {
    var _a, _b, _c, _d, node, result;
    root = root || document.body;
    result = root.querySelectorAll(selector);
    //magic that turns the results object into an array:
    _a = []; _c = result;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      node = _c[_b];
      _a.push(node);
    }
    return _a;
  };
  inBefore = function inBefore(root, el) {
    return root.parentNode.insertBefore(el, root);
  };
  inAfter = function inAfter(root, el) {
    return root.parentNode.insertBefore(el, root.nextSibling);
  };
  tag = document.createElement;
  hide = function hide(el) {
    el.style.display = 'none';
    return el.style.display;
  };
  show = function show(el) {
    el.style.display = '';
    return el.style.display;
  };
  remove = function remove(el) {
    return el.parentNode.removeChild(el);
  };
  replace = function replace(root, el) {
    return root.parentNode.replaceChild(el, root);
  };
  getTime = function getTime() {
    return Math.floor(new Date().getTime() / 1000);
  };
  slice = function slice(arr, id) {
    var i, l;
    // the while loop is the only low-level loop left in coffeescript.
    // we need to use it to see the index.
    i = 0;
    l = arr.length;
    while ((i < l)) {
      if (id === arr[i].id) {
        arr.splice(i, 1);
        return arr;
      }
      i++;
    }
  };
  position = function position(el) {
    var id, left, top;
    id = el.id;
    (left = GM_getValue(("" + (id) + "Left"), '0px')) ? (el.style.left = left) : (el.style.right = '0px');
    if ((top = GM_getValue(("" + (id) + "Top"), '0px'))) {
      el.style.top = top;
      return el.style.top;
    } else {
      el.style.bottom = '0px';
      return el.style.bottom;
    }
  };
  if (typeof GM_deleteValue === 'undefined') {
    this.GM_setValue = function GM_setValue(name, value) {
      value = (typeof value)[0] + value;
      return localStorage.setItem(name, value);
    };
    this.GM_getValue = function GM_getValue(name, defaultValue) {
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
    this.GM_addStyle = function GM_addStyle(css) {
      var style;
      style = tag('style');
      style.type = 'text/css';
      style.textContent = css;
      return $('head', document).appendChild(style);
    };
  }
  watched = JSON.parse(GM_getValue('watched', '{}'));
  if (location.hostname.split('.')[0] === 'sys') {
    if ((b = $('table font b'))) {
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
          watched[board] = watched[board] || [];
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
  magic === 'res' ? (REPLY = magic) : (PAGENUM = parseInt(magic) || 0);
  xhrs = [];
  r = null;
  head = $('head', document);
  iframeLoop = false;
  move = {};
  callbacks = [];
  //godammit moot
  head = $('head', document);
  if (!(favicon = $('link[rel="shortcut icon"]', head))) {
    ///f/
    favicon = tag('link');
    favicon.rel = 'shortcut icon';
    favicon.href = 'http://static.4chan.org/image/favicon.ico';
    head.appendChild(favicon);
  }
  favNormal = favicon.href;
  favEmpty = 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==';
  hiddenThreads = JSON.parse(GM_getValue(("hiddenThreads/" + BOARD + "/"), '[]'));
  hiddenReplies = JSON.parse(GM_getValue(("hiddenReplies/" + BOARD + "/"), '[]'));
  lastChecked = GM_getValue('lastChecked', 0);
  now = getTime();
  day = 24 * 60 * 60;
  if (lastChecked < now - day) {
    cutoff = now - 7 * day;
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
    GM_setValue(("hiddenThreads/" + BOARD + "/"), JSON.stringify(hiddenThreads));
    GM_setValue(("hiddenReplies/" + BOARD + "/"), JSON.stringify(hiddenReplies));
    GM_setValue('lastChecked', now);
  }
  GM_addStyle(' \
#watcher { \
position: absolute; \
border: 1px solid; \
} \
#watcher div.move { \
text-decoration: underline; \
padding: 5px 5px 0 5px; \
} \
#watcher div:last-child { \
padding: 0 5px 5px 5px; \
} \
span.error { \
color: red; \
} \
#qr span.error { \
position: absolute; \
bottom: 0; \
left: 0; \
} \
#qr { \
position: fixed; \
border: 1px solid; \
} \
#qr > div { \
text-align: right; \
} \
#qr > form > div {/* ad */ \
display: none; \
} \
#qr tr:last-child { \
display: none; \
} \
#options { \
position: fixed; \
border: 1px solid; \
padding: 5px; \
text-align: right; \
} \
span.navlinks { \
position: absolute; \
right: 5px; \
} \
span.navlinks > a { \
font-size: 16px; \
text-decoration: none; \
} \
.move { \
cursor: move; \
} \
.pointer, #options label, #options a { \
cursor: pointer; \
} \
');
  options = function options() {
    var _c, checked, div, option;
    if ((div = $('#options'))) {
      return remove(div);
    } else {
      div = tag('div');
      div.id = 'options';
      div.className = 'reply';
      position(div);
      html = '<div class="move">4chan X</div><div>';
      _c = config;
      for (option in _c) { if (__hasProp.call(_c, option)) {
        checked = getValue(option) ? "checked" : "";
        html += ("<label>" + option + "<input " + checked + " name=\"" + option + "\" type=\"checkbox\"></label><br>");
      }}
      html += '<a name="save">save</a> <a name="cancel">cancel</a></div>';
      div.innerHTML = html;
      $('div', div).addEventListener('mousedown', mousedown, true);
      $('a[name="save"]', div).addEventListener('click', optionsSave, true);
      $('a[name="cancel"]', div).addEventListener('click', close, true);
      return document.body.appendChild(div);
    }
  };
  mousedown = function mousedown(e) {
    var div;
    div = this.parentNode;
    move.div = div;
    move.divX = parseInt(div.style.left);
    move.divY = parseInt(div.style.top);
    move.clientX = e.clientX;
    move.clientY = e.clientY;
    move.bodyX = document.body.clientWidth;
    move.bodyY = document.body.clientHeight;
    window.addEventListener('mousemove', mousemove, true);
    return window.addEventListener('mouseup', mouseup, true);
  };
  mousemove = function mousemove(e) {
    var div, left, realX, realY, top;
    div = move.div;
    realX = move.divX + (e.clientX - move.clientX);
    // x + dx
    left = realX < 20 ? 0 : realX;
    if (move.bodyX - div.offsetWidth - realX < 20) {
      div.style.left = '';
      div.style.right = '0px';
    } else {
      div.style.left = left + 'px';
      div.style.right = '';
    }
    realY = move.divY + (e.clientY - move.clientY);
    // y + dy
    top = realY < 20 ? 0 : realY;
    if (move.bodyY - div.offsetHeight - realY < 20) {
      div.style.top = '';
      div.style.bottom = '0px';
      return div.style.bottom;
    } else {
      div.style.top = top + 'px';
      div.style.bottom = '';
      return div.style.bottom;
    }
  };
  mouseup = function mouseup() {
    id = move.div.id;
    GM_setValue(("" + (id) + "Left"), move.div.style.left);
    GM_setValue(("" + (id) + "Top"), move.div.style.top);
    window.removeEventListener('mousemove', mousemove, true);
    return window.removeEventListener('mouseup', mouseup, true);
  };
  showThread = function showThread() {
    var div;
    div = this.nextSibling;
    show(div);
    hide(this);
    id = div.id;
    slice(hiddenThreads, id);
    return GM_setValue(("hiddenThreads/" + BOARD + "/"), JSON.stringify(hiddenThreads));
  };
  hideThread = function hideThread(div) {
    var _c, a, n, name, p, span, text, trip;
    if ((p = this.parentNode)) {
      div = p;
      hiddenThreads.push({
        id: div.id,
        timestamp: getTime()
      });
      GM_setValue(("hiddenThreads/" + BOARD + "/"), JSON.stringify(hiddenThreads));
    }
    hide(div);
    if (getValue('Show Stubs')) {
      a = tag('a');
      (span = $('.omittedposts', div)) ? (n = Number(span.textContent.match(/\d+/)[0])) : (n = 0);
      n += $$('table', div).length;
      text = n === 1 ? "1 reply" : ("" + n + " replies");
      name = $('span.postername', div).textContent;
      trip = ((_c = $('span.postername + span.postertrip', div)) == undefined ? undefined : _c.textContent) || '';
      a.textContent = ("[ + ] " + name + trip + " (" + text + ")");
      a.className = 'pointer';
      a.addEventListener('click', showThread, true);
      return inBefore(div, a);
    }
  };
  threadF = function threadF(current) {
    var _c, _d, _e, a, div, hidden;
    div = tag('div');
    a = tag('a');
    a.textContent = '[ - ]';
    a.className = 'pointer';
    a.addEventListener('click', hideThread, true);
    div.appendChild(a);
    inBefore(current, div);
    while ((!current.clear)) {
      //<br clear>
      div.appendChild(current);
      current = div.nextSibling;
    }
    div.appendChild(current);
    current = div.nextSibling;
    id = $('input', div).name;
    div.id = id;
    //check if we should hide the thread
    _d = hiddenThreads;
    for (_c = 0, _e = _d.length; _c < _e; _c++) {
      hidden = _d[_c];
      id === hidden.id ? hideThread(div) : null;
    }
    current = current.nextSibling.nextSibling;
    if (current.nodeName !== 'CENTER') {
      return threadF(current);
    }
  };
  showReply = function showReply() {
    var div, table;
    div = this.parentNode;
    table = div.nextSibling;
    show(table);
    remove(div);
    id = $('td.reply, td.replyhl', table).id;
    slice(hiddenReplies, id);
    return GM_setValue(("hiddenReplies/" + BOARD + "/"), JSON.stringify(hiddenReplies));
  };
  hideReply = function hideReply(reply) {
    var _c, a, div, name, p, table, trip;
    if ((p = this.parentNode)) {
      reply = p.nextSibling;
      hiddenReplies.push({
        id: reply.id,
        timestamp: getTime()
      });
      GM_setValue(("hiddenReplies/" + BOARD + "/"), JSON.stringify(hiddenReplies));
    }
    name = $('span.commentpostername', reply).textContent;
    trip = ((_c = $('span.postertrip', reply)) == undefined ? undefined : _c.textContent) || '';
    table = x('ancestor::table', reply);
    hide(table);
    if (getValue('Show Stubs')) {
      a = tag('a');
      a.textContent = ("[ + ] " + name + " " + trip);
      a.className = 'pointer';
      a.addEventListener('click', showReply, true);
      div = tag('div');
      div.appendChild(a);
      return inBefore(table, div);
    }
  };
  optionsSave = function optionsSave() {
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
  close = function close() {
    var div;
    div = this.parentNode.parentNode;
    return remove(div);
  };
  iframeLoad = function iframeLoad() {
    var error, qr, span;
    if ((iframeLoop = !iframeLoop)) {
      return null;
    }
    $('iframe').src = 'about:blank';
    qr = $('#qr');
    if ((error = GM_getValue('error'))) {
      $('form', qr).style.visibility = '';
      span = tag('span');
      span.textContent = error;
      span.className = 'error';
      return qr.appendChild(span);
    } else {
      return remove(qr);
    }
  };
  submit = function submit() {
    var span;
    this.style.visibility = 'collapse';
    if ((span = this.nextSibling)) {
      return remove(span);
    }
  };
  minimize = function minimize() {
    var form;
    form = this.parentNode.nextSibling;
    if (form.style.visibility) {
      form.style.visibility = '';
      return form.style.visibility;
    } else {
      form.style.visibility = 'collapse';
      return form.style.visibility;
    }
  };
  quickReply = function quickReply(e) {
    var _c, a, clone, div, input, qr, selText, selection, textarea, xpath;
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
      a = tag('a');
      a.textContent = '_';
      a.className = 'pointer';
      a.title = 'minimize';
      a.addEventListener('click', minimize, true);
      div.appendChild(a);
      div.appendChild(document.createTextNode(' '));
      a = tag('a');
      a.textContent = 'X';
      a.className = 'pointer';
      a.title = 'close';
      a.addEventListener('click', close, true);
      div.appendChild(a);
      clone = $('form[name="post"]').cloneNode(true);
      clone.addEventListener('submit', submit, true);
      clone.target = 'iframe';
      if (!REPLY) {
        input = tag('input');
        input.type = 'hidden';
        input.name = 'resto';
        xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]';
        input.value = x(xpath, this).name;
        clone.appendChild(input);
      }
      qr.appendChild(clone);
      document.body.appendChild(qr);
    }
    textarea = $('textarea', qr);
    //goddamit moot
    //xx
    textarea.value += '>>' + this.parentNode.id.match(/\d+$/)[0] + '\n';
    selection = window.getSelection();
    id = (_c = x('preceding::span[@id][1]', selection.anchorNode)) == undefined ? undefined : _c.id;
    id === this.parentNode.id ? (selText = selection.toString()) ? textarea.value += (">" + selText + "\n") : null : null;
    return textarea.focus();
  };
  watch = function watch() {
    var text;
    id = this.nextSibling.name;
    if (this.src[0] === 'd') {
      //data:png
      this.src = favNormal;
      text = ("/" + BOARD + "/ - ") + x('following-sibling::blockquote', this).textContent.slice(0, 25);
      watched[BOARD] = watched[BOARD] || [];
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
  watchX = function watchX() {
    var _c, img, input;
    _c = this.nextElementSibling.getAttribute('href').split('/');
    nop = _c[0];
    board = _c[1];
    nop = _c[2];
    id = _c[3];
    watched[board] = slice(watched[board], id);
    GM_setValue('watched', JSON.stringify(watched));
    watcherUpdate();
    if ((input = $(("input[name=\"" + id + "\"]")))) {
      img = input.previousSibling;
      img.src = favEmpty;
      return img.src;
    }
  };
  watcherUpdate = function watcherUpdate() {
    var _c, _d, _e, _f, a, div, old;
    div = tag('div');
    _c = watched;
    for (board in _c) { if (__hasProp.call(_c, board)) {
      _e = watched[board];
      for (_d = 0, _f = _e.length; _d < _f; _d++) {
        thread = _e[_d];
        a = tag('a');
        a.textContent = 'X';
        a.className = 'pointer';
        a.addEventListener('click', watchX, true);
        div.appendChild(a);
        div.appendChild(document.createTextNode(' '));
        a = tag('a');
        a.textContent = thread.text;
        a.href = ("/" + board + "/res/" + (thread.id));
        div.appendChild(a);
        div.appendChild(tag('br'));
      }
    }}
    old = $('#watcher div:last-child');
    return replace(old, div);
  };
  parseResponse = function parseResponse(responseText) {
    var body, opbq, replies;
    body = tag('body');
    body.innerHTML = responseText;
    replies = $$('td.reply', body);
    opbq = $('blockquote', body);
    return [replies, opbq];
  };
  onloadThread = function onloadThread(responseText, span) {
    var _c, _d, _e, _f, _g, _h, _i, _j, _k, div, next, opbq, replies, reply;
    _c = parseResponse(responseText);
    replies = _c[0];
    opbq = _c[1];
    span.textContent = span.textContent.replace('X Loading...', '- ');
    //make sure all comments are fully expanded
    span.previousSibling.innerHTML = opbq.innerHTML;
    while ((next = span.nextSibling) && !next.clear) {
      //<br clear>
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
      //threading
      div = span.parentNode;
      _h = []; _j = replies;
      for (_i = 0, _k = _j.length; _i < _k; _i++) {
        reply = _j[_i];
        _h.push(div.appendChild(x('ancestor::table', reply)));
      }
      return _h;
    }
  };
  expandThread = function expandThread() {
    var _c, _d, _e, num, prev, span, table, xhr;
    id = x('preceding-sibling::input[1]', this).name;
    span = this;
    //close expanded thread
    if (span.textContent[0] === '-') {
      //goddamit moot
      num = board === 'b' ? 3 : 5;
      table = x(("following::br[@clear][1]/preceding::table[" + num + "]"), span);
      while ((prev = table.previousSibling) && (prev.nodeName === 'TABLE')) {
        remove(prev);
      }
      span.textContent = span.textContent.replace('-', '+');
      return null;
    }
    span.textContent = span.textContent.replace('+', 'X Loading...');
    //load cache
    _d = xhrs;
    for (_c = 0, _e = _d.length; _c < _e; _c++) {
      xhr = _d[_c];
      if (xhr.id === id) {
        //why can't we just xhr.r.onload()?
        onloadThread(xhr.r.responseText, span);
        return null;
      }
    }
    //create new request
    r = new XMLHttpRequest();
    r.onload = function onload() {
      return onloadThread(this.responseText, span);
    };
    r.open('GET', ("res/" + id), true);
    r.send();
    return xhrs.push({
      r: r,
      id: id
    });
  };
  onloadComment = function onloadComment(responseText, a, href) {
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
      //css selectors don't like ids starting with numbers,
      // getElementById only works for root document.
      _f = replies;
      for (_e = 0, _g = _f.length; _e < _g; _e++) {
        reply = _f[_e];
        reply.id === id ? (html = $('blockquote', reply).innerHTML) : null;
      }
    }
    bq = x('ancestor::blockquote', a);
    bq.innerHTML = html;
    return bq.innerHTML;
  };
  expandComment = function expandComment(e) {
    var a, href;
    e.preventDefault();
    a = this;
    href = a.getAttribute('href');
    r = new XMLHttpRequest();
    r.onload = function onload() {
      return onloadComment(this.responseText, a, href);
    };
    r.open('GET', href, true);
    r.send();
    return xhrs.push({
      r: r,
      id: href.match(/\d+/)[0]
    });
  };
  report = function report() {
    var input;
    input = x('preceding-sibling::input', this);
    input.click();
    $('input[value="Report"]').click();
    return input.click();
  };
  nodeInserted = function nodeInserted(e) {
    var _c, _d, _e, _f, callback, target;
    target = e.target;
    if (target.nodeName === 'TABLE') {
      _c = []; _e = callbacks;
      for (_d = 0, _f = _e.length; _d < _f; _d++) {
        callback = _e[_d];
        _c.push(callback(target));
      }
      return _c;
    }
  };
  autoWatch = function autoWatch() {
    var autoText;
    autoText = $('textarea', this).value.slice(0, 25);
    return GM_setValue('autoText', ("/" + BOARD + "/ - " + autoText));
  };
  stopPropagation = function stopPropagation(e) {
    return e.stopPropagation();
  };
  replyNav = function replyNav() {
    var direction, op;
    if (REPLY) {
      window.location = this.textContent === '▲' ? '#navtop' : '#navbot';
      return window.location;
    } else {
      direction = this.textContent === '▲' ? 'preceding' : 'following';
      op = x(("" + direction + "::span[starts-with(@id, 'nothread')][1]"), this).id;
      window.location = ("#" + op);
      return window.location;
    }
  };
  getValue('Reply Hiding') ? callbacks.push(function(root) {
    var _c, _d, _e, _f, _g, _h, _i, _j, a, next, obj, td, tds;
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
  }) : null;
  if (getValue('Quick Reply')) {
    iframe = tag('iframe');
    hide(iframe);
    iframe.name = 'iframe';
    iframe.addEventListener('load', iframeLoad, true);
    document.body.appendChild(iframe);
    callbacks.push(function(root) {
      var _c, _d, _e, _f, quote, quotes;
      quotes = $$('a.quotejs:not(:first-child)');
      _c = []; _e = quotes;
      for (_d = 0, _f = _e.length; _d < _f; _d++) {
        quote = _e[_d];
        _c.push(quote.addEventListener('click', quickReply, true));
      }
      return _c;
    });
  }
  getValue('Quick Report') ? callbacks.push(function(root) {
    var _c, _d, _e, _f, a, arr, el;
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
  }) : null;
  if (getValue('Thread Watcher')) {
    //create watcher
    watcher = tag('div');
    watcher.innerHTML = '<div class="move">Thread Watcher</div><div></div>';
    watcher.className = 'reply';
    watcher.id = 'watcher';
    position(watcher);
    $('div', watcher).addEventListener('mousedown', mousedown, true);
    document.body.appendChild(watcher);
    watcherUpdate();
    //add buttons
    threads = watched[BOARD] || [];
    //normal, threading
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
      img.src = img.src || favEmpty;
      img.className = 'pointer';
      img.addEventListener('click', watch, true);
      inBefore(input, img);
    }
  }
  getValue('Anonymize') ? callbacks.push(function(root) {
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
  }) : null;
  getValue('Reply Navigation') ? callbacks.push(function(root) {
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
  }) : null;
  if (!REPLY) {
    if (getValue('Thread Hiding')) {
      delform = $('form[name=delform]');
      document.addEventListener('DOMNodeInserted', stopPropagation, true);
      threadF(delform.firstChild);
      document.removeEventListener('DOMNodeInserted', stopPropagation, true);
    }
    getValue('Auto Watch') ? $('form[name="post"]').addEventListener('submit', autoWatch, true) : null;
    if (getValue('Thread Navigation')) {
      arr = $$('div > span.filesize, form > span.filesize');
      i = 0;
      l = arr.length;
      l1 = l + 1;
      //should this be a while loop?
      _j = arr;
      for (_i = 0, _k = _j.length; _i < _k; _i++) {
        el = _j[_i];
        up = tag('a');
        up.className = 'pointer';
        if (i !== 0) {
          up.textContent = '▲';
          up.href = ("#" + i);
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
          down.href = ("#" + i1);
        }
        inBefore(el, span);
      }
      location.hash === '#1' ? (window.location = window.location) : null;
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
  a = tag('a');
  a.textContent = 'X';
  a.className = 'pointer';
  a.addEventListener('click', options, true);
  text = $('#navtopr a').nextSibling;
  inBefore(text, document.createTextNode(' / '));
  inBefore(text, a);
  _s = callbacks;
  for (_r = 0, _t = _s.length; _r < _t; _r++) {
    callback = _s[_r];
    callback();
  }
  document.body.addEventListener('DOMNodeInserted', nodeInserted, true);
})();
