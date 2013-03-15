// ==UserScript==
// @name         4chan X Beta
// @version      3.0.0
// @namespace    4chan-X
// @description  Cross-browser userscript for maximum lurking on 4chan.
// @copyright    2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright    2012-2013 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license      MIT; http://en.wikipedia.org/wiki/Mit_license
// @match        *://boards.4chan.org/*
// @match        *://images.4chan.org/*
// @match        *://sys.4chan.org/*
// @match        *://api.4chan.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @run-at       document-start
// @updateURL    https://github.com/MayhemYDG/4chan-x/raw/v3/4chan_x.meta.js
// @downloadURL  https://github.com/MayhemYDG/4chan-x/raw/v3/4chan_x.user.js
// @icon         data:image/gif;base64,R0lGODlhEAAQAKECAAAAAGbMM////////yH5BAEKAAIALAAAAAAQABAAAAIxlI+pq+D9DAgUoFkPDlbs7lGiI2bSVnKglnJMOL6omczxVZK3dH/41AG6Lh7i6qUoAAA7
// ==/UserScript==

/* 4chan X Beta - Version 3.0.0 - 2013-03-15
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
  var $, $$, Anonymize, ArchiveLink, AutoGIF, Board, Build, Clone, Conf, Config, CustomCSS, DeleteLink, DownloadLink, ExpandComment, ExpandThread, Favicon, FileInfo, Filter, Fourchan, Get, Header, ImageExpand, ImageHover, Keybinds, Main, Menu, Misc, Nav, Notification, Polyfill, Post, QR, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, QuoteStrikeThrough, QuoteYou, Quotify, Recursive, Redirect, RelativeDates, ReplyHiding, Report, ReportLink, RevealSpoilers, Sauce, Settings, Thread, ThreadExcerpt, ThreadHiding, ThreadStats, ThreadUpdater, ThreadWatcher, Time, UI, Unread, c, d, doc, g,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Config = {
    main: {
      'Miscellaneous': {
        'Enable 4chan\'s Extension': [false, 'Compatibility between 4chan X Beta and 4chan\'s inline extension is NOT guaranteed.'],
        'Custom Board Navigation': [true, 'Disable this to always display the full board list.'],
        '404 Redirect': [true, 'Redirect dead threads and images.'],
        'Keybinds': [true, 'Bind actions to keyboard shortcuts.'],
        'Time Formatting': [true, 'Localize and format timestamps arbitrarily.'],
        'Relative Post Dates': [false, 'Display dates like "3 minutes ago". Tooltip shows the timestamp.'],
        'File Info Formatting': [true, 'Reformat the file information.'],
        'Comment Expansion': [true, 'Can expand too long comments.'],
        'Thread Expansion': [true, 'Can expand threads to view all replies.'],
        'Index Navigation': [false, 'Navigate to previous / next thread.'],
        'Custom CSS': [false, 'Apply custom CSS to 4chan.'],
        'Check for Updates': [true, 'Check for updated versions of 4chan X Beta.']
      },
      'Filtering': {
        'Anonymize': [false, 'Turn everyone Anonymous.'],
        'Filter': [true, 'Self-moderation placebo.'],
        'Recursive Hiding': [true, 'Hide replies of hidden posts, recursively.'],
        'Thread Hiding': [true, 'Hide entire threads.'],
        'Reply Hiding': [true, 'Hide single replies.'],
        'Hiding Buttons': [true, 'Make buttons to hide threads / replies, in addition to menu links.'],
        'Stubs': [true, 'Make stubs of hidden threads / replies.']
      },
      'Images': {
        'Auto-GIF': [false, 'Animate GIF thumbnails.'],
        'Image Expansion': [true, 'Expand images.'],
        'Image Hover': [false, 'Show full image on mouseover.'],
        'Sauce': [true, 'Add sauce links to images.'],
        'Reveal Spoilers': [false, 'Reveal spoiler thumbnails.']
      },
      'Menu': {
        'Menu': [true, 'Add a drop-down menu in posts.'],
        'Report Link': [true, 'Add a report link to the menu.'],
        'Delete Link': [true, 'Add post and image deletion links to the menu.'],
        'Download Link': [true, 'Add a download with original filename link to the menu. Chrome-only currently.'],
        'Archive Link': [true, 'Add an archive link to the menu.']
      },
      'Monitoring': {
        'Thread Updater': [true, 'Fetch and insert new replies. Has more options in its own dialog.'],
        'Unread Count': [true, 'Show the unread posts count in the tab title.'],
        'Unread Tab Icon': [true, 'Show a different favicon when there are unread posts.'],
        'Unread Line': [true, 'Show a line to distinguish read posts from unread ones.'],
        'Thread Excerpt': [true, 'Show an excerpt of the thread in the tab title.'],
        'Thread Stats': [true, 'Display reply and image count.'],
        'Thread Watcher': [true, 'Bookmark threads.'],
        'Auto Watch': [true, 'Automatically watch threads you start.'],
        'Auto Watch Reply': [false, 'Automatically watch threads you reply to.']
      },
      'Posting': {
        'Quick Reply': [true, 'All-in-one form to reply, create threads, automate dumping and more.'],
        'Persistent QR': [false, 'The Quick reply won\'t disappear after posting.'],
        'Auto Hide QR': [false, 'Automatically hide the quick reply when posting.'],
        'Open Post in New Tab': [true, 'Open new threads or replies to a thread from the index in a new tab.'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Hide Original Post Form': [true, 'Hide the normal post form.']
      },
      'Quote links': {
        'Quote Backlinks': [true, 'Add quote backlinks.'],
        'OP Backlinks': [false, 'Add backlinks to the OP.'],
        'Quote Inlining': [true, 'Inline quoted post on click.'],
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks.'],
        'Quote Previewing': [true, 'Show quoted post on hover.'],
        'Quote Highlighting': [true, 'Highlight the previewed post.'],
        'Resurrect Quotes': [true, 'Link dead quotes to the archives.'],
        'Mark Quotes of You': [true, 'Add \'(You)\' to quotes linking to your posts.'],
        'Mark OP Quotes': [true, 'Add \'(OP)\' to OP quotes.'],
        'Mark Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes.']
      }
    },
    imageExpansion: {
      'Fit width': [true, ''],
      'Fit height': [false, ''],
      'Expand spoilers': [true, 'Expand all images along with spoilers.'],
      'Expand from here': [true, 'Expand all images only from current position to thread end.']
    },
    filter: {
      name: "# Filter any namefags:\n#/^(?!Anonymous$)/",
      uniqueID: "# Filter a specific ID:\n#/Txhvk1Tl/",
      tripcode: "# Filter any tripfag\n#/^!/",
      capcode: "# Set a custom class for mods:\n#/Mod$/;highlight:mod;op:yes\n# Set a custom class for moot:\n#/Admin$/;highlight:moot;op:yes",
      email: "# Filter any e-mails that are not `sage` on /a/ and /jp/:\n#/^(?!sage$)/;boards:a,jp",
      subject: "# Filter Generals on /v/:\n#/general/i;boards:v;op:only",
      comment: "# Filter Stallman copypasta on /g/:\n#/what you\'re refer+ing to as linux/i;boards:g",
      flag: '',
      filename: '',
      dimensions: "# Highlight potential wallpapers:\n#/1920x1080/;op:yes;highlight;top:no;boards:w,wg",
      filesize: '',
      MD5: ''
    },
    sauces: "http://iqdb.org/?url=%turl\nhttp://www.google.com/searchbyimage?image_url=%turl\n#http://tineye.com/search?url=%turl\n#http://saucenao.com/search.php?db=999&url=%turl\n#http://3d.iqdb.org/?url=%turl\n#http://regex.info/exif.cgi?imgurl=%url\n# uploaders:\n#http://imgur.com/upload?url=%url;text:Upload to imgur\n#http://omploader.org/upload?url1=%url;text:Upload to omploader\n# \"View Same\" in archives:\n#//archive.foolz.us/_/search/image/%MD5/;text:View same on foolz\n#//archive.foolz.us/%board/search/image/%MD5/;text:View same on foolz /%board/\n#//archive.installgentoo.net/%board/image/%MD5;text:View same on installgentoo /%board/",
    'Header auto-hide': false,
    'Header catalog links': false,
    boardnav: '[current-title / toggle-all]',
    time: '%m/%d/%y(%a)%H:%M:%S',
    backlink: '>>%id',
    fileInfo: '%l (%p%s, %r)',
    favicon: 'ferongr',
    usercss: '',
    hotkeys: {
      'Toggle board list': ['Ctrl+b', 'Toggle the full board list.'],
      'Open empty QR': ['q', 'Open QR without post number inserted.'],
      'Open QR': ['Shift+q', 'Open QR with post number inserted.'],
      'Open settings': ['Alt+o', 'Open Settings.'],
      'Close': ['Esc', 'Close Settings, Notifications or QR.'],
      'Spoiler tags': ['Ctrl+s', 'Insert spoiler tags.'],
      'Code tags': ['Alt+c', 'Insert code tags.'],
      'Eqn tags': ['Alt+e', 'Insert eqn tags.'],
      'Math tags': ['Alt+m', 'Insert math tags.'],
      'Submit QR': ['Alt+s', 'Submit post.'],
      'Watch': ['w', 'Watch thread.'],
      'Update': ['r', 'Update the thread now.'],
      'Expand image': ['Shift+e', 'Expand selected image.'],
      'Expand images': ['e', 'Expand all images.'],
      'Front page': ['0', 'Jump to page 0.'],
      'Open front page': ['Shift+0', 'Open page 0 in a new tab.'],
      'Next page': ['Right', 'Jump to the next page.'],
      'Previous page': ['Left', 'Jump to the previous page.'],
      'Next thread': ['Down', 'See next thread.'],
      'Previous thread': ['Up', 'See previous thread.'],
      'Expand thread': ['Ctrl+e', 'Expand thread.'],
      'Open thread': ['o', 'Open thread in current tab.'],
      'Open thread tab': ['Shift+o', 'Open thread in new tab.'],
      'Next reply': ['j', 'Select next reply.'],
      'Previous reply': ['k', 'Select previous reply.'],
      'Hide': ['x', 'Hide thread.']
    },
    updater: {
      checkbox: {
        'Beep': [false, 'Beep on new post to completely read thread.'],
        'Auto Scroll': [false, 'Scroll updated posts into view. Only enabled at bottom of page.'],
        'Bottom Scroll': [false, 'Always scroll to the bottom, not the first new post. Useful for event threads.'],
        'Scroll BG': [false, 'Auto-scroll background tabs.'],
        'Auto Update': [true, 'Automatically fetch new posts.']
      },
      'Interval': 30
    }
  };

  if (!/^(boards|images|sys)\.4chan\.org$/.test(location.hostname)) {
    return;
  }

  Conf = {};

  c = console;

  d = document;

  doc = null;

  g = {
    VERSION: '3.0.0',
    NAMESPACE: "4chan X Beta.",
    boards: {},
    threads: {},
    posts: {}
  };

  UI = (function() {
    var Menu, dialog, drag, dragend, dragstart, hover, hoverend, hoverstart, touchend, touchmove;
    dialog = function(id, position, html) {
      var el, move;
      el = d.createElement('div');
      el.className = 'dialog';
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
          className: 'dialog',
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
        var bLeft, bRect, bTop, bottom, cHeight, cWidth, entry, left, mRect, menu, prevEntry, right, style, top, _i, _len, _ref, _ref1, _ref2;
        menu = this.makeMenu();
        currentMenu = menu;
        lastToggledButton = button;
        _ref = this.entries;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          this.insertEntry(entry, menu, data);
        }
        entry = $('.entry', menu);
        while (prevEntry = this.findNextEntry(entry, -1)) {
          entry = prevEntry;
        }
        this.focus(entry);
        $.on(d, 'click', this.close);
        $.on(d, 'CloseMenu', this.close);
        $.add(button, menu);
        mRect = menu.getBoundingClientRect();
        bRect = button.getBoundingClientRect();
        bTop = doc.scrollTop + d.body.scrollTop + bRect.top;
        bLeft = doc.scrollLeft + d.body.scrollLeft + bRect.left;
        cHeight = doc.clientHeight;
        cWidth = doc.clientWidth;
        _ref1 = bRect.top + bRect.height + mRect.height < cHeight ? ['100%', null] : [null, '100%'], top = _ref1[0], bottom = _ref1[1];
        _ref2 = bRect.left + mRect.width < cWidth ? ['0px', null] : [null, '0px'], left = _ref2[0], right = _ref2[1];
        style = menu.style;
        style.top = top;
        style.right = right;
        style.bottom = bottom;
        style.left = left;
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
          className: 'dialog submenu'
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
        $.off(d, 'click', this.close);
        return $.off(d, 'CloseMenu', this.close);
      };

      Menu.prototype.findNextEntry = function(entry, direction) {
        var entries;
        entries = __slice.call(entry.parentNode.children);
        entries.sort(function(first, second) {
          return +(first.style.order || first.style.webkitOrder) - +(second.style.order || second.style.webkitOrder);
        });
        return entries[entries.indexOf(entry) + direction];
      };

      Menu.prototype.keybinds = function(e) {
        var entry, next, nextPrev, subEntry, submenu;
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
            if (next = this.findNextEntry(entry, -1)) {
              this.focus(next);
            }
            break;
          case 40:
            if (next = this.findNextEntry(entry, +1)) {
              this.focus(next);
            }
            break;
          case 39:
            if ((submenu = $('.submenu', entry)) && (next = submenu.firstElementChild)) {
              while (nextPrev = this.findNextEntry(next, -1)) {
                next = nextPrev;
              }
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
        var el, style, subEntries, subEntry, _i, _len;
        el = entry.el, subEntries = entry.subEntries;
        $.addClass(el, 'entry');
        $.on(el, 'focus mouseover', (function(e) {
          e.stopPropagation();
          return this.focus(el);
        }).bind(this));
        style = el.style;
        style.webkitOrder = style.order = entry.order || 100;
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
      if (e.type === 'mousedown' && e.button !== 0) {
        return;
      }
      e.preventDefault();
      el = $.x('ancestor::div[contains(@class,"dialog")][1]', this);
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
    hoverstart = function(_arg) {
      var asap, asapTest, cb, el, endEvents, event, latestEvent, o, root, _i, _len, _ref;
      root = _arg.root, el = _arg.el, latestEvent = _arg.latestEvent, endEvents = _arg.endEvents, asapTest = _arg.asapTest, cb = _arg.cb;
      o = {
        root: root,
        el: el,
        style: el.style,
        cb: cb,
        endEvents: endEvents.split(' '),
        latestEvent: latestEvent,
        clientHeight: doc.clientHeight,
        clientWidth: doc.clientWidth
      };
      o.hover = hover.bind(o);
      o.hoverend = hoverend.bind(o);
      asap = function() {
        if (asapTest()) {
          return o.hover(o.latestEvent);
        } else {
          return o.timeout = setTimeout(asap, 25);
        }
      };
      asap();
      _ref = o.endEvents;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        root.addEventListener(event, o.hoverend, false);
      }
      return root.addEventListener('mousemove', o.hover, false);
    };
    hover = function(e) {
      var clientX, clientY, height, left, right, style, top;
      this.latestEvent = e;
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
      _ref = this.endEvents;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.root.removeEventListener(event, this.hoverend, false);
      }
      this.root.removeEventListener('mousemove', this.hover, false);
      clearTimeout(this.timeout);
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
    return __slice.call(root.querySelectorAll(selector));
  };

  $.extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
  };

  $.extend(Array.prototype, {
    add: function(object, position) {
      var keep;
      keep = this.slice(position);
      this.length = position;
      this.push(object);
      return this.pushArrays(keep);
    },
    contains: function(object) {
      return this.indexOf(object) > -1;
    },
    indexOf: function(object) {
      var i;
      i = this.length;
      while (i--) {
        if (this[i] === object) {
          break;
        }
      }
      return i;
    },
    pushArrays: function() {
      var arg, args, _i, _len;
      args = arguments;
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        this.push.apply(this, arg);
      }
      return this;
    },
    remove: function(object) {
      var index;
      if ((index = this.indexOf(object)) > -1) {
        return this.splice(index, 1);
      } else {
        return false;
      }
    }
  });

  $.extend(String.prototype, {
    capitalize: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    contains: function(string) {
      return this.indexOf(string) > -1;
    }
  });

  $.DAY = 24 * ($.HOUR = 60 * ($.MINUTE = 60 * ($.SECOND = 1000)));

  $.extend($, {
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
        if (!val) {
          continue;
        }
        if (val.size && val.name) {
          fd.append(key, val, val.name);
        } else {
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
      $.asap((function() {
        return d.head;
      }), function() {
        return $.add(d.head, style);
      });
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
    event: function(event, detail, root) {
      if (root == null) {
        root = d;
      }
      return root.dispatchEvent(new CustomEvent(event, {
        bubbles: true,
        detail: detail
      }));
    },
    open: (function() {
      if (typeof GM_openInTab !== "undefined" && GM_openInTab !== null) {
        return function(URL) {
          var a;
          a = $.el('a', {
            href: URL
          });
          return GM_openInTab(a.href);
        };
      } else {
        return function(URL) {
          return window.open(URL, '_blank');
        };
      }
    })(),
    debounce: function(wait, fn) {
      var args, exec, that, timeout;
      timeout = null;
      that = null;
      args = null;
      exec = function() {
        fn.apply(that, args);
        return timeout = null;
      };
      return function() {
        args = arguments;
        that = this;
        if (timeout) {
          clearTimeout(timeout);
        } else {
          exec();
        }
        return timeout = setTimeout(exec, wait);
      };
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

  if (typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null) {
    $["delete"] = function(name) {
      return GM_deleteValue(g.NAMESPACE + name);
    };
    $.get = function(name, defaultValue) {
      var value;
      if (value = GM_getValue(g.NAMESPACE + name)) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    };
    $.set = function(name, value) {
      name = g.NAMESPACE + name;
      value = JSON.stringify(value);
      localStorage.setItem(name, value);
      return GM_setValue(name, value);
    };
  } else if (window.opera) {
    (function() {
      var scriptStorage;
      scriptStorage = opera.scriptStorage;
      $["delete"] = function(name) {
        return delete scriptStorage[g.NAMESPACE + name];
      };
      $.get = function(name, defaultValue) {
        var value;
        if (value = scriptStorage[g.NAMESPACE + name]) {
          return JSON.parse(value);
        } else {
          return defaultValue;
        }
      };
      return $.set = function(name, value) {
        name = g.NAMESPACE + name;
        value = JSON.stringify(value);
        localStorage.setItem(name, value);
        return scriptStorage[name] = value;
      };
    })();
  } else {
    $["delete"] = function(name) {
      return localStorage.removeItem(g.NAMESPACE + name);
    };
    $.get = function(name, defaultValue) {
      var value;
      if (value = localStorage.getItem(g.NAMESPACE + name)) {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    };
    $.set = function(name, value) {
      return localStorage.setItem(g.NAMESPACE + name, JSON.stringify(value));
    };
  }

  Polyfill = {
    init: function() {
      return Polyfill.visibility();
    },
    visibility: function() {
      var event, prefix, property;
      if ('visibilityState' in document) {
        return;
      }
      if ('webkitVisibilityState' in document) {
        prefix = 'webkit';
      } else if ('mozVisibilityState' in document) {
        prefix = 'moz';
      } else {
        return;
      }
      property = prefix + 'VisibilityState';
      event = prefix + 'visibilitychange';
      d.visibilityState = d[property];
      d.hidden = d.visibilityState === 'hidden';
      return $.on(d, event, function() {
        d.visibilityState = d[property];
        d.hidden = d.visibilityState === 'hidden';
        return $.event('visibilitychange');
      });
    }
  };

  Header = {
    init: function() {
      var catalogToggler, headerEl;
      headerEl = $.el('div', {
        id: 'header',
        innerHTML: "<div id=header-bar class=dialog>\n  <span class='menu-button brackets-wrap'><a href=javascript:;><i></i></a></span>\n  <span id=shortcuts class=brackets-wrap></span>\n  <span id=board-list>\n    <span id=custom-board-list></span>\n    <span id=full-board-list hidden></span>\n  </span>\n  <div id=toggle-header-bar title=\"Toggle the header auto-hiding.\"></div>\n</div>\n<div id=notifications></div>".replace(/>\s+</g, '><')
      });
      this.bar = $('#header-bar', headerEl);
      this.setBarVisibility(Conf['Header auto-hide']);
      $.sync('Header auto-hide', this.setBarVisibility);
      this.menu = new UI.Menu('header');
      $.on($('.menu-button', this.bar), 'click', this.menuToggle);
      $.on($('#toggle-header-bar', this.bar), 'click', this.toggleBarVisibility);
      catalogToggler = $.el('label', {
        innerHTML: "<input type=checkbox " + (Conf['Header catalog links'] ? 'checked' : '') + "> Use catalog board links"
      });
      $.on(catalogToggler.firstElementChild, 'change', this.toggleCatalogLinks);
      $.sync('Header catalog links', this.setCatalogLinks);
      $.event('AddMenuEntry', {
        type: 'header',
        el: catalogToggler,
        order: 50
      });
      return $.asap((function() {
        return d.body;
      }), function() {
        if (!Main.isThisPageLegit()) {
          return;
        }
        $.asap((function() {
          return $.id('boardNavMobile');
        }), Header.setBoardList);
        return $.prepend(d.body, headerEl);
      });
    },
    setBoardList: function() {
      var a, btn, fullBoardList, nav;
      nav = $.id('boardNavDesktop');
      if (a = $("a[href*='/" + g.BOARD + "/']", nav)) {
        a.className = 'current';
      }
      fullBoardList = $('#full-board-list', Header.bar);
      $.add(fullBoardList, __slice.call(nav.childNodes));
      if (Conf['Custom Board Navigation']) {
        Header.generateBoardList(Conf['boardnav']);
        $.sync('boardnav', Header.generateBoardList);
        btn = $.el('span', {
          className: 'hide-board-list-button brackets-wrap',
          innerHTML: '<a href=javascript:;> - </a>'
        });
        $.on(btn, 'click', Header.toggleBoardList);
        $.prepend(fullBoardList, btn);
      } else {
        $.rm($('#custom-board-list', Header.bar));
        fullBoardList.hidden = false;
      }
      return Header.setCatalogLinks(Conf['Header catalog links']);
    },
    generateBoardList: function(text) {
      var as, list, nodes;
      list = $('#custom-board-list', Header.bar);
      list.innerHTML = null;
      if (!text) {
        return;
      }
      as = $$('#full-board-list a', Header.bar).slice(0, -2);
      nodes = text.match(/[\w@]+(-(all|title|full|text:"[^"]+"))?|[^\w@]+/g).map(function(t) {
        var a, board, m, _i, _len;
        if (/^[^\w@]/.test(t)) {
          return $.tn(t);
        }
        if (t === 'toggle-all') {
          a = $.el('a', {
            className: 'show-board-list-button',
            textContent: '+',
            href: 'javascript:;'
          });
          $.on(a, 'click', Header.toggleBoardList);
          return a;
        }
        board = /^current/.test(t) ? g.BOARD.ID : t.match(/^[^-]+/)[0];
        for (_i = 0, _len = as.length; _i < _len; _i++) {
          a = as[_i];
          if (a.textContent === board) {
            a = a.cloneNode(true);
            if (/-title$/.test(t)) {
              a.textContent = a.title;
            } else if (/-full$/.test(t)) {
              a.textContent = "/" + board + "/ - " + a.title;
            } else if (m = t.match(/-text:"(.+)"$/)) {
              a.textContent = m[1];
            } else if (board === '@') {
              $.addClass(a, 'navSmall');
            }
            return a;
          }
        }
        return $.tn(t);
      });
      return $.add(list, nodes);
    },
    toggleBoardList: function() {
      var bar, custom, full, showBoardList;
      bar = Header.bar;
      custom = $('#custom-board-list', bar);
      full = $('#full-board-list', bar);
      showBoardList = !full.hidden;
      custom.hidden = !showBoardList;
      return full.hidden = showBoardList;
    },
    setCatalogLinks: function(useCatalog) {
      var a, as, str, _i, _len;
      as = $$('#board-list a[href*="boards.4chan.org"]', Header.bar);
      str = useCatalog ? 'catalog' : '';
      for (_i = 0, _len = as.length; _i < _len; _i++) {
        a = as[_i];
        a.pathname = "/" + (a.pathname.split('/')[1]) + "/" + str;
      }
    },
    toggleCatalogLinks: function() {
      Header.setCatalogLinks(this.checked);
      return $.set('Header catalog links', this.checked);
    },
    setBarVisibility: function(hide) {
      return (hide ? $.addClass : $.rmClass)(Header.bar, 'autohide');
    },
    toggleBarVisibility: function() {
      var hide, message;
      hide = !$.hasClass(Header.bar, 'autohide');
      Header.setBarVisibility(hide);
      message = hide ? 'The header bar will automatically hide itself.' : 'The header bar will remain visible.';
      new Notification('info', message, 2);
      return $.set('Header auto-hide', hide);
    },
    addShortcut: function(el) {
      var shortcut;
      shortcut = $.el('span', {
        className: 'shortcut'
      });
      $.add(shortcut, el);
      return $.prepend($('#shortcuts', Header.bar), shortcut);
    },
    menuToggle: function(e) {
      return Header.menu.toggle(e, this, g);
    }
  };

  Notification = (function() {
    var add, close;

    function Notification(type, content, timeout) {
      this.timeout = timeout;
      this.add = add.bind(this);
      this.close = close.bind(this);
      this.el = $.el('div', {
        innerHTML: '<a href=javascript:; class=close title=Close>×</a><div class=message></div>'
      });
      this.el.style.opacity = 0;
      this.setType(type);
      $.on(this.el.firstElementChild, 'click', this.close);
      if (typeof content === 'string') {
        content = $.tn(content);
      }
      $.add(this.el.lastElementChild, content);
      $.ready(this.add);
    }

    Notification.prototype.setType = function(type) {
      return this.el.className = "notification " + type;
    };

    add = function() {
      if (d.hidden) {
        $.on(d, 'visibilitychange', this.add);
        return;
      }
      $.off(d, 'visibilitychange', this.add);
      $.add($.id('notifications'), this.el);
      this.el.clientHeight;
      this.el.style.opacity = 1;
      if (this.timeout) {
        return setTimeout(this.close, this.timeout * $.SECOND);
      }
    };

    close = function() {
      if (this.el.parentNode) {
        return $.rm(this.el);
      }
    };

    return Notification;

  })();

  Settings = {
    init: function() {
      var link, settings;
      link = $.el('a', {
        className: 'settings-link',
        textContent: '4chan X Beta Settings',
        href: 'javascript:;'
      });
      $.on(link, 'click', Settings.open);
      $.event('AddMenuEntry', {
        type: 'header',
        el: link,
        order: 111
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
        order: 110,
        open: function() {
          return Conf['Enable 4chan\'s Extension'];
        }
      });
      if (!$.get('previousversion')) {
        $.set('previousversion', g.VERSION);
        $.on(d, '4chanXInitFinished', Settings.open);
      }
      Settings.addSection('Main', Settings.main);
      Settings.addSection('Filter', Settings.filter);
      Settings.addSection('Sauce', Settings.sauce);
      Settings.addSection('Rice', Settings.rice);
      Settings.addSection('Keybinds', Settings.keybinds);
      $.on(d, 'AddSettingsSection', Settings.addSection);
      $.on(d, 'OpenSettings', function(e) {
        return Settings.open(e.detail);
      });
      if (Conf['Enable 4chan\'s Extension']) {
        return;
      }
      settings = JSON.parse(localStorage.getItem('4chan-settings')) || {};
      if (settings.disableAll) {
        return;
      }
      settings.disableAll = true;
      return localStorage.setItem('4chan-settings', JSON.stringify(settings));
    },
    open: function(openSection) {
      var html, link, links, overlay, section, sectionToOpen, _i, _len, _ref;
      if (Settings.dialog) {
        return;
      }
      $.event('CloseMenu');
      html = "<div id=fourchanx-settings class=dialog>\n  <nav>\n    <div class=sections-list></div>\n    <div class=credits>\n      <a href='http://mayhemydg.github.com/4chan-x/' target=_blank>4chan X Beta</a> |\n      <a href='https://github.com/MayhemYDG/4chan-x/blob/v3/CHANGELOG.md#" + (g.VERSION.replace(/\./g, '')) + "' target=_blank>" + g.VERSION + "</a> |\n      <a href='https://github.com/MayhemYDG/4chan-x/blob/v3/CONTRIBUTING.md#reporting-bugs' target=_blank>Issues</a> |\n      <a href=javascript:; class=close title=Close>×</a>\n    </div>\n  </nav>\n  <hr>\n  <div class=section-container><section></section></div>\n</div>";
      Settings.dialog = overlay = $.el('div', {
        id: 'overlay',
        innerHTML: html
      });
      links = [];
      _ref = Settings.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        link = $.el('a', {
          textContent: section.title,
          href: 'javascript:;'
        });
        $.on(link, 'click', Settings.openSection.bind(section));
        links.push(link, $.tn(' | '));
        if (section.title === openSection) {
          sectionToOpen = link;
        }
      }
      links.pop();
      if (sectionToOpen) {
        sectionToOpen.click();
      } else {
        links[0].click();
      }
      $.add($('.sections-list', overlay), links);
      $.on($('.close', overlay), 'click', Settings.close);
      $.on(overlay, 'click', Settings.close);
      $.on(overlay.firstElementChild, 'click', function(e) {
        return e.stopPropagation();
      });
      d.body.style.width = "" + d.body.clientWidth + "px";
      $.addClass(d.body, 'unscroll');
      return $.add(d.body, overlay);
    },
    close: function() {
      if (!Settings.dialog) {
        return;
      }
      d.body.style.removeProperty('width');
      $.rmClass(d.body, 'unscroll');
      $.rm(Settings.dialog);
      return delete Settings.dialog;
    },
    sections: [],
    addSection: function(title, open) {
      var _ref;
      if (typeof title !== 'string') {
        _ref = title.detail, title = _ref.title, open = _ref.open;
      }
      return Settings.sections.push({
        title: title,
        open: open
      });
    },
    openSection: function() {
      var section;
      section = $('section', Settings.dialog);
      section.innerHTML = null;
      section.className = "section-" + (this.title.toLowerCase().replace(/\s+/g, '-'));
      this.open(section, g);
      return section.scrollTop = 0;
    },
    main: function(section) {
      var ID, arr, checked, description, div, fs, hiddenNum, key, obj, post, thread, _ref, _ref1, _ref2;
      section.innerHTML = "<div class=imp-exp>\n  <button class=export>Export Settings</button>\n  <button class=import>Import Settings</button>\n  <input type=file style='visibility:hidden'>\n</div>\n<p class=imp-exp-result></p>";
      $.on($('.export', section), 'click', Settings["export"]);
      $.on($('.import', section), 'click', Settings["import"]);
      $.on($('input', section), 'change', Settings.onImport);
      _ref = Config.main;
      for (key in _ref) {
        obj = _ref[key];
        fs = $.el('fieldset', {
          innerHTML: "<legend>" + key + "</legend>"
        });
        for (key in obj) {
          arr = obj[key];
          checked = $.get(key, Conf[key]) ? 'checked' : '';
          description = arr[1];
          div = $.el('div', {
            innerHTML: "<label><input type=checkbox name=\"" + key + "\" " + checked + ">" + key + "</label><span class=description>: " + description + "</span>"
          });
          $.on($('input', div), 'click', $.cb.checked);
          $.add(fs, div);
        }
        $.add(section, fs);
      }
      hiddenNum = 0;
      _ref1 = ThreadHiding.getHiddenThreads().threads;
      for (ID in _ref1) {
        thread = _ref1[ID];
        hiddenNum++;
      }
      _ref2 = ReplyHiding.getHiddenPosts().threads;
      for (ID in _ref2) {
        thread = _ref2[ID];
        for (ID in thread) {
          post = thread[ID];
          hiddenNum++;
        }
      }
      div = $.el('div', {
        innerHTML: "<button>Hidden: " + hiddenNum + "</button><span class=description>: Clear manually hidden threads and posts on /" + g.BOARD + "/."
      });
      $.on($('button', div), 'click', function() {
        this.textContent = 'Hidden: 0';
        $["delete"]("hiddenThreads." + g.BOARD);
        return $["delete"]("hiddenPosts." + g.BOARD);
      });
      return $.after($('input[name="Stubs"]', section).parentNode.parentNode, div);
    },
    "export": function() {
      var a, data, now, output;
      now = Date.now();
      data = {
        version: g.VERSION,
        date: now,
        Conf: Conf,
        WatchedThreads: $.get('WatchedThreads', {})
      };
      a = $.el('a', {
        className: 'warning',
        textContent: 'Save me!',
        download: "4chan X Beta v" + g.VERSION + "-" + now + ".json",
        href: "data:application/json;base64," + (btoa(unescape(encodeURIComponent(JSON.stringify(data))))),
        target: '_blank'
      });
      if ($.engine !== 'gecko') {
        a.click();
        return;
      }
      output = this.parentNode.nextElementSibling;
      output.innerHTML = null;
      return $.add(output, a);
    },
    "import": function() {
      return this.nextElementSibling.click();
    },
    onImport: function() {
      var file, output, reader;
      if (!(file = this.files[0])) {
        return;
      }
      output = this.parentNode.nextElementSibling;
      if (!confirm('Your current settings will be entirely overwritten, are you sure?')) {
        output.textContent = 'Import aborted.';
        return;
      }
      reader = new FileReader();
      reader.onload = function(e) {
        var data;
        try {
          data = JSON.parse(decodeURIComponent(escape(e.target.result)));
          Settings.loadSettings(data);
          if (confirm('Import successful. Refresh now?')) {
            return window.location.reload();
          }
        } catch (err) {
          output.textContent = 'Import failed due to an error.';
          return c.log(err.stack);
        }
      };
      return reader.readAsText(file);
    },
    loadSettings: function(data) {
      var key, val, version, _ref, _ref1;
      version = data.version.split('.');
      if (version[0] === '2') {
        data = Settings.convertSettings(data, {
          'Disable 4chan\'s extension': '',
          'Catalog Links': '',
          'Reply Navigation': '',
          'Show Stubs': 'Stubs',
          'Image Auto-Gif': 'Auto-GIF',
          'Expand From Current': '',
          'Unread Favicon': 'Unread Tab Icon',
          'Post in Title': 'Thread Excerpt',
          'Auto Hide QR': '',
          'Open Reply in New Tab': '',
          'Remember QR size': '',
          'Quote Inline': 'Quote Inlining',
          'Quote Preview': 'Quote Previewing',
          'Indicate OP quote': 'Mark OP Quotes',
          'Indicate Cross-thread Quotes': 'Mark Cross-thread Quotes',
          'uniqueid': 'uniqueID',
          'mod': 'capcode',
          'country': 'flag',
          'md5': 'MD5',
          'openEmptyQR': 'Open empty QR',
          'openQR': 'Open QR',
          'openOptions': 'Open settings',
          'close': 'Close',
          'spoiler': 'Spoiler tags',
          'code': 'Code tags',
          'submit': 'Submit QR',
          'watch': 'Watch',
          'update': 'Update',
          'unreadCountTo0': '',
          'expandAllImages': 'Expand images',
          'expandImage': 'Expand image',
          'zero': 'Front page',
          'nextPage': 'Next page',
          'previousPage': 'Previous page',
          'nextThread': 'Next thread',
          'previousThread': 'Previous thread',
          'expandThread': 'Expand thread',
          'openThreadTab': 'Open thread',
          'openThread': 'Open thread tab',
          'nextReply': 'Next reply',
          'previousReply': 'Previous reply',
          'hide': 'Hide',
          'Scrolling': 'Auto Scroll',
          'Verbose': ''
        });
        data.Conf.sauces = data.Conf.sauces.replace(/\$\d/g, function(c) {
          switch (c) {
            case '$1':
              return '%TURL';
            case '$2':
              return '%URL';
            case '$3':
              return '%MD5';
            case '$4':
              return '%board';
            default:
              return c;
          }
        });
        _ref = Config.hotkeys;
        for (key in _ref) {
          val = _ref[key];
          if (!(key in data.Conf)) {
            continue;
          }
          data.Conf[key] = data.Conf[key].replace(/ctrl|alt|meta/g, function(s) {
            return "" + (s[0].toUpperCase()) + s.slice(1);
          }).replace(/(^|.+\+)[A-Z]$/g, function(s) {
            return "Shift+" + s.slice(0, -1) + (s.slice(-1).toLowerCase());
          });
        }
      }
      _ref1 = data.Conf;
      for (key in _ref1) {
        val = _ref1[key];
        $.set(key, val);
      }
      return $.set('WatchedThreads', data.WatchedThreads);
    },
    convertSettings: function(data, map) {
      var newKey, prevKey;
      for (prevKey in map) {
        newKey = map[prevKey];
        if (newKey) {
          data.Conf[newKey] = data.Conf[prevKey];
        }
        delete data.Conf[prevKey];
      }
      return data;
    },
    filter: function(section) {
      var select;
      section.innerHTML = "<select name=filter>\n  <option value=guide>Guide</option>\n  <option value=name>Name</option>\n  <option value=uniqueID>Unique ID</option>\n  <option value=tripcode>Tripcode</option>\n  <option value=capcode>Capcode</option>\n  <option value=email>E-mail</option>\n  <option value=subject>Subject</option>\n  <option value=comment>Comment</option>\n  <option value=flag>Flag</option>\n  <option value=filename>Filename</option>\n  <option value=dimensions>Image dimensions</option>\n  <option value=filesize>Filesize</option>\n  <option value=MD5>Image MD5</option>\n</select>\n<div></div>";
      select = $('select', section);
      $.on(select, 'change', Settings.selectFilter);
      return Settings.selectFilter.call(select);
    },
    selectFilter: function() {
      var div, name, ta;
      div = this.nextElementSibling;
      if ((name = this.value) !== 'guide') {
        div.innerHTML = null;
        ta = $.el('textarea', {
          name: name,
          className: 'field',
          value: $.get(name, Conf[name]),
          spellcheck: false
        });
        $.on(ta, 'change', $.cb.value);
        $.add(div, ta);
        return;
      }
      return div.innerHTML = "<div class=warning " + (Conf['Sauce'] ? 'hidden' : '') + "><code>Filter</code> is disabled.</div>\n<p>\n  Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>\n  Lines starting with a <code>#</code> will be ignored.<br>\n  For example, <code>/weeaboo/i</code> will filter posts containing the string `<code>weeaboo</code>`, case-insensitive.<br>\n  MD5 filtering uses exact string matching, not regular expressions.\n</p>\n<ul>You can use these settings with each regular expression, separate them with semicolons:\n  <li>\n    Per boards, separate them with commas. It is global if not specified.<br>\n    For example: <code>boards:a,jp;</code>.\n  </li>\n  <li>\n    Filter OPs only along with their threads (`only`), replies only (`no`), or both (`yes`, this is default).<br>\n    For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.\n  </li>\n  <li>\n    Overrule the `Show Stubs` setting if specified: create a stub (`yes`) or not (`no`).<br>\n    For example: <code>stub:yes;</code> or <code>stub:no;</code>.\n  </li>\n  <li>\n    Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>\n    For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.\n  </li>\n  <li>\n    Highlighted OPs will have their threads put on top of board pages by default.<br>\n    For example: <code>top:yes;</code> or <code>top:no;</code>.\n  </li>\n</ul>";
    },
    sauce: function(section) {
      var sauce;
      section.innerHTML = "<div class=warning " + (Conf['Sauce'] ? 'hidden' : '') + "><code>Sauce</code> is disabled.</div>\n<div>Lines starting with a <code>#</code> will be ignored.</div>\n<div>You can specify a display text by appending <code>;text:[text]</code> to the URL.</div>\n<ul>These parameters will be replaced by their corresponding values:\n  <li><code>%TURL</code>: Thumbnail URL.</li>\n  <li><code>%URL</code>: Full image URL.</li>\n  <li><code>%MD5</code>: MD5 hash.</li>\n  <li><code>%board</code>: Current board.</li>\n</ul>\n<textarea name=sauces class=field spellcheck=false></textarea>";
      sauce = $('textarea', section);
      sauce.value = $.get('sauces', Conf['sauces']);
      return $.on(sauce, 'change', $.cb.value);
    },
    rice: function(section) {
      var event, input, name, _i, _len, _ref;
      section.innerHTML = "<fieldset>\n  <legend>Custom Board Navigation <span class=warning " + (Conf['Custom Board Navigation'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=boardnav class=field spellcheck=false></div>\n  <div>In the following, <code>board</code> can translate to a board ID (<code>a</code>, <code>b</code>, etc...), the current board (<code>current</code>), or the Status/Twitter link (<code>status</code>, <code>@</code>).</div>\n  <div>Board link: <code>board</code></div>\n  <div>Title link: <code>board-title</code></div>\n  <div>Full text link: <code>board-full</code></div>\n  <div>Custom text link: <code>board-text:\"VIP Board\"</code></div>\n  <div>Full board list toggle: <code>toggle-all</code></div>\n</fieldset>\n\n<fieldset>\n  <legend>Time Formatting <span class=warning " + (Conf['Time Formatting'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=time class=field spellcheck=false>: <span class=time-preview></span></div>\n  <div>Supported <a href=//en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</div>\n  <div>Day: <code>%a</code>, <code>%A</code>, <code>%d</code>, <code>%e</code></div>\n  <div>Month: <code>%m</code>, <code>%b</code>, <code>%B</code></div>\n  <div>Year: <code>%y</code></div>\n  <div>Hour: <code>%k</code>, <code>%H</code>, <code>%l</code>, <code>%I</code>, <code>%p</code>, <code>%P</code></div>\n  <div>Minute: <code>%M</code></div>\n  <div>Second: <code>%S</code></div>\n</fieldset>\n\n<fieldset>\n  <legend>Quote Backlinks formatting <span class=warning " + (Conf['Quote Backlinks'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=backlink class=field spellcheck=false>: <span class=backlink-preview></span></div>\n</fieldset>\n\n<fieldset>\n  <legend>File Info Formatting <span class=warning " + (Conf['File Info Formatting'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=fileInfo class=field spellcheck=false>: <span class='fileText file-info-preview'></span></div>\n  <div>Link: <code>%l</code> (truncated), <code>%L</code> (untruncated), <code>%T</code> (Unix timestamp)</div>\n  <div>Original file name: <code>%n</code> (truncated), <code>%N</code> (untruncated), <code>%t</code> (Unix timestamp)</div>\n  <div>Spoiler indicator: <code>%p</code></div>\n  <div>Size: <code>%B</code> (Bytes), <code>%K</code> (KB), <code>%M</code> (MB), <code>%s</code> (4chan default)</div>\n  <div>Resolution: <code>%r</code> (Displays 'PDF' for PDF files)</div>\n</fieldset>\n\n<fieldset>\n  <legend>Unread Tab Icon <span class=warning " + (Conf['Unread Tab Icon'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <select name=favicon>\n    <option value=ferongr>ferongr</option>\n    <option value=xat->xat-</option>\n    <option value=Mayhem>Mayhem</option>\n    <option value=Original>Original</option>\n  </select>\n  <span class=favicon-preview></span>\n</fieldset>\n\n<fieldset>\n  <legend>Custom CSS <span class=warning " + (Conf['Custom CSS'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <button id=apply-css>Apply CSS</button>\n  <textarea name=usercss class=field spellcheck=false></textarea>\n</fieldset>";
      _ref = ['boardnav', 'time', 'backlink', 'fileInfo', 'favicon', 'usercss'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        input = $("[name=" + name + "]", section);
        input.value = $.get(name, Conf[name]);
        event = ['favicon', 'usercss'].contains(name) ? 'change' : 'input';
        $.on(input, event, $.cb.value);
        if ('usercss' !== name) {
          $.on(input, event, Settings[name]);
          Settings[name].call(input);
        }
      }
      return $.on($.id('apply-css'), 'click', Settings.usercss);
    },
    boardnav: function() {
      return Header.generateBoardList(this.value);
    },
    time: function() {
      var funk;
      funk = Time.createFunc(this.value);
      return this.nextElementSibling.textContent = funk(Time, new Date());
    },
    backlink: function() {
      return this.nextElementSibling.textContent = Conf['backlink'].replace(/%id/, '123456789');
    },
    fileInfo: function() {
      var data, funk;
      data = {
        isReply: true,
        file: {
          URL: '//images.4chan.org/g/src/1334437723720.jpg',
          name: 'd9bb2efc98dd0df141a94399ff5880b7.jpg',
          size: '276 KB',
          sizeInBytes: 276 * 1024,
          dimensions: '1280x720',
          isImage: true,
          isSpoiler: true
        }
      };
      funk = FileInfo.createFunc(this.value);
      return this.nextElementSibling.innerHTML = funk(FileInfo, data);
    },
    favicon: function() {
      Favicon["switch"]();
      if (g.VIEW === 'thread' && Conf['Unread Tab Icon']) {
        Unread.update();
      }
      return this.nextElementSibling.innerHTML = "<img src=" + Favicon.unreadSFW + "> <img src=" + Favicon.unreadNSFW + "> <img src=" + Favicon.unreadDead + ">";
    },
    usercss: function() {
      if (Conf['Custom CSS']) {
        return CustomCSS.update();
      } else {
        return CustomCSS.rmStyle();
      }
    },
    keybinds: function(section) {
      var arr, input, key, tbody, tr, _ref;
      section.innerHTML = "<div class=warning " + (Conf['Keybinds'] ? 'hidden' : '') + "><code>Keybinds</code> are disabled.</div>\n<div>Allowed keys: <kbd>a-z</kbd>, <kbd>0-9</kbd>, <kbd>Ctrl</kbd>, <kbd>Shift</kbd>, <kbd>Alt</kbd>, <kbd>Meta</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Up</kbd>, <kbd>Down</kbd>, <kbd>Right</kbd>, <kbd>Left</kbd>.</div>\n<div>Press <kbd>Backspace</kbd> to disable a keybind.</div>\n<table><tbody>\n  <tr><th>Actions</th><th>Keybinds</th></tr>\n</tbody></table>";
      tbody = $('tbody', section);
      _ref = Config.hotkeys;
      for (key in _ref) {
        arr = _ref[key];
        tr = $.el('tr', {
          innerHTML: "<td>" + arr[1] + "</td><td><input class=field></td>"
        });
        input = $('input', tr);
        input.name = key;
        input.value = $.get(key, Conf[key]);
        input.spellcheck = false;
        $.on(input, 'keydown', Settings.keybind);
        $.add(tbody, tr);
      }
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
    }
  };

  Fourchan = {
    init: function() {
      var board;
      if (g.VIEW === 'catalog') {
        return;
      }
      board = g.BOARD.ID;
      if (board === 'g') {
        Post.prototype.callbacks.push({
          name: 'Parse /g/ code',
          cb: this.code
        });
      }
      if (board === 'sci') {
        return Post.prototype.callbacks.push({
          name: 'Parse /sci/ math',
          cb: this.math
        });
      }
    },
    code: function() {
      var pre, _i, _len, _ref;
      if (this.isClone) {
        return;
      }
      _ref = $$('.prettyprint', this.nodes.comment);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pre = _ref[_i];
        pre.innerHTML = $.unsafeWindow.prettyPrintOne(pre.innerHTML);
      }
    },
    math: function() {
      var jsMath;
      if (this.isClone || !$('.math', this.nodes.comment)) {
        return;
      }
      jsMath = $.unsafeWindow.jsMath;
      if (jsMath) {
        if (jsMath.loaded) {
          return jsMath.ProcessBeforeShowing(this.nodes.post);
        } else {
          return $.globalEval("jsMath.Autoload.Script.Push('ProcessBeforeShowing', [null]);\njsMath.Autoload.LoadJsMath();");
        }
      }
    },
    parseThread: function(threadID, offset, limit) {
      return $.event('4chanParsingDone', {
        threadId: threadID,
        offset: offset,
        limit: limit
      });
    }
  };

  CustomCSS = {
    init: function() {
      if (!Conf['Custom CSS']) {
        return;
      }
      return this.addStyle();
    },
    addStyle: function() {
      return this.style = $.addStyle(Conf['usercss']);
    },
    rmStyle: function() {
      if (this.style) {
        $.rm(this.style);
        return delete this.style;
      }
    },
    update: function() {
      if (!this.style) {
        this.addStyle();
      }
      return this.style.textContent = Conf['usercss'];
    }
  };

  Filter = {
    filters: {},
    init: function() {
      var boards, filter, hl, key, op, regexp, stub, top, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
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
          if (boards !== 'global' && !(boards.split(',')).contains(g.BOARD.ID)) {
            continue;
          }
          if (['uniqueID', 'MD5'].contains(key)) {
            regexp = regexp[1];
          } else {
            try {
              regexp = RegExp(regexp[1], regexp[2]);
            } catch (err) {
              new Notification('warning', err.message, 60);
              continue;
            }
          }
          op = ((_ref2 = filter.match(/[^t]op:(yes|no|only)/)) != null ? _ref2[1] : void 0) || 'yes';
          stub = (function() {
            var _ref3;
            switch ((_ref3 = filter.match(/stub:(yes|no)/)) != null ? _ref3[1] : void 0) {
              case 'yes':
                return true;
              case 'no':
                return false;
              default:
                return Conf['Stubs'];
            }
          })();
          if (hl = /highlight/.test(filter)) {
            hl = ((_ref3 = filter.match(/highlight:(\w+)/)) != null ? _ref3[1] : void 0) || 'filter-highlight';
            top = ((_ref4 = filter.match(/top:(yes|no)/)) != null ? _ref4[1] : void 0) || 'yes';
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
        name: 'Filter',
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
          order: 50,
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
        var re, save, section, select, ta, tl, type, value;
        type = this.dataset.type;
        value = Filter[type](Filter.menu.post);
        re = ['uniqueID', 'MD5'].contains(type) ? value : value.replace(/\/|\\|\^|\$|\n|\.|\(|\)|\{|\}|\[|\]|\?|\*|\+|\|/g, function(c) {
          if (c === '\n') {
            return '\\n';
          } else if (c === '\\') {
            return '\\\\';
          } else {
            return "\\" + c;
          }
        });
        re = ['uniqueID', 'MD5'].contains(type) ? "/" + re + "/" : "/^" + re + "$/";
        if (!Filter.menu.post.isReply) {
          re += ';op:yes';
        }
        save = $.get(type, '');
        save = save ? "" + save + "\n" + re : re;
        $.set(type, save);
        Settings.open('Filter');
        section = $('.section-container');
        select = $('select[name=filter]', section);
        select.value = type;
        Settings.selectFilter.call(select);
        ta = $('textarea', section);
        tl = ta.textLength;
        ta.setSelectionRange(tl, tl);
        return ta.focus();
      }
    }
  };

  ThreadHiding = {
    init: function() {
      if (g.VIEW !== 'index' || !Conf['Thread Hiding']) {
        return;
      }
      Misc.clearThreads("hiddenThreads." + g.BOARD);
      this.getHiddenThreads();
      this.syncFromCatalog();
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
      if (!Conf['Hiding Buttons']) {
        return;
      }
      return $.prepend(this.OP.nodes.root, ThreadHiding.makeButton(this, 'hide'));
    },
    getHiddenThreads: function() {
      return ThreadHiding.hiddenThreads = $.get("hiddenThreads." + g.BOARD, {
        threads: {}
      });
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
      if (Object.keys(threads).length) {
        return $.set("hiddenThreads." + g.BOARD, ThreadHiding.hiddenThreads);
      } else {
        return $["delete"]("hiddenThreads." + g.BOARD);
      }
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
          order: 20,
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
        return $.event('CloseMenu');
      }
    },
    makeButton: function(thread, type) {
      var a;
      a = $.el('a', {
        className: "" + type + "-thread-button",
        innerHTML: "<span>[&nbsp;" + (type === 'hide' ? '-' : '+') + "&nbsp;]</span>",
        href: 'javascript:;'
      });
      a.setAttribute('data-fullid', thread.fullID);
      $.on(a, 'click', ThreadHiding.toggle);
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
      if (!(thread instanceof Thread)) {
        thread = g.threads[this.dataset.fullid];
      }
      if (thread.isHidden) {
        ThreadHiding.show(thread);
      } else {
        ThreadHiding.hide(thread);
      }
      return ThreadHiding.saveHiddenState(thread);
    },
    hide: function(thread, makeStub) {
      var OP, a, numReplies, opInfo, span, threadRoot;
      if (makeStub == null) {
        makeStub = Conf['Stubs'];
      }
      if (thread.hidden) {
        return;
      }
      OP = thread.OP;
      threadRoot = OP.nodes.root.parentNode;
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
      opInfo = Conf['Anonymize'] ? 'Anonymous' : $('.nameBlock', OP.nodes.info).textContent;
      a = ThreadHiding.makeButton(thread, 'show');
      $.add(a, $.tn(" " + opInfo + " (" + numReplies + ")"));
      thread.stub = $.el('div', {
        className: 'stub'
      });
      $.add(thread.stub, a);
      if (Conf['Menu']) {
        $.add(thread.stub, [$.tn(' '), Menu.makeButton(OP)]);
      }
      return $.before(threadRoot, thread.stub);
    },
    show: function(thread) {
      var threadRoot;
      if (thread.stub) {
        $.rm(thread.stub);
        delete thread.stub;
      }
      threadRoot = thread.OP.nodes.root.parentNode;
      return threadRoot.nextElementSibling.hidden = threadRoot.hidden = thread.isHidden = false;
    }
  };

  ReplyHiding = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Reply Hiding']) {
        return;
      }
      Misc.clearThreads("hiddenPosts." + g.BOARD);
      this.getHiddenPosts();
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
            Recursive.apply(ReplyHiding.hide, this, data.makeStub, true);
            Recursive.add(ReplyHiding.hide, this, data.makeStub, true);
          }
        }
      }
      if (!Conf['Hiding Buttons']) {
        return;
      }
      return $.replace($('.sideArrows', this.nodes.root), ReplyHiding.makeButton(this, 'hide'));
    },
    getHiddenPosts: function() {
      return ReplyHiding.hiddenPosts = $.get("hiddenPosts." + g.BOARD, {
        threads: {}
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
          innerHTML: '<input type=checkbox name=thisPost checked> This post'
        });
        replies = $.el('label', {
          innerHTML: "<input type=checkbox name=replies  checked=" + Conf['Recursive Hiding'] + "> Hide replies"
        });
        makeStub = $.el('label', {
          innerHTML: "<input type=checkbox name=makeStub checked=" + Conf['Stubs'] + "> Make stub"
        });
        $.event('AddMenuEntry', {
          type: 'post',
          el: div,
          order: 20,
          open: function(post) {
            if (!post.isReply || post.isClone || post.isHidden) {
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
        div = $.el('div', {
          className: 'show-reply-link',
          textContent: 'Show reply'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', ReplyHiding.menu.show);
        thisPost = $.el('label', {
          innerHTML: '<input type=checkbox name=thisPost> This post'
        });
        replies = $.el('label', {
          innerHTML: "<input type=checkbox name=replies> Show replies"
        });
        return $.event('AddMenuEntry', {
          type: 'post',
          el: div,
          order: 20,
          open: function(post) {
            var data, thread;
            if (!post.isReply || post.isClone) {
              return false;
            }
            thread = ReplyHiding.getHiddenPosts().threads[post.thread];
            if (!(post.isHidden || (data = thread != null ? thread[post] : void 0))) {
              return false;
            }
            ReplyHiding.menu.post = post;
            thisPost.firstChild.checked = post.isHidden;
            replies.firstChild.checked = (data != null ? data.hideRecursively : void 0) != null ? data.hideRecursively : Conf['Recursive Hiding'];
            return true;
          },
          subEntries: [
            {
              el: apply
            }, {
              el: thisPost
            }, {
              el: replies
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
          Recursive.apply(ReplyHiding.hide, post, makeStub, true);
          Recursive.add(ReplyHiding.hide, post, makeStub, true);
        } else {
          return;
        }
        ReplyHiding.saveHiddenState(post, true, thisPost, makeStub, replies);
        return $.event('CloseMenu');
      },
      show: function() {
        var data, parent, post, replies, thisPost, thread;
        parent = this.parentNode;
        thisPost = $('input[name=thisPost]', parent).checked;
        replies = $('input[name=replies]', parent).checked;
        post = ReplyHiding.menu.post;
        thread = ReplyHiding.getHiddenPosts().threads[post.thread];
        data = thread != null ? thread[post] : void 0;
        if (thisPost) {
          ReplyHiding.show(post, replies);
        } else if (replies) {
          Recursive.apply(ReplyHiding.show, post, true);
          Recursive.rm(ReplyHiding.hide, post, true);
        } else {
          return;
        }
        if (data) {
          ReplyHiding.saveHiddenState(post, !(thisPost && replies), !thisPost, data.makeStub, !replies);
        }
        return $.event('CloseMenu');
      }
    },
    makeButton: function(post, type) {
      var a;
      a = $.el('a', {
        className: "" + type + "-reply-button",
        innerHTML: "<span>[&nbsp;" + (type === 'hide' ? '-' : '+') + "&nbsp;]</span>",
        href: 'javascript:;'
      });
      $.on(a, 'click', ReplyHiding.toggle);
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
    toggle: function() {
      var post;
      post = Get.postFromNode(this);
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
        Recursive.apply(ReplyHiding.hide, post, makeStub, true);
        Recursive.add(ReplyHiding.hide, post, makeStub, true);
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
    show: function(post, showRecursively) {
      var quotelink, _i, _len, _ref;
      if (showRecursively == null) {
        showRecursively = Conf['Recursive Hiding'];
      }
      if (post.nodes.stub) {
        $.rm(post.nodes.stub);
        delete post.nodes.stub;
      } else {
        post.nodes.root.hidden = false;
      }
      post.isHidden = false;
      if (showRecursively) {
        Recursive.apply(ReplyHiding.show, post, true);
        Recursive.rm(ReplyHiding.hide, post);
      }
      _ref = Get.allQuotelinksLinkingTo(post);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        $.rmClass(quotelink, 'filtered');
      }
    }
  };

  Recursive = {
    recursives: {},
    init: function() {
      if (g.VIEW === 'catalog') {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Recursive',
        cb: this.node
      });
    },
    node: function() {
      var i, obj, quote, recursive, _i, _j, _len, _len1, _ref, _ref1;
      if (this.isClone) {
        return;
      }
      _ref = this.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (obj = Recursive.recursives[quote]) {
          _ref1 = obj.recursives;
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            recursive = _ref1[i];
            recursive.apply(null, [this].concat(__slice.call(obj.args[i])));
          }
        }
      }
    },
    add: function() {
      var args, obj, post, recursive, _base, _name;
      recursive = arguments[0], post = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      obj = (_base = Recursive.recursives)[_name = post.fullID] || (_base[_name] = {
        recursives: [],
        args: []
      });
      obj.recursives.push(recursive);
      return obj.args.push(args);
    },
    rm: function(recursive, post) {
      var i, obj, rec, _i, _len, _ref;
      if (!(obj = Recursive.recursives[post.fullID])) {
        return;
      }
      _ref = obj.recursives;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        rec = _ref[i];
        if (rec === recursive) {
          obj.recursives.splice(i, 1);
          obj.args.splice(i, 1);
        }
      }
    },
    apply: function() {
      var ID, args, fullID, post, recursive, _ref;
      recursive = arguments[0], post = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      fullID = post.fullID;
      _ref = g.posts;
      for (ID in _ref) {
        post = _ref[ID];
        if (post.quotes.contains(fullID)) {
          recursive.apply(null, [post].concat(__slice.call(args)));
        }
      }
    }
  };

  QuoteStrikeThrough = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Reply Hiding'] && !Conf['Filter']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Strike-through Quotes',
        cb: this.node
      });
    },
    node: function() {
      var board, postID, quotelink, _i, _len, _ref, _ref1, _ref2;
      if (this.isClone) {
        return;
      }
      _ref = this.nodes.quotelinks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        _ref1 = Get.postDataFromLink(quotelink), board = _ref1.board, postID = _ref1.postID;
        if ((_ref2 = g.posts["" + board + "." + postID]) != null ? _ref2.isHidden : void 0) {
          $.addClass(quotelink, 'filtered');
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
    makeButton: (function() {
      var a;
      a = null;
      return function(post) {
        var clone;
        a || (a = $.el('a', {
          className: 'menu-button',
          innerHTML: '[<i></i>]',
          href: 'javascript:;'
        }));
        clone = a.cloneNode(true);
        clone.setAttribute('data-postid', post.fullID);
        if (post.isClone) {
          clone.setAttribute('data-clone', true);
        }
        $.on(clone, 'click', Menu.toggle);
        return clone;
      };
    })(),
    toggle: function(e) {
      var post;
      post = this.dataset.clone ? Get.postFromNode(this) : g.posts[this.dataset.postid];
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
        order: 10,
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
      if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Delete Link'] || !Conf['Quick Reply']) {
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
          if (!file || file.isDead) {
            return false;
          }
          fileEl.textContent = 'File';
          $.on(fileEl, 'click', DeleteLink["delete"]);
          return true;
        }
      };
      return $.event('AddMenuEntry', {
        type: 'post',
        el: div,
        order: 40,
        open: function(post) {
          var node, seconds, thread;
          if (post.isDead || !((thread = QR.yourPosts.threads[post.thread]) && thread.contains(post.ID))) {
            return false;
          }
          DeleteLink.post = post;
          DeleteLink.cooldown.start(post);
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
      start: function(post) {
        var length, seconds;
        if (post.fullID in DeleteLink.cooldown) {
          return;
        }
        length = post.board.ID === 'q' ? 600 : 30;
        seconds = Math.ceil((length * $.SECOND - (Date.now() - post.info.date)) / $.SECOND);
        return DeleteLink.cooldown.count(post.fullID, seconds, length);
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
      if ($.engine === 'gecko' || $.el('a').download === void 0) {
        return;
      }
      a = $.el('a', {
        className: 'download-link',
        textContent: 'Download file'
      });
      return $.event('AddMenuEntry', {
        type: 'post',
        el: a,
        order: 70,
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
        order: 90,
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

  Keybinds = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Keybinds']) {
        return;
      }
      return $.on(d, '4chanXInitFinished', function() {
        var node, _i, _len, _ref;
        $.on(d, 'keydown', Keybinds.keydown);
        _ref = $$('[accesskey]');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          node.removeAttribute('accesskey');
        }
      });
    },
    keydown: function(e) {
      var form, key, notification, notifications, target, thread, threadRoot, _i, _len;
      if (!(key = Keybinds.keyCode(e))) {
        return;
      }
      target = e.target;
      if (['INPUT', 'TEXTAREA'].contains(target.nodeName)) {
        if (!/(Esc|Alt|Ctrl|Meta)/.test(key)) {
          return;
        }
      }
      threadRoot = Nav.getThread();
      thread = Get.postFromNode($('.op', threadRoot)).thread;
      switch (key) {
        case Conf['Toggle board list']:
          if (Conf['Custom Board Navigation']) {
            Header.toggleBoardList();
          }
          break;
        case Conf['Open empty QR']:
          Keybinds.qr(threadRoot);
          break;
        case Conf['Open QR']:
          Keybinds.qr(threadRoot, true);
          break;
        case Conf['Open settings']:
          Settings.open();
          break;
        case Conf['Close']:
          if ($.id('settings')) {
            Settings.close();
          } else if ((notifications = $$('.notification')).length) {
            for (_i = 0, _len = notifications.length; _i < _len; _i++) {
              notification = notifications[_i];
              $('.close', notification).click();
            }
          } else if (QR.nodes) {
            QR.close();
          }
          break;
        case Conf['Spoiler tags']:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('spoiler', target);
          break;
        case Conf['Code tags']:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('code', target);
          break;
        case Conf['Eqn tags']:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('eqn', target);
          break;
        case Conf['Math tags']:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('math', target);
          break;
        case Conf['Submit QR']:
          if (QR.nodes && !QR.status()) {
            QR.submit();
          }
          break;
        case Conf['Watch']:
          ThreadWatcher.toggle(thread);
          break;
        case Conf['Update']:
          ThreadUpdater.update();
          break;
        case Conf['Expand image']:
          Keybinds.img(threadRoot);
          break;
        case Conf['Expand images']:
          Keybinds.img(threadRoot, true);
          break;
        case Conf['Front page']:
          window.location = "/" + g.BOARD + "/0#delform";
          break;
        case Conf['Open front page']:
          $.open("/" + g.BOARD + "/#delform");
          break;
        case Conf['Next page']:
          if (form = $('.next form')) {
            window.location = form.action;
          }
          break;
        case Conf['Previous page']:
          if (form = $('.prev form')) {
            window.location = form.action;
          }
          break;
        case Conf['Next thread']:
          if (g.VIEW === 'thread') {
            return;
          }
          Nav.scroll(+1);
          break;
        case Conf['Previous thread']:
          if (g.VIEW === 'thread') {
            return;
          }
          Nav.scroll(-1);
          break;
        case Conf['Expand thread']:
          ExpandThread.toggle(thread);
          break;
        case Conf['Open thread']:
          Keybinds.open(thread);
          break;
        case Conf['Open thread tab']:
          Keybinds.open(thread, true);
          break;
        case Conf['Next reply']:
          Keybinds.hl(+1, threadRoot);
          break;
        case Conf['Previous reply']:
          Keybinds.hl(-1, threadRoot);
          break;
        case Conf['Hide']:
          if (g.VIEW === 'index') {
            ThreadHiding.toggle(thread);
          }
          break;
        default:
          return;
      }
      e.preventDefault();
      return e.stopPropagation();
    },
    keyCode: function(e) {
      var kc, key;
      key = (function() {
        switch (kc = e.keyCode) {
          case 8:
            return '';
          case 13:
            return 'Enter';
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
          default:
            if ((48 <= kc && kc <= 57) || (65 <= kc && kc <= 90)) {
              return String.fromCharCode(kc).toLowerCase();
            } else {
              return null;
            }
        }
      })();
      if (key) {
        if (e.altKey) {
          key = 'Alt+' + key;
        }
        if (e.ctrlKey) {
          key = 'Ctrl+' + key;
        }
        if (e.metaKey) {
          key = 'Meta+' + key;
        }
        if (e.shiftKey) {
          key = 'Shift+' + key;
        }
      }
      return key;
    },
    qr: function(thread, quote) {
      if (!(Conf['Quick Reply'] && QR.postingIsEnabled)) {
        return;
      }
      QR.open();
      if (quote) {
        QR.quote.call($('input', $('.post.highlight', thread) || thread));
      }
      return QR.nodes.com.focus();
    },
    tags: function(tag, ta) {
      var range, selEnd, selStart, value;
      value = ta.value;
      selStart = ta.selectionStart;
      selEnd = ta.selectionEnd;
      ta.value = value.slice(0, selStart) + ("[" + tag + "]") + value.slice(selStart, selEnd) + ("[/" + tag + "]") + value.slice(selEnd);
      range = ("[" + tag + "]").length + selEnd;
      ta.setSelectionRange(range, range);
      return $.event('input', null, ta);
    },
    img: function(thread, all) {
      var post;
      if (all) {
        return ImageExpand.cb.toggleAll();
      } else {
        post = Get.postFromNode($('.post.highlight', thread) || $('.op', thread));
        return ImageExpand.toggle(post);
      }
    },
    open: function(thread, tab) {
      var url;
      if (g.VIEW !== 'index') {
        return;
      }
      url = "/" + thread.board + "/res/" + thread;
      if (tab) {
        return $.open(url);
      } else {
        return location.href = url;
      }
    },
    hl: function(delta, thread) {
      var headRect, next, postEl, rect, replies, reply, root, topMargin, _i, _len;
      headRect = Header.bar.getBoundingClientRect();
      topMargin = headRect.top + headRect.height;
      if (postEl = $('.reply.highlight', thread)) {
        $.rmClass(postEl, 'highlight');
        rect = postEl.getBoundingClientRect();
        if (rect.bottom >= topMargin && rect.top <= doc.clientHeight) {
          root = postEl.parentNode;
          next = $.x('child::div[contains(@class,"post reply")]', delta === +1 ? root.nextElementSibling : root.previousElementSibling);
          if (!next) {
            this.focus(postEl);
            return;
          }
          if (!(g.VIEW === 'thread' || $.x('ancestor::div[parent::div[@class="board"]]', next) === thread)) {
            return;
          }
          rect = next.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > doc.clientHeight) {
            if (delta === -1) {
              window.scrollBy(0, rect.top - topMargin);
            } else {
              next.scrollIntoView(false);
            }
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
        if (delta === +1 && rect.top >= topMargin || delta === -1 && rect.bottom <= doc.clientHeight) {
          this.focus(reply);
          return;
        }
      }
    },
    focus: function(post) {
      $.addClass(post, 'highlight');
      return $('a[title="Highlight this post"]', post).focus();
    }
  };

  Nav = {
    init: function() {
      var next, prev, span;
      if (g.VIEW !== 'index' || !Conf['Index Navigation']) {
        return;
      }
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
      return $.on(d, '4chanXInitFinished', function() {
        return $.add(d.body, span);
      });
    },
    prev: function() {
      return Nav.scroll(-1);
    },
    next: function() {
      return Nav.scroll(+1);
    },
    getThread: function(full) {
      var headRect, i, rect, thread, threads, topMargin, _i, _len;
      headRect = Header.bar.getBoundingClientRect();
      topMargin = headRect.top + headRect.height;
      threads = $$('.thread:not([hidden])');
      for (i = _i = 0, _len = threads.length; _i < _len; i = ++_i) {
        thread = threads[i];
        rect = thread.getBoundingClientRect();
        if (rect.bottom > topMargin) {
          if (full) {
            return [threads, thread, i, rect, topMargin];
          } else {
            return thread;
          }
        }
      }
      return $('.board');
    },
    scroll: function(delta) {
      var i, rect, thread, threads, top, topMargin, _ref, _ref1;
      _ref = Nav.getThread(true), threads = _ref[0], thread = _ref[1], i = _ref[2], rect = _ref[3], topMargin = _ref[4];
      top = rect.top - topMargin;
      if (!((delta === -1 && Math.ceil(top) < 0) || (delta === +1 && top > 1))) {
        i += delta;
      }
      top = ((_ref1 = threads[i]) != null ? _ref1.getBoundingClientRect().top : void 0) - topMargin;
      return window.scrollBy(0, top);
    }
  };

  Redirect = {
    image: function(board, filename) {
      switch ("" + board) {
        case 'a':
        case 'jp':
        case 'm':
        case 'q':
        case 'tg':
        case 'vg':
        case 'wsg':
          return "//archive.foolz.us/" + board + "/full_image/" + filename;
        case 'u':
          return "//nsfw.foolz.us/" + board + "/full_image/" + filename;
        case 'po':
          return "//archive.thedarkcave.org/" + board + "/full_image/" + filename;
        case 'ck':
        case 'lit':
          return "//fuuka.warosu.org/" + board + "/full_image/" + filename;
        case 'cgl':
        case 'g':
        case 'mu':
        case 'w':
          return "//rbt.asia/" + board + "/full_image/" + filename;
        case 'an':
        case 'k':
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
          return "//archive.foolz.us/_/api/chan/post/?board=" + board + "&num=" + postID;
        case 'u':
          return "//nsfw.foolz.us/_/api/chan/post/?board=" + board + "&num=" + postID;
        case 'c':
        case 'int':
        case 'po':
          return "//archive.thedarkcave.org/_/api/chan/post/?board=" + board + "&num=" + postID;
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
          url = Redirect.path('//archive.foolz.us', 'foolfuuka', data);
          break;
        case 'u':
          url = Redirect.path('//nsfw.foolz.us', 'foolfuuka', data);
          break;
        case 'int':
        case 'po':
          url = Redirect.path('//archive.thedarkcave.org', 'foolfuuka', data);
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
      subject = "<span class=subject>" + (subject || '') + "</span>";
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
      flag = flagCode ? (" <img src='" + staticPath + "/image/country/" + (board.ID === 'pol' ? 'troll/' : '')) + flagCode.toLowerCase() + (".gif' alt=" + flagCode + " title='" + flagName + "' class=countryFlag>") : '';
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
        if (board.ID !== 'f') {
          imgSrc = ("<a class='fileThumb" + (file.isSpoiler ? ' imgspoiler' : '') + "' href='" + file.url + "' target=_blank>") + ("<img src='" + fileThumb + "' alt='" + fileSize + "' data-md5=" + file.MD5 + " style='height: " + file.theight + "px; width: " + file.twidth + "px;'></a>");
        }
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
      sticky = isSticky ? ' <img src=//static.4chan.org/image/sticky.gif alt=Sticky title=Sticky class=stickyIcon>' : '';
      closed = isClosed ? ' <img src=//static.4chan.org/image/closed.gif alt=Closed title=Closed class=closedIcon>' : '';
      container = $.el('div', {
        id: "pc" + postID,
        className: "postContainer " + (isOP ? 'op' : 'reply') + "Container",
        innerHTML: (isOP ? '' : "<div class=sideArrows id=sa" + postID + ">&gt;&gt;</div>") + ("<div id=p" + postID + " class='post " + (isOP ? 'op' : 'reply') + (capcode === 'admin_highlight' ? ' highlightPost' : '') + "'>") + ("<div class='postInfoM mobile' id=pim" + postID + ">") + ("<span class='nameBlock" + capcodeClass + "'>") + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + capcode + userID + flag + sticky + closed + ("<br>" + subject) + ("</span><span class='dateTime postNum' data-utc=" + dateUTC + ">" + date) + ("<a href=" + ("/" + board + "/res/" + threadID + "#p" + postID) + ">No.</a>") + ("<a href='" + (g.VIEW === 'thread' && g.THREAD === +threadID ? "javascript:quote(" + postID + ")" : "/" + board + "/res/" + threadID + "#q" + postID) + "'>" + postID + "</a>") + '</span>' + '</div>' + (isOP ? fileHTML : '') + ("<div class='postInfo desktop' id=pi" + postID + ">") + ("<input type=checkbox name=" + postID + " value=delete> ") + ("" + subject + " ") + ("<span class='nameBlock" + capcodeClass + "'>") + emailStart + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + emailEnd + capcode + userID + flag + sticky + closed + ' </span> ' + ("<span class=dateTime data-utc=" + dateUTC + ">" + date + "</span> ") + "<span class='postNum desktop'>" + ("<a href=" + ("/" + board + "/res/" + threadID + "#p" + postID) + " title='Highlight this post'>No.</a>") + ("<a href='" + (g.VIEW === 'thread' && g.THREAD === +threadID ? "javascript:quote(" + postID + ")" : "/" + board + "/res/" + threadID + "#q" + postID) + "' title='Quote this post'>" + postID + "</a>") + '</span>' + '</div>' + (isOP ? '' : fileHTML) + ("<blockquote class=postMessage id=m" + postID + ">" + (comment || '') + "</blockquote> ") + '</div>'
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
    threadExcerpt: function(thread) {
      var OP, excerpt, _ref;
      OP = thread.OP;
      excerpt = ((_ref = OP.info.subject) != null ? _ref.trim() : void 0) || OP.info.comment.replace(/\n+/g, ' // ') || Conf['Anonymize'] && 'Anonymous' || $('.nameBlock', OP.nodes.info).textContent.trim();
      return "/" + thread.board + "/ - " + excerpt;
    },
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
    postFromNode: function(root) {
      return Get.postFromRoot($.x('ancestor::div[contains(@class,"postContainer")][1]', root));
    },
    contextFromLink: function(quotelink) {
      return Get.postFromRoot($.x('ancestor::div[parent::div[@class="thread"]][1]', quotelink));
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
        if (quoterPost.quotes.contains(post.fullID)) {
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
            quotelinks.push.apply(quotelinks, __slice.call(quotedPost.nodes.backlinks));
          }
        }
      }
      return quotelinks.filter(function(quotelink) {
        var board, postID, _ref4;
        _ref4 = Get.postDataFromLink(quotelink), board = _ref4.board, postID = _ref4.postID;
        return board === post.board.ID && postID === post.ID;
      });
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
      if (![200, 304].contains(status)) {
        if (url = Redirect.post(board, postID)) {
          $.cache(url, function() {
            return Get.archivedPost(this, board, postID, root, context);
          });
        } else {
          $.addClass(root, 'warning');
          root.textContent = status === 404 ? "Thread No." + threadID + " 404'd." : "Error " + req.statusText + " (" + req.status + ").";
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

  Misc = {
    clearThreads: function(key) {
      var data;
      if (!(data = $.get(key))) {
        return;
      }
      if (!Object.keys(data.threads).length) {
        $["delete"](key);
        return;
      }
      if (data.lastChecked > Date.now() - 12 * $.HOUR) {
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
              if (thread.no in data.threads) {
                threads[thread.no] = data.threads[thread.no];
              }
            }
          }
          if (!Object.keys(threads).length) {
            $["delete"](key);
            return;
          }
          data.threads = threads;
          data.lastChecked = Date.now();
          return $.set(key, data);
        }
      });
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
          $.replace(deadlink, __slice.call(deadlink.childNodes));
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
          } else {
            a = $.el('a', {
              href: "/" + board + "/" + post.thread + "/res/#p" + ID,
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
        if (!this.quotes.contains(quoteID)) {
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
      if (g.VIEW === 'catalog' || !Conf['Quote Inlining']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Quote Inlining',
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
      var i, inline, isBacklink, post;
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
        post.forwarded++ || (post.forwarded = 1);
      }
      if (Unread.posts && (i = Unread.posts.indexOf(post)) !== -1) {
        Unread.posts.splice(i, 1);
        return Unread.update();
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
      if (g.VIEW === 'catalog' || !Conf['Quote Previewing']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Quote Previewing',
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
        className: 'dialog'
      });
      $.add(d.body, qp);
      Get.postClone(board, threadID, postID, qp, Get.contextFromLink(this));
      UI.hover({
        root: this,
        el: qp,
        latestEvent: e,
        endEvents: 'mouseout click',
        cb: QuotePreview.mouseout,
        asapTest: function() {
          return qp.firstElementChild;
        }
      });
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
        if ((post = g.posts[quote]) && post.nodes.backlinkContainer) {
          _ref1 = post.clones;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            clone = _ref1[_j];
            containers.push(clone.nodes.backlinkContainer);
          }
        }
        for (_k = 0, _len2 = containers.length; _k < _len2; _k++) {
          container = containers[_k];
          link = a.cloneNode(true);
          if (Conf['Quote Previewing']) {
            $.on(link, 'mouseover', QuotePreview.mouseover);
          }
          if (Conf['Quote Inlining']) {
            $.on(link, 'click', QuoteInline.toggle);
          }
          $.add(container, [$.tn(' '), link]);
        }
      }
    },
    secondNode: function() {
      var container;
      if (this.isClone && (this.origin.isReply || Conf['OP Backlinks'])) {
        this.nodes.backlinkContainer = $('.container', this.nodes.info);
        return;
      }
      if (!(this.isReply || Conf['OP Backlinks'])) {
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

  QuoteYou = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Mark Quotes of You'] || !Conf['Quick Reply']) {
        return;
      }
      this.text = '\u00A0(You)';
      return Post.prototype.callbacks.push({
        name: 'Mark Quotes of You',
        cb: this.node
      });
    },
    node: function() {
      var postID, quotelink, quotelinks, quotes, thread, threadID, _i, _len, _ref;
      if (this.isClone) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      for (_i = 0, _len = quotelinks.length; _i < _len; _i++) {
        quotelink = quotelinks[_i];
        _ref = Get.postDataFromLink(quotelink), threadID = _ref.threadID, postID = _ref.postID;
        if ((thread = QR.yourPosts.threads[threadID]) && thread.contains(postID)) {
          $.add(quotelink, $.tn(QuoteYou.text));
        }
      }
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
      var board, op, postID, quotelink, quotelinks, quotes, _i, _j, _len, _len1, _ref;
      if (this.isClone && this.thread === this.context.thread) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      if (this.isClone && quotes.contains(this.thread.fullID)) {
        for (_i = 0, _len = quotelinks.length; _i < _len; _i++) {
          quotelink = quotelinks[_i];
          quotelink.textContent = quotelink.textContent.replace(QuoteOP.text, '');
        }
      }
      op = (this.isClone ? this.context : this).thread.fullID;
      if (!quotes.contains(op)) {
        return;
      }
      for (_j = 0, _len1 = quotelinks.length; _j < _len1; _j++) {
        quotelink = quotelinks[_j];
        _ref = Get.postDataFromLink(quotelink), board = _ref.board, postID = _ref.postID;
        if (("" + board + "." + postID) === op) {
          $.add(quotelink, $.tn(QuoteOP.text));
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
      var board, data, quotelink, quotelinks, quotes, thread, _i, _len, _ref;
      if (this.isClone && this.thread === this.context.thread) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      _ref = this.isClone ? this.context : this, board = _ref.board, thread = _ref.thread;
      for (_i = 0, _len = quotelinks.length; _i < _len; _i++) {
        quotelink = quotelinks[_i];
        data = Get.postDataFromLink(quotelink);
        if (!data.threadID) {
          continue;
        }
        if (this.isClone) {
          quotelink.textContent = quotelink.textContent.replace(QuoteCT.text, '');
        }
        if (data.board === this.board.ID && data.threadID !== thread.ID) {
          $.add(quotelink, $.tn(QuoteCT.text));
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

  RelativeDates = {
    INTERVAL: $.MINUTE / 2,
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Relative Post Dates']) {
        return;
      }
      $.on(d, 'visibilitychange ThreadUpdate', this.flush);
      this.flush();
      return Post.prototype.callbacks.push({
        name: 'Relative Post Dates',
        cb: this.node
      });
    },
    node: function() {
      var dateEl;
      if (this.isClone) {
        return;
      }
      dateEl = this.nodes.date;
      dateEl.title = dateEl.textContent;
      return RelativeDates.setUpdate(this);
    },
    relative: function(diff, now, date) {
      var days, months, number, rounded, unit, years;
      unit = (number = diff / $.DAY) >= 1 ? (years = now.getYear() - date.getYear(), months = now.getMonth() - date.getMonth(), days = now.getDate() - date.getDate(), years > 1 ? (number = years - (months < 0 || months === 0 && days < 0), 'year') : years === 1 && (months > 0 || months === 0 && days >= 0) ? (number = years, 'year') : (months = (months + 12) % 12) > 1 ? (number = months - (days < 0), 'month') : months === 1 && days >= 0 ? (number = months, 'month') : 'day') : (number = diff / $.HOUR) >= 1 ? 'hour' : (number = diff / $.MINUTE) >= 1 ? 'minute' : (number = Math.max(0, diff) / $.SECOND, 'second');
      rounded = Math.round(number);
      if (rounded !== 1) {
        unit += 's';
      }
      return "" + rounded + " " + unit + " ago";
    },
    stale: [],
    flush: function() {
      var now, update, _i, _len, _ref;
      if (d.hidden) {
        return;
      }
      now = new Date();
      _ref = RelativeDates.stale;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        update = _ref[_i];
        update(now);
      }
      RelativeDates.stale = [];
      clearTimeout(RelativeDates.timeout);
      return RelativeDates.timeout = setTimeout(RelativeDates.flush, RelativeDates.INTERVAL);
    },
    setUpdate: function(post) {
      var markStale, setOwnTimeout, update;
      setOwnTimeout = function(diff) {
        var delay;
        delay = diff < $.MINUTE ? $.SECOND - (diff + $.SECOND / 2) % $.SECOND : diff < $.HOUR ? $.MINUTE - (diff + $.MINUTE / 2) % $.MINUTE : diff < $.DAY ? $.HOUR - (diff + $.HOUR / 2) % $.HOUR : $.DAY - (diff + $.DAY / 2) % $.DAY;
        return setTimeout(markStale, delay);
      };
      update = function(now) {
        var date, diff, relative, singlePost, _i, _len, _ref;
        date = post.info.date;
        diff = now - date;
        relative = RelativeDates.relative(diff, now, date);
        _ref = [post].concat(post.clones);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          singlePost = _ref[_i];
          singlePost.nodes.date.textContent = relative;
        }
        return setOwnTimeout(diff);
      };
      markStale = function() {
        return RelativeDates.stale.push(update);
      };
      return update(new Date());
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
        return "<a href=" + this.file.URL + " target=_blank>" + (FileInfo.formatters.t.call(this)) + "</a>";
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
      link = link.replace(/%(T?URL|MD5|board)/g, function(parameter) {
        switch (parameter) {
          case '%TURL':
            return "' + post.file.thumbURL + '";
          case '%URL':
            return "' + post.file.URL + '";
          case '%MD5':
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

  ImageExpand = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Image Expansion']) {
        return;
      }
      this.EAI = $.el('a', {
        className: 'expand-all-shortcut',
        textContent: 'EAI',
        title: 'Expand All Images',
        href: 'javascript:;'
      });
      $.on(this.EAI, 'click', ImageExpand.cb.toggleAll);
      Header.addShortcut(this.EAI);
      return Post.prototype.callbacks.push({
        name: 'Image Expansion',
        cb: this.node
      });
    },
    node: function() {
      if (!(this.file && this.file.isImage)) {
        return;
      }
      $.on(this.file.thumb.parentNode, 'click', ImageExpand.cb.toggle);
      if (ImageExpand.on && !this.isHidden) {
        return ImageExpand.expand(this);
      }
    },
    cb: {
      toggle: function(e) {
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
          return;
        }
        e.preventDefault();
        return ImageExpand.toggle(Get.postFromNode(this));
      },
      toggleAll: function() {
        var ID, file, func, post, _i, _len, _ref, _ref1;
        $.event('CloseMenu');
        if (ImageExpand.on = $.hasClass(ImageExpand.EAI, 'expand-all-shortcut')) {
          ImageExpand.EAI.className = 'contract-all-shortcut';
          ImageExpand.EAI.title = 'Contract All Images';
          func = ImageExpand.expand;
        } else {
          ImageExpand.EAI.className = 'expand-all-shortcut';
          ImageExpand.EAI.title = 'Expand All Images';
          func = ImageExpand.contract;
        }
        _ref = g.posts;
        for (ID in _ref) {
          post = _ref[ID];
          _ref1 = [post].concat(post.clones);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            post = _ref1[_i];
            file = post.file;
            if (!(file && file.isImage && doc.contains(post.nodes.root))) {
              continue;
            }
            if (ImageExpand.on && (!Conf['Expand spoilers'] && file.isSpoiler || Conf['Expand from here'] && file.thumb.getBoundingClientRect().top < 0)) {
              continue;
            }
            $.queueTask(func, post);
          }
        }
      },
      setFitness: function() {
        var checked;
        checked = this.checked;
        (checked ? $.addClass : $.rmClass)(doc, this.name.toLowerCase().replace(/\s+/g, '-'));
        if (this.name !== 'Fit height') {
          return;
        }
        if (checked) {
          $.on(window, 'resize', ImageExpand.resize);
          if (!ImageExpand.style) {
            ImageExpand.style = $.addStyle(null);
          }
          return ImageExpand.resize();
        } else {
          return $.off(window, 'resize', ImageExpand.resize);
        }
      }
    },
    toggle: function(post) {
      var headRect, postRect, rect, root, thumb, top;
      thumb = post.file.thumb;
      if (!(post.file.isExpanded || $.hasClass(thumb, 'expanding'))) {
        ImageExpand.expand(post);
        return;
      }
      rect = thumb.parentNode.getBoundingClientRect();
      if (rect.bottom > 0) {
        postRect = post.nodes.root.getBoundingClientRect();
        headRect = Header.bar.getBoundingClientRect();
        top = postRect.top - headRect.top - headRect.height - 2;
        root = $.engine === 'webkit' ? d.body : doc;
        if (rect.top < 0) {
          root.scrollTop += top;
        }
        if (rect.left < 0) {
          root.scrollLeft = 0;
        }
      }
      return ImageExpand.contract(post);
    },
    contract: function(post) {
      $.rmClass(post.nodes.root, 'expanded-image');
      $.rmClass(post.file.thumb, 'expanding');
      return post.file.isExpanded = false;
    },
    expand: function(post, src) {
      var img, thumb;
      thumb = post.file.thumb;
      if (post.isHidden || post.file.isExpanded || $.hasClass(thumb, 'expanding')) {
        return;
      }
      $.addClass(thumb, 'expanding');
      if (post.file.fullImage) {
        $.asap((function() {
          return post.file.fullImage.naturalHeight;
        }), function() {
          return ImageExpand.completeExpand(post);
        });
        return;
      }
      post.file.fullImage = img = $.el('img', {
        className: 'full-image',
        src: src || post.file.URL
      });
      $.on(img, 'error', ImageExpand.error);
      $.asap((function() {
        return post.file.fullImage.naturalHeight;
      }), function() {
        return ImageExpand.completeExpand(post);
      });
      return $.after(thumb, img);
    },
    completeExpand: function(post) {
      var rect, root, thumb;
      thumb = post.file.thumb;
      if (!$.hasClass(thumb, 'expanding')) {
        return;
      }
      rect = post.nodes.root.getBoundingClientRect();
      $.addClass(post.nodes.root, 'expanded-image');
      $.rmClass(post.file.thumb, 'expanding');
      if (rect.top + rect.height <= 0) {
        root = $.engine === 'webkit' ? d.body : doc;
        root.scrollTop += post.nodes.root.clientHeight - rect.height;
      }
      return post.file.isExpanded = true;
    },
    error: function() {
      var URL, post, src, timeoutID;
      post = Get.postFromNode(this);
      $.rm(this);
      delete post.file.fullImage;
      if (!$.hasClass(post.file.thumb, 'expanding')) {
        return;
      }
      ImageExpand.contract(post);
      src = this.src.split('/');
      if (src[2] === 'images.4chan.org') {
        if (URL = Redirect.image(src[3], src[5])) {
          setTimeout(ImageExpand.expand, 10000, post, URL);
          return;
        }
        if (g.DEAD || post.isDead || post.file.isDead) {
          return;
        }
      }
      timeoutID = setTimeout(ImageExpand.expand, 10000, post);
      return $.ajax("//api.4chan.org/" + post.board + "/res/" + post.thread + ".json", {
        onload: function() {
          var postObj, _i, _len, _ref;
          if (this.status !== 200) {
            return;
          }
          _ref = JSON.parse(this.response).posts;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            postObj = _ref[_i];
            if (postObj.no === post.ID) {
              break;
            }
          }
          if (postObj.no !== post.ID) {
            clearTimeout(timeoutID);
            return post.kill();
          } else if (postObj.filedeleted) {
            clearTimeout(timeoutID);
            return post.kill(true);
          }
        }
      });
    },
    menu: {
      init: function() {
        var conf, createSubEntry, el, key, subEntries, _ref;
        if (g.VIEW === 'catalog' || !Conf['Image Expansion']) {
          return;
        }
        el = $.el('span', {
          textContent: 'Image Expansion',
          className: 'image-expansion-link'
        });
        createSubEntry = ImageExpand.menu.createSubEntry;
        subEntries = [];
        _ref = Config.imageExpansion;
        for (key in _ref) {
          conf = _ref[key];
          subEntries.push(createSubEntry(key, conf));
        }
        return $.event('AddMenuEntry', {
          type: 'header',
          el: el,
          order: 80,
          subEntries: subEntries
        });
      },
      createSubEntry: function(type, config) {
        var input, label;
        label = $.el('label', {
          innerHTML: "<input type=checkbox name='" + type + "'> " + type
        });
        input = label.firstElementChild;
        if (['Fit width', 'Fit height'].contains(type)) {
          $.on(input, 'change', ImageExpand.cb.setFitness);
        }
        if (config) {
          label.title = config[1];
          input.checked = Conf[type];
          $.event('change', null, input);
          $.on(input, 'change', $.cb.checked);
        }
        return {
          el: label
        };
      }
    },
    resize: function() {
      return ImageExpand.style.textContent = ":root.fit-height .full-image {max-height:" + doc.clientHeight + "px}";
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
      if (g.VIEW === 'catalog' || !Conf['Auto-GIF'] || ['gif', 'wsg'].contains(g.BOARD.ID)) {
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
        name: 'Image Hover',
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
    mouseover: function(e) {
      var el, post;
      post = Get.postFromNode(this);
      el = $.el('img', {
        id: 'ihover',
        src: post.file.URL
      });
      el.setAttribute('data-fullid', post.fullID);
      $.add(d.body, el);
      UI.hover({
        root: this,
        el: el,
        latestEvent: e,
        endEvents: 'mouseout click',
        asapTest: function() {
          return el.naturalHeight;
        }
      });
      return $.on(el, 'error', ImageHover.error);
    },
    error: function() {
      var URL, post, src, timeoutID,
        _this = this;
      if (!doc.contains(this)) {
        return;
      }
      post = g.posts[this.dataset.fullid];
      src = this.src.split('/');
      if (src[2] === 'images.4chan.org') {
        if (URL = Redirect.image(src[3], src[5].replace(/\?.+$/, ''))) {
          this.src = URL;
          return;
        }
        if (g.DEAD || post.isDead || post.file.isDead) {
          return;
        }
      }
      timeoutID = setTimeout((function() {
        return _this.src = post.file.URL + '?' + Date.now();
      }), 3000);
      return $.ajax("//api.4chan.org/" + post.board + "/res/" + post.thread + ".json", {
        onload: function() {
          var postObj, _i, _len, _ref;
          if (this.status !== 200) {
            return;
          }
          _ref = JSON.parse(this.response).posts;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            postObj = _ref[_i];
            if (postObj.no === post.ID) {
              break;
            }
          }
          if (postObj.no !== post.ID) {
            clearTimeout(timeoutID);
            return post.kill();
          } else if (postObj.filedeleted) {
            clearTimeout(timeoutID);
            return post.kill(true);
          }
        }
      });
    }
  };

  ExpandComment = {
    init: function() {
      if (g.VIEW !== 'index' || !Conf['Comment Expansion']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Comment Expansion',
        cb: this.node
      });
    },
    node: function() {
      var a;
      if (a = $('.abbr > a', this.nodes.comment)) {
        return $.on(a, 'click', ExpandComment.cb);
      }
    },
    cb: function(e) {
      var post;
      e.preventDefault();
      post = Get.postFromNode(this);
      return ExpandComment.expand(post);
    },
    expand: function(post) {
      var a;
      if (post.nodes.longComment) {
        $.replace(post.nodes.shortComment, post.nodes.longComment);
        post.nodes.comment = post.nodes.longComment;
        return;
      }
      if (!(a = $('.abbr > a', post.nodes.comment))) {
        return;
      }
      a.textContent = "Post No." + post + " Loading...";
      return $.cache("//api.4chan.org" + a.pathname + ".json", function() {
        return ExpandComment.parse(this, a, post);
      });
    },
    contract: function(post) {
      var a;
      if (!post.nodes.shortComment) {
        return;
      }
      a = $('.abbr > a', post.nodes.shortComment);
      a.textContent = 'here';
      $.replace(post.nodes.longComment, post.nodes.shortComment);
      return post.nodes.comment = post.nodes.shortComment;
    },
    parse: function(req, a, post) {
      var clone, comment, href, postObj, posts, quote, spoilerRange, status, _i, _j, _len, _len1, _ref;
      status = req.status;
      if (![200, 304].contains(status)) {
        a.textContent = "Error " + req.statusText + " (" + status + ")";
        return;
      }
      posts = JSON.parse(req.response).posts;
      if (spoilerRange = posts[0].custom_spoiler) {
        Build.spoilerRange[g.BOARD] = spoilerRange;
      }
      for (_i = 0, _len = posts.length; _i < _len; _i++) {
        postObj = posts[_i];
        if (postObj.no === post.ID) {
          break;
        }
      }
      if (postObj.no !== post.ID) {
        a.textContent = "Post No." + post + " not found.";
        return;
      }
      comment = post.nodes.comment;
      clone = comment.cloneNode(false);
      clone.innerHTML = postObj.com;
      _ref = $$('.quotelink', clone);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        quote = _ref[_j];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "/" + post.board + "/res/" + href;
      }
      post.nodes.shortComment = comment;
      $.replace(comment, clone);
      post.nodes.comment = post.nodes.longComment = clone;
      post.parseComment();
      post.parseQuotes();
      if (Conf['Resurrect Quotes']) {
        Quotify.node.call(post);
      }
      if (Conf['Quote Previewing']) {
        QuotePreview.node.call(post);
      }
      if (Conf['Quote Inlining']) {
        QuoteInline.node.call(post);
      }
      if (Conf['Mark OP Quotes']) {
        QuoteOP.node.call(post);
      }
      if (Conf['Mark Cross-thread Quotes']) {
        QuoteCT.node.call(post);
      }
      if (g.BOARD.ID === 'g') {
        Fourchan.code.call(post);
      }
      if (g.BOARD.ID === 'sci') {
        return Fourchan.math.call(post);
      }
    }
  };

  ExpandThread = {
    init: function() {
      if (g.VIEW !== 'index' || !Conf['Thread Expansion']) {
        return;
      }
      return Thread.prototype.callbacks.push({
        name: 'Thread Expansion',
        cb: this.node
      });
    },
    node: function() {
      var a, span;
      if (!(span = $('.summary', this.OP.nodes.root.parentNode))) {
        return;
      }
      a = $.el('a', {
        textContent: "+ " + span.textContent,
        className: 'summary',
        href: 'javascript:;'
      });
      $.on(a, 'click', ExpandThread.cbToggle);
      return $.replace(span, a);
    },
    cbToggle: function() {
      var op;
      op = Get.postFromRoot(this.previousElementSibling);
      return ExpandThread.toggle(op.thread);
    },
    toggle: function(thread) {
      var a, inlined, num, post, replies, reply, text, threadRoot, url, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      threadRoot = thread.OP.nodes.root.parentNode;
      url = "//api.4chan.org/" + thread.board + "/res/" + thread + ".json";
      a = $('.summary', threadRoot);
      text = a.textContent;
      switch (text[0]) {
        case '+':
          a.textContent = text.replace('+', '× Loading...');
          $.cache(url, function() {
            return ExpandThread.parse(this, thread, a);
          });
          _ref = $$('.thread > .postContainer', threadRoot);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            post = _ref[_i];
            ExpandComment.expand(Get.postFromRoot(post));
          }
          break;
        case '×':
          a.textContent = text.replace('× Loading...', '+');
          break;
        case '-':
          a.textContent = text.replace('-', '+');
          num = (function() {
            if (thread.isSticky) {
              return 1;
            } else {
              switch (g.BOARD) {
                case 'b':
                case 'vg':
                case 'q':
                  return 3;
                case 't':
                  return 1;
                default:
                  return 5;
              }
            }
          })();
          replies = $$('.thread > .replyContainer', threadRoot).slice(0, -num);
          for (_j = 0, _len1 = replies.length; _j < _len1; _j++) {
            reply = replies[_j];
            if (Conf['Quote Inlining']) {
              while (inlined = $('.inlined', reply)) {
                inlined.click();
              }
            }
            $.rm(reply);
          }
          _ref1 = $$('.thread > .postContainer', threadRoot);
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            post = _ref1[_k];
            ExpandComment.contract(Get.postFromRoot(post));
          }
      }
    },
    parse: function(req, thread, a) {
      var link, node, nodes, post, posts, replies, reply, spoilerRange, status, _i, _len;
      if (a.textContent[0] === '+') {
        return;
      }
      status = req.status;
      if ([200, 304].contains(status)) {
        a.textContent = "Error " + req.statusText + " (" + status + ")";
        $.off(a, 'click', ExpandThread.cb.toggle);
        return;
      }
      a.textContent = a.textContent.replace('× Loading...', '-');
      posts = JSON.parse(req.response).posts;
      if (spoilerRange = posts[0].custom_spoiler) {
        Build.spoilerRange[g.BOARD] = spoilerRange;
      }
      replies = posts.slice(1);
      posts = [];
      nodes = [];
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        if (post = thread.posts[reply.no]) {
          nodes.push(post.nodes.root);
          continue;
        }
        node = Build.postFromObject(reply, thread.board);
        post = new Post(node, thread, thread.board);
        link = $('a[title="Highlight this post"]', node);
        link.href = "res/" + thread + "#p" + post;
        link.nextSibling.href = "res/" + thread + "#q" + post;
        posts.push(post);
        nodes.push(node);
      }
      Main.callbackNodes(Post, posts);
      $.after(a, nodes);
      if (Conf['Enable 4chan\'s Extension']) {
        return $.unsafeWindow.Parser.parseThread(thread.ID, 1, nodes.length);
      } else {
        return Fourchan.parseThread(thread.ID, 1, nodes.length);
      }
    }
  };

  ThreadExcerpt = {
    init: function() {
      if (g.VIEW !== 'thread' || !Conf['Thread Excerpt']) {
        return;
      }
      return Thread.prototype.callbacks.push({
        name: 'Thread Excerpt',
        cb: this.node
      });
    },
    node: function() {
      return d.title = Get.threadExcerpt(this);
    }
  };

  Unread = {
    init: function() {
      if (g.VIEW !== 'thread' || !Conf['Unread Count'] && !Conf['Unread Tab Icon']) {
        return;
      }
      Unread.hr = $.el('hr', {
        id: 'unread-line'
      });
      Misc.clearThreads("lastReadPosts." + g.BOARD);
      return Thread.prototype.callbacks.push({
        name: 'Unread',
        cb: this.node
      });
    },
    node: function() {
      var ID, post, posts, _ref;
      Unread.thread = this;
      Unread.lastReadPost = $.get("lastReadPosts." + this.board, {
        threads: {}
      }).threads[this] || 0;
      Unread.posts = [];
      Unread.postsQuotingYou = [];
      Unread.title = d.title;
      posts = [];
      _ref = this.posts;
      for (ID in _ref) {
        post = _ref[ID];
        if (post.isReply) {
          posts.push(post);
        }
      }
      Unread.addPosts(posts);
      if (Unread.posts.length) {
        $.x('preceding-sibling::div[contains(@class,"postContainer")][1]', Unread.posts[0].nodes.root).scrollIntoView(false);
      } else if (posts.length) {
        posts[posts.length - 1].nodes.root.scrollIntoView();
      }
      $.on(d, 'ThreadUpdate', Unread.onUpdate);
      $.on(d, 'scroll visibilitychange', Unread.read);
      if (Conf['Unread Line']) {
        return $.on(d, 'visibilitychange', Unread.setLine);
      }
    },
    addPosts: function(newPosts) {
      var ID, post, youInThisThread, yourPosts, _i, _len;
      if (Conf['Quick Reply']) {
        yourPosts = QR.yourPosts;
        youInThisThread = yourPosts.threads[Unread.thread];
      }
      for (_i = 0, _len = newPosts.length; _i < _len; _i++) {
        post = newPosts[_i];
        ID = post.ID;
        if (ID <= Unread.lastReadPost || post.isHidden || youInThisThread && youInThisThread.contains(ID)) {
          continue;
        }
        Unread.posts.push(post);
        if (yourPosts) {
          Unread.addPostQuotingYou(post, yourPosts);
        }
      }
      if (Conf['Unread Line']) {
        Unread.setLine(newPosts.contains(Unread.posts[0]));
      }
      Unread.read();
      return Unread.update();
    },
    addPostQuotingYou: function(post, yourPosts) {
      var board, postIDs, quote, quoteID, thread, _i, _len, _ref, _ref1, _ref2;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        _ref1 = quote.split('.'), board = _ref1[0], quoteID = _ref1[1];
        if (board !== Unread.thread.board.ID) {
          continue;
        }
        _ref2 = yourPosts.threads;
        for (thread in _ref2) {
          postIDs = _ref2[thread];
          if (postIDs.contains(+quoteID)) {
            Unread.postsQuotingYou.push(post);
            return;
          }
        }
      }
    },
    onUpdate: function(e) {
      if (e.detail[404]) {
        return Unread.update();
      } else {
        return Unread.addPosts(e.detail.newPosts);
      }
    },
    read: function(e) {
      var bottom, height, i, post, _i, _j, _len, _len1, _ref, _ref1;
      if (d.hidden || !Unread.posts.length) {
        return;
      }
      height = doc.clientHeight;
      _ref = Unread.posts;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        post = _ref[i];
        bottom = post.nodes.root.getBoundingClientRect().bottom;
        if (bottom > height) {
          break;
        }
      }
      if (!i) {
        return;
      }
      Unread.lastReadPost = Unread.posts[i - 1].ID;
      Unread.saveLastReadPost();
      Unread.posts = Unread.posts.slice(i);
      _ref1 = Unread.postsQuotingYou;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        post = _ref1[i];
        if (post.ID > Unread.lastReadPost) {
          break;
        }
      }
      Unread.postsQuotingYou = Unread.postsQuotingYou.slice(i);
      if (e) {
        return Unread.update();
      }
    },
    saveLastReadPost: $.debounce($.SECOND, function() {
      var lastReadPosts;
      lastReadPosts = $.get("lastReadPosts." + Unread.thread.board, {
        threads: {}
      });
      lastReadPosts.threads[Unread.thread] = Unread.lastReadPost;
      return $.set("lastReadPosts." + Unread.thread.board, lastReadPosts);
    }),
    setLine: function(force) {
      var post, root;
      if (!(d.hidden || force === true)) {
        return;
      }
      if (post = Unread.posts[0]) {
        root = post.nodes.root;
        if (root !== $('.thread > .replyContainer', root.parentNode)) {
          return $.before(root, Unread.hr);
        }
      } else if (Unread.hr.parentNode) {
        return $.rm(Unread.hr);
      }
    },
    update: function() {
      var count;
      count = Unread.posts.length;
      if (Conf['Unread Count']) {
        d.title = g.DEAD ? "(" + Unread.posts.length + ") /" + g.BOARD + "/ - 404" : "(" + Unread.posts.length + ") " + Unread.title;
      }
      if (!Conf['Unread Tab Icon']) {
        return;
      }
      Favicon.el.href = g.DEAD ? Unread.postsQuotingYou.length ? Favicon.unreadDeadY : count ? Favicon.unreadDead : Favicon.dead : Unread.postsQuotingYou.length ? Favicon.unreadY : count ? Favicon.unread : Favicon["default"];
      return $.add(d.head, Favicon.el);
    }
  };

  Favicon = {
    init: function() {
      return $.ready(function() {
        var href;
        Favicon.el = $('link[rel="shortcut icon"]', d.head);
        Favicon.el.type = 'image/x-icon';
        href = Favicon.el.href;
        Favicon.SFW = /ws\.ico$/.test(href);
        Favicon["default"] = href;
        return Favicon["switch"]();
      });
    },
    "switch": function() {
      switch (Conf['favicon']) {
        case 'ferongr':
          Favicon.unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAOMHAOgLAnMFAL8AAOgLAukMA/+AgP+rq////////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          Favicon.unreadDeadY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEklEQVQ4y6VSu07DQBCcXftQhFNQpEC0UEQpLfEXNFTQ8g0WFY0lyuRPUqRJT8kf5BucCFFhiiAyFNZad+aOFJy0utXN7HMO+OcRc5pCaf55e5AYOcbJDZjvDwFxmCTJaQpl5UDWNblcknXNyoF+taMcI2zHGbfjLCD4wYZHg1/Q2ZA0TG48wyU2HwA8nmi/qGN434lvQwVWI2GpYKngaiRM6ppKUCpoB8CrvecpqXwpm0I5a4MRzqKVK4dfMtn7dDLpO7gSMOjAKi+eauwe7qOjFe9vvd96HapP2i2ek7u5zQWn0tnU+6PBDjYf31g74OYLgAsTrPfEJ7vOL1WQ3IF/+9hdBl4reCF/yGhBMRlT2A8kHPXzaYhj2AAAAABJRU5ErkJggg==';
          Favicon.unreadSFW = 'data:image/gif;base64,R0lGODlhEAAQAOMHAADX8QBwfgC2zADX8QDY8nnl8qLp8v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          Favicon.unreadSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4y6WTv0rDUBTGf7d0aREUNwcHK1UEoQgFwQdwEZw617FrQB2yZHXqA3TNIyh0KN19hJQM2Tq4KEmhHY9Dktub9F47+MEll/N9554/H4F/QulblIq+Xx0qq9qiaWpiMq4K6484NVEqeIH4y0zCr0z8ZSZ4gVSq7dUUAhaZsKgJjOSSN5MburX7R0hiAN5Wu+PrWBLn2skYolSUdT6A0fN2mft4LTJPHeFU6PXzE07FbazrgV5fSgCfZbjptMq0MkqFu46pPLJX9oJdm4r48Xl328FZV6odFJX91xeGP/bJvg+Mopu17rBhtcqGhwGq1Ua12nB5jX0HSQyz99znOuYfyGad/0CdC5w7qHxNbvAk3NwKJ6d/2Fgm2Wx0cL8YR/0BY2szrwAAAABJRU5ErkJggg==';
          Favicon.unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAOMHAFT+ACh5AEncAFT+AFX/Acz/su7/5v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          Favicon.unreadNSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4y6VSPWvCUBQ9L2Qp0iLWLSB1Mkh3oYs/oUscxNGhvyF1rtD/0bGD5Be4dXGra6CLHTvYZKrkdAg3773kpQ698OBy7rlf71zgn6bEiQpQ/FdP46a5OL4E9iubWC/SyokKMIzBHRN+8ZM7Jgxj0Ox2liOEGRVnVBbBTJa4mezJaMMlkKVlwWfcN/YXLEuJ4RLYr8rGyrUfANw+6Y86F6/WMF99gukW7E3KN902441Cdbw3AcUAvAnut0llShkVYNK36nWdncMYDZkEvwmDaoLLkZ7QOqSXdYIHBM7Vjt1D5f986wk9l1QuG8wBv6PgdxSuxhq3CmQp8f7I6h5MO2yAU06cciL/aPl92dt1yoMFeH0HXgR/yChJLhnbYr91gPOcGoNvnQAAAABJRU5ErkJggg==';
          break;
        case 'xat-':
          Favicon.unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2ElEQVQ4y61TQQrCMBDMQ8WDIEV6LbT2A4og2Hq0veo7fIAH04dY9N4xmyYlpGmI2MCQTWYy3Wy2DAD7B2wWAzWgcTgVeZKlZRxHNYFi2jM18oBh0IcKtC6ixf22WT4IFLs0owxswXu9egm0Ls6bwfCFfNsJYJKfqoEkd3vgUgFVLWObtzNgVKyruC+ljSzr5OEnBzjvjcQecaQhbZgBb4CmGQw+PoMkTUtdbd8VSEPakcGxPOcsoIgUKy0LecY29BmdBrqRfjIwZ93KLs5loHvBnL3cLH/jF+C/+z5dgUysAAAAAElFTkSuQmCC';
          Favicon.unreadDeadY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABa0lEQVQ4y8WTv0vDUBDHv6/EoaQ/AsZYHJ06SpUiCP0L/AcsToXSoUPFQdo6iyIIVicpdPJfcIkIrXSwguA/4FpK0yHUhiKkOYfkhTR5Ogne8g7e3efuvvce8N/GAj5x5/K6dToeDTPzT1MGgHhSsbTMxujkqHYWzuUAotBNq3L4rMViCQAYO86sdndfoGhlttRBOGBaLpkAWKrdSYuSAUASJXNLrq2nQ2P6szLvEGoAAHR+AaiqG2IYYI26UD/eAarVSmfPmW/t29JmclVLQ1UZ8nk3bPCKbrFIx7q+mNDiK7ud6+n6E5YA4h0xf4B6t8veDEMCICmKssNDfEA8oViGac1S7Y7ijzAYuJDJBC/Doc+1bXslUuzq5rbpiUnk6kHUbDjUbBAAygLETZblsahhP5kDpuWS6a2SdgOAoOC/avAg2R+emzsAILPIRqMAFsD3Y/F3DngEYHmvhQlA4bdAP9z1vbPwZ7/xG/NNlMkOsFNNAAAAAElFTkSuQmCC';
          Favicon.unreadSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA30lEQVQ4y2P4//8/AyWYgSoGQMF/GJ7Y11VVUVoyKTM9ey4Ig9ggMWQ1YA1IBvzXm34YjkH8mPyJB+Nqlp8FYRAbmxoMF6ArSNrw6T0Qf8Amh9cFMEWVR/7/A+L/uORxhgEIt5/+/3/2lf//5wAxiI0uj+4CBlBgxVUvOwtydgXQZpDmi2/+/7/0GmIQSAwkB1IDUkuUAZeABlx+g2zAZ9wGlAOjChba+LwAUgNSi2HA5Am9VciBhSsQQWyoWgZiovEDsdGI1QBYQiLJAGQalpSxyWEzAJYWkGm8clTJjQCZ1hkoVG0CygAAAABJRU5ErkJggg==';
          Favicon.unreadSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABjklEQVQ4y8VTv0tCURT+rtkPU997w8sfFA1NLUWEtlROjQ3O0dQSEvLEIJJmkRoiIXBz6g9oaTECK4ckAwmCIFrzx3Monw9Nnt4G3xN9PpuCznLPPfc7H+d+5xzgv430+FRz4qcnR4VC2fVVrVsBgGUsstvtKArhg6g+VyOgi4n77stzYB3bQvzOZHfYAKAtlWsXccGnxwAgfRXoATuX1U8AJOlnWKNkADAZJWvm5O2sk7ez+riKpUM1AIDYIwVv6QDEOhDxEkP9zNotsLuXlPnVJbN3c87B21neArLiAggFsiVg6zxNU2fhVqta+fYszN9e36TQRzCsRZpK6cQhEd+ezADMHMd5NEyXgGEsslQTa0k/w2lfyBY7JJU68PHy0CVWFGV0gGBm2l08DglBTcyIlyCSoRQAia0RjDtne4tTBgiCof2ovhOlilRVXXZk0taNy7I8NUBgZEru6l11lznPBkxjEwMYkz6gDgkAwCpm8lYxkwcA6TWHdrOBdrPx625Qo5noiWXU0/dn2/gDsiiJvxnPWcEAAAAASUVORK5CYII=';
          Favicon.unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4y2P4//8/AyWYgSoGQMF/GJ7YNbGqrKRiUnp21lwQBrFBYshqwBqQDPifdsYYjkH8mInxB+OWx58FYRAbmxoMF6ArKPmU9B6IP2CTw+sCmKKe/5X/gPg/LnmcYQDCs/63/1/9fzYQzwGz0eXRXcAACqy4ZfFnQc7u+V/xD6T55v+LQHwJbBBIDCQHUgNSS5QBt4Cab/2/jDDgMx4DykrKJ8FCG58XQGpAajEMmNw7uQo5sHAFIogNVctATDR+IDYasRoAS0gkGYBMw5IyNjlsBsDSAjKNV44quREAx58Mr9vt5wQAAAAASUVORK5CYII=';
          Favicon.unreadNSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABi0lEQVQ4y8WTzysEYRjHP7M/MI3dGVp2RXJwohysOIhyEGdnpRxWkTaRLGeU1mFzcyAl/4Gbg7QHisIdJSy7CsO0B7tel5mJ2eGkPJf3eZ/3+3zf5yf8t0hfdGEpqZXUwm02E3nJ6wqAKgeN+tq6+/hsfNHpaxGI2HHUflnvOGE4NXLgqaUS4CPL23Z8q9eJAaRvETgBM/roMyAlgxuqmzOAx83ZkkggrEYCYdVpN7HixxoArItlqggBEk/kiEkJ1/p5rdvYxHhj61SL6N+MykNLA+URGqQ2OgnTgM4Tob6AuDnPFP3+8nx3V8/e1cXlDoDv9xZJdpC7c/tS5iTnA3yapnVYGJtAlQOGkTPeksENzUrhjCMzhUeuD+9s4kKh4C/5bW11bd4spogdRwUgkiLxkRQJAQitqUJYoihKtiSCyenJRWcn7l8fdCvAskq7XBiGUVNC4CbZ3eKFqbY3D1bjl70lGI/TYA4JAHJaOZXTyinAzaHOe77Ie774624It5n4YkubZ++fbeMnwHeVVSmTml8AAAAASUVORK5CYII=';
          break;
        case 'Mayhem':
          Favicon.unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jZ2ScWuDMBDFgw4pIkU0WsoQkWAYIkXZH4N9/+/V3dmfXSrKYIFHwt17j8vdGWNMIkgFuaDgzgQnwRs4EQs5KdolUQtagRN0givEDBTEOjgtGs0Zq8F7cKqqusVxrMQLaDUWcjBSrXkn8gs51tpJSWLk9b3HUa0aNIL5gPBR1/V4kJvR7lTwl8GmAm1Gf9+c3S+89qBHa8502AsmSrtBaEBPbIbj0ah2madlNAPEccdgJDfAtWifBjqWKShRBT6KoiH8QlEUn/qt0CCjnNdmPUwmFWzj9Oe6LpKuZXcwqq88z78Pch3aZU3dPwwc2sWlfZKCW5tWluV8kGvXClLm6dYN4/aUqfCbnEOzNDGhGZbNargvxCzvMGfRJD8UaDVvgkzo6QAAAABJRU5ErkJggg==';
          Favicon.unreadDeadY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABj0lEQVQ4y42TQUorQRCGv+oekpj43pOhOyIiKoHBxTMkuAnEtWcwx/AY3sUbBIRcwCw8gCfIMkaTOOUiNdgGRRuKoav+v2qq/i4BakBmXweUwDoxLF5ZhVkC64rYBHYMUAIvwKuBMEwdaFiCNbAAngEC0NHkxBi73vsOsG92HGPsphigY1wOzfNhqhpC6AEd730RQuh9hQEOAY6A/jeAs3a7/f+bWB84ckCpqg+I8Osjgqo+AKUDViJS8LkGMcY+sJrNZssYY387LiIFsBLgL9AC/pgaArzZlF+sZgO4BG7sfgvcA3MxUtOStBIpX7cS3Klqd9OBTIEr4DlLOsuAmqpODXQOiHMuy/O8FkLoJth/6Uh2gQPg87Q3k+7leX6hqnpmPvM/GWfXWeWGqj5+oUS9LMs6wF7iHAwGJ9ZW5uxpup+UGwEtEVoijEYjKl66PJujmvIW3vsFwBiYqzJXZTweY5wSU6Bd7UP1KoECODUrJpOJAtPhcKjAtXGaYptWs57qWyv9Zn/it1a5knj5Dm3v4q8APeACAAAAAElFTkSuQmCC';
          Favicon.unreadSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZ2S4crCMAxF+0OGDJEPKYrIGKOsiJSx/fJRfSAfTJNyKqXfiuDg0C25N2RJjTGmEVrhTzhw7oStsIEtsVzT4o2Jo9ALThiEM8IdHIgNaHo8mjNWg6/ske8bohPo+63QOLzmooHp8fyAICBSQkVz0QKdsFQEV6WSW/D+7+BbgbIDHcb4Kp61XyjyI16zZ8JemGltQtDBSGxB4/GoN+7TpkkjDCsFArm0IYv3U0BbnYtf8BCy+JytsE0X6VyuKhPPK/GAJ14kvZZDZVV3pZIb8MZr6n4o4PDGKn0S5SdDmyq5PnXQsk+Xbhinp03FFzmHJw6xYRiWm9VxnohZ3vOcxdO8ARmXRvbWdtzQAAAAAElFTkSuQmCC';
          Favicon.unreadSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABlklEQVQ4y4WTTWobQRCFv2qNRiP5J1mJLAzBJMiCYBubLATy0uQM1jYrb30M38CHyA20EngZPAhhCEaXMIkjWUjzvKkWzWzcUPRM13vVXfWqDMiBzPcAVMA6MdwfLWJWwDoSO0DbARWwBF4dhGNaQOEB1sAC+J/54Z6kuYMxs2/AiwfCMTuSHhPMV6DKgJak+endffQh6dHMjv1FAG1JsxpmbmYHAQhmdj69vtg6T+/ukTQDmkCzTp5eX2Bm50AIQCXpIQW8t/yCB6AyoAt8kPSUgjyFRZpCzd8DnjMvVMPMjlwNAzY1FYKZ/QRu/P8W+AcszUkdYMctSvlaU+GXpBO/vQR+RBlJmiWXVCYpWOyDfr9/kmD3U1LwarcllbGYkmZmdubfZfHpc1qCyAnBgxR1qXy13Gh0dreHg8Hg0NPKgkcL70n38fslIS8IecFoNIqvCOnwbJskWYso5d8/v6lWS6rVkvF4jHMqXIEu8EWSgDPfe8ChW28ymQgoh8OhgCvndMwnLfecWrWR3vhLGrVRjhKv3gDhOKP2kgPZ3gAAAABJRU5ErkJggg==';
          Favicon.unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jZ2S0WrDMAxF/TBCCKWMYhZKCSGYmFJMSNjD/mhf239qJXNcjBdTWODgRLpXKJKNMaYROuFTOHEehFb4gJZYrunwxsSXMApOmIQzwgOciE1oRjyaM1aDj+yR7xuiHvT9VmgcXnPRwO/9+wWCgEgJFc1FCwzCVhFclUpuw/u3g3cFyg50GPOjePZ+ocjPeM2RCXthpbUFwQAzsQ2Nx6PeuE+bJo0w7BQI5NKGLN5XAW11LX7BQ8jia7bCLl2kc7mqTLzuxAOeeJH0Wk6VVf0oldyEN15T948CDm+sMiZRfjK0pZIbUwcd+3TphnF62lR8kXN44hAbhmG5WQNnT8zynucsnuYJhFpBfkMzqD4AAAAASUVORK5CYII=';
          Favicon.unreadNSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABlklEQVQ4y4WTv04bQRDGf7N3/nMmCSIFVRoLZCxFQQJTWHKP8gi4paHOY/AIvANv4ModBXCFRRO5zAskSnL8se+jmbVW13il0d7tfN/sznwzBrSB3PcA1MAqMdwfLWJegVUk9oDCATXwDLw4CMd0gK4HWAEV8D/3w4+Slg7GzL4C/zwQjtmR9JRgDoE6BzqSllcPZ9GHpCcz++YvAigkLRqYpZl9CUAws9Ob0f3GefVwhqQF0AJaTfLN6B4zOwVCAGpJjylg2/ILHoHagH1gV9LPFOQpVGkKDf8A+J17oTIzO3I1DFg3VAhmdgn88P9r4C/wbE7qATtuUcqXhgq3ko799hI4jzKSNEtbUpmkYLEPhsPhcYL9lJKCV7uQVMZiSlqY2Yl/l3v9Ii1B5ITgQbpNqXx13Gh/yDaH4/G472nlwaOFbdIdfv9Mq8hoFRnT6TS+IqTDs2mSZFVRyl93f3ir1rxVa2azGc6pcQX2gQNJAk58HwB9t8F8PhdQTiYTARfO6ZlPWttz6jRGeu0vyRqjHCV+fQf4OaM8g/XFLAAAAABJRU5ErkJggg==';
          break;
        case 'Original':
          Favicon.unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          Favicon.unreadDeadY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsUlEQVQ4y6VTPQ6DIQh9NG5degyPQOJJetZOTj1R5/ctYggVbVISEoTHPwJ/kphAklMpIitwihmGyR54wghJiggYyiI5s2wxJ8AoN01wWzmfiBbUMsT+4hxO9gnyFLP23qmqVFX23vOCswCq6oO/TV+is613yBL1gx7ZkZCDfVcAWN271sqt8yqAhre1WX5d3RPAfXHhZfU5ViN+Afi4w8pnEEr0ttYaAeRrNKfNZ/qyXeAkApbmVGieAAAAAElFTkSuQmCC';
          Favicon.unreadSFW = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAC6Xw////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          Favicon.unreadSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3UlEQVQ4y6VTMQ6DMAw8U9RWVQe2bp0zdepgCbH1M7yI90QMXTox5R9dEAPuQqIoxKVST0KKzueL8QHwJ8gfREQCSUQ5sapZCuGJhVuaUkSEiHDrekTuWHjyzapGEwxtAz+IViMiKnLNW7h1fZgg+37pHrbqQRQjvdVaK8wszCzWWlHH0wyYOTZ/er5Mm328uRQiVCuDdJnxkogIh8s1dBtjjHMOAFBoMabYnc7h7JwL5uWv0VX3B4r9ccUXKTG0Tdbg7V6YpxHzNOrbj/LNfgd1XQsAPUbf9OVnWtU+UtzonSagmcwAAAAASUVORK5CYII=';
          Favicon.unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAGbMM////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          Favicon.unreadNSFWY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA30lEQVQ4y6VTMQ6CQBCcBTSaWBBfYGFBD8UmfMCX8Ch+c5UW0N8DfIGNBSFrw10ux62YOAnJZXZ2btkB4E+QO4iIeJKIUmJVsxT8Ewq3NIWICBGhG2oE7lh4cs2qRhP0zQg3iFYjIspSzVvohtpPkHy/eA9bdS8KEd9qjBFmFmYWY4yo42kGzBya3x1fxM0u3lQKAcqVQbzMcElEhPJy8N1VVVXWWgBApsUYY3/K/dla682LX6O73s7YHfMVn8VE34xJg+fjhek9Y3rP+vaDfJPfQdu2AkCP0TV9+ZlWtQ9lu+fiaucJAgAAAABJRU5ErkJggg==';
      }
      if (Favicon.SFW) {
        Favicon.unread = Favicon.unreadSFW;
        return Favicon.unreadY = Favicon.unreadSFWY;
      } else {
        Favicon.unread = Favicon.unreadNSFW;
        return Favicon.unreadY = Favicon.unreadNSFWY;
      }
    },
    empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  };

  ThreadStats = {
    init: function() {
      if (g.VIEW !== 'thread' || !Conf['Thread Stats']) {
        return;
      }
      this.dialog = UI.dialog('thread-stats', 'bottom: 0; left: 0;', "<div class=move><span id=post-count>0</span> / <span id=file-count>0</span></div>");
      this.postCountEl = $('#post-count', this.dialog);
      this.fileCountEl = $('#file-count', this.dialog);
      return Thread.prototype.callbacks.push({
        name: 'Thread Stats',
        cb: this.node
      });
    },
    node: function() {
      var ID, fileCount, post, postCount, _ref;
      postCount = 0;
      fileCount = 0;
      _ref = this.posts;
      for (ID in _ref) {
        post = _ref[ID];
        postCount++;
        if (post.file) {
          fileCount++;
        }
      }
      ThreadStats.update(postCount, fileCount);
      ThreadStats.thread = this;
      $.on(d, 'ThreadUpdate', ThreadStats.onUpdate);
      return $.add(d.body, ThreadStats.dialog);
    },
    onUpdate: function(e) {
      var fileCount, fileLimit, postCount, postLimit, _ref;
      if (e.detail[404]) {
        return;
      }
      _ref = e.detail, postCount = _ref.postCount, fileCount = _ref.fileCount, postLimit = _ref.postLimit, fileLimit = _ref.fileLimit;
      return ThreadStats.update(postCount, fileCount, postLimit, fileLimit);
    },
    update: function(postCount, fileCount, postLimit, fileLimit) {
      ThreadStats.postCountEl.textContent = postCount;
      ThreadStats.fileCountEl.textContent = fileCount;
      (postLimit && !ThreadStats.thread.isSticky ? $.addClass : $.rmClass)(ThreadStats.postCountEl, 'warning');
      return (fileLimit && !ThreadStats.thread.isSticky ? $.addClass : $.rmClass)(ThreadStats.fileCountEl, 'warning');
    }
  };

  ThreadUpdater = {
    init: function() {
      var checked, conf, html, name, _ref;
      if (g.VIEW !== 'thread' || !Conf['Thread Updater']) {
        return;
      }
      html = '';
      _ref = Config.updater.checkbox;
      for (name in _ref) {
        conf = _ref[name];
        checked = Conf[name] ? 'checked' : '';
        html += "<div><label title='" + conf[1] + "'><input name='" + name + "' type=checkbox " + checked + "> " + name + "</label></div>";
      }
      checked = Conf['Auto Update'] ? 'checked' : '';
      html = "<div class=move><span id=update-status></span> <span id=update-timer></span></div>\n" + html + "\n<div><label title='Controls whether *this* thread automatically updates or not'><input type=checkbox name='Auto Update This' " + checked + "> Auto Update This</label></div>\n<div><label><input type=number name=Interval class=field min=5 value=" + Conf['Interval'] + "> Refresh rate (s)</label></div>\n<div><input value='Update' type=button name='Update'></div>";
      this.dialog = UI.dialog('updater', 'bottom: 0; right: 0;', html);
      this.timer = $('#update-timer', this.dialog);
      this.status = $('#update-status', this.dialog);
      return Thread.prototype.callbacks.push({
        name: 'Thread Updater',
        cb: this.node
      });
    },
    node: function() {
      var input, _i, _len, _ref;
      ThreadUpdater.thread = this;
      ThreadUpdater.root = this.OP.nodes.root.parentNode;
      ThreadUpdater.lastPost = +ThreadUpdater.root.lastElementChild.id.match(/\d+/)[0];
      ThreadUpdater.outdateCount = 0;
      ThreadUpdater.lastModified = '0';
      _ref = $$('input', ThreadUpdater.dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        if (input.type === 'checkbox') {
          $.on(input, 'change', $.cb.checked);
        }
        switch (input.name) {
          case 'Scroll BG':
            $.on(input, 'change', ThreadUpdater.cb.scrollBG);
            ThreadUpdater.cb.scrollBG();
            break;
          case 'Auto Update This':
            $.on(input, 'change', ThreadUpdater.cb.autoUpdate);
            $.event('change', null, input);
            break;
          case 'Interval':
            $.on(input, 'change', ThreadUpdater.cb.interval);
            ThreadUpdater.cb.interval.call(input);
            break;
          case 'Update':
            $.on(input, 'click', ThreadUpdater.update);
        }
      }
      $.on(window, 'online offline', ThreadUpdater.cb.online);
      $.on(d, 'QRPostSuccessful', ThreadUpdater.cb.post);
      $.on(d, 'visibilitychange', ThreadUpdater.cb.visibility);
      ThreadUpdater.cb.online();
      return $.add(d.body, ThreadUpdater.dialog);
    },
    /*
    http://freesound.org/people/pierrecartoons1979/sounds/90112/
    cc-by-nc-3.0
    */

    beep: 'data:audio/wav;base64,UklGRjQDAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAc21wbDwAAABBAAADAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkYXRhzAIAAGMms8em0tleMV4zIpLVo8nhfSlcPR102Ki+5JspVEkdVtKzs+K1NEhUIT7DwKrcy0g6WygsrM2k1NpiLl0zIY/WpMrjgCdbPhxw2Kq+5Z4qUkkdU9K1s+K5NkVTITzBwqnczko3WikrqM+l1NxlLF0zIIvXpsnjgydZPhxs2ay95aIrUEkdUdC3suK8N0NUIjq+xKrcz002WioppdGm091pK1w0IIjYp8jkhydXPxxq2K295aUrTkoeTs65suK+OUFUIzi7xqrb0VA0WSoootKm0t5tKlo1H4TYqMfkiydWQBxm16+85actTEseS8y7seHAPD9TIza5yKra01QyWSson9On0d5wKVk2H4DYqcfkjidUQB1j1rG75KsvSkseScu8seDCPz1TJDW2yara1FYxWSwnm9Sn0N9zKVg2H33ZqsXkkihSQR1g1bK65K0wSEsfR8i+seDEQTxUJTOzy6rY1VowWC0mmNWoz993KVc3H3rYq8TklSlRQh1d1LS647AyR0wgRMbAsN/GRDpTJTKwzKrX1l4vVy4lldWpzt97KVY4IXbUr8LZljVPRCxhw7W3z6ZISkw1VK+4sMWvXEhSPk6buay9sm5JVkZNiLWqtrJ+TldNTnquqbCwilZXU1BwpKirrpNgWFhTaZmnpquZbFlbVmWOpaOonHZcXlljhaGhpZ1+YWBdYn2cn6GdhmdhYGN3lp2enIttY2Jjco+bnJuOdGZlZXCImJqakHpoZ2Zug5WYmZJ/bGlobX6RlpeSg3BqaW16jZSVkoZ0bGtteImSk5KIeG5tbnaFkJKRinxxbm91gY2QkIt/c3BwdH6Kj4+LgnZxcXR8iI2OjIR5c3J0e4WLjYuFe3VzdHmCioyLhn52dHR5gIiKioeAeHV1eH+GiYqHgXp2dnh9hIiJh4J8eHd4fIKHiIeDfXl4eHyBhoeHhH96eHmA',
    cb: {
      online: function() {
        if (ThreadUpdater.online = navigator.onLine) {
          ThreadUpdater.outdateCount = 0;
          ThreadUpdater.set('timer', ThreadUpdater.getInterval());
          if (Conf['Auto Update This']) {
            ThreadUpdater.update();
          }
          ThreadUpdater.set('status', null, null);
        } else {
          ThreadUpdater.set('timer', null);
          ThreadUpdater.set('status', 'Offline', 'warning');
        }
        return ThreadUpdater.cb.autoUpdate();
      },
      post: function(e) {
        if (!(Conf['Auto Update This'] && e.detail.threadID === ThreadUpdater.thread.ID)) {
          return;
        }
        ThreadUpdater.outdateCount = 0;
        if (ThreadUpdater.seconds > 2) {
          return setTimeout(ThreadUpdater.update, 1000);
        }
      },
      visibility: function() {
        if (d.hidden) {
          return;
        }
        ThreadUpdater.outdateCount = 0;
        if (ThreadUpdater.seconds > ThreadUpdater.interval) {
          return ThreadUpdater.set('timer', ThreadUpdater.getInterval());
        }
      },
      scrollBG: function() {
        return ThreadUpdater.scrollBG = Conf['Scroll BG'] ? function() {
          return true;
        } : function() {
          return !d.hidden;
        };
      },
      autoUpdate: function() {
        if (Conf['Auto Update This'] && ThreadUpdater.online) {
          return ThreadUpdater.timeoutID = setTimeout(ThreadUpdater.timeout, 1000);
        } else {
          return clearTimeout(ThreadUpdater.timeoutID);
        }
      },
      interval: function() {
        var val;
        val = Math.max(5, parseInt(this.value, 10));
        ThreadUpdater.interval = this.value = val;
        return $.cb.value.call(this);
      },
      load: function() {
        var klass, req, text, _ref, _ref1;
        req = ThreadUpdater.req;
        switch (req.status) {
          case 200:
            g.DEAD = false;
            ThreadUpdater.parse(JSON.parse(req.response).posts);
            ThreadUpdater.lastModified = req.getResponseHeader('Last-Modified');
            ThreadUpdater.set('timer', ThreadUpdater.getInterval());
            break;
          case 404:
            g.DEAD = true;
            ThreadUpdater.set('timer', null);
            ThreadUpdater.set('status', '404', 'warning');
            clearTimeout(ThreadUpdater.timeoutID);
            ThreadUpdater.thread.kill();
            $.event('ThreadUpdate', {
              404: true,
              thread: ThreadUpdater.thread
            });
            break;
          default:
            ThreadUpdater.outdateCount++;
            ThreadUpdater.set('timer', ThreadUpdater.getInterval());
            /*
            Status Code 304: Not modified
            By sending the `If-Modified-Since` header we get a proper status code, and no response.
            This saves bandwidth for both the user and the servers and avoid unnecessary computation.
            */

            _ref1 = (_ref = req.status) === 0 || _ref === 304 ? [null, null] : ["" + req.statusText + " (" + req.status + ")", 'warning'], text = _ref1[0], klass = _ref1[1];
            ThreadUpdater.set('status', text, klass);
        }
        return delete ThreadUpdater.req;
      }
    },
    getInterval: function() {
      var i, j;
      i = ThreadUpdater.interval;
      j = Math.min(ThreadUpdater.outdateCount, 10);
      if (!d.hidden) {
        j = Math.min(j, 7);
      }
      return ThreadUpdater.seconds = Math.max(i, [0, 5, 10, 15, 20, 30, 60, 90, 120, 240, 300][j]);
    },
    set: function(name, text, klass) {
      var el, node;
      el = ThreadUpdater[name];
      if (node = el.firstChild) {
        node.data = text;
      } else {
        el.textContent = text;
      }
      if (klass !== void 0) {
        return el.className = klass;
      }
    },
    timeout: function() {
      var n;
      ThreadUpdater.timeoutID = setTimeout(ThreadUpdater.timeout, 1000);
      if (!(n = --ThreadUpdater.seconds)) {
        return ThreadUpdater.update();
      } else if (n <= -60) {
        ThreadUpdater.set('status', 'Retrying', null);
        return ThreadUpdater.update();
      } else if (n > 0) {
        return ThreadUpdater.set('timer', n);
      }
    },
    update: function() {
      var url;
      if (!ThreadUpdater.online) {
        return;
      }
      ThreadUpdater.seconds = 0;
      ThreadUpdater.set('timer', '...');
      if (ThreadUpdater.req) {
        ThreadUpdater.req.onloadend = null;
        ThreadUpdater.req.abort();
      }
      url = "//api.4chan.org/" + ThreadUpdater.thread.board + "/res/" + ThreadUpdater.thread + ".json";
      return ThreadUpdater.req = $.ajax(url, {
        onloadend: ThreadUpdater.cb.load
      }, {
        headers: {
          'If-Modified-Since': ThreadUpdater.lastModified
        }
      });
    },
    updateThreadStatus: function(title, OP) {
      var icon, message, root, titleLC;
      titleLC = title.toLowerCase();
      if (ThreadUpdater.thread["is" + title] === !!OP[titleLC]) {
        return;
      }
      if (!(ThreadUpdater.thread["is" + title] = !!OP[titleLC])) {
        message = title === 'Sticky' ? 'The thread is not a sticky anymore.' : 'The thread is not closed anymore.';
        new Notification('info', message, 30);
        $.rm($("." + titleLC + "Icon", ThreadUpdater.thread.OP.nodes.info));
        return;
      }
      message = title === 'Sticky' ? 'The thread is now a sticky.' : 'The thread is now closed.';
      new Notification('info', message, 30);
      icon = $.el('img', {
        src: "//static.4chan.org/image/" + titleLC + ".gif",
        alt: title,
        title: title,
        className: "" + titleLC + "Icon"
      });
      root = $('[title="Quote this post"]', ThreadUpdater.thread.OP.nodes.info);
      if (title === 'Closed') {
        root = $('.stickyIcon', ThreadUpdater.thread.OP.nodes.info) || root;
      }
      return $.after(root, [$.tn(' '), icon]);
    },
    parse: function(postObjects) {
      var ID, OP, count, deletedFiles, deletedPosts, files, index, node, nodes, num, post, postObject, posts, scroll, _i, _len, _ref;
      OP = postObjects[0];
      Build.spoilerRange[ThreadUpdater.thread.board] = OP.custom_spoiler;
      ThreadUpdater.updateThreadStatus('Sticky', OP);
      ThreadUpdater.updateThreadStatus('Closed', OP);
      nodes = [];
      posts = [];
      index = [];
      files = [];
      count = 0;
      for (_i = 0, _len = postObjects.length; _i < _len; _i++) {
        postObject = postObjects[_i];
        num = postObject.no;
        index.push(num);
        if (postObject.fsize) {
          files.push(num);
        }
        if (num <= ThreadUpdater.lastPost) {
          continue;
        }
        count++;
        node = Build.postFromObject(postObject, ThreadUpdater.thread.board);
        nodes.push(node);
        posts.push(new Post(node, ThreadUpdater.thread, ThreadUpdater.thread.board));
      }
      deletedPosts = [];
      deletedFiles = [];
      _ref = ThreadUpdater.thread.posts;
      for (ID in _ref) {
        post = _ref[ID];
        ID = +ID;
        if (post.isDead && index.contains(ID)) {
          post.resurrect();
        } else if (!index.contains(ID)) {
          post.kill();
          deletedPosts.push(post);
        } else if (post.file && !post.file.isDead && files.contains(ID)) {
          post.kill(true);
          deletedFiles.push(post);
        }
      }
      if (!count) {
        ThreadUpdater.set('status', null, null);
        ThreadUpdater.outdateCount++;
      } else {
        ThreadUpdater.set('status', "+" + count, 'new');
        ThreadUpdater.outdateCount = 0;
        if (Conf['Beep'] && d.hidden && Unread.posts && !Unread.posts.length) {
          if (!ThreadUpdater.audio) {
            ThreadUpdater.audio = $.el('audio', {
              src: ThreadUpdater.beep
            });
          }
          ThreadUpdater.audio.play();
        }
        ThreadUpdater.lastPost = posts[count - 1].ID;
        Main.callbackNodes(Post, posts);
        scroll = Conf['Auto Scroll'] && ThreadUpdater.scrollBG() && ThreadUpdater.root.getBoundingClientRect().bottom - doc.clientHeight < 25;
        $.add(ThreadUpdater.root, nodes);
        if (scroll) {
          if (Conf['Bottom Scroll']) {
            ($.engine === 'webkit' ? d.body : doc).scrollTop = d.body.clientHeight;
          } else {
            nodes[0].scrollIntoView();
          }
        }
        $.queueTask(function() {
          var length, threadID;
          threadID = ThreadUpdater.thread.ID;
          length = ThreadUpdater.root.children.length;
          if (Conf['Enable 4chan\'s Extension']) {
            return $.unsafeWindow.Parser.parseThread(threadID, -count);
          } else {
            return Fourchan.parseThread(threadID, length - count, length);
          }
        });
      }
      return $.event('ThreadUpdate', {
        404: false,
        thread: ThreadUpdater.thread,
        newPosts: posts,
        deletedPosts: deletedPosts,
        deletedFiles: deletedFiles,
        postCount: OP.replies + 1,
        fileCount: OP.images + (!!ThreadUpdater.thread.OP.file && !ThreadUpdater.thread.OP.file.isDead),
        postLimit: !!OP.bumplimit,
        fileLimit: !!OP.imagelimit
      });
    }
  };

  ThreadWatcher = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Thread Watcher']) {
        return;
      }
      this.dialog = UI.dialog('watcher', 'top: 50px; left: 0px;', '<div class=move>Thread Watcher</div>');
      $.on(d, 'QRPostSuccessful', this.cb.post);
      $.on(d, '4chanXInitFinished', this.ready);
      $.sync('WatchedThreads', this.refresh);
      return Thread.prototype.callbacks.push({
        name: 'Thread Watcher',
        cb: this.node
      });
    },
    node: function() {
      var favicon;
      favicon = $.el('img', {
        className: 'favicon'
      });
      $.on(favicon, 'click', ThreadWatcher.cb.toggle);
      $.before($('input', this.OP.nodes.post), favicon);
      if (g.VIEW === 'thread' && this.ID === $.get('AutoWatch', 0)) {
        ThreadWatcher.watch(this);
        return $["delete"]('AutoWatch');
      }
    },
    ready: function() {
      ThreadWatcher.refresh();
      return $.add(d.body, ThreadWatcher.dialog);
    },
    refresh: function(watched) {
      var ID, board, div, favicon, id, link, nodes, props, thread, x, _ref, _ref1;
      watched || (watched = $.get('WatchedThreads', {}));
      nodes = [$('.move', ThreadWatcher.dialog)];
      for (board in watched) {
        _ref = watched[board];
        for (id in _ref) {
          props = _ref[id];
          x = $.el('a', {
            textContent: '×',
            href: 'javascript:;'
          });
          $.on(x, 'click', ThreadWatcher.cb.x);
          link = $.el('a', props);
          link.title = link.textContent;
          div = $.el('div');
          $.add(div, [x, $.tn(' '), link]);
          nodes.push(div);
        }
      }
      ThreadWatcher.dialog.innerHTML = '';
      $.add(ThreadWatcher.dialog, nodes);
      watched = watched[g.BOARD] || {};
      _ref1 = g.BOARD.threads;
      for (ID in _ref1) {
        thread = _ref1[ID];
        favicon = $('.favicon', thread.OP.nodes.post);
        favicon.src = ID in watched ? Favicon["default"] : Favicon.empty;
      }
    },
    cb: {
      toggle: function() {
        return ThreadWatcher.toggle(Get.postFromNode(this).thread);
      },
      x: function() {
        var thread;
        thread = this.nextElementSibling.pathname.split('/');
        return ThreadWatcher.unwatch(thread[1], thread[3]);
      },
      post: function(e) {
        var board, postID, threadID, _ref;
        _ref = e.detail, board = _ref.board, postID = _ref.postID, threadID = _ref.threadID;
        if (postID === threadID) {
          if (Conf['Auto Watch']) {
            return $.set('AutoWatch', threadID);
          }
        } else if (Conf['Auto Watch Reply']) {
          return ThreadWatcher.watch(board.threads[threadID]);
        }
      }
    },
    toggle: function(thread) {
      if ($('.favicon', thread.OP.nodes.post).src === Favicon.empty) {
        return ThreadWatcher.watch(thread);
      } else {
        return ThreadWatcher.unwatch(thread.board, thread.ID);
      }
    },
    unwatch: function(board, threadID) {
      var watched;
      watched = $.get('WatchedThreads', {});
      delete watched[board][threadID];
      if (!Object.keys(watched[board]).length) {
        delete watched[board];
      }
      ThreadWatcher.refresh(watched);
      return $.set('WatchedThreads', watched);
    },
    watch: function(thread) {
      var watched, _name;
      watched = $.get('WatchedThreads', {});
      watched[_name = thread.board] || (watched[_name] = {});
      watched[thread.board][thread] = {
        href: "/" + thread.board + "/res/" + thread,
        textContent: Get.threadExcerpt(thread)
      };
      ThreadWatcher.refresh(watched);
      return $.set('WatchedThreads', watched);
    }
  };

  QR = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Quick Reply']) {
        return;
      }
      Misc.clearThreads("yourPosts." + g.BOARD);
      this.syncYourPosts();
      $.on(d, '4chanXInitFinished', this.initReady);
      return Post.prototype.callbacks.push({
        name: 'Quick Reply',
        cb: this.node
      });
    },
    initReady: function() {
      var sc;
      QR.postingIsEnabled = !!$.id('postForm');
      if (!QR.postingIsEnabled) {
        return;
      }
      if (Conf['Hide Original Post Form']) {
        $.addClass(doc, 'hide-original-post-form');
      }
      sc = $.el('a', {
        className: 'qr-shortcut',
        textContent: 'QR',
        title: 'Quick Reply',
        href: 'javascript:;'
      });
      $.on(sc, 'click', function() {
        $.event('CloseMenu');
        QR.open();
        QR.resetThreadSelector();
        return QR.nodes.com.focus();
      });
      Header.addShortcut(sc);
      if ($.engine === 'webkit') {
        $.on(d, 'paste', QR.paste);
      }
      $.on(d, 'dragover', QR.dragOver);
      $.on(d, 'drop', QR.dropFile);
      $.on(d, 'dragstart dragend', QR.drag);
      $.on(d, 'ThreadUpdate', function() {
        if (g.DEAD) {
          return QR.abort();
        } else {
          return QR.status();
        }
      });
      if (Conf['Persistent QR']) {
        return QR.persist();
      }
    },
    node: function() {
      return $.on($('a[title="Quote this post"]', this.nodes.info), 'click', QR.quote);
    },
    persist: function() {
      QR.open();
      if (Conf['Auto-Hide QR']) {
        return QR.hide();
      }
    },
    open: function() {
      if (QR.nodes) {
        QR.nodes.el.hidden = false;
        QR.unhide();
        return;
      }
      try {
        return QR.dialog();
      } catch (err) {
        delete QR.nodes;
        return Main.handleErrors({
          message: 'Quick Reply dialog creation crashed.',
          error: err
        });
      }
    },
    close: function() {
      var i, _i, _len, _ref;
      if (QR.req) {
        QR.abort();
        return;
      }
      QR.nodes.el.hidden = true;
      QR.cleanNotifications();
      d.activeElement.blur();
      $.rmClass(QR.nodes.el, 'dump');
      _ref = QR.posts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        QR.posts[0].rm();
      }
      QR.cooldown.auto = false;
      QR.status();
      if (!Conf['Remember Spoiler'] && QR.nodes.spoiler.checked) {
        return QR.nodes.spoiler.click();
      }
    },
    hide: function() {
      d.activeElement.blur();
      $.addClass(QR.nodes.el, 'autohide');
      return QR.nodes.autohide.checked = true;
    },
    unhide: function() {
      $.rmClass(QR.nodes.el, 'autohide');
      return QR.nodes.autohide.checked = false;
    },
    toggleHide: function() {
      if (this.checked) {
        return QR.hide();
      } else {
        return QR.unhide();
      }
    },
    syncYourPosts: function(yourPosts) {
      if (yourPosts) {
        QR.yourPosts = yourPosts;
        return;
      }
      QR.yourPosts = $.get("yourPosts." + g.BOARD, {
        threads: {}
      });
      return $.sync("yourPosts." + g.BOARD, QR.syncYourPosts);
    },
    error: function(err) {
      var el;
      QR.open();
      if (typeof err === 'string') {
        el = $.tn(err);
      } else {
        el = err;
        el.removeAttribute('style');
      }
      if (QR.captcha.isEnabled && /captcha|verification/i.test(el.textContent)) {
        QR.captcha.nodes.input.focus();
      }
      if (d.hidden) {
        alert(el.textContent);
      }
      return QR.notifications.push(new Notification('warning', el));
    },
    notifications: [],
    cleanNotifications: function() {
      var notification, _i, _len, _ref;
      _ref = QR.notifications;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        notification = _ref[_i];
        notification.close();
      }
      return QR.notifications = [];
    },
    status: function() {
      var disabled, status, value;
      if (!QR.nodes) {
        return;
      }
      if (g.DEAD) {
        value = 404;
        disabled = true;
        QR.cooldown.auto = false;
      }
      value = QR.req ? QR.req.progress : QR.cooldown.seconds || value;
      status = QR.nodes.status;
      status.value = !value ? 'Submit' : QR.cooldown.auto ? "Auto " + value : value;
      return status.disabled = disabled || false;
    },
    cooldown: {
      init: function() {
        var board;
        board = g.BOARD.ID;
        QR.cooldown.types = {
          thread: (function() {
            switch (board) {
              case 'q':
                return 86400;
              case 'b':
              case 'soc':
              case 'r9k':
                return 600;
              default:
                return 300;
            }
          })(),
          sage: board === 'q' ? 600 : 60,
          file: board === 'q' ? 300 : 30,
          post: board === 'q' ? 60 : 30
        };
        QR.cooldown.cooldowns = $.get("cooldown." + board, {});
        QR.cooldown.upSpd = 0;
        QR.cooldown.upSpdAccuracy = .5;
        QR.cooldown.start();
        return $.sync("cooldown." + board, QR.cooldown.sync);
      },
      start: function() {
        if (QR.cooldown.isCounting) {
          return;
        }
        QR.cooldown.isCounting = true;
        return QR.cooldown.count();
      },
      sync: function(cooldowns) {
        var id;
        for (id in cooldowns) {
          QR.cooldown.cooldowns[id] = cooldowns[id];
        }
        return QR.cooldown.start();
      },
      set: function(data) {
        var cooldown, delay, hasFile, isReply, isSage, post, req, start, type, upSpd;
        req = data.req, post = data.post, isReply = data.isReply, delay = data.delay;
        start = req ? req.uploadEndTime : Date.now();
        if (delay) {
          cooldown = {
            delay: delay
          };
        } else {
          if (post.file) {
            upSpd = post.file.size / ((req.uploadEndTime - req.uploadStartTime) / $.SECOND);
            QR.cooldown.upSpdAccuracy = ((upSpd > QR.cooldown.upSpd * .9) + QR.cooldown.upSpdAccuracy) / 2;
            QR.cooldown.upSpd = upSpd;
          }
          isSage = /sage/i.test(post.email);
          hasFile = !!post.file;
          type = !isReply ? 'thread' : isSage ? 'sage' : hasFile ? 'file' : 'post';
          cooldown = {
            isReply: isReply,
            isSage: isSage,
            hasFile: hasFile,
            timeout: start + QR.cooldown.types[type] * $.SECOND
          };
        }
        QR.cooldown.cooldowns[start] = cooldown;
        $.set("cooldown." + g.BOARD, QR.cooldown.cooldowns);
        return QR.cooldown.start();
      },
      unset: function(id) {
        delete QR.cooldown.cooldowns[id];
        if (Object.keys(QR.cooldown.cooldowns).length) {
          return $.set("cooldown." + g.BOARD, QR.cooldown.cooldowns);
        } else {
          return $["delete"]("cooldown." + g.BOARD);
        }
      },
      count: function() {
        var cooldown, cooldowns, elapsed, hasFile, isReply, isSage, now, post, seconds, start, type, types, upSpd, upSpdAccuracy, update, _ref;
        if (!Object.keys(QR.cooldown.cooldowns).length) {
          $["delete"]("" + g.BOARD + ".cooldown");
          delete QR.cooldown.isCounting;
          delete QR.cooldown.seconds;
          QR.status();
          return;
        }
        setTimeout(QR.cooldown.count, $.SECOND);
        now = Date.now();
        post = QR.posts[0];
        isReply = QR.nodes.thread.value !== 'new';
        isSage = /sage/i.test(post.email);
        hasFile = !!post.file;
        seconds = null;
        _ref = QR.cooldown, types = _ref.types, cooldowns = _ref.cooldowns, upSpd = _ref.upSpd, upSpdAccuracy = _ref.upSpdAccuracy;
        for (start in cooldowns) {
          cooldown = cooldowns[start];
          if ('delay' in cooldown) {
            if (cooldown.delay) {
              seconds = Math.max(seconds, cooldown.delay--);
            } else {
              seconds = Math.max(seconds, 0);
              QR.cooldown.unset(start);
            }
            continue;
          }
          if (isReply === cooldown.isReply) {
            type = !isReply ? 'thread' : isSage && cooldown.isSage ? 'sage' : hasFile && cooldown.hasFile ? 'file' : 'post';
            elapsed = Math.floor((now - start) / $.SECOND);
            if (elapsed >= 0) {
              seconds = Math.max(seconds, types[type] - elapsed);
              if (hasFile && upSpd) {
                seconds -= Math.floor(post.file.size / upSpd * upSpdAccuracy);
                seconds = Math.max(seconds, 0);
              }
            }
          }
          if (!((start <= now && now <= cooldown.timeout))) {
            QR.cooldown.unset(start);
          }
        }
        update = seconds !== null || !!QR.cooldown.seconds;
        QR.cooldown.seconds = seconds;
        if (update) {
          QR.status();
        }
        if (seconds === 0 && QR.cooldown.auto && !QR.req) {
          return QR.submit();
        }
      }
    },
    quote: function(e) {
      var OP, caretPos, post, range, s, sel, selectionRoot, ta, text;
      if (e != null) {
        e.preventDefault();
      }
      if (!QR.postingIsEnabled) {
        return;
      }
      sel = d.getSelection();
      selectionRoot = $.x('ancestor::div[contains(@class,"postContainer")][1]', sel.anchorNode);
      post = Get.postFromNode(this);
      OP = Get.contextFromLink(this).thread.OP;
      text = ">>" + post + "\n";
      if ((s = sel.toString().trim()) && post.nodes.root === selectionRoot) {
        s = s.replace(/\n/g, '\n>');
        text += ">" + s + "\n";
      }
      QR.open();
      ta = QR.nodes.com;
      if (!ta.value) {
        QR.nodes.thread.value = OP.ID;
      }
      caretPos = ta.selectionStart;
      ta.value = ta.value.slice(0, caretPos) + text + ta.value.slice(ta.selectionEnd);
      range = caretPos + text.length;
      ta.setSelectionRange(range, range);
      ta.focus();
      return $.event('input', null, ta);
    },
    characterCount: function() {
      var count, counter;
      counter = QR.nodes.charCount;
      count = QR.nodes.com.textLength;
      counter.textContent = count;
      counter.hidden = count < 1000;
      return (count > 1500 ? $.addClass : $.rmClass)(counter, 'warning');
    },
    drag: function(e) {
      var toggle;
      toggle = e.type === 'dragstart' ? $.off : $.on;
      toggle(d, 'dragover', QR.dragOver);
      return toggle(d, 'drop', QR.dropFile);
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
      QR.fileInput(e.dataTransfer.files);
      return $.addClass(QR.nodes.el, 'dump');
    },
    paste: function(e) {
      var blob, files, item, _i, _len, _ref;
      files = [];
      _ref = e.clipboardData.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.kind === 'file') {
          blob = item.getAsFile();
          blob.name = 'file';
          if (blob.type) {
            blob.name += '.' + blob.type.split('/')[1];
          }
          files.push(blob);
        }
      }
      if (!files.length) {
        return;
      }
      QR.open();
      return QR.fileInput(files);
    },
    openFileInput: function() {
      return QR.nodes.fileInput.click();
    },
    fileInput: function(files) {
      var file, length, max, post, _i, _len;
      if (this instanceof Element) {
        files = __slice.call(this.files);
        QR.nodes.fileInput.value = null;
      }
      length = files.length;
      if (!length) {
        return;
      }
      max = QR.nodes.fileInput.max;
      QR.cleanNotifications();
      if (length === 1) {
        file = files[0];
        if (/^text/.test(file.type)) {
          QR.selected.pasteText(file);
        } else if (file.size > max) {
          QR.error("File too large (file: " + ($.bytesToString(file.size)) + ", max: " + ($.bytesToString(max)) + ").");
        } else if (!QR.mimeTypes.contains(file.type)) {
          QR.error('Unsupported file type.');
        } else {
          QR.selected.setFile(file);
        }
        return;
      }
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (/^text/.test(file.type)) {
          if ((post = QR.posts[QR.posts.length - 1]).com) {
            post = new QR.post();
          }
          post.pasteText(file);
        } else if (file.size > max) {
          QR.error("" + file.name + ": File too large (file: " + ($.bytesToString(file.size)) + ", max: " + ($.bytesToString(max)) + ").");
        } else if (!QR.mimeTypes.contains(file.type)) {
          QR.error("" + file.name + ": Unsupported file type.");
        } else {
          if ((post = QR.posts[QR.posts.length - 1]).file) {
            post = new QR.post();
          }
          post.setFile(file);
        }
      }
      return $.addClass(QR.nodes.el, 'dump');
    },
    resetThreadSelector: function() {
      if (g.VIEW === 'thread') {
        return QR.nodes.thread.value = g.THREAD;
      } else {
        return QR.nodes.thread.value = 'new';
      }
    },
    posts: [],
    post: (function() {

      function _Class() {
        var el, event, persona, prev, _i, _len, _ref,
          _this = this;
        prev = QR.posts[QR.posts.length - 1];
        persona = $.get('QR.persona', {});
        this.name = prev ? prev.name : persona.name || null;
        this.email = prev && !/^sage$/.test(prev.email) ? prev.email : persona.email || null;
        this.sub = prev && Conf['Remember Subject'] ? prev.sub : Conf['Remember Subject'] ? persona.sub : null;
        this.spoiler = prev && Conf['Remember Spoiler'] ? prev.spoiler : false;
        this.com = null;
        el = $.el('a', {
          className: 'qr-preview',
          draggable: true,
          href: 'javascript:;',
          innerHTML: '<a class=remove>×</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
        });
        this.nodes = {
          el: el,
          rm: el.firstChild,
          label: $('label', el),
          spoiler: $('input', el),
          span: el.lastChild
        };
        this.nodes.spoiler.checked = this.spoiler;
        $.on(el, 'click', this.select.bind(this));
        $.on(this.nodes.rm, 'click', function(e) {
          e.stopPropagation();
          return _this.rm();
        });
        $.on(this.nodes.label, 'click', function(e) {
          return e.stopPropagation();
        });
        $.on(this.nodes.spoiler, 'change', function(e) {
          _this.spoiler = e.target.checked;
          if (_this === QR.selected) {
            return QR.nodes.spoiler.checked = _this.spoiler;
          }
        });
        $.add(QR.nodes.dumpList, el);
        _ref = ['dragStart', 'dragEnter', 'dragLeave', 'dragOver', 'dragEnd', 'drop'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          $.on(el, event.toLowerCase(), this[event]);
        }
        this.unlock();
        QR.posts.push(this);
      }

      _Class.prototype.rm = function() {
        var index;
        $.rm(this.nodes.el);
        index = QR.posts.indexOf(this);
        if (QR.posts.length === 1) {
          new QR.post().select();
        } else if (this === QR.selected) {
          (QR.posts[index - 1] || QR.posts[index + 1]).select();
        }
        QR.posts.splice(index, 1);
        if (!window.URL) {
          return;
        }
        return URL.revokeObjectURL(this.URL);
      };

      _Class.prototype.lock = function(lock) {
        var name, _i, _len, _ref;
        if (lock == null) {
          lock = true;
        }
        this.isLocked = lock;
        if (this !== QR.selected) {
          return;
        }
        _ref = ['name', 'email', 'sub', 'com', 'fileButton', 'spoiler'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          QR.nodes[name].disabled = lock;
        }
        this.nodes.rm.style.visibility = QR.nodes.fileRM.style.visibility = lock ? 'hidden' : '';
        (lock ? $.off : $.on)(QR.nodes.filename.parentNode, 'click', QR.openFileInput);
        this.nodes.spoiler.disabled = lock;
        return this.nodes.el.draggable = !lock;
      };

      _Class.prototype.unlock = function() {
        return this.lock(false);
      };

      _Class.prototype.select = function() {
        var name, rectEl, rectList, _i, _len, _ref;
        if (QR.selected) {
          QR.selected.nodes.el.id = null;
          QR.selected.forceSave();
        }
        QR.selected = this;
        this.lock(this.isLocked);
        this.nodes.el.id = 'selected';
        rectEl = this.nodes.el.getBoundingClientRect();
        rectList = this.nodes.el.parentNode.getBoundingClientRect();
        this.nodes.el.parentNode.scrollLeft += rectEl.left + rectEl.width / 2 - rectList.left - rectList.width / 2;
        _ref = ['name', 'email', 'sub', 'com'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          QR.nodes[name].value = this[name];
        }
        this.showFileData();
        return QR.characterCount();
      };

      _Class.prototype.save = function(input) {
        var value, _ref;
        value = input.value;
        this[input.dataset.name] = value;
        if (input.nodeName !== 'TEXTAREA') {
          return;
        }
        this.nodes.span.textContent = value;
        QR.characterCount();
        if (QR.cooldown.auto && this === QR.posts[0] && (0 < (_ref = QR.cooldown.seconds) && _ref <= 5)) {
          return QR.cooldown.auto = false;
        }
      };

      _Class.prototype.forceSave = function() {
        var name, _i, _len, _ref;
        if (this !== QR.selected) {
          return;
        }
        _ref = ['name', 'email', 'sub', 'com'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          this.save(QR.nodes[name]);
        }
      };

      _Class.prototype.setFile = function(file) {
        this.file = file;
        this.filename = "" + file.name + " (" + ($.bytesToString(file.size)) + ")";
        this.nodes.el.title = this.filename;
        if (QR.spoiler) {
          this.nodes.label.hidden = false;
        }
        if (window.URL) {
          URL.revokeObjectURL(this.URL);
        }
        this.showFileData();
        if (!/^image/.test(file.type)) {
          this.nodes.el.style.backgroundImage = null;
          return;
        }
        return this.setThumbnail();
      };

      _Class.prototype.setThumbnail = function(fileURL) {
        var img, reader,
          _this = this;
        if (!window.URL) {
          if (!fileURL) {
            reader = new FileReader();
            reader.onload = function(e) {
              return _this.setThumbnail(e.target.result);
            };
            reader.readAsDataURL(this.file);
            return;
          }
        } else {
          fileURL = URL.createObjectURL(this.file);
        }
        img = $.el('img');
        img.onload = function() {
          var applyBlob, cv, data, height, i, l, s, ui8a, width, _i;
          s = 90 * 2;
          height = img.height, width = img.width;
          if (height < s || width < s) {
            if (window.URL) {
              _this.URL = fileURL;
            }
            _this.nodes.el.style.backgroundImage = "url(" + _this.URL + ")";
            return;
          }
          if (height <= width) {
            width = s / height * width;
            height = s;
          } else {
            height = s / width * height;
            width = s;
          }
          cv = $.el('canvas');
          cv.height = img.height = height;
          cv.width = img.width = width;
          cv.getContext('2d').drawImage(img, 0, 0, width, height);
          if (!window.URL) {
            _this.nodes.el.style.backgroundImage = "url(" + (cv.toDataURL()) + ")";
            delete _this.URL;
            return;
          }
          URL.revokeObjectURL(fileURL);
          applyBlob = function(blob) {
            _this.URL = URL.createObjectURL(blob);
            return _this.nodes.el.style.backgroundImage = "url(" + _this.URL + ")";
          };
          if (cv.toBlob) {
            cv.toBlob(applyBlob);
            return;
          }
          data = atob(cv.toDataURL().split(',')[1]);
          l = data.length;
          ui8a = new Uint8Array(l);
          for (i = _i = 0; 0 <= l ? _i < l : _i > l; i = 0 <= l ? ++_i : --_i) {
            ui8a[i] = data.charCodeAt(i);
          }
          return applyBlob(new Blob([ui8a], {
            type: 'image/png'
          }));
        };
        return img.src = fileURL;
      };

      _Class.prototype.rmFile = function() {
        delete this.file;
        delete this.filename;
        this.nodes.el.title = null;
        this.nodes.el.style.backgroundImage = null;
        if (QR.spoiler) {
          this.nodes.label.hidden = true;
        }
        this.showFileData();
        if (!window.URL) {
          return;
        }
        return URL.revokeObjectURL(this.URL);
      };

      _Class.prototype.showFileData = function(hide) {
        if (this.file) {
          QR.nodes.filename.textContent = this.filename;
          QR.nodes.filename.title = this.filename;
          if (QR.spoiler) {
            QR.nodes.spoiler.checked = this.spoiler;
          }
          return $.addClass(QR.nodes.fileSubmit, 'has-file');
        } else {
          return $.rmClass(QR.nodes.fileSubmit, 'has-file');
        }
      };

      _Class.prototype.pasteText = function(file) {
        var reader,
          _this = this;
        reader = new FileReader();
        reader.onload = function(e) {
          var text;
          text = e.target.result;
          if (_this.com) {
            _this.com += "\n" + text;
          } else {
            _this.com = text;
          }
          if (QR.selected === _this) {
            QR.nodes.com.value = _this.com;
          }
          return _this.nodes.span.textContent = _this.com;
        };
        return reader.readAsText(file);
      };

      _Class.prototype.dragStart = function() {
        return $.addClass(this, 'drag');
      };

      _Class.prototype.dragEnd = function() {
        return $.rmClass(this, 'drag');
      };

      _Class.prototype.dragEnter = function() {
        return $.addClass(this, 'over');
      };

      _Class.prototype.dragLeave = function() {
        return $.rmClass(this, 'over');
      };

      _Class.prototype.dragOver = function(e) {
        e.preventDefault();
        return e.dataTransfer.dropEffect = 'move';
      };

      _Class.prototype.drop = function() {
        var el, index, newIndex, oldIndex, post;
        el = $('.drag', this.parentNode);
        $.rmClass(el, 'drag');
        $.rmClass(this, 'over');
        if (!this.draggable) {
          return;
        }
        index = function(el) {
          return __slice.call(el.parentNode.children).indexOf(el);
        };
        oldIndex = index(el);
        newIndex = index(this);
        (oldIndex < newIndex ? $.after : $.before)(this, el);
        post = QR.posts.splice(oldIndex, 1)[0];
        return QR.posts.splice(newIndex, 0, post);
      };

      return _Class;

    })(),
    captcha: {
      init: function() {
        if (d.cookie.indexOf('pass_enabled=1') >= 0) {
          return;
        }
        if (!(this.isEnabled = !!$.id('captchaFormPart'))) {
          return;
        }
        return $.asap((function() {
          return $.id('recaptcha_challenge_field_holder');
        }), this.ready.bind(this));
      },
      ready: function() {
        var MutationObserver, imgContainer, input, observer;
        imgContainer = $.el('div', {
          className: 'captcha-img',
          title: 'Reload',
          innerHTML: '<img>'
        });
        input = $.el('input', {
          className: 'captcha-input field',
          title: 'Verification',
          autocomplete: 'off',
          spellcheck: false
        });
        this.nodes = {
          challenge: $.id('recaptcha_challenge_field_holder'),
          img: imgContainer.firstChild,
          input: input
        };
        if (MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.OMutationObserver) {
          observer = new MutationObserver(this.load.bind(this));
          observer.observe(this.nodes.challenge, {
            childList: true
          });
        } else {
          $.on(this.nodes.challenge, 'DOMNodeInserted', this.load.bind(this));
        }
        $.on(imgContainer, 'click', this.reload.bind(this));
        $.on(input, 'keydown', this.keydown.bind(this));
        $.sync('captchas', this.sync);
        this.sync($.get('captchas', []));
        this.reload();
        $.addClass(QR.nodes.el, 'has-captcha');
        return $.after(QR.nodes.com.parentNode, [imgContainer, input]);
      },
      sync: function(captchas) {
        this.captchas = captchas;
        return QR.captcha.count();
      },
      getOne: function() {
        var captcha, challenge, response;
        this.clear();
        if (captcha = this.captchas.shift()) {
          challenge = captcha.challenge, response = captcha.response;
          this.count();
          $.set('captchas', this.captchas);
        } else {
          challenge = this.nodes.img.alt;
          if (response = this.nodes.input.value) {
            this.reload();
          }
        }
        if (response) {
          response = response.trim();
          if (!/\s/.test(response)) {
            response = "" + response + " " + response;
          }
        }
        return {
          challenge: challenge,
          response: response
        };
      },
      save: function() {
        var response;
        if (!(response = this.nodes.input.value.trim())) {
          return;
        }
        this.captchas.push({
          challenge: this.nodes.img.alt,
          response: response,
          timeout: this.timeout
        });
        this.count();
        this.reload();
        return $.set('captchas', this.captchas);
      },
      clear: function() {
        var captcha, i, now, _i, _len, _ref;
        now = Date.now();
        _ref = this.captchas;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          captcha = _ref[i];
          if (captcha.timeout > now) {
            break;
          }
        }
        if (!i) {
          return;
        }
        this.captchas = this.captchas.slice(i);
        this.count();
        return $.set('captchas', this.captchas);
      },
      load: function() {
        var challenge;
        if (!this.nodes.challenge.firstChild) {
          return;
        }
        this.timeout = Date.now() + $.unsafeWindow.RecaptchaState.timeout * $.SECOND - $.MINUTE;
        challenge = this.nodes.challenge.firstChild.value;
        this.nodes.img.alt = challenge;
        this.nodes.img.src = "//www.google.com/recaptcha/api/image?c=" + challenge;
        this.nodes.input.value = null;
        return this.clear();
      },
      count: function() {
        var count;
        count = this.captchas.length;
        this.nodes.input.placeholder = (function() {
          switch (count) {
            case 0:
              return 'Verification (Shift + Enter to cache)';
            case 1:
              return 'Verification (1 cached captcha)';
            default:
              return "Verification (" + count + " cached captchas)";
          }
        })();
        return this.nodes.input.alt = count;
      },
      reload: function(focus) {
        $.unsafeWindow.Recaptcha.reload('t');
        if (focus) {
          return this.nodes.input.focus();
        }
      },
      keydown: function(e) {
        if (e.keyCode === 8 && !this.nodes.input.value) {
          this.reload();
        } else if (e.keyCode === 13 && e.shiftKey) {
          this.save();
        } else {
          return;
        }
        return e.preventDefault();
      }
    },
    dialog: function() {
      var dialog, mimeTypes, name, node, nodes, thread, _i, _j, _len, _len1, _ref, _ref1;
      dialog = UI.dialog('qr', 'top:0;right:0;', "<div>\n  <input type=checkbox id=autohide title=Auto-hide>\n  <select title='Create a new thread / Reply'>\n    <option value=new>New thread</option>\n  </select>\n  <span class=move></span>\n  <a href=javascript:; class=close title=Close>×</a>\n</div>\n<form>\n  <div class=persona>\n    <input id=dump-button type=button title='Dump list' value=+>\n    <input name=name  data-name=name  title=Name    placeholder=Name    class=field size=1>\n    <input name=email data-name=email title=E-mail  placeholder=E-mail  class=field size=1>\n    <input name=sub   data-name=sub   title=Subject placeholder=Subject class=field size=1>\n  </div>\n  <div id=dump-list-container>\n    <div id=dump-list></div>\n    <a id=add-post href=javascript:; title=\"Add a post\">+</a>\n  </div>\n  <div class=textarea>\n    <textarea data-name=com title=Comment placeholder=Comment class=field></textarea>\n    <span id=char-count></span>\n  </div>\n  <div id=file-n-submit>\n    <input id=qr-file-button type=button value='Choose files'>\n    <span id=qr-filename-container>\n      <span id=qr-no-file>No selected file</span>\n      <span id=qr-filename></span>\n    </span>\n    <a id=qr-filerm href=javascript:; title='Remove file' tabindex=-1>×</a>\n    <input type=checkbox id=qr-file-spoiler title='Spoiler image' tabindex=-1>\n    <input type=submit>\n  </div>\n  <input type=file multiple>\n</form>".replace(/>\s+</g, '><'));
      QR.nodes = nodes = {
        el: dialog,
        move: $('.move', dialog),
        autohide: $('#autohide', dialog),
        thread: $('select', dialog),
        close: $('.close', dialog),
        form: $('form', dialog),
        dumpButton: $('#dump-button', dialog),
        name: $('[data-name=name]', dialog),
        email: $('[data-name=email]', dialog),
        sub: $('[data-name=sub]', dialog),
        com: $('[data-name=com]', dialog),
        dumpList: $('#dump-list', dialog),
        addPost: $('#add-post', dialog),
        charCount: $('#char-count', dialog),
        fileSubmit: $('#file-n-submit', dialog),
        fileButton: $('#qr-file-button', dialog),
        filename: $('#qr-filename', dialog),
        fileRM: $('#qr-filerm', dialog),
        spoiler: $('#qr-file-spoiler', dialog),
        status: $('[type=submit]', dialog),
        fileInput: $('[type=file]', dialog)
      };
      mimeTypes = $('ul.rules > li').textContent.trim().match(/: (.+)/)[1].toLowerCase().replace(/\w+/g, function(type) {
        switch (type) {
          case 'jpg':
            return 'image/jpeg';
          case 'pdf':
            return 'application/pdf';
          case 'swf':
            return 'application/x-shockwave-flash';
          default:
            return "image/" + type;
        }
      });
      QR.mimeTypes = mimeTypes.split(', ');
      QR.mimeTypes.push('');
      nodes.fileInput.max = $('input[name=MAX_FILE_SIZE]').value;
      if ($.engine !== 'presto') {
        nodes.fileInput.accept = "text/*, " + mimeTypes;
      }
      QR.spoiler = !!$('input[name=spoiler]');
      nodes.spoiler.hidden = !QR.spoiler;
      if (g.BOARD.ID === 'f') {
        nodes.flashTag = $.el('select', {
          name: 'filetag',
          innerHTML: "<option value=0>Hentai</option>\n<option value=6>Porn</option>\n<option value=1>Japanese</option>\n<option value=2>Anime</option>\n<option value=3>Game</option>\n<option value=5>Loop</option>\n<option value=4 selected>Other</option>"
        });
        $.add(nodes.form, nodes.flashTag);
      }
      for (thread in g.BOARD.threads) {
        $.add(nodes.thread, $.el('option', {
          value: thread,
          textContent: "Thread No." + thread
        }));
      }
      $.after(nodes.autohide, nodes.thread);
      QR.resetThreadSelector();
      _ref = [nodes.fileButton, nodes.filename.parentNode];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        $.on(node, 'click', QR.openFileInput);
      }
      $.on(nodes.autohide, 'change', QR.toggleHide);
      $.on(nodes.close, 'click', QR.close);
      $.on(nodes.dumpButton, 'click', function() {
        return nodes.el.classList.toggle('dump');
      });
      $.on(nodes.addPost, 'click', function() {
        return new QR.post().select();
      });
      $.on(nodes.form, 'submit', QR.submit);
      $.on(nodes.fileRM, 'click', function() {
        return QR.selected.rmFile();
      });
      $.on(nodes.spoiler, 'change', function() {
        return QR.selected.nodes.spoiler.click();
      });
      $.on(nodes.fileInput, 'change', QR.fileInput);
      new QR.post().select();
      _ref1 = ['name', 'email', 'sub', 'com'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        $.on(nodes[name], 'input', function() {
          return QR.selected.save(this);
        });
      }
      QR.status();
      QR.cooldown.init();
      QR.captcha.init();
      $.add(d.body, dialog);
      return $.event('QRDialogCreation', null, dialog);
    },
    submit: function(e) {
      var callbacks, challenge, err, filetag, m, opts, post, postData, response, textOnly, threadID, _ref;
      if (e != null) {
        e.preventDefault();
      }
      if (QR.req) {
        QR.abort();
        return;
      }
      if (QR.cooldown.seconds) {
        QR.cooldown.auto = !QR.cooldown.auto;
        QR.status();
        return;
      }
      post = QR.posts[0];
      post.forceSave();
      if (g.BOARD.ID === 'f') {
        filetag = QR.nodes.flashTag.value;
      }
      threadID = QR.nodes.thread.value;
      if (threadID === 'new') {
        threadID = null;
        if (['vg', 'q'].contains(g.BOARD.ID) && !post.sub) {
          err = 'New threads require a subject.';
        } else if (!(post.file || (textOnly = !!$('input[name=textonly]', $.id('postForm'))))) {
          err = 'No file selected.';
        }
      } else if (g.BOARD.threads[threadID].isSticky) {
        err = 'You can\'t reply to this thread anymore.';
      } else if (!(post.com || post.file)) {
        err = 'No file selected.';
      }
      if (QR.captcha.isEnabled && !err) {
        _ref = QR.captcha.getOne(), challenge = _ref.challenge, response = _ref.response;
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
      QR.cleanNotifications();
      QR.cooldown.auto = QR.posts.length > 1;
      if (Conf['Auto-Hide QR'] && !QR.cooldown.auto) {
        QR.hide();
      }
      if (!QR.cooldown.auto && $.x('ancestor::div[@id="qr"]', d.activeElement)) {
        d.activeElement.blur();
      }
      post.lock();
      postData = {
        resto: threadID,
        name: post.name,
        email: post.email,
        sub: post.sub,
        com: post.com,
        upfile: post.file,
        filetag: filetag,
        spoiler: post.spoiler,
        textonly: textOnly,
        mode: 'regist',
        pwd: (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $.id('postPassword').value,
        recaptcha_challenge_field: challenge,
        recaptcha_response_field: response
      };
      callbacks = {
        onload: QR.response,
        onerror: function() {
          delete QR.req;
          post.unlock();
          QR.cooldown.auto = false;
          QR.status();
          return QR.error('Network error.');
        }
      };
      opts = {
        form: $.formData(postData),
        upCallbacks: {
          onload: function() {
            QR.req.isUploadFinished = true;
            QR.req.uploadEndTime = Date.now();
            QR.req.progress = '...';
            return QR.status();
          },
          onprogress: function(e) {
            QR.req.progress = "" + (Math.round(e.loaded / e.total * 100)) + "%";
            return QR.status();
          }
        }
      };
      QR.req = $.ajax($.id('postForm').parentNode.action, callbacks, opts);
      QR.req.uploadStartTime = Date.now();
      QR.req.progress = '...';
      return QR.status();
    },
    response: function() {
      var URL, ban, board, err, h1, persona, post, postID, req, threadID, tmpDoc, _, _base, _ref, _ref1;
      req = QR.req;
      delete QR.req;
      post = QR.posts[0];
      post.unlock();
      tmpDoc = d.implementation.createHTMLDocument('');
      tmpDoc.documentElement.innerHTML = req.response;
      if (ban = $('.banType', tmpDoc)) {
        board = $('.board', tmpDoc).innerHTML;
        err = $.el('span', {
          innerHTML: ban.textContent.toLowerCase() === 'banned' ? ("You are banned on " + board + "! ;_;<br>") + "Click <a href=//www.4chan.org/banned target=_blank>here</a> to see the reason." : ("You were issued a warning on " + board + " as " + ($('.nameBlock', tmpDoc).innerHTML) + ".<br>") + ("Reason: " + ($('.reason', tmpDoc).innerHTML))
        });
      } else if (err = tmpDoc.getElementById('errmsg')) {
        if ((_ref = $('a', err)) != null) {
          _ref.target = '_blank';
        }
      } else if (tmpDoc.title !== 'Post successful!') {
        err = 'Connection error with sys.4chan.org.';
      } else if (req.status !== 200) {
        err = "Error " + req.statusText + " (" + req.status + ")";
      }
      if (err) {
        if (/captcha|verification/i.test(err.textContent) || err === 'Connection error with sys.4chan.org.') {
          if (/mistyped/i.test(err.textContent)) {
            err = 'You seem to have mistyped the CAPTCHA.';
          }
          QR.cooldown.auto = QR.captcha.isEnabled ? !!QR.captcha.captchas.length : err === 'Connection error with sys.4chan.org.' ? true : false;
          QR.cooldown.set({
            delay: 2
          });
        } else {
          QR.cooldown.auto = false;
        }
        QR.status();
        QR.error(err);
        return;
      }
      h1 = $('h1', tmpDoc);
      QR.cleanNotifications();
      QR.notifications.push(new Notification('success', h1.textContent, 5));
      persona = $.get('QR.persona', {});
      persona = {
        name: post.name,
        email: /^sage$/.test(post.email) ? persona.email : post.email,
        sub: Conf['Remember Subject'] ? post.sub : null
      };
      $.set('QR.persona', persona);
      _ref1 = h1.nextSibling.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref1[0], threadID = _ref1[1], postID = _ref1[2];
      postID = +postID;
      threadID = +threadID || postID;
      ((_base = QR.yourPosts.threads)[threadID] || (_base[threadID] = [])).push(postID);
      $.set("yourPosts." + g.BOARD, QR.yourPosts);
      $.event('QRPostSuccessful', {
        board: g.BOARD,
        threadID: threadID,
        postID: postID
      }, QR.nodes.el);
      QR.cooldown.auto = QR.posts.length > 1;
      post.rm();
      QR.cooldown.set({
        req: req,
        post: post,
        isReply: !!threadID
      });
      if (threadID === postID) {
        URL = "/" + g.BOARD + "/res/" + threadID;
      } else if (g.VIEW === 'index' && !QR.cooldown.auto) {
        URL = "/" + g.BOARD + "/res/" + threadID + "#p" + postID;
      }
      if (URL) {
        if (Conf['Open Post in New Tab']) {
          $.open("/" + g.BOARD + "/res/" + threadID);
        } else {
          window.location = "/" + g.BOARD + "/res/" + threadID;
        }
      }
      if (!(Conf['Persistent QR'] || QR.cooldown.auto)) {
        QR.close();
      }
      return QR.status();
    },
    abort: function() {
      if (QR.req && !QR.req.isUploadFinished) {
        QR.req.abort();
        delete QR.req;
        QR.posts[0].unlock();
        QR.notifications.push(new Notification('info', 'QR upload aborted.', 5));
      }
      return QR.status();
    }
  };

  Report = {
    init: function() {
      if (!/report/.test(location.search)) {
        return;
      }
      return $.ready(this.ready);
    },
    ready: function() {
      var field, form;
      form = $('form');
      field = $.id('recaptcha_response_field');
      $.on(field, 'keydown', function(e) {
        if (e.keyCode === 8 && !field.value) {
          return $.unsafeWindow.Recaptcha.reload('t');
        }
      });
      return $.on(form, 'submit', function(e) {
        var response;
        e.preventDefault();
        response = field.value.trim();
        if (!/\s/.test(response)) {
          field.value = "" + response + " " + response;
        }
        return form.submit();
      });
    }
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

    Thread.prototype.kill = function() {
      this.isDead = true;
      return this.timeOfDeath = Date.now();
    };

    return Thread;

  })();

  Post = (function() {

    Post.prototype.callbacks = [];

    Post.prototype.toString = function() {
      return this.ID;
    };

    function Post(root, thread, board, that) {
      var alt, anchor, capcode, date, email, file, fileInfo, flag, info, name, post, size, subject, thumb, tripcode, uniqueID, unit;
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
      this.parseComment();
      this.parseQuotes();
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
      if (!(this.isReply = $.hasClass(post, 'reply'))) {
        this.thread.OP = this;
        this.thread.isSticky = !!$('.stickyIcon', this.nodes.info);
        this.thread.isClosed = !!$('.closedIcon', this.nodes.info);
      }
      this.clones = [];
      g.posts["" + board + "." + this] = thread.posts[this] = board.posts[this] = this;
      if (that.isArchived) {
        this.kill();
      }
    }

    Post.prototype.parseComment = function() {
      var bq, data, i, node, nodes, text, _i, _j, _len, _ref, _ref1;
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
      return this.info.comment = text.join('').trim().replace(/\s+$/gm, '');
    };

    Post.prototype.parseQuotes = function() {
      var hash, pathname, quotelink, quotes, _i, _len, _ref;
      quotes = {};
      _ref = $$('.quotelink', this.nodes.comment);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
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
      if (this.isClone) {
        return;
      }
      return this.quotes = Object.keys(quotes);
    };

    Post.prototype.kill = function(file, now) {
      var clone, quotelink, strong, _i, _j, _len, _len1, _ref, _ref1;
      now || (now = new Date());
      if (file) {
        this.file.isDead = true;
        this.file.timeOfDeath = now;
        $.addClass(this.nodes.root, 'deleted-file');
      } else {
        this.isDead = true;
        this.timeOfDeath = now;
        $.addClass(this.nodes.root, 'deleted-post');
      }
      if (!(strong = $('strong.warning', this.nodes.info))) {
        strong = $.el('strong', {
          className: 'warning',
          textContent: '[Deleted]'
        });
        $.after($('input', this.nodes.info), strong);
      }
      strong.textContent = file ? '[File deleted]' : '[Deleted]';
      if (this.isClone) {
        return;
      }
      _ref = this.clones;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clone = _ref[_i];
        clone.kill(file, now);
      }
      if (file) {
        return;
      }
      _ref1 = Get.allQuotelinksLinkingTo(this);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quotelink = _ref1[_j];
        if ($.hasClass(quotelink, 'deadlink')) {
          continue;
        }
        $.add(quotelink, $.tn('\u00A0(Dead)'));
        $.addClass(quotelink, 'deadlink');
      }
    };

    Post.prototype.resurrect = function() {
      var clone, quotelink, strong, _i, _j, _len, _len1, _ref, _ref1;
      delete this.isDead;
      delete this.timeOfDeath;
      $.rmClass(this.nodes.root, 'deleted-post');
      strong = $('strong.warning', this.nodes.info);
      if (this.file && this.file.isDead) {
        strong.textContent = '[File deleted]';
      } else {
        $.rm(strong);
      }
      if (this.isClone) {
        return;
      }
      _ref = this.clones;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clone = _ref[_i];
        clone.resurrect();
      }
      _ref1 = Get.allQuotelinksLinkingTo(this);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quotelink = _ref1[_j];
        if ($.hasClass(quotelink, 'deadlink')) {
          quotelink.textContent = quotelink.textContent.replace('\u00A0(Dead)', '');
          $.rmClass(quotelink, 'deadlink');
        }
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
      var file, index, info, inline, inlined, key, nodes, post, root, val, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
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
      $.rmClass(post, 'highlight');
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
      this.parseQuotes();
      if (origin.file) {
        this.file = {};
        _ref3 = origin.file;
        for (key in _ref3) {
          val = _ref3[key];
          this.file[key] = val;
        }
        file = $('.file', post);
        this.file.info = file.firstElementChild;
        this.file.text = this.file.info.firstElementChild;
        this.file.thumb = $('img[data-md5]', file);
        this.file.fullImage = $('.full-image', file);
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
      $.asap((function() {
        return d.documentElement;
      }), function() {
        return doc = d.documentElement;
      });
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
          Report.init();
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
        try {
          return module.init();
        } catch (err) {
          return Main.handleErrors({
            message: "\"" + name + "\" initialization crashed.",
            error: err
          });
        }
      };
      initFeature('Polyfill', Polyfill);
      initFeature('Header', Header);
      initFeature('Settings', Settings);
      initFeature('Fourchan thingies', Fourchan);
      initFeature('Custom CSS', CustomCSS);
      initFeature('Resurrect Quotes', Quotify);
      initFeature('Filter', Filter);
      initFeature('Thread Hiding', ThreadHiding);
      initFeature('Reply Hiding', ReplyHiding);
      initFeature('Recursive', Recursive);
      initFeature('Strike-through Quotes', QuoteStrikeThrough);
      initFeature('Quick Reply', QR);
      initFeature('Menu', Menu);
      initFeature('Report Link', ReportLink);
      initFeature('Thread Hiding (Menu)', ThreadHiding.menu);
      initFeature('Reply Hiding (Menu)', ReplyHiding.menu);
      initFeature('Delete Link', DeleteLink);
      initFeature('Filter (Menu)', Filter.menu);
      initFeature('Download Link', DownloadLink);
      initFeature('Archive Link', ArchiveLink);
      initFeature('Quote Inlining', QuoteInline);
      initFeature('Quote Previewing', QuotePreview);
      initFeature('Quote Backlinks', QuoteBacklink);
      initFeature('Mark Quotes of You', QuoteYou);
      initFeature('Mark OP Quotes', QuoteOP);
      initFeature('Mark Cross-thread Quotes', QuoteCT);
      initFeature('Anonymize', Anonymize);
      initFeature('Time Formatting', Time);
      initFeature('Relative Post Dates', RelativeDates);
      initFeature('File Info Formatting', FileInfo);
      initFeature('Sauce', Sauce);
      initFeature('Image Expansion', ImageExpand);
      initFeature('Image Expansion (Menu)', ImageExpand.menu);
      initFeature('Reveal Spoilers', RevealSpoilers);
      initFeature('Auto-GIF', AutoGIF);
      initFeature('Image Hover', ImageHover);
      initFeature('Comment Expansion', ExpandComment);
      initFeature('Thread Expansion', ExpandThread);
      initFeature('Thread Excerpt', ThreadExcerpt);
      initFeature('Favicon', Favicon);
      initFeature('Unread', Unread);
      initFeature('Thread Stats', ThreadStats);
      initFeature('Thread Updater', ThreadUpdater);
      initFeature('Thread Watcher', ThreadWatcher);
      initFeature('Index Navigation', Nav);
      initFeature('Keybinds', Keybinds);
      $.on(d, 'AddCallback', Main.addCallback);
      $.on(d, '4chanMainInit', Main.initStyle);
      return $.ready(Main.initReady);
    },
    initStyle: function() {
      var MutationObserver, mainStyleSheet, observer, setStyle, style, styleSheets, _ref;
      if (!Main.isThisPageLegit()) {
        return;
      }
      if ((_ref = $('link[href*=mobile]', d.head)) != null) {
        _ref.disabled = true;
      }
      $.addClass(doc, $.engine);
      $.addClass(doc, 'fourchan-x');
      $.addStyle(Main.css);
      if (g.VIEW === 'catalog') {
        $.addClass(doc, $.id('base-css').href.match(/catalog_(\w+)/)[1].replace('_new', '').replace(/_+/g, '-'));
        return;
      }
      style = 'yotsuba-b';
      mainStyleSheet = $('link[title=switch]', d.head);
      styleSheets = $$('link[rel="alternate stylesheet"]', d.head);
      setStyle = function() {
        var styleSheet, _i, _len;
        $.rmClass(doc, style);
        for (_i = 0, _len = styleSheets.length; _i < _len; _i++) {
          styleSheet = styleSheets[_i];
          if (styleSheet.href === mainStyleSheet.href) {
            style = styleSheet.title.toLowerCase().replace('new', '').trim().replace(/\s+/g, '-');
            break;
          }
        }
        return $.addClass(doc, style);
      };
      setStyle();
      if (!mainStyleSheet) {
        return;
      }
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
      var board, boardChild, errors, href, posts, thread, threadChild, threads, _i, _j, _len, _len1, _ref, _ref1;
      if (d.title === '4chan - 404 Not Found') {
        if (Conf['404 Redirect'] && g.VIEW === 'thread') {
          href = Redirect.to({
            board: g.BOARD,
            threadID: g.THREAD,
            postID: location.hash
          });
          location.href = href || ("/" + g.BOARD + "/");
        }
        return;
      }
      if (!$.hasClass(doc, 'fourchan-x')) {
        Main.initStyle();
      }
      if (board = $('.board')) {
        threads = [];
        posts = [];
        _ref = board.children;
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
        Main.callbackNodes(Post, posts);
      }
      return $.event('4chanXInitFinished');
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
    addCallback: function(e) {
      var Klass, obj;
      obj = e.detail;
      Klass = obj.type === 'Post' ? Post : Thread;
      obj.callback.isAddon = true;
      return Klass.prototype.callbacks.push(obj.callback);
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
      c.log(message, error.stack);
      message = $.el('div', {
        textContent: message
      });
      error = $.el('div', {
        textContent: error
      });
      return [message, error];
    },
    isThisPageLegit: function() {
      if (!('thisPageIsLegit' in Main)) {
        Main.thisPageIsLegit = !$('link[href*="favicon-status.ico"]', d.head) && d.title !== '4chan - Temporarily Offline';
      }
      return Main.thisPageIsLegit;
    },
    css: "/* General */\n.dialog {\nbox-shadow: 0 1px 2px rgba(0, 0, 0, .15);\nborder: 1px solid;\ndisplay: block;\npadding: 0;\n}\n.field {\nborder: 1px solid #CCC;\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\ncolor: #333;\nfont: 13px sans-serif;\nmargin: 0;\npadding: 2px 4px 3px;\noutline: none;\n-webkit-transition: color .25s, border-color .25s, -webkit-flex .25s;\ntransition: color .25s, border-color .25s, flex .25s;\n}\n.field::-moz-placeholder,\n.field:hover::-moz-placeholder {\ncolor: #AAA !important;\n}\n.field:hover {\nborder-color: #999;\n}\n.field:hover, .field:focus {\ncolor: #000;\n}\n.field[disabled] {\nbackground-color: #F2F2F2;\ncolor: #888;\n}\n.move {\ncursor: move;\n}\nlabel, .favicon {\ncursor: pointer;\n}\na[href=\"javascript:;\"] {\ntext-decoration: none;\n}\n.warning {\ncolor: red;\n}\n\n/* 4chan style fixes */\n.opContainer, .op {\ndisplay: block !important;\n}\n.post {\noverflow: visible !important;\n}\n[hidden] {\ndisplay: none !important;\n}\n\n/* fixed, z-index */\n#overlay,\n#qp, #ihover,\n#updater, #thread-stats,\n#navlinks, #header,\n#qr, #watcher {\nposition: fixed;\n}\n#overlay {\nz-index: 999;\n}\n#notifications {\nz-index: 70;\n}\n#qp, #ihover {\nz-index: 60;\n}\n#menu {\nz-index: 50;\n}\n#navlinks, #updater, #thread-stats {\nz-index: 40;\n}\n#qr {\nz-index: 30;\n}\n#watcher {\nz-index: 20;\n}\n#header {\nz-index: 10;\n}\n\n/* Header */\n.fourchan-x body {\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\nmargin-top: 2em;\n}\n.fourchan-x #boardNavDesktop,\n.fourchan-x #navtopright,\n.fourchan-x #boardNavDesktopFoot {\ndisplay: none !important;\n}\n#header {\ntop: 0;\nright: 0;\nleft: 0;\n}\n#header-bar {\nborder-width: 0 0 1px;\ndisplay: -webkit-flex;\ndisplay: flex;\npadding: 3px 4px 4px;\nposition: relative;\n-webkit-transition: all .1s ease-in-out;\ntransition: all .1s ease-in-out;\n}\n#board-list {\n-webkit-flex: 1;\nflex: 1;\ntext-align: center;\n}\n#header-bar.autohide:not(:hover) {\nbox-shadow: none;\nmargin-bottom: -1em;\n-webkit-transform: translateY(-100%);\ntransform: translateY(-100%);\n-webkit-transition: all .8s .6s cubic-bezier(.55, .055, .675, .19);\ntransition: all .8s .6s cubic-bezier(.55, .055, .675, .19);\n}\n#toggle-header-bar {\ncursor: n-resize;\nleft: 0;\nright: 0;\nbottom: -8px;\nheight: 10px;\nposition: absolute;\n}\n#header-bar.autohide:not(:hover) #toggle-header-bar, #toggle-header-bar:hover {\nbottom: -16px;\nheight: 18px;\n}\n#header-bar.autohide #toggle-header-bar {\ncursor: s-resize;\n}\n#header-bar a:not(.entry) {\ntext-decoration: none;\npadding: 1px;\n}\n#shortcuts:empty {\ndisplay: none;\n}\n.shortcut:not(:last-child)::after {\ncontent: \" / \";\n}\n.brackets-wrap::before {\ncontent: \"\\00a0[\";\n}\n.brackets-wrap::after {\ncontent: \"]\\00a0\";\n}\n.expand-all-shortcut {\nopacity: .35;\n}\n\n/* Notifications */\n#notifications {\nheight: 0;\ntext-align: center;\n}\n.notification {\ncolor: #FFF;\nfont-weight: 700;\ntext-shadow: 0 1px 2px rgba(0, 0, 0, .5);\nbox-shadow: 0 1px 2px rgba(0, 0, 0, .15);\nborder-radius: 2px;\nmargin: 1px auto;\nwidth: 500px;\nmax-width: 100%;\nposition: relative;\n-webkit-transition: all .25s ease-in-out;\ntransition: all .25s ease-in-out;\n}\n.notification.error {\nbackground-color: hsla(0, 100%, 38%, .9);\n}\n.notification.warning {\nbackground-color: hsla(36, 100%, 38%, .9);\n}\n.notification.info {\nbackground-color: hsla(200, 100%, 38%, .9);\n}\n.notification.success {\nbackground-color: hsla(104, 100%, 38%, .9);\n}\n.notification a {\ncolor: white;\n}\n.notification > .close {\npadding: 6px;\ntop: 0;\nright: 0;\nposition: absolute;\n}\n.message {\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\npadding: 6px 20px;\nmax-height: 200px;\nwidth: 100%;\noverflow: auto;\n}\n\n/* Settings */\n#overlay {\nbackground-color: rgba(0, 0, 0, .5);\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-align-items: center;\nalign-items: center;\n-webkit-justify-content: center;\njustify-content: center;\nposition: fixed;\ntop: 0;\nleft: 0;\nheight: 100%;\nwidth: 100%;\n}\n#fourchanx-settings {\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\nbox-shadow: 0 0 15px rgba(0, 0, 0, .15);\nheight: 600px;\nmin-height: 0;\nmax-height: 100%;\nwidth: 900px;\nmin-width: 0;\nmax-width: 100%;\npadding: 3px;\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-flex-direction: column;\nflex-direction: column;\n}\n#fourchanx-settings > nav {\ndisplay: -webkit-flex;\ndisplay: flex;\npadding: 2px 2px 0;\n}\n#fourchanx-settings > nav a {\ntext-decoration: underline;\n}\n#fourchanx-settings > nav a.close {\ntext-decoration: none;\npadding: 2px;\n}\n.sections-list {\n-webkit-flex: 1;\nflex: 1;\n}\n.section-container {\n-webkit-flex: 1;\nflex: 1;\nposition: relative;\n}\n.section-container > section {\nposition: absolute;\ntop: 0;\nright: 0;\nbottom: 0;\nleft: 0;\noverflow: auto;\n}\n.section-sauce ul,\n.section-rice ul {\nlist-style: none;\nmargin: 0;\npadding: 8px;\n}\n.section-sauce li,\n.section-rice li {\npadding-left: 4px;\n}\n.section-main label {\ntext-decoration: underline;\n}\n.section-filter ul {\npadding: 0;\n}\n.section-filter li {\nmargin: 10px 40px;\n}\n.section-filter textarea {\nheight: 500px;\n}\n.section-sauce textarea {\nheight: 350px;\n}\n.section-rice .field[name=\"boardnav\"] {\nwidth: 100%;\n}\n.section-rice textarea {\nheight: 150px;\n}\n#fourchanx-settings fieldset {\nborder: 1px solid;\nborder-radius: 3px;\n}\n#fourchanx-settings legend {\nfont-weight: 700;\n}\n#fourchanx-settings textarea {\nfont-family: monospace;\nmin-width: 100%;\nmax-width: 100%;\n}\n#fourchanx-settings code {\ncolor: #000;\nbackground-color: #FFF;\npadding: 0 2px;\n}\n.unscroll {\noverflow: hidden;\n}\n\n/* Unread */\n#unread-line {\nmargin: 0;\n}\n\n/* Thread Updater */\n#updater:not(:hover) {\nbackground: none;\nborder: none;\nbox-shadow: none;\n}\n#updater > .move {\npadding: 0 3px;\n}\n#updater > div:last-child {\ntext-align: center;\n}\n#updater input[type=number] {\nwidth: 4em;\n}\n#updater:not(:hover) > div:not(.move) {\ndisplay: none;\n}\n.new {\ncolor: limegreen;\n}\n\n/* Thread Watcher */\n#watcher {\npadding-bottom: 3px;\nposition: absolute;\noverflow: hidden;\nwhite-space: nowrap;\n}\n#watcher:not(:hover) {\nmax-height: 220px;\n}\n#watcher > .move {\npadding-top: 3px;\n}\n#watcher > div {\nmax-width: 200px;\noverflow: hidden;\npadding-left: 3px;\npadding-right: 3px;\ntext-overflow: ellipsis;\n}\n#watcher a {\ntext-decoration: none;\n}\n\n/* Thread Stats */\n#thread-stats {\nbackground: none;\nborder: none;\nbox-shadow: none;\n}\n\n/* Quote */\n.deadlink {\ntext-decoration: none !important;\n}\n.backlink.deadlink:not(.forwardlink), .quotelink.deadlink:not(.forwardlink) {\ntext-decoration: underline !important;\n}\n.inlined {\nopacity: .5;\n}\n#qp input, .forwarded {\ndisplay: none;\n}\n.quotelink.forwardlink,\n.backlink.forwardlink {\ntext-decoration: none;\nborder-bottom: 1px dashed;\n}\n.filtered {\ntext-decoration: underline line-through;\n}\n.inline {\nborder: 1px solid;\ndisplay: table;\nmargin: 2px 0;\n}\n.inline .post {\nborder: 0 !important;\nbackground-color: transparent !important;\ndisplay: table !important;\nmargin: 0 !important;\npadding: 1px 2px !important;\n}\n#qp > .opContainer::after {\ncontent: '';\nclear: both;\ndisplay: table;\n}\n#qp .post {\nborder: none;\nmargin: 0;\npadding: 2px 2px 5px;\n}\n#qp img {\nmax-height: 300px;\nmax-width: 500px;\n}\n.qphl {\noutline: 2px solid rgba(216, 94, 49, .7);\n}\n\n/* File */\n.fileText:hover .fntrunc,\n.fileText:not(:hover) .fnfull,\n.expanded-image > .post > .file > .fileThumb > img[data-md5],\n:not(.expanded-image) > .post > .file > .fileThumb > .full-image {\ndisplay: none;\n}\n.expanding {\nopacity: .5;\n}\n.expanded-image > .op > .file::after {\ncontent: '';\nclear: both;\ndisplay: table;\n}\n:root.fit-width .full-image {\nmax-width: 100%;\n}\n:root.gecko.fit-width .full-image,\n:root.presto.fit-width .full-image {\nwidth: 100%;\n}\n#ihover {\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\nmax-height: 100%;\nmax-width: 75%;\npadding-bottom: 16px;\n}\n\n/* Index/Reply Navigation */\n#navlinks {\nfont-size: 16px;\ntop: 25px;\nright: 10px;\n}\n\n/* Filter */\n.opContainer.filter-highlight {\nbox-shadow: inset 5px 0 rgba(255, 0, 0, .5);\n}\n.filter-highlight > .reply {\nbox-shadow: -5px 0 rgba(255, 0, 0, .5);\n}\n\n/* Thread & Reply Hiding */\n.hide-thread-button,\n.hide-reply-button {\nfloat: left;\nmargin-right: 2px;\n}\n.stub ~ .sideArrows,\n.stub ~ .hide-reply-button,\n.stub ~ .post {\ndisplay: none !important;\n}\n.stub input {\ndisplay: inline-block;\n}\n\n/* QR */\n.hide-original-post-form #postForm,\n.hide-original-post-form .postingMode,\n#qr.autohide:not(:hover) > form {\ndisplay: none;\n}\n#qr select, #dump-button, .remove, .captcha-img {\ncursor: pointer;\n}\n#qr > div {\nmin-width: 300px;\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-align-items: center;\nalign-items: center;\n}\n#qr .move {\n-webkit-align-self: stretch;\nalign-self: stretch;\n-webkit-flex: 1;\nflex: 1;\n}\n#qr select {\nmargin: 0;\n-webkit-appearance: none;\n-moz-appearance: none;\nappearance: none;\nborder: none;\nbackground: none;\n}\n.presto #qr select {\nheight: 1em;\n}\n#qr .close {\npadding: 0 3px;\n}\n#qr > form {\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-flex-direction: column;\nflex-direction: column;\n}\n.persona {\ndisplay: -webkit-flex;\ndisplay: flex;\n}\n.persona .field {\n-webkit-flex: 1;\nflex: 1;\n}\n.persona .field:hover,\n.persona .field:focus {\n-webkit-flex: 4;\nflex: 4;\n}\n#dump-button {\nbackground: -webkit-linear-gradient(#EEE, #CCC);\nbackground: linear-gradient(#EEE, #CCC);\nborder: 1px solid #CCC;\nmargin: 0;\npadding: 2px 4px 3px;\noutline: none;\nwidth: 30px;\n}\n#dump-button:hover, #dump-button:focus {\nbackground: -webkit-linear-gradient(#FFF, #DDD);\nbackground: linear-gradient(#FFF, #DDD);\n}\n#dump-button:active, .dump #dump-button:not(:hover):not(:focus) {\nbackground: -webkit-linear-gradient(#CCC, #DDD);\nbackground: linear-gradient(#CCC, #DDD);\n}\n.gecko #dump-button {\npadding: 0;\n}\n#qr:not(.dump) #dump-list-container {\ndisplay: none;\n}\n#dump-list-container {\nheight: 100px;\nposition: relative;\n-webkit-user-select: none;\n-moz-user-select: none;\n-o-user-select: none;\nuser-select: none;\n}\n#dump-list {\ncounter-reset: qrpreviews;\ntop: 0; right: 0; bottom: 0; left: 0;\noverflow: hidden;\nposition: absolute;\nwhite-space: nowrap;\n}\n#dump-list:hover {\nbottom: -12px;\noverflow-x: auto;\nz-index: 1;\n}\n#dump-list::-webkit-scrollbar {\nheight: 12px;\n}\n#dump-list::-webkit-scrollbar-thumb {\nborder: 1px solid;\n}\n.qr-preview {\nbackground-position: 50% 20%;\nbackground-size: cover;\nborder: 1px solid #808080;\ncolor: #FFF !important;\nfont-size: 12px;\n-moz-box-sizing: border-box;\nbox-sizing: border-box;\ncursor: move;\ndisplay: inline-block;\nheight: 92px; width: 92px;\nmargin: 4px; padding: 2px;\nopacity: .6;\noutline: none;\noverflow: hidden;\nposition: relative;\ntext-shadow: 0 1px 1px #000;\n-webkit-transition: opacity .25s ease-in-out;\ntransition: opacity .25s ease-in-out;\nvertical-align: top;\nwhite-space: pre;\n}\n.qr-preview:hover, .qr-preview:focus {\nopacity: .9;\ncolor: #FFF !important;\n}\n.qr-preview#selected {\nopacity: 1;\n}\n.qr-preview::before {\ncounter-increment: qrpreviews;\ncontent: counter(qrpreviews);\nfont-weight: 700;\ntext-shadow: 0 0 3px #000, 0 0 5px #000;\nposition: absolute;\ntop: 3px; right: 3px;\n}\n.qr-preview.drag {\nborder-color: red;\nborder-style: dashed;\n}\n.qr-preview.over {\nborder-color: #FFF;\nborder-style: dashed;\n}\n.remove {\ncolor: #E00 !important;\nfont-weight: 700;\npadding: 3px;\n}\n.remove:hover::after {\ncontent: ' Remove';\n}\n.qr-preview > label {\nbackground: rgba(0, 0, 0, .5);\nright: 0; bottom: 0; left: 0;\nposition: absolute;\ntext-align: center;\n}\n.qr-preview > label > input {\nmargin: 1px 0;\nvertical-align: bottom;\n}\n#add-post {\ndisplay: inline-block;\nfont-size: 30px;\nheight: 30px;\nwidth: 30px;\nline-height: 1;\ntext-align: center;\nposition: absolute;\nright: 0; bottom: 0;\nz-index: 1;\n}\n#qr textarea {\nmin-height: 160px;\nmin-width: 100%;\ndisplay: block;\n}\n#qr.has-captcha textarea {\nmin-height: 120px;\n}\n.textarea {\nposition: relative;\n}\n#char-count {\ncolor: #000;\nbackground: hsla(0, 0%, 100%, .5);\nfont-size: 8pt;\nposition: absolute;\nbottom: 1px;\nright: 1px;\npointer-events: none;\n}\n#char-count.warning {\ncolor: red;\n}\n.captcha-img {\nbackground: #FFF;\noutline: 1px solid #CCC;\noutline-offset: -1px;\n}\n.captcha-img > img {\ndisplay: block;\nheight: 57px;\nwidth: 300px;\n}\n#file-n-submit > input {\nmargin: 0;\n}\n#file-n-submit.has-file #qr-no-file {\nvisibility: hidden;\n}\n#file-n-submit:not(.has-file) #qr-filename,\n#file-n-submit:not(.has-file) #qr-file-spoiler,\n#file-n-submit:not(.has-file) #qr-filerm {\ndisplay: none;\n}\n#file-n-submit {\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-flex-direction: row;\nflex-direction: row;\n-webkit-align-items: center;\nalign-items: center;\n}\n#qr-no-file, #qr-filename-container {\n-webkit-flex: 1;\nflex: 1;\n}\n#qr-filename-container {\ncursor: default;\nposition: relative;\nmargin-left: 2px;\n}\n#qr-filename {\nposition: absolute;\ntop: 0; right: 0; bottom: 0; left: 0;\ntext-overflow: ellipsis;\noverflow: hidden;\nwhite-space: nowrap;\n}\n#qr-filerm {\npadding: 0 2px;\n}\n#file-n-submit > #qr-file-spoiler {\nmargin: 0 2px;\n}\n#qr input[type='file'] {\nposition: absolute;\nvisibility: hidden;\n}\n\n/* Menu */\n.menu-button {\ndisplay: inline-block;\nposition: relative;\n}\n.menu-button i {\nborder-top:   6px solid;\nborder-right: 4px solid transparent;\nborder-left:  4px solid transparent;\ndisplay: inline-block;\nmargin: 2px;\nvertical-align: middle;\n}\n#menu {\nborder-bottom: 0;\ndisplay: -webkit-flex;\ndisplay: flex;\nmargin: 2px 0;\n-webkit-flex-direction: column;\nflex-direction: column;\nposition: absolute;\noutline: none;\n}\n.entry {\ncursor: pointer;\noutline: none;\npadding: 3px 7px;\nposition: relative;\ntext-decoration: none;\nwhite-space: nowrap;\n}\n.entry.has-submenu {\npadding-right: 20px;\n}\n.has-submenu::after {\ncontent: '';\nborder-left:   6px solid;\nborder-top:    4px solid transparent;\nborder-bottom: 4px solid transparent;\ndisplay: inline-block;\nmargin: 4px;\nposition: absolute;\nright: 3px;\n}\n.has-submenu:not(.focused) > .submenu {\ndisplay: none;\n}\n.submenu {\nborder-bottom: 0;\ndisplay: -webkit-flex;\ndisplay: flex;\n-webkit-flex-direction: column;\nflex-direction: column;\nposition: absolute;\nmargin: -1px 0;\n}\n.entry input {\nmargin: 0;\n}\n\n/* General */\n:root.yotsuba .dialog {\nbackground-color: #F0E0D6;\nborder-color: #D9BFB7;\n}\n:root.yotsuba .field:focus {\nborder-color: #EA8;\n}\n\n/* Header */\n:root.yotsuba #header-bar {\nfont-size: 9pt;\ncolor: #B86;\n}\n:root.yotsuba #header-bar a {\ncolor: #800000;\n}\n\n/* Settings */\n:root.yotsuba #fourchanx-settings fieldset {\nborder-color: #D9BFB7;\n}\n\n/* Quote */\n:root.yotsuba .backlink.deadlink {\ncolor: #00E !important;\n}\n:root.yotsuba .inline {\nborder-color: #D9BFB7;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.yotsuba #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #F0E0D6;\nborder-color: #D9BFB7;\n}\n:root.yotsuba .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.yotsuba #menu {\ncolor: #800000;\n}\n:root.yotsuba .entry {\nborder-bottom: 1px solid #D9BFB7;\nfont-size: 10pt;\n}\n:root.yotsuba .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n\n/* General */\n:root.yotsuba-b .dialog {\nbackground-color: #D6DAF0;\nborder-color: #B7C5D9;\n}\n:root.yotsuba-b .field:focus {\nborder-color: #98E;\n}\n\n/* Header */\n:root.yotsuba-b #header-bar {\nfont-size: 9pt;\ncolor: #89A;\n}\n:root.yotsuba-b #header-bar a {\ncolor: #34345C;\n}\n\n/* Settings */\n:root.yotsuba-b #fourchanx-settings fieldset {\nborder-color: #B7C5D9;\n}\n\n/* Quote */\n:root.yotsuba-b .backlink.deadlink {\ncolor: #34345C !important;\n}\n:root.yotsuba-b .inline {\nborder-color: #B7C5D9;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.yotsuba-b #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #D6DAF0;\nborder-color: #B7C5D9;\n}\n:root.yotsuba-b .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.yotsuba-b #menu {\ncolor: #000;\n}\n:root.yotsuba-b .entry {\nborder-bottom: 1px solid #B7C5D9;\nfont-size: 10pt;\n}\n:root.yotsuba-b .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n\n/* General */\n:root.futaba .dialog {\nbackground-color: #F0E0D6;\nborder-color: #D9BFB7;\n}\n:root.futaba .field:focus {\nborder-color: #EA8;\n}\n\n/* Header */\n:root.futaba #header-bar {\nfont-size: 11pt;\ncolor: #B86;\n}\n:root.futaba #header-bar a {\ncolor: #800000;\n}\n\n/* Settings */\n:root.futaba #fourchanx-settings fieldset {\nborder-color: #D9BFB7;\n}\n\n/* Quote */\n:root.futaba .backlink.deadlink {\ncolor: #00E !important;\n}\n:root.futaba .inline {\nborder-color: #D9BFB7;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.futaba #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #F0E0D6;\nborder-color: #D9BFB7;\n}\n:root.futaba .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.futaba #menu {\ncolor: #800000;\n}\n:root.futaba .entry {\nborder-bottom: 1px solid #D9BFB7;\nfont-size: 12pt;\n}\n:root.futaba .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n\n/* General */\n:root.burichan .dialog {\nbackground-color: #D6DAF0;\nborder-color: #B7C5D9;\n}\n:root.burichan .field:focus {\nborder-color: #98E;\n}\n\n/* Header */\n:root.burichan #header-bar {\nfont-size: 11pt;\ncolor: #89A;\n}\n:root.burichan #header-bar a {\ncolor: #34345C;\n}\n\n/* Settings */\n:root.burichan #fourchanx-settings fieldset {\nborder-color: #B7C5D9;\n}\n\n/* Quote */\n:root.burichan .backlink.deadlink {\ncolor: #34345C !important;\n}\n:root.burichan .inline {\nborder-color: #B7C5D9;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.burichan #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #D6DAF0;\nborder-color: #B7C5D9;\n}\n:root.burichan .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.burichan #menu {\ncolor: #000000;\n}\n:root.burichan .entry {\nborder-bottom: 1px solid #B7C5D9;\nfont-size: 12pt;\n}\n:root.burichan .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n\n/* General */\n:root.tomorrow .dialog {\nbackground-color: #282A2E;\nborder-color: #111;\n}\n:root.tomorrow .field:focus {\nborder-color: #000;\n}\n\n/* Header */\n:root.tomorrow #header-bar {\nfont-size: 9pt;\ncolor: #C5C8C6;\n}\n:root.tomorrow #header-bar a {\ncolor: #81A2BE;\n}\n\n/* Settings */\n:root.tomorrow #fourchanx-settings fieldset {\nborder-color: #111;\n}\n\n/* Quote */\n:root.tomorrow .backlink.deadlink {\ncolor: #81A2BE !important;\n}\n:root.tomorrow .inline {\nborder-color: #111;\nbackground-color: rgba(0, 0, 0, .14);\n}\n\n/* QR */\n.tomorrow #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #282A2E;\nborder-color: #111;\n}\n:root.tomorrow #qr select {\ncolor: #C5C8C6;\n}\n:root.tomorrow #qr option {\ncolor: #000;\n}\n:root.tomorrow .qr-preview {\nbackground-color: rgba(255, 255, 255, .15);\n}\n\n/* Menu */\n:root.tomorrow #menu {\ncolor: #C5C8C6;\n}\n:root.tomorrow .entry {\nborder-bottom: 1px solid #111;\nfont-size: 10pt;\n}\n:root.tomorrow .focused.entry {\nbackground: rgba(0, 0, 0, .33);\n}\n\n/* General */\n:root.photon .dialog {\nbackground-color: #DDD;\nborder-color: #CCC;\n}\n:root.photon .field:focus {\nborder-color: #EA8;\n}\n\n/* Header */\n:root.photon #header-bar {\nfont-size: 9pt;\ncolor: #333;\n}\n:root.photon #header-bar a {\ncolor: #FF6600;\n}\n\n/* Settings */\n:root.photon #fourchanx-settings fieldset {\nborder-color: #CCC;\n}\n\n/* Quote */\n:root.photon .backlink.deadlink {\ncolor: #F60 !important;\n}\n:root.photon .inline {\nborder-color: #CCC;\nbackground-color: rgba(255, 255, 255, .14);\n}\n\n/* QR */\n.photon #dump-list::-webkit-scrollbar-thumb {\nbackground-color: #DDD;\nborder-color: #CCC;\n}\n:root.photon .qr-preview {\nbackground-color: rgba(0, 0, 0, .15);\n}\n\n/* Menu */\n:root.photon #menu {\ncolor: #333;\n}\n:root.photon .entry {\nborder-bottom: 1px solid #CCC;\nfont-size: 10pt;\n}\n:root.photon .focused.entry {\nbackground: rgba(255, 255, 255, .33);\n}\n"
  };

  Main.init();

}).call(this);
