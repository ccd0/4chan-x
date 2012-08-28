// ==UserScript==
// @name           AppChan x
// @version        0.3beta
// @namespace      zixaphir
// @description    Adds various features and stylings.
// @copyright      4chan x - 2009-2011 James Campos <james.r.campos@gmail.com>
// @copyright      4chan x - 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
// @copyright      Appchan x - 2012 Zixaphir <zixaphirmoxphar@gmail.com>
// @license        MIT; http://en.wikipedia.org/wiki/Mit_license
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://images.4chan.org/*
// @include        https://images.4chan.org/*
// @include        http://sys.4chan.org/*
// @include        https://sys.4chan.org/*
// @run-at         document-start
// @updateURL      https://github.com/zixaphir/appchan-x/raw/stable/4chan_x.user.js
// @downloadURL    https://github.com/zixaphir/appchan-x/raw/stable/4chan_x.user.js
// @icon           http://zixaphir.github.com/appchan-x/favicon.gif
// ==/UserScript==

/* LICENSE
*
* 4chan x Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
* http://aeosynth.github.com/4chan-x/
* 4chan x Copyright (c) 2012 Nicolas Stepien <stepien.nicolas@gmail.com>
* http://mayhemydg.github.com/4chan-x/
* Appchan X Copyright (c) 2012 Zixaphir <zixaphirmodnar@gmail.com>
* http://zixaphir.github.com/appchan-x/
* OneeChan Copyright (c) 2012 Jordan Bates
* http://seaweedchan.github.com/oneechan/
* 4chan SS Copyright (c) 2012 Ahodesuka
* http://ahodesuka.github.com/4chan-Style-Script/
*
* 4chan X
* Appchan X
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
* Appchan X is written in CoffeeScript[1], and developed on GitHub[2].
*
* [1]: http://coffeescript.org/
* [2]: https://github.com/zixaphir/appchan-x
*
* CONTRIBUTORS
*
* blaise - mentoring and support
* aeosynth - original author of 4chan x
* mayhemydg - a current maintainer of 4chan x
* noface - a current maintainer of 4chan x
* that4chanwolf - former maintainer of 4chan x
* desuwa - Firefox filename upload fix
* seaweed - bottom padding for image hover
* e000 - cooldown sanity check
* ahodesuka - scroll back when unexpanding images, file info formatting
* Shou - pentadactyl fixes
* ferongr - favicons
* xat - favicons
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
  var $, $$, Anonymize, ArchiveLink, AutoGif, Conf, Config, DeleteLink, DownloadLink, Emoji, ExpandComment, ExpandThread, Favicon, FileInfo, Filter, Get, ImageExpand, ImageHover, Keybinds, Main, Markdown, Mascots, Menu, Nav, Options, PngFix, Prefetch, QR, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, QuoteThreading, Quotify, Redirect, ReplyHiding, ReportLink, RevealSpoilers, Sauce, StrikethroughQuotes, Style, Themes, ThreadHiding, ThreadStats, Time, TitlePost, UI, Unread, Updater, Watcher, console, d, enabledmascots, g;

  Config = {
    main: {
      Enhancing: {
        '404 Redirect': [true, 'Redirect dead threads and images'],
        'Keybinds': [true, 'Binds actions to keys'],
        'Time Formatting': [true, 'Arbitrarily formatted timestamps, using your local time'],
        'File Info Formatting': [true, 'Reformats the file information'],
        'Comment Expansion': [true, 'Expand too long comments'],
        'Thread Expansion': [true, 'View all replies'],
        'Index Navigation': [true, 'Navigate to previous / next thread'],
        'Rollover': [true, 'Index navigation will fallback to page navigation.'],
        'Reply Navigation': [false, 'Navigate to top / bottom of thread'],
        'Style': [true, 'Custom theming and styling options.'],
        'Check for Updates': [false, 'Check for updated versions of 4chan X']
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
        'Archive Link': [true, 'Add an archive link to the menu.']
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
        'Quick Reply': [true, 'Reply without leaving the page. <span class=disabledwarning><code>Style</code> is enabled. This option will be enabled regardless of this setting\'s value.</span>'],
        'Cooldown': [true, 'Prevent "flood detected" errors.'],
        'Persistent QR': [true, 'The Quick reply won\'t disappear after posting. <span class=disabledwarning><code>Style</code> is enabled. This option will be enabled regardless of this setting\'s value.</span>'],
        'Auto Hide QR': [false, 'Automatically hide the quick reply when posting. <span class=disabledwarning><code>Style</code> is enabled. This option will be disabled regardless of this setting\'s value.</span>'],
        'Open Reply in New Tab': [false, 'Open replies in a new tab that are made from the main board.'],
        'Remember QR size': [false, 'Remember the size of the Quick reply (Firefox only).'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Hide Original Post Form': [true, 'Replace the normal post form with a shortcut to open the QR. <span class=disabledwarning><code>Style</code> is enabled. This option will be disabled regardless of this setting\'s value.</span>'],
        'Sage on /jp/': [true, 'Uses sage by default on /jp/'],
        'Markdown': [false, 'Code, italic, bold, italic bold, double struck - `, *, **, ***, ||, respectively. _ can be used instead of *']
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
        'Forward Hiding': [true, 'Hide original posts of inlined backlinks'],
        'Quote Threading': [false, 'Thread conversations']
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
    sauces: ['http://iqdb.org/?url=$1', 'http://www.google.com/searchbyimage?image_url=$1', '#http://tineye.com/search?url=$1', '#http://saucenao.com/search.php?db=999&url=$1', '#http://3d.iqdb.org/?url=$1', '#http://regex.info/exif.cgi?imgurl=$2', '# uploaders:', '#http://imgur.com/upload?url=$2;text:Upload to imgur', '#http://omploader.org/upload?url1=$2;text:Upload to omploader', '# "View Same" in archives:', '#http://archive.foolz.us/search/image/$3/;text:View same on foolz', '#http://archive.foolz.us/$4/search/image/$3/;text:View same on foolz /$4/', '#https://archive.installgentoo.net/$4/image/$3;text:View same on installgentoo /$4/'].join('\n'),
    time: '%m/%d/%y(%a)%H:%M',
    backlink: '>>%id',
    fileInfo: '%l (%p%s, %r)',
    favicon: 'ferongr',
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
      unreadCountTo0: ['z', 'Reset unread status'],
      threading: ['t', 'Toggle threading'],
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
      'Interval': 30
    },
    style: {
      Dialogs: {
        'Announcements': ['hide', 'The style of announcements and the ability to hide them.', ['4chan default', 'slideout', 'hide']],
        'Post Form Style': ['tabbed slideout', 'How the post form will sit on the page.', ['fixed', 'slideout', 'tabbed slideout', 'transparent fade']],
        'Slideout Navigation': ['compact', 'How the slideout navigation will be displayed.', ['compact', 'list', 'hide']],
        'Slideout Watcher': [true, 'Adds an icon you can hover over to show the watcher, as opposed to having the watcher always visible.']
      },
      Navigation: {
        'Boards Navigation': ['sticky top', 'The position of 4chan board navigation', ['sticky top', 'sticky bottom', 'top', 'hide']],
        'Pagination': ['sticky bottom', 'The position of 4chan page navigation', ['sticky top', 'sticky bottom', 'top', 'bottom', 'on side', 'hide']]
      },
      Rice: {
        'Checkboxes': ['show', 'Alter checkboxes.', ['show', 'make checkboxes circular', 'hide', 'do not style checkboxes']],
        'Captcha Opacity': ['1.00', 'Transparency of the 4chan Captcha', ['1.00', '.75', '.50', '.25']],
        'Emoji Position': ['left', 'Position of emoji icons, like sega and neko.', ['left', 'right', 'hide emoji']],
        'Filtered Backlinks': [true, 'Mark backlinks to filtered posts.'],
        'Font': ['ubuntu', 'The font used by all elements of 4chan.', ['ubuntu', 'sans serif', 'serif']],
        'Font Size': [12, 'The font size of posts and various UI. This does not change all font sizes.', [10, 11, 12, 13, 14]],
        'Mascots': [true, 'Add a pretty picture of your waifu to the sidebar.'],
        'Rounded Edges': [true, 'Round the edges of various 4chan elements.'],
        'Sage Highlighting': ['image', 'Icons or text to highlight saged posts.', ['text', 'image', 'none']],
        'Underline Links': [true, 'Put lines under hyperlinks.']
      },
      Layout: {
        'Page Margin': ['fully centered', 'Additional layout options, allowing you to center the page or use additional page margins.', ['none', 'small', 'medium', 'large', 'fully centered']],
        'Reply Spacing': ['small', 'The amount of space between replies.', ['none', 'small', 'medium', 'large']],
        'Compact Post Form Inputs': [true, 'Use compact inputs on the post form.'],
        'Expand Post Form Textarea': [true, 'Expands the post form text area when in use.'],
        'Fit Width Replies': [true, 'Replies fit the entire width of the page.'],
        'Hide Sidebar': [false, 'Hide the sidebar. This option can be dangerous and causes content to overlap, but in conjunction with other options, can reduce unnecessary space.']
      }
    },
    theme: 'Midnight Caek',
    styleenabled: '0',
    navigation: {}
  };

  enabledmascots = {};

  Conf = {};

  d = document;

  g = {};

  Emoji = [['Neko', 'BMAAAARCAMAAAAIRmf1AAACoFBMVEUAAABnUFZoUVddU1T6+PvFwLzn4eFXVlT/+vZpZGCgm5dKU1Cfnpz//flbWljr5uLp5OCalpNZWFb//f3r6+n28ff9+PRaVVH59Pr//vr38vj57/Dp7eyjn5zq8O5aVVJbYV9nVFhjUFRiWFlZVlFgZGOboJzm5uZhamfz9/bt8fDw6+drb26bl5j/8/lkX1z06uldWFS5r61UT0tfWlbDwr3Ew76moqNRTU7Mx8P75OpeY19pWl1XW1qzr6x5eHaLiojv7+1UT0xIU0uzqadVS0nV0MxkZGT5+PPk497///ra29Xq5eFtY2H28e2hnJignJlUUE1dXV2vrqxkY2FkYF/m3d5vZmfDuruhl5aZlJHx8O75+PZWVVP29vT/9fTj3trv6ubh5eRdXFqTkpBOTUtqZmX88/RMQ0T78vPEvr7HwcHDwsDq6ef///3Gx8H++fXEv7tZWVedmZZXXVudnJp0c3FZU1f79fnb1dlXUVVjXWFrZmy8t7359/qLj455e3q4s69vamZjX1zy4+avpaReWFz/+f1NR0vu6Ozp4+f48/lnYmi8ur3Iw7/69fHz7+xbV1SZmJZVUk1ZV1zq5ez++f/c196uqbDn4uj9+P7z7vRVVVXt6ORiXl/OycXHw8CPi4ihoJ5aWF3/+v/k3+axrLOsp67LzMZYU1m2sq9dWF5WUU1WUk/Au7eYlJGqpqObmphYVV749f7p5Or38fPu6OpiXFz38fH79vLz7urv6+hhYF5cWWKal6D//f/Z09Xg29exraqbl5RqaW6kpKTq5uPv7Of/+PDj29D//vP18Ozs5+OloJymoZ1ZVVJZWVlkYF2hnpmblIyspJmVjYKQi4enop5STUlRTUpcWUhqY1BgWT9ZUjhcV1NiXVkkhke3AAAABHRSTlMA5vjapJ+a9wAAAP9JREFUGBk9wA1EAwEAhuHv3dTQAkLiUlJFJWF0QDLFYDRXIMkomBgxNIYxhOk4wwCqQhQjxgxSGIsALFA5BiYbMZHajz1oJlx51sBJpf6Gd3zONcrqm/r1W8ByK0r+XV1LXyOLLnjW6hMGpu0u1IzPSdO17DgrGC6AadrVodGcDQYbhguP6wAvAaC0BRZQalkUQ8UQDz5tAof0XbejOFcV5xiUoCfjj3O/nf0ZbqAMPYmzU18KSDaRQ08qnfw+B2JNdAEQt2O5vctUGjhoIBU4ygPsj2Vh5zYopDK73hsirdkPTwGCbSHpiYFwYVVC/17pCFSBeUmoqwYQuZtWxx+BVEz0LeVKIQAAAABJRU5ErkJggg=='], ['Madotsuki', 'BQAAAAPCAMAAADTRh9nAAAALVBMVEUAAAC3iopWLTtWPkHnvqUcBxx5GCZyAAARERGbdXJrRUyGRUyYbY23coZFGDRFGEYfAAAAAXRSTlMAQObYZgAAAGhJREFUeF5Vy1kOQyEMQ1Fshzd12P9y61AixLX4yJFo1cvVUfT23GaflF0HPLln6bhnZVKCcrIWGqpCUcKYSP3JSIRySKTtULPNwMaD8/NC8tsyqsd1hR+6qeqIDHc3LD0B3KdtV1f2A+LJBBIHSgcEAAAAAElFTkSuQmCC'], ['Sega', 'CwAAAALBAMAAAD2A3K8AAAAMFBMVEUAAACMjpOChImytLmdnqMrKzDIyM55dnkODQ94foQ7PkXm5Olsb3VUUVVhZmw8Sl6klHLxAAAAAXRSTlMAQObYZgAAANFJREFUGJVjYIACRiUlJUUGDHBk4syTkxQwhO3/rQ/4ZYsuymi3YEFUqAhC4LCJZJGIi1uimKKjk3KysbOxsaMnAwNLyqoopaXhttf2it1anrJqke1pr1DlBAZhicLnM5YXZ4RWlIYoezx0zrjYqG6czCDsYRzxIko6Q/qFaKy0690Ij0MxN8K2MIhJXF+hsfxJxuwdpYGVaUU3Mm5bqgKFOZOFit3Vp23J3pgsqLxFUXpLtlD5bgcGBs45794dn6mkOVFQUOjNmXPPz8ysOcAAANw6SHLtrqolAAAAAElFTkSuQmCC'], ['Sakamoto', 'BEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAxVJREFUOE+Nk19IU1EYwK+GQQTVQ39egh6ibKlzw91z7rn3bvfOmddNszl1bjKXc5rJJGmBUr7Yg9qTD0IalFgRBEYg6EDQQB+GovQyQgiaUZsoLcgHMcr069w7MgcGXfi453zn+37fv3MYZt/n99e76tzVj4JN/hP79fvXnV3hnNabwUBjoOHcgTYOu/JQspgTzsqKgn9BfD4vkWTzur287PqLVy+zM+yePB7KsRXLywTjnSpnZctBkPCdW8ccDuU55vBO8RXbkC/oP5ph19V5+7LIky0OY1BKbZEbLcFSt7u6pN7jLmltCVrr3DV5jY3+KovFEsccB1KJNVpefe10BqS2tqqO4/AuphBB4L/LkrRqNgtJs1lMypLls1kU38mytMLz/E8VIlutqVqX6/weZG52OttRXjbE0cP/FYLRlpVjDXuQ/r77x2XZPKkCHA4HBAIBkCQpAygIAvh8Pu2MZgO0Lz+QSa/sQfwN9RfpVN66XC6Ynp6GhYUFGBwczAC1t7fD0tISxONx6O7upgHILmsqvLcHodOggfiV/v5+SCaT4HQ6IRaLgdfr1bIRRREmJyfBZrNBNBqF+fl5sNsdgE2GiAbp6bmbdbXC7qWQbxMTE7C2tgY6nQ5SqRSEw2ENopaoZpCXlwdTU1NaoECgCbgiU6y8QH+ECYWaTymK7TWdys7MzIwGaWtrg42NDejo6AB1WjU1NZo+FArB2NgYrK6uQrAlCASxn2z6wkuMp87VIAhkE2MEAwMDkEgkYHx8HBYXF0HtkQpRy1BLiEQisLy8rPVNKSsFjEzrXH4+z1hlS4xDhKadNu7t7YPR0VHweDzAEVWfHru6HxkZgeHhYVAURYNjkylVWKArZjjMzqmdVi+QCsLUkQiEjvDvncEkvU7/qQ0Vgukeo48Go87IiCJnZNmipxiz7wXEbVDnbUxQOgM12h9n6qTq6NvapRdtkwaP0XK8RmPuYSbxYfaQ/sJJhjfknuFRURUi7AMOozcCwl94hLZp5F+EioDQVwqYI6jomZU1NFtM+rOSxZjVazcyvwHr/p/Kws1jegAAAABJRU5ErkJggg=='], ['Baka', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA0pJREFUOE91k3tI01EUx39JOpA0H4jNx0pbD3XTalISWf8YFlEgldqDsBLLyqjEKBCiLLWiggh6/KEV1WZ7OaelLZvDdDafNW1JFraWe/32+01FrUZ9uy4ylLpw4Z5z7/nc77n3HIqaMRIjZJyEcNX+uFCFeGmI/GZciEIsCFJUTvoAzDz+1y7K76MSwhX5hXl6z+WSbrzU2KB8YEGDwgrTaxZ3b7xHcaHhR3xw7Z5/UviB1ReP5XSg3+TAqYJOxMzWISFIC0GQDomhTVA9skCnsaAwp/vnMq66dBokNuBR9uFd7T9Z1zCunjci0qcRJUVdoJ3DYOhRnC/qBZ+jQbfeCc+37yjY2UEg0iwvJE0k9l8Z+8xqHmTgot0QLdQgTaQFQ2AsOzlHvOu1S5pwOLsHHo8HjHMCq2MazNvTlByKHyrJLDvdR25jMWRxYx5HjeMH2r1BDOOeguRua4OI14jx8a8YH5tA+al3EHKlW6mYOapb2oZBOOwMbEMseAE12L+jjUh3w+VipyAZ65oxn1NP/GMYGR6Ftn4Qsf7qa9S82Y/l/X122G0uL2TbxmZEz1WhXW8mUol8moXu+SCi/OoQ6VsDh3UUwyQ1k9GOaI5MTkX4yWTGHutvgI1F28sviAlRgxeoRm62HvsyW8En9pZ1TYgi6TntoyQtFm86rVgUoJZRvDnKMmXVAGxWmkAYOBwudBqGcHCvHulrGpGT2Uy+z4yT+QYsCXtCUpp8GxbKhx8gDK0ro+KjJGvzdjfDZnN6VdisLD5/JjArQ2zW66PJOj2lEZtStaBphkwah7K6kMJ/GEulp1bMWhAmMbTozOQRaWRtfoZVgjo4iRra4SYgGi26TwjxVeDKhR7Y7U606ixICq9tr7hd7+OthRWL7yUnJ1WPmXotqLhpRICPHCePtuFV6xdUPTAhcWEtRHEqfHpPyto4hPXLXnzflSEJnFaN3OCKDcsFsrEntR9RUmxARLAUgT5iBPuJsXWDBj0dZjRU9yNV+PTbpjTp9OA/pOSk24nRkXf1J462oPxcJ65f6ULlHSMulepRerYDgvj7A0cKpNz/tyTZqbzXO4t0ZZGQJ34RH11lFHIlA8LIqreCCMUZRY3cd2bwL/5/RmjNSXqtAAAAAElFTkSuQmCC'], ['Ponyo', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAuNJREFUOE+Nk3tI01EUx39BTytConQTt1am07m5abi5KT5S8z2dj1yOEMUC7aUgIoimlmUEWX9kBZGWaamEmE6U1BI1XNPNGTrnHs33IwuSXrL4NgcJ0mNdOHDh3PPhnPP9XoKwcroJYvMQiRSicHCQKCgUyZC9/T5rNet5KUFs0zCZbZMsFmZ9fTEjEEBDp4/KSSSb/4JoGIyWaTYbiykpWEhOxhSHAzWD0aqkUGhWAcVkW58xlvuPhfh4zItEmOHxYDR3MhcdDaNAsKJydAz5IySKRNjEUmy88vjOVaU8F0iPCqCNjEBHkC/UYaGYFwqxmJoKLYOhkxPElg0QsbNtTlmox9yjRD9UCbnoOR+J/lwRWtOCcdXfDc2BPpg0d7CQlIQZPh9KKlVkAQjJ2x2zmOSsQu7hpzUJfBhLjsNQmADjxcT10Bcl4rE4EHc5LjBEhEPn7f1WTqXSLQB/s1Tp7vslsoIkyPPiMJAbi86McBguiaHKjoEqR4jJy2K0nAxApzMN5iUGrclrKVaz2fUvuF4tRbxDKA90w5VjTFyLZKHpTBSq4/1QnxGB2qxoVIZx0JopRCPHFSNOThfWZzfrXDcZEowH4iA05ATg68hDtBaL0HAuCm3lJ9Bfcx2fFNUoi/DCjRgfNHHd1wCZA2TyXjNkE6F0cBDpPFiojeNi8EkJdFoN3vXch0nbBJOhDd907dANv8JITxNqziag3ZsJbUDAwLin50Q9QWwl1qSYoNOVvUcOoqOqAAa9Fu9H2/F9+B5WZLcwOyxFX18flLI+VASyMGVeoJHD+Tzq5BS1PoaKRrNT8127P74swsq4FCa9FKvqBqwaOiz3hdEuLKueYSyECT2LNW0eIfo3E/WmEbvnG1MUJnWdpWhDGDvxQXZHo+RR0uW2tnv+auPX+TvtJm7zKpaen/4y2yjBUlcxlvtvmvT16ZWDpQeoVv3/60F/NrHjTf4ugazIXtJ8ivjnz/sJ+yGQRjcqUdIAAAAASUVORK5CYII='], ['Rabite', 'BIAAAAQCAYAAAAbBi9cAAAD/0lEQVR4Xl2MXUxbdQDFz/9+9Lb3tkBLCxTKhzgoOOZAsokbJmZxDFHnd+LL4hKVzBgfNCY++ODbjDEaZowvErOM6HRu6hKZY2rIAOkCY4OSDTpFaAsrlJa2t5+39+NvjT7tnJzknIfzI98Nf/C6TuXdguWBd1q9rcb8/CwsZiu2Ywm4nDVo3VWLZCKDaDwJq9mCg31PgjAMKKUwmcyYvTbek9iJRDm6M/XswEDjwNz6plWW6wdZhjUAintFCEEhn0N04zYskljaDLaj8ar49oUrsYR6mrFJNj322w46H8y+mitM/ZJKZmyE4XAvjJSsazpyuSzslVZIkgWKOvvRgQ6Xrdlhqmds7o7bFZoLkctreKxf7GtuCE7IyUQjBQcQ8j/lvxCGQJZz0IoCVpamTtzfIh9nwiaIrCQyjNg8mq11oDLUhNXRJfT1Ozr3tS/PqpnQ80qRgjAmKIqBfK4ItbSLKoOZqR/6neLkENlSUAIhlktvEf+sD2rkm8nWTHtvZCGMVON1ePuaoBER31/MXGly1wSqq9Uug6FluYyWXJiPqFXmjd4Dh9oF9ZKKimYXRtYCx8lmMIDIxlIPGz591av0mtanF7FcCEN6iMXeox2wOJ0QJAmUAoRQaIqCnWAQY1/ewKNGNeQuYXkm0d2NC2e+wvmRr/Hx+6+8PHayrbDyyQBNDb9As3PHKDWG6MTM23RoeJAWsqeoWvyUUv0UHf7pBB0fe4OeeXe3/vmHbx3+8dwIGJ4IsFpMMFe0fbtAn+nwZePr1u4MBK8XIALG/Rt479wYrs2vgeNNAMNgMbiNzybuoKVvn+Gs9kbr6qpBfJfGYHFIkJUCoGwfqcoMX/b27EGhwgOjoCADDlP+CA51ugFFRzoB8FYNaQ1oqKD44+eNL+wNj7zJGQSIhe8+jgQ9thk+27v/KRY6L4FSCkVOwtlQj6P73Qgt/o1ERoKt4iUkE7+jrZMHyzIoK9cOBFfT4LbWAk+0a7ZLnvqHcTNdACgFScfAcjxEdy00VQclHGo7dqGeYxHbvIo6hwhSghCehb3G5p6eW7VxXC5/xGWToMgrKKoaCnIalI9CIARasQAqloMI/x4BWrLLYwE1AEPTwCGHaGjz7pw/leZUNV8wNm9BLy6CxsvxZ1kMbaY4TKIIXlNBsynoVjvAC4CuAoYOVi+CMfLYCUfg95tPHuzZB0YtKzsb58RMucWE/fZmhCbdOP9rNnLnxko6GVoB8lFwyVVw8b/AyeulHoJyN4Rb19dTFyeqBlu6njvfsWcvOJvLs7DMmw/7bvpeE4pU2OIcgcqmp4fGAgt2Txwvqr7lTp5V7LquZxXC6+BqEvGcY5pyjaM1tffJbk89NE3FP5VQ6y7a+paZAAAAAElFTkSuQmCC'], ['Arch', 'BAAAAAQCAMAAAAoLQ9TAAABCFBMVEUAAAAA//8rqtVAqtUQj88tpdIYks46otwVldUbktEaldMjldM2qNcXk9IWktQZkdIYlc8mnNUXlNEZktEZlNIYktIWlNMXktE7o9klmdMXktFHqdkXk9EWk9EYk9IlmtQXlNEXktAWk9AWlNEYlNFDptkZldMYk9E4otg/p9kXktEXk9AXlNA4otclmdQXk9IYktEXlNEwn9YXk9IXk9FFp9o3otgXk9FPrdwXk9E2otdCptkXk9E/ptkcldIXk9Edl9IXk9EjmdUXk9EXk9EXk9EbldIcldIjmdMmmtQsndUvntYyn9YyoNYzoNc0odc1odc2odc6pNg7pNg9pdlDp9pJqttOrdzlYlFbAAAARXRSTlMAAQYMEBEVFhgcHR0mLS8zNTY3PT4/RU1kdXp6e3+Cg4WIiYqMjZGXl5mbnqSnrbS3zMzV3OPk7Ozv8fT29vf4+fz8/f7SyXIjAAAAmUlEQVR4XlXI1WLCUBQF0YM3SHB3a1B3l7Bx1///E6ANkDtva0jKbCW2XIH1z2hiZEZ4uUgxo7JedTQye/KN/Sb5tbJ+7V9OXd1n+O+38257TL+tah3mADAwSMM7wzQWF4Hff6ubQIZIAIb6vxEF4CZyATXhZa4HwEnEA+2QgoiyQDnIEWkjVSBBZBqXbCRlKYo8+Rwkyx54AOYfFe7HhFa7AAAAAElFTkSuQmCC'], ['CentOS', 'BAAAAAQCAMAAAAoLQ9TAAAB5lBMVEUAAADy8tng4Ovs9tnk5O3c7bX44LLduNO1tdDh7r/eutj43q2kocX23az07N+qqsvUqcmXl7331ZXJj7r40o/Pn8T42qP63KjNw9n21p3Y387Ml7732JzR55z05MSxtMLGn8TC4Hx8eqt8e62Af6/B4HnG4oPC4HzH44fBf7LCgbOkoMTcsrmtn8PWqcfFtKrj4Jvs2ZOz2FnMqLXT3KfY5p60Z6NUU5XRuqHzwWSywqDn3JaiiLWahrWhkry5zJjRmqm1Z6P1wmb1y319fK632mK5cKi5nH+73Gu73Gy73W283W+9eK17e6y1yZS3aqRZWJdcW5ldXJplXZppaKBwb6VwcKV5eKswL306OYNPTpGkfK+m0kGpUJWq1EnEqIuXK3+Xh7ahP4qhkryMfK6BgK+CdpGMaKKMa6O9ea2+eq6+oYW/eq+NbqWVlL2Wlr7AjanA4HnA4HrBkqbBlafB33rCgbLCmKjCxIzC1mSs1UytV5mtxIWt1lCuz2evWpuvXJywxYzHjrvH4oXIjrrN2HXO5pTO5pXUlYnUlYvVl5Hb0G7e0XTg03rhr5fpzHPpzXTp0Hvtz3/wrDHytknyt0zyuE3yuVHzvVr0wGP1x3T1yHf1yXe0ZaL2zYP30o730pD31ZeRIcF5AAAAQ3RSTlMAFBkbHEhJS0xMTk5UWWBsd4SEiIiPkJCVlZaam6CjpK29wMPDxMTFxcnK193e3+Dg4uTn5+fo6e/v8/P4+fn7/P7+J4XBAAAAAOBJREFUeF5Vj1OvAwEYBb/yGlu717atLW0b17Zt2/6nze42TTpvMw8nOZCAmwUpiIY6c5IiLi9tPX64GairqszHQ4X2VB64v1Cs6PxMPJSdHM777s6/jyaMRGiRLyyrb88OpjZ3CzAXrm1sqzSNNeN7kVBPNgB7cG51abE5l9cXDces7emQ1uadHhutFUg6gpPKkSIqQGavwz7r7O/+/3t/rSdjI9XDM3qz4fr3B/3iA0aJTG9x71+9oR/PLDwUe2wm19bly+fTIxHyEETatbPewGEw6Mk/tKZCEqSQQUlIHB/QNBEjjVN1AAAAAElFTkSuQmCC'], ['Debian', 'A0AAAAQCAYAAADNo/U5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAZ5JREFUOE+Nkk0oBHEYxv8fu5GQj3JwcaDkIAc5IpR87M7MKnIVJVKclaIQ5Sy5OLkgR7n5OigcSNpmd2c2Vyfl4KT8/muWiVU79TTv+7zv837NCBF6PG1X+NpZyEYSD9mIc+tHnBPe23B9xKrCuTmbQA/JKfABrhBswa1hH4A38IwfOxPdX1qcjiCQxO5NyrjKV70TnSbeRPwJvGN3i4yyqnEucPY8ZZX9GSEgGK+RvFfyjk2VKZxzBNG8wJWWgh/xtDOeUXZ7Slr6TrSLYL9N4SMgYTTcwdc2ArvJcElhSVcM6mCNSV8n9hA59yTU5UWMG6HIbLhIWlglgWiC2L4Z79qTdo40D6ISuOWwKCWHyk9Fv8ldpUHOuGTuynwSBUynddPdlbEosVpP9Eu4FnOsRzUYNTsdmZN/d5LDiqM0w+2CMdAFFsFGWgfXxZnheqe/z+0puwEM0HHYV3Z9Sgz8TEz7GkQvpuJ/36ggj2AaHLrSlkULWV5x+h2E8xkZL16YVjGNaAUscfZ/f6c/k9ywLKI2MMcRWl0RLy007idmRbQJ7RIfDAAAAABJRU5ErkJggg=='], ['Fedora', 'BAAAAAQCAMAAAAoLQ9TAAABPlBMVEUAAAApQXIpQXIpQXIqQ3UpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIqQ3QpQXIpQXIqRHYpQXIpQXIqQ3QqRHYpQXI8brT///8uTYMpQnM5Zqg5ZqnS1+I4ZaY4ZactSn8uRnYrQ3MrRXgsRHUsR3s8bbM8brMtSX4wUosxVI01XZw2X50vUIguToQvR3c6X5o6aKs6aq08Un8qQnM9VIFDWINJXohKcKlXapEqQ3UvUIc2X55bhcBdcJVgcpdhfapmd5tuk8dxgqJ1hKR5jbB6iah/m8Shudq3v9C4wNG/x9bFy9nFzNnFzNrIz9zK0NzK0t/O2+3P1eA2YaDU2eTb3+jb4Oje4urj6fHm6e/s7/Tz9fj3+fz7/P38/f3+/v83YaEa/NNxAAAAHnRSTlMABAoVGyY1SVlpeIuQsLfDzdHW4+3y8/b39/n6+vr4+ns8AAAAyklEQVR4XiWN5XrDMAxF75KOknYdZJS0klNmHjMzMzO9/wvMcH7I37mSJShsJ+5NjMT6umDoHyXDcI/2qJadh++P3cle1de+9yPe3/bTY92wzfzr7wGtP3JrAI72BZGVtcAdQlwHy+JS1pDbBE9qamZF3BYrjQxPEXwKc6dC8bXFm0QIpmt8kn0Rn093q82UCtK8oXZckwFJzuulV8bHkajPyXdbnJnARfDHs0trz+JQ+5AFvzp/L0+cL2qPAINUPrq5OC6p/64F/AMnrST+Dq/r7QAAAABJRU5ErkJggg=='], ['FreeBSD', 'BAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAABIAAAASABGyWs+AAAABmJLR0QA/wD/AP+gvaeTAAADXklEQVQYGQXBS2wUZQDA8f83j33M9rF9d7u4loaWklaDpkSo9KDGaIKUaGxshD2YSPRiuDVeTDyhBxosJCoa40ktpAkPDcUqAYVIpUSUPrAulEdD2bbb7e7ObGcfM/P5+4kwKDvq6yJ1FYYcvb+YAkqAHo/HQ7FYrFIoCiurq9ZXJ06YSOkA+kBzfX06bys3zHxS9EL0tXDVyZfefacqV+X/ZSJx5+qLbx98LhaL9RiGEZWlEsWC/Thd9q6Pf3vs2u6Orc83rFsvTwwfLf5obgywT1Vjh2Hh+rbNsnTssJdNLedK5aIrpSuldKVXKsnH4+Pyn6FDXn5tMef9O+3NvdkvP1V4+EYw2AoQ+KSx8dRYS6NXXnwovaItXduSrrkinWxGOmZWJi9OyOK9m1LmsjIz9IH8QUMOd3WfAQwNKCy2tJwbHB5+XasPaxIHmc4g7WWEZ1MquBiRFlJTf1E7+Tl/H/8asavPzTY1nWd2ZkMDRPeBeHPz5ojwsilEQCBvTSKunCF3M8FSNkBGVTHDYYrLj8jVNhDZ2SMa2zo3MTamaIC/u6Ojr3DtrOrvP0BpdATnyBeIhTxpR5ABUlKSUlXS1dWstbVxdz6hPL0l1quGqkLaKwNvVcjEXNRd/4mit4Z19DjefBEPyCKxgQJQcF28dBrHNDGTSZSezsjeff0hraa2Vs2vrvit81O4vj9xLJcC4ADrQA7YAGqBGsAql/EtLdFQE/L7dF1XZmdnSrbPMJfXoLDmolQK8gJyQBowgQhQDRQBD+hsraVhd4e5MH+/oExfvWLJ9q3/3S7qMpNH2hsS40kFS4EUUAMA2IANRIBXv4uzuO67c2PykqkA5YmZ6bN18YPi0Yoknxc4AsJPCMLVAk2BLKDosCWqs/PZaulkuxk9fekcUBAAQGDks5FT0W++3NuYuC0DVUL4DIEdlIQDAj0IRkigaMjArkFx0tf523sffrQHyKsAgHPhwoXLL+yP9/kePNhk5ExUTyKFkJVAUAiCFZrQup4Rv9ftuLV/6ONBYBVABQAArMvJ5MXW7duD6P62sD8UrPAFRU1TpeCpCnGvPZr7WW///v0jpw+VC9ZdAAABAAAAAMLo7drWrmQyPWG/r8tnaGIjaM05ujr16x/ZBFh5AACA/wGZnIuw4Z4A3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMi0wNy0wNFQxMDowOTo0OS0wNDowMOPVpFwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDctMDRUMTA6MDk6NDktMDQ6MDCSiBzgAAAAAElFTkSuQmCC'], ['Gentoo', 'BAAAAAQCAMAAAAoLQ9TAAAB9VBMVEUAAAD///+AgICqqv+AgIC/v9+Ojqqii9GAgKptYZKQkOmPj/ddUYBgW4eVjeCTgfiWjO5wbJaZkvPBvepkXomYkNldV4Bzbpl6dJ+Uj7ynoO6Vi+1qZI63se2mnudjXYjOy+GCfaqZjvWlm/Pc2e+Oh7NeWIOWjfeXjeW1sd+gl+diXIfp5/KHgKnn5/F2cZx6c6ZgWoXc2e6dltrAvNu0scrX1eTOyujCvup4c5qpovVpY43///+6uPPJyPXq6fvm5vrz8/z8/P7+/v/d3PixqvmxrPSyrfe0sPO0sfS3tMve2/3r6vy6ufPz8/3d3fi3tM63tPO4tsu5tsu5tvO6tfe6t/Vva5KRjKy7tvW7t/W9vPO/vM+/vvPCwfPEw/TFwvTFxOfGxfTGxvTHxvTIx/TJx/aTiOrNzPXNzfXQzfnRzuHS0fbS0vbT0uHU0e/U0uTU0/bW0+zW1ffX1vfY1/jZ2Pjb2/jc2uSTiemVkLSlnvbe3PTe3vng3fzg3f3g4Pnh4Pnh4fri4enj4/nk5Prl5Prm4/ymn/bn5vro5/rp6O/p6funoPWsqs3t7Pvt7fXv7vzv7v3w7/nx7/3y8f3y8v3z8vytqPWuqPX09P319P319P719f339v739/34+P35+f37+/+uqev9/f6vqvSwrPQAR0dcAAAAPHRSTlMAAQIDBAgJCwwVFyAsNUFHSVBneH+Bh4mVmZmanKCxsrK2tr3ExtDW19rb4ODl5u3t7u/w8/T6+/z9/f4MkNJ1AAAA8ElEQVR4XjXNw5aDURSE0YrRtm3b54+dtm3btm3bz9k3Wek9+2pSYFwT8ibzE93hwAtdJqK3nZo4J9hFXbP+vFHOthV6gnGzstZq94wdCs4UCCDymQ2v7X0LdYoSQ0MIENRYzJbRlPTTHu73ZNAL8vivmVui98PpzuqffX0mIPHJGtOQenukteJ+aS3b9htNpDnT9TeZH1bHAwBRMhGpd6e6uNrLoRgxBKmsX47nBlp678ojpEA40fejcmW4e/No0V8IIPfj6eKgbEJ3ZUnzgE1OqWp9Q3VeWRAsg51f1dZ8c31RmAsc+N5JGbG+zvj3BzDCPrzMDC9SAAAAAElFTkSuQmCC'], ['Mint', 'BAAAAAQCAMAAAAoLQ9TAAACVVBMVEUAAADh4eEAAAAAAAAAAAAAAAAAAAAsLCyXl5dgYGCnp6eTk5N3d3fBwcGqqqq8vLzNzc3Ozs7Ozs7Pz8/Pz9DQ0NHR0dLS0tLS0tPT09Pf3t/Pz8/i4eLb29vZ2drZ2tna2dra2trf3t/u7O/u7e/u7O/r6+vt7O/w7/Lw8PDy8fTz8fXz8fbx8fHz8/P19fb49/j49/n6+vuPxlmWyGOx437h9NDr9eD6/fj////+/v75/vTA5Jv6/fb7/fnL5bDL5q+AxjeDxUCEzTyGxUaGzjyHxkiHzz6J0D+Kxk6K0kCLyE2M00WNy06P00mSz1OUyF+W2FGX1FiY0F6Z02CZ21ac0Wiez2yfz2+f2mOh4GCi4GOi4WKi4mOk12+k3Wul32um1Hin0nun4G6n5Gin5Wmo23Op2Huq1n+q43Cr526s4Hit23+v6XSw34Cw34Gw6nWx4IKy4IOy44Cy63ez146z34az4IWz4YW03Y217nu38H2625e645G74pK83pu98Iq984W+4ZjA4px0tzDA5ZrB8ZDC5p7D55/E947F6KHF+JHH4qvH6qTI46/K5LLL5LN1tzLL5bN1uTDL57DM5bPM6qzM66/N5rTP6LbP6bTR6rfS573T67vT7LrV7r3X68XX7MHX773Y77/Y9rvZ8cHa7cjd88bi88/j8tTk8djk9tHm8trn89vo89zo9N3p9N3p9d7p9tvq9d/s+93s/dzy+erz+O73+vT4/PX5/fT5/fX5/vN1uzB3vTD6/ff6/fh5uTj8/fv9/vr9/vx8wjV/xDmrMRH0AAAAOXRSTlMAAAECAwQJDzk/RUlNU3F0kpSVlpeYmpucnaKjpKWqqqqtu8LExMTEzdTU1NXY4evy8vP+/v7+/v6LaR1mAAABD0lEQVR4XiXI03bEABAA0KltW9kaW3eSZW3btm3btm3b/q4mp/fxgqKOtpamhrqaqoqykrQYABh+PVMU9fjE5Xp8o54kgPHN0EBHU2N5YXZykiua0HHd2759VF2Sk5IYE5GGsmCEWLV1kVWwt5O+3x/qpgsy8k4ja+cJl2/v5C22tlgCAHtw9TQSa4s+AzfPSm0BRNl9SydhWJzLC567KrNhgrNwHIJ5qTz/2f9w7Jw/DNqIjVr04exW0AEOXcN3Ab7enr9eDW2VTJgehONyc2Z8XP5YdD0Tcuhcc4/r45OjGX51TEjYPbh8THRPvbz+CHusgSZlT7rP8PkCwfQKaQUi9Igr6JsRBMFiWZgb/AHKElRzKopZJQAAAABJRU5ErkJggg=='], ['osx', 'BAAAAAQCAMAAAAoLQ9TAAABrVBMVEUAAAD///////+qqqr///+ZmZn///+qqqqAgID///////+tra339/eAgICoqKjx8fGMjIzm5ubh4eGPj4/g4ODIyMiAgICSkpKLi4vS1tbPz8+Xl5eMjIypqanIyMjW1tZ2dnbR0dGamprFxcV3d3d+fn60tbV3d3dcXFx3d3epqal7fHxxcXF+foCnp6hYWFhyc3Ojo6SMjI5fX196enp+fn6Li4xERERqamqgoKFpaWmFhoeen6A/Pz9QUFCWlpeSk5SUlZWUlZaOjo+Tk5RHR0cuLi5YWFgwMDAeHh40NDQ3Nzc6OjpcXF1rbG0XFxdSU1NVVVVXV1dZWVlbW1tnZ2lwcHABAQEEBAQXFxchISI+P0BISUpaW1xHR0kNDg4qKyszNDU1NTY9Pj8NDQ1cXF4XFxhSU1QSEhIDAwMrKywtLS4uLi4wMDFHSElISEggISE0NDVJSktNTU1FRUVWVlhGRkYEBAVBQUE0NTZQUVJQUVMFBQUqKitWV1lXV1daWlpaWlw+Pj8bGxtcXV9dXV1fX19fYGFgYGBkZGRlZmhpaWlsbGxwcHB2dna844Y9AAAAV3RSTlMAAQIDAwUFBggMDhkeICMkKCgqMDIzPj9ERFBib4CCg4iMjZCcnp+jqamrw83W1tvb3ePl6Ojp6+vs7u7v8PHy9PT09PT3+vr7/f39/f39/v7+/v7+/v50ou7NAAAA30lEQVR4XkXIY3vDYABG4SepMdq2bRSz/capzdm2fvOuDO397Rw0Ly4tz2QAQPbcxuZ2E/STJwfxPhWgG355fRrVAIVb1zeP9UDLfiSwkAcADe8fn7tFxWuEXFRDoer/OgoMTRBCumj8yJwPBo8Zhpk14U856/HI8n0ZUtpZ1udrSzfVneA4roNKjdrwpcMRilb8d8G60+lKnrpWcn9bO+B23w2O8Tzfq4aiNSZJqzn5O4Kw16h06fPZ+VUlUHfo97+VAEb7rSh2UgDd4/U+TBlQY7FMj5gBIGvcarVVfQPVPTG94D0j9QAAAABJRU5ErkJggg=='], ['Rhel', 'BAAAAAQCAMAAAAoLQ9TAAABj1BMVEUAAAD///////8AAAD///////8AAAD///8AAAD///////8AAAD///8AAAD+/v4AAAAAAAAAAAArKysAAAD///////8AAAAAAAAAAAAAAAD///8AAAAAAAAAAAD///8AAAD///8AAAAAAAAAAAAAAAB5eXn+/v5JSUnKysrS0tJ5eXmqqqqxsrL+/v4ZCgknJyeHh4eIiIjo6OgZCAdOTk7t7e3///8GCwwPAAArKyv19fX29vb9/f0EAAD////+/v4AAAAGBgYHAAAJAAAMAAANAQAPAQAVAQFyCQV9fX2pIRzmEQjn5+cBAAAFAAAAAADnEQjvEgn////uEQjyEgnsEQjzEgnxEgljBwPaEAj9EwnwEglHBQJHBQNNBQIBAAB3CQR5CQSHCgWLCgWRCgWTCwadDAWmDAapDAa/DgfKDwjWEAgGAADh4eHiEQjmEQjmEQkKAADoEQgLAQDtEQgMAQDuEQnvEQjvEQkPAQAfAgEuAwEvAwE8BAL1Egn3Egn4Egn6Egk+BAL+/v5CBQJrB0muAAAAT3RSTlMAAAMEBAkYGhsbMTRLUmpvcHeIjLe6vcHCxM3P0NbW3Ojp6u/w9ff5+fn6+vr6+/v7+/v8/Pz9/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+Q8UoNAAAAO5JREFUeF4tiwVPA0EYRL9SXIsWl+LuxfcOd2Z3764quLu788NZNrxkksmbDP2R7vH6GioLs+iffEzNXd4+TqPErUUpVqMOvwgdzMPn1rv5vPsVeufBTaBK/bH2FPvkEUuIG5jIIc+sHYn/HJ3dC/Hxuo4y8s44dzwBbFkisHN8bVIdXs6jb+H97aCwbHEIqgcml64CD7YllNkAVQC940MLYe5YzvIeQAXNrd19Roc5MdzfdQLUUKaUYyuG9I8y1g4gj6hIak4X5cBIT2MquZJrJdOqpY11ZpAiqVwbY/C7KY1cRCrZxX4pWXVuiuq/hs49kg4OyP4AAAAASUVORK5CYII='], ['Sabayon', 'BAAAAAQCAMAAAAoLQ9TAAABvFBMVEUAAAAcUaYdVKwAAAAAAAUABAwWRY4YSZYhZtIhaNYHDx0KCgoFDBcKCgoRMmYSNm0fXL0fXb8AAAAYS5gaTp8fXLwgXsEGBgYFBQUZSpgZTZ4JFSgODg4IEiIOJkwOKVIkW7EnXbQLGzUTExMKGC8LHjwMIkITExMiIiIPEBEPJ00QEhMXOXAaPncOJEgoXbApXbEcHBwwMDAEAgAfHRgQDgo3NC8AAAAHBwcKCgoLCwsJCQkaGhofHx8lJSUwMDA0NDQ4ODiRkZEICQocHBweHh4GBgYHCg8mJiYnJycpKSkrKystLS0uLi4ICAgODg43NzcRERF1dXUUFBSjo6O1tbUbGxsEBAMLGS8MDA0iIiIjIyMkJCQNDQ0NHTYKCQkoKCgPDw8QEBArMDkKCgkRERIREhMxMTEyMjISIz00Njk1NTU2NjYCAgIVFRU5OTo5P0c8PD0+Pj4/QURAQEBHR0dKSkpMTExSUlJiYmJlZWVnZ2cWFhZ2dnZ4eHh8fHx9fX2FhYUXFxeVlZWXl5eYmJiZmZmcnJwZGRmlpaWrq6usrKyvr68KFiq/v7/FxcXY2Nji4uLn5+ft7e0yif9uAAAAN3RSTlMAAAApKSkqKioqg4OEhISEhoa1tra3t7y9vr7S09PT09TU+Pj5+fn5+/v7+/v7+/v7/v7+/v7+70RY/wAAAPpJREFUeF4dyWNjw2AUBeC7dfYyorM6rx1exKltzLZt2/rDa/J8OgBVVlFDX39jcTZoUqCse251a2dvu6ccUtWlanLQ4Vpel+ThlWq1l3wEz58tx4dOt1dMlAJk9A5gMjG75LHwo46hzkwosGOMbejumoRvubC9EOrMviT0E0Us9fvN9dA6zxJCNv6+ECGsb6oNWsgmpZT9/UTUZo3Em6AW34guTL4jiAudiCM1kLcw8/SmHERfT1/eueBiDqR1GK1n9w+K8nglxYxd6QAML4ztXoQuj8YFgWcgqdJp8qzty26vaboCNIxBCshyQDKov0aXr29v1ufq1PwPx5Q7bCoh6eoAAAAASUVORK5CYII='], ['Slackware', 'BAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AcEDi0qZWWDgAAAAx1JREFUOMt9kktoXHUchb/ffc1M7rySSdJMOknFPMRitLgoNKKI8ZHGKkgrjU8SitidimSh2UkXoQmoO1dGQSxJjdvOtqSaqlR0USEGSjVJGxuSmWR6M3fu4/93YX0g4rc9HA6cc4Q7DI+fpzz7PA8++2mxvZAeBZ4xhHtFcJRmXWsWvb36/OLcyxf5B/KHeYHy7DmGx1+YSDjmWTdlobTGMAStQGkNoLXS4tXDq7u7tUcWz49tA8jR8QUuzB5n5NTCV13F9JEo1JJwTLKuzU61QiOMcd0UDb+BncwQK3Rl15eNja3ui/Njq8aF2eMcO/XlBz0H8oO2ZUkum6A13WB99TtyzXlaCi24SaFa+ZFCzsG2DNnfkdbFjsI1APPhk+d6ujqznycdCxFozadYWvyMpx47wa+bPkGksKwUNnsk3TaCGASRXDZh5LpHXPPg4Rcni+3uYBxrtBbQghlscOVKmYHeEm0ZIZ9xyLffw41ND6VAa43SmjiMByzHYtjzwr9arfshxf5jOKlvKZfn8es77N2uks24PPfSFD/9Uvt7AtPKWmEU9d645eHYJo5tcKi/FX/zG+zmQxQH+rANk862DOW5N/hhaY64cJSa5xNFCgDDILZACMKYWAmh73HmzFsMlBQJ06LeiMinE1S3KzRCm5rXIIoUIoKIYCVM36urZFbEoiBLNMIhAE6/NsSB7h6SKZdL8xsUOnpx9j1KbTdARACIowArYe1ergfNT2i0mIbJys0GI6PT3N1/hJvrPxOFdRJNBQIy/FapI4Bpgohgcjuw+jq8jy8tV55MNBWI4ohS802CpizKv8q+FgALZAfYgSyAZtNro1oLaU1VvxCA029Oraxs7u/tKnXiNjn8HyKwur6lI++6vPK4V7IA7u+1Dyu1tr183ddNbkHuXP8/zEIYeFqiLRl6YO/p0bHJdflT/PD9qZa1W+ry99fcvlAlcZwUpuUAglIRYVgnDEIOlna4q0M/NPnuO1/PzMwg/045O/XeibUt5/Xangx6viSVFpK2jtMpvdyWCz+5ryf10clX3/amp6eZmJjgd441URWWJY8BAAAAAElFTkSuQmCC'], ['Trisquel', 'BAAAAAQCAMAAAAoLQ9TAAABjFBMVEX///8AAAAAAAAAAAAAADMAAGYAAAAAHFUAGWYAF10AImYAIGAAHloAHGMAKGsAGmYAJmYAJGEAKnUAJ1gAMXYAJnEAJGQAI2EAK28AK3cAGTEAMHgALXEALXgALG0AFUAAI2oAK3EAMngANoYALXMANIAAM4IANIIAL3gANIcANokANoQANYQAOY0ANIYANooAN4kAN40AOY0APZMANIUAOY0AO5AAPZUAPJAAP5MAPpQAQJUAOYsAPpYANoUAPpoAPpUAM4AAQJkAPZIAPJEAQpgAN4cAPpQAPZUAPJEAO4oAOosAOo8AQJoAOYsAO44AQpsAO48AQp0AP5UAQpoARJwAQ58ARaAAQZgAQ54AQ50AQpgARaIARqMARaMARaIAR6QARaIARaEASakARKEAR6MASqsARKEASKcAR6MARqYAR6UATbEATa8ARqUARKAAR6oARqMASKgATK8AR6QATbIATbAASq0AR6cASKgASqwAR6UASKcATa8ASqoASqwAS6wASKoAS60ATbHn4CTpAAAAhHRSTlMAAQIFBQUGCQoLDxAREhMUFBUYGhobHB0eHh8gIiIjJCQkJCYoLC0xMTE0NDo6Oz1BQUNHSUxOVFVVVldaWl5iY2RkZWZoamtsb3FycnR1ent9f4KDhIiJioyNkJGYm5+foqOkpqamqKmqrKytsLKzs7e4uLy8v8TFxcXGx8rO0NXY2eZc4XYcAAAA00lEQVR4XkWN1VoCUQAG/3NWtwh7CTsQJOyk7BaDxuxA6bbrxf32gt25m7kZqDRYxziooDV7+1AalMUavQh2AsEZoWvzigLun+T17/c8QiJZ7qu2QKiNmyZthdcR1/as353jIeU1GxMHo5XHdqPFeX8IaDMdHPYN6dRN7LR4qQewdTa35HWkyh+fbxERAMjwlAWJv3CPSKDQ+H7XvHdkV4Pua3Gtm4sPKIF/WV8dop4VKBw/NU33B3x1JbTt+XwhkJQoqRfWvHOy28uqH8JIdomR/R+s9yR3Cso77AAAAABJRU5ErkJggg=='], ['Ubuntu', 'BAAAAAQCAMAAAAoLQ9TAAABKVBMVEX////ojFzplGf1zbnqnHLvs5P10b3yuZv1xKrytZXvtJXys5LysI32waT0n3HxiVHwg0jxhk31kFn0h0zxf0P0hUrveTv2iU3yfkD1hEfyejv5eDLybSX0aR7zZxvyayH6ZxnxZBj4YhH7XAb5WALlUQLeTwHgUAHeTgHfTwD65NzdTQDdTQHdTgD31MfcTgLcTADcTQD////xt5/31Mf54dfmfE/dUAbeVQ/jcUDcTgHeWBnnflHohFvpjGbqkGztnX342Mz53dLgXiP65d399PHdUgrtoYLyu6Xzvaf76eLfXB/rkm/fWhvupojwrpTeVhTgYSfgYynzwa30xbL1ybnngFT31snngljhZS3539XhZzDiajbibDn77OX88Ovrl3X99vTjbz1fisGCAAAAMHRSTlMABgYGBwcHJiorMDA1NXGHjY2Nl5mZmZyfn6O5u8XHzc3X193j9fj4+vr6/f39/f08OUojAAAAx0lEQVR4Xi3HZVbDYBhGwQctWqzFPXiQ+36pu+LubvtfBKcN82/UEhld2vWXxyL6F92gbTPabse8hU/uHMx1SZoyyJWPTwq1Rs7GpYE9+Cg+OJcs1MHvU9y4fnrN31yUm18vMCIPjtw3QMndw4rs8ieVzAAcBlewpe1KM3uaBuD3Dda1BhWXAsi6AFY1a2SqifxZ+rnxWYcJDRkUS3fO1R5vwe+XZgw4D4L3RAJiknoXCVX3WeiUpJ5pIxTvVmg45pl5k4Ot/AGV2iqZBWgJJAAAAABJRU5ErkJggg=='], ['Windows', 'BIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA+pJREFUOE+F0n84FHYcB3CWSsL9ojo/6ik64c6PnTjmSS0limmrpBm2G002y++xzXRz6zE0R4nbw+RnTj/WD4sbanLkkAe55ccYlyNme4SrO9u9d13PI3/saZ+/vs/3831ez+f9eb5aWsuqy2mjRYeNUa7YmtjfTico7jNJ8z0eG24NB9vvnDrvufzpq89Npnr8VjMddNmuRh9rDfp36mFg91oM7qPIc5JdbDJq3An/JfCu7Hl53W2lpS220pP2OuniN299jAYbYizSENIoAgbCTdrTKtxOJVdvGo8psUwKy7Vxe4ez1YEVudGP8YEZzyveInFJ6mZRHHqYazDspw/pJwTIuERM5JIwmUdGdyo9K7/BszGzzg6fXzZHGJ8KvzQqXKOpoIeZLjofWR++BPWyCEnPY4xFGEKWQcLjMjKmr1MwfcMYwmz/Y4KOgNki0V5k1dkjUWCK93Kp2PMFFawos8cm1gZ2GqjLXktL4mbQPHLQ4B9ZDFE5+S356fQlyuJMqzH++HnTo6ui2OO1ko9Ul+4fxfd3d4F7k4YTReqpuFS88bGZUE2QNNDobuIq8Q5CduHb7lFJaTnvnym9ergjMWD/FG8zf+aKS3G9JO5C01Asah6wUXrvALKEDoitMMHhDKrKJdg8RU2s0EB2EWWur8dd7PDPFv6dUC0Gv3kAN36VPRGP/5k5NS6lljWxG0TDiSr1VKhoPwhevRMSqkwRxDObc/DavGtpP6zoi8XOyZfhnyNEvKANBU0P8VPfI/wyNCGXSn7wlEmyA9KrgmOKGth3eDVvPfyywq2dnUEv2R9qG2rLsH7xJXziKnWcI8tlTvEC7Mu8hROlImTU9aKqcwQ1vWOihWFu+sJknmph5CvxQh87c7bNh/NXo03hrMCosyvLmMNgMF7TQL6J1dsZIUVwjKqEO+cajp5vxPN439U/gKBt8PTcYHzL/BgHCyOf4unAISj6mFC2bYC82kB5Ls460NHRUVsDeYSXpGw7UgC7sAtwShDgzdM38W7BbURXtqpqhfmB8sEQuXwoCM/6faGQuGCxyxyKWhIm+PrSD495WL3cT0hhi8Whc3NbAs9KaOyCTvrJ8qkdX19XBeTUDU00+55USFzVU2yHstcaix0mUAjJkJeuRU868Ucmk0lcguiBnMAVxjbbdHV1yeq8+u4Hgo22huSG+iQXp83ftaxW3lsPZcs6KG5T8OwaAfJiPcxlrVRVRhvF02i0F/t5VbHZ7JWDfErKTLnhE3mFPuRFepg/uxqz6TqLv6euGj3ut87t/4ylvre3t3ZehOWWO1zjSFEqMVP4GfGb/DBykJcjmaZOoLsc+hcVY/LaAgcTQAAAAABJRU5ErkJggg=='], ['Pinkie', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3dJREFUGBlNwUtoXFUcB+Df/zzuY553pp2MmUwSk5TGpnamiokWRdNCSkCrUChKCnVZQUEUdy5sQZC6cyd2VWgoutCFXWTjIyp1UdqmEDBRsSZNmkmaZF6Zx32ccyzowu8j/M883pH5A9kBYfNkFOpu0OiulyqXmnhkDmdYHYJexzX1Ef51EQDhP9fxpjU0PDCd7IldYIxGVag3/KZ/ZX1p8/P0k/0U47qs291M2NS3f6ncuLeFeQ3A8KuYoNPoY/3e2Ej6scSnqUJ8gksmhC2y3OJHpSUHU0/3HU+WCuddyV6VSpVyYv/aUuPefWAP4iDG8AhJWyYYo972tg8DQ1wyWHGZSfcmZmQ+YeKTw1bQ70H8uJw3xtDp6NzG15VLf/DLWMBZHGPkwuWGyq7njLoZyzAiCtqRIddioifBxYBHIpeE0oaw0yoG7WA755dvi8Xih66BOSZj4rwds45bSQkuOeOCQYWG2PjjcEq94JwjQgQ+kCW+tBl3H7Ym4jnbE/nDmamwqz9mnEaYoBgiZaJIGW5zEIHEPheykMD2w12ztPIXCrZHec+GdOVAUI8ygjvifeHQESiNoKtMlIoRxSV0owMjAeY5+P3BKrbTDq3n02B/7yDTDkBANSXiewKgjFbahEwQe34IiVIfRNqCv1qDanQR9Di4+tU16N409o2WMXnyJeNWb9PO4s6WroZawOiSiozCoR7lPFUQezICCzXF+pPGYRna6/rotNqY/eJLUzh4mM5dP4Va0YXV45x0O9F9FhkN5auq4eznaq3WmP1pDkuibW5uraNaqyNh23ihPA6v7wAVS+PwXAGkbYiUnU3kYm8JzvgGpJGdG6vzm15+ce6H79/9bnnBhCxG702dwnTaw4nyM/jsiTHsHx+DEyjKWnGEUpBOyjTTgbpsNHyLojPe7PK3qci58NvNu0Gl0YA8NIxWp4MkdzCdK2Ci6iNYXIV6UEfUDBC2Q/A3WqVbUUfVucWftYhP9fLiFf7yRPGVmZmhE88dJVmpGRMqRH4E3emSbnQR3lkzaqNB3br/J39tb1ibJglGfJDZbMReb37Td/bFhcnB/iNppXNUbZEKFGBJ6FBT+9cVo5c3yd/trDV3OxdFDDHFOV8IffVJtNNOC+J3xtYqATWw0Mm6RIJ9YAy9rdtt07q1ZtjdVXCYFRBG4Bv8A+lliGhzN164AAAAAElFTkSuQmCC'], ['Applejack', 'A4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAv9JREFUOE9dkmtIU2EYx88Roi9FfahkfQmS6kNGEBRlZWSY5tylTKepqR8MHYGl2R1POm2u5bCVlzbog2Ze591pzZPZxUskDZLMMLSWzcIca3MXt7N/55woqhf+PC8Pz+99n+fPQxAEQf6vhINb1nG5/ISdobWXo+9eSd4tyM7OJimKImmaJhsaGjjmX/DGqfDQmkvRg1x+9YrlZPd18fdupXiu6mxkOAcqlUqyuLiYB/+cayfD1rKFH0w3pYEHV4/omhTCyieVcYEB7TEYSyX21Mita/6u/91qUBMV00JrjmKwMg4zI2fgnlfD90PLx+nhMyinIrb91SFBFqaHBevPHb7G/fS06jhs0wXwO8rBOLXws2Kct/k4//HKRE+jZD0Pl2buD2FnmOlVSUFrpJg15/JFgcWKP0Bg8Q6fs1sVs+11wmAebKaEuiG1CC81Yozci+cL4KoC3JUIuCp4+R23+Ee4Dr5bisZmJi7fJzpLRJZPOin8vSlwdSXDO54Hz+vT8LzLh3uuCIuzBfDa1DzMPcrJMVfkIHpVEu94uYgH/aaTvOxdJzDZkI76smhY2mVwDmfg8zM5RukcvH8pbx96mLiPMBTG0nSpGK7mePg6k+DsSUZbSQwem02oba3DRsFKzNQfx9sHSdi1dzve5Ow4xM+ozorY1K2U2MY0IrhbEuB7lIqB6gxY7B9R3XoHAoEAivN74O5LAaXNwvNLe9PlcjlJACANRaIRztFh1iRvfRyYx5kIOCwY+GCE9GIUOjrzwZjS4H16FV80UT1WqzWIWFhYIBsLhDf7y46Ck1UvATNKgXlxHgHbJDyub2DGVPC2s+bVyGDTx74ym80kwe2fKvNASN8NySK3NeayWNagNPj7WaP62Uhn8HdPkwyWW3IoEjdv0Ol0JGE0GvmV0+dFpj9SS5kOKuahr01Wwbb2lXV6aakjkfF1p8DXlwHnaB5yTm1bbzAYfs34e/+0pyNic+N2ruIWmQWXcdE1dUEGd9UYq6kle1mXqVW6imWIn290AGVZutJTAAAAAElFTkSuQmCC'], ['Fluttershy', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA2xJREFUOE9dU91PWmcYP2uybDfrxdIlu9vN/oglverWNN3Fmu1iN7vY2q4utnE2Nu26ukyrUUGwExGpn3xY+TyACjrskFrcEYoWnCAM4YAgcJjROkFA1q789nJczNaTPHnfk+f5/d7n4/dQ1Cvf3Ut3Xp//Qnze36gYCt56kIgJpyqRFvrvcIvxMNxhSa9eV993XJK/+yqO/zdf7j7tbRz1RdstLzOKReRoLxJSOzb7HyKtdCEumgErmEbwO03U2aR8738kzq8ln8e6bXlWYMWmZA6Z8SUk5U5ytyPeY0Oy1w5O50FO+wQ5jbtG4lK19L5BGehzb9sE19+JtFt2c8ZlJPvmwAqtSA06EWs3g+2aQnacwdbwAmLknuiZxaZ4FiTD6tLFvi+pBeenb/3mvvo4Yu3D5v1ZsP1axHpUiAo0iPyg41/dGiNgiQI5PXmdXkai92dkVItYbZ6YpVZWLrrKFSOynBip9W6U/7LwViqZ8SykRWpcR8BqJNlmJCZp1LLMkIxSAw6s39WHqUCo/mDnWTdKhwRUMaNMzvLh5NFZsaBIbD+rJ34jgsxtcLQH3IQbKakDoVZDmnpk+irA/fEjCkXlv+AawX+MEJQJcaFEY8bWAJdMgYxyESn5PILNumUqJNVVA4EG7OXlx8Bf3T2QyRuh0X2P5ad9pCQTcjtqDI3UwTMuReIeaaKagb9u6B6VVi9Wg1YRUhkhH1g6NKFf3gD/2gAYz08YVd5AdltDfDS2d2QIrH6DcNcwUjLHc+aC8AMqLrW/4EwesBoligUTCgc05h52IH9gwu6+ERwBb+9pkc0IwLJNWHPXIyrUIdysW2POd52gopIZjtOSpgzOI2NToVAmwD0D9osmvvZSxcCXtr5wA08627Ah0yHZ74D3ysBNXokR8XQ8q2SQM3gQbZtAPm1AiZRyNIUawZGFl5qIRqbBdk4Sndjy1iviIymzIquXldirWRXDzzdOZr63q8J66OqOf+2yL8be+nMr3fry91A9NlRjvKT9tx88Pt6Djdaps0RZxQRZmCzpbHrMBV9b5/YM/dn7tSCT/cNTvpauFdasR5xkkCaS9n07Kj0mIKm+GbujP5OQ/vI8Ofyomhx0sOmxhU9W6wYp5uOO12qB3guik2TuI2QPXmwpXLGnjSMf3RRdO1Hz/QNneMt7Iqmg5QAAAABJRU5ErkJggg=='], ['Twilight', 'BIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA6lJREFUOE+VlF9Mk1cYxj+Kc3+yXWimFxuk2zTIn4bQFkppF0hDNmBpBtgKixhhQZAhbSkFBp1uZWg3ZLRMxFKE0qKtrMy2E2ztn2+1tLQgbuJiorvQ7c5pgplZNjfmePZ9nwtZMm52kufqvOeX5zznfQ9B/M9l/8CXPP2R/6ajy+u0amZeoI8D2PpfTLqMlZQpT9vE2fPOc9l73302q7rs6Sz5K6zM3ZuJzD2EVf1VytejC4hNXoWj2/vlF71+FgVKIsZVHrbnEzLoPkYOqqtPNm7j1l1J4R9Y4wgVkOR3Qcvrg+uNXmTnt9zfmdcUFRd1XqQhC+eWMXP8MiwKdyUDOqMLEG49qYtYlhA+vQi7zocGmQHFYi2UnM9wq/RzNEsOQyDWMBIWtjNurjivw2ucg+toyM+A6LWZU72vvsqwFjwVZwrmrEvoq7DBLDDiltQAobidgeRRUipMTA0t32AU3hNzD7zGSANBZMi2UFe5nyZohrREB9dxEnMTS+jgnUBYMghv2afrbhhHb3aAnFxkQMHhOALDid8p0EHiKU6VklvQil0UiJakqBsf77dCmTmASPEAhoqPIEN4CGmCJvAkauzKfw/5pRr4J+JUTtfo693zGSM7iBdzan10sE9gh5AragNXoEKtvB+93ZMY0TthGraB92oJVlYewDTgQJ96DKTtiStXb8jvNoafIV7i19+lndC2X+bXPyqXffj4kmV+PYexY1aQMwnkv1YGWUUljryvQ0/dqfV9+Vs9zVTYLILKZ5UGsXMbb2/llJaWCN8OnzNMrxda9JNYjt+ENL0RrQol0nekQVtlRHA8gsWpZQhEmrviws5yIpXfcG87t+52UpY8NZXN3lIjPRiOReZxfugCA7s4EsCN727ArHChQiKDYGchRrumELbFEbQmkFvQ+ofg9TYX8Xx2zfnkLDmHbgM2m00M1tortQf06FC2Y2HqGgMjvSR+WfkVplYPzCoX3EOziDmuwjMSRk6BajVP1PYT/fzb/j0nZ7tmN+n3mUlpUTmCo1EGFHJE8NvDR/g+egd0fj5LDN6xKHo6bOAL1D/niTTRDUd2rMW13VBj/zFu/5YZBaYBp69j0blMPfs8zhj9KCjspPNZ+6fjd28IGld4MgIn5x/HJr9ByJRYDz5oS2B6KIT9Nf3IEaj+pCBrXFELOTERZm0Ichy+lHy2czZlpv+y80JfmILFVwPDsTvmo26SJ1I9zBU1/UVBfqAk35ujpb+RpL8BJjxIUjyXvSgAAAAASUVORK5CYII='], ['Rainbow', 'A8AAAAQCAYAAADJViUEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3tJREFUGBk9wV9MG3UAB/Dv7+531971aKGMlr+OwjoGBUZwRDrRBJwj0bHEmeiS6Xwyxn8x8UVNzHAPPvliFhMzsy0m8uDD5h/QZWoUNxYMBoZbZCBjZTBoKRwtLde7cv9+bg/6+ZDnzk6C44lw6f6whdOnETpzla+0803RMD3ZGSH95V62lzGQtMH9M7MhfpPUyIX5HE1uvNXDaCQgtykB70cR/4unrn3aqzYkZt7v18ZfezyTkfy0HlJ7FMWKEBJFpYMSVq7bngMlGvvc/OTiLzRYLp8K1waObaS16MDIRfupG9c6SuwCsSt2kJ+/B+3HMdC6MBofa0N1a2sVJTWj02mh4BFCCpV84jN4oHyX3KYEJAi2BWYR2CkPmMlBiOgwE0mYiymo1Qu0Mx4/8VLVnrtnF4VxfuCN9z5mDBA9FJt7mzDe3oXkjou69CqoxkA4gC9xQAggankMa7uTm3m32SLKD+Sz6XXGGCDJAv6j7di4MzqBo199Adk2EIqkQGQHDy3Ij2Q+bHr9g3UxyFHLdFyvJHAg+J/ipYgdjuMyzwELCfRsTWG/NQEwhqCVC0YLy/qKGJzmD77w9pHSoFyjbWWxtjAH5jIIHi8EKkCpq8JteCD2H0F2u4BwZhE+x8BEWbt6i6df8kr/s0+H/HKMc1yo02MYaG9APjGLxJ+T2NxYRV7fxu66GqjwYyrn2AG7YFGw4FygeYiXjva/KoipxoaKGPY1N+PJfRHEauvQaIj47vsLSN67i87ew6hOLGFeTS38FO45XhR8lQlffS0tmGViwbmCdKEb3tJSGLYLieMwMfQr1tZSqOzqheCVkDWIk7i/vvJ7WdVVxd96XWBU4kzb55qOiZvqJazmCxhLGzBFiqbnuzD71xyij8bxEN/XzXccf7PyxJ6+lkxuwknnftP4vorBd9O1mXBAnsbfaQW6VQadcWC7gmiIH0JlrBWuw+DYgFyiSGqu+O2NjZllPMBJRUevuH4Ipu1DyOefrS6RzmQN211iFGUtzSAcD8dh2Ll8cyStai8vra/8MQhgEADvjx/bX78c6rgT1ddl722/btSelEz69eaWoZqms1kwrGVt27xV1I1zgdWfRw6Ww8lmswQAo6QR2dnM6JC6HT3PEfvctjSsnx+3J1uob6qt6gAtSgEu4BbdV2KO80T3O0QQBFiWRQRBwL/txI3OlzkSKwAAAABJRU5ErkJggg=='], ['Rarity', 'BMAAAAQCAYAAAD0xERiAAAEEElEQVR4Xm2SW2xURRyHfzPnsmcvlO4ulN1uF2sLrIpdJNS0KUZFUq1t0AiKkpASbyQSjRKENEGrPuCTiUoTjSENKAnFYKokbZOmIBaoTRXB1AjbWmrabmVpt3SvZ899PFnTxAe+ZF7+D998mf/gbmwt30131B58YM+WTw7vbTnW/+oTHZda6490723uPP1KY0fna40dh/Y0fFz/4pq3XRFEsATB/2i71EauvDcplHN173p8of2gnI8KPHLxm/AEqwgIARUEeywyS1dVPZ+9kJ6OHdB/uzF2BmcYXRIdHxkhO/0vR/e9+c4p7+pIO+92+wlHaGE+QV1lYWpLCe90kdKVTvJo80rqDTic4nJfk7c62kM3rltfgQpSLGOM4ZfR0apQIPQTpSR04uhVqhUYSkoItLyMVFaEIjNENpTg8ZbVyGYK6PpyHIYGBhCmLiYHZ2NDzxZlpwYHaX3V2mMet3sPpZSbjc/B5y+Fw8GDgWEukcbURBLR2jB0TcPpz4cwO5aBBQJuWSnsbC09eeN50tnZSYy0s6p5V+MwIVghSQ4iFwqQHBIIIcVjGEaxXtd1XO2P4dr3N6EqCvJyFoqmgvqDlqZqp+jxD4/z8etKGxjxm6ZJxmIxnB8YwNDQEGITE5iemQHHcRAEATYIVPvB8ZQRQu05D45QGPNx2PYNNFxWV21y/h0AiCiKkGUZcwsZnDjTg7cOtuOr098hYxLYQJIklK8ps5hoaAyM2ZeAFwRQEJi5FEclT/BpxZBKFhdkQimFx+NBTbQG+1pfQFZ34tZtFd29PTAtC+N2dU9vH/t18sKCwPP4r46DQ3QySzcGKBGERzRFpYl4CkubPdd3Fj1nu5GduAxvdQNIPgNV1zBw/hy6+y+D510xUZQYzwlM5CXT5iID+5RailLNDINN/ZUCoQTLlnkQj8dx8uRJW2DA7V2F6H0RGJoGt8vFgqF7c2vD0T4wMANgd0yjP2Mqb+Ty2RkqMrhhmbh+JYnk7TSWl/pwuP0DrIvWoX73EWx/LIIV3lKIgoitT21Dy7aWPzU125/JpbOLukrA8U1ly8uGwxWVz1CXwOvE0qHIGq4NJ4qPHApVoKurC4defw6bKigCwfLiRkMBPzavL39w5/tPChk5vV+ZvzVHUknm4DhB13RKeZ5LlthlzDAQG00jkykU/5VTYKgJiTANE6LkhKIqTNW0nKqpvYauj89PzX5jcqxG0/WmeGK6bj6V+IHPy7nfV/hWbS5kM0gnC5iMLWBjXfhnAA0FRQGz0XVtzmJsZEHOH52a+uPirubtOmw2BfYmg9cSP2YsJ7uIbxlpfaitdk3l/Q/rlv7FnVzucmXdPS+1HtjyD8dzWCIvy76/Z6bY5MTs4tfjn7HBjwZxN/4Fq6rr1ZuF0oUAAAAASUVORK5CYII='], ['Spike', 'A4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAsFJREFUOE+Fk1tM0nEUx/9QPtCD7z30nE9sbbVeXJJR6j8DkVsIhg6HTqSXnBHSMMEbEy+AgPwVQpcgNy+kKLc/lCgF09Wquaab67kHX1pulif+mHRdne3sd3Z2Pt/fOee3H4J8N/ow2lrj4H64OljRfEXBIZ/k/3lWquXIrQl2ROAVA98jOro2XKUtvV9Dpj/iFV/ppwvLVfzThEBZGRWh0S4hmFx+rId2ysmMSU6WAAUeMfDcdYe0gUrGdUOl7rZXBDRdRQtRp1PeIRlVctIzk+lHR6itJnwC1nkbgOXgZlhO3h6RY9rZKYT7W9NUKpUklUqRKjPDQADEjYTz3SLgzQjzMWua/5E5xLpQrqOX/jEzamTc4LqEX/KQRwRMBwfEDgnUOyXAdgk+1zr5e0w7J/vA15OfN28PW5SnZlRuVT3WeMia5oHW1AthawSS40mIjcWhW98HfF89Ifa6qb+hqAA6FA5xzIp/dVncYDc/hkQOiI/jBcctCegwdRJgsERWcszpZTrKU/3S7s+Ff4vn9UG4aWbGyofoaB60d05dDJuiR/8DcXMCpLY24GPsrlRWcxZxKmaqF0aCsDy8ArgtAVFL/Jc2C4LWBEwFNLCUbt9PZrpEiEk2VjbmMYIdm4TQ6Cq4RmYB02CwZAlB2ByBkHEVYhYcEmEreNZl4F+/C8F0+0vE2x1IL3qDsDgZhKg5Bt7ULAgHa+HVzlt4v7MHMQyHpM8LrlQzuNdaIfJCub+R0Z5DfNrAxsJAEHJbhXhue5nQJmS3t2D73S6suVK5XBKiYQMs4B3xSEbZ83xTc3ljq5eMmNts5/3d82/8jicQDc0Cbo8BjiVyQsez4rYkeNRzfqfadUYgEJBRFCVRKBQS0tTUSM7BxaauUelyenwunnZ+SnhXDkKG0EGgb+5g4p5dpa5TFEkk1bmfQSu8/TfTXs+Z8UbptgAAAABJRU5ErkJggg==']];

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
      'Warnings': 'rbg(102,136,170)',
      'Shadow Color': 'rgba(44,44,44,0.4)',
      'Dark Theme': '1',
      'Custom CSS': ''
    },
    'BakaBT': {
      'Author': 'seaweed-chan',
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
      'Reply Border': 'rgba(238,221,255,1)',
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
      'Warnings': 'rbg(133,76,158)',
      'Shadow Color': 'rgba(128,128,128,0.5)',
      'Dark Theme': '0',
      'Custom CSS': '#delForm{ box-shadow: 0px 10px 10px 2px rgba(128,128,128,0.5); border-radius: 3px;}#delform::before {width: 252px;content: "";position: fixed;top: 0px;right: 0px;height: 19px;background-color: rgba(255,255,255,0.8);}#options.reply.dialog, #options .dialog {	background-color: #FFF;	color: #000;	border: 2px solid #CCC;	border-radius: 6px;}#options ul {border-bottom: 1px solid #DBD8D2;border-radius: 0px;}#options ul:last-of-type {border: none;}#qp div.post {background-color: rgba(255,255,255,0.9);border: 1px solid #D1A2FF;color: #000;}'
    },
    'Blackberry Jam': {
      'Author': 'seaweed-chan',
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
      'Backlinks': 'rgb(223,153,247)',
      'Greentext': 'rgb(108,204,102)',
      'Board Title': 'rgb(103,204,232)',
      'Timestamps': 'rgb(218,105,224)',
      'Inputs': 'rgb(218,105,224)',
      'Warnings': 'rbg(103,204,232)',
      'Shadow Color': 'rgba(29,31,33,1)',
      'Dark Theme': '1',
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
      'Warnings': 'rbg(87,87,123)',
      'Shadow Color': 'rgba(16,16,16,0.4)',
      'Dark Theme': '1',
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
      'Links': 'rgb(137,115,153)',
      'Hovered Links': 'rgb(198,23,230)',
      'Navigation Links': 'rgb(144,144,144)',
      'Hovered Navigation Links': 'rgb(198,23,230)',
      'Subjects': 'rgb(152,125,62)',
      'Names': 'rgb(163,68,67)',
      'Sage': 'inherit',
      'Tripcodes': 'rgb(150,86,44)',
      'Emails': 'rgb(174,43,41)',
      'Post Numbers': 'rgb(137,115,153)',
      'Text': 'rgb(187,187,187)',
      'Backlinks': 'rgb(137,115,153)',
      'Greentext': 'rgb(139,164,70)',
      'Board Title': 'rgb(187,187,187)',
      'Timestamps': 'rgb(187,187,187)',
      'Inputs': 'rgb(187,187,187)',
      'Warnings': 'rbg(87,87,123)',
      'Shadow Color': 'rgba(16,16,16,0.4)',
      'Dark Theme': '1',
      'Custom CSS': '.nameBlock>.useremail>postertrip{color: rgb(137,115,153);}a.backlink:hover{color: rgb(198,23,230);}.reply:target,.reply.highlight:target{background:rgb(37,38,42);}[alt="sticky"]+a{color: rgb(242,141,0);}[alt="closed"]+a{color: rgb(178,171,130);}input:checked .rice{border-color:rgb(21,21,21)}}input[type="submit"], input[type="button"], button {background: -moz-linear-gradient(#393939, #292929);background: -webkit-linear-gradient(#393939, #292929);background: -o-linear-gradient(#393939, #292929);border: 1px solid #191919;color: #AAA;text-shadow: 0 1px 1px #191919;}input[type="checkbox"], input[type="radio"] {background-color: #393939;border: 1px solid #191919;}input[type="checkbox"]:checked, input[type="radio"]:checked {background: -moz-linear-gradient(#595959, #393939);background: -webkit-linear-gradient(#595959, #393939);background: -o-linear-gradient(#595959, #393939);border: 1px solid #151515;} #delform { padding: 7px; }'
    },
    'RedUX': {
      'Author': 'Zixaphir',
      'Author Tripcode': '!VGsTHECURE',
      'Background Image': '',
      'Background Attachment': '',
      'Background Position': '',
      'Background Repeat': '',
      'Background Color': 'rgba(255,255,255,1)',
      'Thread Wrapper Background': 'rgba(0,0,0,0)',
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
      'Warnings': 'rbg(87,87,123)',
      'Shadow Color': 'rgba(60,60,60,0.6)',
      'Dark Theme': '1',
      'Custom CSS': '.replyContainer > .reply {background-color: transparent;} body { background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACEAQMAAABrihHkAAAABlBMVEX///8AAABVwtN+AAAAAnRSTlMASuCaZbYAAAA+SURBVHhe7c2xCQAgDAXRKywsHcFRdDNxchtBkhHk4Lp88ui7hhaztBCkyYZ7fFHzI/Jk/GRpaWlpaWlpaR3scHNQSY3kigAAAABJRU5ErkJggg=="), -moz-radial-gradient(rgb(190,0,0), rgb(15,0,0)); background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACEAQMAAABrihHkAAAABlBMVEX///8AAABVwtN+AAAAAnRSTlMASuCaZbYAAAA+SURBVHhe7c2xCQAgDAXRKywsHcFRdDNxchtBkhHk4Lp88ui7hhaztBCkyYZ7fFHzI/Jk/GRpaWlpaWlpaR3scHNQSY3kigAAAABJRU5ErkJggg=="), -webkit-radial-gradient(rgb(190,0,0), rgb(15,0,0)); background-repeat: repeat, no-repeat !important; background-attachment: scroll, fixed !important; background-position: center, center !important;} #boardNavDesktop, .pages { background-color: rgba(0,0,0,0.7); } #boardNavDesktopFoot, #watcher, #watcher:hover, .deleteform { background-color: rgba(238,242,255,1); } div.reply { border: 0; border-bottom: 1px #ccc solid;} #qp div.post { background-color: rgba(0,0,0,0.7); border-color: rgba(0,0,0,0.7); } #qp div.post, #qp .postNum a { color: #fcd; } #qp .nameBlock > .useremail > .name, #qp .nameBlock > .useremail > .postertrip, #qp .name, #qp .postertrip, #qp .trip { color: #ffaac0; } #qp a { color: #aaaac8; } .boardBanner a, #qp a.backlink, #qp span.quote > a.quotelink { color: rgb(255,255,255); } #updater:not(:hover), #updater:not(:hover) #count:not(.new)::after, #stats { color: rgb(123,123,123); } .boardBanner {color: rgb(238,187,204)} .boardTitle { text-shadow: 1px 1px 1px #222; } #delform { background: -moz-linear-gradient(rgb(220,210,210), rgb(240,240,240) 400px); background: -webkit-linear-gradient(rgb(220,210,210), rgb(240,240,240) 400px); -o-linear-gradient(rgb(220,210,210), rgb(240,240,240) 400px); padding: 1px 15px 2px 15px; box-shadow: 0 20px 15px 20px rgba(0,0,0,0.7); border-radius: 4px; } #qr::before {color: #000;}'
    }
  };

  Mascots = {
    SFW: {
      'Akiyama_Mio': 'url("http://i.imgur.com/MdE9K.png")',
      'Akiyama_Mio_2': 'url("http://i.imgur.com/pBuG2.png")',
      'Akiyama_Mio_sitting': 'url("http://i.imgur.com/0x4Rr.png")',
      'Ayase_Yue': 'url("http://i.imgur.com/i2MT8.png")',
      'Asuka_Langley_Soryu': 'url("http://i.imgur.com/Wj7s7.png")',
      'BLACK★ROCK_SHOOTER': 'url("http://i.imgur.com/VidKo.png")',
      'CC': 'url("http://i.imgur.com/Ir1v3.png")',
      'CC2': 'url("http://i.imgur.com/AU1H8.png")',
      'Dawn_Hikari': 'url("http://i.imgur.com/lxLdH.png")',
      'Erio_Touwa': 'url("http://i.imgur.com/zhPlM.png")',
      'Evangeline_AK_McDowell': 'url("http://i.imgur.com/cRhjg.png")',
      'Fujiwara_no_Mokou': 'url("http://i.imgur.com/NaKmF.png")',
      'Furudo_Erika': 'url("http://i.imgur.com/zLsPY.png")',
      'Gasai_Yuno': 'url("http://i.imgur.com/iG1F2.png")',
      'George_Costanza': 'url("http://i.imgur.com/Nnsrf.png")',
      'Hakase': 'url("http://i.imgur.com/TBHI6.png")',
      'Hasekura_Youko': 'url("http://i.imgur.com/qTQqY.png")',
      'Hatsune_Miku': 'url("http://i.imgur.com/lKQHW.png")',
      'Hatsune_Miku_2': 'url("http://i.imgur.com/ULksz.png")',
      'Hatsune_Miku_3': 'url("http://i.imgur.com/H1pgZ.png")',
      'Hatsune_Miku_4': 'url("http://i.imgur.com/vE3FJ.png")',
      'Hirasawa_Yui': 'url("http://i.imgur.com/sL1Uo.png")',
      'Homura_Akemi': 'url("http://i.imgur.com/b9KmB.png")',
      'Horo_sil_light': 'url("http://i.imgur.com/HMpug.png")',
      'Horo_sil_dark': 'url("http://i.imgur.com/PKfl4.png")',
      'Horo_sil_2 light': 'url("http://i.imgur.com/BjV3U.png")',
      'Horo_sil_2 dark': 'url("http://i.imgur.com/8fcrD.png")',
      'Ika_Musume': 'url("http://i.imgur.com/rKT7L.png")',
      'Ika_Musume_2': 'url("http://i.imgur.com/uUhGG.png")',
      'Iwakura_Lain': 'url("http://i.imgur.com/AfjG9.png")',
      'Iwakura_Lain_2': 'url("http://i.imgur.com/hIBLa.png")',
      'KOn_Girls': 'url("http://i.imgur.com/Sc1Pa.png")',
      'Kagamine_Rin': 'url("http://i.imgur.com/fXXd2.png")',
      'Kaname_Madoka': 'url("http://i.imgur.com/4PHsl.png")',
      'Kinomoto_Sakura': 'url("http://i.imgur.com/Ve0hl.png")',
      'Kirino_Kosaka_and_Ruri_Goko': 'url("http://i.imgur.com/MGaLr.png")',
      'Koiwai_Yotsuba': 'url("http://i.imgur.com/1MyDM.png")',
      'Kotobuki_Tsumugi': 'url("http://i.imgur.com/fzhbH.png")',
      'Kyouko_Sakura': 'url("http://i.imgur.com/78HS9.png")',
      'Li_Syaoran': 'url("http://i.imgur.com/GySuy.png")',
      'Link': 'url("http://i.imgur.com/OyTWU.png")',
      'Luka': 'url("http://i.imgur.com/WUIMw.png")',
      'Madotsuki': 'url("http://i.imgur.com/J1i26.png")',
      'Nagato_Yuki': 'url("http://i.imgur.com/ucnzg.png")',
      'Nagato_Yuki_sil_light': 'url("http://i.imgur.com/uR35P.png")',
      'Nagato_Yuki_sil_dark': 'url("http://i.imgur.com/aGFCl.png")',
      'Nagato_Yuki_with_Pantsu_light': 'url("http://i.imgur.com/L9ZAT.png")',
      'Nagato_Yuki_with_Pantsu_dark': 'url("http://i.imgur.com/MwoI9.png")',
      'Nakano_Azusa': 'url("http://i.imgur.com/6c3p3.png")',
      'Patchouli_Knowledge': 'url("http://i.imgur.com/QoKJb.png")',
      'Patchouli_Knowledge_2': 'url("http://i.imgur.com/dK9Pn.png")',
      'Ruri_Gokou': 'url("http://i.imgur.com/Ht6dr.png")',
      'Samus_Aran': 'url("http://i.imgur.com/34viJ.png")',
      'Seraphim': 'url("http://i.imgur.com/PA7pJ.png")',
      'Shana': 'url("http://i.imgur.com/JNS1z.png")',
      'Shana_2': 'url("http://i.imgur.com/K1mLx.png")',
      'Shiki': 'url("http://i.imgur.com/FKDcd.png")',
      'Shinonome_Hakase': 'url("http://i.imgur.com/TBHI6.png")',
      'Suzumiya_Haruhi': 'url("http://i.imgur.com/iVl5d.png")',
      'Suzumiya_Haruhi_2': 'url("http://i.imgur.com/rW9Q6.png")',
      'Tardis': 'url("http://goput.it/vig.png")',
      'Yin': 'url("http://i.imgur.com/haBSN.png")',
      'Yuzuki_Yukari': 'url("http://i.imgur.com/c8Lal.png")',
      'Yoko_Littner': 'url("http://i.imgur.com/3goQm.png")'
    },
    Ponies: {
      'Applejack': 'url("http://i.imgur.com/1ufSL.png")',
      'Fluttershy': 'url("http://i.imgur.com/x88ZT.png")',
      'Fluttershy_2': 'url("http://i.imgur.com/hokhQ.png")',
      'Fluttershy_Cutiemark': 'url("http://i.imgur.com/vBqiB.png")',
      'Pinkie_Pie': 'url("http://i.imgur.com/rY3w4.png")',
      'Pinkie_Pie_2': 'url("http://i.imgur.com/zy6rO.png")',
      'Rainbow_Dash': 'url("http://i.imgur.com/Zf3eQ.png")',
      'Rarity': 'url("http://i.imgur.com/Mbhf7.png")',
      'Twilight_Sparkle': 'url("http://i.imgur.com/r5q9h.png")'
    },
    NSFW: {
      'Anime_Girl_in_Bondage': 'url("http://i.imgur.com/B3h3c.png")',
      'Anime_Girl_in_Bondage_2': 'url("http://i.imgur.com/1TUjP.png"); z-index: 1',
      'Golden_Darkness': 'url("http://i.imgur.com/lYGo4.png"); bottom: 0',
      'Horo': 'url("http://i.imgur.com/6f8wd.png")',
      'Horo_2': 'url("http://i.imgur.com/KJLui.png")',
      'Ika_Musume_3': 'url("http://i.imgur.com/PeckP.png")',
      'Kinomoto_Sakura_2': 'url("http://i.imgur.com/Rdk9s.png")',
      'Sakurazaki_Setsuna': 'url("http://i.imgur.com/QLChr.png"); z-index: 1',
      'Yuki_Nagato': 'url("http://i.imgur.com/2BUww.png")'
    }
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
    log: !console ? console = unsafeWindow.console : void 0,
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
    },
    RandomAccessList: (function() {

      function _Class() {
        this.first = null;
        this.last = null;
        this.length = 0;
      }

      _Class.prototype.push = function(id, el) {
        var item, last;
        last = this.last;
        this[id] = item = {
          prev: last,
          next: null,
          el: el,
          id: id
        };
        this.last = item;
        if (last) {
          last.next = item;
        } else {
          this.first = item;
        }
        return this.length++;
      };

      _Class.prototype.shift = function() {
        return this.rm(this.first.id);
      };

      _Class.prototype.after = function(root, item) {
        var next;
        if (item.prev === root) {
          return;
        }
        this.rmi(item);
        next = root.next;
        root.next = item;
        item.prev = root;
        item.next = next;
        return next.prev = item;
      };

      _Class.prototype.rm = function(id) {
        var item;
        item = this[id];
        if (!item) {
          return;
        }
        delete this[id];
        this.length--;
        return this.rmi(item);
      };

      _Class.prototype.rmi = function(item) {
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

      return _Class;

    })()
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
    if (root == null) {
      root = d.body;
    }
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  };

  Options = {
    init: function() {
      var a, el, settings, _i, _len, _ref;
      _ref = ['navtopr', 'navbotr'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        settings = _ref[_i];
        a = $.el('a', {
          href: 'javascript:;',
          className: 'settingsWindowLink',
          textContent: 'AppChan X Settings'
        });
        $.on(a, 'click', Options.dialog);
        el = $.id(settings).firstElementChild;
        el.hidden = true;
        $.before(el, a);
      }
      if (!$.get('firstrun')) {
        $.set('firstrun', true);
        return Options.dialog();
      }
    },
    dialog: function() {
      var arr, back, category, checked, contents, description, dialog, div, favicon, fileInfo, filter, hiddenNum, hiddenThreads, input, key, left, li, liHTML, mascot, name, obj, optionname, optionvalue, overlay, sauce, selectoption, styleSetting, theme, themename, time, top, tr, ul, _i, _len, _ref, _ref1, _ref2, _ref3;
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
    <div>Allowed keys: Ctrl, Alt, Meta, a-z, A-Z, 0-9, Up, Down, Right, Left.</div>\
    <table><tbody>\
      <tr><th>Actions</th><th>Keybinds</th></tr>\
    </tbody></table>\
  </div>\
  <input type=radio name=tab hidden id=style_tab>\
  <div>\
    <div class=warning><code>Style</code> is currently disabled. Please enable it in the Main tab to use styling options.</div>\
  </div>\
  <input type=radio name=tab hidden id=theme_tab>\
  <div>\
    <div class=warning><code>Style</code> is currently disabled. Please enable it in the Main tab to use theming options.</div></div>\
  <input type=radio name=tab hidden id=mascot_tab>\
  <div>\
    <div class=warning><code>Style</code> is currently disabled. Please enable it in the Main tab to use mascot options.</div>\
  </div>\
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
      Style.button(dialog, 'style_tab');
      _ref2 = Config.style;
      for (category in _ref2) {
        obj = _ref2[category];
        ul = $.el('ul', {
          textContent: category
        });
        for (optionname in obj) {
          arr = obj[optionname];
          description = arr[1];
          if (arr[2]) {
            liHTML = "<label>" + optionname + "</label><span class=description>: " + description + "</span><select name=\"" + optionname + "\"><br>";
            _ref3 = arr[2];
            for (optionvalue = _i = 0, _len = _ref3.length; _i < _len; optionvalue = ++_i) {
              selectoption = _ref3[optionvalue];
              liHTML = liHTML + ("<option value=\"" + selectoption + "\">" + selectoption + "</option>");
            }
            liHTML = liHTML + "</select>";
            li = $.el('li', {
              innerHTML: liHTML
            });
            styleSetting = $("select[name='" + optionname + "']", li);
            styleSetting.value = $.get(optionname, Conf[optionname]);
            $.on(styleSetting, 'change', $.cb.value);
            $.on(styleSetting, 'change', Options.style);
          } else {
            checked = $.get(optionname, Conf[optionname]) ? 'checked' : '';
            li = $.el('li', {
              innerHTML: "<label><input type=checkbox name=\"" + optionname + "\" " + checked + ">" + optionname + "</label><span class=description>: " + description + "</span>"
            });
            $.on($('input', li), 'click', $.cb.checked);
          }
          $.add(ul, li);
        }
        $.add($('#style_tab + div', dialog), ul);
      }
      Style.button(dialog, 'style_tab');
      Style.button(dialog, 'theme_tab');
      for (themename in Themes) {
        theme = Themes[themename];
        div = $.el('div', {
          className: themename === Conf['theme'] ? 'selectedtheme' : '',
          id: themename,
          innerHTML: "<div class='reply' style='position: relative; cursor: pointer; width: 100%; box-shadow: none !important; background-color:" + theme['Reply Background'] + "!important;border:1px solid " + theme['Reply Border'] + "!important;color:" + theme['Text'] + "!important'><div class='rice' style='width: 12px;height: 12px;margin: 0 3px;vertical-align: middle;display: inline-block;background-color:" + theme['Checkbox Background'] + ";border: 1px solid " + theme['Checkbox Border'] + ";'></div><span style='color:" + theme['Subjects'] + "!important; font-weight: 700 !important'> " + themename + "</span> <span style='color:" + theme['Names'] + "!important; font-weight: 700 !important'>" + theme['Author'] + "</span> <span style='color:" + theme['Sage'] + "!important'> (SAGE)</span><span style='color:" + theme['Tripcodes'] + "!important'> " + theme['Author Tripcode'] + "</span><time style='color:" + theme['Timestamps'] + "'> 20XX.01.01 12:00 </time><a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Post Numbers'] + "!important&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important&quot;)' style='color:" + theme['Post Numbers'] + "!important' href='javascript:;'>No.22772469</a><br><blockquote>Post content is right here.</blockquote><h1 style='color: " + theme['Text'] + "'>Selected</h1></div>"
        });
        $.on(div, 'click', function() {
          $.rmClass($.id(Conf['theme']), 'selectedtheme');
          $.set('theme', this.id);
          Conf['theme'] = this.id;
          return $.addClass(this, 'selectedtheme');
        });
        $.add($('#theme_tab + div', dialog), div);
      }
      Style.button(dialog, 'theme_tab');
      Style.button(dialog, 'mascot_tab');
      for (category in Mascots) {
        contents = Mascots[category];
        ul = $.el('ul', {
          innerHTML: "<div style='clear: both;'>" + category + "</div>",
          id: category,
          className: 'mascots'
        });
        for (name in contents) {
          mascot = contents[name];
          description = name;
          li = $.el('li', {
            innerHTML: "<div id='" + name + "' style='background-image: " + mascot + ";'></div>",
            className: 'mascot'
          });
          div = $('div', li);
          if (enabledmascots[name] === true) {
            $.addClass(div, 'enabled');
          }
          $.on(div, 'click', function() {
            if (enabledmascots[this.id] === true) {
              $.rmClass(this, 'enabled');
              $.set(this.id, false);
              return enabledmascots[this.id] = false;
            } else {
              $.addClass(this, 'enabled');
              $.set(this.id, true);
              return enabledmascots[this.id] = true;
            }
          });
          $.add(ul, li);
        }
        $.add($('#mascot_tab + div', dialog), ul);
      }
      Style.button(dialog, 'mascot_tab');
      Options.indicators(dialog);
      overlay = $.el('div', {
        id: 'overlay'
      });
      $.on(overlay, 'click', Options.close);
      $.add(d.body, overlay);
      dialog.style.visibility = 'hidden';
      $.add(d.body, dialog);
      left = (window.innerWidth - dialog.getBoundingClientRect().width) / 2 + window.pageXOffset;
      top = (window.innerHeight - dialog.getBoundingClientRect().height) / 2 + window.pageYOffset;
      if (left < 0) {
        left = 0;
      }
      if (top < 0) {
        top = 0;
      }
      dialog.style.left = left + 'px';
      dialog.style.top = top + 'px';
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
    close: function() {
      $.rm(this.nextSibling);
      return $.rm(this);
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
      return $('.postInfo .subject', post.el).textContent || false;
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
        return img.alt;
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
          if (Conf['Recursive Filtering']) {
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
      this.textContent = "Loading " + replyID + "...";
      a = this;
      return $.cache(this.pathname, function() {
        return ExpandComment.parse(this, a, threadID, replyID);
      });
    },
    parse: function(req, a, threadID, replyID) {
      var doc, href, node, post, quote, quotes, _i, _len;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        return;
      }
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = req.response;
      node = d.importNode(doc.getElementById("m" + replyID), true);
      quotes = node.getElementsByClassName('quotelink');
      for (_i = 0, _len = quotes.length; _i < _len; _i++) {
        quote = quotes[_i];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "res/" + href;
      }
      post = {
        blockquote: node,
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
      $.replace(a.parentNode.parentNode, node);
      return Main.prettify(node);
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
      var a, num, pathname, replies, reply, _i, _len;
      pathname = "/" + g.BOARD + "/res/" + thread.id.slice(1);
      a = $('.summary', thread);
      switch (a.textContent[0]) {
        case '+':
          a.textContent = a.textContent.replace('+', '× Loading...');
          $.cache(pathname, function() {
            return ExpandThread.parse(this, thread, a);
          });
          break;
        case 'X':
          a.textContent = a.textContent.replace('× Loading...', '+');
          $.cache.requests[pathname].abort();
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
      var backlink, doc, href, id, link, nodes, post, quote, reply, threadID, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      if (req.status !== 200) {
        a.textContent = "" + req.status + " " + req.statusText;
        $.off(a, 'click', ExpandThread.cb.toggle);
        return;
      }
      a.textContent = a.textContent.replace('× Loading...', '-');
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = req.response;
      threadID = thread.id.slice(1);
      nodes = [];
      _ref = $$('.replyContainer', doc);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        reply = _ref[_i];
        reply = d.importNode(reply, true);
        _ref1 = $$('.quotelink', reply);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          quote = _ref1[_j];
          href = quote.getAttribute('href');
          if (href[0] === '/') {
            continue;
          }
          quote.href = "res/" + href;
        }
        id = reply.id.slice(2);
        link = $('a[title="Highlight this post"]', reply);
        link.href = "res/" + threadID + "#p" + id;
        link.nextSibling.href = "res/" + threadID + "#q" + id;
        nodes.push(reply);
      }
      _ref2 = $$('.summary ~ .replyContainer', a.parentNode);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        post = _ref2[_k];
        $.rm(post);
      }
      _ref3 = $$('.backlink', a.previousElementSibling);
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        backlink = _ref3[_l];
        if (!$.id(backlink.hash.slice(1))) {
          $.rm(backlink);
        }
      }
      return $.after(a, nodes);
    }
  };

  ThreadHiding = {
    init: function() {
      var a, hiddenThreads, thread, _i, _len, _ref;
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      _ref = $$('.thread');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thread = _ref[_i];
        a = $.el('a', {
          className: 'hide_thread_button',
          innerHTML: '<span>[ - ]</span>',
          href: 'javascript:;'
        });
        $.on(a, 'click', ThreadHiding.cb);
        $.prepend(thread, a);
        if (thread.id.slice(1) in hiddenThreads) {
          ThreadHiding.hide(thread);
        }
      }
    },
    cb: function() {
      return ThreadHiding.toggle($.x('ancestor::div[parent::div[@class="board"]]', this));
    },
    toggle: function(thread) {
      var hiddenThreads, id;
      hiddenThreads = $.get("hiddenThreads/" + g.BOARD + "/", {});
      id = thread.id.slice(1);
      if (thread.hidden || /\bhidden_thread\b/.test(thread.firstChild.className)) {
        ThreadHiding.show(thread);
        delete hiddenThreads[id];
      } else {
        ThreadHiding.hide(thread);
        hiddenThreads[id] = Date.now();
      }
      return $.set("hiddenThreads/" + g.BOARD + "/", hiddenThreads);
    },
    hide: function(thread, show_stub) {
      var a, menuButton, num, opInfo, span, stub, text;
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
      stub = $.el('div', {
        className: 'hide_thread_button hidden_thread',
        innerHTML: '<a href="javascript:;"><span>[ + ]</span> </a>'
      });
      a = stub.firstChild;
      $.on(a, 'click', ThreadHiding.cb);
      $.add(a, $.tn("" + opInfo + " (" + text + ")"));
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
      $.on(side.firstChild, 'click', ReplyHiding.toggle);
      if (post.ID in g.hiddenReplies) {
        return ReplyHiding.hide(post.root);
      }
    },
    toggle: function() {
      var button, id, quote, quotes, root, _i, _j, _len, _len1;
      button = this.parentNode;
      root = button.parentNode;
      id = root.id.slice(2);
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
      $.on(a, 'click', ReplyHiding.toggle);
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
          Updater.updateReset();
          break;
        case Conf.unreadCountTo0:
          Unread.replies = new $.RandomAccessList;
          Unread.update(true);
          break;
        case Conf.threading:
          QuoteThreading["public"].toggle();
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
      var checkbox, checked, dialog, html, input, name, title, type, _i, _len, _ref;
      html = "<div class=move><span id=count></span> <span id=timer>-" + Conf['Interval'] + "</span></div>";
      checkbox = Config.updater.checkbox;
      for (name in checkbox) {
        title = checkbox[name][1];
        checked = Conf[name] ? 'checked' : '';
        html += "<div><label title='" + title + "'>" + name + "<input name='" + name + "' type=checkbox " + checked + "></label></div>";
      }
      checked = Conf['Auto Update'] ? 'checked' : '';
      html += "	<div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox " + checked + "></label></div>	<div><label>Interval (s)<input name=Interval value=" + Conf['Interval'] + " class=field size=4></label></div>	<div><input value='Update Now' type=button name='Update Now'></div>";
      dialog = UI.dialog('updater', 'bottom: 0; right: 0;', html);
      this.count = $('#count', dialog);
      this.timer = $('#timer', dialog);
      this.thread = $.id("t" + g.THREAD_ID);
      this.lastPost = this.thread.lastElementChild;
      _ref = $$('input', dialog);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        input = _ref[_i];
        type = input.type, name = input.name;
        if (type === 'checkbox') {
          $.on(input, 'click', $.cb.checked);
        }
        switch (name) {
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
            Conf[input.name] = input.checked;
            break;
          case 'Interval':
            $.on(input, 'input', this.cb.interval);
            break;
          case 'Update Now':
            $.on(input, 'click', this.update);
        }
      }
      $.add(d.body, dialog);
      this.retryCoef = 10;
      this.lastModified = 0;
      return $.on(d, 'QRPostSuccessful', this.cb.post);
    },
    cb: {
      post: function() {
        if (!Conf['Auto Update This']) {

        }
      },
      interval: function() {
        var val;
        val = parseInt(this.value, 10);
        this.value = val > 0 ? val : 30;
        return $.cb.value.call(this);
      },
      verbose: function() {
        if (Conf['Verbose']) {
          Updater.count.textContent = '+0';
          return Updater.timer.hidden = false;
        } else {
          $.extend(Updater.count, {
            className: '',
            textContent: 'Thread Updater'
          });
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
      update: function() {
        var count, doc, id, lastPost, nodes, reply, scroll, _i, _len, _ref;
        if (this.status === 404) {
          Updater.timer.textContent = '';
          Updater.count.textContent = 404;
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
          return;
        }
        if (this.status !== 200 && this.status !== 304) {
          Updater.retryCoef += 10 * (Updater.retryCoef < 120);
          if (Conf['Verbose']) {
            Updater.count.textContent = this.statusText;
            Updater.count.className = 'warning';
          }
          return;
        }
        Updater.retryCoef = 10;
        Updater.timer.textContent = "-" + Conf['Interval'];
        /*
              Status Code 304: Not modified
              By sending the `If-Modified-Since` header we get a proper status code, and no response.
              This saves bandwidth for both the user and the servers, avoid unnecessary computation,
              and won't load images and scripts when parsing the response.
        */

        if (this.status === 304) {
          if (Conf['Verbose']) {
            Updater.count.textContent = '+0';
            Updater.count.className = null;
          }
          return;
        }
        Updater.lastModified = this.getResponseHeader('Last-Modified');
        doc = d.implementation.createHTMLDocument('');
        doc.documentElement.innerHTML = this.response;
        lastPost = Updater.lastPost;
        id = lastPost.id.slice(2);
        nodes = [];
        _ref = $$('.replyContainer', doc).reverse();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          reply = _ref[_i];
          if (reply.id.slice(2) <= id) {
            break;
          }
          nodes.push(reply);
        }
        count = nodes.length;
        if (Conf['Verbose']) {
          Updater.count.textContent = "+" + count;
          Updater.count.className = count ? 'new' : null;
        }
        count = nodes.length;
        scroll = Conf['Scrolling'] && Updater.scrollBG() && count && lastPost.getBoundingClientRect().bottom - d.documentElement.clientHeight < 25;
        if (Conf['Verbose']) {
          Updater.count.textContent = "+" + count;
          Updater.count.className = count ? 'new' : null;
        }
        if (lastPost = nodes[0]) {
          Updater.lastPost = lastPost;
        }
        $.add(Updater.thread, nodes.reverse());
        if (scroll) {
          return lastPost.scrollIntoView();
        }
      }
    },
    timeout: function() {
      var n;
      Updater.timeoutID = setTimeout(Updater.timeout, 1000);
      n = 1 + Number(Updater.timer.textContent);
      if (n === 0) {
        return Updater.update();
      } else if (n === Updater.retryCoef) {
        Updater.retryCoef += 10 * (Updater.retryCoef < 120);
        return Updater.retry();
      } else {
        return Updater.timer.textContent = n;
      }
    },
    retry: function() {
      this.count.textContent = 'Retry';
      this.count.className = null;
      return this.update();
    },
    update: function() {
      var url, _ref;
      Updater.timer.textContent = 0;
      if ((_ref = Updater.request) != null) {
        _ref.abort();
      }
      url = location.pathname + '?' + Date.now();
      return Updater.request = $.ajax(url, {
        onload: Updater.cb.update
      }, {
        headers: {
          'If-Modified-Since': Updater.lastModified
        }
      });
    },
    updateReset: function() {
      return Updater.update();
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
        nodes.push($.tn($.NBSP), link(img, post.isArchived));
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
        shortname: $.shortenFilename(filename, post.ID === post.threadID)
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
        return $.cache("/" + board + "/res/" + threadID, function() {
          return Get.parsePost(this, board, threadID, postID, root, cb);
        });
      } else if (url = Redirect.post(board, postID)) {
        return $.cache(url, function() {
          return Get.parseArchivedPost(this, board, postID, root, cb);
        });
      }
    },
    parsePost: function(req, board, threadID, postID, root, cb) {
      var doc, href, link, pc, quote, status, url, _i, _len, _ref;
      status = req.status;
      if (status !== 200) {
        if (url = Redirect.post(board, postID)) {
          $.cache(url, function() {
            return Get.parseArchivedPost(this, board, postID, root, cb);
          });
        } else {
          root.textContent = status === 404 ? "Thread No." + threadID + " has not been found." : "Error " + req.status + ": " + req.statusText + ".";
        }
        return;
      }
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = req.response;
      if (!(pc = doc.getElementById("pc" + postID))) {
        if (url = Redirect.post(board, postID)) {
          $.cache(url, function() {
            return Get.parseArchivedPost(this, board, postID, root, cb);
          });
        } else {
          root.textContent = "Post No." + postID + " has not been found.";
        }
        return;
      }
      pc = Get.cleanPost(d.importNode(pc, true));
      _ref = $$('.quotelink', pc);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "/" + board + "/res/" + href;
      }
      link = $('a[title="Highlight this post"]', pc);
      link.href = "/" + board + "/res/" + threadID + "#p" + postID;
      link.nextSibling.href = "/" + board + "/res/" + threadID + "#q" + postID;
      $.replace(root.firstChild, pc);
      if (cb) {
        return cb();
      }
    },
    parseArchivedPost: function(req, board, postID, root, cb) {
      var bq, br, capcode, data, email, file, filename, filesize, isOP, name, nameBlock, pc, pi, piM, span, spoiler, subject, threadID, thumb_src, timestamp, trip, userID;
      data = JSON.parse(req.response);
      $.addClass(root, 'archivedPost');
      if (data.error) {
        root.textContent = data.error;
        return;
      }
      threadID = data.thread_num;
      isOP = postID === threadID;
      name = data.name, trip = data.trip, timestamp = data.timestamp;
      subject = data.title;
      userID = data.poster_hash;
      piM = $.el('div', {
        id: "pim" + postID,
        className: 'postInfoM mobile',
        innerHTML: "<span class=nameBlock><span class=name></span><br><span class=subject></span></span><span class='dateTime postNum' data-utc=" + timestamp + ">" + data.fourchan_date + "<br><em></em><a href='/" + board + "/res/" + threadID + "#p" + postID + "'>No.</a><a href='/" + board + "/res/" + threadID + "#q" + postID + "'>" + postID + "</a></span>"
      });
      $('.name', piM).textContent = name;
      $('.subject', piM).textContent = subject;
      br = $('br', piM);
      if (trip) {
        $.before(br, [
          $.tn(' '), $.el('span', {
            className: 'postertrip',
            textContent: trip
          })
        ]);
      }
      capcode = data.capcode;
      if (capcode !== 'N') {
        $.addClass(br.parentNode, capcode === 'A' ? 'capcodeAdmin' : 'capcodeMod');
        $.before(br, [
          $.tn(' '), $.el('strong', {
            className: 'capcode',
            textContent: capcode === 'A' ? '## Admin' : '## Mod'
          }), $.tn(' '), $.el('img', {
            src: capcode === 'A' ? '//static.4chan.org/image/adminicon.gif' : '//static.4chan.org/image/modicon.gif',
            alt: capcode === 'A' ? 'This user is the 4chan Administrator.' : 'This user is a 4chan Moderator.',
            title: capcode === 'A' ? 'This user is the 4chan Administrator.' : 'This user is a 4chan Moderator.',
            className: 'identityIcon'
          })
        ]);
      }
      pi = $.el('div', {
        id: "pi" + postID,
        className: 'postInfo desktop',
        innerHTML: "<input type=checkbox name=" + postID + " value=delete> <span class=subject></span> <span class=nameBlock></span> <span class=dateTime data-utc=" + timestamp + ">data.fourchan_date</span> <span class='postNum desktop'><a href='/" + board + "/res/" + threadID + "#p" + postID + "' title='Highlight this post'>No.</a><a href='/" + board + "/res/" + threadID + "#q" + postID + "' title='Quote this post'>" + postID + "</a></span>"
      });
      $('.subject', pi).textContent = subject;
      nameBlock = $('.nameBlock', pi);
      if (data.email) {
        email = $.el('a', {
          className: 'useremail',
          href: "mailto:" + data.email
        });
        $.add(nameBlock, email);
        nameBlock = email;
      }
      $.add(nameBlock, $.el('span', {
        className: 'name',
        textContent: data.name
      }));
      if (userID) {
        $.add(nameBlock, [
          $.tn(' '), $.el('span', {
            className: "posteruid id_" + userID,
            innerHTML: "(ID: <span class=hand title='Highlight posts by this ID'>" + userID + "</span>)"
          })
        ]);
      }
      if (trip) {
        $.add(nameBlock, [
          $.tn(' '), $.el('span', {
            className: 'postertrip',
            textContent: trip
          })
        ]);
      }
      nameBlock = $('.nameBlock', pi);
      switch (capcode) {
        case 'A':
          $.addClass(nameBlock, 'capcodeAdmin');
          $.add(nameBlock, [
            $.tn(' '), $.el('strong', {
              className: 'capcode',
              textContent: '## Admin'
            }), $.tn(' '), $.el('img', {
              src: '//static.4chan.org/image/adminicon.gif',
              alt: 'This user is the 4chan Administrator.',
              title: 'This user is the 4chan Administrator.',
              className: 'identityIcon'
            })
          ]);
          break;
        case 'M':
          $.addClass(nameBlock, 'capcodeMod');
          $.add(nameBlock, [
            $.tn(' '), $.el('strong', {
              className: 'capcode',
              textContent: '## Mod'
            }), $.tn(' '), $.el('img', {
              src: '//static.4chan.org/image/modicon.gif',
              alt: 'This user is a 4chan Moderator.',
              title: 'This user is a 4chan Moderator.',
              className: 'identityIcon'
            })
          ]);
          break;
        case 'D':
          $.addClass(nameBlock, 'capcodeDeveloper');
          $.add(nameBlock, [
            $.tn(' '), $.el('strong', {
              className: 'capcode',
              textContent: '## Developer'
            }), $.tn(' '), $.el('img', {
              src: '//static.4chan.org/image/developericon.gif',
              alt: 'This user is a 4chan Developer.',
              title: 'title="This user is a 4chan Developer.',
              className: 'identityIcon'
            })
          ]);
      }
      bq = $.el('blockquote', {
        id: "m" + postID,
        className: 'postMessage',
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
      bq.innerHTML = bq.innerHTML.replace(/(^|>)(&gt;[^<$]+)(<|$)/g, '$1<span class=quote>$2</span>$3');
      pc = $.el('div', {
        id: "pc" + postID,
        className: "postContainer " + (isOP ? 'op' : 'reply') + "Container",
        innerHTML: "<div id=p" + postID + " class='post " + (isOP ? 'op' : 'reply') + "'></div>"
      });
      $.add(pc.firstChild, [piM, pi, bq]);
      if (filename = data.media_filename) {
        file = $.el('div', {
          id: "f" + postID,
          className: 'file'
        });
        spoiler = data.spoiler === '1';
        filesize = $.bytesToString(data.media_size);
        $.add(file, $.el('div', {
          className: 'fileInfo',
          innerHTML: "<span id=fT" + postID + " class=fileText>File: <a href='" + (data.media_link || data.remote_media_link) + "' target=_blank>" + data.media_orig + "</a>-(" + (spoiler ? 'Spoiler Image, ' : '') + filesize + ", " + data.media_w + "x" + data.media_h + ", <span title></span>)</span>"
        }));
        span = $('span[title]', file);
        span.title = filename;
        span.textContent = $.shortenFilename(filename, isOP);
        thumb_src = data.media_status === 'available' ? "src=" + data.thumb_link : '';
        $.add(file, $.el('a', {
          className: spoiler ? 'fileThumb imgspoiler' : 'fileThumb',
          href: data.media_link || data.remote_media_link,
          target: '_blank',
          innerHTML: "<img " + thumb_src + " alt='" + (data.media_status !== 'available' ? "Error: " + data.media_status + ", " : '') + (spoiler ? 'Spoiler Image, ' : '') + filesize + "' data-md5=" + data.media_hash + " style='height: " + data.preview_h + "px; width: " + data.preview_w + "px;'>"
        }));
        $.after((isOP ? piM : pi), file);
      }
      $.replace(root.firstChild, Get.cleanPost(pc));
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
      el = $('.subject', op);
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
        if (quote.parentNode.getAttribute('style') === 'font-size: smaller;') {
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
        } else {
          link.setAttribute('onclick', "replyhl('" + post.ID + "');");
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
        quote.removeAttribute('onclick');
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
      var board, el, inline, isBacklink, path, postID, root, threadID;
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
      if (Unread.replies && postID in Unread.replies) {
        Unread.replies.rm(postID);
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
          $.add(quote, $.tn($.NBSP + '(OP)'));
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
          $.add(quote, $.tn($.NBSP + '(Cross-thread)'));
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
      snapshot = $.X('.//text()[not(parent::a)][not(ancestor::pre)]', post.blockquote);
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
            textContent: "" + quote + $.NBSP + "(Dead)"
          }));
          if (board === g.BOARD && $.id("p" + id)) {
            a.href = "#p" + id;
            a.className = 'quotelink';
            a.setAttribute('onclick', "replyhl('" + id + "');");
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

  QuoteThreading = {
    init: function() {
      var controls, form, input;
      if (!(Conf['Unread Count'] || Conf['Unread Favicon'])) {
        return;
      }
      Main.callbacks.push(this.node);
      this.enabled = true;
      controls = $.el('span', {
        innerHTML: '<label>Threading<input id=threadingControl type=checkbox checked></label>'
      });
      input = $('input', controls);
      $.on(input, 'change', QuoteThreading.toggle);
      form = $('#delform');
      return $.prepend(form, controls);
    },
    node: function(post) {
      var ID, keys, pEl, pid, preply, qid, qreply, qroot, quote, quotes, replies, reply, threadContainer, uniq, _i, _len;
      if (post.isInlined || !QuoteThreading.enabled) {
        return;
      }
      quotes = post.quotes, ID = post.ID;
      replies = Unread.replies;
      if (!(reply = replies[ID])) {
        return;
      }
      uniq = {};
      for (_i = 0, _len = quotes.length; _i < _len; _i++) {
        quote = quotes[_i];
        qid = quote.hash.slice(2);
        if (!(qid < ID)) {
          continue;
        }
        if (qid in replies) {
          uniq[qid] = true;
        }
      }
      keys = Object.keys(uniq);
      if (keys.length !== 1) {
        return;
      }
      qid = keys[0];
      qreply = replies[qid];
      qroot = qreply.el.parentNode;
      threadContainer = qroot.nextSibling;
      if ((threadContainer != null ? threadContainer.className : void 0) !== 'threadContainer') {
        threadContainer = $.el('div', {
          className: 'threadContainer'
        });
        $.after(qroot, threadContainer);
      }
      $.add(threadContainer, reply.el.parentNode);
      pEl = $.x('preceding::div[contains(@class,"post reply")][1]/parent::div', reply.el.parentNode);
      pid = pEl.id.slice(2);
      preply = replies[pid];
      return replies.after(preply, reply);
    },
    toggle: function() {
      var container, containers, node, nodes, replies, reply, thread, _i, _j, _k, _len, _len1, _len2;
      Main.disconnect();
      Unread.replies = new $.RandomAccessList;
      thread = $('.thread');
      replies = $$('.thread > .replyContainer, .threadContainer > .replyContainer', thread);
      QuoteThreading.enabled = this.checked;
      if (this.checked) {
        nodes = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = replies.length; _i < _len; _i++) {
            reply = replies[_i];
            _results.push(Main.preParse(reply));
          }
          return _results;
        })();
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          Unread.node(node);
        }
        Unread.scroll();
        for (_j = 0, _len1 = nodes.length; _j < _len1; _j++) {
          node = nodes[_j];
          QuoteThreading.node(node);
        }
      } else {
        replies.sort(function(a, b) {
          var aID, bID;
          aID = Number(a.id.slice(2));
          bID = Number(b.id.slice(2));
          return aID - bID;
        });
        $.add(thread, replies);
        containers = $$('.threadContainer', thread);
        for (_k = 0, _len2 = containers.length; _k < _len2; _k++) {
          container = containers[_k];
          $.rm(container);
        }
        Unread.update(true);
      }
      return Main.observe();
    },
    "public": {
      toggle: function() {
        var control;
        control = $.id('threadingControl');
        control.checked = !control.checked;
        return QuoteThreading.toggle.call(control);
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
        return DeleteLink.cooldown.count(e.detail.postID, 30);
      },
      count: function(postID, seconds) {
        var el;
        if (!((0 <= seconds && seconds <= 30))) {
          return;
        }
        setTimeout(DeleteLink.cooldown.count, 1000, postID, seconds - 1);
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
      if ($.el('a').download === void 0) {
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
      this.replies = new $.RandomAccessList;
      this.title = d.title;
      $.on(d, 'QRPostSuccessful', this.post);
      this.update();
      $.on(window, 'scroll', Unread.scroll);
      return Main.callbacks.push(this.node);
    },
    foresee: [],
    post: function(e) {
      return Unread.foresee.push(e.detail.postID);
    },
    node: function(post) {
      var el, index, replies;
      el = post.el;
      if ((index = Unread.foresee.indexOf(post.ID)) !== -1) {
        Unread.foresee.splice(index, 1);
        return;
      }
      if (el.hidden || /\bop\b/.test(post["class"]) || post.isInlined) {
        return;
      }
      replies = Unread.replies;
      replies.push(post.ID, el);
      return Unread.update(replies.length === 1);
    },
    scroll: function() {
      var bottom, first, height, replies, update;
      height = d.documentElement.clientHeight;
      replies = Unread.replies;
      first = replies.first;
      update = false;
      while (first) {
        bottom = first.el.getBoundingClientRect().bottom;
        if (bottom > height) {
          break;
        }
        update = true;
        replies.shift();
        first = replies.first;
      }
      if (!update) {
        return;
      }
      return Unread.update(replies.length === 0);
    },
    setTitle: function(count) {
      return d.title = "(" + count + ") " + Unread.title;
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
          return "//archive.foolz.us/api/chan/post/board/" + board + "/num/" + postID + "/format/json";
        case 'u':
        case 'kuku':
          return "//nsfw.foolz.us/api/chan/post/board/" + board + "/num/" + postID + "/format/json";
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
        case 'g':
        case 'sci':
          url = "//archive.installgentoo.net/" + path;
          if (threadID && postID) {
            url += "#p" + postID;
          }
          break;
        case 'cgl':
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
      var a, sp;
      if (!post.img) {
        return;
      }
      sp = FileInfo.data.spoiler;
      a = post.img.parentNode;
      $.on(a, 'click', ImageExpand.cb.toggle);
      if (ImageExpand.on && !post.el.hidden && sp !== true) {
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
      controls = $.el('span', {
        id: 'imgControls',
        innerHTML: "<select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label>Expand Images<input type=checkbox id=imageExpand></label>"
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
              $('select', QR.el).value = 'new';
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
      var el;
      el = $('.warning', QR.el);
      if (typeof err === 'string') {
        el.textContent = err;
      } else {
        el.innerHTML = null;
        $.add(el, err);
      }
      QR.open();
      if (/captcha|verification/i.test(el.textContent)) {
        $('[autocomplete]', QR.el).focus();
      }
      if (d.hidden || d.oHidden || d.mozHidden || d.webkitHidden) {
        return alert(el.textContent);
      }
    },
    cleanError: function() {
      return $('.warning', QR.el).textContent = null;
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
      value = QR.cooldown.seconds || data.progress || value;
      input = QR.status.input;
      input.value = QR.cooldown.auto && Conf['Cooldown'] ? value ? "Auto " + value : 'Auto' : value || 'Submit';
      return input.disabled = disabled || false;
    },
    cooldown: {
      init: function() {
        if (!Conf['Cooldown']) {
          return;
        }
        QR.cooldown.start($.get("/" + g.BOARD + "/cooldown", 0));
        return $.sync("/" + g.BOARD + "/cooldown", QR.cooldown.start);
      },
      start: function(timeout) {
        var seconds;
        seconds = Math.floor((timeout - Date.now()) / 1000);
        return QR.cooldown.count(seconds);
      },
      set: function(seconds) {
        if (!Conf['Cooldown']) {
          return;
        }
        QR.cooldown.count(seconds);
        return $.set("/" + g.BOARD + "/cooldown", Date.now() + seconds * $.SECOND);
      },
      count: function(seconds) {
        if (!((0 <= seconds && seconds <= 60))) {
          return;
        }
        setTimeout(QR.cooldown.count, 1000, seconds - 1);
        QR.cooldown.seconds = seconds;
        if (seconds === 0) {
          $["delete"]("/" + g.BOARD + "/cooldown");
          if (QR.cooldown.auto) {
            QR.submit();
          }
        }
        return QR.status();
      }
    },
    quote: function(e) {
      var caretPos, id, range, s, sel, ta, text, _ref;
      if (e != null) {
        e.preventDefault();
      }
      QR.open();
      if (!g.REPLY) {
        $('select', QR.el).value = $.x('ancestor::div[parent::div[@class="board"]]', this).id.slice(1);
      }
      id = this.previousSibling.hash.slice(2);
      text = ">>" + id + "\n";
      sel = window.getSelection();
      if ((s = sel.toString()) && id === ((_ref = $.x('ancestor-or-self::blockquote', sel.anchorNode)) != null ? _ref.id.match(/\d+$/)[0] : void 0)) {
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
      var clone, input;
      input = $('[type=file]', QR.el);
      input.value = null;
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
        this.email = prev && !/^sage$/.test(prev.email) ? prev.email : Conf['Sage on /jp/'] && g.BOARD === 'jp' ? 'sage' : persona.email || null;
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
        var data, rectEl, rectList, _i, _len, _ref, _ref1;
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
          $("[name=" + data + "]", QR.el).value = this[data];
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
        if (typeof (_base = window.URL || window.webkitURL).revokeObjectURL === "function") {
          _base.revokeObjectURL(this.url);
        }
        return delete this;
      };

      return _Class;

    })(),
    captcha: {
      init: function() {
        var _this = this;
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
      var fileInput, id, mimeTypes, name, spoiler, ta, thread, threads, _i, _j, _len, _len1, _ref, _ref1;
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
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image</label>\
  <div class=warning></div>\
</form>');
      } else {
        QR.el = UI.dialog('qr', '', '\
<form>\
  <div><input id=dump type=button title="Dump list" value=+ class=field><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>\
  <div id=replies><div><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>\
  <div class=textarea><textarea name=com title=Comment placeholder=Comment class=field></textarea><span id=charCount></span></div>\
  <div><input type=file title="Shift+Click to remove the selected file." multiple size=16><input type=submit></div>\
  <div id=threadselect></div>\
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image</label>\
  <div class=warning></div>\
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
        if (!Conf["Style"]) {
          $.prepend($('.move > span', QR.el), $.el('select', {
            innerHTML: threads,
            title: 'Create a new thread / Reply to a thread'
          }));
        } else {
          $.prepend($('#threadselect', QR.el), $.el('select', {
            innerHTML: threads,
            title: 'Create a new thread / Reply to a thread'
          }));
        }
        $.on($('select', QR.el), 'mousedown', function(e) {
          return e.stopPropagation();
        });
      }
      if (!Conf['Style']) {
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
      $.on($('.warning', QR.el), 'click', QR.cleanError);
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
          if (QR.cooldown.auto && QR.selected === QR.replies[0] && (0 < (_ref2 = QR.cooldown.seconds) && _ref2 < 6)) {
            return QR.cooldown.auto = false;
          }
        });
      }
      QR.status.input = $('input[type=submit]', QR.el);
      QR.status();
      QR.cooldown.init();
      QR.captcha.init();
      if (Conf['Style']) {
        $.on($(".captchainput .field", QR.el), 'focus', function() {
          return QR.el.classList.add('focus');
        });
        $.on($(".captchainput .field", QR.el), 'blur', function() {
          return QR.el.classList.remove('focus');
        });
      }
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
      threadID = g.THREAD_ID || $('select', QR.el).value;
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
      if (Conf['Auto Hide QR'] && !QR.cooldown.auto) {
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
      var bs, doc, err, msg, persona, postID, reply, threadID, _, _ref;
      doc = d.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      if (doc.title === '4chan - Banned') {
        bs = $$('b', doc);
        err = $.el('span', {
          innerHTML: /^You were issued a warning/.test($('.boxcontent', doc).textContent.trim()) ? "You were issued a warning on " + bs[0].innerHTML + " as " + bs[3].innerHTML + ".<br>Warning reason: " + bs[1].innerHTML : "You are banned! ;_;<br>Please click <a href=//www.4chan.org/banned target=_blank>HERE</a> to see the reason."
        });
      } else if (msg = doc.getElementById('errmsg')) {
        err = msg.textContent;
        if (msg.firstChild.tagName) {
          err = msg.firstChild;
          err.target = '_blank';
        }
      } else if (!(msg = $('b', doc))) {
        err = 'Connection error with sys.4chan.org.';
      }
      if (err) {
        if (/captcha|verification/i.test(err) || err === 'Connection error with sys.4chan.org.') {
          QR.cooldown.auto = !!$.get('captchas', []).length;
          QR.cooldown.set(2);
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
        email: /^sage$/.test(reply.email) ? persona.email : reply.email,
        sub: Conf['Remember Subject'] ? reply.sub : null
      };
      $.set('QR.persona', persona);
      _ref = msg.lastChild.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref[0], threadID = _ref[1], postID = _ref[2];
      $.event(QR.el, new CustomEvent('QRPostSuccessful', {
        bubbles: true,
        detail: {
          threadID: threadID,
          postID: postID
        }
      }));
      if (threadID === '0') {
        location.pathname = "/" + g.BOARD + "/res/" + postID;
      } else {
        QR.cooldown.auto = QR.replies.length > 1;
        QR.cooldown.set(g.BOARD === 'q' || /sage/i.test(reply.email) ? 60 : 30);
        if (Conf['Open Reply in New Tab'] && !g.REPLY && !QR.cooldown.auto) {
          $.open("//boards.4chan.org/" + g.BOARD + "/res/" + threadID + "#p" + postID);
        }
      }
      if (Conf['Persistent QR'] || QR.cooldown.auto in Conf['Style']) {
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

  Style = {
    init: function() {
      Conf['styleenabled'] = '1';
      if (Conf['Checkboxes'] === 'show' || Conf['Checkboxes'] === 'make checkboxes circular') {
        Main.callbacks.push(this.noderice);
      }
      return this.addStyle();
    },
    emoji: function(position, direction) {
      var css, image, item, name, _i, _len;
      css = '';
      for (_i = 0, _len = Emoji.length; _i < _len; _i++) {
        item = Emoji[_i];
        name = item[0];
        image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA' + item[1];
        css = css + '\
a.useremail[href*="' + name + '"]:last-of-type::' + position + ',\
a.useremail[href*="' + name.toLowerCase() + '"]:last-of-type::' + position + ',\
a.useremail[href*="' + name.toUpperCase() + '"]:last-of-type::' + position + ' {\
  content: url("' + image + '") " ";\
  margin-' + direction + ': 4px !important;\
}\
';
      }
      return css;
    },
    noderice: function(post) {
      var checkbox, div;
      checkbox = $('[type=checkbox]', post.root);
      div = $.el('div', {
        className: 'rice'
      });
      $.on(div, 'click', function() {
        return checkbox.click();
      });
      return $.after(checkbox, div);
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
    button: function(dialog, tab) {
      var save;
      if (Conf['styleenabled'] === '1') {
        save = $.el('div', {
          innerHTML: '<a href="javascript:void(0)">Save Style Settings</a>'
        });
        $.on($('a', save), 'click', function() {
          return Style.addStyle(Conf['theme']);
        });
        return $.add($('#' + tab + ' + div', dialog), save);
      }
    },
    addStyle: function() {
      var existingStyle, theme;
      $.off(d, 'DOMNodeInserted', Style.addStyle);
      theme = Themes[Conf['theme']];
      if (d.head) {
        if (existingStyle = $.id('appchan')) {
          $.rm(existingStyle);
        }
        return $.addStyle(Style.css(theme), 'appchan');
      } else {
        return $.on(d, 'DOMNodeInserted', Style.addStyle);
      }
    },
    css: function(theme) {
      var agent, category, css, mascot, mascotimages, mascotposition, mascots, name, pagemargin;
      agent = Style.agent();
      css = '\
::' + agent + 'selection {\
  background-color: ' + theme["Text"] + ';\
  color: ' + theme["Background Color"] + ';\
}\
body {\
  padding: 16px 0 16px;\
}\
@media only screen and (max-width: 1100px) {\
  body {\
    padding-top: 31px;\
  }\
}\
@media only screen and (max-width:689px) {\
  body {\
    padding-top: 46px;\
  }\
}\
@media only screen and (max-width:553px) {\
  body {\
    padding-top: 61px;\
  }\
}html, body, input, select, textarea, .boardTitle {\
  font-family: "' + Conf["Font"] + '";\
}\
#recaptcha_image img,\
#qr img,\
.captcha img {\
  opacity: ' + Conf["Captcha Opacity"] + ';\
}\
#qp div.post .postertrip,\
#qp div.post .subject,\
.capcode,\
.container::before,\
.dateTime,\
.file,\
.fileInfo,\
.fileText,\
.fileText span:not([class])::after,\
.name,\
.postNum,\
.postertrip,\
.rules,\
.subject,\
.subjectm\
.summary,\
a,\
blockquote,\
div.post > blockquote .chanlinkify.YTLT-link.YTLT-text,\
div.reply,\
fieldset,\
textarea,\
time + span {\
  font-size: ' + Conf["Font Size"] + 'px;\
}\
.globalMessage {\
  bottom: auto;\
  padding: 10px 5px 10px 5px;\
  position: fixed;\
  left: auto;\
  right: 2px;\
  top: -1000px;\
}\
.globalMessage b { font-weight: 100; }\
/* Cleanup */\
#absbot,\
#ft li.fill,\
#logo,\
#postPassword + span,\
#qr.auto:not(:hover) #recaptcha_reload_btn,\
#recaptcha_switch_audio_btn,\
#recaptcha_whatsthis_btn,\
#settingsBox[style*="display: none;"],\
.board > hr:last-of-type,\
.closed,\
.deleteform br,\
.error:empty,\
.hidden_thread > .summary,\
.mobile,\
.navLinksBot,\
.next,\
.pages td:nth-of-type(2n-1),\
.postingMode,\
.prev,\
.qrHeader,\
.replyContainer > .hide_reply_button.stub ~ .reply,\
.replymode,\
.rules,\
.sideArrows:not(.hide_reply_button),\
.stylechanger,\
.warnicon,\
.warning:empty,\
.yui-menu-shadow,\
a[href*="jlist"],\
body > .postingMode ~ #delform hr,\
body > br,\
body > hr,\
div.reply[hidden],\
form table tbody > tr:nth-of-type(2) td[align="right"],\
form[name="post"] h1,\
html body > span[style="left: 5px; position: absolute;"]:nth-of-type(0),\
table[style="text-align:center;width:100%;height:300px;"],\
td[style^="padding: "]:not([style="padding: 10px 7px 7px 7px;"]):not([style="padding: 10px 7px 7px;"]),\
#imgControls label:first-of-type input,\
.autoPagerS,\
#options hr,\
.inline .report_button,\
.inline input,\
.entry:not(.focused) > .subMenu,\
#autohide,\
#qr.autohide select,\
#qr.autohide .close {\
  display: none !important;\
}\
div.post > blockquote .prettyprint span {\
  font-family: monospace;\
}\
div.post div.file .fileThumb {\
  float: left;\
  margin: 3px 20px 0;\
}\
a {\
  outline: 0;\
}\
#boardNavDesktop,\
#boardNavDesktop a,\
#boardNavDesktopFoot a,\
#count,\
#imageType,\
#imageType option\
#imgControls,\
#navtopr a[href="javascript:;"],\
#postcount,\
#stats,\
#timer,\
#updater,\
.pages a,\
.pages strong,\
body:not([class]) a[href="javascript:void(0);"],\
input,\
label {\
  font-size: 12px;\
  text-decoration: none;\
}\
.filtered {\
  text-decoration: line-through;\
}\
/* YouTube Link Title */\
div.post > blockquote .chanlinkify.YTLT-link.YTLT-na {\
  text-decoration: line-through;\
}\
div.post > blockquote .chanlinkify.YTLT-link.YTLT-text {\
  font-style: normal;\
}\
/* Z-INDEXES */\
#options.reply.dialog {\
  z-index: 999 !important;\
}\
#qp {\
  z-index: 102 !important;\
}\
#autoPagerBorderPaging,\
#boardNavDesktop,\
#boardNavDesktopFoot:hover,\
#ihover,\
#menu.reply.dialog,\
#navlinks,\
#overlay,\
#updater:hover,\
.exPopup,\
html .subMenu {\
  z-index: 101 !important;\
}\
.fileThumb {\
  z-index: 100 !important;\
}\
div.navLinks a:first-of-type::after,\
.deleteform {\
  z-index: 99 !important;\
}\
#qr,\
body > form #imgControls {\
  z-index: 98 !important;\
}\
.fileText ~ a > img + img {\
  z-index: 96 !important;\
}\
#boardNavMobile,\
#imageType,\
#imgControls label:first-of-type,\
#imgControls label:first-of-type::after,\
#stats,\
#updater {\
  z-index: 10 !important;\
}\
#settingsBox {\
  z-index: 9 !important;\
}\
.deleteform:hover input[type="checkbox"],\
.deleteform:hover .rice {\
  z-index: 7 !important;\
}\
#boardNavDesktopFoot::after,\
#navtopr,\
.deleteform::before,\
.qrMessage,\
#navtopr .settingsWindowLink::after {\
  z-index: 6 !important;\
}\
#stats,\
#watcher,\
#watcher::before {\
  z-index: 4 !important;\
}\
body::after {\
  z-index: 3 !important;\
}\
#recaptcha_reload_btn,\
.boardBanner,\
.globalMessage::before,\
.replyhider a {\
  z-index: 1 !important;\
}\
div.reply,\
div.reply.highlight {\
  z-index: 0 !important;\
  ' + agent + 'box-sizing: border-box;\
}\
/* ICON POSITIONS */\
/* 4chan X Options / 4chan Options */\
#navtopr .settingsWindowLink::after {\
  position: fixed;\
  left: auto;\
  right: 17px;\
  opacity: 0.3;\
}\
#navtopr .settingsWindowLink:hover::after {\
  opacity: 1;\
  right: 16px;\
}\
/* 4sight */\
body > a[style="cursor: pointer; float: right;"]::after {\
  font-size: 12px;\
  position: fixed;\
  right: 0px;\
  opacity: 0.3;\
}\
body > a[style="cursor: pointer; float: right;"]:hover::after {\
  opacity: 1;\
}\
/* Back */\
div.navLinks > a:first-of-type::after {\
  position: fixed;\
  right: 230px;\
  cursor: pointer;\
  ' + agent + 'transform: scale(.8);\
  opacity: 0.4;\
  bottom: 1px;\
  top: auto;\
}\
div.navLinks > a:first-of-type:hover::after {\
  opacity: 1;\
}\
/* Delete Form */\
.deleteform::before {\
  visibility: visible;\
  position: fixed;\
  right: 210px;\
  ' + agent + 'transform: scale(.9);\
  opacity: 0.4;\
  top: auto;\
  bottom: 2px;\
}\
.deleteform:hover::before {\
  opacity: 1;\
  cursor: pointer;\
  bottom: -30px;\
  visibility: hidden;\
}\
/* Expand Images */\
#imgControls label:first-of-type::after {\
  opacity: 0.2;\
  position: relative;\
  top: 4px;\
}\
#imgControls label:hover:first-of-type::after {\
  opacity: 1;\
}\
/* Global Message */\
.globalMessage::before {\
  height: 9px;\
  position: fixed;\
  right: 70px;\
  min-width: 30px;\
  max-width: 30px;\
  padding-bottom: 5px;\
  opacity: 0.4;\
}\
.globalMessage:hover::before {\
  cursor: pointer;\
  opacity: 1;\
}\
/* Slideout Navigation */\
#boardNavDesktopFoot::after {\
  border: none;\
  position: fixed;\
  right: 37px;\
  opacity: 0.4;\
}\
#boardNavDesktopFoot:hover::after {\
  opacity: 1;\
  cursor: pointer;\
}\
/* Watcher */\
#watcher::before {\
  height: 9px;\
  font-size: 12px;\
  position: fixed;\
  right: 42px;\
  min-width: 30px;\
  max-width: 30px;\
  opacity: 0.4;\
}\
#watcher:hover::before {\
  opacity: 1;\
  cursor: pointer;\
}\
/* END OF ICON POSITIONS */\
.boardBanner {\
  position: fixed;\
  left: auto;\
  right: 2px;\
  top: 19px;\
  padding-top: 0px;\
  margin: 0;\
  margin-top: -6px;\
  z-index: 1;\
}\
.boardBanner img {\
  width: 248px;\
  height: 83px;\
  ' + agent + 'box-reflect: below 0px ' + agent + 'gradient( linear, left top, left bottom, from(transparent), color-stop(91%, rgba(255, 255, 255, .1)), color-stop(21.01%, transparent) );\
}\
.boardTitle {\
  margin-top: 20px;\
}\
#watcher::before {\
  top: 105px;\
}\
#watcher {\
  position: fixed;\
  top: 119px;\
}\
#boardNavDesktopFoot::after {\
  top: 104px;\
}\
#boardNavDesktopFoot:hover {\
  top: 119px;\
}\
#navtopr .settingsWindowLink::after {\
  top: 104px;\
}\
#settingsBox {\
  top: 110px;\
}\
body > a[style="cursor: pointer; float: right;"]::after {\
  top: 104px;\
}\
.globalMessage::before {\
  top: 104px;\
}\
.globalMessage:hover {\
  top: 119px;\
}\
.boardTitle {\
  margin-top: 20px;\
}\
#settingsBox {\
  position: fixed;\
  right: 5px;\
  width: 234px;\
}\
#boardNavMobile {\
  background: none;\
  border: none;\
  font-size: 12px;\
  padding: 0px;\
  padding-top: 1px;\
  padding-left: 2px;\
  width: 320px;\
  pointer-events: none;\
}\
.pageJump {\
  position: fixed;\
  top: -1000px;\
  pointer-events: all;\
}\
.extButton img {\
  margin-top: -4px;\
}\
#boardNavMobile select {\
  font-size: 11px;\
  pointer-events: all;\
}\
.qrMessage {\
  position: fixed;\
  right: 3px;\
  bottom: 250px;\
  font-size: 11px;\
  font-weight: 100;\
  background: none;\
  border: none;\
  width: 248px;\
}\
.boardBanner {\
  position: fixed;\
  right: 2px;\
  top: 19px;\
  width: 248px;\
  margin: 0;\
  text-align: center;\
 }\
.boardBanner img {\
  width: 248px;\
  height: 83px;\
}\
.boardTitle {\
  font-size: 30px;\
  font-weight: 400;\
}\
.boardSubtitle {\
  font-size: 13px;\
}\
/* 4watch */\
body > span > div {\
  position: fixed;\
  top: auto;\
  bottom: 440px;\
  right: 0;\
  width: 248px;\
}\
hr {\
  padding: 0;\
  height: 0;\
  width: 100%;\
  clear: both;\
  border: none;\
}\
/* Front Page */\
.bd,\
.bd ul,\
img,\
.pages,\
.pages *,\
#qr,\
div[id^="qr"],\
table.reply[style^="clear: both"],\
.boxcontent > hr,\
h3 {\
  border: none;\
}\
.boxcontent input {\
  height: 18px;\
  vertical-align: bottom;\
  margin-right: 1px;\
}\
a.yuimenuitemlabel {\
  padding: 0 20px;\
}\
/* Navigation */\
#boardNavDesktop, /* Top Navigation */\
.pages /* Bottom Navigation */ {\
  text-align: center;\
  font-size: 0;\
  color: transparent;\
  width: auto;\
}\
#boardNavDesktop{\
  width: auto;\
  padding-right: 0px;\
  margin-right: 0px;\
  padding-top: 1px;\
  padding-bottom: 3px;\
}\
#boardNavDesktopFoot {\
  visibility: visible;\
  position: fixed;\
  top: -1000px;\
  right: 2px;\
  bottom: auto;\
  width: 226px;\
  color: transparent;\
  font-size: 0;\
  padding: 3px 10px 35px 10px;\
  border-width: 1px;\
  text-align: center;\
  word-spacing: -3px;\
}\
.fileThumb {\
  position: relative;\
}\
.pages td:nth-of-type(1) {\
  font-size: 75%;\
  text-transform: uppercase;\
}\
.pages td {\
  color: transparent;\
}\
#boardNavDesktop a,\
.pages a,\
.pages strong,\
.pages input {\
  ' + agent + 'appearance: none;\
  display: inline-block;\
  font-size: 12px;\
  border: none;\
  text-align: center;\
  margin: 0 1px 0 2px;\
}\
.pages {\
  word-spacing: 10px;\
}\
/* moot"s announcements */\
.globalMessage {\
  font-size: 12px;\
  text-align: center;\
  font-weight: 200;\
}\
.pages input {\
  margin-bottom: 2px;\
}\
.pages strong,\
.pages input,\
a,\
.new {\
  ' + agent + 'transition: background-color .1s linear;\
}\
/* Post Form */\
/* Override OS-specific UI */\
#ft li,\
#ft ul,\
#options input:not([type="radio"]),\
#updater input:not([type="radio"]),\
.box-outer,\
.boxbar,\
.deleteform input[value=Delete],\
.recaptcha_image_cell > center > #recaptcha_image,\
[name="recaptcha_response_field"],\
.top-box,\
h2,\
input:not([type="radio"]),\
input[type="submit"],\
textarea {\
  ' + agent + 'appearance: none;\
}\
/* Unfuxor the Captcha layout */\
#recaptcha_widget_div tr, #recaptcha_widget_div td, #recaptcha_widget_div center, #recaptcha_widget_div #recaptcha_table, #recaptcha_widget_div #recaptcha_area, #recaptcha_widget_div #recaptcha_image {\
  margin: 0;\
  padding: 0;\
  height: auto;\
}\
#recaptcha_table #recaptcha_image {\
  border: none;\
}\
/* Formatting for all postarea elements */\
.recaptchatable #recaptcha_response_field,\
.deleteform input[type="password"],\
input,\
input.field,\
input[type="submit"],\
textarea {\
  border-width: 1px !important;\
  border-style: solid !important;\
  padding: 1px !important;\
  height: 20px !important;\
}\
#qr .move .field,\
#qr input[type="submit"],\
input[type="file"],\
#qr textarea,\
#qr .field {\
  margin: 1px 0 0;\
  vertical-align: bottom;\
}\
/* Width and height of all postarea elements (excluding some captcha elements) */\
#recaptcha_response_field,\
textarea.field,\
#recaptcha_widget_div input,\
#qr .move .field,\
#qr .field[type="password"],\
.ys_playerContainer audio,\
#qr input[title="Verification"],\
#recaptcha_image,\
#qr div,\
input[type="file"] {\
  width: 248px;\
}\
/* Buttons */\
input[type="submit"], /* Any lingering buttons */\
input[value="Report"] {\
  cursor: default;\
  height: 20px;\
  padding: 0;\
  font-size: 12px;\
}\
#qr input[type="submit"] {\
  width: 100%;\
  float: left;\
  clear: both;\
}\
#qr input[type="file"] {\
  height: auto;\
  border: none 0px;\
  padding: 0;\
  float: left;\
}\
#qr input[name="email"] + label {\
  bottom: 2px;\
  right: 4px;\
}\
#qr input[name="sub"] + input + label {\
  font-size: 12px;\
  top: auto;\
  right: 70px;\
  margin-top: 1px;\
}\
/* Image Hover and Image Expansion */\
#ihover {\
  max-width:85%;\
  max-height:85%;\
}\
#qp {\
  min-width: 500px;\
}\
.fileText ~ a > img + img {\
  position: relative;\
  top: 0px;\
}\
#imageType {\
  border: none;\
  width: 90px;\
  position: relative;\
  bottom: 1px;\
  background: none;\
}\
/* #qr dimensions */\
#qr {\
  height: auto;\
}\
#recaptcha_reload_btn {\
  position: absolute;\
  height: 0;\
  width: 0;\
  padding: 12px 0 0 12px;\
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAAZ0lEQVR4XgXAsQ0BUQCA4c8kSrOo70KntAgxgkl05CV2sMOVEo2ofgEAYAIAdp6SRQBwkSQJgL3kbJYEwPC1BgArIFcAwAvIFgAcBQwAQAawQZK7g0UmAJKPt+QEAPlJHmYA4AYA8AeJKy3vtXoiawAAAABJRU5ErkJggg==") no-repeat;\
  overflow: hidden;\
}\
.top-box .menubutton,\
.boardTitle {\
  background-image: none;\
}\
#delform > div:not(.thread) input,\
.deleteform input[type="checkbox"],\
.rice {\
  vertical-align: middle;\
}\
#qr label input,\
.boxcontent input,\
.boxcontent textarea {\
  ' + agent + 'appearance: none;\
  border: 0;\
}\
input[type=checkbox],\
.reply input[type=checkbox],\
#options input[type=checkbox] {\
  ' + agent + 'appearance: none;\
  width: 12px;\
  height: 12px;\
  cursor: pointer;\
}\
.postingMode ~ #delform .opContainer input {\
  position: relative;\
  bottom: 2px;\
}\
/* Posts */\
body > .postingMode ~ #delform br[clear="left"],\
#delform center {\
  position: fixed;\
  bottom: -500px;\
}\
.deleteform {\
  border-spacing: 0 1px;\
}\
#delform .fileText + br + a[target="_blank"] img,\
#qp div.post .fileText + br + a[target="_blank"] img  {\
  border: 0;\
  float: left;\
  margin: 5px 20px 15px;\
}\
#delform .fileText + br + a[target="_blank"] img + img {\
  margin: 0 0 25px;\
}\
.fileText {\
  margin-top: 17px;\
}\
.fileText span:not([class])::after {\
  font-size: 13px;\
}\
#updater:hover {\
  border: 0;\
}\
/* Fixes text spoilers */\
.spoiler:not(:hover),\
.spoiler:not(:hover) .quote,\
.spoiler:not(:hover) a {\
  color: rgb(0,0,0);\
  text-shadow: none;\
}\
/* Remove default "inherit" background declaration */\
.span.subject,\
.subject,\
.name,\
.postertrip {\
  background: transparent;\
}\
.name {\
  font-weight: 700;\
}\
/* Addons and such */\
body > div[style="width: 100%;"] {\
  margin-top: 34px;\
}\
#copyright,\
#boardNavDesktop a,\
#qr td,\
#qr tr[height="73"]:nth-of-type(2),\
.recaptcha_input_area,\
.menubutton a,\
.pages td,\
.recaptchatable td.recaptcha_image_cell,\
td[style="padding-left: 7px;"],\
div[id^="qr"] tr[height="73"]:nth-of-type(2) {\
  padding: 0;\
}\
#navtopr {\
  position: fixed;\
  right: 60px;\
  top: -100px;\
  bottom: auto;\
  font-size: 0;\
  color: transparent;\
}\
/* Expand Images div */\
#imgControls input {\
  width: 10px;\
  height: 10px;\
  margin: 4px 1px;\
  vertical-align: top;\
}\
#imgControls label {\
  font-size: 0;\
  color: transparent;\
}\
#imgControls label:first-of-type {\
  position: fixed;\
  right: 232px;\
  top: 0px;\
  bottom: auto;\
}\
#imageType {\
  position: fixed;\
  right: 140px;\
  top: 1px;\
  bottom: auto;\
}\
#imgControls label:nth-of-type(2)::after {\
  font-size: 12px;\
  content: "Preload?";\
}\
#imgControls select { float: right; }\
/* Hide UI of the select element */\
select > button,\
select > input {\
  opacity: 0;\
}\
#imgControls select > option { font-size: 80%; }\
/* End of Expand Images div */\
/* Reply Previews */\
#qp div.post /* 4chan x Quote Preview */ {\
  max-width: 70%;\
  visibility: visible;\
}\
#qp div.op { display: table; }\
#qp div.post { padding: 2px 6px; }\
#qp div.post img {\
  max-width: 300px;\
  height: auto;\
}\
.deleteform {\
  position: fixed;\
  top: -1000px;\
}\
.deleteform  {\
  position: fixed;\
  top: -1000px;\
  right: 2px;\
  bottom: auto;\
  width: 248px;\
  margin: 0px;\
  padding: 0px;\
  font-size: 0px;\
}\
.deleteform:hover {\
  position: fixed;\
  right: 3px;\
}\
.deleteform {\
  height: 18px;\
  width: 250px;\
}\
.deleteform input[value="Delete"], .deleteform input[value="Report"] { float: left; }\
.deleteform,\
.deleteform { width: 246px; }\
.deleteform:hover input[name="pwd"] {\
  position: fixed;\
  left: 105px;\
  right: 3px;\
  width: 146px;\
  height: 20px;\
  text-align: right;\
}\
div.deleteform input[type="password"] { width: 144px; }\
.deleteform:hover input[type="checkbox"],\
.deleteform:hover .rice {\
  position: fixed;\
  right: 130px;\
}\
.deleteform:hover::after {\
  visibility: visible;\
  position: fixed;\
  right: 80px;\
  font-size: 12px;\
  content: "File Only";\
  width: 50px;\
}\
.deleteform .field {\
  width: 138px;\
  margin-right: 1px;\
}\
div.navLinks {\
  font-size: 0;\
  visibility: hidden;\
}\
div.navLinks a {\
  position: fixed;\
  top: auto;\
  right: -192px;\
  bottom: -1000px;\
  visibility: visible;\
  height: 14px;\
  width: 58px;\
  margin: 0;\
  padding: 0;\
  font-size: 9px;\
  text-transform: uppercase;\
  vertical-align: bottom;\
  padding-top: 5px;\
  border-radius: 0;\
  text-align: center;\
}\
/* File Clearer support */\
.clearbutton {\
  position: fixed;\
  bottom: 45px;\
  right: 55px;\
}\
/* AutoPager */\
#autoPagerBorderPaging {\
  position: fixed !important;\
  right: 300px !important;\
  bottom: 0px;\
}\
/* 4chan x options */\
#options ul { margin: 0; }\
#options ul > li { padding: 0; }\
#options.reply.dialog, #options .dialog { width: 700px; }\
#options ul {\
  margin-bottom: 5px;\
  padding-bottom: 7px;\
}\
#options ul:first-of-type { padding-top: 5px; }\
#content textarea { width: 99%; }\
/* End of 4chan x options */\
#stats,\
#navlinks {\
  top: 0 !important;\
  left: auto !important;\
  bottom: auto !important;\
  width: 96px;\
  text-align: right;\
  padding: 0;\
  border: 0;\
  border-radius: 0;\
}\
#stats {\
  right: 45px !important;\
  font-size: 12px;\
  position: fixed;\
  cursor: default;\
}\
#navlinks {\
  right: 2px !important;\
}\
#updater {\
  right: 2px !important;\
  top: 0 !important;\
  bottom: auto !important;\
  width: 58px !important;\
  border: 0;\
  font-size: 12px;\
  overflow: hidden;\
  padding-bottom: 2px;\
}\
#updater { background: none; }\
#count.new { background-color: transparent; }\
#updater:hover {\
  width: 150px;\
  right: 2px !important;\
}\
#updater #count:not(.new) {\
  font-size: 0;\
  color: transparent;\
}\
#updater #count:not(.new)::after {\
  font-size: 12px;\
  content: "+0";\
}\
.opContainer .favicon {\
  position: relative;\
  top: 2px;\
}\
#watcher { padding-left: 0px; }\
#watcher {\
  padding: 1px 0;\
  border-radius: 0;\
}\
#updater .move,\
#options .move,\
#stats .move { cursor: default !important; }\
/* 4sight */\
body > a[style="cursor: pointer; float: right;"] {\
  position: fixed;\
  top:-119px;\
  right: 60px;\
  font-size: 0px;\
}\
body > a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"] {\
  display: block;\
  position: fixed;\
  top: 17px;\
  bottom: 17px;\
  left: 4px;\
  right: 252px;\
  width: auto;\
  margin: 0;\
}\
body > a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"] > table {\
  height: 100%;\
  vertical-align: top;\
}\
body > a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"]{\
  height: 95%;\
  margin-top: 5px;\
  margin-bottom: 5px;\
}\
#fs_status {\
  width: auto;\
  height: 100%;\
  background: none;\
  padding: 10px;\
  overflow: scroll;\
}\
[alt="sticky"] + a::before { content: "Sticky | "; }\
[alt="closed"] + a::before { content: "Closed | "; }\
[alt="closed"] + a { text-decoration: line-through; }\
/* Youtube Link Title */\
.chanlinkify.YTLT-link.YTLT-text {\
  font-family: monospace;\
  font-size: 11px;\
}\
.fileText+br+a[target="_blank"]:hover { background: none; }\
.inline, #qp {\
  background-color: transparent;\
  border: none;\
}\
/* Adblock Minus */\
img[src^="//static.4chan.org/support/"] { display: none; }\
input[type="submit"]:hover { cursor: pointer; }\
/* 4chan Sounds */\
.ys_playerContainer.reply {\
  position: fixed;\
  bottom: 252px;\
  margin: 0;\
  right: 3px;\
  padding-right: 0;\
  padding-left: 0;\
  padding-top: 0;\
}\
#qr input:focus:' + agent + 'placeholder,\
#qr textarea:focus:' + agent + 'placeholder {\
  color: transparent;\
}\
img[md5] { image-rendering: optimizeSpeed; }\
input,\
textarea { text-rendering: geometricPrecision; }\
#boardNavDesktop .current {\
  font-weight: bold;\
  font-size: 13px;\
}\
#postPassword {\
  position: relative;\
  bottom: 3px;\
}\
#recaptcha_table, #recaptcha_table tbody, #recaptcha tbody tr {\
  display: block;\
  visibility: visible;\
}\
.postContainer.inline {\
  border: none;\
  background: none;\
  padding-bottom: 2px;\
}\
div.pagelist {\
  background: none;\
  border: none;\
}\
a.forwardlink { border: none; }\
.deleteform { border-bottom: 2px solid transparent; }\
.exif td { color: #999; }\
.callToAction.callToAction-big {\
  font-size: 18px;\
  color: rgb(255,255,255);\
}\
body > table[cellpadding="30"] h1, body > table[cellpadding="30"] h3 { position: static; }\
.focused.entry { background-color: transparent; }\
#menu.reply.dialog, html .subMenu { padding: 0px; }\
#charCount {\
  background: none;\
  position: absolute;\
  right: 2px;\
  top: 112px;\
  color: rgb(0,0,0);\
  font-size: 10px;\
}\
#charCount.warning {\
  color: rgb(255,0,0);\
  position: absolute;\
  right: 2px;\
  top: 110px;\
}\
textarea {\
  resize: none;\
}\
/* .move contains the name field of the #qr. Here we"re making it behave like no more than a container. We also hide the "Quick Reply" text with a hack. */\
#qr .move {\
  color: transparent;\
  font-size: 0;\
  height: 20px;\
  cursor: default;\
}\
/* Position and Dimensions of the #qr */\
#qr {\
  overflow: visible;\
  position: fixed;\
  top: auto !important;\
  bottom: 20px !important;\
  width: 248px;\
  margin: 0;\
  padding: 0;\
  z-index: 5;\
  background-color: transparent !important;\
}\
/* Width and height of all #qr elements (excluding some captcha elements) */\
#qr textarea {\
  min-height: 0 !important;\
}\
body > .postingMode ~ #delform .reply a > img[src^="//images"] {\
  position: relative;\
  z-index: 96;\
}\
#qr img {\
  height: 47px;\
  width: 248px;\
}\
#dump {\
  background: none;\
  border: none;\
  width: 20px;\
  height: 17px;\
  margin: 0;\
  font-size: 14px;\
  vertical-align: middle;\
  outline: none;\
}\
#dump:hover { background: none; }\
#qr .move { height: 0px; }\
#qr select {\
  position: absolute;\
  bottom: -18px;\
  right: 65px;\
  background: none;\
  border: none;\
  font-size: 12px;\
  width: 128px;\
}\
#qr > form > label {\
  font-size: 0px;\
  color: transparent;\
}\
#qr > form > label::after {\
  content: "Spoiler?";\
  font-size: 12px;\
}\
.dump > form > label {\
  display: block;\
  visibility: hidden;\
}\
#qr [type="file"] input[type="text"] {\
  width: 104px;\
  position: relative;\
  right: 1px;\
}\
#spoilerLabel {\
  position: absolute;\
  bottom: -20px;\
  right: 20px;\
}\
#spoilerLabel input {\
  position: relative;\
  top: 1px;\
  left: 2px;\
}\
#qr .warning {\
  position: absolute;\
  bottom: -18px;\
  right: 1px;\
  height: 20px;\
  text-align: right;\
  vertical-align: middle;\
  padding-top: 2px;\
  max-height: 16px;\
}\
.deleteform:hover {\
  top: auto;\
  bottom: 0px;\
}\
.deleteform:hover input[type="checkbox"],\
.deleteform:hover .rice,\
.deleteform:hover::after {\
  top: auto;\
  bottom: 2px;\
}\
.deleteform:hover input[name="pwd"] {\
  top: auto;\
  bottom: 0px;\
}\
input[title="Verification"],\
.captchaimg img {\
  margin-top: 1px;\
}\
#qr.autohide .move {\
  display: inline-block;\
  font-size: 12px;\
  visibility: visible;\
  height: 20px;\
  bottom: 20px;\
  text-align: center;\
  overflow: visible;\
  padding-top: 3px;\
  ' + agent + 'transition: opacity .3s ease-in-out .3s;\
  min-width: 0;\
  width: 248px;\
}\
#qr.autohide:not(:hover) .move {\
  position: fixed;\
  bottom: 0px;\
}\
#qr.autohide {\
  padding-bottom: 0px;\
  bottom: -250px!important;\
  ' + agent + 'transition: bottom .3s ease-in-out .3s, top .3s ease-in-out .3s;\
}\
#qr.autohide:hover {\
  padding-bottom: 16px;\
  ' + agent + 'transition: bottom .3s linear, top .3s linear;\
  bottom: 1px;\
}\
#qr.autohide:hover .move { padding-bottom: 5px; }\
#qr.autohide:hover .move input { display: inline-block; }\
#qr.autohide:hover select { display: inline-block; }\
#qr.autohide:hover .move { padding-top: 1px; }\
#qr textarea.field,\
#qr div { min-width: 0; }\
html body span[style="left: 5px; position: absolute;"] a {\
  height: 14px;\
  padding-top: 3px;\
  width: 56px;\
}\
#qr textarea.field {\
  height: 88px !important;\
}\
.textarea {\
  height: 89px !important;\
}\
hr {\
  position: relative;\
  top: 2px;\
}\
#updater input,\
#options input,\
#qr,\
table.reply[style^="clear: both"] {\
  border: none;\
}\
#delform > div:not(.thread) select,\
.pages input[type="submit"] {\
  margin: 0;\
  height: 17px;\
}\
#qr.autohide .move {\
  border-bottom: none;\
}\
.prettyprint {\
  white-space: pre-wrap;\
  border-radius: 2px;\
  font-size: 11px;\
}\
body {\
  background-color: ' + theme["Background Color"] + ';\
  background-image: ' + theme["Background Image"] + ';\
  background-repeat: ' + theme["Background Repeat"] + ';\
  background-attachment: ' + theme["Background Attachment"] + ';\
  background-position: ' + theme["Background Position"] + ';\
}\
.boardTitle {\
  text-shadow: 1px 1px 1px ' + theme["Reply Border"] + ';\
}\
#ft li,\
#ft ul,\
#options .dialog,\
#qr::before,\
#watcher,\
#updater:hover,\
.box-outer,\
.boxbar,\
.deleteform input[value=Delete],\
.top-box,\
.yuimenuitem-selected,\
html body span[style="left: 5px; position: absolute;"] a,\
input[type="submit"],\
#options.reply.dialog,\
.deleteform input[value=Delete],\
input[value="Report"],\
#qr.autohide .move {\
  background-color: ' + theme["Buttons Background"] + ';\
  border-color: ' + theme["Buttons Border"] + ';\
}\
.recaptchatable #recaptcha_response_field,\
.deleteform input[type="password"],\
#dump,\
input,\
input.field,\
textarea,\
textarea.field {\
  background-color: ' + theme["Input Background"] + ';\
  border: 1px solid ' + theme["Input Border"] + ';\
  color: ' + theme["Inputs"] + ';\
  ' + agent + 'transition: all .2s linear;\
}\
div.navLinks a:first-of-type:hover,\
.deleteform input:hover,\
.recaptchatable #recaptcha_response_field:hover,\
input:hover,\
input.field:hover,\
input[type="submit"]:hover,\
textarea:hover,\
textarea.field:hover {\
  background-color: ' + theme["Hovered Input Background"] + ';\
  border-color: ' + theme["Hovered Input Border"] + ';\
  color: ' + theme["Inputs"] + ';\
}\
.recaptchatable #recaptcha_response_field:focus,\
.deleteform input[type="password"]:focus,\
input:focus,\
input.field:focus,\
input[type="submit"]:focus,\
textarea:focus,\
textarea.field:focus {\
  background-color: ' + theme["Focused Input Background"] + ';\
  border-color: ' + theme["Focused Input Border"] + ';\
  color: ' + theme["Inputs"] + ';\
}\
#qp div.post,\
div.reply {\
  background-color: ' + theme["Reply Background"] + ';\
  border: 1px solid ' + theme["Reply Border"] + ';\
}\
.reply.highlight {\
  background-color: ' + theme["Highlighted Reply Background"] + ';\
  border: 1px solid ' + theme["Highlighted Reply Border"] + ';\
}\
#boardNavDesktop,\
.pages {\
  background-color: ' + theme["Navigation Background"] + ';\
  border-color: ' + theme["Navigation Border"] + ';\
}\
#delform {\
  background-color: ' + theme["Thread Wrapper Background"] + ';\
  border: 1px solid ' + theme["Thread Wrapper Border"] + ';\
}\
#boardNavDesktopFoot,\
#watcher,\
#watcher:hover,\
.deleteform,\
div.subMenu,\
#menu {\
  background-color: ' + theme["Dialog Background"] + ';\
  border: 1px solid ' + theme["Dialog Border"] + ';\
}\
.inline div.reply {\
  /* Inline Quotes */\
  background-color: ' + (theme["Dark Theme"] === "1" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)") + ';\
  border: 1px solid ' + theme["Reply Border"] + ';\
  box-shadow: 5px 5px 5px ' + theme["Shadow Color"] + ';\
}\
 [id^="q"] .warning {\
  background: ' + theme["Input Background"] + ';\
  border: 1px solid ' + theme["Input Border"] + ';\
  color: ' + theme["Warnings"] + ';\
}\
a,\
#dump,\
.entry,\
div.post > blockquote a[href^="//"],\
.sideArrows a,\
div.postContainer span.postNum > .replylink {\
  color: ' + theme["Links"] + ';\
}\
.postNum a {\
  color: ' + theme["Post Numbers"] + ';\
}\
.subject {\
  color: ' + theme["Subjects"] + ';\
  font-weight: 600;\
}\
#updater:not(:hover),\
#updater:not(:hover) #count:not(.new)::after,\
.summary,\
body > form,\
body,\
html body span[style="left: 5px; position: absolute;"] a,\
input,\
.deleteform::after,\
textarea,\
.abbr,\
.boxbar,\
.boxcontent,\
.pages strong,\
.reply,\
.reply.highlight,\
#boardNavDesktop .title,\
#imgControls label::after,\
#boardNavDesktop::after,\
#updater #count:not(.new)::after,\
#qr > form > label::after,\
#qr.autohide .move,\
span.pln {\
  color: ' + theme["Text"] + ';\
}\
#options ul {\
  border-bottom: 1px solid ' + theme["Reply Border"] + ';\
}\
.quote {\
  color: ' + theme["Greentext"] + ';\
}\
span.quote > a.quotelink,\
a.quotelink,\
a.backlink {\
  color: ' + theme["Backlinks"] + ';\
  font-weight: 800;\
}\
div.subMenu,\
#menu,\
#qp div.post {\
  box-shadow: 5px 5px 5px ' + theme["Shadow Color"] + ';\
}\
.rice {\
  cursor: pointer;\
  width: 10px;\
  height: 10px;\
  margin: 3px;\
  display: inline-block;\
  background-color: ' + theme["Checkbox Background"] + ';\
  border: 1px solid ' + theme["Checkbox Border"] + ';\
}\
#options input,\
#options textarea,\
#qr label input,\
#updater input,\
.bd {\
  background-color: ' + theme["Buttons Background"] + ';\
  border: 1px solid ' + theme["Buttons Border"] + ';\
}\
.pages a,\
#boardNavDesktop a {\
  color: ' + theme["Navigation Links"] + ';\
}\
input[type=checkbox]:checked + .rice {\
  background-color: ' + theme["Checkbox Checked Background"] + ';\
}\
a:hover,\
#dump:hover,\
.entry:hover,\
div.post > blockquote a[href^="//"]:hover,\
.sideArrows a:hover,\
div.post div.postInfo span.postNum a:hover,\
div.postContainer span.postNum > .replylink:hover,\
.nameBlock > .useremail > .name:hover,\
.nameBlock > .useremail > .postertrip:hover {\
  color: ' + theme["Hovered Links"] + ';\
}\
.boardBanner a:hover,\
#boardNavDesktop a:hover {\
  color: ' + theme["Hovered Navigation Links"] + ';\
}\
.boardBanner {\
  color: ' + theme["Board Title"] + ';\
}\
.name {\
  color: ' + theme["Names"] + ';\
}\
.postertrip,\
.trip {\
  color: ' + theme["Tripcodes"] + ';\
}\
.nameBlock > .useremail > .postertrip,\
.nameBlock > .useremail > .name {\
  color: ' + theme["Emails"] + ';\
}\
.nameBlock > .useremail > .name,\
.name {\
  font-weight: 600;\
}\
a.forwardlink {\
  border-bottom: 1px dashed;\
}\
.qphl {\
  outline-color: ' + theme["Backlinked Reply Outline"] + ';\
}\
#qr::before {\
  color: ' + (theme["Dark Theme"] === "1" ? "rgb(255,255,255)" : "rgb(0,0,0)") + ';\
}\
#qr input:' + agent + 'placeholder,\
#qr textarea:' + agent + 'placeholder {\
  color: ' + (theme["Dark Theme"] === "1" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)") + ';\
}\
.boxcontent dd,\
#options ul {\
  border-color: ' + (theme["Dark Theme"] === "1" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)") + ';\
}\
input[type=checkbox] {\
  ' + agent + 'appearance: checkbox !important;\
}\
' + theme['Custom CSS'];
      if (theme['Dark Theme'] === '1') {
        css += '\
.prettyprint {\
  background-color: rgba(255,255,255,.1);\
  border: 1px solid rgba(0,0,0,0.5);\
}\
span.tag { color: #96562c; }\
span.pun { color: #5b6f2a; }\
span.com { color: #a34443; }\
span.str, span.atv { color: #8ba446; }\
span.kwd { color: #987d3e; }\
span.typ, span.atn { color: #897399; }\
span.lit { color: #558773; }\
/* 4chan X options */\
#navtopr .settingsWindowLink::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUGNOFkVENwCAMRE8CUiYBCZOAM6Rg4CWTMAlIuH0AG9mS0f7Q67W9FmkyMoWstxGIEgljTJKIhCd59IQp9+voBHaMOUmdnqgYs41qcxLYKZhCJFCxbrZJvUfz2LCm1liappoiYUxu8AiHVw2cPIXf6sXsl/L6Vb7c++9qi5v//dgFtjLxtKnNCFwAAAAASUVORK5CYII=");\
}\
/* Delete buttons */\
.deleteform::before {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAeRJREFUOE9tlM0rRFEYh0dMPiKxkWxsyEpWshCpURbWNPkvlCwYe6VJWU+zkmytZIOttZJsaHZioQkhH8+j++p0M/U0Z8597+/83o8zhUajUcjRwu8OGIAJmIFZmIJh6IHW/Ht5kXYCxmAVzuABvuAbXuAS9mAOesFDfzVSoW42FuEYXrOXFcjzyd41rMFQiIWQThS5AAP/E8jv3RO3Bf3hSHumo5MQeWZ9CjfJ3mO2d8d3pMuysQxFHVlYaxLpKLIP07ACV/AE2zAJ63CbuVbwBAYVsjsWNqzrRJE26ART3jAYdG/8bnJwk3VJIVtsd0LIdHSiiM+LYIdcKzQOR5DWsuJD5yRyVswA09GJItEQRUbgIHETh9cMctjyHbEmphNOjGuF+eyQfGfrBjixDluI2R0La00iHUVcm+4SOJipWNWHjr0P0mLbHVOJdHQSNetjvQNv2TvvfJcV8u7sJSc4J7bY7lhYa2LNdKLIApwn8T4bjdy9O469riy8c2KL7Y7zZRq61okiujDWmduEruiIRfXuOPaRYgjEb8VMJ2rzwfoQ7GRL2lovoHfHTzoO/907nShiLX9HJL39FtYL6N1x7JuJuxAzJWtiOjr5m7P8/1FMsq0vQQVqUIcqlGEUukxHJ8EPyeEKDPe5ibUAAAAASUVORK5CYII=");\
}\
/* Return button */\
div.navLinks a:first-of-type::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRFAAAA5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHk5OHkJaAqNQAAAA50Uk5TABAgQFBgcICPn6+/3+9ACPafAAAASElEQVQI15XMyxKAIAxD0eCr1ZT8/+eKDCOw07O700mBT45rrDXEXgul3sn0yCwsAaGBv/cw86xc92fbl0v7z7mBzeeudhJ/3aoUA1Vr0uhDAAAAAElFTkSuQmCC");\
}\
/* Watcher */\
#watcher::before {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRFAAAA0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLU0dLUmYS1qAAAAA10Uk5TABAgQFBggI+fv8/f74aeqbgAAABVSURBVAjXnY0xDsMwEMNo+5TYPen/3+2SpUCXlhvBgfAH2uecrcdWt5O4ewHIdVtTvmXB9BoRoIzy5DqsDIAszvXRlyfItS3kXRZA9StJ0l1f/z/xBlXVAtkqW+Q3AAAAAElFTkSuQmCC");\
}\
/* Announcement */\
.globalMessage::before {\
   content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAK5JREFUGNN1kF0RxCAMhCMBCZVQCUhAwkmohDhAAhKQEAPfDBKQUAm5B3qU3s3t425mfyJygUTBMIzMLivYaTiGoigNpxJu8aSxLeeRTiOICIGOXfQLH8aT5eD8GKE4cTo4UTDKND1uWYRGFpzXkrnKGROc9JDnKBQTjDyJjbr0b+RnteO3WpgbhYSN/QQabX1L/HqLzyA2DKdTUCodx/E7dHgoFaOgJMo4kP8gEt+mlap7ZbvCVgAAAABJRU5ErkJggg==");\
}\
/* Slideout nav */\
#boardNavDesktopFoot::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRFAAAAzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMdShx9gAAAA50Uk5TABAgMEBggI+fr7/P3+82uMT1AAAAb0lEQVQIHQXBiQHDIAwEMOE8gGlu/3ErgWt297wAYyenT7IGjJNVqJUzsPMAniyuLODedspMQe3cKq8+8HxZOK0b9eUb6NYHO98Dv/am3FkDKq/Ktm9gp1h5AE8mxsku1M4ZMGby618yB6De7n4L/v79BDw2df22AAAAAElFTkSuQmCC");\
}\
/* 4sight */\
body > a[style="cursor: pointer; float: right;"]::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFAAAAzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMzczMIXMlggAAAA90Uk5TABAgMEBQYICPn6+/z9/vD6iGsgAAAFRJREFUCB0FwYcBwyAMADAZCCN2y//fRgIAAG0MAMSba/8eAO9EVAe0BOMAxgISMDaIBKgGewKMesS+C0A7mXPdCgCQtwIAou6/A0DUPQCgnw4A4APNOQHMJOa9jgAAAABJRU5ErkJggg==");\
}\
/* Expand */\
#imgControls label:first-of-type::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAALlJREFUKFOFkT0KwlAQhANWaUSb+AciVmLlSZLcVhttBH9QjyIIHiDOF2ZhOxeGebM7b3dfUnRdVwmN0Aq1UAqFGU2eekWSQ8RTh6HNMDqiwczNiJsnkR8Jx1RrSTKKDlE467wR9jY+XK9jN0bSKQwfGy/iqVcrMWespd82fsW7XP/XmZUmuXPsfHLHq3grHKzveef8NXjozKPH4mjAvf5rZPNLGtPAjI7ozUtfiD+1kp4LPLZxDV78APzYoty/jZXwAAAAAElFTkSuQmCC");\
}\
';
      } else {
        css += '\
.prettyprint {\
  background-color: #e7e7e7;\
  border: 1px solid #dcdcdc;\
}\
span.com { color: #d00; }\
span.str, span.atv { color: #7fa61b; }\
span.pun { color: #61663a; }\
span.tag { color: #117743; }\
span.kwd { color: #5a6F9e; }\
span.typ, span.atn { color: #9474bd; }\
span.lit { color: #368c72; }\
/* 4chan X options */\
#navtopr .settingsWindowLink::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUGNOFkVERwCAMQyMBKZOAhEng69lCChImYRKQkH0AG7fdjfaHpmmbFmkyMoWstxGIEgljTJKIhCd59IQp9+voBHaMOUmdnqgYs41qcxLYKZhCJFCxbrZJvUfz2LCm1liappoiYUxu8AiHVw2cPIXf6sXsl/L6Vb7c++9qi5v//dgFAGGyWuspVmQAAAAASUVORK5CYII=");\
}\
/* Delete buttons */\
.deleteform::before {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH9JREFUGNONkFEZgCAMhIlABCIQgQhE8O2vQQMiEMEIi7AIRjACPqGC4ueetu/udrcZ869wBMI7ZFkREpmN+IRXlpOo+HGt3KZA6eFA6mYZ4dzlkNFbcWefW467XonGYMnU3qrFKwjCQqKi2PmD5JOARansw/0PQpkbeMpUfdUBLYs3tDb03tIAAAAASUVORK5CYII=");\
}\
/* Return button */\
div.navLinks > a:first-of-type::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGNJREFUGNNjYKAaiC2IXY9LyiH2fuz/2P3YpBRi9wOl/mORjhWIbYBKgeB7oEIIbIgVAEnfR5JEhf2Yuu8DeQ2x/UBTgCYh7J6PajdEC6rL9+ORBgsGgO3DJY2kMAHkegbaAgCK4libswvDKwAAAABJRU5ErkJggg==");\
}\
/* Watcher */\
#watcher::before {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAALhJREFUOE+tkl0RgzAQhJFQCUhBAhJ4yENnMIEDJFRKJVRCJSCh3HfsMQfTFzI87CS5n+zuJU0ppalFdSOE9zY/x3EwvAzvBM7D2d7ObMnO8BUWW38JnCPXxSXeLDYKesNsYI+CNuWIE/Oce1YBAZgfYjtIVBNKyENAfUvzhDcp4AIvOvtT3CVrFlMNMwQb8x/PTHb3lXwSD8mb55CnBBP9SGKeNvuYdn+YdvYnpmvvXPO/7/2eVxSsk6VHBDjH8sAAAAAASUVORK5CYII=");\
}\
/* Announcement */\
.globalMessage::before {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAK5JREFUGNN1kE0VxCAMhCMBCZVQCUhAwp6+cyXEARKQgIRIQAISKiF7oEvp7ts5zuTNT0QukCgYhpHZZQU7DcdQFKXhVMItnjS25TzSaQQRIdCxi37hw3iyHJwfIxQnTgcnCkaZpscti9DIgvNaMlc5Y4KTHvIchWKCkSexUZf+jfysdvxWC3OjkLCxn0CjrW+JX2/xGcSG4XQKSqXjOH6HDg+lYhSURBkH8h9E4htm9nkTaedRxgAAAABJRU5ErkJggg==");\
}\
/* Slideout nav */\
#boardNavDesktopFoot::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEVQTFRFAAAAZ2dnzczMZ2dnzczMZ2dntLOzZ2dnq6qqZ2dnZ2dnZ2dnkI+PZ2dnjIyMqKenZ2dnZ2dnZ2dndXR0e3t7Z2dndHR03/W/BgAAABV0Uk5TABAQICAwQGBggI+fn6+vr7/P3+/vEpdk4gAAAHlJREFUCB0FwYEBgjAQBLDUCghY/aLn/qOagOWoqmMBtJHMmsnZoM2cHf3MbBjZAFtOlpzA+jbSHelwf/1WPbua8PjkiVmqcP/ke0OVmnjl+4Cr7OnW3/MGPbue4b0CI50zG2DLgTYzOvrIbNCO5KorORqg71W1d/gDBFEGZ/GMsaMAAAAASUVORK5CYII=");\
}\
/* 4sight */\
body > a[style="cursor: pointer; float: right;"]::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH9JREFUGNONkFEZgCAMhIlABCIQgQhE8O2vQQMiEMEIi7AIRjACPqGC4ueetu/udrcZ869wBMI7ZFkREpmN+IRXlpOo+HGt3KZA6eFA6mYZ4dzlkNFbcWefW467XonGYMnU3qrFKwjCQqKi2PmD5JOARansw/0PQpkbeMpUfdUBLYs3tDb03tIAAAAASUVORK5CYII=");\
}\
/* Expand */\
#imgControls label:first-of-type::after {\
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAMRJREFUKFNtks0OAUEQhOdM4iBx8XMSwb6En0dw89CciQMXvIIb9XW6pXfYpDKlu6rV9G4ppfSElbB2THTGA486GrQmfjteOnfJAKcWfbQ2IQp38WkyDMWvqY/WDEyJxkl8JoyFg4sfrjEDOflrpoUAU/CLD0CT72dB8lRiIp6niD+0NkS8lvBfJCYfPf9ZJ4v4RqovjXjh8cLUujSGWOuzyjzS71vq25a2qcB690JH6DrPL26DYSDkT2PpNeqNwFSApv8BTpBEE3rYF6oAAAAASUVORK5CYII=");\
}\
';
      }
      switch (Conf['Post Form Style']) {
        case 'fixed':
          mascotposition = '264';
          css += '\
#qr {\
  right: 2px !important;\
  left: auto !important;\
}\
';
          break;
        case 'slideout':
          mascotposition = '0';
          css += '\
#qr {\
  right: -233px !important;\
  left: auto !important;\
  ' + agent + 'transition: right .3s ease-in-out 1s, left .3s ease-in-out 1s;\
}\
#qr:hover,\
#qr.focus,\
#qr.dump {\
  right: 2px !important;\
  left: auto !important;\
  ' + agent + 'transition: right .3s linear, left .3s linear;\
}\
';
          break;
        case 'tabbed slideout':
          mascotposition = '0';
          css += '\
#qr {\
  right: -249px !important;\
  left: auto !important;\
  ' + agent + 'transition: right .3s ease-in-out 1s, left .3s ease-in-out 1s;\
}\
#qr:hover,\
#qr.focus,\
#qr.dump {\
  right: 2px !important;\
  left: auto !important;\
  ' + agent + 'transition: right .3s linear, left .3s linear;\
}\
#qr::before {\
  ' + agent + 'transform: rotate(-90deg);\
  ' + agent + 'transform-origin: bottom right;\
  margin-left: -212px;\
  margin-right: 264px;\
  margin-bottom: -20px;\
  width: 210px;\
  display: inline-block;\
  font-size: 12px;\
  opacity: 0.5;\
  height: 18px;\
  text-align: center;\
  content: "Post Form";\
  padding-top: 3px;\
  vertical-align: middle;\
  ' + agent + 'transition: opacity .3s ease-in-out 1s;\
}\
#qr:hover::before,\
#qr.focus::before,\
#qr.dump::before {\
  opacity: 0;\
  ' + agent + 'transition: opacity .3s linear;\
}\
';
          break;
        case 'transparent fade':
          mascotposition = '0';
          css += '\
#qr {\
  right: 2px !important;\
  left: auto !important;\
  opacity: 0.2;\
  ' + agent + 'transition: opacity .3s ease-in-out 1s;\
}\
#qr:hover,\
#qr.focus,\
#qr.dump {\
  opacity: 1;\
  ' + agent + 'transition: opacity .3s linear;\
}\
';
      }
      if (Conf['Fit Width Replies']) {
        css += '\
.summary {\
  clear: both;\
  padding-left: 20px;\
  display: block;\
}\
.replyContainer {\
  clear: both;\
}\
.sideArrows {\
  z-index: 1;\
  position: absolute;\
  right: 0px;\
  height: 10px;\
}\
.postInfo {\
  margin: 1px 0 0;\
  position: relative;\
  width: 100%;\
}\
.sideArrows a, .sideArrows span {\
  position: static;\
  width: 20px;\
  font-size: 9px;\
  height: 10px;\
}\
.sideArrows {\
  width: 20px;\
  padding-top: 1px;\
}\
div.reply .report_button, .sideArrows, div.reply .postInfo input, div.reply .postInfo .rice, div.reply .menu_button {\
  opacity: 0;\
}\
form .replyContainer:not(:hover) div.reply .report_button, form .replyContainer:not(:hover) div.reply .menu_button, form .replyContainer:not(:hover) .sideArrows, form .replyContainer:not(:hover) .postInfo input, .postInfo .rice {\
  ' + agent + 'transition: opacity .3s ease-out 0s;\
}\
form .replyContainer:hover div.reply .report_button, form .replyContainer:hover div.reply .menu_button, form .replyContainer:hover .sideArrows, .replyContainer:hover .postInfo input, .replyContainer:hover .postInfo .rice {\
  opacity: 1;\
  ' + agent + 'transition: opacity .3s ease-in 0s;\
}\
 div.reply input:checked {\
  opacity: 1;\
}\
form .postContainer blockquote {\
  margin-left: 30px;\
}\
div.reply {\
  padding-top: 6px;\
  padding-left: 10px;\
}\
div.reply .postInfo input,\
div.reply .postInfo .rice {\
  position: absolute;\
  top: -3px;\
  right: 5px;\
}\
div.reply .report_button, div.reply .menu_button {\
  position: absolute;\
  right: 26px;\
  top: -1px;\
  font-size: 9px;\
}\
.sideArrows a {\
  position: absolute;\
  right: 36px;\
  top: 7px;\
}\
.sideArrows a {\
  font-size: 9px;\
}\
div.thread {\
  padding: 0;\
  position: relative;\
}\
div.post:not(#qp):not([hidden]) {\
  margin: 0;\
  width: 100%;\
}\
div.reply {\
  display: table;\
  clear: both;\
}\
div.sideArrows {\
  float: none;\
}\
.hide_thread_button {\
  position: relative;\
  z-index: 2;\
  margin-right: 10px;\
  margin-left: 5px;\
  font-size: 9px;\
}\
.opContainer input {\
  opacity: 1;\
}\
#options.reply {\
  display: inline-block;\
}\
';
      } else {
        css += '\
.sideArrows a {\
  font-size: 9px;\
}\
.sideArrows a {\
  position: static;\
}\
div.reply {\
  padding-right: 5px;\
}\
.sideArrows {\
  margin-right: 5px;\
  width: 20px;\
  float: left;\
}\
.sideArrows a {\
  width: 20px;\
  font-size: 12px;\
}\
.hide_thread_button {\
  position: relative;\
  z-index: 2;\
  margin-right: 5px;\
}\
div.reply {\
  padding-top: 5px;\
  padding-left: 2px;\
  display: table;\
}\
div.thread {\
  overflow: visible;\
  padding: 0;\
  position: relative;\
}\
div.post:not(#qp):not([hidden]) {\
  margin: 0;\
}\
.thread > div > .post {\
  overflow: visible;\
}\
.sideArrows span {\
  font-size: 9px;\
}\
.sideArrows {\
  width: 20px;\
}\
.sideArrows a {\
  right: 27px;\
 }\
div.reply .report_button, div.reply .menu_button {\
  right: 13px;\
 }\
div.reply {\
  padding-top: 6px;\
  padding-left: 8px;\
}\
.sideArrows {\
  margin-right: 2px;\
  width: 20px;\
}\
form .postContainer blockquote {\
  margin-left: 30px;\
}\
';
      }
      if (!Conf['Hide Sidebar']) {
        switch (Conf['Page Margin']) {
          case 'none':
            pagemargin = '2px';
            break;
          case 'small':
            pagemargin = '25px';
            break;
          case 'medium':
            pagemargin = '50px';
            break;
          case 'large':
            pagemargin = '150px';
            break;
          case 'fully centered':
            pagemargin = '252px';
        }
        css += '\
body {\
  margin: 1px 252px 0 ' + pagemargin + ';\
}\
#boardNavDesktop,\
.pages {\
  left:  ' + pagemargin + ';\
  right: 252px;\
}\
';
      } else {
        css += '\
#boardNavDesktop,\
.pages {\
  left:  2px;\
  right: 2px;\
}\
';
      }
      if (Conf['Compact Post Form Inputs']) {
        css += '\
#qr textarea.field {\
  height: 114px !important;\
}\
.textarea {\
  height: 115px !important;\
}\
.field[name="name"],\
.field[name="email"],\
.field[name="sub"] {\
  width: 75px !important;\
  margin-left: 1px !important;\
}\
';
      } else {
        css += '\
.field[name="email"],\
.field[name="sub"] {\
  width: 248px !important;\
}\
.field[name="name"] {\
  width: 227px !important;\
  margin-left: 1px !important;\
}\
.field[name="email"],\
.field[name="sub"] {\
  margin-top: 1px;\
}\
';
      }
      if (Conf['Expand Post Form Textarea']) {
        css += '\
#qr textarea {\
  display: block;\
  ' + agent + 'transition: all 0.25s ease 0s, width .3s ease-in-out .3s;\
  float: right;\
}\
#qr textarea:focus {\
  width: 400px;\
}\
';
      }
      if (Conf['Filtered Backlinks']) {
        css += '\
.filtered.backlink {\
  display: none;\
}\
';
      }
      if (Conf['Rounded Edges']) {
        css += '\
.rice {\
  border-radius: 2px;\
}\
div.reply,\
div.reply.highlight,\
#options,\
#watcher,\
#qp,\
td[style="border: 1px dashed;"],\
div.reply > tr > div.reply,\
.inline div.reply,\
h2,\
.deleteform,\
#boardNavDesktopFoot,\
.globalMessage {\
  border-radius: 3px;\
}\
.pages b,\
.pages input,\
a,\
.new {\
  border-radius: 9px;\
}\
#postForm::after {\
  border-radius: 6px 6px 0 0;\
}\
.qphl {\
  ' + agent + 'outline-radius: 3px;\
}\
';
      }
      if (Conf['Slideout Watcher']) {
        css += '\
#watcher {\
  position: fixed;\
  top: -1000px !important;\
  right: 2px !important;\
  left: auto !important;\
  bottom: auto !important;\
  width: 246px !important;\
  padding-bottom: 4px;\
}\
#watcher:hover {\
  z-index: 99 !important;\
  top: 119px !important;\
}\
';
      } else {
        css += '\
#watcher::before {\
  display: none;\
}\
#watcher {\
  right: 2px !important;\
  left: auto !important;\
  width: 246px;\
  padding-bottom: 4px;\
  z-index: 96;\
}\
';
      }
      if (Conf['Underline Links']) {
        css += '\
#credits a,\
.abbr a,\
.backlink:not(.filtered),\
.chanlinkify,\
.file a,\
.pages,\
.pages a,\
.quotejs,\
.quotelink:not(.filtered),\
.quotelink:not(.filtered),\
.useremail,\
a.deadlink,\
a[href*="//dis"],\
a[href*=res],\
div.post > blockquote .chanlinkify.YTLT-link.YTLT-text,\
div.postContainer span.postNum > .replylink {\
	text-decoration: underline;\
}\
';
      }
      switch (Conf['Slideout Navigation']) {
        case 'compact':
          css += '\
#boardNavDesktopFoot {\
  height: 84px;\
  padding-bottom: 0px;\
  padding-top: 0px;\
  word-spacing: 3px;\
}\
#navbotr {\
  display: none;\
}\
';
          break;
        case 'list':
          css += '\
#boardNavDesktopFoot a {\
  z-index: 1;\
  display: block;\
}\
#boardNavDesktopFoot {\
  height: 300px;\
  overflow-y: scroll;\
  padding-bottom: 0px;\
  padding-top: 0px;\
  word-spacing: 0px;\
}\
#boardNavDesktopFoot a::after{\
  content: " - " attr(title);\
  font-size: 12px;\
}\
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::after,\
#boardNavDesktopFoot a[href*="//rs.4chan.org/"]::after {\
  content: "/ - " attr(title);\
  font-size: 12px;\
}\
#boardNavDesktopFoot a[href*="//boards.4chan.org/"]::before,\
#boardNavDesktopFoot a[href*="//rs.4chan.org/"]::before {\
  content: "/";\
  font-size: 12px;\
}\
#navbotr {\
  display: none;\
}\
';
          break;
        case 'hide':
          css += '\
#boardNavDesktopFoot::after, #boardNavDesktopFoot {\
	display: none;\
}\
';
      }
      switch (Conf['Reply Spacing']) {
        case 'none':
          css += '\
.replyContainer {\
  margin-bottom: 0px;\
}\
#delform {\
  margin-bottom: 12px;\
}\
';
          break;
        case 'small':
          css += '\
.replyContainer {\
  margin-bottom: 2px;\
}\
#delform {\
  margin-bottom: 10px;\
}\
';
          break;
        case 'medium':
          css += '\
.replyContainer {\
  margin-bottom: 4px;\
}\
#delform {\
  margin-bottom: 8px;\
}\
';
          break;
        case 'large':
          css += '\
.replyContainer {\
  margin-bottom: 6px;\
}\
#delform {\
  margin-bottom: 6px;\
}\
';
      }
      switch (Conf['Sage Highlighting']) {
        case 'text':
          css += '\
  a.useremail[href*="sage"]:last-of-type::after,\
  a.useremail[href*="Sage"]:last-of-type::after,\
  a.useremail[href*="SAGE"]:last-of-type::after {\
    content: " (sage) ";\
    color: ' + theme["Sage"] + ';\
  }\
';
          break;
        case 'image':
          css += '\
  a.useremail[href*="sage"]:last-of-type::after,\
  a.useremail[href*="Sage"]:last-of-type::after,\
  a.useremail[href*="SAGE"]:last-of-type::after {\
    content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=") "  ";\
  }\
';
      }
      switch (Conf['Announcements']) {
        case '4chan default':
          css += '\
.globalMessage {\
  position: static;\
  background: none;\
  border: none;\
  margin-top: 0px;\
}\
.globalMessage::before {\
  display: none;\
}\
.globalMessage:hover {\
  top: 0px;\
}\
';
          break;
        case 'slideout':
          css += '\
.globalMessage:hover {\
  position: fixed;\
  z-index: 99;\
}\
.globalMessage {\
  width: 236px;\
  background-color: ' + theme["Dialog Background"] + ';\
  border: 1px solid ' + theme["Dialog Border"] + ';\
}\
';
          break;
        case 'hide':
          css += '\
.globalMessage {\
  display: none;\
}\
.globalMessage::before {\
  display: none;\
}\
';
      }
      switch (Conf['Boards Navigation']) {
        case 'sticky top':
          css += '\
#boardNavDesktop {\
  position: fixed;\
  top: 0;\
}\
';
          break;
        case 'sticky bottom':
          css += '\
#boardNavDesktop {\
  position: fixed;\
  bottom: 0;\
}\
';
          break;
        case 'top':
          css += '\
#boardNavDesktop {\
  position: absolute;\
  top: 0;\
}\
';
          break;
        case 'hide':
          css += '\
#boardNavDesktop {\
  position: absolute;\
  top: -100px;\
}\
';
      }
      switch (Conf['Pagination']) {
        case 'sticky top':
          css += '\
.pages {\
  position: fixed;\
  top: 0;\
}\
';
          break;
        case 'sticky bottom':
          css += '\
.pages {\
  position: fixed;\
  bottom: 0;\
}\
';
          break;
        case 'top':
          css += '\
.pages {\
  position: absolute;\
  top: 0;\
}\
';
          break;
        case 'on side':
          css += '\
.pages {\
  padding: 0;\
  visibility: hidden;\
  top: auto;\
  bottom: 175px;\
  width: 290px;\
  left: auto;\
  right: 251px;\
  position: fixed;\
  ' + agent + 'transform: rotate(90deg);\
  ' + agent + 'transform-origin: bottom right;\
  letter-spacing: -1px;\
  word-spacing: -6px;\
  z-index: 6;\
  margin: 0;\
  height: 15px;\
}\
.pages a, .pages strong, .pages input {\
  visibility: visible;\
  min-width: 0;\
}\
';
          break;
        case 'hide':
          css += '\
.pages {\
  display: none;\
}\
';
      }
      switch (Conf["Checkboxes"]) {
        case "show":
        case "hide checkboxes":
          css += '\
#delform input[type=checkbox] {\
  display: none;\
}\
';
          break;
        case "make checkboxes circular":
          css += '\
#delform input[type=checkbox] {\
  display: none;\
}\
.rice {\
  border-radius: 6px;\
}\
';
      }
      if (Conf["Mascots"]) {
        mascotimages = [];
        for (category in Mascots) {
          mascots = Mascots[category];
          for (name in mascots) {
            mascot = mascots[name];
            if (enabledmascots[name] === true) {
              mascotimages.push(mascot);
            }
          }
        }
        css += '\
body::after {\
  position: fixed;\
  bottom: ' + mascotposition + 'px;\
  right: 0;\
  left: auto;\
  ' + agent + 'transform: scaleX(1);\
  content: ' + mascotimages[Math.floor(Math.random() * mascotimages.length)] + '\
}\
';
      }
      switch (Conf['Emoji Position']) {
        case 'left':
          css += Style.emoji('before', 'left');
          break;
        case 'right':
          css += Style.emoji('after', 'right');
      }
      return css;
    }
  };

  Main = {
    init: function() {
      var category, key, mascot, mascots, name, now, path, pathname, temp, val;
      Main.flatten(null, Config);
      for (key in Conf) {
        val = Conf[key];
        Conf[key] = $.get(key, val);
      }
      for (category in Mascots) {
        mascots = Mascots[category];
        if (category === 'SFW') {
          for (name in mascots) {
            mascot = mascots[name];
            enabledmascots[name] = $.get(name, true);
          }
        } else {
          for (name in mascots) {
            mascot = mascots[name];
            enabledmascots[name] = $.get(name, false);
          }
        }
      }
      path = location.pathname;
      pathname = path.slice(1).split('/');
      g.BOARD = pathname[0], temp = pathname[1];
      if (temp === 'res') {
        g.REPLY = true;
        g.THREAD_ID = pathname[2];
      }
      switch (location.hostname) {
        case 'sys.4chan.org':
          if (/report/.test(location.search)) {
            $.ready(function() {
              return $.on($.id('recaptcha_response_field'), 'keydown', function(e) {
                if (e.keyCode === 8 && !e.target.value) {
                  return window.location = 'javascript:Recaptcha.reload()';
                }
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
      if ((Conf['Quick Reply'] && Conf['Hide Original Post Form']) || Conf['Style']) {
        Main.css += '#postForm { display: none; }';
      }
      if (Conf['Recursive Filtering']) {
        Main.css += '.hidden + .threadContainer { display: none; }';
      }
      if (Conf['Style']) {
        Main.addStyle();
        Main.remStyle();
        Style.init();
      } else {
        Main.addStyle();
      }
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
      if (Conf['Filter']) {
        Filter.init();
      }
      if (Conf['Reply Hiding']) {
        ReplyHiding.init();
      }
      if (Conf['Filter'] || Conf['Reply Hiding']) {
        StrikethroughQuotes.init();
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
      if (!$.id('navtopr')) {
        return;
      }
      $.addClass(d.body, $.engine);
      $.addClass(d.body, 'fourchan_x');
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
        if (Conf['Quote Threading']) {
          QuoteThreading.init();
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
      Main.prettify = Main._prettify;
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
    addStyle: function() {
      $.off(d, 'DOMNodeInserted', Main.addStyle);
      if (d.head) {
        return $.addStyle(Main.css, 'main');
      } else {
        return $.on(d, 'DOMNodeInserted', Main.addStyle);
      }
    },
    remStyle: function() {
      var headNode, headNodes, index, node, step, _i, _len, _results;
      $.off(d, 'DOMNodeInserted', Main.remStyle);
      if (d.head && d.head.childNodes.length > 10) {
        headNodes = d.head.childNodes;
        headNode = headNodes.length - 1;
        _results = [];
        for (index = _i = 0, _len = headNodes.length; _i < _len; index = ++_i) {
          node = headNodes[index];
          step = headNode - index;
          if (headNodes[step].rel === 'stylesheet' || headNodes[step].rel === 'alternate stylesheet') {
            _results.push($.rm(headNodes[step]));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        return $.on(d, 'DOMNodeInserted', Main.remStyle);
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
    prettify: function() {},
    _prettify: function(bq) {
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
    version: '0.3beta',
    callbacks: [],
    css: '\
/* dialog styling */\
.dialog.reply {\
  display: block;\
  border: 1px solid rgba(0,0,0,.25);\
  padding: 0;\
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
.warning,\
.disabledwarning {\
  color: red;\
}\
.hide_thread_button:not(.hidden_thread) {\
  float: left;\
}\
.thread > .hidden_thread ~ *,\
[hidden],\
#content > [name=tab]:not(:checked) + div,\
#updater:not(:hover) > :not(.move),\
.autohide:not(:hover) > form,\
#qp input, .forwarded, #qp .rice {\
  display: none !important;\
}\
.menu_button {\
  display: inline-block;\
}\
.menu_button > span {\
  border-top:   .5em solid;\
  border-right: .3em solid transparent;\
  border-left:  .3em solid transparent;\
  display: inline-block;\
  margin: 2px;\
  vertical-align: middle;\
}\
#menu {\
  position: absolute;\
  outline: none;\
}\
.entry {\
  border-bottom: 1px solid rgba(0, 0, 0, .25);\
  cursor: pointer;\
  display: block;\
  outline: none;\
  padding: 3px 7px;\
  position: relative;\
  text-decoration: none;\
  white-space: nowrap;\
}\
.entry:last-child {\
  border: none;\
}\
.focused.entry {\
  background: rgba(255, 255, 255, .33);\
}\
.entry.hasSubMenu {\
  padding-right: 1.5em;\
}\
.hasSubMenu::after {\
  content: "";\
  border-left:   .5em solid;\
  border-top:    .3em solid transparent;\
  border-bottom: .3em solid transparent;\
  display: inline-block;\
  margin: .3em;\
  position: absolute;\
  right: 3px;\
}\
.hasSubMenu:not(.focused) > .subMenu {\
  display: none;\
}\
.subMenu {\
  position: absolute;\
  left: 100%;\
  top: 0;\
  margin-top: -1px;\
}\
h1 {\
  text-align: center;\
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
#autohide, .close, #qr select, #dump, .remove, .captchaimg, #qr div.warning {\
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
  counter-reset: thumbnails;\
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
.thumbnail {\
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
  -webkit-transition: opacity .25s ease-in-out;\
  -moz-transition: opacity .25s ease-in-out;\
  -o-transition: opacity .25s ease-in-out;\
  transition: opacity .25s ease-in-out;\
  vertical-align: top;\
}\
.thumbnail:hover, .thumbnail:focus {\
  opacity: .9;\
}\
.thumbnail#selected {\
  opacity: 1;\
}\
.thumbnail::before {\
  counter-increment: thumbnails;\
  content: counter(thumbnails);\
  color: #FFF;\
  font-weight: 700;\
  padding: 3px;\
  position: absolute;\
  top: 0;\
  right: 0;\
  text-shadow: 0 0 3px #000, 0 0 8px #000;\
}\
.thumbnail.drag {\
  box-shadow: 0 0 10px rgba(0,0,0,.5);\
}\
.thumbnail.over {\
  border-color: #FFF;\
}\
.thumbnail > span {\
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
.thumbnail > label {\
  background: rgba(0,0,0,.5);\
  color: #FFF;\
  right: 0; bottom: 0; left: 0;\
  position: absolute;\
  text-align: center;\
}\
.thumbnail > label > input {\
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
  box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  color: #333;\
  font: 13px sans-serif;\
  margin: 0;\
  padding: 2px 4px 3px;\
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
#qr > form > div:first-child > .field:not(#dump) {\
  width: 30%;\
}\
#qr textarea.field {\
  display: -webkit-box;\
  min-height: 120px;\
  min-width: 100%;\
}\
#charCount {\
  color: #000;\
  background: hsla(0, 0%, 100%, .5);\
  position: absolute;\
  top: 100%;\
  right: 0;\
}\
#charCount.warning {\
  color: red;\
}\
.captchainput > .field {\
  min-width: 100%;\
}\
.captchaimg {\
  text-align: center;\
}\
.captchaimg > img {\
  display: block;\
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
.fileText:hover .fntrunc,\
.fileText:not(:hover) .fnfull {\
  display: none;\
}\
.fitwidth img[data-md5] + img {\
  max-width: 100%;\
}\
.gecko  .fitwidth img[data-md5] + img,\
.presto .fitwidth img[data-md5] + img {\
  width: 100%;\
}\
#qr, #qp, #updater, #stats, #ihover, #overlay, #navlinks {\
  position: fixed;\
}\
#ihover {\
  max-height: 97%;\
  max-width: 75%;\
  padding-bottom: 18px;\
}\
#navlinks {\
  font-size: 16px;\
  top: 25px;\
  right: 5px;\
}\
#overlay {\
  top: 0;\
  right: 0;\
  width: 100%;\
  height: 100%;\
  background: rgba(0,0,0,.5);\
  z-index: 1;\
}\
#options {\
  z-index: 2;\
  position: absolute;\
  display: inline-block;\
  padding: 5px;\
  text-align: left;\
  vertical-align: middle;\
  width: 600px;\
  max-width: 100%;\
  height: 500px;\
  max-height: 100%;\
}\
#options #style_tab + div select {\
  width: 100%;\
}\
#theme_tab + div > div:not(.selectedtheme) h1 {\
  color: transparent !important;\
  right: 300px;\
}\
#theme_tab + div > div.selectedtheme h1 {\
  right: 11px;\
}\
#theme_tab + div > div h1 {\
  position: absolute;\
  bottom: 0;\
  -moz-transition: all .2s ease-in-out;\
  -webkit-transition: all .2s ease-in-out;\
  -o-transition: all .2s ease-in-out;\
}\
#theme_tab + div > div {\
  margin-bottom: 3px;\
}\
#credits {\
  float: right;\
}\
#options ul {\
  padding: 0;\
}\
#options article li {\
  margin: 10px 0 10px 2em;\
}\
#options code {\
  background: hsla(0, 0%, 100%, .5);\
  color: #000;\
  padding: 0 1px;\
}\
#options label {\
  text-decoration: underline;\
}\
#options .mascots {\
  text-align: center;\
}\
#options .mascot {\
  display: inline;\
}\
#options .mascot div {\
  border: 2px solid rgba(0,0,0,0);\
  width: 200px;\
  height: 250px;\
  display: inline-block;\
  margin: 7px;\
  cursor: pointer;\
  background-position: top center;\
  background-repeat: no-repeat;\
  background-size: 200px auto;\
}\
#options .mascot div.enabled {\
  border: 2px solid rgba(0,0,0,0.5);\
  background-color: rgba(255,255,255,0.1);\
}\
#content {\
  overflow: auto;\
  position: absolute;\
  top: 2.5em;\
  right: 5px;\
  bottom: 5px;\
  left: 5px;\
}\
#content textarea {\
  font-family: monospace;\
  min-height: 350px;\
  resize: vertical;\
  width: 100%;\
}\
#updater {\
  text-align: right;\
}\
#updater:not(:hover) {\
  border: none;\
  background: transparent;\
}\
#updater input[type=number] {\
  width: 4em;\
}\
.new {\
  background: lime;\
}\
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
#qp {\
  padding: 2px 2px 5px;\
}\
#qp .post {\
  border: none;\
  margin: 0;\
  padding: 0;\
}\
#qp img {\
  max-height: 300px;\
  max-width: 500px;\
}\
.qphl {\
  outline: 2px solid rgba(216, 94, 49, .7);\
}\
.image_expanded {\
  clear: both !important;\
}\
.inlined {\
  opacity: .5;\
}\
.inline {\
  background-color: rgba(255, 255, 255, 0.15);\
  border: 1px solid rgba(128, 128, 128, 0.5);\
  display: table;\
  margin: 2px;\
  padding: 2px;\
}\
.inline .post {\
  background: none;\
  border: none;\
  margin: 0;\
  padding: 0;\
}\
div.opContainer {\
  display: block !important;\
}\
.opContainer.filter_highlight {\
  box-shadow: inset 5px 0 rgba(255,0,0,0.5);\
}\
.filter_highlight > .reply {\
  box-shadow: -5px 0 rgba(255,0,0,0.5);\
}\
.filtered,\
.quotelink.filtered {\
  text-decoration: underline;\
  text-decoration: line-through !important;\
}\
.quotelink.forwardlink,\
.backlink.forwardlink {\
  text-decoration: none;\
  border-bottom: 1px dashed;\
}\
.threadContainer {\
  margin-left: 20px;\
  border-left: 1px solid black;\
}\
.stub ~ * {\
  display: none !important;\
}\
'
  };

  Main.init();

}).call(this);
