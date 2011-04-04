// ==UserScript==
// @name           4chan x
// @namespace      aeosynth
// @description    Adds various features.
// @version        1.27.4
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
  var $, $$, DAY, a, arr, as, autoWatch, callback, changeCheckbox, changeValue, clearHidden, config, cutoff, d, delform, down, editSauce, el, expand, expandComment, expandThread, g, getThread, hideReply, hideThread, href, html, i, id, imageClick, imageExpand, imageExpandClick, imageHover, imageResize, imageThumb, imageToggle, imageType, imageTypeChange, img, input, inputs, keyModeInsert, keyModeNormal, keydown, keypress, l1, lastChecked, log, navbotr, navtopr, nodeInserted, now, omitted, onloadComment, onloadThread, option, options, parseResponse, pathname, qr, recaptcha, recaptchaListener, recaptchaReload, redirect, replyNav, report, request, scroll, scrollThread, showReply, showThread, span, src, start, stopPropagation, temp, text, textContent, threadF, threads, tzOffset, ui, up, updateAuto, updateCallback, updateFavicon, updateInterval, updateNow, updateTime, updateTitle, updateVerbose, updaterMake, watch, watchX, watcher, watcherUpdate, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _ref, _ref2, _ref3, _ref4;
  var __slice = Array.prototype.slice;
  if (typeof console != "undefined" && console !== null) {
    log = console.log;
  }
  config = {
    '404 Redirect': [true, 'Redirect dead threads'],
    'Anonymize': [false, 'Make everybody anonymous'],
    'Auto Watch': [true, 'Automatically watch threads that you start (Firefox only)'],
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
    'Reply Navigation': [false, 'Navigate to the beginning / end of a thread'],
    'Sauce': [true, 'Add sauce to images'],
    'Show Stubs': [true, 'Of hidden threads / replies'],
    'Thread Expansion': [true, 'View all replies'],
    'Thread Hiding': [true, 'Hide entire threads'],
    'Thread Navigation': [true, 'Navigate to previous / next thread'],
    'Thread Updater': [true, 'Update threads'],
    'Thread Watcher': [true, 'Bookmark threads'],
    'Unread Count': [true, 'Show unread post count in tab title']
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
      var el, left, top, _ref;
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
      left = localStorage["" + id + "Left"] || left;
      top = localStorage["" + id + "Top"] || top;
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
      if ((_ref = el.querySelector('div.move a[name=close]')) != null) {
        _ref.addEventListener('click', (function() {
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
    addStyle: function(css) {
      var style;
      style = document.createElement('style');
      style.type = 'text/css';
      style.textContent = css;
      return $.append(d.head, style);
    },
    config: function(name) {
      return GM_getValue(name, config[name][0]);
    },
    zeroPad: function(n) {
      if (n < 10) {
        return '0' + n;
      } else {
        return n;
      }
    },
    slice: function(arr, id) {
      var el, i, _len;
      for (i = 0, _len = arr.length; i < _len; i++) {
        el = arr[i];
        if (id === el.id) {
          arr.splice(i, 1);
          return arr;
        }
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
  clearHidden = function() {
    GM_deleteValue("hiddenReplies/" + g.BOARD + "/");
    GM_deleteValue("hiddenThreads/" + g.BOARD + "/");
    this.value = "hidden: 0";
    g.hiddenReplies = [];
    return g.hiddenThreads = [];
  };
  editSauce = function() {
    var ta;
    ta = $('#options textarea');
    if (ta.style.display) {
      return $.show(ta);
    } else {
      return $.hide(ta);
    }
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
  getThread = function() {
    var bottom, i, thread, threads, _len;
    threads = $$('div.thread');
    for (i = 0, _len = threads.length; i < _len; i++) {
      thread = threads[i];
      bottom = thread.getBoundingClientRect().bottom;
      if (bottom > 0) {
        return [thread, i];
      }
    }
  };
  hideReply = function(reply) {
    var a, div, name, p, table, trip, _ref;
    if (p = this.parentNode) {
      reply = p.nextSibling;
      g.hiddenReplies.push({
        id: reply.id,
        timestamp: Date.now()
      });
      GM_setValue("hiddenReplies/" + g.BOARD + "/", JSON.stringify(g.hiddenReplies));
    }
    name = $('span.commentpostername', reply).textContent;
    trip = ((_ref = $('span.postertrip', reply)) != null ? _ref.textContent : void 0) || '';
    table = $.x('ancestor::table', reply);
    $.hide(table);
    if ($.config('Show Stubs')) {
      a = $.el('a', {
        textContent: "[ + ] " + name + " " + trip,
        className: 'pointer'
      });
      $.bind(a, 'click', showReply);
      div = $.el('div');
      $.append(div, a);
      return $.before(table, div);
    }
  };
  hideThread = function(div) {
    var a, name, num, p, span, text, trip, _ref;
    if (p = this.parentNode) {
      div = p;
      g.hiddenThreads.push({
        id: div.id,
        timestamp: Date.now()
      });
      GM_setValue("hiddenThreads/" + g.BOARD + "/", JSON.stringify(g.hiddenThreads));
    }
    $.hide(div);
    if ($.config('Show Stubs')) {
      if (span = $('.omittedposts', div)) {
        num = Number(span.textContent.match(/\d+/)[0]);
      } else {
        num = 0;
      }
      num += $$('table', div).length;
      text = num === 1 ? "1 reply" : "" + num + " replies";
      name = $('span.postername', div).textContent;
      trip = ((_ref = $('span.postername + span.postertrip', div)) != null ? _ref.textContent : void 0) || '';
      a = $.el('a', {
        textContent: "[ + ] " + name + trip + " (" + text + ")",
        className: 'pointer'
      });
      $.bind(a, 'click', showThread);
      return $.before(div, a);
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
  keydown = function(e) {
    var kc;
    kc = e.keyCode;
    g.keyCode = kc;
    return g.char = String.fromCharCode(kc);
  };
  keypress = function(e) {
    var _ref;
    if ((_ref = d.activeElement.nodeName) === 'TEXTAREA' || _ref === 'INPUT') {
      return keyModeInsert(e);
    } else {
      return keyModeNormal(e);
    }
  };
  keyModeInsert = function(e) {
    var char, kc, range, selEnd, selStart, ta, valEnd, valMid, valStart, value;
    kc = g.keyCode;
    char = g.char;
    if (kc === 27) {
      $.remove($('#qr'));
      return e.preventDefault();
    } else if (e.ctrlKey && char === "S") {
      ta = d.activeElement;
      if (ta.nodeName !== 'TEXTAREA') {
        return;
      }
      value = ta.value;
      selStart = ta.selectionStart;
      selEnd = ta.selectionEnd;
      valStart = value.slice(0, selStart) + '[spoiler]';
      valMid = value.slice(selStart, selEnd);
      valEnd = '[/spoiler]' + value.slice(selEnd);
      ta.value = valStart + valMid + valEnd;
      range = valStart.length + valMid.length;
      ta.setSelectionRange(range, range);
      return e.preventDefault();
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
      case "0":
        return location.pathname = "/" + g.BOARD;
      case "G":
        if (e.shiftKey) {
          return window.scrollTo(0, 99999);
        } else {
          window.scrollTo(0, 0);
          return location.hash = '';
        }
        break;
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
  options = function() {
    var checked, description, div, hiddenNum, html, input, option, value, _i, _len, _ref;
    if (div = $('#options')) {
      $.remove(div);
      return;
    }
    hiddenNum = g.hiddenReplies.length + g.hiddenThreads.length;
    html = '<div class="move">Options <a name=close>X</a></div><div>';
    for (option in config) {
      value = config[option];
      description = value[1];
      checked = $.config(option) ? "checked" : "";
      html += "<label title=\"" + description + "\">" + option + "<input " + checked + " name=\"" + option + "\" type=\"checkbox\"></label><br>";
    }
    html += "<div><a class=sauce>Flavors</a></div>";
    html += "<div><textarea style=\"display: none;\" name=flavors>" + (GM_getValue('flavors', g.flavors)) + "</textarea></div>";
    html += "<input type=\"button\" value=\"hidden: " + hiddenNum + "\"><br>";
    html += "<hr>";
    html += "<div><a href=\"http://chat.now.im/x/aeos\">support</a></div>";
    html += '<div><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2DBVZBUAM4DHC&lc=US&item_name=Aeosynth&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted"><img alt="Donate" src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif"/></a></div>';
    div = ui.dialog('options', 'center', html);
    _ref = $$('input[type="checkbox"]', div);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input = _ref[_i];
      $.bind(input, 'change', changeCheckbox);
    }
    $.bind($('a.sauce', div), 'click', editSauce);
    $.bind($('textarea', div), 'change', changeValue);
    $.bind($('input[type="button"]', div), 'click', clearHidden);
    return $.append(d.body, div);
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
        var recaptcha, span;
        if (span = this.nextSibling) {
          $.remove(span);
        }
        recaptcha = $('input[name=recaptcha_response_field]', this);
        if (recaptcha.value) {
          qr.autohide.set();
          return g.sage = $('#qr input[name=email]').value === 'sage';
        } else {
          e.preventDefault();
          span = $.el('span', {
            className: 'error',
            textContent: 'You forgot to type in the verification.'
          });
          $.append(this.parentNode, span);
          alert('You forgot to type in the verification.');
          return recaptcha.focus();
        }
      },
      quote: function(e) {
        var dialog, id, s, selection, selectionID, ta, target, text, _ref;
        e.preventDefault();
        target = e.target;
        if (!(dialog = $('#qr'))) {
          dialog = qr.dialog(target);
        }
        qr.autohide.unset();
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
      },
      refresh: function(dialog) {
        var auto, f, submit, _ref;
        $('textarea', dialog).value = '';
        $('input[name=recaptcha_response_field]', dialog).value = '';
        f = $('input[type=file]', dialog).parentNode;
        f.innerHTML = f.innerHTML;
        submit = $('input[type=submit]', qr);
        submit.value = g.sage ? 60 : 30;
        submit.disabled = true;
        window.setTimeout(qr.cooldown, 1000);
        auto = submit.previousSibling.lastChild;
        if (auto.checked) {
          return (_ref = $('input[title=autohide]:checked', qr)) != null ? _ref.click() : void 0;
        }
      }
    },
    cooldown: function() {
      var auto, seconds, submit;
      submit = $('#qr input[type=submit]');
      seconds = parseInt(submit.value);
      if (seconds === 0) {
        submit.disabled = false;
        submit.value = 'Submit';
        auto = submit.previousSibling.lastChild;
        if (auto.checked) {
          return $('#qr form').submit();
        }
      } else {
        submit.value = seconds - 1;
        return window.setTimeout(qr.cooldown, 1000);
      }
    },
    dialog: function(link) {
      var auto, autobox, clone, dialog, el, html, input, script, submit, xpath, _i, _len, _ref;
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
        input = $.el('input', {
          type: 'hidden',
          name: 'resto',
          value: $.x(xpath, link).name
        });
        $.append(clone, input);
      } else if ($.config('Persistent QR')) {
        submit = $('input[type=submit]', clone);
        auto = $.el('label', {
          textContent: 'Auto'
        });
        autobox = $.el('input', {
          type: 'checkbox'
        });
        $.append(auto, autobox);
        $.before(submit, auto);
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
  showReply = function() {
    var div, id, table;
    div = this.parentNode;
    table = div.nextSibling;
    $.show(table);
    $.remove(div);
    id = $('td.reply, td.replyhl', table).id;
    $.slice(g.hiddenReplies, id);
    return GM_setValue("hiddenReplies/" + g.BOARD + "/", JSON.stringify(g.hiddenReplies));
  };
  showThread = function() {
    var div, id;
    div = this.nextSibling;
    $.show(div);
    $.hide(this);
    id = div.id;
    $.slice(g.hiddenThreads, id);
    return GM_setValue("hiddenThreads/" + g.BOARD + "/", JSON.stringify(g.hiddenThreads));
  };
  stopPropagation = function(e) {
    return e.stopPropagation();
  };
  threadF = function(current) {
    var a, div, hidden, id, _i, _len, _ref;
    div = $.el('div', {
      className: 'thread'
    });
    a = $.el('a', {
      textContent: '[ - ]',
      className: 'pointer'
    });
    $.bind(a, 'click', hideThread);
    $.append(div, a);
    $.before(current, div);
    while (!current.clear) {
      $.append(div, current);
      current = div.nextSibling;
    }
    $.append(div, current);
    current = div.nextSibling;
    id = $('input[value="delete"]', div).name;
    div.id = id;
    _ref = g.hiddenThreads;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hidden = _ref[_i];
      if (id === hidden.id) {
        hideThread(div);
      }
    }
    current = current.nextSibling.nextSibling;
    if (current.nodeName !== 'CENTER') {
      return threadF(current);
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
    $.bind($('input[type=button]'), 'click', updateNow);
    d.body.appendChild(div);
    if (GM_getValue('autoG')) {
      return updateAuto.call($("input[name=autoL]", div));
    }
  };
  watch = function() {
    var id, text, _base, _name;
    id = this.nextSibling.name;
    if (this.src === g.favEmpty) {
      this.src = g.favDefault;
      text = ("/" + g.BOARD + "/ - ") + $.x('following-sibling::blockquote', this).textContent.slice(0, 25);
      (_base = g.watched)[_name = g.BOARD] || (_base[_name] = []);
      g.watched[g.BOARD].push({
        id: id,
        text: text
      });
    } else {
      this.src = g.favEmpty;
      g.watched[g.BOARD] = $.slice(g.watched[g.BOARD], id);
    }
    GM_setValue('watched', JSON.stringify(g.watched));
    return watcherUpdate();
  };
  watcherUpdate = function() {
    var a, board, div, link, old, thread, _i, _len, _ref;
    div = $.el('div');
    for (board in g.watched) {
      _ref = g.watched[board];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        a = $.el('a', {
          textContent: 'X',
          className: 'pointer'
        });
        $.bind(a, 'click', watchX);
        link = $.el('a', {
          textContent: thread.text,
          href: "/" + board + "/res/" + thread.id
        });
        $.append(div, a, $.tn(' '), link, $.el('br'));
      }
    }
    old = $('#watcher div:last-child');
    return $.replace(old, div);
  };
  watchX = function() {
    var board, favicon, id, input, _, _ref;
    _ref = this.nextElementSibling.getAttribute('href').substring(1).split('/'), board = _ref[0], _ = _ref[1], id = _ref[2];
    g.watched[board] = $.slice(g.watched[board], id);
    GM_setValue('watched', JSON.stringify(g.watched));
    watcherUpdate();
    if (input = $("input[name=\"" + id + "\"]")) {
      favicon = input.previousSibling;
      return favicon.src = g.favEmpty;
    }
  };
  g = {
    callbacks: [],
    expand: false,
    favDead: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAD/AAA9+90tAAAAAXRSTlMAQObYZgAAADtJREFUCB0FwUERxEAIALDszMG730PNSkBEBSECoU0AEPe0mly5NWprRUcDQAdn68qtkVsj3/84z++CD5u7CsnoBJoaAAAAAElFTkSuQmCC',
    favDeadHalo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVR4XrWSAQoAIAgD/f+njSApsTqjGoTQ5oGWPJMOOs60CzsWwIwz1I4PUIYh+WYEMGQ6I/txw91kP4oA9BdwhKp1My4xQq6e8Q9ANgDJjOErewFiNesV2uGSfGv1/HYAAAAASUVORK5CYII=',
    favDefault: ((_ref = $('link[rel="shortcut icon"]', d)) != null ? _ref.href : void 0) || '',
    favEmpty: 'http://static.4chan.org/image/favicon-dis.ico',
    flavors: ['http://regex.info/exif.cgi?url=', 'http://iqdb.org/?url=', 'http://saucenao.com/search.php?db=999&url=', 'http://tineye.com/search?url='].join('\n'),
    watched: JSON.parse(GM_getValue('watched', '{}')),
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
  g.hiddenThreads = JSON.parse(GM_getValue("hiddenThreads/" + g.BOARD + "/", '[]'));
  g.hiddenReplies = JSON.parse(GM_getValue("hiddenReplies/" + g.BOARD + "/", '[]'));
  tzOffset = (new Date()).getTimezoneOffset() / 60;
  g.chanOffset = 5 - tzOffset;
  if ($.isDST()) {
    g.chanOffset -= 1;
  }
  lastChecked = Number(GM_getValue('lastChecked', '0'));
  now = Date.now();
  DAY = 24 * 60 * 60;
  if (lastChecked < now - 1 * DAY) {
    cutoff = now - 7 * DAY;
    while (g.hiddenThreads.length) {
      if (g.hiddenThreads[0].timestamp > cutoff) {
        break;
      }
      g.hiddenThreads.shift();
    }
    while (g.hiddenReplies.length) {
      if (g.hiddenReplies[0].timestamp > cutoff) {
        break;
      }
      g.hiddenReplies.shift();
    }
    GM_setValue("hiddenThreads/" + g.BOARD + "/", JSON.stringify(g.hiddenThreads));
    GM_setValue("hiddenReplies/" + g.BOARD + "/", JSON.stringify(g.hiddenReplies));
    GM_setValue('lastChecked', now.toString());
  }
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
  span.navlinks {\
    position: absolute;\
    right: 5px;\
  }\
  span.navlinks > a {\
    font-size: 16px;\
    text-decoration: none;\
  }\
  .hide {\
    display: none;\
  }\
  .new {\
    background: lime;\
  }\
');
  if (location.hostname === 'sys.4chan.org') {
    qr.sys();
    return;
  }
  if (navtopr = $('#navtopr a')) {
    a = $.el('a', {
      textContent: '4chan X',
      className: 'pointer'
    });
    $.bind(a, 'click', options);
    $.replace(navtopr, a);
    navbotr = $('#navbotr a');
    a = $.el('a', {
      textContent: '4chan X',
      className: 'pointer'
    });
    $.bind(a, 'click', options);
    $.replace(navbotr, a);
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
    g.callbacks.push(function(root) {
      var id, next, obj, td, tds, _i, _len, _results;
      tds = $$('td.doubledash', root);
      _results = [];
      for (_i = 0, _len = tds.length; _i < _len; _i++) {
        td = tds[_i];
        a = $.el('a', {
          textContent: '[ - ]',
          className: 'pointer'
        });
        $.bind(a, 'click', hideReply);
        $.replace(td.firstChild, a);
        next = td.nextSibling;
        id = next.id;
        _results.push((function() {
          var _i, _len, _ref, _results;
          _ref = g.hiddenReplies;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            obj = _ref[_i];
            _results.push(obj.id === id ? hideReply(next) : void 0);
          }
          return _results;
        })());
      }
      return _results;
    });
  }
  if ($.config('Quick Reply')) {
    qr.init();
  }
  if ($.config('Quick Report')) {
    g.callbacks.push(function(root) {
      var arr, el, _i, _len, _results;
      arr = $$('span[id^=no]', root);
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        el = arr[_i];
        a = $.el('a', {
          textContent: '[ ! ]',
          className: 'pointer'
        });
        $.bind(a, 'click', report);
        $.after(el, a);
        _results.push($.after(el, $.tn(' ')));
      }
      return _results;
    });
  }
  if ($.config('Thread Watcher')) {
    html = '<div class="move">Thread Watcher</div><div></div>';
    watcher = ui.dialog('watcher', {
      top: '50px',
      left: '0px'
    }, html);
    $.append(d.body, watcher);
    watcherUpdate();
    threads = g.watched[g.BOARD] || [];
    inputs = $$('form > input[value="delete"], div > input[value="delete"]');
    for (_k = 0, _len3 = inputs.length; _k < _len3; _k++) {
      input = inputs[_k];
      id = input.name;
      src = (function() {
        var thread, _i, _len;
        for (_i = 0, _len = threads.length; _i < _len; _i++) {
          thread = threads[_i];
          if (id === thread.id) {
            return g.favDefault;
          }
        }
        return g.favEmpty;
      })();
      img = $.el('img', {
        src: src,
        className: 'pointer'
      });
      $.bind(img, 'click', watch);
      $.before(input, img);
    }
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
  if ($.config('Reply Navigation')) {
    g.callbacks.push(function(root) {
      var arr, down, el, span, up, _i, _len, _results;
      arr = $$('span[id^=norep]', root);
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        el = arr[_i];
        span = $.el('span');
        up = $.el('a', {
          textContent: '▲',
          className: 'pointer'
        });
        $.bind(up, 'click', replyNav);
        down = $.el('a', {
          textContent: '▼',
          className: 'pointer'
        });
        $.bind(down, 'click', replyNav);
        $.append(span, $.tn(' '), up, $.tn(' '), down);
        _results.push($.after(el, span));
      }
      return _results;
    });
  }
  if ($.config('Keybinds')) {
    $.bind(d, 'keydown', keydown);
    $.bind(d, 'keypress', keypress);
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
    if ($.config('Thread Updater')) {
      updaterMake();
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
      delform = $('form[name=delform]');
      start = $('form[name=delform] > *');
      if ($.config('Image Expansion')) {
        start = start.nextSibling;
      }
      $.bind(d, 'DOMNodeInserted', stopPropagation);
      threadF(start);
      $.unbind(d, 'DOMNodeInserted', stopPropagation);
    }
    if ($.config('Auto Watch')) {
      $.bind($('form[name=post]'), 'submit', autoWatch);
    }
    if ($.config('Thread Navigation')) {
      arr = $$('div > span.filesize, form > span.filesize');
      l1 = arr.length - 1;
      for (i = 0, _len4 = arr.length; i < _len4; i++) {
        el = arr[i];
        span = $.el('span', {
          className: 'navlinks',
          id: 'p' + i
        });
        if (i) {
          textContent = '▲';
          href = "#p" + (i - 1);
        } else if (g.PAGENUM) {
          textContent = '◀';
          href = "" + (g.PAGENUM - 1) + "#p0";
        } else {
          textContent = '▲';
          href = "#navtop";
        }
        up = $.el('a', {
          className: 'pointer',
          textContent: textContent,
          href: href
        });
        if (i < l1) {
          textContent = '▼';
          href = "#p" + (i + 1);
        } else {
          textContent = '▶';
          href = "" + (g.PAGENUM + 1) + "#p0";
        }
        down = $.el('a', {
          className: 'pointer',
          textContent: textContent,
          href: href
        });
        $.append(span, up, $.tn(' '), down);
        $.before(el, span);
      }
      if (location.hash === '#p0') {
        window.location = window.location;
      }
    }
    if ($.config('Thread Expansion')) {
      omitted = $$('span.omittedposts');
      for (_l = 0, _len5 = omitted.length; _l < _len5; _l++) {
        span = omitted[_l];
        a = $.el('a', {
          className: 'pointer omittedposts',
          textContent: "+ " + span.textContent
        });
        $.bind(a, 'click', expandThread);
        $.replace(span, a);
      }
    }
    if ($.config('Comment Expansion')) {
      as = $$('span.abbr a');
      for (_m = 0, _len6 = as.length; _m < _len6; _m++) {
        a = as[_m];
        $.bind(a, 'click', expandComment);
      }
    }
  }
  _ref4 = g.callbacks;
  for (_n = 0, _len7 = _ref4.length; _n < _len7; _n++) {
    callback = _ref4[_n];
    callback();
  }
  $.bind(d.body, 'DOMNodeInserted', nodeInserted);
}).call(this);
