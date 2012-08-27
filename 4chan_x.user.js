// ==UserScript==
// @name         4chan X alpha
// @version      3.0.0
// @description  Adds various features.
// @copyright    2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright    2012 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license      MIT; http://en.wikipedia.org/wiki/Mit_license
// @match        *://boards.4chan.org/*
// @match        *://images.4chan.org/*
// @match        *://sys.4chan.org/*
// @run-at       document-start
// @updateURL    https://github.com/MayhemYDG/4chan-x/raw/stable/4chan_x.user.js
// @downloadURL  https://github.com/MayhemYDG/4chan-x/raw/stable/4chan_x.user.js
// @icon         http://mayhemydg.github.com/4chan-x/favicon.gif
// ==/UserScript==

/* LICENSE
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
 * http://mayhemydg.github.com/4chan-x/
 * 4chan X 3.0.0
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
 * btmcsweeney - allow users to specify text for sauce links
 *
 * All the people who've taken the time to write bug reports.
 *
 * Thank you.
 */

(function() {
  var $, $$, Board, Conf, Config, Main, Post, Thread, UI, d, g;

  Config = {
    main: {
      Enhancing: {
        '404 Redirect': [true, 'Redirect dead threads and images.'],
        'Keybinds': [true, 'Bind actions to keyboard shortcuts.'],
        'Time Formatting': [true, 'Localize and format timestamps arbitrarily.'],
        'File Info Formatting': [true, 'Reformat the file information.'],
        'Comment Expansion': [true, 'Can expand too long comments.'],
        'Thread Expansion': [true, 'Can expand threads to view all replies.'],
        'Index Navigation': [false, 'Navigate to previous / next thread.'],
        'Reply Navigation': [false, 'Navigate to top / bottom of thread.'],
        'Check for Updates': [true, 'Check for updated versions of 4chan X.']
      },
      Filtering: {
        'Anonymize': [false, 'Turn everyone Anonymous.'],
        'Filter': [true, 'Self-moderation placebo.'],
        'Recursive Filtering': [true, 'Filter replies of filtered posts, recursively.'],
        'Reply Hiding': [true, 'Hide single replies.'],
        'Thread Hiding': [true, 'Hide entire threads.'],
        'Stubs': [true, 'Make stubs of hidden threads / replies.']
      },
      Imaging: {
        'Image Auto-Gif': [false, 'Animate GIF thumbnails.'],
        'Image Expansion': [true, 'Expand images.'],
        'Expand From Position': [true, 'Expand all images only from current position to thread end.'],
        'Image Hover': [false, 'Show full image on mouseover.'],
        'Sauce': [true, 'Add sauce links to images.'],
        'Reveal Spoilers': [false, 'Reveal spoiler thumbnails.']
      },
      Menu: {
        'Menu': [true, 'Add a drop-down menu in posts.'],
        'Report Link': [true, 'Add a report link to the menu.'],
        'Delete Link': [true, 'Add post and image deletion links to the menu.'],
        'Download Link': [true, 'Add a download with original filename link to the menu. Chrome-only currently.'],
        'Archive Link': [true, 'Add an archive link to the menu.']
      },
      Monitoring: {
        'Thread Updater': [true, 'Fetch and insert new replies. Has more options in its own dialog.'],
        'Unread Count': [true, 'Show the unread posts count in the tab title.'],
        'Unread Favicon': [true, 'Show a different favicon when there are unread posts.'],
        'Post in Title': [true, 'Show the thread\'s subject in the tab title.'],
        'Thread Stats': [true, 'Display reply and image count.'],
        'Thread Watcher': [true, 'Bookmark threads.'],
        'Auto Watch': [true, 'Automatically watch threads that you start.'],
        'Auto Watch Reply': [false, 'Automatically watch threads that you reply to.']
      },
      Posting: {
        'Quick Reply': [true, 'WMD.'],
        'Persistent QR': [false, 'The Quick reply won\'t disappear after posting.'],
        'Auto Hide QR': [false, 'Automatically hide the quick reply when posting.'],
        'Open Reply in New Tab': [false, 'Open replies posted from the board pages in a new tab.'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Hide Original Post Form': [true, 'Replace the normal post form with a shortcut to open the QR.']
      },
      Quoting: {
        'Quote Backlinks': [true, 'Add quote backlinks.'],
        'OP Backlinks': [false, 'Add backlinks to the OP.'],
        'Quote Inline': [true, 'Inline quoted post on click.'],
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks.'],
        'Quote Preview': [true, 'Show quoted post on hover.'],
        'Quote Highlighting': [true, 'Highlight the previewed post.'],
        'Resurrect Quotes': [true, 'Linkify dead quotes to archives.'],
        'Indicate OP quote': [true, 'Add \'(OP)\' to OP quotes.'],
        'Indicate Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes.']
      }
    },
    filter: {
      name: ['# Filter any namefags:', '#/^(?!Anonymous$)/'].join('\n'),
      uniqueid: ['# Filter a specific ID:', '#/Txhvk1Tl/'].join('\n'),
      tripcode: ['# Filter any tripfags', '#/^!/'].join('\n'),
      capcode: ['# Set a custom class for mods:', '#/Mod$/;highlight:mod;op:yes', '# Set a custom class for moot:', '#/Admin$/;highlight:moot;op:yes'].join('\n'),
      email: ['# Filter any e-mails that are not `sage` on /a/ and /jp/:', '#/^(?!sage$)/;boards:a,jp'].join('\n'),
      subject: ['# Filter Generals on /v/:', '#/general/i;boards:v;op:only'].join('\n'),
      comment: ['# Filter Stallman copypasta on /g/:', '#/what you\'re refer+ing to as linux/i;boards:g'].join('\n'),
      flag: [''].join('\n'),
      filename: [''].join('\n'),
      dimensions: ['# Highlight potential wallpapers:', '#/1920x1080/;op:yes;highlight;top:no;boards:w,wg'].join('\n'),
      filesize: [''].join('\n'),
      md5: [''].join('\n')
    },
    sauces: ['http://iqdb.org/?url=$1', 'http://www.google.com/searchbyimage?image_url=$1', '#http://tineye.com/search?url=$1', '#http://saucenao.com/search.php?db=999&url=$1', '#http://3d.iqdb.org/?url=$1', '#http://regex.info/exif.cgi?imgurl=$2', '# uploaders:', '#http://imgur.com/upload?url=$2;text:Upload to imgur', '#http://omploader.org/upload?url1=$2;text:Upload to omploader', '# "View Same" in archives:', '#http://archive.foolz.us/search/image/$3/;text:View same on foolz', '#http://archive.foolz.us/$4/search/image/$3/;text:View same on foolz /$4/', '#https://archive.installgentoo.net/$4/image/$3;text:View same on installgentoo /$4/'].join('\n'),
    time: '%m/%d/%y(%a)%H:%M',
    backlink: '>>%id',
    fileInfo: '%l (%p%s, %r)',
    favicon: 'ferongr',
    hotkeys: {
      'open QR': ['q', 'Open QR with post number inserted.'],
      'open empty QR': ['Q', 'Open QR without post number inserted.'],
      'open options': ['alt+o', 'Open Options.'],
      'close': ['Esc', 'Close Options or QR.'],
      'spoiler tags': ['ctrl+s', 'Insert spoiler tags.'],
      'code tags': ['alt+c', 'Insert code tags.'],
      'submit QR': ['alt+s', 'Submit post.'],
      'watch': ['w', 'Watch thread.'],
      'update': ['u', 'Update the thread now.'],
      'reset unread count': ['r', 'Reset unread status.'],
      'expand image': ['E', 'Expand selected image.'],
      'expand images': ['e', 'Expand all images.'],
      'front page': ['0', 'Jump to page 0.'],
      'next page': ['Right', 'Jump to the next page.'],
      'previous page': ['Left', 'Jump to the previous page.'],
      'next thread': ['Down', 'See next thread.'],
      'previous thread': ['Up', 'See previous thread.'],
      'expand thread': ['ctrl+e', 'Expand thread.'],
      'open thread': ['o', 'Open thread in current tab.'],
      'open thread tab': ['O', 'Open thread in new tab.'],
      'next reply': ['j', 'Select next reply.'],
      'previous reply': ['k', 'Select previous reply.'],
      'hide': ['x', 'Hide thread.']
    },
    updater: {
      checkbox: {
        'Auto Scroll': [false, 'Scroll updated posts into view. Only enabled at bottom of page.'],
        'Scroll BG': [false, 'Auto-scroll background tabs.'],
        'Auto Update': [true, 'Automatically fetch new posts.']
      },
      'Interval': 30
    },
    imageFit: 'fit width'
  };

  if (!/^(boards|images|sys)\.4chan\.org$/.test(location.hostname)) {
    return;
  }

  Conf = {};

  d = document;

  g = {
    VERSION: '3.0.0',
    NAMESPACE: '4chan_X.',
    boards: {},
    threads: {},
    posts: {}
  };

  UI = {
    dialog: function(id, position, html) {
      var el;
      el = d.createElement('div');
      el.className = 'reply dialog';
      el.innerHTML = html;
      el.id = id;
      el.style.cssText = localStorage.getItem("" + g.NAMESPACE + id + ".position") || position;
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
      style.right = left ? null : '0px';
      return style.bottom = top ? null : '0px';
    },
    dragend: function() {
      localStorage.setItem("" + g.NAMESPACE + UI.el.id + ".position", UI.el.style.cssText);
      d.removeEventListener('mousemove', UI.drag, false);
      d.removeEventListener('mouseup', UI.dragend, false);
      return delete UI.el;
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

  $$ = function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return Array.prototype.slice.call(root.querySelectorAll(selector));
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
    log: console.log.bind(console),
    engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase(),
    id: function(id) {
      return d.getElementById(id);
    },
    ready: function(fc) {
      var cb;
      if (/interactive|complete/.test(d.readyState)) {
        $.queueTask(fc);
      }
      cb = function() {
        $.off(d, 'DOMContentLoaded', cb);
        return fc();
      };
      return $.on(d, 'DOMContentLoaded', cb);
    },
    sync: function(key, cb) {
      return $.on(window, 'storage', function(e) {
        if (e.key === ("" + g.NAMESPACE + key)) {
          return cb(JSON.parse(e.newValue));
        }
      });
    },
    formData: function(form) {
      var fd, key, val;
      if (form instanceof HTMLFormElement) {
        return new FormData(form);
      }
      fd = new FormData();
      for (key in form) {
        val = form[key];
        if (val) {
          fd.append(key, val);
        }
      }
      return fd;
    },
    ajax: function(url, callbacks, opts) {
      var form, headers, key, r, type, upCallbacks, val;
      if (opts == null) {
        opts = {};
      }
      type = opts.type, headers = opts.headers, upCallbacks = opts.upCallbacks, form = opts.form;
      r = new XMLHttpRequest();
      type || (type = form && 'post' || 'get');
      r.open(type, url, true);
      for (key in headers) {
        val = headers[key];
        r.setRequestHeader(key, val);
      }
      $.extend(r, callbacks);
      $.extend(r.upload, upCallbacks);
      r.send(form);
      return r;
    },
    cache: function(url, cb) {
      var req, reqs, _base;
      reqs = (_base = $.cache).requests || (_base.requests = {});
      if (req = reqs[url]) {
        if (req.readyState === 4) {
          cb.call(req);
        } else {
          req.callbacks.push(cb);
        }
        return;
      }
      req = $.ajax(url, {
        onload: function() {
          var _i, _len, _ref;
          _ref = this.callbacks;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cb = _ref[_i];
            cb.call(this);
          }
        },
        onabort: function() {
          return delete reqs[url];
        },
        onerror: function() {
          return delete reqs[url];
        }
      });
      req.callbacks = [cb];
      return reqs[url] = req;
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
    rmClass: function(el, className) {
      return el.classList.remove(className);
    },
    hasClass: function(el, className) {
      return el.classList.contains(className);
    },
    rm: function(el) {
      return el.parentNode.removeChild(el);
    },
    tn: function(s) {
      return d.createTextNode(s);
    },
    nodes: function(nodes) {
      var frag, node, _i, _len;
      if (!(nodes instanceof Array)) {
        return nodes;
      }
      frag = d.createDocumentFragment();
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        frag.appendChild(node);
      }
      return frag;
    },
    add: function(parent, el) {
      return parent.appendChild($.nodes(el));
    },
    prepend: function(parent, el) {
      return parent.insertBefore($.nodes(el), parent.firstChild);
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
      return (GM_openInTab || window.open)(url, '_blank');
    },
    queueTask: (function() {
      var execTask, taskChannel, taskQueue;
      taskQueue = [];
      execTask = function() {
        var args, func, task;
        task = taskQueue.shift();
        func = task[0];
        args = Array.prototype.slice.call(task, 1);
        return func.apply(func, args);
      };
      if (window.MessageChannel) {
        taskChannel = new MessageChannel();
        taskChannel.port1.onmessage = execTask;
        return function() {
          taskQueue.push(arguments);
          return taskChannel.port2.postMessage(null);
        };
      } else {
        return function() {
          taskQueue.push(arguments);
          return setTimeout(execTask, 0);
        };
      }
    })(),
    globalEval: function(code) {
      var script;
      script = $.el('script', {
        textContent: code
      });
      $.add(d.head, script);
      return $.rm(script);
    },
    unsafeWindow: window.opera ? window : unsafeWindow !== window ? unsafeWindow : (function() {
      var p;
      p = d.createElement('p');
      p.setAttribute('onclick', 'return window');
      return p.onclick();
    })(),
    shortenFilename: function(filename, isOP) {
      var threshold;
      threshold = isOP ? 40 : 30;
      if (filename.length - 4 > threshold) {
        return "" + filename.slice(0, threshold - 5) + "(...)." + (filename.match(/\w+$/));
      } else {
        return filename;
      }
    },
    bytesToString: function(size) {
      var unit;
      unit = 0;
      while (size >= 1024) {
        size /= 1024;
        unit++;
      }
      size = unit > 1 ? Math.round(size * 100) / 100 : Math.round(size);
      return "" + size + " " + ['B', 'KB', 'MB', 'GB'][unit];
    }
  });

  $.extend($, typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null ? {
    "delete": function(name) {
      return GM_deleteValue(g.NAMESPACE + name);
    },
    get: function(name, defaultValue) {
      var value;
      if (value = GM_getValue(g.NAMESPACE + name)) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      name = g.NAMESPACE + name;
      value = JSON.stringify(value);
      localStorage.setItem(name, value);
      return GM_setValue(name, value);
    }
  } : window.opera ? {
    "delete": function(name) {
      return delete opera.scriptStorage[g.NAMESPACE + name];
    },
    get: function(name, defaultValue) {
      var value;
      if (value = opera.scriptStorage[g.NAMESPACE + name]) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      name = g.NAMESPACE + name;
      value = JSON.stringify(value);
      localStorage.setItem(name, value);
      return opera.scriptStorage[name] = value;
    }
  } : {
    "delete": function(name) {
      return localStorage.removeItem(g.NAMESPACE + name);
    },
    get: function(name, defaultValue) {
      var value;
      if (value = localStorage.getItem(g.NAMESPACE + name)) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      return localStorage.setItem(g.NAMESPACE + name, JSON.stringify(value));
    }
  });

  Board = (function() {

    function Board(ID) {
      this.ID = ID;
      this.threads = {};
      this.posts = {};
      g.boards[this.ID] = this;
    }

    return Board;

  })();

  Thread = (function() {

    function Thread(root, board) {
      this.root = root;
      this.board = board;
      this.ID = +root.id.slice(1);
      this.hr = root.nextElementSibling;
      this.posts = {};
      g.threads[this.ID] = board.threads[this.ID] = this;
    }

    return Thread;

  })();

  Post = (function() {

    function Post(root, thread, board) {
      this.root = root;
      this.thread = thread;
      this.board = board;
      this.ID = +root.id.slice(2);
      this.el = $('.post', root);
      g.posts[this.ID] = thread.posts[this.ID] = board.posts[this.ID] = this;
    }

    return Post;

  })();

  Main = {
    init: function() {
      var flatten, key, pathname, val;
      flatten = function(parent, obj) {
        var key, val;
        if (obj instanceof Array) {
          Conf[parent] = obj[0];
        } else if (typeof obj === 'object') {
          for (key in obj) {
            val = obj[key];
            flatten(key, val);
          }
        } else {
          Conf[parent] = obj;
        }
      };
      flatten(null, Config);
      for (key in Conf) {
        val = Conf[key];
        Conf[key] = $.get(key, val);
      }
      pathname = location.pathname.split('/');
      g.BOARD = new Board(pathname[1]);
      if (g.REPLY = pathname[2] === 'res') {
        g.THREAD = +pathname[3];
      }
      return $.ready(Main.ready);
    },
    ready: function() {
      var board, child, thread, _i, _j, _len, _len1, _ref, _ref1;
      board = $('.board');
      _ref = board.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.className === 'thread') {
          thread = new Thread(child, g.BOARD);
          _ref1 = thread.root.children;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            child = _ref1[_j];
            if ($.hasClass(child, 'postContainer')) {
              new Post(child, thread, g.BOARD);
            }
          }
        }
      }
      return $.log(g);
    }
  };

  Main.init();

}).call(this);
