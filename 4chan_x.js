// ==UserScript==
// @name           4chan x
// @namespace      aeosynth
// @description    Adds various features.
// @version        1.27.6
// @copyright      2009-2011 James Campos <james.r.campos@gmail.com>
// @license        MIT; http://en.wikipedia.org/wiki/Mit_license
// @include        http://boards.4chan.org/*
// @include        http://sys.4chan.org/*
// @include        file://*
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
  var $, $$, NAMESPACE, a, as, autoWatch, callback, changeCheckbox, changeValue, config, d, delform, el, expand, expandComment, expandThread, g, imageClick, imageExpand, imageExpandClick, imageHover, imageResize, imageThumb, imageToggle, imageType, imageTypeChange, keyModeNormal, keybinds, log, nav, navtopr, nodeInserted, omitted, onloadComment, onloadThread, option, options, parseResponse, pathname, qr, recaptcha, recaptchaListener, recaptchaReload, redirect, replyHiding, replyNav, report, request, scroll, scrollThread, span, temp, text, threadHiding, tzOffset, ui, updateAuto, updateCallback, updateFavicon, updateInterval, updateNow, updateTime, updateTitle, updateVerbose, updater, updaterMake, watcher, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _m, _ref, _ref2, _ref3, _ref4;
  var __slice = Array.prototype.slice;
  if (typeof console != "undefined" && console !== null) {
    log = console.log;
  }
  config = {
    main: {
      checkbox: {
        '404 Redirect': [true, 'Redirect dead threads'],
        'Anonymize': [false, 'Make everybody anonymous'],
        'Auto Watch': [true, 'Automatically watch threads that you start (Firefox only)'],
        'Comment Expansion': [true, 'Expand too long comments'],
        'Image Auto-Gif': [false, 'Animate gif thumbnails'],
        'Image Expansion': [true, 'Expand images'],
        'Image Hover': [false, 'Show full image on mouseover'],
        'Image Preloading': [false, 'Preload Images'],
        'Keybinds': [true, 'Binds actions to keys'],
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
  if (typeof GM_deleteValue === 'undefined') {
    window.GM_setValue = function(name, value) {
      value = (typeof value)[0] + value;
      return localStorage.setItem(name, value);
    };
    window.GM_getValue = function(name, defaultValue) {
      var type, value;
      if (!(value = localStorage.getItem(name))) {
        return defaultValue;
      }
      type = value[0];
      value = value.slice(1);
      switch (type) {
        case 'b':
          return value === 'true';
        case 'n':
          return Number(value);
        default:
          return value;
      }
    };
    window.GM_openInTab = function(url) {
      return window.open(url, "_blank");
    };
  }
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
      return localStorage["" + id + "Top"] = el.style.top;
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
    cb: {
      checked: function() {
        return $.getValue(this.name, this.checked);
      },
      value: function() {
        return $.setValue(this.name, this.checked);
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
        return value = JSON.parse(value);
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
    config: function(name, conf) {
      if (conf == null) {
        conf = config.main.checkbox;
      }
      return $.getValue(name, conf[name][0]);
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
  autoWatch = function() {
    var autoText;
    autoText = $('textarea', this).value.slice(0, 25);
    return GM_setValue('autoText', "/" + g.BOARD + "/ - " + autoText);
  };
  expandComment = function(e) {
    var a, href, r;
    e.preventDefault();
    a = this;
    href = a.getAttribute('href');
    r = new XMLHttpRequest();
    r.onload = function() {
      return onloadComment(this.responseText, a, href);
    };
    r.open('GET', href, true);
    r.send();
    return g.xhrs.push({
      r: r,
      id: href.match(/\d+/)[0]
    });
  };
  expandThread = function() {
    var id, num, prev, r, span, table, xhr, _i, _len, _ref;
    id = $.x('preceding-sibling::input[1]', this).name;
    span = this;
    if (span.textContent[0] === '-') {
      num = board === 'b' ? 3 : 5;
      table = $.x("following::br[@clear][1]/preceding::table[" + num + "]", span);
      while ((prev = table.previousSibling) && (prev.nodeName === 'TABLE')) {
        $.remove(prev);
      }
      span.textContent = span.textContent.replace('-', '+');
      return;
    }
    span.textContent = span.textContent.replace('+', 'X Loading...');
    _ref = g.xhrs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      xhr = _ref[_i];
      if (xhr.id === id) {
        onloadThread(xhr.r.responseText, span);
        return;
      }
    }
    r = new XMLHttpRequest();
    r.onload = function() {
      return onloadThread(this.responseText, span);
    };
    r.open('GET', "res/" + id, true);
    r.send();
    return g.xhrs.push({
      r: r,
      id: id
    });
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
          _results.push(id in g.hiddenReply ? replyHiding.hide(reply) : void 0);
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
      g.hiddenReply[id] = Date.now();
      return $.setValue("hiddenReply/" + g.BOARD + "/", g.hiddenReply);
    },
    show: function(table) {
      var id;
      $.show(table);
      id = $('td[id]', table).id;
      delete g.hiddenReply[id];
      return $.setValue("hiddenReply/" + g.BOARD + "/", g.hiddenReply);
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
  imageClick = function(e) {
    if (e.shiftKey || e.altKey || e.ctrlKey) {
      return;
    }
    e.preventDefault();
    return imageToggle(this);
  };
  imageToggle = function(image) {
    var ch, cw, imageType, thumb;
    thumb = image.firstChild;
    cw = d.body.clientWidth;
    ch = d.body.clientHeight;
    imageType = $("#imageType").value;
    if (thumb.className === 'hide') {
      return imageThumb(thumb);
    } else {
      return imageExpand(thumb, cw, ch, imageType);
    }
  };
  imageTypeChange = function() {
    var ch, cw, image, imageType, images, _i, _len, _results;
    images = $$('img[md5] + img');
    cw = d.body.clientWidth;
    ch = d.body.clientHeight;
    imageType = this.value;
    _results = [];
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      image = images[_i];
      _results.push(imageResize(cw, ch, imageType, image));
    }
    return _results;
  };
  imageExpandClick = function() {
    var ch, cw, imageType, thumb, thumbs, _i, _j, _len, _len2, _results, _results2;
    thumbs = $$('img[md5]');
    g.expand = this.checked;
    cw = d.body.clientWidth;
    ch = d.body.clientHeight;
    imageType = $("#imageType").value;
    if (this.checked) {
      _results = [];
      for (_i = 0, _len = thumbs.length; _i < _len; _i++) {
        thumb = thumbs[_i];
        _results.push(thumb.className !== 'hide' ? imageExpand(thumb, cw, ch, imageType) : void 0);
      }
      return _results;
    } else {
      _results2 = [];
      for (_j = 0, _len2 = thumbs.length; _j < _len2; _j++) {
        thumb = thumbs[_j];
        _results2.push(thumb.className === 'hide' ? imageThumb(thumb) : void 0);
      }
      return _results2;
    }
  };
  imageExpand = function(thumb, cw, ch, imageType) {
    var image, link;
    thumb.className = 'hide';
    link = thumb.parentNode;
    image = $.el('img', {
      src: link.href
    });
    link.appendChild(image);
    return imageResize(cw, ch, imageType, image);
  };
  imageResize = function(cw, ch, imageType, image) {
    var ih, iw, ratio, _, _ref;
    _ref = $.x("preceding::span[@class][1]/text()[2]", image).textContent.match(/(\d+)x(\d+)/), _ = _ref[0], iw = _ref[1], ih = _ref[2];
    iw = Number(iw);
    ih = Number(ih);
    switch (imageType) {
      case 'full':
        image.removeAttribute('style');
        break;
      case 'fit width':
        if (iw > cw) {
          image.style.width = '100%';
          image.style.margin = '0px';
        }
        break;
      case 'fit screen':
        ratio = Math.min(cw / iw, ch / ih);
        if (ratio < 1) {
          image.style.width = Math.floor(ratio * iw);
          return image.style.margin = '0px';
        }
    }
  };
  imageThumb = function(thumb) {
    thumb.className = '';
    return $.remove(thumb.nextSibling);
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
      switch (keybinds.key) {
        case 'I':
          break;
        case 'J':
          break;
        case 'K':
          break;
        case 'M':
          break;
        case 'i':
          break;
        case 'm':
          break;
        case 'n':
          return nav.next();
        case 'o':
          break;
        case 'p':
          return nav.prev();
        case 'u':
          break;
        case 'w':
          thread = nav.getThread();
          return watcher.toggle(thread);
        case 'x':
          thread = nav.getThread();
          threadHiding.toggle(thread);
      }
    }
  };
  keyModeNormal = function(e) {
    var bot, char, hash, height, href, image, next, prev, qrLink, rect, replies, reply, root, sign, td, thread, top, watchButton, _i, _j, _len, _len2;
    if (e.ctrlKey || e.altKey) {
      return;
    }
    char = g.char;
    hash = location.hash;
    switch (char) {
      case "I":
        if (g.REPLY) {
          if (!(qrLink = $('td.replyhl span[id] a:not(:first-child)'))) {
            qrLink = $("span[id^=nothread] a:not(:first-child)");
          }
        } else {
          thread = getThread()[0];
          if (!(qrLink = $('td.replyhl span[id] a:not(:first-child)', thread))) {
            qrLink = $("span#nothread" + thread.id + " a:not(:first-child)", thread);
          }
        }
        if (e.shiftKey) {
          $.append(d.body, qr.dialog(qrLink));
          return $('#qr textarea').focus();
        } else {
          e = {
            preventDefault: function() {},
            target: qrLink
          };
          return qr.cb.quote(e);
        }
        break;
      case "J":
        if (e.shiftKey) {
          if (!g.REPLY) {
            root = getThread()[0];
          }
          if (td = $('td.replyhl', root)) {
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
          replies = $$('td.reply', root);
          for (_i = 0, _len = replies.length; _i < _len; _i++) {
            reply = replies[_i];
            top = reply.getBoundingClientRect().top;
            if (top > 0) {
              reply.className = 'replyhl';
              break;
            }
          }
        }
        break;
      case "K":
        if (e.shiftKey) {
          if (!g.REPLY) {
            root = getThread()[0];
          }
          if (td = $('td.replyhl', root)) {
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
          replies = $$('td.reply', root);
          replies.reverse();
          height = d.body.clientHeight;
          for (_j = 0, _len2 = replies.length; _j < _len2; _j++) {
            reply = replies[_j];
            bot = reply.getBoundingClientRect().bottom;
            if (bot < height) {
              reply.className = 'replyhl';
              break;
            }
          }
        }
        break;
      case "M":
        if (e.shiftKey) {
          return $("#imageExpand").click();
        } else {
          if (!g.REPLY) {
            root = getThread()[0];
          }
          if (!(image = $('td.replyhl span.filesize ~ a[target]', root))) {
            image = $('span.filesize ~ a[target]', root);
          }
          return imageToggle(image);
        }
        break;
      case "N":
        sign = e.shiftKey ? -1 : 1;
        return scrollThread(sign);
      case "O":
        href = $("" + hash + " ~ span[id] a:last-of-type").href;
        if (e.shiftKey) {
          return location.href = href;
        } else {
          return GM_openInTab(href);
        }
        break;
      case "U":
        return updateNow();
      case "W":
        root = g.REPLY ? null : getThread()[0];
        watchButton = $("span.filesize ~ img", root);
        return watch.call(watchButton);
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
    getThread: function(full) {
      var bottom, i, rect, thread, _len, _ref, _results;
      _ref = nav.threads;
      _results = [];
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
      return _results;
    },
    scroll: function(delta) {
      var i, rect, thread, top, _ref;
      _ref = nav.getThread(true), thread = _ref[0], i = _ref[1], rect = _ref[2];
      top = rect.top;
      if (!((delta === -1 && Math.ceil(top) < 0) || (delta === +1 && top > 1))) {
        i += delta;
      }
      if (i === -1) {
        window.scrollTo(0, 0);
        return;
      }
      if (i === 10) {
        window.location = "" + (g.PAGENUM + 1) + "#p0";
        return;
      }
      top = nav.threads[i].getBoundingClientRect().top;
      return window.scrollBy(0, top);
    }
  };
  scrollThread = function(count) {
    var hash, idx, temp, thread, top, _ref;
    _ref = getThread(), thread = _ref[0], idx = _ref[1];
    top = thread.getBoundingClientRect().top;
    if (idx === 0 && top > 1) {
      idx = -1;
    }
    if (count < 0 && top < -1) {
      count++;
    }
    temp = idx + count;
    if (temp < 0) {
      hash = '';
    } else if (temp > 9) {
      hash = 'p9';
    } else {
      hash = "p" + temp;
    }
    return location.hash = hash;
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
  onloadComment = function(responseText, a, href) {
    var bq, html, id, op, opbq, replies, reply, _, _i, _len, _ref, _ref2;
    _ref = href.match(/(\d+)#(\d+)/), _ = _ref[0], op = _ref[1], id = _ref[2];
    _ref2 = parseResponse(responseText), replies = _ref2[0], opbq = _ref2[1];
    if (id === op) {
      html = opbq.innerHTML;
    } else {
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        if (reply.id === id) {
          html = $('blockquote', reply).innerHTML;
        }
      }
    }
    bq = $.x('ancestor::blockquote', a);
    return bq.innerHTML = html;
  };
  onloadThread = function(responseText, span) {
    var div, next, opbq, replies, reply, _i, _j, _len, _len2, _ref, _results, _results2;
    _ref = parseResponse(responseText), replies = _ref[0], opbq = _ref[1];
    span.textContent = span.textContent.replace('X Loading...', '- ');
    span.previousSibling.innerHTML = opbq.innerHTML;
    while ((next = span.nextSibling) && !next.clear) {
      $.remove(next);
    }
    if (next) {
      _results = [];
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        _results.push($.before(next, $.x('ancestor::table', reply)));
      }
      return _results;
    } else {
      div = span.parentNode;
      _results2 = [];
      for (_j = 0, _len2 = replies.length; _j < _len2; _j++) {
        reply = replies[_j];
        _results2.push($.append(div, $.x('ancestor::table', reply)));
      }
      return _results2;
    }
  };
  changeCheckbox = function() {
    return GM_setValue(this.name, this.checked);
  };
  changeValue = function() {
    return GM_setValue(this.name, this.value);
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
      var checked, conf, dialog, hiddenNum, hiddenThread, html, input, name, title, _i, _len, _ref;
      html = "<div class=move>Options <a name=close>X</a></div>";
      conf = config.main.checkbox;
      for (name in conf) {
        title = conf[name][1];
        checked = $.config(name) ? "checked" : "";
        html += "<div><label title=\"" + title + "\">" + name + "<input name=\"" + name + "\" " + checked + " type=checkbox></label></div>";
      }
      html += "<div><a name=flavors>Flavors</a></div>";
      html += "<div><textarea style=\"display: none;\" name=flavors>" + (GM_getValue('flavors', g.flavors)) + "</textarea></div>";
      hiddenThread = $.getValue("hiddenThread/" + g.BOARD + "/", {});
      hiddenNum = Object.keys(g.hiddenReply).length + Object.keys(hiddenThread).length;
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
        $.deleteValue("hiddenReply/" + g.BOARD + "/");
        $.deleteValue("hiddenThread/" + g.BOARD + "/");
        this.value = "hidden: 0";
        return g.hiddenReplies = {};
      }
    }
  };
  parseResponse = function(responseText) {
    var body, opbq, replies;
    body = $.el('body', {
      innerHTML: responseText
    });
    replies = $$('td.reply', body);
    opbq = $('blockquote', body);
    return [replies, opbq];
  };
  qr = {
    /*
      lol chrome - http://code.google.com/p/chromium/issues/detail?id=20773
      we can't access other frames, so no error checking until I make a workaround
      */
    init: function() {
      var iframe;
      g.callbacks.push(qr.cb.node);
      iframe = $.el('iframe', {
        name: 'iframe'
      });
      $.append(d.body, iframe);
      $.bind(iframe, 'load', qr.cb.load);
      $.bind(window, 'message', qr.cb.messageTop);
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
      load: function(e) {
        var dialog;
        recaptchaReload();
        try {
          return e.target.contentWindow.postMessage('', '*');
        } catch (err) {
          dialog = $('#qr');
          if (g.REPLY && $.config('Persistent QR')) {
            return qr.refresh(dialog);
          } else {
            return $.remove(dialog);
          }
        }
      },
      messageIframe: function(e) {
        var message;
        message = $('table b').firstChild.textContent;
        e.source.postMessage(message, '*');
        return window.location = 'about:blank';
      },
      messageTop: function(e) {
        var data, dialog, error;
        data = e.data;
        dialog = $('#qr');
        if (data === 'Post successful!') {
          if (dialog) {
            if ($.config('Persistent QR')) {
              qr.refresh(dialog);
            } else {
              $.remove(dialog);
            }
          }
          g.seconds = g.sage ? 60 : 30;
          qr.cooldownStart();
        } else {
          error = $.el('span', {
            className: 'error',
            textContent: data
          });
          $.append(dialog, error);
          qr.autohide.unset();
        }
        return recaptchaReload();
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
        var isQR, recaptcha, span;
        isQR = e.target.parentNode.id === 'qr';
        if (isQR) {
          if (span = this.nextSibling) {
            $.remove(span);
          }
        }
        if (g.seconds = GM_getValue('seconds')) {
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
          g.sage = $('#qr input[name=email]').value === 'sage';
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
        var dialog, id, s, selection, selectionID, ta, target, text, _ref;
        e.preventDefault();
        target = e.target;
        if (dialog = $('#qr')) {
          qr.autohide.unset();
        } else {
          dialog = qr.dialog(target);
        }
        id = target.textContent;
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
      }
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
          GM_setValue('seconds', g.seconds);
        }
      }
      if (g.seconds !== 0) {
        return window.setTimeout(qr.cooldown, 1000);
      }
    },
    cooldownStart: function() {
      var submit, submits, _i, _len;
      GM_setValue('seconds', g.seconds);
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
      $.bind($('input[name=recaptcha_response_field]', clone), 'keydown', recaptchaListener);
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
      var board, html, id, recaptcha, thread, _, _base, _ref, _ref2;
      $.bind(window, 'message', qr.cb.messageIframe);
      if (recaptcha = $('#recaptcha_response_field')) {
        $.bind(recaptcha, 'keydown', recaptchaListener);
      }
      if ($.config('Auto Watch')) {
        html = $('b').innerHTML;
        _ref = html.match(/<!-- thread:(\d+),no:(\d+) -->/), _ = _ref[0], thread = _ref[1], id = _ref[2];
        if (thread === '0') {
          _ref2 = $('meta', d).content.match(/4chan.org\/(\w+)\//), _ = _ref2[0], board = _ref2[1];
          (_base = g.watched)[board] || (_base[board] = []);
          g.watched[board].push({
            id: id,
            text: GM_getValue('autoText')
          });
          return GM_setValue('watched', JSON.stringify(g.watched));
        }
      }
    }
  };
  recaptchaListener = function(e) {
    if (e.keyCode === 8 && this.value === '') {
      return recaptchaReload();
    }
  };
  recaptchaReload = function() {
    return window.location = 'javascript:Recaptcha.reload()';
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
      case 'cgl':
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
  replyNav = function() {
    var direction, op;
    if (g.REPLY) {
      return window.location = this.textContent === '▲' ? '#navtop' : '#navbot';
    } else {
      direction = this.textContent === '▲' ? 'preceding' : 'following';
      op = $.x("" + direction + "::span[starts-with(@id, 'nothread')][1]", this).id;
      return window.location = "#" + op;
    }
  };
  report = function() {
    var input;
    input = $.x('preceding-sibling::input[1]', this);
    input.click();
    $('input[value="Report"]').click();
    return input.click();
  };
  threadHiding = {
    init: function() {
      var a, hiddenThreads, node, op, thread, _i, _len, _ref, _results;
      node = $('form[name=delform] > *');
      threadHiding.thread(node);
      hiddenThreads = $.getValue("hiddenThread/" + g.BOARD + "/", {});
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
      hiddenThreads = $.getValue("hiddenThread/" + g.BOARD + "/", {});
      hiddenThreads[id] = Date.now();
      return $.setValue("hiddenThread/" + g.BOARD + "/", hiddenThreads);
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
      hiddenThreads = $.getValue("hiddenThread/" + g.BOARD + "/", {});
      delete hiddenThreads[id];
      return $.setValue("hiddenThread/" + g.BOARD + "/", hiddenThreads);
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
      if (node.nodeName !== 'CENTER') {
        return threadHiding.thread(node);
      }
    }
  };
  request = function(url, callback) {
    var r;
    r = new XMLHttpRequest();
    r.onload = callback;
    r.open('get', url, true);
    r.send();
    return r;
  };
  updateCallback = function() {
    var arr, body, count, id, input, l, replies, reply, root, s, table, timer, _i, _len, _ref;
    count = $('#updater #count');
    timer = $('#updater #timer');
    if (this.status === 404) {
      count.textContent = 404;
      count.className = 'error';
      timer.textContent = '';
      clearInterval(g.interval);
      _ref = $$('input[type=submit]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        input.disabled = true;
        input.value = 404;
      }
      s = '';
      if ($.config('Unread Count')) {
        s += "(" + g.replies.length + ") ";
      }
      s += "/" + g.BOARD + "/ - 404";
      d.title = s;
      g.dead = true;
      updateFavicon();
      return;
    }
    body = $.el('body', {
      innerHTML: this.responseText
    });
    replies = $$('td.reply', body);
    root = $('br[clear]');
    if (reply = $('td.reply, td.replyhl', root.previousElementSibling)) {
      id = Number(reply.id);
    } else {
      id = 0;
    }
    arr = [];
    while ((reply = replies.pop()) && (Number(reply.id > id))) {
      arr.push(reply);
    }
    if (g.verbose) {
      l = arr.length;
      count.textContent = "+" + l;
      count.className = l > 0 ? 'new' : '';
    }
    while (reply = arr.pop()) {
      table = $.x('ancestor::table', reply);
      $.before(root, table);
    }
    return timer.textContent = -1 * GM_getValue('Interval', 10);
  };
  updateFavicon = function() {
    var clone, favicon, href, len;
    len = g.replies.length;
    if (g.dead) {
      if (len > 0) {
        href = g.favDeadHalo;
      } else {
        href = g.favDead;
      }
    } else {
      if (len > 0) {
        href = g.favHalo;
      } else {
        href = g.favDefault;
      }
    }
    favicon = $('link[rel="shortcut icon"]', d);
    clone = favicon.cloneNode(true);
    clone.href = href;
    return $.replace(favicon, clone);
  };
  updateTime = function() {
    var count, span, time;
    span = $('#updater #timer');
    time = Number(span.textContent);
    if (++time === 0) {
      return updateNow();
    } else if (time > 10) {
      time = 0;
      g.req.abort();
      updateNow();
      if (g.verbose) {
        count = $('#updater #count');
        count.textContent = 'retry';
        return count.className = '';
      }
    } else {
      return span.textContent = time;
    }
  };
  updateTitle = function() {
    var len;
    len = g.replies.length;
    d.title = d.title.replace(/\d+/, len);
    return updateFavicon();
  };
  updateAuto = function() {
    var span;
    span = $('#updater #timer');
    if (this.checked) {
      span.textContent = -1 * GM_getValue('Interval', 10);
      return g.interval = window.setInterval(updateTime, 1000);
    } else {
      span.textContent = 'Thread Updater';
      return clearInterval(g.interval);
    }
  };
  updateInterval = function() {
    var num, span;
    if (!(num = Number(this.value))) {
      num = 10;
    }
    this.value = num;
    GM_setValue('Interval', num);
    span = $('#updater #timer');
    if (0 > Number(span.textContent)) {
      return span.textContent = -1 * num;
    }
  };
  updateNow = function() {
    var url;
    url = location.href + '?' + Date.now();
    g.req = request(url, updateCallback);
    return $("#updater #timer").textContent = 0;
  };
  updateVerbose = function() {
    var timer;
    g.verbose = this.checked;
    timer = $('#updater #timer');
    if (this.checked) {
      return timer.hidden = false;
    } else {
      timer.hidden = true;
      return $("#updater #count").textContent = 'Thread Updater';
    }
  };
  updater = {
    init: function() {
      var autoUpT, box, checked, conf, dialog, html, name, title, verbose, _i, _len, _ref;
      html = "<div class=move><span id=count></span> <span id=timer></span></div>";
      conf = config.updater.checkbox;
      for (name in conf) {
        title = conf[name][1];
        checked = $.config(name, conf) ? "checked" : "";
        html += "<div><label title=\"" + title + "\">" + name + "<input name=\"" + name + "\" " + checked + " type=checkbox></label></div>";
      }
      name = 'Auto Update This';
      title = 'Controls whether *this* thread auotmatically updates or not';
      checked = $.config('Auto Update', conf) ? 'checked' : '';
      html += "<div><label title=\"" + title + "\">" + name + "<input name=\"" + name + "\" " + checked + " type=checkbox></label></div>";
      dialog = ui.dialog('updater', {
        bottom: '0px',
        right: '0px'
      }, html);
      _ref = $$('input[type=checkbox]', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        box = _ref[_i];
        $.bind(box, 'click', $.cb.checked);
      }
      verbose = $('input[name=\"Verbose\"]', dialog);
      autoUpT = $('input[name=\"Auto Update This\"]', dialog);
      $.bind(verbose, 'click', updater.cb.verbose);
      $.bind(autoUpT, 'click', updater.cb.autoUpdate);
      $.append(d.body, dialog);
      return updater.cb.verbose.call(verbose);
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
        if (this.checked) {
          updater.timer = $.config('Interval', config.updater);
          return $('#timer').textContent = updater.timer;
        } else {
          return updater.timer = null;
        }
      }
    }
  };
  updaterMake = function() {
    var div, html, input, interval, name, _i, _len, _ref;
    html = "<div class=move><span id=count>Thread Updater</span> <span id=timer></span></div>";
    html += "<div><label>Verbose<input type=checkbox name=verbose></label></div>";
    html += "<div><label title=\"Make all threads auto update\">Auto Update Global<input type=checkbox name=autoG></label></div>";
    html += "<div><label title=\"Make this thread auto update\">Auto Update Local<input type=checkbox name=autoL></label></div>";
    html += "<div><label>Interval (s)<input type=text name=interval></label></div>";
    html += "<div><input type=button value='Update Now'></div>";
    div = ui.dialog('updater', 'bottomright', html);
    _ref = $$('input[type=checkbox]', div);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      $.bind(input, 'click', changeCheckbox);
      name = input.name;
      if (name === 'autoL') {
        input.checked = GM_getValue('autoG', true);
      } else {
        input.checked = GM_getValue(name, true);
      }
      switch (name) {
        case 'autoL':
          $.bind(input, 'click', updateAuto);
          break;
        case 'verbose':
          $.bind(input, 'click', updateVerbose);
      }
    }
    if (!(g.verbose = GM_getValue('verbose', true))) {
      $("#timer", div).hidden = true;
    }
    interval = $('input[name=interval]', div);
    interval.value = GM_getValue('Interval', 10);
    $.bind(interval, 'change', updateInterval);
    $.bind($('input[type=button]', div), 'click', updateNow);
    d.body.appendChild(div);
    if (GM_getValue('autoG', true)) {
      return updateAuto.call($("input[name=autoL]", div));
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
          src = g.favDefault;
        } else {
          src = g.favEmpty;
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
      if (favicon.src === g.favEmpty) {
        return watcher.watch(id, favicon);
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
        favicon.src = g.favEmpty;
      }
      watched = $.getValue('watched', {});
      delete watched[board][id];
      return $.setValue('watched', watched);
    },
    watch: function(id, favicon) {
      var props, watched, _name;
      favicon.src = g.favDefault;
      props = {
        textContent: ("/" + g.BOARD + "/ - ") + $.x('following-sibling::blockquote', favicon).textContent.slice(0, 25),
        href: "/" + g.BOARD + "/res/" + id
      };
      watched = $.getValue('watched', {});
      watched[_name = g.BOARD] || (watched[_name] = {});
      watched[g.BOARD][id] = props;
      $.setValue('watched', watched);
      return watcher.addLink(props);
    }
  };
  NAMESPACE = 'AEOS.4chan_x.';
  g = {
    callbacks: [],
    expand: false,
    favDead: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAD/AAA9+90tAAAAAXRSTlMAQObYZgAAADtJREFUCB0FwUERxEAIALDszMG730PNSkBEBSECoU0AEPe0mly5NWprRUcDQAdn68qtkVsj3/84z++CD5u7CsnoBJoaAAAAAElFTkSuQmCC',
    favDeadHalo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVR4XrWSAQoAIAgD/f+njSApsTqjGoTQ5oGWPJMOOs60CzsWwIwz1I4PUIYh+WYEMGQ6I/txw91kP4oA9BdwhKp1My4xQq6e8Q9ANgDJjOErewFiNesV2uGSfGv1/HYAAAAASUVORK5CYII=',
    favDefault: ((_ref = $('link[rel="shortcut icon"]', d)) != null ? _ref.href : void 0) || '',
    favEmpty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    flavors: ['http://regex.info/exif.cgi?url=', 'http://iqdb.org/?url=', 'http://tineye.com/search?url='].join('\n'),
    xhrs: []
  };
  g.favHalo = /ws/.test(g.favDefault) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVR4XrWRQQoAIQwD+6L97j7Ih9WTQQxhDqJQCk4Mranuvqod6LgwawSqSuUmWSPw/UNlJlnDAmA2ARjABLYj8ZyCzJHHqOg+GdAKZmKPIQUzuYrxicHqEgHzP9g7M0+hj45sAnRWxtPj3zSPAAAAAElFTkSuQmCC' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABmzDP///8AAABet0i+AAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII=';
  pathname = location.pathname.substring(1).split('/');
  g.BOARD = pathname[0], temp = pathname[1];
  if (temp === 'res') {
    g.REPLY = temp;
    g.THREAD_ID = pathname[2];
  } else {
    g.PAGENUM = parseInt(temp) || 0;
  }
  g.hiddenReply = $.getValue("hiddenReply/" + g.BOARD + "/", {});
  tzOffset = (new Date()).getTimezoneOffset() / 60;
  g.chanOffset = 5 - tzOffset;
  if ($.isDST()) {
    g.chanOffset -= 1;
  }
  /*
  lastChecked = Number GM_getValue('lastChecked', '0')
  now = Date.now()
  DAY = 24 * 60 * 60
  if lastChecked < now - 1*DAY
    cutoff = now - 7*DAY
    while g.hiddenThreads.length
      if g.hiddenThreads[0].timestamp > cutoff
        break
      g.hiddenThreads.shift()

    while g.hiddenReplies.length
      if g.hiddenReplies[0].timestamp > cutoff
        break
      g.hiddenReplies.shift()

    GM_setValue("hiddenThreads/#{g.BOARD}/", JSON.stringify(g.hiddenThreads))
    GM_setValue("hiddenReplies/#{g.BOARD}/", JSON.stringify(g.hiddenReplies))
    GM_setValue('lastChecked', now.toString())
  */
  $.addStyle('\
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
  #iHover {\
    position: fixed;\
  }\
  #options textarea {\
    height: 100px;\
    width: 500px;\
  }\
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
  #watcher {\
    position: absolute;\
  }\
  #watcher > div.move {\
    text-decoration: underline;\
    padding: 5px 5px 0 5px;\
  }\
  #watcher > div:last-child {\
    padding: 0 5px 5px 5px;\
  }\
  span.error {\
    color: red;\
  }\
  #qr.auto:not(:hover) form {\
    display: none;\
  }\
  #qr span.error {\
    position: absolute;\
    bottom: 0;\
    left: 0;\
  }\
  #qr {\
    position: fixed;\
  }\
  #qr > div {\
    text-align: right;\
  }\
  #qr > form > div, /* ad */\
  #qr td.rules {\
    display: none;\
  }\
  #options {\
    position: fixed;\
    padding: 5px;\
    text-align: right;\
  }\
  form[name=delform] a img {\
    border: 0px;\
    float: left;\
    margin: 0px 20px;\
  }\
  iframe {\
    display: none;\
  }\
  #navlinks {\
    position: fixed;\
    top: 25px;\
    right: 5px;\
  }\
  #navlinks > a {\
    font-size: 16px;\
  }\
  div.thread.stub > *:not(.block) {\
    display: none;\
  }\
  .hide {\
    display: none;\
  }\
  .new {\
    background: lime;\
  }\
  .favicon {\
    cursor: pointer;\
  }\
