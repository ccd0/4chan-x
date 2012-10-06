// ==UserScript==
// @name                appchan x
// @namespace           zixaphir
// @version             0.17.4
// @description         Cross-browser userscript for maximum lurking on 4chan.
// @copyright           2012 Zixaphir <zixaphirmoxphar@gmail.com>
// @copyright           2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright           2012 Nicolas Stepien <stepien.nicolas@gmail.com>
// @license             MIT; http://en.wikipedia.org/wiki/Mit_license
// @include             http://boards.4chan.org/*
// @include             https://boards.4chan.org/*
// @include             http://images.4chan.org/*
// @include             https://images.4chan.org/*
// @include             http://sys.4chan.org/*
// @include             https://sys.4chan.org/*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_openInTab
// @run-at              document-start
// @updateURL           https://github.com/zixaphir/appchan-x/raw/stable/appchan_x.meta.js
// @downloadURL         https://github.com/zixaphir/appchan-x/raw/stable/appchan_x.user.js
// @icon                https://github.com/zixaphir/appchan-x/raw/stable/img/icon.gif
// ==/UserScript==

/*  appchan x - Version 0.17.4 - 2012-10-06
 *
 *  Licensed under the MIT license.
 *  https://github.com/zixaphir/appchan-x/blob/master/LICENSE
 *
 *  appchan X Copyright © 2012 Zixaphir <zixaphirmoxphar@gmail.com>
 *    http://zixaphir.github.com/appchan-x/
 *  4chan x Copyright © 2009-2011 James Campos <james.r.campos@gmail.com>
 *    http://aeosynth.github.com/4chan-x/
 *  4chan x Copyright © 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
 *    http://mayhemydg.github.com/4chan-x/
 *  OneeChan Copyright © 2012 Jordan Bates
 *    http://seaweedchan.github.com/oneechan/
 *  4chan SS Copyright © 2012 Ahodesuka
 *    http://ahodesuka.github.com/4chan-Style-Script
 *
 *  Permission is hereby granted, free of charge, to any person
 *  obtaining a copy of this software and associated documentation
 *  files (the "Software"), to deal in the Software without
 *  restriction, including without limitation the rights to use,
 *  copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *  OTHER DEALINGS IN THE SOFTWARE.
 *
 *  Contributors:
 *    blaise - mentoring and support
 *    aeosynth - original author of 4chan x
 *    mayhemydg - a current maintainer of 4chan x
 *    noface - a current maintainer of 4chan x
 *    that4chanwolf - former maintainer of 4chan x
 *    desuwa - Firefox filename upload fix
 *    seaweed - bottom padding for image hover
 *    e000 - cooldown sanity check
 *    ahodesuka - scroll back when unexpanding images, file info formatting
 *    Shou - pentadactyl fixes
 *    ferongr - favicons
 *    xat - favicons
 *    Ongpot - sfw favicon
 *    thisisanon - nsfw + 404 favicons
 *    Anonymous - empty favicon
 *    Seiba - chrome quick reply focusing
 *    herpaderpderp - recaptcha fixes
 *    WakiMiko - recaptcha tab order http://userscripts.org/scripts/show/82657
 *    btmcsweeney - allow users to specify text for sauce links
 *
 *  All the people who've taken the time to write bug reports.
 *
 *  Thank you.
 */

/*
 *  Linkification based on the Linkify scripts located at:
 *    http://downloads.mozdev.org/greasemonkey/linkify.user.js
 *    https://github.com/MayhemYDG/LinkifyPlusFork
 *
 *  Originally written by Anthony Lieuallen of http://arantius.com/
 *  Licensed for unlimited modification and redistribution as long as
 *  this notice is kept intact.
 */
