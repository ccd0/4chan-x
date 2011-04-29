// ==UserScript==
// @name           4chan x
// @namespace      aeosynth
// @description    Adds various features.
// @version        2.1.0
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
  var $, $$, Favicon, NAMESPACE, Recaptcha, anonymize, config, d, expandComment, expandThread, g, imageHover, imgExpand, imgGif, imgPreloading, keybinds, localize, log, main, nav, nodeInserted, options, qr, quickReport, redirect, replyHiding, sauce, threadHiding, threading, titlePost, ui, unread, updater, watcher, _config, _ref;
  var __slice = Array.prototype.slice;
  if (typeof console != "undefined" && console !== null) {
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
        'Comment Expansion': [true, 'Expand too long comments'],
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
        flavors: ['http://regex.info/exif.cgi?url=', 'http://iqdb.org/?url=', 'http://tineye.com/search?url='].join('\n')
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
      el.querySelector('div.move').addEventListener('mousedown', ui.move, true);
      if ((_ref3 = el.querySelector('div.move a[name=close]')) != null) {
        _ref3.addEventListener('click', (function() {
          return el.parentNode.removeChild(el);
        }), true);
      }
      return el;
    },
    move: function(e) {
      var el, rect;
      ui.el = el = e.target.parentNode;
      document.body.className = 'noselect';
      rect = el.getBoundingClientRect();
      ui.dx = e.clientX - rect.left;
      ui.dy = e.clientY - rect.top;
      ui.width = document.body.clientWidth - el.offsetWidth;
      ui.height = document.body.clientHeight - el.offsetHeight;
      document.addEventListener('mousemove', ui.moveMove, true);
      return document.addEventListener('mouseup', ui.moveEnd, true);
    },
    moveMove: function(e) {
      var bottom, el, left, right, top;
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
    moveEnd: function() {
      var el, id;
      document.removeEventListener('mousemove', ui.moveMove, true);
      document.removeEventListener('mouseup', ui.moveEnd, true);
      el = ui.el;
      id = el.id;
      localStorage["" + id + "Left"] = el.style.left;
      localStorage["" + id + "Top"] = el.style.top;
      return document.body.className = '';
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
    setValue: function(name, value) {
      name = NAMESPACE + name;
      return localStorage[name] = JSON.stringify(value);
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
  $$ = function(selector, root) {
    var node, result, _i, _len, _results;
    if (root == null) {
      root = d.body;
    }
    result = root.querySelectorAll(selector);
    _results = [];
    for (_i = 0, _len = result.length; _i < _len; _i++) {
      node = result[_i];
      _results.push(node);
    }
    return _results;
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
        a = e.target;
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
        bq = $('blockqoute', body);
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
        thread = e.target.parentNode;
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
        reply = e.target.parentNode.nextSibling;
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
        div = e.target.parentNode;
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
        return window.open(url, "_blank");
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
      $.append(d.body, span);
      return nav.threads = $$('div.thread');
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
          window.location = "" + (g.PAGENUM + 1) + "#0";
          return;
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
        var data, dialog, error;
        data = e.data;
        dialog = $('#qr');
        if (data) {
          error = $.el('span', {
            className: 'error',
            textContent: data
          });
          $.append(dialog, error);
          qr.autohide.unset();
        } else {
          if (dialog) {
            if ($.config('Persistent QR')) {
              qr.refresh(dialog);
            } else {
              $.remove(dialog);
            }
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
        var form, isQR, recaptcha, span;
        form = e.target;
        isQR = form.parentNode.id === 'qr';
        if (isQR) {
          if (span = this.nextSibling) {
            $.remove(span);
          }
        }
        if (g.seconds = $.getValue('seconds')) {
          e.preventDefault();
          qr.cooldownStart();
          alert('Stop posting so often!');
          if (isQR) {
            span = $.el('span', {
              className: 'error',
              textContent: 'Stop posting so often!'
            });
            $.append(this.parentNode, span);
          }
          return;
        }
        recaptcha = $('input[name=recaptcha_response_field]', this);
        if (recaptcha.value) {
          g.sage = $('input[name=email]', form).value === 'sage';
          if (isQR) {
            return qr.autohide.set();
          }
        } else {
          e.preventDefault();
          alert('You forgot to type in the verification.');
          recaptcha.focus();
          if (isQR) {
            span = $.el('span', {
              className: 'error',
              textContent: 'You forgot to type in the verification.'
            });
            return $.append(this.parentNode, span);
          }
        }
      },
      quote: function(e) {
        e.preventDefault();
        return qr.quote(e.target);
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
    cooldown: function() {
      var submit, submits, _i, _len;
      submits = $$('#qr input[type=submit], form[name=post] input[type=submit]');
      for (_i = 0, _len = submits.length; _i < _len; _i++) {
        submit = submits[_i];
        if (g.seconds === 0) {
          submit.disabled = false;
          submit.value = 'Submit';
        } else {
          submit.value = g.seconds = g.seconds - 1;
          $.setValue('seconds', g.seconds);
        }
      }
      if (g.seconds !== 0) {
        return window.setTimeout(qr.cooldown, 1000);
      }
    },
    cooldownStart: function() {
      var submit, submits, _i, _len;
      $.setValue('seconds', g.seconds);
      submits = $$('#qr input[type=submit], form[name=post] input[type=submit]');
      for (_i = 0, _len = submits.length; _i < _len; _i++) {
        submit = submits[_i];
        submit.value = g.seconds;
        submit.disabled = true;
      }
      return window.setTimeout(qr.cooldown, 1000);
    },
    dialog: function(link) {
      var clone, dialog, el, html, resto, script, xpath, _i, _len, _ref;
      html = "<div class=move>Quick Reply <input type=checkbox title=autohide> <a name=close title=close>X</a></div>";
      dialog = ui.dialog('qr', {
        top: '0px',
        left: '0px'
      }, html);
      el = $('input[title=autohide]', dialog);
      $.bind(el, 'click', qr.cb.autohide);
      clone = $('form[name=post]').cloneNode(true);
      _ref = $$('script', clone);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        script = _ref[_i];
        $.remove(script);
      }
      clone.target = 'iframe';
      $.bind(clone, 'submit', qr.cb.submit);
      $.bind($('input[name=recaptcha_response_field]', clone), 'keydown', Recaptcha.listener);
      if (!g.REPLY) {
        xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]';
        resto = $.el('input', {
          type: 'hidden',
          name: 'resto',
          value: $.x(xpath, link).name
        });
        $.before(clone.lastChild, resto);
      }
      $.append(dialog, clone);
      $.append(d.body, dialog);
      dialog.style.width = dialog.offsetWidth;
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
        var data, _ref;
        data = ((_ref = document.querySelector('table font b')) != null ? _ref.firstChild.textContent : void 0) || '';
        return parent.postMessage(data, '*');
      });
    }
  };
  threading = {
    init: function() {
      var node;
      node = $('form[name=delform] > *:not([id])');
      return threading.thread(node);
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
      if (node.nodeName === 'SPAN' || node.nodeName === 'IMG') {
        if (!(node.align || node.nodeName === 'CENTER')) {
          return threading.thread(node);
        }
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
        thread = e.target.parentNode.parentNode;
        return threadHiding.hide(thread);
      },
      show: function(e) {
        var thread;
        thread = e.target.parentNode.parentNode;
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
      html = "<div class=move><span id=count></span> <span id=timer></span></div>";
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
        var t;
        if (this.checked) {
          $.show($('#count'));
          return $('#timer').textContent = (t = updater.timer) ? t : 'Thread Updater';
        } else {
          $.hide($('#count'));
          return $('#timer').textContent = 'Thread Updater';
        }
      },
      autoUpdate: function(e) {
        var timer;
        timer = $('#timer');
        if (this.checked) {
          timer.textContent = '-' + $.config('Interval');
          return updater.intervalID = window.setInterval(updater.timeout, 1000);
        } else {
          timer.textContent = 'Thread Updater';
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
        if ($.config('Verbose')) {
          timer.textContent = '-' + $.config('Interval');
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
      var board, dialog, favicon, html, id, input, inputs, props, src, watched, watchedBoard, _i, _len, _ref, _results;
      html = '<div class=move>Thread Watcher</div>';
      dialog = ui.dialog('watcher', {
        top: '50px',
        left: '0px'
      }, html);
      $.append(d.body, dialog);
      watched = $.getValue('watched', {});
      for (board in watched) {
        _ref = watched[board];
        for (id in _ref) {
          props = _ref[id];
          watcher.addLink(props, dialog);
        }
      }
      watchedBoard = watched[g.BOARD] || {};
      inputs = $$('form > input[value=delete], div.thread > input[value=delete]');
      _results = [];
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        id = input.name;
        if (id in watchedBoard) {
          src = Favicon["default"];
        } else {
          src = Favicon.empty;
        }
        favicon = $.el('img', {
          src: src,
          className: 'favicon'
        });
        $.bind(favicon, 'click', watcher.cb.toggle);
        _results.push($.before(input, favicon));
      }
      return _results;
    },
    addLink: function(props, dialog) {
      var div, link, x;
      dialog || (dialog = $('#watcher'));
      div = $.el('div');
      x = $.el('a', {
        textContent: 'X'
      });
      $.bind(x, 'click', watcher.cb.x);
      link = $.el('a', props);
      $.append(div, x, $.tn(' '), link);
      return $.append(dialog, div);
    },
    cb: {
      toggle: function(e) {
        return watcher.toggle(e.target.parentNode);
      },
      x: function(e) {
        var board, id, _, _ref;
        _ref = e.target.nextElementSibling.getAttribute('href').substring(1).split('/'), board = _ref[0], _ = _ref[1], id = _ref[2];
        return watcher.unwatch(board, id);
      }
    },
    toggle: function(thread) {
      var favicon, id;
      favicon = $('img.favicon', thread);
      id = favicon.nextSibling.name;
      if (favicon.src === Favicon.empty) {
        return watcher.watch(thread);
      } else {
        return watcher.unwatch(g.BOARD, id);
      }
    },
    unwatch: function(board, id) {
      var div, favicon, href, input, watched;
      href = "/" + board + "/res/" + id;
      div = $("#watcher a[href=\"" + href + "\"]").parentNode;
      $.remove(div);
      if (input = $("input[name=\"" + id + "\"]")) {
        favicon = input.previousSibling;
        favicon.src = Favicon.empty;
      }
      watched = $.getValue('watched', {});
      delete watched[board][id];
      return $.setValue('watched', watched);
    },
    watch: function(thread) {
      var favicon, id, props, tc, watched, _name;
      favicon = $('img.favicon', thread);
      if (favicon.src === Favicon["default"]) {
        return;
      }
      favicon.src = Favicon["default"];
      id = favicon.nextSibling.name;
      tc = $('span.filetitle', thread).textContent || $('blockquote', thread).textContent;
      props = {
        textContent: "/" + g.BOARD + "/ - " + tc.slice(0, 25),
        href: "/" + g.BOARD + "/res/" + id
      };
      watched = $.getValue('watched', {});
      watched[_name = g.BOARD] || (watched[_name] = {});
      watched[g.BOARD][id] = props;
      $.setValue('watched', watched);
      return watcher.addLink(props);
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
        var i, link, names, prefix, prefixes, span, suffix, _i, _len, _ref, _results;
        prefixes = $.config('flavors').split('\n');
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
            var _len, _results;
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
            textContent: '[ ! ]'
          });
          $.bind(a, 'click', quickReport.cb.report);
          $.after(el, a);
          _results.push($.after(el, $.tn(' ')));
        }
        return _results;
      },
      report: function(e) {
        var target;
        target = e.target;
        return quickReport.report(target);
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
      case 'c':
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
      var el, recaptcha, _i, _len, _ref;
      _ref = $$('#recaptcha_table a');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
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
    var callback, dialog, target, _i, _len, _ref, _results;
    target = e.target;
    if (target.nodeName === 'TABLE') {
      _ref = g.callbacks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback(target));
      }
      return _results;
    } else if (target.id === 'recaptcha_challenge_field' && (dialog = $('#qr'))) {
      $('#recaptcha_image img', dialog).src = "http://www.google.com/recaptcha/api/image?c=" + target.value;
      return $('#recaptcha_challenge_field', dialog).value = target.value;
    }
  };
  imageHover = {
    init: function() {
      var img;
      img = $.el('img', {
        id: 'iHover'
      });
      $.hide(img);
      d.body.appendChild(img);
      return g.callbacks.push(imageHover.cb.node);
    },
    offset: {
      x: 45,
      y: -120
    },
    cb: {
      node: function(root) {
        var thumb, thumbs, _i, _len, _results;
        thumbs = $$('img[md5]', root);
        _results = [];
        for (_i = 0, _len = thumbs.length; _i < _len; _i++) {
          thumb = thumbs[_i];
          _results.push($.bind(thumb, 'mouseover', imageHover.cb.mouseover));
        }
        return _results;
      },
      mouseover: function(e) {
        var clientX, clientY, img, target;
        target = e.target, clientX = e.clientX, clientY = e.clientY;
        img = $('#iHover');
        img.src = target.parentNode.href;
        $.show(img);
        imageHover.winHeight = d.body.clientHeight;
        imageHover.winWidth = d.body.clientWidth;
        $.bind(target, 'mousemove', imageHover.cb.mousemove);
        return $.bind(target, 'mouseout', imageHover.cb.mouseout);
      },
      mousemove: function(e) {
        var bot, clientX, clientY, img, imgHeight, top;
        clientX = e.clientX, clientY = e.clientY;
        img = $('#iHover');
        imgHeight = img.offsetHeight;
        top = clientY + imageHover.offset.y;
        bot = top + imgHeight;
        img.style.top = imageHover.winHeight < imgHeight || top < 0 ? '0px' : bot > imageHover.winHeight ? imageHover.winHeight - imgHeight + 'px' : top + 'px';
        return img.style.left = clientX + imageHover.offset.x;
      },
      mouseout: function(e) {
        var img, target;
        target = e.target;
        img = $('#iHover');
        $.hide(img);
        img.src = null;
        $.unbind(target, 'mousemove', imageHover.cb.mousemove);
        return $.unbind(target, 'mouseout', imageHover.cb.mouseout);
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
        var thumb, _i, _len, _ref, _results;
        _ref = $$('img[md5]', root);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thumb = _ref[_i];
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
        return imgExpand.toggle(e.target);
      },
      all: function(e) {
        var thumb, thumbs, _i, _j, _len, _len2, _results, _results2;
        thumbs = $$('img[md5]');
        imgExpand.on = e.target.checked;
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
        var img, _i, _len, _ref, _results;
        imgExpand.foo();
        _ref = $$('img[md5] + img');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          img = _ref[_i];
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
      var borderLeftWidth, borderRightWidth, crap, formWidth, left, paddingLeft, paddingRight, table, td, _ref;
      formWidth = $('form[name=delform]').getBoundingClientRect().width;
      td = $('td.reply');
      table = td.parentNode.parentNode.parentNode;
      left = td.getBoundingClientRect().left - table.getBoundingClientRect().left;
      _ref = getComputedStyle(td), paddingLeft = _ref.paddingLeft, paddingRight = _ref.paddingRight, borderLeftWidth = _ref.borderLeftWidth, borderRightWidth = _ref.borderRightWidth;
      crap = parseInt(paddingLeft) + parseInt(paddingRight) + parseInt(borderLeftWidth) + parseInt(borderRightWidth);
      imgExpand.maxWidth = formWidth - left - crap;
      imgExpand.maxHeight = d.body.clientHeight;
      return imgExpand.type = $('#imageType').value;
    },
    resize: function(img) {
      var imgHeight, imgWidth, maxHeight, maxWidth, ratio, type, _, _ref;
      maxWidth = imgExpand.maxWidth, maxHeight = imgExpand.maxHeight, type = imgExpand.type;
      _ref = $.x("preceding::span[@class][1]/text()[2]", img).textContent.match(/(\d+)x(\d+)/), _ = _ref[0], imgWidth = _ref[1], imgHeight = _ref[2];
      imgWidth = Number(imgWidth);
      imgHeight = Number(imgHeight);
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
      var controls, delform, imageType, option, _i, _len, _ref;
      controls = $.el('div', {
        id: 'imgControls',
        innerHTML: "<select id=imageType name=imageType><option>full</option><option>fit width</option><option>fit screen</option></select>        <label>Expand Images<input type=checkbox id=imageExpand></label>"
      });
      imageType = $.getValue('imageType', 'full');
      _ref = $$('option', controls);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
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
      var DAY, callback, cutoff, hiddenThreads, id, lastChecked, navtopr, now, pathname, temp, timestamp, tzOffset, _i, _len, _ref, _ref2;
      Favicon.halo = /ws/.test(Favicon["default"]) ? Favicon.haloSFW : Favicon.haloNSFW;
      pathname = location.pathname.substring(1).split('/');
      g.BOARD = pathname[0], temp = pathname[1];
      if (temp === 'res') {
        g.REPLY = temp;
        g.THREAD_ID = pathname[2];
      } else {
        g.PAGENUM = parseInt(temp) || 0;
      }
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
        _ref = g.hiddenReplies;
        for (id in _ref) {
          timestamp = _ref[id];
          if (timestamp < cutoff) {
            delete g.hiddenReplies[id];
          }
        }
        $.setValue("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
        $.setValue("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
        $.setValue('lastChecked', now);
      }
      $.addStyle(main.css);
      if (location.hostname === 'sys.4chan.org') {
        qr.sys();
        return;
      }
      if (navtopr = $('#navtopr')) {
        options.init();
      } else if ($.config('404 Redirect') && d.title === '4chan - 404' && /^\d+$/.test(g.THREAD_ID)) {
        redirect();
      } else {
        return;
      }
      Recaptcha.init();
      $.bind($('form[name=post]'), 'submit', qr.cb.submit);
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
      if ($.config('Thread Watcher')) {
        watcher.init();
      }
      if ($.config('Keybinds')) {
        keybinds.init();
      }
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
        if ($.config('Auto Watch') && location.hash === '#watch') {
          watcher.watch();
        }
      } else {
        threading.init();
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
      _ref2 = g.callbacks;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        callback = _ref2[_i];
        callback();
      }
      return $.bind(d.body, 'DOMNodeInserted', nodeInserted);
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
      #iHover {\
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
      #qr > form > div, /* ad */\
      #qr #recaptcha_table td:nth-of-type(3), /* captcha logos */\
      #qr td.rules {\
        display: none;\
      }\
      #qr.auto:not(:hover) form {\
        display: none;\
      }\
      #qr span.error {\
        position: absolute;\
        bottom: 0;\
        left: 0;\
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
      body.noselect {\
        -webkit-user-select: none;\
        -khtml-user-select: none;\
        -moz-user-select: none;\
        -o-user-select: none;\
        user-select: none;\
      }\
    '
  };
  main.init();
}).call(this);
