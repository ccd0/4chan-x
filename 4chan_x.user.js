// ==UserScript==
// @name           4chan x
// @version        2.24.4
// @namespace      aeosynth
// @description    Adds various features.
// @copyright      2009-2011 James Campos <james.r.campos@gmail.com>
// @license        MIT; http://en.wikipedia.org/wiki/Mit_license
// @include        http://boards.4chan.org/*
// @include        http://images.4chan.org/*
// @include        http://sys.4chan.org/*
// @run-at         document-start
// @updateURL      https://raw.github.com/MayhemYDG/4chan-x/stable/4chan_x.user.js
// @icon           http://mayhemydg.github.com/4chan-x/favicon.gif
// ==/UserScript==

/* LICENSE
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
 * http://mayhemydg.github.com/4chan-x/
 * 4chan X 2.24.4
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
 *
 * HACKING
 *
 * 4chan X is written in CoffeeScript[1], and developed on GitHub[2].
 *
 * [1]: http://coffeescript.org/
 * [2]: https://github.com/MayhemYDG/4chan-x
 *
 * CONTRIBUTORS
 *
 * seaweed - bottom padding for image hover
 * e000 - cooldown sanity check
 * ahokadesuka - scroll back when unexpanding images
 * Shou- - pentadactyl fixes
 * ferongr - new favicons
 * xat- - new favicons
 * Zixaphir - fix qr textarea - captcha-image gap
 * Ongpot - sfw favicon
 * thisisanon - nsfw + 404 favicons
 * Anonymous - empty favicon
 * Seiba - chrome quick reply focusing
 * herpaderpderp - recaptcha fixes
 * WakiMiko - recaptcha tab order http://userscripts.org/scripts/show/82657
 *
 * All the people who've taken the time to write bug reports.
 *
 * Thank you.
 */

