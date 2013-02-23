// ==UserScript==
// @name                appchan x
// @namespace           zixaphir
// @version             1.1.2
// @description         Cross-browser userscript for maximum lurking on 4chan.
// @copyright           2013 Zixaphir <zixaphirmoxphar@gmail.com>
// @copyright           2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright           2013 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license             MIT; http://en.wikipedia.org/wiki/Mit_license
// @match               *://*.4chan.org/*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_openInTab
// @run-at              document-start
// @updateURL           https://github.com/zixaphir/appchan-x/raw/stable/appchan_x.meta.js
// @downloadURL         https://github.com/zixaphir/appchan-x/raw/stable/appchan_x.user.js
// @icon                data:image/gif;base64,R0lGODlhYAAQAJEAAGbMM////wAAAP///yH5BAEAAAMALAAAAABgABAAAAL8nI+py+0Po5y02ruEFmh7PnxbJ3KecR4pqoWr2iajIgR2AIb3bu43WPPhdENiLmg7Jn25EODZFDwBTSIPJRwir1tuElvshrNf1RR4lv2QPZzmG9zA16c4uO3+WeVl55Qq9RdVZlc4p3VYdcfXBpSo0ufyJ1gVx2j0huhmWKSW1Xhpd0czSZVBhucl1Hj6acVkBNnZIcggdgh7y0qTFIoaOypTqoiZCTpjiRwp66jp8RhsVmrq2bzbsbz3AcxpDfztBxUIVT0qij0LtsoN3c1MSx5eSQiNTqzL7mzed+4khfZPBrIRL1jEoFHCRYw6A1usKGiiQwgMFCtalFAAADs=
// ==/UserScript==

/*
 * appchan x - Version 1.1.2 - 2013-02-22
 *
 * Licensed under the MIT license.
 * https://github.com/zixaphir/appchan-x/blob/master/LICENSE
 *
 * Appchan X Copyright © 2013 Zixaphir <zixaphirmoxphar@gmail.com>
 *   http://zixaphir.github.com/appchan-x/
 * 4chan x Copyright © 2009-2011 James Campos <james.r.campos@gmail.com>
 *   http://aeosynth.github.com/4chan-x/
 * 4chan x Copyright © 2013 Nicolas Stepien <stepien.nicolas@gmail.com>
 *   http://mayhemydg.github.com/4chan-x/
 * OneeChan Copyright © 2013 Jordan Bates
 *   http://seaweedchan.github.com/oneechan/
 * 4chan SS Copyright © 2013 Ahodesuka
 *   http://ahodesuka.github.com/4chan-Style-Script
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
  var $, $$, Anonymize, ArchiveLink, BanChecker, Build, CatalogLinks, Conf, Config, CustomNavigation, DeleteLink, DownloadLink, EmbedLink, Emoji, ExpandComment, ExpandThread, FappeTyme, Favicon, FileInfo, Filter, Get, IDColor, Icons, ImageExpand, ImageHover, ImageReplace, JSColor, Keybinds, Linkify, Main, MarkOwn, Markdown, MascotTools, Mascots, Menu, MutationObserver, Nav, Navigation, Options, Prefetch, QR, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, Quotify, Redirect, ReplyHideLink, ReplyHiding, ReportLink, RevealSpoilers, Sauce, StrikethroughQuotes, Style, ThemeTools, Themes, ThreadHideLink, ThreadHiding, ThreadStats, Time, TitlePost, UI, Unread, Updater, Watcher, d, editMascot, editTheme, g, userNavigation, _base;

  Config = {
    main: {
      Enhancing: {
        'Catalog Links': [true, 'Turn Navigation links into links to each board\'s catalog.'],
        'External Catalog': [false, 'Link to external catalog instead of the internal one.'],
        '404 Redirect': [true, 'Redirect dead threads and images'],
        'Keybinds': [true, 'Binds actions to keys'],
        'Time Formatting': [true, 'Arbitrarily formatted timestamps, using your local time'],
        'File Info Formatting': [true, 'Reformats the file information'],
        'Comment Expansion': [true, 'Expand too long comments'],
        'Thread Expansion': [true, 'View all replies'],
        'Index Navigation': [true, 'Navigate to previous / next thread'],
        'Reply Navigation': [false, 'Navigate to top / bottom of thread'],
        'Custom Navigation': [false, 'Customize your Navigation bar.'],
        'Append Delimiters': [false, 'Adds delimiters before and after custom navigation.'],
        'Check for Updates': [true, 'Check for updated versions of Appchan X'],
        'Check for Bans': [false, 'Check ban status and prepend it to the top of the page.'],
        'Check for Bans constantly': [false, 'Optain ban status on every refresh. Note that this will cause delay on getting the result.']
      },
      Linkification: {
        'Linkify': [true, 'Convert text into links where applicable. If a link is too long and only partially linkified, shift+ctrl+click it to merge the next line.'],
        'Embedding': [true, 'Add a link to linkified audio and video links. Supported sites: YouTube, Vimeo, SoundCloud, Vocaroo, and some audio links, depending on your browser.'],
        'Link Title': [true, 'Replace the link of a supported site with its actual title. Currently Supported: YouTube, Vimeo, SoundCloud']
      },
      Filtering: {
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
        'Download Link': [true, 'Add a download with original filename link to the menu. Chrome-only currently.'],
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
        'Thread Watcher': [true, 'Bookmark threads'],
        'Auto Watch': [true, 'Automatically watch threads that you start'],
        'Auto Watch Reply': [false, 'Automatically watch threads that you reply to'],
        'Color user IDs': [false, 'Assign unique colors to user IDs on boards that use them'],
        'Mark Owned Posts': [true, 'Mark quotes to posts you\'ve authored.'],
        'Remove Spoilers': [false, 'Remove all spoilers in text.'],
        'Indicate Spoilers': [false, 'Indicate spoilers if Remove Spoilers is enabled.']
      },
      Posting: {
        'Cooldown': [true, 'Prevent "flood detected" errors.'],
        'Persistent QR': [true, 'The Quick reply won\'t disappear after posting.'],
        'Auto Hide QR': [false, 'Automatically hide the quick reply when posting.'],
        'Open Reply in New Tab': [false, 'Open replies in a new tab that are made from the main board.'],
        'Per Board Persona': [false, 'Remember Name, Email, Subject, etc per board instead of globally.'],
        'Remember QR size': [false, 'Remember the size of the Quick reply (Firefox only).'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Remember Sage': [false, 'Remember email even if it contains sage.'],
        'Markdown': [false, 'Code, italic, bold, italic bold, double struck - `, *, **, ***, ||, respectively. _ can be used instead of *.']
      },
      Quoting: {
        'Quote Backlinks': [true, 'Add quote backlinks'],
        'OP Backlinks': [false, 'Add backlinks to the OP'],
        'Quote Highlighting': [true, 'Highlight the previewed post'],
        'Quote Inline': [true, 'Show quoted post inline on quote click'],
        'Quote Hash Navigation': [true, 'Show a "#" to jump around the thread as if Quote Inline were disabled.'],
        'Quote Preview': [true, 'Show quote content on hover'],
        'Resurrect Quotes': [true, 'Linkify dead quotes to archives'],
        'Indicate OP quote': [true, 'Add \'(OP)\' to OP quotes'],
        'Indicate Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes'],
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
    fileInfo: '%l (%p%s, %r)',
    favicon: 'ferongr',
    updateIncrease: '5,10,15,20,30,60,90,120,240,300',
    updateIncreaseB: '5,10,15,20,30,60,90,120,240,300',
    customCSS: "/* Tripcode Italics: */\n/*\nspan.postertrip {\n  font-style: italic;\n}\n*/\n\n/* Add a rounded border to thumbnails (but not expanded images): */\n/*\n.fileThumb > img:first-child {\n  border: solid 2px rgba(0,0,100,0.5);\n  border-radius: 10px;\n}\n*/\n\n/* Make highlighted posts look inset on the page: */\n/*\ndiv.post:target,\ndiv.post.highlight {\n  box-shadow: inset 2px 2px 2px rgba(0,0,0,0.2);\n}\n*/",
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
    embedHeight: 390,
    style: {
      Interface: {
        'Single Column Mode': [true, 'Presents options in a single column, rather than in blocks.'],
        'Sidebar': ['normal', 'Alter the sidebar size. Completely hiding it can cause content to overlap, but with the correct option combinations can create a minimal 4chan layout that has more efficient screen real-estate than vanilla 4chan.', ['large', 'normal', 'minimal', 'hide']],
        'Sidebar Location': ['right', 'The side of the page the sidebar content is on. It is highly recommended that you do not hide the sidebar if you change this option.', ['left', 'right']],
        'Left Thread Padding': ['0', 'Add some spacing between the left edge of document and the threads.', 'text'],
        'Right Thread Padding': ['0', 'Add some spacing between the right edge of document and the threads.', 'text'],
        'Announcements': ['slideout', 'The style of announcements and the ability to hide them.', ['4chan default', 'slideout', 'hide']],
        'Board Title': ['at sidebar top', 'The positioning of the board\'s logo and subtitle.', ['at sidebar top', 'at sidebar bottom', 'at top', 'under post form', 'hide']],
        'Custom Board Titles': [false, 'Customize Board Titles by shift-clicking the board title or subtitle.'],
        'Board Subtitle': [true, 'Show the board subtitle.'],
        '4chan Banner': ['at sidebar top', 'The positioning of 4chan\'s image banner.', ['at sidebar top', 'at sidebar bottom', 'under post form', 'at top', 'hide']],
        '4chan Banner Reflection': [false, 'Adds reflection effects to 4chan\'s image banner.'],
        'Faded 4chan Banner': [true, 'Make 4chan\'s image banner translucent.'],
        'Icon Orientation': ['horizontal', 'Change the orientation of the appchan x icons.', ['horizontal', 'vertical']],
        'Slideout Watcher': [true, 'Adds an icon you can hover over to show the watcher, as opposed to having the watcher always visible.'],
        'Updater Position': ['top', 'The position of 4chan thread updater and stats', ['top', 'bottom', 'moveable']]
      },
      Posts: {
        'Alternate Post Colors': [false, 'Make post background colors alternate every other post.'],
        'Color Reply Headings': [false, 'Give the post info a background.'],
        'Color File Info': [false, 'Give the file info a background.'],
        'OP Background': [false, 'Adds a border and background color to the OP Post, as if it were a reply.'],
        'Backlinks Position': ['default', 'The position of backlinks in relation to the post.', ['default', 'lower left', 'lower right']],
        'Sage Highlighting': ['image', 'Icons or text to highlight saged posts.', ['text', 'image', 'none']],
        'Sage Highlight Position': ['after', 'Position of Sage Highlighting', ['before', 'after']],
        'Filtered Backlinks': [true, 'Mark backlinks to filtered posts.'],
        'Force Reply Break': [false, 'Force replies to occupy their own line and not be adjacent to the OP image.'],
        'Fit Width Replies': [true, 'Replies fit the entire width of the page.'],
        'Reply Spacing': ['small', 'The amount of space between replies.', ['none', 'minimal', 'small', 'medium', 'large']],
        'Reply Padding': ['normal', 'The padding around post content of replies.', ['phat', 'normal', 'slim', 'super slim', 'anorexia']],
        'Hide Horizontal Rules': [false, 'Hides lines between threads.'],
        'Images Overlap Post Form': [true, 'Images expand over the post form and sidebar content, usually used with "Expand images" set to "full".']
      },
      Aesthetics: {
        '4chan SS Navigation': [false, 'Try to emulate the appearance of 4chan SS\'s Navigation.'],
        '4chan SS Sidebar': [false, 'Try to emulate the appearance of 4chan SS\'s Sidebar.'],
        'Block Ads': [false, 'Block advertisements. It\'s probably better to use AdBlock for this.'],
        'Bolds': [true, 'Bold text for usernames and such.'],
        'Shrink Ads': [false, 'Make 4chan advertisements smaller.'],
        'Sidebar Glow': [false, 'Adds a glow to the sidebar\'s text.'],
        'Circle Checkboxes': [false, 'Make checkboxes circular.'],
        'Custom CSS': [false, 'Add (more) custom CSS to Appchan X'],
        'Emoji': ['enabled', 'Enable emoji', ['enabled', 'disable ponies', 'only ponies', 'disable']],
        'Emoji Position': ['before', 'Position of emoji icons, like sega and neko.', ['before', 'after']],
        'Emoji Spacing': ['5', 'Add some spacing between emoji and text.', 'text'],
        'Font': ['sans-serif', 'The font used by all elements of 4chan.', 'text'],
        'Font Size': ['12', 'The font size of posts and various UI. This changes most, but not all, font sizes.', 'text'],
        'Icons': ['oneechan', 'Icon theme which Appchan will use.', ['oneechan', '4chan SS']],
        'Invisible Icons': [false, 'Makes icons invisible unless hovered. Invisible really is "invisible", so don\'t use it if you don\'t have your icons memorized or don\'t use keybinds.'],
        'Quote Shadows': [true, 'Add shadows to the quote previews and inline quotes.'],
        'Rounded Edges': [false, 'Round the edges of various 4chan elements.'],
        'Slideout Transitions': [false, 'Animate slideouts.'],
        'Underline Links': [false, 'Put lines under hyperlinks.'],
        'NSFW/SFW Themes': [false, 'Choose your theme based on the SFW status of the board you are viewing.']
      },
      Mascots: {
        'Mascots': [true, 'Add a pretty picture of your waifu to Appchan.'],
        'Mascot Location': ['sidebar', 'Change where your mascot is located.', ['sidebar', 'opposite']],
        'Mascot Position': ['default', 'Change where your mascot is placed in relation to the post form.', ['above post form', 'default', 'bottom']],
        'Mascots Overlap Posts': [true, 'Mascots overlap threads and posts.'],
        'NSFW/SFW Mascots': [false, 'Enable or disable mascots based on the SFW status of the board you are viewing.'],
        'Grayscale Mascots': [false, 'Force mascots to be monochrome.'],
        'Mascot Opacity': ['1.00', 'Make Mascots transparent.', 'text'],
        'Hide Mascots on Catalog': [false, 'Do not show mascots on the official catalog pages.']
      },
      Navigation: {
        'Boards Navigation': ['sticky top', 'The position of 4chan board navigation', ['sticky top', 'sticky bottom', 'top', 'hide']],
        'Navigation Alignment': ['center', 'Change the text alignment of the navigation.', ['left', 'center', 'right']],
        'Slideout Navigation': ['compact', 'How the slideout navigation will be displayed.', ['compact', 'list', 'hide']],
        'Pagination': ['sticky bottom', 'The position of 4chan page navigation', ['sticky top', 'sticky bottom', 'top', 'bottom', 'on side', 'hide']],
        'Pagination Alignment': ['center', 'Change the text alignment of the pagination.', ['left', 'center', 'right']],
        'Hide Navigation Decorations': [false, 'Hide non-link text in the board navigation and pagination. This also disables the delimiter in <code>Custom Navigation</code>']
      },
      'Post Form': {
        'Compact Post Form Inputs': [true, 'Use compact inputs on the post form.'],
        'Hide Show Post Form': [false, 'Hides the "Show Post Form" button when Persistent QR is disabled.'],
        'Show Post Form Header': [false, 'Force the Post Form to have a header.'],
        'Post Form Style': ['tabbed slideout', 'How the post form will sit on the page.', ['fixed', 'slideout', 'tabbed slideout', 'transparent fade', 'float']],
        'Post Form Slideout Transitions': [true, 'Animate slideouts for the post form.'],
        'Post Form Decorations': [false, 'Add a border and background to the post form (does not apply to the "float" post form style.'],
        'Textarea Resize': ['vertical', 'Options to resize the post form\'s comment box.', ['both', 'horizontal', 'vertical', 'none', 'auto-expand']],
        'Tripcode Hider': [true, 'Intelligent name field hiding.']
      }
    },
    theme: 'Yotsuba B',
    mascot: ''
  };

  if (!/^[a-z]+\.4chan\.org$/.test(location.hostname)) {
    return;
  }

  Conf = {};

  editTheme = {};

  editMascot = {};

  userNavigation = {};

  d = document;

  g = {};

  g.TYPE = 'sfw';

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
    id: d.getElementById.bind(d),
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
    rm: function(el) {
      return el.parentNode.removeChild(el);
    },
    tn: function(string) {
      return d.createTextNode(string);
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
    hidden: function() {
      return d.hidden || d.mozHidden || d.webkitHidden || d.oHidden;
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
    if (result = Array.prototype.slice.call(root.querySelectorAll(selector))) {
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
      el.style.cssText = $.get(id + ".position", position);
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
      $.set(UI.el.id + ".position", UI.el.style.cssText);
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
      var a;
      if (!$.get('firstrun')) {
        $.set('firstrun', true);
        if (!Favicon.el) {
          Favicon.init();
        }
        Options.dialog();
      }
      a = $.el('a', {
        id: 'settingsWindowLink',
        title: 'Appchan X Settings',
        href: 'javascript:;'
      });
      $.on(a, 'click', function() {
        return Options.dialog();
      });
      return $.replace($.id('settingsWindowLink'), a);
    },
    dialog: function(tab) {
      var archiver, arr, back, category, checked, customCSS, description, dialog, div, favicon, fileInfo, filter, height, hiddenNum, hiddenThreads, input, key, label, li, liHTML, name, obj, optionname, optionvalue, overlay, sauce, selectoption, styleSetting, time, toSelect, tr, ul, updateIncrease, updateIncreaseB, value, width, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4;
      if (Conf['editMode'] === "theme") {
        if (confirm("Opening the options dialog will close and discard any theme changes made with the theme editor.")) {
          ThemeTools.close();
        }
        return;
      }
      if (Conf['editMode'] === "mascot") {
        if (confirm("Opening the options dialog will close and discard any mascot changes made with the mascot editor.")) {
          MascotTools.close();
        }
        return;
      }
      dialog = Options.el = $.el('div', {
        id: 'options',
        className: 'reply dialog',
        innerHTML: '<div id=optionsbar>\
  <div id=credits>\
    <label for=apply>Apply</label>\
    | <a target=_blank href=http://zixaphir.github.com/appchan-x/>AppChan X</a>\
    | <a target=_blank href=https://raw.github.com/zixaphir/appchan-x/master/changelog>' + Main.version + '</a>\
    | <a target=_blank href=http://zixaphir.github.com/appchan-x/#bug-report>Issues</a>\
  </div>\
  <div class=tabs>\
    <label for=style_tab id=selected_tab>Style</label><label for=theme_tab>Themes</label><label for=mascot_tab>Mascots</label><label for=main_tab>Script</label><label for=filter_tab>Filter</label><label for=sauces_tab>Sauce</label><label for=keybinds_tab>Keybinds</label><label for=rice_tab>Rice</label>\
  </div>\
</div>\
<div id=optionsContent>\
  <input type=radio name=tab hidden id=main_tab>\
  <div class=main_tab></div>\
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
  <div>\
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
    <ul>\
      Archiver\
      <li>\
        Select an Archiver for this board:\
        <select name=archiver></select>\
      </li>\
    </ul>\
    <div class=warning><code>Quote Backlinks</code> are disabled.</div>\
    <ul>\
      Backlink formatting\
      <li><input name=backlink class=field> : <span id=backlinkPreview></span></li>\
    </ul>\
    <div class=warning><code>Time Formatting</code> is disabled.</div>\
    <ul>\
      Time formatting\
      <li><input name=time class=field> : <span id=timePreview></span></li>\
      <li>Supported <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</li>\
      <li>Day: %a, %A, %d, %e</li>\
      <li>Month: %m, %b, %B</li>\
      <li>Year: %y</li>\
      <li>Hour: %k, %H, %l (lowercase L), %I (uppercase i), %p, %P</li>\
      <li>Minutes: %M</li>\
      <li>Seconds: %S</li>\
    </ul>\
    <div class=warning><code>File Info Formatting</code> is disabled.</div>\
    <ul>\
      File Info Formatting\
      <li><input name=fileInfo class=field> : <span id=fileInfoPreview class=fileText></span></li>\
      <li>Link: %l (lowercase L, truncated), %L (untruncated), %t (Unix timestamp)</li>\
      <li>Original file name: %n (truncated), %N (untruncated), %T (Unix timestamp)</li>\
      <li>Spoiler indicator: %p</li>\
      <li>Size: %B (Bytes), %K (KB), %M (MB), %s (4chan default)</li>\
      <li>Resolution: %r (Displays PDF on /po/, for PDFs)</li>\
    </ul>\
    <ul>\
      Specify size of video embeds<br>\
      Height: <input name=embedHeight type=number />px\
      |\
      Width:  <input name=embedWidth  type=number />px\
      <button name=resetSize>Reset</button>\
    </ul>\
    <ul>\
      <li>Amounts for Optional Increase</li>\
      <li>Visible tab</li>\
      <li><input name=updateIncrease class=field></li>\
      <li>Background tab</li>\
      <li><input name=updateIncreaseB class=field></li>\
    </ul>\
    <div class=warning><code>Custom Navigation</code> is disabled.</div>\
    <div id=customNavigation>\
    </div>\
    <div class=warning><code>Per Board Persona</code> is disabled.</div>\
    <div id=persona>\
      <select name=personaboards></select>\
      <ul>\
        <li>\
          <div class=option>\
            Name:\
          </div>\
        </li>\
        <li>\
          <div class=option>\
            <input name=name>\
          </div>\
        </li>\
        <li>\
          <div class=option>\
            Email:\
          </div>\
        </li>\
        <li>\
          <div class=option>\
            <input name=email>\
          </div>\
        </li>\
        <li>\
          <div class=option>\
            Subject:\
          </div>\
        </li>\
        <li>\
          <div class=option>\
            <input name=sub>\
          </div>\
        </li>\
        <li>\
          <button></button>\
        </li>\
      </ul>\
    </div>\
    <div class=warning><code>Custom CSS</code> is disabled.</div>\
    Remove Comment blocks to use! ( "/*" and "*/" around CSS blocks )\
    <textarea name=customCSS id=customCSS class=field></textarea>\
    <ul>\
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
    </ul>\
    <span></span>\
  </div>\
  <input type=radio name=tab hidden id=keybinds_tab>\
  <div class=keybinds_tab>\
    <div class=warning><code>Keybinds</code> are disabled.</div>\
    <div>Allowed keys: Ctrl, Alt, Meta, a-z, A-Z, 0-9, Up, Down, Right, Left.</div>\
    <table><tbody>\
      <tr><th>Actions</th><th>Keybinds</th></tr>\
    </tbody></table>\
  </div>\
  <input type=radio name=tab hidden id=style_tab checked>\
  <div class=style_tab></div>\
  <input type=radio name=tab hidden id=theme_tab>\
  <div class=theme_tab></div>\
  <input type=radio name=tab hidden id=mascot_tab>\
  <div class=mascot_tab></div>\
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
      _ref1 = Config.main;
      for (key in _ref1) {
        obj = _ref1[key];
        ul = $.el('ul', {
          innerHTML: "<h3>" + key + "</h3>"
        });
        for (key in obj) {
          arr = obj[key];
          checked = $.get(key, Conf[key]) ? 'checked' : '';
          description = arr[1];
          li = $.el('li', {
            innerHTML: "<label><input type=checkbox name=\"" + key + "\" " + checked + "><span class=\"optionlabel\">" + key + "</span><div style=\"display: none\">" + description + "</div></label>"
          });
          $.on($('input', li), 'click', $.cb.checked);
          $.on($(".optionlabel", li), 'mouseover', Options.mouseover);
          $.add(ul, li);
        }
        $.add($('#main_tab + div', dialog), ul);
      }
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length;
      li = $.el('li', {
        innerHTML: "<span class=\"optionlabel\"><button>hidden: " + hiddenNum + "</button></span><div style=\"display: none\">Forget all hidden posts. Useful if you accidentally hide a post and have \"Show Stubs\" disabled.</div>"
      });
      $.on($('button', li), 'click', Options.clearHidden);
      $.on($('.optionlabel', li), 'mouseover', Options.mouseover);
      $.add($('ul:nth-child(3)', dialog), li);
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
      div = $.el('div', {
        className: "suboptions"
      });
      _ref3 = Config.style;
      for (category in _ref3) {
        obj = _ref3[category];
        ul = $.el('ul', {
          innerHTML: "<h3>" + category + "</h3>"
        });
        for (optionname in obj) {
          arr = obj[optionname];
          description = arr[1];
          if (arr[2] === 'text') {
            li = $.el('li', {
              className: "styleoption",
              innerHTML: "<div class=\"option\"><span class=\"optionlabel\">" + optionname + "</span><div style=\"display: none\">" + description + "</div></div><div class =\"option\"><input name=\"" + optionname + "\" style=\"width: 100%\"></div>"
            });
            styleSetting = $("input[name='" + optionname + "']", li);
            styleSetting.value = $.get(optionname, Conf[optionname]);
            $.on(styleSetting, 'blur', function() {
              $.cb.value.call(this);
              return Style.addStyle();
            });
          } else if (arr[2]) {
            liHTML = "<div class=\"option\"><span class=\"optionlabel\">" + optionname + "</span><div style=\"display: none\">" + description + "</div></div><div class =\"option\"><select name=\"" + optionname + "\"></div>";
            _ref4 = arr[2];
            for (optionvalue = _k = 0, _len2 = _ref4.length; _k < _len2; optionvalue = ++_k) {
              selectoption = _ref4[optionvalue];
              liHTML += "<option value=\"" + selectoption + "\">" + selectoption + "</option>";
            }
            liHTML += "</select>";
            li = $.el('li', {
              innerHTML: liHTML,
              className: "styleoption"
            });
            styleSetting = $("select[name='" + optionname + "']", li);
            styleSetting.value = $.get(optionname, Conf[optionname]);
            $.on(styleSetting, 'change', function() {
              $.cb.value.call(this);
              return Style.addStyle();
            });
          } else {
            checked = $.get(optionname, Conf[optionname]) ? 'checked' : '';
            li = $.el('li', {
              className: "styleoption",
              innerHTML: "<label><input type=checkbox name=\"" + optionname + "\" " + checked + "><span class=\"optionlabel\">" + optionname + "</span><div style=\"display: none\">" + description + "</div></label>"
            });
            $.on($('input', li), 'click', function() {
              $.cb.checked.call(this);
              return Style.addStyle();
            });
          }
          $.on($(".optionlabel", li), 'mouseover', Options.mouseover);
          $.add(ul, li);
        }
        $.add(div, ul);
      }
      $.add($('#style_tab + div', dialog), div);
      this.themeTab(dialog);
      $.on($('#mascot_tab', Options.el), 'click', function() {
        var el;
        if (el = $.id("mascotContainer")) {
          $.rm(el);
        }
        return Options.mascotTab.dialog(Options.el);
      });
      Options.indicators(dialog);
      overlay = $.el('div', {
        id: 'overlay'
      });
      $.on(overlay, 'click', Options.close);
      $.add(d.body, overlay);
      dialog.style.visibility = 'hidden';
      $.add(d.body, dialog);
      dialog.style.visibility = 'visible';
      if (tab) {
        $("[for='" + tab + "_tab']", dialog).click();
      }
      Options.filter.call(filter);
      Options.backlink.call(back);
      Options.time.call(time);
      Options.fileInfo.call(fileInfo);
      Options.favicon.call(favicon);
      return Style.rice(dialog);
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
    themeTab: function(dialog, mode) {
      var div, keys, name, parentdiv, suboptions, theme, _i, _j, _len, _len1;
      if (dialog == null) {
        dialog = Options.el;
      }
      if (!mode) {
        mode = 'default';
      }
      parentdiv = $.el('div', {
        id: "themeContainer"
      });
      suboptions = $.el('div', {
        className: "suboptions",
        id: "themes"
      });
      keys = Object.keys(Themes);
      keys.sort();
      if (mode === "default") {
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          name = keys[_i];
          theme = Themes[name];
          if (!theme["Deleted"]) {
            div = $.el('div', {
              className: name === Conf['theme'] ? 'selectedtheme' : '',
              id: name,
              innerHTML: "<div style='cursor: pointer; position: relative; margin-bottom: 2px; width: 100% !important; box-shadow: none !important; background:" + theme['Reply Background'] + "!important;border:1px solid " + theme['Reply Border'] + "!important;color:" + theme['Text'] + "!important'>  <div style='padding: 3px 0px 0px 8px;'>    <span style='color:" + theme['Subjects'] + "!important; font-weight: 600 !important'>      " + name + "    </span>    <span style='color:" + theme['Names'] + "!important; font-weight: 600 !important'>      " + theme['Author'] + "    </span>    <span style='color:" + theme['Sage'] + "!important'>      (SAGE)    </span>    <span style='color:" + theme['Tripcodes'] + "!important'>      " + theme['Author Tripcode'] + "    </span>    <time style='color:" + theme['Timestamps'] + "'>      20XX.01.01 12:00    </time>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Post Numbers'] + "!important&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important;&quot;)' style='color:" + theme['Post Numbers'] + "!important;' href='javascript:;'>      No.27583594    </a>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Backlinks'] + "!important;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important;&quot;)' style='color:" + theme['Backlinks'] + "!important;' href='javascript:;' name='" + name + "' class=edit>      &gt;&gt;edit    </a>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Backlinks'] + "!important;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important;&quot;)' style='color:" + theme['Backlinks'] + "!important;' href='javascript:;' name='" + name + "' class=export>      &gt;&gt;export    </a>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Backlinks'] + "!important;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important;&quot;)' style='color:" + theme['Backlinks'] + "!important;' href='javascript:;' name='" + name + "' class=delete>      &gt;&gt;delete    </a>  </div>  <blockquote style='margin: 0; padding: 12px 40px 12px 38px'>    <a style='color:" + theme['Quotelinks'] + "!important; text-shadow: none;'>      &gt;&gt;27582902    </a>    <br>    Post content is right here.  </blockquote>  <h1 style='color: " + theme['Text'] + "'>    Selected  </h1></div>"
            });
            div.style.backgroundColor = theme['Background Color'];
            $.on($('a.edit', div), 'click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              ThemeTools.init(this.name);
              return Options.close();
            });
            $.on($('a.export', div), 'click', function(e) {
              var exportTheme, exportedTheme;
              e.preventDefault();
              e.stopPropagation();
              exportTheme = Themes[this.name];
              exportTheme['Theme'] = this.name;
              exportedTheme = "data:application/json," + encodeURIComponent(JSON.stringify(exportTheme));
              if (window.open(exportedTheme, "_blank")) {

              } else if (confirm("Your popup blocker is preventing Appchan X from exporting this theme. Would you like to open the exported theme in this window?")) {
                return window.location(exportedTheme);
              }
            });
            $.on($('a.delete', div), 'click', function(e) {
              var container, settheme, userThemes;
              e.preventDefault();
              e.stopPropagation();
              container = $.id(this.name);
              if (!(container.previousSibling || container.nextSibling)) {
                alert("Cannot delete theme (No other themes available).");
                return;
              }
              if (confirm("Are you sure you want to delete \"" + this.name + "\"?")) {
                if (this.name === Conf['theme']) {
                  if (settheme = container.previousSibling || container.nextSibling) {
                    Conf['theme'] = settheme.id;
                    $.addClass(settheme, 'selectedtheme');
                    $.set('theme', Conf['theme']);
                  }
                }
                Themes[this.name]["Deleted"] = true;
                userThemes = $.get("userThemes", {});
                userThemes[this.name] = Themes[this.name];
                $.set('userThemes', userThemes);
                return $.rm(container);
              }
            });
            $.on(div, 'click', Options.selectTheme);
            $.add(suboptions, div);
          }
        }
        div = $.el('div', {
          id: 'addthemes',
          innerHTML: "<a id=newtheme href='javascript:;'>New Theme</a> / <a id=import href='javascript:;'>Import Theme</a><input id=importbutton type=file hidden> / <a id=SSimport href='javascript:;'>Import from 4chan SS</a><input id=SSimportbutton type=file hidden> / <a id=OCimport href='javascript:;'>Import from Oneechan</a><input id=OCimportbutton type=file hidden> / <a id=tUndelete href='javascript:;'>Undelete Theme</a>  "
        });
        $.on($("#newtheme", div), 'click', function() {
          ThemeTools.init("untitled");
          return Options.close();
        });
        $.on($("#import", div), 'click', function() {
          return this.nextSibling.click();
        });
        $.on($("#importbutton", div), 'change', function(evt) {
          return ThemeTools.importtheme("appchan", evt);
        });
        $.on($("#OCimport", div), 'click', function() {
          return this.nextSibling.click();
        });
        $.on($("#OCimportbutton", div), 'change', function(evt) {
          return ThemeTools.importtheme("oneechan", evt);
        });
        $.on($("#SSimportbutton", div), 'change', function(evt) {
          return ThemeTools.importtheme("SS", evt);
        });
        $.on($("#SSimport", div), 'click', function() {
          return this.nextSibling.click();
        });
        $.on($('#tUndelete', div), 'click', function() {
          $.rm($.id("themeContainer"));
          return Options.themeTab(Options.el, 'undelete');
        });
      } else {
        for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
          name = keys[_j];
          theme = Themes[name];
          if (theme["Deleted"]) {
            div = $.el('div', {
              id: name,
              innerHTML: "<div style='cursor: pointer; position: relative; margin-bottom: 2px; width: 100% !important; box-shadow: none !important; background:" + theme['Reply Background'] + "!important;border:1px solid " + theme['Reply Border'] + "!important;color:" + theme['Text'] + "!important'>  <div style='padding: 3px 0px 0px 8px;'>    <span style='color:" + theme['Subjects'] + "!important; font-weight: 600 !important'>" + name + "</span>    <span style='color:" + theme['Names'] + "!important; font-weight: 600 !important'>" + theme['Author'] + "</span>    <span style='color:" + theme['Sage'] + "!important'>(SAGE)</span>    <span style='color:" + theme['Tripcodes'] + "!important'>" + theme['Author Tripcode'] + "</span>    <time style='color:" + theme['Timestamps'] + "'>20XX.01.01 12:00</time>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Post Numbers'] + "!important&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important&quot;)' style='color:" + theme['Post Numbers'] + "!important;' href='javascript:;'>No.27583594</a>  </div>  <blockquote style='margin: 0; padding: 12px 40px 12px 38px'>    <a style='color:" + theme['Quotelinks'] + "!important; text-shadow: none;'>      &gt;&gt;27582902    </a>    <br>    I forgive you for using VLC to open me. ;__;  </blockquote></div>"
            });
            $.on(div, 'click', function() {
              var userThemes;
              if (confirm("Are you sure you want to undelete \"" + this.id + "\"?")) {
                Themes[this.id]["Deleted"] = false;
                userThemes = $.get("userThemes", {});
                userThemes[this.id] = Themes[this.id];
                $.set('userThemes', userThemes);
                return $.rm(this);
              }
            });
            $.add(suboptions, div);
          }
        }
        div = $.el('div', {
          id: 'addthemes',
          innerHTML: "<a href='javascript:;'>Return</a>"
        });
        $.on($('a', div), 'click', function() {
          $.rm($.id("themeContainer"));
          return Options.themeTab();
        });
      }
      $.add(parentdiv, suboptions);
      $.add(parentdiv, div);
      $.add($('#theme_tab + div', dialog), parentdiv);
      return Options.indicators(dialog);
    },
    mascotTab: {
      dialog: function(dialog, mode) {
        var batchmascots, categories, category, header, keys, li, mascot, mascotHide, name, option, parentdiv, suboptions, ul, _i, _j, _k, _len, _len1, _len2, _ref;
        dialog || (dialog = Options.el);
        ul = {};
        categories = [];
        if (!mode) {
          mode = "default";
        }
        parentdiv = $.el("div", {
          id: "mascotContainer"
        });
        suboptions = $.el("div", {
          className: "suboptions",
          innerHTML: "<div class=warning><code>Mascots</code> are currently disabled. Please enable them in the Style tab to use mascot options.</div>"
        });
        mascotHide = $.el("div", {
          id: "mascot_hide",
          className: "reply",
          innerHTML: "Hide Categories <span></span><div></div>"
        });
        keys = Object.keys(Mascots);
        keys.sort();
        if (mode === 'default') {
          _ref = MascotTools.categories;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            category = _ref[_i];
            ul[category] = $.el("ul", {
              className: "mascots",
              id: category
            });
            if (Conf["Hidden Categories"].contains(category)) {
              ul[category].hidden = true;
            }
            header = $.el("h3", {
              className: "mascotHeader",
              textContent: category
            });
            categories.push(option = $.el("label", {
              name: category,
              innerHTML: "<input name='" + category + "' type=checkbox " + (Conf["Hidden Categories"].contains(category) ? 'checked' : '') + ">" + category
            }));
            $.on($('input', option), 'change', function() {
              return Options.mascotTab.toggle.call(this);
            });
            $.add(ul[category], header);
            $.add(suboptions, ul[category]);
          }
          for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
            name = keys[_j];
            if (!Conf["Deleted Mascots"].contains(name)) {
              mascot = Mascots[name];
              li = $.el('li', {
                className: 'mascot',
                id: name,
                innerHTML: "<div class='mascotname'>" + (name.replace(/_/g, " ")) + "</div><div class='mascotcontainer'><div class='mAlign " + mascot.category + "'><img class=mascotimg src='" + (Array.isArray(mascot.image) ? (Style.lightTheme ? mascot.image[1] : mascot.image[0]) : mascot.image) + "'></div></div><div class='mascotoptions'><a class=edit name='" + name + "' href='javascript:;'>Edit</a><a class=delete name='" + name + "' href='javascript:;'>Delete</a><a class=export name='" + name + "' href='javascript:;'>Export</a></div>"
              });
              if (Conf[g.MASCOTSTRING].contains(name)) {
                $.addClass(li, 'enabled');
              }
              $.on($('a.edit', li), 'click', function(e) {
                e.stopPropagation();
                MascotTools.dialog(this.name);
                return Options.close();
              });
              $.on($('a.delete', li), 'click', function(e) {
                var type, _k, _len2, _ref1;
                e.stopPropagation();
                if (confirm("Are you sure you want to delete \"" + this.name + "\"?")) {
                  if (Conf['mascot'] === this.name) {
                    MascotTools.init();
                  }
                  _ref1 = ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"];
                  for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                    type = _ref1[_k];
                    Conf[type].remove(this.name);
                    $.set(type, Conf[type]);
                  }
                  Conf["Deleted Mascots"].push(this.name);
                  $.set("Deleted Mascots", Conf["Deleted Mascots"]);
                  return $.rm($.id(this.name));
                }
              });
              $.on($('a.export', li), 'click', function(e) {
                var exportMascot, exportedMascot;
                e.stopPropagation();
                exportMascot = Mascots[this.name];
                exportMascot['Mascot'] = this.name;
                exportedMascot = "data:application/json," + encodeURIComponent(JSON.stringify(exportMascot));
                if (window.open(exportedMascot, "_blank")) {

                } else if (confirm("Your popup blocker is preventing Appchan X from exporting this theme. Would you like to open the exported theme in this window?")) {
                  return window.location(exportedMascot);
                }
              });
              $.on(li, 'click', function() {
                if (Conf[g.MASCOTSTRING].remove(this.id)) {
                  if (Conf['mascot'] === this.id) {
                    MascotTools.init();
                  }
                } else {
                  Conf[g.MASCOTSTRING].push(this.id);
                  MascotTools.init(this.id);
                }
                $.toggleClass(this, 'enabled');
                return $.set(g.MASCOTSTRING, Conf[g.MASCOTSTRING]);
              });
              if (MascotTools.categories.contains(mascot.category)) {
                $.add(ul[mascot.category], li);
              } else {
                $.add(ul[MascotTools.categories[0]], li);
              }
            }
          }
          $.add($('div', mascotHide), categories);
          batchmascots = $.el('div', {
            id: "mascots_batch",
            innerHTML: "<a href=\"javascript:;\" id=clear>Clear All</a> / <a href=\"javascript:;\" id=selectAll>Select All</a> / <a href=\"javascript:;\" id=createNew>Add Mascot</a> / <a href=\"javascript:;\" id=importMascot>Import Mascot</a><input id=importMascotButton type=file hidden> / <a href=\"javascript:;\" id=undelete>Undelete Mascots</a> / <a href=\"http://appchan.booru.org/\" target=_blank>Get More Mascots!</a>"
          });
          $.on($('#clear', batchmascots), 'click', function() {
            var enabledMascots, _k, _len2;
            enabledMascots = JSON.parse(JSON.stringify(Conf[g.MASCOTSTRING]));
            for (_k = 0, _len2 = enabledMascots.length; _k < _len2; _k++) {
              name = enabledMascots[_k];
              $.rmClass($.id(name), 'enabled');
            }
            return $.set(g.MASCOTSTRING, Conf[g.MASCOTSTRING] = []);
          });
          $.on($('#selectAll', batchmascots), 'click', function() {
            for (name in Mascots) {
              mascot = Mascots[name];
              if (!(Conf["Hidden Categories"].contains(mascot.category) || Conf[g.MASCOTSTRING].contains(name) || Conf["Deleted Mascots"].contains(name))) {
                $.addClass($.id(name), 'enabled');
                Conf[g.MASCOTSTRING].push(name);
              }
            }
            return $.set(g.MASCOTSTRING, Conf[g.MASCOTSTRING]);
          });
          $.on($('#createNew', batchmascots), 'click', function() {
            MascotTools.dialog();
            return Options.close();
          });
          $.on($("#importMascot", batchmascots), 'click', function() {
            return this.nextSibling.click();
          });
          $.on($("#importMascotButton", batchmascots), 'change', function(evt) {
            return MascotTools.importMascot(evt);
          });
          $.on($('#undelete', batchmascots), 'click', function() {
            if (!(Conf["Deleted Mascots"].length > 0)) {
              alert("No mascots have been deleted.");
              return;
            }
            $.rm($.id("mascotContainer"));
            return Options.mascotTab.dialog(Options.el, 'undelete');
          });
        } else {
          ul = $.el("ul", {
            className: "mascots",
            id: category
          });
          for (_k = 0, _len2 = keys.length; _k < _len2; _k++) {
            name = keys[_k];
            if (Conf["Deleted Mascots"].contains(name)) {
              mascot = Mascots[name];
              li = $.el('li', {
                className: 'mascot',
                id: name,
                innerHTML: "<div class='mascotname'>" + (name.replace(/_/g, " ")) + "</span><div class='container " + mascot.category + "'><img class=mascotimg src='" + (Array.isArray(mascot.image) ? (Style.lightTheme ? mascot.image[1] : mascot.image[0]) : mascot.image) + "'></div>"
              });
              $.on(li, 'click', function() {
                if (confirm("Are you sure you want to undelete \"" + this.id + "\"?")) {
                  Conf["Deleted Mascots"].remove(this.id);
                  $.set("Deleted Mascots", Conf["Deleted Mascots"]);
                  return $.rm(this);
                }
              });
              $.add(ul, li);
            }
          }
          $.add(suboptions, ul);
          batchmascots = $.el('div', {
            id: "mascots_batch",
            innerHTML: "<a href=\"javascript:;\" id=\"return\">Return</a>"
          });
          $.on($('#return', batchmascots), 'click', function() {
            $.rm($.id("mascotContainer"));
            return Options.mascotTab.dialog();
          });
        }
        $.add(parentdiv, [suboptions, batchmascots, mascotHide]);
        Style.rice(parentdiv);
        $.add($('#mascot_tab + div', dialog), parentdiv);
        return Options.indicators(dialog);
      },
      toggle: function() {
        var i, name, setting, type, _i, _len, _ref;
        if (this.checked) {
          $.id(this.name).hidden = true;
          Conf["Hidden Categories"].push(this.name);
          _ref = ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            type = _ref[_i];
            i = (setting = Conf[type]).length;
            while (i--) {
              name = setting[i];
              if (Mascot[name].category !== this.name) {
                continue;
              }
              setting.remove(name);
              if (type !== g.MASCOTSTRING) {
                continue;
              }
              $.rmClass($.id(name), 'enabled');
            }
            $.set(type, setting);
          }
        } else {
          $.id(this.name).hidden = false;
          Conf["Hidden Categories"].remove(this.name);
        }
        return $.set("Hidden Categories", Conf["Hidden Categories"]);
      }
    },
    customNavigation: {
      dialog: function(dialog) {
        var addLink, div, index, input, item, itemIndex, li, link, navOptions, removeLink, ul, _ref;
        div = $("#customNavigation", dialog);
        ul = $.el("ul");
        ul.innerHTML = "Custom Navigation";
        li = $.el("li", {
          className: "delimiter",
          textContent: "delimiter: "
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
        li = $.el("li", {
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
          li = $.el("li");
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
            $.add(li, input);
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
        li = $.el("li", {
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
        $.rm($("#customNavigation > ul", d.body));
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
      $.rm($.id('options'));
      $.rm($.id('overlay'));
      return delete Options.el;
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
      el = this.nextSibling.nextSibling;
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
    selectTheme: function() {
      var currentTheme;
      if (currentTheme = $.id(Conf['theme'])) {
        $.rmClass(currentTheme, 'selectedtheme');
      }
      if (Conf["NSFW/SFW Themes"]) {
        $.set("theme_" + g.TYPE, this.id);
      } else {
        $.set("theme", this.id);
      }
      Conf['theme'] = this.id;
      $.addClass(this, 'selectedtheme');
      return Style.addStyle();
    },
    mouseover: function(e) {
      var mouseover;
      if (mouseover = $.id('mouseover')) {
        if (mouseover === UI.el) {
          delete UI.el;
        }
        $.rm(mouseover);
      }
      UI.el = mouseover = this.nextSibling.cloneNode(true);
      mouseover.id = 'mouseover';
      mouseover.className = 'dialog';
      mouseover.style.display = '';
      $.on(this, 'mousemove', Options.hover);
      $.on(this, 'mouseout', Options.mouseout);
      $.add(d.body, mouseover);
    },
    hover: function(e) {
      return UI.hover(e, "menu");
    },
    mouseout: function(e) {
      UI.hoverend();
      return $.off(this, 'mousemove', Options.hover);
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
        id: 'toggleCatalog',
        innerHTML: '[<a href=javascript:;></a>]'
      });
      $.on((a = el.firstElementChild), 'click', this.toggle);
      $.add($.id('boardNavDesktop'), el);
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
          a.textContent = a.textContent.replace('+', '�~ Loading...');
          $.cache(url, function() {
            return ExpandThread.parse(this, thread, a);
          });
          break;
        case 'X':
          a.textContent = a.textContent.replace('�~ Loading...', '+');
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
      var backlink, id, link, node, nodes, post, posts, replies, reply, spoilerRange, status, threadID, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
      if ((status = req.status) !== 200) {
        a.textContent = "" + status + " " + req.statusText;
        $.off(a, 'click', ExpandThread.cb.toggle);
        return;
      }
      a.textContent = a.textContent.replace('�~ Loading...', '-');
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
      posts = [];
      for (_l = 0, _len3 = nodes.length; _l < _len3; _l++) {
        node = nodes[_l];
        posts.push(Main.preParse(node));
      }
      Main.node(posts);
      return $.after(a, nodes);
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
      keys[_conf.openQR] = function(thread) {
        return Keybinds.qr(thread, true);
      };
      keys[_conf.openEmptyQR] = function(thread) {
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
      keys[_conf.hideQR] = function() {
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
      keys[_conf.spoiler] = function() {
        if (!(($('[name=spoiler]')) && nodeName === 'textarea')) {
          return;
        }
        return Keybinds.tags('spoiler', target);
      };
      keys[_conf.math] = function() {
        if (!(g.BOARD === (!!$('script[src^="//boards.4chan.org/jsMath/"]', d.head)) && nodeName === 'textarea')) {
          return;
        }
        return Keybinds.tags('math', target);
      };
      keys[_conf.eqn] = function() {
        if (!(g.BOARD === (!!$('script[src^="//boards.4chan.org/jsMath/"]', d.head)) && nodeName === 'textarea')) {
          return;
        }
        return Keybinds.tags('eqn', target);
      };
      keys[_conf.code] = function() {
        if (!(g.BOARD === Main.hasCodeTags && nodeName === 'textarea')) {
          return;
        }
        return Keybinds.tags('code', target);
      };
      keys[_conf.sageru] = function() {
        $("[name=email]", QR.el).value = "sage";
        return QR.selected.email = "sage";
      };
      keys[_conf.watch] = function(thread) {
        return Watcher.toggle(thread);
      };
      keys[_conf.update] = function() {
        return Updater.update();
      };
      keys[_conf.unreadCountTo0] = function() {
        Unread.replies = [];
        return Unread.update(true);
      };
      keys[_conf.expandImage] = function(thread) {
        return Keybinds.img(thread);
      };
      keys[_conf.expandAllImages] = function(thread) {
        return Keybinds.img(thread, true);
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
      keys[_conf.expandThread] = function(thread) {
        return ExpandThread.toggle(thread);
      };
      keys[_conf.openThread] = function(thread) {
        return Keybinds.open(thread);
      };
      keys[_conf.openThreadTab] = function(thread) {
        return Keybinds.open(thread, true);
      };
      keys[_conf.nextReply] = function(thread) {
        return Keybinds.hl(+1, thread);
      };
      keys[_conf.previousReply] = function(thread) {
        return Keybinds.hl(-1, thread);
      };
      keys[_conf.hide] = function(thread) {
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
      bind(thread);
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
        boards: ['a', 'co', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'wsg', 'dev', 'foolz'],
        type: 'foolfuuka'
      },
      'NSFWFoolz': {
        base: '//nsfw.foolz.us',
        boards: ['u', 'kuku'],
        type: 'foolfuuka'
      },
      'TheDarkCave': {
        base: 'http://archive.thedarkcave.org',
        boards: ['c', 'int', 'po'],
        type: 'foolfuuka'
      },
      'Warosu': {
        base: '//fuuka.warosu.org',
        boards: ['cgl', 'ck', 'jp', 'lit', 'q', 'tg'],
        type: 'fuuka'
      },
      'RebeccaBlackTech': {
        base: '//rbt.asia',
        boards: ['cgl', 'g', 'mu', 'w'],
        type: 'fuuka_mail'
      },
      'InstallGentoo': {
        base: '//archive.installgentoo.net',
        boards: ['diy', 'g', 'sci'],
        type: 'fuuka'
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
      return base + "/" + board + "/" + (threadID ? "thread/" + threadID : "post/" + postID) + (threadID && postID ? "#" + (archiver === 'foolfuuka' ? 'p' : '') + postID : "");
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
      var boards, filter, hl, key, op, regexp, stub, top, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
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
            } catch (err) {
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
      side.className = 'hide_reply_button';
      side.innerHTML = '<a href="javascript:;"><span>[<span></span>]</span></a>';
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
        $.rmClass(root, 'hidden');
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
    hide: function(root, show_stub) {
      var a, el, menuButton, side, stub;
      if (show_stub == null) {
        show_stub = Conf['Show Stubs'];
      }
      side = $('.hide_reply_button', root) || $('.sideArrows', root);
      $.addClass(side.parentNode, 'hidden');
      if (side.hidden) {
        return;
      }
      side.hidden = true;
      el = side.nextElementSibling;
      el.hidden = true;
      $.addClass(root, 'hidden');
      if (!show_stub) {
        return;
      }
      stub = $.el('div', {
        className: 'stub',
        innerHTML: '<a href="javascript:;"><span>[ + ]</span> </a>'
      });
      a = stub.firstChild;
      $.on(a, 'click', function() {
        var button, id;
        return ReplyHiding.toggle(button = this.parentNode, root = button.parentNode, id = root.id.slice(2));
      });
      $.add(a, $.tn(Conf['Anonymize'] ? 'Anonymous' : $('.desktop > .nameBlock', el).textContent));
      if (Conf['Menu']) {
        menuButton = Menu.a.cloneNode(true);
        $.on(menuButton, 'click', Menu.toggle);
        $.add(stub, [$.tn(' '), menuButton]);
      }
      return $.prepend(root, stub);
    },
    show: function(root) {
      var stub;
      if (stub = $('.stub', root)) {
        $.rm(stub);
      }
      ($('.hide_reply_button', root) || $('.sideArrows', root)).hidden = false;
      $('.post', root).hidden = false;
      return $.rmClass(root, 'hidden');
    }
  };

  StrikethroughQuotes = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var el, quote, show_stub, _i, _len, _ref;
      if (post.isInlined) {
        return;
      }
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!(quote.hash && (el = $.id(quote.hash.slice(1))) && quote.hostname === 'boards.4chan.org' && !/catalog$/.test(quote.pathname) && el.hidden)) {
          continue;
        }
        $.addClass(quote, 'filtered');
        if (Conf['Recursive Filtering'] && post.ID !== post.threadID) {
          show_stub = !!$.x('preceding-sibling::div[contains(@class,"stub")]', el);
          ReplyHiding.hide(post.root, show_stub);
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
          innerHTML: '<span>[<span></span>]</span>',
          href: 'javascript:;'
        });
        $.on(a, 'click', function() {
          return ThreadHiding.toggle(this.parentElement);
        });
        $.prepend(thread, a);
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
    hide: function(thread, show_stub) {
      var menuButton, num, opInfo, span, stub, text;
      if (show_stub == null) {
        show_stub = Conf['Show Stubs'];
      }
      if (!show_stub) {
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
      el = $.el('a', {
        href: 'javascript:;',
        id: 'fappeTyme',
        title: 'Fappe Tyme'
      });
      $.on(el, 'click', FappeTyme.toggle);
      $.add($.id('navtopright'), el);
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      if (post.img) {
        return;
      }
      if (post.isInlined) {
        return post.el.parentElement.classList.remove("noFile");
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
        innerHTML: "<div id=imgContainer><select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label><input type=checkbox id=imageExpand></label></div>"
      });
      imageType = $.get('imageType', 'full');
      select = $('select', controls);
      select.value = imageType;
      ImageExpand.cb.typeChange.call(select);
      $.on(select, 'change', $.cb.value);
      $.on(select, 'change', ImageExpand.cb.typeChange);
      $.on($('input', controls), 'click', ImageExpand.cb.all);
      Style.rice(controls);
      return $.prepend($.id('delform'), controls);
    },
    resize: function() {
      return ImageExpand.style.textContent = ".fitheight img[data-md5] + img {max-height:" + d.documentElement.clientHeight + "px;}";
    }
  };

  ImageHover = {
    init: function() {
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
        $.after(first, controls);
      } else {
        $.before(first, controls);
      }
      return Style.rice(controls);
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
        nodes = [];
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
            _ref = cypher.childNodes;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              child = _ref[_j];
              nodes.push(child);
            }
          }
          cypher.innerHTML = (link.indexOf(':') < 0 ? (link.indexOf('@') > 0 ? 'mailto:' + link : 'http://' + link) : link).replace(/<(wbr|s|\/s)>/g, '');
          a = $.el('a', {
            innerHTML: link,
            className: 'linkify',
            rel: 'nofollow noreferrer',
            target: 'blank',
            href: cypher.textContent
          });
          nodes = nodes.concat(Linkify.embedder(a));
          data = data.slice(index + link.length);
        }
        if (data) {
          cypher.innerHTML = data;
          _ref1 = cypher.childNodes;
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            child = _ref1[_k];
            nodes.push(child);
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
      }
    },
    embedder: function(a) {
      var callbacks, embed, key, match, service, title, titles, type, _ref;
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
          className: 'embed',
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
            } catch (err) {
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
        innerHTML: '[<span></span>]'
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
      this.unreadDead = this.unreadSFW = this.unreadNSFW = Icons.header.png;
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
      var posts, quote, _i, _len, _ref;
      posts = MarkOwn.posts;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.hash && posts[quote.hash.slice(2)]) {
          $.addClass(quote, 'ownpost');
        }
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
      if (Conf['Thread Updater'] && (move = Updater.count.parentElement)) {
        container = $.el('span');
        $.add(container, $.tn('['));
        $.add(container, ThreadStats.postcount);
        $.add(container, $.tn(' / '));
        $.add(container, ThreadStats.imagecount);
        $.add(container, $.tn('] '));
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
      $.on(window, 'scroll focus', Unread.scroll);
      return Main.callbacks.push(this.node);
    },
    replies: [],
    foresee: [],
    post: function(e) {
      return Unread.foresee.push(e.detail.postID);
    },
    node: function(post) {
      var count, el, index;
      if ((index = Unread.foresee.indexOf(post.ID)) !== -1) {
        Unread.foresee.splice(index, 1);
        return;
      }
      el = post.el;
      if (el.hidden || /\bop\b/.test(post["class"]) || post.isInlined) {
        return;
      }
      count = Unread.replies.push(el);
      return Unread.update(count === 1);
    },
    scroll: function() {
      var bottom, height, i, reply, _i, _len, _ref;
      if ($.hidden()) {
        return;
      }
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
      Style.rice(dialog);
      $.add(d.body, dialog);
      $.on(d, 'QRPostSuccessful', this.cb.post);
      return $.on(d, 'visibilitychange ovisibilitychange mozvisibilitychange webkitvisibilitychange', this.cb.visibility);
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
        var check;
        if (!(status === 404 || Updater.save.contains(Updater.postID) || Updater.checkPostCount >= 10)) {
          check = function(delay) {
            return setTimeout(Updater.update, delay);
          };
          return check(++Updater.checkPostCount * 500);
        }
        Updater.save = [];
        Updater.checkPostCount = 0;
        return delete Updater.postID;
      },
      visibility: function() {
        if ($.hidden()) {
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
          return !$.hidden();
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
        var count, id, lastPost, node, nodes, post, scroll, spoilerRange, _i, _len;
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
              Updater.save.push(post.no);
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
          if (Conf['Beep'] && $.hidden() && (Unread.replies.length === 0)) {
            Updater.audio.play();
          }
          Updater.unsuccessfulFetchCount = 0;
        } else {
          Updater.unsuccessfulFetchCount++;
          return;
        }
        scroll = Conf['Scrolling'] && Updater.scrollBG() && lastPost.getBoundingClientRect().bottom - d.documentElement.clientHeight < 25;
        posts = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          posts.push(Main.preParse(node));
        }
        Main.node(posts);
        $.add(Updater.thread, nodes.reverse());
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
      if ($.hidden()) {
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
      Main.callbacks.push(this.node);
      return setTimeout(this.asyncInit);
    },
    asyncInit: function() {
      var link;
      if (!Conf['Persistent QR']) {
        link = $.el('a', {
          innerHTML: "Open Post Form",
          id: "showQR",
          href: "javascript:;"
        });
        $.on(link, 'click', function() {
          QR.open();
          if (!g.REPLY) {
            QR.threadSelector.value = g.BOARD !== 'f' ? '9999' : 'new';
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
      return QR.autohide.checked && QR.hide() || QR.unhide();
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
      if ($.hidden()) {
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
      QR.fileEl.value = null;
      return QR.riceFile.innerHTML = QR.defaultMessage;
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
  <label><input type=checkbox id=autohide title=Auto-hide> Post Form</label>\
  <span> <a class=close title=Close>×</a> </span>\
</div>\
<form>\
  <div class=warning></div>\
  <div class=userInfo><input id=dump type=button title="Dump list" value=+ class=field><input name=name title=Name placeholder=Name class=field><input name=email title=E-mail placeholder=E-mail class=field><input name=sub title=Subject placeholder=Subject class=field></div>\
  <div id=replies><div><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>\
  <div class=textarea><textarea name=com title=Comment placeholder=Comment class=field></textarea><span id=charCount></span><div style=clear:both></div></div>\
  <div id=buttons><input type=file multiple size=16><div id=file class=field></div><input type=submit></div>\
  <div id=threadselect></div>\
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image?</label>\
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
      QR.riceFile = $("#file", QR.el);
      i = 0;
      size = QR.fileEl.max;
      while (i++ < 2) {
        size /= 1024;
      }
      QR.riceFile.innerHTML = QR.defaultMessage = "<span class='placeholder'>Browse...</span>";
      QR.riceFile.title = "Max: " + size + "MB, Shift+Click to Clear.";
      $.on(QR.riceFile, 'click', function(e) {
        if (e.shiftKey) {
          return QR.selected.rmFile() || e.preventDefault();
        } else {
          return QR.fileEl.click();
        }
      });
      $.on(QR.fileEl, 'change', $.on(QR.fileEl, 'change', function() {
        QR.riceFile.textContent = QR.fileEl.value;
        return QR.fileInput.call(this);
      }));
      $.on(QR.fileEl, 'click', function(e) {
        if (e.shiftKey) {
          return QR.selected.rmFile() || e.preventDefault();
        }
      });
      Style.rice(QR.el);
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
        err = $.el('span');
        if (ban.textContent.toLowerCase() === 'banned') {
          if (Conf['Check for Bans']) {
            $["delete"]('lastBanCheck');
            BanChecker.init();
          }
          err.innerHTML = "You are banned on " + board + "! ;_;<br>\nClick <a href=//www.4chan.org/banned target=_blank>here</a> to see the reason.";
        } else {
          err.innerHTML = "You were issued a warning on " + board + " as " + ($('.nameBlock', doc).innerHTML) + ".<br>\nReason: " + ($('.reason', doc).innerHTML);
        }
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
      var a, container, el, link, nodes, qid, quote, quotes, _i, _len, _ref, _ref1;
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
        if (a.hash && MarkOwn.posts[a.hash.slice(2)]) {
          $.addClass(a, 'ownpost');
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
          container = $.el('span', {
            className: 'container',
            id: "blc" + qid
          });
          $.add(el, container);
        }
        $.add(container, nodes);
        if (!(Conf["Backlinks Position"] === "default" || /\bop\b/.test(el.parentNode.className))) {
          el.parentNode.style.paddingBottom = "" + container.offsetHeight + "px";
        }
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
    cb: function(node) {
      var callback, _i, _len, _ref;
      node.isInlined = true;
      _ref = Main.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback(node);
      }
    },
    cb2: function(node) {
      var callback, _i, _len, _ref;
      node.isInlined = true;
      _ref = QuoteInline.callbacks;
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
      if (Conf['Quote Hash Navigation'] && !isBacklink) {
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
      Get.post(board, threadID, postID, qp, function() {
        var bq, img, post, _conf;
        _conf = Conf;
        bq = $('blockquote', qp);
        Main.prettify(bq);
        post = {
          el: qp,
          blockquote: bq,
          isArchived: qp.className.contains('archivedPost')
        };
        if (img = $('img[data-md5]', qp)) {
          post.fileInfo = img.parentNode.previousElementSibling;
          post.img = img;
        }
        return QuotePreview.callback(post);
      });
      $.on(this, 'mousemove', UI.hover);
      $.on(this, 'mouseout click', QuotePreview.mouseout);
      _conf = Conf;
      if (_conf['Fappe Tyme']) {
        $.rmClass(qp.firstElementChild, 'noFile');
      }
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

  Emoji = {
    pony: [['Pinkie', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3dJREFUGBlNwUtoXFUcB+Df/zzuY553pp2MmUwSk5TGpnamiokWRdNCSkCrUChKCnVZQUEUdy5sQZC6cyd2VWgoutCFXWTjIyp1UdqmEDBRsSZNmkmaZF6Zx32ccyzowu8j/M883pH5A9kBYfNkFOpu0OiulyqXmnhkDmdYHYJexzX1Ef51EQDhP9fxpjU0PDCd7IldYIxGVag3/KZ/ZX1p8/P0k/0U47qs291M2NS3f6ncuLeFeQ3A8KuYoNPoY/3e2Ej6scSnqUJ8gksmhC2y3OJHpSUHU0/3HU+WCuddyV6VSpVyYv/aUuPefWAP4iDG8AhJWyYYo972tg8DQ1wyWHGZSfcmZmQ+YeKTw1bQ70H8uJw3xtDp6NzG15VLf/DLWMBZHGPkwuWGyq7njLoZyzAiCtqRIddioifBxYBHIpeE0oaw0yoG7WA755dvi8Xih66BOSZj4rwds45bSQkuOeOCQYWG2PjjcEq94JwjQgQ+kCW+tBl3H7Ym4jnbE/nDmamwqz9mnEaYoBgiZaJIGW5zEIHEPheykMD2w12ztPIXCrZHec+GdOVAUI8ygjvifeHQESiNoKtMlIoRxSV0owMjAeY5+P3BKrbTDq3n02B/7yDTDkBANSXiewKgjFbahEwQe34IiVIfRNqCv1qDanQR9Di4+tU16N409o2WMXnyJeNWb9PO4s6WroZawOiSiozCoR7lPFUQezICCzXF+pPGYRna6/rotNqY/eJLUzh4mM5dP4Va0YXV45x0O9F9FhkN5auq4eznaq3WmP1pDkuibW5uraNaqyNh23ihPA6v7wAVS+PwXAGkbYiUnU3kYm8JzvgGpJGdG6vzm15+ce6H79/9bnnBhCxG702dwnTaw4nyM/jsiTHsHx+DEyjKWnGEUpBOyjTTgbpsNHyLojPe7PK3qci58NvNu0Gl0YA8NIxWp4MkdzCdK2Ci6iNYXIV6UEfUDBC2Q/A3WqVbUUfVucWftYhP9fLiFf7yRPGVmZmhE88dJVmpGRMqRH4E3emSbnQR3lkzaqNB3br/J39tb1ibJglGfJDZbMReb37Td/bFhcnB/iNppXNUbZEKFGBJ6FBT+9cVo5c3yd/trDV3OxdFDDHFOV8IffVJtNNOC+J3xtYqATWw0Mm6RIJ9YAy9rdtt07q1ZtjdVXCYFRBG4Bv8A+lliGhzN164AAAAAElFTkSuQmCC'], ['Applejack', 'A4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAv9JREFUOE9dkmtIU2EYx88Roi9FfahkfQmS6kNGEBRlZWSY5tylTKepqR8MHYGl2R1POm2u5bCVlzbog2Ze591pzZPZxUskDZLMMLSWzcIca3MXt7N/55woqhf+PC8Pz+99n+fPQxAEQf6vhINb1nG5/ISdobWXo+9eSd4tyM7OJimKImmaJhsaGjjmX/DGqfDQmkvRg1x+9YrlZPd18fdupXiu6mxkOAcqlUqyuLiYB/+cayfD1rKFH0w3pYEHV4/omhTCyieVcYEB7TEYSyX21Mita/6u/91qUBMV00JrjmKwMg4zI2fgnlfD90PLx+nhMyinIrb91SFBFqaHBevPHb7G/fS06jhs0wXwO8rBOLXws2Kct/k4//HKRE+jZD0Pl2buD2FnmOlVSUFrpJg15/JFgcWKP0Bg8Q6fs1sVs+11wmAebKaEuiG1CC81Yozci+cL4KoC3JUIuCp4+R23+Ee4Dr5bisZmJi7fJzpLRJZPOin8vSlwdSXDO54Hz+vT8LzLh3uuCIuzBfDa1DzMPcrJMVfkIHpVEu94uYgH/aaTvOxdJzDZkI76smhY2mVwDmfg8zM5RukcvH8pbx96mLiPMBTG0nSpGK7mePg6k+DsSUZbSQwem02oba3DRsFKzNQfx9sHSdi1dzve5Ow4xM+ozorY1K2U2MY0IrhbEuB7lIqB6gxY7B9R3XoHAoEAivN74O5LAaXNwvNLe9PlcjlJACANRaIRztFh1iRvfRyYx5kIOCwY+GCE9GIUOjrzwZjS4H16FV80UT1WqzWIWFhYIBsLhDf7y46Ck1UvATNKgXlxHgHbJDyub2DGVPC2s+bVyGDTx74ym80kwe2fKvNASN8NySK3NeayWNagNPj7WaP62Uhn8HdPkwyWW3IoEjdv0Ol0JGE0GvmV0+dFpj9SS5kOKuahr01Wwbb2lXV6aakjkfF1p8DXlwHnaB5yTm1bbzAYfs34e/+0pyNic+N2ruIWmQWXcdE1dUEGd9UYq6kle1mXqVW6imWIn290AGVZutJTAAAAAElFTkSuQmCC'], ['Fluttershy', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA2xJREFUOE9dU91PWmcYP2uybDfrxdIlu9vN/oglverWNN3Fmu1iN7vY2q4utnE2Nu26ukyrUUGwExGpn3xY+TyACjrskFrcEYoWnCAM4YAgcJjROkFA1q789nJczNaTPHnfk+f5/d7n4/dQ1Cvf3Ut3Xp//Qnze36gYCt56kIgJpyqRFvrvcIvxMNxhSa9eV993XJK/+yqO/zdf7j7tbRz1RdstLzOKReRoLxJSOzb7HyKtdCEumgErmEbwO03U2aR8738kzq8ln8e6bXlWYMWmZA6Z8SUk5U5ytyPeY0Oy1w5O50FO+wQ5jbtG4lK19L5BGehzb9sE19+JtFt2c8ZlJPvmwAqtSA06EWs3g+2aQnacwdbwAmLknuiZxaZ4FiTD6tLFvi+pBeenb/3mvvo4Yu3D5v1ZsP1axHpUiAo0iPyg41/dGiNgiQI5PXmdXkai92dkVItYbZ6YpVZWLrrKFSOynBip9W6U/7LwViqZ8SykRWpcR8BqJNlmJCZp1LLMkIxSAw6s39WHqUCo/mDnWTdKhwRUMaNMzvLh5NFZsaBIbD+rJ34jgsxtcLQH3IQbKakDoVZDmnpk+irA/fEjCkXlv+AawX+MEJQJcaFEY8bWAJdMgYxyESn5PILNumUqJNVVA4EG7OXlx8Bf3T2QyRuh0X2P5ad9pCQTcjtqDI3UwTMuReIeaaKagb9u6B6VVi9Wg1YRUhkhH1g6NKFf3gD/2gAYz08YVd5AdltDfDS2d2QIrH6DcNcwUjLHc+aC8AMqLrW/4EwesBoligUTCgc05h52IH9gwu6+ERwBb+9pkc0IwLJNWHPXIyrUIdysW2POd52gopIZjtOSpgzOI2NToVAmwD0D9osmvvZSxcCXtr5wA08627Ah0yHZ74D3ysBNXokR8XQ8q2SQM3gQbZtAPm1AiZRyNIUawZGFl5qIRqbBdk4Sndjy1iviIymzIquXldirWRXDzzdOZr63q8J66OqOf+2yL8be+nMr3fry91A9NlRjvKT9tx88Pt6Djdaps0RZxQRZmCzpbHrMBV9b5/YM/dn7tSCT/cNTvpauFdasR5xkkCaS9n07Kj0mIKm+GbujP5OQ/vI8Ofyomhx0sOmxhU9W6wYp5uOO12qB3guik2TuI2QPXmwpXLGnjSMf3RRdO1Hz/QNneMt7Iqmg5QAAAABJRU5ErkJggg=='], ['Twilight', 'BIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA6lJREFUOE+VlF9Mk1cYxj+Kc3+yXWimFxuk2zTIn4bQFkppF0hDNmBpBtgKixhhQZAhbSkFBp1uZWg3ZLRMxFKE0qKtrMy2E2ztn2+1tLQgbuJiorvQ7c5pgplZNjfmePZ9nwtZMm52kufqvOeX5zznfQ9B/M9l/8CXPP2R/6ajy+u0amZeoI8D2PpfTLqMlZQpT9vE2fPOc9l73302q7rs6Sz5K6zM3ZuJzD2EVf1VytejC4hNXoWj2/vlF71+FgVKIsZVHrbnEzLoPkYOqqtPNm7j1l1J4R9Y4wgVkOR3Qcvrg+uNXmTnt9zfmdcUFRd1XqQhC+eWMXP8MiwKdyUDOqMLEG49qYtYlhA+vQi7zocGmQHFYi2UnM9wq/RzNEsOQyDWMBIWtjNurjivw2ucg+toyM+A6LWZU72vvsqwFjwVZwrmrEvoq7DBLDDiltQAobidgeRRUipMTA0t32AU3hNzD7zGSANBZMi2UFe5nyZohrREB9dxEnMTS+jgnUBYMghv2afrbhhHb3aAnFxkQMHhOALDid8p0EHiKU6VklvQil0UiJakqBsf77dCmTmASPEAhoqPIEN4CGmCJvAkauzKfw/5pRr4J+JUTtfo693zGSM7iBdzan10sE9gh5AragNXoEKtvB+93ZMY0TthGraB92oJVlYewDTgQJ96DKTtiStXb8jvNoafIV7i19+lndC2X+bXPyqXffj4kmV+PYexY1aQMwnkv1YGWUUljryvQ0/dqfV9+Vs9zVTYLILKZ5UGsXMbb2/llJaWCN8OnzNMrxda9JNYjt+ENL0RrQol0nekQVtlRHA8gsWpZQhEmrviws5yIpXfcG87t+52UpY8NZXN3lIjPRiOReZxfugCA7s4EsCN727ArHChQiKDYGchRrumELbFEbQmkFvQ+ofg9TYX8Xx2zfnkLDmHbgM2m00M1tortQf06FC2Y2HqGgMjvSR+WfkVplYPzCoX3EOziDmuwjMSRk6BajVP1PYT/fzb/j0nZ7tmN+n3mUlpUTmCo1EGFHJE8NvDR/g+egd0fj5LDN6xKHo6bOAL1D/niTTRDUd2rMW13VBj/zFu/5YZBaYBp69j0blMPfs8zhj9KCjspPNZ+6fjd28IGld4MgIn5x/HJr9ByJRYDz5oS2B6KIT9Nf3IEaj+pCBrXFELOTERZm0Ichy+lHy2czZlpv+y80JfmILFVwPDsTvmo26SJ1I9zBU1/UVBfqAk35ujpb+RpL8BJjxIUjyXvSgAAAAASUVORK5CYII='], ['Rainbow', 'A8AAAAQCAYAAADJViUEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3tJREFUGBk9wV9MG3UAB/Dv7+531971aKGMlr+OwjoGBUZwRDrRBJwj0bHEmeiS6Xwyxn8x8UVNzHAPPvliFhMzsy0m8uDD5h/QZWoUNxYMBoZbZCBjZTBoKRwtLde7cv9+bg/6+ZDnzk6C44lw6f6whdOnETpzla+0803RMD3ZGSH95V62lzGQtMH9M7MhfpPUyIX5HE1uvNXDaCQgtykB70cR/4unrn3aqzYkZt7v18ZfezyTkfy0HlJ7FMWKEBJFpYMSVq7bngMlGvvc/OTiLzRYLp8K1waObaS16MDIRfupG9c6SuwCsSt2kJ+/B+3HMdC6MBofa0N1a2sVJTWj02mh4BFCCpV84jN4oHyX3KYEJAi2BWYR2CkPmMlBiOgwE0mYiymo1Qu0Mx4/8VLVnrtnF4VxfuCN9z5mDBA9FJt7mzDe3oXkjou69CqoxkA4gC9xQAggankMa7uTm3m32SLKD+Sz6XXGGCDJAv6j7di4MzqBo199Adk2EIqkQGQHDy3Ij2Q+bHr9g3UxyFHLdFyvJHAg+J/ipYgdjuMyzwELCfRsTWG/NQEwhqCVC0YLy/qKGJzmD77w9pHSoFyjbWWxtjAH5jIIHi8EKkCpq8JteCD2H0F2u4BwZhE+x8BEWbt6i6df8kr/s0+H/HKMc1yo02MYaG9APjGLxJ+T2NxYRV7fxu66GqjwYyrn2AG7YFGw4FygeYiXjva/KoipxoaKGPY1N+PJfRHEauvQaIj47vsLSN67i87ew6hOLGFeTS38FO45XhR8lQlffS0tmGViwbmCdKEb3tJSGLYLieMwMfQr1tZSqOzqheCVkDWIk7i/vvJ7WdVVxd96XWBU4kzb55qOiZvqJazmCxhLGzBFiqbnuzD71xyij8bxEN/XzXccf7PyxJ6+lkxuwknnftP4vorBd9O1mXBAnsbfaQW6VQadcWC7gmiIH0JlrBWuw+DYgFyiSGqu+O2NjZllPMBJRUevuH4Ipu1DyOefrS6RzmQN211iFGUtzSAcD8dh2Ll8cyStai8vra/8MQhgEADvjx/bX78c6rgT1ddl722/btSelEz69eaWoZqms1kwrGVt27xV1I1zgdWfRw6Ww8lmswQAo6QR2dnM6JC6HT3PEfvctjSsnx+3J1uob6qt6gAtSgEu4BbdV2KO80T3O0QQBFiWRQRBwL/txI3OlzkSKwAAAABJRU5ErkJggg=='], ['Rarity', 'BMAAAAQCAYAAAD0xERiAAAEEElEQVR4Xm2SW2xURRyHfzPnsmcvlO4ulN1uF2sLrIpdJNS0KUZFUq1t0AiKkpASbyQSjRKENEGrPuCTiUoTjSENKAnFYKokbZOmIBaoTRXB1AjbWmrabmVpt3SvZ899PFnTxAe+ZF7+D998mf/gbmwt30131B58YM+WTw7vbTnW/+oTHZda6490723uPP1KY0fna40dh/Y0fFz/4pq3XRFEsATB/2i71EauvDcplHN173p8of2gnI8KPHLxm/AEqwgIARUEeywyS1dVPZ+9kJ6OHdB/uzF2BmcYXRIdHxkhO/0vR/e9+c4p7+pIO+92+wlHaGE+QV1lYWpLCe90kdKVTvJo80rqDTic4nJfk7c62kM3rltfgQpSLGOM4ZfR0apQIPQTpSR04uhVqhUYSkoItLyMVFaEIjNENpTg8ZbVyGYK6PpyHIYGBhCmLiYHZ2NDzxZlpwYHaX3V2mMet3sPpZSbjc/B5y+Fw8GDgWEukcbURBLR2jB0TcPpz4cwO5aBBQJuWSnsbC09eeN50tnZSYy0s6p5V+MwIVghSQ4iFwqQHBIIIcVjGEaxXtd1XO2P4dr3N6EqCvJyFoqmgvqDlqZqp+jxD4/z8etKGxjxm6ZJxmIxnB8YwNDQEGITE5iemQHHcRAEATYIVPvB8ZQRQu05D45QGPNx2PYNNFxWV21y/h0AiCiKkGUZcwsZnDjTg7cOtuOr098hYxLYQJIklK8ps5hoaAyM2ZeAFwRQEJi5FEclT/BpxZBKFhdkQimFx+NBTbQG+1pfQFZ34tZtFd29PTAtC+N2dU9vH/t18sKCwPP4r46DQ3QySzcGKBGERzRFpYl4CkubPdd3Fj1nu5GduAxvdQNIPgNV1zBw/hy6+y+D510xUZQYzwlM5CXT5iID+5RailLNDINN/ZUCoQTLlnkQj8dx8uRJW2DA7V2F6H0RGJoGt8vFgqF7c2vD0T4wMANgd0yjP2Mqb+Ty2RkqMrhhmbh+JYnk7TSWl/pwuP0DrIvWoX73EWx/LIIV3lKIgoitT21Dy7aWPzU125/JpbOLukrA8U1ly8uGwxWVz1CXwOvE0qHIGq4NJ4qPHApVoKurC4defw6bKigCwfLiRkMBPzavL39w5/tPChk5vV+ZvzVHUknm4DhB13RKeZ5LlthlzDAQG00jkykU/5VTYKgJiTANE6LkhKIqTNW0nKqpvYauj89PzX5jcqxG0/WmeGK6bj6V+IHPy7nfV/hWbS5kM0gnC5iMLWBjXfhnAA0FRQGz0XVtzmJsZEHOH52a+uPirubtOmw2BfYmg9cSP2YsJ7uIbxlpfaitdk3l/Q/rlv7FnVzucmXdPS+1HtjyD8dzWCIvy76/Z6bY5MTs4tfjn7HBjwZxN/4Fq6rr1ZuF0oUAAAAASUVORK5CYII='], ['Spike', 'A4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAsFJREFUOE+Fk1tM0nEUx/9QPtCD7z30nE9sbbVeXJJR6j8DkVsIhg6HTqSXnBHSMMEbEy+AgPwVQpcgNy+kKLc/lCgF09Wquaab67kHX1pulif+mHRdne3sd3Z2Pt/fOee3H4J8N/ow2lrj4H64OljRfEXBIZ/k/3lWquXIrQl2ROAVA98jOro2XKUtvV9Dpj/iFV/ppwvLVfzThEBZGRWh0S4hmFx+rId2ysmMSU6WAAUeMfDcdYe0gUrGdUOl7rZXBDRdRQtRp1PeIRlVctIzk+lHR6itJnwC1nkbgOXgZlhO3h6RY9rZKYT7W9NUKpUklUqRKjPDQADEjYTz3SLgzQjzMWua/5E5xLpQrqOX/jEzamTc4LqEX/KQRwRMBwfEDgnUOyXAdgk+1zr5e0w7J/vA15OfN28PW5SnZlRuVT3WeMia5oHW1AthawSS40mIjcWhW98HfF89Ifa6qb+hqAA6FA5xzIp/dVncYDc/hkQOiI/jBcctCegwdRJgsERWcszpZTrKU/3S7s+Ff4vn9UG4aWbGyofoaB60d05dDJuiR/8DcXMCpLY24GPsrlRWcxZxKmaqF0aCsDy8ArgtAVFL/Jc2C4LWBEwFNLCUbt9PZrpEiEk2VjbmMYIdm4TQ6Cq4RmYB02CwZAlB2ByBkHEVYhYcEmEreNZl4F+/C8F0+0vE2x1IL3qDsDgZhKg5Bt7ULAgHa+HVzlt4v7MHMQyHpM8LrlQzuNdaIfJCub+R0Z5DfNrAxsJAEHJbhXhue5nQJmS3t2D73S6suVK5XBKiYQMs4B3xSEbZ83xTc3ljq5eMmNts5/3d82/8jicQDc0Cbo8BjiVyQsez4rYkeNRzfqfadUYgEJBRFCVRKBQS0tTUSM7BxaauUelyenwunnZ+SnhXDkKG0EGgb+5g4p5dpa5TFEkk1bmfQSu8/TfTXs+Z8UbptgAAAABJRU5ErkJggg==']],
    not: [['Plan9', 'AwAAAAPCAYAAAGn5h7fAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAzE15J1s7QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACAElEQVQoz3WSz4sSARTHvzMjygpqYg3+KIhkE83DKtKlf0C9SrTRuZNEx0VowU6CuSeJNlwwpEO2kJ6SQBiIUAzFjRDF4wrjKosnGx3HmdehFDfpe/2+z/s++D5gU7IsEwRByICIiAEAIiIAYAFAXsjYVr/fLxMRNVvN+prJ5/OA3+/XERFNf02JyeVyDx0OxyvLNQsnimLKfcf9KRQKXQAAnE6nlf5qMpnQycnbP/kAoKoqsSwLAJhOp+AAwOv1otvtpqxWq73dbt/r9XqvEQ6HUalUEvF4XLd5IpvNZqlerzd5nlf6/f6tTCZjBACk0+nb+XxeW4UrikLJZPImAGA0Gq0NIqJyuSyyANDr9Q5Wu1utFvR6/SULAI1G4+vK8Pv90DTtGwsAJpPpaGUYDAZ0Op3PHAAEg8H3tVqtbrtu21sqyxuRSOQJk0ql9IvF4r7b7f7pcrlejkaj57IsH58Pzp8dvjhc/lsBk0gkbLFYrFqtVvd27+4qOk733ePxPDCbzVBVFfP5fCiK4rvhxfDN/qP9wSasGwwGMv1HiqJQsVg8ZlfTHMepkiR1t05gGJBGmM/nMBqNj9nN9kql0lNN064ARISzH2cQBAGz2ewLu2na7XYLwzBbvxYIBBCNRrFj3BmsAZ/PZ+J5/kOhUIAkSVeA8XiMZqt5efrx9OA3GfcgvyVno9cAAAAASUVORK5CYII='], ['Neko', 'BMAAAARCAMAAAAIRmf1AAACoFBMVEUAAABnUFZoUVddU1T6+PvFwLzn4eFXVlT/+vZpZGCgm5dKU1Cfnpz//flbWljr5uLp5OCalpNZWFb//f3r6+n28ff9+PRaVVH59Pr//vr38vj57/Dp7eyjn5zq8O5aVVJbYV9nVFhjUFRiWFlZVlFgZGOboJzm5uZhamfz9/bt8fDw6+drb26bl5j/8/lkX1z06uldWFS5r61UT0tfWlbDwr3Ew76moqNRTU7Mx8P75OpeY19pWl1XW1qzr6x5eHaLiojv7+1UT0xIU0uzqadVS0nV0MxkZGT5+PPk497///ra29Xq5eFtY2H28e2hnJignJlUUE1dXV2vrqxkY2FkYF/m3d5vZmfDuruhl5aZlJHx8O75+PZWVVP29vT/9fTj3trv6ubh5eRdXFqTkpBOTUtqZmX88/RMQ0T78vPEvr7HwcHDwsDq6ef///3Gx8H++fXEv7tZWVedmZZXXVudnJp0c3FZU1f79fnb1dlXUVVjXWFrZmy8t7359/qLj455e3q4s69vamZjX1zy4+avpaReWFz/+f1NR0vu6Ozp4+f48/lnYmi8ur3Iw7/69fHz7+xbV1SZmJZVUk1ZV1zq5ez++f/c196uqbDn4uj9+P7z7vRVVVXt6ORiXl/OycXHw8CPi4ihoJ5aWF3/+v/k3+axrLOsp67LzMZYU1m2sq9dWF5WUU1WUk/Au7eYlJGqpqObmphYVV749f7p5Or38fPu6OpiXFz38fH79vLz7urv6+hhYF5cWWKal6D//f/Z09Xg29exraqbl5RqaW6kpKTq5uPv7Of/+PDj29D//vP18Ozs5+OloJymoZ1ZVVJZWVlkYF2hnpmblIyspJmVjYKQi4enop5STUlRTUpcWUhqY1BgWT9ZUjhcV1NiXVkkhke3AAAABHRSTlMA5vjapJ+a9wAAAP9JREFUGBk9wA1EAwEAhuHv3dTQAkLiUlJFJWF0QDLFYDRXIMkomBgxNIYxhOk4wwCqQhQjxgxSGIsALFA5BiYbMZHajz1oJlx51sBJpf6Gd3zONcrqm/r1W8ByK0r+XV1LXyOLLnjW6hMGpu0u1IzPSdO17DgrGC6AadrVodGcDQYbhguP6wAvAaC0BRZQalkUQ8UQDz5tAof0XbejOFcV5xiUoCfjj3O/nf0ZbqAMPYmzU18KSDaRQ08qnfw+B2JNdAEQt2O5vctUGjhoIBU4ygPsj2Vh5zYopDK73hsirdkPTwGCbSHpiYFwYVVC/17pCFSBeUmoqwYQuZtWxx+BVEz0LeVKIQAAAABJRU5ErkJggg=='], ['Madotsuki', 'BQAAAAPCAMAAADTRh9nAAAALVBMVEUAAAC3iopWLTtWPkHnvqUcBxx5GCZyAAARERGbdXJrRUyGRUyYbY23coZFGDRFGEYfAAAAAXRSTlMAQObYZgAAAGhJREFUeF5Vy1kOQyEMQ1Fshzd12P9y61AixLX4yJFo1cvVUfT23GaflF0HPLln6bhnZVKCcrIWGqpCUcKYSP3JSIRySKTtULPNwMaD8/NC8tsyqsd1hR+6qeqIDHc3LD0B3KdtV1f2A+LJBBIHSgcEAAAAAElFTkSuQmCC'], ['Sega', 'CwAAAALBAMAAAD2A3K8AAAAMFBMVEUAAACMjpOChImytLmdnqMrKzDIyM55dnkODQ94foQ7PkXm5Olsb3VUUVVhZmw8Sl6klHLxAAAAAXRSTlMAQObYZgAAANFJREFUGJVjYIACRiUlJUUGDHBk4syTkxQwhO3/rQ/4ZYsuymi3YEFUqAhC4LCJZJGIi1uimKKjk3KysbOxsaMnAwNLyqoopaXhttf2it1anrJqke1pr1DlBAZhicLnM5YXZ4RWlIYoezx0zrjYqG6czCDsYRzxIko6Q/qFaKy0690Ij0MxN8K2MIhJXF+hsfxJxuwdpYGVaUU3Mm5bqgKFOZOFit3Vp23J3pgsqLxFUXpLtlD5bgcGBs45794dn6mkOVFQUOjNmXPPz8ysOcAAANw6SHLtrqolAAAAAElFTkSuQmCC'], ['Sakamoto', 'BEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAxVJREFUOE+Nk19IU1EYwK+GQQTVQ39egh6ibKlzw91z7rn3bvfOmddNszl1bjKXc5rJJGmBUr7Yg9qTD0IalFgRBEYg6EDQQB+GovQyQgiaUZsoLcgHMcr069w7MgcGXfi453zn+37fv3MYZt/n99e76tzVj4JN/hP79fvXnV3hnNabwUBjoOHcgTYOu/JQspgTzsqKgn9BfD4vkWTzur287PqLVy+zM+yePB7KsRXLywTjnSpnZctBkPCdW8ccDuU55vBO8RXbkC/oP5ph19V5+7LIky0OY1BKbZEbLcFSt7u6pN7jLmltCVrr3DV5jY3+KovFEsccB1KJNVpefe10BqS2tqqO4/AuphBB4L/LkrRqNgtJs1lMypLls1kU38mytMLz/E8VIlutqVqX6/weZG52OttRXjbE0cP/FYLRlpVjDXuQ/r77x2XZPKkCHA4HBAIBkCQpAygIAvh8Pu2MZgO0Lz+QSa/sQfwN9RfpVN66XC6Ynp6GhYUFGBwczAC1t7fD0tISxONx6O7upgHILmsqvLcHodOggfiV/v5+SCaT4HQ6IRaLgdfr1bIRRREmJyfBZrNBNBqF+fl5sNsdgE2GiAbp6bmbdbXC7qWQbxMTE7C2tgY6nQ5SqRSEw2ENopaoZpCXlwdTU1NaoECgCbgiU6y8QH+ECYWaTymK7TWdys7MzIwGaWtrg42NDejo6AB1WjU1NZo+FArB2NgYrK6uQrAlCASxn2z6wkuMp87VIAhkE2MEAwMDkEgkYHx8HBYXF0HtkQpRy1BLiEQisLy8rPVNKSsFjEzrXH4+z1hlS4xDhKadNu7t7YPR0VHweDzAEVWfHru6HxkZgeHhYVAURYNjkylVWKArZjjMzqmdVi+QCsLUkQiEjvDvncEkvU7/qQ0Vgukeo48Go87IiCJnZNmipxiz7wXEbVDnbUxQOgM12h9n6qTq6NvapRdtkwaP0XK8RmPuYSbxYfaQ/sJJhjfknuFRURUi7AMOozcCwl94hLZp5F+EioDQVwqYI6jomZU1NFtM+rOSxZjVazcyvwHr/p/Kws1jegAAAABJRU5ErkJggg=='], ['Baka', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA0pJREFUOE91k3tI01EUx39JOpA0H4jNx0pbD3XTalISWf8YFlEgldqDsBLLyqjEKBCiLLWiggh6/KEV1WZ7OaelLZvDdDafNW1JFraWe/32+01FrUZ9uy4ylLpw4Z5z7/nc77n3HIqaMRIjZJyEcNX+uFCFeGmI/GZciEIsCFJUTvoAzDz+1y7K76MSwhX5hXl6z+WSbrzU2KB8YEGDwgrTaxZ3b7xHcaHhR3xw7Z5/UviB1ReP5XSg3+TAqYJOxMzWISFIC0GQDomhTVA9skCnsaAwp/vnMq66dBokNuBR9uFd7T9Z1zCunjci0qcRJUVdoJ3DYOhRnC/qBZ+jQbfeCc+37yjY2UEg0iwvJE0k9l8Z+8xqHmTgot0QLdQgTaQFQ2AsOzlHvOu1S5pwOLsHHo8HjHMCq2MazNvTlByKHyrJLDvdR25jMWRxYx5HjeMH2r1BDOOeguRua4OI14jx8a8YH5tA+al3EHKlW6mYOapb2oZBOOwMbEMseAE12L+jjUh3w+VipyAZ65oxn1NP/GMYGR6Ftn4Qsf7qa9S82Y/l/X122G0uL2TbxmZEz1WhXW8mUol8moXu+SCi/OoQ6VsDh3UUwyQ1k9GOaI5MTkX4yWTGHutvgI1F28sviAlRgxeoRm62HvsyW8En9pZ1TYgi6TntoyQtFm86rVgUoJZRvDnKMmXVAGxWmkAYOBwudBqGcHCvHulrGpGT2Uy+z4yT+QYsCXtCUpp8GxbKhx8gDK0ro+KjJGvzdjfDZnN6VdisLD5/JjArQ2zW66PJOj2lEZtStaBphkwah7K6kMJ/GEulp1bMWhAmMbTozOQRaWRtfoZVgjo4iRra4SYgGi26TwjxVeDKhR7Y7U606ixICq9tr7hd7+OthRWL7yUnJ1WPmXotqLhpRICPHCePtuFV6xdUPTAhcWEtRHEqfHpPyto4hPXLXnzflSEJnFaN3OCKDcsFsrEntR9RUmxARLAUgT5iBPuJsXWDBj0dZjRU9yNV+PTbpjTp9OA/pOSk24nRkXf1J462oPxcJ65f6ULlHSMulepRerYDgvj7A0cKpNz/tyTZqbzXO4t0ZZGQJ34RH11lFHIlA8LIqreCCMUZRY3cd2bwL/5/RmjNSXqtAAAAAElFTkSuQmCC'], ['Ponyo', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAuNJREFUOE+Nk3tI01EUx39BTytConQTt1am07m5abi5KT5S8z2dj1yOEMUC7aUgIoimlmUEWX9kBZGWaamEmE6U1BI1XNPNGTrnHs33IwuSXrL4NgcJ0mNdOHDh3PPhnPP9XoKwcroJYvMQiRSicHCQKCgUyZC9/T5rNet5KUFs0zCZbZMsFmZ9fTEjEEBDp4/KSSSb/4JoGIyWaTYbiykpWEhOxhSHAzWD0aqkUGhWAcVkW58xlvuPhfh4zItEmOHxYDR3MhcdDaNAsKJydAz5IySKRNjEUmy88vjOVaU8F0iPCqCNjEBHkC/UYaGYFwqxmJoKLYOhkxPElg0QsbNtTlmox9yjRD9UCbnoOR+J/lwRWtOCcdXfDc2BPpg0d7CQlIQZPh9KKlVkAQjJ2x2zmOSsQu7hpzUJfBhLjsNQmADjxcT10Bcl4rE4EHc5LjBEhEPn7f1WTqXSLQB/s1Tp7vslsoIkyPPiMJAbi86McBguiaHKjoEqR4jJy2K0nAxApzMN5iUGrclrKVaz2fUvuF4tRbxDKA90w5VjTFyLZKHpTBSq4/1QnxGB2qxoVIZx0JopRCPHFSNOThfWZzfrXDcZEowH4iA05ATg68hDtBaL0HAuCm3lJ9Bfcx2fFNUoi/DCjRgfNHHd1wCZA2TyXjNkE6F0cBDpPFiojeNi8EkJdFoN3vXch0nbBJOhDd907dANv8JITxNqziag3ZsJbUDAwLin50Q9QWwl1qSYoNOVvUcOoqOqAAa9Fu9H2/F9+B5WZLcwOyxFX18flLI+VASyMGVeoJHD+Tzq5BS1PoaKRrNT8127P74swsq4FCa9FKvqBqwaOiz3hdEuLKueYSyECT2LNW0eIfo3E/WmEbvnG1MUJnWdpWhDGDvxQXZHo+RR0uW2tnv+auPX+TvtJm7zKpaen/4y2yjBUlcxlvtvmvT16ZWDpQeoVv3/60F/NrHjTf4ugazIXtJ8ivjnz/sJ+yGQRjcqUdIAAAAASUVORK5CYII='], ['Rabite', 'BIAAAAQCAYAAAAbBi9cAAAD/0lEQVR4Xl2MXUxbdQDFz/9+9Lb3tkBLCxTKhzgoOOZAsokbJmZxDFHnd+LL4hKVzBgfNCY++ODbjDEaZowvErOM6HRu6hKZY2rIAOkCY4OSDTpFaAsrlJa2t5+39+NvjT7tnJzknIfzI98Nf/C6TuXdguWBd1q9rcb8/CwsZiu2Ywm4nDVo3VWLZCKDaDwJq9mCg31PgjAMKKUwmcyYvTbek9iJRDm6M/XswEDjwNz6plWW6wdZhjUAintFCEEhn0N04zYskljaDLaj8ar49oUrsYR6mrFJNj322w46H8y+mitM/ZJKZmyE4XAvjJSsazpyuSzslVZIkgWKOvvRgQ6Xrdlhqmds7o7bFZoLkctreKxf7GtuCE7IyUQjBQcQ8j/lvxCGQJZz0IoCVpamTtzfIh9nwiaIrCQyjNg8mq11oDLUhNXRJfT1Ozr3tS/PqpnQ80qRgjAmKIqBfK4ItbSLKoOZqR/6neLkENlSUAIhlktvEf+sD2rkm8nWTHtvZCGMVON1ePuaoBER31/MXGly1wSqq9Uug6FluYyWXJiPqFXmjd4Dh9oF9ZKKimYXRtYCx8lmMIDIxlIPGz591av0mtanF7FcCEN6iMXeox2wOJ0QJAmUAoRQaIqCnWAQY1/ewKNGNeQuYXkm0d2NC2e+wvmRr/Hx+6+8PHayrbDyyQBNDb9As3PHKDWG6MTM23RoeJAWsqeoWvyUUv0UHf7pBB0fe4OeeXe3/vmHbx3+8dwIGJ4IsFpMMFe0fbtAn+nwZePr1u4MBK8XIALG/Rt479wYrs2vgeNNAMNgMbiNzybuoKVvn+Gs9kbr6qpBfJfGYHFIkJUCoGwfqcoMX/b27EGhwgOjoCADDlP+CA51ugFFRzoB8FYNaQ1oqKD44+eNL+wNj7zJGQSIhe8+jgQ9thk+27v/KRY6L4FSCkVOwtlQj6P73Qgt/o1ERoKt4iUkE7+jrZMHyzIoK9cOBFfT4LbWAk+0a7ZLnvqHcTNdACgFScfAcjxEdy00VQclHGo7dqGeYxHbvIo6hwhSghCehb3G5p6eW7VxXC5/xGWToMgrKKoaCnIalI9CIARasQAqloMI/x4BWrLLYwE1AEPTwCGHaGjz7pw/leZUNV8wNm9BLy6CxsvxZ1kMbaY4TKIIXlNBsynoVjvAC4CuAoYOVi+CMfLYCUfg95tPHuzZB0YtKzsb58RMucWE/fZmhCbdOP9rNnLnxko6GVoB8lFwyVVw8b/AyeulHoJyN4Rb19dTFyeqBlu6njvfsWcvOJvLs7DMmw/7bvpeE4pU2OIcgcqmp4fGAgt2Txwvqr7lTp5V7LquZxXC6+BqEvGcY5pyjaM1tffJbk89NE3FP5VQ6y7a+paZAAAAAElFTkSuQmCC'], ['Arch', 'BAAAAAQCAMAAAAoLQ9TAAABCFBMVEUAAAAA//8rqtVAqtUQj88tpdIYks46otwVldUbktEaldMjldM2qNcXk9IWktQZkdIYlc8mnNUXlNEZktEZlNIYktIWlNMXktE7o9klmdMXktFHqdkXk9EWk9EYk9IlmtQXlNEXktAWk9AWlNEYlNFDptkZldMYk9E4otg/p9kXktEXk9AXlNA4otclmdQXk9IYktEXlNEwn9YXk9IXk9FFp9o3otgXk9FPrdwXk9E2otdCptkXk9E/ptkcldIXk9Edl9IXk9EjmdUXk9EXk9EXk9EbldIcldIjmdMmmtQsndUvntYyn9YyoNYzoNc0odc1odc2odc6pNg7pNg9pdlDp9pJqttOrdzlYlFbAAAARXRSTlMAAQYMEBEVFhgcHR0mLS8zNTY3PT4/RU1kdXp6e3+Cg4WIiYqMjZGXl5mbnqSnrbS3zMzV3OPk7Ozv8fT29vf4+fz8/f7SyXIjAAAAmUlEQVR4XlXI1WLCUBQF0YM3SHB3a1B3l7Bx1///E6ANkDtva0jKbCW2XIH1z2hiZEZ4uUgxo7JedTQye/KN/Sb5tbJ+7V9OXd1n+O+38257TL+tah3mADAwSMM7wzQWF4Hff6ubQIZIAIb6vxEF4CZyATXhZa4HwEnEA+2QgoiyQDnIEWkjVSBBZBqXbCRlKYo8+Rwkyx54AOYfFe7HhFa7AAAAAElFTkSuQmCC'], ['CentOS', 'BAAAAAQCAMAAAAoLQ9TAAAB5lBMVEUAAADy8tng4Ovs9tnk5O3c7bX44LLduNO1tdDh7r/eutj43q2kocX23az07N+qqsvUqcmXl7331ZXJj7r40o/Pn8T42qP63KjNw9n21p3Y387Ml7732JzR55z05MSxtMLGn8TC4Hx8eqt8e62Af6/B4HnG4oPC4HzH44fBf7LCgbOkoMTcsrmtn8PWqcfFtKrj4Jvs2ZOz2FnMqLXT3KfY5p60Z6NUU5XRuqHzwWSywqDn3JaiiLWahrWhkry5zJjRmqm1Z6P1wmb1y319fK632mK5cKi5nH+73Gu73Gy73W283W+9eK17e6y1yZS3aqRZWJdcW5ldXJplXZppaKBwb6VwcKV5eKswL306OYNPTpGkfK+m0kGpUJWq1EnEqIuXK3+Xh7ahP4qhkryMfK6BgK+CdpGMaKKMa6O9ea2+eq6+oYW/eq+NbqWVlL2Wlr7AjanA4HnA4HrBkqbBlafB33rCgbLCmKjCxIzC1mSs1UytV5mtxIWt1lCuz2evWpuvXJywxYzHjrvH4oXIjrrN2HXO5pTO5pXUlYnUlYvVl5Hb0G7e0XTg03rhr5fpzHPpzXTp0Hvtz3/wrDHytknyt0zyuE3yuVHzvVr0wGP1x3T1yHf1yXe0ZaL2zYP30o730pD31ZeRIcF5AAAAQ3RSTlMAFBkbHEhJS0xMTk5UWWBsd4SEiIiPkJCVlZaam6CjpK29wMPDxMTFxcnK193e3+Dg4uTn5+fo6e/v8/P4+fn7/P7+J4XBAAAAAOBJREFUeF5Vj1OvAwEYBb/yGlu717atLW0b17Zt2/6nze42TTpvMw8nOZCAmwUpiIY6c5IiLi9tPX64GairqszHQ4X2VB64v1Cs6PxMPJSdHM777s6/jyaMRGiRLyyrb88OpjZ3CzAXrm1sqzSNNeN7kVBPNgB7cG51abE5l9cXDces7emQ1uadHhutFUg6gpPKkSIqQGavwz7r7O/+/3t/rSdjI9XDM3qz4fr3B/3iA0aJTG9x71+9oR/PLDwUe2wm19bly+fTIxHyEETatbPewGEw6Mk/tKZCEqSQQUlIHB/QNBEjjVN1AAAAAElFTkSuQmCC'], ['Debian', 'A0AAAAQCAYAAADNo/U5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAZ5JREFUOE+Nkk0oBHEYxv8fu5GQj3JwcaDkIAc5IpR87M7MKnIVJVKclaIQ5Sy5OLkgR7n5OigcSNpmd2c2Vyfl4KT8/muWiVU79TTv+7zv837NCBF6PG1X+NpZyEYSD9mIc+tHnBPe23B9xKrCuTmbQA/JKfABrhBswa1hH4A38IwfOxPdX1qcjiCQxO5NyrjKV70TnSbeRPwJvGN3i4yyqnEucPY8ZZX9GSEgGK+RvFfyjk2VKZxzBNG8wJWWgh/xtDOeUXZ7Slr6TrSLYL9N4SMgYTTcwdc2ArvJcElhSVcM6mCNSV8n9hA59yTU5UWMG6HIbLhIWlglgWiC2L4Z79qTdo40D6ISuOWwKCWHyk9Fv8ldpUHOuGTuynwSBUynddPdlbEosVpP9Eu4FnOsRzUYNTsdmZN/d5LDiqM0w+2CMdAFFsFGWgfXxZnheqe/z+0puwEM0HHYV3Z9Sgz8TEz7GkQvpuJ/36ggj2AaHLrSlkULWV5x+h2E8xkZL16YVjGNaAUscfZ/f6c/k9ywLKI2MMcRWl0RLy007idmRbQJ7RIfDAAAAABJRU5ErkJggg=='], ['Fedora', 'BAAAAAQCAMAAAAoLQ9TAAABPlBMVEUAAAApQXIpQXIpQXIqQ3UpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIqQ3QpQXIpQXIqRHYpQXIpQXIqQ3QqRHYpQXI8brT///8uTYMpQnM5Zqg5ZqnS1+I4ZaY4ZactSn8uRnYrQ3MrRXgsRHUsR3s8bbM8brMtSX4wUosxVI01XZw2X50vUIguToQvR3c6X5o6aKs6aq08Un8qQnM9VIFDWINJXohKcKlXapEqQ3UvUIc2X55bhcBdcJVgcpdhfapmd5tuk8dxgqJ1hKR5jbB6iah/m8Shudq3v9C4wNG/x9bFy9nFzNnFzNrIz9zK0NzK0t/O2+3P1eA2YaDU2eTb3+jb4Oje4urj6fHm6e/s7/Tz9fj3+fz7/P38/f3+/v83YaEa/NNxAAAAHnRSTlMABAoVGyY1SVlpeIuQsLfDzdHW4+3y8/b39/n6+vr4+ns8AAAAyklEQVR4XiWN5XrDMAxF75KOknYdZJS0klNmHjMzMzO9/wvMcH7I37mSJShsJ+5NjMT6umDoHyXDcI/2qJadh++P3cle1de+9yPe3/bTY92wzfzr7wGtP3JrAI72BZGVtcAdQlwHy+JS1pDbBE9qamZF3BYrjQxPEXwKc6dC8bXFm0QIpmt8kn0Rn093q82UCtK8oXZckwFJzuulV8bHkajPyXdbnJnARfDHs0trz+JQ+5AFvzp/L0+cL2qPAINUPrq5OC6p/64F/AMnrST+Dq/r7QAAAABJRU5ErkJggg=='], ['FreeBSD', 'BAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAABIAAAASABGyWs+AAAABmJLR0QA/wD/AP+gvaeTAAADXklEQVQYGQXBS2wUZQDA8f83j33M9rF9d7u4loaWklaDpkSo9KDGaIKUaGxshD2YSPRiuDVeTDyhBxosJCoa40ktpAkPDcUqAYVIpUSUPrAulEdD2bbb7e7ObGcfM/P5+4kwKDvq6yJ1FYYcvb+YAkqAHo/HQ7FYrFIoCiurq9ZXJ06YSOkA+kBzfX06bys3zHxS9EL0tXDVyZfefacqV+X/ZSJx5+qLbx98LhaL9RiGEZWlEsWC/Thd9q6Pf3vs2u6Orc83rFsvTwwfLf5obgywT1Vjh2Hh+rbNsnTssJdNLedK5aIrpSuldKVXKsnH4+Pyn6FDXn5tMef9O+3NvdkvP1V4+EYw2AoQ+KSx8dRYS6NXXnwovaItXduSrrkinWxGOmZWJi9OyOK9m1LmsjIz9IH8QUMOd3WfAQwNKCy2tJwbHB5+XasPaxIHmc4g7WWEZ1MquBiRFlJTf1E7+Tl/H/8asavPzTY1nWd2ZkMDRPeBeHPz5ojwsilEQCBvTSKunCF3M8FSNkBGVTHDYYrLj8jVNhDZ2SMa2zo3MTamaIC/u6Ojr3DtrOrvP0BpdATnyBeIhTxpR5ABUlKSUlXS1dWstbVxdz6hPL0l1quGqkLaKwNvVcjEXNRd/4mit4Z19DjefBEPyCKxgQJQcF28dBrHNDGTSZSezsjeff0hraa2Vs2vrvit81O4vj9xLJcC4ADrQA7YAGqBGsAql/EtLdFQE/L7dF1XZmdnSrbPMJfXoLDmolQK8gJyQBowgQhQDRQBD+hsraVhd4e5MH+/oExfvWLJ9q3/3S7qMpNH2hsS40kFS4EUUAMA2IANRIBXv4uzuO67c2PykqkA5YmZ6bN18YPi0Yoknxc4AsJPCMLVAk2BLKDosCWqs/PZaulkuxk9fekcUBAAQGDks5FT0W++3NuYuC0DVUL4DIEdlIQDAj0IRkigaMjArkFx0tf523sffrQHyKsAgHPhwoXLL+yP9/kePNhk5ExUTyKFkJVAUAiCFZrQup4Rv9ftuLV/6ONBYBVABQAArMvJ5MXW7duD6P62sD8UrPAFRU1TpeCpCnGvPZr7WW///v0jpw+VC9ZdAAABAAAAAMLo7drWrmQyPWG/r8tnaGIjaM05ujr16x/ZBFh5AACA/wGZnIuw4Z4A3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMi0wNy0wNFQxMDowOTo0OS0wNDowMOPVpFwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDctMDRUMTA6MDk6NDktMDQ6MDCSiBzgAAAAAElFTkSuQmCC'], ['Gentoo', 'BAAAAAQCAMAAAAoLQ9TAAAB9VBMVEUAAAD///+AgICqqv+AgIC/v9+Ojqqii9GAgKptYZKQkOmPj/ddUYBgW4eVjeCTgfiWjO5wbJaZkvPBvepkXomYkNldV4Bzbpl6dJ+Uj7ynoO6Vi+1qZI63se2mnudjXYjOy+GCfaqZjvWlm/Pc2e+Oh7NeWIOWjfeXjeW1sd+gl+diXIfp5/KHgKnn5/F2cZx6c6ZgWoXc2e6dltrAvNu0scrX1eTOyujCvup4c5qpovVpY43///+6uPPJyPXq6fvm5vrz8/z8/P7+/v/d3PixqvmxrPSyrfe0sPO0sfS3tMve2/3r6vy6ufPz8/3d3fi3tM63tPO4tsu5tsu5tvO6tfe6t/Vva5KRjKy7tvW7t/W9vPO/vM+/vvPCwfPEw/TFwvTFxOfGxfTGxvTHxvTIx/TJx/aTiOrNzPXNzfXQzfnRzuHS0fbS0vbT0uHU0e/U0uTU0/bW0+zW1ffX1vfY1/jZ2Pjb2/jc2uSTiemVkLSlnvbe3PTe3vng3fzg3f3g4Pnh4Pnh4fri4enj4/nk5Prl5Prm4/ymn/bn5vro5/rp6O/p6funoPWsqs3t7Pvt7fXv7vzv7v3w7/nx7/3y8f3y8v3z8vytqPWuqPX09P319P319P719f339v739/34+P35+f37+/+uqev9/f6vqvSwrPQAR0dcAAAAPHRSTlMAAQIDBAgJCwwVFyAsNUFHSVBneH+Bh4mVmZmanKCxsrK2tr3ExtDW19rb4ODl5u3t7u/w8/T6+/z9/f4MkNJ1AAAA8ElEQVR4XjXNw5aDURSE0YrRtm3b54+dtm3btm3bz9k3Wek9+2pSYFwT8ibzE93hwAtdJqK3nZo4J9hFXbP+vFHOthV6gnGzstZq94wdCs4UCCDymQ2v7X0LdYoSQ0MIENRYzJbRlPTTHu73ZNAL8vivmVui98PpzuqffX0mIPHJGtOQenukteJ+aS3b9htNpDnT9TeZH1bHAwBRMhGpd6e6uNrLoRgxBKmsX47nBlp678ojpEA40fejcmW4e/No0V8IIPfj6eKgbEJ3ZUnzgE1OqWp9Q3VeWRAsg51f1dZ8c31RmAsc+N5JGbG+zvj3BzDCPrzMDC9SAAAAAElFTkSuQmCC'], ['Mint', 'BAAAAAQCAMAAAAoLQ9TAAACVVBMVEUAAADh4eEAAAAAAAAAAAAAAAAAAAAsLCyXl5dgYGCnp6eTk5N3d3fBwcGqqqq8vLzNzc3Ozs7Ozs7Pz8/Pz9DQ0NHR0dLS0tLS0tPT09Pf3t/Pz8/i4eLb29vZ2drZ2tna2dra2trf3t/u7O/u7e/u7O/r6+vt7O/w7/Lw8PDy8fTz8fXz8fbx8fHz8/P19fb49/j49/n6+vuPxlmWyGOx437h9NDr9eD6/fj////+/v75/vTA5Jv6/fb7/fnL5bDL5q+AxjeDxUCEzTyGxUaGzjyHxkiHzz6J0D+Kxk6K0kCLyE2M00WNy06P00mSz1OUyF+W2FGX1FiY0F6Z02CZ21ac0Wiez2yfz2+f2mOh4GCi4GOi4WKi4mOk12+k3Wul32um1Hin0nun4G6n5Gin5Wmo23Op2Huq1n+q43Cr526s4Hit23+v6XSw34Cw34Gw6nWx4IKy4IOy44Cy63ez146z34az4IWz4YW03Y217nu38H2625e645G74pK83pu98Iq984W+4ZjA4px0tzDA5ZrB8ZDC5p7D55/E947F6KHF+JHH4qvH6qTI46/K5LLL5LN1tzLL5bN1uTDL57DM5bPM6qzM66/N5rTP6LbP6bTR6rfS573T67vT7LrV7r3X68XX7MHX773Y77/Y9rvZ8cHa7cjd88bi88/j8tTk8djk9tHm8trn89vo89zo9N3p9N3p9d7p9tvq9d/s+93s/dzy+erz+O73+vT4/PX5/fT5/fX5/vN1uzB3vTD6/ff6/fh5uTj8/fv9/vr9/vx8wjV/xDmrMRH0AAAAOXRSTlMAAAECAwQJDzk/RUlNU3F0kpSVlpeYmpucnaKjpKWqqqqtu8LExMTEzdTU1NXY4evy8vP+/v7+/v6LaR1mAAABD0lEQVR4XiXI03bEABAA0KltW9kaW3eSZW3btm3btm3b/q4mp/fxgqKOtpamhrqaqoqykrQYABh+PVMU9fjE5Xp8o54kgPHN0EBHU2N5YXZykiua0HHd2759VF2Sk5IYE5GGsmCEWLV1kVWwt5O+3x/qpgsy8k4ja+cJl2/v5C22tlgCAHtw9TQSa4s+AzfPSm0BRNl9SydhWJzLC567KrNhgrNwHIJ5qTz/2f9w7Jw/DNqIjVr04exW0AEOXcN3Ab7enr9eDW2VTJgehONyc2Z8XP5YdD0Tcuhcc4/r45OjGX51TEjYPbh8THRPvbz+CHusgSZlT7rP8PkCwfQKaQUi9Igr6JsRBMFiWZgb/AHKElRzKopZJQAAAABJRU5ErkJggg=='], ['Osx', 'BAAAAAQCAMAAAAoLQ9TAAABrVBMVEUAAAD///////+qqqr///+ZmZn///+qqqqAgID///////+tra339/eAgICoqKjx8fGMjIzm5ubh4eGPj4/g4ODIyMiAgICSkpKLi4vS1tbPz8+Xl5eMjIypqanIyMjW1tZ2dnbR0dGamprFxcV3d3d+fn60tbV3d3dcXFx3d3epqal7fHxxcXF+foCnp6hYWFhyc3Ojo6SMjI5fX196enp+fn6Li4xERERqamqgoKFpaWmFhoeen6A/Pz9QUFCWlpeSk5SUlZWUlZaOjo+Tk5RHR0cuLi5YWFgwMDAeHh40NDQ3Nzc6OjpcXF1rbG0XFxdSU1NVVVVXV1dZWVlbW1tnZ2lwcHABAQEEBAQXFxchISI+P0BISUpaW1xHR0kNDg4qKyszNDU1NTY9Pj8NDQ1cXF4XFxhSU1QSEhIDAwMrKywtLS4uLi4wMDFHSElISEggISE0NDVJSktNTU1FRUVWVlhGRkYEBAVBQUE0NTZQUVJQUVMFBQUqKitWV1lXV1daWlpaWlw+Pj8bGxtcXV9dXV1fX19fYGFgYGBkZGRlZmhpaWlsbGxwcHB2dna844Y9AAAAV3RSTlMAAQIDAwUFBggMDhkeICMkKCgqMDIzPj9ERFBib4CCg4iMjZCcnp+jqamrw83W1tvb3ePl6Ojp6+vs7u7v8PHy9PT09PT3+vr7/f39/f39/v7+/v7+/v50ou7NAAAA30lEQVR4XkXIY3vDYABG4SepMdq2bRSz/capzdm2fvOuDO397Rw0Ly4tz2QAQPbcxuZ2E/STJwfxPhWgG355fRrVAIVb1zeP9UDLfiSwkAcADe8fn7tFxWuEXFRDoer/OgoMTRBCumj8yJwPBo8Zhpk14U856/HI8n0ZUtpZ1udrSzfVneA4roNKjdrwpcMRilb8d8G60+lKnrpWcn9bO+B23w2O8Tzfq4aiNSZJqzn5O4Kw16h06fPZ+VUlUHfo97+VAEb7rSh2UgDd4/U+TBlQY7FMj5gBIGvcarVVfQPVPTG94D0j9QAAAABJRU5ErkJggg=='], ['Rhel', 'BAAAAAQCAMAAAAoLQ9TAAABj1BMVEUAAAD///////8AAAD///////8AAAD///8AAAD///////8AAAD///8AAAD+/v4AAAAAAAAAAAArKysAAAD///////8AAAAAAAAAAAAAAAD///8AAAAAAAAAAAD///8AAAD///8AAAAAAAAAAAAAAAB5eXn+/v5JSUnKysrS0tJ5eXmqqqqxsrL+/v4ZCgknJyeHh4eIiIjo6OgZCAdOTk7t7e3///8GCwwPAAArKyv19fX29vb9/f0EAAD////+/v4AAAAGBgYHAAAJAAAMAAANAQAPAQAVAQFyCQV9fX2pIRzmEQjn5+cBAAAFAAAAAADnEQjvEgn////uEQjyEgnsEQjzEgnxEgljBwPaEAj9EwnwEglHBQJHBQNNBQIBAAB3CQR5CQSHCgWLCgWRCgWTCwadDAWmDAapDAa/DgfKDwjWEAgGAADh4eHiEQjmEQjmEQkKAADoEQgLAQDtEQgMAQDuEQnvEQjvEQkPAQAfAgEuAwEvAwE8BAL1Egn3Egn4Egn6Egk+BAL+/v5CBQJrB0muAAAAT3RSTlMAAAMEBAkYGhsbMTRLUmpvcHeIjLe6vcHCxM3P0NbW3Ojp6u/w9ff5+fn6+vr6+/v7+/v8/Pz9/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+Q8UoNAAAAO5JREFUeF4tiwVPA0EYRL9SXIsWl+LuxfcOd2Z3764quLu788NZNrxkksmbDP2R7vH6GioLs+iffEzNXd4+TqPErUUpVqMOvwgdzMPn1rv5vPsVeufBTaBK/bH2FPvkEUuIG5jIIc+sHYn/HJ3dC/Hxuo4y8s44dzwBbFkisHN8bVIdXs6jb+H97aCwbHEIqgcml64CD7YllNkAVQC940MLYe5YzvIeQAXNrd19Roc5MdzfdQLUUKaUYyuG9I8y1g4gj6hIak4X5cBIT2MquZJrJdOqpY11ZpAiqVwbY/C7KY1cRCrZxX4pWXVuiuq/hs49kg4OyP4AAAAASUVORK5CYII='], ['Sabayon', 'BAAAAAQCAMAAAAoLQ9TAAABvFBMVEUAAAAcUaYdVKwAAAAAAAUABAwWRY4YSZYhZtIhaNYHDx0KCgoFDBcKCgoRMmYSNm0fXL0fXb8AAAAYS5gaTp8fXLwgXsEGBgYFBQUZSpgZTZ4JFSgODg4IEiIOJkwOKVIkW7EnXbQLGzUTExMKGC8LHjwMIkITExMiIiIPEBEPJ00QEhMXOXAaPncOJEgoXbApXbEcHBwwMDAEAgAfHRgQDgo3NC8AAAAHBwcKCgoLCwsJCQkaGhofHx8lJSUwMDA0NDQ4ODiRkZEICQocHBweHh4GBgYHCg8mJiYnJycpKSkrKystLS0uLi4ICAgODg43NzcRERF1dXUUFBSjo6O1tbUbGxsEBAMLGS8MDA0iIiIjIyMkJCQNDQ0NHTYKCQkoKCgPDw8QEBArMDkKCgkRERIREhMxMTEyMjISIz00Njk1NTU2NjYCAgIVFRU5OTo5P0c8PD0+Pj4/QURAQEBHR0dKSkpMTExSUlJiYmJlZWVnZ2cWFhZ2dnZ4eHh8fHx9fX2FhYUXFxeVlZWXl5eYmJiZmZmcnJwZGRmlpaWrq6usrKyvr68KFiq/v7/FxcXY2Nji4uLn5+ft7e0yif9uAAAAN3RSTlMAAAApKSkqKioqg4OEhISEhoa1tra3t7y9vr7S09PT09TU+Pj5+fn5+/v7+/v7+/v7/v7+/v7+70RY/wAAAPpJREFUeF4dyWNjw2AUBeC7dfYyorM6rx1exKltzLZt2/rDa/J8OgBVVlFDX39jcTZoUqCse251a2dvu6ccUtWlanLQ4Vpel+ThlWq1l3wEz58tx4dOt1dMlAJk9A5gMjG75LHwo46hzkwosGOMbejumoRvubC9EOrMviT0E0Us9fvN9dA6zxJCNv6+ECGsb6oNWsgmpZT9/UTUZo3Em6AW34guTL4jiAudiCM1kLcw8/SmHERfT1/eueBiDqR1GK1n9w+K8nglxYxd6QAML4ztXoQuj8YFgWcgqdJp8qzty26vaboCNIxBCshyQDKov0aXr29v1ufq1PwPx5Q7bCoh6eoAAAAASUVORK5CYII='], ['Slackware', 'BAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AcEDi0qZWWDgAAAAx1JREFUOMt9kktoXHUchb/ffc1M7rySSdJMOknFPMRitLgoNKKI8ZHGKkgrjU8SitidimSh2UkXoQmoO1dGQSxJjdvOtqSaqlR0USEGSjVJGxuSmWR6M3fu4/93YX0g4rc9HA6cc4Q7DI+fpzz7PA8++2mxvZAeBZ4xhHtFcJRmXWsWvb36/OLcyxf5B/KHeYHy7DmGx1+YSDjmWTdlobTGMAStQGkNoLXS4tXDq7u7tUcWz49tA8jR8QUuzB5n5NTCV13F9JEo1JJwTLKuzU61QiOMcd0UDb+BncwQK3Rl15eNja3ui/Njq8aF2eMcO/XlBz0H8oO2ZUkum6A13WB99TtyzXlaCi24SaFa+ZFCzsG2DNnfkdbFjsI1APPhk+d6ujqznycdCxFozadYWvyMpx47wa+bPkGksKwUNnsk3TaCGASRXDZh5LpHXPPg4Rcni+3uYBxrtBbQghlscOVKmYHeEm0ZIZ9xyLffw41ND6VAa43SmjiMByzHYtjzwr9arfshxf5jOKlvKZfn8es77N2uks24PPfSFD/9Uvt7AtPKWmEU9d645eHYJo5tcKi/FX/zG+zmQxQH+rANk862DOW5N/hhaY64cJSa5xNFCgDDILZACMKYWAmh73HmzFsMlBQJ06LeiMinE1S3KzRCm5rXIIoUIoKIYCVM36urZFbEoiBLNMIhAE6/NsSB7h6SKZdL8xsUOnpx9j1KbTdARACIowArYe1ergfNT2i0mIbJys0GI6PT3N1/hJvrPxOFdRJNBQIy/FapI4Bpgohgcjuw+jq8jy8tV55MNBWI4ohS802CpizKv8q+FgALZAfYgSyAZtNro1oLaU1VvxCA029Oraxs7u/tKnXiNjn8HyKwur6lI++6vPK4V7IA7u+1Dyu1tr183ddNbkHuXP8/zEIYeFqiLRl6YO/p0bHJdflT/PD9qZa1W+ry99fcvlAlcZwUpuUAglIRYVgnDEIOlna4q0M/NPnuO1/PzMwg/045O/XeibUt5/Xangx6viSVFpK2jtMpvdyWCz+5ryf10clX3/amp6eZmJjgd441URWWJY8BAAAAAElFTkSuQmCC'], ['Trisquel', 'BAAAAAQCAMAAAAoLQ9TAAABjFBMVEX///8AAAAAAAAAAAAAADMAAGYAAAAAHFUAGWYAF10AImYAIGAAHloAHGMAKGsAGmYAJmYAJGEAKnUAJ1gAMXYAJnEAJGQAI2EAK28AK3cAGTEAMHgALXEALXgALG0AFUAAI2oAK3EAMngANoYALXMANIAAM4IANIIAL3gANIcANokANoQANYQAOY0ANIYANooAN4kAN40AOY0APZMANIUAOY0AO5AAPZUAPJAAP5MAPpQAQJUAOYsAPpYANoUAPpoAPpUAM4AAQJkAPZIAPJEAQpgAN4cAPpQAPZUAPJEAO4oAOosAOo8AQJoAOYsAO44AQpsAO48AQp0AP5UAQpoARJwAQ58ARaAAQZgAQ54AQ50AQpgARaIARqMARaMARaIAR6QARaIARaEASakARKEAR6MASqsARKEASKcAR6MARqYAR6UATbEATa8ARqUARKAAR6oARqMASKgATK8AR6QATbIATbAASq0AR6cASKgASqwAR6UASKcATa8ASqoASqwAS6wASKoAS60ATbHn4CTpAAAAhHRSTlMAAQIFBQUGCQoLDxAREhMUFBUYGhobHB0eHh8gIiIjJCQkJCYoLC0xMTE0NDo6Oz1BQUNHSUxOVFVVVldaWl5iY2RkZWZoamtsb3FycnR1ent9f4KDhIiJioyNkJGYm5+foqOkpqamqKmqrKytsLKzs7e4uLy8v8TFxcXGx8rO0NXY2eZc4XYcAAAA00lEQVR4XkWN1VoCUQAG/3NWtwh7CTsQJOyk7BaDxuxA6bbrxf32gt25m7kZqDRYxziooDV7+1AalMUavQh2AsEZoWvzigLun+T17/c8QiJZ7qu2QKiNmyZthdcR1/as353jIeU1GxMHo5XHdqPFeX8IaDMdHPYN6dRN7LR4qQewdTa35HWkyh+fbxERAMjwlAWJv3CPSKDQ+H7XvHdkV4Pua3Gtm4sPKIF/WV8dop4VKBw/NU33B3x1JbTt+XwhkJQoqRfWvHOy28uqH8JIdomR/R+s9yR3Cso77AAAAABJRU5ErkJggg=='], ['Ubuntu', 'BAAAAAQCAMAAAAoLQ9TAAABKVBMVEX////ojFzplGf1zbnqnHLvs5P10b3yuZv1xKrytZXvtJXys5LysI32waT0n3HxiVHwg0jxhk31kFn0h0zxf0P0hUrveTv2iU3yfkD1hEfyejv5eDLybSX0aR7zZxvyayH6ZxnxZBj4YhH7XAb5WALlUQLeTwHgUAHeTgHfTwD65NzdTQDdTQHdTgD31MfcTgLcTADcTQD////xt5/31Mf54dfmfE/dUAbeVQ/jcUDcTgHeWBnnflHohFvpjGbqkGztnX342Mz53dLgXiP65d399PHdUgrtoYLyu6Xzvaf76eLfXB/rkm/fWhvupojwrpTeVhTgYSfgYynzwa30xbL1ybnngFT31snngljhZS3539XhZzDiajbibDn77OX88Ovrl3X99vTjbz1fisGCAAAAMHRSTlMABgYGBwcHJiorMDA1NXGHjY2Nl5mZmZyfn6O5u8XHzc3X193j9fj4+vr6/f39/f08OUojAAAAx0lEQVR4Xi3HZVbDYBhGwQctWqzFPXiQ+36pu+LubvtfBKcN82/UEhld2vWXxyL6F92gbTPabse8hU/uHMx1SZoyyJWPTwq1Rs7GpYE9+Cg+OJcs1MHvU9y4fnrN31yUm18vMCIPjtw3QMndw4rs8ieVzAAcBlewpe1KM3uaBuD3Dda1BhWXAsi6AFY1a2SqifxZ+rnxWYcJDRkUS3fO1R5vwe+XZgw4D4L3RAJiknoXCVX3WeiUpJ5pIxTvVmg45pl5k4Ot/AGV2iqZBWgJJAAAAABJRU5ErkJggg=='], ['Windows', 'BIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA+pJREFUOE+F0n84FHYcB3CWSsL9ojo/6ik64c6PnTjmSS0limmrpBm2G002y++xzXRz6zE0R4nbw+RnTj/WD4sbanLkkAe55ccYlyNme4SrO9u9d13PI3/saZ+/vs/3831ez+f9eb5aWsuqy2mjRYeNUa7YmtjfTico7jNJ8z0eG24NB9vvnDrvufzpq89Npnr8VjMddNmuRh9rDfp36mFg91oM7qPIc5JdbDJq3An/JfCu7Hl53W2lpS220pP2OuniN299jAYbYizSENIoAgbCTdrTKtxOJVdvGo8psUwKy7Vxe4ez1YEVudGP8YEZzyveInFJ6mZRHHqYazDspw/pJwTIuERM5JIwmUdGdyo9K7/BszGzzg6fXzZHGJ8KvzQqXKOpoIeZLjofWR++BPWyCEnPY4xFGEKWQcLjMjKmr1MwfcMYwmz/Y4KOgNki0V5k1dkjUWCK93Kp2PMFFawos8cm1gZ2GqjLXktL4mbQPHLQ4B9ZDFE5+S356fQlyuJMqzH++HnTo6ui2OO1ko9Ul+4fxfd3d4F7k4YTReqpuFS88bGZUE2QNNDobuIq8Q5CduHb7lFJaTnvnym9ergjMWD/FG8zf+aKS3G9JO5C01Asah6wUXrvALKEDoitMMHhDKrKJdg8RU2s0EB2EWWur8dd7PDPFv6dUC0Gv3kAN36VPRGP/5k5NS6lljWxG0TDiSr1VKhoPwhevRMSqkwRxDObc/DavGtpP6zoi8XOyZfhnyNEvKANBU0P8VPfI/wyNCGXSn7wlEmyA9KrgmOKGth3eDVvPfyywq2dnUEv2R9qG2rLsH7xJXziKnWcI8tlTvEC7Mu8hROlImTU9aKqcwQ1vWOihWFu+sJknmph5CvxQh87c7bNh/NXo03hrMCosyvLmMNgMF7TQL6J1dsZIUVwjKqEO+cajp5vxPN439U/gKBt8PTcYHzL/BgHCyOf4unAISj6mFC2bYC82kB5Ls460NHRUVsDeYSXpGw7UgC7sAtwShDgzdM38W7BbURXtqpqhfmB8sEQuXwoCM/6faGQuGCxyxyKWhIm+PrSD495WL3cT0hhi8Whc3NbAs9KaOyCTvrJ8qkdX19XBeTUDU00+55USFzVU2yHstcaix0mUAjJkJeuRU868Ucmk0lcguiBnMAVxjbbdHV1yeq8+u4Hgo22huSG+iQXp83ftaxW3lsPZcs6KG5T8OwaAfJiPcxlrVRVRhvF02i0F/t5VbHZ7JWDfErKTLnhE3mFPuRFepg/uxqz6TqLv6euGj3ut87t/4ylvre3t3ZehOWWO1zjSFEqMVP4GfGb/DBykJcjmaZOoLsc+hcVY/LaAgcTQAAAAABJRU5ErkJggg=='], ['OpenBSD', 'BAAAAAQCAYAAAFo9M/3AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAykIPu64pQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADTklEQVQ4y32RXUxTdxjGn3N6eujoKT3SUkuk3VoBGfVjgFXAsZ7WkipyYXQbuu3CzUXZmGRbssnFEseFkWzgcGzGXky9MWL8TsC4IeFgtK4oAqOnG5vMVl1pCMVWQD7b/y5M6jLdflfvxfPked/nBQA0NDSChqnGVrLuGkES742NhJAdhAKAuk9yyUs5Gry7RQMZAARCWgivpQiPe71P5DUfH0xaqTL7m/iiLkJmphawa+e4SM2PvUyC4yUIBu8CnAQKAK53rCA5OUtQtStVpJ4Gw/FOBddZVKhCfq4MP4n6+at+DUsJm/e0G9JZzYEvI2tHwlEYjDxomkZ+3nG8WroRtHihZVOhVlorDQzh0okhcByDP4ZGcf+X9XAsvY5/RsBa7Kq5H/CqLctKyl/g08S2i6fq8W/MS3P34T9wNDVYSeDX1eTD9xhiLXbtB/Akwmmv6Kr+ICFkLpGhtNSM3qsSstS3oX8lSsmsxS6ZVn3j6PvVVqhUcvC8AtPxVPxwygVKvngN89WOjgVprggGA4eenjB4nsXsTASpC63I0wVTZYPR11FoKRB8Ax54PCFk6BhMTk5CPR3GSbHouGzknr/bYFq9EAvfc9Tu1sLjHcXNKxLuTOTgzOlOe7IHBc/beAXWpWmXlz8a84nhcLQ+ecVzsAEQrMWuMX+f9HZF2YPZ28FVSNfoPWqOzMUmqYMAJm7+/OOzXQFwHGpyEV+vi+yvtxBC9pDmpgJC4tvI3mo9GTitIxvW24nT7ug67HY/3eDs2bbyrVsrY2day70rV6kRfDAHk5lDLJqAmmeRiD9GJDKHvwb74R8G0mkTPjrQTTG122xkTTbwaV2b1H4u16JQKXGr7yG2b8/H1MQ09IsTSEmRwzf4CCwzD+dmE1re8CI7wwi5XNlFf9vaTXX4dWJg4LLl7h05fpNGwNAMWpp9CIVYNO/tRCzGwpDFQaVMQTS2CKY0BWr3GVGWNSXKACDDaA4Mh976pq9f5Sy09GgKlmeAMIBKzUKpU+BFoxJecRhUfAbMxDi4eADfHVmE79v7q575gvvYeVvjZ58LD5mwsKUyX0hnf0feslnQCWD4zxnc6reKisxsfH2oscqcmTmK/+Ow252cna7K52r+Bky6PqmoT5HBAAAAAElFTkSuQmCC'], ['Gnu', 'BAAAAAQCAYAAAFo9M/3AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAywUV5gQrwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADcElEQVQ4y43Tb0jjBRzH8c9v+7nNMebcUW21Cc78g/wcuhByIScoMRwoTBmFlZCmIJ14axqkgoYIkXIqKIVBEuJNUBEUPRlpqDC3Q2Ex0nTezun2YOaPLXNIv7Vvj7zgiOj1+PPk/eADjuNEuHN6ekqMw+H4IzMz8xChUCjV1NT0JbO7uxtfXFy8NZvNr21tbd0AAEQikY6I0m1tbQbx2NjYZiqV+vn29jY+PDw8xhYWFj45PDzcb25uhlQqfSTief6X0dFRpqKigvF4PPPipaWlY7lcXhCLxXJnZmY+ZTY2NnzX19ePGxsbHw0MDLivrq5mc3Jy2pPJZLVWq/2cdbvdDSzLholoNJ1OMy6Xq0Ymk5HNZktOTU29qMgA8HYqlaKDgwNKp9M0PT09BgAM/iGuqqoimUx2yPP8U5/P9wEAMB0dHRUKheJHiUTyeGhoqAUAnE7nR0qlsjcQCLwjlsvlz+bm5mQWi0VSWlr6bXV1tU6hUMj6+/vfN5lMN0xxcfG1zWZ7SETTSqWSGhoamPHxcajV6s+8Xu9Xou7u7t9VKtW00+mkSCTC6PV6aDQa8Dw/Wl9fP8UAQCgUosvLSyovL2eWl5dRUFBw7Ha7v9vc3By5K3g1EAg8FQSBiIguLi4IgBwA2LtEjuPuJxKJ62AwKFpdXf0eQBIvYVmW/cLlchEAWK1WAADT09NzX6PR/OTz+eKVlZUzKpVqTyqVvsnzfLCkpGSrtrb2t97eXnFeXl5ZKpWyZ2RkPPP7/UUnJyefGI3GU+zt7aU4jotOTk7mAUBfX1+b1Wq9kcvlBIAcDgctLCyQxWKhoqIi6uzs/BoAVlZW3qqpqbllZmdnf1hfX//Q4/HEzWbzX+3t7fcMBgMFg0EYjUYmEolAEAREo1Hk5+fT+fk5Mzg4GD86OpJ0dXXJGQBoaWl5Ra/XP6yrq3tQVlam2N7ehslkAsuySCaTUKvVSCQS2NnZSXAcJxYEQTEyMvKeIAhLDADY7fZ7BoPhm6ysLFpbWzuan5//WKvVvsHzPEWjUSYSiSA3N5d0Oh0TjUaf+/1+S2Nj46/4FwYAr7e2tnbF4/E/iYjC4TCFw+F0LBaj/f19mpiYeID/IAagAyABYLXb7cLZ2Rml02nyer3POY6rwv8hEr34u0IkEk1mZ2cTgGMA7768/RtL5JKsGzrLIgAAAABJRU5ErkJggg=='], ['CrunchBang', 'BYAAAAQCAQAAAC45EetAAAA8ElEQVR4XnWOsUpCYQBGz1TIHYu2Qix6g0DEtSeQu/UIISJtUS8gJq61F1wcdMohcBDxKUR8hsz1xA/y44/cs3znbB+RJ0Skl3pSkeFQbUs79VAPzrwPFRmN1Ja0Ug/16I93+1oi4lKte+zMXv32WuoAm43lXMrqzbFncgWw21lORf4+/PREKpAhYqZuPXZ+T/3yXbZEajV1JavUQ104sRcq0myqc5mnHurWqc/7yhExVwuPncl+C4Bu13L60ueAwcByOtLhgAIRCzU38fRGTmSxUBvSSD3Ui1NvQkXWa7Uq1dRD9R17HiqyRUSy1NP6B7e1Yu2GtlUKAAAAAElFTkSuQmCC'], ['Yuno', 'BgAAAAPCAYAAAD+pA/bAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAABDtJREFUOE+FlHtMm1UYxrtsi8aEgCb+oTFmZur+WNS5RaPERU10C2qGaBgb6hgwLwMmHTIKlIKlQIHSQrmU24BSSmnpBVooUmihtEC5yKWDjVu5uOkcEca4lG5E93j6EQmELX7Jky/fOed9fu973vMdGu0xT3Cgz57yXMZLDdXcy821PFWLKmuA6HqLMqtLX5POl4iYb2ukWW8IOOFe/qfe3/M4n0eOjwyZD8//bldODOk37N1yDJgl+LVdjEGLFKO9KkzZm8hbje7mIrTXZ7sMtTydrJh15H8hHW11XvN/jGS7VudcD5w34ZZzeQYb67fwYO03LN4exo1+LWzNxbA05O5QuzbHqRYn+++CHDx4YK9WLfaedfQzV5em54g5Zbi8OIml+VFMDLWQ7GXoaSmFWZsDZVGCO2u0EbkhHTrhFqi9PmelSsQ8tAtSVch60dpUeGe4kxgZxegzVkBzlQ2NKBG2+iJIMqMok9r8OLRIMqApToSqmAWTmk9B2+o2YW79oshU7ABcuvAFrVGWXkVKpBYoSaBSxIS2mINpiwbjZiUMZRloVfJQyaXDKObBpimBScpHFe8KmmXpaKhK3arGrBVuVBclHN2CiPNin1OVs1tVJYlQlyZBxA6DviQVo6ZaOKd7sTplw53BVugruBBzfsRslw7rZPxaczWutSpQV/gzJPxo1JexyfaxKBBpuiEx+tw+CpKdEvGWTprGlhcwqbIzL5/DYKMYndpK3L1hxf3ZfkrzwybUZjPhnOqmvlcmutFF1jis9QSShOrcWNSXJ1MA0ou/NZWc8Ddfe4VGO3bk0JON1dyMMlK+gmxNrZCFhZF2Kng7YNO0awt4b7wLNp2EqtAsF6ImP56SG0B6siovTYpIjg15gapCVhAfJRUyIBFEo6k8AyuTtkcC/qvG/XbDexulWJvqgYH0o0nKhVHFJ40XwFQnWM5OCX+XMg86c3KvVMSMapCmPpSTIygTxGKZZOcOXhrr3Mp4uzkFuG6B3ajE3TELDDU8qEmsmvRATxquKkxAnSTFjwKEfv3JU9JC5unG6rQ1bTkbQ4Yq/DVgxOqwBWt2K9Yne3ZCZvrgHO2k5paHzOhSiVCZSkdNTgzy40JRlPgDhDHBCxUZdCs91G8fLeK87zOl6XSOICZYXMGNhDqX9fDP/mbK2DXVi/szm03eLpejl5pzOfqwOt4JBT8OeYwQt/4R/BR0OzXiLCM5LOCji/4nXt46rpywgG+zor5RxgSdupBzJdglSY+5ZZbl3XNY6mbn7W0Lcx06zBg1WBjtcC6OmG+OmRTrFrnIUZESZeVeCpwh8TpiPsQ47/tloM97T+/6m8mg55mT3tStyL54mhlwwtszNvjzD8/6HH8i7PvvPPRioZdRWuDBZUR6pEWG7I8P9Xs1Jsj36MfvvO5J/+rTw58dP7afJPfBgeef3XGz/gskFVpJc4HwGwAAAABJRU5ErkJggg==']]
  };

  Emoji.not.push(['PlanNine', Emoji.not[0][1]]);

  Icons = {
    header: {
      png: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA'
    },
    themes: {
      oneechan: {
        light: 'A8AAACWBAMAAADzkc/yAAAAMFBMVEVoaGhsbGxsbGxsbGxsbGxsbGxsbGxsbGxqampsbGxsbGxsbGxlZWVsbGxsbGxsbGzdpWE1AAAAD3RSTlMAfEDYHcNYkhP0pz8MJYTrg0d+AAACwElEQVR4Xp3RT2gTaRjH8W9r/rVJNTl42UvHvYinVGLR7SoZ6+JBD0kpsafVgJale4m67r/DkgEp7EEMsqy2KEwEUdjt0kBZqovY3oQedEBE8GA9iV42TQaTVm0f33lfCAgLZfuDgc/85n2f5zDAonnYIQ5LIwCykrj5hyqc5dWlz35QaMr7c3eKEBGReVVASaRZBOCxiKfRJ7KuMV4x1eGvE7pKjHo8bvwDXXsh0Xqu4AGP/mKT7DRgwTc4IgaXRSSTeQ2i0zbNv2UBjonP9gDMGQC7DQAiGbacbwpjRYB7rsh0DSLN+pnSqxbk7reIfEjb7Iyvwvtw0jSrC7Y6Uy6WzreAPVl1y+rM2STjmaGa3uX/+PNbB+JrHqSnoDJAfy3mQ92hbJG2GFS26KnSIHjtHaClUCM6wBA8RX0KDtf14coUp73YdDDQgvRb4ImMnRJxgPnRsXFZwaTbAl4UTnoASzKYbTsQy14gVD4AvS0g0oblsxCvztrUbUKztVySUSi12ZanQEg+EM6rpleK9OTptxd+AnUmV/0TULeies5GMPmWun8AeCS/uxsOwOHCiM0nOV4zWBp5Y2ncJnYIIJSHeYB4EsIaL2ESgH3wSmPOutzQCH1/ov8gJmF/0SCWXTfgYtuAvl/4jyyLzzYRj5xcJ+6KrfBucbsEcKVaF9dm8oH48u5vB6iLzJhN4qMzIWtF4OFR95p79dkilS+kOLGWdajIVSKuBDhEKKuQkzZRUUj8ekk/MPy5io2qg7Qhd8GGr8o2aRsgZ5EeloZB9zqwQ6PrxkkN8QanTEMpaRD7TTfDsnFwv7rVmdOZ3NnV2a6KZL/Iyv9DKpWydqVSSTrpNFsbCN9mpk8ATIrKWWA2QAsiEqQBYY0Z6FG4cheIytBEC4AE4TUP0GXeoEvaBnG1xSgrTYOS+Hz6M2PffclH1wyYp51t8R8AAAAASUVORK5CYII=',
        dark: 'A8AAACWBAMAAADzkc/yAAAAMFBMVEXg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4OCxtN5xAAAAD3RSTlMAgEAe2MNYEZX0pj8kfg6uY/qOAAACwklEQVR4Xp3ST2gTaRjH8a+mSdrGps3FxVPGPbmnDFU8uEgKpqi1mgiNFLEY0IL1khQsvRlB1C3skou2lsVN2IVF/NcIFasHO4KCeGkuvXhpe1tyaRviNKmNj+/MC4HCQtEfBD75zfM+72EGWNY/OsWkPAQga8Gnj1RhLmyUP91WqMiXPx6mwCcic6qAtEglBcCqiOVij8iWi+Goro5eCOpqwGK18Ro6TkPQ/qhgAStP2CGLGsxXNQ6JxqiIxGI/gbip6SaUE+CIVNnlgFkN4IAGgC/GD+dqcjAF8CovMl0EXyV8Kb3XhugbG9/XiMliYAO+eEu62Zg31Uwulf7bBn6Jq1MGwJXk+RQ7ZDjWV3Tvqv428TkDgboFkSnI9rBU9FchnCFnEDHoVTZoK9DA+dveg61QpLWHPniPeuQMh93h7BSXLf+0s9CAyGfgnQxeFMkAcwODw7KGzm4DeJs8awGUpTdey4A/fhNP7ji024CvBgs3IFCYMQmbeGaK0RIDkK7RkiCJR77iTaimXVK0JVgy5++AmokWHgPqVKu7Z93Z/I86fxxYkXv59QzA0eSQybb8WtQoD+0zXPyLvx/Ak4A5gEAJvC66YAyAY7DXxawx2nDhuXVu6Qw63uqyhj++pcG1mgZ7fud/siBVWkQsovIngbyYCpvsEgd5KYQlbzL2XKqy+SIDhEUK+iap4mZE6ingv8P5+/nJD8tkT0pqpB7PkJVJfHlx0I8nrhCVGq3OZv/4dYLj40D3zyomqnZSg+hNEw7mTCImQNQg0i0Njd1bQKeLjr/OuhCrd0o3pEsa/rtu0y3rZ06oU809zc3Nu5q3q6IrLLL2fQiFQsb+UKiLZprNjy2Eq7HpcwBjolIAZhzY4BMnDfC6eAZtCg9eAq3SN2IDEMRbtwC3TGh0yKZGQKSkFZeKRlqqbH+Z/olTfAOK+pQDVhzLsQAAAABJRU5ErkJggg=='
      },
      "4chan SS": {
        light: 'A8AAACWBAMAAADzkc/yAAAAMFBMVEVmZmZnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2djY2NkZGRnZ2dnZ2dnZ2eHsc5jAAAAD3RSTlMAgEDLkve+G+dSqwcRdCZzKH/3AAACz0lEQVR4Xp2PQWhTdxzHP0vTliQvMaE4NjdoutMOA6NrpeghQaazp4R1XkL15VDR4UbeKiJ4UXCuzG7kgd2lONLbGNmWgKwqGyMQN0QRqruIuKYXi9iDtkmeaaD97Z9/2nfy0n0u+fDl//3+XnA5E+XIoA30bPDnVceC0EfgkynAl6AyulICHhjDi/kYEHx7Ab8NhPpW0bxfbRQAfEcfSasEVGv3RTIQlMlAVlagv7lIRcSi+An05hy4awN3f+a1TKNhqbFvfAG4LW1+BVNLI0pRNDE8cS0p8F364bEpF4FbkJdZAIxs0wIIvSU/AuAdPci2GRj6ooz+jpp8A4RyzvKSFOCZrB46KLUyWUmZKVMybuK+cVvAwAm1s12MXUP73wXYKSKNMHhF0iJ1qIpMqWyebEcymCJjSi4SFzmuk6p+LPP8JXKs0zI3dx7eePOyWn4900ODNsD5xmC8ZUHv5Se/B81J8Lf6xkdOpSE/kmvtWq7aJK0Xze/KNxN8iNeZpyfGpwT+vYc3xT4I/GP7YxwqQTL9W4J8GO6sqJb/OHSPpNvL7/C8OKlvjZ9Qt9zrEDx1Rf+G4iKtMtAlIzOSAKprUF0FsgmV1oGcDW84W9ICirNwfQ3IrxNIvgL8sqdPVgAjKYow4Dn805c6AujXEaq/JURg/BpgTGdINhbhqSTI10pQEZs78dMY8eEyvXNOqeLcAALZkyoEmGs4JS295hiaik5Qlc+zpwFPxSnNqRZncwVVVDt6+brYFJubt36Jbl5n4j2FBV5pU4cLH1twLmmx2wK4EGX3hKx3xLMB7NASHBvUIstff9tJyM93xLg0tkO36lNfqZa74y67t9zrKgj3i7zcnkQikehAJBLGxU3+3yDMDB/9DOBvUSSAYlvWwSeb0qWlAN1Kjn0AeOXK9+sA/EFXYxHQ4QE0QamjCakraOKyiqYqNTQ9W2Ic2ct/3c/SAwz13v8AAAAASUVORK5CYII=',
        dark: 'A8AAACWBAMAAADzkc/yAAAAMFBMVEXf39/g4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODd3d3g4ODg4ODg4OCqQSsrAAAAD3RSTlMAfz4jFbDN6MCa92kISYKhQsx5AAACzElEQVR4Xp2SQWhTdwDGf01eStskNQGFHTYax876qDg9CH0ejHMMLChIZyFFcHUyiIMq6ipx7LANZcnGLg5KirYO5yEF2XYY2wsUt4IOchgb0UPGxtoxkG51SWOC+fby94Vceul+l/fxvf/3fbzHnw68nGDlzRLQ95jFn+sOBK9BVNNAOEfyZqsIfBeZTFQuA+EX7hBaAALLaxh+GdIoQPTzr1UtAm7tntpWj6YiWbVgdd0mKdmkrkMwU4e7JeDAp2xIGQN7Gx+M3QEOqc0RKMiQICXDZQJZI2Yheu7htoLOAD+CqxwAVnbdAQiu6CgAg+c/YdPseP+KaTmkmt7BfMG+vRqHPVpb/U01h6xmC7MFjXYd/4yfuuT3HHfYLNa20ye3AvwlqfEr9Evz0hNwpTOSFshK0+ZvFKQ5eS5p6YZxXOmWOXNYuu2n/J5vF5+7aJo3onzaXAkOND5MVx2wMlvvhwtTEKoujz06Ng+VmUz1j31uibwzsv6280OON+ivL9A3wS345jX6ZzkFka9KoQk+K0J+fiBHJQYHW14qdB0GZubBuvg8u1NTmK3X21vd9fCxs+YZTEvmTa9mvlQOcJ+CuwakctDXAjIl6Km3xQIMVoHUKPQ2gUoT8v8CIb27rH8AKy+PGBD48/h+YwEMGQvo6QjiMPYTYJVHya/bsEc5KrUifK8SB9NXsdKTDsGlejFZXwQi2fc8E2CpUS8CECzMYUj6jpU+mr0KBJLV4lI79Wpm3At6Pa7f3N36OOGvM/yihw2DatOCkd9t2LVqs9MGGEmwc1hNjAg8BrYYEZ77yAjZ56eeObixZ8I6N7fFpFrTF7xUp6fb3NnqrkuKDUl/b07E4/HE9ng8Roeu8/8KoTz5xRWAV+SRA1LyaEJUvug1YhwGJN1+CejX2QdNACL0NmzAmG9hCOsJhoAUw5DWUwyuahj6OsJaOcF/xpbWAYSClL4AAAAASUVORK5CYII='
      }
    }
  };

  JSColor = {
    bind: function(el) {
      if (!el.color) {
        return el.color = new JSColor.color(el);
      }
    },
    fetchElement: function(mixed) {
      if (typeof mixed === "string") {
        return $.id(mixed);
      } else {
        return mixed;
      }
    },
    fireEvent: function(el, evnt) {
      var ev;
      if (!el) {
        return;
      }
      ev = document.createEvent('HTMLEvents');
      ev.initEvent(evnt, true, true);
      return el.dispatchEvent(ev);
    },
    getRelMousePos: function(e) {
      var x, y;
      if (e == null) {
        e = window.event;
      }
      x = 0;
      y = 0;
      if (typeof e.offsetX === 'number') {
        x = e.offsetX;
        y = e.offsetY;
      } else if (typeof e.layerX === 'number') {
        x = e.layerX;
        y = e.layerY;
      }
      return {
        x: x,
        y: y
      };
    },
    color: function(target) {
      var HSV_RGB, RGB_HSV, THIS, abortBlur, blurTarget, blurValue, drawPicker, holdPad, holdSld, isPickerOwner, leavePad, leaveSld, leaveStyle, leaveValue, redrawPad, redrawSld, removePicker, setPad, setSld, styleElement, valueElement;
      this.hsv = [0, 0, 1];
      this.rgb = [1, 1, 1];
      this.valueElement = this.styleElement = target;
      abortBlur = holdPad = holdSld = false;
      this.hidePicker = function() {
        if (isPickerOwner()) {
          return removePicker();
        }
      };
      this.showPicker = function() {
        if (!isPickerOwner()) {
          return drawPicker();
        }
      };
      this.importColor = function() {
        if (!valueElement) {
          return this.exportColor();
        } else {
          if (!this.fromString(valueElement.value, leaveValue)) {
            styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
            return this.exportColor(leaveValue | leaveStyle);
          }
        }
      };
      this.exportColor = function(flags) {
        var value;
        if (!(flags & leaveValue) && valueElement) {
          value = '#' + this.toString();
          valueElement.value = value;
          valueElement.previousSibling.value = value;
          editTheme[valueElement.previousSibling.name] = value;
          setTimeout(function() {
            return Style.themeCSS.textContent = Style.theme(editTheme);
          });
        }
        if (!(flags & leaveStyle) && styleElement) {
          styleElement.style.backgroundColor = '#' + this.toString();
        }
        if (!(flags & leavePad) && isPickerOwner()) {
          redrawPad();
        }
        if (!(flags & leaveSld) && isPickerOwner()) {
          return redrawSld();
        }
      };
      this.fromHSV = function(h, s, v, flags) {
        this.hsv = [h = h ? $.minmax(h, 0.0, 6.0) : this.hsv[0], s = s ? $.minmax(s, 0.0, 1.0) : this.hsv[1], v = v ? $.minmax(v, 0.0, 1.0) : this.hsv[2]];
        this.rgb = HSV_RGB(h, s, v);
        return this.exportColor(flags);
      };
      this.fromRGB = function(r, g, b, flags) {
        var hsv;
        r = r != null ? $.minmax(r, 0.0, 1.0) : this.rgb[0];
        g = g != null ? $.minmax(g, 0.0, 1.0) : this.rgb[1];
        b = b != null ? $.minmax(b, 0.0, 1.0) : this.rgb[2];
        hsv = RGB_HSV(r, g, b);
        if (hsv[0] != null) {
          this.hsv[0] = $.minmax(hsv[0], 0.0, 6.0);
        }
        if (hsv[2] !== 0) {
          this.hsv[1] = hsv[1] == null ? null : $.minmax(hsv[1], 0.0, 1.0);
        }
        this.hsv[2] = hsv[2] == null ? null : $.minmax(hsv[2], 0.0, 1.0);
        this.rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
        return this.exportColor(flags);
      };
      this.fromString = function(number, flags) {
        var m, val;
        m = number.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
        if (!m) {
          return false;
        } else {
          if (m[1].length === 6) {
            this.fromRGB(parseInt(m[1].substr(0, 2), 16) / 255, parseInt(m[1].substr(2, 2), 16) / 255, parseInt(m[1].substr(4, 2), 16) / 255, flags);
          } else {
            this.fromRGB(parseInt((val = m[1].charAt(0)) + val, 16) / 255, parseInt((val = m[1].charAt(1)) + val, 16) / 255, parseInt((val = m[1].charAt(2)) + val, 16) / 255, flags);
          }
          return true;
        }
      };
      this.toString = function() {
        return (0x100 | Math.round(255 * this.rgb[0])).toString(16).substr(1) + (0x100 | Math.round(255 * this.rgb[1])).toString(16).substr(1) + (0x100 | Math.round(255 * this.rgb[2])).toString(16).substr(1);
      };
      RGB_HSV = function(r, g, b) {
        var h, m, n, v;
        n = (n = r < g ? r : g) < b ? n : b;
        v = (v = r > g ? r : g) > b ? v : b;
        m = v - n;
        if (m === 0) {
          return [null, 0, v];
        }
        h = r === n ? 3 + (b - g) / m : g === n ? 5 + (r - b) / m : 1 + (g - r) / m;
        return [h === 6 ? 0 : h, m / v, v];
      };
      HSV_RGB = function(h, s, v) {
        var f, i, m, n;
        if (h == null) {
          return [v, v, v];
        }
        i = Math.floor(h);
        f = i % 2 ? h - i : 1 - (h - i);
        m = v * (1 - s);
        n = v * (1 - s * f);
        switch (i) {
          case 6:
          case 0:
            return [v, n, m];
          case 1:
            return [n, v, m];
          case 2:
            return [m, v, n];
          case 3:
            return [m, n, v];
          case 4:
            return [n, m, v];
          case 5:
            return [v, m, n];
        }
      };
      removePicker = function() {
        delete JSColor.picker.owner;
        return $.rm(JSColor.picker.boxB);
      };
      drawPicker = function(x, y) {
        var box, boxB, btn, btnS, p, pad, padB, padM, sld, sldB, sldM;
        if (!(p = JSColor.picker)) {
          JSColor.picker = p = {
            box: $.el('div', {
              className: 'jscBox'
            }),
            boxB: $.el('div', {
              className: 'jscBoxB'
            }),
            pad: $.el('div', {
              className: 'jscPad'
            }),
            padB: $.el('div', {
              className: 'jscPadB'
            }),
            padM: $.el('div', {
              className: 'jscPadM'
            }),
            sld: $.el('div', {
              className: 'jscSld'
            }),
            sldB: $.el('div', {
              className: 'jscSldB'
            }),
            sldM: $.el('div', {
              className: 'jscSldM'
            }),
            btn: $.el('div', {
              className: 'jscBtn'
            }),
            btnS: $.el('span', {
              className: 'jscBtnS'
            }),
            btnT: $.tn('Close')
          };
          $.add(p.box, [p.sldB, p.sldM, p.padB, p.padM, p.btn]);
          $.add(p.sldB, p.sld);
          $.add(p.padB, p.pad);
          $.add(p.btnS, p.btnT);
          $.add(p.btn, p.btnS);
          $.add(p.boxB, p.box);
        }
        box = p.box, boxB = p.boxB, btn = p.btn, btnS = p.btnS, pad = p.pad, padB = p.padB, padM = p.padM, sld = p.sld, sldB = p.sldB, sldM = p.sldM;
        box.onmouseup = box.onmouseout = function() {
          return target.focus();
        };
        box.onmousedown = function() {
          return abortBlur = true;
        };
        box.onmousemove = function(e) {
          if (holdPad || holdSld) {
            holdPad && setPad(e);
            holdSld && setSld(e);
            if (d.selection) {
              return d.selection.empty();
            } else if (window.getSelection) {
              return window.getSelection().removeAllRanges();
            }
          }
        };
        padM.onmouseup = padM.onmouseout = function() {
          if (holdPad) {
            holdPad = false;
            return JSColor.fireEvent(valueElement, 'change');
          }
        };
        padM.onmousedown = function(e) {
          if (THIS.hsv[2] === 0) {
            THIS.fromHSV(null, null, 1.0);
          }
          holdPad = true;
          return setPad(e);
        };
        sldM.onmouseup = sldM.onmouseout = function() {
          if (holdSld) {
            holdSld = false;
            return JSColor.fireEvent(valueElement, 'change');
          }
        };
        sldM.onmousedown = function(e) {
          holdSld = true;
          return setSld(e);
        };
        btn.onmousedown = function() {
          return THIS.hidePicker();
        };
        redrawPad();
        redrawSld();
        JSColor.picker.owner = THIS;
        return $.add(ThemeTools.dialog, p.boxB);
      };
      redrawPad = function() {
        var rgb;
        JSColor.picker.padM.style.backgroundPosition = "" + (4 + Math.round((THIS.hsv[0] / 6) * 180)) + "px " + (4 + Math.round((1 - THIS.hsv[1]) * 100)) + "px";
        rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
        JSColor.picker.sld.style.backgroundColor = "rgb(" + (rgb[0] * 100) + "%, " + (rgb[1] * 100) + "%, " + (rgb[2] * 100) + "%)";
      };
      redrawSld = function() {
        return JSColor.picker.sldM.style.backgroundPosition = "0 " + (6 + Math.round((1 - THIS.hsv[2]) * 100)) + "px";
      };
      isPickerOwner = function() {
        return JSColor.picker && JSColor.picker.owner === THIS;
      };
      blurTarget = function() {
        if (valueElement === target) {
          return THIS.importColor();
        }
      };
      blurValue = function() {
        if (valueElement !== target) {
          return THIS.importColor();
        }
      };
      setPad = function(e) {
        var mpos, x, y;
        mpos = JSColor.getRelMousePos(e);
        x = mpos.x - 11;
        y = mpos.y - 11;
        return THIS.fromHSV(x * (1 / 30), 1 - y / 100, null, leaveSld);
      };
      setSld = function(e) {
        var mpos, y;
        mpos = JSColor.getRelMousePos(e);
        y = mpos.y - 9;
        return THIS.fromHSV(null, null, 1 - y / 100, leavePad);
      };
      THIS = this;
      valueElement = JSColor.fetchElement(this.valueElement);
      styleElement = JSColor.fetchElement(this.styleElement);
      leaveValue = 1 << 0;
      leaveStyle = 1 << 1;
      leavePad = 1 << 2;
      leaveSld = 1 << 3;
      $.on(target, 'focus', function() {
        return THIS.showPicker();
      });
      $.on(target, 'blur', function() {
        if (!abortBlur) {
          return window.setTimeout(function() {
            abortBlur || blurTarget();
            return abortBlur = false;
          });
        } else {
          return abortBlur = false;
        }
      });
      if (valueElement) {
        $.on(valueElement, 'keyup input', function() {
          return THIS.fromString(valueElement.value, leaveValue);
        });
        $.on(valueElement, 'blur', blurValue);
        valueElement.setAttribute('autocomplete', 'off');
      }
      if (styleElement) {
        styleElement.jscStyle = {
          backgroundColor: styleElement.style.backgroundColor
        };
      }
      return this.importColor();
    }
  };

  MascotTools = {
    init: function(mascot) {
      var el, filters, location, position;
      if (mascot == null) {
        mascot = Conf[g.MASCOTSTRING][Math.floor(Math.random() * Conf[g.MASCOTSTRING].length)];
      }
      Conf['mascot'] = mascot;
      this.el = el = $('#mascot img', d.body);
      if (!Conf['Mascots'] || (g.CATALOG && Conf['Hide Mascots on Catalog'])) {
        if (el) {
          return el.src = "";
        } else {
          return null;
        }
      }
      position = "" + (Conf['Mascot Position'] === 'bottom' || !(Conf['Mascot Position'] === "default" && Conf['Post Form Style'] === "fixed") ? 0 + ((!g.REPLY || Conf['Boards Navigation'] === 'sticky bottom') && Conf['4chan SS Navigation'] ? 2 : 0) : 20.5 + (!g.REPLY || !!$('#postForm input[name=spoiler]') ? 1.4 : 0) + (Conf['Show Post Form Header'] ? 1.7 : 0) + (Conf['Post Form Decorations'] ? 0.2 : 0)) + "em";
      if (Conf['editMode']) {
        if (!(mascot = editMascot || (mascot = Mascots[Conf["mascot"]]))) {
          return;
        }
      } else {
        if (!Conf["mascot"]) {
          if (el) {
            return el.src = "";
          } else {
            return null;
          }
        }
        if (!(mascot = Mascots[Conf["mascot"]])) {
          Conf[g.MASCOTSTRING].remove(Conf["mascot"]);
          return this.init();
        }
        this.addMascot(mascot);
      }
      if (Conf["Sidebar Location"] === 'left') {
        if (Conf["Mascot Location"] === "sidebar") {
          location = 'left';
        } else {
          location = 'right';
        }
      } else if (Conf["Mascot Location"] === "sidebar") {
        location = 'right';
      } else {
        location = 'left';
      }
      filters = [];
      if (Conf["Grayscale Mascots"]) {
        filters.push('<feColorMatrix id="color" type="saturate" values="0" />');
      }
      return Style.mascot.textContent = "#mascot img {\n  position: fixed;\n  z-index: " + (Conf['Mascots Overlap Posts'] ? '3' : '-1') + ";\n  bottom: " + (mascot.position === 'top' ? 'auto' : (mascot.position === 'bottom' && Conf['Mascot Position'] === 'default') || !$.id('postForm') ? '0' : position) + ";\n  " + location + ": " + ((mascot.hOffset || 0) + (Conf['Sidebar'] === 'large' && mascot.center ? 25 : 0)) + "px;\n  top: " + (mascot.position === 'top' ? '0' : 'auto') + ";\n  height: " + (mascot.height && isNaN(parseFloat(mascot.height)) ? mascot.height : mascot.height ? parseInt(mascot.height, 10) + 'px' : 'auto') + ";\n  width: " + (mascot.width && isNaN(parseFloat(mascot.width)) ? mascot.width : mascot.width ? parseInt(mascot.width, 10) + 'px' : 'auto') + ";\n  margin-" + location + ": " + (mascot.hOffset || 0) + "px;\n  margin-bottom: " + (mascot.vOffset || 0) + "px;\n  opacity: " + Conf['Mascot Opacity'] + ";\n  pointer-events: none;\n  " + (filters.length > 0 ? "filter: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"filters\">" + filters.join("") + "</filter></svg>#filters');" : "") + "\n}";
    },
    categories: ['Anime', 'Ponies', 'Questionable', 'Silhouette', 'Western'],
    dialog: function(key) {
      var dialog, div, fileInput, input, item, layout, name, option, optionHTML, setting, value, _i, _len, _ref;
      Conf['editMode'] = 'mascot';
      if (Mascots[key]) {
        editMascot = JSON.parse(JSON.stringify(Mascots[key]));
      } else {
        editMascot = {};
      }
      editMascot.name = key || '';
      MascotTools.addMascot(editMascot);
      Style.addStyle();
      layout = {
        name: ["Mascot Name", "", "The name of the Mascot", "text"],
        image: ["Image", "", "Image of Mascot. Accepts Base64 as well as URLs. Shift+Click field to upload.", "text"],
        category: ["Category", MascotTools.categories[0], "A general categorization of the mascot.", "select", MascotTools.categories],
        position: ["Position", "default", "Where the mascot is anchored in the Sidebar. The default option places the mascot above the Post Form or on the bottom of the page, depending on the Post Form setting.", "select", ["default", "top", "bottom"]],
        height: ["Height", "auto", "This value is used for manually setting a height for the mascot.", "text"],
        width: ["Width", "auto", "This value is used for manually setting a width for the mascot.", "text"],
        vOffset: ["Vertical Offset", "0", "This value moves the mascot vertically away from the anchor point.", "number"],
        hOffset: ["Horizontal Offset", "0", "This value moves the mascot further away from the edge of the screen, in pixels.", "number"],
        center: ["Center Mascot", false, "If this is enabled, Appchan X will attempt to pad the mascot with 25 pixels of Horizontal Offset when the \"Sidebar Setting\" is set to \"large\" in an attempt to \"re-center\" the mascot. If you are having problems placing your mascot properly, ensure this is not enabled.", "checkbox"]
      };
      dialog = $.el("div", {
        id: "mascotConf",
        className: "reply dialog",
        innerHTML: "<div id=mascotbar></div><hr><div id=mascotcontent></div><div id=save>  <a href='javascript:;'>Save Mascot</a></div><div id=close>  <a href='javascript:;'>Close</a></div>"
      });
      for (name in layout) {
        item = layout[name];
        switch (item[3]) {
          case "text":
            div = this.input(item, name);
            input = $('input', div);
            if (name === 'image') {
              $.on(input, 'blur', function() {
                editMascot[this.name] = this.value;
                MascotTools.addMascot(editMascot);
                return Style.addStyle();
              });
              fileInput = $.el('input', {
                type: "file",
                accept: "image/*",
                title: "imagefile",
                hidden: "hidden"
              });
              $.on(input, 'click', function(evt) {
                if (evt.shiftKey) {
                  return this.nextSibling.click();
                }
              });
              $.on(fileInput, 'change', function(evt) {
                return MascotTools.uploadImage(evt, this);
              });
              $.after(input, fileInput);
            }
            if (name === 'name') {
              $.on(input, 'blur', function() {
                this.value = this.value.replace(/[^a-z-_0-9]/ig, "_");
                if (!/^[a-z]/i.test(this.value)) {
                  return alert("Mascot names must start with a letter.");
                }
                editMascot[this.name] = this.value;
                MascotTools.addMascot(editMascot);
                return Style.addStyle();
              });
            } else {
              $.on(input, 'blur', function() {
                editMascot[this.name] = this.value;
                MascotTools.addMascot(editMascot);
                return Style.addStyle();
              });
            }
            break;
          case "number":
            div = this.input(item, name);
            $.on($('input', div), 'blur', function() {
              editMascot[this.name] = parseInt(this.value);
              MascotTools.addMascot(editMascot);
              return Style.addStyle();
            });
            break;
          case "select":
            value = editMascot[name] || item[1];
            optionHTML = "<h2>" + item[0] + "</h2><span class=description>" + item[2] + "</span><div class=option><select name='" + name + "' value='" + value + "'><br>";
            _ref = item[4];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              option = _ref[_i];
              optionHTML = optionHTML + ("<option value=\"" + option + "\">" + option + "</option>");
            }
            optionHTML = optionHTML + "</select>";
            div = $.el('div', {
              className: "mascotvar",
              innerHTML: optionHTML
            });
            setting = $("select", div);
            setting.value = value;
            $.on($('select', div), 'change', function() {
              editMascot[this.name] = this.value;
              MascotTools.addMascot(editMascot);
              return Style.addStyle();
            });
            break;
          case "checkbox":
            value = editMascot[name] || item[1];
            div = $.el("div", {
              className: "mascotvar",
              innerHTML: "<h2><label><input type=" + item[3] + " class=field name='" + name + "' " + (value ? 'checked' : void 0) + ">" + item[0] + "</label></h2><span class=description>" + item[2] + "</span>"
            });
            $.on($('input', div), 'click', function() {
              editMascot[this.name] = this.checked ? true : false;
              MascotTools.addMascot(editMascot);
              return Style.addStyle();
            });
        }
        $.add($("#mascotcontent", dialog), div);
      }
      $.on($('#save > a', dialog), 'click', function() {
        return MascotTools.save(editMascot);
      });
      $.on($('#close > a', dialog), 'click', MascotTools.close);
      Style.rice(dialog);
      return $.add(d.body, dialog);
    },
    input: function(item, name) {
      var div, value;
      if (Array.isArray(editMascot[name])) {
        if (Style.lightTheme) {
          value = editMascot[name][1];
        } else {
          value = editMascot[name][0];
        }
      } else {
        value = editMascot[name] || item[1];
      }
      editMascot[name] = value;
      div = $.el("div", {
        className: "mascotvar",
        innerHTML: "<h2>" + item[0] + "</h2><span class=description>" + item[2] + "</span><div class=option><input type=" + item[3] + " class=field name='" + name + "' placeholder='" + item[0] + "' value='" + value + "'></div>"
      });
      return div;
    },
    uploadImage: function(evt, el) {
      var file, reader;
      file = evt.target.files[0];
      reader = new FileReader();
      reader.onload = function(evt) {
        var val;
        val = evt.target.result;
        el.previousSibling.value = val;
        editMascot.image = val;
        return Style.addStyle();
      };
      return reader.readAsDataURL(file);
    },
    addMascot: function(mascot) {
      var el;
      if (el = this.el) {
        return el.src = Array.isArray(mascot.image) ? (Style.lightTheme ? mascot.image[1] : mascot.image[0]) : mascot.image;
      } else {
        this.el = el = $.el('div', {
          id: "mascot",
          innerHTML: "<img src='" + (Array.isArray(mascot.image) ? (Style.lightTheme ? mascot.image[1] : mascot.image[0]) : mascot.image) + "'>"
        });
        return $.add(d.body, el);
      }
    },
    save: function(mascot) {
      var image, name, type, userMascots, _i, _len, _ref;
      name = mascot.name, image = mascot.image;
      if (!(name != null) || name === "") {
        alert("Please name your mascot.");
        return;
      }
      if (!(image != null) || image === "") {
        alert("Your mascot must contain an image.");
        return;
      }
      if (!mascot.category) {
        mascot.category = MascotTools.categories[0];
      }
      if (Mascots[name]) {
        if (Conf["Deleted Mascots"].contains(name)) {
          Conf["Deleted Mascots"].remove(name);
          $.set("Deleted Mascots", Conf["Deleted Mascots"]);
        } else {
          if (confirm("A mascot named \"" + name + "\" already exists. Would you like to over-write?")) {
            delete Mascots[name];
          } else {
            return alert("Creation of \"" + name + "\" aborted.");
          }
        }
      }
      _ref = ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        if (!Conf[type].contains(name)) {
          Conf[type].push(name);
          $.set(type, Conf[type]);
        }
      }
      Mascots[name] = JSON.parse(JSON.stringify(mascot));
      Conf["mascot"] = name;
      delete Mascots[name].name;
      userMascots = $.get("userMascots", {});
      userMascots[name] = Mascots[name];
      $.set('userMascots', userMascots);
      return alert("Mascot \"" + name + "\" saved.");
    },
    close: function() {
      Conf['editMode'] = false;
      editMascot = {};
      $.rm($("#mascotConf", d.body));
      Style.addStyle();
      return Options.dialog("mascot");
    },
    importMascot: function(evt) {
      var file, reader;
      file = evt.target.files[0];
      reader = new FileReader();
      reader.onload = function(e) {
        var imported, name, userMascots;
        try {
          imported = JSON.parse(e.target.result);
        } catch (err) {
          alert(err);
          return;
        }
        if (!imported["Mascot"]) {
          alert("Mascot file is invalid.");
        }
        name = imported["Mascot"];
        delete imported["Mascot"];
        if (Mascots[name] && !Conf["Deleted Mascots"].remove(name)) {
          if (!confirm("A mascot with this name already exists. Would you like to over-write?")) {
            return;
          }
        }
        Mascots[name] = imported;
        userMascots = $.get("userMascots", {});
        userMascots[name] = Mascots[name];
        $.set('userMascots', userMascots);
        alert("Mascot \"" + name + "\" imported!");
        $.rm($("#mascotContainer", d.body));
        return Options.mascotTab.dialog();
      };
      return reader.readAsText(file);
    }
  };

  Mascots = {
    'Akiyama_Mio': {
      category: 'Anime',
      image: 'https://i.minus.com/ibrWLbKvjRnHZS.png'
    },
    'Akiyama_Mio_2': {
      category: 'Anime',
      image: 'https://i.minus.com/ibmZgHvl3ZSxYk.png'
    },
    'Akiyama_Mio_3': {
      category: 'Anime',
      image: 'https://i.minus.com/irFbpefCFt1cT.png',
      center: true
    },
    'Akiyama_Mio_sitting': {
      category: 'Questionable',
      image: 'https://i.minus.com/ibnnAPmolhTfE7.png'
    },
    'Anime_Girl_in_Bondage': {
      category: 'Questionable',
      image: 'https://i.minus.com/ibbfIrZEoNLmiU.png',
      center: true
    },
    'Anime_Girl_in_Bondage_2': {
      category: 'Questionable',
      image: 'http://i.minus.com/iGRED5sHh4RMs.png',
      center: true
    },
    'Applejack': {
      category: 'Ponies',
      image: 'https://i.minus.com/inZ8jSVsEhfnC.png',
      center: true
    },
    'Asuka_Langley_Soryu': {
      category: 'Anime',
      image: 'https://i.minus.com/ib2z9ME9QKEBaS.png',
      center: true
    },
    'Asuka_Langley_Soryu_2': {
      category: 'Anime',
      image: 'https://i.minus.com/iI3QR5SywNfg9.png',
      center: true
    },
    'Asuka_Langley_Soryu_3': {
      category: 'Anime',
      image: 'https://i.minus.com/ibwjj4dLtiADla.png',
      center: true
    },
    'Asuka_Langley_Soryu_4': {
      category: 'Anime',
      image: 'https://i.minus.com/ibiiInQGLGnYNj.png',
      center: true
    },
    'Asuka_Langley_Soryu_5': {
      category: 'Questionable',
      image: 'https://i.minus.com/iJq4VXY1Gw8ZE.png',
      center: true
    },
    'Asuka_Langley_Soryu_6': {
      category: 'Anime',
      image: 'https://i.minus.com/ibzbnBcaEtoqck.png',
      position: 'bottom'
    },
    'Ayanami_Rei': {
      category: 'Anime',
      image: 'https://i.minus.com/ib0ft5OmqRZx2r.png',
      center: true
    },
    'Ayase_Yue': {
      category: 'Questionable',
      image: 'https://i.minus.com/ign5fGOZWTx5o.png'
    },
    'Ayase': {
      category: 'Anime',
      image: 'https://i.minus.com/ibmArq5Wb4Po4v.png',
      center: true
    },
    'Ayase_2': {
      category: 'Questionable',
      image: 'https://i.minus.com/ibjUbDLSU5pwhK.png',
      center: true
    },
    'BLACK_ROCK_SHOOTER': {
      category: 'Anime',
      image: 'https://i.minus.com/ibMe9MrTMdvAT.png',
      center: true
    },
    'Blue_Rose': {
      category: 'Questionable',
      image: 'https://i.minus.com/ibiq1joMemfzeM.png',
      center: true
    },
    'Brioche_d_Arquien': {
      category: 'Anime',
      image: 'https://i.minus.com/ibobXYJ2k3JXK.png',
      center: true
    },
    'CC': {
      category: 'Anime',
      image: 'https://i.minus.com/iwndO4Pn6SO0X.png',
      center: true
    },
    'CC2': {
      category: 'Questionable',
      image: 'https://i.minus.com/iVT3TjJ7lBRpl.png',
      center: true
    },
    'Chie': {
      category: 'Anime',
      image: 'https://i.minus.com/ib0HI16h9FSjSp.png',
      center: true
    },
    'Cirno': {
      category: 'Questionable',
      image: 'https://i.minus.com/ibffjW5v0zrSGa.png',
      center: true
    },
    'Cirno_2': {
      category: 'Anime',
      image: 'https://i.minus.com/iSZ06ZxrcqAKq.png',
      center: true
    },
    'Dawn_Hikari': {
      category: 'Anime',
      image: 'https://i.minus.com/iL3J1EmcDkFzE.png',
      center: true
    },
    'Doppleganger': {
      category: 'Anime',
      image: 'https://i.minus.com/iPvv86W9r3Rxm.png'
    },
    'Dragonkid': {
      category: 'Anime',
      image: 'https://i.minus.com/iq9fuyWSjIDWf.png',
      center: true
    },
    'Dragonkid_2': {
      category: 'Anime',
      image: 'https://i.minus.com/i7sdxK3G12RB6.png',
      center: true
    },
    'Eclair': {
      category: 'Anime',
      image: 'https://i.minus.com/ibsk5mMYVR5zuA.png',
      center: true
    },
    'Erio_Touwa': {
      category: 'Questionable',
      image: 'https://i.minus.com/in8bF152Y9qVB.png'
    },
    'Evangeline_AK_McDowell': {
      category: 'Anime',
      image: 'https://i.minus.com/ibuq7a8zWKi2gl.png',
      center: true
    },
    'Fluttershy': {
      category: 'Ponies',
      image: 'https://i.minus.com/ibwEFEGlRm0Uxy.png'
    },
    'Fluttershy_2': {
      category: 'Ponies',
      image: 'https://i.minus.com/ibjtz6EU2OFPgh.png',
      center: true
    },
    'Fluttershy_Cutiemark': {
      category: 'Ponies',
      image: 'https://i.minus.com/i5WVpIAlHQdhs.png',
      center: true
    },
    'Fujiwara_no_Mokou': {
      category: 'Anime',
      image: 'https://i.minus.com/ibpwDyMGodvni6.png'
    },
    'Furudo_Erika': {
      category: 'Anime',
      image: 'https://i.minus.com/iCrRzQ8WvHiSM.png',
      center: true
    },
    'Gally': {
      category: 'Anime',
      image: 'https://i.minus.com/iblWZGuSlWtDI6.png',
      center: true
    },
    'Gasai_Yuno': {
      category: 'Anime',
      image: 'https://i.minus.com/iEQsK6K85jX2n.png'
    },
    'Gasai_Yuno_2': {
      category: 'Questionable',
      image: 'https://i.minus.com/ifyPk7Yeo1JA7.png'
    },
    'George_Costanza': {
      category: 'Western',
      image: 'https://i.minus.com/iFWdpFGfzLs6v.png'
    },
    'Hanako': {
      category: 'Anime',
      image: 'https://i.minus.com/iRLF8gCIZbGjo.png',
      center: true
    },
    'Hasekura_Youko': {
      category: 'Anime',
      image: 'https://i.minus.com/iqBTFZf5UhLpR.png',
      center: true
    },
    'Hatsune_Miku': {
      category: 'Questionable',
      image: 'https://i.minus.com/iHuUwYVywpp3Z.png'
    },
    'Hatsune_Miku_2': {
      category: 'Questionable',
      image: 'https://i.minus.com/iclhgYeHDD77I.png',
      center: true
    },
    'Hatsune_Miku_3': {
      category: 'Anime',
      image: 'https://i.minus.com/iLJ4uDTcg1T8r.png',
      center: true
    },
    'Hatsune_Miku_4': {
      category: 'Anime',
      image: 'https://i.minus.com/ibjkPMLT8Uxitp.png',
      center: true
    },
    'Hatsune_Miku_5': {
      category: 'Anime',
      image: 'https://i.minus.com/i9Evu9dyvok4G.png',
      center: true
    },
    'Hatsune_Miku_6': {
      category: 'Questionable',
      image: 'https://i.minus.com/iQzx9fPFgPUNl.png',
      center: true
    },
    'Hatsune_Miku_7': {
      category: 'Questionable',
      image: 'https://i.minus.com/iDScshaEZqUuy.png',
      center: true
    },
    'Hirasawa_Yui': {
      category: 'Anime',
      image: 'https://i.minus.com/iuGe5uDaTNmhR.png',
      center: true
    },
    'Homura_Akemi': {
      category: 'Anime',
      image: 'https://i.minus.com/iPtrwFEEtPLhn.png'
    },
    'Horo': {
      category: 'Silhouette',
      image: ['https://i.minus.com/i429JguITUibN.png', 'https://i.minus.com/icpvfMuZEQCtS.png']
    },
    'Horo_2': {
      category: 'Silhouette',
      image: ['https://i.minus.com/ibv270koIdRjm7.png', 'https://i.minus.com/iPM4lDD53yB5n.png']
    },
    'Horo_3': {
      category: 'Questionable',
      image: 'http://i.minus.com/ibyT9dlTe1HN5P.png'
    },
    'Horo_4': {
      category: 'Questionable',
      image: 'http://i.minus.com/ibbMKiznORGJ00.png'
    },
    'Ika_Musume': {
      category: 'Anime',
      image: 'https://i.minus.com/ibqVu5GNfKx5bC.png',
      center: true
    },
    'Ika_Musume_2': {
      category: 'Anime',
      image: 'https://i.minus.com/ibhnEiE8HabEqC.png',
      center: true
    },
    'Ika_Musume_3': {
      category: 'Questionable',
      image: 'https://i.minus.com/iby8LyjXffukaI.png',
      center: true
    },
    'Inori': {
      category: 'Questionable',
      image: 'https://i.minus.com/ibpHKNPxcFqRxs.png'
    },
    'Inori_2': {
      category: 'Questionable',
      image: 'https://i.minus.com/ibzM531DBaHYXD.png'
    },
    'Iwakura_Lain': {
      category: 'Anime',
      image: 'https://i.minus.com/iBXRRT19scoHf.png',
      center: true
    },
    'Iwakura_Lain_2': {
      category: 'Anime',
      image: 'https://i.minus.com/ioMltWNYUWeJ3.png',
      center: true
    },
    'KOn_Girls': {
      category: 'Anime',
      image: 'https://i.minus.com/ibndVLiH09uINs.png',
      center: true
    },
    'Kagamine_Rin': {
      category: 'Questionable',
      image: 'https://i.minus.com/iVPKJeDXKPKeV.png',
      center: true
    },
    'Kagamine_Rin_2': {
      category: 'Anime',
      image: 'https://i.minus.com/jbkL01TIeJwEN6.png'
    },
    'Kagari_Izuriha': {
      category: 'Anime',
      image: 'https://i.minus.com/ihaFHsvFfL0vH.png'
    },
    'Kaname_Madoka': {
      category: 'Anime',
      image: 'https://i.minus.com/iRuEFK8cdAHxB.png',
      center: true
    },
    'Karina': {
      category: 'Anime',
      image: 'https://i.minus.com/iUADBOpQYPfeP.png',
      center: true
    },
    'Kigurumi_Harokitei': {
      category: 'Anime',
      image: 'https://i.minus.com/ibb17W5i3rQvut.png',
      center: true
    },
    'Kinomoto_Sakura': {
      category: 'Anime',
      image: 'https://i.minus.com/iVmsLKa4zLwZR.png',
      center: true
    },
    'Kinomoto_Sakura_2': {
      category: 'Questionable',
      image: 'https://i.minus.com/ibklztjz3Ua747.png',
      center: true
    },
    'Kirisame_Marisa': {
      category: 'Anime',
      image: 'https://i.minus.com/ibikDZH5CZ0V30.png'
    },
    'Kirino_Kosaka_and_Ruri_Goko': {
      category: 'Questionable',
      image: 'https://i.minus.com/isIzggtfUo4ql.png',
      center: true
    },
    'Koiwai_Yotsuba': {
      category: 'Anime',
      image: 'https://i.minus.com/iKFKyVVBato2N.png',
      center: true
    },
    'Koko': {
      category: 'Anime',
      image: 'https://i.minus.com/ieVyNMSjXpBs2.png',
      center: true
    },
    'Konjiki_no_Yami': {
      category: 'Questionable',
      image: 'https://i.minus.com/imy7iv5fuym8b.png',
      position: 'bottom'
    },
    'Kotobuki_Tsumugi': {
      category: 'Anime',
      image: 'https://i.minus.com/i6doAUnM6jMAY.png',
      center: true
    },
    'Kurisu_Makise': {
      category: 'Anime',
      image: 'https://i.minus.com/ib1eMtRHdvc9ix.png'
    },
    'Kuroko_Shirai': {
      category: 'Anime',
      image: 'https://i.minus.com/i3K8F7lu2SHfn.png'
    },
    'Kyouko_Sakura': {
      category: 'Anime',
      image: 'https://i.minus.com/iMrFOS1mfzIJP.png',
      center: true
    },
    'Kyubee': {
      category: 'Anime',
      image: 'https://i.minus.com/iD0SEJPeZa0Dw.png'
    },
    'Kyubee_2': {
      category: 'Anime',
      image: 'https://i.minus.com/iGlKiDZvM3xi8.png',
      center: true
    },
    'Leonmitchelli': {
      category: 'Questionable',
      image: 'https://i.minus.com/ibgUFGlOpedfbs.png',
      center: true
    },
    'Li_Syaoran': {
      category: 'Anime',
      image: 'https://i.minus.com/ib0IWPBRSHyiDe.png'
    },
    'Link': {
      category: 'Anime',
      image: 'https://i.minus.com/ibd1JShAMTdJBH.png',
      center: true
    },
    'Lizardgirl': {
      category: 'Anime',
      image: 'https://i.minus.com/is7h27Q6lsmyx.png'
    },
    'Luka': {
      category: 'Anime',
      image: 'https://i.minus.com/inds5h2BOmVBy.png'
    },
    'Madotsuki': {
      category: 'Anime',
      image: 'https://i.minus.com/ik6QYfTfgx9Za.png'
    },
    'Makoto': {
      category: 'Anime',
      image: 'https://i.minus.com/i7q6aOuUqqA9F.png',
      center: true
    },
    'Mantis': {
      category: 'Anime',
      image: 'https://i.minus.com/iBmluUJOZivY2.png'
    },
    'Megurine_Luka': {
      category: 'Anime',
      image: 'https://i.minus.com/ibxe63yidpz9Gz.png',
      center: true
    },
    'Mei_Sunohara': {
      category: 'Anime',
      image: 'https://i.minus.com/i7ElzNY4xQHHz.png',
      center: true
    },
    'Millefiori': {
      category: 'Anime',
      image: 'https://i.minus.com/ifVzPtH8JHXjl.png',
      center: true
    },
    'Millefiori_2': {
      category: 'Anime',
      image: 'https://i.minus.com/iMSUiQxRBylQG.png',
      center: true
    },
    'Millefiori_3': {
      category: 'Anime',
      image: 'https://i.minus.com/iDOe3ltSvOYXZ.png',
      center: true
    },
    'Misaki_Mei': {
      category: 'Anime',
      image: 'https://i.minus.com/icmYGJ9vIOFjr.png',
      center: true
    },
    'Mizunashi_Akari': {
      category: 'Anime',
      image: 'https://i.minus.com/iNy9kHlNsUoVK.png',
      center: true
    },
    'Motoko': {
      category: 'Anime',
      image: 'https://i.minus.com/irFtkWWyMChSA.png',
      center: true
    },
    'Nagato_Yuki': {
      category: 'Anime',
      image: 'https://i.minus.com/it3pEawWIxY84.png',
      center: true
    },
    'Nagato_Yuki_2': {
      category: 'Anime',
      image: 'https://i.minus.com/iuspcZbLvmqpb.png',
      center: true
    },
    'Nagato_Yuki_3': {
      category: 'Anime',
      image: 'https://i.minus.com/ibndIkldw4njbD.png',
      center: true
    },
    'Nagato_Yuki_4': {
      category: 'Questionable',
      image: 'https://i.minus.com/i92tUr90OVZGD.png',
      center: true
    },
    'Nagato_Yuki_5': {
      category: 'Silhouette',
      image: ['https://i.minus.com/iW0iHUkHwu44d.png', 'https://i.minus.com/i859zL9JXZLbD.png'],
      center: true
    },
    'Nagato_Yuki_6': {
      category: 'Silhouette',
      image: ['https://i.minus.com/iJdxNEMekrQjp.png', 'https://i.minus.com/ibbHeuocMgN5Eu.png'],
      center: true
    },
    'Nagato_Yuki_7': {
      category: 'Questionable',
      image: 'http://i.minus.com/iFQQPEaC3aEV7.png'
    },
    'Nakano_Azusa': {
      category: 'Anime',
      image: 'https://i.minus.com/iiptfoMlr4v1k.png'
    },
    'Nodoka_Miyazaki': {
      category: 'Questionable',
      image: 'http://i.minus.com/iDX5mImKBzrXK.png'
    },
    'Nichijou': {
      category: 'Anime',
      image: 'https://i.minus.com/iE8lbZ5f3OT2B.png'
    },
    'Noir_VinoCacao': {
      category: 'Anime',
      image: 'https://i.minus.com/ibo8aCWF0OwNwP.png',
      center: true
    },
    'Pinkie_Pie': {
      category: 'Ponies',
      image: 'https://i.minus.com/ib1kcpqxvsyZWG.png',
      center: true
    },
    'Pinkie_Pie_2': {
      category: 'Ponies',
      image: 'https://i.minus.com/i8QRRgE7iKpw7.png',
      center: true
    },
    'Oshino_Shinobu': {
      category: 'Anime',
      image: 'https://i.minus.com/ibwhAyR6D7OBAB.png'
    },
    'Oshino_Shinobu_2': {
      category: 'Anime',
      image: 'https://i.minus.com/ibqoNiWzynsVvg.png',
      position: 'bottom'
    },
    'Patchouli_Knowledge': {
      category: 'Anime',
      image: 'https://i.minus.com/ibnOEAxXaKlctB.png',
      center: true
    },
    'Patchouli_Knowledge_2': {
      category: 'Anime',
      image: 'https://i.minus.com/i1MOPTmohOsMD.png'
    },
    'Pink_Doggy': {
      category: 'Anime',
      image: 'https://i.minus.com/i1SpWAzfcIEQc.png',
      center: true
    },
    'Pink_Hair': {
      category: 'Anime',
      image: 'https://i.minus.com/ibdwMaIPwdscao.png',
      center: true
    },
    'Pixie': {
      category: 'Questionable',
      image: 'https://i.minus.com/ipRzX1YsTyhgZ.png',
      center: true
    },
    'Railgun': {
      category: 'Questionable',
      image: 'https://i.minus.com/iysolfmvz6WKs.png',
      center: true
    },
    'Railgun_2': {
      category: 'Anime',
      image: 'https://i.minus.com/iNhpDDO0GSTeM.png',
      center: true
    },
    'Railgun_3': {
      category: 'Anime',
      image: 'https://i.minus.com/iiW02dmqUwRcy.png'
    },
    'Railgun_4': {
      category: 'Anime',
      image: 'https://i.minus.com/iR3j0mGgd1927.png',
      center: true
    },
    'Rainbow_Dash': {
      category: 'Ponies',
      image: 'https://i.minus.com/ibthr5EDMZHV9j.png',
      center: true
    },
    'Rarity': {
      category: 'Ponies',
      image: 'https://i.minus.com/ibkraGhhUh25CU.png',
      center: true
    },
    'Revi': {
      category: 'Anime',
      image: 'https://i.minus.com/ivUMKcy5ow6Ab.png',
      position: 'bottom',
      center: true
    },
    'Ruri_Gokou': {
      category: 'Anime',
      image: 'https://i.minus.com/ibtZo1fdOk8NCB.png',
      position: 'bottom',
      center: true
    },
    'Ryuu': {
      category: 'Anime',
      image: 'https://i.minus.com/iecVz4p2SuqK4.png',
      position: 'bottom'
    },
    'Saber': {
      category: 'Questionable',
      image: 'https://i.minus.com/i62cv3csQaqgk.png',
      center: true
    },
    'Sakurazaki_Setsuna': {
      category: 'Questionable',
      image: 'https://i.minus.com/iHS6559NMU1tS.png'
    },
    'Samus_Aran': {
      category: 'Anime',
      image: 'https://i.minus.com/iWG1GFJ89A05p.png',
      center: true
    },
    'Samus_Aran_2': {
      category: 'Anime',
      image: 'http://i.minus.com/ibl4efsNtHpkXg.png'
    },
    'Seraphim': {
      category: 'Questionable',
      image: 'https://i.minus.com/ivHaKIFHRpPFP.png',
      center: true
    },
    'Shana': {
      category: 'Anime',
      image: 'https://i.minus.com/ib2cTJMF0cYIde.png',
      center: true
    },
    'Shana_2': {
      category: 'Anime',
      image: 'https://i.minus.com/ioRICGu0Ipzj9.png',
      center: true
    },
    'Shiki': {
      category: 'Anime',
      image: 'https://i.minus.com/iIZm1JxxDIDQ1.png'
    },
    'Shinji_and_Girls': {
      category: 'Anime',
      image: 'https://i.minus.com/itMrEn56GzvzE.png',
      center: true
    },
    'Shinonome_Hakase': {
      category: 'Anime',
      image: 'https://i.minus.com/iocCwDCnNgI19.png',
      center: true
    },
    'Shirakiin_Ririchiyo': {
      category: 'Anime',
      image: 'https://i.minus.com/i1m0rdzmVLYLa.png',
      position: 'bottom',
      center: true
    },
    'Shirohibe': {
      category: 'Anime',
      image: 'https://i.minus.com/iGu91k3KZeg00.png',
      position: 'bottom'
    },
    'Suruga_Kanbaru': {
      category: 'Anime',
      image: 'https://i.minus.com/irEL7AgC80qKD.png',
      center: true
    },
    'Suzumiya_Haruhi': {
      category: 'Anime',
      image: 'https://i.minus.com/iM9qMfUNh9Qi9.png',
      center: true
    },
    'Suzumiya_Haruhi_2': {
      category: 'Anime',
      image: 'https://i.minus.com/ibnomd5iasjceY.png',
      center: true
    },
    'Tardis': {
      category: 'Western',
      image: 'https://i.minus.com/iQL2bwpDfOgk.png',
      center: true
    },
    'Teletha_Tessa_Testarossa': {
      category: 'Questionable',
      image: 'https://i.minus.com/iQKrg7Pq7Y6Ed.png'
    },
    'Rukia_Nia_and_Asa': {
      category: 'Questionable',
      image: 'http://i.minus.com/icECBJR5D5U4S.png'
    },
    'Tewi_Inaba': {
      category: 'Anime',
      image: 'https://i.minus.com/ib2k9lwQIkmb66.png'
    },
    'Tifa': {
      category: 'Questionable',
      image: 'https://i.minus.com/inDzKQ0Wck4ef.png',
      center: true
    },
    'Tomozo_Kaoru': {
      category: 'Anime',
      image: 'https://i.minus.com/islUcBaPRYAgv.png',
      center: true
    },
    'Twilight_Sparkle': {
      category: 'Ponies',
      image: 'https://i.minus.com/ibnMYVTZEykrKU.png',
      center: true
    },
    'Udine': {
      category: 'Questionable',
      image: 'https://i.minus.com/iiycujRmhn6QK.png',
      position: 'bottom'
    },
    'Wanwan': {
      category: 'Questionable',
      image: 'https://i.minus.com/iTdBWYMCXULLT.png',
      center: true
    },
    'White_Curious': {
      category: 'Anime',
      image: 'https://i.minus.com/ibfkj5osu99axe.png',
      center: true
    },
    'Yakumo_Ran': {
      category: 'Anime',
      image: 'https://i.minus.com/ivKqn8vL9A8cQ.png'
    },
    'Yin': {
      category: 'Anime',
      image: 'https://i.minus.com/iL9DlVtaAGFdq.png'
    },
    'Yin_2': {
      category: 'Anime',
      image: 'https://i.minus.com/izkTpyjr1XlLR.png',
      center: true
    },
    'Yoko_Littner': {
      category: 'Questionable',
      image: 'https://i.minus.com/i0mtOEsBC9GlY.png'
    },
    'Yoko_Littner_2': {
      category: 'Anime',
      image: 'https://i.minus.com/i7aUDY4h9uB1T.png',
      center: true
    },
    'Yoko_Littner_3': {
      category: 'Anime',
      image: 'https://i.minus.com/iYVd5DhCmB7VJ.png',
      center: true
    },
    'Yozora_Mikazuki': {
      category: 'Anime',
      image: 'https://i.minus.com/iIFEsDzoDALQd.png'
    },
    'Yuzuki_Yukari': {
      category: 'Anime',
      image: 'https://i.minus.com/iYQOz0iGM9ygq.png',
      center: true
    },
    'Yukkikaze': {
      category: 'Anime',
      image: 'https://i.minus.com/ioQJAnyXebHDJ.png',
      center: true
    },
    'Yukkihaze_2': {
      category: 'Anime',
      image: 'https://i.minus.com/inpgaDlJtZ9Sc.png',
      center: true
    }
  };

  Style = {
    init: function() {
      Style.setup();
      return $.ready(function() {
        var catalogLink;
        Style.rice(d.body);
        if (!$.id('navtopright')) {
          return;
        }
        Style.banner();
        Style.trimGlobalMessage();
        Style.padding.nav = $("#boardNavDesktop", d.body);
        Style.padding.pages = $(".pagelist", d.body);
        Style.padding();
        $.on(window || unsafeWindow, "resize", Style.padding);
        if (catalogLink = $('.pages.cataloglink a', d.body) || $('[href=".././catalog"]', d.body)) {
          if (!g.REPLY) {
            $.add(d.body, catalogLink);
          }
          catalogLink.id = 'catalog';
        }
        return setTimeout((function() {
          var exLink;
          Style.iconPositions();
          if (exLink = $("#navtopright .exlinksOptionsLink", d.body)) {
            return $.on(exLink, "click", function() {
              return setTimeout(Style.rice, 100);
            });
          }
        }), 500);
      });
    },
    agent: {
      'gecko': '-moz-',
      'webkit': '-webkit-',
      'presto': '-o-'
    }[$.engine],
    emoji: function(position) {
      var category, css, icon, key, margin, name, _conf, _i, _len;
      _conf = Conf;
      css = [];
      margin = "margin-" + (position === "before" ? "right" : "left") + ": " + (parseInt(_conf['Emoji Spacing'])) + "px;";
      for (key in Emoji) {
        category = Emoji[key];
        if ((_conf['Emoji'] !== "disable ponies" && key === "pony") || (_conf['Emoji'] !== "only ponies" && key === "not")) {
          for (_i = 0, _len = category.length; _i < _len; _i++) {
            icon = category[_i];
            name = icon[0];
            css[css.length] = "a.useremail[href*='" + name + "']:last-of-type::" + position + ",\na.useremail[href*='" + (name.toLowerCase()) + "']:last-of-type::" + position + ",\na.useremail[href*='" + (name.toUpperCase()) + "']:last-of-type::" + position + " {\n  content: url('" + (Icons.header.png + icon[1]) + "');\n  vertical-align: top;\n  " + margin + "\n}\n";
          }
        }
      }
      return css.join("");
    },
    rice: function(source) {
      var checkbox, checkboxes, div, select, selects, _i, _j, _len, _len1;
      checkboxes = $$('[type=checkbox]:not(.riced)', source);
      for (_i = 0, _len = checkboxes.length; _i < _len; _i++) {
        checkbox = checkboxes[_i];
        $.addClass(checkbox, 'riced');
        div = $.el('div', {
          className: 'rice'
        });
        $.after(checkbox, div);
        if (div.parentElement.tagName.toLowerCase() !== 'label') {
          $.on(div, 'click', function() {
            return checkbox.click();
          });
        }
      }
      selects = $$('select:not(.riced)', source);
      for (_j = 0, _len1 = selects.length; _j < _len1; _j++) {
        select = selects[_j];
        $.addClass(select, 'riced');
        div = $.el('div', {
          className: 'selectrice',
          innerHTML: "<div>" + (select.options[select.selectedIndex].textContent || null) + "</div>"
        });
        $.on(div, "click", function(e) {
          var clientHeight, li, option, rect, style, ul, _k, _len2, _ref;
          e.stopPropagation();
          if (Style.ul) {
            return Style.rmOption();
          }
          rect = this.getBoundingClientRect();
          clientHeight = d.documentElement.clientHeight;
          ul = Style.ul = $.el('ul', {
            id: "selectrice"
          });
          style = ul.style;
          style.width = "" + rect.width + "px";
          if (clientHeight - rect.bottom < 200) {
            style.bottom = "" + (clientHeight - rect.top) + "px";
          } else {
            style.top = "" + rect.bottom + "px";
          }
          style.left = "" + rect.left + "px";
          select = this.previousSibling;
          _ref = select.options;
          for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
            option = _ref[_k];
            li = $.el('li', {
              textContent: option.textContent
            });
            li.setAttribute('data-value', option.value);
            $.on(li, 'click', function(e) {
              var container, ev;
              e.stopPropagation();
              container = this.parentElement.parentElement;
              select = container.previousSibling;
              container.firstChild.textContent = this.textContent;
              select.value = this.getAttribute('data-value');
              ev = document.createEvent('HTMLEvents');
              ev.initEvent("change", true, true);
              $.event(select, ev);
              return Style.rmOption();
            });
            $.add(ul, li);
          }
          $.on(ul, 'click scroll blur', function(e) {
            return e.stopPropagation();
          });
          Style.rmOption = function() {
            $.off(d, 'click scroll blur resize', Style.rmOption);
            $.rm(Style.ul);
            return delete Style.ul;
          };
          $.on(d, 'click scroll blur resize', Style.rmOption);
          return $.add(this, ul);
        });
        $.after(select, div);
      }
    },
    filter: function(text, background) {
      var bgHex, css, fgHex;
      css = function(fg, bg) {
        return "filter: url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='filters' color-interpolation-filters='sRGB'><feColorMatrix values='" + bg.r + " " + (-fg.r) + " 0 0 " + fg.r + " " + bg.g + " " + (-fg.g) + " 0 0 " + fg.g + " " + bg.b + " " + (-fg.b) + " 0 0 " + fg.b + " 0 0 0 1 0' /></filter></svg>#filters\");";
      };
      fgHex = Style.colorToHex(text);
      bgHex = Style.colorToHex(background);
      return css({
        r: parseInt(fgHex.substr(0, 2), 16) / 255,
        g: parseInt(fgHex.substr(2, 2), 16) / 255,
        b: parseInt(fgHex.substr(4, 2), 16) / 255
      }, {
        r: parseInt(bgHex.substr(0, 2), 16) / 255,
        g: parseInt(bgHex.substr(2, 2), 16) / 255,
        b: parseInt(bgHex.substr(4, 2), 16) / 255
      });
    },
    addStyle: function(theme) {
      var _conf;
      _conf = Conf;
      if (!theme) {
        theme = Themes[_conf['theme']];
      }
      MascotTools.init(_conf["mascot"]);
      Style.layoutCSS.textContent = Style.layout();
      Style.themeCSS.textContent = Style.theme(theme);
      return Style.iconPositions();
    },
    setup: function() {
      if (d.head) {
        this.addStyleReady();
        this.remStyle();
        if (Style.headCount > 8) {
          this.cleanup();
          return;
        }
      }
      return this.observe();
    },
    headCount: 0,
    cleanup: function() {
      delete Style.setup;
      delete Style.observe;
      delete Style.wrapper;
      delete Style.remStyle;
      delete Style.headCount;
      return delete Style.cleanup;
    },
    observe: function() {
      var observer, onMutationObserver;
      if (MutationObserver) {
        observer = new MutationObserver(onMutationObserver = this.wrapper);
        return observer.observe(d, {
          childList: true,
          subtree: true
        });
      } else {
        return $.on(d, 'DOMNodeInserted', this.wrapper);
      }
    },
    wrapper: function() {
      if (d.head) {
        if (Style.addStyleReady) {
          Style.addStyleReady();
        }
        Style.remStyle();
        if (Style.headcount > 8) {
          if (observer) {
            observer.disconnect();
          } else {
            $.off(d, 'DOMNodeInserted', Style.wrapper);
          }
          return Style.cleanup();
        }
      }
    },
    addStyleReady: function() {
      var theme;
      theme = Themes[Conf['theme']];
      $.extend(Style, {
        layoutCSS: $.addStyle(Style.layout(), 'layout'),
        themeCSS: $.addStyle(Style.theme(theme), 'theme'),
        icons: $.addStyle("", 'icons'),
        paddingSheet: $.addStyle("", 'padding'),
        mascot: $.addStyle("", 'mascotSheet')
      });
      $.addStyle(Style.jsColorCSS(), 'jsColor');
      return delete Style.addStyleReady;
    },
    remStyle: function() {
      var head, i, len, node, nodes;
      head = d.head;
      nodes = head.children;
      len = nodes.length;
      i = 0;
      while (i < len) {
        if (Style.headCount > 8) {
          break;
        }
        node = nodes[i];
        if ((node.nodeName === 'style' && !node.id) || ("" + node.rel).contains('stylesheet')) {
          Style.headCount++;
          $.rm(node);
          len--;
          continue;
        }
        i++;
      }
    },
    banner: function() {
      var banner, child, children, i, title;
      banner = $(".boardBanner", d.body);
      title = $.el("div", {
        id: "boardTitle"
      });
      children = banner.children;
      i = children.length;
      while (i--) {
        child = children[i];
        if (child.tagName.toLowerCase() === "img") {
          child.id = "Banner";
          continue;
        }
        if (Conf['Custom Board Titles']) {
          child.innerHTML = $.get("" + g.BOARD + child.className, child.innerHTML);
          $.on(child, 'click', function(e) {
            if (e.shiftKey) {
              return this.contentEditable = true;
            }
          });
          $.on(child, 'keydown', function(e) {
            return e.stopPropagation();
          });
          $.on(child, 'focus', function() {
            return this.textContent = this.innerHTML;
          });
          $.on(child, 'blur', function() {
            $.set("" + g.BOARD + this.className, this.textContent);
            this.innerHTML = this.textContent;
            return this.contentEditable = false;
          });
        }
        $.prepend(title, child);
      }
      return $.after(banner, title);
    },
    padding: function() {
      var css, sheet, _conf;
      if (!(sheet = Style.paddingSheet)) {
        return;
      }
      _conf = Conf;
      Style.padding.nav.property = _conf["Boards Navigation"].split(" ");
      Style.padding.nav.property = Style.padding.nav.property[Style.padding.nav.property.length - 1];
      if (Style.padding.pages) {
        Style.padding.pages.property = _conf["Pagination"].split(" ");
        Style.padding.pages.property = Style.padding.pages.property[Style.padding.pages.property.length - 1];
      }
      css = "body::before {\n";
      if (_conf["4chan SS Emulation"]) {
        if (Style.padding.pages && (_conf["Pagination"] === "sticky top" || _conf["Pagination"] === "sticky bottom")) {
          css += "  " + Style.padding.pages.property + ": " + Style.padding.pages.offsetHeight + "px !important;\n";
        }
        if (_conf["Boards Navigation"] === "sticky top" || _conf["Boards Navigation"] === "sticky bottom") {
          css += "  " + Style.padding.nav.property + ": " + Style.padding.nav.offsetHeight + "px !important;\n";
        }
      }
      css += "}\nbody {\n  padding-bottom: 15px;\n";
      if ((Style.padding.pages != null) && (_conf["Pagination"] === "sticky top" || _conf["Pagination"] === "sticky bottom" || _conf["Pagination"] === "top")) {
        css += "  padding-" + Style.padding.pages.property + ": " + Style.padding.pages.offsetHeight + "px;\n";
      }
      if (_conf["Boards Navigation"] !== "hide") {
        css += "  padding-" + Style.padding.nav.property + ": " + Style.padding.nav.offsetHeight + "px;\n";
      }
      css += "}";
      return sheet.textContent = css;
    },
    trimGlobalMessage: function() {
      var child, el, _i, _len, _ref;
      if (el = $("#globalMessage", d.body)) {
        _ref = el.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          child.style.color = "";
        }
      }
    },
    color: function(hex) {
      this.hex = "#" + hex;
      this.calc_rgb = function(hex) {
        hex = parseInt(hex, 16);
        return [(hex >> 16) & 0xFF, (hex >> 8) & 0xFF, hex & 0xFF];
      };
      this.private_rgb = this.calc_rgb(hex);
      this.rgb = this.private_rgb.join(",");
      this.isLight = function() {
        var rgb;
        rgb = this.private_rgb;
        return (rgb[0] + rgb[1] + rgb[2]) >= 400;
      };
      this.shiftRGB = function(shift, smart) {
        var minmax, rgb;
        minmax = function(base) {
          return Math.min(Math.max(base, 0), 255);
        };
        rgb = this.private_rgb.slice(0);
        shift = smart ? (this.isLight(rgb) ? -1 : 1) * Math.abs(shift) : shift;
        return [minmax(rgb[0] + shift), minmax(rgb[1] + shift), minmax(rgb[2] + shift)].join(",");
      };
      return this.hover = this.shiftRGB(16, true);
    },
    colorToHex: function(color) {
      var digits, hex;
      if (color.substr(0, 1) === '#') {
        return color.slice(1, color.length);
      }
      if (digits = color.match(/(.*?)rgba?\((\d+), ?(\d+), ?(\d+)(.*?)\)/)) {
        hex = ((parseInt(digits[2], 10) << 16) | (parseInt(digits[3], 10) << 8) | (parseInt(digits[4], 10))).toString(16);
        while (hex.length < 6) {
          hex = "0" + hex;
        }
        return hex;
      } else {
        return false;
      }
    },
    jsColorCSS: function() {
      return ".jscBox {\n  width: 251px;\n  height: 155px;\n}\n.jscBoxB,\n.jscPadB,\n.jscPadM,\n.jscSldB,\n.jscSldM,\n.jscBtn {\n  position: absolute;\n  clear: both;\n}\n.jscBoxB {\n  left: 320px;\n  bottom: 20px;\n  z-index: 1000;\n  border: 1px solid;\n  border-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;\n  background: ThreeDFace;\n}\n.jscPad {\n  width: 181px;\n  height: 101px;\n  background-image: " + Style.agent + "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1)), " + Style.agent + "linear-gradient(left, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);\n  background-repeat: no-repeat;\n  background-position: 0 0;\n}\n.jscPadB {\n  left: 10px;\n  top: 10px;\n  border: 1px solid;\n  border-color: ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow;\n}\n.jscPadM {\n  left: 0;\n  top: 0;\n  width: 200px;\n  height: 121px;\n  cursor: crosshair;\n  background-image: url('data:image/gif;base64,R0lGODlhDwAPAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAPAA8AAAIklB8Qx53b4otSUWcvyiz4/4AeQJbmKY4p1HHapBlwPL/uVRsFADs=');\n  background-repeat: no-repeat;\n}\n.jscSld {\n  width: 16px;\n  height: 101px;\n  background-image: " + Style.agent + "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1));\n}\n.jscSldB {\n  right: 10px;\n  top: 10px;\n  border: 1px solid;\n  border-color: ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow;\n}\n.jscSldM {\n  right: 0;\n  top: 0;\n  width: 36px;\n  height: 121px;\n  cursor: pointer;\n  background-image: url('data:image/gif;base64,R0lGODlhBwALAKECAAAAAP///6g8eKg8eCH5BAEKAAIALAAAAAAHAAsAAAITTIQYcLnsgGxvijrxqdQq6DRJAQA7');\n  background-repeat: no-repeat;\n}\n.jscBtn {\n  right: 10px;\n  bottom: 10px;\n  padding: 0 15px;\n  height: 18px;\n  border: 1px solid;\n  border-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;\n  color: ButtonText;\n  text-align: center;\n  cursor: pointer;\n}\n.jscBtnS {\n  line-height: 10px;\n}";
    },
    iconPositions: function() {
      var align, aligner, css, first, i, iconOffset, navlinks, notCatalog, notEither, position, spacer, _conf;
      css = "#navtopright .exlinksOptionsLink::after,\n#settingsWindowLink,\ndiv.navLinks > a:first-of-type::after,\n" + (Conf['Slideout Watcher'] ? '#watcher::after,' : '') + "\n" + (Conf['Announcements'] === 'slideout' ? '#globalMessage::after,' : '') + "\n#boardNavDesktopFoot::after,\nbody > a[style=\"cursor: pointer; float: right;\"]::after,\n#imgControls label:first-of-type::after,\n#catalog::after,\n#fappeTyme {\n  position: fixed;\n  display: block;\n  width: 15px;\n  height: 15px;\n  content: \"\";\n  overflow: hidden;\n  opacity: " + (Conf['Invisible Icons'] ? 0 : 0.5) + ";\n}\n#imgControls {\n  position: fixed;\n}\n#settingsWindowLink {\n  visibility: visible;\n  background-position: 0 0;\n}\ndiv.navLinks > a:first-of-type::after {\n  visibility: visible;\n  cursor: pointer;\n  background-position: 0 -15px;\n}\n#watcher::after {\n  background-position: 0 -30px;\n}\n#globalMessage::after {\n  background-position: 0 -45px;\n}\n#boardNavDesktopFoot::after {\n  background-position: 0 -60px;\n}\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  visibility: visible;\n  cursor: pointer;\n  background-position: 0 -75px;\n}\n#imgControls label:first-of-type::after {\n  position: static;\n  background-position: 0 -90px;\n}\n#navtopright .exlinksOptionsLink::after {\n  background-position: 0 -105px;\n}\n#catalog::after {\n  visibility: visible;\n  background-position: 0 -120px;\n}\n#fappeTyme {\n  background-position: 0 -135px;\n}\n#boardNavDesktopFoot:hover::after,\n#globalMessage:hover::after,\n#imgControls label:hover:first-of-type::after,\n#navlinks a:hover,\n#settingsWindowLink:hover,\n#navtopright .exlinksOptionsLink:hover::after,\n#qr #qrtab,\n#watcher:hover::after,\n.thumbnail#selected,\nbody > a[style=\"cursor: pointer; float: right;\"]:hover::after,\ndiv.navLinks > a:first-of-type:hover::after,\n#catalog:hover::after,\n#fappeTyme:hover {\n  opacity: 1;\n}";
      i = 0;
      align = Style.sidebarLocation[0];
      _conf = Conf;
      notCatalog = !g.CATALOG;
      notEither = notCatalog && g.BOARD !== 'f';
      aligner = function(first, spacer, checks) {
        var enabled, position, _i, _len;
        position = [first];
        for (_i = 0, _len = checks.length; _i < _len; _i++) {
          enabled = checks[_i];
          position[position.length] = enabled ? first += spacer : first;
        }
        return position;
      };
      if (_conf["Icon Orientation"] === "horizontal") {
        if (align === 'left') {
          first = 231 + Style.sidebarOffset.W;
          spacer = -19;
        } else {
          first = 2;
          spacer = 19;
        }
        position = aligner(first, spacer, [true, _conf['Slideout Navigation'] !== 'hide', _conf['Announcements'] === 'slideout' && $('#globalMessage', d.body), notCatalog && _conf['Slideout Watcher'] && _conf['Thread Watcher'], $('#navtopright .exlinksOptionsLink', d.body), notCatalog && $('body > a[style="cursor: pointer; float: right;"]', d.body), notEither && _conf['Image Expansion'], notEither, g.REPLY, notEither && _conf['Fappe Tyme'], navlinks = ((!g.REPLY && _conf['Index Navigation']) || (g.REPLY && _conf['Reply Navigation'])) && notCatalog, navlinks]);
        iconOffset = align === 'left' ? 250 - Style.sidebar : position[position.length - 1] - (_conf['4chan SS Sidebar'] ? 0 : Style.sidebar + parseInt(_conf["Right Thread Padding"], 10));
        if (iconOffset < 0) {
          iconOffset = 0;
        }
        css += "div.navLinks > a:first-of-type::after {\n  z-index: 99 !important;\n}\n#prefetch {\n  z-index: 9;\n}\n/* 4chan X Options */\n#settingsWindowLink {\n  " + align + ": " + position[i++] + "px;\n}\n/* Slideout Navigation */\n#boardNavDesktopFoot::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Global Message */\n#globalMessage::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Watcher */\n#watcher::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* ExLinks */\n#navtopright .exlinksOptionsLink::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* 4sight */\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Expand Images */\n#imgControls {\n  " + align + ": " + position[i++] + "px;\n}\n/* 4chan Catalog */\n#catalog::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Back */\ndiv.navLinks > a:first-of-type::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Fappe Tyme */\n#fappeTyme {\n  " + align + ": " + position[i++] + "px;\n}\n/* Thread Navigation Links */\n#navlinks a {\n  margin: 2px;\n  top: 2px;\n}\n#navlinks a:last-of-type {\n  " + align + ": " + position[i++] + "px;\n}\n#navlinks a:first-of-type {\n  " + align + ": " + position[i++] + "px;\n}\n#prefetch {\n  width: " + (248 + Style.sidebarOffset.W) + "px;\n  " + align + ": 2px;\n  top: 20px;\n  text-align: " + Style.sidebarLocation[1] + ";\n}\n#boardNavDesktopFoot::after,\n#navtopright .exlinksOptionsLink::after,\n#settingsWindowLink,\n#watcher::after,\n#globalMessage::after,\n#imgControls,\n#fappeTyme,\ndiv.navLinks > a:first-of-type::after,\n#catalog::after,\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  top: 2px !important;\n}\n" + (_conf["Announcements"] === "slideout" ? "#globalMessage," : "") + "\n" + (_conf["Slideout Watcher"] ? "#watcher," : "") + "\n#boardNavDesktopFoot {\n  top: 16px !important;\n  z-index: 98 !important;\n}\n#globalMessage:hover,\n" + (_conf["Slideout Watcher"] ? "#watcher:hover," : "") + "\n#boardNavDesktopFoot:hover {\n  z-index: 99 !important;\n}\n" + (_conf['Boards Navigation'] === 'top' || _conf['Boards Navigation'] === 'sticky top' ? '#boardNavDesktop' : _conf['Pagination'] === 'top' || _conf['Pagination'] === 'sticky top' ? '.pagelist' : void 0) + " {\n  padding-" + align + ": " + iconOffset + "px;\n}\n";
        if (_conf["Updater Position"] !== 'moveable') {
          css += "/* Updater + Stats */\n#updater,\n#stats {\n  " + align + ": 2px !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n  top: auto !important;\n  bottom: auto !important;\n  " + _conf["Updater Position"] + ": 1.6em !important;\n}";
        }
      } else {
        position = aligner(2 + (_conf["4chan Banner"] === "at sidebar top" ? Style.logoOffset + 19 : 0), 19, [notEither && _conf['Image Expansion'], true, _conf['Slideout Navigation'] !== 'hide', _conf['Announcements'] === 'slideout' && $('#globalMessage', d.body), notCatalog && _conf['Slideout Watcher'] && _conf['Thread Watcher'], notCatalog && $('body > a[style="cursor: pointer; float: right;"]', d.body), $('#navtopright .exlinksOptionsLink', d.body), notEither, g.REPLY, notEither && _conf['Fappe Tyme'], navlinks = ((!g.REPLY && _conf['Index Navigation']) || (g.REPLY && _conf['Reply Navigation'])) && notCatalog, navlinks]);
        iconOffset = 20 - (_conf['4chan SS Sidebar'] ? 0 : Style.sidebar + parseInt(_conf[align.capitalize() + " Thread Padding"], 10));
        css += "div.navLinks > a:first-of-type::after {\n  z-index: 89 !important;\n}\n#prefetch {\n  z-index: 95;\n}\n/* Image Expansion */\n#imgControls {\n  top: " + position[i++] + "px;\n}\n/* 4chan X Options */\n#settingsWindowLink {\n  top: " + position[i++] + "px;\n}\n/* Slideout Navigation */\n#boardNavDesktopFoot,\n#boardNavDesktopFoot::after {\n  top: " + position[i++] + "px;\n}\n/* Global Message */\n#globalMessage,\n#globalMessage::after {\n  top: " + position[i++] + "px;\n}\n/* Watcher */\n" + (_conf["Slideout Watcher"] ? "#watcher, #watcher::after" : "") + " {\n  top: " + position[i++] + "px !important;\n}\n/* 4sight */\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  top: " + position[i++] + "px;\n}\n/* ExLinks */\n#navtopright .exlinksOptionsLink::after {\n  top: " + position[i++] + "px;\n}\n/* 4chan Catalog */\n#catalog::after {\n  top: " + position[i++] + "px;\n}\n/* Back */\ndiv.navLinks > a:first-of-type::after {\n  top: " + position[i++] + "px;\n}\n/* Fappe Tyme */\n#fappeTyme {\n  top: " + position[i++] + "px;\n}\n/* Thread Navigation Links */\n#navlinks a:first-of-type {\n  top: " + position[i++] + "px !important;\n}\n#navlinks a:last-of-type {\n  top: " + position[i++] + "px !important;\n}\n#prefetch {\n  width: " + (248 + Style.sidebarOffset.W) + "px;\n  " + align + ": 2px;\n  top: 1px;\n  text-align: " + Style.sidebarLocation[1] + ";\n}\n#navlinks a,\n#navtopright .exlinksOptionsLink::after,\n#settingsWindowLink,\n#boardNavDesktopFoot::after,\n#globalMessage::after,\n#imgControls,\n#fappeTyme,\n" + (_conf["Slideout Watcher"] ? "#watcher::after," : "") + "\nbody > a[style=\"cursor: pointer; float: right;\"]::after,\n#catalog::after,\ndiv.navLinks > a:first-of-type::after {\n  " + align + ": 3px !important;\n}\n#boardNavDesktopFoot {\n  z-index: 97 !important;\n}\n#globalMessage {\n  z-index: 98 !important;\n}\n#watcher {\n  z-index: " + (_conf["Slideout Watcher"] ? "99" : "10") + " !important;\n}\n" + (_conf["Slideout Watcher"] ? "#watcher:hover," : "") + "\n#boardNavDesktopFoot:hover,\n#globalMessage:hover {\n  z-index: 100 !important;\n}\n#boardNavDesktopFoot,\n#globalMessage,\n#watcher {\n  width: " + (233 + Style.sidebarOffset.W) + "px !important;\n  " + align + ": 18px !important;\n}\n" + (_conf['Boards Navigation'] === 'top' || _conf['Boards Navigation'] === 'sticky top' ? '#boardNavDesktop' : _conf['Pagination'] === 'top' || _conf['Pagination'] === 'sticky top' ? '.pagelist' : void 0) + " {\n  padding-" + align + ": " + iconOffset + "px;\n}";
        if (_conf["Updater Position"] !== 'moveable') {
          css += "/* Updater + Stats */\n#updater,\n#stats {\n  " + align + ": " + (_conf["Updater Position"] === "top" ? "24" : "2") + "px !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n  top: " + (_conf["Updater Position"] === "top" ? "1px" : "auto") + " !important;\n  bottom: " + (_conf["Updater Position"] === "bottom" ? "2px" : "auto") + " !important;\n  " + (_conf["Updater Position"] === "top" ? "z-index: 96 !important;" : void 0) + "\n}";
        }
      }
      return Style.icons.textContent = css;
    },
    layout: function() {
      var css, editSpace, position, width, _conf;
      _conf = Conf;
      position = {
        right: {
          hide: parseInt(_conf['Right Thread Padding'], 10) < 100 ? "right" : "left",
          minimal: "right"
        }[_conf["Sidebar"]] || "left",
        left: parseInt(_conf['Right Thread Padding'], 10) < 100 ? "right" : "left"
      }[_conf["Sidebar Location"]];
      Style['sidebarOffset'] = _conf["Sidebar"] === "large" ? {
        W: 51,
        H: 17
      } : {
        W: 0,
        H: 0
      };
      Style.logoOffset = _conf["4chan Banner"] === "at sidebar top" ? 83 + Style.sidebarOffset.H : 0;
      Style.sidebarLocation = _conf["Sidebar Location"] === "left" ? ["left", "right"] : ["right", "left"];
      if (_conf['editMode'] === "theme") {
        editSpace = {};
        editSpace[Style.sidebarLocation[1]] = 300;
        editSpace[Style.sidebarLocation[0]] = 0;
      } else {
        editSpace = {
          left: 0,
          right: 0
        };
      }
      Style.sidebar = {
        minimal: 20,
        hide: 2
      }[_conf.Sidebar] || (252 + Style.sidebarOffset.W);
      Style.replyMargin = {
        none: 0,
        minimal: 1,
        small: 2,
        medium: 4,
        large: 8
      }[_conf["Reply Spacing"]];
      return css = ("/* dialog styling */\n.dialog.reply {\n  display: block;\n}\n.move {\n  cursor: move;\n}\nlabel,\n.favicon {\n  cursor: pointer;\n}\n.hide_thread_button {\n  padding: 0 5px;\n  float: left;\n}\n.hide_thead_button.hidden_thread {\n  padding: 0;\n  float: none;\n}\n.menu_button {\n  display: inline-block;\n}\n.menu_button > span,\n#mascot_hide > span,\n.hide_thread_button span > span,\n.hide_reply_button span > span {\n  display: inline-block;\n  margin: 2px 2px 3px;\n  vertical-align: middle;\n}\n.menu_button > span,\n#mascot_hide > span {\n  border-top:   .5em solid;\n  border-right: .3em solid transparent;\n  border-left:  .3em solid transparent;\n}\n.hide_thread_button span > span,\n.hide_reply_button span > span {\n  width: .4em;\n  height: 1px;\n}\n#mascot_hide {\n  padding: 3px;\n  position: absolute;\n  top: 2px;\n  right: 18px;\n}\n#mascot_hide input,\n#mascot_hide .rice {\n  float: left;\n}\n#mascot_hide > div {\n  height: 0;\n  text-align: right;\n  overflow: hidden;\n}\n#mascot_hide:hover > div {\n  height: auto;\n}\n#mascot_hide label {\n  width: 100%;\n  display: block;\n  clear: both;\n  text-decoration: none;\n}\n#menu,\n#post-preview {\n  position: absolute;\n  outline: none;\n}\n.themevar textarea {\n  height: 300px;\n}\n.entry {\n  border-bottom: 1px solid rgba(0,0,0,.25);\n  cursor: pointer;\n  display: block;\n  outline: none;\n  padding: 3px 7px;\n  position: relative;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.focused.entry {\n  background: rgba(255,255,255,.33);\n}\n.hasSubMenu::after {\n  content: \"\";\n  border-" + position + ": .5em solid;\n  border-top: .3em solid transparent;\n  border-bottom: .3em solid transparent;\n  display: inline-block;\n  margin: .3em;\n  position: absolute;\n  right: 3px;\n}\n.subMenu.reply {\n  padding: 0;\n  position: absolute;\n  " + position + ": 100%;\n  top: -1px;\n}\n#banmessage,\n#boardTitle,\n#mascotConf input,\n.keybinds_tab > div,\n.main_tab,\n.style_tab .suboptions,\n.center,\nh1 {\n  text-align: center;\n}\n.rice_tab .selectrice {\n  width: 150px;\n  display: inline-block;\n}\n.keybinds_tab > table {\n  margin: auto;\n}\n#mascotConf input::" + Style.agent + "placeholder {\n  text-align: center;\n}\n#mascotConf input:" + Style.agent + "placeholder {\n  text-align: center;\n}\n#qr input:focus::" + Style.agent + "placeholder,\n#qr textarea:focus::" + Style.agent + "placeholder {\n  color: transparent;\n}\n#qr input:focus:" + Style.agent + "placeholder,\n#qr textarea:focus:" + Style.agent + "placeholder {\n  color: transparent;\n}\n#boardNavDesktopFoot,\n#selectrice,\n#selectrice div,\n#selectrice ul,\n#selectrice li,\n#qr .warning,\n#qr .move,\n#threadselect .selectrice,\n#watcher,\n.captchaimg img,\n.field,\n.file,\n.mascotname,\n.mascotoptions,\n.post,\n.postInfo,\n.selectrice,\n.thumbnail,\nbutton,\ninput {\n  " + Style.agent + "box-sizing: border-box;\n  box-sizing: border-box;\n}\n#threadselect,\n#spoilerLabel {\n  display: inline-block;\n}\n#spoilerLabel {\n  text-align: right;\n}\n#threadselect,\n#threadselect + #spoilerLabel {\n  width: 49%;\n}\n#threadselect:empty + #spoilerLabel,\ninput[title=\"Verification\"] {\n  width: 100%;\n}\n#threadselect .selectrice {\n  margin-top: 0;\n  width: 100%;\n}\n#updater .move,\n#qr .move {\n  overflow: hidden;\n  padding: 0 2px;\n}\n#credits,\n#qr .move > span {\n  float: right;\n}\n#autohide,\n#dump,\n#qr .selectrice,\n.close,\n.remove,\n.captchaimg,\n#qr .warning {\n  cursor: pointer;\n}\n#qr .selectrice,\n#qr > form {\n  margin: 0;\n}\n#replies {\n  display: block;\n  height: 100px;\n  position: relative;\n}\n#replies > div {\n  counter-reset: thumbnails;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  position: absolute;\n  white-space: pre;\n}\n#replies > div:hover {\n  bottom: -10px;\n  overflow-x: auto;\n}\n.thumbnail {\n  background-color: rgba(0,0,0,.2);\n  background-position: 50% 20%;\n  background-size: cover;\n  border: 1px solid #666;\n  cursor: move;\n  display: inline-block;\n  height: 90px;\n  width: 90px;\n  margin: 5px;\n  padding: 2px;\n  opacity: .5;\n  outline: none;\n  overflow: hidden;\n  position: relative;\n  text-shadow: 0 1px 1px #000;\n  " + Style.agent + "transition: opacity .25s ease-in-out;\n  vertical-align: top;\n}\n/* Catalog */\n#content .navLinks,\n#info .navLinks,\n.btn-wrap {\n  display: block;\n}\n.navLinks > .btn-wrap:not(:first-of-type)::before {\n  content: ' - ';\n}\n.button {\n  cursor: pointer;\n}\n#content .btn-wrap,\n#info .btn-wrap {\n  display: inline-block;\n}\n#settings .selectrice {\n  width: 100px;\n  display: inline-block;\n}\n#settings,\n#threads,\n#info .navLinks,\n#content .navLinks {\n  text-align: center;\n}\n#threads .thread {\n  vertical-align: top;\n  display: inline-block;\n  word-wrap: break-word;\n  overflow: hidden;\n  margin-top: 5px;\n  padding: 5px 0 3px;\n  text-align: center;\n}\n.extended-small .thread,\n.small .thread {\n  width: 165px;\n  max-height: 320px;\n}\n.extended-large .thread,\n.large .thread {\n  width: 270px;\n  max-height: 410px;\n}\n.extended-small .thumb,\n.small .thumb {\n  max-width: 150px;\n  max-height: 150px;\n}\n.thumbnail:hover,\n.thumbnail:focus {\n  opacity: .9;\n}\n.thumbnail::before {\n  counter-increment: thumbnails;\n  content: counter(thumbnails);\n  color: #fff;\n  font-weight: 700;\n  padding: 3px;\n  position: absolute;\n  top: 0;\n  right: 0;\n  text-shadow: 0 0 3px #000, 0 0 8px #000;\n}\n.thumbnail.drag {\n  box-shadow: 0 0 10px rgba(0,0,0,.5);\n}\n.thumbnail.over {\n  border-color: #fff;\n}\n.thumbnail > span {\n  color: #fff;\n}\n.remove {\n  background: none;\n  color: #e00;\n  font-weight: 700;\n  padding: 3px;\n}\n.remove:hover::after {\n  content: \" Remove\";\n}\n.thumbnail > label {\n  background: rgba(0,0,0,.5);\n  color: #fff;\n  right: 0; bottom: 0; left: 0;\n  position: absolute;\n  text-align: center;\n}\n.thumbnail > label > input {\n  margin: 0;\n}\n#addReply {\n  font-size: 3.5em;\n  line-height: 100px;\n}\n.field {\n  " + Style.agent + "transition: color .25s, border .25s;\n}\n.field:hover,\n.field:focus {\n  outline: none;\n}\n.fitwidth .fullSize {\n  max-width: 100%;\n}\n.style_tab .selectrice,\n.fitwidth .fullSize,\n.themevar .field,\n.themevar textarea {\n  width: 100%;\n}\n.themevar .colorfield {\n  width: 90%;\n  border-right: none;\n}\n.themevar .color {\n  width: 10%;\n  color: transparent;\n  border-left: none;\n}\n#ihover,\n#mouseover,\n#navlinks,\n#overlay,\n#qr,\n#qp,\n#stats,\n#updater {\n  position: fixed;\n}\n#ihover {\n  max-height: 97%;\n  max-width: 75%;\n  padding-bottom: 18px;\n}\n#overlay {\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  background: rgba(0,0,0,.5);\n}\n#options {\n  position: fixed;\n  padding: .3em;\n  width: auto;\n  left: 15%;\n  right: 15%;\n  top: 15%;\n  bottom: 15%;\n}\n#options h3 {\n  margin: 0;\n}\n#optionsbar {\n  padding: 0 3px;\n}\n.tabs label {\n  position: relative;\n  padding: 0 4px;\n  z-index: 1;\n  height: 1.4em;\n  display: inline-block;\n  border-width: 1px 1px 0 1px;\n  border-color: transparent;\n  border-style: solid;\n}\n.theme_tab h1 {\n  position: absolute;\n  right: 300px;\n  bottom: 10px;\n  margin: 0;\n  " + Style.agent + "transition: all .2s ease-in-out;\n  opacity: 0;\n}\n.theme_tab .selectedtheme h1 {\n  right: 11px;\n  opacity: 1;\n}\n#themeContainer {\n  margin-bottom: 3px;\n}\n.main_tab li,\n.style_tab li,\n.rice_tab li {\n  overflow: visible;\n  padding: 0 5px 0 7px;\n  list-style-type: none;\n}\n#options tr:nth-of-type(2n+1),\n.main_tab li:nth-of-type(2n+1),\n.rice_tab li:nth-of-type(2n+1),\n.style_tab li:nth-of-type(2n+1),\n.keybinds_tab li:nth-of-type(2n+1),\n.selectrice li:nth-of-type(2n+1) {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.rice_tab input {\n  margin: 1px;\n}\narticle li {\n  margin: 10px 0 10px 2em;\n}\n#options code {\n  background: hsla(0, 0%, 100%, .5);\n  color: #000;\n  padding: 0 1px;\n}\n.option {\n  width: 50%;\n  display: inline-block;\n}\n.themevar .option {\n  width: 100%;\n}\n.optionlabel {\n  padding-left: 18px;\n}\n.rice + .optionlabel {\n  padding-left: 0;\n}\n.mascots {\n  padding: 0;\n  text-align: center;\n}\n.mascot,\n.mascotcontainer {\n  overflow: hidden;\n}\n.mascot {\n  position: relative;\n  border: none;\n  margin: 5px;\n  padding: 0;\n  width: 200px;\n  display: inline-block;\n  background-color: transparent;\n}\n.mascotcontainer {\n  height: 250px;\n  border: 0;\n  margin: 0;\n  max-height: 250px;\n  cursor: pointer;\n  bottom: 0;\n  border-width: 0 1px 1px;\n  border-style: solid;\n  border-color: transparent;\n  overflow: hidden;\n}\n.mascot img {\n  max-width: 200px;\n  image-rendering: optimizeQuality;\n}\n#mascotConf {\n  position: fixed;\n  height: 400px;\n  bottom: 0;\n  left: 50%;\n  width: 500px;\n  margin-left: -250px;\n  overflow: auto;\n}\n#mascotConf h2 {\n  margin: 10px 0 0;\n  font-size: 14px;\n}\n#optionsContent {\n  overflow: auto;\n  position: absolute;\n  top:    1.7em;\n  right:  5px;\n  bottom: 5px;\n  left:   5px;\n}\n#options .style_tab ul,\n#options .main_tab ul {\n  vertical-align: top;\n  " + (_conf["Single Column Mode"] ? "margin: 0 auto 6px;" : "margin: 0 3px 6px;\n  display: inline-block;") + "\n}\n.main_tab li,\n.styleoption {\n  text-align: left;\n}\n.style_tab .suboptions ul {\n  width: 370px;\n}\n.main_tab ul {\n  width: 200px;\n}\n.suboptions,\n#mascotcontent,\n#themecontent {\n  overflow: auto;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 1.7em;\n  left: 0;\n}\n.mAlign {\n  height: 250px;\n  vertical-align: middle;\n  display: table-cell;\n}\n.style_tab .suboptions {\n  bottom: 0;\n}\n#themecontent {\n  top: 1.7em;\n}\n#mascotcontent {\n  text-align: center;\n}\n#save,\n.stylesettings {\n  position: absolute;\n  right: 10px;\n  bottom: 0;\n}\n#addthemes {\n  position: absolute;\n  left: 10px;\n  bottom: 0;\n}\n.mascotname,\n.mascotoptions {\n  padding: 0;\n  width: 100%;\n}\n.mascot .mascotoptions {\n  opacity: 0;\n  " + Style.agent + "transition: opacity .3s linear;\n}\n.mascot:hover .mascotoptions {\n  opacity: 1;\n}\n.mascotoptions {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  left: 0;\n}\n.mascotoptions a {\n  display: inline-block;\n  width: 33%;\n}\n#close,\n#mascots_batch {\n  position: absolute;\n  left: 10px;\n  bottom: 0;\n}\n#upload {\n  position: absolute;\n  width: 100px;\n  left: 50%;\n  margin-left: -50px;\n  text-align: center;\n  bottom: 0;\n}\n#optionsContent textarea {\n  font-family: monospace;\n  min-height: 350px;\n  resize: vertical;\n  width: 100%;\n}\n#updater:not(:hover) {\n  border-color: transparent;\n}\n#updater input[type=number] {\n  width: 3.9em;\n}\n#watcher {\n  padding-bottom: 5px;\n  position: fixed;\n  overflow: hidden;\n  white-space: nowrap;\n  max-height: 200px;\n}\n#watcher:hover {\n  max-height: none;\n}\n#watcher {\n  max-width: 200px;\n  overflow: hidden;\n  padding-left: 5px;\n  padding-right: 5px;\n  text-overflow: ellipsis;\n}\n#mouseover,\n#qp img {\n  max-height: 300px;\n  max-width: 500px;\n}\n.center,\n.replyContainer.image_expanded {\n  clear: both;\n}\n.inline {\n  display: table;\n}\n.opContainer {\n  display: block;\n}\n#copyright,\n#boardNavDesktop a,\n#options ul,\n.menubutton a,\nbody {\n  padding: 0;\n}\nhtml,\nbody {\n  min-height: 100%;\n}\nbody {\n  margin-top: 1px;\n  margin-bottom: 1px;\n  margin-" + Style.sidebarLocation[0] + ": " + Style.sidebar + "px;\n  margin-" + Style.sidebarLocation[1] + ": 2px;\n  padding-left: " + (parseInt(_conf["Left Thread Padding"], 10) + editSpace["left"]) + "px;\n  padding-right: " + (parseInt(_conf["Right Thread Padding"], 10) + editSpace["right"]) + "px;\n}\n#exlinks-options > *,\n.selectrice,\nhtml,\nbody,\na,\nbody,\nbutton,\ninput,\ntextarea {\n  font-family: " + _conf["Font"] + ";\n}\n#boardNavDesktopFoot a[href*=\"//boards.4chan.org/\"]::after,\n#boardNavDesktopFoot a[href*=\"//boards.4chan.org/\"]::before,\n#boardNavDesktopFoot a,\n.container::before,\n.fileText span:not([class])::after,\n.pages strong,\n.selectrice,\na,\nbody,\nbutton,\ninput,\ntextarea {\n  font-size: " + (parseInt(_conf["Font Size"], 10)) + "px;\n}\n.boardSubtitle,\n.boardSubtitle a {\n  font-size: " + (parseInt(_conf["Font Size"], 10) - 1) + "px;\n}\nh2,\nh2 a {\n  font-size: " + (parseInt(_conf["Font Size"], 10) + 4) + "px;\n}\n/* Cleanup */\n#absbot,\n#autohide,\n#optionsContent > div,\n#delform > hr,\n#filters-ctrl,\n#imgControls .rice,\n#logo,\n#navbotright,\n#postForm,\n#postPassword,\n#qr #replies,\n#qp .rice\n#qp input,\n#settingsMenu,\n#styleSwitcher,\n#threadselect:empty,\n#updater > div,\n.boardBanner div,\n" + (!_conf["Board Subtitle"] ? ".boardSubtitle," : "") + "\n.deleteform,\n.fappeTyme .noFile,\n.fileText:hover .fntrunc,\n.fnfull,\n.forwarded,\n.hasSubMenu .subMenu,\n.hidden_thread .summary,\n.inline input,\n.large .teaser,\n.mobile,\n.navLinksBot,\n.panel,\n.postInfo input,\n.postInfo .rice,\n.postingMode,\n.postingMode ~ #delform hr,\n.qrHeader,\n.replymode,\n.riced,\n.sideArrows,\n.small .teaser,\n.stylechanger,\n.warning:empty,\nbody > br,\nbody > div[style^=\"text-align\"],\nbody > hr {\n  display: none;\n}\n" + (_conf["Hide Show Post Form"] ? "#showQR," : "") + "\n.hidden_thread ~ div,\n.hidden_thread ~ a,\n.hide_reply_button.stub ~ .reply,\n.stub ~ div,\nbody > .center,\n[hidden] {\n  display: none !important;\n}\n#optionsContent > input:checked + div,\n#updater:hover > div,\n#updater .move,\n#qr.dump #replies,\n.hasSubMenu.focused > .subMenu {\n  display: block;\n}\n.fileText:hover .fnfull {\n  display: inline-block;\n}\n#mascot img,\n#replies,\n#spoilerLabel,\n.captchaimg,\n.hide_reply_button,\n.menu_button,\n.move {\n  user-select: none;\n  " + Style.agent + "user-select: none;\n}\n.prettyprint span {\n  font-family: monospace;\n}\n.fileThumb {\n  float: left;\n  margin: 3px 20px 0;\n}\n.exthumbnail {\n  image-rendering: optimizeQuality;\n}\na {\n  outline: none;\n}\n.board > hr:last-of-type {\n  margin: 0;\n  border-bottom-color: transparent;\n}\n#boardNavDesktop a,\n#boardNavDesktopFoot a,\n#navlinks a,\n.pages a,\n.deadlink,\n.hide_reply_button a,\ns {\n  text-decoration: none;\n}\n.inlined {\n  font-style: italic;\n  " + (_conf["Bolds"] ? 'font-weight: 800;' : '') + "\n}\n#watcher > .move,\n.backlink:not(.filtered),\na,\nspan.postNum > .replylink {\n  text-decoration: " + (_conf["Underline Links"] ? "underline" : "none") + ";\n}\n.filtered,\n.quotelink.filtered,\n[alt=\"closed\"] + a {\n  text-decoration: line-through;\n}\n.ownpost:after {\n  content: \" (You)\";\n}\n/* Z-INDEXES */\n#mouseover {\n  z-index: 999;\n}\n#mascotConf,\n#options,\n#themeConf {\n  z-index: 998;\n}\n#post-preview,\n#qp {\n  z-index: 104;\n}\n#ihover,\n#overlay,\n#stats,\n#updater,\n.exPopup,\n.subMenu {\n  z-index: 102;\n}\n.exlinksOptionsLink::after,\n#settingsWindowLink {\n  z-index: 101;\n}\n#imgControls {\n  z-index: 100;\n}\n#catalog::after {\n  z-index: 99;\n}\n#autoPagerBorderPaging,\n#boardNavDesktop,\n#menu,\n#navlinks,\na[style=\"cursor: pointer; float: right;\"]::after {\n  z-index: 94;\n}\n.fileThumb .fullSize {\n  position: relative;\n  z-index: " + (_conf["Images Overlap Post Form"] ? "90" : "1") + ";\n}\n#navtopright,\n#showQR {\n  z-index: 6;\n}\n#boardTitle,\n#watcher,\n#watcher::after,\n.boardBanner,\n.menu_button,\n.hide_reply_button a {\n  z-index: 4;\n}\n#globalMessage::after,\n.boardBanner,\n.replyhider a {\n  z-index: 1;\n}\n.post {\n  z-index: 0;\n}\n.boardTitle,\n.boardTitle a {\n  font-size: 22px;\n  font-weight: 400;\n}\n.boardBanner {\n  line-height: 0;\n}\nhr {\n  padding: 0;\n  height: 0;\n  width: 100%;\n  clear: both;\n  border: none;\n}\n.boxcontent > hr,\n.entry:last-child,\nh3,\nimg {\n  border: none;\n}\n.boxcontent input {\n  height: 18px;\n  vertical-align: bottom;\n  margin-right: 1px;\n}\n/* Navigation */\n.pagelist {\n  text-align: " + _conf["Pagination Alignment"] + ";\n}\n.next,\n.pages,\n.prev {\n  display: inline-block;\n  margin: 0 3px;\n}\n#boardNavDesktop {\n  text-align: " + _conf["Navigation Alignment"] + ";\n}\n#boardNavDesktopFoot {\n  visibility: visible;\n  position: fixed;\n  " + Style.sidebarLocation[0] + ": 2px;\n  bottom: auto;\n  color: transparent;\n  font-size: 0;\n  border-width: 1px;\n  text-align: center;\n  height: 0;\n  width: " + (width = 248 + Style.sidebarOffset.W) + "px !important;\n  overflow: hidden;\n}\nimg.topad,\nimg.middlead,\nimg.bottomad {\n  opacity: 0.3;\n  " + Style.agent + "transition: opacity .3s linear;\n}\nimg.topad:hover,\nimg.middlead:hover,\nimg.bottomad:hover {\n  opacity: 1;\n}\n/* moots announcements */\n#globalMessage {\n  text-align: center;\n  font-weight: 200;\n}\n#xupdater {\n  padding: 2px;\n  text-align: center;\n  margin: 1px;\n}\n#xupdater a {\n  font-size: " + (parseInt(_conf["Font Size"], 10) + 3) + "px;\n}\n.pages strong,\na,\n.new {\n  " + Style.agent + "transition: background .1s linear;\n}\n/* Post Form */\n.captchainput,\n#file {\n  overflow: hidden;\n}\n/* Formatting for all postarea elements */\n#file {\n  line-height: 17px;\n}\n#file,\n#threadselect .selectrice {\n  cursor: default;\n  display: inline-block;\n}\n#threadselect .selectrice,\ninput:not([type=radio]),\n.field,\ninput[type=\"submit\"] {\n  height: 1.7em;\n}\n#qr .warning {\n  min-height: 1.7em;\n}\n#qr .warning,\n.field,\n.selectrice,\nbutton,\ninput {\n  vertical-align: middle;\n  padding: 0 1px;\n}\ninput[type=\"submit\"] {\n  padding: 0;\n}\n#qr input[type=\"file\"] {\n  position: absolute;\n  opacity: 0;\n  z-index: -1;\n}\n/* Image Hover and Image Expansion */\n#ihover {\n  max-width: 85%;\n  max-height: 85%;\n}\n#imageType {\n  border: none;\n  width: 90px;\n  position: relative;\n  bottom: 1px;\n  margin: 0;\n  height: 17px;\n}\n/* Posts */\n.postInfo {\n  display: block;\n  width: auto;\n}\n.post {\n  padding: 3px 5px;\n}\n.file {\n  padding-left: 8px;\n}\nblockquote {\n  min-height: " + (parseInt(_conf["Font Size"], 10) + 3) + "px;\n}\n.fullSize {\n  position: relative;\n  top: 0;\n}\n.fileText {\n  margin-top: 17px;\n}\n.summary,\n.postContainer {\n  margin-bottom: " + Style.replyMargin + "px;\n}\n.summary {\n  display: table;\n}\n.thread {\n  padding: 0;\n  position: relative;\n  " + (!_conf['Images Overlap Post Form'] ? "z-index: 0;" : "") + "\n}\n#selectrice {\n  margin: 0 !important;\n}\n.post {\n  margin: 0;\n}\n#catalog,\n#navtopright,\n.cataloglink,\na[style=\"cursor: pointer; float: right;\"] {\n  position: fixed;\n  top: 100%;\n  left: 100%;\n}\n/* Expand Images */\n#imgControls {\n  width: 15px;\n  overflow-x: hidden;\n  overflow-y: visible;\n}\n#imgContainer {\n  float: " + Style.sidebarLocation[0] + ";\n}\n#imgContainer,\n#imgControls:hover {\n  width: 110px;\n}\n#imgControls label {\n  float: " + Style.sidebarLocation[0] + ";\n}\n#imgControls .selectrice {\n  float: " + Style.sidebarLocation[1] + ";\n  width: 90px;\n}\n/* Reply Previews */\n#mouseover,\n#qp {\n  max-width: 70%;\n}\n#post-preview {\n  max-width: 400px;\n}\n#qp .replyContainer,\n#qp .opContainer {\n  visibility: visible;\n}\n#post-preview,\n#qp .op {\n  display: table;\n}\n#qp .post img {\n  max-width: 300px;\n  height: auto;\n}\n.inline .post,\n#qp .post {\n  padding-bottom: 0 !important;\n}\n.navLinks {\n  visibility: hidden;\n  height: 0;\n  width: 0;\n  overflow: hidden;\n}\n/* AutoPager */\n#autoPagerBorderPaging {\n  position: fixed !important;\n  right: 300px !important;\n  bottom: 0;\n}\n#options ul {\n  margin: 3px;\n  margin-bottom: 6px;\n}\n#stats,\n#navlinks {\n  left: auto !important;\n  bottom: auto !important;\n  text-align: right;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n}\n#prefetch,\n#stats {\n  position: fixed;\n  cursor: default;\n}\n#updater {\n  overflow: hidden;\n  background: none;\n  text-align: right;\n}\n#watcher {\n  padding: 1px 0;\n  border-radius: 0;\n}\n" + (_conf['Updater Position'] !== 'moveable' ? '#updater .move,' : '') + "\n#options .move,\n#watcher .move,\n#stats .move {\n  cursor: default;\n}\n/* 4sight */\na[style=\"cursor: pointer; float: right;\"] + div[style^=\"width: 100%;\"] {\n  display: block;\n  position: fixed !important;\n  top: 117px !important;\n  " + Style.sidebarLocation[1] + ": 4px !important;\n  " + Style.sidebarLocation[0] + ": " + (252 + Style.sidebarOffset.W) + "px !important;\n  width: auto !important;\n  margin: 0 !important;\n  z-index: 2;\n}\na[style=\"cursor: pointer; float: right;\"] + div[style^=\"width: 100%;\"] > table > tbody > tr > td {\n  vertical-align: top;\n}\na[style=\"cursor: pointer; float: right;\"] + div[style^=\"width: 100%;\"] {\n  height: 95% !important;\n  margin: 0 5px !important;\n}\n#fs_status {\n  width: auto !important;\n  height: auto !important;\n  padding: 10px !important;\n  white-space: normal !important;\n}\n.identityIcon,\nimg[alt=\"Sticky\"],\nimg[alt=\"Closed\"] {\n  vertical-align: top;\n}\n.inline,\n#qp {\n  background-color: transparent;\n  border: none;\n}\n.mascotname,\ninput[type=\"submit\"]:hover {\n  cursor: pointer;\n}\n#boardNavDesktop .current {\n  font-weight: 800;\n}\n.focused.entry {\n  background-color: transparent;\n}\n#menu.reply.dialog,\n.subMenu {\n  padding: 0;\n}\n.textarea {\n  position: relative;\n}\n#charCount {\n  background: none;\n  font-size: 10px;\n  pointer-events: none;\n  position: absolute;\n  right: 2px;\n  top: auto;\n  bottom: 0;\n  height: 1.7em;\n}\n#charCount.warning {\n  color: rgb(255,0,0);\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: none;\n}\n/* Position and Dimensions of the #qr */\n#showQR {\n  display: block;\n  " + Style.sidebarLocation[0] + ": 2px;\n  width: " + width + "px;\n  background-color: transparent;\n  text-align: center;\n  position: fixed;\n  top: auto;\n  bottom: 2px !important;\n}\n/* Width and height of all #qr elements (excluding some captcha elements) */\n#dump {\n  width: 20px;\n  margin: 0;\n  outline: none;\n  padding: 0 0 3px;\n}\n.captchaimg {\n  line-height: 0;\n}\n#qr div {\n  min-width: 0;\n}\n#updater input,\n#options input,\n#qr {\n  border: none;\n}\n.prettyprint {\n  display: table;\n  clear: right;\n  white-space: pre-wrap;\n  border-radius: 2px;\n  overflow-x: auto;\n  padding: 3px;\n}\n#themeConf {\n  position: fixed;\n  " + Style.sidebarLocation[1] + ": 2px;\n  " + Style.sidebarLocation[0] + ": auto;\n  top: 0;\n  bottom: 0;\n  width: 296px;\n}\n#themebar input {\n  width: 30%;\n}\n.suboptions {\n  padding: 5px;\n}\n#dump,\n#file,\n#options input,\n.selectrice,\nbutton,\ninput,\ntextarea {\n  " + Style.agent + "transition: all .2s linear;\n}\n#boardNavDesktop,\n.pagelist {\n  " + Style.sidebarLocation[0] + ": " + (Style.sidebar + parseInt(_conf["Right Thread Padding"], 10) + editSpace["right"]) + "px;\n  " + Style.sidebarLocation[1] + ": " + (parseInt(_conf["Left Thread Padding"], 10) + editSpace["left"] + 2) + "px;\n}\n.inline .post {\n  padding-bottom: 2px;\n}\n#boardNavDesktopFoot:not(:hover) {\n  border-color: transparent;\n  background-color: transparent;\n}\n#navlinks a {\n  position: fixed;\n  color: transparent;\n  opacity: 0.5;\n  display: inline-block;\n  font-size: 0;\n  border-right: 6px solid transparent;\n  border-left: 6px solid transparent;\n  margin: 1.5px;\n}\n.selectrice li {\n  list-style-type: none;\n}\n.rice {\n  cursor: pointer;\n  width: 9px;\n  height: 9px;\n  margin: 2px 3px;\n  display: inline-block;\n  vertical-align: bottom;\n}\n.selectrice {\n  position: relative;\n  cursor: default;\n  overflow: hidden;\n  text-align: left;\n}\n.selectrice::after {\n  display: block;\n  content: \"\";\n  border-right: .25em solid transparent;\n  border-left: .25em solid transparent;\n  position: absolute;\n  right: .4em;\n  top: .5em;\n}\n.selectrice::before {\n  display: block;\n  content: \"\";\n  height: 1.7em;\n  position: absolute;\n  right: 1.3em;\n  top: 0;\n}\n.selectrice ul {\n  padding: 0;\n  position: fixed;\n  max-height: 120px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  z-index: 99999;\n}\ninput[type=checkbox]:checked + .rice {\n  background-attachment: scroll;\n  background-repeat: no-repeat;\n  background-position: bottom right;\n}\n.name,\n.post-author {\n  " + (_conf["Bolds"] ? 'font-weight: 600;' : '') + "\n}\n.post-author .post-tripcode {\n  font-weight: 400;\n}\n") + (_conf["Hide Navigation Decorations"] ? "#boardNavDesktop,\n.pages {\n  font-size: 0;\n  color: transparent;\n  word-spacing: 2px;\n}\n.pages {\n  word-spacing: 0;\n}\n.pages a {\n  margin: 1px;\n}\n" : "") + (_conf["Circle Checkboxes"] ? ".riced {\n  display: none;\n}\n.rice {\n  border-radius: 6px;\n}\n" : "") + (_conf['Color user IDs'] ? ".posteruid .hand {\n  padding: 0 5px;\n  border-radius: 6px;\n  font-size: 0.8em;\n}\n" : "") + (_conf["Recursive Filtering"] ? ".hidden + .threadContainer {\n  display: none;\n}\n" : "") + (_conf["Reply Spacing"] === "none" ? ".thread > .replyContainer:not(:last-of-type) .post.reply:not(:target) {\n  border-bottom-width: 0;\n}\n" : "") + (_conf["Faded 4chan Banner"] ? ".boardBanner {\n  opacity: 0.5;\n  " + Style.agent + "transition: opacity 0.3s ease-in-out .5s;\n}\n.boardBanner:hover {\n  opacity: 1;\n  " + Style.agent + "transition: opacity 0.3s ease-in;\n}\n" : "") + (_conf["4chan Banner Reflection"] ? "/* From 4chan SS / OneeChan */\n.gecko .boardBanner::after {\n  background-image: -moz-element(#Banner);\n  bottom: -100%;\n  content: '';\n  left: 0;\n  mask: url(\"data:image/svg+xml,<svg version='1.1' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient gradientUnits='objectBoundingBox' id='gradient' x2='0' y2='1'><stop stop-offset='0'/><stop stop-color='white' offset='1'/></linearGradient><mask id='mask' maskUnits='objectBoundingBox' maskContentUnits='objectBoundingBox' x='0' y='0' width='100%' height='100%'> <rect fill='url(%23gradient)' width='1' height='1' /></mask></defs></svg>#mask\");\n  opacity: 0.3;\n  position: absolute;\n  right: 0;\n  top: 100%;\n  z-index: 1;\n  -moz-transform: scaleY(-1);\n}\n.webkit #Banner {\n  -webkit-box-reflect: below 0 -webkit-linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0) 10%, rgba(255,255,255,.5));\n}\n" : "") + (_conf["Slideout Transitions"] ? "#globalMessage,\n#watcher,\n#boardNavDesktopFoot {\n  " + Style.agent + "transition: height .3s linear, border .3s linear, background-color .3s step-end;\n}\n#globalMessage:hover,\n#watcher:hover,\n#boardNavDesktopFoot:hover {\n  " + Style.agent + "transition: height .3s linear, border .3s linear, background-color .3s step-start;\n}\n#imgControls {\n  " + Style.agent + "transition: width .2s linear;\n}\n" : "") + (_conf["Post Form Slideout Transitions"] ? "#qr {\n  " + Style.agent + "transition: " + Style.sidebarLocation[0] + " .3s ease-in-out 1s;\n}\n#qr:hover,\n#qr.focus,\n#qr.dump {\n  " + Style.agent + "transition: " + Style.sidebarLocation[0] + " .3s linear;\n}\n#qrtab {\n  " + Style.agent + "transition: opacity .3s ease-in-out 1s, " + Style.sidebarLocation[0] + " .3s ease-in-out 1s;\n}\n" : "") + (_conf["Hide Horizontal Rules"] ? "hr {\n  visibility: hidden;\n}\n" : "") + (_conf["Post Form Style"] !== "float" ? (".captcha img {\n  height: 4em;\n  width: " + (width - 2) + "px;\n}\ntextarea.field {\n  width: " + width + "px;\n}\n#qr {\n  border: 1px transparent solid;\n  padding: 1px;\n  overflow: visible;\n  top: auto !important;\n  bottom: 1.6em !important;\n  width: " + width + "px;\n  margin: 0;\n  z-index: 5 !important;\n}\ninput[title=\"Verification\"],\n.captchaimg {\n  margin-top: 1px;\n}\n#qr .warning,\n#threadselect .selectrice,\ninput,\n.field {\n  margin: 1px 0 0;\n}\n#file {\n  width: " + (177 + Style.sidebarOffset.W) + "px;\n}\n#buttons input {\n  width: 70px;\n  margin: 1px 0 0 1px;\n}") + (_conf["Compact Post Form Inputs"] ? "#qr textarea.field {\n  height: 14.8em;\n  min-height: 9em;\n  min-width: " + width + "px;\n}\n#qr.captcha textarea.field {\n  height: 9em;\n  min-height: 9em;\n}\n#qr .field[name=\"name\"],\n#qr .field[name=\"email\"],\n#qr .field[name=\"sub\"] {\n  width: " + (75 + (Style.sidebarOffset.W / 3)) + "px !important;\n  margin-top: 0 !important;\n  margin-left: 1px !important;\n}\n" : "#qr textarea.field {\n  height: 11.6em;\n  min-height: 11.6em;\n  min-width: " + width + "px\n}\n#qr.captcha textarea.field {\n  height: 6em;\n  min-height: 6em;\n}\n#qr .field[name=\"email\"],\n#qr .field[name=\"sub\"] {\n  width: " + width + "px !important;\n}\n#qr .field[name=\"name\"] {\n  width: " + (227 + Style.sidebarOffset.W) + "px !important;\n  margin-left: 1px !important;\n  margin-top: 0 !important;\n}\n#qr .field[name=\"email\"],\n#qr .field[name=\"sub\"] {\n  margin-top: 1px;\n}\n") + (_conf["Textarea Resize"] === "auto-expand" ? "#qr textarea {\n  display: block;\n  " + Style.agent + "transition:\n    color 0.25s linear,\n    background-color 0.25s linear,\n    background-image 0.25s linear,\n    height step-end,\n    width " + (_conf["Slideout Transitions"] ? ".3s ease-in-out .3s" : "step-end") + ";\n  float: " + Style.sidebarLocation[0] + ";\n  resize: vertical;\n}\n#qr textarea:focus {\n  width: 400px;\n}\n" : "#qr textarea {\n  display: block;\n  " + Style.agent + "transition:\n    color 0.25s linear,\n    background-color 0.25s linear,\n    background-image 0.25s linear,\n    border-color 0.25s linear,\n    height step-end,\n    width step-end;\n  float: " + Style.sidebarLocation[0] + ";\n  resize: " + _conf["Textarea Resize"] + "\n}\n") : "") + (_conf["Fit Width Replies"] ? ".thread .replyContainer {\n  position: relative;\n  clear: both;\n}\n.replyContainer > .post {\n  display: table;\n  width: 100%;\n}\n.hide_reply_button a,\n.menu_button {\n  position: absolute;\n  right: 6px;\n  top: 4px;\n  font-size: 9px;\n}\n.hide_reply_button a {\n  " + (_conf["Menu"] ? "right: 27px;" : "") + "\n}\n.summary {\n  padding-left: 20px;\n  clear: both;\n}\n.hide_reply_button {\n  width: 0;\n}\n.hide_reply_button.stub {\n  width: auto;\n}\n.hide_reply_button a,\n.menu_button {\n  opacity: 0;\n  " + Style.agent + "transition: opacity .3s ease-out 0s;\n}\n.hide_reply_button.stub a {\n  position: static;\n  opacity: 1;\n}\n.op:hover .menu_button,\n.replyContainer:hover .menu_button,\n.replyContainer:hover .hide_reply_button a {\n  opacity: 1;\n  " + Style.agent + "transition: opacity .3s ease-in 0s;\n}\n.inline .menu_button {\n  position: static;\n  opacity: 1;\n}\n#options.reply {\n  display: inline-block;\n}\n" : ".hide_reply_button {\n  padding: 3px;\n  float: left;\n}\n.reply.post {\n  position: relative;\n  overflow: visible;\n  display: table;\n}\n") + (_conf['Force Reply Break'] ? ".summary,\n.replyContainer {\n  clear: both;\n}\n" : "") + (_conf["Filtered Backlinks"] ? ".filtered.backlink {\n  display: none;\n}\n" : "") + (_conf["Slideout Watcher"] ? "#watcher:not(:hover) {\n  border-color: transparent;\n  background-color: transparent;\n}\n#watcher {\n  position: fixed;\n  " + Style.sidebarLocation[0] + ": 2px !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n  bottom: auto !important;\n  height: 0;\n  width: " + width + "px !important;\n  overflow: hidden;\n}\n#watcher:hover {\n  height: " + (_conf["Slideout Transitions"] ? '250px' : 'auto') + ";\n  overflow: auto;\n  padding-bottom: 4px;\n}\n" : "#watcher::after {\n  display: none;\n}\n#watcher {\n  width: " + (246 + Style.sidebarOffset.W) + "px;\n  padding-bottom: 4px;\n  z-index: 96;\n}\n#watcher > .move {\n  cursor: pointer !important;\n}\n") + (_conf["OP Background"] ? ".opContainer .post {\n  padding: 5px;\n  " + Style.agent + "box-sizing: border-box;\n  box-sizing: border-box;\n}\n" : "") + (_conf["Tripcode Hider"] ? "input.field.tripped:not(:hover):not(:focus) {\n  color: transparent !important;\n  text-shadow: none !important;\n}\n" : "") + (_conf["Block Ads"] ? "/* AdBlock Minus */\n.bottomad + hr,\na[href*=\"jlist\"],\nimg[src^=\"//static.4chan.org/support/\"] {\n  display: none;\n}\n" : "") + (_conf["Shrink Ads"] ? "a[href*=\"jlist\"],\nimg[src^=\"//static.4chan.org/support/\"] {\n  width: 500px;\n  height: auto;\n}\n" : "") + (_conf["Emoji"] !== "disable" ? Style.emoji(_conf["Emoji Position"]) : "") + (_conf["4chan SS Sidebar"] ? "body::before {\n  content: \"\";\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  " + Style.sidebarLocation[0] + ": 0;\n  width: " + (_conf["Sidebar"] === "large" ? 305 : _conf["Sidebar"] === "normal" ? 254 : _conf["Sidebar"] === "minimal" ? 27 : 0) + "px;\n  z-index: 1;\n  " + Style.agent + "box-sizing: border-box;\n  box-sizing: border-box;\n  display: block;\n}" : "") + (_conf["4chan SS Navigation"] ? "" + (["sticky top", "sticky bottom"].contains(_conf["Pagination"]) ? ".pagelist," : "") + "\n#boardNavDesktop {\n  left: 0;\n  right: 0;\n  padding-" + _conf["Sidebar Location"] + ": " + Style.sidebar + "px;\n  border-left: 0;\n  border-right: 0;\n  border-radius: 0 !important;\n}\n#delform {\n  margin-top: -2px;\n}\n#delform,\n.board,\n.thread {\n  padding-" + Style.sidebarLocation[0] + ": 0 !important;\n}" : "") + {
        "at sidebar top": "#boardTitle {\n  position: fixed;\n  " + Style.sidebarLocation[0] + ": 2px;\n  top: " + ((Style.logoOffset === 0 && _conf["Icon Orientation"] !== "vertical" ? 40 : 21) + Style.logoOffset) + "px;\n  width: " + width + "px;\n}\n",
        "at sidebar bottom": "#boardTitle {\n  position: fixed;\n  " + Style.sidebarLocation[0] + ": 2px;\n  bottom: 280px;\n  width: " + width + "px;\n}\n",
        "under post form": "#boardTitle {\n  position: fixed;\n  " + Style.sidebarLocation[0] + ": 2px;\n  bottom: 140px;\n  width: " + width + "px;\n}\n",
        "at top": "",
        "hide": "#boardTitle {\n  display: none;\n}\n"
      }[_conf["Board Title"]] + (".postContainer blockquote {\n  margin: " + {
        "phat": '24px 60px 24px 58px;',
        "normal": '12px 40px 12px 38px;',
        "slim": '6px 20px  6px 23px;',
        "super slim": '3px 10px  3px 15px;',
        "anorexia": '1px  5px  1px 11px;'
      }[_conf["Reply Padding"]] + '\n}\n') + (_conf["Rounded Edges"] ? (_conf["Post Form Style"] === "float" ? "#qr {\n  border-radius: 6px 6px 0 0;\n}\n" : "") + ((function() {
        switch (_conf["Boards Navigation"]) {
          case "sticky top":
          case "top":
            return "#boardNavDesktop {\n  border-radius: 0 0 3px 3px;\n}\n";
          case "sticky bottom":
            return "#boardNavDesktop {\n  border-radius: 3px 3px 0 0;\n}\n";
        }
      })()) + ((function() {
        switch (_conf["Pagination"]) {
          case "sticky top":
          case "top":
            return ".pagelist {\n  border-radius: 0 0 3px 3px;\n}\n";
          case "sticky bottom":
          case "bottom":
            return ".pagelist {\n  border-radius: 3px 3px 0 0;\n}\n";
        }
      })()) + (".rice {\n  border-radius: 2px;\n}\n#boardNavDesktopFoot,\n#optionsContent,\n#options .mascot,\n#options ul,\n#options,\n#post-preview,\n#qp,\n#qp .post,\n" + (_conf["Post Form Decorations"] ? "#qr," : "") + "\n#stats,\n#updater,\n#watcher,\n#globalMessage,\n.inline .reply,\n.opContainer,\n.replyContainer,\n.post,\nh2,\ntd[style=\"border: 1px dashed;\"] {\n  border-radius: 3px;\n}\n#options .selectrice ul {\n  border-radius: 0;\n}\n#optionsbar label[for] {\n  border-radius: 3px 3px 0 0;\n}\n#qrtab {\n  border-radius: 6px 6px 0 0;\n}\n") : "") + {
        compact: "#boardNavDesktopFoot {\n  word-spacing: 1px;\n}\n#boardNavDesktopFoot:hover {\n  height: " + (_conf["Slideout Transitions"] ? '84px' : 'auto') + ";\n}\n",
        list: "#boardNavDesktopFoot a {\n  display: block;\n}\n#boardNavDesktopFoot:hover {\n  height: 300px;\n  overflow-y: scroll;\n}\n#boardNavDesktopFoot a::after {\n  content: \" - \" attr(title);\n}\n#boardNavDesktopFoot a[href*=\"//boards.4chan.org/\"]::after,\n#boardNavDesktopFoot a[href*=\"//rs.4chan.org/\"]::after {\n  content: \"/ - \" attr(title);\n}\n#boardNavDesktopFoot a[href*=\"//boards.4chan.org/\"]::before,\n#boardNavDesktopFoot a[href*=\"//rs.4chan.org/\"]::before {\n  content: \"/\";\n}\n",
        hide: "#boardNavDesktopFoot {\n  display: none;\n}\n"
      }[_conf["Slideout Navigation"]] + {
        "4chan default": "#globalMessage {\n  position: static;\n  background: none;\n  border: none;\n  margin: 0 auto;\n}\n#globalMessage::after {\n  display: none;\n}\n",
        "slideout": "#globalMessage:not(:hover) {\n  border-color: transparent;\n  background-color: transparent;\n}\n#globalMessage {\n  bottom: auto;\n  position: fixed;\n  " + Style.sidebarLocation[0] + ": 0;\n  " + Style.sidebarLocation[1] + ": auto;\n  width: " + width + "px;\n  height: 0;\n  overflow: hidden;\n  " + Style.agent + "box-sizing: border-box;\n  box-sizing: border-box;\n}\n#globalMessage:hover {\n  height: " + (_conf["Slideout Transitions"] ? '250px' : 'auto') + ";\n  overflow: auto;\n}\n",
        "hide": "#globalMessage,\n#globalMessage::after {\n  display: none;\n}\n"
      }[_conf["Announcements"]] + {
        "sticky top": "#boardNavDesktop {\n  position: fixed;\n  top: 0;\n}\n",
        "sticky bottom": "#boardNavDesktop {\n  position: fixed;\n  bottom: 0;\n}\n",
        "top": "#boardNavDesktop {\n  position: absolute;\n  top: 0;\n}\n",
        "hide": "#boardNavDesktop {\n  position: absolute;\n  top: -100px;\n}\n"
      }[_conf["Boards Navigation"]] + {
        "sticky top": ".pagelist {\n  position: fixed;\n  top: 0;\n  z-index: 94;\n}\n",
        "sticky bottom": ".pagelist {\n  position: fixed;\n  bottom: 0;\n  z-index: 94;\n}\n",
        "top": ".pagelist {\n  position: absolute;\n  top: 0;\n}\n",
        "bottom": "",
        "on side": ".pagelist {\n  padding: 0;\n  top: auto;\n  bottom: 269px;\n  " + Style.sidebarLocation[1] + ": auto;\n  " + (Style.sidebarLocation[0] === "left" ? "left: 0" : "right: " + (250 + Style.sidebarOffset.W) + "px") + ";\n  position: fixed;\n  " + Style.agent + "transform: rotate(90deg);\n  " + Style.agent + "transform-origin: bottom right;\n  z-index: 6;\n  margin: 0;\n  background: none transparent;\n  border: 0 none;\n}\n",
        "hide": ".pagelist {\n  display: none;\n}\n"
      }[_conf["Pagination"]] + {
        "fixed": "" + (!_conf['Show Post Form Header'] ? '\
#qrtab {\
  display: none;\
}' : '\
#qrtab input,\
#qrtab .rice {\
  display: none;\
}') + "\n#qrtab {\n  margin-bottom: 1px;\n}\n#qr {\n  " + Style.sidebarLocation[0] + ": 0 !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n}\n",
        "slideout": "" + (!_conf['Show Post Form Header'] ? '\
#qrtab {\
  display: none;\
}' : '\
#qrtab input,\
#qrtab .rice {\
  display: none;\
}') + "\n#qrtab {\n  margin-bottom: 1px;\n}\n#qr {\n  " + Style.sidebarLocation[0] + ": -" + (233 + Style.sidebarOffset.W) + "px !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n}\n#qr:hover,\n#qr.focus,\n#qr.dump {\n  " + Style.sidebarLocation[0] + ": 2px !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n}\n",
        "tabbed slideout": "#qrtab input,\n#qrtab .rice,\n#qrtab span {\n  display: none;\n}\n#qr {\n  " + Style.sidebarLocation[0] + ": -" + (251 + Style.sidebarOffset.W) + "px !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n}\n#qr:hover,\n#qr.focus,\n#qr.dump {\n  " + Style.sidebarLocation[0] + ": 0 !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n}\n#qr #qrtab {\n  " + Style.agent + "transform: rotate(" + (Style.sidebarLocation[0] === "left" ? "" : "-") + "90deg);\n  " + Style.agent + "transform-origin: bottom " + Style.sidebarLocation[0] + ";\n  position: fixed;\n  bottom: 220px;\n  " + Style.sidebarLocation[0] + ": 0;\n  width: 110px;\n  display: inline-block;\n  text-align: center;\n  vertical-align: middle;\n  border-width: 1px 1px 0 1px;\n  cursor: default;\n  text-rendering: optimizeLegibility;\n}\n#qr:hover #qrtab,\n#qr.focus #qrtab,\n#qr.dump #qrtab {\n  opacity: 0;\n  " + Style.sidebarLocation[0] + ": " + (252 + Style.sidebarOffset.W) + "px;\n  " + Style.agent + "transition: opacity .3s linear, " + Style.sidebarLocation[0] + " .3s linear;\n}\n",
        "transparent fade": "" + (!_conf['Show Post Form Header'] ? '\
#qrtab {\
  display: none;\
}' : '\
#qrtab input,\
#qrtab .rice {\
  display: none;\
}') + "\n#qrtab {\n  margin-bottom: 1px;\n}\n#qr {\n  " + Style.sidebarLocation[0] + ": 2px !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n  opacity: 0.2;\n  " + Style.agent + "transition: opacity .3s ease-in-out 1s;\n}\n#qr:hover,\n#qr.focus,\n#qr.dump {\n  opacity: 1;\n  " + Style.agent + "transition: opacity .3s linear;\n}\n",
        "float": "#qr {\n  z-index: 103;\n}\n#qr > .move,\n#qr textarea {\n  min-width: 302px;\n}\n#qr .captchaimg {\n  max-width: 100%;\n  overflow: hidden;\n}\n.autohide:not(:hover) > form {\n  display: none !important;\n}\ntextarea.field,\n#qr input[title=\"Verification\"] {\n  width: 100%;\n}\n#dump {\n  width: 10%;\n}\n#qr .userInfo .field:not(#dump) {\n  width: 95px;\n  max-width: 30%;\n  min-width: 30%;\n}\n#buttons input {\n  width: 25%;\n}\n#file {\n  width: 75%;\n}\n#qr.captcha textarea.field {\n  min-height: 120px;\n}\n#qr textarea.field {\n  min-height: 160px;\n  resize: resize;\n  " + Style.agent + "transition:\n    color 0.25s linear,\n    background-color 0.25s linear,\n    background-image 0.25s linear,\n    border-color 0.25s linear,\n    height step-end,\n    width step-end;\n  margin: 0;\n}\n"
      }[_conf["Post Form Style"]] + {
        "at sidebar top": ".boardBanner {\n  position: fixed;\n  top: 18px;\n  " + Style.sidebarLocation[0] + ": 2px;\n}\n.boardBanner img {\n  width: " + width + "px;\n}\n",
        "at sidebar bottom": ".boardBanner {\n  position: fixed;\n  bottom: 270px;\n  " + Style.sidebarLocation[0] + ": 2px;\n}\n.boardBanner img {\n  width: " + width + "px;\n}\n",
        "under post form": ".boardBanner {\n  position: fixed;\n  bottom: 130px;\n  " + Style.sidebarLocation[0] + ": 2px;\n}\n.boardBanner img {\n  width: " + width + "px;\n}\n",
        "at top": ".boardBanner {\n  position: relative;\n  display: table;\n  margin: 0 auto;\n  text-align: center;\n  z-index: -1;\n}\n",
        "hide": ".boardBanner {\n  display: none;\n}\n"
      }[_conf["4chan Banner"]] + {
        'lower left': ".container {\n  padding: 0 5px;\n  max-width: 100%;\n}\n.post.quoted {\n  padding-bottom: 15px;\n}\n.post .container {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  padding: 0 5px;\n}\n.post .container::before {\n  content: \"REPLIES: \";\n}\n.inline .container {\n  position: static;\n  max-width: 100%;\n}\n.inline .container::before {\n  content: \"\";\n}\n",
        'lower right': ".post.quoted {\n  padding-bottom: 15px;\n}\n.op .container {\n  float: right;\n}\n.post .container {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n}\n.container::before {\n  content: \"REPLIES: \";\n}\n.container {\n  max-width: 100%;\n  padding: 0 5px;\n}\n.inline .container {\n  position: static;\n  float: none;\n}\n.inline .container::before {\n  content: \"\";\n}\n",
        'default': ""
      }[_conf["Backlinks Position"]] + (_conf["Custom CSS"] ? _conf["customCSS"] : "");
    },
    theme: function(theme) {
      var background, backgroundC, bgColor, css, fileHeading, icons, replyHeading, _conf;
      _conf = Conf;
      bgColor = new Style.color(Style.colorToHex(backgroundC = theme["Background Color"]));
      Style.lightTheme = bgColor.isLight();
      icons = Icons.header.png + Icons.themes[_conf["Icons"]][Style.lightTheme ? "light" : "dark"];
      css = ".hide_thread_button span > span,\n.hide_reply_button span > span {\n  background-color: " + theme["Links"] + ";\n}\n#mascot_hide label {\n  border-bottom: 1px solid " + theme["Reply Border"] + ";\n}\n#content .thumb {\n  box-shadow: 0 0 5px " + theme["Reply Border"] + ";\n}\n.mascotname,\n.mascotoptions {\n  background: " + theme["Dialog Background"] + ";\n  border: 1px solid " + theme["Buttons Border"] + ";\n}\n.opContainer.filter_highlight {\n  box-shadow: inset 5px 0 " + theme["Backlinked Reply Outline"] + ";\n}\n.filter_highlight > .reply {\n  box-shadow: -5px 0 " + theme["Backlinked Reply Outline"] + ";\n}\n::" + Style.agent + "selection {\n  background: " + theme["Text"] + ";\n  color: " + backgroundC + ";\n}\nhr {\n  border-bottom: 1px solid " + theme["Reply Border"] + ";\n}\na[style=\"cursor: pointer; float: right;\"] + div[style^=\"width: 100%;\"] > table > tbody > tr > td {\n  background: " + backgroundC + " !important;\n  border: 1px solid " + theme["Reply Border"] + " !important;\n}\n#fs_status {\n  background: " + theme["Dialog Background"] + " !important;\n}\n#fs_data tr[style=\"background-color: #EA8;\"] {\n  background: " + theme["Reply Background"] + " !important;\n}\n#fs_data,\n#fs_data * {\n  border-color: " + theme["Reply Border"] + " !important;\n}\nhtml {\n  background: " + (backgroundC || '') + ";\n  background-image: " + (theme["Background Image"] || '') + ";\n  background-repeat: " + (theme["Background Repeat"] || '') + ";\n  background-attachment: " + (theme["Background Attachment"] || '') + ";\n  background-position: " + (theme["Background Position"] || '') + ";\n}\n#optionsContent,\n#exlinks-options-content,\n#mascotcontent,\n#themecontent {\n  background: " + backgroundC + ";\n  border: 1px solid " + theme["Reply Border"] + ";\n  padding: 5px;\n}\n#selected_tab {\n  background: " + backgroundC + ";\n  border-color: " + theme["Reply Border"] + ";\n  border-style: solid;\n}\n.captchaimg img {\n  " + (Style.filter(theme["Text"], theme["Input Background"])) + "\n}\n#boardTitle,\n#prefetch,\n#showQR,\n" + (!_conf["Post Form Decorations"] ? '#spoilerLabel,' : '') + "\n#stats,\n#updater:not(:hover) .move {\n  text-shadow:\n     1px  1px 0 " + backgroundC + ",\n    -1px -1px 0 " + backgroundC + ",\n     1px -1px 0 " + backgroundC + ",\n    -1px  1px 0 " + backgroundC + ",\n     0    1px 0 " + backgroundC + ",\n     0   -1px 0 " + backgroundC + ",\n     1px  0   0 " + backgroundC + ",\n    -1px  0   0 " + backgroundC + "\n    " + (_conf["Sidebar Glow"] ? ", 0 2px 5px " + theme['Text'] + ";" : ";") + "\n}\n/* Fixes text spoilers */\n\n\n    " + (_conf['Remove Spoilers'] && _conf['Indicate Spoilers'] ? ".spoiler::before,s::before {  content: '[spoiler]';}.spoiler::after,s::after {  content: '[/spoiler]';}" : !_conf['Remove Spoilers'] ? ".spoiler:not(:hover) *,s:not(:hover) * {  color: rgb(0,0,0) !important;  text-shadow: none !important;}.spoiler,s {  color: rgb(0,0,0);  background-color: rgb(0,0,0);}.spoiler:hover,s:hover {  color: " + theme["Text"] + ";  background-color: transparent;}" : "") + "\n#exlinks-options,\n#options,\n#qrtab,\n" + (_conf["Post Form Decorations"] ? "#qr," : "") + "\n#updater:hover,\ninput[type=\"submit\"],\ninput[value=\"Report\"],\nspan[style=\"left: 5px; position: absolute;\"] a {\n  background: " + theme["Buttons Background"] + ";\n  border: 1px solid " + theme["Buttons Border"] + ";\n}\n.enabled .mascotcontainer {\n  background: " + theme["Buttons Background"] + ";\n  border-color: " + theme["Buttons Border"] + ";\n}\n#dump,\n#file,\n#options input,\n.captchaimg,\n.dump #dump:not(:hover):not(:focus),\n.selectrice,\nbutton,\ninput,\ntextarea {\n  background: " + theme["Input Background"] + ";\n  border: 1px solid " + theme["Input Border"] + ";\n  color: " + theme["Inputs"] + ";\n}\n#dump:hover,\n#file:hover,\n#options .selectrice li:nth-of-type(2n+1):hover,\n.selectrice:hover,\n.selectrice li:hover,\ninput:hover,\ntextarea:hover {\n  background: " + theme["Hovered Input Background"] + ";\n  border-color: " + theme["Hovered Input Border"] + ";\n  color: " + theme["Inputs"] + ";\n}\n#dump:active,\n#dump:focus,\n.selectrice:focus,\n.selectrice li:focus,\ninput:focus,\ntextarea:focus,\ntextarea.field:focus {\n  background: " + theme["Focused Input Background"] + ";\n  border-color: " + theme["Focused Input Border"] + ";\n  color: " + theme["Inputs"] + ";\n}\n#mouseover,\n#post-preview,\n#qp .post,\n#xupdater,\n.reply.post {\n  border: 1px solid " + theme["Reply Border"] + ";\n  background: " + theme["Reply Background"] + ";\n}\n.exblock.reply,\n.reply.post.highlight,\n.reply.post:target {\n  background: " + theme["Highlighted Reply Background"] + ";\n  border: 1px solid " + theme["Highlighted Reply Border"] + ";\n}\n#boardNavDesktop,\n.pagelist {\n  background: " + theme["Navigation Background"] + ";\n  border: 1px solid " + theme["Navigation Border"] + ";\n}\n#delform {\n  background: " + theme["Thread Wrapper Background"] + ";\n  border: 1px solid " + theme["Thread Wrapper Border"] + ";\n}\n#boardNavDesktopFoot,\n#mascotConf,\n#mascot_hide,\n#menu,\n#selectrice,\n#themeConf,\n#watcher,\n#watcher:hover,\n.subMenu,\na[style=\"cursor: pointer; float: right;\"] ~ div[style^=\"width: 100%;\"] > table {\n  background: " + theme["Dialog Background"] + ";\n  border: 1px solid " + theme["Dialog Border"] + ";\n}\n#qr .warning {\n  background: " + theme["Input Background"] + ";\n  border: 1px solid " + theme["Input Border"] + ";\n}\n.disabledwarning,\n.warning {\n  color: " + theme["Warnings"] + ";\n}\n#navlinks a:first-of-type {\n  border-bottom: 11px solid rgb(" + (Style.lightTheme ? "130,130,130" : "230,230,230") + ");\n}\n#navlinks a:last-of-type {\n  border-top: 11px solid rgb(" + (Style.lightTheme ? "130,130,130" : "230,230,230") + ");\n}\n#charCount {\n  color: " + (Style.lightTheme ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)") + ";\n}\n.postNum a {\n  color: " + theme["Post Numbers"] + ";\n}\n.subject {\n  color: " + theme["Subjects"] + " !important;\n  " + (_conf["Bolds"] ? 'font-weight: 600;' : '') + "\n}\n.dateTime,\n.post-ago {\n  color: " + theme["Timestamps"] + " !important;\n}\n#fs_status a,\n#imgControls label::after,\n#updater #count:not(.new)::after,\n#showQR,\n#updater,\n.abbr,\n.boxbar,\n.boxcontent,\n.pages strong,\n.pln,\n.reply,\n.reply.highlight,\n.summary,\nbody,\nbutton,\nspan[style=\"left: 5px; position: absolute;\"] a,\ninput,\ntextarea {\n  color: " + theme["Text"] + ";\n}\n#exlinks-options-content > table,\n#options ul,\n.selectrice ul {\n  border-bottom: 1px solid " + theme["Reply Border"] + ";\n  box-shadow: inset " + theme["Shadow Color"] + " 0 0 5px;\n}\n.quote + .spoiler:hover,\n.quote {\n  color: " + theme["Greentext"] + ";\n}\n.forwardlink {\n  text-decoration: none;\n  border-bottom: 1px dashed " + theme["Backlinks"] + ";\n}\n.container::before {\n  color: " + theme["Timestamps"] + ";\n}\n#menu,\n#post-preview,\n#qp .opContainer,\n#qp .replyContainer,\n.subMenu {\n  box-shadow: " + (_conf['Quote Shadows'] ? "5px 5px 5px " + theme['Shadow Color'] : "") + ";\n}\n.rice {\n  background: " + theme["Checkbox Background"] + ";\n  border: 1px solid " + theme["Checkbox Border"] + ";\n}\n.selectrice::before {\n  border-left: 1px solid " + theme["Input Border"] + ";\n}\n.selectrice::after {\n  border-top: .45em solid " + theme["Inputs"] + ";\n}\n#updater input,\n.bd {\n  background: " + theme["Buttons Background"] + ";\n  border: 1px solid " + theme["Buttons Border"] + ";\n}\n.pages a,\n#boardNavDesktop a {\n  color: " + theme["Navigation Links"] + ";\n}\ninput[type=checkbox]:checked + .rice {\n  background: " + theme["Checkbox Checked Background"] + ";\n  background-image: url(" + (Icons.header.png + (Style.lightTheme ? "AkAAAAJCAMAAADXT/YiAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==" : "AkAAAAJCAMAAADXT/YiAAAAWlBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jZLFEAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==")) + ");\n}\n#dump,\n.button,\n.entry,\n.replylink,\na {\n  color: " + theme["Links"] + ";\n}\n.backlink {\n  color: " + theme["Backlinks"] + ";\n}\n.qiQuote,\n.quotelink {\n  color: " + theme["Quotelinks"] + ";\n}\n#dump:hover,\n.entry:hover,\n.sideArrows a:hover,\n.replylink:hover,\n.qiQuote:hover,\n.quotelink:hover,\na .name:hover,\na .postertrip:hover,\na:hover {\n  color: " + theme["Hovered Links"] + ";\n}\n#boardNavDesktop a:hover,\n#boardTitle a:hover {\n  color: " + theme["Hovered Navigation Links"] + ";\n}\n#boardTitle {\n  color: " + theme["Board Title"] + ";\n}\n.name,\n.post-author {\n  color: " + theme["Names"] + " !important;\n}\n.post-tripcode,\n.postertrip,\n.trip {\n  color: " + theme["Tripcodes"] + " !important;\n}\na .postertrip,\na .name {\n  color: " + theme["Emails"] + ";\n}\n.post.reply.qphl,\n.post.op.qphl {\n  border-color: " + theme["Backlinked Reply Outline"] + ";\n  background: " + theme["Highlighted Reply Background"] + ";\n}\n.inline .post {\n  box-shadow: " + (_conf['Quote Shadows'] ? "5px 5px 5px " + theme['Shadow Color'] : "") + ";\n}\n.placeholder,\n#qr input::" + Style.agent + "placeholder,\n#qr textarea::" + Style.agent + "placeholder {\n  color: " + (Style.lightTheme ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)") + " !important;\n}\n#qr input:" + Style.agent + "placeholder,\n#qr textarea:" + Style.agent + "placeholder,\n.placeholder {\n  color: " + (Style.lightTheme ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)") + " !important;\n}\n#options ul,\n.boxcontent dd,\n.selectrice ul {\n  border-color: " + (Style.lightTheme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)") + ";\n}\n#options li,\n.selectrice li:not(:first-of-type) {\n  border-top: 1px solid " + (Style.lightTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.025)") + ";\n}\n#mascot img {\n  " + Style.agent + "transform: scaleX(" + (Style.sidebarLocation[0] === "left" ? "-" : "") + "1);\n}\n\n#navtopright .exlinksOptionsLink::after,\n#settingsWindowLink,\n.navLinks > a:first-of-type::after,\n#watcher::after,\n#globalMessage::after,\n#boardNavDesktopFoot::after,\na[style=\"cursor: pointer; float: right;\"]::after,\n#imgControls label:first-of-type::after,\n#catalog::after,\n#fappeTyme {\n  background-image: url('" + icons + "');\n}\n" + theme["Custom CSS"] + "\n";
      css += (Style.lightTheme ? ".prettyprint {\n  background-color: #e7e7e7;\n  border: 1px solid #dcdcdc;\n}\n.com {\n  color: #dd0000;\n}\n.str,\n.atv {\n  color: #7fa61b;\n}\n.pun {\n  color: #61663a;\n}\n.tag {\n  color: #117743;\n}\n.kwd {\n  color: #5a6F9e;\n}\n.typ,\n.atn {\n  color: #9474bd;\n}\n.lit {\n  color: #368c72;\n}\n" : ".prettyprint {\n  background-color: rgba(0,0,0,.1);\n  border: 1px solid rgba(0,0,0,0.5);\n}\n.tag {\n  color: #96562c;\n}\n.pun {\n  color: #5b6f2a;\n}\n.com {\n  color: #a34443;\n}\n.str,\n.atv {\n  color: #8ba446;\n}\n.kwd {\n  color: #987d3e;\n}\n.typ,\n.atn {\n  color: #897399;\n}\n.lit {\n  color: #558773;\n}\n");
      if (_conf["Alternate Post Colors"]) {
        css += ".replyContainer:not(.hidden):nth-of-type(2n+1) .post {\n  background-image: " + Style.agent + "linear-gradient(" + (Style.lightTheme ? "rgba(0,0,0,0.05), rgba(0,0,0,0.05)" : "rgba(255,255,255,0.02), rgba(255,255,255,0.02)") + ");\n}\n";
      }
      if (_conf["Color Reply Headings"]) {
        css += ".postInfo {\n  background: " + ((replyHeading = new Style.color(Style.colorToHex(theme["Reply Background"]))) ? "rgb(" + (replyHeading.shiftRGB(16, true)) + ")" : "rgba(0,0,0,0.1)") + ";\n}\n";
      }
      if (_conf["Color File Info"]) {
        css += ".file {\n  background: " + ((fileHeading = new Style.color(Style.colorToHex(theme["Reply Background"]))) ? "rgb(" + (fileHeading.shiftRGB(8, true)) + ")" : "rgba(0,0,0,0.1)") + ";\n}\n";
      }
      if (_conf["OP Background"]) {
        css += ".op.post {\n  background: " + theme["Reply Background"] + ";\n  border: 1px solid " + theme["Reply Border"] + ";\n}\n.op.post:target\n.op.post.highlight {\n  background: " + theme["Highlighted Reply Background"] + ";\n  border: 1px solid " + theme["Highlighted Reply Border"] + ";\n}\n";
      }
      if (_conf["4chan SS Sidebar"]) {
        background = new Style.color(Style.colorToHex(theme["Reply Background"]));
        css += "body::before {\n  background: none repeat scroll 0% 0% rgba(" + (background.shiftRGB(-18)) + ", 0.8);\n  border-" + Style.sidebarLocation[1] + ": 2px solid " + backgroundC + ";\n  box-shadow:\n    " + (_conf["Sidebar Location"] === "right" ? "inset" : "") + "  1px 0 0 " + theme["Thread Wrapper Border"] + ",\n    " + (_conf["Sidebar Location"] === "left" ? "inset" : "") + " -1px 0 0 " + theme["Thread Wrapper Border"] + ";\n}\n";
      }
      css += {
        text: "a.useremail[href*=\"sage\"]:last-of-type::" + _conf["Sage Highlight Position"] + ",\na.useremail[href*=\"Sage\"]:last-of-type::" + _conf["Sage Highlight Position"] + ",\na.useremail[href*=\"SAGE\"]:last-of-type::" + _conf["Sage Highlight Position"] + " {\n  content: \" (sage) \";\n  color: " + theme["Sage"] + ";\n}\n",
        image: "a.useremail[href*=\"sage\"]:last-of-type::" + _conf["Sage Highlight Position"] + ",\na.useremail[href*=\"Sage\"]:last-of-type::" + _conf["Sage Highlight Position"] + ",\na.useremail[href*=\"SAGE\"]:last-of-type::" + _conf["Sage Highlight Position"] + " {\n  content: url(\"" + Icons.header.png + "A4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=\");\n  vertical-align: top;\n  margin-" + (_conf["Sage Highlight Position"] === "before" ? "right" : "left") + ": " + (parseInt(_conf['Emoji Spacing'])) + "px;\n}\n",
        none: ""
      }[_conf["Sage Highlighting"]];
      if (_conf["Announcements"] === "slideout") {
        css += "#globalMessage {\n  background: " + theme["Dialog Background"] + ";\n  border: 1px solid " + theme["Dialog Border"] + ";\n}\n";
      }
      if (_conf["Post Form Style"] === "float" || _conf["Post Form Decorations"]) {
        css += "#qr {\n  border: 1px solid " + theme["Buttons Border"] + ";\n  background: " + backgroundC + ";\n  box-shadow: " + (_conf['Quote Shadows'] ? "5px 5px 5px " + theme['Shadow Color'] : "") + ";\n}\n";
      }
      return css;
    }
  };

  /*
    Style.color adapted from 4chan Style Script
  */


  ThemeTools = {
    init: function(key) {
      var colorInput, div, fileInput, header, input, item, layout, themecontent, _i, _j, _len, _len1, _ref;
      Conf['editMode'] = "theme";
      if (Themes[key]) {
        editTheme = JSON.parse(JSON.stringify(Themes[key]));
        if (($.get("userThemes", {}))[key]) {
          editTheme["Theme"] = key;
        } else {
          editTheme["Theme"] = key += " [custom]";
        }
      } else {
        editTheme = {};
        editTheme["Theme"] = "Untitled";
        editTheme["Author"] = "Author";
        editTheme["Author Tripcode"] = "Unknown";
      }
      layout = ["Background Image", "Background Attachment", "Background Position", "Background Repeat", "Background Color", "Thread Wrapper Background", "Thread Wrapper Border", "Dialog Background", "Dialog Border", "Reply Background", "Reply Border", "Highlighted Reply Background", "Highlighted Reply Border", "Backlinked Reply Outline", "Input Background", "Input Border", "Hovered Input Background", "Hovered Input Border", "Focused Input Background", "Focused Input Border", "Checkbox Background", "Checkbox Border", "Checkbox Checked Background", "Buttons Background", "Buttons Border", "Navigation Background", "Navigation Border", "Links", "Hovered Links", "Quotelinks", "Backlinks", "Navigation Links", "Hovered Navigation Links", "Names", "Tripcodes", "Emails", "Subjects", "Text", "Inputs", "Post Numbers", "Greentext", "Sage", "Board Title", "Timestamps", "Warnings", "Shadow Color"];
      ThemeTools.dialog = $.el("div", {
        id: "themeConf",
        className: "reply dialog",
        innerHTML: "<div id=themebar></div><hr><div id=themecontent></div><div id=save>  <a href='javascript:;'>Save</a></div><div id=upload>  <a href='javascript:;'>Select Image</a></div><div id=close>  <a href='javascript:;'>Close</a></div>"
      });
      header = $.el("div", {
        innerHTML: "<input class='field subject' name='Theme' placeholder='Theme' value='" + key + "'> by<input class='field name' name='Author' placeholder='Author' value='" + editTheme['Author'] + "'><input class='field postertrip' name='Author Tripcode' placeholder='Author Tripcode' value='" + editTheme['Author Tripcode'] + "'>"
      });
      _ref = $$("input", header);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        $.on(input, 'blur', function() {
          return editTheme[this.name] = this.value;
        });
      }
      $.add($("#themebar", ThemeTools.dialog), header);
      themecontent = $("#themecontent", ThemeTools.dialog);
      for (_j = 0, _len1 = layout.length; _j < _len1; _j++) {
        item = layout[_j];
        if (!editTheme[item]) {
          editTheme[item] = '';
        }
        div = $.el("div", {
          className: "themevar",
          innerHTML: "<div class=optionname><b>" + item + "</b></div><div class=option><input name='" + item + "' placeholder='" + (item === "Background Image" ? "Shift+Click to upload image" : item) + "'>"
        });
        input = $('input', div);
        input.value = editTheme[item];
        switch (item) {
          case "Background Image":
            input.className = 'field';
            fileInput = $.el('input', {
              type: 'file',
              accept: "image/*",
              title: "BG Image",
              hidden: "hidden"
            });
            $.on(input, 'click', function(evt) {
              if (evt.shiftKey) {
                return this.nextSibling.click();
              }
            });
            $.on(fileInput, 'change', function(evt) {
              return ThemeTools.uploadImage(evt, this);
            });
            $.after(input, fileInput);
            break;
          case "Background Attachment":
          case "Background Position":
          case "Background Repeat":
            input.className = 'field';
            break;
          default:
            input.className = "colorfield";
            colorInput = $.el('input', {
              className: 'color',
              value: "#" + (Style.colorToHex(input.value))
            });
            JSColor.bind(colorInput);
            $.after(input, colorInput);
        }
        $.on(input, 'blur', function() {
          var depth, i, toggle1, toggle2, _k, _ref1;
          depth = 0;
          if (!(this.value.length > 1000)) {
            for (i = _k = 0, _ref1 = this.value.length - 1; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
              switch (this.value[i]) {
                case '(':
                  depth++;
                  break;
                case ')':
                  depth--;
                  break;
                case '"':
                  toggle1 = !toggle1;
                  break;
                case "'":
                  toggle2 = !toggle2;
              }
            }
          }
          if (depth !== 0 || toggle1 || toggle2) {
            return alert("Syntax error on " + this.name + ".");
          }
          if (this.className === "colorfield") {
            this.nextSibling.value = "#" + (Style.colorToHex(this.value));
            this.nextSibling.color.importColor();
          }
          return editTheme[this.name] = this.value;
        });
        Style.addStyle(editTheme);
        $.add(themecontent, div);
      }
      $.add(themecontent, div);
      if (!editTheme["Custom CSS"]) {
        editTheme["Custom CSS"] = "";
      }
      div = $.el("div", {
        className: "themevar",
        innerHTML: "<div class=optionname><b>Custom CSS</b></div><div class=option><textarea name='Custom CSS' placeholder='Custom CSS'>" + editTheme['Custom CSS'] + "</textarea>"
      });
      $.on($('textarea', div), 'blur', function() {
        editTheme["Custom CSS"] = this.value;
        return Style.themeCSS.textContent = Style.theme(editTheme);
      });
      $.add(themecontent, div);
      $.on($('#save > a', ThemeTools.dialog), 'click', function() {
        return ThemeTools.save(editTheme);
      });
      $.on($('#close > a', ThemeTools.dialog), 'click', ThemeTools.close);
      $.add(d.body, ThemeTools.dialog);
      return Style.themeCSS.textContent = Style.theme(editTheme);
    },
    uploadImage: function(evt, el) {
      var file, reader;
      file = evt.target.files[0];
      reader = new FileReader();
      reader.onload = function(evt) {
        var val;
        val = 'url("' + evt.target.result + '")';
        el.previousSibling.value = val;
        editTheme["Background Image"] = val;
        return Style.themeCSS.textContent = Style.theme(editTheme);
      };
      return reader.readAsDataURL(file);
    },
    importtheme: function(origin, evt) {
      var file, reader;
      file = evt.target.files[0];
      reader = new FileReader();
      reader.onload = function(e) {
        var bgColor, bgRPA, blinkColor, brderColor, imported, inputColor, inputbColor, jlinkColor, linkColor, linkHColor, mainColor, name, nameColor, quoteColor, sageColor, textColor, timeColor, titleColor, tripColor, userThemes;
        try {
          imported = JSON.parse(e.target.result);
        } catch (err) {
          alert(err);
          return;
        }
        if (!((origin !== 'appchan' && imported.mainColor) || (origin === 'appchan' && imported["Author Tripcode"]))) {
          alert("Theme file is invalid.");
          return;
        }
        name = imported.name || imported["Theme"];
        delete imported.name;
        if (Themes[name] && !Themes[name]["Deleted"]) {
          if (confirm("A theme with this name already exists. Would you like to over-write?")) {
            delete Themes[name];
          } else {
            return;
          }
        }
        if (origin === "oneechan" || origin === "SS") {
          bgColor = new Style.color(imported.bgColor);
          mainColor = new Style.color(imported.mainColor);
          brderColor = new Style.color(imported.brderColor);
          inputColor = new Style.color(imported.inputColor);
          inputbColor = new Style.color(imported.inputbColor);
          blinkColor = new Style.color(imported.blinkColor);
          jlinkColor = new Style.color(imported.jlinkColor);
          linkColor = new Style.color(imported.linkColor);
          linkHColor = new Style.color(imported.linkHColor);
          nameColor = new Style.color(imported.nameColor);
          quoteColor = new Style.color(imported.quoteColor);
          sageColor = new Style.color(imported.sageColor);
          textColor = new Style.color(imported.textColor);
          titleColor = new Style.color(imported.titleColor);
          tripColor = new Style.color(imported.tripColor);
          timeColor = new Style.color(imported.timeColor || imported.textColor);
          if (imported.bgRPA) {
            bgRPA = imported.bgRPA.split(' ');
          } else {
            bgRPA = ['no-repeat', 'bottom', 'left', 'fixed'];
          }
          if (origin === "oneechan") {
            Themes[name] = {
              'Author': "Anonymous",
              'Author Tripcode': "!POMF.9waa",
              'Background Image': 'url("' + (imported.bgImg || '') + '")',
              'Background Attachment': bgRPA[3] || '',
              'Background Position': ((bgRPA[1] + " ") || '') + (bgRPA[2] || ''),
              'Background Repeat': bgRPA[0] || '',
              'Background Color': 'rgb(' + bgColor.rgb + ')',
              'Dialog Background': 'rgba(' + mainColor.rgb + ',.98)',
              'Dialog Border': 'rgb(' + brderColor.rgb + ')',
              'Thread Wrapper Background': 'rgba(0,0,0,0)',
              'Thread Wrapper Border': 'rgba(0,0,0,0)',
              'Reply Background': 'rgba(' + mainColor.rgb + ',' + imported.replyOp + ')',
              'Reply Border': 'rgb(' + brderColor.rgb + ')',
              'Highlighted Reply Background': 'rgba(' + mainColor.shiftRGB(4, true) + ',' + imported.replyOp + ')',
              'Highlighted Reply Border': 'rgb(' + linkColor.rgb + ')',
              'Backlinked Reply Outline': 'rgb(' + linkColor.rgb + ')',
              'Checkbox Background': 'rgba(' + inputColor.rgb + ',' + imported.replyOp + ')',
              'Checkbox Border': 'rgb(' + inputbColor.rgb + ')',
              'Checkbox Checked Background': 'rgb(' + inputColor.rgb + ')',
              'Input Background': 'rgba(' + inputColor.rgb + ',' + imported.replyOp + ')',
              'Input Border': 'rgb(' + inputbColor.rgb + ')',
              'Hovered Input Background': 'rgba(' + inputColor.hover + ',' + imported.replyOp + ')',
              'Hovered Input Border': 'rgb(' + inputbColor.rgb + ')',
              'Focused Input Background': 'rgba(' + inputColor.hover + ',' + imported.replyOp + ')',
              'Focused Input Border': 'rgb(' + inputbColor.rgb + ')',
              'Buttons Background': 'rgba(' + inputColor.rgb + ',' + imported.replyOp + ')',
              'Buttons Border': 'rgb(' + inputbColor.rgb + ')',
              'Navigation Background': 'rgba(' + bgColor.rgb + ',0.8)',
              'Navigation Border': 'rgb(' + mainColor.rgb + ')',
              'Quotelinks': 'rgb(' + linkColor.rgb + ')',
              'Links': 'rgb(' + linkColor.rgb + ')',
              'Hovered Links': 'rgb(' + linkHColor.rgb + ')',
              'Navigation Links': 'rgb(' + textColor.rgb + ')',
              'Hovered Navigation Links': 'rgb(' + linkHColor.rgb + ')',
              'Subjects': 'rgb(' + titleColor.rgb + ')',
              'Names': 'rgb(' + nameColor.rgb + ')',
              'Sage': 'rgb(' + sageColor.rgb + ')',
              'Tripcodes': 'rgb(' + tripColor.rgb + ')',
              'Emails': 'rgb(' + linkColor.rgb + ')',
              'Post Numbers': 'rgb(' + linkColor.rgb + ')',
              'Text': 'rgb(' + textColor.rgb + ')',
              'Backlinks': 'rgb(' + linkColor.rgb + ')',
              'Greentext': 'rgb(' + quoteColor.rgb + ')',
              'Board Title': 'rgb(' + textColor.rgb + ')',
              'Timestamps': 'rgb(' + timeColor.rgb + ')',
              'Inputs': 'rgb(' + textColor.rgb + ')',
              'Warnings': 'rgb(' + sageColor.rgb + ')',
              'Shadow Color': 'rgba(0,0,0,0.1)',
              'Custom CSS': ".rice {\n  box-shadow:rgba(" + mainColor.shiftRGB(32) + ",.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}" + (imported.customCSS || '')
            };
          } else if (origin === "SS") {
            Themes[name] = {
              'Author': "Anonymous",
              'Author Tripcode': "!.pC/AHOKAg",
              'Background Image': 'url("' + (imported.bgImg || '') + '")',
              'Background Attachment': bgRPA[3] || '',
              'Background Position': ((bgRPA[1] + " ") || '') + (bgRPA[2] || ''),
              'Background Repeat': bgRPA[0] || '',
              'Background Color': 'rgb(' + bgColor.rgb + ')',
              'Dialog Background': 'rgba(' + mainColor.rgb + ',.98)',
              'Dialog Border': 'rgb(' + brderColor.rgb + ')',
              'Thread Wrapper Background': 'rgba(' + mainColor.rgb + ',.5)',
              'Thread Wrapper Border': 'rgba(' + brderColor.rgb + ',.9)',
              'Reply Background': 'rgba(' + mainColor.rgb + ',.9)',
              'Reply Border': 'rgb(' + brderColor.rgb + ')',
              'Highlighted Reply Background': 'rgba(' + mainColor.shiftRGB(4, true) + ',.9)',
              'Highlighted Reply Border': 'rgb(' + linkColor.rgb + ')',
              'Backlinked Reply Outline': 'rgb(' + linkColor.rgb + ')',
              'Checkbox Background': 'rgba(' + inputColor.rgb + ',.9)',
              'Checkbox Border': 'rgb(' + inputbColor.rgb + ')',
              'Checkbox Checked Background': 'rgb(' + inputColor.rgb + ')',
              'Input Background': 'rgba(' + inputColor.rgb + ',.9)',
              'Input Border': 'rgb(' + inputbColor.rgb + ')',
              'Hovered Input Background': 'rgba(' + inputColor.hover + ',.9)',
              'Hovered Input Border': 'rgb(' + inputbColor.rgb + ')',
              'Focused Input Background': 'rgba(' + inputColor.hover + ',.9)',
              'Focused Input Border': 'rgb(' + inputbColor.rgb + ')',
              'Buttons Background': 'rgba(' + inputColor.rgb + ',.9)',
              'Buttons Border': 'rgb(' + inputbColor.rgb + ')',
              'Navigation Background': 'rgba(' + bgColor.rgb + ',0.8)',
              'Navigation Border': 'rgb(' + mainColor.rgb + ')',
              'Quotelinks': 'rgb(' + linkColor.rgb + ')',
              'Links': 'rgb(' + linkColor.rgb + ')',
              'Hovered Links': 'rgb(' + linkHColor.rgb + ')',
              'Navigation Links': 'rgb(' + textColor.rgb + ')',
              'Hovered Navigation Links': 'rgb(' + linkHColor.rgb + ')',
              'Subjects': 'rgb(' + titleColor.rgb + ')',
              'Names': 'rgb(' + nameColor.rgb + ')',
              'Sage': 'rgb(' + sageColor.rgb + ')',
              'Tripcodes': 'rgb(' + tripColor.rgb + ')',
              'Emails': 'rgb(' + linkColor.rgb + ')',
              'Post Numbers': 'rgb(' + linkColor.rgb + ')',
              'Text': 'rgb(' + textColor.rgb + ')',
              'Backlinks': 'rgb(' + linkColor.rgb + ')',
              'Greentext': 'rgb(' + quoteColor.rgb + ')',
              'Board Title': 'rgb(' + textColor.rgb + ')',
              'Timestamps': 'rgb(' + timeColor.rgb + ')',
              'Inputs': 'rgb(' + textColor.rgb + ')',
              'Warnings': 'rgb(' + sageColor.rgb + ')',
              'Shadow Color': 'rgba(0,0,0,0.1)',
              'Custom CSS': ".board {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(" + mainColor.shiftRGB(32) + ",.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}" + (imported.customCSS || '')
            };
          }
        } else if (origin === 'appchan') {
          Themes[name] = imported;
        }
        userThemes = $.get("userThemes", {});
        userThemes[name] = Themes[name];
        $.set('userThemes', userThemes);
        alert("Theme \"" + name + "\" imported!");
        $.rm($("#themes", d.body));
        return Options.themeTab();
      };
      return reader.readAsText(file);
    },
    save: function(theme) {
      var name, userThemes;
      name = theme["Theme"];
      if (Themes[name] && !Themes[name]["Deleted"]) {
        if (confirm("A theme with this name already exists. Would you like to over-write?")) {
          delete Themes[name];
        } else {
          return;
        }
      }
      Themes[name] = JSON.parse(JSON.stringify(theme));
      delete Themes[name]["Theme"];
      userThemes = $.get("userThemes", {});
      userThemes[name] = Themes[name];
      $.set('userThemes', userThemes);
      $.set("theme", Conf['theme'] = name);
      return alert("Theme \"" + name + "\" saved.");
    },
    close: function() {
      Conf['editMode'] = false;
      $.rm($("#themeConf", d.body));
      Style.addStyle();
      return Options.dialog("theme");
    }
  };

  Themes = {
    'AppChan': {
      'Author': 'Zixaphir',
      'Author Tripcode': '!..NoTrip..',
      'Background Color': 'rgba(44,44,44,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Dialog Background': 'rgba(44,44,44,1)',
      'Dialog Border': 'rgba(44,44,44,1)',
      'Reply Background': 'rgba(51,51,51,1)',
      'Reply Border': 'rgba(51,51,51,1)',
      'Highlighted Reply Background': 'rgba(57,57,57,1)',
      'Highlighted Reply Border': 'rgba(57,57,57,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Input Background': 'rgba(51,51,51,1)',
      'Input Border': 'rgba(51,51,51,1)',
      'Checkbox Background': 'rgba(68,68,68,1)',
      'Checkbox Border': 'rgba(68,68,68,1)',
      'Checkbox Checked Background': 'rgba(17,17,17,1)',
      'Buttons Background': 'rgba(48,48,48,1)',
      'Buttons Border': 'rgba(48,48,48,1)',
      'Focused Input Background': 'rgba(63,63,63,1)',
      'Focused Input Border': 'rgba(63,63,63,1)',
      'Hovered Input Background': 'rgba(57,57,57,1)',
      'Hovered Input Border': 'rgba(57,57,57,1)',
      'Navigation Background': 'rgba(44,44,44,0.9)',
      'Navigation Border': 'rgba(44,44,44,0.9)',
      'Quotelinks': 'rgb(79,95,143)',
      'Backlinks': 'rgb(79,95,143)',
      'Links': 'rgb(102,136,170)',
      'Hovered Links': 'rgb(78,110,142)',
      'Navigation Links': 'rgb(170,170,170)',
      'Hovered Navigation Links': 'rgb(78,110,142)',
      'Names': 'rgb(170,170,170)',
      'Tripcodes': 'rgb(170,170,170)',
      'Emails': 'rgb(102,136,170)',
      'Subjects': 'rgb(144,144,144)',
      'Text': 'rgb(170,170,170)',
      'Inputs': 'rgb(170,170,170)',
      'Post Numbers': 'rgb(102,136,170)',
      'Greentext': 'rgb(120,153,34)',
      'Sage': 'rgb(150,150,150)',
      'Board Title': 'rgb(170,170,170)',
      'Timestamps': 'rgb(170,170,170)',
      'Warnings': 'rgb(102,136,170)',
      'Shadow Color': 'rgba(0,0,0,.1)',
      'Custom CSS': ''
    },
    'BakaBT': {
      'Author': 'seaweed',
      'Author Tripcode': '!POMF.9waa',
      'Background Image': 'url("http://i.imgur.com/rTkxi.jpg")',
      'Background Attachment': 'fixed',
      'Background Position': '20px 20px',
      'Background Repeat': 'repeat',
      'Background Color': 'rgba(238,238,238,1)',
      'Thread Wrapper Background': 'rgba(255,255,255,1)',
      'Thread Wrapper Border': 'rgba(204,204,204,1)',
      'Dialog Background': 'rgba(238,221,255,1)',
      'Dialog Border': 'rgba(238,221,255,1)',
      'Reply Background': 'rgba(238,221,255,1)',
      'Reply Border': 'rgba(209,162,255,1)',
      'Highlighted Reply Background': 'rgba(238,221,255,1)',
      'Highlighted Reply Border': 'rgba(209,162,255,1)',
      'Backlinked Reply Outline': 'rgba(204,101,99,1)',
      'Input Background': 'rgba(255,255,255,1)',
      'Input Border': 'rgba(204,204,204,1)',
      'Checkbox Background': 'rgba(255,255,238,1)',
      'Checkbox Border': 'rgba(204,204,204,1)',
      'Checkbox Checked Background': 'rgba(188,192,212,1)',
      'Buttons Background': 'rgba(255,255,255,1)',
      'Buttons Border': 'rgba(204,204,204,1)',
      'Focused Input Background': 'rgba(255,255,255,1)',
      'Focused Input Border': 'rgba(209,162,255,1)',
      'Hovered Input Background': 'rgba(238,221,255,1)',
      'Hovered Input Border': 'rgba(204,204,204,1)',
      'Navigation Background': 'rgba(255,255,255,0.8)',
      'Navigation Border': 'rgba(255,255,255,0.8)',
      'Quotelinks': 'rgb(146,92,141)',
      'Backlinks': 'rgb(146,92,141)',
      'Links': 'rgb(133,76,158)',
      'Hovered Links': 'rgb(198,23,230)',
      'Navigation Links': 'rgb(17,17,17)',
      'Hovered Navigation Links': 'rgb(198,23,230)',
      'Names': 'rgb(133,76,158)',
      'Tripcodes': 'rgb(146,92,141)',
      'Emails': 'rgb(133,76,158)',
      'Subjects': 'rgb(17,17,17)',
      'Text': 'rgb(0,0,0)',
      'Inputs': 'rgb(0,0,0)',
      'Post Numbers': 'rgb(146,92,141)',
      'Greentext': 'rgb(129,153,65)',
      'Sage': 'rgb(146,92,141)',
      'Board Title': 'rgb(133,76,158)',
      'Timestamps': 'rgb(0,0,0)',
      'Warnings': 'rgb(133,76,158)',
      'Shadow Color': 'rgba(0,0,0,.05)',
      'Custom CSS': ".board {\nbox-shadow: 0px 10px 10px 2px rgba(128,128,128,0.5);\nborder-radius: 3px;\n  padding:10px;\n}\n#options.reply.dialog,\n#options .dialog {\n  background-color:#FFF;\n  color:#000;\n  border:2px solid #CCC;\n}\n#options ul {\n  border-bottom:1px solid #DBD8D2;\n}\n#options ul:last-of-type{\n  border:none;\n}\n#qp div.post{\n  background-color:rgba(255,255,255,0.9);\n  border:1px solid #D1A2FF;\n  color:#000;\n}"
    },
    'Blackberry Jam': {
      'Author': 'seaweed',
      'Author Tripcode': '!POMF.9waa',
      'Dialog Background': 'rgba(27,27,27,1)',
      'Dialog Border': 'rgba(27,27,27,1)',
      'Background Color': 'rgba(45,45,45,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Reply Background': 'rgba(27,27,27,1)',
      'Reply Border': 'rgba(38,38,38,1)',
      'Highlighted Reply Background': 'rgba(17,17,17,1)',
      'Highlighted Reply Border': 'rgba(17,17,17,1)',
      'Backlinked Reply Outline': 'rgba(103,204,232,1)',
      'Checkbox Background': 'rgba(51,51,51,1)',
      'Checkbox Border': 'rgba(51,51,51,1)',
      'Input Background': 'rgba(27,27,27,1)',
      'Input Border': 'rgba(27,27,27,1)',
      'Focused Input Background': 'rgba(27,27,27,1)',
      'Focused Input Border': 'rgba(27,27,27,1)',
      'Hovered Input Background': 'rgba(17,17,17,1)',
      'Hovered Input Border': 'rgba(17,17,17,1)',
      'Checkbox Checked Background': 'rgba(17,17,17,1)',
      'Buttons Background': 'rgba(27,27,27,1)',
      'Buttons Border': 'rgba(27,27,27,1)',
      'Navigation Background': 'rgba(45,45,45,0.9)',
      'Navigation Border': 'rgba(45,45,45,0.9)',
      'Links': 'rgb(218,105,224)',
      'Hovered Links': 'rgb(255,0,255)',
      'Navigation Links': 'rgb(241,241,241)',
      'Hovered Navigation Links': 'rgb(255,0,255)',
      'Subjects': 'rgb(241,241,241)',
      'Names': 'rgb(103,204,232)',
      'Sage': 'rgb(103,204,232)',
      'Tripcodes': 'rgb(103,204,232)',
      'Emails': 'rgb(218,105,224)',
      'Post Numbers': 'rgb(218,105,224)',
      'Text': 'rgb(241,241,241)',
      'Quotelinks': 'rgb(223,153,247)',
      'Backlinks': 'rgb(223,153,247)',
      'Greentext': 'rgb(108,204,102)',
      'Board Title': 'rgb(103,204,232)',
      'Timestamps': 'rgb(218,105,224)',
      'Inputs': 'rgb(218,105,224)',
      'Warnings': 'rgb(103,204,232)',
      'Shadow Color': 'rgba(0,0,0,.1)',
      'Custom CSS': "div.replyContainer div.reply {\n  box-shadow: inset 0px 1px 2px 1px #111;\n}\n#qr {\n  box-shadow: none;\n}\n#qr textarea,\n#qr input[name=\"name\"],\n#qr input[name=\"email\"],\n#qr input[name=\"sub\"],\n#qr input[title=\"Verification\"] {\n  box-shadow: inset 0px 1px 2px 0px #111;\n}\n#qp div.post {\n  background-color: rgba(29,29,33,1);\n  border: 1px solid rgba(95,137,172,0.4);\n}"
    },
    'Midnight Caek': {
      'Author': 'Zixaphir',
      'Author Tripcode': '!M.........',
      'Background Color': 'rgba(16,16,16,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Dialog Background': 'rgba(28,28,28,1)',
      'Dialog Border': 'rgba(28,28,28,1)',
      'Reply Background': 'rgba(28,28,28,1)',
      'Reply Border': 'rgba(28,28,28,1)',
      'Highlighted Reply Background': 'rgba(24,24,24,1)',
      'Highlighted Reply Border': 'rgba(24,24,24,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Input Background': 'rgba(28,28,28,1)',
      'Input Border': 'rgba(28,28,28,1)',
      'Hovered Input Background': 'rgba(24,24,24,1)',
      'Hovered Input Border': 'rgba(24,24,24,1)',
      'Focused Input Background': 'rgba(16,16,16,1)',
      'Focused Input Border': 'rgba(28,28,28,1)',
      'Checkbox Background': 'rgba(0,0,0,1)',
      'Checkbox Border': 'rgba(60,60,60,1)',
      'Checkbox Checked Background': 'rgba(60,60,60,1)',
      'Buttons Background': 'rgba(24,24,24,1)',
      'Buttons Border': 'rgba(24,24,24,1)',
      'Navigation Background': 'rgba(16,16,16,0.9)',
      'Navigation Border': 'rgba(16,16,16,0.9)',
      'Quotelinks': 'rgb(71,71,91)',
      'Backlinks': 'rgb(66,66,71)',
      'Links': 'rgb(87,87,123)',
      'Hovered Links': 'rgb(71,71,91)',
      'Navigation Links': 'rgb(144,144,144)',
      'Hovered Navigation Links': 'rgb(71,71,91)',
      'Names': 'rgb(124,45,45)',
      'Tripcodes': 'rgb(62,113,87)',
      'Emails': 'rgb(68,68,68)',
      'Subjects': 'rgb(170,170,170)',
      'Text': 'rgb(144,144,144)',
      'Inputs': 'rgb(144,144,144)',
      'Post Numbers': 'rgb(144,144,144)',
      'Greentext': 'rgb(113,121,62)',
      'Sage': 'rgb(68,68,68)',
      'Board Title': 'rgb(144,144,144)',
      'Timestamps': 'rgb(144,144,144)',
      'Warnings': 'rgb(87,87,123)',
      'Shadow Color': 'rgba(0,0,0,.1)',
      'Custom CSS': ''
    },
    'Minimalistic Mayhem': {
      'Author': 'Mayhem',
      'Author Tripcode': '!MayhemYDG.',
      'Background Image': 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAACdJREFUCNdNxzEBADAMwzCnOMwfWYDs2JNPCgCoH9m0zQa4jXob4AGJFwxchPNwQAAAAABJRU5ErkJggg==")',
      'Background Color': 'rgba(25,25,25,1)',
      'Dialog Background': 'rgba(34,34,34,1)',
      'Dialog Border': 'rgba(41,41,41,1)',
      'Thread Wrapper Background': 'rgba(34,34,34,1)',
      'Thread Wrapper Border': 'rgba(0,0,0,1)',
      'Reply Background': 'rgba(51,51,51,1)',
      'Reply Border': 'rgba(17,17,17,1)',
      'Highlighted Reply Background': 'rgba(37,38,42,1)',
      'Highlighted Reply Border': 'rgba(85,85,85,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Checkbox Background': 'rgba(57,57,57,1)',
      'Checkbox Border': 'rgba(25,25,25,1)',
      'Input Background': 'rgba(34,34,34,1)',
      'Input Border': 'rgba(21,21,21,1)',
      'Focused Input Background': 'rgba(32,32,32,1)',
      'Focused Input Border': 'rgba(102,102,102,1)',
      'Hovered Input Background': 'rgba(24,24,24,1)',
      'Hovered Input Border': 'rgba(21,21,21,1)',
      'Checkbox Checked Background': 'rgba(57,57,57,1)',
      'Buttons Background': 'rgba(32,32,32,1)',
      'Buttons Border': 'rgba(16,16,16,1)',
      'Navigation Background': 'rgba(26,26,26,0.9)',
      'Navigation Border': 'rgba(26,26,26,0.9)',
      'Links': 'rgb(85,156,122)',
      'Hovered Links': 'rgb(199,222,26)',
      'Navigation Links': 'rgb(144,144,144)',
      'Hovered Navigation Links': 'rgb(198,23,230)',
      'Subjects': 'rgb(72,98,115)',
      'Names': 'rgb(46,136,166)',
      'Sage': 'rgb(124,45,45)',
      'Tripcodes': 'rgb(140,93,42)',
      'Emails': 'rgb(174,43,41)',
      'Post Numbers': 'rgb(137,115,153)',
      'Text': 'rgb(221,221,221)',
      'Quotelinks': 'rgb(139,164,70)',
      'Backlinks': 'rgb(139,164,70)',
      'Greentext': 'rgb(139,164,70)',
      'Board Title': 'rgb(187,187,187)',
      'Timestamps': 'rgb(221,221,221)',
      'Inputs': 'rgb(187,187,187)',
      'Warnings': 'rgb(87,87,123)',
      'Shadow Color': 'rgba(0,0,0,.1)',
      'Custom CSS': ".nameBlock > .useremail > postertrip {\n  color: rgb(137,115,153);\n}\na.backlink:hover {\n  color: rgb(198,23,230);\n}\n.reply:target,\n.reply.highlight:target {\n  background:rgb(37,38,42);\n}\n[alt=\"sticky\"] + a {\n  color: rgb(242,141,0);\n}\n[alt=\"closed\"] + a {\n  color: rgb(178,171,130);\n}\ninput:checked .rice {\n  border-color:rgb(21,21,21);\n}\ninput[type=\"submit\"],\ninput[type=\"button\"],\nbutton {\n  background: linear-gradient(#393939, #292929);\n  border: 1px solid #191919;\n  color: #AAA;\n  text-shadow: 0 1px 1px #191919;\n}\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\nbackground-color: #393939;\n  border: 1px solid #191919;\n}\ninput[type=\"checkbox\"]:checked,\ninput[type=\"radio\"]:checked {\n  background: linear-gradient(#595959, #393939);\n  border: 1px solid #151515;\n}\n.board {\n  padding: 7px;\n}\n.subject:hover,\ndiv.post:hover .subject {\n  color: #3F8DBF !important;\n}\n.postertrip:hover,\ndiv.post:hover .postertrip {\n  color:#CC7212 !important;\n}\n.name:hover,\ndiv.post:hover .name {\n  color: #0AAEE7 !important;\n}\n.name,\n.subject,\n.postertrip {\n  -webkit-transition:color .3s ease-in-out;\n  -moz-transition:color .3s ease-in-out;\n  -o-transition:color .3s ease-in-out;\n}"
    },
    'ObsidianChan': {
      'Author': 'seaweed',
      'Author Tripcode': '!POMF.9waa',
      'Background Image': 'url("http://i.imgur.com/sbi8u.png")',
      'Background Attachment': 'fixed',
      'Dialog Background': 'rgba(0,0,0,0.7)',
      'Dialog Border': 'rgba(0,0,0,0.7)',
      'Background Color': 'rgba(0,0,0,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0.3)',
      'Thread Wrapper Border': 'rgba(51,51,51,1)',
      'Reply Background': 'rgba(0,0,0,0.6)',
      'Reply Border': 'rgba(0,0,0,0.6)',
      'Highlighted Reply Background': 'rgba(0,0,0,0.4)',
      'Highlighted Reply Border': 'rgba(0,0,0,0.4)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Checkbox Background': 'rgba(68,68,68,1)',
      'Checkbox Border': 'rgba(68,68,68,1)',
      'Input Background': 'rgba(0,0,0,0.6)',
      'Input Border': 'rgba(0,0,0,0.6)',
      'Hovered Input Background': 'rgba(0,0,0,0.4)',
      'Hovered Input Border': 'rgba(0,0,0,0.4)',
      'Focused Input Background': 'rgba(0,0,0,0.4)',
      'Focused Input Border': 'rgba(0,0,0,0.4)',
      'Checkbox Checked Background': 'rgba(255,0,127,1)',
      'Buttons Background': 'rgba(0,0,0,0.4)',
      'Buttons Border': 'rgba(0,0,0,0.4)',
      'Navigation Background': 'rgba(0,0,0,0.7)',
      'Navigation Border': 'rgba(0,0,0,0.7)',
      'Links': 'rgb(0,255,255)',
      'Hovered Links': 'rgb(0,255,255)',
      'Navigation Links': 'rgb(253,254,255)',
      'Hovered Navigation Links': 'rgb(253,254,255)',
      'Subjects': 'rgb(144,144,144)',
      'Names': 'rgb(253,254,255)',
      'Sage': 'rgb(253,254,255)',
      'Tripcodes': 'rgb(255,82,203)',
      'Emails': 'rgb(0,255,255)',
      'Post Numbers': 'rgb(0,255,255)',
      'Text': 'rgb(253,254,255)',
      'Quotelinks': 'rgb(0,255,255)',
      'Backlinks': 'rgb(0,255,255)',
      'Greentext': 'rgb(67,204,103)',
      'Board Title': 'rgb(253,254,255)',
      'Timestamps': 'rgb(253,254,255)',
      'Inputs': 'rgb(253,254,255)',
      'Warnings': 'rgb(0,255,255)',
      'Shadow Color': 'rgba(0,0,0,.1)',
      'Custom CSS': "#qp div.post{\n  background-color:rgba(0,0,0,0.8);\n  border: 1px solid #333;\n}\n#qr {\n  background-color: rgba(0,0,0,0.7);\n  border: 1px solid #333;\n}"
    },
    'PaisleyChan': {
      'Author': 'Ubuntufriend',
      'Author Tripcode': '!TRip.C0d3',
      'Background Image': 'url(http://i.imgur.com/DRaZf.jpg)',
      'Background Attachment': 'fixed',
      'Background Repeat': 'repeat',
      'Background Color': 'rgba(19,19,19,1)',
      'Dialog Background': 'rgba(16,16,16,1)',
      'Dialog Border': 'rgba(16,16,16,1)',
      'Thread Wrapper Background': 'rgba(52,56,56,0.3)',
      'Thread Wrapper Border': 'rgba(52,56,56,0.3)',
      'Reply Background': 'rgba(52,56,56,1)',
      'Reply Border': 'rgba(0,0,0,0)',
      'Highlighted Reply Background': 'rgba(0,0,0,0)',
      'Highlighted Reply Border': 'rgba(0,0,0,0)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Checkbox Background': 'rgba(34,34,34,1)',
      'Checkbox Border': 'rgba(60,60,60,1)',
      'Input Background': 'rgba(28,28,28,1)',
      'Input Border': 'rgba(28,28,28,1)',
      'Hovered Input Background': 'rgba(24,24,24,1)',
      'Hovered Input Border': 'rgba(24,24,24,1)',
      'Focused Input Background': 'rgba(32,32,32,1)',
      'Focused Input Border': 'rgba(32,32,32,1)',
      'Checkbox Checked Background': 'rgba(34,34,34,1)',
      'Buttons Background': 'rgba(32,32,32,1)',
      'Buttons Border': 'rgba(32,32,32,1)',
      'Navigation Background': 'rgba(16,16,16,0.9)',
      'Navigation Border': 'rgba(16,16,16,0.9)',
      'Links': 'rgb(187,187,187)',
      'Hovered Links': 'rgb(0,223,252)',
      'Navigation Links': 'rgb(153,153,153)',
      'Hovered Navigation Links': 'rgb(0,223,252)',
      'Subjects': 'rgb(170,170,170)',
      'Names': 'rgb(128,172,206)',
      'Sage': 'rgb(153,153,153)',
      'Tripcodes': 'rgb(128,172,206)',
      'Emails': 'rgb(187,187,187)',
      'Post Numbers': 'rgb(153,153,153)',
      'Text': 'rgb(153,153,153)',
      'Quotelinks': 'rgb(212,212,212)',
      'Backlinks': 'rgb(212,212,212)',
      'Greentext': 'rgb(152,185,98)',
      'Board Title': 'rgb(153,153,153)',
      'Timestamps': 'rgb(153,153,153)',
      'Inputs': 'rgb(153,153,153)',
      'Warnings': 'rgb(187,187,187)',
      'Shadow Color': 'rgba(0,0,0,.1)',
      'Custom CSS': "#options{\n  background-color: rgba(16,16,16,1) !important;\n}\n#delform blockquote {\n  border-radius:3px;\n  color:#bbb;\n  background:#343838;\n  padding:8px;\n  box-shadow:0px 0px 20px rgba(25,25,25,0.6);\n  border:1px solid #343838;\n  border-bottom:2px solid #444848;\n  border-radius:0px 6px 6px 6px;\n  padding-top:15px;\n}\n.name {\n  font-weight:800;\n}\n.nameBlock > .useremail > .name:hover,\n.nameBlock> .useremail> .postertrip:hover {\n  color:#00dffc;\n}\na.forwardlink {\n  color:#608cae;\n  font-weight:800;\n}\ndiv.reply,\n.reply.highlight {\n  padding:0;\n}\n#qp div.post {\n  border:1px solid rgba(128,172,206,0.5) !important;\n  background-color: rgba(24,24,24,0.9) !important;\n}\n.name,\n.postertrip {\n  text-shadow:0px 0px 6px rgba(20,20,20,0.9);\n  font-weight:bold;\n  background:#343838;\n  border:1px solid #343838;\n  border-radius:5px 5px 0px 0px;\n  padding:4px 6px;\n  padding-top:2px;\n}\n#delform,\n#delform blockquote {\n  margin:0 10px 15px 0 !important;\n  padding:0px;\n}\na {\n  -moz-transition:all 0.5s ease;\n  -webkit-transition:all 0.5s ease;\n  -o-transition:all 0.5s ease;\n}\na.pointer{\n  font-weight:bold;\n  font-weight:normal;\n  color:#777;\n  padding-right:5px;\n}\n#delform .opContainer,\n#delform .replyContainer {\n  opacity:0.45;\n  transition:all 0.5s ease;\n}\n#delform .opContainer:hover,\n#delform .replyContainer:hover {\n  opacity:1;\n}\n.replyContainer div.reply,\n.reply.highlight {\n  background:transparent;\n  border:0px;\n  padding:0px;\n  padding-bottom:0px;\n  border-radius:6px;\n}\n#delform blockquote {\n  padding:5px;\n  background:#343838;\n  margin-top:0px;\n  min-height:20px;\n  padding-top:10px;\n  clear:none;\n}\n  #delform .file + blockquote{\n  margin-top:-16px !important;\n  padding-left:150px !important;\n}\n.file{\n  margin-top: 2px;\n}\na.backlink{\nborder:1px solid #343838;\nborder-radius:5px 5px 0px 0px;\nbackground:#343838;\npadding:2px 4px 2px;\n  text-decoration:none;\n}\na.forwardlink{\n  color:#608CAE;\n  text-shadow:0 0 6px rgba(96,140,174,0.8);\n}\n.subject{\n  font-weight: bold;\n  letter-spacing: 3px;\n  background: transparent;\n}\ndiv.replyContainer div.reply,\ndiv.reply.highlight div.reply {\n  background-color: rgba(0,0,0,0) !important;\n  border: none !important;\n}\n#qp div.post .name,\n#qp div.post a.backlink,\n#qp div.post blockquote {\n  background:none !important;\n  border:none !important;\n  box-shadow:none !important;\n  border-radius:0px !important;\n}"
    },
    'Photon': {
      'Author': 'seaweed',
      'Author Tripcode': '!POMF.9waa',
      'Background Color': 'rgba(238,238,238,1)',
      'Dialog Background': 'rgba(238,238,238,1)',
      'Dialog Border': 'rgba(204,204,204,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Reply Background': 'rgba(221,221,221,1)',
      'Reply Border': 'rgba(204,204,204,1)',
      'Highlighted Reply Background': 'rgba(204,204,204,1)',
      'Highlighted Reply Border': 'rgba(204,204,204,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Checkbox Background': 'rgba(255,255,238)',
      'Checkbox Border': 'rgba(255,255,238)',
      'Checkbox Checked Background': 'rgba(188,192,212)',
      'Input Background': 'rgba(255,255,255,1)',
      'Input Border': 'rgba(204,204,204,1)',
      'Hovered Input Background': 'rgba(204,204,204,1)',
      'Hovered Input Border': 'rgba(204,204,204,1)',
      'Focused Input Background': 'rgba(255,255,255,1)',
      'Focused Input Border': 'rgba(0,74,153,1)',
      'Buttons Background': 'rgba(255,255,238,1)',
      'Buttons Border': 'rgba(204,204,204,1)',
      'Navigation Background': 'rgba(238,238,238,0.9)',
      'Navigation Border': 'rgba(238,238,238,0.9)',
      'Links': 'rgb(255,102,0)',
      'Hovered Links': 'rgb(255,51,0)',
      'Navigation Links': 'rgb(17,17,17)',
      'Hovered Navigation Links': 'rgb(255,51,0)',
      'Subjects': 'rgb(17,17,17)',
      'Names': 'rgb(0,74,153)',
      'Sage': 'rgb(51,51,51)',
      'Tripcodes': 'rgb(255,51,0)',
      'Emails': 'rgb(255,102,0)',
      'Post Numbers': 'rgb(51,51,51)',
      'Text': 'rgb(51,51,51)',
      'Quotelinks': 'rgb(17,17,17)',
      'Backlinks': 'rgb(17,17,17)',
      'Greentext': 'rgb(120,153,34)',
      'Board Title': 'rgb(0,74,153)',
      'Timestamps': 'rgb(51,51,51)',
      'Inputs': 'rgb(0,0,0)',
      'Warnings': 'rgb(51,51,51)',
      'Shadow Color': 'rgba(0,0,0,.05)',
      'Custom CSS': ".fileText{\n  color: rgb(102,102,102);\n}\n.boardTitle {\n  color: #004a99 !important;\n  text-shadow: 1px 1px 1px #222 !important;\n}\n.boardSubtitle,\n.boardBanner .boardSubtitle > a  {\n  text-shadow: none !important;\n}"
    },
    'RedUX': {
      'Author': 'Zixaphir',
      'Author Tripcode': '!VGsTHECURE',
      'Background Image': 'linear-gradient(rgba(210,210,210,0.7), rgba(240,240,240,0.4) 400px, rgba(240,240,240,0.3)), url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACEAQMAAABrihHkAAAABlBMVEX///8AAABVwtN+AAAAAnRSTlMASuCaZbYAAAA+SURBVHhe7c2xCQAgDAXRKywsHcFRdDNxchtBkhHk4Lp88ui7hhaztBCkyYZ7fFHzI/Jk/GRpaWlpaWlpaR3scHNQSY3kigAAAABJRU5ErkJggg==")',
      'Background Attachment': 'fixed, scroll',
      'Background Position': 'top, center',
      'Background Repeat': 'no-repeat, repeat',
      'Background Color': 'rgba(238,242,255,1)',
      'Thread Wrapper Background': 'rgb(230,230,230)',
      'Thread Wrapper Border': 'rgba(204,204,204,1)',
      'Dialog Background': 'linear-gradient(rgb(222,222,222), rgb(240,240,240) 200px, rgb(240,240,240))',
      'Dialog Border': 'rgb(220,210,210)',
      'Reply Background': 'rgba(230,230,230,1)',
      'Reply Border': 'rgba(204,204,204,1)',
      'Highlighted Reply Background': 'rgba(219,219,219,1)',
      'Highlighted Reply Border': 'rgba(219,219,219,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Input Background': 'linear-gradient(rgb(222,222,222), rgb(240,240,240)), rgb(240,240,240)',
      'Input Border': 'rgb(220,210,210)',
      'Hovered Input Background': 'linear-gradient(rgba(214,186,208,0.7), rgb(240,240,240)), rgb(240,240,240)',
      'Hovered Input Border': 'rgba(214,186,208,1)',
      'Focused Input Background': 'rgb(240,240,240)',
      'Focused Input Border': 'rgb(220,210,210)',
      'Checkbox Background': 'rgba(238,242,255,1)',
      'Checkbox Checked Background': 'rgba(255,255,255,1)',
      'Checkbox Border': 'rgba(180,180,180,1)',
      'Buttons Background': 'linear-gradient(rgb(222,222,222), rgb(240,240,240)), rgb(240,240,240)',
      'Buttons Border': 'rgb(220,210,210)',
      'Navigation Background': 'rgba(230,230,230,0.8)',
      'Navigation Border': 'rgba(204,204,204,1)',
      'Quotelinks': 'rgb(153,51,51)',
      'Backlinks': 'rgb(153,51,51)',
      'Links': 'rgb(87,87,123)',
      'Hovered Links': 'rgb(221,0,0)',
      'Navigation Links': 'rgb(0,0,0)',
      'Hovered Navigation Links': 'rgb(87,87,123)',
      'Names': 'rgb(119,51,51)',
      'Tripcodes': 'rgb(119,51,51)',
      'Emails': 'rgb(87,87,123)',
      'Subjects': 'rgb(15,12,93)',
      'Text': 'rgb(0,0,0)',
      'Inputs': 'rgb(0,0,0)',
      'Post Numbers': 'rgb(0,0,0)',
      'Greentext': 'rgb(34,133,34)',
      'Sage': 'rgb(87,87,123)',
      'Board Title': 'rgb(119,51,51)',
      'Timestamps': 'rgb(0,0,0)',
      'Warnings': 'rgb(87,87,123)',
      'Shadow Color': 'rgba(0,0,0,.07)',
      'Custom CSS': ".replyContainer div.reply.post {\n  background-color: transparent;\n  border-color: #ccc;\n  border-width: 0 0 1px 0;\n  border-style: solid;\n  border-radius: 0 !important;\n}\n.thread .opContainer {\n  padding: 0 3px;\n}\n.thread .replyContainer {\n  margin-bottom: 0;\n}\n#themes {\n  text-shadow: none;\n}\n#qp {\n  text-shadow: 1px 0 0 rgb(0,0,0),\n    1px 1px 0 rgb(0,0,0),\n    0 1px 0 rgb(0,0,0),\n    1px 1px 2px rgb(0,0,0);\n}\n#qp .opContainer div.post,\n#qp .replyContainer div.post {\n  border: 1px rgba(0,0,0,0.7) solid;\n  background: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), transparent;\n}\n#qp div.post,\n#qp .pln,\n#qp .postNum a {\n  color: #fcd;\n}\n#qp .dateTime {\n  color: #fcd !important;\n}\n#qp .subject,\n#qp .nameBlock > .useremail > .name,\n#qp .nameBlock > .useremail > .postertrip,\n#qp .name,\n#qp .postertrip,\n#qp .trip {\n  color: #ffaac0 !important;\n}\n#qp a {\n  color: #aaaac8;\n}\n.boardBanner a,\n#qp a.backlink,\n#qp span.quote > a.quotelink {\n  color: rgb(255,255,255);\n}\n#qp span.quote {\n  color: rgb(130,163,100);\n}\n.board {\n  padding: 1px 0 2px 0;\n  box-shadow: 0 20px 40px 10px rgba(0,0,0,0.1);\n  border-radius: 4px;\n}\n:not(#themes) .rice {\n  box-shadow: 1px 1px 1px rgb(204, 204, 204) inset,\n    1px 1px 1px rgba(170, 170, 170,0.8);\n}\n.thread .replyContainer:last-of-type div.reply.post {\n  border: none;\n}\n#qp .prettyprint {\n  background-color: rgba(0,0,0,.3);\n  border: 1px solid rgba(0,0,0,0.5);\n}\n#qp span.tag {\n  color: #96562c;\n}\n#qp span.pun {\n  color: #5b6f2a;\n}\n#qp span.com {\n  color: #a34443;\n}\n#qp span.str,\n#qp span.atv {\n  color: #8ba446;\n}\n#qp span.kwd {\n  color: #987d3e;\n}\n#qp span.typ,\n#qp span.atn {\n  color: #897399;\n}\n#qp span.lit {\n  color: #558773;\n}"
    },
    'Solarized': {
      'Author': 'ubuntufriend',
      'Author Tripcode': '!TRip.C0d',
      'Background Color': 'rgba(7,54,66,1)',
      'Dialog Background': 'rgba(0,43,54,1)',
      'Dialog Border': 'rgba(0,43,54,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Reply Background': 'rgba(0,43,54,1)',
      'Reply Border': 'rgba(0,43,54,1)',
      'Highlighted Reply Background': 'rgba(7,54,66,1)',
      'Highlighted Reply Border': 'rgba(7,54,66,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Checkbox Background': 'rgba(88,110,117,1)',
      'Checkbox Border': 'rgba(88,110,117,1)',
      'Checkbox Checked Background': 'rgba(17,17,17,1)',
      'Input Background': 'rgba(0,43,54,1)',
      'Input Border': 'rgba(0,43,54,1)',
      'Hovered Input Background': 'rgba(7,54,66,1)',
      'Hovered Input Border': 'rgba(7,54,66,1)',
      'Focused Input Background': 'rgba(7,54,66,1)',
      'Focused Input Border': 'rgba(7,54,66,1)',
      'Buttons Background': 'rgba(0,43,54,1)',
      'Buttons Border': 'rgba(0,43,54,1)',
      'Navigation Background': 'rgba(7,54,66,1)',
      'Navigation Border': 'rgba(7,54,66,1)',
      'Links': 'rgb(108,113,196)',
      'Hovered Links': 'rgb(211,54,130)',
      'Navigation Links': 'rgb(147,161,161)',
      'Hovered Navigation Links': 'rgb(211,54,130)',
      'Subjects': 'rgb(203,75,22)',
      'Names': 'rgb(88,110,117)',
      'Sage': 'rgb(108,113,196)',
      'Tripcodes': 'rgb(42,161,152)',
      'Emails': 'rgb(108,113,196)',
      'Post Numbers': 'rgb(147,161,161)',
      'Text': 'rgb(147,161,161)',
      'Quotelinks': 'rgb(79,95,143)',
      'Backlinks': 'rgb(79,95,143)',
      'Greentext': 'rgb(133,153,0)',
      'Board Title': 'rgb(147,161,161)',
      'Timestamps': 'rgb(147,161,161)',
      'Inputs': 'rgb(147,161,161)',
      'Warnings': 'rgb(108,113,196)',
      'Shadow Color': 'rgba(0,0,0,.1)',
      'Custom CSS': "#qp div.post{\n  background-color:rgba(7,54,66,0.9);\n  border:1px solid rgba(79,95,143,0.9);\n}"
    },
    'Yotsuba': {
      'Author': 'moot',
      'Author Tripcode': '!Ep8pui8Vw2',
      'Background Image': 'linear-gradient(rgb(254,214,175), rgb(255,255,238) 200px, rgb(255,255,238))',
      'Background Color': 'rgba(255,255,238,1)',
      'Dialog Background': 'rgba(240,224,214,1)',
      'Dialog Border': 'rgba(217,191,183,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Reply Background': 'rgba(240,224,214,1)',
      'Reply Border': 'rgba(217,191,183,1)',
      'Highlighted Reply Background': 'rgba(240,192,176,1)',
      'Highlighted Reply Border': 'rgba(217,191,183,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Checkbox Background': 'rgba(255,255,238,1)',
      'Checkbox Border': 'rgba(217,191,183,1)',
      'Checkbox Checked Background': 'rgba(255,255,238,1)',
      'Input Background': 'rgba(240,224,214,1)',
      'Input Border': 'rgba(217,191,183,1)',
      'Hovered Input Background': 'rgba(240,224,214,1)',
      'Hovered Input Border': 'rgba(217,191,183,1)',
      'Focused Input Background': 'rgba(255,255,255,1)',
      'Focused Input Border': 'rgba(128,0,0,1)',
      'Buttons Background': 'rgba(240,192,176,1)',
      'Buttons Border': 'rgba(217,191,183,1)',
      'Navigation Background': 'rgba(240,192,176,0.7)',
      'Navigation Border': 'rgba(217,191,183,1)',
      'Links': 'rgb(186,0,0)',
      'Hovered Links': 'rgb(221,0,0)',
      'Navigation Links': 'rgb(128,0,0)',
      'Hovered Navigation Links': 'rgb(221,0,0)',
      'Subjects': 'rgb(204,17,5)',
      'Names': 'rgb(17,119,67)',
      'Sage': 'rgb(204,17,17)',
      'Tripcodes': 'rgb(34,136,84)',
      'Emails': 'rgb(186,0,0)',
      'Post Numbers': 'rgb(128,0,0)',
      'Text': 'rgb(128,0,0)',
      'Quotelinks': 'rgb(221,0,0)',
      'Backlinks': 'rgb(220,0,0)',
      'Greentext': 'rgb(120,153,34)',
      'Board Title': 'rgb(204,17,5)',
      'Timestamps': 'rgb(186,0,0)',
      'Inputs': 'rgb(0,0,0)',
      'Warnings': 'rgb(128,0,0)',
      'Shadow Color': 'rgba(0,0,0,.05)',
      'Custom CSS': "#qp div.post{\n  background-color:rgba(240,192,176,1);\n  box-shadow:5px 5px 5px rgba(128,128,128,0.5);\n}\n.replyContainer div.post {\n  border-style: none solid solid none !important;\n}"
    },
    'Yotsuba B': {
      'Author': 'moot',
      'Author Tripcode': '!Ep8pui8Vw2',
      'Background Image': 'linear-gradient(rgb(209,213,238), rgb(238,242,255) 200px, rgb(238,242,255))',
      'Background Color': 'rgba(238,242,255,1)',
      'Dialog Background': 'rgba(214,218,240,1)',
      'Dialog Border': 'rgba(183,197,217,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Reply Background': 'rgba(214,218,240,1)',
      'Reply Border': 'rgba(183,197,217,1)',
      'Highlighted Reply Background': 'rgba(214,186,208,1)',
      'Highlighted Reply Border': 'rgba(183,197,217,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Checkbox Background': 'rgba(238,242,255,1)',
      'Checkbox Border': 'rgba(183,197,217,1)',
      'Checkbox Checked Background': 'rgba(188,192,212,1)',
      'Input Background': 'rgba(238,242,255,1)',
      'Input Border': 'rgba(183,197,217,1)',
      'Hovered Input Background': 'rgba(214,186,208,1)',
      'Hovered Input Border': 'rgba(183,197,217,1)',
      'Focused Input Background': 'rgba(214,218,240,1)',
      'Focused Input Border': 'rgba(153,136,238,1)',
      'Buttons Background': 'rgba(214,218,240,1)',
      'Buttons Border': 'rgba(183,197,217,1)',
      'Navigation Background': 'rgba(211,215,238,0.7)',
      'Navigation Border': 'rgba(183,197,217,1)',
      'Links': 'rgb(52,52,92)',
      'Hovered Links': 'rgb(221,0,0)',
      'Navigation Links': 'rgb(0,0,0)',
      'Hovered Navigation Links': 'rgb(221,0,0)',
      'Subjects': 'rgb(15,12,93)',
      'Names': 'rgb(17,119,67)',
      'Sage': 'rgb(153,0,0)',
      'Tripcodes': 'rgb(34,136,84)',
      'Emails': 'rgb(87,87,123)',
      'Post Numbers': 'rgb(0,0,0)',
      'Text': 'rgb(0,0,0)',
      'Quotelinks': 'rgb(221,0,0)',
      'Backlinks': 'rgb(52,52,92)',
      'Greentext': 'rgb(120,153,34)',
      'Board Title': 'rgb(175,10,15)',
      'Timestamps': 'rgb(0,0,0)',
      'Inputs': 'rgb(0,0,0)',
      'Warnings': 'rgb(87,87,123)',
      'Shadow Color': 'rgba(0,0,0,.05)',
      'Custom CSS': "#qp div.post {\n  background-color:rgba(214,186,208,1);\n  box-shadow:5px 5px 5px rgba(128,128,128,0.5);\n}\n.replyContainer div.post {\n  border-style: none solid solid none !important;\n}"
    },
    'Zenburned': {
      'Author': 'lazy',
      'Author Tripcode': '!HONKYn7h1.',
      'Background Color': 'rgba(63,63,63,1)',
      'Dialog Background': 'rgba(87,87,87,1)',
      'Dialog Border': 'rgba(87,87,87,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Reply Background': 'rgba(87,87,87,1)',
      'Reply Border': 'rgba(87,87,87,1)',
      'Highlighted Reply Background': 'rgba(38,38,38,1)',
      'Highlighted Reply Border': 'rgba(38,38,38,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Checkbox Background': 'rgba(63,63,63,1)',
      'Checkbox Border': 'rgba(136,136,136,1)',
      'Checkbox Checked Background': 'rgba(17,17,17,1)',
      'Input Background': 'rgba(87,87,87,1)',
      'Input Border': 'rgba(136,136,136,1)',
      'Hovered Input Background': 'rgba(38,38,38,1)',
      'Hovered Input Border': 'rgba(38,38,38,1)',
      'Focused Input Background': 'rgba(38,38,38,1)',
      'Focused Input Border': 'rgba(153,136,238,1)',
      'Buttons Background': 'rgba(49,60,54,1)',
      'Buttons Border': 'rgba(136,136,136,1)',
      'Navigation Background': 'rgba(63,63,63,0.9)',
      'Navigation Border': 'rgba(63,63,63,0.9)',
      'Links': 'rgb(239,220,188)',
      'Hovered Links': 'rgb(248,248,147)',
      'Navigation Links': 'rgb(220,220,204)',
      'Hovered Navigation Links': 'rgb(248,248,147)',
      'Subjects': 'rgb(170,170,170)',
      'Names': 'rgb(192,190,209)',
      'Sage': 'rgb(220,220,204)',
      'Tripcodes': 'rgb(140,208,211)',
      'Emails': 'rgb(239,220,188)',
      'Post Numbers': 'rgb(220,220,204)',
      'Text': 'rgb(220,220,204)',
      'Quotelinks': 'rgb(220,163,163)',
      'Backlinks': 'rgb(220,163,163)',
      'Greentext': 'rgb(127,159,127)',
      'Board Title': 'rgb(220,220,204)',
      'Timestamps': 'rgb(220,220,204)',
      'Inputs': 'rgb(220,220,204)',
      'Warnings': 'rgb(239,220,188)',
      'Shadow Color': 'rgba(0,0,0,.1)',
      'Custom CSS': ''
    },
    "ピンク": {
      "Author": "DrooidKun",
      "Author Tripcode": "!/Apk/MRkGM",
      "Background Color": "rgb(255,255,255)",
      "Dialog Background": "rgba(242,242,242,.98)",
      "Dialog Border": "rgb(240,240,240)",
      "Thread Wrapper Background": "rgba(0,0,0,0)",
      "Thread Wrapper Border": "rgba(0,0,0,0)",
      "Reply Background": "rgba(242,242,242,1.0)",
      "Reply Border": "rgb(240,240,240)",
      "Highlighted Reply Background": "rgba(238,238,238,1.0)",
      "Highlighted Reply Border": "rgb(191,122,180)",
      "Backlinked Reply Outline": "rgb(191,122,180)",
      "Checkbox Background": "rgba(240,240,240,1.0)",
      "Checkbox Border": "rgb(222,222,222)",
      "Checkbox Checked Background": "rgb(240,240,240)",
      "Input Background": "rgba(240,240,240,1.0)",
      "Input Border": "rgb(222,222,222)",
      "Hovered Input Background": "rgba(224,224,224,1.0)",
      "Hovered Input Border": "rgb(222,222,222)",
      "Focused Input Background": "rgba(224,224,224,1.0)",
      "Focused Input Border": "rgb(222,222,222)",
      "Buttons Background": "rgba(240,240,240,1.0)",
      "Buttons Border": "rgb(222,222,222)",
      "Navigation Background": "rgba(255,255,255,0.8)",
      "Navigation Border": "rgb(242,242,242)",
      "Quotelinks": "rgb(191,122,180)",
      "Links": "rgb(191,122,180)",
      "Hovered Links": "rgb(198,105,201)",
      "Navigation Links": "rgb(77,77,76)",
      "Hovered Navigation Links": "rgb(198,105,201)",
      "Subjects": "rgb(77,77,77)",
      "Names": "rgb(204,94,193)",
      "Sage": "rgb(200,40,41)",
      "Tripcodes": "rgb(198,105,201)",
      "Emails": "rgb(191,122,180)",
      "Post Numbers": "rgb(191,122,180)",
      "Text": "rgb(77,77,76)",
      "Backlinks": "rgb(191,122,180)",
      "Greentext": "rgb(113,140,0)",
      "Board Title": "rgb(77,77,76)",
      "Timestamps": "rgb(77,77,76)",
      "Inputs": "rgb(77,77,76)",
      "Warnings": "rgb(200,40,41)",
      "Shadow Color": "rgba(0,0,0,0.05)",
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\nnput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n.boardTitle {\n  color: #cc5ec1 !important;\n  text-shadow: 1px 1px 1px #772E28 !important;\n}\n.boardSubtitle,\n.boardBanner .boardSubtitle > a {\n  text-shadow: none !important;\n}"
    },
    "Yotsuba Purple": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Image": "linear-gradient(rgba(238,221,255,1.0), rgba(248,243,254,1) 200px, rgba(248,243,254,1))",
      "Background Color": "rgb(248,243,254)",
      "Dialog Background": "rgba(238,221,255,.98)",
      "Dialog Border": "rgb(202,183,217)",
      "Thread Wrapper Background": "rgba(0,0,0,0)",
      "Thread Wrapper Border": "rgba(0,0,0,0)",
      "Reply Background": "rgba(238,221,255,1.0)",
      "Reply Border": "rgb(202,183,217)",
      "Highlighted Reply Background": "rgba(234,217,251,1.0)",
      "Highlighted Reply Border": "rgb(150,37,148)",
      "Backlinked Reply Outline": "rgb(150,37,148)",
      "Checkbox Background": "rgba(255,255,255,1.0)",
      "Checkbox Border": "rgb(202,183,217)",
      "Checkbox Checked Background": "rgb(255,255,255)",
      "Input Background": "rgba(255,255,255,1.0)",
      "Input Border": "rgb(202,183,217)",
      "Hovered Input Background": "rgba(239,239,239,1.0)",
      "Hovered Input Border": "rgb(202,183,217)",
      "Focused Input Background": "rgba(239,239,239,1.0)",
      "Focused Input Border": "rgb(202,183,217)",
      "Buttons Background": "rgba(255,255,255,1.0)",
      "Buttons Border": "rgb(202,183,217)",
      "Navigation Background": "rgba(248,243,254,0.8)",
      "Navigation Border": "rgb(238,221,255)",
      "Quotelinks": "rgb(150,37,148)",
      "Links": "rgb(150,37,148)",
      "Hovered Links": "rgb(178,44,170)",
      "Navigation Links": "rgb(0,0,0)",
      "Hovered Navigation Links": "rgb(178,44,170)",
      "Subjects": "rgb(15,12,93)",
      "Names": "rgb(89,17,119)",
      "Sage": "rgb(153,0,0)",
      "Tripcodes": "rgb(178,44,170)",
      "Emails": "rgb(150,37,148)",
      "Post Numbers": "rgb(150,37,148)",
      "Text": "rgb(0,0,0)",
      "Backlinks": "rgb(150,37,148)",
      "Greentext": "rgb(120,153,34)",
      "Board Title": "rgb(0,0,0)",
      "Timestamps": "rgb(0,0,0)",
      "Inputs": "rgb(0,0,0)",
      "Warnings": "rgb(153,0,0)",
      "Shadow Color": "rgba(0,0,0,.05)",
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,253,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n#boardNavDesktop,\n.pagelist,\n#imgControls {\n  background:rgba(229, 219, 240,.9)!important;\n}\n.replyContainer,\n.hidden_thread,\n.stub {\n  border-left:0!important;\n  border-top:0!important;\n}\n.boardTitle {\n  color: #591177 !important;\n  text-shadow: 1px 1px 1px #222 !important;\n}\n.boardSubtitle,\n.boardBanner .boardSubtitle > a {\n  text-shadow: none !important;\n}\n.postNum a {\n  color: #000000 !important;\n}"
    },
    "Vimyanized Dark": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Color": "rgb(9,13,15)",
      "Dialog Background": "rgba(13,17,20,.98)",
      "Dialog Border": "rgb(11,19,22)",
      "Thread Wrapper Background": "rgba(13,17,20,.5)",
      "Thread Wrapper Border": "rgba(11,19,22,.9)",
      "Reply Background": "rgba(13,17,20,.9)",
      "Reply Border": "rgb(11,19,22)",
      "Highlighted Reply Background": "rgba(9,13,16,.9)",
      "Highlighted Reply Border": "rgb(83,189,177)",
      "Backlinked Reply Outline": "rgb(83,189,177)",
      "Checkbox Background": "rgba(9,13,15,.9)",
      "Checkbox Border": "rgb(11,19,22)",
      "Checkbox Checked Background": "rgb(9,13,15)",
      "Input Background": "rgba(9,13,15,.9)",
      "Input Border": "rgb(11,19,22)",
      "Hovered Input Background": "rgba(0,0,0,.9)",
      "Hovered Input Border": "rgb(11,19,22)",
      "Focused Input Background": "rgba(0,0,0,.9)",
      "Focused Input Border": "rgb(11,19,22)",
      "Buttons Background": "rgba(9,13,15,.9)",
      "Buttons Border": "rgb(11,19,22)",
      "Navigation Background": "rgba(9,13,15,0.8)",
      "Navigation Border": "rgb(13,17,20)",
      "Quotelinks": "rgb(83,189,177)",
      "Links": "rgb(83,189,177)",
      "Hovered Links": "rgb(48,144,181)",
      "Navigation Links": "rgb(248,248,248)",
      "Hovered Navigation Links": "rgb(48,144,181)",
      "Subjects": "rgb(184,140,209)",
      "Names": "rgb(214,62,52)",
      "Sage": "rgb(79,79,79)",
      "Tripcodes": "rgb(212,182,60)",
      "Emails": "rgb(83,189,177)",
      "Post Numbers": "rgb(83,189,177)",
      "Text": "rgb(248,248,248)",
      "Backlinks": "rgb(83,189,177)",
      "Greentext": "rgb(150,200,59)",
      "Board Title": "rgb(248,248,248)",
      "Timestamps": "rgb(221,221,221)",
      "Inputs": "rgb(248,248,248)",
      "Warnings": "rgb(79,79,79)",
      "Shadow Color": "rgba(0,0,0,.1)",
      "Custom CSS": ".board {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(45,49,52,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
    },
    "Tomorrow Night": {
      "Author": "Chris Kempson",
      "Author Tripcode": "!.pC/AHOKAg",
      "Background Color": "rgb(29,31,33)",
      "Dialog Background": "rgba(40,42,46,.98)",
      "Dialog Border": "rgb(55,59,65)",
      "Thread Wrapper Background": "rgba(40,42,46,.5)",
      "Thread Wrapper Border": "rgba(55,59,65,.9)",
      "Reply Background": "rgba(40,42,46,.9)",
      "Reply Border": "rgb(55,59,65)",
      "Highlighted Reply Background": "rgba(36,38,42,.9)",
      "Highlighted Reply Border": "rgb(129,162,190)",
      "Backlinked Reply Outline": "rgb(129,162,190)",
      "Checkbox Background": "rgba(40,42,46,.9)",
      "Checkbox Border": "rgb(29,31,33)",
      "Checkbox Checked Background": "rgb(40,42,46)",
      "Input Background": "rgba(40,42,46,.9)",
      "Input Border": "rgb(29,31,33)",
      "Hovered Input Background": "rgba(24,26,30,.9)",
      "Hovered Input Border": "rgb(29,31,33)",
      "Focused Input Background": "rgba(24,26,30,.9)",
      "Focused Input Border": "rgb(29,31,33)",
      "Buttons Background": "rgba(40,42,46,.9)",
      "Buttons Border": "rgb(29,31,33)",
      "Navigation Background": "rgba(29,31,33,0.8)",
      "Navigation Border": "rgb(40,42,46)",
      "Quotelinks": "rgb(129,162,190)",
      "Links": "rgb(129,162,190)",
      "Hovered Links": "rgb(204,102,102)",
      "Navigation Links": "rgb(197,200,198)",
      "Hovered Navigation Links": "rgb(204,102,102)",
      "Subjects": "rgb(178,148,187)",
      "Names": "rgb(129,162,190)",
      "Sage": "rgb(204,102,102)",
      "Tripcodes": "rgb(138,190,183)",
      "Emails": "rgb(129,162,190)",
      "Post Numbers": "rgb(129,162,190)",
      "Text": "rgb(197,200,198)",
      "Backlinks": "rgb(129,162,190)",
      "Greentext": "rgb(181,189,104)",
      "Board Title": "rgb(197,200,198)",
      "Timestamps": "rgb(197,200,198)",
      "Inputs": "rgb(197,200,198)",
      "Warnings": "rgb(204,102,102)",
      "Shadow Color": "rgba(0,0,0,.1)",
      "Custom CSS": ".board {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(72,74,78,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
    },
    "Solarized Light": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Color": "rgb(240,240,240)",
      "Dialog Background": "rgba(253,246,227,.98)",
      "Dialog Border": "rgb(230,223,206)",
      "Thread Wrapper Background": "rgba(0,0,0,0)",
      "Thread Wrapper Border": "rgba(0,0,0,0)",
      "Reply Background": "rgba(253,246,227,1.0)",
      "Reply Border": "rgb(230,223,206)",
      "Highlighted Reply Background": "rgba(249,242,223,1.0)",
      "Highlighted Reply Border": "rgb(108,113,196)",
      "Backlinked Reply Outline": "rgb(108,113,196)",
      "Checkbox Background": "rgba(255,255,255,1.0)",
      "Checkbox Border": "rgb(204,204,204)",
      "Checkbox Checked Background": "rgb(255,255,255)",
      "Input Background": "rgba(255,255,255,1.0)",
      "Input Border": "rgb(204,204,204)",
      "Hovered Input Background": "rgba(239,239,239,1.0)",
      "Hovered Input Border": "rgb(204,204,204)",
      "Focused Input Background": "rgba(239,239,239,1.0)",
      "Focused Input Border": "rgb(204,204,204)",
      "Buttons Background": "rgba(255,255,255,1.0)",
      "Buttons Border": "rgb(204,204,204)",
      "Navigation Background": "rgba(240,240,240,0.8)",
      "Navigation Border": "rgb(253,246,227)",
      "Quotelinks": "rgb(108,113,196)",
      "Links": "rgb(108,113,196)",
      "Hovered Links": "rgb(211,54,130)",
      "Navigation Links": "rgb(101,123,131)",
      "Hovered Navigation Links": "rgb(211,54,130)",
      "Subjects": "rgb(181,137,0)",
      "Names": "rgb(101,123,131)",
      "Sage": "rgb(153,0,0)",
      "Tripcodes": "rgb(42,161,152)",
      "Emails": "rgb(108,113,196)",
      "Post Numbers": "rgb(108,113,196)",
      "Text": "rgb(101,123,131)",
      "Backlinks": "rgb(108,113,196)",
      "Greentext": "rgb(133,153,0)",
      "Board Title": "rgb(101,123,131)",
      "Timestamps": "rgb(101,123,131)",
      "Inputs": "rgb(101,123,131)",
      "Warnings": "rgb(153,0,0)",
      "Shadow Color": "rgba(0,0,0,.05)",
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n.boardTitle {\n  color: #b58900 !important;\n  text-shadow: 1px 1px 1px #999 !important;\n}\n.boardSubtitle,\n.boardBanner .boardSubtitle > a {\n  text-shadow: none !important;\n}\n.postNum a {\n  color: #657b83 !important;\n}"
    },
    "Muted": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Color": "rgb(255,255,255)",
      "Dialog Background": "rgba(245,242,233,.98)",
      "Dialog Border": "rgb(204,204,204)",
      "Thread Wrapper Background": "rgba(245,242,233,.5)",
      "Thread Wrapper Border": "rgba(204,204,204,.9)",
      "Reply Background": "rgba(245,242,233,.9)",
      "Reply Border": "rgb(204,204,204)",
      "Highlighted Reply Background": "rgba(241,238,229,.9)",
      "Highlighted Reply Border": "rgb(188,49,42)",
      "Backlinked Reply Outline": "rgb(188,49,42)",
      "Checkbox Background": "rgba(255,255,255,.9)",
      "Checkbox Border": "rgb(204,204,204)",
      "Checkbox Checked Background": "rgb(255,255,255)",
      "Input Background": "rgba(255,255,255,.9)",
      "Input Border": "rgb(204,204,204)",
      "Hovered Input Background": "rgba(239,239,239,.9)",
      "Hovered Input Border": "rgb(204,204,204)",
      "Focused Input Background": "rgba(239,239,239,.9)",
      "Focused Input Border": "rgb(204,204,204)",
      "Buttons Background": "rgba(255,255,255,.9)",
      "Buttons Border": "rgb(204,204,204)",
      "Navigation Background": "rgba(255,255,255,0.8)",
      "Navigation Border": "rgb(245,242,233)",
      "Quotelinks": "rgb(188,49,42)",
      "Links": "rgb(188,49,42)",
      "Hovered Links": "rgb(142,34,32)",
      "Navigation Links": "rgb(57,55,53)",
      "Hovered Navigation Links": "rgb(142,34,32)",
      "Subjects": "rgb(17,17,17)",
      "Names": "rgb(44,100,160)",
      "Sage": "rgb(153,0,0)",
      "Tripcodes": "rgb(204,101,99)",
      "Emails": "rgb(188,49,42)",
      "Post Numbers": "rgb(188,49,42)",
      "Text": "rgb(57,55,53)",
      "Backlinks": "rgb(188,49,42)",
      "Greentext": "rgb(120,153,34)",
      "Board Title": "rgb(57,55,53)",
      "Timestamps": "rgb(51,51,51)",
      "Inputs": "rgb(57,55,53)",
      "Warnings": "rgb(153,0,0)",
      "Shadow Color": "rgba(0,0,0,.05)",
      "Custom CSS": ".board {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n.boardTitle{\ncolor:#bc312a!important;\n  text-shadow:1px 1px 1px #772e28 !important;\n}\n.boardSubtitle,\n.boardBanner .boardSubtitle > a {\n  text-shadow:none!important;\n}\n.postNum a {\n  color:#111111!important;\n}\ndiv.reply a.quotelink{\n  color:#bc312a!important;\n}"
    },
    "Monokai": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Color": "rgb(32,33,28)",
      "Dialog Background": "rgba(39,40,34,.98)",
      "Dialog Border": "rgb(45,46,39)",
      "Thread Wrapper Background": "rgba(0,0,0,0)",
      "Thread Wrapper Border": "rgba(0,0,0,0)",
      "Reply Background": "rgba(39,40,34,1.0)",
      "Reply Border": "rgb(45,46,39)",
      "Highlighted Reply Background": "rgba(35,36,30,1.0)",
      "Highlighted Reply Border": "rgb(226,219,116)",
      "Backlinked Reply Outline": "rgb(226,219,116)",
      "Checkbox Background": "rgba(32,33,28,1.0)",
      "Checkbox Border": "rgb(23,23,19)",
      "Checkbox Checked Background": "rgb(32,33,28)",
      "Input Background": "rgba(32,33,28,1.0)",
      "Input Border": "rgb(23,23,19)",
      "Hovered Input Background": "rgba(16,17,12,1.0)",
      "Hovered Input Border": "rgb(23,23,19)",
      "Focused Input Background": "rgba(16,17,12,1.0)",
      "Focused Input Border": "rgb(23,23,19)",
      "Buttons Background": "rgba(32,33,28,1.0)",
      "Buttons Border": "rgb(23,23,19)",
      "Navigation Background": "rgba(32,33,28,0.8)",
      "Navigation Border": "rgb(39,40,34)",
      "Quotelinks": "rgb(226,219,116)",
      "Links": "rgb(226,219,116)",
      "Hovered Links": "rgb(174,129,255)",
      "Navigation Links": "rgb(248,248,242)",
      "Hovered Navigation Links": "rgb(174,129,255)",
      "Subjects": "rgb(174,129,255)",
      "Names": "rgb(90,192,204)",
      "Sage": "rgb(79,79,79)",
      "Tripcodes": "rgb(250,130,32)",
      "Emails": "rgb(226,219,116)",
      "Post Numbers": "rgb(226,219,116)",
      "Text": "rgb(248,248,242)",
      "Backlinks": "rgb(226,219,116)",
      "Greentext": "rgb(162,204,40)",
      "Board Title": "rgb(248,248,242)",
      "Timestamps": "rgb(248,248,242)",
      "Inputs": "rgb(248,248,242)",
      "Warnings": "rgb(79,79,79)",
      "Shadow Color": "rgba(0,0,0,.12)",
      "Custom CSS": ".rice {\n  box-shadow:rgba(71,72,66,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
    },
    "Dark Flat": {
      "Author": "Ahoka",
      "Author Tripcode": "!.pC/AHOKAg",
      "Background Image": "url(\"data:image/gif;base64,R0lGODlhAwADAIAAAB0dHRkZGSH5BADoAwAALAAAAAADAAMAAAIDDG5YADs=\")",
      "Background Attachment": "fixed",
      "Background Position": "top left",
      "Background Repeat": "repeat",
      "Background Color": "rgb(32,32,32)",
      "Dialog Background": "rgba(35,36,37,.98)",
      "Dialog Border": "rgb(41,42,43)",
      "Thread Wrapper Background": "rgba(35,36,37,.5)",
      "Thread Wrapper Border": "rgba(41,42,43,.9)",
      "Reply Background": "rgba(35,36,37,.9)",
      "Reply Border": "rgb(41,42,43)",
      "Highlighted Reply Background": "rgba(31,32,33,.9)",
      "Highlighted Reply Border": "rgb(172,155,176)",
      "Backlinked Reply Outline": "rgb(172,155,176)",
      "Checkbox Background": "rgba(24,25,26,.9)",
      "Checkbox Border": "rgb(18,19,20)",
      "Checkbox Checked Background": "rgb(24,25,26)",
      "Input Background": "rgba(24,25,26,.9)",
      "Input Border": "rgb(18,19,20)",
      "Hovered Input Background": "rgba(8,9,10,.9)",
      "Hovered Input Border": "rgb(18,19,20)",
      "Focused Input Background": "rgba(8,9,10,.9)",
      "Focused Input Border": "rgb(18,19,20)",
      "Buttons Background": "rgba(24,25,26,.9)",
      "Buttons Border": "rgb(18,19,20)",
      "Navigation Background": "rgba(32,32,32,0.8)",
      "Navigation Border": "rgb(35,36,37)",
      "Quotelinks": "rgb(172,155,176)",
      "Links": "rgb(172,155,176)",
      "Hovered Links": "rgb(111,153,180)",
      "Navigation Links": "rgb(221,221,221)",
      "Hovered Navigation Links": "rgb(111,153,180)",
      "Subjects": "rgb(147,144,201)",
      "Names": "rgb(168,198,217)",
      "Sage": "rgb(201,144,144)",
      "Tripcodes": "rgb(212,192,149)",
      "Emails": "rgb(172,155,176)",
      "Post Numbers": "rgb(172,155,176)",
      "Text": "rgb(221,221,221)",
      "Backlinks": "rgb(172,155,176)",
      "Greentext": "rgb(179,196,94)",
      "Board Title": "rgb(221,221,221)",
      "Timestamps": "rgb(221,221,221)",
      "Inputs": "rgb(221,221,221)",
      "Warnings": "rgb(201,144,144)",
      "Shadow Color": "rgba(0,0,0,.1)",
      "Custom CSS": ".board {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(67,68,69,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n.replyContainer div.post {\n border: 0 !important\n}"
    },
    "Blackboard": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Color": "rgb(10,13,28)",
      "Dialog Background": "rgba(12,16,33,.98)",
      "Dialog Border": "rgb(14,18,40)",
      "Thread Wrapper Background": "rgba(0,0,0,0)",
      "Thread Wrapper Border": "rgba(0,0,0,0)",
      "Reply Background": "rgba(12,16,33,1.0)",
      "Reply Border": "rgb(14,18,40)",
      "Highlighted Reply Background": "rgba(8,12,29,1.0)",
      "Highlighted Reply Border": "rgb(251,222,45)",
      "Backlinked Reply Outline": "rgb(251,222,45)",
      "Checkbox Background": "rgba(12,16,33,1.0)",
      "Checkbox Border": "rgb(8,11,22)",
      "Checkbox Checked Background": "rgb(12,16,33)",
      "Input Background": "rgba(12,16,33,1.0)",
      "Input Border": "rgb(8,11,22)",
      "Hovered Input Background": "rgba(0,0,17,1.0)",
      "Hovered Input Border": "rgb(8,11,22)",
      "Focused Input Background": "rgba(0,0,17,1.0)",
      "Focused Input Border": "rgb(8,11,22)",
      "Buttons Background": "rgba(12,16,33,1.0)",
      "Buttons Border": "rgb(8,11,22)",
      "Navigation Background": "rgba(10,13,28,0.8)",
      "Navigation Border": "rgb(12,16,33)",
      "Quotelinks": "rgb(251,222,45)",
      "Links": "rgb(251,222,45)",
      "Hovered Links": "rgb(75,101,204)",
      "Navigation Links": "rgb(248,248,248)",
      "Hovered Navigation Links": "rgb(75,101,204)",
      "Subjects": "rgb(255,100,0)",
      "Names": "rgb(141,166,206)",
      "Sage": "rgb(79,79,79)",
      "Tripcodes": "rgb(255,100,0)",
      "Emails": "rgb(251,222,45)",
      "Post Numbers": "rgb(251,222,45)",
      "Text": "rgb(248,248,248)",
      "Backlinks": "rgb(251,222,45)",
      "Greentext": "rgb(154,207,8)",
      "Board Title": "rgb(248,248,248)",
      "Timestamps": "rgb(221,221,221)",
      "Inputs": "rgb(248,248,248)",
      "Warnings": "rgb(79,79,79)",
      "Shadow Color": "rgba(0,0,0,.1)",
      "Custom CSS": ".rice {\n  box-shadow:rgba(44,48,65,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\nthread>.replyContainer>.reply>div.postInfo {\n  box-shadow: 0px 2px 3px #0A0A0A !important;\n}"
    },
    "4chan Rewired": {
      "Author": "",
      "Author Tripcode": "!K.WeEabo0o",
      "Background Color": "rgb(244,244,244)",
      "Dialog Background": "rgba(239,239,239,.98)",
      "Dialog Border": "rgb(212,212,212)",
      "Thread Wrapper Background": "rgba(0,0,0,0)",
      "Thread Wrapper Border": "rgba(0,0,0,0)",
      "Reply Background": "linear-gradient(rgba(244,244,244,0.9), rgba(239,239,239,0.9)), rgba(239,239,239,1)",
      "Reply Border": "rgb(212,212,212)",
      "Highlighted Reply Background": "linear-gradient(rgba(250,250,250,.9), rgba(230,230,230,0.9))",
      "Highlighted Reply Border": "rgb(191,127,63)",
      "Backlinked Reply Outline": "rgba(191,127,63,0.5)",
      "Checkbox Background": "rgba(228,228,228,.9)",
      "Checkbox Border": "rgb(204,204,204)",
      "Checkbox Checked Background": "rgb(228,228,228)",
      "Input Background": "rgba(244,244,244,0.9)",
      "Input Border": "rgb(204,204,204)",
      "Hovered Input Background": "rgba(212,212,212,.9)",
      "Hovered Input Border": "rgb(204,204,204)",
      "Focused Input Background": "rgba(212,212,212,.9)",
      "Focused Input Border": "rgb(204,204,204)",
      "Buttons Background": "rgba(244,244,244,0.9)",
      "Buttons Border": "rgb(204,204,204)",
      "Navigation Background": "rgba(244,244,244,0.8)",
      "Navigation Border": "rgb(239,239,239)",
      "Quotelinks": "rgb(191,127,63)",
      "Links": "rgb(191,127,63)",
      "Hovered Links": "rgb(191,127,63)",
      "Navigation Links": "rgba(0,0,0,.7)",
      "Hovered Navigation Links": "rgb(211,54,130)",
      "Subjects": "rgba(0,0,0,.7)",
      "Names": "rgba(0,0,0,.7)",
      "Sage": "rgb(204,102,102)",
      "Tripcodes": "rgb(191,127,63)",
      "Emails": "rgb(191,127,63)",
      "Post Numbers": "rgb(191,127,63)",
      "Text": "rgba(0,0,0,.7)",
      "Backlinks": "rgb(191,127,63)",
      "Greentext": "rgb(107,122,30)",
      "Board Title": "rgba(0,0,0,.7)",
      "Timestamps": "rgba(0,0,0,.7)",
      "Inputs": "rgba(0,0,0,.7)",
      "Warnings": "rgb(204,102,102)",
      "Shadow Color": "rgba(0,0,0,.07)",
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\n.replyContainer div.reply,\n.opContainer div.op {\n  background-color: transparent !important;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\na {\n  -moz-transition: text-shadow .2s;\n  -o-transition: text-shadow .2s;\n  -webkit-transition: text-shadow .2s;\n}\na:hover {\n  text-shadow: 0 0 3px rgba(232,118,0,.7);\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:\n    background .2s,\n    box-shadow .2s;\n}\n.subject:not(:empty)::after {\n  content: \" by\";\n  font-weight: normal;\n}"
    },
    "4chan Dark Upgrade": {
      "Author": "Ahoka",
      "Author Tripcode": "!.pC/AHOKAg",
      "Background Image": "url(\"http://i.minus.com/iNkJoDJkLU0co.png\")",
      "Background Attachment": "fixed",
      "Background Position": "top left",
      "Background Repeat": "repeat",
      "Background Color": "rgb(36,36,36)",
      "Dialog Background": "rgba(51,51,51,.98)",
      "Dialog Border": "rgb(58,58,58)",
      "Thread Wrapper Background": "rgba(51,51,51,.5)",
      "Thread Wrapper Border": "rgba(58,58,58,.9)",
      "Reply Background": "rgba(51,51,51,.9)",
      "Reply Border": "rgb(58,58,58)",
      "Highlighted Reply Background": "rgba(47,47,47,.9)",
      "Highlighted Reply Border": "rgb(221,221,221)",
      "Backlinked Reply Outline": "rgb(221,221,221)",
      "Checkbox Background": "rgba(47,47,47,.9)",
      "Checkbox Border": "rgb(15,15,15)",
      "Checkbox Checked Background": "rgb(47,47,47)",
      "Input Background": "rgba(47,47,47,.9)",
      "Input Border": "rgb(15,15,15)",
      "Hovered Input Background": "rgba(31,31,31,.9)",
      "Hovered Input Border": "rgb(15,15,15)",
      "Focused Input Background": "rgba(31,31,31,.9)",
      "Focused Input Border": "rgb(15,15,15)",
      "Buttons Background": "rgba(47,47,47,.9)",
      "Buttons Border": "rgb(15,15,15)",
      "Navigation Background": "rgba(36,36,36,0.8)",
      "Navigation Border": "rgb(51,51,51)",
      "Quotelinks": "rgb(221,221,221)",
      "Links": "rgb(221,221,221)",
      "Hovered Links": "rgb(238,238,238)",
      "Navigation Links": "rgb(255,255,255)",
      "Hovered Navigation Links": "rgb(238,238,238)",
      "Subjects": "rgb(153,153,153)",
      "Names": "rgb(255,255,255)",
      "Sage": "rgb(177,115,133)",
      "Tripcodes": "rgb(167,220,231)",
      "Emails": "rgb(221,221,221)",
      "Post Numbers": "rgb(221,221,221)",
      "Text": "rgb(255,255,255)",
      "Backlinks": "rgb(221,221,221)",
      "Greentext": "rgb(99,153,91)",
      "Board Title": "rgb(255,255,255)",
      "Timestamps": "rgb(170,170,170)",
      "Inputs": "rgb(255,255,255)",
      "Warnings": "rgb(177,115,133)",
      "Shadow Color": "rgba(0,0,0,0.2)",
      "Custom CSS": "html {\n}\n.board {\n  padding: 3px 4px;\n}\n.rice {\n  box-shadow:rgba(83,83,83,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n#delform {\n  background: rgba(22,22,22,.8) !important;\n  border: 0 !important;\n  padding: 1px !important;\n  box-shadow: rgba(0,0,0,.8) 0 0 10px;\n}\ndiv.reply.post {\n  background-image:    -moz-repeating-linear-gradient(45deg, #303030, #292929, #303030, #303030 3px) !important;\n  background-image:      -o-repeating-linear-gradient(45deg, #303030, #292929, #303030, #303030 3px) !important;\n  background-image: -webkit-repeating-linear-gradient(45deg, #303030, #292929, #303030, #303030 3px) !important;\n  border-bottom:#1f1f1f!important;\n}\n.thread:not(.stub) {\n  background: 0 !important\n}\na:not([href='javascript:;']){\n  text-shadow: #0f0f0f 0 1px;\n}"
    },
    "安心院なじみ ": {
      "Author": "Ahoka",
      "Author Tripcode": "!.pC/AHOKAg",
      "Background Image": "url(\"http://i.imgur.com/RewHm.png\")",
      "Background Attachment": "fixed",
      "Background Position": "bottom right",
      "Background Repeat": "no-repeat",
      "Background Color": "rgb(255,255,255)",
      "Dialog Background": "rgba(239,239,239,.98)",
      "Dialog Border": "rgb(214,214,214)",
      "Thread Wrapper Background": "rgba(239,239,239,.4)",
      "Thread Wrapper Border": "rgba(214,214,214,.9)",
      "Reply Background": "rgba(239,239,239,.9)",
      "Reply Border": "rgb(214,214,214)",
      "Highlighted Reply Background": "rgba(235,235,235,.9)",
      "Highlighted Reply Border": "rgb(191,128,64)",
      "Backlinked Reply Outline": "rgb(191,128,64)",
      "Checkbox Background": "rgba(204,204,204,.9)",
      "Checkbox Border": "rgb(187,187,187)",
      "Checkbox Checked Background": "rgb(204,204,204)",
      "Input Background": "rgba(204,204,204,.9)",
      "Input Border": "rgb(187,187,187)",
      "Hovered Input Background": "rgba(188,188,188,.9)",
      "Hovered Input Border": "rgb(187,187,187)",
      "Focused Input Background": "rgba(188,188,188,.9)",
      "Focused Input Border": "rgb(187,187,187)",
      "Buttons Background": "rgba(204,204,204,.9)",
      "Buttons Border": "rgb(187,187,187)",
      "Navigation Background": "rgba(255,255,255,0.8)",
      "Navigation Border": "rgb(239,239,239)",
      "Quotelinks": "rgb(191,128,64)",
      "Links": "rgb(191,128,64)",
      "Hovered Links": "rgb(191,128,64)",
      "Navigation Links": "rgb(77,77,76)",
      "Hovered Navigation Links": "rgb(191,128,64)",
      "Subjects": "rgb(77,77,77)",
      "Names": "rgb(43,128,194)",
      "Sage": "rgb(200,40,41)",
      "Tripcodes": "rgb(62,153,159)",
      "Emails": "rgb(191,128,64)",
      "Post Numbers": "rgb(191,128,64)",
      "Text": "rgb(77,77,76)",
      "Backlinks": "rgb(191,128,64)",
      "Greentext": "rgb(113,140,0)",
      "Board Title": "rgb(77,77,76)",
      "Timestamps": "rgb(77,77,76)",
      "Inputs": "rgb(77,77,76)",
      "Warnings": "rgb(200,40,41)",
      "Shadow Color": "rgba(0,0,0,.05)",
      "Custom CSS": ".board {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
    },
    "violaceous": {
      "Author": "Anonymous",
      "Author Tripcode": "!MaSoOdDwDw",
      "Background Color": "rgb(18,19,20)",
      "Dialog Background": "rgba(27,27,27,.98)",
      "Dialog Border": "rgb(41,42,43)",
      "Thread Wrapper Background": "rgba(27,27,27,.5)",
      "Thread Wrapper Border": "rgba(41,42,43,.9)",
      "Reply Background": "rgba(27,27,27,.9)",
      "Reply Border": "rgb(41,42,43)",
      "Highlighted Reply Background": "rgba(31,31,31,.9)",
      "Highlighted Reply Border": "rgb(42,127,160)",
      "Backlinked Reply Outline": "rgb(42,127,160)",
      "Checkbox Background": "rgba(24,25,26,.9)",
      "Checkbox Border": "rgb(18,19,20)",
      "Checkbox Checked Background": "rgb(24,25,26)",
      "Input Background": "rgba(24,25,26,.9)",
      "Input Border": "rgb(18,19,20)",
      "Hovered Input Background": "rgba(40,41,42,.9)",
      "Hovered Input Border": "rgb(18,19,20)",
      "Focused Input Background": "rgba(40,41,42,.9)",
      "Focused Input Border": "rgb(18,19,20)",
      "Buttons Background": "rgba(24,25,26,.9)",
      "Buttons Border": "rgb(18,19,20)",
      "Navigation Background": "rgba(18,19,20,0.8)",
      "Navigation Border": "rgb(27,27,27)",
      "Quotelinks": "rgb(42,127,160)",
      "Links": "rgb(42,127,160)",
      "Hovered Links": "rgb(48,144,181)",
      "Navigation Links": "rgb(221,221,221)",
      "Hovered Navigation Links": "rgb(48,144,181)",
      "Subjects": "rgb(6,152,154)",
      "Names": "rgb(164,151,176)",
      "Sage": "rgb(79,79,79)",
      "Tripcodes": "rgb(189,43,131)",
      "Emails": "rgb(42,127,160)",
      "Post Numbers": "rgb(42,127,160)",
      "Text": "rgb(221,221,221)",
      "Backlinks": "rgb(42,127,160)",
      "Greentext": "rgb(0,171,63)",
      "Board Title": "rgb(221,221,221)",
      "Timestamps": "rgb(221,221,221)",
      "Inputs": "rgb(221,221,221)",
      "Warnings": "rgb(79,79,79)",
      "Shadow Color": "rgba(0,0,0,.1)",
      "Custom CSS": ".board {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(59,59,59,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\ndiv.post.reply {\n  border: 0 !important}"
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
      var post, posts, spoilerRange, status, url, _i, _len;
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
      if (cb) {
        cb(post);
      }
      return $.replace(root.firstChild, Get.cleanPost(Build.postFromObject(post, board)));
    },
    parseArchivedPost: function(req, board, postID, root, cb) {
      var bq, comment, data, o, _ref;
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
      $.replace(root.firstChild, Get.cleanPost(Build.post(o, true)));
      if (cb) {
        return cb();
      }
    },
    cleanPost: function(root) {
      var child, el, els, inline, inlined, now, post, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;
      post = $('.post', root);
      _ref = Array.prototype.slice.call(root.childNodes);
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
      var key, mascot, name, now, path, pathname, settings, temp, theme, val, _conf, _ref, _ref1;
      Main.flatten(null, Config);
      for (key in Conf) {
        val = Conf[key];
        Conf[key] = $.get(key, val);
      }
      Conf['Hidden Categories'] = $.get("Hidden Categories", ["Questionable"]);
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
      if (['b', 'd', 'e', 'gif', 'h', 'hc', 'hm', 'hr', 'pol', 'r', 'r9k', 'rs', 's', 'soc', 't', 'u', 'y'].contains(g.BOARD)) {
        g.TYPE = 'nsfw';
      }
      _conf = Conf;
      if (_conf["NSFW/SFW Mascots"]) {
        g.MASCOTSTRING = "Enabled Mascots " + g.TYPE;
      } else {
        g.MASCOTSTRING = "Enabled Mascots";
      }
      userNavigation = $.get("userNavigation", Navigation);
      _ref = $.get("userThemes", {});
      for (name in _ref) {
        theme = _ref[name];
        Themes[name] = theme;
      }
      _ref1 = $.get("userMascots", {});
      for (name in _ref1) {
        mascot = _ref1[name];
        Mascots[name] = mascot;
      }
      Conf["Enabled Mascots"] = $.get("Enabled Mascots", []);
      Conf["Enabled Mascots sfw"] = $.get("Enabled Mascots sfw", []);
      Conf["Enabled Mascots nsfw"] = $.get("Enabled Mascots nsfw", []);
      Conf["Deleted Mascots"] = $.get("Deleted Mascots", []);
      if (_conf["Interval per board"]) {
        Conf["Interval_" + g.BOARD] = $.get("Interval_" + g.BOARD, Conf["Interval"]);
        Conf["BGInterval_" + g.BOARD] = $.get("BGInterval_" + g.BOARD, Conf["BGInteval"]);
      }
      if (_conf["NSFW/SFW Themes"]) {
        Conf["theme"] = $.get("theme_" + g.TYPE, Conf["theme"]);
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
      Main.prune();
      Style.init();
      now = Date.now();
      if (_conf['Check for Updates'] && $.get('lastUpdate', 0) < now - 18 * $.HOUR) {
        $.ready(function() {
          $.on(window, 'message', Main.message);
          $.set('lastUpdate', now);
          return $.add(d.head, $.el('script', {
            src: 'https://github.com/zixaphir/appchan-x/raw/master/latest.js'
          }));
        });
      }
      settings = JSON.parse(localStorage.getItem('4chan-settings')) || {};
      settings.disableAll = true;
      localStorage.setItem('4chan-settings', JSON.stringify(settings));
      if (g.CATALOG) {
        return $.ready(Main.catalog);
      } else {
        return Main.features();
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
      $.ready(function() {
        var a, nav, _i, _len, _ref;
        if (_conf['Custom Navigation']) {
          CustomNavigation.init();
        }
        Options.init();
        MascotTools.init();
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
      if (_conf['Filter']) {
        Filter.init();
        StrikethroughQuotes.init();
      } else if (_conf['Reply Hiding'] || _conf['Reply Hiding Link']) {
        StrikethroughQuotes.init();
      }
      if (_conf['Reply Hiding']) {
        ReplyHiding.init();
      }
      if (_conf['Anonymize']) {
        Anonymize.init();
      }
      if (_conf['Time Formatting']) {
        Time.init();
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
      if (_conf['Quote Inline']) {
        QuoteInline.init();
      }
      if (_conf['Quote Preview']) {
        QuotePreview.init();
      }
      if (_conf['Quote Backlinks']) {
        QuoteBacklink.init();
      }
      if (_conf['Mark Owned Posts']) {
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
      var a, board, nav, node, nodes, now, _conf, _i, _j, _len, _len1, _ref, _ref1;
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
      QR.init();
      MascotTools.init();
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
      _ref1 = $$('.postContainer', board);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        node = _ref1[_j];
        nodes.push(Main.preParse(node));
      }
      Main.node(nodes, function() {
        if (d.readyState === "complete") {
          return true;
        }
        return false;
      });
      Main.hasCodeTags = !!$('script[src^="//static.4chan.org/js/prettify/prettify"]');
      if (MutationObserver) {
        Main.observer = new MutationObserver(Main.observe);
        Main.observer.observe(board, {
          childList: true,
          subtree: true
        });
      } else {
        $.on(board, 'DOMNodeInserted', Main.listener);
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
            delete ownPosts[id];
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
    preParse: function(node, threadID) {
      var el, img, imgParent, parent, parentClass, post;
      parentClass = (parent = node.parentNode) ? parent.className : "";
      el = $('.post', node);
      post = {
        root: node,
        el: el,
        "class": el.className,
        ID: el.id.match(/\d+$/)[0],
        threadID: g.THREAD_ID || (parent ? $.x('ancestor::div[parent::div[@class="board"]]', node).id.match(/\d+$/)[0] : threadID),
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
            alert("AppChan X has experienced an error. You can help by sending this snippet to:\nhttps://github.com/zixaphir/appchan-x/issues\n\n" + Main.version + "\n" + window.location + "\n" + navigator.userAgent + "\n\n" + err + "\n" + err.stack);
          }
        }
      }
    },
    observe: function(mutations) {
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
        Main.node(nodes);
      }
      if (d.readyState === 'complete') {
        return Main.observer.disconnect();
      }
    },
    listener: function(e) {
      var target;
      target = e.target;
      if (/\bpostContainer\b/.test(target.className)) {
        return Main.node([Main.preParse(target)]);
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
    namespace: 'appchan_x.',
    version: '1.1.2',
    callbacks: []
  };

  Main.init();

}).call(this);
