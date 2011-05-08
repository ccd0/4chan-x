// ==UserScript==
// @name           4chan x
// @namespace      aeosynth
// @description    Adds various features.
// @version        2.4.0
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
 * Mayhem - fix updater default options
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
  var $, $$, Favicon, NAMESPACE, Recaptcha, anonymize, config, d, expandComment, expandThread, g, imageHover, imgExpand, imgGif, imgPreloading, keybinds, localize, log, main, nav, nodeInserted, options, qr, quickReport, quotePreview, redirect, replyHiding, sauce, threadHiding, threading, titlePost, ui, unread, updater, watcher, _config, _ref;
  var __slice = Array.prototype.slice;
  if (typeof console !== "undefined" && console !== null) {
    log = function(arg) {
      return console.log(arg);
    };
  }
  config = {
    main: {
      checkbox: {
        '404 Redirect': [true, 'Redirect dead threads'],
        'Anonymize': [false, 'Make everybody anonymous'],
        'Auto Watch': [true, 'Automatically watch threads that you start'],
        'Auto Watch Reply': [false, 'Automatically watch threads that you reply to'],
        'Comment Expansion': [true, 'Expand too long comments'],
        'Cooldown': [false, 'Prevent \'flood detected\' errors (buggy)'],
        'Image Auto-Gif': [false, 'Animate gif thumbnails'],
        'Image Expansion': [true, 'Expand images'],
        'Image Hover': [false, 'Show full image on mouseover'],
        'Image Preloading': [false, 'Preload Images'],
        'Keybinds': [false, 'Binds actions to keys'],
        'Localize Time': [true, 'Show times based on your timezone'],
        'Persistent QR': [false, 'Quick reply won\'t disappear after posting. Only in replies.'],
        'Post in Title': [true, 'Show the op\'s post in the tab title'],
        'Quick Reply': [true, 'Reply without leaving the page'],
        'Quick Report': [true, 'Add quick report buttons'],
        'Quote Preview': [false, 'Show quote content on hover'],
        'Reply Hiding': [true, 'Hide single replies'],
        'Sauce': [true, 'Add sauce to images'],
        'Show Stubs': [true, 'Of hidden threads / replies'],
        'Thread Expansion': [true, 'View all replies'],
        'Thread Hiding': [true, 'Hide entire threads'],
        'Thread Navigation': [true, 'Navigate to previous / next thread'],
        'Thread Updater': [true, 'Update threads'],
        'Thread Watcher': [true, 'Bookmark threads'],
        'Unread Count': [true, 'Show unread post count in tab title']
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
      if (typeof position === 'object') {
        left = position.left, top = position.top;
      } else {
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
          case 'center':
            left = '50%';
            top = '25%';
        }
      }
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
      if (left < 20) {
        left = '0px';
      } else if (ui.width - left < 20) {
        left = '';
      }
      right = left ? '' : '0px';
      el.style.left = left;
      el.style.right = right;
      top = e.clientY - ui.dy;
      if (top < 20) {
        top = '0px';
      } else if (ui.height - top < 20) {
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
      var bot, clientX, clientY, el, height, top;
      clientX = e.clientX, clientY = e.clientY;
      el = ui.el;
      height = el.offsetHeight;
      top = clientY - 120;
      bot = top + height;
      el.style.top = ui.winHeight < height || top < 0 ? '0px' : bot > ui.winHeight ? ui.winHeight - height + 'px' : top + 'px';
      return el.style.left = clientX + 45;
    },
    hoverend: function(e) {
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
      return $.remove(script);
    },
    get: function(url, cb) {
      var r;
      r = new XMLHttpRequest();
      r.onload = cb;
      r.open('get', url, true);
      r.send();
      return r;
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
    remove: function(el) {
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
        _results.push($.bind(a, 'click', expandComment.cb.expand));
      }
      return _results;
    },
    cb: {
      expand: function(e) {
        var a, href, replyID, threadID, _, _ref;
        e.preventDefault();
        a = this;
        a.textContent = 'Loading...';
        href = a.getAttribute('href');
        _ref = href.match(/(\d+)#(\d+)/), _ = _ref[0], threadID = _ref[1], replyID = _ref[2];
        return g.cache[threadID] = $.get(href, (function() {
          return expandComment.load(this, a, threadID, replyID);
        }));
      }
    },
    load: function(xhr, a, threadID, replyID) {
      var body, bq, reply, _i, _len, _ref;
      body = $.el('body', {
        innerHTML: xhr.responseText
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
      },
      load: function(xhr, thread, a) {
        var html, id;
        if (xhr.status === 404) {
          a.textContent.replace('X Loading...', '404');
          return $.unbind(a, 'click', expandThread.cb.toggle);
        } else {
          html = xhr.responseText;
          id = thread.firstChild.id;
          g.cache[id] = html;
          return expandThread.expand(html, thread, a);
        }
      }
    },
    toggle: function(thread) {
      var a, html, id, num, prev, table, _results;
      id = thread.firstChild.id;
      a = $('a.omittedposts', thread);
      switch (a.textContent[0]) {
        case '+':
          a.textContent = a.textContent.replace('+', 'X Loading...');
          if (html = g.cache[id]) {
            return expandThread.expand(html, thread, a);
          } else {
            return g.requests[id] = $.get("res/" + id, (function() {
              return expandThread.cb.load(this, thread, a);
            }));
          }
          break;
        case 'X':
          a.textContent = a.textContent.replace('X Loading...', '+');
          return g.requests[id].abort();
        case '-':
          a.textContent = a.textContent.replace('-', '+');
          num = g.BOARD === 'b' ? 3 : 5;
          table = $.x("following::br[@clear][1]/preceding::table[" + num + "]", a);
          _results = [];
          while ((prev = table.previousSibling) && (prev.nodeName === 'TABLE')) {
            _results.push($.remove(prev));
          }
          return _results;
      }
    },
    expand: function(html, thread, a) {
      var body, br, next, table, tables, _i, _len, _results;
      a.textContent = a.textContent.replace('X Loading...', '-');
      while ((next = a.nextSibling) && !next.clear) {
        $.remove(next);
      }
      br = next;
      body = $.el('body', {
        innerHTML: html
      });
      tables = $$('form[name=delform] table', body);
      tables.pop();
      _results = [];
      for (_i = 0, _len = tables.length; _i < _len; _i++) {
        table = tables[_i];
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
        var a, id, reply, td, tds, _i, _len, _results;
        tds = $$('td.doubledash', root);
        _results = [];
        for (_i = 0, _len = tds.length; _i < _len; _i++) {
          td = tds[_i];
          a = $.el('a', {
            textContent: '[ - ]'
          });
          $.bind(a, 'click', replyHiding.cb.hide);
          $.replace(td.firstChild, a);
          reply = td.nextSibling;
          id = reply.id;
          _results.push(id in g.hiddenReplies ? replyHiding.hide(reply) : void 0);
        }
        return _results;
      },
      show: function(e) {
        var div, table;
        div = this.parentNode;
        table = div.nextSibling;
        replyHiding.show(table);
        return $.remove(div);
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
          return $.remove($('#qr'));
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
        return imgExpand.toggle(thumb);
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
        return $.remove(dialog);
      } else {
        return options.dialog();
      }
    },
    dialog: function() {
      var checked, conf, dialog, hiddenNum, hiddenThreads, html, input, name, title, _i, _len, _ref;
      html = "<div class=move>Options <a name=close>X</a></div>";
      conf = config.main.checkbox;
      for (name in conf) {
        title = conf[name][1];
        checked = $.config(name) ? "checked" : "";
        html += "<div><label title=\"" + title + "\">" + name + "<input name=\"" + name + "\" " + checked + " type=checkbox></label></div>";
      }
      html += "<div><a name=flavors>Flavors</a></div>";
      html += "<div><textarea style=\"display: none;\" name=flavors>" + ($.config('flavors')) + "</textarea></div>";
      hiddenThreads = $.getValue("hiddenThreads/" + g.BOARD + "/", {});
      hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length;
      html += "<div><input type=\"button\" value=\"hidden: " + hiddenNum + "\"></div>";
      html += "<hr>";
      html += "<div><a href=\"http://chat.now.im/x/aeos\">support throd</a></div>";
      html += '<div><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2DBVZBUAM4DHC&lc=US&item_name=Aeosynth&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted"><img alt="Donate" src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif"/></a></div>';
      dialog = ui.dialog('options', {
        top: '25%',
        left: '50%'
      }, html);
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
              $.remove(dialog);
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
        var quote, quotes, _i, _len, _results;
        quotes = $$('a.quotejs:not(:first-child)', root);
        _results = [];
        for (_i = 0, _len = quotes.length; _i < _len; _i++) {
          quote = quotes[_i];
          _results.push($.bind(quote, 'click', qr.cb.quote));
        }
        return _results;
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
            alert('Stop posting so often!');
            if (isQR) {
              $('#error').textContent = 'Stop posting so often!';
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
      qr.duration = qr.duration - 1;
      submits = $$('#com_submit');
      for (_i = 0, _len = submits.length; _i < _len; _i++) {
        submit = submits[_i];
        if (qr.duration === 0) {
          submit.disabled = false;
          submit.value = 'Submit';
        } else {
          submit.value = qr.duration;
        }
      }
      if (qr.duration === 0) {
        return clearInterval(qr.cooldownIntervalID);
      }
    },
    dialog: function(link) {
      var MAX_FILE_SIZE, THREAD_ID, clone, dialog, el, html, spoiler;
      MAX_FILE_SIZE = $('input[name="MAX_FILE_SIZE"]').value;
      THREAD_ID = g.THREAD_ID || link.pathname.split('/').pop();
      html = "      <div class=move>        <input class=inputtext type=text name=name placeholder=Name form=qr_form>        Quick Reply        <input type=checkbox id=autohide title=autohide>        <a name=close title=close>X</a>      </div>      <form name=post action=http://sys.4chan.org/" + g.BOARD + "/post method=POST enctype=multipart/form-data target=iframe id=qr_form>        <input type=hidden name=MAX_FILE_SIZE value=" + MAX_FILE_SIZE + ">        <input type=hidden name=resto value=" + THREAD_ID + ">        <div><input class=inputtext type=text name=email placeholder=E-mail></div>        <div><input class=inputtext type=text name=sub placeholder=Subject><input type=submit value=Submit id=com_submit></div>        <div><textarea class=inputtext name=com placeholder=Comment></textarea></div>        <div id=qr_captcha></div>        <div><input type=file name=upfile></div>        <div><input class=inputtext type=password name=pwd maxlength=8 placeholder=Password><input type=hidden name=mode value=regist></div>      </form>      <div id=error class=error></div>      ";
      dialog = ui.dialog('qr', {
        top: '0px',
        left: '0px'
      }, html);
      $.bind($('input[name=name]', dialog), 'mousedown', function(e) {
        return e.stopPropagation();
      });
      el = $('#autohide', dialog);
      $.bind(el, 'click', qr.cb.autohide);
      if ($('.postarea label')) {
        spoiler = $.el('label', {
          innerHTML: " [<input type=checkbox name=spoiler>Spoiler Image?]"
        });
        $.after($('input[name=email]', dialog), spoiler);
      }
      clone = $('#recaptcha_widget_div').cloneNode(true);
      $.append($('#qr_captcha', dialog), clone);
      $.extend($('input[name=recaptcha_response_field]', clone), {
        placeholder: 'Verification',
        className: 'inputtext',
        required: true
      });
      $.bind($('form', dialog), 'submit', qr.cb.submit);
      $.bind($('input[name=recaptcha_response_field]', clone), 'keydown', Recaptcha.listener);
      $.append(d.body, dialog);
      return dialog;
    },
    persist: function() {
      $.append(d.body, qr.dialog());
      return qr.autohide.set();
    },
    sys: function() {
      var board, c, id, recaptcha, thread, _, _ref, _ref2;
      if (recaptcha = $('#recaptcha_response_field')) {
        $.bind(recaptcha, 'keydown', Recaptcha.listener);
        return;
      }
      c = $('b').lastChild;
      if (c.nodeType === 8) {
        _ref = c.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref[0], thread = _ref[1], id = _ref[2];
        if (thread === '0') {
          _ref2 = $('meta', d).content.match(/4chan.org\/(\w+)\//), _ = _ref2[0], board = _ref2[1];
          window.location = "http://boards.4chan.org/" + board + "/res/" + id + "#watch";
          return;
        }
      }
      /*
            http://code.google.com/p/chromium/issues/detail?id=20773
            Let content scripts see other frames (instead of them being undefined)
      
            To access the parent, we have to break out of the sandbox and evaluate
            in the global context.
          */
      return $.globalEval(function() {
        var data, _ref3;
        data = ((_ref3 = document.querySelector('table font b')) != null ? _ref3.firstChild.textContent : void 0) || '';
        return parent.postMessage(data, '*');
      });
    }
  };
  threading = {
    init: function() {
      var node;
      node = $('form[name=delform] > *:not([id])');
      $.bind(d, 'DOMNodeInserted', threading.stopPropagation);
      threading.thread(node);
      return $.unbind(d, 'DOMNodeInserted', threading.stopPropagation);
    },
    thread: function(node) {
      var div, op;
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
      if (g.REPLY) {
        return;
      }
      node = op;
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
    },
    stopPropagation: function(e) {
      return e.stopPropagation();
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
      $.remove($('div.block', thread));
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
          clearInterval(updater.intervalID);
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
        $.remove(div);
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
      $.setValue('watcher.lastUpdated', Date.now());
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
      return watcher.refresh(watched);
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
      return watcher.refresh(watched);
    }
  };
  anonymize = {
    init: function() {
      return g.callbacks.push(anonymize.cb.node);
    },
    cb: {
      node: function(root) {
        var name, names, trip, _i, _j, _len, _len2, _ref, _results;
        names = $$('span.postername, span.commentpostername', root);
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          name.innerHTML = 'Anonymous';
        }
        _ref = $$('span.postertrip', root);
        _results = [];
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          trip = _ref[_j];
          _results.push(trip.parentNode.nodeName === 'A' ? $.remove(trip.parentNode) : $.remove(trip));
        }
        return _results;
      }
    }
  };
  sauce = {
    init: function() {
      return g.callbacks.push(sauce.cb.node);
    },
    cb: {
      node: function(root) {
        var i, link, names, prefix, prefixes, s, span, suffix, _i, _len, _ref, _results;
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
        _ref = $$('span.filesize', root);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          span = _ref[_i];
          suffix = $('a', span).href;
          _results.push((function() {
            var _len2, _results2;
            _results2 = [];
            for (i = 0, _len2 = prefixes.length; i < _len2; i++) {
              prefix = prefixes[i];
              link = $.el('a', {
                textContent: names[i],
                href: prefix + suffix
              });
              _results2.push($.append(span, $.tn(' '), link));
            }
            return _results2;
          })());
        }
        return _results;
      }
    }
  };
  localize = {
    init: function() {
      return g.callbacks.push(function(root) {
        var date, day, dotw, hour, min_sec, month, s, span, year, _, _i, _len, _ref, _ref2, _results;
        _ref = $$('span[id^=no]', root);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          span = _ref[_i];
          s = span.previousSibling;
          _ref2 = s.textContent.match(/(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\S+)/), _ = _ref2[0], month = _ref2[1], day = _ref2[2], year = _ref2[3], hour = _ref2[4], min_sec = _ref2[5];
          year = "20" + year;
          month -= 1;
          hour = g.chanOffset + Number(hour);
          date = new Date(year, month, day, hour);
          year = date.getFullYear() - 2000;
          month = $.zeroPad(date.getMonth() + 1);
          day = $.zeroPad(date.getDate());
          hour = $.zeroPad(date.getHours());
          dotw = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
          _results.push(s.textContent = " " + month + "/" + day + "/" + year + "(" + dotw + ")" + hour + ":" + min_sec + " ");
        }
        return _results;
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
      _ref = $$('a.quotelink', root);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        $.bind(quote, 'mouseover', quotePreview.mouseover);
        $.bind(quote, 'mousemove', ui.hover);
        _results.push($.bind(quote, 'mouseout', ui.hoverend));
      }
      return _results;
    },
    mouseover: function(e) {
      var el, id, qp, req, threadID;
      id = this.textContent.replace(">>", '');
      qp = $('#qp');
      if (el = d.getElementById(id)) {
        qp.innerHTML = el.innerHTML;
      } else {
        qp.innerHTML = "Loading " + id + "...";
        threadID = this.pathname.split('/').pop();
        if (req = g.requests[threadID]) {
          if (req.readyState === 4) {
            quotePreview.parse(req, id, threadID);
          }
        } else {
          g.requests[threadID] = $.get(this.href, (function() {
            return quotePreview.parse(this, id, threadID);
          }));
        }
      }
      $.show(qp);
      return ui.el = qp;
    },
    parse: function(req, id, threadID) {
      var body, html, qp, reply, _i, _len, _ref;
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
        html = $('blockquote', body).innerHTML;
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
  quickReport = {
    init: function() {
      return g.callbacks.push(quickReport.cb.node);
    },
    cb: {
      node: function(root) {
        var a, arr, el, _i, _len, _results;
        arr = $$('span[id^=no]', root);
        _results = [];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          el = arr[_i];
          a = $.el('a', {
            innerHTML: '[&nbsp;!&nbsp;]'
          });
          $.bind(a, 'click', quickReport.cb.report);
          $.after(el, a);
          _results.push($.after(el, $.tn(' ')));
        }
        return _results;
      },
      report: function(e) {
        return quickReport.report(this);
      }
    },
    report: function(target) {
      var input;
      input = $.x('preceding-sibling::input[1]', target);
      input.click();
      $('input[value="Report"]').click();
      return input.click();
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
        unread.replies = unread.replies.concat($$('td[id]', root));
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
      clone.setAttribute('type', 'image/x-icon');
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
    var callback, dialog, _i, _len, _ref2, _results;
    if (this.nodeName === 'TABLE') {
      _ref2 = g.callbacks;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        callback = _ref2[_i];
        _results.push(callback(this));
      }
      return _results;
    } else if (this.id === 'recaptcha_challenge_field' && (dialog = $('#qr'))) {
      $('#recaptcha_image img', dialog).src = "http://www.google.com/recaptcha/api/image?c=" + this.value;
      return $('#recaptcha_challenge_field', dialog).value = this.value;
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
        var thumb, _i, _len, _ref2, _results;
        _ref2 = $$('img[md5]', root);
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          thumb = _ref2[_i];
          $.bind(thumb, 'mouseover', imageHover.cb.mouseover);
          $.bind(thumb, 'mousemove', ui.hover);
          _results.push($.bind(thumb, 'mouseout', ui.hoverend));
        }
        return _results;
      },
      mouseover: function(e) {
        var el;
        el = $('#iHover');
        el.src = null;
        el.src = this.parentNode.href;
        $.show(el);
        ui.el = el;
        ui.winHeight = d.body.clientHeight;
        return ui.winWidth = d.body.clientWidth;
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
      return imgExpand.dialog();
    },
    cb: {
      node: function(root) {
        var thumb, _i, _len, _ref2, _results;
        _ref2 = $$('img[md5]', root);
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          thumb = _ref2[_i];
          $.bind(thumb.parentNode, 'click', imgExpand.cb.toggle);
          _results.push(imgExpand.on ? imgExpand.toggle(thumb) : void 0);
        }
        return _results;
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
        imgExpand.foo();
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
        var img, _i, _len, _ref2, _results;
        imgExpand.foo();
        _ref2 = $$('img[md5] + img');
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          img = _ref2[_i];
          _results.push(imgExpand.resize(img));
        }
        return _results;
      }
    },
    toggle: function(img) {
      var thumb;
      thumb = img.parentNode.firstChild;
      imgExpand.foo();
      if (thumb.style.display) {
        return imgExpand.contract(thumb);
      } else {
        return imgExpand.expand(thumb);
      }
    },
    contract: function(thumb) {
      $.show(thumb);
      return $.remove(thumb.nextSibling);
    },
    expand: function(thumb) {
      var a, img;
      $.hide(thumb);
      a = thumb.parentNode;
      img = $.el('img', {
        src: a.href
      });
      a.appendChild(img);
      return imgExpand.resize(img);
    },
    foo: function() {
      var crap, formWidth, left, table, td;
      formWidth = $('form[name=delform]').getBoundingClientRect().width;
      if (td = $('td.reply')) {
        table = td.parentNode.parentNode.parentNode;
        left = td.getBoundingClientRect().left - table.getBoundingClientRect().left;
        crap = td.getBoundingClientRect().width - parseInt(getComputedStyle(td).width);
      }
      imgExpand.maxWidthOP = formWidth;
      imgExpand.maxWidthReply = formWidth - left - crap;
      imgExpand.maxHeight = d.body.clientHeight;
      return imgExpand.type = $('#imageType').value;
    },
    resize: function(img) {
      var imgHeight, imgWidth, maxHeight, maxWidth, maxWidthOP, maxWidthReply, ratio, type, _, _ref2;
      maxWidthOP = imgExpand.maxWidthOP, maxWidthReply = imgExpand.maxWidthReply, maxHeight = imgExpand.maxHeight, type = imgExpand.type;
      _ref2 = $.x("preceding::span[@class][1]/text()[2]", img).textContent.match(/(\d+)x(\d+)/), _ = _ref2[0], imgWidth = _ref2[1], imgHeight = _ref2[2];
      imgWidth = Number(imgWidth);
      imgHeight = Number(imgHeight);
      if (img.parentNode.parentNode.nodeName === 'TD') {
        maxWidth = maxWidthReply;
      } else {
        maxWidth = maxWidthOP;
      }
      switch (type) {
        case 'full':
          return img.removeAttribute('style');
        case 'fit width':
          if (imgWidth > maxWidth) {
            return img.style.width = maxWidth;
          }
          break;
        case 'fit screen':
          ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
          if (ratio < 1) {
            return img.style.width = Math.floor(ratio * imgWidth);
          }
      }
    },
    dialog: function() {
      var controls, delform, imageType, option, _i, _len, _ref2;
      controls = $.el('div', {
        id: 'imgControls',
        innerHTML: "<select id=imageType name=imageType><option>full</option><option>fit width</option><option>fit screen</option></select>        <label>Expand Images<input type=checkbox id=imageExpand></label>"
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
      $.bind($('select', controls), 'change', $.cb.value);
      $.bind($('select', controls), 'change', imgExpand.cb.typeChange);
      $.bind($('input', controls), 'click', imgExpand.cb.all);
      delform = $('form[name=delform]');
      return $.prepend(delform, controls);
    }
  };
  NAMESPACE = 'AEOS.4chan_x.';
  g = {
    cache: {},
    requests: {},
    callbacks: []
  };
  main = {
    init: function() {
      var DAY, callback, cutoff, hiddenThreads, id, lastChecked, now, pathname, temp, timestamp, tzOffset, _i, _len, _ref2, _ref3;
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
      Recaptcha.init();
      $.bind($('form[name=post]'), 'submit', qr.cb.submit);
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
      if ($.config('Quick Reply')) {
        qr.init();
      }
      if ($.config('Quick Report')) {
        quickReport.init();
      }
      if ($.config('Quote Preview')) {
        quotePreview.init();
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
      _ref3 = g.callbacks;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        callback = _ref3[_i];
        callback();
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
      label, a {\
        cursor: pointer;\
      }\
\
      .new {\
        background: lime;\
      }\
      .favicon {\
        cursor: pointer;\
      }\
      .error {\
        color: red;\
      }\
\
      div.thread.stub > *:not(.block) {\
        display: none;\
      }\
\
      form[name=delform] a img {\
        border: 0px;\
        float: left;\
      }\
      form[name=delform] a img:first-child {\
        margin: 0px 20px;\
      }\
      iframe {\
        display: none;\
      }\
\
      #qp, #iHover {\
        position: fixed;\
      }\
\
      #navlinks {\
        position: fixed;\
        top: 25px;\
        right: 5px;\
      }\
      #navlinks > a {\
        font-size: 16px;\
      }\
\
      #options {\
        position: fixed;\
        padding: 5px;\
        text-align: right;\
      }\
      #options textarea {\
        height: 100px;\
        width: 500px;\
      }\
