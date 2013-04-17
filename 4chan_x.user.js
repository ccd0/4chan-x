// ==UserScript==
// @name                4chan x
// @namespace           aeosynth
// @version             1.0.8
// @description         Cross-browser userscript for maximum lurking on 4chan.
// @copyright           2013-2013 Zixaphir <zixaphirmoxphar@gmail.com>
// @copyright           2013-2013 Jordan Bates <saudrapsmann@gmail.com>
// @copyright           2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright           2012-2013 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license             MIT; http://en.wikipedia.org/wiki/Mit_license
// @match               *://*.4chan.org/*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_openInTab
// @run-at              document-start
// @updateURL           https://github.com/seaweedchan/4chan-x/raw/stable/4chan_x.meta.js
// @downloadURL         https://github.com/seaweedchan/4chan-x/raw/stable/4chan_x.user.js
// @icon                data:image/gif;base64,R0lGODlhYAAQAJEAAGbMM////wAAAP///yH5BAEAAAMALAAAAABgABAAAAL8nI+py+0Po5y02ruEFmh7PnxbJ3KecR4pqoWr2iajIgR2AIb3bu43WPPhdENiLmg7Jn25EODZFDwBTSIPJRwir1tuElvshrNf1RR4lv2QPZzmG9zA16c4uO3+WeVl55Qq9RdVZlc4p3VYdcfXBpSo0ufyJ1gVx2j0huhmWKSW1Xhpd0czSZVBhucl1Hj6acVkBNnZIcggdgh7y0qTFIoaOypTqoiZCTpjiRwp66jp8RhsVmrq2bzbsbz3AcxpDfztBxUIVT0qij0LtsoN3c1MSx5eSQiNTqzL7mzed+4khfZPBrIRL1jEoFHCRYw6A1usKGiiQwgMFCtalFAAADs=
// ==/UserScript==

/*
 * 4chan x - Version 1.0.8 - 2013-04-17
 *
 * Licensed under the MIT license.
 * https://github.com/seaweedchan/4chan-x/blob/master/LICENSE
 *
 * Appchan X Copyright © 2013-2013 Zixaphir <zixaphirmoxphar@gmail.com>
 *   http://zixaphir.github.io/appchan-x/
 * 4chan x Copyright © 2009-2011 James Campos <james.r.campos@gmail.com>
 *   https://github.com/aeosynth/4chan-x
 * 4chan x Copyright © 2012-2013 Nicolas Stepien <stepien.nicolas@gmail.com>
 *   https://4chan-x.just-believe.in/
 * 4chan x Copyright © 2013-2013 Jordan Bates <saudrapsmann@gmail.com>
 * 	 http://seaweedchan.github.io/4chan-x/
 * 4chan x Copyright © 2012-2013 ihavenoface
 * 	 http://ihavenoface.github.io/4chan-x/
 * OneeChan Copyright © 2011-2013 Jordan Bates <saudrapsmann@gmail.com>
 *   http://seaweedchan.github.io/oneechan/
 * 4chan SS Copyright © 2011-2013 Ahodesuka
 *   https://github.com/ahodesuka/4chan-Style-Script/
 * Raphael Icons Copyright © 2013 Dmitry Baranovskiy
 *   http://raphaeljs.com/icons/
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
 * Contributors:
 *   aeosynth
 *   mayhemydg
 *   noface
 *   !K.WeEabo0o
 *   blaise
 *   that4chanwolf
 *   desuwa
 *   seaweed
 *   e000
 *   ahodesuka
 *   Shou
 *   ferongr
 *   xat
 *   Ongpot
 *   thisisanon
 *   Anonymous
 *   Seiba
 *   herpaderpderp
 *   WakiMiko
 *   btmcsweeney
 *   AppleBloom
 *
 * All the people who've taken the time to write bug reports.
 *
 * Thank you.
 */

/*
 * Linkify based on:
 *   http://downloads.mozdev.org/greasemonkey/linkify.user.js
 *   https://github.com/MayhemYDG/LinkifyPlusFork
 *
 * Originally written by Anthony Lieuallen of http://arantius.com/
 * Licensed for unlimited modification and redistribution as long as
 * this notice is kept intact.
 */

/*
 * JSColor, JavaScript Color Picker
 *
 * @license   GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author    Jan Odvarko, http://odvarko.cz
 * @link      http://JSColor.com
 */

