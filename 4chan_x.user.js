// ==UserScript==
// @name           4chan x
// @version        3.0.1
// @namespace      aeosynth
// @description    Adds various features.
// @copyright      2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright      2012 Nicolas Stepien <stepien.nicolas@gmail.com>, James Campos <james.r.campos@gmail.com>
// @license        MIT; http://en.wikipedia.org/wiki/Mit_license
// @include        http*://boards.4chan.org/*
// @include        http*://images.4chan.org/*
// @include        http*://sys.4chan.org/*
// @run-at         document-start
// @updateURL      https://raw.github.com/aeosynth/4chan-x/stable/4chan_x.user.js
// @icon           http://aeosynth.github.com/4chan-x/favicon.gif
// ==/UserScript==

/* LICENSE
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012 Nicolas Stepien <stepien.nicolas@gmail.com>, James Campos <james.r.campos@gmail.com>
 * http://aeosynth.github.com/4chan-x/
 * 4chan X 3.0.1
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
 * [2]: https://github.com/aeosynth/4chan-x
 *
 * CONTRIBUTORS
 *
 * Mayhem - various features; maintenance
 * noface - unique ID fixes
 * desuwa - Firefox filename upload fix
 * seaweed - bottom padding for image hover
 * e000 - cooldown sanity check
 * ahodesuka - scroll back when unexpanding images, file info formatting
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
  var $, $$, Anonymize, AutoGif, Conf, Config, ExpandComment, ExpandThread, Favicon, FileInfo, Filter, GetTitle, ImageExpand, ImageHover, Keybinds, Main, Nav, Options, QR, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, QuoteThreading, Quotify, Redirect, ReplyHiding, ReportButton, RevealSpoilers, Sauce, StrikethroughQuotes, ThreadHiding, ThreadStats, Time, TitlePost, UI, Unread, Updater, Watcher, d, g, log, _base;

  Config = {
    main: {
      Enhancing: {
        '404 Redirect': [true, 'Redirect dead threads and images'],
        'Keybinds': [true, 'Binds actions to keys'],
        'Time Formatting': [true, 'Arbitrarily formatted timestamps, using your local time'],
        'File Info Formatting': [true, 'Reformats the file information'],
        'Report Button': [true, 'Add report buttons'],
        'Comment Expansion': [true, 'Expand too long comments'],
        'Thread Expansion': [true, 'View all replies'],
        'Index Navigation': [true, 'Navigate to previous / next thread'],
        'Rollover': [true, 'Index navigation will fallback to page navigation.'],
        'Reply Navigation': [false, 'Navigate to top / bottom of thread'],
        'Check for Updates': [true, 'Check for updated versions of 4chan X']
      },
      Filtering: {
        'Anonymize': [false, 'Make everybody anonymous'],
        'Filter': [true, 'Self-moderation placebo'],
        'Recursive Filtering': [true, 'Filter replies of filtered posts, recursively'],
        'Reply Hiding': [true, 'Hide single replies'],
        'Thread Hiding': [true, 'Hide entire threads'],
        'Show Stubs': [true, 'Of hidden threads / replies']
      },
      Imaging: {
        'Image Auto-Gif': [false, 'Animate gif thumbnails'],
        'Image Expansion': [true, 'Expand images'],
        'Image Hover': [false, 'Show full image on mouseover'],
        'Sauce': [true, 'Add sauce to images'],
        'Reveal Spoilers': [false, 'Replace spoiler thumbnails by the original thumbnail'],
        'Expand From Current': [false, 'Expand images from current position to thread end.']
      },
      Monitoring: {
        'Thread Updater': [true, 'Update threads. Has more options in its own dialog.'],
        'Unread Count': [true, 'Show unread post count in tab title'],
        'Unread Favicon': [true, 'Show a different favicon when there are unread posts'],
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
        'Open Reply in New Tab': [false, 'Open replies in a new tab that are made from the main board.'],
        'Remember QR size': [false, 'Remember the size of the Quick reply (Firefox only).'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Hide Original Post Form': [true, 'Replace the normal post form with a shortcut to open the QR.']
      },
      Quoting: {
        'Quote Backlinks': [true, 'Add quote backlinks'],
        'OP Backlinks': [false, 'Add backlinks to the OP'],
        'Quote Highlighting': [true, 'Highlight the previewed post'],
        'Quote Inline': [true, 'Show quoted post inline on quote click'],
        'Quote Preview': [true, 'Show quote content on hover'],
        'Resurrect Quotes': [true, 'Linkify dead quotes to archives'],
        'Indicate OP quote': [true, 'Add \'(OP)\' to OP quotes'],
        'Indicate Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes'],
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks'],
        'Quote Threading': [false, 'Thread convsersations']
      }
    },
    filter: {
      name: ['# Filter any namefags:', '#/^(?!Anonymous$)/'].join('\n'),
      uniqueid: ['# Filter a specific ID:', '#/Txhvk1Tl/'].join('\n'),
      tripcode: ['# Filter any tripfags', '#/^!/'].join('\n'),
      mod: ['# Set a custom class for mods:', '#/Mod$/;highlight:mod;op:yes', '# Set a custom class for moot:', '#/Admin$/;highlight:moot;op:yes'].join('\n'),
      email: ['# Filter any e-mails that are not `sage` on /a/ and /jp/:', '#/^(?!sage$)/;boards:a,jp'].join('\n'),
      subject: ['# Filter Generals on /v/:', '#/general/i;boards:v;op:only'].join('\n'),
      comment: ['# Filter Stallman copypasta on /g/:', '#/what you\'re refer+ing to as linux/i;boards:g'].join('\n'),
      filename: [''].join('\n'),
      dimensions: ['# Highlight potential wallpapers:', '#/1920x1080/;op:yes;highlight;top:no;boards:w,wg'].join('\n'),
      filesize: [''].join('\n'),
      md5: [''].join('\n')
    },
    sauces: ['http://iqdb.org/?url=$1', 'http://www.google.com/searchbyimage?image_url=$1', '#http://tineye.com/search?url=$1', '#http://saucenao.com/search.php?db=999&url=$1', '#http://3d.iqdb.org/?url=$1', '#http://regex.info/exif.cgi?imgurl=$2', '# uploaders:', '#http://imgur.com/upload?url=$2', '#http://omploader.org/upload?url1=$2', '# "View Same" in archives:', '#http://archive.foolz.us/$4/image/$3/', '#https://archive.installgentoo.net/$4/image/$3'].join('\n'),
    time: '%m/%d/%y(%a)%H:%M',
    backlink: '>>%id',
    fileInfo: '%l (%p%s, %r)',
    favicon: 'ferongr',
    hotkeys: {
      openQR: ['i', 'Open QR with post number inserted'],
      openEmptyQR: ['I', 'Open QR without post number inserted'],
      openOptions: ['ctrl+o', 'Open Options'],
      close: ['Esc', 'Close Options or QR'],
      spoiler: ['ctrl+s', 'Quick spoiler'],
      submit: ['alt+s', 'Submit post'],
      watch: ['w', 'Watch thread'],
      update: ['u', 'Update now'],
      unreadCountTo0: ['z', 'Reset unread status'],
      expandImage: ['m', 'Expand selected image'],
      expandAllImages: ['M', 'Expand all images'],
      zero: ['0', 'Jump to page 0'],
      nextPage: ['L', 'Jump to the next page'],
      previousPage: ['H', 'Jump to the previous page'],
      nextThread: ['n', 'See next thread'],
      previousThread: ['p', 'See previous thread'],
      expandThread: ['e', 'Expand thread'],
      openThreadTab: ['o', 'Open thread in current tab'],
      openThread: ['O', 'Open thread in new tab'],
      nextReply: ['J', 'Select next reply'],
      previousReply: ['K', 'Select previous reply'],
      hide: ['x', 'Hide thread']
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

  Conf = {};

  d = document;

  g = {};

  log = typeof (_base = console.log).bind === "function" ? _base.bind(console) : void 0;

  UI = {
    dialog: function(id, position, html) {
      var el, saved;
      el = d.createElement('div');
      el.className = 'reply dialog';
      el.innerHTML = html;
      el.id = id;
      el.style.cssText = (saved = localStorage["" + Main.namespace + id + ".position"]) ? saved : position;
      el.querySelector('.move').addEventListener('mousedown', UI.dragstart, false);
      return el;
    },
    dragstart: function(e) {
      var el, rect;
      e.preventDefault();
      UI.el = el = this.parentNode;
      d.addEventListener('mousemove', UI.drag, false);
      d.addEventListener('mouseup', UI.dragend, false);
      rect = el.getBoundingClientRect();
      UI.dx = e.clientX - rect.left;
      UI.dy = e.clientY - rect.top;
      UI.width = d.documentElement.clientWidth - rect.width;
      return UI.height = d.documentElement.clientHeight - rect.height;
    },
    drag: function(e) {
      var left, style, top;
      left = e.clientX - UI.dx;
      top = e.clientY - UI.dy;
      left = left < 10 ? '0px' : UI.width - left < 10 ? null : left + 'px';
      top = top < 10 ? '0px' : UI.height - top < 10 ? null : top + 'px';
      style = UI.el.style;
      style.left = left;
      style.top = top;
      style.right = left === null ? '0px' : null;
      return style.bottom = top === null ? '0px' : null;
    },
    dragend: function() {
      var el;
      el = UI.el;
      localStorage["" + Main.namespace + el.id + ".position"] = el.style.cssText;
      d.removeEventListener('mousemove', UI.drag, false);
      return d.removeEventListener('mouseup', UI.dragend, false);
    },
    hover: function(e) {
      var clientHeight, clientWidth, clientX, clientY, height, style, top, _ref;
      clientX = e.clientX, clientY = e.clientY;
      style = UI.el.style;
      _ref = d.documentElement, clientHeight = _ref.clientHeight, clientWidth = _ref.clientWidth;
      height = UI.el.offsetHeight;
      top = clientY - 120;
      style.top = clientHeight <= height || top <= 0 ? '0px' : top + height >= clientHeight ? clientHeight - height + 'px' : top + 'px';
      if (clientX <= clientWidth - 400) {
        style.left = clientX + 45 + 'px';
        return style.right = null;
      } else {
        style.left = null;
        return style.right = clientWidth - clientX + 45 + 'px';
      }
    },
    hoverend: function() {
      $.rm(UI.el);
      return delete UI.el;
    }
  };

  /*
  loosely follows the jquery api:
  http://api.jquery.com/
  not chainable
  */


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
  };

  $.extend($, {
    SECOND: 1000,
    MINUTE: 1000 * 60,
    HOUR: 1000 * 60 * 60,
    DAY: 1000 * 60 * 60 * 24,
    engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase(),
    ready: function(fc) {
      var cb;
      if (/interactive|complete/.test(d.readyState)) {
        return setTimeout(fc);
      }
      cb = function() {
        $.off(d, 'DOMContentLoaded', cb);
        return fc();
      };
      return $.on(d, 'DOMContentLoaded', cb);
    },
    sync: function(key, cb) {
      return $.on(window, 'storage', function(e) {
        if (e.key === ("" + Main.namespace + key)) {
          return cb(JSON.parse(e.newValue));
        }
      });
    },
    id: function(id) {
      return d.getElementById(id);
    },
    ajax: function(url, callbacks, opts) {
      var form, headers, key, r, type, upCallbacks, val;
      if (opts == null) {
        opts = {};
      }
      type = opts.type, headers = opts.headers, upCallbacks = opts.upCallbacks, form = opts.form;
      r = new XMLHttpRequest();
      r.open(type || 'get', url, true);
      for (key in headers) {
        val = headers[key];
        r.setRequestHeader(key, val);
      }
      $.extend(r, callbacks);
      $.extend(r.upload, upCallbacks);
      if (typeof form === 'string') {
        r.sendAsBinary(form);
      } else {
        r.send(form);
      }
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
        req = $.ajax(url, {
          onload: function() {
            var cb, _i, _len, _ref, _results;
            _ref = this.callbacks;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              cb = _ref[_i];
              _results.push(cb.call(this));
            }
            return _results;
          },
          onabort: function() {
            return delete $.cache.requests[url];
          }
        });
        req.callbacks = [cb];
        return $.cache.requests[url] = req;
      }
    },
    cb: {
      checked: function() {
        $.set(this.name, this.checked);
        return Conf[this.name] = this.checked;
      },
      value: function() {
        $.set(this.name, this.value.trim());
        return Conf[this.name] = this.value;
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
      if (root == null) {
        root = d.body;
      }
      return d.evaluate(path, root, null, 8, null).singleNodeValue;
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
    tn: function(s) {
      return d.createTextNode(s);
    },
    nodes: function(nodes) {
      var frag, node, _i, _len;
      if (nodes instanceof Node) {
        return nodes;
      }
      frag = d.createDocumentFragment();
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        frag.appendChild(node);
      }
      return frag;
    },
    add: function(parent, children) {
      return parent.appendChild($.nodes(children));
    },
    prepend: function(parent, children) {
      return parent.insertBefore($.nodes(children), parent.firstChild);
    },
    after: function(root, el) {
      return root.parentNode.insertBefore($.nodes(el), root.nextSibling);
    },
    before: function(root, el) {
      return root.parentNode.insertBefore($.nodes(el), root);
    },
    replace: function(root, el) {
      return root.parentNode.replaceChild($.nodes(el), root);
    },
    el: function(tag, properties) {
      var el;
      el = d.createElement(tag);
      if (properties) {
        $.extend(el, properties);
      }
      return el;
    },
    on: function(el, events, handler) {
      var event, _i, _len, _ref;
      _ref = events.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        el.addEventListener(event, handler, false);
      }
    },
    off: function(el, events, handler) {
      var event, _i, _len, _ref;
      _ref = events.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        el.removeEventListener(event, handler, false);
      }
    },
    open: function(url) {
      return (GM_openInTab || window.open)(location.protocol + url, '_blank');
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
      if (month < 2 || 10 < month) {
        return false;
      }
      if ((2 < month && month < 10)) {
        return true;
      }
      sunday = date - day;
      if (month === 2) {
        if (sunday < 8) {
          return false;
        }
        if (sunday < 15 && day === 0) {
          if (hours < 7) {
            return false;
          }
          return true;
        }
        return true;
      }
      if (sunday < 1) {
        return true;
      }
      if (sunday < 8 && day === 0) {
        if (hours < 6) {
          return true;
        }
        return false;
      }
      return false;
    }
  });

  $.cache.requests = {};

  $.extend($, typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null ? {
    "delete": function(name) {
      name = Main.namespace + name;
      return GM_deleteValue(name);
    },
    get: function(name, defaultValue) {
      var value;
      name = Main.namespace + name;
      if (value = GM_getValue(name)) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      name = Main.namespace + name;
      localStorage.setItem(name, JSON.stringify(value));
      return GM_setValue(name, JSON.stringify(value));
    }
  } : {
    "delete": function(name) {
      return localStorage.removeItem(Main.namespace + name);
    },
    get: function(name, defaultValue) {
      var value;
      if (value = localStorage.getItem(Main.namespace + name)) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      return localStorage.setItem(Main.namespace + name, JSON.stringify(value));
    }
  });

  $$ = function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  };

  Filter = {
    filters: {},
    init: function() {
      var boards, filter, hl, key, op, regexp, top, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      for (key in Config.filter) {
        this.filters[key] = [];
        _ref = Conf[key].split('\n');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          if (filter[0] === '#') {
            continue;
          }
          if (!(regexp = filter.match(/\/(.+)\/(\w*)/))) {
            continue;
          }
          filter = filter.replace(regexp[0], '');
          boards = ((_ref1 = filter.match(/boards:([^;]+)/)) != null ? _ref1[1].toLowerCase() : void 0) || 'global';
          if (boards !== 'global' && boards.split(',').indexOf(g.BOARD) === -1) {
            continue;
          }
          try {
            if (key === 'md5') {
              regexp = regexp[1];
            } else {
              regexp = RegExp(regexp[1], regexp[2]);
            }
          } catch (e) {
            alert(e.message);
            continue;
          }
          op = ((_ref2 = filter.match(/[^t]op:(yes|no|only)/)) != null ? _ref2[1].toLowerCase() : void 0) || 'no';
          if (hl = /highlight/.test(filter)) {
            hl = ((_ref3 = filter.match(/highlight:(\w+)/)) != null ? _ref3[1].toLowerCase() : void 0) || 'filter_highlight';
            top = ((_ref4 = filter.match(/top:(yes|no)/)) != null ? _ref4[1].toLowerCase() : void 0) || 'yes';
            top = top === 'yes';
          }
          this.filters[key].push(this.createFilter(regexp, op, hl, top));
        }
        if (!this.filters[key].length) {
          delete this.filters[key];
        }
      }
      if (Object.keys(this.filters).length) {
        return Main.callbacks.push(this.node);
      }
    },
    createFilter: function(regexp, op, hl, top) {
      var test;
      test = typeof regexp === 'string' ? function(value) {
        return regexp === value;
      } : function(value) {
        return regexp.test(value);
      };
      return function(value, isOP) {
        if (isOP && op === 'no' || !isOP && op === 'only') {
          return false;
        }
        if (!test(value)) {
          return false;
        }
        if (hl) {
          return [hl, top];
        }
        return true;
      };
    },
    node: function(post) {
      var filter, firstThread, isOP, key, result, root, thisThread, value, _i, _len, _ref;
      if (post.isInlined) {
        return;
      }
      isOP = post.id === post.threadId;
      root = post.root;
      for (key in Filter.filters) {
        value = Filter[key](post);
        if (value === false) {
          continue;
        }
        _ref = Filter.filters[key];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          if (!(result = filter(value, isOP))) {
            continue;
          }
          if (result === true) {
            if (isOP) {
              if (!g.REPLY) {
                ThreadHiding.hide(root.parentNode);
              } else {
                continue;
              }
            } else {
              ReplyHiding.hide(post);
            }
            return;
          }
          $.addClass((isOP ? root.parentNode : root), result[0]);
          if (isOP && result[1] && !g.REPLY) {
            thisThread = root.parentNode;
            if (firstThread = $('div[class=thread]')) {
              $.before(firstThread, [thisThread, thisThread.nextElementSibling]);
            }
          }
        }
      }
    },
    name: function(post) {
      return $('.name', post.el).textContent;
    },
    uniqueid: function(post) {
      var uid;
      if (uid = $('.posteruid', post.el)) {
        return uid.textContent.slice(5, -1);
      }
      return false;
    },
    tripcode: function(post) {
      var trip;
      if (trip = $('.postertrip', post.el)) {
        return trip.textContent;
      }
      return false;
    },
    mod: function(post) {
      var mod;
      if (mod = $('.capcode', post.el)) {
        return mod.textContent;
      }
      return false;
    },
    email: function(post) {
      var mail;
      if (mail = $('.useremail', post.el)) {
        return mail.pathname;
      }
      return false;
    },
    subject: function(post) {
      return $('.subject', post.el).textContent || false;
    },
    comment: function(post) {
      var data, i, nodes, text, _i, _ref;
      text = [];
      nodes = d.evaluate('.//br|.//text()', post.el.lastElementChild, null, 7, null);
      for (i = _i = 0, _ref = nodes.snapshotLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        text.push((data = nodes.snapshotItem(i).data) ? data : '\n');
      }
      return text.join('');
    },
    filename: function(post) {
      var file, fileInfo;
      fileInfo = post.fileInfo;
      if (fileInfo && (file = $('.fileText > span', fileInfo))) {
        return file.title;
      }
      return false;
    },
    dimensions: function(post) {
      var fileInfo, match;
      fileInfo = post.fileInfo;
      if (fileInfo && (match = fileInfo.textContent.match(/\d+x\d+/))) {
        return match[0];
      }
      return false;
    },
    filesize: function(post) {
      var img;
      img = post.img;
      if (img) {
        return img.alt;
      }
      return false;
    },
    md5: function(post) {
      var img;
      img = post.img;
      if (img) {
        return img.dataset.md5;
      }
      return false;
    }
  };

  StrikethroughQuotes = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var el, quote, _i, _len, _ref;
      if (post.isInlined) {
        return;
      }
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if ((el = $.id(quote.hash.slice(1))) && el.hidden) {
          $.addClass(quote, 'filtered');
          if (Conf['Recursive Filtering']) {
            ReplyHiding.hide(post.root);
          }
        }
      }
    }
  };

  ExpandComment = {
    init: function() {
      var a, _i, _len, _ref;
      _ref = $$('.abbr');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        $.on(a.firstElementChild, 'click', ExpandComment.expand);
      }
    },
    expand: function(e) {
      var a, replyID, threadID, _, _ref;
      e.preventDefault();
      _ref = this.href.match(/(\d+)#p(\d+)/), _ = _ref[0], threadID = _ref[1], replyID = _ref[2];
      this.textContent = "Loading " + replyID + "...";
      a = this;
      return $.cache(this.pathname, function() {
        return ExpandComment.parse(this, a, threadID, replyID);
      });
    },
    parse: function(req, a, threadID, replyID) {
      var doc, href, node, post, quote, quotes, _i, _len;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = req.response;
      node = d.importNode(doc.getElementById("m" + replyID));
      quotes = node.getElementsByClassName('quotelink');
      for (_i = 0, _len = quotes.length; _i < _len; _i++) {
        quote = quotes[_i];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "res/" + href;
      }
      post = {
        el: node,
        threadId: threadID,
        quotes: quotes,
        backlinks: []
      };
      if (Conf['Resurrect Quotes']) {
        Quotify.node(post);
      }
      if (Conf['Quote Preview']) {
        QuotePreview.node(post);
      }
      if (Conf['Quote Inline']) {
        QuoteInline.node(post);
      }
      if (Conf['Indicate OP quote']) {
        QuoteOP.node(post);
      }
      if (Conf['Indicate Cross-thread Quotes']) {
        QuoteCT.node(post);
      }
      return $.replace(a.parentNode.parentNode, node);
    }
  };

  ExpandThread = {
    init: function() {
      var a, span, _i, _len, _ref, _results;
      _ref = $$('.summary');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        span = _ref[_i];
        a = $.el('a', {
          textContent: "+ " + span.textContent,
          className: 'summary desktop',
          href: 'javascript:;'
        });
        $.on(a, 'click', function() {
          return ExpandThread.toggle(this.parentNode);
        });
        _results.push($.replace(span, a));
      }
      return _results;
    },
    toggle: function(thread) {
      var a, backlink, num, pathname, replies, reply, _i, _j, _len, _len1, _ref;
      pathname = "/" + g.BOARD + "/res/" + thread.id.slice(1);
      a = $('.summary', thread);
      switch (a.textContent[0]) {
        case '+':
          a.textContent = a.textContent.replace('+', '\u00d7 Loading...');
          $.cache(pathname, function() {
            return ExpandThread.parse(this, thread, a);
          });
          break;
        case '\u00d7':
          a.textContent = a.textContent.replace('\u00d7 Loading...', '+');
          $.cache.requests[pathname].abort();
          break;
        case '-':
          a.textContent = a.textContent.replace('-', '+');
          num = (function() {
            switch (g.BOARD) {
              case 'b':
              case 'vg':
                return 3;
              case 't':
                return 1;
              default:
                return 5;
            }
          })();
          replies = $$('.replyContainer', thread);
          replies.splice(replies.length - num, num);
          for (_i = 0, _len = replies.length; _i < _len; _i++) {
            reply = replies[_i];
            $.rm(reply);
          }
          _ref = $$('.backlink', a.previousElementSibling);
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            backlink = _ref[_j];
            if (!$.id(backlink.hash.slice(1))) {
              $.rm(backlink);
            }
          }
      }
    },
    parse: function(req, thread, a) {
      var backlink, doc, href, id, link, nodes, post, quote, reply, threadID, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        $.off(a, 'click', ExpandThread.cb.toggle);
        return;
      }
      a.textContent = a.textContent.replace('\u00d7 Loading...', '-');
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = req.response;
      threadID = thread.id.slice(1);
      nodes = [];
      _ref = $$('.replyContainer', doc);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reply = _ref[_i];
        reply = d.importNode(reply);
        _ref1 = $$('.quotelink', reply);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          quote = _ref1[_j];
          href = quote.getAttribute('href');
          if (href[0] === '/') {
            continue;
          }
          quote.href = "res/" + href;
        }
        id = reply.id.slice(2);
        link = $('.postInfo > .postNum > a:first-child', reply);
        link.href = "res/" + threadID + "#p" + id;
        link.nextSibling.href = "res/" + threadID + "#q" + id;
        nodes.push(reply);
      }
      _ref2 = $$('.summary ~ .replyContainer', a.parentNode);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        post = _ref2[_k];
        $.rm(post);
      }
      _ref3 = $$('.backlink', a.previousElementSibling);
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        backlink = _ref3[_l];
        if (!$.id(backlink.hash.slice(1))) {
          $.rm(backlink);
        }
      }
      return $.after(a, nodes);
    }
  };

  ThreadHiding = {
    init: function() {
      var a, hiddenThreads, thread, _i, _len, _ref;
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      _ref = $$('.thread');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        a = $.el('a', {
          className: 'hide_thread_button',
          innerHTML: '<span>[ - ]</span>',
          href: 'javascript:;'
        });
        $.on(a, 'click', ThreadHiding.cb);
        $.prepend(thread, a);
        if (thread.id.slice(1) in hiddenThreads) {
          ThreadHiding.hide(thread);
        }
      }
    },
    cb: function() {
      return ThreadHiding.toggle(this.parentNode);
    },
    toggle: function(thread) {
      var hiddenThreads, id;
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      id = thread.id.slice(1);
      if (thread.hidden || /\bhidden_thread\b/.test(thread.firstChild.className)) {
        ThreadHiding.show(thread);
        delete hiddenThreads[id];
      } else {
        ThreadHiding.hide(thread);
        hiddenThreads[id] = Date.now();
      }
      return $.set("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
    },
    hide: function(thread) {
      var a, num, opInfo, span, text;
      if (!Conf['Show Stubs']) {
        thread.hidden = true;
        thread.nextElementSibling.hidden = true;
        return;
      }
      if (thread.firstChild.className === 'block') {
        return;
      }
      num = 0;
      if (span = $('.summary', thread)) {
        num = Number(span.textContent.match(/\d+/));
      }
      num += $$('.opContainer ~ .replyContainer', thread).length;
      text = num === 1 ? '1 reply' : "" + num + " replies";
      opInfo = $('.op > .postInfo > .nameBlock', thread).textContent;
      a = $('.hide_thread_button', thread);
      $.addClass(a, 'hidden_thread');
      $.addClass(thread, 'hidden');
      a.firstChild.textContent = '[ + ]';
      return $.add(a, $.tn(" " + opInfo + " (" + text + ")"));
    },
    show: function(thread) {
      var a;
      a = $('.hide_thread_button', thread);
      $.removeClass(a, 'hidden_thread');
      $.removeClass(thread, 'hidden');
      a.innerHTML = '<span>[ - ]</span>';
      thread.hidden = false;
      return thread.nextElementSibling.hidden = false;
    }
  };

  ReplyHiding = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var button, id, isInlined, klass, root;
      id = post.id, isInlined = post.isInlined, klass = post.klass, root = post.root;
      if (isInlined || /\bop\b/.test(klass)) {
        return;
      }
      button = $('.sideArrows', root);
      $.addClass(button, 'hide_reply_button');
      button.innerHTML = '<a href="javascript:;"><span>[ - ]</span></a>';
      $.on(button.firstChild, 'click', ReplyHiding.toggle);
      if (id in g.hiddenReplies) {
        return ReplyHiding.hide(post);
      }
    },
    toggle: function() {
      var button, id, post, quote, quotes, root, _i, _j, _len, _len1;
      button = this.parentNode;
      root = button.parentNode;
      post = Main.preParse(root);
      id = post.id;
      quotes = $$(".quotelink[href$='#p" + id + "'], .backlink[href='#p" + id + "']");
      if (/\bstub\b/.test(button.className)) {
        ReplyHiding.show(post);
        for (_i = 0, _len = quotes.length; _i < _len; _i++) {
          quote = quotes[_i];
          $.removeClass(quote, 'filtered');
        }
        delete g.hiddenReplies[id];
      } else {
        ReplyHiding.hide(post);
        for (_j = 0, _len1 = quotes.length; _j < _len1; _j++) {
          quote = quotes[_j];
          $.addClass(quote, 'filtered');
        }
        g.hiddenReplies[id] = Date.now();
      }
      return $.set("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
    },
    hide: function(post) {
      var button, el, root, stub;
      root = post.root, el = post.el;
      button = $('.sideArrows', root);
      if (button.hidden) {
        return;
      }
      stub = $.el('div', {
        className: 'hide_reply_button stub',
        innerHTML: '<a href="javascript:;"><span>[ + ]</span> </a>'
      });
      $.add(stub.firstChild, $.tn($('.nameBlock', el).textContent));
      $.on(stub.firstChild, 'click', ReplyHiding.toggle);
      $.before(button, stub);
      if (!Conf['Show Stubs']) {
        return stub.hidden = true;
      }
    },
    show: function(post) {
      var button, el, root;
      el = post.el, root = post.root;
      button = $('.sideArrows', root);
      el.hidden = false;
      button.hidden = false;
      if (!Conf['Show Stubs']) {
        return;
      }
      return $.rm(button.previousElementSibling);
    }
  };

  Keybinds = {
    init: function() {
      var node, _i, _len, _ref;
      _ref = $$('[accesskey]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.removeAttribute('accesskey');
      }
      return $.on(d, 'keydown', Keybinds.keydown);
    },
    keydown: function(e) {
      var key, link, o, range, selEnd, selStart, ta, thread, value;
      if (!(key = Keybinds.keyCode(e)) || /TEXTAREA|INPUT/.test(e.target.nodeName) && !(e.altKey || e.ctrlKey || e.keyCode === 27)) {
        return;
      }
      thread = Nav.getThread();
      switch (key) {
        case Conf.openQR:
          Keybinds.qr(thread, true);
          break;
        case Conf.openEmptyQR:
          Keybinds.qr(thread);
          break;
        case Conf.openOptions:
          if (!$.id('overlay')) {
            Options.dialog();
          }
          break;
        case Conf.close:
          if (o = $.id('overlay')) {
            Options.close.call(o);
          } else if (QR.el) {
            QR.close();
          }
          break;
        case Conf.submit:
          if (QR.el && !QR.status()) {
            QR.submit();
          }
          break;
        case Conf.spoiler:
          ta = e.target;
          if (ta.nodeName !== 'TEXTAREA') {
            return;
          }
          value = ta.value;
          selStart = ta.selectionStart;
          selEnd = ta.selectionEnd;
          ta.value = value.slice(0, selStart) + '[spoiler]' + value.slice(selStart, selEnd) + '[/spoiler]' + value.slice(selEnd);
          range = 9 + selEnd;
          ta.setSelectionRange(range, range);
          break;
        case Conf.watch:
          Watcher.toggle(thread);
          break;
        case Conf.update:
          Updater.update();
          break;
        case Conf.unreadCountTo0:
          Unread.replies = [];
          Unread.update(true);
          break;
        case Conf.expandImage:
          Keybinds.img(thread);
          break;
        case Conf.expandAllImages:
          Keybinds.img(thread, true);
          break;
        case Conf.zero:
          window.location = "/" + g.BOARD + "/0#delform";
          break;
        case Conf.nextPage:
          if (link = $('link[rel=next]', d.head)) {
            window.location = link.href + '#delform';
          }
          break;
        case Conf.previousPage:
          if (link = $('link[rel=prev]', d.head)) {
            window.location = link.href + '#delform';
          }
          break;
        case Conf.nextThread:
          if (g.REPLY) {
            return;
          }
          Nav.scroll(+1);
          break;
        case Conf.previousThread:
          if (g.REPLY) {
            return;
          }
          Nav.scroll(-1);
          break;
        case Conf.expandThread:
          ExpandThread.toggle(thread);
          break;
        case Conf.openThread:
          Keybinds.open(thread);
          break;
        case Conf.openThreadTab:
          Keybinds.open(thread, true);
          break;
        case Conf.nextReply:
          Keybinds.hl(+1, thread);
          break;
        case Conf.previousReply:
          Keybinds.hl(-1, thread);
          break;
        case Conf.hide:
          if (/\bthread\b/.test(thread.className)) {
            ThreadHiding.toggle(thread);
          }
          break;
        default:
          return;
      }
      return e.preventDefault();
    },
    keyCode: function(e) {
      var c, kc, key;
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
        if (e.altKey) {
          key = 'alt+' + key;
        }
        if (e.ctrlKey) {
          key = 'ctrl+' + key;
        }
      }
      return key;
    },
    img: function(thread, all) {
      var thumb;
      if (all) {
        return $.id('imageExpand').click();
      } else {
        thumb = $('img[data-md5]', $('.post.highlight', thread) || thread);
        return ImageExpand.toggle(thumb.parentNode);
      }
    },
    qr: function(thread, quote) {
      if (quote) {
        QR.quote.call($('.postInfo > .postNum > a[title="Quote this post"]', $('.post.highlight', thread) || thread));
      } else {
        QR.open();
      }
      return $('textarea', QR.el).focus();
    },
    open: function(thread, tab) {
      var id, url;
      id = thread.id.slice(1);
      url = "//boards.4chan.org/" + g.BOARD + "/res/" + id;
      if (tab) {
        return $.open(url);
      } else {
        return location.href = url;
      }
    },
    hl: function(delta, thread) {
      var axis, next, post, rect, replies, reply, _i, _len;
      if (post = $('.reply.highlight', thread)) {
        $.removeClass(post, 'highlight');
        rect = post.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top <= d.documentElement.clientHeight) {
          axis = delta === +1 ? 'following' : 'preceding';
          next = $.x(axis + '::div[contains(@class,"post reply")]', post);
          if (!next) {
            return;
          }
          if (!(g.REPLY || $.x('ancestor::div[@class="thread"]', next) === thread)) {
            return;
          }
          rect = next.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > d.documentElement.clientHeight) {
            next.scrollIntoView(delta === -1);
          }
          this.focus(next);
          return;
        }
      }
      replies = $$('.reply', thread);
      if (delta === -1) {
        replies.reverse();
      }
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        rect = reply.getBoundingClientRect();
        if (delta === +1 && rect.top >= 0 || delta === -1 && rect.bottom <= d.documentElement.clientHeight) {
          this.focus(reply);
          return;
        }
      }
    },
    focus: function(post) {
      $.addClass(post, 'highlight');
      return post.focus();
    }
  };

  Nav = {
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
      $.on(prev, 'click', this.prev);
      $.on(next, 'click', this.next);
      $.add(span, [prev, $.tn(' '), next]);
      return $.add(d.body, span);
    },
    prev: function() {
      if (g.REPLY) {
        return window.scrollTo(0, 0);
      } else {
        return Nav.scroll(-1);
      }
    },
    next: function() {
      if (g.REPLY) {
        return window.scrollTo(0, d.body.scrollHeight);
      } else {
        return Nav.scroll(+1);
      }
    },
    getThread: function(full) {
      var bottom, i, rect, thread, _i, _len, _ref;
      Nav.threads = $$('.thread:not(.hidden)');
      _ref = Nav.threads;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
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
      return $('.board');
    },
    scroll: function(delta) {
      var i, link, rect, thread, top, _ref, _ref1;
      _ref = Nav.getThread(true), thread = _ref[0], i = _ref[1], rect = _ref[2];
      top = rect.top;
      if (!((delta === -1 && Math.ceil(top) < 0) || (delta === +1 && top > 1))) {
        i += delta;
      }
      if (Conf['Rollover']) {
        if (i === -1) {
          if (link = $('link[rel=prev]', d.head)) {
            window.location = link.href + '#delform';
          } else {
            window.location = "/" + g.BOARD + "/0#delform";
          }
          return;
        }
        if ((delta === +1) && ((i === Nav.threads.length) || (innerHeight + pageYOffset === d.body.scrollHeight))) {
          if (link = $('link[rel=next]', d.head)) {
            window.location = link.href + '#delform';
            return;
          }
        }
      }
      top = (_ref1 = Nav.threads[i]) != null ? _ref1.getBoundingClientRect().top : void 0;
      return window.scrollBy(0, top);
    }
  };

  QR = {
    init: function() {
      if (!$.id('recaptcha_challenge_field_holder')) {
        return;
      }
      Main.callbacks.push(this.node);
      return setTimeout(this.asyncInit);
    },
    asyncInit: function() {
      var link, script;
      if (Conf['Hide Original Post Form']) {
        link = $.el('h1', {
          innerHTML: "<a href=javascript:;>" + (g.REPLY ? 'Quick Reply' : 'New Thread') + "</a>"
        });
        $.on(link.firstChild, 'click', function() {
          QR.open();
          if (!g.REPLY) {
            $('select', QR.el).value = 'new';
          }
          return $('textarea', QR.el).focus();
        });
        $.before($.id('postForm'), link);
      }
      script = $.el('script', {
        textContent: 'Recaptcha.focus_response_field=function(){}'
      });
      $.add(d.head, script);
      $.rm(script);
      if (Conf['Persistent QR']) {
        QR.dialog();
        if (Conf['Auto Hide QR']) {
          QR.hide();
        }
      }
      $.on(d, 'dragover', QR.dragOver);
      $.on(d, 'drop', QR.dropFile);
      return $.on(d, 'dragstart dragend', QR.drag);
    },
    node: function(post) {
      return $.on($('.postInfo > .postNum > a[title="Quote this post"]', post.el), 'click', QR.quote);
    },
    open: function() {
      if (QR.el) {
        QR.el.hidden = false;
        return QR.unhide();
      } else {
        return QR.dialog();
      }
    },
    close: function() {
      var i, spoiler, _i, _len, _ref;
      QR.el.hidden = true;
      QR.abort();
      d.activeElement.blur();
      $.removeClass(QR.el, 'dump');
      _ref = QR.replies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        QR.replies[0].rm();
      }
      QR.cooldown.auto = false;
      QR.status();
      QR.resetFileInput();
      if (!Conf['Remember Spoiler'] && (spoiler = $.id('spoiler')).checked) {
        spoiler.click();
      }
      return QR.cleanError();
    },
    hide: function() {
      d.activeElement.blur();
      $.addClass(QR.el, 'autohide');
      return $.id('autohide').checked = true;
    },
    unhide: function() {
      $.removeClass(QR.el, 'autohide');
      return $.id('autohide').checked = false;
    },
    toggleHide: function() {
      return this.checked && QR.hide() || QR.unhide();
    },
    error: function(err, node) {
      var el;
      el = $('.warning', QR.el);
      el.textContent = err;
      if (node) {
        $.replace(el.firstChild, node);
      }
      QR.open();
      if (/captcha|verification/i.test(err)) {
        $('[autocomplete]', QR.el).focus();
      }
      if (d.hidden || d.oHidden || d.mozHidden || d.webkitHidden) {
        return alert(err);
      }
    },
    cleanError: function() {
      return $('.warning', QR.el).textContent = null;
    },
    status: function(data) {
      var disabled, input, value;
      if (data == null) {
        data = {};
      }
      if (!QR.el) {
        return;
      }
      if (g.dead) {
        value = 404;
        disabled = true;
        QR.cooldown.auto = false;
      }
      value = QR.cooldown.seconds || data.progress || value;
      input = QR.status.input;
      input.value = QR.cooldown.auto && Conf['Cooldown'] ? value ? "Auto " + value : 'Auto' : value || 'Submit';
      return input.disabled = disabled || false;
    },
    cooldown: {
      init: function() {
        if (!Conf['Cooldown']) {
          return;
        }
        QR.cooldown.start($.get("/" + g.BOARD + "/cooldown", 0));
        return $.sync("/" + g.BOARD + "/cooldown", QR.cooldown.start);
      },
      start: function(timeout) {
        var seconds;
        seconds = Math.floor((timeout - Date.now()) / 1000);
        return QR.cooldown.count(seconds);
      },
      set: function(seconds) {
        if (!Conf['Cooldown']) {
          return;
        }
        QR.cooldown.count(seconds);
        return $.set("/" + g.BOARD + "/cooldown", Date.now() + seconds * $.SECOND);
      },
      count: function(seconds) {
        if (!((0 <= seconds && seconds <= 60))) {
          return;
        }
        setTimeout(QR.cooldown.count, 1000, seconds - 1);
        QR.cooldown.seconds = seconds;
        if (seconds === 0) {
          $["delete"]("/" + g.BOARD + "/cooldown");
          if (QR.cooldown.auto) {
            QR.submit();
          }
        }
        return QR.status();
      }
    },
    quote: function(e) {
      var caretPos, id, range, s, sel, ta, text, _ref;
      if (e != null) {
        e.preventDefault();
      }
      QR.open();
      if (!g.REPLY) {
        $('select', QR.el).value = $.x('ancestor::div[@class="thread"]', this).id.slice(1);
      }
      id = this.previousSibling.hash.slice(2);
      text = ">>" + id + "\n";
      sel = window.getSelection();
      if ((s = sel.toString()) && id === ((_ref = $.x('ancestor-or-self::blockquote', sel.anchorNode)) != null ? _ref.id.match(/\d+$/)[0] : void 0)) {
        s = s.replace(/\n/g, '\n>');
        text += ">" + s + "\n";
      }
      ta = $('textarea', QR.el);
      caretPos = ta.selectionStart;
      QR.selected.el.lastChild.textContent = QR.selected.com = ta.value = ta.value.slice(0, caretPos) + text + ta.value.slice(ta.selectionEnd);
      ta.focus();
      range = caretPos + text.length;
      return ta.setSelectionRange(range, range);
    },
    drag: function(e) {
      var i;
      i = e.type === 'dragstart' ? 'off' : 'on';
      $[i](d, 'dragover', QR.dragOver);
      return $[i](d, 'drop', QR.dropFile);
    },
    dragOver: function(e) {
      e.preventDefault();
      return e.dataTransfer.dropEffect = 'copy';
    },
    dropFile: function(e) {
      if (!e.dataTransfer.files.length) {
        return;
      }
      e.preventDefault();
      QR.open();
      QR.fileInput.call(e.dataTransfer);
      return $.addClass(QR.el, 'dump');
    },
    fileInput: function() {
      var file, _i, _len, _ref;
      QR.cleanError();
      if (this.files.length === 1) {
        file = this.files[0];
        if (file.size > this.max) {
          QR.error('File too large.');
          QR.resetFileInput();
        } else if (-1 === QR.mimeTypes.indexOf(file.type)) {
          QR.error('Unsupported file type.');
          QR.resetFileInput();
        } else {
          QR.selected.setFile(file);
        }
        return;
      }
      _ref = this.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.size > this.max) {
          QR.error("File " + file.name + " is too large.");
          break;
        } else if (-1 === QR.mimeTypes.indexOf(file.type)) {
          QR.error("" + file.name + ": Unsupported file type.");
          break;
        }
        if (!QR.replies[QR.replies.length - 1].file) {
          QR.replies[QR.replies.length - 1].setFile(file);
        } else {
          new QR.reply().setFile(file);
        }
      }
      $.addClass(QR.el, 'dump');
      return QR.resetFileInput();
    },
    resetFileInput: function() {
      return $('[type=file]', QR.el).value = null;
    },
    replies: [],
    reply: (function() {

      function _Class() {
        var persona, prev,
          _this = this;
        prev = QR.replies[QR.replies.length - 1];
        persona = $.get('QR.persona', {});
        this.name = prev ? prev.name : persona.name || null;
        this.email = prev && !/^sage$/.test(prev.email) ? prev.email : persona.email || null;
        this.sub = prev && Conf['Remember Subject'] ? prev.sub : Conf['Remember Subject'] ? persona.sub : null;
        this.spoiler = prev && Conf['Remember Spoiler'] ? prev.spoiler : false;
        this.com = null;
        this.el = $.el('a', {
          className: 'preview',
          draggable: true,
          href: 'javascript:;',
          innerHTML: '<a class=remove>&times;</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
        });
        $('input', this.el).checked = this.spoiler;
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
        $.before($('#addReply', QR.el), this.el);
        $.on(this.el, 'dragstart', this.dragStart);
        $.on(this.el, 'dragenter', this.dragEnter);
        $.on(this.el, 'dragleave', this.dragLeave);
        $.on(this.el, 'dragover', this.dragOver);
        $.on(this.el, 'dragend', this.dragEnd);
        $.on(this.el, 'drop', this.drop);
        QR.replies.push(this);
      }

      _Class.prototype.setFile = function(file) {
        var fileUrl, img, url,
          _this = this;
        this.file = file;
        this.el.title = file.name;
        if (QR.spoiler) {
          $('label', this.el).hidden = false;
        }
        if (file.type === 'application/pdf') {
          this.el.style.backgroundImage = null;
          return;
        }
        url = window.URL || window.webkitURL;
        url.revokeObjectURL(this.url);
        fileUrl = url.createObjectURL(file);
        img = $.el('img');
        $.on(img, 'load', function() {
          var bb, c, data, i, l, s, ui8a, _i;
          s = 90 * 3;
          if (img.height < s || img.width < s) {
            _this.url = fileUrl;
            _this.el.style.backgroundImage = "url(" + _this.url + ")";
            return;
          }
          if (img.height <= img.width) {
            img.width = s / img.height * img.width;
            img.height = s;
          } else {
            img.height = s / img.width * img.height;
            img.width = s;
          }
          c = $.el('canvas');
          c.height = img.height;
          c.width = img.width;
          c.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
          data = atob(c.toDataURL().split(',')[1]);
          l = data.length;
          ui8a = new Uint8Array(l);
          for (i = _i = 0; 0 <= l ? _i < l : _i > l; i = 0 <= l ? ++_i : --_i) {
            ui8a[i] = data.charCodeAt(i);
          }
          bb = new (window.MozBlobBuilder || window.WebKitBlobBuilder)();
          bb.append(ui8a.buffer);
          _this.url = url.createObjectURL(bb.getBlob('image/png'));
          _this.el.style.backgroundImage = "url(" + _this.url + ")";
          return url.revokeObjectURL(fileUrl);
        });
        return img.src = fileUrl;
      };

      _Class.prototype.rmFile = function() {
        QR.resetFileInput();
        delete this.file;
        this.el.title = null;
        this.el.style.backgroundImage = null;
        if (QR.spoiler) {
          $('label', this.el).hidden = true;
        }
        return (window.URL || window.webkitURL).revokeObjectURL(this.url);
      };

      _Class.prototype.select = function() {
        var data, rectEl, rectList, _i, _len, _ref, _ref1;
        if ((_ref = QR.selected) != null) {
          _ref.el.id = null;
        }
        QR.selected = this;
        this.el.id = 'selected';
        rectEl = this.el.getBoundingClientRect();
        rectList = this.el.parentNode.getBoundingClientRect();
        this.el.parentNode.scrollLeft += rectEl.left + rectEl.width / 2 - rectList.left - rectList.width / 2;
        _ref1 = ['name', 'email', 'sub', 'com'];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          data = _ref1[_i];
          $("[name=" + data + "]", QR.el).value = this[data];
        }
        return $('#spoiler', QR.el).checked = this.spoiler;
      };

      _Class.prototype.dragStart = function() {
        return $.addClass(this, 'drag');
      };

      _Class.prototype.dragEnter = function() {
        return $.addClass(this, 'over');
      };

      _Class.prototype.dragLeave = function() {
        return $.removeClass(this, 'over');
      };

      _Class.prototype.dragOver = function(e) {
        e.preventDefault();
        return e.dataTransfer.dropEffect = 'move';
      };

      _Class.prototype.drop = function() {
        var el, index, newIndex, oldIndex, reply;
        el = $('.drag', this.parentNode);
        index = function(el) {
          return Array.prototype.slice.call(el.parentNode.children).indexOf(el);
        };
        oldIndex = index(el);
        newIndex = index(this);
        if (oldIndex < newIndex) {
          $.after(this, el);
        } else {
          $.before(this, el);
        }
        reply = QR.replies.splice(oldIndex, 1)[0];
        return QR.replies.splice(newIndex, 0, reply);
      };

      _Class.prototype.dragEnd = function() {
        var el;
        $.removeClass(this, 'drag');
        if (el = $('.over', this.parentNode)) {
          return $.removeClass(el, 'over');
        }
      };

      _Class.prototype.rm = function() {
        var index;
        QR.resetFileInput();
        $.rm(this.el);
        index = QR.replies.indexOf(this);
        if (QR.replies.length === 1) {
          new QR.reply().select();
        } else if (this.el.id === 'selected') {
          (QR.replies[index - 1] || QR.replies[index + 1]).select();
        }
        QR.replies.splice(index, 1);
        (window.URL || window.webkitURL).revokeObjectURL(this.url);
        return delete this;
      };

      return _Class;

    })(),
    captcha: {
      init: function() {
        var _this = this;
        this.img = $('.captcha > img', QR.el);
        this.input = $('[autocomplete]', QR.el);
        this.challenge = $.id('recaptcha_challenge_field_holder');
        $.on(this.img.parentNode, 'click', this.reload);
        $.on(this.input, 'keydown', this.keydown);
        $.on(this.challenge, 'DOMNodeInserted', function() {
          return _this.load();
        });
        $.sync('captchas', function(arr) {
          return _this.count(arr.length);
        });
        this.count($.get('captchas', []).length);
        return this.reload();
      },
      save: function() {
        var captcha, captchas, response;
        if (!(response = this.input.value)) {
          return;
        }
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
        this.timeout = Date.now() + 26 * $.MINUTE;
        challenge = this.challenge.firstChild.value;
        this.img.alt = challenge;
        this.img.src = "//www.google.com/recaptcha/api/image?c=" + challenge;
        return this.input.value = null;
      },
      count: function(count) {
        this.input.placeholder = (function() {
          switch (count) {
            case 0:
              return 'Verification (Shift + Enter to cache)';
            case 1:
              return 'Verification (1 cached captcha)';
            default:
              return "Verification (" + count + " cached captchas)";
          }
        })();
        return this.input.alt = count;
      },
      reload: function(focus) {
        window.location = 'javascript:Recaptcha.reload()';
        if (focus) {
          return QR.captcha.input.focus();
        }
      },
      keydown: function(e) {
        var c;
        c = QR.captcha;
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
      var e, fileInput, id, mimeTypes, name, spoiler, ta, thread, threads, _i, _j, _len, _len1, _ref, _ref1;
      QR.el = UI.dialog('qr', 'top:0;right:0;', '\
<div class=move>\
  Quick Reply <input type=checkbox id=autohide title=Auto-hide>\
  <span> <a class=close title=Close>&times;</a></span>\
</div>\
<form>\
  <div><input id=dump class=field type=button title="Dump list" value=+><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>\
  <div id=replies><div><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>\
  <div><textarea name=com title=Comment placeholder=Comment class=field></textarea></div>\
  <div class=captcha title=Reload><img></div>\
  <div><input title=Verification class=field autocomplete=off size=1></div>\
  <div><input type=file title="Shift+Click to remove the selected file." multiple size=16><input type=submit></div>\
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image</label>\
  <div class=warning></div>\
</form>');
      if (Conf['Remember QR size'] && $.engine === 'gecko') {
        $.on(ta = $('textarea', QR.el), 'mouseup', function() {
          return $.set('QR.size', this.style.cssText);
        });
        ta.style.cssText = $.get('QR.size', '');
      }
      mimeTypes = $('ul.rules').firstElementChild.textContent.trim().match(/: (.+)/)[1].toLowerCase().replace(/\w+/g, function(type) {
        switch (type) {
          case 'jpg':
            return 'image/jpeg';
          case 'pdf':
            return 'application/pdf';
          default:
            return "image/" + type;
        }
      });
      QR.mimeTypes = mimeTypes.split(', ');
      QR.mimeTypes.push('');
      fileInput = $('input[type=file]', QR.el);
      fileInput.max = $('input[name=MAX_FILE_SIZE]').value;
      fileInput.accept = mimeTypes;
      QR.spoiler = !!$('input[name=spoiler]');
      spoiler = $('#spoilerLabel', QR.el);
      spoiler.hidden = !QR.spoiler;
      if (!g.REPLY) {
        threads = '<option value=new>New thread</option>';
        _ref = $$('.thread');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thread = _ref[_i];
          id = thread.id.slice(1);
          threads += "<option value=" + id + ">Thread " + id + "</option>";
        }
        $.prepend($('.move > span', QR.el), $.el('select', {
          innerHTML: threads,
          title: 'Create a new thread / Reply to a thread'
        }));
        $.on($('select', QR.el), 'mousedown', function(e) {
          return e.stopPropagation();
        });
      }
      $.on($('#autohide', QR.el), 'change', QR.toggleHide);
      $.on($('.close', QR.el), 'click', QR.close);
      $.on($('#dump', QR.el), 'click', function() {
        return QR.el.classList.toggle('dump');
      });
      $.on($('#addReply', QR.el), 'click', function() {
        return new QR.reply().select();
      });
      $.on($('form', QR.el), 'submit', QR.submit);
      $.on($('textarea', QR.el), 'keyup', function() {
        return QR.selected.el.lastChild.textContent = this.value;
      });
      $.on(fileInput, 'change', QR.fileInput);
      $.on(fileInput, 'click', function(e) {
        if (e.shiftKey) {
          return QR.selected.rmFile() || e.preventDefault();
        }
      });
      $.on(spoiler.firstChild, 'change', function() {
        return $('input', QR.selected.el).click();
      });
      $.on($('.warning', QR.el), 'click', QR.cleanError);
      new QR.reply().select();
      _ref1 = ['name', 'email', 'sub', 'com'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        $.on($("[name=" + name + "]", QR.el), 'input keyup change paste', function() {
          var _ref2;
          QR.selected[this.name] = this.value;
          if (QR.cooldown.auto && QR.selected === QR.replies[0] && (0 < (_ref2 = QR.cooldown.seconds) && _ref2 < 6)) {
            return QR.cooldown.auto = false;
          }
        });
      }
      $.sync('QR.persona', function(persona) {
        var key, val, _results;
        if (!QR.el.hidden) {
          return;
        }
        _results = [];
        for (key in persona) {
          val = persona[key];
          QR.selected[key] = val;
          _results.push($("[name=" + key + "]", QR.el).value = val);
        }
        return _results;
      });
      QR.status.input = $('input[type=submit]', QR.el);
      QR.status();
      QR.cooldown.init();
      QR.captcha.init();
      $.add(d.body, QR.el);
      e = d.createEvent('CustomEvent');
      e.initEvent('QRDialogCreation', true, false);
      return QR.el.dispatchEvent(e);
    },
    submit: function(e) {
      var callbacks, captcha, captchas, challenge, err, form, m, name, opts, post, reply, response, threadID, val;
      if (e != null) {
        e.preventDefault();
      }
      if (QR.cooldown.seconds) {
        QR.cooldown.auto = !QR.cooldown.auto;
        QR.status();
        return;
      }
      QR.abort();
      reply = QR.replies[0];
      if (!(reply.com || reply.file)) {
        err = 'No file selected.';
      } else {
        captchas = $.get('captchas', []);
        while ((captcha = captchas[0]) && captcha.time < Date.now()) {
          captchas.shift();
        }
        if (captcha = captchas.shift()) {
          challenge = captcha.challenge;
          response = captcha.response;
        } else {
          challenge = QR.captcha.img.alt;
          if (response = QR.captcha.input.value) {
            QR.captcha.reload();
          }
        }
        $.set('captchas', captchas);
        QR.captcha.count(captchas.length);
        if (!response) {
          err = 'No valid captcha.';
        }
      }
      if (err) {
        QR.cooldown.auto = false;
        QR.status();
        QR.error(err);
        return;
      }
      QR.cleanError();
      threadID = g.THREAD_ID || $('select', QR.el).value;
      QR.cooldown.auto = QR.replies.length > 1;
      if (Conf['Auto Hide QR'] && !QR.cooldown.auto) {
        QR.hide();
      }
      if (Conf['Thread Watcher'] && Conf['Auto Watch Reply'] && threadID !== 'new') {
        Watcher.watch(threadID);
      }
      if (!QR.cooldown.auto && $.x('ancestor::div[@id="qr"]', d.activeElement)) {
        d.activeElement.blur();
      }
      QR.status({
        progress: '...'
      });
      post = {
        resto: threadID,
        name: reply.name,
        email: reply.email,
        sub: reply.sub,
        com: reply.com,
        upfile: reply.file,
        spoiler: reply.spoiler,
        mode: 'regist',
        pwd: (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $('input[name=pwd]').value,
        recaptcha_challenge_field: challenge,
        recaptcha_response_field: response + ' '
      };
      form = new FormData();
      for (name in post) {
        val = post[name];
        if (val) {
          form.append(name, val);
        }
      }
      callbacks = {
        onload: function() {
          return QR.response(this.response);
        },
        onerror: function() {
          return QR.error('_', $.el('a', {
            href: '//www.4chan.org/banned',
            target: '_blank',
            textContent: 'Connection error, or you are banned.'
          }));
        }
      };
      opts = {
        form: form,
        type: 'POST',
        upCallbacks: {
          onload: function() {
            return QR.status({
              progress: '...'
            });
          },
          onprogress: function(e) {
            return QR.status({
              progress: "" + (Math.round(e.loaded / e.total * 100)) + "%"
            });
          }
        }
      };
      return QR.ajax = $.ajax($.id('postForm').parentNode.action, callbacks, opts);
    },
    response: function(html) {
      var b, doc, err, node, persona, postNumber, reply, thread, _, _ref;
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      if (doc.title === '4chan - Banned') {
        QR.error('_', $.el('a', {
          href: '//www.4chan.org/banned',
          target: '_blank',
          textContent: 'You are banned.'
        }));
        return;
      }
      if (!(b = $('td b', doc))) {
        err = 'Connection error with sys.4chan.org.';
      } else if (b.childElementCount) {
        if (b.firstChild.tagName) {
          node = b.firstChild;
          node.target = '_blank';
        }
        err = b.firstChild.textContent;
      }
      if (err) {
        if (/captcha|verification/i.test(err) || err === 'Connection error with sys.4chan.org.') {
          QR.cooldown.auto = !!$.get('captchas', []).length;
          QR.cooldown.set(2);
        } else {
          QR.cooldown.auto = false;
        }
        QR.status();
        QR.error(err, node);
        return;
      }
      reply = QR.replies[0];
      persona = $.get('QR.persona', {});
      persona = {
        name: reply.name,
        email: /^sage$/.test(reply.email) ? persona.email : reply.email,
        sub: Conf['Remember Subject'] ? reply.sub : null
      };
      $.set('QR.persona', persona);
      _ref = b.lastChild.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref[0], thread = _ref[1], postNumber = _ref[2];
      if (thread === '0') {
        if (Conf['Thread Watcher'] && Conf['Auto Watch']) {
          $.set('autoWatch', postNumber);
        }
        location.pathname = "/" + g.BOARD + "/res/" + postNumber;
      } else {
        QR.cooldown.auto = QR.replies.length > 1;
        QR.cooldown.set(/sage/i.test(reply.email) ? 60 : 30);
        if (Conf['Open Reply in New Tab'] && !g.REPLY && !QR.cooldown.auto) {
          $.open("//boards.4chan.org/" + g.BOARD + "/res/" + thread + "#" + postNumber);
        }
      }
      if (Conf['Persistent QR'] || QR.cooldown.auto) {
        reply.rm();
      } else {
        QR.close();
      }
      if (g.REPLY && (Conf['Unread Count'] || Conf['Unread Favicon'])) {
        Unread.foresee.push(postNumber);
      }
      if (g.REPLY && Conf['Thread Updater'] && Conf['Auto Update This']) {
        Updater.update();
      }
      QR.status();
      return QR.resetFileInput();
    },
    abort: function() {
      var _ref;
      if ((_ref = QR.ajax) != null) {
        _ref.abort();
      }
      return QR.status();
    }
  };

  Options = {
    init: function() {
      var a, home, _i, _len, _ref;
      _ref = [$.id('navtopr'), $.id('navbotr')];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        home = _ref[_i];
        a = $.el('a', {
          textContent: '4chan X',
          href: 'javascript:;'
        });
        $.on(a, 'click', Options.dialog);
        $.replace(home.firstElementChild, a);
      }
      if (!$.get('firstrun')) {
        if (!Favicon.el) {
          Favicon.init();
        }
        $.set('firstrun', true);
        return Options.dialog();
      }
    },
    dialog: function() {
      var arr, back, checked, description, dialog, favicon, fileInfo, hiddenNum, hiddenThreads, indicator, indicators, input, key, li, obj, overlay, ta, time, tr, ul, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
      dialog = $.el('div', {
        id: 'options',
        className: 'reply dialog',
        innerHTML: '<div id=optionsbar>\
  <div id=credits>\
    <a target=_blank href=http://aeosynth.github.com/4chan-x/>4chan X</a>\
    | <a target=_blank href=https://raw.github.com/aeosynth/4chan-x/master/changelog>' + Main.version + '</a>\
    | <a target=_blank href=http://aeosynth.github.com/4chan-x/#bug-report>Issues</a>\
  </div>\
  <div>\
    <label for=main_tab>Main</label>\
    | <label for=filter_tab>Filter</label>\
    | <label for=sauces_tab>Sauce</label>\
    | <label for=rice_tab>Rice</label>\
    | <label for=keybinds_tab>Keybinds</label>\
  </div>\
</div>\
<hr>\
<div id=content>\
  <input type=radio name=tab hidden id=main_tab checked>\
  <div></div>\
  <input type=radio name=tab hidden id=sauces_tab>\
  <div>\
    <div class=warning><code>Sauce</code> is disabled.</div>\
    Lines starting with a <code>#</code> will be ignored.\
    <ul>These parameters will be replaced by their corresponding values:\
      <li>$1: Thumbnail url.</li>\
      <li>$2: Full image url.</li>\
      <li>$3: MD5 hash.</li>\
      <li>$4: Current board.</li>\
    </ul>\
    <textarea name=sauces id=sauces></textarea>\
  </div>\
  <input type=radio name=tab hidden id=filter_tab>\
  <div>\
    <div class=warning><code>Filter</code> is disabled.</div>\
    Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>\
    Lines starting with a <code>#</code> will be ignored.<br>\
    For example, <code>/weeaboo/i</code> will filter posts containing `weeaboo` case-insensitive.\
    <ul>You can use these settings with each regular expression, separate them with semicolons:\
      <li>Per boards, separate them with commas. It is global if not specified.<br>For example: <code>boards:a,jp;</code>.</li>\
      <li>Filter OPs only along with their threads (`only`), replies only (`no`, this is default), or both (`yes`).<br>For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.</li>\
      <li>Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.</li>\
      <li>Highlighted OPs will have their threads put on top of board pages by default.<br>For example: <code>top:yes</code> or <code>top:no</code>.</li>\
    </ul>\
    <p>Name:<br><textarea name=name></textarea></p>\
    <p>Unique ID:<br><textarea name=uniqueid></textarea></p>\
    <p>Tripcode:<br><textarea name=tripcode></textarea></p>\
    <p>Admin/Mod:<br><textarea name=mod></textarea></p>\
    <p>E-mail:<br><textarea name=email></textarea></p>\
    <p>Subject:<br><textarea name=subject></textarea></p>\
    <p>Comment:<br><textarea name=comment></textarea></p>\
    <p>Filename:<br><textarea name=filename></textarea></p>\
    <p>Image dimensions:<br><textarea name=dimensions></textarea></p>\
    <p>Filesize:<br><textarea name=filesize></textarea></p>\
    <p>Image MD5 (uses exact string matching, not regular expressions):<br><textarea name=md5></textarea></p>\
  </div>\
  <input type=radio name=tab hidden id=rice_tab>\
  <div>\
    <div class=warning><code>Quote Backlinks</code> are disabled.</div>\
    <ul>\
      Backlink formatting\
      <li><input type=text name=backlink> : <span id=backlinkPreview></span></li>\
    </ul>\
    <div class=warning><code>Time Formatting</code> is disabled.</div>\
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
    <div class=warning><code>File Info Formatting</code> is disabled.</div>\
    <ul>\
      File Info Formatting\
      <li><input type=text name=fileInfo> : <span id=fileInfoPreview class=fileText></span></li>\
      <li>Link (with original file name): %l (lowercase L, truncated), %L (untruncated)</li>\
      <li>Original file name: %n (Truncated), %N (Untruncated)</li>\
      <li>Spoiler indicator: %p</li>\
      <li>Size: %B (Bytes), %K (KB), %M (MB), %s (4chan default)</li>\
      <li>Resolution: %r (Displays PDF on /po/, for PDFs)</li>\
    </ul>\
    <div class=warning><code>Unread Favicon</code> is disabled.</div>\
    Unread favicons<br>\
    <select name=favicon>\
      <option value=ferongr>ferongr</option>\
      <option value=xat->xat-</option>\
      <option value=Mayhem>Mayhem</option>\
      <option value=Original>Original</option>\
    </select>\
    <span></span>\
  </div>\
  <input type=radio name=tab hidden id=keybinds_tab>\
  <div>\
    <div class=warning><code>Keybinds</code> are disabled.</div>\
    <div>Allowed keys: Ctrl, Alt, a-z, A-Z, 0-9, Up, Down, Right, Left.</div>\
    <table><tbody>\
      <tr><th>Actions</th><th>Keybinds</th></tr>\
    </tbody></table>\
  </div>\
</div>'
      });
      _ref = Config.main;
      for (key in _ref) {
        obj = _ref[key];
        ul = $.el('ul', {
          textContent: key
        });
        for (key in obj) {
          arr = obj[key];
          checked = Conf[key] ? 'checked' : '';
          description = arr[1];
          li = $.el('li', {
            innerHTML: "<label><input type=checkbox name=\"" + key + "\" " + checked + ">" + key + "</label><span class=description>: " + description + "</span>"
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
      $.on($('button', li), 'click', Options.clearHidden);
      $.add($('ul:nth-child(2)', dialog), li);
      _ref1 = $$('textarea', dialog);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        ta = _ref1[_i];
        ta.textContent = Conf[ta.name];
        $.on(ta, 'change', $.cb.value);
      }
      (back = $('[name=backlink]', dialog)).value = Conf['backlink'];
      (time = $('[name=time]', dialog)).value = Conf['time'];
      (fileInfo = $('[name=fileInfo]', dialog)).value = Conf['fileInfo'];
      $.on(back, 'keyup', $.cb.value);
      $.on(back, 'keyup', Options.backlink);
      $.on(time, 'keyup', $.cb.value);
      $.on(time, 'keyup', Options.time);
      $.on(fileInfo, 'keyup', $.cb.value);
      $.on(fileInfo, 'keyup', Options.fileInfo);
      favicon = $('select', dialog);
      favicon.value = Conf['favicon'];
      $.on(favicon, 'change', $.cb.value);
      $.on(favicon, 'change', Options.favicon);
      _ref2 = Config.hotkeys;
      for (key in _ref2) {
        arr = _ref2[key];
        tr = $.el('tr', {
          innerHTML: "<td>" + arr[1] + "</td><td><input name=" + key + "></td>"
        });
        input = $('input', tr);
        input.value = Conf[key];
        $.on(input, 'keydown', Options.keybind);
        $.add($('#keybinds_tab + div tbody', dialog), tr);
      }
      indicators = {};
      _ref3 = $$('.warning', dialog);
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        indicator = _ref3[_j];
        key = indicator.firstChild.textContent;
        indicator.hidden = Conf[key];
        indicators[key] = indicator;
        $.on($("[name='" + key + "']", dialog), 'click', function() {
          return indicators[this.name].hidden = this.checked;
        });
      }
      overlay = $.el('div', {
        id: 'overlay'
      });
      $.on(overlay, 'click', Options.close);
      $.on(dialog, 'click', function(e) {
        return e.stopPropagation();
      });
      $.add(overlay, dialog);
      $.add(d.body, overlay);
      d.body.style.setProperty('overflow', 'hidden', null);
      Options.backlink.call(back);
      Options.time.call(time);
      Options.fileInfo.call(fileInfo);
      return Options.favicon.call(favicon);
    },
    close: function() {
      $.rm(this);
      return d.body.style.removeProperty('overflow');
    },
    clearHidden: function() {
      $["delete"]("hiddenReplies/" + g.BOARD + "/");
      $["delete"]("hiddenThreads/" + g.BOARD + "/");
      this.textContent = "hidden: 0";
      return g.hiddenReplies = {};
    },
    keybind: function(e) {
      var key;
      if (e.keyCode === 9) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if ((key = Keybinds.keyCode(e)) == null) {
        return;
      }
      this.value = key;
      return $.cb.value.call(this);
    },
    time: function() {
      Time.foo();
      Time.date = new Date();
      return $.id('timePreview').textContent = Time.funk(Time);
    },
    backlink: function() {
      return $.id('backlinkPreview').textContent = Conf['backlink'].replace(/%id/, '123456789');
    },
    fileInfo: function() {
      FileInfo.data = {
        link: 'javascript:;',
        spoiler: true,
        size: '276',
        unit: 'KB',
        resolution: '1280x720',
        fullname: 'd9bb2efc98dd0df141a94399ff5880b7.jpg',
        shortname: 'd9bb2efc98dd0df141a94399ff5880(...).jpg'
      };
      FileInfo.setFormats();
      return $.id('fileInfoPreview').innerHTML = FileInfo.funk(FileInfo);
    },
    favicon: function() {
      Favicon["switch"]();
      Unread.update(true);
      return this.nextElementSibling.innerHTML = "<img src=" + Favicon.unreadSFW + "> <img src=" + Favicon.unreadNSFW + "> <img src=" + Favicon.unreadDead + ">";
    }
  };

  Updater = {
    init: function() {
      var checkbox, checked, dialog, html, input, name, title, _i, _len, _ref;
      html = "<div class=move><span id=count></span> <span id=timer>-" + Conf['Interval'] + "</span></div>";
      checkbox = Config.updater.checkbox;
      for (name in checkbox) {
        title = checkbox[name][1];
        checked = Conf[name] ? 'checked' : '';
        html += "<div><label title='" + title + "'>" + name + "<input name='" + name + "' type=checkbox " + checked + "></label></div>";
      }
      checked = Conf['Auto Update'] ? 'checked' : '';
      html += "      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox " + checked + "></label></div>      <div><label>Interval (s)<input name=Interval value=" + Conf['Interval'] + " type=text></label></div>      <div><input value='Update Now' type=button></div>";
      dialog = UI.dialog('updater', 'bottom: 0; right: 0;', html);
      this.count = $('#count', dialog);
      this.timer = $('#timer', dialog);
      this.thread = $.id("t" + g.THREAD_ID);
      this.lastPost = this.thread.lastElementChild;
      _ref = $$('input', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        if (input.type === 'checkbox') {
          $.on(input, 'click', $.cb.checked);
          if (input.name === 'Scroll BG') {
            $.on(input, 'click', this.cb.scrollBG);
            this.cb.scrollBG.call(input);
          }
          if (input.name === 'Verbose') {
            $.on(input, 'click', this.cb.verbose);
            this.cb.verbose.call(input);
          } else if (input.name === 'Auto Update This') {
            $.on(input, 'click', this.cb.autoUpdate);
            this.cb.autoUpdate.call(input);
            Conf[input.name] = input.checked;
          }
        } else if (input.name === 'Interval') {
          $.on(input, 'change', function() {
            return Conf['Interval'] = this.value = parseInt(this.value, 10) || Conf['Interval'];
          });
          $.on(input, 'change', $.cb.value);
        } else if (input.type === 'button') {
          $.on(input, 'click', this.update);
        }
      }
      $.add(d.body, dialog);
      this.retryCoef = 10;
      return this.lastModified = 0;
    },
    cb: {
      verbose: function() {
        if (Conf['Verbose']) {
          Updater.count.textContent = '+0';
          return Updater.timer.hidden = false;
        } else {
          $.extend(Updater.count, {
            className: '',
            textContent: 'Thread Updater'
          });
          return Updater.timer.hidden = true;
        }
      },
      autoUpdate: function() {
        if (this.checked) {
          return Updater.timeoutID = setTimeout(Updater.timeout, 1000);
        } else {
          return clearTimeout(Updater.timeoutID);
        }
      },
      scrollBG: function() {
        return Updater.scrollBG = this.checked ? function() {
          return true;
        } : function() {
          return !(d.hidden || d.oHidden || d.mozHidden || d.webkitHidden);
        };
      },
      update: function() {
        var count, doc, id, lastPost, nodes, reply, scroll, _i, _len, _ref;
        if (this.status === 404) {
          Updater.timer.textContent = '';
          Updater.count.textContent = 404;
          Updater.count.className = 'warning';
          clearTimeout(Updater.timeoutID);
          g.dead = true;
          if (Conf['Unread Count']) {
            Unread.title = Unread.title.match(/^.+-/)[0] + ' 404';
          } else {
            d.title = d.title.match(/^.+-/)[0] + ' 404';
          }
          Unread.update(true);
          QR.abort();
          return;
        }
        Updater.retryCoef = 10;
        Updater.timer.textContent = "-" + Conf['Interval'];
        /*
              Status Code 304: Not modified
              By sending the `If-Modified-Since` header we get a proper status code, and no response.
              This saves bandwidth for both the user and the servers, avoid unnecessary computation,
              and won't load images and scripts when parsing the response.
        */

        if (this.status === 304) {
          if (Conf['Verbose']) {
            Updater.count.textContent = '+0';
            Updater.count.className = null;
          }
          return;
        }
        Updater.lastModified = this.getResponseHeader('Last-Modified');
        doc = d.implementation.createHTMLDocument('');
        doc.documentElement.innerHTML = this.response;
        lastPost = Updater.lastPost;
        id = lastPost.id.slice(2);
        nodes = [];
        _ref = $$('.replyContainer', doc).reverse();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          reply = _ref[_i];
          if (reply.id.slice(2) <= id) {
            break;
          }
          nodes.push(reply);
        }
        count = nodes.length;
        scroll = Conf['Scrolling'] && Updater.scrollBG() && count && lastPost.getBoundingClientRect().bottom - d.documentElement.clientHeight < 25;
        if (Conf['Verbose']) {
          Updater.count.textContent = "+" + count;
          Updater.count.className = count ? 'new' : null;
        }
        $.add(Updater.thread, nodes.reverse());
        if (lastPost = nodes[nodes.length - 1]) {
          Updater.lastPost = lastPost;
        }
        if (scroll) {
          return nodes[0].scrollIntoView();
        }
      }
    },
    timeout: function() {
      var n;
      Updater.timeoutID = setTimeout(Updater.timeout, 1000);
      n = 1 + Number(Updater.timer.textContent);
      if (n === 0) {
        return Updater.update();
      } else if (n === Updater.retryCoef) {
        Updater.retryCoef += 10 * (Updater.retryCoef < 120);
        return Updater.retry();
      } else {
        return Updater.timer.textContent = n;
      }
    },
    retry: function() {
      this.count.textContent = 'Retry';
      this.count.className = null;
      return this.update();
    },
    update: function() {
      var url, _ref;
      Updater.timer.textContent = 0;
      if ((_ref = Updater.request) != null) {
        _ref.abort();
      }
      url = location.pathname + '?' + Date.now();
      return Updater.request = $.ajax(url, {
        onload: Updater.cb.update
      }, {
        headers: {
          'If-Modified-Since': Updater.lastModified
        }
      });
    }
  };

  Watcher = {
    init: function() {
      var favicon, html, input, _i, _len, _ref;
      html = '<div class=move>Thread Watcher</div>';
      this.dialog = UI.dialog('watcher', 'top: 50px; left: 0px;', html);
      $.add(d.body, this.dialog);
      _ref = $$('.op input');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        favicon = $.el('img', {
          className: 'favicon'
        });
        $.on(favicon, 'click', this.cb.toggle);
        $.before(input, favicon);
      }
      if (g.THREAD_ID === $.get('autoWatch', 0)) {
        this.watch(g.THREAD_ID);
        $["delete"]('autoWatch');
      } else {
        this.refresh();
      }
      return $.sync('watched', this.refresh);
    },
    refresh: function(watched) {
      var board, div, favicon, id, link, nodes, props, watchedBoard, x, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      watched || (watched = $.get('watched', {}));
      nodes = [];
      for (board in watched) {
        _ref = watched[board];
        for (id in _ref) {
          props = _ref[id];
          x = $.el('a', {
            textContent: '\u00d7',
            href: 'javascript:;'
          });
          $.on(x, 'click', Watcher.cb.x);
          link = $.el('a', props);
          link.title = link.textContent;
          div = $.el('div');
          $.add(div, [x, $.tn(' '), link]);
          nodes.push(div);
        }
      }
      _ref1 = $$('div:not(.move)', Watcher.dialog);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        div = _ref1[_i];
        $.rm(div);
      }
      $.add(Watcher.dialog, nodes);
      watchedBoard = watched[g.BOARD] || {};
      _ref2 = $$('.favicon');
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        favicon = _ref2[_j];
        id = favicon.nextSibling.name;
        if (id in watchedBoard) {
          favicon.src = Favicon["default"];
        } else {
          favicon.src = Favicon.empty;
        }
      }
    },
    cb: {
      toggle: function() {
        return Watcher.toggle(this.parentNode);
      },
      x: function() {
        var thread;
        thread = this.nextElementSibling.pathname.split('/');
        return Watcher.unwatch(thread[3], thread[1]);
      }
    },
    toggle: function(thread) {
      var id;
      id = $('.favicon + input', thread).name;
      return Watcher.watch(id) || Watcher.unwatch(id, g.BOARD);
    },
    unwatch: function(id, board) {
      var watched;
      watched = $.get('watched', {});
      delete watched[board][id];
      $.set('watched', watched);
      return Watcher.refresh();
    },
    watch: function(id) {
      var thread, watched, _name;
      thread = $.id(id);
      if ($('.favicon', thread).src === Favicon["default"]) {
        return false;
      }
      watched = $.get('watched', {});
      watched[_name = g.BOARD] || (watched[_name] = {});
      watched[g.BOARD][id] = {
        href: "/" + g.BOARD + "/res/" + id,
        textContent: GetTitle(thread)
      };
      $.set('watched', watched);
      Watcher.refresh();
      return true;
    }
  };

  Anonymize = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var name, parent, trip;
      if (post.isInlined && !post.isCrosspost) {
        return;
      }
      name = $('.name', post.el);
      name.textContent = 'Anonymous';
      if ((trip = name.nextElementSibling) && trip.className === 'postertrip') {
        $.rm(trip);
      }
      if ((parent = name.parentNode).className === 'useremail' && !/^sage$/i.test(parent.pathname)) {
        return $.replace(parent, name);
      }
    }
  };

  Sauce = {
    init: function() {
      var link, _i, _len, _ref;
      if (g.BOARD === 'f') {
        return;
      }
      this.links = [];
      _ref = Conf['sauces'].split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        if (link[0] === '#') {
          continue;
        }
        this.links.push(this.createSauceLink(link));
      }
      if (!this.links.length) {
        return;
      }
      return Main.callbacks.push(this.node);
    },
    createSauceLink: function(link) {
      var domain, el, href;
      domain = link.match(/(\w+)\.\w+\//)[1];
      href = link.replace(/(\$\d)/g, function(parameter) {
        switch (parameter) {
          case '$1':
            return "http://thumbs.4chan.org' + img.pathname.replace(/src(\\/\\d+).+$/, 'thumb$1s.jpg') + '";
          case '$2':
            return "' + img.href + '";
          case '$3':
            return "' + img.firstChild.dataset.md5.replace(/\=*$/, '') + '";
          case '$4':
            return g.BOARD;
        }
      });
      href = Function('img', "return '" + href + "'");
      el = $.el('a', {
        target: '_blank',
        textContent: domain
      });
      return function(img) {
        var a;
        a = el.cloneNode(true);
        a.href = href(img);
        return a;
      };
    },
    node: function(post) {
      var img, link, nodes, _i, _len, _ref;
      img = post.img;
      if (post.isInlined && !post.isCrosspost || !img) {
        return;
      }
      img = img.parentNode;
      nodes = [];
      _ref = Sauce.links;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        nodes.push($.tn('\u00A0'), link(img));
      }
      return $.add(post.fileInfo, nodes);
    }
  };

  RevealSpoilers = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var img;
      img = post.img;
      if (!(img && /^Spoiler/.test(img.alt)) || post.isInlined && !post.isCrosspost) {
        return;
      }
      img.removeAttribute('style');
      return img.src = "//thumbs.4chan.org" + (img.parentNode.pathname.replace(/src(\/\d+).+$/, 'thumb$1s.jpg'));
    }
  };

  Time = {
    init: function() {
      var chanOffset;
      Time.foo();
      chanOffset = 5 - new Date().getTimezoneOffset() / 60;
      if ($.isDST()) {
        chanOffset--;
      }
      this.parse = Date.parse('10/11/11(Tue)18:53') === 1318351980000 ? function(text) {
        return new Date(Date.parse(text) + chanOffset * $.HOUR);
      } : function(text) {
        var day, hour, min, month, year, _, _ref;
        _ref = text.match(/(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\d+)/), _ = _ref[0], month = _ref[1], day = _ref[2], year = _ref[3], hour = _ref[4], min = _ref[5];
        year = "20" + year;
        month--;
        hour = chanOffset + Number(hour);
        return new Date(year, month, day, hour, min);
      };
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var node;
      if (post.isInlined && !post.isCrosspost) {
        return;
      }
      node = $('.postInfo > .dateTime', post.el);
      Time.date = Time.parse(node.textContent);
      return node.textContent = Time.funk(Time);
    },
    foo: function() {
      var code;
      code = Conf['time'].replace(/%([A-Za-z])/g, function(s, c) {
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

  FileInfo = {
    init: function() {
      if (g.BOARD === 'f') {
        return;
      }
      this.setFormats();
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var alt, node, span;
      if (post.isInlined && !post.isCrosspost || !post.fileInfo) {
        return;
      }
      node = post.fileInfo.firstElementChild;
      alt = post.img.alt;
      span = $('span', node);
      FileInfo.data = {
        link: post.img.parentNode.href,
        spoiler: /^Spoiler/.test(alt),
        size: alt.match(/\d+/)[0],
        unit: alt.match(/\w+$/)[0],
        resolution: span.previousSibling.textContent.match(/\d+x\d+|PDF/)[0],
        fullname: span.title,
        shortname: span.textContent
      };
      return node.innerHTML = FileInfo.funk(FileInfo);
    },
    setFormats: function() {
      var code;
      code = Conf['fileInfo'].replace(/%([BKlLMnNprs])/g, function(s, c) {
        if (c in FileInfo.formatters) {
          return "' + f.formatters." + c + "() + '";
        } else {
          return s;
        }
      });
      return this.funk = Function('f', "return '" + code + "'");
    },
    convertUnit: function(unitT) {
      var i, size, unitF, units;
      size = this.data.size;
      unitF = this.data.unit;
      if (unitF !== unitT) {
        units = ['B', 'KB', 'MB'];
        i = units.indexOf(unitF) - units.indexOf(unitT);
        if (unitT === 'B') {
          unitT = 'Bytes';
        }
        if (i > 0) {
          while (i-- > 0) {
            size *= 1024;
          }
        } else if (i < 0) {
          while (i++ < 0) {
            size /= 1024;
          }
        }
        if (size < 1 && size.toString().length > size.toFixed(2).length) {
          size = size.toFixed(2);
        }
      }
      return "" + size + " " + unitT;
    },
    formatters: {
      l: function() {
        return "<a href=" + FileInfo.data.link + " target=_blank>" + (this.n()) + "</a>";
      },
      L: function() {
        return "<a href=" + FileInfo.data.link + " target=_blank>" + (this.N()) + "</a>";
      },
      n: function() {
        if (FileInfo.data.fullname === FileInfo.data.shortname) {
          return FileInfo.data.fullname;
        } else {
          return "<span class=fntrunc>" + FileInfo.data.shortname + "</span><span class=fnfull>" + FileInfo.data.fullname + "</span>";
        }
      },
      N: function() {
        return FileInfo.data.fullname;
      },
      p: function() {
        if (FileInfo.data.spoiler) {
          return 'Spoiler, ';
        } else {
          return '';
        }
      },
      s: function() {
        return "" + FileInfo.data.size + " " + FileInfo.data.unit;
      },
      B: function() {
        return FileInfo.convertUnit('B');
      },
      K: function() {
        return FileInfo.convertUnit('KB');
      },
      M: function() {
        return FileInfo.convertUnit('MB');
      },
      r: function() {
        return FileInfo.data.resolution;
      }
    }
  };

  GetTitle = function(thread) {
    var el, op, span;
    op = $('.op', thread);
    el = $('.subject', op);
    if (!el.textContent) {
      el = $('blockquote', op);
      if (!el.textContent) {
        el = $('.nameBlock', op);
      }
    }
    span = $.el('span', {
      innerHTML: el.innerHTML.replace(/<br>/g, ' ')
    });
    return "/" + g.BOARD + "/ - " + (span.textContent.trim());
  };

  TitlePost = {
    init: function() {
      return d.title = GetTitle();
    }
  };

  QuoteBacklink = {
    init: function() {
      var format;
      format = Conf['backlink'].replace(/%id/g, "' + id + '");
      this.funk = Function('id', "return '" + format + "'");
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var a, container, el, link, qid, quote, quotes, _i, _len, _ref;
      if (post.isInlined) {
        return;
      }
      quotes = {};
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (qid = quote.hash.slice(2)) {
          quotes[qid] = true;
        }
      }
      a = $.el('a', {
        href: "#p" + post.id,
        className: post.el.hidden ? 'filtered backlink' : 'backlink',
        textContent: QuoteBacklink.funk(post.id)
      });
      for (qid in quotes) {
        if (!(el = $.id("pi" + qid)) || !Conf['OP Backlinks'] && /\bop\b/.test(el.parentNode.className)) {
          continue;
        }
        link = a.cloneNode(true);
        if (Conf['Quote Preview']) {
          $.on(link, 'mouseover', QuotePreview.mouseover);
        }
        if (Conf['Quote Inline']) {
          $.on(link, 'click', QuoteInline.toggle);
        } else {
          link.setAttribute('onclick', "replyhl('" + post.id + "');");
        }
        if (!(container = $.id("blc" + qid))) {
          container = $.el('span', {
            className: 'container',
            id: "blc" + qid
          });
          $.add(el, container);
        }
        $.add(container, [$.tn(' '), link]);
      }
    }
  };

  QuoteInline = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var quote, _i, _j, _len, _len1, _ref, _ref1;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!quote.hash) {
          continue;
        }
        quote.removeAttribute('onclick');
        $.on(quote, 'click', QuoteInline.toggle);
      }
      _ref1 = post.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
        $.on(quote, 'click', QuoteInline.toggle);
      }
    },
    toggle: function(e) {
      var id;
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      id = this.hash.slice(2);
      if (/\binlined\b/.test(this.className)) {
        QuoteInline.rm(this, id);
      } else {
        if ($.x("ancestor::div[contains(@id,'p" + id + "')]", this)) {
          return;
        }
        QuoteInline.add(this, id);
      }
      return this.classList.toggle('inlined');
    },
    add: function(q, id) {
      var clonePost, el, i, inline, pathname, reply, root, _i, _len, _ref;
      root = $.x('ancestor::*[parent::blockquote]', q);
      if (el = $.id("p" + id)) {
        if (/\bop\b/.test(el.className)) {
          $.removeClass(el.parentNode, 'qphl');
        } else {
          $.removeClass(el, 'qphl');
        }
        clonePost = QuoteInline.clone(id, el);
        if (/\bbacklink\b/.test(q.className)) {
          $.after(q.parentNode, clonePost);
          if (Conf['Forward Hiding']) {
            $.addClass(el.parentNode, 'forwarded');
            ++el.dataset.forwarded || (el.dataset.forwarded = 1);
          }
        } else {
          $.after(root, clonePost);
        }
        _ref = Unread.replies;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          reply = _ref[i];
          if (reply.el === el) {
            Unread.replies.splice(i, 1);
            Unread.update(true);
            break;
          }
        }
        return;
      }
      inline = $.el('div', {
        className: 'inline',
        id: "i" + id,
        textContent: "Loading " + id + "..."
      });
      $.after(root, inline);
      pathname = q.pathname;
      return $.cache(pathname, function() {
        return QuoteInline.parse(this, pathname, id, inline);
      });
    },
    rm: function(q, id) {
      var div, inlined, _i, _len, _ref;
      div = $.x("following::div[@id='i_pc" + id + "']", q);
      $.rm(div);
      if (!Conf['Forward Hiding']) {
        return;
      }
      _ref = $$('.backlink.inlined', div);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        inlined = _ref[_i];
        div = $.id(inlined.hash.slice(1));
        if (!--div.dataset.forwarded) {
          $.removeClass(div.parentNode, 'forwarded');
        }
      }
      if (/\bbacklink\b/.test(q.className)) {
        div = $.id("p" + id);
        if (!--div.dataset.forwarded) {
          return $.removeClass(div.parentNode, 'forwarded');
        }
      }
    },
    parse: function(req, pathname, id, inline) {
      var doc, href, link, newInline, node, quote, _i, _len, _ref;
      if (!inline.parentNode) {
        return;
      }
      if (req.status !== 200) {
        inline.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = req.response;
      node = doc.getElementById("p" + id);
      newInline = QuoteInline.clone(id, node);
      _ref = $$('.quotelink', newInline);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "res/" + href;
      }
      link = $('.postInfo > .postNum > a:first-child', newInline);
      link.href = "" + pathname + "#p" + id;
      link.nextSibling.href = "" + pathname + "#q" + id;
      $.addClass(newInline, 'crosspost');
      return $.replace(inline, newInline);
    },
    clone: function(id, el) {
      var clone, node, _i, _len, _ref;
      clone = $.el('div', {
        className: 'postContainer inline',
        id: "i_pc" + id
      });
      $.add(clone, el.cloneNode(true));
      _ref = $$('[id]', clone);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.id = "i_" + node.id;
      }
      return clone;
    }
  };

  QuotePreview = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var quote, _i, _j, _len, _len1, _ref, _ref1;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.hash) {
          $.on(quote, 'mouseover', QuotePreview.mouseover);
        }
      }
      _ref1 = post.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
        $.on(quote, 'mouseover', QuotePreview.mouseover);
      }
    },
    mouseover: function(e) {
      var el, id, qp, quote, replyID, _i, _len, _ref;
      if (/\binlined\b/.test(this.className)) {
        return;
      }
      qp = UI.el = $.el('div', {
        id: 'qp',
        className: 'reply dialog post'
      });
      $.add(d.body, qp);
      id = this.hash.slice(2);
      if (el = $.id("p" + id)) {
        qp.innerHTML = el.innerHTML;
        if (Conf['Quote Highlighting']) {
          if (/\bop\b/.test(el.className)) {
            $.addClass(el.parentNode, 'qphl');
          } else {
            $.addClass(el, 'qphl');
          }
        }
        replyID = $.x('ancestor::div[contains(@class,"postContainer")]', this).id.slice(2);
        _ref = $$('.quotelink, .backlink', qp);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          quote = _ref[_i];
          if (quote.hash.slice(2) === replyID) {
            $.addClass(quote, 'forwardlink');
          }
        }
      } else {
        qp.textContent = "Loading " + id + "...";
        $.cache(this.pathname, function() {
          return QuotePreview.parse(this, id);
        });
        UI.hover(e);
      }
      $.on(this, 'mousemove', UI.hover);
      return $.on(this, 'mouseout click', QuotePreview.mouseout);
    },
    mouseout: function() {
      var el;
      UI.hoverend();
      if (el = $.id(this.hash.slice(1))) {
        if (/\bop\b/.test(el.className)) {
          $.removeClass(el.parentNode, 'qphl');
        } else {
          $.removeClass(el, 'qphl');
        }
      }
      $.off(this, 'mousemove', UI.hover);
      return $.off(this, 'mouseout click', QuotePreview.mouseout);
    },
    parse: function(req, id) {
      var doc, fileInfo, img, node, post, qp;
      if (!((qp = UI.el) && qp.textContent === ("Loading " + id + "..."))) {
        return;
      }
      if (req.status !== 200) {
        qp.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = req.response;
      node = doc.getElementById("p" + id);
      qp.innerHTML = node.innerHTML;
      post = {
        el: qp
      };
      if (fileInfo = $('.fileInfo', qp)) {
        img = fileInfo.nextElementSibling.firstElementChild;
        if (img.alt !== 'File deleted.') {
          post.fileInfo = fileInfo;
          post.img = img;
        }
      }
      if (Conf['Image Auto-Gif']) {
        AutoGif.node(post);
      }
      if (Conf['Time Formatting']) {
        Time.node(post);
      }
      if (Conf['File Info Formatting']) {
        return FileInfo.node(post);
      }
    }
  };

  QuoteOP = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var quote, _i, _len, _ref;
      if (post.isInlined && !post.isCrosspost) {
        return;
      }
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.hash.slice(2) === post.threadId) {
          $.add(quote, $.tn('\u00A0(OP)'));
        }
      }
    }
  };

  QuoteCT = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var path, quote, _i, _len, _ref;
      if (post.isInlined && !post.isCrosspost) {
        return;
      }
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!quote.hash) {
          continue;
        }
        path = quote.pathname.split('/');
        if (path[1] === g.BOARD && path[3] !== post.threadId) {
          $.add(quote, $.tn('\u00A0(Cross-thread)'));
        }
      }
    }
  };

  Quotify = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var a, board, data, i, id, index, m, node, nodes, quote, quotes, snapshot, text, _i, _j, _len, _ref;
      if (post.isInlined && !post.isCrosspost) {
        return;
      }
      snapshot = d.evaluate('.//text()[not(parent::a)]', post.el.lastElementChild, null, 6, null);
      for (i = _i = 0, _ref = snapshot.snapshotLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        node = snapshot.snapshotItem(i);
        data = node.data;
        if (!(quotes = data.match(/>>(>\/[a-z\d]+\/)?\d+/g))) {
          continue;
        }
        nodes = [];
        for (_j = 0, _len = quotes.length; _j < _len; _j++) {
          quote = quotes[_j];
          index = data.indexOf(quote);
          if (text = data.slice(0, index)) {
            nodes.push($.tn(text));
          }
          id = quote.match(/\d+$/)[0];
          board = (m = quote.match(/^>>>\/([a-z\d]+)/)) ? m[1] : $('.postInfo > .postNum > a:first-child', post.el).pathname.split('/')[1];
          nodes.push(a = $.el('a', {
            textContent: "" + quote + "\u00A0(Dead)"
          }));
          if (board === g.BOARD && $.id(id)) {
            a.href = "#p" + id;
            a.className = 'quotelink';
            a.setAttribute('onclick', "replyhl('" + id + "');");
          } else {
            a.href = Redirect.thread(board, id, 'post');
            a.className = 'deadlink';
            a.target = '_blank';
          }
          data = data.slice(index + quote.length);
        }
        if (data) {
          nodes.push($.tn(data));
        }
        $.replace(node, nodes);
      }
    }
  };

  QuoteThreading = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var id, keys, next, pEl, pid, preply, prev, qid, qreply, quote, quotes, replies, reply, uniq, _i, _len;
      quotes = post.quotes, id = post.id;
      replies = Unread.replies;
      uniq = {};
      for (_i = 0, _len = quotes.length; _i < _len; _i++) {
        quote = quotes[_i];
        qid = quote.hash.slice(2);
        if (!(qid < id)) {
          continue;
        }
        if (qid in replies) {
          uniq[qid] = true;
        }
      }
      keys = Object.keys(uniq);
      if (keys.length !== 1) {
        return;
      }
      qid = keys[0];
      qreply = replies[qid];
      reply = replies[id];
      $.add(qreply.el.parentNode, reply.el.parentNode);
      pEl = reply.el.parentNode.previousElementSibling;
      if (/postContainer/.test(pEl.className)) {
        pid = pEl.id.slice(2);
        preply = replies[pid];
      } else {
        pid = qid;
        preply = qreply;
      }
      prev = reply.prev, next = reply.next;
      if (preply === prev) {
        return;
      }
      prev.next = next;
      if (next != null) {
        next.prev = prev;
      }
      next = preply.next;
      preply.next = reply;
      reply.next = next;
      return Unread.replies = replies;
    }
  };

  ReportButton = {
    init: function() {
      this.a = $.el('a', {
        className: 'report_button',
        innerHTML: '[&nbsp;!&nbsp;]',
        href: 'javascript:;'
      });
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var a;
      if (!(a = $('.report_button', post.el))) {
        a = ReportButton.a.cloneNode(true);
        $.add($('.postInfo', post.el), a);
      }
      return $.on(a, 'click', ReportButton.report);
    },
    report: function() {
      var id, set, url;
      url = "//sys.4chan.org/" + g.BOARD + "/imgboard.php?mode=report&no=" + ($.x('preceding-sibling::input', this).name);
      id = Date.now();
      set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200";
      return window.open(url, id, set);
    }
  };

  ThreadStats = {
    init: function() {
      var dialog;
      dialog = UI.dialog('stats', 'bottom: 0; left: 0;', '<div class=move><span id=postcount>0</span> / <span id=imagecount>0</span></div>');
      dialog.className = 'dialog';
      $.add(d.body, dialog);
      this.posts = this.images = 0;
      this.imgLimit = (function() {
        switch (g.BOARD) {
          case 'a':
          case 'mlp':
          case 'v':
            return 251;
          case 'vg':
            return 501;
          default:
            return 151;
        }
      })();
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var imgcount;
      if (post.isInlined) {
        return;
      }
      $.id('postcount').textContent = ++ThreadStats.posts;
      if (!post.img) {
        return;
      }
      imgcount = $.id('imagecount');
      imgcount.textContent = ++ThreadStats.images;
      if (ThreadStats.images > ThreadStats.imgLimit) {
        return $.addClass(imgcount, 'warning');
      }
    }
  };

  Unread = {
    init: function() {
      this.title = d.title;
      this.update();
      $.on(window, 'scroll', Unread.scroll);
      return Main.callbacks.push(this.node);
    },
    foresee: [],
    replies: {
      first: null,
      last: null
    },
    node: function(post) {
      var el, index, replies, reply;
      if ((index = Unread.foresee.indexOf(post.id)) !== -1) {
        Unread.foresee.splice(index, 1);
        return;
      }
      el = post.el;
      if (el.hidden || /\bop\b/.test(post["class"]) || post.isInlined) {
        return;
      }
      replies = Unread.replies;
      reply = replies[post.id] = {
        prev: replies.last,
        next: null,
        el: el,
        id: post.id
      };
      if (replies.first) {
        reply.prev.next = reply;
      } else {
        replies.first = reply;
      }
      replies.last = reply;
      return Unread.update(1);
    },
    scroll: function() {
      var bottom, first, height, next, replies, update;
      height = d.documentElement.clientHeight;
      replies = Unread.replies;
      first = replies.first;
      update = false;
      while (first) {
        bottom = first.el.getBoundingClientRect().bottom;
        if (bottom > height) {
          break;
        }
        update = true;
        next = first.next;
        delete replies[first.id];
        first = next;
      }
      replies.first = first;
      Unread.replies = replies;
      if (update) {
        return Unread.update(0);
      }
    },
    setTitle: function(count) {
      if (this.scheduled) {
        clearTimeout(this.scheduled);
        delete Unread.scheduled;
        this.setTitle(count);
        return;
      }
      return this.scheduled = setTimeout((function() {
        return d.title = "(" + count + ") " + Unread.title;
      }), 5);
    },
    update: function(updateCount) {
      var count;
      if (!g.REPLY) {
        return;
      }
      count = Object.keys(this.replies).length - 2;
      if (Conf['Unread Count']) {
        this.setTitle(count);
      }
      if (!(Conf['Unread Favicon'] && count === updateCount)) {
        return;
      }
      if ($.engine === 'presto') {
        $.rm(Favicon.el);
      }
      Favicon.el.href = g.dead ? count ? Favicon.unreadDead : Favicon.dead : count ? Favicon.unread : Favicon["default"];
      if (g.dead) {
        $.addClass(Favicon.el, 'dead');
      } else {
        $.removeClass(Favicon.el, 'dead');
      }
      if (count) {
        $.addClass(Favicon.el, 'unread');
      } else {
        $.removeClass(Favicon.el, 'unread');
      }
      if ($.engine !== 'webkit') {
        return $.add(d.head, Favicon.el);
      }
    }
  };

  Favicon = {
    init: function() {
      var href;
      if (this.el) {
        return;
      }
      this.el = $('link[rel="shortcut icon"]', d.head);
      this.el.type = 'image/x-icon';
      href = this.el.href;
      this.SFW = /ws.ico$/.test(href);
      this["default"] = href;
      return this["switch"]();
    },
    "switch": function() {
      switch (Conf['favicon']) {
        case 'ferongr':
          this.unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAOMHAOgLAnMFAL8AAOgLAukMA/+AgP+rq////////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          this.unreadSFW = 'data:image/gif;base64,R0lGODlhEAAQAOMHAADX8QBwfgC2zADX8QDY8nnl8qLp8v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          this.unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAOMHAFT+ACh5AEncAFT+AFX/Acz/su7/5v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          break;
        case 'xat-':
          this.unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2ElEQVQ4y61TQQrCMBDMQ8WDIEV6LbT2A4og2Hq0veo7fIAH04dY9N4xmyYlpGmI2MCQTWYy3Wy2DAD7B2wWAzWgcTgVeZKlZRxHNYFi2jM18oBh0IcKtC6ixf22WT4IFLs0owxswXu9egm0Ls6bwfCFfNsJYJKfqoEkd3vgUgFVLWObtzNgVKyruC+ljSzr5OEnBzjvjcQecaQhbZgBb4CmGQw+PoMkTUtdbd8VSEPakcGxPOcsoIgUKy0LecY29BmdBrqRfjIwZ93KLs5loHvBnL3cLH/jF+C/+z5dgUysAAAAAElFTkSuQmCC';
          this.unreadSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA30lEQVQ4y2P4//8/AyWYgSoGQMF/GJ7Y11VVUVoyKTM9ey4Ig9ggMWQ1YA1IBvzXm34YjkH8mPyJB+Nqlp8FYRAbmxoMF6ArSNrw6T0Qf8Amh9cFMEWVR/7/A+L/uORxhgEIt5/+/3/2lf//5wAxiI0uj+4CBlBgxVUvOwtydgXQZpDmi2/+/7/0GmIQSAwkB1IDUkuUAZeABlx+g2zAZ9wGlAOjChba+LwAUgNSi2HA5Am9VciBhSsQQWyoWgZiovEDsdGI1QBYQiLJAGQalpSxyWEzAJYWkGm8clTJjQCZ1hkoVG0CygAAAABJRU5ErkJggg==';
          this.unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4y2P4//8/AyWYgSoGQMF/GJ7YNbGqrKRiUnp21lwQBrFBYshqwBqQDPifdsYYjkH8mInxB+OWx58FYRAbmxoMF6ArKPmU9B6IP2CTw+sCmKKe/5X/gPg/LnmcYQDCs/63/1/9fzYQzwGz0eXRXcAACqy4ZfFnQc7u+V/xD6T55v+LQHwJbBBIDCQHUgNSS5QBt4Cab/2/jDDgMx4DykrKJ8FCG58XQGpAajEMmNw7uQo5sHAFIogNVctATDR+IDYasRoAS0gkGYBMw5IyNjlsBsDSAjKNV44quREAx58Mr9vt5wQAAAAASUVORK5CYII=';
          break;
        case 'Mayhem':
          this.unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jZ2ScWuDMBDFgw4pIkU0WsoQkWAYIkXZH4N9/+/V3dmfXSrKYIFHwt17j8vdGWNMIkgFuaDgzgQnwRs4EQs5KdolUQtagRN0givEDBTEOjgtGs0Zq8F7cKqqusVxrMQLaDUWcjBSrXkn8gs51tpJSWLk9b3HUa0aNIL5gPBR1/V4kJvR7lTwl8GmAm1Gf9+c3S+89qBHa8502AsmSrtBaEBPbIbj0ah2madlNAPEccdgJDfAtWifBjqWKShRBT6KoiH8QlEUn/qt0CCjnNdmPUwmFWzj9Oe6LpKuZXcwqq88z78Pch3aZU3dPwwc2sWlfZKCW5tWluV8kGvXClLm6dYN4/aUqfCbnEOzNDGhGZbNargvxCzvMGfRJD8UaDVvgkzo6QAAAABJRU5ErkJggg==';
          this.unreadSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZ2S4crCMAxF+0OGDJEPKYrIGKOsiJSx/fJRfSAfTJNyKqXfiuDg0C25N2RJjTGmEVrhTzhw7oStsIEtsVzT4o2Jo9ALThiEM8IdHIgNaHo8mjNWg6/ske8bohPo+63QOLzmooHp8fyAICBSQkVz0QKdsFQEV6WSW/D+7+BbgbIDHcb4Kp61XyjyI16zZ8JemGltQtDBSGxB4/GoN+7TpkkjDCsFArm0IYv3U0BbnYtf8BCy+JytsE0X6VyuKhPPK/GAJ14kvZZDZVV3pZIb8MZr6n4o4PDGKn0S5SdDmyq5PnXQsk+Xbhinp03FFzmHJw6xYRiWm9VxnohZ3vOcxdO8ARmXRvbWdtzQAAAAAElFTkSuQmCC';
          this.unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jZ2S0WrDMAxF/TBCCKWMYhZKCSGYmFJMSNjD/mhf239qJXNcjBdTWODgRLpXKJKNMaYROuFTOHEehFb4gJZYrunwxsSXMApOmIQzwgOciE1oRjyaM1aDj+yR7xuiHvT9VmgcXnPRwO/9+wWCgEgJFc1FCwzCVhFclUpuw/u3g3cFyg50GPOjePZ+ocjPeM2RCXthpbUFwQAzsQ2Nx6PeuE+bJo0w7BQI5NKGLN5XAW11LX7BQ8jia7bCLl2kc7mqTLzuxAOeeJH0Wk6VVf0oldyEN15T948CDm+sMiZRfjK0pZIbUwcd+3TphnF62lR8kXN44hAbhmG5WQNnT8zynucsnuYJhFpBfkMzqD4AAAAASUVORK5CYII=';
          break;
        case 'Original':
          this.unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          this.unreadSFW = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAC6Xw////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          this.unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAGbMM////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
      }
      return this.unread = this.SFW ? this.unreadSFW : this.unreadNSFW;
    },
    empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  };

  Redirect = {
    init: function() {
      var url;
      url = location.hostname === 'images.4chan.org' ? this.image(location.href) : /^\d+$/.test(g.THREAD_ID) ? this.thread() : void 0;
      if (url) {
        return location.href = url;
      }
    },
    image: function(href) {
      href = href.split('/');
      if (!Conf['404 Redirect']) {
        return;
      }
      switch (href[3]) {
        case 'a':
        case 'jp':
        case 'm':
        case 'tg':
        case 'u':
        case 'vg':
          return "http://archive.foolz.us/" + href[3] + "/full_image/" + href[5];
      }
    },
    thread: function(board, id, mode) {
      if (board == null) {
        board = g.BOARD;
      }
      if (id == null) {
        id = g.THREAD_ID;
      }
      if (mode == null) {
        mode = 'thread';
      }
      if (!(Conf['404 Redirect'] || mode === 'post')) {
        return;
      }
      switch (board) {
        case 'a':
        case 'jp':
        case 'm':
        case 'tg':
        case 'tv':
        case 'u':
        case 'v':
        case 'vg':
          return "http://archive.foolz.us/" + board + "/" + mode + "/" + id + "/";
        case 'lit':
          return "http://fuuka.warosu.org/" + board + "/" + mode + "/" + id;
        case 'diy':
        case 'g':
        case 'sci':
          return "https://archive.installgentoo.net/" + board + "/" + mode + "/" + id;
        default:
          if (mode === 'thread') {
            return "//boards.4chan.org/" + board + "/";
          } else {
            return null;
          }
      }
    }
  };

  ImageHover = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      if (!post.img) {
        return;
      }
      return $.on(post.img, 'mouseover', ImageHover.mouseover);
    },
    mouseover: function() {
      UI.el = $.el('img', {
        id: 'ihover',
        src: this.parentNode.href
      });
      $.add(d.body, UI.el);
      $.on(UI.el, 'load', ImageHover.load);
      $.on(this, 'mousemove', UI.hover);
      return $.on(this, 'mouseout', ImageHover.mouseout);
    },
    load: function() {
      var style;
      if (this !== UI.el) {
        return;
      }
      style = this.style;
      return UI.hover({
        clientX: -45 + parseInt(style.left),
        clientY: 120 + parseInt(style.top)
      });
    },
    mouseout: function() {
      UI.hoverend();
      $.off(this, 'mousemove', UI.hover);
      return $.off(this, 'mouseout', ImageHover.mouseout);
    }
  };

  AutoGif = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var gif, img, src;
      img = post.img;
      if (post.el.hidden || !img) {
        return;
      }
      src = img.parentNode.href;
      if (/gif$/.test(src) && !/spoiler/.test(img.src)) {
        gif = $.el('img');
        $.on(gif, 'load', function() {
          return img.src = src;
        });
        return gif.src = src;
      }
    }
  };

  ImageExpand = {
    init: function() {
      Main.callbacks.push(this.node);
      return this.dialog();
    },
    node: function(post) {
      var a;
      if (!post.img) {
        return;
      }
      a = post.img.parentNode;
      $.on(a, 'click', ImageExpand.cb.toggle);
      if (ImageExpand.on && !post.el.hidden) {
        return ImageExpand.expand(post.img);
      }
    },
    cb: {
      toggle: function(e) {
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
          return;
        }
        e.preventDefault();
        return ImageExpand.toggle(this);
      },
      all: function() {
        var i, thumb, thumbs, _i, _j, _k, _len, _len1, _len2, _ref;
        ImageExpand.on = this.checked;
        if (ImageExpand.on) {
          thumbs = $$('img[data-md5]');
          if (Conf['Expand From Current']) {
            for (i = _i = 0, _len = thumbs.length; _i < _len; i = ++_i) {
              thumb = thumbs[i];
              if (thumb.getBoundingClientRect().top > 0) {
                break;
              }
            }
            thumbs = thumbs.slice(i);
          }
          for (_j = 0, _len1 = thumbs.length; _j < _len1; _j++) {
            thumb = thumbs[_j];
            ImageExpand.expand(thumb);
          }
        } else {
          _ref = $$('img[data-md5][hidden]');
          for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
            thumb = _ref[_k];
            ImageExpand.contract(thumb);
          }
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
        $.id('delform').className = klass;
        if (/\bfitheight\b/.test(klass)) {
          $.on(window, 'resize', ImageExpand.resize);
          if (!ImageExpand.style) {
            ImageExpand.style = $.addStyle('');
          }
          return ImageExpand.resize();
        } else if (ImageExpand.style) {
          return $.off(window, 'resize', ImageExpand.resize);
        }
      }
    },
    toggle: function(a) {
      var rect, thumb;
      thumb = a.firstChild;
      if (thumb.hidden) {
        rect = a.getBoundingClientRect();
        if (rect.top < 0) {
          d.body.scrollTop += rect.top - 42;
        }
        if (rect.left < 0) {
          d.body.scrollLeft += rect.left;
        }
        return ImageExpand.contract(thumb);
      } else {
        return ImageExpand.expand(thumb);
      }
    },
    contract: function(thumb) {
      thumb.hidden = false;
      return thumb.nextSibling.hidden = true;
    },
    expand: function(thumb, url) {
      var a, img;
      if ($.x('ancestor-or-self::*[@hidden]', thumb)) {
        return;
      }
      thumb.hidden = true;
      if (img = thumb.nextSibling) {
        img.hidden = false;
        return;
      }
      a = thumb.parentNode;
      img = $.el('img', {
        src: url || a.href
      });
      $.on(img, 'error', ImageExpand.error);
      return $.add(a, img);
    },
    error: function() {
      var href, thumb, timeoutID, url;
      href = this.parentNode.href;
      thumb = this.previousSibling;
      ImageExpand.contract(thumb);
      $.rm(this);
      if (!(this.src.split('/')[2] === 'images.4chan.org' && (url = Redirect.image(href)))) {
        if (g.dead) {
          return;
        }
        url = href + '?' + Date.now();
      }
      timeoutID = setTimeout(ImageExpand.expand, 10000, thumb, url);
      if (!($.engine === 'webkit' && url.split('/')[2] === 'images.4chan.org')) {
        return;
      }
      return $.ajax(url, {
        onreadystatechange: (function() {
          if (this.status === 404) {
            return clearTimeout(timeoutID);
          }
        })
      }, {
        type: 'head'
      });
    },
    dialog: function() {
      var controls, imageType, select;
      controls = $.el('div', {
        id: 'imgControls',
        innerHTML: "<select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label>Expand Images<input type=checkbox id=imageExpand></label>"
      });
      imageType = $.get('imageType', 'full');
      select = $('select', controls);
      select.value = imageType;
      ImageExpand.cb.typeChange.call(select);
      $.on(select, 'change', $.cb.value);
      $.on(select, 'change', ImageExpand.cb.typeChange);
      $.on($('input', controls), 'click', ImageExpand.cb.all);
      return $.prepend($.id('delform'), controls);
    },
    resize: function() {
      return ImageExpand.style.textContent = ".fitheight img[data-md5] + img {max-height:" + d.documentElement.clientHeight + "px;}";
    }
  };

  Main = {
    init: function() {
      var cutoff, hiddenThreads, id, key, now, path, pathname, temp, timestamp, val, _ref;
      Main.flatten(null, Config);
      path = location.pathname;
      pathname = path.slice(1).split('/');
      g.BOARD = pathname[0], temp = pathname[1];
      if (temp === 'res') {
        g.REPLY = true;
        g.THREAD_ID = pathname[2];
      }
      for (key in Conf) {
        val = Conf[key];
        Conf[key] = $.get(key, val);
      }
      switch (location.hostname) {
        case 'sys.4chan.org':
          if (/report/.test(location.search)) {
            $.ready(function() {
              return $.on($.id('recaptcha_response_field'), 'keydown', function(e) {
                if (e.keyCode === 8 && !e.target.value) {
                  return window.location = 'javascript:Recaptcha.reload()';
                }
              });
            });
          }
          return;
        case 'images.4chan.org':
          $.ready(function() {
            if (d.title === '4chan - 404') {
              return Redirect.init();
            }
          });
          return;
      }
      $.ready(Options.init);
      if (Conf['Quick Reply'] && Conf['Hide Original Post Form'] && g.BOARD !== 'f') {
        Main.css += '#postForm { display: none; }';
      }
      Main.addStyle();
      now = Date.now();
      if (Conf['Check for Updates'] && $.get('lastUpdate', 0) < now - 1 * $.DAY) {
        $.on(window, 'message', Main.message);
        $.ready(function() {
          return $.add(d.head, $.el('script', {
            src: 'https://raw.github.com/aeosynth/4chan-x/master/latest.js'
          }));
        });
        $.set('lastUpdate', now);
      }
      g.hiddenReplies = $.get("hiddenReplies/" + g.BOARD + "/", {});
      if ($.get('lastChecked', 0) < now - 1 * $.DAY) {
        $.set('lastChecked', now);
        cutoff = now - 7 * $.DAY;
        hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
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
        $.set("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
        $.set("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
      }
      if (Conf['Filter']) {
        Filter.init();
      }
      if (Conf['Reply Hiding']) {
        ReplyHiding.init();
      }
      if (Conf['Filter'] || Conf['Reply Hiding']) {
        StrikethroughQuotes.init();
      }
      if (Conf['Anonymize']) {
        Anonymize.init();
      }
      if (Conf['Time Formatting']) {
        Time.init();
      }
      if (Conf['File Info Formatting']) {
        FileInfo.init();
      }
      if (Conf['Sauce']) {
        Sauce.init();
      }
      if (Conf['Reveal Spoilers']) {
        RevealSpoilers.init();
      }
      if (Conf['Image Auto-Gif']) {
        AutoGif.init();
      }
      if (Conf['Image Hover']) {
        ImageHover.init();
      }
      if (Conf['Report Button']) {
        ReportButton.init();
      }
      if (Conf['Resurrect Quotes']) {
        Quotify.init();
      }
      if (Conf['Quote Inline']) {
        QuoteInline.init();
      }
      if (Conf['Quote Preview']) {
        QuotePreview.init();
      }
      if (Conf['Quote Backlinks']) {
        QuoteBacklink.init();
      }
      if (Conf['Indicate OP quote']) {
        QuoteOP.init();
      }
      if (Conf['Indicate Cross-thread Quotes']) {
        QuoteCT.init();
      }
      return $.ready(Main.ready);
    },
    ready: function() {
      var MutationObserver, a, board, nav, node, nodes, observer, _i, _j, _len, _len1, _ref, _ref1;
      if (d.title === '4chan - 404') {
        Redirect.init();
        return;
      }
      if (!$.id('navtopr')) {
        return;
      }
      $.addClass(d.body, "chanx_" + (Main.version.split('.')[1]));
      $.addClass(d.body, $.engine);
      _ref = ['boardNavDesktop', 'boardNavDesktopFoot'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nav = _ref[_i];
        if (a = $("a[href$='/" + g.BOARD + "/']", $.id(nav))) {
          $.addClass(a, 'current');
        }
      }
      Favicon.init();
      if (Conf['Quick Reply']) {
        QR.init();
      }
      if (Conf['Image Expansion']) {
        ImageExpand.init();
      }
      if (Conf['Thread Watcher']) {
        Watcher.init();
      }
      if (Conf['Keybinds']) {
        Keybinds.init();
      }
      if (g.REPLY) {
        if (Conf['Thread Updater']) {
          Updater.init();
        }
        if (Conf['Thread Stats']) {
          ThreadStats.init();
        }
        if (Conf['Reply Navigation']) {
          Nav.init();
        }
        if (Conf['Post in Title']) {
          TitlePost.init();
        }
        if (Conf['Unread Count'] || Conf['Unread Favicon']) {
          Unread.init();
        }
        if (Conf['Quote Threading']) {
          QuoteThreading.init();
        }
      } else {
        if (Conf['Thread Hiding']) {
          ThreadHiding.init();
        }
        if (Conf['Thread Expansion']) {
          ExpandThread.init();
        }
        if (Conf['Comment Expansion']) {
          ExpandComment.init();
        }
        if (Conf['Index Navigation']) {
          Nav.init();
        }
      }
      board = $('.board');
      nodes = [];
      _ref1 = $$('.postContainer', board);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        node = _ref1[_j];
        nodes.push(Main.preParse(node));
      }
      Main.node(nodes, true);
      if (MutationObserver = window.WebKitMutationObserver || window.MozMutationObserver || window.OMutationObserver || window.MutationObserver) {
        observer = new MutationObserver(Main.observer);
        return observer.observe(board, {
          childList: true,
          subtree: true
        });
      } else {
        return $.on(board, 'DOMNodeInserted', Main.listener);
      }
    },
    flatten: function(parent, obj) {
      var key, val;
      if (obj instanceof Array) {
        Conf[parent] = obj[0];
      } else if (typeof obj === 'object') {
        for (key in obj) {
          val = obj[key];
          Main.flatten(key, val);
        }
      } else {
        Conf[parent] = obj;
      }
    },
    addStyle: function() {
      $.off(d, 'DOMNodeInserted', Main.addStyle);
      if (d.head) {
        return $.addStyle(Main.css);
      } else {
        return $.on(d, 'DOMNodeInserted', Main.addStyle);
      }
    },
    message: function(e) {
      var version;
      version = e.data.version;
      if (version && version !== Main.version && confirm('An updated version of 4chan X is available, would you like to install it now?')) {
        return window.location = "https://raw.github.com/aeosynth/4chan-x/" + version + "/4chan_x.user.js";
      }
    },
    preParse: function(node) {
      var el, fileInfo, img, post, rootClass;
      rootClass = node.className;
      el = $('.post', node);
      post = {
        root: node,
        el: el,
        "class": el.className,
        klass: el.className,
        id: el.id.slice(1),
        threadId: g.THREAD_ID || $.x('ancestor::div[@class="thread"]', node).id.slice(1),
        isInlined: /\binline\b/.test(rootClass),
        isCrosspost: /\bcrosspost\b/.test(rootClass),
        quotes: el.getElementsByClassName('quotelink'),
        backlinks: el.getElementsByClassName('backlink'),
        fileInfo: false,
        img: false
      };
      if (fileInfo = $('.fileInfo', el)) {
        img = fileInfo.nextElementSibling.firstElementChild;
        if (img.alt !== 'File deleted.') {
          post.fileInfo = fileInfo;
          post.img = img;
        }
      }
      return post;
    },
    node: function(nodes, notify) {
      var callback, node, _i, _j, _len, _len1, _ref;
      _ref = Main.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        try {
          for (_j = 0, _len1 = nodes.length; _j < _len1; _j++) {
            node = nodes[_j];
            callback(node);
          }
        } catch (err) {
          if (notify) {
            alert("4chan X has experienced an error. To help fix this, please send the following snippet to:\nhttp://aeosynth.github.com/4chan-x/#bug-report\n\n" + err.message + "\n" + err.stack);
          }
        }
      }
    },
    observer: function(mutations) {
      var addedNode, mutation, nodes, _i, _j, _len, _len1, _ref;
      nodes = [];
      for (_i = 0, _len = mutations.length; _i < _len; _i++) {
        mutation = mutations[_i];
        _ref = mutation.addedNodes;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          addedNode = _ref[_j];
          if (/\bpostContainer\b/.test(addedNode.className)) {
            nodes.push(Main.preParse(addedNode));
          }
        }
      }
      if (nodes.length) {
        return Main.node(nodes);
      }
    },
    listener: function(e) {
      var target;
      target = e.target;
      if (/\bpostContainer\b/.test(target.className)) {
        return Main.node([Main.preParse(target)]);
      }
    },
    namespace: '4chan_x.',
    version: '3.0.1',
    callbacks: [],
    css: '\
/* dialog styling */\
.dialog.reply {\
  border: 1px solid rgba(0,0,0,.25);\
  padding: 0;\
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
.warning {\
  color: red;\
}\
\
.hide_thread_button {\
  float: left;\
}\
\
.hidden_thread + div.opContainer, /* fucking moot specificity */\
.hidden_thread ~ *,\
[hidden],\
#content > [name=tab]:not(:checked) + div,\
#updater:not(:hover) > :not(.move),\
.autohide:not(:hover) > form,\
#qp input, #qp .inline, .forwarded {\
  display: none !important;\
}\
\
h1 {\
  text-align: center;\
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
#autohide, .close, #qr select, #dump, .remove, .captcha, #qr .warning {\
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
  padding: -moz-calc(1px) 0 2px;\
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
#qr:not(.dump) #replies, .dump > form > label {\
  display: none;\
}\
#replies {\
  display: block;\
  height: 100px;\
  position: relative;\
  -webkit-user-select: none;\
  -moz-user-select: none;\
  -o-user-select: none;\
  user-select: none;\
}\
#replies > div {\
  counter-reset: previews;\
  top: 0; right: 0; bottom: 0; left: 0;\
  margin: 0; padding: 0;\
  overflow: hidden;\
  position: absolute;\
  white-space: pre;\
}\
#replies > div:hover {\
  bottom: -10px;\
  overflow-x: auto;\
  z-index: 1;\
}\
.preview {\
  background-color: rgba(0,0,0,.2) !important;\
  background-position: 50% 20% !important;\
  background-size: cover !important;\
  border: 1px solid #666;\
  box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  cursor: move;\
  display: inline-block;\
  height: 90px; width: 90px;\
  margin: 5px; padding: 2px;\
  opacity: .5;\
  outline: none;\
  overflow: hidden;\
  position: relative;\
  text-shadow: 0 1px 1px #000;\
  -webkit-transition: .25s ease-in-out;\
  -moz-transition: .25s ease-in-out;\
  -o-transition: .25s ease-in-out;\
  transition: .25s ease-in-out;\
  vertical-align: top;\
}\
.preview:hover, .preview:focus {\
  opacity: .9;\
}\
.preview#selected {\
  opacity: 1;\
}\
.preview::before {\
  counter-increment: previews;\
  content: counter(previews);\
  color: #FFF;\
  font-weight: 700;\
  padding: 3px;\
  position: absolute;\
  top: 0;\
  right: 0;\
  text-shadow: 0 0 3px #000, 0 0 8px #000;\
}\
.preview.drag {\
  box-shadow: 0 0 10px rgba(0,0,0,.5);\
}\
.preview.over {\
  border-color: #FFF;\
}\
.preview > span {\
  color: #FFF;\
}\
.remove {\
  background: none;\
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
  box-sizing: border-box;\
  -moz-box-sizing: border-box;\
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
}\
.field:only-child {\
  display: block;\
  min-width: 100%;\
}\
.captcha {\
  background: #FFF;\
  outline: 1px solid #CCC;\
  outline-offset: -1px;\
  text-align: center;\
}\
.captcha > img {\
  display: block;\
  height: 57px;\
  width: 300px;\
}\
#qr [type=file] {\
  margin: 1px 0;\
  width: 70%;\
}\
#qr [type=submit] {\
  margin: 1px 0;\
  padding: 1px; /* not Gecko */\
  padding: 0 -moz-calc(1px); /* Gecko does not respect box-sizing: border-box */\
  width: 30%;\
}\
\
.fileText:hover .fntrunc,\
.fileText:not(:hover) .fnfull {\
  display: none;\
}\
.fitwidth img[data-md5] + img {\
  max-width: 100%;\
}\
\
/* revealed spoilers do not have height/width,\
   this fixes "expanded" auto-gifs */\
