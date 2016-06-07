// ==UserScript==
// @name         4chan X
// @version      1.11.34.10
// @minGMVer     1.14
// @minFFVer     26
// @namespace    4chan-X
// @description  Cross-browser userscript for maximum lurking on 4chan.
// @license      MIT; https://github.com/ccd0/4chan-x/blob/master/LICENSE 
// @include      http://boards.4chan.org/*
// @include      https://boards.4chan.org/*
// @include      http://sys.4chan.org/*
// @include      https://sys.4chan.org/*
// @include      http://www.4chan.org/*
// @include      https://www.4chan.org/*
// @include      http://i.4cdn.org/*
// @include      https://i.4cdn.org/*
// @include      https://www.google.com/recaptcha/api2/anchor?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc*
// @include      https://www.google.com/recaptcha/api2/frame?*&k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc*
// @include      http://www.google.com/recaptcha/api/fallback?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc*
// @include      https://www.google.com/recaptcha/api/fallback?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc*
// @exclude      http://www.4chan.org/pass
// @exclude      https://www.4chan.org/pass
// @exclude      http://www.4chan.org/pass?*
// @exclude      https://www.4chan.org/pass?*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @updateURL    https://www.4chan-x.net/builds/4chan-X.meta.js
// @downloadURL  https://www.4chan-x.net/builds/4chan-X.user.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAACVBMVEUAAGcAAABmzDNZt9VtAAAAAXRSTlMAQObYZgAAAF5JREFUeNrtkTESABAQxPD/R6tsE2dUGYUtFJvLDKf93KevHJAjpBorAQWSBIKqFASC4G0pCAkm4GfaEvgYXl0T6HBaE97f0vmnfYHbZOMLZCx9ISdKWwjOWZSC8GYm4SUGwfYgqI4AAAAASUVORK5CYII=
// ==/UserScript==

/*
* 4chan X
*
* Licensed under the MIT license.
* https://github.com/ccd0/4chan-x/blob/master/LICENSE
*
* Appchan X Copyright © 2013-2016 Zixaphir <zixaphirmoxphar@gmail.com>
* http://zixaphir.github.io/appchan-x/ 
* 4chan x Copyright © 2009-2011 James Campos <james.r.campos@gmail.com>
* https://github.com/aeosynth/4chan-x
* 4chan x Copyright © 2012-2014 Nicolas Stepien <stepien.nicolas@gmail.com>
* https://4chan-x.just-believe.in/
* 4chan x Copyright © 2013-2014 Jordan Bates <saudrapsmann@gmail.com>
* http://seaweedchan.github.io/4chan-x/
* 4chan x Copyright © 2012-2013 ihavenoface
* http://ihavenoface.github.io/4chan-x/
* 4chan SS Copyright © 2011-2013 Ahodesuka
* https://github.com/ahodesuka/4chan-Style-Script/ 
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
* aeosynth
* mayhemydg
* noface
* !K.WeEabo0o
* blaise
* that4chanwolf
* desuwa
* seaweed
* e000
* ahodesuka
* Shou
* ferongr
* xat
* Ongpot
* thisisanon
* Anonymous
* Seiba
* herpaderpderp
* WakiMiko
* btmcsweeney
* AppleBloom
* detharonil
*
* All the people who've taken the time to write bug reports.
*
* Thank you.
*/

/*
* Contains data from external sources:
*
* src/Monitoring/ThreadUpdater/beep.wav from http://freesound.org/people/pierrecartoons1979/sounds/90112/
*   cc-by-nc-3.0
*
* Font Awesome by Dave Gandy (http://fontawesome.io)
*   license: http://fontawesome.io/license/
*
* Icons used to identify various websites are property of the respective websites.
*/

(function() {

'use strict';

var $, $$, Anonymize, AntiAutoplay, ArchiveLink, Banner, Board, Build, CSS, Callbacks, Captcha, CatalogLinks, CatalogThread, Config, Connection, CrossOrigin, CustomCSS, DataBoard, DeleteLink, DownloadLink, Embedding, ExpandComment, ExpandThread, FappeTyme, Favicon, Fetcher, FileInfo, Filter, Flash, Fourchan, Gallery, Get, Header, IDColor, IDHighlight, ImageCommon, ImageExpand, ImageHover, ImageLoader, Index, Keybinds, Linkify, Main, MarkNewIPs, Menu, Metadata, Nav, NormalizeURL, Notice, PSAHiding, PassLink, Polyfill, Post, PostHiding, PostSuccessful, QR, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, QuoteStrikeThrough, QuoteThreading, QuoteYou, Quotify, RandomAccessList, Recursive, Redirect, RelativeDates, RemoveSpoilers, ReplyPruning, Report, ReportLink, RevealSpoilers, Sauce, Settings, ShimSet, SimpleDict, Thread, ThreadExcerpt, ThreadHiding, ThreadLinks, ThreadStats, ThreadUpdater, ThreadWatcher, Time, UI, Unread, Volume;

var Conf, E, c, d, doc, docSet, g;

Conf = {};
c    = console;
d    = document;
doc  = d.documentElement;

// Workaround for userscript managers that run script before document.documentElement is set
docSet = function() {
  return (doc = d.documentElement);
};

g = {
  VERSION:   '1.11.34.10',
  NAMESPACE: '4chan X.',
  boards:    {}
};

E = (function() {
  var fn, r, regex, str;
  str = {
    '&': '&amp;',
    "'": '&#039;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
  };
  r = String.prototype.replace;
  regex = /[&"'<>]/g;
  fn = function(x) {
    return str[x];
  };
  return function(text) {
    return r.call(text, regex, fn);
  };
})();

E.cat = function(templates) {
  var html, i, len;
  html = '';
  for (i = 0, len = templates.length; i < len; i++) {
    html += templates[i].innerHTML;
  }
  return html;
};

E.url = function(content) {
  return "data:text/html;charset=utf-8,<!doctype html>" + encodeURIComponent(content.innerHTML);
};

Config = (function() {
  var Config;

  Config = {
    main: {
      'Miscellaneous': {
        'JSON Index': [true, 'Replace the original board index with one supporting searching, sorting, infinite scrolling, and a catalog mode.'],
        'Use 4chan X Catalog': [true, 'Link to 4chan X\'s catalog instead of the native 4chan one.', 1],
        'Index Refresh Notifications': [false, 'Show a notice at the top of the page when the index is refreshed.', 1],
        'Open Threads in New Tab': [false, 'Make links to threads in the index / 4chan X catalog open in a new tab.'],
        'External Catalog': [false, 'Link to external catalog instead of the internal one.'],
        'Catalog Links': [false, 'Add toggle link in header menu to turn Navigation links into links to each board\'s catalog.'],
        'Announcement Hiding': [true, 'Add button to hide 4chan announcements.'],
        'Desktop Notifications': [true, 'Enables desktop notifications across various 4chan X features.'],
        '404 Redirect': [true, 'Redirect dead threads and images to the archives.'],
        'Archive Report': [true, 'Enable reporting posts to supported archives.'],
        'Exempt Archives from Encryption': [false, 'Permit loading content from, and warningless redirects to, HTTP-only archives from HTTPS pages.'],
        'Keybinds': [true, 'Bind actions to keyboard shortcuts.'],
        'Time Formatting': [true, 'Localize and format timestamps.'],
        'Relative Post Dates': [true, 'Display dates like "3 minutes ago". Tooltip shows the timestamp.'],
        'Relative Date Title': [true, 'Show Relative Post Date only when hovering over dates.', 1],
        'Comment Expansion': [true, 'Expand comments that are too long to display on the index. Not applicable with JSON Index.'],
        'File Info Formatting': [true, 'Reformat the file information.'],
        'Thread Expansion': [true, 'Add buttons to expand threads.'],
        'Index Navigation': [false, 'Add buttons to navigate between threads.'],
        'Reply Navigation': [false, 'Add buttons to navigate to top / bottom of thread.'],
        'Custom Board Titles': [true, 'Allow editing of the board title and subtitle by ctrl/\u2318+clicking them.'],
        'Persistent Custom Board Titles': [false, 'Force custom board titles to be persistent, even if the board titles are updated.', 1],
        'Show Updated Notifications': [true, 'Show notifications when 4chan X is successfully updated.'],
        'Color User IDs': [true, 'Assign unique colors to user IDs on boards that use them'],
        'Remove Spoilers': [false, 'Remove all spoilers in text.'],
        'Reveal Spoilers': [false, 'Indicate spoilers if Remove Spoilers is enabled, or make the text appear hovered if Remove Spoiler is disabled.'],
        'Normalize URL': [true, 'Rewrite the URL of the current page, removing slugs and excess slashes, and changing /res/ to /thread/.'],
        'Disable Autoplaying Sounds': [false, 'Prevent sounds on the page from autoplaying.'],
        'Disable Native Extension': [true, '4chan X is NOT designed to work with the native extension.'],
        'Enable Native Flash Embedding': [true, 'Activate the native extension\'s Flash embedding if the native extension is disabled.']
      },
      'Linkification': {
        'Linkify': [true, 'Convert text into links where applicable.'],
        'Link Title': [true, 'Replace the link of a supported site with its actual title.', 1],
        'Embedding': [true, 'Embed supported services. Note: Some services don\'t work on HTTPS.', 1],
        'Auto-embed': [false, 'Auto-embed Linkify Embeds.', 2],
        'Floating Embeds': [false, 'Embed content in a frame that remains in place when the page is scrolled.', 2]
      },
      'Filtering': {
        'Anonymize': [false, 'Make everyone Anonymous.'],
        'Filter': [true, 'Self-moderation placebo.'],
        'Filtered Backlinks': [false, 'When enabled, shows backlinks to filtered posts with a line-through decoration. Otherwise, hides the backlinks.', 1],
        'Recursive Hiding': [true, 'Hide replies of hidden posts, recursively.'],
        'Thread Hiding Buttons': [true, 'Add buttons to hide entire threads.'],
        'Reply Hiding Buttons': [true, 'Add buttons to hide single replies.'],
        'Stubs': [true, 'Show stubs of hidden threads / replies.']
      },
      'Images and Videos': {
        'Image Expansion': [true, 'Expand images / videos.'],
        'Image Hover': [true, 'Show full image / video on mouseover.'],
        'Image Hover in Catalog': [false, 'Show full image / video on mouseover in 4chan X catalog.'],
        'Gallery': [true, 'Adds a simple and cute image gallery.'],
        'Fullscreen Gallery': [false, 'Open gallery in fullscreen mode.', 1],
        'PDF in Gallery': [false, 'Show PDF files in gallery.', 1],
        'Sauce': [true, 'Add sauce links to images.'],
        'WEBM Metadata': [true, 'Add link to fetch title metadata from webm videos.'],
        'Reveal Spoiler Thumbnails': [false, 'Replace spoiler thumbnails with the original image.'],
        'Replace GIF': [false, 'Replace gif thumbnails with the actual image.'],
        'Replace JPG': [false, 'Replace jpg thumbnails with the actual image.'],
        'Replace PNG': [false, 'Replace png thumbnails with the actual image.'],
        'Replace WEBM': [false, 'Replace webm thumbnails with the actual webm video. Probably will degrade browser performance ;)'],
        'Image Prefetching': [false, 'Add link in header menu to turn on image preloading.'],
        'Fappe Tyme': [true, 'Hide posts without images when header menu item is checked. *hint* *hint*'],
        'Werk Tyme': [true, 'Hide all post images when header menu item is checked.'],
        'Autoplay': [true, 'Videos begin playing immediately when opened.'],
        'Restart when Opened': [false, 'Restart GIFs and WebMs when you hover over or expand them.'],
        'Show Controls': [true, 'Show controls on videos expanded inline.'],
        'Click Passthrough': [false, 'Clicks on videos trigger your browser\'s default behavior. Videos can be contracted with button / dragging to the left.', 1],
        'Allow Sound': [true, 'Open videos with the sound unmuted.'],
        'Mouse Wheel Volume': [true, 'Adjust volume of videos with the mouse wheel over the thumbnail/filename/gallery.'],
        'Loop in New Tab': [true, 'Loop videos opened in their own tabs.'],
        'Volume in New Tab': [true, 'Apply 4chan X mute and volume settings to videos opened in their own tabs.']
      },
      'Menu': {
        'Menu': [true, 'Add a drop-down menu to posts.'],
        'Report Link': [true, 'Add a report link to the menu.', 1],
        'Thread Hiding Link': [true, 'Add a link to hide entire threads.', 1],
        'Reply Hiding Link': [true, 'Add a link to hide single replies.', 1],
        'Delete Link': [true, 'Add post and image deletion links to the menu.', 1],
        'Archive Link': [true, 'Add an archive link to the menu.', 1],
        'Edit Link': [true, 'Add a link to edit the image in Tegaki, /i/\'s painting program. Requires Quick Reply.', 1],
        'Download Link': [true, 'Add a download with original filename link to the menu.', 1]
      },
      'Monitoring': {
        'Thread Updater': [true, 'Fetch and insert new replies. Has more options in the header menu and the "Advanced" tab.'],
        'Unread Count': [true, 'Show the unread posts count in the tab title.'],
        'Quoted Title': [false, 'Change the page title to reflect you\'ve been quoted.', 1],
        'Hide Unread Count at (0)': [false, 'Hide the unread posts count in the tab title when it reaches 0.', 1],
        'Unread Favicon': [true, 'Show a different favicon when there are unread posts.'],
        'Unread Line': [true, 'Show a line to distinguish read posts from unread ones.'],
        'Remember Last Read Post': [true, 'Remember how far you\'ve read after you close the thread.'],
        'Scroll to Last Read Post': [true, 'Scroll back to the last read post when reopening a thread.', 1],
        'Thread Excerpt': [true, 'Show an excerpt of the thread in the tab title for threads in /f/.'],
        'Remove Thread Excerpt': [false, 'Replace the excerpt of the thread in the tab title with the board title.'],
        'Thread Stats': [true, 'Display reply and image count.'],
        'IP Count in Stats': [true, 'Display the unique IP count in the thread stats.', 1],
        'Page Count in Stats': [true, 'Display the page count in the thread stats.', 1],
        'Updater and Stats in Header': [true, 'Places the thread updater and thread stats in the header instead of floating them.'],
        'Thread Watcher': [true, 'Bookmark threads.'],
        'Fixed Thread Watcher': [true, 'Makes the thread watcher scroll with the page.', 1],
        'Toggleable Thread Watcher': [true, 'Adds a shortcut for the thread watcher and hides the watcher by default.', 1],
        'Mark New IPs': [false, 'Label each post from a new IP with the thread\'s current IP count.'],
        'Reply Pruning': [true, 'Hide old replies in long threads. Number of replies shown can be set from header menu.']
      },
      'Posting and Captchas': {
        'Quick Reply': [true, 'All-in-one form to reply, create threads, automate dumping and more.'],
        'QR Shortcut': [true, 'Add a shortcut to the header to toggle the QR.', 1],
        'Persistent QR': [false, 'The Quick reply won\'t disappear after posting.', 1],
        'Auto Hide QR': [true, 'Automatically hide the quick reply when posting.', 1],
        'Open Post in New Tab': [true, 'Open new threads or replies to a thread from the index in a new tab.', 1],
        'Remember QR Size': [false, 'Remember the size of the Quick reply.', 1],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.', 1],
        'Randomize Filename': [false, 'Set the filename to a random timestamp within the past year. Disabled on /f/.', 1],
        'Show New Thread Option in Threads': [false, 'Show the option to post a new / different thread from inside a thread.', 1],
        'Show Name and Subject': [false, 'Show the classic name, email, and subject fields in the QR, even when 4chan doesn\'t use them all.', 1],
        'Cooldown': [true, 'Indicate the remaining time before posting again.', 1],
        'Posting Success Notifications': [true, 'Show notifications on successful post creation or file uploading.', 1],
        'Auto-load captcha': [false, 'Automatically load the captcha in the QR even if your post is empty.', 1],
        'Post on Captcha Completion': [false, 'Submit the post immediately when the captcha is completed.', 1],
        'Bottom QR Link': [true, 'Places a link on the bottom of threads to open the QR.', 1],
        'Captcha Fixes': [true, 'Make captcha easier to use, especially with the keyboard.'],
        'Use Recaptcha v1': [false, 'Use the old text version of Recaptcha in the post form.'],
        'Use Recaptcha v1 in Reports': [false, 'Use the text captcha in the report window.'],
        'Force Noscript Captcha': [false, 'Use the non-Javascript fallback captcha even if Javascript is enabled (Recaptcha v2 only).'],
        'Pass Link': [false, 'Add a 4chan Pass login link to the bottom of the page.']
      },
      'Quote Links': {
        'Quote Backlinks': [true, 'Add quote backlinks.'],
        'OP Backlinks': [true, 'Add backlinks to the OP.', 1],
        'Quote Inlining': [true, 'Inline quoted post on click.'],
        'Inline Cross-thread Quotes Only': [false, 'Don\'t inline quote links when the posts are visible in the thread.', 1],
        'Quote Hash Navigation': [false, 'Include an extra link after quotes for autoscrolling to quoted posts.', 1],
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks.', 1],
        'Quote Previewing': [true, 'Show quoted post on hover.'],
        'Quote Highlighting': [true, 'Highlight the previewed post.', 1],
        'Resurrect Quotes': [true, 'Link dead quotes to the archives, and support inlining/previewing of archive links like quote links.'],
        'Remember Your Posts': [true, 'Remember your posting history.'],
        'Mark Quotes of You': [true, 'Add \'(You)\' to quotes linking to your posts.', 1],
        'Highlight Posts Quoting You': [true, 'Highlights any posts that contain a quote to your post.', 1],
        'Highlight Own Posts': [true, 'Highlights own posts.', 1],
        'Mark OP Quotes': [true, 'Add \'(OP)\' to OP quotes.'],
        'Mark Cross-thread Quotes': [true, 'Add \'(Cross-thread)\' to cross-threads quotes.'],
        'Quote Threading': [true, 'Add option in header menu to thread conversations.']
      }
    },
    imageExpansion: {
      'Fit width': [true, ''],
      'Fit height': [false, ''],
      'Scroll into view': [true, 'Scroll down when expanding images to bring the full image into view.'],
      'Expand spoilers': [true, 'Expand all images along with spoilers.'],
      'Expand videos': [true, 'Expand all images also expands videos.'],
      'Expand from here': [false, 'Expand all images only from current position to thread end.'],
      'Advance on contract': [false, 'Advance to next post when contracting an expanded image.']
    },
    gallery: {
      'Hide Thumbnails': [false],
      'Fit Width': [true],
      'Fit Height': [true],
      'Stretch to Fit': [false],
      'Scroll to Post': [true],
      'Slide Delay': [6.0]
    },
    'Default Volume': 1.0,
    threadWatcher: {
      'Current Board': [false, 'Only show watched threads from the current board.'],
      'Auto Update Thread Watcher': [true, 'Periodically check status of watched threads.'],
      'Auto Watch': [false, 'Automatically watch threads you start.'],
      'Auto Watch Reply': [false, 'Automatically watch threads you reply to.'],
      'Auto Prune': [false, 'Automatically remove dead threads.'],
      'Show Unread Count': [true, 'Show number of unread posts in watched threads.']
    },
    filter: {
      postID: "# Highlight dubs on [s4s]:\n#/(\\d)\\1$/;highlight;top:no;boards:s4s",
      name: "# Filter any namefags:\n#/^(?!Anonymous$)/",
      uniqueID: "# Filter a specific ID:\n#/Txhvk1Tl/",
      tripcode: "# Filter any tripfag\n#/^!/",
      capcode: "# Set a custom class for mods:\n#/Mod$/;highlight:mod;op:yes\n# Set a custom class for admins:\n#/Admin$/;highlight:admin;op:yes",
      subject: "# Filter Generals on /v/:\n#/general/i;boards:v;op:only",
      comment: "# Filter Stallman copypasta on /g/:\n#/what you\'re refer+ing to as linux/i;boards:g\n# Filter posts with 20 or more quote links:\n#/(?:>>\\d(?:(?!>>\\d)[^])*){20}/\n# Filter posts like T H I S / H / I / S:\n#/^>?\\s?\\w\\s?(\\w)\\s?(\\w)\\s?(\\w).*$[\\s>]+\\1[\\s>]+\\2[\\s>]+\\3/im",
      flag: '',
      filename: '',
      dimensions: "# Highlight potential wallpapers:\n#/1920x1080/;op:yes;highlight;top:no;boards:w,wg",
      filesize: '',
      MD5: ''
    },
    sauces: "# Reverse image search:\nhttps://www.google.com/searchbyimage?image_url=%IMG&safe=off\n#https://www.yandex.com/images/search?rpt=imageview&img_url=%IMG\n#//tineye.com/search?url=%IMG\n\n# Specialized reverse image search:\n//iqdb.org/?url=%IMG\n#//3d.iqdb.org/?url=%IMG\n#//saucenao.com/search.php?url=%IMG\n\n# \"View Same\" in archives:\nhttp://eye.swfchan.com/search/?q=%name;types:swf;sandbox\n#https://desustorage.org/_/search/image/%sMD5/\n#https://archive.4plebs.org/_/search/image/%sMD5/\n#https://boards.fireden.net/_/search/image/%sMD5/\n#https://foolz.fireden.net/_/search/image/%sMD5/\n\n# Other tools:\n#http://regex.info/exif.cgi?imgurl=%URL\n#//imgops.com/%URL;types:gif,jpg,png\n#//www.gif-explode.com/%URL;types:gif",
    FappeT: {
      werk: false
    },
    'Custom CSS': true,
    Index: {
      'Index Mode': 'paged',
      'Previous Index Mode': 'paged',
      'Index Size': 'small',
      'Show Replies': true,
      'Pin Watched Threads': false,
      'Anchor Hidden Threads': true,
      'Refreshed Navigation': false
    },
    Header: {
      'Fixed Header': true,
      'Header auto-hide': false,
      'Header auto-hide on scroll': false,
      'Bottom Header': false,
      'Centered links': false,
      'Header catalog links': false,
      'Bottom Board List': true,
      'Shortcut Icons': true,
      'Custom Board Navigation': true
    },
    archives: {
      archiveLists: 'https://mayhemydg.github.io/archives.json/archives.json',
      lastarchivecheck: 0,
      archiveAutoUpdate: true
    },
    boardnav: "[ toggle-all ]\na-replace\nc-replace\ng-replace\nk-replace\nv-replace\nvg-replace\nvr-replace\nck-replace\nco-replace\nfit-replace\njp-replace\nmu-replace\nsp-replace\ntv-replace\nvp-replace\n[external-text:\"FAQ\",\"https://github.com/ccd0/4chan-x/wiki/Frequently-Asked-Questions\"]",
    QR: {
      'QR.personas': "#options:\"sage\";boards:jp;always",
      sjisPreview: false
    },
    jsWhitelist: 'http://s.4cdn.org\nhttps://s.4cdn.org\nhttp://www.google.com\nhttps://www.google.com\nhttps://www.gstatic.com\n\'self\'\n\'unsafe-inline\'\n\'unsafe-eval\'',
    captchaLanguage: '',
    time: '%m/%d/%y(%a)%H:%M:%S',
    backlink: '>>%id',
    fileInfo: '%l (%p%s, %r%g)',
    favicon: 'ferongr',
    usercss: "/* Board title rice */\n" +
"div.boardTitle {\n" +
"  font-weight: 400 !important;\n" +
"}\n" +
":root.yotsuba div.boardTitle {\n" +
"  font-family: sans-serif !important;\n" +
"  text-shadow: 1px 1px 1px rgba(100,0,0,0.6);\n" +
"}\n" +
":root.yotsuba-b div.boardTitle {\n" +
"  font-family: sans-serif !important;\n" +
"  text-shadow: 1px 1px 1px rgba(105,10,15,0.6);\n" +
"}\n" +
":root.photon div.boardTitle {\n" +
"  font-family: sans-serif !important;\n" +
"  text-shadow: 1px 1px 1px rgba(0,74,153,0.6);\n" +
"}\n" +
":root.tomorrow div.boardTitle {\n" +
"  font-family: sans-serif !important;\n" +
"  text-shadow: 1px 1px 1px rgba(167,170,168,0.6);\n" +
"}\n",
    hotkeys: {
      'Toggle board list': ['Ctrl+b', 'Toggle the full board list.'],
      'Toggle header': ['Shift+h', 'Toggle the auto-hide option of the header.'],
      'Open empty QR': ['q', 'Open QR without post number inserted.'],
      'Open QR': ['Shift+q', 'Open QR with post number inserted.'],
      'Open settings': ['Alt+o', 'Open Settings.'],
      'Close': ['Esc', 'Close dialogs or notifications.'],
      'Spoiler tags': ['Ctrl+s', 'Insert spoiler tags.'],
      'Code tags': ['Alt+c', 'Insert code tags.'],
      'Eqn tags': ['Alt+e', 'Insert eqn tags.'],
      'Math tags': ['Alt+m', 'Insert math tags.'],
      'SJIS tags': ['Alt+a', 'Insert SJIS tags.'],
      'Toggle sage': ['Alt+s', 'Toggle sage in options field.'],
      'Submit QR': ['Ctrl+Enter', 'Submit post.'],
      'Watch': ['w', 'Watch thread.'],
      'Update': ['r', 'Update the thread / refresh the index.'],
      'Update thread watcher': ['Shift+r', 'Manually refresh thread watcher.'],
      'Expand image': ['Shift+e', 'Expand selected image.'],
      'Expand images': ['e', 'Expand all images.'],
      'Open Gallery': ['g', 'Opens the gallery.'],
      'Pause': ['p', 'Pause/play videos in the gallery.'],
      'Slideshow': ['Ctrl+Right', 'Toggle the gallery slideshow mode.'],
      'fappeTyme': ['f', 'Toggle Fappe Tyme.'],
      'werkTyme': ['Shift+w', 'Toggle Werk Tyme.'],
      'Front page': ['1', 'Jump to front page.'],
      'Open front page': ['Shift+1', 'Open front page in a new tab.'],
      'Next page': ['Ctrl+Right', 'Jump to the next page.'],
      'Previous page': ['Ctrl+Left', 'Jump to the previous page.'],
      'Paged mode': ['Alt+1', 'Open the index in paged mode.'],
      'Infinite scrolling mode': ['Alt+2', 'Open the index in infinite scrolling mode.'],
      'All pages mode': ['Alt+3', 'Open the index in all threads mode.'],
      'Open catalog': ['Shift+c', 'Open the catalog of the current board.'],
      'Search form': ['Ctrl+Alt+s', 'Focus the search field on the board index.'],
      'Cycle sort type': ['Alt+x', 'Cycle through index sort types.'],
      'Next thread': ['Ctrl+Down', 'See next thread.'],
      'Previous thread': ['Ctrl+Up', 'See previous thread.'],
      'Expand thread': ['Ctrl+e', 'Expand thread.'],
      'Open thread': ['o', 'Open thread in current tab.'],
      'Open thread tab': ['Shift+o', 'Open thread in new tab.'],
      'Next reply': ['j', 'Select next reply.'],
      'Previous reply': ['k', 'Select previous reply.'],
      'Deselect reply': ['Shift+d', 'Deselect reply.'],
      'Hide': ['x', 'Hide thread.'],
      'Previous Post Quoting You': ['Alt+Up', 'Scroll to the previous post that quotes you.'],
      'Next Post Quoting You': ['Alt+Down', 'Scroll to the next post that quotes you.']
    },
    updater: {
      checkbox: {
        'Beep': [false, 'Beep on new post to completely read thread.'],
        'Beep Quoting You': [false, 'Beep on new post quoting you.'],
        'Auto Scroll': [false, 'Scroll updated posts into view. Only enabled at bottom of page.'],
        'Bottom Scroll': [false, 'Always scroll to the bottom, not the first new post. Useful for event threads.'],
        'Scroll BG': [false, 'Auto-scroll background tabs.'],
        'Auto Update': [true, 'Automatically fetch new posts.'],
        'Optional Increase': [false, 'Increase the intervals between updates on threads without new posts.']
      },
      'Interval': 30
    },
    customCooldown: 0,
    customCooldownEnabled: true,
    'Thread Quotes': false,
    'Max Replies': 1000,
    'Autohiding Scrollbar': false
  };

  return Config;

}).call(this);

CSS = {

boards:
"/*!\n" +
" *  Font Awesome 4.6.1 by @davegandy - http://fontawesome.io - @fontawesome\n" +
" *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n" +
" */\n" +
"@font-face {\n" +
"  font-family: FontAwesome;\n" +
"  src: url('data:application/font-woff;base64,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') format('woff');\n" +
"  font-weight: 400;\n" +
"  font-style: normal;\n" +
"}\n" +
".fa-glass:before {content: \"\\f000\";}\n" +
".fa-music:before {content: \"\\f001\";}\n" +
".fa-search:before {content: \"\\f002\";}\n" +
".fa-envelope-o:before {content: \"\\f003\";}\n" +
".fa-heart:before {content: \"\\f004\";}\n" +
".fa-star:before {content: \"\\f005\";}\n" +
".fa-star-o:before {content: \"\\f006\";}\n" +
".fa-user:before {content: \"\\f007\";}\n" +
".fa-film:before {content: \"\\f008\";}\n" +
".fa-th-large:before {content: \"\\f009\";}\n" +
".fa-th:before {content: \"\\f00a\";}\n" +
".fa-th-list:before {content: \"\\f00b\";}\n" +
".fa-check:before {content: \"\\f00c\";}\n" +
".fa-remove:before, .fa-close:before, .fa-times:before {content: \"\\f00d\";}\n" +
".fa-search-plus:before {content: \"\\f00e\";}\n" +
".fa-search-minus:before {content: \"\\f010\";}\n" +
".fa-power-off:before {content: \"\\f011\";}\n" +
".fa-signal:before {content: \"\\f012\";}\n" +
".fa-gear:before, .fa-cog:before {content: \"\\f013\";}\n" +
".fa-trash-o:before {content: \"\\f014\";}\n" +
".fa-home:before {content: \"\\f015\";}\n" +
".fa-file-o:before {content: \"\\f016\";}\n" +
".fa-clock-o:before {content: \"\\f017\";}\n" +
".fa-road:before {content: \"\\f018\";}\n" +
".fa-download:before {content: \"\\f019\";}\n" +
".fa-arrow-circle-o-down:before {content: \"\\f01a\";}\n" +
".fa-arrow-circle-o-up:before {content: \"\\f01b\";}\n" +
".fa-inbox:before {content: \"\\f01c\";}\n" +
".fa-play-circle-o:before {content: \"\\f01d\";}\n" +
".fa-rotate-right:before, .fa-repeat:before {content: \"\\f01e\";}\n" +
".fa-refresh:before {content: \"\\f021\";}\n" +
".fa-list-alt:before {content: \"\\f022\";}\n" +
".fa-lock:before {content: \"\\f023\";}\n" +
".fa-flag:before {content: \"\\f024\";}\n" +
".fa-headphones:before {content: \"\\f025\";}\n" +
".fa-volume-off:before {content: \"\\f026\";}\n" +
".fa-volume-down:before {content: \"\\f027\";}\n" +
".fa-volume-up:before {content: \"\\f028\";}\n" +
".fa-qrcode:before {content: \"\\f029\";}\n" +
".fa-barcode:before {content: \"\\f02a\";}\n" +
".fa-tag:before {content: \"\\f02b\";}\n" +
".fa-tags:before {content: \"\\f02c\";}\n" +
".fa-book:before {content: \"\\f02d\";}\n" +
".fa-bookmark:before {content: \"\\f02e\";}\n" +
".fa-print:before {content: \"\\f02f\";}\n" +
".fa-camera:before {content: \"\\f030\";}\n" +
".fa-font:before {content: \"\\f031\";}\n" +
".fa-bold:before {content: \"\\f032\";}\n" +
".fa-italic:before {content: \"\\f033\";}\n" +
".fa-text-height:before {content: \"\\f034\";}\n" +
".fa-text-width:before {content: \"\\f035\";}\n" +
".fa-align-left:before {content: \"\\f036\";}\n" +
".fa-align-center:before {content: \"\\f037\";}\n" +
".fa-align-right:before {content: \"\\f038\";}\n" +
".fa-align-justify:before {content: \"\\f039\";}\n" +
".fa-list:before {content: \"\\f03a\";}\n" +
".fa-dedent:before, .fa-outdent:before {content: \"\\f03b\";}\n" +
".fa-indent:before {content: \"\\f03c\";}\n" +
".fa-video-camera:before {content: \"\\f03d\";}\n" +
".fa-photo:before, .fa-image:before, .fa-picture-o:before {content: \"\\f03e\";}\n" +
".fa-pencil:before {content: \"\\f040\";}\n" +
".fa-map-marker:before {content: \"\\f041\";}\n" +
".fa-adjust:before {content: \"\\f042\";}\n" +
".fa-tint:before {content: \"\\f043\";}\n" +
".fa-edit:before, .fa-pencil-square-o:before {content: \"\\f044\";}\n" +
".fa-share-square-o:before {content: \"\\f045\";}\n" +
".fa-check-square-o:before {content: \"\\f046\";}\n" +
".fa-arrows:before {content: \"\\f047\";}\n" +
".fa-step-backward:before {content: \"\\f048\";}\n" +
".fa-fast-backward:before {content: \"\\f049\";}\n" +
".fa-backward:before {content: \"\\f04a\";}\n" +
".fa-play:before {content: \"\\f04b\";}\n" +
".fa-pause:before {content: \"\\f04c\";}\n" +
".fa-stop:before {content: \"\\f04d\";}\n" +
".fa-forward:before {content: \"\\f04e\";}\n" +
".fa-fast-forward:before {content: \"\\f050\";}\n" +
".fa-step-forward:before {content: \"\\f051\";}\n" +
".fa-eject:before {content: \"\\f052\";}\n" +
".fa-chevron-left:before {content: \"\\f053\";}\n" +
".fa-chevron-right:before {content: \"\\f054\";}\n" +
".fa-plus-circle:before {content: \"\\f055\";}\n" +
".fa-minus-circle:before {content: \"\\f056\";}\n" +
".fa-times-circle:before {content: \"\\f057\";}\n" +
".fa-check-circle:before {content: \"\\f058\";}\n" +
".fa-question-circle:before {content: \"\\f059\";}\n" +
".fa-info-circle:before {content: \"\\f05a\";}\n" +
".fa-crosshairs:before {content: \"\\f05b\";}\n" +
".fa-times-circle-o:before {content: \"\\f05c\";}\n" +
".fa-check-circle-o:before {content: \"\\f05d\";}\n" +
".fa-ban:before {content: \"\\f05e\";}\n" +
".fa-arrow-left:before {content: \"\\f060\";}\n" +
".fa-arrow-right:before {content: \"\\f061\";}\n" +
".fa-arrow-up:before {content: \"\\f062\";}\n" +
".fa-arrow-down:before {content: \"\\f063\";}\n" +
".fa-mail-forward:before, .fa-share:before {content: \"\\f064\";}\n" +
".fa-expand:before {content: \"\\f065\";}\n" +
".fa-compress:before {content: \"\\f066\";}\n" +
".fa-plus:before {content: \"\\f067\";}\n" +
".fa-minus:before {content: \"\\f068\";}\n" +
".fa-asterisk:before {content: \"\\f069\";}\n" +
".fa-exclamation-circle:before {content: \"\\f06a\";}\n" +
".fa-gift:before {content: \"\\f06b\";}\n" +
".fa-leaf:before {content: \"\\f06c\";}\n" +
".fa-fire:before {content: \"\\f06d\";}\n" +
".fa-eye:before {content: \"\\f06e\";}\n" +
".fa-eye-slash:before {content: \"\\f070\";}\n" +
".fa-warning:before, .fa-exclamation-triangle:before {content: \"\\f071\";}\n" +
".fa-plane:before {content: \"\\f072\";}\n" +
".fa-calendar:before {content: \"\\f073\";}\n" +
".fa-random:before {content: \"\\f074\";}\n" +
".fa-comment:before {content: \"\\f075\";}\n" +
".fa-magnet:before {content: \"\\f076\";}\n" +
".fa-chevron-up:before {content: \"\\f077\";}\n" +
".fa-chevron-down:before {content: \"\\f078\";}\n" +
".fa-retweet:before {content: \"\\f079\";}\n" +
".fa-shopping-cart:before {content: \"\\f07a\";}\n" +
".fa-folder:before {content: \"\\f07b\";}\n" +
".fa-folder-open:before {content: \"\\f07c\";}\n" +
".fa-arrows-v:before {content: \"\\f07d\";}\n" +
".fa-arrows-h:before {content: \"\\f07e\";}\n" +
".fa-bar-chart-o:before, .fa-bar-chart:before {content: \"\\f080\";}\n" +
".fa-twitter-square:before {content: \"\\f081\";}\n" +
".fa-facebook-square:before {content: \"\\f082\";}\n" +
".fa-camera-retro:before {content: \"\\f083\";}\n" +
".fa-key:before {content: \"\\f084\";}\n" +
".fa-gears:before, .fa-cogs:before {content: \"\\f085\";}\n" +
".fa-comments:before {content: \"\\f086\";}\n" +
".fa-thumbs-o-up:before {content: \"\\f087\";}\n" +
".fa-thumbs-o-down:before {content: \"\\f088\";}\n" +
".fa-star-half:before {content: \"\\f089\";}\n" +
".fa-heart-o:before {content: \"\\f08a\";}\n" +
".fa-sign-out:before {content: \"\\f08b\";}\n" +
".fa-linkedin-square:before {content: \"\\f08c\";}\n" +
".fa-thumb-tack:before {content: \"\\f08d\";}\n" +
".fa-external-link:before {content: \"\\f08e\";}\n" +
".fa-sign-in:before {content: \"\\f090\";}\n" +
".fa-trophy:before {content: \"\\f091\";}\n" +
".fa-github-square:before {content: \"\\f092\";}\n" +
".fa-upload:before {content: \"\\f093\";}\n" +
".fa-lemon-o:before {content: \"\\f094\";}\n" +
".fa-phone:before {content: \"\\f095\";}\n" +
".fa-square-o:before {content: \"\\f096\";}\n" +
".fa-bookmark-o:before {content: \"\\f097\";}\n" +
".fa-phone-square:before {content: \"\\f098\";}\n" +
".fa-twitter:before {content: \"\\f099\";}\n" +
".fa-facebook-f:before, .fa-facebook:before {content: \"\\f09a\";}\n" +
".fa-github:before {content: \"\\f09b\";}\n" +
".fa-unlock:before {content: \"\\f09c\";}\n" +
".fa-credit-card:before {content: \"\\f09d\";}\n" +
".fa-feed:before, .fa-rss:before {content: \"\\f09e\";}\n" +
".fa-hdd-o:before {content: \"\\f0a0\";}\n" +
".fa-bullhorn:before {content: \"\\f0a1\";}\n" +
".fa-bell:before {content: \"\\f0f3\";}\n" +
".fa-certificate:before {content: \"\\f0a3\";}\n" +
".fa-hand-o-right:before {content: \"\\f0a4\";}\n" +
".fa-hand-o-left:before {content: \"\\f0a5\";}\n" +
".fa-hand-o-up:before {content: \"\\f0a6\";}\n" +
".fa-hand-o-down:before {content: \"\\f0a7\";}\n" +
".fa-arrow-circle-left:before {content: \"\\f0a8\";}\n" +
".fa-arrow-circle-right:before {content: \"\\f0a9\";}\n" +
".fa-arrow-circle-up:before {content: \"\\f0aa\";}\n" +
".fa-arrow-circle-down:before {content: \"\\f0ab\";}\n" +
".fa-globe:before {content: \"\\f0ac\";}\n" +
".fa-wrench:before {content: \"\\f0ad\";}\n" +
".fa-tasks:before {content: \"\\f0ae\";}\n" +
".fa-filter:before {content: \"\\f0b0\";}\n" +
".fa-briefcase:before {content: \"\\f0b1\";}\n" +
".fa-arrows-alt:before {content: \"\\f0b2\";}\n" +
".fa-group:before, .fa-users:before {content: \"\\f0c0\";}\n" +
".fa-chain:before, .fa-link:before {content: \"\\f0c1\";}\n" +
".fa-cloud:before {content: \"\\f0c2\";}\n" +
".fa-flask:before {content: \"\\f0c3\";}\n" +
".fa-cut:before, .fa-scissors:before {content: \"\\f0c4\";}\n" +
".fa-copy:before, .fa-files-o:before {content: \"\\f0c5\";}\n" +
".fa-paperclip:before {content: \"\\f0c6\";}\n" +
".fa-save:before, .fa-floppy-o:before {content: \"\\f0c7\";}\n" +
".fa-square:before {content: \"\\f0c8\";}\n" +
".fa-navicon:before, .fa-reorder:before, .fa-bars:before {content: \"\\f0c9\";}\n" +
".fa-list-ul:before {content: \"\\f0ca\";}\n" +
".fa-list-ol:before {content: \"\\f0cb\";}\n" +
".fa-strikethrough:before {content: \"\\f0cc\";}\n" +
".fa-underline:before {content: \"\\f0cd\";}\n" +
".fa-table:before {content: \"\\f0ce\";}\n" +
".fa-magic:before {content: \"\\f0d0\";}\n" +
".fa-truck:before {content: \"\\f0d1\";}\n" +
".fa-pinterest:before {content: \"\\f0d2\";}\n" +
".fa-pinterest-square:before {content: \"\\f0d3\";}\n" +
".fa-google-plus-square:before {content: \"\\f0d4\";}\n" +
".fa-google-plus:before {content: \"\\f0d5\";}\n" +
".fa-money:before {content: \"\\f0d6\";}\n" +
".fa-caret-down:before {content: \"\\f0d7\";}\n" +
".fa-caret-up:before {content: \"\\f0d8\";}\n" +
".fa-caret-left:before {content: \"\\f0d9\";}\n" +
".fa-caret-right:before {content: \"\\f0da\";}\n" +
".fa-columns:before {content: \"\\f0db\";}\n" +
".fa-unsorted:before, .fa-sort:before {content: \"\\f0dc\";}\n" +
".fa-sort-down:before, .fa-sort-desc:before {content: \"\\f0dd\";}\n" +
".fa-sort-up:before, .fa-sort-asc:before {content: \"\\f0de\";}\n" +
".fa-envelope:before {content: \"\\f0e0\";}\n" +
".fa-linkedin:before {content: \"\\f0e1\";}\n" +
".fa-rotate-left:before, .fa-undo:before {content: \"\\f0e2\";}\n" +
".fa-legal:before, .fa-gavel:before {content: \"\\f0e3\";}\n" +
".fa-dashboard:before, .fa-tachometer:before {content: \"\\f0e4\";}\n" +
".fa-comment-o:before {content: \"\\f0e5\";}\n" +
".fa-comments-o:before {content: \"\\f0e6\";}\n" +
".fa-flash:before, .fa-bolt:before {content: \"\\f0e7\";}\n" +
".fa-sitemap:before {content: \"\\f0e8\";}\n" +
".fa-umbrella:before {content: \"\\f0e9\";}\n" +
".fa-paste:before, .fa-clipboard:before {content: \"\\f0ea\";}\n" +
".fa-lightbulb-o:before {content: \"\\f0eb\";}\n" +
".fa-exchange:before {content: \"\\f0ec\";}\n" +
".fa-cloud-download:before {content: \"\\f0ed\";}\n" +
".fa-cloud-upload:before {content: \"\\f0ee\";}\n" +
".fa-user-md:before {content: \"\\f0f0\";}\n" +
".fa-stethoscope:before {content: \"\\f0f1\";}\n" +
".fa-suitcase:before {content: \"\\f0f2\";}\n" +
".fa-bell-o:before {content: \"\\f0a2\";}\n" +
".fa-coffee:before {content: \"\\f0f4\";}\n" +
".fa-cutlery:before {content: \"\\f0f5\";}\n" +
".fa-file-text-o:before {content: \"\\f0f6\";}\n" +
".fa-building-o:before {content: \"\\f0f7\";}\n" +
".fa-hospital-o:before {content: \"\\f0f8\";}\n" +
".fa-ambulance:before {content: \"\\f0f9\";}\n" +
".fa-medkit:before {content: \"\\f0fa\";}\n" +
".fa-fighter-jet:before {content: \"\\f0fb\";}\n" +
".fa-beer:before {content: \"\\f0fc\";}\n" +
".fa-h-square:before {content: \"\\f0fd\";}\n" +
".fa-plus-square:before {content: \"\\f0fe\";}\n" +
".fa-angle-double-left:before {content: \"\\f100\";}\n" +
".fa-angle-double-right:before {content: \"\\f101\";}\n" +
".fa-angle-double-up:before {content: \"\\f102\";}\n" +
".fa-angle-double-down:before {content: \"\\f103\";}\n" +
".fa-angle-left:before {content: \"\\f104\";}\n" +
".fa-angle-right:before {content: \"\\f105\";}\n" +
".fa-angle-up:before {content: \"\\f106\";}\n" +
".fa-angle-down:before {content: \"\\f107\";}\n" +
".fa-desktop:before {content: \"\\f108\";}\n" +
".fa-laptop:before {content: \"\\f109\";}\n" +
".fa-tablet:before {content: \"\\f10a\";}\n" +
".fa-mobile-phone:before, .fa-mobile:before {content: \"\\f10b\";}\n" +
".fa-circle-o:before {content: \"\\f10c\";}\n" +
".fa-quote-left:before {content: \"\\f10d\";}\n" +
".fa-quote-right:before {content: \"\\f10e\";}\n" +
".fa-spinner:before {content: \"\\f110\";}\n" +
".fa-circle:before {content: \"\\f111\";}\n" +
".fa-mail-reply:before, .fa-reply:before {content: \"\\f112\";}\n" +
".fa-github-alt:before {content: \"\\f113\";}\n" +
".fa-folder-o:before {content: \"\\f114\";}\n" +
".fa-folder-open-o:before {content: \"\\f115\";}\n" +
".fa-smile-o:before {content: \"\\f118\";}\n" +
".fa-frown-o:before {content: \"\\f119\";}\n" +
".fa-meh-o:before {content: \"\\f11a\";}\n" +
".fa-gamepad:before {content: \"\\f11b\";}\n" +
".fa-keyboard-o:before {content: \"\\f11c\";}\n" +
".fa-flag-o:before {content: \"\\f11d\";}\n" +
".fa-flag-checkered:before {content: \"\\f11e\";}\n" +
".fa-terminal:before {content: \"\\f120\";}\n" +
".fa-code:before {content: \"\\f121\";}\n" +
".fa-mail-reply-all:before, .fa-reply-all:before {content: \"\\f122\";}\n" +
".fa-star-half-empty:before, .fa-star-half-full:before, .fa-star-half-o:before {content: \"\\f123\";}\n" +
".fa-location-arrow:before {content: \"\\f124\";}\n" +
".fa-crop:before {content: \"\\f125\";}\n" +
".fa-code-fork:before {content: \"\\f126\";}\n" +
".fa-unlink:before, .fa-chain-broken:before {content: \"\\f127\";}\n" +
".fa-question:before {content: \"\\f128\";}\n" +
".fa-info:before {content: \"\\f129\";}\n" +
".fa-exclamation:before {content: \"\\f12a\";}\n" +
".fa-superscript:before {content: \"\\f12b\";}\n" +
".fa-subscript:before {content: \"\\f12c\";}\n" +
".fa-eraser:before {content: \"\\f12d\";}\n" +
".fa-puzzle-piece:before {content: \"\\f12e\";}\n" +
".fa-microphone:before {content: \"\\f130\";}\n" +
".fa-microphone-slash:before {content: \"\\f131\";}\n" +
".fa-shield:before {content: \"\\f132\";}\n" +
".fa-calendar-o:before {content: \"\\f133\";}\n" +
".fa-fire-extinguisher:before {content: \"\\f134\";}\n" +
".fa-rocket:before {content: \"\\f135\";}\n" +
".fa-maxcdn:before {content: \"\\f136\";}\n" +
".fa-chevron-circle-left:before {content: \"\\f137\";}\n" +
".fa-chevron-circle-right:before {content: \"\\f138\";}\n" +
".fa-chevron-circle-up:before {content: \"\\f139\";}\n" +
".fa-chevron-circle-down:before {content: \"\\f13a\";}\n" +
".fa-html5:before {content: \"\\f13b\";}\n" +
".fa-css3:before {content: \"\\f13c\";}\n" +
".fa-anchor:before {content: \"\\f13d\";}\n" +
".fa-unlock-alt:before {content: \"\\f13e\";}\n" +
".fa-bullseye:before {content: \"\\f140\";}\n" +
".fa-ellipsis-h:before {content: \"\\f141\";}\n" +
".fa-ellipsis-v:before {content: \"\\f142\";}\n" +
".fa-rss-square:before {content: \"\\f143\";}\n" +
".fa-play-circle:before {content: \"\\f144\";}\n" +
".fa-ticket:before {content: \"\\f145\";}\n" +
".fa-minus-square:before {content: \"\\f146\";}\n" +
".fa-minus-square-o:before {content: \"\\f147\";}\n" +
".fa-level-up:before {content: \"\\f148\";}\n" +
".fa-level-down:before {content: \"\\f149\";}\n" +
".fa-check-square:before {content: \"\\f14a\";}\n" +
".fa-pencil-square:before {content: \"\\f14b\";}\n" +
".fa-external-link-square:before {content: \"\\f14c\";}\n" +
".fa-share-square:before {content: \"\\f14d\";}\n" +
".fa-compass:before {content: \"\\f14e\";}\n" +
".fa-toggle-down:before, .fa-caret-square-o-down:before {content: \"\\f150\";}\n" +
".fa-toggle-up:before, .fa-caret-square-o-up:before {content: \"\\f151\";}\n" +
".fa-toggle-right:before, .fa-caret-square-o-right:before {content: \"\\f152\";}\n" +
".fa-euro:before, .fa-eur:before {content: \"\\f153\";}\n" +
".fa-gbp:before {content: \"\\f154\";}\n" +
".fa-dollar:before, .fa-usd:before {content: \"\\f155\";}\n" +
".fa-rupee:before, .fa-inr:before {content: \"\\f156\";}\n" +
".fa-cny:before, .fa-rmb:before, .fa-yen:before, .fa-jpy:before {content: \"\\f157\";}\n" +
".fa-ruble:before, .fa-rouble:before, .fa-rub:before {content: \"\\f158\";}\n" +
".fa-won:before, .fa-krw:before {content: \"\\f159\";}\n" +
".fa-bitcoin:before, .fa-btc:before {content: \"\\f15a\";}\n" +
".fa-file:before {content: \"\\f15b\";}\n" +
".fa-file-text:before {content: \"\\f15c\";}\n" +
".fa-sort-alpha-asc:before {content: \"\\f15d\";}\n" +
".fa-sort-alpha-desc:before {content: \"\\f15e\";}\n" +
".fa-sort-amount-asc:before {content: \"\\f160\";}\n" +
".fa-sort-amount-desc:before {content: \"\\f161\";}\n" +
".fa-sort-numeric-asc:before {content: \"\\f162\";}\n" +
".fa-sort-numeric-desc:before {content: \"\\f163\";}\n" +
".fa-thumbs-up:before {content: \"\\f164\";}\n" +
".fa-thumbs-down:before {content: \"\\f165\";}\n" +
".fa-youtube-square:before {content: \"\\f166\";}\n" +
".fa-youtube:before {content: \"\\f167\";}\n" +
".fa-xing:before {content: \"\\f168\";}\n" +
".fa-xing-square:before {content: \"\\f169\";}\n" +
".fa-youtube-play:before {content: \"\\f16a\";}\n" +
".fa-dropbox:before {content: \"\\f16b\";}\n" +
".fa-stack-overflow:before {content: \"\\f16c\";}\n" +
".fa-instagram:before {content: \"\\f16d\";}\n" +
".fa-flickr:before {content: \"\\f16e\";}\n" +
".fa-adn:before {content: \"\\f170\";}\n" +
".fa-bitbucket:before {content: \"\\f171\";}\n" +
".fa-bitbucket-square:before {content: \"\\f172\";}\n" +
".fa-tumblr:before {content: \"\\f173\";}\n" +
".fa-tumblr-square:before {content: \"\\f174\";}\n" +
".fa-long-arrow-down:before {content: \"\\f175\";}\n" +
".fa-long-arrow-up:before {content: \"\\f176\";}\n" +
".fa-long-arrow-left:before {content: \"\\f177\";}\n" +
".fa-long-arrow-right:before {content: \"\\f178\";}\n" +
".fa-apple:before {content: \"\\f179\";}\n" +
".fa-windows:before {content: \"\\f17a\";}\n" +
".fa-android:before {content: \"\\f17b\";}\n" +
".fa-linux:before {content: \"\\f17c\";}\n" +
".fa-dribbble:before {content: \"\\f17d\";}\n" +
".fa-skype:before {content: \"\\f17e\";}\n" +
".fa-foursquare:before {content: \"\\f180\";}\n" +
".fa-trello:before {content: \"\\f181\";}\n" +
".fa-female:before {content: \"\\f182\";}\n" +
".fa-male:before {content: \"\\f183\";}\n" +
".fa-gittip:before, .fa-gratipay:before {content: \"\\f184\";}\n" +
".fa-sun-o:before {content: \"\\f185\";}\n" +
".fa-moon-o:before {content: \"\\f186\";}\n" +
".fa-archive:before {content: \"\\f187\";}\n" +
".fa-bug:before {content: \"\\f188\";}\n" +
".fa-vk:before {content: \"\\f189\";}\n" +
".fa-weibo:before {content: \"\\f18a\";}\n" +
".fa-renren:before {content: \"\\f18b\";}\n" +
".fa-pagelines:before {content: \"\\f18c\";}\n" +
".fa-stack-exchange:before {content: \"\\f18d\";}\n" +
".fa-arrow-circle-o-right:before {content: \"\\f18e\";}\n" +
".fa-arrow-circle-o-left:before {content: \"\\f190\";}\n" +
".fa-toggle-left:before, .fa-caret-square-o-left:before {content: \"\\f191\";}\n" +
".fa-dot-circle-o:before {content: \"\\f192\";}\n" +
".fa-wheelchair:before {content: \"\\f193\";}\n" +
".fa-vimeo-square:before {content: \"\\f194\";}\n" +
".fa-turkish-lira:before, .fa-try:before {content: \"\\f195\";}\n" +
".fa-plus-square-o:before {content: \"\\f196\";}\n" +
".fa-space-shuttle:before {content: \"\\f197\";}\n" +
".fa-slack:before {content: \"\\f198\";}\n" +
".fa-envelope-square:before {content: \"\\f199\";}\n" +
".fa-wordpress:before {content: \"\\f19a\";}\n" +
".fa-openid:before {content: \"\\f19b\";}\n" +
".fa-institution:before, .fa-bank:before, .fa-university:before {content: \"\\f19c\";}\n" +
".fa-mortar-board:before, .fa-graduation-cap:before {content: \"\\f19d\";}\n" +
".fa-yahoo:before {content: \"\\f19e\";}\n" +
".fa-google:before {content: \"\\f1a0\";}\n" +
".fa-reddit:before {content: \"\\f1a1\";}\n" +
".fa-reddit-square:before {content: \"\\f1a2\";}\n" +
".fa-stumbleupon-circle:before {content: \"\\f1a3\";}\n" +
".fa-stumbleupon:before {content: \"\\f1a4\";}\n" +
".fa-delicious:before {content: \"\\f1a5\";}\n" +
".fa-digg:before {content: \"\\f1a6\";}\n" +
".fa-pied-piper:before {content: \"\\f1a7\";}\n" +
".fa-pied-piper-alt:before {content: \"\\f1a8\";}\n" +
".fa-drupal:before {content: \"\\f1a9\";}\n" +
".fa-joomla:before {content: \"\\f1aa\";}\n" +
".fa-language:before {content: \"\\f1ab\";}\n" +
".fa-fax:before {content: \"\\f1ac\";}\n" +
".fa-building:before {content: \"\\f1ad\";}\n" +
".fa-child:before {content: \"\\f1ae\";}\n" +
".fa-paw:before {content: \"\\f1b0\";}\n" +
".fa-spoon:before {content: \"\\f1b1\";}\n" +
".fa-cube:before {content: \"\\f1b2\";}\n" +
".fa-cubes:before {content: \"\\f1b3\";}\n" +
".fa-behance:before {content: \"\\f1b4\";}\n" +
".fa-behance-square:before {content: \"\\f1b5\";}\n" +
".fa-steam:before {content: \"\\f1b6\";}\n" +
".fa-steam-square:before {content: \"\\f1b7\";}\n" +
".fa-recycle:before {content: \"\\f1b8\";}\n" +
".fa-automobile:before, .fa-car:before {content: \"\\f1b9\";}\n" +
".fa-cab:before, .fa-taxi:before {content: \"\\f1ba\";}\n" +
".fa-tree:before {content: \"\\f1bb\";}\n" +
".fa-spotify:before {content: \"\\f1bc\";}\n" +
".fa-deviantart:before {content: \"\\f1bd\";}\n" +
".fa-soundcloud:before {content: \"\\f1be\";}\n" +
".fa-database:before {content: \"\\f1c0\";}\n" +
".fa-file-pdf-o:before {content: \"\\f1c1\";}\n" +
".fa-file-word-o:before {content: \"\\f1c2\";}\n" +
".fa-file-excel-o:before {content: \"\\f1c3\";}\n" +
".fa-file-powerpoint-o:before {content: \"\\f1c4\";}\n" +
".fa-file-photo-o:before, .fa-file-picture-o:before, .fa-file-image-o:before {content: \"\\f1c5\";}\n" +
".fa-file-zip-o:before, .fa-file-archive-o:before {content: \"\\f1c6\";}\n" +
".fa-file-sound-o:before, .fa-file-audio-o:before {content: \"\\f1c7\";}\n" +
".fa-file-movie-o:before, .fa-file-video-o:before {content: \"\\f1c8\";}\n" +
".fa-file-code-o:before {content: \"\\f1c9\";}\n" +
".fa-vine:before {content: \"\\f1ca\";}\n" +
".fa-codepen:before {content: \"\\f1cb\";}\n" +
".fa-jsfiddle:before {content: \"\\f1cc\";}\n" +
".fa-life-bouy:before, .fa-life-buoy:before, .fa-life-saver:before, .fa-support:before, .fa-life-ring:before {content: \"\\f1cd\";}\n" +
".fa-circle-o-notch:before {content: \"\\f1ce\";}\n" +
".fa-ra:before, .fa-rebel:before {content: \"\\f1d0\";}\n" +
".fa-ge:before, .fa-empire:before {content: \"\\f1d1\";}\n" +
".fa-git-square:before {content: \"\\f1d2\";}\n" +
".fa-git:before {content: \"\\f1d3\";}\n" +
".fa-y-combinator-square:before, .fa-yc-square:before, .fa-hacker-news:before {content: \"\\f1d4\";}\n" +
".fa-tencent-weibo:before {content: \"\\f1d5\";}\n" +
".fa-qq:before {content: \"\\f1d6\";}\n" +
".fa-wechat:before, .fa-weixin:before {content: \"\\f1d7\";}\n" +
".fa-send:before, .fa-paper-plane:before {content: \"\\f1d8\";}\n" +
".fa-send-o:before, .fa-paper-plane-o:before {content: \"\\f1d9\";}\n" +
".fa-history:before {content: \"\\f1da\";}\n" +
".fa-circle-thin:before {content: \"\\f1db\";}\n" +
".fa-header:before {content: \"\\f1dc\";}\n" +
".fa-paragraph:before {content: \"\\f1dd\";}\n" +
".fa-sliders:before {content: \"\\f1de\";}\n" +
".fa-share-alt:before {content: \"\\f1e0\";}\n" +
".fa-share-alt-square:before {content: \"\\f1e1\";}\n" +
".fa-bomb:before {content: \"\\f1e2\";}\n" +
".fa-soccer-ball-o:before, .fa-futbol-o:before {content: \"\\f1e3\";}\n" +
".fa-tty:before {content: \"\\f1e4\";}\n" +
".fa-binoculars:before {content: \"\\f1e5\";}\n" +
".fa-plug:before {content: \"\\f1e6\";}\n" +
".fa-slideshare:before {content: \"\\f1e7\";}\n" +
".fa-twitch:before {content: \"\\f1e8\";}\n" +
".fa-yelp:before {content: \"\\f1e9\";}\n" +
".fa-newspaper-o:before {content: \"\\f1ea\";}\n" +
".fa-wifi:before {content: \"\\f1eb\";}\n" +
".fa-calculator:before {content: \"\\f1ec\";}\n" +
".fa-paypal:before {content: \"\\f1ed\";}\n" +
".fa-google-wallet:before {content: \"\\f1ee\";}\n" +
".fa-cc-visa:before {content: \"\\f1f0\";}\n" +
".fa-cc-mastercard:before {content: \"\\f1f1\";}\n" +
".fa-cc-discover:before {content: \"\\f1f2\";}\n" +
".fa-cc-amex:before {content: \"\\f1f3\";}\n" +
".fa-cc-paypal:before {content: \"\\f1f4\";}\n" +
".fa-cc-stripe:before {content: \"\\f1f5\";}\n" +
".fa-bell-slash:before {content: \"\\f1f6\";}\n" +
".fa-bell-slash-o:before {content: \"\\f1f7\";}\n" +
".fa-trash:before {content: \"\\f1f8\";}\n" +
".fa-copyright:before {content: \"\\f1f9\";}\n" +
".fa-at:before {content: \"\\f1fa\";}\n" +
".fa-eyedropper:before {content: \"\\f1fb\";}\n" +
".fa-paint-brush:before {content: \"\\f1fc\";}\n" +
".fa-birthday-cake:before {content: \"\\f1fd\";}\n" +
".fa-area-chart:before {content: \"\\f1fe\";}\n" +
".fa-pie-chart:before {content: \"\\f200\";}\n" +
".fa-line-chart:before {content: \"\\f201\";}\n" +
".fa-lastfm:before {content: \"\\f202\";}\n" +
".fa-lastfm-square:before {content: \"\\f203\";}\n" +
".fa-toggle-off:before {content: \"\\f204\";}\n" +
".fa-toggle-on:before {content: \"\\f205\";}\n" +
".fa-bicycle:before {content: \"\\f206\";}\n" +
".fa-bus:before {content: \"\\f207\";}\n" +
".fa-ioxhost:before {content: \"\\f208\";}\n" +
".fa-angellist:before {content: \"\\f209\";}\n" +
".fa-cc:before {content: \"\\f20a\";}\n" +
".fa-shekel:before, .fa-sheqel:before, .fa-ils:before {content: \"\\f20b\";}\n" +
".fa-meanpath:before {content: \"\\f20c\";}\n" +
".fa-buysellads:before {content: \"\\f20d\";}\n" +
".fa-connectdevelop:before {content: \"\\f20e\";}\n" +
".fa-dashcube:before {content: \"\\f210\";}\n" +
".fa-forumbee:before {content: \"\\f211\";}\n" +
".fa-leanpub:before {content: \"\\f212\";}\n" +
".fa-sellsy:before {content: \"\\f213\";}\n" +
".fa-shirtsinbulk:before {content: \"\\f214\";}\n" +
".fa-simplybuilt:before {content: \"\\f215\";}\n" +
".fa-skyatlas:before {content: \"\\f216\";}\n" +
".fa-cart-plus:before {content: \"\\f217\";}\n" +
".fa-cart-arrow-down:before {content: \"\\f218\";}\n" +
".fa-diamond:before {content: \"\\f219\";}\n" +
".fa-ship:before {content: \"\\f21a\";}\n" +
".fa-user-secret:before {content: \"\\f21b\";}\n" +
".fa-motorcycle:before {content: \"\\f21c\";}\n" +
".fa-street-view:before {content: \"\\f21d\";}\n" +
".fa-heartbeat:before {content: \"\\f21e\";}\n" +
".fa-venus:before {content: \"\\f221\";}\n" +
".fa-mars:before {content: \"\\f222\";}\n" +
".fa-mercury:before {content: \"\\f223\";}\n" +
".fa-intersex:before, .fa-transgender:before {content: \"\\f224\";}\n" +
".fa-transgender-alt:before {content: \"\\f225\";}\n" +
".fa-venus-double:before {content: \"\\f226\";}\n" +
".fa-mars-double:before {content: \"\\f227\";}\n" +
".fa-venus-mars:before {content: \"\\f228\";}\n" +
".fa-mars-stroke:before {content: \"\\f229\";}\n" +
".fa-mars-stroke-v:before {content: \"\\f22a\";}\n" +
".fa-mars-stroke-h:before {content: \"\\f22b\";}\n" +
".fa-neuter:before {content: \"\\f22c\";}\n" +
".fa-genderless:before {content: \"\\f22d\";}\n" +
".fa-facebook-official:before {content: \"\\f230\";}\n" +
".fa-pinterest-p:before {content: \"\\f231\";}\n" +
".fa-whatsapp:before {content: \"\\f232\";}\n" +
".fa-server:before {content: \"\\f233\";}\n" +
".fa-user-plus:before {content: \"\\f234\";}\n" +
".fa-user-times:before {content: \"\\f235\";}\n" +
".fa-hotel:before, .fa-bed:before {content: \"\\f236\";}\n" +
".fa-viacoin:before {content: \"\\f237\";}\n" +
".fa-train:before {content: \"\\f238\";}\n" +
".fa-subway:before {content: \"\\f239\";}\n" +
".fa-medium:before {content: \"\\f23a\";}\n" +
".fa-yc:before, .fa-y-combinator:before {content: \"\\f23b\";}\n" +
".fa-optin-monster:before {content: \"\\f23c\";}\n" +
".fa-opencart:before {content: \"\\f23d\";}\n" +
".fa-expeditedssl:before {content: \"\\f23e\";}\n" +
".fa-battery-4:before, .fa-battery-full:before {content: \"\\f240\";}\n" +
".fa-battery-3:before, .fa-battery-three-quarters:before {content: \"\\f241\";}\n" +
".fa-battery-2:before, .fa-battery-half:before {content: \"\\f242\";}\n" +
".fa-battery-1:before, .fa-battery-quarter:before {content: \"\\f243\";}\n" +
".fa-battery-0:before, .fa-battery-empty:before {content: \"\\f244\";}\n" +
".fa-mouse-pointer:before {content: \"\\f245\";}\n" +
".fa-i-cursor:before {content: \"\\f246\";}\n" +
".fa-object-group:before {content: \"\\f247\";}\n" +
".fa-object-ungroup:before {content: \"\\f248\";}\n" +
".fa-sticky-note:before {content: \"\\f249\";}\n" +
".fa-sticky-note-o:before {content: \"\\f24a\";}\n" +
".fa-cc-jcb:before {content: \"\\f24b\";}\n" +
".fa-cc-diners-club:before {content: \"\\f24c\";}\n" +
".fa-clone:before {content: \"\\f24d\";}\n" +
".fa-balance-scale:before {content: \"\\f24e\";}\n" +
".fa-hourglass-o:before {content: \"\\f250\";}\n" +
".fa-hourglass-1:before, .fa-hourglass-start:before {content: \"\\f251\";}\n" +
".fa-hourglass-2:before, .fa-hourglass-half:before {content: \"\\f252\";}\n" +
".fa-hourglass-3:before, .fa-hourglass-end:before {content: \"\\f253\";}\n" +
".fa-hourglass:before {content: \"\\f254\";}\n" +
".fa-hand-grab-o:before, .fa-hand-rock-o:before {content: \"\\f255\";}\n" +
".fa-hand-stop-o:before, .fa-hand-paper-o:before {content: \"\\f256\";}\n" +
".fa-hand-scissors-o:before {content: \"\\f257\";}\n" +
".fa-hand-lizard-o:before {content: \"\\f258\";}\n" +
".fa-hand-spock-o:before {content: \"\\f259\";}\n" +
".fa-hand-pointer-o:before {content: \"\\f25a\";}\n" +
".fa-hand-peace-o:before {content: \"\\f25b\";}\n" +
".fa-trademark:before {content: \"\\f25c\";}\n" +
".fa-registered:before {content: \"\\f25d\";}\n" +
".fa-creative-commons:before {content: \"\\f25e\";}\n" +
".fa-gg:before {content: \"\\f260\";}\n" +
".fa-gg-circle:before {content: \"\\f261\";}\n" +
".fa-tripadvisor:before {content: \"\\f262\";}\n" +
".fa-odnoklassniki:before {content: \"\\f263\";}\n" +
".fa-odnoklassniki-square:before {content: \"\\f264\";}\n" +
".fa-get-pocket:before {content: \"\\f265\";}\n" +
".fa-wikipedia-w:before {content: \"\\f266\";}\n" +
".fa-safari:before {content: \"\\f267\";}\n" +
".fa-chrome:before {content: \"\\f268\";}\n" +
".fa-firefox:before {content: \"\\f269\";}\n" +
".fa-opera:before {content: \"\\f26a\";}\n" +
".fa-internet-explorer:before {content: \"\\f26b\";}\n" +
".fa-tv:before, .fa-television:before {content: \"\\f26c\";}\n" +
".fa-contao:before {content: \"\\f26d\";}\n" +
".fa-500px:before {content: \"\\f26e\";}\n" +
".fa-amazon:before {content: \"\\f270\";}\n" +
".fa-calendar-plus-o:before {content: \"\\f271\";}\n" +
".fa-calendar-minus-o:before {content: \"\\f272\";}\n" +
".fa-calendar-times-o:before {content: \"\\f273\";}\n" +
".fa-calendar-check-o:before {content: \"\\f274\";}\n" +
".fa-industry:before {content: \"\\f275\";}\n" +
".fa-map-pin:before {content: \"\\f276\";}\n" +
".fa-map-signs:before {content: \"\\f277\";}\n" +
".fa-map-o:before {content: \"\\f278\";}\n" +
".fa-map:before {content: \"\\f279\";}\n" +
".fa-commenting:before {content: \"\\f27a\";}\n" +
".fa-commenting-o:before {content: \"\\f27b\";}\n" +
".fa-houzz:before {content: \"\\f27c\";}\n" +
".fa-vimeo:before {content: \"\\f27d\";}\n" +
".fa-black-tie:before {content: \"\\f27e\";}\n" +
".fa-fonticons:before {content: \"\\f280\";}\n" +
".fa-reddit-alien:before {content: \"\\f281\";}\n" +
".fa-edge:before {content: \"\\f282\";}\n" +
".fa-credit-card-alt:before {content: \"\\f283\";}\n" +
".fa-codiepie:before {content: \"\\f284\";}\n" +
".fa-modx:before {content: \"\\f285\";}\n" +
".fa-fort-awesome:before {content: \"\\f286\";}\n" +
".fa-usb:before {content: \"\\f287\";}\n" +
".fa-product-hunt:before {content: \"\\f288\";}\n" +
".fa-mixcloud:before {content: \"\\f289\";}\n" +
".fa-scribd:before {content: \"\\f28a\";}\n" +
".fa-pause-circle:before {content: \"\\f28b\";}\n" +
".fa-pause-circle-o:before {content: \"\\f28c\";}\n" +
".fa-stop-circle:before {content: \"\\f28d\";}\n" +
".fa-stop-circle-o:before {content: \"\\f28e\";}\n" +
".fa-shopping-bag:before {content: \"\\f290\";}\n" +
".fa-shopping-basket:before {content: \"\\f291\";}\n" +
".fa-hashtag:before {content: \"\\f292\";}\n" +
".fa-bluetooth:before {content: \"\\f293\";}\n" +
".fa-bluetooth-b:before {content: \"\\f294\";}\n" +
".fa-percent:before {content: \"\\f295\";}\n" +
".fa-gitlab:before {content: \"\\f296\";}\n" +
".fa-wpbeginner:before {content: \"\\f297\";}\n" +
".fa-wpforms:before {content: \"\\f298\";}\n" +
".fa-envira:before {content: \"\\f299\";}\n" +
".fa-universal-access:before {content: \"\\f29a\";}\n" +
".fa-wheelchair-alt:before {content: \"\\f29b\";}\n" +
".fa-question-circle-o:before {content: \"\\f29c\";}\n" +
".fa-blind:before {content: \"\\f29d\";}\n" +
".fa-audio-description:before {content: \"\\f29e\";}\n" +
".fa-volume-control-phone:before {content: \"\\f2a0\";}\n" +
".fa-braille:before {content: \"\\f2a1\";}\n" +
".fa-assistive-listening-systems:before {content: \"\\f2a2\";}\n" +
".fa-asl-interpreting:before, .fa-american-sign-language-interpreting:before {content: \"\\f2a3\";}\n" +
".fa-deafness:before, .fa-hard-of-hearing:before, .fa-deaf:before {content: \"\\f2a4\";}\n" +
".fa-glide:before {content: \"\\f2a5\";}\n" +
".fa-glide-g:before {content: \"\\f2a6\";}\n" +
".fa-signing:before, .fa-sign-language:before {content: \"\\f2a7\";}\n" +
".fa-low-vision:before {content: \"\\f2a8\";}\n" +
".fa-viadeo:before {content: \"\\f2a9\";}\n" +
".fa-viadeo-square:before {content: \"\\f2aa\";}\n" +
".fa-snapchat:before {content: \"\\f2ab\";}\n" +
".fa-snapchat-ghost:before {content: \"\\f2ac\";}\n" +
".fa-snapchat-square:before {content: \"\\f2ad\";}\n" +
".fa::before {\n" +
"  font-family: FontAwesome;\n" +
"  font-weight: 400;\n" +
"  font-style: normal;\n" +
"  -webkit-font-smoothing: antialiased;\n" +
"  text-decoration: inherit;\n" +
"  speak: none;\n" +
"  display: inline-block;\n" +
"  font-size: 13px;\n" +
"  visibility: visible;\n" +
"}\n" +
":root:not(.shortcut-icons) #shortcuts .fa::before {\n" +
"  display: none;\n" +
"}\n" +
":root.shortcut-icons #shortcuts .fa::before {\n" +
"  font-size: 15px !important;\n" +
"  margin-top: -3px !important;\n" +
"  position: relative;\n" +
"  top: 1px;\n" +
"}\n" +
":root.shortcut-icons #shortcuts .fa, .menu-button .fa {\n" +
"  font-size: 0;\n" +
"  visibility: hidden;\n" +
"}\n" +
":root.shortcut-icons .shortcut.brackets-wrap::after,\n" +
":root.shortcut-icons .shortcut.brackets-wrap::before {\n" +
"  display: none;\n" +
"}\n" +
":root.shortcut-icons #shortcuts a .fa,\n" +
".menu-button .fa,\n" +
".hide-reply-button .fa,\n" +
".hide-thread-button .fa {\n" +
"  display: inline;\n" +
"}\n" +
".fa-spin::before {\n" +
"  -webkit-animation:spin 2s infinite linear;\n" +
"  -moz-animation:spin 2s infinite linear;\n" +
"  -o-animation:spin 2s infinite linear;\n" +
"  animation:spin 2s infinite linear;\n" +
"}\n" +
"@-moz-keyframes spin {\n" +
"  0% {-moz-transform:rotate(0deg);}\n" +
"  100% {-moz-transform:rotate(359deg);}\n" +
"}\n" +
"@-webkit-keyframes spin {\n" +
"  0% {-webkit-transform:rotate(0deg);}\n" +
"  100% {-webkit-transform:rotate(359deg);}\n" +
"}\n" +
"@keyframes spin {\n" +
"  0% {transform:rotate(0deg);}\n" +
"  100% {transform:rotate(359deg);}\n" +
"}\n" +
"/* General */\n" +
".dialog {\n" +
"  border: 1px solid;\n" +
"  display: block;\n" +
"  background-color: inherit;\n" +
"}\n" +
".dialog:not(#qr):not(#thread-watcher):not(#header-bar) {\n" +
"  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);\n" +
"}\n" +
"#qr,\n" +
"#thread-watcher {\n" +
"  box-shadow: -1px 2px 2px rgba(0, 0, 0, 0.25);\n" +
"}\n" +
".captcha-img,\n" +
".field {\n" +
"  background-color: #FFF;\n" +
"  border: 1px solid #CCC;\n" +
"  -moz-box-sizing: border-box;\n" +
"  box-sizing: border-box;\n" +
"  color: #333;\n" +
"  font: 13px sans-serif;\n" +
"  outline: none;\n" +
"  transition: color .25s, border-color .25s;\n" +
"  transition: color .25s, border-color .25s;\n" +
"}\n" +
".field::-moz-placeholder,\n" +
".field:hover::-moz-placeholder {\n" +
"  color: #AAA !important;\n" +
"  font-size: 13px !important;\n" +
"  opacity: 1.0 !important;\n" +
"}\n" +
".captch-img:hover,\n" +
".field:hover {\n" +
"  border-color: #999;\n" +
"}\n" +
".field:hover, .field:focus, .field.focus {\n" +
"  color: #000;\n" +
"}\n" +
".field[disabled] {\n" +
"  background-color: #F2F2F2;\n" +
"  color: #888;\n" +
"}\n" +
".field::-webkit-search-decoration {\n" +
"  display: none;\n" +
"}\n" +
".move {\n" +
"  cursor: move;\n" +
"  overflow: hidden;\n" +
"}\n" +
"label {\n" +
"  cursor: pointer;\n" +
"}\n" +
"a[href=\"javascript:;\"] {\n" +
"  text-decoration: none;\n" +
"}\n" +
".warning {\n" +
"  color: red;\n" +
"}\n" +
"#boardNavDesktop, #boardNavMobile {\n" +
"  display: none !important;\n" +
"}\n" +
":root.hide-bottom-board-list #boardNavDesktopFoot {\n" +
"  display: none;\n" +
"}\n" +
"body.hasDropDownNav{\n" +
"  margin-top: 5px;\n" +
"}\n" +
":root:not(.keyboard-focus) a {\n" +
"  outline: none;\n" +
"}\n" +
".painted {\n" +
"  border-radius: 3px;\n" +
"  padding: 0px 2px;\n" +
"}\n" +
"/* 4chan style fixes */\n" +
".opContainer, .op {\n" +
"  display: block !important;\n" +
"  overflow: visible !important;\n" +
"}\n" +
".reply > .file > .fileText {\n" +
"  margin: 0 20px;\n" +
"}\n" +
".hashlink::before {\n" +
"  content: ' ';\n" +
"  visibility: hidden;\n" +
"}\n" +
".inline + .hashlink,\n" +
"[hidden] {\n" +
"  display: none !important;\n" +
"}\n" +
".fileText a {\n" +
"  unicode-bidi: -moz-isolate;\n" +
"  unicode-bidi: -webkit-isolate;\n" +
"}\n" +
"#g-recaptcha {\n" +
"  min-height: 78px;\n" +
"  height: auto;\n" +
"}\n" +
":root:not(.js-enabled) #postForm {\n" +
"  display: table;\n" +
"}\n" +
"#captchaContainerAlt td:nth-child(2) {\n" +
"  display: table-cell !important;\n" +
"}\n" +
"canvas#tegaki-canvas {\n" +
"  background: none;\n" +
"}\n" +
"/* Disable obnoxious captcha fade-in. */\n" +
"body > div:last-of-type {\n" +
"  transition: none !important;\n" +
"}\n" +
"/* Fix captcha scrolling to top of page. */\n" +
"body > div[style*=\" top: -10000px;\"] {\n" +
"  visibility: hidden !important;\n" +
"}\n" +
":root.blink {\n" +
"  -webkit-animation: none;\n" +
"  animation: none;\n" +
"}\n" +
"/* Ads */\n" +
":root:not(.ads-loaded) .ad-cnt,\n" +
":root:not(.ads-loaded) .ad-plea,\n" +
":root:not(.ads-loaded) hr.abovePostForm,\n" +
":root:not(.ads-loaded) .ad-plea-bottom + hr {\n" +
"  display: none;\n" +
"}\n" +
"hr + div.center:not(.ad-cnt):not(.topad):not(.middlead):not(.bottomad) {\n" +
"  display: none !important;\n" +
"}\n" +
"/* Anti-autoplay */\n" +
"audio.controls-added {\n" +
"  display: block;\n" +
"  margin: auto;\n" +
"}\n" +
":root.anti-autoplay div.embed {\n" +
"  position: static;\n" +
"  width: auto;\n" +
"  height: auto;\n" +
"  text-align: center;\n" +
"}\n" +
":root.anti-autoplay .autoplay-removed {\n" +
"  display: block !important;\n" +
"  visibility: visible !important;\n" +
"  min-width: 640px;\n" +
"  min-height: 390px;\n" +
"}\n" +
"/* fixed, z-index */\n" +
"#overlay,\n" +
"#fourchanx-settings,\n" +
"#qp, #ihover,\n" +
"#navlinks, .fixed #header-bar,\n" +
":root.float #updater,\n" +
":root.float #thread-stats,\n" +
"#qr {\n" +
"  position: fixed;\n" +
"}\n" +
"#fourchanx-settings {\n" +
"  z-index: 999;\n" +
"}\n" +
"#overlay {\n" +
"  z-index: 900;\n" +
"}\n" +
"#qp, #ihover {\n" +
"  z-index: 60;\n" +
"}\n" +
"#menu, .gal-buttons {\n" +
"  z-index: 50;\n" +
"}\n" +
"#updater, #thread-stats {\n" +
"  z-index: 40;\n" +
"}\n" +
":root.fixed #header-bar, #notifications {\n" +
"  z-index: 35;\n" +
"}\n" +
"#a-gallery {\n" +
"  z-index: 30;\n" +
"}\n" +
"#navlinks {\n" +
"  z-index: 25;\n" +
"}\n" +
"#qr {\n" +
"  z-index: 20;\n" +
"}\n" +
"#embedding {\n" +
"  z-index: 11;\n" +
"}\n" +
":root.fixed-watcher #thread-watcher {\n" +
"  z-index: 10;\n" +
"}\n" +
":root.fixed:not(.gallery-open) #header-bar:not(:hover) {\n" +
"  z-index: 8;\n" +
"}\n" +
"#thread-watcher {\n" +
"  z-index: 5;\n" +
"}\n" +
"/* Header */\n" +
".fixed.top-header body {\n" +
"  padding-top: 2em;\n" +
"}\n" +
".fixed.bottom-header body {\n" +
"  padding-bottom: 2em;\n" +
"}\n" +
".fixed #header-bar {\n" +
"  right: 0;\n" +
"  left: 0;\n" +
"  padding: 3px 4px 4px;\n" +
"  font-size: 12px;\n" +
"}\n" +
".fixed.top-header #header-bar {\n" +
"  top: 0;\n" +
"}\n" +
".fixed.bottom-header #header-bar {\n" +
"  bottom: 0;\n" +
"}\n" +
"#header-bar {\n" +
"  border-width: 0;\n" +
"  transition: all .1s .05s ease-in-out;\n" +
"}\n" +
":root.fixed #header-bar {\n" +
"  box-shadow: -5px 1px 10px rgba(0, 0, 0, 0.20);\n" +
"}\n" +
":root.centered-links #shortcuts {\n" +
"  width: 300px;\n" +
"  text-align: right;\n" +
"}\n" +
":root.centered-links #header-bar {\n" +
"  text-align: center;\n" +
"}\n" +
"#custom-board-list {\n" +
"  font-size: 13px;\n" +
"  vertical-align: middle;\n" +
"}\n" +
"#full-board-list {\n" +
"  vertical-align: middle;\n" +
"}\n" +
":root.centered-links #custom-board-list {\n" +
"  position: relative;\n" +
"  left: 150px;\n" +
"}\n" +
".fixed.top-header #header-bar {\n" +
"  border-bottom-width: 1px;\n" +
"}\n" +
".fixed.bottom-header #header-bar {\n" +
"  box-shadow: 0 -1px 2px rgba(0, 0, 0, .15);\n" +
"  border-top-width: 1px;\n" +
"}\n" +
".fixed.bottom-header #header-bar .menu-button i {\n" +
"  border-top: none;\n" +
"  border-bottom: 6px solid;\n" +
"}\n" +
".fixed #header-bar.autohide:not(:hover) {\n" +
"  box-shadow: none;\n" +
"  transition: all .8s .6s cubic-bezier(.55, .055, .675, .19);\n" +
"}\n" +
".fixed.top-header #header-bar.autohide:not(:hover) {\n" +
"  margin-bottom: -1em;\n" +
"  -webkit-transform: translateY(-100%);\n" +
"  transform: translateY(-100%);\n" +
"}\n" +
".fixed.bottom-header #header-bar.autohide:not(:hover) {\n" +
"  -webkit-transform: translateY(100%);\n" +
"  transform: translateY(100%);\n" +
"}\n" +
"#scroll-marker {\n" +
"  left: 0;\n" +
"  right: 0;\n" +
"  height: 10px;\n" +
"  position: absolute;\n" +
"}\n" +
"#header-bar:not(.autohide) #scroll-marker {\n" +
"  pointer-events: none;\n" +
"}\n" +
"#header-bar #scroll-marker {\n" +
"  display: none;\n" +
"}\n" +
".fixed #header-bar #scroll-marker {\n" +
"  display: block;\n" +
"}\n" +
".fixed.top-header #header-bar #scroll-marker {\n" +
"  top: 100%;\n" +
"}\n" +
".fixed.bottom-header #header-bar #scroll-marker {\n" +
"  bottom: 100%;\n" +
"}\n" +
"#board-list a, #shortcuts a:not(.entry) {\n" +
"  text-decoration: none;\n" +
"  padding: 1px;\n" +
"}\n" +
"#shortcuts:empty {\n" +
"  display: none;\n" +
"}\n" +
".brackets-wrap::before {\n" +
"  content: \"\\00a0[\";\n" +
"}\n" +
".brackets-wrap::after {\n" +
"  content: \"]\\00a0\";\n" +
"}\n" +
".dead-thread,\n" +
".disabled:not(.replies-quoting-you) {\n" +
"  opacity: .45;\n" +
"}\n" +
"#shortcuts {\n" +
"  float: right;\n" +
"}\n" +
":root.autohiding-scrollbar #shortcuts {\n" +
"  margin-right: 12px;\n" +
"}\n" +
".shortcut {\n" +
"  margin-left: 3px;\n" +
"  vertical-align: middle;\n" +
"}\n" +
":root.shortcut-icons .native-settings {\n" +
"  font-size: 0;\n" +
"  color: transparent;\n" +
"  display: inline-block;\n" +
"  vertical-align: top;\n" +
"  height: 12px;\n" +
"  width: 14px;\n" +
"  background: url('//s.4cdn.org/image/favicon.ico') 0px -1px no-repeat;\n" +
"}\n" +
"#navbotright,\n" +
"#navtopright {\n" +
"  display: none;\n" +
"}\n" +
"#toggleMsgBtn {\n" +
"  display: none !important;\n" +
"}\n" +
".current {\n" +
"  font-weight: bold;\n" +
"}\n" +
"@media (min-width: 1300px) {\n" +
"  :root.fixed:not(.centered-links) #header-bar {\n" +
"    white-space: nowrap;\n" +
"    display: -webkit-flex;\n" +
"    display: flex;\n" +
"    -webkit-align-items: center;\n" +
"    align-items: center;\n" +
"  }\n" +
"  :root.fixed:not(.centered-links) #board-list {\n" +
"    -webkit-flex: auto;\n" +
"    flex: auto;\n" +
"  }\n" +
"  :root.fixed:not(.centered-links) #full-board-list {\n" +
"    display: -webkit-flex;\n" +
"    display: flex;\n" +
"  }\n" +
"  :root.fixed:not(.centered-links) .hide-board-list-container {\n" +
"    -webkit-flex: none;\n" +
"    flex: none;\n" +
"    margin-right: 5px;\n" +
"  }\n" +
"  :root.fixed:not(.centered-links) #full-board-list > .boardList {\n" +
"    -webkit-flex: auto;\n" +
"    flex: auto;\n" +
"    display: -webkit-flex;\n" +
"    display: flex;\n" +
"    width: 0px; /* XXX Fixes Edge not shrinking the board list below default size when needed */\n" +
"  }\n" +
"  :root.fixed:not(.centered-links) #full-board-list > .boardList > a,\n" +
"  :root.fixed:not(.centered-links) #full-board-list > .boardList > span:not(.space):not(.spacer) {\n" +
"    -webkit-flex: none;\n" +
"    flex: none;\n" +
"    padding: .17em;\n" +
"    margin: -.17em -.32em;\n" +
"  }\n" +
"  :root.fixed:not(.centered-links) #full-board-list > .boardList > span {\n" +
"    pointer-events: none;\n" +
"  }\n" +
"  :root.fixed:not(.centered-links) #full-board-list > .boardList > span.space {\n" +
"    -webkit-flex: 0 .63 .63em;\n" +
"    flex: 0 .63 .63em;\n" +
"  }\n" +
"  :root.fixed:not(.centered-links) #full-board-list > .boardList > span.spacer {\n" +
"    -webkit-flex: 0 .38 .38em;\n" +
"    flex: 0 .38 .38em;\n" +
"  }\n" +
"  :root.fixed:not(.centered-links) #shortcuts {\n" +
"    float: initial;\n" +
"    -webkit-flex: none;\n" +
"    flex: none;\n" +
"    display: -webkit-flex;\n" +
"    display: flex;\n" +
"    -webkit-align-items: center;\n" +
"    align-items: center;\n" +
"  }\n" +
"}\n" +
"/* 4chan X link brackets */\n" +
".brackets-wrap::before {\n" +
"  content: \"[\";\n" +
"}\n" +
".brackets-wrap::after {\n" +
"  content: \"]\";\n" +
"}\n" +
"/* Notifications */\n" +
"#notifications {\n" +
"  position: fixed;\n" +
"  top: 0;\n" +
"  height: 0;\n" +
"  text-align: center;\n" +
"  right: 0;\n" +
"  left: 0;\n" +
"  visibility: visible;\n" +
"}\n" +
":root.fixed.top-header:not(.gallery-open) #header-bar #notifications,\n" +
":root.fixed.top-header #header-bar.autohide #notifications {\n" +
"  position: absolute;\n" +
"  top: 100%;\n" +
"}\n" +
".notification {\n" +
"  color: #FFF;\n" +
"  font-weight: 700;\n" +
"  text-shadow: 0 1px 2px rgba(0, 0, 0, .5);\n" +
"  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);\n" +
"  border-radius: 2px;\n" +
"  margin: 1px auto;\n" +
"  width: 500px;\n" +
"  max-width: 100%;\n" +
"  position: relative;\n" +
"  transition: all .25s ease-in-out;\n" +
"}\n" +
".notification.error {\n" +
"  background-color: hsla(0, 100%, 38%, .9);\n" +
"}\n" +
".notification.warning {\n" +
"  background-color: hsla(36, 100%, 38%, .9);\n" +
"}\n" +
".notification.info {\n" +
"  background-color: hsla(200, 100%, 38%, .9);\n" +
"}\n" +
".notification.success {\n" +
"  background-color: hsla(104, 100%, 38%, .9);\n" +
"}\n" +
".notification a {\n" +
"  color: white;\n" +
"}\n" +
".notification > .close {\n" +
"  padding: 7px;\n" +
"  top: 0px;\n" +
"  right: 5px;\n" +
"  position: absolute;\n" +
"}\n" +
".notification > .fa-times::before {\n" +
"  font-size: 11px !important;\n" +
"}\n" +
".message {\n" +
"  -moz-box-sizing: border-box;\n" +
"  box-sizing: border-box;\n" +
"  padding: 6px 20px;\n" +
"  max-height: 200px;\n" +
"  width: 100%;\n" +
"  overflow: auto;\n" +
"  white-space: pre-line;\n" +
"}\n" +
".message a {\n" +
"  text-decoration: underline;\n" +
"}\n" +
":root.tainted .report-error {\n" +
"  display: none;\n" +
"}\n" +
"/* Settings */\n" +
":root.fourchan-x body {\n" +
"  -moz-box-sizing: border-box;\n" +
"  box-sizing: border-box;\n" +
"}\n" +
"#overlay {\n" +
"  background-color: rgba(0, 0, 0, .5);\n" +
"  top: 0;\n" +
"  left: 0;\n" +
"  height: 100%;\n" +
"  width: 100%;\n" +
"}\n" +
"#fourchanx-settings {\n" +
"  -moz-box-sizing: border-box;\n" +
"  box-sizing: border-box;\n" +
"  box-shadow: 0 0 15px rgba(0, 0, 0, .15);\n" +
"  height: 600px;\n" +
"  max-height: 100%;\n" +
"  width: 900px;\n" +
"  max-width: 100%;\n" +
"  margin: auto;\n" +
"  padding: 3px;\n" +
"  top: 50%;\n" +
"  left: 50%;\n" +
"  -moz-transform: translate(-50%, -50%);\n" +
"  -webkit-transform: translate(-50%, -50%);\n" +
"  transform: translate(-50%, -50%);\n" +
"}\n" +
"#fourchanx-settings > nav {\n" +
"  padding: 2px 2px 0;\n" +
"  height: 15px;\n" +
"}\n" +
"#fourchanx-settings > nav a {\n" +
"  text-decoration: underline;\n" +
"}\n" +
"#fourchanx-settings > nav a.close {\n" +
"  text-decoration: none;\n" +
"  padding: 0 2px;\n" +
"  margin: 0;\n" +
"}\n" +
".section-container {\n" +
"  overflow: auto;\n" +
"  position: absolute;\n" +
"  top: 2.1em;\n" +
"  right: 5px;\n" +
"  bottom: 5px;\n" +
"  left: 5px;\n" +
"  padding-right: 5px;\n" +
"}\n" +
".sections-list {\n" +
"  padding: 0 3px;\n" +
"  float: left;\n" +
"}\n" +
".credits {\n" +
"  float: right;\n" +
"}\n" +
".export, .import, .reset {\n" +
"  cursor: pointer;\n" +
"  text-decoration: none !important;\n" +
"}\n" +
".tab-selected {\n" +
"  font-weight: 700;\n" +
"}\n" +
".section-sauce ul,\n" +
".section-advanced ul {\n" +
"  list-style: none;\n" +
"  margin: 0;\n" +
"}\n" +
".section-sauce ul {\n" +
"  padding: 8px;\n" +
"}\n" +
".section-advanced ul {\n" +
"  padding: 0px;\n" +
"}\n" +
".section-sauce li,\n" +
".section-advanced li {\n" +
"  padding-left: 4px;\n" +
"}\n" +
".section-main ul {\n" +
"  margin: 0;\n" +
"  padding: 0 0 0 16px;\n" +
"}\n" +
".section-main li {\n" +
"  white-space: pre-line;\n" +
"  list-style: disc;\n" +
"}\n" +
".section-main li:not(:first-of-type) {\n" +
"  margin-top: 4px;\n" +
"}\n" +
".section-main label {\n" +
"  text-decoration: underline;\n" +
"}\n" +
"div[data-checked=\"false\"] > .suboption-list {\n" +
"  display: none;\n" +
"}\n" +
".suboption-list {\n" +
"  position: relative;\n" +
"}\n" +
".suboption-list::before {\n" +
"  content: \"\";\n" +
"  display: inline-block;\n" +
"  position: absolute;\n" +
"  left: .7em;\n" +
"  width: 0;\n" +
"  height: 100%;\n" +
"  border-left: 1px solid;\n" +
"}\n" +
".suboption-list > div {\n" +
"  position: relative;\n" +
"  padding-left: 1.4em;\n" +
"}\n" +
".suboption-list > div::before {\n" +
"  content: \"\";\n" +
"  display: inline-block;\n" +
"  position: absolute;\n" +
"  left: .7em;\n" +
"  width: .7em;\n" +
"  height: .6em;\n" +
"  border-left: 1px solid;\n" +
"  border-bottom: 1px solid;\n" +
"}\n" +
".section-filter ul {\n" +
"  padding: 0;\n" +
"}\n" +
".section-filter li {\n" +
"  margin: 10px 40px;\n" +
"  list-style: disc;\n" +
"}\n" +
".section-filter textarea {\n" +
"  height: 500px;\n" +
"}\n" +
".section-main a, .section-filter a, .section-advanced a {\n" +
"  text-decoration: underline;\n" +
"}\n" +
".section-sauce textarea {\n" +
"  height: 350px;\n" +
"}\n" +
".section-advanced .field[name=\"boardnav\"] {\n" +
"  width: 100%;\n" +
"}\n" +
".section-advanced textarea {\n" +
"  height: 150px;\n" +
"}\n" +
".section-advanced textarea[name=\"archiveLists\"] {\n" +
"  height: 75px;\n" +
"}\n" +
".section-advanced .archive-cell {\n" +
"  min-width: 160px;\n" +
"  text-align: center;\n" +
"}\n" +
".section-advanced #archive-board-select {\n" +
"  position: absolute;\n" +
"}\n" +
".section-advanced .note {\n" +
"  font-size: 0.8em;\n" +
"  font-style: italic;\n" +
"  margin-left: 10px;\n" +
"}\n" +
".section-advanced .note code {\n" +
"  font-style: normal;\n" +
"  font-size: 11px;\n" +
"}\n" +
".section-keybinds .field {\n" +
"  font-family: monospace;\n" +
"}\n" +
"#fourchanx-settings fieldset {\n" +
"  border: 1px solid;\n" +
"  border-radius: 3px;\n" +
"  padding: 0.35em 0.625em 0.75em;\n" +
"  margin: 0px 2px;\n" +
"}\n" +
"#fourchanx-settings legend {\n" +
"  font-weight: 700;\n" +
"  color: inherit;\n" +
"}\n" +
"#fourchanx-settings textarea {\n" +
"  font-family: monospace;\n" +
"  min-width: 100%;\n" +
"  max-width: 100%;\n" +
"}\n" +
"#fourchanx-settings code {\n" +
"  color: #000;\n" +
"  background-color: #FFF;\n" +
"  padding: 0 2px;\n" +
"}\n" +
"#fourchanx-settings th {\n" +
"  text-align: center;\n" +
"  font-weight: bold;\n" +
"}\n" +
"#fourchanx-settings p {\n" +
"  margin: 1em 0px;\n" +
"}\n" +
".unscroll {\n" +
"  overflow: hidden;\n" +
"}\n" +
"/* Index */\n" +
":root.index-loading .navLinks:not(.json-index),\n" +
":root.index-loading .board:not(.json-index),\n" +
":root.index-loading .pagelist:not(.json-index),\n" +
":root.infinite-mode .pagelist,\n" +
":root.all-pages-mode .pagelist,\n" +
":root.catalog-mode .pagelist,\n" +
":root:not(.catalog-mode) .indexlink,\n" +
":root.catalog-mode .cataloglink,\n" +
":root:not(.catalog-mode) #hidden-label,\n" +
":root:not(.catalog-mode) #index-size {\n" +
"  display: none;\n" +
"}\n" +
"#index-search {\n" +
"  padding-right: 1.5em;\n" +
"  width: 100px;\n" +
"  transition: color .25s, border-color .25s, width .25s;\n" +
"}\n" +
"#index-search:focus,\n" +
"#index-search[data-searching] {\n" +
"  width: 200px;\n" +
"}\n" +
"#index-search-clear {\n" +
"  color: gray;\n" +
"  display: inline-block;\n" +
"  position: relative;\n" +
"  left: -1em;\n" +
"  width: 0;\n" +
"}\n" +
"/* \`\`::-webkit-*'' selectors break selector lists on Firefox. */\n" +
"#index-search::-webkit-search-cancel-button {\n" +
"  display: none;\n" +
"}\n" +
"#index-search:not([data-searching]) + #index-search-clear {\n" +
"  display: none;\n" +
"}\n" +
"#index-mode, #index-sort, #index-size {\n" +
"  float: right;\n" +
"}\n" +
".summary {\n" +
"  text-decoration: none;\n" +
"}\n" +
"/* Catalog */\n" +
":root.catalog-mode .board {\n" +
"  text-align: center;\n" +
"}\n" +
".catalog-thread {\n" +
"  display: -webkit-inline-flex;\n" +
"  display: inline-flex;\n" +
"  text-align: left;\n" +
"  -webkit-flex-direction: column;\n" +
"  flex-direction: column;\n" +
"  -webkit-align-items: center;\n" +
"  align-items: center;\n" +
"  margin: 0 2px 5px;\n" +
"  word-wrap: break-word;\n" +
"  vertical-align: top;\n" +
"  position: relative;\n" +
"}\n" +
".catalog-thread > a {\n" +
"  flex-shrink: 0;\n" +
"  -webkit-flex-shrink: 0;\n" +
"  position: relative;\n" +
"}\n" +
".catalog-small .catalog-thread {\n" +
"  width: 165px;\n" +
"  max-height: 320px;\n" +
"}\n" +
".catalog-large .catalog-thread {\n" +
"  width: 270px;\n" +
"  max-height: 410px;\n" +
"}\n" +
".catalog-thumb {\n" +
"  border-radius: 2px;\n" +
"  box-shadow: 0 0 5px rgba(0, 0, 0, .25);\n" +
"}\n" +
".catalog-thumb.spoiler-file {\n" +
"  width: 100px;\n" +
"  height: 100px;\n" +
"}\n" +
".catalog-thumb.deleted-file {\n" +
"  width: 127px;\n" +
"  height: 13px;\n" +
"  padding: 20px 11px;\n" +
"}\n" +
".catalog-thumb.no-file {\n" +
"  width: 77px;\n" +
"  height: 13px;\n" +
"  padding: 20px 36px;\n" +
"}\n" +
".catalog-icons > img,\n" +
".catalog-stats > .menu-button {\n" +
"  width: 1em;\n" +
"  height: 1em;\n" +
"  margin: 0;\n" +
"  vertical-align: text-top;\n" +
"  padding-left: 2px;\n" +
"}\n" +
".catalog-stats > .menu-button {\n" +
"  text-align: center;\n" +
"  font-weight: normal;\n" +
"}\n" +
".catalog-stats > .menu-button > i::before {\n" +
"  line-height: 11px;\n" +
"}\n" +
".catalog-stats {\n" +
"  -webkit-flex-shrink: 0;\n" +
"  flex-shrink: 0;\n" +
"  cursor: help;\n" +
"  font-size: 10px;\n" +
"  font-weight: 700;\n" +
"  margin-top: 2px;\n" +
"}\n" +
".catalog-thread > .subject {\n" +
"  -webkit-flex-shrink: 0;\n" +
"  flex-shrink: 0;\n" +
"  -webkit-align-self: stretch;\n" +
"  align-self: stretch;\n" +
"  font-weight: 700;\n" +
"  line-height: 1;\n" +
"  text-align: center;\n" +
"}\n" +
".catalog-thread > .comment {\n" +
"  -webkit-flex-shrink: 1;\n" +
"  flex-shrink: 1;\n" +
"  -webkit-align-self: stretch;\n" +
"  align-self: stretch;\n" +
"  overflow: hidden;\n" +
"  text-align: center;\n" +
"}\n" +
"/* /tg/ dice rolls */\n" +
".board_tg .catalog-thread > .comment > b {\n" +
"  font-weight: normal;\n" +
"}\n" +
".catalog-code {\n" +
"  background-color: #FFF;\n" +
"  display: inline-block;\n" +
"  max-width: 100%;\n" +
"}\n" +
":root.hats-enabled .catalog-thread::after {\n" +
"  content: '';\n" +
"  pointer-events: none;\n" +
"  position: absolute;\n" +
"  background-size: contain;\n" +
"}\n" +
":root.hats-enabled .catalog-small .catalog-thread::after {\n" +
"  left: -10px;\n" +
"  top: -65px;\n" +
"  width: 100px;\n" +
"  height: 100px;\n" +
"}\n" +
":root.hats-enabled .catalog-large .catalog-thread::after {\n" +
"  left: -15px;\n" +
"  top: -105px;\n" +
"  width: 160px;\n" +
"  height: 160px;\n" +
"}\n" +
"/* Announcement Hiding */\n" +
":root.hide-announcement #globalMessage {\n" +
"  display: none;\n" +
"}\n" +
"span.hide-announcement {\n" +
"  font-size: 11px;\n" +
"  position: relative;\n" +
"  bottom: 5px;\n" +
"}\n" +
".globalMessage, h2, h3 {\n" +
"  color: inherit !important;\n" +
"  font-size: 13px;\n" +
"  font-weight: 100;\n" +
"}\n" +
"/* Unread */\n" +
"#unread-line {\n" +
"  margin: 0;\n" +
"  border-color: rgb(255,0,0);\n" +
"}\n" +
"/* Thread Updater */\n" +
"#updater {\n" +
"  background: none;\n" +
"  border: none;\n" +
"  box-shadow: none;\n" +
"}\n" +
"#updater > .move {\n" +
"  position: absolute;\n" +
"  left: 0;\n" +
"  top: -5px;\n" +
"  width: 100%;\n" +
"  height: 5px;\n" +
"}\n" +
"#updater > div:last-child {\n" +
"  text-align: center;\n" +
"}\n" +
"#updater input[type=\"number\"] {\n" +
"  width: 4em;\n" +
"}\n" +
":root.float #updater {\n" +
"  padding: 0px 3px;\n" +
"}\n" +
":root:not(.float).shortcut-icons #updater {\n" +
"  display: inline-block;\n" +
"  min-width: 12pt;\n" +
"  text-align: right;\n" +
"}\n" +
".new {\n" +
"  color: limegreen;\n" +
"}\n" +
"#update-status:not(.empty) + #update-timer:not(.empty):not(.loading) {\n" +
"  margin-left: 5px;\n" +
"}\n" +
"#update-timer {\n" +
"  cursor: pointer;\n" +
"}\n" +
"/* Thread Watcher */\n" +
"#thread-watcher {\n" +
"  position: absolute;\n" +
"}\n" +
"#thread-watcher {\n" +
"  padding-bottom: 3px;\n" +
"  padding-left: 3px;\n" +
"  white-space: nowrap;\n" +
"  min-width: 146px;\n" +
"}\n" +
"#watched-threads {\n" +
"  overflow-x: hidden;\n" +
"  overflow-y: auto;\n" +
"}\n" +
"#thread-watcher .refresh {\n" +
"  padding: 0px 3px;\n" +
"}\n" +
":root.fixed-watcher #thread-watcher {\n" +
"  position: fixed;\n" +
"}\n" +
":root.fixed-watcher #watched-threads {\n" +
"  /* XXX https://code.google.com/p/chromium/issues/detail?id=168840, https://bugs.webkit.org/show_bug.cgi?id=94158 */\n" +
"  max-height: 85vh;\n" +
"  max-height: calc(100vh - 75px);\n" +
"}\n" +
":root:not(.fixed-watcher) #watched-threads:not(:hover) {\n" +
"  max-height: 210px;\n" +
"  overflow-y: hidden;\n" +
"}\n" +
"#thread-watcher > .move {\n" +
"  padding-top: 3px;\n" +
"}\n" +
"#watched-threads > div {\n" +
"  padding-left: 3px;\n" +
"  padding-right: 3px;\n" +
"}\n" +
"#watched-threads .watcher-link {\n" +
"  max-width: 250px;\n" +
"  display: -webkit-inline-flex;\n" +
"  display: inline-flex;\n" +
"  -webkit-flex-direction: row;\n" +
"  flex-direction: row;\n" +
"}\n" +
"#watched-threads .watcher-unread {\n" +
"  -webkit-flex: 0 0 auto;\n" +
"  flex: 0 0 auto;\n" +
"}\n" +
"#watched-threads .watcher-unread::after {\n" +
"  content: \"\\00a0\";\n" +
"}\n" +
"#watched-threads .watcher-title {\n" +
"  overflow: hidden;\n" +
"  text-overflow: ellipsis;\n" +
"  -webkit-flex: 0 1 auto;\n" +
"  flex: 0 1 auto;\n" +
"}\n" +
"#thread-watcher a {\n" +
"  text-decoration: none;\n" +
"}\n" +
":root:not(.toggleable-watcher) #thread-watcher .move > .close {\n" +
"  display: none;\n" +
"}\n" +
"#thread-watcher .move > .close {\n" +
"  position: absolute;\n" +
"  right: 0px;\n" +
"  top: 0px;\n" +
"  padding: 0px 4px;\n" +
"}\n" +
".watch-thread-link {\n" +
"  padding-top: 18px;\n" +
"  width: 18px;\n" +
"  height: 0px;\n" +
"  display: inline-block;\n" +
"  background-repeat: no-repeat;\n" +
"  opacity: 0.2;\n" +
"  position: relative;\n" +
"  top: 1px;\n" +
"  background-image: url(\"data:image/svg+xml,<svg viewBox='0 0 26 26' preserveAspectRatio='true' xmlns='http://www.w3.org/2000/svg'><path fill='rgb(0,0,0)' d='M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z'/></svg>\");\n" +
"}\n" +
".watch-thread-link.watched {\n" +
"  opacity: 1;\n" +
"}\n" +
"/* Thread Stats */\n" +
"#thread-stats {\n" +
"  background: none;\n" +
"  border: none;\n" +
"  box-shadow: none;\n" +
"}\n" +
":root.float #thread-stats > .move > :not(#page-count) {\n" +
"  pointer-events: none;\n" +
"}\n" +
":root.float #thread-stats {\n" +
"  padding: 0px 3px;\n" +
"}\n" +
"#page-count {\n" +
"  cursor: pointer;\n" +
"}\n" +
"/* Quote */\n" +
".catalog-thread > .comment > span.quote, #arc-list span.quote {\n" +
"  color: #789922;\n" +
"}\n" +
":root:not(.catalog-mode) .deadlink {\n" +
"  text-decoration: none !important;\n" +
"}\n" +
".backlink.deadlink:not(.forwardlink),\n" +
".quotelink.deadlink:not(.forwardlink) {\n" +
"  text-decoration: underline !important;\n" +
"}\n" +
".inlined {\n" +
"  opacity: .5;\n" +
"}\n" +
"#qp input, .forwarded {\n" +
"  display: none;\n" +
"}\n" +
".quotelink.forwardlink,\n" +
".backlink.forwardlink {\n" +
"  text-decoration: none;\n" +
"  border-bottom: 1px dashed;\n" +
"}\n" +
".filtered {\n" +
"  text-decoration: underline line-through;\n" +
"}\n" +
":root.hide-backlinks .backlink.filtered,\n" +
":root.hide-backlinks .backlink.filtered + .hashlink.filtered {\n" +
"  display: none;\n" +
"}\n" +
".postNum + .container::before {\n" +
"  content: \" \";\n" +
"}\n" +
".inline {\n" +
"  border: 1px solid;\n" +
"  display: table;\n" +
"  margin: 2px 0;\n" +
"}\n" +
".inline .post {\n" +
"  border: 0 !important;\n" +
"  background-color: transparent !important;\n" +
"  display: table !important;\n" +
"  margin: 0 !important;\n" +
"  padding: 1px 2px !important;\n" +
"}\n" +
"#qp > .opContainer::after {\n" +
"  content: '';\n" +
"  clear: both;\n" +
"  display: table;\n" +
"}\n" +
"#qp .post {\n" +
"  border: none;\n" +
"  margin: 0;\n" +
"  padding: 2px 2px 5px;\n" +
"}\n" +
"#qp img {\n" +
"  max-height: 80vh;\n" +
"  max-width: 50vw;\n" +
"}\n" +
"/* Quote Threading */\n" +
".threadContainer {\n" +
"  margin-left: 20px;\n" +
"  border-left: 1px solid rgba(128,128,128,.3);\n" +
"}\n" +
".threadOP {\n" +
"  clear: both;\n" +
"}\n" +
"/* File */\n" +
".fileText-original,\n" +
".fnswitch:hover > .fntrunc,\n" +
".fnswitch:not(:hover) > .fnfull,\n" +
".expanded-image > .post > .file > .fileThumb > video[data-md5],\n" +
".expanded-image > .post > .file > .fileThumb > img[data-md5] {\n" +
"  display: none;\n" +
"}\n" +
".full-image {\n" +
"  display: none;\n" +
"  cursor: pointer;\n" +
"}\n" +
".expanded-image > .post > .file > .fileThumb > .full-image {\n" +
"  display: inline;\n" +
"}\n" +
".expanded-image {\n" +
"  clear: left;\n" +
"}\n" +
".expanding {\n" +
"  opacity: .5;\n" +
"}\n" +
":root.fit-height .full-image {\n" +
"  max-height: 100vh;\n" +
"}\n" +
":root.fit-height.fixed .full-image {\n" +
"  /* XXX https://code.google.com/p/chromium/issues/detail?id=168840, https://bugs.webkit.org/show_bug.cgi?id=94158 */\n" +
"  max-height: 93vh;\n" +
"  max-height: calc(100vh - 35px);\n" +
"}\n" +
":root.fit-width .full-image {\n" +
"  max-width: 100%;\n" +
"}\n" +
":root.gecko.fit-width .full-image {\n" +
"  width: 100%;\n" +
"}\n" +
".fileThumb > .warning {\n" +
"  clear: both;\n" +
"}\n" +
"/* WEBM Metadata */\n" +
".webm-title > a::before {\n" +
"  content: \"title\";\n" +
"  text-decoration: underline;\n" +
"}\n" +
".webm-title.loading > a::after {\n" +
"  content: \"...\";\n" +
"}\n" +
".webm-title.error > a:hover::before,\n" +
".webm-title.error > a:focus::before {\n" +
"  content: \"error\";\n" +
"  text-decoration: none;\n" +
"}\n" +
".webm-title > span {\n" +
"  cursor: text;\n" +
"}\n" +
".webm-title.not-found > span::before {\n" +
"  content: \"not found\";\n" +
"}\n" +
".webm-title:not(:hover):not(:focus) > span,\n" +
".webm-title:hover > span + a,\n" +
".webm-title:focus > span + a {\n" +
"  display: none;\n" +
"}\n" +
"/* Volume control */\n" +
"input[name=\"Default Volume\"] {\n" +
"  width: 4em;\n" +
"  height: 1ex;\n" +
"  vertical-align: middle;\n" +
"  margin: 0px;\n" +
"}\n" +
"/* Fappe and Werk Tyme */\n" +
":root.fappeTyme .thread > .noFile,\n" +
":root.fappeTyme .threadContainer > .noFile {\n" +
"  display: none;\n" +
"}\n" +
":root.werkTyme .postContainer:not(.noFile) .fileThumb,\n" +
":root.werkTyme .catalog-thumb:not(.deleted-file):not(.no-file),\n" +
":root:not(.werkTyme) .werkTyme-filename {\n" +
"  display: none;\n" +
"}\n" +
".werkTyme-filename {\n" +
"  font-weight: bold;\n" +
"}\n" +
":root.werkTyme .catalog-thread > a {\n" +
"  text-align: center;\n" +
"  -webkit-align-self: stretch;\n" +
"  align-self: stretch;\n" +
"}\n" +
".indicator {\n" +
"  background: rgba(255,0,0,0.8);\n" +
"  font-weight: bold;\n" +
"  display: inline-block;\n" +
"  min-width: 9px;\n" +
"  padding: 0px 2px;\n" +
"  margin: 0 1px;\n" +
"  text-align: center;\n" +
"  color: white;\n" +
"  border-radius: 2px;\n" +
"  cursor: pointer;\n" +
"}\n" +
":root:not(.fappeTyme) #fappe-indicator,\n" +
":root:not(.werkTyme) #werk-indicator {\n" +
"  display: none;\n" +
"}\n" +
"/* Index/Reply Navigation */\n" +
"#navlinks {\n" +
"  font-size: 16px;\n" +
"  top: 25px;\n" +
"  right: 10px;\n" +
"}\n" +
":root.catalog-mode #navlinks {\n" +
"  display: none;\n" +
"}\n" +
"/* Highlighting */\n" +
".qphl {\n" +
"  outline: 2px solid rgba(216, 94, 49, .8);\n" +
"}\n" +
":root.highlight-you .quotesYou.opContainer,\n" +
":root.highlight-you .quotesYou > .reply {\n" +
"  border-left: 3px solid rgba(221, 0, 0, .8);\n" +
"}\n" +
":root.highlight-own .yourPost.opContainer,\n" +
":root.highlight-own .yourPost > .reply {\n" +
"  border-left: 3px dashed rgba(221, 0, 0, .8);\n" +
"}\n" +
".filter-highlight.opContainer,\n" +
".filter-highlight > .reply {\n" +
"  box-shadow: inset 5px 0 rgba(221, 0, 0, .5);\n" +
"}\n" +
":root.highlight-own .yourPost > div.sideArrows,\n" +
":root.highlight-you .quotesYou > div.sideArrows,\n" +
".filter-highlight > div.sideArrows {\n" +
"  color: rgba(221, 0, 0, .8);\n" +
"}\n" +
":root.highlight-own .yourPost.opContainer::after,\n" +
":root.highlight-you .quotesYou.opContainer::after,\n" +
".filter-highlight.opContainer::after {\n" +
"  content: \"\";\n" +
"  display: block;\n" +
"  clear: both;\n" +
"}\n" +
".filter-highlight .catalog-thumb,\n" +
".filter-highlight .werkTyme-filename {\n" +
"  box-shadow: 0 0 3px 3px rgba(255, 0, 0, .5);\n" +
"}\n" +
".catalog-thread.watched .catalog-thumb,\n" +
".catalog-thread.watched .werkTyme-filename {\n" +
"  border: 2px solid rgba(255, 0, 0, .75);\n" +
"}\n" +
"/* Spoiler text */\n" +
":root.reveal-spoilers s,\n" +
":root.reveal-spoilers s > a {\n" +
"  color: white !important;\n" +
"}\n" +
":root.reveal-spoilers .removed-spoiler::before {\n" +
"  content: \"[spoiler]\";\n" +
"}\n" +
":root.reveal-spoilers .removed-spoiler::after {\n" +
"  content: \"[/spoiler]\";\n" +
"}\n" +
"/* Thread & Reply Hiding */\n" +
".hide-thread-button,\n" +
".hide-reply-button {\n" +
"  float: left;\n" +
"  margin-right: 4px;\n" +
"  padding: 2px;\n" +
"}\n" +
".hide-thread-button:not(:hover),\n" +
".hide-reply-button:not(:hover) {\n" +
"  opacity: 0.4;\n" +
"}\n" +
".threadContainer .hide-reply-button {\n" +
"  margin-left: 2px !important;\n" +
"  position: relative;\n" +
"  left: 1px;\n" +
"}\n" +
".hide-thread-button {\n" +
"  margin-top: -1px;\n" +
"}\n" +
".stub ~ * {\n" +
"  display: none !important;\n" +
"}\n" +
".stub input {\n" +
"  display: inline-block;\n" +
"}\n" +
".thread[hidden] + hr {\n" +
"  display: none;\n" +
"}\n" +
":root.reply-hide div.sideArrows {\n" +
"  display: none;\n" +
"}\n" +
"/* QR */\n" +
":root.hide-original-post-form #togglePostFormLink,\n" +
"#qr.autohide:not(.focus):not(:hover):not(:active) > form,\n" +
":root.thread-view #qr:not(.show-new-thread-option) select[data-name=\"thread\"],\n" +
"#file-n-submit:not(.has-file) #qr-filerm {\n" +
"  display: none;\n" +
"}\n" +
":root.hide-original-post-form #postForm {\n" +
"  display: none !important;\n" +
"}\n" +
"#qr select,\n" +
"#qr-filename-container > a,\n" +
".remove,\n" +
".captcha-img {\n" +
"  cursor: pointer;\n" +
"}\n" +
"#qr {\n" +
"  position: fixed;\n" +
"  padding: 1px;\n" +
"  border: 1px solid transparent;\n" +
"  min-width: 300px;\n" +
"  border-radius: 3px 3px 0 0;\n" +
"}\n" +
"#qr > form {\n" +
"  /* XXX https://code.google.com/p/chromium/issues/detail?id=168840, https://bugs.webkit.org/show_bug.cgi?id=94158 */\n" +
"  max-height: 85vh;\n" +
"  max-height: calc(100vh - 75px);\n" +
"  overflow-y: auto;\n" +
"  overflow-x: hidden;\n" +
"}\n" +
"#qrtab {\n" +
"  border-radius: 3px 3px 0 0;\n" +
"}\n" +
"#qrtab {\n" +
"  margin-bottom: 1px;\n" +
"}\n" +
"#qr .close {\n" +
"  float: right;\n" +
"  padding: 0 3px;\n" +
"}\n" +
".qr-link-container {\n" +
"  text-align: center;\n" +
"  margin: 16px 0;\n" +
"}\n" +
".qr-link-container-bottom {\n" +
"  width: 200px;\n" +
"  position: absolute;\n" +
"  left: -100px;\n" +
"  margin-left: 50%;\n" +
"  text-align: center;\n" +
"}\n" +
".qr-link {\n" +
"  border-radius: 3px;\n" +
"  padding: 6px 10px 5px;\n" +
"  font-weight: bold;\n" +
"  vertical-align: middle;\n" +
"  border-style: solid;\n" +
"  border-width: 1px;\n" +
"  font-size: 10pt;\n" +
"}\n" +
".qr-link-container + #togglePostFormLink {\n" +
"  font-size: 10pt;\n" +
"  font-weight: normal;\n" +
"  margin: -8px 0 3.5px;\n" +
"}\n" +
".persona {\n" +
"  width: 100%;\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"  -webkit-flex-direction: row;\n" +
"  flex-direction: row;\n" +
"}\n" +
".persona .field {\n" +
"  -webkit-flex: 1;\n" +
"  flex: 1;\n" +
"  width: 0;\n" +
"}\n" +
"#qr.forced-anon input[data-name=\"name\"]:not(.force-show),\n" +
"#qr.forced-anon input[data-name=\"sub\"]:not(.force-show),\n" +
"#qr.reply-to-thread input[data-name=\"sub\"]:not(.force-show),\n" +
"body:not(.board_f) #qr select[name=\"filetag\"],\n" +
"#qr.reply-to-thread select[name=\"filetag\"],\n" +
"body:not(.board_jp) #sjis-toggle,\n" +
"body:not(.board_sci) #tex-preview-button,\n" +
"#qr.tex-preview .textarea > :not(#tex-preview),\n" +
"#qr:not(.tex-preview) #tex-preview {\n" +
"  display: none;\n" +
"}\n" +
".persona button {\n" +
"  -webkit-flex: 0 0 23px;\n" +
"  flex: 0 0 23px;\n" +
"  -webkit-align-self: stretch;\n" +
"  align-self: stretch;\n" +
"  border: 1px solid #BBB;\n" +
"  padding: 0;\n" +
"  background: linear-gradient(to bottom, #F8F8F8, #DCDCDC) no-repeat;\n" +
"  color: #000;\n" +
"}\n" +
"#qr.sjis-preview #sjis-toggle, #qr.tex-preview #tex-preview-button {\n" +
"  background: #DCDCDC;\n" +
"}\n" +
"#sjis-toggle, #qr.sjis-preview textarea.field {\n" +
"  font-family: \"IPAMonaPGothic\",\"Mona\",\"MS PGothic\",monospace;\n" +
"  font-size: 16px;\n" +
"  line-height: 17px;\n" +
"}\n" +
"#tex-preview-button {\n" +
"  font-size: 10px;\n" +
"}\n" +
"#tex-preview {\n" +
"  white-space: pre-line;\n" +
"}\n" +
"#qr textarea.field {\n" +
"  height: 14.8em;\n" +
"  min-height: 9em;\n" +
"}\n" +
"#qr.has-captcha textarea.field {\n" +
"  height: 9em;\n" +
"}\n" +
"input.field.tripped:not(:hover):not(:focus) {\n" +
"  color: transparent !important;\n" +
"  text-shadow: none !important;\n" +
"}\n" +
"#qr textarea {\n" +
"  min-width: 100%;\n" +
"  resize: both;\n" +
"}\n" +
".field {\n" +
"  -moz-box-sizing: border-box;\n" +
"  margin: 0px;\n" +
"  padding: 2px 4px 3px;\n" +
"}\n" +
"#qr label input[type=\"checkbox\"] {\n" +
"  position: relative;\n" +
"  top: 2px;\n" +
"}\n" +
"/* Recaptcha v1 */\n" +
".captcha-img {\n" +
"  margin: 0px;\n" +
"  text-align: center;\n" +
"  background-image: #fff;\n" +
"  font-size: 0px;\n" +
"  min-height: 59px;\n" +
"  min-width: 302px;\n" +
"}\n" +
".captcha-input {\n" +
"  width: 100%;\n" +
"  margin: 1px 0 0;\n" +
"}\n" +
"#qr.captcha-v1 #qr-captcha-iframe {\n" +
"  display: none;\n" +
"}\n" +
"/* Recaptcha v2 */\n" +
"#qr .captcha-root {\n" +
"  position: relative;\n" +
"}\n" +
"#qr .captcha-container > div {\n" +
"  margin: auto;\n" +
"  width: 304px;\n" +
"}\n" +
"/* scrollable with scroll bar hidden; prevents scroll on space press */\n" +
":root.blink #qr .captcha-container > div {\n" +
"  overflow: hidden;\n" +
"}\n" +
":root.blink #qr .captcha-container > div > div:first-of-type {\n" +
"  overflow-y: scroll;\n" +
"  overflow-x: hidden;\n" +
"  padding-right: 15px;\n" +
"}\n" +
"#qr .captcha-counter {\n" +
"  display: block;\n" +
"  width: 100%;\n" +
"  text-align: center;\n" +
"  pointer-events: none;\n" +
"}\n" +
"#qr.captcha-open .captcha-counter {\n" +
"  position: absolute;\n" +
"  bottom: 3px;\n" +
"}\n" +
"#qr .captcha-counter > a {\n" +
"  pointer-events: auto;\n" +
"}\n" +
"#qr:not(.captcha-open) .captcha-counter > a {\n" +
"  display: block;\n" +
"  width: 100%;\n" +
"}\n" +
"#qr.captcha-v2 #qr-captcha-iframe {\n" +
"  width: 302px;\n" +
"  height: 423px;\n" +
"  border: 0;\n" +
"  display: block;\n" +
"  margin: auto;\n" +
"}\n" +
".goog-bubble-content {\n" +
"  max-width: 100vw;\n" +
"  max-height: 100vh;\n" +
"  overflow: auto;\n" +
"}\n" +
".goog-bubble-content iframe {\n" +
"  position: static !important;\n" +
"}\n" +
"/* File Input, Submit Button, Oekaki */\n" +
"#file-n-submit, #qr .oekaki {\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"  -webkit-align-items: stretch;\n" +
"  align-items: stretch;\n" +
"  height: 25px;\n" +
"  margin-top: 1px;\n" +
"}\n" +
"#file-n-submit > input, #qr-draw-button {\n" +
"  background: linear-gradient(to bottom, #F8F8F8, #DCDCDC) no-repeat;\n" +
"  border: 1px solid #BBB;\n" +
"  border-radius: 2px;\n" +
"  height: 100%;\n" +
"}\n" +
"#qr-file-button, #qr-draw-button {\n" +
"  width: 15%;\n" +
"}\n" +
"#file-n-submit input[type=\"submit\"] {\n" +
"  width: 25%;\n" +
"}\n" +
"#qr-filename-container {\n" +
"  -webkit-flex: 1 1 auto;\n" +
"  flex: 1 1 auto;\n" +
"  width: 0;\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"  -webkit-align-items: center;\n" +
"  align-items: center;\n" +
"  position: relative;\n" +
"  padding: 1px;\n" +
"}\n" +
"input#qr-filename {\n" +
"  border: none !important;\n" +
"  background: none !important;\n" +
"  outline: none;\n" +
"}\n" +
"#qr-filename,\n" +
".has-file #qr-no-file {\n" +
"  display: none;\n" +
"}\n" +
"#qr-no-file,\n" +
".has-file #qr-filename {\n" +
"  -webkit-flex: 1 1 auto;\n" +
"  flex: 1 1 auto;\n" +
"  width: 0px; /* XXX Fixes filename not shrinking to allow space for buttons in Edge */\n" +
"  display: inline-block;\n" +
"  padding: 0;\n" +
"  padding-left: 3px;\n" +
"  overflow: hidden;\n" +
"  text-overflow: ellipsis;\n" +
"  white-space: nowrap;\n" +
"}\n" +
"#qr-no-file {\n" +
"  color: #AAA;\n" +
"}\n" +
"#qr .oekaki.has-file {\n" +
"  display: none;\n" +
"}\n" +
"#qr .oekaki > label {\n" +
"  -webkit-flex: 1 1 auto;\n" +
"  flex: 1 1 auto;\n" +
"  width: 0;\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"  -webkit-align-items: center;\n" +
"  align-items: center;\n" +
"  height: 100%;\n" +
"}\n" +
"#qr .oekaki > label > span {\n" +
"  margin: 0 3px;\n" +
"}\n" +
"#qr .oekaki > label > input {\n" +
"  -webkit-flex: 1 1 auto;\n" +
"  flex: 1 1 auto;\n" +
"  width: 0;\n" +
"  height: 100%;\n" +
"}\n" +
"#qr .oekaki-bg {\n" +
"  position: relative;\n" +
"  display: inline-block;\n" +
"  height: 100%;\n" +
"  width: 10%;\n" +
"  margin-left: 3px;\n" +
"}\n" +
"#qr .oekaki-bg > * {\n" +
"  position: absolute;\n" +
"  top: 0;\n" +
"  left: 0;\n" +
"  margin: 0;\n" +
"}\n" +
"#qr .oekaki-bg > :not([name=\"oekaki-bgcolor\"]) {\n" +
"  z-index: 1;\n" +
"}\n" +
"#qr [name=\"oekaki-bgcolor\"] {\n" +
"  height: 100%;\n" +
"  width: 100%;\n" +
"  border: none;\n" +
"  padding: 0;\n" +
"}\n" +
"#qr [name=\"oekaki-bg\"]:not(:checked) ~ [name=\"oekaki-bgcolor\"] {\n" +
"  visibility: hidden;\n" +
"}\n" +
"#qr input[type=\"file\"] {\n" +
"  visibility: hidden;\n" +
"  position: absolute;\n" +
"}\n" +
"/* Spoiler Checkbox, QR Icons */\n" +
"#qr-filename-container > label, #qr-filename-container > a {\n" +
"  -webkit-flex: none;\n" +
"  flex: none;\n" +
"  margin: 0;\n" +
"  margin-right: 3px;\n" +
"}\n" +
"#qr:not(.has-spoiler) #qr-spoiler-label,\n" +
"#file-n-submit:not(.has-file) #qr-spoiler-label,\n" +
".has-file #paste-area,\n" +
".has-file #url-button,\n" +
"#file-n-submit:not(.custom-cooldown) #custom-cooldown-button {\n" +
"  display: none;\n" +
"}\n" +
"#qr-filename-container > label {\n" +
"  position: relative;\n" +
"}\n" +
"#qr-filename-container input[type=\"checkbox\"] {\n" +
"  margin: 0;\n" +
"}\n" +
".checkbox-letter {\n" +
"  font-size: 13px;\n" +
"  font-weight: bold;\n" +
"}\n" +
"#qr-filename-container label:not(:hover) > input[type=\"checkbox\"]:not(:focus):not(:checked),\n" +
"#qr-filename-container label:not(:hover) > input[type=\"checkbox\"]:not(:focus):not(:checked) ~ :not(.checkbox-letter),\n" +
"#qr-filename-container label:hover > .checkbox-letter,\n" +
"input[type=\"checkbox\"]:focus ~ .checkbox-letter,\n" +
"input[type=\"checkbox\"]:checked ~ .checkbox-letter {\n" +
"  /* not displayed but still focusable */\n" +
"  position: absolute;\n" +
"  opacity: 0;\n" +
"  pointer-events: none;\n" +
"}\n" +
".checkbox-letter, #paste-area, #url-button, #custom-cooldown-button, #dump-button {\n" +
"  opacity: 0.6;\n" +
"}\n" +
"#paste-area {\n" +
"  font-size: 0;\n" +
"}\n" +
"#paste-area:focus {\n" +
"  opacity: 1;\n" +
"}\n" +
"#custom-cooldown-button.disabled {\n" +
"  opacity: 0.27;\n" +
"}\n" +
"/* Thread and Flash Tag Select */\n" +
"#qr select {\n" +
"  background: white;\n" +
"  border: 1px solid #CCC;\n" +
"}\n" +
"#qr select[data-name=\"thread\"] {\n" +
"  float: right;\n" +
"}\n" +
"#qr > form > select {\n" +
"  margin-top: 1px;\n" +
"}\n" +
"/* Dumping UI */\n" +
".dump #dump-list-container {\n" +
"  display: block;\n" +
"}\n" +
"#dump-list-container {\n" +
"  display: none;\n" +
"  position: relative;\n" +
"  overflow-y: hidden;\n" +
"  margin-top: 1px;\n" +
"}\n" +
"#dump-list {\n" +
"  overflow-x: auto;\n" +
"  overflow-y: auto;\n" +
"  white-space: nowrap;\n" +
"  width: 248px;\n" +
"  max-height: 248px;\n" +
"  min-height: 90px;\n" +
"  max-width: 100%;\n" +
"  min-width: 100%;\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"  -webkit-flex-wrap: wrap;\n" +
"  flex-wrap: wrap;\n" +
"}\n" +
"#dump-list:hover {\n" +
"  overflow-x: auto;\n" +
"}\n" +
".qr-preview {\n" +
"  -moz-box-sizing: border-box;\n" +
"  counter-increment: thumbnails;\n" +
"  cursor: move;\n" +
"  display: inline-block;\n" +
"  height: 90px;\n" +
"  width: 90px;\n" +
"  padding: 2px;\n" +
"  opacity: .5;\n" +
"  overflow: hidden;\n" +
"  position: relative;\n" +
"  text-shadow: 0 0 2px #000;\n" +
"  -webkit-transition: opacity .25s ease-in-out, -webkit-transform .25s ease-in-out;\n" +
"  transition: opacity .25s ease-in-out, transform .25s ease-in-out, -webkit-transform .25s ease-in-out;\n" +
"  vertical-align: top;\n" +
"  background-size: cover;\n" +
"  -webkit-flex: none;\n" +
"  flex: none;\n" +
"}\n" +
".qr-preview:hover,\n" +
".qr-preview:focus {\n" +
"  opacity: .9;\n" +
"}\n" +
".qr-preview::before {\n" +
"  content: counter(thumbnails);\n" +
"  color: #fff;\n" +
"  position: absolute;\n" +
"  top: 3px;\n" +
"  right: 3px;\n" +
"  text-shadow: 0 0 3px #000, 0 0 8px #000;\n" +
"}\n" +
".qr-preview#selected {\n" +
"  opacity: 1;\n" +
"}\n" +
".qr-preview.drag {\n" +
"  box-shadow: 0 0 10px rgba(0,0,0,.5);\n" +
"  -webkit-transform: scale(.8);\n" +
"  transform: scale(.8);\n" +
"}\n" +
".qr-preview.over {\n" +
"  border-color: #fff;\n" +
"  -webkit-transform: scale(1.1);\n" +
"  transform: scale(1.1);\n" +
"  opacity: 0.9;\n" +
"  z-index: 10;\n" +
"}\n" +
".qr-preview > span {\n" +
"  color: #fff;\n" +
"}\n" +
".remove {\n" +
"  background: none;\n" +
"  color: #e00;\n" +
"  padding: 1px;\n" +
"}\n" +
"a:only-of-type > .remove {\n" +
"  display: none;\n" +
"}\n" +
".remove:hover::after {\n" +
"  content: \" Remove\";\n" +
"}\n" +
".qr-preview:not(.has-file) label,\n" +
"#qr:not(.has-spoiler) .qr-preview-spoiler {\n" +
"  display: none;\n" +
"}\n" +
".qr-preview > label {\n" +
"  background: rgba(0,0,0,.5);\n" +
"  color: #fff;\n" +
"  right: 0;\n" +
"  bottom: 0;\n" +
"  left: 0;\n" +
"  position: absolute;\n" +
"  text-align: center;\n" +
"}\n" +
".qr-preview > label > input {\n" +
"  margin: 0;\n" +
"}\n" +
"#add-post {\n" +
"  cursor: pointer;\n" +
"  font-size: 2em;\n" +
"  position: absolute;\n" +
"  bottom: 20px;\n" +
"  right: 10px;\n" +
"  -moz-transform: translateY(-50%);\n" +
"}\n" +
".textarea {\n" +
"  position: relative;\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"}\n" +
":root.webkit .textarea {\n" +
"  margin-bottom: -2px;\n" +
"}\n" +
"#char-count {\n" +
"  color: #000;\n" +
"  background: hsla(0, 0%, 100%, .5);\n" +
"  font-size: 8pt;\n" +
"  position: absolute;\n" +
"  bottom: 1px;\n" +
"  right: 1px;\n" +
"  pointer-events: none;\n" +
"}\n" +
"#char-count.warning {\n" +
"  color: red;\n" +
"}\n" +
"/* Menu */\n" +
".menu-button:not(.fa-bars) {\n" +
"  display: inline-block;\n" +
"  position: relative;\n" +
"  cursor: pointer;\n" +
"}\n" +
"#header-bar .menu-button i {\n" +
"  border-top:   6px solid;\n" +
"  border-right: 4px solid transparent;\n" +
"  border-left:  4px solid transparent;\n" +
"  display: inline-block;\n" +
"  margin: 2px;\n" +
"  vertical-align: middle;\n" +
"}\n" +
".post .menu-button,\n" +
"#thread-watcher .menu-button {\n" +
"  width: 18px;\n" +
"  height: 15px;\n" +
"  text-align: center;\n" +
"}\n" +
"#menu {\n" +
"  position: fixed;\n" +
"  outline: none;\n" +
"}\n" +
"#menu, .submenu {\n" +
"  border-radius: 3px;\n" +
"  padding-top: 1px;\n" +
"  padding-bottom: 3px;\n" +
"}\n" +
".entry {\n" +
"  cursor: pointer;\n" +
"  display: block;\n" +
"  outline: none;\n" +
"  padding: 2px 10px;\n" +
"  position: relative;\n" +
"  text-decoration: none;\n" +
"  white-space: nowrap;\n" +
"  min-width: 70px;\n" +
"  text-align: left;\n" +
"  text-shadow: none;\n" +
"  font-size: 10pt;\n" +
"}\n" +
".left>.entry.has-submenu {\n" +
"  padding-right: 17px !important;\n" +
"}\n" +
".entry input[type=\"checkbox\"],\n" +
".entry input[type=\"radio\"] {\n" +
"  margin: 0px;\n" +
"  position: relative;\n" +
"  top: 2px;\n" +
"}\n" +
".entry input[type=\"number\"] {\n" +
"  width: 4.5em;\n" +
"}\n" +
".entry.has-shortcut-text {\n" +
"  display: flex;\n" +
"  justify-content: space-between;\n" +
"  align-items: center;\n" +
"}\n" +
".entry .shortcut-text {\n" +
"  opacity: 0.5;\n" +
"  font-size: 70%;\n" +
"  margin-left: 5px;\n" +
"}\n" +
".has-submenu::after {\n" +
"  content: \"\";\n" +
"  border-left: .5em solid;\n" +
"  border-top: .3em solid transparent;\n" +
"  border-bottom: .3em solid transparent;\n" +
"  display: inline-block;\n" +
"  margin: .3em;\n" +
"  position: absolute;\n" +
"  right: 3px;\n" +
"}\n" +
".left .has-submenu::after {\n" +
"  border-left: 0;\n" +
"  border-right: .5em solid;\n" +
"}\n" +
".submenu {\n" +
"  display: none;\n" +
"  position: absolute;\n" +
"  left: 100%;\n" +
"  top: -1px;\n" +
"  margin-left: 0px;\n" +
"  margin-top: -2px;\n" +
"}\n" +
".focused > .submenu {\n" +
"  display: block;\n" +
"}\n" +
".imp-exp-result {\n" +
"  position: absolute;\n" +
"  text-align: center;\n" +
"  margin: auto;\n" +
"  right: 0px;\n" +
"  left: 0px;\n" +
"  width: 200px;\n" +
"}\n" +
"/* Custom Board Titles */\n" +
".boardTitle, .boardSubtitle {\n" +
"  white-space: pre-line;\n" +
"}\n" +
".boardTitle[contenteditable=\"true\"],\n" +
".boardSubtitle[contenteditable=\"true\"] {\n" +
"  cursor: text !important;\n" +
"}\n" +
"/* Embedding */\n" +
"#embedding {\n" +
"  padding: 1px 4px 1px 4px;\n" +
"  position: fixed;\n" +
"}\n" +
"#embedding.empty {\n" +
"  display: none;\n" +
"}\n" +
"#embedding > div:first-child {\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"}\n" +
"#embedding .move {\n" +
"  -webkit-flex: 1;\n" +
"  flex: 1;\n" +
"}\n" +
"#embedding .jump {\n" +
"  margin: -1px 4px;\n" +
"  text-decoration: none;\n" +
"}\n" +
"/* Gallery */\n" +
"#a-gallery {\n" +
"  position: fixed;\n" +
"  top: 0;\n" +
"  bottom: 0;\n" +
"  left: 0;\n" +
"  right: 0;\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"  -webkit-flex-direction: row;\n" +
"  flex-direction: row;\n" +
"  background: rgba(0,0,0,0.7);\n" +
"}\n" +
".gal-viewport {\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"  -webkit-align-items: stretch;\n" +
"  align-items: stretch;\n" +
"  -webkit-flex-direction: row;\n" +
"  flex-direction: row;\n" +
"  -webkit-flex: 1 1 auto;\n" +
"  flex: 1 1 auto;\n" +
"  overflow: hidden;\n" +
"}\n" +
".gal-thumbnails {\n" +
"  -webkit-flex: 0 0 150px;\n" +
"  flex: 0 0 150px;\n" +
"  overflow-y: auto;\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"  -webkit-flex-direction: column;\n" +
"  flex-direction: column;\n" +
"  -webkit-align-items: stretch;\n" +
"  align-items: stretch;\n" +
"  text-align: center;\n" +
"  background: rgba(0,0,0,.5);\n" +
"  border-left: 1px solid #222;\n" +
"}\n" +
".gal-hide-thumbnails .gal-thumbnails {\n" +
"  display: none;\n" +
"}\n" +
".gal-thumb img,\n" +
".gal-thumb video {\n" +
"  max-width: 125px;\n" +
"  max-height: 125px;\n" +
"  height: auto;\n" +
"  width: auto;\n" +
"}\n" +
".gal-thumb {\n" +
"  -webkit-flex: 0 0 auto;\n" +
"  flex: 0 0 auto;\n" +
"  padding: 3px;\n" +
"  line-height: 0;\n" +
"  transition: background .2s linear;\n" +
"}\n" +
".gal-highlight {\n" +
"  background: rgba(0, 190, 255,.8);\n" +
"}\n" +
".gal-prev {\n" +
"  border-right: 1px solid #222;\n" +
"}\n" +
".gal-next {\n" +
"  border-left: 1px solid #222;\n" +
"}\n" +
".gal-prev,\n" +
".gal-next {\n" +
"  -webkit-flex: 0 0 20px;\n" +
"  flex: 0 0 20px;\n" +
"  position: relative;\n" +
"  cursor: pointer;\n" +
"  opacity: 0.7;\n" +
"  background-color: rgba(0, 0, 0, 0.3);\n" +
"}\n" +
".gal-prev:hover,\n" +
".gal-next:hover {\n" +
"  opacity: 1;\n" +
"}\n" +
".gal-prev::after,\n" +
".gal-next::after {\n" +
"  position: absolute;\n" +
"  top: 48.6%;\n" +
"  -webkit-transform: translateY(-50%);\n" +
"  transform: translateY(-50%);\n" +
"  display: inline-block;\n" +
"  border-top: 11px solid transparent;\n" +
"  border-bottom: 11px solid transparent;\n" +
"  content: \"\";\n" +
"}\n" +
".gal-prev::after {\n" +
"  border-right: 12px solid #fff;\n" +
"  right: 5px;\n" +
"}\n" +
".gal-next::after {\n" +
"  border-left: 12px solid #fff;\n" +
"  right: 3px;\n" +
"}\n" +
".gal-image {\n" +
"  -webkit-flex: 1 0 auto;\n" +
"  flex: 1 0 auto;\n" +
"  display: -webkit-flex;\n" +
"  display: flex;\n" +
"  -webkit-align-items: flex-start;\n" +
"  align-items: flex-start;\n" +
"  -webkit-justify-content: space-around;\n" +
"  justify-content: space-around;\n" +
"  overflow: hidden;\n" +
"  /* Flex > Non-Flex child max-width and overflow fix (Firefox only?) */\n" +
"  width: 1%;\n" +
"}\n" +
":root:not(.gal-fit-height):not(.gal-pdf) .gal-image {\n" +
"  overflow-y: scroll !important;\n" +
"}\n" +
":root:not(.gal-fit-width):not(.gal-pdf) .gal-image {\n" +
"  overflow-x: scroll !important;\n" +
"}\n" +
".gal-image a {\n" +
"  margin: auto;\n" +
"  line-height: 0;\n" +
"  max-width: 100%;\n" +
"}\n" +
":root.gal-pdf .gal-image a {\n" +
"  width: 100%;\n" +
"  height: 100%;\n" +
"}\n" +
".gal-fit-width .gal-image img,\n" +
".gal-fit-width .gal-image video {\n" +
"  max-width: 100%;\n" +
"}\n" +
".gal-fit-height .gal-image img,\n" +
".gal-fit-height .gal-image video {\n" +
"  /* XXX https://code.google.com/p/chromium/issues/detail?id=168840, https://bugs.webkit.org/show_bug.cgi?id=94158 */\n" +
"  max-height: 95vh;\n" +
"  max-height: calc(100vh - 25px);\n" +
"}\n" +
".gal-image iframe {\n" +
"  width: 100%;\n" +
"  height: 100%;\n" +
"}\n" +
".gal-buttons {\n" +
"  font-size: 2em;\n" +
"  margin-right: 3px;\n" +
"  padding-left: 7px;\n" +
"  padding-right: 7px;\n" +
"  top: 5px;\n" +
"}\n" +
":root.gal-pdf .gal-buttons {\n" +
"  top: 40px;\n" +
"  background: rgba(0,0,0,0.6) !important;\n" +
"  border-radius: 3px;\n" +
"}\n" +
".gal-buttons a {\n" +
"  color: #ffffff;\n" +
"  text-shadow: 0px 0px 1px #000000;\n" +
"}\n" +
".gal-buttons i {\n" +
"  display: inline-block;\n" +
"  margin: 2px;\n" +
"  position: relative;\n" +
"}\n" +
".gal-start i {\n" +
"  border-left:   10px solid;\n" +
"  border-top:    6px solid transparent;\n" +
"  border-bottom: 6px solid transparent;\n" +
"  bottom: 1px;\n" +
"}\n" +
".gal-stop i {\n" +
"  border: 5px solid;\n" +
"  bottom: 2px;\n" +
"}\n" +
".gal-buttons.gal-playing > .gal-start,\n" +
".gal-buttons:not(.gal-playing) > .gal-stop {\n" +
"  display: none;\n" +
"}\n" +
".gal-buttons .menu-button i {\n" +
"  border-top:   10px solid;\n" +
"  border-right:  6px solid transparent;\n" +
"  border-left:   6px solid transparent;\n" +
"  bottom: 2px;\n" +
"  vertical-align: baseline;\n" +
"}\n" +
".gal-buttons,\n" +
".gal-name,\n" +
".gal-count {\n" +
"  position: fixed;\n" +
"  right: 195px;\n" +
"}\n" +
".gal-hide-thumbnails .gal-buttons,\n" +
".gal-hide-thumbnails .gal-count,\n" +
".gal-hide-thumbnails .gal-name {\n" +
"  right: 44px;\n" +
"}\n" +
".gal-name {\n" +
"  bottom: 6px;\n" +
"  background: rgba(0,0,0,0.6) !important;\n" +
"  border-radius: 3px;\n" +
"  padding: 1px 5px 2px 5px;\n" +
"  text-decoration: none !important;\n" +
"  color: white !important;\n" +
"}\n" +
".gal-name:hover,\n" +
".gal-buttons a:hover {\n" +
"  color: rgb(95, 95, 101) !important;\n" +
"}\n" +
":root.gal-pdf .gal-buttons a:hover {\n" +
"  color: rgb(204, 204, 204) !important;\n" +
"}\n" +
".gal-count {\n" +
"  bottom: 27px;\n" +
"  background: rgba(0,0,0,0.6) !important;\n" +
"  border-radius: 3px;\n" +
"  padding: 1px 5px 2px 5px;\n" +
"  color: #ffffff !important;\n" +
"}\n" +
":root:not(.gal-fit-width):not(.gal-pdf) .gal-name {\n" +
"  bottom: 23px !important;\n" +
"}\n" +
":root:not(.gal-fit-width):not(.gal-pdf) .gal-count {\n" +
"  bottom: 44px !important;\n" +
"}\n" +
":root.gal-fit-height:not(.gal-pdf):not(.gal-hide-thumbnails) .gal-buttons,\n" +
":root.gal-fit-height:not(.gal-pdf):not(.gal-hide-thumbnails) .gal-name,\n" +
":root.gal-fit-height:not(.gal-pdf):not(.gal-hide-thumbnails) .gal-count {\n" +
"  right: 178px !important;\n" +
"}\n" +
":root.gal-hide-thumbnails:.gal-fit-height:not(.gal-pdf) .gal-buttons,\n" +
":root.gal-hide-thumbnails:.gal-fit-height:not(.gal-pdf) .gal-name,\n" +
":root.gal-hide-thumbnails:.gal-fit-height:not(.gal-pdf) .gal-count {\n" +
"  right: 28px !important;\n" +
"}\n" +
":root.gallery-open.fixed #header-bar:not(.autohide),\n" +
":root.gallery-open.fixed #header-bar:not(.autohide) #shortcuts .fa::before {\n" +
"  visibility: hidden;\n" +
"}\n" +
"/* General */\n" +
":root.yotsuba .dialog {\n" +
"  background-color: #F0E0D6;\n" +
"  border-color: #D9BFB7;\n" +
"}\n" +
":root.yotsuba .field:focus,\n" +
":root.yotsuba .field.focus {\n" +
"  border-color: #EA8;\n" +
"}\n" +
"/* Header */\n" +
":root.yotsuba #header-bar.dialog {\n" +
"  background-color: rgba(240,224,214,0.98);\n" +
"}\n" +
":root.yotsuba:not(.fixed) #header-bar, :root.yotsuba #notifications {\n" +
"  font-size: 9pt;\n" +
"}\n" +
":root.yotsuba #header-bar, :root.yotsuba #notifications {\n" +
"  color: #B86;\n" +
"}\n" +
":root.yotsuba #board-list a, :root.yotsuba #shortcuts a  {\n" +
"  color: #800000;\n" +
"}\n" +
"/* Settings */\n" +
":root.yotsuba #fourchanx-settings fieldset, :root.yotsuba .section-main div::before {\n" +
"  border-color: #D9BFB7;\n" +
"}\n" +
":root.yotsuba .suboption-list > div:last-of-type {\n" +
"  background-color: #F0E0D6;\n" +
"}\n" +
"/* Quote */\n" +
":root.yotsuba .backlink.deadlink {\n" +
"  color: #00E !important;\n" +
"}\n" +
":root.yotsuba .inline {\n" +
"  border-color: #D9BFB7;\n" +
"  background-color: rgba(255, 255, 255, .14);\n" +
"}\n" +
"/* Fappe and Werk Tyme */\n" +
":root.yotsuba .indicator {\n" +
"  color: #F0E0D6;\n" +
"}\n" +
"/* QR */\n" +
".yotsuba #dump-list::-webkit-scrollbar-thumb {\n" +
"  background-color: #F0E0D6;\n" +
"  border-color: #D9BFB7;\n" +
"}\n" +
":root.yotsuba .qr-preview {\n" +
"  background-color: rgba(0, 0, 0, .15);\n" +
"}\n" +
":root.yotsuba .qr-link {\n" +
"  border-color: rgb(225, 209, 199) rgb(225, 209, 199) rgb(210, 194, 184);\n" +
"  background: linear-gradient(#FFEFE5, #F0E0D6) repeat scroll 0% 0% transparent;\n" +
"}\n" +
":root.yotsuba .qr-link:hover {\n" +
"  background: #F0E0D6;\n" +
"}\n" +
"/* Menu */\n" +
":root.yotsuba #menu {\n" +
"  color: #800000;\n" +
"}\n" +
":root.yotsuba .entry {\n" +
"  font-size: 10pt;\n" +
"}\n" +
":root.yotsuba .focused.entry {\n" +
"  background: rgba(255, 255, 255, .33);\n" +
"}\n" +
"/* Thread Watcher */\n" +
":root.yotsuba .replies-quoting-you > a, :root.yotsuba #watcher-link.disabled.replies-quoting-you {\n" +
"  color: #F00;\n" +
"}\n" +
"/* Watcher Favicon */\n" +
":root.yotsuba .watch-thread-link\n" +
"{\n" +
"  background-image: url(\"data:image/svg+xml,<svg viewBox='0 0 26 26' preserveAspectRatio='true' xmlns='http://www.w3.org/2000/svg'><path fill='rgb(128,0,0)' d='M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z'/></svg>\");\n" +
"}\n" +
"/* General */\n" +
":root.yotsuba-b .dialog {\n" +
"  background-color: #D6DAF0;\n" +
"  border-color: #B7C5D9;\n" +
"}\n" +
":root.yotsuba-b .field:focus,\n" +
":root.yotsuba-b .field.focus {\n" +
"  border-color: #98E;\n" +
"}\n" +
"/* Header */\n" +
":root.yotsuba-b #header-bar.dialog {\n" +
"  background-color: rgba(214,218,240,0.98);\n" +
"}\n" +
":root.yotsuba-b:not(.fixed) #header-bar, :root.yotsuba-b #notifications {\n" +
"  font-size: 9pt;\n" +
"}\n" +
":root.yotsuba-b #header-bar, :root.yotsuba-b #notifications {\n" +
"  color: #89A;\n" +
"}\n" +
":root.yotsuba-b #board-list a, :root.yotsuba-b #shortcuts a {\n" +
"  color: #34345C;\n" +
"}\n" +
"/* Settings */\n" +
":root.yotsuba-b #fourchanx-settings fieldset, :root.yotsuba-b .section-main div::before {\n" +
"  border-color: #B7C5D9;\n" +
"}\n" +
":root.yotsuba-b .suboption-list > div:last-of-type {\n" +
"  background-color: #D6DAF0;\n" +
"}\n" +
"/* Quote */\n" +
":root.yotsuba-b .backlink.deadlink {\n" +
"  color: #34345C !important;\n" +
"}\n" +
":root.yotsuba-b .inline {\n" +
"  border-color: #B7C5D9;\n" +
"  background-color: rgba(255, 255, 255, .14);\n" +
"}\n" +
"/* Fappe and Werk Tyme */\n" +
":root.yotsuba-b .indicator {\n" +
"  color: #D6DAF0;\n" +
"}\n" +
"/* QR */\n" +
".yotsuba-b #dump-list::-webkit-scrollbar-thumb {\n" +
"  background-color: #D6DAF0;\n" +
"  border-color: #B7C5D9;\n" +
"}\n" +
":root.yotsuba-b .qr-preview {\n" +
"  background-color: rgba(0, 0, 0, .15);\n" +
"}\n" +
":root.yotsuba-b .qr-link {\n" +
"  border-color: rgb(199, 203, 225) rgb(199, 203, 225) rgb(184, 188, 210);\n" +
"  background: linear-gradient(#E5E9FF, #D6DAF0) repeat scroll 0% 0% transparent;\n" +
"}\n" +
":root.yotsuba-b .qr-link:hover {\n" +
"  background: #D9DDF3;\n" +
"}\n" +
"/* Menu */\n" +
":root.yotsuba-b #menu {\n" +
"  color: #000;\n" +
"}\n" +
":root.yotsuba-b .entry {\n" +
"  font-size: 10pt;\n" +
"}\n" +
":root.yotsuba-b .focused.entry {\n" +
"  background: rgba(255, 255, 255, .33);\n" +
"}\n" +
"/* Thread Watcher */\n" +
":root.yotsuba-b .replies-quoting-you > a, :root.yotsuba-b #watcher-link.disabled.replies-quoting-you {\n" +
"  color: #F00;\n" +
"}\n" +
"/* Watcher Favicon */\n" +
":root.yotsuba-b .watch-thread-link\n" +
"{\n" +
"  background-image: url(\"data:image/svg+xml,<svg viewBox='0 0 26 26' preserveAspectRatio='true' xmlns='http://www.w3.org/2000/svg'><path fill='rgb(0,0,0)' d='M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z'/></svg>\");\n" +
"}\n" +
"/* General */\n" +
":root.futaba .dialog {\n" +
"  background-color: #F0E0D6;\n" +
"  border-color: #D9BFB7;\n" +
"}\n" +
":root.futaba .field:focus,\n" +
":root.futaba .field.focus {\n" +
"  border-color: #EA8;\n" +
"}\n" +
"/* Header */\n" +
":root.futaba #header-bar.dialog {\n" +
"  background-color: rgba(240,224,214,0.98);\n" +
"}\n" +
":root.futaba:not(.fixed) #header-bar, :root.futaba #notifications {\n" +
"  font-size: 11pt;\n" +
"}\n" +
":root.futaba #header-bar, :root.futaba #notifications {\n" +
"  color: #B86;\n" +
"}\n" +
":root.futaba #header-bar a, :root.futaba #notifications a {\n" +
"  color: #800000;\n" +
"}\n" +
"/* Settings */\n" +
":root.futaba #fourchanx-settings fieldset, :root.futaba .section-main div::before {\n" +
"  border-color: #D9BFB7;\n" +
"}\n" +
":root.futaba .suboption-list > div:last-of-type {\n" +
"  background-color: #F0E0D6;\n" +
"}\n" +
"/* Quote */\n" +
":root.futaba .backlink.deadlink {\n" +
"  color: #00E !important;\n" +
"}\n" +
":root.futaba .inline {\n" +
"  border-color: #D9BFB7;\n" +
"  background-color: rgba(255, 255, 255, .14);\n" +
"}\n" +
"/* Fappe and Werk Tyme */\n" +
":root.futaba .indicator {\n" +
"  color: #F0E0D6;\n" +
"}\n" +
"/* QR */\n" +
".futaba #dump-list::-webkit-scrollbar-thumb {\n" +
"  background-color: #F0E0D6;\n" +
"  border-color: #D9BFB7;\n" +
"}\n" +
":root.futaba .qr-preview {\n" +
"  background-color: rgba(0, 0, 0, .15);\n" +
"}\n" +
":root.futaba .qr-link {\n" +
"  border-color: rgb(225, 209, 199) rgb(225, 209, 199) rgb(210, 194, 184);\n" +
"  background: linear-gradient(#FFEFE5, #F0E0D6) repeat scroll 0% 0% transparent;\n" +
"}\n" +
":root.futaba .qr-link:hover {\n" +
"  background: #F0E0D6;\n" +
"}\n" +
"/* Menu */\n" +
":root.futaba #menu {\n" +
"  color: #800000;\n" +
"}\n" +
":root.futaba .entry {\n" +
"  font-size: 12pt;\n" +
"}\n" +
":root.futaba .focused.entry {\n" +
"  background: rgba(255, 255, 255, .33);\n" +
"}\n" +
"/* Thread Watcher */\n" +
":root.futaba .replies-quoting-you > a, :root.futaba #watcher-link.disabled.replies-quoting-you {\n" +
"  color: #F00;\n" +
"}\n" +
"/* Watcher Favicon */\n" +
":root.futaba .watch-thread-link\n" +
"{\n" +
"  background-image: url(\"data:image/svg+xml,<svg viewBox='0 0 26 26' preserveAspectRatio='true' xmlns='http://www.w3.org/2000/svg'><path fill='rgb(128,0,0)' d='M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z'/></svg>\");\n" +
"}\n" +
"/* General */\n" +
":root.burichan .dialog {\n" +
"  background-color: #D6DAF0;\n" +
"  border-color: #B7C5D9;\n" +
"}\n" +
":root.burichan .field:focus,\n" +
":root.burichan .field.focus {\n" +
"  border-color: #98E;\n" +
"}\n" +
"/* Header */\n" +
":root.burichan #header-bar.dialog {\n" +
"  background-color: rgba(214,218,240,0.98);\n" +
"}\n" +
":root.burichan:not(.fixed) #header-bar, :root.burichan #header-bar #notifications {\n" +
"  font-size: 11pt;\n" +
"}\n" +
":root.burichan #header-bar, :root.burichan #header-bar #notifications {\n" +
"  color: #89A;\n" +
"}\n" +
":root.burichan #header-bar a, :root.burichan #header-bar #notifications a {\n" +
"  color: #34345C;\n" +
"}\n" +
"/* Settings */\n" +
":root.burichan #fourchanx-settings fieldset, :root.burichan .section-main div::before {\n" +
"  border-color: #B7C5D9;\n" +
"}\n" +
":root.burichan .suboption-list > div:last-of-type {\n" +
"  background-color: #D6DAF0;\n" +
"}\n" +
"/* Quote */\n" +
":root.burichan .backlink.deadlink {\n" +
"  color: #34345C !important;\n" +
"}\n" +
":root.burichan .inline {\n" +
"  border-color: #B7C5D9;\n" +
"  background-color: rgba(255, 255, 255, .14);\n" +
"}\n" +
"/* Fappe and Werk Tyme */\n" +
":root.burichan .indicator {\n" +
"  color: #D6DAF0;\n" +
"}\n" +
"/* QR */\n" +
".burichan #dump-list::-webkit-scrollbar-thumb {\n" +
"  background-color: #D6DAF0;\n" +
"  border-color: #B7C5D9;\n" +
"}\n" +
":root.burichan .qr-preview {\n" +
"  background-color: rgba(0, 0, 0, .15);\n" +
"}\n" +
":root.burichan .qr-link {\n" +
"  border-color: rgb(199, 203, 225) rgb(199, 203, 225) rgb(184, 188, 210);\n" +
"  background: linear-gradient(#E5E9FF, #D6DAF0) repeat scroll 0% 0% transparent;\n" +
"}\n" +
":root.burichan .qr-link:hover {\n" +
"  background: #D9DDF3;\n" +
"}\n" +
"/* Menu */\n" +
":root.burichan #menu {\n" +
"  color: #000000;\n" +
"}\n" +
":root.burichan .entry {\n" +
"  font-size: 12pt;\n" +
"}\n" +
":root.burichan .focused.entry {\n" +
"  background: rgba(255, 255, 255, .33);\n" +
"}\n" +
"/* Thread Watcher */\n" +
":root.burichan .replies-quoting-you > a, :root.burichan #watcher-link.disabled.replies-quoting-you {\n" +
"  color: #F00;\n" +
"}\n" +
"/* Watcher Favicon */\n" +
":root.burichan .watch-thread-link\n" +
"{\n" +
"  background-image: url(\"data:image/svg+xml,<svg viewBox='0 0 26 26' preserveAspectRatio='true' xmlns='http://www.w3.org/2000/svg'><path fill='rgb(0,0,0)' d='M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z'/></svg>\");\n" +
"}\n" +
"/* General */\n" +
":root.tomorrow .dialog {\n" +
"  background-color: #282A2E;\n" +
"  border-color: #111;\n" +
"}\n" +
"/* Header */\n" +
":root.tomorrow #header-bar.dialog {\n" +
"  background-color: rgba(40,42,46,0.9);\n" +
"}\n" +
":root.tomorrow:not(.fixed) #header-bar, :root.tomorrow #notifications {\n" +
"  font-size: 9pt;\n" +
"}\n" +
":root.tomorrow #header-bar, :root.tomorrow #notifications {\n" +
"  color: #C5C8C6;\n" +
"}\n" +
":root.tomorrow #header-bar a, :root.tomorrow #notifications a {\n" +
"  color: #81A2BE;\n" +
"}\n" +
":root.tomorrow.shortcut-icons .native-settings {\n" +
"  background-image: url('//s.4cdn.org/image/favicon-ws.ico');\n" +
"}\n" +
"/* Settings */\n" +
":root.tomorrow #fourchanx-settings fieldset, :root.tomorrow .section-main div::before {\n" +
"  border-color: #111;\n" +
"}\n" +
":root.tomorrow .suboption-list > div:last-of-type {\n" +
"  background-color: #282A2E;\n" +
"}\n" +
"/* Catalog */\n" +
":root.tomorrow .catalog-code {\n" +
"  background-color: rgba(255, 255, 255, 0.1);\n" +
"}\n" +
"/* Quote */\n" +
":root.tomorrow .catalog-thread > .comment > span.quote, :root.tomorrow #arc-list span.quote {\n" +
"  color: #B5BD68;\n" +
"}\n" +
":root.tomorrow .backlink.deadlink {\n" +
"  color: #81A2BE !important;\n" +
"}\n" +
":root.tomorrow .inline {\n" +
"  border-color: #111;\n" +
"  background-color: rgba(0, 0, 0, .14);\n" +
"}\n" +
"/* Fappe and Werk Tyme */\n" +
":root.tomorrow .indicator {\n" +
"  color: #282A2E;\n" +
"}\n" +
"/* Highlighting */\n" +
":root.tomorrow .qphl {\n" +
"  outline: 2px solid rgba(145, 182, 214, .8);\n" +
"}\n" +
":root.tomorrow.highlight-you .quotesYou.opContainer,\n" +
":root.tomorrow.highlight-you .quotesYou > .reply {\n" +
"  border-left: 3px solid rgba(145, 182, 214, .8);\n" +
"}\n" +
":root.tomorrow.highlight-own .yourPost.opContainer,\n" +
":root.tomorrow.highlight-own .yourPost > .reply {\n" +
"  border-left: 3px dashed rgba(145, 182, 214, .8);\n" +
"}\n" +
":root.tomorrow .opContainer.filter-highlight,\n" +
":root.tomorrow .filter-highlight > .reply {\n" +
"  box-shadow: inset 5px 0 rgba(145, 182, 214, .5);\n" +
"}\n" +
":root.tomorrow.highlight-own .yourPost > div.sideArrows,\n" +
":root.tomorrow.highlight-you .quotesYou > div.sideArrows,\n" +
":root.tomorrow .filter-highlight > div.sideArrows {\n" +
"  color: rgb(155, 185, 210);\n" +
"}\n" +
":root.tomorrow .filter-highlight .catalog-thumb,\n" +
":root.tomorrow .filter-highlight .werkTyme-filename {\n" +
"  box-shadow: 0 0 3px 3px rgba(64, 192, 255, .7);\n" +
"}\n" +
":root.tomorrow .catalog-thread.watched .catalog-thumb,\n" +
":root.tomorrow .catalog-thread.watched .werkTyme-filename {\n" +
"  border: 2px solid rgb(64, 192, 255);\n" +
"}\n" +
"/* QR */\n" +
".tomorrow #dump-list::-webkit-scrollbar-thumb {\n" +
"  background-color: #282A2E;\n" +
"  border-color: #111;\n" +
"}\n" +
":root.tomorrow .qr-preview {\n" +
"  background-color: rgba(255, 255, 255, .15);\n" +
"}\n" +
":root.tomorrow #qr .field {\n" +
"  background-color: rgb(26, 27, 29);\n" +
"  color: rgb(197,200,198);\n" +
"  border-color: rgb(40, 41, 42);\n" +
"}\n" +
":root.tomorrow #qr .field:focus,\n" +
":root.tomorrow #qr .field.focus {\n" +
"  border-color: rgb(129, 162, 190) !important;\n" +
"  background-color: rgb(30,32,36);\n" +
"}\n" +
":root.tomorrow .persona button {\n" +
"  background: linear-gradient(to bottom, #2E3035, #222427) no-repeat;\n" +
"  color: rgb(197,200,198);\n" +
"  border-color: rgb(40, 41, 42);\n" +
"  outline: none;\n" +
"}\n" +
":root.tomorrow .persona button::-moz-focus-inner {\n" +
"  border: none;\n" +
"}\n" +
":root.tomorrow .persona button:focus {\n" +
"  border-color: rgb(129, 162, 190);\n" +
"}\n" +
":root.tomorrow #qr.sjis-preview #sjis-toggle,\n" +
":root.tomorrow #qr.tex-preview #tex-preview-button {\n" +
"  background: rgb(26, 27, 29);\n" +
"}\n" +
":root.tomorrow #qr select,\n" +
":root.tomorrow #file-n-submit > input,\n" +
":root.tomorrow #qr-draw-button {\n" +
"  border-color: rgb(40, 41, 42);\n" +
"}\n" +
":root.tomorrow #qr-filename {\n" +
"  color: rgb(197,200,198);\n" +
"}\n" +
":root.tomorrow .qr-link {\n" +
"  border-color: rgb(25, 27, 31) rgb(25, 27, 31) rgb(10, 12, 16);\n" +
"  background: linear-gradient(#37393D, #282A2E) repeat scroll 0% 0% transparent;\n" +
"}\n" +
":root.tomorrow .qr-link:hover {\n" +
"  background: #282A2E;\n" +
"}\n" +
"/* Menu */\n" +
":root.tomorrow #menu {\n" +
"  color: #C5C8C6;\n" +
"}\n" +
":root.tomorrow .entry {\n" +
"  font-size: 10pt;\n" +
"}\n" +
":root.tomorrow .focused.entry {\n" +
"  background: rgba(0, 0, 0, .33);\n" +
"}\n" +
"/* Unread */\n" +
":root.tomorrow #unread-line {\n" +
"  border-color: rgb(197, 200, 198);\n" +
"}\n" +
"/* Thread Watcher */\n" +
":root.tomorrow .replies-quoting-you > a, :root.tomorrow #watcher-link.disabled.replies-quoting-you {\n" +
"  color: #F00 !important;\n" +
"}\n" +
"/* Watcher Favicon */\n" +
":root.tomorrow .watch-thread-link\n" +
"{\n" +
"  background-image: url(\"data:image/svg+xml,<svg viewBox='0 0 26 26' preserveAspectRatio='true' xmlns='http://www.w3.org/2000/svg'><path fill='rgb(197,200,198)' d='M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z'/></svg>\");\n" +
"}\n" +
"/* General */\n" +
":root.photon .dialog {\n" +
"  background-color: #DDD;\n" +
"  border-color: #CCC;\n" +
"}\n" +
":root.photon .field:focus,\n" +
":root.photon .field.focus {\n" +
"  border-color: #EA8;\n" +
"}\n" +
"/* Header */\n" +
":root.photon #header-bar.dialog {\n" +
"  background-color: rgba(221,221,221,0.98);\n" +
"}\n" +
":root.photon:not(.fixed) #header-bar, :root.photon #notifications {\n" +
"  font-size: 9pt;\n" +
"}\n" +
":root.photon #header-bar, :root.photon #notifications {\n" +
"  color: #333;\n" +
"}\n" +
":root.photon #header-bar a, :root.photon #notifications a {\n" +
"  color: #FF6600;\n" +
"}\n" +
"/* Settings */\n" +
":root.photon #fourchanx-settings fieldset, :root.photon .section-main div::before {\n" +
"  border-color: #CCC;\n" +
"}\n" +
":root.photon .suboption-list > div:last-of-type {\n" +
"  background-color: #DDD;\n" +
"}\n" +
"/* Catalog */\n" +
":root.photon .catalog-code {\n" +
"  background-color: rgba(150, 150, 150, 0.2);\n" +
"}\n" +
"/* Quote */\n" +
":root.photon #arc-list tr:nth-of-type(odd) span.quote {\n" +
"  color: #C0E17A;\n" +
"}\n" +
":root.photon .backlink.deadlink {\n" +
"  color: #F60 !important;\n" +
"}\n" +
":root.photon .inline {\n" +
"  border-color: #CCC;\n" +
"  background-color: rgba(255, 255, 255, .14);\n" +
"}\n" +
"/* Fappe and Werk Tyme */\n" +
":root.photon .indicator {\n" +
"  color: #DDD;\n" +
"}\n" +
"/* QR */\n" +
".photon #dump-list::-webkit-scrollbar-thumb {\n" +
"  background-color: #DDD;\n" +
"  border-color: #CCC;\n" +
"}\n" +
":root.photon .qr-preview {\n" +
"  background-color: rgba(0, 0, 0, .15);\n" +
"}\n" +
":root.photon .qr-link {\n" +
"  border-color: rgb(206, 206, 206) rgb(206, 206, 206) rgb(191, 191, 191);\n" +
"  background: linear-gradient(#ECECEC, #DDD) repeat scroll 0% 0% transparent;\n" +
"}\n" +
":root.photon .qr-link:hover {\n" +
"  background: #DDDDDD;\n" +
"}\n" +
"/* Menu */\n" +
":root.photon #menu {\n" +
"  color: #333;\n" +
"}\n" +
":root.photon .entry {\n" +
"  font-size: 10pt;\n" +
"}\n" +
":root.photon .focused.entry {\n" +
"  background: rgba(255, 255, 255, .33);\n" +
"}\n" +
"/* Thread Watcher */\n" +
":root.photon .replies-quoting-you > a, :root.photon #watcher-link.disabled.replies-quoting-you {\n" +
"  color: #00F !important;\n" +
"}\n" +
"/* Watcher Favicon */\n" +
":root.photon .watch-thread-link\n" +
"{\n" +
"  background-image: url(\"data:image/svg+xml,<svg viewBox='0 0 26 26' preserveAspectRatio='true' xmlns='http://www.w3.org/2000/svg'><path fill='rgb(51,51,51)' d='M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z'/></svg>\");\n" +
"}\n" +
"/* Link Title Favicons */\n" +
".linkify.audio {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAitJREFUOE9jYCAWKJWwavr0KyXWb/FIbDtUFFyzJx6nVofE2Xo5nXsj0rqPNSR0nVkR2Hjmgmfd+U9Otdf+m5Vf/6+SfeU/R9ChVVgNYDRtlfJuuPA/rPfe/4QpD/6nznj0P27Kw/9unff/69Xf+69c/+C/SO7N/0z+OAxgMmmRCe++/r9i3ev/KWvf/vdY8PK/bt/9/wrNV3/IN5y/IVt1YqNg4pGTTP4HsbuA2bhZ2qvpyn+xjIObxAp3VwqlrgngLFyryVy5nhPmZJHANS2cwYexG8BmVC/pWn3hP4NZlzWuQDJI3dIiFnUUuwEsQAOcq87jNcC7fHeLUtJxHF4AGmBWeAavAWH1+1rUUk7giAWjOknllON4DXAs2NEiG4/DBQxAF/CFHfrPYI4jDFSLuJVjNrUJhB/B7gIGo1pJRt99GAZYJK7wLJ1z7Xzl4vu/7aqv/GRBj0bjqAX2qb0nJ7mXH17C4HcUxQA+hymWtSue/C5a9up/9Ozn/7Vr7v1nRY7GqMb91T3b3v6vWvPmf/S0p/9ZQk+DDLCBRSOz06Jqk+o7/21nvfqvsebDf7kZL/5zBaxphkezd+OFn7HzXvz3Wvjmv9a8N//5Ek//ZTBpVYUrMG2X5wjcdl68+uI/wa5Lr3hSNjczGFeywOVZ/bbcVGp//F9izfv/Ql03f3P4LC/HSEQquYwMFnUCDJ7dzBhyjGZNQpye89M5gpfnMvtNUyE2h4PUAQBovvT7lyNljwAAAABJRU5ErkJggg==') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.clyp {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAwUExURTSY22ey5E2l4KbS75rM7Y3F64C/6f///8zl9nS45r/f9PL5/UGe3bPY8Vqr4v///wNjrzUAAAABYktHRA8YugDZAAAAB3RJTUUH4AINEi85AIH95AAAAE9JREFUCNdjYMAGGBWgDGYHCM2a3hkAZmi0dzSBaKaO9o5moCqmLiCjYzNQyw4QowIodQzI6E0AKcpo72gE6+Jyb1kAMehUA9RktgdYbQYAjGIVNGGXBJkAAAAASUVORK5CYII=') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.dailymotion {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURQBk3ff6/trp+kKO5wZt3xx54q7P9Ozz/IS17zOG5WKh653E8sbc9/GbbcoAAABZSURBVAjXY2BAASyhDhAGc9oECMOjyAAiESEEYrBYpLWBGcwHxcvBjDDxHelghpF0yDQwY3kVgweEUeEQDWbMEepqAjO8FMsLIeYsU8o+BrbCdWboTAe4AwALXxWGjW41FwAAAABJRU5ErkJggg==') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.gfycat {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAjVBMVEWn3gCo3gSr3w2t4BSu4Bav4Ri35C+45DK45DO55DXA50rA50vB50zC6E/D6FTF6VjG6VvL62vN7G/P7XbQ7XfW74vY8JDa8ZTe8qDe8qLf86Pi9Kzj9K7k9LHp9sDp98Lq98Ps+Mr0++L5/O75/fD6/fH6/fL6/fP7/fT7/fb8/ff8/vj8/vn+/v7///91X4cfAAAAcklEQVR42o3M2xKBUACF4aVQckrIuRJK6H//x2sme4/MuPDfre9i6c/Cc3U5Dj87BuAxsXvGu6JvIIXEHRWwNHCHQNrCzkAFkbSBg4EM8i+Yw7PXBa3zRfuxVyf/Bis7nKwGKAcWxgC8prI5Sc315OlnDfzpDar2S9/oAAAAAElFTkSuQmCC') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.gist {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABblBMVEXc3NykpKTW1tbb29ugoKCdnZ0AAAACAgIEDRcKCgoMDAwODg4QIzYRDAoTExMUDwwVAg0WICsaEw8aGhoiCBklGxUmERwwKCQ7LSU7Ozs8LSZFLyNINi1JNyxJNy1KSklMOi5VR1FXV1daQTRkZGRseYZwU0F4eHh7dnR8bWV/YE6IdGiKcGCKkJaNgYeNjY2RdGOScWCUcWCZmZmhoaGkpKSoqKirfmaurq6xsbG1tbW6urq+vr7AbmzBb23CwsLGxsbHx8fHyMjJycnJysrMzMzOiYbPi4fQ0NDRoYbT09PU1NTW1tbY2NjZqIzZ2dnb29vd3d3f39/i4uLktZrk5OTl5eXm5ubn5+fo6Ojq6urs7OzttKLu7u7wuqbw8PDx8fHz8/P4+Pj5+fn7uZj8vpz9ya79ybD/tZf/upr/wZ//w6H/xKH/xaL/xrH/yqj/y7T/zqv/z7D/07D/17n/2Lv/2Lz/3L//38n/4Mk3Q/ZuAAAABnRSTlMSFcbGzc5MNKFvAAAA1klEQVQoz2NgYPZHAswMDEwRSclwkBTBxOARn4gE4j0YXBOiJNUDg7y8Ar1UlOITXBkcY73Z2Li42dg42dn4wmIdGeyjQ7nZoEA4PNqewSZKlw0O9KJsGKwjBdl4ZeWkJGQUhNjEIq0ZrMI5+D0ri7Jz8itCRAXCrRgsQ3mUy+xicrPSbfO0REItGSyCVaVL3ONSU9LcCtQUgy0YzIJ85M1LizMzCsv9xF2CzBhMAwN99TV1DI0MtDWcAgNNGUycA5CAswkDi5kDwrMOZiwMjKzGSICVEQDhZj0UQV7PewAAAABJRU5ErkJggg==') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.image {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAs5JREFUOE+lk/tvi1EYx98/xT8gW4REIpGFMEQWl2FiM9ZMZhm2xRAyOsmujFFmdFRHu0tWm87UypxStr69zPauN5e5rHVp3IYhbOvHy+wHEQlxkm+ek+d8nm9OznkeSfrfldmgJC7QyUlTymsJTfuTZ25z4HdWYwyLreYhtpgekGPw0+kKvo1Eo+IXRSIiEhkWZuc9tqnsJD9EqTUopCxjSGTpB0iueczSo1HyW8cpsExQ1DbxI2pt45j9cXpexul4FEd79RnZphAa/SD7WvuFtO6UItbU9LC+YQxNI2w0wwYT5LRAdhOU3oBTIXC9gXP3oUSGgz2vST3gYHejR0jptT1C332f8yrUEYHrz8CgxDnpm6DKCUfc0KnmXa/AEVPPwnDcD0cvetA2uYRk67Ive/lpjO7YBO1PPuF8Df3vwf4cbNE4tqdw7YVq8HYyHx6FvhE1hkMEg8HDUqvFkjT4aIjMqkqyqkswDSrcfBfH+Q561YLAZ/B+BLda6FXlU/cPv0AoEPhuoP1h4Av7Wbh9E/Py15NWWUjeSR3nZDfeN+N0DY9hG/7K1eGP3P0S5/EYRFUF/IOTBrUXHPm9fT6mr1xEwupkZqxbzLyiDJYUZ5NSnkdqdSHpxyrYdFpPgdmAsdfJwPMI/Yr65bf7tZLGGBQ7DNdJWFtIYvoOZmbuZE7OXpIKKli86zAr9p9gTVktWTVnKTI2U95uRWe3U2IJUDbVB5p6hVm5x5m9Vc/cnedZUNzC8lILaQesZBy6hEZ3maKzgvJWFzVWD9XtXvVGQbSWASFtMATVRlJIKbOTWtlJXaeXepuPM1f6MNp9GLt8mLvvYLmp0OhQ2Fwvk6m7xaqDTvY0eYWUVtcnllXfYlGpnfklVuraHHg8HjxuN+6fktUHlWWZPaZeUo/ILK0UKttBcbNbSB9GP0yLxWJJUxoZGUn80zD9C/vXQ/4NHY10h3M1zmQAAAAASUVORK5CYII=') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.installgentoo {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABcVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3dIYAAAAAAAAAAAAbGh4BBAcCBgoBBgoCBwsCCQ/QzucCCA7MyuXZ1eUBBQmTh8fo5/i9svIAAADh3vQAAAACCA0CCQ8CCQ4DDBQbGCUDChDr6vgAAAAAAAAREBIDCxK6tdfe2fTv7/cDCxIDDBQEDRUHDhgMJjXk4PZdXWdLUFoUNEYOKDgSMUMRLUBneI4eTGj08/QmW3onW3rTzvfOx/giU3IiVHMkWHdEaYJobHv3+PokWHpua6TNy9xZgZ+1quz8/foQKj0XPFInWn0nW38tZ4o6fqg8gq48grA9hrU/i7pAhrNAiLdBjLtEjr1FksNIjr5Il8pImMtKWnNqhL97odKFqti5q/q5rPq60+nCt/vLw/vPx/jV0vHY0/rc1/rg2/vh3fzn4fzu6/vx8vf19Pv19Pz49/v5+Pv8/Pv8/fr9/vv+/frziVtUAAAAT3RSTlMABQYHCAoNDhARGRobL0ZOV1xdXV5fYGBmZnB0eX2MjZSaoaGio6mqqqustLq7zubo6Ojo6evt7u/x8fLy9/f4+Pj5+vr6+vr6+/39/v7+XKgUSwAAAMhJREFUKM9jYGDg4OZmZgABKINT1dBAhBHIYFMxMBIDisjbhoZbCTExsCu5hoeY8DEwcOkEx8fY6MqpucTGB0izglVEplcU5/gmRYWBVQDNMK+s0hN3SvMyBpsBNJxXw0NfwTEjVQZqHQMHj5RfWW5mliSEC7TPzK6yJD/bXZQRzGdXcisqLy309okA2Q4Eis4peQWmstqBCdGW/CABraC45ERBBs3A6Fh/AbAKTwsHa34QZW8NVsGuLqwswQSjQICTmYMFQaEDAAF8JHLfKGswAAAAAElFTkSuQmCC') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.liveleak {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAlNJREFUGBkFwU2LVmUYAODrPu8Z5x1xSpRBXQyFoLsBE+wfiO5atJOgnf9DUPwFgtGinUgEaQsRhHYuMtpEiEWuG5iNjuOcj+c8z911xXcXL/68c3Dw1fzhg0QgEQAAEYGUKXFie9vxlSs/xk/rdavjGEkmkWSih65z4osv9GfOiK6LzEyZ2uGh4dUrmzs72ddlUUhkoiMr4PT167589Mh6c1N0nSRlqrX67dat+PDyZXRT19m5edPnt28rGFHxMcJ6d9fprS1/37tneP3aemPD1uamUydPOru3p5DdGOH0tWsu3LhhxIQJM2qEpRT/Pn3q/du3AhARSmvGTH0lplKMrVkiYpVpQaJlighzhDkzhmEA0fcWoqAfyaFW4zTlgCABxlrNmY4ylUzLsiREprFWc0T2M+ZSjKWY0AEaltZUjJixZJIpuk5pTWlNP2BYFvOyKJkCAKU1tTXHrZlqVWolUxdhxsfVSj9FmJfFMM9GdICGGa01HyMstYpMIFPJVNDPmYZSTOPoOEKHzNRlKpmWWh1j6TpLa2SKTKVWU6Z+Qolwdm/P9QcPZKa2LH69e9eIMs+WCL/cv2/98CGZPrt61am+V9APq1X89eyZ/968obVYaiXT4dGREgG+vnPHeHgYMsH2+fP+efEihtVKv7SWw/6+9/v7KYLMhIywTJPamvOXLomukyRsrNf+ePzYkpl9dJ3SWgSCSCQCfz5/7pMLF2yfO6eLiAQcHRz4/cmT+HR7O+Ob3d0fNt69+7a2BiICQCJbA0EgE5lpvbXl1OXL3/8Pfax4+6SjSukAAAAASUVORK5CYII=') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.pastebin {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAB1FBMVEUAAAAAAAAAAABWYWwAAABbY3BbYm5dZnFdZXJeZnMEBAQHCAhYYGpdZnFdZnBgaHIlJyomKCooKi09QkdESU5eZGtdYmhdYmleY2lrcXdqb3Rqb3Rqb3SSmJ+SlJeWmJutr7GtrrCWm6ChpKhbW1tmZmZvb290dHR3d3d4eHh5eXl6enp8fHx+gIJ/f3+CgoKDg4OEhISFhYWHh4eKioqKjI2Li4uMjIyOjo6Pj4+QkJCRkZGSkpKUlJSVl5mWlpaYmZqZm52ampqbm5ucnJydnZ2enp6fn5+hoaGioqKkpKSkpaalpaWmp6mmp6qnqauoqKioqquoqq2qqqqrrK2srKysra6srrCsrrGurq6vr6+wsLCxsbGysrKztLa0tLS1t7m2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr7AwMDAwsTBwcHExcfFxcXFxsnGxsbHx8fIyMjJycnMzMzNzc3Ozs7O0NLPz8/Q0NDR0dHR09XT09PV1dXV1dbV1tfV19rW1tbX19fX19jY2tzZ2dnZ2tva2tra3N3a3N7c3Nze3t7f39/f4OHg4ODi4uLl5+jm5ubs7Ozs7e3u7u7v7+/v8PDw8PDx8fHy8vLz8/P29vYSoLMZAAAAJHRSTlMABAUGCwsNHCAiLzMzMzZEYGJwgIuOnJycnqmqq9bc3+/w8fkZ0N/uAAAA/klEQVQoU2NgYGDl5YMDdgYGBmZZ3964CYFtIR3e9Q7K/AwMHI55KfaFmcHWMy3K3MwlGRg4wz0zdYpcorRbNbL0LaWAAp3ts2umV8wo6MupTauQBgqUG03VL7W3sfZSb1erAgm02M+yzYrVCXUy6zapAQlUx/dEdyX3J3ZHVUYVywAF8o2rDNN1Go2jzGLMokAC2QbuSc42mXmaOXop9iAtCXrJ5qXWjT59Abl2ESJAAX/tSIMMiyrrqQ3T6uS5gQK6kSqpqkUermGTexQFmYACflqR+hlWZSamzQpCLEDPsSmVVDT1TJw0JUhOAMRnYOARFRMTE5cQF+ZiBPIAII5B3EVG0b4AAAAASUVORK5CYII=') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.soundcloud {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABsklEQVQ4y5WTy2pUQRCGv2rbzDjJeAlIBmOyipGIIJqFEBDElwh4yULGeRFXPoEIBl/AvQ/gC2RnxCAoxijiwks852S6+3dxzslcHJCpTXVX11/Xv0097gLPgVNMJxnQNfX4zsqleWbnpoMf/oa9d988MM9MC/rp+E0a+A0dsVobMNMCOO8B6McRoABJI+A6gJmN3D2A8jgEBCEkSEMBrcrsDAzDWWn3AjgKFaDMmgRqniGFgsaDp1jrLOngDf1XT1D+A1dFc4MKAkkiCVKjjVu7g9+4Rzx4i1u6hjXbuMWr0O5QPNvCu7IaCZwEKQukLGDrm5x8uI0tr6MkiGlkiv7yLfzN+6S5i6QsIMABkEfcxhbWWYMkVAOjxvYAjc3HNHrbKI9VBQBFwF25XQKSBjqIf1YBuAurEMrczgDygD6/x2LCpFLXLUyQ+PoldphhBhYfIX09XU1+Flaukz7uYqs3SHs7cG4BmTsmkBUF9mmXEwa28BNLPaQPLepuNcbGSWQquQC2/Kdcox1FUGkcB0ykck1nA2+wTzMs8stGnP4rbWGw74EuS/GFQWfK7/wF6P4F7fzIAYkdmdEAAAAASUVORK5CYII=') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.twitchtv {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAYUExURf///2RBpWRBpWRBpWRBpWRBpWRBpf///+zQyUYAAAAGdFJOUwFdZX0lTzs4r5oAAAABYktHRAcWYYjrAAAAB3RJTUUH4AINEi42iSXRNAAAAD1JREFUCNdjYEiDAAZGGIMtjQEEUBlMCWoEGci6mGEMsxQgIy0BiB3AjLS0FAYQIw0kwABipoI1AhkBQBIAFCIXxiHgq80AAAAASUVORK5CYII=') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.twitter {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAEsUExURf///1Cf21Gg3FGi31Gh3VKj4FGh3lKj4VKk4lKl41Ol5FOn51Sp6VSo6FOn5lCf21Gg3FGh3VGi31Gi31Gh3lGg3FGg3FGg3FGg3FGh3lGg3FGi31Kk4lKj4FGh3lGi31Kk4lGh3lGg3FGh3lOm5FOm5VGi31Kj4VSo6FGi31Gh3VGg3FKj4FOn51Gi31So6FWr7VOl5FGi31On51Sq6lKk4lOo51Sp6VOm5FSq61Ws7VOn51Oo51Sq61Ol5FOm5FSq61Wr7VOo51On51Sr7FWs7VSp6lGg3FGh3VOm5FWr7VSp6lKj4VOm5FSo6FSr7FWs7VWs7VWr7VSq6lOo51Om5FOo51So6FOm5VOl5FSq61Ws7VSr7FSp6lSp6VWs7lWr7VKk4lSq6v///6E3MNsAAABVdFJOUwAAAAAAAAAAAAAAAAAAAB0Ii+3xnBVTJhfsMKb+qTEp9GwBF/7lLAbo0m4pLkUTdvk2Ev3+EZnOBo/3Z8ffCRzH/D0OqPxiLnvx3UI8m9n1++GwXQZNS29BAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+ACDRIwBwy67tEAAADKSURBVBjTY2BAB4xogIGRH8IQEBQSFhEVE2eQkJQC8ZmkQ8PCI2Rk5RjkIxUUlRgZlVWioqNjYlXVGNQ14iI1tbR14qLj4+MTdJkZ9PQNosJCE0OjgPz4KEMWBiPjhPiEmKQokIJ4E1MmBmazhHg4MGdlYmCzsLSC8ROsmRkZmFht4Eps7ViADmOzd4DyHZ2YmYACTOzOLmATXd04mIBOd/eQ9owFCXh5c7KB/MLi4+vnHxAYFBzCwcYEEmBi5uLm4eHl42RmAnsSAMZBLgZiFUQ5AAAAAElFTkSuQmCC') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.video {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAxgDGAP8nNqN7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMZBjQQLEEqGwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAA5SURBVDjLY2AYaMDIwMDwn1JD/lPCZhpwL+B1wf///ykzgBhDiAoDfIYQZQAjIyP5BuDTPJqQqAQAvW0ZAMk8+EEAAAAASUVORK5CYII=') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.vimeo {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAAAIdZUKh6sLlLkLmr4LmsAMp88NrdYVW3MZj7Acstkrt9s1e5E7vN5EfI9JvdtKwuBijp5kpbl30eiDt8aG1uqRr7qTyNehxM+k4PCy3enB3OTg6Ovv9PXw+fz////L9U5WAAAAAXRSTlMAQObYZgAAAIFJREFUeNplz90OwiAMBWAQpAoyxclkP3je/y0H2AQXz0WT8100rRD6kNI9/cRroemQL3hXhoujZYj4OHoAmBvYGcBISwbWBvfXCrytnIDUQMkbsBpagMA7zhtQdyTFQAmIG7IkYniiZuh3XGsPqoOZkMOJOpAcLqUzNFGGu/57fwc1hgtp0mVSyQAAAABJRU5ErkJggg==') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.vine {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAHCUExURQAAAAC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+jwC+j////54tRLAAAACUdFJOUwAAAEK+9/e+QQIDAwEqzskfUZmUNHz2mrT++V1w+f5tCanNFUDwfEjtjAyyvg027Hki27QMBJzaHE/1+FkNsN0iZvv6bxyAlB589lQeyud0KB8PQO+ZBUrc+eXgcRG/3CoATe316Wxw/P6BAgBt+fp4IAwh0d4zM9q7Fm76qi605EMSrvfX/PRtAivF9IAJNMLxhA2KYlJ9AAAAAWJLR0SVCGB6gwAAAAd0SU1FB+ACDRI2MOJd7FgAAADrSURBVBjTLY9VWwJgGEPfiYWBha2YYHcHditgd3d3odjdivvBfgK727nYsyPiCrw03j6+fv6AaAMCgyAI1lElJBQSFh6hBxDJqOiY2Lh4SEKiIQlITmFqWrqRJkhGJrOA7Bzm5uUXsBBSVMySUpSVs6KyqrqmFmKuY30D0NjU3NLa1t6h9jvZ1Q30WGi19fb1KzAwyKFhYGSUY+MTkwpMTXNmFpibX+Di0rICWFldW9/A5tb2zu7ePtTrg0MeHePklPYzuDRw7uDF5RWvbwC32O0d7x8en55f4DHF6xv5/vHp6f/k6/vH+evuf1LAObptvSvrAAAAAElFTkSuQmCC') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.vocaroo {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAw9JREFUOE9jYMABuMwYmCyTJKUCGlSnFSy02TTzeOyCiQcDViX26qVz2TAyYtWmEMwuoZ3M7V40LcB79pHkc0svpvzY8jD//87nxf+3Pyn8v/ZO8v+VNyP/2mZJumI1QCWSI8232Hjumitlfw5+qPp/9l8TCt76JP//xkdx/wsXWCzjtWFkwTCkbWFe9plPk/+ga4Txz/xt/D/hkN//gMXif21a+NbyWjIwoRiy6GDT5rP/mlFsPfyp5n/NpOj/22+0gMUXXIz/H7hC/L/bFKFbPDZMrHAD5H35OPt2J9zacDv/f3V7xv9FhwrBGubsT/1//Pjx/1GJ/mD+/nfl/1v3Ovy3KRJNQbHdOlXCvOO03/+pm1P/v3v37n90hhtYw9HPtf8Xb2v937cmHswHeWPRxYj/LvkK3igGKARwicTO07118H3V/5kbi/4vPZMJtK3s/6YH2f+Pfq1B8VbjWrdnMu5s4nAD9CNFhKwz5DTUvLl419zKvAcLtG1P84BRl/b/5M/6/6f/NPzf/qzo84yj0Uus0xUU4Zor54bm9+4OfZG02OCuoAMTb9ZkC9ull1Nvrr2Z+XvRpaRfc65H/68F+jl9svEhzyLFWoccWVc+eyTHq/twydjlKRln7jX9bNMkMJnbhoFRL1xCqmKx6/yi2fYXa/c5/e846PV/5fW0/7OPx/yfcjzop34ulxdGGvDuU8mMXaX507lBuiN6ueadmQeT/p/93vf/1O+G//sP5fw/eL3o/5JLif8zVxs+Tlir9S26UyeFQQvJGBE7FvaFZ9LfN+1y+WjbItSb3GmXvXd15v8zroH/HxgE/D+aGPx/18vi/z07PeZNPRKxe/Kh0Ae8toxscCO4zBkYXArk9C1SxJUYjBkYPPIVtbbuTftz3cz//2O9wP/75iSAXdO72/dt2HL5F6YlfBW4MiJYXMiBiW3t7azHBx+V/t89N+H/8a+1//e9K/9attDp5LQjYX8SuvVL8RoAkmxa65299Erq1FnHo0qrl7t4BddriIs4MrM3rfWcFd+pGwVSAwBZ0bKP8yrZPAAAAABJRU5ErkJggg==') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
".linkify.youtube {\n" +
"  background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAABr5z2BAAABIklEQVQoz53LvUrDUBjG8bOoOammSf1IoBSvoCB4JeIqOHgBLt6AIMRBBQelWurQ2kERnMRBsBUcIp5FJSBI5oQsJVkkUHh8W0o5nhaFHvjBgef/Mq+Q46RJBMkI/vE+aOus956tnEswIZe1LV0QyJ5sE2GzgZfVMtRNIdiDpccEssdlB1mW4bvTwdvWJtRdErM7U+8S/FJykCRJX5qm+KpVce8UMNLRLbulz4iSjTAMh6Iowsd5BeNadp3nUF0VlxAEwZBotXC0Usa4ll3meZdA1iguwvf9vpvDA2wvmKgYGtSud8suDB4TyGr2PF49D/vra9jRZ1BVdknMzgwuCGSnZEObwu6sBnVTCHZiaC7BhFx2PKdxUidiAH/4lLo9Mv0DELVs9qsOHXwAAAAASUVORK5CYII=') center left no-repeat!important;\n" +
"  padding-left: 18px;\n" +
"}\n" +
"/* XXX Moved to end of stylesheet to avoid breaking whole stylesheet in Maxthon. */\n" +
"@supports (text-decoration-style: dashed) or (-moz-text-decoration-style: dashed) {\n" +
"  .quotelink.forwardlink,\n" +
"  .backlink.forwardlink {\n" +
"    text-decoration: underline;\n" +
"    -moz-text-decoration-style: dashed;\n" +
"    text-decoration-style: dashed;\n" +
"    border-bottom: none;\n" +
"  }\n" +
"}\n",

report:
"#g-recaptcha,\n" +
":root:not(.js-enabled) #captchaContainerAlt {\n" +
"  height: auto;\n" +
"}\n" +
"#captchaContainerAlt td:nth-child(2) {\n" +
"  display: table-cell !important;\n" +
"}\n",

www:
"#captcha-cnt {\n" +
"  height: auto;\n" +
"}\n"

};

$ = (function() {
  var $,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return root.querySelector(selector);
  };

  $.DAY = 24 * ($.HOUR = 60 * ($.MINUTE = 60 * ($.SECOND = 1000)));

  $.id = function(id) {
    return d.getElementById(id);
  };

  $.ready = function(fc) {
    var cb;
    if (d.readyState !== 'loading') {
      $.queueTask(fc);
      return;
    }
    cb = function() {
      $.off(d, 'DOMContentLoaded', cb);
      return fc();
    };
    return $.on(d, 'DOMContentLoaded', cb);
  };

  $.formData = function(form) {
    var fd, key, val;
    if (form instanceof HTMLFormElement) {
      return new FormData(form);
    }
    fd = new FormData();
    for (key in form) {
      val = form[key];
      if (val) {
        if (typeof val === 'object' && 'newName' in val) {
          fd.append(key, val, val.newName);
        } else {
          fd.append(key, val);
        }
      }
    }
    return fd;
  };

  $.extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
  };

  $.ajax = (function() {
    var lastModified;
    lastModified = {};
    return function(url, options, extra) {
      var err, event, form, i, len, r, ref, ref1, type, upCallbacks, whenModified;
      if (options == null) {
        options = {};
      }
      if (extra == null) {
        extra = {};
      }
      type = extra.type, whenModified = extra.whenModified, upCallbacks = extra.upCallbacks, form = extra.form;
      url = url.replace(/^((?:https?:)?\/\/(?:\w+\.)?4c(?:ha|d)n\.org)\/adv\//, '$1//adv/');
      r = new XMLHttpRequest();
      type || (type = form && 'post' || 'get');
      try {
        r.open(type, url, true);
        if (whenModified) {
          if (((ref = lastModified[whenModified]) != null ? ref[url] : void 0) != null) {
            r.setRequestHeader('If-Modified-Since', lastModified[whenModified][url]);
          }
          $.on(r, 'load', function() {
            return (lastModified[whenModified] || (lastModified[whenModified] = {}))[url] = r.getResponseHeader('Last-Modified');
          });
        }
        if (/\.json$/.test(url)) {
          if (options.responseType == null) {
            options.responseType = 'json';
          }
        }
        $.extend(r, options);
        if (options.responseType === 'json' && r.responseType !== 'json' && delete r.response) {
          Object.defineProperty(r, 'response', {
            configurable: true,
            enumerable: true,
            get: function() {
              return JSON.parse(r.responseText);
            }
          });
        }
        $.extend(r.upload, upCallbacks);
        $.on(r, 'error', function() {
          if (!r.status) {
            return c.error("4chan X failed to load: " + url);
          }
        });
        r.send(form);
      } catch (_error) {
        err = _error;
        if (err.result !== 0x805e0006) {
          throw err;
        }
        ref1 = ['error', 'loadend'];
        for (i = 0, len = ref1.length; i < len; i++) {
          event = ref1[i];
          r["on" + event] = options["on" + event];
          $.queueTask($.event, event, null, r);
        }
      }
      return r;
    };
  })();

  (function() {
    var reqs;
    reqs = {};
    $.cache = function(url, cb, options) {
      var err, req, rm;
      if (req = reqs[url]) {
        if (req.readyState === 4) {
          $.queueTask(function() {
            return cb.call(req, req.evt, true);
          });
        } else {
          req.callbacks.push(cb);
        }
        return req;
      }
      rm = function() {
        return delete reqs[url];
      };
      try {
        if (!(req = $.ajax(url, options))) {
          return;
        }
      } catch (_error) {
        err = _error;
        return;
      }
      $.on(req, 'load', function(e) {
        var fn1, i, len, ref;
        this.evt = e;
        ref = this.callbacks;
        fn1 = (function(_this) {
          return function(cb) {
            return $.queueTask(function() {
              return cb.call(_this, e, false);
            });
          };
        })(this);
        for (i = 0, len = ref.length; i < len; i++) {
          cb = ref[i];
          fn1(cb);
        }
        return delete this.callbacks;
      });
      $.on(req, 'abort error', rm);
      req.callbacks = [cb];
      return reqs[url] = req;
    };
    return $.cleanCache = function(testf) {
      var url;
      for (url in reqs) {
        if (testf(url)) {
          delete reqs[url];
        }
      }
    };
  })();

  $.cb = {
    checked: function() {
      $.set(this.name, this.checked);
      return Conf[this.name] = this.checked;
    },
    value: function() {
      $.set(this.name, this.value.trim());
      return Conf[this.name] = this.value;
    }
  };

  $.asap = function(test, cb) {
    if (test()) {
      return cb();
    } else {
      return setTimeout($.asap, 25, test, cb);
    }
  };

  $.onExists = function(root, selector, cb) {
    var el, observer;
    if (el = $(selector, root)) {
      return cb(el);
    }
    if ($.engine === 'edge' && d.readyState === 'loading') {
      $.asap((function() {
        return d.readyState !== 'loading' || $(selector, root);
      }), function() {
        return $.onExists(root, selector, cb);
      });
      return;
    }
    observer = new MutationObserver(function() {
      if (el = $(selector, root)) {
        observer.disconnect();
        return cb(el);
      }
    });
    return observer.observe(root, {
      childList: true,
      subtree: true
    });
  };

  $.addStyle = function(css, id, test) {
    var style;
    if (test == null) {
      test = 'head';
    }
    style = $.el('style', {
      textContent: css
    });
    if (id != null) {
      style.id = id;
    }
    $.onExists(doc, test, function() {
      return $.add(d.head, style);
    });
    return style;
  };

  $.addCSP = function(policy) {
    var head, meta;
    meta = $.el('meta', {
      httpEquiv: 'Content-Security-Policy',
      content: policy
    });
    if (d.head) {
      $.add(d.head, meta);
      return $.rm(meta);
    } else {
      head = $.add(doc || d, $.el('head'));
      $.add(head, meta);
      return $.rm(head);
    }
  };

  $.x = function(path, root) {
    root || (root = d.body);
    return d.evaluate(path, root, null, 8, null).singleNodeValue;
  };

  $.X = function(path, root) {
    root || (root = d.body);
    return d.evaluate(path, root, null, 7, null);
  };

  $.addClass = function() {
    var className, classNames, el, i, len;
    el = arguments[0], classNames = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (i = 0, len = classNames.length; i < len; i++) {
      className = classNames[i];
      el.classList.add(className);
    }
  };

  $.rmClass = function() {
    var className, classNames, el, i, len;
    el = arguments[0], classNames = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (i = 0, len = classNames.length; i < len; i++) {
      className = classNames[i];
      el.classList.remove(className);
    }
  };

  $.toggleClass = function(el, className) {
    return el.classList.toggle(className);
  };

  $.hasClass = function(el, className) {
    return indexOf.call(el.classList, className) >= 0;
  };

  $.rm = function(el) {
    return el != null ? el.remove() : void 0;
  };

  $.rmAll = function(root) {
    return root.textContent = null;
  };

  $.tn = function(s) {
    return d.createTextNode(s);
  };

  $.frag = function() {
    return d.createDocumentFragment();
  };

  $.nodes = function(nodes) {
    var frag, i, len, node;
    if (!(nodes instanceof Array)) {
      return nodes;
    }
    frag = $.frag();
    for (i = 0, len = nodes.length; i < len; i++) {
      node = nodes[i];
      frag.appendChild(node);
    }
    return frag;
  };

  $.add = function(parent, el) {
    return parent.appendChild($.nodes(el));
  };

  $.prepend = function(parent, el) {
    return parent.insertBefore($.nodes(el), parent.firstChild);
  };

  $.after = function(root, el) {
    return root.parentNode.insertBefore($.nodes(el), root.nextSibling);
  };

  $.before = function(root, el) {
    return root.parentNode.insertBefore($.nodes(el), root);
  };

  $.replace = function(root, el) {
    return root.parentNode.replaceChild($.nodes(el), root);
  };

  $.el = function(tag, properties, properties2) {
    var el;
    el = d.createElement(tag);
    if (properties) {
      $.extend(el, properties);
    }
    if (properties2) {
      $.extend(el, properties2);
    }
    return el;
  };

  $.on = function(el, events, handler) {
    var event, i, len, ref;
    ref = events.split(' ');
    for (i = 0, len = ref.length; i < len; i++) {
      event = ref[i];
      el.addEventListener(event, handler, false);
    }
  };

  $.off = function(el, events, handler) {
    var event, i, len, ref;
    ref = events.split(' ');
    for (i = 0, len = ref.length; i < len; i++) {
      event = ref[i];
      el.removeEventListener(event, handler, false);
    }
  };

  $.one = function(el, events, handler) {
    var cb;
    cb = function(e) {
      $.off(el, events, cb);
      return handler.call(this, e);
    };
    return $.on(el, events, cb);
  };

  $.event = function(event, detail, root) {
    if (root == null) {
      root = d;
    }
    if ((detail != null) && typeof cloneInto === 'function') {
      detail = cloneInto(detail, d.defaultView);
    }
    return root.dispatchEvent(new CustomEvent(event, {
      bubbles: true,
      detail: detail
    }));
  };

  (function() {
    var clone, err, ref, unsafeConstructors;
    if (!(/PaleMoon\//.test(navigator.userAgent) && +(typeof GM_info !== "undefined" && GM_info !== null ? (ref = GM_info.version) != null ? ref.split('.')[0] : void 0 : void 0) >= 2 && typeof cloneInto === 'undefined')) {
      return;
    }
    try {
      return new CustomEvent('x', {
        detail: {}
      });
    } catch (_error) {
      err = _error;
      unsafeConstructors = {
        Object: unsafeWindow.Object,
        Array: unsafeWindow.Array
      };
      clone = function(obj) {
        var constructor, key, obj2, val;
        if ((obj != null) && typeof obj === 'object' && (constructor = unsafeConstructors[obj.constructor.name])) {
          obj2 = new constructor();
          for (key in obj) {
            val = obj[key];
            obj2[key] = clone(val);
          }
          return obj2;
        } else {
          return obj;
        }
      };
      return $.event = function(event, detail, root) {
        if (root == null) {
          root = d;
        }
        return root.dispatchEvent(new CustomEvent(event, {
          bubbles: true,
          detail: clone(detail)
        }));
      };
    }
  })();

  $.open = typeof GM_openInTab !== "undefined" && GM_openInTab !== null ? GM_openInTab : function(url) {
    return window.open(url, '_blank');
  };

  $.debounce = function(wait, fn) {
    var args, exec, lastCall, that, timeout;
    lastCall = 0;
    timeout = null;
    that = null;
    args = null;
    exec = function() {
      lastCall = Date.now();
      return fn.apply(that, args);
    };
    return function() {
      args = arguments;
      that = this;
      if (lastCall < Date.now() - wait) {
        return exec();
      }
      clearTimeout(timeout);
      return timeout = setTimeout(exec, wait);
    };
  };

  $.queueTask = (function() {
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
  })();

  $.globalEval = function(code, data) {
    var script;
    script = $.el('script', {
      textContent: code
    });
    if (data) {
      $.extend(script.dataset, data);
    }
    $.add(d.head || doc, script);
    return $.rm(script);
  };

  $.global = function(fn, data) {
    if (doc) {
      return $.globalEval("(" + fn + ")();", data);
    } else {
      return fn();
    }
  };

  $.bytesToString = function(size) {
    var unit;
    unit = 0;
    while (size >= 1024) {
      size /= 1024;
      unit++;
    }
    size = unit > 1 ? Math.round(size * 100) / 100 : Math.round(size);
    return size + " " + ['B', 'KB', 'MB', 'GB'][unit];
  };

  $.minmax = function(value, min, max) {
    return (value < min ? min : value > max ? max : value);
  };

  $.hasAudio = function(video) {
    return video.mozHasAudio || !!video.webkitAudioDecodedByteCount;
  };

  $.engine = (function() {
    if (/Edge\//.test(navigator.userAgent)) {
      return 'edge';
    }
    if (/Chrome\//.test(navigator.userAgent)) {
      return 'blink';
    }
    if (/WebKit\//.test(navigator.userAgent)) {
      return 'webkit';
    }
    if (/Gecko\/|Goanna/.test(navigator.userAgent)) {
      return 'gecko';
    }
  })();

  $.platform = 'userscript';

  try {
    localStorage.getItem('x');
    $.hasStorage = true;
  } catch (_error) {
    $.hasStorage = false;
  }

  $.item = function(key, val) {
    var item;
    item = {};
    item[key] = val;
    return item;
  };

  $.syncing = {};

  if (typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null) {
    $.getValue = GM_getValue;
    $.listValues = function() {
      return GM_listValues();
    };
  } else if ($.hasStorage) {
    $.getValue = function(key) {
      return localStorage[key];
    };
    $.listValues = function() {
      var key, results;
      results = [];
      for (key in localStorage) {
        if (key.slice(0, g.NAMESPACE.length) === g.NAMESPACE) {
          results.push(key);
        }
      }
      return results;
    };
  } else {
    $.getValue = function() {};
    $.listValues = function() {
      return [];
    };
  }

  if (typeof GM_addValueChangeListener !== "undefined" && GM_addValueChangeListener !== null) {
    $.setValue = GM_setValue;
    $.deleteValue = GM_deleteValue;
  } else if (typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null) {
    $.oldValue = {};
    $.setValue = function(key, val) {
      GM_setValue(key, val);
      if (key in $.syncing) {
        $.oldValue[key] = val;
        if ($.hasStorage) {
          return localStorage[key] = val;
        }
      }
    };
    $.deleteValue = function(key) {
      GM_deleteValue(key);
      if (key in $.syncing) {
        delete $.oldValue[key];
        if ($.hasStorage) {
          return localStorage.removeItem(key);
        }
      }
    };
    if (!$.hasStorage) {
      $.cantSync = true;
    }
  } else if ($.hasStorage) {
    $.oldValue = {};
    $.setValue = function(key, val) {
      if (key in $.syncing) {
        $.oldValue[key] = val;
      }
      return localStorage[key] = val;
    };
    $.deleteValue = function(key) {
      if (key in $.syncing) {
        delete $.oldValue[key];
      }
      return localStorage.removeItem(key);
    };
  } else {
    $.setValue = function() {};
    $.deleteValue = function() {};
    $.cantSync = $.cantSet = true;
  }

  if (typeof GM_addValueChangeListener !== "undefined" && GM_addValueChangeListener !== null) {
    $.sync = function(key, cb) {
      return $.syncing[key] = GM_addValueChangeListener(g.NAMESPACE + key, function(key2, oldValue, newValue, remote) {
        if (remote) {
          if (newValue !== void 0) {
            newValue = JSON.parse(newValue);
          }
          return cb(newValue, key);
        }
      });
    };
    $.forceSync = function() {};
  } else if ((typeof GM_deleteValue !== "undefined" && GM_deleteValue !== null) || $.hasStorage) {
    $.sync = function(key, cb) {
      key = g.NAMESPACE + key;
      $.syncing[key] = cb;
      return $.oldValue[key] = $.getValue(key);
    };
    (function() {
      var onChange;
      onChange = function(arg) {
        var cb, key, newValue;
        key = arg.key, newValue = arg.newValue;
        if (!(cb = $.syncing[key])) {
          return;
        }
        if (newValue != null) {
          if (newValue === $.oldValue[key]) {
            return;
          }
          $.oldValue[key] = newValue;
          return cb(JSON.parse(newValue), key.slice(g.NAMESPACE.length));
        } else {
          if ($.oldValue[key] == null) {
            return;
          }
          delete $.oldValue[key];
          return cb(void 0, key.slice(g.NAMESPACE.length));
        }
      };
      $.on(window, 'storage', onChange);
      return $.forceSync = function(key) {
        key = g.NAMESPACE + key;
        return onChange({
          key: key,
          newValue: $.getValue(key)
        });
      };
    })();
  } else {
    $.sync = function() {};
    $.forceSync = function() {};
  }

  $["delete"] = function(keys) {
    var i, key, len;
    if (!(keys instanceof Array)) {
      keys = [keys];
    }
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      $.deleteValue(g.NAMESPACE + key);
    }
  };

  $.get = function(key, val, cb) {
    var items;
    if (typeof cb === 'function') {
      items = $.item(key, val);
    } else {
      items = key;
      cb = val;
    }
    return $.queueTask(function() {
      for (key in items) {
        if (val = $.getValue(g.NAMESPACE + key)) {
          items[key] = JSON.parse(val);
        }
      }
      return cb(items);
    });
  };

  $.set = function(keys, val, cb) {
    var key, value;
    if (typeof keys === 'string') {
      $.setValue(g.NAMESPACE + keys, JSON.stringify(val));
    } else {
      for (key in keys) {
        value = keys[key];
        $.setValue(g.NAMESPACE + key, JSON.stringify(value));
      }
      cb = val;
    }
    return typeof cb === "function" ? cb() : void 0;
  };

  $.clear = function(cb) {
    var id;
    $["delete"](Object.keys(Conf));
    $["delete"](['previousversion', 'AutoWatch', 'QR Size', 'captchas', 'QR.persona', 'hiddenPSA']);
    $["delete"]((function() {
      var i, len, ref, results;
      ref = ['embedding', 'updater', 'thread-stats', 'thread-watcher', 'qr'];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        id = ref[i];
        results.push(id + ".position");
      }
      return results;
    })());
    try {
      $["delete"]($.listValues().map(function(key) {
        return key.replace(g.NAMESPACE, '');
      }));
    } catch (_error) {}
    return typeof cb === "function" ? cb() : void 0;
  };

  return $;

}).call(this);

$$ = (function() {
  var slice = [].slice;

  return function(selector, root) {
    if (root == null) {
      root = d.body;
    }
    return slice.call(root.querySelectorAll(selector));
  };

}).call(this);

CrossOrigin = (function() {
  var CrossOrigin;

  CrossOrigin = {
    binary: function(url, cb, headers) {
      var options, ref, workaround;
      if (headers == null) {
        headers = {};
      }
      url = url.replace(/^((?:https?:)?\/\/(?:\w+\.)?4c(?:ha|d)n\.org)\/adv\//, '$1//adv/');
      workaround = $.engine === 'gecko' && (typeof GM_info !== "undefined" && GM_info !== null) && /^[0-2]\.|^3\.[01](?!\d)/.test(GM_info.version);
      workaround || (workaround = /PaleMoon\//.test(navigator.userAgent));
      workaround || (workaround = (typeof GM_info !== "undefined" && GM_info !== null ? (ref = GM_info.script) != null ? ref.includeJSB : void 0 : void 0) != null);
      options = {
        method: "GET",
        url: url,
        headers: headers,
        onload: function(xhr) {
          var contentDisposition, contentType, data, i, r, ref1, ref2;
          if (workaround) {
            r = xhr.responseText;
            data = new Uint8Array(r.length);
            i = 0;
            while (i < r.length) {
              data[i] = r.charCodeAt(i);
              i++;
            }
          } else {
            data = new Uint8Array(xhr.response);
          }
          if (typeof xhr.responseHeaders === 'object') {
            contentType = xhr.responseHeaders['Content-Type'];
            contentDisposition = xhr.responseHeaders['Content-Disposition'];
          } else {
            contentType = (ref1 = xhr.responseHeaders.match(/Content-Type:\s*(.*)/i)) != null ? ref1[1] : void 0;
            contentDisposition = (ref2 = xhr.responseHeaders.match(/Content-Disposition:\s*(.*)/i)) != null ? ref2[1] : void 0;
          }
          return cb(data, contentType, contentDisposition);
        },
        onerror: function() {
          return cb(null);
        },
        onabort: function() {
          return cb(null);
        }
      };
      if (workaround) {
        options.overrideMimeType = options.mimeType = 'text/plain; charset=x-user-defined';
      } else {
        options.responseType = 'arraybuffer';
      }
      return GM_xmlhttpRequest(options);
    },
    file: function(url, cb) {
      return CrossOrigin.binary(url, function(data, contentType, contentDisposition) {
        var blob, match, mime, name, ref, ref1, ref2, ref3;
        if (data == null) {
          return cb(null);
        }
        name = (ref = url.match(/([^\/]+)\/*$/)) != null ? ref[1] : void 0;
        mime = (contentType != null ? contentType.match(/[^;]*/)[0] : void 0) || 'application/octet-stream';
        match = (contentDisposition != null ? (ref1 = contentDisposition.match(/\bfilename\s*=\s*"((\\"|[^"])+)"/i)) != null ? ref1[1] : void 0 : void 0) || (contentType != null ? (ref2 = contentType.match(/\bname\s*=\s*"((\\"|[^"])+)"/i)) != null ? ref2[1] : void 0 : void 0);
        if (match) {
          name = match.replace(/\\"/g, '"');
        }
        if ((typeof GM_info !== "undefined" && GM_info !== null ? (ref3 = GM_info.script) != null ? ref3.includeJSB : void 0 : void 0) != null) {
          mime = QR.typeFromExtension[name.match(/[^.]*$/)[0].toLowerCase()] || 'application/octet-stream';
        }
        blob = new Blob([data], {
          type: mime
        });
        blob.name = name;
        return cb(blob);
      });
    },
    json: (function() {
      var callbacks, responses;
      callbacks = {};
      responses = {};
      return function(url, cb) {
        if (responses[url]) {
          cb(responses[url]);
          return;
        }
        if (callbacks[url]) {
          callbacks[url].push(cb);
          return;
        }
        callbacks[url] = [cb];
        return GM_xmlhttpRequest({
          method: "GET",
          url: url + '',
          onload: function(xhr) {
            var j, len, ref, response;
            response = JSON.parse(xhr.responseText);
            ref = callbacks[url];
            for (j = 0, len = ref.length; j < len; j++) {
              cb = ref[j];
              cb(response);
            }
            delete callbacks[url];
            return responses[url] = response;
          },
          onerror: function() {
            return delete callbacks[url];
          },
          onabort: function() {
            return delete callbacks[url];
          }
        });
      };
    })()
  };

  return CrossOrigin;

}).call(this);

Board = (function() {
  var Board;

  Board = (function() {
    Board.prototype.toString = function() {
      return this.ID;
    };

    function Board(ID) {
      this.ID = ID;
      this.threads = new SimpleDict();
      this.posts = new SimpleDict();
      g.boards[this] = this;
    }

    return Board;

  })();

  return Board;

}).call(this);

Callbacks = (function() {
  var Callbacks;

  Callbacks = (function() {
    Callbacks.Post = new Callbacks('Post');

    Callbacks.Thread = new Callbacks('Thread');

    Callbacks.CatalogThread = new Callbacks('Catalog Thread');

    function Callbacks(type) {
      this.type = type;
      this.keys = [];
    }

    Callbacks.prototype.push = function(arg) {
      var cb, name;
      name = arg.name, cb = arg.cb;
      if (!this[name]) {
        this.keys.push(name);
      }
      return this[name] = cb;
    };

    Callbacks.prototype.execute = function(node, keys) {
      var err, errors, i, len, name, ref, ref1, ref2;
      if (keys == null) {
        keys = this.keys;
      }
      for (i = 0, len = keys.length; i < len; i++) {
        name = keys[i];
        try {
          if ((ref = this[name]) != null) {
            ref.call(node);
          }
        } catch (_error) {
          err = _error;
          if (!errors) {
            errors = [];
          }
          errors.push({
            message: ['"', name, '" crashed on node ', this.type, ' No.', node.ID, ' (', node.board, ').'].join(''),
            error: err,
            html: (ref1 = node.nodes) != null ? (ref2 = ref1.root) != null ? ref2.outerHTML : void 0 : void 0
          });
        }
      }
      if (errors) {
        return Main.handleErrors(errors);
      }
    };

    return Callbacks;

  })();

  return Callbacks;

}).call(this);

CatalogThread = (function() {
  var CatalogThread;

  CatalogThread = (function() {
    CatalogThread.prototype.toString = function() {
      return this.ID;
    };

    function CatalogThread(root, thread) {
      this.thread = thread;
      this.ID = this.thread.ID;
      this.board = this.thread.board;
      this.nodes = {
        root: root,
        thumb: $('.catalog-thumb', root),
        icons: $('.catalog-icons', root),
        postCount: $('.post-count', root),
        fileCount: $('.file-count', root),
        pageCount: $('.page-count', root),
        comment: $('.comment', root)
      };
      this.thread.catalogView = this;
    }

    return CatalogThread;

  })();

  return CatalogThread;

}).call(this);

Connection = (function() {
  var Connection,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Connection = (function() {
    function Connection(target, origin, cb) {
      this.target = target;
      this.origin = origin;
      this.cb = cb != null ? cb : {};
      this.onMessage = bind(this.onMessage, this);
      this.send = bind(this.send, this);
      $.on(window, 'message', this.onMessage);
    }

    Connection.prototype.targetWindow = function() {
      if (this.target instanceof window.HTMLIFrameElement) {
        return this.target.contentWindow;
      } else {
        return this.target;
      }
    };

    Connection.prototype.send = function(data) {
      return this.targetWindow().postMessage("" + g.NAMESPACE + (JSON.stringify(data)), this.origin);
    };

    Connection.prototype.onMessage = function(e) {
      var base, data, type, value;
      if (!(e.source === this.targetWindow() && e.origin === this.origin && typeof e.data === 'string' && e.data.slice(0, g.NAMESPACE.length) === g.NAMESPACE)) {
        return;
      }
      data = JSON.parse(e.data.slice(g.NAMESPACE.length));
      for (type in data) {
        value = data[type];
        if (typeof (base = this.cb)[type] === "function") {
          base[type](value);
        }
      }
    };

    return Connection;

  })();

  return Connection;

}).call(this);

DataBoard = (function() {
  var DataBoard,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  DataBoard = (function() {
    DataBoard.keys = ['hiddenThreads', 'hiddenPosts', 'lastReadPosts', 'yourPosts', 'watchedThreads', 'customTitles'];

    function DataBoard(key, sync, dontClean) {
      var init;
      this.key = key;
      this.onSync = bind(this.onSync, this);
      this.data = Conf[this.key];
      $.sync(this.key, this.onSync);
      if (!dontClean) {
        this.clean();
      }
      if (!sync) {
        return;
      }
      init = (function(_this) {
        return function() {
          $.off(d, '4chanXInitFinished', init);
          return _this.sync = sync;
        };
      })(this);
      $.on(d, '4chanXInitFinished', init);
    }

    DataBoard.prototype.save = function(cb) {
      return $.set(this.key, this.data, cb);
    };

    DataBoard.prototype["delete"] = function(arg) {
      var boardID, postID, ref, threadID;
      boardID = arg.boardID, threadID = arg.threadID, postID = arg.postID;
      $.forceSync(this.key);
      if (postID) {
        if (!((ref = this.data.boards[boardID]) != null ? ref[threadID] : void 0)) {
          return;
        }
        delete this.data.boards[boardID][threadID][postID];
        this.deleteIfEmpty({
          boardID: boardID,
          threadID: threadID
        });
      } else if (threadID) {
        if (!this.data.boards[boardID]) {
          return;
        }
        delete this.data.boards[boardID][threadID];
        this.deleteIfEmpty({
          boardID: boardID
        });
      } else {
        delete this.data.boards[boardID];
      }
      return this.save();
    };

    DataBoard.prototype.deleteIfEmpty = function(arg) {
      var boardID, threadID;
      boardID = arg.boardID, threadID = arg.threadID;
      $.forceSync(this.key);
      if (threadID) {
        if (!Object.keys(this.data.boards[boardID][threadID]).length) {
          delete this.data.boards[boardID][threadID];
          return this.deleteIfEmpty({
            boardID: boardID
          });
        }
      } else if (!Object.keys(this.data.boards[boardID]).length) {
        return delete this.data.boards[boardID];
      }
    };

    DataBoard.prototype.set = function(arg, cb) {
      var base, base1, base2, boardID, postID, threadID, val;
      boardID = arg.boardID, threadID = arg.threadID, postID = arg.postID, val = arg.val;
      $.forceSync(this.key);
      if (postID !== void 0) {
        ((base = ((base1 = this.data.boards)[boardID] || (base1[boardID] = {})))[threadID] || (base[threadID] = {}))[postID] = val;
      } else if (threadID !== void 0) {
        ((base2 = this.data.boards)[boardID] || (base2[boardID] = {}))[threadID] = val;
      } else {
        this.data.boards[boardID] = val;
      }
      return this.save(cb);
    };

    DataBoard.prototype.get = function(arg) {
      var ID, board, boardID, defaultValue, i, len, postID, thread, threadID, val;
      boardID = arg.boardID, threadID = arg.threadID, postID = arg.postID, defaultValue = arg.defaultValue;
      if (board = this.data.boards[boardID]) {
        if (threadID == null) {
          if (postID != null) {
            for (thread = i = 0, len = board.length; i < len; thread = ++i) {
              ID = board[thread];
              if (postID in thread) {
                val = thread[postID];
                break;
              }
            }
          } else {
            val = board;
          }
        } else if (thread = board[threadID]) {
          val = postID != null ? thread[postID] : thread;
        }
      }
      return val || defaultValue;
    };

    DataBoard.prototype.forceSync = function() {
      return $.forceSync(this.key);
    };

    DataBoard.prototype.clean = function() {
      var boardID, now, ref, val;
      $.forceSync(this.key);
      ref = this.data.boards;
      for (boardID in ref) {
        val = ref[boardID];
        this.deleteIfEmpty({
          boardID: boardID
        });
      }
      now = Date.now();
      if ((this.data.lastChecked || 0) < now - 2 * $.HOUR) {
        this.data.lastChecked = now;
        for (boardID in this.data.boards) {
          this.ajaxClean(boardID);
        }
      }
    };

    DataBoard.prototype.ajaxClean = function(boardID) {
      return $.cache("//a.4cdn.org/" + boardID + "/threads.json", (function(_this) {
        return function(e1) {
          var ref;
          if ((ref = e1.target.status) !== 200 && ref !== 404) {
            return;
          }
          return $.cache("//a.4cdn.org/" + boardID + "/archive.json", function(e2) {
            var ref1;
            if ((ref1 = e2.target.status) !== 200 && ref1 !== 404) {
              return;
            }
            return _this.ajaxCleanParse(boardID, e1.target.response, e2.target.response);
          });
        };
      })(this));
    };

    DataBoard.prototype.ajaxCleanParse = function(boardID, response1, response2) {
      var ID, board, i, j, k, len, len1, len2, page, ref, thread, threads;
      if (!(board = this.data.boards[boardID])) {
        return;
      }
      threads = {};
      if (response1) {
        for (i = 0, len = response1.length; i < len; i++) {
          page = response1[i];
          ref = page.threads;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            thread = ref[j];
            ID = thread.no;
            if (ID in board) {
              threads[ID] = board[ID];
            }
          }
        }
      }
      if (response2) {
        for (k = 0, len2 = response2.length; k < len2; k++) {
          ID = response2[k];
          if (ID in board) {
            threads[ID] = board[ID];
          }
        }
      }
      this.data.boards[boardID] = threads;
      this.deleteIfEmpty({
        boardID: boardID
      });
      return this.save();
    };

    DataBoard.prototype.onSync = function(data) {
      this.data = data || {
        boards: {}
      };
      return typeof this.sync === "function" ? this.sync() : void 0;
    };

    return DataBoard;

  })();

  return DataBoard;

}).call(this);

Fetcher = (function() {
  var Fetcher,
    slice = [].slice;

  Fetcher = (function() {
    function Fetcher(boardID1, threadID, postID1, root, quoter) {
      var post;
      this.boardID = boardID1;
      this.threadID = threadID;
      this.postID = postID1;
      this.root = root;
      this.quoter = quoter;
      if (post = g.posts[this.boardID + "." + this.postID]) {
        this.insert(post);
        return;
      }
      this.root.textContent = "Loading post No." + this.postID + "...";
      if (this.threadID) {
        $.cache("//a.4cdn.org/" + this.boardID + "/thread/" + this.threadID + ".json", (function(_this) {
          return function(e, isCached) {
            return _this.fetchedPost(e.target, isCached);
          };
        })(this));
      } else {
        this.archivedPost();
      }
    }

    Fetcher.prototype.insert = function(post) {
      var boardID, clone, cssVersion, k, len, nodes, postID, quote, ref, ref1, ref2;
      if (!this.root.parentNode) {
        return;
      }
      clone = post.addClone(this.quoter.context, $.hasClass(this.root, 'dialog'));
      Main.callbackNodes('Post', [clone]);
      nodes = clone.nodes;
      $.rmAll(nodes.root);
      $.add(nodes.root, nodes.post);
      ref = clone.nodes.quotelinks.concat(slice.call(clone.nodes.backlinks));
      for (k = 0, len = ref.length; k < len; k++) {
        quote = ref[k];
        ref1 = Get.postDataFromLink(quote), boardID = ref1.boardID, postID = ref1.postID;
        if (postID === this.quoter.ID && boardID === this.quoter.board.ID) {
          $.addClass(quote, 'forwardlink');
        }
      }
      if (clone.nodes.flag && !(Fetcher.flagCSS || (Fetcher.flagCSS = $('link[href^="//s.4cdn.org/css/flags."]')))) {
        cssVersion = ((ref2 = $('link[href^="//s.4cdn.org/css/"]')) != null ? ref2.href.match(/\d+(?=\.css$)|$/)[0] : void 0) || Date.now();
        Fetcher.flagCSS = $.el('link', {
          rel: 'stylesheet',
          href: "//s.4cdn.org/css/flags." + cssVersion + ".css"
        });
        $.add(d.head, Fetcher.flagCSS);
      }
      $.rmAll(this.root);
      $.add(this.root, nodes.root);
      return $.event('PostsInserted');
    };

    Fetcher.prototype.fetchedPost = function(req, isCached) {
      var api, board, k, len, post, posts, status, thread;
      if (post = g.posts[this.boardID + "." + this.postID]) {
        this.insert(post);
        return;
      }
      status = req.status;
      if (status !== 200 && status !== 304) {
        if (this.archivedPost()) {
          return;
        }
        $.addClass(this.root, 'warning');
        this.root.textContent = status === 404 ? "Thread No." + this.threadID + " 404'd." : "Error " + req.statusText + " (" + req.status + ").";
        return;
      }
      posts = req.response.posts;
      Build.spoilerRange[this.boardID] = posts[0].custom_spoiler;
      for (k = 0, len = posts.length; k < len; k++) {
        post = posts[k];
        if (post.no === this.postID) {
          break;
        }
      }
      if (post.no !== this.postID) {
        if (isCached) {
          api = "//a.4cdn.org/" + this.boardID + "/thread/" + this.threadID + ".json";
          $.cleanCache(function(url) {
            return url === api;
          });
          $.cache(api, (function(_this) {
            return function(e) {
              return _this.fetchedPost(e.target, false);
            };
          })(this));
          return;
        }
        if (this.archivedPost()) {
          return;
        }
        $.addClass(this.root, 'warning');
        this.root.textContent = "Post No." + this.postID + " was not found.";
        return;
      }
      board = g.boards[this.boardID] || new Board(this.boardID);
      thread = g.threads[this.boardID + "." + this.threadID] || new Thread(this.threadID, board);
      post = new Post(Build.postFromObject(post, this.boardID), thread, board);
      post.isFetchedQuote = true;
      Main.callbackNodes('Post', [post]);
      return this.insert(post);
    };

    Fetcher.prototype.archivedPost = function() {
      var archive, url;
      if (!Conf['Resurrect Quotes']) {
        return false;
      }
      if (!(url = Redirect.to('post', {
        boardID: this.boardID,
        postID: this.postID
      }))) {
        return false;
      }
      archive = Redirect.data.post[this.boardID];
      if (/^https:\/\//.test(url) || location.protocol === 'http:') {
        $.cache(url, (function(_this) {
          return function(e) {
            return _this.parseArchivedPost(e.target.response, url, archive);
          };
        })(this), {
          responseType: 'json',
          withCredentials: archive.withCredentials
        });
        return true;
      } else if (Conf['Exempt Archives from Encryption']) {
        CrossOrigin.json(url, (function(_this) {
          return function(response) {
            var key, media, ref;
            media = response.media;
            if (media) {
              for (key in media) {
                if (/_link$/.test(key)) {
                  if (!((ref = media[key]) != null ? ref.match(/^http:\/\//) : void 0)) {
                    delete media[key];
                  }
                }
              }
            }
            return _this.parseArchivedPost(response, url, archive);
          };
        })(this));
        return true;
      }
      return false;
    };

    Fetcher.prototype.parseArchivedPost = function(data, url, archive) {
      var board, comment, greentext, i, j, key, o, post, ref, ref1, tag, text, text2, thread, val;
      if (post = g.posts[this.boardID + "." + this.postID]) {
        this.insert(post);
        return;
      }
      if (data == null) {
        $.addClass(this.root, 'warning');
        this.root.textContent = "Error fetching Post No." + this.postID + " from " + archive.name + ".";
        return;
      }
      if (data.error) {
        $.addClass(this.root, 'warning');
        this.root.textContent = data.error;
        return;
      }
      comment = (data.comment || '').split(/(\n|\[\/?(?:b|spoiler|code|moot|banned|fortune(?: color="#\w+")?|i|red|green|blue)\])/);
      comment = (function() {
        var k, len, results;
        results = [];
        for (i = k = 0, len = comment.length; k < len; i = ++k) {
          text = comment[i];
          if (i % 2 === 1) {
            tag = this.archiveTags[text.replace(/\ .*\]/, ']')];
            if (typeof tag === 'function') {
              results.push(tag(text));
            } else {
              results.push(tag);
            }
          } else {
            greentext = text[0] === '>';
            text = text.replace(/(\[\/?[a-z]+):lit(\])/g, '$1$2');
            text = (function() {
              var l, len1, ref, results1;
              ref = text.split(/(>>(?:>\/[a-z\d]+\/)?\d+)/g);
              results1 = [];
              for (j = l = 0, len1 = ref.length; l < len1; j = ++l) {
                text2 = ref[j];
                results1.push({
                  innerHTML: ((j % 2) ? "<span class=\"deadlink\">" + E(text2) + "</span>" : E(text2))
                });
              }
              return results1;
            })();
            text = {
              innerHTML: ((greentext) ? "<span class=\"quote\">" + E.cat(text) + "</span>" : E.cat(text))
            };
            results.push(text);
          }
        }
        return results;
      }).call(this);
      comment = {
        innerHTML: E.cat(comment)
      };
      this.threadID = +data.thread_num;
      o = {
        postID: this.postID,
        threadID: this.threadID,
        boardID: this.boardID,
        isReply: this.postID !== this.threadID
      };
      o.info = {
        subject: data.title,
        email: data.email,
        name: data.name || '',
        tripcode: data.trip,
        capcode: (function() {
          switch (data.capcode) {
            case 'M':
              return 'Mod';
            case 'A':
              return 'Admin';
            case 'D':
              return 'Developer';
          }
        })(),
        uniqueID: data.poster_hash,
        flagCode: data.poster_country,
        flag: data.poster_country_name,
        dateUTC: data.timestamp,
        dateText: data.fourchan_date,
        commentHTML: comment
      };
      if (o.info.capcode) {
        delete o.info.uniqueID;
      }
      if ((ref = data.media) != null ? ref.media_filename : void 0) {
        ref1 = data.media;
        for (key in ref1) {
          val = ref1[key];
          if (/_link$/.test(key) && (val != null ? val[0] : void 0) === '/') {
            data.media[key] = url.split('/', 3).join('/') + val;
          }
        }
        o.file = {
          name: data.media.media_filename,
          url: data.media.media_link || data.media.remote_media_link || (location.protocol + "//i.4cdn.org/" + this.boardID + "/" + (encodeURIComponent(data.media[this.boardID === 'f' ? 'media_filename' : 'media_orig']))),
          height: data.media.media_h,
          width: data.media.media_w,
          MD5: data.media.media_hash,
          size: $.bytesToString(data.media.media_size),
          thumbURL: data.media.thumb_link || (location.protocol + "//i.4cdn.org/" + this.boardID + "/" + data.media.preview_orig),
          theight: data.media.preview_h,
          twidth: data.media.preview_w,
          isSpoiler: data.media.spoiler === '1'
        };
        if (!/\.pdf$/.test(o.file.url)) {
          o.file.dimensions = o.file.width + "x" + o.file.height;
        }
        if (this.boardID === 'f' && data.media.exif) {
          o.file.tag = JSON.parse(data.media.exif).Tag;
        }
      }
      board = g.boards[this.boardID] || new Board(this.boardID);
      thread = g.threads[this.boardID + "." + this.threadID] || new Thread(this.threadID, board);
      post = new Post(Build.post(o), thread, board);
      post.kill();
      if (post.file) {
        post.file.thumbURL = o.file.thumbURL;
      }
      post.isFetchedQuote = true;
      Main.callbackNodes('Post', [post]);
      return this.insert(post);
    };

    Fetcher.prototype.archiveTags = {
      '\n': {
        innerHTML: "<br>"
      },
      '[b]': {
        innerHTML: "<b>"
      },
      '[/b]': {
        innerHTML: "</b>"
      },
      '[spoiler]': {
        innerHTML: "<s>"
      },
      '[/spoiler]': {
        innerHTML: "</s>"
      },
      '[code]': {
        innerHTML: "<pre class=\"prettyprint\">"
      },
      '[/code]': {
        innerHTML: "</pre>"
      },
      '[moot]': {
        innerHTML: "<div style=\"padding:5px;margin-left:.5em;border-color:#faa;border:2px dashed rgba(255,0,0,.1);border-radius:2px\">"
      },
      '[/moot]': {
        innerHTML: "</div>"
      },
      '[banned]': {
        innerHTML: "<strong style=\"color: red;\">"
      },
      '[/banned]': {
        innerHTML: "</strong>"
      },
      '[fortune]': function(text) {
        return {
          innerHTML: "<span class=\"fortune\" style=\"color:" + E(text.match(/#\w+|$/)[0]) + "\"><b>"
        };
      },
      '[/fortune]': {
        innerHTML: "</b></span>"
      },
      '[i]': {
        innerHTML: "<span class=\"mu-i\">"
      },
      '[/i]': {
        innerHTML: "</span>"
      },
      '[red]': {
        innerHTML: "<span class=\"mu-r\">"
      },
      '[/red]': {
        innerHTML: "</span>"
      },
      '[green]': {
        innerHTML: "<span class=\"mu-g\">"
      },
      '[/green]': {
        innerHTML: "</span>"
      },
      '[blue]': {
        innerHTML: "<span class=\"mu-b\">"
      },
      '[/blue]': {
        innerHTML: "</span>"
      }
    };

    return Fetcher;

  })();

  return Fetcher;

}).call(this);

Notice = (function() {
  var Notice,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Notice = (function() {
    function Notice(type, content, timeout, onclose) {
      this.timeout = timeout;
      this.onclose = onclose;
      this.close = bind(this.close, this);
      this.add = bind(this.add, this);
      this.el = $.el('div', {
        innerHTML: "<a href=\"javascript:;\" class=\"close fa fa-times\" title=\"Close\"></a><div class=\"message\"></div>"
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

    Notice.prototype.setType = function(type) {
      return this.el.className = "notification " + type;
    };

    Notice.prototype.add = function() {
      if (this.closed) {
        return;
      }
      if (d.hidden) {
        $.on(d, 'visibilitychange', this.add);
        return;
      }
      $.off(d, 'visibilitychange', this.add);
      $.add(Header.noticesRoot, this.el);
      this.el.clientHeight;
      this.el.style.opacity = 1;
      if (this.timeout) {
        return setTimeout(this.close, this.timeout * $.SECOND);
      }
    };

    Notice.prototype.close = function() {
      this.closed = true;
      $.off(d, 'visibilitychange', this.add);
      $.rm(this.el);
      return typeof this.onclose === "function" ? this.onclose() : void 0;
    };

    return Notice;

  })();

  return Notice;

}).call(this);

Post = (function() {
  var Post,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Post = (function() {
    Post.prototype.toString = function() {
      return this.ID;
    };

    function Post(root, thread, board) {
      var clone, j, len, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
      this.thread = thread;
      this.board = board;
      this.ID = +root.id.slice(2);
      this.fullID = this.board + "." + this.ID;
      this.context = this;
      root.dataset.fullID = this.fullID;
      this.nodes = this.parseNodes(root);
      if (!(this.isReply = $.hasClass(this.nodes.post, 'reply'))) {
        this.thread.OP = this;
        this.thread.isArchived = !!$('.archivedIcon', this.nodes.info);
        this.thread.isSticky = !!$('.stickyIcon', this.nodes.info);
        this.thread.isClosed = this.thread.isArchived || !!$('.closedIcon', this.nodes.info);
        if (this.thread.isArchived) {
          this.thread.kill();
        }
      }
      this.info = {
        nameBlock: Conf['Anonymize'] ? 'Anonymous' : this.nodes.nameBlock.textContent.trim(),
        subject: ((ref = this.nodes.subject) != null ? ref.textContent : void 0) || void 0,
        name: (ref1 = this.nodes.name) != null ? ref1.textContent : void 0,
        tripcode: (ref2 = this.nodes.tripcode) != null ? ref2.textContent : void 0,
        uniqueID: (ref3 = this.nodes.uniqueID) != null ? ref3.firstElementChild.textContent : void 0,
        capcode: (ref4 = this.nodes.capcode) != null ? ref4.textContent.replace('## ', '') : void 0,
        flagCode: (ref5 = this.nodes.flag) != null ? (ref6 = ref5.className.match(/flag-(\w+)/)) != null ? ref6[1].toUpperCase() : void 0 : void 0,
        flag: (ref7 = this.nodes.flag) != null ? ref7.title : void 0,
        date: this.nodes.date ? new Date(this.nodes.date.dataset.utc * 1000) : void 0
      };
      this.parseComment();
      this.parseQuotes();
      this.parseFile();
      this.isDead = false;
      this.isHidden = false;
      this.clones = [];
      if (g.posts[this.fullID]) {
        this.isRebuilt = true;
        this.clones = g.posts[this.fullID].clones;
        ref8 = this.clones;
        for (j = 0, len = ref8.length; j < len; j++) {
          clone = ref8[j];
          clone.origin = this;
        }
      }
      this.board.posts.push(this.ID, this);
      this.thread.posts.push(this.ID, this);
      g.posts.push(this.fullID, this);
    }

    Post.prototype.parseNodes = function(root) {
      var info, nodes, post;
      post = $('.post', root);
      info = $('.postInfo', post);
      nodes = {
        root: root,
        post: post,
        info: info,
        subject: $('.subject', info),
        name: $('.name', info),
        email: $('.useremail', info),
        tripcode: $('.postertrip', info),
        uniqueID: $('.posteruid', info),
        capcode: $('.capcode.hand', info),
        flag: $('.flag, .countryFlag', info),
        date: $('.dateTime', info),
        nameBlock: $('.nameBlock', info),
        quote: $('.postNum > a:nth-of-type(2)', info),
        reply: $('.replylink', info),
        comment: $('.postMessage', post),
        links: [],
        quotelinks: [],
        archivelinks: []
      };
      if ($.engine === 'edge') {
        Object.defineProperty(nodes, 'backlinks', {
          configurable: true,
          enumerable: true,
          get: function() {
            return info.getElementsByClassName('backlink');
          }
        });
      } else {
        nodes.backlinks = info.getElementsByClassName('backlink');
      }
      return nodes;
    };

    Post.prototype.parseComment = function() {
      var abbr, bq, commentDisplay, j, k, len, len1, node, ref, spoilers;
      this.nodes.comment.normalize();
      bq = this.nodes.comment.cloneNode(true);
      ref = $$('.abbr + br, .exif, b, .fortune', bq);
      for (j = 0, len = ref.length; j < len; j++) {
        node = ref[j];
        $.rm(node);
      }
      if (abbr = $('.abbr', bq)) {
        $.rm(abbr);
      }
      this.info.comment = this.nodesToText(bq);
      if (abbr) {
        this.info.comment = this.info.comment.replace(/\n\n$/, '');
      }
      commentDisplay = this.info.comment;
      if (!(Conf['Remove Spoilers'] || Conf['Reveal Spoilers'])) {
        spoilers = $$('s', bq);
        if (spoilers.length) {
          for (k = 0, len1 = spoilers.length; k < len1; k++) {
            node = spoilers[k];
            $.replace(node, $.tn('[spoiler]'));
          }
          commentDisplay = this.nodesToText(bq);
        }
      }
      return this.info.commentDisplay = commentDisplay.trim().replace(/\s+$/gm, '');
    };

    Post.prototype.nodesToText = function(bq) {
      var i, node, nodes, text;
      text = "";
      nodes = $.X('.//br|.//text()', bq);
      i = 0;
      while (node = nodes.snapshotItem(i++)) {
        text += node.data || '\n';
      }
      return text;
    };

    Post.prototype.parseQuotes = function() {
      var j, len, quotelink, ref;
      this.quotes = [];
      ref = $$(':not(pre) > .quotelink', this.nodes.comment);
      for (j = 0, len = ref.length; j < len; j++) {
        quotelink = ref[j];
        this.parseQuote(quotelink);
      }
    };

    Post.prototype.parseQuote = function(quotelink) {
      var fullID, match;
      match = quotelink.href.match(/^https?:\/\/boards\.4chan\.org\/+([^\/]+)\/+(?:res|thread)\/+\d+(?:\/[^#]*)?#p(\d+)$/);
      if (!(match || (this.isClone && quotelink.dataset.postID))) {
        return;
      }
      this.nodes.quotelinks.push(quotelink);
      if (this.isClone) {
        return;
      }
      fullID = match[1] + "." + match[2];
      if (indexOf.call(this.quotes, fullID) < 0) {
        return this.quotes.push(fullID);
      }
    };

    Post.prototype.parseFile = function() {
      var fileEl, fileText, info, link, m, ref, ref1, ref2, size, thumb, unit;
      if (!(fileEl = $('.file', this.nodes.post))) {
        return;
      }
      if (!(link = $('.fileText > a, .fileText-original > a', fileEl))) {
        return;
      }
      if (!(info = (ref = link.nextSibling) != null ? ref.textContent.match(/\(([\d.]+ [KMG]?B).*\)/) : void 0)) {
        return;
      }
      fileText = fileEl.firstElementChild;
      this.file = {
        text: fileText,
        link: link,
        url: link.href,
        name: fileText.title || link.title || link.textContent,
        size: info[1],
        isImage: /(jpg|png|gif)$/i.test(link.href),
        isVideo: /webm$/i.test(link.href),
        dimensions: (ref1 = info[0].match(/\d+x\d+/)) != null ? ref1[0] : void 0,
        tag: (ref2 = info[0].match(/,[^,]*, ([a-z]+)\)/i)) != null ? ref2[1] : void 0
      };
      size = +this.file.size.match(/[\d.]+/)[0];
      unit = ['B', 'KB', 'MB', 'GB'].indexOf(this.file.size.match(/\w+$/)[0]);
      while (unit-- > 0) {
        size *= 1024;
      }
      this.file.sizeInBytes = size;
      if ((thumb = $('.fileThumb > [data-md5]', fileEl))) {
        return $.extend(this.file, {
          thumb: thumb,
          thumbURL: (m = link.href.match(/\d+(?=\.\w+$)/)) ? location.protocol + "//i.4cdn.org/" + this.board + "/" + m[0] + "s.jpg" : void 0,
          MD5: thumb.dataset.md5,
          isSpoiler: $.hasClass(thumb.parentNode, 'imgspoiler')
        });
      }
    };

    Post.prototype.kill = function(file) {
      var clone, j, k, len, len1, quotelink, ref, ref1, strong;
      if (file) {
        if (this.isDead || this.file.isDead) {
          return;
        }
        this.file.isDead = true;
        $.addClass(this.nodes.root, 'deleted-file');
      } else {
        if (this.isDead) {
          return;
        }
        this.isDead = true;
        $.rmClass(this.nodes.root, 'deleted-file');
        $.addClass(this.nodes.root, 'deleted-post');
      }
      if (!(strong = $('strong.warning', this.nodes.info))) {
        strong = $.el('strong', {
          className: 'warning'
        });
        $.after($('input', this.nodes.info), strong);
      }
      strong.textContent = file ? '[File deleted]' : '[Deleted]';
      if (this.isClone) {
        return;
      }
      ref = this.clones;
      for (j = 0, len = ref.length; j < len; j++) {
        clone = ref[j];
        clone.kill(file);
      }
      if (file) {
        return;
      }
      ref1 = Get.allQuotelinksLinkingTo(this);
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        quotelink = ref1[k];
        if (!(!$.hasClass(quotelink, 'deadlink'))) {
          continue;
        }
        quotelink.textContent = quotelink.textContent + '\u00A0(Dead)';
        $.addClass(quotelink, 'deadlink');
      }
    };

    Post.prototype.resurrect = function() {
      var clone, j, k, len, len1, quotelink, ref, ref1, strong;
      this.isDead = false;
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
      ref = this.clones;
      for (j = 0, len = ref.length; j < len; j++) {
        clone = ref[j];
        clone.resurrect();
      }
      ref1 = Get.allQuotelinksLinkingTo(this);
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        quotelink = ref1[k];
        if (!($.hasClass(quotelink, 'deadlink'))) {
          continue;
        }
        quotelink.textContent = quotelink.textContent.replace('\u00A0(Dead)', '');
        $.rmClass(quotelink, 'deadlink');
      }
    };

    Post.prototype.collect = function() {
      g.posts.rm(this.fullID);
      this.thread.posts.rm(this);
      return this.board.posts.rm(this);
    };

    Post.prototype.addClone = function(context, contractThumb) {
      return new Post.Clone(this, context, contractThumb);
    };

    Post.prototype.rmClone = function(index) {
      var clone, j, len, ref;
      this.clones.splice(index, 1);
      ref = this.clones.slice(index);
      for (j = 0, len = ref.length; j < len; j++) {
        clone = ref[j];
        clone.nodes.root.dataset.clone = index++;
      }
    };

    return Post;

  })();

  return Post;

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Post.Clone = (function(superClass) {
    extend(_Class, superClass);

    _Class.prototype.isClone = true;

    function _Class(origin, context, contractThumb) {
      var base, file, i, inline, inlined, j, k, key, l, len, len1, len2, len3, node, nodes, ref, ref1, ref2, ref3, ref4, ref5, root, val;
      this.origin = origin;
      this.context = context;
      ref = ['ID', 'fullID', 'board', 'thread', 'info', 'quotes', 'isReply'];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        this[key] = this.origin[key];
      }
      nodes = this.origin.nodes;
      root = contractThumb ? this.cloneWithoutVideo(nodes.root) : nodes.root.cloneNode(true);
      (base = Post.Clone).prefix || (base.prefix = 0);
      ref1 = [root].concat(slice.call($$('[id]', root)));
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        node = ref1[j];
        node.id = Post.Clone.prefix + node.id;
      }
      Post.Clone.prefix++;
      this.nodes = this.parseNodes(root);
      ref2 = $$('.inline', this.nodes.post);
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        inline = ref2[k];
        $.rm(inline);
      }
      ref3 = $$('.inlined', this.nodes.post);
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        inlined = ref3[l];
        $.rmClass(inlined, 'inlined');
      }
      root.hidden = false;
      $.rmClass(root, 'forwarded');
      $.rmClass(this.nodes.post, 'highlight');
      this.parseQuotes();
      this.quotes = slice.call(this.origin.quotes);
      if (this.origin.file) {
        this.file = {};
        ref4 = this.origin.file;
        for (key in ref4) {
          val = ref4[key];
          this.file[key] = val;
        }
        file = $('.file', this.nodes.post);
        this.file.text = file.firstElementChild;
        this.file.link = $('.fileText > a, .fileText-original', file);
        this.file.thumb = $('.fileThumb > [data-md5]', file);
        this.file.fullImage = $('.full-image', file);
        this.file.videoControls = $('.video-controls', this.file.text);
        if (this.file.videoThumb) {
          this.file.thumb.muted = true;
        }
        if ((ref5 = this.file.thumb) != null ? ref5.dataset.src : void 0) {
          this.file.thumb.src = this.file.thumb.dataset.src;
          this.file.thumb.removeAttribute('data-src');
        }
        if (this.file.thumb && contractThumb) {
          ImageExpand.contract(this);
        }
      }
      if (this.origin.isDead) {
        this.isDead = true;
      }
      root.dataset.clone = this.origin.clones.push(this) - 1;
    }

    _Class.prototype.cloneWithoutVideo = function(node) {
      var child, clone, i, len, ref;
      if (node.tagName === 'VIDEO' && !node.dataset.md5) {
        return [];
      } else if (node.nodeType === Node.ELEMENT_NODE && $('video', node)) {
        clone = node.cloneNode(false);
        ref = node.childNodes;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          $.add(clone, this.cloneWithoutVideo(child));
        }
        return clone;
      } else {
        return node.cloneNode(true);
      }
    };

    return _Class;

  })(Post);

}).call(this);

RandomAccessList = (function() {
  var RandomAccessList;

  RandomAccessList = (function() {
    function RandomAccessList(items) {
      var i, item, len;
      this.length = 0;
      if (items) {
        for (i = 0, len = items.length; i < len; i++) {
          item = items[i];
          this.push(item);
        }
      }
    }

    RandomAccessList.prototype.push = function(data) {
      var ID, item, last;
      ID = data.ID;
      ID || (ID = data.id);
      if (this[ID]) {
        return;
      }
      last = this.last;
      this[ID] = item = {
        prev: last,
        next: null,
        data: data,
        ID: ID
      };
      item.prev = last;
      this.last = last ? last.next = item : this.first = item;
      return this.length++;
    };

    RandomAccessList.prototype.before = function(root, item) {
      var prev;
      if (item.next === root || item === root) {
        return;
      }
      this.rmi(item);
      prev = root.prev;
      root.prev = item;
      item.next = root;
      item.prev = prev;
      if (prev) {
        return prev.next = item;
      } else {
        return this.first = item;
      }
    };

    RandomAccessList.prototype.after = function(root, item) {
      var next;
      if (item.prev === root || item === root) {
        return;
      }
      this.rmi(item);
      next = root.next;
      root.next = item;
      item.prev = root;
      item.next = next;
      if (next) {
        return next.prev = item;
      } else {
        return this.last = item;
      }
    };

    RandomAccessList.prototype.prepend = function(item) {
      var first;
      first = this.first;
      if (item === first || !this[item.ID]) {
        return;
      }
      this.rmi(item);
      item.next = first;
      if (first) {
        first.prev = item;
      } else {
        this.last = item;
      }
      this.first = item;
      return delete item.prev;
    };

    RandomAccessList.prototype.shift = function() {
      return this.rm(this.first.ID);
    };

    RandomAccessList.prototype.order = function() {
      var item, order;
      order = [item = this.first];
      while (item = item.next) {
        order.push(item);
      }
      return order;
    };

    RandomAccessList.prototype.rm = function(ID) {
      var item;
      item = this[ID];
      if (!item) {
        return;
      }
      delete this[ID];
      this.length--;
      this.rmi(item);
      delete item.next;
      return delete item.prev;
    };

    RandomAccessList.prototype.rmi = function(item) {
      var next, prev;
      prev = item.prev, next = item.next;
      if (prev) {
        prev.next = next;
      } else {
        this.first = next;
      }
      if (next) {
        return next.prev = prev;
      } else {
        return this.last = prev;
      }
    };

    return RandomAccessList;

  })();

  return RandomAccessList;

}).call(this);

ShimSet = (function() {
  var ShimSet;

  ShimSet = (function() {
    function ShimSet() {
      this.elements = {};
      this.size = 0;
    }

    ShimSet.prototype.has = function(value) {
      return value in this.elements;
    };

    ShimSet.prototype.add = function(value) {
      if (this.elements[value]) {
        return;
      }
      this.elements[value] = true;
      return this.size++;
    };

    ShimSet.prototype["delete"] = function(value) {
      if (!this.elements[value]) {
        return;
      }
      delete this.elements[value];
      return this.size--;
    };

    return ShimSet;

  })();

  if (!('Set' in window)) {
    window.Set = ShimSet;
  }

  return ShimSet;

}).call(this);

SimpleDict = (function() {
  var SimpleDict,
    slice = [].slice;

  SimpleDict = (function() {
    function SimpleDict() {
      this.keys = [];
    }

    SimpleDict.prototype.push = function(key, data) {
      key = "" + key;
      if (!this[key]) {
        this.keys.push(key);
      }
      return this[key] = data;
    };

    SimpleDict.prototype.rm = function(key) {
      var i;
      key = "" + key;
      if ((i = this.keys.indexOf(key)) !== -1) {
        this.keys.splice(i, 1);
        return delete this[key];
      }
    };

    SimpleDict.prototype.forEach = function(fn) {
      var j, key, len, ref;
      ref = slice.call(this.keys);
      for (j = 0, len = ref.length; j < len; j++) {
        key = ref[j];
        fn(this[key]);
      }
    };

    return SimpleDict;

  })();

  return SimpleDict;

}).call(this);

Thread = (function() {
  var Thread;

  Thread = (function() {
    Thread.prototype.toString = function() {
      return this.ID;
    };

    function Thread(ID, board) {
      this.ID = ID;
      this.board = board;
      this.fullID = this.board + "." + this.ID;
      this.posts = new SimpleDict();
      this.isDead = false;
      this.isHidden = false;
      this.isOnTop = false;
      this.isSticky = false;
      this.isClosed = false;
      this.isArchived = false;
      this.postLimit = false;
      this.fileLimit = false;
      this.ipCount = void 0;
      this.OP = null;
      this.catalogView = null;
      this.board.threads.push(this.ID, this);
      g.threads.push(this.fullID, this);
    }

    Thread.prototype.setPage = function(pageNum) {
      var icon, info, ref, reply;
      ref = this.OP.nodes, info = ref.info, reply = ref.reply;
      if (!(icon = $('.page-num', info))) {
        icon = $.el('span', {
          className: 'page-num'
        });
        $.replace(reply.parentNode.previousSibling, [$.tn(' '), icon, $.tn(' ')]);
      }
      icon.title = "This thread is on page " + pageNum + " in the original index.";
      icon.textContent = "[" + pageNum + "]";
      if (this.catalogView) {
        return this.catalogView.nodes.pageCount.textContent = pageNum;
      }
    };

    Thread.prototype.setCount = function(type, count, reachedLimit) {
      var el;
      if (!this.catalogView) {
        return;
      }
      el = this.catalogView.nodes[type + "Count"];
      el.textContent = count;
      return (reachedLimit ? $.addClass : $.rmClass)(el, 'warning');
    };

    Thread.prototype.setStatus = function(type, status) {
      var name;
      name = "is" + type;
      if (this[name] === status) {
        return;
      }
      this[name] = status;
      if (!this.OP) {
        return;
      }
      this.setIcon('Sticky', this.isSticky);
      this.setIcon('Closed', this.isClosed && !this.isArchived);
      return this.setIcon('Archived', this.isArchived);
    };

    Thread.prototype.setIcon = function(type, status) {
      var icon, root, typeLC;
      typeLC = type.toLowerCase();
      icon = $("." + typeLC + "Icon", this.OP.nodes.info);
      if (!!icon === status) {
        return;
      }
      if (!status) {
        $.rm(icon.previousSibling);
        $.rm(icon);
        if (this.catalogView) {
          $.rm($("." + typeLC + "Icon", this.catalogView.nodes.icons));
        }
        return;
      }
      icon = $.el('img', {
        src: "" + Build.staticPath + typeLC + Build.gifIcon,
        alt: type,
        title: type,
        className: typeLC + "Icon retina"
      });
      root = type !== 'Sticky' && this.isSticky ? $('.stickyIcon', this.OP.nodes.info) : $('.page-num', this.OP.nodes.info) || this.OP.nodes.quote;
      $.after(root, [$.tn(' '), icon]);
      if (!this.catalogView) {
        return;
      }
      return (type === 'Sticky' && this.isClosed ? $.prepend : $.add)(this.catalogView.nodes.icons, icon.cloneNode());
    };

    Thread.prototype.kill = function() {
      return this.isDead = true;
    };

    Thread.prototype.collect = function() {
      this.posts.forEach(function(post) {
        return post.collect();
      });
      g.threads.rm(this.fullID);
      return this.board.threads.rm(this);
    };

    return Thread;

  })();

  return Thread;

}).call(this);

Redirect = (function() {
  var Redirect,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Redirect = {
    archives: [
      { "uid": 3, "name": "4plebs", "domain": "archive.4plebs.org", "http": true, "https": true, "software": "foolfuuka", "boards": [ "adv", "f", "hr", "o", "pol", "s4s", "sp", "tg", "trv", "tv", "x" ], "files": [ "adv", "f", "hr", "o", "pol", "s4s", "sp", "tg", "trv", "tv", "x" ] },
      { "uid": 4, "name": "Nyafuu Archive", "domain": "archive.nyafuu.org", "http": true, "https": true, "software": "foolfuuka", "boards": [ "c", "e", "news", "w", "wg", "wsr" ], "files": [ "c", "e", "news", "w", "wg", "wsr" ] },
      { "uid": 8, "name": "Rebecca Black Tech", "domain": "archive.rebeccablacktech.com", "http": false, "https": true, "software": "fuuka", "boards": [ "cgl", "g", "mu" ], "files": [ "cgl", "g", "mu" ] },
      { "uid": 10, "name": "warosu", "domain": "warosu.org", "http": false, "https": true, "software": "fuuka", "boards": [ "3", "biz", "cgl", "ck", "diy", "fa", "g", "ic", "jp", "lit", "sci", "tg", "vr" ], "files": [ "3", "biz", "cgl", "ck", "diy", "fa", "g", "ic", "jp", "lit", "sci", "tg", "vr" ] },
      { "uid": 23, "name": "Desustorage", "domain": "desustorage.org", "http": true, "https": true, "software": "foolfuuka", "boards": [ "a", "aco", "an", "c", "co", "d", "fit", "gif", "his", "int", "k", "m", "mlp", "qa", "r9k", "tg", "trash", "vr", "wsg" ], "files": [ "a", "aco", "an", "c", "co", "d", "fit", "gif", "his", "int", "k", "m", "mlp", "qa", "r9k", "tg", "trash", "vr", "wsg" ] },
      { "uid": 24, "name": "fireden.net", "domain": "boards.fireden.net", "http": false, "https": true, "software": "foolfuuka", "boards": [ "a", "cm", "ic", "sci", "tg", "v", "vg", "y" ], "files": [ "a", "cm", "ic", "sci", "tg", "v", "vg", "y" ] },
      { "uid": 25, "name": "arch.b4k.co", "domain": "arch.b4k.co", "http": true, "https": true, "software": "foolfuuka", "boards": [ "g", "jp", "mlp", "v" ], "files": [] },
      { "uid": 5, "name": "Love is Over", "domain": "deploy.loveisover.me", "http": true, "https": false, "software": "foolfuuka", "boards": [ "c", "d", "e", "i", "lgbt", "t", "u" ], "files": [ "c", "d", "e", "i", "lgbt", "t", "u" ], "search": [] },
      { "uid": 28, "name": "bstats", "domain": "archive.b-stats.org", "http": true, "https": true, "software": "foolfuuka", "boards": [ "f", "cm", "hm", "lgbt", "news", "qst", "trash", "y" ], "files": [] }
    ],
    init: function() {
      this.selectArchives();
      if (Conf['archiveAutoUpdate'] && Conf['lastarchivecheck'] < Date.now() - 2 * $.DAY) {
        return this.update();
      }
    },
    selectArchives: function() {
      var archive, archives, boardID, boards, data, files, id, j, k, key, l, len, len1, len2, name, o, record, ref, ref1, ref2, software, type, uid, withCredentials;
      o = {
        thread: {},
        post: {},
        file: {},
        report: {}
      };
      archives = {};
      ref = Conf['archives'];
      for (j = 0, len = ref.length; j < len; j++) {
        data = ref[j];
        ref1 = ['boards', 'files'];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          key = ref1[k];
          if (!(data[key] instanceof Array)) {
            data[key] = [];
          }
        }
        uid = data.uid, name = data.name, boards = data.boards, files = data.files, software = data.software, withCredentials = data.withCredentials;
        archives[JSON.stringify(uid != null ? uid : name)] = data;
        for (l = 0, len2 = boards.length; l < len2; l++) {
          boardID = boards[l];
          if (!withCredentials) {
            if (!(boardID in o.thread)) {
              o.thread[boardID] = data;
            }
            if (!(boardID in o.post || software !== 'foolfuuka')) {
              o.post[boardID] = data;
            }
            if (!(boardID in o.file || indexOf.call(files, boardID) < 0)) {
              o.file[boardID] = data;
            }
          }
          if (name === 'fgts') {
            o.report[boardID] = data;
          }
        }
      }
      ref2 = Conf['selectedArchives'];
      for (boardID in ref2) {
        record = ref2[boardID];
        for (type in record) {
          id = record[type];
          if (id === null) {
            delete o[type][boardID];
          } else if (archive = archives[JSON.stringify(id)]) {
            boards = type === 'file' ? archive.files : archive.boards;
            if (indexOf.call(boards, boardID) >= 0) {
              o[type][boardID] = archive;
            }
          }
        }
      }
      return Redirect.data = o;
    },
    update: function(cb) {
      var i, j, k, len, len1, load, nloaded, ref, ref1, responses, url, urls;
      urls = [];
      responses = [];
      nloaded = 0;
      ref = Conf['archiveLists'].split('\n');
      for (j = 0, len = ref.length; j < len; j++) {
        url = ref[j];
        if (!(url[0] !== '#')) {
          continue;
        }
        url = url.trim();
        if (url) {
          urls.push(url);
        }
      }
      load = function(i) {
        return function() {
          var err, fail, response;
          fail = function(action, msg) {
            return new Notice('warning', "Error " + action + " archive data from\n" + urls[i] + "\n" + msg, 20);
          };
          if (this.status !== 200) {
            return fail('fetching', (this.status ? "Error " + this.statusText + " (" + this.status + ")" : 'Connection Error'));
          }
          try {
            response = JSON.parse(this.response);
          } catch (_error) {
            err = _error;
            return fail('parsing', err.message);
          }
          if (!(response instanceof Array)) {
            response = [response];
          }
          responses[i] = response;
          nloaded++;
          if (nloaded === urls.length) {
            return Redirect.parse(responses, cb);
          }
        };
      };
      if (urls.length) {
        for (i = k = 0, len1 = urls.length; k < len1; i = ++k) {
          url = urls[i];
          if ((ref1 = url[0]) === '[' || ref1 === '{') {
            load(i).call({
              status: 200,
              response: url
            });
          } else {
            $.ajax(url, {
              responseType: 'text',
              onloadend: load(i)
            });
          }
        }
      } else {
        Redirect.parse([], cb);
      }
    },
    parse: function(responses, cb) {
      var archiveUIDs, archives, data, items, j, k, len, len1, ref, response, uid;
      archives = [];
      archiveUIDs = {};
      for (j = 0, len = responses.length; j < len; j++) {
        response = responses[j];
        for (k = 0, len1 = response.length; k < len1; k++) {
          data = response[k];
          uid = JSON.stringify((ref = data.uid) != null ? ref : data.name);
          if (uid in archiveUIDs) {
            $.extend(archiveUIDs[uid], data);
          } else {
            archiveUIDs[uid] = data;
            archives.push(data);
          }
        }
      }
      items = {
        archives: archives,
        lastarchivecheck: Date.now()
      };
      $.set(items);
      $.extend(Conf, items);
      Redirect.selectArchives();
      return typeof cb === "function" ? cb() : void 0;
    },
    to: function(dest, data) {
      var archive;
      archive = (dest === 'search' || dest === 'board' ? Redirect.data.thread : Redirect.data[dest])[data.boardID];
      if (!archive) {
        return '';
      }
      return Redirect[dest](archive, data);
    },
    protocol: function(archive) {
      var protocol;
      protocol = location.protocol;
      if (!archive[protocol.slice(0, -1)]) {
        protocol = protocol === 'https:' ? 'http:' : 'https:';
      }
      return protocol + "//";
    },
    thread: function(archive, arg) {
      var boardID, path, postID, threadID;
      boardID = arg.boardID, threadID = arg.threadID, postID = arg.postID;
      path = threadID ? boardID + "/thread/" + threadID : boardID + "/post/" + postID;
      if (archive.software === 'foolfuuka') {
        path += '/';
      }
      if (threadID && postID) {
        path += archive.software === 'foolfuuka' ? "#" + postID : "#p" + postID;
      }
      return "" + (Redirect.protocol(archive)) + archive.domain + "/" + path;
    },
    post: function(archive, arg) {
      var boardID, postID, protocol, url;
      boardID = arg.boardID, postID = arg.postID;
      protocol = Redirect.protocol(archive);
      url = "" + protocol + archive.domain + "/_/api/chan/post/?board=" + boardID + "&num=" + postID;
      if (!Redirect.securityCheck(url)) {
        return '';
      }
      return url;
    },
    file: function(archive, arg) {
      var boardID, filename;
      boardID = arg.boardID, filename = arg.filename;
      return "" + (Redirect.protocol(archive)) + archive.domain + "/" + boardID + "/full_image/" + filename;
    },
    board: function(archive, arg) {
      var boardID;
      boardID = arg.boardID;
      return "" + (Redirect.protocol(archive)) + archive.domain + "/" + boardID + "/";
    },
    search: function(archive, arg) {
      var boardID, path, type, value;
      boardID = arg.boardID, type = arg.type, value = arg.value;
      type = type === 'name' ? 'username' : type === 'MD5' ? 'image' : type;
      if (type === 'capcode') {
        value = {
          'Developer': 'dev'
        }[value] || value.toLowerCase();
      } else if (type === 'image') {
        value = value.replace(/[+\/=]/g, function(c) {
          return {
            '+': '-',
            '/': '_',
            '=': ''
          }[c];
        });
      }
      value = encodeURIComponent(value);
      path = archive.software === 'foolfuuka' ? boardID + "/search/" + type + "/" + value + "/" : type === 'image' ? boardID + "/image/" + value : boardID + "/?task=search2&search_" + type + "=" + value;
      return "" + (Redirect.protocol(archive)) + archive.domain + "/" + path;
    },
    report: function(archive, arg) {
      var boardID, postID;
      boardID = arg.boardID, postID = arg.postID;
      return "https://so.fgts.jp/report/?board=" + boardID + "&no=" + postID;
    },
    securityCheck: function(url) {
      return /^https:\/\//.test(url) || location.protocol === 'http:' || Conf['Exempt Archives from Encryption'];
    },
    navigate: function(dest, data, alternative) {
      var url;
      if (!Redirect.data) {
        Redirect.init();
      }
      url = Redirect.to(dest, data);
      if (url && (Redirect.securityCheck(url) || confirm("Redirect to " + url + "?\n\nYour connection will not be encrypted."))) {
        return location.replace(url);
      } else if (alternative) {
        return location.replace(alternative);
      }
    }
  };

  return Redirect;

}).call(this);

Anonymize = (function() {
  var Anonymize;

  Anonymize = {
    init: function() {
      var ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread' || ref === 'archive') && Conf['Anonymize'])) {
        return;
      }
      if (g.VIEW === 'archive') {
        return this.archive();
      }
      return Callbacks.Post.push({
        name: 'Anonymize',
        cb: this.node
      });
    },
    node: function() {
      var email, name, ref, tripcode;
      if (this.info.capcode || this.isClone) {
        return;
      }
      ref = this.nodes, name = ref.name, tripcode = ref.tripcode, email = ref.email;
      if (this.info.name !== 'Anonymous') {
        name.textContent = 'Anonymous';
      }
      if (tripcode) {
        $.rm(tripcode);
        delete this.nodes.tripcode;
      }
      if (email) {
        $.replace(email, name);
        return delete this.nodes.email;
      }
    },
    archive: function() {
      return $.ready(function() {
        var i, j, len, len1, name, ref, ref1, trip;
        ref = $$('.name');
        for (i = 0, len = ref.length; i < len; i++) {
          name = ref[i];
          name.textContent = 'Anonymous';
        }
        ref1 = $$('.postertrip');
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          trip = ref1[j];
          $.rm(trip);
        }
      });
    }
  };

  return Anonymize;

}).call(this);

Filter = (function() {
  var Filter,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Filter = {
    filters: {},
    init: function() {
      var boards, err, excludes, filter, hl, i, key, len, line, op, ref, ref1, ref2, ref3, ref4, ref5, ref6, regexp, stub, top;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Filter'])) {
        return;
      }
      if (!Conf['Filtered Backlinks']) {
        $.addClass(doc, 'hide-backlinks');
      }
      for (key in Config.filter) {
        this.filters[key] = [];
        ref1 = Conf[key].split('\n');
        for (i = 0, len = ref1.length; i < len; i++) {
          line = ref1[i];
          if (line[0] === '#') {
            continue;
          }
          if (!(regexp = line.match(/\/(.+)\/(\w*)/))) {
            continue;
          }
          filter = line.replace(regexp[0], '');
          boards = ((ref2 = filter.match(/boards:([^;]+)/)) != null ? ref2[1].toLowerCase() : void 0) || 'global';
          boards = boards === 'global' ? null : boards.split(',');
          if (boards === null) {
            excludes = ((ref3 = filter.match(/exclude:([^;]+)/)) != null ? ref3[1].toLowerCase().split(',') : void 0) || null;
          }
          if (key === 'uniqueID' || key === 'MD5') {
            regexp = regexp[1];
          } else {
            try {
              regexp = RegExp(regexp[1], regexp[2]);
            } catch (_error) {
              err = _error;
              new Notice('warning', [$.tn("Invalid " + key + " filter:"), $.el('br'), $.tn(line), $.el('br'), $.tn(err.message)], 60);
              continue;
            }
          }
          op = ((ref4 = filter.match(/[^t]op:(yes|no|only)/)) != null ? ref4[1] : void 0) || 'yes';
          stub = (function() {
            var ref5;
            switch ((ref5 = filter.match(/stub:(yes|no)/)) != null ? ref5[1] : void 0) {
              case 'yes':
                return true;
              case 'no':
                return false;
              default:
                return Conf['Stubs'];
            }
          })();
          if (hl = /highlight/.test(filter)) {
            hl = ((ref5 = filter.match(/highlight:([\w-]+)/)) != null ? ref5[1] : void 0) || 'filter-highlight';
            top = ((ref6 = filter.match(/top:(yes|no)/)) != null ? ref6[1] : void 0) || 'yes';
            top = top === 'yes';
          }
          this.filters[key].push(this.createFilter(regexp, boards, excludes, op, stub, hl, top));
        }
        if (!this.filters[key].length) {
          delete this.filters[key];
        }
      }
      if (!Object.keys(this.filters).length) {
        return;
      }
      return Callbacks.Post.push({
        name: 'Filter',
        cb: this.node
      });
    },
    createFilter: function(regexp, boards, excludes, op, stub, hl, top) {
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
      return function(value, boardID, isReply) {
        if (boards && indexOf.call(boards, boardID) < 0) {
          return false;
        }
        if (excludes && indexOf.call(excludes, boardID) >= 0) {
          return false;
        }
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
      var filter, i, key, len, ref, ref1, result, value;
      if (this.isClone) {
        return;
      }
      for (key in Filter.filters) {
        if ((value = Filter[key](this)) != null) {
          ref = Filter.filters[key];
          for (i = 0, len = ref.length; i < len; i++) {
            filter = ref[i];
            if (!(result = filter(value, this.board.ID, this.isReply))) {
              continue;
            }
            if (result.hide && !this.isFetchedQuote) {
              if (this.isReply) {
                PostHiding.hide(this, result.stub);
              } else if (g.VIEW === 'index') {
                ThreadHiding.hide(this.thread, result.stub);
              } else {
                continue;
              }
              return;
            }
            $.addClass(this.nodes.root, result["class"]);
            if (!(this.highlights && (ref1 = result["class"], indexOf.call(this.highlights, ref1) >= 0))) {
              (this.highlights || (this.highlights = [])).push(result["class"]);
            }
            if (!this.isReply && result.top) {
              this.thread.isOnTop = true;
            }
          }
        }
      }
    },
    isHidden: function(post) {
      var filter, i, key, len, ref, result, value;
      for (key in Filter.filters) {
        if ((value = Filter[key](post)) != null) {
          ref = Filter.filters[key];
          for (i = 0, len = ref.length; i < len; i++) {
            filter = ref[i];
            if (result = filter(value, post.boardID, post.isReply)) {
              if (result.hide) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },
    postID: function(post) {
      var ref;
      return "" + ((ref = post.ID) != null ? ref : post.postID);
    },
    name: function(post) {
      return post.info.name;
    },
    uniqueID: function(post) {
      return post.info.uniqueID;
    },
    tripcode: function(post) {
      return post.info.tripcode;
    },
    capcode: function(post) {
      return post.info.capcode;
    },
    subject: function(post) {
      return post.info.subject;
    },
    comment: function(post) {
      var base;
      return (base = post.info).comment != null ? base.comment : base.comment = Build.parseComment(post.info.commentHTML.innerHTML);
    },
    flag: function(post) {
      return post.info.flag;
    },
    filename: function(post) {
      var ref;
      return (ref = post.file) != null ? ref.name : void 0;
    },
    dimensions: function(post) {
      var ref;
      return (ref = post.file) != null ? ref.dimensions : void 0;
    },
    filesize: function(post) {
      var ref;
      return (ref = post.file) != null ? ref.size : void 0;
    },
    MD5: function(post) {
      var ref;
      return (ref = post.file) != null ? ref.MD5 : void 0;
    },
    menu: {
      init: function() {
        var div, entry, i, len, ref, ref1, type;
        if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Menu'] && Conf['Filter'])) {
          return;
        }
        div = $.el('div', {
          textContent: 'Filter'
        });
        entry = {
          el: div,
          order: 50,
          open: function(post) {
            Filter.menu.post = post;
            return true;
          },
          subEntries: []
        };
        ref1 = [['Name', 'name'], ['Unique ID', 'uniqueID'], ['Tripcode', 'tripcode'], ['Capcode', 'capcode'], ['Subject', 'subject'], ['Comment', 'comment'], ['Flag', 'flag'], ['Filename', 'filename'], ['Image dimensions', 'dimensions'], ['Filesize', 'filesize'], ['Image MD5', 'MD5']];
        for (i = 0, len = ref1.length; i < len; i++) {
          type = ref1[i];
          entry.subEntries.push(Filter.menu.createSubEntry(type[0], type[1]));
        }
        return Menu.menu.addEntry(entry);
      },
      createSubEntry: function(text, type) {
        var el;
        el = $.el('a', {
          href: 'javascript:;',
          textContent: text
        });
        el.dataset.type = type;
        $.on(el, 'click', Filter.menu.makeFilter);
        return {
          el: el,
          open: function(post) {
            var value;
            value = Filter[type](post);
            return (value != null) && !(g.BOARD.ID === 'f' && type === 'MD5');
          }
        };
      },
      makeFilter: function() {
        var re, type, value;
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
        return $.get(type, Conf[type], function(item) {
          var save, section, select, ta, tl;
          save = item[type];
          save = save ? save + "\n" + re : re;
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
        });
      }
    }
  };

  return Filter;

}).call(this);

PostHiding = (function() {
  var PostHiding;

  PostHiding = {
    init: function() {
      var ref;
      if (((ref = g.VIEW) !== 'index' && ref !== 'thread') || !Conf['Reply Hiding Buttons'] && !(Conf['Menu'] && Conf['Reply Hiding Link'])) {
        return;
      }
      if (Conf['Reply Hiding Buttons']) {
        $.addClass(doc, "reply-hide");
      }
      this.db = new DataBoard('hiddenPosts');
      return Callbacks.Post.push({
        name: 'Reply Hiding',
        cb: this.node
      });
    },
    node: function() {
      var data, sideArrows;
      if (!this.isReply || this.isClone || this.isFetchedQuote) {
        return;
      }
      if (data = PostHiding.db.get({
        boardID: this.board.ID,
        threadID: this.thread.ID,
        postID: this.ID
      })) {
        if (data.thisPost) {
          PostHiding.hide(this, data.makeStub, data.hideRecursively);
        } else {
          Recursive.apply(PostHiding.hide, this, data.makeStub, true);
          Recursive.add(PostHiding.hide, this, data.makeStub, true);
        }
      }
      if (!Conf['Reply Hiding Buttons']) {
        return;
      }
      sideArrows = $('.sideArrows', this.nodes.root);
      $.replace(sideArrows.firstChild, PostHiding.makeButton(this, 'hide'));
      return sideArrows.removeAttribute('class');
    },
    menu: {
      init: function() {
        var apply, div, hideStubLink, makeStub, ref, replies, thisPost;
        if (((ref = g.VIEW) !== 'index' && ref !== 'thread') || !Conf['Menu'] || !Conf['Reply Hiding Link']) {
          return;
        }
        div = $.el('div', {
          className: 'hide-reply-link',
          textContent: 'Hide'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', PostHiding.menu.hide);
        thisPost = UI.checkbox('thisPost', 'This post', true);
        replies = UI.checkbox('replies', 'Hide replies', Conf['Recursive Hiding']);
        makeStub = UI.checkbox('makeStub', 'Make stub', Conf['Stubs']);
        Menu.menu.addEntry({
          el: div,
          order: 20,
          open: function(post) {
            if (!post.isReply || post.isClone || post.isHidden) {
              return false;
            }
            PostHiding.menu.post = post;
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
          textContent: 'Show'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', PostHiding.menu.show);
        thisPost = UI.checkbox('thisPost', 'This post', false);
        replies = UI.checkbox('replies', 'Show replies', false);
        hideStubLink = $.el('a', {
          textContent: 'Hide stub',
          href: 'javascript:;'
        });
        $.on(hideStubLink, 'click', PostHiding.menu.hideStub);
        Menu.menu.addEntry({
          el: div,
          order: 20,
          open: function(post) {
            var data;
            if (!post.isReply || post.isClone || !post.isHidden) {
              return false;
            }
            if (!(data = PostHiding.db.get({
              boardID: post.board.ID,
              threadID: post.thread.ID,
              postID: post.ID
            }))) {
              return false;
            }
            PostHiding.menu.post = post;
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
        return Menu.menu.addEntry({
          el: hideStubLink,
          order: 15,
          open: function(post) {
            var data;
            if (!post.isReply || post.isClone || !post.isHidden) {
              return false;
            }
            if (!(data = PostHiding.db.get({
              boardID: post.board.ID,
              threadID: post.thread.ID,
              postID: post.ID
            }))) {
              return false;
            }
            return PostHiding.menu.post = post;
          }
        });
      },
      hide: function() {
        var makeStub, parent, post, replies, thisPost;
        parent = this.parentNode;
        thisPost = $('input[name=thisPost]', parent).checked;
        replies = $('input[name=replies]', parent).checked;
        makeStub = $('input[name=makeStub]', parent).checked;
        post = PostHiding.menu.post;
        if (thisPost) {
          PostHiding.hide(post, makeStub, replies);
        } else if (replies) {
          Recursive.apply(PostHiding.hide, post, makeStub, true);
          Recursive.add(PostHiding.hide, post, makeStub, true);
        } else {
          return;
        }
        PostHiding.saveHiddenState(post, true, thisPost, makeStub, replies);
        return $.event('CloseMenu');
      },
      show: function() {
        var data, parent, post, replies, thisPost;
        parent = this.parentNode;
        thisPost = $('input[name=thisPost]', parent).checked;
        replies = $('input[name=replies]', parent).checked;
        post = PostHiding.menu.post;
        if (thisPost) {
          PostHiding.show(post, replies);
        } else if (replies) {
          Recursive.apply(PostHiding.show, post, true);
          Recursive.rm(PostHiding.hide, post, true);
        } else {
          return;
        }
        if (data = PostHiding.db.get({
          boardID: post.board.ID,
          threadID: post.thread.ID,
          postID: post.ID
        })) {
          PostHiding.saveHiddenState(post, !(thisPost && replies), !thisPost, data.makeStub, !replies);
        }
        return $.event('CloseMenu');
      },
      hideStub: function() {
        var data, post;
        post = PostHiding.menu.post;
        if (data = PostHiding.db.get({
          boardID: post.board.ID,
          threadID: post.thread.ID,
          postID: post.ID
        })) {
          PostHiding.show(post, data.hideRecursively);
          PostHiding.hide(post, false, data.hideRecursively);
          PostHiding.saveHiddenState(post, true, true, false, data.hideRecursively);
        }
        $.event('CloseMenu');
      }
    },
    makeButton: function(post, type) {
      var a, span;
      span = $.el('span', {
        className: "fa fa-" + (type === 'hide' ? 'minus' : 'plus') + "-square-o",
        textContent: ""
      });
      a = $.el('a', {
        className: type + "-reply-button",
        href: 'javascript:;'
      });
      $.add(a, span);
      $.on(a, 'click', PostHiding.toggle);
      return a;
    },
    saveHiddenState: function(post, isHiding, thisPost, makeStub, hideRecursively) {
      var data;
      data = {
        boardID: post.board.ID,
        threadID: post.thread.ID,
        postID: post.ID
      };
      if (isHiding) {
        data.val = {
          thisPost: thisPost !== false,
          makeStub: makeStub,
          hideRecursively: hideRecursively
        };
        return PostHiding.db.set(data);
      } else {
        return PostHiding.db["delete"](data);
      }
    },
    toggle: function() {
      var post;
      post = Get.postFromNode(this);
      PostHiding[(post.isHidden ? 'show' : 'hide')](post);
      return PostHiding.saveHiddenState(post, post.isHidden);
    },
    hide: function(post, makeStub, hideRecursively) {
      var a, i, len, quotelink, ref;
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
        Recursive.apply(PostHiding.hide, post, makeStub, true);
        Recursive.add(PostHiding.hide, post, makeStub, true);
      }
      ref = Get.allQuotelinksLinkingTo(post);
      for (i = 0, len = ref.length; i < len; i++) {
        quotelink = ref[i];
        $.addClass(quotelink, 'filtered');
      }
      if (!makeStub) {
        post.nodes.root.hidden = true;
        return;
      }
      a = PostHiding.makeButton(post, 'show');
      $.add(a, $.tn(" " + post.info.nameBlock));
      post.nodes.stub = $.el('div', {
        className: 'stub'
      });
      $.add(post.nodes.stub, a);
      if (Conf['Menu']) {
        $.add(post.nodes.stub, Menu.makeButton(post));
      }
      return $.prepend(post.nodes.root, post.nodes.stub);
    },
    show: function(post, showRecursively) {
      var i, len, quotelink, ref;
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
        Recursive.apply(PostHiding.show, post, true);
        Recursive.rm(PostHiding.hide, post);
      }
      ref = Get.allQuotelinksLinkingTo(post);
      for (i = 0, len = ref.length; i < len; i++) {
        quotelink = ref[i];
        $.rmClass(quotelink, 'filtered');
      }
    }
  };

  return PostHiding;

}).call(this);

Recursive = (function() {
  var Recursive,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Recursive = {
    recursives: {},
    init: function() {
      var ref;
      if ((ref = g.VIEW) !== 'index' && ref !== 'thread') {
        return;
      }
      return Callbacks.Post.push({
        name: 'Recursive',
        cb: this.node
      });
    },
    node: function() {
      var i, j, k, len, len1, obj, quote, recursive, ref, ref1;
      if (this.isClone || this.isFetchedQuote) {
        return;
      }
      ref = this.quotes;
      for (j = 0, len = ref.length; j < len; j++) {
        quote = ref[j];
        if (obj = Recursive.recursives[quote]) {
          ref1 = obj.recursives;
          for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
            recursive = ref1[i];
            recursive.apply(null, [this].concat(slice.call(obj.args[i])));
          }
        }
      }
    },
    add: function() {
      var args, base, name, obj, post, recursive;
      recursive = arguments[0], post = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      obj = (base = Recursive.recursives)[name = post.fullID] || (base[name] = {
        recursives: [],
        args: []
      });
      obj.recursives.push(recursive);
      return obj.args.push(args);
    },
    rm: function(recursive, post) {
      var i, j, len, obj, rec, ref;
      if (!(obj = Recursive.recursives[post.fullID])) {
        return;
      }
      ref = obj.recursives;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        rec = ref[i];
        if (!(rec === recursive)) {
          continue;
        }
        obj.recursives.splice(i, 1);
        obj.args.splice(i, 1);
      }
    },
    apply: function() {
      var args, fullID, post, recursive;
      recursive = arguments[0], post = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      fullID = post.fullID;
      return g.posts.forEach(function(post) {
        if (indexOf.call(post.quotes, fullID) >= 0) {
          return recursive.apply(null, [post].concat(slice.call(args)));
        }
      });
    }
  };

  return Recursive;

}).call(this);

ThreadHiding = (function() {
  var ThreadHiding;

  ThreadHiding = {
    init: function() {
      var ref;
      if (((ref = g.VIEW) !== 'index' && ref !== 'catalog') || !Conf['Thread Hiding Buttons'] && !(Conf['Menu'] && Conf['Thread Hiding Link']) && !Conf['JSON Index']) {
        return;
      }
      this.db = new DataBoard('hiddenThreads');
      if (g.VIEW === 'catalog') {
        return this.catalogWatch();
      }
      this.catalogSet(g.BOARD);
      return Callbacks.Post.push({
        name: 'Thread Hiding',
        cb: this.node
      });
    },
    catalogSet: function(board) {
      var hiddenThreads, threadID;
      if (!$.hasStorage) {
        return;
      }
      hiddenThreads = ThreadHiding.db.get({
        boardID: board.ID,
        defaultValue: {}
      });
      for (threadID in hiddenThreads) {
        hiddenThreads[threadID] = true;
      }
      return localStorage.setItem("4chan-hide-t-" + board, JSON.stringify(hiddenThreads));
    },
    catalogWatch: function() {
      if (!$.hasStorage) {
        return;
      }
      this.hiddenThreads = JSON.parse(localStorage.getItem("4chan-hide-t-" + g.BOARD)) || {};
      return Main.ready(function() {
        return new MutationObserver(ThreadHiding.catalogSave).observe($.id('threads'), {
          attributes: true,
          subtree: true,
          attributeFilter: ['style']
        });
      });
    },
    catalogSave: function() {
      var hiddenThreads2, threadID;
      hiddenThreads2 = JSON.parse(localStorage.getItem("4chan-hide-t-" + g.BOARD)) || {};
      for (threadID in hiddenThreads2) {
        if (!(threadID in ThreadHiding.hiddenThreads)) {
          ThreadHiding.db.set({
            boardID: g.BOARD.ID,
            threadID: threadID,
            val: {
              makeStub: Conf['Stubs']
            }
          });
        }
      }
      for (threadID in ThreadHiding.hiddenThreads) {
        if (!(threadID in hiddenThreads2)) {
          ThreadHiding.db["delete"]({
            boardID: g.BOARD.ID,
            threadID: threadID
          });
        }
      }
      return ThreadHiding.hiddenThreads = hiddenThreads2;
    },
    node: function() {
      var data;
      if (this.isReply || this.isClone || this.isFetchedQuote) {
        return;
      }
      if (data = ThreadHiding.db.get({
        boardID: this.board.ID,
        threadID: this.ID
      })) {
        ThreadHiding.hide(this.thread, data.makeStub);
      }
      if (!Conf['Thread Hiding Buttons']) {
        return;
      }
      return $.prepend(this.nodes.root, ThreadHiding.makeButton(this.thread, 'hide'));
    },
    onIndexBuild: function(nodes) {
      var i, len, root, thread;
      for (i = 0, len = nodes.length; i < len; i++) {
        root = nodes[i];
        thread = Get.threadFromRoot(root);
        if (thread.isHidden && thread.stub && !root.contains(thread.stub)) {
          ThreadHiding.makeStub(thread, root);
        }
      }
    },
    menu: {
      init: function() {
        var apply, div, hideStubLink, makeStub;
        if (g.VIEW !== 'index' || !Conf['Menu'] || !Conf['Thread Hiding Link']) {
          return;
        }
        div = $.el('div', {
          className: 'hide-thread-link',
          textContent: 'Hide'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', ThreadHiding.menu.hide);
        makeStub = UI.checkbox('Stubs', 'Make stub');
        Menu.menu.addEntry({
          el: div,
          order: 20,
          open: function(arg) {
            var isReply, thread;
            thread = arg.thread, isReply = arg.isReply;
            if (isReply || thread.isHidden || Conf['JSON Index'] && Conf['Index Mode'] === 'catalog') {
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
        div = $.el('a', {
          className: 'show-thread-link',
          textContent: 'Show',
          href: 'javascript:;'
        });
        $.on(div, 'click', ThreadHiding.menu.show);
        Menu.menu.addEntry({
          el: div,
          order: 20,
          open: function(arg) {
            var isReply, thread;
            thread = arg.thread, isReply = arg.isReply;
            if (isReply || !thread.isHidden || Conf['JSON Index'] && Conf['Index Mode'] === 'catalog') {
              return false;
            }
            ThreadHiding.menu.thread = thread;
            return true;
          }
        });
        hideStubLink = $.el('a', {
          textContent: 'Hide stub',
          href: 'javascript:;'
        });
        $.on(hideStubLink, 'click', ThreadHiding.menu.hideStub);
        return Menu.menu.addEntry({
          el: hideStubLink,
          order: 15,
          open: function(arg) {
            var isReply, thread;
            thread = arg.thread, isReply = arg.isReply;
            if (isReply || !thread.isHidden || Conf['JSON Index'] && Conf['Index Mode'] === 'catalog') {
              return false;
            }
            return ThreadHiding.menu.thread = thread;
          }
        });
      },
      hide: function() {
        var makeStub, thread;
        makeStub = $('input', this.parentNode).checked;
        thread = ThreadHiding.menu.thread;
        ThreadHiding.hide(thread, makeStub);
        ThreadHiding.saveHiddenState(thread, makeStub);
        return $.event('CloseMenu');
      },
      show: function() {
        var thread;
        thread = ThreadHiding.menu.thread;
        ThreadHiding.show(thread);
        ThreadHiding.saveHiddenState(thread);
        return $.event('CloseMenu');
      },
      hideStub: function() {
        var thread;
        thread = ThreadHiding.menu.thread;
        ThreadHiding.show(thread);
        ThreadHiding.hide(thread, false);
        ThreadHiding.saveHiddenState(thread, false);
        $.event('CloseMenu');
      }
    },
    makeButton: function(thread, type) {
      var a;
      a = $.el('a', {
        className: type + "-thread-button",
        href: 'javascript:;'
      });
      $.extend(a, {
        innerHTML: "<span class=\"fa fa-" + ((type === "hide") ? "minus" : "plus") + "-square\"></span>"
      });
      a.dataset.fullID = thread.fullID;
      $.on(a, 'click', ThreadHiding.toggle);
      return a;
    },
    makeStub: function(thread, root) {
      var a, numReplies, summary;
      numReplies = $$('.thread > .replyContainer', root).length;
      if (summary = $('.summary', root)) {
        numReplies += +summary.textContent.match(/\d+/);
      }
      a = ThreadHiding.makeButton(thread, 'show');
      $.add(a, $.tn(" " + thread.OP.info.nameBlock + " (" + (numReplies === 1 ? '1 reply' : numReplies + " replies") + ")"));
      thread.stub = $.el('div', {
        className: 'stub'
      });
      if (Conf['Menu']) {
        $.add(thread.stub, [a, Menu.makeButton(thread.OP)]);
      } else {
        $.add(thread.stub, a);
      }
      return $.prepend(root, thread.stub);
    },
    saveHiddenState: function(thread, makeStub) {
      if (thread.isHidden) {
        ThreadHiding.db.set({
          boardID: thread.board.ID,
          threadID: thread.ID,
          val: {
            makeStub: makeStub
          }
        });
      } else {
        ThreadHiding.db["delete"]({
          boardID: thread.board.ID,
          threadID: thread.ID
        });
      }
      return ThreadHiding.catalogSet(thread.board);
    },
    toggle: function(thread) {
      if (!(thread instanceof Thread)) {
        thread = g.threads[this.dataset.fullID];
      }
      if (thread.isHidden) {
        ThreadHiding.show(thread);
      } else {
        ThreadHiding.hide(thread);
      }
      return ThreadHiding.saveHiddenState(thread);
    },
    hide: function(thread, makeStub) {
      var threadRoot;
      if (makeStub == null) {
        makeStub = Conf['Stubs'];
      }
      if (thread.isHidden) {
        return;
      }
      threadRoot = thread.OP.nodes.root.parentNode;
      thread.isHidden = true;
      if (Conf['JSON Index']) {
        Index.updateHideLabel();
      }
      if (!makeStub) {
        return threadRoot.hidden = true;
      }
      return ThreadHiding.makeStub(thread, threadRoot);
    },
    show: function(thread) {
      var threadRoot;
      if (thread.stub) {
        $.rm(thread.stub);
        delete thread.stub;
      }
      threadRoot = thread.OP.nodes.root.parentNode;
      threadRoot.hidden = thread.isHidden = false;
      if (Conf['JSON Index']) {
        return Index.updateHideLabel();
      }
    }
  };

  return ThreadHiding;

}).call(this);

Build = (function() {
  var Build,
    slice = [].slice;

  Build = {
    staticPath: '//s.4cdn.org/image/',
    gifIcon: window.devicePixelRatio >= 2 ? '@2x.gif' : '.gif',
    spoilerRange: {},
    unescape: function(text) {
      if (text == null) {
        return text;
      }
      return text.replace(/<[^>]*>/g, '').replace(/&(amp|#039|quot|lt|gt|#44);/g, function(c) {
        return {
          '&amp;': '&',
          '&#039;': "'",
          '&quot;': '"',
          '&lt;': '<',
          '&gt;': '>',
          '&#44;': ','
        }[c];
      });
    },
    shortFilename: function(filename) {
      var ext;
      ext = filename.match(/\.?[^\.]*$/)[0];
      if (filename.length - ext.length > 30) {
        return (filename.match(/(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[^]){0,25}/)[0]) + "(...)" + ext;
      } else {
        return filename;
      }
    },
    spoilerThumb: function(boardID) {
      var spoilerRange;
      if (spoilerRange = Build.spoilerRange[boardID]) {
        return Build.staticPath + "spoiler-" + boardID + (Math.floor(1 + spoilerRange * Math.random())) + ".png";
      } else {
        return Build.staticPath + "spoiler.png";
      }
    },
    sameThread: function(boardID, threadID) {
      return g.VIEW === 'thread' && g.BOARD.ID === boardID && g.THREADID === +threadID;
    },
    postURL: function(boardID, threadID, postID) {
      if (Build.sameThread(boardID, threadID)) {
        return "#p" + postID;
      } else {
        return "/" + boardID + "/thread/" + threadID + "#p" + postID;
      }
    },
    parseJSON: function(data, boardID) {
      var o;
      o = {
        postID: data.no,
        threadID: data.resto || data.no,
        boardID: boardID,
        isReply: !!data.resto,
        isSticky: !!data.sticky,
        isClosed: !!data.closed,
        isArchived: !!data.archived,
        fileDeleted: !!data.filedeleted
      };
      o.info = {
        subject: Build.unescape(data.sub),
        email: Build.unescape(data.email),
        name: Build.unescape(data.name) || '',
        tripcode: data.trip,
        uniqueID: data.id,
        flagCode: data.country,
        flag: Build.unescape(data.country_name),
        dateUTC: data.time,
        dateText: data.now,
        commentHTML: {
          innerHTML: data.com || ''
        }
      };
      if (data.capcode) {
        o.info.capcode = data.capcode.replace(/_highlight$/, '').replace(/_/g, ' ').replace(/\b\w/g, function(c) {
          return c.toUpperCase();
        });
        o.capcodeHighlight = /_highlight$/.test(data.capcode);
        delete o.info.uniqueID;
      }
      if (data.ext) {
        o.file = {
          name: (Build.unescape(data.filename)) + data.ext,
          url: boardID === 'f' ? location.protocol + "//i.4cdn.org/" + boardID + "/" + (encodeURIComponent(data.filename)) + data.ext : location.protocol + "//i.4cdn.org/" + boardID + "/" + data.tim + data.ext,
          height: data.h,
          width: data.w,
          MD5: data.md5,
          size: $.bytesToString(data.fsize),
          thumbURL: location.protocol + "//i.4cdn.org/" + boardID + "/" + data.tim + "s.jpg",
          theight: data.tn_h,
          twidth: data.tn_w,
          isSpoiler: !!data.spoiler,
          tag: data.tag
        };
        if (!/\.pdf$/.test(o.file.url)) {
          o.file.dimensions = o.file.width + "x" + o.file.height;
        }
      }
      return o;
    },
    parseComment: function(html) {
      html = html.replace(/<br\b[^<]*>/gi, '\n').replace(/\n\n<span\b[^<]* class="abbr"[^]*$/i, '').replace(/^<b\b[^<]*>Rolled [^<]*<\/b>/i, '').replace(/<span\b[^<]* class="fortune"[^]*$/i, '').replace(/<[^>]*>/g, '');
      return Build.unescape(html);
    },
    postFromObject: function(data, boardID, suppressThumb) {
      var o;
      o = Build.parseJSON(data, boardID);
      return Build.post(o, suppressThumb);
    },
    post: function(o, suppressThumb) {
      var boardID, capcode, capcodeDescription, capcodeLC, capcodeLong, capcodePlural, commentHTML, container, dateText, dateUTC, email, file, fileBlock, fileThumb, fileURL, flag, flagCode, gifIcon, href, i, len, match, name, postClass, postID, postInfo, postLink, protocol, quote, quoteLink, ref, ref1, shortFilename, staticPath, subject, threadID, tripcode, uniqueID, wholePost;
      postID = o.postID, threadID = o.threadID, boardID = o.boardID, file = o.file;
      ref = o.info, subject = ref.subject, email = ref.email, name = ref.name, tripcode = ref.tripcode, capcode = ref.capcode, uniqueID = ref.uniqueID, flagCode = ref.flagCode, flag = ref.flag, dateUTC = ref.dateUTC, dateText = ref.dateText, commentHTML = ref.commentHTML;
      staticPath = Build.staticPath, gifIcon = Build.gifIcon;

      /* Post Info */
      if (capcode) {
        capcodeLC = capcode.toLowerCase();
        if (capcode === 'Founder') {
          capcodePlural = 'the Founder';
          capcodeDescription = "4chan's Founder";
        } else {
          capcodeLong = {
            'Admin': 'Administrator',
            'Mod': 'Moderator'
          }[capcode] || capcode;
          capcodePlural = capcodeLong + "s";
          capcodeDescription = "a 4chan " + capcodeLong;
        }
      }
      postLink = Build.postURL(boardID, threadID, postID);
      quoteLink = Build.sameThread(boardID, threadID) ? "javascript:quote('" + (+postID) + "');" : "/" + boardID + "/thread/" + threadID + "#q" + postID;
      postInfo = {
        innerHTML: "<div class=\"postInfo desktop\" id=\"pi" + E(postID) + "\"><input type=\"checkbox\" name=\"" + E(postID) + "\" value=\"delete\"> " + ((!o.isReply || boardID === "f" || subject) ? "<span class=\"subject\">" + E(subject || "") + "</span> " : "") + "<span class=\"nameBlock" + ((capcode) ? " capcode" + E(capcode) : "") + "\">" + ((email) ? "<a href=\"mailto:" + E(encodeURIComponent(email).replace(/%40/g, "@")) + "\" class=\"useremail\">" : "") + "<span class=\"name" + ((capcode) ? " capcode" : "") + "\">" + E(name) + "</span>" + ((tripcode) ? " <span class=\"postertrip\">" + E(tripcode) + "</span>" : "") + ((capcode) ? " <strong class=\"capcode hand id_" + E(capcodeLC) + "\" title=\"Highlight posts by " + E(capcodePlural) + "\">## " + E(capcode) + "</strong>" : "") + ((email) ? "</a>" : "") + ((boardID === "f" && !o.isReply || capcode) ? "" : " ") + ((capcode) ? " <img src=\"" + E(staticPath) + E(capcodeLC) + "icon" + E(gifIcon) + "\" alt=\"" + E(capcode) + " Icon\" title=\"This user is " + E(capcodeDescription) + ".\" class=\"identityIcon retina\">" : "") + ((uniqueID && !capcode) ? " <span class=\"posteruid id_" + E(uniqueID) + "\">(ID: <span class=\"hand\" title=\"Highlight posts by this ID\">" + E(uniqueID) + "</span>)</span>" : "") + ((flagCode) ? " <span title=\"" + E(flag) + "\" class=\"flag flag-" + E(flagCode.toLowerCase()) + "\"></span>" : "") + "</span> <span class=\"dateTime\" data-utc=\"" + E(dateUTC) + "\">" + E(dateText) + "</span> <span class=\"postNum" + ((!(boardID === "f" && !o.isReply)) ? " desktop" : "") + "\"><a href=\"" + E(postLink) + "\" title=\"Link to this post\">No.</a><a href=\"" + E(quoteLink) + "\" title=\"Reply to this post\">" + E(postID) + "</a>" + ((o.isSticky) ? " <img src=\"" + E(staticPath) + "sticky" + E(gifIcon) + "\" alt=\"Sticky\" title=\"Sticky\" class=\"stickyIcon retina\">" : "") + ((o.isClosed && !o.isArchived) ? " <img src=\"" + E(staticPath) + "closed" + E(gifIcon) + "\" alt=\"Closed\" title=\"Closed\" class=\"closedIcon retina\">" : "") + ((o.isArchived) ? " <img src=\"" + E(staticPath) + "archived" + E(gifIcon) + "\" alt=\"Archived\" title=\"Archived\" class=\"archivedIcon retina\">" : "") + ((!o.isReply && g.VIEW === "index") ? " &nbsp; <span>[<a href=\"/" + E(boardID) + "/thread/" + E(threadID) + "\" class=\"replylink\">Reply</a>]</span>" : "") + "</span></div>"
      };

      /* File Info */
      if (file) {
        protocol = /^https?:(?=\/\/i\.4cdn\.org\/)/;
        fileURL = file.url.replace(protocol, '');
        shortFilename = Build.shortFilename(file.name);
        fileThumb = file.isSpoiler ? Build.spoilerThumb(boardID) : file.thumbURL.replace(protocol, '');
      }
      fileBlock = {
        innerHTML: ((file) ? "<div class=\"file\" id=\"f" + E(postID) + "\">" + ((boardID === "f") ? "<div class=\"fileInfo\"><span class=\"fileText\" id=\"fT" + E(postID) + "\">File: <a data-width=\"" + E(file.width) + "\" data-height=\"" + E(file.height) + "\" href=\"" + E(fileURL) + "\" target=\"_blank\">" + E(file.name) + "</a>-(" + E(file.size) + ", " + E(file.dimensions) + ((file.tag) ? ", " + E(file.tag) : "") + ")</span></div>" : "<div class=\"fileText\" id=\"fT" + E(postID) + "\"" + ((file.isSpoiler) ? " title=\"" + E(file.name) + "\"" : "") + ">File: <a" + ((file.name === shortFilename || file.isSpoiler) ? "" : " title=\"" + E(file.name) + "\"") + " href=\"" + E(fileURL) + "\" target=\"_blank\">" + ((file.isSpoiler) ? "Spoiler Image" : E(shortFilename)) + "</a> (" + E(file.size) + ", " + E(file.dimensions || "PDF") + ")</div><a class=\"fileThumb" + ((file.isSpoiler) ? " imgspoiler" : "") + "\" href=\"" + E(fileURL) + "\" target=\"_blank\"><img" + ((suppressThumb) ? " data-src=\"" + E(fileThumb) + "\"" : " src=\"" + E(fileThumb) + "\"") + " alt=\"" + E(file.size) + "\" data-md5=\"" + E(file.MD5) + "\" style=\"height: " + E(file.isSpoiler ? 100 : file.theight) + "px; width: " + E(file.isSpoiler ? 100 : file.twidth) + "px;\"></a>") + "</div>" : ((o.fileDeleted) ? "<div class=\"file\" id=\"f" + E(postID) + "\"><span class=\"fileThumb\"><img src=\"" + E(staticPath) + "filedeleted-res" + E(gifIcon) + "\" alt=\"File deleted.\" class=\"fileDeletedRes retina\"></span></div>" : ""))
      };

      /* Whole Post */
      postClass = o.isReply ? 'reply' : 'op';
      wholePost = {
        innerHTML: ((o.isReply) ? "<div class=\"sideArrows\" id=\"sa" + E(postID) + "\">&gt;&gt;</div>" : "") + "<div id=\"p" + E(postID) + "\" class=\"post " + E(postClass) + ((o.capcodeHighlight) ? " highlightPost" : "") + "\">" + ((o.isReply) ? (postInfo).innerHTML + (fileBlock).innerHTML : (fileBlock).innerHTML + (postInfo).innerHTML) + "<blockquote class=\"postMessage\" id=\"m" + E(postID) + "\">" + (commentHTML).innerHTML + "</blockquote></div>"
      };
      container = $.el('div', {
        className: "postContainer " + postClass + "Container",
        id: "pc" + postID
      });
      $.extend(container, wholePost);
      ref1 = $$('.quotelink', container);
      for (i = 0, len = ref1.length; i < len; i++) {
        quote = ref1[i];
        href = quote.getAttribute('href');
        if ((href[0] === '#') && !(Build.sameThread(boardID, threadID))) {
          quote.href = ("/" + boardID + "/thread/" + threadID) + href;
        } else if ((match = href.match(/^\/([^\/]+)\/thread\/(\d+)/)) && (Build.sameThread(match[1], match[2]))) {
          quote.href = href.match(/(#[^#]*)?$/)[0] || '#';
        } else if (/^\d+(#|$)/.test(href) && !(g.VIEW === 'thread' && g.BOARD.ID === boardID)) {
          quote.href = "/" + boardID + "/thread/" + href;
        }
      }
      return container;
    },
    summaryText: function(status, posts, files) {
      var text;
      text = '';
      if (status) {
        text += status + " ";
      }
      text += posts + " post" + (posts > 1 ? 's' : '');
      if (+files) {
        text += " and " + files + " image repl" + (files > 1 ? 'ies' : 'y');
      }
      return text += " " + (status === '-' ? 'shown' : 'omitted') + ".";
    },
    summary: function(boardID, threadID, posts, files) {
      return $.el('a', {
        className: 'summary',
        textContent: Build.summaryText('', posts, files),
        href: "/" + boardID + "/thread/" + threadID
      });
    },
    thread: function(board, data) {
      var OP, root;
      Build.spoilerRange[board] = data.custom_spoiler;
      if (OP = board.posts[data.no]) {
        if (OP.isFetchedQuote) {
          OP = null;
        }
      }
      if (OP && (root = OP.nodes.root.parentNode)) {
        $.rmAll(root);
      } else {
        root = $.el('div', {
          className: 'thread',
          id: "t" + data.no
        });
      }
      $.add(root, Build.excerptThread(board, data, OP));
      return root;
    },
    excerptThread: function(board, data, OP) {
      var files, nodes, posts, ref;
      nodes = [OP ? OP.nodes.root : Build.postFromObject(data, board.ID, true)];
      if (data.omitted_posts || !Conf['Show Replies'] && data.replies) {
        ref = Conf['Show Replies'] ? [
          data.omitted_posts, data.images - data.last_replies.filter(function(data) {
            return !!data.ext;
          }).length
        ] : [data.replies, data.images], posts = ref[0], files = ref[1];
        nodes.push(Build.summary(board.ID, data.no, posts, files));
      }
      return nodes;
    },
    catalogThread: function(thread) {
      var br, cc, comment, data, exif, fileCount, gifIcon, href, i, imgClass, j, k, l, len, len1, len2, len3, pageCount, postCount, pp, quote, ref, ref1, ref2, ref3, ref4, root, spoilerRange, src, staticPath;
      staticPath = Build.staticPath, gifIcon = Build.gifIcon;
      data = Index.liveThreadData[Index.liveThreadIDs.indexOf(thread.ID)];
      if (data.spoiler && !Conf['Reveal Spoiler Thumbnails']) {
        src = staticPath + "spoiler";
        if (spoilerRange = Build.spoilerRange[thread.board]) {
          src += ("-" + thread.board) + Math.floor(1 + spoilerRange * Math.random());
        }
        src += '.png';
        imgClass = 'spoiler-file';
      } else if (data.filedeleted) {
        src = staticPath + "filedeleted-res" + gifIcon;
        imgClass = 'deleted-file';
      } else if (thread.OP.file) {
        src = thread.OP.file.thumbURL;
      } else {
        src = staticPath + "nofile.png";
        imgClass = 'no-file';
      }
      postCount = data.replies + 1;
      fileCount = data.images + !!data.ext;
      pageCount = Math.floor(Index.liveThreadIDs.indexOf(thread.ID) / Index.threadsNumPerPage) + 1;
      comment = {
        innerHTML: data.com || ''
      };
      root = $.el('div', {
        className: 'catalog-thread'
      });
      $.extend(root, {
        innerHTML: "<a href=\"/" + E(thread.board) + "/thread/" + E(thread.ID) + "\"><img src=\"" + E(src) + "\"" + ((imgClass) ? " class=\"catalog-thumb " + E(imgClass) + "\"" : " class=\"catalog-thumb\" data-width=\"" + E(data.tn_w) + "\" data-height=\"" + E(data.tn_h) + "\"") + "></a><div class=\"catalog-stats\"><span title=\"Posts / Files / Page\"><span class=\"post-count\">" + E(postCount) + "</span> / <span class=\"file-count\">" + E(fileCount) + "</span> / <span class=\"page-count\">" + E(pageCount) + "</span></span><span class=\"catalog-icons\"></span></div>" + ((thread.OP.info.subject) ? "<div class=\"subject\">" + E(thread.OP.info.subject) + "</div>" : "") + "<div class=\"comment\">" + (comment).innerHTML + "</div>"
      });
      root.dataset.fullID = thread.fullID;
      if (thread.OP.highlights) {
        $.addClass.apply($, [root].concat(slice.call(thread.OP.highlights)));
      }
      ref = $$('.quotelink', root.lastElementChild);
      for (i = 0, len = ref.length; i < len; i++) {
        quote = ref[i];
        href = quote.getAttribute('href');
        if (href[0] === '#') {
          quote.href = ("/" + thread.board + "/thread/" + thread.ID) + href;
        }
      }
      ref1 = $$('.abbr, .exif', root.lastElementChild);
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        exif = ref1[j];
        $.rm(exif);
      }
      ref2 = $$('.prettyprint', root.lastElementChild);
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        pp = ref2[k];
        cc = $.el('span', {
          className: 'catalog-code'
        });
        $.add(cc, slice.call(pp.childNodes));
        $.replace(pp, cc);
      }
      ref3 = $$('br', root.lastElementChild);
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        br = ref3[l];
        if (((ref4 = br.previousSibling) != null ? ref4.nodeName : void 0) === 'BR') {
          $.rm(br);
        }
      }
      if (thread.isSticky) {
        $.add($('.catalog-icons', root), $.el('img', {
          src: staticPath + "sticky" + gifIcon,
          className: 'stickyIcon',
          title: 'Sticky'
        }));
      }
      if (thread.isClosed) {
        $.add($('.catalog-icons', root), $.el('img', {
          src: staticPath + "closed" + gifIcon,
          className: 'closedIcon',
          title: 'Closed'
        }));
      }
      if (data.bumplimit) {
        $.addClass($('.post-count', root), 'warning');
      }
      if (data.imagelimit) {
        $.addClass($('.file-count', root), 'warning');
      }
      return root;
    }
  };

  return Build;

}).call(this);

(function() {


}).call(this);

Get = (function() {
  var Get,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Get = {
    threadExcerpt: function(thread) {
      var OP, excerpt, ref, ref1;
      OP = thread.OP;
      excerpt = ("/" + thread.board + "/ - ") + (((ref = OP.info.subject) != null ? ref.trim() : void 0) || OP.info.commentDisplay.replace(/\n+/g, ' // ') || ((ref1 = OP.file) != null ? ref1.name : void 0) || OP.info.nameBlock);
      if (excerpt.length > 73) {
        return excerpt.slice(0, 70) + "...";
      }
      return excerpt;
    },
    threadFromRoot: function(root) {
      return g.threads[g.BOARD + "." + root.id.slice(1)];
    },
    threadFromNode: function(node) {
      return Get.threadFromRoot($.x('ancestor::div[@class="thread"]', node));
    },
    postFromRoot: function(root) {
      var index, post;
      if (root == null) {
        return null;
      }
      post = g.posts[root.dataset.fullID];
      index = root.dataset.clone;
      if (index) {
        return post.clones[index];
      } else {
        return post;
      }
    },
    postFromNode: function(root) {
      return Get.postFromRoot($.x('(ancestor::div[contains(@class,"postContainer")][1]|following::div[contains(@class,"postContainer")][1])', root));
    },
    postDataFromLink: function(link) {
      var boardID, path, postID, ref, threadID;
      if (link.hostname === 'boards.4chan.org') {
        path = link.pathname.split(/\/+/);
        boardID = path[1];
        threadID = path[3];
        postID = link.hash.slice(2);
      } else {
        ref = link.dataset, boardID = ref.boardID, threadID = ref.threadID, postID = ref.postID;
        threadID || (threadID = 0);
      }
      return {
        boardID: boardID,
        threadID: +threadID,
        postID: +postID
      };
    },
    allQuotelinksLinkingTo: function(post) {
      var fullID, handleQuotes, i, len, posts, qPost, quote, quotelinks, ref;
      quotelinks = [];
      posts = g.posts;
      fullID = post.fullID;
      handleQuotes = function(qPost, type) {
        var clone, i, len, ref;
        quotelinks.push.apply(quotelinks, qPost.nodes[type]);
        ref = qPost.clones;
        for (i = 0, len = ref.length; i < len; i++) {
          clone = ref[i];
          quotelinks.push.apply(quotelinks, clone.nodes[type]);
        }
      };
      posts.forEach(function(qPost) {
        if (indexOf.call(qPost.quotes, fullID) >= 0) {
          return handleQuotes(qPost, 'quotelinks');
        }
      });
      if (Conf['Quote Backlinks']) {
        ref = post.quotes;
        for (i = 0, len = ref.length; i < len; i++) {
          quote = ref[i];
          if (qPost = posts[quote]) {
            handleQuotes(qPost, 'backlinks');
          }
        }
      }
      return quotelinks.filter(function(quotelink) {
        var boardID, postID, ref1;
        ref1 = Get.postDataFromLink(quotelink), boardID = ref1.boardID, postID = ref1.postID;
        return boardID === post.board.ID && postID === post.ID;
      });
    },
    scriptData: function() {
      var i, len, ref, script;
      ref = $$('script:not([src])', d.head);
      for (i = 0, len = ref.length; i < len; i++) {
        script = ref[i];
        if (/\bcooldowns *=/.test(script.textContent)) {
          return script.textContent;
        }
      }
      return '';
    }
  };

  return Get;

}).call(this);

Header = (function() {
  var Header;

  Header = {
    init: function() {
      var barFixedToggler, barPositionToggler, box, customNavToggler, editCustomNav, footerToggler, headerToggler, linkJustifyToggler, menuButton, scrollHeaderToggler, shortcutToggler;
      this.menu = new UI.Menu('header');
      menuButton = $.el('span', {
        className: 'menu-button'
      });
      $.extend(menuButton, {
        innerHTML: "<i></i>"
      });
      box = UI.checkbox;
      barFixedToggler = box('Fixed Header', 'Fixed Header');
      headerToggler = box('Header auto-hide', 'Auto-hide header');
      scrollHeaderToggler = box('Header auto-hide on scroll', 'Auto-hide header on scroll');
      barPositionToggler = box('Bottom Header', 'Bottom header');
      linkJustifyToggler = box('Centered links', 'Centered links');
      customNavToggler = box('Custom Board Navigation', 'Custom board navigation');
      footerToggler = box('Bottom Board List', 'Hide bottom board list');
      shortcutToggler = box('Shortcut Icons', 'Shortcut Icons');
      editCustomNav = $.el('a', {
        textContent: 'Edit custom board navigation',
        href: 'javascript:;'
      });
      this.barFixedToggler = barFixedToggler.firstElementChild;
      this.scrollHeaderToggler = scrollHeaderToggler.firstElementChild;
      this.barPositionToggler = barPositionToggler.firstElementChild;
      this.linkJustifyToggler = linkJustifyToggler.firstElementChild;
      this.headerToggler = headerToggler.firstElementChild;
      this.footerToggler = footerToggler.firstElementChild;
      this.shortcutToggler = shortcutToggler.firstElementChild;
      this.customNavToggler = customNavToggler.firstElementChild;
      $.on(menuButton, 'click', this.menuToggle);
      $.on(this.headerToggler, 'change', this.toggleBarVisibility);
      $.on(this.barFixedToggler, 'change', this.toggleBarFixed);
      $.on(this.barPositionToggler, 'change', this.toggleBarPosition);
      $.on(this.scrollHeaderToggler, 'change', this.toggleHideBarOnScroll);
      $.on(this.linkJustifyToggler, 'change', this.toggleLinkJustify);
      $.on(this.footerToggler, 'change', this.toggleFooterVisibility);
      $.on(this.shortcutToggler, 'change', this.toggleShortcutIcons);
      $.on(this.customNavToggler, 'change', this.toggleCustomNav);
      $.on(editCustomNav, 'click', this.editCustomNav);
      this.setBarFixed(Conf['Fixed Header']);
      this.setHideBarOnScroll(Conf['Header auto-hide on scroll']);
      this.setBarVisibility(Conf['Header auto-hide']);
      this.setLinkJustify(Conf['Centered links']);
      this.setShortcutIcons(Conf['Shortcut Icons']);
      this.setFooterVisibility(Conf['Bottom Board List']);
      $.sync('Fixed Header', this.setBarFixed);
      $.sync('Header auto-hide on scroll', this.setHideBarOnScroll);
      $.sync('Bottom Header', this.setBarPosition);
      $.sync('Shortcut Icons', this.setShortcutIcons);
      $.sync('Header auto-hide', this.setBarVisibility);
      $.sync('Centered links', this.setLinkJustify);
      $.sync('Bottom Board List', this.setFooterVisibility);
      this.addShortcut(menuButton, 900);
      this.menu.addEntry({
        el: $.el('span', {
          textContent: 'Header'
        }),
        order: 107,
        subEntries: [
          {
            el: barFixedToggler
          }, {
            el: headerToggler
          }, {
            el: scrollHeaderToggler
          }, {
            el: barPositionToggler
          }, {
            el: linkJustifyToggler
          }, {
            el: footerToggler
          }, {
            el: shortcutToggler
          }, {
            el: customNavToggler
          }, {
            el: editCustomNav
          }
        ]
      });
      $.on(window, 'load popstate', Header.hashScroll);
      $.on(d, 'CreateNotification', this.createNotification);
      $.asap((function() {
        return d.body;
      }), (function(_this) {
        return function() {
          if (!Main.isThisPageLegit()) {
            return;
          }
          $.asap((function() {
            return $.id('boardNavMobile') || d.readyState !== 'loading';
          }), function() {
            var a, footer;
            footer = $.id('boardNavDesktop').cloneNode(true);
            footer.id = 'boardNavDesktopFoot';
            $('#navtopright', footer).id = 'navbotright';
            $('#settingsWindowLink', footer).id = 'settingsWindowLinkBot';
            Header.bottomBoardList = $('.boardList', footer);
            if (a = $("a[href*='/" + g.BOARD + "/']", footer)) {
              a.className = 'current';
            }
            Main.ready(function() {
              var absbot, oldFooter;
              if ((oldFooter = $.id('boardNavDesktopFoot'))) {
                return $.replace($('.boardList', oldFooter), Header.bottomBoardList);
              } else if ((absbot = $.id('absbot'))) {
                $.before(absbot, footer);
                return $.globalEval('window.cloneTopNav = function() {};');
              }
            });
            return Header.setBoardList();
          });
          $.prepend(d.body, _this.bar);
          $.add(d.body, Header.hover);
          _this.setBarPosition(Conf['Bottom Header']);
          return _this;
        };
      })(this));
      Main.ready((function(_this) {
        return function() {
          var cs;
          if (g.VIEW === 'catalog' || !Conf['Disable Native Extension']) {
            cs = $.el('a', {
              href: 'javascript:;'
            });
            if (g.VIEW === 'catalog') {
              cs.title = cs.textContent = 'Catalog Settings';
              cs.className = 'fa fa-book';
            } else {
              cs.title = cs.textContent = '4chan Settings';
              cs.className = 'native-settings';
            }
            $.on(cs, 'click', function() {
              return $.id('settingsWindowLink').click();
            });
            return _this.addShortcut(cs, 810);
          }
        };
      })(this));
      return this.enableDesktopNotifications();
    },
    bar: $.el('div', {
      id: 'header-bar'
    }),
    noticesRoot: $.el('div', {
      id: 'notifications'
    }),
    shortcuts: $.el('span', {
      id: 'shortcuts'
    }),
    hover: $.el('div', {
      id: 'hoverUI'
    }),
    toggle: $.el('div', {
      id: 'scroll-marker'
    }),
    setBoardList: function() {
      var a, boardList, btn, chr, i, j, len, len1, node, nodes, ref, ref1, spacer, span;
      Header.boardList = boardList = $.el('span', {
        id: 'board-list'
      });
      $.extend(boardList, {
        innerHTML: "<span id=\"custom-board-list\"></span><span id=\"full-board-list\" hidden><span class=\"hide-board-list-container brackets-wrap\"><a href=\"javascript:;\" class=\"hide-board-list-button\">&nbsp;-&nbsp;</a></span> <span class=\"boardList\"></span></span>"
      });
      btn = $('.hide-board-list-button', boardList);
      $.on(btn, 'click', Header.toggleBoardList);
      nodes = [];
      spacer = function() {
        return $.el('span', {
          className: 'spacer'
        });
      };
      ref = $('#boardNavDesktop > .boardList').childNodes;
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        switch (node.nodeName) {
          case '#text':
            ref1 = node.nodeValue;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              chr = ref1[j];
              span = $.el('span', {
                textContent: chr
              });
              if (chr === ' ') {
                span.className = 'space';
              }
              if (chr === ']') {
                nodes.push(spacer());
              }
              nodes.push(span);
              if (chr === '[') {
                nodes.push(spacer());
              }
            }
            break;
          case 'A':
            a = node.cloneNode(true);
            if (a.pathname.split('/')[1] === g.BOARD.ID) {
              a.className = 'current';
            }
            nodes.push(a);
        }
      }
      $.add($('.boardList', boardList), nodes);
      $.add(Header.bar, [Header.boardList, Header.shortcuts, Header.noticesRoot, Header.toggle]);
      Header.setCustomNav(Conf['Custom Board Navigation']);
      Header.generateBoardList(Conf['boardnav']);
      $.sync('Custom Board Navigation', Header.setCustomNav);
      return $.sync('boardnav', Header.generateBoardList);
    },
    generateBoardList: function(boardnav) {
      var as, list, nodes, re, t;
      list = $('#custom-board-list', Header.boardList);
      $.rmAll(list);
      if (!boardnav) {
        return;
      }
      boardnav = boardnav.replace(/(\r\n|\n|\r)/g, ' ');
      as = $$('#full-board-list a[title]', Header.boardList);
      re = /[\w@]+(-(all|title|replace|full|index|catalog|archive|expired|(mode|sort|text):"[^"]+"(,"[^"]+")?))*|[^\w@]+/g;
      nodes = (function() {
        var i, len, ref, results;
        ref = boardnav.match(re);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          t = ref[i];
          results.push(Header.mapCustomNavigation(t, as));
        }
        return results;
      })();
      $.add(list, nodes);
      return $.ready(CatalogLinks.initBoardList);
    },
    mapCustomNavigation: function(t, as) {
      var a, boardID, href, indexOptions, m, text, url;
      if (/^[^\w@]/.test(t)) {
        return $.tn(t);
      }
      text = url = null;
      t = t.replace(/-text:"([^"]+)"(?:,"([^"]+)")?/g, function(m0, m1, m2) {
        text = m1;
        url = m2;
        return '';
      });
      indexOptions = [];
      t = t.replace(/-(?:mode|sort):"([^"]+)"/g, function(m0, m1) {
        indexOptions.push(m1.toLowerCase().replace(/\ /g, '-'));
        return '';
      });
      indexOptions = indexOptions.join('/');
      if (/^toggle-all/.test(t)) {
        a = $.el('a', {
          className: 'show-board-list-button',
          textContent: text || '+',
          href: 'javascript:;'
        });
        $.on(a, 'click', Header.toggleBoardList);
        return a;
      }
      if (/^external/.test(t)) {
        a = $.el('a', {
          href: url || 'javascript:;',
          textContent: text || '+',
          className: 'external'
        });
        return a;
      }
      boardID = t.split('-')[0];
      if (boardID === 'current') {
        boardID = g.BOARD.ID;
      }
      a = (function() {
        var i, len, ref;
        if (boardID === '@') {
          return $.el('a', {
            href: 'https://twitter.com/4chan',
            title: '4chan Twitter',
            textContent: '@'
          });
        }
        for (i = 0, len = as.length; i < len; i++) {
          a = as[i];
          if (a.textContent === boardID) {
            return a.cloneNode(true);
          }
        }
        a = $.el('a', {
          href: "/" + boardID + "/",
          textContent: boardID
        });
        if ((ref = g.VIEW) === 'catalog' || ref === 'archive') {
          a.href += g.VIEW;
        }
        if (boardID === g.BOARD.ID) {
          a.className = 'current';
        }
        return a;
      })();
      a.textContent = /-title/.test(t) || /-replace/.test(t) && boardID === g.BOARD.ID ? a.title || a.textContent : /-full/.test(t) ? ("/" + boardID + "/") + (a.title ? " - " + a.title : '') : text || boardID;
      if (m = t.match(/-(index|catalog)/)) {
        if (!(boardID === 'f' && m[1] === 'catalog')) {
          a.dataset.only = m[1];
          a.href = CatalogLinks[m[1]](boardID);
          if (m[1] === 'catalog') {
            $.addClass(a, 'catalog');
          }
        } else {
          return a.firstChild;
        }
      }
      if (Conf['JSON Index'] && indexOptions) {
        a.dataset.indexOptions = indexOptions;
        if (a.hostname === 'boards.4chan.org' && a.pathname.split('/')[2] === '') {
          a.href += (a.hash ? '/' : '#') + indexOptions;
        }
      }
      if (/-archive/.test(t)) {
        if (href = Redirect.to('board', {
          boardID: boardID
        })) {
          a.href = href;
        } else {
          return a.firstChild;
        }
      }
      if (/-expired/.test(t)) {
        if (boardID !== 'b' && boardID !== 'f' && boardID !== 'trash') {
          a.href = "/" + boardID + "/archive";
        } else {
          return a.firstChild;
        }
      }
      if (boardID === '@') {
        $.addClass(a, 'navSmall');
      }
      return a;
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
    setLinkJustify: function(centered) {
      Header.linkJustifyToggler.checked = centered;
      if (centered) {
        return $.addClass(doc, 'centered-links');
      } else {
        return $.rmClass(doc, 'centered-links');
      }
    },
    toggleLinkJustify: function() {
      var centered;
      $.event('CloseMenu');
      centered = this.nodeName === 'INPUT' ? this.checked : void 0;
      Header.setLinkJustify(centered);
      return $.set('Centered links', centered);
    },
    setBarFixed: function(fixed) {
      Header.barFixedToggler.checked = fixed;
      if (fixed) {
        $.addClass(doc, 'fixed');
        return $.addClass(Header.bar, 'dialog');
      } else {
        $.rmClass(doc, 'fixed');
        return $.rmClass(Header.bar, 'dialog');
      }
    },
    toggleBarFixed: function() {
      $.event('CloseMenu');
      Header.setBarFixed(this.checked);
      Conf['Fixed Header'] = this.checked;
      return $.set('Fixed Header', this.checked);
    },
    setShortcutIcons: function(show) {
      Header.shortcutToggler.checked = show;
      if (show) {
        return $.addClass(doc, 'shortcut-icons');
      } else {
        return $.rmClass(doc, 'shortcut-icons');
      }
    },
    toggleShortcutIcons: function() {
      $.event('CloseMenu');
      Header.setShortcutIcons(this.checked);
      Conf['Shortcut Icons'] = this.checked;
      return $.set('Shortcut Icons', this.checked);
    },
    setBarVisibility: function(hide) {
      Header.headerToggler.checked = hide;
      $.event('CloseMenu');
      (hide ? $.addClass : $.rmClass)(Header.bar, 'autohide');
      return (hide ? $.addClass : $.rmClass)(doc, 'autohide');
    },
    toggleBarVisibility: function() {
      var hide, message;
      hide = this.nodeName === 'INPUT' ? this.checked : !$.hasClass(Header.bar, 'autohide');
      Conf['Header auto-hide'] = hide;
      $.set('Header auto-hide', hide);
      Header.setBarVisibility(hide);
      message = "The header bar will " + (hide ? 'automatically hide itself.' : 'remain visible.');
      return new Notice('info', message, 2);
    },
    setHideBarOnScroll: function(hide) {
      Header.scrollHeaderToggler.checked = hide;
      if (hide) {
        $.on(window, 'scroll', Header.hideBarOnScroll);
        return;
      }
      $.off(window, 'scroll', Header.hideBarOnScroll);
      $.rmClass(Header.bar, 'scroll');
      if (!Conf['Header auto-hide']) {
        return $.rmClass(Header.bar, 'autohide');
      }
    },
    toggleHideBarOnScroll: function() {
      var hide;
      hide = this.checked;
      $.cb.checked.call(this);
      return Header.setHideBarOnScroll(hide);
    },
    hideBarOnScroll: function() {
      var offsetY;
      offsetY = window.pageYOffset;
      if (offsetY > (Header.previousOffset || 0)) {
        $.addClass(Header.bar, 'autohide', 'scroll');
      } else {
        $.rmClass(Header.bar, 'autohide', 'scroll');
      }
      return Header.previousOffset = offsetY;
    },
    setBarPosition: function(bottom) {
      var args;
      Header.barPositionToggler.checked = bottom;
      $.event('CloseMenu');
      args = bottom ? ['bottom-header', 'top-header', 'after'] : ['top-header', 'bottom-header', 'add'];
      $.addClass(doc, args[0]);
      $.rmClass(doc, args[1]);
      return $[args[2]](Header.bar, Header.noticesRoot);
    },
    toggleBarPosition: function() {
      $.cb.checked.call(this);
      return Header.setBarPosition(this.checked);
    },
    setFooterVisibility: function(hide) {
      Header.footerToggler.checked = hide;
      return doc.classList.toggle('hide-bottom-board-list', hide);
    },
    toggleFooterVisibility: function() {
      var hide, message;
      $.event('CloseMenu');
      hide = this.nodeName === 'INPUT' ? this.checked : $.hasClass(doc, 'hide-bottom-board-list');
      Header.setFooterVisibility(hide);
      $.set('Bottom Board List', hide);
      message = hide ? 'The bottom navigation will now be hidden.' : 'The bottom navigation will remain visible.';
      return new Notice('info', message, 2);
    },
    setCustomNav: function(show) {
      var btn, cust, full, ref;
      Header.customNavToggler.checked = show;
      cust = $('#custom-board-list', Header.bar);
      full = $('#full-board-list', Header.bar);
      btn = $('.hide-board-list-container', full);
      return ref = show ? [false, true, false] : [true, false, true], cust.hidden = ref[0], full.hidden = ref[1], btn.hidden = ref[2], ref;
    },
    toggleCustomNav: function() {
      $.cb.checked.call(this);
      return Header.setCustomNav(this.checked);
    },
    editCustomNav: function() {
      var settings;
      Settings.open('Advanced');
      settings = $.id('fourchanx-settings');
      return $('[name=boardnav]', settings).focus();
    },
    hashScroll: function(e) {
      var el, hash;
      if (e) {
        if (e.state) {
          return;
        }
        if (!history.state) {
          history.replaceState({}, '');
        }
      }
      if ((hash = location.hash.slice(1))) {
        ReplyPruning.showIfHidden(hash);
        if ((el = $.id(hash))) {
          return $.queueTask(function() {
            return Header.scrollTo(el);
          });
        }
      }
    },
    scrollTo: function(root, down, needed) {
      var height, x;
      if (!root.offsetParent) {
        return;
      }
      if (down) {
        x = Header.getBottomOf(root);
        if (Conf['Fixed Header'] && Conf['Header auto-hide on scroll'] && Conf['Bottom header']) {
          height = Header.bar.getBoundingClientRect().height;
          if (x <= 0) {
            if (!Header.isHidden()) {
              x += height;
            }
          } else {
            if (Header.isHidden()) {
              x -= height;
            }
          }
        }
        if (!(needed && x >= 0)) {
          return window.scrollBy(0, -x);
        }
      } else {
        x = Header.getTopOf(root);
        if (Conf['Fixed Header'] && Conf['Header auto-hide on scroll'] && !Conf['Bottom header']) {
          height = Header.bar.getBoundingClientRect().height;
          if (x >= 0) {
            if (!Header.isHidden()) {
              x += height;
            }
          } else {
            if (Header.isHidden()) {
              x -= height;
            }
          }
        }
        if (!(needed && x >= 0)) {
          return window.scrollBy(0, x);
        }
      }
    },
    scrollToIfNeeded: function(root, down) {
      return Header.scrollTo(root, down, true);
    },
    getTopOf: function(root) {
      var headRect, top;
      top = root.getBoundingClientRect().top;
      if (Conf['Fixed Header'] && !Conf['Bottom Header']) {
        headRect = Header.toggle.getBoundingClientRect();
        top -= headRect.top + headRect.height;
      }
      return top;
    },
    getBottomOf: function(root) {
      var bottom, clientHeight, headRect;
      clientHeight = doc.clientHeight;
      bottom = clientHeight - root.getBoundingClientRect().bottom;
      if (Conf['Fixed Header'] && Conf['Bottom Header']) {
        headRect = Header.toggle.getBoundingClientRect();
        bottom -= clientHeight - headRect.bottom + headRect.height;
      }
      return bottom;
    },
    isNodeVisible: function(node) {
      var height;
      if (d.hidden || !doc.contains(node)) {
        return false;
      }
      height = node.getBoundingClientRect().height;
      return Header.getTopOf(node) + height >= 0 && Header.getBottomOf(node) + height >= 0;
    },
    isHidden: function() {
      var top;
      top = Header.bar.getBoundingClientRect().top;
      if (Conf['Bottom header']) {
        return top === doc.clientHeight;
      } else {
        return top < 0;
      }
    },
    addShortcut: function(el, index) {
      var i, item, len, ref, shortcut;
      shortcut = $.el('span', {
        className: 'shortcut brackets-wrap'
      });
      $.add(shortcut, el);
      shortcut.dataset.index = index;
      ref = $$('[data-index]', Header.shortcuts);
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (!(+item.dataset.index > +index)) {
          continue;
        }
        $.before(item, shortcut);
        return;
      }
      return $.add(Header.shortcuts, shortcut);
    },
    rmShortcut: function(el) {
      return $.rm(el.parentElement);
    },
    menuToggle: function(e) {
      return Header.menu.toggle(e, this, g);
    },
    createNotification: function(e) {
      var content, lifetime, notice, ref, type;
      ref = e.detail, type = ref.type, content = ref.content, lifetime = ref.lifetime;
      return notice = new Notice(type, content, lifetime);
    },
    areNotificationsEnabled: false,
    enableDesktopNotifications: function() {
      var authorize, disable, el, notice, ref;
      if (!(window.Notification && Conf['Desktop Notifications'])) {
        return;
      }
      switch (Notification.permission) {
        case 'granted':
          Header.areNotificationsEnabled = true;
          return;
        case 'denied':
          return;
      }
      el = $.el('span', {
        innerHTML: "4chan X needs your permission to show desktop notifications. [<a href=\"https://github.com/ccd0/4chan-x/wiki/Frequently-Asked-Questions#why-is-4chan-x-asking-for-permission-to-show-desktop-notifications\" target=\"_blank\">FAQ</a>]<br><button>Authorize</button> or <button>Disable</button>"
      });
      ref = $$('button', el), authorize = ref[0], disable = ref[1];
      $.on(authorize, 'click', function() {
        return Notification.requestPermission(function(status) {
          Header.areNotificationsEnabled = status === 'granted';
          if (status === 'default') {
            return;
          }
          return notice.close();
        });
      });
      $.on(disable, 'click', function() {
        $.set('Desktop Notifications', false);
        return notice.close();
      });
      return notice = new Notice('info', el);
    }
  };

  return Header;

}).call(this);

Index = (function() {
  var Index,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Index = {
    showHiddenThreads: false,
    changed: {},
    init: function() {
      var anchorEntry, input, j, k, label, len, len1, name, pinEntry, ref, ref1, ref2, ref3, ref4, ref5, ref6, refNavEntry, repliesEntry, select, sortEntry;
      if (g.BOARD.ID === 'f' || !Conf['JSON Index'] || g.VIEW !== 'index') {
        return;
      }
      Callbacks.CatalogThread.push({
        name: 'Catalog Features',
        cb: this.catalogNode
      });
      this.search = ((ref = history.state) != null ? ref.searched : void 0) || '';
      if ((ref1 = history.state) != null ? ref1.mode : void 0) {
        Conf['Index Mode'] = (ref2 = history.state) != null ? ref2.mode : void 0;
      }
      this.currentSort = (ref3 = history.state) != null ? ref3.sort : void 0;
      this.currentSort || (this.currentSort = typeof Conf['Index Sort'] === 'object' ? Conf['Index Sort'][g.BOARD.ID] || 'bump' : Conf['Index Sort']);
      this.currentPage = this.getCurrentPage();
      this.processHash();
      $.addClass(doc, 'index-loading', (Conf['Index Mode'].replace(/\ /g, '-')) + "-mode");
      $.on(window, 'popstate', this.cb.popstate);
      $.on(d, 'scroll', Index.scroll);
      this.button = $.el('a', {
        className: 'index-refresh-shortcut fa fa-refresh',
        title: 'Refresh',
        href: 'javascript:;',
        textContent: 'Refresh Index'
      });
      $.on(this.button, 'click', function() {
        return Index.update();
      });
      Header.addShortcut(this.button, 590);
      repliesEntry = {
        el: UI.checkbox('Show Replies', 'Show replies')
      };
      sortEntry = {
        el: UI.checkbox('Per-Board Sort Type', 'Per-board sort type', typeof Conf['Index Sort'] === 'object')
      };
      pinEntry = {
        el: UI.checkbox('Pin Watched Threads', 'Pin watched threads')
      };
      anchorEntry = {
        el: UI.checkbox('Anchor Hidden Threads', 'Anchor hidden threads')
      };
      refNavEntry = {
        el: UI.checkbox('Refreshed Navigation', 'Refreshed navigation')
      };
      sortEntry.el.title = 'Set the sorting order of each board independently.';
      pinEntry.el.title = 'Move watched threads to the start of the index.';
      anchorEntry.el.title = 'Move hidden threads to the end of the index.';
      refNavEntry.el.title = 'Refresh index when navigating through pages.';
      ref4 = [repliesEntry, pinEntry, anchorEntry, refNavEntry];
      for (j = 0, len = ref4.length; j < len; j++) {
        label = ref4[j];
        input = label.el.firstChild;
        name = input.name;
        $.on(input, 'change', $.cb.checked);
        switch (name) {
          case 'Show Replies':
            $.on(input, 'change', this.cb.replies);
            break;
          case 'Pin Watched Threads':
          case 'Anchor Hidden Threads':
            $.on(input, 'change', this.cb.resort);
        }
      }
      $.on(sortEntry.el.firstChild, 'change', this.cb.perBoardSort);
      Header.menu.addEntry({
        el: $.el('span', {
          textContent: 'Index Navigation'
        }),
        order: 100,
        subEntries: [repliesEntry, sortEntry, pinEntry, anchorEntry, refNavEntry]
      });
      this.navLinks = $.el('div', {
        className: 'navLinks json-index'
      });
      $.extend(this.navLinks, {
        innerHTML: "<span class=\"brackets-wrap indexlink\"><a href=\"#index\">Index</a></span> <span class=\"brackets-wrap cataloglink\"><a href=\"#catalog\">Catalog</a></span> <span class=\"brackets-wrap archlistlink\"><a href=\"./archive\">Archive</a></span> <span class=\"brackets-wrap bottomlink\"><a href=\"#bottom\">Bottom</a></span> <span class=\"brackets-wrap\" id=\"index-last-refresh\"><a href=\"javascript:;\"><time title=\"Last index refresh\">...</time></a></span> <input type=\"search\" id=\"index-search\" class=\"field\" placeholder=\"Search\"><a id=\"index-search-clear\" href=\"javascript:;\" title=\"Clear search\">×</a><span id=\"hidden-label\" hidden> &mdash; <span id=\"hidden-count\"></span> <span id=\"hidden-toggle\">[<a href=\"javascript:;\">Show</a>]</span></span><select id=\"index-mode\" name=\"Index Mode\"><option disabled>Index Mode</option><option value=\"paged\">Paged</option><option value=\"infinite\">Infinite scrolling</option><option value=\"all pages\">All threads</option><option value=\"catalog\">Catalog</option></select><select id=\"index-sort\" name=\"Index Sort\"><option disabled>Index Sort</option><option value=\"bump\">Bump order</option><option value=\"lastreply\">Last reply</option><option value=\"lastlong\">Last long reply</option><option value=\"birth\">Creation date</option><option value=\"replycount\">Reply count</option><option value=\"filecount\">File count</option></select><select id=\"index-size\" name=\"Index Size\"><option disabled>Image Size</option><option value=\"small\">Small</option><option value=\"large\">Large</option></select>"
      });
      $('.cataloglink a', this.navLinks).href = CatalogLinks.catalog();
      if ((ref5 = g.BOARD.ID) === 'b' || ref5 === 'trash') {
        $('.archlistlink', this.navLinks).hidden = true;
      }
      $.on($('#index-last-refresh a', this.navLinks), 'click', this.cb.refreshFront);
      this.searchInput = $('#index-search', this.navLinks);
      this.setupSearch();
      $.on(this.searchInput, 'input', this.onSearchInput);
      $.on($('#index-search-clear', this.navLinks), 'click', this.clearSearch);
      this.hideLabel = $('#hidden-label', this.navLinks);
      $.on($('#hidden-toggle a', this.navLinks), 'click', this.cb.toggleHiddenThreads);
      this.selectMode = $('#index-mode', this.navLinks);
      this.selectSort = $('#index-sort', this.navLinks);
      this.selectSize = $('#index-size', this.navLinks);
      $.on(this.selectMode, 'change', this.cb.mode);
      $.on(this.selectSort, 'change', this.cb.sort);
      $.on(this.selectSize, 'change', $.cb.value);
      $.on(this.selectSize, 'change', this.cb.size);
      ref6 = [this.selectMode, this.selectSize];
      for (k = 0, len1 = ref6.length; k < len1; k++) {
        select = ref6[k];
        select.value = Conf[select.name];
      }
      this.selectSort.value = Index.currentSort;
      this.root = $.el('div', {
        className: 'board json-index'
      });
      this.cb.size();
      this.pagelist = $.el('div', {
        className: 'pagelist json-index'
      });
      $.extend(this.pagelist, {
        innerHTML: "<div class=\"prev\"><a><button disabled>Previous</button></a></div><div class=\"pages\"></div><div class=\"next\"><a><button disabled>Next</button></a></div><div class=\"pages cataloglink\"><a href=\"./catalog\">Catalog</a></div>"
      });
      $('.cataloglink a', this.pagelist).href = CatalogLinks.catalog();
      $.on(this.pagelist, 'click', this.cb.pageNav);
      this.update(true);
      $.onExists(doc, 'title + *', function() {
        return d.title = d.title.replace(/\ -\ Page\ \d+/, '');
      });
      $.onExists(doc, '.board > .thread > .postContainer, .board + *', function() {
        var board, el, l, len2, len3, m, ref7, ref8, threadRoot, topNavPos;
        Index.hat = $('.board > .thread > img:first-child');
        if (Index.hat) {
          if (Index.nodes) {
            ref7 = Index.nodes;
            for (l = 0, len2 = ref7.length; l < len2; l++) {
              threadRoot = ref7[l];
              $.prepend(threadRoot, Index.hat.cloneNode(false));
            }
          }
          $.addClass(doc, 'hats-enabled');
          $.addStyle(".catalog-thread::after {background-image: url(" + Index.hat.src + ");}");
        }
        board = $('.board');
        $.replace(board, Index.root);
        $.event('PostsInserted');
        try {
          d.implementation.createDocument(null, null, null).appendChild(board);
        } catch (_error) {}
        ref8 = $$('.navLinks');
        for (m = 0, len3 = ref8.length; m < len3; m++) {
          el = ref8[m];
          $.rm(el);
        }
        $.rm($.id('ctrl-top'));
        topNavPos = $.id('delform').previousElementSibling;
        $.before(topNavPos, $.el('hr'));
        return $.before(topNavPos, Index.navLinks);
      });
      return Main.ready(function() {
        var pagelist;
        if ((pagelist = $('.pagelist'))) {
          $.replace(pagelist, Index.pagelist);
        }
        return $.rmClass(doc, 'index-loading');
      });
    },
    scroll: function() {
      var nodes, pageNum;
      if (Index.req || !Index.liveThreadData || Conf['Index Mode'] !== 'infinite' || (window.scrollY <= doc.scrollHeight - (300 + window.innerHeight))) {
        return;
      }
      if (Index.pageNum == null) {
        Index.pageNum = Index.currentPage;
      }
      pageNum = ++Index.pageNum;
      if (pageNum > Index.pagesNum) {
        return Index.endNotice();
      }
      nodes = Index.buildSinglePage(pageNum);
      if (Conf['Show Replies']) {
        Index.buildReplies(nodes);
      }
      return Index.buildStructure(nodes);
    },
    endNotice: (function() {
      var notify, reset;
      notify = false;
      reset = function() {
        return notify = false;
      };
      return function() {
        if (notify) {
          return;
        }
        notify = true;
        new Notice('info', "Last page reached.", 2);
        return setTimeout(reset, 3 * $.SECOND);
      };
    })(),
    menu: {
      init: function() {
        if (g.VIEW !== 'index' || !Conf['JSON Index'] || !Conf['Menu'] || !Conf['Thread Hiding Link'] || g.BOARD.ID === 'f') {
          return;
        }
        return Menu.menu.addEntry({
          el: $.el('a', {
            href: 'javascript:;',
            className: 'has-shortcut-text'
          }, {
            innerHTML: "<span></span><span class=\"shortcut-text\">Shift+click</span>"
          }),
          order: 20,
          open: function(arg) {
            var thread;
            thread = arg.thread;
            if (Conf['Index Mode'] !== 'catalog') {
              return false;
            }
            this.el.firstElementChild.textContent = thread.isHidden ? 'Unhide' : 'Hide';
            if (this.cb) {
              $.off(this.el, 'click', this.cb);
            }
            this.cb = function() {
              $.event('CloseMenu');
              return Index.toggleHide(thread);
            };
            $.on(this.el, 'click', this.cb);
            return true;
          }
        });
      }
    },
    catalogNode: function() {
      return $.on(this.nodes.thumb.parentNode, 'click', Index.onClick);
    },
    onClick: function(e) {
      var thread;
      if (e.button !== 0) {
        return;
      }
      thread = g.threads[this.parentNode.dataset.fullID];
      if (e.shiftKey) {
        Index.toggleHide(thread);
      } else {
        return;
      }
      return e.preventDefault();
    },
    toggleHide: function(thread) {
      $.rm(thread.catalogView.nodes.root);
      if (Index.showHiddenThreads) {
        ThreadHiding.show(thread);
        if (!ThreadHiding.db.get({
          boardID: thread.board.ID,
          threadID: thread.ID
        })) {
          return;
        }
      } else {
        ThreadHiding.hide(thread);
      }
      return ThreadHiding.saveHiddenState(thread);
    },
    cycleSortType: function() {
      var i, j, len, type, types;
      types = slice.call(Index.selectSort.options).filter(function(option) {
        return !option.disabled;
      });
      for (i = j = 0, len = types.length; j < len; i = ++j) {
        type = types[i];
        if (type.selected) {
          break;
        }
      }
      types[(i + 1) % types.length].selected = true;
      return $.event('change', null, Index.selectSort);
    },
    cb: {
      toggleHiddenThreads: function() {
        $('#hidden-toggle a', Index.navLinks).textContent = (Index.showHiddenThreads = !Index.showHiddenThreads) ? 'Hide' : 'Show';
        Index.sort();
        return Index.buildIndex();
      },
      mode: function() {
        Index.pushState({
          mode: this.value
        });
        return Index.pageLoad(false);
      },
      sort: function() {
        Index.pushState({
          sort: this.value
        });
        return Index.pageLoad(false);
      },
      resort: function() {
        Index.sort();
        return Index.buildIndex();
      },
      perBoardSort: function() {
        Conf['Index Sort'] = this.checked ? {} : '';
        return Index.saveSort();
      },
      size: function(e) {
        if (Conf['Index Mode'] !== 'catalog') {
          $.rmClass(Index.root, 'catalog-small');
          $.rmClass(Index.root, 'catalog-large');
        } else if (Conf['Index Size'] === 'small') {
          $.addClass(Index.root, 'catalog-small');
          $.rmClass(Index.root, 'catalog-large');
        } else {
          $.addClass(Index.root, 'catalog-large');
          $.rmClass(Index.root, 'catalog-small');
        }
        if (e) {
          return Index.buildIndex();
        }
      },
      replies: function() {
        Index.buildThreads();
        Index.sort();
        return Index.buildIndex();
      },
      popstate: function(e) {
        var mode, nCommands, page, ref, searched, sort;
        if (e != null ? e.state : void 0) {
          ref = e.state, searched = ref.searched, mode = ref.mode, sort = ref.sort;
          page = Index.getCurrentPage();
          Index.setState({
            search: searched,
            mode: mode,
            sort: sort,
            page: page
          });
          return Index.pageLoad(false);
        } else {
          nCommands = Index.processHash();
          if (Conf['Refreshed Navigation'] && nCommands) {
            return Index.update();
          } else {
            return Index.pageLoad();
          }
        }
      },
      pageNav: function(e) {
        var a;
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
          return;
        }
        switch (e.target.nodeName) {
          case 'BUTTON':
            e.target.blur();
            a = e.target.parentNode;
            break;
          case 'A':
            a = e.target;
            break;
          default:
            return;
        }
        if (a.textContent === 'Catalog') {
          return;
        }
        e.preventDefault();
        return Index.userPageNav(+a.pathname.split(/\/+/)[2] || 1);
      },
      refreshFront: function() {
        Index.pushState({
          page: 1
        });
        return Index.update();
      }
    },
    scrollToIndex: function() {
      return Header.scrollToIfNeeded((Index.navLinks.getBoundingClientRect().height ? Index.navLinks : Index.root));
    },
    getCurrentPage: function() {
      return +window.location.pathname.split(/\/+/)[2] || 1;
    },
    userPageNav: function(page) {
      Index.pushState({
        page: page
      });
      if (Conf['Refreshed Navigation']) {
        return Index.update();
      } else {
        return Index.pageLoad();
      }
    },
    hashCommands: {
      mode: {
        'paged': 'paged',
        'infinite-scrolling': 'infinite',
        'infinite': 'infinite',
        'all-threads': 'all pages',
        'all-pages': 'all pages',
        'catalog': 'catalog'
      },
      sort: {
        'bump-order': 'bump',
        'last-reply': 'lastreply',
        'last-long-reply': 'lastlong',
        'creation-date': 'birth',
        'reply-count': 'replycount',
        'file-count': 'filecount'
      }
    },
    processHash: function() {
      var command, commands, hash, j, leftover, len, mode, ref, sort, state;
      hash = ((ref = location.href.match(/#.*/)) != null ? ref[0] : void 0) || '';
      state = {
        replace: true
      };
      commands = hash.slice(1).split('/');
      leftover = [];
      for (j = 0, len = commands.length; j < len; j++) {
        command = commands[j];
        if ((mode = Index.hashCommands.mode[command])) {
          state.mode = mode;
        } else if (command === 'index') {
          state.mode = Conf['Previous Index Mode'];
          state.page = 1;
        } else if ((sort = Index.hashCommands.sort[command])) {
          state.sort = sort;
        } else if (/^s=/.test(command)) {
          state.search = decodeURIComponent(command.slice(2)).replace(/\+/g, ' ').trim();
        } else {
          leftover.push(command);
        }
      }
      hash = leftover.join('/');
      if (hash) {
        state.hash = "#" + hash;
      }
      Index.pushState(state);
      return commands.length - leftover.length;
    },
    pushState: function(state) {
      var hash, pageBeforeSearch, pathname, ref, replace, search;
      search = state.search, hash = state.hash, replace = state.replace;
      pageBeforeSearch = (ref = history.state) != null ? ref.oldpage : void 0;
      if ((search != null) && search !== Index.search) {
        state.page = search ? 1 : pageBeforeSearch || 1;
        if (!search) {
          pageBeforeSearch = void 0;
        } else if (!Index.search) {
          pageBeforeSearch = Index.currentPage;
        }
      }
      Index.setState(state);
      pathname = Index.currentPage === 1 ? "/" + g.BOARD + "/" : "/" + g.BOARD + "/" + Index.currentPage;
      hash || (hash = '');
      return history[replace ? 'replaceState' : 'pushState']({
        mode: Conf['Index Mode'],
        sort: Index.currentSort,
        searched: Index.search,
        oldpage: pageBeforeSearch
      }, '', location.protocol + "//" + location.host + pathname + hash);
    },
    setState: function(arg) {
      var hash, mode, page, ref, search, sort;
      search = arg.search, mode = arg.mode, sort = arg.sort, page = arg.page, hash = arg.hash;
      if ((search != null) && search !== Index.search) {
        Index.changed.search = true;
        Index.search = search;
      }
      if ((mode != null) && mode !== Conf['Index Mode']) {
        Index.changed.mode = true;
        Conf['Index Mode'] = mode;
        $.set('Index Mode', mode);
        if (!(mode === 'catalog' || Conf['Previous Index Mode'] === mode)) {
          Conf['Previous Index Mode'] = mode;
          $.set('Previous Index Mode', mode);
        }
      }
      if ((sort != null) && sort !== Index.currentSort) {
        Index.changed.sort = true;
        Index.currentSort = sort;
        Index.saveSort();
      }
      if ((ref = Conf['Index Mode']) === 'all pages' || ref === 'catalog') {
        page = 1;
      }
      if ((page != null) && page !== Index.currentPage) {
        Index.changed.page = true;
        Index.currentPage = page;
      }
      if (hash != null) {
        return Index.changed.hash = true;
      }
    },
    saveSort: function() {
      if (typeof Conf['Index Sort'] === 'object') {
        Conf['Index Sort'][g.BOARD.ID] = Index.currentSort;
      } else {
        Conf['Index Sort'] = Index.currentSort;
      }
      return $.set('Index Sort', Conf['Index Sort']);
    },
    pageLoad: function(scroll) {
      var hash, mode, page, ref, search, sort, threads;
      if (scroll == null) {
        scroll = true;
      }
      if (!Index.liveThreadData) {
        return;
      }
      ref = Index.changed, threads = ref.threads, search = ref.search, mode = ref.mode, sort = ref.sort, page = ref.page, hash = ref.hash;
      if (threads || search || sort) {
        Index.sort();
      }
      if (threads || search) {
        Index.buildPagelist();
      }
      if (search) {
        Index.setupSearch();
      }
      if (mode) {
        Index.setupMode();
      }
      if (sort) {
        Index.setupSort();
      }
      if (threads || search || mode || page || sort) {
        Index.buildIndex();
      }
      if (threads || search || mode || page) {
        Index.setPage();
      }
      if (scroll && !hash) {
        Index.scrollToIndex();
      }
      if (hash) {
        Header.hashScroll();
      }
      return Index.changed = {};
    },
    setupMode: function() {
      var j, len, mode, ref;
      ref = ['paged', 'infinite', 'all pages', 'catalog'];
      for (j = 0, len = ref.length; j < len; j++) {
        mode = ref[j];
        $[mode === Conf['Index Mode'] ? 'addClass' : 'rmClass'](doc, (mode.replace(/\ /g, '-')) + "-mode");
      }
      Index.selectMode.value = Conf['Index Mode'];
      Index.cb.size();
      Index.showHiddenThreads = false;
      return $('#hidden-toggle a', Index.navLinks).textContent = 'Show';
    },
    setupSort: function() {
      return Index.selectSort.value = Index.currentSort;
    },
    getPagesNum: function() {
      if (Index.search) {
        return Math.ceil(Index.sortedNodes.length / Index.threadsNumPerPage);
      } else {
        return Index.pagesNum;
      }
    },
    getMaxPageNum: function() {
      return Math.max(1, Index.getPagesNum());
    },
    buildPagelist: function() {
      var a, i, j, maxPageNum, nodes, pagesRoot, ref;
      pagesRoot = $('.pages', Index.pagelist);
      maxPageNum = Index.getMaxPageNum();
      if (pagesRoot.childElementCount !== maxPageNum) {
        nodes = [];
        for (i = j = 1, ref = maxPageNum; j <= ref; i = j += 1) {
          a = $.el('a', {
            textContent: i,
            href: i === 1 ? './' : i
          });
          nodes.push($.tn('['), a, $.tn('] '));
        }
        $.rmAll(pagesRoot);
        return $.add(pagesRoot, nodes);
      }
    },
    setPage: function() {
      var a, href, maxPageNum, next, pageNum, pagesRoot, prev, strong;
      pageNum = Index.currentPage;
      maxPageNum = Index.getMaxPageNum();
      pagesRoot = $('.pages', Index.pagelist);
      prev = pagesRoot.previousSibling.firstChild;
      next = pagesRoot.nextSibling.firstChild;
      href = Math.max(pageNum - 1, 1);
      prev.href = href === 1 ? './' : href;
      prev.firstChild.disabled = href === pageNum;
      href = Math.min(pageNum + 1, maxPageNum);
      next.href = href === 1 ? './' : href;
      next.firstChild.disabled = href === pageNum;
      if (strong = $('strong', pagesRoot)) {
        if (+strong.textContent === pageNum) {
          return;
        }
        $.replace(strong, strong.firstChild);
      } else {
        strong = $.el('strong');
      }
      a = pagesRoot.children[pageNum - 1];
      $.before(a, strong);
      return $.add(strong, a);
    },
    updateHideLabel: function() {
      var hiddenCount, ref, ref1, thread, threadID;
      hiddenCount = 0;
      ref = g.BOARD.threads;
      for (threadID in ref) {
        thread = ref[threadID];
        if (thread.isHidden) {
          if (ref1 = thread.ID, indexOf.call(Index.liveThreadIDs, ref1) >= 0) {
            hiddenCount++;
          }
        }
      }
      if (!hiddenCount) {
        Index.hideLabel.hidden = true;
        if (Index.showHiddenThreads) {
          Index.cb.toggleHiddenThreads();
        }
        return;
      }
      Index.hideLabel.hidden = false;
      return $('#hidden-count', Index.navLinks).textContent = hiddenCount === 1 ? '1 hidden thread' : hiddenCount + " hidden threads";
    },
    update: function(firstTime) {
      var now, ref, ref1;
      if ((ref = Index.req) != null) {
        ref.abort();
      }
      if ((ref1 = Index.notice) != null) {
        ref1.close();
      }
      if (Conf['Index Refresh Notifications'] && d.readyState !== 'loading') {
        Index.notice = new Notice('info', 'Refreshing index...');
      } else {
        now = Date.now();
        $.ready(function() {
          return Index.nTimeout = setTimeout((function() {
            if (Index.req && !Index.notice) {
              return Index.notice = new Notice('info', 'Refreshing index...');
            }
          }), 3 * $.SECOND - (Date.now() - now));
        });
      }
      if (!firstTime && d.readyState !== 'loading' && !$('.board + *')) {
        location.reload();
        return;
      }
      Index.req = $.ajax("//a.4cdn.org/" + g.BOARD + "/catalog.json", {
        onabort: Index.load,
        onloadend: Index.load
      }, {
        whenModified: 'Index'
      });
      return $.addClass(Index.button, 'fa-spin');
    },
    load: function(e) {
      var err, nTimeout, notice, ref, req, timeEl;
      $.rmClass(Index.button, 'fa-spin');
      req = Index.req, notice = Index.notice, nTimeout = Index.nTimeout;
      if (nTimeout) {
        clearTimeout(nTimeout);
      }
      delete Index.nTimeout;
      delete Index.req;
      delete Index.notice;
      if (e.type === 'abort') {
        req.onloadend = null;
        if (notice != null) {
          notice.close();
        }
        return;
      }
      if ((ref = req.status) !== 200 && ref !== 304) {
        err = "Index refresh failed. " + (req.status ? "Error " + req.statusText + " (" + req.status + ")" : 'Connection Error');
        if (notice) {
          notice.setType('warning');
          notice.el.lastElementChild.textContent = err;
          setTimeout(notice.close, $.SECOND);
        } else {
          new Notice('warning', err, 1);
        }
        return;
      }
      try {
        if (req.status === 200) {
          Index.parse(req.response);
        } else if (req.status === 304) {
          Index.pageLoad();
        }
      } catch (_error) {
        err = _error;
        c.error("Index failure: " + err.message, err.stack);
        if (notice) {
          notice.setType('error');
          notice.el.lastElementChild.textContent = 'Index refresh failed.';
          setTimeout(notice.close, $.SECOND);
        } else {
          new Notice('error', 'Index refresh failed.', 1);
        }
        return;
      }
      if (notice) {
        if (Conf['Index Refresh Notifications']) {
          notice.setType('success');
          notice.el.lastElementChild.textContent = 'Index refreshed!';
          setTimeout(notice.close, $.SECOND);
        } else {
          notice.close();
        }
      }
      timeEl = $('#index-last-refresh time', Index.navLinks);
      timeEl.dataset.utc = Date.parse(req.getResponseHeader('Last-Modified'));
      return RelativeDates.update(timeEl);
    },
    parse: function(pages) {
      $.cleanCache(function(url) {
        return /^\/\/a\.4cdn\.org\//.test(url);
      });
      Index.parseThreadList(pages);
      Index.buildThreads();
      Index.changed.threads = true;
      return Index.pageLoad();
    },
    parseThreadList: function(pages) {
      var ref;
      Index.pagesNum = pages.length;
      Index.threadsNumPerPage = ((ref = pages[0]) != null ? ref.threads.length : void 0) || 1;
      Index.liveThreadData = pages.reduce((function(arr, next) {
        return arr.concat(next.threads);
      }), []);
      Index.liveThreadIDs = Index.liveThreadData.map(function(data) {
        return data.no;
      });
      g.BOARD.threads.forEach(function(thread) {
        var ref1;
        if (ref1 = thread.ID, indexOf.call(Index.liveThreadIDs, ref1) < 0) {
          return thread.collect();
        }
      });
    },
    buildThreads: function() {
      var err, errors, i, j, len, posts, ref, thread, threadData, threadRoot, threads;
      if (!Index.liveThreadData) {
        return;
      }
      Index.nodes = [];
      threads = [];
      posts = [];
      ref = Index.liveThreadData;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        threadData = ref[i];
        try {
          threadRoot = Build.thread(g.BOARD, threadData);
          if (Index.hat) {
            $.prepend(threadRoot, Index.hat.cloneNode(false));
          }
          if (thread = g.BOARD.threads[threadData.no]) {
            thread.setCount('post', threadData.replies + 1, threadData.bumplimit);
            thread.setCount('file', threadData.images + !!threadData.ext, threadData.imagelimit);
            thread.setStatus('Sticky', !!threadData.sticky);
            thread.setStatus('Closed', !!threadData.closed);
          } else {
            thread = new Thread(threadData.no, g.BOARD);
            threads.push(thread);
          }
          Index.nodes.push(threadRoot);
          if (!(thread.OP && !thread.OP.isFetchedQuote)) {
            posts.push(new Post($('.opContainer', threadRoot), thread, g.BOARD));
          }
          thread.setPage(Math.floor(i / Index.threadsNumPerPage) + 1);
        } catch (_error) {
          err = _error;
          if (!errors) {
            errors = [];
          }
          errors.push({
            message: "Parsing of Thread No." + thread + " failed. Thread will be skipped.",
            error: err
          });
        }
      }
      if (errors) {
        Main.handleErrors(errors);
      }
      $.nodes(Index.nodes);
      Main.callbackNodes('Thread', threads);
      Main.callbackNodes('Post', posts);
      Index.updateHideLabel();
      return $.event('IndexRefresh');
    },
    buildReplies: function(threadRoots) {
      var data, err, errors, i, j, k, lastReplies, len, len1, node, nodes, post, posts, thread, threadRoot;
      posts = [];
      for (j = 0, len = threadRoots.length; j < len; j++) {
        threadRoot = threadRoots[j];
        thread = Get.threadFromRoot(threadRoot);
        i = Index.liveThreadIDs.indexOf(thread.ID);
        if (!(lastReplies = Index.liveThreadData[i].last_replies)) {
          continue;
        }
        nodes = [];
        for (k = 0, len1 = lastReplies.length; k < len1; k++) {
          data = lastReplies[k];
          if ((post = thread.posts[data.no]) && !post.isFetchedQuote) {
            nodes.push(post.nodes.root);
            continue;
          }
          nodes.push(node = Build.postFromObject(data, thread.board.ID));
          try {
            posts.push(new Post(node, thread, thread.board));
          } catch (_error) {
            err = _error;
            if (!errors) {
              errors = [];
            }
            errors.push({
              message: "Parsing of Post No." + data.no + " failed. Post will be skipped.",
              error: err
            });
          }
        }
        $.add(threadRoot, nodes);
      }
      if (errors) {
        Main.handleErrors(errors);
      }
      return Main.callbackNodes('Post', posts);
    },
    buildCatalogViews: function() {
      var catalogThreads, j, len, thread, threads;
      threads = Index.sortedNodes.map(function(threadRoot) {
        return Get.threadFromRoot(threadRoot);
      }).filter(function(thread) {
        return !thread.isHidden !== Index.showHiddenThreads;
      });
      catalogThreads = [];
      for (j = 0, len = threads.length; j < len; j++) {
        thread = threads[j];
        if (!thread.catalogView) {
          catalogThreads.push(new CatalogThread(Build.catalogThread(thread), thread));
        }
      }
      Main.callbackNodes('CatalogThread', catalogThreads);
      return threads.map(function(thread) {
        return thread.catalogView.nodes.root;
      });
    },
    sizeCatalogViews: function(nodes) {
      var height, j, len, node, ratio, ref, size, thumb, width;
      size = Conf['Index Size'] === 'small' ? 150 : 250;
      for (j = 0, len = nodes.length; j < len; j++) {
        node = nodes[j];
        thumb = $('.catalog-thumb', node);
        ref = thumb.dataset, width = ref.width, height = ref.height;
        if (!width) {
          continue;
        }
        ratio = size / Math.max(width, height);
        thumb.style.width = width * ratio + 'px';
        thumb.style.height = height * ratio + 'px';
      }
    },
    sort: function() {
      var j, lastlong, len, liveThreadData, liveThreadIDs, nodes, sortedNodes, sortedThreadIDs, threadID;
      liveThreadIDs = Index.liveThreadIDs, liveThreadData = Index.liveThreadData;
      if (!liveThreadData) {
        return;
      }
      sortedThreadIDs = (function() {
        switch (Index.currentSort) {
          case 'lastreply':
            return slice.call(liveThreadData).sort(function(a, b) {
              var num;
              if ((num = a.last_replies)) {
                a = num[num.length - 1];
              }
              if ((num = b.last_replies)) {
                b = num[num.length - 1];
              }
              return b.no - a.no;
            }).map(function(post) {
              return post.no;
            });
          case 'lastlong':
            lastlong = function(thread) {
              var i, j, r, ref;
              ref = thread.last_replies || [];
              for (i = j = ref.length - 1; j >= 0; i = j += -1) {
                r = ref[i];
                if (r.com && Build.parseComment(r.com).replace(/[^a-z]/ig, '').length >= 100) {
                  return r;
                }
              }
              return thread;
            };
            return slice.call(liveThreadData).sort(function(a, b) {
              return lastlong(b).no - lastlong(a).no;
            }).map(function(post) {
              return post.no;
            });
          case 'bump':
            return liveThreadIDs;
          case 'birth':
            return slice.call(liveThreadIDs).sort(function(a, b) {
              return b - a;
            });
          case 'replycount':
            return slice.call(liveThreadData).sort(function(a, b) {
              return b.replies - a.replies;
            }).map(function(post) {
              return post.no;
            });
          case 'filecount':
            return slice.call(liveThreadData).sort(function(a, b) {
              return b.images - a.images;
            }).map(function(post) {
              return post.no;
            });
        }
      })();
      Index.sortedNodes = sortedNodes = [];
      nodes = Index.nodes;
      for (j = 0, len = sortedThreadIDs.length; j < len; j++) {
        threadID = sortedThreadIDs[j];
        sortedNodes.push(nodes[Index.liveThreadIDs.indexOf(threadID)]);
      }
      if (Index.search && (nodes = Index.querySearch(Index.search))) {
        Index.sortedNodes = nodes;
      }
      Index.sortOnTop(function(thread) {
        return thread.isSticky;
      });
      Index.sortOnTop(function(thread) {
        return thread.isOnTop || Conf['Pin Watched Threads'] && ThreadWatcher.isWatched(thread);
      });
      if (Conf['Anchor Hidden Threads']) {
        return Index.sortOnTop(function(thread) {
          return !thread.isHidden;
        });
      }
    },
    sortOnTop: function(match) {
      var bottomNodes, j, len, ref, threadRoot, topNodes;
      topNodes = [];
      bottomNodes = [];
      ref = Index.sortedNodes;
      for (j = 0, len = ref.length; j < len; j++) {
        threadRoot = ref[j];
        (match(Get.threadFromRoot(threadRoot)) ? topNodes : bottomNodes).push(threadRoot);
      }
      return Index.sortedNodes = topNodes.concat(bottomNodes);
    },
    buildIndex: function() {
      var i, nodes, page, post;
      if (!Index.liveThreadData) {
        return;
      }
      switch (Conf['Index Mode']) {
        case 'all pages':
          nodes = Index.sortedNodes;
          break;
        case 'catalog':
          nodes = Index.buildCatalogViews();
          Index.sizeCatalogViews(nodes);
          break;
        default:
          if (Index.followedThreadID != null) {
            i = 0;
            while (Index.followedThreadID !== Get.threadFromRoot(Index.sortedNodes[i]).ID) {
              i++;
            }
            page = Math.floor(i / Index.threadsNumPerPage) + 1;
            if (page !== Index.currentPage) {
              Index.currentPage = page;
              Index.pushState({
                page: page
              });
              Index.setPage();
            }
          }
          nodes = Index.buildSinglePage(Index.currentPage);
      }
      delete Index.pageNum;
      $.rmAll(Index.root);
      $.rmAll(Header.hover);
      if (Conf['Index Mode'] === 'catalog') {
        return $.add(Index.root, nodes);
      } else {
        if (Conf['Show Replies']) {
          Index.buildReplies(nodes);
        }
        Index.buildStructure(nodes);
        if ((Index.followedThreadID != null) && (post = g.posts[g.BOARD + "." + Index.followedThreadID])) {
          return Header.scrollTo(post.nodes.root);
        }
      }
    },
    buildSinglePage: function(pageNum) {
      var nodesPerPage, offset;
      nodesPerPage = Index.threadsNumPerPage;
      offset = nodesPerPage * (pageNum - 1);
      return Index.sortedNodes.slice(offset, offset + nodesPerPage);
    },
    buildStructure: function(nodes) {
      var j, len, node, thumb;
      for (j = 0, len = nodes.length; j < len; j++) {
        node = nodes[j];
        if (thumb = $('img[data-src]', node)) {
          thumb.src = thumb.dataset.src;
          thumb.removeAttribute('data-src');
        }
        $.add(Index.root, [node, $.el('hr')]);
      }
      if (doc.contains(Index.root)) {
        $.event('PostsInserted');
      }
      return ThreadHiding.onIndexBuild(nodes);
    },
    clearSearch: function() {
      Index.searchInput.value = '';
      Index.onSearchInput();
      return Index.searchInput.focus();
    },
    setupSearch: function() {
      Index.searchInput.value = Index.search;
      if (Index.search) {
        return Index.searchInput.dataset.searching = 1;
      } else {
        return Index.searchInput.removeAttribute('data-searching');
      }
    },
    onSearchInput: function() {
      var search;
      search = Index.searchInput.value.trim();
      if (search === Index.search) {
        return;
      }
      Index.pushState({
        search: search,
        replace: !!search === !!Index.search
      });
      return Index.pageLoad(false);
    },
    querySearch: function(query) {
      var keywords;
      if (!(keywords = query.toLowerCase().match(/\S+/g))) {
        return;
      }
      return Index.sortedNodes.filter(function(threadRoot) {
        return Index.searchMatch(Get.threadFromRoot(threadRoot), keywords);
      });
    },
    searchMatch: function(thread, keywords) {
      var file, info, j, k, key, keyword, len, len1, ref, ref1, text;
      ref = thread.OP, info = ref.info, file = ref.file;
      text = [];
      ref1 = ['comment', 'subject', 'name', 'tripcode', 'email'];
      for (j = 0, len = ref1.length; j < len; j++) {
        key = ref1[j];
        if (key in info) {
          text.push(info[key]);
        }
      }
      if (file) {
        text.push(file.name);
      }
      text = text.join(' ').toLowerCase();
      for (k = 0, len1 = keywords.length; k < len1; k++) {
        keyword = keywords[k];
        if (-1 === text.indexOf(keyword)) {
          return false;
        }
      }
      return true;
    }
  };

  return Index;

}).call(this);

Polyfill = (function() {
  var Polyfill;

  Polyfill = {
    init: function() {
      return this.toBlob();
    },
    toBlob: function() {
      if (HTMLCanvasElement.prototype.toBlob) {
        return;
      }
      HTMLCanvasElement.prototype.toBlob = function(cb, type, encoderOptions) {
        var data, i, j, l, ref, ui8a, url;
        if (type == null) {
          type = 'image/png';
        }
        url = this.toDataURL(type, encoderOptions);
        data = atob(url.slice(url.indexOf(',') + 1));
        l = data.length;
        ui8a = new Uint8Array(l);
        for (i = j = 0, ref = l; j < ref; i = j += 1) {
          ui8a[i] = data.charCodeAt(i);
        }
        return cb(new Blob([ui8a], {
          type: type
        }));
      };
      return $.globalEval("HTMLCanvasElement.prototype.toBlob = (" + HTMLCanvasElement.prototype.toBlob + ");");
    }
  };

  return Polyfill;

}).call(this);

Settings = (function() {
  var Settings,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Settings = {
    init: function() {
      var add, link, settings;
      link = $.el('a', {
        className: 'settings-link fa fa-wrench',
        textContent: 'Settings',
        title: '4chan X Settings',
        href: 'javascript:;'
      });
      $.on(link, 'click', Settings.open);
      Header.addShortcut(link, 820);
      add = this.addSection;
      add('Main', this.main);
      add('Filter', this.filter);
      add('Sauce', this.sauce);
      add('Advanced', this.advanced);
      add('Keybinds', this.keybinds);
      $.on(d, 'AddSettingsSection', Settings.addSection);
      $.on(d, 'OpenSettings', function(e) {
        return Settings.open(e.detail);
      });
      if (Conf['Disable Native Extension']) {
        if ($.hasStorage) {
          settings = JSON.parse(localStorage.getItem('4chan-settings')) || {};
          if (settings.disableAll) {
            return;
          }
          settings.disableAll = true;
          return localStorage.setItem('4chan-settings', JSON.stringify(settings));
        } else {
          return $.onExists(doc, 'body', function() {
            return $.global(function() {
              return window.Config.disableAll = true;
            });
          });
        }
      }
    },
    open: function(openSection) {
      var dialog, j, len, link, links, overlay, ref, section, sectionToOpen;
      if (Settings.overlay) {
        return;
      }
      $.event('CloseMenu');
      Settings.dialog = dialog = $.el('div', {
        id: 'fourchanx-settings',
        className: 'dialog'
      });
      $.extend(dialog, {
        innerHTML: "<nav><div class=\"sections-list\"></div><p class=\"imp-exp-result warning\"></p><div class=\"credits\"><a class=\"export\">Export</a>&nbsp|&nbsp<a class=\"import\">Import</a>&nbsp|&nbsp<a class=\"reset\">Reset Settings</a>&nbsp|&nbsp<input type=\"file\" hidden><a href=\"https://www.4chan-x.net/\" target=\"_blank\">4chan X</a>&nbsp|&nbsp<a href=\"https://github.com/ccd0/4chan-x/blob/master/CHANGELOG.md\" target=\"_blank\">" + E(g.VERSION) + "</a>&nbsp|&nbsp<a href=\"https://gitreports.com/issue/ccd0/4chan-x\" target=\"_blank\">Issues</a>&nbsp|&nbsp<a href=\"javascript:;\" class=\"close fa fa-times\" title=\"Close\"></a></div></nav><div class=\"section-container\"><section></section></div>"
      });
      Settings.overlay = overlay = $.el('div', {
        id: 'overlay'
      });
      $.on($('.export', dialog), 'click', Settings["export"]);
      $.on($('.import', dialog), 'click', Settings["import"]);
      $.on($('.reset', dialog), 'click', Settings.reset);
      $.on($('input', dialog), 'change', Settings.onImport);
      links = [];
      ref = Settings.sections;
      for (j = 0, len = ref.length; j < len; j++) {
        section = ref[j];
        link = $.el('a', {
          className: "tab-" + section.hyphenatedTitle,
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
      $.add($('.sections-list', dialog), links);
      if (openSection !== 'none') {
        (sectionToOpen ? sectionToOpen : links[0]).click();
      }
      $.on($('.close', dialog), 'click', Settings.close);
      $.on(overlay, 'click', Settings.close);
      $.on(window, 'beforeunload', Settings.close);
      $.add(d.body, [overlay, dialog]);
      return $.event('OpenSettings', null, dialog);
    },
    close: function() {
      var ref;
      if (!Settings.dialog) {
        return;
      }
      if ((ref = d.activeElement) != null) {
        ref.blur();
      }
      $.rm(Settings.overlay);
      $.rm(Settings.dialog);
      delete Settings.overlay;
      return delete Settings.dialog;
    },
    sections: [],
    addSection: function(title, open) {
      var hyphenatedTitle, ref;
      if (typeof title !== 'string') {
        ref = title.detail, title = ref.title, open = ref.open;
      }
      hyphenatedTitle = title.toLowerCase().replace(/\s+/g, '-');
      return Settings.sections.push({
        title: title,
        hyphenatedTitle: hyphenatedTitle,
        open: open
      });
    },
    openSection: function() {
      var section, selected;
      if (selected = $('.tab-selected', Settings.dialog)) {
        $.rmClass(selected, 'tab-selected');
      }
      $.addClass($(".tab-" + this.hyphenatedTitle, Settings.dialog), 'tab-selected');
      section = $('section', Settings.dialog);
      $.rmAll(section);
      section.className = "section-" + this.hyphenatedTitle;
      this.open(section, g);
      section.scrollTop = 0;
      return $.event('OpenSettings', null, section);
    },
    warnings: {
      localStorage: function(cb) {
        var why;
        if ($.cantSync) {
          why = $.cantSet ? 'save your settings' : 'synchronize settings between tabs';
          return cb($.el('li', {
            textContent: "4chan X needs local storage to " + why + ".\nEnable it on boards.4chan.org in your browser's privacy settings (may be listed as part of \"local data\" or \"cookies\")."
          }));
        }
      },
      ads: function(cb) {
        return $.onExists(doc, '.ad-cnt', function(ad) {
          return $.onExists(ad, 'img', function() {
            var url;
            url = Redirect.to('thread', {
              boardID: 'qa',
              threadID: 362590
            });
            return cb($.el('li', {
              innerHTML: "To protect yourself from <a href=\"" + E(url) + "\" target=\"_blank\">malicious ads</a>, you should <a href=\"https://github.com/gorhill/uBlock#ublock-origin\" target=\"_blank\">block ads</a> on 4chan."
            }));
          });
        });
      }
    },
    main: function(section) {
      var addWarning, arr, button, container, containers, description, div, fs, input, inputs, items, key, level, obj, ref, ref1, warning, warnings;
      warnings = $.el('fieldset', {
        hidden: true
      }, {
        innerHTML: "<legend>Warnings</legend><ul></ul>"
      });
      addWarning = function(item) {
        $.add($('ul', warnings), item);
        return warnings.hidden = false;
      };
      ref = Settings.warnings;
      for (key in ref) {
        warning = ref[key];
        warning(addWarning);
      }
      $.add(section, warnings);
      items = {};
      inputs = {};
      ref1 = Config.main;
      for (key in ref1) {
        obj = ref1[key];
        fs = $.el('fieldset', {
          innerHTML: "<legend>" + E(key) + "</legend>"
        });
        containers = [fs];
        for (key in obj) {
          arr = obj[key];
          description = arr[1];
          div = $.el('div', {
            innerHTML: "<label><input type=\"checkbox\" name=\"" + E(key) + "\">" + E(key) + "</label><span class=\"description\">: " + E(description) + "</span>"
          });
          if ($.engine !== 'gecko' && key === 'Remember QR Size') {
            div.hidden = true;
          }
          input = $('input', div);
          $.on(input, 'change', function() {
            this.parentNode.parentNode.dataset.checked = this.checked;
            return $.cb.checked.call(this);
          });
          items[key] = Conf[key];
          inputs[key] = input;
          level = arr[2] || 0;
          if (containers.length <= level) {
            container = $.el('div', {
              className: 'suboption-list'
            });
            $.add(containers[containers.length - 1].lastElementChild, container);
            containers[level] = container;
          } else if (containers.length > level + 1) {
            containers.splice(level + 1, containers.length - (level + 1));
          }
          $.add(containers[level], div);
        }
        $.add(section, fs);
      }
      $.get(items, function(items) {
        var val;
        for (key in items) {
          val = items[key];
          inputs[key].checked = val;
          inputs[key].parentNode.parentNode.dataset.checked = val;
        }
      });
      div = $.el('div', {
        innerHTML: "<button></button><span class=\"description\">: Clear manually-hidden threads and posts on all boards. Reload the page to apply."
      });
      button = $('button', div);
      $.get({
        hiddenThreads: {},
        hiddenPosts: {}
      }, function(arg) {
        var ID, board, hiddenNum, hiddenPosts, hiddenThreads, ref2, ref3, thread;
        hiddenThreads = arg.hiddenThreads, hiddenPosts = arg.hiddenPosts;
        hiddenNum = 0;
        ref2 = hiddenThreads.boards;
        for (ID in ref2) {
          board = ref2[ID];
          hiddenNum += Object.keys(board).length;
        }
        ref3 = hiddenPosts.boards;
        for (ID in ref3) {
          board = ref3[ID];
          for (ID in board) {
            thread = board[ID];
            hiddenNum += Object.keys(thread).length;
          }
        }
        return button.textContent = "Hidden: " + hiddenNum;
      });
      $.on(button, 'click', function() {
        this.textContent = 'Hidden: 0';
        return $.get('hiddenThreads', {}, function(arg) {
          var boardID, hiddenThreads;
          hiddenThreads = arg.hiddenThreads;
          if ($.hasStorage) {
            for (boardID in hiddenThreads.boards) {
              localStorage.removeItem("4chan-hide-t-" + boardID);
            }
          }
          return $["delete"](['hiddenThreads', 'hiddenPosts']);
        });
      });
      return $.after($('input[name="Stubs"]', section).parentNode.parentNode, div);
    },
    "export": function() {
      return $.get(Conf, function(Conf) {
        return Settings.downloadExport({
          version: g.VERSION,
          date: Date.now(),
          Conf: Conf
        });
      });
    },
    downloadExport: function(data) {
      var a, p;
      a = $.el('a', {
        download: "4chan X v" + g.VERSION + "-" + data.date + ".json",
        href: "data:application/json;base64," + (btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))))
      });
      p = $('.imp-exp-result', Settings.dialog);
      $.rmAll(p);
      $.add(p, a);
      return a.click();
    },
    "import": function() {
      return $('input[type=file]', this.parentNode).click();
    },
    onImport: function() {
      var file, output, reader;
      if (!(file = this.files[0])) {
        return;
      }
      this.value = null;
      output = $('.imp-exp-result');
      if (!confirm('Your current settings will be entirely overwritten, are you sure?')) {
        output.textContent = 'Import aborted.';
        return;
      }
      reader = new FileReader();
      reader.onload = function(e) {
        var err;
        try {
          return Settings.loadSettings(JSON.parse(e.target.result), function(err) {
            if (err) {
              return output.textContent = 'Import failed due to an error.';
            } else if (confirm('Import successful. Reload now?')) {
              return window.location.reload();
            }
          });
        } catch (_error) {
          err = _error;
          output.textContent = 'Import failed due to an error.';
          return c.error(err.stack);
        }
      };
      return reader.readAsText(file);
    },
    convertFrom: {
      loadletter: function(data) {
        var base, boardID, convertSettings, key, ref, ref1, threadData, threadID, threads, val;
        convertSettings = function(data, map) {
          var newKey, prevKey;
          for (prevKey in map) {
            newKey = map[prevKey];
            if (newKey) {
              data.Conf[newKey] = data.Conf[prevKey];
            }
            delete data.Conf[prevKey];
          }
          return data;
        };
        data = convertSettings(data, {
          'Disable 4chan\'s extension': 'Disable Native Extension',
          'Comment Auto-Expansion': '',
          'Remove Slug': '',
          'Check for Updates': '',
          'Recursive Filtering': 'Recursive Hiding',
          'Reply Hiding': 'Reply Hiding Buttons',
          'Thread Hiding': 'Thread Hiding Buttons',
          'Show Stubs': 'Stubs',
          'Image Auto-Gif': 'Replace GIF',
          'Reveal Spoilers': 'Reveal Spoiler Thumbnails',
          'Expand From Current': 'Expand from here',
          'Post in Title': 'Thread Excerpt',
          'Current Page': 'Page Count in Stats',
          'Current Page Position': '',
          'Alternative captcha': 'Use Recaptcha v1',
          'Auto Submit': 'Post on Captcha Completion',
          'Open Reply in New Tab': 'Open Post in New Tab',
          'Remember QR size': 'Remember QR Size',
          'Remember Subject': '',
          'Quote Inline': 'Quote Inlining',
          'Quote Preview': 'Quote Previewing',
          'Indicate OP quote': 'Mark OP Quotes',
          'Indicate You quote': 'Mark Quotes of You',
          'Indicate Cross-thread Quotes': 'Mark Cross-thread Quotes',
          'uniqueid': 'uniqueID',
          'mod': 'capcode',
          'email': '',
          'country': 'flag',
          'md5': 'MD5',
          'openEmptyQR': 'Open empty QR',
          'openQR': 'Open QR',
          'openOptions': 'Open settings',
          'close': 'Close',
          'spoiler': 'Spoiler tags',
          'sageru': 'Toggle sage',
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
        ref = Config.hotkeys;
        for (key in ref) {
          val = ref[key];
          if (key in data.Conf) {
            data.Conf[key] = data.Conf[key].replace(/ctrl|alt|meta/g, function(s) {
              return "" + (s[0].toUpperCase()) + s.slice(1);
            }).replace(/(^|.+\+)[A-Z]$/g, function(s) {
              return "Shift+" + s.slice(0, -1) + (s.slice(-1).toLowerCase());
            });
          }
        }
        if (data.WatchedThreads) {
          data.Conf['watchedThreads'] = {
            boards: {}
          };
          ref1 = data.WatchedThreads;
          for (boardID in ref1) {
            threads = ref1[boardID];
            for (threadID in threads) {
              threadData = threads[threadID];
              ((base = data.Conf['watchedThreads'].boards)[boardID] || (base[boardID] = {}))[threadID] = {
                excerpt: threadData.textContent
              };
            }
          }
        }
        return data;
      }
    },
    upgrade: function(data, version) {
      var addSauces, boardID, changes, compareString, j, key, len, name, record, ref, ref1, ref2, ref3, ref4, ref5, rice, set, type, uids, value;
      changes = {};
      set = function(key, value) {
        return data[key] = changes[key] = value;
      };
      addSauces = function(sauces) {
        if (data['sauces'] != null) {
          sauces = sauces.filter(function(s) {
            return data['sauces'].indexOf(s.match(/[^#;\s]+|$/)[0]) < 0;
          });
          if (sauces.length) {
            return set('sauces', data['sauces'] + '\n\n' + sauces.join('\n'));
          }
        }
      };
      compareString = version.replace(/\d+/g, function(x) {
        return ('0000' + x).slice(-5);
      });
      if (compareString < '00001.00011.00008.00000') {
        if (data['Fixed Thread Watcher'] == null) {
          set('Fixed Thread Watcher', (ref = data['Toggleable Thread Watcher']) != null ? ref : true);
        }
        if (data['Exempt Archives from Encryption'] == null) {
          set('Exempt Archives from Encryption', (ref1 = data['Except Archives from Encryption']) != null ? ref1 : false);
        }
      }
      if (compareString < '00001.00011.00010.00001') {
        if (data['selectedArchives'] != null) {
          uids = {
            "Moe": 0,
            "4plebs Archive": 3,
            "Nyafuu Archive": 4,
            "Love is Over": 5,
            "Rebecca Black Tech": 8,
            "warosu": 10,
            "fgts": 15,
            "not4plebs": 22,
            "DesuStorage": 23,
            "fireden.net": 24,
            "disabled": null
          };
          ref2 = data['selectedArchives'];
          for (boardID in ref2) {
            record = ref2[boardID];
            for (type in record) {
              name = record[type];
              if (name in uids) {
                record[type] = uids[name];
              }
            }
          }
          set('selectedArchives', data['selectedArchives']);
        }
      }
      if (compareString < '00001.00011.00016.00000') {
        if ((rice = Config['usercss'].match(/\/\* Board title rice \*\/(?:\n.+)*/)[0])) {
          if ((data['usercss'] != null) && data['usercss'].indexOf(rice) < 0) {
            set('usercss', rice + '\n\n' + data['usercss']);
          }
        }
      }
      if (compareString < '00001.00011.00017.00000') {
        ref3 = ['Persistent QR', 'Color User IDs', 'Fappe Tyme', 'Werk Tyme', 'Highlight Posts Quoting You', 'Highlight Own Posts'];
        for (j = 0, len = ref3.length; j < len; j++) {
          key = ref3[j];
          if (data[key] == null) {
            set(key, key === 'Persistent QR');
          }
        }
      }
      if (compareString < '00001.00011.00017.00006') {
        if (data['sauces'] != null) {
          set('sauces', data['sauces'].replace(/^(#?\s*)http:\/\/iqdb\.org\//mg, '$1//iqdb.org/'));
        }
      }
      if (compareString < '00001.00011.00019.00003' && !Settings.overlay) {
        $.queueTask(function() {
          return Settings.warnings.ads(function(item) {
            return new Notice('warning', slice.call(item.childNodes));
          });
        });
      }
      if (compareString < '00001.00011.00020.00003') {
        ref4 = {
          'Inline Cross-thread Quotes Only': false,
          'Pass Link': true
        };
        for (key in ref4) {
          value = ref4[key];
          if (data[key] == null) {
            set(key, value);
          }
        }
      }
      if (compareString < '00001.00011.00021.00003') {
        if (data['Remember Your Posts'] == null) {
          set('Remember Your Posts', (ref5 = data['Mark Quotes of You']) != null ? ref5 : true);
        }
      }
      if (compareString < '00001.00011.00022.00000') {
        if (data['sauces'] != null) {
          set('sauces', data['sauces'].replace(/^(#?\s*https:\/\/www\.google\.com\/searchbyimage\?image_url=%(?:IMG|URL))%3Fs\.jpg/mg, '$1'));
          set('sauces', data['sauces'].replace(/^#?\s*https:\/\/www\.google\.com\/searchbyimage\?image_url=%(?:IMG|T?URL)(?=$|;)/mg, '$&&safe=off'));
        }
      }
      if (compareString < '00001.00011.00022.00002') {
        if ((data['Use Recaptcha v1 in Reports'] == null) && data['Use Recaptcha v1'] && !data['Use Recaptcha v2 in Reports']) {
          set('Use Recaptcha v1 in Reports', true);
        }
      }
      if (compareString < '00001.00011.00024.00000') {
        if ((data['JSON Navigation'] != null) && (data['JSON Index'] == null)) {
          set('JSON Index', data['JSON Navigation']);
        }
      }
      if (compareString < '00001.00011.00026.00000') {
        if ((data['Oekaki Links'] != null) && (data['Edit Link'] == null)) {
          set('Edit Link', data['Oekaki Links']);
        }
        if (data['Inline Cross-thread Quotes Only'] == null) {
          set('Inline Cross-thread Quotes Only', true);
        }
      }
      if (compareString < '00001.00011.00030.00000') {
        if (data['Quote Threading'] && (data['Thread Quotes'] == null)) {
          set('Thread Quotes', true);
        }
      }
      if (compareString < '00001.00011.00032.00000') {
        if (data['sauces'] != null) {
          set('sauces', data['sauces'].replace(/^(#?\s*)http:\/\/3d\.iqdb\.org\//mg, '$1//3d.iqdb.org/'));
        }
        addSauces(['#https://desustorage.org/_/search/image/%sMD5/', '#https://boards.fireden.net/_/search/image/%sMD5/', '#https://foolz.fireden.net/_/search/image/%sMD5/', '#//www.gif-explode.com/%URL;types:gif']);
      }
      return changes;
    },
    loadSettings: function(data, cb) {
      if (data.version.split('.')[0] === '2') {
        data = Settings.convertFrom.loadletter(data);
      } else if (data.version !== g.VERSION) {
        Settings.upgrade(data.Conf, data.version);
      }
      return $.clear(function(err) {
        if (err) {
          return cb(err);
        }
        return $.set(data.Conf, cb);
      });
    },
    reset: function() {
      if (confirm('Your current settings will be entirely wiped, are you sure?')) {
        return $.clear(function(err) {
          if (err) {
            return $('.imp-exp-result').textContent = 'Import failed due to an error.';
          } else if (confirm('Reset successful. Reload now?')) {
            return window.location.reload();
          }
        });
      }
    },
    filter: function(section) {
      var select;
      $.extend(section, {
        innerHTML: "<select name=\"filter\"><option value=\"guide\">Guide</option><option value=\"postID\">Post number</option><option value=\"name\">Name</option><option value=\"uniqueID\">Unique ID</option><option value=\"tripcode\">Tripcode</option><option value=\"capcode\">Capcode</option><option value=\"subject\">Subject</option><option value=\"comment\">Comment</option><option value=\"flag\">Flag</option><option value=\"filename\">Filename</option><option value=\"dimensions\">Image dimensions</option><option value=\"filesize\">Filesize</option><option value=\"MD5\">Image MD5</option></select><div></div>"
      });
      select = $('select', section);
      $.on(select, 'change', Settings.selectFilter);
      return Settings.selectFilter.call(select);
    },
    selectFilter: function() {
      var div, name, ta;
      div = this.nextElementSibling;
      if ((name = this.value) !== 'guide') {
        $.rmAll(div);
        ta = $.el('textarea', {
          name: name,
          className: 'field',
          spellcheck: false
        });
        $.get(name, Conf[name], function(item) {
          return ta.value = item[name];
        });
        $.on(ta, 'change', $.cb.value);
        $.add(div, ta);
        return;
      }
      $.extend(div, {
        innerHTML: "<div class=\"warning\"><code>Filter</code> is disabled.</div><p>Use <a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions\" target=\"_blank\">regular expressions</a>, one per line.<br>Lines starting with a <code>#</code> will be ignored.<br>For example, <code>/weeaboo/i</code> will filter posts containing the string \`<code>weeaboo</code>\`, case-insensitive.<br>MD5 filtering uses exact string matching, not regular expressions.</p><ul>You can use these settings with each regular expression, separate them with semicolons:<li>Per boards, separate them with commas. It is global if not specified.<br>For example: <code>boards:a,jp;</code>.</li><li>In case of a global rule, select boards to be excluded from the filter.<br>For example: <code>exclude:vg,v;</code>.</li><li>Filter OPs only along with their threads (\`only\`), replies only (\`no\`), or both (\`yes\`, this is default).<br>For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.</li><li>Overrule the \`Show Stubs\` setting if specified: create a stub (\`yes\`) or not (\`no\`).<br>For example: <code>stub:yes;</code> or <code>stub:no;</code>.</li><li>Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.</li><li>Highlighted OPs will have their threads put on top of the board index by default.<br>For example: <code>top:yes;</code> or <code>top:no;</code>.</li></ul><p>Note: If you&#039;re using the native catalog rather than 4chan X&#039;s catalog, 4chan X&#039;s filters do not apply there.<br>The native catalog has its own separate filter list.</p>"
      });
      return $('.warning', div).hidden = Conf['Filter'];
    },
    sauce: function(section) {
      var ta;
      $.extend(section, {
        innerHTML: "<div class=\"warning\"><code>Sauce</code> is disabled.</div><div>Lines starting with a <code>#</code> will be ignored.</div><div>You can specify a display text by appending <code>;text:[text]</code> to the URL.</div><div>You can specify the applicable boards by appending <code>;boards:[board1],[board2]</code>.</div><div>You can specify the applicable file types by appending <code>;types:[extension1],[extension2]</code>.</div><div>You can open links with scripts and popups disabled by appending <code>;sandbox</code>.</div><ul>These parameters will be replaced by their corresponding values:<li><code>%TURL</code>: Thumbnail URL.</li><li><code>%URL</code>: Full image URL.</li><li><code>%IMG</code>: Full image URL for GIF, JPG, and PNG; thumbnail URL for other types.</li><li><code>%MD5</code>: MD5 hash in base64.</li><li><code>%sMD5</code>: MD5 hash in base64 using <code>-</code> and <code>_</code>.</li><li><code>%hMD5</code>: MD5 hash in hexadecimal.</li><li><code>%name</code>: Original file name.</li><li><code>%board</code>: Current board.</li><li><code>%%</code>, <code>%semi</code>: Literal <code>%</code> and <code>;</code>.</li></ul><textarea name=\"sauces\" class=\"field\" spellcheck=\"false\"></textarea>"
      });
      $('.warning', section).hidden = Conf['Sauce'];
      ta = $('textarea', section);
      $.get('sauces', Conf['sauces'], function(item) {
        return ta.value = item['sauces'];
      });
      return $.on(ta, 'change', $.cb.value);
    },
    advanced: function(section) {
      var applyCSS, boardSelect, customCSS, event, input, inputs, interval, items, itemsArchive, j, k, l, len, len1, len2, len3, m, name, ref, ref1, ref2, ref3, table, updateArchives, warning;
      $.extend(section, {
        innerHTML: "<fieldset><legend>Archives</legend><div class=\"warning\" data-feature=\"404 Redirect\"><code>404 Redirect</code> is disabled.</div><select id=\"archive-board-select\"></select><table id=\"archive-table\"><thead><th>Thread redirection</th><th>Post fetching</th><th>File redirection</th></thead><tbody></tbody></table><br><div><b>Archive Lists</b>: Each line below should be an archive list in <a href=\"https://github.com/MayhemYDG/archives.json/blob/gh-pages/CONTRIBUTING.md\" target=\"_blank\">this format</a> or a URL to load an archive list from.<br>Archive properties can be overriden by another item with the same <code>uid</code> (or if absent, its <code>name</code>).</div><textarea name=\"archiveLists\" class=\"field\" spellcheck=\"false\"></textarea><button id=\"update-archives\">Update now</button> Last updated: <time id=\"lastarchivecheck\"></time> <label><input type=\"checkbox\" name=\"archiveAutoUpdate\"> Auto-update</label></fieldset><fieldset><legend>Captcha Language</legend><div>Choose from <a href=\"https://developers.google.com/recaptcha/docs/language\" target=\"_blank\">list of language codes</a>. Leave blank to autoselect.</div><div><input name=\"captchaLanguage\" class=\"field\" spellcheck=\"false\"></div></fieldset><fieldset><legend>Custom Board Navigation</legend><div><textarea name=\"boardnav\" class=\"field\" spellcheck=\"false\"></textarea></div><span class=\"note\">New lines will be converted into spaces.</span><br><br><div class=\"note\">In the following examples for /g/, <code>g</code> can be changed to a different board ID (<code>a</code>, <code>b</code>, etc...), the current board (<code>current</code>), or the Twitter link (<code>@</code>).</div><div>Board link: <code>g</code></div><div>Archive link: <code>g-archive</code></div><div>Internal archive link: <code>g-expired</code></div><div>Title link: <code>g-title</code></div><div>Board link (Replace with title when on that board): <code>g-replace</code></div><div>Full text link: <code>g-full</code></div><div>Custom text link: <code>g-text:&quot;Install Gentoo&quot;</code></div><div>Index-only link: <code>g-index</code></div><div>Catalog-only link: <code>g-catalog</code></div><div>Index mode: <code>g-mode:&quot;infinite scrolling&quot;</code></div><div>Index sort: <code>g-sort:&quot;creation date&quot;</code></div><div>External link: <code>external-text:&quot;Google&quot;,&quot;http://www.google.com&quot;</code></div><div>Combinations are possible: <code>g-index-text:&quot;Technology Index&quot;</code></div><div>Full board list toggle: <code>toggle-all</code></div><br><div class=\"note\"><code>[ toggle-all ] [current-title] [g-title / a-title / jp-title] [x / wsg / h] [t-text:&quot;Piracy&quot;]</code><br>will give you<br><code>[ + ] [Technology] [Technology / Anime & Manga / Otaku Culture] [x / wsg / h] [Piracy]</code><br>if you are on /g/.</div></fieldset><fieldset><legend>Time Formatting <span class=\"warning\" data-feature=\"Time Formatting\">is disabled.</span></legend><div><input name=\"time\" class=\"field\" spellcheck=\"false\">: <span class=\"time-preview\"></span></div><div>Supported <a href=\"http://man7.org/linux/man-pages/man1/date.1.html\" target=\"_blank\">format specifiers</a>:</div><div>Day: <code>%a</code>, <code>%A</code>, <code>%d</code>, <code>%e</code></div><div>Month: <code>%m</code>, <code>%b</code>, <code>%B</code></div><div>Year: <code>%y</code>, <code>%Y</code></div><div>Hour: <code>%k</code>, <code>%H</code>, <code>%l</code>, <code>%I</code>, <code>%p</code>, <code>%P</code></div><div>Minute: <code>%M</code></div><div>Second: <code>%S</code></div><div>Literal <code>%</code>: <code>%%</code></div></fieldset><fieldset><legend>Quote Backlinks formatting <span class=\"warning\" data-feature=\"Quote Backlinks\">is disabled.</span></legend><div><input name=\"backlink\" class=\"field\" spellcheck=\"false\">: <span class=\"backlink-preview\"></span></div></fieldset><fieldset><legend>File Info Formatting <span class=\"warning\" data-feature=\"File Info Formatting\">is disabled.</span></legend><div><input name=\"fileInfo\" class=\"field\" spellcheck=\"false\">: <span class=\"file-info file-info-preview\"></span></div><div>Link: <code>%l</code> (truncated), <code>%L</code> (untruncated), <code>%T</code> (4chan filename)</div><div>Filename: <code>%n</code> (truncated), <code>%N</code> (untruncated), <code>%t</code> (4chan filename)</div><div>Download button: <code>%d</code></div><div>Spoiler indicator: <code>%p</code></div><div>Size: <code>%B</code> (Bytes), <code>%K</code> (KB), <code>%M</code> (MB), <code>%s</code> (4chan default)</div><div>Resolution: <code>%r</code> (Displays &#039;PDF&#039; for PDF files)</div><div>Tag: <code>%g</code><div>Literal <code>%</code>: <code>%%</code></div></fieldset><fieldset><legend>Quick Reply Personas</legend><textarea class=\"personafield field\" name=\"QR.personas\" spellcheck=\"false\"></textarea><p>One item per line.<br>Items will be added in the relevant input&#039;s auto-completion list.<br>Password items will always be used, since there is no password input.<br>Lines starting with a <code>#</code> will be ignored.</p><ul>You can use these settings with each item, separate them with semicolons:<li>Possible items are: <code>name</code>, <code>options</code> (or equivalently <code>email</code>), <code>subject</code> and <code>password</code>.</li><li>Wrap values of items with quotes, like this: <code>options:&quot;sage&quot;</code>.</li><li>Force values as defaults with the <code>always</code> keyword, for example: <code>options:&quot;sage&quot;;always</code>.</li><li>Select specific boards for an item, separated with commas, for example: <code>options:&quot;sage&quot;;boards:jp;always</code>.</li></ul></fieldset><fieldset><legend>Unread Favicon <span class=\"warning\" data-feature=\"Unread Favicon\">is disabled.</span></legend><select name=\"favicon\"><option value=\"ferongr\">ferongr</option><option value=\"xat-\">xat-</option><option value=\"4chanJS\">4chanJS</option><option value=\"Mayhem\">Mayhem</option><option value=\"Original\">Original</option><option value=\"Metro\">Metro</option></select><span class=\"favicon-preview\"><img src=\"data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAAAAIOhI%2Bpy%2B0Po5y02ouzPgUAOw%3D%3D\"><img src=\"data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAAAAIOhI%2Bpy%2B0Po5y02ouzPgUAOw%3D%3D\"><img src=\"data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAAAAIOhI%2Bpy%2B0Po5y02ouzPgUAOw%3D%3D\"><img src=\"data:image/gif;base64,R0lGODlhEAAQAPAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAAAAIOhI%2Bpy%2B0Po5y02ouzPgUAOw%3D%3D\"></span></fieldset><fieldset><legend>Thread Updater <span class=\"warning\" data-feature=\"Thread Updater\">is disabled.</span></legend><div>Interval: <input type=\"number\" name=\"Interval\" class=\"field\" min=\"1\"> seconds</div></fieldset><fieldset><legend>Custom Cooldown Time</legend><div>Seconds: <input type=\"number\" name=\"customCooldown\" class=\"field\" min=\"0\"></div></fieldset><fieldset><legend><label><input type=\"checkbox\" name=\"Custom CSS\"> Custom CSS</label></legend><button id=\"apply-css\">Apply CSS</button><textarea name=\"usercss\" class=\"field\" spellcheck=\"false\"></textarea></fieldset><fieldset><legend>Javascript Whitelist</legend><div>Sources from which Javascript is allowed to be loaded by <a href=\"http://content-security-policy.com/#source_list\" target=\"_blank\">Content Security Policy</a>.</div><textarea name=\"jsWhitelist\" class=\"field\" spellcheck=\"false\"></textarea></fieldset>"
      });
      ref = $$('.warning', section);
      for (j = 0, len = ref.length; j < len; j++) {
        warning = ref[j];
        warning.hidden = Conf[warning.dataset.feature];
      }
      inputs = {};
      ref1 = $$('[name]', section);
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        input = ref1[k];
        inputs[input.name] = input;
      }
      $.on(inputs['archiveLists'], 'change', function() {
        $.set('lastarchivecheck', 0);
        Conf['lastarchivecheck'] = 0;
        return $.id('lastarchivecheck').textContent = 'never';
      });
      items = {};
      ref2 = ['archiveLists', 'archiveAutoUpdate', 'captchaLanguage', 'boardnav', 'time', 'backlink', 'fileInfo', 'QR.personas', 'favicon', 'usercss', 'customCooldown', 'jsWhitelist'];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        name = ref2[l];
        items[name] = Conf[name];
        input = inputs[name];
        event = name === 'archiveLists' || name === 'archiveAutoUpdate' || name === 'QR.personas' || name === 'favicon' || name === 'usercss' ? 'change' : 'input';
        $.on(input, event, $.cb[input.type === 'checkbox' ? 'checked' : 'value']);
        if (name in Settings) {
          $.on(input, event, Settings[name]);
        }
      }
      $.get(items, function(items) {
        var key, val;
        for (key in items) {
          val = items[key];
          input = inputs[key];
          input[input.type === 'checkbox' ? 'checked' : 'value'] = val;
          if (key in Settings) {
            Settings[key].call(input);
          }
        }
      });
      interval = inputs['Interval'];
      customCSS = inputs['Custom CSS'];
      applyCSS = $('#apply-css', section);
      interval.value = Conf['Interval'];
      customCSS.checked = Conf['Custom CSS'];
      inputs['usercss'].disabled = !Conf['Custom CSS'];
      applyCSS.disabled = !Conf['Custom CSS'];
      $.on(interval, 'change', ThreadUpdater.cb.interval);
      $.on(customCSS, 'change', Settings.togglecss);
      $.on(applyCSS, 'click', function() {
        return CustomCSS.update();
      });
      itemsArchive = {};
      ref3 = ['archives', 'selectedArchives', 'lastarchivecheck'];
      for (m = 0, len3 = ref3.length; m < len3; m++) {
        name = ref3[m];
        itemsArchive[name] = Conf[name];
      }
      $.get(itemsArchive, function(itemsArchive) {
        $.extend(Conf, itemsArchive);
        Redirect.selectArchives();
        return Settings.addArchiveTable(section);
      });
      boardSelect = $('#archive-board-select', section);
      table = $('#archive-table', section);
      updateArchives = $('#update-archives', section);
      $.on(boardSelect, 'change', function() {
        $('tbody > :not([hidden])', table).hidden = true;
        return $("tbody > ." + this.value, table).hidden = false;
      });
      return $.on(updateArchives, 'click', function() {
        return Redirect.update(function() {
          return Settings.addArchiveTable(section);
        });
      });
    },
    addArchiveTable: function(section) {
      var archBoards, archive, boardID, boardOptions, boardSelect, boards, data, files, i, id, item, j, k, l, len, len1, len2, len3, len4, m, n, name, o, ref, ref1, ref2, ref3, ref4, ref5, row, rows, select, software, table, tbody, type, uid, withCredentials;
      $('#lastarchivecheck', section).textContent = Conf['lastarchivecheck'] === 0 ? 'never' : new Date(Conf['lastarchivecheck']).toLocaleString();
      boardSelect = $('#archive-board-select', section);
      table = $('#archive-table', section);
      tbody = $('tbody', section);
      $.rmAll(boardSelect);
      $.rmAll(tbody);
      archBoards = {};
      ref = Conf['archives'];
      for (j = 0, len = ref.length; j < len; j++) {
        ref1 = ref[j], uid = ref1.uid, name = ref1.name, boards = ref1.boards, files = ref1.files, software = ref1.software, withCredentials = ref1.withCredentials;
        for (k = 0, len1 = boards.length; k < len1; k++) {
          boardID = boards[k];
          o = archBoards[boardID] || (archBoards[boardID] = {
            thread: [[], []],
            post: [[], []],
            file: [[], []]
          });
          i = +(!!withCredentials);
          archive = [uid != null ? uid : name, name];
          o.thread[i].push(archive);
          if (software === 'foolfuuka') {
            o.post[i].push(archive);
          }
          if (indexOf.call(files, boardID) >= 0) {
            o.file[i].push(archive);
          }
        }
      }
      for (boardID in archBoards) {
        o = archBoards[boardID];
        ref2 = ['thread', 'post', 'file'];
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          item = ref2[l];
          i = o[item][0].length ? 1 : 0;
          o[item][i].push([null, 'disabled']);
          o[item] = o[item][0].concat(o[item][1]);
        }
      }
      rows = [];
      boardOptions = [];
      ref3 = Object.keys(archBoards).sort();
      for (m = 0, len3 = ref3.length; m < len3; m++) {
        boardID = ref3[m];
        row = $.el('tr', {
          className: "board-" + boardID
        });
        row.hidden = boardID !== g.BOARD.ID;
        boardOptions.push($.el('option', {
          textContent: "/" + boardID + "/",
          value: "board-" + boardID,
          selected: boardID === g.BOARD.ID
        }));
        o = archBoards[boardID];
        ref4 = ['thread', 'post', 'file'];
        for (n = 0, len4 = ref4.length; n < len4; n++) {
          item = ref4[n];
          $.add(row, Settings.addArchiveCell(boardID, o, item));
        }
        rows.push(row);
      }
      if (rows.length === 0) {
        boardSelect.hidden = table.hidden = true;
        return;
      }
      boardSelect.hidden = table.hidden = false;
      if (!(g.BOARD.ID in archBoards)) {
        rows[0].hidden = false;
      }
      $.add(boardSelect, boardOptions);
      $.add(tbody, rows);
      ref5 = Conf['selectedArchives'];
      for (boardID in ref5) {
        data = ref5[boardID];
        for (type in data) {
          id = data[type];
          if ((select = $("select[data-boardid='" + boardID + "'][data-type='" + type + "']", tbody))) {
            select.value = JSON.stringify(id);
            if (!select.value) {
              select.value = select.firstChild.value;
            }
          }
        }
      }
    },
    addArchiveCell: function(boardID, data, type) {
      var archive, i, length, options, select, td;
      length = data[type].length;
      td = $.el('td', {
        className: 'archive-cell'
      });
      if (!length) {
        td.textContent = '--';
        return td;
      }
      options = [];
      i = 0;
      while (i < length) {
        archive = data[type][i++];
        options.push($.el('option', {
          value: JSON.stringify(archive[0]),
          textContent: archive[1]
        }));
      }
      $.extend(td, {
        innerHTML: "<select></select>"
      });
      select = td.firstElementChild;
      if (!(select.disabled = length === 1)) {
        select.setAttribute('data-boardid', boardID);
        select.setAttribute('data-type', type);
        $.on(select, 'change', Settings.saveSelectedArchive);
      }
      $.add(select, options);
      return td;
    },
    saveSelectedArchive: function() {
      return $.get('selectedArchives', Conf['selectedArchives'], (function(_this) {
        return function(arg) {
          var name1, selectedArchives;
          selectedArchives = arg.selectedArchives;
          (selectedArchives[name1 = _this.dataset.boardid] || (selectedArchives[name1] = {}))[_this.dataset.type] = JSON.parse(_this.value);
          $.set('selectedArchives', selectedArchives);
          Conf['selectedArchives'] = selectedArchives;
          return Redirect.selectArchives();
        };
      })(this));
    },
    boardnav: function() {
      return Header.generateBoardList(this.value);
    },
    time: function() {
      return this.nextElementSibling.textContent = Time.format(this.value, new Date());
    },
    backlink: function() {
      return this.nextElementSibling.textContent = this.value.replace(/%(?:id|%)/g, function(x) {
        return {
          '%id': '123456789',
          '%%': '%'
        }[x];
      });
    },
    fileInfo: function() {
      var data;
      data = {
        isReply: true,
        file: {
          url: '//i.4cdn.org/g/1334437723720.jpg',
          name: 'd9bb2efc98dd0df141a94399ff5880b7.jpg',
          size: '276 KB',
          sizeInBytes: 276 * 1024,
          dimensions: '1280x720',
          isImage: true,
          isVideo: false,
          isSpoiler: true,
          tag: 'Loop'
        }
      };
      return FileInfo.format(this.value, data, this.nextElementSibling);
    },
    favicon: function() {
      var img;
      Favicon["switch"]();
      if (g.VIEW === 'thread' && Conf['Unread Favicon']) {
        Unread.update();
      }
      img = this.nextElementSibling.children;
      img[0].src = Favicon["default"];
      img[1].src = Favicon.unreadSFW;
      img[2].src = Favicon.unreadNSFW;
      return img[3].src = Favicon.unreadDead;
    },
    togglecss: function() {
      if ($('textarea[name=usercss]', $.x('ancestor::fieldset[1]', this)).disabled = $.id('apply-css').disabled = !this.checked) {
        CustomCSS.rmStyle();
      } else {
        CustomCSS.addStyle();
      }
      return $.cb.checked.call(this);
    },
    keybinds: function(section) {
      var arr, input, inputs, items, key, ref, tbody, tr;
      $.extend(section, {
        innerHTML: "<div class=\"warning\"><code>Keybinds</code> are disabled.</div><div>Allowed keys: <kbd>a-z</kbd>, <kbd>0-9</kbd>, <kbd>Ctrl</kbd>, <kbd>Shift</kbd>, <kbd>Alt</kbd>, <kbd>Meta</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Up</kbd>, <kbd>Down</kbd>, <kbd>Right</kbd>, <kbd>Left</kbd>.</div><div>Press <kbd>Backspace</kbd> to disable a keybind.</div><table><tbody><tr><th>Actions</th><th>Keybinds</th></tr></tbody></table>"
      });
      $('.warning', section).hidden = Conf['Keybinds'];
      tbody = $('tbody', section);
      items = {};
      inputs = {};
      ref = Config.hotkeys;
      for (key in ref) {
        arr = ref[key];
        tr = $.el('tr', {
          innerHTML: "<td>" + E(arr[1]) + "</td><td><input class=\"field\"></td>"
        });
        input = $('input', tr);
        input.name = key;
        input.spellcheck = false;
        items[key] = Conf[key];
        inputs[key] = input;
        $.on(input, 'keydown', Settings.keybind);
        $.add(tbody, tr);
      }
      return $.get(items, function(items) {
        var val;
        for (key in items) {
          val = items[key];
          inputs[key].value = val;
        }
      });
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

  return Settings;

}).call(this);

UI = (function() {
  var Menu, checkbox, dialog, drag, dragend, dragstart, hover, hoverend, hoverstart, touchend, touchmove,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  dialog = function(id, position, properties) {
    var child, el, i, len, move, ref;
    el = $.el('div', {
      className: 'dialog',
      id: id
    });
    $.extend(el, properties);
    el.style.cssText = position;
    $.get(id + ".position", position, function(item) {
      return el.style.cssText = item[id + ".position"];
    });
    move = $('.move', el);
    $.on(move, 'touchstart mousedown', dragstart);
    ref = move.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      if (!child.tagName) {
        continue;
      }
      $.on(child, 'touchstart mousedown', function(e) {
        return e.stopPropagation();
      });
    }
    return el;
  };

  Menu = (function() {
    var currentMenu, lastToggledButton;

    currentMenu = null;

    lastToggledButton = null;

    function Menu(type) {
      this.type = type;
      this.addEntry = bind(this.addEntry, this);
      this.onFocus = bind(this.onFocus, this);
      this.keybinds = bind(this.keybinds, this);
      this.close = bind(this.close, this);
      this.setPosition = bind(this.setPosition, this);
      $.on(d, 'AddMenuEntry', (function(_this) {
        return function(arg) {
          var detail;
          detail = arg.detail;
          if (detail.type !== _this.type) {
            return;
          }
          delete detail.open;
          return _this.addEntry(detail);
        };
      })(this));
      this.entries = [];
    }

    Menu.prototype.makeMenu = function() {
      var menu;
      menu = $.el('div', {
        className: 'dialog',
        id: 'menu',
        tabIndex: 0
      });
      menu.dataset.type = this.type;
      $.on(menu, 'click', function(e) {
        return e.stopPropagation();
      });
      $.on(menu, 'keydown', this.keybinds);
      return menu;
    };

    Menu.prototype.toggle = function(e, button, data) {
      var previousButton;
      e.preventDefault();
      e.stopPropagation();
      if (currentMenu) {
        previousButton = lastToggledButton;
        currentMenu.close();
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
      var entry, i, len, menu, ref;
      menu = this.menu = this.makeMenu();
      currentMenu = this;
      lastToggledButton = button;
      this.entries.sort(function(first, second) {
        return first.order - second.order;
      });
      ref = this.entries;
      for (i = 0, len = ref.length; i < len; i++) {
        entry = ref[i];
        this.insertEntry(entry, menu, data);
      }
      $.addClass(lastToggledButton, 'active');
      $.on(d, 'click CloseMenu', this.close);
      $.on(d, 'scroll', this.setPosition);
      $.on(window, 'resize', this.setPosition);
      $.add(button, menu);
      this.setPosition();
      entry = $('.entry', menu);
      this.focus(entry);
      return menu.focus();
    };

    Menu.prototype.setPosition = function() {
      var bLeft, bRect, bTop, bottom, cHeight, cWidth, left, mRect, ref, ref1, right, top;
      mRect = this.menu.getBoundingClientRect();
      bRect = lastToggledButton.getBoundingClientRect();
      bTop = window.scrollY + bRect.top;
      bLeft = window.scrollX + bRect.left;
      cHeight = doc.clientHeight;
      cWidth = doc.clientWidth;
      ref = bRect.top + bRect.height + mRect.height < cHeight ? [bRect.bottom + "px", ''] : ['', (cHeight - bRect.top) + "px"], top = ref[0], bottom = ref[1];
      ref1 = bRect.left + mRect.width < cWidth ? [bRect.left + "px", ''] : ['', (cWidth - bRect.right) + "px"], left = ref1[0], right = ref1[1];
      $.extend(this.menu.style, {
        top: top,
        right: right,
        bottom: bottom,
        left: left
      });
      return this.menu.classList.toggle('left', right);
    };

    Menu.prototype.insertEntry = function(entry, parent, data) {
      var err, i, len, ref, subEntry, submenu;
      if (typeof entry.open === 'function') {
        try {
          if (!entry.open(data)) {
            return;
          }
        } catch (_error) {
          err = _error;
          Main.handleErrors({
            message: "Error in building the " + this.type + " menu.",
            error: err
          });
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
      ref = entry.subEntries;
      for (i = 0, len = ref.length; i < len; i++) {
        subEntry = ref[i];
        this.insertEntry(subEntry, submenu, data);
      }
      $.add(entry.el, submenu);
    };

    Menu.prototype.close = function() {
      $.rm(this.menu);
      delete this.menu;
      $.rmClass(lastToggledButton, 'active');
      currentMenu = null;
      lastToggledButton = null;
      $.off(d, 'click scroll CloseMenu', this.close);
      $.off(d, 'scroll', this.setPosition);
      return $.off(window, 'resize', this.setPosition);
    };

    Menu.prototype.findNextEntry = function(entry, direction) {
      var entries;
      entries = slice.call(entry.parentNode.children);
      entries.sort(function(first, second) {
        return first.style.order - second.style.order;
      });
      return entries[entries.indexOf(entry) + direction];
    };

    Menu.prototype.keybinds = function(e) {
      var entry, next, nextPrev, subEntry, submenu;
      entry = $('.focused', this.menu);
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

    Menu.prototype.onFocus = function(e) {
      e.stopPropagation();
      return this.focus(e.target);
    };

    Menu.prototype.focus = function(entry) {
      var bottom, cHeight, cWidth, eRect, focused, i, left, len, ref, ref1, ref2, right, sRect, style, submenu, top;
      while (focused = $.x('parent::*/child::*[contains(@class,"focused")]', entry)) {
        $.rmClass(focused, 'focused');
      }
      ref = $$('.focused', entry);
      for (i = 0, len = ref.length; i < len; i++) {
        focused = ref[i];
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
      ref1 = eRect.top + sRect.height < cHeight ? ['0px', 'auto'] : ['auto', '0px'], top = ref1[0], bottom = ref1[1];
      ref2 = eRect.right + sRect.width < cWidth - 150 ? ['100%', 'auto'] : ['auto', '100%'], left = ref2[0], right = ref2[1];
      style = submenu.style;
      style.top = top;
      style.bottom = bottom;
      style.left = left;
      return style.right = right;
    };

    Menu.prototype.addEntry = function(entry) {
      this.parseEntry(entry);
      return this.entries.push(entry);
    };

    Menu.prototype.parseEntry = function(entry) {
      var el, i, len, subEntries, subEntry;
      el = entry.el, subEntries = entry.subEntries;
      $.addClass(el, 'entry');
      $.on(el, 'focus mouseover', this.onFocus);
      el.style.order = entry.order || 100;
      if (!subEntries) {
        return;
      }
      $.addClass(el, 'has-submenu');
      for (i = 0, len = subEntries.length; i < len; i++) {
        subEntry = subEntries[i];
        this.parseEntry(subEntry);
      }
    };

    return Menu;

  })();

  dragstart = function(e) {
    var el, isTouching, o, rect, ref, screenHeight, screenWidth;
    if (e.type === 'mousedown' && e.button !== 0) {
      return;
    }
    e.preventDefault();
    if (isTouching = e.type === 'touchstart') {
      e = e.changedTouches[e.changedTouches.length - 1];
    }
    el = $.x('ancestor::div[contains(@class,"dialog")][1]', this);
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
    ref = Conf['Header auto-hide'] || !Conf['Fixed Header'] ? [0, 0] : Conf['Bottom Header'] ? [0, Header.bar.getBoundingClientRect().height] : [Header.bar.getBoundingClientRect().height, 0], o.topBorder = ref[0], o.bottomBorder = ref[1];
    if (isTouching) {
      o.identifier = e.identifier;
      o.move = touchmove.bind(o);
      o.up = touchend.bind(o);
      $.on(d, 'touchmove', o.move);
      return $.on(d, 'touchend touchcancel', o.up);
    } else {
      o.move = drag.bind(o);
      o.up = dragend.bind(o);
      $.on(d, 'mousemove', o.move);
      return $.on(d, 'mouseup', o.up);
    }
  };

  touchmove = function(e) {
    var i, len, ref, touch;
    ref = e.changedTouches;
    for (i = 0, len = ref.length; i < len; i++) {
      touch = ref[i];
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
    top = top < (10 + this.topBorder) ? this.topBorder + 'px' : this.height - top < (10 + this.bottomBorder) ? null : top / this.screenHeight * 100 + '%';
    right = left === null ? 0 : null;
    bottom = top === null ? this.bottomBorder + 'px' : null;
    style = this.style;
    style.left = left;
    style.right = right;
    style.top = top;
    return style.bottom = bottom;
  };

  touchend = function(e) {
    var i, len, ref, touch;
    ref = e.changedTouches;
    for (i = 0, len = ref.length; i < len; i++) {
      touch = ref[i];
      if (touch.identifier === this.identifier) {
        dragend.call(this);
        return;
      }
    }
  };

  dragend = function() {
    if (this.isTouching) {
      $.off(d, 'touchmove', this.move);
      $.off(d, 'touchend touchcancel', this.up);
    } else {
      $.off(d, 'mousemove', this.move);
      $.off(d, 'mouseup', this.up);
    }
    return $.set(this.id + ".position", this.style.cssText);
  };

  hoverstart = function(arg) {
    var cb, el, endEvents, height, latestEvent, noRemove, o, ref, root;
    root = arg.root, el = arg.el, latestEvent = arg.latestEvent, endEvents = arg.endEvents, height = arg.height, cb = arg.cb, noRemove = arg.noRemove;
    o = {
      root: root,
      el: el,
      style: el.style,
      isImage: (ref = el.nodeName) === 'IMG' || ref === 'VIDEO',
      cb: cb,
      endEvents: endEvents,
      latestEvent: latestEvent,
      clientHeight: doc.clientHeight,
      clientWidth: doc.clientWidth,
      height: height,
      noRemove: noRemove
    };
    o.hover = hover.bind(o);
    o.hoverend = hoverend.bind(o);
    o.hover(o.latestEvent);
    new MutationObserver(function() {
      if (el.parentNode) {
        return o.hover(o.latestEvent);
      }
    }).observe(el, {
      childList: true
    });
    $.on(root, endEvents, o.hoverend);
    if ($.x('ancestor::div[contains(@class,"inline")][1]', root)) {
      $.on(d, 'keydown', o.hoverend);
    }
    $.on(root, 'mousemove', o.hover);
    o.workaround = function(e) {
      if (!root.contains(e.target)) {
        return o.hoverend(e);
      }
    };
    return $.on(doc, 'mousemove', o.workaround);
  };

  hoverstart.padding = 25;

  hover = function(e) {
    var clientX, clientY, height, left, ref, right, style, threshold, top;
    this.latestEvent = e;
    height = (this.height || this.el.offsetHeight) + hoverstart.padding;
    clientX = e.clientX, clientY = e.clientY;
    top = this.isImage ? Math.max(0, clientY * (this.clientHeight - height) / this.clientHeight) : Math.max(0, Math.min(this.clientHeight - height, clientY - 120));
    threshold = this.clientWidth / 2;
    if (!this.isImage) {
      threshold = Math.max(threshold, this.clientWidth - 400);
    }
    ref = clientX <= threshold ? [clientX + 45 + 'px', null] : [null, this.clientWidth - clientX + 45 + 'px'], left = ref[0], right = ref[1];
    style = this.style;
    style.top = top + 'px';
    style.left = left;
    return style.right = right;
  };

  hoverend = function(e) {
    if (e.type === 'keydown' && e.keyCode !== 13 || e.target.nodeName === "TEXTAREA") {
      return;
    }
    if (!this.noRemove) {
      $.rm(this.el);
    }
    $.off(this.root, this.endEvents, this.hoverend);
    $.off(d, 'keydown', this.hoverend);
    $.off(this.root, 'mousemove', this.hover);
    $.off(doc, 'mousemove', this.workaround);
    if (this.cb) {
      return this.cb.call(this);
    }
  };

  checkbox = function(name, text, checked) {
    var input, label;
    if (checked == null) {
      checked = Conf[name];
    }
    label = $.el('label');
    input = $.el('input', {
      type: 'checkbox',
      name: name,
      checked: checked
    });
    $.add(label, [input, $.tn(" " + text)]);
    return label;
  };

  return {
    dialog: dialog,
    Menu: Menu,
    hover: hoverstart,
    checkbox: checkbox
  };

}).call(this);

FappeTyme = (function() {
  var FappeTyme;

  FappeTyme = {
    init: function() {
      var el, i, indicator, lc, len, ref, ref1, type;
      if (!((Conf['Fappe Tyme'] || Conf['Werk Tyme']) && ((ref = g.VIEW) === 'index' || ref === 'thread'))) {
        return;
      }
      this.nodes = {};
      this.enabled = {
        fappe: false,
        werk: Conf['werk']
      };
      ref1 = ["Fappe", "Werk"];
      for (i = 0, len = ref1.length; i < len; i++) {
        type = ref1[i];
        if (!Conf[type + " Tyme"]) {
          continue;
        }
        lc = type.toLowerCase();
        el = UI.checkbox(lc, type + " Tyme", false);
        el.title = type + " Tyme";
        this.nodes[lc] = el.firstElementChild;
        if (Conf[lc]) {
          this.set(lc, true);
        }
        $.on(this.nodes[lc], 'change', this.toggle.bind(this, lc));
        Header.menu.addEntry({
          el: el,
          order: 97
        });
        indicator = $.el('span', {
          className: 'indicator',
          textContent: type[0],
          title: type + " Tyme active"
        });
        $.on(indicator, 'click', function() {
          var check;
          check = FappeTyme.nodes[this.parentNode.id.split('-')[0]];
          check.checked = !check.checked;
          return $.event('change', null, check);
        });
        Header.addShortcut(indicator, 410);
        indicator.parentNode.id = lc + "-indicator";
      }
      if (Conf['Werk Tyme']) {
        $.sync('werk', this.set.bind(this, 'werk'));
      }
      Callbacks.Post.push({
        name: 'Fappe Tyme',
        cb: this.node
      });
      return Callbacks.CatalogThread.push({
        name: 'Werk Tyme',
        cb: this.catalogNode
      });
    },
    node: function() {
      return this.nodes.root.classList.toggle('noFile', !this.file);
    },
    catalogNode: function() {
      var file, filename;
      file = this.thread.OP.file;
      if (!file) {
        return;
      }
      filename = $.el('div', {
        textContent: file.name,
        className: 'werkTyme-filename'
      });
      return $.add(this.nodes.thumb.parentNode, filename);
    },
    set: function(type, enabled) {
      this.enabled[type] = this.nodes[type].checked = enabled;
      return $[(enabled ? 'add' : 'rm') + "Class"](doc, type + "Tyme");
    },
    toggle: function(type) {
      this.set(type, !this.enabled[type]);
      if (type === 'werk') {
        return $.cb.checked.call(this.nodes[type]);
      }
    }
  };

  return FappeTyme;

}).call(this);

Gallery = (function() {
  var Gallery;

  Gallery = {
    init: function() {
      var el, ref;
      if (!(this.enabled = Conf['Gallery'] && ((ref = g.VIEW) === 'index' || ref === 'thread') && g.BOARD.ID !== 'f')) {
        return;
      }
      this.delay = Conf['Slide Delay'];
      el = $.el('a', {
        href: 'javascript:;',
        id: 'appchan-gal',
        title: 'Gallery',
        className: 'fa fa-picture-o',
        textContent: 'Gallery'
      });
      $.on(el, 'click', this.cb.toggle);
      Header.addShortcut(el, 530);
      return Callbacks.Post.push({
        name: 'Gallery',
        cb: this.node
      });
    },
    node: function() {
      var ref;
      if (!((ref = this.file) != null ? ref.thumb : void 0)) {
        return;
      }
      if (Gallery.nodes) {
        Gallery.generateThumb(this);
        Gallery.nodes.total.textContent = Gallery.images.length;
      }
      if (!Conf['Image Expansion']) {
        return $.on(this.file.thumb.parentNode, 'click', Gallery.cb.image);
      }
    },
    build: function(image) {
      var candidate, cb, dialog, entry, file, i, j, key, len, len1, menuButton, nodes, post, ref, ref1, ref2, ref3, thumb, value;
      cb = Gallery.cb;
      if (Conf['Fullscreen Gallery']) {
        $.one(d, 'fullscreenchange mozfullscreenchange webkitfullscreenchange', function() {
          return $.on(d, 'fullscreenchange mozfullscreenchange webkitfullscreenchange', cb.close);
        });
        if (typeof doc.mozRequestFullScreen === "function") {
          doc.mozRequestFullScreen();
        }
        if (typeof doc.webkitRequestFullScreen === "function") {
          doc.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      }
      Gallery.images = [];
      nodes = Gallery.nodes = {};
      Gallery.fullIDs = {};
      Gallery.slideshow = false;
      nodes.el = dialog = $.el('div', {
        id: 'a-gallery'
      });
      $.extend(dialog, {
        innerHTML: "<div class=\"gal-viewport\"><span class=\"gal-buttons\"><a href=\"javascript:;\" class=\"gal-start\" title=\"Start slideshow\"><i></i></a><a href=\"javascript:;\" class=\"gal-stop\" title=\"Stop slideshow\"><i></i></a><a href=\"javascript:;\" class=\"menu-button\"><i></i></a><a href=\"javascript:;\" class=\"gal-close\">×</a></span><a class=\"gal-name\" target=\"_blank\"></a><span class=\"gal-count\"><span class=\"count\"></span> / <span class=\"total\"></span></span><div class=\"gal-prev\"></div><div class=\"gal-image\"><a href=\"javascript:;\"><img></a></div><div class=\"gal-next\"></div></div><div class=\"gal-thumbnails\"></div>"
      });
      ref = {
        buttons: '.gal-buttons',
        frame: '.gal-image',
        name: '.gal-name',
        count: '.count',
        total: '.total',
        thumbs: '.gal-thumbnails',
        next: '.gal-image a',
        current: '.gal-image img'
      };
      for (key in ref) {
        value = ref[key];
        nodes[key] = $(value, dialog);
      }
      menuButton = $('.menu-button', dialog);
      nodes.menu = new UI.Menu('gallery');
      $.on(nodes.frame, 'click', cb.blank);
      if (Conf['Mouse Wheel Volume']) {
        $.on(nodes.frame, 'wheel', Volume.wheel);
      }
      $.on(nodes.next, 'click', cb.click);
      $.on(nodes.name, 'click', ImageCommon.download);
      $.on($('.gal-prev', dialog), 'click', cb.prev);
      $.on($('.gal-next', dialog), 'click', cb.next);
      $.on($('.gal-start', dialog), 'click', cb.start);
      $.on($('.gal-stop', dialog), 'click', cb.stop);
      $.on($('.gal-close', dialog), 'click', cb.close);
      $.on(menuButton, 'click', function(e) {
        return nodes.menu.toggle(e, this, g);
      });
      ref1 = Gallery.menu.createSubEntries();
      for (i = 0, len = ref1.length; i < len; i++) {
        entry = ref1[i];
        entry.order = 0;
        nodes.menu.addEntry(entry);
      }
      $.on(d, 'keydown', cb.keybinds);
      if (Conf['Keybinds']) {
        $.off(d, 'keydown', Keybinds.keydown);
      }
      $.on(window, 'resize', Gallery.cb.setHeight);
      ref2 = $$('.post .file');
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        file = ref2[j];
        post = Get.postFromNode(file);
        if (!((ref3 = post.file) != null ? ref3.thumb : void 0)) {
          continue;
        }
        Gallery.generateThumb(post);
        if (!image && Gallery.fullIDs[post.fullID]) {
          candidate = post.file.thumb.parentNode;
          if (Header.getTopOf(candidate) + candidate.getBoundingClientRect().height >= 0) {
            image = candidate;
          }
        }
      }
      $.addClass(doc, 'gallery-open');
      $.add(d.body, dialog);
      nodes.thumbs.scrollTop = 0;
      nodes.current.parentElement.scrollTop = 0;
      if (image) {
        thumb = $("[href='" + image.href + "']", nodes.thumbs);
      }
      thumb || (thumb = Gallery.images[Gallery.images.length - 1]);
      if (thumb) {
        Gallery.open(thumb);
      }
      doc.style.overflow = 'hidden';
      return nodes.total.textContent = Gallery.images.length;
    },
    generateThumb: function(post) {
      var thumb, thumbImg;
      if (post.isClone || post.isHidden) {
        return;
      }
      if (!(post.file && post.file.thumb && (post.file.isImage || post.file.isVideo || Conf['PDF in Gallery']))) {
        return;
      }
      if (Gallery.fullIDs[post.fullID]) {
        return;
      }
      Gallery.fullIDs[post.fullID] = true;
      thumb = $.el('a', {
        className: 'gal-thumb',
        href: post.file.url,
        target: '_blank',
        title: post.file.name
      });
      thumb.dataset.id = Gallery.images.length;
      thumb.dataset.post = post.fullID;
      thumbImg = post.file.thumb.cloneNode(false);
      thumbImg.style.cssText = '';
      $.add(thumb, thumbImg);
      $.on(thumb, 'click', Gallery.cb.open);
      Gallery.images.push(thumb);
      return $.add(Gallery.nodes.thumbs, thumb);
    },
    load: function(thumb, errorCB) {
      var elType, ext, file;
      ext = thumb.href.match(/\w*$/);
      elType = {
        'webm': 'video',
        'pdf': 'iframe'
      }[ext] || 'img';
      file = $.el(elType, {
        title: thumb.title
      });
      $.extend(file.dataset, thumb.dataset);
      $.on(file, 'error', errorCB);
      file.src = thumb.href;
      return file;
    },
    open: function(thumb) {
      var el, file, newID, nodes, oldID, post, ref;
      nodes = Gallery.nodes;
      oldID = +nodes.current.dataset.id;
      newID = +thumb.dataset.id;
      if (el = Gallery.images[oldID]) {
        $.rmClass(el, 'gal-highlight');
      }
      $.addClass(thumb, 'gal-highlight');
      nodes.thumbs.scrollTop = thumb.offsetTop + thumb.offsetHeight / 2 - nodes.thumbs.clientHeight / 2;
      if (((ref = Gallery.cache) != null ? ref.dataset.id : void 0) === '' + newID) {
        file = Gallery.cache;
        $.off(file, 'error', Gallery.cacheError);
        $.on(file, 'error', Gallery.error);
      } else {
        file = Gallery.load(thumb, Gallery.error);
      }
      $.off(nodes.current, 'error', Gallery.error);
      ImageCommon.pause(nodes.current);
      $.replace(nodes.current, file);
      nodes.current = file;
      if (file.nodeName === 'VIDEO') {
        file.loop = true;
        Volume.setup(file);
        if (Conf['Autoplay']) {
          file.play();
        }
        if (Conf['Show Controls']) {
          ImageCommon.addControls(file);
        }
      }
      doc.classList.toggle('gal-pdf', file.nodeName === 'IFRAME');
      Gallery.cb.setHeight();
      nodes.count.textContent = +thumb.dataset.id + 1;
      nodes.name.download = nodes.name.textContent = thumb.title;
      nodes.name.href = thumb.href;
      nodes.frame.scrollTop = 0;
      nodes.next.focus();
      if (Gallery.slideshow && (newID > oldID || (oldID === Gallery.images.length - 1 && newID === 0))) {
        Gallery.setupTimer();
      } else {
        Gallery.cb.stop();
      }
      if (Conf['Scroll to Post'] && (post = g.posts[file.dataset.post])) {
        Header.scrollTo(post.nodes.root);
      }
      if (isNaN(oldID) || newID === (oldID + 1) % Gallery.images.length) {
        return Gallery.cache = Gallery.load(Gallery.images[(newID + 1) % Gallery.images.length], Gallery.cacheError);
      }
    },
    error: function() {
      var ref;
      if (((ref = this.error) != null ? ref.code : void 0) === MediaError.MEDIA_ERR_DECODE) {
        return new Notice('error', 'Corrupt or unplayable video', 30);
      }
      if (this.src.split('/')[2] !== 'i.4cdn.org') {
        return;
      }
      return ImageCommon.error(this, g.posts[this.dataset.post], null, (function(_this) {
        return function(url) {
          if (!url) {
            return;
          }
          Gallery.images[_this.dataset.id].href = url;
          if (Gallery.nodes.current === _this) {
            return _this.src = url;
          }
        };
      })(this));
    },
    cacheError: function() {
      return delete Gallery.cache;
    },
    cleanupTimer: function() {
      var current;
      clearTimeout(Gallery.timeoutID);
      current = Gallery.nodes.current;
      $.off(current, 'canplaythrough load', Gallery.startTimer);
      return $.off(current, 'ended', Gallery.cb.next);
    },
    startTimer: function() {
      return Gallery.timeoutID = setTimeout(Gallery.checkTimer, Gallery.delay * $.SECOND);
    },
    setupTimer: function() {
      var current, isVideo;
      Gallery.cleanupTimer();
      current = Gallery.nodes.current;
      isVideo = current.nodeName === 'VIDEO';
      if (isVideo) {
        current.play();
      }
      if ((isVideo ? current.readyState >= 4 : current.complete) || current.nodeName === 'IFRAME') {
        return Gallery.startTimer();
      } else {
        return $.on(current, (isVideo ? 'canplaythrough' : 'load'), Gallery.startTimer);
      }
    },
    checkTimer: function() {
      var current;
      current = Gallery.nodes.current;
      if (current.nodeName === 'VIDEO' && !current.paused) {
        $.on(current, 'ended', Gallery.cb.next);
        return current.loop = false;
      } else {
        return Gallery.cb.next();
      }
    },
    cb: {
      keybinds: function(e) {
        var cb, key;
        if (!(key = Keybinds.keyCode(e))) {
          return;
        }
        cb = (function() {
          switch (key) {
            case Conf['Close']:
            case Conf['Open Gallery']:
              return Gallery.cb.close;
            case 'Right':
              return Gallery.cb.next;
            case 'Enter':
              return Gallery.cb.advance;
            case 'Left':
            case '':
              return Gallery.cb.prev;
            case Conf['Pause']:
              return Gallery.cb.pause;
            case Conf['Slideshow']:
              return Gallery.cb.toggleSlideshow;
          }
        })();
        if (!cb) {
          return;
        }
        e.stopPropagation();
        e.preventDefault();
        return cb();
      },
      open: function(e) {
        if (e) {
          e.preventDefault();
        }
        if (this) {
          return Gallery.open(this);
        }
      },
      image: function(e) {
        e.preventDefault();
        e.stopPropagation();
        return Gallery.build(this);
      },
      prev: function() {
        return Gallery.cb.open.call(Gallery.images[+Gallery.nodes.current.dataset.id - 1] || Gallery.images[Gallery.images.length - 1]);
      },
      next: function() {
        return Gallery.cb.open.call(Gallery.images[+Gallery.nodes.current.dataset.id + 1] || Gallery.images[0]);
      },
      click: function(e) {
        if (ImageCommon.onControls(e)) {
          return;
        }
        e.preventDefault();
        return Gallery.cb.advance();
      },
      advance: function() {
        if (!Conf['Autoplay'] && Gallery.nodes.current.paused) {
          return Gallery.nodes.current.play();
        } else {
          return Gallery.cb.next();
        }
      },
      toggle: function() {
        return (Gallery.nodes ? Gallery.cb.close : Gallery.build)();
      },
      blank: function(e) {
        if (e.target === this) {
          return Gallery.cb.close();
        }
      },
      toggleSlideshow: function() {
        return Gallery.cb[Gallery.slideshow ? 'stop' : 'start']();
      },
      pause: function() {
        var current;
        Gallery.cb.stop();
        current = Gallery.nodes.current;
        if (current.nodeName === 'VIDEO') {
          return current[current.paused ? 'play' : 'pause']();
        }
      },
      start: function() {
        $.addClass(Gallery.nodes.buttons, 'gal-playing');
        Gallery.slideshow = true;
        return Gallery.setupTimer();
      },
      stop: function() {
        var current;
        if (!Gallery.slideshow) {
          return;
        }
        Gallery.cleanupTimer();
        current = Gallery.nodes.current;
        if (current.nodeName === 'VIDEO') {
          current.loop = true;
        }
        $.rmClass(Gallery.nodes.buttons, 'gal-playing');
        return Gallery.slideshow = false;
      },
      close: function() {
        $.off(Gallery.nodes.current, 'error', Gallery.error);
        ImageCommon.pause(Gallery.nodes.current);
        $.rm(Gallery.nodes.el);
        $.rmClass(doc, 'gallery-open');
        if (Conf['Fullscreen Gallery']) {
          $.off(d, 'fullscreenchange mozfullscreenchange webkitfullscreenchange', Gallery.cb.close);
          if (typeof d.mozCancelFullScreen === "function") {
            d.mozCancelFullScreen();
          }
          if (typeof d.webkitExitFullscreen === "function") {
            d.webkitExitFullscreen();
          }
        }
        delete Gallery.nodes;
        delete Gallery.fullIDs;
        doc.style.overflow = '';
        $.off(d, 'keydown', Gallery.cb.keybinds);
        if (Conf['Keybinds']) {
          $.on(d, 'keydown', Keybinds.keydown);
        }
        $.off(window, 'resize', Gallery.cb.setHeight);
        return clearTimeout(Gallery.timeoutID);
      },
      setFitness: function() {
        return (this.checked ? $.addClass : $.rmClass)(doc, "gal-" + (this.name.toLowerCase().replace(/\s+/g, '-')));
      },
      setHeight: $.debounce(100, function() {
        var current, dim, frame, height, minHeight, ref, ref1, ref2, style, width;
        ref = Gallery.nodes, current = ref.current, frame = ref.frame;
        style = current.style;
        if (Conf['Stretch to Fit'] && (dim = (ref1 = g.posts[current.dataset.post]) != null ? ref1.file.dimensions : void 0)) {
          ref2 = dim.split('x'), width = ref2[0], height = ref2[1];
          minHeight = Math.min(doc.clientHeight - 25, height / width * frame.clientWidth);
          style.minHeight = minHeight + 'px';
          return style.minWidth = (width / height * minHeight) + 'px';
        } else {
          return style.minHeight = style.minWidth = null;
        }
      }),
      setDelay: function() {
        return Gallery.delay = +this.value;
      }
    },
    menu: {
      init: function() {
        var el;
        if (!Gallery.enabled) {
          return;
        }
        el = $.el('span', {
          textContent: 'Gallery',
          className: 'gallery-link'
        });
        return Header.menu.addEntry({
          el: el,
          order: 105,
          subEntries: Gallery.menu.createSubEntries()
        });
      },
      createSubEntry: function(name) {
        var input, label;
        label = UI.checkbox(name, name);
        input = label.firstElementChild;
        if (name === 'Hide Thumbnails' || name === 'Fit Width' || name === 'Fit Height') {
          $.on(input, 'change', Gallery.cb.setFitness);
        }
        $.event('change', null, input);
        $.on(input, 'change', $.cb.checked);
        if (name === 'Hide Thumbnails' || name === 'Fit Width' || name === 'Fit Height' || name === 'Stretch to Fit') {
          $.on(input, 'change', Gallery.cb.setHeight);
        }
        return {
          el: label
        };
      },
      createSubEntries: function() {
        var delayInput, delayLabel, item, subEntries;
        subEntries = (function() {
          var i, len, ref, results;
          ref = ['Hide Thumbnails', 'Fit Width', 'Fit Height', 'Stretch to Fit', 'Scroll to Post'];
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            results.push(Gallery.menu.createSubEntry(item));
          }
          return results;
        })();
        delayLabel = $.el('label', {
          innerHTML: "Slide Delay: <input type=\"number\" name=\"Slide Delay\" min=\"0\" step=\"any\" class=\"field\">"
        });
        delayInput = delayLabel.firstElementChild;
        delayInput.value = Gallery.delay;
        $.on(delayInput, 'change', Gallery.cb.setDelay);
        $.on(delayInput, 'change', $.cb.value);
        subEntries.push({
          el: delayLabel
        });
        return subEntries;
      }
    }
  };

  return Gallery;

}).call(this);

ImageCommon = (function() {
  var ImageCommon;

  ImageCommon = {
    pause: function(video) {
      if (video.nodeName !== 'VIDEO') {
        return;
      }
      video.pause();
      $.off(video, 'volumechange', Volume.change);
      return video.muted = true;
    },
    rewind: function(el) {
      if (el.nodeName === 'VIDEO') {
        if (el.readyState >= el.HAVE_METADATA) {
          return el.currentTime = 0;
        }
      } else if (/\.gif$/.test(el.src)) {
        return $.queueTask(function() {
          return el.src = el.src;
        });
      }
    },
    pushCache: function(el) {
      ImageCommon.cache = el;
      return $.on(el, 'error', ImageCommon.cacheError);
    },
    popCache: function() {
      var el;
      el = ImageCommon.cache;
      $.off(el, 'error', ImageCommon.cacheError);
      delete ImageCommon.cache;
      return el;
    },
    cacheError: function() {
      if (ImageCommon.cache === this) {
        return delete ImageCommon.cache;
      }
    },
    decodeError: function(file, post) {
      var message, ref;
      if (((ref = file.error) != null ? ref.code : void 0) !== MediaError.MEDIA_ERR_DECODE) {
        return false;
      }
      if (!(message = $('.warning', post.file.thumb.parentNode))) {
        message = $.el('div', {
          className: 'warning'
        });
        $.after(post.file.thumb, message);
      }
      message.textContent = 'Error: Corrupt or unplayable video';
      return true;
    },
    error: function(file, post, delay, cb) {
      var URL, redirect, src, timeoutID;
      src = post.file.url.split('/');
      URL = Redirect.to('file', {
        boardID: post.board.ID,
        filename: src[src.length - 1]
      });
      if (!(Conf['404 Redirect'] && URL && Redirect.securityCheck(URL))) {
        URL = null;
      }
      if ((post.isDead || post.file.isDead) && file.src.split('/')[2] === 'i.4cdn.org') {
        return cb(URL);
      }
      if (delay != null) {
        timeoutID = setTimeout((function() {
          return cb(URL);
        }), delay);
      }
      if (post.isDead || post.file.isDead) {
        return;
      }
      redirect = function() {
        if (file.src.split('/')[2] === 'i.4cdn.org') {
          if (delay != null) {
            clearTimeout(timeoutID);
          }
          return cb(URL);
        }
      };
      return $.ajax("//a.4cdn.org/" + post.board + "/thread/" + post.thread + ".json", {
        onload: function() {
          var i, len, postObj, ref;
          if (this.status === 404) {
            post.kill(!post.isClone);
          }
          if (this.status !== 200) {
            return redirect();
          }
          ref = this.response.posts;
          for (i = 0, len = ref.length; i < len; i++) {
            postObj = ref[i];
            if (postObj.no === post.ID) {
              break;
            }
          }
          if (postObj.no !== post.ID) {
            post.kill();
            return redirect();
          } else if (postObj.filedeleted) {
            post.kill(true);
            return redirect();
          } else {
            return URL = post.file.url;
          }
        }
      });
    },
    addControls: function(video) {
      var handler;
      handler = function() {
        var t;
        $.off(video, 'mouseover', handler);
        t = new Date().getTime();
        return $.asap((function() {
          return $.engine !== 'gecko' || (video.readyState >= 3 && video.currentTime <= Math.max(0.1, video.duration - 0.5)) || new Date().getTime() >= t + 1000;
        }), function() {
          return video.controls = true;
        });
      };
      return $.on(video, 'mouseover', handler);
    },
    onControls: function(e) {
      return (Conf['Show Controls'] && Conf['Click Passthrough'] && e.target.nodeName === 'VIDEO') || (e.target.controls && e.target.getBoundingClientRect().bottom - e.clientY < 35);
    },
    download: function(e) {
      var download, href;
      if (this.protocol === 'blob:') {
        return true;
      }
      e.preventDefault();
      href = this.href, download = this.download;
      return CrossOrigin.file(href, function(blob) {
        var a;
        if (blob) {
          a = $.el('a', {
            href: URL.createObjectURL(blob),
            download: download,
            hidden: true
          });
          $.add(d.body, a);
          a.click();
          return $.rm(a);
        } else {
          return new Notice('warning', "Could not download " + href, 20);
        }
      });
    }
  };

  return ImageCommon;

}).call(this);

ImageExpand = (function() {
  var ImageExpand,
    slice = [].slice;

  ImageExpand = {
    init: function() {
      var ref;
      if (!(this.enabled = Conf['Image Expansion'] && ((ref = g.VIEW) === 'index' || ref === 'thread') && g.BOARD.ID !== 'f')) {
        return;
      }
      this.EAI = $.el('a', {
        className: 'expand-all-shortcut fa fa-expand',
        textContent: 'EAI',
        title: 'Expand All Images',
        href: 'javascript:;'
      });
      $.on(this.EAI, 'click', this.cb.toggleAll);
      Header.addShortcut(this.EAI, 520);
      $.on(d, 'scroll visibilitychange', this.cb.playVideos);
      this.videoControls = $.el('span', {
        className: 'video-controls'
      });
      $.extend(this.videoControls, {
        innerHTML: " <a href=\"javascript:;\" title=\"You can also contract the video by dragging it to the left.\">contract</a>"
      });
      return Callbacks.Post.push({
        name: 'Image Expansion',
        cb: this.node
      });
    },
    node: function() {
      var ref;
      if (!(this.file && (this.file.isImage || this.file.isVideo))) {
        return;
      }
      $.on(this.file.thumb.parentNode, 'click', ImageExpand.cb.toggle);
      if (this.isClone) {
        if (this.file.isExpanding) {
          ImageExpand.contract(this);
          return ImageExpand.expand(this);
        } else if (this.file.isExpanded && this.file.isVideo) {
          Volume.setup(this.file.fullImage);
          ImageExpand.setupVideoCB(this);
          return ImageExpand.setupVideo(this, !((ref = this.origin.file.fullImage) != null ? ref.paused : void 0) || this.origin.file.wasPlaying, this.file.fullImage.controls);
        }
      } else if (ImageExpand.on && !this.isHidden && !this.isFetchedQuote && (Conf['Expand spoilers'] || !this.file.isSpoiler) && (Conf['Expand videos'] || !this.file.isVideo)) {
        return ImageExpand.expand(this);
      }
    },
    cb: {
      toggle: function(e) {
        var file, post, ref;
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
          return;
        }
        post = Get.postFromNode(this);
        file = post.file;
        if (file.isExpanded && ImageCommon.onControls(e)) {
          return;
        }
        e.preventDefault();
        if (!Conf['Autoplay'] && ((ref = file.fullImage) != null ? ref.paused : void 0)) {
          return file.fullImage.play();
        } else {
          return ImageExpand.toggle(post);
        }
      },
      toggleAll: function() {
        var func, toggle;
        $.event('CloseMenu');
        toggle = function(post) {
          var file;
          file = post.file;
          if (!(file && (file.isImage || file.isVideo) && doc.contains(post.nodes.root))) {
            return;
          }
          if (ImageExpand.on && (!Conf['Expand spoilers'] && file.isSpoiler || !Conf['Expand videos'] && file.isVideo || Conf['Expand from here'] && Header.getTopOf(file.thumb) < 0)) {
            return;
          }
          return $.queueTask(func, post);
        };
        if (ImageExpand.on = $.hasClass(ImageExpand.EAI, 'expand-all-shortcut')) {
          ImageExpand.EAI.className = 'contract-all-shortcut fa fa-compress';
          ImageExpand.EAI.title = 'Contract All Images';
          func = ImageExpand.expand;
        } else {
          ImageExpand.EAI.className = 'expand-all-shortcut fa fa-expand';
          ImageExpand.EAI.title = 'Expand All Images';
          func = ImageExpand.contract;
        }
        return g.posts.forEach(function(post) {
          var i, len, ref;
          ref = [post].concat(slice.call(post.clones));
          for (i = 0, len = ref.length; i < len; i++) {
            post = ref[i];
            toggle(post);
          }
        });
      },
      playVideos: function() {
        return g.posts.forEach(function(post) {
          var file, i, len, ref, video, visible;
          ref = [post].concat(slice.call(post.clones));
          for (i = 0, len = ref.length; i < len; i++) {
            post = ref[i];
            file = post.file;
            if (!(file && file.isVideo && file.isExpanded)) {
              continue;
            }
            video = file.fullImage;
            visible = ($.hasAudio(video) && !video.muted) || Header.isNodeVisible(video);
            if (visible && file.wasPlaying) {
              delete file.wasPlaying;
              video.play();
            } else if (!visible && !video.paused) {
              file.wasPlaying = true;
              video.pause();
            }
          }
        });
      },
      setFitness: function() {
        return $[this.checked ? 'addClass' : 'rmClass'](doc, this.name.toLowerCase().replace(/\s+/g, '-'));
      }
    },
    toggle: function(post) {
      var next;
      if (!(post.file.isExpanding || post.file.isExpanded)) {
        post.file.scrollIntoView = Conf['Scroll into view'];
        ImageExpand.expand(post);
        return;
      }
      ImageExpand.contract(post);
      if (Conf['Advance on contract']) {
        next = post.nodes.root;
        while (next = $.x("following::div[contains(@class,'postContainer')][1]", next)) {
          if (!($('.stub', next) || next.offsetHeight === 0)) {
            break;
          }
        }
        if (next) {
          return Header.scrollTo(next);
        }
      }
    },
    contract: function(post) {
      var bottom, cb, el, eventName, file, i, len, oldHeight, ref, ref1, scrollY, top, x;
      file = post.file;
      if (el = file.fullImage) {
        top = Header.getTopOf(el);
        bottom = top + el.getBoundingClientRect().height;
        oldHeight = d.body.clientHeight;
        scrollY = window.scrollY;
      }
      $.rmClass(post.nodes.root, 'expanded-image');
      $.rmClass(file.thumb, 'expanding');
      $.rm(file.videoControls);
      file.thumb.parentNode.href = file.url;
      file.thumb.parentNode.target = '_blank';
      ref = ['isExpanding', 'isExpanded', 'videoControls', 'wasPlaying', 'scrollIntoView'];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        delete file[x];
      }
      if (!el) {
        return;
      }
      if (doc.contains(el)) {
        if (bottom <= 0) {
          window.scrollBy(0, scrollY - window.scrollY + d.body.clientHeight - oldHeight);
        } else {
          Header.scrollToIfNeeded(post.nodes.root);
        }
        if (window.scrollX > 0) {
          window.scrollBy(-window.scrollX, 0);
        }
      }
      $.off(el, 'error', ImageExpand.error);
      ImageCommon.pushCache(el);
      if (file.isVideo) {
        ImageCommon.pause(el);
        ref1 = ImageExpand.videoCB;
        for (eventName in ref1) {
          cb = ref1[eventName];
          $.off(el, eventName, cb);
        }
      }
      if (Conf['Restart when Opened']) {
        ImageCommon.rewind(file.thumb);
      }
      delete file.fullImage;
      return $.queueTask(function() {
        if (file.isExpanding || file.isExpanded) {
          return;
        }
        $.rmClass(el, 'full-image');
        if (el.id) {
          return;
        }
        return $.rm(el);
      });
    },
    expand: function(post, src) {
      var el, file, isVideo, ref, thumb;
      file = post.file;
      thumb = file.thumb, isVideo = file.isVideo;
      if (post.isHidden || file.isExpanding || file.isExpanded) {
        return;
      }
      $.addClass(thumb, 'expanding');
      file.isExpanding = true;
      if (file.fullImage) {
        el = file.fullImage;
      } else if (((ref = ImageCommon.cache) != null ? ref.dataset.fullID : void 0) === post.fullID) {
        el = file.fullImage = ImageCommon.popCache();
        $.on(el, 'error', ImageExpand.error);
        if (Conf['Restart when Opened'] && el.id !== 'ihover') {
          ImageCommon.rewind(el);
        }
        el.removeAttribute('id');
      } else {
        el = file.fullImage = $.el((isVideo ? 'video' : 'img'));
        el.dataset.fullID = post.fullID;
        $.on(el, 'error', ImageExpand.error);
        el.src = src || file.url;
      }
      el.className = 'full-image';
      $.after(thumb, el);
      if (isVideo) {
        if (Conf['Show Controls'] && Conf['Click Passthrough'] && !file.videoControls) {
          file.videoControls = ImageExpand.videoControls.cloneNode(true);
          $.add(file.text, file.videoControls);
        }
        thumb.parentNode.removeAttribute('href');
        thumb.parentNode.removeAttribute('target');
        el.loop = true;
        Volume.setup(el);
        ImageExpand.setupVideoCB(post);
      }
      if (!isVideo) {
        return $.asap((function() {
          return el.naturalHeight;
        }), function() {
          return ImageExpand.completeExpand(post);
        });
      } else if (el.readyState >= el.HAVE_METADATA) {
        return ImageExpand.completeExpand(post);
      } else {
        return $.on(el, 'loadedmetadata', function() {
          return ImageExpand.completeExpand(post);
        });
      }
    },
    completeExpand: function(post) {
      var bottom, file, imageBottom, oldHeight, scrollY;
      file = post.file;
      if (!file.isExpanding) {
        return;
      }
      bottom = Header.getTopOf(file.thumb) + file.thumb.getBoundingClientRect().height;
      oldHeight = d.body.clientHeight;
      scrollY = window.scrollY;
      $.addClass(post.nodes.root, 'expanded-image');
      $.rmClass(file.thumb, 'expanding');
      file.isExpanded = true;
      delete file.isExpanding;
      if (doc.contains(post.nodes.root) && bottom <= 0) {
        window.scrollBy(0, scrollY - window.scrollY + d.body.clientHeight - oldHeight);
      }
      if (file.scrollIntoView) {
        delete file.scrollIntoView;
        imageBottom = Math.min(doc.clientHeight - file.fullImage.getBoundingClientRect().bottom - 25, Header.getBottomOf(file.fullImage));
        if (imageBottom < 0) {
          window.scrollBy(0, Math.min(-imageBottom, Header.getTopOf(file.fullImage)));
        }
      }
      if (file.isVideo) {
        return ImageExpand.setupVideo(post, Conf['Autoplay'], Conf['Show Controls']);
      }
    },
    setupVideo: function(post, playing, controls) {
      var fullImage;
      fullImage = post.file.fullImage;
      if (!playing) {
        fullImage.controls = controls;
        return;
      }
      fullImage.controls = false;
      $.asap((function() {
        return doc.contains(fullImage);
      }), function() {
        if (!d.hidden && Header.isNodeVisible(fullImage)) {
          return fullImage.play();
        } else {
          return post.file.wasPlaying = true;
        }
      });
      if (controls) {
        return ImageCommon.addControls(fullImage);
      }
    },
    videoCB: (function() {
      var mousedown;
      mousedown = false;
      return {
        mouseover: function() {
          return mousedown = false;
        },
        mousedown: function(e) {
          if (e.button === 0) {
            return mousedown = true;
          }
        },
        mouseup: function(e) {
          if (e.button === 0) {
            return mousedown = false;
          }
        },
        mouseout: function(e) {
          if (mousedown && e.clientX <= this.getBoundingClientRect().left) {
            return ImageExpand.toggle(Get.postFromNode(this));
          }
        }
      };
    })(),
    setupVideoCB: function(post) {
      var cb, eventName, ref;
      ref = ImageExpand.videoCB;
      for (eventName in ref) {
        cb = ref[eventName];
        $.on(post.file.fullImage, eventName, cb);
      }
      if (post.file.videoControls) {
        return $.on(post.file.videoControls.firstElementChild, 'click', function() {
          return ImageExpand.toggle(post);
        });
      }
    },
    error: function() {
      var post;
      post = Get.postFromNode(this);
      $.rm(this);
      delete post.file.fullImage;
      if (!(post.file.isExpanding || post.file.isExpanded)) {
        return;
      }
      if (ImageCommon.decodeError(this, post)) {
        return ImageExpand.contract(post);
      }
      if (this.src.split('/')[2] !== 'i.4cdn.org') {
        return ImageExpand.contract(post);
      }
      return ImageCommon.error(this, post, 10 * $.SECOND, function(URL) {
        if (post.file.isExpanding || post.file.isExpanded) {
          ImageExpand.contract(post);
          if (URL) {
            return ImageExpand.expand(post, URL);
          }
        }
      });
    },
    menu: {
      init: function() {
        var conf, createSubEntry, el, name, ref, subEntries;
        if (!ImageExpand.enabled) {
          return;
        }
        el = $.el('span', {
          textContent: 'Image Expansion',
          className: 'image-expansion-link'
        });
        createSubEntry = ImageExpand.menu.createSubEntry;
        subEntries = [];
        ref = Config.imageExpansion;
        for (name in ref) {
          conf = ref[name];
          subEntries.push(createSubEntry(name, conf[1]));
        }
        return Header.menu.addEntry({
          el: el,
          order: 105,
          subEntries: subEntries
        });
      },
      createSubEntry: function(name, desc) {
        var input, label;
        label = UI.checkbox(name, name);
        label.title = desc;
        input = label.firstElementChild;
        if (name === 'Fit width' || name === 'Fit height') {
          $.on(input, 'change', ImageExpand.cb.setFitness);
        }
        $.event('change', null, input);
        $.on(input, 'change', $.cb.checked);
        return {
          el: label
        };
      }
    }
  };

  return ImageExpand;

}).call(this);

ImageHover = (function() {
  var ImageHover;

  ImageHover = {
    init: function() {
      var ref;
      if ((ref = g.VIEW) !== 'index' && ref !== 'thread') {
        return;
      }
      if (Conf['Image Hover']) {
        Callbacks.Post.push({
          name: 'Image Hover',
          cb: this.node
        });
      }
      if (Conf['Image Hover in Catalog']) {
        return Callbacks.CatalogThread.push({
          name: 'Image Hover',
          cb: this.catalogNode
        });
      }
    },
    node: function() {
      if (!(this.file && (this.file.isImage || this.file.isVideo))) {
        return;
      }
      return $.on(this.file.thumb, 'mouseover', ImageHover.mouseover(this));
    },
    catalogNode: function() {
      var file;
      file = this.thread.OP.file;
      if (!(file && (file.isImage || file.isVideo))) {
        return;
      }
      return $.on(this.nodes.thumb, 'mouseover', ImageHover.mouseover(this.thread.OP));
    },
    mouseover: function(post) {
      return function(e) {
        var el, error, file, height, isVideo, left, maxHeight, maxWidth, ref, ref1, ref2, right, scale, width, x;
        if (!doc.contains(this)) {
          return;
        }
        file = post.file;
        isVideo = file.isVideo;
        if (file.isExpanding || file.isExpanded) {
          return;
        }
        error = ImageHover.error(post);
        if (((ref = ImageCommon.cache) != null ? ref.dataset.fullID : void 0) === post.fullID) {
          el = ImageCommon.popCache();
          $.on(el, 'error', error);
        } else {
          el = $.el((isVideo ? 'video' : 'img'));
          el.dataset.fullID = post.fullID;
          $.on(el, 'error', error);
          el.src = file.url;
        }
        if (Conf['Restart when Opened']) {
          ImageCommon.rewind(el);
          ImageCommon.rewind(this);
        }
        el.id = 'ihover';
        $.add(Header.hover, el);
        if (isVideo) {
          el.loop = true;
          el.controls = false;
          Volume.setup(el);
          if (Conf['Autoplay']) {
            el.play();
            if (this.nodeName === 'VIDEO') {
              this.currentTime = el.currentTime;
            }
          }
        }
        ref1 = (function() {
          var i, len, ref1, results;
          ref1 = file.dimensions.split('x');
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            x = ref1[i];
            results.push(+x);
          }
          return results;
        })(), width = ref1[0], height = ref1[1];
        ref2 = this.getBoundingClientRect(), left = ref2.left, right = ref2.right;
        maxWidth = Math.max(left, doc.clientWidth - right);
        maxHeight = doc.clientHeight - UI.hover.padding;
        scale = Math.min(1, maxWidth / width, maxHeight / height);
        el.style.maxWidth = (scale * width) + "px";
        el.style.maxHeight = (scale * height) + "px";
        return UI.hover({
          root: this,
          el: el,
          latestEvent: e,
          endEvents: 'mouseout click',
          height: scale * height,
          noRemove: true,
          cb: function() {
            $.off(el, 'error', error);
            ImageCommon.pushCache(el);
            ImageCommon.pause(el);
            $.rm(el);
            return el.removeAttribute('style');
          }
        });
      };
    },
    error: function(post) {
      return function() {
        if (ImageCommon.decodeError(this, post)) {
          return;
        }
        return ImageCommon.error(this, post, 3 * $.SECOND, (function(_this) {
          return function(URL) {
            if (URL) {
              return _this.src = URL + (_this.src === URL ? '?' + Date.now() : '');
            } else {
              return $.rm(_this);
            }
          };
        })(this));
      };
    }
  };

  return ImageHover;

}).call(this);

ImageLoader = (function() {
  var ImageLoader,
    slice = [].slice;

  ImageLoader = {
    init: function() {
      var prefetch, ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && g.BOARD.ID !== 'f')) {
        return;
      }
      if (!(Conf['Image Prefetching'] || Conf['Replace JPG'] || Conf['Replace PNG'] || Conf['Replace GIF'] || Conf['Replace WEBM'])) {
        return;
      }
      Callbacks.Post.push({
        name: 'Image Replace',
        cb: this.node
      });
      $.on(d, 'PostsInserted', function() {
        return g.posts.forEach(ImageLoader.prefetch);
      });
      if (Conf['Replace WEBM']) {
        $.on(d, 'scroll visibilitychange 4chanXInitFinished PostsInserted', this.playVideos);
      }
      if (!Conf['Image Prefetching']) {
        return;
      }
      prefetch = $.el('label', {
        innerHTML: "<input type=\"checkbox\" name=\"prefetch\"> Prefetch Images"
      });
      this.el = prefetch.firstElementChild;
      $.on(this.el, 'change', this.toggle);
      return Header.menu.addEntry({
        el: prefetch,
        order: 98
      });
    },
    node: function() {
      if (this.isClone || !this.file) {
        return;
      }
      if (Conf['Replace WEBM'] && this.file.isVideo) {
        ImageLoader.replaceVideo(this);
      }
      return ImageLoader.prefetch(this);
    },
    replaceVideo: function(post) {
      var attr, file, i, len, ref, thumb, video;
      file = post.file;
      thumb = file.thumb;
      video = $.el('video', {
        preload: 'none',
        loop: true,
        muted: true,
        poster: thumb.src || thumb.dataset.src,
        textContent: thumb.alt,
        className: thumb.className
      });
      video.setAttribute('muted', 'muted');
      video.dataset.md5 = thumb.dataset.md5;
      ref = ['height', 'width', 'maxHeight', 'maxWidth'];
      for (i = 0, len = ref.length; i < len; i++) {
        attr = ref[i];
        video.style[attr] = thumb.style[attr];
      }
      video.src = file.url;
      $.replace(thumb, video);
      file.thumb = video;
      return file.videoThumb = true;
    },
    prefetch: function(post) {
      var clone, el, file, i, isImage, isVideo, len, match, ref, replace, thumb, type, url;
      file = post.file;
      if (!file) {
        return;
      }
      isImage = file.isImage, isVideo = file.isVideo, thumb = file.thumb, url = file.url;
      if (file.isPrefetched || !(isImage || isVideo) || post.isHidden || post.thread.isHidden) {
        return;
      }
      type = (match = url.match(/\.([^.]+)$/)[1].toUpperCase()) === 'JPEG' ? 'JPG' : match;
      replace = Conf["Replace " + type] && !/spoiler/.test(thumb.src || thumb.dataset.src);
      if (!(replace || Conf['prefetch'])) {
        return;
      }
      if (![post].concat(slice.call(post.clones)).some(function(clone) {
        return doc.contains(clone.nodes.root);
      })) {
        return;
      }
      file.isPrefetched = true;
      if (file.videoThumb) {
        ref = post.clones;
        for (i = 0, len = ref.length; i < len; i++) {
          clone = ref[i];
          clone.file.thumb.preload = 'auto';
        }
        thumb.preload = 'auto';
        if ($.engine === 'gecko') {
          $.on(thumb, 'loadeddata', function() {
            return this.removeAttribute('poster');
          });
        }
        return;
      }
      el = $.el(isImage ? 'img' : 'video');
      if (replace && isImage) {
        $.on(el, 'load', function() {
          var j, len1, ref1;
          ref1 = post.clones;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            clone = ref1[j];
            clone.file.thumb.src = url;
          }
          thumb.src = url;
          return thumb.removeAttribute('data-src');
        });
      }
      return el.src = url;
    },
    toggle: function() {
      if (Conf['prefetch'] = this.checked) {
        g.posts.forEach(ImageLoader.prefetch);
      }
    },
    playVideos: function() {
      var qpClone, ref;
      qpClone = (ref = $.id('qp')) != null ? ref.firstElementChild : void 0;
      return g.posts.forEach(function(post) {
        var i, len, ref1, ref2, thumb;
        ref1 = [post].concat(slice.call(post.clones));
        for (i = 0, len = ref1.length; i < len; i++) {
          post = ref1[i];
          if (!((ref2 = post.file) != null ? ref2.videoThumb : void 0)) {
            continue;
          }
          thumb = post.file.thumb;
          if (Header.isNodeVisible(thumb) || post.nodes.root === qpClone) {
            thumb.play();
          } else {
            thumb.pause();
          }
        }
      });
    }
  };

  return ImageLoader;

}).call(this);

Metadata = (function() {
  var Metadata;

  Metadata = {
    init: function() {
      var ref;
      if (!(Conf['WEBM Metadata'] && ((ref = g.VIEW) === 'index' || ref === 'thread') && g.BOARD.ID !== 'f')) {
        return;
      }
      return Callbacks.Post.push({
        name: 'WEBM Metadata',
        cb: this.node
      });
    },
    node: function() {
      var el;
      if (!(this.file && /webm$/i.test(this.file.url))) {
        return;
      }
      if (this.isClone) {
        el = $('.webm-title', this.file.text);
      } else {
        el = $.el('span', {
          className: 'webm-title'
        });
        $.extend(el, {
          innerHTML: "<a href=\"javascript:;\"></a>"
        });
        $.add(this.file.text, [$.tn(' '), el]);
      }
      if (el.children.length === 1) {
        return $.one(el.lastElementChild, 'mouseover focus', Metadata.load);
      }
    },
    load: function() {
      $.rmClass(this.parentNode, 'error');
      $.addClass(this.parentNode, 'loading');
      return CrossOrigin.binary(Get.postFromNode(this).file.url, (function(_this) {
        return function(data) {
          var output, title;
          $.rmClass(_this.parentNode, 'loading');
          if (data != null) {
            title = Metadata.parse(data);
            output = $.el('span', {
              textContent: title || ''
            });
            if (title == null) {
              $.addClass(_this.parentNode, 'not-found');
            }
            $.before(_this, output);
            _this.parentNode.tabIndex = 0;
            if (d.activeElement === _this) {
              _this.parentNode.focus();
            }
            return _this.tabIndex = -1;
          } else {
            $.addClass(_this.parentNode, 'error');
            return $.one(_this, 'click', Metadata.load);
          }
        };
      })(this), {
        Range: 'bytes=0-9999'
      });
    },
    parse: function(data) {
      var element, i, readInt, size, title;
      readInt = function() {
        var len, n;
        n = data[i++];
        len = 0;
        while (n < (0x80 >> len)) {
          len++;
        }
        n ^= 0x80 >> len;
        while (len-- && i < data.length) {
          n = (n << 8) ^ data[i++];
        }
        return n;
      };
      i = 0;
      while (i < data.length) {
        element = readInt();
        size = readInt();
        if (element === 0x3BA9) {
          title = '';
          while (size-- && i < data.length) {
            title += String.fromCharCode(data[i++]);
          }
          return decodeURIComponent(escape(title));
        } else if (element !== 0x8538067 && element !== 0x549A966) {
          i += size;
        }
      }
      return null;
    }
  };

  return Metadata;

}).call(this);

RevealSpoilers = (function() {
  var RevealSpoilers;

  RevealSpoilers = {
    init: function() {
      var ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Reveal Spoiler Thumbnails'])) {
        return;
      }
      return Callbacks.Post.push({
        name: 'Reveal Spoiler Thumbnails',
        cb: this.node
      });
    },
    node: function() {
      var thumb;
      if (!(!this.isClone && this.file && this.file.thumb && this.file.isSpoiler)) {
        return;
      }
      thumb = this.file.thumb;
      thumb.removeAttribute('style');
      thumb.style.maxHeight = thumb.style.maxWidth = this.isReply ? '125px' : '250px';
      if (thumb.src) {
        return thumb.src = this.file.thumbURL;
      } else {
        return thumb.dataset.src = this.file.thumbURL;
      }
    }
  };

  return RevealSpoilers;

}).call(this);

Sauce = (function() {
  var Sauce,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Sauce = {
    init: function() {
      var err, j, len, link, links, ref, ref1;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Sauce'])) {
        return;
      }
      links = [];
      ref1 = Conf['sauces'].split('\n');
      for (j = 0, len = ref1.length; j < len; j++) {
        link = ref1[j];
        try {
          if (link[0] !== '#') {
            links.push(link.trim());
          }
        } catch (_error) {
          err = _error;
        }
      }
      if (!links.length) {
        return;
      }
      this.links = links;
      this.link = $.el('a', {
        target: '_blank',
        className: 'sauce'
      });
      return Callbacks.Post.push({
        name: 'Sauce',
        cb: this.node
      });
    },
    sandbox: function(url) {
      return E.url({
        innerHTML: "<html><head><title>[sb] " + E(url) + "</title><style>iframe {width: 100vw;height: 100vh;border: 0;}body {margin: 0;overflow: hidden;}</style></head><body><iframe sandbox=\"allow-forms\" src=\"" + E(url) + "\"></iframe></body></html>"
      });
    },
    rmOrigin: function(e) {
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      $.open(this.href);
      return e.preventDefault();
    },
    createSauceLink: function(link, post) {
      var a, ext, i, j, key, len, m, part, parts, ref, ref1, ref2, skip, url;
      if (!(link = link.trim())) {
        return null;
      }
      parts = {};
      ref = link.split(/;(?=(?:text|boards|types|sandbox):?)/);
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        part = ref[i];
        if (i === 0) {
          parts['url'] = part;
        } else {
          m = part.match(/^(\w*):?(.*)$/);
          parts[m[1]] = m[2];
        }
      }
      parts['text'] || (parts['text'] = ((ref1 = parts['url'].match(/(\w+)\.\w+\//)) != null ? ref1[1] : void 0) || '?');
      ext = post.file.url.match(/[^.]*$/)[0];
      skip = false;
      for (key in parts) {
        parts[key] = parts[key].replace(/%(T?URL|IMG|[sh]?MD5|board|name|%|semi)/g, function(_, parameter) {
          var type;
          type = Sauce.formatters[parameter](post, ext);
          if (type == null) {
            skip = true;
            return '';
          }
          if (key === 'url' && (parameter !== '%' && parameter !== 'semi')) {
            if (/^javascript:/i.test(parts['url'])) {
              type = JSON.stringify(type);
            }
            type = encodeURIComponent(type);
          }
          return type;
        });
      }
      if (skip) {
        return null;
      }
      if (!(!parts['boards'] || (ref2 = post.board.ID, indexOf.call(parts['boards'].split(','), ref2) >= 0))) {
        return null;
      }
      if (!(!parts['types'] || indexOf.call(parts['types'].split(','), ext) >= 0)) {
        return null;
      }
      url = parts['url'];
      if (parts['sandbox'] != null) {
        url = Sauce.sandbox(url);
      }
      a = Sauce.link.cloneNode(false);
      a.href = url;
      a.textContent = parts['text'];
      if (/^javascript:/i.test(parts['url'])) {
        a.removeAttribute('target');
      }
      if (parts['sandbox'] != null) {
        $.on(a, 'click', Sauce.rmOrigin);
      }
      return a;
    },
    node: function() {
      var j, len, link, node, nodes, observer, ref, skipped;
      if (this.isClone || !this.file) {
        return;
      }
      nodes = [];
      skipped = [];
      ref = Sauce.links;
      for (j = 0, len = ref.length; j < len; j++) {
        link = ref[j];
        if (!(node = Sauce.createSauceLink(link, this))) {
          node = Sauce.link.cloneNode(false);
          skipped.push([link, node]);
        }
        nodes.push($.tn(' '), node);
      }
      $.add(this.file.text, nodes);
      if (this.board.ID === 'f') {
        observer = new MutationObserver((function(_this) {
          return function() {
            var k, len1, node2, ref1;
            if (_this.file.text.dataset.md5) {
              for (k = 0, len1 = skipped.length; k < len1; k++) {
                ref1 = skipped[k], link = ref1[0], node = ref1[1];
                if ((node2 = Sauce.createSauceLink(link, _this))) {
                  $.replace(node, node2);
                }
              }
              return observer.disconnect();
            }
          };
        })(this));
        return observer.observe(this.file.text, {
          attributes: true
        });
      }
    },
    formatters: {
      TURL: function(post) {
        return post.file.thumbURL;
      },
      URL: function(post) {
        return post.file.url;
      },
      IMG: function(post, ext) {
        if (ext === 'gif' || ext === 'jpg' || ext === 'png') {
          return post.file.url;
        } else {
          return post.file.thumbURL;
        }
      },
      MD5: function(post) {
        return post.file.MD5;
      },
      sMD5: function(post) {
        var ref;
        return (ref = post.file.MD5) != null ? ref.replace(/[+\/=]/g, function(c) {
          return {
            '+': '-',
            '/': '_',
            '=': ''
          }[c];
        }) : void 0;
      },
      hMD5: function(post) {
        var c;
        if (post.file.MD5) {
          return ((function() {
            var j, len, ref, results;
            ref = atob(post.file.MD5);
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              c = ref[j];
              results.push(("0" + (c.charCodeAt(0).toString(16))).slice(-2));
            }
            return results;
          })()).join('');
        }
      },
      board: function(post) {
        return post.board.ID;
      },
      name: function(post) {
        return post.file.name;
      },
      '%': function() {
        return '%';
      },
      semi: function() {
        return ';';
      }
    }
  };

  return Sauce;

}).call(this);

Volume = (function() {
  var Volume;

  Volume = {
    init: function() {
      var ref, ref1, unmuteEntry, volumeEntry;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && (Conf['Image Expansion'] || Conf['Image Hover'] || Conf['Image Hover in Catalog'] || Conf['Gallery']))) {
        return;
      }
      $.sync('Allow Sound', function(x) {
        var ref1;
        Conf['Allow Sound'] = x;
        return (ref1 = Volume.inputs) != null ? ref1.unmute.checked = x : void 0;
      });
      $.sync('Default Volume', function(x) {
        var ref1;
        Conf['Default Volume'] = x;
        return (ref1 = Volume.inputs) != null ? ref1.volume.value = x : void 0;
      });
      if (Conf['Mouse Wheel Volume']) {
        Callbacks.Post.push({
          name: 'Mouse Wheel Volume',
          cb: this.node
        });
      }
      if ((ref1 = g.BOARD.ID) !== 'gif' && ref1 !== 'wsg') {
        return;
      }
      if (Conf['Mouse Wheel Volume']) {
        Callbacks.CatalogThread.push({
          name: 'Mouse Wheel Volume',
          cb: this.catalogNode
        });
      }
      unmuteEntry = UI.checkbox('Allow Sound', 'Allow Sound');
      unmuteEntry.title = Config.main['Images and Videos']['Allow Sound'][1];
      volumeEntry = $.el('label', {
        title: 'Default volume for videos.'
      });
      $.extend(volumeEntry, {
        innerHTML: "<input name=\"Default Volume\" type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" value=\"" + E(Conf["Default Volume"]) + "\"> Volume"
      });
      this.inputs = {
        unmute: unmuteEntry.firstElementChild,
        volume: volumeEntry.firstElementChild
      };
      $.on(this.inputs.unmute, 'change', $.cb.checked);
      $.on(this.inputs.volume, 'change', $.cb.value);
      Header.menu.addEntry({
        el: unmuteEntry,
        order: 200
      });
      return Header.menu.addEntry({
        el: volumeEntry,
        order: 201
      });
    },
    setup: function(video) {
      video.muted = !Conf['Allow Sound'];
      video.volume = Conf['Default Volume'];
      return $.on(video, 'volumechange', Volume.change);
    },
    change: function() {
      var items, key, muted, val, volume;
      muted = this.muted, volume = this.volume;
      items = {
        'Allow Sound': !muted,
        'Default Volume': volume
      };
      for (key in items) {
        val = items[key];
        if (Conf[key] === val) {
          delete items[key];
        }
      }
      $.set(items);
      $.extend(Conf, items);
      if (Volume.inputs) {
        Volume.inputs.unmute.checked = !muted;
        return Volume.inputs.volume.value = volume;
      }
    },
    node: function() {
      var ref, ref1;
      if (!(((ref = this.board.ID) === 'gif' || ref === 'wsg') && ((ref1 = this.file) != null ? ref1.isVideo : void 0))) {
        return;
      }
      $.on(this.file.thumb, 'wheel', Volume.wheel.bind(Header.hover));
      return $.on($('a', this.file.text), 'wheel', Volume.wheel.bind(this.file.thumb.parentNode));
    },
    catalogNode: function() {
      var file;
      file = this.thread.OP.file;
      if (!(file != null ? file.isVideo : void 0)) {
        return;
      }
      return $.on(this.nodes.thumb, 'wheel', Volume.wheel.bind(Header.hover));
    },
    wheel: function(e) {
      var el, volume;
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }
      if (!(el = $('video:not([data-md5])', this))) {
        return;
      }
      if (el.muted || !$.hasAudio(el)) {
        return;
      }
      volume = el.volume + 0.1;
      if (e.deltaY < 0) {
        volume *= 1.1;
      }
      if (e.deltaY > 0) {
        volume /= 1.1;
      }
      el.volume = $.minmax(volume - 0.1, 0, 1);
      return e.preventDefault();
    }
  };

  return Volume;

}).call(this);

Embedding = (function() {
  var Embedding;

  Embedding = {
    init: function() {
      var j, len, ref, type;
      if (!(Conf['Embedding'] || Conf['Link Title'])) {
        return;
      }
      this.types = {};
      ref = this.ordered_types;
      for (j = 0, len = ref.length; j < len; j++) {
        type = ref[j];
        this.types[type.key] = type;
      }
      if (Conf['Floating Embeds']) {
        this.dialog = UI.dialog('embedding', 'top: 50px; right: 0px;', {
          innerHTML: "<div><div class=\"move\"></div><a href=\"javascript:;\" class=\"jump\" title=\"Jump to post\">→</a><a href=\"javascript:;\" class=\"close\" title=\"Close\">×</a></div><div id=\"media-embed\"><div></div></div>"
        });
        this.media = $('#media-embed', this.dialog);
        $.one(d, '4chanXInitFinished', this.ready);
      }
      if (Conf['Link Title']) {
        return $.on(d, '4chanXInitFinished PostsInserted', function() {
          var key, ref1, ref2, service;
          ref1 = Embedding.types;
          for (key in ref1) {
            service = ref1[key];
            if ((ref2 = service.title) != null ? ref2.batchSize : void 0) {
              Embedding.flushTitles(service.title);
            }
          }
        });
      }
    },
    events: function(post) {
      var el, i, items;
      if (!Conf['Embedding']) {
        return;
      }
      i = 0;
      items = $$('.embedder', post.nodes.comment);
      while (el = items[i++]) {
        $.on(el, 'click', Embedding.cb.toggle);
        if ($.hasClass(el, 'embedded')) {
          Embedding.cb.toggle.call(el);
        }
      }
    },
    process: function(link, post) {
      var data;
      if (!(Conf['Embedding'] || Conf['Link Title'])) {
        return;
      }
      if ($.x('ancestor::pre', link)) {
        return;
      }
      if (data = Embedding.services(link)) {
        data.post = post;
        if (Conf['Embedding']) {
          Embedding.embed(data);
        }
        if (Conf['Link Title']) {
          return Embedding.title(data);
        }
      }
    },
    services: function(link) {
      var href, j, len, match, ref, type;
      href = link.href;
      ref = Embedding.ordered_types;
      for (j = 0, len = ref.length; j < len; j++) {
        type = ref[j];
        if ((match = type.regExp.exec(href))) {
          return {
            key: type.key,
            uid: match[1],
            options: match[2],
            link: link
          };
        }
      }
    },
    embed: function(data) {
      var embed, href, key, link, name, options, post, ref, uid, value;
      key = data.key, uid = data.uid, options = data.options, link = data.link, post = data.post;
      href = link.href;
      if (Embedding.types[key].httpOnly && location.protocol !== 'http:') {
        return;
      }
      $.addClass(link, key.toLowerCase());
      embed = $.el('a', {
        className: 'embedder',
        href: 'javascript:;',
        textContent: '(embed)'
      });
      ref = {
        key: key,
        uid: uid,
        options: options,
        href: href
      };
      for (name in ref) {
        value = ref[name];
        embed.dataset[name] = value;
      }
      $.on(embed, 'click', Embedding.cb.toggle);
      $.after(link, [$.tn(' '), embed]);
      if (Conf['Auto-embed'] && !Conf['Floating Embeds'] && !post.isFetchedQuote) {
        return $.asap((function() {
          return doc.contains(embed);
        }), function() {
          return Embedding.cb.toggle.call(embed);
        });
      }
    },
    ready: function() {
      $.addClass(Embedding.dialog, 'empty');
      $.on($('.close', Embedding.dialog), 'click', Embedding.closeFloat);
      $.on($('.move', Embedding.dialog), 'mousedown', Embedding.dragEmbed);
      $.on($('.jump', Embedding.dialog), 'click', function() {
        if (doc.contains(Embedding.lastEmbed)) {
          return Header.scrollTo(Embedding.lastEmbed);
        }
      });
      return $.add(d.body, Embedding.dialog);
    },
    closeFloat: function() {
      delete Embedding.lastEmbed;
      $.addClass(Embedding.dialog, 'empty');
      return $.replace(Embedding.media.firstChild, $.el('div'));
    },
    dragEmbed: function() {
      var style;
      style = Embedding.media.style;
      if (Embedding.dragEmbed.mouseup) {
        $.off(d, 'mouseup', Embedding.dragEmbed);
        Embedding.dragEmbed.mouseup = false;
        style.visibility = '';
        return;
      }
      $.on(d, 'mouseup', Embedding.dragEmbed);
      Embedding.dragEmbed.mouseup = true;
      return style.visibility = 'hidden';
    },
    title: function(data) {
      var key, link, options, post, service, uid;
      key = data.key, uid = data.uid, options = data.options, link = data.link, post = data.post;
      if (!(service = Embedding.types[key].title)) {
        return;
      }
      $.addClass(link, key.toLowerCase());
      if (service.batchSize) {
        (service.queue || (service.queue = [])).push(data);
        if (service.queue.length >= service.batchSize) {
          return Embedding.flushTitles(service);
        }
      } else {
        if (!$.cache(service.api(uid), (function() {
          return Embedding.cb.title(this, data);
        }), {
          responseType: 'json'
        })) {
          return $.extend(link, {
            innerHTML: "[" + E(key) + "] <span class=\"warning\">Title Link Blocked</span> (are you using NoScript?)</a>"
          });
        }
      }
    },
    flushTitles: function(service) {
      var cb, data, j, len, queue;
      queue = service.queue;
      if (!(queue != null ? queue.length : void 0)) {
        return;
      }
      service.queue = [];
      cb = function() {
        var data, j, len;
        for (j = 0, len = queue.length; j < len; j++) {
          data = queue[j];
          Embedding.cb.title(this, data);
        }
      };
      if (!$.cache(service.api((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = queue.length; j < len; j++) {
          data = queue[j];
          results.push(data.uid);
        }
        return results;
      })()), cb, {
        responseType: 'json'
      })) {
        for (j = 0, len = queue.length; j < len; j++) {
          data = queue[j];
          $.extend(data.link, {
            innerHTML: "[" + E(data.key) + "] <span class=\"warning\">Title Link Blocked</span> (are you using NoScript?)</a>"
          });
        }
      }
    },
    cb: {
      toggle: function(e) {
        var div;
        if (e != null) {
          e.preventDefault();
        }
        if (Conf['Floating Embeds']) {
          if (!(div = Embedding.media.firstChild)) {
            return;
          }
          $.replace(div, Embedding.cb.embed(this));
          Embedding.lastEmbed = Get.postFromNode(this).nodes.root;
          $.rmClass(Embedding.dialog, 'empty');
          return;
        }
        if ($.hasClass(this, "embedded")) {
          $.rm(this.nextElementSibling);
          this.textContent = '(embed)';
        } else {
          $.after(this, Embedding.cb.embed(this));
          this.textContent = '(unembed)';
        }
        return $.toggleClass(this, 'embedded');
      },
      embed: function(a) {
        var container, el, type;
        container = $.el('div');
        $.add(container, el = (type = Embedding.types[a.dataset.key]).el(a));
        el.style.cssText = type.style != null ? type.style : 'border: none; width: 640px; height: 360px;';
        return container;
      },
      title: function(req, data) {
        var base1, j, k, key, len, len1, link, link2, options, post, post2, ref, ref1, service, status, text, uid;
        key = data.key, uid = data.uid, options = data.options, link = data.link, post = data.post;
        status = req.status;
        service = Embedding.types[key].title;
        text = "[" + key + "] " + ((function() {
          switch (status) {
            case 200:
            case 304:
              return service.text(req.response, uid);
            case 404:
              return "Not Found";
            case 403:
              return "Forbidden or Private";
            default:
              return status + "'d";
          }
        })());
        link.dataset.original = link.textContent;
        link.textContent = text;
        ref = post.clones;
        for (j = 0, len = ref.length; j < len; j++) {
          post2 = ref[j];
          ref1 = $$('a.linkify', post2.nodes.comment);
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            link2 = ref1[k];
            if (!(link2.href === link.href)) {
              continue;
            }
            if ((base1 = link2.dataset).original == null) {
              base1.original = link2.textContent;
            }
            link2.textContent = text;
          }
        }
      }
    },
    ordered_types: [
      {
        key: 'audio',
        regExp: /^[^?#]+\.(?:mp3|oga|wav)(?:[?#]|$)/i,
        style: '',
        el: function(a) {
          return $.el('audio', {
            controls: true,
            preload: 'auto',
            src: a.dataset.href
          });
        }
      }, {
        key: 'image',
        regExp: /^[^?#]+\.(?:gif|png|jpg|jpeg|bmp)(?:[?#]|$)/i,
        style: '',
        el: function(a) {
          return $.el('div', {
            innerHTML: "<a target=\"_blank\" href=\"" + E(a.dataset.href) + "\"><img src=\"" + E(a.dataset.href) + "\" style=\"max-width: 80vw; max-height: 80vh;\"></a>"
          });
        }
      }, {
        key: 'video',
        regExp: /^[^?#]+\.(?:og[gv]|webm|mp4)(?:[?#]|$)/i,
        style: 'max-width: 80vw; max-height: 80vh;',
        el: function(a) {
          var el;
          el = $.el('video', {
            hidden: true,
            controls: true,
            preload: 'auto',
            src: a.dataset.href,
            loop: /^https?:\/\/i\.4cdn\.org\//.test(a.dataset.href)
          });
          $.on(el, 'loadedmetadata', function() {
            if (el.videoHeight === 0 && el.parentNode) {
              return $.replace(el, Embedding.types.audio.el(a));
            } else {
              return el.hidden = false;
            }
          });
          return el;
        }
      }, {
        key: 'Clyp',
        regExp: /^\w+:\/\/(?:www\.)?clyp\.it\/(\w+)/,
        style: '',
        el: function(a) {
          var el, type;
          el = $.el('audio', {
            controls: true,
            preload: 'auto'
          });
          type = el.canPlayType('audio/ogg') ? 'ogg' : 'mp3';
          el.src = "https://clyp.it/" + a.dataset.uid + "." + type;
          return el;
        }
      }, {
        key: 'Dailymotion',
        regExp: /^\w+:\/\/(?:(?:www\.)?dailymotion\.com\/(?:embed\/)?video|dai\.ly)\/([A-Za-z0-9]+)[^?]*(.*)/,
        el: function(a) {
          var el, options, start;
          options = (start = a.dataset.options.match(/[?&](start=\d+)/)) ? "?" + start[1] : '';
          el = $.el('iframe', {
            src: "//www.dailymotion.com/embed/video/" + a.dataset.uid + options
          });
          el.setAttribute("allowfullscreen", "true");
          return el;
        },
        title: {
          api: function(uid) {
            return "https://api.dailymotion.com/video/" + uid;
          },
          text: function(_) {
            return _.title;
          }
        }
      }, {
        key: 'Gfycat',
        regExp: /^\w+:\/\/(?:www\.)?gfycat\.com\/(?:iframe\/)?(\w+)/,
        el: function(a) {
          var div;
          return div = $.el('iframe', {
            src: "//gfycat.com/iframe/" + a.dataset.uid
          });
        }
      }, {
        key: 'Gist',
        regExp: /^\w+:\/\/gist\.github\.com\/[\w\-]+\/(\w+)/,
        el: function(a) {
          var content, el;
          el = $.el('iframe');
          el.setAttribute('sandbox', 'allow-scripts');
          content = {
            innerHTML: "<html><head><title>" + E(a.dataset.uid) + "</title></head><body><script src=\"https://gist.github.com/" + E(a.dataset.uid) + ".js\"></script></body></html>"
          };
          el.src = E.url(content);
          return el;
        },
        title: {
          api: function(uid) {
            return "https://api.github.com/gists/" + uid;
          },
          text: function(arg) {
            var file, files;
            files = arg.files;
            for (file in files) {
              if (files.hasOwnProperty(file)) {
                return file;
              }
            }
          }
        }
      }, {
        key: 'InstallGentoo',
        regExp: /^\w+:\/\/paste\.installgentoo\.com\/view\/(?:raw\/|download\/|embed\/)?(\w+)/,
        el: function(a) {
          return $.el('iframe', {
            src: "https://paste.installgentoo.com/view/embed/" + a.dataset.uid
          });
        }
      }, {
        key: 'LiveLeak',
        regExp: /^\w+:\/\/(?:\w+\.)?liveleak\.com\/.*\?.*i=(\w+)/,
        httpOnly: true,
        el: function(a) {
          var el;
          el = $.el('iframe', {
            src: "http://www.liveleak.com/ll_embed?i=" + a.dataset.uid
          });
          el.setAttribute("allowfullscreen", "true");
          return el;
        }
      }, {
        key: 'Loopvid',
        regExp: /^\w+:\/\/(?:www\.)?loopvid.appspot.com\/#?((?:pf|kd|lv|gd|gh|db|dx|nn|cp|wu|ig|ky|mf|m2|pc|1c|pi|wl|ko|gc)\/[\w\-\/]+(?:,[\w\-\/]+)*|fc\/\w+\/\d+|https?:\/\/.+)/,
        style: 'max-width: 80vw; max-height: 80vh;',
        el: function(a) {
          var _, base, el, host, j, k, l, len, len1, len2, name, names, ref, ref1, type, types, url, urls;
          el = $.el('video', {
            controls: true,
            preload: 'auto',
            loop: true
          });
          if (/^http/.test(a.dataset.uid)) {
            $.add(el, $.el('source', {
              src: a.dataset.uid
            }));
            return el;
          }
          ref = a.dataset.uid.match(/(\w+)\/(.*)/), _ = ref[0], host = ref[1], names = ref[2];
          types = (function() {
            switch (host) {
              case 'gd':
              case 'wu':
              case 'fc':
                return [''];
              case 'gc':
                return ['giant', 'fat', 'zippy'];
              default:
                return ['.webm', '.mp4'];
            }
          })();
          ref1 = names.split(',');
          for (j = 0, len = ref1.length; j < len; j++) {
            name = ref1[j];
            for (k = 0, len1 = types.length; k < len1; k++) {
              type = types[k];
              base = "" + name + type;
              urls = (function() {
                switch (host) {
                  case 'pf':
                    return ["https://kastden.org/_loopvid_media/pf/" + base, "https://web.archive.org/web/2/http://a.pomf.se/" + base];
                  case 'kd':
                    return ["http://kastden.org/loopvid/" + base];
                  case 'lv':
                    return ["http://lv.kastden.org/" + base];
                  case 'gd':
                    return ["https://docs.google.com/uc?export=download&id=" + base];
                  case 'gh':
                    return ["https://googledrive.com/host/" + base];
                  case 'db':
                    return ["https://dl.dropboxusercontent.com/u/" + base];
                  case 'dx':
                    return ["https://dl.dropboxusercontent.com/" + base];
                  case 'nn':
                    return ["http://naenara.eu/loopvids/" + base];
                  case 'cp':
                    return ["https://copy.com/" + base];
                  case 'wu':
                    return ["http://webmup.com/" + base + "/vid.webm"];
                  case 'ig':
                    return ["https://i.imgur.com/" + base];
                  case 'ky':
                    return ["https://kiyo.me/" + base];
                  case 'mf':
                    return ["https://kastden.org/_loopvid_media/mf/" + base, "https://web.archive.org/web/2/https://d.maxfile.ro/" + base];
                  case 'm2':
                    return ["https://kastden.org/_loopvid_media/m2/" + base];
                  case 'pc':
                    return ["http://a.pomf.cat/" + base];
                  case '1c':
                    return ["http://b.1339.cf/" + base];
                  case 'pi':
                    return ["https://u.pomf.is/" + base];
                  case 'wl':
                    return ["http://webm.land/media/" + base];
                  case 'ko':
                    return ["https://kordy.kastden.org/loopvid/" + base];
                  case 'fc':
                    return ["//i.4cdn.org/" + base + ".webm"];
                  case 'gc':
                    return ["https://" + type + ".gfycat.com/" + name + ".webm"];
                }
              })();
              for (l = 0, len2 = urls.length; l < len2; l++) {
                url = urls[l];
                $.add(el, $.el('source', {
                  src: url
                }));
              }
            }
          }
          return el;
        }
      }, {
        key: 'Openings.moe',
        regExp: /^\w+:\/\/openings.moe\/\?video=([^&=]+\.webm)/,
        style: 'max-width: 80vw; max-height: 80vh;',
        el: function(a) {
          return $.el('video', {
            controls: true,
            preload: 'auto',
            src: "//openings.moe/video/" + a.dataset.uid,
            loop: true
          });
        }
      }, {
        key: 'Pastebin',
        regExp: /^\w+:\/\/(?:\w+\.)?pastebin\.com\/(?!u\/)(?:[\w\.]+\?i\=)?(\w+)/,
        el: function(a) {
          var div;
          return div = $.el('iframe', {
            src: "//pastebin.com/embed_iframe.php?i=" + a.dataset.uid
          });
        }
      }, {
        key: 'SoundCloud',
        regExp: /^\w+:\/\/(?:www\.)?(?:soundcloud\.com\/|snd\.sc\/)([\w\-\/]+)/,
        style: 'border: 0; width: 500px; height: 400px;',
        el: function(a) {
          return $.el('iframe', {
            src: "https://w.soundcloud.com/player/?visual=true&show_comments=false&url=https%3A%2F%2Fsoundcloud.com%2F" + (encodeURIComponent(a.dataset.uid))
          });
        },
        title: {
          api: function(uid) {
            return "//soundcloud.com/oembed?format=json&url=https%3A%2F%2Fsoundcloud.com%2F" + (encodeURIComponent(uid));
          },
          text: function(_) {
            return _.title;
          }
        }
      }, {
        key: 'StrawPoll',
        regExp: /^\w+:\/\/(?:www\.)?strawpoll\.me\/(?:embed_\d+\/)?(\d+(?:\/r)?)/,
        style: 'border: 0; width: 600px; height: 406px;',
        el: function(a) {
          return $.el('iframe', {
            src: "//www.strawpoll.me/embed_1/" + a.dataset.uid
          });
        }
      }, {
        key: 'TwitchTV',
        regExp: /^\w+:\/\/(?:www\.|secure\.)?twitch\.tv\/(\w[^#\&\?]*)/,
        el: function(a) {
          var el, m, time, url;
          m = a.dataset.uid.match(/(\w+)(?:\/v\/(\d+))?/);
          url = "//player.twitch.tv/?" + (m[2] ? "video=v" + m[2] : "channel=" + m[1]) + "&autoplay=false";
          if ((time = a.dataset.href.match(/\bt=(\w+)/))) {
            url += "&time=" + time[1];
          }
          el = $.el('iframe', {
            src: url
          });
          el.setAttribute("allowfullscreen", "true");
          return el;
        }
      }, {
        key: 'Twitter',
        regExp: /^\w+:\/\/(?:www\.)?twitter\.com\/(\w+\/status\/\d+)/,
        el: function(a) {
          return $.el('iframe', {
            src: "https://twitframe.com/show?url=https://twitter.com/" + a.dataset.uid
          });
        }
      }, {
        key: 'Vimeo',
        regExp: /^\w+:\/\/(?:www\.)?vimeo\.com\/(\d+)/,
        el: function(a) {
          var el;
          el = $.el('iframe', {
            src: "//player.vimeo.com/video/" + a.dataset.uid + "?wmode=opaque"
          });
          el.setAttribute("allowfullscreen", "true");
          return el;
        },
        title: {
          api: function(uid) {
            return "https://vimeo.com/api/oembed.json?url=https://vimeo.com/" + uid;
          },
          text: function(_) {
            return _.title;
          }
        }
      }, {
        key: 'Vine',
        regExp: /^\w+:\/\/(?:www\.)?vine\.co\/v\/(\w+)/,
        style: 'border: none; width: 500px; height: 500px;',
        el: function(a) {
          return $.el('iframe', {
            src: "https://vine.co/v/" + a.dataset.uid + "/card"
          });
        }
      }, {
        key: 'Vocaroo',
        regExp: /^\w+:\/\/(?:www\.)?vocaroo\.com\/i\/(\w+)/,
        style: '',
        el: function(a) {
          var el, type;
          el = $.el('audio', {
            controls: true,
            preload: 'auto'
          });
          type = el.canPlayType('audio/webm') ? 'webm' : 'mp3';
          el.src = "http://vocaroo.com/media_command.php?media=" + a.dataset.uid + "&command=download_" + type;
          return el;
        }
      }, {
        key: 'YouTube',
        regExp: /^\w+:\/\/(?:youtu.be\/|[\w.]*youtube[\w.]*\/.*(?:v=|\bembed\/|\bv\/))([\w\-]{11})(.*)/,
        el: function(a) {
          var el, start;
          start = a.dataset.options.match(/\b(?:star)?t\=(\w+)/);
          if (start) {
            start = start[1];
          }
          if (start && !/^\d+$/.test(start)) {
            start += ' 0h0m0s';
            start = 3600 * start.match(/(\d+)h/)[1] + 60 * start.match(/(\d+)m/)[1] + 1 * start.match(/(\d+)s/)[1];
          }
          el = $.el('iframe', {
            src: "//www.youtube.com/embed/" + a.dataset.uid + "?wmode=opaque" + (start ? '&start=' + start : '')
          });
          el.setAttribute("allowfullscreen", "true");
          return el;
        },
        title: {
          batchSize: 50,
          api: function(uids) {
            var ids, key;
            ids = encodeURIComponent(uids.join(','));
            key = 'AIzaSyB5_zaen_-46Uhz1xGR-lz1YoUMHqCD6CE';
            return "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + ids + "&fields=items%28id%2Csnippet%28title%29%29&key=" + key;
          },
          text: function(data, uid) {
            var item, j, len, ref;
            ref = data.items;
            for (j = 0, len = ref.length; j < len; j++) {
              item = ref[j];
              if (item.id === uid) {
                return item.snippet.title;
              }
            }
            return 'Not Found';
          }
        }
      }
    ]
  };

  return Embedding;

}).call(this);

Linkify = (function() {
  var Linkify;

  Linkify = {
    init: function() {
      var ref;
      if (((ref = g.VIEW) !== 'index' && ref !== 'thread') || !Conf['Linkify']) {
        return;
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      Callbacks.Post.push({
        name: 'Linkify',
        cb: this.node
      });
      Callbacks.CatalogThread.push({
        name: 'Linkify',
        cb: this.catalogNode
      });
      return Embedding.init();
    },
    node: function() {
      var j, k, len, len1, link, links, ref;
      if (this.isClone) {
        return Embedding.events(this);
      }
      if (!Linkify.regString.test(this.info.comment)) {
        return;
      }
      ref = $$('a[href^="http://i.4cdn.org/"], a[href^="https://i.4cdn.org/"]', this.nodes.comment);
      for (j = 0, len = ref.length; j < len; j++) {
        link = ref[j];
        $.addClass(link, 'linkify');
        Embedding.process(link, this);
      }
      links = Linkify.process(this.nodes.comment);
      for (k = 0, len1 = links.length; k < len1; k++) {
        link = links[k];
        Embedding.process(link, this);
      }
    },
    catalogNode: function() {
      if (!Linkify.regString.test(this.thread.OP.info.comment)) {
        return;
      }
      return Linkify.process(this.nodes.comment);
    },
    process: function(node) {
      var data, end, endNode, i, index, length, links, part1, part2, ref, ref1, result, saved, snapshot, space, test, word;
      test = /[^\s"]+/g;
      space = /[\s"]/;
      snapshot = $.X('.//br|.//text()', node);
      i = 0;
      links = [];
      while (node = snapshot.snapshotItem(i++)) {
        data = node.data;
        if (!data || node.parentElement.nodeName === "A") {
          continue;
        }
        while (result = test.exec(data)) {
          index = result.index;
          endNode = node;
          word = result[0];
          if ((length = index + word.length) === data.length) {
            test.lastIndex = 0;
            while ((saved = snapshot.snapshotItem(i++))) {
              if (saved.nodeName === 'BR') {
                if ((part1 = word.match(/(https?:\/\/)?([a-z\d-]+\.)*[a-z\d-]+$/i)) && (part2 = (ref = snapshot.snapshotItem(i)) != null ? (ref1 = ref.data) != null ? ref1.match(/^(\.[a-z\d-]+)*\//i) : void 0 : void 0) && (part1[0] + part2[0]).search(Linkify.regString) === 0) {
                  continue;
                } else {
                  break;
                }
              }
              endNode = saved;
              data = saved.data;
              if (end = space.exec(data)) {
                word += data.slice(0, end.index);
                test.lastIndex = length = end.index;
                i--;
                break;
              } else {
                length = data.length;
                word += data;
              }
            }
          }
          if (Linkify.regString.test(word)) {
            links.push(Linkify.makeRange(node, endNode, index, length));
          }
          if (!(test.lastIndex && node === endNode)) {
            break;
          }
        }
      }
      i = links.length;
      while (i--) {
        links[i] = Linkify.makeLink(links[i]);
      }
      return links;
    },
    regString: /((https?|mailto|git|magnet|ftp|irc):([a-z\d%\/?])|([-a-z\d]+[.])+(aero|asia|biz|cat|com|coop|dance|info|int|jobs|mobi|moe|museum|name|net|org|post|pro|tel|travel|xxx|xyz|edu|gov|mil|[a-z]{2})([:\/]|(?![^\s"]))|[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}|[-\w\d.@]+@[a-z\d.-]+\.[a-z\d])/i,
    makeRange: function(startNode, endNode, startOffset, endOffset) {
      var range;
      range = document.createRange();
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      return range;
    },
    makeLink: function(range) {
      var a, encodedDomain, i, t, text;
      text = range.toString();
      i = text.search(Linkify.regString);
      if (i > 0) {
        text = text.slice(i);
        while (range.startOffset + i >= range.startContainer.data.length) {
          i--;
        }
        if (i) {
          range.setStart(range.startContainer, range.startOffset + i);
        }
      }
      i = 0;
      while (/[)\]}>.,]/.test(t = text.charAt(text.length - (1 + i)))) {
        if (!(/[.,]/.test(t) || (text.match(/[()\[\]{}<>]/g)).length % 2)) {
          break;
        }
        i++;
      }
      if (i) {
        text = text.slice(0, -i);
        while (range.endOffset - i < 0) {
          i--;
        }
        if (i) {
          range.setEnd(range.endContainer, range.endOffset - i);
        }
      }
      if (!/((mailto|magnet):|.+:\/\/)/.test(text)) {
        text = (/@/.test(text) ? 'mailto:' : 'http://') + text;
      }
      if (encodedDomain = text.match(/^(https?:\/\/[^\/]*%[0-9a-f]{2})(.*)$/i)) {
        text = encodedDomain[1].replace(/%([0-9a-f]{2})/ig, function(x, y) {
          if (y === '25') {
            return x;
          } else {
            return String.fromCharCode(parseInt(y, 16));
          }
        }) + encodedDomain[2];
      }
      a = $.el('a', {
        className: 'linkify',
        rel: 'noreferrer noopener',
        target: '_blank',
        href: text
      });
      $.add(a, range.extractContents());
      range.insertNode(a);
      return a;
    }
  };

  return Linkify;

}).call(this);

ArchiveLink = (function() {
  var ArchiveLink;

  ArchiveLink = {
    init: function() {
      var div, entry, i, len, ref, ref1, type;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Menu'] && Conf['Archive Link'])) {
        return;
      }
      div = $.el('div', {
        textContent: 'Archive'
      });
      entry = {
        el: div,
        order: 90,
        open: function(arg) {
          var ID, board, thread;
          ID = arg.ID, thread = arg.thread, board = arg.board;
          return !!Redirect.to('thread', {
            postID: ID,
            threadID: thread.ID,
            boardID: board.ID
          });
        },
        subEntries: []
      };
      ref1 = [['Post', 'post'], ['Name', 'name'], ['Tripcode', 'tripcode'], ['Capcode', 'capcode'], ['Subject', 'subject'], ['Flag', 'country'], ['Filename', 'filename'], ['Image MD5', 'MD5']];
      for (i = 0, len = ref1.length; i < len; i++) {
        type = ref1[i];
        entry.subEntries.push(this.createSubEntry(type[0], type[1]));
      }
      return Menu.menu.addEntry(entry);
    },
    createSubEntry: function(text, type) {
      var el, open;
      el = $.el('a', {
        textContent: text,
        target: '_blank'
      });
      open = type === 'post' ? function(arg) {
        var ID, board, thread;
        ID = arg.ID, thread = arg.thread, board = arg.board;
        el.href = Redirect.to('thread', {
          postID: ID,
          threadID: thread.ID,
          boardID: board.ID
        });
        return true;
      } : function(post) {
        var value;
        value = type === 'country' ? post.info.flagCode : Filter[type](post);
        if (!value) {
          return false;
        }
        el.href = Redirect.to('search', {
          boardID: post.board.ID,
          type: type,
          value: value,
          isSearch: true
        });
        return true;
      };
      return {
        el: el,
        open: open
      };
    }
  };

  return ArchiveLink;

}).call(this);

DeleteLink = (function() {
  var DeleteLink;

  DeleteLink = {
    auto: [{}, {}],
    init: function() {
      var div, fileEl, fileEntry, postEl, postEntry, ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Menu'] && Conf['Delete Link'])) {
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
      this.nodes = {
        menu: div.firstChild,
        links: [postEl, fileEl]
      };
      postEntry = {
        el: postEl,
        open: function() {
          postEl.textContent = DeleteLink.linkText(false);
          $.on(postEl, 'click', DeleteLink.toggle);
          return true;
        }
      };
      fileEntry = {
        el: fileEl,
        open: function(arg) {
          var file;
          file = arg.file;
          if (!file || file.isDead) {
            return false;
          }
          fileEl.textContent = DeleteLink.linkText(true);
          $.on(fileEl, 'click', DeleteLink.toggle);
          return true;
        }
      };
      return Menu.menu.addEntry({
        el: div,
        order: 40,
        open: function(post) {
          if (post.isDead) {
            return false;
          }
          DeleteLink.post = post;
          DeleteLink.nodes.menu.textContent = DeleteLink.menuText();
          DeleteLink.cooldown.start(post);
          return true;
        },
        subEntries: [postEntry, fileEntry]
      });
    },
    menuText: function() {
      var seconds;
      if (seconds = DeleteLink.cooldown.seconds[DeleteLink.post.fullID]) {
        return "Delete (" + seconds + ")";
      } else {
        return 'Delete';
      }
    },
    linkText: function(fileOnly) {
      var text;
      text = fileOnly ? 'File' : 'Post';
      if (DeleteLink.auto[+fileOnly][DeleteLink.post.fullID]) {
        text = "Deleting " + (text.toLowerCase()) + "...";
      }
      return text;
    },
    toggle: function() {
      var auto, fileOnly, post;
      post = DeleteLink.post;
      fileOnly = $.hasClass(this, 'delete-file');
      auto = DeleteLink.auto[+fileOnly];
      if (auto[post.fullID]) {
        delete auto[post.fullID];
      } else {
        auto[post.fullID] = true;
      }
      this.textContent = DeleteLink.linkText(fileOnly);
      if (!DeleteLink.cooldown.seconds[post.fullID]) {
        return DeleteLink["delete"](post, fileOnly);
      }
    },
    "delete": function(post, fileOnly) {
      var form, link;
      link = DeleteLink.nodes.links[+fileOnly];
      delete DeleteLink.auto[+fileOnly][post.fullID];
      if (post.fullID === DeleteLink.post.fullID) {
        $.off(link, 'click', DeleteLink.toggle);
      }
      form = {
        mode: 'usrdel',
        onlyimgdel: fileOnly,
        pwd: QR.persona.getPassword()
      };
      form[post.ID] = 'delete';
      return $.ajax($.id('delform').action.replace("/" + g.BOARD + "/", "/" + post.board + "/"), {
        responseType: 'document',
        withCredentials: true,
        onload: function() {
          return DeleteLink.load(link, post, fileOnly, this.response);
        },
        onerror: function() {
          return DeleteLink.error(link, post);
        }
      }, {
        form: $.formData(form)
      });
    },
    load: function(link, post, fileOnly, resDoc) {
      var el, msg;
      link.textContent = DeleteLink.linkText(fileOnly);
      if (resDoc.title === '4chan - Banned') {
        el = $.el('span', {
          innerHTML: "You can&#039;t delete posts because you are <a href=\"//www.4chan.org/banned\" target=\"_blank\">banned</a>."
        });
        return new Notice('warning', el, 20);
      } else if (msg = resDoc.getElementById('errmsg')) {
        new Notice('warning', msg.textContent, 20);
        if (post.fullID === DeleteLink.post.fullID) {
          $.on(link, 'click', DeleteLink.toggle);
        }
        if (QR.cooldown.data && Conf['Cooldown'] && /\bwait\b/i.test(msg.textContent)) {
          DeleteLink.cooldown.start(post, 5);
          DeleteLink.auto[+fileOnly][post.fullID] = true;
          return DeleteLink.nodes.links[+fileOnly].textContent = DeleteLink.linkText(fileOnly);
        }
      } else {
        if (!fileOnly) {
          QR.cooldown["delete"](post);
        }
        if (resDoc.title === 'Updating index...') {
          (post.origin || post).kill(fileOnly);
        }
        if (post.fullID === DeleteLink.post.fullID) {
          return link.textContent = 'Deleted';
        }
      }
    },
    error: function(link, post) {
      new Notice('warning', 'Connection error, please retry.', 20);
      if (post.fullID === DeleteLink.post.fullID) {
        return $.on(link, 'click', DeleteLink.toggle);
      }
    },
    cooldown: {
      seconds: {},
      start: function(post, seconds) {
        if (DeleteLink.cooldown.seconds[post.fullID] != null) {
          return;
        }
        if (seconds == null) {
          seconds = QR.cooldown.secondsDeletion(post);
        }
        if (seconds > 0) {
          DeleteLink.cooldown.seconds[post.fullID] = seconds;
          return DeleteLink.cooldown.count(post);
        }
      },
      count: function(post) {
        var fileOnly, i, len, ref;
        if (post.fullID === DeleteLink.post.fullID) {
          DeleteLink.nodes.menu.textContent = DeleteLink.menuText();
        }
        if (DeleteLink.cooldown.seconds[post.fullID] > 0 && Conf['Cooldown']) {
          DeleteLink.cooldown.seconds[post.fullID]--;
          setTimeout(DeleteLink.cooldown.count, 1000, post);
        } else {
          delete DeleteLink.cooldown.seconds[post.fullID];
          ref = [false, true];
          for (i = 0, len = ref.length; i < len; i++) {
            fileOnly = ref[i];
            if (DeleteLink.auto[+fileOnly][post.fullID]) {
              DeleteLink["delete"](post, fileOnly);
            }
          }
        }
      }
    }
  };

  return DeleteLink;

}).call(this);

DownloadLink = (function() {
  var DownloadLink;

  DownloadLink = {
    init: function() {
      var a, ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Menu'] && Conf['Download Link'])) {
        return;
      }
      a = $.el('a', {
        className: 'download-link',
        textContent: 'Download file'
      });
      $.on(a, 'click', ImageCommon.download);
      return Menu.menu.addEntry({
        el: a,
        order: 100,
        open: function(arg) {
          var file;
          file = arg.file;
          if (!file) {
            return false;
          }
          a.href = file.url;
          a.download = file.name;
          return true;
        }
      });
    }
  };

  return DownloadLink;

}).call(this);

Menu = (function() {
  var Menu;

  Menu = {
    init: function() {
      var ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Menu'])) {
        return;
      }
      this.button = $.el('a', {
        className: 'menu-button',
        href: 'javascript:;'
      });
      $.extend(this.button, {
        innerHTML: "<i class=\"fa fa-angle-down\"></i>"
      });
      this.menu = new UI.Menu('post');
      Callbacks.Post.push({
        name: 'Menu',
        cb: this.node
      });
      return Callbacks.CatalogThread.push({
        name: 'Menu',
        cb: this.catalogNode
      });
    },
    node: function() {
      var button;
      if (this.isClone) {
        button = $('.menu-button', this.nodes.info);
        $.rmClass(button, 'active');
        $.rm($('.dialog', button));
        Menu.makeButton(this, button);
        return;
      }
      return $.add(this.nodes.info, Menu.makeButton(this));
    },
    catalogNode: function() {
      return $.after(this.nodes.icons, Menu.makeButton(this.thread.OP));
    },
    makeButton: function(post, button) {
      button || (button = Menu.button.cloneNode(true));
      $.on(button, 'click', function(e) {
        return Menu.menu.toggle(e, this, post);
      });
      return button;
    }
  };

  return Menu;

}).call(this);

ReportLink = (function() {
  var ReportLink;

  ReportLink = {
    init: function() {
      var a, ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Menu'] && Conf['Report Link'])) {
        return;
      }
      a = $.el('a', {
        className: 'report-link',
        href: 'javascript:;'
      });
      $.on(a, 'click', ReportLink.report);
      return Menu.menu.addEntry({
        el: a,
        order: 10,
        open: function(post) {
          if (!(post.isDead || (post.thread.isDead && !post.thread.isArchived))) {
            a.textContent = 'Report';
            ReportLink.url = "//sys.4chan.org/" + post.board + "/imgboard.php?mode=report&no=" + post;
            if ((Conf['Use Recaptcha v1 in Reports'] && Main.jsEnabled) || d.cookie.indexOf('pass_enabled=1') >= 0) {
              ReportLink.url += '&altc=1';
              ReportLink.dims = 'width=350,height=275';
            } else {
              ReportLink.dims = 'width=400,height=550';
            }
          } else if (Conf['Archive Report']) {
            a.textContent = 'Report to archive';
            ReportLink.url = Redirect.to('report', {
              boardID: post.board.ID,
              postID: post.ID
            });
            ReportLink.dims = 'width=700,height=475';
          } else {
            ReportLink.url = '';
          }
          return !!ReportLink.url;
        }
      });
    },
    report: function() {
      var dims, id, set, url;
      url = ReportLink.url, dims = ReportLink.dims;
      id = Date.now();
      set = "toolbar=0,scrollbars=1,location=0,status=1,menubar=0,resizable=1," + dims;
      return window.open(url, id, set);
    }
  };

  return ReportLink;

}).call(this);

AntiAutoplay = (function() {
  var AntiAutoplay;

  AntiAutoplay = {
    init: function() {
      var audio, i, len, ref;
      if (!Conf['Disable Autoplaying Sounds']) {
        return;
      }
      $.addClass(doc, 'anti-autoplay');
      ref = $$('audio[autoplay]', doc);
      for (i = 0, len = ref.length; i < len; i++) {
        audio = ref[i];
        this.stop(audio);
      }
      window.addEventListener('loadstart', ((function(_this) {
        return function(e) {
          return _this.stop(e.target);
        };
      })(this)), true);
      Callbacks.Post.push({
        name: 'Disable Autoplaying Sounds',
        cb: this.node
      });
      Callbacks.CatalogThread.push({
        name: 'Disable Autoplaying Sounds',
        cb: this.node
      });
      return $.ready((function(_this) {
        return function() {
          return _this.process(d.body);
        };
      })(this));
    },
    stop: function(audio) {
      if (!audio.autoplay) {
        return;
      }
      audio.pause();
      audio.autoplay = false;
      if (audio.controls) {
        return;
      }
      audio.controls = true;
      return $.addClass(audio, 'controls-added');
    },
    node: function() {
      return AntiAutoplay.process(this.nodes.root);
    },
    process: function(root) {
      var i, iframe, j, len, len1, object, ref, ref1;
      ref = $$('iframe[src*="youtube"][src*="autoplay=1"]', root);
      for (i = 0, len = ref.length; i < len; i++) {
        iframe = ref[i];
        iframe.src = iframe.src.replace(/\?autoplay=1&?/, '?').replace('&autoplay=1', '');
        $.addClass(iframe, 'autoplay-removed');
      }
      ref1 = $$('object[data*="youtube"][data*="autoplay=1"]', root);
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        object = ref1[j];
        object.data = object.data.replace(/\?autoplay=1&?/, '?').replace('&autoplay=1', '');
        $.addClass(object, 'autoplay-removed');
      }
    }
  };

  return AntiAutoplay;

}).call(this);

Banner = (function() {
  var Banner,
    slice = [].slice;

  Banner = {
    banners: ["0.jpg","1.jpg","2.jpg","4.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","16.jpg","17.jpg","18.jpg","19.jpg","20.jpg","21.jpg","22.jpg","24.jpg","25.jpg","26.jpg","28.jpg","29.jpg","33.jpg","38.jpg","39.jpg","43.jpg","44.jpg","45.jpg","46.jpg","47.jpg","52.jpg","54.jpg","57.jpg","59.jpg","60.jpg","61.jpg","64.jpg","66.jpg","67.jpg","69.jpg","71.jpg","72.jpg","76.jpg","77.jpg","81.jpg","82.jpg","83.jpg","84.jpg","88.jpg","90.jpg","91.jpg","96.jpg","98.jpg","99.jpg","100.jpg","104.jpg","106.jpg","116.jpg","119.jpg","137.jpg","140.jpg","148.jpg","149.jpg","150.jpg","154.jpg","156.jpg","157.jpg","158.jpg","159.jpg","161.jpg","162.jpg","164.jpg","165.jpg","166.jpg","167.jpg","168.jpg","169.jpg","170.jpg","171.jpg","172.jpg","173.jpg","174.jpg","175.jpg","176.jpg","178.jpg","179.jpg","180.jpg","181.jpg","182.jpg","183.jpg","186.jpg","189.jpg","190.jpg","192.jpg","193.jpg","194.jpg","197.jpg","198.jpg","200.jpg","201.jpg","202.jpg","203.jpg","205.jpg","206.jpg","207.jpg","208.jpg","210.jpg","213.jpg","214.jpg","215.jpg","216.jpg","218.jpg","219.jpg","220.jpg","221.jpg","222.jpg","223.jpg","224.jpg","227.jpg","0.png","1.png","2.png","3.png","5.png","6.png","9.png","10.png","11.png","12.png","14.png","16.png","19.png","20.png","21.png","22.png","23.png","24.png","26.png","27.png","28.png","29.png","30.png","31.png","32.png","33.png","34.png","37.png","39.png","40.png","41.png","42.png","43.png","44.png","45.png","48.png","49.png","50.png","51.png","52.png","53.png","57.png","58.png","59.png","64.png","66.png","67.png","68.png","69.png","70.png","71.png","72.png","76.png","78.png","79.png","81.png","82.png","85.png","86.png","87.png","89.png","95.png","98.png","100.png","101.png","102.png","105.png","106.png","107.png","109.png","110.png","111.png","112.png","113.png","114.png","115.png","116.png","118.png","119.png","120.png","121.png","122.png","123.png","126.png","128.png","130.png","134.png","136.png","138.png","139.png","140.png","142.png","145.png","146.png","149.png","150.png","151.png","152.png","153.png","154.png","155.png","156.png","157.png","158.png","159.png","160.png","163.png","164.png","165.png","166.png","167.png","168.png","169.png","170.png","171.png","172.png","173.png","174.png","178.png","179.png","180.png","181.png","182.png","184.png","186.png","188.png","190.png","192.png","193.png","194.png","195.png","196.png","197.png","198.png","200.png","202.png","203.png","205.png","206.png","207.png","209.png","212.png","213.png","214.png","216.png","217.png","218.png","219.png","220.png","221.png","222.png","223.png","224.png","225.png","226.png","229.png","231.png","232.png","233.png","234.png","235.png","237.png","238.png","239.png","240.png","241.png","242.png","244.png","245.png","246.png","247.png","248.png","249.png","250.png","253.png","254.png","255.png","256.png","257.png","258.png","259.png","260.png","262.png","268.png","0.gif","1.gif","2.gif","3.gif","4.gif","5.gif","6.gif","7.gif","8.gif","9.gif","10.gif","12.gif","13.gif","14.gif","15.gif","16.gif","18.gif","19.gif","20.gif","21.gif","22.gif","23.gif","24.gif","28.gif","29.gif","30.gif","33.gif","34.gif","35.gif","36.gif","37.gif","39.gif","40.gif","42.gif","44.gif","45.gif","46.gif","48.gif","50.gif","52.gif","54.gif","55.gif","57.gif","58.gif","59.gif","60.gif","61.gif","63.gif","64.gif","66.gif","67.gif","68.gif","69.gif","70.gif","72.gif","73.gif","75.gif","76.gif","77.gif","78.gif","80.gif","81.gif","82.gif","83.gif","86.gif","87.gif","88.gif","92.gif","93.gif","94.gif","95.gif","96.gif","97.gif","98.gif","99.gif","100.gif","101.gif","102.gif","103.gif","104.gif","105.gif","106.gif","108.gif","109.gif","110.gif","111.gif","112.gif","113.gif","115.gif","116.gif","117.gif","118.gif","119.gif","120.gif","122.gif","123.gif","124.gif","127.gif","129.gif","130.gif","131.gif","134.gif","135.gif","136.gif","138.gif","139.gif","141.gif","144.gif","146.gif","148.gif","149.gif","153.gif","154.gif","155.gif","157.gif","158.gif","159.gif","160.gif","161.gif","162.gif","164.gif","166.gif","167.gif","168.gif","169.gif","170.gif","171.gif","172.gif","173.gif","174.gif","175.gif","176.gif","177.gif","178.gif","181.gif","182.gif","183.gif","185.gif","186.gif","187.gif","188.gif","189.gif","190.gif","191.gif","192.gif","193.gif","195.gif","196.gif","197.gif","200.gif","201.gif","202.gif","203.gif","204.gif","205.gif","206.gif","207.gif","208.gif","209.gif","210.gif","211.gif","212.gif","213.gif","214.gif","215.gif","216.gif","217.gif","219.gif","220.gif","221.gif","222.gif","224.gif","225.gif","226.gif","227.gif","228.gif","230.gif","232.gif","233.gif","234.gif","235.gif","238.gif","240.gif","241.gif","243.gif","244.gif","245.gif","246.gif","247.gif","249.gif","250.gif","251.gif","253.gif"],
    init: function() {
      if (Conf['Custom Board Titles']) {
        this.db = new DataBoard('customTitles', null, true);
      }
      $.asap((function() {
        return d.body;
      }), function() {
        return $.asap((function() {
          return $('hr');
        }), Banner.ready);
      });
      if (g.BOARD.ID !== 'f') {
        return Main.ready(function() {
          return $.queueTask(Banner.load);
        });
      }
    },
    ready: function() {
      var banner, children;
      banner = $(".boardBanner");
      children = banner.children;
      if (g.BOARD.ID !== 'f' && g.VIEW === 'thread' && Conf['Remove Thread Excerpt']) {
        Banner.setTitle(children[1].textContent);
      }
      children[0].title = "Click to change";
      $.on(children[0], 'click', Banner.cb.toggle);
      if (Conf['Custom Board Titles']) {
        Banner.custom(children[1]);
        if (children[2]) {
          return Banner.custom(children[2]);
        }
      }
    },
    load: function() {
      var bannerCnt, img;
      bannerCnt = $.id('bannerCnt');
      if (!bannerCnt.firstChild) {
        img = $.el('img', {
          alt: '4chan',
          src: '//s.4cdn.org/image/title/' + bannerCnt.dataset.src
        });
        return $.add(bannerCnt, img);
      }
    },
    setTitle: function(title) {
      if (Unread.title != null) {
        Unread.title = title;
        return Unread.update();
      } else {
        return d.title = title;
      }
    },
    cb: {
      toggle: function() {
        var banner, i, ref;
        if (!((ref = Banner.choices) != null ? ref.length : void 0)) {
          Banner.choices = Banner.banners.slice();
        }
        i = Math.floor(Banner.choices.length * Math.random());
        banner = Banner.choices.splice(i, 1);
        return $('img', this.parentNode).src = "//s.4cdn.org/image/title/" + banner;
      },
      click: function(e) {
        var base, br, j, len, name, ref;
        if (!(e.ctrlKey || e.metaKey)) {
          return;
        }
        if ((base = Banner.original)[name = this.className] == null) {
          base[name] = this.cloneNode(true);
        }
        this.contentEditable = true;
        ref = $$('br', this);
        for (j = 0, len = ref.length; j < len; j++) {
          br = ref[j];
          $.replace(br, $.tn('\n'));
        }
        return this.focus();
      },
      keydown: function(e) {
        e.stopPropagation();
        if (!e.shiftKey && e.keyCode === 13) {
          return this.blur();
        }
      },
      blur: function() {
        var br, j, len, ref;
        ref = $$('br', this);
        for (j = 0, len = ref.length; j < len; j++) {
          br = ref[j];
          $.replace(br, $.tn('\n'));
        }
        if (this.textContent = this.textContent.replace(/\n*$/, '')) {
          this.contentEditable = false;
          return Banner.db.set({
            boardID: g.BOARD.ID,
            threadID: this.className,
            val: {
              title: this.textContent,
              orig: Banner.original[this.className].textContent
            }
          });
        } else {
          $.rmAll(this);
          $.add(this, slice.call(Banner.original[this.className].cloneNode(true).childNodes));
          return Banner.db["delete"]({
            boardID: g.BOARD.ID,
            threadID: this.className
          });
        }
      }
    },
    original: {},
    custom: function(child) {
      var className, data, event, items, j, len, ref, string, string2;
      className = child.className;
      child.title = "Ctrl/\u2318+click to edit board " + (className.slice(5).toLowerCase());
      child.spellcheck = false;
      ref = ['click', 'keydown', 'blur'];
      for (j = 0, len = ref.length; j < len; j++) {
        event = ref[j];
        $.on(child, event, Banner.cb[event]);
      }
      string = g.BOARD + "." + className;
      string2 = string + ".orig";
      items = {};
      items[string] = '';
      items[string2] = child.textContent;
      $.get(items, function(items) {
        if (items[string]) {
          Banner.db.set({
            boardID: g.BOARD.ID,
            threadID: className,
            val: {
              title: items[string],
              orig: items[string2]
            }
          });
        }
        return $["delete"]([string, string2]);
      });
      if (data = Banner.db.get({
        boardID: g.BOARD.ID,
        threadID: className
      })) {
        if (Conf['Persistent Custom Board Titles'] || data.orig === child.textContent) {
          Banner.original[className] = child.cloneNode(true);
          return child.textContent = data.title;
        } else {
          return Banner.db["delete"]({
            boardID: g.BOARD.ID,
            threadID: className
          });
        }
      }
    }
  };

  return Banner;

}).call(this);

CatalogLinks = (function() {
  var CatalogLinks;

  CatalogLinks = {
    init: function() {
      var el, input, selector;
      if ((Conf['External Catalog'] || Conf['JSON Index']) && !(Conf['JSON Index'] && g.VIEW === 'index')) {
        selector = (function() {
          switch (g.VIEW) {
            case 'thread':
            case 'archive':
              return '.navLinks.desktop > a';
            case 'catalog':
              return '.navLinks > :first-child > a';
            case 'index':
              return '#ctrl-top > a, .cataloglink > a';
          }
        })();
        $.ready(function() {
          var catalogLink, i, len, link, ref;
          ref = $$(selector);
          for (i = 0, len = ref.length; i < len; i++) {
            link = ref[i];
            switch (link.pathname.replace(/\/+/g, '/')) {
              case "/" + g.BOARD + "/":
                if (Conf['JSON Index']) {
                  link.textContent = 'Index';
                }
                link.href = CatalogLinks.index();
                break;
              case "/" + g.BOARD + "/catalog":
                link.href = CatalogLinks.catalog();
            }
            if (g.VIEW === 'catalog' && Conf['JSON Index'] && Conf['Use 4chan X Catalog']) {
              catalogLink = link.parentNode.cloneNode(true);
              catalogLink.firstElementChild.textContent = '4chan X Catalog';
              catalogLink.firstElementChild.href = CatalogLinks.catalog();
              $.after(link.parentNode, [$.tn(' '), catalogLink]);
            }
          }
        });
      }
      if (Conf['JSON Index'] && Conf['Use 4chan X Catalog']) {
        Callbacks.Post.push({
          name: 'Catalog Link Rewrite',
          cb: this.node
        });
        Callbacks.CatalogThread.push({
          name: 'Catalog Link Rewrite',
          cb: this.node
        });
      }
      if (Conf['Catalog Links']) {
        CatalogLinks.el = el = UI.checkbox('Header catalog links', 'Catalog Links');
        el.id = 'toggleCatalog';
        input = $('input', el);
        $.on(input, 'change', this.toggle);
        $.sync('Header catalog links', CatalogLinks.set);
        return Header.menu.addEntry({
          el: el,
          order: 95
        });
      }
    },
    node: function() {
      var a, i, len, m, ref;
      ref = $$('a', this.nodes.comment);
      for (i = 0, len = ref.length; i < len; i++) {
        a = ref[i];
        if (m = a.href.match(/^https?:\/\/boards\.4chan\.org\/([^\/]+)\/catalog(#s=.*)?/)) {
          a.href = "//boards.4chan.org/" + m[1] + "/" + (m[2] || '#catalog');
        }
      }
    },
    initBoardList: function() {
      if (!CatalogLinks.el) {
        return;
      }
      return CatalogLinks.set(Conf['Header catalog links']);
    },
    toggle: function() {
      $.event('CloseMenu');
      $.set('Header catalog links', this.checked);
      return CatalogLinks.set(this.checked);
    },
    set: function(useCatalog) {
      var a, board, i, len, ref, ref1;
      ref = $$('a:not([data-only])', Header.boardList).concat($$('a', Header.bottomBoardList));
      for (i = 0, len = ref.length; i < len; i++) {
        a = ref[i];
        if (((ref1 = a.hostname) !== 'boards.4chan.org' && ref1 !== 'catalog.neet.tv') || !(board = a.pathname.split('/')[1]) || (board === 'f' || board === 'status' || board === '4chan') || a.pathname.split('/')[2] === 'archive' || $.hasClass(a, 'external')) {
          continue;
        }
        a.href = useCatalog ? CatalogLinks.catalog(board) : "/" + board + "/";
        if (a.dataset.indexOptions && a.hostname === 'boards.4chan.org' && a.pathname.split('/')[2] === '') {
          a.href += (a.hash ? '/' : '#') + a.dataset.indexOptions;
        }
      }
      CatalogLinks.el.title = "Turn catalog links " + (useCatalog ? 'off' : 'on') + ".";
      return $('input', CatalogLinks.el).checked = useCatalog;
    },
    catalog: function(board) {
      if (board == null) {
        board = g.BOARD.ID;
      }
      if (Conf['External Catalog'] && (board === 'a' || board === 'c' || board === 'g' || board === 'biz' || board === 'k' || board === 'm' || board === 'o' || board === 'p' || board === 'v' || board === 'vg' || board === 'vr' || board === 'w' || board === 'wg' || board === 'cm' || board === '3' || board === 'adv' || board === 'an' || board === 'asp' || board === 'cgl' || board === 'ck' || board === 'co' || board === 'diy' || board === 'fa' || board === 'fit' || board === 'gd' || board === 'int' || board === 'jp' || board === 'lit' || board === 'mlp' || board === 'mu' || board === 'n' || board === 'out' || board === 'po' || board === 'sci' || board === 'sp' || board === 'tg' || board === 'toy' || board === 'trv' || board === 'tv' || board === 'vp' || board === 'wsg' || board === 'x' || board === 'f' || board === 'pol' || board === 's4s' || board === 'lgbt')) {
        return "http://catalog.neet.tv/" + board + "/";
      } else if (Conf['JSON Index'] && Conf['Use 4chan X Catalog']) {
        if (g.BOARD.ID === board && g.VIEW === 'index') {
          return '#catalog';
        } else {
          return "/" + board + "/#catalog";
        }
      } else {
        return "/" + board + "/catalog";
      }
    },
    index: function(board) {
      if (board == null) {
        board = g.BOARD.ID;
      }
      if (Conf['JSON Index'] && board !== 'f') {
        if (g.BOARD.ID === board && g.VIEW === 'index') {
          return '#index';
        } else {
          return "/" + board + "/#index";
        }
      } else {
        return "/" + board + "/";
      }
    }
  };

  return CatalogLinks;

}).call(this);

CustomCSS = (function() {
  var CustomCSS;

  CustomCSS = {
    init: function() {
      if (!Conf['Custom CSS']) {
        return;
      }
      return this.addStyle();
    },
    addStyle: function() {
      return this.style = $.addStyle(Conf['usercss'], 'custom-css', '#fourchanx-css');
    },
    rmStyle: function() {
      if (this.style) {
        $.rm(this.style);
        return delete this.style;
      }
    },
    update: function() {
      if (!this.style) {
        return this.addStyle();
      }
      return this.style.textContent = Conf['usercss'];
    }
  };

  return CustomCSS;

}).call(this);

ExpandComment = (function() {
  var ExpandComment;

  ExpandComment = {
    init: function() {
      if (g.VIEW !== 'index' || !Conf['Comment Expansion'] || Conf['JSON Index']) {
        return;
      }
      if (g.BOARD.ID === 'g') {
        this.callbacks.push(Fourchan.code);
      }
      if (g.BOARD.ID === 'sci') {
        this.callbacks.push(Fourchan.math);
      }
      return Callbacks.Post.push({
        name: 'Comment Expansion',
        cb: this.node
      });
    },
    node: function() {
      var a;
      if (a = $('.abbr > a:not([onclick])', this.nodes.comment)) {
        return $.on(a, 'click', ExpandComment.cb);
      }
    },
    callbacks: [],
    cb: function(e) {
      e.preventDefault();
      return ExpandComment.expand(Get.postFromNode(this));
    },
    expand: function(post) {
      var a;
      if (post.nodes.longComment && !post.nodes.longComment.parentNode) {
        $.replace(post.nodes.shortComment, post.nodes.longComment);
        post.nodes.comment = post.nodes.longComment;
        return;
      }
      if (!(a = $('.abbr > a', post.nodes.comment))) {
        return;
      }
      a.textContent = "Post No." + post + " Loading...";
      return $.cache("//a.4cdn.org" + (a.pathname.split(/\/+/).splice(0, 4).join('/')) + ".json", function() {
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
      var callback, clone, comment, href, i, j, k, len, len1, len2, postObj, posts, quote, ref, ref1, spoilerRange, status;
      status = req.status;
      if (status !== 200 && status !== 304) {
        a.textContent = "Error " + req.statusText + " (" + status + ")";
        return;
      }
      posts = req.response.posts;
      if (spoilerRange = posts[0].custom_spoiler) {
        Build.spoilerRange[g.BOARD] = spoilerRange;
      }
      for (i = 0, len = posts.length; i < len; i++) {
        postObj = posts[i];
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
      ref = $$('.quotelink', clone);
      for (j = 0, len1 = ref.length; j < len1; j++) {
        quote = ref[j];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        if (href[0] === '#') {
          quote.href = "" + (a.pathname.split(/\/+/).splice(0, 4).join('/')) + href;
        } else {
          quote.href = (a.pathname.split(/\/+/).splice(0, 3).join('/')) + "/" + href;
        }
      }
      post.nodes.shortComment = comment;
      $.replace(comment, clone);
      post.nodes.comment = post.nodes.longComment = clone;
      post.parseComment();
      post.parseQuotes();
      ref1 = ExpandComment.callbacks;
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        callback = ref1[k];
        callback.call(post);
      }
    }
  };

  return ExpandComment;

}).call(this);

ExpandThread = (function() {
  var ExpandThread,
    slice = [].slice;

  ExpandThread = {
    statuses: {},
    init: function() {
      if (g.VIEW === 'thread' || !Conf['Thread Expansion']) {
        return;
      }
      if (Conf['JSON Index']) {
        return $.on(d, 'IndexRefresh', this.onIndexRefresh);
      } else {
        return Callbacks.Thread.push({
          name: 'Expand Thread',
          cb: function() {
            return ExpandThread.setButton(this);
          }
        });
      }
    },
    setButton: function(thread) {
      var a;
      if (!(a = $.x('following-sibling::*[contains(@class,"summary")][1]', thread.OP.nodes.root))) {
        return;
      }
      a.textContent = Build.summaryText.apply(Build, ['+'].concat(slice.call(a.textContent.match(/\d+/g))));
      a.style.cursor = 'pointer';
      return $.on(a, 'click', ExpandThread.cbToggle);
    },
    disconnect: function(refresh) {
      var ref, ref1, status, threadID;
      if (g.VIEW === 'thread' || !Conf['Thread Expansion']) {
        return;
      }
      ref = ExpandThread.statuses;
      for (threadID in ref) {
        status = ref[threadID];
        if ((ref1 = status.req) != null) {
          ref1.abort();
        }
        delete ExpandThread.statuses[threadID];
      }
      if (!refresh) {
        return $.off(d, 'IndexRefresh', this.onIndexRefresh);
      }
    },
    onIndexRefresh: function() {
      ExpandThread.disconnect(true);
      return g.BOARD.threads.forEach(function(thread) {
        return ExpandThread.setButton(thread);
      });
    },
    cbToggle: function(e) {
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      return ExpandThread.toggle(Get.threadFromNode(this));
    },
    toggle: function(thread) {
      var a, threadRoot;
      threadRoot = thread.OP.nodes.root.parentNode;
      if (!(a = $('.summary', threadRoot))) {
        return;
      }
      if (thread.ID in ExpandThread.statuses) {
        return ExpandThread.contract(thread, a, threadRoot);
      } else {
        return ExpandThread.expand(thread, a);
      }
    },
    expand: function(thread, a) {
      var status;
      ExpandThread.statuses[thread] = status = {};
      a.textContent = Build.summaryText.apply(Build, ['...'].concat(slice.call(a.textContent.match(/\d+/g))));
      return status.req = $.cache("//a.4cdn.org/" + thread.board + "/thread/" + thread + ".json", function() {
        delete status.req;
        return ExpandThread.parse(this, thread, a);
      });
    },
    contract: function(thread, a, threadRoot) {
      var filesCount, i, inlined, len, num, postsCount, replies, reply, status;
      status = ExpandThread.statuses[thread];
      delete ExpandThread.statuses[thread];
      if (status.req) {
        status.req.abort();
        if (a) {
          a.textContent = Build.summaryText.apply(Build, ['+'].concat(slice.call(a.textContent.match(/\d+/g))));
        }
        return;
      }
      replies = $$('.thread > .replyContainer', threadRoot);
      if (!Conf['JSON Index'] || Conf['Show Replies']) {
        num = (function() {
          if (thread.isSticky) {
            return 1;
          } else {
            switch (g.BOARD.ID) {
              case 'b':
              case 'vg':
                return 3;
              case 't':
                return 1;
              default:
                return 5;
            }
          }
        })();
        replies = replies.slice(0, -num);
      }
      postsCount = 0;
      filesCount = 0;
      for (i = 0, len = replies.length; i < len; i++) {
        reply = replies[i];
        if (Conf['Quote Inlining']) {
          while (inlined = $('.inlined', reply)) {
            inlined.click();
          }
        }
        postsCount++;
        if ('file' in Get.postFromRoot(reply)) {
          filesCount++;
        }
        $.rm(reply);
      }
      return a.textContent = Build.summaryText('+', postsCount, filesCount);
    },
    parse: function(req, thread, a) {
      var filesCount, i, len, post, postData, posts, postsCount, postsRoot, ref, ref1, root;
      if ((ref = req.status) !== 200 && ref !== 304) {
        a.textContent = "Error " + req.statusText + " (" + req.status + ")";
        return;
      }
      Build.spoilerRange[thread.board] = req.response.posts[0].custom_spoiler;
      posts = [];
      postsRoot = [];
      filesCount = 0;
      ref1 = req.response.posts;
      for (i = 0, len = ref1.length; i < len; i++) {
        postData = ref1[i];
        if (postData.no === thread.ID) {
          continue;
        }
        if ((post = thread.posts[postData.no]) && !post.isFetchedQuote) {
          if ('file' in post) {
            filesCount++;
          }
          postsRoot.push(post.nodes.root);
          continue;
        }
        root = Build.postFromObject(postData, thread.board.ID);
        post = new Post(root, thread, thread.board);
        if ('file' in post) {
          filesCount++;
        }
        posts.push(post);
        postsRoot.push(root);
      }
      Main.callbackNodes('Post', posts);
      $.after(a, postsRoot);
      $.event('PostsInserted');
      postsCount = postsRoot.length;
      return a.textContent = Build.summaryText('-', postsCount, filesCount);
    }
  };

  return ExpandThread;

}).call(this);

FileInfo = (function() {
  var FileInfo;

  FileInfo = {
    init: function() {
      var ref;
      if (((ref = g.VIEW) !== 'index' && ref !== 'thread') || !Conf['File Info Formatting']) {
        return;
      }
      return Callbacks.Post.push({
        name: 'File Info Formatting',
        cb: this.node
      });
    },
    node: function() {
      var a, i, info, len, oldInfo, ref;
      if (!this.file) {
        return;
      }
      if (this.isClone) {
        ref = $$('.file-info .download-button', this.file.text);
        for (i = 0, len = ref.length; i < len; i++) {
          a = ref[i];
          $.on(a, 'click', ImageCommon.download);
        }
        return;
      }
      oldInfo = $.el('span', {
        className: 'fileText-original'
      });
      $.prepend(this.file.link.parentNode, oldInfo);
      $.add(oldInfo, [this.file.link.previousSibling, this.file.link, this.file.link.nextSibling]);
      info = $.el('span', {
        className: 'file-info'
      });
      FileInfo.format(Conf['fileInfo'], this, info);
      return $.prepend(this.file.text, info);
    },
    format: function(formatString, post, outputNode) {
      var a, i, len, output, ref;
      output = [];
      formatString.replace(/%(.)|[^%]+/g, function(s, c) {
        output.push(c in FileInfo.formatters ? FileInfo.formatters[c].call(post) : {
          innerHTML: E(s)
        });
        return '';
      });
      $.extend(outputNode, {
        innerHTML: E.cat(output)
      });
      ref = $$('.download-button', outputNode);
      for (i = 0, len = ref.length; i < len; i++) {
        a = ref[i];
        $.on(a, 'click', ImageCommon.download);
      }
    },
    formatters: {
      t: function() {
        return {
          innerHTML: E(this.file.url.match(/[^/]*$/)[0])
        };
      },
      T: function() {
        return {
          innerHTML: "<a href=\"" + E(this.file.url) + "\" target=\"_blank\">" + (FileInfo.formatters.t.call(this)).innerHTML + "</a>"
        };
      },
      l: function() {
        return {
          innerHTML: "<a href=\"" + E(this.file.url) + "\" target=\"_blank\">" + (FileInfo.formatters.n.call(this)).innerHTML + "</a>"
        };
      },
      L: function() {
        return {
          innerHTML: "<a href=\"" + E(this.file.url) + "\" target=\"_blank\">" + (FileInfo.formatters.N.call(this)).innerHTML + "</a>"
        };
      },
      n: function() {
        var fullname, shortname;
        fullname = this.file.name;
        shortname = Build.shortFilename(this.file.name, this.isReply);
        if (fullname === shortname) {
          return {
            innerHTML: E(fullname)
          };
        } else {
          return {
            innerHTML: "<span class=\"fnswitch\"><span class=\"fntrunc\">" + E(shortname) + "</span><span class=\"fnfull\">" + E(fullname) + "</span></span>"
          };
        }
      },
      N: function() {
        return {
          innerHTML: E(this.file.name)
        };
      },
      d: function() {
        return {
          innerHTML: "<a href=\"" + E(this.file.url) + "\" download=\"" + E(this.file.name) + "\" class=\"fa fa-download download-button\"></a>"
        };
      },
      p: function() {
        return {
          innerHTML: ((this.file.isSpoiler) ? "Spoiler, " : "")
        };
      },
      s: function() {
        return {
          innerHTML: E(this.file.size)
        };
      },
      B: function() {
        return {
          innerHTML: E(Math.round(this.file.sizeInBytes)) + " Bytes"
        };
      },
      K: function() {
        return {
          innerHTML: E(Math.round(this.file.sizeInBytes/1024)) + " KB"
        };
      },
      M: function() {
        return {
          innerHTML: E(Math.round(this.file.sizeInBytes/1048576*100)/100) + " MB"
        };
      },
      r: function() {
        return {
          innerHTML: E(this.file.dimensions || "PDF")
        };
      },
      g: function() {
        return {
          innerHTML: ((this.file.tag) ? ", " + E(this.file.tag) : "")
        };
      },
      '%': function() {
        return {
          innerHTML: "%"
        };
      }
    }
  };

  return FileInfo;

}).call(this);

Flash = (function() {
  var Flash;

  Flash = {
    init: function() {
      if (g.BOARD.ID === 'f' && Conf['Enable Native Flash Embedding']) {
        return $.ready(Flash.initReady);
      }
    },
    initReady: function() {
      if ($.hasStorage) {
        return $.global(function() {
          if (JSON.parse(localStorage['4chan-settings'] || '{}').disableAll) {
            return window.SWFEmbed.init();
          }
        });
      } else {
        if (g.VIEW === 'thread') {
          $.global(function() {
            return window.Main.tid = location.pathname.split(/\/+/)[3];
          });
        }
        return $.global(function() {
          return window.SWFEmbed.init();
        });
      }
    }
  };

  return Flash;

}).call(this);

Fourchan = (function() {
  var Fourchan;

  Fourchan = {
    init: function() {
      var ref;
      if ((ref = g.VIEW) !== 'index' && ref !== 'thread') {
        return;
      }
      if (g.BOARD.ID === 'g') {
        $.on(window, 'prettyprint:cb', function(e) {
          var post, pre;
          if (!(post = g.posts[e.detail.ID])) {
            return;
          }
          if (!(pre = $$('.prettyprint', post.nodes.comment)[e.detail.i])) {
            return;
          }
          if (!$.hasClass(pre, 'prettyprinted')) {
            pre.innerHTML = e.detail.html;
            return $.addClass(pre, 'prettyprinted');
          }
        });
        $.globalEval('window.addEventListener(\'prettyprint\', function(e) {\n  window.dispatchEvent(new CustomEvent(\'prettyprint:cb\', {\n    detail: {\n      ID:   e.detail.ID,\n      i:    e.detail.i,\n      html: prettyPrintOne(e.detail.html)\n    }\n  }));\n}, false);');
        Callbacks.Post.push({
          name: 'Parse /g/ code',
          cb: this.code
        });
      }
      if (g.BOARD.ID === 'sci') {
        $.global(function() {
          return window.addEventListener('mathjax', function(e) {
            if (window.MathJax) {
              return window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, e.target]);
            } else {
              if (!document.querySelector('script[src^="//cdn.mathjax.org/"]')) {
                window.loadMathJax();
                window.loadMathJax = function() {};
              }
              if (!e.target.classList.contains('postMessage')) {
                return document.querySelector('script[src^="//cdn.mathjax.org/"]').addEventListener('load', function() {
                  return window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, e.target]);
                }, false);
              }
            }
          }, false);
        });
        Callbacks.Post.push({
          name: 'Parse /sci/ math',
          cb: this.math
        });
        Callbacks.CatalogThread.push({
          name: 'Parse /sci/ math',
          cb: this.math
        });
      }
      return Main.ready(function() {
        return $.global(function() {
          var j, len, node, ref1;
          window.clickable_ids = false;
          ref1 = document.querySelectorAll('.posteruid, .capcode');
          for (j = 0, len = ref1.length; j < len; j++) {
            node = ref1[j];
            node.removeEventListener('click', window.idClick, false);
          }
        });
      });
    },
    code: function() {
      if (this.isClone) {
        return;
      }
      return $.ready((function(_this) {
        return function() {
          var i, j, len, pre, ref;
          ref = $$('.prettyprint', _this.nodes.comment);
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            pre = ref[i];
            if (!$.hasClass(pre, 'prettyprinted')) {
              $.event('prettyprint', {
                ID: _this.fullID,
                i: i,
                html: pre.innerHTML
              }, window);
            }
          }
        };
      })(this));
    },
    math: function() {
      var cb, j, len, wbr, wbrs;
      if (!/\[(math|eqn)\]/.test(this.nodes.comment.textContent)) {
        return;
      }
      if ((wbrs = $$('wbr', this.nodes.comment)).length) {
        for (j = 0, len = wbrs.length; j < len; j++) {
          wbr = wbrs[j];
          $.rm(wbr);
        }
        this.nodes.comment.normalize();
      }
      cb = (function(_this) {
        return function() {
          if (!doc.contains(_this.nodes.comment)) {
            return;
          }
          $.off(d, 'PostsInserted', cb);
          return $.event('mathjax', null, _this.nodes.comment);
        };
      })(this);
      $.on(d, 'PostsInserted', cb);
      return cb();
    }
  };

  return Fourchan;

}).call(this);

IDColor = (function() {
  var IDColor;

  IDColor = {
    init: function() {
      var ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Color User IDs'])) {
        return;
      }
      this.ids = {
        Heaven: [0, 0, 0, '#fff']
      };
      return Callbacks.Post.push({
        name: 'Color User IDs',
        cb: this.node
      });
    },
    node: function() {
      var rgb, span, style, uid;
      if (this.isClone || !((uid = this.info.uniqueID) && (span = $('span.hand', this.nodes.uniqueID)))) {
        return;
      }
      rgb = IDColor.ids[uid] || IDColor.compute(uid);
      style = span.style;
      style.color = rgb[3];
      style.backgroundColor = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
      return $.addClass(span, 'painted');
    },
    compute: function(uid) {
      var hash, rgb;
      hash = IDColor.hash(uid);
      rgb = [(hash >> 24) & 0xFF, (hash >> 16) & 0xFF, (hash >> 8) & 0xFF];
      rgb.push((rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 125 ? '#000' : '#fff');
      return this.ids[uid] = rgb;
    },
    hash: function(uid) {
      var i, msg;
      msg = 0;
      i = 0;
      while (i < 8) {
        msg = (msg << 5) - msg + uid.charCodeAt(i++);
      }
      return msg;
    }
  };

  return IDColor;

}).call(this);

IDHighlight = (function() {
  var IDHighlight;

  IDHighlight = {
    init: function() {
      var ref;
      if ((ref = g.VIEW) !== 'index' && ref !== 'thread') {
        return;
      }
      return Callbacks.Post.push({
        name: 'Highlight by User ID',
        cb: this.node
      });
    },
    uniqueID: null,
    node: function() {
      if (this.nodes.uniqueID) {
        $.on(this.nodes.uniqueID, 'click', IDHighlight.click(this));
      }
      if (this.nodes.capcode) {
        $.on(this.nodes.capcode, 'click', IDHighlight.click(this));
      }
      if (!this.isClone) {
        return IDHighlight.set(this);
      }
    },
    set: function(post) {
      var match;
      match = (post.info.uniqueID || post.info.capcode) === IDHighlight.uniqueID;
      return $[match ? 'addClass' : 'rmClass'](post.nodes.post, 'highlight');
    },
    click: function(post) {
      return function() {
        var uniqueID;
        uniqueID = post.info.uniqueID || post.info.capcode;
        IDHighlight.uniqueID = IDHighlight.uniqueID === uniqueID ? null : uniqueID;
        return g.posts.forEach(IDHighlight.set);
      };
    }
  };

  return IDHighlight;

}).call(this);

Keybinds = (function() {
  var Keybinds;

  Keybinds = {
    init: function() {
      var hotkey, init;
      if (!Conf['Keybinds']) {
        return;
      }
      for (hotkey in Config.hotkeys) {
        $.sync(hotkey, Keybinds.sync);
      }
      init = function() {
        var i, len, node, ref;
        $.off(d, '4chanXInitFinished', init);
        $.on(d, 'keydown', Keybinds.keydown);
        ref = $$('[accesskey]');
        for (i = 0, len = ref.length; i < len; i++) {
          node = ref[i];
          node.removeAttribute('accesskey');
        }
      };
      return $.on(d, '4chanXInitFinished', init);
    },
    sync: function(key, hotkey) {
      return Conf[hotkey] = key;
    },
    keydown: function(e) {
      var form, i, key, len, notification, notifications, op, ref, ref1, ref2, ref3, ref4, ref5, searchInput, target, thread, threadRoot;
      if (!(key = Keybinds.keyCode(e))) {
        return;
      }
      target = e.target;
      if ((ref = target.nodeName) === 'INPUT' || ref === 'TEXTAREA') {
        if (!(/(Esc|Alt|Ctrl|Meta|Shift\+\w{2,})/.test(key) && !/^Alt\+(\d|Up|Down|Left|Right)$/.test(key))) {
          return;
        }
      }
      if (!(((ref1 = g.VIEW) !== 'index' && ref1 !== 'thread') || g.VIEW === 'index' && Conf['JSON Index'] && Conf['Index Mode'] === 'catalog' || g.VIEW === 'index' && g.BOARD.ID === 'f')) {
        threadRoot = Nav.getThread();
        if (op = $('.op', threadRoot)) {
          thread = Get.postFromNode(op).thread;
        }
      }
      switch (key) {
        case Conf['Toggle board list']:
          if (!Conf['Custom Board Navigation']) {
            return;
          }
          Header.toggleBoardList();
          break;
        case Conf['Toggle header']:
          Header.toggleBarVisibility();
          break;
        case Conf['Open empty QR']:
          if (!QR.postingIsEnabled) {
            return;
          }
          Keybinds.qr();
          break;
        case Conf['Open QR']:
          if (!(QR.postingIsEnabled && threadRoot)) {
            return;
          }
          Keybinds.qr(threadRoot);
          break;
        case Conf['Open settings']:
          Settings.open();
          break;
        case Conf['Close']:
          if (Settings.dialog) {
            Settings.close();
          } else if ((notifications = $$('.notification')).length) {
            for (i = 0, len = notifications.length; i < len; i++) {
              notification = notifications[i];
              $('.close', notification).click();
            }
          } else if (QR.nodes && !(QR.nodes.el.hidden || window.getComputedStyle(QR.nodes.form).display === 'none')) {
            if (Conf['Persistent QR']) {
              QR.hide();
            } else {
              QR.close();
            }
          } else if (Embedding.lastEmbed) {
            Embedding.closeFloat();
          } else {
            return;
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
        case Conf['SJIS tags']:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('sjis', target);
          break;
        case Conf['Toggle sage']:
          if (!(QR.nodes && !QR.nodes.el.hidden)) {
            return;
          }
          Keybinds.sage();
          break;
        case Conf['Submit QR']:
          if (!(QR.nodes && !QR.nodes.el.hidden)) {
            return;
          }
          if (!QR.status()) {
            QR.submit();
          }
          break;
        case Conf['Update']:
          switch (g.VIEW) {
            case 'thread':
              if (!Conf['Thread Updater']) {
                return;
              }
              ThreadUpdater.update();
              break;
            case 'index':
              if (!(Conf['JSON Index'] && g.BOARD.ID !== 'f')) {
                return;
              }
              Index.update();
              break;
            default:
              return;
          }
          break;
        case Conf['Watch']:
          if (!(ThreadWatcher.enabled && thread)) {
            return;
          }
          ThreadWatcher.toggle(thread);
          break;
        case Conf['Update thread watcher']:
          if (!ThreadWatcher.enabled) {
            return;
          }
          ThreadWatcher.buttonFetchAll();
          break;
        case Conf['Expand image']:
          if (!(ImageExpand.enabled && threadRoot)) {
            return;
          }
          Keybinds.img(threadRoot);
          break;
        case Conf['Expand images']:
          if (!(ImageExpand.enabled && threadRoot)) {
            return;
          }
          Keybinds.img(threadRoot, true);
          break;
        case Conf['Open Gallery']:
          if (!Gallery.enabled) {
            return;
          }
          Gallery.cb.toggle();
          break;
        case Conf['fappeTyme']:
          if (!(Conf['Fappe Tyme'] && ((ref2 = g.VIEW) === 'index' || ref2 === 'thread'))) {
            return;
          }
          FappeTyme.toggle('fappe');
          break;
        case Conf['werkTyme']:
          if (!(Conf['Werk Tyme'] && ((ref3 = g.VIEW) === 'index' || ref3 === 'thread'))) {
            return;
          }
          FappeTyme.toggle('werk');
          break;
        case Conf['Front page']:
          if (Conf['JSON Index'] && g.VIEW === 'index' && g.BOARD.ID !== 'f') {
            Index.userPageNav(1);
          } else {
            window.location = "/" + g.BOARD + "/";
          }
          break;
        case Conf['Open front page']:
          $.open("/" + g.BOARD + "/");
          break;
        case Conf['Next page']:
          if (!(g.VIEW === 'index' && g.BOARD.ID !== 'f')) {
            return;
          }
          if (Conf['JSON Index']) {
            if ((ref4 = Conf['Index Mode']) !== 'paged' && ref4 !== 'infinite') {
              return;
            }
            $('.next button', Index.pagelist).click();
          } else {
            if (form = $('.next form')) {
              window.location = form.action;
            }
          }
          break;
        case Conf['Previous page']:
          if (!(g.VIEW === 'index' && g.BOARD.ID !== 'f')) {
            return;
          }
          if (Conf['JSON Index']) {
            if ((ref5 = Conf['Index Mode']) !== 'paged' && ref5 !== 'infinite') {
              return;
            }
            $('.prev button', Index.pagelist).click();
          } else {
            if (form = $('.prev form')) {
              window.location = form.action;
            }
          }
          break;
        case Conf['Search form']:
          if (!(g.VIEW === 'index' && g.BOARD.ID !== 'f')) {
            return;
          }
          searchInput = Conf['JSON Index'] ? Index.searchInput : $.id('search-box');
          Header.scrollToIfNeeded(searchInput);
          searchInput.focus();
          break;
        case Conf['Paged mode']:
          if (!(Conf['JSON Index'] && g.BOARD.ID !== 'f')) {
            return;
          }
          window.location = g.VIEW === 'index' ? '#paged' : "/" + g.BOARD + "/#paged";
          break;
        case Conf['Infinite scrolling mode']:
          if (!(Conf['JSON Index'] && g.BOARD.ID !== 'f')) {
            return;
          }
          window.location = g.VIEW === 'index' ? '#infinite' : "/" + g.BOARD + "/#infinite";
          break;
        case Conf['All pages mode']:
          if (!(Conf['JSON Index'] && g.BOARD.ID !== 'f')) {
            return;
          }
          window.location = g.VIEW === 'index' ? '#all-pages' : "/" + g.BOARD + "/#all-pages";
          break;
        case Conf['Open catalog']:
          if (g.BOARD.ID === 'f') {
            return;
          }
          window.location = CatalogLinks.catalog();
          break;
        case Conf['Cycle sort type']:
          if (!(Conf['JSON Index'] && g.VIEW === 'index' && g.BOARD.ID !== 'f')) {
            return;
          }
          Index.cycleSortType();
          break;
        case Conf['Next thread']:
          if (!(g.VIEW === 'index' && threadRoot)) {
            return;
          }
          Nav.scroll(+1);
          break;
        case Conf['Previous thread']:
          if (!(g.VIEW === 'index' && threadRoot)) {
            return;
          }
          Nav.scroll(-1);
          break;
        case Conf['Expand thread']:
          if (!(g.VIEW === 'index' && threadRoot)) {
            return;
          }
          ExpandThread.toggle(thread);
          break;
        case Conf['Open thread']:
          if (!(g.VIEW === 'index' && threadRoot)) {
            return;
          }
          Keybinds.open(thread);
          break;
        case Conf['Open thread tab']:
          if (!(g.VIEW === 'index' && threadRoot)) {
            return;
          }
          Keybinds.open(thread, true);
          break;
        case Conf['Next reply']:
          if (!threadRoot) {
            return;
          }
          Keybinds.hl(+1, threadRoot);
          break;
        case Conf['Previous reply']:
          if (!threadRoot) {
            return;
          }
          Keybinds.hl(-1, threadRoot);
          break;
        case Conf['Deselect reply']:
          if (!threadRoot) {
            return;
          }
          Keybinds.hl(0, threadRoot);
          break;
        case Conf['Hide']:
          if (!(thread && ThreadHiding.db)) {
            return;
          }
          Header.scrollTo(threadRoot);
          ThreadHiding.toggle(thread);
          break;
        case Conf['Previous Post Quoting You']:
          if (!(threadRoot && QuoteYou.db)) {
            return;
          }
          QuoteYou.cb.seek('preceding');
          break;
        case Conf['Next Post Quoting You']:
          if (!(threadRoot && QuoteYou.db)) {
            return;
          }
          QuoteYou.cb.seek('following');
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
          case 32:
            return 'Space';
          case 37:
            return 'Left';
          case 38:
            return 'Up';
          case 39:
            return 'Right';
          case 40:
            return 'Down';
          case 188:
            return 'Comma';
          case 190:
            return 'Period';
          case 191:
            return 'Slash';
          case 59:
          case 186:
            return 'Semicolon';
          default:
            if ((48 <= kc && kc <= 57) || (65 <= kc && kc <= 90)) {
              return String.fromCharCode(kc).toLowerCase();
            } else if ((96 <= kc && kc <= 105)) {
              return String.fromCharCode(kc - 48).toLowerCase();
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
    qr: function(thread) {
      QR.open();
      if (thread != null) {
        QR.quote.call($('input', $('.post.highlight', thread) || thread));
      }
      return QR.nodes.com.focus();
    },
    tags: function(tag, ta) {
      var range, selEnd, selStart, supported, value;
      supported = (function() {
        switch (tag) {
          case 'spoiler':
            return !!$('.postForm input[name=spoiler]');
          case 'code':
            return g.BOARD.ID === 'g';
          case 'math':
          case 'eqn':
            return g.BOARD.ID === 'sci';
          case 'sjis':
            return g.BOARD.ID === 'jp';
        }
      })();
      if (!supported) {
        new Notice('warning', "[" + tag + "] tags are not supported on /" + g.BOARD + "/.", 20);
      }
      value = ta.value;
      selStart = ta.selectionStart;
      selEnd = ta.selectionEnd;
      ta.value = value.slice(0, selStart) + ("[" + tag + "]") + value.slice(selStart, selEnd) + ("[/" + tag + "]") + value.slice(selEnd);
      range = ("[" + tag + "]").length + selEnd;
      ta.setSelectionRange(range, range);
      return $.event('input', null, ta);
    },
    sage: function() {
      var isSage;
      isSage = /sage/i.test(QR.nodes.email.value);
      return QR.nodes.email.value = isSage ? "" : "sage";
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
      url = "/" + thread.board + "/thread/" + thread;
      if (tab) {
        return $.open(url);
      } else {
        return location.href = url;
      }
    },
    hl: function(delta, thread) {
      var axis, height, i, len, next, postEl, replies, reply, root;
      postEl = $('.reply.highlight', thread);
      if (!delta) {
        if (postEl) {
          $.rmClass(postEl, 'highlight');
        }
        return;
      }
      if (postEl) {
        height = postEl.getBoundingClientRect().height;
        if (Header.getTopOf(postEl) >= -height && Header.getBottomOf(postEl) >= -height) {
          root = postEl.parentNode;
          axis = delta === +1 ? 'following' : 'preceding';
          if (!(next = $.x(axis + "-sibling::div[contains(@class,'replyContainer') and not(@hidden) and not(child::div[@class='stub'])][1]/child::div[contains(@class,'reply')]", root))) {
            return;
          }
          Header.scrollToIfNeeded(next, delta === +1);
          this.focus(next);
          $.rmClass(postEl, 'highlight');
          return;
        }
        $.rmClass(postEl, 'highlight');
      }
      replies = $$('.reply', thread);
      if (delta === -1) {
        replies.reverse();
      }
      for (i = 0, len = replies.length; i < len; i++) {
        reply = replies[i];
        if (delta === +1 && Header.getTopOf(reply) > 0 || delta === -1 && Header.getBottomOf(reply) > 0) {
          this.focus(reply);
          return;
        }
      }
    },
    focus: function(post) {
      return $.addClass(post, 'highlight');
    }
  };

  return Keybinds;

}).call(this);

Nav = (function() {
  var Nav;

  Nav = {
    init: function() {
      var append, next, prev, span;
      switch (g.VIEW) {
        case 'index':
          if (!Conf['Index Navigation']) {
            return;
          }
          break;
        case 'thread':
          if (!Conf['Reply Navigation']) {
            return;
          }
          break;
        default:
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
      append = function() {
        $.off(d, '4chanXInitFinished', append);
        return $.add(d.body, span);
      };
      return $.on(d, '4chanXInitFinished', append);
    },
    prev: function() {
      if (g.VIEW === 'thread') {
        return window.scrollTo(0, 0);
      } else {
        return Nav.scroll(-1);
      }
    },
    next: function() {
      if (g.VIEW === 'thread') {
        return window.scrollTo(0, d.body.scrollHeight);
      } else {
        return Nav.scroll(+1);
      }
    },
    getThread: function() {
      var i, len, ref, thread, threadRoot;
      ref = $$('.thread');
      for (i = 0, len = ref.length; i < len; i++) {
        threadRoot = ref[i];
        thread = Get.threadFromRoot(threadRoot);
        if (thread.isHidden && !thread.stub) {
          continue;
        }
        if (Header.getTopOf(threadRoot) >= -threadRoot.getBoundingClientRect().height) {
          return threadRoot;
        }
      }
      return $('.board');
    },
    scroll: function(delta) {
      var axis, extra, next, ref, thread, top;
      if ((ref = d.activeElement) != null) {
        ref.blur();
      }
      thread = Nav.getThread();
      axis = delta === +1 ? 'following' : 'preceding';
      if (next = $.x(axis + "-sibling::div[contains(@class,'thread') and not(@hidden)][1]", thread)) {
        top = Header.getTopOf(thread);
        if (delta === +1 && top < 5 || delta === -1 && top > -5) {
          thread = next;
        }
      }
      extra = Header.getTopOf(thread) + doc.clientHeight - d.body.getBoundingClientRect().bottom;
      if (extra > 0) {
        d.body.style.marginBottom = extra + "px";
      }
      Header.scrollTo(thread);
      if (extra > 0 && !Nav.haveExtra) {
        Nav.haveExtra = true;
        return $.on(d, 'scroll', Nav.removeExtra);
      }
    },
    removeExtra: function() {
      var extra;
      extra = doc.clientHeight - d.body.getBoundingClientRect().bottom;
      if (extra > 0) {
        return d.body.style.marginBottom = extra + "px";
      } else {
        d.body.style.marginBottom = null;
        delete Nav.haveExtra;
        return $.off(d, 'scroll', Nav.removeExtra);
      }
    }
  };

  return Nav;

}).call(this);

NormalizeURL = (function() {
  var NormalizeURL;

  NormalizeURL = {
    init: function() {
      var pathname;
      if (!Conf['Normalize URL']) {
        return;
      }
      pathname = location.pathname.split(/\/+/);
      switch (g.VIEW) {
        case 'thread':
          pathname[2] = 'thread';
          pathname = pathname.slice(0, 4);
          break;
        case 'index':
          pathname = pathname.slice(0, 3);
      }
      pathname = pathname.join('/');
      if (location.pathname !== pathname) {
        return history.replaceState(history.state, '', location.protocol + "//" + location.host + pathname + location.hash);
      }
    }
  };

  return NormalizeURL;

}).call(this);

PSAHiding = (function() {
  var PSAHiding;

  PSAHiding = {
    init: function() {
      if (!Conf['Announcement Hiding']) {
        return;
      }
      $.addClass(doc, 'hide-announcement');
      return $.one(d, '4chanXInitFinished', this.setup);
    },
    setup: function() {
      var btn, entry, hr, psa, ref;
      if (!(psa = PSAHiding.psa = $.id('globalMessage'))) {
        $.rmClass(doc, 'hide-announcement');
        return;
      }
      if ((hr = (ref = $.id('globalToggle')) != null ? ref.previousElementSibling : void 0) && hr.nodeName === 'HR') {
        PSAHiding.hr = hr;
      }
      entry = {
        el: $.el('a', {
          textContent: 'Show announcement',
          className: 'show-announcement',
          href: 'javascript:;'
        }),
        order: 50,
        open: function() {
          return PSAHiding.hidden;
        }
      };
      Header.menu.addEntry(entry);
      $.on(entry.el, 'click', PSAHiding.toggle);
      PSAHiding.btn = btn = $.el('span', {
        title: 'Mark announcement as read and hide.',
        className: 'hide-announcement'
      });
      $.extend(btn, {
        innerHTML: "[<a href=\"javascript:;\">Dismiss</a>]"
      });
      $.on(btn, 'click', PSAHiding.toggle);
      $.get('hiddenPSA', 0, function(arg) {
        var hiddenPSA;
        hiddenPSA = arg.hiddenPSA;
        PSAHiding.sync(hiddenPSA);
        $.add(psa, btn);
        return $.rmClass(doc, 'hide-announcement');
      });
      return $.sync('hiddenPSA', PSAHiding.sync);
    },
    toggle: function() {
      var UTC;
      if ($.hasClass(this, 'hide-announcement')) {
        UTC = +$.id('globalMessage').dataset.utc;
        $.set('hiddenPSA', UTC);
      } else {
        $.event('CloseMenu');
        $["delete"]('hiddenPSA');
      }
      return PSAHiding.sync(UTC);
    },
    sync: function(UTC) {
      var psa, ref;
      psa = PSAHiding.psa;
      PSAHiding.hidden = PSAHiding.btn.hidden = (UTC != null) && UTC >= +psa.dataset.utc;
      if (PSAHiding.hidden) {
        $.rm(psa);
      } else {
        $.after($.id('globalToggle'), psa);
      }
      if ((ref = PSAHiding.hr) != null) {
        ref.hidden = PSAHiding.hidden;
      }
    }
  };

  return PSAHiding;

}).call(this);

RelativeDates = (function() {
  var RelativeDates,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  RelativeDates = {
    INTERVAL: $.MINUTE / 2,
    init: function() {
      var ref;
      if (((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Relative Post Dates'] && !Conf['Relative Date Title'] || g.VIEW === 'index' && Conf['JSON Index'] && g.BOARD.ID !== 'f') {
        this.flush();
        $.on(d, 'visibilitychange ThreadUpdate', this.flush);
      }
      if (Conf['Relative Post Dates']) {
        return Callbacks.Post.push({
          name: 'Relative Post Dates',
          cb: this.node
        });
      }
    },
    node: function() {
      var dateEl;
      dateEl = this.nodes.date;
      if (Conf['Relative Date Title']) {
        $.on(dateEl, 'mouseover', (function(_this) {
          return function() {
            return RelativeDates.hover(_this);
          };
        })(this));
        return;
      }
      if (this.isClone) {
        return;
      }
      dateEl.title = dateEl.textContent;
      return RelativeDates.update(this);
    },
    relative: function(diff, now, date) {
      var days, months, number, rounded, unit, years;
      unit = (number = diff / $.DAY) >= 1 ? (years = now.getYear() - date.getYear(), months = now.getMonth() - date.getMonth(), days = now.getDate() - date.getDate(), years > 1 ? (number = years - (months < 0 || months === 0 && days < 0), 'year') : years === 1 && (months > 0 || months === 0 && days >= 0) ? (number = years, 'year') : (months = months + 12 * years) > 1 ? (number = months - (days < 0), 'month') : months === 1 && days >= 0 ? (number = months, 'month') : 'day') : (number = diff / $.HOUR) >= 1 ? 'hour' : (number = diff / $.MINUTE) >= 1 ? 'minute' : (number = Math.max(0, diff) / $.SECOND, 'second');
      rounded = Math.round(number);
      if (rounded !== 1) {
        unit += 's';
      }
      return rounded + " " + unit + " ago";
    },
    stale: [],
    flush: function() {
      var data, i, len, now, ref;
      if (d.hidden) {
        return;
      }
      now = new Date();
      ref = RelativeDates.stale;
      for (i = 0, len = ref.length; i < len; i++) {
        data = ref[i];
        RelativeDates.update(data, now);
      }
      RelativeDates.stale = [];
      clearTimeout(RelativeDates.timeout);
      return RelativeDates.timeout = setTimeout(RelativeDates.flush, RelativeDates.INTERVAL);
    },
    hover: function(post) {
      var date, diff, now;
      date = post.info.date;
      now = new Date();
      diff = now - date;
      return post.nodes.date.title = RelativeDates.relative(diff, now, date);
    },
    update: function(data, now) {
      var date, diff, i, isPost, len, ref, relative, singlePost;
      isPost = data instanceof Post;
      date = isPost ? data.info.date : new Date(+data.dataset.utc);
      now || (now = new Date());
      diff = now - date;
      relative = RelativeDates.relative(diff, now, date);
      if (isPost) {
        ref = [data].concat(data.clones);
        for (i = 0, len = ref.length; i < len; i++) {
          singlePost = ref[i];
          singlePost.nodes.date.firstChild.textContent = relative;
        }
      } else {
        data.firstChild.textContent = relative;
      }
      return RelativeDates.setOwnTimeout(diff, data);
    },
    setOwnTimeout: function(diff, data) {
      var delay;
      delay = diff < $.MINUTE ? $.SECOND - (diff + $.SECOND / 2) % $.SECOND : diff < $.HOUR ? $.MINUTE - (diff + $.MINUTE / 2) % $.MINUTE : diff < $.DAY ? $.HOUR - (diff + $.HOUR / 2) % $.HOUR : $.DAY - (diff + $.DAY / 2) % $.DAY;
      return setTimeout(RelativeDates.markStale, delay, data);
    },
    markStale: function(data) {
      if (indexOf.call(RelativeDates.stale, data) >= 0) {
        return;
      }
      if (data instanceof Post && !g.posts[data.fullID]) {
        return;
      }
      return RelativeDates.stale.push(data);
    }
  };

  return RelativeDates;

}).call(this);

RemoveSpoilers = (function() {
  var RemoveSpoilers,
    slice = [].slice;

  RemoveSpoilers = {
    init: function() {
      if (Conf['Reveal Spoilers']) {
        $.addClass(doc, 'reveal-spoilers');
      }
      if (!Conf['Remove Spoilers']) {
        return;
      }
      Callbacks.Post.push({
        name: 'Reveal Spoilers',
        cb: this.node
      });
      Callbacks.CatalogThread.push({
        name: 'Reveal Spoilers',
        cb: this.node
      });
      if (g.VIEW === 'archive') {
        return $.ready(function() {
          return RemoveSpoilers.unspoiler($.id('arc-list'));
        });
      }
    },
    node: function() {
      return RemoveSpoilers.unspoiler(this.nodes.comment);
    },
    unspoiler: function(el) {
      var i, len, span, spoiler, spoilers;
      spoilers = $$('s', el);
      for (i = 0, len = spoilers.length; i < len; i++) {
        spoiler = spoilers[i];
        span = $.el('span', {
          className: 'removed-spoiler'
        });
        $.replace(spoiler, span);
        $.add(span, slice.call(spoiler.childNodes));
      }
    }
  };

  return RemoveSpoilers;

}).call(this);

Report = (function() {
  var Report;

  Report = {
    init: function() {
      var match;
      if (!(match = location.search.match(/\bno=(\d+)/))) {
        return;
      }
      Captcha.replace.init();
      this.postID = +match[1];
      return $.ready(this.ready);
    },
    ready: function() {
      var passAd, prev, ref;
      $.addStyle(CSS.report);
      if (Conf['Archive Report']) {
        Report.archive();
      }
      if ((passAd = $('a[href="https://www.4chan.org/pass"]'))) {
        $.extend(passAd, {
          textContent: 'Complain',
          href: 'https://www.4chan-x.net/captchas.html',
          tabIndex: -1
        });
        passAd.parentNode.normalize();
        if (((ref = (prev = passAd.previousSibling)) != null ? ref.nodeType : void 0) === Node.TEXT_NODE) {
          prev.nodeValue = prev.nodeValue.replace(/4chan Pass[^\.]*\./i, 'reCAPTCHA malfunctioning?');
        }
        $.after(passAd, [
          $.tn('] ['), $.el('a', {
            href: 'irc://irc.rizon.net/4chan',
            textContent: '4chan IRC',
            target: '_blank',
            tabIndex: -1
          })
        ]);
      }
      if (!Conf['Use Recaptcha v1 in Reports'] && !Conf['Force Noscript Captcha'] && Main.jsEnabled) {
        return new MutationObserver(function() {
          Report.fit('iframe[src^="https://www.google.com/recaptcha/api2/frame"]');
          return Report.fit('body');
        }).observe(d.body, {
          childList: true,
          attributes: true,
          subtree: true
        });
      } else {
        return Report.fit('body');
      }
    },
    fit: function(selector) {
      var dy, el;
      if (!((el = $(selector, doc)) && getComputedStyle(el).visibility !== 'hidden')) {
        return;
      }
      dy = el.getBoundingClientRect().bottom - doc.clientHeight + 8;
      if (dy > 0) {
        return window.resizeBy(0, dy);
      }
    },
    archive: function() {
      var link, message, types, url;
      Redirect.init();
      if (!(url = Redirect.to('report', {
        boardID: g.BOARD.ID,
        postID: Report.postID
      }))) {
        return;
      }
      if ((message = $('h3')) && /Report submitted!/.test(message.textContent)) {
        if (location.hash === '#redirect') {
          $.globalEval('self.close = function(){};');
          window.resizeTo(700, 475);
          location.replace(url);
        }
        return;
      }
      link = $.el('a', {
        href: url,
        textContent: 'Report to archive'
      });
      $.on(link, 'click', function(e) {
        if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0)) {
          return window.resizeTo(700, 475);
        }
      });
      $.add(d.body, [$.tn(' ['), link, $.tn(']')]);
      if (types = $.id('reportTypes')) {
        return $.on(types, 'change', function(e) {
          return $('form').action = e.target.value === 'illegal' ? '#redirect' : '';
        });
      }
    }
  };

  return Report;

}).call(this);

ThreadLinks = (function() {
  var ThreadLinks;

  ThreadLinks = {
    init: function() {
      if (!(g.VIEW === 'index' && Conf['Open Threads in New Tab'])) {
        return;
      }
      Callbacks.Post.push({
        name: 'Thread Links',
        cb: this.node
      });
      return Callbacks.CatalogThread.push({
        name: 'Thread Links',
        cb: this.catalogNode
      });
    },
    node: function() {
      if (this.isReply || this.isClone) {
        return;
      }
      return ThreadLinks.process(this.nodes.reply);
    },
    catalogNode: function() {
      return ThreadLinks.process(this.nodes.thumb.parentNode);
    },
    process: function(link) {
      return link.target = '_blank';
    }
  };

  return ThreadLinks;

}).call(this);

Time = (function() {
  var Time;

  Time = {
    init: function() {
      var ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Time Formatting'])) {
        return;
      }
      return Callbacks.Post.push({
        name: 'Time Formatting',
        cb: this.node
      });
    },
    node: function() {
      if (this.isClone) {
        return;
      }
      return this.nodes.date.textContent = Time.format(Conf['time'], this.info.date);
    },
    format: function(formatString, date) {
      return formatString.replace(/%(.)/g, function(s, c) {
        if (c in Time.formatters) {
          return Time.formatters[c].call(date);
        } else {
          return s;
        }
      });
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
        return this.getFullYear().toString().slice(2);
      },
      Y: function() {
        return this.getFullYear();
      },
      '%': function() {
        return '%';
      }
    }
  };

  return Time;

}).call(this);

Favicon = (function() {
  var Favicon;

  Favicon = {
    init: function() {
      return $.asap((function() {
        return d.head && (Favicon.el = $('link[rel="shortcut icon"]', d.head));
      }), Favicon.initAsap);
    },
    initAsap: function() {
      var href;
      Favicon.el.type = 'image/x-icon';
      href = Favicon.el.href;
      Favicon.SFW = /ws\.ico$/.test(href);
      Favicon["default"] = href;
      return Favicon["switch"]();
    },
    "switch": function() {
      var f, i, items, t;
      items = {
        ferongr: ['iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEX///9zBQC/AADpDAP/gID/q6voCwJJTwpOAAAAAXRSTlMAQObYZgAAAGJJREFUeF5Fi7ENg0AQBCfa/AFdDh2gdwPIogMK2E2+/xLslwOvdqRJhv+GQQPUCtJM7svankLrq/I+TY5e6Ueh1jyBMX7AFJi9vwfyVO4CbbO6jNYpp9GyVPbdkFhVgAQ2H0NOE5jk9DT8AAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVR42q1TOwrCQBB9s0FRtJI0WoqFtSLYegoP4gVSeJsUHsHSI3iFeIqRXXgwrhlXwYHHhLwPTB7B36abBCV+0pA4DUBQUNZYQptGtW3jtoKyxgoe0yrBCoyZfL/5ioQ3URZOXW9I341l3oo+NXEZiW4CEuIzvPECopED4OaZ3RNmeAm4u+a8Jr5f17VyVoL8fr8qcltzwlyyj2iqcgPOQ9ExkHAITgD75bYBe0A5S4H/P9htuWMF3QXoQpwaKeT+lnsC6JE5I6aq6fEAAAAASUVORK5CYII=', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEX///8AcH4AtswA2PJ55fKi6fIA1/FtpPADAAAAAXRSTlMAQObYZgAAAGJJREFUeF5Fi7ENg0AQBCfa/AFdDh2gdwPIogMK2E2+/xLslwOvdqRJhv+GQQPUCtJM7svankLrq/I+TY5e6Ueh1jyBMX7AFJi9vwfyVO4CbbO6jNYpp9GyVPbdkFhVgAQ2H0NOE5jk9DT8AAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxElEQVQ4y2NgoBq4/vE/HJOsBiRQUIfA2AzBqQYqUfn00/9FLz+BaQxDCKqBmX7jExijKEDSDJPHrnnbGQhGV4RmOFwdVkNwhQMheYwQxhaIi7b9Z9A3gWAQm2BUoQOgRhgA8o7j1ozLC4LCyAZcx6kZI5qg4kLKqggDFFWxJySsUQVzlb4pwgAJaTRvokcVNgOqOv8zcHBCsL07DgNg8YsczzA5MxtUL+DMD8g0slxI/H8GQ/P/DJKyeKIRpglXZsIiBwBhP5O+VbI/JgAAAABJRU5ErkJggg==', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEX///8oeQBJ3ABV/wHM/7Lu/+ZU/gAqUP3dAAAAAXRSTlMAQObYZgAAAGJJREFUeF5Fi7ENg0AQBCfa/AFdDh2gdwPIogMK2E2+/xLslwOvdqRJhv+GQQPUCtJM7svankLrq/I+TY5e6Ueh1jyBMX7AFJi9vwfyVO4CbbO6jNYpp9GyVPbdkFhVgAQ2H0NOE5jk9DT8AAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAx0lEQVQ4y2NgoBYI+cfwH4ZJVgMS0KhEYGyG4FQDkzjzf9P/d/+fgWl0QwiqgSkI/c8IxsgKkDXD5LFq9rwDweiK0A2HqcNqCK5wICSPEcLYAtH+AMN/IXMIBrEJRie6OEgjDAC5x3FqxuUFNiEUA67j1IweTTBxBQ1puAG86jgSEraogskJWSBcwCGF5k30qMJmgMFEhv/MXBAs5oLDAFj8IsczTE7UEeECbhU8+QGZRpaTi2b4L2zF8J9TGk80wjThykzY5AAW/2O1C2mIbgAAAABJRU5ErkJggg=='],
        'xat-': ['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'],
        Mayhem: ['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'],
        '4chanJS': ['iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEUBAAAAAAD/AABnZ2f///8nFk05AAAAAXRSTlMAQObYZgAAAEFJREFUeNqNjgEKACAMAjvX/98cAkkxgmSgO8Bt/Ai4ApJ6KKhzF3OiEMDASrGB/QWgPEHsUpN+Ng9xAETMYhDrWmeHAMcmvycWAAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEUBAAAAAAD/AAD///9nZ2f77Y6hAAAAAXRSTlMAQObYZgAAAEBJREFUeF6NjQEKACAMAnfW/98cAxFiBIngOsTqR8B1IGkeG9p5i7XabgAGZNigXgA8aoCUxvzWAIcBItGiSEwdccYA3BuRAWkAAAAASUVORK5CYII=', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEUBAAAAAAAul8NnZ2f////82iC9AAAAAXRSTlMAQObYZgAAAEFJREFUeNqNjgEKACAMAjvX/98cAkkxgmSgO8Bt/Ai4ApJ6KKhzF3OiEMDASrGB/QWgPEHsUpN+Ng9xAETMYhDrWmeHAMcmvycWAAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEUBAAAAAAAul8P///9nZ2cgIeMlAAAAAXRSTlMAQObYZgAAAEBJREFUeF6NjQEKACAMAnfW/98cAxFiBIngOsTqR8B1IGkeG9p5i7XabgAGZNigXgA8aoCUxvzWAIcBItGiSEwdccYA3BuRAWkAAAAASUVORK5CYII=', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAElBMVEUBAAAAAABmzDNlyjJnZ2f///+6o7dfAAAAAXRSTlMAQObYZgAAAERJREFUeF6NjkEKADEIA51o///lJZfQxUsHITogWi8AvwZJuxmYa25xDooBLEwOWFTYAsYVhdorLZt9Ng9xCUTCUCQ2H3F4ANrZ2WNiAAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAElBMVEUBAAAAAABmzDP///9lyjJnZ2cIHys9AAAAAXRSTlMAQObYZgAAAENJREFUeF6NjUEKwEAMAjNm9/9fLkEslFwqgjoEUn8EfAqSdrkwzj6ieyyTkQEVGWRvANfO1iEX620AjgBEwqR4Y+sBeGAA6d+vQ4IAAAAASUVORK5CYII='],
        Original: ['iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX/////AAD///8AAABBZmS3AAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII=', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAhElEQVR42q1RwQnAMAjMu5M4guAKXa4j5dUROo5tipSDcrFChUONd0di2m/hEGVOHDyIPufgwAFASDkpoSzmBrkJ2UMyR9LsJ3rvrqo3Rt1YMIMhhNnOxLMnoMFBxHyJAr2IOBFzA8U+6pLBdmEJTA0aMVjpDd6Loks0s5HZNwYx8tfZCZ0kll7ORffZAAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX///8ul8P///8AAACaqgkzAAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII=', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAALVBMVEUAAAAAAAAAAAAAAAABBQcHFx4KISoNLToaVW4oKCgul8M4ODg7OzvBwcH///8uS/CdAAAAA3RSTlMAx9dmesIgAAAAV0lEQVR42m2NWw6AIBAD1eILZO5/XI0UAgm7H9tOsu0yGWAQSOoFijHOxOANGqm/LczpOaXs4gISrPZ+gc2+hO5w2xdwgOjBFUIF+sEJrhUl9JFr+badFwR+BfqlmGUJAAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX///9mzDP///8AAACT0n1lAAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII=', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAALVBMVEUAAAAAAAAAAAAAAAAECAIQIAgWLAsePA8oKCg4ODg6dB07OztmzDPBwcH///+rsf3XAAAAA3RSTlMAx9dmesIgAAAAV0lEQVR42m2NWw6AIBAD1eIDhbn/cTVSCCTsfmw7ybbLZIBBIKkXKKU0E4M3aKT+tjCn5xiziwuIsNr7BTb7ErrDZV/AAaIHdwgV6AcnuFaU0Eeu5dt2XiUyBjCQ2bIrAAAAAElFTkSuQmCC'],
        'Metro': ['iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAC/AABrZQDiAAAAAXRSTlMAQObYZgAAABJJREFUCB1jZGBgrMNAQEEc4gCSfAX5bRw/NQAAAABJRU5ErkJggg==', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUAAAAAAAAAAAAHAAAdAAApAAAsAAA4AABsAACQAAC/AAD///9SVhtjAAAAA3RSTlMAPse+s4iwAAAAM0lEQVQIW2NggAGuVasWgDBpDDAQUoSaob0Jao73lgVojOitUEazBZRRvR3KmJa5AO4KAGBtLuMAuhIIAAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAA1/GhpCidAAAAAXRSTlMAQObYZgAAABJJREFUCB1jZGBgrMNAQEEc4gCSfAX5bRw/NQAAAABJRU5ErkJggg==', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUAAAAAAAAAAAAACAkAISUALzQAMTcAQEcAeokAorYA1/H///8BrzTFAAAAA3RSTlMAPse+s4iwAAAAM0lEQVQIW2NggAGuVasWgDBpDDAQUoSaob0Jao73lgVojOitUEazBZRRvR3KmJa5AO4KAGBtLuMAuhIIAAAAAElFTkSuQmCC', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAABV/wErM5hwAAAAAXRSTlMAQObYZgAAABJJREFUCB1jZGBgrMNAQEEc4gCSfAX5bRw/NQAAAABJRU5ErkJggg==', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUAAAAAAAAAAAADCgANKAASOAATOwAZTAAwkQBAwQBV/wH////+Fmy4AAAAA3RSTlMAPse+s4iwAAAAM0lEQVQIW2NggAGuVasWgDBpDDAQUoSaob0Jao73lgVojOitUEazBZRRvR3KmJa5AO4KAGBtLuMAuhIIAAAAAElFTkSuQmCC']
      }[Conf['favicon']];
      f = Favicon;
      t = 'data:image/png;base64,';
      i = 0;
      while (items[i]) {
        items[i] = t + items[i++];
      }
      f.unreadDead = items[0], f.unreadDeadY = items[1], f.unreadSFW = items[2], f.unreadSFWY = items[3], f.unreadNSFW = items[4], f.unreadNSFWY = items[5];
      return f.update();
    },
    update: function() {
      if (this.SFW) {
        this.unread = this.unreadSFW;
        return this.unreadY = this.unreadSFWY;
      } else {
        this.unread = this.unreadNSFW;
        return this.unreadY = this.unreadNSFWY;
      }
    },
    dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAgMAAAC+UIlYAAAACVBMVEUAAGcAAABmzDNZt9VtAAAAAXRSTlMAQObYZgAAAGlJREFUWMPtlkEKADEIA/tJP9lXLttQto2yHxgDHozTi0ToGK2WKZZ+HAQQMZc+xBwI4EZ+wAC2IfPuSIDOZJrSZQEAX9eVJhhwIuUYAnQe8rhAEMAZlTI2MID9f5Clyh0JeE1V1ZEAvB4qDfwuJTSGRAAAAABJRU5ErkJggg=='
  };

  return Favicon;

}).call(this);

MarkNewIPs = (function() {
  var MarkNewIPs;

  MarkNewIPs = {
    init: function() {
      if (g.VIEW !== 'thread' || !Conf['Mark New IPs']) {
        return;
      }
      return Callbacks.Thread.push({
        name: 'Mark New IPs',
        cb: this.node
      });
    },
    node: function() {
      MarkNewIPs.ipCount = this.ipCount;
      MarkNewIPs.postCount = this.posts.keys.length;
      return $.on(d, 'ThreadUpdate', MarkNewIPs.onUpdate);
    },
    onUpdate: function(e) {
      var deletedPosts, fullID, i, ipCount, j, k, len, len1, newPosts, postCount, ref;
      ref = e.detail, ipCount = ref.ipCount, postCount = ref.postCount, newPosts = ref.newPosts, deletedPosts = ref.deletedPosts;
      if (ipCount == null) {
        return;
      }
      switch (ipCount - MarkNewIPs.ipCount) {
        case postCount - MarkNewIPs.postCount + deletedPosts.length:
          i = MarkNewIPs.ipCount;
          for (j = 0, len = newPosts.length; j < len; j++) {
            fullID = newPosts[j];
            MarkNewIPs.markNew(g.posts[fullID], ++i);
          }
          break;
        case -deletedPosts.length:
          for (k = 0, len1 = newPosts.length; k < len1; k++) {
            fullID = newPosts[k];
            MarkNewIPs.markOld(g.posts[fullID]);
          }
      }
      MarkNewIPs.ipCount = ipCount;
      return MarkNewIPs.postCount = postCount;
    },
    markNew: function(post, ipCount) {
      var counter, suffix;
      suffix = (Math.floor(ipCount / 10)) % 10 === 1 ? 'th' : ['st', 'nd', 'rd'][ipCount % 10 - 1] || 'th';
      counter = $.el('span', {
        className: 'ip-counter',
        textContent: "(" + ipCount + ")"
      });
      post.nodes.nameBlock.title = "This is the " + ipCount + suffix + " IP in the thread.";
      $.add(post.nodes.nameBlock, [$.tn(' '), counter]);
      return $.addClass(post.nodes.root, 'new-ip');
    },
    markOld: function(post) {
      post.nodes.nameBlock.title = 'Not the first post from this IP.';
      return $.addClass(post.nodes.root, 'old-ip');
    }
  };

  return MarkNewIPs;

}).call(this);

ReplyPruning = (function() {
  var ReplyPruning;

  ReplyPruning = {
    init: function() {
      var el, label;
      if (!(g.VIEW === 'thread' && Conf['Reply Pruning'])) {
        return;
      }
      this.active = !(Conf['Quote Threading'] && Conf['Thread Quotes']);
      this.container = $.frag();
      this.summary = $.el('span', {
        hidden: true,
        className: 'summary'
      });
      this.summary.style.cursor = 'pointer';
      $.on(this.summary, 'click', (function(_this) {
        return function() {
          _this.inputs.enabled.checked = !_this.inputs.enabled.checked;
          return $.event('change', null, _this.inputs.enabled);
        };
      })(this));
      label = UI.checkbox('Prune Replies', 'Show Last', this.active);
      el = $.el('span', {
        title: 'Maximum number of replies to show.'
      }, {
        innerHTML: " <input type=\"number\" name=\"Max Replies\" min=\"0\" step=\"1\" value=\"" + E(Conf["Max Replies"]) + "\" class=\"field\">"
      });
      $.prepend(el, label);
      this.inputs = {
        enabled: label.firstElementChild,
        replies: el.lastElementChild
      };
      $.on(this.inputs.enabled, 'change', this.setEnabled);
      $.on(this.inputs.replies, 'change', $.cb.value);
      Header.menu.addEntry({
        el: el,
        order: 190
      });
      return Callbacks.Thread.push({
        name: 'Reply Pruning',
        cb: this.node
      });
    },
    position: 0,
    hidden: 0,
    hiddenFiles: 0,
    total: 0,
    totalFiles: 0,
    setEnabled: function() {
      var other;
      other = QuoteThreading.input;
      if (this.checked && (other != null ? other.checked : void 0)) {
        other.checked = false;
        $.event('change', null, other);
      }
      return ReplyPruning.active = this.checked;
    },
    showIfHidden: function(id) {
      var ref;
      if ((ref = ReplyPruning.container) != null ? ref.getElementById(id) : void 0) {
        ReplyPruning.inputs.enabled.checked = false;
        return $.event('change', null, ReplyPruning.inputs.enabled);
      }
    },
    node: function() {
      var ref;
      ReplyPruning.thread = this;
      this.posts.forEach(function(post) {
        if (post.isReply) {
          ReplyPruning.total++;
          if (post.file) {
            return ReplyPruning.totalFiles++;
          }
        }
      });
      if (ReplyPruning.active && /^#p\d+$/.test(location.hash) && (0 <= (ref = this.posts.keys.indexOf(location.hash.slice(2))) && ref < 1 + Math.max(ReplyPruning.total - +Conf["Max Replies"], 0))) {
        ReplyPruning.active = ReplyPruning.inputs.enabled.checked = false;
      }
      $.after(this.OP.nodes.root, ReplyPruning.summary);
      $.on(ReplyPruning.inputs.enabled, 'change', ReplyPruning.update);
      $.on(ReplyPruning.inputs.replies, 'change', ReplyPruning.update);
      $.on(d, 'ThreadUpdate', ReplyPruning.updateCount);
      $.on(d, 'ThreadUpdate', ReplyPruning.update);
      return ReplyPruning.update();
    },
    updateCount: function(e) {
      var fullID, i, len, ref;
      if (e.detail[404]) {
        return;
      }
      ref = e.detail.newPosts;
      for (i = 0, len = ref.length; i < len; i++) {
        fullID = ref[i];
        ReplyPruning.total++;
        if (g.posts[fullID].file) {
          ReplyPruning.totalFiles++;
        }
      }
    },
    update: function() {
      var boardTop, frag, hidden1, hidden2, oldPos, post, posts;
      hidden1 = ReplyPruning.hidden;
      hidden2 = ReplyPruning.active ? Math.max(ReplyPruning.total - +Conf["Max Replies"], 0) : 0;
      oldPos = d.body.clientHeight - window.scrollY;
      posts = ReplyPruning.thread.posts;
      if (ReplyPruning.hidden < hidden2) {
        while (ReplyPruning.hidden < hidden2 && ReplyPruning.position < posts.keys.length) {
          post = posts[posts.keys[ReplyPruning.position++]];
          if (post.isReply && !post.isFetchedQuote) {
            $.add(ReplyPruning.container, post.nodes.root);
            ReplyPruning.hidden++;
            if (post.file) {
              ReplyPruning.hiddenFiles++;
            }
          }
        }
      } else if (ReplyPruning.hidden > hidden2) {
        frag = $.frag();
        while (ReplyPruning.hidden > hidden2 && ReplyPruning.position > 0) {
          post = posts[posts.keys[--ReplyPruning.position]];
          if (post.isReply && !post.isFetchedQuote) {
            $.prepend(frag, post.nodes.root);
            ReplyPruning.hidden--;
            if (post.file) {
              ReplyPruning.hiddenFiles--;
            }
          }
        }
        $.after(ReplyPruning.summary, frag);
        $.event('PostsInserted');
      }
      ReplyPruning.summary.textContent = ReplyPruning.active ? Build.summaryText('+', ReplyPruning.hidden, ReplyPruning.hiddenFiles) : Build.summaryText('-', ReplyPruning.total, ReplyPruning.totalFiles);
      ReplyPruning.summary.hidden = ReplyPruning.total <= +Conf["Max Replies"];
      if (hidden1 !== hidden2 && (boardTop = Header.getTopOf($('.board'))) < 0) {
        return window.scrollBy(0, Math.max(d.body.clientHeight - oldPos, window.scrollY + boardTop) - window.scrollY);
      }
    }
  };

  return ReplyPruning;

}).call(this);

ThreadExcerpt = (function() {
  var ThreadExcerpt;

  ThreadExcerpt = {
    init: function() {
      if (g.BOARD.ID !== 'f' || g.VIEW !== 'thread' || !Conf['Thread Excerpt']) {
        return;
      }
      return Callbacks.Thread.push({
        name: 'Thread Excerpt',
        cb: this.node
      });
    },
    node: function() {
      return d.title = Get.threadExcerpt(this);
    }
  };

  return ThreadExcerpt;

}).call(this);

ThreadStats = (function() {
  var ThreadStats;

  ThreadStats = {
    init: function() {
      var sc, statsHTML, statsTitle;
      if (g.VIEW !== 'thread' || !Conf['Thread Stats']) {
        return;
      }
      statsHTML = {
        innerHTML: "<span id=\"post-count\">?</span> / <span id=\"file-count\">?</span>" + ((Conf["IP Count in Stats"]) ? " / <span id=\"ip-count\">?</span>" : "") + ((Conf["Page Count in Stats"]) ? " / <span id=\"page-count\">?</span>" : "")
      };
      statsTitle = 'Posts / Files';
      if (Conf['IP Count in Stats']) {
        statsTitle += ' / IPs';
      }
      if (Conf['Page Count in Stats']) {
        statsTitle += (g.BOARD.ID === 'f' ? ' / Purge Position' : ' / Page');
      }
      if (Conf['Updater and Stats in Header']) {
        this.dialog = sc = $.el('span', {
          id: 'thread-stats',
          title: statsTitle
        });
        $.extend(sc, statsHTML);
        Header.addShortcut(sc, 200);
      } else {
        this.dialog = sc = UI.dialog('thread-stats', 'bottom: 0px; right: 0px;', {
          innerHTML: "<div class=\"move\" title=\"" + E(statsTitle) + "\">" + (statsHTML).innerHTML + "</div>"
        });
        $.addClass(doc, 'float');
        $.ready(function() {
          return $.add(d.body, sc);
        });
      }
      this.postCountEl = $('#post-count', sc);
      this.fileCountEl = $('#file-count', sc);
      this.ipCountEl = $('#ip-count', sc);
      this.pageCountEl = $('#page-count', sc);
      if (this.pageCountEl) {
        $.on(this.pageCountEl, 'click', ThreadStats.fetchPage);
      }
      return Callbacks.Thread.push({
        name: 'Thread Stats',
        cb: this.node
      });
    },
    node: function() {
      var fileCount, postCount;
      postCount = 0;
      fileCount = 0;
      this.posts.forEach(function(post) {
        postCount++;
        if (post.file) {
          fileCount++;
        }
        if (ThreadStats.pageCountEl) {
          return ThreadStats.lastPost = post.info.date;
        }
      });
      ThreadStats.thread = this;
      ThreadStats.fetchPage();
      ThreadStats.update(postCount, fileCount, this.ipCount);
      return $.on(d, 'ThreadUpdate', ThreadStats.onUpdate);
    },
    onUpdate: function(e) {
      var fileCount, ipCount, newPosts, postCount, ref, ref1;
      if (e.detail[404]) {
        return;
      }
      ref = e.detail, postCount = ref.postCount, fileCount = ref.fileCount, ipCount = ref.ipCount, newPosts = ref.newPosts;
      ThreadStats.update(postCount, fileCount, ipCount);
      if (!ThreadStats.pageCountEl) {
        return;
      }
      if (newPosts.length) {
        ThreadStats.lastPost = g.posts[newPosts[newPosts.length - 1]].info.date;
      }
      if (g.BOARD.ID !== 'f' && ((ref1 = ThreadStats.pageCountEl) != null ? ref1.textContent : void 0) !== '1') {
        return ThreadStats.fetchPage();
      }
    },
    update: function(postCount, fileCount, ipCount) {
      var fileCountEl, ipCountEl, postCountEl, thread;
      thread = ThreadStats.thread, postCountEl = ThreadStats.postCountEl, fileCountEl = ThreadStats.fileCountEl, ipCountEl = ThreadStats.ipCountEl;
      postCountEl.textContent = postCount;
      fileCountEl.textContent = fileCount;
      if ((ipCount != null) && ipCountEl) {
        ipCountEl.textContent = ipCount;
      }
      (thread.postLimit && !thread.isSticky ? $.addClass : $.rmClass)(postCountEl, 'warning');
      return (thread.fileLimit && !thread.isSticky ? $.addClass : $.rmClass)(fileCountEl, 'warning');
    },
    fetchPage: function() {
      if (!ThreadStats.pageCountEl) {
        return;
      }
      clearTimeout(ThreadStats.timeout);
      if (ThreadStats.thread.isDead) {
        ThreadStats.pageCountEl.textContent = 'Dead';
        $.addClass(ThreadStats.pageCountEl, 'warning');
        return;
      }
      ThreadStats.timeout = setTimeout(ThreadStats.fetchPage, 2 * $.MINUTE);
      return $.ajax("//a.4cdn.org/" + ThreadStats.thread.board + "/threads.json", {
        onload: ThreadStats.onThreadsLoad
      }, {
        whenModified: 'ThreadStats'
      });
    },
    onThreadsLoad: function() {
      var i, j, k, len, len1, len2, page, purgePos, ref, ref1, ref2, thread;
      if (this.status === 200) {
        ref = this.response;
        for (i = 0, len = ref.length; i < len; i++) {
          page = ref[i];
          if (g.BOARD.ID === 'f') {
            purgePos = 1;
            ref1 = page.threads;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              thread = ref1[j];
              if (thread.no < ThreadStats.thread.ID) {
                purgePos++;
              }
            }
            ThreadStats.pageCountEl.textContent = purgePos;
          } else {
            ref2 = page.threads;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              thread = ref2[k];
              if (!(thread.no === ThreadStats.thread.ID)) {
                continue;
              }
              ThreadStats.pageCountEl.textContent = page.page;
              (page.page === this.response.length ? $.addClass : $.rmClass)(ThreadStats.pageCountEl, 'warning');
              ThreadStats.lastPageUpdate = new Date(thread.last_modified * $.SECOND);
              ThreadStats.retry();
              return;
            }
          }
        }
      } else if (this.status === 304) {
        return ThreadStats.retry();
      }
    },
    retry: function() {
      var ref;
      if (g.BOARD.ID !== 'f' && ThreadStats.lastPost > ThreadStats.lastPageUpdate && ((ref = ThreadStats.pageCountEl) != null ? ref.textContent : void 0) !== '1') {
        clearTimeout(ThreadStats.timeout);
        return ThreadStats.timeout = setTimeout(ThreadStats.fetchPage, 5 * $.SECOND);
      }
    }
  };

  return ThreadStats;

}).call(this);

ThreadUpdater = (function() {
  var ThreadUpdater,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ThreadUpdater = {
    init: function() {
      var conf, el, input, name, ref, sc, subEntries, updateLink;
      if (g.VIEW !== 'thread' || !Conf['Thread Updater']) {
        return;
      }
      this.audio = $.el('audio');
      if ($.engine !== 'gecko') {
        this.audio.src = this.beep;
      }
      if (Conf['Updater and Stats in Header']) {
        this.dialog = sc = $.el('span', {
          id: 'updater'
        });
        $.extend(sc, {
          innerHTML: "<span id=\"update-status\" class=\"empty\"></span><span id=\"update-timer\" class=\"empty\" title=\"Update now\"></span>"
        });
        Header.addShortcut(sc, 100);
      } else {
        this.dialog = sc = UI.dialog('updater', 'bottom: 0px; left: 0px;', {
          innerHTML: "<div class=\"move\"></div><span id=\"update-status\"></span><span id=\"update-timer\" title=\"Update now\"></span>"
        });
        $.addClass(doc, 'float');
        $.ready(function() {
          return $.add(d.body, sc);
        });
      }
      this.checkPostCount = 0;
      this.timer = $('#update-timer', sc);
      this.status = $('#update-status', sc);
      $.on(this.timer, 'click', this.update);
      $.on(this.status, 'click', this.update);
      updateLink = $.el('span', {
        className: 'brackets-wrap updatelink'
      });
      $.extend(updateLink, {
        innerHTML: "<a href=\"javascript:;\">Update</a>"
      });
      Main.ready(function() {
        var navLinksBot;
        if ((navLinksBot = $('.navLinksBot'))) {
          return $.add(navLinksBot, [$.tn(' '), updateLink]);
        }
      });
      $.on(updateLink.firstElementChild, 'click', this.update);
      subEntries = [];
      ref = Config.updater.checkbox;
      for (name in ref) {
        conf = ref[name];
        el = UI.checkbox(name, name);
        el.title = conf[1];
        input = el.firstElementChild;
        $.on(input, 'change', $.cb.checked);
        if (input.name === 'Scroll BG') {
          $.on(input, 'change', this.cb.scrollBG);
          this.cb.scrollBG();
        } else if (input.name === 'Auto Update') {
          $.on(input, 'change', this.setInterval);
        }
        subEntries.push({
          el: el
        });
      }
      this.settings = $.el('span', {
        innerHTML: "<a href=\"javascript:;\">Interval</a>"
      });
      $.on(this.settings, 'click', this.intervalShortcut);
      subEntries.push({
        el: this.settings
      });
      Header.menu.addEntry(this.entry = {
        el: $.el('span', {
          textContent: 'Updater'
        }),
        order: 110,
        subEntries: subEntries
      });
      return Callbacks.Thread.push({
        name: 'Thread Updater',
        cb: this.node
      });
    },
    node: function() {
      ThreadUpdater.thread = this;
      ThreadUpdater.root = this.OP.nodes.root.parentNode;
      ThreadUpdater.outdateCount = 0;
      ThreadUpdater.postIDs = [];
      ThreadUpdater.fileIDs = [];
      this.posts.forEach(function(post) {
        ThreadUpdater.postIDs.push(post.ID);
        if (post.file) {
          return ThreadUpdater.fileIDs.push(post.ID);
        }
      });
      ThreadUpdater.cb.interval.call($.el('input', {
        value: Conf['Interval']
      }));
      $.on(d, 'QRPostSuccessful', ThreadUpdater.cb.checkpost);
      $.on(d, 'visibilitychange', ThreadUpdater.cb.visibility);
      return ThreadUpdater.setInterval();
    },

    /*
    http://freesound.org/people/pierrecartoons1979/sounds/90112/
    cc-by-nc-3.0
     */
    beep: 'data:audio/wav;base64,UklGRjQDAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAc21wbDwAAABBAAADAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkYXRhzAIAAGMms8em0tleMV4zIpLVo8nhfSlcPR102Ki+5JspVEkdVtKzs+K1NEhUIT7DwKrcy0g6WygsrM2k1NpiLl0zIY/WpMrjgCdbPhxw2Kq+5Z4qUkkdU9K1s+K5NkVTITzBwqnczko3WikrqM+l1NxlLF0zIIvXpsnjgydZPhxs2ay95aIrUEkdUdC3suK8N0NUIjq+xKrcz002WioppdGm091pK1w0IIjYp8jkhydXPxxq2K295aUrTkoeTs65suK+OUFUIzi7xqrb0VA0WSoootKm0t5tKlo1H4TYqMfkiydWQBxm16+85actTEseS8y7seHAPD9TIza5yKra01QyWSson9On0d5wKVk2H4DYqcfkjidUQB1j1rG75KsvSkseScu8seDCPz1TJDW2yara1FYxWSwnm9Sn0N9zKVg2H33ZqsXkkihSQR1g1bK65K0wSEsfR8i+seDEQTxUJTOzy6rY1VowWC0mmNWoz993KVc3H3rYq8TklSlRQh1d1LS647AyR0wgRMbAsN/GRDpTJTKwzKrX1l4vVy4lldWpzt97KVY4IXbUr8LZljVPRCxhw7W3z6ZISkw1VK+4sMWvXEhSPk6buay9sm5JVkZNiLWqtrJ+TldNTnquqbCwilZXU1BwpKirrpNgWFhTaZmnpquZbFlbVmWOpaOonHZcXlljhaGhpZ1+YWBdYn2cn6GdhmdhYGN3lp2enIttY2Jjco+bnJuOdGZlZXCImJqakHpoZ2Zug5WYmZJ/bGlobX6RlpeSg3BqaW16jZSVkoZ0bGtteImSk5KIeG5tbnaFkJKRinxxbm91gY2QkIt/c3BwdH6Kj4+LgnZxcXR8iI2OjIR5c3J0e4WLjYuFe3VzdHmCioyLhn52dHR5gIiKioeAeHV1eH+GiYqHgXp2dnh9hIiJh4J8eHd4fIKHiIeDfXl4eHyBhoeHhH96eHmA',
    playBeep: function() {
      var audio;
      audio = ThreadUpdater.audio;
      audio.src || (audio.src = ThreadUpdater.beep);
      if (audio.paused) {
        return audio.play();
      } else {
        return $.one(audio, 'ended', ThreadUpdater.playBeep);
      }
    },
    cb: {
      checkpost: function(e) {
        if (e.detail.threadID !== ThreadUpdater.thread.ID) {
          return;
        }
        ThreadUpdater.postID = e.detail.postID;
        ThreadUpdater.checkPostCount = 0;
        ThreadUpdater.outdateCount = 0;
        return ThreadUpdater.setInterval();
      },
      visibility: function() {
        if (d.hidden) {
          return;
        }
        ThreadUpdater.outdateCount = 0;
        if (ThreadUpdater.seconds > ThreadUpdater.interval) {
          return ThreadUpdater.setInterval();
        }
      },
      scrollBG: function() {
        return ThreadUpdater.scrollBG = Conf['Scroll BG'] ? function() {
          return true;
        } : function() {
          return !d.hidden;
        };
      },
      interval: function(e) {
        var val;
        val = parseInt(this.value, 10);
        if (val < 1) {
          val = 1;
        }
        ThreadUpdater.interval = this.value = val;
        if (e) {
          return $.cb.value.call(this);
        }
      },
      load: function() {
        var req;
        req = ThreadUpdater.req;
        switch (req.status) {
          case 200:
            ThreadUpdater.parse(req);
            if (ThreadUpdater.thread.isArchived) {
              return ThreadUpdater.kill();
            } else {
              return ThreadUpdater.setInterval();
            }
            break;
          case 404:
            return $.ajax("//a.4cdn.org/" + ThreadUpdater.thread.board + "/catalog.json", {
              onloadend: function() {
                var confirmed, i, k, len, len1, page, ref, ref1, thread;
                if (this.status === 200) {
                  confirmed = true;
                  ref = this.response;
                  for (i = 0, len = ref.length; i < len; i++) {
                    page = ref[i];
                    ref1 = page.threads;
                    for (k = 0, len1 = ref1.length; k < len1; k++) {
                      thread = ref1[k];
                      if (thread.no === ThreadUpdater.thread.ID) {
                        confirmed = false;
                        break;
                      }
                    }
                  }
                } else {
                  confirmed = false;
                }
                if (confirmed) {
                  return ThreadUpdater.kill();
                } else {
                  return ThreadUpdater.error(req);
                }
              }
            });
          default:
            return ThreadUpdater.error(req);
        }
      }
    },
    kill: function() {
      ThreadUpdater.thread.kill();
      ThreadUpdater.setInterval();
      return $.event('ThreadUpdate', {
        404: true,
        threadID: ThreadUpdater.thread.fullID
      });
    },
    error: function(req) {
      if (req.status === 304) {
        ThreadUpdater.set('status', '');
      }
      ThreadUpdater.setInterval();
      if (!req.status) {
        return ThreadUpdater.set('status', 'Connection Error', 'warning');
      } else if (req.status !== 304) {
        return ThreadUpdater.set('status', req.statusText + " (" + req.status + ")", 'warning');
      }
    },
    setInterval: function() {
      var cur, interval, j, limit;
      clearTimeout(ThreadUpdater.timeoutID);
      if (ThreadUpdater.thread.isDead) {
        ThreadUpdater.set('status', (ThreadUpdater.thread.isArchived ? 'Archived' : '404'), 'warning');
        ThreadUpdater.set('timer', '');
        return;
      }
      if (ThreadUpdater.postID && ThreadUpdater.checkPostCount < 5) {
        ThreadUpdater.set('timer', '...', 'loading');
        ThreadUpdater.timeoutID = setTimeout(ThreadUpdater.update, ++ThreadUpdater.checkPostCount * $.SECOND);
        return;
      }
      if (!Conf['Auto Update']) {
        ThreadUpdater.set('timer', 'Update');
        return;
      }
      interval = ThreadUpdater.interval;
      if (Conf['Optional Increase']) {
        limit = d.hidden ? 10 : 5;
        j = Math.min(ThreadUpdater.outdateCount, limit);
        cur = (Math.floor(interval * 0.1) || 1) * j * j;
        ThreadUpdater.seconds = $.minmax(cur, interval, 300);
      } else {
        ThreadUpdater.seconds = interval;
      }
      return ThreadUpdater.timeout();
    },
    intervalShortcut: function() {
      var settings;
      Settings.open('Advanced');
      settings = $.id('fourchanx-settings');
      return $('input[name=Interval]', settings).focus();
    },
    set: function(name, text, klass) {
      var el, node;
      el = ThreadUpdater[name];
      if (node = el.firstChild) {
        node.data = text;
      } else {
        el.textContent = text;
      }
      return el.className = klass != null ? klass : (text === '' ? 'empty' : '');
    },
    timeout: function() {
      if (ThreadUpdater.seconds) {
        ThreadUpdater.set('timer', ThreadUpdater.seconds);
        ThreadUpdater.timeoutID = setTimeout(ThreadUpdater.timeout, 1000);
      } else {
        ThreadUpdater.outdateCount++;
        ThreadUpdater.update();
      }
      return ThreadUpdater.seconds--;
    },
    update: function() {
      var ref;
      clearTimeout(ThreadUpdater.timeoutID);
      ThreadUpdater.set('timer', '...', 'loading');
      if ((ref = ThreadUpdater.req) != null) {
        ref.abort();
      }
      return ThreadUpdater.req = $.ajax("//a.4cdn.org/" + ThreadUpdater.thread.board + "/thread/" + ThreadUpdater.thread + ".json", {
        onloadend: ThreadUpdater.cb.load,
        timeout: $.MINUTE
      }, {
        whenModified: 'ThreadUpdater'
      });
    },
    updateThreadStatus: function(type, status) {
      var change, hasChanged;
      if (!(hasChanged = ThreadUpdater.thread["is" + type] !== status)) {
        return;
      }
      ThreadUpdater.thread.setStatus(type, status);
      if (type === 'Closed' && ThreadUpdater.thread.isArchived) {
        return;
      }
      change = type === 'Sticky' ? status ? 'now a sticky' : 'not a sticky anymore' : status ? 'now closed' : 'not closed anymore';
      return new Notice('info', "The thread is " + change + ".", 30);
    },
    parse: function(req) {
      var ID, OP, board, deletedFiles, deletedPosts, files, firstPost, i, index, ipCountEl, k, l, lastPost, len, len1, len2, len3, m, newPosts, node, post, postObject, postObjects, posts, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, scroll, thread, unreadCount, unreadQYCount;
      postObjects = req.response.posts;
      OP = postObjects[0];
      thread = ThreadUpdater.thread;
      board = thread.board;
      ref = ThreadUpdater.postIDs, lastPost = ref[ref.length - 1];
      if (postObjects[postObjects.length - 1].no < lastPost && new Date(req.getResponseHeader('Last-Modified')) - thread.posts[lastPost].info.date < 30 * $.SECOND) {
        return;
      }
      Build.spoilerRange[board] = OP.custom_spoiler;
      thread.setStatus('Archived', !!OP.archived);
      ThreadUpdater.updateThreadStatus('Sticky', !!OP.sticky);
      ThreadUpdater.updateThreadStatus('Closed', !!OP.closed);
      thread.postLimit = !!OP.bumplimit;
      thread.fileLimit = !!OP.imagelimit;
      if (OP.unique_ips != null) {
        thread.ipCount = OP.unique_ips;
      }
      posts = [];
      index = [];
      files = [];
      newPosts = [];
      for (i = 0, len = postObjects.length; i < len; i++) {
        postObject = postObjects[i];
        ID = postObject.no;
        index.push(ID);
        if (postObject.fsize) {
          files.push(ID);
        }
        if (ID <= lastPost) {
          continue;
        }
        if ((post = thread.posts[ID]) && !post.isFetchedQuote) {
          post.resurrect();
          continue;
        }
        newPosts.push(board + "." + ID);
        node = Build.postFromObject(postObject, board.ID);
        posts.push(new Post(node, thread, board));
        if (ThreadUpdater.postID === ID) {
          delete ThreadUpdater.postID;
        }
      }
      deletedPosts = [];
      ref1 = ThreadUpdater.postIDs;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        ID = ref1[k];
        if (!(indexOf.call(index, ID) < 0)) {
          continue;
        }
        thread.posts[ID].kill();
        deletedPosts.push(board + "." + ID);
      }
      ThreadUpdater.postIDs = index;
      deletedFiles = [];
      ref2 = ThreadUpdater.fileIDs;
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        ID = ref2[l];
        if (!(!(indexOf.call(files, ID) >= 0 || (ref3 = board + "." + ID, indexOf.call(deletedPosts, ref3) >= 0)))) {
          continue;
        }
        thread.posts[ID].kill(true);
        deletedFiles.push(board + "." + ID);
      }
      ThreadUpdater.fileIDs = files;
      if (!posts.length) {
        ThreadUpdater.set('status', '');
      } else {
        ThreadUpdater.set('status', "+" + posts.length, 'new');
        ThreadUpdater.outdateCount = 0;
        unreadCount = (ref4 = Unread.posts) != null ? ref4.size : void 0;
        unreadQYCount = (ref5 = Unread.postsQuotingYou) != null ? ref5.size : void 0;
        Main.callbackNodes('Post', posts);
        if (d.hidden || !d.hasFocus()) {
          if (Conf['Beep Quoting You'] && ((ref6 = Unread.postsQuotingYou) != null ? ref6.size : void 0) > unreadQYCount) {
            ThreadUpdater.playBeep();
            if (Conf['Beep']) {
              ThreadUpdater.playBeep();
            }
          } else if (Conf['Beep'] && ((ref7 = Unread.posts) != null ? ref7.size : void 0) > 0 && unreadCount === 0) {
            ThreadUpdater.playBeep();
          }
        }
        scroll = Conf['Auto Scroll'] && ThreadUpdater.scrollBG() && ThreadUpdater.root.getBoundingClientRect().bottom - doc.clientHeight < 25;
        firstPost = null;
        for (m = 0, len3 = posts.length; m < len3; m++) {
          post = posts[m];
          if (!QuoteThreading.insert(post)) {
            firstPost || (firstPost = post.nodes.root);
            $.add(ThreadUpdater.root, post.nodes.root);
          }
        }
        $.event('PostsInserted');
        if (scroll) {
          if (Conf['Bottom Scroll']) {
            window.scrollTo(0, d.body.clientHeight);
          } else {
            if (firstPost) {
              Header.scrollTo(firstPost);
            }
          }
        }
      }
      if ((OP.unique_ips != null) && (ipCountEl = $.id('unique-ips'))) {
        ipCountEl.textContent = OP.unique_ips;
        ipCountEl.previousSibling.textContent = ipCountEl.previousSibling.textContent.replace(/\b(?:is|are)\b/, OP.unique_ips === 1 ? 'is' : 'are');
        ipCountEl.nextSibling.textContent = ipCountEl.nextSibling.textContent.replace(/\bposters?\b/, OP.unique_ips === 1 ? 'poster' : 'posters');
      }
      return $.event('ThreadUpdate', {
        404: false,
        threadID: thread.fullID,
        newPosts: newPosts,
        deletedPosts: deletedPosts,
        deletedFiles: deletedFiles,
        postCount: OP.replies + 1,
        fileCount: OP.images + !!OP.fsize,
        ipCount: OP.unique_ips
      });
    }
  };

  return ThreadUpdater;

}).call(this);

ThreadWatcher = (function() {
  var ThreadWatcher,
    slice = [].slice;

  ThreadWatcher = {
    init: function() {
      var sc;
      if (!(this.enabled = Conf['Thread Watcher'])) {
        return;
      }
      this.shortcut = sc = $.el('a', {
        id: 'watcher-link',
        textContent: 'Watcher',
        title: 'Thread Watcher',
        href: 'javascript:;',
        className: 'disabled fa fa-eye'
      });
      this.db = new DataBoard('watchedThreads', this.refresh, true);
      this.dialog = UI.dialog('thread-watcher', 'top: 50px; left: 0px;', {
        innerHTML: "<div class=\"move\">Thread Watcher <a class=\"refresh fa fa-refresh\" title=\"Check threads\" href=\"javascript:;\"></a><span id=\"watcher-status\"></span><a class=\"menu-button\" href=\"javascript:;\"><i class=\"fa fa-angle-down\"></i></a><a class=\"close\" href=\"javascript:;\">×</a></div><div id=\"watched-threads\"></div>"
      });
      this.status = $('#watcher-status', this.dialog);
      this.list = this.dialog.lastElementChild;
      this.refreshButton = $('.refresh', this.dialog);
      this.closeButton = $('.move > .close', this.dialog);
      this.unreaddb = Unread.db || new DataBoard('lastReadPosts');
      this.unreadEnabled = Conf['Remember Last Read Post'];
      $.on(d, 'QRPostSuccessful', this.cb.post);
      $.on(sc, 'click', this.toggleWatcher);
      $.on(this.refreshButton, 'click', this.buttonFetchAll);
      $.on(this.closeButton, 'click', this.toggleWatcher);
      $.on(d, '4chanXInitFinished', this.ready);
      switch (g.VIEW) {
        case 'index':
          $.on(d, 'IndexRefresh', this.cb.onIndexRefresh);
          break;
        case 'thread':
          $.on(d, 'ThreadUpdate', this.cb.onThreadRefresh);
      }
      if (Conf['Fixed Thread Watcher']) {
        $.addClass(doc, 'fixed-watcher');
      }
      if (Conf['Toggleable Thread Watcher']) {
        this.dialog.hidden = true;
        Header.addShortcut(sc, 510);
        $.addClass(doc, 'toggleable-watcher');
      }
      ThreadWatcher.fetchAuto();
      if (g.VIEW === 'index' && Conf['JSON Index'] && Conf['Menu'] && g.BOARD.ID !== 'f') {
        Menu.menu.addEntry({
          el: $.el('a', {
            href: 'javascript:;',
            className: 'has-shortcut-text'
          }, {
            innerHTML: "<span></span><span class=\"shortcut-text\">Alt+click</span>"
          }),
          order: 6,
          open: function(arg) {
            var thread;
            thread = arg.thread;
            if (Conf['Index Mode'] !== 'catalog') {
              return false;
            }
            this.el.firstElementChild.textContent = ThreadWatcher.isWatched(thread) ? 'Unwatch' : 'Watch';
            if (this.cb) {
              $.off(this.el, 'click', this.cb);
            }
            this.cb = function() {
              $.event('CloseMenu');
              return ThreadWatcher.toggle(thread);
            };
            $.on(this.el, 'click', this.cb);
            return true;
          }
        });
      }
      Callbacks.Post.push({
        name: 'Thread Watcher',
        cb: this.node
      });
      return Callbacks.CatalogThread.push({
        name: 'Thread Watcher',
        cb: this.catalogNode
      });
    },
    isWatched: function(thread) {
      var ref;
      return (ref = ThreadWatcher.db) != null ? ref.get({
        boardID: thread.board.ID,
        threadID: thread.ID
      }) : void 0;
    },
    node: function() {
      var toggler;
      if (this.isReply) {
        return;
      }
      if (this.isClone) {
        toggler = $('.watch-thread-link', this.nodes.post);
      } else {
        toggler = $.el('a', {
          href: 'javascript:;',
          className: 'watch-thread-link'
        });
        $.before($('input', this.nodes.post), toggler);
      }
      return $.on(toggler, 'click', ThreadWatcher.cb.toggle);
    },
    catalogNode: function() {
      if (ThreadWatcher.isWatched(this.thread)) {
        $.addClass(this.nodes.root, 'watched');
      }
      $.on(this.nodes.thumb.parentNode, 'click', (function(_this) {
        return function(e) {
          if (!(e.button === 0 && e.altKey)) {
            return;
          }
          ThreadWatcher.toggle(_this.thread);
          return e.preventDefault();
        };
      })(this));
      return $.on(this.nodes.thumb.parentNode, 'mousedown', function(e) {
        if (e.button === 0 && e.altKey) {
          return e.preventDefault();
        }
      });
    },
    ready: function() {
      $.off(d, '4chanXInitFinished', ThreadWatcher.ready);
      if (!Main.isThisPageLegit()) {
        return;
      }
      ThreadWatcher.refresh();
      $.add(d.body, ThreadWatcher.dialog);
      if (!Conf['Auto Watch']) {
        return;
      }
      return $.get('AutoWatch', 0, function(arg) {
        var AutoWatch, thread;
        AutoWatch = arg.AutoWatch;
        if (!(thread = g.BOARD.threads[AutoWatch])) {
          return;
        }
        ThreadWatcher.add(thread);
        return $["delete"]('AutoWatch');
      });
    },
    toggleWatcher: function() {
      $.toggleClass(ThreadWatcher.shortcut, 'disabled');
      return ThreadWatcher.dialog.hidden = !ThreadWatcher.dialog.hidden;
    },
    cb: {
      openAll: function() {
        var a, i, len, ref;
        if ($.hasClass(this, 'disabled')) {
          return;
        }
        ref = $$('a[title]', ThreadWatcher.list);
        for (i = 0, len = ref.length; i < len; i++) {
          a = ref[i];
          $.open(a.href);
        }
        return $.event('CloseMenu');
      },
      pruneDeads: function() {
        var boardID, data, i, len, ref, ref1, threadID;
        if ($.hasClass(this, 'disabled')) {
          return;
        }
        ThreadWatcher.db.forceSync();
        ref = ThreadWatcher.getAll();
        for (i = 0, len = ref.length; i < len; i++) {
          ref1 = ref[i], boardID = ref1.boardID, threadID = ref1.threadID, data = ref1.data;
          if (!data.isDead) {
            continue;
          }
          delete ThreadWatcher.db.data.boards[boardID][threadID];
          ThreadWatcher.db.deleteIfEmpty({
            boardID: boardID
          });
        }
        ThreadWatcher.db.save();
        ThreadWatcher.refresh();
        return $.event('CloseMenu');
      },
      toggle: function() {
        var thread;
        thread = Get.postFromNode(this).thread;
        Index.followedThreadID = thread.ID;
        ThreadWatcher.toggle(thread);
        return delete Index.followedThreadID;
      },
      rm: function() {
        var boardID, ref, threadID;
        ref = this.parentNode.dataset.fullID.split('.'), boardID = ref[0], threadID = ref[1];
        return ThreadWatcher.rm(boardID, +threadID);
      },
      post: function(e) {
        var boardID, postID, ref, threadID;
        ref = e.detail, boardID = ref.boardID, threadID = ref.threadID, postID = ref.postID;
        if (postID === threadID) {
          if (Conf['Auto Watch']) {
            return $.set('AutoWatch', threadID);
          }
        } else if (Conf['Auto Watch Reply']) {
          return ThreadWatcher.add(g.threads[boardID + '.' + threadID]);
        }
      },
      onIndexRefresh: function() {
        var boardID, data, db, ref, threadID;
        db = ThreadWatcher.db;
        boardID = g.BOARD.ID;
        db.forceSync();
        ref = db.data.boards[boardID];
        for (threadID in ref) {
          data = ref[threadID];
          if (!(data != null ? data.isDead : void 0) && !(threadID in g.BOARD.threads)) {
            if (Conf['Auto Prune'] || !(data && typeof data === 'object')) {
              db["delete"]({
                boardID: boardID,
                threadID: threadID
              });
            } else {
              if (ThreadWatcher.unreadEnabled && Conf['Show Unread Count']) {
                ThreadWatcher.fetchStatus({
                  boardID: boardID,
                  threadID: threadID,
                  data: data
                });
              }
              data.isDead = true;
              db.set({
                boardID: boardID,
                threadID: threadID,
                val: data
              });
            }
          }
        }
        return ThreadWatcher.refresh();
      },
      onThreadRefresh: function(e) {
        var thread;
        thread = g.threads[e.detail.threadID];
        if (!(e.detail[404] && ThreadWatcher.db.get({
          boardID: thread.board.ID,
          threadID: thread.ID
        }))) {
          return;
        }
        return ThreadWatcher.add(thread);
      }
    },
    requests: [],
    fetched: 0,
    clearRequests: function() {
      ThreadWatcher.requests = [];
      ThreadWatcher.fetched = 0;
      ThreadWatcher.status.textContent = '';
      return $.rmClass(ThreadWatcher.refreshButton, 'fa-spin');
    },
    abort: function() {
      var i, len, ref, req;
      ref = ThreadWatcher.requests;
      for (i = 0, len = ref.length; i < len; i++) {
        req = ref[i];
        if (req.readyState !== 4) {
          req.abort();
        }
      }
      return ThreadWatcher.clearRequests();
    },
    fetchAuto: function() {
      var db, interval, now;
      clearTimeout(ThreadWatcher.timeout);
      if (!Conf['Auto Update Thread Watcher']) {
        return;
      }
      db = ThreadWatcher.db;
      interval = ThreadWatcher.unreadEnabled && Conf['Show Unread Count'] ? 5 * $.MINUTE : 2 * $.HOUR;
      now = Date.now();
      if (now >= (db.data.lastChecked || 0) + interval) {
        db.data.lastChecked = now;
        ThreadWatcher.fetchAllStatus();
        db.save();
      }
      return ThreadWatcher.timeout = setTimeout(ThreadWatcher.fetchAuto, interval);
    },
    buttonFetchAll: function() {
      if (ThreadWatcher.requests.length) {
        return ThreadWatcher.abort();
      } else {
        return ThreadWatcher.fetchAllStatus();
      }
    },
    fetchAllStatus: function() {
      var i, len, ref, thread, threads;
      ThreadWatcher.db.forceSync();
      ThreadWatcher.unreaddb.forceSync();
      if ((ref = QuoteYou.db) != null) {
        ref.forceSync();
      }
      if (!(threads = ThreadWatcher.getAll()).length) {
        return;
      }
      for (i = 0, len = threads.length; i < len; i++) {
        thread = threads[i];
        ThreadWatcher.fetchStatus(thread);
      }
    },
    fetchStatus: function(thread, force) {
      var boardID, data, req, threadID;
      boardID = thread.boardID, threadID = thread.threadID, data = thread.data;
      if (data.isDead && !force) {
        return;
      }
      if (ThreadWatcher.requests.length === 0) {
        ThreadWatcher.status.textContent = '...';
        $.addClass(ThreadWatcher.refreshButton, 'fa-spin');
      }
      req = $.ajax("//a.4cdn.org/" + boardID + "/thread/" + threadID + ".json", {
        onloadend: function() {
          return ThreadWatcher.parseStatus.call(this, thread);
        },
        timeout: $.MINUTE
      }, {
        whenModified: force ? false : 'ThreadWatcher'
      });
      return ThreadWatcher.requests.push(req);
    },
    parseStatus: function(arg) {
      var boardID, data, i, isDead, lastReadPost, len, match, postObj, quotesYou, quotingYou, ref, ref1, regexp, threadID, unread;
      boardID = arg.boardID, threadID = arg.threadID, data = arg.data;
      ThreadWatcher.fetched++;
      if (ThreadWatcher.fetched === ThreadWatcher.requests.length) {
        ThreadWatcher.clearRequests();
      } else {
        ThreadWatcher.status.textContent = (Math.round(ThreadWatcher.fetched / ThreadWatcher.requests.length * 100)) + "%";
      }
      if (this.status === 200 && this.response) {
        isDead = !!this.response.posts[0].archived;
        if (isDead && Conf['Auto Prune']) {
          ThreadWatcher.db["delete"]({
            boardID: boardID,
            threadID: threadID
          });
          ThreadWatcher.refresh();
          return;
        }
        lastReadPost = ThreadWatcher.unreaddb.get({
          boardID: boardID,
          threadID: threadID,
          defaultValue: 0
        });
        unread = quotingYou = 0;
        ref = this.response.posts;
        for (i = 0, len = ref.length; i < len; i++) {
          postObj = ref[i];
          if (!(postObj.no > lastReadPost)) {
            continue;
          }
          if ((ref1 = QuoteYou.db) != null ? ref1.get({
            boardID: boardID,
            threadID: threadID,
            postID: postObj.no
          }) : void 0) {
            continue;
          }
          unread++;
          if (!(QuoteYou.db && postObj.com)) {
            continue;
          }
          quotesYou = false;
          regexp = /<a [^>]*\bhref="(?:\/([^\/]+)\/thread\/)?(\d+)?(?:#p(\d+))?"/g;
          while (match = regexp.exec(postObj.com)) {
            if (QuoteYou.db.get({
              boardID: match[1] || boardID,
              threadID: match[2] || threadID,
              postID: match[3] || match[2] || threadID
            })) {
              quotesYou = true;
              break;
            }
          }
          if (quotesYou && !Filter.isHidden(Build.parseJSON(postObj, boardID))) {
            quotingYou++;
          }
        }
        if (isDead !== data.isDead || unread !== data.unread || quotingYou !== data.quotingYou) {
          data.isDead = isDead;
          data.unread = unread;
          data.quotingYou = quotingYou;
          ThreadWatcher.db.set({
            boardID: boardID,
            threadID: threadID,
            val: data
          });
          return ThreadWatcher.refresh();
        }
      } else if (this.status === 404) {
        if (Conf['Auto Prune']) {
          ThreadWatcher.db["delete"]({
            boardID: boardID,
            threadID: threadID
          });
        } else {
          data.isDead = true;
          delete data.unread;
          delete data.quotingYou;
          ThreadWatcher.db.set({
            boardID: boardID,
            threadID: threadID,
            val: data
          });
        }
        return ThreadWatcher.refresh();
      }
    },
    getAll: function() {
      var all, boardID, data, ref, threadID, threads;
      all = [];
      ref = ThreadWatcher.db.data.boards;
      for (boardID in ref) {
        threads = ref[boardID];
        if (Conf['Current Board'] && boardID !== g.BOARD.ID) {
          continue;
        }
        for (threadID in threads) {
          data = threads[threadID];
          if (data && typeof data === 'object') {
            all.push({
              boardID: boardID,
              threadID: threadID,
              data: data
            });
          }
        }
      }
      return all;
    },
    makeLine: function(boardID, threadID, data) {
      var count, div, fullID, link, title, x;
      x = $.el('a', {
        className: 'fa fa-times',
        href: 'javascript:;'
      });
      $.on(x, 'click', ThreadWatcher.cb.rm);
      link = $.el('a', {
        href: "/" + boardID + "/thread/" + threadID,
        title: data.excerpt,
        className: 'watcher-link'
      });
      if (ThreadWatcher.unreadEnabled && Conf['Show Unread Count'] && (data.unread != null)) {
        count = $.el('span', {
          textContent: "(" + data.unread + ")",
          className: 'watcher-unread'
        });
        $.add(link, count);
      }
      title = $.el('span', {
        textContent: data.excerpt,
        className: 'watcher-title'
      });
      $.add(link, title);
      div = $.el('div');
      fullID = boardID + "." + threadID;
      div.dataset.fullID = fullID;
      if (g.VIEW === 'thread' && fullID === (g.BOARD + "." + g.THREADID)) {
        $.addClass(div, 'current');
      }
      if (data.isDead) {
        $.addClass(div, 'dead-thread');
      }
      if (ThreadWatcher.unreadEnabled && Conf['Show Unread Count']) {
        if (data.unread === 0) {
          $.addClass(div, 'replies-read');
        }
        if (data.unread) {
          $.addClass(div, 'replies-unread');
        }
        if (data.quotingYou) {
          $.addClass(div, 'replies-quoting-you');
        }
      }
      $.add(div, [x, $.tn(' '), link]);
      return div;
    },
    refresh: function() {
      var boardID, data, i, j, len, len1, list, nodes, ref, ref1, ref2, refresher, threadID;
      nodes = [];
      ref = ThreadWatcher.getAll();
      for (i = 0, len = ref.length; i < len; i++) {
        ref1 = ref[i], boardID = ref1.boardID, threadID = ref1.threadID, data = ref1.data;
        nodes.push(ThreadWatcher.makeLine(boardID, threadID, data));
      }
      list = ThreadWatcher.list;
      $.rmAll(list);
      $.add(list, nodes);
      g.threads.forEach(function(thread) {
        var helper, j, len1, post, ref2, toggler;
        helper = ThreadWatcher.isWatched(thread) ? ['addClass', 'Unwatch'] : ['rmClass', 'Watch'];
        if (thread.OP) {
          ref2 = [thread.OP].concat(slice.call(thread.OP.clones));
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            post = ref2[j];
            toggler = $('.watch-thread-link', post.nodes.post);
            $[helper[0]](toggler, 'watched');
            toggler.title = helper[1] + " Thread";
          }
        }
        if (thread.catalogView) {
          return $[helper[0]](thread.catalogView.nodes.root, 'watched');
        }
      });
      ThreadWatcher.refreshIcon();
      ref2 = ThreadWatcher.menu.refreshers;
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        refresher = ref2[j];
        refresher();
      }
      if (Index.nodes && Conf['Pin Watched Threads']) {
        Index.sort();
        return Index.buildIndex();
      }
    },
    refreshIcon: function() {
      var className, i, len, ref;
      ref = ['replies-unread', 'replies-quoting-you'];
      for (i = 0, len = ref.length; i < len; i++) {
        className = ref[i];
        ThreadWatcher.shortcut.classList.toggle(className, !!$("." + className, ThreadWatcher.dialog));
      }
    },
    update: function(boardID, threadID, newData) {
      var data, key, line, n, newLine, ref, val;
      if (!(data = (ref = ThreadWatcher.db) != null ? ref.get({
        boardID: boardID,
        threadID: threadID
      }) : void 0)) {
        return;
      }
      if (newData.isDead && Conf['Auto Prune']) {
        ThreadWatcher.db["delete"]({
          boardID: boardID,
          threadID: threadID
        });
        ThreadWatcher.refresh();
        return;
      }
      n = 0;
      for (key in newData) {
        val = newData[key];
        if (data[key] !== val) {
          n++;
        }
      }
      if (!n) {
        return;
      }
      ThreadWatcher.db.forceSync();
      if (!(data = ThreadWatcher.db.get({
        boardID: boardID,
        threadID: threadID
      }))) {
        return;
      }
      $.extend(data, newData);
      ThreadWatcher.db.set({
        boardID: boardID,
        threadID: threadID,
        val: data
      });
      if (line = $("#watched-threads > [data-full-i-d='" + boardID + "." + threadID + "']", ThreadWatcher.dialog)) {
        newLine = ThreadWatcher.makeLine(boardID, threadID, data);
        $.replace(line, newLine);
        return ThreadWatcher.refreshIcon();
      } else {
        return ThreadWatcher.refresh();
      }
    },
    set404: function(boardID, threadID, cb) {
      var data, ref;
      if (!(data = (ref = ThreadWatcher.db) != null ? ref.get({
        boardID: boardID,
        threadID: threadID
      }) : void 0)) {
        return cb();
      }
      if (Conf['Auto Prune']) {
        ThreadWatcher.db["delete"]({
          boardID: boardID,
          threadID: threadID
        });
        return cb();
      }
      if (data.isDead && !((data.unread != null) || (data.quotingYou != null))) {
        return cb();
      }
      data.isDead = true;
      delete data.unread;
      delete data.quotingYou;
      return ThreadWatcher.db.set({
        boardID: boardID,
        threadID: threadID,
        val: data
      }, cb);
    },
    toggle: function(thread) {
      var boardID, threadID;
      boardID = thread.board.ID;
      threadID = thread.ID;
      if (ThreadWatcher.db.get({
        boardID: boardID,
        threadID: threadID
      })) {
        return ThreadWatcher.rm(boardID, threadID);
      } else {
        return ThreadWatcher.add(thread);
      }
    },
    add: function(thread) {
      var boardID, data, threadID;
      data = {};
      boardID = thread.board.ID;
      threadID = thread.ID;
      if (thread.isDead) {
        if (Conf['Auto Prune'] && ThreadWatcher.db.get({
          boardID: boardID,
          threadID: threadID
        })) {
          ThreadWatcher.rm(boardID, threadID);
          return;
        }
        data.isDead = true;
      }
      data.excerpt = Get.threadExcerpt(thread);
      ThreadWatcher.db.set({
        boardID: boardID,
        threadID: threadID,
        val: data
      });
      ThreadWatcher.refresh();
      if (ThreadWatcher.unreadEnabled && Conf['Show Unread Count']) {
        return ThreadWatcher.fetchStatus({
          boardID: boardID,
          threadID: threadID,
          data: data
        }, true);
      }
    },
    rm: function(boardID, threadID) {
      ThreadWatcher.db["delete"]({
        boardID: boardID,
        threadID: threadID
      });
      return ThreadWatcher.refresh();
    },
    menu: {
      refreshers: [],
      init: function() {
        var menu;
        if (!Conf['Thread Watcher']) {
          return;
        }
        menu = this.menu = new UI.Menu('thread watcher');
        $.on($('.menu-button', ThreadWatcher.dialog), 'click', function(e) {
          return menu.toggle(e, this, ThreadWatcher);
        });
        this.addHeaderMenuEntry();
        return this.addMenuEntries();
      },
      addHeaderMenuEntry: function() {
        var entryEl;
        if (g.VIEW !== 'thread') {
          return;
        }
        entryEl = $.el('a', {
          href: 'javascript:;'
        });
        Header.menu.addEntry({
          el: entryEl,
          order: 60
        });
        $.on(entryEl, 'click', function() {
          return ThreadWatcher.toggle(g.threads[g.BOARD + "." + g.THREADID]);
        });
        return this.refreshers.push(function() {
          var addClass, ref, rmClass, text;
          ref = $('.current', ThreadWatcher.list) ? ['unwatch-thread', 'watch-thread', 'Unwatch thread'] : ['watch-thread', 'unwatch-thread', 'Watch thread'], addClass = ref[0], rmClass = ref[1], text = ref[2];
          $.addClass(entryEl, addClass);
          $.rmClass(entryEl, rmClass);
          return entryEl.textContent = text;
        });
      },
      addMenuEntries: function() {
        var cb, conf, entries, entry, i, len, name, ref, ref1, refresh, subEntries;
        entries = [];
        entries.push({
          cb: ThreadWatcher.cb.openAll,
          entry: {
            el: $.el('a', {
              textContent: 'Open all threads'
            })
          },
          refresh: function() {
            return (ThreadWatcher.list.firstElementChild ? $.rmClass : $.addClass)(this.el, 'disabled');
          }
        });
        entries.push({
          cb: ThreadWatcher.cb.pruneDeads,
          entry: {
            el: $.el('a', {
              textContent: 'Prune dead threads'
            })
          },
          refresh: function() {
            return ($('.dead-thread', ThreadWatcher.list) ? $.rmClass : $.addClass)(this.el, 'disabled');
          }
        });
        subEntries = [];
        ref = Config.threadWatcher;
        for (name in ref) {
          conf = ref[name];
          subEntries.push(this.createSubEntry(name, conf[1]));
        }
        entries.push({
          entry: {
            el: $.el('span', {
              textContent: 'Settings'
            }),
            subEntries: subEntries
          }
        });
        for (i = 0, len = entries.length; i < len; i++) {
          ref1 = entries[i], entry = ref1.entry, cb = ref1.cb, refresh = ref1.refresh;
          if (entry.el.nodeName === 'A') {
            entry.el.href = 'javascript:;';
          }
          if (cb) {
            $.on(entry.el, 'click', cb);
          }
          if (refresh) {
            this.refreshers.push(refresh.bind(entry));
          }
          this.menu.addEntry(entry);
        }
      },
      createSubEntry: function(name, desc) {
        var entry, input;
        entry = {
          type: 'thread watcher',
          el: UI.checkbox(name, name.replace(' Thread Watcher', ''))
        };
        entry.el.title = desc;
        input = entry.el.firstElementChild;
        if (name === 'Show Unread Count' && !ThreadWatcher.unreadEnabled) {
          input.disabled = true;
          $.addClass(entry.el, 'disabled');
          entry.el.title += '\n[Remember Last Read Post is disabled.]';
        }
        $.on(input, 'change', $.cb.checked);
        if (name === 'Current Board' || name === 'Show Unread Count') {
          $.on(input, 'change', ThreadWatcher.refresh);
        }
        if (name === 'Show Unread Count' || name === 'Auto Update Thread Watcher') {
          $.on(input, 'change', ThreadWatcher.fetchAuto);
        }
        return entry;
      }
    }
  };

  return ThreadWatcher;

}).call(this);

Unread = (function() {
  var Unread;

  Unread = {
    init: function() {
      if (!(g.VIEW === 'thread' && (Conf['Unread Count'] || Conf['Unread Favicon'] || Conf['Unread Line'] || Conf['Remember Last Read Post'] || Conf['Desktop Notifications'] || Conf['Quote Threading']))) {
        return;
      }
      if (Conf['Remember Last Read Post']) {
        $.sync('Remember Last Read Post', function(enabled) {
          return Conf['Remember Last Read Post'] = enabled;
        });
        this.db = new DataBoard('lastReadPosts', this.sync);
      }
      this.hr = $.el('hr', {
        id: 'unread-line'
      });
      this.posts = new Set();
      this.postsQuotingYou = new Set();
      this.order = new RandomAccessList();
      this.position = null;
      Callbacks.Thread.push({
        name: 'Unread',
        cb: this.node
      });
      return Callbacks.Post.push({
        name: 'Unread',
        cb: this.addPost
      });
    },
    node: function() {
      var ID, j, len, ref, ref1;
      Unread.thread = this;
      Unread.title = d.title;
      Unread.lastReadPost = ((ref = Unread.db) != null ? ref.get({
        boardID: this.board.ID,
        threadID: this.ID
      }) : void 0) || 0;
      Unread.readCount = 0;
      ref1 = this.posts.keys;
      for (j = 0, len = ref1.length; j < len; j++) {
        ID = ref1[j];
        if (+ID <= Unread.lastReadPost) {
          Unread.readCount++;
        }
      }
      $.one(d, '4chanXInitFinished', Unread.ready);
      return $.on(d, 'ThreadUpdate', Unread.onUpdate);
    },
    ready: function() {
      if (Conf['Remember Last Read Post'] && Conf['Scroll to Last Read Post']) {
        Unread.scroll();
      }
      Unread.setLine(true);
      Unread.read();
      Unread.update();
      $.on(d, 'scroll visibilitychange', Unread.read);
      if (Conf['Unread Line']) {
        return $.on(d, 'visibilitychange', Unread.setLine);
      }
    },
    positionPrev: function() {
      if (Unread.position) {
        return Unread.position.prev;
      } else {
        return Unread.order.last;
      }
    },
    scroll: function() {
      var hash, position, ref, root;
      if ((hash = location.hash.match(/\d+/)) && hash[0] in Unread.thread.posts) {
        return;
      }
      ReplyPruning.showIfHidden((ref = Unread.position) != null ? ref.data.nodes.root.id : void 0);
      position = Unread.positionPrev();
      while (position) {
        root = position.data.nodes.root;
        if (!root.getBoundingClientRect().height) {
          position = position.prev;
        } else {
          Header.scrollToIfNeeded(root, true);
          break;
        }
      }
    },
    sync: function() {
      var ID, i, j, lastReadPost, postIDs, ref, ref1;
      if (Unread.lastReadPost == null) {
        return;
      }
      lastReadPost = Unread.db.get({
        boardID: Unread.thread.board.ID,
        threadID: Unread.thread.ID,
        defaultValue: 0
      });
      if (!(Unread.lastReadPost < lastReadPost)) {
        return;
      }
      Unread.lastReadPost = lastReadPost;
      postIDs = Unread.thread.posts.keys;
      for (i = j = ref = Unread.readCount, ref1 = postIDs.length; j < ref1; i = j += 1) {
        ID = +postIDs[i];
        if (!Unread.thread.posts[ID].isFetchedQuote) {
          if (ID > Unread.lastReadPost) {
            break;
          }
          Unread.posts["delete"](ID);
          Unread.postsQuotingYou["delete"](ID);
        }
        Unread.readCount++;
      }
      Unread.updatePosition();
      Unread.setLine();
      return Unread.update();
    },
    addPost: function() {
      var ref;
      if (this.isFetchedQuote || this.isClone) {
        return;
      }
      Unread.order.push(this);
      if (this.ID <= Unread.lastReadPost || this.isHidden || ((ref = QuoteYou.db) != null ? ref.get({
        boardID: this.board.ID,
        threadID: this.thread.ID,
        postID: this.ID
      }) : void 0)) {
        return;
      }
      Unread.posts.add(this.ID);
      Unread.addPostQuotingYou(this);
      return Unread.position != null ? Unread.position : Unread.position = Unread.order[this.ID];
    },
    addPostQuotingYou: function(post) {
      var j, len, quotelink, ref, ref1;
      ref = post.nodes.quotelinks;
      for (j = 0, len = ref.length; j < len; j++) {
        quotelink = ref[j];
        if (!((ref1 = QuoteYou.db) != null ? ref1.get(Get.postDataFromLink(quotelink)) : void 0)) {
          continue;
        }
        Unread.postsQuotingYou.add(post.ID);
        Unread.openNotification(post);
        return;
      }
    },
    openNotification: function(post) {
      var notif;
      if (!Header.areNotificationsEnabled) {
        return;
      }
      try {
        notif = new Notification(post.info.nameBlock + " replied to you", {
          body: post.info.commentDisplay,
          icon: Favicon.logo
        });
        notif.onclick = function() {
          Header.scrollToIfNeeded(post.nodes.root, true);
          return $.global(function() {
            return window.focus();
          });
        };
        return notif.onshow = function() {
          return setTimeout(function() {
            return notif.close();
          }, 7 * $.SECOND);
        };
      } catch (_error) {}
    },
    onUpdate: function(e) {
      if (!e.detail[404]) {
        Unread.setLine();
        Unread.read();
      }
      return Unread.update();
    },
    readSinglePost: function(post) {
      var ID;
      ID = post.ID;
      if (!Unread.posts.has(ID)) {
        return;
      }
      Unread.posts["delete"](ID);
      Unread.postsQuotingYou["delete"](ID);
      Unread.updatePosition();
      Unread.saveLastReadPost();
      return Unread.update();
    },
    read: $.debounce(100, function(e) {
      var ID, count, data, ref, ref1, root;
      if (!Unread.posts.size && Unread.readCount !== Unread.thread.posts.keys.length) {
        Unread.saveLastReadPost();
      }
      if (d.hidden || !Unread.posts.size) {
        return;
      }
      count = 0;
      while (Unread.position) {
        ref = Unread.position, ID = ref.ID, data = ref.data;
        root = data.nodes.root;
        if (!(!root.getBoundingClientRect().height || Header.getBottomOf(root) > -1)) {
          break;
        }
        count++;
        Unread.posts["delete"](ID);
        Unread.postsQuotingYou["delete"](ID);
        if ((ref1 = QuoteYou.db) != null ? ref1.get({
          boardID: data.board.ID,
          threadID: data.thread.ID,
          postID: ID
        }) : void 0) {
          QuoteYou.lastRead = root;
        }
        Unread.position = Unread.position.next;
      }
      if (!count) {
        return;
      }
      Unread.updatePosition();
      Unread.saveLastReadPost();
      if (e) {
        return Unread.update();
      }
    }),
    updatePosition: function() {
      while (Unread.position && !Unread.posts.has(Unread.position.ID)) {
        Unread.position = Unread.position.next;
      }
    },
    saveLastReadPost: $.debounce(2 * $.SECOND, function() {
      var ID, i, j, postIDs, ref, ref1;
      $.forceSync('Remember Last Read Post');
      if (!(Conf['Remember Last Read Post'] && Unread.db)) {
        return;
      }
      postIDs = Unread.thread.posts.keys;
      for (i = j = ref = Unread.readCount, ref1 = postIDs.length; j < ref1; i = j += 1) {
        ID = +postIDs[i];
        if (!Unread.thread.posts[ID].isFetchedQuote) {
          if (Unread.posts.has(ID)) {
            break;
          }
          Unread.lastReadPost = ID;
        }
        Unread.readCount++;
      }
      if (Unread.thread.isDead && !Unread.thread.isArchived) {
        return;
      }
      Unread.db.forceSync();
      return Unread.db.set({
        boardID: Unread.thread.board.ID,
        threadID: Unread.thread.ID,
        val: Unread.lastReadPost
      });
    }),
    setLine: function(force) {
      if (!Conf['Unread Line']) {
        return;
      }
      if (Unread.hr.hidden || d.hidden || (force === true)) {
        if ((Unread.linePosition = Unread.positionPrev())) {
          $.after(Unread.linePosition.data.nodes.root, Unread.hr);
        } else {
          $.rm(Unread.hr);
        }
      }
      return Unread.hr.hidden = Unread.linePosition === Unread.order.last;
    },
    update: function() {
      var count, countQuotingYou, isDead, titleCount, titleDead, titleQuotingYou;
      count = Unread.posts.size;
      countQuotingYou = Unread.postsQuotingYou.size;
      if (Conf['Unread Count']) {
        titleQuotingYou = Conf['Quoted Title'] && countQuotingYou ? '(!) ' : '';
        titleCount = count || !Conf['Hide Unread Count at (0)'] ? "(" + count + ") " : '';
        titleDead = Unread.thread.isDead ? Unread.title.replace('-', (Unread.thread.isArchived ? '- Archived -' : '- 404 -')) : Unread.title;
        d.title = "" + titleQuotingYou + titleCount + titleDead;
      }
      $.forceSync('Remember Last Read Post');
      if (Conf['Remember Last Read Post'] && (!Unread.thread.isDead || Unread.thread.isArchived)) {
        ThreadWatcher.update(Unread.thread.board.ID, Unread.thread.ID, {
          isDead: Unread.thread.isDead,
          unread: count,
          quotingYou: countQuotingYou
        });
      }
      if (Conf['Unread Favicon']) {
        isDead = Unread.thread.isDead;
        Favicon.el.href = countQuotingYou ? Favicon[isDead ? 'unreadDeadY' : 'unreadY'] : count ? Favicon[isDead ? 'unreadDead' : 'unread'] : Favicon[isDead ? 'dead' : 'default'];
        return $.add(d.head, Favicon.el);
      }
    }
  };

  return Unread;

}).call(this);

Captcha = {};

(function() {
  Captcha.fixes = {
    imageKeys: '789456123uiojklm'.split('').concat(['Comma', 'Period']),
    imageKeys16: '7890uiopjkl'.split('').concat(['Semicolon', 'm', 'Comma', 'Period', 'Slash']),
    css: '.rc-imageselect-target > div:focus, .rc-image-tile-target:focus {\n  outline: 2px solid #4a90e2;\n}\n.rc-imageselect-target td:focus {\n  box-shadow: inset 0 0 0 2px #4a90e2;\n  outline: none;\n}\n.rc-button-default:focus {\n  box-shadow: inset 0 0 0 2px #0063d6;\n}',
    cssNoscript: '.fbc-payload-imageselect {\n  position: relative;\n}\n.fbc-payload-imageselect > label {\n  position: absolute;\n  display: block;\n  height: 93.3px;\n  width: 93.3px;\n}\nlabel[data-row="0"] {top: 0px;}\nlabel[data-row="1"] {top: 93.3px;}\nlabel[data-row="2"] {top: 186.6px;}\nlabel[data-col="0"] {left: 0px;}\nlabel[data-col="1"] {left: 93.3px;}\nlabel[data-col="2"] {left: 186.6px;}\n.fbc-payload-imageselect > input:focus + label {\n  outline: 2px solid #4a90e2;\n}\n.fbc-button-verify input:focus {\n  box-shadow: inset 0 0 0 2px #0063d6;\n}\nbody.focus .fbc {\n  box-shadow: inset 0 0 0 2px #4a90e2;\n}',
    init: function() {
      switch (location.pathname.split('/')[3]) {
        case 'anchor':
          return this.initMain();
        case 'frame':
          return this.initPopup();
        case 'fallback':
          return this.initNoscript();
      }
    },
    initMain: function() {
      var a, j, len, ref;
      $.onExists(d.body, '#recaptcha-anchor', function(checkbox) {
        var focus;
        focus = function() {
          var ref;
          if (d.hasFocus() && ((ref = d.activeElement) === d.documentElement || ref === d.body)) {
            return checkbox.focus();
          }
        };
        focus();
        return $.on(window, 'focus', function() {
          return $.queueTask(focus);
        });
      });
      ref = $$('.rc-anchor-pt a');
      for (j = 0, len = ref.length; j < len; j++) {
        a = ref[j];
        a.tabIndex = -1;
      }
    },
    initPopup: function() {
      $.addStyle(this.css);
      this.fixImages();
      new MutationObserver((function(_this) {
        return function() {
          return _this.fixImages();
        };
      })(this)).observe(d.body, {
        childList: true,
        subtree: true
      });
      return $.on(d, 'keydown', this.keybinds.bind(this));
    },
    initNoscript: function() {
      var data, ref, token;
      this.noscript = true;
      data = (token = (ref = $('.fbc-verification-token > textarea')) != null ? ref.value : void 0) ? {
        token: token
      } : {
        working: true
      };
      new Connection(window.parent, '*').send(data);
      d.body.classList.toggle('focus', d.hasFocus());
      $.on(window, 'focus blur', function() {
        return d.body.classList.toggle('focus', d.hasFocus());
      });
      this.images = $$('.fbc-payload-imageselect > input');
      this.width = 3;
      if (this.images.length !== 9) {
        return;
      }
      $.addStyle(this.cssNoscript);
      this.addLabels();
      $.on(d, 'keydown', this.keybinds.bind(this));
      return $.on($('.fbc-imageselect-challenge > form'), 'submit', this.checkForm.bind(this));
    },
    fixImages: function() {
      var img, j, len, ref;
      this.images = $$('.rc-image-tile-target');
      if (!this.images.length) {
        this.images = $$('.rc-imageselect-target > div, .rc-imageselect-target td');
      }
      this.width = $$('.rc-imageselect-target tr:first-of-type td').length || Math.round(Math.sqrt(this.images.length));
      ref = this.images;
      for (j = 0, len = ref.length; j < len; j++) {
        img = ref[j];
        img.tabIndex = 0;
      }
      if (this.images.length === 9) {
        this.addTooltips(this.images);
      } else {
        this.addTooltips16(this.images);
      }
      return this.complaintLinks();
    },
    complaintLinks: function() {
      var errmsg, j, len, link, ref;
      ref = $$('.rc-imageselect-incorrect-response, .rc-imageselect-error-select-one, .rc-imageselect-error-select-more, .rc-imageselect-error-dynamic-more');
      for (j = 0, len = ref.length; j < len; j++) {
        errmsg = ref[j];
        if (!$('a', errmsg)) {
          link = $.el('a', {
            href: 'https://www.4chan-x.net/captchas.html',
            target: '_blank',
            textContent: '[complain]'
          });
          $.add(errmsg, [$.tn(' '), link]);
        }
      }
    },
    addLabels: function() {
      var checkbox, i, imageSelect, label, labels;
      imageSelect = $('.fbc-payload-imageselect');
      labels = (function() {
        var j, len, ref, results;
        ref = this.images;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          checkbox = ref[i];
          checkbox.id = "checkbox-" + i;
          label = $.el('label', {
            htmlFor: checkbox.id
          });
          label.dataset.row = Math.floor(i / 3);
          label.dataset.col = i % 3;
          $.after(checkbox, label);
          results.push(label);
        }
        return results;
      }).call(this);
      return this.addTooltips(labels);
    },
    addTooltips: function(nodes) {
      var i, j, len, node;
      for (i = j = 0, len = nodes.length; j < len; i = ++j) {
        node = nodes[i];
        node.title = this.imageKeys[i] + " or " + (this.imageKeys[i + 9][0].toUpperCase()) + this.imageKeys[i + 9].slice(1);
      }
    },
    addTooltips16: function(nodes) {
      var i, j, key, len, node, ref;
      ref = this.imageKeys16;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        key = ref[i];
        if (i % 4 < this.width && (node = nodes[nodes.length - (4 - Math.floor(i / 4)) * this.width + (i % 4)])) {
          node.title = "" + (key[0].toUpperCase()) + key.slice(1);
        }
      }
    },
    checkForm: function(e) {
      var checkbox, j, len, n, ref;
      n = 0;
      ref = this.images;
      for (j = 0, len = ref.length; j < len; j++) {
        checkbox = ref[j];
        if (checkbox.checked) {
          n++;
        }
      }
      if (n === 0) {
        return e.preventDefault();
      }
    },
    keybinds: function(e) {
      var dx, i, img, key, last, n, reload, verify, w, x;
      if (!(this.images && doc.contains(this.images[0]))) {
        return;
      }
      n = this.images.length;
      w = this.width;
      last = n + w - 1;
      reload = $('#recaptcha-reload-button, .fbc-button-reload');
      verify = $('#recaptcha-verify-button, .fbc-button-verify > input');
      x = this.images.indexOf(d.activeElement);
      if (x < 0) {
        x = d.activeElement === verify ? last : n;
      }
      key = Keybinds.keyCode(e);
      if (!this.noscript && key === 'Space' && x < n) {
        this.images[x].click();
      } else if (n === 9 && (i = this.imageKeys.indexOf(key)) >= 0) {
        this.images[i % 9].click();
        verify.focus();
      } else if (n !== 9 && (i = this.imageKeys16.indexOf(key)) >= 0 && i % 4 < w && (img = this.images[n - (4 - Math.floor(i / 4)) * w + (i % 4)])) {
        img.click();
        verify.focus();
      } else if (dx = {
        'Up': n,
        'Down': w,
        'Left': last,
        'Right': 1
      }[key]) {
        x = (x + dx) % (n + w);
        if ((n < x && x < last)) {
          x = dx === last ? n : last;
        }
        (this.images[x] || (x === n ? reload : void 0) || (x === last ? verify : void 0)).focus();
      } else {
        return;
      }
      e.preventDefault();
      return e.stopPropagation();
    }
  };

}).call(this);

(function() {
  Captcha.replace = {
    init: function() {
      if (!(d.cookie.indexOf('pass_enabled=1') < 0)) {
        return;
      }
      if (location.hostname === 'sys.4chan.org' && /[?&]altc\b/.test(location.search) && Main.jsEnabled) {
        $.onExists(doc, 'script[src="//www.google.com/recaptcha/api/js/recaptcha_ajax.js"]', function() {
          $.global(function() {
            return window.el.onload = null;
          });
          return Captcha.v1.create();
        });
        return;
      }
      if (((Conf['Use Recaptcha v1'] && location.hostname === 'boards.4chan.org') || (Conf['Use Recaptcha v1 in Reports'] && location.hostname === 'sys.4chan.org')) && Main.jsEnabled) {
        $.ready(Captcha.replace.v1);
        return;
      }
      if (Conf['Force Noscript Captcha'] && Main.jsEnabled) {
        $.ready(Captcha.replace.noscript);
        return;
      }
      if (Conf['captchaLanguage'].trim() || Conf['Captcha Fixes']) {
        if (location.hostname === 'boards.4chan.org') {
          return $.onExists(doc, '#captchaFormPart', function(node) {
            return $.onExists(node, 'iframe', Captcha.replace.iframe);
          });
        } else {
          return $.onExists(doc, 'iframe', Captcha.replace.iframe);
        }
      }
    },
    noscript: function() {
      var insert, noscript, original, span, toggle;
      if (!((original = $('#g-recaptcha, #captchaContainerAlt')) && (noscript = $('noscript')))) {
        return;
      }
      span = $.el('span', {
        id: 'captcha-forced-noscript'
      });
      $.replace(noscript, span);
      $.rm(original);
      insert = function() {
        span.innerHTML = noscript.textContent;
        return Captcha.replace.iframe($('iframe', span));
      };
      if ((toggle = $('#togglePostFormLink a, #form-link'))) {
        return $.on(toggle, 'click', insert);
      } else {
        return insert();
      }
    },
    v1: function() {
      var form, link;
      if (!$.id('g-recaptcha')) {
        return;
      }
      Captcha.v1.replace();
      if ((link = $.id('form-link'))) {
        return $.on(link, 'click', function() {
          return Captcha.v1.create();
        });
      } else if (location.hostname === 'boards.4chan.org') {
        form = $.id('postForm');
        return form.addEventListener('focus', (function() {
          return Captcha.v1.create();
        }), true);
      } else {
        return Captcha.v1.create();
      }
    },
    iframe: function(iframe) {
      var lang, src;
      if ((lang = Conf['captchaLanguage'].trim())) {
        src = /[?&]hl=/.test(iframe.src) ? iframe.src.replace(/([?&]hl=)[^&]*/, '$1' + encodeURIComponent(lang)) : iframe.src + ("&hl=" + (encodeURIComponent(lang)));
        if (iframe.src !== src) {
          iframe.src = src;
        }
      }
      return Captcha.replace.autocopy(iframe);
    },
    autocopy: function(iframe) {
      if (!(Conf['Captcha Fixes'] && /^https:\/\/www\.google\.com\/recaptcha\/api\/fallback\?/.test(iframe.src))) {
        return;
      }
      return new Connection(iframe, 'https://www.google.com', {
        working: function() {
          var ref, ref1;
          if ((ref = $.id('qr')) != null ? ref.contains(iframe) : void 0) {
            return (ref1 = $('#qr .captcha-container textarea')) != null ? ref1.parentNode.hidden = true : void 0;
          }
        },
        token: function(token) {
          var node, textarea;
          node = iframe;
          while ((node = node.parentNode)) {
            if ((textarea = $('textarea', node))) {
              break;
            }
          }
          textarea.value = token;
          return $.event('input', null, textarea);
        }
      });
    }
  };

}).call(this);

(function() {
  Captcha.v1 = {
    blank: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='57'/>",
    init: function() {
      var imgContainer, input;
      if (d.cookie.indexOf('pass_enabled=1') >= 0) {
        return;
      }
      if (!(this.isEnabled = !!$('#g-recaptcha, #captchaContainerAlt'))) {
        return;
      }
      imgContainer = $.el('div', {
        className: 'captcha-img',
        title: 'Reload reCAPTCHA'
      });
      $.extend(imgContainer, {
        innerHTML: "<img>"
      });
      input = $.el('input', {
        className: 'captcha-input field',
        title: 'Verification',
        autocomplete: 'off',
        spellcheck: false
      });
      this.nodes = {
        img: imgContainer.firstChild,
        input: input
      };
      $.on(input, 'blur', QR.focusout);
      $.on(input, 'focus', QR.focusin);
      $.on(input, 'keydown', QR.captcha.keydown.bind(QR.captcha));
      $.on(this.nodes.img.parentNode, 'click', QR.captcha.reload.bind(QR.captcha));
      $.addClass(QR.nodes.el, 'has-captcha', 'captcha-v1');
      $.after(QR.nodes.com.parentNode, [imgContainer, input]);
      this.captchas = [];
      $.get('captchas', [], function(arg) {
        var captchas;
        captchas = arg.captchas;
        QR.captcha.sync(captchas);
        return QR.captcha.clear();
      });
      $.sync('captchas', this.sync);
      this.replace();
      this.beforeSetup();
      if (Conf['Auto-load captcha']) {
        this.setup();
      }
      new MutationObserver(this.afterSetup).observe($.id('captchaContainerAlt'), {
        childList: true
      });
      return this.afterSetup();
    },
    replace: function() {
      var container, old;
      if (this.script) {
        return;
      }
      if (!(this.script = $('script[src="//www.google.com/recaptcha/api/js/recaptcha_ajax.js"]', d.head))) {
        this.script = $.el('script', {
          src: '//www.google.com/recaptcha/api/js/recaptcha_ajax.js'
        });
        $.add(d.head, this.script);
      }
      if (old = $.id('g-recaptcha')) {
        container = $.el('div', {
          id: 'captchaContainerAlt'
        });
        return $.replace(old, container);
      }
    },
    create: function() {
      var cont, lang;
      cont = $.id('captchaContainerAlt');
      if (this.occupied) {
        return;
      }
      this.occupied = true;
      if ((lang = Conf['captchaLanguage'].trim())) {
        cont.dataset.lang = lang;
      }
      $.onExists(cont, '#recaptcha_image', function(image) {
        return $.on(image, 'click', function() {
          if ($.id('recaptcha_challenge_image')) {
            return $.global(function() {
              return window.Recaptcha.reload();
            });
          }
        });
      });
      $.onExists(cont, '#recaptcha_response_field', function(field) {
        $.on(field, 'keydown', function(e) {
          if (e.keyCode === 8 && !field.value) {
            return $.global(function() {
              return window.Recaptcha.reload();
            });
          }
        });
        if (location.hostname === 'sys.4chan.org') {
          return field.focus();
        }
      });
      return $.global(function() {
        var container, options, script;
        container = document.getElementById('captchaContainerAlt');
        options = {
          theme: 'clean',
          tabindex: {
            "boards.4chan.org": 5
          }[location.hostname],
          lang: container.dataset.lang
        };
        if (window.Recaptcha) {
          return window.Recaptcha.create('6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc', container, options);
        } else {
          script = document.head.querySelector('script[src="//www.google.com/recaptcha/api/js/recaptcha_ajax.js"]');
          return script.addEventListener('load', function() {
            return window.Recaptcha.create('6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc', container, options);
          }, false);
        }
      });
    },
    cb: {
      focus: function() {
        return QR.captcha.setup(false, true);
      }
    },
    beforeSetup: function() {
      var img, input, ref;
      ref = this.nodes, img = ref.img, input = ref.input;
      img.parentNode.hidden = true;
      img.src = this.blank;
      input.value = '';
      input.placeholder = 'Focus to load reCAPTCHA';
      this.count();
      return $.on(input, 'focus click', this.cb.focus);
    },
    needed: function() {
      var captchaCount, postsCount;
      captchaCount = this.captchas.length;
      if (QR.req) {
        captchaCount++;
      }
      postsCount = QR.posts.length;
      if (postsCount === 1 && !Conf['Auto-load captcha'] && !QR.posts[0].com && !QR.posts[0].file) {
        postsCount = 0;
      }
      return captchaCount < postsCount;
    },
    onNewPost: function() {},
    onPostChange: function() {},
    setup: function(focus, force) {
      if (!(this.isEnabled && (force || this.needed()))) {
        return;
      }
      this.create();
      if (focus) {
        $.addClass(QR.nodes.el, 'focus');
        return this.nodes.input.focus();
      }
    },
    afterSetup: function() {
      var challenge, img, input, ref, setLifetime;
      if (!(challenge = $.id('recaptcha_challenge_field_holder'))) {
        return;
      }
      if (challenge === QR.captcha.nodes.challenge) {
        return;
      }
      setLifetime = function(e) {
        return QR.captcha.lifetime = e.detail;
      };
      $.on(window, 'captcha:timeout', setLifetime);
      $.global(function() {
        return window.dispatchEvent(new CustomEvent('captcha:timeout', {
          detail: window.RecaptchaState.timeout
        }));
      });
      $.off(window, 'captcha:timeout', setLifetime);
      ref = QR.captcha.nodes, img = ref.img, input = ref.input;
      img.parentNode.hidden = false;
      input.placeholder = 'Verification';
      QR.captcha.count();
      $.off(input, 'focus click', QR.captcha.cb.focus);
      QR.captcha.nodes.challenge = challenge;
      new MutationObserver(QR.captcha.load.bind(QR.captcha)).observe(challenge, {
        childList: true,
        subtree: true,
        attributes: true
      });
      QR.captcha.load();
      if (QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight) {
        QR.nodes.el.style.top = null;
        return QR.nodes.el.style.bottom = '0px';
      }
    },
    destroy: function() {
      if (!this.script) {
        return;
      }
      $.global(function() {
        return window.Recaptcha.destroy();
      });
      delete this.occupied;
      if (this.nodes) {
        return this.beforeSetup();
      }
    },
    sync: function(captchas) {
      if (captchas == null) {
        captchas = [];
      }
      QR.captcha.captchas = captchas;
      return QR.captcha.count();
    },
    getOne: function() {
      var captcha, challenge, response, timeout;
      this.clear();
      if (captcha = this.captchas.shift()) {
        this.count();
        $.set('captchas', this.captchas);
        return captcha;
      } else {
        challenge = this.nodes.img.alt;
        timeout = this.timeout;
        if (/\S/.test(response = this.nodes.input.value)) {
          this.destroy();
          return {
            challenge: challenge,
            response: response,
            timeout: timeout
          };
        } else {
          return null;
        }
      }
    },
    save: function() {
      var response;
      if (!/\S/.test(response = this.nodes.input.value)) {
        return;
      }
      this.nodes.input.value = '';
      this.captchas.push({
        challenge: this.nodes.img.alt,
        response: response,
        timeout: this.timeout
      });
      this.captchas.sort(function(a, b) {
        return a.timeout - b.timeout;
      });
      this.count();
      this.destroy();
      this.setup(false, true);
      return $.set('captchas', this.captchas);
    },
    clear: function() {
      var captcha, i, j, len, now, ref;
      if (!this.captchas.length) {
        return;
      }
      $.forceSync('captchas');
      now = Date.now();
      ref = this.captchas;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        captcha = ref[i];
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
      var challenge, challenge_image;
      if ($('#captchaContainerAlt[class~="recaptcha_is_showing_audio"]')) {
        this.nodes.img.src = this.blank;
        return;
      }
      if (!this.nodes.challenge.firstChild) {
        return;
      }
      if (!(challenge_image = $.id('recaptcha_challenge_image'))) {
        return;
      }
      this.timeout = Date.now() + this.lifetime * $.SECOND - $.MINUTE;
      challenge = this.nodes.challenge.firstChild.value;
      this.nodes.img.alt = challenge;
      this.nodes.img.src = challenge_image.src;
      this.nodes.input.value = '';
      return this.clear();
    },
    count: function() {
      var count, placeholder;
      count = this.captchas ? this.captchas.length : 0;
      placeholder = this.nodes.input.placeholder.replace(/\ \(.*\)$/, '');
      placeholder += (function() {
        switch (count) {
          case 0:
            if (placeholder === 'Verification') {
              return ' (Shift + Enter to cache)';
            } else {
              return '';
            }
            break;
          case 1:
            return ' (1 cached captcha)';
          default:
            return " (" + count + " cached captchas)";
        }
      })();
      this.nodes.input.placeholder = placeholder;
      this.nodes.input.alt = count;
      clearTimeout(this.timer);
      if (count) {
        return this.timer = setTimeout(this.clear.bind(this), this.captchas[0].timeout - Date.now());
      }
    },
    reload: function(focus) {
      $.global(function() {
        if (window.Recaptcha.type === 'image') {
          window.Recaptcha.reload();
        } else {
          window.Recaptcha.switch_type('image');
        }
        return window.Recaptcha.should_focus = false;
      });
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
  };

}).call(this);

(function() {
  Captcha.v2 = {
    lifetime: 2 * $.MINUTE,
    init: function() {
      var counter, root;
      if (d.cookie.indexOf('pass_enabled=1') >= 0) {
        return;
      }
      if (!(this.isEnabled = !!$('#g-recaptcha, #captchaContainerAlt, #captcha-forced-noscript'))) {
        return;
      }
      if ((this.noscript = Conf['Force Noscript Captcha'] || !Main.jsEnabled)) {
        $.addClass(QR.nodes.el, 'noscript-captcha');
      }
      this.captchas = [];
      $.get('captchas', [], function(arg) {
        var captchas;
        captchas = arg.captchas;
        return QR.captcha.sync(captchas);
      });
      $.sync('captchas', this.sync.bind(this));
      root = $.el('div', {
        className: 'captcha-root'
      });
      $.extend(root, {
        innerHTML: "<div class=\"captcha-counter\"><a href=\"javascript:;\"></a></div>"
      });
      counter = $('.captcha-counter > a', root);
      this.nodes = {
        root: root,
        counter: counter
      };
      this.count();
      $.addClass(QR.nodes.el, 'has-captcha', 'captcha-v2');
      $.after(QR.nodes.com.parentNode, root);
      $.on(counter, 'click', this.toggle.bind(this));
      $.on(counter, 'keydown', (function(_this) {
        return function(e) {
          if (Keybinds.keyCode(e) !== 'Space') {
            return;
          }
          _this.toggle();
          e.preventDefault();
          return e.stopPropagation();
        };
      })(this));
      return $.on(window, 'captcha:success', (function(_this) {
        return function() {
          return $.queueTask(function() {
            return _this.save(false);
          });
        };
      })(this));
    },
    timeouts: {},
    postsCount: 0,
    noscriptURL: function() {
      var lang, url;
      url = 'https://www.google.com/recaptcha/api/fallback?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc';
      if ((lang = Conf['captchaLanguage'].trim())) {
        url += "&hl=" + (encodeURIComponent(lang));
      }
      return url;
    },
    needed: function() {
      var captchaCount;
      captchaCount = this.captchas.length;
      if (QR.req) {
        captchaCount++;
      }
      this.postsCount = QR.posts.length;
      if (this.postsCount === 1 && !Conf['Auto-load captcha'] && !QR.posts[0].com && !QR.posts[0].file) {
        this.postsCount = 0;
      }
      return captchaCount < this.postsCount;
    },
    onNewPost: function() {
      return this.setup();
    },
    onPostChange: function() {
      if (this.postsCount === 0) {
        this.setup();
      }
      if (QR.posts.length === 1 && !Conf['Auto-load captcha'] && !QR.posts[0].com && !QR.posts[0].file) {
        return this.postsCount = 0;
      }
    },
    toggle: function() {
      if (this.nodes.container && !this.timeouts.destroy) {
        return this.destroy();
      } else {
        return this.setup(true, true);
      }
    },
    setup: function(focus, force) {
      if (!(this.isEnabled && (this.needed() || force))) {
        return;
      }
      if (focus) {
        $.addClass(QR.nodes.el, 'focus');
        this.nodes.counter.focus();
      }
      if (this.timeouts.destroy) {
        clearTimeout(this.timeouts.destroy);
        delete this.timeouts.destroy;
        return this.reload();
      }
      if (this.nodes.container) {
        $.queueTask((function(_this) {
          return function() {
            var iframe;
            if (_this.nodes.container && d.activeElement === _this.nodes.counter && (iframe = $('iframe', _this.nodes.container))) {
              iframe.focus();
              return QR.focus();
            }
          };
        })(this));
        return;
      }
      this.nodes.container = $.el('div', {
        className: 'captcha-container'
      });
      $.prepend(this.nodes.root, this.nodes.container);
      new MutationObserver(this.afterSetup.bind(this)).observe(this.nodes.container, {
        childList: true,
        subtree: true
      });
      if (this.noscript) {
        return this.setupNoscript();
      } else {
        return this.setupJS();
      }
    },
    setupNoscript: function() {
      var div, iframe, textarea;
      iframe = $.el('iframe', {
        id: 'qr-captcha-iframe',
        src: this.noscriptURL()
      });
      div = $.el('div');
      textarea = $.el('textarea');
      $.add(div, textarea);
      return $.add(this.nodes.container, [iframe, div]);
    },
    setupJS: function() {
      return $.global(function() {
        var cbNative, render;
        render = function() {
          var classList, container;
          classList = document.documentElement.classList;
          container = document.querySelector('#qr .captcha-container');
          return container.dataset.widgetID = window.grecaptcha.render(container, {
            sitekey: '6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc',
            theme: classList.contains('tomorrow') || classList.contains('dark-captcha') ? 'dark' : 'light',
            callback: function(response) {
              return window.dispatchEvent(new CustomEvent('captcha:success', {
                detail: response
              }));
            }
          });
        };
        if (window.grecaptcha) {
          return render();
        } else {
          cbNative = window.onRecaptchaLoaded;
          return window.onRecaptchaLoaded = function() {
            render();
            return cbNative();
          };
        }
      });
    },
    afterSetup: function(mutations) {
      var iframe, j, k, len, len1, mutation, node, ref, textarea;
      for (j = 0, len = mutations.length; j < len; j++) {
        mutation = mutations[j];
        ref = mutation.addedNodes;
        for (k = 0, len1 = ref.length; k < len1; k++) {
          node = ref[k];
          if ((iframe = $.x('./descendant-or-self::iframe', node))) {
            this.setupIFrame(iframe);
          }
          if ((textarea = $.x('./descendant-or-self::textarea', node))) {
            this.setupTextArea(textarea);
          }
        }
      }
    },
    setupIFrame: function(iframe) {
      if (!doc.contains(iframe)) {
        return;
      }
      Captcha.replace.iframe(iframe);
      $.addClass(QR.nodes.el, 'captcha-open');
      this.fixQRPosition();
      $.on(iframe, 'load', this.fixQRPosition);
      if (d.activeElement === this.nodes.counter) {
        iframe.focus();
      }
      return $.global(function() {
        var f;
        f = document.querySelector('#qr iframe');
        return f.focus = f.blur = function() {};
      });
    },
    fixQRPosition: function() {
      if (QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight) {
        QR.nodes.el.style.top = null;
        return QR.nodes.el.style.bottom = '0px';
      }
    },
    setupTextArea: function(textarea) {
      return $.one(textarea, 'input', (function(_this) {
        return function() {
          return _this.save(true);
        };
      })(this));
    },
    destroy: function() {
      var garbage, i, ins, node, ref;
      if (!this.isEnabled) {
        return;
      }
      delete this.timeouts.destroy;
      $.rmClass(QR.nodes.el, 'captcha-open');
      if (this.nodes.container) {
        $.rm(this.nodes.container);
      }
      delete this.nodes.container;
      garbage = $.X('//iframe[starts-with(@src, "https://www.google.com/recaptcha/api2/frame")]/ancestor-or-self::*[parent::body]');
      i = 0;
      while (node = garbage.snapshotItem(i++)) {
        if (((ref = (ins = node.nextSibling)) != null ? ref.nodeName : void 0) === 'INS') {
          $.rm(ins);
        }
        $.rm(node);
      }
    },
    sync: function(captchas) {
      if (captchas == null) {
        captchas = [];
      }
      this.captchas = captchas;
      this.clear();
      return this.count();
    },
    getOne: function() {
      var captcha;
      this.clear();
      if ((captcha = this.captchas.shift())) {
        $.set('captchas', this.captchas);
        this.count();
        return captcha;
      } else {
        return null;
      }
    },
    save: function(pasted, token) {
      var base, focus, ref;
      $.forceSync('captchas');
      this.captchas.push({
        response: token || $('textarea', this.nodes.container).value,
        timeout: Date.now() + this.lifetime
      });
      this.captchas.sort(function(a, b) {
        return a.timeout - b.timeout;
      });
      $.set('captchas', this.captchas);
      this.count();
      focus = ((ref = d.activeElement) != null ? ref.nodeName : void 0) === 'IFRAME' && /https?:\/\/www\.google\.com\/recaptcha\//.test(d.activeElement.src);
      if (this.needed()) {
        if (focus) {
          if (QR.cooldown.auto || Conf['Post on Captcha Completion']) {
            this.nodes.counter.focus();
          } else {
            QR.nodes.status.focus();
          }
        }
        this.reload();
      } else {
        if (pasted) {
          this.destroy();
        } else {
          if ((base = this.timeouts).destroy == null) {
            base.destroy = setTimeout(this.destroy.bind(this), 3 * $.SECOND);
          }
        }
        if (focus) {
          QR.nodes.status.focus();
        }
      }
      if (Conf['Post on Captcha Completion'] && !QR.cooldown.auto) {
        return QR.submit();
      }
    },
    clear: function() {
      var captcha, i, j, len, now, ref;
      if (!this.captchas.length) {
        return;
      }
      $.forceSync('captchas');
      now = Date.now();
      ref = this.captchas;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        captcha = ref[i];
        if (captcha.timeout > now) {
          break;
        }
      }
      if (!i) {
        return;
      }
      this.captchas = this.captchas.slice(i);
      this.count();
      $.set('captchas', this.captchas);
      return this.setup(d.activeElement === QR.nodes.status);
    },
    count: function() {
      this.nodes.counter.textContent = "Captchas: " + this.captchas.length;
      clearTimeout(this.timeouts.clear);
      if (this.captchas.length) {
        return this.timeouts.clear = setTimeout(this.clear.bind(this), this.captchas[0].timeout - Date.now());
      }
    },
    reload: function() {
      if ($('iframe[src^="https://www.google.com/recaptcha/api/fallback?"]', this.nodes.container)) {
        this.destroy();
        return this.setup(false, true);
      } else {
        return $.global(function() {
          var container;
          container = document.querySelector('#qr .captcha-container');
          return window.grecaptcha.reset(container.dataset.widgetID);
        });
      }
    }
  };

}).call(this);

PassLink = (function() {
  var PassLink;

  PassLink = {
    init: function() {
      if (!Conf['Pass Link']) {
        return;
      }
      return Main.ready(this.ready);
    },
    ready: function() {
      var passLink, styleSelector;
      if (!(styleSelector = $.id('styleSelector'))) {
        return;
      }
      passLink = $.el('span', {
        className: 'brackets-wrap pass-link-container'
      });
      $.extend(passLink, {
        innerHTML: "<a href=\"javascript:;\">4chan Pass</a>"
      });
      $.on(passLink.firstElementChild, 'click', function() {
        return window.open('//sys.4chan.org/auth', Date.now(), 'width=500,height=280,toolbar=0');
      });
      return $.before(styleSelector.previousSibling, [passLink, $.tn('\u00A0\u00A0')]);
    }
  };

  return PassLink;

}).call(this);

PostSuccessful = (function() {
  var PostSuccessful;

  PostSuccessful = {
    init: function() {
      if (!Conf['Remember Your Posts']) {
        return;
      }
      return $.ready(this.ready);
    },
    ready: function() {
      var _, db, postID, ref, threadID;
      if (d.title !== 'Post successful!') {
        return;
      }
      ref = $('h1').nextSibling.textContent.match(/thread:(\d+),no:(\d+)/), _ = ref[0], threadID = ref[1], postID = ref[2];
      postID = +postID;
      threadID = +threadID || postID;
      db = new DataBoard('yourPosts');
      return db.set({
        boardID: g.BOARD.ID,
        threadID: threadID,
        postID: postID,
        val: true
      });
    }
  };

  return PostSuccessful;

}).call(this);

QR = (function() {
  var QR,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  QR = {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/vnd.adobe.flash.movie', 'application/x-shockwave-flash', 'video/webm'],
    validExtension: /\.(jpe?g|png|gif|pdf|swf|webm)$/i,
    typeFromExtension: {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'swf': 'application/vnd.adobe.flash.movie',
      'webm': 'video/webm'
    },
    extensionFromType: {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'application/pdf': 'pdf',
      'application/vnd.adobe.flash.movie': 'swf',
      'application/x-shockwave-flash': 'swf',
      'video/webm': 'webm'
    },
    init: function() {
      var sc, version;
      if (!Conf['Quick Reply']) {
        return;
      }
      this.posts = [];
      if (g.VIEW === 'archive') {
        return;
      }
      version = Conf['Use Recaptcha v1'] && Main.jsEnabled ? 'v1' : 'v2';
      this.captcha = Captcha[version];
      $.on(d, '4chanXInitFinished', this.initReady);
      Callbacks.Post.push({
        name: 'Quick Reply',
        cb: this.node
      });
      if (Conf['QR Shortcut']) {
        this.shortcut = sc = $.el('a', {
          className: 'qr-shortcut fa fa-comment-o disabled',
          textContent: 'QR',
          title: 'Quick Reply',
          href: 'javascript:;'
        });
        $.on(sc, 'click', function() {
          if (!QR.postingIsEnabled) {
            return;
          }
          if (Conf['Persistent QR'] || !QR.nodes || QR.nodes.el.hidden) {
            QR.open();
            return QR.nodes.com.focus();
          } else {
            return QR.close();
          }
        });
        return Header.addShortcut(sc, 540);
      }
    },
    initReady: function() {
      var link, linkBot, navLinksBot, origToggle;
      $.off(d, '4chanXInitFinished', this.initReady);
      QR.postingIsEnabled = !!$.id('postForm');
      if (!QR.postingIsEnabled) {
        return;
      }
      link = $.el('h1', {
        className: "qr-link-container"
      });
      $.extend(link, {
        innerHTML: "<a href=\"javascript:;\" class=\"qr-link\">" + ((g.VIEW === "thread") ? "Reply to Thread" : "Start a Thread") + "</a>"
      });
      QR.link = link.firstElementChild;
      $.on(link.firstChild, 'click', function() {
        QR.open();
        return QR.nodes.com.focus();
      });
      if (Conf['Bottom QR Link'] && g.VIEW === 'thread') {
        linkBot = $.el('div', {
          className: "brackets-wrap qr-link-container-bottom"
        });
        $.extend(linkBot, {
          innerHTML: "<a href=\"javascript:;\" class=\"qr-link-bottom\">Reply to Thread</a>"
        });
        $.on(linkBot.firstElementChild, 'click', function() {
          QR.open();
          return QR.nodes.com.focus();
        });
        if ((navLinksBot = $('.navLinksBot'))) {
          $.prepend(navLinksBot, linkBot);
        }
      }
      origToggle = $.id('togglePostFormLink');
      $.before(origToggle, link);
      origToggle.firstElementChild.textContent = 'Original Form';
      $.on(d, 'QRGetFile', QR.getFile);
      $.on(d, 'QRSetFile', QR.setFile);
      $.on(d, 'paste', QR.paste);
      $.on(d, 'dragover', QR.dragOver);
      $.on(d, 'drop', QR.dropFile);
      $.on(d, 'dragstart dragend', QR.drag);
      $.on(d, 'IndexRefresh', QR.generatePostableThreadsList);
      $.on(d, 'ThreadUpdate', QR.statusCheck);
      if (!Conf['Persistent QR']) {
        return;
      }
      QR.open();
      if (Conf['Auto Hide QR']) {
        return QR.hide();
      }
    },
    statusCheck: function() {
      var thread;
      if (!QR.nodes) {
        return;
      }
      thread = QR.posts[0].thread;
      if (thread !== 'new' && g.threads[g.BOARD + "." + thread].isDead) {
        return QR.abort();
      } else {
        return QR.status();
      }
    },
    node: function() {
      $.on(this.nodes.quote, 'click', QR.quote);
      if (this.isFetchedQuote) {
        return QR.generatePostableThreadsList();
      }
    },
    open: function() {
      var err;
      if (QR.nodes) {
        if (QR.nodes.el.hidden) {
          QR.captcha.setup();
        }
        QR.nodes.el.hidden = false;
        QR.unhide();
      } else {
        try {
          QR.dialog();
        } catch (_error) {
          err = _error;
          delete QR.nodes;
          Main.handleErrors({
            message: 'Quick Reply dialog creation crashed.',
            error: err
          });
          return;
        }
      }
      if (Conf['QR Shortcut']) {
        return $.rmClass(QR.shortcut, 'disabled');
      }
    },
    close: function() {
      var j, len, post, ref;
      if (QR.req) {
        QR.abort();
        return;
      }
      QR.nodes.el.hidden = true;
      QR.cleanNotifications();
      d.activeElement.blur();
      $.rmClass(QR.nodes.el, 'dump');
      if (Conf['QR Shortcut']) {
        $.addClass(QR.shortcut, 'disabled');
      }
      new QR.post(true);
      ref = QR.posts.splice(0, QR.posts.length - 1);
      for (j = 0, len = ref.length; j < len; j++) {
        post = ref[j];
        post["delete"]();
      }
      QR.cooldown.auto = false;
      QR.status();
      return QR.captcha.destroy();
    },
    focus: function() {
      return $.queueTask(function() {
        if (!QR.inBubble()) {
          QR.hasFocus = d.activeElement && QR.nodes.el.contains(d.activeElement);
          return QR.nodes.el.classList.toggle('focus', QR.hasFocus);
        }
      });
    },
    inBubble: function() {
      var bubbles, ref;
      bubbles = $$('iframe[src^="https://www.google.com/recaptcha/api2/frame"]');
      return (ref = d.activeElement, indexOf.call(bubbles, ref) >= 0) || bubbles.some(function(el) {
        return getComputedStyle(el).visibility !== 'hidden' && el.getBoundingClientRect().bottom > 0;
      });
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
    toggleSJIS: function(e) {
      e.preventDefault();
      Conf['sjisPreview'] = !Conf['sjisPreview'];
      $.set('sjisPreview', Conf['sjisPreview']);
      return QR.nodes.el.classList.toggle('sjis-preview', Conf['sjisPreview']);
    },
    texPreviewShow: function() {
      if ($.hasClass(QR.nodes.el, 'tex-preview')) {
        return QR.texPreviewHide();
      }
      $.addClass(QR.nodes.el, 'tex-preview');
      QR.nodes.texPreview.textContent = QR.nodes.com.value;
      return $.event('mathjax', null, QR.nodes.texPreview);
    },
    texPreviewHide: function() {
      return $.rmClass(QR.nodes.el, 'tex-preview');
    },
    setCustomCooldown: function(enabled) {
      Conf['customCooldownEnabled'] = enabled;
      QR.cooldown.customCooldown = enabled;
      return QR.nodes.customCooldown.classList.toggle('disabled', !enabled);
    },
    toggleCustomCooldown: function() {
      var enabled;
      enabled = $.hasClass(this, 'disabled');
      QR.setCustomCooldown(enabled);
      return $.set('customCooldownEnabled', enabled);
    },
    error: function(err, focusOverride) {
      var el, notice, notif;
      QR.open();
      if (typeof err === 'string') {
        el = $.tn(err);
      } else {
        el = err;
        el.removeAttribute('style');
      }
      notice = new Notice('warning', el);
      QR.notifications.push(notice);
      if (!Header.areNotificationsEnabled) {
        if (d.hidden && !QR.cooldown.auto) {
          return alert(el.textContent);
        }
      } else if (d.hidden || !(focusOverride || d.hasFocus())) {
        try {
          notif = new Notification(el.textContent, {
            body: el.textContent,
            icon: Favicon.logo
          });
          notif.onclick = function() {
            return $.global(function() {
              return window.focus();
            });
          };
          if ($.engine !== 'gecko') {
            notif.onclose = function() {
              return notice.close();
            };
            return notif.onshow = function() {
              return setTimeout(function() {
                notif.onclose = null;
                return notif.close();
              }, 7 * $.SECOND);
            };
          }
        } catch (_error) {}
      }
    },
    notifications: [],
    cleanNotifications: function() {
      var j, len, notification, ref;
      ref = QR.notifications;
      for (j = 0, len = ref.length; j < len; j++) {
        notification = ref[j];
        notification.close();
      }
      return QR.notifications = [];
    },
    status: function() {
      var disabled, status, thread, value;
      if (!QR.nodes) {
        return;
      }
      thread = QR.posts[0].thread;
      if (thread !== 'new' && g.threads[g.BOARD + "." + thread].isDead) {
        value = 'Dead';
        disabled = true;
        QR.cooldown.auto = false;
      }
      value = QR.req ? QR.req.progress : QR.cooldown.seconds || value;
      status = QR.nodes.status;
      status.value = !value ? 'Submit' : QR.cooldown.auto ? "Auto " + value : value;
      return status.disabled = disabled || false;
    },
    openPost: function() {
      var index;
      QR.open();
      if (QR.selected.isLocked) {
        index = QR.posts.indexOf(QR.selected);
        (QR.posts[index + 1] || new QR.post()).select();
        $.addClass(QR.nodes.el, 'dump');
        return QR.cooldown.auto = true;
      }
    },
    quote: function(e) {
      var ancestor, caretPos, com, frag, insideCode, j, k, l, len, len1, len2, len3, len4, len5, n, node, o, post, q, range, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, sel, text, thread;
      if (e != null) {
        e.preventDefault();
      }
      if (!QR.postingIsEnabled) {
        return;
      }
      sel = d.getSelection();
      post = Get.postFromNode(this);
      text = post.board.ID === g.BOARD.ID ? ">>" + post + "\n" : ">>>/" + post.board + "/" + post + "\n";
      if (sel.toString().trim() && post === Get.postFromNode(sel.anchorNode)) {
        range = sel.getRangeAt(0);
        frag = range.cloneContents();
        ancestor = range.commonAncestorContainer;
        if ($.x('ancestor-or-self::*[self::s or contains(@class,"removed-spoiler")]', ancestor)) {
          $.prepend(frag, $.tn('[spoiler]'));
          $.add(frag, $.tn('[/spoiler]'));
        }
        if (insideCode = $.x('ancestor-or-self::pre[contains(@class,"prettyprint")]', ancestor)) {
          $.prepend(frag, $.tn('[code]'));
          $.add(frag, $.tn('[/code]'));
        }
        ref = $$((insideCode ? 'br' : '.prettyprint br'), frag);
        for (j = 0, len = ref.length; j < len; j++) {
          node = ref[j];
          $.replace(node, $.tn('\n'));
        }
        ref1 = $$('br', frag);
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          node = ref1[k];
          if (node !== frag.lastChild) {
            $.replace(node, $.tn('\n>'));
          }
        }
        ref2 = $$('s, .removed-spoiler', frag);
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          node = ref2[l];
          $.replace(node, [$.tn('[spoiler]')].concat(slice.call(node.childNodes), [$.tn('[/spoiler]')]));
        }
        ref3 = $$('.prettyprint', frag);
        for (n = 0, len3 = ref3.length; n < len3; n++) {
          node = ref3[n];
          $.replace(node, [$.tn('[code]')].concat(slice.call(node.childNodes), [$.tn('[/code]')]));
        }
        ref4 = $$('.linkify[data-original]', frag);
        for (o = 0, len4 = ref4.length; o < len4; o++) {
          node = ref4[o];
          $.replace(node, $.tn(node.dataset.original));
        }
        ref5 = $$('.embedder', frag);
        for (q = 0, len5 = ref5.length; q < len5; q++) {
          node = ref5[q];
          if (((ref6 = node.previousSibling) != null ? ref6.nodeValue : void 0) === ' ') {
            $.rm(node.previousSibling);
          }
          $.rm(node);
        }
        text += ">" + (frag.textContent.trim()) + "\n";
      }
      QR.openPost();
      ref7 = QR.nodes, com = ref7.com, thread = ref7.thread;
      if (!com.value) {
        thread.value = Get.threadFromNode(this);
      }
      caretPos = com.selectionStart;
      com.value = com.value.slice(0, caretPos) + text + com.value.slice(com.selectionEnd);
      range = caretPos + text.length;
      com.setSelectionRange(range, range);
      com.focus();
      QR.selected.save(com);
      return QR.selected.save(thread);
    },
    characterCount: function() {
      var count, counter;
      counter = QR.nodes.charCount;
      count = QR.nodes.com.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '_').length;
      counter.textContent = count;
      counter.hidden = count < QR.max_comment / 2;
      return (count > QR.max_comment ? $.addClass : $.rmClass)(counter, 'warning');
    },
    getFile: function() {
      var ref;
      return $.event('QRFile', (ref = QR.selected) != null ? ref.file : void 0);
    },
    setFile: function(e) {
      var file, name, ref, source;
      ref = e.detail, file = ref.file, name = ref.name, source = ref.source;
      if (name != null) {
        file.name = name;
      }
      if (source != null) {
        file.source = source;
      }
      QR.open();
      return QR.handleFiles([file]);
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
      return QR.handleFiles(e.dataTransfer.files);
    },
    paste: function(e) {
      var blob, files, item, j, len, ref;
      if (!e.clipboardData.items) {
        return;
      }
      files = [];
      ref = e.clipboardData.items;
      for (j = 0, len = ref.length; j < len; j++) {
        item = ref[j];
        if (!(item.kind === 'file')) {
          continue;
        }
        blob = item.getAsFile();
        blob.name = 'file';
        if (blob.type) {
          blob.name += '.' + blob.type.split('/')[1];
        }
        files.push(blob);
      }
      if (!files.length) {
        return;
      }
      QR.open();
      QR.handleFiles(files);
      return $.addClass(QR.nodes.el, 'dump');
    },
    pasteFF: function() {
      var arr, blob, bstr, i, images, img, j, k, len, m, pasteArea, ref, src;
      pasteArea = QR.nodes.pasteArea;
      if (!pasteArea.childNodes.length) {
        return;
      }
      images = $$('img', pasteArea);
      $.rmAll(pasteArea);
      for (j = 0, len = images.length; j < len; j++) {
        img = images[j];
        src = img.src;
        if (m = src.match(/data:(image\/(\w+));base64,(.+)/)) {
          bstr = atob(m[3]);
          arr = new Uint8Array(bstr.length);
          for (i = k = 0, ref = bstr.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
            arr[i] = bstr.charCodeAt(i);
          }
          blob = new Blob([arr], {
            type: m[1]
          });
          blob.name = "file." + m[2];
          QR.handleFiles([blob]);
        } else if (/^https?:\/\//.test(src)) {
          QR.handleUrl(src);
        }
      }
    },
    handleUrl: function(urlDefault) {
      var url;
      url = prompt('Enter a URL:', urlDefault);
      if (url === null) {
        return;
      }
      QR.nodes.fileButton.focus();
      return CrossOrigin.file(url, function(blob) {
        if (blob && !/^text\//.test(blob.type)) {
          return QR.handleFiles([blob]);
        } else {
          return QR.error("Can't load file.");
        }
      });
    },
    handleFiles: function(files) {
      var file, j, len;
      if (this !== QR) {
        files = slice.call(this.files);
        this.value = null;
      }
      if (!files.length) {
        return;
      }
      QR.cleanNotifications();
      for (j = 0, len = files.length; j < len; j++) {
        file = files[j];
        QR.handleFile(file, files.length);
      }
      if (files.length !== 1) {
        $.addClass(QR.nodes.el, 'dump');
      }
      if (d.activeElement === QR.nodes.fileButton && $.hasClass(QR.nodes.fileSubmit, 'has-file')) {
        return QR.nodes.filename.focus();
      }
    },
    handleFile: function(file, nfiles) {
      var isText, post;
      isText = /^text\//.test(file.type);
      if (nfiles === 1) {
        post = QR.selected;
      } else {
        post = QR.posts[QR.posts.length - 1];
        if ((isText ? post.com || post.pasting : post.file)) {
          post = new QR.post();
        }
      }
      return post[isText ? 'pasteText' : 'setFile'](file);
    },
    openFileInput: function() {
      if (QR.nodes.fileButton.disabled) {
        return;
      }
      QR.nodes.fileInput.click();
      return QR.nodes.fileButton.focus();
    },
    generatePostableThreadsList: function() {
      var j, len, list, options, ref, thread, val;
      if (!QR.nodes) {
        return;
      }
      list = QR.nodes.thread;
      options = [list.firstElementChild];
      ref = g.BOARD.threads.keys;
      for (j = 0, len = ref.length; j < len; j++) {
        thread = ref[j];
        options.push($.el('option', {
          value: thread,
          textContent: "Thread " + thread
        }));
      }
      val = list.value;
      $.rmAll(list);
      $.add(list, options);
      list.value = val;
      if (list.value === val) {
        return;
      }
      list.value = g.VIEW === 'thread' ? g.THREADID : 'new';
      return (g.VIEW === 'thread' ? $.addClass : $.rmClass)(QR.nodes.el, 'reply-to-thread');
    },
    dialog: function() {
      var dialog, event, i, items, m, match_max, match_min, name, node, nodes, ref, rules, save, scriptData, setNode;
      QR.nodes = nodes = {
        el: dialog = UI.dialog('qr', 'top: 50px; right: 0px;', {
          innerHTML: "<div class=\"move\"><label><input type=\"checkbox\" id=\"autohide\" title=\"Auto-hide\">Quick Reply</label><a href=\"javascript:;\" class=\"close\" title=\"Close\">×</a><select data-name=\"thread\" title=\"Create a new thread / Reply\"><option value=\"new\">New thread</option></select></div><form><div class=\"persona\"><button type=\"button\" id=\"sjis-toggle\" title=\"Toggle Mona font\">∀</button><button type=\"button\" id=\"tex-preview-button\" title=\"Preview TeX\">T<sub>E</sub>X</button><input name=\"name\" data-name=\"name\" list=\"list-name\" placeholder=\"Name\" class=\"field\" size=\"1\"><input name=\"email\" data-name=\"email\" list=\"list-email\" placeholder=\"Options\" class=\"field\" size=\"1\"><input name=\"sub\" data-name=\"sub\" list=\"list-sub\" placeholder=\"Subject\" class=\"field\" size=\"1\"></div><div class=\"textarea\"><textarea data-name=\"com\" placeholder=\"Comment\" class=\"field\"></textarea><span id=\"char-count\"></span><div id=\"tex-preview\"></div></div><div id=\"dump-list-container\"><div id=\"dump-list\"></div><a id=\"add-post\" href=\"javascript:;\" title=\"Add a post\">+</a></div><div class=\"oekaki\" hidden><input type=\"button\" id=\"qr-draw-button\" value=\"Draw\"><label><span>Width:</span><input name=\"oekaki-width\" value=\"400\" type=\"number\" class=\"field\" size=\"1\"></label><label><span>Height:</span><input name=\"oekaki-height\" value=\"400\" type=\"number\" class=\"field\" size=\"1\"></label><span class=\"oekaki-bg\" title=\"Background Color\"><input name=\"oekaki-bg\" type=\"checkbox\" checked><input name=\"oekaki-bgcolor\" type=\"color\" value=\"#ffffff\"></span></div><div id=\"file-n-submit\"><input type=\"button\" id=\"qr-file-button\" value=\"Files\"><span id=\"qr-filename-container\" class=\"field\"><span id=\"qr-no-file\">No selected file</span><input id=\"qr-filename\" data-name=\"filename\" spellcheck=\"false\"><label id=\"qr-spoiler-label\"><input type=\"checkbox\" id=\"qr-file-spoiler\" title=\"Spoiler image\"><a class=\"checkbox-letter\">S</a></label><a id=\"qr-oekaki-button\" title=\"Edit in Tegaki\"><i class=\"fa fa-edit\"></i></a><a href=\"javascript:;\" id=\"qr-filerm\" title=\"Remove file\"><i class=\"fa fa-times-circle\"></i></a><a id=\"url-button\" title=\"Post from url\"><i class=\"fa fa-link\"></i></a><a hidden id=\"paste-area\" title=\"Select to paste images\" class=\"fa fa-clipboard\" tabindex=\"-1\" contentEditable=\"true\"></a><a id=\"custom-cooldown-button\" title=\"Toggle custom cooldown\" class=\"disabled\"><i class=\"fa fa-clock-o\"></i></a><a id=\"dump-button\" title=\"Dump list\"><i class=\"fa fa-plus-square\"></i></a></span><input type=\"submit\"></div><select data-default=\"4\" name=\"filetag\"><option value=\"0\">Hentai</option><option value=\"6\">Porn</option><option value=\"1\">Japanese</option><option value=\"2\">Anime</option><option value=\"3\">Game</option><option value=\"5\">Loop</option><option value=\"4\" selected>Other</option></select><input type=\"file\" multiple></form><datalist id=\"list-name\"></datalist><datalist id=\"list-email\"></datalist><datalist id=\"list-sub\"></datalist> "
        })
      };
      setNode = function(name, query) {
        return nodes[name] = $(query, dialog);
      };
      setNode('move', '.move');
      setNode('autohide', '#autohide');
      setNode('close', '.close');
      setNode('thread', 'select');
      setNode('form', 'form');
      setNode('sjisToggle', '#sjis-toggle');
      setNode('texButton', '#tex-preview-button');
      setNode('name', '[data-name=name]');
      setNode('email', '[data-name=email]');
      setNode('sub', '[data-name=sub]');
      setNode('com', '[data-name=com]');
      setNode('charCount', '#char-count');
      setNode('texPreview', '#tex-preview');
      setNode('dumpList', '#dump-list');
      setNode('addPost', '#add-post');
      setNode('oekaki', '.oekaki');
      setNode('drawButton', '#qr-draw-button');
      setNode('fileSubmit', '#file-n-submit');
      setNode('fileButton', '#qr-file-button');
      setNode('noFile', '#qr-no-file');
      setNode('filename', '#qr-filename');
      setNode('spoiler', '#qr-file-spoiler');
      setNode('oekakiButton', '#qr-oekaki-button');
      setNode('fileRM', '#qr-filerm');
      setNode('urlButton', '#url-button');
      setNode('pasteArea', '#paste-area');
      setNode('customCooldown', '#custom-cooldown-button');
      setNode('dumpButton', '#dump-button');
      setNode('status', '[type=submit]');
      setNode('flashTag', '[name=filetag]');
      setNode('fileInput', '[type=file]');
      rules = $('ul.rules').textContent.trim();
      match_min = rules.match(/.+smaller than (\d+)x(\d+).+/);
      match_max = rules.match(/.+greater than (\d+)x(\d+).+/);
      QR.min_width = +(match_min != null ? match_min[1] : void 0) || 1;
      QR.min_height = +(match_min != null ? match_min[2] : void 0) || 1;
      QR.max_width = +(match_max != null ? match_max[1] : void 0) || 10000;
      QR.max_height = +(match_max != null ? match_max[2] : void 0) || 10000;
      scriptData = Get.scriptData();
      QR.max_size = (m = scriptData.match(/\bmaxFilesize *= *(\d+)\b/)) ? +m[1] : 4194304;
      QR.max_size_video = (m = scriptData.match(/\bmaxWebmFilesize *= *(\d+)\b/)) ? +m[1] : QR.max_size;
      QR.max_comment = (m = scriptData.match(/\bcomlen *= *(\d+)\b/)) ? +m[1] : 2000;
      QR.max_width_video = QR.max_height_video = 2048;
      QR.max_duration_video = (ref = g.BOARD.ID) === 'gif' || ref === 'wsg' ? 300 : 120;
      if (Conf['Show New Thread Option in Threads']) {
        $.addClass(QR.nodes.el, 'show-new-thread-option');
      }
      if (Conf['Show Name and Subject']) {
        $.addClass(QR.nodes.name, 'force-show');
        $.addClass(QR.nodes.sub, 'force-show');
        QR.nodes.email.placeholder = 'E-mail';
      }
      QR.forcedAnon = !!$('form[name="post"] input[name="name"][type="hidden"]');
      if (QR.forcedAnon) {
        $.addClass(QR.nodes.el, 'forced-anon');
      }
      QR.spoiler = !!$('.postForm input[name=spoiler]');
      if (QR.spoiler) {
        $.addClass(QR.nodes.el, 'has-spoiler');
      }
      if (g.BOARD.ID === 'jp' && Conf['sjisPreview']) {
        $.addClass(QR.nodes.el, 'sjis-preview');
      }
      if (parseInt(Conf['customCooldown'], 10) > 0) {
        $.addClass(QR.nodes.fileSubmit, 'custom-cooldown');
        $.get('customCooldownEnabled', Conf['customCooldownEnabled'], function(arg) {
          var customCooldownEnabled;
          customCooldownEnabled = arg.customCooldownEnabled;
          QR.setCustomCooldown(customCooldownEnabled);
          return $.sync('customCooldownEnabled', QR.setCustomCooldown);
        });
      }
      $.on(nodes.autohide, 'change', QR.toggleHide);
      $.on(nodes.close, 'click', QR.close);
      $.on(nodes.form, 'submit', QR.submit);
      $.on(nodes.sjisToggle, 'click', QR.toggleSJIS);
      $.on(nodes.texButton, 'mousedown', QR.texPreviewShow);
      $.on(nodes.texButton, 'mouseup', QR.texPreviewHide);
      $.on(nodes.addPost, 'click', function() {
        return new QR.post(true);
      });
      $.on(nodes.drawButton, 'click', QR.oekaki.draw);
      $.on(nodes.fileButton, 'click', QR.openFileInput);
      $.on(nodes.noFile, 'click', QR.openFileInput);
      $.on(nodes.filename, 'focus', function() {
        return $.addClass(this.parentNode, 'focus');
      });
      $.on(nodes.filename, 'blur', function() {
        return $.rmClass(this.parentNode, 'focus');
      });
      $.on(nodes.spoiler, 'change', function() {
        return QR.selected.nodes.spoiler.click();
      });
      $.on(nodes.oekakiButton, 'click', QR.oekaki.button);
      $.on(nodes.fileRM, 'click', function() {
        return QR.selected.rmFile();
      });
      $.on(nodes.urlButton, 'click', function() {
        return QR.handleUrl('');
      });
      $.on(nodes.customCooldown, 'click', QR.toggleCustomCooldown);
      $.on(nodes.dumpButton, 'click', function() {
        return nodes.el.classList.toggle('dump');
      });
      $.on(nodes.fileInput, 'change', QR.handleFiles);
      window.addEventListener('focus', QR.focus, true);
      window.addEventListener('blur', QR.focus, true);
      $.on(d, 'click', QR.focus);
      if ($.engine === 'gecko') {
        nodes.pasteArea.hidden = false;
        new MutationObserver(QR.pasteFF).observe(nodes.pasteArea, {
          childList: true
        });
      }
      items = ['thread', 'name', 'email', 'sub', 'com', 'filename'];
      i = 0;
      save = function() {
        return QR.selected.save(this);
      };
      while (name = items[i++]) {
        if (!(node = nodes[name])) {
          continue;
        }
        event = node.nodeName === 'SELECT' ? 'change' : 'input';
        $.on(nodes[name], event, save);
      }
      if ($.engine === 'gecko' && Conf['Remember QR Size']) {
        $.get('QR Size', '', function(item) {
          return nodes.com.style.cssText = item['QR Size'];
        });
        $.on(nodes.com, 'mouseup', function(e) {
          if (e.button !== 0) {
            return;
          }
          return $.set('QR Size', this.style.cssText);
        });
      }
      QR.generatePostableThreadsList();
      QR.persona.load();
      new QR.post(true);
      QR.status();
      QR.cooldown.setup();
      QR.captcha.init();
      $.add(d.body, dialog);
      QR.captcha.setup();
      QR.oekaki.setup();
      return $.event('QRDialogCreation', null, dialog);
    },
    submit: function(e) {
      var captcha, cb, err, extra, filetag, formData, options, post, ref, textOnly, thread, threadID;
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
      threadID = post.thread;
      thread = g.BOARD.threads[threadID];
      if (g.BOARD.ID === 'f' && threadID === 'new') {
        filetag = QR.nodes.flashTag.value;
      }
      if (threadID === 'new') {
        threadID = null;
        if (g.BOARD.ID === 'vg' && !post.sub) {
          err = 'New threads require a subject.';
        } else if (!($.hasClass(d.body, 'text_only') || post.file || (textOnly = !!$('input[name=textonly]', $.id('postForm'))))) {
          err = 'No file selected.';
        }
      } else if (g.BOARD.threads[threadID].isClosed) {
        err = 'You can\'t reply to this thread anymore.';
      } else if (!(post.com || post.file)) {
        err = 'No comment or file.';
      } else if (post.file && thread.fileLimit) {
        err = 'Max limit of image replies has been reached.';
      }
      if (g.BOARD.ID === 'r9k' && !((ref = post.com) != null ? ref.match(/[a-z-]/i) : void 0)) {
        err || (err = 'Original comment required.');
      }
      if (QR.captcha.isEnabled && !err) {
        captcha = QR.captcha.getOne();
        if (!captcha) {
          err = 'No valid captcha.';
          QR.captcha.setup(!QR.cooldown.auto || d.activeElement === QR.nodes.status);
        }
      }
      QR.cleanNotifications();
      if (err) {
        QR.cooldown.auto = false;
        QR.status();
        QR.error(err);
        return;
      }
      QR.cooldown.auto = QR.posts.length > 1;
      if (Conf['Auto Hide QR'] && !QR.cooldown.auto) {
        QR.hide();
      }
      if (!QR.cooldown.auto && $.x('ancestor::div[@id="qr"]', d.activeElement)) {
        d.activeElement.blur();
      }
      post.lock();
      formData = {
        resto: threadID,
        name: !QR.forcedAnon ? post.name : void 0,
        email: post.email,
        sub: !(QR.forcedAnon || threadID) ? post.sub : void 0,
        com: post.com,
        upfile: post.file,
        filetag: filetag,
        spoiler: post.spoiler,
        textonly: textOnly,
        mode: 'regist',
        pwd: QR.persona.getPassword()
      };
      options = {
        responseType: 'document',
        withCredentials: true,
        onload: QR.response,
        onerror: function() {
          delete QR.req;
          post.unlock();
          QR.cooldown.auto = false;
          QR.status();
          return QR.error($.el('span', {
            innerHTML: "Connection error while posting. [<a href=\"https://github.com/ccd0/4chan-x/wiki/Frequently-Asked-Questions#connection-errors\" target=\"_blank\">More info</a>]"
          }));
        }
      };
      extra = {
        form: $.formData(formData),
        upCallbacks: {
          onload: function() {
            QR.req.isUploadFinished = true;
            QR.req.progress = '...';
            return QR.status();
          },
          onprogress: function(e) {
            QR.req.progress = (Math.round(e.loaded / e.total * 100)) + "%";
            return QR.status();
          }
        }
      };
      cb = function(response) {
        if (response != null) {
          if (response.challenge != null) {
            extra.form.append('recaptcha_challenge_field', response.challenge);
            extra.form.append('recaptcha_response_field', response.response);
          } else {
            extra.form.append('g-recaptcha-response', response.response);
          }
        }
        QR.req = $.ajax("https://sys.4chan.org/" + g.BOARD + "/post", options, extra);
        return QR.req.progress = '...';
      };
      if (typeof captcha === 'function') {
        QR.req = {
          progress: '...',
          abort: function() {
            return cb = null;
          }
        };
        captcha(function(response) {
          if (response) {
            return typeof cb === "function" ? cb(response) : void 0;
          } else {
            delete QR.req;
            post.unlock();
            QR.cooldown.auto = !!QR.captcha.captchas.length;
            return QR.status();
          }
        });
      } else {
        cb(captcha);
      }
      return QR.status();
    },
    response: function() {
      var URL, _, ban, err, h1, isReply, lastPostToThread, m, open, post, postID, postsCount, ref, ref1, ref2, req, resDoc, seconds, threadID;
      req = QR.req;
      delete QR.req;
      post = QR.posts[0];
      post.unlock();
      resDoc = req.response;
      if (ban = $('.banType', resDoc)) {
        err = $.el('span', ban.textContent.toLowerCase() === 'banned' ? {
          innerHTML: "You are banned on " + ($(".board", resDoc)).innerHTML + "! ;_;<br>Click <a href=\"//www.4chan.org/banned\" target=\"_blank\">here</a> to see the reason."
        } : {
          innerHTML: "You were issued a warning on " + ($(".board", resDoc)).innerHTML + " as " + ($(".nameBlock", resDoc)).innerHTML + ".<br>Reason: " + ($(".reason", resDoc)).innerHTML
        });
      } else if (err = resDoc.getElementById('errmsg')) {
        if ((ref = $('a', err)) != null) {
          ref.target = '_blank';
        }
      } else if (resDoc.title !== 'Post successful!') {
        err = 'Connection error with sys.4chan.org.';
      } else if (req.status !== 200) {
        err = "Error " + req.statusText + " (" + req.status + ")";
      }
      if (err) {
        if (/captcha|verification/i.test(err.textContent) || err === 'Connection error with sys.4chan.org.') {
          if (/mistyped/i.test(err.textContent)) {
            err = $.el('span', {
              innerHTML: "You mistyped the CAPTCHA, or the CAPTCHA malfunctioned [<a href=\"https://www.4chan-x.net/captchas.html\" target=\"_blank\">complain here</a>]."
            });
          } else if (/expired/i.test(err.textContent)) {
            err = 'This CAPTCHA is no longer valid because it has expired.';
          }
          QR.cooldown.auto = QR.captcha.isEnabled || err === 'Connection error with sys.4chan.org.';
          QR.cooldown.addDelay(post, 2);
        } else if (err.textContent && (m = err.textContent.match(/(?:(\d+)\s+minutes?\s+)?(\d+)\s+second/i)) && !/duplicate|hour/i.test(err.textContent)) {
          QR.cooldown.auto = !/have\s+been\s+muted/i.test(err.textContent);
          seconds = 60 * (+(m[1] || 0)) + (+m[2]);
          if (/muted/i.test(err.textContent)) {
            QR.cooldown.addMute(seconds);
          } else {
            QR.cooldown.addDelay(post, seconds);
          }
        } else {
          QR.cooldown.auto = false;
        }
        QR.captcha.setup(QR.cooldown.auto && ((ref1 = d.activeElement) === QR.nodes.status || ref1 === d.body));
        if (QR.captcha.isEnabled && !QR.captcha.captchas.length) {
          QR.cooldown.auto = false;
        }
        QR.status();
        QR.error(err);
        return;
      }
      h1 = $('h1', resDoc);
      ref2 = h1.nextSibling.textContent.match(/thread:(\d+),no:(\d+)/), _ = ref2[0], threadID = ref2[1], postID = ref2[2];
      postID = +postID;
      threadID = +threadID || postID;
      isReply = threadID !== postID;
      $.event('QRPostSuccessful', {
        boardID: g.BOARD.ID,
        threadID: threadID,
        postID: postID
      });
      $.event('QRPostSuccessful_', {
        boardID: g.BOARD.ID,
        threadID: threadID,
        postID: postID
      });
      postsCount = QR.posts.length - 1;
      QR.cooldown.auto = postsCount && isReply;
      lastPostToThread = !((function() {
        var j, len, p, ref3;
        ref3 = QR.posts.slice(1);
        for (j = 0, len = ref3.length; j < len; j++) {
          p = ref3[j];
          if (p.thread === post.thread) {
            return true;
          }
        }
      })());
      if (!(Conf['Persistent QR'] || postsCount)) {
        QR.close();
      } else {
        post.rm();
        QR.captcha.setup(d.activeElement === QR.nodes.status);
      }
      QR.cleanNotifications();
      if (Conf['Posting Success Notifications']) {
        QR.notifications.push(new Notice('success', h1.textContent, 5));
      }
      QR.cooldown.add(threadID, postID);
      URL = threadID === postID ? window.location.origin + "/" + g.BOARD + "/thread/" + threadID : g.VIEW === 'index' && lastPostToThread && Conf['Open Post in New Tab'] ? window.location.origin + "/" + g.BOARD + "/thread/" + threadID + "#p" + postID : void 0;
      if (URL) {
        open = Conf['Open Post in New Tab'] || postsCount ? function() {
          return $.open(URL);
        } : function() {
          return window.location = URL;
        };
        if (threadID === postID) {
          QR.waitForThread(URL, open);
        } else {
          open();
        }
      }
      return QR.status();
    },
    waitForThread: function(url, cb) {
      var attempts, check;
      attempts = 0;
      check = function() {
        return $.ajax(url, {
          onloadend: function() {
            attempts++;
            if (attempts >= 6 || this.status === 200) {
              return cb();
            } else {
              return setTimeout(check, attempts * $.SECOND);
            }
          }
        }, {
          type: 'HEAD'
        });
      };
      return check();
    },
    abort: function() {
      if (QR.req && !QR.req.isUploadFinished) {
        QR.req.abort();
        delete QR.req;
        QR.posts[0].unlock();
        QR.cooldown.auto = false;
        QR.notifications.push(new Notice('info', 'QR upload aborted.', 5));
      }
      return QR.status();
    }
  };

  return QR;

}).call(this);

(function() {
  QR.cooldown = {
    seconds: 0,
    delays: {
      thread: 0,
      reply: 0,
      image: 0,
      reply_intra: 0,
      image_intra: 0,
      deletion: 60,
      thread_global: 300
    },
    init: function() {
      if (!Conf['Quick Reply']) {
        return;
      }
      this.data = Conf['cooldowns'];
      return $.sync('cooldowns', this.sync);
    },
    setup: function() {
      var delay, m, ref, type;
      if (m = Get.scriptData().match(/\bcooldowns *= *({[^}]+})/)) {
        $.extend(QR.cooldown.delays, JSON.parse(m[1]));
      }
      QR.cooldown.maxDelay = 0;
      ref = QR.cooldown.delays;
      for (type in ref) {
        delay = ref[type];
        if (type !== 'thread' && type !== 'thread_global') {
          QR.cooldown.maxDelay = Math.max(QR.cooldown.maxDelay, delay);
        }
      }
      QR.cooldown.isSetup = true;
      return QR.cooldown.start();
    },
    start: function() {
      var data;
      data = QR.cooldown.data;
      if (!(Conf['Cooldown'] && QR.cooldown.isSetup && !QR.cooldown.isCounting && Object.keys(data[g.BOARD.ID] || {}).length + Object.keys(data.global || {}).length > 0)) {
        return;
      }
      QR.cooldown.isCounting = true;
      return QR.cooldown.count();
    },
    sync: function(data) {
      QR.cooldown.data = data || {};
      return QR.cooldown.start();
    },
    add: function(threadID, postID) {
      var boardID, start;
      if (!Conf['Cooldown']) {
        return;
      }
      start = Date.now();
      boardID = g.BOARD.ID;
      QR.cooldown.set(boardID, start, {
        threadID: threadID,
        postID: postID
      });
      if (threadID === postID) {
        QR.cooldown.set('global', start, {
          boardID: boardID,
          threadID: threadID,
          postID: postID
        });
      }
      return QR.cooldown.start();
    },
    addDelay: function(post, delay) {
      var cooldown;
      if (!Conf['Cooldown']) {
        return;
      }
      cooldown = QR.cooldown.categorize(post);
      cooldown.delay = delay;
      QR.cooldown.set(g.BOARD.ID, Date.now(), cooldown);
      return QR.cooldown.start();
    },
    addMute: function(delay) {
      if (!Conf['Cooldown']) {
        return;
      }
      QR.cooldown.set(g.BOARD.ID, Date.now(), {
        type: 'mute',
        delay: delay
      });
      return QR.cooldown.start();
    },
    "delete": function(post) {
      var base, cooldown, cooldowns, id, name;
      if (!QR.cooldown.data) {
        return;
      }
      $.forceSync('cooldowns');
      cooldowns = ((base = QR.cooldown.data)[name = post.board.ID] || (base[name] = {}));
      for (id in cooldowns) {
        cooldown = cooldowns[id];
        if ((cooldown.delay == null) && cooldown.threadID === post.thread.ID && cooldown.postID === post.ID) {
          delete cooldowns[id];
        }
      }
      return QR.cooldown.save([post.board.ID]);
    },
    secondsDeletion: function(post) {
      var cooldown, cooldowns, seconds, start;
      if (!(QR.cooldown.data && Conf['Cooldown'])) {
        return 0;
      }
      cooldowns = QR.cooldown.data[post.board.ID] || {};
      for (start in cooldowns) {
        cooldown = cooldowns[start];
        if ((cooldown.delay == null) && cooldown.threadID === post.thread.ID && cooldown.postID === post.ID) {
          seconds = QR.cooldown.delays.deletion - Math.floor((Date.now() - start) / $.SECOND);
          return Math.max(seconds, 0);
        }
      }
      return 0;
    },
    categorize: function(post) {
      if (post.thread === 'new') {
        return {
          type: 'thread'
        };
      } else {
        return {
          type: !!post.file ? 'image' : 'reply',
          threadID: +post.thread
        };
      }
    },
    set: function(scope, id, value) {
      var base, cooldowns;
      $.forceSync('cooldowns');
      cooldowns = ((base = QR.cooldown.data)[scope] || (base[scope] = {}));
      cooldowns[id] = value;
      return $.set('cooldowns', QR.cooldown.data);
    },
    save: function(scopes) {
      var data, i, len, scope;
      data = QR.cooldown.data;
      for (i = 0, len = scopes.length; i < len; i++) {
        scope = scopes[i];
        if (scope in data && !Object.keys(data[scope]).length) {
          delete data[scope];
        }
      }
      return $.set('cooldowns', data);
    },
    count: function() {
      var base, cooldown, cooldowns, elapsed, i, len, maxDelay, nCooldowns, now, ref, ref1, save, scope, seconds, start, suffix, threadID, type, update;
      $.forceSync('cooldowns');
      save = [];
      nCooldowns = 0;
      now = Date.now();
      ref = QR.cooldown.categorize(QR.posts[0]), type = ref.type, threadID = ref.threadID;
      seconds = 0;
      if (Conf['Cooldown']) {
        ref1 = [g.BOARD.ID, 'global'];
        for (i = 0, len = ref1.length; i < len; i++) {
          scope = ref1[i];
          cooldowns = ((base = QR.cooldown.data)[scope] || (base[scope] = {}));
          for (start in cooldowns) {
            cooldown = cooldowns[start];
            start = +start;
            elapsed = Math.floor((now - start) / $.SECOND);
            if (elapsed < 0) {
              delete cooldowns[start];
              save.push(scope);
              continue;
            }
            if (cooldown.delay != null) {
              if (cooldown.delay <= elapsed) {
                delete cooldowns[start];
                save.push(scope);
              } else if ((cooldown.type === type && cooldown.threadID === threadID) || cooldown.type === 'mute') {
                seconds = Math.max(seconds, cooldown.delay - elapsed);
              }
              continue;
            }
            maxDelay = cooldown.threadID !== cooldown.postID ? QR.cooldown.maxDelay : QR.cooldown.delays[scope === 'global' ? 'thread_global' : 'thread'];
            if (QR.cooldown.customCooldown) {
              maxDelay = Math.max(maxDelay, parseInt(Conf['customCooldown'], 10));
            }
            if (maxDelay <= elapsed) {
              delete cooldowns[start];
              save.push(scope);
              continue;
            }
            if ((type === 'thread') === (cooldown.threadID === cooldown.postID) && cooldown.boardID !== g.BOARD.ID) {
              suffix = scope === 'global' ? '_global' : type !== 'thread' && threadID === cooldown.threadID ? '_intra' : '';
              seconds = Math.max(seconds, QR.cooldown.delays[type + suffix] - elapsed);
            }
            if (QR.cooldown.customCooldown) {
              seconds = Math.max(seconds, parseInt(Conf['customCooldown'], 10) - elapsed);
            }
          }
          nCooldowns += Object.keys(cooldowns).length;
        }
      }
      if (save.length) {
        QR.cooldown.save(save);
      }
      if (nCooldowns) {
        clearTimeout(QR.cooldown.timeout);
        QR.cooldown.timeout = setTimeout(QR.cooldown.count, $.SECOND);
      } else {
        delete QR.cooldown.isCounting;
      }
      update = seconds !== QR.cooldown.seconds;
      QR.cooldown.seconds = seconds;
      if (update) {
        QR.status();
      }
      if (seconds === 0 && QR.cooldown.auto && !QR.req) {
        return QR.submit();
      }
    }
  };

}).call(this);

(function() {
  QR.oekaki = {
    menu: {
      init: function() {
        var a, ref;
        if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Menu'] && Conf['Edit Link'] && Conf['Quick Reply'])) {
          return;
        }
        a = $.el('a', {
          className: 'edit-link',
          href: 'javascript:;',
          textContent: 'Edit image'
        });
        $.on(a, 'click', this.editFile);
        return Menu.menu.addEntry({
          el: a,
          order: 95,
          open: function(post) {
            var file;
            QR.oekaki.menu.post = post;
            file = post.file;
            return QR.postingIsEnabled && !!file && (file.isImage || file.isVideo);
          }
        });
      },
      editFile: function() {
        var currentTime, isVideo, post, ref;
        post = QR.oekaki.menu.post;
        QR.quote.call(post.nodes.post);
        isVideo = post.file.isVideo;
        currentTime = ((ref = post.file.fullImage) != null ? ref.currentTime : void 0) || 0;
        return CrossOrigin.file(post.file.url, function(blob) {
          var video;
          if (!blob) {
            return QR.error("Can't load file.");
          } else if (isVideo) {
            video = $.el('video');
            $.on(video, 'loadedmetadata', function() {
              $.on(video, 'seeked', function() {
                var canvas;
                canvas = $.el('canvas', {
                  width: video.videoWidth,
                  height: video.videoHeight
                });
                canvas.getContext('2d').drawImage(video, 0, 0);
                return canvas.toBlob(function(snapshot) {
                  snapshot.name = post.file.name.replace(/\.\w+$/, '') + '.png';
                  QR.handleFiles([snapshot]);
                  return QR.oekaki.edit();
                });
              });
              return video.currentTime = currentTime;
            });
            return video.src = URL.createObjectURL(blob);
          } else {
            blob.name = post.file.name;
            QR.handleFiles([blob]);
            return QR.oekaki.edit();
          }
        });
      }
    },
    setup: function() {
      return $.global(function() {
        var FCX;
        FCX = window.FCX;
        FCX.oekakiCB = function() {
          return window.Tegaki.flatten().toBlob(function(file) {
            var source;
            source = "oekaki-" + (Date.now());
            FCX.oekakiLatest = source;
            return document.dispatchEvent(new CustomEvent('QRSetFile', {
              bubbles: true,
              detail: {
                file: file,
                name: FCX.oekakiName,
                source: source
              }
            }));
          });
        };
        if (window.Tegaki) {
          return document.querySelector('#qr .oekaki').hidden = false;
        }
      });
    },
    load: function(cb) {
      var n, onload, script, style;
      if ($('script[src^="//s.4cdn.org/js/painter"]', d.head)) {
        return cb();
      } else {
        style = $.el('link', {
          rel: 'stylesheet',
          href: "//s.4cdn.org/css/painter." + (Date.now()) + ".css"
        });
        script = $.el('script', {
          src: "//s.4cdn.org/js/painter.min." + (Date.now()) + ".js"
        });
        n = 0;
        onload = function() {
          if (++n === 2) {
            return cb();
          }
        };
        $.on(style, 'load', onload);
        $.on(script, 'load', onload);
        return $.add(d.head, [style, script]);
      }
    },
    draw: function() {
      return $.global(function() {
        var FCX, Tegaki;
        Tegaki = window.Tegaki, FCX = window.FCX;
        if (Tegaki.bg) {
          Tegaki.destroy();
        }
        FCX.oekakiName = 'tegaki.png';
        return Tegaki.open({
          onDone: FCX.oekakiCB,
          onCancel: function() {
            return Tegaki.bgColor = '#ffffff';
          },
          width: +document.querySelector('#qr [name=oekaki-width]').value,
          height: +document.querySelector('#qr [name=oekaki-height]').value,
          bgColor: document.querySelector('#qr [name=oekaki-bg]').checked ? document.querySelector('#qr [name=oekaki-bgcolor]').value : 'transparent'
        });
      });
    },
    button: function() {
      if (QR.selected.file) {
        return QR.oekaki.edit();
      } else {
        return QR.oekaki.toggle();
      }
    },
    edit: function() {
      return QR.oekaki.load(function() {
        return $.global(function() {
          var FCX, Tegaki, cb, error, name, source;
          Tegaki = window.Tegaki, FCX = window.FCX;
          name = document.getElementById('qr-filename').value.replace(/\.\w+$/, '') + '.png';
          source = document.getElementById('file-n-submit').dataset.source;
          error = function(content) {
            return document.dispatchEvent(new CustomEvent('CreateNotification', {
              bubbles: true,
              detail: {
                type: 'warning',
                content: content,
                lifetime: 20
              }
            }));
          };
          cb = function(e) {
            var file, isVideo;
            document.removeEventListener('QRFile', cb, false);
            if (!e.detail) {
              return error('No file to edit.');
            }
            if (!/^(image|video)\//.test(e.detail.type)) {
              return error('Not an image.');
            }
            isVideo = /^video\//.test(e.detail.type);
            file = document.createElement(isVideo ? 'video' : 'img');
            file.addEventListener('error', function() {
              return error('Could not open file.', false);
            });
            file.addEventListener((isVideo ? 'loadeddata' : 'load'), function() {
              if (Tegaki.bg) {
                Tegaki.destroy();
              }
              FCX.oekakiName = name;
              Tegaki.open({
                onDone: FCX.oekakiCB,
                onCancel: function() {
                  return Tegaki.bgColor = '#ffffff';
                },
                width: file.naturalWidth || file.videoWidth,
                height: file.naturalHeight || file.videoHeight,
                bgColor: 'transparent'
              });
              return Tegaki.activeCtx.drawImage(file, 0, 0);
            }, false);
            return file.src = URL.createObjectURL(e.detail);
          };
          if (Tegaki.bg && Tegaki.onDoneCb === FCX.oekakiCB && source === FCX.oekakiLatest) {
            FCX.oekakiName = name;
            return Tegaki.resume();
          } else {
            document.addEventListener('QRFile', cb, false);
            return document.dispatchEvent(new CustomEvent('QRGetFile', {
              bubbles: true
            }));
          }
        });
      });
    },
    toggle: function() {
      return QR.oekaki.load(function() {
        return QR.nodes.oekaki.hidden = !QR.nodes.oekaki.hidden;
      });
    }
  };

}).call(this);

(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  QR.persona = {
    always: {},
    types: {
      name: [],
      email: [],
      sub: []
    },
    init: function() {
      var i, item, len, ref;
      if (!(Conf['Quick Reply'] || (Conf['Menu'] && Conf['Delete Link']))) {
        return;
      }
      ref = Conf['QR.personas'].split('\n');
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        QR.persona.parseItem(item.trim());
      }
    },
    parseItem: function(item) {
      var boards, match, ref, ref1, ref2, type, val;
      if (item[0] === '#') {
        return;
      }
      if (!(match = item.match(/(name|options|email|subject|password):"(.*)"/i))) {
        return;
      }
      ref = match, match = ref[0], type = ref[1], val = ref[2];
      item = item.replace(match, '');
      boards = ((ref1 = item.match(/boards:([^;]+)/i)) != null ? ref1[1].toLowerCase() : void 0) || 'global';
      if (boards !== 'global' && (ref2 = g.BOARD.ID, indexOf.call(boards.split(','), ref2) < 0)) {
        return;
      }
      if (type === 'password') {
        QR.persona.pwd = val;
        return;
      }
      if (type === 'options') {
        type = 'email';
      }
      if (type === 'subject') {
        type = 'sub';
      }
      if (/always/i.test(item)) {
        QR.persona.always[type] = val;
      }
      if (indexOf.call(QR.persona.types[type], val) < 0) {
        return QR.persona.types[type].push(val);
      }
    },
    load: function() {
      var arr, i, len, list, ref, type, val;
      ref = QR.persona.types;
      for (type in ref) {
        arr = ref[type];
        list = $("#list-" + type, QR.nodes.el);
        for (i = 0, len = arr.length; i < len; i++) {
          val = arr[i];
          if (val) {
            $.add(list, $.el('option', {
              textContent: val
            }));
          }
        }
      }
    },
    getPassword: function() {
      var m;
      if (QR.persona.pwd != null) {
        return QR.persona.pwd;
      } else if ((m = d.cookie.match(/4chan_pass=([^;]+)/))) {
        return decodeURIComponent(m[1]);
      } else {
        return '';
      }
    },
    get: function(cb) {
      return $.get('QR.persona', {}, function(arg) {
        var persona;
        persona = arg['QR.persona'];
        return cb(persona);
      });
    },
    set: function(post) {
      return $.get('QR.persona', {}, function(arg) {
        var persona;
        persona = arg['QR.persona'];
        persona = {
          name: post.name
        };
        return $.set('QR.persona', persona);
      });
    }
  };

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  QR.post = (function() {
    function _Class(select) {
      this.select = bind(this.select, this);
      var el, event, i, j, label, len, len1, prev, ref, ref1;
      el = $.el('a', {
        className: 'qr-preview',
        draggable: true,
        href: 'javascript:;'
      });
      $.extend(el, {
        innerHTML: "<a class=\"remove fa fa-times-circle\" title=\"Remove\"></a><label class=\"qr-preview-spoiler\"><input type=\"checkbox\"> Spoiler</label><span></span>"
      });
      this.nodes = {
        el: el,
        rm: el.firstChild,
        spoiler: $('.qr-preview-spoiler input', el),
        span: el.lastChild
      };
      $.on(el, 'click', this.select);
      $.on(this.nodes.rm, 'click', (function(_this) {
        return function(e) {
          e.stopPropagation();
          return _this.rm();
        };
      })(this));
      $.on(this.nodes.spoiler, 'change', (function(_this) {
        return function(e) {
          _this.spoiler = e.target.checked;
          if (_this === QR.selected) {
            return QR.nodes.spoiler.checked = _this.spoiler;
          }
        };
      })(this));
      ref = $$('label', el);
      for (i = 0, len = ref.length; i < len; i++) {
        label = ref[i];
        $.on(label, 'click', function(e) {
          return e.stopPropagation();
        });
      }
      $.add(QR.nodes.dumpList, el);
      ref1 = ['dragStart', 'dragEnter', 'dragLeave', 'dragOver', 'dragEnd', 'drop'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        event = ref1[j];
        $.on(el, event.toLowerCase(), this[event]);
      }
      this.thread = g.VIEW === 'thread' ? g.THREADID : 'new';
      prev = QR.posts[QR.posts.length - 1];
      QR.posts.push(this);
      this.nodes.spoiler.checked = this.spoiler = prev && Conf['Remember Spoiler'] ? prev.spoiler : false;
      QR.persona.get((function(_this) {
        return function(persona) {
          _this.name = 'name' in QR.persona.always ? QR.persona.always.name : prev ? prev.name : persona.name;
          _this.email = 'email' in QR.persona.always ? QR.persona.always.email : '';
          _this.sub = 'sub' in QR.persona.always ? QR.persona.always.sub : '';
          if (QR.selected === _this) {
            return _this.load();
          }
        };
      })(this));
      if (select) {
        this.select();
      }
      this.unlock();
      $.queueTask(function() {
        return QR.captcha.onNewPost();
      });
    }

    _Class.prototype.rm = function() {
      var index;
      this["delete"]();
      index = QR.posts.indexOf(this);
      if (QR.posts.length === 1) {
        new QR.post(true);
        $.rmClass(QR.nodes.el, 'dump');
      } else if (this === QR.selected) {
        (QR.posts[index - 1] || QR.posts[index + 1]).select();
      }
      QR.posts.splice(index, 1);
      return QR.status();
    };

    _Class.prototype["delete"] = function() {
      $.rm(this.nodes.el);
      URL.revokeObjectURL(this.URL);
      return this.dismissErrors();
    };

    _Class.prototype.lock = function(lock) {
      var i, len, name, node, ref;
      if (lock == null) {
        lock = true;
      }
      this.isLocked = lock;
      if (this !== QR.selected) {
        return;
      }
      ref = ['thread', 'name', 'email', 'sub', 'com', 'fileButton', 'filename', 'spoiler'];
      for (i = 0, len = ref.length; i < len; i++) {
        name = ref[i];
        if (node = QR.nodes[name]) {
          node.disabled = lock;
        }
      }
      this.nodes.rm.style.visibility = lock ? 'hidden' : '';
      this.nodes.spoiler.disabled = lock;
      return this.nodes.el.draggable = !lock;
    };

    _Class.prototype.unlock = function() {
      return this.lock(false);
    };

    _Class.prototype.select = function() {
      var rectEl, rectList;
      if (QR.selected) {
        QR.selected.nodes.el.removeAttribute('id');
        QR.selected.forceSave();
      }
      QR.selected = this;
      this.lock(this.isLocked);
      this.nodes.el.id = 'selected';
      rectEl = this.nodes.el.getBoundingClientRect();
      rectList = this.nodes.el.parentNode.getBoundingClientRect();
      this.nodes.el.parentNode.scrollLeft += rectEl.left + rectEl.width / 2 - rectList.left - rectList.width / 2;
      return this.load();
    };

    _Class.prototype.load = function() {
      var i, len, name, node, ref;
      ref = ['thread', 'name', 'email', 'sub', 'com', 'filename'];
      for (i = 0, len = ref.length; i < len; i++) {
        name = ref[i];
        if (!(node = QR.nodes[name])) {
          continue;
        }
        node.value = this[name] || node.dataset["default"] || '';
      }
      (this.thread !== 'new' ? $.addClass : $.rmClass)(QR.nodes.el, 'reply-to-thread');
      this.showFileData();
      return QR.characterCount();
    };

    _Class.prototype.save = function(input) {
      var name, ref;
      if (input.type === 'checkbox') {
        this.spoiler = input.checked;
        return;
      }
      name = input.dataset.name;
      this[name] = input.value || input.dataset["default"] || null;
      switch (name) {
        case 'thread':
          (this.thread !== 'new' ? $.addClass : $.rmClass)(QR.nodes.el, 'reply-to-thread');
          return QR.status();
        case 'com':
          this.updateComment();
          if (QR.cooldown.auto && this === QR.posts[0] && (0 < (ref = QR.cooldown.seconds) && ref <= 5)) {
            return QR.cooldown.auto = false;
          }
          break;
        case 'filename':
          if (!this.file) {
            return;
          }
          this.saveFilename();
          return this.updateFilename();
        case 'name':
          return QR.persona.set(this);
      }
    };

    _Class.prototype.forceSave = function() {
      var i, len, name, node, ref;
      if (this !== QR.selected) {
        return;
      }
      ref = ['thread', 'name', 'email', 'sub', 'com', 'filename', 'spoiler'];
      for (i = 0, len = ref.length; i < len; i++) {
        name = ref[i];
        if (!(node = QR.nodes[name])) {
          continue;
        }
        this.save(node);
      }
    };

    _Class.prototype.setComment = function(com) {
      this.com = com || null;
      if (this === QR.selected) {
        QR.nodes.com.value = this.com;
      }
      return this.updateComment();
    };

    _Class.prototype.updateComment = function() {
      if (this === QR.selected) {
        QR.characterCount();
      }
      this.nodes.span.textContent = this.com;
      return $.queueTask(function() {
        return QR.captcha.onPostChange();
      });
    };

    _Class.rmErrored = function(e) {
      var error, errors, i, j, len, post, ref;
      e.stopPropagation();
      ref = QR.posts;
      for (i = ref.length - 1; i >= 0; i += -1) {
        post = ref[i];
        if (errors = post.errors) {
          for (j = 0, len = errors.length; j < len; j++) {
            error = errors[j];
            if (!(doc.contains(error))) {
              continue;
            }
            post.rm();
            break;
          }
        }
      }
    };

    _Class.prototype.error = function(className, message) {
      var div, ref, rm, rmAll;
      div = $.el('div', {
        className: className
      });
      $.extend(div, {
        innerHTML: E(message) + "<br>[<a href=\"javascript:;\">delete</a>] [<a href=\"javascript:;\">delete all</a>]"
      });
      (this.errors || (this.errors = [])).push(div);
      ref = $$('a', div), rm = ref[0], rmAll = ref[1];
      $.on(div, 'click', (function(_this) {
        return function() {
          if (indexOf.call(QR.posts, _this) >= 0) {
            return _this.select();
          }
        };
      })(this));
      $.on(rm, 'click', (function(_this) {
        return function(e) {
          e.stopPropagation();
          if (indexOf.call(QR.posts, _this) >= 0) {
            return _this.rm();
          }
        };
      })(this));
      $.on(rmAll, 'click', QR.post.rmErrored);
      return QR.error(div, true);
    };

    _Class.prototype.fileError = function(message) {
      return this.error('file-error', this.filename + ": " + message);
    };

    _Class.prototype.dismissErrors = function(test) {
      var error, i, len, ref;
      if (test == null) {
        test = function() {
          return true;
        };
      }
      if (this.errors) {
        ref = this.errors;
        for (i = 0, len = ref.length; i < len; i++) {
          error = ref[i];
          if (doc.contains(error) && test(error)) {
            error.parentNode.previousElementSibling.click();
          }
        }
      }
    };

    _Class.prototype.setFile = function(file1) {
      var ext, ref;
      this.file = file1;
      if (Conf['Randomize Filename'] && g.BOARD.ID !== 'f') {
        this.filename = "" + (Date.now() - Math.floor(Math.random() * 365 * $.DAY));
        if (ext = this.file.name.match(QR.validExtension)) {
          this.filename += ext[0];
        }
      } else {
        this.filename = this.file.name;
      }
      this.filesize = $.bytesToString(this.file.size);
      this.checkSize();
      $.addClass(this.nodes.el, 'has-file');
      $.queueTask(function() {
        return QR.captcha.onPostChange();
      });
      URL.revokeObjectURL(this.URL);
      this.saveFilename();
      if (this === QR.selected) {
        this.showFileData();
      } else {
        this.updateFilename();
      }
      this.nodes.el.style.backgroundImage = null;
      if (ref = this.file.type, indexOf.call(QR.mimeTypes, ref) < 0) {
        return this.fileError('Unsupported file type.');
      } else if (/^(image|video)\//.test(this.file.type)) {
        return this.readFile();
      }
    };

    _Class.prototype.checkSize = function() {
      var max;
      max = QR.max_size;
      if (/^video\//.test(this.file.type)) {
        max = Math.min(max, QR.max_size_video);
      }
      if (this.file.size > max) {
        return this.fileError("File too large (file: " + this.filesize + ", max: " + ($.bytesToString(max)) + ").");
      }
    };

    _Class.prototype.readFile = function() {
      var el, event, isVideo, onerror, onload;
      isVideo = /^video\//.test(this.file.type);
      el = $.el(isVideo ? 'video' : 'img');
      if (isVideo && !el.canPlayType(this.file.type)) {
        return;
      }
      event = isVideo ? 'loadeddata' : 'load';
      onload = (function(_this) {
        return function() {
          $.off(el, event, onload);
          $.off(el, 'error', onerror);
          _this.checkDimensions(el);
          return _this.setThumbnail(el);
        };
      })(this);
      onerror = (function(_this) {
        return function() {
          $.off(el, event, onload);
          $.off(el, 'error', onerror);
          _this.fileError((isVideo ? 'Video' : 'Image') + " appears corrupt");
          return URL.revokeObjectURL(el.src);
        };
      })(this);
      $.on(el, event, onload);
      $.on(el, 'error', onerror);
      return el.src = URL.createObjectURL(this.file);
    };

    _Class.prototype.checkDimensions = function(el) {
      var duration, height, max_height, max_width, ref, videoHeight, videoWidth, width;
      if (el.tagName === 'IMG') {
        height = el.height, width = el.width;
        if (height > QR.max_height || width > QR.max_width) {
          this.fileError("Image too large (image: " + height + "x" + width + "px, max: " + QR.max_height + "x" + QR.max_width + "px)");
        }
        if (height < QR.min_height || width < QR.min_width) {
          return this.fileError("Image too small (image: " + height + "x" + width + "px, min: " + QR.min_height + "x" + QR.min_width + "px)");
        }
      } else {
        videoHeight = el.videoHeight, videoWidth = el.videoWidth, duration = el.duration;
        max_height = Math.min(QR.max_height, QR.max_height_video);
        max_width = Math.min(QR.max_width, QR.max_width_video);
        if (videoHeight > max_height || videoWidth > max_width) {
          this.fileError("Video too large (video: " + videoHeight + "x" + videoWidth + "px, max: " + max_height + "x" + max_width + "px)");
        }
        if (videoHeight < QR.min_height || videoWidth < QR.min_width) {
          this.fileError("Video too small (video: " + videoHeight + "x" + videoWidth + "px, min: " + QR.min_height + "x" + QR.min_width + "px)");
        }
        if (!isFinite(duration)) {
          this.fileError('Video lacks duration metadata (try remuxing)');
        } else if (duration > QR.max_duration_video) {
          this.fileError("Video too long (video: " + duration + "s, max: " + QR.max_duration_video + "s)");
        }
        if (((ref = g.BOARD.ID) !== 'gif' && ref !== 'wsg') && $.hasAudio(el)) {
          return this.fileError('Audio not allowed');
        }
      }
    };

    _Class.prototype.setThumbnail = function(el) {
      var cv, height, isVideo, s, width;
      isVideo = el.tagName === 'VIDEO';
      s = 90 * 2 * window.devicePixelRatio;
      if (this.file.type === 'image/gif') {
        s *= 3;
      }
      if (isVideo) {
        height = el.videoHeight;
        width = el.videoWidth;
      } else {
        height = el.height, width = el.width;
        if (height < s || width < s) {
          this.URL = el.src;
          this.nodes.el.style.backgroundImage = "url(" + this.URL + ")";
          return;
        }
      }
      if (height <= width) {
        width = s / height * width;
        height = s;
      } else {
        height = s / width * height;
        width = s;
      }
      cv = $.el('canvas');
      cv.height = height;
      cv.width = width;
      cv.getContext('2d').drawImage(el, 0, 0, width, height);
      URL.revokeObjectURL(el.src);
      return cv.toBlob((function(_this) {
        return function(blob) {
          _this.URL = URL.createObjectURL(blob);
          return _this.nodes.el.style.backgroundImage = "url(" + _this.URL + ")";
        };
      })(this));
    };

    _Class.prototype.rmFile = function() {
      if (this.isLocked) {
        return;
      }
      delete this.file;
      delete this.filename;
      delete this.filesize;
      this.nodes.el.removeAttribute('title');
      QR.nodes.filename.removeAttribute('title');
      this.nodes.el.style.backgroundImage = null;
      $.rmClass(this.nodes.el, 'has-file');
      this.showFileData();
      URL.revokeObjectURL(this.URL);
      return this.dismissErrors(function(error) {
        return $.hasClass(error, 'file-error');
      });
    };

    _Class.prototype.saveFilename = function() {
      this.file.newName = (this.filename || '').replace(/[\/\\]/g, '-');
      if (!QR.validExtension.test(this.filename)) {
        return this.file.newName += "." + (QR.extensionFromType[this.file.type] || 'jpg');
      }
    };

    _Class.prototype.updateFilename = function() {
      var long;
      long = this.filename + " (" + this.filesize + ")";
      this.nodes.el.title = long;
      if (this !== QR.selected) {
        return;
      }
      return QR.nodes.filename.title = long;
    };

    _Class.prototype.showFileData = function() {
      var ref;
      if (this.file) {
        this.updateFilename();
        QR.nodes.filename.value = this.filename;
        $.addClass(QR.nodes.oekaki, 'has-file');
        $.addClass(QR.nodes.fileSubmit, 'has-file');
      } else {
        $.rmClass(QR.nodes.oekaki, 'has-file');
        $.rmClass(QR.nodes.fileSubmit, 'has-file');
      }
      if (((ref = this.file) != null ? ref.source : void 0) != null) {
        QR.nodes.fileSubmit.dataset.source = this.file.source;
      } else {
        QR.nodes.fileSubmit.removeAttribute('data-source');
      }
      return QR.nodes.spoiler.checked = this.spoiler;
    };

    _Class.prototype.pasteText = function(file) {
      var reader;
      this.pasting = true;
      reader = new FileReader();
      reader.onload = (function(_this) {
        return function(e) {
          var result;
          result = e.target.result;
          _this.setComment((_this.com ? _this.com + "\n" + result : result));
          return delete _this.pasting;
        };
      })(this);
      return reader.readAsText(file);
    };

    _Class.prototype.dragStart = function(e) {
      var left, ref, top;
      ref = this.getBoundingClientRect(), left = ref.left, top = ref.top;
      e.dataTransfer.setDragImage(this, e.clientX - left, e.clientY - top);
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
      $.rmClass(this, 'over');
      if (!this.draggable) {
        return;
      }
      el = $('.drag', this.parentNode);
      index = function(el) {
        return slice.call(el.parentNode.children).indexOf(el);
      };
      oldIndex = index(el);
      newIndex = index(this);
      (oldIndex < newIndex ? $.after : $.before)(this, el);
      post = QR.posts.splice(oldIndex, 1)[0];
      QR.posts.splice(newIndex, 0, post);
      return QR.status();
    };

    return _Class;

  })();

}).call(this);

QuoteBacklink = (function() {
  var QuoteBacklink;

  QuoteBacklink = {
    containers: {},
    init: function() {
      var ref;
      if (((ref = g.VIEW) !== 'index' && ref !== 'thread') || !Conf['Quote Backlinks']) {
        return;
      }
      Callbacks.Post.push({
        name: 'Quote Backlinking Part 1',
        cb: this.firstNode
      });
      return Callbacks.Post.push({
        name: 'Quote Backlinking Part 2',
        cb: this.secondNode
      });
    },
    firstNode: function() {
      var a, clone, container, containers, hash, i, j, k, len, len1, len2, link, markYours, nodes, post, quote, ref, ref1, ref2;
      if (this.isClone || !this.quotes.length || this.isRebuilt) {
        return;
      }
      markYours = Conf['Mark Quotes of You'] && ((ref = QuoteYou.db) != null ? ref.get({
        boardID: this.board.ID,
        threadID: this.thread.ID,
        postID: this.ID
      }) : void 0);
      a = $.el('a', {
        href: Build.postURL(this.board.ID, this.thread.ID, this.ID),
        className: this.isHidden ? 'filtered backlink' : 'backlink',
        textContent: Conf['backlink'].replace(/%(?:id|%)/g, (function(_this) {
          return function(x) {
            return {
              '%id': _this.ID,
              '%%': '%'
            }[x];
          };
        })(this)) + (markYours ? '\u00A0(You)' : '')
      });
      ref1 = this.quotes;
      for (i = 0, len = ref1.length; i < len; i++) {
        quote = ref1[i];
        containers = [QuoteBacklink.getContainer(quote)];
        if ((post = g.posts[quote]) && post.nodes.backlinkContainer) {
          ref2 = post.clones;
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            clone = ref2[j];
            containers.push(clone.nodes.backlinkContainer);
          }
        }
        for (k = 0, len2 = containers.length; k < len2; k++) {
          container = containers[k];
          link = a.cloneNode(true);
          nodes = container.firstChild ? [$.tn(' '), link] : [link];
          if (Conf['Quote Previewing']) {
            $.on(link, 'mouseover', QuotePreview.mouseover);
          }
          if (Conf['Quote Inlining']) {
            $.on(link, 'click', QuoteInline.toggle);
            if (Conf['Quote Hash Navigation']) {
              hash = QuoteInline.qiQuote(link, $.hasClass(link, 'filtered'));
              nodes.push(hash);
            }
          }
          $.add(container, nodes);
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
      var base;
      return (base = this.containers)[id] || (base[id] = $.el('span', {
        className: 'container'
      }));
    }
  };

  return QuoteBacklink;

}).call(this);

QuoteCT = (function() {
  var QuoteCT;

  QuoteCT = {
    init: function() {
      var ref;
      if (((ref = g.VIEW) !== 'index' && ref !== 'thread') || !Conf['Mark Cross-thread Quotes']) {
        return;
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      this.text = '\u00A0(Cross-thread)';
      return Callbacks.Post.push({
        name: 'Mark Cross-thread Quotes',
        cb: this.node
      });
    },
    node: function() {
      var board, boardID, i, len, quotelink, ref, ref1, ref2, thread, threadID;
      if (this.isClone && this.thread === this.context.thread) {
        return;
      }
      ref = this.context, board = ref.board, thread = ref.thread;
      ref1 = this.nodes.quotelinks;
      for (i = 0, len = ref1.length; i < len; i++) {
        quotelink = ref1[i];
        ref2 = Get.postDataFromLink(quotelink), boardID = ref2.boardID, threadID = ref2.threadID;
        if (!threadID) {
          continue;
        }
        if (this.isClone) {
          quotelink.textContent = quotelink.textContent.replace(QuoteCT.text, '');
        }
        if (boardID === board.ID && threadID !== thread.ID) {
          $.add(quotelink, $.tn(QuoteCT.text));
        }
      }
    }
  };

  return QuoteCT;

}).call(this);

QuoteInline = (function() {
  var QuoteInline,
    slice = [].slice;

  QuoteInline = {
    init: function() {
      var ref;
      if (((ref = g.VIEW) !== 'index' && ref !== 'thread') || !Conf['Quote Inlining']) {
        return;
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      return Callbacks.Post.push({
        name: 'Quote Inlining',
        cb: this.node
      });
    },
    node: function() {
      var i, isClone, len, link, process, ref;
      process = QuoteInline.process;
      isClone = this.isClone;
      ref = this.nodes.quotelinks.concat(slice.call(this.nodes.backlinks), this.nodes.archivelinks);
      for (i = 0, len = ref.length; i < len; i++) {
        link = ref[i];
        process(link, isClone);
      }
    },
    process: function(link, clone) {
      if (Conf['Quote Hash Navigation']) {
        if (!clone) {
          $.after(link, QuoteInline.qiQuote(link, $.hasClass(link, 'filtered')));
        }
      }
      return $.on(link, 'click', QuoteInline.toggle);
    },
    qiQuote: function(link, hidden) {
      var name;
      name = "hashlink";
      if (hidden) {
        name += " filtered";
      }
      return $.el('a', {
        className: name,
        textContent: '#',
        href: link.href
      });
    },
    toggle: function(e) {
      var boardID, context, postID, quoter, ref, ref1, threadID;
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      ref = Get.postDataFromLink(this), boardID = ref.boardID, threadID = ref.threadID, postID = ref.postID;
      if (Conf['Inline Cross-thread Quotes Only'] && g.VIEW === 'thread' && ((ref1 = g.posts[boardID + "." + postID]) != null ? ref1.nodes.root.offsetParent : void 0)) {
        return;
      }
      e.preventDefault();
      quoter = Get.postFromNode(this);
      context = quoter.context;
      if ($.hasClass(this, 'inlined')) {
        QuoteInline.rm(this, boardID, threadID, postID, context);
      } else {
        if ($.x("ancestor::div[@data-full-i-d='" + boardID + "." + postID + "']", this)) {
          return;
        }
        QuoteInline.add(this, boardID, threadID, postID, context, quoter);
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
    add: function(quotelink, boardID, threadID, postID, context, quoter) {
      var inline, isBacklink, post, qroot, root;
      isBacklink = $.hasClass(quotelink, 'backlink');
      inline = $.el('div', {
        className: 'inline'
      });
      inline.dataset.fullID = boardID + "." + postID;
      root = QuoteInline.findRoot(quotelink, isBacklink);
      $.after(root, inline);
      qroot = $.x('ancestor::*[contains(@class,"postContainer")][1]', root);
      $.addClass(qroot, 'hasInline');
      new Fetcher(boardID, threadID, postID, inline, quoter);
      if (!((post = g.posts[boardID + "." + postID]) && context.thread === post.thread)) {
        return;
      }
      if (isBacklink && Conf['Forward Hiding']) {
        $.addClass(post.nodes.root, 'forwarded');
        post.forwarded++ || (post.forwarded = 1);
      }
      if (!Unread.posts) {
        return;
      }
      return Unread.readSinglePost(post);
    },
    rm: function(quotelink, boardID, threadID, postID, context) {
      var el, inlined, isBacklink, post, qroot, ref, root;
      isBacklink = $.hasClass(quotelink, 'backlink');
      root = QuoteInline.findRoot(quotelink, isBacklink);
      root = $.x("following-sibling::div[@data-full-i-d='" + boardID + "." + postID + "'][1]", root);
      qroot = $.x('ancestor::*[contains(@class,"postContainer")][1]', root);
      $.rm(root);
      if (!$('.inline', qroot)) {
        $.rmClass(qroot, 'hasInline');
      }
      if (!(el = root.firstElementChild)) {
        return;
      }
      post = g.posts[boardID + "." + postID];
      post.rmClone(el.dataset.clone);
      if (Conf['Forward Hiding'] && isBacklink && context.thread === g.threads[boardID + "." + threadID] && !--post.forwarded) {
        delete post.forwarded;
        $.rmClass(post.nodes.root, 'forwarded');
      }
      while (inlined = $('.inlined', el)) {
        ref = Get.postDataFromLink(inlined), boardID = ref.boardID, threadID = ref.threadID, postID = ref.postID;
        QuoteInline.rm(inlined, boardID, threadID, postID, context);
        $.rmClass(inlined, 'inlined');
      }
    }
  };

  return QuoteInline;

}).call(this);

QuoteOP = (function() {
  var QuoteOP,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  QuoteOP = {
    init: function() {
      var ref;
      if (((ref = g.VIEW) !== 'index' && ref !== 'thread') || !Conf['Mark OP Quotes']) {
        return;
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      this.text = '\u00A0(OP)';
      return Callbacks.Post.push({
        name: 'Mark OP Quotes',
        cb: this.node
      });
    },
    node: function() {
      var boardID, fullID, i, postID, quotelink, quotelinks, quotes, ref, ref1;
      if (this.isClone && this.thread === this.context.thread) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      if (this.isClone && (ref = this.thread.fullID, indexOf.call(quotes, ref) >= 0)) {
        i = 0;
        while (quotelink = quotelinks[i++]) {
          quotelink.textContent = quotelink.textContent.replace(QuoteOP.text, '');
        }
      }
      fullID = this.context.thread.fullID;
      if (indexOf.call(quotes, fullID) < 0) {
        return;
      }
      i = 0;
      while (quotelink = quotelinks[i++]) {
        ref1 = Get.postDataFromLink(quotelink), boardID = ref1.boardID, postID = ref1.postID;
        if ((boardID + "." + postID) === fullID) {
          $.add(quotelink, $.tn(QuoteOP.text));
        }
      }
    }
  };

  return QuoteOP;

}).call(this);

QuotePreview = (function() {
  var QuotePreview,
    slice = [].slice;

  QuotePreview = {
    init: function() {
      var ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && Conf['Quote Previewing'])) {
        return;
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      return Callbacks.Post.push({
        name: 'Quote Previewing',
        cb: this.node
      });
    },
    node: function() {
      var i, len, link, ref;
      ref = this.nodes.quotelinks.concat(slice.call(this.nodes.backlinks), this.nodes.archivelinks);
      for (i = 0, len = ref.length; i < len; i++) {
        link = ref[i];
        $.on(link, 'mouseover', QuotePreview.mouseover);
      }
    },
    mouseover: function(e) {
      var boardID, i, len, origin, post, postID, posts, qp, ref, threadID;
      if ($.hasClass(this, 'inlined') || !d.contains(this)) {
        return;
      }
      ref = Get.postDataFromLink(this), boardID = ref.boardID, threadID = ref.threadID, postID = ref.postID;
      qp = $.el('div', {
        id: 'qp',
        className: 'dialog'
      });
      $.add(Header.hover, qp);
      new Fetcher(boardID, threadID, postID, qp, Get.postFromNode(this));
      UI.hover({
        root: this,
        el: qp,
        latestEvent: e,
        endEvents: 'mouseout click',
        cb: QuotePreview.mouseout
      });
      if (Conf['Quote Highlighting'] && (origin = g.posts[boardID + "." + postID])) {
        posts = [origin].concat(origin.clones);
        posts.pop();
        for (i = 0, len = posts.length; i < len; i++) {
          post = posts[i];
          $.addClass(post.nodes.post, 'qphl');
        }
      }
    },
    mouseout: function() {
      var clone, i, len, post, ref, root;
      if (!(root = this.el.firstElementChild)) {
        return;
      }
      clone = Get.postFromRoot(root);
      post = clone.origin;
      post.rmClone(root.dataset.clone);
      if (!Conf['Quote Highlighting']) {
        return;
      }
      ref = [post].concat(post.clones);
      for (i = 0, len = ref.length; i < len; i++) {
        post = ref[i];
        $.rmClass(post.nodes.post, 'qphl');
      }
    }
  };

  return QuotePreview;

}).call(this);

QuoteStrikeThrough = (function() {
  var QuoteStrikeThrough;

  QuoteStrikeThrough = {
    init: function() {
      var ref;
      if (!(((ref = g.VIEW) === 'index' || ref === 'thread') && (Conf['Reply Hiding Buttons'] || (Conf['Menu'] && Conf['Reply Hiding Link']) || Conf['Filter']))) {
        return;
      }
      return Callbacks.Post.push({
        name: 'Strike-through Quotes',
        cb: this.node
      });
    },
    node: function() {
      var boardID, i, len, postID, quotelink, ref, ref1, ref2;
      if (this.isClone) {
        return;
      }
      ref = this.nodes.quotelinks;
      for (i = 0, len = ref.length; i < len; i++) {
        quotelink = ref[i];
        ref1 = Get.postDataFromLink(quotelink), boardID = ref1.boardID, postID = ref1.postID;
        if ((ref2 = g.posts[boardID + "." + postID]) != null ? ref2.isHidden : void 0) {
          $.addClass(quotelink, 'filtered');
        }
      }
    }
  };

  return QuoteStrikeThrough;

}).call(this);

QuoteThreading = 
/*
  <3 aeosynth
 */

(function() {
  var QuoteThreading;

  QuoteThreading = {
    init: function() {
      if (!(Conf['Quote Threading'] && g.VIEW === 'thread')) {
        return;
      }
      this.controls = $.el('label', {
        innerHTML: "<input id=\"threadingControl\" name=\"Thread Quotes\" type=\"checkbox\"> Threading"
      });
      this.threadNewLink = $.el('span', {
        className: 'brackets-wrap threadnewlink',
        hidden: true
      });
      $.extend(this.threadNewLink, {
        innerHTML: "<a href=\"javascript:;\">Thread New Posts</a>"
      });
      this.input = $('input', this.controls);
      this.input.checked = Conf['Thread Quotes'];
      $.on(this.input, 'change', this.setEnabled);
      $.on(this.input, 'change', this.rethread);
      $.on(this.threadNewLink.firstElementChild, 'click', this.rethread);
      $.on(d, '4chanXInitFinished', (function(_this) {
        return function() {
          return _this.ready = true;
        };
      })(this));
      Header.menu.addEntry(this.entry = {
        el: this.controls,
        order: 99
      });
      Callbacks.Thread.push({
        name: 'Quote Threading',
        cb: this.setThread
      });
      return Callbacks.Post.push({
        name: 'Quote Threading',
        cb: this.node
      });
    },
    parent: {},
    children: {},
    inserted: {},
    setEnabled: function() {
      var other, ref;
      other = (ref = ReplyPruning.inputs) != null ? ref.enabled : void 0;
      if (this.checked && (other != null ? other.checked : void 0)) {
        other.checked = false;
        $.event('change', null, other);
      }
      return $.cb.checked.call(this);
    },
    setThread: function() {
      QuoteThreading.thread = this;
      return $.asap((function() {
        return !Conf['Thread Updater'] || $('.navLinksBot > .updatelink');
      }), function() {
        var navLinksBot;
        if ((navLinksBot = $('.navLinksBot'))) {
          return $.add(navLinksBot, [$.tn(' '), QuoteThreading.threadNewLink]);
        }
      });
    },
    node: function() {
      var ancestor, j, lastParent, len, parent, parents, quote, ref;
      if (this.isFetchedQuote || this.isClone || !this.isReply) {
        return;
      }
      parents = new Set();
      lastParent = null;
      ref = this.quotes;
      for (j = 0, len = ref.length; j < len; j++) {
        quote = ref[j];
        if (parent = g.posts[quote]) {
          if (!parent.isFetchedQuote && parent.isReply && parent.ID < this.ID) {
            parents.add(parent.ID);
            if (!lastParent || parent.ID > lastParent.ID) {
              lastParent = parent;
            }
          }
        }
      }
      if (!lastParent) {
        return;
      }
      ancestor = lastParent;
      while (ancestor = QuoteThreading.parent[ancestor.fullID]) {
        parents["delete"](ancestor.ID);
      }
      if (parents.size === 1) {
        return QuoteThreading.parent[this.fullID] = lastParent;
      }
    },
    descendants: function(post) {
      var child, children, j, len, posts;
      posts = [post];
      if (children = QuoteThreading.children[post.fullID]) {
        for (j = 0, len = children.length; j < len; j++) {
          child = children[j];
          posts = posts.concat(QuoteThreading.descendants(child));
        }
      }
      return posts;
    },
    insert: function(post) {
      var base, child, children, descendants, i, j, k, l, len, name, next, nodes, order, parent, prev, prev2, threadContainer, x;
      if (!(Conf['Thread Quotes'] && (parent = QuoteThreading.parent[post.fullID]) && !QuoteThreading.inserted[post.fullID])) {
        return false;
      }
      descendants = QuoteThreading.descendants(post);
      if (!Unread.posts.has(parent.ID)) {
        if ((function() {
          var j, len, x;
          for (j = 0, len = descendants.length; j < len; j++) {
            x = descendants[j];
            if (Unread.posts.has(x.ID)) {
              return true;
            }
          }
        })()) {
          QuoteThreading.threadNewLink.hidden = false;
          return false;
        }
      }
      order = Unread.order;
      children = ((base = QuoteThreading.children)[name = parent.fullID] || (base[name] = []));
      threadContainer = parent.nodes.threadContainer || $.el('div', {
        className: 'threadContainer'
      });
      nodes = [post.nodes.root];
      if (post.nodes.threadContainer) {
        nodes.push(post.nodes.threadContainer);
      }
      i = children.length;
      for (j = children.length - 1; j >= 0; j += -1) {
        child = children[j];
        if (child.ID >= post.ID) {
          i--;
        }
      }
      if (i !== children.length) {
        next = children[i];
        for (k = 0, len = descendants.length; k < len; k++) {
          x = descendants[k];
          order.before(order[next.ID], order[x.ID]);
        }
        children.splice(i, 0, post);
        $.before(next.nodes.root, nodes);
      } else {
        prev = parent;
        while ((prev2 = QuoteThreading.children[prev.fullID]) && prev2.length) {
          prev = prev2[prev2.length - 1];
        }
        for (l = descendants.length - 1; l >= 0; l += -1) {
          x = descendants[l];
          order.after(order[prev.ID], order[x.ID]);
        }
        children.push(post);
        $.add(threadContainer, nodes);
      }
      QuoteThreading.inserted[post.fullID] = true;
      if (!parent.nodes.threadContainer) {
        parent.nodes.threadContainer = threadContainer;
        $.addClass(parent.nodes.root, 'threadOP');
        $.after(parent.nodes.root, threadContainer);
      }
      return true;
    },
    rethread: function() {
      var nodes, posts, thread;
      if (!QuoteThreading.ready) {
        return;
      }
      thread = QuoteThreading.thread;
      posts = thread.posts;
      QuoteThreading.threadNewLink.hidden = true;
      if (Conf['Thread Quotes']) {
        posts.forEach(QuoteThreading.insert);
      } else {
        nodes = [];
        Unread.order = new RandomAccessList();
        QuoteThreading.inserted = {};
        posts.forEach(function(post) {
          if (post.isFetchedQuote) {
            return;
          }
          Unread.order.push(post);
          if (post.isReply) {
            nodes.push(post.nodes.root);
          }
          if (QuoteThreading.children[post.fullID]) {
            delete QuoteThreading.children[post.fullID];
            $.rmClass(post.nodes.root, 'threadOP');
            $.rm(post.nodes.threadContainer);
            return delete post.nodes.threadContainer;
          }
        });
        $.add(thread.OP.nodes.root.parentNode, nodes);
      }
      Unread.position = Unread.order.first;
      Unread.updatePosition();
      Unread.setLine(true);
      Unread.read();
      return Unread.update();
    }
  };

  return QuoteThreading;

}).call(this);

QuoteYou = (function() {
  var QuoteYou;

  QuoteYou = {
    init: function() {
      var ref;
      if (!Conf['Remember Your Posts']) {
        return;
      }
      this.db = new DataBoard('yourPosts');
      $.sync('Remember Your Posts', function(enabled) {
        return Conf['Remember Your Posts'] = enabled;
      });
      $.on(d, 'QRPostSuccessful', function(e) {
        var boardID, postID, ref, threadID;
        $.forceSync('Remember Your Posts');
        if (Conf['Remember Your Posts']) {
          ref = e.detail, boardID = ref.boardID, threadID = ref.threadID, postID = ref.postID;
          return QuoteYou.db.set({
            boardID: boardID,
            threadID: threadID,
            postID: postID,
            val: true
          });
        }
      });
      if ((ref = g.VIEW) !== 'index' && ref !== 'thread') {
        return;
      }
      if (Conf['Highlight Own Posts']) {
        $.addClass(doc, 'highlight-own');
      }
      if (Conf['Highlight Posts Quoting You']) {
        $.addClass(doc, 'highlight-you');
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      this.text = '\u00A0(You)';
      return Callbacks.Post.push({
        name: 'Mark Quotes of You',
        cb: this.node
      });
    },
    node: function() {
      var i, len, quotelink, ref;
      if (this.isClone) {
        return;
      }
      if (QuoteYou.db.get({
        boardID: this.board.ID,
        threadID: this.thread.ID,
        postID: this.ID
      })) {
        $.addClass(this.nodes.root, 'yourPost');
      }
      if (!this.quotes.length) {
        return;
      }
      ref = this.nodes.quotelinks;
      for (i = 0, len = ref.length; i < len; i++) {
        quotelink = ref[i];
        if (!(QuoteYou.db.get(Get.postDataFromLink(quotelink)))) {
          continue;
        }
        if (Conf['Mark Quotes of You']) {
          $.add(quotelink, $.tn(QuoteYou.text));
        }
        $.addClass(quotelink, 'you');
        $.addClass(this.nodes.root, 'quotesYou');
      }
    },
    cb: {
      seek: function(type) {
        var highlight, post, posts, result, str;
        if (highlight = $('.highlight')) {
          $.rmClass(highlight, 'highlight');
        }
        if (!(QuoteYou.lastRead && doc.contains(QuoteYou.lastRead) && $.hasClass(QuoteYou.lastRead, 'quotesYou'))) {
          if (!(post = QuoteYou.lastRead = $('.quotesYou'))) {
            new Notice('warning', 'No posts are currently quoting you, loser.', 20);
            return;
          }
          if (QuoteYou.cb.scroll(post)) {
            return;
          }
        } else {
          post = QuoteYou.lastRead;
        }
        str = type + "::div[contains(@class,'quotesYou')]";
        while ((post = (result = $.X(str, post)).snapshotItem(type === 'preceding' ? result.snapshotLength - 1 : 0))) {
          if (QuoteYou.cb.scroll(post)) {
            return;
          }
        }
        posts = $$('.quotesYou');
        return QuoteYou.cb.scroll(posts[type === 'following' ? 0 : posts.length - 1]);
      },
      scroll: function(root) {
        var post;
        post = $('.post', root);
        if (!post.getBoundingClientRect().height) {
          return false;
        } else {
          QuoteYou.lastRead = root;
          window.location = "#" + post.id;
          Header.scrollTo(post);
          $.addClass(post, 'highlight');
          return true;
        }
      }
    }
  };

  return QuoteYou;

}).call(this);

Quotify = (function() {
  var Quotify,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  Quotify = {
    init: function() {
      var ref;
      if (((ref = g.VIEW) !== 'index' && ref !== 'thread') || !Conf['Resurrect Quotes']) {
        return;
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      return Callbacks.Post.push({
        name: 'Resurrect Quotes',
        cb: this.node
      });
    },
    node: function() {
      var deadlink, i, j, len, len1, link, ref, ref1;
      if (this.isClone) {
        this.nodes.archivelinks = $$('a.linkify.quotelink', this.nodes.comment);
        return;
      }
      ref = $$('a.linkify', this.nodes.comment);
      for (i = 0, len = ref.length; i < len; i++) {
        link = ref[i];
        Quotify.parseArchivelink.call(this, link);
      }
      ref1 = $$('.deadlink', this.nodes.comment);
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        deadlink = ref1[j];
        Quotify.parseDeadlink.call(this, deadlink);
      }
    },
    parseArchivelink: function(link) {
      var boardID, m, postID, threadID;
      if (!(m = link.pathname.match(/^\/([^\/]+)\/thread\/S?(\d+)\/?$/))) {
        return;
      }
      if (link.hostname === 'boards.4chan.org') {
        return;
      }
      boardID = m[1];
      threadID = m[2];
      postID = link.hash.match(/^#p?(\d+)$|$/)[1] || threadID;
      if (Redirect.to('post', {
        boardID: boardID,
        postID: postID
      })) {
        $.addClass(link, 'quotelink');
        $.extend(link.dataset, {
          boardID: boardID,
          threadID: threadID,
          postID: postID
        });
        return this.nodes.archivelinks.push(link);
      }
    },
    parseDeadlink: function(deadlink) {
      var a, boardID, fetchable, m, post, postID, quote, quoteID, redirect, ref;
      if ($.hasClass(deadlink.parentNode, 'prettyprint')) {
        Quotify.fixDeadlink(deadlink);
        return;
      }
      quote = deadlink.textContent;
      if (!(postID = (ref = quote.match(/\d+$/)) != null ? ref[0] : void 0)) {
        return;
      }
      if (postID[0] === '0') {
        Quotify.fixDeadlink(deadlink);
        return;
      }
      boardID = (m = quote.match(/^>>>\/([a-z\d]+)/)) ? m[1] : this.board.ID;
      quoteID = boardID + "." + postID;
      if (post = g.posts[quoteID]) {
        if (!post.isDead) {
          a = $.el('a', {
            href: Build.postURL(boardID, post.thread.ID, postID),
            className: 'quotelink',
            textContent: quote
          });
        } else {
          a = $.el('a', {
            href: Build.postURL(boardID, post.thread.ID, postID),
            className: 'quotelink deadlink',
            textContent: quote + "\u00A0(Dead)"
          });
          $.extend(a.dataset, {
            boardID: boardID,
            threadID: post.thread.ID,
            postID: postID
          });
        }
      } else {
        redirect = Redirect.to('thread', {
          boardID: boardID,
          threadID: 0,
          postID: postID
        });
        fetchable = Redirect.to('post', {
          boardID: boardID,
          postID: postID
        });
        if (redirect || fetchable) {
          a = $.el('a', {
            href: redirect || 'javascript:;',
            className: 'deadlink',
            textContent: quote + "\u00A0(Dead)"
          });
          if (fetchable) {
            $.addClass(a, 'quotelink');
            $.extend(a.dataset, {
              boardID: boardID,
              postID: postID
            });
          }
        }
      }
      if (indexOf.call(this.quotes, quoteID) < 0) {
        this.quotes.push(quoteID);
      }
      if (!a) {
        deadlink.textContent = quote + "\u00A0(Dead)";
        return;
      }
      $.replace(deadlink, a);
      if ($.hasClass(a, 'quotelink')) {
        return this.nodes.quotelinks.push(a);
      }
    },
    fixDeadlink: function(deadlink) {
      var el, green;
      if (!(el = deadlink.previousSibling) || el.nodeName === 'BR') {
        green = $.el('span', {
          className: 'quote'
        });
        $.before(deadlink, green);
        $.add(green, deadlink);
      }
      return $.replace(deadlink, slice.call(deadlink.childNodes));
    }
  };

  return Quotify;

}).call(this);

Main = (function() {
  var Main;

  Main = {
    init: function() {
      var db, flatten, items, j, key, len, ref;
      if (d.body && !$('title', d.head)) {
        return;
      }
      if (window['4chan X antidup']) {
        return;
      }
      window['4chan X antidup'] = true;
      if (location.hostname === 'www.google.com') {
        $.get('Captcha Fixes', true, function(arg1) {
          var enabled;
          enabled = arg1['Captcha Fixes'];
          if (enabled) {
            return $.ready(function() {
              return Captcha.fixes.init();
            });
          }
        });
        return;
      }
      $.on(d, '4chanXInitFinished', function() {
        if (Main.expectInitFinished) {
          return delete Main.expectInitFinished;
        } else {
          new Notice('error', 'Error: Multiple copies of 4chan X are enabled.');
          return $.addClass(doc, 'tainted');
        }
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
      ref = DataBoard.keys;
      for (j = 0, len = ref.length; j < len; j++) {
        db = ref[j];
        Conf[db] = {
          boards: {}
        };
      }
      Conf['archives'] = Redirect.archives;
      Conf['selectedArchives'] = {};
      Conf['cooldowns'] = {};
      Conf['Index Sort'] = {};
      Conf['Except Archives from Encryption'] = false;
      Conf['JSON Navigation'] = true;
      Conf['Oekaki Links'] = true;
      $.global(function() {
        var k, key, len1, oldFun, ref1, whitelist;
        whitelist = document.currentScript.dataset.whitelist;
        whitelist = whitelist.split('\n').filter(function(x) {
          return x[0] !== "'";
        });
        whitelist.push(location.protocol + "//" + location.host);
        oldFun = {};
        ref1 = ['createElement', 'write'];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          key = ref1[k];
          oldFun[key] = document[key];
          document[key] = (function(key) {
            return function(arg) {
              var s;
              s = document.currentScript;
              if (s && s.src && whitelist.indexOf(s.src.split('/').slice(0, 3).join('/')) < 0) {
                throw Error();
              }
              return oldFun[key].call(document, arg);
            };
          })(key);
        }
        return document.addEventListener('csp-ready', function() {
          var results;
          results = [];
          for (key in oldFun) {
            results.push(document[key] = oldFun[key]);
          }
          return results;
        }, false);
      }, {
        whitelist: Conf['jsWhitelist']
      });
      items = {};
      for (key in Conf) {
        items[key] = void 0;
      }
      items['previousversion'] = void 0;
      return $.get(items, function(items) {
        var jsWhitelist, ref1;
        jsWhitelist = (ref1 = items['jsWhitelist']) != null ? ref1 : Conf['jsWhitelist'];
        $.addCSP("script-src " + (jsWhitelist.replace(/[\s;]+/g, ' ')));
        $.event('csp-ready');
        return $.asap(docSet, function() {
          var ref2, val;
          if ($.cantSet) {

          } else if (items.previousversion == null) {
            Main.ready(function() {
              $.set('previousversion', g.VERSION);
              return Settings.open();
            });
          } else if (items.previousversion !== g.VERSION) {
            Main.upgrade(items);
          }
          for (key in Conf) {
            val = Conf[key];
            Conf[key] = (ref2 = items[key]) != null ? ref2 : val;
          }
          return Main.initFeatures();
        });
      });
    },
    upgrade: function(items) {
      var changes, previousversion;
      previousversion = items.previousversion;
      changes = Settings.upgrade(items, previousversion);
      items.previousversion = changes.previousversion = g.VERSION;
      return $.set(changes, function() {
        var el, ref;
        if ((ref = items['Show Updated Notifications']) != null ? ref : true) {
          el = $.el('span', {
            innerHTML: "4chan X has been updated to <a href=\"https://github.com/ccd0/4chan-x/blob/master/CHANGELOG.md\" target=\"_blank\">version " + E(g.VERSION) + "</a>."
          });
          return new Notice('info', el, 15);
        }
      });
    },
    initFeatures: function() {
      var err, feature, hostname, j, len, match, name, pathname, ref, ref1, ref2, ref3, search;
      hostname = location.hostname, search = location.search;
      pathname = location.pathname.split(/\/+/);
      if (hostname !== 'www.4chan.org') {
        g.BOARD = new Board(pathname[1]);
      }
      if (hostname === 'boards.4chan.org' || hostname === 'sys.4chan.org' || hostname === 'www.4chan.org') {
        $.global(function() {
          document.documentElement.classList.add('js-enabled');
          return window.FCX = {};
        });
        Main.jsEnabled = $.hasClass(doc, 'js-enabled');
      }
      switch (hostname) {
        case 'www.4chan.org':
          $.onExists(doc, 'body', function() {
            return $.addStyle(CSS.www);
          });
          Captcha.replace.init();
          return;
        case 'sys.4chan.org':
          if (pathname[2] === 'imgboard.php') {
            if (/\bmode=report\b/.test(search)) {
              Report.init();
            } else if ((match = search.match(/\bres=(\d+)/))) {
              $.ready(function() {
                var ref;
                if (Conf['404 Redirect'] && ((ref = $.id('errmsg')) != null ? ref.textContent : void 0) === 'Error: Specified thread does not exist.') {
                  return Redirect.navigate('thread', {
                    boardID: g.BOARD.ID,
                    postID: +match[1]
                  });
                }
              });
            }
          } else if (pathname[2] === 'post') {
            PostSuccessful.init();
          }
          return;
        case 'i.4cdn.org':
          if (!(pathname[2] && !/s\.jpg$/.test(pathname[2]))) {
            return;
          }
          $.asap((function() {
            return d.readyState !== 'loading';
          }), function() {
            var ref, video;
            if (Conf['404 Redirect'] && ((ref = d.title) === '4chan - Temporarily Offline' || ref === '4chan - 404 Not Found')) {
              return Redirect.navigate('file', {
                boardID: g.BOARD.ID,
                filename: pathname[pathname.length - 1]
              });
            } else if (video = $('video')) {
              if (Conf['Volume in New Tab']) {
                Volume.setup(video);
              }
              if (Conf['Loop in New Tab']) {
                video.loop = true;
                video.controls = false;
                video.play();
                return ImageCommon.addControls(video);
              }
            }
          });
          return;
      }
      if ((ref = pathname[2]) === 'thread' || ref === 'res') {
        g.VIEW = 'thread';
        g.THREADID = +pathname[3];
      } else if ((ref1 = pathname[2]) === 'catalog' || ref1 === 'archive') {
        g.VIEW = pathname[2];
      } else if (pathname[2].match(/^\d*$/)) {
        g.VIEW = 'index';
      } else {
        return;
      }
      g.threads = new SimpleDict();
      g.posts = new SimpleDict();
      $.onExists(doc, 'body', Main.initStyle);
      ref2 = Main.features;
      for (j = 0, len = ref2.length; j < len; j++) {
        ref3 = ref2[j], name = ref3[0], feature = ref3[1];
        try {
          feature.init();
        } catch (_error) {
          err = _error;
          Main.handleErrors({
            message: "\"" + name + "\" initialization crashed.",
            error: err
          });
        }
      }
      return $.ready(Main.initReady);
    },
    initStyle: function() {
      var keyboard, ref;
      if (!Main.isThisPageLegit()) {
        return;
      }
      if ((ref = $('link[href*=mobile]', d.head)) != null) {
        ref.disabled = true;
      }
      $.addClass(doc, 'fourchan-x', 'seaweedchan');
      $.addClass(doc, g.VIEW === 'thread' ? 'thread-view' : g.VIEW);
      if ($.engine) {
        $.addClass(doc, $.engine);
      }
      $.onExists(doc, '.ad-cnt', function(ad) {
        return $.onExists(ad, 'img', function() {
          return $.addClass(doc, 'ads-loaded');
        });
      });
      if (Conf['Autohiding Scrollbar']) {
        $.addClass(doc, 'autohiding-scrollbar');
      }
      $.ready(function() {
        if (d.body.clientHeight > doc.clientHeight && (window.innerWidth === doc.clientWidth) !== Conf['Autohiding Scrollbar']) {
          Conf['Autohiding Scrollbar'] = !Conf['Autohiding Scrollbar'];
          $.set('Autohiding Scrollbar', Conf['Autohiding Scrollbar']);
          return $.toggleClass(doc, 'autohiding-scrollbar');
        }
      });
      $.addStyle(CSS.boards, 'fourchanx-css');
      Main.bgColorStyle = $.el('style', {
        id: 'fourchanx-bgcolor-css'
      });
      keyboard = false;
      $.on(d, 'mousedown', function() {
        return keyboard = false;
      });
      $.on(d, 'keydown', function(e) {
        if (e.keyCode === 9) {
          return keyboard = true;
        }
      });
      window.addEventListener('focus', (function() {
        return doc.classList.toggle('keyboard-focus', keyboard);
      }), true);
      return Main.setClass();
    },
    setClass: function() {
      var mainStyleSheet, setStyle, style, styleSheets;
      if (g.VIEW === 'catalog') {
        $.addClass(doc, $.id('base-css').href.match(/catalog_(\w+)/)[1].replace('_new', '').replace(/_+/g, '-'));
        return;
      }
      style = 'yotsuba-b';
      mainStyleSheet = $('link[title=switch]', d.head);
      styleSheets = $$('link[rel="alternate stylesheet"]', d.head);
      setStyle = function() {
        var bgColor, div, j, len, styleSheet;
        $.rmClass(doc, style);
        style = null;
        for (j = 0, len = styleSheets.length; j < len; j++) {
          styleSheet = styleSheets[j];
          if (styleSheet.href === (mainStyleSheet != null ? mainStyleSheet.href : void 0)) {
            style = styleSheet.title.toLowerCase().replace('new', '').trim().replace(/\s+/g, '-');
            break;
          }
        }
        if (style) {
          $.addClass(doc, style);
          return $.rm(Main.bgColorStyle);
        } else {
          div = $.el('div', {
            className: 'reply'
          });
          div.style.cssText = 'position: absolute; visibility: hidden;';
          $.add(d.body, div);
          bgColor = window.getComputedStyle(div).backgroundColor;
          $.rm(div);
          Main.bgColorStyle.textContent = ".dialog, .suboption-list > div:last-of-type {\n  background-color: " + bgColor + ";\n}";
          return $.after($.id('fourchanx-css'), Main.bgColorStyle);
        }
      };
      setStyle();
      if (!mainStyleSheet) {
        return;
      }
      return new MutationObserver(setStyle).observe(mainStyleSheet, {
        attributes: true,
        attributeFilter: ['href']
      });
    },
    initReady: function() {
      var msg, ref, ref1, ref2;
      if (g.VIEW === 'thread' && (((ref = d.title) === '4chan - Temporarily Offline' || ref === '4chan - 404 Not Found') || ($('.board') && !$('.opContainer')))) {
        ThreadWatcher.set404(g.BOARD.ID, g.THREADID, function() {
          if (Conf['404 Redirect']) {
            return Redirect.navigate('thread', {
              boardID: g.BOARD.ID,
              threadID: g.THREADID,
              postID: +location.hash.match(/\d+/)
            }, "/" + g.BOARD + "/");
          }
        });
        return;
      }
      if ((ref1 = d.title) === '4chan - Temporarily Offline' || ref1 === '4chan - 404 Not Found') {
        return;
      }
      if (((ref2 = g.VIEW) === 'index' || ref2 === 'thread') && !$('.board + *')) {
        msg = $.el('div', {
          innerHTML: "The page didn&#039;t load completely.<br>Some features may not work unless you <a href=\"javascript:;\">reload</a>."
        });
        $.on($('a', msg), 'click', function() {
          return location.reload();
        });
        new Notice('warning', msg);
      }
      if (!(Conf['JSON Index'] && g.VIEW === 'index')) {
        return Main.initThread();
      } else {
        Main.expectInitFinished = true;
        return $.event('4chanXInitFinished');
      }
    },
    initThread: function() {
      var board, err, errors, j, k, len, len1, m, postRoot, posts, ref, ref1, scriptData, thread, threadRoot, threads;
      if ((board = $('.board'))) {
        threads = [];
        posts = [];
        ref = $$('.board > .thread', board);
        for (j = 0, len = ref.length; j < len; j++) {
          threadRoot = ref[j];
          thread = new Thread(+threadRoot.id.slice(1), g.BOARD);
          threads.push(thread);
          ref1 = $$('.thread > .postContainer', threadRoot);
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            postRoot = ref1[k];
            if ($('.postMessage', postRoot)) {
              try {
                posts.push(new Post(postRoot, thread, g.BOARD));
              } catch (_error) {
                err = _error;
                if (!errors) {
                  errors = [];
                }
                errors.push({
                  message: "Parsing of Post No." + (postRoot.id.match(/\d+/)) + " failed. Post will be skipped.",
                  error: err
                });
              }
            }
          }
        }
        if (errors) {
          Main.handleErrors(errors);
        }
        if (g.VIEW === 'thread') {
          scriptData = Get.scriptData();
          threads[0].postLimit = /\bbumplimit *= *1\b/.test(scriptData);
          threads[0].fileLimit = /\bimagelimit *= *1\b/.test(scriptData);
          threads[0].ipCount = (m = scriptData.match(/\bunique_ips *= *(\d+)\b/)) ? +m[1] : void 0;
        }
        if (g.BOARD.ID === 'f' && g.VIEW === 'thread') {
          $.ajax("//a.4cdn.org/f/thread/" + g.THREADID + ".json", {
            timeout: $.MINUTE,
            onloadend: function() {
              if (this.response && posts[0].file) {
                return posts[0].file.text.dataset.md5 = posts[0].file.MD5 = this.response.posts[0].md5;
              }
            }
          });
        }
        Main.callbackNodes('Thread', threads);
        return Main.callbackNodesDB('Post', posts, function() {
          var l, len2, post;
          for (l = 0, len2 = posts.length; l < len2; l++) {
            post = posts[l];
            QuoteThreading.insert(post);
          }
          Main.expectInitFinished = true;
          return $.event('4chanXInitFinished');
        });
      } else {
        Main.expectInitFinished = true;
        return $.event('4chanXInitFinished');
      }
    },
    callbackNodes: function(klass, nodes) {
      var cb, i, node;
      i = 0;
      cb = Callbacks[klass];
      while (node = nodes[i++]) {
        cb.execute(node);
      }
    },
    callbackNodesDB: function(klass, nodes, cb) {
      var cbs, fn, i, softTask;
      i = 0;
      cbs = Callbacks[klass];
      fn = function() {
        var node;
        if (!(node = nodes[i])) {
          return false;
        }
        cbs.execute(node);
        return ++i % 25;
      };
      softTask = function() {
        while (fn()) {
          continue;
        }
        if (!nodes[i]) {
          if (cb) {
            cb();
          }
          return;
        }
        return setTimeout(softTask, 0);
      };
      return softTask();
    },
    handleErrors: function(errors) {
      var div, error, j, len, logs;
      if (!(errors instanceof Array)) {
        error = errors;
      } else if (errors.length === 1) {
        error = errors[0];
      }
      if (error) {
        new Notice('error', Main.parseError(error, Main.reportLink([error])), 15);
        return;
      }
      div = $.el('div', {
        innerHTML: E(errors.length) + " errors occurred." + (Main.reportLink(errors)).innerHTML + " [<a href=\"javascript:;\">show</a>]"
      });
      $.on(div.lastElementChild, 'click', function() {
        var ref;
        return ref = this.textContent === 'show' ? ['hide', false] : ['show', true], this.textContent = ref[0], logs.hidden = ref[1], ref;
      });
      logs = $.el('div', {
        hidden: true
      });
      for (j = 0, len = errors.length; j < len; j++) {
        error = errors[j];
        $.add(logs, Main.parseError(error));
      }
      return new Notice('error', [div, logs], 30);
    },
    parseError: function(data, reportLink) {
      var context, error, lines, message, ref, ref1;
      c.error(data.message, data.error.stack);
      message = $.el('div', {
        innerHTML: E(data.message) + ((reportLink) ? (reportLink).innerHTML : "")
      });
      error = $.el('div', {
        textContent: (data.error.name || 'Error') + ": " + (data.error.message || 'see console for details')
      });
      lines = ((ref = data.error.stack) != null ? (ref1 = ref.match(/\d+(?=:\d+\)?$)/mg)) != null ? ref1.join().replace(/^/, ' at ') : void 0 : void 0) || '';
      context = $.el('div', {
        textContent: "(4chan X ccd0 v" + g.VERSION + " " + $.platform + " on " + $.engine + lines + ")"
      });
      return [message, error, context];
    },
    reportLink: function(errors) {
      var addDetails, data, details, title, url;
      data = errors[0];
      title = data.message;
      if (errors.length > 1) {
        title += " (+" + (errors.length - 1) + " other errors)";
      }
      details = '';
      addDetails = function(text) {
        if (!(encodeURIComponent(title + details + text + '\n').length > 8110)) {
          return details += text + '\n';
        }
      };
      addDetails("[Please describe the steps needed to reproduce this error.]\n\nScript: 4chan X ccd0 v" + g.VERSION + " " + $.platform + "\nUser agent: " + navigator.userAgent + "\nURL: " + location.href);
      addDetails('\n' + data.error);
      if (data.error.stack) {
        addDetails(data.error.stack.replace(data.error.toString(), '').trim());
      }
      if (data.html) {
        addDetails('\n`' + data.html + '`');
      }
      details = details.replace(/file:\/{3}.+\//g, '');
      url = "https://gitreports.com/issue/ccd0/4chan-x?issue_title=" + (encodeURIComponent(title)) + "&details=" + (encodeURIComponent(details));
      return {
        innerHTML: "<span class=\"report-error\"> [<a href=\"" + E(url) + "\" target=\"_blank\">report</a>]</span>"
      };
    },
    isThisPageLegit: function() {
      var ref;
      if (!('thisPageIsLegit' in Main)) {
        Main.thisPageIsLegit = location.hostname === 'boards.4chan.org' && !$('link[href*="favicon-status.ico"]', d.head) && ((ref = d.title) !== '4chan - Temporarily Offline' && ref !== '4chan - Error' && ref !== '504 Gateway Time-out');
      }
      return Main.thisPageIsLegit;
    },
    ready: function(cb) {
      return $.ready(function() {
        if (Main.isThisPageLegit()) {
          return cb();
        }
      });
    },
    features: [['Polyfill', Polyfill], ['Normalize URL', NormalizeURL], ['Captcha Configuration', Captcha.replace], ['Redirect', Redirect], ['Header', Header], ['Catalog Links', CatalogLinks], ['Settings', Settings], ['Index Generator', Index], ['Disable Autoplay', AntiAutoplay], ['Announcement Hiding', PSAHiding], ['Fourchan thingies', Fourchan], ['Color User IDs', IDColor], ['Highlight by User ID', IDHighlight], ['Custom CSS', CustomCSS], ['Thread Links', ThreadLinks], ['Linkify', Linkify], ['Reveal Spoilers', RemoveSpoilers], ['Resurrect Quotes', Quotify], ['Filter', Filter], ['Thread Hiding Buttons', ThreadHiding], ['Reply Hiding Buttons', PostHiding], ['Recursive', Recursive], ['Strike-through Quotes', QuoteStrikeThrough], ['Quick Reply Personas', QR.persona], ['Quick Reply', QR], ['Cooldown', QR.cooldown], ['Pass Link', PassLink], ['Menu', Menu], ['Index Generator (Menu)', Index.menu], ['Report Link', ReportLink], ['Thread Hiding (Menu)', ThreadHiding.menu], ['Reply Hiding (Menu)', PostHiding.menu], ['Delete Link', DeleteLink], ['Filter (Menu)', Filter.menu], ['Edit Link', QR.oekaki.menu], ['Download Link', DownloadLink], ['Archive Link', ArchiveLink], ['Quote Inlining', QuoteInline], ['Quote Previewing', QuotePreview], ['Quote Backlinks', QuoteBacklink], ['Mark Quotes of You', QuoteYou], ['Mark OP Quotes', QuoteOP], ['Mark Cross-thread Quotes', QuoteCT], ['Anonymize', Anonymize], ['Time Formatting', Time], ['Relative Post Dates', RelativeDates], ['File Info Formatting', FileInfo], ['Fappe Tyme', FappeTyme], ['Gallery', Gallery], ['Gallery (menu)', Gallery.menu], ['Sauce', Sauce], ['Image Expansion', ImageExpand], ['Image Expansion (Menu)', ImageExpand.menu], ['Reveal Spoiler Thumbnails', RevealSpoilers], ['Image Loading', ImageLoader], ['Image Hover', ImageHover], ['Volume Control', Volume], ['WEBM Metadata', Metadata], ['Comment Expansion', ExpandComment], ['Thread Expansion', ExpandThread], ['Thread Excerpt', ThreadExcerpt], ['Favicon', Favicon], ['Unread', Unread], ['Quote Threading', QuoteThreading], ['Thread Stats', ThreadStats], ['Thread Updater', ThreadUpdater], ['Thread Watcher', ThreadWatcher], ['Thread Watcher (Menu)', ThreadWatcher.menu], ['Mark New IPs', MarkNewIPs], ['Index Navigation', Nav], ['Keybinds', Keybinds], ['Banner', Banner], ['Flash Features', Flash], ['Reply Pruning', ReplyPruning]]
  };

  return Main;

}).call(this);

Main.init();

})();
