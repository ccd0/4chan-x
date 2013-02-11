// ==UserScript==
// @name         4chan X Alpha
// @version      3.0.0
// @description  Cross-browser userscript for maximum lurking on 4chan.
// @copyright    2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright    2012-2013 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license      MIT; http://en.wikipedia.org/wiki/Mit_license
// @match        *://boards.4chan.org/*
// @match        *://images.4chan.org/*
// @match        *://sys.4chan.org/*
// @match        *://api.4chan.org/*
// @match        *://*.foolz.us/api/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @run-at       document-start
// @updateURL    https://github.com/MayhemYDG/4chan-x/raw/stable/4chan_x.meta.js
// @downloadURL  https://github.com/MayhemYDG/4chan-x/raw/stable/4chan_x.user.js
// @icon         https://github.com/MayhemYDG/4chan-x/raw/stable/img/icon.gif
// ==/UserScript==

/* 4chan X Alpha - Version 3.0.0 - 2013-02-11
 * http://mayhemydg.github.com/4chan-x/
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012-2013 Nicolas Stepien <stepien.nicolas@gmail.com>
 * Licensed under the MIT license.
 * https://github.com/MayhemYDG/4chan-x/blob/master/LICENSE
 *
 * Contributors:
 * https://github.com/MayhemYDG/4chan-x/graphs/contributors
 * Non-GitHub contributors:
 * ferongr, xat-, Ongpot, thisisanon and Anonymous - favicon contributions
 * e000 - cooldown sanity check
 * Seiba - chrome quick reply focusing
 * herpaderpderp - recaptcha fixes
 * WakiMiko - recaptcha tab order http://userscripts.org/scripts/show/82657
 *
 * All the people who've taken the time to write bug reports.
 *
 * Thank you.
 */

