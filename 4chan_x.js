(function() {
  var $, $$, AEOS, DAY, _, _i, _len, _ref, _ref2, a, addTo, arr, as, autoWatch, autohide, b, board, callback, clearHidden, closeQR, config, cooldown, cutoff, d, delform, down, editSauce, el, expandComment, expandThread, form, formSubmit, g, getConfig, getTime, hide, hideReply, hideThread, href, html, id, iframe, iframeLoad, inAfter, inBefore, input, inputs, keyAct, keyActAdd, keyActRem, l1, lastChecked, m, n, navbotr, navtopr, nodeInserted, now, omitted, onloadComment, onloadThread, options, optionsClose, parseResponse, pathname, quickReply, recaptcha, recaptchaListener, recaptchaReload, redirect, remove, replace, replyNav, report, show, showReply, showThread, slice, span, stopPropagation, temp, text, textContent, thread, threadF, threads, tn, up, watch, watchX, watcher, watcherUpdate, x;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty;
  config = {
    'Thread Hiding': [true, 'Hide entire threads'],
    'Reply Hiding': [true, 'Hide single replies'],
    'Show Stubs': [true, 'Of hidden threads / replies'],
    'Thread Navigation': [true, 'Navigate to previous / next thread'],
    'Keyboard Actions': [true, 'Perform actions with your keyboard'],
    'Reply Navigation': [true, 'Navigate to the beginning / end of a thread'],
    'Thread Watcher': [true, 'Bookmark threads'],
    'Thread Expansion': [true, 'View all replies'],
    'Comment Expansion': [true, 'Expand too long comments'],
    'Quick Report': [true, 'Add quick report buttons'],
    'Quick Reply': [true, 'Reply without leaving the page'],
    'Persistent QR': [false, 'Quick reply won\'t disappear after posting. Only in replies.'],
    'Anonymize': [false, 'Make everybody anonymous'],
    'Auto Watch': [true, 'Automatically watch threads that you start (Firefox only)'],
    '404 Redirect': [true, 'Redirect dead threads'],
    'Post in Title': [true, 'Show the op\'s post in the tab title'],
    'Sauce': [true, 'Add sauce to images']
  };
  AEOS = {
    init: function() {
      if (!(typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null)) {
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
        window.GM_openInTab = function(url) {
          return window.open(url, "_blank");
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
  d = document;
  g = null;
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
    return GM_getValue(name, config[name][0]);
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
  m = function(el, props) {
    var _ref, event, funk, key, l, val;
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
    return el;
  };
  n = function(tag, props) {
    var el;
    el = d.createElement(tag);
    if (props) {
      m(el, props);
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
  autoWatch = function() {
    var autoText;
    autoText = $('textarea', this).value.slice(0, 25);
    return GM_setValue('autoText', "/" + (g.BOARD) + "/ - " + (autoText));
  };
  closeQR = function() {
    var div;
    div = this.parentNode.parentNode;
    return remove(div);
  };
  clearHidden = function() {
    GM_deleteValue("hiddenReplies/" + (g.BOARD) + "/");
    GM_deleteValue("hiddenThreads/" + (g.BOARD) + "/");
    this.value = "hidden: 0";
    g.hiddenReplies = [];
    return (g.hiddenThreads = []);
  };
  cooldown = function() {
    var auto, seconds, submit;
    submit = $('#qr input[type=submit]');
    seconds = parseInt(submit.value);
    if (seconds === 0) {
      submit.disabled = false;
      submit.value = 'Submit';
      auto = submit.previousSibling.lastChild;
      return auto.checked ? $('#qr form').submit() : null;
    } else {
      submit.value = seconds - 1;
      return window.setTimeout(cooldown, 1000);
    }
  };
  editSauce = function() {
    var ta;
    ta = $('#options textarea');
    return ta.style.display ? show(ta) : hide(ta);
  };
  expandComment = function(e) {
    var a, href, r;
    e.preventDefault();
    a = this;
    href = a.getAttribute('href');
    r = new XMLHttpRequest();
    r.onload = function() {
      return onloadComment(this.responseText, a, href);
    };
    r.open('GET', href, true);
    r.send();
    return g.xhrs.push({
      r: r,
      id: href.match(/\d+/)[0]
    });
  };
  expandThread = function() {
    var _i, _len, _ref, id, num, prev, r, span, table, xhr;
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
    _ref = g.xhrs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      xhr = _ref[_i];
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
    return g.xhrs.push({
      r: r,
      id: id
    });
  };
  formSubmit = function(e) {
    var _ref, _ref2, recaptcha, span;
    if (span = this.nextSibling) {
      remove(span);
    }
    recaptcha = $('input[name=recaptcha_response_field]', this);
    if (recaptcha.value) {
      return (typeof (_ref2 = ((_ref = $('#qr input[title=autohide]:not(:checked)')))) === "undefined" || _ref2 === null) ? undefined : _ref2.click();
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
  hideReply = function(reply) {
    var _ref, _ref2, a, div, name, p, table, trip;
    if (p = this.parentNode) {
      reply = p.nextSibling;
      g.hiddenReplies.push({
        id: reply.id,
        timestamp: getTime()
      });
      GM_setValue("hiddenReplies/" + (g.BOARD) + "/", JSON.stringify(g.hiddenReplies));
    }
    name = $('span.commentpostername', reply).textContent;
    trip = ((typeof (_ref2 = ((_ref = $('span.postertrip', reply)))) === "undefined" || _ref2 === null) ? undefined : _ref2.textContent) || '';
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
  hideThread = function(div) {
    var _ref, _ref2, a, name, num, p, span, text, trip;
    if (p = this.parentNode) {
      div = p;
      g.hiddenThreads.push({
        id: div.id,
        timestamp: getTime()
      });
      GM_setValue("hiddenThreads/" + (g.BOARD) + "/", JSON.stringify(g.hiddenThreads));
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
      trip = ((typeof (_ref2 = ((_ref = $('span.postername + span.postertrip', div)))) === "undefined" || _ref2 === null) ? undefined : _ref2.textContent) || '';
      a = n('a', {
        textContent: ("[ + ] " + (name) + (trip) + " (" + (text) + ")"),
        className: 'pointer',
        listener: ['click', showThread]
      });
      return inBefore(div, a);
    }
  };
  iframeLoad = function() {
    var _ref, _ref2, auto, error, qr, span, submit;
    if (g.iframe = !g.iframe) {
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
      (typeof (_ref2 = ((_ref = $('input[title=autohide]:checked', qr)))) === "undefined" || _ref2 === null) ? undefined : _ref2.click();
    } else if (g.REPLY && getConfig('Persistent QR')) {
      $('textarea', qr).value = '';
      $('input[name=recaptcha_response_field]', qr).value = '';
      submit = $('input[type=submit]', qr);
      submit.value = 30;
      submit.disabled = true;
      window.setTimeout(cooldown, 1000);
      auto = submit.previousSibling.lastChild;
      if (auto.checked) {
        (typeof (_ref2 = ((_ref = $('input[title=autohide]:checked', qr)))) === "undefined" || _ref2 === null) ? undefined : _ref2.click();
      }
    } else {
      remove(qr);
    }
    return recaptchaReload();
  };
  keyAct = function(e) {
    var _i, _len, char, count, hash, href, img, kc, position, qrLink, ta, temp;
    kc = e.keyCode;
    if (!((48 <= kc) && (kc <= 90))) {
      return null;
    }
    if (e.ctrlKey || e.altKey) {
      return null;
    }
    e.preventDefault();
    char = String.fromCharCode(kc);
    hash = location.hash;
    if (!hash || hash === '#navtop') {
      position = -1;
    } else {
      temp = Number(hash.substring(2));
      position = temp === NaN ? -1 : temp;
    }
    count = g.count;
    if ((function(){ for (var _i=0, _len='1234567890'.length; _i<_len; _i++) { if ('1234567890'[_i] === char) return true; } return false; }).call(this)) {
      temp = Number(char);
      if (temp === 0 && count === 0) {
        location.pathname = ("/" + (g.BOARD) + "/#1");
      } else {
        g.count = (count * 10) + temp;
      }
      return null;
    }
    if (char === "G") {
      if (count) {
        temp = count > 15 ? 15 : count;
        location.pathname = ("/" + (g.BOARD) + "/" + (temp) + "#1");
      } else {
        if (e.shiftKey) {
          location.hash = 10;
        } else {
          window.scrollTo(0, 0);
          location.hash = '';
        }
      }
    }
    count || (count = 1);
    switch (char) {
      case "H":
        temp = g.PAGENUM - count;
        if (temp < 0) {
          temp = 0;
        }
        location.pathname = ("/" + (g.BOARD) + "/" + (temp) + "#1");
        break;
      case "I":
        qrLink = $("" + (hash) + " ~ span[id] a:not(:first-child)");
        quickReply.call(qrLink);
        ta = $('#qr textarea');
        ta.focus();
        break;
      case "J":
        temp = position + count;
        if (temp > 9) {
          temp = 9;
        }
        location.hash = 'p' + temp;
        break;
      case "K":
        temp = position - count;
        if (temp < 0) {
          temp = 'navtop';
        } else {
          temp = 'p' + temp;
        }
        location.hash = temp;
        break;
      case "L":
        temp = g.PAGENUM + count;
        if (temp > 15) {
          temp = 15;
        }
        location.pathname = ("/" + (g.BOARD) + "/" + (temp) + "#1");
        break;
      case "M":
        img = $("" + (hash) + " ~ img");
        watch.call(img);
        break;
      case "O":
        href = $("" + (hash) + " ~ span[id] a:last-of-type").href;
        GM_openInTab(href);
        break;
    }
    return (g.count = 0);
  };
  keyActAdd = function() {
    return d.addEventListener('keydown', keyAct, true);
  };
  keyActRem = function() {
    return d.removeEventListener('keydown', keyAct, true);
  };
  nodeInserted = function(e) {
    var _i, _len, _ref, _result, callback, qr, target;
    target = e.target;
    if (target.nodeName === 'TABLE') {
      _result = []; _ref = g.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _result.push(callback(target));
      }
      return _result;
    } else if (target.id === 'recaptcha_challenge_field' && (qr = $('#qr'))) {
      $('#recaptcha_image img', qr).src = "http://www.google.com/recaptcha/api/image?c=" + target.value;
      return ($('#recaptcha_challenge_field', qr).value = target.value);
    }
  };
  onloadComment = function(responseText, a, href) {
    var _, _i, _len, _ref, bq, html, id, op, opbq, replies, reply;
    _ref = href.match(/(\d+)#(\d+)/);
    _ = _ref[0];
    op = _ref[1];
    id = _ref[2];
    _ref = parseResponse(responseText);
    replies = _ref[0];
    opbq = _ref[1];
    if (id === op) {
      html = opbq.innerHTML;
    } else {
      _ref = replies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reply = _ref[_i];
        if (reply.id === id) {
          html = $('blockquote', reply).innerHTML;
        }
      }
    }
    bq = x('ancestor::blockquote', a);
    return (bq.innerHTML = html);
  };
  onloadThread = function(responseText, span) {
    var _i, _len, _ref, _result, div, next, opbq, replies, reply;
    _ref = parseResponse(responseText);
    replies = _ref[0];
    opbq = _ref[1];
    span.textContent = span.textContent.replace('X Loading...', '- ');
    span.previousSibling.innerHTML = opbq.innerHTML;
    while ((next = span.nextSibling) && !next.clear) {
      remove(next);
    }
    if (next) {
      _result = []; _ref = replies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reply = _ref[_i];
        _result.push(inBefore(next, x('ancestor::table', reply)));
      }
      return _result;
    } else {
      div = span.parentNode;
      _result = []; _ref = replies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reply = _ref[_i];
        _result.push(addTo(div, x('ancestor::table', reply)));
      }
      return _result;
    }
  };
  options = function() {
    var _ref, checked, description, div, hiddenNum, html, option, value;
    if (div = $('#options')) {
      return remove(div);
    } else {
      div = AEOS.makeDialog('options', 'center');
      hiddenNum = g.hiddenReplies.length + g.hiddenThreads.length;
      html = '<div class="move">Options <a class=pointer>X</a></div><div>';
      _ref = config;
      for (option in _ref) {
        if (!__hasProp.call(_ref, option)) continue;
        value = _ref[option];
        description = value[1];
        checked = getConfig(option) ? "checked" : "";
        html += ("<label title=\"" + (description) + "\">" + (option) + "<input " + (checked) + " name=\"" + (option) + "\" type=\"checkbox\"></label><br>");
      }
      html += "<div><a class=sauce>Flavors</a></div>";
      html += "<div><textarea cols=50 rows=4 style=\"display: none;\"></textarea></div>";
      html += ("<input type=\"button\" value=\"hidden: " + (hiddenNum) + "\"><br>");
      div.innerHTML = html;
      $('div.move', div).addEventListener('mousedown', AEOS.move, true);
      $('a.pointer', div).addEventListener('click', optionsClose, true);
      $('a.sauce', div).addEventListener('click', editSauce, true);
      $('textarea', div).value = GM_getValue('flavors', g.flavors);
      $('input[type="button"]', div).addEventListener('click', clearHidden, true);
      return addTo(d.body, div);
    }
  };
  optionsClose = function() {
    var _i, _len, _ref, div, input, inputs;
    div = this.parentNode.parentNode;
    inputs = $$('input', div);
    _ref = inputs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      GM_setValue(input.name, input.checked);
    }
    GM_setValue('flavors', $('textarea', div).value);
    return remove(div);
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
  quickReply = function(e) {
    var _i, _len, _ref, _ref2, auto, autoBox, autohideB, clone, closeB, form, id, input, inputs, qr, script, selection, submit, text, textarea, titlebar, xpath;
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
        listener: ['click', closeQR]
      });
      addTo(titlebar, autohideB, tn(' '), closeB);
      form = $('form[name=post]');
      clone = form.cloneNode(true);
      _ref = $$('script', clone);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        script = _ref[_i];
        remove(script);
      }
      m($('input[name=recaptcha_response_field]', clone), {
        listener: ['keydown', recaptchaListener]
      });
      m(clone, {
        listener: ['submit', formSubmit],
        target: 'iframe'
      });
      if (!g.REPLY) {
        xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]';
        input = n('input', {
          type: 'hidden',
          name: 'resto',
          value: x(xpath, this).name
        });
        addTo(clone, input);
        if (getConfig('Keyboard Actions')) {
          inputs = $$('input[type=text], textarea', clone);
          _ref = inputs;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            input = _ref[_i];
            input.addEventListener('focus', keyActRem, true);
            input.addEventListener('blur', keyActAdd, true);
          }
        }
      } else if (getConfig('Persistent QR')) {
        submit = $('input[type=submit]', clone);
        auto = n('label', {
          textContent: 'Auto'
        });
        autoBox = n('input', {
          type: 'checkbox'
        });
        addTo(auto, autoBox);
        inBefore(submit, auto);
      }
      addTo(qr, clone);
      addTo(d.body, qr);
    }
    if (e) {
      e.preventDefault();
      (typeof (_ref2 = ((_ref = $('input[title=autohide]:checked', qr)))) === "undefined" || _ref2 === null) ? undefined : _ref2.click();
      selection = window.getSelection();
      id = (typeof (_ref2 = ((_ref = x('preceding::span[@id][1]', selection.anchorNode)))) === "undefined" || _ref2 === null) ? undefined : _ref2.id;
      text = selection.toString();
      textarea = $('textarea', qr);
      textarea.focus();
      textarea.value += '>>' + this.parentNode.id.match(/\d+$/)[0] + '\n';
      return text && id === this.parentNode.id ? textarea.value += (">" + (text) + "\n") : null;
    }
  };
  recaptchaListener = function(e) {
    return e.keyCode === 8 && this.value === '' ? recaptchaReload() : null;
  };
  recaptchaReload = function() {
    return (window.location = 'javascript:Recaptcha.reload()');
  };
  redirect = function() {
    var url;
    switch (g.BOARD) {
      case 'a':
      case 'g':
      case 'lit':
      case 'sci':
      case 'tv':
        url = ("http://green-oval.net/cgi-board.pl/" + (g.BOARD) + "/thread/" + (g.THREAD_ID) + "#p");
        break;
      case 'cgl':
      case 'jp':
      case 'm':
      case 'tg':
        url = ("http://archive.easymodo.net/cgi-board.pl/" + (g.BOARD) + "/thread/" + (g.THREAD_ID) + "#p");
        break;
      default:
        url = ("http://boards.4chan.org/" + (g.BOARD));
    }
    return (location.href = url);
  };
  replyNav = function() {
    var direction, op;
    if (g.REPLY) {
      return (window.location = this.textContent === '▲' ? '#navtop' : '#navbot');
    } else {
      direction = this.textContent === '▲' ? 'preceding' : 'following';
      op = x("" + (direction) + "::span[starts-with(@id, 'nothread')][1]", this).id;
      return (window.location = ("#" + (op)));
    }
  };
  report = function() {
    var input;
    input = x('preceding-sibling::input[1]', this);
    input.click();
    $('input[value="Report"]').click();
    return input.click();
  };
  showReply = function() {
    var div, id, table;
    div = this.parentNode;
    table = div.nextSibling;
    show(table);
    remove(div);
    id = $('td.reply, td.replyhl', table).id;
    slice(g.hiddenReplies, id);
    return GM_setValue("hiddenReplies/" + (g.BOARD) + "/", JSON.stringify(g.hiddenReplies));
  };
  showThread = function() {
    var div, id;
    div = this.nextSibling;
    show(div);
    hide(this);
    id = div.id;
    slice(g.hiddenThreads, id);
    return GM_setValue("hiddenThreads/" + (g.BOARD) + "/", JSON.stringify(g.hiddenThreads));
  };
  stopPropagation = function(e) {
    return e.stopPropagation();
  };
  threadF = function(current) {
    var _i, _len, _ref, a, div, hidden, id;
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
    _ref = g.hiddenThreads;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hidden = _ref[_i];
      if (id === hidden.id) {
        hideThread(div);
      }
    }
    current = current.nextSibling.nextSibling;
    return current.nodeName !== 'CENTER' ? threadF(current) : null;
  };
  watch = function() {
    var id, text;
    id = this.nextSibling.name;
    if (this.src[0] === 'd') {
      this.src = g.favNormal;
      text = ("/" + (g.BOARD) + "/ - ") + x('following-sibling::blockquote', this).textContent.slice(0, 25);
      g.watched[g.BOARD] || (g.watched[g.BOARD] = []);
      g.watched[g.BOARD].push({
        id: id,
        text: text
      });
    } else {
      this.src = g.favEmpty;
      g.watched[g.BOARD] = slice(g.watched[g.BOARD], id);
    }
    GM_setValue('watched', JSON.stringify(g.watched));
    return watcherUpdate();
  };
  watcherUpdate = function() {
    var _i, _j, _len, _ref, _ref2, a, board, div, link, old, thread;
    div = n('div');
    _ref = g.watched;
    for (board in _ref) {
      if (!__hasProp.call(_ref, board)) continue;
      _i = _ref[board];
      _ref2 = g.watched[board];
      for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
        thread = _ref2[_j];
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
  watchX = function() {
    var _, _ref, board, favicon, id, input;
    _ref = this.nextElementSibling.getAttribute('href').substring(1).split('/');
    board = _ref[0];
    _ = _ref[1];
    id = _ref[2];
    g.watched[board] = slice(g.watched[board], id);
    GM_setValue('watched', JSON.stringify(g.watched));
    watcherUpdate();
    if (input = $("input[name=\"" + (id) + "\"]")) {
      favicon = input.previousSibling;
      return (favicon.src = g.favEmpty);
    }
  };
  AEOS.init();
  g = {
    callbacks: [],
    count: 0,
    iframe: false,
    xhrs: [],
    watched: JSON.parse(GM_getValue('watched', '{}')),
    favEmpty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    favNormal: ((typeof (_ref2 = ((_ref = $('link[rel="shortcut icon"]', $('head', d))))) === "undefined" || _ref2 === null) ? undefined : _ref2.href) || 'http://static.4chan.org/image/favicon.ico',
    flavors: ['http://regex.info/exif.cgi?url=', 'http://iqdb.org/?url=', 'http://saucenao.com/search.php?db=999&url=', 'http://tineye.com/search?url='].join('\n')
  };
  pathname = location.pathname.substring(1).split('/');
  _ref = pathname;
  g.BOARD = _ref[0];
  temp = _ref[1];
  if (temp === 'res') {
    g.REPLY = temp;
    g.THREAD_ID = pathname[2];
  } else {
    g.PAGENUM = parseInt(temp) || 0;
  }
  g.hiddenThreads = JSON.parse(GM_getValue("hiddenThreads/" + (g.BOARD) + "/", '[]'));
  g.hiddenReplies = JSON.parse(GM_getValue("hiddenReplies/" + (g.BOARD) + "/", '[]'));
  if (location.hostname.split('.')[0] === 'sys') {
    if (recaptcha = $('#recaptcha_response_field')) {
      m(recaptcha, {
        listener: ['keydown', recaptchaListener]
      });
    } else if (b = $('table font b')) {
      GM_setValue('error', b.firstChild.textContent);
    } else {
      GM_setValue('error', '');
      if (getConfig('Auto Watch')) {
        html = $('b').innerHTML;
        _ref = html.match(/<!-- thread:(\d+),no:(\d+) -->/);
        _ = _ref[0];
        thread = _ref[1];
        id = _ref[2];
        if (thread === '0') {
          board = $('meta', d).content.match(/4chan.org\/(\w+)\//)[1];
          g.watched[board] || (g.watched[board] = []);
          g.watched[board].push({
            id: id,
            text: GM_getValue('autoText')
          });
          GM_setValue('watched', JSON.stringify(g.watched));
        }
      }
    }
    return null;
  }
  lastChecked = GM_getValue('lastChecked', 0);
  now = getTime();
  DAY = 24 * 60 * 60;
  if (lastChecked < now - 1 * DAY) {
    cutoff = now - 7 * DAY;
    while (g.hiddenThreads.length) {
      if (g.hiddenThreads[0].timestamp > cutoff) {
        break;
      }
      g.hiddenThreads.shift();
    }
    while (g.hiddenReplies.length) {
      if (g.hiddenReplies[0].timestamp > cutoff) {
        break;
      }
      g.hiddenReplies.shift();
    }
    GM_setValue("hiddenThreads/" + (g.BOARD) + "/", JSON.stringify(g.hiddenThreads));
    GM_setValue("hiddenReplies/" + (g.BOARD) + "/", JSON.stringify(g.hiddenReplies));
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
  if (navtopr = $('#navtopr a')) {
    text = navtopr.nextSibling;
    a = n('a', {
      textContent: 'X',
      className: 'pointer',
      listener: ['click', options]
    });
    inBefore(text, tn(' / '));
    inBefore(text, a);
    navbotr = $('#navbotr a');
    text = navbotr.nextSibling;
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
  if (getConfig('Sauce')) {
    g.callbacks.push(function(root) {
      var _j, _len2, _ref3, _result, _result2, i, l, link, names, prefix, prefixes, span, spans, suffix;
      spans = $$('span.filesize', root);
      prefixes = GM_getValue('flavors', g.flavors).split('\n');
      names = (function() {
        _result = []; _ref3 = prefixes;
        for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
          prefix = _ref3[_j];
          _result.push(prefix.match(/(\w+)\./)[1]);
        }
        return _result;
      })();
      _result = []; _ref3 = spans;
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        span = _ref3[_j];
        _result.push((function() {
          suffix = $('a', span).href;
          i = 0;
          l = names.length;
          _result2 = [];
          while (i < l) {
            _result2.push((function() {
              link = n('a', {
                textContent: names[i],
                href: prefixes[i] + suffix
              });
              addTo(span, tn(' '), link);
              return i++;
            })());
          }
          return _result2;
        })());
      }
      return _result;
    });
  }
  if (getConfig('Reply Hiding')) {
    g.callbacks.push(function(root) {
      var _j, _k, _len2, _len3, _ref3, _ref4, _result, _result2, next, obj, td, tds;
      tds = $$('td.doubledash', root);
      _result = []; _ref3 = tds;
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        td = _ref3[_j];
        _result.push((function() {
          a = n('a', {
            textContent: '[ - ]',
            className: 'pointer',
            listener: ['click', hideReply]
          });
          replace(td.firstChild, a);
          next = td.nextSibling;
          id = next.id;
          _result2 = []; _ref4 = g.hiddenReplies;
          for (_k = 0, _len3 = _ref4.length; _k < _len3; _k++) {
            obj = _ref4[_k];
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
    g.callbacks.push(function(root) {
      var _j, _len2, _ref3, _result, quote, quotes;
      quotes = $$('a.quotejs:not(:first-child)', root);
      _result = []; _ref3 = quotes;
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        quote = _ref3[_j];
        _result.push(quote.addEventListener('click', quickReply, true));
      }
      return _result;
    });
    recaptcha.id = '';
  }
  if (getConfig('Quick Report')) {
    g.callbacks.push(function(root) {
      var _j, _len2, _ref3, _result, arr, el;
      arr = $$('span[id^=no]', root);
      _result = []; _ref3 = arr;
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        el = _ref3[_j];
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
    threads = g.watched[g.BOARD] || [];
    inputs = $$('form > input[value="delete"], div > input[value="delete"]');
    _ref = inputs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      (function() {
        var img, src;
        var input = _ref[_i];
        id = input.name;
        src = (function() {
          var _j, _len2, _ref3, thread;
          _ref3 = threads;
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            thread = _ref3[_j];
            if (id === thread.id) {
              return g.favNormal;
            }
          }
          return g.favEmpty;
        })();
        img = n('img', {
          src: src,
          className: 'pointer',
          listener: ['click', watch]
        });
        return inBefore(input, img);
      })();
    }
  }
  if (getConfig('Anonymize')) {
    g.callbacks.push(function(root) {
      var _j, _len2, _ref3, _result, name, names, trip, trips;
      names = $$('span.postername, span.commentpostername', root);
      _ref3 = names;
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        name = _ref3[_j];
        name.innerHTML = 'Anonymous';
      }
      trips = $$('span.postertrip', root);
      _result = []; _ref3 = trips;
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        trip = _ref3[_j];
        _result.push(trip.parentNode.nodeName === 'A' ? remove(trip.parentNode) : remove(trip));
      }
      return _result;
    });
  }
  if (getConfig('Reply Navigation')) {
    g.callbacks.push(function(root) {
      var _j, _len2, _ref3, _result, arr, down, el, span, up;
      arr = $$('span[id^=norep]', root);
      _result = []; _ref3 = arr;
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        el = _ref3[_j];
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
  if (g.REPLY) {
    if (getConfig('Quick Reply') && getConfig('Persistent QR')) {
      quickReply();
      $('#qr input[title=autohide]').click();
    }
    if (getConfig('Post in Title')) {
      if (!(text = $('span.filetitle').textContent)) {
        text = $('blockquote').textContent;
      }
      if (text) {
        d.title = ("/" + (g.BOARD) + "/ - " + (text));
      }
    }
  } else {
    if (getConfig('Keyboard Actions')) {
      form = $('div.postarea > form');
      inputs = $$('input[type=text], textarea', form);
      _ref = inputs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        input.addEventListener('focus', keyActRem, true);
        input.addEventListener('blur', keyActAdd, true);
      }
      keyActAdd();
    }
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
      l1 = arr.length - 1;
      _ref = arr;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        span = n('span', {
          className: 'navlinks',
          id: 'p' + _i
        });
        if (_i) {
          textContent = '▲';
          href = ("#p" + (_i - 1));
        } else if (g.PAGENUM) {
          textContent = '◀';
          href = ("" + (g.PAGENUM - 1) + "#p0");
        } else {
          textContent = '▲';
          href = "#navtop";
        }
        up = n('a', {
          className: 'pointer',
          textContent: textContent,
          href: href
        });
        if (_i < l1) {
          textContent = '▼';
          href = ("#p" + (_i + 1));
        } else {
          textContent = '▶';
          href = ("" + (g.PAGENUM + 1) + "#p0");
        }
        down = n('a', {
          className: 'pointer',
          textContent: textContent,
          href: href
        });
        addTo(span, up, tn(' '), down);
        inBefore(el, span);
      }
      if (location.hash === '#p0') {
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
  _ref = g.callbacks;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    callback = _ref[_i];
    callback();
  }
  d.body.addEventListener('DOMNodeInserted', nodeInserted, true);
}).call(this);
