// ==UserScript==
// @name           4chan x
// @version        2.28.1
// @namespace      aeosynth
// @description    Adds various features.
// @copyright      2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright      2012 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license        MIT; http://en.wikipedia.org/wiki/Mit_license
// @include        http://boards.4chan.org/*
// @include        http://images.4chan.org/*
// @include        http://sys.4chan.org/*
// @include        http://www.4chan.org/*
// @run-at         document-start
// @updateURL      https://raw.github.com/MayhemYDG/4chan-x/stable/4chan_x.user.js
// @icon           http://mayhemydg.github.com/4chan-x/favicon.gif
// ==/UserScript==

/* LICENSE
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
 * http://mayhemydg.github.com/4chan-x/
 * 4chan X 2.28.1
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
  var $, $$, Anonymize, AutoGif, DAY, ExpandComment, ExpandThread, Favicon, FileInfo, Filter, GetTitle, HOUR, ImageExpand, ImageHover, Keybinds, MINUTE, Main, NAMESPACE, Nav, Options, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, Quotify, Redirect, ReplyHiding, ReportButton, RevealSpoilers, SECOND, Sauce, StrikethroughQuotes, ThreadHiding, ThreadStats, Threading, Time, TitlePost, Unread, Updater, VERSION, Watcher, conf, config, d, engine, flatten, g, log, qr, ui, _base;

  config = {
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
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks']
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
    sauces: ['http://iqdb.org/?url=$1', 'http://www.google.com/searchbyimage?image_url=$1', '#http://tineye.com/search?url=$1', '#http://saucenao.com/search.php?db=999&url=$1', '#http://3d.iqdb.org/?url=$1', '#http://regex.info/exif.cgi?imgurl=$2', '# uploaders:', '#http://imgur.com/upload?url=$2', '#http://omploader.org/upload?url1=$2', '# "View Same" in archives:', '#http://archive.foolz.us/$4/image/$3/', '#http://archive.installgentoo.net/$4/image/$3'].join('\n'),
    time: '%m/%d/%y(%a)%H:%M',
    backlink: '>>%id',
    fileInfoR: '%l (%s, %r)',
    fileInfoT: '%l (%s, %r)',
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

  log = typeof (_base = console.log).bind === "function" ? _base.bind(console) : void 0;

  conf = {};

  (flatten = function(parent, obj) {
    var key, val;
    if (obj instanceof Array) {
      conf[parent] = obj[0];
    } else if (typeof obj === 'object') {
      for (key in obj) {
        val = obj[key];
        flatten(key, val);
      }
    } else {
      conf[parent] = obj;
    }
  })(null, config);

  NAMESPACE = '4chan_x.';

  VERSION = '2.28.1';

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
      el.querySelector('.move').addEventListener('mousedown', ui.dragstart, false);
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
      style.top = clientHeight <= height || top <= 0 ? 0 : top + height >= clientHeight ? clientHeight - height : top;
      if (clientX <= clientWidth - 400) {
        style.left = clientX + 45;
        return style.right = null;
      } else {
        style.left = null;
        return style.right = clientWidth - clientX + 45;
      }
    },
    hoverend: function() {
      $.rm(ui.el);
      return delete ui.el;
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
  };

  $.extend($, {
    ready: function(fc) {
      var cb;
      if (/interactive|complete/.test(d.readyState)) return setTimeout(fc);
      cb = function() {
        $.off(d, 'DOMContentLoaded', cb);
        return fc();
      };
      return $.on(d, 'DOMContentLoaded', cb);
    },
    sync: function(key, cb) {
      return $.on(window, 'storage', function(e) {
        if (e.key === ("" + NAMESPACE + key)) return cb(JSON.parse(e.newValue));
      });
    },
    id: function(id) {
      return d.getElementById(id);
    },
    ajax: function(url, callbacks, opts) {
      var form, headers, key, r, type, upCallbacks, val;
      if (opts == null) opts = {};
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
        return conf[this.name] = this.checked;
      },
      value: function() {
        $.set(this.name, this.value.trim());
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
      if (nodes instanceof Node) return nodes;
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
      if (properties) $.extend(el, properties);
      return el;
    },
    on: function(el, eventType, handler) {
      return el.addEventListener(eventType, handler, false);
    },
    off: function(el, eventType, handler) {
      return el.removeEventListener(eventType, handler, false);
    },
    open: function(url) {
      return (GM_openInTab || window.open)(url, '_blank');
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

  $$ = function(selector, root) {
    if (root == null) root = d.body;
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  };

  Filter = {
    filters: {},
    init: function() {
      var boards, filter, hl, key, op, regexp, top, _i, _len, _ref, _ref2, _ref3, _ref4, _ref5;
      for (key in config.filter) {
        this.filters[key] = [];
        _ref = conf[key].split('\n');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          if (filter[0] === '#') continue;
          if (!(regexp = filter.match(/\/(.+)\/(\w*)/))) continue;
          filter = filter.replace(regexp[0], '');
          boards = ((_ref2 = filter.match(/boards:([^;]+)/)) != null ? _ref2[1].toLowerCase() : void 0) || 'global';
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
          op = ((_ref3 = filter.match(/[^t]op:(yes|no|only)/)) != null ? _ref3[1].toLowerCase() : void 0) || 'no';
          if (hl = /highlight/.test(filter)) {
            hl = ((_ref4 = filter.match(/highlight:(\w+)/)) != null ? _ref4[1].toLowerCase() : void 0) || 'filter_highlight';
            top = ((_ref5 = filter.match(/top:(yes|no)/)) != null ? _ref5[1].toLowerCase() : void 0) || 'yes';
            top = top === 'yes';
          }
          this.filters[key].push(this.createFilter(regexp, op, hl, top));
        }
        if (!this.filters[key].length) delete this.filters[key];
      }
      if (Object.keys(this.filters).length) return g.callbacks.push(this.node);
    },
    createFilter: function(regexp, op, hl, top) {
      var test;
      test = typeof regexp === 'string' ? function(value) {
        return regexp === value;
      } : function(value) {
        return regexp.test(value);
      };
      return function(value, isOP) {
        if (isOP && op === 'no' || !isOP && op === 'only') return false;
        if (!test(value)) return false;
        if (hl) return [hl, top];
        return true;
      };
    },
    node: function(post) {
      var el, filter, firstThread, isOP, key, result, thisThread, value, _i, _len, _ref;
      if (post.isInlined) return;
      isOP = post.isOP, el = post.el;
      for (key in Filter.filters) {
        value = Filter[key](post);
        if (value === false) continue;
        _ref = Filter.filters[key];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          if (!(result = filter(value, isOP))) continue;
          if (result === true) {
            if (isOP) {
              if (!g.REPLY) {
                ThreadHiding.hide(post.el.parentNode);
              } else {
                continue;
              }
            } else {
              ReplyHiding.hide(post.root);
            }
            return;
          }
          if (isOP) {
            $.addClass(el, result[0]);
          } else {
            $.addClass(el.parentNode, result[0]);
          }
          if (isOP && result[1] && !g.REPLY) {
            thisThread = el.parentNode;
            if (firstThread = $('div[class=op]')) {
              $.before(firstThread.parentNode, [thisThread, thisThread.nextElementSibling]);
            }
          }
        }
      }
    },
    name: function(post) {
      var name;
      name = post.isOP ? $('.postername', post.el) : $('.commentpostername', post.el);
      return name.textContent;
    },
    uniqueid: function(post) {
      var uid;
      if (uid = $('.posteruid', post.el)) return uid.textContent;
      return false;
    },
    tripcode: function(post) {
      var trip;
      if (trip = $('.postertrip', post.el)) return trip.textContent;
      return false;
    },
    mod: function(post) {
      var mod;
      if (mod = (post.isOP ? $('.commentpostername', post.el) : $('.commentpostername ~ .commentpostername', post.el))) {
        return mod.textContent;
      }
      return false;
    },
    email: function(post) {
      var mail;
      if (mail = $('.linkmail', post.el)) return mail.href;
      return false;
    },
    subject: function(post) {
      var sub;
      sub = post.isOP ? $('.filetitle', post.el) : $('.replytitle', post.el);
      return sub.textContent;
    },
    comment: function(post) {
      var data, i, nodes, text, _ref;
      text = [];
      nodes = d.evaluate('.//br|.//text()', post.el.lastChild, null, 7, null);
      for (i = 0, _ref = nodes.snapshotLength; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        text.push((data = nodes.snapshotItem(i).data) ? data : '\n');
      }
      return text.join('');
    },
    filename: function(post) {
      var file, filesize;
      filesize = post.filesize;
      if (filesize && (file = $('span', filesize))) return file.title;
      return false;
    },
    dimensions: function(post) {
      var filesize, match;
      filesize = post.filesize;
      if (filesize && (match = filesize.textContent.match(/\d+x\d+/))) {
        return match[0];
      }
      return false;
    },
    filesize: function(post) {
      var img;
      img = post.img;
      if (img) return img.alt;
      return false;
    },
    md5: function(post) {
      var img;
      img = post.img;
      if (img) return img.getAttribute('md5');
      return false;
    }
  };

  StrikethroughQuotes = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var el, quote, _i, _len, _ref;
      if (post.isInlined) return;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if ((el = $.id(quote.hash.slice(1))) && el.parentNode.parentNode.parentNode.hidden) {
          $.addClass(quote, 'filtered');
          if (conf['Recursive Filtering']) ReplyHiding.hide(post.root);
        }
      }
    }
  };

  ExpandComment = {
    init: function() {
      var a, _i, _len, _ref;
      _ref = $$('.abbr > a');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        $.on(a, 'click', ExpandComment.expand);
      }
    },
    expand: function(e) {
      var a, replyID, threadID, _, _ref;
      e.preventDefault();
      _ref = this.href.match(/(\d+)#(\d+)/), _ = _ref[0], threadID = _ref[1], replyID = _ref[2];
      this.textContent = "Loading " + replyID + "...";
      threadID = this.pathname.split('/').pop() || $.x('ancestor::div[@class="thread"]/div', this).id;
      a = this;
      return $.cache(this.pathname, (function() {
        return ExpandComment.parse(this, a, threadID, replyID);
      }));
    },
    parse: function(req, a, threadID, replyID) {
      var doc, node, post, quote, quotes, _i, _len;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      doc = d.implementation.createHTMLDocument(null);
      doc.documentElement.innerHTML = req.responseText;
      Threading.op($('body > form', doc).firstChild);
      node = d.importNode(doc.getElementById(replyID));
      quotes = node.getElementsByClassName('quotelink');
      for (_i = 0, _len = quotes.length; _i < _len; _i++) {
        quote = quotes[_i];
        if (quote.hash === quote.getAttribute('href')) {
          quote.pathname = "/" + g.BOARD + "/res/" + threadID;
        }
      }
      post = {
        el: node,
        threadId: threadID,
        quotes: quotes,
        backlinks: []
      };
      if (conf['Resurrect Quotes']) Quotify.node(post);
      if (conf['Quote Preview']) QuotePreview.node(post);
      if (conf['Quote Inline']) QuoteInline.node(post);
      if (conf['Indicate OP quote']) QuoteOP.node(post);
      if (conf['Indicate Cross-thread Quotes']) QuoteCT.node(post);
      return $.replace(a.parentNode.parentNode, node.lastChild);
    }
  };

  ExpandThread = {
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
        $.on(a, 'click', ExpandThread.cb.toggle);
        _results.push($.replace(span, a));
      }
      return _results;
    },
    cb: {
      toggle: function() {
        var thread;
        thread = this.parentNode;
        return ExpandThread.toggle(thread);
      }
    },
    toggle: function(thread) {
      var a, backlink, num, pathname, prev, table, threadID, _i, _len, _ref, _ref2, _results;
      threadID = thread.firstChild.id;
      pathname = "/" + g.BOARD + "/res/" + threadID;
      a = $('.omittedposts', thread);
      switch (a.textContent[0]) {
        case '+':
          if ((_ref = $('.op .container', thread)) != null) _ref.textContent = '';
          a.textContent = a.textContent.replace('+', '\u00d7 Loading...');
          return $.cache(pathname, (function() {
            return ExpandThread.parse(this, pathname, thread, a);
          }));
        case '\u00d7':
          a.textContent = a.textContent.replace('\u00d7 Loading...', '+');
          return $.cache.requests[pathname].abort();
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
          table = $.x("following::br[@clear]/preceding::table[" + num + "]", a);
          while ((prev = table.previousSibling) && (prev.nodeName !== 'A')) {
            $.rm(prev);
          }
          _ref2 = $$('.backlink', $('.op', thread));
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
      var doc, href, link, next, nodes, quote, reply, table, _i, _j, _len, _len2, _ref, _ref2;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        $.off(a, 'click', ExpandThread.cb.toggle);
        return;
      }
      a.textContent = a.textContent.replace('\u00d7 Loading...', '-');
      doc = d.implementation.createHTMLDocument(null);
      doc.documentElement.innerHTML = req.responseText;
      nodes = [];
      _ref = $$('.reply', doc);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reply = _ref[_i];
        table = d.importNode(reply.parentNode.parentNode.parentNode);
        _ref2 = $$('.quotelink', table);
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          quote = _ref2[_j];
          if ((href = quote.getAttribute('href')) === quote.hash) {
            quote.pathname = pathname;
          } else if (href !== quote.href) {
            quote.href = "res/" + href;
          }
        }
        link = $('.quotejs', table);
        link.href = "res/" + thread.firstChild.id + "#" + reply.id;
        link.nextSibling.href = "res/" + thread.firstChild.id + "#q" + reply.id;
        nodes.push(table);
      }
      while ((next = a.nextSibling) && !next.clear) {
        $.rm(next);
      }
      return $.before(next, nodes);
    }
  };

  ReplyHiding = {
    init: function() {
      this.td = $.el('td', {
        noWrap: true,
        className: 'replyhider',
        innerHTML: '<a href="javascript:;">[ - ]</a>'
      });
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var td;
      if (post["class"]) return;
      td = ReplyHiding.td.cloneNode(true);
      $.on(td.firstChild, 'click', ReplyHiding.toggle);
      $.replace(post.el.previousSibling, td);
      if (post.id in g.hiddenReplies) return ReplyHiding.hide(post.root);
    },
    toggle: function() {
      var id, parent, quote, table, _i, _j, _len, _len2, _ref, _ref2;
      parent = this.parentNode;
      if (parent.className === 'replyhider') {
        ReplyHiding.hide(parent.parentNode.parentNode.parentNode);
        id = parent.nextSibling.id;
        _ref = $$(".quotelink[href='#" + id + "'], .backlink[href='#" + id + "']");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          quote = _ref[_i];
          $.addClass(quote, 'filtered');
        }
        g.hiddenReplies[id] = Date.now();
      } else {
        table = parent.nextSibling;
        table.hidden = false;
        $.rm(parent);
        id = table.firstChild.firstChild.lastChild.id;
        _ref2 = $$(".quotelink[href='#" + id + "'], .backlink[href='#" + id + "']");
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          quote = _ref2[_j];
          $.removeClass(quote, 'filtered');
        }
        delete g.hiddenReplies[id];
      }
      return $.set("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
    },
    hide: function(table) {
      var div, name, trip, uid, _ref, _ref2;
      if (table.hidden) return;
      table.hidden = true;
      if (!conf['Show Stubs']) return;
      name = $('.commentpostername', table).textContent;
      uid = ((_ref = $('.posteruid', table)) != null ? _ref.textContent : void 0) || '';
      trip = ((_ref2 = $('.postertrip', table)) != null ? _ref2.textContent : void 0) || '';
      div = $.el('div', {
        className: 'stub',
        innerHTML: "<a href=javascript:;><span>[ + ]</span> " + name + " " + uid + " " + trip + "</a>"
      });
      $.on(div.firstChild, 'click', ReplyHiding.toggle);
      return $.before(table, div);
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
      var key, o, range, selEnd, selStart, ta, thread, value, _ref, _ref2;
      if (!(key = Keybinds.keyCode(e)) || /TEXTAREA|INPUT/.test(e.target.nodeName) && !(e.altKey || e.ctrlKey || e.keyCode === 27)) {
        return;
      }
      thread = Nav.getThread();
      switch (key) {
        case conf.openQR:
          Keybinds.qr(thread, true);
          break;
        case conf.openEmptyQR:
          Keybinds.qr(thread);
          break;
        case conf.openOptions:
          if (!$.id('overlay')) Options.dialog();
          break;
        case conf.close:
          if (o = $.id('overlay')) {
            Options.close.call(o);
          } else if (qr.el) {
            qr.close();
          }
          break;
        case conf.submit:
          if (qr.el && !qr.status()) qr.submit();
          break;
        case conf.spoiler:
          ta = e.target;
          if (ta.nodeName !== 'TEXTAREA') return;
          value = ta.value;
          selStart = ta.selectionStart;
          selEnd = ta.selectionEnd;
          ta.value = value.slice(0, selStart) + '[spoiler]' + value.slice(selStart, selEnd) + '[/spoiler]' + value.slice(selEnd);
          range = 9 + selEnd;
          ta.setSelectionRange(range, range);
          break;
        case conf.watch:
          Watcher.toggle(thread);
          break;
        case conf.update:
          Updater.update();
          break;
        case conf.unreadCountTo0:
          Unread.replies = [];
          Unread.update();
          break;
        case conf.expandImage:
          Keybinds.img(thread);
          break;
        case conf.expandAllImages:
          Keybinds.img(thread, true);
          break;
        case conf.zero:
          window.location = "/" + g.BOARD + "/0#0";
          break;
        case conf.nextPage:
          if ((_ref = $('input[value=Next]')) != null) _ref.click();
          break;
        case conf.previousPage:
          if ((_ref2 = $('input[value=Previous]')) != null) _ref2.click();
          break;
        case conf.nextThread:
          if (g.REPLY) return;
          Nav.scroll(+1);
          break;
        case conf.previousThread:
          if (g.REPLY) return;
          Nav.scroll(-1);
          break;
        case conf.expandThread:
          ExpandThread.toggle(thread);
          break;
        case conf.openThread:
          Keybinds.open(thread);
          break;
        case conf.openThreadTab:
          Keybinds.open(thread, true);
          break;
        case conf.nextReply:
          Keybinds.hl(+1, thread);
          break;
        case conf.previousReply:
          Keybinds.hl(-1, thread);
          break;
        case conf.hide:
          if (/\bthread\b/.test(thread.className)) ThreadHiding.toggle(thread);
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
        if (e.altKey) key = 'alt+' + key;
        if (e.ctrlKey) key = 'ctrl+' + key;
      }
      return key;
    },
    img: function(thread, all) {
      var thumb;
      if (all) {
        return $.id('imageExpand').click();
      } else {
        thumb = $('img[md5]', $('.replyhl', thread) || thread);
        return ImageExpand.toggle(thumb.parentNode);
      }
    },
    qr: function(thread, quote) {
      if (quote) {
        qr.quote.call($('.quotejs + .quotejs', $('.replyhl', thread) || thread));
      } else {
        qr.open();
      }
      return $('textarea', qr.el).focus();
    },
    open: function(thread, tab) {
      var id, url;
      id = thread.firstChild.id;
      url = "http://boards.4chan.org/" + g.BOARD + "/res/" + id;
      if (tab) {
        return $.open(url);
      } else {
        return location.href = url;
      }
    },
    hl: function(delta, thread) {
      var next, rect, replies, reply, td, _i, _len;
      if (td = $('.replyhl', thread)) {
        td.className = 'reply';
        td.removeAttribute('tabindex');
        rect = td.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top <= d.body.clientHeight) {
          next = delta === +1 ? $.x('following::td[@class="reply"]', td) : $.x('preceding::td[@class="reply"]', td);
          if (!next) {
            td.className = 'replyhl';
            td.tabIndex = 0;
            td.focus();
            return;
          }
          if (!(g.REPLY || $.x('ancestor::div[@class="thread"]', next) === thread)) {
            return;
          }
          rect = next.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > d.body.clientHeight) {
            next.scrollIntoView(delta === -1);
          }
          next.className = 'replyhl';
          next.tabIndex = 0;
          next.focus();
          return;
        }
      }
      replies = $$('.reply', thread);
      if (delta === -1) replies.reverse();
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        rect = reply.getBoundingClientRect();
        if (delta === +1 && rect.top >= 0 || delta === -1 && rect.bottom <= d.body.clientHeight) {
          reply.className = 'replyhl';
          reply.tabIndex = 0;
          reply.focus();
          return;
        }
      }
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
      var bottom, i, rect, thread, _len, _ref;
      Nav.threads = $$('.thread:not([hidden])');
      _ref = Nav.threads;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        thread = _ref[i];
        rect = thread.getBoundingClientRect();
        bottom = rect.bottom;
        if (bottom > 0) {
          if (full) return [thread, i, rect];
          return thread;
        }
      }
      return $('form[name=delform]');
    },
    scroll: function(delta) {
      var i, rect, thread, top, _ref, _ref2;
      _ref = Nav.getThread(true), thread = _ref[0], i = _ref[1], rect = _ref[2];
      top = rect.top;
      if (!((delta === -1 && Math.ceil(top) < 0) || (delta === +1 && top > 1))) {
        i += delta;
      }
      top = (_ref2 = Nav.threads[i]) != null ? _ref2.getBoundingClientRect().top : void 0;
      return window.scrollBy(0, top);
    }
  };

  qr = {
    init: function() {
      if (!$.id('recaptcha_challenge_field_holder')) return;
      g.callbacks.push(this.node);
      return setTimeout(this.asyncInit);
    },
    asyncInit: function() {
      var form, iframe, link, loadChecking, script;
      if (conf['Hide Original Post Form']) {
        link = $.el('h1', {
          innerHTML: "<a href=javascript:;>" + (g.REPLY ? 'Quick Reply' : 'New Thread') + "</a>"
        });
        $.on($('a', link), 'click', function() {
          qr.open();
          if (!g.REPLY) $('select', qr.el).value = 'new';
          return $('textarea', qr.el).focus();
        });
        form = d.forms[0];
        $.before(form, link);
      }
      if (/chrome/i.test(navigator.userAgent)) {
        qr.status({
          ready: true
        });
      } else {
        iframe = $.el('iframe', {
          id: 'iframe',
          src: 'http://sys.4chan.org/robots.txt'
        });
        $.on(iframe, 'error', function() {
          return this.src = this.src;
        });
        loadChecking = function(iframe) {
          if (!qr.status.ready) {
            iframe.src = 'about:blank';
            return setTimeout((function() {
              return iframe.src = 'http://sys.4chan.org/robots.txt';
            }), 100);
          }
        };
        $.on(iframe, 'load', function() {
          if (this.src !== 'about:blank') {
            return setTimeout(loadChecking, 500, this);
          }
        });
        $.add(d.head, iframe);
      }
      script = $.el('script', {
        textContent: 'Recaptcha.focus_response_field=function(){}'
      });
      $.add(d.head, script);
      $.rm(script);
      if (conf['Persistent QR']) {
        qr.dialog();
        if (conf['Auto Hide QR']) qr.hide();
      }
      $.on(d, 'dragover', qr.dragOver);
      $.on(d, 'drop', qr.dropFile);
      $.on(d, 'dragstart', qr.drag);
      return $.on(d, 'dragend', qr.drag);
    },
    node: function(post) {
      return $.on($('.quotejs + .quotejs', post.el), 'click', qr.quote);
    },
    open: function() {
      if (qr.el) {
        qr.el.hidden = false;
        return qr.unhide();
      } else {
        return qr.dialog();
      }
    },
    close: function() {
      var i, spoiler, _i, _len, _ref;
      qr.el.hidden = true;
      qr.message.send({
        req: 'abort'
      });
      d.activeElement.blur();
      $.removeClass(qr.el, 'dump');
      _ref = qr.replies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        qr.replies[0].rm();
      }
      qr.cooldown.auto = false;
      qr.status();
      qr.resetFileInput();
      if (!conf['Remember Spoiler'] && (spoiler = $.id('spoiler')).checked) {
        spoiler.click();
      }
      return qr.cleanError();
    },
    hide: function() {
      d.activeElement.blur();
      $.addClass(qr.el, 'autohide');
      return $.id('autohide').checked = true;
    },
    unhide: function() {
      $.removeClass(qr.el, 'autohide');
      return $.id('autohide').checked = false;
    },
    toggleHide: function() {
      return this.checked && qr.hide() || qr.unhide();
    },
    error: function(err, node) {
      var el;
      el = $('.warning', qr.el);
      el.textContent = err;
      if (node) $.replace(el.firstChild, node);
      qr.open();
      if (/captcha|verification/i.test(err)) $('[autocomplete]', qr.el).focus();
      if (d.hidden || d.oHidden || d.mozHidden || d.webkitHidden) {
        return alert(err);
      }
    },
    cleanError: function() {
      return $('.warning', qr.el).textContent = null;
    },
    status: function(data) {
      var disabled, input, value;
      if (data == null) data = {};
      if (data.ready) {
        qr.status.ready = true;
        qr.status.banned = data.banned;
      } else if (!qr.status.ready) {
        value = 'Loading';
        disabled = true;
      }
      if (g.dead) {
        value = 404;
        disabled = true;
        qr.cooldown.auto = false;
      } else if (qr.status.banned) {
        value = 'Banned';
        disabled = true;
      } else {
        value = qr.cooldown.seconds || data.progress || value;
      }
      if (!qr.el) return;
      input = qr.status.input;
      input.value = qr.cooldown.auto && conf['Cooldown'] ? value ? "Auto " + value : 'Auto' : value || 'Submit';
      return input.disabled = disabled || false;
    },
    cooldown: {
      init: function() {
        if (!conf['Cooldown']) return;
        qr.cooldown.start($.get("/" + g.BOARD + "/cooldown", 0));
        return $.sync("/" + g.BOARD + "/cooldown", qr.cooldown.start);
      },
      start: function(timeout) {
        var seconds;
        seconds = Math.floor((timeout - Date.now()) / 1000);
        return qr.cooldown.count(seconds);
      },
      set: function(seconds) {
        if (!conf['Cooldown']) return;
        qr.cooldown.count(seconds);
        return $.set("/" + g.BOARD + "/cooldown", Date.now() + seconds * SECOND);
      },
      count: function(seconds) {
        if (!((0 <= seconds && seconds <= 60))) return;
        setTimeout(qr.cooldown.count, 1000, seconds - 1);
        qr.cooldown.seconds = seconds;
        if (seconds === 0) {
          $["delete"]("/" + g.BOARD + "/cooldown");
          if (qr.cooldown.auto) qr.submit();
        }
        return qr.status();
      }
    },
    quote: function(e) {
      var caretPos, id, range, s, sel, ta, text, _ref;
      if (e != null) e.preventDefault();
      qr.open();
      if (!g.REPLY) {
        $('select', qr.el).value = $.x('ancestor::div[@class="thread"]', this).firstChild.id;
      }
      id = this.previousElementSibling.hash.slice(1);
      text = ">>" + id + "\n";
      sel = window.getSelection();
      if ((s = sel.toString()) && id === ((_ref = $.x('ancestor-or-self::blockquote/preceding-sibling::input', sel.anchorNode)) != null ? _ref.name : void 0)) {
        s = s.replace(/\n/g, '\n>');
        text += ">" + s + "\n";
      }
      ta = $('textarea', qr.el);
      caretPos = ta.selectionStart;
      qr.selected.el.lastChild.textContent = qr.selected.com = ta.value = ta.value.slice(0, caretPos) + text + ta.value.slice(ta.selectionEnd);
      ta.focus();
      ta.selectionEnd = ta.selectionStart = caretPos + text.length;
      range = caretPos + text.length;
      return ta.setSelectionRange(range, range);
    },
    drag: function(e) {
      var i;
      i = e.type === 'dragstart' ? 'off' : 'on';
      $[i](d, 'dragover', qr.dragOver);
      return $[i](d, 'drop', qr.dropFile);
    },
    dragOver: function(e) {
      e.preventDefault();
      return e.dataTransfer.dropEffect = 'copy';
    },
    dropFile: function(e) {
      if (!e.dataTransfer.files.length) return;
      e.preventDefault();
      qr.open();
      qr.fileInput.call(e.dataTransfer);
      return $.addClass(qr.el, 'dump');
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
          new qr.reply().setFile(file);
        }
      }
      $.addClass(qr.el, 'dump');
      return qr.resetFileInput();
    },
    resetFileInput: function() {
      return $('[type=file]', qr.el).value = null;
    },
    replies: [],
    reply: (function() {

      function _Class() {
        var persona, prev,
          _this = this;
        prev = qr.replies[qr.replies.length - 1];
        persona = $.get('qr.persona', {});
        this.name = prev ? prev.name : persona.name || null;
        this.email = prev && !/^sage$/.test(prev.email) ? prev.email : persona.email || null;
        this.sub = prev && conf['Remember Subject'] ? prev.sub : conf['Remember Subject'] ? persona.sub : null;
        this.spoiler = prev && conf['Remember Spoiler'] ? prev.spoiler : false;
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
        $.before($('#addReply', qr.el), this.el);
        $.on(this.el, 'dragstart', this.dragStart);
        $.on(this.el, 'dragenter', this.dragEnter);
        $.on(this.el, 'dragleave', this.dragLeave);
        $.on(this.el, 'dragover', this.dragOver);
        $.on(this.el, 'dragend', this.dragEnd);
        $.on(this.el, 'drop', this.drop);
        qr.replies.push(this);
      }

      _Class.prototype.setFile = function(file) {
        var fileUrl, img, url,
          _this = this;
        this.file = file;
        this.el.title = file.name;
        if (qr.spoiler) $('label', this.el).hidden = false;
        if (file.type === 'application/pdf') {
          this.el.style.backgroundImage = null;
          return;
        }
        url = window.URL || window.webkitURL;
        url.revokeObjectURL(this.url);
        fileUrl = url.createObjectURL(file);
        img = $.el('img');
        $.on(img, 'load', function() {
          var bb, c, data, i, l, s, ui8a;
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
          for (i = 0; 0 <= l ? i < l : i > l; 0 <= l ? i++ : i--) {
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
        qr.resetFileInput();
        delete this.file;
        this.el.title = null;
        this.el.style.backgroundImage = null;
        if (qr.spoiler) $('label', this.el).hidden = true;
        return (window.URL || window.webkitURL).revokeObjectURL(this.url);
      };

      _Class.prototype.select = function() {
        var data, rectEl, rectList, _i, _len, _ref, _ref2;
        if ((_ref = qr.selected) != null) _ref.el.id = null;
        qr.selected = this;
        this.el.id = 'selected';
        rectEl = this.el.getBoundingClientRect();
        rectList = this.el.parentNode.getBoundingClientRect();
        this.el.parentNode.scrollLeft += rectEl.left + rectEl.width / 2 - rectList.left - rectList.width / 2;
        _ref2 = ['name', 'email', 'sub', 'com'];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          data = _ref2[_i];
          $("[name=" + data + "]", qr.el).value = this[data];
        }
        return $('#spoiler', qr.el).checked = this.spoiler;
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
        reply = qr.replies.splice(oldIndex, 1)[0];
        return qr.replies.splice(newIndex, 0, reply);
      };

      _Class.prototype.dragEnd = function() {
        var el;
        $.removeClass(this, 'drag');
        if (el = $('.over', this.parentNode)) return $.removeClass(el, 'over');
      };

      _Class.prototype.rm = function() {
        var index;
        qr.resetFileInput();
        $.rm(this.el);
        index = qr.replies.indexOf(this);
        if (qr.replies.length === 1) {
          new qr.reply().select();
        } else if (this.el.id === 'selected') {
          (qr.replies[index - 1] || qr.replies[index + 1]).select();
        }
        qr.replies.splice(index, 1);
        (window.URL || window.webkitURL).revokeObjectURL(this.url);
        return delete this;
      };

      return _Class;

    })(),
    captcha: {
      init: function() {
        var _this = this;
        this.img = $('.captcha > img', qr.el);
        this.input = $('[autocomplete]', qr.el);
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
        this.timeout = Date.now() + 26 * MINUTE;
        challenge = this.challenge.firstChild.value;
        this.img.alt = challenge;
        this.img.src = "http://www.google.com/recaptcha/api/image?c=" + challenge;
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
        if (focus) return qr.captcha.input.focus();
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
      var e, event, fileInput, input, mimeTypes, name, spoiler, ta, thread, threads, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
      qr.el = ui.dialog('qr', 'top:0;right:0;', '\
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
      if (conf['Remember QR size'] && engine === 'gecko') {
        $.on(ta = $('textarea', qr.el), 'mouseup', function() {
          return $.set('qr.size', this.style.cssText);
        });
        ta.style.cssText = $.get('qr.size', '');
      }
      mimeTypes = $('.rules').firstChild.textContent.match(/: (.+) /)[1].toLowerCase().replace(/\w+/g, function(type) {
        switch (type) {
          case 'jpg':
            return 'image/jpeg';
          case 'pdf':
            return 'application/pdf';
          default:
            return "image/" + type;
        }
      });
      qr.mimeTypes = mimeTypes.split(', ');
      qr.mimeTypes.push('');
      fileInput = $('[type=file]', qr.el);
      fileInput.max = $('[name=MAX_FILE_SIZE]').value;
      fileInput.accept = mimeTypes;
      qr.spoiler = !!$('#com_submit + label');
      spoiler = $('#spoilerLabel', qr.el);
      spoiler.hidden = !qr.spoiler;
      if (!g.REPLY) {
        threads = '<option value=new>New thread</option>';
        _ref = $$('.op');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thread = _ref[_i];
          threads += "<option value=" + thread.id + ">Thread " + thread.id + "</option>";
        }
        $.prepend($('.move > span', qr.el), $.el('select', {
          innerHTML: threads,
          title: 'Create a new thread / Reply to a thread'
        }));
        $.on($('select', qr.el), 'mousedown', function(e) {
          return e.stopPropagation();
        });
      }
      $.on($('#autohide', qr.el), 'change', qr.toggleHide);
      $.on($('.close', qr.el), 'click', qr.close);
      $.on($('#dump', qr.el), 'click', function() {
        return qr.el.classList.toggle('dump');
      });
      $.on($('#addReply', qr.el), 'click', function() {
        return new qr.reply().select();
      });
      $.on($('form', qr.el), 'submit', qr.submit);
      $.on($('textarea', qr.el), 'keyup', function() {
        return qr.selected.el.lastChild.textContent = this.value;
      });
      $.on(fileInput, 'change', qr.fileInput);
      $.on(fileInput, 'click', function(e) {
        if (e.shiftKey) return qr.selected.rmFile() || e.preventDefault();
      });
      $.on(spoiler.firstChild, 'change', function() {
        return $('input', qr.selected.el).click();
      });
      $.on($('.warning', qr.el), 'click', qr.cleanError);
      new qr.reply().select();
      _ref2 = ['name', 'email', 'sub', 'com'];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        name = _ref2[_j];
        input = $("[name=" + name + "]", qr.el);
        _ref3 = ['input', 'keyup', 'change', 'paste'];
        for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
          event = _ref3[_k];
          $.on(input, event, function() {
            qr.selected[this.name] = this.value;
            if (qr.cooldown.auto && qr.selected === qr.replies[0] && parseInt(qr.status.input.value.match(/\d+/)) < 6) {
              return qr.cooldown.auto = false;
            }
          });
        }
      }
      $.sync('qr.persona', function(persona) {
        var key, val, _results;
        if (!qr.el.hidden) return;
        _results = [];
        for (key in persona) {
          val = persona[key];
          qr.selected[key] = val;
          _results.push($("[name=" + key + "]", qr.el).value = val);
        }
        return _results;
      });
      qr.status.input = $('[type=submit]', qr.el);
      qr.status();
      qr.cooldown.init();
      qr.captcha.init();
      $.add(d.body, qr.el);
      e = d.createEvent('CustomEvent');
      e.initEvent('QRDialogCreation', true, false);
      return qr.el.dispatchEvent(e);
    },
    submit: function(e) {
      var captcha, captchas, challenge, err, file, m, post, reader, reply, response, threadID;
      if (e != null) e.preventDefault();
      if (qr.cooldown.seconds) {
        qr.cooldown.auto = !qr.cooldown.auto;
        qr.status();
        return;
      }
      qr.message.send({
        req: 'abort'
      });
      reply = qr.replies[0];
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
          challenge = qr.captcha.img.alt;
          if (response = qr.captcha.input.value) qr.captcha.reload();
        }
        $.set('captchas', captchas);
        qr.captcha.count(captchas.length);
        if (!response) err = 'No valid captcha.';
      }
      if (err) {
        qr.cooldown.auto = false;
        qr.status();
        qr.error(err);
        return;
      }
      qr.cleanError();
      threadID = g.THREAD_ID || $('select', qr.el).value;
      qr.cooldown.auto = qr.replies.length > 1;
      if (conf['Auto Hide QR'] && !qr.cooldown.auto) qr.hide();
      if (conf['Thread Watcher'] && conf['Auto Watch Reply'] && threadID !== 'new') {
        Watcher.watch(threadID);
      }
      post = {
        board: g.BOARD,
        resto: threadID,
        name: reply.name,
        email: reply.email,
        sub: reply.sub,
        com: reply.com,
        upfile: reply.file,
        spoiler: reply.spoiler,
        mode: 'regist',
        pwd: (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $('[name=pwd]').value,
        recaptcha_challenge_field: challenge,
        recaptcha_response_field: response + ' '
      };
      qr.status({
        progress: '...'
      });
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
      if (/chrome/i.test(navigator.userAgent)) {
        qr.message.post(post);
        return;
      }
      return qr.message.send(post);
    },
    response: function(html) {
      var b, doc, err, node, persona, postNumber, reply, thread, _, _ref;
      doc = $.el('a', {
        innerHTML: html
      });
      if ($('title', doc).textContent === '4chan - Banned') {
        qr.status({
          ready: true,
          banned: true
        });
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
          qr.cooldown.auto = !!$.get('captchas', []).length;
          qr.cooldown.set(2);
        } else {
          qr.cooldown.auto = false;
        }
        qr.status();
        qr.error(err, node);
        return;
      }
      reply = qr.replies[0];
      persona = $.get('qr.persona', {});
      persona = {
        name: reply.name,
        email: /^sage$/.test(reply.email) ? persona.email : reply.email,
        sub: conf['Remember Subject'] ? reply.sub : null
      };
      $.set('qr.persona', persona);
      _ref = b.lastChild.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref[0], thread = _ref[1], postNumber = _ref[2];
      if (thread === '0') {
        if (conf['Thread Watcher'] && conf['Auto Watch']) {
          $.set('autoWatch', postNumber);
        }
        location.pathname = "/" + g.BOARD + "/res/" + postNumber;
      } else {
        qr.cooldown.auto = qr.replies.length > 1;
        qr.cooldown.set(/sage/i.test(reply.email) ? 60 : 30);
        if (conf['Open Reply in New Tab'] && !g.REPLY && !qr.cooldown.auto) {
          $.open("http://boards.4chan.org/" + g.BOARD + "/res/" + thread + "#" + postNumber);
        }
      }
      if (conf['Persistent QR'] || qr.cooldown.auto) {
        reply.rm();
      } else {
        qr.close();
      }
      if (g.REPLY && (conf['Unread Count'] || conf['Unread Favicon'])) {
        Unread.foresee.push(postNumber);
      }
      if (g.REPLY && conf['Thread Updater'] && conf['Auto Update This']) {
        Updater.update();
      }
      qr.status();
      return qr.resetFileInput();
    },
    message: {
      send: function(data) {
        var host, window;
        if (/chrome/i.test(navigator.userAgent)) {
          qr.message.receive(data);
          return;
        }
        data.qr = true;
        host = location.hostname;
        window = host === 'boards.4chan.org' ? $.id('iframe').contentWindow : parent;
        return window.postMessage(data, '*');
      },
      receive: function(data) {
        var req, _ref;
        req = data.req;
        delete data.req;
        delete data.qr;
        switch (req) {
          case 'abort':
            if ((_ref = qr.ajax) != null) _ref.abort();
            return qr.message.send({
              req: 'status'
            });
          case 'response':
            return qr.response(data.html);
          case 'status':
            return qr.status(data);
          default:
            return qr.message.post(data);
        }
      },
      post: function(data) {
        var boundary, callbacks, form, i, name, opts, parts, toBin, url, val;
        url = "http://sys.4chan.org/" + data.board + "/post";
        delete data.board;
        if (engine === 'gecko' && data.upfile) {
          if (!data.binary) {
            toBin = function(data, name, val) {
              var bb, r;
              bb = new MozBlobBuilder();
              bb.append(val);
              r = new FileReader();
              r.onload = function() {
                data[name] = r.result;
                if (!--i) return qr.message.post(data);
              };
              return r.readAsBinaryString(bb.getBlob('text/plain'));
            };
            i = Object.keys(data).length;
            for (name in data) {
              val = data[name];
              if (typeof val === 'object') {
                toBin(data.upfile, 'name', data.upfile.name);
              } else if (typeof val === 'boolean') {
                if (val) {
                  toBin(data, name, String(val));
                } else {
                  i--;
                }
              } else {
                toBin(data, name, val);
              }
            }
            data.board = url.split('/')[3];
            data.binary = true;
            return;
          }
          delete data.binary;
          boundary = '-------------SMCD' + Date.now();
          parts = [];
          parts.push('Content-Disposition: form-data; name="upfile"; filename="' + data.upfile.name + '"\r\n' + 'Content-Type: ' + data.upfile.type + '\r\n\r\n' + data.upfile.buffer + '\r\n');
          delete data.upfile;
          for (name in data) {
            val = data[name];
            if (val) {
              parts.push('Content-Disposition: form-data; name="' + name + '"\r\n\r\n' + val + '\r\n');
            }
          }
          form = '--' + boundary + '\r\n' + parts.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';
        } else {
          form = new FormData();
          for (name in data) {
            val = data[name];
            if (val) form.append(name, val);
          }
        }
        callbacks = {
          onload: function() {
            return qr.message.send({
              req: 'response',
              html: this.response
            });
          }
        };
        opts = {
          form: form,
          type: 'post',
          upCallbacks: {
            onload: function() {
              return qr.message.send({
                req: 'status',
                progress: '...'
              });
            },
            onprogress: function(e) {
              return qr.message.send({
                req: 'status',
                progress: "" + (Math.round(e.loaded / e.total * 100)) + "%"
              });
            }
          }
        };
        if (boundary) {
          opts.headers = {
            'Content-Type': 'multipart/form-data;boundary=' + boundary
          };
        }
        try {
          return qr.ajax = $.ajax(url, callbacks, opts);
        } catch (e) {
          if (e.name === 'NETWORK_ERR') {
            return qr.message.send({
              req: 'status',
              ready: true,
              banned: true
            });
          }
        }
      }
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
        $.set('firstrun', true);
        return Options.dialog();
      }
    },
    dialog: function() {
      var arr, back, checked, description, dialog, favicon, fileInfoR, fileInfoT, hiddenNum, hiddenThreads, indicator, indicators, input, key, li, obj, overlay, ta, time, tr, ul, _i, _j, _len, _len2, _ref, _ref2, _ref3, _ref4;
      dialog = $.el('div', {
        id: 'options',
        className: 'reply dialog',
        innerHTML: '<div id=optionsbar>\
  <div id=credits>\
    <a target=_blank href=http://mayhemydg.github.com/4chan-x/>4chan X</a>\
    | <a target=_blank href=https://raw.github.com/mayhemydg/4chan-x/master/changelog>' + VERSION + '</a>\
    | <a target=_blank href=http://mayhemydg.github.com/4chan-x/#bug-report>Issues</a>\
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
      Thread File Info Formatting\
      <li><input type=text name=fileInfoT> : <span id=fileInfoTPreview></span></li>\
      <li>Link: %l (lowercase L)</li>\
      <li>Size: %B (Bytes), %K (KB), %M (MB), %s (4chan default)</li>\
      <li>Resolution: %r (Displays PDF on /po/, for PDFs)</li>\
      Reply File Info Formatting\
      <li><input type=text name=fileInfoR> : <span id=fileInfoRPreview></span></li>\
      <li>All thread formatters also work for reply formatting.</li>\
      <li>Link (with original file name): %l (lowercase L)(Truncated), %L (Untruncated)</li>\
      <li>Original file name: %n (Truncated), %N (Untruncated)</li>\
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
      _ref2 = $$('textarea', dialog);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        ta = _ref2[_i];
        ta.textContent = conf[ta.name];
        $.on(ta, 'change', $.cb.value);
      }
      (back = $('[name=backlink]', dialog)).value = conf['backlink'];
      (time = $('[name=time]', dialog)).value = conf['time'];
      (fileInfoR = $('[name=fileInfoR]', dialog)).value = conf['fileInfoR'];
      (fileInfoT = $('[name=fileInfoT]', dialog)).value = conf['fileInfoT'];
      $.on(back, 'keyup', $.cb.value);
      $.on(back, 'keyup', Options.backlink);
      $.on(time, 'keyup', $.cb.value);
      $.on(time, 'keyup', Options.time);
      $.on(fileInfoR, 'keyup', $.cb.value);
      $.on(fileInfoR, 'keyup', Options.fileInfo);
      $.on(fileInfoT, 'keyup', $.cb.value);
      $.on(fileInfoT, 'keyup', Options.fileInfo);
      favicon = $('select', dialog);
      favicon.value = conf['favicon'];
      $.on(favicon, 'change', $.cb.value);
      $.on(favicon, 'change', Options.favicon);
      _ref3 = config.hotkeys;
      for (key in _ref3) {
        arr = _ref3[key];
        tr = $.el('tr', {
          innerHTML: "<td>" + arr[1] + "</td><td><input name=" + key + "></td>"
        });
        input = $('input', tr);
        input.value = conf[key];
        $.on(input, 'keydown', Options.keybind);
        $.add($('#keybinds_tab + div tbody', dialog), tr);
      }
      indicators = {};
      _ref4 = $$('.warning', dialog);
      for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
        indicator = _ref4[_j];
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
      $.on(overlay, 'click', Options.close);
      $.on(dialog, 'click', function(e) {
        return e.stopPropagation();
      });
      $.add(overlay, dialog);
      $.add(d.body, overlay);
      d.body.style.setProperty('overflow', 'hidden', null);
      Options.backlink.call(back);
      Options.time.call(time);
      Options.fileInfo.call(fileInfoR);
      Options.fileInfo.call(fileInfoT);
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
      if (e.keyCode === 9) return;
      e.preventDefault();
      e.stopPropagation();
      if ((key = Keybinds.keyCode(e)) == null) return;
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
    fileInfo: function() {
      var type;
      type = this.name === 'fileInfoR' ? 0 : 1;
      FileInfo.data = {
        link: '<a href="javascript:;">1329791824.png</a>',
        size: 996,
        unit: 'KB',
        resolution: '1366x768',
        fullname: '[a.f.k.] Sayonara Zetsubou Sensei - 09.avi_snapshot_03.34_[2011.02.20_06.58.00].jpg',
        shortname: '[a.f.k.] Sayonara Zetsubou Sen(...).jpg',
        type: type
      };
      FileInfo.setFormats();
      return $.id("" + this.name + "Preview").innerHTML = FileInfo.funks[type](FileInfo);
    },
    favicon: function() {
      Favicon["switch"]();
      Unread.update(true);
      return this.nextElementSibling.innerHTML = "<img src=" + Favicon.unreadSFW + "> <img src=" + Favicon.unreadNSFW + "> <img src=" + Favicon.unreadDead + ">";
    }
  };

  Threading = {
    op: function(node) {
      var nodes, op;
      nodes = [];
      while (node.nodeName !== 'BLOCKQUOTE') {
        nodes.push(node);
        node = node.nextSibling;
      }
      nodes.push(node);
      node = node.nextSibling;
      op = $.el('div', {
        className: 'op'
      });
      $.add(op, nodes);
      op.id = $('input', op).name;
      return $.before(node, op);
    },
    thread: function(node) {
      var div, nodes;
      node = Threading.op(node);
      if (g.REPLY) return;
      nodes = [];
      while (node.nodeName !== 'HR') {
        nodes.push(node);
        node = node.nextElementSibling;
      }
      div = $.el('div', {
        className: 'thread'
      });
      $.add(div, nodes);
      $.before(node, div);
      node = node.nextElementSibling;
      if (!(node.align || node.nodeName === 'CENTER')) {
        return Threading.thread(node);
      }
    }
  };

  ThreadHiding = {
    init: function() {
      var a, hiddenThreads, op, thread, _i, _len, _ref;
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      _ref = $$('.thread');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        op = thread.firstChild;
        a = $.el('a', {
          textContent: '[ - ]',
          href: 'javascript:;'
        });
        $.on(a, 'click', ThreadHiding.cb);
        $.prepend(op, a);
        if (op.id in hiddenThreads) ThreadHiding.hide(thread);
      }
    },
    cb: function() {
      return ThreadHiding.toggle(this.parentNode.parentNode);
    },
    toggle: function(thread) {
      var hiddenThreads, id;
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      id = $('.op', thread).id;
      if (thread.hidden || thread.firstChild.className === 'block') {
        ThreadHiding.show(thread);
        delete hiddenThreads[id];
      } else {
        ThreadHiding.hide(thread);
        hiddenThreads[id] = Date.now();
      }
      return $.set("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
    },
    hide: function(thread) {
      var a, div, name, num, op, span, text, trip, uid, _ref, _ref2;
      if (!conf['Show Stubs']) {
        thread.hidden = true;
        thread.nextSibling.hidden = true;
        return;
      }
      if (thread.firstChild.className === 'block') return;
      num = 0;
      if (span = $('.omittedposts', thread)) {
        num = Number(span.textContent.match(/\d+/)[0]);
      }
      num += $$('.op ~ table', thread).length;
      text = num === 1 ? '1 reply' : "" + num + " replies";
      op = $('.op', thread);
      name = $('.postername', op).textContent;
      uid = ((_ref = $('.posteruid', op)) != null ? _ref.textContent : void 0) || '';
      trip = ((_ref2 = $('.postertrip', op)) != null ? _ref2.textContent : void 0) || '';
      a = $.el('a', {
        innerHTML: "<span>[ + ]</span> " + name + " " + uid + " " + trip + " (" + text + ")",
        href: 'javascript:;'
      });
      $.on(a, 'click', ThreadHiding.cb);
      div = $.el('div', {
        className: 'block'
      });
      $.add(div, a);
      return $.prepend(thread, div);
    },
    show: function(thread, id) {
      $.rm($('.block', thread));
      thread.hidden = false;
      return thread.nextSibling.hidden = false;
    }
  };

  Updater = {
    init: function() {
      var checkbox, checked, dialog, html, input, name, title, _i, _len, _ref;
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
      this.count = $('#count', dialog);
      this.timer = $('#timer', dialog);
      this.br = $('br[clear]');
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
            conf[input.name] = input.checked;
          }
        } else if (input.name === 'Interval') {
          $.on(input, 'change', function() {
            return conf['Interval'] = this.value = parseInt(this.value, 10) || conf['Interval'];
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
        if (conf['Verbose']) {
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
        var doc, id, newPosts, nodes, reply, scroll, _i, _len, _ref;
        if (this.status === 404) {
          Updater.timer.textContent = '';
          Updater.count.textContent = 404;
          Updater.count.className = 'warning';
          clearTimeout(Updater.timeoutID);
          g.dead = true;
          if (conf['Unread Count']) {
            Unread.title = Unread.title.match(/^.+-/)[0] + ' 404';
          } else {
            d.title = d.title.match(/^.+-/)[0] + ' 404';
          }
          Unread.update(true);
          qr.message.send({
            req: 'abort'
          });
          qr.status();
          Favicon.update();
          return;
        }
        Updater.retryCoef = 10;
        Updater.timer.textContent = '-' + conf['Interval'];
        /*
              Status Code 304: Not modified
              By sending the `If-Modified-Since` header we get a proper status code, and no response.
              This saves bandwidth for both the user and the servers, avoid unnecessary computation,
              and won't load images and scripts when parsing the response.
        */
        if (this.status === 304) {
          if (conf['Verbose']) {
            Updater.count.textContent = '+0';
            Updater.count.className = null;
          }
          return;
        }
        Updater.lastModified = this.getResponseHeader('Last-Modified');
        doc = d.implementation.createHTMLDocument(null);
        doc.documentElement.innerHTML = this.responseText;
        id = $('input', Updater.br.previousElementSibling).name;
        nodes = [];
        _ref = $$('.reply', doc).reverse();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          reply = _ref[_i];
          if (reply.id <= id) break;
          nodes.push(reply.parentNode.parentNode.parentNode);
        }
        newPosts = nodes.length;
        scroll = conf['Scrolling'] && Updater.scrollBG() && newPosts && Updater.br.previousElementSibling.getBoundingClientRect().bottom - d.body.clientHeight < 25;
        if (conf['Verbose']) {
          Updater.count.textContent = "+" + newPosts;
          Updater.count.className = newPosts ? 'new' : null;
        }
        $.before(Updater.br, nodes.reverse());
        if (scroll) return Updater.br.previousSibling.scrollIntoView();
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
      this.count.className = '';
      return this.update();
    },
    update: function() {
      var url, _ref;
      Updater.timer.textContent = 0;
      if ((_ref = Updater.request) != null) _ref.abort();
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
      var favicon, html, input, inputs, _i, _len;
      html = '<div class=move>Thread Watcher</div>';
      this.dialog = ui.dialog('watcher', 'top: 50px; left: 0px;', html);
      $.add(d.body, this.dialog);
      inputs = $$('.op > input');
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
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
      var board, div, favicon, id, link, nodes, props, watchedBoard, x, _i, _j, _len, _len2, _ref, _ref2, _ref3;
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
      _ref2 = $$('div:not(.move)', Watcher.dialog);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        div = _ref2[_i];
        $.rm(div);
      }
      $.add(Watcher.dialog, nodes);
      watchedBoard = watched[g.BOARD] || {};
      _ref3 = $$('.favicon');
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        favicon = _ref3[_j];
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
      if ($('.favicon', thread).src === Favicon["default"]) return false;
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
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var name, node;
      if (post["class"] === 'inline') return;
      name = $('.commentpostername, .postername', post.el);
      name.textContent = 'Anonymous';
      node = name.nextElementSibling;
      if (node.className === 'postertrip' || node.nodeName === 'A') {
        return $.rm(node);
      }
    }
  };

  Sauce = {
    init: function() {
      var link, _i, _len, _ref;
      if (g.BOARD === 'f') return;
      this.links = [];
      _ref = conf['sauces'].split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        if (link[0] === '#') continue;
        this.links.push(this.createSauceLink(link));
      }
      if (!this.links.length) return;
      return g.callbacks.push(this.node);
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
            return "' + img.firstChild.getAttribute('md5').replace(/\=*$/, '') + '";
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
      if (post["class"] === 'inline' || !img) return;
      img = img.parentNode;
      nodes = [];
      _ref = Sauce.links;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        nodes.push($.tn(' '), link(img));
      }
      return $.add(post.filesize, nodes);
    }
  };

  RevealSpoilers = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var img;
      img = post.img;
      if (!(img && /^Spoil/.test(img.alt)) || post["class"] === 'inline') return;
      img.removeAttribute('height');
      img.removeAttribute('width');
      return img.src = "http://thumbs.4chan.org" + (img.parentNode.pathname.replace(/src(\/\d+).+$/, 'thumb$1s.jpg'));
    }
  };

  Time = {
    init: function() {
      var chanOffset;
      Time.foo();
      chanOffset = 5 - new Date().getTimezoneOffset() / 60;
      if ($.isDST()) chanOffset--;
      this.parse = Date.parse('10/11/11(Tue)18:53') === 1318351980000 ? function(node) {
        return new Date(Date.parse(node.textContent) + chanOffset * HOUR);
      } : function(node) {
        var day, hour, min, month, year, _, _ref;
        _ref = node.textContent.match(/(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\d+)/), _ = _ref[0], month = _ref[1], day = _ref[2], year = _ref[3], hour = _ref[4], min = _ref[5];
        year = "20" + year;
        month -= 1;
        hour = chanOffset + Number(hour);
        return new Date(year, month, day, hour, min);
      };
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var node, time;
      if (post["class"] === 'inline') return;
      node = $('.posttime', post.el) || $('span[id]', post.el).previousSibling;
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

  FileInfo = {
    init: function() {
      if (g.BOARD === 'f') return;
      this.setFormats();
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var fullname, link, node, regexp, resolution, shortname, size, type, unit, _, _ref;
      if (post["class"] === 'inline' || !(node = post.filesize)) return;
      type = node.childElementCount === 2 ? 0 : 1;
      regexp = type ? /^File: (<.+>)-\((?:Spoiler Image, )?([\d\.]+) (\w+), (\d+x\d+|PDF)/ : /^File: (<.+>)-\((?:Spoiler Image, )?([\d\.]+) (\w+), (\d+x\d+|PDF), <span title="(.+)">([^<]+)/;
      _ref = node.innerHTML.match(regexp), _ = _ref[0], link = _ref[1], size = _ref[2], unit = _ref[3], resolution = _ref[4], fullname = _ref[5], shortname = _ref[6];
      FileInfo.data = {
        link: link,
        size: size,
        unit: unit,
        resolution: resolution,
        fullname: fullname,
        shortname: shortname,
        type: type
      };
      return node.innerHTML = FileInfo.funks[type](FileInfo);
    },
    setFormats: function() {
      var code, format, funks, i, param;
      funks = [];
      for (i = 0; i <= 1; i++) {
        format = i ? conf['fileInfoT'] : conf['fileInfoR'];
        param = i ? /%([BKlMrs])/g : /%([BKlLMnNrs])/g;
        code = format.replace(param, function(s, c) {
          if (c in FileInfo.formatters) {
            return "' + f.formatters." + c + "() + '";
          } else {
            return s;
          }
        });
        funks.push(Function('f', "return '" + code + "'"));
      }
      return this.funks = funks;
    },
    convertUnit: function(unitT) {
      var i, size, unitF, units;
      size = this.data.size;
      unitF = this.data.unit;
      if (unitF !== unitT) {
        units = ['B', 'KB', 'MB'];
        i = units.indexOf(unitF) - units.indexOf(unitT);
        if (unitT === 'B') unitT = 'Bytes';
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
        if (FileInfo.data.type === 0) {
          return FileInfo.data.link.replace(/>\d+\.\w+</, ">" + (this.n()) + "<");
        } else {
          return FileInfo.data.link;
        }
      },
      L: function() {
        return FileInfo.data.link.replace(/>\d+\.\w+</, ">" + FileInfo.data.fullname + "<");
      },
      n: function() {
        if (FileInfo.data.fullname === FileInfo.data.shortname) {
          return FileInfo.data.fullname;
        } else {
          return "<span class=filename><span class=fnfull>" + FileInfo.data.fullname + "</span><span class=fntrunc>" + FileInfo.data.shortname + "</span></span>";
        }
      },
      N: function() {
        return FileInfo.data.fullname;
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

  TitlePost = {
    init: function() {
      return d.title = GetTitle();
    }
  };

  QuoteBacklink = {
    init: function() {
      var format;
      format = conf['backlink'].replace(/%id/g, "' + id + '");
      this.funk = Function('id', "return '" + format + "'");
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var a, container, el, link, qid, quote, quotes, root, _i, _len, _ref;
      if (post.isInlined) return;
      quotes = {};
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (qid = quote.hash.slice(1)) quotes[qid] = true;
      }
      a = $.el('a', {
        href: "#" + post.id,
        className: post.root.hidden ? 'filtered backlink' : 'backlink',
        textContent: QuoteBacklink.funk(post.id)
      });
      for (qid in quotes) {
        if (!(el = $.id(qid)) || el.className === 'op' && !conf['OP Backlinks']) {
          continue;
        }
        link = a.cloneNode(true);
        if (conf['Quote Preview']) $.on(link, 'mouseover', QuotePreview.mouseover);
        if (conf['Quote Inline']) $.on(link, 'click', QuoteInline.toggle);
        if (!((container = $('.container', el)) && container.parentNode === el)) {
          container = $.el('span', {
            className: 'container'
          });
          $.add(container, [$.tn(' '), link]);
          root = $('.reportbutton', el) || $('span[id]', el);
          $.after(root, container);
        } else {
          $.add(container, [$.tn(' '), link]);
        }
      }
    }
  };

  QuoteInline = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var quote, _i, _j, _len, _len2, _ref, _ref2;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!quote.hash) continue;
        quote.removeAttribute('onclick');
        $.on(quote, 'click', QuoteInline.toggle);
      }
      _ref2 = post.backlinks;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        quote = _ref2[_j];
        $.on(quote, 'click', QuoteInline.toggle);
      }
    },
    toggle: function(e) {
      var id;
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      id = this.hash.slice(1);
      if (/\binlined\b/.test(this.className)) {
        QuoteInline.rm(this, id);
      } else {
        if ($.x("ancestor::*[@id='" + id + "']", this)) return;
        QuoteInline.add(this, id);
      }
      return this.classList.toggle('inlined');
    },
    add: function(q, id) {
      var el, i, inline, pathname, root, table, threadID;
      root = q.parentNode.nodeName === 'FONT' ? q.parentNode : q.nextSibling ? q.nextSibling : q;
      if (el = $.id(id)) {
        inline = QuoteInline.table(id, el.innerHTML);
        if ((i = Unread.replies.indexOf(el.parentNode.parentNode.parentNode)) !== -1) {
          Unread.replies.splice(i, 1);
          Unread.update();
        }
        if (/\bbacklink\b/.test(q.className)) {
          $.after(q.parentNode, inline);
          if (conf['Forward Hiding']) {
            table = $.x('ancestor::table', el);
            $.addClass(table, 'forwarded');
            ++table.title || (table.title = 1);
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
          return QuoteInline.parse(this, pathname, id, threadID, inline);
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
        table = $.x('ancestor::table', $.id(inlined.hash.slice(1)));
        if (!--table.title) $.removeClass(table, 'forwarded');
      }
      if (/\bbacklink\b/.test(q.className)) {
        table = $.x('ancestor::table', $.id(id));
        if (!--table.title) return $.removeClass(table, 'forwarded');
      }
    },
    parse: function(req, pathname, id, threadID, inline) {
      var doc, href, link, newInline, node, quote, _i, _len, _ref;
      if (!inline.parentNode) return;
      if (req.status !== 200) {
        inline.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      doc = d.implementation.createHTMLDocument(null);
      doc.documentElement.innerHTML = req.responseText;
      node = id === threadID ? Threading.op($('body > form', doc).firstChild) : doc.getElementById(id);
      newInline = QuoteInline.table(id, node.innerHTML);
      _ref = $$('.quotelink', newInline);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
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

  QuotePreview = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var quote, _i, _j, _len, _len2, _ref, _ref2;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.hash) $.on(quote, 'mouseover', QuotePreview.mouseover);
      }
      _ref2 = post.backlinks;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        quote = _ref2[_j];
        $.on(quote, 'mouseover', QuotePreview.mouseover);
      }
    },
    mouseover: function(e) {
      var el, id, qp, quote, replyID, threadID, _i, _len, _ref;
      if (/\binlined\b/.test(this.className)) return;
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
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            quote = _ref[_i];
            if (quote.hash.slice(1) === replyID) $.addClass(quote, 'forwardlink');
          }
        }
      } else {
        qp.textContent = "Loading " + id + "...";
        threadID = this.pathname.split('/').pop() || $.x('ancestor::div[@class="thread"]', this).firstChild.id;
        $.cache(this.pathname, (function() {
          return QuotePreview.parse(this, id, threadID);
        }));
        ui.hover(e);
      }
      $.on(this, 'mousemove', ui.hover);
      $.on(this, 'mouseout', QuotePreview.mouseout);
      return $.on(this, 'click', QuotePreview.mouseout);
    },
    mouseout: function() {
      var el;
      if (el = $.id(this.hash.slice(1))) $.removeClass(el, 'qphl');
      ui.hoverend();
      $.off(this, 'mousemove', ui.hover);
      $.off(this, 'mouseout', QuotePreview.mouseout);
      return $.off(this, 'click', QuotePreview.mouseout);
    },
    parse: function(req, id, threadID) {
      var doc, node, post, qp;
      if (!((qp = ui.el) && qp.textContent === ("Loading " + id + "..."))) return;
      if (req.status !== 200) {
        qp.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      doc = d.implementation.createHTMLDocument(null);
      doc.documentElement.innerHTML = req.responseText;
      node = id === threadID ? Threading.op($('body > form', doc).firstChild) : doc.getElementById(id);
      qp.innerHTML = node.innerHTML;
      post = {
        root: qp,
        filesize: $('.filesize', qp),
        img: $('img[md5]', qp)
      };
      if (conf['Image Auto-Gif']) AutoGif.node(post);
      if (conf['Time Formatting']) Time.node(post);
      if (conf['File Info Formatting']) return FileInfo.node(post);
    }
  };

  QuoteOP = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var quote, _i, _len, _ref;
      if (post["class"] === 'inline') return;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.hash.slice(1) === post.threadId) {
          $.add(quote, $.tn('\u00A0(OP)'));
        }
      }
    }
  };

  QuoteCT = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var path, quote, _i, _len, _ref;
      if (post["class"] === 'inline') return;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!quote.hash) continue;
        path = quote.pathname.split('/');
        if (path[1] === g.BOARD && path[3] !== post.threadId) {
          $.add(quote, $.tn('\u00A0(Cross-thread)'));
        }
      }
    }
  };

  Quotify = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var board, className, data, href, i, id, index, m, node, nodes, quote, quotes, snapshot, text, _i, _len, _ref;
      if (post["class"] === 'inline') return;
      snapshot = d.evaluate('.//text()[not(parent::a)]', post.el.lastChild, null, 6, null);
      for (i = 0, _ref = snapshot.snapshotLength; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        node = snapshot.snapshotItem(i);
        data = node.data;
        if (!(quotes = data.match(/>>(>\/[a-z\d]+\/)?\d+/g))) continue;
        nodes = [];
        for (_i = 0, _len = quotes.length; _i < _len; _i++) {
          quote = quotes[_i];
          index = data.indexOf(quote);
          if (text = data.slice(0, index)) nodes.push($.tn(text));
          id = quote.match(/\d+$/)[0];
          board = (m = quote.match(/^>>>\/([a-z\d]+)/)) ? m[1] : $('.quotejs', post.el).pathname.split('/')[1];
          if (board === g.BOARD && $.id(id)) {
            href = "#" + id;
            className = 'quotelink';
          } else {
            href = Redirect.thread(board, id, 'post');
            className = 'deadlink';
          }
          nodes.push($.el('a', {
            textContent: "" + quote + "\u00A0(Dead)",
            href: href,
            className: className
          }));
          data = data.slice(index + quote.length);
        }
        if (data) nodes.push($.tn(data));
        $.replace(node, nodes);
      }
    }
  };

  ReportButton = {
    init: function() {
      this.a = $.el('a', {
        className: 'reportbutton',
        innerHTML: '[&nbsp;!&nbsp;]',
        href: 'javascript:;'
      });
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var a;
      if (!(a = $('.reportbutton', post.el))) {
        a = ReportButton.a.cloneNode(true);
        $.after($('span[id]', post.el), [$.tn(' '), a]);
      }
      return $.on(a, 'click', ReportButton.report);
    },
    report: function() {
      var id, set, url;
      url = "http://sys.4chan.org/" + g.BOARD + "/imgboard.php?mode=report&no=" + ($.x('preceding-sibling::input', this).name);
      id = Date.now();
      set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200";
      return window.open(url, id, set);
    }
  };

  ThreadStats = {
    init: function() {
      var dialog;
      dialog = ui.dialog('stats', 'bottom: 0; left: 0;', '<div class=move><span id=postcount>0</span> / <span id=imagecount>0</span></div>');
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
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var imgcount;
      if (post.isInlined) return;
      $.id('postcount').textContent = ++ThreadStats.posts;
      if (!post.img) return;
      imgcount = $.id('imagecount');
      imgcount.textContent = ++ThreadStats.images;
      if (ThreadStats.images > ThreadStats.imgLimit) {
        return imgcount.className = 'warning';
      }
    }
  };

  Unread = {
    init: function() {
      this.title = d.title;
      this.update();
      $.on(window, 'scroll', Unread.scroll);
      return g.callbacks.push(this.node);
    },
    replies: [],
    foresee: [],
    node: function(post) {
      var index;
      if ((index = Unread.foresee.indexOf(post.id)) !== -1) {
        Unread.foresee.splice(index, 1);
        return;
      }
      if (post.root.hidden || post["class"]) return;
      Unread.replies.push(post.root);
      return Unread.update();
    },
    scroll: function() {
      var bottom, height, i, reply, _len, _ref;
      height = d.body.clientHeight;
      _ref = Unread.replies;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        reply = _ref[i];
        bottom = reply.getBoundingClientRect().bottom;
        if (bottom > height) break;
      }
      if (i === 0) return;
      Unread.replies = Unread.replies.slice(i);
      return Unread.update();
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
    update: function(forceUpdate) {
      var count;
      if (!g.REPLY) return;
      count = this.replies.length;
      if (conf['Unread Count']) this.setTitle(count);
      if (!(conf['Unread Favicon'] && (count < 2 || forceUpdate))) return;
      Favicon.el.href = g.dead ? count ? Favicon.unreadDead : Favicon.dead : count ? Favicon.unread : Favicon["default"];
      return $.add(d.head, Favicon.el);
    }
  };

  Favicon = {
    init: function() {
      var href;
      this.el = $('link[rel="shortcut icon"]', d.head);
      this.el.type = 'image/x-icon';
      href = this.el.href;
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
      if (url) return location.href = url;
    },
    image: function(href) {
      href = href.split('/');
      if (!conf['404 Redirect']) return;
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
      if (board == null) board = g.BOARD;
      if (id == null) id = g.THREAD_ID;
      if (mode == null) mode = 'thread';
      if (!(conf['404 Redirect'] || mode === 'post')) return;
      switch (g.BOARD) {
        case 'a':
        case 'jp':
        case 'm':
        case 'tg':
        case 'tv':
        case 'u':
        case 'v':
        case 'vg':
          return "http://archive.foolz.us/" + board + "/thread/" + id + "/";
        case 'lit':
          return "http://fuuka.warosu.org/" + board + "/" + mode + "/" + id;
        case 'diy':
        case 'g':
        case 'sci':
          return "http://archive.installgentoo.net/" + board + "/" + mode + "/" + id;
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
        case 'vp':
        case 'x':
          return "http://archive.no-ip.org/" + board + "/" + mode + "/" + id;
        default:
          if (mode === 'thread') {
            return "http://boards.4chan.org/" + board + "/";
          } else {
            return null;
          }
      }
    }
  };

  ImageHover = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      if (!post.img) return;
      return $.on(post.img, 'mouseover', ImageHover.mouseover);
    },
    mouseover: function() {
      ui.el = $.el('img', {
        id: 'ihover',
        src: this.parentNode.href
      });
      $.add(d.body, ui.el);
      $.on(ui.el, 'load', ImageHover.load);
      $.on(this, 'mousemove', ui.hover);
      return $.on(this, 'mouseout', ImageHover.mouseout);
    },
    load: function() {
      var style;
      if (this !== ui.el) return;
      style = this.style;
      return ui.hover({
        clientX: -45 + parseInt(style.left),
        clientY: 120 + parseInt(style.top)
      });
    },
    mouseout: function() {
      ui.hoverend();
      $.off(this, 'mousemove', ui.hover);
      return $.off(this, 'mouseout', ImageHover.mouseout);
    }
  };

  AutoGif = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(post) {
      var img, src;
      if (post.root.hidden || !post.img) return;
      src = post.img.parentNode.href;
      if (/gif$/.test(src) && !/spoiler/.test(src)) {
        img = $.el('img');
        $.on(img, 'load', function() {
          return post.img.src = src;
        });
        return img.src = src;
      }
    }
  };

  ImageExpand = {
    init: function() {
      g.callbacks.push(this.node);
      return this.dialog();
    },
    node: function(post) {
      var a;
      if (!post.img) return;
      a = post.img.parentNode;
      $.on(a, 'click', ImageExpand.cb.toggle);
      if (ImageExpand.on && !post.root.hidden && post["class"] !== 'inline') {
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
        var i, thumb, thumbs, _i, _j, _len, _len2, _len3, _ref;
        ImageExpand.on = this.checked;
        if (ImageExpand.on) {
          thumbs = $$('img[md5]');
          if (conf['Expand From Current']) {
            for (i = 0, _len = thumbs.length; i < _len; i++) {
              thumb = thumbs[i];
              if (thumb.getBoundingClientRect().top > 0) break;
            }
            thumbs = thumbs.slice(i);
          }
          for (_i = 0, _len2 = thumbs.length; _i < _len2; _i++) {
            thumb = thumbs[_i];
            ImageExpand.expand(thumb);
          }
        } else {
          _ref = $$('img[md5][hidden]');
          for (_j = 0, _len3 = _ref.length; _j < _len3; _j++) {
            thumb = _ref[_j];
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
        $('body > form').className = klass;
        if (/\bfitheight\b/.test(klass)) {
          $.on(window, 'resize', ImageExpand.resize);
          if (!ImageExpand.style) ImageExpand.style = $.addStyle('');
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
        if (rect.top < 0) d.body.scrollTop += rect.top - 42;
        if (rect.left < 0) d.body.scrollLeft += rect.left;
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
      if ($.x('ancestor-or-self::*[@hidden]', thumb)) return;
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
        if (g.dead) return;
        url = href + '?' + Date.now();
      }
      timeoutID = setTimeout(ImageExpand.expand, 10000, thumb, url);
      if (!(engine === 'webkit' && url.split('/')[2] === 'images.4chan.org')) {
        return;
      }
      return $.ajax(url, {
        onreadystatechange: (function() {
          if (this.status === 404) return clearTimeout(timeoutID);
        })
      }, {
        type: 'head'
      });
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
      ImageExpand.cb.typeChange.call(select);
      $.on(select, 'change', $.cb.value);
      $.on(select, 'change', ImageExpand.cb.typeChange);
      $.on($('input', controls), 'click', ImageExpand.cb.all);
      form = $('body > form');
      return $.prepend(form, controls);
    },
    resize: function() {
      return ImageExpand.style.textContent = ".fitheight img[md5] + img {max-height:" + d.body.clientHeight + "px;}";
    }
  };

  Main = {
    init: function() {
      var cutoff, hiddenThreads, id, key, now, path, pathname, temp, timestamp, val, _ref;
      path = location.pathname;
      pathname = path.slice(1).split('/');
      g.BOARD = pathname[0], temp = pathname[1];
      if (temp === 'res') {
        g.REPLY = true;
        g.THREAD_ID = pathname[2];
      } else {
        g.PAGENUM = parseInt(temp) || 0;
      }
      for (key in conf) {
        val = conf[key];
        conf[key] = $.get(key, val);
      }
      $.on(window, 'message', Main.message);
      switch (location.hostname) {
        case 'sys.4chan.org':
          if (path === '/robots.txt') {
            qr.message.send({
              req: 'status',
              ready: true
            });
          } else if (/report/.test(location.search)) {
            $.ready(function() {
              return $.on($.id('recaptcha_response_field'), 'keydown', function(e) {
                if (e.keyCode === 8 && !e.target.value) {
                  return window.location = 'javascript:Recaptcha.reload()';
                }
              });
            });
          }
          return;
        case 'www.4chan.org':
          if (path === '/banned') {
            qr.message.send({
              req: 'status',
              ready: true,
              banned: true
            });
          }
          return;
        case 'images.4chan.org':
          $.ready(function() {
            if (d.title === '4chan - 404') return Redirect.init();
          });
          return;
      }
      $.ready(Options.init);
      if (conf['Quick Reply'] && conf['Hide Original Post Form']) {
        Main.css += 'form[name=post] { display: none; }';
      }
      Main.addStyle();
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
      if (conf['Filter']) Filter.init();
      if (conf['Reply Hiding']) ReplyHiding.init();
      if (conf['Filter'] || conf['Reply Hiding']) StrikethroughQuotes.init();
      if (conf['Anonymize']) Anonymize.init();
      if (conf['Time Formatting']) Time.init();
      if (conf['File Info Formatting']) FileInfo.init();
      if (conf['Sauce']) Sauce.init();
      if (conf['Reveal Spoilers']) RevealSpoilers.init();
      if (conf['Image Auto-Gif']) AutoGif.init();
      if (conf['Image Hover']) ImageHover.init();
      if (conf['Report Button']) ReportButton.init();
      if (conf['Resurrect Quotes']) Quotify.init();
      if (conf['Quote Inline']) QuoteInline.init();
      if (conf['Quote Preview']) QuotePreview.init();
      if (conf['Quote Backlinks']) QuoteBacklink.init();
      if (conf['Indicate OP quote']) QuoteOP.init();
      if (conf['Indicate Cross-thread Quotes']) QuoteCT.init();
      return $.ready(Main.ready);
    },
    ready: function() {
      var MutationObserver, form, nav, node, nodes, observer, _i, _j, _len, _len2, _ref, _ref2;
      if (d.title === '4chan - 404') {
        Redirect.init();
        return;
      }
      if (!$.id('navtopr')) return;
      $.addClass(d.body, "chanx_" + (VERSION.split('.')[1]));
      $.addClass(d.body, engine);
      _ref = ['navtop', 'navbot'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nav = _ref[_i];
        $.addClass($("a[href$='/" + g.BOARD + "/']", $.id(nav)), 'current');
      }
      form = $('form[name=delform]');
      Threading.thread(form.firstElementChild);
      Favicon.init();
      if (conf['Quick Reply']) qr.init();
      if (conf['Image Expansion']) ImageExpand.init();
      if (conf['Thread Watcher']) {
        setTimeout(function() {
          return Watcher.init();
        });
      }
      if (conf['Keybinds']) {
        setTimeout(function() {
          return Keybinds.init();
        });
      }
      if (g.REPLY) {
        if (conf['Thread Updater']) {
          setTimeout(function() {
            return Updater.init();
          });
        }
        if (conf['Thread Stats']) ThreadStats.init();
        if (conf['Reply Navigation']) {
          setTimeout(function() {
            return Nav.init();
          });
        }
        if (conf['Post in Title']) TitlePost.init();
        if (conf['Unread Count'] || conf['Unread Favicon']) Unread.init();
      } else {
        if (conf['Thread Hiding']) {
          setTimeout(function() {
            return ThreadHiding.init();
          });
        }
        if (conf['Thread Expansion']) {
          setTimeout(function() {
            return ExpandThread.init();
          });
        }
        if (conf['Comment Expansion']) {
          setTimeout(function() {
            return ExpandComment.init();
          });
        }
        if (conf['Index Navigation']) {
          setTimeout(function() {
            return Nav.init();
          });
        }
      }
      nodes = [];
      _ref2 = $$('.op, a + table', form);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        node = _ref2[_j];
        nodes.push(Main.preParse(node));
      }
      Main.node(nodes, true);
      if (MutationObserver = window.WebKitMutationObserver || window.MozMutationObserver || window.OMutationObserver || window.MutationObserver) {
        observer = new MutationObserver(Main.observer);
        return observer.observe(form, {
          childList: true,
          subtree: true
        });
      } else {
        return $.on(form, 'DOMNodeInserted', Main.listener);
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
      var data, version;
      data = e.data;
      if (data.qr) {
        qr.message.receive(data);
        return;
      }
      version = data.version;
      if (version && version !== VERSION && confirm('An updated version of 4chan X is available, would you like to install it now?')) {
        return window.location = "https://raw.github.com/mayhemydg/4chan-x/" + version + "/4chan_x.user.js";
      }
    },
    preParse: function(node) {
      var klass, post;
      klass = node.className;
      post = {
        root: node,
        el: klass === 'op' ? node : node.firstChild.firstChild.lastChild,
        "class": klass,
        id: node.getElementsByTagName('input')[0].name,
        threadId: g.THREAD_ID || $.x('ancestor::div[@class="thread"]', node).firstChild.id,
        isOP: klass === 'op',
        isInlined: /\binline\b/.test(klass),
        filesize: node.getElementsByClassName('filesize')[0] || false,
        quotes: node.getElementsByClassName('quotelink'),
        backlinks: node.getElementsByClassName('backlink')
      };
      post.img = post.filesize ? node.getElementsByTagName('img')[0] : false;
      return post;
    },
    node: function(nodes, notify) {
      var callback, node, _i, _j, _len, _len2, _ref;
      _ref = g.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        try {
          for (_j = 0, _len2 = nodes.length; _j < _len2; _j++) {
            node = nodes[_j];
            callback(node);
          }
        } catch (err) {
          if (notify) {
            alert("4chan X (" + VERSION + ") error: " + err.message + "\nhttp://mayhemydg.github.com/4chan-x/#bug-report\n\n" + err.stack);
          }
        }
      }
    },
    observer: function(mutations) {
      var addedNode, mutation, nodes, _i, _j, _len, _len2, _ref;
      nodes = [];
      for (_i = 0, _len = mutations.length; _i < _len; _i++) {
        mutation = mutations[_i];
        _ref = mutation.addedNodes;
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          addedNode = _ref[_j];
          if (addedNode.nodeName === 'TABLE') nodes.push(Main.preParse(addedNode));
        }
      }
      if (nodes.length) return Main.node(nodes);
    },
    listener: function(e) {
      var target;
      target = e.target;
      if (target.nodeName === 'TABLE') return Main.node([Main.preParse(target)]);
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
.block ~ .op,\
.block ~ .omittedposts,\
.block ~ table,\
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
  min-width: 100%;\
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
.new {\
  background: lime;\
}\
.warning {\
  color: red;\
}\
.replyhider {\
  vertical-align: top;\
}\
\
.filesize + br + a {\
  float: left;\
  pointer-events: none;\
}\
.filename:hover > .fntrunc,\
.filename:not(:hover) > .fnfull {\
  display: none;\
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
/* revealed spoilers do not have height/width,\
   this fixed "expanded" auto-gifs */\
img[md5] {\
  max-height: 251px;\
  max-width: 251px;\
}\
td > .filesize > img[md5] {\
  max-height: 126px;\
  max-width: 126px;\
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
#sauces {\
  height: 320px;\
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
#qp {\
  padding-bottom: 5px;\
}\
#qp > a > img {\
  max-height: 300px;\
  max-width: 500px;\
}\
.qphl {\
  outline: 2px solid rgba(216, 94, 49, .7);\
}\
.inlined {\
  opacity: .5;\
}\
.inline .reply {\
  background-color: rgba(255, 255, 255, 0.15);\
  border: 1px solid rgba(128, 128, 128, 0.5);\
}\
.filetitle, .replytitle, .postername, .commentpostername, .postertrip {\
  background: none;\
}\
.filter_highlight.op,\
.filter_highlight > td[id] {\
  box-shadow: -5px 0 rgba(255,0,0,0.5);\
}\
.filtered {\
  text-decoration: line-through;\
}\
.quotelink.forwardlink {\
  color: #2C2C63;\
}\
'
  };

  Main.init();

}).call(this);