(function() {
  var $, $$, Anonymize, ArchiveLink, AutoGIF, Board, Build, Clone, Conf, Config, DeleteLink, DownloadLink, FileInfo, Filter, Get, Header, ImageHover, Main, Menu, Notification, Post, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, Quotify, Recursive, Redirect, ReplyHiding, ReportLink, RevealSpoilers, Sauce, Settings, Thread, ThreadHiding, ThreadUpdater, Time, UI, d, doc, g,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Config = {
    main: {
      Enhancing: {
        'Disable 4chan\'s extension': [true, 'Avoid conflicts between 4chan X Alpha and 4chan\'s inline extension.'],
        '404 Redirect': [true, 'Redirect dead threads and images.'],
        'Keybinds': [true, 'Bind actions to keyboard shortcuts.'],
        'Time Formatting': [true, 'Localize and format timestamps arbitrarily.'],
        'File Info Formatting': [true, 'Reformat the file information.'],
        'Comment Expansion': [true, 'Can expand too long comments.'],
        'Thread Expansion': [true, 'Can expand threads to view all replies.'],
        'Index Navigation': [false, 'Navigate to previous / next thread.'],
        'Reply Navigation': [false, 'Navigate to top / bottom of thread.'],
        'Check for Updates': [true, 'Check for updated versions of 4chan X Alpha.']
      },
      Filtering: {
        'Anonymize': [false, 'Turn everyone Anonymous.'],
        'Filter': [true, 'Self-moderation placebo.'],
        'Recursive Hiding': [true, 'Filter replies of filtered posts, recursively.'],
        'Thread Hiding': [true, 'Hide entire threads.'],
        'Reply Hiding': [true, 'Hide single replies.'],
        'Thread/Reply Hiding Buttons': [true, 'Make buttons to hide threads / replies, in addition to menu links.'],
        'Stubs': [true, 'Make stubs of hidden threads / replies.']
      },
      Imaging: {
        'Auto-GIF': [false, 'Animate GIF thumbnails.'],
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
        'Mark OP Quotes': [true, 'Add \'(OP)\' to OP quotes.'],
        'Mark Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes.']
      }
    },
    filter: {
      name: ['# Filter any namefags:', '#/^(?!Anonymous$)/'].join('\n'),
      uniqueID: ['# Filter a specific ID:', '#/Txhvk1Tl/'].join('\n'),
      tripcode: ['# Filter any tripfags', '#/^!/'].join('\n'),
      capcode: ['# Set a custom class for mods:', '#/Mod$/;highlight:mod;op:yes', '# Set a custom class for moot:', '#/Admin$/;highlight:moot;op:yes'].join('\n'),
      email: ['# Filter any e-mails that are not `sage` on /a/ and /jp/:', '#/^(?!sage$)/;boards:a,jp'].join('\n'),
      subject: ['# Filter Generals on /v/:', '#/general/i;boards:v;op:only'].join('\n'),
      comment: ['# Filter Stallman copypasta on /g/:', '#/what you\'re refer+ing to as linux/i;boards:g'].join('\n'),
      flag: [''].join('\n'),
      filename: [''].join('\n'),
      dimensions: ['# Highlight potential wallpapers:', '#/1920x1080/;op:yes;highlight;top:no;boards:w,wg'].join('\n'),
      filesize: [''].join('\n'),
      MD5: [''].join('\n')
    },
    sauces: ['http://iqdb.org/?url=%turl', 'http://www.google.com/searchbyimage?image_url=%turl', '#http://tineye.com/search?url=%turl', '#http://saucenao.com/search.php?db=999&url=%turl', '#http://3d.iqdb.org/?url=%turl', '#http://regex.info/exif.cgi?imgurl=%url', '# uploaders:', '#http://imgur.com/upload?url=%url;text:Upload to imgur', '#http://omploader.org/upload?url1=%url;text:Upload to omploader', '# "View Same" in archives:', '#//archive.foolz.us/_/search/image/%md5/;text:View same on foolz', '#//archive.foolz.us/%board/search/image/%md5/;text:View same on foolz /%board/', '#//archive.installgentoo.net/%board/image/%md5;text:View same on installgentoo /%board/'].join('\n'),
    time: '%m/%d/%y(%a)%H:%M:%S',
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
      'read thread': ['r', 'Mark thread as read.'],
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
        'Beep': [false, 'Beep on new post to completely read thread.'],
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

  doc = d.documentElement;

  g = {
    VERSION: '3.0.0',
    NAMESPACE: "4chan_X_Alpha.",
    boards: {},
    threads: {},
    posts: {}
  };

  UI = (function() {
    var Menu, dialog, drag, dragend, dragstart, hover, hoverend, hoverstart, touchend, touchmove;
    dialog = function(id, position, html) {
      var el, move;
      el = d.createElement('div');
      el.className = 'reply dialog';
      el.innerHTML = html;
      el.id = id;
      el.style.cssText = localStorage.getItem("" + g.NAMESPACE + id + ".position") || position;
      move = el.querySelector('.move');
      move.addEventListener('touchstart', dragstart, false);
      move.addEventListener('mousedown', dragstart, false);
      return el;
    };
    Menu = (function() {
      var close, currentMenu, lastToggledButton;

      currentMenu = null;

      lastToggledButton = null;

      function Menu(type) {
        this.type = type;
        $.on(d, 'AddMenuEntry', this.addEntry.bind(this));
        this.close = close.bind(this);
        this.entries = [];
      }

      Menu.prototype.makeMenu = function() {
        var menu;
        menu = $.el('div', {
          className: 'reply dialog',
          id: 'menu',
          tabIndex: 0
        });
        $.on(menu, 'click', function(e) {
          return e.stopPropagation();
        });
        $.on(menu, 'keydown', this.keybinds.bind(this));
        return menu;
      };

      Menu.prototype.toggle = function(e, button, data) {
        var previousButton;
        e.preventDefault();
        e.stopPropagation();
        if (currentMenu) {
          previousButton = lastToggledButton;
          this.close();
          if (previousButton === button) {
            return;
          }
        }
        if (!this.entries.length) {
          return;
        }
        return this.open(button, data);
      };

      Menu.prototype.open = function(button, data) {
        var bLeft, bRect, bTop, cHeight, cWidth, entry, left, mRect, menu, style, top, _i, _len, _ref;
        menu = this.makeMenu();
        currentMenu = menu;
        lastToggledButton = button;
        _ref = this.entries;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          this.insertEntry(entry, menu, data);
        }
        this.focus($('.entry', menu));
        $.on(d, 'click', this.close);
        $.add(d.body, menu);
        mRect = menu.getBoundingClientRect();
        bRect = button.getBoundingClientRect();
        bTop = doc.scrollTop + d.body.scrollTop + bRect.top;
        bLeft = doc.scrollLeft + d.body.scrollLeft + bRect.left;
        cHeight = doc.clientHeight;
        cWidth = doc.clientWidth;
        top = bRect.top + bRect.height + mRect.height < cHeight ? bTop + bRect.height + 2 : bTop - mRect.height - 2;
        left = bRect.left + mRect.width < cWidth ? bLeft : bLeft + bRect.width - mRect.width;
        style = menu.style;
        style.top = top + 'px';
        style.left = left + 'px';
        return menu.focus();
      };

      Menu.prototype.insertEntry = function(entry, parent, data) {
        var subEntry, submenu, _i, _len, _ref;
        if (typeof entry.open === 'function') {
          if (!entry.open(data)) {
            return;
          }
        }
        $.add(parent, entry.el);
        if (!entry.subEntries) {
          return;
        }
        if (submenu = $('.submenu', entry.el)) {
          $.rm(submenu);
        }
        submenu = $.el('div', {
          className: 'reply dialog submenu'
        });
        _ref = entry.subEntries;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subEntry = _ref[_i];
          this.insertEntry(subEntry, submenu, data);
        }
        $.add(entry.el, submenu);
      };

      close = function() {
        $.rm(currentMenu);
        currentMenu = null;
        lastToggledButton = null;
        return $.off(d, 'click', this.close);
      };

      Menu.prototype.keybinds = function(e) {
        var entry, next, subEntry, submenu;
        entry = $('.focused', currentMenu);
        while (subEntry = $('.focused', entry)) {
          entry = subEntry;
        }
        switch (e.keyCode) {
          case 27:
            lastToggledButton.focus();
            this.close();
            break;
          case 13:
          case 32:
            entry.click();
            break;
          case 38:
            if (next = entry.previousElementSibling) {
              this.focus(next);
            }
            break;
          case 40:
            if (next = entry.nextElementSibling) {
              this.focus(next);
            }
            break;
          case 39:
            if ((submenu = $('.submenu', entry)) && (next = submenu.firstElementChild)) {
              this.focus(next);
            }
            break;
          case 37:
            if (next = $.x('parent::*[contains(@class,"submenu")]/parent::*', entry)) {
              this.focus(next);
            }
            break;
          default:
            return;
        }
        e.preventDefault();
        return e.stopPropagation();
      };

      Menu.prototype.focus = function(entry) {
        var bottom, cHeight, cWidth, eRect, focused, left, right, sRect, style, submenu, top, _i, _len, _ref;
        while (focused = $.x('parent::*/child::*[contains(@class,"focused")]', entry)) {
          $.rmClass(focused, 'focused');
        }
        _ref = $$('.focused', entry);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          focused = _ref[_i];
          $.rmClass(focused, 'focused');
        }
        $.addClass(entry, 'focused');
        if (!(submenu = $('.submenu', entry))) {
          return;
        }
        sRect = submenu.getBoundingClientRect();
        eRect = entry.getBoundingClientRect();
        cHeight = doc.clientHeight;
        cWidth = doc.clientWidth;
        if (eRect.top + sRect.height < cHeight) {
          top = '0px';
          bottom = 'auto';
        } else {
          top = 'auto';
          bottom = '0px';
        }
        if (eRect.right + sRect.width < cWidth) {
          left = '100%';
          right = 'auto';
        } else {
          left = 'auto';
          right = '100%';
        }
        style = submenu.style;
        style.top = top;
        style.bottom = bottom;
        style.left = left;
        return style.right = right;
      };

      Menu.prototype.addEntry = function(e) {
        var entry;
        entry = e.detail;
        if (entry.type !== this.type) {
          return;
        }
        this.parseEntry(entry);
        return this.entries.push(entry);
      };

      Menu.prototype.parseEntry = function(entry) {
        var el, subEntries, subEntry, _i, _len;
        el = entry.el, subEntries = entry.subEntries;
        $.addClass(el, 'entry');
        $.on(el, 'focus mouseover', (function(e) {
          e.stopPropagation();
          return this.focus(el);
        }).bind(this));
        if (!subEntries) {
          return;
        }
        $.addClass(el, 'has-submenu');
        for (_i = 0, _len = subEntries.length; _i < _len; _i++) {
          subEntry = subEntries[_i];
          this.parseEntry(subEntry);
        }
      };

      return Menu;

    })();
    dragstart = function(e) {
      var el, isTouching, o, rect, screenHeight, screenWidth;
      e.preventDefault();
      el = this.parentNode;
      if (isTouching = e.type === 'touchstart') {
        e = e.changedTouches[e.changedTouches.length - 1];
      }
      rect = el.getBoundingClientRect();
      screenHeight = doc.clientHeight;
      screenWidth = doc.clientWidth;
      o = {
        id: el.id,
        style: el.style,
        dx: e.clientX - rect.left,
        dy: e.clientY - rect.top,
        height: screenHeight - rect.height,
        width: screenWidth - rect.width,
        screenHeight: screenHeight,
        screenWidth: screenWidth,
        isTouching: isTouching
      };
      if (isTouching) {
        o.identifier = e.identifier;
        o.move = touchmove.bind(o);
        o.up = touchend.bind(o);
        d.addEventListener('touchmove', o.move, false);
        d.addEventListener('touchend', o.up, false);
        return d.addEventListener('touchcancel', o.up, false);
      } else {
        o.move = drag.bind(o);
        o.up = dragend.bind(o);
        d.addEventListener('mousemove', o.move, false);
        return d.addEventListener('mouseup', o.up, false);
      }
    };
    touchmove = function(e) {
      var touch, _i, _len, _ref;
      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        if (touch.identifier === this.identifier) {
          drag.call(this, touch);
          return;
        }
      }
    };
    drag = function(e) {
      var bottom, clientX, clientY, left, right, style, top;
      clientX = e.clientX, clientY = e.clientY;
      left = clientX - this.dx;
      left = left < 10 ? 0 : this.width - left < 10 ? null : left / this.screenWidth * 100 + '%';
      top = clientY - this.dy;
      top = top < 10 ? 0 : this.height - top < 10 ? null : top / this.screenHeight * 100 + '%';
      right = left === null ? 0 : null;
      bottom = top === null ? 0 : null;
      style = this.style;
      style.left = left;
      style.right = right;
      style.top = top;
      return style.bottom = bottom;
    };
    touchend = function(e) {
      var touch, _i, _len, _ref;
      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        if (touch.identifier === this.identifier) {
          dragend.call(this);
          return;
        }
      }
    };
    dragend = function() {
      if (this.isTouching) {
        d.removeEventListener('touchmove', this.move, false);
        d.removeEventListener('touchend', this.up, false);
        d.removeEventListener('touchcancel', this.up, false);
      } else {
        d.removeEventListener('mousemove', this.move, false);
        d.removeEventListener('mouseup', this.up, false);
      }
      return localStorage.setItem("" + g.NAMESPACE + this.id + ".position", this.style.cssText);
    };
    hoverstart = function(root, el, events, cb) {
      var event, o, _i, _len, _ref;
      o = {
        root: root,
        el: el,
        style: el.style,
        cb: cb,
        events: events.split(' '),
        clientHeight: doc.clientHeight,
        clientWidth: doc.clientWidth
      };
      o.hover = hover.bind(o);
      o.hoverend = hoverend.bind(o);
      _ref = o.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        root.addEventListener(event, o.hoverend, false);
      }
      return root.addEventListener('mousemove', o.hover, false);
    };
    hover = function(e) {
      var clientX, clientY, height, left, right, style, top;
      height = this.el.offsetHeight;
      clientX = e.clientX, clientY = e.clientY;
      top = clientY - 120;
      top = this.clientHeight <= height || top <= 0 ? 0 : top + height >= this.clientHeight ? this.clientHeight - height : top;
      if (clientX <= this.clientWidth - 400) {
        left = clientX + 45 + 'px';
        right = null;
      } else {
        left = null;
        right = this.clientWidth - clientX + 45 + 'px';
      }
      style = this.style;
      style.top = top + 'px';
      style.left = left;
      return style.right = right;
    };
    hoverend = function() {
      var event, _i, _len, _ref;
      this.el.parentNode.removeChild(this.el);
      _ref = this.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.root.removeEventListener(event, this.hoverend, false);
      }
      this.root.removeEventListener('mousemove', this.hover, false);
      if (this.cb) {
        return this.cb.call(this);
      }
    };
    return {
      dialog: dialog,
      Menu: Menu,
      hover: hoverstart
    };
  })();

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
      var cb, _ref;
      if ((_ref = d.readyState) === 'interactive' || _ref === 'complete') {
        $.queueTask(fc);
        return;
      }
      cb = function() {
        $.off(d, 'DOMContentLoaded', cb);
        return fc();
      };
      return $.on(d, 'DOMContentLoaded', cb);
    },
    sync: function(key, cb) {
      key = "" + g.NAMESPACE + key;
      return $.on(window, 'storage', function(e) {
        if (e.key === key) {
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
      r.withCredentials = type === 'post';
      r.send(form);
      return r;
    },
    cache: (function() {
      var reqs;
      reqs = {};
      return function(url, cb) {
        var req;
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
            return delete this.callbacks;
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
      };
    })(),
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
    asap: function(test, cb) {
      if (test()) {
        return cb();
      } else {
        return setTimeout($.asap, 25, test, cb);
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
    event: function(event, detail) {
      return d.dispatchEvent(new CustomEvent(event, {
        detail: detail
      }));
    },
    open: function(url) {
      return (GM_openInTab || window.open)(url, '_blank');
    },
    hidden: function() {
      return d.hidden || d.oHidden || d.mozHidden || d.webkitHidden;
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

  Header = {
    init: function() {
      var boardList, boardListButton, boardTitle, headerBar, menuButton, toggleBar;
      this.menu = new UI.Menu('header');
      this.headerEl = $.el('div', {
        id: 'header',
        innerHTML: '<div id=header-bar></div><div id=notifications></div>'
      });
      headerBar = $('#header-bar', this.headerEl);
      if ($.get('autohideHeaderBar', false)) {
        $.addClass(headerBar, 'autohide');
      }
      menuButton = $.el('a', {
        className: 'menu-button',
        innerHTML: '[<span></span>]',
        href: 'javascript:;'
      });
      $.on(menuButton, 'click', this.menuToggle);
      boardListButton = $.el('span', {
        className: 'show-board-list-button',
        innerHTML: '[<a href=javascript:;>+</a>]',
        title: 'Toggle the board list.'
      });
      $.on(boardListButton, 'click', this.toggleBoardList);
      boardTitle = $.el('a', {
        className: 'board-name',
        innerHTML: "<span class=board-path>/" + g.BOARD + "/</span> - <span class=board-title>...</span>",
        href: "/" + g.BOARD + "/"
      });
      boardList = $.el('span', {
        className: 'board-list',
        hidden: true
      });
      toggleBar = $.el('div', {
        id: 'toggle-header-bar',
        title: 'Toggle the header bar position.'
      });
      $.on(toggleBar, 'click', this.toggleBar);
      $.prepend(headerBar, [menuButton, boardListButton, $.tn(' '), boardTitle, boardList, toggleBar]);
      $.asap((function() {
        return d.body;
      }), function() {
        return $.prepend(d.body, Header.headerEl);
      });
      return $.asap((function() {
        return $.id('boardNavDesktop');
      }), this.setBoardList);
    },
    setBoardList: function() {
      var a, nav;
      if (nav = $.id('boardNavDesktop')) {
        if (a = $("a[href$='/" + g.BOARD + "/']", nav)) {
          a.className = 'current';
          $('.board-title', Header.headerEl).textContent = a.title;
        }
        return $.add($('.board-list', Header.headerEl), Array.prototype.slice.call(nav.childNodes));
      }
    },
    toggleBoardList: function() {
      var headerEl, node, showBoardList;
      node = this.firstElementChild.firstChild;
      if (showBoardList = $.hasClass(this, 'show-board-list-button')) {
        this.className = 'hide-board-list-button';
        node.data = node.data.replace('+', '-');
      } else {
        this.className = 'show-board-list-button';
        node.data = node.data.replace('-', '+');
      }
      headerEl = Header.headerEl;
      $('.board-name', headerEl).hidden = showBoardList;
      return $('.board-list', headerEl).hidden = !showBoardList;
    },
    toggleBar: function() {
      var isAutohiding, message;
      message = (isAutohiding = $.id('header-bar').classList.toggle('autohide')) ? 'The header bar will automatically hide itself.' : 'The header bar will remain visible.';
      new Notification('info', message, 2);
      return $.set('autohideHeaderBar', isAutohiding);
    },
    menuToggle: function(e) {
      return Header.menu.toggle(e, this, g);
    }
  };

  Notification = (function() {

    function Notification(type, content, timeout) {
      var el;
      this.type = type;
      this.el = $.el('div', {
        className: "notification " + type,
        innerHTML: '<a href=javascript:; class=close title=Close>×</a><div class=message></div>'
      });
      $.on(this.el.firstElementChild, 'click', this.close.bind(this));
      if (typeof content === 'string') {
        content = $.tn(content);
      }
      $.add(this.el.lastElementChild, content);
      if (timeout) {
        setTimeout(this.close.bind(this), timeout * $.SECOND);
      }
      el = this.el;
      $.ready(function() {
        return $.add($.id('notifications'), el);
      });
    }

    Notification.prototype.setType = function(type) {
      $.rmClass(this.el, this.type);
      $.addClass(this.el, type);
      return this.type = type;
    };

    Notification.prototype.close = function() {
      return $.rm(this.el);
    };

    return Notification;

  })();

  Settings = {
    init: function() {
      var link, settings;
      link = $.el('a', {
        className: 'settings-link',
        textContent: '4chan X Settings',
        href: 'javascript:;'
      });
      $.on(link, 'click', Settings.open);
      $.event('AddMenuEntry', {
        type: 'header',
        el: link
      });
      link = $.el('a', {
        className: 'fourchan-settings-link',
        textContent: '4chan Settings',
        href: 'javascript:;'
      });
      $.on(link, 'click', function() {
        return $.id('settingsWindowLink').click();
      });
      $.event('AddMenuEntry', {
        type: 'header',
        el: link,
        open: function() {
          return !Conf['Disable 4chan\'s extension'];
        }
      });
      if (!Conf['Disable 4chan\'s extension']) {
        return;
      }
      settings = JSON.parse(localStorage.getItem('4chan-settings')) || {};
      if (settings.disableAll) {
        return;
      }
      settings.disableAll = true;
      return localStorage.setItem('4chan-settings', JSON.stringify(settings));
    },
    open: function() {
      return Header.menu.close();
    }
  };

  Filter = {
    filters: {},
    init: function() {
      var boards, filter, hl, key, op, regexp, stub, top, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      if (g.VIEW === 'catalog' || !Conf['Filter']) {
        return;
      }
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
          if (boards !== 'global' && !(_ref2 = g.BOARD.ID, __indexOf.call(boards.split(','), _ref2) >= 0)) {
            continue;
          }
          if (key === 'uniqueID' || key === 'MD5') {
            regexp = regexp[1];
          } else {
            try {
              regexp = RegExp(regexp[1], regexp[2]);
            } catch (err) {
              new Notification('warning', err.message, 60);
              continue;
            }
          }
          op = ((_ref3 = filter.match(/[^t]op:(yes|no|only)/)) != null ? _ref3[1] : void 0) || 'no';
          stub = (function() {
            var _ref4;
            switch ((_ref4 = filter.match(/stub:(yes|no)/)) != null ? _ref4[1] : void 0) {
              case 'yes':
                return true;
              case 'no':
                return false;
              default:
                return Conf['Stubs'];
            }
          })();
          if (hl = /highlight/.test(filter)) {
            hl = ((_ref4 = filter.match(/highlight:(\w+)/)) != null ? _ref4[1] : void 0) || 'filter-highlight';
            top = ((_ref5 = filter.match(/top:(yes|no)/)) != null ? _ref5[1] : void 0) || 'yes';
            top = top === 'yes';
          }
          this.filters[key].push(this.createFilter(regexp, op, stub, hl, top));
        }
        if (!this.filters[key].length) {
          delete this.filters[key];
        }
      }
      if (!Object.keys(this.filters).length) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Thread Hiding',
        cb: this.node
      });
    },
    createFilter: function(regexp, op, stub, hl, top) {
      var settings, test;
      test = typeof regexp === 'string' ? function(value) {
        return regexp === value;
      } : function(value) {
        return regexp.test(value);
      };
      settings = {
        hide: !hl,
        stub: stub,
        "class": hl,
        top: top
      };
      return function(value, isReply) {
        if (isReply && op === 'only' || !isReply && op === 'no') {
          return false;
        }
        if (!test(value)) {
          return false;
        }
        return settings;
      };
    },
    node: function() {
      var filter, firstThread, key, result, thisThread, value, _i, _len, _ref;
      if (this.isClone) {
        return;
      }
      for (key in Filter.filters) {
        value = Filter[key](this);
        if (value === false) {
          continue;
        }
        _ref = Filter.filters[key];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          if (!(result = filter(value, this.isReply))) {
            continue;
          }
          if (result.hide) {
            if (this.isReply) {
              ReplyHiding.hide(this, result.stub);
            } else if (g.VIEW === 'index') {
              ThreadHiding.hide(this.thread, result.stub);
            } else {
              continue;
            }
            return;
          }
          $.addClass(this.nodes.root, result["class"]);
          if (!this.isReply && result.top && g.VIEW === 'index') {
            thisThread = this.nodes.root.parentNode;
            if (firstThread = $('div[class="postContainer opContainer"]')) {
              if (firstThread !== this.nodes.root) {
                $.before(firstThread.parentNode, [thisThread, thisThread.nextElementSibling]);
              }
            }
          }
        }
      }
    },
    name: function(post) {
      if ('name' in post.info) {
        return post.info.name;
      }
      return false;
    },
    uniqueID: function(post) {
      if ('uniqueID' in post.info) {
        return post.info.uniqueID;
      }
      return false;
    },
    tripcode: function(post) {
      if ('tripcode' in post.info) {
        return post.info.tripcode;
      }
      return false;
    },
    capcode: function(post) {
      if ('capcode' in post.info) {
        return post.info.capcode;
      }
      return false;
    },
    email: function(post) {
      if ('email' in post.info) {
        return post.info.email;
      }
      return false;
    },
    subject: function(post) {
      if ('subject' in post.info) {
        return post.info.subject || false;
      }
      return false;
    },
    comment: function(post) {
      if ('comment' in post.info) {
        return post.info.comment;
      }
      return false;
    },
    flag: function(post) {
      if ('flag' in post.info) {
        return post.info.flag;
      }
      return false;
    },
    filename: function(post) {
      if (post.file) {
        return post.file.name;
      }
      return false;
    },
    dimensions: function(post) {
      if (post.file && post.file.isImage) {
        return post.file.dimensions;
      }
      return false;
    },
    filesize: function(post) {
      if (post.file) {
        return post.file.size;
      }
      return false;
    },
    MD5: function(post) {
      if (post.file) {
        return post.file.MD5;
      }
      return false;
    },
    menu: {
      init: function() {
        var div, entry, type, _i, _len, _ref;
        if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Filter']) {
          return;
        }
        div = $.el('div', {
          textContent: 'Filter'
        });
        entry = {
          type: 'post',
          el: div,
          open: function(post) {
            Filter.menu.post = post;
            return true;
          },
          subEntries: []
        };
        _ref = [['Name', 'name'], ['Unique ID', 'uniqueID'], ['Tripcode', 'tripcode'], ['Capcode', 'capcode'], ['E-mail', 'email'], ['Subject', 'subject'], ['Comment', 'comment'], ['Flag', 'flag'], ['Filename', 'filename'], ['Image dimensions', 'dimensions'], ['Filesize', 'filesize'], ['Image MD5', 'MD5']];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          type = _ref[_i];
          entry.subEntries.push(Filter.menu.createSubEntry(type[0], type[1]));
        }
        return $.event('AddMenuEntry', entry);
      },
      createSubEntry: function(text, type) {
        var el;
        el = $.el('a', {
          href: 'javascript:;',
          textContent: text
        });
        el.setAttribute('data-type', type);
        $.on(el, 'click', Filter.menu.makeFilter);
        return {
          el: el,
          open: function(post) {
            var value;
            value = Filter[type](post);
            return value !== false;
          }
        };
      },
      makeFilter: function() {
        var re, save, type, value;
        type = this.dataset.type;
        value = Filter[type](Filter.menu.post);
        re = type === 'uniqueID' || type === 'MD5' ? value : value.replace(/\/|\\|\^|\$|\n|\.|\(|\)|\{|\}|\[|\]|\?|\*|\+|\|/g, function(c) {
          if (c === '\n') {
            return '\\n';
          } else if (c === '\\') {
            return '\\\\';
          } else {
            return "\\" + c;
          }
        });
        re = type === 'uniqueID' || type === 'MD5' ? "/" + re + "/" : "/^" + re + "$/";
        if (!Filter.menu.post.isReply) {
          re += ';op:yes';
        }
        save = $.get(type, '');
        save = save ? "" + save + "\n" + re : re;
        return $.set(type, save);
      }
    }
  };

  ThreadHiding = {
    init: function() {
      if (g.VIEW !== 'index' || !Conf['Thread Hiding']) {
        return;
      }
      this.getHiddenThreads();
      this.syncFromCatalog();
      this.clean();
      return Thread.prototype.callbacks.push({
        name: 'Thread Hiding',
        cb: this.node
      });
    },
    node: function() {
      var data;
      if (data = ThreadHiding.hiddenThreads.threads[this]) {
        ThreadHiding.hide(this, data.makeStub);
      }
      if (!Conf['Thread/Reply Hiding Buttons']) {
        return;
      }
      return $.prepend(this.posts[this].nodes.root, ThreadHiding.makeButton(this, 'hide'));
    },
    getHiddenThreads: function() {
      var hiddenThreads;
      hiddenThreads = $.get("hiddenThreads." + g.BOARD);
      if (!hiddenThreads) {
        hiddenThreads = {
          threads: {},
          lastChecked: Date.now()
        };
        $.set("hiddenThreads." + g.BOARD, hiddenThreads);
      }
      return ThreadHiding.hiddenThreads = hiddenThreads;
    },
    syncFromCatalog: function() {
      var hiddenThreadsOnCatalog, threadID, threads;
      hiddenThreadsOnCatalog = JSON.parse(localStorage.getItem("4chan-hide-t-" + g.BOARD)) || {};
      threads = ThreadHiding.hiddenThreads.threads;
      for (threadID in hiddenThreadsOnCatalog) {
        if (threadID in threads) {
          continue;
        }
        threads[threadID] = {};
      }
      for (threadID in threads) {
        if (threadID in threads) {
          continue;
        }
        delete threads[threadID];
      }
      return $.set("hiddenThreads." + g.BOARD, ThreadHiding.hiddenThreads);
    },
    clean: function() {
      var hiddenThreads, lastChecked, now;
      hiddenThreads = ThreadHiding.hiddenThreads;
      lastChecked = hiddenThreads.lastChecked;
      hiddenThreads.lastChecked = now = Date.now();
      if (lastChecked > now - $.DAY) {
        return;
      }
      if (!Object.keys(hiddenThreads.threads).length) {
        $.set("hiddenThreads." + g.BOARD, hiddenThreads);
        return;
      }
      return $.ajax("//api.4chan.org/" + g.BOARD + "/catalog.json", {
        onload: function() {
          var obj, thread, threads, _i, _j, _len, _len1, _ref, _ref1;
          threads = {};
          _ref = JSON.parse(this.response);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            obj = _ref[_i];
            _ref1 = obj.threads;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              thread = _ref1[_j];
              if (thread.no in hiddenThreads.threads) {
                threads[thread.no] = hiddenThreads.threads[thread.no];
              }
            }
          }
          hiddenThreads.threads = threads;
          return $.set("hiddenThreads." + g.BOARD, hiddenThreads);
        }
      });
    },
    menu: {
      init: function() {
        var apply, div, makeStub;
        if (g.VIEW !== 'index' || !Conf['Menu'] || !Conf['Thread Hiding']) {
          return;
        }
        div = $.el('div', {
          className: 'hide-thread-link',
          textContent: 'Hide thread'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', ThreadHiding.menu.hide);
        makeStub = $.el('label', {
          innerHTML: "<input type=checkbox checked=" + Conf['Stubs'] + "> Make stub"
        });
        return $.event('AddMenuEntry', {
          type: 'post',
          el: div,
          open: function(_arg) {
            var isReply, thread;
            thread = _arg.thread, isReply = _arg.isReply;
            if (isReply || thread.isHidden) {
              return false;
            }
            ThreadHiding.menu.thread = thread;
            return true;
          },
          subEntries: [
            {
              el: apply
            }, {
              el: makeStub
            }
          ]
        });
      },
      hide: function() {
        var makeStub, thread;
        makeStub = $('input', this.parentNode).checked;
        thread = ThreadHiding.menu.thread;
        ThreadHiding.hide(thread, makeStub);
        ThreadHiding.saveHiddenState(thread, makeStub);
        return Menu.close();
      }
    },
    makeButton: function(thread, type) {
      var a;
      a = $.el('a', {
        className: "" + type + "-thread-button",
        innerHTML: "<span>[&nbsp;" + (type === 'hide' ? '-' : '+') + "&nbsp;]</span>",
        href: 'javascript:;'
      });
      $.on(a, 'click', function() {
        return ThreadHiding.toggle(thread);
      });
      return a;
    },
    saveHiddenState: function(thread, makeStub) {
      var hiddenThreads, hiddenThreadsCatalog;
      hiddenThreads = ThreadHiding.getHiddenThreads();
      hiddenThreadsCatalog = JSON.parse(localStorage.getItem("4chan-hide-t-" + g.BOARD)) || {};
      if (thread.isHidden) {
        hiddenThreads.threads[thread] = {
          makeStub: makeStub
        };
        hiddenThreadsCatalog[thread] = true;
      } else {
        delete hiddenThreads.threads[thread];
        delete hiddenThreadsCatalog[thread];
      }
      $.set("hiddenThreads." + g.BOARD, hiddenThreads);
      return localStorage.setItem("4chan-hide-t-" + g.BOARD, JSON.stringify(hiddenThreadsCatalog));
    },
    toggle: function(thread) {
      if (thread.isHidden) {
        ThreadHiding.show(thread);
      } else {
        ThreadHiding.hide(thread);
      }
      return ThreadHiding.saveHiddenState(thread);
    },
    hide: function(thread, makeStub) {
      var a, numReplies, op, opInfo, span, threadRoot;
      if (makeStub == null) {
        makeStub = Conf['Stubs'];
      }
      if (thread.hidden) {
        return;
      }
      op = thread.posts[thread];
      threadRoot = op.nodes.root.parentNode;
      threadRoot.hidden = thread.isHidden = true;
      if (!makeStub) {
        threadRoot.nextElementSibling.hidden = true;
        return;
      }
      numReplies = 0;
      if (span = $('.summary', threadRoot)) {
        numReplies = +span.textContent.match(/\d+/);
      }
      numReplies += $$('.opContainer ~ .replyContainer', threadRoot).length;
      numReplies = numReplies === 1 ? '1 reply' : "" + numReplies + " replies";
      opInfo = Conf['Anonymize'] ? 'Anonymous' : $('.nameBlock', op.nodes.info).textContent;
      a = ThreadHiding.makeButton(thread, 'show');
      $.add(a, $.tn(" " + opInfo + " (" + numReplies + ")"));
      thread.stub = $.el('div', {
        className: 'stub'
      });
      $.add(thread.stub, a);
      if (Conf['Menu']) {
        $.add(thread.stub, [$.tn(' '), Menu.makeButton(op)]);
      }
      return $.before(threadRoot, thread.stub);
    },
    show: function(thread) {
      var threadRoot;
      if (thread.stub) {
        $.rm(thread.stub);
        delete thread.stub;
      }
      threadRoot = thread.posts[thread].nodes.root.parentNode;
      return threadRoot.nextElementSibling.hidden = threadRoot.hidden = thread.isHidden = false;
    }
  };

  ReplyHiding = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Reply Hiding']) {
        return;
      }
      this.getHiddenPosts();
      this.clean();
      return Post.prototype.callbacks.push({
        name: 'Reply Hiding',
        cb: this.node
      });
    },
    node: function() {
      var data, thread;
      if (!this.isReply || this.isClone) {
        return;
      }
      if (thread = ReplyHiding.hiddenPosts.threads[this.thread]) {
        if (data = thread[this]) {
          if (data.thisPost) {
            ReplyHiding.hide(this, data.makeStub, data.hideRecursively);
          } else {
            Recursive.hide(this, data.makeStub);
          }
        }
      }
      if (!Conf['Thread/Reply Hiding Buttons']) {
        return;
      }
      return $.replace($('.sideArrows', this.nodes.root), ReplyHiding.makeButton(this, 'hide'));
    },
    getHiddenPosts: function() {
      var hiddenPosts;
      hiddenPosts = $.get("hiddenPosts." + g.BOARD);
      if (!hiddenPosts) {
        hiddenPosts = {
          threads: {},
          lastChecked: Date.now()
        };
        $.set("hiddenPosts." + g.BOARD, hiddenPosts);
      }
      return ReplyHiding.hiddenPosts = hiddenPosts;
    },
    clean: function() {
      var hiddenPosts, lastChecked, now;
      hiddenPosts = ReplyHiding.hiddenPosts;
      lastChecked = hiddenPosts.lastChecked;
      hiddenPosts.lastChecked = now = Date.now();
      if (lastChecked > now - $.DAY) {
        return;
      }
      if (!Object.keys(hiddenPosts.threads).length) {
        $.set("hiddenPosts." + g.BOARD, hiddenPosts);
        return;
      }
      return $.ajax("//api.4chan.org/" + g.BOARD + "/catalog.json", {
        onload: function() {
          var obj, thread, threads, _i, _j, _len, _len1, _ref, _ref1;
          threads = {};
          _ref = JSON.parse(this.response);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            obj = _ref[_i];
            _ref1 = obj.threads;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              thread = _ref1[_j];
              if (thread.no in hiddenPosts.threads) {
                threads[thread.no] = hiddenPosts.threads[thread.no];
              }
            }
          }
          hiddenPosts.threads = threads;
          return $.set("hiddenPosts." + g.BOARD, hiddenPosts);
        }
      });
    },
    menu: {
      init: function() {
        var apply, div, makeStub, replies, thisPost;
        if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Reply Hiding']) {
          return;
        }
        div = $.el('div', {
          className: 'hide-reply-link',
          textContent: 'Hide reply'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', ReplyHiding.menu.hide);
        thisPost = $.el('label', {
          innerHTML: '<input type=checkbox name=thisPost checked=true> This post'
        });
        replies = $.el('label', {
          innerHTML: "<input type=checkbox name=replies  checked=" + Conf['Recursive Hiding'] + "> Hide replies"
        });
        makeStub = $.el('label', {
          innerHTML: "<input type=checkbox name=makeStub checked=" + Conf['Stubs'] + "> Make stub"
        });
        return $.event('AddMenuEntry', {
          type: 'post',
          el: div,
          open: function(post) {
            if (!post.isReply || post.isClone) {
              return false;
            }
            ReplyHiding.menu.post = post;
            return true;
          },
          subEntries: [
            {
              el: apply
            }, {
              el: thisPost
            }, {
              el: replies
            }, {
              el: makeStub
            }
          ]
        });
      },
      hide: function() {
        var makeStub, parent, post, replies, thisPost;
        parent = this.parentNode;
        thisPost = $('input[name=thisPost]', parent).checked;
        replies = $('input[name=replies]', parent).checked;
        makeStub = $('input[name=makeStub]', parent).checked;
        post = ReplyHiding.menu.post;
        if (thisPost) {
          ReplyHiding.hide(post, makeStub, replies);
        } else if (replies) {
          Recursive.hide(post, makeStub);
        } else {
          return;
        }
        ReplyHiding.saveHiddenState(post, true, thisPost, makeStub, replies);
        return Menu.close();
      }
    },
    makeButton: function(post, type) {
      var a;
      a = $.el('a', {
        className: "" + type + "-reply-button",
        innerHTML: "<span>[&nbsp;" + (type === 'hide' ? '-' : '+') + "&nbsp;]</span>",
        href: 'javascript:;'
      });
      $.on(a, 'click', function() {
        return ReplyHiding.toggle(post);
      });
      return a;
    },
    saveHiddenState: function(post, isHiding, thisPost, makeStub, hideRecursively) {
      var hiddenPosts, thread;
      hiddenPosts = ReplyHiding.getHiddenPosts();
      if (isHiding) {
        if (!(thread = hiddenPosts.threads[post.thread])) {
          thread = hiddenPosts.threads[post.thread] = {};
        }
        thread[post] = {
          thisPost: thisPost !== false,
          makeStub: makeStub,
          hideRecursively: hideRecursively
        };
      } else {
        thread = hiddenPosts.threads[post.thread];
        delete thread[post];
        if (!Object.keys(thread).length) {
          delete hiddenPosts.threads[post.thread];
        }
      }
      return $.set("hiddenPosts." + g.BOARD, hiddenPosts);
    },
    toggle: function(post) {
      if (post.isHidden) {
        ReplyHiding.show(post);
      } else {
        ReplyHiding.hide(post);
      }
      return ReplyHiding.saveHiddenState(post, post.isHidden);
    },
    hide: function(post, makeStub, hideRecursively) {
      var a, postInfo, quotelink, _i, _len, _ref;
      if (makeStub == null) {
        makeStub = Conf['Stubs'];
      }
      if (hideRecursively == null) {
        hideRecursively = Conf['Recursive Hiding'];
      }
      if (post.isHidden) {
        return;
      }
      post.isHidden = true;
      if (hideRecursively) {
        Recursive.hide(post, makeStub, true);
      }
      _ref = Get.allQuotelinksLinkingTo(post);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        $.addClass(quotelink, 'filtered');
      }
      if (!makeStub) {
        post.nodes.root.hidden = true;
        return;
      }
      a = ReplyHiding.makeButton(post, 'show');
      postInfo = Conf['Anonymize'] ? 'Anonymous' : $('.nameBlock', post.nodes.info).textContent;
      $.add(a, $.tn(" " + postInfo));
      post.nodes.stub = $.el('div', {
        className: 'stub'
      });
      $.add(post.nodes.stub, a);
      if (Conf['Menu']) {
        $.add(post.nodes.stub, [$.tn(' '), Menu.makeButton(post)]);
      }
      return $.prepend(post.nodes.root, post.nodes.stub);
    },
    show: function(post) {
      var quotelink, _i, _len, _ref;
      if (post.nodes.stub) {
        $.rm(post.nodes.stub);
        delete post.nodes.stub;
      } else {
        post.nodes.root.hidden = false;
      }
      post.isHidden = false;
      _ref = Get.allQuotelinksLinkingTo(post);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        $.rmClass(quotelink, 'filtered');
      }
    }
  };

  Recursive = {
    toHide: [],
    init: function() {
      return Post.prototype.callbacks.push({
        name: 'Recursive',
        cb: this.node
      });
    },
    node: function() {
      var board, postID, quote, quotelink, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
      if (this.isClone) {
        return;
      }
      _ref = this.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (__indexOf.call(Recursive.toHide, quote) >= 0) {
          ReplyHiding.hide(this, !!g.posts[quote].nodes.stub, true);
        }
      }
      _ref1 = this.nodes.quotelinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quotelink = _ref1[_j];
        _ref2 = Get.postDataFromLink(quotelink), board = _ref2.board, postID = _ref2.postID;
        if ((_ref3 = g.posts["" + board + "." + postID]) != null ? _ref3.isHidden : void 0) {
          $.addClass(quotelink, 'filtered');
        }
      }
    },
    hide: function(post, makeStub) {
      var ID, fullID, quote, _i, _len, _ref, _ref1;
      fullID = post.fullID;
      Recursive.toHide.push(fullID);
      _ref = g.posts;
      for (ID in _ref) {
        post = _ref[ID];
        if (!post.isReply) {
          continue;
        }
        _ref1 = post.quotes;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          quote = _ref1[_i];
          if (quote === fullID) {
            ReplyHiding.hide(post, makeStub, true);
            break;
          }
        }
      }
    }
  };

  Menu = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Menu']) {
        return;
      }
      this.menu = new UI.Menu('post');
      return Post.prototype.callbacks.push({
        name: 'Menu',
        cb: this.node
      });
    },
    node: function() {
      var button;
      button = Menu.makeButton(this);
      if (this.isClone) {
        $.replace($('.menu-button', this.nodes.info), button);
        return;
      }
      return $.add(this.nodes.info, [$.tn('\u00A0'), button]);
    },
    makeButton: function(post) {
      var a;
      a = $.el('a', {
        className: 'menu-button',
        innerHTML: '[<span></span>]',
        href: 'javascript:;'
      });
      a.setAttribute('data-postid', post.fullID);
      if (post.isClone) {
        a.setAttribute('data-clone', true);
      }
      $.on(a, 'click', Menu.toggle);
      return a;
    },
    toggle: function(e) {
      var post;
      post = this.dataset.clone ? Get.postFromRoot($.x('ancestor::div[contains(@class,"postContainer")][1]', this)) : g.posts[this.dataset.postid];
      return Menu.menu.toggle(e, this, post);
    }
  };

  ReportLink = {
    init: function() {
      var a;
      if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Report Link']) {
        return;
      }
      a = $.el('a', {
        className: 'report-link',
        href: 'javascript:;',
        textContent: 'Report this post'
      });
      $.on(a, 'click', ReportLink.report);
      return $.event('AddMenuEntry', {
        type: 'post',
        el: a,
        open: function(post) {
          ReportLink.post = post;
          return !post.isDead;
        }
      });
    },
    report: function() {
      var id, post, set, url;
      post = ReportLink.post;
      url = "//sys.4chan.org/" + post.board + "/imgboard.php?mode=report&no=" + post;
      id = Date.now();
      set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200";
      return window.open(url, id, set);
    }
  };

  DeleteLink = {
    init: function() {
      var div, fileEl, fileEntry, postEl, postEntry;
      if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Delete Link']) {
        return;
      }
      div = $.el('div', {
        className: 'delete-link',
        textContent: 'Delete'
      });
      postEl = $.el('a', {
        className: 'delete-post',
        href: 'javascript:;'
      });
      fileEl = $.el('a', {
        className: 'delete-file',
        href: 'javascript:;'
      });
      postEntry = {
        el: postEl,
        open: function() {
          postEl.textContent = 'Post';
          $.on(postEl, 'click', DeleteLink["delete"]);
          return true;
        }
      };
      fileEntry = {
        el: fileEl,
        open: function(_arg) {
          var file;
          file = _arg.file;
          fileEl.textContent = 'File';
          $.on(fileEl, 'click', DeleteLink["delete"]);
          return !!file;
        }
      };
      $.event('AddMenuEntry', {
        type: 'post',
        el: div,
        open: function(post) {
          var node, seconds;
          if (post.isDead) {
            return false;
          }
          DeleteLink.post = post;
          node = div.firstChild;
          if (seconds = DeleteLink.cooldown[post.fullID]) {
            node.textContent = "Delete (" + seconds + ")";
            DeleteLink.cooldown.el = node;
          } else {
            node.textContent = 'Delete';
            delete DeleteLink.cooldown.el;
          }
          return true;
        },
        subEntries: [postEntry, fileEntry]
      });
      return $.on(d, 'QRPostSuccessful', this.cooldown.start);
    },
    "delete": function() {
      var form, link, m, post, pwd;
      post = DeleteLink.post;
      if (DeleteLink.cooldown[post.fullID]) {
        return;
      }
      $.off(this, 'click', DeleteLink["delete"]);
      this.textContent = "Deleting " + this.textContent + "...";
      pwd = (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $.id('delPassword').value;
      form = {
        mode: 'usrdel',
        onlyimgdel: $.hasClass(this, 'delete-file'),
        pwd: pwd
      };
      form[post.ID] = 'delete';
      link = this;
      return $.ajax($.id('delform').action.replace("/" + g.BOARD + "/", "/" + post.board + "/"), {
        onload: function() {
          return DeleteLink.load(link, this.response);
        },
        onerror: function() {
          return DeleteLink.error(link);
        }
      }, {
        form: $.formData(form)
      });
    },
    load: function(link, html) {
      var msg, s, tmpDoc;
      tmpDoc = d.implementation.createHTMLDocument('');
      tmpDoc.documentElement.innerHTML = html;
      if (tmpDoc.title === '4chan - Banned') {
        s = 'Banned!';
      } else if (msg = tmpDoc.getElementById('errmsg')) {
        s = msg.textContent;
        $.on(link, 'click', DeleteLink["delete"]);
      } else {
        s = 'Deleted';
      }
      return link.textContent = s;
    },
    error: function(link) {
      link.textContent = 'Connection error, please retry.';
      return $.on(link, 'click', DeleteLink["delete"]);
    },
    cooldown: {
      start: function(e) {
        var fullID, seconds;
        seconds = g.BOARD.ID === 'q' ? 600 : 30;
        fullID = "" + g.BOARD + "." + e.detail.postID;
        return DeleteLink.cooldown.count(fullID, seconds, seconds);
      },
      count: function(fullID, seconds, length) {
        var el;
        if (!((0 <= seconds && seconds <= length))) {
          return;
        }
        setTimeout(DeleteLink.cooldown.count, 1000, fullID, seconds - 1, length);
        el = DeleteLink.cooldown.el;
        if (seconds === 0) {
          if (el != null) {
            el.textContent = 'Delete';
          }
          delete DeleteLink.cooldown[fullID];
          delete DeleteLink.cooldown.el;
          return;
        }
        if (el != null) {
          el.textContent = "Delete (" + seconds + ")";
        }
        return DeleteLink.cooldown[fullID] = seconds;
      }
    }
  };

  DownloadLink = {
    init: function() {
      var a;
      if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Download Link']) {
        return;
      }
      if ($.el('a').download === void 0) {
        return;
      }
      a = $.el('a', {
        className: 'download-link',
        textContent: 'Download file'
      });
      return $.event('AddMenuEntry', {
        type: 'post',
        el: a,
        open: function(_arg) {
          var file;
          file = _arg.file;
          if (!file) {
            return false;
          }
          a.href = file.URL;
          a.download = file.name;
          return true;
        }
      });
    }
  };

  ArchiveLink = {
    init: function() {
      var div, entry, type, _i, _len, _ref;
      if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Archive Link']) {
        return;
      }
      div = $.el('div', {
        textContent: 'Archive'
      });
      entry = {
        type: 'post',
        el: div,
        open: function(_arg) {
          var board, postID, redirect, threadID;
          postID = _arg.ID, threadID = _arg.thread, board = _arg.board;
          redirect = Redirect.to({
            postID: postID,
            threadID: threadID,
            board: board
          });
          return redirect !== ("//boards.4chan.org/" + board + "/");
        },
        subEntries: []
      };
      _ref = [['Post', 'post'], ['Name', 'name'], ['Tripcode', 'tripcode'], ['E-mail', 'email'], ['Subject', 'subject'], ['Filename', 'filename'], ['Image MD5', 'MD5']];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        entry.subEntries.push(this.createSubEntry(type[0], type[1]));
      }
      return $.event('AddMenuEntry', entry);
    },
    createSubEntry: function(text, type) {
      var el, open;
      el = $.el('a', {
        textContent: text,
        target: '_blank'
      });
      if (type === 'post') {
        open = function(_arg) {
          var board, postID, threadID;
          postID = _arg.ID, threadID = _arg.thread, board = _arg.board;
          el.href = Redirect.to({
            postID: postID,
            threadID: threadID,
            board: board
          });
          return true;
        };
      } else {
        open = function(post) {
          var value;
          value = Filter[type](post);
          if (!value) {
            return false;
          }
          el.href = Redirect.to({
            board: post.board,
            type: type,
            value: value,
            isSearch: true
          });
          return true;
        };
      }
      return {
        el: el,
        open: open
      };
    }
  };

  Redirect = {
    image: function(board, filename) {
      switch ("" + board) {
        case 'a':
        case 'co':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'tv':
        case 'v':
        case 'vg':
        case 'wsg':
          return "//archive.foolz.us/" + board + "/full_image/" + filename;
        case 'u':
          return "//nsfw.foolz.us/" + board + "/full_image/" + filename;
        case 'po':
          return "http://archive.thedarkcave.org/" + board + "/full_image/" + filename;
        case 'ck':
        case 'lit':
          return "//fuuka.warosu.org/" + board + "/full_image/" + filename;
        case 'diy':
        case 'sci':
          return "//archive.installgentoo.net/" + board + "/full_image/" + filename;
        case 'cgl':
        case 'g':
        case 'mu':
        case 'w':
          return "//rbt.asia/" + board + "/full_image/" + filename;
        case 'an':
        case 'fit':
        case 'k':
        case 'mlp':
        case 'r9k':
        case 'toy':
        case 'x':
          return "http://archive.heinessen.com/" + board + "/full_image/" + filename;
        case 'c':
          return "//archive.nyafuu.org/" + board + "/full_image/" + filename;
      }
    },
    post: function(board, postID) {
      switch ("" + board) {
        case 'a':
        case 'co':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'tv':
        case 'v':
        case 'vg':
        case 'wsg':
        case 'dev':
        case 'foolz':
          return "//archive.foolz.us/_/api/chan/post/?board=" + board + "&num=" + postID;
        case 'u':
        case 'kuku':
          return "//nsfw.foolz.us/_/api/chan/post/?board=" + board + "&num=" + postID;
        case 'po':
          return "http://archive.thedarkcave.org/_/api/chan/post/?board=" + board + "&num=" + postID;
      }
    },
    to: function(data) {
      var board, url;
      board = data.board;
      switch ("" + board) {
        case 'a':
        case 'co':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'tv':
        case 'v':
        case 'vg':
        case 'wsg':
        case 'dev':
        case 'foolz':
          url = Redirect.path('//archive.foolz.us', 'foolfuuka', data);
          break;
        case 'u':
        case 'kuku':
          url = Redirect.path('//nsfw.foolz.us', 'foolfuuka', data);
          break;
        case 'po':
          url = Redirect.path('http://archive.thedarkcave.org', 'foolfuuka', data);
          break;
        case 'ck':
        case 'lit':
          url = Redirect.path('//fuuka.warosu.org', 'fuuka', data);
          break;
        case 'diy':
        case 'sci':
          url = Redirect.path('//archive.installgentoo.net', 'fuuka', data);
          break;
        case 'cgl':
        case 'g':
        case 'mu':
        case 'w':
          url = Redirect.path('//rbt.asia', 'fuuka', data);
          break;
        case 'an':
        case 'fit':
        case 'k':
        case 'mlp':
        case 'r9k':
        case 'toy':
        case 'x':
          url = Redirect.path('http://archive.heinessen.com', 'fuuka', data);
          break;
        case 'c':
          url = Redirect.path('//archive.nyafuu.org', 'fuuka', data);
          break;
        default:
          if (data.threadID) {
            url = "//boards.4chan.org/" + board + "/";
          }
      }
      return url || '';
    },
    path: function(base, archiver, data) {
      var board, path, postID, threadID, type, value;
      if (data.isSearch) {
        board = data.board, type = data.type, value = data.value;
        type = type === 'name' ? 'username' : type === 'MD5' ? 'image' : type;
        value = encodeURIComponent(value);
        if (archiver === 'foolfuuka') {
          return "" + base + "/" + board + "/search/" + type + "/" + value;
        } else if (type === 'image') {
          return "" + base + "/" + board + "/?task=search2&search_media_hash=" + value;
        } else {
          return "" + base + "/" + board + "/?task=search2&search_" + type + "=" + value;
        }
      }
      board = data.board, threadID = data.threadID, postID = data.postID;
      if (postID && typeof postID === 'string') {
        postID = postID.match(/\d+/)[0];
      }
      path = threadID ? "" + board + "/thread/" + threadID : "" + board + "/post/" + postID;
      if (archiver === 'foolfuuka') {
        path += '/';
      }
      if (threadID && postID) {
        path += archiver === 'foolfuuka' ? "#" + postID : "#p" + postID;
      }
      return "" + base + "/" + path;
    }
  };

  Build = {
    spoilerRange: {},
    shortFilename: function(filename, isReply) {
      var threshold;
      threshold = isReply ? 30 : 40;
      if (filename.length - 4 > threshold) {
        return "" + filename.slice(0, threshold - 5) + "(...)." + filename.slice(-3);
      } else {
        return filename;
      }
    },
    postFromObject: function(data, board) {
      var o;
      o = {
        postID: data.no,
        threadID: data.resto || data.no,
        board: board,
        name: data.name,
        capcode: data.capcode,
        tripcode: data.trip,
        uniqueID: data.id,
        email: data.email ? encodeURI(data.email.replace(/&quot;/g, '"')) : '',
        subject: data.sub,
        flagCode: data.country,
        flagName: data.country_name,
        date: data.now,
        dateUTC: data.time,
        comment: data.com,
        isSticky: !!data.sticky,
        isClosed: !!data.closed
      };
      if (data.ext || data.filedeleted) {
        o.file = {
          name: data.filename + data.ext,
          timestamp: "" + data.tim + data.ext,
          url: "//images.4chan.org/" + board + "/src/" + data.tim + data.ext,
          height: data.h,
          width: data.w,
          MD5: data.md5,
          size: data.fsize,
          turl: "//thumbs.4chan.org/" + board + "/thumb/" + data.tim + "s.jpg",
          theight: data.tn_h,
          twidth: data.tn_w,
          isSpoiler: !!data.spoiler,
          isDeleted: !!data.filedeleted
        };
      }
      return Build.post(o);
    },
    post: function(o, isArchived) {
      /*
          This function contains code from 4chan-JS (https://github.com/4chan/4chan-JS).
          @license: https://github.com/4chan/4chan-JS/blob/master/LICENSE
      */

      var a, board, capcode, capcodeClass, capcodeStart, closed, comment, container, date, dateUTC, email, emailEnd, emailStart, ext, file, fileDims, fileHTML, fileInfo, fileSize, fileThumb, filename, flag, flagCode, flagName, href, imgSrc, isClosed, isOP, isSticky, name, postID, quote, shortFilename, spoilerRange, staticPath, sticky, subject, threadID, tripcode, uniqueID, userID, _i, _len, _ref;
      postID = o.postID, threadID = o.threadID, board = o.board, name = o.name, capcode = o.capcode, tripcode = o.tripcode, uniqueID = o.uniqueID, email = o.email, subject = o.subject, flagCode = o.flagCode, flagName = o.flagName, date = o.date, dateUTC = o.dateUTC, isSticky = o.isSticky, isClosed = o.isClosed, comment = o.comment, file = o.file;
      isOP = postID === threadID;
      staticPath = '//static.4chan.org';
      if (email) {
        emailStart = '<a href="mailto:' + email + '" class="useremail">';
        emailEnd = '</a>';
      } else {
        emailStart = '';
        emailEnd = '';
      }
      subject = subject ? "<span class=subject>" + subject + "</span>" : '';
      userID = !capcode && uniqueID ? (" <span class='posteruid id_" + uniqueID + "'>(ID: ") + ("<span class=hand title='Highlight posts by this ID'>" + uniqueID + "</span>)</span> ") : '';
      switch (capcode) {
        case 'admin':
        case 'admin_highlight':
          capcodeClass = " capcodeAdmin";
          capcodeStart = " <strong class='capcode hand id_admin'" + "title='Highlight posts by the Administrator'>## Admin</strong>";
          capcode = (" <img src='" + staticPath + "/image/adminicon.gif' ") + "alt='This user is the 4chan Administrator.' " + "title='This user is the 4chan Administrator.' class=identityIcon>";
          break;
        case 'mod':
          capcodeClass = " capcodeMod";
          capcodeStart = " <strong class='capcode hand id_mod' " + "title='Highlight posts by Moderators'>## Mod</strong>";
          capcode = (" <img src='" + staticPath + "/image/modicon.gif' ") + "alt='This user is a 4chan Moderator.' " + "title='This user is a 4chan Moderator.' class=identityIcon>";
          break;
        case 'developer':
          capcodeClass = " capcodeDeveloper";
          capcodeStart = " <strong class='capcode hand id_developer' " + "title='Highlight posts by Developers'>## Developer</strong>";
          capcode = (" <img src='" + staticPath + "/image/developericon.gif' ") + "alt='This user is a 4chan Developer.' " + "title='This user is a 4chan Developer.' class=identityIcon>";
          break;
        default:
          capcodeClass = '';
          capcodeStart = '';
          capcode = '';
      }
      flag = flagCode ? (" <img src='" + staticPath + "/image/country/" + (board === 'pol' ? 'troll/' : '')) + flagCode.toLowerCase() + (".gif' alt=" + flagCode + " title='" + flagName + "' class=countryFlag>") : '';
      if (file != null ? file.isDeleted : void 0) {
        fileHTML = isOP ? ("<div id=f" + postID + " class=file><div class=fileInfo></div><span class=fileThumb>") + ("<img src='" + staticPath + "/image/filedeleted.gif' alt='File deleted.' class='fileDeleted retina'>") + "</span></div>" : ("<div id=f" + postID + " class=file><span class=fileThumb>") + ("<img src='" + staticPath + "/image/filedeleted-res.gif' alt='File deleted.' class='fileDeletedRes retina'>") + "</span></div>";
      } else if (file) {
        ext = file.name.slice(-3);
        if (!file.twidth && !file.theight && ext === 'gif') {
          file.twidth = file.width;
          file.theight = file.height;
        }
        fileSize = $.bytesToString(file.size);
        fileThumb = file.turl;
        if (file.isSpoiler) {
          fileSize = "Spoiler Image, " + fileSize;
          if (!isArchived) {
            fileThumb = '//static.4chan.org/image/spoiler';
            if (spoilerRange = Build.spoilerRange[board]) {
              fileThumb += ("-" + board) + Math.floor(1 + spoilerRange * Math.random());
            }
            fileThumb += '.png';
            file.twidth = file.theight = 100;
          }
        }
        imgSrc = ("<a class='fileThumb" + (file.isSpoiler ? ' imgspoiler' : '') + "' href='" + file.url + "' target=_blank>") + ("<img src='" + fileThumb + "' alt='" + fileSize + "' data-md5=" + file.MD5 + " style='width:" + file.twidth + "px;height:" + file.theight + "px'></a>");
        a = $.el('a', {
          innerHTML: file.name
        });
        filename = a.textContent.replace(/%22/g, '"');
        a.textContent = Build.shortFilename(filename);
        shortFilename = a.innerHTML;
        a.textContent = filename;
        filename = a.innerHTML.replace(/'/g, '&apos;');
        fileDims = ext === 'pdf' ? 'PDF' : "" + file.width + "x" + file.height;
        fileInfo = ("<span class=fileText id=fT" + postID + (file.isSpoiler ? " title='" + filename + "'" : '') + ">File: <a href='" + file.url + "' target=_blank>" + file.timestamp + "</a>") + ("-(" + fileSize + ", " + fileDims + (file.isSpoiler ? '' : ", <span title='" + filename + "'>" + shortFilename + "</span>")) + ")</span>";
        fileHTML = "<div id=f" + postID + " class=file><div class=fileInfo>" + fileInfo + "</div>" + imgSrc + "</div>";
      } else {
        fileHTML = '';
      }
      tripcode = tripcode ? " <span class=postertrip>" + tripcode + "</span>" : '';
      sticky = isSticky ? ' <img src=//static.4chan.org/image/sticky.gif alt=Sticky title=Sticky style="height:16px;width:16px">' : '';
      closed = isClosed ? ' <img src=//static.4chan.org/image/closed.gif alt=Closed title=Closed style="height:16px;width:16px">' : '';
      container = $.el('div', {
        id: "pc" + postID,
        className: "postContainer " + (isOP ? 'op' : 'reply') + "Container",
        innerHTML: (isOP ? '' : "<div class=sideArrows id=sa" + postID + ">&gt;&gt;</div>") + ("<div id=p" + postID + " class='post " + (isOP ? 'op' : 'reply') + (capcode === 'admin_highlight' ? ' highlightPost' : '') + "'>") + ("<div class='postInfoM mobile' id=pim" + postID + ">") + ("<span class='nameBlock" + capcodeClass + "'>") + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + capcode + userID + flag + sticky + closed + ("<br>" + subject) + ("</span><span class='dateTime postNum' data-utc=" + dateUTC + ">" + date) + '<br><em>' + ("<a href=" + ("/" + board + "/res/" + threadID + "#p" + postID) + ">No.</a>") + ("<a href='" + (g.VIEW === 'thread' && g.THREAD === threadID ? "javascript:quote(" + postID + ")" : "/" + board + "/res/" + threadID + "#q" + postID) + "'>" + postID + "</a>") + '</em></span>' + '</div>' + (isOP ? fileHTML : '') + ("<div class='postInfo desktop' id=pi" + postID + ">") + ("<input type=checkbox name=" + postID + " value=delete> ") + ("" + subject + " ") + ("<span class='nameBlock" + capcodeClass + "'>") + emailStart + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + emailEnd + capcode + userID + flag + sticky + closed + ' </span> ' + ("<span class=dateTime data-utc=" + dateUTC + ">" + date + "</span> ") + "<span class='postNum desktop'>" + ("<a href=" + ("/" + board + "/res/" + threadID + "#p" + postID) + " title='Highlight this post'>No.</a>") + ("<a href='" + (g.VIEW === 'thread' && g.THREAD === threadID ? "javascript:quote(" + postID + ")" : "/" + board + "/res/" + threadID + "#q" + postID) + "' title='Quote this post'>" + postID + "</a>") + '</span>' + '</div>' + (isOP ? '' : fileHTML) + ("<blockquote class=postMessage id=m" + postID + ">" + (comment || '') + "</blockquote> ") + '</div>'
      });
      _ref = $$('.quotelink', container);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "/" + board + "/res/" + href;
      }
      return container;
    }
  };

  Get = {
    postFromRoot: function(root) {
      var board, index, link, post, postID;
      link = $('a[title="Highlight this post"]', root);
      board = link.pathname.split('/')[1];
      postID = link.hash.slice(2);
      index = root.dataset.clone;
      post = g.posts["" + board + "." + postID];
      if (index) {
        return post.clones[index];
      } else {
        return post;
      }
    },
    postDataFromLink: function(link) {
      var board, path, postID, threadID;
      if (link.hostname === 'boards.4chan.org') {
        path = link.pathname.split('/');
        board = path[1];
        threadID = path[3];
        postID = link.hash.slice(2);
      } else {
        board = link.dataset.board;
        threadID = link.dataset.threadid || 0;
        postID = link.dataset.postid;
      }
      return {
        board: board,
        threadID: +threadID,
        postID: +postID
      };
    },
    allQuotelinksLinkingTo: function(post) {
      var ID, quote, quotedPost, quotelinks, quoterPost, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
      quotelinks = [];
      _ref = g.posts;
      for (ID in _ref) {
        quoterPost = _ref[ID];
        if (-1 !== quoterPost.quotes.indexOf(post.fullID)) {
          _ref1 = [quoterPost].concat(quoterPost.clones);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            quoterPost = _ref1[_i];
            quotelinks.push.apply(quotelinks, quoterPost.nodes.quotelinks);
          }
        }
      }
      if (Conf['Quote Backlinks']) {
        _ref2 = post.quotes;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          quote = _ref2[_j];
          if (!(quotedPost = g.posts[quote])) {
            continue;
          }
          _ref3 = [quotedPost].concat(quotedPost.clones);
          for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            quotedPost = _ref3[_k];
            quotelinks.push.apply(quotelinks, Array.prototype.slice.call(quotedPost.nodes.backlinks));
          }
        }
      }
      return quotelinks.filter(function(quotelink) {
        var board, postID, _ref4;
        _ref4 = Get.postDataFromLink(quotelink), board = _ref4.board, postID = _ref4.postID;
        return board === post.board.ID && postID === post.ID;
      });
    },
    contextFromLink: function(quotelink) {
      return Get.postFromRoot($.x('ancestor::div[parent::div[@class="thread"]][1]', quotelink));
    },
    postClone: function(board, threadID, postID, root, context) {
      var post, url;
      if (post = g.posts["" + board + "." + postID]) {
        Get.insert(post, root, context);
        return;
      }
      root.textContent = "Loading post No." + postID + "...";
      if (threadID) {
        return $.cache("//api.4chan.org/" + board + "/res/" + threadID + ".json", function() {
          return Get.fetchedPost(this, board, threadID, postID, root, context);
        });
      } else if (url = Redirect.post(board, postID)) {
        return $.cache(url, function() {
          return Get.archivedPost(this, board, postID, root, context);
        });
      }
    },
    insert: function(post, root, context) {
      var clone, nodes;
      if (!root.parentNode) {
        return;
      }
      clone = post.addClone(context);
      Main.callbackNodes(Post, [clone]);
      nodes = clone.nodes;
      nodes.root.innerHTML = null;
      $.add(nodes.root, nodes.post);
      root.innerHTML = null;
      return $.add(root, nodes.root);
    },
    fetchedPost: function(req, board, threadID, postID, root, context) {
      var post, posts, status, thread, url, _i, _len;
      if (post = g.posts["" + board + "." + postID]) {
        Get.insert(post, root, context);
        return;
      }
      status = req.status;
      if (status !== 200) {
        if (url = Redirect.post(board, postID)) {
          $.cache(url, function() {
            return Get.archivedPost(this, board, postID, root, context);
          });
        } else {
          $.addClass(root, 'warning');
          root.textContent = status === 404 ? "Thread No." + threadID + " 404'd." : "Error " + req.status + ": " + req.statusText + ".";
        }
        return;
      }
      posts = JSON.parse(req.response).posts;
      Build.spoilerRange[board] = posts[0].custom_spoiler;
      for (_i = 0, _len = posts.length; _i < _len; _i++) {
        post = posts[_i];
        if (post.no === postID) {
          break;
        }
        if (post.no > postID) {
          if (url = Redirect.post(board, postID)) {
            $.cache(url, function() {
              return Get.archivedPost(this, board, postID, root, context);
            });
          } else {
            $.addClass(root, 'warning');
            root.textContent = "Post No." + postID + " was not found.";
          }
          return;
        }
      }
      board = g.boards[board] || new Board(board);
      thread = g.threads["" + board + "." + threadID] || new Thread(threadID, board);
      post = new Post(Build.postFromObject(post, board), thread, board);
      Main.callbackNodes(Post, [post]);
      return Get.insert(post, root, context);
    },
    archivedPost: function(req, board, postID, root, context) {
      var bq, comment, data, o, post, thread, threadID, _ref;
      if (post = g.posts["" + board + "." + postID]) {
        Get.insert(post, root, context);
        return;
      }
      data = JSON.parse(req.response);
      if (data.error) {
        $.addClass(root, 'warning');
        root.textContent = data.error;
        return;
      }
      bq = $.el('blockquote', {
        textContent: data.comment
      });
      bq.innerHTML = bq.innerHTML.replace(/\n|\[\/?b\]|\[\/?spoiler\]|\[\/?code\]|\[\/?moot\]|\[\/?banned\]/g, function(text) {
        switch (text) {
          case '\n':
            return '<br>';
          case '[b]':
            return '<b>';
          case '[/b]':
            return '</b>';
          case '[spoiler]':
            return '<span class=spoiler>';
          case '[/spoiler]':
            return '</span>';
          case '[code]':
            return '<pre class=prettyprint>';
          case '[/code]':
            return '</pre>';
          case '[moot]':
            return '<div style="padding:5px;margin-left:.5em;border-color:#faa;border:2px dashed rgba(255,0,0,.1);border-radius:2px">';
          case '[/moot]':
            return '</div>';
          case '[banned]':
            return '<b style="color: red;">';
          case '[/banned]':
            return '</b>';
        }
      });
      comment = bq.innerHTML.replace(/(^|>)(&gt;[^<$]*)(<|$)/g, '$1<span class=quote>$2</span>$3').replace(/((&gt;){2}(&gt;\/[a-z\d]+\/)?\d+)/g, '<span class=deadlink>$1</span>');
      threadID = data.thread_num;
      o = {
        postID: "" + postID,
        threadID: "" + threadID,
        board: board,
        name: data.name_processed,
        capcode: (function() {
          switch (data.capcode) {
            case 'M':
              return 'mod';
            case 'A':
              return 'admin';
            case 'D':
              return 'developer';
          }
        })(),
        tripcode: data.trip,
        uniqueID: data.poster_hash,
        email: data.email ? encodeURI(data.email) : '',
        subject: data.title_processed,
        flagCode: data.poster_country,
        flagName: data.poster_country_name_processed,
        date: data.fourchan_date,
        dateUTC: data.timestamp,
        comment: comment
      };
      if ((_ref = data.media) != null ? _ref.media_filename : void 0) {
        o.file = {
          name: data.media.media_filename_processed,
          timestamp: data.media.media_orig,
          url: data.media.media_link || data.media.remote_media_link,
          height: data.media.media_h,
          width: data.media.media_w,
          MD5: data.media.media_hash,
          size: data.media.media_size,
          turl: data.media.thumb_link || ("//thumbs.4chan.org/" + board + "/thumb/" + data.media.preview_orig),
          theight: data.media.preview_h,
          twidth: data.media.preview_w,
          isSpoiler: data.media.spoiler === '1'
        };
      }
      board = g.boards[board] || new Board(board);
      thread = g.threads["" + board + "." + threadID] || new Thread(threadID, board);
      post = new Post(Build.post(o, true), thread, board, {
        isArchived: true
      });
      Main.callbackNodes(Post, [post]);
      return Get.insert(post, root, context);
    }
  };

  Quotify = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Resurrect Quotes']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Resurrect Quotes',
        cb: this.node
      });
    },
    node: function() {
      var ID, a, board, deadlink, m, post, quote, quoteID, redirect, _i, _len, _ref, _ref1;
      if (this.isClone) {
        return;
      }
      _ref = $$('.deadlink', this.nodes.comment);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        deadlink = _ref[_i];
        if (deadlink.parentNode.className === 'prettyprint') {
          $.replace(deadlink, Array.prototype.slice.call(deadlink.childNodes));
          continue;
        }
        quote = deadlink.textContent;
        if (!(ID = (_ref1 = quote.match(/\d+$/)) != null ? _ref1[0] : void 0)) {
          continue;
        }
        board = (m = quote.match(/^>>>\/([a-z\d]+)/)) ? m[1] : this.board.ID;
        quoteID = "" + board + "." + ID;
        if (post = g.posts[quoteID]) {
          if (!post.isDead) {
            a = $.el('a', {
              href: "/" + board + "/" + post.thread + "/res/#p" + ID,
              className: 'quotelink',
              textContent: quote
            });
          } else if (redirect = Redirect.to({
            board: board,
            threadID: post.thread.ID,
            postID: ID
          })) {
            a = $.el('a', {
              href: redirect,
              className: 'quotelink deadlink',
              target: '_blank',
              textContent: "" + quote + "\u00A0(Dead)"
            });
            a.setAttribute('data-board', board);
            a.setAttribute('data-threadid', post.thread.ID);
            a.setAttribute('data-postid', ID);
          }
        } else if (redirect = Redirect.to({
          board: board,
          threadID: 0,
          postID: ID
        })) {
          a = $.el('a', {
            href: redirect,
            className: 'deadlink',
            target: '_blank',
            textContent: "" + quote + "\u00A0(Dead)"
          });
          if (Redirect.post(board, ID)) {
            $.addClass(a, 'quotelink');
            a.setAttribute('data-board', board);
            a.setAttribute('data-postid', ID);
          }
        }
        if (__indexOf.call(this.quotes, quoteID) < 0) {
          this.quotes.push(quoteID);
        }
        if (!a) {
          deadlink.textContent += "\u00A0(Dead)";
          continue;
        }
        $.replace(deadlink, a);
        if ($.hasClass(a, 'quotelink')) {
          this.nodes.quotelinks.push(a);
        }
      }
    }
  };

  QuoteInline = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Quote Inline']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Quote Inline',
        cb: this.node
      });
    },
    node: function() {
      var link, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.nodes.quotelinks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        $.on(link, 'click', QuoteInline.toggle);
      }
      _ref1 = this.nodes.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        link = _ref1[_j];
        $.on(link, 'click', QuoteInline.toggle);
      }
    },
    toggle: function(e) {
      var board, context, postID, threadID, _ref;
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      _ref = Get.postDataFromLink(this), board = _ref.board, threadID = _ref.threadID, postID = _ref.postID;
      context = Get.contextFromLink(this);
      if ($.hasClass(this, 'inlined')) {
        QuoteInline.rm(this, board, threadID, postID, context);
      } else {
        if ($.x("ancestor::div[@id='p" + postID + "']", this)) {
          return;
        }
        QuoteInline.add(this, board, threadID, postID, context);
      }
      return this.classList.toggle('inlined');
    },
    findRoot: function(quotelink, isBacklink) {
      if (isBacklink) {
        return quotelink.parentNode.parentNode;
      } else {
        return $.x('ancestor-or-self::*[parent::blockquote][1]', quotelink);
      }
    },
    add: function(quotelink, board, threadID, postID, context) {
      var inline, isBacklink, post;
      isBacklink = $.hasClass(quotelink, 'backlink');
      inline = $.el('div', {
        id: "i" + postID,
        className: 'inline'
      });
      $.after(QuoteInline.findRoot(quotelink, isBacklink), inline);
      Get.postClone(board, threadID, postID, inline, context);
      if (!((post = g.posts["" + board + "." + postID]) && context.thread === post.thread)) {
        return;
      }
      if (isBacklink && Conf['Forward Hiding']) {
        $.addClass(post.nodes.root, 'forwarded');
        return post.forwarded++ || (post.forwarded = 1);
      }
    },
    rm: function(quotelink, board, threadID, postID, context) {
      var el, inlined, isBacklink, post, root, _ref;
      isBacklink = $.hasClass(quotelink, 'backlink');
      root = QuoteInline.findRoot(quotelink, isBacklink);
      root = $.x("following-sibling::div[@id='i" + postID + "'][1]", root);
      $.rm(root);
      if (!(el = root.firstElementChild)) {
        return;
      }
      post = g.posts["" + board + "." + postID];
      post.rmClone(el.dataset.clone);
      if (Conf['Forward Hiding'] && isBacklink && context.thread === g.threads["" + board + "." + threadID] && !--post.forwarded) {
        delete post.forwarded;
        $.rmClass(post.nodes.root, 'forwarded');
      }
      while (inlined = $('.inlined', el)) {
        _ref = Get.postDataFromLink(inlined), board = _ref.board, threadID = _ref.threadID, postID = _ref.postID;
        QuoteInline.rm(inlined, board, threadID, postID, context);
        $.rmClass(inlined, 'inlined');
      }
    }
  };

  QuotePreview = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Quote Preview']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Quote Preview',
        cb: this.node
      });
    },
    node: function() {
      var link, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.nodes.quotelinks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        $.on(link, 'mouseover', QuotePreview.mouseover);
      }
      _ref1 = this.nodes.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        link = _ref1[_j];
        $.on(link, 'mouseover', QuotePreview.mouseover);
      }
    },
    mouseover: function(e) {
      var board, clone, origin, post, postID, posts, qp, quote, quoterID, threadID, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      if ($.hasClass(this, 'inlined')) {
        return;
      }
      _ref = Get.postDataFromLink(this), board = _ref.board, threadID = _ref.threadID, postID = _ref.postID;
      qp = $.el('div', {
        id: 'qp',
        className: 'reply dialog'
      });
      $.add(d.body, qp);
      Get.postClone(board, threadID, postID, qp, Get.contextFromLink(this));
      UI.hover(this, qp, 'mouseout click', QuotePreview.mouseout);
      if (!(origin = g.posts["" + board + "." + postID])) {
        return;
      }
      if (Conf['Quote Highlighting']) {
        posts = [origin].concat(origin.clones);
        posts.pop();
        for (_i = 0, _len = posts.length; _i < _len; _i++) {
          post = posts[_i];
          $.addClass(post.nodes.post, 'qphl');
        }
      }
      quoterID = $.x('ancestor::*[@id][1]', this).id.match(/\d+$/)[0];
      clone = Get.postFromRoot(qp.firstChild);
      _ref1 = clone.nodes.quotelinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
        if (quote.hash.slice(2) === quoterID) {
          $.addClass(quote, 'forwardlink');
        }
      }
      _ref2 = clone.nodes.backlinks;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        quote = _ref2[_k];
        if (quote.hash.slice(2) === quoterID) {
          $.addClass(quote, 'forwardlink');
        }
      }
    },
    mouseout: function() {
      var clone, post, root, _i, _len, _ref;
      if (!(root = this.el.firstElementChild)) {
        return;
      }
      clone = Get.postFromRoot(root);
      post = clone.origin;
      post.rmClone(root.dataset.clone);
      if (!Conf['Quote Highlighting']) {
        return;
      }
      _ref = [post].concat(post.clones);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        post = _ref[_i];
        $.rmClass(post.nodes.post, 'qphl');
      }
    }
  };

  QuoteBacklink = {
    init: function() {
      var format;
      if (g.VIEW === 'catalog' || !Conf['Quote Backlinks']) {
        return;
      }
      format = Conf['backlink'].replace(/%id/g, "' + id + '");
      this.funk = Function('id', "return '" + format + "'");
      this.containers = {};
      Post.prototype.callbacks.push({
        name: 'Quote Backlinking Part 1',
        cb: this.firstNode
      });
      return Post.prototype.callbacks.push({
        name: 'Quote Backlinking Part 2',
        cb: this.secondNode
      });
    },
    firstNode: function() {
      var a, clone, container, containers, link, post, quote, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      if (this.isClone || !this.quotes.length) {
        return;
      }
      a = $.el('a', {
        href: "/" + this.board + "/res/" + this.thread + "#p" + this,
        className: this.isHidden ? 'filtered backlink' : 'backlink',
        textContent: QuoteBacklink.funk(this.ID)
      });
      _ref = this.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        containers = [QuoteBacklink.getContainer(quote)];
        if (post = g.posts[quote]) {
          _ref1 = post.clones;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            clone = _ref1[_j];
            containers.push(clone.nodes.backlinkContainer);
          }
        }
        for (_k = 0, _len2 = containers.length; _k < _len2; _k++) {
          container = containers[_k];
          link = a.cloneNode(true);
          if (Conf['Quote Preview']) {
            $.on(link, 'mouseover', QuotePreview.mouseover);
          }
          if (Conf['Quote Inline']) {
            $.on(link, 'click', QuoteInline.toggle);
          }
          $.add(container, [$.tn(' '), link]);
        }
      }
    },
    secondNode: function() {
      var container;
      if (this.isClone && this.origin.nodes.backlinkContainer) {
        this.nodes.backlinkContainer = $('.container', this.nodes.info);
        return;
      }
      if (!(Conf['OP Backlinks'] || this.isReply)) {
        return;
      }
      container = QuoteBacklink.getContainer(this.fullID);
      this.nodes.backlinkContainer = container;
      return $.add(this.nodes.info, container);
    },
    getContainer: function(id) {
      var _base;
      return (_base = this.containers)[id] || (_base[id] = $.el('span', {
        className: 'container'
      }));
    }
  };

  QuoteOP = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Mark OP Quotes']) {
        return;
      }
      this.text = '\u00A0(OP)';
      return Post.prototype.callbacks.push({
        name: 'Mark OP Quotes',
        cb: this.node
      });
    },
    node: function() {
      var board, op, postID, quote, quotelinks, quotes, _i, _j, _len, _len1, _ref;
      if (this.isClone && this.thread === this.context.thread) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      if (this.isClone && -1 < quotes.indexOf(this.fullID)) {
        for (_i = 0, _len = quotelinks.length; _i < _len; _i++) {
          quote = quotelinks[_i];
          quote.textContent = quote.textContent.replace(QuoteOP.text, '');
        }
      }
      op = (this.isClone ? this.context : this).thread.fullID;
      if (!(-1 < quotes.indexOf(op))) {
        return;
      }
      for (_j = 0, _len1 = quotelinks.length; _j < _len1; _j++) {
        quote = quotelinks[_j];
        _ref = Get.postDataFromLink(quote), board = _ref.board, postID = _ref.postID;
        if (("" + board + "." + postID) === op) {
          $.add(quote, $.tn(QuoteOP.text));
        }
      }
    }
  };

  QuoteCT = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Mark Cross-thread Quotes']) {
        return;
      }
      this.text = '\u00A0(Cross-thread)';
      return Post.prototype.callbacks.push({
        name: 'Mark Cross-thread Quotes',
        cb: this.node
      });
    },
    node: function() {
      var board, data, quote, quotelinks, quotes, thread, _i, _len, _ref;
      if (this.isClone && this.thread === this.context.thread) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      _ref = this.isClone ? this.context : this, board = _ref.board, thread = _ref.thread;
      for (_i = 0, _len = quotelinks.length; _i < _len; _i++) {
        quote = quotelinks[_i];
        data = Get.postDataFromLink(quote);
        if (!data.threadID) {
          continue;
        }
        if (this.isClone) {
          quote.textContent = quote.textContent.replace(QuoteCT.text, '');
        }
        if (data.board === this.board.ID && data.threadID !== thread.ID) {
          $.add(quote, $.tn(QuoteCT.text));
        }
      }
    }
  };

  Anonymize = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Anonymize']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Anonymize',
        cb: this.node
      });
    },
    node: function() {
      var email, name, tripcode, _ref;
      if (this.info.capcode || this.isClone) {
        return;
      }
      _ref = this.nodes, name = _ref.name, tripcode = _ref.tripcode, email = _ref.email;
      if (this.info.name !== 'Anonymous') {
        name.textContent = 'Anonymous';
      }
      if (tripcode) {
        $.rm(tripcode);
        delete this.nodes.tripcode;
      }
      if (this.info.email) {
        if (/sage/i.test(this.info.email)) {
          return email.href = 'mailto:sage';
        } else {
          $.replace(email, name);
          return delete this.nodes.email;
        }
      }
    }
  };

  Time = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Time Formatting']) {
        return;
      }
      this.funk = this.createFunc(Conf['time']);
      return Post.prototype.callbacks.push({
        name: 'Time Formatting',
        cb: this.node
      });
    },
    node: function() {
      if (this.isClone) {
        return;
      }
      return this.nodes.date.textContent = Time.funk(Time, this.info.date);
    },
    createFunc: function(format) {
      var code;
      code = format.replace(/%([A-Za-z])/g, function(s, c) {
        if (c in Time.formatters) {
          return "' + Time.formatters." + c + ".call(date) + '";
        } else {
          return s;
        }
      });
      return Function('Time', 'date', "return '" + code + "'");
    },
    day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    zeroPad: function(n) {
      if (n < 10) {
        return "0" + n;
      } else {
        return n;
      }
    },
    formatters: {
      a: function() {
        return Time.day[this.getDay()].slice(0, 3);
      },
      A: function() {
        return Time.day[this.getDay()];
      },
      b: function() {
        return Time.month[this.getMonth()].slice(0, 3);
      },
      B: function() {
        return Time.month[this.getMonth()];
      },
      d: function() {
        return Time.zeroPad(this.getDate());
      },
      e: function() {
        return this.getDate();
      },
      H: function() {
        return Time.zeroPad(this.getHours());
      },
      I: function() {
        return Time.zeroPad(this.getHours() % 12 || 12);
      },
      k: function() {
        return this.getHours();
      },
      l: function() {
        return this.getHours() % 12 || 12;
      },
      m: function() {
        return Time.zeroPad(this.getMonth() + 1);
      },
      M: function() {
        return Time.zeroPad(this.getMinutes());
      },
      p: function() {
        if (this.getHours() < 12) {
          return 'AM';
        } else {
          return 'PM';
        }
      },
      P: function() {
        if (this.getHours() < 12) {
          return 'am';
        } else {
          return 'pm';
        }
      },
      S: function() {
        return Time.zeroPad(this.getSeconds());
      },
      y: function() {
        return this.getFullYear() - 2000;
      }
    }
  };

  FileInfo = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['File Info Formatting']) {
        return;
      }
      this.funk = this.createFunc(Conf['fileInfo']);
      return Post.prototype.callbacks.push({
        name: 'File Info Formatting',
        cb: this.node
      });
    },
    node: function() {
      if (!this.file || this.isClone) {
        return;
      }
      return this.file.text.innerHTML = FileInfo.funk(FileInfo, this);
    },
    createFunc: function(format) {
      var code;
      code = format.replace(/%(.)/g, function(s, c) {
        if (c in FileInfo.formatters) {
          return "' + FileInfo.formatters." + c + ".call(post) + '";
        } else {
          return s;
        }
      });
      return Function('FileInfo', 'post', "return '" + code + "'");
    },
    convertUnit: function(size, unit) {
      var i;
      if (unit === 'B') {
        return "" + (size.toFixed()) + " Bytes";
      }
      i = 1 + ['KB', 'MB'].indexOf(unit);
      while (i--) {
        size /= 1024;
      }
      size = unit === 'MB' ? Math.round(size * 100) / 100 : size.toFixed();
      return "" + size + " " + unit;
    },
    escape: function(name) {
      return name.replace(/<|>/g, function(c) {
        return c === '<' && '&lt;' || '&gt;';
      });
    },
    formatters: {
      t: function() {
        return this.file.URL.match(/\d+\..+$/)[0];
      },
      T: function() {
        return "<a href=" + FileInfo.data.link + " target=_blank>" + (FileInfo.formatters.t.call(this)) + "</a>";
      },
      l: function() {
        return "<a href=" + this.file.URL + " target=_blank>" + (FileInfo.formatters.n.call(this)) + "</a>";
      },
      L: function() {
        return "<a href=" + this.file.URL + " target=_blank>" + (FileInfo.formatters.N.call(this)) + "</a>";
      },
      n: function() {
        var fullname, shortname;
        fullname = this.file.name;
        shortname = Build.shortFilename(this.file.name, this.isReply);
        if (fullname === shortname) {
          return FileInfo.escape(fullname);
        } else {
          return "<span class=fntrunc>" + (FileInfo.escape(shortname)) + "</span><span class=fnfull>" + (FileInfo.escape(fullname)) + "</span>";
        }
      },
      N: function() {
        return FileInfo.escape(this.file.name);
      },
      p: function() {
        if (this.file.isSpoiler) {
          return 'Spoiler, ';
        } else {
          return '';
        }
      },
      s: function() {
        return this.file.size;
      },
      B: function() {
        return FileInfo.convertUnit(this.file.sizeInBytes, 'B');
      },
      K: function() {
        return FileInfo.convertUnit(this.file.sizeInBytes, 'KB');
      },
      M: function() {
        return FileInfo.convertUnit(this.file.sizeInBytes, 'MB');
      },
      r: function() {
        if (this.file.isImage) {
          return this.file.dimensions;
        } else {
          return 'PDF';
        }
      }
    }
  };

  Sauce = {
    init: function() {
      var link, links, _i, _len, _ref;
      if (g.VIEW === 'catalog' || !Conf['Sauce']) {
        return;
      }
      links = [];
      _ref = Conf['sauces'].split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        if (link[0] === '#') {
          continue;
        }
        links.push(this.createSauceLink(link.trim()));
      }
      if (!links.length) {
        return;
      }
      this.links = links;
      this.link = $.el('a', {
        target: '_blank'
      });
      return Post.prototype.callbacks.push({
        name: 'Sauce',
        cb: this.node
      });
    },
    createSauceLink: function(link) {
      var m, text;
      link = link.replace(/%(t?url|md5|board)/g, function(parameter) {
        switch (parameter) {
          case '%turl':
            return "' + post.file.thumbURL + '";
          case '%url':
            return "' + post.file.URL + '";
          case '%md5':
            return "' + encodeURIComponent(post.file.MD5) + '";
          case '%board':
            return "' + post.board + '";
          default:
            return parameter;
        }
      });
      text = (m = link.match(/;text:(.+)$/)) ? m[1] : link.match(/(\w+)\.\w+\//)[1];
      link = link.replace(/;text:.+$/, '');
      return Function('post', 'a', "a.href = '" + link + "';\na.textContent = '" + text + "';\nreturn a;");
    },
    node: function() {
      var link, nodes, _i, _len, _ref;
      if (this.isClone || !this.file) {
        return;
      }
      nodes = [];
      _ref = Sauce.links;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        nodes.push($.tn('\u00A0'), link(this, Sauce.link.cloneNode(true)));
      }
      return $.add(this.file.info, nodes);
    }
  };

  RevealSpoilers = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Reveal Spoilers']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Reveal Spoilers',
        cb: this.node
      });
    },
    node: function() {
      var thumb, _ref;
      if (this.isClone || !((_ref = this.file) != null ? _ref.isSpoiler : void 0)) {
        return;
      }
      thumb = this.file.thumb;
      thumb.removeAttribute('style');
      return thumb.src = this.file.thumbURL;
    }
  };

  AutoGIF = {
    init: function() {
      var _ref;
      if (g.VIEW === 'catalog' || !Conf['Auto-GIF'] || ((_ref = g.BOARD.ID) === 'gif' || _ref === 'wsg')) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Auto-GIF',
        cb: this.node
      });
    },
    node: function() {
      var URL, gif, style, thumb, _ref, _ref1;
      if (this.isClone || this.isHidden || this.thread.isHidden || !((_ref = this.file) != null ? _ref.isImage : void 0)) {
        return;
      }
      _ref1 = this.file, thumb = _ref1.thumb, URL = _ref1.URL;
      if (!(/gif$/.test(URL) && !/spoiler/.test(thumb.src))) {
        return;
      }
      if (this.file.isSpoiler) {
        style = thumb.style;
        style.maxHeight = style.maxWidth = this.isReply ? '125px' : '250px';
      }
      gif = $.el('img');
      $.on(gif, 'load', function() {
        return thumb.src = URL;
      });
      return gif.src = URL;
    }
  };

  ImageHover = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Image Hover']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Auto-GIF',
        cb: this.node
      });
    },
    node: function() {
      var _ref;
      if (!((_ref = this.file) != null ? _ref.isImage : void 0)) {
        return;
      }
      return $.on(this.file.thumb, 'mouseover', ImageHover.mouseover);
    },
    mouseover: function() {
      var el,
        _this = this;
      el = $.el('img', {
        id: 'ihover',
        src: this.parentNode.href
      });
      $.add(d.body, el);
      $.on(el, 'load', function() {
        return ImageHover.load(_this, el);
      });
      $.on(el, 'error', ImageHover.error);
      return UI.hover(this, el, 'mouseout');
    },
    load: function(root, el) {
      var e, style;
      if (!el.parentNode) {
        return;
      }
      style = el.style;
      e = new Event('mousemove');
      e.clientX = -45 + parseInt(style.left);
      e.clientY = 120 + parseInt(style.top);
      return root.dispatchEvent(e);
    },
    error: function() {
      var src, timeoutID, url,
        _this = this;
      if (!this.parentNode) {
        return;
      }
      src = this.src.split('/');
      if (!(src[2] === 'images.4chan.org' && (url = Redirect.image(src[3], src[5])))) {
        if (g.DEAD) {
          return;
        }
        url = "//images.4chan.org/" + src[3] + "/src/" + src[5];
      }
      if ($.engine !== 'webkit' && url.split('/')[2] === 'images.4chan.org') {
        return;
      }
      timeoutID = setTimeout((function() {
        return _this.src = url;
      }), 3000);
      if ($.engine !== 'webkit' || url.split('/')[2] !== 'images.4chan.org') {
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
    }
  };

  ThreadUpdater = {
    init: function() {
      if (g.VIEW !== 'thread' || !Conf['Thread Updater']) {
        return;
      }
      return Thread.prototype.callbacks.push({
        name: 'Thread Updater',
        cb: this.node
      });
    },
    node: function() {
      return new ThreadUpdater.Updater(this);
    },
    /*
      http://freesound.org/people/pierrecartoons1979/sounds/90112/
      cc-by-nc-3.0
    */

    beep: 'data:audio/wav;base64,UklGRjQDAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAc21wbDwAAABBAAADAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkYXRhzAIAAGMms8em0tleMV4zIpLVo8nhfSlcPR102Ki+5JspVEkdVtKzs+K1NEhUIT7DwKrcy0g6WygsrM2k1NpiLl0zIY/WpMrjgCdbPhxw2Kq+5Z4qUkkdU9K1s+K5NkVTITzBwqnczko3WikrqM+l1NxlLF0zIIvXpsnjgydZPhxs2ay95aIrUEkdUdC3suK8N0NUIjq+xKrcz002WioppdGm091pK1w0IIjYp8jkhydXPxxq2K295aUrTkoeTs65suK+OUFUIzi7xqrb0VA0WSoootKm0t5tKlo1H4TYqMfkiydWQBxm16+85actTEseS8y7seHAPD9TIza5yKra01QyWSson9On0d5wKVk2H4DYqcfkjidUQB1j1rG75KsvSkseScu8seDCPz1TJDW2yara1FYxWSwnm9Sn0N9zKVg2H33ZqsXkkihSQR1g1bK65K0wSEsfR8i+seDEQTxUJTOzy6rY1VowWC0mmNWoz993KVc3H3rYq8TklSlRQh1d1LS647AyR0wgRMbAsN/GRDpTJTKwzKrX1l4vVy4lldWpzt97KVY4IXbUr8LZljVPRCxhw7W3z6ZISkw1VK+4sMWvXEhSPk6buay9sm5JVkZNiLWqtrJ+TldNTnquqbCwilZXU1BwpKirrpNgWFhTaZmnpquZbFlbVmWOpaOonHZcXlljhaGhpZ1+YWBdYn2cn6GdhmdhYGN3lp2enIttY2Jjco+bnJuOdGZlZXCImJqakHpoZ2Zug5WYmZJ/bGlobX6RlpeSg3BqaW16jZSVkoZ0bGtteImSk5KIeG5tbnaFkJKRinxxbm91gY2QkIt/c3BwdH6Kj4+LgnZxcXR8iI2OjIR5c3J0e4WLjYuFe3VzdHmCioyLhn52dHR5gIiKioeAeHV1eH+GiYqHgXp2dnh9hIiJh4J8eHd4fIKHiIeDfXl4eHyBhoeHhH96eHmA',
    Updater: (function() {

      function _Class(thread) {
        var checked, dialog, html, input, name, title, val, _i, _len, _ref, _ref1;
        this.thread = thread;
        html = '<div class=move><span id=status></span> <span id=timer></span></div>';
        _ref = Config.updater.checkbox;
        for (name in _ref) {
          val = _ref[name];
          title = val[1];
          checked = Conf[name] ? 'checked' : '';
          html += "<div><label title='" + title + "'>" + name + "<input name='" + name + "' type=checkbox " + checked + "></label></div>";
        }
        checked = Conf['Auto Update'] ? 'checked' : '';
        html += "<div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox " + checked + "></label></div>\n<div><label>Interval (s)<input type=number name=Interval class=field min=5 value=" + Conf['Interval'] + "></label></div>\n<div><input value='Update Now' type=button name='Update Now'></div>";
        dialog = UI.dialog('updater', 'bottom: 0; right: 0;', html);
        this.timer = $('#timer', dialog);
        this.status = $('#status', dialog);
        this.unsuccessfulFetchCount = 0;
        this.lastModified = '0';
        this.threadRoot = thread.posts[thread].nodes.root.parentNode;
        this.lastPost = +this.threadRoot.lastElementChild.id.slice(2);
        _ref1 = $$('input', dialog);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          input = _ref1[_i];
          if (input.type === 'checkbox') {
            $.on(input, 'click', this.cb.checkbox.bind(this));
            input.dispatchEvent(new Event('click'));
          }
          switch (input.name) {
            case 'Scroll BG':
              $.on(input, 'click', this.cb.scrollBG.bind(this));
              this.cb.scrollBG.call(this);
              break;
            case 'Auto Update This':
              $.on(input, 'click', this.cb.autoUpdate.bind(this));
              break;
            case 'Interval':
              $.on(input, 'change', this.cb.interval.bind(this));
              input.dispatchEvent(new Event('change'));
              break;
            case 'Update Now':
              $.on(input, 'click', this.update.bind(this));
          }
        }
        $.on(window, 'online offline', this.cb.online.bind(this));
        $.on(d, 'QRPostSuccessful', this.cb.post.bind(this));
        $.on(d, 'visibilitychange ovisibilitychange mozvisibilitychange webkitvisibilitychange', this.cb.visibility.bind(this));
        this.cb.online.call(this);
        $.add(d.body, dialog);
      }

      _Class.prototype.cb = {
        online: function() {
          if (this.online = navigator.onLine) {
            this.unsuccessfulFetchCount = 0;
            this.set('timer', this.getInterval());
            if (Conf['Auto Update This']) {
              this.update();
            }
            this.set('status', null);
            this.status.className = null;
          } else {
            this.status.className = 'warning';
            this.set('status', 'Offline');
            this.set('timer', null);
          }
          return this.cb.autoUpdate.call(this);
        },
        post: function(e) {
          if (!(this['Auto Update This'] && +e.detail.threadID === this.thread.ID)) {
            return;
          }
          this.unsuccessfulFetchCount = 0;
          if (this.seconds > 2) {
            return setTimeout(this.update.bind(this), 1000);
          }
        },
        visibility: function() {
          if ($.hidden()) {
            return;
          }
          this.unsuccessfulFetchCount = 0;
          if (this.seconds > this.interval) {
            return this.set('timer', this.getInterval());
          }
        },
        checkbox: function(e) {
          var checked, input, name;
          input = e.target;
          checked = input.checked, name = input.name;
          this[name] = checked;
          return $.cb.checked.call(input);
        },
        scrollBG: function() {
          return this.scrollBG = this['Scroll BG'] ? function() {
            return true;
          } : function() {
            return !$.hidden();
          };
        },
        autoUpdate: function() {
          if (this['Auto Update This'] && this.online) {
            return this.timeoutID = setTimeout(this.timeout.bind(this), 1000);
          } else {
            return clearTimeout(this.timeoutID);
          }
        },
        interval: function(e) {
          var input, val;
          input = e.target;
          val = Math.max(5, parseInt(input.value, 10));
          this.interval = input.value = val;
          return $.cb.value.call(input);
        },
        load: function() {
          switch (this.req.status) {
            case 404:
              this.set('timer', null);
              this.set('status', '404');
              this.status.className = 'warning';
              clearTimeout(this.timeoutID);
              this.thread.isDead = true;
              break;
            case 0:
            case 304:
              /*
                          Status Code 304: Not modified
                          By sending the `If-Modified-Since` header we get a proper status code, and no response.
                          This saves bandwidth for both the user and the servers and avoid unnecessary computation.
              */

              this.unsuccessfulFetchCount++;
              this.set('timer', this.getInterval());
              this.set('status', null);
              this.status.className = null;
              break;
            case 200:
              this.parse(JSON.parse(this.req.response).posts);
              this.lastModified = this.req.getResponseHeader('Last-Modified');
              this.set('timer', this.getInterval());
              break;
            default:
              this.unsuccessfulFetchCount++;
              this.set('timer', this.getInterval());
              this.set('status', "" + this.req.statusText + " (" + this.req.status + ")");
              this.status.className = 'warning';
          }
          return delete this.req;
        }
      };

      _Class.prototype.getInterval = function() {
        var i, j;
        i = this.interval;
        j = Math.min(this.unsuccessfulFetchCount, 10);
        if (!$.hidden()) {
          j = Math.min(j, 7);
        }
        return this.seconds = Math.max(i, [0, 5, 10, 15, 20, 30, 60, 90, 120, 240, 300][j]);
      };

      _Class.prototype.set = function(name, text) {
        var el, node;
        el = this[name];
        if (node = el.firstChild) {
          return node.data = text;
        } else {
          return el.textContent = text;
        }
      };

      _Class.prototype.timeout = function() {
        var n;
        this.timeoutID = setTimeout(this.timeout.bind(this), 1000);
        if (!(n = --this.seconds)) {
          return this.update();
        } else if (n <= -60) {
          this.set('status', 'Retrying');
          this.status.className = null;
          return this.update();
        } else if (n > 0) {
          return this.set('timer', n);
        }
      };

      _Class.prototype.update = function() {
        var url;
        if (!this.online) {
          return;
        }
        this.seconds = 0;
        this.set('timer', '...');
        if (this.req) {
          this.req.onloadend = null;
          this.req.abort();
        }
        url = "//api.4chan.org/" + this.thread.board + "/res/" + this.thread + ".json";
        return this.req = $.ajax(url, {
          onloadend: this.cb.load.bind(this)
        }, {
          headers: {
            'If-Modified-Since': this.lastModified
          }
        });
      };

      _Class.prototype.parse = function(postObjects) {
        var ID, count, i, image, index, node, nodes, num, post, postObject, posts, scroll, _i, _len, _ref;
        Build.spoilerRange[this.thread.board] = postObjects[0].custom_spoiler;
        nodes = [];
        posts = [];
        index = [];
        image = [];
        count = 0;
        for (_i = 0, _len = postObjects.length; _i < _len; _i++) {
          postObject = postObjects[_i];
          num = postObject.no;
          index.push(num);
          if (postObject.ext) {
            image.push(num);
          }
          if (num <= this.lastPost) {
            continue;
          }
          count++;
          node = Build.postFromObject(postObject, this.thread.board.ID);
          nodes.push(node);
          posts.push(new Post(node, this.thread, this.thread.board));
        }
        _ref = this.thread.posts;
        for (i in _ref) {
          post = _ref[i];
          if (post.isDead) {
            continue;
          }
          ID = post.ID;
          if (-1 === index.indexOf(ID)) {
            post.kill();
          } else if (post.file && !post.file.isDead && -1 === image.indexOf(ID)) {
            post.kill(true);
          }
        }
        if (count) {
          if (Conf['Beep'] && $.hidden() && (Unread.replies.length === 0)) {
            if (!this.audio) {
              this.audio = $.el('audio', {
                src: ThreadUpdater.beep
              });
            }
            audio.play();
          }
          this.set('status', "+" + count);
          this.status.className = 'new';
          this.unsuccessfulFetchCount = 0;
        } else {
          this.set('status', null);
          this.status.className = null;
          this.unsuccessfulFetchCount++;
          return;
        }
        this.lastPost = posts[count - 1].ID;
        Main.callbackNodes(Post, posts);
        scroll = this['Auto Scroll'] && this.scrollBG() && this.threadRoot.getBoundingClientRect().bottom - doc.clientHeight < 25;
        $.add(this.threadRoot, nodes);
        if (scroll) {
          return nodes[0].scrollIntoView();
        }
      };

      return _Class;

    })()
  };

  Board = (function() {

    Board.prototype.toString = function() {
      return this.ID;
    };

    function Board(ID) {
      this.ID = ID;
      this.threads = {};
      this.posts = {};
      g.boards[this] = this;
    }

    return Board;

  })();

  Thread = (function() {

    Thread.prototype.callbacks = [];

    Thread.prototype.toString = function() {
      return this.ID;
    };

    function Thread(ID, board) {
      this.board = board;
      this.ID = +ID;
      this.fullID = "" + this.board + "." + this.ID;
      this.posts = {};
      g.threads["" + board + "." + this] = board.threads[this] = this;
    }

    return Thread;

  })();

  Post = (function() {

    Post.prototype.callbacks = [];

    Post.prototype.toString = function() {
      return this.ID;
    };

    function Post(root, thread, board, that) {
      var alt, anchor, bq, capcode, data, date, email, file, fileInfo, flag, hash, i, info, name, node, nodes, pathname, post, quotelink, quotes, size, subject, text, thumb, tripcode, uniqueID, unit, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
      this.thread = thread;
      this.board = board;
      if (that == null) {
        that = {};
      }
      this.ID = +root.id.slice(2);
      this.fullID = "" + this.board + "." + this.ID;
      post = $('.post', root);
      info = $('.postInfo', post);
      this.nodes = {
        root: root,
        post: post,
        info: info,
        comment: $('.postMessage', post),
        quotelinks: [],
        backlinks: info.getElementsByClassName('backlink')
      };
      this.info = {};
      if (subject = $('.subject', info)) {
        this.nodes.subject = subject;
        this.info.subject = subject.textContent;
      }
      if (name = $('.name', info)) {
        this.nodes.name = name;
        this.info.name = name.textContent;
      }
      if (email = $('.useremail', info)) {
        this.nodes.email = email;
        this.info.email = decodeURIComponent(email.href.slice(7));
      }
      if (tripcode = $('.postertrip', info)) {
        this.nodes.tripcode = tripcode;
        this.info.tripcode = tripcode.textContent;
      }
      if (uniqueID = $('.posteruid', info)) {
        this.nodes.uniqueID = uniqueID;
        this.info.uniqueID = uniqueID.firstElementChild.textContent;
      }
      if (capcode = $('.capcode', info)) {
        this.nodes.capcode = capcode;
        this.info.capcode = capcode.textContent;
      }
      if (flag = $('.countryFlag', info)) {
        this.nodes.flag = flag;
        this.info.flag = flag.title;
      }
      if (date = $('.dateTime', info)) {
        this.nodes.date = date;
        this.info.date = new Date(date.dataset.utc * 1000);
      }
      bq = this.nodes.comment.cloneNode(true);
      _ref = $$('.abbr, .capcodeReplies, .exif, b', bq);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        $.rm(node);
      }
      text = [];
      nodes = d.evaluate('.//br|.//text()', bq, null, 7, null);
      for (i = _j = 0, _ref1 = nodes.snapshotLength; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        text.push((data = nodes.snapshotItem(i).data) ? data : '\n');
      }
      this.info.comment = text.join('').trim().replace(/\s+$/gm, '');
      quotes = {};
      _ref2 = $$('.quotelink', this.nodes.comment);
      for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
        quotelink = _ref2[_k];
        hash = quotelink.hash;
        if (!hash) {
          continue;
        }
        pathname = quotelink.pathname;
        if (/catalog$/.test(pathname)) {
          continue;
        }
        if (quotelink.hostname !== 'boards.4chan.org') {
          continue;
        }
        this.nodes.quotelinks.push(quotelink);
        if (quotelink.parentNode.parentNode.className === 'capcodeReplies') {
          continue;
        }
        quotes["" + (pathname.split('/')[1]) + "." + hash.slice(2)] = true;
      }
      this.quotes = Object.keys(quotes);
      if ((file = $('.file', post)) && (thumb = $('img[data-md5]', file))) {
        alt = thumb.alt;
        anchor = thumb.parentNode;
        fileInfo = file.firstElementChild;
        this.file = {
          info: fileInfo,
          text: fileInfo.firstElementChild,
          thumb: thumb,
          URL: anchor.href,
          size: alt.match(/[\d.]+\s\w+/)[0],
          MD5: thumb.dataset.md5,
          isSpoiler: $.hasClass(anchor, 'imgspoiler')
        };
        size = +this.file.size.match(/[\d.]+/)[0];
        unit = ['B', 'KB', 'MB', 'GB'].indexOf(this.file.size.match(/\w+$/)[0]);
        while (unit-- > 0) {
          size *= 1024;
        }
        this.file.sizeInBytes = size;
        this.file.thumbURL = that.isArchived ? thumb.src : "" + location.protocol + "//thumbs.4chan.org/" + board + "/thumb/" + (this.file.URL.match(/(\d+)\./)[1]) + "s.jpg";
        this.file.name = $('span[title]', fileInfo).title.replace(/%22/g, '"');
        if (this.file.isImage = /(jpg|png|gif)$/i.test(this.file.name)) {
          this.file.dimensions = this.file.text.textContent.match(/\d+x\d+/)[0];
        }
      }
      this.isReply = $.hasClass(post, 'reply');
      this.clones = [];
      g.posts["" + board + "." + this] = thread.posts[this] = board.posts[this] = this;
      if (that.isArchived) {
        this.kill();
      }
    }

    Post.prototype.kill = function(img) {
      var quotelink, _i, _len, _ref;
      if (this.file && !this.file.isDead) {
        this.file.isDead = true;
      }
      if (img) {
        return;
      }
      this.isDead = true;
      $.addClass(this.nodes.root, 'dead');
      _ref = Get.allQuotelinksLinkingTo(this);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        if ($.hasClass(quotelink, 'deadlink')) {
          continue;
        }
        $.add(quotelink, $.tn('\u00A0(Dead)'));
        $.addClass(quotelink, 'deadlink');
      }
    };

    Post.prototype.addClone = function(context) {
      return new Clone(this, context);
    };

    Post.prototype.rmClone = function(index) {
      var clone, _i, _len, _ref;
      this.clones.splice(index, 1);
      _ref = this.clones.slice(index);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clone = _ref[_i];
        clone.nodes.root.setAttribute('data-clone', index++);
      }
    };

    return Post;

  })();

  Clone = (function(_super) {

    __extends(Clone, _super);

    function Clone(origin, context) {
      var file, index, info, inline, inlined, key, nodes, post, quotelink, root, val, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4;
      this.origin = origin;
      this.context = context;
      _ref = ['ID', 'fullID', 'board', 'thread', 'info', 'quotes', 'isReply'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        this[key] = origin[key];
      }
      nodes = origin.nodes;
      root = nodes.root.cloneNode(true);
      post = $('.post', root);
      info = $('.postInfo', post);
      this.nodes = {
        root: root,
        post: post,
        info: info,
        comment: $('.postMessage', post),
        quotelinks: [],
        backlinks: info.getElementsByClassName('backlink')
      };
      _ref1 = $$('.inline', post);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        inline = _ref1[_j];
        $.rm(inline);
      }
      _ref2 = $$('.inlined', post);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        inlined = _ref2[_k];
        $.rmClass(inlined, 'inlined');
      }
      root.hidden = false;
      $.rmClass(root, 'forwarded');
      if (nodes.subject) {
        this.nodes.subject = $('.subject', info);
      }
      if (nodes.name) {
        this.nodes.name = $('.name', info);
      }
      if (nodes.email) {
        this.nodes.email = $('.useremail', info);
      }
      if (nodes.tripcode) {
        this.nodes.tripcode = $('.postertrip', info);
      }
      if (nodes.uniqueID) {
        this.nodes.uniqueID = $('.posteruid', info);
      }
      if (nodes.capcode) {
        this.nodes.capcode = $('.capcode', info);
      }
      if (nodes.flag) {
        this.nodes.flag = $('.countryFlag', info);
      }
      if (nodes.date) {
        this.nodes.date = $('.dateTime', info);
      }
      _ref3 = $$('.quotelink', this.nodes.comment);
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        quotelink = _ref3[_l];
        if (quotelink.hash || $.hasClass(quotelink, 'deadlink')) {
          this.nodes.quotelinks.push(quotelink);
        }
      }
      if (origin.file) {
        this.file = {};
        _ref4 = origin.file;
        for (key in _ref4) {
          val = _ref4[key];
          this.file[key] = val;
        }
        file = $('.file', post);
        this.file.info = file.firstElementChild;
        this.file.text = this.file.info.firstElementChild;
        this.file.thumb = $('img[data-md5]', file);
      }
      if (origin.isDead) {
        this.isDead = true;
      }
      this.isClone = true;
      index = origin.clones.push(this) - 1;
      root.setAttribute('data-clone', index);
    }

    return Clone;

  })(Post);

  Main = {
    init: function() {
      var flatten, initFeature, key, pathname, val;
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
      g.VIEW = (function() {
        switch (pathname[2]) {
          case 'res':
            return 'thread';
          case 'catalog':
            return 'catalog';
          default:
            return 'index';
        }
      })();
      if (g.VIEW === 'thread') {
        g.THREAD = +pathname[3];
      }
      switch (location.hostname) {
        case 'sys.4chan.org':
          return;
        case 'images.4chan.org':
          $.ready(function() {
            var url;
            if (Conf['404 Redirect'] && d.title === '4chan - 404 Not Found') {
              url = Redirect.image(pathname[1], pathname[3]);
              if (url) {
                return location.href = url;
              }
            }
          });
          return;
      }
      initFeature = function(name, module) {
        console.time("" + name + " initialization");
        try {
          module.init();
        } catch (err) {
          Main.handleErrors({
            message: "\"" + name + "\" initialization crashed.",
            error: err
          });
        }
        return console.timeEnd("" + name + " initialization");
      };
      console.time('All initializations');
      initFeature('Header', Header);
      initFeature('Settings', Settings);
      initFeature('Resurrect Quotes', Quotify);
      initFeature('Filter', Filter);
      initFeature('Thread Hiding', ThreadHiding);
      initFeature('Reply Hiding', ReplyHiding);
      initFeature('Recursive', Recursive);
      initFeature('Menu', Menu);
      initFeature('Report Link', ReportLink);
      initFeature('Thread Hiding (Menu)', ThreadHiding.menu);
      initFeature('Reply Hiding (Menu)', ReplyHiding.menu);
      initFeature('Delete Link', DeleteLink);
      initFeature('Filter (Menu)', Filter.menu);
      initFeature('Download Link', DownloadLink);
      initFeature('Archive Link', ArchiveLink);
      initFeature('Quote Inline', QuoteInline);
      initFeature('Quote Preview', QuotePreview);
      initFeature('Quote Backlinks', QuoteBacklink);
      initFeature('Mark OP Quotes', QuoteOP);
      initFeature('Mark Cross-thread Quotes', QuoteCT);
      initFeature('Anonymize', Anonymize);
      initFeature('Time Formatting', Time);
      initFeature('File Info Formatting', FileInfo);
      initFeature('Sauce', Sauce);
      initFeature('Reveal Spoilers', RevealSpoilers);
      initFeature('Auto-GIF', AutoGIF);
      initFeature('Image Hover', ImageHover);
      initFeature('Thread Updater', ThreadUpdater);
      console.timeEnd('All initializations');
      $.on(d, '4chanMainInit', Main.initStyle);
      return $.ready(Main.initReady);
    },
    initStyle: function() {
      var MutationObserver, mainStyleSheet, observer, setStyle, style, styleSheets, _ref;
      if ((_ref = $('link[href*=mobile]', d.head)) != null) {
        _ref.disabled = true;
      }
      $.addStyle(Main.css);
      style = null;
      mainStyleSheet = $('link[title=switch]', d.head);
      styleSheets = $$('link[rel="alternate stylesheet"]', d.head);
      setStyle = function() {
        var styleSheet, _i, _len;
        if (style) {
          $.rmClass(doc, style);
        }
        for (_i = 0, _len = styleSheets.length; _i < _len; _i++) {
          styleSheet = styleSheets[_i];
          if (styleSheet.href === mainStyleSheet.href) {
            style = styleSheet.title.toLowerCase().replace('new', '').trim().replace(/\s+/g, '-');
            break;
          }
        }
        return $.addClass(doc, style);
      };
      $.addClass(doc, $.engine);
      $.addClass(doc, 'fourchan_x');
      setStyle();
      if (MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.OMutationObserver) {
        observer = new MutationObserver(setStyle);
        return observer.observe(mainStyleSheet, {
          attributes: true,
          attributeFilter: ['href']
        });
      } else {
        return $.on(mainStyleSheet, 'DOMAttrModified', setStyle);
      }
    },
    initReady: function() {
      var boardChild, errors, posts, thread, threadChild, threads, _i, _j, _len, _len1, _ref, _ref1;
      if (!$.hasClass(doc, 'fourchan_x')) {
        Main.initStyle();
      }
      if (d.title === '4chan - 404 Not Found') {
        if (Conf['404 Redirect'] && g.VIEW === 'thread') {
          location.href = Redirect.to({
            board: g.BOARD,
            threadID: g.THREAD,
            postID: location.hash
          });
        }
        return;
      }
      threads = [];
      posts = [];
      _ref = $('.board').children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        boardChild = _ref[_i];
        if (!$.hasClass(boardChild, 'thread')) {
          continue;
        }
        thread = new Thread(boardChild.id.slice(1), g.BOARD);
        threads.push(thread);
        _ref1 = boardChild.children;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          threadChild = _ref1[_j];
          if (!$.hasClass(threadChild, 'postContainer')) {
            continue;
          }
          try {
            posts.push(new Post(threadChild, thread, g.BOARD));
          } catch (err) {
            if (!errors) {
              errors = [];
            }
            errors.push({
              message: "Parsing of Post No." + (threadChild.id.match(/\d+/)) + " failed. Post will be skipped.",
              error: err
            });
          }
        }
      }
      if (errors) {
        Main.handleErrors(errors);
      }
      Main.callbackNodes(Thread, threads);
      return Main.callbackNodes(Post, posts);
    },
    callbackNodes: function(klass, nodes) {
      var callback, errors, i, len, node, _i, _j, _len, _ref;
      len = nodes.length;
      _ref = klass.prototype.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        for (i = _j = 0; 0 <= len ? _j < len : _j > len; i = 0 <= len ? ++_j : --_j) {
          node = nodes[i];
          try {
            callback.cb.call(node);
          } catch (err) {
            if (!errors) {
              errors = [];
            }
            errors.push({
              message: "\"" + callback.name + "\" crashed on " + klass.name + " No." + node + " (/" + node.board + "/).",
              error: err
            });
          }
        }
      }
      if (errors) {
        return Main.handleErrors(errors);
      }
    },
    handleErrors: function(errors) {
      var div, error, logs, _i, _len;
      if (!('length' in errors)) {
        error = errors;
      } else if (errors.length === 1) {
        error = errors[0];
      }
      if (error) {
        new Notification('error', Main.parseError(error), 15);
        return;
      }
      div = $.el('div', {
        innerHTML: "" + errors.length + " errors occured. [<a href=javascript:;>show</a>]"
      });
      $.on(div.lastElementChild, 'click', function() {
        if (this.textContent === 'show') {
          this.textContent = 'hide';
          return logs.hidden = false;
        } else {
          this.textContent = 'show';
          return logs.hidden = true;
        }
      });
      logs = $.el('div', {
        hidden: true
      });
      for (_i = 0, _len = errors.length; _i < _len; _i++) {
        error = errors[_i];
        $.add(logs, Main.parseError(error));
      }
      return new Notification('error', [div, logs], 30);
    },
    parseError: function(data) {
      var error, message;
      message = data.message, error = data.error;
      $.log(message, error.stack);
      message = $.el('div', {
        textContent: message
      });
      error = $.el('div', {
        textContent: error
      });
      return [message, error];
    },
    css: "/* general */\n.dialog.reply {\n  display: block;\n  border: 1px solid rgba(0, 0, 0, .25);\n  padding: 0;\n}\n.move {\n  cursor: move;\n}\nlabel {\n  cursor: pointer;\n}\na[href=\"javascript:;\"] {\n  text-decoration: none;\n}\n.warning {\n  color: red;\n}\n\n/* 4chan style fixes */\n.opContainer, .op {\n  display: block !important;\n}\n.post {\n  overflow: visible !important;\n}\n[hidden] {\n  display: none !important;\n}\n\n/* fixed, z-index */\n#qp, #ihover,\n#updater, #stats,\n#header,\n#qr, #watcher {\n  position: fixed;\n}\n#notifications {\n  z-index: 80;\n}\n#qp, #ihover {\n  z-index: 70;\n}\n#menu {\n  z-index: 60;\n}\n#updater, #stats {\n  z-index: 50;\n}\n#header:hover {\n  z-index: 40;\n}\n#qr {\n  z-index: 30;\n}\n#header {\n  z-index: 20;\n}\n#watcher {\n  z-index: 10;\n}\n\n/* XXX support different styles */\n#header-bar {\n  font-size: 9pt;\n  color: #89A;\n  background-color: #D6DAF0;\n  border-color: #B7C5D9;\n  border-width: 0 0 1px;\n  border-style: solid;\n}\n\n/* header */\n.fourchan_x body {\n  margin-top: 2em;\n}\n#header {\n  top: 0;\n  right: 0;\n  left: 0;\n}\n#header-bar {\n  padding: 4px;\n  position: relative;\n  transition: all .1s ease-in-out;\n  -o-transition: all .1s ease-in-out;\n  -moz-transition: all .1s ease-in-out;\n  -webkit-transition: all .1s ease-in-out;\n}\n#header-bar.autohide:not(:hover) {\n  margin-bottom: -1em;\n  transform: translateY(-100%);\n  -o-transform: translateY(-100%);\n  -moz-transform: translateY(-100%);\n  -webkit-transform: translateY(-100%);\n  transition: all .75s .25s ease-in-out;\n  -o-transition: all .75s .25s ease-in-out;\n  -moz-transition: all .75s .25s ease-in-out;\n  -webkit-transition: all .75s .25s ease-in-out;\n}\n#toggle-header-bar {\n  cursor: n-resize;\n  left: 0;\n  right: 0;\n  bottom: -8px;\n  height: 10px;\n  position: absolute;\n}\n#header-bar.autohide #toggle-header-bar {\n  cursor: s-resize;\n}\n#header-bar a {\n  text-decoration: none;\n  padding: 1px;\n}\n#header-bar > .menu-button {\n  float: right;\n  padding: 0;\n}\nbody > #boardNavDesktop,\n#navtopright,\n#boardNavDesktopFoot {\n  display: none !important;\n}\n\n/* notifications */\n#notifications {\n  text-align: center;\n}\n.notification {\n  color: #FFF;\n  font-weight: 700;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .5);\n  border-radius: 2px;\n  margin: 1px auto;\n  width: 500px;\n  max-width: 100%;\n  position: relative;\n  transition: all .25s ease-in-out;\n  -o-transition: all .25s ease-in-out;\n  -moz-transition: all .25s ease-in-out;\n  -webkit-transition: all .25s ease-in-out;\n}\n.notification.error {\n  background-color: hsl(0, 100%, 40%);\n}\n.notification.warning {\n  background-color: hsl(36, 100%, 40%);\n}\n.notification.info {\n  background-color: hsl(200, 100%, 40%);\n}\n.notification.success {\n  background-color: hsl(104, 100%, 40%);\n}\n.notification > .close {\n  color: white;\n  padding: 4px 6px;\n  top: 0;\n  right: 0;\n  position: absolute;\n}\n.message {\n  box-sizing: border-box;\n  padding: 4px 20px;\n  max-height: 200px;\n  width: 100%;\n  overflow: auto;\n}\n\n/* thread updater */\n#updater {\n  text-align: right;\n}\n#updater:not(:hover) {\n  background: none;\n  border: none;\n}\n#updater input[type=number] {\n  width: 4em;\n}\n#updater:not(:hover) > div:not(.move) {\n  display: none;\n}\n.new {\n  color: limegreen;\n}\n\n/* quote */\n.quotelink.deadlink {\n  text-decoration: underline !important;\n}\n.deadlink:not(.quotelink) {\n  text-decoration: none !important;\n}\n.inlined {\n  opacity: .5;\n}\n#qp input, .forwarded {\n  display: none;\n}\n.quotelink.forwardlink,\n.backlink.forwardlink {\n  text-decoration: none;\n  border-bottom: 1px dashed;\n}\n.filtered {\n  text-decoration: underline line-through;\n}\n.inline {\n  border: 1px solid rgba(128, 128, 128, .5);\n  display: table;\n  margin: 2px 0;\n}\n.inline .post {\n  border: 0 !important;\n  display: table !important;\n  margin: 0 !important;\n  padding: 1px 2px !important;\n}\n#qp {\n  padding: 2px 2px 5px;\n}\n#qp .post {\n  border: none;\n  margin: 0;\n  padding: 0;\n}\n#qp img {\n  max-height: 300px;\n  max-width: 500px;\n}\n.qphl {\n  box-shadow: 0 0 0 2px rgba(216, 94, 49, .7);\n}\n\n/* file */\n.fileText:hover .fntrunc,\n.fileText:not(:hover) .fnfull {\n  display: none;\n}\n#ihover {\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  max-height: 100%;\n  max-width: 75%;\n  padding-bottom: 16px;\n}\n\n/* Filter */\n.opContainer.filter-highlight {\n  box-shadow: inset 5px 0 rgba(255, 0, 0, .5);\n}\n.opContainer.filter-highlight.qphl {\n  box-shadow: inset 5px 0 rgba(255, 0, 0, .5),\n              0 0 0 2px rgba(216, 94, 49, .7);\n}\n.filter-highlight > .reply {\n  box-shadow: -5px 0 rgba(255, 0, 0, .5);\n}\n.filter-highlight > .reply.qphl {\n  box-shadow: -5px 0 rgba(255, 0, 0, .5),\n              0 0 0 2px rgba(216, 94, 49, .7)\n}\n\n/* Thread & Reply Hiding */\n.hide-thread-button,\n.hide-reply-button {\n  float: left;\n  margin-right: 2px;\n}\n.stub ~ .sideArrows,\n.stub ~ .hide-reply-button,\n.stub ~ .post {\n  display: none !important;\n}\n\n/* Menu */\n.menu-button {\n  display: inline-block;\n}\n.menu-button > span {\n  border-top:   6px solid;\n  border-right: 4px solid transparent;\n  border-left:  4px solid transparent;\n  display: inline-block;\n  margin: 2px;\n  vertical-align: middle;\n}\n#menu {\n  position: absolute;\n  outline: none;\n}\n.entry {\n  border-bottom: 1px solid rgba(0, 0, 0, .25);\n  cursor: pointer;\n  display: block;\n  outline: none;\n  padding: 3px 7px;\n  position: relative;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.entry:last-child {\n  border: none;\n}\n.focused.entry {\n  background: rgba(255, 255, 255, .33);\n}\n.entry.has-submenu {\n  padding-right: 20px;\n}\n.has-submenu::after {\n  content: \"\";\n  border-left:   6px solid;\n  border-top:    4px solid transparent;\n  border-bottom: 4px solid transparent;\n  display: inline-block;\n  margin: 4px;\n  position: absolute;\n  right: 3px;\n}\n.has-submenu:not(.focused) > .submenu {\n  display: none;\n}\n.submenu {\n  position: absolute;\n  margin: -1px 0;\n}\n.entry input {\n  margin: 0;\n}"
  };

  Main.init();

}).call(this);
