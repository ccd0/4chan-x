(function() {
  var $, $$, AEOS, DAY, a, addTo, arr, as, autoWatch, autohide, b, board, callback, clearHidden, closeQR, config, cooldown, cutoff, d, delform, down, editSauce, el, expandComment, expandThread, form, formSubmit, g, getConfig, getThread, getTime, hide, hideReply, hideThread, href, html, i, id, iframe, iframeLoad, inAfter, inBefore, input, inputs, keybindAdd, keybindRem, keydown, keypress, l1, lastChecked, m, n, navbotr, navtopr, nodeInserted, now, omitted, onloadComment, onloadThread, options, optionsClose, parseResponse, pathname, quickReply, recaptcha, recaptchaListener, recaptchaReload, redirect, remove, replace, replyNav, report, scroll, show, showReply, showThread, slice, span, stopPropagation, temp, text, textContent, thread, threadF, threads, tn, tzOffset, up, watch, watchX, watcher, watcherUpdate, x, zeroPad, _, _base, _fn, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _ref, _ref2, _ref3, _ref4;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  config = {
    '404 Redirect': [true, 'Redirect dead threads'],
    'Anonymize': [false, 'Make everybody anonymous'],
    'Auto Watch': [true, 'Automatically watch threads that you start (Firefox only)'],
    'Comment Expansion': [true, 'Expand too long comments'],
    'Keybinds': [false, 'Binds actions to keys'],
    'Localize Time': [true, 'Show times based on your timezone'],
    'Persistent QR': [false, 'Quick reply won\'t disappear after posting. Only in replies.'],
    'Post in Title': [true, 'Show the op\'s post in the tab title'],
    'Quick Reply': [true, 'Reply without leaving the page'],
    'Quick Report': [true, 'Add quick report buttons'],
    'Reply Hiding': [true, 'Hide single replies'],
    'Reply Navigation': [true, 'Navigate to the beginning / end of a thread'],
    'Sauce': [true, 'Add sauce to images'],
    'Show Stubs': [true, 'Of hidden threads / replies'],
    'Thread Expansion': [true, 'View all replies'],
    'Thread Hiding': [true, 'Hide entire threads'],
    'Thread Navigation': [true, 'Navigate to previous / next thread'],
    'Thread Watcher': [true, 'Bookmark threads']
  };
  AEOS = {
    init: function() {
      if (typeof GM_deleteValue == "undefined" || GM_deleteValue === null) {
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
      }
      left = GM_getValue("" + id + "Left", left);
      top = GM_getValue("" + id + "Top", top);
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
      return div.style.bottom = bottom;
    },
    moveEnd: function() {
      var div, id;
      document.removeEventListener('mousemove', AEOS.moveMove, true);
      document.removeEventListener('mouseup', AEOS.moveEnd, true);
      div = AEOS.div;
      id = div.id;
      GM_setValue("" + id + "Left", div.style.left);
      return GM_setValue("" + id + "Top", div.style.top);
    }
  };
  d = document;
  g = null;
  $ = function(selector, root) {
    root || (root = d.body);
    return root.querySelector(selector);
  };
  $$ = function(selector, root) {
    var node, result, _i, _len, _results;
    root || (root = d.body);
    result = root.querySelectorAll(selector);
    _results = [];
    for (_i = 0, _len = result.length; _i < _len; _i++) {
      node = result[_i];
      _results.push(node);
    }
    return _results;
  };
  addTo = function() {
    var child, children, parent, _i, _len, _results;
    parent = arguments[0], children = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    _results = [];
    for (_i = 0, _len = children.length; _i < _len; _i++) {
      child = children[_i];
      _results.push(parent.appendChild(child));
    }
    return _results;
  };
  getConfig = function(name) {
    return GM_getValue(name, config[name][0]);
  };
  getTime = function() {
    return Math.floor(new Date().getTime() / 1000);
  };
  hide = function(el) {
    return el.style.display = 'none';
  };
  inAfter = function(root, el) {
    return root.parentNode.insertBefore(el, root.nextSibling);
  };
  inBefore = function(root, el) {
    return root.parentNode.insertBefore(el, root);
  };
  m = function(el, props) {
    var event, funk, key, l, val;
    if (l = props.listener) {
      delete props.listener;
      event = l[0], funk = l[1];
      el.addEventListener(event, funk, true);
    }
    for (key in props) {
      if (!__hasProp.call(props, key)) continue;
      val = props[key];
      el[key] = val;
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
    return el.style.display = '';
  };
  slice = function(arr, id) {
    var i, l, _results;
    i = 0;
    l = arr.length;
    _results = [];
    while (i < l) {
      if (id === arr[i].id) {
        arr.splice(i, 1);
        return arr;
      }
      _results.push(i++);
    }
    return _results;
  };
  tn = function(s) {
    return d.createTextNode(s);
  };
  x = function(path, root) {
    root || (root = d.body);
    return d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
  };
  zeroPad = function(n) {
    if (n < 10) {
      return '0' + n;
    } else {
      return n;
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
    return qr.className = klass;
  };
  autoWatch = function() {
    var autoText;
    autoText = $('textarea', this).value.slice(0, 25);
    return GM_setValue('autoText', "/" + g.BOARD + "/ - " + autoText);
  };
  closeQR = function() {
    var div;
    div = this.parentNode.parentNode;
    remove(div);
    return keybindAdd();
  };
  clearHidden = function() {
    GM_deleteValue("hiddenReplies/" + g.BOARD + "/");
    GM_deleteValue("hiddenThreads/" + g.BOARD + "/");
    this.value = "hidden: 0";
    g.hiddenReplies = [];
    return g.hiddenThreads = [];
  };
  cooldown = function() {
    var auto, seconds, submit;
    submit = $('#qr input[type=submit]');
    seconds = parseInt(submit.value);
    if (seconds === 0) {
      submit.disabled = false;
      submit.value = 'Submit';
      auto = submit.previousSibling.lastChild;
      if (auto.checked) {
        return $('#qr form').submit();
      }
    } else {
      submit.value = seconds - 1;
      return window.setTimeout(cooldown, 1000);
    }
  };
  editSauce = function() {
    var ta;
    ta = $('#options textarea');
    if (ta.style.display) {
      return show(ta);
    } else {
      return hide(ta);
    }
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
    var id, num, prev, r, span, table, xhr, _i, _len, _ref;
    id = x('preceding-sibling::input[1]', this).name;
    span = this;
    if (span.textContent[0] === '-') {
      num = board === 'b' ? 3 : 5;
      table = x("following::br[@clear][1]/preceding::table[" + num + "]", span);
      while ((prev = table.previousSibling) && (prev.nodeName === 'TABLE')) {
        remove(prev);
      }
      span.textContent = span.textContent.replace('-', '+');
      return;
    }
    span.textContent = span.textContent.replace('+', 'X Loading...');
    _ref = g.xhrs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      xhr = _ref[_i];
      if (xhr.id === id) {
        onloadThread(xhr.r.responseText, span);
        return;
      }
    }
    r = new XMLHttpRequest();
    r.onload = function() {
      return onloadThread(this.responseText, span);
    };
    r.open('GET', "res/" + id, true);
    r.send();
    return g.xhrs.push({
      r: r,
      id: id
    });
  };
  getThread = function() {
    var bottom, i, thread, threads, _len;
    threads = $$('div.thread');
    for (i = 0, _len = threads.length; i < _len; i++) {
      thread = threads[i];
      bottom = thread.getBoundingClientRect().bottom;
      if (bottom > 0) {
        return [thread, i];
      }
    }
  };
  formSubmit = function(e) {
    var recaptcha, span, _ref;
    if (span = this.nextSibling) {
      remove(span);
    }
    recaptcha = $('input[name=recaptcha_response_field]', this);
    if (recaptcha.value) {
      if ((_ref = $('#qr input[title=autohide]:not(:checked)')) != null) {
        _ref.click();
      }
      return keybindAdd();
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
    var a, div, name, p, table, trip, _ref;
    if (p = this.parentNode) {
      reply = p.nextSibling;
      g.hiddenReplies.push({
        id: reply.id,
        timestamp: getTime()
      });
      GM_setValue("hiddenReplies/" + g.BOARD + "/", JSON.stringify(g.hiddenReplies));
    }
    name = $('span.commentpostername', reply).textContent;
    trip = ((_ref = $('span.postertrip', reply)) != null ? _ref.textContent : void 0) || '';
    table = x('ancestor::table', reply);
    hide(table);
    if (getConfig('Show Stubs')) {
      a = n('a', {
        textContent: "[ + ] " + name + " " + trip,
        className: 'pointer',
        listener: ['click', showReply]
      });
      div = n('div');
      addTo(div, a);
      return inBefore(table, div);
    }
  };
  hideThread = function(div) {
    var a, name, num, p, span, text, trip, _ref;
    if (p = this.parentNode) {
      div = p;
      g.hiddenThreads.push({
        id: div.id,
        timestamp: getTime()
      });
      GM_setValue("hiddenThreads/" + g.BOARD + "/", JSON.stringify(g.hiddenThreads));
    }
    hide(div);
    if (getConfig('Show Stubs')) {
      if (span = $('.omittedposts', div)) {
        num = Number(span.textContent.match(/\d+/)[0]);
      } else {
        num = 0;
      }
      num += $$('table', div).length;
      text = num === 1 ? "1 reply" : "" + num + " replies";
      name = $('span.postername', div).textContent;
      trip = ((_ref = $('span.postername + span.postertrip', div)) != null ? _ref.textContent : void 0) || '';
      a = n('a', {
        textContent: "[ + ] " + name + trip + " (" + text + ")",
        className: 'pointer',
        listener: ['click', showThread]
      });
      return inBefore(div, a);
    }
  };
  iframeLoad = function() {
    var auto, error, qr, span, submit, _ref, _ref2;
    if (g.iframe = !g.iframe) {
      return;
    }
    $('iframe').src = 'about:blank';
    qr = $('#qr');
    if (error = GM_getValue('error')) {
      span = n('span', {
        textContent: error,
        className: 'error'
      });
      addTo(qr, span);
      if ((_ref = $('input[title=autohide]:checked', qr)) != null) {
        _ref.click();
      }
      keybindRem();
    } else if (g.REPLY && getConfig('Persistent QR')) {
      $('textarea', qr).value = '';
      $('input[name=recaptcha_response_field]', qr).value = '';
      submit = $('input[type=submit]', qr);
      submit.value = 30;
      submit.disabled = true;
      window.setTimeout(cooldown, 1000);
      auto = submit.previousSibling.lastChild;
      if (auto.checked) {
        if ((_ref2 = $('input[title=autohide]:checked', qr)) != null) {
          _ref2.click();
        }
      }
    } else {
      remove(qr);
    }
    return recaptchaReload();
  };
  keybindAdd = function() {
    if (getConfig('Keybinds')) {
      d.addEventListener('keydown', keydown, true);
      return d.addEventListener('keypress', keypress, true);
    }
  };
  keybindRem = function() {
    d.removeEventListener('keydown', keydown, true);
    return d.removeEventListener('keypress', keypress, true);
  };
  keypress = function(e) {
    var bot, char, count, hash, height, href, i, img, kc, next, prev, qrLink, rect, replies, reply, td, temp, thread, top, _i, _j, _len, _len2, _len3, _len4, _ref, _ref2;
    kc = g.keyCode;
    if (kc === -1) {
      return;
    }
    e.preventDefault();
    char = String.fromCharCode(kc);
    hash = location.hash;
    count = g.count;
    if (__indexOf.call('1234567890', char) >= 0) {
      temp = Number(char);
      if (temp === 0 && count === 0) {
        location.pathname = "/" + g.BOARD;
      } else {
        g.count = (count * 10) + temp;
      }
      return;
    }
    g.count = 0;
    if (char === "G") {
      if (count) {
        temp = count > 15 ? 15 : count;
        location.pathname = "/" + g.BOARD + "/" + temp + "#1";
      } else {
        if (e.shiftKey) {
          window.scrollTo(0, 99999);
        } else {
          window.scrollTo(0, 0);
          location.hash = '';
        }
      }
    }
    count || (count = 1);
    if (g.REPLY) {
      switch (char) {
        case "I":
          if (!(qrLink = $('td.replyhl span[id] a:not(:first-child)'))) {
            qrLink = $("span[id^=nothread] a:not(:first-child)");
          }
          return quickReply.call(qrLink);
          break;
        case "J":
          if (e.shiftKey) {
            if (td = $('td.replyhl')) {
              td.className = 'reply';
              rect = td.getBoundingClientRect();
              if (rect.top > 0 && rect.bottom < d.body.clientHeight) {
                next = x('following::td[@class="reply"]', td);
                rect = next.getBoundingClientRect();
                if (rect.top > 0 && rect.bottom < d.body.clientHeight) {
                  next.className = 'replyhl';
                }
                return;
              }
            }
            replies = $$('td.reply');
            for (_i = 0, _len = replies.length; _i < _len; _i++) {
              reply = replies[_i];
              top = reply.getBoundingClientRect().top;
              if (top > 0) {
                reply.className = 'replyhl';
                break;
              }
            }
          } else {
            return window.scrollBy(0, 20 * count);
          }
          break;
        case "K":
          if (e.shiftKey) {
            if (td = $('td.replyhl')) {
              td.className = 'reply';
              rect = td.getBoundingClientRect();
              if (rect.top > 0 && rect.bottom < d.body.clientHeight) {
                prev = x('preceding::td[@class="reply"][1]', td);
                rect = prev.getBoundingClientRect();
                if (rect.top > 0 && rect.bottom < d.body.clientHeight) {
                  prev.className = 'replyhl';
                }
                return;
              }
            }
            replies = $$('td.reply');
            replies.reverse();
            height = d.body.clientHeight;
            for (_j = 0, _len2 = replies.length; _j < _len2; _j++) {
              reply = replies[_j];
              bot = reply.getBoundingClientRect().bottom;
              if (bot < height) {
                reply.className = 'replyhl';
                break;
              }
            }
          } else {
            return window.scrollBy(0, -20 * count);
          }
      }
    } else {
      switch (char) {
        case "H":
          temp = g.PAGENUM - count;
          if (temp < 0) {
            temp = 0;
          }
          return location.pathname = "/" + g.BOARD + "/" + temp + "#1";
          break;
        case "I":
          thread = getThread()[0];
          if (!(qrLink = $('td.replyhl span[id] a:not(:first-child)', thread))) {
            qrLink = $("span#nothread" + thread.id + " a:not(:first-child)", thread);
          }
          return quickReply.call(qrLink);
          break;
        case "J":
          if (e.shiftKey) {
            thread = getThread()[0];
            replies = $$('td[id]', thread);
            for (i = 0, _len3 = replies.length; i < _len3; i++) {
              reply = replies[i];
              if (reply.className === 'replyhl') {
                reply.className = 'reply';
                if ((_ref = replies[i + 1]) != null) {
                  _ref.className = 'replyhl';
                }
                return;
              }
            }
            return replies[0].className = 'replyhl';
          } else {
            return scroll(count);
          }
          break;
        case "K":
          if (e.shiftKey) {
            thread = getThread()[0];
            replies = $$('td[id]', thread);
            for (i = 0, _len4 = replies.length; i < _len4; i++) {
              reply = replies[i];
              if (reply.className === 'replyhl') {
                reply.className = 'reply';
                if ((_ref2 = replies[i - 1]) != null) {
                  _ref2.className = 'replyhl';
                }
                return;
              }
            }
            return replies.pop().className = 'replyhl';
          } else {
            return scroll(count * -1);
          }
          break;
        case "L":
          temp = g.PAGENUM + count;
          if (temp > 15) {
            temp = 15;
          }
          return location.pathname = "/" + g.BOARD + "/" + temp + "#0";
          break;
        case "M":
          img = $("" + hash + " ~ img");
          return watch.call(img);
          break;
        case "O":
          href = $("" + hash + " ~ span[id] a:last-of-type").href;
          return GM_openInTab(href);
      }
    }
  };
  keydown = function(e) {
    var kc;
    kc = e.keyCode;
    if (!(48 <= kc && kc <= 90)) {
      return g.keyCode = -1;
    } else if (e.ctrlKey || e.altKey) {
      return g.keyCode = -1;
    } else {
      return g.keyCode = kc;
    }
  };
  nodeInserted = function(e) {
    var callback, qr, target, _i, _len, _ref, _results;
    target = e.target;
    if (target.nodeName === 'TABLE') {
      _ref = g.callbacks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback(target));
      }
      return _results;
    } else if (target.id === 'recaptcha_challenge_field' && (qr = $('#qr'))) {
      $('#recaptcha_image img', qr).src = "http://www.google.com/recaptcha/api/image?c=" + target.value;
      return $('#recaptcha_challenge_field', qr).value = target.value;
    }
  };
  onloadComment = function(responseText, a, href) {
    var bq, html, id, op, opbq, replies, reply, _, _i, _len, _ref, _ref2;
    _ref = href.match(/(\d+)#(\d+)/), _ = _ref[0], op = _ref[1], id = _ref[2];
    _ref2 = parseResponse(responseText), replies = _ref2[0], opbq = _ref2[1];
    if (id === op) {
      html = opbq.innerHTML;
    } else {
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        if (reply.id === id) {
          html = $('blockquote', reply).innerHTML;
        }
      }
    }
    bq = x('ancestor::blockquote', a);
    return bq.innerHTML = html;
  };
  onloadThread = function(responseText, span) {
    var div, next, opbq, replies, reply, _i, _j, _len, _len2, _ref, _results, _results2;
    _ref = parseResponse(responseText), replies = _ref[0], opbq = _ref[1];
    span.textContent = span.textContent.replace('X Loading...', '- ');
    span.previousSibling.innerHTML = opbq.innerHTML;
    while ((next = span.nextSibling) && !next.clear) {
      remove(next);
    }
    if (next) {
      _results = [];
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        _results.push(inBefore(next, x('ancestor::table', reply)));
      }
      return _results;
    } else {
      div = span.parentNode;
      _results2 = [];
      for (_j = 0, _len2 = replies.length; _j < _len2; _j++) {
        reply = replies[_j];
        _results2.push(addTo(div, x('ancestor::table', reply)));
      }
      return _results2;
    }
  };
  options = function() {
    var checked, description, div, hiddenNum, html, option, value;
    if (div = $('#options')) {
      return remove(div);
    } else {
      div = AEOS.makeDialog('options', 'center');
      hiddenNum = g.hiddenReplies.length + g.hiddenThreads.length;
      html = '<div class="move">Options <a class=pointer>X</a></div><div>';
      for (option in config) {
        if (!__hasProp.call(config, option)) continue;
        value = config[option];
        description = value[1];
        checked = getConfig(option) ? "checked" : "";
        html += "<label title=\"" + description + "\">" + option + "<input " + checked + " name=\"" + option + "\" type=\"checkbox\"></label><br>";
      }
      html += "<div><a class=sauce>Flavors</a></div>";
      html += "<div><textarea cols=50 rows=4 style=\"display: none;\"></textarea></div>";
      html += "<input type=\"button\" value=\"hidden: " + hiddenNum + "\"><br>";
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
    var div, input, inputs, _i, _len;
    div = this.parentNode.parentNode;
    inputs = $$('input', div);
    for (_i = 0, _len = inputs.length; _i < _len; _i++) {
      input = inputs[_i];
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
    var auto, autoBox, autohideB, clone, closeB, form, id, input, inputs, qr, script, selection, submit, text, textarea, titlebar, xpath, _i, _j, _len, _len2, _ref, _ref2, _ref3;
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
      if (getConfig('Keybinds')) {
        inputs = $$('input[type=text], textarea', clone);
        for (_j = 0, _len2 = inputs.length; _j < _len2; _j++) {
          input = inputs[_j];
          input.addEventListener('focus', keybindRem, true);
          input.addEventListener('blur', keybindAdd, true);
        }
      }
      if (!g.REPLY) {
        xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]';
        input = n('input', {
          type: 'hidden',
          name: 'resto',
          value: x(xpath, this).name
        });
        addTo(clone, input);
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
    if (!g.startup) {
      if (e != null) {
        e.preventDefault();
      }
      if ((_ref2 = $('input[title=autohide]:checked', qr)) != null) {
        _ref2.click();
      }
      selection = window.getSelection();
      id = (_ref3 = x('preceding::span[@id][1]', selection.anchorNode)) != null ? _ref3.id : void 0;
      text = selection.toString();
      textarea = $('textarea', qr);
      textarea.focus();
      textarea.value += '>>' + this.parentNode.id.match(/\d+$/)[0] + '\n';
      if (text && id === this.parentNode.id) {
        return textarea.value += ">" + text + "\n";
      }
    }
  };
  recaptchaListener = function(e) {
    if (e.keyCode === 8 && this.value === '') {
      return recaptchaReload();
    }
  };
  recaptchaReload = function() {
    return window.location = 'javascript:Recaptcha.reload()';
  };
  redirect = function() {
    var url;
    switch (g.BOARD) {
      case 'a':
      case 'g':
      case 'lit':
      case 'sci':
      case 'tv':
        url = "http://green-oval.net/cgi-board.pl/" + g.BOARD + "/thread/" + g.THREAD_ID;
        break;
      case 'cgl':
      case 'jp':
      case 'm':
      case 'tg':
        url = "http://archive.easymodo.net/cgi-board.pl/" + g.BOARD + "/thread/" + g.THREAD_ID;
        break;
      case '3':
      case 'adv':
      case 'an':
      case 'c':
      case 'ck':
      case 'co':
      case 'fa':
      case 'fit':
      case 'int':
      case 'k':
      case 'mu':
      case 'n':
      case 'new':
      case 'o':
      case 'p':
      case 'po':
      case 'sp':
      case 'toy':
      case 'trv':
      case 'v':
      case 'vp':
      case 'x':
        url = "http://173.74.0.45/archive/" + g.BOARD + "/thread/" + g.THREAD_ID;
        break;
      default:
        url = "http://boards.4chan.org/" + g.BOARD;
    }
    return location.href = url;
  };
  replyNav = function() {
    var direction, op;
    if (g.REPLY) {
      return window.location = this.textContent === '▲' ? '#navtop' : '#navbot';
    } else {
      direction = this.textContent === '▲' ? 'preceding' : 'following';
      op = x("" + direction + "::span[starts-with(@id, 'nothread')][1]", this).id;
      return window.location = "#" + op;
    }
  };
  report = function() {
    var input;
    input = x('preceding-sibling::input[1]', this);
    input.click();
    $('input[value="Report"]').click();
    return input.click();
  };
  scroll = function(count) {
    var hash, idx, temp, thread, top, _ref;
    _ref = getThread(), thread = _ref[0], idx = _ref[1];
    top = thread.getBoundingClientRect().top;
    if (idx === 0 && top > 1) {
      idx = -1;
    }
    if (count < 0 && top < -1) {
      count++;
    }
    temp = idx + count;
    if (temp < 0) {
      hash = '';
    } else if (temp > 9) {
      hash = 'p9';
    } else {
      hash = "p" + temp;
    }
    return location.hash = hash;
  };
  showReply = function() {
    var div, id, table;
    div = this.parentNode;
    table = div.nextSibling;
    show(table);
    remove(div);
    id = $('td.reply, td.replyhl', table).id;
    slice(g.hiddenReplies, id);
    return GM_setValue("hiddenReplies/" + g.BOARD + "/", JSON.stringify(g.hiddenReplies));
  };
  showThread = function() {
    var div, id;
    div = this.nextSibling;
    show(div);
    hide(this);
    id = div.id;
    slice(g.hiddenThreads, id);
    return GM_setValue("hiddenThreads/" + g.BOARD + "/", JSON.stringify(g.hiddenThreads));
  };
  stopPropagation = function(e) {
    return e.stopPropagation();
  };
  threadF = function(current) {
    var a, div, hidden, id, _i, _len, _ref;
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
    while (!current.clear) {
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
    if (current.nodeName !== 'CENTER') {
      return threadF(current);
    }
  };
  watch = function() {
    var id, text, _base, _name;
    id = this.nextSibling.name;
    if (this.src[0] === 'd') {
      this.src = g.favNormal;
      text = ("/" + g.BOARD + "/ - ") + x('following-sibling::blockquote', this).textContent.slice(0, 25);
      (_base = g.watched)[_name = g.BOARD] || (_base[_name] = []);
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
    var a, board, div, link, old, thread, _i, _len, _ref, _ref2;
    div = n('div');
    _ref = g.watched;
    for (board in _ref) {
      if (!__hasProp.call(_ref, board)) continue;
      _ref2 = g.watched[board];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        thread = _ref2[_i];
        a = n('a', {
          textContent: 'X',
          className: 'pointer',
          listener: ['click', watchX]
        });
        link = n('a', {
          textContent: thread.text,
          href: "/" + board + "/res/" + thread.id
        });
        addTo(div, a, tn(' '), link, n('br'));
      }
    }
    old = $('#watcher div:last-child');
    return replace(old, div);
  };
  watchX = function() {
    var board, favicon, id, input, _, _ref;
    _ref = this.nextElementSibling.getAttribute('href').substring(1).split('/'), board = _ref[0], _ = _ref[1], id = _ref[2];
    g.watched[board] = slice(g.watched[board], id);
    GM_setValue('watched', JSON.stringify(g.watched));
    watcherUpdate();
    if (input = $("input[name=\"" + id + "\"]")) {
      favicon = input.previousSibling;
      return favicon.src = g.favEmpty;
    }
  };
  AEOS.init();
  g = {
    callbacks: [],
    count: 0,
    favEmpty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    favNormal: ((_ref = $('link[rel="shortcut icon"]', $('head', d))) != null ? _ref.href : void 0) || 'http://static.4chan.org/image/favicon.ico',
    flavors: ['http://regex.info/exif.cgi?url=', 'http://iqdb.org/?url=', 'http://saucenao.com/search.php?db=999&url=', 'http://tineye.com/search?url='].join('\n'),
    iframe: false,
    startup: true,
    watched: JSON.parse(GM_getValue('watched', '{}')),
    xhrs: []
  };
  pathname = location.pathname.substring(1).split('/');
  g.BOARD = pathname[0], temp = pathname[1];
  if (temp === 'res') {
    g.REPLY = temp;
    g.THREAD_ID = pathname[2];
  } else {
    g.PAGENUM = parseInt(temp) || 0;
  }
  g.hiddenThreads = JSON.parse(GM_getValue("hiddenThreads/" + g.BOARD + "/", '[]'));
  g.hiddenReplies = JSON.parse(GM_getValue("hiddenReplies/" + g.BOARD + "/", '[]'));
  tzOffset = (new Date()).getTimezoneOffset() / 60;
  g.chanOffset = 5 - tzOffset;
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
        _ref2 = html.match(/<!-- thread:(\d+),no:(\d+) -->/), _ = _ref2[0], thread = _ref2[1], id = _ref2[2];
        if (thread === '0') {
          board = $('meta', d).content.match(/4chan.org\/(\w+)\//)[1];
          (_base = g.watched)[board] || (_base[board] = []);
          g.watched[board].push({
            id: id,
            text: GM_getValue('autoText')
          });
          GM_setValue('watched', JSON.stringify(g.watched));
        }
      }
    }
    return;
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
    GM_setValue("hiddenThreads/" + g.BOARD + "/", JSON.stringify(g.hiddenThreads));
    GM_setValue("hiddenReplies/" + g.BOARD + "/", JSON.stringify(g.hiddenReplies));
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
    return;
  }
  _ref3 = $$('#recaptcha_table a');
  for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
    el = _ref3[_i];
    el.tabIndex = 1;
  }
  recaptcha = $('#recaptcha_response_field');
  recaptcha.addEventListener('keydown', recaptchaListener, true);
  if (getConfig('Localize Time')) {
    g.callbacks.push(function(root) {
      var date, day, dotw, hour, min_sec, month, s, span, spans, year, _i, _len, _ref, _results;
      spans = $$('span[id^=no]', root);
      _results = [];
      for (_i = 0, _len = spans.length; _i < _len; _i++) {
        span = spans[_i];
        s = span.previousSibling;
        _ref = s.textContent.match(/(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\S+)/), _ = _ref[0], month = _ref[1], day = _ref[2], year = _ref[3], hour = _ref[4], min_sec = _ref[5];
        year = "20" + year;
        month -= 1;
        hour = g.chanOffset + Number(hour);
        date = new Date(year, month, day, hour);
        year = date.getFullYear() - 2000;
        month = zeroPad(date.getMonth() + 1);
        day = zeroPad(date.getDate());
        hour = zeroPad(date.getHours());
        dotw = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
        _results.push(s.textContent = " " + month + "/" + day + "/" + year + "(" + dotw + ")" + hour + ":" + min_sec + " ");
      }
      return _results;
    });
  }
  if (getConfig('Sauce')) {
    g.callbacks.push(function(root) {
      var i, l, link, names, prefix, prefixes, span, spans, suffix, _i, _j, _len, _len2, _results, _results2, _results3;
      spans = $$('span.filesize', root);
      prefixes = GM_getValue('flavors', g.flavors).split('\n');
      names = (function() {
        _results = [];
        for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
          prefix = prefixes[_i];
          _results.push(prefix.match(/(\w+)\./)[1]);
        }
        return _results;
      }());
      _results2 = [];
      for (_j = 0, _len2 = spans.length; _j < _len2; _j++) {
        span = spans[_j];
        suffix = $('a', span).href;
        i = 0;
        l = names.length;
        _results2.push(function() {
          _results3 = [];
          while (i < l) {
            link = n('a', {
              textContent: names[i],
              href: prefixes[i] + suffix
            });
            addTo(span, tn(' '), link);
            _results3.push(i++);
          }
          return _results3;
        }());
      }
      return _results2;
    });
  }
  if (getConfig('Reply Hiding')) {
    g.callbacks.push(function(root) {
      var next, obj, td, tds, _i, _j, _len, _len2, _ref, _results, _results2;
      tds = $$('td.doubledash', root);
      _results = [];
      for (_i = 0, _len = tds.length; _i < _len; _i++) {
        td = tds[_i];
        a = n('a', {
          textContent: '[ - ]',
          className: 'pointer',
          listener: ['click', hideReply]
        });
        replace(td.firstChild, a);
        next = td.nextSibling;
        id = next.id;
        _results.push(function() {
          _ref = g.hiddenReplies;
          _results2 = [];
          for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
            obj = _ref[_j];
            _results2.push(obj.id === id ? hideReply(next) : void 0);
          }
          return _results2;
        }());
      }
      return _results;
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
      var quote, quotes, _i, _len, _results;
      quotes = $$('a.quotejs:not(:first-child)', root);
      _results = [];
      for (_i = 0, _len = quotes.length; _i < _len; _i++) {
        quote = quotes[_i];
        _results.push(quote.addEventListener('click', quickReply, true));
      }
      return _results;
    });
    recaptcha.id = '';
  }
  if (getConfig('Quick Report')) {
    g.callbacks.push(function(root) {
      var arr, el, _i, _len, _results;
      arr = $$('span[id^=no]', root);
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        el = arr[_i];
        a = n('a', {
          textContent: '[ ! ]',
          className: 'pointer',
          listener: ['click', report]
        });
        inAfter(el, a);
        _results.push(inAfter(el, tn(' ')));
      }
      return _results;
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
    _fn = function(input) {
      var img, src;
      id = input.name;
      src = (function() {
        var thread, _i, _len;
        for (_i = 0, _len = threads.length; _i < _len; _i++) {
          thread = threads[_i];
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
    };
    for (_j = 0, _len2 = inputs.length; _j < _len2; _j++) {
      input = inputs[_j];
      _fn(input);
    }
  }
  if (getConfig('Anonymize')) {
    g.callbacks.push(function(root) {
      var name, names, trip, trips, _i, _j, _len, _len2, _results;
      names = $$('span.postername, span.commentpostername', root);
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        name.innerHTML = 'Anonymous';
      }
      trips = $$('span.postertrip', root);
      _results = [];
      for (_j = 0, _len2 = trips.length; _j < _len2; _j++) {
        trip = trips[_j];
        _results.push(trip.parentNode.nodeName === 'A' ? remove(trip.parentNode) : remove(trip));
      }
      return _results;
    });
  }
  if (getConfig('Reply Navigation')) {
    g.callbacks.push(function(root) {
      var arr, down, el, span, up, _i, _len, _results;
      arr = $$('span[id^=norep]', root);
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        el = arr[_i];
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
        _results.push(inAfter(el, span));
      }
      return _results;
    });
  }
  if (getConfig('Keybinds')) {
    form = $('div.postarea > form');
    inputs = $$('input[type=text], textarea', form);
    for (_k = 0, _len3 = inputs.length; _k < _len3; _k++) {
      input = inputs[_k];
      input.addEventListener('focus', keybindRem, true);
      input.addEventListener('blur', keybindAdd, true);
    }
    keybindAdd();
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
        d.title = "/" + g.BOARD + "/ - " + text;
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
      l1 = arr.length - 1;
      for (i = 0, _len4 = arr.length; i < _len4; i++) {
        el = arr[i];
        span = n('span', {
          className: 'navlinks',
          id: 'p' + i
        });
        if (i) {
          textContent = '▲';
          href = "#p" + (i - 1);
        } else if (g.PAGENUM) {
          textContent = '◀';
          href = "" + (g.PAGENUM - 1) + "#p0";
        } else {
          textContent = '▲';
          href = "#navtop";
        }
        up = n('a', {
          className: 'pointer',
          textContent: textContent,
          href: href
        });
        if (i < l1) {
          textContent = '▼';
          href = "#p" + (i + 1);
        } else {
          textContent = '▶';
          href = "" + (g.PAGENUM + 1) + "#p0";
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
      for (_l = 0, _len5 = omitted.length; _l < _len5; _l++) {
        span = omitted[_l];
        a = n('a', {
          className: 'pointer omittedposts',
          textContent: "+ " + span.textContent,
          listener: ['click', expandThread]
        });
        replace(span, a);
      }
    }
    if (getConfig('Comment Expansion')) {
      as = $$('span.abbr a');
      for (_m = 0, _len6 = as.length; _m < _len6; _m++) {
        a = as[_m];
        a.addEventListener('click', expandComment, true);
      }
    }
  }
  _ref4 = g.callbacks;
  for (_n = 0, _len7 = _ref4.length; _n < _len7; _n++) {
    callback = _ref4[_n];
    callback();
  }
  d.body.addEventListener('DOMNodeInserted', nodeInserted, true);
  g.startup = false;
}).call(this);