(function() {
  var $, $$, DAY, Favicon, HOUR, MINUTE, Main, NAMESPACE, SECOND, Time, VERSION, anonymize, conf, config, d, engine, expandComment, expandThread, filter, flatten, g, getTitle, imgExpand, imgGif, imgHover, key, keybinds, log, nav, options, qr, quoteBacklink, quoteDR, quoteInline, quoteOP, quotePreview, redirect, replyHiding, reportButton, revealSpoilers, sauce, strikethroughQuotes, threadHiding, threadStats, threading, titlePost, ui, unread, updater, val, watcher, _base,
    __slice = Array.prototype.slice;

  config = {
    main: {
      Enhancing: {
        '404 Redirect': [true, 'Redirect dead threads and images'],
        'Keybinds': [true, 'Binds actions to keys'],
        'Time Formatting': [true, 'Arbitrarily formatted timestamps, using your local time'],
        'Report Button': [true, 'Add report buttons'],
        'Comment Expansion': [true, 'Expand too long comments'],
        'Thread Expansion': [true, 'View all replies'],
        'Index Navigation': [true, 'Navigate to previous / next thread'],
        'Reply Navigation': [false, 'Navigate to top / bottom of thread'],
        'Check for Updates': [true, 'Check for updated versions of 4chan X']
      },
      Filtering: {
        'Anonymize': [false, 'Make everybody anonymous'],
        'Filter': [false, 'Self-moderation placebo'],
        'Filter OPs': [false, 'Filter OPs along with their threads'],
        'Reply Hiding': [true, 'Hide single replies'],
        'Thread Hiding': [true, 'Hide entire threads'],
        'Show Stubs': [true, 'Of hidden threads / replies']
      },
      Imaging: {
        'Image Auto-Gif': [false, 'Animate gif thumbnails'],
        'Image Expansion': [true, 'Expand images'],
        'Image Hover': [false, 'Show full image on mouseover'],
        'Sauce': [true, 'Add sauce to images'],
        'Reveal Spoilers': [false, 'Replace spoiler thumbnails by the original thumbnail']
      },
      Monitoring: {
        'Thread Updater': [true, 'Update threads. Has more options in its own dialog.'],
        'Unread Count': [true, 'Show unread post count in tab title'],
        'Post in Title': [true, 'Show the op\'s post in the tab title'],
        'Thread Stats': [true, 'Display reply and image count'],
        'Thread Watcher': [true, 'Bookmark threads'],
        'Auto Watch': [true, 'Automatically watch threads that you start'],
        'Auto Watch Reply': [false, 'Automatically watch threads that you reply to']
      },
      Posting: {
        'Quick Reply': [true, 'Reply without leaving the page.'],
        'Cooldown': [true, 'Prevent "flood detected" errors.'],
        'Persistent QR': [false, 'The Quick reply won\'t disappear after posting.'],
        'Auto Hide QR': [true, 'Automatically hide the quick reply when posting.'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.']
      },
      Quoting: {
        'Quote Backlinks': [true, 'Add quote backlinks'],
        'OP Backlinks': [false, 'Add backlinks to the OP'],
        'Quote Highlighting': [true, 'Highlight the previewed post'],
        'Quote Inline': [true, 'Show quoted post inline on quote click'],
        'Quote Preview': [true, 'Show quote content on hover'],
        'Indicate OP quote': [true, 'Add \'(OP)\' to OP quotes'],
        'Indicate Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes'],
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks']
      }
    },
    filter: {
      name: '',
      tripcode: '',
      email: '',
      subject: '',
      comment: '',
      filename: '',
      filesize: '',
      md5: ''
    },
    flavors: ['http://iqdb.org/?url=', 'http://google.com/searchbyimage?image_url=', '#http://tineye.com/search?url=', '#http://saucenao.com/search.php?db=999&url=', '#http://3d.iqdb.org/?url=', '#http://regex.info/exif.cgi?imgurl=', '#http://imgur.com/upload?url=', '#http://ompldr.org/upload?url1='].join('\n'),
    time: '%m/%d/%y(%a)%H:%M',
    backlink: '>>%id',
    favicon: 'ferongr',
    hotkeys: {
      openOptions: 'ctrl+o',
      close: 'Esc',
      spoiler: 'ctrl+s',
      openQR: 'i',
      openEmptyQR: 'I',
      submit: 'alt+s',
      nextReply: 'J',
      previousReply: 'K',
      nextThread: 'n',
      previousThread: 'p',
      nextPage: 'L',
      previousPage: 'H',
      zero: '0',
      openThreadTab: 'o',
      openThread: 'O',
      expandThread: 'e',
      watch: 'w',
      hide: 'x',
      expandImages: 'm',
      expandAllImages: 'M',
      update: 'u',
      unreadCountTo0: 'z'
    },
    updater: {
      checkbox: {
        'Scrolling': [false, 'Scroll updated posts into view. Only enabled at bottom of page.'],
        'Scroll BG': [false, 'Scroll background tabs'],
        'Verbose': [true, 'Show countdown timer, new post count'],
        'Auto Update': [true, 'Automatically fetch new posts']
      },
      'Interval': 30
    }
  };

  log = typeof (_base = console.log).bind === "function" ? _base.bind(console) : void 0;

  conf = {};

  (flatten = function(parent, obj) {
    var key, val, _results;
    if (obj.length) {
      if (typeof obj[0] === 'boolean') {
        return conf[parent] = obj[0];
      } else {
        return conf[parent] = obj;
      }
    } else if (typeof obj === 'object') {
      _results = [];
      for (key in obj) {
        val = obj[key];
        _results.push(flatten(key, val));
      }
      return _results;
    } else {
      return conf[parent] = obj;
    }
  })(null, config);

  NAMESPACE = '4chan_x.';

  VERSION = '2.24.4';

  SECOND = 1000;

  MINUTE = 60 * SECOND;

  HOUR = 60 * MINUTE;

  DAY = 24 * HOUR;

  engine = /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase();

  d = document;

  g = {
    callbacks: []
  };

  ui = {
    dialog: function(id, position, html) {
      var el, saved;
      el = d.createElement('div');
      el.className = 'reply dialog';
      el.innerHTML = html;
      el.id = id;
      el.style.cssText = (saved = localStorage["" + NAMESPACE + id + ".position"]) ? saved : position;
      el.querySelector('div.move').addEventListener('mousedown', ui.dragstart, false);
      return el;
    },
    dragstart: function(e) {
      var el, rect;
      e.preventDefault();
      ui.el = el = this.parentNode;
      d.addEventListener('mousemove', ui.drag, false);
      d.addEventListener('mouseup', ui.dragend, false);
      rect = el.getBoundingClientRect();
      ui.dx = e.clientX - rect.left;
      ui.dy = e.clientY - rect.top;
      ui.width = d.body.clientWidth - el.offsetWidth;
      return ui.height = d.body.clientHeight - el.offsetHeight;
    },
    drag: function(e) {
      var bottom, left, right, style, top;
      left = e.clientX - ui.dx;
      top = e.clientY - ui.dy;
      left = left < 10 ? 0 : ui.width - left < 10 ? null : left;
      top = top < 10 ? 0 : ui.height - top < 10 ? null : top;
      right = left === null ? 0 : null;
      bottom = top === null ? 0 : null;
      style = ui.el.style;
      style.top = top;
      style.right = right;
      style.bottom = bottom;
      return style.left = left;
    },
    dragend: function() {
      var el;
      el = ui.el;
      localStorage["" + NAMESPACE + el.id + ".position"] = el.style.cssText;
      d.removeEventListener('mousemove', ui.drag, false);
      return d.removeEventListener('mouseup', ui.dragend, false);
    },
    hover: function(e) {
      var clientHeight, clientWidth, clientX, clientY, el, height, style, top, _ref;
      clientX = e.clientX, clientY = e.clientY;
      el = ui.el;
      style = el.style;
      _ref = d.body, clientHeight = _ref.clientHeight, clientWidth = _ref.clientWidth;
      height = el.offsetHeight;
      top = clientY - 120;
      style.top = clientHeight < height || top < 0 ? 0 : top + height > clientHeight ? clientHeight - height : top;
      if (clientX < clientWidth - 400) {
        style.left = clientX + 45;
        return style.right = null;
      } else {
        style.left = null;
        return style.right = clientWidth - clientX + 45;
      }
    },
    hoverend: function() {
      return ui.el.parentNode.removeChild(ui.el);
    }
  };

  /*
  loosely follows the jquery api:
  http://api.jquery.com/
  not chainable
  */

  $ = function(selector, root) {
    if (root == null) root = d.body;
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
    ready: function(fc) {
      var cb;
      if (/interactive|complete/.test(d.readyState)) return fc();
      cb = function() {
        $.off(d, 'DOMContentLoaded', cb);
        return fc();
      };
      return $.on(d, 'DOMContentLoaded', cb);
    },
    id: function(id) {
      return d.getElementById(id);
    },
    ajax: function(url, cb, opts) {
      var event, form, headers, key, onprogress, r, type, val;
      if (opts == null) opts = {};
      type = opts.type, event = opts.event, headers = opts.headers, form = opts.form, onprogress = opts.onprogress;
      type || (type = 'get');
      event || (event = 'onload');
      r = new XMLHttpRequest();
      r.open(type, url, true);
      for (key in headers) {
        val = headers[key];
        r.setRequestHeader(key, val);
      }
      r[event] = cb;
      r.upload.onprogress = onprogress;
      r.send(form);
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
        req = $.ajax(url, (function() {
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
        $.set(this.name, this.checked);
        return conf[this.name] = this.checked;
      },
      value: function() {
        $.set(this.name, this.value);
        return conf[this.name] = this.value;
      }
    },
    addStyle: function(css) {
      var style;
      style = $.el('style', {
        textContent: css
      });
      $.add(d.head, style);
      return style;
    },
    x: function(path, root) {
      if (root == null) root = d.body;
      return d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
    },
    tn: function(s) {
      return d.createTextNode(s);
    },
    replace: function(root, el) {
      return root.parentNode.replaceChild(el, root);
    },
    addClass: function(el, className) {
      return el.classList.add(className);
    },
    removeClass: function(el, className) {
      return el.classList.remove(className);
    },
    rm: function(el) {
      return el.parentNode.removeChild(el);
    },
    add: function() {
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
      if (properties) $.extend(el, properties);
      return el;
    },
    on: function(el, eventType, handler) {
      return el.addEventListener(eventType, handler, false);
    },
    off: function(el, eventType, handler) {
      return el.removeEventListener(eventType, handler, false);
    },
    isDST: function() {
      /*
            http://en.wikipedia.org/wiki/Eastern_Time_Zone
            Its UTC time offset is −5 hrs (UTC−05) during standard time and −4
            hrs (UTC−04) during daylight saving time.
      
            Since 2007, the local time changes at 02:00 EST to 03:00 EDT on the second
            Sunday in March and returns at 02:00 EDT to 01:00 EST on the first Sunday
            in November, in the U.S. as well as in Canada.
      
            0200 EST (UTC-05) = 0700 UTC
            0200 EDT (UTC-04) = 0600 UTC
      */
      var D, date, day, hours, month, sunday;
      D = new Date();
      date = D.getUTCDate();
      day = D.getUTCDay();
      hours = D.getUTCHours();
      month = D.getUTCMonth();
      if (month < 2 || 10 < month) return false;
      if ((2 < month && month < 10)) return true;
      sunday = date - day;
      if (month === 2) {
        if (sunday < 8) return false;
        if (sunday < 15 && day === 0) {
          if (hours < 7) return false;
          return true;
        }
        return true;
      }
      if (sunday < 1) return true;
      if (sunday < 8 && day === 0) {
        if (hours < 6) return true;
        return false;
      }
      return false;
    }
  });

  $.cache.requests = {};

  $.extend($, typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null ? {
    "delete": function(name) {
      name = NAMESPACE + name;
      return GM_deleteValue(name);
    },
    get: function(name, defaultValue) {
      var value;
      name = NAMESPACE + name;
      if (value = GM_getValue(name)) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      name = NAMESPACE + name;
      localStorage[name] = JSON.stringify(value);
      return GM_setValue(name, JSON.stringify(value));
    }
  } : {
    "delete": function(name) {
      name = NAMESPACE + name;
      return delete localStorage[name];
    },
    get: function(name, defaultValue) {
      var value;
      name = NAMESPACE + name;
      if (value = localStorage[name]) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      name = NAMESPACE + name;
      return localStorage[name] = JSON.stringify(value);
    }
  });

  for (key in conf) {
    val = conf[key];
    conf[key] = $.get(key, val);
  }

  $$ = function(selector, root) {
    if (root == null) root = d.body;
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  };

  filter = {
    regexps: {},
    callbacks: [],
    init: function() {
      var f, filter, key, m, _i, _len;
      for (key in config.filter) {
        if (!(m = conf[key].match(/^\/.+\/\w*$/gm))) continue;
        this.regexps[key] = [];
        for (_i = 0, _len = m.length; _i < _len; _i++) {
          filter = m[_i];
          f = filter.match(/^\/(.+)\/(\w*)$/);
          try {
            this.regexps[key].push(RegExp(f[1], f[2]));
          } catch (e) {
            alert(e.message);
          }
        }
        this.callbacks.push(this[key]);
      }
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      if (!root.className) {
        if (filter.callbacks.some(function(callback) {
          return callback(root);
        })) {
          return replyHiding.hideHide($('td:not([nowrap])', root));
        }
      } else if (root.className === 'op' && !g.REPLY && conf['Filter OPs']) {
        if (filter.callbacks.some(function(callback) {
          return callback(root);
        })) {
          return threadHiding.hideHide(root.parentNode);
        }
      }
    },
    test: function(key, value) {
      return filter.regexps[key].some(function(regexp) {
        return regexp.test(value);
      });
    },
    name: function(root) {
      var name;
      name = root.className === 'op' ? $('.postername', root) : $('.commentpostername', root);
      return filter.test('name', name.textContent);
    },
    tripcode: function(root) {
      var trip;
      if (trip = $('.postertrip', root)) {
        return filter.test('tripcode', trip.textContent);
      }
    },
    email: function(root) {
      var mail;
      if (mail = $('.linkmail', root)) return filter.test('email', mail.href);
    },
    subject: function(root) {
      var sub;
      sub = root.className === 'op' ? $('.filetitle', root) : $('.replytitle', root);
      return filter.test('subject', sub.textContent);
    },
    comment: function(root) {
      return filter.test('comment', ($.el('a', {
        innerHTML: $('blockquote', root).innerHTML.replace(/<br>/g, '\n')
      })).textContent);
    },
    filename: function(root) {
      var file;
      if (file = $('.filesize span', root)) {
        return filter.test('filename', file.title);
      }
    },
    filesize: function(root) {
      var img;
      if (img = $('img[md5]', root)) return filter.test('filesize', img.alt);
    },
    md5: function(root) {
      var img;
      if (img = $('img[md5]', root)) {
        return filter.test('md5', img.getAttribute('md5'));
      }
    }
  };

  strikethroughQuotes = {
    init: function() {
      return g.callbacks.push(function(root) {
        var el, quote, _i, _len, _ref, _results;
        if (root.className === 'inline') return;
        _ref = $$('.quotelink', root);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          quote = _ref[_i];
          if (el = $.id(quote.hash.slice(1))) {
            if (el.parentNode.parentNode.parentNode.hidden) {
              _results.push($.addClass(quote, 'filtered'));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    }
  };

  expandComment = {
    init: function() {
      var a, _i, _len, _ref, _results;
      _ref = $$('.abbr a');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        _results.push($.on(a, 'click', expandComment.expand));
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
      var body, bq, quote, reply, _i, _j, _len, _len2, _ref, _ref2;
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
      _ref2 = $$('.quotelink', bq);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        quote = _ref2[_j];
        if (quote.getAttribute('href') === quote.hash) {
          quote.pathname = "/" + g.BOARD + "/res/" + threadID;
        }
        if (quote.hash.slice(1) === threadID) quote.innerHTML += '&nbsp;(OP)';
        if (conf['Quote Preview']) {
          $.on(quote, 'mouseover', quotePreview.mouseover);
          $.on(quote, 'mousemove', ui.hover);
          $.on(quote, 'mouseout', quotePreview.mouseout);
        }
        if (conf['Quote Inline']) $.on(quote, 'click', quoteInline.toggle);
      }
      return $.replace(a.parentNode.parentNode, bq);
    }
  };

  expandThread = {
    init: function() {
      var a, span, _i, _len, _ref, _results;
      _ref = $$('.omittedposts');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        span = _ref[_i];
        a = $.el('a', {
          textContent: "+ " + span.textContent,
          className: 'omittedposts',
          href: 'javascript:;'
        });
        $.on(a, 'click', expandThread.cb.toggle);
        _results.push($.replace(span, a));
      }
      return _results;
    },
    cb: {
      toggle: function() {
        var thread;
        thread = this.parentNode;
        return expandThread.toggle(thread);
      }
    },
    toggle: function(thread) {
      var a, backlink, num, pathname, prev, table, threadID, _i, _len, _ref, _ref2, _results;
      threadID = thread.firstChild.id;
      pathname = "/" + g.BOARD + "/res/" + threadID;
      a = $('.omittedposts', thread);
      switch (a.textContent[0]) {
        case '+':
          if ((_ref = $('.op .container', thread)) != null) _ref.innerHTML = '';
          a.textContent = a.textContent.replace('+', 'X Loading...');
          return $.cache(pathname, (function() {
            return expandThread.parse(this, pathname, thread, a);
          }));
        case 'X':
          a.textContent = a.textContent.replace('X Loading...', '+');
          return $.cache[pathname].abort();
        case '-':
          a.textContent = a.textContent.replace('-', '+');
          num = (function() {
            switch (g.BOARD) {
              case 'b':
                return 3;
              case 't':
                return 1;
              default:
                return 5;
            }
          })();
          table = $.x("following::br[@clear]/preceding::table[" + num + "]", a);
          while ((prev = table.previousSibling) && (prev.nodeName === 'TABLE')) {
            $.rm(prev);
          }
          _ref2 = $$('.op a.backlink');
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            backlink = _ref2[_i];
            if (!$.id(backlink.hash.slice(1))) {
              _results.push($.rm(backlink));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
      }
    },
    parse: function(req, pathname, thread, a) {
      var body, frag, href, link, next, quote, reply, _i, _j, _len, _len2, _ref, _ref2;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        $.off(a, 'click', expandThread.cb.toggle);
        return;
      }
      a.textContent = a.textContent.replace('X Loading...', '-');
      body = $.el('body', {
        innerHTML: req.responseText
      });
      frag = d.createDocumentFragment();
      _ref = $$('.reply', body);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reply = _ref[_i];
        _ref2 = $$('.quotelink', reply);
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          quote = _ref2[_j];
          if ((href = quote.getAttribute('href')) === quote.hash) {
            quote.pathname = pathname;
          } else if (href !== quote.href) {
            quote.href = "res/" + href;
          }
        }
        link = $('.quotejs', reply);
        link.href = "res/" + thread.firstChild.id + "#" + reply.id;
        link.nextSibling.href = "res/" + thread.firstChild.id + "#q" + reply.id;
        $.add(frag, reply.parentNode.parentNode.parentNode);
      }
      while ((next = a.nextSibling) && !next.clear) {
        $.rm(next);
      }
      return $.before(next, frag);
    }
  };

  replyHiding = {
    init: function() {
      return g.callbacks.push(function(root) {
        var a, dd, id, reply;
        if (!(dd = $('.doubledash', root))) return;
        dd.className = 'replyhider';
        a = $.el('a', {
          textContent: '[ - ]',
          href: 'javascript:;'
        });
        $.on(a, 'click', replyHiding.cb.hide);
        $.replace(dd.firstChild, a);
        reply = dd.nextSibling;
        id = reply.id;
        if (id in g.hiddenReplies) return replyHiding.hide(reply);
      });
    },
    cb: {
      hide: function() {
        var reply;
        reply = this.parentNode.nextSibling;
        return replyHiding.hide(reply);
      },
      show: function() {
        var div, table;
        div = this.parentNode;
        table = div.nextSibling;
        replyHiding.show(table);
        return $.rm(div);
      }
    },
    hide: function(reply) {
      var id, quote, _i, _len, _ref;
      replyHiding.hideHide(reply);
      id = reply.id;
      _ref = $$(".quotelink[href='#" + id + "'], .backlink[href='#" + id + "']");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        $.addClass(quote, 'filtered');
      }
      g.hiddenReplies[id] = Date.now();
      return $.set("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
    },
    hideHide: function(reply) {
      var a, div, name, table, trip, _ref;
      table = reply.parentNode.parentNode.parentNode;
      if (table.hidden) return;
      table.hidden = true;
      if (conf['Show Stubs']) {
        name = $('.commentpostername', reply).textContent;
        trip = ((_ref = $('.postertrip', reply)) != null ? _ref.textContent : void 0) || '';
        a = $.el('a', {
          innerHTML: "<span>[ + ]</span> " + name + " " + trip,
          href: 'javascript:;'
        });
        $.on(a, 'click', replyHiding.cb.show);
        div = $.el('div', {
          className: 'stub'
        });
        $.add(div, a);
        return $.before(table, div);
      }
    },
    show: function(table) {
      var id, quote, _i, _len, _ref;
      table.hidden = false;
      id = $('td[id]', table).id;
      _ref = $$(".quotelink[href='#" + id + "'], .backlink[href='#" + id + "']");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        $.removeClass(quote, 'filtered');
      }
      delete g.hiddenReplies[id];
      return $.set("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
    }
  };

  keybinds = {
    init: function() {
      var node, _i, _len, _ref;
      _ref = $$('[accesskey]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.removeAttribute('accesskey');
      }
      return $.on(d, 'keydown', keybinds.keydown);
    },
    keydown: function(e) {
      var o, range, selEnd, selStart, ta, thread, valEnd, valMid, valStart, value, _ref, _ref2;
      updater.focus = true;
      if (!(key = keybinds.keyCode(e)) || /TEXTAREA|INPUT/.test(e.target.nodeName) && !(e.altKey || e.ctrlKey || e.keyCode === 27)) {
        return;
      }
      thread = nav.getThread();
      switch (key) {
        case conf.openOptions:
          if (!$.id('overlay')) options.dialog();
          break;
        case conf.close:
          if (o = $.id('overlay')) {
            $.rm(o);
          } else if (qr.el) {
            qr.close();
          }
          break;
        case conf.spoiler:
          ta = e.target;
          if (ta.nodeName !== 'TEXTAREA') return;
          value = ta.value;
          selStart = ta.selectionStart;
          selEnd = ta.selectionEnd;
          valStart = value.slice(0, selStart) + '[spoiler]';
          valMid = value.slice(selStart, selEnd);
          valEnd = '[/spoiler]' + value.slice(selEnd);
          ta.value = valStart + valMid + valEnd;
          range = valStart.length + valMid.length;
          ta.setSelectionRange(range, range);
          break;
        case conf.zero:
          window.location = "/" + g.BOARD + "/0#0";
          break;
        case conf.openEmptyQR:
          keybinds.qr(thread);
          break;
        case conf.openQR:
          keybinds.qr(thread, true);
          break;
        case conf.nextReply:
          keybinds.hl.next(thread);
          break;
        case conf.previousReply:
          keybinds.hl.prev(thread);
          break;
        case conf.expandAllImages:
          keybinds.img(thread, true);
          break;
        case conf.openThread:
          keybinds.open(thread);
          break;
        case conf.expandThread:
          expandThread.toggle(thread);
          break;
        case conf.expandImages:
          keybinds.img(thread);
          break;
        case conf.nextThread:
          if (g.REPLY) return;
          nav.scroll(+1);
          break;
        case conf.openThreadTab:
          keybinds.open(thread, true);
          break;
        case conf.previousThread:
          if (g.REPLY) return;
          nav.scroll(-1);
          break;
        case conf.update:
          updater.update();
          break;
        case conf.watch:
          watcher.toggle(thread);
          break;
        case conf.hide:
          threadHiding.toggle(thread);
          break;
        case conf.nextPage:
          if ((_ref = $('input[value=Next]')) != null) _ref.click();
          break;
        case conf.previousPage:
          if ((_ref2 = $('input[value=Previous]')) != null) _ref2.click();
          break;
        case conf.submit:
          if (qr.el) qr.submit();
          break;
        case conf.unreadCountTo0:
          unread.replies = [];
          unread.updateTitle();
          Favicon.update();
          break;
        default:
          return;
      }
      return e.preventDefault();
    },
    keyCode: function(e) {
      var c, kc;
      key = (function() {
        switch (kc = e.keyCode) {
          case 8:
            return '';
          case 27:
            return 'Esc';
          case 37:
            return 'Left';
          case 38:
            return 'Up';
          case 39:
            return 'Right';
          case 40:
            return 'Down';
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
          case 65:
          case 66:
          case 67:
          case 68:
          case 69:
          case 70:
          case 71:
          case 72:
          case 73:
          case 74:
          case 75:
          case 76:
          case 77:
          case 78:
          case 79:
          case 80:
          case 81:
          case 82:
          case 83:
          case 84:
          case 85:
          case 86:
          case 87:
          case 88:
          case 89:
          case 90:
            c = String.fromCharCode(kc);
            if (e.shiftKey) {
              return c;
            } else {
              return c.toLowerCase();
            }
            break;
          default:
            return null;
        }
      })();
      if (key) {
        if (e.altKey) key = 'alt+' + key;
        if (e.ctrlKey) key = 'ctrl+' + key;
      }
      return key;
    },
    img: function(thread, all) {
      var thumb;
      if (all) {
        return $("#imageExpand").click();
      } else {
        thumb = $('img[md5]', $('.replyhl', thread) || thread);
        return imgExpand.toggle(thumb.parentNode);
      }
    },
    qr: function(thread, quote) {
      if (quote) {
        qr.quote.call($('.quotejs + .quotejs', $('.replyhl', thread) || thread));
      } else {
        qr.open();
      }
      if (!g.REPLY) qr.pickThread(thread.firstChild.id);
      return $('textarea', qr.el).focus();
    },
    open: function(thread, tab) {
      var id, open, url;
      id = thread.firstChild.id;
      url = "http://boards.4chan.org/" + g.BOARD + "/res/" + id;
      if (tab) {
        open = GM_openInTab || window.open;
        return open(url, "_blank");
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
            if ($.x('ancestor::div[@class="thread"]', next) !== thread) return;
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
        textContent: '▲',
        href: 'javascript:;'
      });
      next = $.el('a', {
        textContent: '▼',
        href: 'javascript:;'
      });
      $.on(prev, 'click', nav.prev);
      $.on(next, 'click', nav.next);
      $.add(span, prev, $.tn(' '), next);
      return $.add(d.body, span);
    },
    prev: function() {
      if (g.REPLY) {
        return window.scrollTo(0, 0);
      } else {
        return nav.scroll(-1);
      }
    },
    next: function() {
      if (g.REPLY) {
        return window.scrollTo(0, d.body.scrollHeight);
      } else {
        return nav.scroll(+1);
      }
    },
    threads: [],
    getThread: function(full) {
      var bottom, i, rect, thread, _len, _ref;
      nav.threads = $$('.thread:not([hidden])');
      _ref = nav.threads;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        thread = _ref[i];
        rect = thread.getBoundingClientRect();
        bottom = rect.bottom;
        if (bottom > 0) {
          if (full) return [thread, i, rect];
          return thread;
        }
      }
      return null;
    },
    scroll: function(delta) {
      var i, rect, thread, top, _ref, _ref2;
      _ref = nav.getThread(true), thread = _ref[0], i = _ref[1], rect = _ref[2];
      top = rect.top;
      if (!((delta === -1 && Math.ceil(top) < 0) || (delta === +1 && top > 1))) {
        i += delta;
      }
      top = (_ref2 = nav.threads[i]) != null ? _ref2.getBoundingClientRect().top : void 0;
      return window.scrollBy(0, top);
    }
  };

  qr = {
    init: function() {
      if (!$('form[name=post]')) return;
      g.callbacks.push(function(root) {
        return $.on($('.quotejs + .quotejs', root), 'click', qr.quote);
      });
      $.add(d.body, $.el('iframe', {
        id: 'iframe',
        hidden: true,
        src: 'http://sys.4chan.org/post'
      }));
      if (conf['Persistent QR']) {
        qr.dialog();
        if (conf['Auto Hide QR']) $.id('autohide').click();
      }
      $.on(d, 'dragover', qr.fileDrop);
      $.on(d, 'drop', qr.fileDrop);
      return window.location = 'javascript:void(Recaptcha.focus_response_field=function(){})';
    },
    open: function() {
      if (qr.el) {
        qr.el.hidden = false;
        $.id('autohide').checked = false;
        return qr.hide();
      } else {
        return qr.dialog();
      }
    },
    close: function() {
      var i, spoiler, _i, _len, _ref;
      qr.el.hidden = true;
      qr.message.send({
        abort: true
      });
      d.activeElement.blur();
      $.removeClass(qr.el, 'dump');
      _ref = qr.replies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        qr.replies[0].rm();
      }
      qr.status();
      qr.resetFileInput();
      if ((spoiler = $.id('spoiler')).checked) spoiler.click();
      return qr.cleanError();
    },
    hide: function() {
      if ($.id('autohide').checked) {
        return $.addClass(qr.el, 'autohide');
      } else {
        $.removeClass(qr.el, 'autohide');
        return d.activeElement.blur();
      }
    },
    error: function(err, node) {
      var el;
      el = $('.error', qr.el);
      el.textContent = err;
      if (node) $.replace(el.firstChild, node);
      qr.open();
      if (d.hidden || d.oHidden || d.mozHidden || d.webkitHidden) {
        return alert(err);
      }
    },
    cleanError: function() {
      return $('.error', qr.el).textContent = null;
    },
    status: function(data) {
      var disabled, value;
      if (g.dead) {
        value = 404;
        disabled = true;
      } else if (data) {
        if (data.progress != null) value = "" + data.progress + "%";
      }
      qr.status.input.value = value || 'Submit';
      return qr.status.input.disabled = disabled || false;
    },
    pickThread: function(thread) {
      return $('select', qr.el).value = thread;
    },
    quote: function(e) {
      var caretPos, id, s, sel, ta, text, _ref;
      if (e != null) e.preventDefault();
      qr.open();
      if (!g.REPLY) {
        qr.pickThread($.x('ancestor::div[@class="thread"]/div', this).id);
      }
      id = this.textContent;
      text = ">>" + id + "\n";
      sel = window.getSelection();
      if ((s = sel.toString()) && id === ((_ref = $.x('ancestor-or-self::blockquote/preceding-sibling::input', sel.anchorNode)) != null ? _ref.name : void 0)) {
        s = s.replace(/\n/g, '\n>');
        text += ">" + s + "\n";
      }
      ta = $('textarea', qr.el);
      caretPos = ta.selectionStart;
      ta.value = ta.value.slice(0, caretPos) + text + ta.value.slice(ta.selectionEnd, ta.value.length);
      ta.focus();
      ta.selectionEnd = ta.selectionStart = caretPos + text.length;
      qr.selected.com = ta.value;
      return qr.selected.el.lastChild.textContent = ta.value;
    },
    fileDrop: function(e) {
      if (/TEXTAREA|INPUT/.test(e.target.nodeName)) return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      if (e.type === 'drop') {
        if (!e.dataTransfer.files.length) return;
        qr.open();
        qr.fileInput.call(e.dataTransfer);
        return $.addClass(qr.el, 'dump');
      }
    },
    fileInput: function() {
      var file, _i, _len, _ref;
      qr.cleanError();
      if (this.files.length === 1) {
        file = this.files[0];
        if (file.size > this.max) {
          qr.error('File too large.');
          qr.resetFileInput();
        } else if (-1 === qr.mimeTypes.indexOf(file.type)) {
          qr.error('Unsupported file type.');
          qr.resetFileInput();
        } else {
          qr.selected.setFile(file);
        }
        return;
      }
      _ref = this.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.size > this.max) {
          qr.error("File " + file.name + " is too large.");
          break;
        } else if (-1 === qr.mimeTypes.indexOf(file.type)) {
          qr.error("" + file.name + ": Unsupported file type.");
          break;
        }
        if (!qr.replies[qr.replies.length - 1].file) {
          qr.replies[qr.replies.length - 1].setFile(file);
        } else {
          new qr.reply(file);
        }
      }
      $.addClass(qr.el, 'dump');
      if (this.multiple) return qr.resetFileInput();
    },
    resetFileInput: function() {
      return $('[type=file]', qr.el).value = null;
    },
    replies: [],
    reply: (function() {

      function _Class(file) {
        var persona, previous, _ref,
          _this = this;
        this.com = null;
        _ref = (previous = qr.replies[qr.replies.length - 1]) ? [previous.name, /^sage$/.test(previous.email) ? null : previous.email, conf['Remember Subject'] ? previous.sub : null, conf['Remember Spoiler'] ? previous.spoiler : false] : (persona = $.get('qr.persona', {})) ? [persona.name || null, persona.email || null, conf['Remember Subject'] ? persona.sub || null : null, false] : void 0, this.name = _ref[0], this.email = _ref[1], this.sub = _ref[2], this.spoiler = _ref[3];
        this.el = $.el('a', {
          className: 'preview',
          href: 'javascript:;',
          innerHTML: "<a class=remove>x</a><label hidden><input type=checkbox" + (this.spoiler ? ' checked' : '') + "> Spoiler</label><span></span>"
        });
        $.on(this.el, 'click', function() {
          return _this.select();
        });
        $.on($('.remove', this.el), 'click', function(e) {
          e.stopPropagation();
          return _this.rm();
        });
        $.on($('label', this.el), 'click', function(e) {
          return e.stopPropagation();
        });
        $.on($('input', this.el), 'change', function(e) {
          _this.spoiler = e.target.checked;
          if (_this.el.id === 'selected') {
            return $.id('spoiler').checked = _this.spoiler;
          }
        });
        if (file) this.setFile(file);
        $.before($('#addReply', qr.el), this.el);
        qr.replies.push(this);
      }

      _Class.prototype.setFile = function(file) {
        var url;
        this.file = file;
        this.el.title = file.name;
        if (file.type === 'application/pdf') {
          this.el.style.backgroundImage = null;
          return;
        }
        if (qr.spoiler) $('label', this.el).hidden = false;
        url = window.URL || window.webkitURL;
        url.revokeObjectURL(this.url);
        this.url = url.createObjectURL(file);
        return this.el.style.backgroundImage = "url(" + this.url + ")";
      };

      _Class.prototype.select = function() {
        var data, _i, _len, _ref, _ref2;
        if ((_ref = qr.selected) != null) _ref.el.id = null;
        qr.selected = this;
        this.el.id = 'selected';
        _ref2 = ['name', 'email', 'sub', 'com'];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          data = _ref2[_i];
          $("[name=" + data + "]", qr.el).value = this[data];
        }
        return $('#spoiler', qr.el).checked = this.spoiler;
      };

      _Class.prototype.rm = function() {
        var index, url;
        qr.resetFileInput();
        $.rm(this.el);
        index = qr.replies.indexOf(this);
        if (qr.replies.length === 1) {
          new qr.reply().select();
        } else if (this.el.id === 'selected') {
          (qr.replies[index - 1] || qr.replies[index + 1]).select();
        }
        qr.replies.splice(index, 1);
        url = window.URL || window.webkitURL;
        url.revokeObjectURL(this.url);
        return delete this;
      };

      return _Class;

    })(),
    captcha: {
      init: function() {
        var _this = this;
        this.img = $('.captcha > img', qr.el);
        this.input = $('[name=captcha]', qr.el);
        this.challenge = $.id('recaptcha_challenge_field_holder');
        $.on(this.img.parentNode, 'click', this.reload);
        $.on(this.input, 'keydown', this.keydown);
        $.on(this.challenge, 'DOMNodeInserted', function() {
          return _this.load();
        });
        $.on(window, 'storage', function(e) {
          if (e.key === ("" + NAMESPACE + "captchas")) {
            return _this.count(JSON.parse(e.newValue).length);
          }
        });
        this.count($.get('captchas', []).length);
        return this.load();
      },
      save: function() {
        var captcha, captchas, response;
        if (!(response = this.input.value)) return;
        captchas = $.get('captchas', []);
        while ((captcha = captchas[0]) && captcha.time < Date.now()) {
          captchas.shift();
        }
        captchas.push({
          challenge: this.challenge.firstChild.value,
          response: response,
          time: this.timeout
        });
        $.set('captchas', captchas);
        this.count(captchas.length);
        return this.reload();
      },
      load: function() {
        var challenge;
        this.timeout = Date.now() + 25 * MINUTE;
        challenge = this.challenge.firstChild.value;
        this.img.alt = challenge;
        this.img.src = "http://www.google.com/recaptcha/api/image?c=" + challenge;
        return this.input.value = null;
      },
      count: function(count) {
        var s;
        s = count === 1 ? '' : 's';
        return this.input.placeholder = "Verification (" + count + " cached captcha" + s + ")";
      },
      reload: function() {
        window.location = 'javascript:Recaptcha.reload()';
        return qr.captcha.input.focus();
      },
      keydown: function(e) {
        var c;
        c = qr.captcha;
        if (e.keyCode === 8 && !c.input.value) {
          c.reload();
        } else if (e.keyCode === 13 && e.shiftKey) {
          c.save();
        } else {
          return;
        }
        return e.preventDefault();
      }
    },
    dialog: function() {
      var input, mimeTypes, thread, threads, _i, _j, _len, _len2, _ref, _ref2;
      if (!g.REPLY) {
        threads = '<option value=new>New thread</option>';
        _ref = $$('.op');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thread = _ref[_i];
          threads += "<option value=" + thread.id + ">Thread " + thread.id + "</option>";
        }
        threads = "<select>" + threads + "</select>";
      }
      mimeTypes = $('.rules').textContent.toLowerCase().match(/: (.+) /)[1].replace(/\w+/g, function(type) {
        switch (type) {
          case 'jpg':
            return 'image/jpeg';
          case 'pdf':
            return 'application/pdf';
          default:
            return 'image/' + type;
        }
      });
      qr.mimeTypes = mimeTypes.split(', ');
      qr.spoiler = !!$('#com_submit + label');
      qr.el = ui.dialog('qr', 'top:0;right:0;', "<div class=move>  Quick Reply <input type=checkbox name=autohide id=autohide title=Auto-hide>  <span>" + (g.REPLY ? '' : threads) + " <a class=close>x</a></span></div><form>  <div><input id=dump class=field type=button title='Dump mode' value=+><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>  <output id=replies><div><a id=addReply href=javascript:;>+</a></div></output>  <div><textarea name=com title=Comment placeholder=Comment class=field></textarea></div>  <div class=captcha title=Reload><img></div>  <div><input name=captcha title=Verification class=field autocomplete=off size=1></div>  <div><input type=file name=upfile max=" + ($('[name=MAX_FILE_SIZE]').value) + " accept='" + mimeTypes + "' multiple><input type=submit></div>  <label" + (qr.spoiler ? '' : ' hidden') + "><input type=checkbox id=spoiler> Spoiler Image?</label>  <div class=error></div></form>");
      if (!g.REPLY) {
        $.on($('select', qr.el), 'mousedown', function(e) {
          return e.stopPropagation();
        });
      }
      $.on($('#autohide', qr.el), 'click', qr.hide);
      $.on($('.close', qr.el), 'click', qr.close);
      $.on($('#dump', qr.el), 'click', function() {
        return qr.el.classList.toggle('dump');
      });
      $.on($('#addReply', qr.el), 'click', function() {
        return new qr.reply().select();
      });
      $.on($('form', qr.el), 'submit', qr.submit);
      $.on($('textarea', qr.el), 'change', function() {
        return qr.selected.el.lastChild.textContent = this.value;
      });
      $.on($('[type=file]', qr.el), 'change', qr.fileInput);
      $.on($('#spoiler', qr.el), 'change', function() {
        return $('input', qr.selected.el).click();
      });
      new qr.reply().select();
      _ref2 = ['name', 'email', 'sub', 'com'];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        input = _ref2[_j];
        $.on($("[name=" + input + "]", qr.el), 'change', function() {
          return qr.selected[this.name] = this.value;
        });
      }
      qr.status.input = $('[type=submit]', qr.el);
      qr.status();
      qr.captcha.init();
      qr.message.init();
      return $.add(d.body, qr.el);
    },
    submit: function(e) {
      var captcha, captchas, challenge, err, file, m, post, reader, reply, response, threadID;
      if (e != null) e.preventDefault();
      qr.message.send({
        abort: true
      });
      reply = qr.replies[0];
      if (!(reply.com || reply.file)) {
        err = 'Error: No file selected.';
      } else {
        captchas = $.get('captchas', []);
        while ((captcha = captchas[0]) && captcha.time < Date.now()) {
          captchas.shift();
        }
        if (captcha = captchas.shift()) {
          challenge = captcha.challenge;
          response = captcha.response;
        } else {
          challenge = qr.captcha.img.alt;
          if (response = qr.captcha.input.value) qr.captcha.reload();
        }
        $.set('captchas', captchas);
        qr.captcha.count(captchas.length);
        if (!response) err = 'Error: No valid captcha.';
      }
      if (err) {
        qr.error(err);
        return;
      }
      qr.cleanError();
      threadID = g.THREAD_ID || $('select', qr.el).value;
      if (conf['Auto Hide QR'] && qr.replies.length === 1) {
        $.id('autohide').checked = true;
        qr.hide();
      }
      if (conf['Thread Watcher'] && conf['Auto Watch Reply'] && threadID !== 'new') {
        watcher.watch(threadID);
      }
      post = {
        board: g.BOARD,
        resto: threadID,
        name: reply.name,
        email: reply.email,
        sub: reply.sub,
        com: reply.com,
        upfile: reply.file,
        mode: 'regist',
        pwd: (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $('input[name=pwd]').value,
        recaptcha_challenge_field: challenge,
        recaptcha_response_field: response
      };
      if (engine === 'gecko' && reply.file) {
        file = {};
        reader = new FileReader();
        reader.onload = function() {
          file.buffer = this.result;
          file.name = reply.file.name;
          file.type = reply.file.type;
          post.upfile = file;
          return qr.message.send(post);
        };
        reader.readAsBinaryString(reply.file);
        return;
      }
      return qr.message.send(post);
    },
    response: function(html) {
      var b, err, node, persona, reply, sage;
      qr.status();
      if (!(b = $('td b', $.el('a', {
        innerHTML: html
      })))) {
        err = 'Connection error with sys.4chan.org.';
      } else if (b.childElementCount) {
        if (b.firstChild.tagName) node = b.firstChild;
        err = b.firstChild.textContent;
        log(b);
        console.dir(b);
      }
      if (err) {
        qr.error(err, node);
        return;
      }
      reply = qr.replies[0];
      sage = /sage/i.test(reply.email);
      persona = {
        name: reply.name,
        email: /^sage$/.test(reply.email) ? null : reply.email,
        sub: conf['Remember Subject'] ? reply.sub : null
      };
      $.set('qr.persona', persona);
      if (conf['Persistent QR'] || qr.replies.length > 1) {
        return reply.rm();
      } else {
        return qr.close();
      }
    },
    message: {
      init: function() {
        var code, script;
        code = function(e) {
          var data, host;
          data = e.data;
          if (!data.changeContext) return;
          delete data.changeContext;
          host = location.hostname;
          if (host === 'boards.4chan.org') {
            return document.getElementById('iframe').contentWindow.postMessage(data, '*');
          } else if (host === 'sys.4chan.org') {
            return parent.postMessage(data, '*');
          }
        };
        script = $.el('script', {
          textContent: "window.addEventListener('message'," + code + ",false)"
        });
        if (d.documentElement) {
          $.add(d.documentElement, script);
          $.rm(script);
          return;
        }
        return $.ready(function() {
          $.add(d.head, script);
          return $.rm(script);
        });
      },
      send: function(data) {
        data.changeContext = true;
        data.qr = true;
        return postMessage(data, '*');
      },
      receive: function(data) {
        var bb, form, i, l, name, ui8a, url, val, _ref;
        if (data.abort) {
          if ((_ref = qr.ajax) != null) _ref.abort();
          qr.message.send({
            status: true
          });
          return;
        }
        if (data.response) {
          qr.response(data.html);
          return;
        }
        if (data.status) qr.status(data);
        delete data.qr;
        if (data.mode === 'regist') {
          url = "http://sys.4chan.org/" + data.board + "/post?" + (Date.now());
          delete data.board;
          form = new FormData();
          if (engine === 'gecko' && data.upfile) {
            l = data.upfile.buffer.length;
            ui8a = new Uint8Array(l);
            for (i = 0; 0 <= l ? i < l : i > l; 0 <= l ? i++ : i--) {
              ui8a[i] = data.upfile.buffer.charCodeAt(i);
            }
            bb = new MozBlobBuilder();
            bb.append(ui8a.buffer);
            form.append('upfile', bb.getBlob(data.upfile.type), data.upfile.name);
            delete data.upfile;
          }
          for (name in data) {
            val = data[name];
            if (val) form.append(name, val);
          }
          return qr.ajax = $.ajax(url, (function() {
            return qr.message.send({
              response: true,
              html: this.response
            });
          }), {
            type: 'post',
            form: form,
            onprogress: function(e) {
              return qr.message.send({
                status: true,
                progress: Math.floor(e.loaded / e.total * 100)
              });
            }
          });
        }
      }
    }
  };

  options = {
    init: function() {
      var a, home;
      home = $('#navtopr a');
      a = $.el('a', {
        textContent: '4chan X',
        href: 'javascript:;'
      });
      $.on(a, 'click', options.dialog);
      $.replace(home, a);
      home = $('#navbotr a');
      a = $.el('a', {
        textContent: '4chan X',
        href: 'javascript:;'
      });
      $.on(a, 'click', options.dialog);
      $.replace(home, a);
      if (!$.get('firstrun')) {
        $.set('firstrun', true);
        return options.dialog();
      }
    },
    dialog: function() {
      var arr, back, checked, description, dialog, favicon, hiddenNum, hiddenThreads, indicator, indicators, input, key, li, obj, overlay, ta, time, ul, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _ref4;
      dialog = $.el('div', {
        id: 'options',
        className: 'reply dialog',
        innerHTML: '<div id=optionsbar>\
  <div id=credits>\
    <a target=_blank href=http://mayhemydg.github.com/4chan-x/>4chan X</a> | ' + VERSION + '\
    | <a target=_blank href=http://mayhemydg.github.com/4chan-x/#bug-report>Issues</a>\
  </div>\
  <div>\
    <label for=main_tab>Main</label>\
    | <label for=filter_tab>Filter</label>\
    | <label for=flavors_tab>Sauce</label>\
    | <label for=rice_tab>Rice</label>\
    | <label for=keybinds_tab>Keybinds</label>\
  </div>\
</div>\
<hr>\
<div id=content>\
  <input type=radio name=tab hidden id=main_tab checked>\
  <div></div>\
  <input type=radio name=tab hidden id=flavors_tab>\
  <div>\
    <div class=error><code>Sauce</code> is disabled.</div>\
    <textarea name=flavors id=flavors></textarea>\
  </div>\
  <input type=radio name=tab hidden id=filter_tab>\
  <div>\
    <div class=error><code>Filter</code> is disabled.</div>\
    Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>\
    For example, <code>/weeaboo/i</code> will filter posts containing `weeaboo` case-insensitive.\
    <p>Name:<br><textarea name=name></textarea></p>\
    <p>Tripcode:<br><textarea name=tripcode></textarea></p>\
    <p>E-mail:<br><textarea name=email></textarea></p>\
    <p>Subject:<br><textarea name=subject></textarea></p>\
    <p>Comment:<br><textarea name=comment></textarea></p>\
    <p>Filename:<br><textarea name=filename></textarea></p>\
    <p>Filesize:<br><textarea name=filesize></textarea></p>\
    <p>Image MD5:<br><textarea name=md5></textarea></p>\
  </div>\
  <input type=radio name=tab hidden id=rice_tab>\
  <div>\
    <div class=error><code>Quote Backlinks</code> are disabled.</div>\
    <ul>\
      Backlink formatting\
      <li><input type=text name=backlink> : <span id=backlinkPreview></span></li>\
    </ul>\
    <div class=error><code>Time Formatting</code> is disabled.</div>\
    <ul>\
      Time formatting\
      <li><input type=text name=time> : <span id=timePreview></span></li>\
      <li>Supported <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</li>\
      <li>Day: %a, %A, %d, %e</li>\
      <li>Month: %m, %b, %B</li>\
      <li>Year: %y</li>\
      <li>Hour: %k, %H, %l (lowercase L), %I (uppercase i), %p, %P</li>\
      <li>Minutes: %M</li>\
    </ul>\
    <div class=error><code>Unread Count</code> is disabled.</div>\
    Unread favicons<br>\
    <select name=favicon>\
      <option value=ferongr>ferongr</option>\
      <option value=xat->xat-</option>\
      <option value=Mayhem>Mayhem</option>\
      <option value=Original>Original</option>\
      <option value=None>None</option>\
    </select>\
    <span></span>\
  </div>\
  <input type=radio name=tab hidden id=keybinds_tab>\
  <div>\
    <div class=error><code>Keybinds</code> are disabled.</div>\
    <table><tbody>\
      <tr><th>Actions</th><th>Keybinds</th></tr>\
      <tr><td>Open Options</td><td><input name=openOptions></td></tr>\
      <tr><td>Close Options or QR</td><td><input name=close></td></tr>\
      <tr><td>Quick spoiler</td><td><input name=spoiler></td></tr>\
      <tr><td>Open QR with post number inserted</td><td><input name=openQR></td></tr>\
      <tr><td>Open QR without post number inserted</td><td><input name=openEmptyQR></td></tr>\
      <tr><td>Submit post</td><td><input name=submit></td></tr>\
      <tr><td>Select next reply</td><td><input name=nextReply ></td></tr>\
      <tr><td>Select previous reply</td><td><input name=previousReply></td></tr>\
      <tr><td>See next thread</td><td><input name=nextThread></td></tr>\
      <tr><td>See previous thread</td><td><input name=previousThread></td></tr>\
      <tr><td>Jump to the next page</td><td><input name=nextPage></td></tr>\
      <tr><td>Jump to the previous page</td><td><input name=previousPage></td></tr>\
      <tr><td>Jump to page 0</td><td><input name=zero></td></tr>\
      <tr><td>Open thread in current tab</td><td><input name=openThread></td></tr>\
      <tr><td>Open thread in new tab</td><td><input name=openThreadTab></td></tr>\
      <tr><td>Expand thread</td><td><input name=expandThread></td></tr>\
      <tr><td>Watch thread</td><td><input name=watch></td></tr>\
      <tr><td>Hide thread</td><td><input name=hide></td></tr>\
      <tr><td>Expand selected image</td><td><input name=expandImages></td></tr>\
      <tr><td>Expand all images</td><td><input name=expandAllImages></td></tr>\
      <tr><td>Update now</td><td><input name=update></td></tr>\
      <tr><td>Reset the unread count to 0</td><td><input name=unreadCountTo0></td></tr>\
    </tbody></table>\
  </div>\
</div>'
      });
      _ref = config.main;
      for (key in _ref) {
        obj = _ref[key];
        ul = $.el('ul', {
          textContent: key
        });
        for (key in obj) {
          arr = obj[key];
          checked = conf[key] ? 'checked' : '';
          description = arr[1];
          li = $.el('li', {
            innerHTML: "<label><input type=checkbox name='" + key + "' " + checked + ">" + key + "</label><span class=description>: " + description + "</span>"
          });
          $.on($('input', li), 'click', $.cb.checked);
          $.add(ul, li);
        }
        $.add($('#main_tab + div', dialog), ul);
      }
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length;
      li = $.el('li', {
        innerHTML: "<button>hidden: " + hiddenNum + "</button> <span class=description>: Forget all hidden posts. Useful if you accidentally hide a post and have \"Show Stubs\" disabled."
      });
      $.on($('button', li), 'click', options.clearHidden);
      $.add($('ul:nth-child(2)', dialog), li);
      _ref2 = $$('textarea', dialog);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        ta = _ref2[_i];
        ta.textContent = conf[ta.name];
        $.on(ta, 'change', $.cb.value);
      }
      (back = $('[name=backlink]', dialog)).value = conf['backlink'];
      (time = $('[name=time]', dialog)).value = conf['time'];
      $.on(back, 'keyup', $.cb.value);
      $.on(back, 'keyup', options.backlink);
      $.on(time, 'keyup', $.cb.value);
      $.on(time, 'keyup', options.time);
      favicon = $('select', dialog);
      favicon.value = conf['favicon'];
      $.on(favicon, 'change', $.cb.value);
      $.on(favicon, 'change', options.favicon);
      _ref3 = $$('#keybinds_tab + div input', dialog);
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        input = _ref3[_j];
        input.type = 'text';
        input.value = conf[input.name];
        $.on(input, 'keydown', options.keybind);
      }
      indicators = {};
      _ref4 = $$('.error', dialog);
      for (_k = 0, _len3 = _ref4.length; _k < _len3; _k++) {
        indicator = _ref4[_k];
        key = indicator.firstChild.textContent;
        indicator.hidden = conf[key];
        indicators[key] = indicator;
        $.on($("[name='" + key + "']", dialog), 'click', function() {
          return indicators[this.name].hidden = this.checked;
        });
      }
      overlay = $.el('div', {
        id: 'overlay'
      });
      $.on(overlay, 'click', function() {
        return $.rm(overlay);
      });
      $.on(dialog, 'click', function(e) {
        return e.stopPropagation();
      });
      $.add(overlay, dialog);
      $.add(d.body, overlay);
      options.backlink.call(back);
      options.time.call(time);
      return options.favicon.call(favicon);
    },
    clearHidden: function() {
      $["delete"]("hiddenReplies/" + g.BOARD + "/");
      $["delete"]("hiddenThreads/" + g.BOARD + "/");
      this.textContent = "hidden: 0";
      return g.hiddenReplies = {};
    },
    keybind: function(e) {
      if (e.keyCode === 9) return;
      e.preventDefault();
      e.stopPropagation();
      if ((key = keybinds.keyCode(e)) == null) return;
      this.value = key;
      return $.cb.value.call(this);
    },
    time: function() {
      Time.foo();
      Time.date = new Date();
      return $.id('timePreview').textContent = Time.funk(Time);
    },
    backlink: function() {
      return $.id('backlinkPreview').textContent = conf['backlink'].replace(/%id/, '123456789');
    },
    favicon: function() {
      Favicon["switch"]();
      if (g.REPLY && conf['Unread Count']) Favicon.update();
      return this.nextElementSibling.innerHTML = "<img src=" + Favicon.unreadSFW + "> <img src=" + Favicon.unreadNSFW + "> <img src=" + Favicon.unreadDead + ">";
    }
  };

  threading = {
    init: function() {
      return threading.thread($('body > form').firstChild);
    },
    op: function(node) {
      var op;
      op = $.el('div', {
        className: 'op'
      });
      $.before(node, op);
      while (node.nodeName !== 'BLOCKQUOTE') {
        $.add(op, node);
        node = op.nextSibling;
      }
      $.add(op, node);
      op.id = $('input', op).name;
      return op;
    },
    thread: function(node) {
      var div;
      node = threading.op(node);
      if (g.REPLY) return;
      div = $.el('div', {
        className: 'thread'
      });
      $.before(node, div);
      while (node.nodeName !== 'HR') {
        $.add(div, node);
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
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      _ref = $$('.thread');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        op = thread.firstChild;
        a = $.el('a', {
          textContent: '[ - ]',
          href: 'javascript:;'
        });
        $.on(a, 'click', threadHiding.cb.hide);
        $.prepend(op, a);
        if (op.id in hiddenThreads) {
          _results.push(threadHiding.hideHide(thread));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    cb: {
      hide: function() {
        var thread;
        thread = this.parentNode.parentNode;
        return threadHiding.hide(thread);
      },
      show: function() {
        var thread;
        thread = this.parentNode.parentNode;
        return threadHiding.show(thread);
      }
    },
    toggle: function(thread) {
      if (/\bstub\b/.test(thread.className) || thread.hidden) {
        return threadHiding.show(thread);
      } else {
        return threadHiding.hide(thread);
      }
    },
    hide: function(thread) {
      var hiddenThreads, id;
      threadHiding.hideHide(thread);
      id = thread.firstChild.id;
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      hiddenThreads[id] = Date.now();
      return $.set("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
    },
    hideHide: function(thread) {
      var a, div, name, num, span, text, trip, _ref;
      if (conf['Show Stubs']) {
        if (/stub/.test(thread.className)) return;
        if (span = $('.omittedposts', thread)) {
          num = Number(span.textContent.match(/\d+/)[0]);
        } else {
          num = 0;
        }
        num += $$('table', thread).length;
        text = num === 1 ? "1 reply" : "" + num + " replies";
        name = $('.postername', thread).textContent;
        trip = ((_ref = $('.postername + .postertrip', thread)) != null ? _ref.textContent : void 0) || '';
        a = $.el('a', {
          innerHTML: "<span>[ + ]</span> " + name + trip + " (" + text + ")",
          href: 'javascript:;'
        });
        $.on(a, 'click', threadHiding.cb.show);
        div = $.el('div', {
          className: 'block'
        });
        $.add(div, a);
        $.add(thread, div);
        return $.addClass(thread, 'stub');
      } else {
        thread.hidden = true;
        return thread.nextSibling.hidden = true;
      }
    },
    show: function(thread) {
      var hiddenThreads, id;
      $.rm($('div.block', thread));
      $.removeClass(thread, 'stub');
      thread.hidden = false;
      thread.nextSibling.hidden = false;
      id = thread.firstChild.id;
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      delete hiddenThreads[id];
      return $.set("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
    }
  };

  updater = {
    init: function() {
      var checkbox, checked, dialog, html, input, name, title, _i, _len, _ref;
      if (conf['Scrolling']) {
        if (conf['Scroll BG']) {
          updater.focus = true;
        } else {
          $.on(window, 'focus', (function() {
            return updater.focus = true;
          }));
          $.on(window, 'blur', (function() {
            return updater.focus = false;
          }));
        }
      }
      html = "<div class=move><span id=count></span> <span id=timer>-" + conf['Interval'] + "</span></div>";
      checkbox = config.updater.checkbox;
      for (name in checkbox) {
        title = checkbox[name][1];
        checked = conf[name] ? 'checked' : '';
        html += "<div><label title='" + title + "'>" + name + "<input name='" + name + "' type=checkbox " + checked + "></label></div>";
      }
      checked = conf['Auto Update'] ? 'checked' : '';
      html += "      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox " + checked + "></label></div>      <div><label>Interval (s)<input name=Interval value=" + conf['Interval'] + " type=text></label></div>      <div><input value='Update Now' type=button></div>";
      dialog = ui.dialog('updater', 'bottom: 0; right: 0;', html);
      updater.count = $('#count', dialog);
      updater.timer = $('#timer', dialog);
      updater.br = $('br[clear]');
      _ref = $$('input', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        if (input.type === 'checkbox') {
          $.on(input, 'click', $.cb.checked);
          $.on(input, 'click', function() {
            return conf[this.name] = this.checked;
          });
          if (input.name === 'Verbose') {
            $.on(input, 'click', updater.cb.verbose);
            updater.cb.verbose.call(input);
          } else if (input.name === 'Auto Update This') {
            $.on(input, 'click', updater.cb.autoUpdate);
            updater.cb.autoUpdate.call(input);
          }
        } else if (input.name === 'Interval') {
          $.on(input, 'change', function() {
            return conf['Interval'] = this.value = parseInt(this.value, 10) || conf['Interval'];
          });
          $.on(input, 'change', $.cb.value);
        } else if (input.type === 'button') {
          $.on(input, 'click', updater.update);
        }
      }
      $.add(d.body, dialog);
      updater.retryCoef = 10;
      return updater.lastModified = 0;
    },
    cb: {
      verbose: function() {
        if (conf['Verbose']) {
          updater.count.textContent = '+0';
          return updater.timer.hidden = false;
        } else {
          $.extend(updater.count, {
            className: '',
            textContent: 'Thread Updater'
          });
          return updater.timer.hidden = true;
        }
      },
      autoUpdate: function() {
        if (this.checked) {
          return updater.timeoutID = setTimeout(updater.timeout, 1000);
        } else {
          return clearTimeout(updater.timeoutID);
        }
      },
      update: function() {
        var body, frag, id, input, newPosts, reply, scroll, _i, _len, _ref, _ref2;
        if (this.status === 404) {
          updater.timer.textContent = '';
          updater.count.textContent = 404;
          updater.count.className = 'error';
          clearTimeout(updater.timeoutID);
          if (input = $('#qr [type=submit]', qr.el)) {
            input.disabled = true;
            input.value = 404;
          }
          d.title = d.title.match(/^.+-/)[0] + ' 404';
          g.dead = true;
          Favicon.update();
          return;
        }
        updater.retryCoef = 10;
        updater.timer.textContent = '-' + conf['Interval'];
        /*
              Status Code 304: Not modified
              By sending the `If-Modified-Since` header we get a proper status code, and no response.
              This saves bandwidth for both the user and the servers, avoid unnecessary computation,
              and won't load images and scripts when parsing the response.
        */
        if (this.status === 304) {
          if (conf['Verbose']) {
            updater.count.textContent = '+0';
            updater.count.className = null;
          }
          return;
        }
        updater.lastModified = this.getResponseHeader('Last-Modified');
        body = $.el('body', {
          innerHTML: this.responseText
        });
        if ($('title', body).textContent === '4chan - Banned') {
          updater.count.textContent = 'Banned';
          updater.count.className = 'error';
          return;
        }
        id = ((_ref = $('td[id]', updater.br.previousElementSibling)) != null ? _ref.id : void 0) || 0;
        frag = d.createDocumentFragment();
        _ref2 = $$('.reply', body).reverse();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          reply = _ref2[_i];
          if (reply.id <= id) break;
          $.prepend(frag, reply.parentNode.parentNode.parentNode);
        }
        newPosts = frag.childNodes.length;
        scroll = conf['Scrolling'] && updater.focus && newPosts && (d.body.scrollHeight - d.body.clientHeight - window.scrollY < 20);
        if (conf['Verbose']) {
          updater.count.textContent = '+' + newPosts;
          if (newPosts === 0) {
            updater.count.className = null;
          } else {
            updater.count.className = 'new';
          }
        }
        $.before(updater.br, frag);
        if (scroll) return scrollTo(0, d.body.scrollHeight);
      }
    },
    timeout: function() {
      var n;
      updater.timeoutID = setTimeout(updater.timeout, 1000);
      n = 1 + Number(updater.timer.textContent);
      if (n === 0) {
        return updater.update();
      } else if (n === updater.retryCoef) {
        updater.retryCoef += 10 * (updater.retryCoef < 120);
        return updater.retry();
      } else {
        return updater.timer.textContent = n;
      }
    },
    retry: function() {
      updater.count.textContent = 'Retry';
      updater.count.className = '';
      return updater.update();
    },
    update: function() {
      var url, _ref;
      updater.timer.textContent = 0;
      if ((_ref = updater.request) != null) _ref.abort();
      url = location.pathname + '?' + Date.now();
      return updater.request = $.ajax(url, updater.cb.update, {
        headers: {
          'If-Modified-Since': updater.lastModified
        }
      });
    }
  };

  watcher = {
    init: function() {
      var favicon, html, input, inputs, _i, _len;
      html = '<div class=move>Thread Watcher</div>';
      watcher.dialog = ui.dialog('watcher', 'top: 50px; left: 0px;', html);
      $.add(d.body, watcher.dialog);
      inputs = $$('.op input');
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        favicon = $.el('img', {
          className: 'favicon'
        });
        $.on(favicon, 'click', watcher.cb.toggle);
        $.before(input, favicon);
      }
      watcher.refresh();
      return $.on(window, 'storage', function(e) {
        if (e.key === ("" + NAMESPACE + "watched")) return watcher.refresh();
      });
    },
    refresh: function() {
      var board, div, favicon, frag, id, link, props, watched, watchedBoard, x, _i, _j, _len, _len2, _ref, _ref2, _ref3, _results;
      watched = $.get('watched', {});
      frag = d.createDocumentFragment();
      for (board in watched) {
        _ref = watched[board];
        for (id in _ref) {
          props = _ref[id];
          x = $.el('a', {
            textContent: 'X',
            href: 'javascript:;'
          });
          $.on(x, 'click', watcher.cb.x);
          link = $.el('a', props);
          link.title = link.textContent;
          div = $.el('div');
          $.add(div, x, $.tn(' '), link);
          $.add(frag, div);
        }
      }
      _ref2 = $$('div:not(.move)', watcher.dialog);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        div = _ref2[_i];
        $.rm(div);
      }
      $.add(watcher.dialog, frag);
      watchedBoard = watched[g.BOARD] || {};
      _ref3 = $$('img.favicon');
      _results = [];
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        favicon = _ref3[_j];
        id = favicon.nextSibling.name;
        if (id in watchedBoard) {
          _results.push(favicon.src = Favicon["default"]);
        } else {
          _results.push(favicon.src = Favicon.empty);
        }
      }
      return _results;
    },
    cb: {
      toggle: function() {
        return watcher.toggle(this.parentNode);
      },
      x: function() {
        var thread;
        thread = this.nextElementSibling.pathname.split('/');
        return watcher.unwatch(thread[3], thread[1]);
      }
    },
    toggle: function(thread) {
      var id;
      id = $('.favicon + input', thread).name;
      return watcher.watch(id) || watcher.unwatch(id, g.BOARD);
    },
    unwatch: function(id, board) {
      var watched;
      watched = $.get('watched', {});
      delete watched[board][id];
      $.set('watched', watched);
      return watcher.refresh();
    },
    watch: function(id) {
      var thread, watched, _name;
      thread = $.id(id);
      if ($('.favicon', thread).src === Favicon["default"]) return false;
      watched = $.get('watched', {});
      watched[_name = g.BOARD] || (watched[_name] = {});
      watched[g.BOARD][id] = {
        href: "/" + g.BOARD + "/res/" + id,
        textContent: getTitle(thread)
      };
      $.set('watched', watched);
      return watcher.refresh();
    }
  };

  anonymize = {
    init: function() {
      return g.callbacks.push(function(root) {
        var name, trip;
        name = $('.commentpostername, .postername', root);
        name.textContent = 'Anonymous';
        if (trip = $('.postertrip', root)) {
          if (trip.parentNode.nodeName === 'A') {
            return $.rm(trip.parentNode);
          } else {
            return $.rm(trip);
          }
        }
      });
    }
  };

  sauce = {
    init: function() {
      if (!(sauce.prefixes = conf['flavors'].match(/^[^#].+$/gm))) return;
      sauce.names = sauce.prefixes.map(function(prefix) {
        return prefix.match(/(\w+)\./)[1];
      });
      return g.callbacks.push(function(root) {
        var i, link, prefix, span, suffix, _len, _ref, _results;
        if (root.className === 'inline' || !(span = $('.filesize', root))) return;
        suffix = $('a', span).href;
        _ref = sauce.prefixes;
        _results = [];
        for (i = 0, _len = _ref.length; i < _len; i++) {
          prefix = _ref[i];
          link = $.el('a', {
            textContent: sauce.names[i],
            href: prefix + suffix,
            target: '_blank'
          });
          _results.push($.add(span, $.tn(' '), link));
        }
        return _results;
      });
    }
  };

  revealSpoilers = {
    init: function() {
      return g.callbacks.push(function(root) {
        var board, img, imgID, _, _ref;
        if (!(img = $('img[alt^=Spoiler]', root)) || root.className === 'inline') {
          return;
        }
        img.removeAttribute('height');
        img.removeAttribute('width');
        _ref = img.parentNode.href.match(/(\w+)\/src\/(\d+)/), _ = _ref[0], board = _ref[1], imgID = _ref[2];
        return img.src = "http://0.thumbs.4chan.org/" + board + "/thumb/" + imgID + "s.jpg";
      });
    }
  };

  Time = {
    init: function() {
      var chanOffset;
      Time.foo();
      chanOffset = 5 - new Date().getTimezoneOffset() / 60;
      if ($.isDST()) chanOffset--;
      this.parse = Date.parse('10/11/11(Tue)18:53' === 1318351980000) ? function(node) {
        return new Date(Date.parse(node.textContent) + chanOffset * HOUR);
      } : function(node) {
        var day, hour, min, month, year, _, _ref;
        _ref = node.textContent.match(/(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\d+)/), _ = _ref[0], month = _ref[1], day = _ref[2], year = _ref[3], hour = _ref[4], min = _ref[5];
        year = "20" + year;
        month -= 1;
        hour = chanOffset + Number(hour);
        return new Date(year, month, day, hour, min);
      };
      return g.callbacks.push(Time.node);
    },
    node: function(root) {
      var node, posttime, time;
      if (root.className === 'inline') return;
      node = (posttime = $('.posttime', root)) ? posttime : $('span[id]', root).previousSibling;
      Time.date = Time.parse(node);
      time = $.el('time', {
        textContent: ' ' + Time.funk(Time) + ' '
      });
      return $.replace(node, time);
    },
    foo: function() {
      var code;
      code = conf['time'].replace(/%([A-Za-z])/g, function(s, c) {
        if (c in Time.formatters) {
          return "' + Time.formatters." + c + "() + '";
        } else {
          return s;
        }
      });
      return Time.funk = Function('Time', "return '" + code + "'");
    },
    day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    zeroPad: function(n) {
      if (n < 10) {
        return '0' + n;
      } else {
        return n;
      }
    },
    formatters: {
      a: function() {
        return Time.day[Time.date.getDay()].slice(0, 3);
      },
      A: function() {
        return Time.day[Time.date.getDay()];
      },
      b: function() {
        return Time.month[Time.date.getMonth()].slice(0, 3);
      },
      B: function() {
        return Time.month[Time.date.getMonth()];
      },
      d: function() {
        return Time.zeroPad(Time.date.getDate());
      },
      e: function() {
        return Time.date.getDate();
      },
      H: function() {
        return Time.zeroPad(Time.date.getHours());
      },
      I: function() {
        return Time.zeroPad(Time.date.getHours() % 12 || 12);
      },
      k: function() {
        return Time.date.getHours();
      },
      l: function() {
        return Time.date.getHours() % 12 || 12;
      },
      m: function() {
        return Time.zeroPad(Time.date.getMonth() + 1);
      },
      M: function() {
        return Time.zeroPad(Time.date.getMinutes());
      },
      p: function() {
        if (Time.date.getHours() < 12) {
          return 'AM';
        } else {
          return 'PM';
        }
      },
      P: function() {
        if (Time.date.getHours() < 12) {
          return 'am';
        } else {
          return 'pm';
        }
      },
      y: function() {
        return Time.date.getFullYear() - 2000;
      }
    }
  };

  getTitle = function(thread) {
    var el, span;
    el = $('.filetitle', thread);
    if (!el.textContent) {
      el = $('blockquote', thread);
      if (!el.textContent) el = $('.postername', thread);
    }
    span = $.el('span', {
      innerHTML: el.innerHTML.replace(/<br>/g, ' ')
    });
    return "/" + g.BOARD + "/ - " + span.textContent;
  };

  titlePost = {
    init: function() {
      return d.title = getTitle();
    }
  };

  quoteBacklink = {
    init: function() {
      var format;
      format = conf['backlink'].replace(/%id/, "' + id + '");
      quoteBacklink.funk = Function('id', "return'" + format + "'");
      return g.callbacks.push(function(root) {
        var a, container, el, id, link, qid, quote, quotes, _i, _len, _ref, _results;
        if (/\binline\b/.test(root.className)) return;
        quotes = {};
        _ref = $$('.quotelink', root);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          quote = _ref[_i];
          if (qid = quote.hash.slice(1)) quotes[qid] = quote;
        }
        id = $('input', root).name;
        a = $.el('a', {
          href: "#" + id,
          className: root.hidden ? 'filtered backlink' : 'backlink',
          textContent: quoteBacklink.funk(id)
        });
        _results = [];
        for (qid in quotes) {
          if (!(el = $.id(qid))) continue;
          if (el.className === 'op' && !conf['OP Backlinks']) continue;
          link = a.cloneNode(true);
          if (conf['Quote Preview']) {
            $.on(link, 'mouseover', quotePreview.mouseover);
            $.on(link, 'mousemove', ui.hover);
            $.on(link, 'mouseout', quotePreview.mouseout);
          }
          if (conf['Quote Inline']) $.on(link, 'click', quoteInline.toggle);
          if (!((container = $('.container', el)) && container.parentNode === el)) {
            container = $.el('span', {
              className: 'container'
            });
            root = $('.reportbutton', el) || $('span[id]', el);
            $.after(root, container);
          }
          _results.push($.add(container, $.tn(' '), link));
        }
        return _results;
      });
    }
  };

  quoteInline = {
    init: function() {
      return g.callbacks.push(function(root) {
        var quote, _i, _len, _ref, _results;
        _ref = $$('.quotelink, .backlink', root);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          quote = _ref[_i];
          if (!quote.hash) continue;
          quote.removeAttribute('onclick');
          _results.push($.on(quote, 'click', quoteInline.toggle));
        }
        return _results;
      });
    },
    toggle: function(e) {
      var id;
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      id = this.hash.slice(1);
      if (/\binlined\b/.test(this.className)) {
        quoteInline.rm(this, id);
      } else {
        if ($.x("ancestor::*[@id='" + id + "']", this)) return;
        quoteInline.add(this, id);
      }
      return this.classList.toggle('inlined');
    },
    add: function(q, id) {
      var el, i, inline, pathname, root, threadID;
      root = q.parentNode.nodeName === 'FONT' ? q.parentNode : q.nextSibling ? q.nextSibling : q;
      if (el = $.id(id)) {
        inline = quoteInline.table(id, el.innerHTML);
        if (g.REPLY && conf['Unread Count'] && (i = unread.replies.indexOf(el.parentNode.parentNode.parentNode)) !== -1) {
          unread.replies.splice(i, 1);
          unread.updateTitle();
          Favicon.update();
        }
        if (/\bbacklink\b/.test(q.className)) {
          $.after(q.parentNode, inline);
          if (conf['Forward Hiding']) {
            $.addClass($.x('ancestor::table', el), 'forwarded');
          }
          return;
        }
        return $.after(root, inline);
      } else {
        inline = $.el('td', {
          className: 'reply inline',
          id: "i" + id,
          innerHTML: "Loading " + id + "..."
        });
        $.after(root, inline);
        pathname = q.pathname;
        threadID = pathname.split('/').pop();
        return $.cache(pathname, (function() {
          return quoteInline.parse(this, pathname, id, threadID, inline);
        }));
      }
    },
    rm: function(q, id) {
      var inlined, table, _i, _len, _ref;
      table = $.x("following::*[@id='i" + id + "']", q);
      $.rm(table);
      if (!conf['Forward Hiding']) return;
      _ref = $$('.backlink.inlined', table);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        inlined = _ref[_i];
        $.removeClass($.x('ancestor::table', $.id(inlined.hash.slice(1))), 'forwarded');
      }
      if (/\bbacklink\b/.test(q.className)) {
        return $.removeClass($.x('ancestor::table', $.id(id)), 'forwarded');
      }
    },
    parse: function(req, pathname, id, threadID, inline) {
      var body, href, html, link, newInline, op, quote, reply, _i, _j, _len, _len2, _ref, _ref2;
      if (!inline.parentNode) return;
      if (req.status !== 200) {
        inline.innerHTML = "" + req.status + " " + req.statusText;
        return;
      }
      body = $.el('body', {
        innerHTML: req.responseText
      });
      if (id === threadID) {
        op = threading.op($('body > form', body).firstChild);
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
      _ref2 = $$('.quotelink', newInline);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        quote = _ref2[_j];
        if ((href = quote.getAttribute('href')) === quote.hash) {
          quote.pathname = pathname;
        } else if (!g.REPLY && href !== quote.href) {
          quote.href = "res/" + href;
        }
      }
      link = $('.quotejs', newInline);
      link.href = "" + pathname + "#" + id;
      link.nextSibling.href = "" + pathname + "#q" + id;
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
      return g.callbacks.push(function(root) {
        var quote, _i, _len, _ref, _results;
        _ref = $$('.quotelink, .backlink', root);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          quote = _ref[_i];
          if (!quote.hash) continue;
          $.on(quote, 'mouseover', quotePreview.mouseover);
          $.on(quote, 'mousemove', ui.hover);
          _results.push($.on(quote, 'mouseout', quotePreview.mouseout));
        }
        return _results;
      });
    },
    mouseover: function(e) {
      var el, id, qp, quote, replyID, threadID, _i, _len, _ref, _results;
      qp = ui.el = $.el('div', {
        id: 'qp',
        className: 'reply dialog'
      });
      $.add(d.body, qp);
      id = this.hash.slice(1);
      if (el = $.id(id)) {
        qp.innerHTML = el.innerHTML;
        if (conf['Quote Highlighting']) $.addClass(el, 'qphl');
        if (/\bbacklink\b/.test(this.className)) {
          replyID = $.x('preceding-sibling::input', this.parentNode).name;
          _ref = $$('.quotelink', qp);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            quote = _ref[_i];
            if (quote.hash.slice(1) === replyID) {
              _results.push(quote.className = 'forwardlink');
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      } else {
        qp.innerHTML = "Loading " + id + "...";
        threadID = this.pathname.split('/').pop() || $.x('ancestor::div[@class="thread"]/div', this).id;
        $.cache(this.pathname, (function() {
          return quotePreview.parse(this, id, threadID);
        }));
        return ui.hover(e);
      }
    },
    mouseout: function() {
      var el;
      if (el = $.id(this.hash.slice(1))) $.removeClass(el, 'qphl');
      return ui.hoverend();
    },
    parse: function(req, id, threadID) {
      var body, html, op, qp, reply, _i, _len, _ref;
      if (!((qp = ui.el) && (qp.innerHTML === ("Loading " + id + "...")))) return;
      if (req.status !== 200) {
        qp.innerHTML = "" + req.status + " " + req.statusText;
        return;
      }
      body = $.el('body', {
        innerHTML: req.responseText
      });
      if (id === threadID) {
        op = threading.op($('body > form', body).firstChild);
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
      qp.innerHTML = html;
      return Time.node(qp);
    }
  };

  quoteOP = {
    init: function() {
      return g.callbacks.push(function(root) {
        var quote, tid, _i, _len, _ref, _results;
        if (root.className === 'inline') return;
        tid = g.THREAD_ID || $.x('ancestor::div[contains(@class,"thread")]/div', root).id;
        _ref = $$('.quotelink', root);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          quote = _ref[_i];
          if (quote.hash.slice(1) === tid) {
            _results.push(quote.innerHTML += '&nbsp;(OP)');
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    }
  };

  quoteDR = {
    init: function() {
      return g.callbacks.push(function(root) {
        var quote, tid, _i, _len, _ref, _results;
        if (root.className === 'inline') return;
        tid = g.THREAD_ID || $.x('ancestor::div[contains(@class,"thread")]/div', root).id;
        _ref = $$('.quotelink', root);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          quote = _ref[_i];
          if (quote.pathname.indexOf("res/" + tid) === -1 && !quote.pathname.indexOf("/" + g.BOARD + "/res")) {
            _results.push(quote.innerHTML += '&nbsp;(Cross-thread)');
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    }
  };

  reportButton = {
    init: function() {
      return g.callbacks.push(function(root) {
        var a, span;
        if (!(a = $('.reportbutton', root))) {
          span = $('span[id]', root);
          a = $.el('a', {
            className: 'reportbutton',
            innerHTML: '[&nbsp;!&nbsp;]',
            href: 'javascript:;'
          });
          $.after(span, a);
          $.after(span, $.tn(' '));
        }
        return $.on(a, 'click', reportButton.report);
      });
    },
    report: function() {
      var id, set, url;
      url = "http://sys.4chan.org/" + g.BOARD + "/imgboard.php?mode=report&no=" + ($.x('preceding-sibling::input', this).name);
      id = Date.now();
      set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200";
      return window.open(url, id, set);
    }
  };

  threadStats = {
    init: function() {
      var dialog;
      dialog = ui.dialog('stats', 'bottom: 0; left: 0;', '<div class=move><span id=postcount>0</span> / <span id=imagecount>0</span></div>');
      dialog.className = 'dialog';
      $.add(d.body, dialog);
      threadStats.posts = threadStats.images = 0;
      threadStats.imgLimit = (function() {
        switch (g.BOARD) {
          case 'a':
          case 'v':
            return 251;
          default:
            return 151;
        }
      })();
      return g.callbacks.push(threadStats.node);
    },
    node: function(root) {
      var imgcount;
      if (/\binline\b/.test(root.className)) return;
      $.id('postcount').textContent = ++threadStats.posts;
      if (!$('img[md5]', root)) return;
      imgcount = $.id('imagecount');
      imgcount.textContent = ++threadStats.images;
      if (threadStats.images > threadStats.imgLimit) {
        return imgcount.className = 'error';
      }
    }
  };

  unread = {
    init: function() {
      d.title = '(0) ' + d.title;
      $.on(window, 'scroll', unread.scroll);
      return g.callbacks.push(unread.node);
    },
    replies: [],
    node: function(root) {
      if (root.hidden || root.className) return;
      unread.replies.push(root);
      unread.updateTitle();
      if (unread.replies.length === 1) return Favicon.update();
    },
    scroll: function() {
      var bottom, height, i, reply, _len, _ref;
      updater.focus = true;
      height = d.body.clientHeight;
      _ref = unread.replies;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        reply = _ref[i];
        bottom = reply.getBoundingClientRect().bottom;
        if (bottom > height) break;
      }
      if (i === 0) return;
      unread.replies = unread.replies.slice(i);
      unread.updateTitle();
      if (unread.replies.length === 0) return Favicon.update();
    },
    updateTitle: function() {
      return d.title = d.title.replace(/\d+/, unread.replies.length);
    }
  };

  Favicon = {
    init: function() {
      var favicon, href;
      favicon = $('link[rel="shortcut icon"]', d.head);
      favicon.type = 'image/x-icon';
      href = favicon.href;
      this.SFW = /ws.ico$/.test(href);
      this["default"] = href;
      return this["switch"]();
    },
    "switch": function() {
      switch (conf['favicon']) {
        case 'ferongr':
          this.unreadDead = 'data:unreadDead;base64,R0lGODlhEAAQAOMHAOgLAnMFAL8AAOgLAukMA/+AgP+rq////////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          this.unreadSFW = 'data:unreadSFW;base64,R0lGODlhEAAQAOMHAADX8QBwfgC2zADX8QDY8nnl8qLp8v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          this.unreadNSFW = 'data:unreadNSFW;base64,R0lGODlhEAAQAOMHAFT+ACh5AEncAFT+AFX/Acz/su7/5v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          break;
        case 'xat-':
          this.unreadDead = 'data:unreadDead;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2ElEQVQ4y61TQQrCMBDMQ8WDIEV6LbT2A4og2Hq0veo7fIAH04dY9N4xmyYlpGmI2MCQTWYy3Wy2DAD7B2wWAzWgcTgVeZKlZRxHNYFi2jM18oBh0IcKtC6ixf22WT4IFLs0owxswXu9egm0Ls6bwfCFfNsJYJKfqoEkd3vgUgFVLWObtzNgVKyruC+ljSzr5OEnBzjvjcQecaQhbZgBb4CmGQw+PoMkTUtdbd8VSEPakcGxPOcsoIgUKy0LecY29BmdBrqRfjIwZ93KLs5loHvBnL3cLH/jF+C/+z5dgUysAAAAAElFTkSuQmCC';
          this.unreadSFW = 'data:unreadSFW;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA30lEQVQ4y2P4//8/AyWYgSoGQMF/GJ7Y11VVUVoyKTM9ey4Ig9ggMWQ1YA1IBvzXm34YjkH8mPyJB+Nqlp8FYRAbmxoMF6ArSNrw6T0Qf8Amh9cFMEWVR/7/A+L/uORxhgEIt5/+/3/2lf//5wAxiI0uj+4CBlBgxVUvOwtydgXQZpDmi2/+/7/0GmIQSAwkB1IDUkuUAZeABlx+g2zAZ9wGlAOjChba+LwAUgNSi2HA5Am9VciBhSsQQWyoWgZiovEDsdGI1QBYQiLJAGQalpSxyWEzAJYWkGm8clTJjQCZ1hkoVG0CygAAAABJRU5ErkJggg==';
          this.unreadNSFW = 'data:unreadNSFW;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4y2P4//8/AyWYgSoGQMF/GJ7YNbGqrKRiUnp21lwQBrFBYshqwBqQDPifdsYYjkH8mInxB+OWx58FYRAbmxoMF6ArKPmU9B6IP2CTw+sCmKKe/5X/gPg/LnmcYQDCs/63/1/9fzYQzwGz0eXRXcAACqy4ZfFnQc7u+V/xD6T55v+LQHwJbBBIDCQHUgNSS5QBt4Cab/2/jDDgMx4DykrKJ8FCG58XQGpAajEMmNw7uQo5sHAFIogNVctATDR+IDYasRoAS0gkGYBMw5IyNjlsBsDSAjKNV44quREAx58Mr9vt5wQAAAAASUVORK5CYII=';
          break;
        case 'Mayhem':
          this.unreadDead = 'data:unreadDead;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jZ2ScWuDMBDFgw4pIkU0WsoQkWAYIkXZH4N9/+/V3dmfXSrKYIFHwt17j8vdGWNMIkgFuaDgzgQnwRs4EQs5KdolUQtagRN0givEDBTEOjgtGs0Zq8F7cKqqusVxrMQLaDUWcjBSrXkn8gs51tpJSWLk9b3HUa0aNIL5gPBR1/V4kJvR7lTwl8GmAm1Gf9+c3S+89qBHa8502AsmSrtBaEBPbIbj0ah2madlNAPEccdgJDfAtWifBjqWKShRBT6KoiH8QlEUn/qt0CCjnNdmPUwmFWzj9Oe6LpKuZXcwqq88z78Pch3aZU3dPwwc2sWlfZKCW5tWluV8kGvXClLm6dYN4/aUqfCbnEOzNDGhGZbNargvxCzvMGfRJD8UaDVvgkzo6QAAAABJRU5ErkJggg==';
          this.unreadSFW = 'data:unreadSFW;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZ2S4crCMAxF+0OGDJEPKYrIGKOsiJSx/fJRfSAfTJNyKqXfiuDg0C25N2RJjTGmEVrhTzhw7oStsIEtsVzT4o2Jo9ALThiEM8IdHIgNaHo8mjNWg6/ske8bohPo+63QOLzmooHp8fyAICBSQkVz0QKdsFQEV6WSW/D+7+BbgbIDHcb4Kp61XyjyI16zZ8JemGltQtDBSGxB4/GoN+7TpkkjDCsFArm0IYv3U0BbnYtf8BCy+JytsE0X6VyuKhPPK/GAJ14kvZZDZVV3pZIb8MZr6n4o4PDGKn0S5SdDmyq5PnXQsk+Xbhinp03FFzmHJw6xYRiWm9VxnohZ3vOcxdO8ARmXRvbWdtzQAAAAAElFTkSuQmCC';
          this.unreadNSFW = 'data:unreadNSFW;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jZ2S0WrDMAxF/TBCCKWMYhZKCSGYmFJMSNjD/mhf239qJXNcjBdTWODgRLpXKJKNMaYROuFTOHEehFb4gJZYrunwxsSXMApOmIQzwgOciE1oRjyaM1aDj+yR7xuiHvT9VmgcXnPRwO/9+wWCgEgJFc1FCwzCVhFclUpuw/u3g3cFyg50GPOjePZ+ocjPeM2RCXthpbUFwQAzsQ2Nx6PeuE+bJo0w7BQI5NKGLN5XAW11LX7BQ8jia7bCLl2kc7mqTLzuxAOeeJH0Wk6VVf0oldyEN15T948CDm+sMiZRfjK0pZIbUwcd+3TphnF62lR8kXN44hAbhmG5WQNnT8zynucsnuYJhFpBfkMzqD4AAAAASUVORK5CYII=';
          break;
        case 'Original':
          this.unreadDead = 'data:unreadDead;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          this.unreadSFW = 'data:unreadSFW;base64,R0lGODlhEAAQAKECAAAAAC6Xw////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          this.unreadNSFW = 'data:unreadNSFW;base64,R0lGODlhEAAQAKECAAAAAGbMM////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          break;
        case 'None':
          this.unreadDead = this.dead;
          this.unreadSFW = 'http://static.4chan.org/image/favicon-ws.ico';
          this.unreadNSFW = 'http://static.4chan.org/image/favicon.ico';
      }
      return this.unread = this.SFW ? this.unreadSFW : this.unreadNSFW;
    },
    empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    update: function() {
      var clone, favicon, l;
      l = unread.replies.length;
      favicon = $('link[rel="shortcut icon"]', d.head);
      favicon.href = g.dead ? l ? this.unreadDead : this.dead : l ? this.unread : this["default"];
      if (engine !== 'webkit') {
        clone = favicon.cloneNode(true);
        favicon.href = null;
        return $.replace(favicon, clone);
      }
    }
  };

  redirect = {
    init: function() {
      var url;
      url = location.hostname === 'images.4chan.org' ? redirect.image(g.BOARD, location.pathname.split('/')[3]) : /^\d+$/.test(g.THREAD_ID) ? redirect.thread() : void 0;
      if (url) return location.href = url;
    },
    image: function(board, filename) {
      switch (board) {
        case 'a':
        case 'jp':
        case 'm':
        case 'tg':
        case 'tv':
        case 'u':
          return "http://archive.foolz.us/" + board + "/full_image/" + filename;
      }
    },
    thread: function() {
      switch (g.BOARD) {
        case 'a':
        case 'jp':
        case 'm':
        case 'tg':
        case 'tv':
        case 'u':
          return "http://archive.foolz.us/" + g.BOARD + "/thread/" + g.THREAD_ID + "/";
        case 'lit':
          return "http://fuuka.warosu.org/" + g.BOARD + "/thread/" + g.THREAD_ID;
        case 'diy':
        case 'g':
        case 'sci':
          return "http://archive.installgentoo.net/" + g.BOARD + "/thread/" + g.THREAD_ID;
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
        case 'pol':
        case 'r9k':
        case 'soc':
        case 'sp':
        case 'toy':
        case 'trv':
        case 'v':
        case 'vp':
        case 'x':
          return "http://archive.no-ip.org/" + g.BOARD + "/thread/" + g.THREAD_ID;
        default:
          return "http://boards.4chan.org/" + g.BOARD;
      }
    }
  };

  imgHover = {
    init: function() {
      return g.callbacks.push(function(root) {
        var thumb;
        if (!(thumb = $('img[md5]', root))) return;
        $.on(thumb, 'mouseover', imgHover.mouseover);
        $.on(thumb, 'mousemove', ui.hover);
        return $.on(thumb, 'mouseout', ui.hoverend);
      });
    },
    mouseover: function() {
      ui.el = $.el('img', {
        id: 'ihover',
        src: this.parentNode.href
      });
      return $.add(d.body, ui.el);
    }
  };

  imgGif = {
    init: function() {
      return g.callbacks.push(function(root) {
        var src, thumb;
        if (root.hidden || !(thumb = $('img[md5]', root))) return;
        src = thumb.parentNode.href;
        if (/gif$/.test(src)) return thumb.src = src;
      });
    }
  };

  imgExpand = {
    init: function() {
      g.callbacks.push(imgExpand.node);
      return imgExpand.dialog();
    },
    node: function(root) {
      var a, thumb;
      if (!(thumb = $('img[md5]', root))) return;
      a = thumb.parentNode;
      $.on(a, 'click', imgExpand.cb.toggle);
      if (imgExpand.on && !root.hidden && root.className !== 'inline') {
        return imgExpand.expand(a.firstChild);
      }
    },
    cb: {
      toggle: function(e) {
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
          return;
        }
        e.preventDefault();
        return imgExpand.toggle(this);
      },
      all: function() {
        var thumb, _i, _j, _len, _len2, _ref, _ref2, _results, _results2;
        imgExpand.on = this.checked;
        if (imgExpand.on) {
          _ref = $$('.op > a > img[md5]:last-child, table:not([hidden]) img[md5]:last-child');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thumb = _ref[_i];
            _results.push(imgExpand.expand(thumb));
          }
          return _results;
        } else {
          _ref2 = $$('img[md5][hidden]');
          _results2 = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            thumb = _ref2[_j];
            _results2.push(imgExpand.contract(thumb));
          }
          return _results2;
        }
      },
      typeChange: function() {
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
        $('body > form').className = klass;
        if (/\bfitheight\b/.test(klass)) {
          $.on(window, 'resize', imgExpand.resize);
          if (!imgExpand.style) imgExpand.style = $.addStyle('');
          return imgExpand.resize();
        } else if (imgExpand.style) {
          return $.off(window, 'resize', imgExpand.resize);
        }
      }
    },
    toggle: function(a) {
      var rect, thumb;
      thumb = a.firstChild;
      if (thumb.hidden) {
        rect = a.parentNode.getBoundingClientRect();
        if (rect.top < 0) d.body.scrollTop += rect.top;
        if (rect.left < 0) d.body.scrollLeft += rect.left;
        return imgExpand.contract(thumb);
      } else {
        return imgExpand.expand(thumb);
      }
    },
    contract: function(thumb) {
      thumb.hidden = false;
      return $.rm(thumb.nextSibling);
    },
    expand: function(thumb, url) {
      var a, filesize, img, max;
      if (thumb.hidden) return;
      a = thumb.parentNode;
      img = $.el('img', {
        src: url || a.href
      });
      if (engine === 'gecko' && a.parentNode.className !== 'op') {
        filesize = $.x('preceding-sibling::span[@class="filesize"]', a).textContent;
        max = filesize.match(/(\d+)x/);
        img.style.maxWidth = "" + max[1] + "px";
      }
      if (conf['404 Redirect']) $.on(img, 'error', imgExpand.error);
      thumb.hidden = true;
      return $.add(a, img);
    },
    error: function() {
      var href, req, src, thumb, url;
      href = this.parentNode.href;
      thumb = this.previousSibling;
      imgExpand.contract(thumb);
      src = href.split('/');
      if (this.src.split('/')[2] === 'images.4chan.org' && (url = redirect.image(src[3], src[5]))) {
        setTimeout(imgExpand.expand, 10000, thumb, url);
        return;
      }
      url = href + '?' + Date.now();
      if (engine === 'webkit') {
        return req = $.ajax(this.src, (function() {
          if (this.status !== 404) {
            return setTimeout(imgExpand.expand, 10000, thumb, url);
          }
        }), {
          type: 'head',
          event: 'onreadystatechange'
        });
      } else if (!g.dead) {
        return setTimeout(imgExpand.expand, 10000, thumb, url);
      }
    },
    dialog: function() {
      var controls, form, imageType, select;
      controls = $.el('div', {
        id: 'imgControls',
        innerHTML: "<select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label>Expand Images<input type=checkbox id=imageExpand></label>"
      });
      imageType = $.get('imageType', 'full');
      select = $('select', controls);
      select.value = imageType;
      imgExpand.cb.typeChange.call(select);
      $.on(select, 'change', $.cb.value);
      $.on(select, 'change', imgExpand.cb.typeChange);
      $.on($('input', controls), 'click', imgExpand.cb.all);
      form = $('body > form');
      return $.prepend(form, controls);
    },
    resize: function() {
      return imgExpand.style.innerHTML = ".fitheight img[md5] + img {max-height:" + d.body.clientHeight + "px;}";
    }
  };

  Main = {
    init: function() {
      var cutoff, hiddenThreads, id, now, pathname, temp, timestamp, _ref;
      pathname = location.pathname.slice(1).split('/');
      g.BOARD = pathname[0], temp = pathname[1];
      if (temp === 'res') {
        g.REPLY = true;
        g.THREAD_ID = pathname[2];
      } else {
        g.PAGENUM = parseInt(temp) || 0;
      }
      $.on(window, 'message', Main.message);
      if (location.hostname === 'sys.4chan.org') {
        if (location.pathname === '/post') {
          qr.message.init();
        } else if (/report/.test(location.search)) {
          $.ready(function() {
            return $.on($('#recaptcha_response_field'), 'keydown', function(e) {
              if (e.keyCode === 8 && !e.target.value) {
                return window.location = 'javascript:Recaptcha.reload()';
              }
            });
          });
        }
        return;
      }
      if (location.hostname === 'images.4chan.org') {
        $.ready(function() {
          if (d.title === '4chan - 404') return redirect.init();
        });
        return;
      }
      $.ready(options.init);
      now = Date.now();
      if (conf['Check for Updates'] && $.get('lastUpdate', 0) < now - 6 * HOUR) {
        $.ready(function() {
          return $.add(d.head, $.el('script', {
            src: 'https://raw.github.com/mayhemydg/4chan-x/master/latest.js'
          }));
        });
        $.set('lastUpdate', now);
      }
      g.hiddenReplies = $.get("hiddenReplies/" + g.BOARD + "/", {});
      if ($.get('lastChecked', 0) < now - 1 * DAY) {
        $.set('lastChecked', now);
        cutoff = now - 7 * DAY;
        hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
        for (id in hiddenThreads) {
          timestamp = hiddenThreads[id];
          if (timestamp < cutoff) delete hiddenThreads[id];
        }
        _ref = g.hiddenReplies;
        for (id in _ref) {
          timestamp = _ref[id];
          if (timestamp < cutoff) delete g.hiddenReplies[id];
        }
        $.set("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
        $.set("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
      }
      if (conf['Filter']) filter.init();
      if (conf['Reply Hiding']) replyHiding.init();
      if (conf['Filter'] || conf['Reply Hiding']) strikethroughQuotes.init();
      if (conf['Anonymize']) anonymize.init();
      if (conf['Time Formatting']) Time.init();
      if (conf['Sauce']) sauce.init();
      if (conf['Image Auto-Gif']) imgGif.init();
      if (conf['Image Hover']) imgHover.init();
      if (conf['Reveal Spoilers']) revealSpoilers.init();
      if (conf['Report Button']) reportButton.init();
      if (conf['Quote Inline']) quoteInline.init();
      if (conf['Quote Preview']) quotePreview.init();
      if (conf['Quote Backlinks']) quoteBacklink.init();
      if (conf['Indicate OP quote']) quoteOP.init();
      if (conf['Indicate Cross-thread Quotes']) quoteDR.init();
      return $.ready(Main.ready);
    },
    ready: function() {
      var callback, node, nodes, _i, _j, _len, _len2, _ref;
      if (conf['404 Redirect'] && d.title === '4chan - 404') {
        redirect.init();
        return;
      }
      if (!$.id('navtopr')) return;
      $.addClass(d.body, engine);
      $.addStyle(Main.css);
      threading.init();
      Favicon.init();
      if (conf['Quick Reply']) qr.init();
      if (conf['Image Expansion']) imgExpand.init();
      if (conf['Thread Watcher']) watcher.init();
      if (conf['Keybinds']) keybinds.init();
      if (g.REPLY) {
        if (conf['Thread Updater']) updater.init();
        if (conf['Thread Stats']) threadStats.init();
        if (conf['Reply Navigation']) nav.init();
        if (conf['Post in Title']) titlePost.init();
        if (conf['Unread Count']) unread.init();
      } else {
        if (conf['Thread Hiding']) threadHiding.init();
        if (conf['Thread Expansion']) expandThread.init();
        if (conf['Comment Expansion']) expandComment.init();
        if (conf['Index Navigation']) nav.init();
      }
      nodes = $$('.op, a + table');
      _ref = g.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        try {
          for (_j = 0, _len2 = nodes.length; _j < _len2; _j++) {
            node = nodes[_j];
            callback(node);
          }
        } catch (err) {
          alert(err);
        }
      }
      return $.on($('form[name=delform]'), 'DOMNodeInserted', Main.node);
    },
    message: function(e) {
      var data, version;
      data = e.data;
      version = data.version;
      if (data.qr && !data.changeContext) {
        return qr.message.receive(data);
      } else if (version && version !== VERSION && confirm('An updated version of 4chan X is available, would you like to install it now?')) {
        return window.location = "https://raw.github.com/mayhemydg/4chan-x/" + version + "/4chan_x.user.js";
      }
    },
    node: function(e) {
      var callback, target, _i, _len, _ref, _results;
      target = e.target;
      if (target.nodeName !== 'TABLE') return;
      _ref = g.callbacks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        try {
          _results.push(callback(target));
        } catch (err) {

        }
      }
      return _results;
    },
    css: '\
/* dialog styling */\
.dialog {\
  border: 1px solid rgba(0,0,0,.25);\
}\
.move {\
  cursor: move;\
}\
label, .favicon {\
  cursor: pointer;\
}\
a[href="javascript:;"] {\
  text-decoration: none;\
}\
\
.thread.stub > :not(.block),\
#content > [name=tab]:not(:checked) + div,\
#updater:not(:hover) > :not(.move),\
#qp > input, #qp .inline, .forwarded {\
  display: none;\
}\
\
.autohide:not(:hover) > form {\
  display: none;\
}\
#qr > .move {\
  min-width: 300px;\
  overflow: hidden;\
  box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  padding: 0 2px;\
}\
#qr > .move > span {\
  float: right;\
}\
#autohide, .close, #qr select, #dump, .captcha {\
  cursor: pointer;\
}\
#qr select,\
#qr > form {\
  margin: 0;\
}\
#dump {\
  background: -webkit-linear-gradient(#EEE, #CCC);\
  background: -moz-linear-gradient(#EEE, #CCC);\
  background: -o-linear-gradient(#EEE, #CCC);\
  background: linear-gradient(#EEE, #CCC);\
  width: 10%;\
}\
#dump:hover, #dump:focus {\
  background: -webkit-linear-gradient(#FFF, #DDD);\
  background: -moz-linear-gradient(#FFF, #DDD);\
  background: -o-linear-gradient(#FFF, #DDD);\
  background: linear-gradient(#FFF, #DDD);\
}\
#dump:active, .dump #dump:not(:hover):not(:focus) {\
  background: -webkit-linear-gradient(#CCC, #DDD);\
  background: -moz-linear-gradient(#CCC, #DDD);\
  background: -o-linear-gradient(#CCC, #DDD);\
  background: linear-gradient(#CCC, #DDD);\
}\
#qr:not(.dump) output, .dump > form > label {\
  display: none;\
}\
#replies {\
  display: block;\
  height: 100px;\
  position: relative;\
}\
#replies > div {\
  top: 0; right: 0; bottom: 0; left: 0;\
  margin: 0; padding: 0;\
  overflow: hidden;\
  position: absolute;\
  white-space: pre;\
}\
#replies > div:hover {\
  overflow-x: auto;\
}\
.preview {\
  background-color: rgba(0,0,0,.2);\
  background-position: 50% 20%;\
  background-size: cover;\
  border: 1px solid #666;\
  box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  display: inline-block;\
  height: 90px; width: 90px;\
  margin: 5px; padding: 2px;\
  opacity: .5;\
  overflow: hidden;\
  position: relative;\
  text-shadow: 0 1px 1px #000;\
  -webkit-transition: opacity .25s;\
  -moz-transition: opacity .25s;\
  -o-transition: opacity .25s;\
  transition: opacity .25s;\
  vertical-align: top;\
}\
.preview:hover, .preview:focus {\
  opacity: .9;\
}\
.preview#selected {\
  opacity: 1;\
}\
.preview > span {\
  color: #FFF;\
}\
.remove {\
  color: #E00;\
  font-weight: 700;\
  padding: 3px;\
}\
.remove:hover::after {\
  content: " Remove";\
}\
.preview > label {\
  background: rgba(0,0,0,.5);\
  color: #FFF;\
  right: 0; bottom: 0; left: 0;\
  position: absolute;\
  text-align: center;\
}\
.preview > label > input {\
  margin: 0;\
}\
#addReply {\
  color: #333;\
  font-size: 3.5em;\
  line-height: 100px;\
}\
#addReply:hover, #addReply:focus {\
  color: #000;\
}\
.field {\
  border: 1px solid #CCC;\
  color: #333;\
  font: 13px sans-serif;\
  margin: 0;\
  padding: 2px 4px 3px;\
  width: 30%;\
  -webkit-transition: color .25s, border .25s;\
  -moz-transition: color .25s, border .25s;\
  -o-transition: color .25s, border .25s;\
  transition: color .25s, border .25s;\
}\
.field:-moz-placeholder,\
.field:hover:-moz-placeholder {\
  color: #AAA;\
}\
.field:hover, .field:focus {\
  border-color: #999;\
  color: #000;\
  outline: none;\
}\
textarea.field {\
  min-height: 120px;\
  width: 100%;\
}\
.captcha {\
  background: #FFF;\
  outline: 1px solid #CCC;\
  outline-offset: -1px;\
  text-align: center;\
}\
.captcha > img {\
  height: 57px;\
  width: 300px;\
}\
.field[name=captcha] {\
  width: 100%;\
}\
#qr [type=file] {\
  width: 80%;\
}\
#qr [type=submit] {\
  padding: 0 -moz-calc(1px); /* Gecko does not respect box-sizing: border-box */\
  width: 20%;\
}\
\
.new {\
  background: lime;\
}\
.error {\
  color: red;\
}\
#error {\
  cursor: default;\
}\
#error[href] {\
  cursor: pointer;\
}\
td.replyhider {\
  vertical-align: top;\
}\
\
.filesize + br + a {\
  float: left;\
  pointer-events: none;\
}\
img[md5], img[md5] + img {\
  pointer-events: all;\
}\
.fitwidth img[md5] + img {\
  max-width: 100%;\
}\
.gecko  > .fitwidth img[md5] + img,\
.presto > .fitwidth img[md5] + img {\
  width: 100%;\
}\
\
#qr, #qp, #updater, #stats, #ihover, #overlay, #navlinks {\
  position: fixed;\
}\
\
#ihover {\
  max-height: 100%;\
  max-width: 75%;\
}\
\
#navlinks {\
  font-size: 16px;\
  top: 25px;\
  right: 5px;\
}\
\
#overlay {\
  top: 0;\
  right: 0;\
  left: 0;\
  bottom: 0;\
  text-align: center;\
  background: rgba(0,0,0,.5);\
  z-index: 1;\
}\
#overlay::after {\
  content: "";\
  display: inline-block;\
  height: 100%;\
  vertical-align: middle;\
}\
#options {\
  display: inline-block;\
  padding: 5px;\
  text-align: left;\
  vertical-align: middle;\
  width: 500px;\
}\
#credits {\
  float: right;\
}\
#options ul {\
  list-style: none;\
  padding: 0;\
}\
#options label {\
  text-decoration: underline;\
}\
#content > div {\
  height: 450px;\
  overflow: auto;\
}\
#content textarea {\
  margin: 0;\
  min-height: 100px;\
  resize: vertical;\
  width: 100%;\
}\
#flavors {\
  height: 100%;\
}\
\
#updater {\
  text-align: right;\
}\
#updater input[type=text] {\
  width: 50px;\
}\
#updater:not(:hover) {\
  border: none;\
  background: transparent;\
}\
\
#stats {\
  border: none;\
}\
\
#watcher {\
  position: absolute;\
}\
#watcher > div {\
  overflow: hidden;\
  padding-right: 5px;\
  padding-left: 5px;\
  text-overflow: ellipsis;\
  max-width: 200px;\
  white-space: nowrap;\
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
  padding-bottom: 5px;\
}\
.qphl {\
  outline: 2px solid rgba(216, 94, 49, .7);\
}\
.inlined {\
  opacity: .5;\
}\
.inline td.reply {\
  background-color: rgba(255, 255, 255, 0.15);\
  border: 1px solid rgba(128, 128, 128, 0.5);\
}\
.filetitle, .replytitle, .postername, .commentpostername, .postertrip {\
  background: none;\
}\
.filtered {\
  text-decoration: line-through;\
}'
  };

  Main.init();

}).call(this);