(function() {
  var $, $$, Anonymize, ArchiveLink, AutoGif, Build, Conf, Config, CustomNavigation, DeleteLink, DownloadLink, Emoji, ExpandComment, ExpandThread, Favicon, FileInfo, Filter, Get, ImageExpand, ImageHover, Keybinds, Linkify, Main, Markdown, MascotTools, Mascots, Menu, Nav, Navigation, Options, PngFix, Prefetch, QR, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, Quotify, Redirect, ReplyHideLink, ReplyHiding, ReportLink, RevealSpoilers, Sauce, StrikethroughQuotes, Style, ThemeTools, Themes, ThreadHideLink, ThreadHiding, ThreadStats, Time, TitlePost, UI, Unread, Updater, Watcher, console, d, editMascot, editMode, editTheme, g, newTheme, remInit, styleInit, userMascots, userNavigation, userThemes;

  Config = {
    main: {
      Enhancing: {
        'Disable Inline 4chan Addon': [true, 'Avoid conflicts between 4chan X and 4chan\'s inline extension. <span class=disabledwarning><code>Style</code> is enabled. This option will be enabled regardless of this setting\'s value.</span>'],
        '404 Redirect': [true, 'Redirect dead threads and images'],
        'Keybinds': [true, 'Binds actions to keys'],
        'Time Formatting': [true, 'Arbitrarily formatted timestamps, using your local time'],
        'File Info Formatting': [true, 'Reformats the file information'],
        'Linkify': [true, 'Convert text into links where applicable. If a link is too long and only partially linkified, shift+ctrl+click it to merge the next line.'],
        'Youtube Embed': [true, 'Add a link to linkified youtube links to embed the video inline.'],
        'Comment Expansion': [true, 'Expand too long comments'],
        'Thread Expansion': [true, 'View all replies'],
        'Index Navigation': [true, 'Navigate to previous / next thread'],
        'Rollover': [true, 'Index navigation will fallback to page navigation.'],
        'Reply Navigation': [false, 'Navigate to top / bottom of thread'],
        'Style': [true, 'Custom theming and styling options.'],
        'Custom Navigation': [false, 'Customize your Navigation bar.'],
        'Check for Updates': [true, 'Check for updated versions of Appchan X']
      },
      Filtering: {
        'Anonymize': [false, 'Make everybody anonymous'],
        'Filter': [true, 'Self-moderation placebo'],
        'Recursive Filtering': [true, 'Filter replies of filtered posts, recursively'],
        'Reply Hiding': [true, 'Hide single replies'],
        'Thread Hiding': [false, 'Hide entire threads'],
        'Show Stubs': [true, 'Of hidden threads / replies']
      },
      Imaging: {
        'Image Auto-Gif': [false, 'Animate gif thumbnails'],
        'Png Thumbnail Fix': [false, 'Fixes transparent png thumbnails'],
        'Image Expansion': [true, 'Expand images'],
        'Image Hover': [false, 'Show full image on mouseover'],
        'Sauce': [true, 'Add sauce to images'],
        'Reveal Spoilers': [false, 'Replace spoiler thumbnails by the original thumbnail'],
        'Expand From Current': [false, 'Expand images from current position to thread end.'],
        'Prefetch': [false, 'Prefetch images.']
      },
      Menu: {
        'Menu': [true, 'Add a drop-down menu in posts.'],
        'Report Link': [true, 'Add a report link to the menu.'],
        'Delete Link': [true, 'Add post and image deletion links to the menu.'],
        'Download Link': [true, 'Add a download with original filename link to the menu. Chrome-only currently.'],
        'Archive Link': [true, 'Add an archive link to the menu.'],
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
        'Auto Watch Reply': [false, 'Automatically watch threads that you reply to']
      },
      Posting: {
        'Quick Reply': [true, 'Reply without leaving the page. <span class=disabledwarning><code>Style</code> is enabled. This option will be enabled regardless of this setting\'s value.</span>'],
        'Cooldown': [true, 'Prevent "flood detected" errors.'],
        'Persistent QR': [true, 'The Quick reply won\'t disappear after posting. <span class=disabledwarning><code>Style</code> is enabled. This option will be enabled regardless of this setting\'s value.</span>'],
        'Auto Hide QR': [false, 'Automatically hide the quick reply when posting. <span class=disabledwarning><code>Style</code> is enabled. This option will be disabled regardless of this setting\'s value.</span>'],
        'Open Reply in New Tab': [false, 'Open replies in a new tab that are made from the main board.'],
        'Remember QR size': [false, 'Remember the size of the Quick reply (Firefox only).'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Remember Sage': [false, 'Remember email even if it contains sage.'],
        'Hide Original Post Form': [true, 'Replace the normal post form with a shortcut to open the QR. <span class=disabledwarning><code>Style</code> is enabled. This option will be disabled regardless of this setting\'s value.</span>'],
        'Markdown': [false, 'Code, italic, bold, italic bold, double struck - `, *, **, ***, ||, respectively. _ can be used instead of *. <span class=warning><code>Markdown</code> is currently blocked server-side on /g/, and using it will simply remove markdowned elements from your post.</style>']
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
      country: [''].join('\n'),
      filename: [''].join('\n'),
      dimensions: ['# Highlight potential wallpapers:', '#/1920x1080/;op:yes;highlight;top:no;boards:w,wg'].join('\n'),
      filesize: [''].join('\n'),
      md5: [''].join('\n')
    },
    sauces: ['http://iqdb.org/?url=$1', 'http://www.google.com/searchbyimage?image_url=$1', '#http://tineye.com/search?url=$1', '#http://saucenao.com/search.php?db=999&url=$1', '#http://3d.iqdb.org/?url=$1', '#http://regex.info/exif.cgi?imgurl=$2', '# uploaders:', '#http://imgur.com/upload?url=$2;text:Upload to imgur', '#http://omploader.org/upload?url1=$2;text:Upload to omploader', '# "View Same" in archives:', '#http://archive.foolz.us/_/search/image/$3/;text:View same on foolz', '#http://archive.foolz.us/$4/search/image/$3/;text:View same on foolz /$4/', '#https://archive.installgentoo.net/$4/image/$3;text:View same on installgentoo /$4/'].join('\n'),
    time: '%m/%d/%y(%a)%H:%M',
    backlink: '>>%id',
    fileInfo: '%l (%p%s, %r)',
    favicon: 'ferongr',
    updateIncrease: '5,10,15,20,30,60,90,120,240,300',
    updateIncreaseB: '5,10,15,20,30,60,90,120,240,300',
    hotkeys: {
      openQR: ['i', 'Open QR with post number inserted'],
      openEmptyQR: ['I', 'Open QR without post number inserted'],
      openOptions: ['ctrl+o', 'Open Options'],
      close: ['Esc', 'Close Options or QR'],
      spoiler: ['ctrl+s', 'Quick spoiler tags'],
      code: ['alt+c', 'Quick code tags'],
      sageru: ['alt+n', 'Sage keybind'],
      submit: ['alt+s', 'Submit post'],
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
        'Scrolling': [false, 'Scroll updated posts into view. Only enabled at bottom of page.'],
        'Scroll BG': [false, 'Scroll background tabs'],
        'Verbose': [true, 'Show countdown timer, new post count'],
        'Auto Update': [true, 'Automatically fetch new posts']
      },
      'Interval': 30,
      'BGInterval': 60
    },
    style: {
      Dialogs: {
        'Announcements': ['slideout', 'The style of announcements and the ability to hide them.', ['4chan default', 'slideout', 'hide']],
        'Post Form Style': ['tabbed slideout', 'How the post form will sit on the page.', ['fixed', 'slideout', 'tabbed slideout', 'transparent fade']],
        'Slideout Navigation': ['compact', 'How the slideout navigation will be displayed.', ['compact', 'list', 'hide']],
        'Slideout Watcher': [true, 'Adds an icon you can hover over to show the watcher, as opposed to having the watcher always visible.']
      },
      Navigation: {
        'Boards Navigation': ['sticky top', 'The position of 4chan board navigation', ['sticky top', 'sticky bottom', 'top', 'hide']],
        'Pagination': ['sticky bottom', 'The position of 4chan page navigation', ['sticky top', 'sticky bottom', 'top', 'bottom', 'on side', 'hide']]
      },
      Rice: {
        'Block Ads': [false, 'Block advertisements. It\'s probably better to use AdBlock for this.'],
        'Checkboxes': ['show', 'Alter checkboxes.', ['show', 'make checkboxes circular', 'hide', 'do not style checkboxes']],
        'Captcha Opacity': ['1.00', 'Transparency of the 4chan Captcha', ['1.00', '.75', '.50', '.25']],
        'Emoji': ['enabled', 'Enable emoji', ['enabled', 'disable ponies', 'disable']],
        'Emoji Position': ['before', 'Position of emoji icons, like sega and neko.', ['before', 'after']],
        'Filtered Backlinks': [true, 'Mark backlinks to filtered posts.'],
        'Font': ['Calibri', 'The font used by all elements of 4chan.', 'text'],
        'Font Size': ['12px', 'The font size of posts and various UI. This does not change all font sizes.', 'text'],
        'Mascots': [false, 'Add a pretty picture of your waifu to Appchan.'],
        'NSFW/SFW Mascots': [false, 'Enable or disable mascots based on the SFW status of the board you are viewing.'],
        'Mascots Overlap Posts': [true, 'Mascots overlap threads and posts.'],
        'Mascot Location': ['sidebar', 'Change where your mascot is located.', ['sidebar', 'opposite']],
        'Mascot Position': ['bottom', 'Change where your mascot is placed in relation to the post form if the mascot isn\'t manually placed.', ['above post form', 'bottom']],
        'NSFW/SFW Themes': [false, 'Choose your theme based on the SFW status of the board you are viewing.'],
        'Rounded Edges': [true, 'Round the edges of various 4chan elements.'],
        'Sage Highlighting': ['image', 'Icons or text to highlight saged posts.', ['text', 'image', 'none']],
        'Tripcode Hider': [true, 'Intelligent name field hiding.'],
        'Underline Links': [true, 'Put lines under hyperlinks.']
      },
      Layout: {
        '4chan Banner': ['at sidebar top', 'The positioning of 4chan\'s image banner.', ['at sidebar top', 'at sidebar bottom', 'at top', 'hide']],
        'Board Logo': ['at sidebar top', 'The positioning of the board\'s logo and subtitle.', ['at sidebar top', 'at sidebar bottom', 'at top', 'hide']],
        'Board Subtitle': [true, 'Show the board subtitle.'],
        'Compact Post Form Inputs': [true, 'Use compact inputs on the post form.'],
        'Expand Post Form Textarea': [true, 'Expands the post form text area when in use.'],
        'Icon Orientation': ['horizontal', 'Change the orientation of the appchan x icons.', ['horizontal', 'vertical']],
        'Images Overlap Post Form': [true, 'Images expand over the post form and sidebar content, usually used with "Expand images" set to "full".'],
        'Fit Width Replies': [true, 'Replies fit the entire width of the page.'],
        'Page Margin': ['fully centered', 'Additional layout options, allowing you to center the page or use additional page margins.', ['none', 'minimal', 'small', 'medium', 'large', 'fully centered']],
        'Reply Spacing': ['small', 'The amount of space between replies.', ['none', 'small', 'medium', 'large']],
        'Reply Padding': ['normal', 'The padding around post content of replies.', ['phat', 'normal', 'slim', 'super slim', 'anorexia']],
        'Sidebar Location': ['right', 'The side of the page the sidebar content is on. It is highly recommended that you do not hide the sidebar if you change this option.', ['left', 'right']],
        'Sidebar': ['normal', 'Alter the sidebar size. Completely hiding it can cause content to overlap, but with the correct option combinations can create a minimal 4chan layout that has more efficient screen real-estate than vanilla 4chan.', ['large', 'normal', 'minimal', 'hide']],
        'Stats Position': ['bottom', 'The position of 4chan thread stats', ['top', 'bottom']],
        'Updater Position': ['bottom', 'The position of 4chan thread updater', ['top', 'bottom']]
      }
    },
    theme: 'Yotsuba B',
    mascot: ''
  };

  Conf = {};

  userThemes = {};

  editTheme = {};

  userMascots = {};

  editMascot = {};

  userNavigation = {};

  editMode = false;

  newTheme = false;

  styleInit = false;

  remInit = false;

  d = document;

  g = {};

  g.TYPE = 'sfw';

  Emoji = [['Neko', 'BMAAAARCAMAAAAIRmf1AAACoFBMVEUAAABnUFZoUVddU1T6+PvFwLzn4eFXVlT/+vZpZGCgm5dKU1Cfnpz//flbWljr5uLp5OCalpNZWFb//f3r6+n28ff9+PRaVVH59Pr//vr38vj57/Dp7eyjn5zq8O5aVVJbYV9nVFhjUFRiWFlZVlFgZGOboJzm5uZhamfz9/bt8fDw6+drb26bl5j/8/lkX1z06uldWFS5r61UT0tfWlbDwr3Ew76moqNRTU7Mx8P75OpeY19pWl1XW1qzr6x5eHaLiojv7+1UT0xIU0uzqadVS0nV0MxkZGT5+PPk497///ra29Xq5eFtY2H28e2hnJignJlUUE1dXV2vrqxkY2FkYF/m3d5vZmfDuruhl5aZlJHx8O75+PZWVVP29vT/9fTj3trv6ubh5eRdXFqTkpBOTUtqZmX88/RMQ0T78vPEvr7HwcHDwsDq6ef///3Gx8H++fXEv7tZWVedmZZXXVudnJp0c3FZU1f79fnb1dlXUVVjXWFrZmy8t7359/qLj455e3q4s69vamZjX1zy4+avpaReWFz/+f1NR0vu6Ozp4+f48/lnYmi8ur3Iw7/69fHz7+xbV1SZmJZVUk1ZV1zq5ez++f/c196uqbDn4uj9+P7z7vRVVVXt6ORiXl/OycXHw8CPi4ihoJ5aWF3/+v/k3+axrLOsp67LzMZYU1m2sq9dWF5WUU1WUk/Au7eYlJGqpqObmphYVV749f7p5Or38fPu6OpiXFz38fH79vLz7urv6+hhYF5cWWKal6D//f/Z09Xg29exraqbl5RqaW6kpKTq5uPv7Of/+PDj29D//vP18Ozs5+OloJymoZ1ZVVJZWVlkYF2hnpmblIyspJmVjYKQi4enop5STUlRTUpcWUhqY1BgWT9ZUjhcV1NiXVkkhke3AAAABHRSTlMA5vjapJ+a9wAAAP9JREFUGBk9wA1EAwEAhuHv3dTQAkLiUlJFJWF0QDLFYDRXIMkomBgxNIYxhOk4wwCqQhQjxgxSGIsALFA5BiYbMZHajz1oJlx51sBJpf6Gd3zONcrqm/r1W8ByK0r+XV1LXyOLLnjW6hMGpu0u1IzPSdO17DgrGC6AadrVodGcDQYbhguP6wAvAaC0BRZQalkUQ8UQDz5tAof0XbejOFcV5xiUoCfjj3O/nf0ZbqAMPYmzU18KSDaRQ08qnfw+B2JNdAEQt2O5vctUGjhoIBU4ygPsj2Vh5zYopDK73hsirdkPTwGCbSHpiYFwYVVC/17pCFSBeUmoqwYQuZtWxx+BVEz0LeVKIQAAAABJRU5ErkJggg=='], ['Madotsuki', 'BQAAAAPCAMAAADTRh9nAAAALVBMVEUAAAC3iopWLTtWPkHnvqUcBxx5GCZyAAARERGbdXJrRUyGRUyYbY23coZFGDRFGEYfAAAAAXRSTlMAQObYZgAAAGhJREFUeF5Vy1kOQyEMQ1Fshzd12P9y61AixLX4yJFo1cvVUfT23GaflF0HPLln6bhnZVKCcrIWGqpCUcKYSP3JSIRySKTtULPNwMaD8/NC8tsyqsd1hR+6qeqIDHc3LD0B3KdtV1f2A+LJBBIHSgcEAAAAAElFTkSuQmCC'], ['Sega', 'CwAAAALBAMAAAD2A3K8AAAAMFBMVEUAAACMjpOChImytLmdnqMrKzDIyM55dnkODQ94foQ7PkXm5Olsb3VUUVVhZmw8Sl6klHLxAAAAAXRSTlMAQObYZgAAANFJREFUGJVjYIACRiUlJUUGDHBk4syTkxQwhO3/rQ/4ZYsuymi3YEFUqAhC4LCJZJGIi1uimKKjk3KysbOxsaMnAwNLyqoopaXhttf2it1anrJqke1pr1DlBAZhicLnM5YXZ4RWlIYoezx0zrjYqG6czCDsYRzxIko6Q/qFaKy0690Ij0MxN8K2MIhJXF+hsfxJxuwdpYGVaUU3Mm5bqgKFOZOFit3Vp23J3pgsqLxFUXpLtlD5bgcGBs45794dn6mkOVFQUOjNmXPPz8ysOcAAANw6SHLtrqolAAAAAElFTkSuQmCC'], ['Sakamoto', 'BEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAxVJREFUOE+Nk19IU1EYwK+GQQTVQ39egh6ibKlzw91z7rn3bvfOmddNszl1bjKXc5rJJGmBUr7Yg9qTD0IalFgRBEYg6EDQQB+GovQyQgiaUZsoLcgHMcr069w7MgcGXfi453zn+37fv3MYZt/n99e76tzVj4JN/hP79fvXnV3hnNabwUBjoOHcgTYOu/JQspgTzsqKgn9BfD4vkWTzur287PqLVy+zM+yePB7KsRXLywTjnSpnZctBkPCdW8ccDuU55vBO8RXbkC/oP5ph19V5+7LIky0OY1BKbZEbLcFSt7u6pN7jLmltCVrr3DV5jY3+KovFEsccB1KJNVpefe10BqS2tqqO4/AuphBB4L/LkrRqNgtJs1lMypLls1kU38mytMLz/E8VIlutqVqX6/weZG52OttRXjbE0cP/FYLRlpVjDXuQ/r77x2XZPKkCHA4HBAIBkCQpAygIAvh8Pu2MZgO0Lz+QSa/sQfwN9RfpVN66XC6Ynp6GhYUFGBwczAC1t7fD0tISxONx6O7upgHILmsqvLcHodOggfiV/v5+SCaT4HQ6IRaLgdfr1bIRRREmJyfBZrNBNBqF+fl5sNsdgE2GiAbp6bmbdbXC7qWQbxMTE7C2tgY6nQ5SqRSEw2ENopaoZpCXlwdTU1NaoECgCbgiU6y8QH+ECYWaTymK7TWdys7MzIwGaWtrg42NDejo6AB1WjU1NZo+FArB2NgYrK6uQrAlCASxn2z6wkuMp87VIAhkE2MEAwMDkEgkYHx8HBYXF0HtkQpRy1BLiEQisLy8rPVNKSsFjEzrXH4+z1hlS4xDhKadNu7t7YPR0VHweDzAEVWfHru6HxkZgeHhYVAURYNjkylVWKArZjjMzqmdVi+QCsLUkQiEjvDvncEkvU7/qQ0Vgukeo48Go87IiCJnZNmipxiz7wXEbVDnbUxQOgM12h9n6qTq6NvapRdtkwaP0XK8RmPuYSbxYfaQ/sJJhjfknuFRURUi7AMOozcCwl94hLZp5F+EioDQVwqYI6jomZU1NFtM+rOSxZjVazcyvwHr/p/Kws1jegAAAABJRU5ErkJggg=='], ['Baka', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA0pJREFUOE91k3tI01EUx39JOpA0H4jNx0pbD3XTalISWf8YFlEgldqDsBLLyqjEKBCiLLWiggh6/KEV1WZ7OaelLZvDdDafNW1JFraWe/32+01FrUZ9uy4ylLpw4Z5z7/nc77n3HIqaMRIjZJyEcNX+uFCFeGmI/GZciEIsCFJUTvoAzDz+1y7K76MSwhX5hXl6z+WSbrzU2KB8YEGDwgrTaxZ3b7xHcaHhR3xw7Z5/UviB1ReP5XSg3+TAqYJOxMzWISFIC0GQDomhTVA9skCnsaAwp/vnMq66dBokNuBR9uFd7T9Z1zCunjci0qcRJUVdoJ3DYOhRnC/qBZ+jQbfeCc+37yjY2UEg0iwvJE0k9l8Z+8xqHmTgot0QLdQgTaQFQ2AsOzlHvOu1S5pwOLsHHo8HjHMCq2MazNvTlByKHyrJLDvdR25jMWRxYx5HjeMH2r1BDOOeguRua4OI14jx8a8YH5tA+al3EHKlW6mYOapb2oZBOOwMbEMseAE12L+jjUh3w+VipyAZ65oxn1NP/GMYGR6Ftn4Qsf7qa9S82Y/l/X122G0uL2TbxmZEz1WhXW8mUol8moXu+SCi/OoQ6VsDh3UUwyQ1k9GOaI5MTkX4yWTGHutvgI1F28sviAlRgxeoRm62HvsyW8En9pZ1TYgi6TntoyQtFm86rVgUoJZRvDnKMmXVAGxWmkAYOBwudBqGcHCvHulrGpGT2Uy+z4yT+QYsCXtCUpp8GxbKhx8gDK0ro+KjJGvzdjfDZnN6VdisLD5/JjArQ2zW66PJOj2lEZtStaBphkwah7K6kMJ/GEulp1bMWhAmMbTozOQRaWRtfoZVgjo4iRra4SYgGi26TwjxVeDKhR7Y7U606ixICq9tr7hd7+OthRWL7yUnJ1WPmXotqLhpRICPHCePtuFV6xdUPTAhcWEtRHEqfHpPyto4hPXLXnzflSEJnFaN3OCKDcsFsrEntR9RUmxARLAUgT5iBPuJsXWDBj0dZjRU9yNV+PTbpjTp9OA/pOSk24nRkXf1J462oPxcJ65f6ULlHSMulepRerYDgvj7A0cKpNz/tyTZqbzXO4t0ZZGQJ34RH11lFHIlA8LIqreCCMUZRY3cd2bwL/5/RmjNSXqtAAAAAElFTkSuQmCC'], ['Ponyo', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAuNJREFUOE+Nk3tI01EUx39BTytConQTt1am07m5abi5KT5S8z2dj1yOEMUC7aUgIoimlmUEWX9kBZGWaamEmE6U1BI1XNPNGTrnHs33IwuSXrL4NgcJ0mNdOHDh3PPhnPP9XoKwcroJYvMQiRSicHCQKCgUyZC9/T5rNet5KUFs0zCZbZMsFmZ9fTEjEEBDp4/KSSSb/4JoGIyWaTYbiykpWEhOxhSHAzWD0aqkUGhWAcVkW58xlvuPhfh4zItEmOHxYDR3MhcdDaNAsKJydAz5IySKRNjEUmy88vjOVaU8F0iPCqCNjEBHkC/UYaGYFwqxmJoKLYOhkxPElg0QsbNtTlmox9yjRD9UCbnoOR+J/lwRWtOCcdXfDc2BPpg0d7CQlIQZPh9KKlVkAQjJ2x2zmOSsQu7hpzUJfBhLjsNQmADjxcT10Bcl4rE4EHc5LjBEhEPn7f1WTqXSLQB/s1Tp7vslsoIkyPPiMJAbi86McBguiaHKjoEqR4jJy2K0nAxApzMN5iUGrclrKVaz2fUvuF4tRbxDKA90w5VjTFyLZKHpTBSq4/1QnxGB2qxoVIZx0JopRCPHFSNOThfWZzfrXDcZEowH4iA05ATg68hDtBaL0HAuCm3lJ9Bfcx2fFNUoi/DCjRgfNHHd1wCZA2TyXjNkE6F0cBDpPFiojeNi8EkJdFoN3vXch0nbBJOhDd907dANv8JITxNqziag3ZsJbUDAwLin50Q9QWwl1qSYoNOVvUcOoqOqAAa9Fu9H2/F9+B5WZLcwOyxFX18flLI+VASyMGVeoJHD+Tzq5BS1PoaKRrNT8127P74swsq4FCa9FKvqBqwaOiz3hdEuLKueYSyECT2LNW0eIfo3E/WmEbvnG1MUJnWdpWhDGDvxQXZHo+RR0uW2tnv+auPX+TvtJm7zKpaen/4y2yjBUlcxlvtvmvT16ZWDpQeoVv3/60F/NrHjTf4ugazIXtJ8ivjnz/sJ+yGQRjcqUdIAAAAASUVORK5CYII='], ['Rabite', 'BIAAAAQCAYAAAAbBi9cAAAD/0lEQVR4Xl2MXUxbdQDFz/9+9Lb3tkBLCxTKhzgoOOZAsokbJmZxDFHnd+LL4hKVzBgfNCY++ODbjDEaZowvErOM6HRu6hKZY2rIAOkCY4OSDTpFaAsrlJa2t5+39+NvjT7tnJzknIfzI98Nf/C6TuXdguWBd1q9rcb8/CwsZiu2Ywm4nDVo3VWLZCKDaDwJq9mCg31PgjAMKKUwmcyYvTbek9iJRDm6M/XswEDjwNz6plWW6wdZhjUAintFCEEhn0N04zYskljaDLaj8ar49oUrsYR6mrFJNj322w46H8y+mitM/ZJKZmyE4XAvjJSsazpyuSzslVZIkgWKOvvRgQ6Xrdlhqmds7o7bFZoLkctreKxf7GtuCE7IyUQjBQcQ8j/lvxCGQJZz0IoCVpamTtzfIh9nwiaIrCQyjNg8mq11oDLUhNXRJfT1Ozr3tS/PqpnQ80qRgjAmKIqBfK4ItbSLKoOZqR/6neLkENlSUAIhlktvEf+sD2rkm8nWTHtvZCGMVON1ePuaoBER31/MXGly1wSqq9Uug6FluYyWXJiPqFXmjd4Dh9oF9ZKKimYXRtYCx8lmMIDIxlIPGz591av0mtanF7FcCEN6iMXeox2wOJ0QJAmUAoRQaIqCnWAQY1/ewKNGNeQuYXkm0d2NC2e+wvmRr/Hx+6+8PHayrbDyyQBNDb9As3PHKDWG6MTM23RoeJAWsqeoWvyUUv0UHf7pBB0fe4OeeXe3/vmHbx3+8dwIGJ4IsFpMMFe0fbtAn+nwZePr1u4MBK8XIALG/Rt479wYrs2vgeNNAMNgMbiNzybuoKVvn+Gs9kbr6qpBfJfGYHFIkJUCoGwfqcoMX/b27EGhwgOjoCADDlP+CA51ugFFRzoB8FYNaQ1oqKD44+eNL+wNj7zJGQSIhe8+jgQ9thk+27v/KRY6L4FSCkVOwtlQj6P73Qgt/o1ERoKt4iUkE7+jrZMHyzIoK9cOBFfT4LbWAk+0a7ZLnvqHcTNdACgFScfAcjxEdy00VQclHGo7dqGeYxHbvIo6hwhSghCehb3G5p6eW7VxXC5/xGWToMgrKKoaCnIalI9CIARasQAqloMI/x4BWrLLYwE1AEPTwCGHaGjz7pw/leZUNV8wNm9BLy6CxsvxZ1kMbaY4TKIIXlNBsynoVjvAC4CuAoYOVi+CMfLYCUfg95tPHuzZB0YtKzsb58RMucWE/fZmhCbdOP9rNnLnxko6GVoB8lFwyVVw8b/AyeulHoJyN4Rb19dTFyeqBlu6njvfsWcvOJvLs7DMmw/7bvpeE4pU2OIcgcqmp4fGAgt2Txwvqr7lTp5V7LquZxXC6+BqEvGcY5pyjaM1tffJbk89NE3FP5VQ6y7a+paZAAAAAElFTkSuQmCC'], ['Arch', 'BAAAAAQCAMAAAAoLQ9TAAABCFBMVEUAAAAA//8rqtVAqtUQj88tpdIYks46otwVldUbktEaldMjldM2qNcXk9IWktQZkdIYlc8mnNUXlNEZktEZlNIYktIWlNMXktE7o9klmdMXktFHqdkXk9EWk9EYk9IlmtQXlNEXktAWk9AWlNEYlNFDptkZldMYk9E4otg/p9kXktEXk9AXlNA4otclmdQXk9IYktEXlNEwn9YXk9IXk9FFp9o3otgXk9FPrdwXk9E2otdCptkXk9E/ptkcldIXk9Edl9IXk9EjmdUXk9EXk9EXk9EbldIcldIjmdMmmtQsndUvntYyn9YyoNYzoNc0odc1odc2odc6pNg7pNg9pdlDp9pJqttOrdzlYlFbAAAARXRSTlMAAQYMEBEVFhgcHR0mLS8zNTY3PT4/RU1kdXp6e3+Cg4WIiYqMjZGXl5mbnqSnrbS3zMzV3OPk7Ozv8fT29vf4+fz8/f7SyXIjAAAAmUlEQVR4XlXI1WLCUBQF0YM3SHB3a1B3l7Bx1///E6ANkDtva0jKbCW2XIH1z2hiZEZ4uUgxo7JedTQye/KN/Sb5tbJ+7V9OXd1n+O+38257TL+tah3mADAwSMM7wzQWF4Hff6ubQIZIAIb6vxEF4CZyATXhZa4HwEnEA+2QgoiyQDnIEWkjVSBBZBqXbCRlKYo8+Rwkyx54AOYfFe7HhFa7AAAAAElFTkSuQmCC'], ['CentOS', 'BAAAAAQCAMAAAAoLQ9TAAAB5lBMVEUAAADy8tng4Ovs9tnk5O3c7bX44LLduNO1tdDh7r/eutj43q2kocX23az07N+qqsvUqcmXl7331ZXJj7r40o/Pn8T42qP63KjNw9n21p3Y387Ml7732JzR55z05MSxtMLGn8TC4Hx8eqt8e62Af6/B4HnG4oPC4HzH44fBf7LCgbOkoMTcsrmtn8PWqcfFtKrj4Jvs2ZOz2FnMqLXT3KfY5p60Z6NUU5XRuqHzwWSywqDn3JaiiLWahrWhkry5zJjRmqm1Z6P1wmb1y319fK632mK5cKi5nH+73Gu73Gy73W283W+9eK17e6y1yZS3aqRZWJdcW5ldXJplXZppaKBwb6VwcKV5eKswL306OYNPTpGkfK+m0kGpUJWq1EnEqIuXK3+Xh7ahP4qhkryMfK6BgK+CdpGMaKKMa6O9ea2+eq6+oYW/eq+NbqWVlL2Wlr7AjanA4HnA4HrBkqbBlafB33rCgbLCmKjCxIzC1mSs1UytV5mtxIWt1lCuz2evWpuvXJywxYzHjrvH4oXIjrrN2HXO5pTO5pXUlYnUlYvVl5Hb0G7e0XTg03rhr5fpzHPpzXTp0Hvtz3/wrDHytknyt0zyuE3yuVHzvVr0wGP1x3T1yHf1yXe0ZaL2zYP30o730pD31ZeRIcF5AAAAQ3RSTlMAFBkbHEhJS0xMTk5UWWBsd4SEiIiPkJCVlZaam6CjpK29wMPDxMTFxcnK193e3+Dg4uTn5+fo6e/v8/P4+fn7/P7+J4XBAAAAAOBJREFUeF5Vj1OvAwEYBb/yGlu717atLW0b17Zt2/6nze42TTpvMw8nOZCAmwUpiIY6c5IiLi9tPX64GairqszHQ4X2VB64v1Cs6PxMPJSdHM777s6/jyaMRGiRLyyrb88OpjZ3CzAXrm1sqzSNNeN7kVBPNgB7cG51abE5l9cXDces7emQ1uadHhutFUg6gpPKkSIqQGavwz7r7O/+/3t/rSdjI9XDM3qz4fr3B/3iA0aJTG9x71+9oR/PLDwUe2wm19bly+fTIxHyEETatbPewGEw6Mk/tKZCEqSQQUlIHB/QNBEjjVN1AAAAAElFTkSuQmCC'], ['Debian', 'A0AAAAQCAYAAADNo/U5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAZ5JREFUOE+Nkk0oBHEYxv8fu5GQj3JwcaDkIAc5IpR87M7MKnIVJVKclaIQ5Sy5OLkgR7n5OigcSNpmd2c2Vyfl4KT8/muWiVU79TTv+7zv837NCBF6PG1X+NpZyEYSD9mIc+tHnBPe23B9xKrCuTmbQA/JKfABrhBswa1hH4A38IwfOxPdX1qcjiCQxO5NyrjKV70TnSbeRPwJvGN3i4yyqnEucPY8ZZX9GSEgGK+RvFfyjk2VKZxzBNG8wJWWgh/xtDOeUXZ7Slr6TrSLYL9N4SMgYTTcwdc2ArvJcElhSVcM6mCNSV8n9hA59yTU5UWMG6HIbLhIWlglgWiC2L4Z79qTdo40D6ISuOWwKCWHyk9Fv8ldpUHOuGTuynwSBUynddPdlbEosVpP9Eu4FnOsRzUYNTsdmZN/d5LDiqM0w+2CMdAFFsFGWgfXxZnheqe/z+0puwEM0HHYV3Z9Sgz8TEz7GkQvpuJ/36ggj2AaHLrSlkULWV5x+h2E8xkZL16YVjGNaAUscfZ/f6c/k9ywLKI2MMcRWl0RLy007idmRbQJ7RIfDAAAAABJRU5ErkJggg=='], ['Fedora', 'BAAAAAQCAMAAAAoLQ9TAAABPlBMVEUAAAApQXIpQXIpQXIqQ3UpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIqQ3QpQXIpQXIqRHYpQXIpQXIqQ3QqRHYpQXI8brT///8uTYMpQnM5Zqg5ZqnS1+I4ZaY4ZactSn8uRnYrQ3MrRXgsRHUsR3s8bbM8brMtSX4wUosxVI01XZw2X50vUIguToQvR3c6X5o6aKs6aq08Un8qQnM9VIFDWINJXohKcKlXapEqQ3UvUIc2X55bhcBdcJVgcpdhfapmd5tuk8dxgqJ1hKR5jbB6iah/m8Shudq3v9C4wNG/x9bFy9nFzNnFzNrIz9zK0NzK0t/O2+3P1eA2YaDU2eTb3+jb4Oje4urj6fHm6e/s7/Tz9fj3+fz7/P38/f3+/v83YaEa/NNxAAAAHnRSTlMABAoVGyY1SVlpeIuQsLfDzdHW4+3y8/b39/n6+vr4+ns8AAAAyklEQVR4XiWN5XrDMAxF75KOknYdZJS0klNmHjMzMzO9/wvMcH7I37mSJShsJ+5NjMT6umDoHyXDcI/2qJadh++P3cle1de+9yPe3/bTY92wzfzr7wGtP3JrAI72BZGVtcAdQlwHy+JS1pDbBE9qamZF3BYrjQxPEXwKc6dC8bXFm0QIpmt8kn0Rn093q82UCtK8oXZckwFJzuulV8bHkajPyXdbnJnARfDHs0trz+JQ+5AFvzp/L0+cL2qPAINUPrq5OC6p/64F/AMnrST+Dq/r7QAAAABJRU5ErkJggg=='], ['FreeBSD', 'BAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAABIAAAASABGyWs+AAAABmJLR0QA/wD/AP+gvaeTAAADXklEQVQYGQXBS2wUZQDA8f83j33M9rF9d7u4loaWklaDpkSo9KDGaIKUaGxshD2YSPRiuDVeTDyhBxosJCoa40ktpAkPDcUqAYVIpUSUPrAulEdD2bbb7e7ObGcfM/P5+4kwKDvq6yJ1FYYcvb+YAkqAHo/HQ7FYrFIoCiurq9ZXJ06YSOkA+kBzfX06bys3zHxS9EL0tXDVyZfefacqV+X/ZSJx5+qLbx98LhaL9RiGEZWlEsWC/Thd9q6Pf3vs2u6Orc83rFsvTwwfLf5obgywT1Vjh2Hh+rbNsnTssJdNLedK5aIrpSuldKVXKsnH4+Pyn6FDXn5tMef9O+3NvdkvP1V4+EYw2AoQ+KSx8dRYS6NXXnwovaItXduSrrkinWxGOmZWJi9OyOK9m1LmsjIz9IH8QUMOd3WfAQwNKCy2tJwbHB5+XasPaxIHmc4g7WWEZ1MquBiRFlJTf1E7+Tl/H/8asavPzTY1nWd2ZkMDRPeBeHPz5ojwsilEQCBvTSKunCF3M8FSNkBGVTHDYYrLj8jVNhDZ2SMa2zo3MTamaIC/u6Ojr3DtrOrvP0BpdATnyBeIhTxpR5ABUlKSUlXS1dWstbVxdz6hPL0l1quGqkLaKwNvVcjEXNRd/4mit4Z19DjefBEPyCKxgQJQcF28dBrHNDGTSZSezsjeff0hraa2Vs2vrvit81O4vj9xLJcC4ADrQA7YAGqBGsAql/EtLdFQE/L7dF1XZmdnSrbPMJfXoLDmolQK8gJyQBowgQhQDRQBD+hsraVhd4e5MH+/oExfvWLJ9q3/3S7qMpNH2hsS40kFS4EUUAMA2IANRIBXv4uzuO67c2PykqkA5YmZ6bN18YPi0Yoknxc4AsJPCMLVAk2BLKDosCWqs/PZaulkuxk9fekcUBAAQGDks5FT0W++3NuYuC0DVUL4DIEdlIQDAj0IRkigaMjArkFx0tf523sffrQHyKsAgHPhwoXLL+yP9/kePNhk5ExUTyKFkJVAUAiCFZrQup4Rv9ftuLV/6ONBYBVABQAArMvJ5MXW7duD6P62sD8UrPAFRU1TpeCpCnGvPZr7WW///v0jpw+VC9ZdAAABAAAAAMLo7drWrmQyPWG/r8tnaGIjaM05ujr16x/ZBFh5AACA/wGZnIuw4Z4A3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMi0wNy0wNFQxMDowOTo0OS0wNDowMOPVpFwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDctMDRUMTA6MDk6NDktMDQ6MDCSiBzgAAAAAElFTkSuQmCC'], ['Gentoo', 'BAAAAAQCAMAAAAoLQ9TAAAB9VBMVEUAAAD///+AgICqqv+AgIC/v9+Ojqqii9GAgKptYZKQkOmPj/ddUYBgW4eVjeCTgfiWjO5wbJaZkvPBvepkXomYkNldV4Bzbpl6dJ+Uj7ynoO6Vi+1qZI63se2mnudjXYjOy+GCfaqZjvWlm/Pc2e+Oh7NeWIOWjfeXjeW1sd+gl+diXIfp5/KHgKnn5/F2cZx6c6ZgWoXc2e6dltrAvNu0scrX1eTOyujCvup4c5qpovVpY43///+6uPPJyPXq6fvm5vrz8/z8/P7+/v/d3PixqvmxrPSyrfe0sPO0sfS3tMve2/3r6vy6ufPz8/3d3fi3tM63tPO4tsu5tsu5tvO6tfe6t/Vva5KRjKy7tvW7t/W9vPO/vM+/vvPCwfPEw/TFwvTFxOfGxfTGxvTHxvTIx/TJx/aTiOrNzPXNzfXQzfnRzuHS0fbS0vbT0uHU0e/U0uTU0/bW0+zW1ffX1vfY1/jZ2Pjb2/jc2uSTiemVkLSlnvbe3PTe3vng3fzg3f3g4Pnh4Pnh4fri4enj4/nk5Prl5Prm4/ymn/bn5vro5/rp6O/p6funoPWsqs3t7Pvt7fXv7vzv7v3w7/nx7/3y8f3y8v3z8vytqPWuqPX09P319P319P719f339v739/34+P35+f37+/+uqev9/f6vqvSwrPQAR0dcAAAAPHRSTlMAAQIDBAgJCwwVFyAsNUFHSVBneH+Bh4mVmZmanKCxsrK2tr3ExtDW19rb4ODl5u3t7u/w8/T6+/z9/f4MkNJ1AAAA8ElEQVR4XjXNw5aDURSE0YrRtm3b54+dtm3btm3bz9k3Wek9+2pSYFwT8ibzE93hwAtdJqK3nZo4J9hFXbP+vFHOthV6gnGzstZq94wdCs4UCCDymQ2v7X0LdYoSQ0MIENRYzJbRlPTTHu73ZNAL8vivmVui98PpzuqffX0mIPHJGtOQenukteJ+aS3b9htNpDnT9TeZH1bHAwBRMhGpd6e6uNrLoRgxBKmsX47nBlp678ojpEA40fejcmW4e/No0V8IIPfj6eKgbEJ3ZUnzgE1OqWp9Q3VeWRAsg51f1dZ8c31RmAsc+N5JGbG+zvj3BzDCPrzMDC9SAAAAAElFTkSuQmCC'], ['Mint', 'BAAAAAQCAMAAAAoLQ9TAAACVVBMVEUAAADh4eEAAAAAAAAAAAAAAAAAAAAsLCyXl5dgYGCnp6eTk5N3d3fBwcGqqqq8vLzNzc3Ozs7Ozs7Pz8/Pz9DQ0NHR0dLS0tLS0tPT09Pf3t/Pz8/i4eLb29vZ2drZ2tna2dra2trf3t/u7O/u7e/u7O/r6+vt7O/w7/Lw8PDy8fTz8fXz8fbx8fHz8/P19fb49/j49/n6+vuPxlmWyGOx437h9NDr9eD6/fj////+/v75/vTA5Jv6/fb7/fnL5bDL5q+AxjeDxUCEzTyGxUaGzjyHxkiHzz6J0D+Kxk6K0kCLyE2M00WNy06P00mSz1OUyF+W2FGX1FiY0F6Z02CZ21ac0Wiez2yfz2+f2mOh4GCi4GOi4WKi4mOk12+k3Wul32um1Hin0nun4G6n5Gin5Wmo23Op2Huq1n+q43Cr526s4Hit23+v6XSw34Cw34Gw6nWx4IKy4IOy44Cy63ez146z34az4IWz4YW03Y217nu38H2625e645G74pK83pu98Iq984W+4ZjA4px0tzDA5ZrB8ZDC5p7D55/E947F6KHF+JHH4qvH6qTI46/K5LLL5LN1tzLL5bN1uTDL57DM5bPM6qzM66/N5rTP6LbP6bTR6rfS573T67vT7LrV7r3X68XX7MHX773Y77/Y9rvZ8cHa7cjd88bi88/j8tTk8djk9tHm8trn89vo89zo9N3p9N3p9d7p9tvq9d/s+93s/dzy+erz+O73+vT4/PX5/fT5/fX5/vN1uzB3vTD6/ff6/fh5uTj8/fv9/vr9/vx8wjV/xDmrMRH0AAAAOXRSTlMAAAECAwQJDzk/RUlNU3F0kpSVlpeYmpucnaKjpKWqqqqtu8LExMTEzdTU1NXY4evy8vP+/v7+/v6LaR1mAAABD0lEQVR4XiXI03bEABAA0KltW9kaW3eSZW3btm3btm3b/q4mp/fxgqKOtpamhrqaqoqykrQYABh+PVMU9fjE5Xp8o54kgPHN0EBHU2N5YXZykiua0HHd2759VF2Sk5IYE5GGsmCEWLV1kVWwt5O+3x/qpgsy8k4ja+cJl2/v5C22tlgCAHtw9TQSa4s+AzfPSm0BRNl9SydhWJzLC567KrNhgrNwHIJ5qTz/2f9w7Jw/DNqIjVr04exW0AEOXcN3Ab7enr9eDW2VTJgehONyc2Z8XP5YdD0Tcuhcc4/r45OjGX51TEjYPbh8THRPvbz+CHusgSZlT7rP8PkCwfQKaQUi9Igr6JsRBMFiWZgb/AHKElRzKopZJQAAAABJRU5ErkJggg=='], ['osx', 'BAAAAAQCAMAAAAoLQ9TAAABrVBMVEUAAAD///////+qqqr///+ZmZn///+qqqqAgID///////+tra339/eAgICoqKjx8fGMjIzm5ubh4eGPj4/g4ODIyMiAgICSkpKLi4vS1tbPz8+Xl5eMjIypqanIyMjW1tZ2dnbR0dGamprFxcV3d3d+fn60tbV3d3dcXFx3d3epqal7fHxxcXF+foCnp6hYWFhyc3Ojo6SMjI5fX196enp+fn6Li4xERERqamqgoKFpaWmFhoeen6A/Pz9QUFCWlpeSk5SUlZWUlZaOjo+Tk5RHR0cuLi5YWFgwMDAeHh40NDQ3Nzc6OjpcXF1rbG0XFxdSU1NVVVVXV1dZWVlbW1tnZ2lwcHABAQEEBAQXFxchISI+P0BISUpaW1xHR0kNDg4qKyszNDU1NTY9Pj8NDQ1cXF4XFxhSU1QSEhIDAwMrKywtLS4uLi4wMDFHSElISEggISE0NDVJSktNTU1FRUVWVlhGRkYEBAVBQUE0NTZQUVJQUVMFBQUqKitWV1lXV1daWlpaWlw+Pj8bGxtcXV9dXV1fX19fYGFgYGBkZGRlZmhpaWlsbGxwcHB2dna844Y9AAAAV3RSTlMAAQIDAwUFBggMDhkeICMkKCgqMDIzPj9ERFBib4CCg4iMjZCcnp+jqamrw83W1tvb3ePl6Ojp6+vs7u7v8PHy9PT09PT3+vr7/f39/f39/v7+/v7+/v50ou7NAAAA30lEQVR4XkXIY3vDYABG4SepMdq2bRSz/capzdm2fvOuDO397Rw0Ly4tz2QAQPbcxuZ2E/STJwfxPhWgG355fRrVAIVb1zeP9UDLfiSwkAcADe8fn7tFxWuEXFRDoer/OgoMTRBCumj8yJwPBo8Zhpk14U856/HI8n0ZUtpZ1udrSzfVneA4roNKjdrwpcMRilb8d8G60+lKnrpWcn9bO+B23w2O8Tzfq4aiNSZJqzn5O4Kw16h06fPZ+VUlUHfo97+VAEb7rSh2UgDd4/U+TBlQY7FMj5gBIGvcarVVfQPVPTG94D0j9QAAAABJRU5ErkJggg=='], ['Rhel', 'BAAAAAQCAMAAAAoLQ9TAAABj1BMVEUAAAD///////8AAAD///////8AAAD///8AAAD///////8AAAD///8AAAD+/v4AAAAAAAAAAAArKysAAAD///////8AAAAAAAAAAAAAAAD///8AAAAAAAAAAAD///8AAAD///8AAAAAAAAAAAAAAAB5eXn+/v5JSUnKysrS0tJ5eXmqqqqxsrL+/v4ZCgknJyeHh4eIiIjo6OgZCAdOTk7t7e3///8GCwwPAAArKyv19fX29vb9/f0EAAD////+/v4AAAAGBgYHAAAJAAAMAAANAQAPAQAVAQFyCQV9fX2pIRzmEQjn5+cBAAAFAAAAAADnEQjvEgn////uEQjyEgnsEQjzEgnxEgljBwPaEAj9EwnwEglHBQJHBQNNBQIBAAB3CQR5CQSHCgWLCgWRCgWTCwadDAWmDAapDAa/DgfKDwjWEAgGAADh4eHiEQjmEQjmEQkKAADoEQgLAQDtEQgMAQDuEQnvEQjvEQkPAQAfAgEuAwEvAwE8BAL1Egn3Egn4Egn6Egk+BAL+/v5CBQJrB0muAAAAT3RSTlMAAAMEBAkYGhsbMTRLUmpvcHeIjLe6vcHCxM3P0NbW3Ojp6u/w9ff5+fn6+vr6+/v7+/v8/Pz9/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+Q8UoNAAAAO5JREFUeF4tiwVPA0EYRL9SXIsWl+LuxfcOd2Z3764quLu788NZNrxkksmbDP2R7vH6GioLs+iffEzNXd4+TqPErUUpVqMOvwgdzMPn1rv5vPsVeufBTaBK/bH2FPvkEUuIG5jIIc+sHYn/HJ3dC/Hxuo4y8s44dzwBbFkisHN8bVIdXs6jb+H97aCwbHEIqgcml64CD7YllNkAVQC940MLYe5YzvIeQAXNrd19Roc5MdzfdQLUUKaUYyuG9I8y1g4gj6hIak4X5cBIT2MquZJrJdOqpY11ZpAiqVwbY/C7KY1cRCrZxX4pWXVuiuq/hs49kg4OyP4AAAAASUVORK5CYII='], ['Sabayon', 'BAAAAAQCAMAAAAoLQ9TAAABvFBMVEUAAAAcUaYdVKwAAAAAAAUABAwWRY4YSZYhZtIhaNYHDx0KCgoFDBcKCgoRMmYSNm0fXL0fXb8AAAAYS5gaTp8fXLwgXsEGBgYFBQUZSpgZTZ4JFSgODg4IEiIOJkwOKVIkW7EnXbQLGzUTExMKGC8LHjwMIkITExMiIiIPEBEPJ00QEhMXOXAaPncOJEgoXbApXbEcHBwwMDAEAgAfHRgQDgo3NC8AAAAHBwcKCgoLCwsJCQkaGhofHx8lJSUwMDA0NDQ4ODiRkZEICQocHBweHh4GBgYHCg8mJiYnJycpKSkrKystLS0uLi4ICAgODg43NzcRERF1dXUUFBSjo6O1tbUbGxsEBAMLGS8MDA0iIiIjIyMkJCQNDQ0NHTYKCQkoKCgPDw8QEBArMDkKCgkRERIREhMxMTEyMjISIz00Njk1NTU2NjYCAgIVFRU5OTo5P0c8PD0+Pj4/QURAQEBHR0dKSkpMTExSUlJiYmJlZWVnZ2cWFhZ2dnZ4eHh8fHx9fX2FhYUXFxeVlZWXl5eYmJiZmZmcnJwZGRmlpaWrq6usrKyvr68KFiq/v7/FxcXY2Nji4uLn5+ft7e0yif9uAAAAN3RSTlMAAAApKSkqKioqg4OEhISEhoa1tra3t7y9vr7S09PT09TU+Pj5+fn5+/v7+/v7+/v7/v7+/v7+70RY/wAAAPpJREFUeF4dyWNjw2AUBeC7dfYyorM6rx1exKltzLZt2/rDa/J8OgBVVlFDX39jcTZoUqCse251a2dvu6ccUtWlanLQ4Vpel+ThlWq1l3wEz58tx4dOt1dMlAJk9A5gMjG75LHwo46hzkwosGOMbejumoRvubC9EOrMviT0E0Us9fvN9dA6zxJCNv6+ECGsb6oNWsgmpZT9/UTUZo3Em6AW34guTL4jiAudiCM1kLcw8/SmHERfT1/eueBiDqR1GK1n9w+K8nglxYxd6QAML4ztXoQuj8YFgWcgqdJp8qzty26vaboCNIxBCshyQDKov0aXr29v1ufq1PwPx5Q7bCoh6eoAAAAASUVORK5CYII='], ['Slackware', 'BAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AcEDi0qZWWDgAAAAx1JREFUOMt9kktoXHUchb/ffc1M7rySSdJMOknFPMRitLgoNKKI8ZHGKkgrjU8SitidimSh2UkXoQmoO1dGQSxJjdvOtqSaqlR0USEGSjVJGxuSmWR6M3fu4/93YX0g4rc9HA6cc4Q7DI+fpzz7PA8++2mxvZAeBZ4xhHtFcJRmXWsWvb36/OLcyxf5B/KHeYHy7DmGx1+YSDjmWTdlobTGMAStQGkNoLXS4tXDq7u7tUcWz49tA8jR8QUuzB5n5NTCV13F9JEo1JJwTLKuzU61QiOMcd0UDb+BncwQK3Rl15eNja3ui/Njq8aF2eMcO/XlBz0H8oO2ZUkum6A13WB99TtyzXlaCi24SaFa+ZFCzsG2DNnfkdbFjsI1APPhk+d6ujqznycdCxFozadYWvyMpx47wa+bPkGksKwUNnsk3TaCGASRXDZh5LpHXPPg4Rcni+3uYBxrtBbQghlscOVKmYHeEm0ZIZ9xyLffw41ND6VAa43SmjiMByzHYtjzwr9arfshxf5jOKlvKZfn8es77N2uks24PPfSFD/9Uvt7AtPKWmEU9d645eHYJo5tcKi/FX/zG+zmQxQH+rANk862DOW5N/hhaY64cJSa5xNFCgDDILZACMKYWAmh73HmzFsMlBQJ06LeiMinE1S3KzRCm5rXIIoUIoKIYCVM36urZFbEoiBLNMIhAE6/NsSB7h6SKZdL8xsUOnpx9j1KbTdARACIowArYe1ergfNT2i0mIbJys0GI6PT3N1/hJvrPxOFdRJNBQIy/FapI4Bpgohgcjuw+jq8jy8tV55MNBWI4ohS802CpizKv8q+FgALZAfYgSyAZtNro1oLaU1VvxCA029Oraxs7u/tKnXiNjn8HyKwur6lI++6vPK4V7IA7u+1Dyu1tr183ddNbkHuXP8/zEIYeFqiLRl6YO/p0bHJdflT/PD9qZa1W+ry99fcvlAlcZwUpuUAglIRYVgnDEIOlna4q0M/NPnuO1/PzMwg/045O/XeibUt5/Xangx6viSVFpK2jtMpvdyWCz+5ryf10clX3/amp6eZmJjgd441URWWJY8BAAAAAElFTkSuQmCC'], ['Trisquel', 'BAAAAAQCAMAAAAoLQ9TAAABjFBMVEX///8AAAAAAAAAAAAAADMAAGYAAAAAHFUAGWYAF10AImYAIGAAHloAHGMAKGsAGmYAJmYAJGEAKnUAJ1gAMXYAJnEAJGQAI2EAK28AK3cAGTEAMHgALXEALXgALG0AFUAAI2oAK3EAMngANoYALXMANIAAM4IANIIAL3gANIcANokANoQANYQAOY0ANIYANooAN4kAN40AOY0APZMANIUAOY0AO5AAPZUAPJAAP5MAPpQAQJUAOYsAPpYANoUAPpoAPpUAM4AAQJkAPZIAPJEAQpgAN4cAPpQAPZUAPJEAO4oAOosAOo8AQJoAOYsAO44AQpsAO48AQp0AP5UAQpoARJwAQ58ARaAAQZgAQ54AQ50AQpgARaIARqMARaMARaIAR6QARaIARaEASakARKEAR6MASqsARKEASKcAR6MARqYAR6UATbEATa8ARqUARKAAR6oARqMASKgATK8AR6QATbIATbAASq0AR6cASKgASqwAR6UASKcATa8ASqoASqwAS6wASKoAS60ATbHn4CTpAAAAhHRSTlMAAQIFBQUGCQoLDxAREhMUFBUYGhobHB0eHh8gIiIjJCQkJCYoLC0xMTE0NDo6Oz1BQUNHSUxOVFVVVldaWl5iY2RkZWZoamtsb3FycnR1ent9f4KDhIiJioyNkJGYm5+foqOkpqamqKmqrKytsLKzs7e4uLy8v8TFxcXGx8rO0NXY2eZc4XYcAAAA00lEQVR4XkWN1VoCUQAG/3NWtwh7CTsQJOyk7BaDxuxA6bbrxf32gt25m7kZqDRYxziooDV7+1AalMUavQh2AsEZoWvzigLun+T17/c8QiJZ7qu2QKiNmyZthdcR1/as353jIeU1GxMHo5XHdqPFeX8IaDMdHPYN6dRN7LR4qQewdTa35HWkyh+fbxERAMjwlAWJv3CPSKDQ+H7XvHdkV4Pua3Gtm4sPKIF/WV8dop4VKBw/NU33B3x1JbTt+XwhkJQoqRfWvHOy28uqH8JIdomR/R+s9yR3Cso77AAAAABJRU5ErkJggg=='], ['Ubuntu', 'BAAAAAQCAMAAAAoLQ9TAAABKVBMVEX////ojFzplGf1zbnqnHLvs5P10b3yuZv1xKrytZXvtJXys5LysI32waT0n3HxiVHwg0jxhk31kFn0h0zxf0P0hUrveTv2iU3yfkD1hEfyejv5eDLybSX0aR7zZxvyayH6ZxnxZBj4YhH7XAb5WALlUQLeTwHgUAHeTgHfTwD65NzdTQDdTQHdTgD31MfcTgLcTADcTQD////xt5/31Mf54dfmfE/dUAbeVQ/jcUDcTgHeWBnnflHohFvpjGbqkGztnX342Mz53dLgXiP65d399PHdUgrtoYLyu6Xzvaf76eLfXB/rkm/fWhvupojwrpTeVhTgYSfgYynzwa30xbL1ybnngFT31snngljhZS3539XhZzDiajbibDn77OX88Ovrl3X99vTjbz1fisGCAAAAMHRSTlMABgYGBwcHJiorMDA1NXGHjY2Nl5mZmZyfn6O5u8XHzc3X193j9fj4+vr6/f39/f08OUojAAAAx0lEQVR4Xi3HZVbDYBhGwQctWqzFPXiQ+36pu+LubvtfBKcN82/UEhld2vWXxyL6F92gbTPabse8hU/uHMx1SZoyyJWPTwq1Rs7GpYE9+Cg+OJcs1MHvU9y4fnrN31yUm18vMCIPjtw3QMndw4rs8ieVzAAcBlewpe1KM3uaBuD3Dda1BhWXAsi6AFY1a2SqifxZ+rnxWYcJDRkUS3fO1R5vwe+XZgw4D4L3RAJiknoXCVX3WeiUpJ5pIxTvVmg45pl5k4Ot/AGV2iqZBWgJJAAAAABJRU5ErkJggg=='], ['Windows', 'BIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA+pJREFUOE+F0n84FHYcB3CWSsL9ojo/6ik64c6PnTjmSS0limmrpBm2G002y++xzXRz6zE0R4nbw+RnTj/WD4sbanLkkAe55ccYlyNme4SrO9u9d13PI3/saZ+/vs/3831ez+f9eb5aWsuqy2mjRYeNUa7YmtjfTico7jNJ8z0eG24NB9vvnDrvufzpq89Npnr8VjMddNmuRh9rDfp36mFg91oM7qPIc5JdbDJq3An/JfCu7Hl53W2lpS220pP2OuniN299jAYbYizSENIoAgbCTdrTKtxOJVdvGo8psUwKy7Vxe4ez1YEVudGP8YEZzyveInFJ6mZRHHqYazDspw/pJwTIuERM5JIwmUdGdyo9K7/BszGzzg6fXzZHGJ8KvzQqXKOpoIeZLjofWR++BPWyCEnPY4xFGEKWQcLjMjKmr1MwfcMYwmz/Y4KOgNki0V5k1dkjUWCK93Kp2PMFFawos8cm1gZ2GqjLXktL4mbQPHLQ4B9ZDFE5+S356fQlyuJMqzH++HnTo6ui2OO1ko9Ul+4fxfd3d4F7k4YTReqpuFS88bGZUE2QNNDobuIq8Q5CduHb7lFJaTnvnym9ergjMWD/FG8zf+aKS3G9JO5C01Asah6wUXrvALKEDoitMMHhDKrKJdg8RU2s0EB2EWWur8dd7PDPFv6dUC0Gv3kAN36VPRGP/5k5NS6lljWxG0TDiSr1VKhoPwhevRMSqkwRxDObc/DavGtpP6zoi8XOyZfhnyNEvKANBU0P8VPfI/wyNCGXSn7wlEmyA9KrgmOKGth3eDVvPfyywq2dnUEv2R9qG2rLsH7xJXziKnWcI8tlTvEC7Mu8hROlImTU9aKqcwQ1vWOihWFu+sJknmph5CvxQh87c7bNh/NXo03hrMCosyvLmMNgMF7TQL6J1dsZIUVwjKqEO+cajp5vxPN439U/gKBt8PTcYHzL/BgHCyOf4unAISj6mFC2bYC82kB5Ls460NHRUVsDeYSXpGw7UgC7sAtwShDgzdM38W7BbURXtqpqhfmB8sEQuXwoCM/6faGQuGCxyxyKWhIm+PrSD495WL3cT0hhi8Whc3NbAs9KaOyCTvrJ8qkdX19XBeTUDU00+55USFzVU2yHstcaix0mUAjJkJeuRU868Ucmk0lcguiBnMAVxjbbdHV1yeq8+u4Hgo22huSG+iQXp83ftaxW3lsPZcs6KG5T8OwaAfJiPcxlrVRVRhvF02i0F/t5VbHZ7JWDfErKTLnhE3mFPuRFepg/uxqz6TqLv6euGj3ut87t/4ylvre3t3ZehOWWO1zjSFEqMVP4GfGb/DBykJcjmaZOoLsc+hcVY/LaAgcTQAAAAABJRU5ErkJggg=='], ['Pinkie', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3dJREFUGBlNwUtoXFUcB+Df/zzuY553pp2MmUwSk5TGpnamiokWRdNCSkCrUChKCnVZQUEUdy5sQZC6cyd2VWgoutCFXWTjIyp1UdqmEDBRsSZNmkmaZF6Zx32ccyzowu8j/M883pH5A9kBYfNkFOpu0OiulyqXmnhkDmdYHYJexzX1Ef51EQDhP9fxpjU0PDCd7IldYIxGVag3/KZ/ZX1p8/P0k/0U47qs291M2NS3f6ncuLeFeQ3A8KuYoNPoY/3e2Ej6scSnqUJ8gksmhC2y3OJHpSUHU0/3HU+WCuddyV6VSpVyYv/aUuPefWAP4iDG8AhJWyYYo972tg8DQ1wyWHGZSfcmZmQ+YeKTw1bQ70H8uJw3xtDp6NzG15VLf/DLWMBZHGPkwuWGyq7njLoZyzAiCtqRIddioifBxYBHIpeE0oaw0yoG7WA755dvi8Xih66BOSZj4rwds45bSQkuOeOCQYWG2PjjcEq94JwjQgQ+kCW+tBl3H7Ym4jnbE/nDmamwqz9mnEaYoBgiZaJIGW5zEIHEPheykMD2w12ztPIXCrZHec+GdOVAUI8ygjvifeHQESiNoKtMlIoRxSV0owMjAeY5+P3BKrbTDq3n02B/7yDTDkBANSXiewKgjFbahEwQe34IiVIfRNqCv1qDanQR9Di4+tU16N409o2WMXnyJeNWb9PO4s6WroZawOiSiozCoR7lPFUQezICCzXF+pPGYRna6/rotNqY/eJLUzh4mM5dP4Va0YXV45x0O9F9FhkN5auq4eznaq3WmP1pDkuibW5uraNaqyNh23ihPA6v7wAVS+PwXAGkbYiUnU3kYm8JzvgGpJGdG6vzm15+ce6H79/9bnnBhCxG702dwnTaw4nyM/jsiTHsHx+DEyjKWnGEUpBOyjTTgbpsNHyLojPe7PK3qci58NvNu0Gl0YA8NIxWp4MkdzCdK2Ci6iNYXIV6UEfUDBC2Q/A3WqVbUUfVucWftYhP9fLiFf7yRPGVmZmhE88dJVmpGRMqRH4E3emSbnQR3lkzaqNB3br/J39tb1ibJglGfJDZbMReb37Td/bFhcnB/iNppXNUbZEKFGBJ6FBT+9cVo5c3yd/trDV3OxdFDDHFOV8IffVJtNNOC+J3xtYqATWw0Mm6RIJ9YAy9rdtt07q1ZtjdVXCYFRBG4Bv8A+lliGhzN164AAAAAElFTkSuQmCC', "pony"], ['Applejack', 'A4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAv9JREFUOE9dkmtIU2EYx88Roi9FfahkfQmS6kNGEBRlZWSY5tylTKepqR8MHYGl2R1POm2u5bCVlzbog2Ze591pzZPZxUskDZLMMLSWzcIca3MXt7N/55woqhf+PC8Pz+99n+fPQxAEQf6vhINb1nG5/ISdobWXo+9eSd4tyM7OJimKImmaJhsaGjjmX/DGqfDQmkvRg1x+9YrlZPd18fdupXiu6mxkOAcqlUqyuLiYB/+cayfD1rKFH0w3pYEHV4/omhTCyieVcYEB7TEYSyX21Mita/6u/91qUBMV00JrjmKwMg4zI2fgnlfD90PLx+nhMyinIrb91SFBFqaHBevPHb7G/fS06jhs0wXwO8rBOLXws2Kct/k4//HKRE+jZD0Pl2buD2FnmOlVSUFrpJg15/JFgcWKP0Bg8Q6fs1sVs+11wmAebKaEuiG1CC81Yozci+cL4KoC3JUIuCp4+R23+Ee4Dr5bisZmJi7fJzpLRJZPOin8vSlwdSXDO54Hz+vT8LzLh3uuCIuzBfDa1DzMPcrJMVfkIHpVEu94uYgH/aaTvOxdJzDZkI76smhY2mVwDmfg8zM5RukcvH8pbx96mLiPMBTG0nSpGK7mePg6k+DsSUZbSQwem02oba3DRsFKzNQfx9sHSdi1dzve5Ow4xM+ozorY1K2U2MY0IrhbEuB7lIqB6gxY7B9R3XoHAoEAivN74O5LAaXNwvNLe9PlcjlJACANRaIRztFh1iRvfRyYx5kIOCwY+GCE9GIUOjrzwZjS4H16FV80UT1WqzWIWFhYIBsLhDf7y46Ck1UvATNKgXlxHgHbJDyub2DGVPC2s+bVyGDTx74ym80kwe2fKvNASN8NySK3NeayWNagNPj7WaP62Uhn8HdPkwyWW3IoEjdv0Ol0JGE0GvmV0+dFpj9SS5kOKuahr01Wwbb2lXV6aakjkfF1p8DXlwHnaB5yTm1bbzAYfs34e/+0pyNic+N2ruIWmQWXcdE1dUEGd9UYq6kle1mXqVW6imWIn290AGVZutJTAAAAAElFTkSuQmCC', "pony"], ['Fluttershy', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA2xJREFUOE9dU91PWmcYP2uybDfrxdIlu9vN/oglverWNN3Fmu1iN7vY2q4utnE2Nu26ukyrUUGwExGpn3xY+TyACjrskFrcEYoWnCAM4YAgcJjROkFA1q789nJczNaTPHnfk+f5/d7n4/dQ1Cvf3Ut3Xp//Qnze36gYCt56kIgJpyqRFvrvcIvxMNxhSa9eV993XJK/+yqO/zdf7j7tbRz1RdstLzOKReRoLxJSOzb7HyKtdCEumgErmEbwO03U2aR8738kzq8ln8e6bXlWYMWmZA6Z8SUk5U5ytyPeY0Oy1w5O50FO+wQ5jbtG4lK19L5BGehzb9sE19+JtFt2c8ZlJPvmwAqtSA06EWs3g+2aQnacwdbwAmLknuiZxaZ4FiTD6tLFvi+pBeenb/3mvvo4Yu3D5v1ZsP1axHpUiAo0iPyg41/dGiNgiQI5PXmdXkai92dkVItYbZ6YpVZWLrrKFSOynBip9W6U/7LwViqZ8SykRWpcR8BqJNlmJCZp1LLMkIxSAw6s39WHqUCo/mDnWTdKhwRUMaNMzvLh5NFZsaBIbD+rJ34jgsxtcLQH3IQbKakDoVZDmnpk+irA/fEjCkXlv+AawX+MEJQJcaFEY8bWAJdMgYxyESn5PILNumUqJNVVA4EG7OXlx8Bf3T2QyRuh0X2P5ad9pCQTcjtqDI3UwTMuReIeaaKagb9u6B6VVi9Wg1YRUhkhH1g6NKFf3gD/2gAYz08YVd5AdltDfDS2d2QIrH6DcNcwUjLHc+aC8AMqLrW/4EwesBoligUTCgc05h52IH9gwu6+ERwBb+9pkc0IwLJNWHPXIyrUIdysW2POd52gopIZjtOSpgzOI2NToVAmwD0D9osmvvZSxcCXtr5wA08627Ah0yHZ74D3ysBNXokR8XQ8q2SQM3gQbZtAPm1AiZRyNIUawZGFl5qIRqbBdk4Sndjy1iviIymzIquXldirWRXDzzdOZr63q8J66OqOf+2yL8be+nMr3fry91A9NlRjvKT9tx88Pt6Djdaps0RZxQRZmCzpbHrMBV9b5/YM/dn7tSCT/cNTvpauFdasR5xkkCaS9n07Kj0mIKm+GbujP5OQ/vI8Ofyomhx0sOmxhU9W6wYp5uOO12qB3guik2TuI2QPXmwpXLGnjSMf3RRdO1Hz/QNneMt7Iqmg5QAAAABJRU5ErkJggg==', "pony"], ['Twilight', 'BIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA6lJREFUOE+VlF9Mk1cYxj+Kc3+yXWimFxuk2zTIn4bQFkppF0hDNmBpBtgKixhhQZAhbSkFBp1uZWg3ZLRMxFKE0qKtrMy2E2ztn2+1tLQgbuJiorvQ7c5pgplZNjfmePZ9nwtZMm52kufqvOeX5zznfQ9B/M9l/8CXPP2R/6ajy+u0amZeoI8D2PpfTLqMlZQpT9vE2fPOc9l73302q7rs6Sz5K6zM3ZuJzD2EVf1VytejC4hNXoWj2/vlF71+FgVKIsZVHrbnEzLoPkYOqqtPNm7j1l1J4R9Y4wgVkOR3Qcvrg+uNXmTnt9zfmdcUFRd1XqQhC+eWMXP8MiwKdyUDOqMLEG49qYtYlhA+vQi7zocGmQHFYi2UnM9wq/RzNEsOQyDWMBIWtjNurjivw2ucg+toyM+A6LWZU72vvsqwFjwVZwrmrEvoq7DBLDDiltQAobidgeRRUipMTA0t32AU3hNzD7zGSANBZMi2UFe5nyZohrREB9dxEnMTS+jgnUBYMghv2afrbhhHb3aAnFxkQMHhOALDid8p0EHiKU6VklvQil0UiJakqBsf77dCmTmASPEAhoqPIEN4CGmCJvAkauzKfw/5pRr4J+JUTtfo693zGSM7iBdzan10sE9gh5AragNXoEKtvB+93ZMY0TthGraB92oJVlYewDTgQJ96DKTtiStXb8jvNoafIV7i19+lndC2X+bXPyqXffj4kmV+PYexY1aQMwnkv1YGWUUljryvQ0/dqfV9+Vs9zVTYLILKZ5UGsXMbb2/llJaWCN8OnzNMrxda9JNYjt+ENL0RrQol0nekQVtlRHA8gsWpZQhEmrviws5yIpXfcG87t+52UpY8NZXN3lIjPRiOReZxfugCA7s4EsCN727ArHChQiKDYGchRrumELbFEbQmkFvQ+ofg9TYX8Xx2zfnkLDmHbgM2m00M1tortQf06FC2Y2HqGgMjvSR+WfkVplYPzCoX3EOziDmuwjMSRk6BajVP1PYT/fzb/j0nZ7tmN+n3mUlpUTmCo1EGFHJE8NvDR/g+egd0fj5LDN6xKHo6bOAL1D/niTTRDUd2rMW13VBj/zFu/5YZBaYBp69j0blMPfs8zhj9KCjspPNZ+6fjd28IGld4MgIn5x/HJr9ByJRYDz5oS2B6KIT9Nf3IEaj+pCBrXFELOTERZm0Ichy+lHy2czZlpv+y80JfmILFVwPDsTvmo26SJ1I9zBU1/UVBfqAk35ujpb+RpL8BJjxIUjyXvSgAAAAASUVORK5CYII=', "pony"], ['Rainbow', 'A8AAAAQCAYAAADJViUEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3tJREFUGBk9wV9MG3UAB/Dv7+531971aKGMlr+OwjoGBUZwRDrRBJwj0bHEmeiS6Xwyxn8x8UVNzHAPPvliFhMzsy0m8uDD5h/QZWoUNxYMBoZbZCBjZTBoKRwtLde7cv9+bg/6+ZDnzk6C44lw6f6whdOnETpzla+0803RMD3ZGSH95V62lzGQtMH9M7MhfpPUyIX5HE1uvNXDaCQgtykB70cR/4unrn3aqzYkZt7v18ZfezyTkfy0HlJ7FMWKEBJFpYMSVq7bngMlGvvc/OTiLzRYLp8K1waObaS16MDIRfupG9c6SuwCsSt2kJ+/B+3HMdC6MBofa0N1a2sVJTWj02mh4BFCCpV84jN4oHyX3KYEJAi2BWYR2CkPmMlBiOgwE0mYiymo1Qu0Mx4/8VLVnrtnF4VxfuCN9z5mDBA9FJt7mzDe3oXkjou69CqoxkA4gC9xQAggankMa7uTm3m32SLKD+Sz6XXGGCDJAv6j7di4MzqBo199Adk2EIqkQGQHDy3Ij2Q+bHr9g3UxyFHLdFyvJHAg+J/ipYgdjuMyzwELCfRsTWG/NQEwhqCVC0YLy/qKGJzmD77w9pHSoFyjbWWxtjAH5jIIHi8EKkCpq8JteCD2H0F2u4BwZhE+x8BEWbt6i6df8kr/s0+H/HKMc1yo02MYaG9APjGLxJ+T2NxYRV7fxu66GqjwYyrn2AG7YFGw4FygeYiXjva/KoipxoaKGPY1N+PJfRHEauvQaIj47vsLSN67i87ew6hOLGFeTS38FO45XhR8lQlffS0tmGViwbmCdKEb3tJSGLYLieMwMfQr1tZSqOzqheCVkDWIk7i/vvJ7WdVVxd96XWBU4kzb55qOiZvqJazmCxhLGzBFiqbnuzD71xyij8bxEN/XzXccf7PyxJ6+lkxuwknnftP4vorBd9O1mXBAnsbfaQW6VQadcWC7gmiIH0JlrBWuw+DYgFyiSGqu+O2NjZllPMBJRUevuH4Ipu1DyOefrS6RzmQN211iFGUtzSAcD8dh2Ll8cyStai8vra/8MQhgEADvjx/bX78c6rgT1ddl722/btSelEz69eaWoZqms1kwrGVt27xV1I1zgdWfRw6Ww8lmswQAo6QR2dnM6JC6HT3PEfvctjSsnx+3J1uob6qt6gAtSgEu4BbdV2KO80T3O0QQBFiWRQRBwL/txI3OlzkSKwAAAABJRU5ErkJggg==', "pony"], ['Rarity', 'BMAAAAQCAYAAAD0xERiAAAEEElEQVR4Xm2SW2xURRyHfzPnsmcvlO4ulN1uF2sLrIpdJNS0KUZFUq1t0AiKkpASbyQSjRKENEGrPuCTiUoTjSENKAnFYKokbZOmIBaoTRXB1AjbWmrabmVpt3SvZ899PFnTxAe+ZF7+D998mf/gbmwt30131B58YM+WTw7vbTnW/+oTHZda6490723uPP1KY0fna40dh/Y0fFz/4pq3XRFEsATB/2i71EauvDcplHN173p8of2gnI8KPHLxm/AEqwgIARUEeywyS1dVPZ+9kJ6OHdB/uzF2BmcYXRIdHxkhO/0vR/e9+c4p7+pIO+92+wlHaGE+QV1lYWpLCe90kdKVTvJo80rqDTic4nJfk7c62kM3rltfgQpSLGOM4ZfR0apQIPQTpSR04uhVqhUYSkoItLyMVFaEIjNENpTg8ZbVyGYK6PpyHIYGBhCmLiYHZ2NDzxZlpwYHaX3V2mMet3sPpZSbjc/B5y+Fw8GDgWEukcbURBLR2jB0TcPpz4cwO5aBBQJuWSnsbC09eeN50tnZSYy0s6p5V+MwIVghSQ4iFwqQHBIIIcVjGEaxXtd1XO2P4dr3N6EqCvJyFoqmgvqDlqZqp+jxD4/z8etKGxjxm6ZJxmIxnB8YwNDQEGITE5iemQHHcRAEATYIVPvB8ZQRQu05D45QGPNx2PYNNFxWV21y/h0AiCiKkGUZcwsZnDjTg7cOtuOr098hYxLYQJIklK8ps5hoaAyM2ZeAFwRQEJi5FEclT/BpxZBKFhdkQimFx+NBTbQG+1pfQFZ34tZtFd29PTAtC+N2dU9vH/t18sKCwPP4r46DQ3QySzcGKBGERzRFpYl4CkubPdd3Fj1nu5GduAxvdQNIPgNV1zBw/hy6+y+D510xUZQYzwlM5CXT5iID+5RailLNDINN/ZUCoQTLlnkQj8dx8uRJW2DA7V2F6H0RGJoGt8vFgqF7c2vD0T4wMANgd0yjP2Mqb+Ty2RkqMrhhmbh+JYnk7TSWl/pwuP0DrIvWoX73EWx/LIIV3lKIgoitT21Dy7aWPzU125/JpbOLukrA8U1ly8uGwxWVz1CXwOvE0qHIGq4NJ4qPHApVoKurC4defw6bKigCwfLiRkMBPzavL39w5/tPChk5vV+ZvzVHUknm4DhB13RKeZ5LlthlzDAQG00jkykU/5VTYKgJiTANE6LkhKIqTNW0nKqpvYauj89PzX5jcqxG0/WmeGK6bj6V+IHPy7nfV/hWbS5kM0gnC5iMLWBjXfhnAA0FRQGz0XVtzmJsZEHOH52a+uPirubtOmw2BfYmg9cSP2YsJ7uIbxlpfaitdk3l/Q/rlv7FnVzucmXdPS+1HtjyD8dzWCIvy76/Z6bY5MTs4tfjn7HBjwZxN/4Fq6rr1ZuF0oUAAAAASUVORK5CYII=', "pony"], ['Spike', 'A4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAsFJREFUOE+Fk1tM0nEUx/9QPtCD7z30nE9sbbVeXJJR6j8DkVsIhg6HTqSXnBHSMMEbEy+AgPwVQpcgNy+kKLc/lCgF09Wquaab67kHX1pulif+mHRdne3sd3Z2Pt/fOee3H4J8N/ow2lrj4H64OljRfEXBIZ/k/3lWquXIrQl2ROAVA98jOro2XKUtvV9Dpj/iFV/ppwvLVfzThEBZGRWh0S4hmFx+rId2ysmMSU6WAAUeMfDcdYe0gUrGdUOl7rZXBDRdRQtRp1PeIRlVctIzk+lHR6itJnwC1nkbgOXgZlhO3h6RY9rZKYT7W9NUKpUklUqRKjPDQADEjYTz3SLgzQjzMWua/5E5xLpQrqOX/jEzamTc4LqEX/KQRwRMBwfEDgnUOyXAdgk+1zr5e0w7J/vA15OfN28PW5SnZlRuVT3WeMia5oHW1AthawSS40mIjcWhW98HfF89Ifa6qb+hqAA6FA5xzIp/dVncYDc/hkQOiI/jBcctCegwdRJgsERWcszpZTrKU/3S7s+Ff4vn9UG4aWbGyofoaB60d05dDJuiR/8DcXMCpLY24GPsrlRWcxZxKmaqF0aCsDy8ArgtAVFL/Jc2C4LWBEwFNLCUbt9PZrpEiEk2VjbmMYIdm4TQ6Cq4RmYB02CwZAlB2ByBkHEVYhYcEmEreNZl4F+/C8F0+0vE2x1IL3qDsDgZhKg5Bt7ULAgHa+HVzlt4v7MHMQyHpM8LrlQzuNdaIfJCub+R0Z5DfNrAxsJAEHJbhXhue5nQJmS3t2D73S6suVK5XBKiYQMs4B3xSEbZ83xTc3ljq5eMmNts5/3d82/8jicQDc0Cbo8BjiVyQsez4rYkeNRzfqfadUYgEJBRFCVRKBQS0tTUSM7BxaauUelyenwunnZ+SnhXDkKG0EGgb+5g4p5dpa5TFEkk1bmfQSu8/TfTXs+Z8UbptgAAAABJRU5ErkJggg==']];

  Themes = {
    'AppChan': {
      'Author': 'Zixaphir',
      'Author Tripcode': '!..NoTrip..',
      'Background Image': '',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
      'Background Color': 'rgba(44,44,44,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Dialog Background': 'rgba(44,44,44,1)',
      'Dialog Border': 'rgba(44,44,44,1)',
      'Reply Background': 'rgba(51,51,51,1)',
      'Reply Border': 'rgba(51,51,51,1)',
      'Highlighted Reply Background': 'rgba(57,57,57,1)',
      'Highlighted Reply Border': 'rgba(57,57,57,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141)',
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
      'Shadow Color': 'rgba(44,44,44,0.4)',
      'Dark Theme': true,
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
      'Shadow Color': 'rgba(128,128,128,0.5)',
      'Dark Theme': false,
      'Custom CSS': '#delform{ box-shadow: 0px 10px 10px 2px rgba(128,128,128,0.5); border-radius: 3px;padding:10px;}#options.reply.dialog,#options .dialog{background-color:#FFF;color:#000;border:2px solid #CCC;border-radius:6px;}#options ul{border-bottom:1px solid #DBD8D2;border-radius: 0px;}#options ul:last-of-type{border:none;}#qp div.post{background-color:rgba(255,255,255,0.9);border:1px solid #D1A2FF;color:#000;}'
    },
    'Blackberry Jam': {
      'Author': 'seaweed',
      'Author Tripcode': '!POMF.9waa',
      'Background Image': '',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
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
      'Shadow Color': 'rgba(29,31,33,1)',
      'Dark Theme': true,
      'Custom CSS': 'div.reply {box-shadow: inset 0px 1px 2px 1px #111;}#qr {box-shadow: none;}#qr textarea, #qr input[name="name"], #qr input[name="email"], #qr input[name="sub"], #qr input[title="Verification"] {box-shadow: inset 0px 1px 2px 0px #111;}#qp div.post {background-color: rgba(29,29,33,1); border: 1px solid rgba(95,137,172,0.4);}input:checked .rice { background: url("http://i.imgur.com/CAewG.png"); }'
    },
    'Midnight Caek': {
      'Author': 'Zixaphir',
      'Author Tripcode': '!M.........',
      'Background Image': '',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
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
      'Shadow Color': 'rgba(16,16,16,0.4)',
      'Dark Theme': true,
      'Custom CSS': ''
    },
    'Minimalistic Mayhem': {
      'Author': 'Mayhem',
      'Author Tripcode': '!MayhemYDG.',
      'Background Image': 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAACdJREFUCNdNxzEBADAMwzCnOMwfWYDs2JNPCgCoH9m0zQa4jXob4AGJFwxchPNwQAAAAABJRU5ErkJggg==")',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
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
      'Shadow Color': 'rgba(16,16,16,0.4)',
      'Dark Theme': true,
      'Custom CSS': '.nameBlock>.useremail>postertrip{color: rgb(137,115,153);}a.backlink:hover{color: rgb(198,23,230);}.reply:target,.reply.highlight:target{background:rgb(37,38,42);}[alt="sticky"]+a{color: rgb(242,141,0);}[alt="closed"]+a{color: rgb(178,171,130);}input:checked .rice{border-color:rgb(21,21,21)}}input[type="submit"], input[type="button"], button {background: linear-gradient(#393939, #292929);border: 1px solid #191919;color: #AAA;text-shadow: 0 1px 1px #191919;}input[type="checkbox"], input[type="radio"] {background-color: #393939;border: 1px solid #191919;}input[type="checkbox"]:checked, input[type="radio"]:checked {background: linear-gradient(#595959, #393939);border: 1px solid #151515;} #delform { padding: 7px; }.subject:hover,div.post:hover .subject{color: #3F8DBF !important;}.postertrip:hover,div.post:hover .postertrip{color:#CC7212 !important;}.name:hover, div.post:hover .name {  color: #0AAEE7 !important;}.name,.subject,.postertrip {-webkit-transition:color .3s ease-in-out;-moz-transition:color .3s ease-in-out;}'
    },
    'ObsidianChan': {
      'Author': 'seaweed',
      'Author Tripcode': '!POMF.9waa',
      'Background Image': 'url("http://i.imgur.com/sbi8u.png")',
      'Background Attachment': 'fixed',
      'Background Position': '',
      'Background Repeat': '',
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
      'Post Numbers': 'rgb(253,254,255)',
      'Text': 'rgb(253,254,255)',
      'Quotelinks': 'rgb(212,212,212)',
      'Backlinks': 'rgb(0,255,255)',
      'Greentext': 'rgb(67,204,103)',
      'Board Title': 'rgb(253,254,255)',
      'Timestamps': 'rgb(253,254,255)',
      'Inputs': 'rgb(253,254,255)',
      'Warnings': 'rgb(0,255,255)',
      'Shadow Color': 'rgba(44,44,44,0.4)',
      'Dark Theme': true,
      'Custom CSS': '#qp div.post{background-color:rgba(0,0,0,0.8);border-radius:4px;border: 1px solid #333;}#qr {background-color: rgba(0,0,0,0.7);border: 1px solid #333;}'
    },
    'PaisleyChan': {
      'Author': 'Ubuntufriend',
      'Author Tripcode': '!TRip.C0d3',
      'Background Image': 'url(http://i.imgur.com/DRaZf.jpg)',
      'Background Attachment': 'fixed',
      'Background Position': '',
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
      'Shadow Color': 'rgba(20,20,20,0.9)',
      'Dark Theme': true,
      'Custom CSS': '#options{background-color: rgba(16,16,16,1) !important;}#delform blockquote {border-radius:3px;color:#bbb;background:#343838;padding:8px;box-shadow:0px 0px 20px rgba(25,25,25,0.6);border:1px solid #343838;border-bottom:2px solid #444848;border-radius:0px 6px 6px 6px;padding-top:15px;}.name {font-weight:800;}.nameBlock > .useremail > .name:hover,.nameBlock> .useremail> .postertrip:hover {color:#00dffc;}a.forwardlink {color:#608cae;font-weight:800;}div.reply,.reply.highlight{padding:0;}#qp div.post{border:1px solid rgba(128,172,206,0.5) !important;background-color:rgba(24,24,24,0.9) !important;}.name,.postertrip {text-shadow:0px 0px 6px rgba(20,20,20,0.9);font-weight:bold;background:#343838;border:1px solid #343838;border-radius:5px 5px 0px 0px;padding:4px 6px;padding-top:2px;}#delform,#delform blockquote {margin:0 10px 15px 0 !important;padding:0px;}a{-moz-transition:all 0.5s ease;-webkit-transition:all 0.5s ease;-o-transition:all 0.5s ease;}a.pointer{font-weight:bold;font-weight:normal;color:#777;padding-right:5px;}#delform .opContainer,#delform .replyContainer {opacity:0.45;-moz-transition:all 0.5s ease;-webkit-transition:all 0.5s ease;-o-transition:all 0.5s ease;}#delform .opContainer:hover,#delform .replyContainer:hover{opacity:1;}.reply,.reply.highlight{background:transparent;border:0px;padding:0px;padding-bottom:0px;border-radius:6px;}#delform blockquote{padding:5px;background:#343838;margin-top:0px;min-height:20px;padding-top:10px;clear:none;}#delform .file + blockquote{margin-top:-16px !important;padding-left:150px !important;}.file{margin-top: 2px;}a.backlink{border:1px solid #343838;border-radius:5px 5px 0px 0px;background:#343838;padding:2px 4px 2px;text-decoration:none;}a.forwardlink{color:#608CAE;text-shadow:0 0 6px rgba(96,140,174,0.8);}.subject{font-weight: bold;letter-spacing: 3px;background: transparent;}div.reply,div.reply.highlight {background-color: rgba(0,0,0,0) !important;border: none !important;}#qp div.post .name,#qp div.post a.backlink,#qp div.post blockquote {background:none !important;border:none !important;box-shadow:none !important;border-radius:0px; !important}'
    },
    'Photon': {
      'Author': 'seaweed',
      'Author Tripcode': '!POMF.9waa',
      'Background Image': '',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
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
      'Shadow Color': 'rgba(128,128,128,0.5)',
      'Dark Theme': false,
      'Custom CSS': '.fileText{color: rgb(102,102,102);}.boardTitle {color: #004a99 !important;text-shadow: 1px 1px 1px #222 !important;}.boardSubtitle, .boardBanner .boardSubtitle > a{text-shadow: none !important;}'
    },
    'RedUX': {
      'Author': 'Zixaphir',
      'Author Tripcode': '!VGsTHECURE',
      'Background Image': 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACEAQMAAABrihHkAAAABlBMVEX///8AAABVwtN+AAAAAnRSTlMASuCaZbYAAAA+SURBVHhe7c2xCQAgDAXRKywsHcFRdDNxchtBkhHk4Lp88ui7hhaztBCkyYZ7fFHzI/Jk/GRpaWlpaWlpaR3scHNQSY3kigAAAABJRU5ErkJggg=="), radial-gradient(rgb(190,0,0), rgb(15,0,0))',
      'Background Attachment': 'scroll, fixed',
      'Background Position': 'center, center',
      'Background Repeat': 'repeat, no-repeat',
      'Background Color': 'rgba(238,242,255,1)',
      'Thread Wrapper Background': 'linear-gradient(rgb(220,210,210), rgb(240,240,240) 400px, rgb(240,240,240))',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Dialog Background': 'rgba(238,242,255,1)',
      'Dialog Border': 'rgba(238,242,255,1)',
      'Reply Background': 'rgba(240,240,240,1)',
      'Reply Border': 'rgba(204,204,204,1)',
      'Highlighted Reply Background': 'rgba(219,219,219,1)',
      'Highlighted Reply Border': 'rgba(219,219,219,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141,1)',
      'Input Background': 'rgba(255,255,255,1)',
      'Input Border': 'rgba(255,255,255,1)',
      'Hovered Input Background': 'rgba(214,186,208,1)',
      'Hovered Input Border': 'rgba(214,186,208,1)',
      'Focused Input Background': 'rgba(255,255,255,1)',
      'Focused Input Border': 'rgba(153,136,238,1)',
      'Checkbox Background': 'rgba(238,242,255,1)',
      'Checkbox Checked Background': 'rgba(188,192,212,1)',
      'Checkbox Border': 'rgba(153,51,51,1)',
      'Buttons Background': 'rgba(255,255,255,1)',
      'Buttons Border': 'rgba(255,255,255,1)',
      'Navigation Background': 'rgba(0,0,0,0.7)',
      'Navigation Border': 'rgba(0,0,0,0.7)',
      'Quotelinks': 'rgb(153,51,51)',
      'Backlinks': 'rgb(153,51,51)',
      'Links': 'rgb(87,87,123)',
      'Hovered Links': 'rgb(221,0,0)',
      'Navigation Links': 'rgb(238,187,204)',
      'Hovered Navigation Links': 'rgb(255,119,119)',
      'Names': 'rgb(119,51,51)',
      'Tripcodes': 'rgb(119,51,51)',
      'Emails': 'rgb(87,87,123)',
      'Subjects': 'rgb(15,12,93)',
      'Text': 'rgb(0,0,0)',
      'Inputs': 'rgb(0,0,0)',
      'Post Numbers': 'rgb(0,0,0)',
      'Greentext': 'rgb(120,153,34)',
      'Sage': 'rgb(87,87,123)',
      'Board Title': 'rgb(238,187,204)',
      'Timestamps': 'rgb(0,0,0)',
      'Warnings': 'rgb(87,87,123)',
      'Shadow Color': 'rgba(60,60,60,0.6)',
      'Dark Theme': true,
      'Custom CSS': '.replyContainer > .reply {background-color: transparent; border: 0; border-bottom: 1px #ccc solid;} #qp div.post { background-color: rgba(0,0,0,0.7); border-color: rgba(0,0,0,0.7); } #qp div.post, #qp .postNum a { color: #fcd; } #qp .nameBlock > .useremail > .name, #qp .nameBlock > .useremail > .postertrip, #qp .name, #qp .postertrip, #qp .trip { color: #ffaac0 !important; } #qp a { color: #aaaac8; } .boardBanner a, #qp a.backlink, #qp span.quote > a.quotelink { color: rgb(255,255,255); } #updater:not(:hover), #updater:not(:hover) #count:not(.new)::after, #stats { color: rgb(123,123,123); } .boardBanner {color: rgb(238,187,204)} .boardTitle { text-shadow: 1px 1px 1px #222; } #delform { padding: 1px 15px 2px 15px; box-shadow: 0 20px 15px 20px rgba(0,0,0,0.7); border-radius: 4px; }'
    },
    'Solarized': {
      'Author': 'ubuntufriend',
      'Author Tripcode': '!TRip.C0d',
      'Background Image': '',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
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
      'Shadow Color': 'rgba(0,0,0,0.4)',
      'Dark Theme': true,
      'Custom CSS': '#qp div.post{background-color:rgba(7,54,66,0.9);border:1px solid rgba(79,95,143,0.9);}'
    },
    'Yotsuba': {
      'Author': 'moot',
      'Author Tripcode': '!Ep8pui8Vw2',
      'Background Image': 'linear-gradient(rgb(254,214,175), rgb(255,255,238) 200px, rgb(255,255,238))',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
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
      'Shadow Color': 'rgba(119,46,40,1)',
      'Dark Theme': false,
      'Custom CSS': '#qp div.post{background-color:rgba(240,192,176,1);box-shadow:5px 5px 5px rgba(128,128,128,0.5);}'
    },
    'Yotsuba B': {
      'Author': 'moot',
      'Author Tripcode': '!Ep8pui8Vw2',
      'Background Image': 'linear-gradient(rgb(209,213,238), rgb(238,242,255) 200px, rgb(255,255,238))',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
      'Background Color': 'rgba(238,242,255,1)',
      'Dialog Background': 'rgba(214,218,240,1)',
      'Dialog Border': 'rgba(183,197,217,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
      'Thread Wrapper Border': 'rgba(0,0,0,0)',
      'Reply Background': 'rgba(214,218,240,1)',
      'Reply Border': 'rgba(183,197,217,1)',
      'Highlighted Reply Background': 'rgba(214,186,208,1)',
      'Highlighted Reply Border': 'rgba(183,197,217,1)',
      'Backlinked Reply Outline': 'rgba(98,124,141)',
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
      'Shadow Color': 'rgba(128,128,128,0.5)',
      'Dark Theme': false,
      'Custom CSS': '#qp div.post{background-color:rgba(214,186,208,1);box-shadow:5px 5px 5px rgba(128,128,128,0.5);}'
    },
    'Zenburned': {
      'Author': 'lazy',
      'Author Tripcode': '!HONKYn7h1.',
      'Background Image': '',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
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
      'Shadow Color': 'rgba(63,63,63,0.4)',
      'Dark Theme': true,
      'Custom CSS': ''
    },
    "ピンク": {
      "Author": "DrooidKun",
      "Author Tripcode": "!/Apk/MRkGM",
      "Background Image": "",
      "Background Attachment": "fixed",
      "Background Position": "bottom left",
      "Background Repeat": "no-repeat",
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
      "Shadow Color": "rgba(255,255,255,.9)",
      "Dark Theme": false,
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}.boardTitle {color: #cc5ec1 !important;text-shadow: 1px 1px 1px #772E28 !important;}.boardSubtitle, .boardBanner .boardSubtitle > a{text-shadow: none !important;}"
    },
    "Yotsuba Purple": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Image": "linear-gradient(rgba(238,221,255,1.0), rgba(248,243,254,1) 200px, rgba(248,243,254,1))",
      "Background Attachment": "",
      "Background Position": "",
      "Background Repeat": "",
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
      "Shadow Color": "rgba(254,237,255,.9)",
      "Dark Theme": false,
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,253,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n\n\n\n\n#boardNavDesktop,.pagelist,#imgControls{background:rgba(229, 219, 240,.9)!important;}#delform,.reply,.hidden_thread,.stub{border-radius:0!important}.reply,.hidden_thread,.stub\"+($SS.conf[\"Recolor Even Posts\"] ? \",.replyContainer:nth-of-type(even)>div\" : \"\")+\"{border-left:0!important;border-top:0!important;}.boardTitle {color: #591177 !important;text-shadow: 1px 1px 1px #222 !important;}.boardSubtitle, .boardBanner .boardSubtitle > a{text-shadow: none !important;}.postNum a { color: #000000 !important; }"
    },
    "Vimyanized Dark": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Image": "",
      "Background Attachment": "fixed",
      "Background Position": "bottom left",
      "Background Repeat": "no-repeat",
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
      "Shadow Color": "rgba(29,33,36,.9)",
      "Dark Theme": true,
      "Custom CSS": "#delform {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(45,49,52,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
    },
    "Tomorrow Night": {
      "Author": "Chris Kempson",
      "Author Tripcode": "!.pC/AHOKAg",
      "Background Image": "url(\"\")",
      "Background Attachment": "fixed",
      "Background Position": "bottom left",
      "Background Repeat": "no-repeat",
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
      "Shadow Color": "rgba(56,58,62,.9)",
      "Dark Theme": true,
      "Custom CSS": "#delform {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(72,74,78,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
    },
    "Solarized Light": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Image": "",
      "Background Attachment": "fixed",
      "Background Position": "bottom left",
      "Background Repeat": "no-repeat",
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
      "Shadow Color": "rgba(255,255,243,.9)",
      "Dark Theme": false,
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}.boardTitle {color: #b58900 !important;text-shadow: 1px 1px 1px #999 !important;}.boardSubtitle, .boardBanner .boardSubtitle > a{text-shadow: none !important;}.postNum a {color: #657b83 !important;}"
    },
    "Muted": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Image": "",
      "Background Attachment": "fixed",
      "Background Position": "bottom left",
      "Background Repeat": "no-repeat",
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
      "Shadow Color": "rgba(255,255,249,.9)",
      "Dark Theme": false,
      "Custom CSS": "#delform {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}.boardTitle{color:#bc312a!important;text-shadow:1px 1px 1px #772e28!important;}.boardSubtitle,.boardBanner .boardSubtitle>a{text-shadow:none!important;}.postNum a{color:#111111!important;}div.reply a.quotelink{color:#bc312a!important;}"
    },
    "Monokai": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Image": "",
      "Background Attachment": "fixed",
      "Background Position": "bottom left",
      "Background Repeat": "no-repeat",
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
      "Shadow Color": "rgba(55,56,50,.9)",
      "Dark Theme": true,
      "Custom CSS": ".rice {\n  box-shadow:rgba(71,72,66,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
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
      "Shadow Color": "rgba(51,52,53,.9)",
      "Dark Theme": true,
      "Custom CSS": "#delform {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(67,68,69,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}.reply{border:0!important}"
    },
    "Blackboard": {
      "Author": "seaweed",
      "Author Tripcode": "!POMF.9waa",
      "Background Image": "",
      "Background Attachment": "fixed",
      "Background Position": "bottom left",
      "Background Repeat": "no-repeat",
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
      "Shadow Color": "rgba(28,32,49,.9)",
      "Dark Theme": true,
      "Custom CSS": ".rice {\n  box-shadow:rgba(44,48,65,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\nthread>.replyContainer>.reply>div.postInfo { box-shadow: 0px 2px 3px #0A0A0A !important; } "
    },
    "4chan Rewired": {
      "Author": "kweeb",
      "Author Tripcode": "!K.WeEabo0o",
      "Background Image": "url(\"http://oi39.tinypic.com/2h51rb4.jpg\")",
      "Background Attachment": "fixed",
      "Background Position": "bottom right",
      "Background Repeat": "no-repeat",
      "Background Color": "rgb(244,244,244)",
      "Dialog Background": "rgba(239,239,239,.98)",
      "Dialog Border": "rgb(212,212,212)",
      "Thread Wrapper Background": "rgba(239,239,239,.5)",
      "Thread Wrapper Border": "rgba(212,212,212,.9)",
      "Reply Background": "rgba(239,239,239,.9)",
      "Reply Border": "rgb(212,212,212)",
      "Highlighted Reply Background": "rgba(235,235,235,.9)",
      "Highlighted Reply Border": "rgb(191,127,63)",
      "Backlinked Reply Outline": "rgb(191,127,63)",
      "Checkbox Background": "rgba(228,228,228,.9)",
      "Checkbox Border": "rgb(204,204,204)",
      "Checkbox Checked Background": "rgb(228,228,228)",
      "Input Background": "rgba(228,228,228,.9)",
      "Input Border": "rgb(204,204,204)",
      "Hovered Input Background": "rgba(212,212,212,.9)",
      "Hovered Input Border": "rgb(204,204,204)",
      "Focused Input Background": "rgba(212,212,212,.9)",
      "Focused Input Border": "rgb(204,204,204)",
      "Buttons Background": "rgba(228,228,228,.9)",
      "Buttons Border": "rgb(204,204,204)",
      "Navigation Background": "rgba(244,244,244,0.8)",
      "Navigation Border": "rgb(239,239,239)",
      "Quotelinks": "rgb(191,127,63)",
      "Links": "rgb(191,127,63)",
      "Hovered Links": "rgb(211,54,130)",
      "Navigation Links": "rgb(76,76,76)",
      "Hovered Navigation Links": "rgb(211,54,130)",
      "Subjects": "rgb(76,76,76)",
      "Names": "rgb(76,76,76)",
      "Sage": "rgb(204,102,102)",
      "Tripcodes": "rgb(191,127,63)",
      "Emails": "rgb(191,127,63)",
      "Post Numbers": "rgb(191,127,63)",
      "Text": "rgb(76,76,76)",
      "Backlinks": "rgb(191,127,63)",
      "Greentext": "rgb(107,122,30)",
      "Board Title": "rgb(76,76,76)",
      "Timestamps": "rgb(76,76,76)",
      "Inputs": "rgb(76,76,76)",
      "Warnings": "rgb(204,102,102)",
      "Shadow Color": "rgba(255,255,255,.9)",
      "Dark Theme": false,
      "Custom CSS": "#delform {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
    },
    "4chan Dark Upgrade": {
      "Author": "Ahoka",
      "Author Tripcode": "!.pC/AHOKAg",
      "Background Image": "url(\"http://img85.imageshack.us/img85/4162/4chbg.gif\")",
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
      "Shadow Color": "rgba(67,67,67,.9)",
      "Dark Theme": true,
      "Custom CSS": "#delform {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(83,83,83,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}#delform{background:rgba(22,22,22,.8)!important;border:0!important;padding:1px!important;box-shadow:rgba(0,0,0,.8) 0 0 10px;}.postContainer>.reply{background-image:url(http://img714.imageshack.us/img714/3969/4ch2.gif)!important;border-bottom:#1f1f1f!important;border-radius:5px!important}.thread:not(.stub){background:0!important}a:not([href='javascript:;']){text-shadow:#0f0f0f 0 1px;}"
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
      category: 'Anime',
      image: 'https://i.minus.com/ibnnAPmolhTfE7.png'
    },
    'Anime_Girl_in_Bondage': {
      category: 'NSFW',
      image: 'https://i.minus.com/ibbfIrZEoNLmiU.png',
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
      category: 'NSFW',
      image: 'https://i.minus.com/iJq4VXY1Gw8ZE.png',
      center: true
    },
    'Asuka_Langley_Soryu_6': {
      category: 'Anime',
      image: 'https://i.minus.com/ibzbnBcaEtoqck.png'
    },
    'Ayanami_Rei': {
      category: 'Anime',
      image: 'https://i.minus.com/ib0ft5OmqRZx2r.png',
      center: true
    },
    'Ayase_Yue': {
      category: 'NSFW',
      image: 'https://i.minus.com/ign5fGOZWTx5o.png'
    },
    'Ayase': {
      category: 'Anime',
      image: 'https://i.minus.com/ibmArq5Wb4Po4v.png',
      center: true
    },
    'Ayase_2': {
      category: 'Anime',
      image: 'https://i.minus.com/ibjUbDLSU5pwhK.png',
      center: true
    },
    'BLACK_ROCK_SHOOTER': {
      category: 'Anime',
      image: 'https://i.minus.com/ibMe9MrTMdvAT.png',
      center: true
    },
    'Blue_Rose': {
      category: 'Anime',
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
      category: 'NSFW',
      image: 'https://i.minus.com/iVT3TjJ7lBRpl.png',
      center: true
    },
    'Chie': {
      category: 'Anime',
      image: 'https://i.minus.com/ib0HI16h9FSjSp.png',
      center: true
    },
    'Cirno': {
      category: 'NSFW',
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
      image: 'https://i.minus.com/iPvv86W9r3Rxm.png',
      position: 'bottom'
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
      category: 'NSFW',
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
      center: true,
      position: 'bottom'
    },
    'Gasai_Yuno': {
      category: 'Anime',
      image: 'https://i.minus.com/iEQsK6K85jX2n.png'
    },
    'Gasai_Yuno_2': {
      category: 'NSFW',
      image: 'https://i.minus.com/iblDClpOzDBgCC.png',
      center: true
    },
    'George_Costanza': {
      category: 'George',
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
      category: 'NSFW',
      image: 'https://i.minus.com/iHuUwYVywpp3Z.png'
    },
    'Hatsune_Miku_2': {
      category: 'NSFW',
      image: 'https://i.minus.com/iclhgYeHDD77I.png',
      center: true
    },
    'Hatsune_Miku_3': {
      category: 'Anime',
      image: 'https://i.minus.com/iLJ4uDTcg1T8r.png',
      center: true,
      position: 'bottom'
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
      category: 'Anime',
      image: 'https://i.minus.com/iQzx9fPFgPUNl.png',
      center: true
    },
    'Hatsune_Miku_7': {
      category: 'NSFW',
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
      category: 'NSFW',
      image: 'https://i.minus.com/iby8LyjXffukaI.png',
      center: true
    },
    'Inori': {
      category: 'Anime',
      image: 'https://i.minus.com/ibpHKNPxcFqRxs.png'
    },
    'Inori_2': {
      category: 'Anime',
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
      category: 'Anime',
      image: 'https://i.minus.com/iVPKJeDXKPKeV.png',
      center: true
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
      category: 'NSFW',
      image: 'https://i.minus.com/ibklztjz3Ua747.png',
      center: true
    },
    'Kirisame_Marisa': {
      category: 'Anime',
      image: 'https://i.minus.com/ibikDZH5CZ0V30.png'
    },
    'Kirino_Kosaka_and_Ruri_Goko': {
      category: 'NSFW',
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
      category: 'Anime',
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
      image: 'https://i.minus.com/is7h27Q6lsmyx.png',
      position: 'bottom'
    },
    'Luka': {
      category: 'Anime',
      image: 'https://i.minus.com/inds5h2BOmVBy.png',
      position: 'bottom'
    },
    'Madotsuki': {
      category: 'Anime',
      image: 'https://i.minus.com/ik6QYfTfgx9Za.png',
      position: 'bottom'
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
      category: 'Anime',
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
    'Nakano_Azusa': {
      category: 'Anime',
      image: 'https://i.minus.com/iiptfoMlr4v1k.png'
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
      category: 'NSFW',
      image: 'https://i.minus.com/ipRzX1YsTyhgZ.png',
      center: true
    },
    'Railgun': {
      category: 'NSFW',
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
      category: 'NSFW',
      image: 'https://i.minus.com/i62cv3csQaqgk.png',
      position: 'bottom',
      center: true
    },
    'Sakurazaki_Setsuna': {
      category: 'NSFW',
      image: 'https://i.minus.com/iHS6559NMU1tS.png'
    },
    'Samus_Aran': {
      category: 'Anime',
      image: 'https://i.minus.com/iWG1GFJ89A05p.png',
      center: true
    },
    'Seraphim': {
      category: 'Anime',
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
      category: 'Anime',
      image: 'https://i.minus.com/iQL2bwpDfOgk.png',
      center: true
    },
    'Teletha_Tessa_Testarossa': {
      category: 'Anime',
      image: 'https://i.minus.com/iQKrg7Pq7Y6Ed.png'
    },
    'Tifa': {
      category: 'NSFW',
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
      category: 'Anime',
      image: 'https://i.minus.com/iiycujRmhn6QK.png',
      position: 'bottom'
    },
    'Wanwan': {
      category: 'NSFW',
      image: 'https://i.minus.com/iTdBWYMCXULLT.png',
      position: 'bottom',
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
      category: 'Anime',
      image: 'https://i.minus.com/i0mtOEsBC9GlY.png',
      position: 'bottom'
    },
    'Yoko_Littner_2': {
      category: 'Anime',
      image: 'https://i.minus.com/i7aUDY4h9uB1T.png',
      position: 'bottom',
      center: true
    },
    'Yoko_Littner_3': {
      category: 'Anime',
      image: 'https://i.minus.com/iYVd5DhCmB7VJ.png',
      position: 'bottom',
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

  Navigation = {
    delimiter: "/",
    links: [["a", "Anime & Manga", "//boards.4chan.org/a/"], ["b", "Random", "//boards.4chan.org/b/"], ["c", "Cute/Anime", "//boards.4chan.org/c/"], ["d", "Hentai/Alternative", "//boards.4chan.org/d/"], ["e", "Ecchi", "//boards.4chan.org/e/"], ["f", "Flash", "//boards.4chan.org/f/"], ["g", "Technology", "//boards.4chan.org/g/"], ["gif", "Animated Gifs", "//boards.4chan.org/gif/"], ["h", "Hentai", "//boards.4chan.org/h/"], ["hr", "High Resolution", "//boards.4chan.org/hr/"], ["k", "Weapons", "//boards.4chan.org/k/"], ["l", "Lolicon", "http://7chan.org/cake/"], ["m", "Mecha", "//boards.4chan.org/m/"], ["o", "Auto", "//boards.4chan.org/o/"], ["p", "Pictures", "//boards.4chan.org/p/"], ["r", "Requests", "//boards.4chan.org/r/"], ["s", "Sexy Beautiful Women", "//boards.4chan.org/s/"], ["t", "Torrents", "//boards.4chan.org/t/"], ["u", "Yuri", "//boards.4chan.org/u/"], ["v", "Video Games", "//boards.4chan.org/v/"], ["vg", "Video Game Generals", "//boards.4chan.org/vg/"], ["w", "Anime/Wallpapers", "//boards.4chan.org/w/"], ["wg", "Wallpapers/General", "//boards.4chan.org/wg/"], ["i", "Oekaki", "//boards.4chan.org/i/"], ["ic", "Artwork/Critique", "//boards.4chan.org/ic/"], ["r9k", "Robot 9K", "//boards.4chan.org/r9k/"], ["cm", "Cute/Male", "//boards.4chan.org/cm/"], ["hm", "Handsome Men", "//boards.4chan.org/hm/"], ["y", "Yaoi", "//boards.4chan.org/y/"], ["3", "3DCG", "//boards.4chan.org/3/"], ["adv", "Advice", "//boards.4chan.org/adv/"], ["an", "Animals", "//boards.4chan.org/an/"], ["cgl", "Cosplay & EGL", "//boards.4chan.org/cgl/"], ["ck", "Food & Cooking", "//boards.4chan.org/ck/"], ["co", "Comics & Cartoons", "//boards.4chan.org/co/"], ["diy", "Do It Yourself", "//boards.4chan.org/diy/"], ["fa", "Fashion", "//boards.4chan.org/fa/"], ["fit", "Health & Fitness", "//boards.4chan.org/fit/"], ["hc", "Hardcore", "//boards.4chan.org/hc/"], ["int", "International", "//boards.4chan.org/int/"], ["jp", "Otaku Culture", "//boards.4chan.org/jp/"], ["lit", "Literature", "//boards.4chan.org/lit/"], ["mlp", "My Little Pony", "//boards.4chan.org/mlp/"], ["mu", "Music", "//boards.4chan.org/mu/"], ["n", "Transportation", "//boards.4chan.org/n/"], ["po", "Papercraft & Origami", "//boards.4chan.org/po/"], ["pol", "Politically Incorrect", "//boards.4chan.org/pol/"], ["sci", "Science & Math", "//boards.4chan.org/sci/"], ["soc", "Social", "//boards.4chan.org/soc/"], ["sp", "Sports", "//boards.4chan.org/sp/"], ["tg", "Traditional Games", "//boards.4chan.org/tg/"], ["toy", "Toys", "//boards.4chan.org/toys/"], ["trv", "Travel", "//boards.4chan.org/trv/"], ["tv", "Television & Film", "//boards.4chan.org/tv/"], ["vp", "Pok&eacute;mon", "//boards.4chan.org/vp/"], ["wsg", "Worksafe GIF", "//boards.4chan.org/wsg/"], ["x", "Paranormal", "//boards.4chan.org/x/"], ["rs", "Rapidshares", "http://rs.4chan.org/"], ["status", "4chan Status", "http://status.4chan.org/"], ["q", "4chan Discussion", "//boards.4chan.org/q/"], ["@", "4chan Twitter", "http://www.twitter.com/4chan"]]
  };

  UI = {
    dialog: function(id, position, html) {
      var el, _ref;
      el = d.createElement('div');
      el.className = 'reply dialog';
      el.innerHTML = html;
      el.id = id;
      el.style.cssText = localStorage.getItem("" + Main.namespace + id + ".position") || position;
      if ((_ref = el.querySelector('.move')) != null) {
        _ref.addEventListener('mousedown', UI.dragstart, false);
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
      localStorage.setItem("" + Main.namespace + UI.el.id + ".position", UI.el.style.cssText);
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

  console = console != null ? console : console = window.console || unsafeWindow.console;

  Array.prototype.contains = function(object) {
    return this.indexOf(object) > -1;
  };

  Array.prototype.remove = function(object) {
    var index;
    if ((index = this.indexOf(object)) > -1) {
      return this.splice(index, 1);
    } else {
      return false;
    }
  };

  /*
  loosely follows the jquery api:
  http://api.jquery.com/
  not chainable
  */


  $ = function(selector, root) {
    var result;
    if (root == null) {
      root = d.body;
    }
    if ((root != null) && (result = root.querySelector(selector))) {
      return result;
    } else {
      return null;
    }
  };

  $.extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
  };

  $.extend($, {
    NBSP: '\u00A0',
    SECOND: 1000,
    MINUTE: 1000 * 60,
    HOUR: 1000 * 60 * 60,
    DAY: 1000 * 60 * 60 * 24,
    log: function(e) {
      return console.log(e);
    },
    engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase(),
    ready: function(fc) {
      var cb;
      if (/interactive|complete/.test(d.readyState)) {
        return setTimeout(fc);
      }
      cb = function() {
        $.off(d, 'DOMContentLoaded', cb);
        return fc();
      };
      return $.on(d, 'DOMContentLoaded', cb);
    },
    sync: function(key, cb) {
      return $.on(window, 'storage', function(e) {
        if (e.key === ("" + Main.namespace + key)) {
          return cb(JSON.parse(e.newValue));
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
      if (opts == null) {
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
            var _i, _len, _ref, _results;
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
        textContent: css,
        id: identifier
      });
      $.add(d.head, style);
      return style;
    },
    x: function(path, root) {
      if (root == null) {
        root = d.body;
      }
      return d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
    },
    X: function(path, root) {
      if (root == null) {
        root = d.body;
      }
      return d.evaluate(path, root, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    },
    addClass: function(el, className) {
      return el.classList.add(className);
    },
    rmClass: function(el, className) {
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
      if (value = GM_getValue(name)) {
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
    if (root == null) {
      root = d.body;
    }
    if ((root != null) && (result = Array.prototype.slice.call(root.querySelectorAll(selector)))) {
      return result;
    } else {
      return null;
    }
  };

  Options = {
    init: function() {
      var a, settings, _i, _len, _ref, _results;
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
          href: 'javascript:;',
          className: 'settingsWindowLink',
          textContent: 'AppChan X Settings'
        });
        $.on(a, 'click', function() {
          try {
            return Options.dialog();
          } catch (err) {
            return $.log(err.stack);
          }
        });
        _results.push($.prepend($.id(settings), [$.tn('['), a, $.tn('] ')]));
      }
      return _results;
    },
    dialog: function(tab) {
      var arr, back, category, checked, description, dialog, div, favicon, fileInfo, filter, hiddenNum, hiddenThreads, input, key, li, liHTML, obj, optionname, optionvalue, overlay, sauce, selectoption, styleSetting, time, tr, ul, updateIncrease, _i, _len, _ref, _ref1, _ref2, _ref3;
      if (editMode) {
        if (confirm("Opening the options dialog will close and discard any theme changes made with the theme editor.")) {
          try {
            ThemeTools.close();
          } catch (_error) {}
          try {
            MascotTools.close();
          } catch (_error) {}
          editMode = false;
        } else {
          return;
        }
      }
      dialog = $.el('div', {
        id: 'options',
        className: 'reply dialog',
        innerHTML: '<div id=optionsbar>\
  <div id=credits>\
    <label for=apply>Apply</label>\
    | <a target=_blank href=http://zixaphir.github.com/appchan-x/>AppChan X</a>\
    | <a target=_blank href=https://raw.github.com/zixaphir/appchan-x/master/changelog>' + Main.version + '</a>\
    | <a target=_blank href=http://zixaphir.github.com/appchan-x/#bug-report>Issues</a>\
  </div>\
  <div>\
    <label for=main_tab>Main</label>\
    | <label for=filter_tab>Filter</label>\
    | <label for=sauces_tab>Sauce</label>\
    | <label for=rice_tab>Rice</label>\
    | <label for=keybinds_tab>Keybinds</label>\
    | <label for=style_tab>Style</label>\
    | <label for=theme_tab>Themes</label>\
    | <label for=mascot_tab>Mascots</label>\
  </div>\
</div>\
<hr>\
<div id=content>\
  <input type=radio name=tab hidden id=main_tab checked>\
  <div></div>\
  <input type=radio name=tab hidden id=sauces_tab>\
  <div>\
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
  <div>\
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
      <li>Link (with original file name): %l (lowercase L, truncated), %L (untruncated)</li>\
      <li>Original file name: %n (Truncated), %N (Untruncated)</li>\
      <li>Spoiler indicator: %p</li>\
      <li>Size: %B (Bytes), %K (KB), %M (MB), %s (4chan default)</li>\
      <li>Resolution: %r (Displays PDF on /po/, for PDFs)</li>\
    </ul>\
    <ul>\
      Amounts for Optional Increase<br>\
      <input name=updateIncrease class=field>\
    </ul>\
    <div class=warning><code>Custom Navigation</code> is disabled.</div>\
    <div id=customNavigation>\
    </div>\
    <ul>\
      <div class=warning><code>Unread Favicon</code> is disabled.</div>\
      Unread favicons<br>\
      <select name=favicon>\
        <option value=ferongr>ferongr</option>\
        <option value=xat->xat-</option>\
        <option value=Mayhem>Mayhem</option>\
        <option value=Original>Original</option>\
      </select>\
     <span></span>\
    </ul>\
    <span></span>\
  </div>\
  <input type=radio name=tab hidden id=keybinds_tab>\
  <div>\
    <div class=warning><code>Keybinds</code> are disabled.</div>\
    <div>Allowed keys: Ctrl, Alt, Meta, a-z, A-Z, 0-9, Up, Down, Right, Left.</div>\
    <table><tbody>\
      <tr><th>Actions</th><th>Keybinds</th></tr>\
    </tbody></table>\
  </div>\
  <input type=radio name=tab hidden id=style_tab>\
  <div></div>\
  <input type=radio name=tab hidden id=theme_tab>\
  <div></div>\
  <input type=radio name=tab hidden id=mascot_tab>\
  <div></div>\
  <input type=radio name=tab hidden onClick="javascript:location.reload(true)" id=apply>\
  <div>Reloading page with new settings.</div>\
</div>'
      });
      _ref = Config.main;
      for (key in _ref) {
        obj = _ref[key];
        ul = $.el('ul', {
          textContent: key
        });
        for (key in obj) {
          arr = obj[key];
          checked = $.get(key, Conf[key]) ? 'checked' : '';
          description = arr[1];
          li = $.el('li', {
            innerHTML: "<label><input type=checkbox name=\"" + key + "\" " + checked + "><span class=\"optionlabel\">" + key + "</span></label><span class=description>: " + description + "</span>"
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
      filter = $('select[name=filter]', dialog);
      $.on(filter, 'change', Options.filter);
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
      favicon = $('select[name=favicon]', dialog);
      favicon.value = $.get('favicon', Conf['favicon']);
      $.on(favicon, 'change', $.cb.value);
      $.on(favicon, 'change', Options.favicon);
      (updateIncrease = $('[name=updateIncrease]', dialog)).value = $.get('updateIncrease', Conf['updateIncrease']);
      $.on(updateIncrease, 'input', $.cb.value);
      this.customNavigation.dialog(dialog);
      _ref1 = Config.hotkeys;
      for (key in _ref1) {
        arr = _ref1[key];
        tr = $.el('tr', {
          innerHTML: "<td>" + arr[1] + "</td><td><input name=" + key + " class=field></td>"
        });
        input = $('input', tr);
        input.value = $.get(key, Conf[key]);
        $.on(input, 'keydown', Options.keybind);
        $.add($('#keybinds_tab + div tbody', dialog), tr);
      }
      div = $.el('div', {
        className: "suboptions",
        innerHTML: "<div class=warning><code>Style</code> is currently disabled. Please enable it in the Main tab to use styling options.</div>"
      });
      _ref2 = Config.style;
      for (category in _ref2) {
        obj = _ref2[category];
        ul = $.el('ul', {
          textContent: category
        });
        for (optionname in obj) {
          arr = obj[optionname];
          description = arr[1];
          if (arr[2] === 'text') {
            li = $.el('li', {
              className: "styleoption",
              innerHTML: "<div class=\"option\"><span class=\"optionlabel\">" + optionname + "</span>: <span class=\"description\">" + description + "</span></div><div class =\"option\"><input name=\"" + optionname + "\" style=\"width: 100%\"></div>"
            });
            styleSetting = $("input[name='" + optionname + "']", li);
            styleSetting.value = $.get(optionname, Conf[optionname]);
            $.on(styleSetting, 'change', $.cb.value);
            $.on(styleSetting, 'change', Options.style);
          } else if (arr[2]) {
            liHTML = "          <div class=\"option\"><span class=\"optionlabel\">" + optionname + "</span>: <span class=\"description\">" + description + "</span></div><div class =\"option\"><select name=\"" + optionname + "\"></div>";
            _ref3 = arr[2];
            for (optionvalue = _i = 0, _len = _ref3.length; _i < _len; optionvalue = ++_i) {
              selectoption = _ref3[optionvalue];
              liHTML = liHTML + ("<option value=\"" + selectoption + "\">" + selectoption + "</option>");
            }
            liHTML = liHTML + "</select>";
            li = $.el('li', {
              innerHTML: liHTML,
              className: "styleoption"
            });
            styleSetting = $("select[name='" + optionname + "']", li);
            styleSetting.value = $.get(optionname, Conf[optionname]);
            $.on(styleSetting, 'change', $.cb.value);
            $.on(styleSetting, 'change', Options.style);
          } else {
            checked = $.get(optionname, Conf[optionname]) ? 'checked' : '';
            li = $.el('li', {
              className: "styleoption",
              innerHTML: "<label><input type=checkbox name=\"" + optionname + "\" " + checked + "><span class=\"optionlabel\">" + optionname + "</span><span class=description>: " + description + "</span></label>"
            });
            $.on($('input', li), 'click', $.cb.checked);
          }
          $.add(ul, li);
        }
        $.add(div, ul);
      }
      $.add($('#style_tab + div', dialog), div);
      Options.applyStyle(dialog, 'style_tab');
      this.themeTab(dialog);
      this.mascotTab(dialog);
      Options.applyStyle(dialog, 'mascot_tab');
      Options.indicators(dialog);
      if (tab) {
        $("#main_tab", dialog).checked = false;
        $("#" + tab + "_tab", dialog).checked = true;
      }
      overlay = $.el('div', {
        id: 'overlay'
      });
      $.on(overlay, 'click', Options.close);
      $.add(d.body, overlay);
      dialog.style.visibility = 'hidden';
      if (Conf['Style']) {
        Style.rice(dialog);
      }
      $.add(d.body, dialog);
      dialog.style.visibility = 'visible';
      Options.filter.call(filter);
      Options.backlink.call(back);
      Options.time.call(time);
      Options.fileInfo.call(fileInfo);
      return Options.favicon.call(favicon);
    },
    indicators: function(dialog) {
      var indicator, indicators, key, _i, _j, _len, _len1, _ref, _ref1, _results;
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
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        indicator = _ref1[_j];
        key = indicator.firstChild.textContent;
        indicator.hidden = !$.get(key, Conf[key]);
        indicators[key] = indicator;
        _results.push($.on($("[name='" + key + "']", dialog), 'click', function() {
          return Options.indicators(dialog);
        }));
      }
      return _results;
    },
    themeTab: function(dialog, mode) {
      var div, keys, name, parentdiv, suboptions, theme, _i, _j, _len, _len1;
      if (!dialog) {
        dialog = $("#options", d.body);
      }
      if (!mode) {
        mode = 'default';
      }
      parentdiv = $.el('div', {
        id: "themeContainer"
      });
      suboptions = $.el('div', {
        className: "suboptions",
        id: "themes",
        innerHTML: "<div class=warning><code>Style</code> is currently disabled. Please enable it in the Main tab to use theming options.</div>"
      });
      keys = Object.keys(userThemes);
      keys.sort();
      if (mode === "default") {
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          name = keys[_i];
          theme = userThemes[name];
          if (!theme["Deleted"]) {
            div = $.el('div', {
              className: name === Conf['theme'] ? 'selectedtheme replyContainer' : 'replyContainer',
              id: name,
              innerHTML: "<div class='reply' style='position: relative; width: 100%; box-shadow: none !important; background-color:" + theme['Reply Background'] + "!important;border:1px solid " + theme['Reply Border'] + "!important;color:" + theme['Text'] + "!important'>  <div class='rice' style='cursor: pointer; width: 12px;height: 12px;margin: 0 3px;vertical-align: middle;display: inline-block;background-color:" + theme['Checkbox Background'] + ";border: 1px solid " + theme['Checkbox Border'] + ";'></div>  <span style='color:" + theme['Subjects'] + "!important; font-weight: 700 !important'> " + name + "</span>  <span style='color:" + theme['Names'] + "!important; font-weight: 700 !important'> " + theme['Author'] + "</span>  <span style='color:" + theme['Sage'] + "!important'> (SAGE)</span>  <span style='color:" + theme['Tripcodes'] + "!important'> " + theme['Author Tripcode'] + "</span>  <time style='color:" + theme['Timestamps'] + "'> 20XX.01.01 12:00 </time>  <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Post Numbers'] + "!important&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important&quot;)' style='color:" + theme['Post Numbers'] + "!important;' href='javascript:;'>No.27583594</a>  <a class=edit name='" + name + "' onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Backlinks'] + "!important; font-weight: 800;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot; font-weight: 800;color:" + theme['Hovered Links'] + "!important;&quot;)' style='color:" + theme['Backlinks'] + "!important; font-weight: 800;' href='javascript:;'> &gt;&gt;edit</a>  <a class=export name='" + name + "' onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Backlinks'] + "!important; font-weight: 800;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important; font-weight: 800;&quot;)' style='color:" + theme['Backlinks'] + "!important; font-weight: 800;' href='javascript:;'> &gt;&gt;export</a>  <a class=delete onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Backlinks'] + "!important; font-weight: 800;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important; font-weight: 800;&quot;)' style='color:" + theme['Backlinks'] + "!important; font-weight: 800;' href='javascript:;'> &gt;&gt;delete</a>  <br>  <blockquote style='cursor: pointer; margin: 0; padding: 12px 40px'>    <a style='color:" + theme['Quotelinks'] + "!important; font-weight: 800;'>&gt;&gt;27582902</a>    <br>    Post content is right here.  </blockquote>  <h1 style='color: " + theme['Text'] + "'>Selected</h1></div>"
            });
            $.on($('a.edit', div), 'click', function() {
              if (!Conf["Style"]) {
                alert("Please enable Style Options and reload the page to use Theme Tools.");
                return;
              }
              ThemeTools.init(this.name);
              return Options.close();
            });
            $.on($('a.export', div), 'click', function() {
              var exportTheme, exportedTheme;
              exportTheme = userThemes[this.name];
              exportTheme['Theme'] = this.name;
              exportedTheme = "data:application/json," + encodeURIComponent(JSON.stringify(exportTheme));
              if (window.open(exportedTheme, "_blank")) {

              } else if (confirm("Your popup blocker is preventing Appchan X from exporting this theme. Would you like to open the exported theme in this window?")) {
                return window.location(exportedTheme);
              }
            });
            $.on($('a.delete', div), 'click', function() {
              var container, settheme;
              container = this.parentElement.parentElement;
              if (!(container.previousSibling || container.nextSibling)) {
                alert("Cannot delete theme (No other themes available).");
                return;
              }
              if (confirm("Are you sure you want to delete \"" + container.id + "\"?")) {
                if (container.id === Conf['theme']) {
                  if (settheme = container.previousSibling || container.nextSibling) {
                    Conf['theme'] = settheme.id;
                    $.addClass(settheme, 'selectedtheme');
                    $.set('theme', Conf['theme']);
                  }
                }
                userThemes[container.id]["Deleted"] = true;
                $.set('userThemes', userThemes);
                return $.rm(container);
              }
            });
            $.on($('.rice', div), 'click', Options.selectTheme);
            $.on($('blockquote', div), 'click', Options.selectTheme);
            $.add(suboptions, div);
          }
        }
        div = $.el('div', {
          id: 'addthemes',
          innerHTML: "<a id=newtheme href='javascript:;'>New Theme</a> / <a id=import href='javascript:;'>Import Theme</a><input id=importbutton type=file hidden> / <a id=SSimport href='javascript:;'>Import from 4chan SS</a><input id=SSimportbutton type=file hidden> / <a id=OCimport href='javascript:;'>Import from Oneechan</a><input id=OCimportbutton type=file hidden> / <a id=tUndelete href='javascript:;'>Undelete Theme</a>  "
        });
        $.on($("#newtheme", div), 'click', function() {
          if (!Conf["Style"]) {
            alert("Please enable Style Options and reload the page to use Theme Tools.");
            return;
          }
          newTheme = true;
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
          $.rm($("#themeContainer", d.body));
          return Options.themeTab(false, 'undelete');
        });
      } else {
        for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
          name = keys[_j];
          theme = userThemes[name];
          if (theme["Deleted"]) {
            div = $.el('div', {
              className: name === Conf['theme'] ? 'selectedtheme replyContainer' : 'replyContainer',
              id: name,
              innerHTML: "<div class='reply' style='position: relative; width: 100%; box-shadow: none !important; background-color:" + theme['Reply Background'] + "!important;border:1px solid " + theme['Reply Border'] + "!important;color:" + theme['Text'] + "!important'>  <div class='rice' style='cursor: pointer; width: 12px;height: 12px;margin: 0 3px;vertical-align: middle;display: inline-block;background-color:" + theme['Checkbox Background'] + ";border: 1px solid " + theme['Checkbox Border'] + ";'></div>  <span style='color:" + theme['Subjects'] + "!important; font-weight: 700 !important'> " + name + "</span>  <span style='color:" + theme['Names'] + "!important; font-weight: 700 !important'> " + theme['Author'] + "</span>  <span style='color:" + theme['Sage'] + "!important'> (SAGE)</span>  <span style='color:" + theme['Tripcodes'] + "!important'> " + theme['Author Tripcode'] + "</span>  <time style='color:" + theme['Timestamps'] + "'> 20XX.01.01 12:00 </time>  <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Post Numbers'] + "!important&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important&quot;)' style='color:" + theme['Post Numbers'] + "!important;' href='javascript:;'>No.27583594</a>  <br>  <blockquote style='cursor: pointer; margin: 0; padding: 12px 40px'>    <a style='color:" + theme['Quotelinks'] + "!important; font-weight: 800;'>&gt;&gt;27582902</a>    <br>    I forgive you for using VLC to open me. ;__;  </blockquote></div>"
            });
            $.on(div, 'click', function() {
              if (confirm("Are you sure you want to undelete \"" + this.id + "\"?")) {
                userThemes[this.id]["Deleted"] = false;
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
          $.rm($("#themeContainer", d.body));
          return Options.themeTab();
        });
      }
      $.add(parentdiv, suboptions);
      $.add(parentdiv, div);
      $.add($('#theme_tab + div', dialog), parentdiv);
      Options.applyStyle(dialog, 'theme_tab');
      return Options.indicators(dialog);
    },
    mascotTab: function(dialog, mode) {
      var batchmascots, div, keys, li, mascot, name, parentdiv, suboptions, ul, _i, _j, _len, _len1;
      if (!dialog) {
        dialog = $("#options", d.body);
      }
      if (!mode) {
        mode = 'default';
      }
      parentdiv = $.el('div', {
        id: "mascotContainer"
      });
      suboptions = $.el('div', {
        className: "suboptions",
        innerHTML: "<div class=warning><code>Style</code> is currently disabled. Please enable it in the Main tab to use mascot options.</div><div class=warning><code>Mascots</code> are currently disabled. Please enable them in the Style tab to use mascot options.</div>"
      });
      ul = $.el('ul', {
        className: 'mascots'
      });
      keys = Object.keys(userMascots);
      keys.sort();
      if (mode === 'default') {
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          name = keys[_i];
          if (!Conf["Deleted Mascots"].contains(name)) {
            mascot = userMascots[name];
            li = $.el('li', {
              className: 'mascot',
              innerHTML: "<div id='" + name + "' class='" + mascot.category + "' style='background-image: url(" + (Array.isArray(mascot.image) ? (Conf["Style"] && userThemes[Conf['theme']]['Dark Theme'] ? mascot.image[0] : mascot.image[1]) : mascot.image) + ");'></div><div class='mascotmetadata'>  <p><span class='mascotname'>" + (name.replace(/_/g, " ")) + "</span></p>  <p><span class='mascotoptions'><a class=edit name='" + name + "' href='javascript:;'>Edit</a> / <a class=delete name='" + name + "' href='javascript:;'>Delete</a> / <a class=export name='" + name + "' href='javascript:;'>Export</a></span></p></div>"
            });
            div = $('div[style]', li);
            if (Conf[g.MASCOTSTRING].contains(name)) {
              $.addClass(div, 'enabled');
            }
            $.on($('a.edit', li), 'click', function() {
              if (!Conf["Style"]) {
                alert("Please enable Style Options and reload the page to use Mascot Tools.");
                return;
              }
              MascotTools.dialog(this.name);
              return Options.close();
            });
            $.on($('a.delete', li), 'click', function() {
              var container, type, _j, _len1, _ref;
              container = this.parentElement.parentElement.parentElement.parentElement;
              if (confirm("Are you sure you want to delete \"" + this.name + "\"?")) {
                _ref = ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"];
                for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                  type = _ref[_j];
                  Conf[type].remove(this.name);
                  $.set(type, Conf[type]);
                }
                Conf["Deleted Mascots"].push(this.name);
                $.set("Deleted Mascots", Conf["Deleted Mascots"]);
                return $.rm(container);
              }
            });
            $.on($('a.export', li), 'click', function() {
              var exportMascot, exportedMascot;
              exportMascot = userMascots[this.name];
              exportMascot['Mascot'] = this.name;
              exportedMascot = "data:application/json," + encodeURIComponent(JSON.stringify(exportMascot));
              if (window.open(exportedMascot, "_blank")) {

              } else if (confirm("Your popup blocker is preventing Appchan X from exporting this theme. Would you like to open the exported theme in this window?")) {
                return window.location(exportedMascot);
              }
            });
            $.on(div, 'click', function() {
              if (Conf[g.MASCOTSTRING].remove(this.id)) {
                $.rmClass(this, 'enabled');
              } else {
                $.addClass(this, 'enabled');
                Conf[g.MASCOTSTRING].push(this.id);
              }
              return $.set("Enabled Mascots", Conf["Enabled Mascots"]);
            });
            $.add(ul, li);
            $.add(suboptions, ul);
          }
        }
        batchmascots = $.el('div', {
          id: "mascots_batch",
          innerHTML: "<a href=\"javascript:;\" id=clear>Clear All</a> / <a href=\"javascript:;\" id=selectAll>Select All</a> / <a href=\"javascript:;\" id=createNew>New Mascot</a> / <a href=\"javascript:;\" id=importMascot>Import Mascot</a><input id=importMascotButton type=file hidden> / <a href=\"javascript:;\" id=undelete>Undelete Mascots</a>"
        });
        $.on($('#clear', batchmascots), 'click', function() {
          var _j, _len1, _ref;
          _ref = Conf[g.MASCOTSTRING];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            name = _ref[_j];
            $.rmClass($.id(name), 'enabled');
            Conf[g.MASCOTSTRING].remove(name);
          }
          return $.set(g.MASCOTSTRING, Conf[g.MASCOTSTRING]);
        });
        $.on($('#selectAll', batchmascots), 'click', function() {
          for (name in userMascots) {
            mascot = userMascots[name];
            if (!Conf[g.MASCOTSTRING].contains(name || Conf["Deleted Mascots"].contains(name))) {
              $.addClass($.id(name), 'enabled');
              Conf[g.MASCOTSTRING].push(name);
            }
          }
          return $.set(g.MASCOTSTRING, Conf[g.MASCOTSTRING]);
        });
        $.on($('#createNew', batchmascots), 'click', function() {
          if (!Conf["Style"]) {
            alert("Please enable Style Options and reload the page to use Mascot Tools.");
            return;
          }
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
          if (!Conf["Style"]) {
            alert("Please enable Style Options and reload the page to use Mascot Tools.");
            return;
          }
          if (!(Conf["Deleted Mascots"].length > 0)) {
            alert("No mascots have been deleted.");
            return;
          }
          $.rm($("#mascotContainer", d.body));
          return Options.mascotTab(false, 'undelete');
        });
      } else {
        for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
          name = keys[_j];
          if (Conf["Deleted Mascots"].contains(name)) {
            mascot = userMascots[name];
            li = $.el('li', {
              className: 'mascot',
              innerHTML: "<div id='" + name + "' class='" + mascot.category + "' style='background-image: url(" + (Array.isArray(mascot.image) ? (Conf["Style"] && userThemes[Conf['theme']]['Dark Theme'] ? mascot.image[0] : mascot.image[1]) : mascot.image) + ");'></div><div class='mascotmetadata'>  <p><span class='mascotname'>" + (name.replace(/_/g, " ")) + "</span></p></div>"
            });
            div = $('div', li);
            $.on(div, 'click', function() {
              var container;
              container = this.parentElement;
              if (confirm("Are you sure you want to undelete \"" + this.id + "\"?")) {
                Conf["Deleted Mascots"].remove(this.id);
                $.set("Deleted Mascots", Conf["Deleted Mascots"]);
                return $.rm(container);
              }
            });
            $.add(ul, li);
            $.add(suboptions, ul);
          }
        }
        batchmascots = $.el('div', {
          id: "mascots_batch",
          innerHTML: "<a href=\"javascript:;\" id=\"return\">Return</a>"
        });
        $.on($('#return', batchmascots), 'click', function() {
          $.rm($("#mascotContainer", d.body));
          return Options.mascotTab();
        });
      }
      $.add(parentdiv, suboptions);
      $.add(parentdiv, batchmascots);
      $.add($('#mascot_tab + div', dialog), parentdiv);
      return Options.indicators(dialog);
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
          textContent: "Navigation Syntax: Display Name | Title / Alternate Text | URL"
        });
        $.add(ul, li);
        navOptions = ["Display Name", "Title / Alt Text", "URL"];
        _ref = userNavigation.links;
        for (index in _ref) {
          link = _ref[index];
          li = $.el("li");
          input = $.el("input", {
            className: "hidden"
          });
          input.setAttribute("value", index);
          input.setAttribute("type", "hidden");
          input.setAttribute("hidden", "hidden");
          $.add(li, input);
          for (itemIndex in link) {
            item = link[itemIndex];
            input = $.el("input", {
              className: "field",
              name: itemIndex
            });
            input.setAttribute("value", item);
            input.setAttribute("placeholder", navOptions[itemIndex]);
            input.setAttribute("type", "text");
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
            userNavigation.links.add = function(at) {
              var blankLink, keep;
              keep = userNavigation.links.slice(at);
              userNavigation.links.length = at;
              blankLink = ["ex", "example", "http://www.example.com/"];
              userNavigation.links.push(blankLink);
              return userNavigation.links.push.apply(userNavigation.links, keep);
            };
            userNavigation.links.add(this.parentElement.firstChild.value);
            delete userNavigation.links.add;
            return Options.customNavigation.cleanup();
          });
          removeLink = $.el("a", {
            textContent: " x ",
            href: "javascript:;"
          });
          $.on(removeLink, "click", function() {
            userNavigation.links.remove = function(from) {
              var keep;
              keep = userNavigation.links.slice(parseInt(from) + 1);
              userNavigation.links.length = from;
              return userNavigation.links.push.apply(userNavigation.links, keep);
            };
            userNavigation.links.remove(this.parentElement.firstChild.value);
            delete userNavigation.links.remove;
            return Options.customNavigation.cleanup();
          });
          $.add(li, addLink);
          $.add(li, removeLink);
          $.add(ul, li);
        }
        li = $.el("li");
        addLink = $.el("a", {
          textContent: " + ",
          href: "javascript:;"
        });
        $.on(addLink, "click", function() {
          var blankLink;
          blankLink = ["ex", "example", "http://www.example.com/"];
          userNavigation.links.push(blankLink);
          return Options.customNavigation.cleanup();
        });
        $.add(li, addLink);
        $.add(ul, li);
        return $.add(div, ul);
      },
      cleanup: function() {
        $.set("userNavigation", userNavigation);
        $.rm($("#customNavigation > ul", d.body));
        return Options.customNavigation.dialog($("#options", d.body));
      }
    },
    close: function() {
      $.rm($('#options', d.body));
      return $.rm($('#overlay', d.body));
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
      var el, name, ta;
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
      if (el) {
        $.rm(el);
      }
      return $.after(this, $.el('article', {
        innerHTML: '<p>Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>\
  Lines starting with a <code>#</code> will be ignored.<br>\
  For example, <code>/weeaboo/i</code> will filter posts containing the string `<code>weeaboo</code>`, case-insensitive.</p>\
  <ul>You can use these settings with each regular expression, separate them with semicolons:\
    <li>\
      Per boards, separate them with commas. It is global if not specified.<br>\
      For example: <code>boards:a,jp;</code>.\
    </li>\
    <li>\
      Filter OPs only along with their threads (`only`), replies only (`no`, this is default), or both (`yes`).<br>\
      For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.\
    </li>\
    <li>\
      Overrule the `Show Stubs` setting if specified: create a stub (`yes`) or not (`no`).<br>\
      For example: <code>stub:yes;</code> or <code>stub:no;</code>.\
    </li>\
    <li>\
      Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>\
      For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.\
    </li>\
    <li>\
      Highlighted OPs will have their threads put on top of board pages by default.<br>\
      For example: <code>top:yes;</code> or <code>top:no;</code>.\
    </li>\
  </ul>'
      }));
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
        link: 'javascript:;',
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
      return this.nextElementSibling.innerHTML = "<img src=" + Favicon.unreadSFW + "> <img src=" + Favicon.unreadNSFW + "> <img src=" + Favicon.unreadDead + ">";
    },
    applyStyle: function(dialog, tab) {
      var save;
      if (Conf['styleenabled']) {
        save = $.el('div', {
          innerHTML: '<a href="javascript:;">Save Style Settings</a>',
          className: 'stylesettings'
        });
        $.on($('a', save), 'click', function() {
          Style.addStyle();
          $.rm($("#mascot_tab + div > div", d.body));
          return Options.mascotTab();
        });
        return $.add($('#' + tab + ' + div', dialog), save);
      }
    },
    selectTheme: function() {
      var container, currentTheme;
      container = this.parentElement.parentElement;
      if (currentTheme = $.id(Conf['theme'])) {
        $.rmClass(currentTheme, 'selectedtheme');
      }
      if (Conf["NSFW/SFW Themes"]) {
        $.set("theme_" + g.TYPE, container.id);
      } else {
        $.set("theme", container.id);
      }
      Conf['theme'] = container.id;
      return $.addClass(container, 'selectedtheme');
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
      if (text !== null) {
        for (tag in tag_patterns) {
          pattern = tag_patterns[tag];
          text = text.replace(pattern, Markdown.unicode_convert);
        }
        return text;
      }
    },
    unicode_convert: function(str, tag, inner) {
      var c, charcode, charcodes, codepoints, codes, fmt, i, unicode_text;
      if (tag === "_" || tag === "*") {
        fmt = "i";
      } else if (tag === "__" || tag === "**") {
        fmt = "b";
      } else if (tag === "***" || tag === "___") {
        fmt = "bi";
      } else if (tag === "||") {
        fmt = "ds";
      } else {
        if (tag === "`" || tag === "```") {
          fmt = "code";
        }
      }
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
            if (charcode === 104 && tag === "i") {
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
      unicode_text = codes.map(Markdown.ucs2_encode).join("");
      if (tag === "code") {
        unicode_text = unicode_text.replace(/\x20/g, "\xA0");
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
      output = "";
      if (value > 0xFFFF) {
        value -= 0x10000;
        output += String.fromCharCode(value >>> 10 & 0x3FF | 0xD800);
        value = 0xDC00 | value & 0x3FF;
      }
      output += String.fromCharCode(value);
      return output;
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
          if (boards !== 'global' && boards.split(',').indexOf(g.BOARD) === -1) {
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
      if (subject = $('.postInfo .subject', post.el)) {
        return subject.textContent;
      }
      return false;
    },
    comment: function(post) {
      var data, i, nodes, text, _i, _ref;
      text = [];
      nodes = d.evaluate('.//br|.//text()', post.blockquote, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (i = _i = 0, _ref = nodes.snapshotLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        text.push((data = nodes.snapshotItem(i).data) ? data : '\n');
      }
      return text.join('');
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
        entry.children.push(Filter.createSubEntry(type[0], type[1]));
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
        if ((el = $.id(quote.hash.slice(1))) && el.hidden) {
          $.addClass(quote, 'filtered');
          if (Conf['Recursive Filtering'] && post.ID !== post.threadID) {
            show_stub = !!$.x('preceding-sibling::div[contains(@class,"stub")]', el);
            ReplyHiding.hide(post.root, show_stub);
          }
        }
      }
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
      var bq, clone, href, post, posts, quote, quotes, spoilerRange, _i, _j, _len, _len1;
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
      quotes = clone.getElementsByClassName('quotelink');
      for (_j = 0, _len1 = quotes.length; _j < _len1; _j++) {
        quote = quotes[_j];
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
      if (Conf['Resurrect Quotes']) {
        Quotify.node(post);
      }
      if (Conf['Quote Preview']) {
        QuotePreview.node(post);
      }
      if (Conf['Quote Inline']) {
        QuoteInline.node(post);
      }
      if (Conf['Indicate OP quote']) {
        QuoteOP.node(post);
      }
      if (Conf['Indicate Cross-thread Quotes']) {
        QuoteCT.node(post);
      }
      $.replace(bq, clone);
      if (Conf['Linkify']) {
        Linkify.node(post);
      }
      return Main.prettify(clone);
    }
  };

  ExpandThread = {
    init: function() {
      var a, span, _i, _len, _ref, _results;
      _ref = $$('.summary');
      _results = [];
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
        _results.push($.replace(span, a));
      }
      return _results;
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
      var backlink, id, link, nodes, post, posts, replies, reply, spoilerRange, threadID, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
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
      return $.after(a, nodes);
    }
  };

  ThreadHiding = {
    init: function() {
      var a, thread, _i, _len, _ref;
      ThreadHiding.hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      _ref = $$('.thread');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        a = $.el('a', {
          className: 'hide_thread_button',
          innerHTML: '<span>[ - ]</span>',
          href: 'javascript:;'
        });
        $.on(a, 'click', function() {
          return ThreadHiding.toggle(this.parentElement);
        });
        $.prepend(thread, a);
        if (thread.id.slice(1) in ThreadHiding.hiddenThreads) {
          ThreadHiding.hide(thread);
        }
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
      $.addClass(side, 'hide_reply_button');
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
    hide: function(root, show_stub) {
      var a, el, menuButton, side, stub;
      if (show_stub == null) {
        show_stub = Conf['Show Stubs'];
      }
      side = $('.sideArrows', root);
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
        className: 'hide_reply_button stub',
        innerHTML: '<a href="javascript:;"><span>[ + ]</span> </a>'
      });
      a = stub.firstChild;
      $.on(a, 'click', function() {
        var button, id;
        return ReplyHiding.toggle(button = this.parentNode, root = button.parentNode, id = root.id.slice(2));
      });
      $.add(a, $.tn($('.desktop > .nameBlock', el).textContent));
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
      $('.sideArrows', root).hidden = false;
      $('.post', root).hidden = false;
      return $.rmClass(root, 'hidden');
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
      var key, link, o, target, thread;
      if (!(key = Keybinds.keyCode(e))) {
        return;
      }
      target = e.target;
      if (/TEXTAREA|INPUT/.test(target.nodeName)) {
        if (!((key === 'Esc') || (/\+/.test(key)))) {
          return;
        }
      }
      thread = Nav.getThread();
      switch (key) {
        case Conf.openQR:
          Keybinds.qr(thread, true);
          break;
        case Conf.openEmptyQR:
          Keybinds.qr(thread);
          break;
        case Conf.openOptions:
          if (!$.id('overlay')) {
            Options.dialog();
          }
          break;
        case Conf.close:
          if (o = $.id('overlay')) {
            Options.close.call(o);
          } else if (QR.el) {
            QR.close();
          }
          break;
        case Conf.submit:
          if (QR.el && !QR.status()) {
            QR.submit();
          }
          break;
        case Conf.spoiler:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('spoiler', target);
          break;
        case Conf.code:
          if (target.nodeName !== 'TEXTAREA') {
            return;
          }
          Keybinds.tags('code', target);
          break;
        case Conf.sageru:
          $("[name=email]", QR.el).value = "sage";
          QR.selected.email = "sage";
          break;
        case Conf.watch:
          Watcher.toggle(thread);
          break;
        case Conf.update:
          Updater.update();
          break;
        case Conf.unreadCountTo0:
          Unread.replies = [];
          Unread.update(true);
          break;
        case Conf.expandImage:
          Keybinds.img(thread);
          break;
        case Conf.expandAllImages:
          Keybinds.img(thread, true);
          break;
        case Conf.zero:
          window.location = "/" + g.BOARD + "/0#delform";
          break;
        case Conf.nextPage:
          if (link = $('link[rel=next]', d.head)) {
            window.location = link.href + '#delform';
          }
          break;
        case Conf.previousPage:
          if (link = $('link[rel=prev]', d.head)) {
            window.location = link.href + '#delform';
          }
          break;
        case Conf.nextThread:
          if (g.REPLY) {
            return;
          }
          Nav.scroll(+1);
          break;
        case Conf.previousThread:
          if (g.REPLY) {
            return;
          }
          Nav.scroll(-1);
          break;
        case Conf.expandThread:
          ExpandThread.toggle(thread);
          break;
        case Conf.openThread:
          Keybinds.open(thread);
          break;
        case Conf.openThreadTab:
          Keybinds.open(thread, true);
          break;
        case Conf.nextReply:
          Keybinds.hl(+1, thread);
          break;
        case Conf.previousReply:
          Keybinds.hl(-1, thread);
          break;
        case Conf.hide:
          if (/\bthread\b/.test(thread.className)) {
            ThreadHiding.toggle(thread);
          }
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
      var i, link, rect, thread, top, _ref, _ref1;
      _ref = Nav.getThread(true), thread = _ref[0], i = _ref[1], rect = _ref[2];
      top = rect.top;
      if (!((delta === -1 && Math.ceil(top) < 0) || (delta === +1 && top > 1))) {
        i += delta;
      }
      if (Conf['Rollover']) {
        if (i === -1) {
          if (link = $('link[rel=prev]', d.head)) {
            window.location = link.href + '#delform';
          } else {
            window.location = "/" + g.BOARD + "/0#delform";
          }
          return;
        }
        if ((delta === +1) && ((i === Nav.threads.length) || (innerHeight + pageYOffset === d.body.scrollHeight))) {
          if (link = $('link[rel=next]', d.head)) {
            window.location = link.href + '#delform';
            return;
          }
        }
      }
      top = (_ref1 = Nav.threads[i]) != null ? _ref1.getBoundingClientRect().top : void 0;
      return window.scrollBy(0, top);
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
      html += "      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox " + checked + "></label></div>      <div><label>Interval (s)<input type=number name=Interval" + (Conf['Interval per board'] ? "_" + g.BOARD : '') + " class=field min=1></label></div>";
      if (Conf["Optional Increase"]) {
        html += "<div><label>BGInterval<input type=number name=BGInterval" + (Conf['Interval per board'] ? "_" + g.BOARD : '') + " class=field min=1></label></div>";
      }
      html += "<div><input value='Update Now' type=button name='Update Now'></div>";
      dialog = UI.dialog('updater', 'bottom: 0; right: 0;', html);
      this.count = $('#count', dialog);
      this.timer = $('#timer', dialog);
      this.thread = $.id("t" + g.THREAD_ID);
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
      return $.on(d, 'visibilitychange ovisibilitychange mozvisibilitychange webkitvisibilitychange', this.cb.visibility);
    },
    cb: {
      post: function() {
        if (!Conf['Auto Update This']) {
          return;
        }
        Updater.unsuccessfulFetchCount = 0;
        return setTimeout(Updater.update, 1000);
      },
      visibility: function() {
        var state;
        state = d.visibilityState || d.oVisibilityState || d.mozVisibilityState || d.webkitVisibilityState;
        if (state !== 'visible') {
          return;
        }
        Updater.unsuccessfulFetchCount = 0;
        if (Conf['Interval per board']) {
          if (Updater.timer.textContent < -Conf['Interval_' + g.BOARD]) {
            return Updater.set('timer', -Updater.getInterval());
          }
        } else {
          if (Updater.timer.textContent < -Conf['Interval']) {
            return Updater.set('timer', -Updater.getInterval());
          }
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
        } else if (Conf['Style']) {
          Updater.set('count', '+0');
          Updater.count.className = '';
          return Updater.timer.hidden = true;
        } else {
          Updater.set('count', 'Thread Updater');
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
          return !(d.hidden || d.oHidden || d.mozHidden || d.webkitHidden);
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
        return delete Updater.request;
      },
      update: function(posts) {
        var count, id, lastPost, nodes, post, scroll, spoilerRange, _i, _len, _ref;
        if (spoilerRange = posts[0].custom_spoiler) {
          Build.spoilerRange[g.BOARD] = spoilerRange;
        }
        lastPost = Updater.thread.lastElementChild;
        id = +lastPost.id.slice(2);
        nodes = [];
        _ref = posts.reverse();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          post = _ref[_i];
          if (post.no <= id) {
            break;
          }
          nodes.push(Build.postFromObject(post, g.BOARD));
        }
        count = nodes.length;
        if (Conf['Verbose']) {
          Updater.set('count', "+" + count);
          Updater.count.className = count ? 'new' : null;
        }
        if (count) {
          Updater.unsuccessfulFetchCount = 0;
        } else {
          Updater.unsuccessfulFetchCount++;
          return;
        }
        scroll = Conf['Scrolling'] && Updater.scrollBG() && lastPost.getBoundingClientRect().bottom - d.documentElement.clientHeight < 25;
        $.add(Updater.thread, nodes.reverse());
        if (scroll) {
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
    getInterval: function() {
      var bg, hidden, i, j, oi, w, wb;
      if (Conf['Interval per board']) {
        i = +Conf['Interval_' + g.BOARD];
        bg = +Conf['BGInterval_' + g.BOARD];
      } else {
        i = +Conf['Interval'];
        bg = +Conf['BGInterval'];
      }
      w = Conf['updateIncrease'].split(',');
      wb = Conf['updateIncreaseB'].split(',');
      j = Math.min(this.unsuccessfulFetchCount, 9);
      oi = function(y) {
        var x, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = y.length; _i < _len; _i++) {
          x = y[_i];
          _results.push(Number(x));
        }
        return _results;
      };
      hidden = d.hidden || d.oHidden || d.mozHidden || d.webkitHidden;
      if (!hidden) {
        if (Conf['Optional Increase']) {
          return Math.max(i, oi(w)[j]);
        } else {
          return i;
        }
      } else {
        if (Conf['Optional Increase']) {
          return Math.max(bg, oi(wb)[j]);
        } else {
          return bg;
        }
      }
    },
    timeout: function() {
      var n;
      Updater.timeoutID = setTimeout(Updater.timeout, 1000);
      n = 1 + Number(Updater.timer.firstChild.data);
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

  Anonymize = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var name, parent, trip;
      if (post.isInlined && !post.isCrosspost) {
        return;
      }
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
      if (post.isInlined && !post.isCrosspost || !img) {
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

  RevealSpoilers = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var img, s;
      img = post.img;
      if (!(img && /^Spoiler/.test(img.alt)) || post.isInlined && !post.isCrosspost || post.isArchived) {
        return;
      }
      img.removeAttribute('style');
      s = img.style;
      s.maxHeight = s.maxWidth = /\bop\b/.test(post["class"]) ? '250px' : '125px';
      return img.src = "//thumbs.4chan.org" + (img.parentNode.pathname.replace(/src(\/\d+).+$/, 'thumb$1s.jpg'));
    }
  };

  Time = {
    init: function() {
      Time.foo();
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var node;
      if (post.isInlined && !post.isCrosspost) {
        return;
      }
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

  FileInfo = {
    init: function() {
      if (g.BOARD === 'f') {
        return;
      }
      this.setFormats();
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var alt, filename, node, _ref;
      if (post.isInlined && !post.isCrosspost || !post.fileInfo) {
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
      code = Conf['fileInfo'].replace(/%([BKlLMnNprs])/g, function(s, c) {
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

  Get = {
    post: function(board, threadID, postID, root, cb) {
      var post, url;
      if (board === g.BOARD && (post = $.id("pc" + postID))) {
        $.add(root, Get.cleanPost(post.cloneNode(true)));
        return;
      }
      root.textContent = "Loading post No." + postID + "...";
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
          root.textContent = status === 404 ? "Thread No." + threadID + " 404'd." : "Error " + req.status + ": " + req.statusText + ".";
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
      $.replace(root.firstChild, Get.cleanPost(Build.postFromObject(post, board)));
      if (cb) {
        return cb();
      }
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
      comment = bq.innerHTML.replace(/(^|>)(&gt;[^<$]+)(<|$)/g, '$1<span class=quote>$2</span>$3');
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
        email: data.email ? encodeURIComponent(data.email.replace(/&quot;/g, '"')) : '',
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
        email: data.email ? encodeURIComponent(data.email.replace(/&quot;/g, '"')) : '',
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
        innerHTML: (isOP ? '' : "<div class=sideArrows id=sa" + postID + ">&gt;&gt;</div>") + ("<div id=p" + postID + " class='post " + (isOP ? 'op' : 'reply') + (capcode === 'admin_highlight' ? ' highlightPost' : '') + "'>") + ("<div class='postInfoM mobile' id=pim" + postID + ">") + ("<span class='nameBlock" + capcodeClass + "'>") + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + capcode + userID + flag + sticky + closed + ("<br>" + subject) + ("</span><span class='dateTime postNum' data-utc=" + dateUTC + ">" + date) + '<br><em>' + ("<a href=" + ("/" + board + "/res/" + threadID + "#p" + postID) + ">No.</a>") + ("<a href='" + (g.REPLY && g.THREAD_ID === threadID ? "javascript:quote(" + postID + ")" : "/" + board + "/res/" + threadID + "#q" + postID) + "'>" + postID + "</a>") + '</em></span>' + '</div>' + (isOP ? fileHTML : '') + ("<div class='postInfo desktop' id=pi" + postID + ">") + ("<input type=checkbox name=" + postID + " value=delete> ") + ("" + subject + " ") + ("<span class='nameBlock" + capcodeClass + "'>") + emailStart + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + emailEnd + capcode + userID + flag + sticky + closed + ' </span> ' + ("<span class=dateTime data-utc=" + dateUTC + ">" + date + "</span> ") + "<span class='postNum desktop'>" + ("<a href=" + ("/" + board + "/res/" + threadID + "#p" + postID) + " title='Highlight this post'>No.</a>") + ("<a href='" + (g.REPLY && +g.THREAD_ID === threadID ? "javascript:quote(" + postID + ")" : "/" + board + "/res/" + threadID + "#q" + postID) + "' title='Quote this post'>" + postID + "</a>") + '</span>' + '</div>' + (isOP ? '' : fileHTML) + ("<blockquote class=postMessage id=m" + postID + ">" + (comment || '') + "</blockquote> ") + '</div>'
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

  TitlePost = {
    init: function() {
      return d.title = Get.title();
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
      var a, container, el, link, qid, quote, quotes, _i, _len, _ref;
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
        if (qid = quote.hash.slice(2)) {
          quotes[qid] = true;
        }
      }
      a = $.el('a', {
        href: "/" + g.BOARD + "/res/" + post.threadID + "#p" + post.ID,
        className: post.el.hidden ? 'filtered backlink' : 'backlink',
        textContent: QuoteBacklink.funk(post.ID)
      });
      for (qid in quotes) {
        if (!(el = $.id("pi" + qid)) || !Conf['OP Backlinks'] && /\bop\b/.test(el.parentNode.className)) {
          continue;
        }
        link = a.cloneNode(true);
        if (Conf['Quote Preview']) {
          $.on(link, 'mouseover', QuotePreview.mouseover);
        }
        if (Conf['Quote Inline']) {
          $.on(link, 'click', QuoteInline.toggle);
        }
        if (!(container = $.id("blc" + qid))) {
          container = $.el('span', {
            className: 'container',
            id: "blc" + qid
          });
          $.add(el, container);
        }
        $.add(container, [$.tn(' '), link]);
      }
    }
  };

  QuoteInline = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var quote, _i, _j, _len, _len1, _ref, _ref1;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (!(quote.hash || /\bdeadlink\b/.test(quote.className))) {
          continue;
        }
        $.on(quote, 'click', QuoteInline.toggle);
      }
      _ref1 = post.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
        $.on(quote, 'click', QuoteInline.toggle);
      }
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
      return this.classList.toggle('inlined');
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
      $.after(root, inline);
      Get.post(board, threadID, postID, inline);
      if (!el) {
        return;
      }
      if (isBacklink && Conf['Forward Hiding']) {
        $.addClass(el.parentNode, 'forwarded');
        ++el.dataset.forwarded || (el.dataset.forwarded = 1);
      }
      if ((i = Unread.replies.indexOf(el)) !== -1) {
        Unread.replies.splice(i, 1);
        return Unread.update(true);
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

  QuotePreview = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var quote, _i, _j, _len, _len1, _ref, _ref1;
      _ref = post.quotes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.hash || /\bdeadlink\b/.test(quote.className)) {
          $.on(quote, 'mouseover', QuotePreview.mouseover);
        }
      }
      _ref1 = post.backlinks;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
        $.on(quote, 'mouseover', QuotePreview.mouseover);
      }
    },
    mouseover: function(e) {
      var board, el, path, postID, qp, quote, quoterID, threadID, _i, _len, _ref;
      if (/\binlined\b/.test(this.className)) {
        return;
      }
      if (qp = $.id('qp')) {
        if (qp === UI.el) {
          delete UI.el;
        }
        $.rm(qp);
      }
      if (UI.el) {
        return;
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
      qp = UI.el = $.el('div', {
        id: 'qp',
        className: 'reply dialog'
      });
      UI.hover(e);
      $.add(d.body, qp);
      if (board === g.BOARD) {
        el = $.id("p" + postID);
      }
      Get.post(board, threadID, postID, qp, function() {
        var bq, img, post;
        bq = $('blockquote', qp);
        Main.prettify(bq);
        post = {
          el: qp,
          blockquote: bq,
          isArchived: /\barchivedPost\b/.test(qp.className)
        };
        if (img = $('img[data-md5]', qp)) {
          post.fileInfo = img.parentNode.previousElementSibling;
          post.img = img;
        }
        if (Conf['Reveal Spoilers']) {
          RevealSpoilers.node(post);
        }
        if (Conf['Image Auto-Gif']) {
          AutoGif.node(post);
        }
        if (Conf['Time Formatting']) {
          Time.node(post);
        }
        if (Conf['File Info Formatting']) {
          FileInfo.node(post);
        }
        if (Conf['Resurrect Quotes']) {
          return Quotify.node(post);
        }
      });
      $.on(this, 'mousemove', UI.hover);
      $.on(this, 'mouseout click', QuotePreview.mouseout);
      if (!el) {
        return;
      }
      if (Conf['Quote Highlighting']) {
        if (/\bop\b/.test(el.className)) {
          $.addClass(el.parentNode, 'qphl');
        } else {
          $.addClass(el, 'qphl');
        }
      }
      quoterID = $.x('ancestor::*[@id][1]', this).id.match(/\d+$/)[0];
      _ref = $$('.quotelink, .backlink', qp);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        if (quote.hash.slice(2) === quoterID) {
          $.addClass(quote, 'forwardlink');
        }
      }
    },
    mouseout: function(e) {
      var el;
      UI.hoverend();
      if (el = $.id(this.hash.slice(1))) {
        $.rmClass(el, 'qphl');
        $.rmClass(el.parentNode, 'qphl');
      }
      $.off(this, 'mousemove', UI.hover);
      return $.off(this, 'mouseout click', QuotePreview.mouseout);
    }
  };

  QuoteOP = {
    init: function() {
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

  QuoteCT = {
    init: function() {
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
        if (!quote.hash) {
          continue;
        }
        path = quote.pathname.split('/');
        if (path[1] === g.BOARD && path[3] !== post.threadID) {
          $.add(quote, $.tn('\u00A0(Cross-thread)'));
        }
      }
    }
  };

  Quotify = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var a, board, data, i, id, index, m, node, nodes, quote, quotes, snapshot, text, _i, _j, _len, _ref;
      if (post.isInlined && !post.isCrosspost) {
        return;
      }
      snapshot = d.evaluate('.//text()[not(parent::a)]', post.blockquote, null, 6, null);
      for (i = _i = 0, _ref = snapshot.snapshotLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        node = snapshot.snapshotItem(i);
        data = node.data;
        if (!(quotes = data.match(/>>(>\/[a-z\d]+\/)?\d+/g))) {
          continue;
        }
        nodes = [];
        for (_j = 0, _len = quotes.length; _j < _len; _j++) {
          quote = quotes[_j];
          index = data.indexOf(quote);
          if (text = data.slice(0, index)) {
            nodes.push($.tn(text));
          }
          id = quote.match(/\d+$/)[0];
          board = (m = quote.match(/^>>>\/([a-z\d]+)/)) ? m[1] : $('a[title="Highlight this post"]', post.el).pathname.split('/')[1];
          nodes.push(a = $.el('a', {
            textContent: "" + quote + "\u00A0(Dead)"
          }));
          if (board === g.BOARD && $.id("p" + id)) {
            a.href = "#p" + id;
            a.className = 'quotelink';
          } else {
            a.href = Redirect.thread(board, 0, id);
            a.className = 'deadlink';
            a.target = '_blank';
            if (Redirect.post(board, id)) {
              $.addClass(a, 'quotelink');
              a.setAttribute('data-board', board);
              a.setAttribute('data-id', id);
            }
          }
          data = data.slice(index + quote.length);
        }
        if (data) {
          nodes.push($.tn(data));
        }
        $.replace(node, nodes);
      }
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

  ArchiveLink = {
    init: function() {
      var a;
      a = $.el('a', {
        className: 'archive_link',
        target: '_blank',
        textContent: 'Archived post'
      });
      return Menu.addEntry({
        el: a,
        open: function(post) {
          var href, path;
          path = $('a[title="Highlight this post"]', post.el).pathname.split('/');
          if ((href = Redirect.thread(path[1], path[3], post.ID)) === ("//boards.4chan.org/" + path[1] + "/")) {
            return false;
          }
          a.href = href;
          return true;
        }
      });
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
        menu = $.id('menu');
        thread = $.id("t" + menu.dataset.id);
        return ThreadHiding.toggle(thread);
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
      var thread, _i, _len, _ref, _results;
      ThreadHiding.hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      _ref = $$('.thread');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        if (thread.id.slice(1) in ThreadHiding.hiddenThreads) {
          _results.push(ThreadHiding.hide(thread));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
        menu = $.id('menu');
        id = menu.dataset.id;
        root = $.id("pc" + id);
        button = root.firstChild;
        return ReplyHiding.toggle(button, root, id);
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
        $.log(post.ID);
        return ReplyHiding.hide(post.root);
      }
    }
  };

  ThreadStats = {
    init: function() {
      var dialog;
      dialog = UI.dialog('stats', 'bottom: 0; left: 0;', '<div class=move><span id=postcount>0</span> / <span id=imagecount>0</span></div>');
      dialog.className = 'dialog';
      $.add(d.body, dialog);
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
      var imgcount;
      if (post.isInlined) {
        return;
      }
      $.id('postcount').textContent = ++ThreadStats.posts;
      if (!post.img) {
        return;
      }
      imgcount = $.id('imagecount');
      imgcount.textContent = ++ThreadStats.images;
      if (ThreadStats.images > ThreadStats.imgLimit) {
        return $.addClass(imgcount, 'warning');
      }
    }
  };

  Unread = {
    init: function() {
      this.title = d.title;
      $.on(d, 'QRPostSuccessful', this.post);
      this.update();
      $.on(window, 'scroll', Unread.scroll);
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
      switch (Conf['favicon']) {
        case 'ferongr':
          this.unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAOMHAOgLAnMFAL8AAOgLAukMA/+AgP+rq////////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          this.unreadSFW = 'data:image/gif;base64,R0lGODlhEAAQAOMHAADX8QBwfgC2zADX8QDY8nnl8qLp8v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          this.unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAOMHAFT+ACh5AEncAFT+AFX/Acz/su7/5v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw==';
          break;
        case 'xat-':
          this.unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2ElEQVQ4y61TQQrCMBDMQ8WDIEV6LbT2A4og2Hq0veo7fIAH04dY9N4xmyYlpGmI2MCQTWYy3Wy2DAD7B2wWAzWgcTgVeZKlZRxHNYFi2jM18oBh0IcKtC6ixf22WT4IFLs0owxswXu9egm0Ls6bwfCFfNsJYJKfqoEkd3vgUgFVLWObtzNgVKyruC+ljSzr5OEnBzjvjcQecaQhbZgBb4CmGQw+PoMkTUtdbd8VSEPakcGxPOcsoIgUKy0LecY29BmdBrqRfjIwZ93KLs5loHvBnL3cLH/jF+C/+z5dgUysAAAAAElFTkSuQmCC';
          this.unreadSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA30lEQVQ4y2P4//8/AyWYgSoGQMF/GJ7Y11VVUVoyKTM9ey4Ig9ggMWQ1YA1IBvzXm34YjkH8mPyJB+Nqlp8FYRAbmxoMF6ArSNrw6T0Qf8Amh9cFMEWVR/7/A+L/uORxhgEIt5/+/3/2lf//5wAxiI0uj+4CBlBgxVUvOwtydgXQZpDmi2/+/7/0GmIQSAwkB1IDUkuUAZeABlx+g2zAZ9wGlAOjChba+LwAUgNSi2HA5Am9VciBhSsQQWyoWgZiovEDsdGI1QBYQiLJAGQalpSxyWEzAJYWkGm8clTJjQCZ1hkoVG0CygAAAABJRU5ErkJggg==';
          this.unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4y2P4//8/AyWYgSoGQMF/GJ7YNbGqrKRiUnp21lwQBrFBYshqwBqQDPifdsYYjkH8mInxB+OWx58FYRAbmxoMF6ArKPmU9B6IP2CTw+sCmKKe/5X/gPg/LnmcYQDCs/63/1/9fzYQzwGz0eXRXcAACqy4ZfFnQc7u+V/xD6T55v+LQHwJbBBIDCQHUgNSS5QBt4Cab/2/jDDgMx4DykrKJ8FCG58XQGpAajEMmNw7uQo5sHAFIogNVctATDR+IDYasRoAS0gkGYBMw5IyNjlsBsDSAjKNV44quREAx58Mr9vt5wQAAAAASUVORK5CYII=';
          break;
        case 'Mayhem':
          this.unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jZ2ScWuDMBDFgw4pIkU0WsoQkWAYIkXZH4N9/+/V3dmfXSrKYIFHwt17j8vdGWNMIkgFuaDgzgQnwRs4EQs5KdolUQtagRN0givEDBTEOjgtGs0Zq8F7cKqqusVxrMQLaDUWcjBSrXkn8gs51tpJSWLk9b3HUa0aNIL5gPBR1/V4kJvR7lTwl8GmAm1Gf9+c3S+89qBHa8502AsmSrtBaEBPbIbj0ah2madlNAPEccdgJDfAtWifBjqWKShRBT6KoiH8QlEUn/qt0CCjnNdmPUwmFWzj9Oe6LpKuZXcwqq88z78Pch3aZU3dPwwc2sWlfZKCW5tWluV8kGvXClLm6dYN4/aUqfCbnEOzNDGhGZbNargvxCzvMGfRJD8UaDVvgkzo6QAAAABJRU5ErkJggg==';
          this.unreadSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZ2S4crCMAxF+0OGDJEPKYrIGKOsiJSx/fJRfSAfTJNyKqXfiuDg0C25N2RJjTGmEVrhTzhw7oStsIEtsVzT4o2Jo9ALThiEM8IdHIgNaHo8mjNWg6/ske8bohPo+63QOLzmooHp8fyAICBSQkVz0QKdsFQEV6WSW/D+7+BbgbIDHcb4Kp61XyjyI16zZ8JemGltQtDBSGxB4/GoN+7TpkkjDCsFArm0IYv3U0BbnYtf8BCy+JytsE0X6VyuKhPPK/GAJ14kvZZDZVV3pZIb8MZr6n4o4PDGKn0S5SdDmyq5PnXQsk+Xbhinp03FFzmHJw6xYRiWm9VxnohZ3vOcxdO8ARmXRvbWdtzQAAAAAElFTkSuQmCC';
          this.unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jZ2S0WrDMAxF/TBCCKWMYhZKCSGYmFJMSNjD/mhf239qJXNcjBdTWODgRLpXKJKNMaYROuFTOHEehFb4gJZYrunwxsSXMApOmIQzwgOciE1oRjyaM1aDj+yR7xuiHvT9VmgcXnPRwO/9+wWCgEgJFc1FCwzCVhFclUpuw/u3g3cFyg50GPOjePZ+ocjPeM2RCXthpbUFwQAzsQ2Nx6PeuE+bJo0w7BQI5NKGLN5XAW11LX7BQ8jia7bCLl2kc7mqTLzuxAOeeJH0Wk6VVf0oldyEN15T948CDm+sMiZRfjK0pZIbUwcd+3TphnF62lR8kXN44hAbhmG5WQNnT8zynucsnuYJhFpBfkMzqD4AAAAASUVORK5CYII=';
          break;
        case 'Original':
          this.unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          this.unreadSFW = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAC6Xw////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
          this.unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAGbMM////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs=';
      }
      return this.unread = this.SFW ? this.unreadSFW : this.unreadNSFW;
    },
    empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw==',
    dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  };

  Redirect = {
    image: function(board, filename) {
      switch (board) {
        case 'a':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'vg':
        case 'wsg':
          return "//archive.foolz.us/" + board + "/full_image/" + filename;
        case 'u':
          return "//nsfw.foolz.us/" + board + "/full_image/" + filename;
        case 'ck':
        case 'lit':
          return "//fuuka.warosu.org/" + board + "/full_image/" + filename;
        case 'cgl':
        case 'g':
        case 'w':
          return "//archive.rebeccablacktech.com/" + board + "/full_image/" + filename;
        case 'an':
        case 'k':
        case 'toy':
        case 'x':
          return "http://archive.heinessen.com/" + board + "/full_image/" + filename;
      }
    },
    post: function(board, postID) {
      switch (board) {
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
      }
    },
    thread: function(board, threadID, postID) {
      var path, url;
      if (postID) {
        postID = postID.match(/\d+/)[0];
      }
      path = threadID ? "" + board + "/thread/" + threadID : "" + board + "/post/" + postID;
      switch (board) {
        case 'a':
        case 'co':
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
          url = "//archive.foolz.us/" + path + "/";
          if (threadID && postID) {
            url += "#" + postID;
          }
          break;
        case 'u':
        case 'kuku':
          url = "//nsfw.foolz.us/" + path + "/";
          if (threadID && postID) {
            url += "#" + postID;
          }
          break;
        case 'ck':
        case 'jp':
        case 'lit':
          url = "//fuuka.warosu.org/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        case 'diy':
        case 'sci':
          url = "//archive.installgentoo.net/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        case 'cgl':
        case 'g':
        case 'mu':
        case 'soc':
        case 'w':
          url = "//archive.rebeccablacktech.com/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        case 'an':
        case 'fit':
        case 'k':
        case 'mlp':
        case 'r9k':
        case 'toy':
        case 'x':
          url = "http://archive.heinessen.com/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        case 'e':
          url = "https://www.cliché.net/4chan/cgi-board.pl/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        default:
          if (threadID) {
            url = "//boards.4chan.org/" + board + "/";
          }
      }
      return url || null;
    }
  };

  ImageHover = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      if (!post.img) {
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

  AutoGif = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var gif, img, src;
      img = post.img;
      if (post.el.hidden || !img) {
        return;
      }
      src = img.parentNode.href;
      if (/gif$/.test(src) && !/spoiler/.test(img.src)) {
        gif = $.el('img');
        $.on(gif, 'load', function() {
          return img.src = src;
        });
        return gif.src = src;
      }
    }
  };

  Prefetch = {
    init: function() {
      return this.dialog();
    },
    dialog: function() {
      var controls, first, input;
      controls = $.el('label', {
        id: 'prefetch',
        innerHTML: "Prefetch Images<input type=checkbox id=prefetch>"
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
      var img, thumb, _i, _len, _ref;
      $.off(this, 'change', Prefetch.change);
      _ref = $$('a.fileThumb');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thumb = _ref[_i];
        img = $.el('img', {
          src: thumb.href
        });
      }
      return Main.callbacks.push(Prefetch.node);
    },
    node: function(post) {
      var img;
      img = post.img;
      if (!img) {
        return;
      }
      return $.el('img', {
        src: img.parentNode.href
      });
    }
  };

  PngFix = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    node: function(post) {
      var img, png, src;
      img = post.img;
      if (post.el.hidden || !img) {
        return;
      }
      src = img.parentNode.href;
      if (/png$/.test(src) && !/spoiler/.test(img.src)) {
        png = $.el('img');
        $.on(png, 'load', function() {
          return img.src = src;
        });
        return png.src = src;
      }
    }
  };

  ImageExpand = {
    init: function() {
      Main.callbacks.push(this.node);
      return this.dialog();
    },
    node: function(post) {
      var a;
      if (!post.img) {
        return;
      }
      a = post.img.parentNode;
      $.on(a, 'click', ImageExpand.cb.toggle);
      if (ImageExpand.on && !post.el.hidden) {
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
    expand: function(thumb, url) {
      var a, img;
      if ($.x('ancestor-or-self::*[@hidden]', thumb)) {
        return;
      }
      thumb.hidden = true;
      $.addClass(thumb.parentNode.parentNode.parentNode.parentNode, 'image_expanded');
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
        innerHTML: "<div id=imgContainer><select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label>Expand Images<input type=checkbox id=imageExpand></label></div>"
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

  QR = {
    init: function() {
      var link;
      if (!$.id('postForm')) {
        return;
      }
      Main.callbacks.push(this.node);
      if (Conf['Hide Original Post Form'] || Conf['Style']) {
        if (!Conf['Style']) {
          link = $.el('h1', {
            innerHTML: "<a href=javascript:;>" + (g.REPLY ? 'Reply to Thread' : 'Start a Thread') + "</a>"
          });
          $.on(link.firstChild, 'click', function() {
            QR.open();
            if (!g.REPLY) {
              QR.threadSelector.value = 'new';
            }
            return $('textarea', QR.el).focus();
          });
          $.before($.id('postForm'), link);
        }
      }
      if (Conf['Persistent QR'] || Conf['Style']) {
        QR.dialog();
        if (Conf['Auto Hide QR'] && !Conf['Style']) {
          QR.hide();
        }
      }
      $.on(d, 'dragover', QR.dragOver);
      $.on(d, 'drop', QR.dropFile);
      return $.on(d, 'dragstart dragend', QR.drag);
    },
    node: function(post) {
      return $.on($('a[title="Quote this post"]', post.el), 'click', QR.quote);
    },
    open: function() {
      if (QR.el) {
        if (!Conf['Style']) {
          QR.el.hidden = false;
          return QR.unhide();
        } else {
          return QR.el.hidden = false;
        }
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
      return $.id('autohide').checked = true;
    },
    unhide: function() {
      $.rmClass(QR.el, 'autohide');
      return $.id('autohide').checked = false;
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
      if (QR.captchaIsEnabled && /captcha|verification/i.test(QR.warning.textContent)) {
        $('[autocomplete]', QR.el).focus();
      }
      if (d.hidden || d.oHidden || d.mozHidden || d.webkitHidden) {
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
            }
          })(),
          sage: g.BOARD === 'q' ? 600 : 60,
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
          type = isReply && cooldown.isReply ? isSage && cooldown.isSage ? 'sage' : hasFile && cooldown.hasFile ? 'file' : 'post' : !(isReply || cooldown.isReply) ? 'thread' : void 0;
          if (type) {
            elapsed = Math.floor((now - start) / 1000);
            seconds = Math.max(seconds, types[type] - elapsed);
            type = '';
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
      sel = window.getSelection();
      if ((s = sel.toString().trim()) && id === ((_ref = $.x('ancestor-or-self::blockquote', sel.anchorNode)) != null ? _ref.id.match(/\d+$/)[0] : void 0)) {
        if ($.engine === 'presto') {
          s = d.getSelection();
        }
        s = s.replace(/\n/g, '\n>');
        text += ">" + s + "\n";
      }
      ta = $('textarea', QR.el);
      caretPos = ta.selectionStart;
      ta.value = ta.value.slice(0, caretPos) + text + ta.value.slice(ta.selectionEnd);
      ta.focus();
      range = caretPos + text.length;
      if ($.engine === 'presto') {
        range += text.match(/\n/g).length;
      }
      ta.setSelectionRange(range, range);
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
        } else if (-1 === QR.mimeTypes.indexOf(file.type)) {
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
        } else if (-1 === QR.mimeTypes.indexOf(file.type)) {
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
      var clone, input, riceFile;
      input = $('[type=file]', QR.el);
      input.value = null;
      if (Conf['Style']) {
        riceFile = $('#file', QR.el);
        riceFile.textContent = null;
      }
      if ($.engine !== 'presto') {
        return;
      }
      clone = $.el('input', {
        type: 'file',
        accept: input.accept,
        max: input.max,
        multiple: input.multiple,
        size: input.size,
        title: input.title
      });
      $.on(clone, 'change', QR.fileInput);
      $.on(clone, 'click', function(e) {
        if (e.shiftKey) {
          return QR.selected.rmFile() || e.preventDefault();
        }
      });
      return $.replace(input, clone);
    },
    replies: [],
    reply: (function() {

      function _Class() {
        var persona, prev,
          _this = this;
        prev = QR.replies[QR.replies.length - 1];
        persona = $.get('QR.persona', {});
        this.name = prev ? prev.name : persona.name || null;
        this.email = prev && (Conf["Remember Sage"] || !/^sage$/.test(prev.email)) ? prev.email : persona.email || null;
        this.sub = prev && Conf['Remember Subject'] ? prev.sub : Conf['Remember Subject'] ? persona.sub : null;
        this.spoiler = prev && Conf['Remember Spoiler'] ? prev.spoiler : false;
        this.com = null;
        this.el = $.el('a', {
          className: 'thumbnail',
          draggable: true,
          href: 'javascript:;',
          innerHTML: '<a class=remove>X</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
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
        url = window.URL || window.webkitURL;
        if (typeof url.revokeObjectURL === "function") {
          url.revokeObjectURL(this.url);
        }
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
        var _base;
        QR.resetFileInput();
        delete this.file;
        this.el.title = null;
        this.el.style.backgroundImage = null;
        if (QR.spoiler) {
          $('label', this.el).hidden = true;
        }
        return typeof (_base = window.URL || window.webkitURL).revokeObjectURL === "function" ? _base.revokeObjectURL(this.url) : void 0;
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
        var index, _base;
        QR.resetFileInput();
        $.rm(this.el);
        index = QR.replies.indexOf(this);
        if (QR.replies.length === 1) {
          new QR.reply().select();
        } else if (this.el.id === 'selected') {
          (QR.replies[index - 1] || QR.replies[index + 1]).select();
        }
        QR.replies.splice(index, 1);
        return typeof (_base = window.URL || window.webkitURL).revokeObjectURL === "function" ? _base.revokeObjectURL(this.url) : void 0;
      };

      return _Class;

    })(),
    captcha: {
      init: function() {
        var _this = this;
        if (-1 !== d.cookie.indexOf('pass_enabled=')) {
          return;
        }
        if (!(QR.captchaIsEnabled = !!$.id('captchaFormPart'))) {
          return;
        }
        if ($.id('recaptcha_challenge_field_holder')) {
          return this.ready();
        } else {
          this.onready = function() {
            return _this.ready();
          };
          return $.on($.id('recaptcha_widget_div'), 'DOMNodeInserted', this.onready);
        }
      },
      ready: function() {
        var _this = this;
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
        $.on(this.challenge, 'DOMNodeInserted', function() {
          return _this.load();
        });
        if (Conf['Style']) {
          $.on(this.input, 'focus', function() {
            return QR.el.classList.add('focus');
          });
          $.on(this.input, 'blur', function() {
            return QR.el.classList.remove('focus');
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
        window.location = 'javascript:Recaptcha.reload("t")';
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
      var fileInput, id, mimeTypes, name, riceFile, spoiler, ta, thread, threads, _i, _j, _len, _len1, _ref, _ref1;
      if (!Conf['Style']) {
        QR.el = UI.dialog('qr', 'top:0;right:0;', '\
<div class=move>\
  Quick Reply <input type=checkbox id=autohide title=Auto-hide>\
  <span> <a class=close title=Close>×</a></span>\
</div>\
<form>\
  <div><input id=dump type=button title="Dump list" value=+ class=field><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>\
  <div id=replies><div><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>\
  <div class=textarea><textarea name=com title=Comment placeholder=Comment class=field></textarea><span id=charCount></span></div>\
  <div><input type=file title="Shift+Click to remove the selected file." multiple size=16><input type=submit></div>\
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image?</label>\
  <div class=warning></div>\
</form>');
      } else {
        QR.el = UI.dialog('qr', '', '\
<div id=qrtab>- Post Form -</div>\
<form>\
  <div class=warning></div>\
  <div><input id=dump type=button title="Dump list" value=+ class=field><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>\
  <div id=replies><div><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>\
  <div class=textarea><textarea name=com title=Comment placeholder=Comment class=field></textarea><span id=charCount></span></div>\
  <div><input type=file title="Shift+Click to remove the selected file." multiple size=16><div id=browse class=field>Browse...</div><div id=file class=field></div></div>\
  <div id=submit><input type=submit></div>\
  <div id=threadselect></div>\
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image?</label>\
</form>');
      }
      if (Conf['Remember QR size'] && $.engine === 'gecko') {
        $.on(ta = $('textarea', QR.el), 'mouseup', function() {
          return $.set('QR.size', this.style.cssText);
        });
        ta.style.cssText = $.get('QR.size', '');
      }
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
      fileInput = $('input[type=file]', QR.el);
      fileInput.max = $('input[name=MAX_FILE_SIZE]').value;
      if ($.engine !== 'presto') {
        fileInput.accept = mimeTypes;
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
        QR.threadSelector = $.el('select', {
          innerHTML: threads,
          title: 'Create a new thread / Reply to a thread'
        });
        if (Conf["Style"]) {
          $.prepend($('#threadselect', QR.el), QR.threadSelector);
        } else {
          $.prepend($('.move > span', QR.el), QR.threadSelector);
        }
        $.on(QR.threadSelector, 'mousedown', function(e) {
          return e.stopPropagation();
        });
      }
      if (Conf['Style']) {
        riceFile = $("#file", QR.el);
        $.on($("#browse", QR.el), 'click', function() {
          return fileInput.click();
        });
        $.on(riceFile, 'click', function(e) {
          if (e.shiftKey) {
            return QR.selected.rmFile() || e.preventDefault();
          } else {
            return fileInput.click();
          }
        });
        $.on(fileInput, 'change', function() {
          return riceFile.textContent = fileInput.value;
        });
      } else {
        $.on($('#autohide', QR.el), 'change', QR.toggleHide);
        $.on($('.close', QR.el), 'click', QR.close);
      }
      $.on($('#dump', QR.el), 'click', function() {
        return QR.el.classList.toggle('dump');
      });
      $.on($('#addReply', QR.el), 'click', function() {
        return new QR.reply().select();
      });
      $.on($('form', QR.el), 'submit', QR.submit);
      $.on(ta, 'input', function() {
        return QR.selected.el.lastChild.textContent = this.value;
      });
      $.on(ta, 'input', QR.characterCount);
      $.on(fileInput, 'change', QR.fileInput);
      $.on(fileInput, 'click', function(e) {
        if (e.shiftKey) {
          return QR.selected.rmFile() || e.preventDefault();
        }
      });
      $.on(spoiler.firstChild, 'change', function() {
        return $('input', QR.selected.el).click();
      });
      $.on(QR.warning, 'click', QR.cleanError);
      new QR.reply().select();
      _ref1 = ['name', 'email', 'sub', 'com'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        if (Conf['Style']) {
          $.on($("[name=" + name + "]", QR.el), 'focus', function() {
            return QR.el.classList.add('focus');
          });
          $.on($("[name=" + name + "]", QR.el), 'blur', function() {
            return QR.el.classList.remove('focus');
          });
        }
        $.on($("[name=" + name + "]", QR.el), 'input', function() {
          var _ref2;
          QR.selected[this.name] = this.value;
          if (QR.cooldown.auto && QR.selected === QR.replies[0] && (0 < (_ref2 = QR.cooldown.seconds) && _ref2 <= 5)) {
            return QR.cooldown.auto = false;
          }
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
      var callbacks, captcha, captchas, challenge, err, m, opts, post, reply, response, textOnly, threadID, _ref;
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
      threadID = g.THREAD_ID || QR.threadSelector.value;
      if (threadID === 'new') {
        if (((_ref = g.BOARD) === 'vg' || _ref === 'q') && !reply.sub) {
          err = 'New threads require a subject.';
        } else if (!(reply.file || (textOnly = !!$('input[name=textonly]', $.id('postForm'))))) {
          err = 'No file selected.';
        }
      } else {
        if (!(reply.com || reply.file)) {
          err = 'No file selected.';
        }
      }
      if (QR.captchaIsEnabled && !err) {
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
      if (Conf['Auto Hide QR'] && !QR.cooldown.auto && !Conf['Style']) {
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
          return QR.error($.el('a', {
            href: '//www.4chan.org/banned',
            target: '_blank',
            textContent: 'Connection error, or you are banned.'
          }));
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
      var bs, doc, err, msg, persona, postID, reply, threadID, _, _ref, _ref1;
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      if (doc.title === '4chan - Banned') {
        bs = $$('b', doc);
        err = $.el('span', {
          innerHTML: /^You were issued a warning/.test($('.boxcontent', doc).textContent.trim()) ? "You were issued a warning on " + bs[0].innerHTML + " as " + bs[3].innerHTML + ".<br>Warning reason: " + bs[1].innerHTML : "You are banned! ;_;<br>Please click <a href=//www.4chan.org/banned target=_blank>HERE</a> to see the reason."
        });
      } else if (err = doc.getElementById('errmsg')) {
        if ((_ref = $('a', err)) != null) {
          _ref.target = '_blank';
        }
      } else if (!(msg = $('b', doc))) {
        err = 'Connection error with sys.4chan.org.';
      }
      if (err) {
        if (/captcha|verification/i.test(err.textContent) || err === 'Connection error with sys.4chan.org.') {
          if (/mistyped/i.test(err.textContent)) {
            err.textContent = 'Error: You seem to have mistyped the CAPTCHA.';
          }
          QR.cooldown.auto = QR.captchaIsEnabled ? !!$.get('captchas', []).length : true;
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
      persona = $.get('QR.persona', {});
      persona = {
        name: reply.name,
        email: !Conf["Remember Sage"] && /^sage$/.test(reply.email) ? /^sage$/.test(persona.email) ? null : persona.email : reply.email,
        sub: Conf['Remember Subject'] ? reply.sub : null
      };
      $.set('QR.persona', persona);
      _ref1 = msg.lastChild.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref1[0], threadID = _ref1[1], postID = _ref1[2];
      $.event(QR.el, new CustomEvent('QRPostSuccessful', {
        bubbles: true,
        detail: {
          threadID: threadID,
          postID: postID
        }
      }));
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
      if (Conf['Persistent QR'] || QR.cooldown.auto || Conf['Style']) {
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

  /*
    ThemeTools.color adapted from 4chan Style Script
  */


  ThemeTools = {
    init: function(key) {
      var dialog, div, fileInput, header, input, item, layout, themecontent, _i, _j, _len, _len1, _ref;
      if (!Conf["Style"]) {
        alert("Please enable Style Options and reload the page to use Theme Tools.");
        return;
      }
      editMode = "theme";
      if (newTheme) {
        editTheme = {};
        editTheme["Theme"] = "Untitled";
        editTheme["Author"] = "Author";
        editTheme["Author Tripcode"] = "Unknown";
      } else {
        editTheme = JSON.parse(JSON.stringify(userThemes[key]));
        editTheme["Theme"] = key;
      }
      layout = ["Background Image", "Background Attachment", "Background Position", "Background Repeat", "Background Color", "Thread Wrapper Background", "Thread Wrapper Border", "Dialog Background", "Dialog Border", "Reply Background", "Reply Border", "Highlighted Reply Background", "Highlighted Reply Border", "Backlinked Reply Outline", "Input Background", "Input Border", "Hovered Input Background", "Hovered Input Border", "Focused Input Background", "Focused Input Border", "Checkbox Background", "Checkbox Border", "Checkbox Checked Background", "Buttons Background", "Buttons Border", "Navigation Background", "Navigation Border", "Links", "Hovered Links", "Quotelinks", "Backlinks", "Navigation Links", "Hovered Navigation Links", "Names", "Tripcodes", "Emails", "Subjects", "Text", "Inputs", "Post Numbers", "Greentext", "Sage", "Board Title", "Timestamps", "Warnings", "Shadow Color"];
      dialog = $.el("div", {
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
      $.add($("#themebar", dialog), header);
      themecontent = $("#themecontent", dialog);
      for (_j = 0, _len1 = layout.length; _j < _len1; _j++) {
        item = layout[_j];
        if (newTheme) {
          editTheme[item] = '';
        }
        div = $.el("div", {
          className: "themevar",
          innerHTML: "<div class=optionname><b>" + item + "</b></div><div class=option><input class=field name='" + item + "' placeholder='" + (item === "Background Image" ? "Shift+Click to upload image" : item) + "' value='" + editTheme[item] + "'>"
        });
        input = $('input', div);
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
          editTheme[this.name] = this.value;
          return Style.addStyle(editTheme);
        });
        if (item === "Background Image") {
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
        }
        $.add(themecontent, div);
      }
      div = $.el("div", {
        className: "themevar",
        innerHTML: "<div class=optionname><label><input type=checkbox name='Dark Theme' " + (editTheme['Dark Theme'] ? 'checked' : '') + "><b>Dark Theme?</b></label></div>"
      });
      $.on($('input', div), 'click', function() {
        editTheme[this.name] = this.checked;
        return Style.addStyle(editTheme);
      });
      $.add(themecontent, div);
      if (newTheme) {
        editTheme["Custom CSS"] = "";
      }
      div = $.el("div", {
        className: "themevar",
        innerHTML: "<div class=optionname><b>Custom CSS</b></div><div class=option><textarea name='Custom CSS' placeholder='Custom CSS' style='height: 100px;'>" + editTheme['Custom CSS'] + "</textarea>"
      });
      $.on($('textarea', div), 'blur', function() {
        editTheme["Custom CSS"] = this.value;
        return Style.addStyle(editTheme);
      });
      $.add(themecontent, div);
      $.on($('#save > a', dialog), 'click', function() {
        return ThemeTools.save(editTheme);
      });
      $.on($('#close > a', dialog), 'click', ThemeTools.close);
      $.add(d.body, dialog);
      return Style.addStyle(editTheme);
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
        return Style.addStyle(editTheme);
      };
      return reader.readAsDataURL(file);
    },
    color: function(hex) {
      this.hex = "#" + hex;
      this.calc_rgb = function(hex) {
        var rgb;
        rgb = [];
        hex = parseInt(hex, 16);
        rgb[0] = (hex >> 16) & 0xFF;
        rgb[1] = (hex >> 8) & 0xFF;
        rgb[2] = hex & 0xFF;
        return rgb;
      };
      this.private_rgb = this.calc_rgb(hex);
      this.rgb = this.private_rgb.join(",");
      this.isLight = function(rgb) {
        return rgb[0] + rgb[1] + rgb[2] >= 400;
      };
      this.shiftRGB = function(shift, smart) {
        var rgb;
        rgb = this.private_rgb.slice(0);
        shift = smart ? this.isLight ? shift < 0 ? shift : -shift : Math.abs(shift) : shift;
        rgb[0] = Math.min(Math.max(rgb[0] + shift, 0), 255);
        rgb[1] = Math.min(Math.max(rgb[1] + shift, 0), 255);
        rgb[2] = Math.min(Math.max(rgb[2] + shift, 0), 255);
        return rgb.join(",");
      };
      return this.hover = this.shiftRGB(16, true);
    },
    importtheme: function(origin, evt) {
      var file, reader;
      file = evt.target.files[0];
      reader = new FileReader();
      reader.onload = function(e) {
        var bgColor, bgRPA, blinkColor, brderColor, imported, inputColor, inputbColor, jlinkColor, linkColor, linkHColor, mainColor, name, nameColor, quoteColor, sageColor, textColor, timeColor, titleColor, tripColor;
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
        if (userThemes[name] && !userThemes[name]["Deleted"]) {
          if (confirm("A theme with this name already exists. Would you like to over-write?")) {
            delete userThemes[name];
          } else {
            return;
          }
        }
        if (origin === "oneechan" || origin === "SS") {
          bgColor = new ThemeTools.color(imported.bgColor);
          mainColor = new ThemeTools.color(imported.mainColor);
          brderColor = new ThemeTools.color(imported.brderColor);
          inputColor = new ThemeTools.color(imported.inputColor);
          inputbColor = new ThemeTools.color(imported.inputbColor);
          blinkColor = new ThemeTools.color(imported.blinkColor);
          jlinkColor = new ThemeTools.color(imported.jlinkColor);
          linkColor = new ThemeTools.color(imported.linkColor);
          linkHColor = new ThemeTools.color(imported.linkHColor);
          nameColor = new ThemeTools.color(imported.nameColor);
          quoteColor = new ThemeTools.color(imported.quoteColor);
          sageColor = new ThemeTools.color(imported.sageColor);
          textColor = new ThemeTools.color(imported.textColor);
          titleColor = new ThemeTools.color(imported.titleColor);
          tripColor = new ThemeTools.color(imported.tripColor);
          timeColor = new ThemeTools.color(imported.timeColor || imported.textColor);
          if (imported.bgRPA) {
            bgRPA = imported.bgRPA.split(' ');
          } else {
            bgRPA = ['no-repeat', 'bottom', 'left', 'fixed'];
          }
          if (origin === "oneechan") {
            userThemes[name] = {
              'Author': "Author",
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
              'Shadow Color': 'rgba(' + mainColor.shiftRGB(16) + ',.9)',
              'Dark Theme': mainColor.isLight ? false : true,
              'Custom CSS': ".rice {\n  box-shadow:rgba(" + mainColor.shiftRGB(32) + ",.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}" + (imported.customCSS || '')
            };
          } else if (origin === "SS") {
            userThemes[name] = {
              'Author': "Author",
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
              'Shadow Color': 'rgba(' + mainColor.shiftRGB(16) + ',.9)',
              'Dark Theme': mainColor.isLight ? false : true,
              'Custom CSS': "#delform {\n  padding: 1px 2px;\n}\n.rice {\n  box-shadow:rgba(" + mainColor.shiftRGB(32) + ",.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not[type=checkbox]:hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput:not(.jsColor),\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}" + (imported.customCSS || '')
            };
          }
        } else if (origin === 'appchan') {
          userThemes[name] = imported;
        }
        $.set('userThemes', userThemes);
        alert("Theme \"" + name + "\" imported!");
        $.rm($("#themes", d.body));
        return Options.themeTab();
      };
      return reader.readAsText(file);
    },
    save: function(theme) {
      var name;
      name = theme["Theme"];
      delete theme["Theme"];
      if (userThemes[name] && !userThemes[name]["Deleted"]) {
        if (confirm("A theme with this name already exists. Would you like to over-write?")) {
          delete userThemes[name];
        } else {
          return;
        }
      }
      theme["Customized"] = true;
      userThemes[name] = theme;
      $.set('userThemes', userThemes);
      $.set("Style", name);
      Conf["Style"] = name;
      return alert("Theme \"" + name + "\" saved.");
    },
    close: function() {
      newTheme = false;
      editMode = false;
      $.rm($("#themeConf", d.body));
      Style.addStyle(Conf["Style"]);
      return Options.dialog("theme");
    }
  };

  MascotTools = {
    init: function() {
      var location, mascot, names, position, result;
      if (Conf['Mascot Position'] === 'bottom') {
        position = 0;
      } else {
        position = 248;
      }
      if (!editMode) {
        names = [];
        if (!(Conf["mascot"] = Conf[g.MASCOTSTRING][Math.floor(Math.random() * Conf[g.MASCOTSTRING].length)])) {
          return;
        }
        mascot = userMascots[Conf["mascot"]];
        this.addMascot(mascot);
      } else {
        if (!(mascot = editMascot || (mascot = userMascots[Conf["mascot"]]))) {
          return;
        }
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
      result = "#mascot img {\n  position: fixed;\n  z-index: " + (Conf['Mascots Overlap Posts'] ? '3' : '-1') + ";\nbottom:  " + (mascot.position === 'bottom' ? (mascot.vOffset || 0) + 0 + "px" : mascot.position === 'top' ? "auto" : ((mascot.vOffset || 0) + position) + "px") + ";" + location + ": " + ((mascot.hOffset || 0) + (Conf['Sidebar'] === 'large' && mascot.center ? 25 : 0)) + "px;\ntop:     " + (mascot.position === 'top' ? (mascot.vOffset || 0) + "px" : 'auto') + ";\nheight:  " + (mascot.height && isNaN(parseFloat(mascot.height)) ? mascot.height : mascot.height ? parseInt(mascot.height) + "px" : "auto") + ";\nwidth:   " + (mascot.width && isNaN(parseFloat(mascot.width)) ? mascot.width : mascot.width ? parseInt(mascot.width) + "px" : "auto") + ";;\npointer-events: none;\n}";
      return result;
    },
    dialog: function(key) {
      var dialog, div, fileInput, input, item, layout, name, option, optionHTML, value, _i, _len, _ref;
      editMode = "mascot";
      if (userMascots[key]) {
        editMascot = JSON.parse(JSON.stringify(userMascots[key]));
      } else {
        editMascot = {};
      }
      editMascot.name = key || '';
      MascotTools.addMascot(editMascot);
      Style.addStyle(Conf["theme"]);
      layout = {
        name: ["Mascot Name", "", "The name of the Mascot", "text"],
        image: ["Image", "", "Image of Mascot. Accepts Base64 as well as URLs. Shift+Click field to upload.", "text"],
        position: ["Position", "default", "Where the mascot is anchored in the Sidebar. The default option places the mascot above the Post Form or on the bottom of the page, depending on the Post Form setting.", "select", ["default", "top", "bottom"]],
        height: ["Height", "auto", "This value is used for manually setting a height for the mascot.", "text"],
        width: ["Width", "auto", "This value is used for manually setting a width for the mascot.", "text"],
        vOffset: ["Vertical Offset", "0", "This value moves the mascot vertically away from the anchor point, in pixels (the post form is exactly \"248\" pixels tall if you'd like to force the mascot to sit above it).", "number"],
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
                return Style.addStyle(Conf["theme"]);
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
            } else {
              $.on(input, 'blur', function() {
                editMascot[this.name] = this.value;
                return Style.addStyle(Conf["theme"]);
              });
            }
            break;
          case "number":
            div = this.input(item, name);
            $.on($('input', div), 'blur', function() {
              editMascot[this.name] = parseInt(this.value);
              return Style.addStyle(Conf["theme"]);
            });
            break;
          case "select":
            optionHTML = "<h2>" + item[0] + "</h2><span class=description>" + item[2] + "</span><div class=option><select name='" + name + "'><br>";
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
            $.on($('select', div), 'change', function() {
              editMascot[this.name] = this.value;
              return Style.addStyle(Conf["theme"]);
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
              return Style.addStyle(Conf["theme"]);
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
        if (Conf["Style"] && userThemes[Conf['theme']]['Dark Theme']) {
          value = editMascot[name][0];
        } else {
          value = editMascot[name][1];
        }
      } else {
        value = editMascot[name] || item[1];
      }
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
        return Style.addStyle(Conf["theme"]);
      };
      return reader.readAsDataURL(file);
    },
    addMascot: function(mascot) {
      var div, el;
      el = $('#mascot', d.body);
      if (el) {
        $.rm(el);
      }
      div = $.el('div', {
        id: "mascot",
        innerHTML: "<img src='" + (Array.isArray(mascot.image) ? (Conf["Style"] && userThemes[Conf['theme']]['Dark Theme'] ? mascot.image[0] : mascot.image[1]) : mascot.image) + "'>"
      });
      return $.ready(function() {
        return $.add(d.body, div);
      });
    },
    save: function(mascot) {
      var aname, type, _i, _len, _ref;
      if (typeof (aname = mascot.name) === "undefined" || aname === "") {
        alert("Please name your mascot.");
        return;
      }
      delete mascot.name;
      if (userMascots[aname] && !Conf["Deleted Mascots"].remove(aname)) {
        if (confirm("A mascot named \"" + aname + "\" already exists. Would you like to over-write?")) {
          delete userMascots[aname];
        } else {
          alert("Creation of \"" + aname + "\" aborted.");
          return;
        }
      }
      _ref = ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        if (!Conf[type].contains(aname)) {
          Conf[type].push(aname);
        }
        $.set(type, Conf[type]);
      }
      mascot["Customized"] = true;
      userMascots[aname] = mascot;
      Conf["mascot"] = aname;
      $.set('userMascots', userMascots);
      return alert("Mascot \"" + aname + "\" saved.");
    },
    close: function() {
      editMode = false;
      editMascot = {};
      $.rm($("#mascotConf", d.body));
      Style.addStyle(Conf["Style"]);
      return Options.dialog("mascot");
    },
    importMascot: function(evt) {
      var file, reader;
      file = evt.target.files[0];
      reader = new FileReader();
      reader.onload = function(e) {
        var imported, name;
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
        if (userMascots[name] && !Conf["Deleted Mascots"].remove(name)) {
          if (!confirm("A mascot with this name already exists. Would you like to over-write?")) {
            return;
          }
        }
        userMascots[name] = imported;
        $.set('userMascots', userMascots);
        alert("Mascot \"" + name + "\" imported!");
        $.rm($("#mascotContainer", d.body));
        return Options.mascotTab();
      };
      return reader.readAsText(file);
    }
  };

  CustomNavigation = {
    init: function() {
      var a, link, navigation, node, nodes, _i, _j, _len, _len1, _ref, _results;
      navigation = $("#boardNavDesktop", d.body);
      nodes = (function() {
        var _i, _len, _ref, _results;
        _ref = navigation.childNodes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          if (node.id !== "navtopright") {
            _results.push(node);
          } else {
            continue;
          }
        }
        return _results;
      })();
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        $.rm(node);
      }
      $.add(navigation, $.tn(" " + userNavigation.delimiter + " "));
      _ref = userNavigation.links;
      _results = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        link = _ref[_j];
        a = $.el('a', {
          textContent: link[0],
          title: link[1],
          href: link[2]
        });
        $.add(navigation, a);
        _results.push($.add(navigation, $.tn(" " + userNavigation.delimiter + " ")));
      }
      return _results;
    }
  };

  Linkify = {
    init: function() {
      return Main.callbacks.push(this.node);
    },
    regString: ['(', '\\b(', '[a-z][-a-z0-9+.]+://', '|', 'www\\.', '|', 'magnet:', '|', 'mailto:', '|', 'news:', ')', '[^\\s\'"<>()]+', '|', '\\b[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}\\b', ')'].join(""),
    embedRegExp: /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|youtube.*\&v=)([^#\&\?]*).*/,
    node: function(post) {
      var child, comment, node, nodes, subject, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _results;
      nodes = [];
      comment = post.blockquote || $('blockquote', post.el);
      subject = $('.subject', post.el);
      _ref = comment.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.nodeType === Node.TEXT_NODE) {
          nodes.push(child);
        } else if (child.className === "quote") {
          _ref1 = child.childNodes;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            node = _ref1[_j];
            if (node.nodeType === Node.TEXT_NODE) {
              nodes.push(node);
            }
          }
        }
      }
      if (subject != null) {
        _ref2 = subject.childNodes;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          child = _ref2[_k];
          if (child.nodeType === Node.TEXT_NODE) {
            nodes.push(child);
          }
        }
      }
      _results = [];
      for (_l = 0, _len3 = nodes.length; _l < _len3; _l++) {
        node = nodes[_l];
        _results.push(Linkify.text(node));
      }
      return _results;
    },
    text: function(child, link) {
      var a, embed, l, lLen, m, match, node, p, rest, txt, urlRegExp;
      txt = child.textContent;
      p = 0;
      urlRegExp = new RegExp(Linkify.regString, 'i');
      if (m = urlRegExp.exec(txt)) {
        l = m[0].replace(/\.*$/, '');
        lLen = l.length;
        node = $.tn(txt.substring(p, m.index));
        if (link) {
          $.replace(link, node);
        } else {
          $.replace(child, node);
        }
        a = $.el('a', {
          textContent: l,
          className: 'linkify',
          rel: 'nofollow noreferrer',
          target: 'blank',
          href: l.indexOf(":") < 0 ? (l.indexOf("@") > 0 ? "mailto:" + l : "http://" + l) : l
        });
        $.on(a, 'click', function(e) {
          if (e.shiftKey && e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            if ("br" === this.nextSibling.tagName.toLowerCase() && this.nextSibling.nextSibling.className !== "abbr") {
              $.rm(this.nextSibling);
              child = $.tn(this.textContent + this.nextSibling.textContent);
              $.rm(this.nextSibling);
              return Linkify.text(child, this);
            }
          }
        });
        $.after(node, a);
        if (Conf['Youtube Embed'] && (match = a.href.match(Linkify.embedRegExp))) {
          embed = $.el('a', {
            name: match[1],
            className: 'embedlink',
            href: 'javascript:;',
            textContent: '(embed)'
          });
          $.on(embed, 'click', Linkify.embed);
          $.after(a, embed);
          $.after(a, $.tn(' '));
        }
        p = m.index + lLen;
        rest = $.tn(txt.substring(p, txt.length));
        if (rest.textContent !== "") {
          $.after(a, rest);
          return this.text(rest);
        }
      }
    },
    embed: function() {
      var iframe, link;
      link = this.previousSibling.previousSibling;
      iframe = $.el('iframe', {
        src: 'http://www.youtube.com/embed/' + this.name
      });
      iframe.style.border = '0';
      iframe.style.width = '640px';
      iframe.style.height = '390px';
      $.replace(link, iframe);
      $.rm(this.previousSibling);
      return $.rm(this);
    }
  };

  Style = {
    init: function() {
      this.addStyle();
      if (Conf["Style"]) {
        return $.ready(this.banner);
      }
    },
    emoji: function(position) {
      var css, image, item, name, _i, _len;
      css = '';
      for (_i = 0, _len = Emoji.length; _i < _len; _i++) {
        item = Emoji[_i];
        if (!(Conf['Emoji'] === "disable ponies" && item[2] === "pony")) {
          name = item[0];
          image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA' + item[1];
          css = css + '\
a.useremail[href*="' + name + '"]:last-of-type::' + position + ',\
a.useremail[href*="' + name.toLowerCase() + '"]:last-of-type::' + position + ',\
a.useremail[href*="' + name.toUpperCase() + '"]:last-of-type::' + position + ' {\
  content: url("' + image + '") " ";\
}\
';
        }
      }
      return css;
    },
    rice: function(source) {
      var checkbox, checkboxes, div, _i, _len, _results;
      checkboxes = $$('[type=checkbox]:not(.riced)', source);
      _results = [];
      for (_i = 0, _len = checkboxes.length; _i < _len; _i++) {
        checkbox = checkboxes[_i];
        $.addClass(checkbox, 'riced');
        div = $.el('div', {
          className: 'rice'
        });
        $.after(checkbox, div);
        if (div.parentElement.tagName.toLowerCase() !== 'label') {
          _results.push($.on(div, 'click', function() {
            return checkbox.click();
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    agent: function() {
      switch ($.engine) {
        case 'gecko':
          return '-moz-';
        case 'webkit':
          return '-webkit-';
        case 'presto':
          return '-o-';
      }
    },
    addStyle: function(theme) {
      var el;
      if (!styleInit) {
        $.off(d, 'DOMNodeInserted', Style.addStyle);
        if (d.head) {
          styleInit = true;
          return $.addStyle(Style.css(userThemes[Conf['theme']]), 'appchan');
        } else {
          return $.on(d, 'DOMNodeInserted', Style.addStyle);
        }
      } else {
        if (!theme || !theme.Author) {
          theme = userThemes[Conf['theme']];
          if (el = $('#mascot', d.body)) {
            $.rm(el);
          }
          $.rm($.id('appchan'));
          return $.addStyle(Style.css(theme), 'appchan');
        }
      }
    },
    banner: function() {
      var banner, child, children, title;
      banner = $(".boardBanner", d.body);
      title = $.el("div", {
        id: "boardTitle"
      });
      children = (function() {
        var _i, _len, _ref, _results;
        _ref = banner.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (child.tagName === "IMG") {
            continue;
          }
          _results.push(child);
        }
        return _results;
      })();
      $.add(title, children);
      return $.after(banner, title);
    },
    remStyle: function() {
      var node, nodes, _i, _j, _len, _len1, _ref, _results;
      $.off(d, 'DOMNodeInserted', this.remStyle);
      if (!remInit) {
        if (d.head && d.head.children.length > 10) {
          remInit = true;
          nodes = [];
          _ref = d.head.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            if (node.rel === 'stylesheet') {
              nodes.push(node);
            } else if (node.tagName === 'STYLE' && node.id !== 'appchan') {
              nodes.push(node);
              break;
            } else {
              continue;
            }
          }
          _results = [];
          for (_j = 0, _len1 = nodes.length; _j < _len1; _j++) {
            node = nodes[_j];
            _results.push($.rm(node));
          }
          return _results;
        } else {
          return $.on(d, 'DOMNodeInserted', this.remStyle);
        }
      }
    },
    trimGlobalMessage: function() {
      var child, el, _i, _len, _ref, _results;
      if (el = $("#globalMessage", d.body)) {
        _ref = el.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(child.style.color = "");
        }
        return _results;
      }
    },
    css: function(theme) {
      var agent, css, logoOffset, pagemargin, sidebarLocation, sidebarOffsetH, sidebarOffsetW, statOffset, updaterOffset;
      agent = Style.agent();
      css = "/* dialog styling */\n.dialog.reply {\n  display: block;\n  border: 1px solid rgba(0,0,0,.25);\n  padding: 0;\n}\n.move {\n  cursor: move;\n}\nlabel,\n.favicon {\n  cursor: pointer;\n}\na[href=\"javascript:;\"] {\n  text-decoration: none;\n}\n.warning,\n.disabledwarning {\n  color: red;\n}\n.hide_thread_button:not(.hidden_thread) {\n  float: left;\n}\n.thread > .hidden_thread ~ *,\n[hidden],\n#content > [name=tab]:not(:checked) + div,\n#updater:not(:hover) > :not(.move),\n.autohide:not(:hover) > form,\n#qp input,\n.forwarded,\n#qp .rice {\n  display: none !important;\n}\n.menu_button {\n  display: inline-block;\n}\n.menu_button > span {\n  border-top:   .5em solid;\n  border-right: .3em solid transparent;\n  border-left:  .3em solid transparent;\n  display: inline-block;\n  margin: 2px;\n  vertical-align: middle;\n}\n#menu {\n  position: absolute;\n  outline: none;\n}\n.entry {\n  border-bottom: 1px solid rgba(0,0,0,.25);\n  cursor: pointer;\n  display: block;\n  outline: none;\n  padding: 3px 7px;\n  position: relative;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.entry:last-child {\n  border: none;\n}\n.focused.entry {\n  background: rgba(255,255,255,.33);\n}\n.entry.hasSubMenu {\n  padding-right: 1.5em;\n}\n.hasSubMenu::after {\n  content: \"\";\n  border-left: .5em solid;\n  border-top: .3em solid transparent;\n  border-bottom: .3em solid transparent;\n  display: inline-block;\n  margin: .3em;\n  position: absolute;\n  right: 3px;\n}\n.hasSubMenu:not(.focused) > .subMenu {\n  display: none;\n}\n.subMenu {\n  position: absolute;\n  left: 100%;\n  top: 0;\n  margin-top: -1px;\n}\nh1,\n#boardTitle {\n  text-align: center;\n}\n#qr > .move {\n  min-width: 300px;\n  overflow: hidden;\n  box-sizing: border-box;" + agent + "box-sizing: border-box;\npadding: 0 2px;\n}\n#qr > .move > span {\nfloat: right;\n}\n#autohide,\n.close,\n#qr select,\n#dump,\n.remove,\n.captchaimg,\n#qr div.warning {\ncursor: pointer;\n}\n#qr select,\n#qr > form {\nmargin: 0;\n}\n#dump {\nbackground: " + agent + "linear-gradient(#EEE, #CCC);\nwidth: 10%;\n}\n.gecko #dump {\npadding: 1px 0 2px;\n}\n#dump:hover,\n#dump:focus {\nbackground: " + agent + "linear-gradient(#FFF, #DDD);\n}\n#dump:active,\n.dump #dump:not(:hover):not(:focus) {\n  background: " + agent + "linear-gradient(#CCC, #DDD);\n}\n#qr:not(.dump) #replies,\n.dump > form > label {\n  display: none;\n}\n#replies {\n  display: block;\n  height: 100px;\n  position: relative;" + agent + "user-select: none;\nuser-select: none;\n}\n#replies > div {\ncounter-reset: thumbnails;\ntop: 0; right: 0; bottom: 0; left: 0;\nmargin: 0; padding: 0;\noverflow: hidden;\nposition: absolute;\nwhite-space: pre;\n}\n#replies > div:hover {\nbottom: -10px;\noverflow-x: auto;\nz-index: 1;\n}\n.thumbnail {\nbackground-color: rgba(0,0,0,.2) !important;\nbackground-position: 50% 20% !important;\nbackground-size: cover !important;\nborder: 1px solid #666;\nbox-sizing: border-box;" + agent + "box-sizing: border-box;\ncursor: move;\ndisplay: inline-block;\nheight: 90px; width: 90px;\nmargin: 5px; padding: 2px;\nopacity: .5;\noutline: none;\noverflow: hidden;\nposition: relative;\ntext-shadow: 0 1px 1px #000;" + agent + "transition: opacity .25s ease-in-out;\nvertical-align: top;\n}\n.thumbnail:hover,\n.thumbnail:focus {\nopacity: .9;\n}\n.thumbnail#selected {\nopacity: 1;\n}\n.thumbnail::before {\ncounter-increment: thumbnails;\ncontent: counter(thumbnails);\ncolor: #FFF;\nfont-weight: 700;\npadding: 3px;\nposition: absolute;\ntop: 0;\nright: 0;\ntext-shadow: 0 0 3px #000, 0 0 8px #000;\n}\n.thumbnail.drag {\nbox-shadow: 0 0 10px rgba(0,0,0,.5);\n}\n.thumbnail.over {\nborder-color: #FFF;\n}\n.thumbnail > span {\ncolor: #FFF;\n}\n.remove {\nbackground: none;\ncolor: #E00;\nfont-weight: 700;\npadding: 3px;\n}\n.remove:hover::after {\ncontent: \" Remove\";\n}\n.thumbnail > label {\nbackground: rgba(0,0,0,.5);\ncolor: #FFF;\nright: 0; bottom: 0; left: 0;\nposition: absolute;\ntext-align: center;\n}\n.thumbnail > label > input {\nmargin: 0;\n}\n#addReply {\ncolor: #333;\nfont-size: 3.5em;\nline-height: 100px;\n}\n#addReply:hover,\n#addReply:focus {\ncolor: #000;\n}\n.field {\nborder: 1px solid #CCC;\ncolor: #333;\nfont-size: 13px;\nmargin: 0;\npadding: 2px 4px 3px;" + agent + "transition: color .25s, border .25s;\n}\n.field:-moz-placeholder,\n.field:hover:-moz-placeholder {\n  color: #AAA;\n}\n.field:hover,\n.field:focus {\n  border-color: #999;\n  color: #000;\n  outline: none;\n}\n#charCount {\n  color: #000;\n  background: hsla(0, 0%, 100%, .5);\n  position: absolute;\n  margin: 1px;\n  font-size: 8pt;\n  right: 0;\n  top: 100%;\n  bottom: 0;\n  pointer-events: none;\n}\n#charCount.warning {\n  color: red;\n}\n.fileText:hover .fntrunc,\n.fileText:not(:hover) .fnfull {\n  display: none;\n}\n.fitwidth img[data-md5] + img {\n  max-width: 100%;\n}\n.gecko  .fitwidth img[data-md5] + img,\n.presto .fitwidth img[data-md5] + img {\n  width: 100%;\n}\n#qr,\n#qp,\n#updater,\n#stats,\n#ihover,\n#overlay,\n#navlinks {\n  position: fixed;\n}\n#ihover {\n  max-height: 97%;\n  max-width: 75%;\n  padding-bottom: 18px;\n}\n#navlinks {\n  font-size: 16px;\n  top: 25px;\n  right: 5px;\n}\n#overlay {\n  top: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0,0,0,.5);\n  z-index: 1;\n}\n#options {\n  z-index: 2;\n  position: fixed;\n  display: inline-block;\n  padding: 5px;\n  text-align: left;\n  vertical-align: middle;\n  left: 5%;\n  right: 5%;\n  top: 10%;\n  bottom: 10%;\n}\n#options #style_tab + div select {\n  width: 100%;\n}\n#theme_tab + div div:not(.selectedtheme) > div > h1 {\n  color: transparent !important;\n}\n#theme_tab + div div.selectedtheme h1 {\n  right: 11px;\n}\n#theme_tab + div > div h1 {\n  position: absolute;\n  right: 300px;\n  bottom: 10px;\n  margin: 0;" + agent + "transition: all .2s ease-in-out;\n}\n#theme_tab + div > div {\n  margin-bottom: 3px;\n}\n#credits {\n  float: right;\n}\n#options ul {\n  padding: 0;\n}\n#options ul li {\n  overflow: auto;\n  padding: 0 5px 0 7px;\n}\n#options .optionlabel {\n  text-decoration: underline;\n}\n#options input:checked + .optionlabel,\n#options input:checked + .rice + .optionlabel {\n  font-weight: 800;\n}\n#options input:not[type=checkbox] {\n  float: right;\n  clear: left;\n}\n#options #rice_tab + div input {\n  float: none;\n  clear: none;\n  margin: 1px;\n}\n#options article li {\n  margin: 10px 0 10px 2em;\n}\n#options code {\n  background: hsla(0, 0%, 100%, .5);\n  color: #000;\n  padding: 0 1px;\n}\n#options label {\n  text-decoration: underline;\n}\n#options .styleoption label {\n  text-decoration: none;\n}\n#options .option {\n  width: 50%;\n  display: inline-block;\n}\n#options .option .optionlabel {\n  padding-left: 18px;\n}\n#options .styleoption {\n  padding: 1px 5px 1px 7px;\n}\n#options .mascots {\n  text-align: center;\n  padding: 0;\n}\n#options .mascot {\n  display: inline;\n  padding: 0;\n  position: relative;\n}\n#options .mascot > div:first-child {\n  border: 2px solid rgba(0,0,0,0);\n  width: 200px;\n  height: 250px;\n  display: inline-block;\n  margin: 5px;\n  cursor: pointer;\n  background-position: top center;\n  background-repeat: no-repeat;\n  background-size: 200px auto;\n  text-align: center;\n}\n#options .mascot div.enabled {\n  border: 2px solid rgba(0,0,0,0.5);\n  background-color: rgba(255,255,255,0.1);\n}\n#mascotConf {\n  position: fixed;\n  height: 400px;\n  bottom: 0;\n  left: 50%;\n  width: 500px;\n  margin-left: -250px;\n  overflow: auto;\n}\n#mascotConf input,\n#mascotConf input:" + agent + "placeholder {\ntext-align: center;\n}\n#mascotConf h2 {\nmargin: 10px 0 0;\nfont-size: 14px;\n}\n#content {\noverflow: auto;\nposition: absolute;\ntop: 2.5em;\nright: 5px;\nbottom: 5px;\nleft: 5px;\n}\n.suboptions,\n#mascotcontent,\n#themecontent {\noverflow: auto;\nposition: absolute;\nright: 0;\nbottom: 1.5em;\nleft: 0;\n}\n#mascotcontent,\n.suboptions {\ntop: 0;\n}\n#themecontent {\ntop: 1.5em;\n}\n#mascotcontent {\ntext-align: center;\n}\n#save,\n.stylesettings {\nposition: absolute;\nright: 10px;\nbottom: 0;\n}\n#addthemes {\nposition: absolute;\nleft: 10px;\nbottom: 0;\n}\n.mascotname,\n.mascotoptions {\nmargin: 5px;\nborder-radius: 10px;\npadding: 1px 5px;\n}\n.mascotmetadata {\nposition: absolute;\nleft: 0;\nright: 0;\nbottom: 0;\ntext-align: center;\n}\n#close,\n#mascots_batch {\nposition: absolute;\nleft: 10px;\nbottom: 0;\n}\n#upload {\nposition: absolute;\nwidth: 100px;\nleft: 50%;\nmargin-left: -50px;\ntext-align: center;\nbottom: 0;\n}\n#content textarea {\nfont-family: monospace;\nmin-height: 350px;\nresize: vertical;\nwidth: 100%;\n}\n#updater:not(:hover) {\nborder: none;\nbackground: transparent;\n}\n#updater input[type=number] {\nwidth: 4em;\n}\n.new {\nbackground: lime;\n}\n#watcher {\npadding-bottom: 5px;\nposition: absolute;\noverflow: hidden;\nwhite-space: nowrap;\n}\n#watcher:not(:hover) {\nmax-height: 220px;\n}\n#watcher > div {\nmax-width: 200px;\noverflow: hidden;\npadding-left: 5px;\npadding-right: 5px;\ntext-overflow: ellipsis;\n}\n#watcher > .move {\npadding-top: 5px;\ntext-decoration: underline;\n}\n#qp {\npadding: 2px 2px 5px;\n}\n#qp .post {\nborder: none;\nmargin: 0;\npadding: 0;\n}\n#qp img {\nmax-height: 300px;\nmax-width: 500px;\n}\n.qphl {\noutline: 2px solid rgba(216,94,49,.7);\n}\n.quotelink.deadlink {\ntext-decoration: underline !important;\n}\n.deadlink:not(.quotelink) {\ntext-decoration: none !important;\n}\n.image_expanded {\nclear: both !important;\n}\n.inlined {\nopacity: .5;\n}\n.inline {\nbackground-color: rgba(255,255,255,0.15);\nborder: 1px solid rgba(128,128,128,0.5);\ndisplay: table;\nmargin: 2px;\npadding: 2px;\n}\n.inline .post {\nbackground: none;\nborder: none;\nmargin: 0;\npadding: 0;\n}\ndiv.opContainer {\ndisplay: block !important;\n}\n.opContainer.filter_highlight {\nbox-shadow: inset 5px 0 rgba(255,0,0,.5);\n}\n.opContainer.filter_highlight.qphl {\nbox-shadow:\n  inset 5px 0 rgba(255,0,0,.5),\n  0 0 0 2px rgba(216,94,49,.7);\n}\n.filter_highlight > .reply {\nbox-shadow: -5px 0 rgba(255,0,0,0.5);\n}\n.filter_highlight > .reply.qphl {\nbox-shadow:\n  -5px 0 rgba(255,0,0,.5),\n  0 0 0 2px rgba(216,94,49,.7)\n}\n.filtered,\n.quotelink.filtered {\ntext-decoration: underline;\ntext-decoration: line-through !important;\n}\n.quotelink.forwardlink,\n.backlink.forwardlink {\ntext-decoration: none;\nborder-bottom: 1px dashed;\n}\n.threadContainer {\nmargin-left: 20px;\nborder-left: 1px solid black;\n}\n.stub ~ * {\ndisplay: none !important;\n}";
      if ((Conf["Quick Reply"] && Conf["Hide Original Post Form"]) || Conf["Style"]) {
        css += "#postForm {\ndisplay: none;\n}";
      }
      if (Conf["Recursive Filtering"]) {
        css += ".hidden + .threadContainer {\ndisplay: none;\n}";
      }
      if (!Conf["Style"]) {
        css += ".captchainput > .field {\nmin-width: 100%;\n}\n#qr > form > div:first-child > .field:not(#dump) {\nwidth: 30%;\n}\n#qr textarea.field {\ndisplay: -webkit-box;\nmin-height: 160px;\nmin-width: 100%;\n}\n#qr.captcha textarea.field {\nmin-height: 120px;\n}\n.captchaimg {\ntext-align: center;\n}\n.captchaimg > img {\ndisplay: block;\nheight: 57px;\nwidth: 300px;\n}\n#qr [type=file] {\nmargin: 1px 0;\nwidth: 70%;\n}\n#qr [type=submit] {\nmargin: 1px 0;\npadding: 1px; /* not Gecko */\nwidth: 30%;\n}\n.gecko #qr [type=submit] {\npadding: 0 1px; /* Gecko does not respect box-sizing: border-box */\n}";
      } else {
        $.ready(function() {
          Style.rice(d.body);
          return Style.trimGlobalMessage();
        });
        Conf["styleenabled"] = true;
        this.remStyle();
        if (Conf["Sidebar"] === "large") {
          sidebarOffsetW = 51;
          sidebarOffsetH = 17;
        } else {
          sidebarOffsetW = 0;
          sidebarOffsetH = 0;
        }
        if (Conf["Sidebar Location"] === "left") {
          sidebarLocation = ["left", "right"];
        } else {
          sidebarLocation = ["right", "left"];
        }
        css += "::" + agent + "selection {\nbackground: " + theme["Text"] + ";\ncolor: " + theme["Background Color"] + ";\n}\nbody {\n  padding: 16px 0 16px;\n}\nbody > script + hr + div {\n  display: none;\n}\n@media only screen and (max-width: 1100px) {\n  body {\n    padding-top: 32px;\n  }\n}\n@media only screen and (max-width:689px) {\n  body {\n    padding-top: 47px;\n  }\n}\n@media only screen and (max-width:553px) {\n  body {\n    padding-top: 62px;\n  }\n}\nhtml,\nbody {\n  min-height: 100%;\n}\nhtml,\nbody,\ninput,\nselect,\ntextarea {\n  font-family: '" + Conf["Font"] + "';\n}\n#qr img,\n.captcha img {\n  opacity: " + Conf["Captcha Opacity"] + ";\n}\n#qp div.post .postertrip,\n#qp div.post .subject,\n.capcode,\n.container::before,\n.dateTime,\n.file,\n.fileInfo,\n.fileText,\n.fileText span:not([class])::after,\n.name,\n.postNum,\n.postertrip,\n.rules,\n.subject,\n.summary,\na,\nbig,\nblockquote,\ndiv.post > blockquote .chanlinkify.YTLT-link.YTLT-text,\ndiv.reply,\nfieldset,\ntextarea,\ntime + span {\n  font-size: " + Conf["Font Size"] + ";\n}\n#globalMessage b {\n  font-weight: 100;\n}\n/* Cleanup */\n#absbot,\n#autohide,\n#ft li.fill,\n#imgControls label:first-of-type input,\n#imgControls .rice,\n#logo,\n#postPassword + span,\n.autoPagerS,\n.board > hr:last-of-type," + (!Conf["Board Subtitle"] ? ".boardSubtitle," : void 0) + ".closed,\n.deleteform,\n.entry:not(.focused) > .subMenu,\n.error:empty,\n.hidden_thread > .summary,\n.inline .report_button,\n.inline input,\n.mobile,\n.navLinksBot,\n.next,\n.postInfo input,\n.postInfo .rice,\n.postingMode,\n.prev,\n.qrHeader,\n.replyContainer > .hide_reply_button.stub ~ .reply,\n.replymode,\n.rules,\n.sideArrows:not(.hide_reply_button),\n.stylechanger,\n.warnicon,\n.warning:empty,\n.yui-menu-shadow,\nbody > .postingMode ~ #delform hr,\nbody > br,\nbody > hr,\ndiv.reply[hidden],\nhtml body > span[style=\"left: 5px; position: absolute;\"]:nth-of-type(0),\ntable[style=\"text-align:center;width:100%;height:300px;\"] {\n  display: none !important;\n}\ndiv.post > blockquote .prettyprint span {\n  font-family: monospace;\n}\ndiv.post div.file .fileThumb {\n  float: left;\n  margin: 3px 20px 0;\n}\na {\n  outline: 0;\n}\n#boardNavDesktop,\n#boardNavDesktop a,\n#boardNavDesktopFoot a,\n#count,\n#imageType,\n#imageType option\n#imgControls,\n#navtopright a[href=\"javascript:;\"],\n#postcount,\n#stats,\n#timer,\n#updater,\n.pages a,\n.pages strong,\nbody:not([class]) a[href=\"javascript:;\"],\ninput,\nlabel {\n  font-size: 12px;\n  text-decoration: none;\n}\n#credits a,\n.abbr a,\n.backlink:not(.filtered),\n.chanlinkify,\n.file a,\n.pages,\n.pages a,\n.quotejs,\n.quotelink:not(.filtered),\n.quotelink:not(.filtered),\n.useremail,\na,\na.deadlink,\na[href*=\"//dis\"],\na[href*=res],\ndiv.post > blockquote .chanlinkify.YTLT-link.YTLT-text,\ndiv.postContainer span.postNum > .replylink {\n  text-decoration: " + (Conf["Underline Links"] ? "underline" : "none") + ";\n}\n.filtered {\n  text-decoration: line-through;\n}\n/* YouTube Link Title */\ndiv.post > blockquote .chanlinkify.YTLT-link.YTLT-na {\n  text-decoration: line-through;\n}\ndiv.post > blockquote .chanlinkify.YTLT-link.YTLT-text {\n  font-style: normal;\n}\n/* Z-INDEXES */\n#mascotConf,\n#options.reply.dialog,\n#themeConf {\n  z-index: 999 !important;\n}\n#qp {\n  z-index: 104 !important;\n}\n#ihover,\n#overlay,\n#updater:hover,\n.exPopup,\nhtml .subMenu {\n  z-index: 102 !important;\n}\n#navtopright .settingsWindowLink::after,\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  z-index: 101 !important;\n}\n#imgControls {\n  z-index: 100 !important;\n}\n.fileThumb {\n  z-index: " + (Conf["Images Overlap Post Form"] ? "100" : "1") + " !important;\n}\n\ndiv.navLinks > a:first-of-type::after {\n  z-index: 99 !important;\n}\n.fileText ~ a > img + img {\n  z-index: 96 !important;\n}\n#autoPagerBorderPaging,\n#boardNavDesktop,\n#menu.reply.dialog,\n#navlinks {\n  z-index: 95 !important;\n}\n#boardNavMobile,\n#stats,\n#updater {\n  z-index: 10 !important;\n}\n#navtopright,\n.qrMessage {\n  z-index: 6 !important;\n}\n#boardTitle,\n#watcher,\n#watcher::before,\n.menu_button,\n.sideArrows {\n  z-index: 4 !important;\n}\n#globalMessage::before,\n.boardBanner,\n.replyhider a {\n  z-index: 1 !important;\n}\ndiv.reply,\ndiv.reply.highlight {\n  z-index: 0 !important;" + agent + "box-sizing: border-box;\nbox-sizing: border-box;\n}\nbody > a[style=\"cursor: pointer; float: right;\"]::after,\n#navtopright .settingsWindowLink::after,\n#boardNavDesktopFoot::after,\n#watcher::before,\n#globalMessage::before,\ndiv.navLinks > a:first-of-type::after,\n#imgControls label:first-of-type::after {\nopacity: 0.4;\n}\nbody > a[style=\"cursor: pointer; float: right;\"]:hover::after,\n#navtopright .settingsWindowLink:hover::after,\n#boardNavDesktopFoot:hover::after,\n#globalMessage:hover::before,\ndiv.navLinks > a:first-of-type:hover::after,\n#watcher:hover::before,\n#imgControls label:hover:first-of-type::after {\nopacity: 1;\n}\n.pageJump {\nposition: fixed;\ntop: -1000px;\npointer-events: all;\n}\n.extButton img {\nmargin-top: -4px;\n}\n#boardNavMobile select {\nfont-size: 11px;\npointer-events: all;\n}\n.qrMessage {\nposition: fixed;" + sidebarLocation[0] + ": 2px;\nbottom: 250px;\nfont-size: 11px;\nfont-weight: 100;\nbackground: none;\nborder: none;\nwidth: " + (248 + sidebarOffsetW) + "px;\n}\n#boardTitle {\n  font-size: 30px;\n  font-weight: 400;\n}\n.boardSubtitle {\n  font-size: 13px;\n}\nhr {\n  padding: 0;\n  height: 0;\n  width: 100%;\n  clear: both;\n  border: none;\n}\n/* Front Page */\n.bd,\n.bd ul,\nimg,\n.pages,\n#qr,\ndiv[id^=\"qr\"],\ntable.reply[style^=\"clear: both\"],\n.boxcontent > hr,\nh3 {\n  border: none;\n}\n.boxcontent input {\n  height: 18px;\n  vertical-align: bottom;\n  margin-right: 1px;\n}\na.yuimenuitemlabel {\n  padding: 0 20px;\n}\n/* Navigation */" + (Conf["Custom Navigation"] ? "" : "#boardNavDesktop,") + ".pages /* Bottom Navigation */ {\n  text-align: center;\n  font-size: 0;\n  color: transparent;\n  width: auto;\n}\n#boardNavDesktop {\n  text-align: center;\n  width: auto;\n  padding-right: 0px;\n  margin-right: 0px;\n}\n#boardNavDesktopFoot {\n  visibility: visible;\n  position: fixed;" + sidebarLocation[0] + ": 2px;\nbottom: auto;\ncolor: transparent;\nfont-size: 0;\nborder-width: 1px;\ntext-align: center;\nheight: 0;\nwidth: " + (248 + sidebarOffsetW) + "px !important;\noverflow: hidden;" + agent + "transition: height .5s linear, border 0s ease-in-out .5s;" + agent + "box-sizing: border-box;\nbox-sizing: border-box;\n}\n.center {\ntext-align: center;\nclear: both;\n}\nimg.topad,\nimg.middlead,\nimg.bottomad {\nopacity: 0.3;" + agent + "transition: opacity .3s ease-in-out .3s;\n}\nimg.topad:hover,\nimg.middlead:hover,\nimg.bottomad:hover {\n  opacity: 1;" + agent + "transition: opacity .3s linear;\n}\n.fileThumb {\n  position: relative;\n}" + (!Conf["Custom Navigation"] ? "#boardNavDesktop a," : void 0) + ".pages a,\n.pages strong {\n  display: inline-block;\n  font-size: 12px;\n  border: none;\n  text-align: center;\n  margin: 0 1px 0 2px;\n}\n.pages {\n  word-spacing: 10px;\n}\n/* moots announcements */\n#globalMessage {\n  font-size: 12px;\n  text-align: center;\n  font-weight: 200;\n}\n.pages strong,\na,\n.new {" + agent + "transition: background-color .1s linear;\n}\n/* Post Form */\n/* Override OS-specific UI */\n#ft li,\n#ft ul,\n#options input:not([type=\"radio\"]),\n#updater input:not([type=\"radio\"]),\n.box-outer,\n.boxbar,\n.top-box,\nh2,\ninput:not([type=\"radio\"]),\ninput[type=\"submit\"],\ntextarea {" + agent + "appearance: none;\n}\ninput[type=checkbox] {" + agent + "appearance: checkbox !important;\n}\n/* Formatting for all postarea elements */\n\n#browse,\n#file,\n#threadselect select {\n  cursor: pointer;\n  display: inline-block;\n}\n#threadselect select,\ninput,\n.field,\ninput[type=\"submit\"] {\n  height: 20px;\n}\n#qr .warning {\n  min-height: 20px;\n}\n#qr .warning,\n#threadselect select,\ninput,\n.field,\ninput[type=\"submit\"] {\n  margin: 1px 0 0;\n  vertical-align: bottom;" + agent + "box-sizing: border-box;\nbox-sizing: border-box;\npadding: 1px !important;\n}\n/* Width and height of all postarea elements (excluding some captcha elements) */\ntextarea.field,\n#qr .field[type=\"password\"],\n.ys_playerContainer audio,\n#qr input[title=\"Verification\"],\n#qr > form > div {\nwidth: " + (248 + sidebarOffsetW) + "px;\n}\n/* Buttons */\n#browse,\ninput[type=\"submit\"], /* Any lingering buttons */\ninput[value=\"Report\"] {\n  height: 20px;\n  padding: 0;\n  font-size: 12px;\n}\n#qr input[type=\"submit\"] {\n  width: 100%;\n  float: left;\n  clear: both;\n}\n#qr input[type=\"file\"] {\n  position: absolute;\n  opacity: 0;\n  z-index: -1;\n}\n#file {\n  width: " + (177 + sidebarOffsetW) + "px;\n}\n#browse {\n  text-align: center;\n  width: 70px;\n  margin: 1px 1px 0 0;\n}\n/* Image Hover and Image Expansion */\n#ihover {\n  max-width:85%;\n  max-height:85%;\n}\n#qp {\n  min-width: 500px;\n}\n.fileText ~ a > img + img {\n  position: relative;\n  top: 0px;\n}\n#imageType {\n  border: none;\n  width: 90px;\n  position: relative;\n  bottom: 1px;\n}\n/* #qr dimensions */\n#qr {\n  height: auto;\n}\n.top-box .menubutton {\n  background-image: none;\n}\n.rice {\n  vertical-align: middle;\n}\n#qr label input,\n.boxcontent input,\n.boxcontent textarea {" + agent + "appearance: none;\nborder: 0;\n}\ninput[type=checkbox],\n.reply input[type=checkbox],\n#options input[type=checkbox] {" + agent + "appearance: none;\nwidth: 12px !important;\nheight: 12px !important;\ncursor: pointer;\n}\n.postingMode ~ #delform .opContainer input {\nposition: relative;\nbottom: 2px;\n}\n/* Posts */\nbody > .postingMode ~ #delform br[clear=\"left\"],\n#delform center {\nposition: fixed;\nbottom: -500px;\n}\n#delform .fileText + br + a[target=\"_blank\"] img,\n#qp div.post .fileText + br + a[target=\"_blank\"] img  {\nborder: 0;\nfloat: left;\nmargin: 5px 20px 15px;\n}\n#delform .fileText + br + a[target=\"_blank\"] img + img {\nmargin: 0 0 25px;\n}\n.fileText {\nmargin-top: 17px;\n}\n.fileText span:not([class])::after {\nfont-size: 13px;\n}\n#updater:hover {\nborder: 0;\n}\n/* Fixes text spoilers */\n.spoiler:not(:hover),\n.spoiler:not(:hover) .quote,\n.spoiler:not(:hover) .quote a,\n.spoiler:not(:hover) a {\ncolor: rgb(0,0,0) !important;\nbackground-color: rgb(0,0,0) !important;\ntext-shadow: none !important;\n}\n/* Remove default \"inherit\" background declaration */\n.span.subject,\n.subject,\n.name,\n.postertrip {\nbackground: transparent;\n}\n.name {\nfont-weight: 700;\n}\n/* Addons and such */\nbody > div[style=\"width: 100%;\"] {\nmargin-top: 34px;\n}\n#copyright,\n#boardNavDesktop a,\n#qr td,\n#qr tr[height=\"73\"]:nth-of-type(2),\n.menubutton a,\n.pages td,\ntd[style=\"padding-left: 7px;\"],\ndiv[id^=\"qr\"] tr[height=\"73\"]:nth-of-type(2) {\npadding: 0;\n}\n#navtopright {\nposition: fixed;\nbottom: -1000px;\nleft: -1000px;\n}\n/* Expand Images */\n#imgControls {\nwidth: 15px;\nheight: 20px;\noverflow: hidden;" + agent + "transition: width .2s linear;\n}\n#imgContainer {\n  width: 110px;\n  float: " + sidebarLocation[0] + ";\n}\n#imgControls:hover {\n  width: 110px;\n}\n#imgControls label {\n  font-size: 0;\n  color: transparent;\n  float: " + sidebarLocation[0] + ";\n}\n#imgControls label::after {\n  position: relative;" + sidebarLocation[0] + ": 2px;\ntop: 2px;\n}\n#imgControls select {\nfloat: " + sidebarLocation[1] + ";\n}\n#imgControls select > option {\n  font-size: 80%;\n}\n/* Reply Previews */\n#qp div.post {\n  max-width: 70%;\n  visibility: visible;\n}\n#qp div.op {\n  display: table;\n}\n#qp div.post {\n  padding: 2px 6px;\n}\n#qp div.post img {\n  max-width: 300px;\n  height: auto;\n}\ndiv.navLinks {\n  visibility: hidden;\n  height: 0;\n  width: 0;\n  overflow: hidden;\n}\n/* AutoPager */\n#autoPagerBorderPaging {\n  position: fixed !important;\n  right: 300px !important;\n  bottom: 0px;\n}\n#options ul {\n  margin: 0;\n  margin-bottom: 6px;\n  padding: 3px;\n}\n#stats,\n#navlinks {\n  left: auto !important;\n  bottom: auto !important;\n  text-align: right;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n}\n#stats {\n  font-size: 12px;\n  position: fixed;\n  cursor: default;\n}\n#updater {\n  width: 40px !important;\n  border: 0;\n  font-size: 12px;\n  overflow: hidden;\n  background: none;\n  text-align: right;\n}\n#count.new {\n  background-color: transparent;\n}\n#updater:hover {\n  width: 150px !important;\n}\n#watcher {\n  padding: 1px 0;\n  border-radius: 0;\n}\n#options .move,\n#updater .move,\n#watcher .move,\n#stats .move {\n  cursor: default !important;\n}\n/* 4sight */\nbody > a[style=\"cursor: pointer; float: right;\"] {\n  position: fixed;\n  top: -1000px;\n  left: -1000px;\n}\nbody > a[style=\"cursor: pointer; float: right;\"] ~ div[style^=\"width: 100%;\"] {\n  display: block;\n  position: fixed;\n  top: 17px;\n  bottom: 17px;" + sidebarLocation[1] + ": 4px;" + sidebarLocation[0] + ": " + (252 + sidebarOffsetW) + "px;\nwidth: auto;\nmargin: 0;\n}\nbody > a[style=\"cursor: pointer; float: right;\"] ~ div[style^=\"width: 100%;\"] > table {\nheight: 100%;\nvertical-align: top;\n}\nbody > a[style=\"cursor: pointer; float: right;\"] ~ div[style^=\"width: 100%;\"]{\nheight: 95%;\nmargin-top: 5px;\nmargin-bottom: 5px;\n}\n#fs_status {\nwidth: auto;\nheight: 100%;\nbackground: none;\npadding: 10px;\noverflow: scroll;\n}\n[alt=\"sticky\"] + a::before {\ncontent: \"Sticky | \";\n}\n[alt=\"closed\"] + a::before {\ncontent: \"Closed | \";\n}\n[alt=\"closed\"] + a {\ntext-decoration: line-through;\n}\n/* Youtube Link Title */\n.chanlinkify.YTLT-link.YTLT-text {\nfont-family: monospace;\nfont-size: 11px;\n}\n.fileText+br+a[target=\"_blank\"]:hover {\nbackground: none;\n}\n.inline,\n#qp {\nbackground-color: transparent;\nborder: none;\n}\ninput[type=\"submit\"]:hover {\ncursor: pointer;\n}\n/* 4chan Sounds */\n.ys_playerContainer.reply {\nposition: fixed;\nbottom: 252px;\nmargin: 0;" + sidebarLocation[0] + ": 3px;\npadding-right: 0;\npadding-left: 0;\npadding-top: 0;\n}\n#qr input:focus:" + agent + "placeholder,\n#qr textarea:focus:" + agent + "placeholder {\ncolor: transparent;\n}\nimg[md5] {\nimage-rendering: optimizeSpeed;\n}\ninput,\ntextarea {\ntext-rendering: geometricPrecision;\n}\n#boardNavDesktop .current {\nfont-weight: bold;\nfont-size: 13px;\n}\n#postPassword {\nposition: relative;\nbottom: 3px;\n}\n.postContainer.inline {\nborder: none;\nbackground: none;\npadding-bottom: 2px;\n}\ndiv.pagelist {\nbackground: none;\nborder: none;\n}\na.forwardlink {\nborder: none;\n}\n.exif td {\ncolor: #999;\n}\n.callToAction.callToAction-big {\nfont-size: 18px;\ncolor: rgb(255,255,255);\n}\nbody > table[cellpadding=\"30\"] h1,\nbody > table[cellpadding=\"30\"] h3 {\nposition: static;\n}\n.focused.entry {\nbackground-color: transparent;\n}\n#menu.reply.dialog,\nhtml .subMenu {\npadding: 0px;\n}\n#qr #charCount {\nbackground: none;\nposition: absolute;\nright: 2px;\ntop: auto;\nbottom: 110px;\ncolor: " + (theme["Dark Theme"] ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)") + ";\nfont-size: 10px;\nheight: 20px;\ntext-align: right;\nvertical-align: middle;\npadding-top: 2px;\n}\n#qr #charCount.warning {\ncolor: rgb(255,0,0);\nposition: absolute;\ntop: auto;\nright: 2px;\nbottom: 110px;\nheight: 20px;\nmax-height: 20px;\nborder: none;\nbackground: none;\n}\n/* Position and Dimensions of the #qr */\n#qr {\noverflow: visible;\nposition: fixed;\ntop: auto !important;\nbottom: 2px !important;\nwidth: " + (248 + sidebarOffsetW) + "px;\nmargin: 0;\npadding: 0;\nz-index: 5 !important;\nbackground-color: transparent !important;\n}\n/* Width and height of all #qr elements (excluding some captcha elements) */\nbody > .postingMode ~ #delform .reply a > img[src^=\"//images\"] {\nposition: relative;\nz-index: 96;\n}\n#qr img {\nheight: 47px;\nwidth: " + (248 + sidebarOffsetW) + "px;\n}\n#dump {\n  background: none;\n  border: none;\n  width: 20px;\n  margin: 0;\n  font-size: 14px;\n  vertical-align: middle;\n  outline: none;\n}\n#dump:hover {\n  background: none;\n}\n#threadselect {\n  position: absolute;\n  top: -20px;\n  left: 0;\n}\n#threadselect select {\n  margin-top: 0;\n  font-size: 12px;\n  text-align: right;\n}\n#spoilerLabel {\n  position: absolute;\n  top: -20px;\n  right: 0;\n}\n.dump > form > label {\n  display: block;\n  visibility: hidden;\n}\ninput[title=\"Verification\"],\n.captchaimg img {\n  margin-top: 1px;\n}\n#qr div {\n  min-width: 0;\n}\nhtml body span[style=\"left: 5px; position: absolute;\"] a {\n  height: 14px;\n  padding-top: 3px;\n  width: 56px;\n}\nhr {\n  position: relative;\n  top: 2px;\n}\n#updater input,\n#options input,\n#qr,\ntable.reply[style^=\"clear: both\"] {\n  border: none;\n}\n#delform > div:not(.thread) select,\n.pages input[type=\"submit\"] {\n  margin: 0;\n  height: 17px;\n}\n.prettyprint {\n  display: block;\n  white-space: pre-wrap;\n  border-radius: 2px;\n  font-size: inherit;\n  max-width: 600px;\n  overflow-x: auto;\n  padding: 3px;\n}\n#themeConf {\n  position: fixed;" + sidebarLocation[1] + ": 2px;" + sidebarLocation[0] + ": auto;\ntop: 0;\nbottom: 0;\nwidth: 248px;\n}\n#themebar input {\nwidth: 30%;\n}\nhtml,\nbody {\nbackground: " + theme["Background Color"] + ";\nbackground-image: " + theme["Background Image"] + ";\nbackground-repeat: " + theme["Background Repeat"] + ";\nbackground-attachment: " + theme["Background Attachment"] + ";\nbackground-position: " + theme["Background Position"] + ";\n}\n#content,\n#themecontent,\n#mascotcontent {\n  background: " + theme["Background Color"] + ";\nborder: 1px solid " + theme["Reply Border"] + ";\npadding: 5px;\n}\n.suboptions {\npadding: 5px;\n}\n#boardTitle,\n#spoilerLabel,\n#stats,\n#updater {\ntext-shadow:\n  1px 1px 1px " + theme["Background Color"] + ",\n-1px 1px 1px " + theme["Background Color"] + ",\n1px -1px 1px " + theme["Background Color"] + ",\n-1px -1px 1px " + theme["Background Color"] + "}\n#browse,\n#ft li,\n#ft ul,\n#options .dialog,\n#qrtab,\n#watcher,\n#updater:hover,\n.box-outer,\n.boxbar,\n.top-box,\n.yuimenuitem-selected,\nhtml body span[style=\"left: 5px; position: absolute;\"] a,\ninput[type=\"submit\"],\n#options.reply.dialog,\ninput[value=\"Report\"] {\n  background: " + theme["Buttons Background"] + ";\nborder: 1px solid " + theme["Buttons Border"] + ";\n}\n#dump,\n#file,\n#options input,\n#threadselect select,\ninput,\ninput.field,\nselect,\ntextarea,\ntextarea.field {\n  background: " + theme["Input Background"] + ";\nborder: 1px solid " + theme["Input Border"] + ";\ncolor: " + theme["Inputs"] + ";" + agent + "transition: all .2s linear;\n}\n#browse:hover,\n#file:hover,\ninput:hover,\ninput.field:hover,\ninput[type=\"submit\"]:hover,\nselect:hover,\ntextarea:hover,\ntextarea.field:hover {\n  background: " + theme["Hovered Input Background"] + ";\nborder-color: " + theme["Hovered Input Border"] + ";\ncolor: " + theme["Inputs"] + ";" + agent + "transition: all .2s linear;\n}\ninput:focus,\ninput.field:focus,\ninput[type=\"submit\"]:focus,\nselect:focus,\ntextarea:focus,\ntextarea.field:focus {\n  background: " + theme["Focused Input Background"] + ";\nborder-color: " + theme["Focused Input Border"] + ";\ncolor: " + theme["Inputs"] + ";\n}\n#qp div.post,\ndiv.reply {\n  background: " + theme["Reply Background"] + ";\nborder: 1px solid " + theme["Reply Border"] + ";\n}\n.reply.highlight,\n.reply:target {\n  background: " + theme["Highlighted Reply Background"] + ";\nborder: 1px solid " + theme["Highlighted Reply Border"] + ";\n}\n#boardNavDesktop,\n.pages {\n  background: " + theme["Navigation Background"] + ";\nborder: 1px solid " + theme["Navigation Border"] + ";\n}\n#delform {\n  background: " + theme["Thread Wrapper Background"] + ";\nborder: 1px solid " + theme["Thread Wrapper Border"] + ";\n}\n#boardNavDesktopFoot,\n#mascotConf,\n#themeConf,\n#watcher,\n#watcher:hover,\ndiv.subMenu,\n#menu {\n  background: " + theme["Dialog Background"] + ";\nborder: 1px solid " + theme["Dialog Border"] + ";\n}\n.mascotname,\n.mascotoptions {\n  background: " + theme["Dialog Background"] + ";\n}\n.inline div.reply {\n  /* Inline Quotes */\n  background-color: " + (theme["Dark Theme"] ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)") + ";\nborder: 1px solid " + theme["Reply Border"] + ";\nbox-shadow: 5px 5px 5px " + theme["Shadow Color"] + ";\n}\n#qr .warning {\n  background: " + theme["Input Background"] + ";\nborder: 1px solid " + theme["Input Border"] + ";\n}\n[style='color: red !important;'] *,\n.disabledwarning,\n.warning {\n  color: " + theme["Warnings"] + " !important;\n}\na,\n#dump,\n.entry,\ndiv.post > blockquote a[href^=\"//\"],\n.sideArrows a,\ndiv.postContainer span.postNum > .replylink {\n  color: " + theme["Links"] + ";\n}\n.postNum a {\n  color: " + theme["Post Numbers"] + ";\n}\n.subject {\n  color: " + theme["Subjects"] + " !important;\nfont-weight: 600;\n}\n.dateTime {\ncolor: " + theme["Timestamps"] + " !important;\n}\n#updater:not(:hover),\n#updater:not(:hover) #count:not(.new)::after,\n.summary,\nbody > form,\nbody,\nhtml body span[style=\"left: 5px; position: absolute;\"] a,\ninput,\ntextarea,\n.abbr,\n.boxbar,\n.boxcontent,\n.pages strong,\n.reply,\n.reply.highlight,\n#boardNavDesktop .title,\n#imgControls label::after,\n#updater #count:not(.new)::after,\n#qr > form > label::after,\nspan.pln {\n  color: " + theme["Text"] + ";\n}\n#options ul {\n  border-bottom: 1px solid " + theme["Reply Border"] + ";\nbox-shadow: inset " + theme["Shadow Color"] + " 0 0 5px;\n}\n.quote + .spoiler:hover,\n.quote {\n  color: " + theme["Greentext"] + ";\n}\na.backlink {\n  color: " + theme["Backlinks"] + ";\nfont-weight: 800;\n}\nspan.quote > a.quotelink,\na.quotelink {\ncolor: " + theme["Quotelinks"] + ";\n}\ndiv.subMenu,\n#menu,\n#qp div.post {\n  box-shadow: 5px 5px 5px " + theme["Shadow Color"] + ";\n}\n.rice {\n  cursor: pointer;\n  width: 10px;\n  height: 10px;\n  margin: 3px;\n  display: inline-block;\n  background: " + theme["Checkbox Background"] + ";\nborder: 1px solid " + theme["Checkbox Border"] + ";\n}\n#qr label input,\n#updater input,\n.bd {\n  background: " + theme["Buttons Background"] + ";\nborder: 1px solid " + theme["Buttons Border"] + ";\n}\n.pages a,\n#boardNavDesktop a {\n  color: " + theme["Navigation Links"] + ";\n}\ninput[type=checkbox]:checked + .rice {\n  background: " + theme["Checkbox Checked Background"] + ";\nbackground-image: url(" + (theme["Dark Theme"] ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAMAAADXT/YiAAAAWlBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jZLFEAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAMAAADXT/YiAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==") + ");\nbackground-attachment: scroll;\nbackground-repeat: no-repeat;\nbackground-position: bottom right;\n}\na:hover,\n#dump:hover,\n.entry:hover,\ndiv.post > blockquote a[href^=\"//\"]:hover,\n.sideArrows a:hover,\ndiv.post div.postInfo span.postNum a:hover,\ndiv.postContainer span.postNum > .replylink:hover,\n.nameBlock > .useremail > .name:hover,\n.nameBlock > .useremail > .postertrip:hover {\ncolor: " + theme["Hovered Links"] + ";\n}\n#boardNavDesktop a:hover,\n#boardTitle a:hover {\n  color: " + theme["Hovered Navigation Links"] + ";\n}\n#boardTitle {\n  color: " + theme["Board Title"] + ";\n}\n.name {\n  color: " + theme["Names"] + " !important;\n}\n.postertrip,\n.trip {\n  color: " + theme["Tripcodes"] + " !important;\n}\n.nameBlock > .useremail > .postertrip,\n.nameBlock > .useremail > .name {\n  color: " + theme["Emails"] + ";\n}\n.nameBlock > .useremail > .name,\n.name {\n  font-weight: 600;\n}\na.forwardlink {\n  border-bottom: 1px dashed;\n}\n.qphl {\n  outline-color: " + theme["Backlinked Reply Outline"] + ";\n}\n#qr input:" + agent + "placeholder,\n#qr textarea:" + agent + "placeholder {\ncolor: " + (theme["Dark Theme"] ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)") + " !important;\n}\n.boxcontent dd,\n#options ul {\n  border-color: " + (theme["Dark Theme"] ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") + ";\n}\n#options .styleoption {\n  border-top: 1px solid " + (theme["Dark Theme"] ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") + ";\n}\n#mascot img {" + agent + "transform: scaleX(" + (sidebarLocation[0] === "left" ? "-" : "") + "1);\n}" + theme["Custom CSS"];
        if (theme["Dark Theme"]) {
          css += ".prettyprint {\n  background-color: rgba(255,255,255,.1);\n  border: 1px solid rgba(0,0,0,0.5);\n}\nspan.tag {\n  color: #96562c;\n}\nspan.pun {\n  color: #5b6f2a;\n}\nspan.com {\n  color: #a34443;\n}\nspan.str,\nspan.atv {\n  color: #8ba446;\n}\nspan.kwd {\n  color: #987d3e;\n}\nspan.typ,\nspan.atn {\n  color: #897399;\n}\nspan.lit {\n  color: #558773;\n}\n/* 4chan X options */\n#navtopright .settingsWindowLink::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABAklEQVQ4T2PYsWMHAxJmA7K50cSQ5UFsPpg8isSZM2f+wzBQgRiaIZxA/iwgPgjE5SA5mGYmqEIWNANg8iCN84G4AIiXA/FquGaQBiBHFGqAMpLtQkAxZI0rgPxuII5C0Qw1wBbNZiOgog6ojTCN8eh+DkPWhGaAAVDxJCDuAWK4RmQ/g/wWjscAW5A8WgDCAww51PmwGQLUqEmMZpBBmsQYgJ4AQPwYIN4DCn1CBiBrlgBqKALiA0CsAHUiLi9oIAcYK5CzHYgvALEemt/gBkANNwfSC5A1FwM554EYRMNSG0YgAuWSgFgFiJcga87BYiO2DNEEVDcTiFWRNWMLOIJiAARDOk9b1IHWAAAAAElFTkSuQmCC\");\n}\n/* Return button */\ndiv.navLinks > a:first-of-type::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRFAAAA5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHkJaAqNQAAAA50Uk5TABAgQFBgcICPn6+/3+9ACPafAAAASElEQVQI15XMyxKAIAxD0eCr1ZT8/+eKDCOw07O700mBT45rrDXEXgul3sn0yCwsAaGBv/cw86xc92fbl0v7z7mBzeeudhJ/3aoUA1Vr0uhDAAAAAElFTkSuQmCC\");\n}\n/* Watcher */\n#watcher::before {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRFAAAA0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLUmYS1qAAAAA10Uk5TABAgQFBggI+fv8/f74aeqbgAAABVSURBVAjXnY0xDsMwEMNo+5TYPen/3+2SpUCXlhvBgfAH2uecrcdWt5O4ewHIdVtTvmXB9BoRoIzy5DqsDIAszvXRlyfItS3kXRZA9StJ0l1f/z/xBlXVAtkqW+Q3AAAAAElFTkSuQmCC\");\n}\n/* Announcement */\n#globalMessage::before {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAK5JREFUGNN1kF0RxCAMhCMBCZVQCUhAwkmohDhAAhKQEAPfDBKQUAm5B3qU3s3t425mfyJygUTBMIzMLivYaTiGoigNpxJu8aSxLeeRTiOICIGOXfQLH8aT5eD8GKE4cTo4UTDKND1uWYRGFpzXkrnKGROc9JDnKBQTjDyJjbr0b+RnteO3WpgbhYSN/QQabX1L/HqLzyA2DKdTUCodx/E7dHgoFaOgJMo4kP8gEt+mlap7ZbvCVgAAAABJRU5ErkJggg==\");\n}\n/* Slideout nav */\n#boardNavDesktopFoot::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRFAAAAzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMdShx9gAAAA50Uk5TABAgMEBggI+fr7/P3+82uMT1AAAAb0lEQVQIHQXBiQHDIAwEMOE8gGlu/3ErgWt297wAYyenT7IGjJNVqJUzsPMAniyuLODedspMQe3cKq8+8HxZOK0b9eUb6NYHO98Dv/am3FkDKq/Ktm9gp1h5AE8mxsku1M4ZMGby618yB6De7n4L/v79BDw2df22AAAAAElFTkSuQmCC\");\n}\n/* 4sight */\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFAAAAzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMIXMlggAAAA90Uk5TABAgMEBQYICPn6+/z9/vD6iGsgAAAFRJREFUCB0FwYcBwyAMADAZCCN2y//fRgIAAG0MAMSba/8eAO9EVAe0BOMAxgISMDaIBKgGewKMesS+C0A7mXPdCgCQtwIAou6/A0DUPQCgnw4A4APNOQHMJOa9jgAAAABJRU5ErkJggg==\");\n}\n/* Expand */\n#imgControls label:first-of-type::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAALlJREFUKFOFkT0KwlAQhANWaUSb+AciVmLlSZLcVhttBH9QjyIIHiDOF2ZhOxeGebM7b3dfUnRdVwmN0Aq1UAqFGU2eekWSQ8RTh6HNMDqiwczNiJsnkR8Jx1RrSTKKDlE467wR9jY+XK9jN0bSKQwfGy/iqVcrMWespd82fsW7XP/XmZUmuXPsfHLHq3grHKzveef8NXjozKPH4mjAvf5rZPNLGtPAjI7ozUtfiD+1kp4LPLZxDV78APzYoty/jZXwAAAAAElFTkSuQmCC\");\n}";
        } else {
          css += ".prettyprint {\n  background-color: #e7e7e7;\n  border: 1px solid #dcdcdc;\n}\nspan.com {\n  color: #d00;\n}\nspan.str,\nspan.atv {\n  color: #7fa61b;\n}\nspan.pun {\n  color: #61663a;\n}\nspan.tag {\n  color: #117743;\n}\nspan.kwd {\n  color: #5a6F9e;\n}\nspan.typ,\nspan.atn {\n  color: #9474bd;\n}\nspan.lit {\n  color: #368c72;\n}\n/* 4chan X options */\n#navtopright .settingsWindowLink::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAARhJREFUOE9j8PX1ZUDCbEA2N5oYsjyIzQeTR5eYAJS4DsTzgFgMzRBOIH8WEB8E4nKQHEwzE1QhC5DuTktL+w+k5yJpBmmcD8QFQLwciFcja54K5IhCFSuDNEMNEAKKIWtcATIciKOQNa8BcjYAsS0Q70TSbATkd0BthGmMR/dzGEwDMg31nwGQngTEPUAM14hsM8jv4UC8Dt0QqAEgF4HkUQIYPbRhUbEMiws0idEMMgCkkKAB2GyOAWrcAw19vAYga5YAaigC4gNArAB1Iig1YTNAAznAWIGc7UB8AYj10PwGNwBquDmQXoCsuRjIOQ/EIBqW2pBdBTYAiJOAWAWIlyBrzsFiI7YM0QRUNxOIVZE1Yws4gmIA3NYVkcQXjeIAAAAASUVORK5CYII=\");\n}\n/* Return button */\ndiv.navLinks > a:first-of-type::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGNJREFUGNNjYKAaiC2IXY9LyiH2fuz/2P3YpBRi9wOl/mORjhWIbYBKgeB7oEIIbIgVAEnfR5JEhf2Yuu8DeQ2x/UBTgCYh7J6PajdEC6rL9+ORBgsGgO3DJY2kMAHkegbaAgCK4libswvDKwAAAABJRU5ErkJggg==\");\n}\n/* Watcher */\n#watcher::before {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAALhJREFUOE+tkl0RgzAQhJFQCUhBAhJ4yENnMIEDJFRKJVRCJSCh3HfsMQfTFzI87CS5n+zuJU0ppalFdSOE9zY/x3EwvAzvBM7D2d7ObMnO8BUWW38JnCPXxSXeLDYKesNsYI+CNuWIE/Oce1YBAZgfYjtIVBNKyENAfUvzhDcp4AIvOvtT3CVrFlMNMwQb8x/PTHb3lXwSD8mb55CnBBP9SGKeNvuYdn+YdvYnpmvvXPO/7/2eVxSsk6VHBDjH8sAAAAAASUVORK5CYII=\");\n}\n/* Announcement */\n#globalMessage::before {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAK5JREFUGNN1kE0VxCAMhCMBCZVQCUhAwp6+cyXEARKQgIRIQAISKiF7oEvp7ts5zuTNT0QukCgYhpHZZQU7DcdQFKXhVMItnjS25TzSaQQRIdCxi37hw3iyHJwfIxQnTgcnCkaZpscti9DIgvNaMlc5Y4KTHvIchWKCkSexUZf+jfysdvxWC3OjkLCxn0CjrW+JX2/xGcSG4XQKSqXjOH6HDg+lYhSURBkH8h9E4htm9nkTaedRxgAAAABJRU5ErkJggg==\");\n}\n/* Slideout nav */\n#boardNavDesktopFoot::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEVQTFRFAAAAZ2dnzczMZ2dnzczMZ2dntLOzZ2dnq6qqZ2dnZ2dnZ2dnkI+PZ2dnjIyMqKenZ2dnZ2dnZ2dndXR0e3t7Z2dndHR03/W/BgAAABV0Uk5TABAQICAwQGBggI+fn6+vr7/P3+/vEpdk4gAAAHlJREFUCB0FwYEBgjAQBLDUCghY/aLn/qOagOWoqmMBtJHMmsnZoM2cHf3MbBjZAFtOlpzA+jbSHelwf/1WPbua8PjkiVmqcP/ke0OVmnjl+4Cr7OnW3/MGPbue4b0CI50zG2DLgTYzOvrIbNCO5KorORqg71W1d/gDBFEGZ/GMsaMAAAAASUVORK5CYII=\");\n}\n/* 4sight */\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH9JREFUGNONkFEZgCAMhIlABCIQgQhE8O2vQQMiEMEIi7AIRjACPqGC4ueetu/udrcZ869wBMI7ZFkREpmN+IRXlpOo+HGt3KZA6eFA6mYZ4dzlkNFbcWefW467XonGYMnU3qrFKwjCQqKi2PmD5JOARansw/0PQpkbeMpUfdUBLYs3tDb03tIAAAAASUVORK5CYII=\");\n}\n/* Expand */\n#imgControls label:first-of-type::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAMRJREFUKFNtks0OAUEQhOdM4iBx8XMSwb6En0dw89CciQMXvIIb9XW6pXfYpDKlu6rV9G4ppfSElbB2THTGA486GrQmfjteOnfJAKcWfbQ2IQp38WkyDMWvqY/WDEyJxkl8JoyFg4sfrjEDOflrpoUAU/CLD0CT72dB8lRiIp6niD+0NkS8lvBfJCYfPf9ZJ4v4RqovjXjh8cLUujSGWOuzyjzS71vq25a2qcB690JH6DrPL26DYSDkT2PpNeqNwFSApv8BTpBEE3rYF6oAAAAASUVORK5CYII=\");\n}";
        }
        switch (Conf["4chan Banner"]) {
          case "at sidebar top" || "in sidebar":
            logoOffset = 83 + sidebarOffsetH;
            css += ".boardBanner img {\n  position: fixed;\n  width: " + (248 + sidebarOffsetW) + "px;\ntop: " + (Conf["Icon Orientation"] === "vertical" ? "2px" : "19px") + ";" + sidebarLocation[0] + ": 2px;\n}";
            break;
          case "at sidebar bottom":
            logoOffset = 0;
            css += ".boardBanner img {\n  position: fixed;\n  width: " + (248 + sidebarOffsetW) + "px;\nbottom: 280px;" + sidebarLocation[0] + ": 2px;\n}";
            break;
          case "at top":
            logoOffset = 0;
            break;
          case "hide":
            logoOffset = 0;
            css += ".boardBanner img {\n  display: none;\n}";
        }
        if (Conf["Icon Orientation"] === "horizontal") {
          css += "/* 4chan X Options */\n#navtopright .settingsWindowLink::after {\n  visibility: visible;" + (sidebarLocation[0] === "left" ? "left: " + (231 + sidebarOffsetW) + "px" : "right:  2px") + ";\n}\n/* Slideout Navigation */\n#boardNavDesktopFoot::after {\n  border: none;" + (sidebarLocation[0] === "left" ? "left: " + (212 + sidebarOffsetW) + "px" : "right: 21px") + ";\n}\n/* Global Message */\n#globalMessage::before {\n  position: fixed;" + (sidebarLocation[0] === "left" ? "left: " + (193 + sidebarOffsetW) + "px" : "right: 40px") + ";\n}\n/* Watcher */\n#watcher::before {\n  position: fixed;" + (sidebarLocation[0] === "left" ? "left: " + (174 + sidebarOffsetW) + "px" : "right: 59px") + ";\ncursor: pointer;\n}\n/* Expand Images */\n#imgControls {" + (sidebarLocation[0] === "left" ? "left: " + (155 + sidebarOffsetW) + "px" : "right: 78px") + ";\n}\n/* 4sight */\nbody > a[style=\"cursor: pointer; float: right;\"]::after {" + (sidebarLocation[0] === "left" ? "left: " + (136 + sidebarOffsetW) + "px" : "right: 97px") + ";\n}\n/* Back */\ndiv.navLinks > a:first-of-type::after {\n  visibility: visible;\n  position: fixed;\n  cursor: pointer;" + (sidebarLocation[0] === "left" ? "left: 2px" : "right: " + (228 + sidebarOffsetW) + "px") + ";\n}\n/* Thread Navigation Links */\n#navlinks {" + (sidebarLocation[0] === "left" ? "left: 22px" : "right: " + (198 + sidebarOffsetW) + "px") + ";" + sidebarLocation[1] + ": auto !important;\ntop: -5px !important;\nwidth: 30px;\n}\n/* Stats */\n#stats {" + (sidebarLocation[0] === "left" ? "left: 4px" : "right: " + (186 + sidebarOffsetW) + "px") + " !important;" + sidebarLocation[1] + ": auto !important;\ntop: " + (Conf["Stats Position"] === "top" ? "20px" : "auto") + " !important;\nbottom: " + (Conf["Stats Position"] === "bottom" ? "4px" : "auto") + " !important;\nwidth: 60px;\ntext-align: " + sidebarLocation[1] + ";\n}\n/* Updater */\n#updater {" + (sidebarLocation[0] === "left" ? "left: " + (206 + sidebarOffsetW) + "px" : "right: 4px") + " !important;" + sidebarLocation[1] + ": auto !important;\ntop: " + (Conf["Updater Position"] === "top" ? "20px" : "auto") + " !important;\nbottom: " + (Conf["Updater Position"] === "bottom" ? "4px" : "auto") + " !important;\n}\n#boardNavDesktopFoot::after,\n#navtopright .settingsWindowLink::after,\n#watcher::before,\n#globalMessage::before,\n#imgControls,\ndiv.navLinks > a:first-of-type::after,\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  position: fixed;\n  top: 2px !important;\n}\n#globalMessage,\n#boardNavDesktopFoot,\n#watcher {\n  position: fixed;\n  top: 16px !important;\n  z-index: 98 !important;\n}\n#globalMessage:hover,\n#boardNavDesktopFoot:hover,\n#watcher:hover {\n  z-index: 99 !important;\n}";
        } else {
          if (Conf["Stats Position"] === "top" && Conf["4chan Banner"] !== "at sidebar top" && sidebarLocation[0] === "left") {
            statOffset = 15;
            updaterOffset = 0;
          } else if (Conf["Updater Position"] === "top" && Conf["4chan Banner"] !== "at sidebar top" && sidebarLocation[0] === "right") {
            statOffset = 0;
            updaterOffset = 15;
          } else {
            statOffset = 0;
            updaterOffset = 0;
          }
          css += "/* Image Expansion */\n#imgControls {\n  position: fixed;\n  top: " + (2 + logoOffset) + "px !important;\n}\n/* 4chan X Options */\n#navtopright .settingsWindowLink::after {\n  visibility: visible;\n  position: fixed;\n  top: " + (21 + logoOffset) + "px !important;\n}\n/* Slideout Navigation */\n#boardNavDesktopFoot,\n#boardNavDesktopFoot::after {\n  border: none;\n  position: fixed;\n  top: " + (40 + logoOffset) + "px !important;\n}\n/* Global Message */\n#globalMessage,\n#globalMessage::before {\n  position: fixed;\n  top: " + (59 + logoOffset) + "px !important;\n}\n/* Watcher */\n#watcher,\n#watcher::before {\n  position: fixed;\n  top: " + (78 + logoOffset) + "px !important;\ncursor: pointer;\n}\n/* 4sight */\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\nposition: fixed;\ntop: " + (97 + logoOffset) + "px !important;\n}\n/* Back */\ndiv.navLinks > a:first-of-type::after {\n  visibility: visible;\n  position: fixed;\n  cursor: pointer;\n  top: " + (116 + logoOffset) + "px !important;\n}\n/* Stats */\n#stats {" + (sidebarLocation[0] === "left" ? "left: " + (4 + statOffset) + "px" : "right: " + (Conf["Stats Position"] === "top" ? 25 + updaterOffset : 186 + sidebarOffsetW) + "px") + " !important;" + sidebarLocation[1] + ": auto !important;\ntop: " + (Conf["Stats Position"] === "top" ? "2px" : "auto") + " !important;\nbottom: " + (Conf["Stats Position"] === "bottom" ? "4px" : "auto") + " !important;\nwidth: 60px;\ntext-align: left;" + (Conf["Stats Position"] === "top" ? "z-index: 96 !important;" : void 0) + "}\n/* Updater */\n#updater {" + (sidebarLocation[0] === "right" ? "right: " + (4 + updaterOffset) + "px" : "left: " + (Conf["Updater Position"] === "top" ? 45 + statOffset : 206 + sidebarOffsetW) + "px") + " !important;" + sidebarLocation[1] + ": auto !important;\ntop: " + (Conf["Updater Position"] === "top" ? "2px" : "auto") + " !important;\nbottom: " + (Conf["Updater Position"] === "bottom" ? "4px" : "auto") + " !important;" + (Conf["Updater Position"] === "top" ? "z-index: 96 !important;" : void 0) + "}\n#navlinks {\n  top: " + (135 + logoOffset) + "px !important;" + sidebarLocation[1] + ": auto !important;\n}\n#navlinks a {\n  display: block;\n  clear: both;\n}\n#navlinks,\n#navtopright .settingsWindowLink::after,\n#boardNavDesktopFoot,\n#boardNavDesktopFoot::after,\n#watcher,\n#watcher::before,\n#globalMessage,\n#globalMessage::before,\n#imgControls,\nbody > a[style=\"cursor: pointer; float: right;\"]::after,\ndiv.navLinks > a:first-of-type::after {" + sidebarLocation[0] + ": 3px !important;\n}\n#boardNavDesktopFoot {\n  z-index: 97 !important;\n}\n#globalMessage {\n  z-index: 98 !important;\n}\n#watcher {\n  z-index: " + (Conf["Slideout Watcher"] ? "99" : "96") + " !important;\n}";
        }
        switch (Conf["Board Logo"]) {
          case "at sidebar top" || "in sidebar":
            css += "#boardTitle {\n  position: fixed;" + sidebarLocation[0] + ": 2px;\ntop: " + ((Conf["Icon Orientation"] === "vertical" ? 33 : 45) + logoOffset) + "px;\nz-index: 1;\nwidth: " + (248 + sidebarOffsetW) + "px;\n}";
            break;
          case "at sidebar bottom":
            css += "#boardTitle {\n  position: fixed;" + sidebarLocation[0] + ": 2px;\nbottom: 400px;\nz-index: 1;\nwidth: " + (248 + sidebarOffsetW) + "px;\n}";
            break;
          case "hide":
            css += "#boardTitle {\n  display: none;\n}";
        }
        switch (Conf["Reply Padding"]) {
          case "phat":
            css += "form .postContainer blockquotee {\n  margin: 24px 60px 24px 50px\n}";
            break;
          case "normal":
            css += "form .postContainer blockquote {\n  margin: 12px 40px 12px 30px\n}";
            break;
          case "slim":
            css += "form .postContainer blockquote {\n  margin: 6px 20px 6px 15px\n}";
            break;
          case "super slim":
            css += "form .postContainer blockquote {\n  margin: 3px 10px 3px 7px\n}";
            break;
          case "anorexia":
            css += "form .postContainer blockquote {\n  margin: 1px 5px 1px 3px\n}";
        }
        switch (Conf["Post Form Style"]) {
          case "fixed":
            css += "#qrtab {\n  display: none;\n}\n#qr {" + sidebarLocation[0] + ": 2px !important;" + sidebarLocation[1] + ": auto !important;\n}";
            break;
          case "slideout":
            css += "#qrtab {\n  display: none;\n}\n#qr {" + sidebarLocation[0] + ": -" + (233 + sidebarOffsetW) + "px !important;" + sidebarLocation[1] + ": auto !important;" + agent + "transition: right .3s ease-in-out 1s, left .3s ease-in-out 1s;\n}\n#qr:hover,\n#qr.focus,\n#qr.dump {" + sidebarLocation[0] + ": 2px !important;" + sidebarLocation[1] + ": auto !important;" + agent + "transition: right .3s linear, left .3s linear;\n}";
            break;
          case "tabbed slideout":
            css += "#qr {" + sidebarLocation[0] + ": -" + (249 + sidebarOffsetW) + "px !important;" + sidebarLocation[1] + ": auto !important;" + agent + "transition: " + sidebarLocation[0] + " .3s ease-in-out 1s;\n}\n#qr:hover,\n#qr.focus,\n#qr.dump {" + sidebarLocation[0] + ": 2px !important;" + sidebarLocation[1] + ": auto !important;" + agent + "transition: " + sidebarLocation[0] + " .3s linear;\n}\n#qrtab {\n  z-index: -1;" + agent + "transform: rotate(" + (sidebarLocation[0] === "left" ? "" : "-") + "90deg);" + agent + "transform-origin: bottom " + sidebarLocation[0] + ";\nposition: fixed;\nbottom: 250px;" + sidebarLocation[0] + ": 0;\nwidth: 210px;\ndisplay: inline-block;\nfont-size: 12px;\nopacity: 1;\nheight: 18px;\ntext-align: center;\npadding-top: 3px;\nvertical-align: middle;\ncolor: " + theme["Text"] + ";" + agent + "transition: opacity .3s ease-in-out 1s, " + sidebarLocation[0] + " .3s ease-in-out 1s;\n}\n#qr:hover #qrtab,\n#qr.focus #qrtab,\n#qr.dump #qrtab {\n  opacity: 0;" + sidebarLocation[0] + ": " + (252 + sidebarOffsetW) + "px;" + agent + "transition: opacity .3s linear, " + sidebarLocation[0] + " .3s linear;\n}";
            break;
          case "transparent fade":
            css += "#qrtab {\n  display: none;\n}\n#qr {" + sidebarLocation[0] + ": 2px !important;" + sidebarLocation[1] + ": auto !important;\nopacity: 0.2;" + agent + "transition: opacity .3s ease-in-out 1s;\n}\n#qr:hover,\n#qr.focus,\n#qr.dump {\n  opacity: 1;" + agent + "transition: opacity .3s linear;\n}";
        }
        if (Conf["Fit Width Replies"]) {
          css += ".summary {\n  clear: both;\n  padding-left: 20px;\n  display: block;\n}\n.replyContainer {\n  clear: both;\n}\n.sideArrows {\n  z-index: 1;\n  position: absolute;\n  right: 0px;\n  height: 10px;\n  padding-top: 1px;\n}\ndiv.postInfo {\n  margin: 1px 0 0;\n  position: relative;\n  width: 100%;\n}\n.sideArrows a,\n.sideArrows span {\n  position: static;\n  font-size: 9px;\n  height: 10px;\n  width: 20px;\n}\n.sideArrows,\ndiv.reply .report_button,\ndiv.reply .menu_button {\n  opacity: 0;" + agent + "transition: opacity .3s ease-out 0s;\n}\nform .replyContainer:hover div.reply .report_button,\nform .replyContainer:hover div.reply .menu_button,\nform .replyContainer:hover .sideArrows {\n  opacity: 1;" + agent + "transition: opacity .3s ease-in 0s;\n}\ndiv.reply {\n  padding-top: 6px;\n  padding-left: 10px;\n}\ndiv.reply .report_button,\ndiv.reply .menu_button {\n  position: absolute;\n  right: 6px;\n  top: -1px;\n  font-size: 9px;\n}\n.sideArrows a {\n  position: absolute;\n  right: 20px;\n  top: 7px;\n}\ndiv.reply .inline .menu_button,\ndiv.reply .inline .sideArrows,\ndiv.reply .inline .sideArrows a,\ndiv.reply .inline .rice {\n  position: static;\n  opacity: 1;\n}\n.sideArrows a {\n  font-size: 9px;\n}\ndiv.thread {\n  padding: 0;\n  position: relative;\n  z-index: 0;\n}\ndiv.post:not(#qp):not([hidden]) {\n  margin: 0;\n  width: 100%;\n}\ndiv.reply {\n  display: table;\n  clear: both;\n}\ndiv.sideArrows {\n  float: none;\n}\n.hide_thread_button {\n  position: relative;\n  z-index: 2;\n  margin-right: 10px;\n  margin-left: 5px;\n  font-size: 9px;\n}\n.opContainer input {\n  opacity: 1;\n}\n#options.reply {\n  display: inline-block;\n}";
        } else {
          css += ".sideArrows a {\n  font-size: 9px;\n}\n.sideArrows a {\n  position: static;\n}\ndiv.reply {\n  padding-right: 5px;\n}\n.sideArrows {\n  margin-right: 5px;\n  float: left;\n}\n.sideArrows a {\n  font-size: 12px;\n}\n.hide_thread_button {\n  position: relative;\n  z-index: 2;\n  margin-right: 5px;\n}\ndiv.reply {\n  padding-top: 5px;\n  padding-left: 2px;\n  display: table;\n}\ndiv.thread {\n  overflow: visible;\n  padding: 0;\n  position: relative;\n}\ndiv.post:not(#qp):not([hidden]) {\n  margin: 0;\n}\n.thread > div > .post {\n  overflow: visible;\n}\n.sideArrows span {\n  font-size: 9px;\n}\ndiv.reply {\n  padding-top: 6px;\n  padding-left: 8px;\n}\n.sideArrows {\n  margin-right: 2px;\n}";
        }
        switch (Conf["Page Margin"]) {
          case "none":
            pagemargin = "2px";
            break;
          case "minimal":
            pagemargin = "25px";
            break;
          case "small":
            pagemargin = "50px";
            break;
          case "medium":
            pagemargin = "150px";
            break;
          case "fully centered":
            pagemargin = (252 + sidebarOffsetW) + "px";
            break;
          case "large":
            pagemargin = "350px";
        }
        if (editMode === "theme") {
          pagemargin = "300px";
        }
        if (Conf["Sidebar"] === "minimal") {
          css += "body {\n  margin-top: 1px;\n  margin-bottom: 0;\n  margin-" + sidebarLocation[0] + ": 25px;\nmargin-" + sidebarLocation[1] + ": " + pagemargin + ";\n}\n#boardNavDesktop,\n.pages {" + sidebarLocation[0] + ": 25px;" + sidebarLocation[1] + ": " + pagemargin + ";\n}";
        } else if (Conf["Sidebar"] !== "hide") {
          css += "body {\n  margin-top: 1px;\n  margin-bottom: 0;\n  margin-" + sidebarLocation[0] + ": " + (252 + sidebarOffsetW) + "px;\nmargin-" + sidebarLocation[1] + ": " + pagemargin + ";\n}\n#boardNavDesktop,\n.pages {" + sidebarLocation[0] + ": " + (252 + sidebarOffsetW) + "px;" + sidebarLocation[1] + ": " + pagemargin + ";\n}";
        } else {
          css += "body {\n  margin: 1px " + pagemargin + " 0 " + pagemargin + ";\n}\n#boardNavDesktop,\n.pages {" + sidebarLocation[0] + ": " + pagemargin + ";" + sidebarLocation[1] + ": " + pagemargin + ";\n}";
        }
        if (Conf["Compact Post Form Inputs"]) {
          css += "#qr textarea.field {\n  height: 161px;\n}\n#qr.captcha textarea.field {\n  height: 114px;\n}\n#qr .field[name=\"name\"],\n#qr .field[name=\"email\"],\n#qr .field[name=\"sub\"] {\n  width: " + (75 + (sidebarOffsetW / 3)) + "px !important;\nmargin-left: 1px !important;\n}";
        } else {
          css += "#qr textarea.field {\n  height: 135px;\n}\n#qr.captcha textarea.field {\n  height: 88px;\n}\n#qr .field[name=\"email\"],\n#qr .field[name=\"sub\"] {\n  width: " + (248 + sidebarOffsetW) + "px !important;\n}\n#qr .field[name=\"name\"] {\n  width: " + (227 + sidebarOffsetW) + "px !important;\nmargin-left: 1px !important;\n}\n#qr .field[name=\"email\"],\n#qr .field[name=\"sub\"] {\nmargin-top: 1px;\n}";
        }
        if (Conf["Expand Post Form Textarea"]) {
          css += "#qr textarea {\n  display: block;" + agent + "transition: all 0.25s ease 0s, width .3s ease-in-out .3s;\nfloat: " + sidebarLocation[0] + ";\n}\n#qr textarea:focus {\n  width: 400px;\n}";
        }
        if (Conf["Filtered Backlinks"]) {
          css += ".filtered.backlink {\n  display: none;\n}";
        }
        if (Conf["Rounded Edges"]) {
          css += ".rice {\n  border-radius: 2px;\n}\n#boardNavDesktopFoot,\n#content,\n#options ul,\n#options,\n#qp,\n#stats,\n#updater,\n#watcher,\n#globalMessage,\n.inline div.reply,\ndiv.reply,\ndiv.reply.highlight,\ndiv.reply > tr > div.reply,\nh2,\ntd[style=\"border: 1px dashed;\"] {\n  border-radius: 3px;\n}\n#qrtab {\n  border-radius: 6px 6px 0 0;\n}\n.qphl {" + agent + "outline-radius: 3px;\n}";
        }
        if (Conf["Slideout Watcher"]) {
          css += "#watcher:not(:hover) {\n  border: 0 none;\n}\n#watcher {\n  position: fixed;" + sidebarLocation[0] + ": 2px !important;" + sidebarLocation[1] + ": auto !important;\nbottom: auto !important;\nheight: 0;\nwidth: " + (248 + sidebarOffsetW) + "px !important;\noverflow: hidden;" + agent + "transition: height .5s linear;" + agent + "box-sizing: border-box;\nbox-sizing: border-box;\npadding: 0 10px;\n}\n#watcher:hover {\nheight: 250px;\npadding-bottom: 4px;\n}";
        } else {
          css += "#watcher::before {\n  display: none;\n}\n#watcher {" + sidebarLocation[0] + ": 2px !important;" + sidebarLocation[1] + ": auto !important;\nwidth: " + (246 + sidebarOffsetW) + "px;\npadding-bottom: 4px;\nz-index: 96;\ntop: " + (100 + logoOffset) + "px !important;\n}";
        }
        switch (Conf["Slideout Navigation"]) {
          case "compact":
            css += "#boardNavDesktopFoot:not(:hover) {\n  border: 0 none !important;\n}\n#boardNavDesktopFoot:hover {\n  height: 84px;\n  word-spacing: 3px;\n}\n#navbotright {\n  display: none;\n}";
            break;
          case "list":
            css += "#boardNavDesktopFoot:not(:hover) {\n  border: 0 none !important;\n}\n#boardNavDesktopFoot a {\n  z-index: 1;\n  display: block;\n}\n#boardNavDesktopFoot:hover {\n  height: 300px;\n  overflow-y: scroll;\n  word-spacing: 0px;\n}\n#boardNavDesktopFoot a::after{\n  content: \" - \" attr(title);\n  font-size: 12px;\n}\n#boardNavDesktopFoot a[href*=\"//boards.4chan.org/\"]::after,\n#boardNavDesktopFoot a[href*=\"//rs.4chan.org/\"]::after {\n  content: \"/ - \" attr(title);\n  font-size: 12px;\n}\n#boardNavDesktopFoot a[href*=\"//boards.4chan.org/\"]::before,\n#boardNavDesktopFoot a[href*=\"//rs.4chan.org/\"]::before {\n  content: \"/\";\n  font-size: 12px;\n}\n#navbotright {\n  display: none;\n}";
            break;
          case "hide":
            css += "#boardNavDesktopFoot {\n  display: none;\n}";
        }
        switch (Conf["Reply Spacing"]) {
          case "none":
            css += ".replyContainer {\n  margin-bottom: 0px;\n}\n#delform {\n  margin-bottom: 12px;\n}";
            break;
          case "small":
            css += ".replyContainer {\n  margin-bottom: 2px;\n}\n#delform {\n  margin-bottom: 10px;\n}";
            break;
          case "medium":
            css += ".replyContainer {\n  margin-bottom: 4px;\n}\n#delform {\n  margin-bottom: 8px;\n}";
            break;
          case "large":
            css += ".replyContainer {\n  margin-bottom: 6px;\n}\n#delform {\n  margin-bottom: 6px;\n}";
        }
        switch (Conf["Sage Highlighting"]) {
          case "text":
            css += "a.useremail[href*=\"sage\"]:last-of-type::after,\na.useremail[href*=\"Sage\"]:last-of-type::after,\na.useremail[href*=\"SAGE\"]:last-of-type::after {\n  content: \" (sage) \";\n  color: " + theme["Sage"] + ";\n}";
            break;
          case "image":
            css += "a.useremail[href*=\"sage\"]:last-of-type::after,\na.useremail[href*=\"Sage\"]:last-of-type::after,\na.useremail[href*=\"SAGE\"]:last-of-type::after {\n  content: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=\") \"  \";\n}";
        }
        switch (Conf["Announcements"]) {
          case "4chan default":
            css += "#globalMessage {\n  position: static;\n  background: none;\n  border: none;\n  margin-top: 0px;\n}\n#globalMessage::before {\n  display: none;\n}";
            break;
          case "slideout":
            css += "#globalMessage:not(:hover) {\n  border: 0 none;\n}\n#globalMessage {\n  bottom: auto;\n  position: fixed;" + sidebarLocation[0] + ": 2px;" + sidebarLocation[1] + ": auto;\nwidth: " + (248 + sidebarOffsetW) + "px;\nbackground: " + theme["Dialog Background"] + ";\nborder: 1px solid " + theme["Dialog Border"] + ";\nheight: 0px;\noverflow: hidden;" + agent + "transition: height .5s linear;" + agent + "box-sizing: border-box;\nbox-sizing: border-box;\npadding: 0 10px;\n}\n#globalMessage:hover {\nheight: 250px;\n}";
            break;
          case "hide":
            css += "#globalMessage {\n  display: none;\n}\n#globalMessage::before {\n  display: none;\n}";
        }
        switch (Conf["Boards Navigation"]) {
          case "sticky top":
            css += "#boardNavDesktop {\n  position: fixed;\n  top: 0;\n}";
            break;
          case "sticky bottom":
            css += "#boardNavDesktop {\n  position: fixed;\n  bottom: 0;\n}";
            break;
          case "top":
            css += "#boardNavDesktop {\n  position: absolute;\n  top: 0;\n}";
            break;
          case "hide":
            css += "#boardNavDesktop {\n  position: absolute;\n  top: -100px;\n}";
        }
        if (Conf["Tripcode Hider"]) {
          css += "input.field.tripped:not(:hover):not(:focus) {\n  color: transparent !important;\n}";
        }
        switch (Conf["Pagination"]) {
          case "sticky top":
            css += ".pages {\n  position: fixed;\n  top: 0;\n  z-index: 101;\n}";
            break;
          case "sticky bottom":
            css += ".pages {\n  position: fixed;\n  bottom: 0;\n  z-index: 101;\n}";
            break;
          case "top":
            css += ".pages {\n  position: absolute;\n  top: 0;\n}";
            break;
          case "on side":
            css += ".pages {\n  padding: 0;\n  visibility: hidden;\n  top: auto;\n  bottom: 175px;\n  width: 290px;" + sidebarLocation[1] + ": auto;" + (sidebarLocation[0] === "left" ? "left: -1px" : "right: " + (251 + sidebarOffsetW) + "px") + ";\nposition: fixed;" + agent + "transform: rotate(90deg);" + agent + "transform-origin: bottom right;\nletter-spacing: -1px;\nword-spacing: -6px;\nz-index: 6;\nmargin: 0;\nheight: 15px;\n}\n.pages a,\n.pages strong {\nvisibility: visible;\nmin-width: 0;\n}";
            break;
          case "hide":
            css += ".pages {\n  display: none;\n}";
        }
        switch (Conf["Checkboxes"]) {
          case "show":
            css += "input[type=checkbox] {\n  display: none;\n}";
            break;
          case "make checkboxes circular":
            css += "input[type=checkbox] {\n  display: none;\n}\n.rice {\n  border-radius: 6px;\n}";
            break;
          case "do not style checkboxes":
            css += ".rice {\n  display: none;\n}";
            break;
          case "hide":
            css += "input[type=checkbox] {\n  display: none;\n}\n.rice {\n  display: none;\n}";
        }
        if (Conf["Mascots"]) {
          css += MascotTools.init();
        }
        if (Conf["Block Ads"]) {
          css += "/* AdBlock Minus */\na[href*=\"jlist\"],\nimg[src^=\"//static.4chan.org/support/\"] {\n  display: none;\n}";
        }
        if (Conf["Emoji"] !== "disable") {
          css += Style.emoji(Conf["Emoji Position"]);
        }
      }
      return css;
    }
  };

  Main = {
    init: function() {
      var key, mascot, name, now, path, pathname, settings, temp, theme, val;
      Main.flatten(null, Config);
      for (key in Conf) {
        val = Conf[key];
        Conf[key] = $.get(key, val);
      }
      path = location.pathname;
      pathname = path.slice(1).split('/');
      g.BOARD = pathname[0], temp = pathname[1];
      if (temp === 'res') {
        g.REPLY = true;
        g.THREAD_ID = pathname[2];
      }
      if (['b', 'd', 'e', 'gif', 'h', 'hc', 'hm', 'hr', 'r', 'r9k', 'rs', 's', 'soc', 't', 'u', 'y'].contains(g.BOARD)) {
        g.TYPE = 'nsfw';
      }
      if (Conf["NSFW/SFW Mascots"]) {
        g.MASCOTSTRING = "Enabled Mascots " + g.TYPE;
      } else {
        g.MASCOTSTRING = "Enabled Mascots";
      }
      userNavigation = $.get("userNavigation", Navigation);
      userThemes = $.get("userThemes", {});
      userMascots = $.get("userMascots", {});
      Conf["Enabled Mascots"] = $.get("Enabled Mascots", []);
      Conf["Enabled Mascots sfw"] = $.get("Enabled Mascots sfw", []);
      Conf["Enabled Mascots nsfw"] = $.get("Enabled Mascots nsfw", []);
      Conf["Deleted Mascots"] = $.get("Deleted Mascots", []);
      for (name in userMascots) {
        mascot = userMascots[name];
        if (userMascots[name]["Enabled"]) {
          userMascots[name]["Enabled"] = false;
          if (!Conf["Enabled Mascots"].contains(name)) {
            Conf["Enabled Mascots"].push(name);
          }
        }
        if (userMascots[name]["Enabled_sfw"]) {
          userMascots[name]["Enabled_sfw"] = false;
          if (!Conf["Enabled Mascots sfw"].contains(name)) {
            Conf["Enabled Mascots sfw"].push(name);
          }
        }
        if (userMascots[name]["Enabled_nsfw"]) {
          userMascots[name]["Enabled_nsfw"] = false;
          if (!Conf["Enabled Mascots nsfw"].contains(name)) {
            Conf["Enabled Mascots nsfw"].push(name);
          }
        }
        if (userMascots[name]["Deleted"]) {
          userMascots[name]["Deleted"] = false;
          if (!Conf["Deleted Mascots"].contains(name)) {
            Conf["Deleted Mascots"].push(name);
          }
        }
        if (Mascots[name]) {
          if (userMascots[name] === mascot) {
            continue;
          }
          if (userMascots[name]["Customized"]) {
            continue;
          }
          userMascots[name] = mascot;
        }
      }
      $.set("userMascots", userMascots);
      $.set("Enabled Mascots", Conf["Enabled Mascots"]);
      $.set("Enabled Mascots sfw", Conf["Enabled Mascots sfw"]);
      $.set("Enabled Mascots nsfw", Conf["Enabled Mascots nsfw"]);
      $.set("Deleted Mascots", Conf["Deleted Mascots"]);
      if (userThemes !== Themes) {
        for (name in Themes) {
          theme = Themes[name];
          if (userThemes[name]) {
            if (userThemes[name]["Customized"] && !userThemes[name]["Deleted"]) {
              continue;
            }
            if (userThemes[name]["Deleted"]) {
              theme["Deleted"] = true;
            }
          }
          userThemes[name] = theme;
        }
      }
      if (Conf["Interval per board"]) {
        Conf["Interval_" + g.BOARD] = $.get("Interval_" + g.BOARD, Conf["Interval"]);
        Conf["BGInterval_" + g.BOARD] = $.get("BGInterval_" + g.BOARD, Conf["BGInteval"]);
      }
      if (Conf["NSFW/SFW Themes"]) {
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
                  return window.location = 'javascript:Recaptcha.reload()';
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
            if (/^4chan - 404/.test(d.title) && Conf['404 Redirect']) {
              path = location.pathname.split('/');
              url = Redirect.image(path[1], path[3]);
              if (url) {
                return location.href = url;
              }
            }
          });
          return;
      }
      Main.pruneHidden();
      Style.init();
      now = Date.now();
      if (Conf['Check for Updates'] && $.get('lastUpdate', 0) < now - 18 * $.HOUR) {
        $.ready(function() {
          $.on(window, 'message', Main.message);
          $.set('lastUpdate', now);
          return $.add(d.head, $.el('script', {
            src: 'https://github.com/zixaphir/appchan-x/raw/master/latest.js'
          }));
        });
      }
      if (Conf['Disable Inline 4chan Addon'] || Conf['Style']) {
        settings = JSON.parse(localStorage.getItem('4chan-settings')) || {};
        settings.disableAll = true;
        localStorage.setItem('4chan-settings', JSON.stringify(settings));
      }
      if (Conf['Filter']) {
        Filter.init();
        StrikethroughQuotes.init();
      } else if (Conf['Reply Hiding'] || Conf['Reply Hiding Link']) {
        StrikethroughQuotes.init();
      }
      if (Conf['Reply Hiding']) {
        ReplyHiding.init();
      }
      if (Conf['Anonymize']) {
        Anonymize.init();
      }
      if (Conf['Time Formatting']) {
        Time.init();
      }
      if (Conf['File Info Formatting']) {
        FileInfo.init();
      }
      if (Conf['Sauce']) {
        Sauce.init();
      }
      if (Conf['Reveal Spoilers']) {
        RevealSpoilers.init();
      }
      if (Conf['Image Auto-Gif']) {
        AutoGif.init();
      }
      if (Conf['Linkify']) {
        Linkify.init();
      }
      if (Conf['Png Thumbnail Fix']) {
        PngFix.init();
      }
      if (Conf['Image Hover']) {
        ImageHover.init();
      }
      if (Conf['Menu']) {
        Menu.init();
        if (Conf['Report Link']) {
          ReportLink.init();
        }
        if (Conf['Delete Link']) {
          DeleteLink.init();
        }
        if (Conf['Filter']) {
          Filter.menuInit();
        }
        if (Conf['Download Link']) {
          DownloadLink.init();
        }
        if (Conf['Archive Link']) {
          ArchiveLink.init();
        }
        if (Conf['Thread Hiding Link']) {
          ThreadHideLink.init();
        }
        if (Conf['Reply Hiding Link']) {
          ReplyHideLink.init();
        }
      }
      if (Conf['Resurrect Quotes']) {
        Quotify.init();
      }
      if (Conf['Quote Inline']) {
        QuoteInline.init();
      }
      if (Conf['Quote Preview']) {
        QuotePreview.init();
      }
      if (Conf['Quote Backlinks']) {
        QuoteBacklink.init();
      }
      if (Conf['Indicate OP quote']) {
        QuoteOP.init();
      }
      if (Conf['Indicate Cross-thread Quotes']) {
        QuoteCT.init();
      }
      return $.ready(Main.ready);
    },
    ready: function() {
      var a, board, nav, node, nodes, now, _i, _j, _len, _len1, _ref, _ref1;
      if (/^4chan - 404/.test(d.title)) {
        if (Conf['404 Redirect'] && /^\d+$/.test(g.THREAD_ID)) {
          location.href = Redirect.thread(g.BOARD, g.THREAD_ID, location.hash);
        }
        return;
      }
      if (!$.id('navtopright')) {
        return;
      }
      $.addClass(d.body, $.engine);
      $.addClass(d.body, 'fourchan_x');
      if (Conf['Custom Navigation']) {
        CustomNavigation.init();
      }
      _ref = ['boardNavDesktop', 'boardNavDesktopFoot'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nav = _ref[_i];
        if (a = $("a[href$='/" + g.BOARD + "/']", $.id(nav))) {
          $.addClass(a, 'current');
        }
      }
      now = Date.now();
      Favicon.init();
      Options.init();
      if (Conf['Quick Reply']) {
        QR.init();
      }
      if (Conf['Image Expansion']) {
        ImageExpand.init();
      }
      if (Conf['Thread Watcher']) {
        Watcher.init();
      }
      if (Conf['Keybinds']) {
        Keybinds.init();
      }
      if (g.REPLY) {
        if (Conf['Prefetch']) {
          Prefetch.init();
        }
        if (Conf['Thread Updater']) {
          Updater.init();
        }
        if (Conf['Thread Stats']) {
          ThreadStats.init();
        }
        if (Conf['Reply Navigation']) {
          Nav.init();
        }
        if (Conf['Post in Title']) {
          TitlePost.init();
        }
        if (Conf['Unread Count'] || Conf['Unread Favicon']) {
          Unread.init();
        }
      } else {
        if (Conf['Thread Hiding']) {
          ThreadHiding.init();
        }
        if (Conf['Thread Expansion']) {
          ExpandThread.init();
        }
        if (Conf['Comment Expansion']) {
          ExpandComment.init();
        }
        if (Conf['Index Navigation']) {
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
      Main.node(nodes, true);
      return Main.observe();
    },
    observe: function() {
      var MutationObserver, board, observer;
      board = $('.board');
      if (MutationObserver = window.WebKitMutationObserver || window.MozMutationObserver || window.OMutationObserver || window.MutationObserver) {
        Main.observer2 = observer = new MutationObserver(Main.observer);
        return observer.observe(board, {
          childList: true,
          subtree: true
        });
      } else {
        return $.on(board, 'DOMNodeInserted', Main.listener);
      }
    },
    disconnect: function() {
      var board;
      if (Main.observer2) {
        return Main.observer2.disconnect();
      } else {
        board = $('.board');
        return $.off(board, 'DOMNodeInserted', Main.listener);
      }
    },
    pruneHidden: function() {
      var cutoff, hiddenThreads, id, now, timestamp, _ref;
      now = Date.now();
      g.hiddenReplies = $.get("hiddenReplies/" + g.BOARD + "/", {});
      if ($.get('lastChecked', 0) < now - 1 * $.DAY) {
        $.set('lastChecked', now);
        cutoff = now - 7 * $.DAY;
        hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
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
        $.set("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
        return $.set("hiddenReplies/" + g.BOARD + "/", g.hiddenReplies);
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
      var version;
      version = e.data.version;
      if (version && version !== Main.version && confirm('An updated version of appchan X is available, would you like to install it now?')) {
        return window.location = "https://raw.github.com/zixaphir/appchan-x/" + version + "/appchan_x.user.js";
      }
    },
    preParse: function(node) {
      var el, img, parentClass, post;
      parentClass = node.parentNode.className;
      el = $('.post', node);
      post = {
        root: node,
        el: el,
        "class": el.className,
        ID: el.id.match(/\d+$/)[0],
        threadID: g.THREAD_ID || $.x('ancestor::div[parent::div[@class="board"]]', node).id.match(/\d+$/)[0],
        isArchived: /\barchivedPost\b/.test(parentClass),
        isInlined: /\binline\b/.test(parentClass),
        isCrosspost: /\bcrosspost\b/.test(parentClass),
        blockquote: el.lastElementChild,
        quotes: el.getElementsByClassName('quotelink'),
        backlinks: el.getElementsByClassName('backlink'),
        fileInfo: false,
        img: false
      };
      if (img = $('img[data-md5]', el)) {
        post.fileInfo = img.parentNode.previousElementSibling;
        post.img = img;
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
            alert("AppChan X has experienced an error. You can help by sending this snippet to:\nhttps://github.com/zixaphir/appchan-x/issues\n\n" + Main.version + "\n" + window.location + "\n" + navigator.userAgent + "\n\n" + err.stack);
          }
        }
      }
    },
    observer: function(mutations) {
      var addedNode, mutation, nodes, _i, _j, _len, _len1, _ref;
      nodes = [];
      for (_i = 0, _len = mutations.length; _i < _len; _i++) {
        mutation = mutations[_i];
        _ref = mutation.addedNodes;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          addedNode = _ref[_j];
          if (/\bpostContainer\b/.test(addedNode.className) && addedNode.parentNode.className !== 'threadContainer') {
            nodes.push(Main.preParse(addedNode));
          }
        }
      }
      if (nodes.length) {
        return Main.node(nodes);
      }
    },
    listener: function(e) {
      var target;
      target = e.target;
      if (/\bpostContainer\b/.test(target.className) && target.parentNode.className !== 'threadContainer') {
        return Main.node([Main.preParse(target)]);
      }
    },
    prettify: function(bq) {
      var code;
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
    version: '0.17.4',
    callbacks: []
  };

  Main.init();

}).call(this);