');
  if (location.hostname === 'sys.4chan.org') {
    qr.sys();
    return;
  }
  if (navtopr = $('#navtopr')) {
    options.init();
  } else if ($.config('404 Redirect') && d.title === '4chan - 404') {
    redirect();
  } else {
    return;
  }
  _ref2 = $$('#recaptcha_table a');
  for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
    el = _ref2[_i];
    el.tabIndex = 1;
  }
  recaptcha = $('#recaptcha_response_field');
  $.bind(recaptcha, 'keydown', recaptchaListener);
  $.bind($('form[name=post]'), 'submit', qr.cb.submit);
  scroll = function() {
    var bottom, height, i, reply, _len, _ref;
    height = d.body.clientHeight;
    _ref = g.replies;
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
    g.replies = g.replies.slice(i);
    return updateTitle();
  };
  if ($.config('Image Expansion')) {
    delform = $('form[name=delform]');
    expand = $.el('div', {
      innerHTML: "<select id=imageType name=imageType><option>full</option><option>fit width</option><option>fit screen</option></select>      <label>Expand Images<input type=checkbox id=imageExpand></label>"
    });
    imageType = GM_getValue('imageType', 'full');
    _ref3 = $$("option", expand);
    for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
      option = _ref3[_j];
      if (option.textContent === imageType) {
        option.selected = true;
        break;
      }
    }
    $.bind($('select', expand), 'change', changeValue);
    $.bind($('select', expand), 'change', imageTypeChange);
    $.bind($('input', expand), 'click', imageExpandClick);
    $.before(delform.firstChild, expand);
    g.callbacks.push(function(root) {
      var thumb, thumbs, _i, _len, _results;
      thumbs = $$('img[md5]', root);
      _results = [];
      for (_i = 0, _len = thumbs.length; _i < _len; _i++) {
        thumb = thumbs[_i];
        $.bind(thumb.parentNode, 'click', imageClick);
        _results.push(g.expand ? imageToggle(thumb.parentNode) : void 0);
      }
      return _results;
    });
  }
  if ($.config('Image Hover')) {
    imageHover.init();
  }
  if ($.config('Image Auto-Gif')) {
    g.callbacks.push(function(root) {
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
  if ($.config('Localize Time')) {
    g.callbacks.push(function(root) {
      var date, day, dotw, hour, min_sec, month, s, span, spans, year, _, _i, _len, _ref, _results;
      spans = $$('span[id^=no]', root);
      _results = [];
      for (_i = 0, _len = spans.length; _i < _len; _i++) {
        span = spans[_i];
        s = span.previousSibling;
        _ref = s.textContent.match(/(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\S+)/), _ = _ref[0], month = _ref[1], day = _ref[2], year = _ref[3], hour = _ref[4], min_sec = _ref[5];
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
  if ($.config('Sauce')) {
    g.callbacks.push(function(root) {
      var i, l, link, names, prefix, prefixes, span, spans, suffix, _i, _len, _results;
      spans = $$('span.filesize', root);
      prefixes = GM_getValue('flavors', g.flavors).split('\n');
      names = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
          prefix = prefixes[_i];
          _results.push(prefix.match(/(\w+)\./)[1]);
        }
        return _results;
      })();
      _results = [];
      for (_i = 0, _len = spans.length; _i < _len; _i++) {
        span = spans[_i];
        suffix = $('a', span).href;
        i = 0;
        l = names.length;
        _results.push((function() {
          var _results;
          _results = [];
          while (i < l) {
            link = $.el('a', {
              textContent: names[i],
              href: prefixes[i] + suffix
            });
            $.append(span, $.tn(' '), link);
            _results.push(i++);
          }
          return _results;
        })());
      }
      return _results;
    });
  }
  if ($.config('Reply Hiding')) {
    replyHiding.init();
  }
  if ($.config('Quick Reply')) {
    qr.init();
  }
  if ($.config('Quick Report')) {
    g.callbacks.push(function(root) {
      var a, arr, el, _i, _len, _results;
      arr = $$('span[id^=no]', root);
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        el = arr[_i];
        a = $.el('a', {
          textContent: '[ ! ]'
        });
        $.bind(a, 'click', report);
        $.after(el, a);
        _results.push($.after(el, $.tn(' ')));
      }
      return _results;
    });
  }
  if ($.config('Thread Watcher')) {
    watcher.init();
  }
  if ($.config('Anonymize')) {
    g.callbacks.push(function(root) {
      var name, names, trip, trips, _i, _j, _len, _len2, _results;
      names = $$('span.postername, span.commentpostername', root);
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        name.innerHTML = 'Anonymous';
      }
      trips = $$('span.postertrip', root);
      _results = [];
      for (_j = 0, _len2 = trips.length; _j < _len2; _j++) {
        trip = trips[_j];
        _results.push(trip.parentNode.nodeName === 'A' ? $.remove(trip.parentNode) : $.remove(trip));
      }
      return _results;
    });
  }
  if ($.config('Keybinds')) {
    keybinds.init();
  }
  if ($.config('Thread Updater')) {
    updater.init();
  }
  if (g.REPLY) {
    if ($.config('Image Preloading')) {
      g.callbacks.push(function(root) {
        var parent, thumb, thumbs, _i, _len, _results;
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
    if ($.config('Quick Reply') && $.config('Persistent QR')) {
      qr.persist();
    }
    if ($.config('Post in Title')) {
      if (!(text = $('span.filetitle').textContent)) {
        text = $('blockquote').textContent;
      }
      if (text) {
        d.title = "/" + g.BOARD + "/ - " + text;
      }
    }
    if ($.config('Unread Count')) {
      g.replies = [];
      d.title = '(0) ' + d.title;
      $.bind(window, 'scroll', scroll);
      g.callbacks.push(function(root) {
        g.replies = g.replies.concat($$('td.reply, td.replyhl', root));
        return updateTitle();
      });
    }
  } else {
    if ($.config('Thread Hiding')) {
      threadHiding.init();
    }
    if ($.config('Thread Navigation')) {
      nav.init();
    }
    if ($.config('Auto Watch')) {
      $.bind($('form[name=post]'), 'submit', autoWatch);
    }
    if ($.config('Thread Expansion')) {
      omitted = $$('span.omittedposts');
      for (_k = 0, _len3 = omitted.length; _k < _len3; _k++) {
        span = omitted[_k];
        a = $.el('a', {
          className: 'omittedposts',
          textContent: "+ " + span.textContent
        });
        $.bind(a, 'click', expandThread);
        $.replace(span, a);
      }
    }
    if ($.config('Comment Expansion')) {
      as = $$('span.abbr a');
      for (_l = 0, _len4 = as.length; _l < _len4; _l++) {
        a = as[_l];
        $.bind(a, 'click', expandComment);
      }
    }
  }
  _ref4 = g.callbacks;
  for (_m = 0, _len5 = _ref4.length; _m < _len5; _m++) {
    callback = _ref4[_m];
    callback();
  }
  $.bind(d.body, 'DOMNodeInserted', nodeInserted);
}).call(this);
