// ==UserScript==
// @name           4chan x
// @version        2.26.4
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
 * 4chan X 2.26.4
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
 * desuwa - Firefox filename upload fix
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
  var $, $$, DAY, Favicon, HOUR, MINUTE, Main, NAMESPACE, SECOND, Time, VERSION, anonymize, conf, config, d, engine, expandComment, expandThread, filter, flatten, g, getTitle, imgExpand, imgGif, imgHover, key, keybinds, log, nav, options, qr, quoteBacklink, quoteIndicators, quoteInline, quotePreview, redirect, replyHiding, reportButton, revealSpoilers, sauce, strikethroughQuotes, threadHiding, threadStats, threading, titlePost, ui, unread, unxify, updater, val, watcher, _base;

  config = {
    main: {
      Enhancing: {
        '404 Redirect': [true, 'Redirect dead threads and images'],
        'Fix XXX\'d Post Numbers': [true, 'Replace XXX\'d post numbers with their actual number'],
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
        'Reveal Spoilers': [false, 'Replace spoiler thumbnails by the original thumbnail']
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
      dimensions: '',
      filesize: '',
      md5: ''
    },
    sauces: ['http://iqdb.org/?url=$1', 'http://www.google.com/searchbyimage?image_url=$1', '#http://tineye.com/search?url=$1', '#http://saucenao.com/search.php?db=999&url=$1', '#http://3d.iqdb.org/?url=$1', '#http://regex.info/exif.cgi?imgurl=$2', '# uploaders:', '#http://imgur.com/upload?url=$2', '#http://omploader.org/upload?url1=$2', '# "View Same" in archives:', '#http://archive.foolz.us/a/image/$3/', '#http://archive.installgentoo.net/g/image/$3'].join('\n'),
    time: '%m/%d/%y(%a)%H:%M',
    backlink: '>>%id',
    favicon: 'ferongr',
    hotkeys: {
      openOptions: ['ctrl+o', 'Open Options'],
      close: ['Esc', 'Close Options or QR'],
      spoiler: ['ctrl+s', 'Quick spoiler'],
      openQR: ['i', 'Open QR with post number inserted'],
      openEmptyQR: ['I', 'Open QR without post number inserted'],
      submit: ['alt+s', 'Submit post'],
      nextReply: ['J', 'Select next reply'],
      previousReply: ['K', 'Select previous reply'],
      nextThread: ['n', 'See next thread'],
      previousThread: ['p', 'See previous thread'],
      nextPage: ['L', 'Jump to the next page'],
      previousPage: ['H', 'Jump to the previous page'],
      zero: ['0', 'Jump to page 0'],
      openThreadTab: ['o', 'Open thread in current tab'],
      openThread: ['O', 'Open thread in new tab'],
      expandThread: ['e', 'Expand thread'],
      watch: ['w', 'Watch thread'],
      hide: ['x', 'Hide thread'],
      expandImages: ['m', 'Expand selected image'],
      expandAllImages: ['M', 'Expand all images'],
      update: ['u', 'Update now'],
      unreadCountTo0: ['z', 'Reset unread status']
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

  VERSION = '2.26.4';

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
          onload: (function() {
            var cb, _i, _len, _ref, _results;
            _ref = this.callbacks;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              cb = _ref[_i];
              _results.push(cb.call(this));
            }
            return _results;
          })
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
    tn: function(s) {
      return d.createTextNode(s);
    },
    nodes: function(nodes) {
      var frag, node, _i, _len;
      if (!(nodes instanceof Array)) return nodes;
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
    filters: {},
    init: function() {
      var boards, filter, hl, key, op, regexp, _i, _len, _ref, _ref2, _ref3;
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
            regexp = RegExp(regexp[1], regexp[2]);
          } catch (e) {
            alert(e.message);
            continue;
          }
          op = ((_ref3 = filter.match(/op:(yes|no|only)/)) != null ? _ref3[1].toLowerCase() : void 0) || 'no';
          hl = /highlight/.test(filter);
          this.filters[key].push(this.createFilter(regexp, op, hl));
        }
        if (!this.filters[key].length) delete this.filters[key];
      }
      if (Object.keys(this.filters).length) return g.callbacks.push(this.node);
    },
    createFilter: function(regexp, op, hl) {
      return function(root, value, isOP) {
        if (isOP && op === 'no' || !isOP && op === 'only') return false;
        if (!regexp.test(value)) return false;
        if (hl) {
          $.addClass(root, 'filter_highlight');
        } else if (isOP) {
          threadHiding.hideHide(root.parentNode);
        } else {
          replyHiding.hideHide(root.previousSibling);
        }
        return true;
      };
    },
    node: function(root) {
      var isOP, key, klass;
      klass = root.className;
      if (/\binlined\b/.test(klass)) return;
      if (!(isOP = klass === 'op')) root = $('td[id]', root);
      for (key in filter.filters) {
        if (filter.test(root, key, isOP)) return;
      }
    },
    test: function(root, key, isOP) {
      var filter, value, _i, _len, _ref;
      value = this[key](root, isOP);
      if (value === false) return false;
      _ref = this.filters[key];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter = _ref[_i];
        if (filter(root, value, isOP)) return true;
      }
      return false;
    },
    name: function(root, isOP) {
      var name;
      name = isOP ? $('.postername', root) : $('.commentpostername', root);
      return name.textContent;
    },
    tripcode: function(root) {
      var trip;
      if (trip = $('.postertrip', root)) return trip.textContent;
      return false;
    },
    email: function(root) {
      var mail;
      if (!(mail = $('.linkmail', root))) return mail.href;
      return false;
    },
    subject: function(root, isOP) {
      var sub;
      sub = isOP ? $('.filetitle', root) : $('.replytitle', root);
      return sub.textContent;
    },
    comment: function(root) {
      return ($.el('a', {
        innerHTML: $('blockquote', root).innerHTML.replace(/<br>/g, '\n')
      })).textContent;
    },
    filename: function(root) {
      var file;
      if (file = $('.filesize > span', root)) return file.title;
      return false;
    },
    dimensions: function(root) {
      var span;
      if (span = $('.filesize', root)) return span.textContent.match(/\d+x\d+/)[0];
      return false;
    },
    filesize: function(root) {
      var img;
      if (img = $('img[md5]', root)) return img.alt;
      return false;
    },
    md5: function(root) {
      var img;
      if (img = $('img[md5]', root)) return img.getAttribute('md5');
      return false;
    }
  };

  strikethroughQuotes = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var el, quote, _i, _len, _ref;
      if (root.className === 'inline') return;
      _ref = $$('.quotelink', root);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if ((el = $.id(quote.hash.slice(1))) && el.parentNode.parentNode.parentNode.hidden) {
          $.addClass(quote, 'filtered');
          if (conf['Recursive Filtering']) root.hidden = true;
        }
      }
    }
  };

  expandComment = {
    init: function() {
      var a, _i, _len, _ref, _results;
      _ref = $$('.abbr > a');
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
      }
      $.replace(a.parentNode.parentNode, bq);
      if (conf['Quote Preview']) quotePreview.node(bq);
      if (conf['Quote Inline']) quoteInline.node(bq);
      return quoteIndicators.node(bq);
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
          if ((_ref = $('.op .container', thread)) != null) _ref.textContent = '';
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
      var body, href, link, next, nodes, quote, reply, _i, _j, _len, _len2, _ref, _ref2;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        $.off(a, 'click', expandThread.cb.toggle);
        return;
      }
      a.textContent = a.textContent.replace('X Loading...', '-');
      body = $.el('body', {
        innerHTML: req.responseText
      });
      nodes = [];
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
        nodes.push(reply.parentNode.parentNode.parentNode);
      }
      while ((next = a.nextSibling) && !next.clear) {
        $.rm(next);
      }
      return $.before(next, nodes);
    }
  };

  replyHiding = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
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
      var div, name, table, trip, _ref;
      table = reply.parentNode.parentNode.parentNode;
      if (table.hidden) return;
      table.hidden = true;
      if (conf['Show Stubs']) {
        name = $('.commentpostername', reply).textContent;
        trip = ((_ref = $('.postertrip', reply)) != null ? _ref.textContent : void 0) || '';
        div = $.el('div', {
          className: 'stub',
          innerHTML: "<a href=javascript:;><span>[ + ]</span> " + name + " " + trip + "</a>"
        });
        $.on($('a', div), 'click', replyHiding.cb.show);
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
            options.close.call(o);
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
          if (qr.el && !qr.status()) qr.submit();
          break;
        case conf.unreadCountTo0:
          unread.replies = [];
          unread.update();
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
      $.add(span, [prev, $.tn(' '), next]);
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

  unxify = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var number, quote;
      switch (unxify.censor) {
        case true:
          quote = $('.quotejs + .quotejs', root);
          return quote.textContent = quote.previousElementSibling.hash.slice(1);
        case false:
          break;
        default:
          number = $('.quotejs + .quotejs', root).textContent;
          if (number.length < 4) return;
          unxify.censor = /\D/.test($('.quotejs + .quotejs', root).textContent);
          return unxify.node(root);
      }
    }
  };

  qr = {
    init: function() {
      var form, iframe, link, loadChecking, script;
      if (!$.id('recaptcha_challenge_field_holder')) return;
      if (conf['Hide Original Post Form']) {
        link = $.el('h1', {
          innerHTML: "<a href=javascript:;>" + (g.REPLY ? 'Quick Reply' : 'New Thread') + "</a>"
        });
        $.on($('a', link), 'click', function() {
          qr.open();
          return $('textarea', qr.el).focus();
        });
        form = d.forms[0];
        $.before(form, link);
      }
      g.callbacks.push(this.node);
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
    node: function(root) {
      return $.on($('.quotejs + .quotejs', root), 'click', qr.quote);
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
      var caretPos, id, s, sel, ta, text, _ref;
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
      qr.selected.el.lastChild.textContent = qr.selected.com = ta.value = ta.value.slice(0, caretPos) + text + ta.value.slice(ta.selectionEnd, ta.value.length);
      ta.focus();
      return ta.selectionEnd = ta.selectionStart = caretPos + text.length;
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
          innerHTML: '<a class=remove>x</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
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
      var e, fileInput, input, mimeTypes, name, spoiler, ta, thread, threads, _i, _j, _len, _len2, _ref, _ref2;
      qr.el = ui.dialog('qr', 'top:0;right:0;', '\
<div class=move>\
  Quick Reply <input type=checkbox id=autohide title=Auto-hide>\
  <span> <a class=close title=Close>x</a></span>\
</div>\
<form>\
  <div><input id=dump class=field type=button title="Dump list" value=+><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>\
  <div id=replies><div><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>\
  <div><textarea name=com title=Comment placeholder=Comment class=field></textarea></div>\
  <div class=captcha title=Reload><img></div>\
  <div><input title=Verification class=field autocomplete=off size=1></div>\
  <div><input type=file multiple size=16><input type=submit></div>\
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
      $.on(spoiler.firstChild, 'change', function() {
        return $('input', qr.selected.el).click();
      });
      $.on($('.warning', qr.el), 'click', qr.cleanError);
      new qr.reply().select();
      _ref2 = ['name', 'email', 'sub', 'com'];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        name = _ref2[_j];
        input = $("[name=" + name + "]", qr.el);
        $.on(input, 'keyup', function() {
          return qr.selected[this.name] = this.value;
        });
        $.on(input, 'change', function() {
          return qr.selected[this.name] = this.value;
        });
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
        spoiler: reply.spoiler,
        mode: 'regist',
        pwd: (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $('[name=pwd]').value,
        recaptcha_challenge_field: challenge,
        recaptcha_response_field: response
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
      }
      if (conf['Persistent QR'] || qr.cooldown.auto) {
        reply.rm();
      } else {
        qr.close();
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

  options = {
    init: function() {
      var a, home, _i, _len, _ref;
      _ref = [$.id('navtopr'), $.id('navbotr')];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        home = _ref[_i];
        a = $.el('a', {
          textContent: '4chan X',
          href: 'javascript:;'
        });
        $.on(a, 'click', options.dialog);
        $.replace(home.firstElementChild, a);
      }
      if (!$.get('firstrun')) {
        $.set('firstrun', true);
        return options.dialog();
      }
    },
    dialog: function() {
      var arr, back, checked, description, dialog, favicon, hiddenNum, hiddenThreads, indicator, indicators, input, key, li, obj, overlay, ta, time, tr, ul, _i, _j, _len, _len2, _ref, _ref2, _ref3, _ref4;
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
    <div>Lines starting with a <code>#</code> will be ignored.</div>\
    <ul>These variables will be replaced by the corresponding url:\
      <li>$1: Thumbnail.</li>\
      <li>$2: Full image.</li>\
      <li>$3: MD5 hash.</li>\
    </ul>\
    <textarea name=sauces id=sauces></textarea>\
  </div>\
  <input type=radio name=tab hidden id=filter_tab>\
  <div>\
    <div class=warning><code>Filter</code> is disabled.</div>\
    Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>\
    For example, <code>/weeaboo/i</code> will filter posts containing `weeaboo` case-insensitive.\
    <p>Name:<br><textarea name=name></textarea></p>\
    <p>Tripcode:<br><textarea name=tripcode></textarea></p>\
    <p>E-mail:<br><textarea name=email></textarea></p>\
    <p>Subject:<br><textarea name=subject></textarea></p>\
    <p>Comment:<br><textarea name=comment></textarea></p>\
    <p>Filename:<br><textarea name=filename></textarea></p>\
    <p>Image dimensions:<br><textarea name=dimensions></textarea></p>\
    <p>Filesize:<br><textarea name=filesize></textarea></p>\
    <p>Image MD5:<br><textarea name=md5></textarea></p>\
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
      _ref3 = config.hotkeys;
      for (key in _ref3) {
        arr = _ref3[key];
        tr = $.el('tr', {
          innerHTML: "<td>" + arr[1] + "</td><td><input name=" + key + "></td>"
        });
        input = $('input', tr);
        input.value = conf[key];
        $.on(input, 'keydown', options.keybind);
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
      $.on(overlay, 'click', options.close);
      $.on(dialog, 'click', function(e) {
        return e.stopPropagation();
      });
      $.add(overlay, dialog);
      $.add(d.body, overlay);
      d.body.style.setProperty('overflow', 'hidden', null);
      options.backlink.call(back);
      options.time.call(time);
      return options.favicon.call(favicon);
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
      unread.update(true);
      return this.nextElementSibling.innerHTML = "<img src=" + Favicon.unreadSFW + "> <img src=" + Favicon.unreadNSFW + "> <img src=" + Favicon.unreadDead + ">";
    }
  };

  threading = {
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
      node = threading.op(node);
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
          if (input.name === 'Scroll BG') {
            $.on(input, 'click', updater.cb.scrollBG);
            updater.cb.scrollBG.call(input);
          }
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
      scrollBG: function() {
        return updater.scrollBG = this.checked ? function() {
          return true;
        } : function() {
          return !(d.hidden || d.oHidden || d.mozHidden || d.webkitHidden);
        };
      },
      update: function() {
        var body, id, newPosts, nodes, reply, scroll, _i, _len, _ref, _ref2;
        if (this.status === 404) {
          updater.timer.textContent = '';
          updater.count.textContent = 404;
          updater.count.className = 'warning';
          clearTimeout(updater.timeoutID);
          g.dead = true;
          if (conf['Unread Count']) {
            unread.title = unread.title.match(/^.+-/)[0] + ' 404';
          } else {
            d.title = d.title.match(/^.+-/)[0] + ' 404';
          }
          unread.update(true);
          qr.message.send({
            req: 'abort'
          });
          qr.status();
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
        id = ((_ref = $('td[id]', updater.br.previousElementSibling)) != null ? _ref.id : void 0) || 0;
        nodes = [];
        _ref2 = $$('.reply', body).reverse();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          reply = _ref2[_i];
          if (reply.id <= id) break;
          nodes.push(reply.parentNode.parentNode.parentNode);
        }
        newPosts = nodes.length;
        scroll = conf['Scrolling'] && updater.scrollBG() && newPosts && updater.br.previousElementSibling.getBoundingClientRect().bottom - d.body.clientHeight < 25;
        if (conf['Verbose']) {
          updater.count.textContent = '+' + newPosts;
          if (newPosts === 0) {
            updater.count.className = null;
          } else {
            updater.count.className = 'new';
          }
        }
        $.before(updater.br, nodes.reverse());
        if (scroll) return updater.br.previousSibling.scrollIntoView();
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
      return updater.request = $.ajax(url, {
        onload: updater.cb.update
      }, {
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
      inputs = $$('.op > input');
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        favicon = $.el('img', {
          className: 'favicon'
        });
        $.on(favicon, 'click', watcher.cb.toggle);
        $.before(input, favicon);
      }
      if (g.THREAD_ID === $.get('autoWatch', 0)) {
        watcher.watch(g.THREAD_ID);
        $["delete"]('autoWatch');
      } else {
        watcher.refresh();
      }
      return $.sync('watched', watcher.refresh);
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
            textContent: 'X',
            href: 'javascript:;'
          });
          $.on(x, 'click', watcher.cb.x);
          link = $.el('a', props);
          link.title = link.textContent;
          div = $.el('div');
          $.add(div, [x, $.tn(' '), link]);
          nodes.push(div);
        }
      }
      _ref2 = $$('div:not(.move)', watcher.dialog);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        div = _ref2[_i];
        $.rm(div);
      }
      $.add(watcher.dialog, nodes);
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
      watcher.refresh();
      return true;
    }
  };

  anonymize = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
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
    }
  };

  sauce = {
    init: function() {
      var link, _i, _len, _ref;
      if (g.BOARD === 'f') return;
      this.links = [];
      _ref = conf['sauces'].match(/^[^#].+$/gm);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        this.links.push(this.funk(link));
      }
      if (!this.links.length) return;
      return g.callbacks.push(this.node);
    },
    funk: function(link) {
      var domain, href;
      domain = link.match(/(\w+)\.\w+\//)[1];
      href = link.replace(/(\$\d)/, function(fragment) {
        switch (fragment) {
          case '$1':
            return "http://thumbs.4chan.org' + img.pathname.replace(/src(\\/\\d+).+$/, 'thumb$1s.jpg') + '";
          case '$2':
            return "' + img.href + '";
          case '$3':
            return "' + img.firstChild.getAttribute('md5').replace(/\=*$/, '') + '";
        }
      });
      href = Function('img', "return '" + href + "'");
      return function(img) {
        return $.el('a', {
          href: href(img),
          target: '_blank',
          textContent: domain
        });
      };
    },
    node: function(root) {
      var img, link, nodes, span, _i, _len, _ref;
      if (root.className === 'inline' || !(span = $('.filesize', root))) return;
      img = span.nextElementSibling.nextElementSibling;
      nodes = [];
      _ref = sauce.links;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        nodes.push($.tn(' '), link(img));
      }
      return $.add(span, nodes);
    }
  };

  revealSpoilers = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var img;
      if (!(img = $('img[alt^=Spoil]', root)) || root.className === 'inline') {
        return;
      }
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
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var node, time;
      if (root.className === 'inline') return;
      node = $('.posttime', root) || $('span[id]', root).previousSibling;
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
      format = conf['backlink'].replace(/%id/g, "' + id + '");
      quoteBacklink.funk = Function('id', "return '" + format + "'");
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var a, container, el, id, link, qid, quote, quotes, _i, _len, _ref;
      if (/\binline\b/.test(root.className)) return;
      quotes = {};
      _ref = $$('.quotelink', root);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (qid = quote.hash.slice(1)) quotes[qid] = true;
      }
      id = $('input', root).name;
      a = $.el('a', {
        href: "#" + id,
        className: root.hidden ? 'filtered backlink' : 'backlink',
        textContent: quoteBacklink.funk(id)
      });
      for (qid in quotes) {
        if (!(el = $.id(qid)) || el.className === 'op' && !conf['OP Backlinks']) {
          continue;
        }
        link = a.cloneNode(true);
        if (conf['Quote Preview']) $.on(link, 'mouseover', quotePreview.mouseover);
        if (conf['Quote Inline']) $.on(link, 'click', quoteInline.toggle);
        if (!((container = $('.container', el)) && container.parentNode === el)) {
          container = $.el('span', {
            className: 'container'
          });
          root = $('.reportbutton', el) || $('span[id]', el);
          $.after(root, container);
        }
        $.add(container, [$.tn(' '), link]);
      }
    }
  };

  quoteInline = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var quote, _i, _len, _ref;
      _ref = $$('.quotelink, .backlink', root);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!quote.hash) continue;
        quote.removeAttribute('onclick');
        $.on(quote, 'click', quoteInline.toggle);
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
        quoteInline.rm(this, id);
      } else {
        if ($.x("ancestor::*[@id='" + id + "']", this)) return;
        quoteInline.add(this, id);
      }
      return this.classList.toggle('inlined');
    },
    add: function(q, id) {
      var el, i, inline, pathname, root, table, threadID;
      root = q.parentNode.nodeName === 'FONT' ? q.parentNode : q.nextSibling ? q.nextSibling : q;
      if (el = $.id(id)) {
        inline = quoteInline.table(id, el.innerHTML);
        if ((i = unread.replies.indexOf(el.parentNode.parentNode.parentNode)) !== -1) {
          unread.replies.splice(i, 1);
          unread.update();
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
        table = $.x('ancestor::table', $.id(inlined.hash.slice(1)));
        if (!--table.title) $.removeClass(table, 'forwarded');
      }
      if (/\bbacklink\b/.test(q.className)) {
        table = $.x('ancestor::table', $.id(id));
        if (!--table.title) return $.removeClass(table, 'forwarded');
      }
    },
    parse: function(req, pathname, id, threadID, inline) {
      var body, href, html, link, newInline, op, quote, reply, _i, _j, _len, _len2, _ref, _ref2;
      if (!inline.parentNode) return;
      if (req.status !== 200) {
        inline.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      body = $.el('body', {
        innerHTML: req.responseText
      });
      if (id === threadID) {
        op = threading.op($('body > form', body).firstChild);
        html = op.innerHTML;
      } else {
        _ref = $$('.reply', body);
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
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var quote, _i, _len, _ref;
      _ref = $$('.quotelink, .backlink', root);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.hash) $.on(quote, 'mouseover', quotePreview.mouseover);
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
            if (quote.hash.slice(1) === replyID) quote.className = 'forwardlink';
          }
        }
      } else {
        qp.textContent = "Loading " + id + "...";
        threadID = this.pathname.split('/').pop() || $.x('ancestor::div[@class="thread"]', this).firstChild.id;
        $.cache(this.pathname, (function() {
          return quotePreview.parse(this, id, threadID);
        }));
        ui.hover(e);
      }
      $.on(this, 'mousemove', ui.hover);
      $.on(this, 'mouseout', quotePreview.mouseout);
      return $.on(this, 'click', quotePreview.mouseout);
    },
    mouseout: function() {
      var el;
      if (el = $.id(this.hash.slice(1))) $.removeClass(el, 'qphl');
      ui.hoverend();
      $.off(this, 'mousemove', ui.hover);
      $.off(this, 'mouseout', quotePreview.mouseout);
      return $.off(this, 'click', quotePreview.mouseout);
    },
    parse: function(req, id, threadID) {
      var body, html, op, qp, reply, _i, _len, _ref;
      if (!((qp = ui.el) && (qp.innerHTML === ("Loading " + id + "...")))) return;
      if (req.status !== 200) {
        qp.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      body = $.el('body', {
        innerHTML: req.responseText
      });
      if (id === threadID) {
        op = threading.op($('body > form', body).firstChild);
        html = op.innerHTML;
      } else {
        _ref = $$('.reply', body);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          reply = _ref[_i];
          if (reply.id === id) {
            html = reply.innerHTML;
            break;
          }
        }
      }
      qp.innerHTML = html;
      if (conf['Image Auto-Gif']) imgGif.node(qp);
      if (conf['Time Formatting']) return Time.node(qp);
    }
  };

  quoteIndicators = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var hash, path, quote, tid, _i, _len, _ref;
      if (root.className === 'inline') return;
      tid = g.THREAD_ID || $.x('ancestor::div[contains(@class,"thread")]', root).firstChild.id;
      _ref = $$('.quotelink', root);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        hash = quote.hash.slice(1);
        if (conf['Indicate OP quote'] && hash === tid) {
          $.add(quote, $.tn('\u00A0(OP)'));
          return;
        }
        path = quote.pathname;
        if (conf['Indicate Cross-thread Quotes'] && hash && path.lastIndexOf("/" + tid) === -1 && path.indexOf("/" + g.BOARD + "/") === 0) {
          $.add(quote, $.tn('\u00A0(Cross-thread)'));
        }
      }
    }
  };

  reportButton = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var a, span;
      if (!(a = $('.reportbutton', root))) {
        span = $('span[id]', root);
        a = $.el('a', {
          className: 'reportbutton',
          innerHTML: '[&nbsp;!&nbsp;]',
          href: 'javascript:;'
        });
        $.after(span, [$.tn(' '), a]);
      }
      return $.on(a, 'click', reportButton.report);
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
          case 'vg':
            return 501;
          default:
            return 151;
        }
      })();
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var imgcount;
      if (/\binline\b/.test(root.className)) return;
      $.id('postcount').textContent = ++threadStats.posts;
      if (!$('img[md5]', root)) return;
      imgcount = $.id('imagecount');
      imgcount.textContent = ++threadStats.images;
      if (threadStats.images > threadStats.imgLimit) {
        return imgcount.className = 'warning';
      }
    }
  };

  unread = {
    init: function() {
      this.title = d.title;
      unread.update();
      $.on(window, 'scroll', unread.scroll);
      return g.callbacks.push(this.node);
    },
    replies: [],
    node: function(root) {
      if (root.hidden || root.className) return;
      unread.replies.push(root);
      return unread.update();
    },
    scroll: function() {
      var bottom, height, i, reply, _len, _ref;
      height = d.body.clientHeight;
      _ref = unread.replies;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        reply = _ref[i];
        bottom = reply.getBoundingClientRect().bottom;
        if (bottom > height) break;
      }
      if (i === 0) return;
      unread.replies = unread.replies.slice(i);
      return unread.update();
    },
    update: function(forceUpdate) {
      var count;
      if (!g.REPLY) return;
      count = unread.replies.length;
      if (conf['Unread Count']) d.title = "(" + count + ") " + unread.title;
      if (!(conf['Unread Favicon'] && count < 2 || forceUpdate)) return;
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

  redirect = {
    init: function() {
      var url;
      url = location.hostname === 'images.4chan.org' ? redirect.image(location.href) : /^\d+$/.test(g.THREAD_ID) ? redirect.thread() : void 0;
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
          return "http://archive.foolz.us/" + href[3] + "/full_image/" + href[5];
      }
    },
    thread: function() {
      if (!conf['404 Redirect']) return;
      switch (g.BOARD) {
        case 'a':
        case 'jp':
        case 'm':
        case 'tg':
        case 'tv':
        case 'u':
        case 'v':
        case 'vg':
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
        case 'vp':
        case 'x':
          return "http://archive.no-ip.org/" + g.BOARD + "/thread/" + g.THREAD_ID;
        default:
          return "http://boards.4chan.org/" + g.BOARD + "/";
      }
    }
  };

  imgHover = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var thumb;
      if (!(thumb = $('img[md5]', root))) return;
      return $.on(thumb, 'mouseover', imgHover.mouseover);
    },
    mouseover: function() {
      ui.el = $.el('img', {
        id: 'ihover',
        src: this.parentNode.href
      });
      $.add(d.body, ui.el);
      $.on(ui.el, 'load', imgHover.load);
      $.on(this, 'mousemove', ui.hover);
      return $.on(this, 'mouseout', imgHover.mouseout);
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
      return $.off(this, 'mouseout', imgHover.mouseout);
    }
  };

  imgGif = {
    init: function() {
      return g.callbacks.push(this.node);
    },
    node: function(root) {
      var src, thumb;
      if (root.hidden || !(thumb = $('img[md5]', root))) return;
      src = thumb.parentNode.href;
      if (/gif$/.test(src) && !/spoiler/.test(src)) return thumb.src = src;
    }
  };

  imgExpand = {
    init: function() {
      g.callbacks.push(this.node);
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
        var thumb, _i, _j, _len, _len2, _ref, _ref2;
        imgExpand.on = this.checked;
        if (imgExpand.on) {
          _ref = $$('img[md5]');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thumb = _ref[_i];
            imgExpand.expand(thumb);
          }
        } else {
          _ref2 = $$('img[md5][hidden]');
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            thumb = _ref2[_j];
            imgExpand.contract(thumb);
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
      $.on(img, 'error', imgExpand.error);
      return $.add(a, img);
    },
    error: function() {
      var href, thumb, timeoutID, url;
      href = this.parentNode.href;
      thumb = this.previousSibling;
      imgExpand.contract(thumb);
      $.rm(this);
      if (!(this.src.split('/')[2] === 'images.4chan.org' && (url = redirect.image(href)))) {
        if (g.dead) return;
        url = href + '?' + Date.now();
      }
      timeoutID = setTimeout(imgExpand.expand, 10000, thumb, url);
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
      imgExpand.cb.typeChange.call(select);
      $.on(select, 'change', $.cb.value);
      $.on(select, 'change', imgExpand.cb.typeChange);
      $.on($('input', controls), 'click', imgExpand.cb.all);
      form = $('body > form');
      return $.prepend(form, controls);
    },
    resize: function() {
      return imgExpand.style.textContent = ".fitheight img[md5] + img {max-height:" + d.body.clientHeight + "px;}";
    }
  };

  Main = {
    init: function() {
      var cutoff, hiddenThreads, id, now, path, pathname, temp, timestamp, _ref;
      path = location.pathname;
      pathname = path.slice(1).split('/');
      g.BOARD = pathname[0], temp = pathname[1];
      if (temp === 'res') {
        g.REPLY = true;
        g.THREAD_ID = pathname[2];
      } else {
        g.PAGENUM = parseInt(temp) || 0;
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
            if (d.title === '4chan - 404') return redirect.init();
          });
          return;
      }
      $.ready(options.init);
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
      if (conf['Filter']) filter.init();
      if (conf['Reply Hiding']) replyHiding.init();
      if (conf['Filter'] || conf['Reply Hiding']) strikethroughQuotes.init();
      if (conf['Anonymize']) anonymize.init();
      if (conf['Time Formatting']) Time.init();
      if (conf['Sauce']) sauce.init();
      if (conf['Reveal Spoilers']) revealSpoilers.init();
      if (conf['Image Auto-Gif']) imgGif.init();
      if (conf['Image Hover']) imgHover.init();
      if (conf['Report Button']) reportButton.init();
      if (conf['Quote Inline']) quoteInline.init();
      if (conf['Quote Preview']) quotePreview.init();
      if (conf['Quote Backlinks']) quoteBacklink.init();
      if (conf['Indicate OP quote'] || conf['Indicate Cross-thread Quotes']) {
        quoteIndicators.init();
      }
      if (conf['Fix XXX\'d Post Numbers']) unxify.init();
      return $.ready(Main.ready);
    },
    ready: function() {
      var MutationObserver, form, nodes, observer;
      if (d.title === '4chan - 404') {
        redirect.init();
        return;
      }
      if (!$.id('navtopr')) return;
      $.addClass(d.body, "chanx_" + (VERSION.match(/\.(\d+)/)[1]));
      $.addClass(d.body, engine);
      form = $('form[name=delform]');
      threading.thread(form.firstElementChild);
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
        if (conf['Unread Count'] || conf['Unread Favicon']) unread.init();
      } else {
        if (conf['Thread Hiding']) threadHiding.init();
        if (conf['Thread Expansion']) expandThread.init();
        if (conf['Comment Expansion']) expandComment.init();
        if (conf['Index Navigation']) nav.init();
      }
      nodes = $$('.op, a + table', form);
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
          if (notify) alert(err.message);
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
          if (addedNode.nodeName === 'TABLE') nodes.push(addedNode);
        }
      }
      if (nodes.length) return Main.node(nodes);
    },
    listener: function(e) {
      var target;
      target = e.target;
      if (target.nodeName === 'TABLE') return Main.node([target]);
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
.filter_highlight {\
  box-shadow: -5px 0 rgba(255,0,0,0.5);\
}\
.filtered {\
  text-decoration: line-through;\
}\
'
  };

  Main.init();

}).call(this);