.op > div > a > img[data-md5] {\
  max-height: 252px;\
  max-width: 252px;\
}\
.reply > div > a > img[data-md5] {\
  max-height: 127px;\
  max-width: 127px;\
}\
\
#qr, #qp, #updater, #stats, #ihover, #overlay, #navlinks {\
  position: fixed;\
}\
\
#ihover {\
  max-height: 97%;\
  max-width: 75%;\
  padding-bottom: 18px;\
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
  width: 600px;\
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
#content {\
  height: 450px;\
  overflow: auto;\
}\
#content textarea {\
  box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  margin: 0;\
  min-height: 100px;\
  resize: vertical;\
  width: 100%;\
}\
#sauces {\
  height: 300px;\
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
.new {\
  background: lime;\
}\
\
#watcher {\
  padding-bottom: 5px;\
  position: absolute;\
  overflow: hidden;\
  white-space: nowrap;\
}\
#watcher:not(:hover) {\
  max-height: 220px;\
}\
#watcher > div {\
  max-width: 200px;\
  overflow: hidden;\
  padding-left: 5px;\
  padding-right: 5px;\
  text-overflow: ellipsis;\
}\
#watcher > .move {\
  padding-top: 5px;\
  text-decoration: underline;\
}\
\
#qp img {\
  max-height: 300px;\
  max-width: 500px;\
}\
.qphl {\
  outline: 2px solid rgba(216, 94, 49, .7);\
}\
.qphl.opContainer {\
  outline-offset: -2px;\
}\
div.opContainer {\
  display: block !important;\
}\
.inlined {\
  opacity: .5;\
}\
.inline {\
  overflow: hidden;\
  background-color: rgba(255, 255, 255, 0.15);\
  border: 1px solid rgba(128, 128, 128, 0.5);\
}\
.inline .post {\
  background: none;\
  border: none;\
}\
.filter_highlight.thread > .opContainer {\
  box-shadow: inset 5px 0 rgba(255,0,0,0.5);\
}\
.filter_highlight > .reply {\
  box-shadow: -5px 0 rgba(255,0,0,0.5);\
}\
.filtered {\
  text-decoration: underline line-through;\
}\
.quotelink.forwardlink,\
.backlink.forwardlink {\
  text-decoration: none;\
  border-bottom: 1px dashed;\
}\
\
.replyContainer > .replyContainer {\
  margin-left: 20px;\
  border-left: 1px solid black;\
}\
.stub ~ * {\
  display: none !important;\
}\
'
  };

  Main.init();

}).call(this);