(function() {
  var $, $$, AnnouncementHiding, Anonymize, ArchiveLink, BanChecker, Build, CatalogLinks, Conf, Config, CustomNavigation, DeleteLink, DownloadLink, EmbedLink, Emoji, ExpandComment, ExpandThread, FappeTyme, Favicon, FileInfo, Filter, Get, IDColor, ImageExpand, ImageHover, ImageReplace, Keybinds, Linkify, Main, MarkOwn, Markdown, Menu, MutationObserver, Nav, Navigation, Options, Prefetch, QR, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, Quotify, Redirect, RelativeDates, RemoveSpoilers, ReplyHideLink, ReplyHiding, ReportLink, RevealSpoilers, Sauce, StrikethroughQuotes, Style, ThreadHideLink, ThreadHiding, ThreadStats, Time, TitlePost, UI, Unread, Updater, Watcher, d, g, userNavigation, _base,
    __slice = [].slice;

  Config = {
    main: {
      Enhancing: {
        'Catalog Links': [true, 'Turn Navigation links into links to each board\'s catalog.'],
        'External Catalog': [false, 'Link to external catalog instead of the internal one.'],
        '404 Redirect': [true, 'Redirect dead threads and images'],
        'Keybinds': [true, 'Binds actions to keys'],
        'Time Formatting': [true, 'Arbitrarily formatted timestamps, using your local time'],
        'Relative Post Dates': [false, 'Display dates as "3 minutes ago" f.e., tooltip shows the timestamp'],
        'File Info Formatting': [true, 'Reformats the file information'],
        'Comment Expansion': [true, 'Expand too long comments'],
        'Thread Expansion': [true, 'View all replies'],
        'Index Navigation': [false, 'Navigate to previous / next thread'],
        'Reply Navigation': [false, 'Navigate to top / bottom of thread'],
        'Custom Navigation': [false, 'Customize your Navigation bar.'],
        'Append Delimiters': [false, 'Adds delimiters before and after custom navigation.'],
        'Check for Updates': [true, 'Check for updated versions of 4chan X'],
        'Check for Bans': [false, 'Check ban status and prepend it to the top of the page.'],
        'Check for Bans constantly': [false, 'Optain ban status on every refresh. Note that this will cause delay on getting the result.'],
        'Custom CSS': [false, 'Add your own CSS to 4chan.'],
        'Emoji': [false, 'Adds icons next to names for different emails']
      },
      Linkification: {
        'Linkify': [true, 'Convert text into links where applicable.'],
        'Embedding': [true, 'Embed supported services.'],
        'Link Title': [true, 'Replace the link of a supported site with its actual title. Currently Supported: YouTube, Vimeo, SoundCloud']
      },
      Filtering: {
        'Announcement Hiding': [false, 'Allow toggling of announcement'],
        'Anonymize': [false, 'Make everybody anonymous'],
        'Filter': [true, 'Self-moderation placebo'],
        'Recursive Filtering': [true, 'Filter replies of filtered posts, recursively'],
        'Reply Hiding': [false, 'Hide single replies'],
        'Thread Hiding': [false, 'Hide entire threads'],
        'Show Stubs': [true, 'Of hidden threads / replies']
      },
      Imaging: {
        'Image Expansion': [true, 'Expand images'],
        'Image Hover': [false, 'Show full image on mouseover'],
        'Sauce': [true, 'Add sauce to images'],
        'Reveal Spoilers': [false, 'Replace spoiler thumbnails by the original thumbnail'],
        'Don\'t Expand Spoilers': [true, 'Don\'t expand spoilers when using ImageExpand.'],
        'Expand From Current': [false, 'Expand images from current position to thread end.'],
        'Fappe Tyme': [false, 'Toggle display of posts without images.'],
        'Prefetch': [false, 'Prefetch images.'],
        'Replace GIF': [false, 'Replace thumbnail of gifs with its actual image.'],
        'Replace PNG': [false, 'Replace pngs.'],
        'Replace JPG': [false, 'Replace jpgs.']
      },
      Menu: {
        'Menu': [true, 'Add a drop-down menu in posts.'],
        'Report Link': [true, 'Add a report link to the menu.'],
        'Delete Link': [true, 'Add post and image deletion links to the menu.'],
        'Download Link': [false, 'Add a download with original filename link to the menu. Chrome-only currently.'],
        'Archive Link': [true, 'Add an archive link to the menu.'],
        'Embed Link': [true, 'Add an embed link to the menu to embed all supported formats in a post.'],
        'Thread Hiding Link': [true, 'Add a link to hide entire threads.'],
        'Reply Hiding Link': [true, 'Add a link to hide single replies.']
      },
      Monitoring: {
        'Thread Updater': [true, 'Update threads. Has more options in its own dialog.'],
        'Optional Increase': [false, 'Increase value of Updater over time.'],
        'Interval per board': [false, 'Change the intervals of updates on a board-by-board basis.'],
        'Unread Count': [true, 'Show unread post count in tab title'],
        'Unread Favicon': [true, 'Show a different favicon when there are unread posts'],
        'Post in Title': [true, 'Show the op\'s post in the tab title'],
        'Thread Stats': [true, 'Display reply and image count'],
        'Merged Updater and Stats': [false, 'Merges the updater and thread stats into one container.'],
        'Thread Watcher': [false, 'Bookmark threads'],
        'Auto Watch': [true, 'Automatically watch threads that you start'],
        'Auto Watch Reply': [false, 'Automatically watch threads that you reply to'],
        'Color user IDs': [false, 'Assign unique colors to user IDs on boards that use them'],
        'Remove Spoilers': [false, 'Remove all spoilers in text.'],
        'Indicate Spoilers': [false, 'Indicate spoilers if Remove Spoilers is enabled.']
      },
      Posting: {
        'Quick Reply': [true, 'Reply without leaving the page'],
        'Cooldown': [true, 'Prevent "flood detected" errors.'],
        'Persistent QR': [false, 'The Quick reply won\'t disappear after posting.'],
        'Auto Hide QR': [false, 'Automatically hide the quick reply when posting.'],
        'Open Reply in New Tab': [false, 'Open replies in a new tab that are made from the main board.'],
        'Per Board Persona': [false, 'Remember Name, Email, Subject, etc per board instead of globally.'],
        'Remember QR size': [false, 'Remember the size of the Quick reply (Firefox only).'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Remember Sage': [false, 'Remember email even if it contains sage.'],
        'Hide Original Post Form': [true, 'Replace the normal post form with a shortcut to open the QR'],
        'Markdown': [false, 'Code, italic, bold, italic bold, double struck - `, *, **, ***, ||, respectively. _ can be used instead of *.']
      },
      Quoting: {
        'Quote Backlinks': [true, 'Add quote backlinks'],
        'OP Backlinks': [false, 'Add backlinks to the OP'],
        'Quote Highlighting': [true, 'Highlight the previewed post'],
        'Quote Inline': [true, 'Show quoted post inline on quote click'],
        'Quote Hash Navigation': [false, 'Show a "#" to jump around the thread as if Quote Inline were disabled.'],
        'Quote Preview': [true, 'Show quote content on hover'],
        'Resurrect Quotes': [true, 'Linkify dead quotes to archives'],
        'Indicate OP quote': [true, 'Add \'(OP)\' to OP quotes'],
        'Indicate Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes'],
        'Indicate Own Posts': [true, 'Add (you) to posts you\'ve authored.'],
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks']
      }
    },
    filter: {
      name: "# Filter any namefags:\n#/^(?!Anonymous$)/",
      uniqueid: "# Filter a specific ID:\n#/Txhvk1Tl/",
      tripcode: "# Filter any tripfags\n#/^!/",
      mod: "# Set a custom class for mods:\n#/Mod$/;highlight:mod;op:yes\n# Set a custom class for moot:\n#/Admin$/;highlight:moot;op:yes",
      email: "# Filter any e-mails that are not `sage` on /a/ and /jp/:\n#/^(?!sage$)/;boards:a,jp",
      subject: "# Filter Generals on /v/:\n#/general/i;boards:v;op:only'",
      comment: "# Filter Stallman copypasta on /g/:\n#/what you\'re refer+ing to as linux/i;boards:g",
      country: '',
      filename: '',
      dimensions: "# Highlight potential wallpapers:\n#/1920x1080/;op:yes;highlight;top:no;boards:w,wg",
      filesize: '',
      md5: ''
    },
    sauces: "http://iqdb.org/?url=$1\nhttp://www.google.com/searchbyimage?image_url=$1\n#http://tineye.com/search?url=$1\n#http://saucenao.com/search.php?db=999&url=$1\n#http://3d.iqdb.org/?url=$1\n#http://regex.info/exif.cgi?imgurl=$2\n# uploaders:\n#http://imgur.com/upload?url=$2;text:Upload to imgur\n#http://omploader.org/upload?url1=$2;text:Upload to omploader\n# \"View Same\" in archives:\n#http://archive.foolz.us/_/search/image/$3/;text:View same on foolz\n#http://archive.foolz.us/$4/search/image/$3/;text:View same on foolz /$4/\n#https://archive.installgentoo.net/$4/image/$3;text:View same on installgentoo /$4/",
    time: '%m/%d/%y(%a)%H:%M',
    backlink: '>>%id',
    fileInfo: '%L (%p%s, %r)',
    favicon: 'ferongr',
    sageEmoji: 'appchan',
    emojiPos: 'before',
    updateIncrease: '5,10,15,20,30,60,90,120,240,300',
    updateIncreaseB: '5,10,15,20,30,60,90,120,240,300',
    customCSS: "/* Block Ads */\n/*\ndiv.center {\n  display: none;\n}\n*/\n/* Tripcode Italics: */\n/*\nspan.postertrip {\n  font-style: italic;\n}\n*/\n\n/* Add a rounded border to thumbnails (but not expanded images): */\n/*\n.fileThumb > img:first-child {\n  border: solid 2px rgba(0,0,100,0.5);\n  border-radius: 10px;\n}\n*/\n\n/* Make highlighted posts look inset on the page: */\n/*\ndiv.post:target,\ndiv.post.highlight {\n  box-shadow: inset 2px 2px 2px rgba(0,0,0,0.2);\n}\n*/",
    hotkeys: {
      openQR: ['I', 'Open QR with post number inserted'],
      openEmptyQR: ['i', 'Open QR without post number inserted'],
      openOptions: ['ctrl+o', 'Open Options'],
      close: ['Esc', 'Close Options or QR'],
      spoiler: ['ctrl+s', 'Quick spoiler tags'],
      math: ['ctrl+m', 'Quick math tags'],
      eqn: ['ctrl+e', 'Quick eqn tags'],
      code: ['alt+c', 'Quick code tags'],
      sageru: ['alt+n', 'Sage keybind'],
      submit: ['alt+s', 'Submit post'],
      hideQR: ['h', 'Toggle hide status of QR'],
      toggleCatalog: ['alt+t', 'Toggle links in nav bar'],
      watch: ['w', 'Watch thread'],
      update: ['u', 'Update now'],
      unreadCountTo0: ['z', 'Mark thread as read'],
      expandImage: ['m', 'Expand selected image'],
      expandAllImages: ['M', 'Expand all images'],
      fappeTyme: ['F', 'Toggle Fappe Tyme'],
      zero: ['0', 'Jump to page 0'],
      nextPage: ['L', 'Jump to the next page'],
      previousPage: ['H', 'Jump to the previous page'],
      nextThread: ['n', 'See next thread'],
      previousThread: ['p', 'See previous thread'],
      expandThread: ['e', 'Expand thread'],
      openThreadTab: ['o', 'Open thread in new tab'],
      openThread: ['O', 'Open thread in current tab'],
      nextReply: ['J', 'Select next reply'],
      previousReply: ['K', 'Select previous reply'],
      hide: ['x', 'Hide thread']
    },
    updater: {
      checkbox: {
        'Beep': [false, 'Beep on new post to completely read thread'],
        'Scrolling': [false, 'Scroll updated posts into view. Only enabled at bottom of page.'],
        'Scroll BG': [false, 'Scroll background tabs'],
        'Verbose': [true, 'Show countdown timer, new post count'],
        'Auto Update': [true, 'Automatically fetch new posts']
      },
      Interval: 30,
      BGInterval: 60
    },
    embedWidth: 640,
    embedHeight: 390
  };

  if (!/^[a-z]+\.4chan\.org$/.test(location.hostname)) {
    return;
  }

  Conf = {};

  g = {};

  d = document;

  g.TYPE = 'sfw';

  userNavigation = {};

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.OMutationObserver;

  /*
  loosely follows the jquery api:
  http://api.jquery.com/
  not chainable
  */


  $ = function(selector, root) {
    var result;

    root || (root = d.body);
    if (result = root.querySelector(selector)) {
      return result;
    }
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
    NBSP: '\u00A0',
    minmax: function(value, min, max) {
      return (value < min ? min : value > max ? max : value);
    },
    log: typeof (_base = console.log).bind === "function" ? _base.bind(console) : void 0,
    engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase(),
    ready: function(fc) {
      var cb;

      if (['interactive', 'complete'].contains(d.readyState)) {
        return setTimeout(fc);
      }
      if (!$.callbacks) {
        $.callbacks = [];
        cb = function() {
          var callback, _i, _len, _ref;

          _ref = $.callbacks;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            callback();
          }
          return $.off(d, 'DOMContentLoaded', cb);
        };
        $.on(d, 'DOMContentLoaded', cb);
      }
      $.callbacks.push(fc);
      return $.on(d, 'DOMContentLoaded', cb);
    },
    sync: function(key, cb) {
      var parse;

      key = Main.namespace + key;
      parse = JSON.parse;
      return $.on(window, 'storage', function(e) {
        if (e.key === key) {
          return cb(parse(e.newValue));
        }
      });
    },
    id: function(id) {
      return d.getElementById(id);
    },
    formData: function(arg) {
      var fd, key, val;

      if (arg instanceof HTMLFormElement) {
        fd = new FormData(arg);
      } else {
        fd = new FormData();
        for (key in arg) {
          val = arg[key];
          if (val) {
            fd.append(key, val);
          }
        }
      }
      return fd;
    },
    ajax: function(url, callbacks, opts) {
      var form, headers, key, r, type, upCallbacks, val;

      if (!opts) {
        opts = {};
      }
      type = opts.type, headers = opts.headers, upCallbacks = opts.upCallbacks, form = opts.form;
      r = new XMLHttpRequest();
      r.overrideMimeType('text/html');
      type || (type = form && 'post' || 'get');
      r.open(type, url, true);
      for (key in headers) {
        val = headers[key];
        r.setRequestHeader(key, val);
      }
      $.extend(r, callbacks);
      $.extend(r.upload, upCallbacks);
      if (type === 'post') {
        r.withCredentials = true;
      }
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
            return delete $.cache.requests[url];
          },
          onerror: function() {
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
    addStyle: function(css, identifier) {
      var style;

      style = $.el('style', {
        innerHTML: css,
        id: identifier
      });
      $.add(d.head, style);
      return style;
    },
    x: function(path, root) {
      root || (root = d.body);
      return d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
    },
    X: function(path, root) {
      root || (root = d.body);
      return d.evaluate(path, root, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    },
    addClass: function(el, className) {
      return el.classList.add(className);
    },
    rmClass: function(el, className) {
      return el.classList.remove(className);
    },
    toggleClass: function(el, className) {
      return el.classList.toggle(className);
    },
    hasClass: function(el, className) {
      return el.classList.contains(className);
    },
    rm: function(el) {
      return el.parentNode.removeChild(el);
    },
    rmAll: function(root) {
      var node;

      while (node = root.firstChild) {
        $.rm(node);
      }
    },
    tn: function(string) {
      return d.createTextNode(string);
    },
    nodes: function(nodes) {
      var frag, node, _i, _len;

      if (!(nodes instanceof Array)) {
        return nodes;
      }
      frag = $.frag();
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        $.add(frag, node);
      }
      return frag;
    },
    frag: function() {
      return d.createDocumentFragment();
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
    event: function(el, e) {
      return el.dispatchEvent(e);
    },
    globalEval: function(code) {
      var script;

      script = $.el('script', {
        textContent: "(" + code + ")()"
      });
      $.add(d.head, script);
      return $.rm(script);
    },
    shortenFilename: function(filename, isOP) {
      var threshold;

      threshold = 30 + 10 * isOP;
      if (filename.replace(/\.\w+$/, '').length > threshold) {
        return "" + filename.slice(0, threshold - 5) + "(...)" + (filename.match(/\.\w+$/));
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
    },
    debounce: function(wait, fn) {
      var timeout;

      timeout = null;
      return function() {
        if (timeout) {
          clearTimeout(timeout);
        } else {
          fn.apply(this, arguments);
        }
        return timeout = setTimeout((function() {
          return timeout = null;
        }), wait);
      };
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
      if ((value = GM_getValue(name)) && value !== 'undefined') {
        return JSON.parse(value);
      } else {
        return defaultValue;
      }
    },
    set: function(name, value) {
      name = Main.namespace + name;
      localStorage.setItem(name, JSON.stringify(value));
      return GM_setValue(name, JSON.stringify(value));
    },
    open: function(url) {
      return GM_openInTab(location.protocol + url, true);
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
    },
    open: function(url) {
      return window.open(location.protocol + url, '_blank');
    }
  });

  $$ = function(selector, root) {
    var result;

    root || (root = d.body);
    if (result = __slice.call(root.querySelectorAll(selector))) {
      return result;
    }
    return null;
  };

  UI = {
    dialog: function(id, position, html) {
      var el, move;

      el = $.el('div', {
        className: 'reply dialog',
        innerHTML: html,
        id: id
      });
      el.style.cssText = $.get("" + id + ".coords", position);
      if (move = $('.move', el)) {
        move.addEventListener('mousedown', UI.dragstart, false);
      }
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
      $.set("" + UI.el.id + ".coords", UI.el.style.cssText);
      d.removeEventListener('mousemove', UI.drag, false);
      d.removeEventListener('mouseup', UI.dragend, false);
      return delete UI.el;
    },
    hover: function(e, mode) {
      var clientHeight, clientWidth, clientX, clientY, height, style, top, _ref;

      clientX = e.clientX, clientY = e.clientY;
      style = UI.el.style;
      _ref = d.documentElement, clientHeight = _ref.clientHeight, clientWidth = _ref.clientWidth;
      height = UI.el.offsetHeight;
      if ((mode || 'default') === 'default') {
        top = clientY - 120;
        style.top = "" + (clientHeight <= height || top <= 0 ? 0 : top + height >= clientHeight ? clientHeight - height : top) + "px";
        if (clientX <= clientWidth - 400) {
          style.left = clientX + 45 + 'px';
          return style.right = null;
        } else {
          style.left = null;
          style.right = clientWidth - clientX + 20 + 'px';
          return top = clientY - 120;
        }
      } else {
        if (clientX <= clientWidth - 400) {
          style.left = clientX + 20 + 'px';
          style.right = null;
          top = clientY;
        } else {
          style.left = null;
          style.right = clientWidth - clientX + 20 + 'px';
          top = clientY - 120;
        }
        return style.top = "" + (clientHeight <= height || top <= 0 ? 0 : top + height >= clientHeight ? clientHeight - height : top) + "px";
      }
    },
    hoverend: function() {
      $.rm(UI.el);
      return delete UI.el;
    }
  };

  Options = {
    init: function() {
      var a, setting, settings, _i, _len, _ref, _results;

      if (!$.get('firstrun')) {
        $.set('firstrun', true);
        if (!Favicon.el) {
          Favicon.init();
        }
        Options.dialog();
      }
      _ref = ['navtopright', 'navbotright'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        settings = _ref[_i];
        a = $.el('a', {
          className: 'settingsWindowLink',
          textContent: '4chan X Settings',
          href: 'javascript:;'
        });
        $.on(a, 'click', function() {
          return Options.dialog();
        });
        setting = $.id(settings);
        if (Conf['Disable 4chan\'s extension']) {
          $.replace(setting.childNodes[1], a);
          continue;
        }
        _results.push($.prepend(setting, [$.tn('['), a, $.tn('] ')]));
      }
      return _results;
    },
    dialog: function() {
      var archiver, arr, back, checked, customCSS, description, dialog, div, emojiPos, favicon, fieldset, fileInfo, filter, height, hiddenNum, hiddenThreads, input, key, label, legend, name, obj, overlay, sageEmoji, sauce, time, toSelect, tr, updateIncrease, updateIncreaseB, value, width, _i, _j, _len, _len1, _ref, _ref1, _ref2;

      dialog = Options.el = $.el('div', {
        id: 'options',
        className: 'reply dialog',
        innerHTML: '<div id=optionsbar>\
  <div id=credits>\
    <label for=apply>Apply</label>\
    | <a class=export>Export</a>\
    | <a class=import>Import</a>\
    | <a target=_blank href=http://seaweedchan.github.io/4chan-x/>4chan X</a>\
    | <a target=_blank href=https://raw.github.com/seaweedchan/4chan-x/4chanX/changelog>' + Main.version + '</a>\
  </div>\
\
  <div class=imp-exp>\
      <div class=placeholder></div>\
      <input type=file style="visibility:hidden; position: absolute;">\
      <p class=imp-exp-result></p>\
  </div>\
\
  <div class=tabs>\
    <label for=main_tab id=selected_tab>Main</label>\
    | <label for=filter_tab>Filter</label>\
    | <label for=sauces_tab>Sauce</label>\
    | <label for=keybinds_tab>Keybinds</label>\
    | <label for=rice_tab>Rice</label>\
  </div>\
</div>\
<div id=content>\
  <input type=radio name=tab hidden id=main_tab checked>\
  <div class=main_tab>\
  </div>\
  <input type=radio name=tab hidden id=sauces_tab>\
  <div class=sauces_tab>\
    <div class=warning><code>Sauce</code> is disabled.</div>\
    Lines starting with a <code>#</code> will be ignored.<br>\
    You can specify a certain display text by appending <code>;text:[text]</code> to the url.\
    <ul>These parameters will be replaced by their corresponding values:\
      <li>$1: Thumbnail url.</li>\
      <li>$2: Full image url.</li>\
      <li>$3: MD5 hash.</li>\
      <li>$4: Current board.</li>\
    </ul>\
    <textarea name=sauces id=sauces class=field></textarea>\
  </div>\
  <input type=radio name=tab hidden id=filter_tab>\
  <div class=filter_tab>\
    <div class=warning><code>Filter</code> is disabled.</div>\
    <select name=filter>\
      <option value=guide>Guide</option>\
      <option value=name>Name</option>\
      <option value=uniqueid>Unique ID</option>\
      <option value=tripcode>Tripcode</option>\
      <option value=mod>Admin/Mod</option>\
      <option value=email>E-mail</option>\
      <option value=subject>Subject</option>\
      <option value=comment>Comment</option>\
      <option value=country>Country</option>\
      <option value=filename>Filename</option>\
      <option value=dimensions>Image dimensions</option>\
      <option value=filesize>Filesize</option>\
      <option value=md5>Image MD5 (uses exact string matching, not regular expressions)</option>\
    </select>\
  </div>\
  <input type=radio name=tab hidden id=rice_tab>\
  <div class=rice_tab>\
  <fieldset style="margin-top: 15px;">\
    <legend>Icons</legend>\
    <div class=warning style="width: 35%"><code>Emoji</code> is disabled.</div>\
    <div style="display: inline-block; margin-right: 20px;">\
        Emoji Position<br>\
       <span></span>\
        <select name=emojiPos>\
          <option value=before>Before</option>\
          <option value=after>After</option>\
        </select>\
      </div>\
      <div style="display: inline-block; margin-right: 20px;">\
        Sage Emoji<br>\
       <span></span>\
        <select name=sageEmoji>\
          <option value=appchan>Appchan</option>\
          <option value=4chanSS>4chan SS</option>\
        </select>\
        </div>\
      <div style="display: inline-block;">\
        <div class=warning><code>Unread Favicon</code> is disabled.</div>\
        Unread favicons<br>\
       <span></span>\
        <select name=favicon>\
          <option value=ferongr>ferongr</option>\
          <option value=xat->xat-</option>\
          <option value=Mayhem>Mayhem</option>\
          <option value=4chanJS>4chanJS</option>\
          <option value=Original>Original</option>\
        </select>\
      </div>\
    </fieldset>\
    <span></span>\
    <fieldset>\
      <legend>Archiver</legend>\
      <div>\
        Select an Archiver for this board:\
        <select name=archiver></select>\
      </div>\
    </fieldset>\
    <fieldset>\
      <legend>Updater\'s Dynamic Increase</legend>\
      <div>Visible tab</div>\
      <div><input name=updateIncrease class=field></div>\
      <div>Background tab</div>\
      <div><input name=updateIncreaseB class=field></div>\
    </fieldset>\
    <fieldset>\
      <legend>Backlink formatting</legend>\
      <div class=warning><code>Quote Backlinks</code> are disabled.</div>\
      <div><input name=backlink class=field> : <span id=backlinkPreview></span></div>\
    </fieldset>\
    <fieldset>\
    <legend>Time Formatting</legend>\
      <div class=warning><code>Time Formatting</code> is disabled.</div>\
      <input name=time class=field> : <span id=timePreview></span><br>\
      Supported <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:<br>\
      Day: %a, %A, %d, %e<br>\
      Month: %m, %b, %B<br>\
      Year: %y<br>\
      Hour: %k, %H, %l (lowercase L), %I (uppercase i), %p, %P<br>\
      Minutes: %M<br>\
      Seconds: %S<br>\
    </fieldset>\
    <fieldset>\
    <div class=warning><code>File Info Formatting</code> is disabled.</div>\
      <legend>File Info Formatting</legend>\
      <input name=fileInfo class=field> : <span id=fileInfoPreview class=fileText></span><br>\
      Link: %l (lowercase L, truncated), %L (untruncated), %t (Unix timestamp)<br>\
      Original file name: %n (truncated), %N (untruncated), %T (Unix timestamp)<br>\
      Spoiler indicator: %p<br>\
      Size: %B (Bytes), %K (KB), %M (MB), %s (4chan default)<br>\
      Resolution: %r (Displays PDF on /po/, for PDFs)<br>\
    </fieldset>\
    <fieldset id=persona>\
    <div class=warning style="margin-bottom: 5px;"><code>Per Board Persona</code> is disabled.</div>\
        <legend>Per Board Persona</legend>\
        <select name=personaboards></select>\
            <br><br>\
            <div class=option>\
              Name:\
            </div>\
            <div class=option>\
              <input name=name>\
            </div>\
            <div class=option>\
              Email:\
            </div>\
            <div class=option>\
              <input name=email>\
            </div>\
            <div class=option>\
              Subject:\
            </div>\
            <div class=option>\
              <input name=sub>\
            </div>\
            <br>\
            <button></button>\
      </fieldset>\
    <fieldset>\
      <legend>Embedding</legend>\
      Specify size of video embeds<br>\
      Height: <input name=embedHeight type=number />px\
      |\
      Width:  <input name=embedWidth  type=number />px\
      <button name=resetSize>Reset</button>\
    </fieldset>\
    <fieldset>\
    <legend>Custom Navigation</legend>\
      <div class=warning style="margin-bottom: 5px;"><code>Custom Navigation</code> is disabled.</div>\
      <div id=customNavigation>\
      </div>\
    </fieldset>\
    <fieldset>\
    <legend>Custom CSS</legend>\
      <div class=warning><code>Custom CSS</code> is disabled.</div><br>\
      Remove Comment blocks to use! ( "/*" and "*/" around CSS blocks )\
      <textarea name=customCSS id=customCSS class=field></textarea>\
  </div>\
  <input type=radio name=tab hidden id=keybinds_tab>\
  <div class=keybinds_tab>\
    <div class=warning><code>Keybinds</code> are disabled.</div>\
    <div>Allowed keys: Ctrl, Alt, Meta, a-z, A-Z, 0-9, Up, Down, Right, Left.</div>\
    <table><tbody>\
      <tr><th>Actions</th><th>Keybinds</th></tr>\
    </tbody></table>\
  </div>\
  <input type=radio name=tab hidden onClick="document.location.reload()" id=apply>\
  <div>Reloading page with new settings.</div>\
</div>'
      });
      _ref = $$('label[for]', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        label = _ref[_i];
        $.on(label, 'click', function() {
          var previous;

          if (previous = $.id('selected_tab')) {
            previous.id = '';
          }
          return this.id = 'selected_tab';
        });
      }
      $.on($('#credits .export', dialog), 'click', Options["export"]);
      $.on($('#credits .import', dialog), 'click', Options["import"]);
      $.on($('.imp-exp>input', dialog), 'change', Options.onImport);
      _ref1 = Config.main;
      for (key in _ref1) {
        obj = _ref1[key];
        fieldset = $.el('fieldset');
        legend = $.el('legend', {
          textContent: key
        });
        for (key in obj) {
          arr = obj[key];
          checked = $.get(key, Conf[key]) ? 'checked' : '';
          description = arr[1];
          div = $.el('div', {
            innerHTML: "<label><input type=checkbox name=\"" + key + "\" " + checked + "><span class=\"optionlabel\">" + key + "</span></label><span>: " + description + "</span>"
          });
          $.on($('input', div), 'click', $.cb.checked);
          $.add(fieldset, legend);
          $.add(fieldset, div);
        }
        $.add($('#main_tab + div', dialog), fieldset);
      }
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length;
      div = $.el('div', {
        innerHTML: "<span class=\"optionlabel\"><button>hidden: " + hiddenNum + "</button></span><div style=\"display: none\">Forget all hidden posts. Useful if you accidentally hide a post and have \"Show Stubs\" disabled.</div>"
      });
      $.on($('button', div), 'click', Options.clearHidden);
      $.on($('.optionlabel', div), 'mouseover', Options.mouseover);
      $.add($('fieldset:nth-child(3)', dialog), div);
      filter = $('select[name=filter]', dialog);
      $.on(filter, 'change', Options.filter);
      archiver = $('select[name=archiver]', dialog);
      toSelect = Redirect.select(g.BOARD);
      if (!toSelect[0]) {
        toSelect = ['No Archive Available'];
      }
      for (_j = 0, _len1 = toSelect.length; _j < _len1; _j++) {
        name = toSelect[_j];
        $.add(archiver, $.el('option', {
          textContent: name
        }));
      }
      if (toSelect[1]) {
        archiver.value = $.get(value = "archiver/" + g.BOARD + "/", toSelect[0]);
        $.on(archiver, 'change', function() {
          return $.set(value, this.value);
        });
      }
      sauce = $('#sauces', dialog);
      sauce.value = $.get(sauce.name, Conf[sauce.name]);
      $.on(sauce, 'change', $.cb.value);
      (back = $('[name=backlink]', dialog)).value = $.get('backlink', Conf['backlink']);
      (time = $('[name=time]', dialog)).value = $.get('time', Conf['time']);
      (fileInfo = $('[name=fileInfo]', dialog)).value = $.get('fileInfo', Conf['fileInfo']);
      $.on(back, 'input', $.cb.value);
      $.on(back, 'input', Options.backlink);
      $.on(time, 'input', $.cb.value);
      $.on(time, 'input', Options.time);
      $.on(fileInfo, 'input', $.cb.value);
      $.on(fileInfo, 'input', Options.fileInfo);
      this.persona.select = $('[name=personaboards]', dialog);
      this.persona.button = $('#persona button', dialog);
      this.persona.data = $.get('persona', {
        global: {}
      });
      if (!this.persona.data[g.BOARD]) {
        this.persona.data[g.BOARD] = JSON.parse(JSON.stringify(this.persona.data.global));
      }
      for (name in this.persona.data) {
        this.persona.select.innerHTML += "<option value=" + name + ">" + name + "</option>";
      }
      this.persona.select.value = Conf['Per Board Persona'] ? g.BOARD : 'global';
      this.persona.init();
      $.on(this.persona.select, 'change', Options.persona.change);
      customCSS = $('#customCSS', dialog);
      customCSS.value = $.get(customCSS.name, Conf[customCSS.name]);
      $.on(customCSS, 'change', function() {
        $.cb.value.call(this);
        return Style.addStyle();
      });
      (width = $('[name=embedWidth]', dialog)).value = $.get('embedWidth', Conf['embedWidth']);
      (height = $('[name=embedHeight]', dialog)).value = $.get('embedHeight', Conf['embedHeight']);
      $.on(width, 'input', $.cb.value);
      $.on(height, 'input', $.cb.value);
      $.on($('[name=resetSize]', dialog), 'click', function() {
        $.set('embedWidth', width.value = Config.embedWidth);
        return $.set('embedHeight', height.value = Config.embedHeight);
      });
      favicon = $('select[name=favicon]', dialog);
      favicon.value = $.get('favicon', Conf['favicon']);
      $.on(favicon, 'change', $.cb.value);
      $.on(favicon, 'change', Options.favicon);
      sageEmoji = $('select[name=sageEmoji]', dialog);
      sageEmoji.value = $.get('sageEmoji', Conf['sageEmoji']);
      $.on(sageEmoji, 'change', $.cb.value);
      $.on(sageEmoji, 'change', Options.sageEmoji);
      emojiPos = $('select[name=emojiPos]', dialog);
      emojiPos.value = $.get('emojiPos', Conf['emojiPos']);
      $.on(emojiPos, 'change', $.cb.value);
      $.on(emojiPos, 'change', Options.emojiPos);
      (updateIncrease = $('[name=updateIncrease]', dialog)).value = $.get('updateIncrease', Conf['updateIncrease']);
      (updateIncreaseB = $('[name=updateIncreaseB]', dialog)).value = $.get('updateIncreaseB', Conf['updateIncreaseB']);
      $.on(updateIncrease, 'input', $.cb.value);
      $.on(updateIncreaseB, 'input', $.cb.value);
      this.customNavigation.dialog(dialog);
      _ref2 = Config.hotkeys;
      for (key in _ref2) {
        arr = _ref2[key];
        tr = $.el('tr', {
          innerHTML: "<td>" + arr[1] + "</td><td><input name=" + key + " class=field></td>"
        });
        input = $('input', tr);
        input.value = $.get(key, Conf[key]);
        $.on(input, 'keydown', Options.keybind);
        $.add($('#keybinds_tab + div tbody', dialog), tr);
      }
      overlay = $.el('div', {
        id: 'overlay'
      });
      $.on(dialog, 'click', function(e) {
        return e.stopPropagation();
      });
      $.on(overlay, 'click', Options.close);
      $.on(dialog, 'click', function(e) {
        return e.stopPropagation();
      });
      $.add(overlay, dialog);
      $.add(d.body, overlay);
      d.body.style.setProperty('width', "" + d.body.clientWidth + "px", null);
      $.addClass(d.body, 'unscroll');
      this.indicators(dialog);
      Options.filter.call(filter);
      Options.backlink.call(back);
      Options.time.call(time);
      Options.fileInfo.call(fileInfo);
      Options.favicon.call(favicon);
      return Options.sageEmoji.call(sageEmoji);
    },
    indicators: function(dialog) {
      var indicator, indicators, key, _i, _j, _len, _len1, _ref, _ref1;

      indicators = {};
      _ref = $$('.warning', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        indicator = _ref[_i];
        key = indicator.firstChild.textContent;
        indicator.hidden = $.get(key, Conf[key]);
        indicators[key] = indicator;
        $.on($("[name='" + key + "']", dialog), 'click', function() {
          return indicators[this.name].hidden = this.checked;
        });
      }
      _ref1 = $$('.disabledwarning', dialog);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        indicator = _ref1[_j];
        key = indicator.firstChild.textContent;
        indicator.hidden = !$.get(key, Conf[key]);
        indicators[key] = indicator;
        $.on($("[name='" + key + "']", dialog), 'click', function() {
          return Options.indicators(dialog);
        });
      }
    },
    customNavigation: {
      dialog: function(dialog) {
        var addLink, div, index, input, item, itemIndex, li, link, navOptions, removeLink, ul, _ref;

        div = $("#customNavigation", dialog);
        ul = $.el("div");
        li = $.el("div", {
          className: "delimiter",
          textContent: "Delimiter: "
        });
        input = $.el("input", {
          className: "field",
          name: "delimiter"
        });
        input.setAttribute("value", userNavigation.delimiter);
        input.setAttribute("placeholder", "delimiter");
        input.setAttribute("type", "text");
        $.on(input, "change", function() {
          if (this.value === "") {
            alert("Custom Navigation options cannot be blank.");
            return;
          }
          userNavigation.delimiter = this.value;
          return $.set("userNavigation", userNavigation);
        });
        $.add(li, input);
        $.add(ul, li);
        li = $.el("div", {
          innerHTML: "Navigation Syntax:<br>Display Name | Title / Alternate Text | URL"
        });
        $.add(ul, li);
        navOptions = ["Display Name", "Title / Alt Text", "URL"];
        _ref = userNavigation.links;
        for (index in _ref) {
          link = _ref[index];
          if (typeof link !== 'object') {
            continue;
          }
          li = $.el("div");
          input = $.el("input", {
            className: "hidden",
            value: index,
            type: "hidden",
            hidden: "hidden"
          });
          $.add(li, input);
          for (itemIndex in link) {
            item = link[itemIndex];
            if (typeof item !== 'string') {
              continue;
            }
            input = $.el("input", {
              className: "field",
              name: itemIndex,
              value: item,
              placeholder: navOptions[itemIndex],
              type: "text"
            });
            $.on(input, "change", function() {
              if (this.value === "") {
                alert("Custom Navigation options cannot be blank.");
                return;
              }
              userNavigation.links[this.parentElement.firstChild.value][this.name] = this.value;
              return $.set("userNavigation", userNavigation);
            });
            $.add(li, [input, $.tn(' ')]);
          }
          addLink = $.el("a", {
            textContent: " + ",
            href: "javascript:;"
          });
          $.on(addLink, "click", function() {
            var blankLink;

            blankLink = ["ex", "example", "http://www.example.com/"];
            userNavigation.links.add(blankLink, this.parentElement.firstChild.value);
            return Options.customNavigation.cleanup();
          });
          removeLink = $.el("a", {
            textContent: " x ",
            href: "javascript:;"
          });
          $.on(removeLink, "click", function() {
            userNavigation.links.remove(userNavigation.links[this.parentElement.firstChild.value]);
            return Options.customNavigation.cleanup();
          });
          $.add(li, addLink);
          $.add(li, removeLink);
          $.add(ul, li);
        }
        li = $.el("div", {
          innerHTML: "<a name='add' href='javascript:;'>+</a> | <a name='reset' href='javascript:;'>Reset</a>"
        });
        $.on($('a[name=add]', li), "click", function() {
          var blankLink;

          blankLink = ["ex", "example", "http://www.example.com/"];
          userNavigation.links.push(blankLink);
          return Options.customNavigation.cleanup();
        });
        $.on($('a[name=reset]', li), "click", function() {
          userNavigation = JSON.parse(JSON.stringify(Navigation));
          return Options.customNavigation.cleanup();
        });
        $.add(ul, li);
        return $.add(div, ul);
      },
      cleanup: function() {
        $.set("userNavigation", userNavigation);
        $.rm($("#customNavigation > div", d.body));
        return Options.customNavigation.dialog($("#options", d.body));
      }
    },
    persona: {
      init: function() {
        var input, item, key, _i, _len, _ref;

        key = Conf['Per Board Persona'] ? g.BOARD : 'global';
        Options.persona.newButton();
        _ref = Options.persona.array;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          input = $("input[name=" + item + "]", Options.el);
          input.value = this.data[key][item] || "";
          $.on(input, 'blur', function() {
            var pers;

            pers = Options.persona;
            pers.data[pers.select.value][this.name] = this.value;
            return $.set('persona', pers.data);
          });
        }
        return $.on(Options.persona.button, 'click', Options.persona.copy);
      },
      array: ['name', 'email', 'sub'],
      change: function() {
        var input, item, key, _i, _len, _ref;

        key = this.value;
        Options.persona.newButton();
        _ref = Options.persona.array;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          input = $("input[name=" + item + "]", Options.el);
          input.value = Options.persona.data[key][item];
        }
      },
      copy: function() {
        var change, data, select, _ref;

        _ref = Options.persona, select = _ref.select, data = _ref.data, change = _ref.change;
        if (select.value === 'global') {
          data.global = JSON.parse(JSON.stringify(data[select.value]));
        } else {
          data[select.value] = JSON.parse(JSON.stringify(data.global));
        }
        $.set('persona', Options.persona.data = data);
        return change.call(select);
      },
      newButton: function() {
        return Options.persona.button.textContent = "Copy from " + (Options.persona.select.value === 'global' ? 'current board' : 'global');
      }
    },
    close: function() {
      $.rm(this);
      d.body.style.removeProperty('width');
      return $.rmClass(d.body, 'unscroll');
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
    filter: function() {
      var article, el, name, ta;

      el = this.nextSibling;
      if ((name = this.value) !== 'guide') {
        ta = $.el('textarea', {
          name: name,
          className: 'field',
          value: $.get(name, Conf[name])
        });
        $.on(ta, 'change', $.cb.value);
        $.replace(el, ta);
        return;
      }
      article = $.el('article', {
        innerHTML: "<p>Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>\n  Lines starting with a <code>#</code> will be ignored.<br>\n  For example, <code>/weeaboo/i</code> will filter posts containing the string `<code>weeaboo</code>`, case-insensitive.</p>\n<ul>You can use these settings with each regular expression, separate them with semicolons:\n  <li>\n    Per boards, separate them with commas. It is global if not specified.<br>\n    For example: <code>boards:a,jp;</code>.\n  </li>\n  <li>\n    Filter OPs only along with their threads (`only`), replies only (`no`, this is default), or both (`yes`).<br>\n    For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.\n  </li>\n  <li>\n    Overrule the `Show Stubs` setting if specified: create a stub (`yes`) or not (`no`).<br>\n    For example: <code>stub:yes;</code> or <code>stub:no;</code>.\n  </li>\n  <li>\n    Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>\n    For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.\n  </li>\n  <li>\n    Highlighted OPs will have their threads put on top of board pages by default.<br>\n    For example: <code>top:yes;</code> or <code>top:no;</code>.\n  </li>\n</ul>"
      });
      if (el) {
        return $.replace(el, article);
      } else {
        return $.after(this, article);
      }
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
        link: '//images.4chan.org/g/src/1334437723720.jpg',
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
      return this.previousElementSibling.innerHTML = "<img src=" + Favicon.unreadSFW + "> <img src=" + Favicon.unreadNSFW + "> <img src=" + Favicon.unreadDead + ">";
    },
    sageEmoji: function() {
      Conf['sageEmoji'] = this.value;
      return this.previousElementSibling.innerHTML = "<img src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA" + (Emoji.icons[Emoji.icons.length - 1][1] = Emoji.sageValue(this.value)) + ">";
    },
    "export": function() {
      var a, data, now, output;

      now = Date.now();
      data = {
        version: Main.version,
        date: now,
        Conf: Conf,
        WatchedThreads: $.get('watched', {})
      };
      a = $.el('a', {
        className: 'warning',
        textContent: 'Save me!',
        download: "4chan X v" + Main.version + "-" + now + ".json",
        href: "data:application/json;base64," + (btoa(unescape(encodeURIComponent(JSON.stringify(data))))),
        target: '_blank'
      });
      if ($.engine !== 'gecko') {
        a.click();
        return;
      }
      output = $('.imp-exp>.placeholder');
      $.rmAll(output);
      $.rmAll($('.imp-exp-result'));
      return $.add(output, a);
    },
    "import": function() {
      $('.imp-exp>input').click();
      return $.rmAll($('.imp-exp>.placeholder'));
    },
    onImport: function() {
      var file, output, reader;

      if (!(file = this.files[0])) {
        return;
      }
      output = $('.imp-exp-result');
      if (!confirm('Your current settings will be entirely overwritten, are you sure?')) {
        output.textContent = 'Import aborted.';
        return;
      }
      reader = new FileReader();
      reader.onload = function(e) {
        var data, err;

        try {
          data = JSON.parse(e.target.result);
          Options.loadSettings(data);
          if (confirm('Import successful. Refresh now?')) {
            return window.location.reload();
          }
        } catch (_error) {
          err = _error;
          return output.textContent = 'Import failed due to an error.';
        }
      };
      return reader.readAsText(file);
    },
    loadSettings: function(data) {
      var key, val, _ref;

      _ref = data.Conf;
      for (key in _ref) {
        val = _ref[key];
        $.set(key, val);
      }
      return $.set('watched', data.WatchedThreads);
    }
  };

  BanChecker = {
    init: function() {
      var reason;

      this.now = Date.now();
      if (!Conf['Check for Bans constantly'] && (reason = $.get('isBanned'))) {
        return BanChecker.prepend(reason);
      } else if (Conf['Check for Bans constantly'] || $.get('lastBanCheck', 0) < this.now - 6 * $.HOUR) {
        return BanChecker.load();
      }
    },
    load: function() {
      this.url = 'https://www.4chan.org/banned';
      return $.ajax(this.url, {
        onloadend: function() {
          var doc, msg, reason;

          if (this.status === 200 || 304) {
            if (!Conf['Check for Bans constantly']) {
              $.set('lastBanCheck', BanChecker.now);
            }
            doc = d.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = this.response;
            if (/no entry in our database/i.test((msg = $('.boxcontent', doc).textContent.trim()))) {
              if ($.get('isBanned', false)) {
                $["delete"]('isBanned');
                $.rm(BanChecker.el);
                delete BanChecker.el;
              }
              return;
            }
            $.set('isBanned', reason = /This ban will not expire/i.test(msg) ? 'You are permabanned.' : 'You are banned.');
            return BanChecker.prepend(reason);
          }
        }
      });
    },
    prepend: function(reason) {
      var el;

      if (!BanChecker.el) {
        Banchecker.el = el = $.el('h2', {
          id: 'banmessage',
          "class": 'warning',
          innerHTML: "          <span>" + reason + "</span>          <a href=" + BanChecker.url + " title='Click to find out why.' target=_blank>Click to find out why.</a>",
          title: 'Click to recheck.'
        }, $.on(el.lastChild, 'click', function() {
          if (!Conf['Check for Bans constantly']) {
            $["delete"]('lastBanCheck');
          }
          $["delete"]('isBanned');
          this.parentNode.style.opacity = '.5';
          return BanChecker.load();
        }));
        return $.before($.id('delform'), el);
      } else {
        return Banchecker.el.firstChild.textContent = reason;
      }
    }
  };

  CatalogLinks = {
    init: function() {
      var a, el;

      el = $.el('span', {
        className: 'toggleCatalog',
        innerHTML: '[<a href=javascript:;></a>]'
      });
      $.on((a = el.firstElementChild), 'click', this.toggle);
      $.add($.id('boardNavDesktop'), [$.tn(' '), el]);
      return this.toggle.call(a, true);
    },
    toggle: function(onLoad) {
      var a, board, useCatalog, _i, _len, _ref;

      if (onLoad === true) {
        useCatalog = $.get('CatalogIsToggled', g.CATALOG);
      } else {
        $.set('CatalogIsToggled', useCatalog = this.textContent === 'Catalog Off');
      }
      _ref = $$('a', $.id('boardNavDesktop'));
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        board = a.pathname.split('/')[1];
        if (['f', 'status', '4chan'].contains(board) || !board) {
          if (board === 'f') {
            a.pathname = '/f/';
          }
          continue;
        }
        if (Conf['External Catalog']) {
          a.href = useCatalog ? CatalogLinks.external(board) : "//boards.4chan.org/" + board + "/";
        } else {
          a.pathname = "/" + board + "/" + (useCatalog ? 'catalog' : '');
        }
        a.title = useCatalog ? "" + a.title + " - Catalog" : a.title.replace(/\ -\ Catalog$/, '');
      }
      this.textContent = "Catalog " + (useCatalog ? 'On' : 'Off');
      return this.title = "Turn catalog links " + (useCatalog ? 'off' : 'on') + ".";
    },
    external: function(board) {
      return (['a', 'c', 'g', 'co', 'k', 'm', 'o', 'p', 'v', 'vg', 'w', 'cm', '3', 'adv', 'an', 'cgl', 'ck', 'diy', 'fa', 'fit', 'int', 'jp', 'mlp', 'lit', 'mu', 'n', 'po', 'sci', 'toy', 'trv', 'tv', 'vp', 'x', 'q'].contains(board) ? "http://catalog.neet.tv/" + board : ['d', 'e', 'gif', 'h', 'hr', 'hc', 'r9k', 's', 'pol', 'soc', 'u', 'i', 'ic', 'hm', 'r', 'w', 'wg', 'wsg', 't', 'y'].contains(board) ? "http://4index.gropes.us/" + board : "//boards.4chan.org/" + board + "/catalog");
    }
  };

  CustomNavigation = {
    init: function() {
      var a, i, len, link, navNodes, navigation, node, nodes;

      navigation = $("#boardNavDesktop", d.body);
      navNodes = navigation.childNodes;
      i = navNodes.length;
      nodes = Conf['Append Delimiters'] ? [$.tn("" + userNavigation.delimiter + " ")] : [];
      while (i--) {
        if ((node = navNodes[i]).id) {
          continue;
        }
        $.rm(node);
      }
      len = userNavigation.links.length - 1;
      while (i++ < len) {
        link = userNavigation.links[i];
        a = $.el('a', {
          textContent: link[0],
          title: link[1],
          href: link[2]
        });
        if (a.href.contains("/" + g.BOARD + "/")) {
          $.addClass(a, 'current');
        }
        nodes[nodes.length] = a;
        if (Conf['Append Delimiters'] || i !== len) {
          nodes[nodes.length] = $.tn(" " + userNavigation.delimiter + " ");
        }
      }
      $.prepend(navigation, nodes);
    }
  };

  Navigation = {
    delimiter: "/",
    links: [["a", "Anime & Manga", "//boards.4chan.org/a/"], ["b", "Random", "//boards.4chan.org/b/"], ["c", "Cute/Anime", "//boards.4chan.org/c/"], ["d", "Hentai/Alternative", "//boards.4chan.org/d/"], ["e", "Ecchi", "//boards.4chan.org/e/"], ["f", "Flash", "//boards.4chan.org/f/"], ["g", "Technology", "//boards.4chan.org/g/"], ["gif", "Animated Gifs", "//boards.4chan.org/gif/"], ["h", "Hentai", "//boards.4chan.org/h/"], ["hr", "High Resolution", "//boards.4chan.org/hr/"], ["k", "Weapons", "//boards.4chan.org/k/"], ["l", "Lolicon", "http://7chan.org/cake/"], ["m", "Mecha", "//boards.4chan.org/m/"], ["o", "Auto", "//boards.4chan.org/o/"], ["p", "Pictures", "//boards.4chan.org/p/"], ["r", "Requests", "//boards.4chan.org/r/"], ["s", "Sexy Beautiful Women", "//boards.4chan.org/s/"], ["t", "Torrents", "//boards.4chan.org/t/"], ["u", "Yuri", "//boards.4chan.org/u/"], ["v", "Video Games", "//boards.4chan.org/v/"], ["vg", "Video Game Generals", "//boards.4chan.org/vg/"], ["vr", "Retro Games", "//boards.4chan.org/vr/"], ["w", "Anime/Wallpapers", "//boards.4chan.org/w/"], ["wg", "Wallpapers/General", "//boards.4chan.org/wg/"], ["i", "Oekaki", "//boards.4chan.org/i/"], ["ic", "Artwork/Critique", "//boards.4chan.org/ic/"], ["r9k", "ROBOT9001", "//boards.4chan.org/r9k/"], ["s4s", "Shit 4chan Says", "//boards.4chan.org/s4s/"], ["cm", "Cute/Male", "//boards.4chan.org/cm/"], ["hm", "Handsome Men", "//boards.4chan.org/hm/"], ["lgbt", "LGBT", "//boards.4chan.org/lgbt/"], ["y", "Yaoi", "//boards.4chan.org/y/"], ["3", "3DCG", "//boards.4chan.org/3/"], ["adv", "Advice", "//boards.4chan.org/adv/"], ["an", "Animals", "//boards.4chan.org/an/"], ["asp", "Alternative Sports", "//boards.4chan.org/asp/"], ["cgl", "Cosplay & EGL", "//boards.4chan.org/cgl/"], ["ck", "Food & Cooking", "//boards.4chan.org/ck/"], ["co", "Comics & Cartoons", "//boards.4chan.org/co/"], ["diy", "Do It Yourself", "//boards.4chan.org/diy/"], ["fa", "Fashion", "//boards.4chan.org/fa/"], ["fit", "Health & Fitness", "//boards.4chan.org/fit/"], ["gd", "Graphic Design", "//boards.4chan.org/gd/"], ["hc", "Hardcore", "//boards.4chan.org/hc/"], ["int", "International", "//boards.4chan.org/int/"], ["jp", "Otaku Culture", "//boards.4chan.org/jp/"], ["lit", "Literature", "//boards.4chan.org/lit/"], ["mlp", "My Little Pony", "//boards.4chan.org/mlp/"], ["mu", "Music", "//boards.4chan.org/mu/"], ["n", "Transportation", "//boards.4chan.org/n/"], ["out", "Outdoors", "//boards.4chan.org/out/"], ["po", "Papercraft & Origami", "//boards.4chan.org/po/"], ["pol", "Politically Incorrect", "//boards.4chan.org/pol/"], ["sci", "Science & Math", "//boards.4chan.org/sci/"], ["soc", "Social", "//boards.4chan.org/soc/"], ["sp", "Sports", "//boards.4chan.org/sp/"], ["tg", "Traditional Games", "//boards.4chan.org/tg/"], ["toy", "Toys", "//boards.4chan.org/toys/"], ["trv", "Travel", "//boards.4chan.org/trv/"], ["tv", "Television & Film", "//boards.4chan.org/tv/"], ["vp", "Pok&eacute;mon", "//boards.4chan.org/vp/"], ["wsg", "Worksafe GIF", "//boards.4chan.org/wsg/"], ["x", "Paranormal", "//boards.4chan.org/x/"], ["rs", "Rapidshares", "http://rs.4chan.org/"], ["status", "4chan Status", "http://status.4chan.org/"], ["q", "4chan Discussion", "//boards.4chan.org/q/"], ["@", "4chan Twitter", "http://www.twitter.com/4chan"]]
  };

  Emoji = {
    init: function() {
      this.icons.push(['PlanNine', Emoji.icons[0][1]]);
      return this.icons.push(['sage', this.sageValue(Conf['sageEmoji'])]);
    },
    sageValue: function(check) {
      return (check === 'appchan' ? 'A4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=' : 'A4AAAANCAYAAACZ3F9/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAa9JREFUKFOdkt0rg2EUwM95b2zlL0CRRLngksznXrJsNtYW1tjYhM3mY6+IXZAbikhTKJp8XZAp81UmWYhIRHHhUi60e7s6ntdCa2449es8PfU7z+k5B6AbyuE/wQlc4BcO2d06unAUBCgFE0hianOd3NHIcy8NPwrUf9NBPZcOEi7ayXZiea/1V7+ljaXeYAfOgg2So2TOwQWGnwQafOgi962TnMFmatozUeNu4yetASspVvgXiUvii5K5Nm6z56ol3Hdtpy+cwSYy+HRUt1nLsoEato0kXyh6wTac+24brThWv6MNOYNW9prlG/uxmbRrFaT0VrCspZoNPSUNJNyCBcoiLZuhLH0o9U6UrAfGKCz7RlLM81Q8XUwqr4oKPLIQmnA8IupBigacVy7yrya/2JouhryJHJJNykg+UxLGOtz6+SQNpEiMcduls4Wvoli9WklVKz+ol5SU4U6ngql8Qj2eRI+GyajBhSRH4r3cUxhSeRVhsYBmWUWiyM+UMDmDUI2nsfuSC1I27nLgYZJlP8jhjJ3PY8iE+L8tWx4kQC6MQA5b1D9HNiRCFhx8AF/e2qh92VnKAAAAAElFTkSuQmCC');
    },
    icons: [['Plan9', 'AwAAAAPCAYAAAGn5h7fAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAzE15J1s7QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACAElEQVQoz3WSz4sSARTHvzMjygpqYg3+KIhkE83DKtKlf0C9SrTRuZNEx0VowU6CuSeJNlwwpEO2kJ6SQBiIUAzFjRDF4wrjKosnGx3HmdehFDfpe/2+z/s++D5gU7IsEwRByICIiAEAIiIAYAFAXsjYVr/fLxMRNVvN+prJ5/OA3+/XERFNf02JyeVyDx0OxyvLNQsnimLKfcf9KRQKXQAAnE6nlf5qMpnQycnbP/kAoKoqsSwLAJhOp+AAwOv1otvtpqxWq73dbt/r9XqvEQ6HUalUEvF4XLd5IpvNZqlerzd5nlf6/f6tTCZjBACk0+nb+XxeW4UrikLJZPImAGA0Gq0NIqJyuSyyANDr9Q5Wu1utFvR6/SULAI1G4+vK8Pv90DTtGwsAJpPpaGUYDAZ0Op3PHAAEg8H3tVqtbrtu21sqyxuRSOQJk0ql9IvF4r7b7f7pcrlejkaj57IsH58Pzp8dvjhc/lsBk0gkbLFYrFqtVvd27+4qOk733ePxPDCbzVBVFfP5fCiK4rvhxfDN/qP9wSasGwwGMv1HiqJQsVg8ZlfTHMepkiR1t05gGJBGmM/nMBqNj9nN9kql0lNN064ARISzH2cQBAGz2ewLu2na7XYLwzBbvxYIBBCNRrFj3BmsAZ/PZ+J5/kOhUIAkSVeA8XiMZqt5efrx9OA3GfcgvyVno9cAAAAASUVORK5CYII='], ['Neko', 'BMAAAARCAMAAAAIRmf1AAACoFBMVEUAAABnUFZoUVddU1T6+PvFwLzn4eFXVlT/+vZpZGCgm5dKU1Cfnpz//flbWljr5uLp5OCalpNZWFb//f3r6+n28ff9+PRaVVH59Pr//vr38vj57/Dp7eyjn5zq8O5aVVJbYV9nVFhjUFRiWFlZVlFgZGOboJzm5uZhamfz9/bt8fDw6+drb26bl5j/8/lkX1z06uldWFS5r61UT0tfWlbDwr3Ew76moqNRTU7Mx8P75OpeY19pWl1XW1qzr6x5eHaLiojv7+1UT0xIU0uzqadVS0nV0MxkZGT5+PPk497///ra29Xq5eFtY2H28e2hnJignJlUUE1dXV2vrqxkY2FkYF/m3d5vZmfDuruhl5aZlJHx8O75+PZWVVP29vT/9fTj3trv6ubh5eRdXFqTkpBOTUtqZmX88/RMQ0T78vPEvr7HwcHDwsDq6ef///3Gx8H++fXEv7tZWVedmZZXXVudnJp0c3FZU1f79fnb1dlXUVVjXWFrZmy8t7359/qLj455e3q4s69vamZjX1zy4+avpaReWFz/+f1NR0vu6Ozp4+f48/lnYmi8ur3Iw7/69fHz7+xbV1SZmJZVUk1ZV1zq5ez++f/c196uqbDn4uj9+P7z7vRVVVXt6ORiXl/OycXHw8CPi4ihoJ5aWF3/+v/k3+axrLOsp67LzMZYU1m2sq9dWF5WUU1WUk/Au7eYlJGqpqObmphYVV749f7p5Or38fPu6OpiXFz38fH79vLz7urv6+hhYF5cWWKal6D//f/Z09Xg29exraqbl5RqaW6kpKTq5uPv7Of/+PDj29D//vP18Ozs5+OloJymoZ1ZVVJZWVlkYF2hnpmblIyspJmVjYKQi4enop5STUlRTUpcWUhqY1BgWT9ZUjhcV1NiXVkkhke3AAAABHRSTlMA5vjapJ+a9wAAAP9JREFUGBk9wA1EAwEAhuHv3dTQAkLiUlJFJWF0QDLFYDRXIMkomBgxNIYxhOk4wwCqQhQjxgxSGIsALFA5BiYbMZHajz1oJlx51sBJpf6Gd3zONcrqm/r1W8ByK0r+XV1LXyOLLnjW6hMGpu0u1IzPSdO17DgrGC6AadrVodGcDQYbhguP6wAvAaC0BRZQalkUQ8UQDz5tAof0XbejOFcV5xiUoCfjj3O/nf0ZbqAMPYmzU18KSDaRQ08qnfw+B2JNdAEQt2O5vctUGjhoIBU4ygPsj2Vh5zYopDK73hsirdkPTwGCbSHpiYFwYVVC/17pCFSBeUmoqwYQuZtWxx+BVEz0LeVKIQAAAABJRU5ErkJggg=='], ['Madotsuki', 'BQAAAAPCAMAAADTRh9nAAAALVBMVEUAAAC3iopWLTtWPkHnvqUcBxx5GCZyAAARERGbdXJrRUyGRUyYbY23coZFGDRFGEYfAAAAAXRSTlMAQObYZgAAAGhJREFUeF5Vy1kOQyEMQ1Fshzd12P9y61AixLX4yJFo1cvVUfT23GaflF0HPLln6bhnZVKCcrIWGqpCUcKYSP3JSIRySKTtULPNwMaD8/NC8tsyqsd1hR+6qeqIDHc3LD0B3KdtV1f2A+LJBBIHSgcEAAAAAElFTkSuQmCC'], ['Sega', 'CwAAAALBAMAAAD2A3K8AAAAMFBMVEUAAACMjpOChImytLmdnqMrKzDIyM55dnkODQ94foQ7PkXm5Olsb3VUUVVhZmw8Sl6klHLxAAAAAXRSTlMAQObYZgAAANFJREFUGJVjYIACRiUlJUUGDHBk4syTkxQwhO3/rQ/4ZYsuymi3YEFUqAhC4LCJZJGIi1uimKKjk3KysbOxsaMnAwNLyqoopaXhttf2it1anrJqke1pr1DlBAZhicLnM5YXZ4RWlIYoezx0zrjYqG6czCDsYRzxIko6Q/qFaKy0690Ij0MxN8K2MIhJXF+hsfxJxuwdpYGVaUU3Mm5bqgKFOZOFit3Vp23J3pgsqLxFUXpLtlD5bgcGBs45794dn6mkOVFQUOjNmXPPz8ysOcAAANw6SHLtrqolAAAAAElFTkSuQmCC'], ['Sakamoto', 'BEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAxVJREFUOE+Nk19IU1EYwK+GQQTVQ39egh6ibKlzw91z7rn3bvfOmddNszl1bjKXc5rJJGmBUr7Yg9qTD0IalFgRBEYg6EDQQB+GovQyQgiaUZsoLcgHMcr069w7MgcGXfi453zn+37fv3MYZt/n99e76tzVj4JN/hP79fvXnV3hnNabwUBjoOHcgTYOu/JQspgTzsqKgn9BfD4vkWTzur287PqLVy+zM+yePB7KsRXLywTjnSpnZctBkPCdW8ccDuU55vBO8RXbkC/oP5ph19V5+7LIky0OY1BKbZEbLcFSt7u6pN7jLmltCVrr3DV5jY3+KovFEsccB1KJNVpefe10BqS2tqqO4/AuphBB4L/LkrRqNgtJs1lMypLls1kU38mytMLz/E8VIlutqVqX6/weZG52OttRXjbE0cP/FYLRlpVjDXuQ/r77x2XZPKkCHA4HBAIBkCQpAygIAvh8Pu2MZgO0Lz+QSa/sQfwN9RfpVN66XC6Ynp6GhYUFGBwczAC1t7fD0tISxONx6O7upgHILmsqvLcHodOggfiV/v5+SCaT4HQ6IRaLgdfr1bIRRREmJyfBZrNBNBqF+fl5sNsdgE2GiAbp6bmbdbXC7qWQbxMTE7C2tgY6nQ5SqRSEw2ENopaoZpCXlwdTU1NaoECgCbgiU6y8QH+ECYWaTymK7TWdys7MzIwGaWtrg42NDejo6AB1WjU1NZo+FArB2NgYrK6uQrAlCASxn2z6wkuMp87VIAhkE2MEAwMDkEgkYHx8HBYXF0HtkQpRy1BLiEQisLy8rPVNKSsFjEzrXH4+z1hlS4xDhKadNu7t7YPR0VHweDzAEVWfHru6HxkZgeHhYVAURYNjkylVWKArZjjMzqmdVi+QCsLUkQiEjvDvncEkvU7/qQ0Vgukeo48Go87IiCJnZNmipxiz7wXEbVDnbUxQOgM12h9n6qTq6NvapRdtkwaP0XK8RmPuYSbxYfaQ/sJJhjfknuFRURUi7AMOozcCwl94hLZp5F+EioDQVwqYI6jomZU1NFtM+rOSxZjVazcyvwHr/p/Kws1jegAAAABJRU5ErkJggg=='], ['Baka', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA0pJREFUOE91k3tI01EUx39JOpA0H4jNx0pbD3XTalISWf8YFlEgldqDsBLLyqjEKBCiLLWiggh6/KEV1WZ7OaelLZvDdDafNW1JFraWe/32+01FrUZ9uy4ylLpw4Z5z7/nc77n3HIqaMRIjZJyEcNX+uFCFeGmI/GZciEIsCFJUTvoAzDz+1y7K76MSwhX5hXl6z+WSbrzU2KB8YEGDwgrTaxZ3b7xHcaHhR3xw7Z5/UviB1ReP5XSg3+TAqYJOxMzWISFIC0GQDomhTVA9skCnsaAwp/vnMq66dBokNuBR9uFd7T9Z1zCunjci0qcRJUVdoJ3DYOhRnC/qBZ+jQbfeCc+37yjY2UEg0iwvJE0k9l8Z+8xqHmTgot0QLdQgTaQFQ2AsOzlHvOu1S5pwOLsHHo8HjHMCq2MazNvTlByKHyrJLDvdR25jMWRxYx5HjeMH2r1BDOOeguRua4OI14jx8a8YH5tA+al3EHKlW6mYOapb2oZBOOwMbEMseAE12L+jjUh3w+VipyAZ65oxn1NP/GMYGR6Ftn4Qsf7qa9S82Y/l/X122G0uL2TbxmZEz1WhXW8mUol8moXu+SCi/OoQ6VsDh3UUwyQ1k9GOaI5MTkX4yWTGHutvgI1F28sviAlRgxeoRm62HvsyW8En9pZ1TYgi6TntoyQtFm86rVgUoJZRvDnKMmXVAGxWmkAYOBwudBqGcHCvHulrGpGT2Uy+z4yT+QYsCXtCUpp8GxbKhx8gDK0ro+KjJGvzdjfDZnN6VdisLD5/JjArQ2zW66PJOj2lEZtStaBphkwah7K6kMJ/GEulp1bMWhAmMbTozOQRaWRtfoZVgjo4iRra4SYgGi26TwjxVeDKhR7Y7U606ixICq9tr7hd7+OthRWL7yUnJ1WPmXotqLhpRICPHCePtuFV6xdUPTAhcWEtRHEqfHpPyto4hPXLXnzflSEJnFaN3OCKDcsFsrEntR9RUmxARLAUgT5iBPuJsXWDBj0dZjRU9yNV+PTbpjTp9OA/pOSk24nRkXf1J462oPxcJ65f6ULlHSMulepRerYDgvj7A0cKpNz/tyTZqbzXO4t0ZZGQJ34RH11lFHIlA8LIqreCCMUZRY3cd2bwL/5/RmjNSXqtAAAAAElFTkSuQmCC'], ['Ponyo', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAuNJREFUOE+Nk3tI01EUx39BTytConQTt1am07m5abi5KT5S8z2dj1yOEMUC7aUgIoimlmUEWX9kBZGWaamEmE6U1BI1XNPNGTrnHs33IwuSXrL4NgcJ0mNdOHDh3PPhnPP9XoKwcroJYvMQiRSicHCQKCgUyZC9/T5rNet5KUFs0zCZbZMsFmZ9fTEjEEBDp4/KSSSb/4JoGIyWaTYbiykpWEhOxhSHAzWD0aqkUGhWAcVkW58xlvuPhfh4zItEmOHxYDR3MhcdDaNAsKJydAz5IySKRNjEUmy88vjOVaU8F0iPCqCNjEBHkC/UYaGYFwqxmJoKLYOhkxPElg0QsbNtTlmox9yjRD9UCbnoOR+J/lwRWtOCcdXfDc2BPpg0d7CQlIQZPh9KKlVkAQjJ2x2zmOSsQu7hpzUJfBhLjsNQmADjxcT10Bcl4rE4EHc5LjBEhEPn7f1WTqXSLQB/s1Tp7vslsoIkyPPiMJAbi86McBguiaHKjoEqR4jJy2K0nAxApzMN5iUGrclrKVaz2fUvuF4tRbxDKA90w5VjTFyLZKHpTBSq4/1QnxGB2qxoVIZx0JopRCPHFSNOThfWZzfrXDcZEowH4iA05ATg68hDtBaL0HAuCm3lJ9Bfcx2fFNUoi/DCjRgfNHHd1wCZA2TyXjNkE6F0cBDpPFiojeNi8EkJdFoN3vXch0nbBJOhDd907dANv8JITxNqziag3ZsJbUDAwLin50Q9QWwl1qSYoNOVvUcOoqOqAAa9Fu9H2/F9+B5WZLcwOyxFX18flLI+VASyMGVeoJHD+Tzq5BS1PoaKRrNT8127P74swsq4FCa9FKvqBqwaOiz3hdEuLKueYSyECT2LNW0eIfo3E/WmEbvnG1MUJnWdpWhDGDvxQXZHo+RR0uW2tnv+auPX+TvtJm7zKpaen/4y2yjBUlcxlvtvmvT16ZWDpQeoVv3/60F/NrHjTf4ugazIXtJ8ivjnz/sJ+yGQRjcqUdIAAAAASUVORK5CYII='], ['Rabite', 'BIAAAAQCAYAAAAbBi9cAAAD/0lEQVR4Xl2MXUxbdQDFz/9+9Lb3tkBLCxTKhzgoOOZAsokbJmZxDFHnd+LL4hKVzBgfNCY++ODbjDEaZowvErOM6HRu6hKZY2rIAOkCY4OSDTpFaAsrlJa2t5+39+NvjT7tnJzknIfzI98Nf/C6TuXdguWBd1q9rcb8/CwsZiu2Ywm4nDVo3VWLZCKDaDwJq9mCg31PgjAMKKUwmcyYvTbek9iJRDm6M/XswEDjwNz6plWW6wdZhjUAintFCEEhn0N04zYskljaDLaj8ar49oUrsYR6mrFJNj322w46H8y+mitM/ZJKZmyE4XAvjJSsazpyuSzslVZIkgWKOvvRgQ6Xrdlhqmds7o7bFZoLkctreKxf7GtuCE7IyUQjBQcQ8j/lvxCGQJZz0IoCVpamTtzfIh9nwiaIrCQyjNg8mq11oDLUhNXRJfT1Ozr3tS/PqpnQ80qRgjAmKIqBfK4ItbSLKoOZqR/6neLkENlSUAIhlktvEf+sD2rkm8nWTHtvZCGMVON1ePuaoBER31/MXGly1wSqq9Uug6FluYyWXJiPqFXmjd4Dh9oF9ZKKimYXRtYCx8lmMIDIxlIPGz591av0mtanF7FcCEN6iMXeox2wOJ0QJAmUAoRQaIqCnWAQY1/ewKNGNeQuYXkm0d2NC2e+wvmRr/Hx+6+8PHayrbDyyQBNDb9As3PHKDWG6MTM23RoeJAWsqeoWvyUUv0UHf7pBB0fe4OeeXe3/vmHbx3+8dwIGJ4IsFpMMFe0fbtAn+nwZePr1u4MBK8XIALG/Rt479wYrs2vgeNNAMNgMbiNzybuoKVvn+Gs9kbr6qpBfJfGYHFIkJUCoGwfqcoMX/b27EGhwgOjoCADDlP+CA51ugFFRzoB8FYNaQ1oqKD44+eNL+wNj7zJGQSIhe8+jgQ9thk+27v/KRY6L4FSCkVOwtlQj6P73Qgt/o1ERoKt4iUkE7+jrZMHyzIoK9cOBFfT4LbWAk+0a7ZLnvqHcTNdACgFScfAcjxEdy00VQclHGo7dqGeYxHbvIo6hwhSghCehb3G5p6eW7VxXC5/xGWToMgrKKoaCnIalI9CIARasQAqloMI/x4BWrLLYwE1AEPTwCGHaGjz7pw/leZUNV8wNm9BLy6CxsvxZ1kMbaY4TKIIXlNBsynoVjvAC4CuAoYOVi+CMfLYCUfg95tPHuzZB0YtKzsb58RMucWE/fZmhCbdOP9rNnLnxko6GVoB8lFwyVVw8b/AyeulHoJyN4Rb19dTFyeqBlu6njvfsWcvOJvLs7DMmw/7bvpeE4pU2OIcgcqmp4fGAgt2Txwvqr7lTp5V7LquZxXC6+BqEvGcY5pyjaM1tffJbk89NE3FP5VQ6y7a+paZAAAAAElFTkSuQmCC'], ['Arch', 'BAAAAAQCAMAAAAoLQ9TAAABCFBMVEUAAAAA//8rqtVAqtUQj88tpdIYks46otwVldUbktEaldMjldM2qNcXk9IWktQZkdIYlc8mnNUXlNEZktEZlNIYktIWlNMXktE7o9klmdMXktFHqdkXk9EWk9EYk9IlmtQXlNEXktAWk9AWlNEYlNFDptkZldMYk9E4otg/p9kXktEXk9AXlNA4otclmdQXk9IYktEXlNEwn9YXk9IXk9FFp9o3otgXk9FPrdwXk9E2otdCptkXk9E/ptkcldIXk9Edl9IXk9EjmdUXk9EXk9EXk9EbldIcldIjmdMmmtQsndUvntYyn9YyoNYzoNc0odc1odc2odc6pNg7pNg9pdlDp9pJqttOrdzlYlFbAAAARXRSTlMAAQYMEBEVFhgcHR0mLS8zNTY3PT4/RU1kdXp6e3+Cg4WIiYqMjZGXl5mbnqSnrbS3zMzV3OPk7Ozv8fT29vf4+fz8/f7SyXIjAAAAmUlEQVR4XlXI1WLCUBQF0YM3SHB3a1B3l7Bx1///E6ANkDtva0jKbCW2XIH1z2hiZEZ4uUgxo7JedTQye/KN/Sb5tbJ+7V9OXd1n+O+38257TL+tah3mADAwSMM7wzQWF4Hff6ubQIZIAIb6vxEF4CZyATXhZa4HwEnEA+2QgoiyQDnIEWkjVSBBZBqXbCRlKYo8+Rwkyx54AOYfFe7HhFa7AAAAAElFTkSuQmCC'], ['CentOS', 'BAAAAAQCAMAAAAoLQ9TAAAB5lBMVEUAAADy8tng4Ovs9tnk5O3c7bX44LLduNO1tdDh7r/eutj43q2kocX23az07N+qqsvUqcmXl7331ZXJj7r40o/Pn8T42qP63KjNw9n21p3Y387Ml7732JzR55z05MSxtMLGn8TC4Hx8eqt8e62Af6/B4HnG4oPC4HzH44fBf7LCgbOkoMTcsrmtn8PWqcfFtKrj4Jvs2ZOz2FnMqLXT3KfY5p60Z6NUU5XRuqHzwWSywqDn3JaiiLWahrWhkry5zJjRmqm1Z6P1wmb1y319fK632mK5cKi5nH+73Gu73Gy73W283W+9eK17e6y1yZS3aqRZWJdcW5ldXJplXZppaKBwb6VwcKV5eKswL306OYNPTpGkfK+m0kGpUJWq1EnEqIuXK3+Xh7ahP4qhkryMfK6BgK+CdpGMaKKMa6O9ea2+eq6+oYW/eq+NbqWVlL2Wlr7AjanA4HnA4HrBkqbBlafB33rCgbLCmKjCxIzC1mSs1UytV5mtxIWt1lCuz2evWpuvXJywxYzHjrvH4oXIjrrN2HXO5pTO5pXUlYnUlYvVl5Hb0G7e0XTg03rhr5fpzHPpzXTp0Hvtz3/wrDHytknyt0zyuE3yuVHzvVr0wGP1x3T1yHf1yXe0ZaL2zYP30o730pD31ZeRIcF5AAAAQ3RSTlMAFBkbHEhJS0xMTk5UWWBsd4SEiIiPkJCVlZaam6CjpK29wMPDxMTFxcnK193e3+Dg4uTn5+fo6e/v8/P4+fn7/P7+J4XBAAAAAOBJREFUeF5Vj1OvAwEYBb/yGlu717atLW0b17Zt2/6nze42TTpvMw8nOZCAmwUpiIY6c5IiLi9tPX64GairqszHQ4X2VB64v1Cs6PxMPJSdHM777s6/jyaMRGiRLyyrb88OpjZ3CzAXrm1sqzSNNeN7kVBPNgB7cG51abE5l9cXDces7emQ1uadHhutFUg6gpPKkSIqQGavwz7r7O/+/3t/rSdjI9XDM3qz4fr3B/3iA0aJTG9x71+9oR/PLDwUe2wm19bly+fTIxHyEETatbPewGEw6Mk/tKZCEqSQQUlIHB/QNBEjjVN1AAAAAElFTkSuQmCC'], ['Debian', 'A0AAAAQCAYAAADNo/U5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAZ5JREFUOE+Nkk0oBHEYxv8fu5GQj3JwcaDkIAc5IpR87M7MKnIVJVKclaIQ5Sy5OLkgR7n5OigcSNpmd2c2Vyfl4KT8/muWiVU79TTv+7zv837NCBF6PG1X+NpZyEYSD9mIc+tHnBPe23B9xKrCuTmbQA/JKfABrhBswa1hH4A38IwfOxPdX1qcjiCQxO5NyrjKV70TnSbeRPwJvGN3i4yyqnEucPY8ZZX9GSEgGK+RvFfyjk2VKZxzBNG8wJWWgh/xtDOeUXZ7Slr6TrSLYL9N4SMgYTTcwdc2ArvJcElhSVcM6mCNSV8n9hA59yTU5UWMG6HIbLhIWlglgWiC2L4Z79qTdo40D6ISuOWwKCWHyk9Fv8ldpUHOuGTuynwSBUynddPdlbEosVpP9Eu4FnOsRzUYNTsdmZN/d5LDiqM0w+2CMdAFFsFGWgfXxZnheqe/z+0puwEM0HHYV3Z9Sgz8TEz7GkQvpuJ/36ggj2AaHLrSlkULWV5x+h2E8xkZL16YVjGNaAUscfZ/f6c/k9ywLKI2MMcRWl0RLy007idmRbQJ7RIfDAAAAABJRU5ErkJggg=='], ['Fedora', 'BAAAAAQCAMAAAAoLQ9TAAABPlBMVEUAAAApQXIpQXIpQXIqQ3UpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIqQ3QpQXIpQXIqRHYpQXIpQXIqQ3QqRHYpQXI8brT///8uTYMpQnM5Zqg5ZqnS1+I4ZaY4ZactSn8uRnYrQ3MrRXgsRHUsR3s8bbM8brMtSX4wUosxVI01XZw2X50vUIguToQvR3c6X5o6aKs6aq08Un8qQnM9VIFDWINJXohKcKlXapEqQ3UvUIc2X55bhcBdcJVgcpdhfapmd5tuk8dxgqJ1hKR5jbB6iah/m8Shudq3v9C4wNG/x9bFy9nFzNnFzNrIz9zK0NzK0t/O2+3P1eA2YaDU2eTb3+jb4Oje4urj6fHm6e/s7/Tz9fj3+fz7/P38/f3+/v83YaEa/NNxAAAAHnRSTlMABAoVGyY1SVlpeIuQsLfDzdHW4+3y8/b39/n6+vr4+ns8AAAAyklEQVR4XiWN5XrDMAxF75KOknYdZJS0klNmHjMzMzO9/wvMcH7I37mSJShsJ+5NjMT6umDoHyXDcI/2qJadh++P3cle1de+9yPe3/bTY92wzfzr7wGtP3JrAI72BZGVtcAdQlwHy+JS1pDbBE9qamZF3BYrjQxPEXwKc6dC8bXFm0QIpmt8kn0Rn093q82UCtK8oXZckwFJzuulV8bHkajPyXdbnJnARfDHs0trz+JQ+5AFvzp/L0+cL2qPAINUPrq5OC6p/64F/AMnrST+Dq/r7QAAAABJRU5ErkJggg=='], ['FreeBSD', 'BAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAABIAAAASABGyWs+AAAABmJLR0QA/wD/AP+gvaeTAAADXklEQVQYGQXBS2wUZQDA8f83j33M9rF9d7u4loaWklaDpkSo9KDGaIKUaGxshD2YSPRiuDVeTDyhBxosJCoa40ktpAkPDcUqAYVIpUSUPrAulEdD2bbb7e7ObGcfM/P5+4kwKDvq6yJ1FYYcvb+YAkqAHo/HQ7FYrFIoCiurq9ZXJ06YSOkA+kBzfX06bys3zHxS9EL0tXDVyZfefacqV+X/ZSJx5+qLbx98LhaL9RiGEZWlEsWC/Thd9q6Pf3vs2u6Orc83rFsvTwwfLf5obgywT1Vjh2Hh+rbNsnTssJdNLedK5aIrpSuldKVXKsnH4+Pyn6FDXn5tMef9O+3NvdkvP1V4+EYw2AoQ+KSx8dRYS6NXXnwovaItXduSrrkinWxGOmZWJi9OyOK9m1LmsjIz9IH8QUMOd3WfAQwNKCy2tJwbHB5+XasPaxIHmc4g7WWEZ1MquBiRFlJTf1E7+Tl/H/8asavPzTY1nWd2ZkMDRPeBeHPz5ojwsilEQCBvTSKunCF3M8FSNkBGVTHDYYrLj8jVNhDZ2SMa2zo3MTamaIC/u6Ojr3DtrOrvP0BpdATnyBeIhTxpR5ABUlKSUlXS1dWstbVxdz6hPL0l1quGqkLaKwNvVcjEXNRd/4mit4Z19DjefBEPyCKxgQJQcF28dBrHNDGTSZSezsjeff0hraa2Vs2vrvit81O4vj9xLJcC4ADrQA7YAGqBGsAql/EtLdFQE/L7dF1XZmdnSrbPMJfXoLDmolQK8gJyQBowgQhQDRQBD+hsraVhd4e5MH+/oExfvWLJ9q3/3S7qMpNH2hsS40kFS4EUUAMA2IANRIBXv4uzuO67c2PykqkA5YmZ6bN18YPi0Yoknxc4AsJPCMLVAk2BLKDosCWqs/PZaulkuxk9fekcUBAAQGDks5FT0W++3NuYuC0DVUL4DIEdlIQDAj0IRkigaMjArkFx0tf523sffrQHyKsAgHPhwoXLL+yP9/kePNhk5ExUTyKFkJVAUAiCFZrQup4Rv9ftuLV/6ONBYBVABQAArMvJ5MXW7duD6P62sD8UrPAFRU1TpeCpCnGvPZr7WW///v0jpw+VC9ZdAAABAAAAAMLo7drWrmQyPWG/r8tnaGIjaM05ujr16x/ZBFh5AACA/wGZnIuw4Z4A3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMi0wNy0wNFQxMDowOTo0OS0wNDowMOPVpFwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDctMDRUMTA6MDk6NDktMDQ6MDCSiBzgAAAAAElFTkSuQmCC'], ['Gentoo', 'BAAAAAQCAMAAAAoLQ9TAAAB9VBMVEUAAAD///+AgICqqv+AgIC/v9+Ojqqii9GAgKptYZKQkOmPj/ddUYBgW4eVjeCTgfiWjO5wbJaZkvPBvepkXomYkNldV4Bzbpl6dJ+Uj7ynoO6Vi+1qZI63se2mnudjXYjOy+GCfaqZjvWlm/Pc2e+Oh7NeWIOWjfeXjeW1sd+gl+diXIfp5/KHgKnn5/F2cZx6c6ZgWoXc2e6dltrAvNu0scrX1eTOyujCvup4c5qpovVpY43///+6uPPJyPXq6fvm5vrz8/z8/P7+/v/d3PixqvmxrPSyrfe0sPO0sfS3tMve2/3r6vy6ufPz8/3d3fi3tM63tPO4tsu5tsu5tvO6tfe6t/Vva5KRjKy7tvW7t/W9vPO/vM+/vvPCwfPEw/TFwvTFxOfGxfTGxvTHxvTIx/TJx/aTiOrNzPXNzfXQzfnRzuHS0fbS0vbT0uHU0e/U0uTU0/bW0+zW1ffX1vfY1/jZ2Pjb2/jc2uSTiemVkLSlnvbe3PTe3vng3fzg3f3g4Pnh4Pnh4fri4enj4/nk5Prl5Prm4/ymn/bn5vro5/rp6O/p6funoPWsqs3t7Pvt7fXv7vzv7v3w7/nx7/3y8f3y8v3z8vytqPWuqPX09P319P319P719f339v739/34+P35+f37+/+uqev9/f6vqvSwrPQAR0dcAAAAPHRSTlMAAQIDBAgJCwwVFyAsNUFHSVBneH+Bh4mVmZmanKCxsrK2tr3ExtDW19rb4ODl5u3t7u/w8/T6+/z9/f4MkNJ1AAAA8ElEQVR4XjXNw5aDURSE0YrRtm3b54+dtm3btm3bz9k3Wek9+2pSYFwT8ibzE93hwAtdJqK3nZo4J9hFXbP+vFHOthV6gnGzstZq94wdCs4UCCDymQ2v7X0LdYoSQ0MIENRYzJbRlPTTHu73ZNAL8vivmVui98PpzuqffX0mIPHJGtOQenukteJ+aS3b9htNpDnT9TeZH1bHAwBRMhGpd6e6uNrLoRgxBKmsX47nBlp678ojpEA40fejcmW4e/No0V8IIPfj6eKgbEJ3ZUnzgE1OqWp9Q3VeWRAsg51f1dZ8c31RmAsc+N5JGbG+zvj3BzDCPrzMDC9SAAAAAElFTkSuQmCC'], ['Mint', 'BAAAAAQCAMAAAAoLQ9TAAACVVBMVEUAAADh4eEAAAAAAAAAAAAAAAAAAAAsLCyXl5dgYGCnp6eTk5N3d3fBwcGqqqq8vLzNzc3Ozs7Ozs7Pz8/Pz9DQ0NHR0dLS0tLS0tPT09Pf3t/Pz8/i4eLb29vZ2drZ2tna2dra2trf3t/u7O/u7e/u7O/r6+vt7O/w7/Lw8PDy8fTz8fXz8fbx8fHz8/P19fb49/j49/n6+vuPxlmWyGOx437h9NDr9eD6/fj////+/v75/vTA5Jv6/fb7/fnL5bDL5q+AxjeDxUCEzTyGxUaGzjyHxkiHzz6J0D+Kxk6K0kCLyE2M00WNy06P00mSz1OUyF+W2FGX1FiY0F6Z02CZ21ac0Wiez2yfz2+f2mOh4GCi4GOi4WKi4mOk12+k3Wul32um1Hin0nun4G6n5Gin5Wmo23Op2Huq1n+q43Cr526s4Hit23+v6XSw34Cw34Gw6nWx4IKy4IOy44Cy63ez146z34az4IWz4YW03Y217nu38H2625e645G74pK83pu98Iq984W+4ZjA4px0tzDA5ZrB8ZDC5p7D55/E947F6KHF+JHH4qvH6qTI46/K5LLL5LN1tzLL5bN1uTDL57DM5bPM6qzM66/N5rTP6LbP6bTR6rfS573T67vT7LrV7r3X68XX7MHX773Y77/Y9rvZ8cHa7cjd88bi88/j8tTk8djk9tHm8trn89vo89zo9N3p9N3p9d7p9tvq9d/s+93s/dzy+erz+O73+vT4/PX5/fT5/fX5/vN1uzB3vTD6/ff6/fh5uTj8/fv9/vr9/vx8wjV/xDmrMRH0AAAAOXRSTlMAAAECAwQJDzk/RUlNU3F0kpSVlpeYmpucnaKjpKWqqqqtu8LExMTEzdTU1NXY4evy8vP+/v7+/v6LaR1mAAABD0lEQVR4XiXI03bEABAA0KltW9kaW3eSZW3btm3btm3b/q4mp/fxgqKOtpamhrqaqoqykrQYABh+PVMU9fjE5Xp8o54kgPHN0EBHU2N5YXZykiua0HHd2759VF2Sk5IYE5GGsmCEWLV1kVWwt5O+3x/qpgsy8k4ja+cJl2/v5C22tlgCAHtw9TQSa4s+AzfPSm0BRNl9SydhWJzLC567KrNhgrNwHIJ5qTz/2f9w7Jw/DNqIjVr04exW0AEOXcN3Ab7enr9eDW2VTJgehONyc2Z8XP5YdD0Tcuhcc4/r45OjGX51TEjYPbh8THRPvbz+CHusgSZlT7rP8PkCwfQKaQUi9Igr6JsRBMFiWZgb/AHKElRzKopZJQAAAABJRU5ErkJggg=='], ['Osx', 'BAAAAAQCAMAAAAoLQ9TAAABrVBMVEUAAAD///////+qqqr///+ZmZn///+qqqqAgID///////+tra339/eAgICoqKjx8fGMjIzm5ubh4eGPj4/g4ODIyMiAgICSkpKLi4vS1tbPz8+Xl5eMjIypqanIyMjW1tZ2dnbR0dGamprFxcV3d3d+fn60tbV3d3dcXFx3d3epqal7fHxxcXF+foCnp6hYWFhyc3Ojo6SMjI5fX196enp+fn6Li4xERERqamqgoKFpaWmFhoeen6A/Pz9QUFCWlpeSk5SUlZWUlZaOjo+Tk5RHR0cuLi5YWFgwMDAeHh40NDQ3Nzc6OjpcXF1rbG0XFxdSU1NVVVVXV1dZWVlbW1tnZ2lwcHABAQEEBAQXFxchISI+P0BISUpaW1xHR0kNDg4qKyszNDU1NTY9Pj8NDQ1cXF4XFxhSU1QSEhIDAwMrKywtLS4uLi4wMDFHSElISEggISE0NDVJSktNTU1FRUVWVlhGRkYEBAVBQUE0NTZQUVJQUVMFBQUqKitWV1lXV1daWlpaWlw+Pj8bGxtcXV9dXV1fX19fYGFgYGBkZGRlZmhpaWlsbGxwcHB2dna844Y9AAAAV3RSTlMAAQIDAwUFBggMDhkeICMkKCgqMDIzPj9ERFBib4CCg4iMjZCcnp+jqamrw83W1tvb3ePl6Ojp6+vs7u7v8PHy9PT09PT3+vr7/f39/f39/v7+/v7+/v50ou7NAAAA30lEQVR4XkXIY3vDYABG4SepMdq2bRSz/capzdm2fvOuDO397Rw0Ly4tz2QAQPbcxuZ2E/STJwfxPhWgG355fRrVAIVb1zeP9UDLfiSwkAcADe8fn7tFxWuEXFRDoer/OgoMTRBCumj8yJwPBo8Zhpk14U856/HI8n0ZUtpZ1udrSzfVneA4roNKjdrwpcMRilb8d8G60+lKnrpWcn9bO+B23w2O8Tzfq4aiNSZJqzn5O4Kw16h06fPZ+VUlUHfo97+VAEb7rSh2UgDd4/U+TBlQY7FMj5gBIGvcarVVfQPVPTG94D0j9QAAAABJRU5ErkJggg=='], ['Rhel', 'BAAAAAQCAMAAAAoLQ9TAAABj1BMVEUAAAD///////8AAAD///////8AAAD///8AAAD///////8AAAD///8AAAD+/v4AAAAAAAAAAAArKysAAAD///////8AAAAAAAAAAAAAAAD///8AAAAAAAAAAAD///8AAAD///8AAAAAAAAAAAAAAAB5eXn+/v5JSUnKysrS0tJ5eXmqqqqxsrL+/v4ZCgknJyeHh4eIiIjo6OgZCAdOTk7t7e3///8GCwwPAAArKyv19fX29vb9/f0EAAD////+/v4AAAAGBgYHAAAJAAAMAAANAQAPAQAVAQFyCQV9fX2pIRzmEQjn5+cBAAAFAAAAAADnEQjvEgn////uEQjyEgnsEQjzEgnxEgljBwPaEAj9EwnwEglHBQJHBQNNBQIBAAB3CQR5CQSHCgWLCgWRCgWTCwadDAWmDAapDAa/DgfKDwjWEAgGAADh4eHiEQjmEQjmEQkKAADoEQgLAQDtEQgMAQDuEQnvEQjvEQkPAQAfAgEuAwEvAwE8BAL1Egn3Egn4Egn6Egk+BAL+/v5CBQJrB0muAAAAT3RSTlMAAAMEBAkYGhsbMTRLUmpvcHeIjLe6vcHCxM3P0NbW3Ojp6u/w9ff5+fn6+vr6+/v7+/v8/Pz9/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+Q8UoNAAAAO5JREFUeF4tiwVPA0EYRL9SXIsWl+LuxfcOd2Z3764quLu788NZNrxkksmbDP2R7vH6GioLs+iffEzNXd4+TqPErUUpVqMOvwgdzMPn1rv5vPsVeufBTaBK/bH2FPvkEUuIG5jIIc+sHYn/HJ3dC/Hxuo4y8s44dzwBbFkisHN8bVIdXs6jb+H97aCwbHEIqgcml64CD7YllNkAVQC940MLYe5YzvIeQAXNrd19Roc5MdzfdQLUUKaUYyuG9I8y1g4gj6hIak4X5cBIT2MquZJrJdOqpY11ZpAiqVwbY/C7KY1cRCrZxX4pWXVuiuq/hs49kg4OyP4AAAAASUVORK5CYII='], ['Sabayon', 'BAAAAAQCAMAAAAoLQ9TAAABvFBMVEUAAAAcUaYdVKwAAAAAAAUABAwWRY4YSZYhZtIhaNYHDx0KCgoFDBcKCgoRMmYSNm0fXL0fXb8AAAAYS5gaTp8fXLwgXsEGBgYFBQUZSpgZTZ4JFSgODg4IEiIOJkwOKVIkW7EnXbQLGzUTExMKGC8LHjwMIkITExMiIiIPEBEPJ00QEhMXOXAaPncOJEgoXbApXbEcHBwwMDAEAgAfHRgQDgo3NC8AAAAHBwcKCgoLCwsJCQkaGhofHx8lJSUwMDA0NDQ4ODiRkZEICQocHBweHh4GBgYHCg8mJiYnJycpKSkrKystLS0uLi4ICAgODg43NzcRERF1dXUUFBSjo6O1tbUbGxsEBAMLGS8MDA0iIiIjIyMkJCQNDQ0NHTYKCQkoKCgPDw8QEBArMDkKCgkRERIREhMxMTEyMjISIz00Njk1NTU2NjYCAgIVFRU5OTo5P0c8PD0+Pj4/QURAQEBHR0dKSkpMTExSUlJiYmJlZWVnZ2cWFhZ2dnZ4eHh8fHx9fX2FhYUXFxeVlZWXl5eYmJiZmZmcnJwZGRmlpaWrq6usrKyvr68KFiq/v7/FxcXY2Nji4uLn5+ft7e0yif9uAAAAN3RSTlMAAAApKSkqKioqg4OEhISEhoa1tra3t7y9vr7S09PT09TU+Pj5+fn5+/v7+/v7+/v7/v7+/v7+70RY/wAAAPpJREFUeF4dyWNjw2AUBeC7dfYyorM6rx1exKltzLZt2/rDa/J8OgBVVlFDX39jcTZoUqCse251a2dvu6ccUtWlanLQ4Vpel+ThlWq1l3wEz58tx4dOt1dMlAJk9A5gMjG75LHwo46hzkwosGOMbejumoRvubC9EOrMviT0E0Us9fvN9dA6zxJCNv6+ECGsb6oNWsgmpZT9/UTUZo3Em6AW34guTL4jiAudiCM1kLcw8/SmHERfT1/eueBiDqR1GK1n9w+K8nglxYxd6QAML4ztXoQuj8YFgWcgqdJp8qzty26vaboCNIxBCshyQDKov0aXr29v1ufq1PwPx5Q7bCoh6eoAAAAASUVORK5CYII='], ['Slackware', 'BAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AcEDi0qZWWDgAAAAx1JREFUOMt9kktoXHUchb/ffc1M7rySSdJMOknFPMRitLgoNKKI8ZHGKkgrjU8SitidimSh2UkXoQmoO1dGQSxJjdvOtqSaqlR0USEGSjVJGxuSmWR6M3fu4/93YX0g4rc9HA6cc4Q7DI+fpzz7PA8++2mxvZAeBZ4xhHtFcJRmXWsWvb36/OLcyxf5B/KHeYHy7DmGx1+YSDjmWTdlobTGMAStQGkNoLXS4tXDq7u7tUcWz49tA8jR8QUuzB5n5NTCV13F9JEo1JJwTLKuzU61QiOMcd0UDb+BncwQK3Rl15eNja3ui/Njq8aF2eMcO/XlBz0H8oO2ZUkum6A13WB99TtyzXlaCi24SaFa+ZFCzsG2DNnfkdbFjsI1APPhk+d6ujqznycdCxFozadYWvyMpx47wa+bPkGksKwUNnsk3TaCGASRXDZh5LpHXPPg4Rcni+3uYBxrtBbQghlscOVKmYHeEm0ZIZ9xyLffw41ND6VAa43SmjiMByzHYtjzwr9arfshxf5jOKlvKZfn8es77N2uks24PPfSFD/9Uvt7AtPKWmEU9d645eHYJo5tcKi/FX/zG+zmQxQH+rANk862DOW5N/hhaY64cJSa5xNFCgDDILZACMKYWAmh73HmzFsMlBQJ06LeiMinE1S3KzRCm5rXIIoUIoKIYCVM36urZFbEoiBLNMIhAE6/NsSB7h6SKZdL8xsUOnpx9j1KbTdARACIowArYe1ergfNT2i0mIbJys0GI6PT3N1/hJvrPxOFdRJNBQIy/FapI4Bpgohgcjuw+jq8jy8tV55MNBWI4ohS802CpizKv8q+FgALZAfYgSyAZtNro1oLaU1VvxCA029Oraxs7u/tKnXiNjn8HyKwur6lI++6vPK4V7IA7u+1Dyu1tr183ddNbkHuXP8/zEIYeFqiLRl6YO/p0bHJdflT/PD9qZa1W+ry99fcvlAlcZwUpuUAglIRYVgnDEIOlna4q0M/NPnuO1/PzMwg/045O/XeibUt5/Xangx6viSVFpK2jtMpvdyWCz+5ryf10clX3/amp6eZmJjgd441URWWJY8BAAAAAElFTkSuQmCC'], ['Trisquel', 'BAAAAAQCAMAAAAoLQ9TAAABjFBMVEX///8AAAAAAAAAAAAAADMAAGYAAAAAHFUAGWYAF10AImYAIGAAHloAHGMAKGsAGmYAJmYAJGEAKnUAJ1gAMXYAJnEAJGQAI2EAK28AK3cAGTEAMHgALXEALXgALG0AFUAAI2oAK3EAMngANoYALXMANIAAM4IANIIAL3gANIcANokANoQANYQAOY0ANIYANooAN4kAN40AOY0APZMANIUAOY0AO5AAPZUAPJAAP5MAPpQAQJUAOYsAPpYANoUAPpoAPpUAM4AAQJkAPZIAPJEAQpgAN4cAPpQAPZUAPJEAO4oAOosAOo8AQJoAOYsAO44AQpsAO48AQp0AP5UAQpoARJwAQ58ARaAAQZgAQ54AQ50AQpgARaIARqMARaMARaIAR6QARaIARaEASakARKEAR6MASqsARKEASKcAR6MARqYAR6UATbEATa8ARqUARKAAR6oARqMASKgATK8AR6QATbIATbAASq0AR6cASKgASqwAR6UASKcATa8ASqoASqwAS6wASKoAS60ATbHn4CTpAAAAhHRSTlMAAQIFBQUGCQoLDxAREhMUFBUYGhobHB0eHh8gIiIjJCQkJCYoLC0xMTE0NDo6Oz1BQUNHSUxOVFVVVldaWl5iY2RkZWZoamtsb3FycnR1ent9f4KDhIiJioyNkJGYm5+foqOkpqamqKmqrKytsLKzs7e4uLy8v8TFxcXGx8rO0NXY2eZc4XYcAAAA00lEQVR4XkWN1VoCUQAG/3NWtwh7CTsQJOyk7BaDxuxA6bbrxf32gt25m7kZqDRYxziooDV7+1AalMUavQh2AsEZoWvzigLun+T17/c8QiJZ7qu2QKiNmyZthdcR1/as353jIeU1GxMHo5XHdqPFeX8IaDMdHPYN6dRN7LR4qQewdTa35HWkyh+fbxERAMjwlAWJv3CPSKDQ+H7XvHdkV4Pua3Gtm4sPKIF/WV8dop4VKBw/NU33B3x1JbTt+XwhkJQoqRfWvHOy28uqH8JIdomR/R+s9yR3Cso77AAAAABJRU5ErkJggg=='], ['Ubuntu', 'BAAAAAQCAMAAAAoLQ9TAAABKVBMVEX////ojFzplGf1zbnqnHLvs5P10b3yuZv1xKrytZXvtJXys5LysI32waT0n3HxiVHwg0jxhk31kFn0h0zxf0P0hUrveTv2iU3yfkD1hEfyejv5eDLybSX0aR7zZxvyayH6ZxnxZBj4YhH7XAb5WALlUQLeTwHgUAHeTgHfTwD65NzdTQDdTQHdTgD31MfcTgLcTADcTQD////xt5/31Mf54dfmfE/dUAbeVQ/jcUDcTgHeWBnnflHohFvpjGbqkGztnX342Mz53dLgXiP65d399PHdUgrtoYLyu6Xzvaf76eLfXB/rkm/fWhvupojwrpTeVhTgYSfgYynzwa30xbL1ybnngFT31snngljhZS3539XhZzDiajbibDn77OX88Ovrl3X99vTjbz1fisGCAAAAMHRSTlMABgYGBwcHJiorMDA1NXGHjY2Nl5mZmZyfn6O5u8XHzc3X193j9fj4+vr6/f39/f08OUojAAAAx0lEQVR4Xi3HZVbDYBhGwQctWqzFPXiQ+36pu+LubvtfBKcN82/UEhld2vWXxyL6F92gbTPabse8hU/uHMx1SZoyyJWPTwq1Rs7GpYE9+Cg+OJcs1MHvU9y4fnrN31yUm18vMCIPjtw3QMndw4rs8ieVzAAcBlewpe1KM3uaBuD3Dda1BhWXAsi6AFY1a2SqifxZ+rnxWYcJDRkUS3fO1R5vwe+XZgw4D4L3RAJiknoXCVX3WeiUpJ5pIxTvVmg45pl5k4Ot/AGV2iqZBWgJJAAAAABJRU5ErkJggg=='], ['Windows', 'BIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA+pJREFUOE+F0n84FHYcB3CWSsL9ojo/6ik64c6PnTjmSS0limmrpBm2G002y++xzXRz6zE0R4nbw+RnTj/WD4sbanLkkAe55ccYlyNme4SrO9u9d13PI3/saZ+/vs/3831ez+f9eb5aWsuqy2mjRYeNUa7YmtjfTico7jNJ8z0eG24NB9vvnDrvufzpq89Npnr8VjMddNmuRh9rDfp36mFg91oM7qPIc5JdbDJq3An/JfCu7Hl53W2lpS220pP2OuniN299jAYbYizSENIoAgbCTdrTKtxOJVdvGo8psUwKy7Vxe4ez1YEVudGP8YEZzyveInFJ6mZRHHqYazDspw/pJwTIuERM5JIwmUdGdyo9K7/BszGzzg6fXzZHGJ8KvzQqXKOpoIeZLjofWR++BPWyCEnPY4xFGEKWQcLjMjKmr1MwfcMYwmz/Y4KOgNki0V5k1dkjUWCK93Kp2PMFFawos8cm1gZ2GqjLXktL4mbQPHLQ4B9ZDFE5+S356fQlyuJMqzH++HnTo6ui2OO1ko9Ul+4fxfd3d4F7k4YTReqpuFS88bGZUE2QNNDobuIq8Q5CduHb7lFJaTnvnym9ergjMWD/FG8zf+aKS3G9JO5C01Asah6wUXrvALKEDoitMMHhDKrKJdg8RU2s0EB2EWWur8dd7PDPFv6dUC0Gv3kAN36VPRGP/5k5NS6lljWxG0TDiSr1VKhoPwhevRMSqkwRxDObc/DavGtpP6zoi8XOyZfhnyNEvKANBU0P8VPfI/wyNCGXSn7wlEmyA9KrgmOKGth3eDVvPfyywq2dnUEv2R9qG2rLsH7xJXziKnWcI8tlTvEC7Mu8hROlImTU9aKqcwQ1vWOihWFu+sJknmph5CvxQh87c7bNh/NXo03hrMCosyvLmMNgMF7TQL6J1dsZIUVwjKqEO+cajp5vxPN439U/gKBt8PTcYHzL/BgHCyOf4unAISj6mFC2bYC82kB5Ls460NHRUVsDeYSXpGw7UgC7sAtwShDgzdM38W7BbURXtqpqhfmB8sEQuXwoCM/6faGQuGCxyxyKWhIm+PrSD495WL3cT0hhi8Whc3NbAs9KaOyCTvrJ8qkdX19XBeTUDU00+55USFzVU2yHstcaix0mUAjJkJeuRU868Ucmk0lcguiBnMAVxjbbdHV1yeq8+u4Hgo22huSG+iQXp83ftaxW3lsPZcs6KG5T8OwaAfJiPcxlrVRVRhvF02i0F/t5VbHZ7JWDfErKTLnhE3mFPuRFepg/uxqz6TqLv6euGj3ut87t/4ylvre3t3ZehOWWO1zjSFEqMVP4GfGb/DBykJcjmaZOoLsc+hcVY/LaAgcTQAAAAABJRU5ErkJggg=='], ['OpenBSD', 'BAAAAAQCAYAAAFo9M/3AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAykIPu64pQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADTklEQVQ4y32RXUxTdxjGn3N6eujoKT3SUkuk3VoBGfVjgFXAsZ7WkipyYXQbuu3CzUXZmGRbssnFEseFkWzgcGzGXky9MWL8TsC4IeFgtK4oAqOnG5vMVl1pCMVWQD7b/y5M6jLdflfvxfPked/nBQA0NDSChqnGVrLuGkES742NhJAdhAKAuk9yyUs5Gry7RQMZAARCWgivpQiPe71P5DUfH0xaqTL7m/iiLkJmphawa+e4SM2PvUyC4yUIBu8CnAQKAK53rCA5OUtQtStVpJ4Gw/FOBddZVKhCfq4MP4n6+at+DUsJm/e0G9JZzYEvI2tHwlEYjDxomkZ+3nG8WroRtHihZVOhVlorDQzh0okhcByDP4ZGcf+X9XAsvY5/RsBa7Kq5H/CqLctKyl/g08S2i6fq8W/MS3P34T9wNDVYSeDX1eTD9xhiLXbtB/Akwmmv6Kr+ICFkLpGhtNSM3qsSstS3oX8lSsmsxS6ZVn3j6PvVVqhUcvC8AtPxVPxwygVKvngN89WOjgVprggGA4eenjB4nsXsTASpC63I0wVTZYPR11FoKRB8Ax54PCFk6BhMTk5CPR3GSbHouGzknr/bYFq9EAvfc9Tu1sLjHcXNKxLuTOTgzOlOe7IHBc/beAXWpWmXlz8a84nhcLQ+ecVzsAEQrMWuMX+f9HZF2YPZ28FVSNfoPWqOzMUmqYMAJm7+/OOzXQFwHGpyEV+vi+yvtxBC9pDmpgJC4tvI3mo9GTitIxvW24nT7ug67HY/3eDs2bbyrVsrY2day70rV6kRfDAHk5lDLJqAmmeRiD9GJDKHvwb74R8G0mkTPjrQTTG122xkTTbwaV2b1H4u16JQKXGr7yG2b8/H1MQ09IsTSEmRwzf4CCwzD+dmE1re8CI7wwi5XNlFf9vaTXX4dWJg4LLl7h05fpNGwNAMWpp9CIVYNO/tRCzGwpDFQaVMQTS2CKY0BWr3GVGWNSXKACDDaA4Mh976pq9f5Sy09GgKlmeAMIBKzUKpU+BFoxJecRhUfAbMxDi4eADfHVmE79v7q575gvvYeVvjZ58LD5mwsKUyX0hnf0feslnQCWD4zxnc6reKisxsfH2oscqcmTmK/+Ow252cna7K52r+Bky6PqmoT5HBAAAAAElFTkSuQmCC'], ['Gnu', 'BAAAAAQCAYAAAFo9M/3AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAywUV5gQrwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADcElEQVQ4y43Tb0jjBRzH8c9v+7nNMebcUW21Cc78g/wcuhByIScoMRwoTBmFlZCmIJ14axqkgoYIkXIqKIVBEuJNUBEUPRlpqDC3Q2Ex0nTezun2YOaPLXNIv7Vvj7zgiOj1+PPk/eADjuNEuHN6ekqMw+H4IzMz8xChUCjV1NT0JbO7uxtfXFy8NZvNr21tbd0AAEQikY6I0m1tbQbx2NjYZiqV+vn29jY+PDw8xhYWFj45PDzcb25uhlQqfSTief6X0dFRpqKigvF4PPPipaWlY7lcXhCLxXJnZmY+ZTY2NnzX19ePGxsbHw0MDLivrq5mc3Jy2pPJZLVWq/2cdbvdDSzLholoNJ1OMy6Xq0Ymk5HNZktOTU29qMgA8HYqlaKDgwNKp9M0PT09BgAM/iGuqqoimUx2yPP8U5/P9wEAMB0dHRUKheJHiUTyeGhoqAUAnE7nR0qlsjcQCLwjlsvlz+bm5mQWi0VSWlr6bXV1tU6hUMj6+/vfN5lMN0xxcfG1zWZ7SETTSqWSGhoamPHxcajV6s+8Xu9Xou7u7t9VKtW00+mkSCTC6PV6aDQa8Dw/Wl9fP8UAQCgUosvLSyovL2eWl5dRUFBw7Ha7v9vc3By5K3g1EAg8FQSBiIguLi4IgBwA2LtEjuPuJxKJ62AwKFpdXf0eQBIvYVmW/cLlchEAWK1WAADT09NzX6PR/OTz+eKVlZUzKpVqTyqVvsnzfLCkpGSrtrb2t97eXnFeXl5ZKpWyZ2RkPPP7/UUnJyefGI3GU+zt7aU4jotOTk7mAUBfX1+b1Wq9kcvlBIAcDgctLCyQxWKhoqIi6uzs/BoAVlZW3qqpqbllZmdnf1hfX//Q4/HEzWbzX+3t7fcMBgMFg0EYjUYmEolAEAREo1Hk5+fT+fk5Mzg4GD86OpJ0dXXJGQBoaWl5Ra/XP6yrq3tQVlam2N7ehslkAsuySCaTUKvVSCQS2NnZSXAcJxYEQTEyMvKeIAhLDADY7fZ7BoPhm6ysLFpbWzuan5//WKvVvsHzPEWjUSYSiSA3N5d0Oh0TjUaf+/1+S2Nj46/4FwYAr7e2tnbF4/E/iYjC4TCFw+F0LBaj/f19mpiYeID/IAagAyABYLXb7cLZ2Rml02nyer3POY6rwv8hEr34u0IkEk1mZ2cTgGMA7768/RtL5JKsGzrLIgAAAABJRU5ErkJggg=='], ['CrunchBang', 'BYAAAAQCAQAAAC45EetAAAA8ElEQVR4XnWOsUpCYQBGz1TIHYu2Qix6g0DEtSeQu/UIISJtUS8gJq61F1wcdMohcBDxKUR8hsz1xA/y44/cs3znbB+RJ0Skl3pSkeFQbUs79VAPzrwPFRmN1Ja0Ug/16I93+1oi4lKte+zMXv32WuoAm43lXMrqzbFncgWw21lORf4+/PREKpAhYqZuPXZ+T/3yXbZEajV1JavUQ104sRcq0myqc5mnHurWqc/7yhExVwuPncl+C4Bu13L60ueAwcByOtLhgAIRCzU38fRGTmSxUBvSSD3Ui1NvQkXWa7Uq1dRD9R17HiqyRUSy1NP6B7e1Yu2GtlUKAAAAAElFTkSuQmCC'], ['Yuno', 'BgAAAAPCAYAAAD+pA/bAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAABDtJREFUOE+FlHtMm1UYxrtsi8aEgCb+oTFmZur+WNS5RaPERU10C2qGaBgb6hgwLwMmHTIKlIKlQIHSQrmU24BSSmnpBVooUmihtEC5yKWDjVu5uOkcEca4lG5E93j6EQmELX7Jky/fOed9fu973vMdGu0xT3Cgz57yXMZLDdXcy821PFWLKmuA6HqLMqtLX5POl4iYb2ukWW8IOOFe/qfe3/M4n0eOjwyZD8//bldODOk37N1yDJgl+LVdjEGLFKO9KkzZm8hbje7mIrTXZ7sMtTydrJh15H8hHW11XvN/jGS7VudcD5w34ZZzeQYb67fwYO03LN4exo1+LWzNxbA05O5QuzbHqRYn+++CHDx4YK9WLfaedfQzV5em54g5Zbi8OIml+VFMDLWQ7GXoaSmFWZsDZVGCO2u0EbkhHTrhFqi9PmelSsQ8tAtSVch60dpUeGe4kxgZxegzVkBzlQ2NKBG2+iJIMqMok9r8OLRIMqApToSqmAWTmk9B2+o2YW79oshU7ABcuvAFrVGWXkVKpBYoSaBSxIS2mINpiwbjZiUMZRloVfJQyaXDKObBpimBScpHFe8KmmXpaKhK3arGrBVuVBclHN2CiPNin1OVs1tVJYlQlyZBxA6DviQVo6ZaOKd7sTplw53BVugruBBzfsRslw7rZPxaczWutSpQV/gzJPxo1JexyfaxKBBpuiEx+tw+CpKdEvGWTprGlhcwqbIzL5/DYKMYndpK3L1hxf3ZfkrzwybUZjPhnOqmvlcmutFF1jis9QSShOrcWNSXJ1MA0ou/NZWc8Ddfe4VGO3bk0JON1dyMMlK+gmxNrZCFhZF2Kng7YNO0awt4b7wLNp2EqtAsF6ImP56SG0B6siovTYpIjg15gapCVhAfJRUyIBFEo6k8AyuTtkcC/qvG/XbDexulWJvqgYH0o0nKhVHFJ40XwFQnWM5OCX+XMg86c3KvVMSMapCmPpSTIygTxGKZZOcOXhrr3Mp4uzkFuG6B3ajE3TELDDU8qEmsmvRATxquKkxAnSTFjwKEfv3JU9JC5unG6rQ1bTkbQ4Yq/DVgxOqwBWt2K9Yne3ZCZvrgHO2k5paHzOhSiVCZSkdNTgzy40JRlPgDhDHBCxUZdCs91G8fLeK87zOl6XSOICZYXMGNhDqX9fDP/mbK2DXVi/szm03eLpejl5pzOfqwOt4JBT8OeYwQt/4R/BR0OzXiLCM5LOCji/4nXt46rpywgG+zor5RxgSdupBzJdglSY+5ZZbl3XNY6mbn7W0Lcx06zBg1WBjtcC6OmG+OmRTrFrnIUZESZeVeCpwh8TpiPsQ47/tloM97T+/6m8mg55mT3tStyL54mhlwwtszNvjzD8/6HH8i7PvvPPRioZdRWuDBZUR6pEWG7I8P9Xs1Jsj36MfvvO5J/+rTw58dP7afJPfBgeef3XGz/gskFVpJc4HwGwAAAABJRU5ErkJggg==']]
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
    callbacks: [],
    node: function(node) {
      var callback, _i, _len, _ref;

      _ref = ExpandComment.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback(node);
      }
    },
    expand: function(e) {
      var a, replyID, threadID, _, _ref;

      e.preventDefault();
      _ref = this.href.match(/(\d+)#p(\d+)/), _ = _ref[0], threadID = _ref[1], replyID = _ref[2];
      this.textContent = "Loading No." + replyID + "...";
      a = this;
      return $.cache("//api.4chan.org" + this.pathname + ".json", function() {
        return ExpandComment.parse(this, a, threadID, replyID);
      });
    },
    parse: function(req, a, threadID, replyID) {
      var bq, clone, href, post, posts, quote, quotes, spoilerRange, _conf, _i, _j, _len, _len1, _ref;

      _conf = Conf;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      posts = JSON.parse(req.response).posts;
      if (spoilerRange = posts[0].custom_spoiler) {
        Build.spoilerRange[g.BOARD] = spoilerRange;
      }
      replyID = +replyID;
      for (_i = 0, _len = posts.length; _i < _len; _i++) {
        post = posts[_i];
        if (post.no === replyID) {
          break;
        }
      }
      if (post.no !== replyID) {
        a.textContent = 'No.#{replyID} not found.';
        return;
      }
      bq = $.id("m" + replyID);
      clone = bq.cloneNode(false);
      clone.innerHTML = post.com;
      _ref = quotes = clone.getElementsByClassName('quotelink');
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        quote = _ref[_j];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "res/" + href;
      }
      post = {
        blockquote: clone,
        threadID: threadID,
        quotes: quotes,
        backlinks: []
      };
      ExpandComment.node(post);
      $.replace(bq, clone);
      return Main.prettify(clone);
    }
  };

  ExpandThread = {
    init: function() {
      var a, span, _i, _len, _ref;

      _ref = $$('.summary');
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
        $.replace(span, a);
      }
    },
    toggle: function(thread) {
      var a, num, replies, reply, url, _i, _len;

      url = "//api.4chan.org/" + g.BOARD + "/res/" + thread.id.slice(1) + ".json";
      a = $('.summary', thread);
      switch (a.textContent[0]) {
        case '+':
          a.textContent = a.textContent.replace('+', '× Loading...');
          $.cache(url, function() {
            return ExpandThread.parse(this, thread, a);
          });
          break;
        case 'X':
          a.textContent = a.textContent.replace('× Loading...', '+');
          $.cache.requests[url].abort();
          break;
        case '-':
          a.textContent = a.textContent.replace('-', '+');
          num = (function() {
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
          })();
          replies = $$('.replyContainer', thread);
          replies.splice(replies.length - num, num);
          for (_i = 0, _len = replies.length; _i < _len; _i++) {
            reply = replies[_i];
            $.rm(reply);
          }
      }
    },
    parse: function(req, thread, a) {
      var backlink, frag, id, link, node, nodes, post, posts, replies, reply, spoilerRange, status, threadID, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _results;

      if ((status = req.status) !== 200) {
        a.textContent = "" + status + " " + req.statusText;
        $.off(a, 'click', ExpandThread.cb.toggle);
        return;
      }
      a.textContent = a.textContent.replace('× Loading...', '-');
      posts = JSON.parse(req.response).posts;
      if (spoilerRange = posts[0].custom_spoiler) {
        Build.spoilerRange[g.BOARD] = spoilerRange;
      }
      replies = posts.slice(1);
      threadID = thread.id.slice(1);
      nodes = [];
      for (_i = 0, _len = replies.length; _i < _len; _i++) {
        reply = replies[_i];
        post = Build.postFromObject(reply, g.BOARD);
        id = reply.no;
        link = $('a[title="Highlight this post"]', post);
        link.href = "res/" + threadID + "#p" + id;
        link.nextSibling.href = "res/" + threadID + "#q" + id;
        nodes.push(post);
      }
      _ref = $$('.summary ~ .replyContainer', a.parentNode);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        post = _ref[_j];
        $.rm(post);
      }
      _ref1 = $$('.backlink', a.previousElementSibling);
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        backlink = _ref1[_k];
        if (!$.id(backlink.hash.slice(1))) {
          $.rm(backlink);
        }
      }
      _results = [];
      for (_l = 0, _len3 = nodes.length; _l < _len3; _l++) {
        node = nodes[_l];
        frag = $.frag();
        $.add(frag, node);
        post = Main.preParse(node);
        post.threadID = threadID;
        Main.node(post);
        _results.push($.add(thread, frag));
      }
      return _results;
    }
  };

  FileInfo = {
    init: function() {
      if (g.BOARD === 'f') {
        return;
      }
      this.setFormats();
      QuotePreview.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var alt, filename, node, _ref;

      if (!post.fileInfo) {
        return;
      }
      node = post.fileInfo.firstElementChild;
      alt = post.img.alt;
      filename = ((_ref = $('span', node)) != null ? _ref.title : void 0) || node.title;
      FileInfo.data = {
        link: post.img.parentNode.href,
        spoiler: /^Spoiler/.test(alt),
        size: alt.match(/\d+\.?\d*/)[0],
        unit: alt.match(/\w+$/)[0],
        resolution: node.textContent.match(/\d+x\d+|PDF/)[0],
        fullname: filename,
        shortname: Build.shortFilename(filename, post.ID === post.threadID)
      };
      node.setAttribute('data-filename', filename);
      return node.innerHTML = FileInfo.funk(FileInfo);
    },
    setFormats: function() {
      var code;

      code = Conf['fileInfo'].replace(/%(.)/g, function(s, c) {
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
      t: function() {
        return FileInfo.data.link.match(/\d+\..+$/)[0];
      },
      T: function() {
        return "<a href=" + FileInfo.data.link + " target=_blank>" + (this.t()) + "</a>";
      },
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

  Keybinds = {
    init: function() {
      var node, _i, _len, _ref;

      this.bindings = this.bind();
      _ref = $$('[accesskey]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        node.removeAttribute('accesskey');
      }
      return $.on(d, 'keydown', Keybinds.keydown);
    },
    bind: function() {
      var keys, _conf;

      _conf = Conf;
      keys = {};
      keys[_conf.openQR] = function(thread, target, nodeName) {
        return Keybinds.qr(thread, true);
      };
      keys[_conf.openEmptyQR] = function(thread, target, nodeName) {
        return Keybinds.qr(thread);
      };
      keys[_conf.openOptions] = function() {
        if (!$.id('overlay')) {
          return Options.dialog();
        }
      };
      keys[_conf.close] = function() {
        var o;

        if (o = $.id('overlay')) {
          return Options.close.call(o);
        } else if (QR.el) {
          return QR.close();
        }
      };
      keys[_conf.submit] = function() {
        if (QR.el && !QR.status()) {
          return QR.submit();
        }
      };
      keys[_conf.hideQR] = function(thread, target, nodeName) {
        if (QR.el) {
          if (QR.el.hidden) {
            return QR.el.hidden = false;
          }
          return QR.autohide.click();
        } else {
          return QR.open();
        }
      };
      keys[_conf.toggleCatalog] = function() {
        return CatalogLinks.toggle();
      };
      keys[_conf.spoiler] = function(thread, target, nodeName) {
        if (!(($('[name=spoiler]')) && nodeName === 'textarea')) {
          return;
        }
        return Keybinds.tags('spoiler', target);
      };
      keys[_conf.math] = function(thread, target, nodeName) {
        if (!(g.BOARD === (!!$('script[src^="//boards.4chan.org/jsMath/"]', d.head)) && nodeName === 'textarea')) {
          return;
        }
        return Keybinds.tags('math', target);
      };
      keys[_conf.eqn] = function(thread, target, nodeName) {
        if (!(g.BOARD === (!!$('script[src^="//boards.4chan.org/jsMath/"]', d.head)) && nodeName === 'textarea')) {
          return;
        }
        return Keybinds.tags('eqn', target);
      };
      keys[_conf.code] = function(thread, target, nodeName) {
        if (!(g.BOARD === 'g' && nodeName === 'textarea')) {
          return;
        }
        return Keybinds.tags('code', target);
      };
      keys[_conf.sageru] = function() {
        $("[name=email]", QR.el).value = "sage";
        return QR.selected.email = "sage";
      };
      keys[_conf.watch] = function(thread, target, nodeName) {
        return Watcher.toggle(thread);
      };
      keys[_conf.update] = function() {
        return Updater.update();
      };
      keys[_conf.unreadCountTo0] = function() {
        Unread.replies = [];
        return Unread.update(true);
      };
      keys[_conf.expandImage] = function(thread, target, nodeName) {
        return Keybinds.img(thread);
      };
      keys[_conf.expandAllImages] = function(thread, target, nodeName) {
        return Keybinds.img(thread, true);
      };
      keys[_conf.fappeTyme] = function(thread, target, nodeName) {
        return Keybinds.ft(thread);
      };
      keys[_conf.zero] = function() {
        return window.location = "/" + g.BOARD + "/0#delform";
      };
      keys[_conf.nextPage] = function() {
        var form;

        if (form = $('.next form')) {
          return window.location = form.action;
        }
      };
      keys[_conf.previousPage] = function() {
        var form;

        if (form = $('.prev form')) {
          return window.location = form.action;
        }
      };
      keys[_conf.nextThread] = function() {
        if (g.REPLY) {
          return;
        }
        return Nav.scroll(+1);
      };
      keys[_conf.previousThread] = function() {
        if (g.REPLY) {
          return;
        }
        return Nav.scroll(-1);
      };
      keys[_conf.expandThread] = function(thread, target, nodeName) {
        return ExpandThread.toggle(thread);
      };
      keys[_conf.openThread] = function(thread, target, nodeName) {
        return Keybinds.open(thread);
      };
      keys[_conf.openThreadTab] = function(thread, target, nodeName) {
        return Keybinds.open(thread, true);
      };
      keys[_conf.nextReply] = function(thread, target, nodeName) {
        return Keybinds.hl(+1, thread);
      };
      keys[_conf.previousReply] = function(thread, target, nodeName) {
        return Keybinds.hl(-1, thread);
      };
      keys[_conf.hide] = function(thread, target, nodeName) {
        if (/\bthread\b/.test(thread.className)) {
          return ThreadHiding.toggle(thread);
        }
      };
      return keys;
    },
    keydown: function(e) {
      var bind, key, nodeName, target, thread;

      if (!(key = Keybinds.keyCode(e))) {
        return;
      }
      target = e.target;
      if ((nodeName = target.nodeName.toLowerCase()) === 'textarea' || nodeName === 'input') {
        if (!((key === 'Esc') || (/\+/.test(key)))) {
          return;
        }
      }
      thread = Nav.getThread();
      if (!(bind = Keybinds.bindings[key])) {
        return;
      }
      bind(thread, target, nodeName);
      return e.preventDefault();
    },
    keyCode: function(e) {
      var c, kc, key;

      key = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90].contains(kc = e.keyCode) ? (c = String.fromCharCode(kc), e.shiftKey ? c : c.toLowerCase()) : ((function() {
        switch (kc) {
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
            return null;
        }
      })());
      if (key) {
        if (e.altKey) {
          key = 'alt+' + key;
        }
        if (e.ctrlKey) {
          key = 'ctrl+' + key;
        }
        if (e.metaKey) {
          key = 'meta+' + key;
        }
      }
      return key;
    },
    tags: function(tag, ta) {
      var range, selEnd, selStart, value;

      value = ta.value;
      selStart = ta.selectionStart;
      selEnd = ta.selectionEnd;
      ta.value = value.slice(0, selStart) + ("[" + tag + "]") + value.slice(selStart, selEnd) + ("[/" + tag + "]") + value.slice(selEnd);
      range = ("[" + tag + "]").length + selEnd;
      ta.setSelectionRange(range, range);
      return $.event(ta, new Event('input'));
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
    ft: function(thread) {
      return $('#fappeTyme>input').click();
    },
    qr: function(thread, quote) {
      if (quote) {
        QR.quote.call($('a[title="Quote this post"]', $('.post.highlight', thread) || thread));
      } else {
        QR.open();
      }
      return $('textarea', QR.el).focus();
    },
    open: function(thread, tab) {
      var id, url;

      if (g.REPLY) {
        return;
      }
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
        $.rmClass(post, 'highlight');
        rect = post.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top <= d.documentElement.clientHeight) {
          axis = delta === +1 ? 'following' : 'preceding';
          next = $.x(axis + '::div[contains(@class,"post reply")][1]', post);
          if (!next) {
            return;
          }
          if (!(g.REPLY || $.x('ancestor::div[parent::div[@class="board"]]', next) === thread)) {
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

  Navigation = {
    delimiter: "/",
    links: [["a", "Anime & Manga", "//boards.4chan.org/a/"], ["b", "Random", "//boards.4chan.org/b/"], ["c", "Cute/Anime", "//boards.4chan.org/c/"], ["d", "Hentai/Alternative", "//boards.4chan.org/d/"], ["e", "Ecchi", "//boards.4chan.org/e/"], ["f", "Flash", "//boards.4chan.org/f/"], ["g", "Technology", "//boards.4chan.org/g/"], ["gif", "Animated Gifs", "//boards.4chan.org/gif/"], ["h", "Hentai", "//boards.4chan.org/h/"], ["hr", "High Resolution", "//boards.4chan.org/hr/"], ["k", "Weapons", "//boards.4chan.org/k/"], ["l", "Lolicon", "http://7chan.org/cake/"], ["m", "Mecha", "//boards.4chan.org/m/"], ["o", "Auto", "//boards.4chan.org/o/"], ["p", "Pictures", "//boards.4chan.org/p/"], ["r", "Requests", "//boards.4chan.org/r/"], ["s", "Sexy Beautiful Women", "//boards.4chan.org/s/"], ["t", "Torrents", "//boards.4chan.org/t/"], ["u", "Yuri", "//boards.4chan.org/u/"], ["v", "Video Games", "//boards.4chan.org/v/"], ["vg", "Video Game Generals", "//boards.4chan.org/vg/"], ["w", "Anime/Wallpapers", "//boards.4chan.org/w/"], ["wg", "Wallpapers/General", "//boards.4chan.org/wg/"], ["i", "Oekaki", "//boards.4chan.org/i/"], ["ic", "Artwork/Critique", "//boards.4chan.org/ic/"], ["r9k", "Robot 9K", "//boards.4chan.org/r9k/"], ["cm", "Cute/Male", "//boards.4chan.org/cm/"], ["hm", "Handsome Men", "//boards.4chan.org/hm/"], ["y", "Yaoi", "//boards.4chan.org/y/"], ["3", "3DCG", "//boards.4chan.org/3/"], ["adv", "Advice", "//boards.4chan.org/adv/"], ["an", "Animals", "//boards.4chan.org/an/"], ["cgl", "Cosplay & EGL", "//boards.4chan.org/cgl/"], ["ck", "Food & Cooking", "//boards.4chan.org/ck/"], ["co", "Comics & Cartoons", "//boards.4chan.org/co/"], ["diy", "Do It Yourself", "//boards.4chan.org/diy/"], ["fa", "Fashion", "//boards.4chan.org/fa/"], ["fit", "Health & Fitness", "//boards.4chan.org/fit/"], ["hc", "Hardcore", "//boards.4chan.org/hc/"], ["int", "International", "//boards.4chan.org/int/"], ["jp", "Otaku Culture", "//boards.4chan.org/jp/"], ["lit", "Literature", "//boards.4chan.org/lit/"], ["mlp", "My Little Pony", "//boards.4chan.org/mlp/"], ["mu", "Music", "//boards.4chan.org/mu/"], ["n", "Transportation", "//boards.4chan.org/n/"], ["po", "Papercraft & Origami", "//boards.4chan.org/po/"], ["pol", "Politically Incorrect", "//boards.4chan.org/pol/"], ["sci", "Science & Math", "//boards.4chan.org/sci/"], ["soc", "Social", "//boards.4chan.org/soc/"], ["sp", "Sports", "//boards.4chan.org/sp/"], ["tg", "Traditional Games", "//boards.4chan.org/tg/"], ["toy", "Toys", "//boards.4chan.org/toys/"], ["trv", "Travel", "//boards.4chan.org/trv/"], ["tv", "Television & Film", "//boards.4chan.org/tv/"], ["vp", "Pok&eacute;mon", "//boards.4chan.org/vp/"], ["wsg", "Worksafe GIF", "//boards.4chan.org/wsg/"], ["x", "Paranormal", "//boards.4chan.org/x/"], ["rs", "Rapidshares", "http://rs.4chan.org/"], ["status", "4chan Status", "http://status.4chan.org/"], ["q", "4chan Discussion", "//boards.4chan.org/q/"], ["@", "4chan Twitter", "http://www.twitter.com/4chan"]]
  };

  Nav = {
    init: function() {
      var next, prev, span;

      span = $.el('span', {
        id: 'navlinks'
      });
      prev = $.el('a', {
        href: 'javascript:;'
      });
      next = $.el('a', {
        href: 'javascript:;'
      });
      $.on(prev, 'click', this.prev);
      $.on(next, 'click', this.next);
      $.add(span, [prev, next]);
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
      var i, rect, thread, top, _ref, _ref1;

      _ref = Nav.getThread(true), thread = _ref[0], i = _ref[1], rect = _ref[2];
      top = rect.top;
      if (!((delta === -1 && Math.ceil(top) < 0) || (delta === +1 && top > 1))) {
        i += delta;
      }
      top = (_ref1 = Nav.threads[i]) != null ? _ref1.getBoundingClientRect().top : void 0;
      return window.scrollBy(0, top);
    }
  };

  Redirect = {
    image: function(board, filename) {
      switch (board) {
        case 'a':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'vg':
        case 'wsg':
          return "//archive.foolz.us/" + board + "/full_image/" + filename;
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
        case 'ck':
        case 'lit':
          return "//fuuka.warosu.org/" + board + "/full_image/" + filename;
        case 'u':
          return "//nsfw.foolz.us/" + board + "/full_image/" + filename;
        case 'e':
          return "//www.xn--clich-fsa.net/4chan/cgi-board.pl/" + board + "/img/" + filename;
        case 'c':
          return "//archive.nyafuu.org/" + board + "/full_image/" + filename;
      }
    },
    post: function(board, postID) {
      var archive, name, _base1, _ref;

      if (Redirect.post[board] === void 0) {
        _ref = this.archiver;
        for (name in _ref) {
          archive = _ref[name];
          if (archive.type === 'foolfuuka' && archive.boards.contains(board)) {
            Redirect.post[board] = archive.base;
            break;
          }
        }
        (_base1 = Redirect.post)[board] || (_base1[board] = null);
      }
      if (Redirect.post[board]) {
        return "" + Redirect.post[board] + "/_/api/chan/post/?board=" + board + "&num=" + postID;
      }
      return null;
    },
    archiver: {
      'Foolz': {
        base: '//archive.foolz.us',
        boards: ['a', 'co', 'gd', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'vp', 'vr', 'wsg', 'dev', 'foolz'],
        type: 'foolfuuka'
      },
      'NSFWFoolz': {
        base: '//nsfw.foolz.us',
        boards: ['u', 'kuku'],
        type: 'foolfuuka'
      },
      'TheDarkCave': {
        base: 'http://archive.thedarkcave.org',
        boards: ['c', 'int', 'out', 'po'],
        type: 'foolfuuka'
      },
      'Warosu': {
        base: '//fuuka.warosu.org',
        boards: ['cgl', 'ck', 'fa', 'jp', 'lit', 'q', 's4s', 'tg', 'vr'],
        type: 'fuuka'
      },
      'InstallGentoo': {
        base: '//archive.installgentoo.net',
        boards: ['diy', 'g', 'sci'],
        type: 'fuuka'
      },
      'RebeccaBlackTech': {
        base: '//rbt.asia',
        boards: ['cgl', 'g', 'mu', 'w'],
        type: 'fuuka_mail'
      },
      'Heinessen': {
        base: 'http://archive.heinessen.com',
        boards: ['an', 'fit', 'k', 'mlp', 'r9k', 'toy', 'x'],
        type: 'fuuka'
      },
      'Cliche': {
        base: '//www.xn--clich-fsa.net/4chan/cgi-board.pl',
        boards: ['e'],
        type: 'fuuka'
      },
      'NyaFuu': {
        base: '//archive.nyafuu.org',
        boards: ['c', 'w'],
        type: 'fuuka'
      }
    },
    select: function(board) {
      var archive, name;

      return (function() {
        var _ref, _results;

        _ref = this.archiver;
        _results = [];
        for (name in _ref) {
          archive = _ref[name];
          if (archive.boards.contains(board || g.BOARD)) {
            _results.push(name);
          }
        }
        return _results;
      }).call(this);
    },
    to: function(data) {
      var archive, board, isSearch, threadID;

      board = data.board, threadID = data.threadID, isSearch = data.isSearch;
      return ((archive = this.archiver[$.get("archiver/" + board + "/", this.select(board)[0])]) ? this.path(archive.base, archive.type, data) : threadID && !isSearch ? "//boards.4chan.org/" + board + "/" : null);
    },
    path: function(base, archiver, data) {
      var board, isSearch, postID, threadID, type, url, value;

      board = data.board, type = data.type, value = data.value, threadID = data.threadID, postID = data.postID, isSearch = data.isSearch;
      if (isSearch) {
        type = type === 'name' ? 'username' : type === 'md5' ? 'image' : type;
        value = encodeURIComponent(value);
        return ((url = archiver === 'foolfuuka' ? "search/" + type + "/" : type === 'image' ? "?task=search2&search_media_hash=" : type !== 'email' || archiver === 'fuuka_mail' ? "?task=search2&search_" + type + "=" : false) ? "" + base + "/" + board + "/" + url + value : url);
      }
      if (postID) {
        postID = postID.match(/\d+/)[0];
      }
      return base + "/" + board + "/" + (threadID ? "thread/" + threadID : "post/" + postID) + (threadID && postID ? "#" + (archiver === 'InstallGentoo' ? 'p' : '') + postID : "");
    }
  };

  RelativeDates = {
    INTERVAL: $.MINUTE,
    init: function() {
      Main.callbacks.push(this.node);
      return $.on(d, 'visibilitychange', this.flush);
    },
    node: function(post) {
      var dateEl, diff, utc;

      dateEl = $('.postInfo > .dateTime', post.el);
      dateEl.title = dateEl.textContent;
      utc = dateEl.dataset.utc * 1000;
      diff = Date.now() - utc;
      dateEl.textContent = RelativeDates.relative(diff);
      RelativeDates.setUpdate(dateEl, utc, diff);
      return RelativeDates.flush();
    },
    relative: function(diff) {
      var number, rounded, unit;

      unit = (number = diff / $.DAY) > 1 ? 'day' : (number = diff / $.HOUR) > 1 ? 'hour' : (number = diff / $.MINUTE) > 1 ? 'minute' : (number = diff / $.SECOND, 'second');
      rounded = Math.round(number);
      if (rounded !== 1) {
        unit += 's';
      }
      return "" + rounded + " " + unit + " ago";
    },
    stale: [],
    flush: $.debounce($.SECOND, function() {
      var now, update, _i, _len, _ref;

      if (d.hidden) {
        return;
      }
      now = Date.now();
      _ref = RelativeDates.stale;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        update = _ref[_i];
        update(now);
      }
      RelativeDates.stale = [];
      clearTimeout(RelativeDates.timeout);
      return RelativeDates.timeout = setTimeout(RelativeDates.flush, RelativeDates.INTERVAL);
    }),
    setUpdate: function(dateEl, utc, diff) {
      var markStale, setOwnTimeout, update;

      setOwnTimeout = function(diff) {
        var delay;

        delay = diff < $.MINUTE ? $.SECOND - (diff + $.SECOND / 2) % $.SECOND : diff < $.HOUR ? $.MINUTE - (diff + $.MINUTE / 2) % $.MINUTE : $.HOUR - (diff + $.HOUR / 2) % $.HOUR;
        return setTimeout(markStale, delay);
      };
      update = function(now) {
        if (d.contains(dateEl)) {
          diff = now - utc;
          dateEl.textContent = RelativeDates.relative(diff);
          return setOwnTimeout(diff);
        }
      };
      markStale = function() {
        return RelativeDates.stale.push(update);
      };
      return setOwnTimeout(diff);
    }
  };

  Time = {
    init: function() {
      Time.foo();
      QuotePreview.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var node;

      node = $('.postInfo > .dateTime', post.el);
      Time.date = new Date(node.dataset.utc * 1000);
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
      S: function() {
        return Time.zeroPad(Time.date.getSeconds());
      },
      y: function() {
        return Time.date.getFullYear() - 2000;
      }
    }
  };

  AnnouncementHiding = {
    init: function() {
      var gmsg, hideButton, hideState;

      if (!(gmsg = $.id('globalMessage'))) {
        return;
      }
      hideState = $.get('hidegMessage', {});
      hideButton = $.el('a', {
        id: 'toggleMsgButton',
        className: "redButton",
        textContent: "" + (hideState.hidden ? 'View Important Announcement' : 'Close Announcement'),
        href: "javascript:;"
      });
      $.before(gmsg, hideButton);
      $.on(hideButton, 'click', function() {
        $.toggleClass(gmsg, 'hidden');
        if (hideState.hidden) {
          this.textContent = 'Close Announcement';
          hideState.hidden = false;
          delete hideState.gmsg;
        } else {
          this.textContent = 'View Important Announcement';
          hideState.hidden = true;
          hideState.gmsg = gmsg.textContent;
        }
        return $.set('hidegMessage', hideState);
      });
      if (hideState.hidden) {
        $.toggleClass(gmsg, 'hidden');
        if (gmsg.textContent !== hideState.gmsg) {
          return hideButton.click();
        }
      }
    }
  };

  Anonymize = {
    init: function() {
      QuotePreview.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var name, parent, trip;

      name = $('.postInfo .name', post.el);
      name.textContent = 'Anonymous';
      if ((trip = name.nextElementSibling) && trip.className === 'postertrip') {
        $.rm(trip);
      }
      if ((parent = name.parentNode).className === 'useremail' && !/^mailto:sage$/i.test(parent.href)) {
        return $.replace(parent, name);
      }
    }
  };

  Filter = {
    filters: {},
    init: function() {
      var boards, err, filter, hl, key, op, regexp, stub, top, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;

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
          if (!(boards === 'global' || boards.split(',').contains(g.BOARD))) {
            continue;
          }
          if (key === 'md5') {
            regexp = regexp[1];
          } else {
            try {
              regexp = RegExp(regexp[1], regexp[2]);
            } catch (_error) {
              err = _error;
              alert(err.message);
              continue;
            }
          }
          op = ((_ref2 = filter.match(/[^t]op:(yes|no|only)/)) != null ? _ref2[1] : void 0) || 'no';
          stub = (function() {
            var _ref3;

            switch ((_ref3 = filter.match(/stub:(yes|no)/)) != null ? _ref3[1] : void 0) {
              case 'yes':
                return true;
              case 'no':
                return false;
              default:
                return Conf['Show Stubs'];
            }
          })();
          if (hl = /highlight/.test(filter)) {
            hl = ((_ref3 = filter.match(/highlight:(\w+)/)) != null ? _ref3[1] : void 0) || 'filter_highlight';
            top = ((_ref4 = filter.match(/top:(yes|no)/)) != null ? _ref4[1] : void 0) || 'yes';
            top = top === 'yes';
          }
          this.filters[key].push(this.createFilter(regexp, op, stub, hl, top));
        }
        if (!this.filters[key].length) {
          delete this.filters[key];
        }
      }
      if (Object.keys(this.filters).length) {
        return Main.callbacks.push(this.node);
      }
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
      return function(value, isOP) {
        if (isOP && op === 'no' || !isOP && op === 'only') {
          return false;
        }
        if (!test(value)) {
          return false;
        }
        return settings;
      };
    },
    node: function(post) {
      var filter, isOP, key, result, root, value, _i, _len, _ref;

      if (post.isInlined) {
        return;
      }
      isOP = post.ID === post.threadID;
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
          if (result.hide) {
            if (isOP) {
              if (!g.REPLY) {
                ThreadHiding.hide(root.parentNode, result.stub);
              } else {
                continue;
              }
            } else {
              ReplyHiding.hide(post.root, result.stub);
            }
            return;
          }
          $.addClass(root, result["class"]);
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
        return decodeURIComponent(mail.href.slice(7));
      }
      return false;
    },
    subject: function(post) {
      var subject;

      if ((subject = $('.postInfo .subject', post.el)).textContent.length !== 0) {
        return subject.textContent;
      }
      return false;
    },
    comment: function(post) {
      var content, data, i, nodes, text, _i, _ref;

      text = [];
      nodes = d.evaluate('.//br|.//text()', post.blockquote, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (i = _i = 0, _ref = nodes.snapshotLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        text.push((data = nodes.snapshotItem(i).data) ? data : '\n');
      }
      if ((content = text.join('')).length !== 0) {
        return content;
      }
      return false;
    },
    country: function(post) {
      var flag;

      if (flag = $('.countryFlag', post.el)) {
        return flag.title;
      }
      return false;
    },
    filename: function(post) {
      var file, fileInfo;

      fileInfo = post.fileInfo;
      if (fileInfo) {
        if (file = $('.fileText > span', fileInfo)) {
          return file.title;
        } else {
          return fileInfo.firstElementChild.dataset.filename;
        }
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
        return img.alt.replace('Spoiler Image, ', '');
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
    },
    menuInit: function() {
      var div, entry, type, _i, _len, _ref;

      div = $.el('div', {
        textContent: 'Filter'
      });
      entry = {
        el: div,
        open: function() {
          return true;
        },
        children: []
      };
      _ref = [['Name', 'name'], ['Unique ID', 'uniqueid'], ['Tripcode', 'tripcode'], ['Admin/Mod', 'mod'], ['E-mail', 'email'], ['Subject', 'subject'], ['Comment', 'comment'], ['Country', 'country'], ['Filename', 'filename'], ['Image dimensions', 'dimensions'], ['Filesize', 'filesize'], ['Image MD5', 'md5']];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        entry.children.push(this.createSubEntry(type[0], type[1]));
      }
      return Menu.addEntry(entry);
    },
    createSubEntry: function(text, type) {
      var el, onclick, open;

      el = $.el('a', {
        href: 'javascript:;',
        textContent: text
      });
      onclick = null;
      open = function(post) {
        var value;

        value = Filter[type](post);
        if (value === false) {
          return false;
        }
        $.off(el, 'click', onclick);
        onclick = function() {
          var re, save, select, ta, tl;

          re = type === 'md5' ? value : value.replace(/\/|\\|\^|\$|\n|\.|\(|\)|\{|\}|\[|\]|\?|\*|\+|\|/g, function(c) {
            if (c === '\n') {
              return '\\n';
            } else if (c === '\\') {
              return '\\\\';
            } else {
              return "\\" + c;
            }
          });
          re = type === 'md5' ? "/" + value + "/" : "/^" + re + "$/";
          if (/\bop\b/.test(post["class"])) {
            re += ';op:yes';
          }
          save = (save = $.get(type, '')) ? "" + save + "\n" + re : re;
          $.set(type, save);
          Options.dialog();
          select = $('select[name=filter]', $.id('options'));
          select.value = type;
          $.event(select, new Event('change'));
          $.id('filter_tab').checked = true;
          ta = select.nextElementSibling;
          tl = ta.textLength;
          ta.setSelectionRange(tl, tl);
          return ta.focus();
        };
        $.on(el, 'click', onclick);
        return true;
      };
      return {
        el: el,
        open: open
      };
    }
  };

  ReplyHiding = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var side;

      if (post.isInlined || post.ID === post.threadID) {
        return;
      }
      side = $('.sideArrows', post.root);
      side.innerHTML = '<a href="javascript:;"><span>[ - ]</span></a>';
      $.on(side.firstChild, 'click', function() {
        var button, id, root;

        return ReplyHiding.toggle(button = this.parentNode, root = button.parentNode, id = root.id.slice(2));
      });
      if (post.ID in g.hiddenReplies) {
        return ReplyHiding.hide(post.root);
      }
    },
    toggle: function(button, root, id) {
      var quote, quotes, _i, _j, _len, _len1;

      quotes = $$(".quotelink[href$='#p" + id + "'], .backlink[href$='#p" + id + "']");
      if (/\bstub\b/.test(button.className)) {
        ReplyHiding.show(root);
        for (_i = 0, _len = quotes.length; _i < _len; _i++) {
          quote = quotes[_i];
          $.rmClass(quote, 'filtered');
        }
        delete g.hiddenReplies[id];
      } else {
        ReplyHiding.hide(root);
        for (_j = 0, _len1 = quotes.length; _j < _len1; _j++) {
          quote = quotes[_j];
          $.addClass(quote, 'filtered');
        }
        g.hiddenReplies[id] = Date.now();
      }
      return $.set("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
    },
    hide: function(root) {
      var a, id, menuButton, post, stub;

      post = $('.post', root);
      if (post.hidden) {
        return;
      }
      post.hidden = true;
      $.addClass(root, 'hidden');
      if (!Conf['Show Stubs']) {
        return;
      }
      stub = $.el('div', {
        className: 'stub',
        innerHTML: "<a href='javascript:;' id='show" + (id = root.id.slice(2)) + "'><span>[ + ]</span> " + (Conf['Anonymize'] ? 'Anonymous' : $('.desktop > .nameBlock', root).textContent) + " </a>"
      });
      a = stub.firstChild;
      $.on(a, 'click', function() {
        var button;

        return ReplyHiding.toggle(button = this.parentNode, root = $.id("pc" + this.id.slice(4)), id);
      });
      if (Conf['Menu']) {
        menuButton = Menu.a.cloneNode(true);
        $.on(menuButton, 'click', Menu.toggle);
        $.add(stub, [$.tn(' '), menuButton]);
      }
      return $.prepend(root, stub);
    },
    show: function(root) {
      var post, stub;

      if ((stub = $('.stub', root))) {
        $.rm(stub);
      }
      post = $('.post', root);
      post.hidden = false;
      return $.rmClass(root, 'hidden');
    },
    unhide: function(post) {
      if (post.el.hidden) {
        return ReplyHiding.show(post.root);
      }
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
        if (!(quote.hash && (el = $.id("p" + quote.hash.slice(2))) && quote.hostname === 'boards.4chan.org' && !/catalog$/.test(quote.pathname) && el.hidden)) {
          continue;
        }
        $.addClass(quote, 'filtered');
        if (Conf['Recursive Filtering'] && post.ID !== post.threadID) {
          ReplyHiding.hide(post.root);
        }
      }
    }
  };

  ThreadHiding = {
    init: function() {
      var a, thread, _i, _len, _ref;

      this.hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      ThreadHiding.sync();
      if (g.CATALOG) {
        return;
      }
      _ref = $$('.thread');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        a = $.el('a', {
          className: 'hide_thread_button',
          innerHTML: '<span>[ - ]</span>',
          href: 'javascript:;'
        });
        $.on(a, 'click', function() {
          return ThreadHiding.toggle($.x('ancestor::div[@class="thread"][1]', this));
        });
        $.add($('.op .postInfo', thread), a);
        if (thread.id.slice(1) in this.hiddenThreads) {
          ThreadHiding.hide(thread);
        }
      }
    },
    sync: function() {
      var hiddenThreadsCatalog, id;

      hiddenThreadsCatalog = JSON.parse(localStorage.getItem("4chan-hide-t-" + g.BOARD)) || {};
      if (g.CATALOG) {
        for (id in this.hiddenThreads) {
          hiddenThreadsCatalog[id] = true;
        }
        return localStorage.setItem("4chan-hide-t-" + g.BOARD, JSON.stringify(hiddenThreadsCatalog));
      } else {
        for (id in hiddenThreadsCatalog) {
          if (!(id in this.hiddenThreads)) {
            this.hiddenThreads[id] = Date.now();
          }
        }
        return $.set("hiddenThreads/" + g.BOARD + "/", this.hiddenThreads);
      }
    },
    toggle: function(thread) {
      var id;

      id = thread.id.slice(1);
      if (thread.hidden || /\bhidden_thread\b/.test(thread.firstChild.className)) {
        ThreadHiding.show(thread);
        delete ThreadHiding.hiddenThreads[id];
      } else {
        ThreadHiding.hide(thread);
        ThreadHiding.hiddenThreads[id] = Date.now();
      }
      return $.set("hiddenThreads/" + g.BOARD + "/", ThreadHiding.hiddenThreads);
    },
    hide: function(thread) {
      var menuButton, num, opInfo, span, stub, text;

      if (!Conf['Show Stubs']) {
        thread.hidden = true;
        thread.nextElementSibling.hidden = true;
        return;
      }
      if (/\bhidden_thread\b/.test(thread.firstChild.className)) {
        return;
      }
      num = 0;
      if (span = $('.summary', thread)) {
        num = Number(span.textContent.match(/\d+/));
      }
      num += $$('.opContainer ~ .replyContainer', thread).length;
      text = num === 1 ? '1 reply' : "" + num + " replies";
      opInfo = $('.desktop > .nameBlock', thread).textContent;
      stub = $.el('a', {
        className: 'hidden_thread',
        innerHTML: '<span class=hide_thread_button>[ + ]</span>',
        href: 'javascript:;'
      });
      $.on(stub, 'click', function() {
        return ThreadHiding.toggle(this.parentElement);
      });
      $.add(stub, $.tn("" + opInfo + " (" + text + ")"));
      if (Conf['Menu']) {
        menuButton = Menu.a.cloneNode(true);
        $.on(menuButton, 'click', Menu.toggle);
        $.add(stub, [$.tn(' '), menuButton]);
      }
      return $.prepend(thread, stub);
    },
    show: function(thread) {
      var stub;

      if (stub = $('.hidden_thread', thread)) {
        $.rm(stub);
      }
      thread.hidden = false;
      return thread.nextElementSibling.hidden = false;
    }
  };

  FappeTyme = {
    init: function() {
      var el;

      if (g.CATALOG || g.BOARD === 'f') {
        return;
      }
      el = $.el('label', {
        href: 'javascript:;',
        id: 'fappeTyme',
        title: 'Fappe Tyme',
        innerHTML: '<input type="checkbox"><span>Fappe Tyme</span>'
      });
      $.add($.id('imgContainer'), el);
      $.on($('input', el), 'click', FappeTyme.toggle);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      if (post.img) {
        return;
      }
      return post.el.parentElement.classList.add("noFile");
    },
    toggle: function() {
      return $.toggleClass(d.body, 'fappeTyme');
    }
  };

  ImageExpand = {
    init: function() {
      if (g.BOARD === 'f') {
        return;
      }
      QuoteInline.callbacks.push(this.node);
      Main.callbacks.push(this.node);
      return this.dialog();
    },
    node: function(post) {
      var a;

      if (!post.img || post.hasPDF) {
        return;
      }
      a = post.img.parentNode;
      $.on(a, 'click', ImageExpand.cb.toggle);
      if (Conf['Don\'t Expand Spoilers'] && !Conf['Reveal Spoilers'] && /^spoiler\ image/i.test(a.firstChild.alt)) {
        return;
      }
      if (ImageExpand.on && !post.el.hidden) {
        return ImageExpand.expand(post.img);
      }
    },
    cb: {
      toggle: function(e) {
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button) {
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
            if (Conf['Don\'t Expand Spoilers'] && !Conf['Reveal Spoilers'] && /^spoiler\ image/i.test(thumb.alt)) {
              continue;
            }
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

        klass = (function() {
          switch (this.value) {
            case 'full':
              return '';
            case 'fit width':
              return 'fitwidth';
            case 'fit height':
              return 'fitheight';
            case 'fit screen':
              return 'fitwidth fitheight';
          }
        }).call(this);
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
        if (rect.bottom > 0) {
          if ($.engine === 'webkit') {
            if (rect.top < 0) {
              d.body.scrollTop += rect.top - 42;
            }
            if (rect.left < 0) {
              d.body.scrollLeft += rect.left;
            }
          } else {
            if (rect.top < 0) {
              d.documentElement.scrollTop += rect.top - 42;
            }
            if (rect.left < 0) {
              d.documentElement.scrollLeft += rect.left;
            }
          }
        }
        return ImageExpand.contract(thumb);
      } else {
        return ImageExpand.expand(thumb);
      }
    },
    contract: function(thumb) {
      thumb.hidden = false;
      thumb.nextSibling.hidden = true;
      return $.rmClass(thumb.parentNode.parentNode.parentNode.parentNode, 'image_expanded');
    },
    expand: function(thumb, src) {
      var a, img;

      if ($.x('ancestor-or-self::*[@hidden]', thumb)) {
        return;
      }
      a = thumb.parentNode;
      src || (src = a.href);
      if (/\.pdf$/.test(src)) {
        return;
      }
      thumb.hidden = true;
      $.addClass(thumb.parentNode.parentNode.parentNode.parentNode, 'image_expanded');
      if ((img = thumb.nextSibling) && img.tagName.toLowerCase() === 'img') {
        img.hidden = false;
        return;
      }
      img = $.el('img', {
        src: src,
        className: 'fullSize'
      });
      $.on(img, 'error', ImageExpand.error);
      return $.after(thumb, img);
    },
    error: function() {
      var src, thumb, timeoutID, url;

      thumb = this.previousSibling;
      ImageExpand.contract(thumb);
      $.rm(this);
      src = this.src.split('/');
      if (!(src[2] === 'images.4chan.org' && (url = Redirect.image(src[3], src[5])))) {
        if (g.dead) {
          return;
        }
        url = "//images.4chan.org/" + src[3] + "/src/" + src[5];
      }
      if ($.engine !== 'webkit' && url.split('/')[2] === 'images.4chan.org') {
        return;
      }
      timeoutID = setTimeout(ImageExpand.expand, 10000, thumb, url);
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
    },
    dialog: function() {
      var controls, imageType, select;

      controls = $.el('div', {
        id: 'imgControls',
        innerHTML: "<div id=imgContainer><select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label><input type=checkbox id=imageExpand>Expand Images</label></div>"
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

  ImageHover = {
    init: function() {
      QuoteInline.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      if (!post.img || post.hasPDF) {
        return;
      }
      return $.on(post.img, 'mouseover', ImageHover.mouseover);
    },
    mouseover: function() {
      var el;

      if (el = $.id('ihover')) {
        if (el === UI.el) {
          delete UI.el;
        }
        $.rm(el);
      }
      if (UI.el) {
        return;
      }
      el = UI.el = $.el('img', {
        id: 'ihover',
        src: this.parentNode.href
      });
      $.add(d.body, el);
      $.on(el, 'load', ImageHover.load);
      $.on(el, 'error', ImageHover.error);
      $.on(this, 'mousemove', UI.hover);
      return $.on(this, 'mouseout', ImageHover.mouseout);
    },
    load: function() {
      var style;

      if (!this.parentNode) {
        return;
      }
      style = this.style;
      return UI.hover({
        clientX: -45 + parseInt(style.left),
        clientY: 120 + parseInt(style.top)
      });
    },
    error: function() {
      var src, timeoutID, url,
        _this = this;

      src = this.src.split('/');
      if (!(src[2] === 'images.4chan.org' && (url = Redirect.image(src[3], src[5])))) {
        if (g.dead) {
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
    },
    mouseout: function() {
      UI.hoverend();
      $.off(this, 'mousemove', UI.hover);
      return $.off(this, 'mouseout', ImageHover.mouseout);
    }
  };

  ImageReplace = {
    init: function() {
      if (g.BOARD === 'f') {
        return;
      }
      QuoteInline.callbacks.push(this.node);
      QuotePreview.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var el, href, img, type;

      img = post.img;
      if (post.el.hidden || !img || /spoiler/.test(img.src)) {
        return;
      }
      if (Conf["Replace " + ((type = ((href = img.parentNode.href).match(/\w{3}$/))[0].toUpperCase()) === 'PEG' ? 'JPG' : type)]) {
        el = $.el('img');
        el.setAttribute('data-id', post.ID);
        $.on(el, 'load', function() {
          return img.src = el.src;
        });
        return el.src = href;
      }
    }
  };

  Prefetch = {
    init: function() {
      if (g.BOARD === 'f') {
        return;
      }
      return this.dialog();
    },
    dialog: function() {
      var controls, first, input;

      controls = $.el('label', {
        id: 'prefetch',
        innerHTML: "<input type=checkbox>Prefetch Images"
      });
      input = $('input', controls);
      $.on(input, 'change', Prefetch.change);
      first = $.id('delform').firstElementChild;
      if (first.id === 'imgControls') {
        return $.after(first, controls);
      } else {
        return $.before(first, controls);
      }
    },
    change: function() {
      var thumb, _i, _len, _ref;

      $.off(this, 'change', Prefetch.change);
      _ref = $$('a.fileThumb');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thumb = _ref[_i];
        $.el('img', {
          src: thumb.href
        });
      }
      return Main.callbacks.push(Prefetch.node);
    },
    node: function(post) {
      var img;

      img = post.img;
      if (post.el.hidden || !img) {
        return;
      }
      return $.el('img', {
        src: img.parentNode.href
      });
    }
  };

  RevealSpoilers = {
    init: function() {
      QuotePreview.callbacks.push(this.node);
      ExpandComment.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var img, s;

      img = post.img;
      if (!(img && /^Spoiler/.test(img.alt)) || post.isArchived) {
        return;
      }
      img.removeAttribute('style');
      s = img.style;
      s.maxHeight = s.maxWidth = /\bop\b/.test(post["class"]) ? '250px' : '125px';
      return img.src = "//thumbs.4chan.org" + (img.parentNode.pathname.replace(/src(\/\d+).+$/, 'thumb$1s.jpg'));
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
        this.links.push(this.createSauceLink(link.trim()));
      }
      if (!this.links.length) {
        return;
      }
      return Main.callbacks.push(this.node);
    },
    createSauceLink: function(link) {
      var domain, el, href, m;

      link = link.replace(/(\$\d)/g, function(parameter) {
        switch (parameter) {
          case '$1':
            return "' + (isArchived ? img.firstChild.src : 'http://thumbs.4chan.org' + img.pathname.replace(/src(\\/\\d+).+$/, 'thumb$1s.jpg')) + '";
          case '$2':
            return "' + img.href + '";
          case '$3':
            return "' + encodeURIComponent(img.firstChild.dataset.md5) + '";
          case '$4':
            return g.BOARD;
          default:
            return parameter;
        }
      });
      domain = (m = link.match(/;text:(.+)$/)) ? m[1] : link.match(/(\w+)\.\w+\//)[1];
      href = link.replace(/;text:.+$/, '');
      href = Function('img', 'isArchived', "return '" + href + "'");
      el = $.el('a', {
        target: '_blank',
        textContent: domain
      });
      return function(img, isArchived) {
        var a;

        a = el.cloneNode(true);
        a.href = href(img, isArchived);
        return a;
      };
    },
    node: function(post) {
      var img, link, nodes, _i, _len, _ref;

      img = post.img;
      if (!img) {
        return;
      }
      img = img.parentNode;
      nodes = [];
      _ref = Sauce.links;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        nodes.push($.tn('\u00A0'), link(img, post.isArchived));
      }
      return $.add(post.fileInfo, nodes);
    }
  };

  Linkify = {
    init: function() {
      if (Conf['Embedding']) {
        QuoteInline.callbacks.push(function(post) {
          var embed, _i, _len, _ref;

          _ref = $$('.embed', post.blockquote);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            embed = _ref[_i];
            $.on(embed, 'click', Linkify.toggle);
          }
        });
      }
      QuotePreview.callbacks.push(this.node);
      ExpandComment.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    regString: /(\b([a-z]+:\/\/|[a-z]{3,}\.[-a-z0-9]+\.[a-z]+|[-a-z0-9]+\.[a-z]{2,4}|[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+|[a-z]{3,}:[a-z0-9?]|[a-z0-9._%+-:]+@[a-z0-9.-]+\.[a-z0-9])[^\s'"]+)/gi,
    cypher: $.el('div'),
    node: function(post) {
      var a, child, cypher, cypherText, data, i, index, len, link, links, lookahead, name, next, node, nodes, snapshot, spoiler, text, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;

      snapshot = $.X('.//text()', post.blockquote);
      cypher = Linkify.cypher;
      i = -1;
      len = snapshot.snapshotLength;
      _results = [];
      while (++i < len) {
        nodes = $.frag();
        node = snapshot.snapshotItem(i);
        data = node.data;
        if (!(node.parentNode && Linkify.regString.test(data))) {
          continue;
        }
        Linkify.regString.lastIndex = 0;
        cypherText = [];
        if (next = node.nextSibling) {
          cypher.textContent = node.textContent;
          cypherText[0] = cypher.innerHTML;
          while ((next.nodeName.toLowerCase() === 'wbr' || next.nodeName.toLowerCase() === 's') && (lookahead = next.nextSibling) && ((name = lookahead.nodeName) === "#text" || name.toLowerCase() === 'br')) {
            cypher.textContent = lookahead.textContent;
            cypherText.push((spoiler = next.innerHTML) ? "<s>" + (spoiler.replace(/</g, ' <')) + "</s>" : '<wbr>');
            cypherText.push(cypher.innerHTML);
            $.rm(next);
            next = lookahead.nextSibling;
            if (lookahead.nodeName === "#text") {
              $.rm(lookahead);
            }
            if (!next) {
              break;
            }
          }
        }
        if (cypherText.length) {
          data = cypherText.join('');
        }
        links = data.match(Linkify.regString);
        for (_i = 0, _len = links.length; _i < _len; _i++) {
          link = links[_i];
          index = data.indexOf(link);
          if (text = data.slice(0, index)) {
            cypher.innerHTML = text;
            _ref = __slice.call(cypher.childNodes);
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              child = _ref[_j];
              $.add(nodes, child);
            }
          }
          cypher.innerHTML = (link.indexOf(':') < 0 ? (link.indexOf('@') > 0 ? 'mailto:' + link : 'http://' + link) : link).replace(/<(wbr|s|\/s)>/g, '');
          a = $.el('a', {
            innerHTML: link,
            className: 'linkify',
            rel: 'nofollow noreferrer',
            target: '_blank',
            href: cypher.textContent
          });
          $.add(nodes, Linkify.embedder(a));
          data = data.slice(index + link.length);
        }
        if (data) {
          cypher.innerHTML = data;
          _ref1 = __slice.call(cypher.childNodes);
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            child = _ref1[_k];
            $.add(nodes, child);
          }
        }
        _results.push($.replace(node, nodes));
      }
      return _results;
    },
    toggle: function() {
      var el, embed, style, type, url;

      embed = this.previousElementSibling;
      if (this.className.contains("embedded")) {
        el = $.el('a', {
          rel: 'nofollow noreferrer',
          target: 'blank',
          className: 'linkify',
          href: url = this.getAttribute("data-originalURL"),
          textContent: this.getAttribute("data-title") || url
        });
        this.textContent = '(embed)';
      } else {
        el = (type = Linkify.types[this.getAttribute("data-service")]).el.call(this);
        el.style.cssText = (style = type.style) ? style : "border: 0; width: " + ($.get('embedWidth', Config['embedWidth'])) + "px; height: " + ($.get('embedHeight', Config['embedHeight'])) + "px";
        this.textContent = '(unembed)';
      }
      $.replace(embed, el);
      return $.toggleClass(this, 'embedded');
    },
    types: {
      YouTube: {
        regExp: /.*(?:youtu.be\/|youtube.*v=|youtube.*\/embed\/|youtube.*\/v\/|youtube.*videos\/)([^#\&\?]*).*/,
        el: function() {
          return $.el('iframe', {
            src: "//www.youtube.com/embed/" + this.name
          });
        },
        title: {
          api: function() {
            return "https://gdata.youtube.com/feeds/api/videos/" + this.name + "?alt=json&fields=title/text(),yt:noembed,app:control/yt:state/@reasonCode";
          },
          text: function() {
            return JSON.parse(this.responseText).entry.title.$t;
          }
        }
      },
      Vocaroo: {
        regExp: /.*(?:vocaroo.com\/)([^#\&\?]*).*/,
        style: 'border: 0; width: 150px; height: 45px;',
        el: function() {
          return $.el('object', {
            innerHTML: "<embed src='http://vocaroo.com/player.swf?playMediaID=" + (this.name.replace(/^i\//, '')) + "&autoplay=0' width='150' height='45' pluginspage='http://get.adobe.com/flashplayer/' type='application/x-shockwave-flash'></embed>"
          });
        }
      },
      Vimeo: {
        regExp: /.*(?:vimeo.com\/)([^#\&\?]*).*/,
        el: function() {
          return $.el('iframe', {
            src: "//player.vimeo.com/video/" + this.name
          });
        },
        title: {
          api: function() {
            return "https://vimeo.com/api/oembed.json?url=http://vimeo.com/" + this.name;
          },
          text: function() {
            return JSON.parse(this.responseText).title;
          }
        }
      },
      LiveLeak: {
        regExp: /.*(?:liveleak.com\/view.+i=)([0-9a-z_]+)/,
        el: function() {
          return $.el('iframe', {
            src: "http://www.liveleak.com/e/" + this.name + "?autostart=true"
          });
        }
      },
      audio: {
        regExp: /(.*\.(mp3|ogg|wav))$/,
        el: function() {
          return $.el('audio', {
            controls: 'controls',
            preload: 'auto',
            src: this.name
          });
        }
      },
      SoundCloud: {
        regExp: /.*(?:soundcloud.com\/|snd.sc\/)([^#\&\?]*).*/,
        style: 'height: auto; width: 500px; display: inline-block;',
        el: function() {
          var div;

          div = $.el('div', {
            className: "soundcloud",
            name: "soundcloud"
          });
          $.ajax("//soundcloud.com/oembed?show_artwork=false&&maxwidth=500px&show_comments=false&format=json&url=" + (this.getAttribute('data-originalURL')) + "&color=" + (Style.colorToHex(Themes[Conf['theme']]['Background Color'])), {
            div: div,
            onloadend: function() {
              return this.div.innerHTML = JSON.parse(this.responseText).html;
            }
          }, false);
          return div;
        }
      },
      pastebin: {
        regExp: /.*(?:pastebin.com\/)([^#\&\?]*).*/,
        el: function() {
          var div;

          return div = $.el('iframe', {
            src: "http://pastebin.com/embed_iframe.php?i=" + this.name
          });
        }
      }
    },
    embedder: function(a) {
      var callbacks, embed, err, key, match, service, title, titles, type, _ref;

      if (!Conf['Embedding']) {
        return [a];
      }
      callbacks = function() {
        var title;

        return a.textContent = (function() {
          switch (this.status) {
            case 200:
            case 304:
              title = "[" + (embed.getAttribute('data-service')) + "] " + (service.text.call(this));
              embed.setAttribute('data-title', title);
              titles[embed.name] = [title, Date.now()];
              $.set('CachedTitles', titles);
              return title;
            case 404:
              return "[" + key + "] Not Found";
            case 403:
              return "[" + key + "] Forbidden or Private";
            default:
              return "[" + key + "] " + this.status + "'d";
          }
        }).call(this);
      };
      _ref = Linkify.types;
      for (key in _ref) {
        type = _ref[key];
        if (!(match = a.href.match(type.regExp))) {
          continue;
        }
        embed = $.el('a', {
          name: (a.name = match[1]),
          className: 'embedlink',
          href: 'javascript:;',
          textContent: '(embed)'
        });
        embed.setAttribute('data-service', key);
        embed.setAttribute('data-originalURL', a.href);
        $.on(embed, 'click', Linkify.toggle);
        if (Conf['Link Title'] && (service = type.title)) {
          titles = $.get('CachedTitles', {});
          if (title = titles[match[1]]) {
            a.textContent = title[0];
            embed.setAttribute('data-title', title[0]);
          } else {
            try {
              $.cache(service.api.call(a), callbacks);
            } catch (_error) {
              err = _error;
              a.innerHTML = "[" + key + "] <span class=warning>Title Link Blocked</span> (are you using NoScript?)</a>";
            }
          }
        }
        return [a, $.tn(' '), embed];
      }
      return [a];
    }
  };

  ArchiveLink = {
    init: function() {
      var div, entry, key, type, _ref;

      div = $.el('div', {
        textContent: 'Archive'
      });
      entry = {
        el: div,
        open: function(post) {
          var path;

          path = $('a[title="Highlight this post"]', post.el).pathname.split('/');
          if ((Redirect.to({
            board: path[1],
            threadID: path[3],
            postID: post.ID
          })) === ("//boards.4chan.org/" + path[1] + "/")) {
            return false;
          }
          post.info = [path[1], path[3]];
          return true;
        },
        children: []
      };
      _ref = {
        Post: 'apost',
        Name: 'name',
        Tripcode: 'tripcode',
        'E-mail': 'email',
        Subject: 'subject',
        Filename: 'filename',
        'Image MD5': 'md5'
      };
      for (key in _ref) {
        type = _ref[key];
        entry.children.push(this.createSubEntry(key, type));
      }
      return Menu.addEntry(entry);
    },
    createSubEntry: function(text, type) {
      var el, open;

      el = $.el('a', {
        textContent: text,
        target: '_blank'
      });
      open = function(post) {
        var value;

        if (type === 'apost') {
          el.href = Redirect.to({
            board: post.info[0],
            threadID: post.info[1],
            postID: post.ID
          });
          return true;
        }
        value = Filter[type](post);
        if (!value) {
          return false;
        }
        return el.href = Redirect.to({
          board: post.info[0],
          type: type,
          value: value,
          isSearch: true
        });
      };
      return {
        el: el,
        open: open
      };
    }
  };

  DeleteLink = {
    init: function() {
      var aImage, aPost, children, div;

      div = $.el('div', {
        className: 'delete_link',
        textContent: 'Delete'
      });
      aPost = $.el('a', {
        className: 'delete_post',
        href: 'javascript:;'
      });
      aImage = $.el('a', {
        className: 'delete_image',
        href: 'javascript:;'
      });
      children = [];
      children.push({
        el: aPost,
        open: function() {
          aPost.textContent = 'Post';
          $.on(aPost, 'click', DeleteLink["delete"]);
          return true;
        }
      });
      children.push({
        el: aImage,
        open: function(post) {
          if (!post.img) {
            return false;
          }
          aImage.textContent = 'Image';
          $.on(aImage, 'click', DeleteLink["delete"]);
          return true;
        }
      });
      Menu.addEntry({
        el: div,
        open: function(post) {
          var node, seconds;

          if (post.isArchived) {
            return false;
          }
          node = div.firstChild;
          if (seconds = DeleteLink.cooldown[post.ID]) {
            node.textContent = "Delete (" + seconds + ")";
            DeleteLink.cooldown.el = node;
          } else {
            node.textContent = 'Delete';
            delete DeleteLink.cooldown.el;
          }
          return true;
        },
        children: children
      });
      return $.on(d, 'QRPostSuccessful', this.cooldown.start);
    },
    "delete": function() {
      var board, form, id, m, menu, pwd, self;

      menu = $.id('menu');
      id = menu.dataset.id;
      if (DeleteLink.cooldown[id]) {
        return;
      }
      $.off(this, 'click', DeleteLink["delete"]);
      this.textContent = 'Deleting...';
      pwd = (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $.id('delPassword').value;
      board = $('a[title="Highlight this post"]', $.id(menu.dataset.rootid)).pathname.split('/')[1];
      self = this;
      form = {
        mode: 'usrdel',
        onlyimgdel: /\bdelete_image\b/.test(this.className),
        pwd: pwd
      };
      form[id] = 'delete';
      return $.ajax($.id('delform').action.replace("/" + g.BOARD + "/", "/" + board + "/"), {
        onload: function() {
          return DeleteLink.load(self, this.response);
        },
        onerror: function() {
          return DeleteLink.error(self);
        }
      }, {
        form: $.formData(form)
      });
    },
    load: function(self, html) {
      var doc, msg, s;

      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      if (doc.title === '4chan - Banned') {
        s = 'Banned!';
      } else if (msg = doc.getElementById('errmsg')) {
        s = msg.textContent;
        $.on(self, 'click', DeleteLink["delete"]);
      } else {
        s = 'Deleted';
      }
      return self.textContent = s;
    },
    error: function(self) {
      self.textContent = 'Connection error, please retry.';
      return $.on(self, 'click', DeleteLink["delete"]);
    },
    cooldown: {
      start: function(e) {
        var seconds;

        seconds = g.BOARD === 'q' ? 600 : 30;
        return DeleteLink.cooldown.count(e.detail.postID, seconds, seconds);
      },
      count: function(postID, seconds, length) {
        var el;

        if (!((0 <= seconds && seconds <= length))) {
          return;
        }
        setTimeout(DeleteLink.cooldown.count, 1000, postID, seconds - 1, length);
        el = DeleteLink.cooldown.el;
        if (seconds === 0) {
          if (el != null) {
            el.textContent = 'Delete';
          }
          delete DeleteLink.cooldown[postID];
          delete DeleteLink.cooldown.el;
          return;
        }
        if (el != null) {
          el.textContent = "Delete (" + seconds + ")";
        }
        return DeleteLink.cooldown[postID] = seconds;
      }
    }
  };

  DownloadLink = {
    init: function() {
      var a;

      if ($.el('a').download == null) {
        return;
      }
      a = $.el('a', {
        className: 'download_link',
        textContent: 'Download file'
      });
      return Menu.addEntry({
        el: a,
        open: function(post) {
          var fileText;

          if (!post.img) {
            return false;
          }
          a.href = post.img.parentNode.href;
          fileText = post.fileInfo.firstElementChild;
          a.download = Conf['File Info Formatting'] ? fileText.dataset.filename : $('span', fileText).title;
          return true;
        }
      });
    }
  };

  EmbedLink = {
    init: function() {
      var a;

      a = $.el('a', {
        className: 'embed_link',
        textContent: 'Embed all in post'
      });
      $.on(a, 'click', EmbedLink.toggle);
      return Menu.addEntry({
        el: a,
        open: function(post) {
          var quote;

          if ($('.embed', (quote = post.blockquote))) {
            if ($('.embedded', quote)) {
              this.el.textContent = 'Unembed all in post';
              EmbedLink[post.id] = true;
            }
            $.on(this.el, 'click', this.toggle);
            return true;
          }
          return false;
        }
      });
    },
    toggle: function() {
      var embed, id, menu, root, _i, _len, _ref;

      menu = $.id('menu');
      id = menu.dataset.id;
      root = $.id("m" + id);
      _ref = $$('.embed', root);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        embed = _ref[_i];
        if ((!EmbedLink[id] && embed.className.contains('embedded')) || (EmbedLink[id] && !embed.className.contains('embedded'))) {
          continue;
        }
        embed.click();
      }
      return EmbedLink[id] = !EmbedLink[id];
    }
  };

  Menu = {
    entries: [],
    init: function() {
      this.a = $.el('a', {
        className: 'menu_button',
        href: 'javascript:;',
        innerHTML: '[<span class=dropmarker></span>]'
      });
      this.el = $.el('div', {
        className: 'reply dialog',
        id: 'menu',
        tabIndex: 0
      });
      $.on(this.el, 'click', function(e) {
        return e.stopPropagation();
      });
      $.on(this.el, 'keydown', this.keybinds);
      $.on(d, 'AddMenuEntry', function(e) {
        return Menu.addEntry(e.detail);
      });
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var a;

      if (post.isInlined && !post.isCrosspost) {
        a = $('.menu_button', post.el);
      } else {
        a = Menu.a.cloneNode(true);
        $.add($('.postInfo', post.el), [$.tn('\u00A0'), a]);
      }
      return $.on(a, 'click', Menu.toggle);
    },
    toggle: function(e) {
      var lastOpener, post;

      e.preventDefault();
      e.stopPropagation();
      if (Menu.el.parentNode) {
        lastOpener = Menu.lastOpener;
        Menu.close();
        if (lastOpener === this) {
          return;
        }
      }
      Menu.lastOpener = this;
      post = /\bhidden_thread\b/.test(this.parentNode.className) ? $.x('ancestor::div[parent::div[@class="board"]]/child::div[contains(@class,"opContainer")]', this) : $.x('ancestor::div[contains(@class,"postContainer")][1]', this);
      return Menu.open(this, Main.preParse(post));
    },
    open: function(button, post) {
      var bLeft, bRect, bTop, el, entry, funk, mRect, _i, _len, _ref;

      el = Menu.el;
      el.setAttribute('data-id', post.ID);
      el.setAttribute('data-rootid', post.root.id);
      funk = function(entry, parent) {
        var child, children, subMenu, _i, _len;

        children = entry.children;
        if (!entry.open(post)) {
          return;
        }
        $.add(parent, entry.el);
        if (!children) {
          return;
        }
        if (subMenu = $('.subMenu', entry.el)) {
          $.rm(subMenu);
        }
        subMenu = $.el('div', {
          className: 'reply dialog subMenu'
        });
        $.add(entry.el, subMenu);
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          funk(child, subMenu);
        }
      };
      _ref = Menu.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        funk(entry, el);
      }
      Menu.focus($('.entry', Menu.el));
      $.on(d, 'click', Menu.close);
      $.add(d.body, el);
      mRect = el.getBoundingClientRect();
      bRect = button.getBoundingClientRect();
      bTop = d.documentElement.scrollTop + d.body.scrollTop + bRect.top;
      bLeft = d.documentElement.scrollLeft + d.body.scrollLeft + bRect.left;
      el.style.top = bRect.top + bRect.height + mRect.height < d.documentElement.clientHeight ? bTop + bRect.height + 2 + 'px' : bTop - mRect.height - 2 + 'px';
      el.style.left = bRect.left + mRect.width < d.documentElement.clientWidth ? bLeft + 'px' : bLeft + bRect.width - mRect.width + 'px';
      return el.focus();
    },
    close: function() {
      var el, focused, _i, _len, _ref;

      el = Menu.el;
      $.rm(el);
      _ref = $$('.focused.entry', el);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        focused = _ref[_i];
        $.rmClass(focused, 'focused');
      }
      el.innerHTML = null;
      el.removeAttribute('style');
      delete Menu.lastOpener;
      delete Menu.focusedEntry;
      return $.off(d, 'click', Menu.close);
    },
    keybinds: function(e) {
      var el, next, subMenu;

      el = Menu.focusedEntry;
      switch (Keybinds.keyCode(e) || e.keyCode) {
        case 'Esc':
          Menu.lastOpener.focus();
          Menu.close();
          break;
        case 13:
        case 32:
          el.click();
          break;
        case 'Up':
          if (next = el.previousElementSibling) {
            Menu.focus(next);
          }
          break;
        case 'Down':
          if (next = el.nextElementSibling) {
            Menu.focus(next);
          }
          break;
        case 'Right':
          if ((subMenu = $('.subMenu', el)) && (next = subMenu.firstElementChild)) {
            Menu.focus(next);
          }
          break;
        case 'Left':
          if (next = $.x('parent::*[contains(@class,"subMenu")]/parent::*', el)) {
            Menu.focus(next);
          }
          break;
        default:
          return;
      }
      e.preventDefault();
      return e.stopPropagation();
    },
    focus: function(el) {
      var focused, _i, _len, _ref;

      if (focused = $.x('parent::*/child::*[contains(@class,"focused")]', el)) {
        $.rmClass(focused, 'focused');
      }
      _ref = $$('.focused', el);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        focused = _ref[_i];
        $.rmClass(focused, 'focused');
      }
      Menu.focusedEntry = el;
      return $.addClass(el, 'focused');
    },
    addEntry: function(entry) {
      var funk;

      funk = function(entry) {
        var child, children, el, _i, _len;

        el = entry.el, children = entry.children;
        $.addClass(el, 'entry');
        $.on(el, 'focus mouseover', function(e) {
          e.stopPropagation();
          return Menu.focus(this);
        });
        if (!children) {
          return;
        }
        $.addClass(el, 'hasSubMenu');
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          funk(child);
        }
      };
      funk(entry);
      return Menu.entries.push(entry);
    }
  };

  ReplyHideLink = {
    init: function() {
      var a;

      if (!Conf['Reply Hiding']) {
        Main.callbacks.push(this.node);
      }
      a = $.el('a', {
        className: 'reply_hide_link',
        href: 'javascript:;',
        textContent: 'Hide / Restore Post'
      });
      $.on(a, 'click', function() {
        var button, id, menu, root;

        menu = Menu.el;
        id = menu.dataset.id;
        root = $.id("pc" + id);
        button = root.firstChild;
        ReplyHiding.toggle(button, root, id);
        return Menu.close();
      });
      return Menu.addEntry({
        el: a,
        open: function(post) {
          if (post.isInlined || post.el.classList.contains('op')) {
            return false;
          } else {
            return true;
          }
        }
      });
    },
    node: function(post) {
      if (post.isInlined || post.ID === post.threadID) {
        return;
      }
      if (post.ID in g.hiddenReplies) {
        return ReplyHiding.hide(post.root);
      }
    }
  };

  ReportLink = {
    init: function() {
      var a;

      a = $.el('a', {
        className: 'report_link',
        href: 'javascript:;',
        textContent: 'Report this post'
      });
      $.on(a, 'click', this.report);
      return Menu.addEntry({
        el: a,
        open: function(post) {
          return post.isArchived === false;
        }
      });
    },
    report: function() {
      var a, id, set, url;

      a = $('a[title="Highlight this post"]', $.id(this.parentNode.dataset.rootid));
      url = "//sys.4chan.org/" + (a.pathname.split('/')[1]) + "/imgboard.php?mode=report&no=" + this.parentNode.dataset.id;
      id = Date.now();
      set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200";
      return window.open(url, id, set);
    }
  };

  ThreadHideLink = {
    init: function() {
      var a;

      if (!Conf['Thread Hiding']) {
        $.ready(this.iterate);
      }
      a = $.el('a', {
        className: 'thread_hide_link',
        href: 'javascript:;',
        textContent: 'Hide / Restore Thread'
      });
      $.on(a, 'click', function() {
        var menu, thread;

        menu = Menu.el;
        thread = $.id("t" + menu.dataset.id);
        ThreadHiding.toggle(thread);
        return Menu.close();
      });
      return Menu.addEntry({
        el: a,
        open: function(post) {
          if (post.el.classList.contains('op')) {
            return true;
          } else {
            return false;
          }
        }
      });
    },
    iterate: function() {
      var thread, _i, _len, _ref;

      ThreadHiding.hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      _ref = $$('.thread');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        if (thread.id.slice(1) in ThreadHiding.hiddenThreads) {
          ThreadHiding.hide(thread);
        }
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
      this.unreadDead = this.unreadSFW = this.unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA';
      switch (Conf['favicon']) {
        case 'ferongr':
          this.unreadDead += 'BAAAAAQBAMAAADt3eJSAAAAD1BMVEWrVlbpCwJzBQD/jIzlCgLerRyUAAAAAXRSTlMAQObYZgAAAFhJREFUeF5Fi8ENw0AMw6gNZHcCXbJAkw2C7D9Tz68KJKAP+a8MKtAK9DJ9X9ZxB+WT/rbpt9L1Bq3lEapGgBqY3hvYfTagY6rLKHPa6DzTz2PothJAApsfXPUIxXEAtJ4AAAAASUVORK5CYII=';
          this.unreadNSFW += 'BAAAAAQCAMAAAAoLQ9TAAAAFVBMVEWJq3ho/gooegBJ3ABU/QBW/wHV/8Hz/s/JAAAAAnRSTlMAscr1TiIAAABVSURBVBjTZY5LDgAxCEKNovc/8mgozq9d+CQRMPs/AC+Auz8BXlUfyGzoPZN7xNDoEVR0u2Zy3ziTsEV0oj5eTCn1KaVQGTpCHiH64wzegKZYV8M9Lia0Aj8l3NBcAAAAAElFTkSuQmCC';
          this.unreadSFW += 'BAAAAAQCAMAAAAoLQ9TAAAAFVBMVEUAS1QAnbAAsseF5vMA2fMA1/EAb37J/JegAAAAA3RSTlMAmPz35Xr7AAAAUUlEQVQY02WOCQ4AIQgDSUr5/5Pl9NjVhE6bYBX5H5IP0MxuoAH4gKqDe9XyZFDkPlirt+bjjyae2X2cWR7VgvkPpqWSoA60g7wtMsmWTIRHFpbuAyerdnAvAAAAAElFTkSuQmCC';
          break;
        case 'xat-':
          this.unreadDead += 'BAAAAAQBAMAAADt3eJSAAAAG1BMVEXzZmTzZGLzZGLzZGIAAAD/AAD/lJX4bWz/0tMaHcyBAAAABHRSTlMAm8l+71ABtwAAAFpJREFUeF5ty9EJgDAQA9B8dIGKC1gcoQNUm+ICvRWKAwjdwLklCAXBfD2SO/yE2ftIwFkNoVgCih2XVTWCGrI1EsDUz7svH2gSoo4zxruwry/KNlfBOSAljDwk8xZR3HxWZAAAAABJRU5ErkJggg==';
          this.unreadNSFW += 'BAAAAAQBAMAAADt3eJSAAAAIVBMVEVirGJdqF9dqF9dqF9dqF9082JmzDOq/5oAAACR/33Z/9JztnAYAAAABXRSTlMAyZ2Ses9C/CQAAABjSURBVHhebcsxDkBAFATQKbddGq1otJxij8AFJnsFqiVr8x1AuIFr8iMRhaleZv7HTyS2lRPA0FubGIDEpaPXhutBbUT2QQRA2Y/nln3R6JQDcHoc8b4rpuJBmmuvMAYIAW8utWkfv3LWVYEAAAAASUVORK5CYII=';
          this.unreadSFW += 'BAAAAAQBAMAAADt3eJSAAAAHlBMVEUAAABde6Zde6Zde6Zde6aQz/8umMNquPcAAADQ6/+nHRY3AAAABXRSTlMAyZ16kvc074oAAABfSURBVHhebcuxCYAwFIThv0yrWNgKFo6QVnewcIFHNohlNBDfAu4rDyFYeNXHHcdPNC+jV3ASmqZIgiLXLsEagzWq66oKDHG7Y/vFbFMHeHtl6t1w9C/KOQWDc5ASNQ9glx6N+XFPbgAAAABJRU5ErkJggg==';
          break;
        case 'Mayhem':
          this.unreadDead += 'BAAAAAQBAMAAADt3eJSAAAAHlBMVEUAAAAAAAAAAAAAAAAAAAATExMBAQEAAAD/AAD///+gujywAAAACHRSTlMPJRcbLzEcM37+zgIAAAB9SURBVHheRcu9DoJAEATgcX0B+Wns7uAFRGgoCVhQ0phca8K77JXEI+6+rUujU32ZzOAXanLAFw5e91cdNEfPcVmF3+iEt8BxtOaANV51WdU2VE5FMw0O1B0YDaUOD30aZk6Bd4eT8Mfulz/OIinEeANd5yxLmwPqtqraO75dUSZT40SwmAAAAABJRU5ErkJggg==';
          this.unreadNSFW += 'BAAAAAQBAMAAADt3eJSAAAAHlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9mzDPTSEsdAAAACHRSTlMaDCUeLg4zKeknoAsAAACHSURBVHheJcqxCsIwEMbxLw2CY27oLiSCYwioeyjS0Sp9Ah26d+koUtrkDXJv6xXhhj+/70B9R1T3BBN8V2urUKXV6ykdsOcSXeYPLpnXictLZAuRKqXokvzc3duGW9zBXBsbmlHBuG2KEi3PcgrPzMvA5YzHP44ieW6LiDkNNixfBYIHNOgHHmcn+8KfmKQAAAAASUVORK5CYII=';
          this.unreadSFW += 'BAAAAAQBAMAAADt3eJSAAAAG1BMVEUAAAAAAAABAwMAAAAAAAAAAAAAAAAumMP///+/4sWwAAAAB3RSTlMVJxQdMSkcONaevAAAAIJJREFUeF4lirEKgzAURa9PcBai4PjI0NlA6y61kFXawVHq4h+8rEI0+ewmdLqHcw80SGtOw2Yg3hShiGdfLrHGLm5ug1y4Bzk6cc9kMiRTxDi3MTVVMykzjSv48VLm8yZwk6+RcFvEWzm/KEMG16P4Q51M8NYlw51Vxh8EXQ3AtuofzNIkEO8Bb0kAAAAASUVORK5CYII=';
          break;
        case '4chanJS':
          this.unreadDead += 'BAAAAAQCAMAAAAoLQ9TAAAAD1BMVEUBAAAAAAD/AABnZ2f///8nFk05AAAAAXRSTlMAQObYZgAAAEFJREFUeNqNjgEKACAMAjvX/98cAkkxgmSgO8Bt/Ai4ApJ6KKhzF3OiEMDASrGB/QWgPEHsUpN+Ng9xAETMYhDrWmeHAMcmvycWAAAAAElFTkSuQmCC';
          this.unreadNSFW += 'BAAAAAQCAMAAAAoLQ9TAAAAElBMVEUBAAAAAABmzDNlyjJnZ2f///+6o7dfAAAAAXRSTlMAQObYZgAAAERJREFUeF6NjkEKADEIA51o///lJZfQxUsHITogWi8AvwZJuxmYa25xDooBLEwOWFTYAsYVhdorLZt9Ng9xCUTCUCQ2H3F4ANrZ2WNiAAAAAElFTkSuQmCC';
          this.unreadSFW += 'BAAAAAQCAMAAAAoLQ9TAAAAD1BMVEUBAAAAAAAul8NnZ2f////82iC9AAAAAXRSTlMAQObYZgAAAEFJREFUeNqNjgEKACAMAjvX/98cAkkxgmSgO8Bt/Ai4ApJ6KKhzF3OiEMDASrGB/QWgPEHsUpN+Ng9xAETMYhDrWmeHAMcmvycWAAAAAElFTkSuQmCC';
          break;
        case 'Original':
          this.unreadDead += 'BAAAAAQCAMAAAAoLQ9TAAAAD1BMVEWYmJiYmJj///8AAAD/AACKRYF4AAAAAnRSTlMAvLREMp8AAABFSURBVBjTbY7BDgAgCEIZ+P/f3MGgXHkR3wYCvENyCEq6BVVVPzFvg03sTZjT8w4GKWKL+8ih7jPffoEaKB52KJMKnrUA5kwBxesBDg0AAAAASUVORK5CYII=';
          this.unreadNSFW += 'BAAAAAQCAMAAAAoLQ9TAAAADFBMVEWYmJj///9mzDMAAAADduU3AAAAAXRSTlMAQObYZgAAAERJREFUGNNtjkESACAIAkH+/+cOBuWUF3FnQIB3SA5BSbegquon5m2wib0Jc3rewSBFbHEfOdR95tsvUAPFww5lUsGzFpsgATH7KrmBAAAAAElFTkSuQmCC';
          this.unreadSFW += 'BAAAAAQCAMAAAAoLQ9TAAAADFBMVEWYmJj///8umMMAAACriBKaAAAAAXRSTlMAQObYZgAAAERJREFUGNNtjkESACAIAkH+/+cOBuWUF3FnQIB3SA5BSbegquon5m2wib0Jc3rewSBFbHEfOdR95tsvUAPFww5lUsGzFpsgATH7KrmBAAAAAElFTkSuQmCC';
      }
      this.unread = this.SFW ? this.unreadSFW : this.unreadNSFW;
    },
    empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  };

  IDColor = {
    init: function() {
      QuotePreview.callbacks.push(this.node);
      ExpandComment.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var str, uid;

      if (!(uid = $('.postInfo .hand', post.el))) {
        return;
      }
      str = uid.textContent;
      if (uid.nodeName === 'SPAN') {
        uid.style.cssText = IDColor.apply.call(str);
      }
      if (!IDColor.highlight[str]) {
        IDColor.highlight[str] = [];
      }
      if (str === $.get("highlightedID/" + g.BOARD + "/")) {
        IDColor.highlight.current.push(post);
        $.addClass(post.el, 'highlight');
      }
      IDColor.highlight[str].push(post);
      return $.on(uid, 'click', function() {
        return IDColor.idClick(str);
      });
    },
    ids: {},
    compute: function(str) {
      var hash, rgb;

      hash = this.hash(str);
      rgb = [(hash >> 24) & 0xFF, (hash >> 16) & 0xFF, (hash >> 8) & 0xFF];
      rgb[3] = ((rgb[0] * 0.299) + (rgb[1] * 0.587) + (rgb[2] * 0.114)) > 125;
      this.ids[str] = rgb;
      return rgb;
    },
    apply: function() {
      var rgb;

      rgb = IDColor.ids[this] || IDColor.compute(this);
      return ("background-color: rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "); color: ") + (rgb[3] ? "black;" : "white;");
    },
    hash: function(str) {
      var i, j, msg;

      msg = 0;
      i = 0;
      j = str.length;
      while (i < j) {
        msg = ((msg << 5) - msg) + str.charCodeAt(i);
        ++i;
      }
      return msg;
    },
    highlight: {
      current: []
    },
    idClick: function(str) {
      var last, post, value, _i, _j, _len, _len1, _ref, _ref1;

      _ref = this.highlight.current;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        post = _ref[_i];
        $.rmClass(post.el, 'highlight');
      }
      last = $.get(value = "highlightedID/" + g.BOARD + "/", false);
      if (str === last) {
        this.highlight.current = [];
        return $["delete"](value);
      }
      _ref1 = this.highlight[str];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        post = _ref1[_j];
        if (post.isInlined) {
          continue;
        }
        $.addClass(post.el, 'highlight');
        this.highlight.current.push(post);
      }
      return $.set(value, str);
    }
  };

  MarkOwn = {
    init: function() {
      Main.callbacks.push(this.node);
      return this.posts = $.get('ownedPosts', {});
    },
    node: function(post) {
      var owned, posts, quote, _i, _len, _ref;

      posts = MarkOwn.posts;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!(quote.hash && posts[quote.hash.slice(2)])) {
          continue;
        }
        owned = true;
        $.addClass(quote, 'ownreply');
        quote.textContent += " (You)";
      }
      if (owned) {
        $.addClass(post.el, 'quotedYou');
      }
      if (posts[post.ID]) {
        $.addClass(post.el, 'yourPost');
      }
    }
  };

  RemoveSpoilers = {
    init: function() {
      if (Conf['Indicate Spoilers']) {
        this.wrapper = function(text) {
          return "[spoiler]" + text + "[/spoiler]";
        };
      }
      return Main.callbacks.push(this.node);
    },
    wrapper: function(text) {
      return text;
    },
    node: function(post) {
      var spoiler, spoilers, _i, _len;

      spoilers = $$('s', post.el);
      for (_i = 0, _len = spoilers.length; _i < _len; _i++) {
        spoiler = spoilers[_i];
        $.replace(spoiler, $.tn(RemoveSpoilers.wrapper(spoiler.textContent)));
      }
    }
  };

  ThreadStats = {
    init: function() {
      var container, dialog, move;

      ThreadStats.postcount = $.el('span', {
        id: 'postcount',
        textContent: '0'
      });
      ThreadStats.imagecount = $.el('span', {
        id: 'imagecount',
        textContent: '0'
      });
      if (Conf['Thread Updater'] && Conf['Merged Updater and Stats'] && (move = Updater.count.parentElement)) {
        container = $.el('span');
        $.add(container, [$.tn('['), ThreadStats.postcount, $.tn(' / '), ThreadStats.imagecount, $.tn('] ')]);
        $.prepend(move, container);
      } else {
        dialog = UI.dialog('stats', 'bottom: 0; left: 0;', '<div class=move></div>');
        dialog.className = 'dialog';
        $.add($(".move", dialog), ThreadStats.postcount);
        $.add($(".move", dialog), $.tn(" / "));
        $.add($(".move", dialog), ThreadStats.imagecount);
        $.add(d.body, dialog);
      }
      this.posts = this.images = 0;
      this.imgLimit = (function() {
        switch (g.BOARD) {
          case 'a':
          case 'b':
          case 'v':
          case 'co':
          case 'mlp':
            return 251;
          case 'vg':
            return 376;
          default:
            return 151;
        }
      })();
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      if (post.isInlined) {
        return;
      }
      ThreadStats.postcount.textContent = ++ThreadStats.posts;
      if (!post.img) {
        return;
      }
      ThreadStats.imagecount.textContent = ++ThreadStats.images;
      if (ThreadStats.images > ThreadStats.imgLimit) {
        return $.addClass(ThreadStats.imagecount, 'warning');
      }
    }
  };

  TitlePost = {
    init: function() {
      return d.title = Get.title();
    }
  };

  Unread = {
    init: function() {
      this.title = d.title;
      $.on(d, 'QRPostSuccessful', this.post);
      this.update();
      $.on(window, 'scroll', Unread.scroll);
      $.on(window, 'focus', Unread.focus);
      return Main.callbacks.push(this.node);
    },
    replies: [],
    foresee: [],
    post: function(e) {
      return Unread.foresee.push(e.detail.postID);
    },
    node: function(post) {
      var count, el, index, root;

      if ((index = Unread.foresee.indexOf(post.ID)) !== -1) {
        Unread.foresee.splice(index, 1);
        return;
      }
      el = post.el, root = post.root;
      if (el.hidden || /\bop\b/.test(post["class"]) || post.isInlined) {
        return;
      }
      count = Unread.replies.push(el);
      return Unread.update(count === 1);
    },
    focus: function() {
      if (Unread.replies !== 0) {
        return Unread.count();
      }
    },
    scroll: function() {
      if (!(d.hidden || Unread.replies === 0)) {
        return Unread.count();
      }
    },
    count: function() {
      var bottom, height, i, reply, _i, _len, _ref;

      height = d.documentElement.clientHeight;
      _ref = Unread.replies;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        reply = _ref[i];
        bottom = reply.getBoundingClientRect().bottom;
        if (bottom > height) {
          break;
        }
      }
      if (i === 0) {
        return;
      }
      Unread.replies = Unread.replies.slice(i);
      return Unread.update(Unread.replies.length === 0);
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
    update: function(updateFavicon) {
      var count;

      if (!g.REPLY) {
        return;
      }
      count = this.replies.length;
      if (Conf['Unread Count']) {
        this.setTitle(count);
      }
      if (!(Conf['Unread Favicon'] && updateFavicon)) {
        return;
      }
      if ($.engine === 'presto') {
        $.rm(Favicon.el);
      }
      Favicon.el.href = g.dead ? count ? Favicon.unreadDead : Favicon.dead : count ? Favicon.unread : Favicon["default"];
      if (g.dead) {
        $.addClass(Favicon.el, 'dead');
      } else {
        $.rmClass(Favicon.el, 'dead');
      }
      if (count) {
        $.addClass(Favicon.el, 'unread');
      } else {
        $.rmClass(Favicon.el, 'unread');
      }
      if ($.engine !== 'webkit') {
        return $.add(d.head, Favicon.el);
      }
    }
  };

  Updater = {
    init: function() {
      var checkbox, checked, dialog, html, input, name, title, _i, _len, _ref;

      html = '<div class=move><span id=count></span> <span id=timer></span></div>';
      checkbox = Config.updater.checkbox;
      for (name in checkbox) {
        title = checkbox[name][1];
        checked = Conf[name] ? 'checked' : '';
        html += "<div><label title='" + title + "'>" + name + "<input name='" + name + "' type=checkbox " + checked + "></label></div>";
      }
      checked = Conf['Auto Update'] ? 'checked' : '';
      html += "      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox " + checked + "></label></div>      <div><label>Interval (s)<input type=number name=Interval" + (Conf['Interval per board'] ? "_" + g.BOARD : '') + " class=field min=1></label></div>      <div><label>BGInterval<input type=number name=BGInterval" + (Conf['Interval per board'] ? "_" + g.BOARD : '') + " class=field min=1></label></div>      <div><input value='Update Now' type=button name='Update Now'></div>";
      dialog = UI.dialog('updater', 'bottom: 0; right: 0;', html);
      this.count = $('#count', dialog);
      this.timer = $('#timer', dialog);
      this.thread = $.id("t" + g.THREAD_ID);
      this.save = [];
      this.checkPostCount = 0;
      this.unsuccessfulFetchCount = 0;
      this.lastModified = '0';
      _ref = $$('input', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        if (input.type === 'checkbox') {
          $.on(input, 'click', $.cb.checked);
        }
        switch (input.name) {
          case 'Scroll BG':
            $.on(input, 'click', this.cb.scrollBG);
            this.cb.scrollBG.call(input);
            break;
          case 'Verbose':
            $.on(input, 'click', this.cb.verbose);
            this.cb.verbose.call(input);
            break;
          case 'Auto Update This':
            $.on(input, 'click', this.cb.autoUpdate);
            this.cb.autoUpdate.call(input);
            break;
          case 'Interval':
          case 'BGInterval':
          case "Interval_" + g.BOARD:
          case "BGInterval_" + g.BOARD:
            input.value = Conf[input.name];
            $.on(input, 'change', this.cb.interval);
            this.cb.interval.call(input);
            break;
          case 'Update Now':
            $.on(input, 'click', this.update);
        }
      }
      $.add(d.body, dialog);
      $.on(d, 'QRPostSuccessful', this.cb.post);
      return $.on(d, 'visibilitychange', this.cb.visibility);
    },
    /*
    beep1.wav
    http://freesound.org/people/pierrecartoons1979/sounds/90112
    
    This work is licensed under the Attribution Noncommercial License.
    http://creativecommons.org/licenses/by-nc/3.0/
    */

    audio: $.el('audio', {
      src: 'data:audio/wav;base64,UklGRjQDAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAc21wbDwAAABBAAADAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkYXRhzAIAAGMms8em0tleMV4zIpLVo8nhfSlcPR102Ki+5JspVEkdVtKzs+K1NEhUIT7DwKrcy0g6WygsrM2k1NpiLl0zIY/WpMrjgCdbPhxw2Kq+5Z4qUkkdU9K1s+K5NkVTITzBwqnczko3WikrqM+l1NxlLF0zIIvXpsnjgydZPhxs2ay95aIrUEkdUdC3suK8N0NUIjq+xKrcz002WioppdGm091pK1w0IIjYp8jkhydXPxxq2K295aUrTkoeTs65suK+OUFUIzi7xqrb0VA0WSoootKm0t5tKlo1H4TYqMfkiydWQBxm16+85actTEseS8y7seHAPD9TIza5yKra01QyWSson9On0d5wKVk2H4DYqcfkjidUQB1j1rG75KsvSkseScu8seDCPz1TJDW2yara1FYxWSwnm9Sn0N9zKVg2H33ZqsXkkihSQR1g1bK65K0wSEsfR8i+seDEQTxUJTOzy6rY1VowWC0mmNWoz993KVc3H3rYq8TklSlRQh1d1LS647AyR0wgRMbAsN/GRDpTJTKwzKrX1l4vVy4lldWpzt97KVY4IXbUr8LZljVPRCxhw7W3z6ZISkw1VK+4sMWvXEhSPk6buay9sm5JVkZNiLWqtrJ+TldNTnquqbCwilZXU1BwpKirrpNgWFhTaZmnpquZbFlbVmWOpaOonHZcXlljhaGhpZ1+YWBdYn2cn6GdhmdhYGN3lp2enIttY2Jjco+bnJuOdGZlZXCImJqakHpoZ2Zug5WYmZJ/bGlobX6RlpeSg3BqaW16jZSVkoZ0bGtteImSk5KIeG5tbnaFkJKRinxxbm91gY2QkIt/c3BwdH6Kj4+LgnZxcXR8iI2OjIR5c3J0e4WLjYuFe3VzdHmCioyLhn52dHR5gIiKioeAeHV1eH+GiYqHgXp2dnh9hIiJh4J8eHd4fIKHiIeDfXl4eHyBhoeHhH96eHmA'
    }),
    cb: {
      post: function() {
        if (!Conf['Auto Update This']) {
          return;
        }
        Updater.unsuccessfulFetchCount = 0;
        return setTimeout(Updater.update, 500);
      },
      checkpost: function(status) {
        if (!(status === 404 || Updater.foundPost || Updater.checkPostCount >= 10)) {
          return setTimeout(Updater.update, ++Updater.checkPostCount * 500);
        }
        Updater.checkPostCount = 0;
        delete Updater.foundPost;
        return delete Updater.postID;
      },
      visibility: function() {
        if (d.hidden) {
          return;
        }
        Updater.unsuccessfulFetchCount = 0;
        if (Updater.timer.textContent < (Conf['Interval per board'] ? -Conf['Interval_' + g.BOARD] : -Conf['Interval'])) {
          return Updater.set('timer', -Updater.getInterval());
        }
      },
      interval: function() {
        var val;

        val = parseInt(this.value, 10);
        this.value = val > 0 ? val : 30;
        $.cb.value.call(this);
        return Updater.set('timer', -Updater.getInterval());
      },
      verbose: function() {
        if (Conf['Verbose']) {
          Updater.set('count', '+0');
          return Updater.timer.hidden = false;
        } else {
          Updater.set('count', '+0');
          Updater.count.className = '';
          return Updater.timer.hidden = true;
        }
      },
      autoUpdate: function() {
        if (Conf['Auto Update This'] = this.checked) {
          return Updater.timeoutID = setTimeout(Updater.timeout, 1000);
        } else {
          return clearTimeout(Updater.timeoutID);
        }
      },
      scrollBG: function() {
        return Updater.scrollBG = this.checked ? function() {
          return true;
        } : function() {
          return !d.hidden;
        };
      },
      load: function() {
        switch (this.status) {
          case 404:
            Updater.set('timer', '');
            Updater.set('count', 404);
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
            break;
          case 0:
          case 304:
            /*
            Status Code 304: Not modified
            By sending the `If-Modified-Since` header we get a proper status code, and no response.
            This saves bandwidth for both the user and the servers and avoid unnecessary computation.
            */

            Updater.unsuccessfulFetchCount++;
            Updater.set('timer', -Updater.getInterval());
            if (Conf['Verbose']) {
              Updater.set('count', '+0');
              Updater.count.className = null;
            }
            break;
          case 200:
            Updater.lastModified = this.getResponseHeader('Last-Modified');
            Updater.cb.update(JSON.parse(this.response).posts);
            Updater.set('timer', -Updater.getInterval());
            break;
          default:
            Updater.unsuccessfulFetchCount++;
            Updater.set('timer', -Updater.getInterval());
            if (Conf['Verbose']) {
              Updater.set('count', this.statusText);
              Updater.count.className = 'warning';
            }
        }
        if (Updater.postID) {
          Updater.cb.checkpost(this.status);
        }
        return delete Updater.request;
      },
      update: function(posts) {
        var count, frag, id, lastPost, node, nodes, post, scroll, spoilerRange, _i, _len, _ref;

        if (spoilerRange = posts[0].custom_spoiler) {
          Build.spoilerRange[g.BOARD] = spoilerRange;
        }
        lastPost = Updater.thread.lastElementChild;
        id = +lastPost.id.slice(2);
        nodes = (function() {
          var _i, _len, _ref, _results;

          _ref = posts.reverse();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            post = _ref[_i];
            if (post.no <= id) {
              break;
            }
            if (Updater.postID) {
              if (("" + post.no) === Updater.postID) {
                Updater.foundPost = true;
              }
            }
            _results.push(Build.postFromObject(post, g.BOARD));
          }
          return _results;
        })();
        count = nodes.length;
        if (Conf['Verbose']) {
          Updater.set('count', "+" + count);
          Updater.count.className = count ? 'new' : null;
        }
        if (count) {
          if (Conf['Beep'] && d.hidden && (Unread.replies.length === 0)) {
            Updater.audio.play();
          }
          Updater.unsuccessfulFetchCount = 0;
        } else {
          Updater.unsuccessfulFetchCount++;
          return;
        }
        scroll = Conf['Scrolling'] && Updater.scrollBG() && lastPost.getBoundingClientRect().bottom - d.documentElement.clientHeight < 25;
        _ref = nodes.reverse();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          frag = $.frag();
          $.add(frag, node);
          Main.node(Main.preParse(node));
          $.add(Updater.thread, frag);
        }
        if (scroll && (nodes != null)) {
          return nodes[0].scrollIntoView();
        }
      }
    },
    set: function(name, text) {
      var el, node;

      el = Updater[name];
      if (node = el.firstChild) {
        return node.data = text;
      } else {
        return el.textContent = text;
      }
    },
    getInput: function(input) {
      var i, number, _i, _len, _results;

      while ((i = input.length) < 10) {
        input[i] = input[i - 1];
      }
      _results = [];
      for (_i = 0, _len = input.length; _i < _len; _i++) {
        number = input[_i];
        _results.push(parseInt(number, 10));
      }
      return _results;
    },
    getInterval: function() {
      var count, i, increase, increaseString, j, string;

      string = "Interval" + (Conf['Interval per board'] ? "_" + g.BOARD : "");
      increaseString = "updateIncrease";
      if (d.hidden) {
        string = "BG" + string;
        increaseString += "B";
      }
      i = +Conf[string];
      j = (count = this.unsuccessfulFetchCount) > 9 ? 9 : count;
      return (Conf['Optional Increase'] ? (i > (increase = Updater.getInput(Conf[increaseString].split(','))[j]) ? i : increase) : i);
    },
    timeout: function() {
      var n;

      Updater.timeoutID = setTimeout(Updater.timeout, 1000);
      n = 1 + parseInt(Updater.timer.firstChild.data, 10);
      if (n === 0) {
        return Updater.update();
      } else if (n >= Updater.getInterval()) {
        Updater.unsuccessfulFetchCount++;
        Updater.set('count', 'Retry');
        Updater.count.className = null;
        return Updater.update();
      } else {
        return Updater.set('timer', n);
      }
    },
    update: function() {
      var request, url;

      Updater.set('timer', 0);
      request = Updater.request;
      if (request) {
        request.onloadend = null;
        request.abort();
      }
      url = "//api.4chan.org/" + g.BOARD + "/res/" + g.THREAD_ID + ".json";
      return Updater.request = $.ajax(url, {
        onloadend: Updater.cb.load
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
      $.on(d, 'QRPostSuccessful', this.cb.post);
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
            textContent: '×',
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
      },
      post: function(e) {
        var postID, threadID, _ref;

        _ref = e.detail, postID = _ref.postID, threadID = _ref.threadID;
        if (threadID === '0') {
          if (Conf['Auto Watch']) {
            return $.set('autoWatch', postID);
          }
        } else if (Conf['Auto Watch Reply']) {
          return Watcher.watch(threadID);
        }
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

      thread = $.id("t" + id);
      if ($('.favicon', thread).src === Favicon["default"]) {
        return false;
      }
      watched = $.get('watched', {});
      watched[_name = g.BOARD] || (watched[_name] = {});
      watched[g.BOARD][id] = {
        href: "/" + g.BOARD + "/res/" + id,
        textContent: Get.title(thread)
      };
      $.set('watched', watched);
      Watcher.refresh();
      return true;
    }
  };

  Markdown = {
    format: function(text) {
      var pattern, tag, tag_patterns;

      tag_patterns = {
        bi: /(\*\*\*|___)(?=\S)([^\r\n]*?\S)\1/g,
        b: /(\*\*|__)(?=\S)([^\r\n]*?\S)\1/g,
        i: /(\*|_)(?=\S)([^\r\n]*?\S)\1/g,
        code: /(`)(?=\S)([^\r\n]*?\S)\1/g,
        ds: /(\|\||__)(?=\S)([^\r\n]*?\S)\1/g
      };
      for (tag in tag_patterns) {
        pattern = tag_patterns[tag];
        text = text ? text.replace(pattern, Markdown.unicode_convert) : '\u0020';
      }
      return text;
    },
    unicode_convert: function(str, tag, inner) {
      var c, charcode, charcodes, codepoints, codes, fmt, i, unicode_text;

      fmt = (function() {
        switch (tag) {
          case '_':
          case '*':
            return 'i';
          case '__':
          case '**':
            return 'b';
          case '___':
          case '***':
            return 'bi';
          case '||':
            return 'ds';
          case '`':
          case '```':
            return 'code';
        }
      })();
      codepoints = {
        b: [0x1D7CE, 0x1D400, 0x1D41A],
        i: [0x1D7F6, 0x1D434, 0x1D44E],
        bi: [0x1D7CE, 0x1D468, 0x1D482],
        code: [0x1D7F6, 0x1D670, 0x1D68A],
        ds: [0x1D7D8, 0x1D538, 0x1D552]
      };
      charcodes = (function() {
        var _i, _len, _results;

        _results = [];
        for (i = _i = 0, _len = inner.length; _i < _len; i = ++_i) {
          c = inner[i];
          _results.push(inner.charCodeAt(i));
        }
        return _results;
      })();
      codes = (function() {
        var _i, _len, _results;

        _results = [];
        for (_i = 0, _len = charcodes.length; _i < _len; _i++) {
          charcode = charcodes[_i];
          if (charcode >= 48 && charcode <= 57) {
            _results.push(charcode - 48 + codepoints[fmt][0]);
          } else if (charcode >= 65 && charcode <= 90) {
            _results.push(charcode - 65 + codepoints[fmt][1]);
          } else if (charcode >= 97 && charcode <= 122) {
            if (charcode === 104 && tag === 'i') {
              _results.push(0x210E);
            } else {
              _results.push(charcode - 97 + codepoints[fmt][2]);
            }
          } else {
            _results.push(charcode);
          }
        }
        return _results;
      })();
      unicode_text = codes.map(Markdown.ucs2_encode).join('');
      if (tag === 'code') {
        unicode_text = unicode_text.replace(/\x20/g, '\xA0');
      }
      return unicode_text;
    },
    ucs2_encode: function(value) {
      /*
      From Punycode.js: https://github.com/bestiejs/punycode.js
      
      Copyright Mathias Bynens <http://mathiasbynens.be/>
      
      Permission is hereby granted, free of charge, to any person obtaining
      a copy of this software and associated documentation files (the
      "Software"), to deal in the Software without restriction, including
      without limitation the rights to use, copy, modify, merge, publish,
      distribute, sublicense, and/or sell copies of the Software, and to
      permit persons to whom the Software is furnished to do so, subject to
      the following conditions:
      
      The above copyright notice and this permission notice shall be
      included in all copies or substantial portions of the Software.
      
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF`
      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
      NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
      LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
      OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
      WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      */

      var output;

      output = '';
      if (value > 0xFFFF) {
        value -= 0x10000;
        output += String.fromCharCode(value >>> 10 & 0x3FF | 0xD800);
        value = 0xDC00 | value & 0x3FF;
      }
      return output += String.fromCharCode(value);
    }
  };

  QR = {
    init: function() {
      if (!$.id('postForm')) {
        return;
      }
      QuoteInline.callbacks.push(this.node);
      Main.callbacks.push(this.node);
      return setTimeout(this.asyncInit);
    },
    asyncInit: function() {
      var link, title;

      if (Conf['Hide Original Post Form']) {
        link = $.el('h1', {
          innerHTML: "<a href=javascript:;>" + (title = g.REPLY ? 'Reply to Thread' : 'Start a Thread') + "</a>",
          title: title
        });
        $.on(link.firstChild, 'click', function() {
          QR.open();
          if (!g.REPLY) {
            QR.threadSelector.value = g.BOARD === 'f' ? '9999' : 'new';
          }
          return $('textarea', QR.el).focus();
        });
        $.before($.id('postForm'), link);
        if (Conf['Check for Bans']) {
          BanChecker.init();
        }
      }
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
      return $.on($('a[title="Quote this post"]', $('.postInfo', post.el)), 'click', QR.quote);
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
      $.rmClass(QR.el, 'dump');
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
      return QR.autohide.checked = true;
    },
    unhide: function() {
      $.rmClass(QR.el, 'autohide');
      return QR.autohide.checked = false;
    },
    toggleHide: function() {
      return this.checked && QR.hide() || QR.unhide();
    },
    error: function(err) {
      if (typeof err === 'string') {
        QR.warning.textContent = err;
      } else {
        QR.warning.innerHTML = null;
        $.add(QR.warning, err);
      }
      QR.open();
      if (QR.captcha.isEnabled && /captcha|verification/i.test(QR.warning.textContent)) {
        $('[autocomplete]', QR.el).focus();
      }
      if (d.hidden) {
        return alert(QR.warning.textContent);
      }
    },
    cleanError: function() {
      return QR.warning.textContent = null;
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
      value = data.progress || QR.cooldown.seconds || value;
      input = QR.status.input;
      input.value = QR.cooldown.auto && Conf['Cooldown'] ? value ? "Auto " + value : 'Auto' : value || 'Submit';
      return input.disabled = disabled || false;
    },
    cooldown: {
      init: function() {
        if (!Conf['Cooldown']) {
          return;
        }
        QR.cooldown.types = {
          thread: (function() {
            switch (g.BOARD) {
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
          sage: 60,
          file: g.BOARD === 'q' ? 300 : 30,
          post: g.BOARD === 'q' ? 60 : 30
        };
        QR.cooldown.cooldowns = $.get("" + g.BOARD + ".cooldown", {});
        QR.cooldown.start();
        return $.sync("" + g.BOARD + ".cooldown", QR.cooldown.sync);
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
        var cooldown, hasFile, isReply, isSage, start, type;

        if (!Conf['Cooldown']) {
          return;
        }
        start = Date.now();
        if (data.delay) {
          cooldown = {
            delay: data.delay
          };
        } else {
          isSage = /sage/i.test(data.post.email);
          hasFile = !!data.post.file;
          isReply = data.isReply;
          type = !isReply ? 'thread' : isSage ? 'sage' : hasFile ? 'file' : 'post';
          cooldown = {
            isReply: isReply,
            isSage: isSage,
            hasFile: hasFile,
            timeout: start + QR.cooldown.types[type] * $.SECOND
          };
        }
        QR.cooldown.cooldowns[start] = cooldown;
        $.set("" + g.BOARD + ".cooldown", QR.cooldown.cooldowns);
        return QR.cooldown.start();
      },
      unset: function(id) {
        delete QR.cooldown.cooldowns[id];
        return $.set("" + g.BOARD + ".cooldown", QR.cooldown.cooldowns);
      },
      count: function() {
        var cooldown, cooldowns, elapsed, hasFile, isReply, isSage, now, post, seconds, start, type, types, update, _ref;

        if (Object.keys(QR.cooldown.cooldowns).length) {
          setTimeout(QR.cooldown.count, 1000);
        } else {
          $["delete"]("" + g.BOARD + ".cooldown");
          delete QR.cooldown.isCounting;
          delete QR.cooldown.seconds;
          QR.status();
          return;
        }
        if ((isReply = g.REPLY ? true : QR.threadSelector.value !== 'new')) {
          post = QR.replies[0];
          isSage = /sage/i.test(post.email);
          hasFile = !!post.file;
        }
        now = Date.now();
        seconds = null;
        _ref = QR.cooldown, types = _ref.types, cooldowns = _ref.cooldowns;
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
            elapsed = Math.floor((now - start) / 1000);
            if (elapsed >= 0) {
              seconds = Math.max(seconds, types[type] - elapsed);
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
        if (seconds === 0 && QR.cooldown.auto) {
          return QR.submit();
        }
      }
    },
    quote: function(e) {
      var caretPos, id, range, s, sel, ta, text, _ref;

      if (e != null) {
        e.preventDefault();
      }
      QR.open();
      if (!g.REPLY) {
        QR.threadSelector.value = $.x('ancestor::div[parent::div[@class="board"]]', this).id.slice(1);
      }
      id = this.previousSibling.hash.slice(2);
      text = ">>" + id + "\n";
      sel = d.getSelection();
      if ((s = sel.toString().trim()) && id === ((_ref = $.x('ancestor-or-self::blockquote', sel.anchorNode)) != null ? _ref.id.match(/\d+$/)[0] : void 0)) {
        s = s.replace(/\n/g, '\n>');
        text += ">" + s + "\n";
      }
      ta = $('textarea', QR.el);
      caretPos = ta.selectionStart;
      ta.value = ta.value.slice(0, caretPos) + text + ta.value.slice(ta.selectionEnd);
      range = caretPos + text.length;
      ta.setSelectionRange(range, range);
      ta.focus();
      return $.event(ta, new Event('input'));
    },
    characterCount: function() {
      var count, counter;

      counter = QR.charaCounter;
      count = this.textLength;
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
        } else if (!QR.mimeTypes.contains(file.type)) {
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
        } else if (!QR.mimeTypes.contains(file.type)) {
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
      return QR.fileEl.value = null;
    },
    replies: [],
    reply: (function() {
      function _Class() {
        var key, persona, prev,
          _this = this;

        prev = QR.replies[QR.replies.length - 1];
        persona = $.get('persona', {
          global: {}
        });
        if (!persona[key = Conf['Per Board Persona'] ? g.BOARD : 'global']) {
          persona[key] = JSON.parse(JSON.stringify(persona.global));
        }
        this.name = prev ? prev.name : persona[key].name || null;
        this.email = prev && (Conf["Remember Sage"] || !/^sage$/.test(prev.email)) ? prev.email : persona[key].email || null;
        this.sub = prev && Conf['Remember Subject'] ? prev.sub : Conf['Remember Subject'] ? persona[key].sub : null;
        this.spoiler = prev && Conf['Remember Spoiler'] ? prev.spoiler : false;
        this.com = null;
        this.el = $.el('a', {
          className: 'thumbnail',
          draggable: true,
          href: 'javascript:;',
          innerHTML: '<a class=remove>×</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
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
        this.el.title = "" + file.name + " (" + ($.bytesToString(file.size)) + ")";
        if (QR.spoiler) {
          $('label', this.el).hidden = false;
        }
        if (!/^image/.test(file.type)) {
          this.el.style.backgroundImage = null;
          return;
        }
        if (!(url = window.URL || window.webkitURL)) {
          return;
        }
        url.revokeObjectURL(this.url);
        fileUrl = url.createObjectURL(file);
        img = $.el('img');
        $.on(img, 'load', function() {
          var c, data, i, l, s, ui8a, _i;

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
          c = $.el('canvas', {
            height: img.height,
            width: img.width
          });
          c.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
          data = atob(c.toDataURL().split(',')[1]);
          l = data.length;
          ui8a = new Uint8Array(l);
          for (i = _i = 0; 0 <= l ? _i < l : _i > l; i = 0 <= l ? ++_i : --_i) {
            ui8a[i] = data.charCodeAt(i);
          }
          _this.url = url.createObjectURL(new Blob([ui8a], {
            type: 'image/png'
          }));
          _this.el.style.backgroundImage = "url(" + _this.url + ")";
          return typeof url.revokeObjectURL === "function" ? url.revokeObjectURL(fileUrl) : void 0;
        });
        return img.src = fileUrl;
      };

      _Class.prototype.rmFile = function() {
        var _base1;

        QR.resetFileInput();
        delete this.file;
        this.el.title = null;
        this.el.style.backgroundImage = null;
        if (QR.spoiler) {
          $('label', this.el).hidden = true;
        }
        return typeof (_base1 = window.URL || window.webkitURL).revokeObjectURL === "function" ? _base1.revokeObjectURL(this.url) : void 0;
      };

      _Class.prototype.select = function() {
        var check, data, field, rectEl, rectList, _i, _len, _ref, _ref1;

        if (QR.selected === this) {
          return;
        }
        if ((_ref = QR.selected) != null) {
          _ref.el.removeAttribute('id');
        }
        QR.selected = this;
        this.el.id = 'selected';
        rectEl = this.el.getBoundingClientRect();
        rectList = this.el.parentNode.getBoundingClientRect();
        this.el.parentNode.scrollLeft += rectEl.left + rectEl.width / 2 - rectList.left - rectList.width / 2;
        _ref1 = ['name', 'email', 'sub', 'com'];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          data = _ref1[_i];
          field = $("[name=" + data + "]", QR.el);
          field.value = this[data];
          if (Conf['Tripcode Hider']) {
            if (data === 'name') {
              check = /^.*##?.+/.test(this[data]);
              if (check) {
                $.addClass(field, 'tripped');
              }
              $.on(field, 'blur', function() {
                check = /^.*##?.+/.test(this.value);
                if (check && !this.className.match("\\btripped\\b")) {
                  return $.addClass(this, 'tripped');
                } else if (!check && this.className.match("\\btripped\\b")) {
                  return $.rmClass(this, 'tripped');
                }
              });
            }
          }
        }
        QR.characterCount.call($('textarea', QR.el));
        return $('#spoiler', QR.el).checked = this.spoiler;
      };

      _Class.prototype.dragStart = function() {
        return $.addClass(this, 'drag');
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
        var el, index, newIndex, oldIndex, reply;

        el = $('.drag', this.parentNode);
        index = function(el) {
          return __slice.call(el.parentNode.children).indexOf(el);
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

        $.rmClass(this, 'drag');
        if (el = $('.over', this.parentNode)) {
          return $.rmClass(el, 'over');
        }
      };

      _Class.prototype.rm = function() {
        var index, _base1;

        QR.resetFileInput();
        $.rm(this.el);
        index = QR.replies.indexOf(this);
        if (QR.replies.length === 1) {
          new QR.reply().select();
          $.rmClass(QR.el, 'dump');
        } else if (this.el.id === 'selected') {
          (QR.replies[index - 1] || QR.replies[index + 1]).select();
        }
        QR.replies.splice(index, 1);
        return typeof (_base1 = window.URL || window.webkitURL).revokeObjectURL === "function" ? _base1.revokeObjectURL(this.url) : void 0;
      };

      return _Class;

    })(),
    captcha: {
      init: function() {
        var observer, onMutationObserver,
          _this = this;

        if (d.cookie.contains('pass_enabled=') || !(this.isEnabled = !!$.id('captchaFormPart'))) {
          return;
        }
        if ($.id('recaptcha_challenge_field_holder')) {
          return this.ready();
        } else {
          if (MutationObserver) {
            observer = new MutationObserver(onMutationObserver = function() {
              if ($.id('recaptcha_challenge_field_holder')) {
                _this.ready();
                return observer.disconnect();
              }
            });
            return observer.observe($.id('recaptcha_widget_div'), {
              childList: true,
              subtree: true
            });
          } else {
            return $.on($.id('recaptcha_widget_div'), 'DOMNodeInserted', this.ready);
          }
        }
      },
      ready: function() {
        var observer,
          _this = this;

        if (this.challenge = $.id('recaptcha_challenge_field_holder')) {
          $.off($.id('recaptcha_widget_div'), 'DOMNodeInserted', this.onready);
          delete this.onready;
        } else {
          return;
        }
        $.addClass(QR.el, 'captcha');
        $.after($('.textarea', QR.el), $.el('div', {
          className: 'captchaimg',
          title: 'Reload',
          innerHTML: '<img>'
        }));
        $.after($('.captchaimg', QR.el), $.el('div', {
          className: 'captchainput',
          innerHTML: '<input title=Verification class=field autocomplete=off size=1>'
        }));
        this.img = $('.captchaimg > img', QR.el);
        this.input = $('.captchainput > input', QR.el);
        $.on(this.img.parentNode, 'click', this.reload);
        $.on(this.input, 'keydown', this.keydown);
        $.on(this.input, 'focus', function() {
          return QR.el.classList.add('focus');
        });
        $.on(this.input, 'blur', function() {
          return QR.el.classList.remove('focus');
        });
        if (MutationObserver) {
          observer = new MutationObserver(function() {
            return _this.load();
          });
          observer.observe(this.challenge, {
            childList: true,
            subtree: true
          });
        } else {
          $.on(this.challenge, 'DOMNodeInserted', function() {
            return _this.load();
          });
        }
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

        this.timeout = Date.now() + 4 * $.MINUTE;
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
        $.globalEval('Recaptcha.reload("t")');
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
      var i, id, mimeTypes, name, size, spoiler, ta, thread, threads, _i, _j, _len, _len1, _ref, _ref1;

      QR.el = UI.dialog('qr', 'bottom: 0; right: 0;', '\
<div id=qrtab class=move>\
  <label><input type=checkbox id=autohide title=Auto-hide> Quick Reply</label>\
  <span> <a class=close title=Close>×</a> </span>\
  <div id=threadselect></div>\
</div>\
<form>\
  <div class=userInfo><input id=dump type=button title="Dump list" value=+ class=field><input name=name title=Name placeholder=Name class=field><input name=email title=E-mail placeholder=E-mail class=field><input name=sub title=Subject placeholder=Subject class=field></div>\
  <div id=replies><div><span id=addReply href=javascript:; title="Add a reply">+</a></div></div>\
  <div class=textarea><textarea name=com title=Comment placeholder=Comment class=field></textarea><span id=charCount></span><div style=clear:both></div></div>\
  <div class=inputs><input type=file multiple size=16><input type=submit></div>\
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image?</label>\
  <div class=warning></div>\
</form>');
      if (Conf['Remember QR size']) {
        $.on(ta = $('textarea', QR.el), 'mouseup', function() {
          return $.set('QR.size', this.style.cssText);
        });
        ta.style.cssText = $.get('QR.size', '');
      }
      QR.autohide = $('#autohide', QR.el);
      mimeTypes = $('ul.rules').firstElementChild.textContent.trim().match(/: (.+)/)[1].toLowerCase().replace(/\w+/g, function(type) {
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
      QR.fileEl = $('input[type=file]', QR.el);
      QR.fileEl.max = $('input[name=MAX_FILE_SIZE]').value;
      if ($.engine !== 'presto') {
        QR.fileEl.accept = mimeTypes;
      }
      QR.warning = $('.warning', QR.el);
      QR.spoiler = !!$('input[name=spoiler]');
      spoiler = $('#spoilerLabel', QR.el);
      spoiler.hidden = !QR.spoiler;
      QR.charaCounter = $('#charCount', QR.el);
      ta = $('textarea', QR.el);
      if (!g.REPLY) {
        threads = '<option value=new>New thread</option>';
        _ref = $$('.thread');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thread = _ref[_i];
          id = thread.id.slice(1);
          threads += "<option value=" + id + ">Thread " + id + "</option>";
        }
        QR.threadSelector = g.BOARD === 'f' ? $('select[name=filetag]').cloneNode(true) : $.el('select', {
          innerHTML: threads,
          title: 'Create a new thread / Reply to a thread'
        });
        QR.threadSelector.className = null;
        $.prepend($('#threadselect', QR.el), QR.threadSelector);
        $.on(QR.threadSelector, 'mousedown', function(e) {
          return e.stopPropagation();
        });
      }
      i = 0;
      size = QR.fileEl.max;
      while (i++ < 2) {
        size /= 1024;
      }
      $.on(QR.fileEl, 'change', $.on(QR.fileEl, 'change', QR.fileInput));
      $.on(QR.fileEl, 'click', function(e) {
        if (e.shiftKey) {
          return QR.selected.rmFile() || e.preventDefault();
        }
      });
      $.on(QR.autohide, 'change', QR.toggleHide);
      $.on($('.close', QR.el), 'click', QR.close);
      $.on($('#dump', QR.el), 'click', function() {
        return $.toggleClass(QR.el, 'dump');
      });
      $.on($('#addReply', QR.el), 'click', function() {
        return new QR.reply().select();
      });
      $.on($('form', QR.el), 'submit', QR.submit);
      $.on(ta, 'input', function() {
        return QR.selected.el.lastChild.textContent = this.value;
      });
      $.on(ta, 'input', QR.characterCount);
      $.on(spoiler.firstChild, 'change', function() {
        return $('input', QR.selected.el).click();
      });
      $.on(QR.warning, 'click', QR.cleanError);
      new QR.reply().select();
      _ref1 = ['name', 'email', 'sub', 'com'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        $.on($("[name=" + name + "]", QR.el), 'focus', function() {
          return QR.el.classList.add('focus');
        });
        $.on($("[name=" + name + "]", QR.el), 'blur', function() {
          return QR.el.classList.remove('focus');
        });
        $.on($("[name=" + name + "]", QR.el), 'input', function() {
          var _ref2;

          QR.selected[this.name] = this.value;
          if (QR.cooldown.auto && QR.selected === QR.replies[0] && (0 < (_ref2 = QR.cooldown.seconds) && _ref2 <= 5)) {
            return QR.cooldown.auto = false;
          }
        });
        $.on(QR.fileEl, 'focus', function() {
          return QR.el.classList.add('focus');
        });
        $.on(QR.fileEl, 'blur', function() {
          return QR.el.classList.remove('focus');
        });
      }
      QR.status.input = $('input[type=submit]', QR.el);
      QR.status();
      QR.cooldown.init();
      QR.captcha.init();
      $.add(d.body, QR.el);
      return $.event(QR.el, new CustomEvent('QRDialogCreation', {
        bubbles: true
      }));
    },
    submit: function(e) {
      var callbacks, captcha, captchas, challenge, err, filetag, m, opts, post, reply, response, textOnly, threadID;

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
      if (!g.REPLY && g.BOARD === 'f') {
        filetag = QR.threadSelector.value;
        threadID = 'new';
      } else {
        threadID = g.THREAD_ID || QR.threadSelector.value;
      }
      if (threadID === 'new') {
        threadID = null;
        if (['vg', 'q'].contains(g.BOARD) && !reply.sub) {
          err = 'New threads require a subject.';
        } else if (!(reply.file || (textOnly = !!$('input[name=textonly]', $.id('postForm'))))) {
          err = 'No file selected.';
        } else if (g.BOARD === 'f' && filetag === '9999') {
          err = 'Invalid tag specified.';
        }
      } else if (!(reply.com || reply.file)) {
        err = 'No file selected.';
      }
      if (QR.captcha.isEnabled && !err) {
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
        } else {
          response = response.trim();
          if (!/\s/.test(response)) {
            response = "" + response + " " + response;
          }
        }
      }
      if (err) {
        QR.cooldown.auto = false;
        QR.status();
        QR.error(err);
        return;
      }
      QR.cleanError();
      QR.cooldown.auto = QR.replies.length > 1;
      if (Conf['Auto Hide QR'] && !QR.cooldown.auto && Conf['Post Form Style'] === "float") {
        QR.hide();
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
        com: Conf['Markdown'] ? Markdown.format(reply.com) : reply.com,
        upfile: reply.file,
        filetag: filetag,
        spoiler: reply.spoiler,
        textonly: textOnly,
        mode: 'regist',
        pwd: (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $('input[name=pwd]').value,
        recaptcha_challenge_field: challenge,
        recaptcha_response_field: response
      };
      callbacks = {
        onload: function() {
          return QR.response(this.response);
        },
        onerror: function() {
          QR.cooldown.auto = false;
          QR.status();
          QR.error($.el('a', {
            href: '//www.4chan.org/banned',
            target: '_blank',
            textContent: 'Connection error, or you are banned.'
          }));
          if (Conf['Check for Bans']) {
            $["delete"]('lastBanCheck');
            return BanChecker.init();
          }
        }
      };
      opts = {
        form: $.formData(post),
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
      var ban, board, doc, el, err, key, persona, postID, reply, threadID, _, _ref;

      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      if (ban = $('.banType', doc)) {
        board = $('.board', doc).innerHTML;
        err = $.el('span', ban.textContent.toLowerCase() === 'banned' ? (Conf['Check for Bans'] ? ($["delete"]('lastBanCheck'), BanChecker.init()) : void 0, err.innerHTML = "You are banned on " + board + "! ;_;<br>\nClick <a href=//www.4chan.org/banned target=_blank>here</a> to see the reason.") : err.innerHTML = "You were issued a warning on " + board + " as " + ($('.nameBlock', doc).innerHTML) + ".<br>\nReason: " + ($('.reason', doc).innerHTML));
      } else if (err = doc.getElementById('errmsg')) {
        if (el = $('a', err)) {
          el.target = '_blank';
        }
      } else if (doc.title !== 'Post successful!') {
        err = 'Connection error with sys.4chan.org.';
      }
      if (err) {
        if (/captcha|verification/i.test(err.textContent) || err === 'Connection error with sys.4chan.org.') {
          if (/mistyped/i.test(err.textContent)) {
            err.textContent = 'You seem to have mistyped the CAPTCHA.';
          }
          QR.cooldown.auto = QR.captcha.isEnabled ? !!$.get('captchas', []).length : err === 'Connection error with sys.4chan.org.' ? true : false;
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
      reply = QR.replies[0];
      persona = $.get('persona', {
        global: {}
      });
      if (!persona[key = Conf['Per Board Persona'] ? g.BOARD : 'global']) {
        persona[key] = JSON.parse(JSON.stringify(persona.global));
      }
      persona[key] = {
        name: reply.name,
        email: !Conf["Remember Sage"] && /^sage$/.test(reply.email) ? /^sage$/.test(persona[key].email) ? null : persona[key].email : reply.email,
        sub: Conf['Remember Subject'] ? reply.sub : null
      };
      $.set('persona', persona);
      _ref = doc.body.lastChild.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref[0], threadID = _ref[1], postID = _ref[2];
      Updater.postID = postID;
      if (!MarkOwn.posts) {
        MarkOwn.posts = $.get('ownedPosts', {});
      }
      MarkOwn.posts[postID] = Date.now();
      $.set('ownedPosts', MarkOwn.posts);
      $.event(QR.el, new CustomEvent('QRPostSuccessful', {
        bubbles: true,
        detail: {
          threadID: threadID,
          postID: postID
        }
      }));
      if ($.get('isBanned')) {
        if (BanChecker.el) {
          $.rm(BanChecker.el);
          delete BanChecker.el;
        }
        $["delete"]('isBanned');
      }
      QR.cooldown.set({
        post: reply,
        isReply: threadID !== '0'
      });
      if (threadID === '0') {
        location.pathname = "/" + g.BOARD + "/res/" + postID;
      } else {
        QR.cooldown.auto = QR.replies.length > 1;
        if (Conf['Open Reply in New Tab'] && !g.REPLY && !QR.cooldown.auto) {
          $.open("//boards.4chan.org/" + g.BOARD + "/res/" + threadID + "#p" + postID);
        }
      }
      if (Conf['Persistent QR'] || QR.cooldown.auto) {
        reply.rm();
      } else {
        QR.close();
      }
      QR.status();
      return QR.resetFileInput();
    },
    abort: function() {
      var _ref;

      if ((_ref = QR.ajax) != null) {
        _ref.abort();
      }
      delete QR.ajax;
      return QR.status();
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
      var a, container, el, link, nodes, owned, qid, quote, quotes, _i, _len, _ref, _ref1;

      if (post.isInlined) {
        return;
      }
      quotes = {};
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.parentNode.parentNode.className === 'capcodeReplies') {
          break;
        }
        if (quote.hostname === 'boards.4chan.org' && !/catalog$/.test(quote.pathname) && (qid = (_ref1 = quote.hash) != null ? _ref1.slice(2) : void 0)) {
          quotes[qid] = true;
        }
      }
      a = $.el('a', {
        href: "/" + g.BOARD + "/res/" + post.threadID + "#p" + post.ID,
        className: post.el.hidden ? 'filtered backlink' : 'backlink',
        textContent: QuoteBacklink.funk(post.ID)
      });
      if (Conf['Mark Owned Posts']) {
        if (MarkOwn.posts[post.ID]) {
          $.addClass(a, 'ownreply');
          a.textContent += " (You)";
          owned = true;
        }
      }
      for (qid in quotes) {
        if (!(el = $.id("pi" + qid)) || !Conf['OP Backlinks'] && /\bop\b/.test(el.parentNode.className)) {
          continue;
        }
        link = a.cloneNode(true);
        nodes = $.nodes([$.tn(' '), link]);
        if (Conf['Quote Preview']) {
          $.on(link, 'mouseover', QuotePreview.mouseover);
        }
        if (Conf['Quote Inline']) {
          $.on(link, 'click', QuoteInline.toggle);
          if (Conf['Quote Hash Navigation']) {
            QuoteInline.qiQuote(link);
          }
        }
        if (!(container = $.id("blc" + qid))) {
          $.addClass(el.parentNode, 'quoted');
          if (owned) {
            $.addClass(el.parentNode, 'youQuoted');
          }
          container = $.el('span', {
            className: 'container',
            id: "blc" + qid
          });
          $.add(el, container);
        }
        $.add(container, nodes);
      }
    }
  };

  QuoteCT = {
    init: function() {
      ExpandComment.callbacks.push(this.node);
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
        if (!(quote.hash && quote.hostname === 'boards.4chan.org' && !/catalog$/.test(quote.pathname))) {
          continue;
        }
        path = quote.pathname.split('/');
        if (path[1] === g.BOARD && path[3] !== post.threadID) {
          $.add(quote, $.tn('\u00A0(Cross-thread)'));
        }
      }
    }
  };

  QuoteInline = {
    init: function() {
      this.callbacks.push(this.node);
      ExpandComment.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    callbacks: [],
    cb: function(post, root) {
      var callback, _i, _len, _ref;

      post.isCrosspost = post.isInlined = true;
      post.threadID = $.x('ancestor::div[parent::div[@class="board"]]', root).id.match(/\d+$/)[0];
      _ref = Main.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback(post);
      }
    },
    cb2: function(post) {
      var callback, _i, _len, _ref;

      post.isInlined = true;
      _ref = QuoteInline.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback(post);
      }
    },
    node: function(post) {
      var quote, _i, _j, _len, _len1, _ref, _ref1;

      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!(quote.hash && quote.hostname === 'boards.4chan.org' && !/catalog$/.test(quote.pathname) || /\bdeadlink\b/.test(quote.className))) {
          continue;
        }
        $.on(quote, 'click', QuoteInline.toggle);
        if (Conf['Quote Hash Navigation'] && !post.isInlined) {
          QuoteInline.qiQuote(quote);
        }
      }
      _ref1 = post.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
        $.on(quote, 'click', QuoteInline.toggle);
      }
    },
    qiQuote: function(quote) {
      return $.after(quote, [
        $.tn(' '), $.el('a', {
          className: 'qiQuote',
          textContent: '#',
          href: quote.href
        })
      ]);
    },
    toggle: function(e) {
      var id;

      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      id = this.dataset.id || this.hash.slice(2);
      if (/\binlined\b/.test(this.className)) {
        QuoteInline.rm(this, id);
      } else {
        if ($.x("ancestor::div[contains(@id,'p" + id + "')]", this)) {
          return;
        }
        QuoteInline.add(this, id);
      }
      return $.toggleClass(this, 'inlined');
    },
    add: function(q, id) {
      var board, el, i, inline, isBacklink, path, postID, root, threadID;

      if (q.host === 'boards.4chan.org') {
        path = q.pathname.split('/');
        board = path[1];
        threadID = path[3];
        postID = id;
      } else {
        board = q.dataset.board;
        threadID = 0;
        postID = q.dataset.id;
      }
      el = board === g.BOARD ? $.id("p" + postID) : false;
      inline = $.el('div', {
        id: "i" + postID,
        className: el ? 'inline' : 'inline crosspost'
      });
      root = (isBacklink = /\bbacklink\b/.test(q.className)) ? q.parentNode : $.x('ancestor-or-self::*[parent::blockquote][1]', q);
      if (Conf['Quote Hash Navigation'] && !isBacklink && root === q) {
        $.after(root.nextElementSibling, inline);
      } else {
        $.after(root, inline);
      }
      Get.post(board, threadID, postID, inline, QuoteInline.cb, QuoteInline.cb2);
      if (!el) {
        return;
      }
      if (isBacklink && Conf['Forward Hiding']) {
        $.addClass(el.parentNode, 'forwarded');
        ++el.dataset.forwarded || (el.dataset.forwarded = 1);
      }
      if ((i = Unread.replies.indexOf(el)) !== -1) {
        Unread.replies.splice(i, 1);
        Unread.update(true);
      }
      if (Conf['Color user IDs'] && ['b', 'q', 'soc'].contains(board)) {
        return setTimeout(function() {
          return $.rmClass($('.reply.highlight', inline), 'highlight');
        });
      }
    },
    rm: function(q, id) {
      var div, inlined, _i, _len, _ref;

      div = $.x("following::div[@id='i" + id + "']", q);
      $.rm(div);
      if (!Conf['Forward Hiding']) {
        return;
      }
      _ref = $$('.backlink.inlined', div);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        inlined = _ref[_i];
        div = $.id(inlined.hash.slice(1));
        if (!--div.dataset.forwarded) {
          $.rmClass(div.parentNode, 'forwarded');
        }
      }
      if (/\bbacklink\b/.test(q.className)) {
        div = $.id("p" + id);
        if (!--div.dataset.forwarded) {
          return $.rmClass(div.parentNode, 'forwarded');
        }
      }
    }
  };

  QuoteOP = {
    init: function() {
      ExpandComment.callbacks.push(this.node);
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
        if (quote.hash.slice(2) === post.threadID) {
          $.add(quote, $.tn('\u00A0(OP)'));
        }
      }
    }
  };

  QuotePreview = {
    init: function() {
      QuoteInline.callbacks.push(this.node);
      ExpandComment.callbacks.push(this.node);
      Main.callbacks.push(this.node);
      return $.ready(function() {
        return $.add(d.body, QuotePreview.el = $.el('div', {
          id: 'qp',
          className: 'reply dialog'
        }));
      });
    },
    callbacks: [],
    callback: function(node) {
      var callback, _i, _len, _ref;

      _ref = QuotePreview.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback(node);
      }
    },
    node: function(post) {
      var quote, _i, _j, _len, _len1, _ref, _ref1;

      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!(quote.hostname === 'boards.4chan.org' && quote.hash && !/catalog$/.test(quote.pathname) || /\bdeadlink\b/.test(quote.className))) {
          continue;
        }
        $.on(quote, 'mouseover', QuotePreview.mouseover);
      }
      _ref1 = post.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
        $.on(quote, 'mouseover', QuotePreview.mouseover);
      }
    },
    mouseover: function(e) {
      var board, child, children, el, path, postID, qp, quote, quoterID, threadID, _conf, _i, _j, _len, _len1, _ref;

      if (UI.el || /\binlined\b/.test(this.className)) {
        return;
      }
      qp = QuotePreview.el;
      if (children = qp.children) {
        for (_i = 0, _len = children.length; _i < _len; _i++) {
          child = children[_i];
          $.rm(child);
        }
      }
      if (this.host === 'boards.4chan.org') {
        path = this.pathname.split('/');
        board = path[1];
        threadID = path[3];
        postID = this.hash.slice(2);
      } else {
        board = this.dataset.board;
        threadID = 0;
        postID = this.dataset.id;
      }
      UI.el = qp;
      UI.hover(e);
      Get.post(board, threadID, postID, qp, function(post) {
        Main.prettify(post.blockquote);
        post.isArchived = qp.className.contains('archivedPost');
        return QuotePreview.callback(post);
      });
      $.on(this, 'mousemove', UI.hover);
      $.on(this, 'mouseout click', QuotePreview.mouseout);
      _conf = Conf;
      if (el = $.id("p" + postID)) {
        _conf = Conf;
        if (_conf['Quote Highlighting']) {
          if (/\bop\b/.test(el.className)) {
            $.addClass(el.parentNode, 'qphl');
          } else {
            $.addClass(el, 'qphl');
          }
        }
        quoterID = $.x('ancestor::*[@id][1]', this).id.match(/\d+$/)[0];
        _ref = $$('.quotelink, .backlink', qp);
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          quote = _ref[_j];
          if (quote.hash.slice(2) === quoterID) {
            $.addClass(quote, 'forwardlink');
          }
        }
      }
    },
    mouseout: function(e) {
      var el, hash;

      delete UI.el;
      $.rm(QuotePreview.el.firstChild);
      $.rmClass(QuotePreview.el, 'warning');
      if ((hash = this.hash) && (el = $.id(hash.slice(1)))) {
        $.rmClass(el.parentNode, 'qphl');
        $.rmClass(el, 'qphl');
      }
      $.off(this, 'mousemove', UI.hover);
      return $.off(this, 'mouseout click', QuotePreview.mouseout);
    }
  };

  Quotify = {
    init: function() {
      QuotePreview.callbacks.push(this.node);
      ExpandComment.callbacks.push(this.node);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var a, board, deadlink, id, m, postBoard, quote, _i, _len, _ref;

      if (post.isInlined && !post.isCrosspost) {
        return;
      }
      _ref = $$('.deadlink', post.blockquote);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        deadlink = _ref[_i];
        quote = deadlink.textContent;
        a = $.el('a', {
          textContent: "" + quote + "\u00A0(Dead)"
        });
        if (!(id = quote.match(/\d+$/))) {
          continue;
        }
        id = id[0];
        if (m = quote.match(/^>>>\/([a-z\d]+)/)) {
          board = m[1];
        } else if (postBoard) {
          board = postBoard;
        } else {
          board = postBoard = $('a[title="Highlight this post"]', post.el).pathname.split('/')[1];
        }
        if (board === g.BOARD && $.id("p" + id)) {
          a.href = "#p" + id;
          a.className = 'quotelink';
        } else {
          a.href = Redirect.to({
            board: board,
            threadID: 0,
            postID: id
          });
          a.className = 'deadlink';
          a.target = '_blank';
          if (Redirect.post(board, id)) {
            $.addClass(a, 'quotelink');
            a.setAttribute('data-board', board);
            a.setAttribute('data-id', id);
          }
        }
        $.replace(deadlink, a);
      }
    }
  };

  Style = {
    init: function() {
      this.agent = {
        'gecko': '-moz-',
        'webkit': '-webkit-',
        'presto': '-o-'
      }[$.engine];
      if (d.head) {
        return this.wrapper();
      }
      return this.observe();
    },
    cleanup: function() {
      delete Style.init;
      delete Style.observe;
      delete Style.wrapper;
      return delete Style.cleanup;
    },
    observe: function() {
      var onMutationObserver;

      if (MutationObserver) {
        Style.observer = new MutationObserver(onMutationObserver = this.wrapper);
        return Style.observer.observe(d, {
          childList: true,
          subtree: true
        });
      } else {
        return $.on(d, 'DOMNodeInserted', this.wrapper);
      }
    },
    wrapper: function() {
      if (d.head) {
        Style.addStyle();
        if (Style.observer) {
          Style.observer.disconnect();
        } else {
          $.off(d, 'DOMNodeInserted', Style.wrapper);
        }
        return Style.cleanup();
      }
    },
    emoji: function(position) {
      var css, icon, margin, name, _conf, _i, _len, _ref;

      _conf = Conf;
      css = [];
      margin = "margin-" + (position === "before" ? "right" : "left") + ": 5px;";
      _ref = Emoji.icons;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        icon = _ref[_i];
        name = icon[0];
        css[css.length] = "a.useremail[href*='" + name + "']:last-of-type::" + position + ",\na.useremail[href*='" + (name.toLowerCase()) + "']:last-of-type::" + position + ",\na.useremail[href*='" + (name.toUpperCase()) + "']:last-of-type::" + position + " {\ncontent: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA" + icon[1] + "');\nvertical-align: top;\n" + margin + "\n}\n";
      }
      return css.join("");
    },
    addStyle: function() {
      var agent;

      agent = Style.agent;
      return Style.css = $.addStyle("/* dialog styling */\nhr.abovePostForm {\n  width: 100% !important;\n}\n.dialog.reply {\n  display: block;\n  border: 1px solid rgba(0,0,0,.25);\n  padding: 0;\n}\n.move {\n  cursor: move;\n}\nlabel, .favicon, .export, .import {\n  cursor: pointer;\n}\na[href=\"javascript:;\"] {\n  text-decoration: none;\n}\n.warning:not(:empty) {\n  color: rgb(185, 74, 72);\n  background: rgb(242, 222, 222);\n  border: 1px solid rgba(238, 50, 50,0.3);\n  padding: 3px;\n  text-align: center;\n}\n\n#options .warning {\n  width: 98%;\n  border-radius: 4px;\n}\n\n.warning>code {\n  border: 1px solid #E5D3D3;\n}\n\n.hide_thread_button:not(.hidden_thread) {\n  float: left;\n}\n\n.thread > .hidden_thread ~ *,\n.hidden .sideArrows,\n[hidden],\n#globalMessage.hidden,\n#content > [name=tab]:not(:checked) + div,\n#updater:not(:hover) > :not(.move),\n.autohide:not(:hover) > form,\n#qp input, .forwarded,\n.fappeTyme > #delform .noFile {\n  display: none !important;\n}\n\n.menu_button {\n  display: inline-block;\n}\n.menu_button > span {\n  border-top:   .5em solid;\n  border-right: .3em solid transparent;\n  border-left:  .3em solid transparent;\n  display: inline-block;\n  margin: 2px;\n  vertical-align: middle;\n}\n#menu {\n  position: absolute;\n  outline: none;\n}\n.entry {\n  border-bottom: 1px solid rgba(0, 0, 0, .25);\n  cursor: pointer;\n  display: block;\n  outline: none;\n  padding: 3px 7px;\n  position: relative;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.entry:last-child {\n  border: none;\n}\n.focused.entry {\n  background: rgba(255, 255, 255, .33);\n}\n.entry.hasSubMenu {\n  padding-right: 1.5em;\n}\n.hasSubMenu::after {\n  content: \"\";\n  border-left:   .5em solid;\n  border-top:    .3em solid transparent;\n  border-bottom: .3em solid transparent;\n  display: inline-block;\n  margin: .3em;\n  position: absolute;\n  right: 3px;\n}\n.hasSubMenu:not(.focused) > .subMenu {\n  display: none;\n}\n.subMenu {\n  position: absolute;\n  left: 100%;\n  top: 0;\n  margin-top: -1px;\n}\nh1,\nh2 {\n  text-align: center;\n}\n#qr > .move {\n  min-width: 300px;\n  overflow: hidden;\n  box-sizing: border-box;\n  " + agent + "box-sizing: border-box;\n  padding: 0 2px;\n}\n#threadselect,\n#qr > .move > span {\n  float: right;\n  padding: 0 2px;\n}\n#autohide, .close, #qr select, #dump, .remove, .captchaimg, #qr div.warning {\n  cursor: pointer;\n}\n#qr select,\n#qr > form {\n  margin: 0;\n}\n#dump {\n  background: " + agent + "linear-gradient(#EEE, #CCC);\n  background: linear-gradient(#EEE, #CCC);\n  width: 10%;\n}\n.gecko #dump {\n  padding: 1px 0 2px;\n}\n#dump:hover, #dump:focus {\n  background: " + agent + "linear-gradient(#FFF, #DDD);\n  background: linear-gradient(#FFF, #DDD);\n}\n#dump:active, .dump #dump:not(:hover):not(:focus) {\n  background: " + agent + "linear-gradient(#CCC, #DDD);\n  background: linear-gradient(#CCC, #DDD);\n}\n#qp:empty,\n#qr:not(.dump) #replies, .dump > form > label {\n  display: none;\n}\n#replies {\n  display: block;\n  height: 100px;\n  position: relative;\n  " + agent + "user-select: none;\n  user-select: none;\n}\n#replies > div {\n  counter-reset: thumbnails;\n  top: 0; right: 0; bottom: 0; left: 0;\n  margin: 0; padding: 0;\n  overflow: hidden;\n  position: absolute;\n  white-space: pre;\n}\n#replies > div:hover {\n  bottom: -10px;\n  overflow-x: auto;\n  z-index: 1;\n}\n.thumbnail {\n  background-color: rgba(0,0,0,.2) !important;\n  background-position: 50% 20% !important;\n  background-size: cover !important;\n  border: 1px solid #666;\n  box-sizing: border-box;\n  " + agent + "box-sizing: border-box;\n  cursor: move;\n  display: inline-block;\n  height: 90px; width: 90px;\n  margin: 5px; padding: 2px;\n  opacity: .5;\n  outline: none;\n  overflow: hidden;\n  position: relative;\n  text-shadow: 0 1px 1px #000;\n  " + agent + "transition: opacity .25s ease-in-out;\n  transition: opacity .25s ease-in-out;\n  vertical-align: top;\n}\n.thumbnail:hover, .thumbnail:focus {\n  opacity: .9;\n}\n.thumbnail#selected {\n  opacity: 1;\n}\n.thumbnail::before {\n  counter-increment: thumbnails;\n  content: counter(thumbnails);\n  color: #FFF;\n  font-weight: 700;\n  padding: 3px;\n  position: absolute;\n  top: 0;\n  right: 0;\n  text-shadow: 0 0 3px #000, 0 0 8px #000;\n}\n.thumbnail.drag {\n  box-shadow: 0 0 10px rgba(0,0,0,.5);\n}\n.thumbnail.over {\n  border-color: #FFF;\n}\n.thumbnail > span {\n  color: #FFF;\n}\n.remove {\n  background: none;\n  color: #E00;\n  font-weight: 700;\n  padding: 3px;\n}\n.remove:hover::after {\n  content: \" Remove\";\n}\n.thumbnail > label {\n  background: rgba(0,0,0,.5);\n  color: #FFF;\n  right: 0; bottom: 0; left: 0;\n  position: absolute;\n  text-align: center;\n}\n.thumbnail > label > input {\n  margin: 0;\n}\n#addReply {\n  color: #333;\n  font-size: 3.5em;\n  line-height: 100px;\n}\n#addReply:hover, #addReply:focus {\n  color: #000;\n}\n.field {\n  border: 1px solid #CCC;\n  box-sizing: border-box;\n  " + agent + "box-sizing: border-box;\n  color: #333;\n  font: 13px sans-serif;\n  margin: 0;\n  padding: 2px 4px 3px;\n  " + agent + "transition: color .25s, border .25s;\n  transition: color .25s, border .25s;\n}\n.field:" + agent + "placeholder,\n.field:hover:" + agent + "placeholder {\n  color: #AAA;\n}\n.field:hover, .field:focus {\n  border-color: #999;\n  color: #000;\n  outline: none;\n}\n.userInfo > .field:not(#dump) {\n  width: 95px;\n  min-width: 30%;\n  max-width: 30%;\n}\n#qr textarea.field {\n  display: " + agent + "box;\n  min-height: 160px;\n  min-width: 100%;\n}\n#qr.captcha textarea.field {\n  min-height: 120px;\n}\n.textarea {\n  position: relative;\n}\n#charCount {\n  color: #000;\n  background: hsla(0, 0%, 100%, .5);\n  font-size: 8pt;\n  margin: 1px;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  pointer-events: none;\n}\n#charCount.warning {\n  color: red;\n}\n.captchainput > .field {\n  min-width: 100%;\n}\n.captchaimg {\n  background: #FFF;\n  outline: 1px solid #CCC;\n  outline-offset: -1px;\n  text-align: center;\n}\n.captchaimg > img {\n  display: block;\n  height: 57px;\n  width: 300px;\n}\n#qr [type=file] {\n  margin: 1px 0;\n  width: 70%;\n}\n#qr [type=submit] {\n  margin: 1px 0;\n  padding: 1px; /* not Gecko */\n  width: 30%;\n}\n.gecko #qr [type=submit] {\n  padding: 0 1px; /* Gecko does not respect box-sizing: border-box */\n}\n#spoilerLabel:not([hidden]) {\n  display: block;\n}\n.fileText:hover .fntrunc,\n.fileText:not(:hover) .fnfull {\n  display: none;\n}\n.fitwidth img[data-md5] + img {\n  max-width: 100%;\n}\n.gecko  .fitwidth img[data-md5] + img,\n.presto .fitwidth img[data-md5] + img {\n  width: 100%;\n}\n#qr, #qp, #updater, #stats, #ihover, #overlay, #navlinks, #mouseover {\n  position: fixed;\n}\n#ihover {\n  max-height: 97%;\n  max-width: 75%;\n  padding-bottom: 18px;\n}\n#navlinks {\n  font-size: 16px;\n  top: 25px;\n  right: 5px;\n}\nbody {\n  box-sizing: border-box;\n  " + agent + "box-sizing: border-box;\n}\nbody.unscroll {\n  overflow: hidden;\n}\n#mouseover {\n  z-index: 2;\n}\n#overlay {\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  background: none repeat scroll 0% 0% rgba(25, 25, 25, 0.6);\n  z-index: 1;\n}\n#overlay::after {\n  content: \"\";\n  display: inline-block;\n  height: 100%;\n  vertical-align: middle;\n}\n#options {\n  box-sizing: border-box;\n  " + agent + "box-sizing: border-box;\n  display: inline-block;\n  padding: 5px;\n  position: relative;\n  text-align: left;\n  vertical-align: middle;\n  width: 900px;\n  max-width: 100%;\n  height: 600px;\n  max-height: 100%;\n  background: rgb(255,255,255);\n  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.4); \n  border-radius: 4px;\n}\n\n#credits {\n  float: right;\n}\n#options ul {\n  padding: 0;\n}\n#options fieldset {\n  border: 1px solid #DDD;\n  border-radius: 3px;\n}\n#options legend {\n  font-weight: 700;\n}\n#options article li {\n  margin: 10px 0 10px 2em;\n}\n#options code {\n  background: hsla(0, 0%, 100%, .5);\n  color: #000;\n  padding: 0 2px;\n}\n#selected_tab {\n  font-weight: 700;\n}\n.rice_tab, .main_tab {\n  margin-right: 5px;\n}\n.rice_tab {\n  margin-top: -15px;\n}\n#content {\n  overflow: auto;\n  position: absolute;\n  top: 2.5em;\n  right: 5px;\n  bottom: 5px;\n  left: 5px;\n}\n#content textarea {\n  font-family: monospace;\n  min-height: 350px;\n  resize: vertical;\n  width: 100%;\n}\n.imp-exp .placeholder:not(:empty) {\n  position: absolute;\n  top:5px;\n  right:0px;\n  left:0px;\n  text-align:center;\n  width: 200px;\n  margin: auto;\n}\n.imp-exp-result:empty {\n  display: none;\n}\n.imp-exp-result {\n  position: absolute;\n  top:5px;\n  right:0px;\n  left:0px;\n  width:200px;\n  margin:auto;\n  text-align: center;\n  color:red;\n}\n\n#updater {\n  text-align: right;\n}\n#updater:not(:hover) {\n  border: none;\n  background: transparent;\n}\n#updater input[type=number] {\n  width: 4em;\n}\n.new {\n  background: lime;\n}\n\n#watcher {\n  padding-bottom: 5px;\n  position: absolute;\n  overflow: hidden;\n  white-space: nowrap;\n}\n#watcher:not(:hover) {\n  max-height: 220px;\n}\n#watcher > div {\n  max-width: 200px;\n  overflow: hidden;\n  padding-left: 5px;\n  padding-right: 5px;\n  text-overflow: ellipsis;\n}\n#watcher > .move {\n  padding-top: 5px;\n  text-decoration: underline;\n}\n\n#qp {\n  padding: 2px 2px 5px;\n}\n#qp .post {\n  border: none;\n  margin: 0;\n  padding: 0;\n}\n#qp img {\n  max-height: 300px;\n  max-width: 500px;\n}\n.qphl {\n  box-shadow: 0 0 0 2px rgba(216, 94, 49, .7);\n}\n.quotelink.deadlink {\n  text-decoration: underline !important;\n}\n.deadlink:not(.quotelink) {\n  text-decoration: none !important;\n}\n.inlined {\n  opacity: .5;\n}\n.inline {\n  background-color: rgba(255, 255, 255, 0.15);\n  border: 1px solid rgba(128, 128, 128, 0.5);\n  display: table;\n  margin: 2px;\n  padding: 2px;\n}\n.inline .post {\n  background: none;\n  border: none;\n  margin: 0;\n  padding: 0;\n}\ndiv.opContainer {\n  display: block !important;\n}\n.opContainer.filter_highlight {\n  box-shadow: inset 5px 0 rgba(255, 0, 0, .5);\n}\n.opContainer.filter_highlight.qphl {\n  box-shadow: inset 5px 0 rgba(255, 0, 0, .5),\n              0 0 0 2px rgba(216, 94, 49, .7);\n}\n.filter_highlight > .reply {\n  box-shadow: -5px 0 rgba(255, 0, 0, .5);\n}\n.filter_highlight > .reply.qphl {\n  box-shadow: -5px 0 rgba(255, 0, 0, .5),\n              0 0 0 2px rgba(216, 94, 49, .7)\n}\n.filtered,\n.quotelink.filtered {\n  text-decoration: underline;\n  text-decoration: line-through !important;\n}\n.quotelink.forwardlink,\n.backlink.forwardlink {\n  text-decoration: none;\n  border-bottom: 1px dashed;\n}\n.threadContainer {\n  margin-left: 20px;\n  border-left: 1px solid black;\n}\n.postContainer iframe {\n  display: block !important;\n}\n#toggleMsgButton {\n    width: 200px;\n    display: block;\n    text-align: center;\n    margin: 0 auto 0;\n}\n.redButton {\n    background-color: rgb(255, 173, 173);\n    background-image: url(\"http://static.4chan.org/image/buttonfade-red.png\");\n    border: 1px solid rgb(196, 88, 88);\n    color: rgb(136, 0, 0) !important;\n    border-radius: 3px 3px 3px 3px;\n    padding: 6px 10px 5px;\n    font-weight: bold;\n    background-repeat: repeat-x;\n    text-decoration: none;\n}\n" + (Conf["Announcement Hiding"] ? '#globalMessage.hidden { display: none; }' : '') + "\n" + (Conf["Custom CSS"] ? Conf["customCSS"] : "") + "\n" + (Conf['Emoji'] ? Style.emoji(Conf['emojiPos']) : '') + " \n" + (Conf['Quick Reply'] && Conf['Hide Original Post Form'] ? '#postForm { display: none; }' : ''));
    }
  };

  Get = {
    post: function(board, threadID, postID, root, cb, cb2) {
      var post, url;

      if (board === g.BOARD && (post = $.id("pc" + postID))) {
        post = Get.cleanPost(post.cloneNode(true));
        if (cb2) {
          cb2(Main.preParse(post));
        }
        $.add(root, post);
        return;
      }
      root.innerHTML = "<div class=post>Loading post No." + postID + "...</div>";
      if (threadID) {
        return $.cache("//api.4chan.org/" + board + "/res/" + threadID + ".json", function() {
          return Get.parsePost(this, board, threadID, postID, root, cb);
        });
      } else if (url = Redirect.post(board, postID)) {
        return $.cache(url, function() {
          return Get.parseArchivedPost(this, board, postID, root, cb);
        });
      }
    },
    parsePost: function(req, board, threadID, postID, root, cb) {
      var post, postNode, posts, spoilerRange, status, url, _i, _len;

      status = req.status;
      if (status !== 200) {
        if (url = Redirect.post(board, postID)) {
          $.cache(url, function() {
            return Get.parseArchivedPost(this, board, postID, root, cb);
          });
        } else {
          $.addClass(root, 'warning');
          root.innerHTML = status === 404 ? "<div class=post>Thread No." + threadID + " 404'd.</div>" : "<div class=post>Error " + req.status + ": " + req.statusText + ".</div>";
        }
        return;
      }
      posts = JSON.parse(req.response).posts;
      if (spoilerRange = posts[0].custom_spoiler) {
        Build.spoilerRange[board] = spoilerRange;
      }
      postID = +postID;
      for (_i = 0, _len = posts.length; _i < _len; _i++) {
        post = posts[_i];
        if (post.no === postID) {
          break;
        }
        if (post.no > postID) {
          if (url = Redirect.post(board, postID)) {
            $.cache(url, function() {
              return Get.parseArchivedPost(this, board, postID, root, cb);
            });
          } else {
            $.addClass(root, 'warning');
            root.textContent = "Post No." + postID + " was not found.";
          }
          return;
        }
      }
      post = Main.preParse(postNode = Get.cleanPost(Build.postFromObject(post, board)));
      if (cb) {
        cb(post, root);
      }
      return $.replace(root.firstChild, postNode);
    },
    parseArchivedPost: function(req, board, postID, root, cb) {
      var bq, comment, data, o, post, postNode, _ref;

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
            return '<s>';
          case '[/spoiler]':
            return '</s>';
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
      comment = bq.innerHTML.replace(/(^|>)(&gt;[^<$]*)(<|$)/g, '$1<span class=quote>$2</span>$3');
      o = {
        postID: postID,
        threadID: data.thread_num,
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
        email: data.email ? encodeURI(data.email.replace(/&quot;/g, '"')) : '',
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
      post = Main.preParse(postNode = Get.cleanPost(Build.post(o, true)));
      if (cb) {
        cb(post, root);
      }
      return $.replace(root.firstChild, postNode);
    },
    cleanPost: function(root) {
      var child, el, els, inline, inlined, now, post, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;

      post = $('.post', root);
      _ref = __slice.call(root.childNodes);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child !== post) {
          $.rm(child);
        }
      }
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
      now = Date.now();
      els = $$('[id]', root);
      els.push(root);
      for (_l = 0, _len3 = els.length; _l < _len3; _l++) {
        el = els[_l];
        el.id = "" + now + "_" + el.id;
      }
      $.rmClass(root, 'forwarded');
      $.rmClass(root, 'qphl');
      $.rmClass(post, 'highlight');
      $.rmClass(post, 'qphl');
      root.hidden = post.hidden = false;
      return root;
    },
    title: function(thread) {
      var el, op, span;

      op = $('.op', thread);
      el = $('.postInfo .subject', op);
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
    }
  };

  Build = {
    spoilerRange: {},
    shortFilename: function(filename, isOP) {
      var threshold;

      threshold = isOP ? 40 : 30;
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
      flag = flagCode ? (" <img src='" + staticPath + "/image/country/" + (board === 'pol' ? 'troll/' : '')) + flagCode.toLowerCase() + (".gif' alt=" + flagCode + " title='" + flagName + "' class=countryFlag>") : '';
      if (file != null ? file.isDeleted : void 0) {
        fileHTML = isOP ? ("<div class=file id=f" + postID + "><div class=fileInfo></div><span class=fileThumb>") + ("<img src='" + staticPath + "/image/filedeleted.gif' alt='File deleted.' class='fileDeleted retina'>") + "</span></div>" : ("<div id=f" + postID + " class=file><span class=fileThumb>") + ("<img src='" + staticPath + "/image/filedeleted-res.gif' alt='File deleted.' class='fileDeletedRes retina'>") + "</span></div>";
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
        innerHTML: (isOP ? '' : "<div class=sideArrows id=sa" + postID + ">&gt;&gt;</div>") + ("<div id=p" + postID + " class='post " + (isOP ? 'op' : 'reply') + (capcode === 'admin_highlight' ? ' highlightPost' : '') + "'>") + (isOP ? fileHTML : '') + ("<div class='postInfo desktop' id=pi" + postID + ">") + ("<input type=checkbox name=" + postID + " value=delete> ") + ("" + subject + " ") + ("<span class='nameBlock" + capcodeClass + "'>") + emailStart + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + emailEnd + capcode + userID + flag + sticky + closed + ' </span> ' + ("<span class=dateTime data-utc=" + dateUTC + ">" + date + "</span> ") + "<span class='postNum desktop'>" + ("<a href=" + ("/" + board + "/res/" + threadID + "#p" + postID) + " title='Highlight this post'>No.</a>") + ("<a href='" + (g.REPLY && +g.THREAD_ID === threadID ? "javascript:quote(" + postID + ")" : "/" + board + "/res/" + threadID + "#q" + postID) + "' title='Quote this post'>" + postID + "</a>") + '</span>' + '</div>' + (isOP ? '' : fileHTML) + ("<blockquote class=postMessage id=m" + postID + ">" + (comment || '') + "</blockquote> ") + '</div>'
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

  Main = {
    init: function() {
      var key, now, path, pathname, settings, temp, val, _conf;

      Main.flatten(null, Config);
      for (key in Conf) {
        val = Conf[key];
        Conf[key] = $.get(key, val);
      }
      path = location.pathname;
      pathname = path.slice(1).split('/');
      g.BOARD = pathname[0], temp = pathname[1];
      switch (temp) {
        case 'res':
          g.REPLY = true;
          g.THREAD_ID = pathname[2];
          break;
        case 'catalog':
          g.CATALOG = true;
      }
      if (['b', 'd', 'e', 'gif', 'h', 'hc', 'hm', 'hr', 'pol', 'r', 'r9k', 'rs', 's', 's4s', 'soc', 't', 'u', 'y'].contains(g.BOARD)) {
        g.TYPE = 'nsfw';
      }
      _conf = Conf;
      if (_conf["Interval per board"]) {
        Conf["Interval_" + g.BOARD] = $.get("Interval_" + g.BOARD, Conf["Interval"]);
        Conf["BGInterval_" + g.BOARD] = $.get("BGInterval_" + g.BOARD, Conf["BGInteval"]);
      }
      switch (location.hostname) {
        case 'sys.4chan.org':
          if (/report/.test(location.search)) {
            $.ready(function() {
              var field, form;

              form = $('form');
              field = $.id('recaptcha_response_field');
              $.on(field, 'keydown', function(e) {
                if (e.keyCode === 8 && !e.target.value) {
                  return $.globalEval('Recaptcha.reload()');
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
            });
          }
          return;
        case 'images.4chan.org':
          $.ready(function() {
            var url;

            if (/^4chan - 404/.test(d.title) && _conf['404 Redirect']) {
              path = location.pathname.split('/');
              url = Redirect.image(path[1], path[3]);
              if (url) {
                return location.href = url;
              }
            }
          });
          return;
      }
      userNavigation = $.get("userNavigation", Navigation);
      Main.prune();
      now = Date.now();
      if (_conf['Check for Updates'] && $.get('lastUpdate', 0) < now - 18 * $.HOUR) {
        $.ready(function() {
          $.on(window, 'message', Main.message);
          $.set('lastUpdate', now);
          return $.add(d.head, $.el('script', {
            src: 'https://github.com/zixaphir/appchan-x/raw/4chanX/latest.js'
          }));
        });
      }
      settings = JSON.parse(localStorage.getItem('4chan-settings')) || {};
      settings.disableAll = true;
      localStorage.setItem('4chan-settings', JSON.stringify(settings));
      Main.polyfill();
      if (g.CATALOG) {
        return $.ready(Main.catalog);
      } else {
        return Main.features();
      }
    },
    polyfill: function() {
      var event, prefix, property;

      if (!('visibilityState' in document)) {
        prefix = 'mozVisibilityState' in document ? 'moz' : 'webkitVisibilityState' in document ? 'webkit' : 'o';
        property = prefix + 'VisibilityState';
        event = prefix + 'visibilitychange';
        d.visibilityState = d[property];
        d.hidden = d.visibilityState === 'hidden';
        return $.on(d, event, function() {
          d.visibilityState = d[property];
          d.hidden = d.visibilityState === 'hidden';
          return $.event(d, new CustomEvent('visibilitychange'));
        });
      }
    },
    catalog: function() {
      var _conf;

      _conf = Conf;
      if (_conf['Catalog Links']) {
        CatalogLinks.init();
      }
      if (_conf['Thread Hiding']) {
        ThreadHiding.init();
      }
      return $.ready(function() {
        var a, nav, _i, _len, _ref;

        if (_conf['Custom Navigation']) {
          CustomNavigation.init();
        }
        _ref = ['boardNavDesktop', 'boardNavDesktopFoot'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          nav = _ref[_i];
          if (a = $("a[href*='/" + g.BOARD + "/']", $.id(nav))) {
            $.addClass(a, 'current');
          }
        }
      });
    },
    features: function() {
      var _conf;

      _conf = Conf;
      Emoji.init();
      Style.init();
      if (_conf['Filter']) {
        Filter.init();
      }
      if (_conf['Reply Hiding']) {
        ReplyHiding.init();
      }
      if (_conf['Reply Hiding'] || _conf['Reply Hiding Link'] || _conf['Filter']) {
        StrikethroughQuotes.init();
        QuotePreview.callbacks.push(ReplyHiding.unhide);
        QuoteInline.callbacks.push(ReplyHiding.unhide);
      }
      if (_conf['Anonymize']) {
        Anonymize.init();
      }
      if (_conf['Time Formatting']) {
        Time.init();
      }
      if (Conf['Relative Post Dates']) {
        RelativeDates.init();
      }
      if (_conf['File Info Formatting']) {
        FileInfo.init();
      }
      if (_conf['Sauce']) {
        Sauce.init();
      }
      if (_conf['Reveal Spoilers']) {
        RevealSpoilers.init();
      }
      if (_conf['Image Auto-Gif']) {
        AutoGif.init();
      }
      if (_conf['Png Thumbnail Fix']) {
        PngFix.init();
      }
      if (_conf['Image Hover']) {
        ImageHover.init();
      }
      if (_conf['Menu']) {
        Menu.init();
        if (_conf['Report Link']) {
          ReportLink.init();
        }
        if (_conf['Delete Link']) {
          DeleteLink.init();
        }
        if (_conf['Filter']) {
          Filter.menuInit();
        }
        if (_conf['Archive Link']) {
          ArchiveLink.init();
        }
        if (_conf['Download Link']) {
          DownloadLink.init();
        }
        if (_conf['Embed Link']) {
          EmbedLink.init();
        }
        if (_conf['Thread Hiding Link']) {
          ThreadHideLink.init();
        }
        if (_conf['Reply Hiding Link']) {
          ReplyHideLink.init();
        }
      }
      if (_conf['Linkify']) {
        Linkify.init();
      }
      if (_conf['Resurrect Quotes']) {
        Quotify.init();
      }
      if (_conf['Remove Spoilers']) {
        RemoveSpoilers.init();
      }
      if (_conf['Quote Inline']) {
        QuoteInline.init();
      }
      if (_conf['Quote Preview']) {
        QuotePreview.init();
      }
      if (_conf['Quote Backlinks']) {
        QuoteBacklink.init();
      }
      if (_conf['Indicate Own Posts']) {
        MarkOwn.init();
      }
      if (_conf['Indicate OP quote']) {
        QuoteOP.init();
      }
      if (_conf['Indicate Cross-thread Quotes']) {
        QuoteCT.init();
      }
      if (_conf['Color user IDs']) {
        IDColor.init();
      }
      if (_conf['Replace GIF'] || _conf['Replace PNG'] || _conf['Replace JPG']) {
        ImageReplace.init();
      }
      return $.ready(Main.featuresReady);
    },
    featuresReady: function() {
      var a, board, nav, node, nodes, now, ready, _conf, _i, _j, _len, _len1, _ref, _ref1;

      _conf = Conf;
      if (/^4chan - 404/.test(d.title)) {
        if (_conf['404 Redirect'] && /^\d+$/.test(g.THREAD_ID)) {
          location.href = Redirect.to({
            board: g.BOARD,
            threadID: g.THREAD_ID,
            postID: location.hash
          });
        }
        return;
      }
      if (!$.id('navtopright')) {
        return;
      }
      $.addClass(d.body, $.engine);
      $.addClass(d.body, 'fourchan_x');
      if (_conf['Custom Navigation']) {
        CustomNavigation.init();
      }
      _ref = ['boardNavDesktop', 'boardNavDesktopFoot'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nav = _ref[_i];
        if (a = $("a[href*='/" + g.BOARD + "/']", $.id(nav))) {
          $.addClass(a, 'current');
        }
      }
      now = Date.now();
      Favicon.init();
      Options.init();
      if (_conf['Quick Reply']) {
        QR.init();
      }
      if (_conf['Image Expansion']) {
        ImageExpand.init();
      }
      if (_conf['Catalog Links']) {
        CatalogLinks.init();
      }
      if (_conf['Thread Watcher']) {
        Watcher.init();
      }
      if (_conf['Keybinds']) {
        Keybinds.init();
      }
      if (_conf['Fappe Tyme']) {
        FappeTyme.init();
      }
      if (_conf['Announcement Hiding']) {
        AnnouncementHiding.init();
      }
      if (g.REPLY) {
        if (_conf['Prefetch']) {
          Prefetch.init();
        }
        if (_conf['Thread Updater']) {
          Updater.init();
        }
        if (_conf['Thread Stats']) {
          ThreadStats.init();
        }
        if (_conf['Reply Navigation']) {
          Nav.init();
        }
        if (_conf['Post in Title']) {
          TitlePost.init();
        }
        if (_conf['Unread Count'] || _conf['Unread Favicon']) {
          Unread.init();
        }
      } else {
        if (_conf['Thread Hiding']) {
          ThreadHiding.init();
        }
        if (_conf['Thread Expansion']) {
          ExpandThread.init();
        }
        if (_conf['Comment Expansion']) {
          ExpandComment.init();
        }
        if (_conf['Index Navigation']) {
          Nav.init();
        }
      }
      board = $('.board');
      nodes = [];
      ready = function() {
        if (d.readyState === "complete") {
          return true;
        }
        return false;
      };
      _ref1 = $$('.postContainer', board);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        node = _ref1[_j];
        Main.node(Main.preParse(node), ready);
      }
      if (MutationObserver) {
        Main.observer = new MutationObserver(Main.observe);
        Main.observer.observe(board, {
          childList: true,
          subtree: true
        });
        $.ready(function() {
          return Main.observer.disconnect();
        });
      } else {
        $.on(board, 'DOMNodeInserted', Main.listener);
        $.ready(function() {
          return $.off(board, 'DOMNodeInserted', Main.listener);
        });
      }
    },
    prune: function() {
      var cutoff, hiddenThreads, id, now, ownedPosts, timestamp, titles, _ref;

      now = Date.now();
      g.hiddenReplies = $.get("hiddenReplies/" + g.BOARD + "/", {});
      if ($.get('lastChecked', 0) < now - 1 * $.DAY) {
        $.set('lastChecked', now);
        cutoff = now - 7 * $.DAY;
        hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
        ownedPosts = $.get('ownedPosts', {});
        titles = $.get('CachedTitles', {});
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
        for (id in ownedPosts) {
          timestamp = ownedPosts[id];
          if (timestamp < cutoff) {
            delete ownedPosts[id];
          }
        }
        for (id in titles) {
          if (titles[id][1] < cutoff) {
            delete titles[id];
          }
        }
        $.set("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
        $.set("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
        $.set('CachedTitles', titles);
        return $.set('ownedPosts', ownedPosts);
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
    message: function(e) {
      var version, xupdate;

      version = e.data.version;
      if (version && version !== Main.version) {
        xupdate = $.el('div', {
          id: 'xupdater',
          className: 'reply',
          innerHTML: "<a href=https://raw.github.com/zixaphir/appchan-x/" + version + "/appchan_x.user.js>An updated version of Appchan X (v" + version + ") is available.</a> <a href=javascript:; id=dismiss_xupdate>dismiss</a>"
        });
        $.on($('#dismiss_xupdate', xupdate), 'click', function() {
          return $.rm(xupdate);
        });
        return $.prepend($.id('delform'), xupdate);
      }
    },
    preParse: function(node) {
      var el, img, imgParent, parent, parentClass, post;

      parentClass = (parent = node.parentElement) ? parent.className : "";
      el = $('.post', node);
      post = {
        root: node,
        el: el,
        "class": el.className,
        ID: el.id.match(/\d+$/)[0],
        threadID: g.THREAD_ID || (parent ? $.x('ancestor::div[parent::div[@class="board"]]', node).id.match(/\d+$/)[0] : void 0),
        isArchived: parentClass.contains('archivedPost'),
        isInlined: /\binline\b/.test(parentClass),
        isCrosspost: parentClass.contains('crosspost'),
        blockquote: el.lastElementChild,
        quotes: el.getElementsByClassName('quotelink'),
        backlinks: el.getElementsByClassName('backlink'),
        fileInfo: false,
        img: false
      };
      if (img = $('img[data-md5]', el)) {
        imgParent = img.parentNode;
        post.img = img;
        post.fileInfo = imgParent.previousElementSibling;
        post.hasPdf = /\.pdf$/.test(imgParent.href);
      }
      Main.prettify(post.blockquote);
      return post;
    },
    node: function(node, notify) {
      var callback, err, _i, _len, _ref;

      _ref = Main.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        try {
          callback(node);
        } catch (_error) {
          err = _error;
          if (notify) {
            alert("4chan X has experienced an error. You can help by sending this snippet to:\nhttps://github.com/zixaphir/appchan-x/issues\n\n" + Main.version + "\n" + window.location + "\n" + navigator.userAgent + "\n\n" + err + "\n" + err.stack);
          }
        }
      }
    },
    observe: function(mutations) {
      var addedNode, mutation, nodes, _i, _len, _results;

      nodes = [];
      _results = [];
      for (_i = 0, _len = mutations.length; _i < _len; _i++) {
        mutation = mutations[_i];
        _results.push((function() {
          var _j, _len1, _ref, _results1;

          _ref = mutation.addedNodes;
          _results1 = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            addedNode = _ref[_j];
            if (/\bpostContainer\b/.test(addedNode.className)) {
              _results1.push(Main.node(Main.preParse(addedNode)));
            }
          }
          return _results1;
        })());
      }
      return _results;
    },
    listener: function(e) {
      var target;

      target = e.target;
      if (/\bpostContainer\b/.test(target.className)) {
        return Main.node(Main.preParse(target));
      }
    },
    prettify: function(bq) {
      var code;

      if (!Main.hasCodeTags) {
        return;
      }
      switch (g.BOARD) {
        case 'g':
          code = function() {
            var pre, _i, _len, _ref;

            _ref = document.getElementById('_id_').getElementsByClassName('prettyprint');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              pre = _ref[_i];
              pre.innerHTML = prettyPrintOne(pre.innerHTML.replace(/\s/g, '&nbsp;'));
            }
          };
          break;
        case 'sci':
          code = function() {
            jsMath.Process(document.getElementById('_id_'));
          };
          break;
        default:
          return;
      }
      return $.globalEval(("" + code).replace('_id_', bq.id));
    },
    namespace: '4chan_x.',
    version: '1.0.8',
    callbacks: []
  };

  Main.init();

}).call(this);
