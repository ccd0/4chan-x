// ==UserScript==
// @name           4chan x
// @namespace      aeosynth
// @description    Adds various features.
// @version        2.10.0
// @copyright      2009-2011 James Campos <james.r.campos@gmail.com>
// @license        MIT; http://en.wikipedia.org/wiki/Mit_license
// @include        http://boards.4chan.org/*
// @include        http://sys.4chan.org/*
// @updateURL      http://userscripts.org/scripts/source/51412.meta.js
// ==/UserScript==

/* LICENSE
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* HACKING
 *
 * 4chan x is written in CoffeeScript[1], and developed on github[2].
 *
 * [1]: http://jashkenas.github.com/coffee-script/
 * [2]: http://github.com/aeosynth/4chan-x
 */

/* CONTRIBUTORS
 *
 * Zixaphir - fix qr textarea - captcha-image gap
 * Mayhem - various features / fixes
 * Ongpot - sfw favicon
 * thisisanon - nsfw + 404 favicons
 * Anonymous - empty favicon
 * Seiba - chrome quick reply focusing
 * herpaderpderp - recaptcha fixes
 * wakimoko - recaptcha tab order http://userscripts.org/scripts/show/82657
 * All the people who've taken the time to write bug reports.
 *
 * Thank you.
 */

(function() {
  var $, $$, Favicon, NAMESPACE, Recaptcha, anonymize, config, d, expandComment, expandThread, g, imageHover, imgExpand, imgGif, imgPreloading, keybinds, localize, log, main, nav, nodeInserted, options, qr, quoteBacklink, quoteInline, quoteOP, quotePreview, redirect, replyHiding, reportButton, sauce, threadHiding, threadStats, threading, titlePost, ui, unread, updater, watcher, _config, _ref;
  var __slice = Array.prototype.slice;
  if (typeof console !== "undefined" && console !== null) {
    log = function(arg) {
      return console.log(arg);
    };
  }
  config = {
    main: {
      monitor: {
        'Thread Updater': [true, 'Update threads'],
        'Unread Count': [true, 'Show unread post count in tab title'],
        'Post in Title': [true, 'Show the op\'s post in the tab title'],
        'Thread Stats': [true, 'Display reply and image count'],
        'Thread Watcher': [true, 'Bookmark threads'],
        'Auto Watch': [true, 'Automatically watch threads that you start'],
        'Auto Watch Reply': [false, 'Automatically watch threads that you reply to']
      },
      img: {
        'Image Auto-Gif': [false, 'Animate gif thumbnails'],
        'Image Expansion': [true, 'Expand images'],
        'Image Hover': [false, 'Show full image on mouseover'],
        'Image Preloading': [false, 'Preload Images'],
        'Sauce': [true, 'Add sauce to images']
      },
      post: {
        'Cooldown': [true, 'Prevent \'flood detected\' errors'],
        'Quick Reply': [true, 'Reply without leaving the page'],
        'Persistent QR': [false, 'Quick reply won\'t disappear after posting. Only in replies.']
      },
      quote: {
        'Quote Backlinks': [true, 'Add quote backlinks'],
        'OP Backlinks': [false, 'Add backlinks to the OP'],
        'Quote Highlighting': [true, 'Highlight the previewed post'],
        'Quote Inline': [true, 'Show quoted post inline on quote click'],
        'Quote Preview': [true, 'Show quote content on hover'],
        'Indicate OP quote': [true, 'Add \'(OP)\' to OP quotes']
      },
      hide: {
        'Reply Hiding': [true, 'Hide single replies'],
        'Thread Hiding': [true, 'Hide entire threads'],
        'Show Stubs': [true, 'Of hidden threads / replies']
      },
      misc: {
        '404 Redirect': [true, 'Redirect dead threads'],
        'Anonymize': [false, 'Make everybody anonymous'],
        'Keybinds': [false, 'Binds actions to keys'],
        'Localize Time': [true, 'Show times based on your timezone'],
        'Localized am/pm': [false, 'Change localized time to the 12-hour clock convention'],
        'Report Button': [true, 'Add report buttons'],
        'Comment Expansion': [true, 'Expand too long comments'],
        'Thread Expansion': [true, 'View all replies'],
        'Thread Navigation': [true, 'Navigate to previous / next thread']
      },
      textarea: {
        flavors: ['http://regex.info/exif.cgi?url=', 'http://iqdb.org/?url=', 'http://tineye.com/search?url=', '#http://saucenao.com/search.php?db=999&url='].join('\n')
      }
    },
    updater: {
      checkbox: {
        'Verbose': [true, 'Show countdown timer, new post count'],
        'Auto Update': [false, 'Automatically fetch new posts']
      },
      'Interval': 30
    }
  };
  _config = {};
  (function(parent, obj) {
    var key, val, _results;
    if (obj.length) {
      if (typeof obj[0] === 'boolean') {
        return _config[parent] = obj[0];
      } else {
        return _config[parent] = obj;
      }
    } else if (typeof obj === 'object') {
      _results = [];
      for (key in obj) {
        val = obj[key];
        _results.push(arguments.callee(key, val));
      }
      return _results;
    } else {
      return _config[parent] = obj;
    }
  })(null, config);
  ui = {
    dialog: function(id, position, html) {
      var el, left, top, _ref, _ref2, _ref3;
      el = document.createElement('div');
      el.className = 'reply dialog';
      el.innerHTML = html;
      el.id = id;
      left = position.left, top = position.top;
      left = (_ref = localStorage["" + id + "Left"]) != null ? _ref : left;
      top = (_ref2 = localStorage["" + id + "Top"]) != null ? _ref2 : top;
      if (left) {
        el.style.left = left;
      } else {
        el.style.right = '0px';
      }
      if (top) {
        el.style.top = top;
      } else {
        el.style.bottom = '0px';
      }
      el.querySelector('div.move').addEventListener('mousedown', ui.dragstart, false);
      if ((_ref3 = el.querySelector('div.move a[name=close]')) != null) {
        _ref3.addEventListener('click', (function() {
          return el.parentNode.removeChild(el);
        }), true);
      }
      return el;
    },
    dragstart: function(e) {
      var d, el, rect;
      e.preventDefault();
      ui.el = el = this.parentNode;
      d = document;
      d.addEventListener('mousemove', ui.drag, true);
      d.addEventListener('mouseup', ui.dragend, true);
      rect = el.getBoundingClientRect();
      ui.dx = e.clientX - rect.left;
      ui.dy = e.clientY - rect.top;
      ui.width = document.body.clientWidth - el.offsetWidth;
      return ui.height = document.body.clientHeight - el.offsetHeight;
    },
    drag: function(e) {
      var bottom, el, left, right, top;
      e.preventDefault();
      el = ui.el;
      left = e.clientX - ui.dx;
      if (left < 10) {
        left = '0px';
      } else if (ui.width - left < 10) {
        left = '';
      }
      right = left ? '' : '0px';
      el.style.left = left;
      el.style.right = right;
      top = e.clientY - ui.dy;
      if (top < 10) {
        top = '0px';
      } else if (ui.height - top < 10) {
        top = '';
      }
      bottom = top ? '' : '0px';
      el.style.top = top;
      return el.style.bottom = bottom;
    },
    dragend: function() {
      var d, el, id;
      el = ui.el;
      id = el.id;
      localStorage["" + id + "Left"] = el.style.left;
      localStorage["" + id + "Top"] = el.style.top;
      d = document;
      d.removeEventListener('mousemove', ui.drag, true);
      return d.removeEventListener('mouseup', ui.dragend, true);
    },
    hover: function(e) {
      var bot, clientHeight, clientWidth, clientX, clientY, el, height, top, _ref;
      clientX = e.clientX, clientY = e.clientY;
      el = ui.el;
      _ref = d.body, clientHeight = _ref.clientHeight, clientWidth = _ref.clientWidth;
      height = el.offsetHeight;
      top = clientY - 120;
      bot = top + height;
      el.style.top = clientHeight < height || top < 0 ? '0px' : bot > clientHeight ? clientHeight - height + 'px' : top + 'px';
      if (clientX < clientWidth - 400) {
        el.style.left = clientX + 45 + 'px';
        return el.style.right = '';
      } else {
        el.style.left = '';
        return el.style.right = clientWidth - clientX + 45 + 'px';
      }
    },
    hoverend: function(e) {
      ui.el.style.top = 'auto';
      return $.hide(ui.el);
    }
  };
  d = document;
  g = null;
  $ = function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return root.querySelector(selector);
  };
  $.extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  };
  $.extend($, {
    globalEval: function(code) {
      var script;
      script = $.el('script', {
        textContent: "(" + code + ")()"
      });
      $.append(d.head, script);
      return $.rm(script);
    },
    get: function(url, cb) {
      var r;
      r = new XMLHttpRequest();
      r.onload = cb;
      r.open('get', url, true);
      r.send();
      return r;
    },
    cache: function(url, cb) {
      var req;
      if (req = $.cache.requests[url]) {
        if (req.readyState === 4) {
          return cb.call(req);
        } else {
          return req.callbacks.push(cb);
        }
      } else {
        req = $.get(url, (function() {
          var cb, _i, _len, _ref, _results;
          _ref = this.callbacks;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cb = _ref[_i];
            _results.push(cb.call(this));
          }
          return _results;
        }));
        req.callbacks = [cb];
        return $.cache.requests[url] = req;
      }
    },
    cb: {
      checked: function() {
        return $.setValue(this.name, this.checked);
      },
      value: function() {
        return $.setValue(this.name, this.value);
      }
    },
    addStyle: function(css) {
      var style;
      style = document.createElement('style');
      style.type = 'text/css';
      style.textContent = css;
      return $.append(d.head, style);
    },
    config: function(name) {
      return $.getValue(name, _config[name]);
    },
    zeroPad: function(n) {
      if (n < 10) {
        return '0' + n;
      } else {
        return n;
      }
    },
    x: function(path, root) {
      if (root == null) {
        root = d.body;
      }
      return d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
    },
    tn: function(s) {
      return d.createTextNode(s);
    },
    replace: function(root, el) {
      return root.parentNode.replaceChild(el, root);
    },
    hide: function(el) {
      return el.style.display = 'none';
    },
    show: function(el) {
      return el.style.display = '';
    },
    addClass: function(el, className) {
      return el.className += ' ' + className;
    },
    removeClass: function(el, className) {
      return el.className = el.className.replace(' ' + className, '');
    },
    rm: function(el) {
      return el.parentNode.removeChild(el);
    },
    append: function() {
      var child, children, parent, _i, _len, _results;
      parent = arguments[0], children = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _results = [];
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        _results.push(parent.appendChild(child));
      }
      return _results;
    },
    prepend: function(parent, child) {
      return parent.insertBefore(child, parent.firstChild);
    },
    after: function(root, el) {
      return root.parentNode.insertBefore(el, root.nextSibling);
    },
    before: function(root, el) {
      return root.parentNode.insertBefore(el, root);
    },
    el: function(tag, properties) {
      var el;
      el = d.createElement(tag);
      if (properties) {
        $.extend(el, properties);
      }
      return el;
    },
    bind: function(el, eventType, handler) {
      return el.addEventListener(eventType, handler, true);
    },
    unbind: function(el, eventType, handler) {
      return el.removeEventListener(eventType, handler, true);
    },
    isDST: function() {
      /*
             http://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States
             Since 2007, daylight saving time starts on the second Sunday of March
             and ends on the first Sunday of November, with all time changes taking
             place at 2:00 AM (0200) local time.
          */      var date, month, sunday;
      date = new Date();
      month = date.getMonth();
      if (month < 2 || 10 < month) {
        return false;
      }
      if ((2 < month && month < 10)) {
        return true;
      }
      sunday = date.getDate() - date.getDay();
      if (month === 2) {
        if (sunday < 8) {
          return false;
        }
        if (sunday < 15 && date.getDay() === 0) {
          if (date.getHour() < 1) {
            return false;
          }
          return true;
        }
        return true;
      }
      if (month === 10) {
        if (sunday < 1) {
          return true;
        }
        if (sunday < 8 && date.getDay() === 0) {
          if (date.getHour() < 1) {
            return true;
          }
          return false;
        }
        return false;
      }
    }
  });
  $.cache.requests = {};
  if (typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null) {
    $.extend($, {
      deleteValue: function(name) {
        name = NAMESPACE + name;
        return GM_deleteValue(name);
      },
      getValue: function(name, defaultValue) {
        var value;
        name = NAMESPACE + name;
        if (value = GM_getValue(name)) {
          return JSON.parse(value);
        } else {
          return defaultValue;
        }
      },
      openInTab: function(url) {
        return GM_openInTab(url);
      },
      setValue: function(name, value) {
        name = NAMESPACE + name;
        return GM_setValue(name, JSON.stringify(value));
      }
    });
  } else {
    $.extend($, {
      deleteValue: function(name) {
        name = NAMESPACE + name;
        return delete localStorage[name];
      },
      getValue: function(name, defaultValue) {
        var value;
        name = NAMESPACE + name;
        if (value = localStorage[name]) {
          return JSON.parse(value);
        } else {
          return defaultValue;
        }
      },
      openInTab: function(url) {
        return window.open(url, "_blank");
      },
      setValue: function(name, value) {
        name = NAMESPACE + name;
        return localStorage[name] = JSON.stringify(value);
      }
    });
  }
  if (!Object.keys) {
    Object.keys = function(o) {
      var key, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = o.length; _i < _len; _i++) {
        key = o[_i];
        _results.push(key);
      }
      return _results;
    };
  }
  if (!d.head) {
    d.head = $('head', d);
  }
  $$ = function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  };
  expandComment = {
    init: function() {
      var a, _i, _len, _ref, _results;
      _ref = $$('span.abbr a');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        _results.push($.bind(a, 'click', expandComment.expand));
      }
      return _results;
    },
    expand: function(e) {
      var a, replyID, threadID, _, _ref;
      e.preventDefault();
      _ref = this.href.match(/(\d+)#(\d+)/), _ = _ref[0], threadID = _ref[1], replyID = _ref[2];
      this.textContent = "Loading " + replyID + "...";
      threadID = this.pathname.split('/').pop() || $.x('ancestor::div[@class="thread"]/div', this).id;
      a = this;
      return $.cache(this.pathname, (function() {
        return expandComment.parse(this, a, threadID, replyID);
      }));
    },
    parse: function(req, a, threadID, replyID) {
      var body, bq, reply, _i, _len, _ref;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      body = $.el('body', {
        innerHTML: req.responseText
      });
      if (threadID === replyID) {
        bq = $('blockquote', body);
      } else {
        _ref = $$('td[id]', body);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          reply = _ref[_i];
          if (reply.id === replyID) {
            bq = $('blockquote', reply);
            break;
          }
        }
      }
      return $.replace(a.parentNode.parentNode, bq);
    }
  };
  expandThread = {
    init: function() {
      var a, span, _i, _len, _ref, _results;
      _ref = $$('span.omittedposts');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        span = _ref[_i];
        a = $.el('a', {
          textContent: "+ " + span.textContent,
          className: 'omittedposts'
        });
        $.bind(a, 'click', expandThread.cb.toggle);
        _results.push($.replace(span, a));
      }
      return _results;
    },
    cb: {
      toggle: function(e) {
        var thread;
        thread = this.parentNode;
        return expandThread.toggle(thread);
      }
    },
    toggle: function(thread) {
      var a, num, pathname, prev, table, threadID, _results;
      threadID = thread.firstChild.id;
      pathname = "/" + g.BOARD + "/res/" + threadID;
      a = $('a.omittedposts', thread);
      switch (a.textContent[0]) {
        case '+':
          a.textContent = a.textContent.replace('+', 'X Loading...');
          return $.cache(pathname, (function() {
            return expandThread.parse(this, pathname, thread, a);
          }));
        case 'X':
          a.textContent = a.textContent.replace('X Loading...', '+');
          return $.cache[pathname].abort();
        case '-':
          a.textContent = a.textContent.replace('-', '+');
          num = g.BOARD === 'b' ? 3 : 5;
          table = $.x("following::br[@clear][1]/preceding::table[" + num + "]", a);
          _results = [];
          while ((prev = table.previousSibling) && (prev.nodeName === 'TABLE')) {
            _results.push($.rm(prev));
          }
          return _results;
      }
    },
    parse: function(req, pathname, thread, a) {
      var body, br, next, quote, table, tables, _i, _j, _len, _len2, _ref, _results;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        $.unbind(a, 'click', expandThread.cb.toggle);
        return;
      }
      a.textContent = a.textContent.replace('X Loading...', '-');
      while ((next = a.nextSibling) && !next.clear) {
        $.rm(next);
      }
      br = next;
      body = $.el('body', {
        innerHTML: req.responseText
      });
      _ref = $$('a.quotelink', body);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.getAttribute('href') === quote.hash) {
          quote.pathname = pathname;
        }
      }
      tables = $$('form[name=delform] table', body);
      tables.pop();
      _results = [];
      for (_j = 0, _len2 = tables.length; _j < _len2; _j++) {
        table = tables[_j];
        _results.push($.before(br, table));
      }
      return _results;
    }
  };
  replyHiding = {
    init: function() {
      return g.callbacks.push(replyHiding.cb.node);
    },
    cb: {
      hide: function(e) {
        var reply;
        reply = this.parentNode.nextSibling;
        return replyHiding.hide(reply);
      },
      node: function(root) {
        var a, dd, id, reply;
        if (!(dd = $('td.doubledash', root))) {
          return;
        }
        dd.className = 'replyhider';
        a = $.el('a', {
          textContent: '[ - ]'
        });
        $.bind(a, 'click', replyHiding.cb.hide);
        $.replace(dd.firstChild, a);
        reply = dd.nextSibling;
        id = reply.id;
        if (id in g.hiddenReplies) {
          return replyHiding.hide(reply);
        }
      },
      show: function(e) {
        var div, table;
        div = this.parentNode;
        table = div.nextSibling;
        replyHiding.show(table);
        return $.rm(div);
      }
    },
    hide: function(reply) {
      var a, div, id, name, table, trip, _ref;
      table = reply.parentNode.parentNode.parentNode;
      $.hide(table);
      if ($.config('Show Stubs')) {
        name = $('span.commentpostername', reply).textContent;
        trip = ((_ref = $('span.postertrip', reply)) != null ? _ref.textContent : void 0) || '';
        a = $.el('a', {
          textContent: "[ + ] " + name + " " + trip
        });
        $.bind(a, 'click', replyHiding.cb.show);
        div = $.el('div');
        $.append(div, a);
        $.before(table, div);
      }
      id = reply.id;
      g.hiddenReplies[id] = Date.now();
      return $.setValue("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
    },
    show: function(table) {
      var id;
      $.show(table);
      id = $('td[id]', table).id;
      delete g.hiddenReplies[id];
      return $.setValue("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
    }
  };
  keybinds = {
    init: function() {
      $.bind(d, 'keydown', keybinds.cb.keydown);
      return $.bind(d, 'keypress', keybinds.cb.keypress);
    },
    cb: {
      keydown: function(e) {
        var kc, key, _ref;
        if ((_ref = d.activeElement.nodeName) === 'TEXTAREA' || _ref === 'INPUT') {
          keybinds.mode = keybinds.insert;
        } else {
          keybinds.mode = keybinds.normal;
        }
        kc = e.keyCode;
        if ((65 <= kc && kc <= 90)) {
          key = String.fromCharCode(kc);
          if (!e.shiftKey) {
            key = key.toLowerCase();
          }
          if (e.ctrlKey) {
            key = '^' + key;
          }
        } else {
          if (kc === 27) {
            key = '<Esc>';
          } else if ((48 <= kc && kc <= 57)) {
            key = String.fromCharCode(kc);
          }
        }
        return keybinds.key = key;
      },
      keypress: function(e) {
        return keybinds.mode(e);
      }
    },
    insert: function(e) {
      var range, selEnd, selStart, ta, valEnd, valMid, valStart, value;
      switch (keybinds.key) {
        case '<Esc>':
          e.preventDefault();
          return $.rm($('#qr'));
        case '^s':
          ta = d.activeElement;
          if (ta.nodeName !== 'TEXTAREA') {
            return;
          }
          e.preventDefault();
          value = ta.value;
          selStart = ta.selectionStart;
          selEnd = ta.selectionEnd;
          valStart = value.slice(0, selStart) + '[spoiler]';
          valMid = value.slice(selStart, selEnd);
          valEnd = '[/spoiler]' + value.slice(selEnd);
          ta.value = valStart + valMid + valEnd;
          range = valStart.length + valMid.length;
          return ta.setSelectionRange(range, range);
      }
    },
    normal: function(e) {
      var thread;
      thread = nav.getThread();
      switch (keybinds.key) {
        case '0':
          return window.location = "/" + g.BOARD + "/#0";
        case 'I':
          return keybinds.qr(thread);
        case 'J':
          return keybinds.hl.next(thread);
        case 'K':
          return keybinds.hl.prev(thread);
        case 'M':
          return keybinds.img(thread, true);
        case 'O':
          return keybinds.open(thread);
        case 'e':
          return expandThread.toggle(thread);
        case 'i':
          return keybinds.qr(thread, true);
        case 'm':
          return keybinds.img(thread);
        case 'n':
          return nav.next();
        case 'o':
          return keybinds.open(thread, true);
        case 'p':
          return nav.prev();
        case 'u':
          return updater.update();
        case 'w':
          return watcher.toggle(thread);
        case 'x':
          return threadHiding.toggle(thread);
      }
    },
    img: function(thread, all) {
      var root, thumb;
      if (all) {
        return $("#imageExpand").click();
      } else {
        root = $('td.replyhl', thread) || thread;
        thumb = $('img[md5]', root);
        return imgExpand.toggle(thumb.parentNode);
      }
    },
    qr: function(thread, quote) {
      var qrLink;
      if (!(qrLink = $('td.replyhl span[id] a:not(:first-child)', thread))) {
        qrLink = $("span[id^=nothread] a:not(:first-child)", thread);
      }
      if (quote) {
        return qr.quote(qrLink);
      } else {
        if (!$('#qr')) {
          qr.dialog(qrLink);
        }
        return $('#qr textarea').focus();
      }
    },
    open: function(thread, tab) {
      var id, url;
      id = thread.firstChild.id;
      url = "http://boards.4chan.org/" + g.BOARD + "/res/" + id;
      if (tab) {
        return $.openInTab(url);
      } else {
        return location.href = url;
      }
    },
    hl: {
      next: function(thread) {
        var next, rect, replies, reply, td, top, _i, _len;
        if (td = $('td.replyhl', thread)) {
          td.className = 'reply';
          rect = td.getBoundingClientRect();
          if (rect.top > 0 && rect.bottom < d.body.clientHeight) {
            next = $.x('following::td[@class="reply"]', td);
            rect = next.getBoundingClientRect();
            if (rect.top > 0 && rect.bottom < d.body.clientHeight) {
              next.className = 'replyhl';
            }
            return;
          }
        }
        replies = $$('td.reply', thread);
        for (_i = 0, _len = replies.length; _i < _len; _i++) {
          reply = replies[_i];
          top = reply.getBoundingClientRect().top;
          if (top > 0) {
            reply.className = 'replyhl';
            return;
          }
        }
      },
      prev: function(thread) {
        var bot, height, prev, rect, replies, reply, td, _i, _len;
        if (td = $('td.replyhl', thread)) {
          td.className = 'reply';
          rect = td.getBoundingClientRect();
          if (rect.top > 0 && rect.bottom < d.body.clientHeight) {
            prev = $.x('preceding::td[@class="reply"][1]', td);
            rect = prev.getBoundingClientRect();
            if (rect.top > 0 && rect.bottom < d.body.clientHeight) {
              prev.className = 'replyhl';
            }
            return;
          }
        }
        replies = $$('td.reply', thread);
        replies.reverse();
        height = d.body.clientHeight;
        for (_i = 0, _len = replies.length; _i < _len; _i++) {
          reply = replies[_i];
          bot = reply.getBoundingClientRect().bottom;
          if (bot < height) {
            reply.className = 'replyhl';
            return;
          }
        }
      }
    }
  };
  nav = {
    init: function() {
      var next, prev, span;
      span = $.el('span', {
        id: 'navlinks'
      });
      prev = $.el('a', {
        textContent: '▲'
      });
      next = $.el('a', {
        textContent: '▼'
      });
      $.bind(prev, 'click', nav.prev);
      $.bind(next, 'click', nav.next);
      $.append(span, prev, $.tn(' '), next);
      return $.append(d.body, span);
    },
    prev: function() {
      return nav.scroll(-1);
    },
    next: function() {
      return nav.scroll(+1);
    },
    threads: [],
    getThread: function(full) {
      var bottom, i, rect, thread, _len, _ref;
      nav.threads = $$('div.thread:not([style])');
      _ref = nav.threads;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        thread = _ref[i];
        rect = thread.getBoundingClientRect();
        bottom = rect.bottom;
        if (bottom > 0) {
          if (full) {
            return [thread, i, rect];
          }
          return thread;
        }
      }
      return null;
    },
    scroll: function(delta) {
      var i, rect, thread, top, _ref;
      _ref = nav.getThread(true), thread = _ref[0], i = _ref[1], rect = _ref[2];
      top = rect.top;
      if (!((delta === -1 && Math.ceil(top) < 0) || (delta === +1 && top > 1))) {
        i += delta;
      }
      if (i === -1) {
        if (g.PAGENUM === 0) {
          window.scrollTo(0, 0);
        } else {
          window.location = "" + (g.PAGENUM - 1) + "#0";
        }
        return;
      }
      if (delta === +1) {
        if (i === nav.threads.length || (innerHeight + pageYOffset === d.body.scrollHeight)) {
          if ($('table.pages input[value="Next"]')) {
            window.location = "" + (g.PAGENUM + 1) + "#0";
            return;
          }
        }
      }
      top = nav.threads[i].getBoundingClientRect().top;
      return window.scrollBy(0, top);
    }
  };
  options = {
    init: function() {
      var a, home;
      home = $('#navtopr a');
      a = $.el('a', {
        textContent: '4chan X'
      });
      $.bind(a, 'click', options.toggle);
      $.replace(home, a);
      home = $('#navbotr a');
      a = $.el('a', {
        textContent: '4chan X'
      });
      $.bind(a, 'click', options.toggle);
      return $.replace(home, a);
    },
    toggle: function() {
      var dialog;
      if (dialog = $('#options')) {
        return $.rm(dialog);
      } else {
        return options.dialog();
      }
    },
    dialog: function() {
      var dialog, hiddenNum, hiddenThreads, html, input, _i, _len, _ref;
      hiddenThreads = $.getValue("hiddenThreads/" + g.BOARD + "/", {});
      hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length;
      html = "      <div class=move>Options <a name=close>X</a></div>      <hr>      <div class=column><ul id=monitor><li>Monitoring</li></ul><ul id=img><li>Imaging</li></ul></div>      <div class=column><ul id=post><li>Posting</li></ul><ul id=quote><li>Quoting</li></ul><ul id=hide><li>Hiding</li></ul></div>      <div class=column><ul id=misc><li>Enhancing</li></ul></div>      <br clear=left>      <hr>      <div id=floaty>        <div><input type=button value='hidden: " + hiddenNum + "'></div>        <div><a name=flavors>Sauce flavors</a></div>      </div>      <div id=credits>        <div><a href=https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2DBVZBUAM4DHC&lc=US&item_name=Aeosynth&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted><img alt=Donate src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAaCAYAAAA67jspAAAEsUlEQVRo3u2a/W9TVRjH9yf0T+hPRhONMzNm2gB1S8SOIBshKpCwDsWXDdYSYGQbWwtMBBnddC8yda2L8mKDbWQbyuJW2ND5tg7IIFk2OlARNKaLmhj9wft4nudwTntv77p1PeGn2+ST7Xk5z3Pv95x7etvbgoIlvKCnCCwWpyDfFxUa3QYwewrgzxsA//1jYcbfdwFunQX42rM84UnoS9UA81MA/yYtcuGvOYAJ39KFJ7FvRtis3bbIh7uji4tOYv/Yz7aPGQsV/Da+sOgk9uRBto1ctVDJT/3mokPkMTYjYwC/f2OhmqF1kLG6tdGtoP16QRnBj4NQUPSKDnvZTvAFOiCZGFLaK1ewPx7ffesZ9+tXOZx5BLSxl0G7M6QM74GjUmSnu5GwrawhX3mNX2mvXIh/FeYTf6z9/vWdaALUOLV3n3WA9uV60G6eBu2XASU43Q0k7sj5D6UvcTksRY9fOpExBnOR5Ew0a22MYx7WM4tnq1Ne00z9I5EPTGumH68yLlaC1r+Cr3LaTgZLQRtaC9r4dtB+jipBbCPJ6bDO791/iPyB7jbpC/Z1yokQYJ5ZPV/rUV1u5MzxrHXQJ+LGmLtuP/mNNe0uDyTiJ9VocaWFa8s0Tgn++bMpfqgH7VY4L+IXeuWBG2O+tw5z4dhftIOhdrJtK6vp/0i4Cwo37OJiMTu9HoIxzHHv8ZPtrNxLOcnrJ2UdjAe6WqWN8cT3feD1taQmjvXHuiIP644M9si65dWNeeugTb/LxH5Oapu2wkv0jFaBdiPEtpgTyyLQeYSvoN3NGTGv7wBf4SwHbburlm89g10yJxJ+m5/06w1kB0PH7k1gLSSv9el8Zj2QeKxHiit82IMmaUud9OGEoC/xXS/ZWN84bllMNGToKgUH3F+MnGOXwLdshU6zS3KuLyfcu/dxUTvezIjZXTv4Hh7rJriQO3Q5IwPv3BNmj66e70jLgj2SU73kE/UFogaC42m78vnJFv1FnkAKnuN5a7PvsTuSRoAvysw1lYJ/Vpyd82sAxtmlOdkE2tWWRSms2M5XbXifzh9o3csFXl1NNsbpZDfXmua5PTsXrGf0YQ26KrZ5yOc7yIXz1u+SY7AebVXd9br+eDyYb2Qp54qgNhB7YXEdpeCfPgoQLVKGWCHCnj/1BLTVu6Q/1u4k/1zoSX7CpW7KEbk2x0u6PGM9M5/Rdq7fSHbI/4z0YR/0TR5fkdFf5GAserhUqR4EaiwFDz9I94kqiAUcGR940gk1l+jynRUv8jetss3g97rAXlLJV3dVha4exo090n1iXPnGDYScXJYrcuQd0GtrIXpoFflELh4H+m2OrXxSuoqVaUKEH0p9+JGiKyD6hoMd/PMZ+D2rYe79woz8+Y8eBu+ra8D2FD9Re8kWyjXWa6srzeqLtRbTWKyD4xHMmex8XOagT/QJNa2S/d3uddJvHKMM3SdNFPyTB9Q3seCgtsYvsEh0vHWxUI/pt4Uo+MDTABerLFSCmmb9TnxkE8CE30IFqOWSnvrgg+PpoEU+oIY5Pdc8x+4UZk8D3B62yAXUDLVb9tP7YXZZTHUA3BkD+GPGwgzUBjUa3qTw9ykWSn4I9D+H+C08gjS7eAAAAABJRU5ErkJggg==></a></div>        <div><a href=http://chat.now.im/x/aeos>support throd</a> | <a href=https://github.com/aeosynth/4chan-x/issues>github</a> | <a href=http://userscripts.org/scripts/show/51412>uso</a></div>      </div>      <div><textarea style='display: none;' name=flavors>" + ($.config('flavors')) + "</textarea></div>    ";
      dialog = ui.dialog('options', {
        top: '25%',
        left: '25%'
      }, html);
      options.append(config.main.monitor, $('#monitor', dialog));
      options.append(config.main.img, $('#img', dialog));
      options.append(config.main.post, $('#post', dialog));
      options.append(config.main.quote, $('#quote', dialog));
      options.append(config.main.hide, $('#hide', dialog));
      options.append(config.main.misc, $('#misc', dialog));
      _ref = $$('input[type=checkbox]', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        $.bind(input, 'click', $.cb.checked);
      }
      $.bind($('input[type=button]', dialog), 'click', options.cb.clearHidden);
      $.bind($('a[name=flavors]', dialog), 'click', options.flavors);
      $.bind($('textarea', dialog), 'change', $.cb.value);
      return $.append(d.body, dialog);
    },
    append: function(conf, id) {
      var checked, li, name, title, _results;
      _results = [];
      for (name in conf) {
        title = conf[name][1];
        checked = $.config(name) ? "checked" : "";
        li = $.el('li', {
          innerHTML: "<label title=\"" + title + "\"><input name='" + name + "' " + checked + " type=checkbox>" + name + "</label>"
        });
        _results.push($.append(id, li));
      }
      return _results;
    },
    flavors: function() {
      var ta;
      ta = $('#options textarea');
      if (ta.style.display) {
        return $.show(ta);
      } else {
        return $.hide(ta);
      }
    },
    cb: {
      clearHidden: function(e) {
        $.deleteValue("hiddenReplies/" + g.BOARD + "/");
        $.deleteValue("hiddenThreads/" + g.BOARD + "/");
        this.value = "hidden: 0";
        return g.hiddenReplies = {};
      }
    }
  };
  qr = {
    init: function() {
      var iframe;
      g.callbacks.push(qr.cb.node);
      iframe = $.el('iframe', {
        name: 'iframe'
      });
      $.append(d.body, iframe);
      $.bind(window, 'message', qr.cb.message);
      return $('#recaptcha_response_field').id = '';
    },
    autohide: {
      set: function() {
        var _ref;
        return (_ref = $('#qr input[title=autohide]:not(:checked)')) != null ? _ref.click() : void 0;
      },
      unset: function() {
        var _ref;
        return (_ref = $('#qr input[title=autohide]:checked')) != null ? _ref.click() : void 0;
      }
    },
    cb: {
      autohide: function(e) {
        var dialog;
        dialog = $('#qr');
        if (this.checked) {
          return $.addClass(dialog, 'auto');
        } else {
          return $.removeClass(dialog, 'auto');
        }
      },
      message: function(e) {
        var data, dialog;
        data = e.data;
        dialog = $('#qr');
        if (data) {
          $('#error').textContent = data;
          qr.autohide.unset();
        } else {
          if (dialog) {
            if ($.config('Persistent QR')) {
              qr.refresh(dialog);
            } else {
              $.rm(dialog);
            }
          }
          if ($.config('Cooldown')) {
            qr.cooldown(true);
          }
        }
        Recaptcha.reload();
        return $('iframe[name=iframe]').src = 'about:blank';
      },
      node: function(root) {
        var quote;
        quote = $('a.quotejs:not(:first-child)', root);
        return $.bind(quote, 'click', qr.cb.quote);
      },
      submit: function(e) {
        var form, id, isQR, op;
        form = this;
        isQR = form.parentNode.id === 'qr';
        if ($.config('Auto Watch Reply') && $.config('Thread Watcher')) {
          if (g.REPLY && $('img.favicon').src === Favicon.empty) {
            watcher.watch(null, g.THREAD_ID);
          } else {
            id = $('input[name=resto]').value;
            op = d.getElementById(id);
            if ($('img.favicon', op).src === Favicon.empty) {
              watcher.watch(op, id);
            }
          }
        }
        if (isQR) {
          $('#error').textContent = '';
        }
        if ($.config('Cooldown')) {
          if (qr.cooldown()) {
            e.preventDefault();
            if (isQR) {
              $('#error').textContent = 'Stop posting so often!';
            } else {
              alert('Stop posting so often!');
            }
            return;
          }
        }
        qr.sage = $('input[name=email]', form).value === 'sage';
        if (isQR) {
          return qr.autohide.set();
        }
      },
      quote: function(e) {
        e.preventDefault();
        return qr.quote(this);
      }
    },
    quote: function(link) {
      var dialog, id, s, selection, selectionID, ta, text, _ref;
      if (dialog = $('#qr')) {
        qr.autohide.unset();
      } else {
        dialog = qr.dialog(link);
      }
      id = link.textContent;
      text = ">>" + id + "\n";
      selection = window.getSelection();
      if (s = selection.toString()) {
        selectionID = (_ref = $.x('preceding::input[@type="checkbox"][1]', selection.anchorNode)) != null ? _ref.name : void 0;
        if (selectionID === id) {
          text += ">" + s + "\n";
        }
      }
      ta = $('textarea', dialog);
      ta.focus();
      return ta.value += text;
    },
    refresh: function(dialog) {
      var f;
      $('textarea', dialog).value = '';
      $('input[name=recaptcha_response_field]', dialog).value = '';
      f = $('input[type=file]', dialog).parentNode;
      return f.innerHTML = f.innerHTML;
    },
    cooldown: function(restart) {
      var duration, end, now;
      now = Date.now();
      if (restart) {
        duration = qr.sage ? 60 : 30;
        qr.cooldownStart(duration);
        $.setValue("" + g.BOARD + "/cooldown", now + duration * 1000);
        return;
      }
      end = $.getValue("" + g.BOARD + "/cooldown", 0);
      if (now < end) {
        duration = Math.ceil((end - now) / 1000);
        qr.cooldownStart(duration);
        return true;
      }
    },
    cooldownStart: function(duration) {
      var submit, submits, _i, _len;
      submits = $$('#com_submit');
      for (_i = 0, _len = submits.length; _i < _len; _i++) {
        submit = submits[_i];
        submit.value = duration;
        submit.disabled = true;
      }
      qr.cooldownIntervalID = window.setInterval(qr.cooldownCB, 1000);
      return qr.duration = duration;
    },
    cooldownCB: function() {
      var submit, submits, _i, _len;
      qr.duration--;
      submits = $$('#com_submit');
      for (_i = 0, _len = submits.length; _i < _len; _i++) {
        submit = submits[_i];
        if (qr.duration) {
          submit.value = qr.duration;
        } else {
          submit.disabled = false;
          submit.value = 'Submit';
        }
      }
      if (!qr.duration) {
        return window.clearInterval(qr.cooldownIntervalID);
      }
    },
    dialog: function(link) {
      var MAX_FILE_SIZE, THREAD_ID, c, challenge, dialog, html, m, mail, name, pass, spoiler, src, submitDisabled, submitValue;
      MAX_FILE_SIZE = $('input[name="MAX_FILE_SIZE"]').value;
      submitValue = $('#com_submit').value;
      submitDisabled = $('#com_submit').disabled ? 'disabled' : '';
      THREAD_ID = g.THREAD_ID || $.x('ancestor::div[@class="thread"]/div', link).id;
      challenge = $('input[name=recaptcha_challenge_field]').value;
      src = "http://www.google.com/recaptcha/api/image?c=" + challenge;
      c = d.cookie;
      name = (m = c.match(/4chan_name=([^;]+)/)) ? decodeURIComponent(m[1]) : '';
      mail = (m = c.match(/4chan_email=([^;]+)/)) ? decodeURIComponent(m[1]) : '';
      pass = (m = c.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $('input[name=pwd]').value;
      html = "      <div class=move>        <input class=inputtext type=text name=name placeholder=Name form=qr_form value=\"" + name + "\">        Quick Reply        <input type=checkbox id=autohide title=autohide>        <a name=close title=close>X</a>      </div>      <form name=post action=http://sys.4chan.org/" + g.BOARD + "/post method=POST enctype=multipart/form-data target=iframe id=qr_form>        <input type=hidden name=MAX_FILE_SIZE value=" + MAX_FILE_SIZE + ">        <input type=hidden name=resto value=" + THREAD_ID + ">        <input type=hidden name=recaptcha_challenge_field value=" + challenge + ">        <div><input class=inputtext type=text name=email placeholder=E-mail value=\"" + mail + "\"></div>        <div><input class=inputtext type=text name=sub placeholder=Subject><input type=submit value=" + submitValue + " id=com_submit " + submitDisabled + "></div>        <div><textarea class=inputtext name=com placeholder=Comment></textarea></div>        <div><img src=" + src + "></div>        <div><input class=inputtext type=text name=recaptcha_response_field placeholder=Verification required autocomplete=off></div>        <div><input type=file name=upfile></div>        <div><input class=inputtext type=password name=pwd maxlength=8 placeholder=Password value=\"" + pass + "\"><input type=hidden name=mode value=regist></div>      </form>      <div id=error class=error></div>      ";
      dialog = ui.dialog('qr', {
        top: '0px',
        left: '0px'
      }, html);
      $.bind($('input[name=name]', dialog), 'mousedown', function(e) {
        return e.stopPropagation();
      });
      $.bind($('#autohide', dialog), 'click', qr.cb.autohide);
      $.bind($('img', dialog), 'click', Recaptcha.reload);
      if ($('.postarea label')) {
        spoiler = $.el('label', {
          innerHTML: " [<input type=checkbox name=spoiler>Spoiler Image?]"
        });
        $.after($('input[name=email]', dialog), spoiler);
      }
      $.bind($('form', dialog), 'submit', qr.cb.submit);
      $.bind($('input[name=recaptcha_response_field]', dialog), 'keydown', Recaptcha.listener);
      $.append(d.body, dialog);
      return dialog;
    },
    persist: function() {
      $.append(d.body, qr.dialog());
      return qr.autohide.set();
    },
    sys: function() {
      var c, id, recaptcha, thread, _, _ref;
      if (recaptcha = $('#recaptcha_response_field')) {
        $.bind(recaptcha, 'keydown', Recaptcha.listener);
        return;
      }
      /*
            http://code.google.com/p/chromium/issues/detail?id=20773
            Let content scripts see other frames (instead of them being undefined)
      
            To access the parent, we have to break out of the sandbox and evaluate
            in the global context.
          */
      $.globalEval(function() {
        var data, _ref;
        data = ((_ref = document.querySelector('table font b')) != null ? _ref.firstChild.textContent : void 0) || '';
        return parent.postMessage(data, '*');
      });
      c = $('b').lastChild;
      if (c.nodeType === 8) {
        _ref = c.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref[0], thread = _ref[1], id = _ref[2];
        if (thread === '0') {
          return window.location = "http://boards.4chan.org/" + g.BOARD + "/res/" + id + "#watch";
        } else {
          return window.location = "http://boards.4chan.org/" + g.BOARD + "/res/" + thread + "#" + id;
        }
      }
    }
  };
  threading = {
    init: function() {
      var node;
      node = $('form[name=delform] > *:not([id])');
      return threading.thread(node);
    },
    op: function(node) {
      var op;
      op = $.el('div', {
        className: 'op'
      });
      $.before(node, op);
      while (node.nodeName !== 'BLOCKQUOTE') {
        $.append(op, node);
        node = op.nextSibling;
      }
      $.append(op, node);
      op.id = $('input[name]', op).name;
      return op;
    },
    thread: function(node) {
      var div;
      node = threading.op(node);
      if (g.REPLY) {
        return;
      }
      div = $.el('div', {
        className: 'thread'
      });
      $.before(node, div);
      while (node.nodeName !== 'HR') {
        $.append(div, node);
        node = div.nextSibling;
      }
      node = node.nextElementSibling;
      if (!(node.align || node.nodeName === 'CENTER')) {
        return threading.thread(node);
      }
    }
  };
  threadHiding = {
    init: function() {
      var a, hiddenThreads, op, thread, _i, _len, _ref, _results;
      hiddenThreads = $.getValue("hiddenThreads/" + g.BOARD + "/", {});
      _ref = $$('div.thread');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        op = thread.firstChild;
        a = $.el('a', {
          textContent: '[ - ]'
        });
        $.bind(a, 'click', threadHiding.cb.hide);
        $.prepend(op, a);
        _results.push(op.id in hiddenThreads ? threadHiding.hideHide(thread) : void 0);
      }
      return _results;
    },
    cb: {
      hide: function(e) {
        var thread;
        thread = this.parentNode.parentNode;
        return threadHiding.hide(thread);
      },
      show: function(e) {
        var thread;
        thread = this.parentNode.parentNode;
        return threadHiding.show(thread);
      }
    },
    toggle: function(thread) {
      if (thread.className.indexOf('stub') !== -1 || thread.style.display === 'none') {
        return threadHiding.show(thread);
      } else {
        return threadHiding.hide(thread);
      }
    },
    hide: function(thread) {
      var hiddenThreads, id;
      threadHiding.hideHide(thread);
      id = thread.firstChild.id;
      hiddenThreads = $.getValue("hiddenThreads/" + g.BOARD + "/", {});
      hiddenThreads[id] = Date.now();
      return $.setValue("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
    },
    hideHide: function(thread) {
      var a, div, name, num, span, text, trip, _ref;
      if ($.config('Show Stubs')) {
        if (span = $('.omittedposts', thread)) {
          num = Number(span.textContent.match(/\d+/)[0]);
        } else {
          num = 0;
        }
        num += $$('table', thread).length;
        text = num === 1 ? "1 reply" : "" + num + " replies";
        name = $('span.postername', thread).textContent;
        trip = ((_ref = $('span.postername + span.postertrip', thread)) != null ? _ref.textContent : void 0) || '';
        a = $.el('a', {
          textContent: "[ + ] " + name + trip + " (" + text + ")"
        });
        $.bind(a, 'click', threadHiding.cb.show);
        div = $.el('div', {
          className: 'block'
        });
        $.append(div, a);
        $.append(thread, div);
        return $.addClass(thread, 'stub');
      } else {
        $.hide(thread);
        return $.hide(thread.nextSibling);
      }
    },
    show: function(thread) {
      var hiddenThreads, id;
      $.rm($('div.block', thread));
      $.removeClass(thread, 'stub');
      $.show(thread);
      $.show(thread.nextSibling);
      id = thread.firstChild.id;
      hiddenThreads = $.getValue("hiddenThreads/" + g.BOARD + "/", {});
      delete hiddenThreads[id];
      return $.setValue("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
    }
  };
  updater = {
    init: function() {
      var autoUpT, checked, conf, dialog, html, input, interva, name, title, updNow, verbose, _i, _len, _ref;
      html = "<div class=move><span id=count></span> <span id=timer>-" + ($.config('Interval')) + "</span></div>";
      conf = config.updater.checkbox;
      for (name in conf) {
        title = conf[name][1];
        checked = $.config(name) ? "checked" : "";
        html += "<div><label title=\"" + title + "\">" + name + "<input name=\"" + name + "\" " + checked + " type=checkbox></label></div>";
      }
      name = 'Auto Update This';
      title = 'Controls whether *this* thread auotmatically updates or not';
      checked = $.config('Auto Update') ? 'checked' : '';
      html += "<div><label title=\"" + title + "\">" + name + "<input name=\"" + name + "\" " + checked + " type=checkbox></label></div>";
      html += "<div><label>Interval (s)<input name=Interval value=" + ($.config('Interval')) + " type=text></label></div>";
      html += "<div><input value=\"Update Now\" type=button></div>";
      dialog = ui.dialog('updater', {
        bottom: '0px',
        right: '0px'
      }, html);
      _ref = $$('input[type=checkbox]', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        $.bind(input, 'click', $.cb.checked);
      }
      $.bind($('input[type=text]', dialog), 'change', $.cb.value);
      verbose = $('input[name=\"Verbose\"]', dialog);
      autoUpT = $('input[name=\"Auto Update This\"]', dialog);
      interva = $('input[name=\"Interval\"]', dialog);
      updNow = $('input[type=button]', dialog);
      $.bind(verbose, 'click', updater.cb.verbose);
      $.bind(autoUpT, 'click', updater.cb.autoUpdate);
      $.bind(updNow, 'click', updater.updateNow);
      $.append(d.body, dialog);
      updater.cb.verbose.call(verbose);
      return updater.cb.autoUpdate.call(autoUpT);
    },
    cb: {
      verbose: function(e) {
        var count, timer;
        count = $('#count');
        timer = $('#timer');
        if (this.checked) {
          count.textContent = '+0';
          return $.show(timer);
        } else {
          $.extend(count, {
            className: '',
            textContent: 'Thread Updater'
          });
          return $.hide(timer);
        }
      },
      autoUpdate: function(e) {
        if (this.checked) {
          return updater.intervalID = window.setInterval(updater.timeout, 1000);
        } else {
          return window.clearInterval(updater.intervalID);
        }
      },
      update: function(e) {
        var arr, body, br, count, id, input, replies, reply, timer, _i, _len, _ref, _ref2, _results;
        count = $('#count');
        timer = $('#timer');
        if (this.status === 404) {
          count.textContent = 404;
          count.className = 'error';
          timer.textContent = '';
          window.clearInterval(updater.intervalID);
          _ref = $$('input[type=submit]');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            input = _ref[_i];
            input.disabled = true;
            input.value = 404;
          }
          d.title = d.title.match(/.+- /)[0] + 404;
          g.dead = true;
          Favicon.update();
          return;
        }
        br = $('br[clear]');
        id = Number(((_ref2 = $('td[id]', br.previousElementSibling)) != null ? _ref2.id : void 0) || 0);
        arr = [];
        body = $.el('body', {
          innerHTML: this.responseText
        });
        replies = $$('td[id]', body);
        while ((reply = replies.pop()) && (reply.id > id)) {
          arr.push(reply.parentNode.parentNode.parentNode);
        }
        timer.textContent = '-' + $.config('Interval');
        if ($.config('Verbose')) {
          count.textContent = '+' + arr.length;
          if (arr.length === 0) {
            count.className = '';
          } else {
            count.className = 'new';
          }
        }
        _results = [];
        while (reply = arr.pop()) {
          _results.push($.before(br, reply));
        }
        return _results;
      }
    },
    timeout: function() {
      var count, n, timer;
      timer = $('#timer');
      n = Number(timer.textContent);
      n += 1;
      if (n === 10) {
        count = $('#count');
        count.textContent = 'retry';
        count.className = '';
        n = 0;
      }
      timer.textContent = n;
      if (n === 0) {
        return updater.update();
      }
    },
    updateNow: function() {
      $('#timer').textContent = 0;
      return updater.update();
    },
    update: function() {
      var cb, url, _ref;
      if ((_ref = updater.request) != null) {
        _ref.abort();
      }
      url = location.href + '?' + Date.now();
      cb = updater.cb.update;
      return updater.request = $.get(url, cb);
    }
  };
  watcher = {
    init: function() {
      var dialog, favicon, html, input, inputs, _i, _len;
      html = '<div class=move>Thread Watcher</div>';
      dialog = ui.dialog('watcher', {
        top: '50px',
        left: '0px'
      }, html);
      $.append(d.body, dialog);
      inputs = $$('form > input[value=delete], div.thread > input[value=delete]');
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        favicon = $.el('img', {
          className: 'favicon'
        });
        $.bind(favicon, 'click', watcher.cb.toggle);
        $.before(input, favicon);
      }
      watcher.refresh($.getValue('watched', {}));
      return setInterval((function() {
        if (watcher.lastUpdated < $.getValue('watcher.lastUpdated', 0)) {
          return watcher.refresh($.getValue('watched', {}));
        }
      }), 1000);
    },
    refresh: function(watched) {
      var board, dialog, div, favicon, id, link, props, watchedBoard, x, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      dialog = $('#watcher');
      _ref = $$('div:not(.move)', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        div = _ref[_i];
        $.rm(div);
      }
      for (board in watched) {
        _ref2 = watched[board];
        for (id in _ref2) {
          props = _ref2[id];
          div = $.el('div');
          x = $.el('a', {
            textContent: 'X'
          });
          $.bind(x, 'click', watcher.cb.x);
          link = $.el('a', props);
          $.append(div, x, $.tn(' '), link);
          $.append(dialog, div);
        }
      }
      watchedBoard = watched[g.BOARD] || {};
      _ref3 = $$('img.favicon');
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        favicon = _ref3[_j];
        id = favicon.nextSibling.name;
        if (id in watchedBoard) {
          favicon.src = Favicon["default"];
        } else {
          favicon.src = Favicon.empty;
        }
      }
      return watcher.lastUpdated = Date.now();
    },
    cb: {
      toggle: function(e) {
        return watcher.toggle(this.parentNode);
      },
      x: function(e) {
        var board, id, _, _ref;
        _ref = this.nextElementSibling.getAttribute('href').substring(1).split('/'), board = _ref[0], _ = _ref[1], id = _ref[2];
        return watcher.unwatch(board, id);
      }
    },
    toggle: function(thread) {
      var favicon, id;
      favicon = $('img.favicon', thread);
      id = favicon.nextSibling.name;
      if (favicon.src === Favicon.empty) {
        return watcher.watch(thread, id);
      } else {
        return watcher.unwatch(g.BOARD, id);
      }
    },
    unwatch: function(board, id) {
      var watched;
      watched = $.getValue('watched', {});
      delete watched[board][id];
      $.setValue('watched', watched);
      watcher.refresh(watched);
      return $.setValue('watcher.lastUpdated', Date.now());
    },
    watch: function(thread, id) {
      var props, tc, watched, _name;
      tc = $('span.filetitle', thread).textContent || $('blockquote', thread).textContent;
      props = {
        textContent: "/" + g.BOARD + "/ - " + tc.slice(0, 25),
        href: "/" + g.BOARD + "/res/" + id
      };
      watched = $.getValue('watched', {});
      watched[_name = g.BOARD] || (watched[_name] = {});
      watched[g.BOARD][id] = props;
      $.setValue('watched', watched);
      watcher.refresh(watched);
      return $.setValue('watcher.lastUpdated', Date.now());
    }
  };
  anonymize = {
    init: function() {
      return g.callbacks.push(anonymize.cb.node);
    },
    cb: {
      node: function(root) {
        var name, trip;
        name = $('span.commentpostername, span.postername', root);
        name.textContent = 'Anonymous';
        if (trip = $('span.postertrip', root)) {
          if (trip.parentNode.nodeName === 'A') {
            return $.rm(trip.parentNode);
          } else {
            return $.rm(trip);
          }
        }
      }
    }
  };
  sauce = {
    init: function() {
      return g.callbacks.push(sauce.cb.node);
    },
    cb: {
      node: function(root) {
        var i, link, names, prefix, prefixes, s, span, suffix, _len, _results;
        if (root.className === 'inline') {
          return;
        }
        prefixes = (function() {
          var _i, _len, _ref, _results;
          _ref = $.config('flavors').split('\n');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            if (s[0] !== '#') {
              _results.push(s);
            }
          }
          return _results;
        })();
        names = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
            prefix = prefixes[_i];
            _results.push(prefix.match(/(\w+)\./)[1]);
          }
          return _results;
        })();
        if (span = $('span.filesize', root)) {
          suffix = $('a', span).href;
          _results = [];
          for (i = 0, _len = prefixes.length; i < _len; i++) {
            prefix = prefixes[i];
            link = $.el('a', {
              textContent: names[i],
              href: prefix + suffix
            });
            _results.push($.append(span, $.tn(' '), link));
          }
          return _results;
        }
      }
    }
  };
  localize = {
    init: function() {
      return g.callbacks.push(function(root) {
        var date, day, dotw, hour, meridiem, min_sec, month, s, time, year, _, _ref;
        if (root.className === 'inline') {
          return;
        }
        s = $('span[id^=no]', root).previousSibling;
        _ref = s.textContent.match(/(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\S+)/), _ = _ref[0], month = _ref[1], day = _ref[2], year = _ref[3], hour = _ref[4], min_sec = _ref[5];
        year = "20" + year;
        month -= 1;
        hour = g.chanOffset + Number(hour);
        date = new Date(year, month, day, hour);
        year = date.getFullYear() - 2000;
        month = $.zeroPad(date.getMonth() + 1);
        day = $.zeroPad(date.getDate());
        hour = date.getHours();
        meridiem = '';
        if ($.config('Localized am/pm')) {
          meridiem = hour < 12 ? 'AM' : 'PM';
          hour = hour % 12 || 12;
        }
        hour = $.zeroPad(hour);
        dotw = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
        time = $.el('time', {
          textContent: " " + month + "/" + day + "/" + year + "(" + dotw + ")" + hour + ":" + min_sec + meridiem + " "
        });
        return $.replace(s, time);
      });
    }
  };
  titlePost = {
    init: function() {
      var tc;
      if (tc = $('span.filetitle').textContent || $('blockquote').textContent) {
        return d.title = "/" + g.BOARD + "/ - " + tc;
      }
    }
  };
  quoteBacklink = {
    init: function() {
      return g.callbacks.push(quoteBacklink.node);
    },
    node: function(root) {
      var container, el, id, link, opbl, qid, quote, quotes, tid, _i, _len, _ref, _results;
      if (/inline/.test(root.className)) {
        return;
      }
      container = $.el('span', {
        className: 'container'
      });
      $.after($('span[id^=no]', root), container);
      id = root.id || $('td[id]', root).id;
      quotes = {};
      tid = g.THREAD_ID || root.parentNode.firstChild.id;
      opbl = $.config('OP Backlinks');
      _ref = $$('a.quotelink', root);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!(qid = quote.hash.slice(1))) {
          continue;
        }
        if (!opbl && qid === tid) {
          continue;
        }
        quotes[qid] = quote;
      }
      _results = [];
      for (qid in quotes) {
        quote = quotes[qid];
        if (!(el = d.getElementById(qid))) {
          continue;
        }
        link = $.el('a', {
          href: '#' + id,
          className: 'backlink',
          textContent: '>>' + id
        });
        if ($.config('Quote Preview')) {
          $.bind(link, 'mouseover', quotePreview.mouseover);
          $.bind(link, 'mousemove', ui.hover);
          $.bind(link, 'mouseout', ui.hoverend);
          $.bind(link, 'mouseout', quotePreview.mouseout);
        }
        if ($.config('Quote Inline')) {
          $.bind(link, 'click', quoteInline.toggle);
        }
        _results.push($.append($('.container', el), $.tn(' '), link));
      }
      return _results;
    }
  };
  quoteInline = {
    init: function() {
      return g.callbacks.push(quoteInline.node);
    },
    node: function(root) {
      var quote, _i, _len, _ref, _results;
      _ref = $$('a.quotelink, a.backlink', root);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!quote.hash) {
          continue;
        }
        quote.removeAttribute('onclick');
        _results.push($.bind(quote, 'click', quoteInline.toggle));
      }
      return _results;
    },
    toggle: function(e) {
      var el, id, inline, pathname, root, table, threadID;
      e.preventDefault();
      id = this.hash.slice(1);
      root = $.x('ancestor::td[1]', this);
      if (table = $("#i" + id, root)) {
        $.rm(table);
        $.removeClass(this, 'inlined');
        if (this.className === 'backlink') {
          $.show($.x('ancestor::table[1]', d.getElementById(id)));
        }
        return;
      }
      if (el = d.getElementById(id)) {
        inline = quoteInline.table(id, el.innerHTML);
        if (this.className === 'backlink') {
          $.after(this.parentNode, inline);
          $.hide($.x('ancestor::table[1]', el));
        } else {
          $.after(this.parentNode, inline);
        }
      } else {
        inline = $.el('td', {
          className: 'reply inline',
          id: "i" + id,
          innerHTML: "Loading " + id + "..."
        });
        $.after(this.parentNode, inline);
        pathname = this.pathname;
        threadID = pathname.split('/').pop();
        $.cache(pathname, (function() {
          return quoteInline.parse(this, pathname, id, threadID, inline);
        }));
      }
      return $.addClass(this, 'inlined');
    },
    parse: function(req, pathname, id, threadID, inline) {
      var body, html, newInline, op, quote, reply, _i, _j, _len, _len2, _ref, _ref2;
      if (req.status !== 200) {
        inline.innerHTML = "" + req.status + " " + req.statusText;
        return;
      }
      body = $.el('body', {
        innerHTML: req.responseText
      });
      if (id === threadID) {
        op = threading.op($('form[name=delform] > *', body));
        html = op.innerHTML;
      } else {
        _ref = $$('td.reply', body);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          reply = _ref[_i];
          if (reply.id === id) {
            html = reply.innerHTML;
            break;
          }
        }
      }
      newInline = quoteInline.table(id, html);
      _ref2 = $$('a.quotelink', newInline);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        quote = _ref2[_j];
        if (quote.getAttribute('href') === quote.hash) {
          quote.pathname = pathname;
        }
      }
      $.addClass(newInline, 'crossquote');
      return $.replace(inline, newInline);
    },
    table: function(id, html) {
      return $.el('table', {
        className: 'inline',
        id: "i" + id,
        innerHTML: "<tbody><tr><td class=reply>" + html + "</td></tr></tbody>"
      });
    }
  };
  quotePreview = {
    init: function() {
      var preview;
      g.callbacks.push(quotePreview.node);
      preview = $.el('div', {
        id: 'qp',
        className: 'replyhl'
      });
      $.hide(preview);
      return $.append(d.body, preview);
    },
    node: function(root) {
      var quote, _i, _len, _ref, _results;
      _ref = $$('a.quotelink, a.backlink', root);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!quote.hash) {
          continue;
        }
        $.bind(quote, 'mouseover', quotePreview.mouseover);
        $.bind(quote, 'mousemove', ui.hover);
        $.bind(quote, 'mouseout', ui.hoverend);
        _results.push($.bind(quote, 'mouseout', quotePreview.mouseout));
      }
      return _results;
    },
    mouseout: function() {
      var el;
      if (!(el = d.getElementById(this.hash.slice(1)))) {
        return;
      }
      return $.removeClass(el, 'qphl');
    },
    mouseover: function(e) {
      var el, id, qp, quote, replyID, threadID, _i, _len, _ref, _ref2;
      id = this.hash.slice(1);
      qp = $('#qp');
      if (el = d.getElementById(id)) {
        qp.innerHTML = el.innerHTML;
        if ($.config('Quote Hilighting')) {
          $.addClass(el, 'qphl');
        }
        if (this.className === 'backlink') {
          replyID = (_ref = $.x('ancestor::*[@id][1]', this)) != null ? _ref.id.match(/\d+/)[0] : void 0;
          _ref2 = $$('a.quotelink', qp);
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            quote = _ref2[_i];
            if (quote.hash.slice(1) === replyID) {
              quote.className = 'forwardlink';
            }
          }
        }
      } else {
        qp.innerHTML = "Loading " + id + "...";
        threadID = this.pathname.split('/').pop() || $.x('ancestor::div[@class="thread"]/div', this).id;
        $.cache(this.pathname, (function() {
          return quotePreview.parse(this, id, threadID);
        }));
      }
      ui.el = qp;
      return $.show(qp);
    },
    parse: function(req, id, threadID) {
      var body, html, op, qp, reply, _i, _len, _ref;
      qp = $('#qp');
      if (qp.innerHTML !== ("Loading " + id + "...")) {
        return;
      }
      if (req.status !== 200) {
        qp.innerHTML = "" + req.status + " " + req.statusText;
        return;
      }
      body = $.el('body', {
        innerHTML: req.responseText
      });
      if (id === threadID) {
        op = threading.op($('form[name=delform] > *', body));
        html = op.innerHTML;
      } else {
        _ref = $$('td.reply', body);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          reply = _ref[_i];
          if (reply.id === id) {
            html = reply.innerHTML;
            break;
          }
        }
      }
      return qp.innerHTML = html;
    }
  };
  quoteOP = {
    init: function() {
      return g.callbacks.push(quoteOP.node);
    },
    node: function(root) {
      var quote, tid, _i, _len, _ref, _results;
      if (root.className === 'inline') {
        return;
      }
      tid = g.THREAD_ID || $.x('ancestor::div[contains(@class,"thread")]/div', root).id;
      _ref = $$('a.quotelink', root);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        _results.push(quote.hash.slice(1) === tid ? quote.innerHTML += '&nbsp;(OP)' : void 0);
      }
      return _results;
    }
  };
  reportButton = {
    init: function() {
      return g.callbacks.push(reportButton.cb.node);
    },
    cb: {
      node: function(root) {
        var a, span;
        if (!(a = $('a.reportbutton', root))) {
          span = $('span[id^=no]', root);
          a = $.el('a', {
            className: 'reportbutton',
            innerHTML: '[&nbsp;!&nbsp;]'
          });
          $.after(span, a);
          $.after(span, $.tn(' '));
        }
        return $.bind(a, 'click', reportButton.cb.report);
      },
      report: function(e) {
        return reportButton.report(this);
      }
    },
    report: function(target) {
      var input;
      input = $('input', target.parentNode);
      input.click();
      $('input[value="Report"]').click();
      return input.click();
    }
  };
  threadStats = {
    init: function() {
      var dialog, html;
      threadStats.posts = 1;
      threadStats.images = $('.op img[md5]') ? 1 : 0;
      html = "<div class=move><span id=postcount>" + threadStats.posts + "</span> / <span id=imagecount>" + threadStats.images + "</span></div>";
      dialog = ui.dialog('stats', {
        bottom: '0px',
        left: '0px'
      }, html);
      dialog.className = 'dialog';
      $.append(d.body, dialog);
      return g.callbacks.push(threadStats.node);
    },
    node: function(root) {
      if (root.className) {
        return;
      }
      threadStats.posts++;
      if ($('img[md5]', root)) {
        threadStats.images++;
        if (threadStats.images > 150) {
          $('#imagecount').className = 'error';
        }
      }
      $('#postcount').textContent = threadStats.posts;
      return $('#imagecount').textContent = threadStats.images;
    }
  };
  unread = {
    init: function() {
      unread.replies = [];
      d.title = '(0) ' + d.title;
      $.bind(window, 'scroll', unread.cb.scroll);
      return g.callbacks.push(unread.cb.node);
    },
    cb: {
      node: function(root) {
        if (root.className) {
          return;
        }
        unread.replies.push(root);
        unread.updateTitle();
        return Favicon.update();
      },
      scroll: function(e) {
        var bottom, height, i, reply, _len, _ref;
        height = d.body.clientHeight;
        _ref = unread.replies;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          reply = _ref[i];
          bottom = reply.getBoundingClientRect().bottom;
          if (bottom > height) {
            break;
          }
        }
        if (i === 0) {
          return;
        }
        unread.replies = unread.replies.slice(i);
        unread.updateTitle();
        if (unread.replies.length === 0) {
          return Favicon.update();
        }
      }
    },
    updateTitle: function() {
      return d.title = d.title.replace(/\d+/, unread.replies.length);
    }
  };
  Favicon = {
    dead: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAD/AAA9+90tAAAAAXRSTlMAQObYZgAAADtJREFUCB0FwUERxEAIALDszMG730PNSkBEBSECoU0AEPe0mly5NWprRUcDQAdn68qtkVsj3/84z++CD5u7CsnoBJoaAAAAAElFTkSuQmCC',
    deadHalo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVR4XrWSAQoAIAgD/f+njSApsTqjGoTQ5oGWPJMOOs60CzsWwIwz1I4PUIYh+WYEMGQ6I/txw91kP4oA9BdwhKp1My4xQq6e8Q9ANgDJjOErewFiNesV2uGSfGv1/HYAAAAASUVORK5CYII=',
    "default": ((_ref = $('link[rel="shortcut icon"]', d.head)) != null ? _ref.href : void 0) || '',
    empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    haloSFW: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVR4XrWRQQoAIQwD+6L97j7Ih9WTQQxhDqJQCk4Mranuvqod6LgwawSqSuUmWSPw/UNlJlnDAmA2ARjABLYj8ZyCzJHHqOg+GdAKZmKPIQUzuYrxicHqEgHzP9g7M0+hj45sAnRWxtPj3zSPAAAAAElFTkSuQmCC',
    haloNSFW: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABmzDP///8AAABet0i+AAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII=',
    update: function() {
      var clone, favicon, href, l;
      l = unread.replies.length;
      if (g.dead) {
        if (l > 0) {
          href = Favicon.deadHalo;
        } else {
          href = Favicon.dead;
        }
      } else {
        if (l > 0) {
          href = Favicon.halo;
        } else {
          href = Favicon["default"];
        }
      }
      favicon = $('link[rel="shortcut icon"]', d.head);
      clone = favicon.cloneNode(true);
      clone.href = href;
      return $.replace(favicon, clone);
    }
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
      case 'jp':
      case 'm':
      case 'tg':
        url = "http://archive.easymodo.net/cgi-board.pl/" + g.BOARD + "/thread/" + g.THREAD_ID;
        break;
      case '3':
      case 'adv':
      case 'an':
      case 'ck':
      case 'co':
      case 'fa':
      case 'fit':
      case 'int':
      case 'k':
      case 'mu':
      case 'n':
      case 'o':
      case 'p':
      case 'po':
      case 'soc':
      case 'sp':
      case 'toy':
      case 'trv':
      case 'v':
      case 'vp':
      case 'x':
        url = "http://archive.no-ip.org/" + g.BOARD + "/thread/" + g.THREAD_ID;
        break;
      default:
        url = "http://boards.4chan.org/" + g.BOARD;
    }
    return location.href = url;
  };
  Recaptcha = {
    init: function() {
      var el, recaptcha, _i, _len, _ref2;
      _ref2 = $$('#recaptcha_table a');
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        el = _ref2[_i];
        el.tabIndex = 1;
      }
      recaptcha = $('#recaptcha_response_field');
      return $.bind(recaptcha, 'keydown', Recaptcha.listener);
    },
    listener: function(e) {
      if (e.keyCode === 8 && this.value === '') {
        return Recaptcha.reload();
      }
    },
    reload: function() {
      return window.location = 'javascript:Recaptcha.reload()';
    }
  };
  nodeInserted = function(e) {
    var callback, dialog, target, _i, _len, _ref2, _results;
    target = e.target;
    if (target.nodeName === 'TABLE') {
      _ref2 = g.callbacks;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        callback = _ref2[_i];
        _results.push(callback(target));
      }
      return _results;
    } else if (target.id === 'recaptcha_challenge_field' && (dialog = $('#qr'))) {
      $('img', dialog).src = "http://www.google.com/recaptcha/api/image?c=" + target.value;
      return $('input[name=recaptcha_challenge_field]', dialog).value = target.value;
    }
  };
  imageHover = {
    init: function() {
      var img;
      img = $.el('img', {
        id: 'iHover'
      });
      $.hide(img);
      $.append(d.body, img);
      return g.callbacks.push(imageHover.cb.node);
    },
    cb: {
      node: function(root) {
        var thumb;
        if (!(thumb = $('img[md5]', root))) {
          return;
        }
        $.bind(thumb, 'mouseover', imageHover.cb.mouseover);
        $.bind(thumb, 'mousemove', ui.hover);
        return $.bind(thumb, 'mouseout', ui.hoverend);
      },
      mouseover: function(e) {
        var el;
        el = $('#iHover');
        el.src = null;
        el.src = this.parentNode.href;
        ui.el = el;
        return $.show(el);
      }
    }
  };
  imgPreloading = {
    init: function() {
      return g.callbacks.push(function(root) {
        var el, parent, thumb, thumbs, _i, _len, _results;
        thumbs = $$('img[md5]', root);
        _results = [];
        for (_i = 0, _len = thumbs.length; _i < _len; _i++) {
          thumb = thumbs[_i];
          parent = thumb.parentNode;
          _results.push(el = $.el('img', {
            src: parent.href
          }));
        }
        return _results;
      });
    }
  };
  imgGif = {
    init: function() {
      return g.callbacks.push(function(root) {
        var src, thumb, thumbs, _i, _len, _results;
        thumbs = $$('img[md5]', root);
        _results = [];
        for (_i = 0, _len = thumbs.length; _i < _len; _i++) {
          thumb = thumbs[_i];
          src = thumb.parentNode.href;
          _results.push(/gif$/.test(src) ? thumb.src = src : void 0);
        }
        return _results;
      });
    }
  };
  imgExpand = {
    init: function() {
      g.callbacks.push(imgExpand.cb.node);
      imgExpand.dialog();
      $.bind(window, 'resize', imgExpand.resize);
      return imgExpand.resize();
    },
    cb: {
      node: function(root) {
        var a, thumb;
        if (!(thumb = $('img[md5]', root))) {
          return;
        }
        a = thumb.parentNode;
        $.bind(a, 'click', imgExpand.cb.toggle);
        if (imgExpand.on) {
          return imgExpand.toggle(a);
        }
      },
      toggle: function(e) {
        if (e.shiftKey || e.altKey || e.ctrlKey || e.button !== 0) {
          return;
        }
        e.preventDefault();
        return imgExpand.toggle(this);
      },
      all: function(e) {
        var thumb, thumbs, _i, _j, _len, _len2, _results, _results2;
        thumbs = $$('img[md5]');
        imgExpand.on = this.checked;
        if (imgExpand.on) {
          _results = [];
          for (_i = 0, _len = thumbs.length; _i < _len; _i++) {
            thumb = thumbs[_i];
            _results.push(!thumb.style.display ? imgExpand.expand(thumb) : void 0);
          }
          return _results;
        } else {
          _results2 = [];
          for (_j = 0, _len2 = thumbs.length; _j < _len2; _j++) {
            thumb = thumbs[_j];
            _results2.push(thumb.style.display ? imgExpand.contract(thumb) : void 0);
          }
          return _results2;
        }
      },
      typeChange: function(e) {
        var klass;
        switch (this.value) {
          case 'full':
            klass = '';
            break;
          case 'fit width':
            klass = 'fitwidth';
            break;
          case 'fit height':
            klass = 'fitheight';
            break;
          case 'fit screen':
            klass = 'fitwidth fitheight';
        }
        return d.body.className = klass;
      }
    },
    toggle: function(a) {
      var thumb;
      thumb = a.firstChild;
      if (thumb.style.display) {
        return imgExpand.contract(thumb);
      } else {
        return imgExpand.expand(thumb);
      }
    },
    contract: function(thumb) {
      $.show(thumb);
      return $.rm(thumb.nextSibling);
    },
    expand: function(thumb) {
      var a, filesize, img, max, _, _ref2;
      $.hide(thumb);
      a = thumb.parentNode;
      img = $.el('img', {
        src: a.href
      });
      if (a.parentNode.className !== 'op') {
        filesize = $('span.filesize', a.parentNode);
        _ref2 = filesize.textContent.match(/(\d+)x/), _ = _ref2[0], max = _ref2[1];
        img.setAttribute('style', "max-width: -moz-calc(" + max + "px);");
      }
      return a.appendChild(img);
    },
    dialog: function() {
      var controls, delform, imageType, option, select, _i, _len, _ref2;
      controls = $.el('div', {
        id: 'imgControls',
        innerHTML: "<select id=imageType name=imageType><option>full</option><option>fit width</option><option>fit height</option><option>fit screen</option></select>        <label>Expand Images<input type=checkbox id=imageExpand></label>"
      });
      imageType = $.getValue('imageType', 'full');
      _ref2 = $$('option', controls);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        option = _ref2[_i];
        if (option.textContent === imageType) {
          option.selected = true;
          break;
        }
      }
      select = $('select', controls);
      imgExpand.cb.typeChange.call(select);
      $.bind(select, 'change', $.cb.value);
      $.bind(select, 'change', imgExpand.cb.typeChange);
      $.bind($('input', controls), 'click', imgExpand.cb.all);
      delform = $('form[name=delform]');
      return $.prepend(delform, controls);
    },
    resize: function(e) {
      var style;
      if (style = $('style[media=chan]', d.head)) {
        $.rm(style);
      }
      style = $.addStyle("body.fitheight img[md5] + img { max-height: " + d.body.clientHeight + "px }");
      return style.media = 'chan';
    }
  };
  NAMESPACE = 'AEOS.4chan_x.';
  g = {
    callbacks: []
  };
  main = {
    init: function() {
      var DAY, callback, cutoff, form, hiddenThreads, id, lastChecked, now, op, pathname, reply, table, temp, timestamp, tzOffset, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref2, _ref3, _ref4, _ref5, _ref6;
      pathname = location.pathname.substring(1).split('/');
      g.BOARD = pathname[0], temp = pathname[1];
      if (temp === 'res') {
        g.REPLY = temp;
        g.THREAD_ID = pathname[2];
      } else {
        g.PAGENUM = parseInt(temp) || 0;
      }
      if (location.hostname === 'sys.4chan.org') {
        qr.sys();
        return;
      }
      if ($.config('404 Redirect') && d.title === '4chan - 404' && /^\d+$/.test(g.THREAD_ID)) {
        redirect();
        return;
      }
      if (!$('#navtopr')) {
        return;
      }
      Favicon.halo = /ws/.test(Favicon["default"]) ? Favicon.haloSFW : Favicon.haloNSFW;
      $('link[rel="shortcut icon"]', d.head).setAttribute('type', 'image/x-icon');
      g.hiddenReplies = $.getValue("hiddenReplies/" + g.BOARD + "/", {});
      tzOffset = (new Date()).getTimezoneOffset() / 60;
      g.chanOffset = 5 - tzOffset;
      if ($.isDST()) {
        g.chanOffset -= 1;
      }
      lastChecked = $.getValue('lastChecked', 0);
      now = Date.now();
      DAY = 1000 * 60 * 60 * 24;
      if (lastChecked < now - 1 * DAY) {
        cutoff = now - 7 * DAY;
        hiddenThreads = $.getValue("hiddenThreads/" + g.BOARD + "/", {});
        for (id in hiddenThreads) {
          timestamp = hiddenThreads[id];
          if (timestamp < cutoff) {
            delete hiddenThreads[id];
          }
        }
        _ref2 = g.hiddenReplies;
        for (id in _ref2) {
          timestamp = _ref2[id];
          if (timestamp < cutoff) {
            delete g.hiddenReplies[id];
          }
        }
        $.setValue("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
        $.setValue("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
        $.setValue('lastChecked', now);
      }
      $.addStyle(main.css);
      if (form = $('form[name=post]')) {
        Recaptcha.init();
        $.bind(form, 'submit', qr.cb.submit);
      }
      if ($.config('Cooldown')) {
        qr.cooldown();
      }
      if ($.config('Image Expansion')) {
        imgExpand.init();
      }
      if ($.config('Image Auto-Gif')) {
        imgGif.init();
      }
      if ($.config('Localize Time')) {
        localize.init();
      }
      if ($.config('Sauce')) {
        sauce.init();
      }
      if ($.config('Anonymize')) {
        anonymize.init();
      }
      if ($.config('Image Hover')) {
        imageHover.init();
      }
      if ($.config('Reply Hiding')) {
        replyHiding.init();
      }
      if (form && $.config('Quick Reply')) {
        qr.init();
      }
      if ($.config('Quote Backlinks')) {
        quoteBacklink.init();
      }
      if ($.config('Quote Inline')) {
        quoteInline.init();
      }
      if ($.config('Quote Preview')) {
        quotePreview.init();
      }
      if ($.config('Indicate OP quote')) {
        quoteOP.init();
      }
      if ($.config('Report Button')) {
        reportButton.init();
      }
      if ($.config('Thread Watcher')) {
        watcher.init();
      }
      if ($.config('Keybinds')) {
        keybinds.init();
      }
      threading.init();
      if (g.REPLY) {
        if ($.config('Thread Updater')) {
          updater.init();
        }
        if ($.config('Image Preloading')) {
          imgPreloading.init();
        }
        if ($.config('Quick Reply') && $.config('Persistent QR')) {
          qr.persist();
        }
        if ($.config('Post in Title')) {
          titlePost.init();
        }
        if ($.config('Thread Stats')) {
          threadStats.init();
        }
        if ($.config('Unread Count')) {
          unread.init();
        }
        if ($.config('Auto Watch') && $.config('Thread Watcher') && location.hash === '#watch' && $('img.favicon').src === Favicon.empty) {
          watcher.watch(null, g.THREAD_ID);
        }
      } else {
        if ($.config('Thread Hiding')) {
          threadHiding.init();
        }
        if ($.config('Thread Navigation')) {
          nav.init();
        }
        if ($.config('Thread Expansion')) {
          expandThread.init();
        }
        if ($.config('Comment Expansion')) {
          expandComment.init();
        }
      }
      _ref3 = $$('div.op');
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        op = _ref3[_i];
        _ref4 = g.callbacks;
        for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
          callback = _ref4[_j];
          callback(op);
        }
      }
      _ref5 = $$('td[id]');
      for (_k = 0, _len3 = _ref5.length; _k < _len3; _k++) {
        reply = _ref5[_k];
        table = reply.parentNode.parentNode.parentNode;
        _ref6 = g.callbacks;
        for (_l = 0, _len4 = _ref6.length; _l < _len4; _l++) {
          callback = _ref6[_l];
          callback(table);
        }
      }
      $.bind(d.body, 'DOMNodeInserted', nodeInserted);
      return options.init();
    },
    css: '\
      /* dialog styling */\
      div.dialog {\
        border: 1px solid;\
      }\
      div.dialog > div.move {\
        cursor: move;\
      }\
      label, a, .favicon, #qr img {\
        cursor: pointer;\
      }\
\
      .new {\
        background: lime;\
      }\
      .error {\
        color: red;\
      }\
      td.replyhider {\
        vertical-align: top;\
      }\
\
      div.thread.stub > *:not(.block) {\
        display: none;\
      }\
\
      img[md5] + img {\
        float: left;\
      }\
      body.fitwidth img[md5] + img {\
        max-width: 100%;\
      }\
      body.fitwidth table img[md5] + img {\
        width: -moz-calc(100%); /* hack so only firefox sees this */\
      }\
\
      iframe {\
        display: none;\
      }\
\
      #qp, #iHover {\
        position: fixed;\
      }\
\
      #iHover {\
        max-height: 100%;\
      }\
\
      #navlinks {\
        font-size: 16px;\
        position: fixed;\
        top: 25px;\
        right: 5px;\
      }\
\
      #options {\
        position: fixed;\
        padding: 5px;\
      }\
      #options .move, #credits {\
        text-align: right;\
      }\
      .column {\
        float: left;\
        margin: 0 10px;\
      }\
      #options ul {\
        list-style: none;\
        margin: 0;\
        padding: 0;\
      }\
      #options li:first-child {\
        text-decoration: underline;\
      }\
      #floaty {\
        float: left;\
      }\
      #options textarea {\
        height: 100px;\
        width: 100%;\
      }\
\
      #qr {\
        position: fixed;\
      }\
      #qr > div.move {\
        text-align: right;\
      }\
      #qr input[name=name] {\
        float: left;\
      }\
      #qr_form {\
        clear: left;\
      }\
      #qr_form, #qr #com_submit, #qr input[name=upfile] {\
        margin: 0;\
      }\
      #qr textarea {\
        width: 100%;\
        height: 120px;\
      }\
      #qr.auto:not(:hover) > form {\
        height: 0;\
        overflow: hidden;\
      }\
      /* http://stackoverflow.com/questions/2610497/change-an-inputs-html5-placeholder-color-with-css */\
      #qr input::-webkit-input-placeholder {\
        color: grey;\
      }\
      #qr input:-moz-placeholder {\
        color: grey;\
      }\
      /* qr reCAPTCHA */\
      #qr img {\
        border: 1px solid #AAA;\
      }\
\
      #updater {\
        position: fixed;\
        text-align: right;\
      }\
      #updater input[type=text] {\
        width: 50px;\
      }\
      #updater:not(:hover) {\
        border: none;\
        background: transparent;\
      }\
      #updater:not(:hover) > div:not(.move) {\
        display: none;\
      }\
\
      #stats {\
        border: none;\
        position: fixed;\
      }\
\
      #watcher {\
        position: absolute;\
      }\
      #watcher > div {\
        padding-right: 5px;\
        padding-left: 5px;\
      }\
      #watcher > div.move {\
        text-decoration: underline;\
        padding-top: 5px;\
      }\
      #watcher > div:last-child {\
        padding-bottom: 5px;\
      }\
\
      #qp {\
        border: 1px solid;\
      }\
      #qp input {\
        display: none;\
      }\
      .qphl {\
        outline: 2px solid rgba(216, 94, 49, .7);\
      }\
      .inlined {\
        opacity: .5;\
      }\
    '
  };
  main.init();
}).call(this);