\
      #qr {\
        position: fixed;\
      }\
      #qr > div.move {\
        text-align: right;\
      }\
      #qr > div.move > input[name=name] {\
        float: left;\
      }\
      #qr_form > div {\
        float: left;\
        clear: both;\
      }\
      #qr #recaptcha_table td:nth-of-type(3) {/* captcha logos */\
        display: none;\
      }\
      #qr form, #qr #com_submit, #qr input[type="file"] {\
        margin: 0;\
      }\
      #qr textarea {\
        width: 302px;\
        height: 80px;\
        margin: 0px;\
      }\
      #qr *:not(input):not(textarea) {\
        padding: 0 !important;\
      }\
      #qr.auto:not(:hover) > form {\
        height: 0px;\
        overflow: hidden;\
      }\
      /* http://stackoverflow.com/questions/2610497/change-an-inputs-html5-placeholder-color-with-css */\
      #qr input:-webkit-input-placeholder {\
        color: grey;\
      }\
      #qr input:-moz-placeholder {\
        color: grey;\
      }\
      /* qr reCAPTCHA */\
      #qr_captcha input {\
        border: 1px solid #AAA !important;\
        margin-top: 2px;\
        padding: 2px 4px 3px;\
      }\
      #qr tr {\
        height: auto;\
      }\
      #qr .recaptchatable #recaptcha_image {\
        border: 1px solid #AAA !important;\
      }\
      #qr #recaptcha_reload, #qr #recaptcha_switch_audio, #qr #recaptcha_whatsthis {\
        height: 0;\
        width: 0;\
        padding: 10px 6px !important;\
        margin-left: -16px;\
        position: relative;\
      }\
      #recaptcha_reload {\
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAcUlEQVQY02P4z4AKGYKhNJQKYzgIZjxn+I8kwdCGrAkuwRAOZrUwhKBL7GP4ziCPYg8jROI/wzQ0B1yBSXiiCKeBjAMbhab+P0gExFCHu3o3QxzIwSC/MCC5+hPDezDdjOzB/ww/wYw9DCGoPt+CHjQAYxCCmpNUoxoAAAAASUVORK5CYII=) no-repeat center;\
      }\
      #recaptcha_switch_audio {\
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAVUlEQVQYV42NMQ6AMAwDPbTQjQEE//8OPCqkhgZXMJBTJMc3BCjBJrlA6uNL1Np6MTordq+N+cLAotHKlxhk/4lMjMu43M9z4CKRmSoJEarqxDOTHidPWTEdrdlTpwAAAABJRU5ErkJggg==) no-repeat center;\
      }\
      #recaptcha_whatsthis {\
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAk0lEQVQYV3WMsQ3CMBBFf0ECmYDJqIkFk0TpkcgEUCeegWzADoi0yQbm3cUFBeifrX/vWZZ2f+K4UlDURCKtcua4VfpK64oJDg/a66zFe1hFpN7AHWvnIprY8nPSk9zpVxcTLYukmXZynEWp3peXLpxV9CrF1L6OtDGL2kTB1QBmPTj2pIEUJkwdNehNBpphxOZ3PgIeQ0jaC7S6AAAAAElFTkSuQmCC) no-repeat center;\
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
    '
  };
  main.init();
}).call(this);
