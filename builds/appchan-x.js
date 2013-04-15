// ==UserScript==
// @name         appchan x
// @version      2.0.0
// @namespace    zixaphir
// @description  The most comprehensive 4chan userscript.
// @copyright    2012-2013 Zixaphir <zixaphirmoxphar@gmail.com>
// @license      MIT; http://en.wikipedia.org/wiki/Mit_license
// @match        *://api.4chan.org/*
// @match        *://boards.4chan.org/*
// @match        *://images.4chan.org/*
// @match        *://sys.4chan.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @run-at       document-start
// @updateURL    http://zixaphir.github.com/appchan-x/builds/appchan-x.meta.js
// @downloadURL  http://zixaphir.github.com/appchan-x/builds/appchan-x.user.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEX///8EZgR8ulSk0oT///8EAgQ1A88mAAAAAXRSTlMAQObYZgAAAIpJREFUeF6t0sENwjAMhWF84N4H6gAYMUBkdQMYwfuvwmstEeD4kl892P0OaaWcpga2/K0SGII1HNBXARgu7veoY3ANd+esgMHZIz85u0EABrbms3pl/bkC1Tn5ihGOfQwqHeZ/FdYdirEMgCG2ZAQWDTL0m9FvjAhcvoGNAK2gZhGYYX9+ZgFm9gaiNmNkMENY4QAAAABJRU5ErkJggg==
// ==/UserScript==

/* appchan x - Version 2.0.0 - 2013-04-14
 * http://zixaphir.github.com/appchan-x/
 *
 * Copyright (c) 2009-2011 James Campos <james.r.campos@gmail.com>
 * Copyright (c) 2012-2013 Nicolas Stepien <stepien.nicolas@gmail.com>
 * Licensed under the MIT license.
 * https://github.com/zixaphir/appchan-x/blob/master/LICENSE
 *
 * Contributors:
 * https://github.com/zixaphir/appchan-x/graphs/contributors
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
  var $, $$, Anonymize, ArchiveLink, Banner, Board, Build, CatalogLinks, Clone, Conf, Config, CustomCSS, DataBoard, DataBoards, DeleteLink, DownloadLink, Emoji, ExpandComment, ExpandThread, FappeTyme, Favicon, FileInfo, Filter, Fourchan, Get, GlobalMessage, Header, Icons, ImageExpand, ImageHover, ImageReplace, JSColor, Keybinds, Linkify, Main, MascotTools, Mascots, Menu, Nav, Notification, Polyfill, Post, PostHiding, QR, QuoteBacklink, QuoteCT, QuoteInline, QuoteOP, QuotePreview, QuoteStrikeThrough, QuoteYou, Quotify, Recursive, Redirect, RelativeDates, Report, ReportLink, RevealSpoilers, Rice, Sauce, Settings, Style, ThemeTools, Themes, Thread, ThreadExcerpt, ThreadHiding, ThreadStats, ThreadUpdater, ThreadWatcher, Time, UI, Unread, c, d, doc, editMascot, editTheme, g, userNavigation,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Config = {
    main: {
      'Miscellaneous': {
        'Catalog Links': [true, 'Turn Navigation links into links to each board\'s catalog.'],
        'External Catalog': [false, 'Link to external catalog instead of the internal one.'],
        'Enable 4chan\'s Extension': [false, 'Compatibility between appchan x and 4chan\'s inline extension is NOT guaranteed.'],
        'Fixed Header': [false, 'Mayhem X\'s Fixed Header (kinda).'],
        'Custom Board Navigation': [false, 'Show custom links instead of the full board list.'],
        '404 Redirect': [true, 'Redirect dead threads and images.'],
        'Keybinds': [true, 'Bind actions to keyboard shortcuts.'],
        'Time Formatting': [true, 'Localize and format timestamps.'],
        'Relative Post Dates': [false, 'Display dates like "3 minutes ago". Tooltip shows the timestamp.'],
        'File Info Formatting': [true, 'Reformat the file information.'],
        'Comment Expansion': [true, 'Add buttons to expand long comments.'],
        'Thread Expansion': [true, 'Add buttons to expand threads.'],
        'Index Navigation': [false, 'Add buttons to navigate between threads.'],
        'Reply Navigation': [false, 'Add buttons to navigate to top / bottom of thread.'],
        'Check for Updates': [true, 'Check for updated versions of appchan x.']
      },
      'Linkification': {
        'Linkify': [true, 'Convert text into links where applicable.'],
        'Embedding': [true, 'Embed supported services.'],
        'Link Title': [true, 'Replace the link of a supported site with its actual title. Currently Supported: YouTube, Vimeo, SoundCloud']
      },
      'Filtering': {
        'Anonymize': [false, 'Make everyone Anonymous.'],
        'Filter': [true, 'Self-moderation placebo.'],
        'Recursive Hiding': [true, 'Hide replies of hidden posts, recursively.'],
        'Thread Hiding': [true, 'Add buttons to hide entire threads.'],
        'Reply Hiding': [true, 'Add buttons to hide single replies.'],
        'Hiding Buttons': [true, 'Add buttons to hide threads / replies, in addition to menu links.'],
        'Stubs': [true, 'Show stubs of hidden threads / replies.']
      },
      'Images': {
        'Image Expansion': [true, 'Expand images.'],
        'Image Hover': [false, 'Show full image on mouseover.'],
        'Sauce': [true, 'Add sauce links to images.'],
        'Reveal Spoilers': [false, 'Reveal spoiler thumbnails.'],
        'Replace GIF': [false, 'Replace thumbnail of gifs with its actual image.'],
        'Replace PNG': [false, 'Replace pngs.'],
        'Replace JPG': [false, 'Replace jpgs.'],
        'Fappe Tyme': [false, 'Hide posts without images when toggled.']
      },
      'Menu': {
        'Menu': [true, 'Add a drop-down menu to posts.'],
        'Thread Hiding Link': [true, 'Add a link to hide entire threads.'],
        'Reply Hiding Link': [true, 'Add a link to hide single replies.'],
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
        'Persistent QR': [true, 'The Quick reply won\'t disappear after posting.'],
        'Auto Hide QR': [false, 'Automatically hide the quick reply when posting.'],
        'Open Post in New Tab': [true, 'Open new threads or replies to a thread from the index in a new tab.'],
        'Remember Subject': [false, 'Remember the subject field, instead of resetting after posting.'],
        'Remember Spoiler': [false, 'Remember the spoiler state, instead of resetting after posting.'],
        'Remember QR Size': [false, 'Remember the size of the quick reply\'s comment field.'],
        'Hide Original Post Form': [true, 'Hide the normal post form.'],
        'Cooldown': [true, 'Prevent "flood detected" errors.']
      },
      'Quote Links': {
        'Quote Backlinks': [true, 'Add quote backlinks.'],
        'OP Backlinks': [true, 'Add backlinks to the OP.'],
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
    style: {
      Interface: {
        'Single Column Mode': [true, 'Presents options in a single column, rather than in blocks.'],
        'Sidebar': ['normal', 'Alter the sidebar size. Completely hiding it can cause content to overlap, but with the correct option combinations can create a minimal 4chan layout that has more efficient screen real-estate than vanilla 4chan.', ['large', 'normal', 'minimal', 'hide']],
        'Sidebar Location': ['right', 'The side of the page the sidebar content is on. It is highly recommended that you do not hide the sidebar if you change this option.', ['left', 'right']],
        'Top Thread Padding': ['0', 'Add some spacing between the top edge of document and the threads.', 'text'],
        'Bottom Thread Padding': ['0', 'Add some spacing between the bottom edge of document and the threads.', 'text'],
        'Left Thread Padding': ['0', 'Add some spacing between the left edge of document and the threads.', 'text'],
        'Right Thread Padding': ['0', 'Add some spacing between the right edge of document and the threads.', 'text'],
        'Announcements': ['slideout', 'The style of announcements and the ability to hide them.', ['4chan default', 'slideout', 'hide']],
        'Board Title': ['at sidebar top', 'The positioning of the board\'s logo and subtitle.', ['at sidebar top', 'at sidebar bottom', 'at top', 'under post form', 'hide']],
        'Custom Board Titles': [false, 'Customize Board Titles by shift-clicking the board title or subtitle.'],
        'Persistent Custom Board Titles': [false, 'Forces custom board titles to be persistent, even if moot updates the board titles.'],
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
        'Hide Delete UI': [false, 'Hides vanilla report and delete functionality and UI. This does not affect Appchan\'s Menu functionality.'],
        'Post Spacing': ['2', 'The amount of space between replies.', 'text'],
        'Vertical Post Padding': ['5', 'The vertical padding around post content of replies.', 'text'],
        'Horizontal Post Padding': ['20', 'The horizontal padding around post content of replies.', 'text'],
        'Hide Horizontal Rules': [false, 'Hides lines between threads.'],
        'Images Overlap Post Form': [true, 'Images expand over the post form and sidebar content, usually used with "Expand images" set to "full".']
      },
      Aesthetics: {
        '4chan SS Navigation': [false, 'Try to emulate the appearance of 4chan SS\'s Navigation.'],
        '4chan SS Sidebar': [false, 'Try to emulate the appearance of 4chan SS\'s Sidebar.'],
        'Block Ads': [false, 'Block advertisements. It\'s probably better to use AdBlock for this.'],
        'Shrink Ads': [false, 'Make 4chan advertisements smaller.'],
        'Bolds': [true, 'Bold text for names and such.'],
        'Italics': [false, 'Give tripcodes italics.'],
        'Sidebar Glow': [false, 'Adds a glow to the sidebar\'s text.'],
        'Circle Checkboxes': [false, 'Make checkboxes circular.'],
        'Emoji': ['enabled', 'Enable emoji', ['enabled', 'disable ponies', 'only ponies', 'disable']],
        'Emoji Position': ['before', 'Position of emoji icons, like sega and neko.', ['before', 'after']],
        'Emoji Spacing': ['5', 'Add some spacing between emoji and text.', 'text'],
        'Font': ['sans-serif', 'The font used by all elements of 4chan.', 'text'],
        'Font Size': ['12', 'The font size of posts and various UI. This changes most, but not all, font sizes.', 'text'],
        'Icons': ['oneechan', 'Icon theme which Appchan will use.', ['oneechan', '4chan SS']],
        'Invisible Icons': [false, 'Makes icons invisible unless hovered. Invisible really is "invisible", so don\'t use it if you don\'t have your icons memorized or don\'t use keybinds.'],
        'Quote Shadows': [true, 'Add shadows to the quote previews and inline quotes.'],
        'Rounded Edges': [false, 'Round the edges of various 4chan elements.'],
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
        'Navigation Alignment': ['center', 'Change the text alignment of the navigation.', ['left', 'center', 'right']],
        'Slideout Navigation': ['compact', 'How the slideout navigation will be displayed.', ['compact', 'list', 'hide']],
        'Pagination': ['sticky bottom', 'The position of 4chan page navigation', ['sticky top', 'sticky bottom', 'top', 'bottom', 'on side', 'hide']],
        'Pagination Alignment': ['center', 'Change the text alignment of the pagination.', ['left', 'center', 'right']],
        'Hide Navigation Decorations': [false, 'Hide non-link text in the board navigation and pagination. This also disables the delimiters in <code>Custom Navigation</code>']
      },
      'Post Form': {
        'Compact Post Form Inputs': [true, 'Use compact inputs on the post form.'],
        'Hide Show Post Form': [false, 'Hides the "Show Post Form" button when Persistent QR is disabled.'],
        'Show Post Form Header': [false, 'Force the Post Form to have a header.'],
        'Post Form Style': ['tabbed slideout', 'How the post form will sit on the page.', ['fixed', 'slideout', 'tabbed slideout', 'transparent fade', 'float']],
        'Post Form Slideout Transitions': [true, 'Animate slideouts for the post form.'],
        'Post Form Decorations': [false, 'Add a border and background to the post form (does not apply to the "float" post form style.'],
        'Textarea Resize': ['vertical', 'Options to resize the post form\'s comment box.', ['both', 'horizontal', 'vertical', 'none']],
        'Tripcode Hider': [true, 'Intelligent name field hiding.']
      }
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
    sauces: "https://www.google.com/searchbyimage?image_url=%TURL\nhttp://iqdb.org/?url=%TURL\n#//tineye.com/search?url=%TURL\n#http://saucenao.com/search.php?url=%TURL\n#http://3d.iqdb.org/?url=%TURL\n#http://regex.info/exif.cgi?imgurl=%URL\n# uploaders:\n#http://imgur.com/upload?url=%URL;text:Upload to imgur\n#http://ompldr.org/upload?url1=%URL;text:Upload to ompldr\n# \"View Same\" in archives:\n#//archive.foolz.us/_/search/image/%MD5/;text:View same on foolz\n#//archive.foolz.us/%board/search/image/%MD5/;text:View same on foolz /%board/\n#//archive.installgentoo.net/%board/image/%MD5;text:View same on installgentoo /%board/",
    'Boards Navigation': 'sticky top',
    'Custom CSS': false,
    'Bottom header': false,
    'Header auto-hide': false,
    'Header catalog links': false,
    boardnav: '[ toggle-all ] [current-title]',
    time: '%m/%d/%y(%a)%H:%M:%S',
    backlink: '>>%id',
    fileInfo: '%l (%p%s, %r)',
    favicon: 'ferongr',
    usercss: "/* Tripcode Italics: */\n/*\nspan.postertrip {\nfont-style: italic;\n}\n*/\n\n/* Add a rounded border to thumbnails (but not expanded images): */\n/*\n.fileThumb > img:first-child {\nborder: solid 2px rgba(0,0,100,0.5);\nborder-radius: 10px;\n}\n*/\n\n/* Make highlighted posts look inset on the page: */\n/*\ndiv.post:target,\ndiv.post.highlight {\nbox-shadow: inset 2px 2px 2px rgba(0,0,0,0.2);\n}\n*/",
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
      'fappeTyme': ['f', 'Fappe Tyme.'],
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
        'Auto Update': [true, 'Automatically fetch new posts.'],
        'Optional Increase': [false, 'Increase the intervals between updates on threads without new posts.']
      },
      'Interval': 30
    },
    embedWidth: 640,
    embedHeight: 390,
    theme: 'Yotsuba B',
    'theme_sfw': 'Yotsuba B',
    'theme_nsfw': 'Yotsuba',
    mascot: ''
  };

  if (!/^[a-z]+\.4chan\.org$/.test(location.hostname)) {
    return;
  }

  editTheme = {};

  editMascot = {};

  userNavigation = {};

  Conf = {};

  c = console;

  d = document;

  doc = d.documentElement;

  g = {
    VERSION: '2.0.0',
    NAMESPACE: 'appchan x.'.replace(' ', '_'),
    TYPE: 'sfw',
    boards: {},
    threads: {},
    posts: {}
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
      'Custom CSS': ".board {\n  box-shadow: 0px 10px 10px 2px rgba(128,128,128,0.5);\n  border-radius: 3px;\n}\n.thread {\n  padding:10px;\n}\n#appchanx-settings.reply.dialog,\n#appchanx-settings .dialog {\n  background-color:#FFF;\n  color:#000;\n  border:2px solid #CCC;\n}\n#appchanx-settings ul {\n  border-bottom:1px solid #DBD8D2;\n}\n#appchanx-settings ul:last-of-type{\n  border:none;\n}\n#qp div.post{\n  background-color:rgba(255,255,255,0.9);\n  border:1px solid #D1A2FF;\n  color:#000;\n}"
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
      'Custom CSS': ".reply.post {\n  box-shadow: inset 0px 1px 2px 1px #111;\n}\n#qr {\n  box-shadow: none;\n}\n#qr textarea,\n#qr input[name=\"name\"],\n#qr input[name=\"email\"],\n#qr input[name=\"sub\"],\n#qr input[title=\"Verification\"] {\n  box-shadow: inset 0px 1px 2px 0px #111;\n}\n#qp .post {\n  background-color: rgba(29,29,33,1);\n  border: 1px solid rgba(95,137,172,0.4);\n}"
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
      'Custom CSS': ".nameBlock > .useremail > postertrip {\n  color: rgb(137,115,153);\n}\na.backlink:hover {\n  color: rgb(198,23,230);\n}\n.reply:target,\n.reply.highlight:target {\n  background:rgb(37,38,42);\n}\n[alt=\"sticky\"] + a {\n  color: rgb(242,141,0);\n}\n[alt=\"closed\"] + a {\n  color: rgb(178,171,130);\n}\ninput:checked .rice {\n  border-color:rgb(21,21,21);\n}\ninput[type=\"submit\"],\ninput[type=\"button\"],\nbutton {\n  background: linear-gradient(#393939, #292929);\n  border: 1px solid #191919;\n  color: #AAA;\n  text-shadow: 0 1px 1px #191919;\n}\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\nbackground-color: #393939;\n  border: 1px solid #191919;\n}\ninput[type=\"checkbox\"]:checked,\ninput[type=\"radio\"]:checked {\n  background: linear-gradient(#595959, #393939);\n  border: 1px solid #151515;\n}\n.thread {\n  padding: 7px;\n}\n.subject:hover,\ndiv.post:hover .subject {\n  color: #3F8DBF !important;\n}\n.postertrip:hover,\ndiv.post:hover .postertrip {\n  color:#CC7212 !important;\n}\n.name:hover,\ndiv.post:hover .name {\n  color: #0AAEE7 !important;\n}\n.name,\n.subject,\n.postertrip {\n  -webkit-transition:color .3s ease-in-out;\n  -moz-transition:color .3s ease-in-out;\n  -o-transition:color .3s ease-in-out;\n}"
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
      'Custom CSS': "#appchanx-settings {\n  background-color: rgba(16,16,16,1) !important;\n}\n#delform blockquote {\n  border-radius:3px;\n  color:#bbb;\n  background:#343838;\n  padding:8px;\n  box-shadow:0px 0px 20px rgba(25,25,25,0.6);\n  border:1px solid #343838;\n  border-bottom:2px solid #444848;\n  border-radius:0px 6px 6px 6px;\n  padding-top:15px;\n}\n.name {\n  font-weight:800;\n}\n.nameBlock > .useremail > .name:hover,\n.nameBlock> .useremail> .postertrip:hover {\n  color:#00dffc;\n}\na.forwardlink {\n  color:#608cae;\n  font-weight:800;\n}\ndiv.reply,\n.reply.highlight {\n  padding:0;\n}\n#qp div.post {\n  border:1px solid rgba(128,172,206,0.5) !important;\n  background-color: rgba(24,24,24,0.9) !important;\n}\n.name,\n.postertrip {\n  text-shadow:0px 0px 6px rgba(20,20,20,0.9);\n  font-weight:bold;\n  background:#343838;\n  border:1px solid #343838;\n  border-radius:5px 5px 0px 0px;\n  padding:4px 6px;\n  padding-top:2px;\n}\n.board,\n.board blockquote {\n  margin:0 10px 15px 0 !important;\n  padding:0px;\n}\na {\n  -moz-transition:all 0.5s ease;\n  -webkit-transition:all 0.5s ease;\n  -o-transition:all 0.5s ease;\n}\na.pointer{\n  font-weight:bold;\n  font-weight:normal;\n  color:#777;\n  padding-right:5px;\n}\n.thread .opContainer,\n.thread .replyContainer {\n  opacity:0.45;\n  transition:all 0.5s ease;\n}\n.thread .opContainer:hover,\n.thread .replyContainer:hover {\n  opacity:1;\n}\n.reply.post,\n.reply.highlight {\n  background:transparent;\n  border:0px;\n  padding:0px;\n  padding-bottom:0px;\n  border-radius:6px;\n}\n#delform blockquote {\n  padding:5px;\n  background:#343838;\n  margin-top:0px;\n  min-height:20px;\n  padding-top:10px;\n  clear:none;\n}\n  #delform .file + blockquote{\n  margin-top:-16px !important;\n  padding-left:150px !important;\n}\n.file {\n  margin-top: 2px;\n}\na.backlink{\nborder:1px solid #343838;\nborder-radius:5px 5px 0px 0px;\nbackground:#343838;\npadding:2px 4px 2px;\n  text-decoration:none;\n}\na.forwardlink{\n  color:#608CAE;\n  text-shadow:0 0 6px rgba(96,140,174,0.8);\n}\n.subject{\n  font-weight: bold;\n  letter-spacing: 3px;\n  background: transparent;\n}\n.reply.post {\n  background-color: rgba(0,0,0,0) !important;\n  border: none !important;\n}\n#qp div.post .name,\n#qp div.post a.backlink,\n#qp div.post blockquote {\n  background:none !important;\n  border:none !important;\n  box-shadow:none !important;\n  border-radius:0px !important;\n}"
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
      'Custom CSS': ".thread .reply {\n  background-color: transparent;\n  border-color: #ccc transparent transparent transparent;\n  border-style: solid;\n  border-radius: 0 !important;\n  margin-bottom: 0;\n}\n#themes {\n  text-shadow: none;\n}\n#qp {\n  text-shadow: 1px 0 0 rgb(0,0,0),\n    1px 1px 0 rgb(0,0,0),\n    0 1px 0 rgb(0,0,0),\n    1px 1px 2px rgb(0,0,0);\n}\n#qp .op.post,\n#qp .reply.post {\n  border: 1px rgba(0,0,0,0.7) solid;\n  background: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), transparent;\n}\n#qp div.post,\n#qp .pln,\n#qp .postNum a {\n  color: #fcd;\n}\n#qp .dateTime {\n  color: #fcd !important;\n}\n#qp .subject,\n#qp .nameBlock > .useremail > .name,\n#qp .nameBlock > .useremail > .postertrip,\n#qp .name,\n#qp .postertrip,\n#qp .trip {\n  color: #ffaac0 !important;\n}\n#qp a {\n  color: #aaaac8;\n}\n.boardBanner a,\n#qp a.backlink,\n#qp span.quote > a.quotelink {\n  color: rgb(255,255,255);\n}\n#qp span.quote {\n  color: rgb(130,163,100);\n}\n.board {\n  box-shadow: 0 20px 40px 10px rgba(0,0,0,0.1);\n  border-radius: 4px;\n}\n:not(#themes) .rice {\n  box-shadow:rgba(170, 170, 170,0.3) 0 1px;\n}\n#qp .prettyprint {\n  background-color: rgba(0,0,0,0.3);\n  border: 1px solid rgba(0,0,0,0.5);\n}\n#qp span.tag {\n  color: #96562c;\n}\n#qp span.pun {\n  color: #5b6f2a;\n}\n#qp span.com {\n  color: #a34443;\n}\n#qp span.str,\n#qp span.atv {\n  color: #8ba446;\n}\n#qp span.kwd {\n  color: #987d3e;\n}\n#qp span.typ,\n#qp span.atn {\n  color: #897399;\n}\n#qp span.lit {\n  color: #558773;\n}"
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
      'Custom CSS': "#qp div.post {\n  background-color:rgba(7,54,66,0.9);\n  border:1px solid rgba(79,95,143,0.9);\n}"
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
      'Custom CSS': "#qp div.post {\n  background-color:rgba(240,192,176,1);\n  box-shadow:5px 5px 5px rgba(128,128,128,0.5);\n}\n.reply.post {\n  border-color: transparent rgba(240,224,214,1) rgba(240,224,214,1) transparent;\n}"
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
      'Custom CSS': "#qp div.post {\n  background-color:rgba(214,186,208,1);\n  box-shadow:5px 5px 5px rgba(128,128,128,0.5);\n}\n.reply.post {\n  border-color: transparent rgba(183,197,217,1) rgba(183,197,217,1) transparent;\n}"
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
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\nnput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n.boardTitle {\n  color: #cc5ec1 !important;\n  text-shadow: 1px 1px 1px #772E28 !important;\n}\n.boardSubtitle,\n.boardBanner .boardSubtitle > a {\n  text-shadow: none !important;\n}"
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
      "Input Background": "rgba(255,255,255,1.0)",
      "Input Border": "rgb(202,183,217)",
      "Hovered Input Background": "rgba(239,239,239,1.0)",
      "Hovered Input Border": "rgb(202,183,217)",
      "Focused Input Background": "rgba(239,239,239,1.0)",
      "Focused Input Border": "rgb(202,183,217)",
      "Buttons Background": "rgba(255,255,255,1.0)",
      "Buttons Border": "rgb(202,183,217)",
      "Navigation Background": "rgba(229, 219, 240,.9)",
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
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,253,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n.boardTitle {\n  color: #591177 !important;\n  text-shadow: 1px 1px 1px #222 !important;\n}\n.boardSubtitle,\n.boardBanner .boardSubtitle > a {\n  text-shadow: none !important;\n}\n.postNum a {\n  color: #000000 !important;\n}\n.reply.post {\n  border-color: transparent rgb(202,183,217) rgb(202,183,217) transparent;\n}"
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
      "Custom CSS": ".thread {\n  padding: 1px;\n}\n.rice {\n  box-shadow:rgba(45,49,52,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
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
      "Custom CSS": ".thread {\n  padding: 1px;\n}\n.rice {\n  box-shadow:rgba(72,74,78,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
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
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n.boardTitle {\n  color: #b58900 !important;\n  text-shadow: 1px 1px 1px #999 !important;\n}\n.boardSubtitle,\n.boardBanner .boardSubtitle > a {\n  text-shadow: none !important;\n}\n.postNum a {\n  color: #657b83 !important;\n}"
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
      "Custom CSS": ".thread {\n  padding: 1px;\n}\n.rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n.boardTitle{\ncolor:#bc312a!important;\n  text-shadow:1px 1px 1px #772e28 !important;\n}\n.boardSubtitle,\n.boardBanner .boardSubtitle > a {\n  text-shadow:none!important;\n}\n.postNum a {\n  color:#111111!important;\n}\ndiv.reply a.quotelink{\n  color:#bc312a!important;\n}"
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
      "Custom CSS": ".rice {\n  box-shadow:rgba(71,72,66,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
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
      "Reply Border": "rgba(35,36,37,.9)",
      "Highlighted Reply Background": "rgba(31,32,33,.9)",
      "Highlighted Reply Border": "rgb(172,155,176)",
      "Backlinked Reply Outline": "rgb(172,155,176)",
      "Checkbox Background": "rgba(24,25,26,.9)",
      "Checkbox Border": "rgb(18,19,20)",
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
      "Custom CSS": ".thread {\n  padding: 1px;\n}\n.rice {\n  box-shadow:rgba(67,68,69,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
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
      "Custom CSS": ".rice {\n  box-shadow:rgba(44,48,65,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n.postInfo {\n  box-shadow: 0px 2px 3px #0A0A0A;\n}\n#qp .postInfo,\n.inline .postInfo {\n  box-shadow: none;\n}"
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
      "Custom CSS": ".rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\n.reply.post,\n.op.post {\n  background-color: transparent !important;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\na {\n  -moz-transition: text-shadow .2s;\n  -o-transition: text-shadow .2s;\n  -webkit-transition: text-shadow .2s;\n}\na:hover {\n  text-shadow: 0 0 3px rgba(232,118,0,.7);\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:\n    background .2s,\n    box-shadow .2s;\n}\n.subject:not(:empty)::after {\n  content: \" by\";\n  font-weight: normal;\n}"
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
      "Custom CSS": "html {\n}\n.thread {\n  padding: 3px 4px;\n}\n.rice {\n  box-shadow:rgba(83,83,83,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n#delform {\n  background: rgba(22,22,22,.8) !important;\n  border: 0 !important;\n  padding: 1px !important;\n  box-shadow: rgba(0,0,0,.8) 0 0 10px;\n}\ndiv.reply.post {\n  background-image:    -moz-repeating-linear-gradient(45deg, #303030, #292929, #303030, #303030 3px) !important;\n  background-image:      -o-repeating-linear-gradient(45deg, #303030, #292929, #303030, #303030 3px) !important;\n  background-image: -webkit-repeating-linear-gradient(45deg, #303030, #292929, #303030, #303030 3px) !important;\n  border-bottom:#1f1f1f!important;\n}\n.thread:not(.stub) {\n  background: 0 !important\n}\na:not([href='javascript:;']){\n  text-shadow: #0f0f0f 0 1px;\n}"
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
      "Custom CSS": ".thread {\n  padding: 1px;\n}\n.rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow: inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow: inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition: background .2s,box-shadow .2s;\n}"
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
      "Reply Border": "rgba(27,27,27,.9)",
      "Highlighted Reply Background": "rgba(31,31,31,.9)",
      "Highlighted Reply Border": "rgb(42,127,160)",
      "Backlinked Reply Outline": "rgb(42,127,160)",
      "Checkbox Background": "rgba(24,25,26,.9)",
      "Checkbox Border": "rgb(18,19,20)",
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
      "Custom CSS": ".thread {\n  padding: 1px;\n}\n.rice {\n  box-shadow:rgba(59,59,59,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#appchanx-settings input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#appchanx-settings input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}"
    },
    "Mesa": {
      "Author": "Tristan",
      "Author Tripcode": "!..NoTrip..",
      "Background Color": "#3c212a",
      "Thread Wrapper Background": "rgba(0,0,0,0)",
      "Thread Wrapper Border": "rgba(0,0,0,0)",
      "Dialog Background": "#3c212a",
      "Dialog Border": "#171717",
      "Reply Background": "#3c212a",
      "Reply Border": "#171717",
      "Highlighted Reply Background": "#3c212a",
      "Highlighted Reply Border": "#bfa977",
      "Backlinked Reply Outline": "#bfa977",
      "Input Background": "#3c212a",
      "Input Border": "#171717",
      "Checkbox Background": "#3c212a",
      "Checkbox Border": "#171717",
      "Buttons Background": "#3c212a",
      "Buttons Border": "#171717",
      "Focused Input Background": "#3c212a",
      "Focused Input Border": "#171717",
      "Hovered Input Background": "#3c212a",
      "Hovered Input Border": "#171717",
      "Navigation Background": "#3c212a",
      "Navigation Border": "#171717",
      "Quotelinks": "#bfa977",
      "Backlinks": "#bfa977",
      "Links": "#bfa977",
      "Hovered Links": "#aa4775",
      "Navigation Links": "#bfa977",
      "Hovered Navigation Links": "#aa4775",
      "Names": "#bfa977",
      "Tripcodes": "#aa6d89",
      "Emails": "#9c8aaa",
      "Subjects": "#bfa977",
      "Text": "#BFA977",
      "Inputs": "#bfa977",
      "Post Numbers": "#bfa977",
      "Greentext": "#99848b",
      "Sage": "rgb(150,150,150)",
      "Board Title": "#aa9d8d",
      "Timestamps": "#aa9d8d",
      "Warnings": "#aa8575",
      "Shadow Color": "rgba(0,0,0,.1)",
      "Custom CSS": "",
      "Background Image": "",
      "Background Attachment": "",
      "Background Position": "",
      "Background Repeat": ""
    },
    "White Rainbow": {
      "Author": "Shiro",
      "Author Tripcode": "!i.Neko0OEM",
      "Background Image": "url('http://subtlepatterns.com/patterns/paper_fibers.png')",
      "Background Attachment": "fixed",
      "Background Position": "top left",
      "Background Repeat": "repeat",
      "Background Color": "rgb(255,255,255)",
      "Dialog Background": "rgba(239,239,239,.98)",
      "Dialog Border": "rgb(214,214,214)",
      "Thread Wrapper Background": "rgba(239,239,239,.98)",
      "Thread Wrapper Border": "rgba(214,214,214,.4)",
      "Reply Background": "rgba(255,255,255,.90)",
      "Reply Border": "rgb(214,214,214)",
      "Highlighted Reply Background": "rgba(239,239,239,.90)",
      "Highlighted Reply Border": "#b84818",
      "Backlinked Reply Outline": "#b84818",
      "Checkbox Background": "rgba(239,239,239,.98)",
      "Checkbox Border": "rgb(187,187,187)",
      "Checkbox Checked Background": "rgba(239,239,239,.98)",
      "Input Background": "#fffffff",
      "Input Border": "rgb(187,187,187)",
      "Hovered Input Background": "#f0f0f0",
      "Hovered Input Border": "rgb(187,187,187)",
      "Focused Input Background": "#f0f0f0",
      "Focused Input Border": "rgb(187,187,187)",
      "Buttons Background": "rgba(239,239,239,.98)",
      "Buttons Border": "rgb(187,187,187)",
      "Navigation Background": "rgba(255,255,255,0.8)",
      "Navigation Border": "rgb(239,239,239)",
      "Quotelinks": "#7a2634",
      "Links": "#7a2634",
      "Hovered Links": "#c24646",
      "Navigation Links": "#404d41",
      "Hovered Navigation Links": "#527054",
      "Subjects": "#5533ff",
      "Names": "#242ca3",
      "Sage": "#6910ad",
      "Tripcodes": "#0c76ab",
      "Emails": "#0c76ab",
      "Post Numbers": "#b86e2e",
      "Text": "#242423",
      "Backlinks": "#7a2634",
      "Greentext": "#10610a",
      "Board Title": "#000000",
      "Timestamps": "#00913f",
      "Inputs": "#242423",
      "Warnings": "rgb(200,40,41)",
      "Shadow Color": "#b0b0b0",
      "Custom CSS": ".thread {\n  padding: 1px;\n}\n.rice {\n  box-shadow:rgba(255,255,255,.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow: inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow: inset rgba(200,200,200,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition: background .2s,box-shadow .2s;\n}"
    }
  };

  Icons = {
    oneechan: 'iVBORw0KGgoAAAANSUhEUgAAAA8AAACWCAMAAAA2YSLzAAAAPFBMVEVoaGhqampeXl5sbGxsbGxra2tsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGzXmsRLAAAAE3RSTlMAEAYnHBg2QExbcYaWqM++2+z4BMdvAwAAAtVJREFUSMfFVgmu3CAMhYRPAmb3/e9aL5Bl2kptVbXWSOSBsY15NmOMMZs1KnNExC+ezgV4MBtNMIw58+qX2REtQwiifdC6hwlNQBGfUlBzc+KYkP3IxH5hNvicCPXrMfEVi3ts2WrzaiN6jie2OI2GXbBfXiA/XPyexPpEHrHdyDV8YAt6vEYCVpJ3S7rXAZKkkfbnuR8Uk/32xsac6Y01La2ZfyIh1VrX9Rnfu5ygd6/XeQAGFxACkopDb3mkeXug48x5FCKhNzW+1j2t8/5EEwHTIfPm6G3aP37o/w/ir3QZ2V/xY0spdSxWL7MrLU7slmnDSY0UrH6CBJ/wFI3TNGECCDY9G4xmrpDkZvQMJ4q31EzLQuhipr7ag8ueFa+hUQy2d43nnPGg7NopHTUVyYlWpE+lUT4qfhDCnLpzB8oXLLJb4leptD/JblswOaZd0gRkDV0cJi69NNOUaclRpG6S1NPdRVPLjI3VSjWV8+FmaARknTxqfipl0tGR1DXvd0h251Ww/ZlaNQoaX3bqUS+IK6ZX4hysvuQinS+6n9638/6BbK4RLi6R11O8rPS4OnO66KHtw6yK96BWrg5QxDGcVzcoB8cYb/dE1zPO6C+pHxN0Ttw/JtJrx55+oV9Jq+ScF22IfBWDD+sHfTnBmKlpS99hPGSC4SBsi+dP3p0PjVBVedMdO3WoG57cAEbYVNkRHFROIzjYuGjoM7LOaEQKbtQjkuo5hCSMmezaNq3Gl6TE5J3ZLMu26SjpPJZo4h/9FJhT4JQJzjFXD7x54fBgzO9RvDH9Vl5vHIetcGHct1apLh/6gU3c2PYy5rrYh7a1NP29/H/G9xn/d+f7FNVcw9/H/9sf8ymXPnqdDd7Wx3OpzWRJuP8+iMTFe7wZq48Tce7QciNetUzku+pT/t4UHK/iIq2yPR/8y/315M/rWl1A/sM83phVh6+aeZY39OLNN4Y0P2GdHOWPAAAAAElFTkSuQmCC',
    "4chan SS": 'iVBORw0KGgoAAAANSUhEUgAAAA8AAACWCAMAAAA2YSLzAAAAPFBMVEVkZGRlZWVjY2NmZmZnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dZxmG7AAAAE3RSTlMFFQ0AJD8eQFRqf5CgssDM4+73gHqZRAAAA0pJREFUSMetVlmy5CgMZDMGxK7737Ulgcu8ejMREzHtD7sShJRaKWV/Psq3iz7QGwTF2BZ01hp3N6yasctZJANiN5ZlItDLtNkQDGNeMLU7EqmCbUwhkhZbwsIuNbyWPX7dIyHOrDYOc8SOiEUJjojN0EsWlCXRrq2qvJCsIjic2OcFrwrOpdmTimqVyWG7ZkrWy97p7z/hACd2FUetBcQDpTN+nuKsGng881L5xOz/VQ88xL/eQkyZT3axp+4dUMwvH0Pnhn6wSyR+8IdR4f43/v8XX1BHjXpjwy5RdEcQ7DiuzlBUsFD+GeIFEy6W0pKXoSZOiUz5tf99nvTDD/1sP9VRPvb/un86lT57SVqwSk8KR+L6kgTOlcZslRQe5WmJRKovETW7Anb+HzxUW4Xgnv11fuuj82aKXHz1Tzztx9v4VA9+/6le26B+3VhTC9RMPIr0qx4zaWNsnFRO0s8FWgEIFIRiVUAIlJGciqMmCwpQWyI/OplXA1RrXG1YI2svTQ3ufhWjNlKFqtXFI7Yg+zAXRcBZ+HygJuVHd0ys35bVn6QojLL5cZeVvPht/mVu/r/8s7GMXsLjv2s71GZhgjnEwsEVXogiSl/pl7LWra0IQgO3poTsieoYd4dhWfJlGWqyQf6sLxWt3/MRa4Im04ixeSdAWnxvqCX6tObVmzpZOPOZvrBNJF8gmGciBChsV+YdRYwnAvNpS4AnYFBm0KA2a35Unh+efxjercaLfV7wW0rtUTNl2j715al/9VtfutF+NZ/+aZSa+py/GCpRyvr17EsVLbRhmN++BBY/ik5/+YPK6bKnf2T8fh7P+uEYn0D3E4L3i6QHmvc3+k+8PN6Mb1w52tje6LbAi+M0FT4YneqVbpVDPnL2Xqx7m3tf9ENXHba9H/a/+X3z/+XfCnOo+Zy/o4SgY5Z6iq0nb+9Mc4JxL5f1qYs+xhTP/uiX/cMe4+hDHAfGnmGe+Ev+G88vnG7Ie20wHiUt/S1Kv+6BCM/9fkEfz73/9HNufQ4ZKdzvnwtS/LXltRcJB/yJ23H/mo89nPFa85Li3XOYu435LwTXKVWwO+cnlWFTB47L/AdfR//KI2bvF8sAb0c/M+1+YE3/oS77B8N+UUVHraV6AAAAAElFTkSuQmCC'
  };

  UI = (function() {
    var Menu, dialog, drag, dragend, dragstart, hover, hoverend, hoverstart, touchend, touchmove;

    dialog = function(id, position, html) {
      var child, el, move, _i, _len, _ref;

      el = $.el('div', {
        className: 'dialog',
        innerHTML: html,
        id: id
      });
      $.get("" + id + ".position", position, function(item) {
        return el.style.cssText = item["" + id + ".position"];
      });
      move = $('.move', el);
      $.on(move, 'touchstart mousedown', dragstart);
      _ref = move.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
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
        Rice.nodes(menu);
        $.add(Header.hover, menu);
        mRect = menu.getBoundingClientRect();
        bRect = button.getBoundingClientRect();
        bTop = doc.scrollTop + d.body.scrollTop + bRect.top;
        bLeft = doc.scrollLeft + d.body.scrollLeft + bRect.left;
        cHeight = doc.clientHeight;
        cWidth = doc.clientWidth;
        _ref1 = bRect.top + bRect.height + mRect.height < cHeight ? [bRect.bottom, null] : [null, cHeight - bRect.top], top = _ref1[0], bottom = _ref1[1];
        _ref2 = bRect.left + mRect.width < cWidth ? [bRect.left, null] : [null, cWidth - bRect.right], left = _ref2[0], right = _ref2[1];
        style = menu.style;
        style.top = "" + top + "px";
        style.right = "" + right + "px";
        style.bottom = "" + bottom + "px";
        style.left = "" + left + "px";
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
        return $.off(d, 'click CloseMenu', this.close);
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
        var bottom, cHeight, cWidth, eRect, focused, left, right, sRect, style, submenu, top, _i, _len, _ref, _ref1, _ref2;

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
        _ref1 = eRect.top + sRect.height < cHeight ? ['0px', 'auto'] : ['auto', '0px'], top = _ref1[0], bottom = _ref1[1];
        _ref2 = eRect.right + sRect.width < cWidth ? ['100%', 'auto'] : ['auto', '100%'], left = _ref2[0], right = _ref2[1];
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
        $.off(d, 'touchmove', this.move);
        $.off(d, 'touchend touchcancel', this.up);
      } else {
        $.off(d, 'mousemove', this.move);
        $.off(d, 'mouseup', this.up);
      }
      return $.set("" + this.id + ".position", this.style.cssText);
    };
    hoverstart = function(_arg) {
      var asapTest, cb, close, el, endEvents, latestEvent, o, root;

      root = _arg.root, el = _arg.el, latestEvent = _arg.latestEvent, endEvents = _arg.endEvents, asapTest = _arg.asapTest, cb = _arg.cb, close = _arg.close;
      o = {
        root: root,
        el: el,
        style: el.style,
        cb: cb,
        close: close,
        endEvents: endEvents,
        latestEvent: latestEvent,
        clientHeight: doc.clientHeight,
        clientWidth: doc.clientWidth
      };
      o.hover = hover.bind(o);
      o.hoverend = hoverend.bind(o);
      $.asap(function() {
        return !el.parentNode || asapTest();
      }, function() {
        if (el.parentNode) {
          return o.hover(o.latestEvent);
        }
      });
      $.on(root, endEvents, o.hoverend);
      return $.on(root, 'mousemove', o.hover);
    };
    hover = function(e) {
      var clientX, clientY, height, left, right, style, top, _ref;

      this.latestEvent = e;
      height = this.el.offsetHeight;
      clientX = e.clientX, clientY = e.clientY;
      top = clientY + (close ? 0 : -120);
      top = this.clientHeight <= height || top <= 0 ? 0 : top + height >= this.clientHeight ? this.clientHeight - height : top;
      _ref = clientX <= this.clientWidth - 400 ? [clientX + (this.close ? 15 : 45) + 'px', null] : [null, this.clientWidth - clientX + 45 + 'px'], left = _ref[0], right = _ref[1];
      style = this.style;
      style.top = top + 'px';
      style.left = left;
      return style.right = right;
    };
    hoverend = function() {
      $.rm(this.el);
      $.off(this.root, this.endEvents, this.hoverend);
      $.off(this.root, 'mousemove', this.hover);
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
      if (!properties.hasOwnProperty(key)) {
        continue;
      }
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
    engine: 'presto',
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
      var cred, form, headers, key, r, sync, type, upCallbacks, val;

      if (opts == null) {
        opts = {};
      }
      type = opts.type, cred = opts.cred, headers = opts.headers, upCallbacks = opts.upCallbacks, form = opts.form, sync = opts.sync;
      r = new XMLHttpRequest();
      type || (type = form && 'post' || 'get');
      r.open(type, url, !sync);
      for (key in headers) {
        val = headers[key];
        r.setRequestHeader(key, val);
      }
      $.extend(r, callbacks);
      $.extend(r.upload, upCallbacks);
      r.withCredentials = cred;
      r.send(form);
      return r;
    },
    cache: (function() {
      var reqs;

      reqs = {};
      return function(url, cb) {
        var req, rm;

        if (req = reqs[url]) {
          if (req.readyState === 4) {
            cb.call(req);
          } else {
            req.callbacks.push(cb);
          }
          return;
        }
        rm = function() {
          return delete reqs[url];
        };
        req = $.ajax(url, {
          onload: function(e) {
            var _i, _len, _ref;

            _ref = this.callbacks;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              cb = _ref[_i];
              cb.call(this, e);
            }
            return delete this.callbacks;
          },
          onabort: rm,
          onerror: rm
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
    addStyle: function(css, id) {
      var style;

      style = $.el('style', {
        id: id,
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
      root || (root = d.body);
      return d.evaluate(path, root, null, 8, null).singleNodeValue;
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
    rm: (function() {
      if ('remove' in Element.prototype) {
        return function(el) {
          return el.remove();
        };
      } else {
        return function(el) {
          var _ref;

          return (_ref = el.parentNode) != null ? _ref.removeChild(el) : void 0;
        };
      }
    })(),
    rmAll: function(root) {
      var node;

      while (node = root.firstChild) {
        $.rm(node);
      }
    },
    tn: function(s) {
      return d.createTextNode(s);
    },
    frag: function() {
      return d.createDocumentFragment();
    },
    nodes: function(nodes) {
      var frag, node, _i, _len;

      if (!(nodes instanceof Array)) {
        return nodes;
      }
      frag = $.frag();
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
      $.add(d.head || doc, script);
      return $.rm(script);
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
    minmax: function(value, min, max) {
      return (value < min ? min : value > max ? max : value);
    },
    syncing: {},
    sync: (function() {
      window.addEventListener('storage', function(e) {
        var cb;

        if (cb = $.syncing[e.key]) {
          return cb(JSON.parse(e.newValue));
        }
      }, false);
      return function(key, cb) {
        return $.syncing[g.NAMESPACE + key] = cb;
      };
    })(),
    item: function(key, val) {
      var item;

      item = {};
      item[key] = val;
      return item;
    }
  });

  (function() {
    var scriptStorage;

    scriptStorage = opera.scriptStorage;
    $["delete"] = function(keys) {
      var key, _i, _len;

      if (!(keys instanceof Array)) {
        keys = [keys];
      }
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        key = g.NAMESPACE + key;
        localStorage.removeItem(key);
        delete scriptStorage[key];
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
          if (val = scriptStorage[g.NAMESPACE + key]) {
            items[key] = JSON.parse(val);
          }
        }
        return cb(items);
      });
    };
    return $.set = (function() {
      var set;

      set = function(key, val) {
        key = g.NAMESPACE + key;
        val = JSON.stringify(val);
        if (key in $.syncing) {
          localStorage.setItem(key, val);
        }
        return scriptStorage[key] = val;
      };
      return function(keys, val) {
        var key;

        if (typeof keys === 'string') {
          set(keys, val);
          return;
        }
        for (key in keys) {
          val = keys[key];
          set(key, val);
        }
      };
    })();
  })();

  Polyfill = {
    init: function() {
      return Polyfill.visibility();
    },
    visibility: function() {
      var event, prefix, property;

      if ('visibilityState' in document || !(prefix = ('webkitVisibilityState' in document ? 'webkit' : 'mozVisibilityState' in document ? 'moz' : void 0))) {
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

  Style = {
    init: function() {
      this.agent = {
        'gecko': '-moz-',
        'webkit': '-webkit-',
        'presto': '-o-'
      }[$.engine];
      this.sizing = "" + ($.engine === 'gecko' ? this.agent : '') + "box-sizing";
      $.asap((function() {
        return d.body;
      }), MascotTools.init);
      $.ready(function() {
        if (!$.id('navtopright')) {
          return;
        }
        return setTimeout((function() {
          var exLink;

          Style.padding.nav = Header.nav;
          Style.padding.pages = $(".pagelist", d.body);
          Style.padding();
          $.on(window, "resize", Style.padding);
          Style.iconPositions();
          if (exLink = $("#navtopright .exlinksOptionsLink", d.body)) {
            return $.on(exLink, "click", function() {
              return setTimeout(Rice.nodes, 100);
            });
          }
        }), 500);
      });
      return this.setup();
    },
    setup: function() {
      this.addStyleReady();
      if (d.head) {
        this.remStyle();
        if (!Style.headCount) {
          return this.cleanup();
        }
      }
      return this.observe();
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
        Style.remStyle();
        if (!Style.headCount || d.readyState === 'complete') {
          if (Style.observer) {
            Style.observer.disconnect();
          } else {
            $.off(d, 'DOMNodeInserted', Style.wrapper);
          }
          return Style.cleanup();
        }
      }
    },
    cleanup: function() {
      delete Style.observe;
      delete Style.wrapper;
      delete Style.remStyle;
      delete Style.headCount;
      return delete Style.cleanup;
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
    headCount: 12,
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
      $.addStyle(JSColor.css(), 'jsColor');
      return delete Style.addStyleReady;
    },
    remStyle: function() {
      var i, node, nodes;

      nodes = d.head.children;
      i = nodes.length;
      while (i--) {
        if (!Style.headCount) {
          break;
        }
        node = nodes[i];
        if ((node.nodeName === 'STYLE' && !node.id) || (("" + node.rel).contains('stylesheet') && node.href.slice(0, 4) !== 'data')) {
          Style.headCount--;
          $.rm(node);
          continue;
        }
      }
    },
    filter: function(text, background) {
      var bgHex, fgHex, matrix, string;

      matrix = function(fg, bg) {
        return " " + bg.r + " " + (-fg.r) + " 0 0 " + fg.r + " " + bg.g + " " + (-fg.g) + " 0 0 " + fg.g + " " + bg.b + " " + (-fg.b) + " 0 0 " + fg.b + "";
      };
      fgHex = Style.colorToHex(text);
      bgHex = Style.colorToHex(background);
      string = matrix({
        r: parseInt(fgHex.substr(0, 2), 16) / 255,
        g: parseInt(fgHex.substr(2, 2), 16) / 255,
        b: parseInt(fgHex.substr(4, 2), 16) / 255
      }, {
        r: parseInt(bgHex.substr(0, 2), 16) / 255,
        g: parseInt(bgHex.substr(2, 2), 16) / 255,
        b: parseInt(bgHex.substr(4, 2), 16) / 255
      });
      return "filter: url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='filters' color-interpolation-filters='sRGB'><feColorMatrix values='" + string + " 0 0 0 1 0' /></filter></svg>#filters\");";
    },
    layout: function() {
      var agent, css, editSpace, position, width, xOffset, _conf;

      _conf = Conf;
      agent = Style.agent;
      xOffset = _conf["Sidebar Location"] === "left" ? '-' : '';
      position = {
        right: {
          hide: parseInt(_conf['Right Thread Padding'], 10) < 100 ? "right" : "left",
          minimal: "right"
        }[_conf["Sidebar"]] || "left",
        left: parseInt(_conf['Right Thread Padding'], 10) < 100 ? "right" : "left"
      }[_conf["Sidebar Location"]];
      Style['sidebarOffset'] = _conf['Sidebar'] === "large" ? {
        W: 51,
        H: 17
      } : {
        W: 0,
        H: 0
      };
      Style.logoOffset = _conf["4chan Banner"] === "at sidebar top" ? 83 + Style.sidebarOffset.H : 0;
      width = 248 + Style.sidebarOffset.W;
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
      }[_conf['Sidebar']] || (252 + Style.sidebarOffset.W);
      Style.replyMargin = _conf["Post Spacing"];
      return css = "/* Cleanup */\n#absbot,\n#delPassword,\n#delform > hr:last-of-type,\n#navbotright,\n#postForm,\n#styleSwitcher,\n.boardBanner > div,\n.mobile,\n.postingMode,\n.riced,\n.sideArrows,\n.stylechanger,\nbody > br,\nbody > div[style^=\"text-align\"],\nbody > hr {\n  display: none;\n}\n/* Empties */\n#qr .warning:empty,\n#qr-thread-select:empty {\n  display: none;\n}\n/* File Name Trunctuate */\n.fileText:hover .fntrunc,\n.fileText:not(:hover) .fnfull {\n  display: none;\n}\n/* Unnecessary */\n#qp input,\n#qp .rice,\n.inline .rice {\n  display: none !important;\n}\n/* Hidden Content */\n.forwarded,\n.hidden_thread ~ div,\n.hidden_thread ~ a,\n.replyContainer .stub ~ div,\n.replyContainer .stub ~ a,\n.stub + div,\n[hidden] {\n  display: none !important;\n}\n/* Hidden UI */\n#catalog,\n#navlinks,\n#navtopright,\n.cataloglink,\n.navLinks,\na[style=\"cursor: pointer; float: right;\"] {\n  position: fixed;\n  top: 100%;\n  left: 100%;\n}\n/* Hide last horizontal rule, keep clear functionality. */\n.board > hr:last-of-type {\n  visibility: hidden;\n}\n/* Fappe Tyme */\n.fappeTyme .thread > .noFile {\n  display: none;\n}\n/* Defaults */\na {\n  text-decoration: " + (_conf["Underline Links"] ? "underline" : "none") + ";\n  outline: none;\n}\nbody,\nhtml {\n  min-height: 100%;\n  " + Style.sizing + ": border-box;\n}\nbody {\n  outline: none;\n  font-size: " + (parseInt(_conf["Font Size"], 10)) + "px;\n  font-family: " + _conf["Font"] + ";\n  min-height: 100%;\n  margin-top: 0;\n  margin-bottom: 0;\n  margin-" + Style.sidebarLocation[0] + ": " + (/^boards\.4chan\.org$/.test(location.hostname) ? Style.sidebar : '2') + "px;\n  margin-" + Style.sidebarLocation[1] + ": 2px;\n  padding: 0 " + (parseInt(_conf["Right Thread Padding"], 10) + editSpace["right"]) + "px 0 " + (parseInt(_conf["Left Thread Padding"], 10) + editSpace["left"]) + "px;\n}\nbody.unscroll {\n  overflow: hidden;\n}\n" + (_conf["4chan SS Sidebar"] && /^boards\.4chan\.org$/.test(location.hostname) ? "body::before {  content: '';  position: fixed;  top: 0;  bottom: 0;  " + Style.sidebarLocation[0] + ": 0;  width: " + (_conf['Sidebar'] === 'large' ? 305 : _conf['Sidebar'] === 'normal' ? 254 : _conf['Sidebar'] === 'minimal' ? 27 : 0) + "px;  z-index: 1;  " + Style.sizing + ": border-box;  display: block;}body {  padding-" + Style.sidebarLocation[0] + ": 2px;}" : "") + "\nbutton,\ninput,\ntextarea {\n  font-size: " + (parseInt(_conf["Font Size"], 10)) + "px;\n  font-family: " + _conf["Font"] + ";\n}\nhr {\n  clear: both;\n  border: 0;\n  padding: 0;\n  margin: 0 0 1px;\n  " + (_conf['Hide Horizontal Rules'] ? 'visibility: hidden;' : '') + "\n}\n.center {\n  text-align: center;\n}\n.disabled {\n  opacity: 0.5;\n}\n/* Symbols */\n.drop-marker {\n  vertical-align: middle;\n  display: inline-block;\n  margin: 2px 2px 3px;\n  border-top: .5em solid;\n  border-right: .3em solid transparent;\n  border-left: .3em solid transparent;\n}\n.brackets-wrap::before {\n  content: \"\\00a0[\";\n}\n.brackets-wrap::after {\n  content: \"]\\00a0\";\n}\n/* Thread / Reply Nav */\n#navlinks a {\n  position: fixed;\n  z-index: 12;\n  opacity: 0.5;\n  display: inline-block;\n  border-right: 6px solid transparent;\n  border-left: 6px solid transparent;\n  margin: 1.5px;\n}\n/* Navigation */\n#boardNavDesktop {\n  z-index: 6;\n  border-width: 1px;\n  position: absolute;\n" + (_conf['4chan SS Navigation'] ? "  left: 0;  right: 0;  border-left: 0;  border-right: 0;  border-radius: 0 !important;" : "  " + Style.sidebarLocation[0] + ": " + (Style.sidebar + parseInt(_conf["Right Thread Padding"], 10) + editSpace["right"]) + "px;  " + Style.sidebarLocation[1] + ": " + (parseInt(_conf["Left Thread Padding"], 10) + editSpace["left"] + 2) + "px;") + "\n" + (_conf["Hide Navigation Decorations"] ? "  font-size: 0;  color: transparent;  word-spacing: 2px;" : "") + "\n   text-align: " + _conf["Navigation Alignment"] + ";\n}\n.fixed #boardNavDesktop {\n  position: fixed;\n}\n.top #boardNavDesktop {\n  top: 0;\n  border-top-width: 0;\n  " + (_conf["Rounded Edges"] ? "border-radius: 0 0 3px 3px;" : "") + "\"\n}\n.fixed.bottom #boardNavDesktop {\n  bottom: 0;\n  border-bottom-width: 0;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px 3px 0 0;" : "") + "\"\n}\n.hide #boardNavDesktop {\n  position: fixed;\n  top: 110%;\n  bottom: auto;\n}\n/* Header Autohide */\n.fixed #boardNavDesktop.autohide:not(:hover) {\n  box-shadow: none;\n  transition: all .8s .6s cubic-bezier(.55, .055, .675, .19);\n}\n.fixed.top #boardNavDesktop.autohide:not(:hover) {\n  margin-bottom: -1em;\n  " + agent + "transform: translateY(-100%);\n}\n.fixed.bottom #boardNavDesktop.autohide:not(:hover) {\n  " + agent + "transform: translateY(100%);\n}\n#toggle-header-bar {\n  left: 0;\n  right: 0;\n  height: 10px;\n  position: absolute;\n}\n#boardNavDesktop #toggle-header-bar {\n  display: none;\n}\n.fixed #boardNavDesktop #toggle-header-bar {\n  display: block;\n}\n.fixed #boardNavDesktop #toggle-header-bar {\n  cursor: n-resize;\n}\n.fixed.top boardNavDesktop #toggle-header-bar {\n  top: 100%;\n}\n.fixed.bottom #boardNavDesktop #toggle-header-bar {\n  bottom: 100%;\n}\n.fixed #boardNavDesktop #header-bar.autohide #toggle-header-bar {\n  cursor: s-resize;\n}\n/* Notifications */\n#notifications {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n}\n.fixed.top #notifications {\n  position: absolute;\n  top: 100%;\n}\n.notification {\n  display: block;\n  overflow: hidden;\n  width: 300px;\n  border: 1px solid;\n}\n.notification:not(:first-of-type) {\n  border-top: none;\n}\n.close {\n  float: right;\n}\n/* Pagination */\n.pagelist {\n  border-width: 1px;\n  text-align: " + _conf["Pagination Alignment"] + ";\n" + (_conf['4chan SS Navigation'] ? "  left: 0;  right: 0;  border-left: 0;  border-right: 0;  border-radius: 0 !important;" : "  " + Style.sidebarLocation[0] + ": " + (Style.sidebar + parseInt(_conf["Right Thread Padding"], 10) + editSpace["right"]) + "px;  " + Style.sidebarLocation[1] + ": " + (parseInt(_conf["Left Thread Padding"], 10) + editSpace["left"] + 2) + "px;") + "\n" + {
        "sticky top": "  position: fixed;  top: 0;  border-top-width: 0;  " + (_conf["Rounded Edges"] ? "border-radius: 0 0 3px 3px;" : ""),
        "sticky bottom": "  position: fixed;  bottom: 0;  border-bottom-width: 0;  " + (_conf["Rounded Edges"] ? "border-radius: 3px 3px 0 0;" : ""),
        "top": "  position: absolute;  top: 0;  border-top-width: 0;  " + (_conf["Rounded Edges"] ? "border-radius: 0 0 3px 3px;" : ""),
        "bottom": "  position: static;  " + (_conf["Rounded Edges"] ? "border-radius: 3px 3px 0 0;" : ""),
        "hide": "  display: none;",
        "on side": "  position: fixed;  padding: 0;  top: auto;  bottom: " + (['fixed', 'transparent fade'].contains(_conf['Post Form Style']) ? 21.6 + (Conf['Show Post Form Header'] ? 1.5 : 0) + (Conf['Post Form Decorations'] ? 0.2 : 0) : .5) + "em;  " + Style.sidebarLocation[1] + ": auto;  " + Style.sidebarLocation[0] + ": " + (250 + Style.sidebarOffset.W) + "px  position: fixed;" + (Style.sidebarLocation[0] === 'right' ? "  " + agent + "transform: rotate(90deg);  " + agent + "transform-origin: bottom right;" : "  " + agent + "transform: rotate(-90deg);  " + agent + "transform-origin: bottom left;") + "  z-index: 6;  margin: 0;  background: none transparent !important;  border: 0 none !important;  text-align: right;"
      }[_conf['Pagination']] + "\n" + (_conf["Hide Navigation Decorations"] ? "  font-size: 0;  color: transparent;  word-spacing: 0;" : "") + "\n  z-index: 6;\n}\n.pagelist input,\n.pagelist div {\n  vertical-align: middle;\n}\n#boardNavDesktop a {\n  font-size: " + (parseInt(_conf["Font Size"], 10)) + "px;\n}\n" + (_conf["Hide Navigation Decorations"] ? ".pages a {  margin: 0 1px;  font-size: " + (parseInt(_conf["Font Size"], 10)) + "px;}" : "") + "\n.next,\n.pages,\n.prev {\n  display: inline-block;\n  margin: 0 3px;\n}\n/* Banner */\n.boardBanner {\n  line-height: 0;\n}\n" + (_conf["Faded 4chan Banner"] ? ".boardBanner {  opacity: 0.5;  " + agent + "transition: opacity 0.3s ease-in-out .5s;}.boardBanner:hover {  opacity: 1;  " + agent + "transition: opacity 0.3s ease-in;}" : "") + "\n" + (_conf["4chan Banner Reflection"] ? "/* From 4chan SS / OneeChan */.gecko .boardBanner::after {  background-image: -moz-element(#Banner);  bottom: -100%;  content: '';  left: 0;  mask: url(\"data:image/svg+xml,<svg version='1.1' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient gradientUnits='objectBoundingBox' id='gradient' x2='0' y2='1'><stop stop-offset='0'/><stop stop-color='white' offset='1'/></linearGradient><mask id='mask' maskUnits='objectBoundingBox' maskContentUnits='objectBoundingBox' x='0' y='0' width='100%' height='100%'> <rect fill='url(%23gradient)' width='1' height='1' /></mask></defs></svg>#mask\");  opacity: 0.3;  position: absolute;  right: 0;  top: 100%;  -moz-transform: scaleY(-1);  z-index: -1;}.webkit #Banner {  -webkit-box-reflect: below 0 -webkit-linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0) 10%, rgba(255,255,255,.5));}" : "") + "\n" + {
        "at sidebar top": ".boardBanner {  position: fixed;  top: 16px;  " + Style.sidebarLocation[0] + ": 2px;}.boardBanner img {  width: " + width + "px;}",
        "at sidebar bottom": ".boardBanner {  position: fixed;  bottom: 270px;  " + Style.sidebarLocation[0] + ": 2px;}.boardBanner img {  width: " + width + "px;}",
        "under post form": "  .boardBanner {  position: fixed;  bottom: 130px;  " + Style.sidebarLocation[0] + ": 2px;}.boardBanner img {  width: " + width + "px;}",
        "at top": ".boardBanner {  position: relative;  display: table;  margin: 12px auto;  text-align: center;}",
        "hide": ".boardBanner {  display: none;}"
      }[_conf["4chan Banner"]] + "\n/* Board Title */\n#boardTitle {\n  font-size: " + (parseInt(_conf["Font Size"], 10) + 10) + "px;\n  text-align: center;\n  z-index: 4;\n" + {
        "at sidebar top": "  position: fixed;  " + Style.sidebarLocation[0] + ": 2px;  top: " + ((Style.logoOffset === 0 && _conf["Icon Orientation"] !== "vertical" ? 40 : 21) + Style.logoOffset) + "px;  width: " + width + "px;",
        "at sidebar bottom": "  position: fixed;  " + Style.sidebarLocation[0] + ": 2px;  bottom: 280px;  width: " + width + "px;",
        "under post form": "  position: fixed;  " + Style.sidebarLocation[0] + ": 2px;  bottom: 140px;  width: " + width + "px;",
        "at top": "  margin: 12px 0;",
        "hide": "  display: none;"
      }[_conf["Board Title"]] + "\n}\n.boardTitle a {\n  font-size: " + (parseInt(_conf["Font Size"], 10) + 10) + "px;\n}\n.boardSubtitle,\n.boardSubtitle a {\n  font-size: " + (parseInt(_conf["Font Size"], 10) - 1) + "px;\n}\n/* Dialogs */\n.move {\n  cursor: pointer;\n}\n#ihover {\n  position: fixed;\n  max-height: 97%;\n  max-width: 75%;\n  padding: 10px;\n  z-index: 22;\n}\n#qp {\n  position: fixed;\n  z-index: 22;\n}\n#qp .postMessage::after {\n  clear: both;\n  display: block;\n  content: \"\";\n}\n#qp .full-image {\n  max-height: 300px;\n  max-width: 500px;\n}\n#menu {\n  position: fixed;\n  outline: none;\n  z-index: 22;\n}\n/* Updater */\n#updater {\n  position: fixed;\n  z-index: 10;\n  padding: 0 1px 1px;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n}\n#updater:hover {\n  z-index: 30;\n} \n#updater:not(:hover) > div:not(.move) {\n  display: none;\n}\n#updater input {\n  text-align: right;\n}\n#updater .field {\n  width: 50px;\n}\n/* Stats */\n#thread-stats {\n  position: fixed;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n  z-index: 10;\n}\n/* Image Expansion */\n.fit-width .full-image {\n  max-width: 100%;\n  width: 100%;\n}\n" + (_conf['Images Overlap Post Form'] ? ".full-image {  position: relative;  z-index: 22;}" : "") + "\n/* Prefetcher */\n#prefetch {\n  z-index: 9;\n  position: fixed;\n}\n/* Delete Buttons */\n" + (_conf['Hide Delete UI'] ? ".deleteform,.post .rice {  display: none;}.postInfo {  padding: 0 0 0 3px;}" : ".deleteform {  position: fixed;  z-index: 18;  width: 0;  bottom: 0;  right: 0;  border-width: 1px 0 0 1px;  border-style: solid;  font-size: 0;  color: transparent;}.deleteform:hover {  width: auto;}.deleteform::before {  z-index: 18;  border-width: 1px 0 0 1px;  border-style: solid;  content: 'X';  display: block;  position: fixed;  bottom: 0;  right: 0;  font-size: " + _conf['Font Size'] + "px;  " + Style.sizing + ": border-box;  height: 1.6em;  width: 1.4em;  text-align: center;}.deleteform:hover::before {  display: none;}.deleteform input {  margin: 0 1px 0 0;}") + "\n/* Slideout Navigation */\n#boardNavDesktopFoot {\n  position: fixed;\n  width: " + width + "px;\n  " + Style.sidebarLocation[0] + ": 2px;\n  text-align: center;\n  font-size: 0;\n  color: transparent;\n  overflow: hidden;\n  " + Style.sizing + ": border-box;\n}\n#boardNavDesktopFoot a,\n#boardNavDesktopFoot a::after,\n#boardNavDesktopFoot a::before {\n  font-size: " + _conf['Font Size'] + "px;\n}\n#boardNavDesktopFoot:hover {\n  overflow-y: auto;\n  padding: 2px;\n}\n#boardNavDesktopFoot:not(:hover) {\n  border-color: transparent;\n  background-color: transparent;\n  height: 0;\n  overflow: hidden;\n  padding: 0;\n  border: 0 none;\n}\n" + {
        compact: "#boardNavDesktopFoot {  word-spacing: 1px;}",
        list: "#boardNavDesktopFoot a {  display: block;}#boardNavDesktopFoot:hover {  max-height: 400px;}#boardNavDesktopFoot a::after {  content: ' - ' attr(title);}#boardNavDesktopFoot a[href*='//boards.4chan.org/']::after,#boardNavDesktopFoot a[href*='//rs.4chan.org/']::after {  content: '/ - ' attr(title);}#boardNavDesktopFoot a[href*='//boards.4chan.org/']::before,#boardNavDesktopFoot a[href*='//rs.4chan.org/']::before {  content: '/';}",
        hide: "#boardNavDesktopFoot {  display: none;}"
      }[_conf["Slideout Navigation"]] + "\n/* Watcher */\n#watcher {\n  position: fixed;\n  z-index: 14;\n  padding: 2px;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n}\n#watcher > div {\n  max-height: 1.3em;\n  overflow: hidden;\n} \n" + (_conf['Slideout Watcher'] ? "#watcher {  width: " + width + "px;  " + Style.sidebarLocation[0] + ": 2px !important;  " + Style.sidebarLocation[1] + ": auto !important;  " + Style.sizing + ": border-box;}#watcher .move {  cursor: default;  text-decoration: " + (_conf["Underline Links"] ? "underline" : "none") + ";}#watcher > div {  overflow: hidden;}#watcher:hover {  overflow-y: auto;}#watcher:not(:hover) {  height: 0;  overflow: hidden;  border: 0 none;  padding: 0;}" : "#watcher {  width: 200px;}#watcher:not(:hover) {  max-height: 200px;  overflow: hidden;} ") + "\n/* Announcements */\n#globalMessage {\n  text-align: center;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n}\n" + ({
        'slideout': " #globalMessage {  position: fixed;  padding: 2px;  width: " + width + "px;  " + Style.sidebarLocation[0] + ": 2px !important;  " + Style.sidebarLocation[1] + ": auto !important;}#globalMessage h3 {  margin: 0;}#globalMessage:hover {  " + Style.sizing + ": border-box;  overflow-y: auto;}#globalMessage:not(:hover) {  height: 0;  overflow: hidden;  padding: 0;  border: 0 none;}",
        'hide': "#globalMessage {  display: none !important;}"
      }[_conf['Announcements']] || "") + "\n/* Threads */\n.thread {\n  margin: " + (parseInt(_conf["Top Thread Padding"], 10)) + "px 0 " + (parseInt(_conf["Bottom Thread Padding"], 10)) + "px 0;\n  " + (_conf["Rounded Edges"] ? "border-radius: 4px;" : "") + "\n}\n/* Thread Clearfix */\n.thread > div:last-of-type::after {\n  display: block;\n  content: ' ';\n  clear: both;\n}\n/* Posts */\n.expanding {\n  opacity: .5;\n}\n.fileText:hover .fntrunc,\n.fileText:not(:hover) .fnfull,\n.expanded-image > .post > .file > .fileThumb > img[data-md5],\n.post > .file > .fileThumb > .full-image {\n  display: none;\n}\n.expanded-image > .post > .file > .fileThumb > .full-image {\n  display: block;\n}\n.summary {\n  margin-bottom: " + Style.replyMargin + "px;\n}\n.post {\n  margin-bottom: " + Style.replyMargin + "px;\n}\n.replyContainer:last-of-type .post {\n  margin-bottom: 0;\n}\n.menu-button {\n  position: relative;\n}\n.stub .menu-button,\n.post .menu-button,\n.hide-thread-button,\n.show-thread-button span,\n.hide-reply-button,\n.show-reply-button span {\n  float: right;\n}\n.post .menu-button,\n.hide-thread-button,\n.hide-reply-button {\n  margin: 0 3px;\n  opacity: 0;\n  " + agent + "transition: opacity .3s ease-out 0s;\n}\n.post:hover .hide-reply-button,\n.post:hover .menu-button,\n.post:hover .hide-thread-button,\n.hidden_thread .hide-thread-button,\n.hidden_thread .menu-button,\n.inline .hide-reply-button,\n.inline .menu-button {\n  opacity: 1;\n}\n.hidden_thread {\n  text-align: right;\n}\n" + (_conf['Color user IDs'] ? ".posteruid .hand {  padding: .1em .3em;  border-radius: 1em;  font-size: 80%;}" : "") + "\n.postInfo > span {\n  vertical-align: bottom;\n}\n.subject,\n.name {\n  " + (_conf["Bolds"] ? 'font-weight: 600;' : '') + "\n}\n.postertrip {\n  " + (_conf["Italics"] ? 'font-style: italic;' : '') + "\n}\n.replylink {\n  text-decoration: " + (_conf["Underline Links"] ? "underline" : "none") + ";\n}\n.fileInfo {\n  padding: 0 3px;\n}\n.fileThumb {\n  float: left;\n  margin: 3px 20px;\n  outline: none;\n}\n.reply.post {\n  " + Style.sizing + ": border-box;\n}\n" + (_conf["Fit Width Replies"] ? ".reply.post {  display: block;  overflow: hidden;}.expanded-image .reply.post {  width: 100%;}" : ".reply.post {  display: inline-block;}") + "\n.expanded-image .reply.post {\n  display: inline-block;\n  overflow: visible;\n  clear: both;\n} \n.post {\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n}\n.postMessage {\n  margin: " + _conf['Vertical Post Padding'] + "px " + _conf['Horizontal Post Padding'] + "px;\n}\n.spoiler,\ns {\n  text-decoration: none;\n}\n/* Reply Clearfix */\n.reply.post .postMessage {\n  clear: right;\n}\n" + (_conf['Force Reply Break'] || _conf["OP Background"] ? ".op.post .postMessage::after {  display: block;  content: ' ';  clear: both;}" : "") + "\n/* OP */\n.favicon {\n  vertical-align: bottom;\n}\n" + (_conf["OP Background"] ? ".op.post {  " + Style.sizing + ": border-box;}" : "") + "\n/* Summary */\n" + (_conf["Force Reply Break"] ? ".summary { clear: both;}" : "") + "\n/* Inlined */\n.inline {\n  margin: 2px 8px 2px 2px;\n}\n.post .inline {\n  margin: 2px;\n}\n.inline .replyContainer {\n  display: inline-block;\n}\n/* Inlined Clearfix */\n.inline .postMessage::after {\n  clear: both;\n  display: block;\n  content: \"\";\n}\n/* Quotes */\n.inlined {\n  opacity: .5;\n}\n.quotelink {\n  text-decoration: " + (_conf["Underline Links"] ? "underline" : "none") + ";\n}\n.filtered,\n.quotelink.filtered {\n  text-decoration: underline;\n  text-decoration: line-through !important;\n}\n/* Backlinks */\n.backlink {\n  text-decoration: " + (_conf["Underline Links"] ? "underline" : "none") + ";\n}\n.backlink.dead {\n  text-decoration: none;\n}\n" + {
        "lower left": ".container {  padding: 0 5px;  max-width: 100%;}.reply.quoted {  position: relative;  padding-bottom: 1.7em;}.reply .container {  position: absolute;  left: 0;  bottom: 0;  padding: 0 5px;}.reply .container::before {  content: 'REPLIES: ';}#qp .container {  position: static;  max-width: 100%;}#qp .container::before {  content: '';}.inline .container {  position: static;  max-width: 100%;}.inline .container::before {  content: '';}",
        'lower right': ".reply.quoted {  position: relative;  padding-bottom: 1.7em;}.reply .container {  position: absolute;  right: 0;  bottom: 0;}.container::before {  content: 'REPLIES: ';}.container {  max-width: 100%;  padding: 0 5px;}#qp .container {  position: static;  max-width: 100%;}#qp .container::before {  content: '';}.inline .container {  position: static;  float: none;}.inline .container::before {  content: '';}",
        'default': ""
      }[_conf["Backlinks Position"]] + "\n/* Code */\n.prettyprint {\n  " + Style.sizing + ": border-box;\n  font-family: monospace;\n  display: inline-block;\n  margin-right: auto;\n  white-space: pre-wrap;\n  border-radius: 2px;\n  overflow-x: auto;\n  padding: 3px;\n  max-width: 100%;\n}\n/* Menu */\n.entry {\n  border-bottom: 1px solid rgba(0,0,0,.25);\n  cursor: pointer;\n  display: block;\n  outline: none;\n  padding: 3px 7px;\n  position: relative;\n  text-decoration: none;\n  white-space: nowrap;\n}\n.entry:last-child {\n  border-bottom: 0;\n}\n.has-submenu::after {\n  content: \"\";\n  border-" + position + ": .5em solid;\n  border-top: .3em solid transparent;\n  border-bottom: .3em solid transparent;\n  display: inline-block;\n  margin: .3em;\n  position: absolute;\n  right: 3px;\n}\n.submenu {\n  display: none;\n  position: absolute;\n  " + position + ": 100%;\n  top: -1px;\n}\n.focused .submenu {\n  display: block;\n}\n/* Stubs */\n" + (_conf['Fit Width Replies'] ? ".stub {  display: block;  text-align: right;}" : "") + "\n/* Emoji */\n" + (_conf["Emoji"] !== "disable" ? Emoji.css(_conf["Emoji Position"]) : "") + "\n/* Element Replacing */\n/* Checkboxes */\n.rice {\n  cursor: pointer;\n  width: 9px;\n  height: 9px;\n  margin: 2px 3px 3px;\n  display: inline-block;\n  vertical-align: bottom;\n  " + (_conf["Rounded Edges"] ? "border-radius: 2px;" : "") + "\n  " + (_conf["Circle Checkboxes"] ? "border-radius: 6px;" : "") + "\n}\ninput:checked + .rice {\n  background-attachment: scroll;\n  background-repeat: no-repeat;\n  background-position: bottom right;\n}\n/* Selects */\n.selectrice {\n  position: relative;\n  cursor: default;\n  overflow: hidden;\n  text-align: left;\n}\n.selectrice::after {\n  content: \"\";\n  border-right: .25em solid transparent;\n  border-left: .25em solid transparent;\n  position: absolute;\n  right: .4em;\n  top: .5em;\n}\n.selectrice::before {\n  content: \"\";\n  height: 1.6em;\n  position: absolute;\n  right: 1.3em;\n  top: 0;\n}\n/* Select Dropdown */\n#selectrice {\n  padding: 0;\n  margin: 0;\n  position: fixed;\n  max-height: 120px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  z-index: 32;\n}\n#selectrice:empty {\n  display: none;\n}\n/* Post Form */\n#qr {\n  z-index: 20;\n  position: fixed;\n  padding: 1px;\n  border: 1px solid transparent;\n  min-width: " + width + "px;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px 3px 0 0;" : "") + "\n}\n#qrtab {\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px 3px 0 0;" : "") + "\n}\n\n" + ({
        "fixed": "#qr {  top: auto !important;  bottom: 1.7em !important;  " + Style.sidebarLocation[0] + ": 0 !important;  " + Style.sidebarLocation[1] + ": auto !important;}",
        "slideout": "#qrtab input,#qrtab .rice {  display: none;}#qr {  top: auto !important;  bottom: 1.7em !important;  " + Style.sidebarLocation[0] + ": 0 !important;  " + Style.sidebarLocation[1] + ": auto !important;  " + agent + "transform: translateX(" + xOffset + "93%);}#qr:hover,#qr.has-focus,#qr.dump {  " + agent + "transform: translate(0);}",
        "tabbed slideout": "#qr {  top: auto !important;  bottom: 1.7em !important;  " + Style.sidebarLocation[0] + ": 0 !important;  " + Style.sidebarLocation[1] + ": auto !important;  " + agent + "transform: translateX(" + xOffset + "100%);}#qr:hover,#qr.has-focus,#qr.dump {  " + agent + "transform: translateX(0);}#qrtab {  " + agent + "transform: rotate(" + (Style.sidebarLocation[0] === "left" ? "" : "-") + "90deg);  " + agent + "transform-origin: bottom " + Style.sidebarLocation[0] + ";  position: absolute;  top: 0;  " + Style.sidebarLocation[0] + ": 100%;  width: 110px;  text-align: center;  border-width: 1px 1px 0 1px;  cursor: default;}#qr:hover #qrtab,#qr.has-focus #qrtab,#qr.dump #qrtab {  opacity: 0;  " + Style.sidebarLocation[0] + ": " + (252 + Style.sidebarOffset.W) + "px;}#qrtab input,#qrtab .close,#qrtab .rice,#qrtab span {  display: none;}",
        "transparent fade": "#qr {  overflow: visible;  top: auto !important;  bottom: 1.7em !important;  " + Style.sidebarLocation[0] + ": 2px !important;  " + Style.sidebarLocation[1] + ": auto !important;  opacity: 0.2;  " + agent + "transition: opacity .3s ease-in-out 1s;}#qr:hover,#qr.has-focus,#qr.dump {  opacity: 1;  " + agent + "transition: opacity .3s linear;}"
      }[_conf['Post Form Style']] || "") + "\n\n" + (_conf['Post Form Style'] !== 'tabbed slideout' ? (!(_conf['Post Form Style'] === 'float' || _conf['Show Post Form Header']) ? "#qrtab { display: none; }" : _conf['Post Form Style'] !== 'slideout' ? ".autohide:not(:hover):not(.has-focus) > form { display: none !important; }" : "") + "#qrtab { margin-bottom: 1px; }" : "") + "\n\n" + (_conf['Post Form Style'] !== 'float' && _conf["Post Form Slideout Transitions"] ? "#qr {  " + agent + "transition: " + agent + "transform .3s ease-in-out 1s;}#qr:hover,#qr.has-focus,#qr.dump {  " + agent + "transition: " + agent + "transform .3s linear;}#qrtab {  " + agent + "transition: opacity .3s ease-in-out 1s;}#qr:hover #qrtab {  " + agent + "transition: opacity .3s linear;}" : "") + "\n\n#qr .close {\n  float: right;\n  padding: 0 3px;\n}\n#qr .warning {\n  min-height: 1.6em;\n  vertical-align: middle;\n  padding: 0 1px;\n  border-width: 1px;\n  border-style: solid;\n}\n.persona {\n  width: 248px;\n  max-width: 100%;\n  min-width: 100%;\n}\n#dump-button {\n  width: 10%;\n  margin: 0;\n}\n\n" + (_conf['Compact Post Form Inputs'] ? ".persona input.field {  width: 29.6%;  margin: 0 0 0 0.4%;}#qr textarea.field {  height: 14.8em;  min-height: 9em;}#qr.has-captcha textarea.field {  height: 9em;}" : ".persona input.field {  width: 100%;}.persona input.field[name='name'] {  width: 89.6%;  margin: 0 0 0 0.4%;}#qr textarea.field {  height: 11.6em;  min-height: 6em;}#qr.has-captcha textarea.field {  height: 6em;}") + "\n\n" + (_conf["Tripcode Hider"] ? "input.field.tripped:not(:hover):not(:focus) {  color: transparent !important;  text-shadow: none !important;}" : "") + "\n\n#qr textarea {\n  resize: " + _conf['Textarea Resize'] + ";\n}\n.captcha-img {\n  margin: 1px 0 0;\n  text-align: center;\n  line-height: 0;\n}\n.captcha-img img {\n  width: 100%;\n  height: 4em;\n  width: 246px;\n}\n.captcha-input {\n  width: 100%;\n  margin: 1px 0 0;\n}\n.field,\n.selectrice,\nbutton,\ninput:not([type=radio]) {\n  " + Style.sizing + ": border-box;\n  font-size: " + (parseInt(_conf['Font Size'], 10)) + "px;\n  height: 1.6em;\n  margin: 1px 0 0;\n  vertical-align: bottom;\n  padding: 0 1px;\n}\n#qr textarea {\n  min-width: 100%;\n}\n#qr [type='submit'] {\n  width: 25%;\n}\n[type='file'] {\n  position: absolute;\n  opacity: 0;\n  z-index: -1;\n}\n#showQR {\n  display: " + (_conf["Hide Show Post Form"] ? "none" : "block") + ";\n  z-index: 4;\n  " + Style.sidebarLocation[0] + ": 2px;\n  width: " + width + "px;\n  background-color: transparent;\n  text-align: center;\n  position: fixed;\n  top: auto;\n}\n/* Fake File Input */\n#qr-filename,\n.has-file #qr-no-file {\n  display: none;\n}\n#qr-no-file,\n.has-file #qr-filename {\n  display: block;\n}\n#qr-filename-container {\n  " + Style.sizing + ": border-box;\n  display: inline-block;\n  position: relative;\n  width: 100px;\n  min-width: 74.6%;\n  max-width: 74.6%;\n  margin-right: 0.4%;\n  overflow: hidden;\n  padding: 2px 1px 0;\n}\n#qr-filerm {\n  position: absolute;\n  right: 3px;\n  top: 2px;\n  z-index: 2;\n}\n/* Thread Select / Spoiler Label */\n#qr-thread-select {\n  vertical-align: bottom;\n  width: 49%;\n  display: inline-block;\n}\n#qr-spoiler-label {\n  vertical-align: bottom;\n  width: 49%;\n  display: inline-block;\n  text-align: right;\n}\n/* Dumping UI */\n.dump #dump-list-container {\n  display: block;\n}\n#dump-list-container {\n  display: none;\n  position: relative;\n  overflow-y: hidden;\n  margin-top: 1px;\n}\n#dump-list {\n  overflow-x: auto;\n  overflow-y: hidden;\n  white-space: pre;\n  width: 248px;\n  max-width: 100%;\n  min-width: 100%;\n}\n#dump-list:hover {\n  overflow-x: auto;\n}\n.qr-preview {\n  " + Style.sizing + ": border-box;\n  counter-increment: thumbnails;\n  cursor: move;\n  display: inline-block;\n  height: 90px;\n  width: 90px;\n  padding: 2px;\n  opacity: .5;\n  overflow: hidden;\n  position: relative;\n  text-shadow: 0 1px 1px #000;\n  " + agent + "transition: opacity .25s ease-in-out;\n  vertical-align: top;\n}\n.qr-preview:hover,\n.qr-preview:focus {\n  opacity: .9;\n}\n.qr-preview::before {\n  content: counter(thumbnails);\n  color: #fff;\n  position: absolute;\n  top: 3px;\n  right: 3px;\n  text-shadow: 0 0 3px #000, 0 0 8px #000;\n}\n.qr-preview#selected {\n  opacity: 1;\n}\n.qr-preview.drag {\n  box-shadow: 0 0 10px rgba(0,0,0,.5);\n}\n.qr-preview.over {\n  border-color: #fff;\n}\n.qr-preview > span {\n  color: #fff;\n}\n.remove {\n  background: none;\n  color: #e00;\n  font-weight: 700;\n  padding: 3px;\n}\na:only-of-type > .remove {\n  display: none;\n}\n.remove:hover::after {\n  content: \" Remove\";\n}\n.qr-preview > label {\n  background: rgba(0,0,0,.5);\n  color: #fff;\n  right: 0; bottom: 0; left: 0;\n  position: absolute;\n  text-align: center;\n}\n.qr-preview > label > input {\n  margin: 0;\n}\n#add-post {\n  cursor: pointer;\n  font-size: 2em;\n  position: absolute;\n  top: 50%;\n  right: 10px;\n  " + agent + "transform: translateY(-50%);\n}\n/* Ads */\n.topad img,\n.middlead img,\n.bottomad img {\n  opacity: 0.3;\n  " + agent + "transition: opacity .3s linear;\n}\n.topad img:hover,\n.middlead img:hover,\n.bottomad img:hover {\n  opacity: 1;\n}\n" + (_conf["Block Ads"] ? "/* AdBlock Minus */.bottomad + hr,.topad img,.middlead img,.bottomad img {  display: none;}" : "") + "\n" + (_conf["Shrink Ads"] ? ".topad a img,.middlead a img,.bottomad a img {  width: 500px;  height: auto;}" : "") + "\n/* Options */\n#overlay {\n  position: fixed;\n  z-index: 30;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  background: rgba(0,0,0,.5);\n}\n#appchanx-settings {\n  width: auto;\n  left: 15%;\n  right: 15%;\n  top: 15%;\n  bottom: 15%;\n  position: fixed;\n  z-index: 31;\n  padding: .3em;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n}\n.description {\n  display: none;\n}\n#appchanx-settings h3,\n.section-keybinds,\n.section-mascots,\n.section-script,\n.style {\n  text-align: center;\n}\n.section-keybinds table,\n.section-script fieldset,\n.section-style fieldset {\n  text-align: left;\n}\n.section-keybinds table {\n  margin: auto;\n}\n#appchanx-settings fieldset {\n  padding: 5px 0;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n  vertical-align: top;\n  " + (_conf["Single Column Mode"] ? "margin: 0 auto 6px;" : "margin: 0 3px 6px;\n display: inline-block;") + "\n  border: 0;\n}\n.section-container {\n  overflow: auto;\n  position: absolute;\n  top: 1.7em;\n  right: 5px;\n  bottom: 5px;\n  left: 5px;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n}\n.sections-list {\n  padding: 0 3px;\n  float: left;\n}\n.sections-list > a {\n  cursor: pointer;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px 3px 0 0;" : "") + "\n  position: relative;\n  padding: 0 4px;\n  z-index: 1;\n  height: 1.4em;\n  display: inline-block;\n  border-width: 1px 1px 0 1px;\n  border-color: transparent;\n  border-style: solid;\n}\n.credits {\n  float: right;\n}\n#appchanx-settings h3 {\n  margin: 0;\n}\n.section-script fieldset > div,\n.section-style fieldset > div,\n.section-rice fieldset > div {\n  overflow: visible;\n  padding: 0 5px 0 7px;\n}\n#appchanx-settings tr:nth-of-type(2n+1),\n.section-script fieldset > div:nth-of-type(2n+1),\n.section-rice fieldset > div:nth-of-type(2n+1),\n.section-style fieldset > div:nth-of-type(2n+1),\n.section-keybinds tr:nth-of-type(2n+1),\n#selectrice li:nth-of-type(2n+1) {\n  background-color: rgba(0, 0, 0, 0.05);\n}\narticle li {\n  margin: 10px 0 10px 2em;\n}\n#appchanx-settings .option {\n  width: 50%;\n  display: inline-block;\n  vertical-align: bottom;\n}\n.option input {\n  width: 100%;\n}\n.optionlabel {\n  padding-left: 18px;\n}\n.rice + .optionlabel {\n  padding-left: 0;\n}\n.section-script fieldset,\n.styleoption {\n  text-align: left;\n}\n.section-style fieldset {\n  width: 370px;\n}\n.section-script fieldset {\n  width: 200px;\n}\n.suboptions,\n#mascotcontent,\n#themecontent {\n  overflow: auto;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 1.7em;\n  left: 0;\n}\n.mAlign {\n  height: 250px;\n  vertical-align: middle;\n  display: table-cell;\n}\n#themecontent {\n  top: 1.7em;\n}\n#save,\n.stylesettings {\n  position: absolute;\n  right: 10px;\n  bottom: 0;\n}\n.section-style .suboptions {\n  bottom: 0;\n}\n.section-container textarea {\n  font-family: monospace;\n  min-height: 350px;\n  resize: vertical;\n  width: 100%;\n}\n/* Hover Functionality */\n#mouseover {\n  z-index: 33;\n  position: fixed;\n  max-width: 70%;\n}\n#mouseover:empty {\n  display: none;\n}\n/* Mascot Tab */\n#mascot_hide {\n  padding: 3px;\n  position: absolute;\n  top: 2px;\n  right: 18px;\n}\n#mascot_hide .rice {\n  float: left;\n}\n#mascot_hide > div {\n  height: 0;\n  text-align: right;\n  overflow: hidden;\n}\n#mascot_hide:hover > div {\n  height: auto;\n}\n#mascot_hide label {\n  width: 100%;\n  display: block;\n  clear: both;\n  text-decoration: none;\n}\n.mascots {\n  padding: 0;\n  text-align: center;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n}\n.mascot,\n.mascotcontainer {\n  overflow: hidden;\n}\n.mascot {\n  position: relative;\n  border: none;\n  margin: 5px;\n  padding: 0;\n  width: 200px;\n  display: inline-block;\n  background-color: transparent;\n}\n.mascotcontainer {\n  height: 250px;\n  border: 0;\n  margin: 0;\n  max-height: 250px;\n  cursor: pointer;\n  bottom: 0;\n  border-width: 0 1px 1px;\n  border-style: solid;\n  border-color: transparent;\n  overflow: hidden;\n}\n.mascot img {\n  max-width: 200px;\n}\n.mascotname,\n.mascotoptions {\n  padding: 0;\n  width: 100%;\n}\n.mascot .mascotoptions {\nopacity: 0;\n  " + agent + "transition: opacity .3s linear;\n}\n.mascot:hover .mascotoptions {\n  opacity: 1;\n}\n.mascotoptions {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  left: 0;\n}\n.mascotoptions a {\n  display: inline-block;\n  width: 33%;\n}\n#upload {\n  position: absolute;\n  width: 100px;\n  left: 50%;\n  margin-left: -50px;\n  text-align: center;\n  bottom: 0;\n}\n#mascots_batch {\n  position: absolute;\n  left: 10px;\n  bottom: 0;\n}\n/* Themes Tab */\n#themes h1 {\n  position: absolute;\n  right: 300px;\n  bottom: 10px;\n  margin: 0;\n  " + agent + "transition: all .2s ease-in-out;\n  opacity: 0;\n}\n#themes .selectedtheme h1 {\n  right: 11px;\n  opacity: 1;\n}\n#themeContainer {\n  margin-bottom: 3px;\n}\n#addthemes {\n  position: absolute;\n  left: 10px;\n  bottom: 0;\n}\n.theme {\n  margin: 1em;\n}\n/* Theme Editor */\n#themeConf {\n  position: fixed;\n  " + Style.sidebarLocation[1] + ": 2px;\n  " + Style.sidebarLocation[0] + ": auto;\n  top: 0;\n  bottom: 0;\n  width: 296px;\n  z-index: 10;\n}\n#themebar input {\n  width: 30%;\n}\n.option .color {\n  width: 10%;\n  border-left: none !important;\n  color: transparent !important;\n}\n.option .colorfield {\n  width: 90%;\n}\n.themevar textarea {\n  min-width: 100%;\n  max-width: 100%;\n  height: 20em;\n  resize: vertical;\n}\n/* Mascot Editor */\n#mascotConf {\n  position: fixed;\n  height: 17em;\n  bottom: 0;\n  left: 50%;\n  width: 500px;\n  margin-left: -250px;\n  overflow: auto;\n  z-index: 10;\n}\n#mascotConf .option,\n#mascotConf .optionlabel {\n  " + Style.sizing + ": border-box;\n  width: 50%;\n  display: inline-block;\n  vertical-align: middle;\n}\n#mascotConf .option input {\n  width: 100%;\n}\n#close {\n  position: absolute;\n  left: 10px;\n  bottom: 0;\n}\n/* Catalog */\n#content .navLinks,\n#info .navLinks,\n.btn-wrap {\n  display: block;\n}\n.navLinks > .btn-wrap:not(:first-of-type)::before {\n  content: ' - ';\n}\n.button {\n  cursor: pointer;\n}\n#content .btn-wrap,\n#info .btn-wrap {\n  display: inline-block;\n}\n#settings .selectrice {\n  width: 100px;\n  display: inline-block;\n}\n#post-preview {\n  position: absolute;\n  z-index: 22;\n  " + (_conf["Rounded Edges"] ? "border-radius: 3px;" : "") + "\n}\n#settings,\n#threads,\n#info .navLinks,\n#content .navLinks {\n  text-align: center;\n}\n#threads .thread {\n  vertical-align: top;\n  display: inline-block;\n  word-wrap: break-word;\n  overflow: hidden;\n  margin-top: 5px;\n  padding: 5px 0 3px;\n  text-align: center;\n}\n.extended-small .thread,\n.small .thread {\n  width: 165px;\n  max-height: 320px;\n}\n.small .teaser,\n.large .teaser {\n  display: none;\n}\n.extended-large .thread,\n.large .thread {\n  width: 270px;\n  max-height: 410px;\n}\n.extended-small .thumb,\n.small .thumb {\n  max-width: 150px;\n  max-height: 150px;\n}\n/* Front Page */\n#logo {\n  text-align: center;\n}\n#doc {\n  margin: 0 auto;\n  width: 1000px;\n  position: relative;\n}\n#boards .boxcontent {\n  vertical-align: top;\n  text-align: center;\n}\n#filter-container,\n#options-container {\n  float: right;\n  position: relative;\n}\n#optionssmenu {\n  top: 100% !important;\n  left: 0 !important;\n}\n#boards .column {\n  " + Style.sizing + ": border-box;\n  display: inline-block;\n  width: 16em;\n  text-align: left;\n  vertical-align: top;\n}\n.bd ul,\n.boxcontent ul {\n  vertical-align: top;\n  padding: 0;\n}\n.right-box .boxcontent ul {\n  padding: 0 10px;\n}\n.yuimenuitem,\n.boxcontent li {\n  list-style-type: none;\n}\n.bd ul {\n  margin: 0;\n}\n.yuimenuitem::before {\n  content: \" [ ] \";\n  font-family: monospace;\n}\n.yuimenuitem-checked::before {\n  content: \" [x] \"\n}\n.yui-u {\n  display: inline-block;\n  vertical-align: top;\n  width: 475px;\n  margin: 10px;\n}\n#recent-images .boxcontent {\n  text-align: center;\n}\n#ft {\n  text-align: center;\n}\n#ft ul {\n  padding: 0;\n}\n#ft li {\n  list-style-type: none;\n  display: inline-block;\n  width: 100px;\n}\n#preview-tooltip-nws,\n#preview-tooltip-ws,\n#ft .fill,\n.clear-bug {\n  display: none;\n}";
    },
    theme: function(theme) {
      var agent, background, backgroundC, bgColor, css, fileHeading, icons, replyHeading, _conf;

      _conf = Conf;
      agent = Style.agent;
      bgColor = new Style.color(Style.colorToHex(backgroundC = theme["Background Color"]) || 'aaaaaa');
      Style.lightTheme = bgColor.isLight();
      icons = "data:image/png;base64," + Icons[_conf["Icons"]];
      css = ".hide_thread_button span > span,\n.hide_reply_button span > span {\n  background-color: " + theme["Links"] + ";\n}\n#mascot_hide label {\n  border-bottom: 1px solid " + theme["Reply Border"] + ";\n}\n#content .thumb {\n  box-shadow: 0 0 5px " + theme["Reply Border"] + ";\n}\n.mascotname,\n.mascotoptions {\n  background: " + theme["Dialog Background"] + ";\n  border: 1px solid " + theme["Buttons Border"] + ";\n}\n.opContainer.filter_highlight {\n  box-shadow: inset 5px 0 " + theme["Backlinked Reply Outline"] + ";\n}\n.filter_highlight > .reply {\n  box-shadow: -5px 0 " + theme["Backlinked Reply Outline"] + ";\n}\nhr {\n  border-bottom: 1px solid " + theme["Reply Border"] + ";\n}\na[style=\"cursor: pointer; float: right;\"] + div[style^=\"width: 100%;\"] > table > tbody > tr > td {\n  background: " + backgroundC + " !important;\n  border: 1px solid " + theme["Reply Border"] + " !important;\n}\n#fs_status {\n  background: " + theme["Dialog Background"] + " !important;\n}\n#fs_data tr[style=\"background-color: #EA8;\"] {\n  background: " + theme["Reply Background"] + " !important;\n}\n#fs_data,\n#fs_data * {\n  border-color: " + theme["Reply Border"] + " !important;\n}\nhtml {\n  background: " + (backgroundC || '') + ";\n  background-image: " + (theme["Background Image"] || '') + ";\n  background-repeat: " + (theme["Background Repeat"] || '') + ";\n  background-attachment: " + (theme["Background Attachment"] || '') + ";\n  background-position: " + (theme["Background Position"] || '') + ";\n}\n.section-container,\n#exlinks-options-content,\n#mascotcontent,\n#themecontent {\n  background: " + backgroundC + ";\n  border: 1px solid " + theme["Reply Border"] + ";\n  padding: 5px;\n}\n.sections-list > a.tab-selected {\n  background: " + backgroundC + ";\n  border-color: " + theme["Reply Border"] + ";\n  border-style: solid;\n}\n.captcha-img img {\n  " + (Style.filter(theme["Text"], theme["Input Background"])) + "\n}\n#boardTitle,\n#prefetch,\n#showQR,\n" + (!_conf["Post Form Decorations"] ? '#spoilerLabel,' : '') + "\n#thread-stats {\n  text-shadow:\n     1px  1px 0 " + backgroundC + ",\n    -1px -1px 0 " + backgroundC + ",\n     1px -1px 0 " + backgroundC + ",\n    -1px  1px 0 " + backgroundC + ",\n     0    1px 0 " + backgroundC + ",\n     0   -1px 0 " + backgroundC + ",\n     1px  0   0 " + backgroundC + ",\n    -1px  0   0 " + backgroundC + "\n    " + (_conf["Sidebar Glow"] ? ", 0 2px 5px " + theme['Text'] + ";" : ";") + "\n}\n/* Fixes text spoilers */\n" + (_conf['Remove Spoilers'] && _conf['Indicate Spoilers'] ? ".spoiler::before,s::before {  content: '[spoiler]';}.spoiler::after,s::after {  content: '[/spoiler]';}" : !_conf['Remove Spoilers'] ? ".spoiler:not(:hover) *,s:not(:hover) * {  color: rgb(0,0,0) !important;  text-shadow: none !important;}.spoiler:not(:hover),s:not(:hover) {  background-color: rgb(0,0,0);  color: rgb(0,0,0) !important;  text-shadow: none !important;}" : "") + "\n#exlinks-options,\n#appchanx-settings,\n#qrtab,\n" + (_conf["Post Form Decorations"] ? "#qr," : "") + "\n#updater,\ninput[type=\"submit\"],\ninput[value=\"Report\"],\nspan[style=\"left: 5px; position: absolute;\"] a {\n  background: " + theme["Buttons Background"] + ";\n  border: 1px solid " + theme["Buttons Border"] + ";\n}\n.enabled .mascotcontainer {\n  background: " + theme["Buttons Background"] + ";\n  border-color: " + theme["Buttons Border"] + ";\n}\n#dump,\n#qr-filename-container,\n#appchanx-settings input,\n.captcha-img,\n.dump #dump:not(:hover):not(:focus),\n.qr-preview,\n.selectrice,\nbutton,\ninput,\ntextarea {\n  background: " + theme["Input Background"] + ";\n  border: 1px solid " + theme["Input Border"] + ";\n  color: " + theme["Inputs"] + ";\n}\n#dump:hover,\n#qr-filename-container:hover,\n#qr-filename-container:hover,\n.selectrice:hover,\n#selectrice li:hover,\n#selectrice li:nth-of-type(2n+1):hover,\ninput:hover,\ntextarea:hover {\n  background: " + theme["Hovered Input Background"] + ";\n  border-color: " + theme["Hovered Input Border"] + ";\n  color: " + theme["Inputs"] + ";\n}\n#dump:active,\n#dump:focus,\n#selectrice li:focus,\n.selectrice:focus,\n#qr-filename-container:active,\n#qr-filename-container:focus,\ninput:focus,\ntextarea:focus,\ntextarea.field:focus {\n  background: " + theme["Focused Input Background"] + ";\n  border-color: " + theme["Focused Input Border"] + ";\n  color: " + theme["Inputs"] + ";\n  outline: none;\n}\n#mouseover,\n#post-preview,\n#qp .post,\n#xupdater,\n.reply.post {\n  border-width: 1px;\n  border-style: solid;\n  border-color: " + theme["Reply Border"] + ";\n  background: " + theme["Reply Background"] + ";\n}\n.thread > .replyContainer > .reply.post {\n  border-width: " + (_conf['Post Spacing'] === "0" ? "1px 1px 0 1px" : '1px') + ";\n}\n.exblock.reply,\n.reply.post.highlight,\n.reply.post:target {\n  background: " + theme["Highlighted Reply Background"] + ";\n  border: 1px solid " + theme["Highlighted Reply Border"] + ";\n}\n#boardNavDesktop,\n.pagelist {\n  background: " + theme["Navigation Background"] + ";\n  border-style: solid;\n  border-color: " + theme["Navigation Border"] + ";\n}\n.thread {\n  background: " + theme["Thread Wrapper Background"] + ";\n  border: 1px solid " + theme["Thread Wrapper Border"] + ";\n}\n#boardNavDesktopFoot,\n#mascotConf,\n#mascot_hide,\n#menu,\n#selectrice,\n#themeConf,\n#watcher,\n#watcher:hover,\n.notification,\n.submenu,\na[style=\"cursor: pointer; float: right;\"] ~ div[style^=\"width: 100%;\"] > table {\n  background: " + theme["Dialog Background"] + ";\n  border: 1px solid " + theme["Dialog Border"] + ";\n}\n.deleteform::before,\n.deleteform,\n#qr .warning {\n  background: " + theme["Input Background"] + ";\n  border-color: " + theme["Input Border"] + ";\n}\n.disabledwarning,\n.warning {\n  color: " + theme["Warnings"] + ";\n}\n#navlinks a:first-of-type {\n  border-bottom: 11px solid rgb(130,130,130);\n}\n#navlinks a:last-of-type {\n  border-top: 11px solid rgb(130,130,130);\n}\n#charCount {\n  color: " + (Style.lightTheme ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)") + ";\n}\n.postNum a {\n  color: " + theme["Post Numbers"] + ";\n}\n.subject {\n  color: " + theme["Subjects"] + " !important;\n}\n.dateTime,\n.post-ago {\n  color: " + theme["Timestamps"] + " !important;\n}\n#fs_status a,\n#updater #count:not(.new)::after,\n#showQR,\n#updater,\n.abbr,\n.boxbar,\n.boxcontent,\n.deleteform::before,\n.pages strong,\n.pln,\n.reply,\n.reply.highlight,\n.summary,\nbody,\nbutton,\nspan[style=\"left: 5px; position: absolute;\"] a,\ninput,\ntextarea {\n  color: " + theme["Text"] + ";\n}\n#exlinks-options-content > table,\n#appchanx-settings fieldset,\n#selectrice {\n  border-bottom: 1px solid " + theme["Reply Border"] + ";\n  box-shadow: inset " + theme["Shadow Color"] + " 0 0 5px;\n}\n.quote + .spoiler:hover,\n.quote {\n  color: " + theme["Greentext"] + ";\n}\n.forwardlink {\n  text-decoration: " + (_conf["Underline Links"] ? "underline" : "none") + ";\n  border-bottom: 1px dashed " + theme["Backlinks"] + ";\n}\n.container::before {\n  color: " + theme["Timestamps"] + ";\n}\n#menu,\n#post-preview,\n#qp .opContainer,\n#qp .replyContainer,\n.submenu {\n  box-shadow: " + (_conf['Quote Shadows'] ? "5px 5px 5px " + theme['Shadow Color'] : "") + ";\n}\n.rice {\n  background: " + theme["Checkbox Background"] + ";\n  border: 1px solid " + theme["Checkbox Border"] + ";\n}\n.selectrice::before {\n  border-left: 1px solid " + theme["Input Border"] + ";\n}\n.selectrice::after {\n  border-top: .45em solid " + theme["Inputs"] + ";\n}\n#updater input,\n.bd {\n  background: " + theme["Buttons Background"] + ";\n  border: 1px solid " + theme["Buttons Border"] + ";\n}\n.pages a,\n#boardNavDesktop a {\n  color: " + theme["Navigation Links"] + ";\n}\ninput[type=checkbox]:checked + .rice {\n  position: relative;\n}\ninput[type=checkbox]:checked + .rice::after {\n  content: \"\";\n  display: block;\n  width: 5px;\n  height: 12px;\n  border-radius: 1px;\n  border: solid rgb(50, 50, 50);\n  border-width: 0 3px 3px 0;\n  " + agent + "transform: rotate(45deg);\n  position: absolute;\n  left: 2px;\n  bottom: -1px;\n  " + (!Style.lightTheme ? "filter: url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='filters' color-interpolation-filters='sRGB'><feColorMatrix values='-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0' /></filter></svg>#filters\");" : "") + "\n}\n#addReply,\n#dump,\n.button,\n.entry,\n.replylink,\na {\n  color: " + theme["Links"] + ";\n}\n.backlink {\n  color: " + theme["Backlinks"] + ";\n}\n.qiQuote,\n.quotelink {\n  color: " + theme["Quotelinks"] + ";\n}\n#addReply:hover,\n#dump:hover,\n.entry:hover,\n.sideArrows a:hover,\n.replylink:hover,\n.qiQuote:hover,\n.quotelink:hover,\na .name:hover,\na .postertrip:hover,\na:hover {\n  color: " + theme["Hovered Links"] + ";\n}\n#boardNavDesktop a:hover,\n#boardTitle a:hover {\n  color: " + theme["Hovered Navigation Links"] + ";\n}\n#boardTitle {\n  color: " + theme["Board Title"] + ";\n}\n.name,\n.post-author {\n  color: " + theme["Names"] + " !important;\n}\n.post-tripcode,\n.postertrip,\n.trip {\n  color: " + theme["Tripcodes"] + " !important;\n}\na .postertrip,\na .name {\n  color: " + theme["Emails"] + ";\n}\n.post.reply.qphl,\n.post.op.qphl {\n  border-color: " + theme["Backlinked Reply Outline"] + ";\n  background: " + theme["Highlighted Reply Background"] + ";\n}\n.inline .post {\n  box-shadow: " + (_conf['Quote Shadows'] ? "5px 5px 5px " + theme['Shadow Color'] : "") + ";\n}\n.placeholder,\n#qr input::" + agent + "placeholder,\n#qr textarea::" + agent + "placeholder {\n  color: " + (Style.lightTheme ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)") + " !important;\n}\n#qr input:" + agent + "placeholder,\n#qr textarea:" + agent + "placeholder,\n.placeholder {\n  color: " + (Style.lightTheme ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)") + " !important;\n}\n#appchanx-settings fieldset,\n.boxcontent dd,\n.selectrice ul {\n  border-color: " + (Style.lightTheme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)") + ";\n}\n#appchanx-settings li,\n#selectrice li:not(:first-of-type) {\n  border-top: 1px solid " + (Style.lightTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.025)") + ";\n}\n#navtopright .exlinksOptionsLink::after,\n#appchanOptions,\n.navLinks > a:first-of-type::after,\n#watcher::after,\n#globalMessage::after,\n#boardNavDesktopFoot::after,\na[style=\"cursor: pointer; float: right;\"]::after,\n#img-controls,\n#catalog::after,\n#fappeTyme {\n  background-image: url('" + icons + "');\n" + (!Style.lightTheme ? "filter: url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='filters' color-interpolation-filters='sRGB'><feColorMatrix values='-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0' /></filter></svg>#filters\");" : "") + "\n}\n" + theme["Custom CSS"];
      css += (Style.lightTheme ? ".prettyprint {\n  background-color: #e7e7e7;\n  border: 1px solid #dcdcdc;\n}\n.com {\n  color: #dd0000;\n}\n.str,\n.atv {\n  color: #7fa61b;\n}\n.pun {\n  color: #61663a;\n}\n.tag {\n  color: #117743;\n}\n.kwd {\n  color: #5a6F9e;\n}\n.typ,\n.atn {\n  color: #9474bd;\n}\n.lit {\n  color: #368c72;\n}\n" : ".prettyprint {\n  background-color: rgba(0,0,0,.1);\n  border: 1px solid rgba(0,0,0,0.5);\n}\n.tag {\n  color: #96562c;\n}\n.pun {\n  color: #5b6f2a;\n}\n.com {\n  color: #a34443;\n}\n.str,\n.atv {\n  color: #8ba446;\n}\n.kwd {\n  color: #987d3e;\n}\n.typ,\n.atn {\n  color: #897399;\n}\n.lit {\n  color: #558773;\n}\n");
      if (_conf["Alternate Post Colors"]) {
        css += ".replyContainer:not(.hidden):nth-of-type(2n+1) .post {\n  background-image: " + agent + "linear-gradient(" + (Style.lightTheme ? "rgba(0,0,0,0.05), rgba(0,0,0,0.05)" : "rgba(255,255,255,0.02), rgba(255,255,255,0.02)") + ");\n}\n";
      }
      if (_conf["Color Reply Headings"]) {
        css += ".postInfo {\n  background: " + ((replyHeading = new Style.color(Style.colorToHex(theme["Reply Background"]))) ? "rgba(" + (replyHeading.shiftRGB(-12, false)) + ",0.8)" : "rgba(0,0,0,0.1)") + ";\n  border-bottom: 1px solid " + theme["Reply Border"] + "\n}\n";
      }
      if (_conf["Color File Info"]) {
        css += ".file {\n  background: " + ((fileHeading = new Style.color(Style.colorToHex(theme["Reply Background"]))) ? "rgba(" + (fileHeading.shiftRGB(-8, false)) + ",0.8)" : "rgba(0,0,0,0.1)") + ";\n  border-bottom: 1px solid " + theme["Reply Border"] + "\n}\n";
      }
      if (_conf["OP Background"]) {
        css += ".op.post {\n  background: " + theme["Reply Background"] + ";\n  border: 1px solid " + theme["Reply Border"] + ";\n}\n.op.post:target\n.op.post.highlight {\n  background: " + theme["Highlighted Reply Background"] + ";\n  border: 1px solid " + theme["Highlighted Reply Border"] + ";\n}\n";
      }
      if (_conf["4chan SS Sidebar"]) {
        background = new Style.color(Style.colorToHex(theme["Reply Background"]));
        css += "body::before {\n  z-index: -1;\n  background: none repeat scroll 0% 0% rgba(" + (background.shiftRGB(-18)) + ", 0.8);\n  border-" + Style.sidebarLocation[1] + ": 2px solid " + backgroundC + ";\n  box-shadow:\n    " + (_conf["Sidebar Location"] === "right" ? "inset" : "") + "  1px 0 0 " + theme["Thread Wrapper Border"] + ",\n    " + (_conf["Sidebar Location"] === "left" ? "inset" : "") + " -1px 0 0 " + theme["Thread Wrapper Border"] + ";\n}\n";
      }
      css += {
        text: "a.useremail[href*=\"sage\"]:last-of-type::" + _conf["Sage Highlight Position"] + ",\na.useremail[href*=\"Sage\"]:last-of-type::" + _conf["Sage Highlight Position"] + ",\na.useremail[href*=\"SAGE\"]:last-of-type::" + _conf["Sage Highlight Position"] + " {\n  content: \" (sage) \";\n  color: " + theme["Sage"] + ";\n}\n",
        image: "a.useremail[href*=\"sage\"]:last-of-type::" + _conf["Sage Highlight Position"] + ",\na.useremail[href*=\"Sage\"]:last-of-type::" + _conf["Sage Highlight Position"] + ",\na.useremail[href*=\"SAGE\"]:last-of-type::" + _conf["Sage Highlight Position"] + " {\n  content: url(\"data:image/png;base64,A4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=\");\n  vertical-align: top;\n  margin-" + (_conf["Sage Highlight Position"] === "before" ? "right" : "left") + ": " + (parseInt(_conf['Emoji Spacing'])) + "px;\n}\n",
        none: ""
      }[_conf["Sage Highlighting"]];
      if (_conf["Announcements"] === "slideout") {
        css += "#globalMessage {\n  background: " + theme["Dialog Background"] + ";\n  border: 1px solid " + theme["Dialog Border"] + ";\n}\n";
      }
      if (_conf["Post Form Decorations"]) {
        css += "#qr {\n  border-color: " + theme["Buttons Border"] + ";\n  background: " + backgroundC + ";\n  box-shadow: " + (_conf['Quote Shadows'] ? "5px 5px 5px " + theme['Shadow Color'] : "") + ";\n}\n";
      }
      return css;
    },
    iconPositions: function() {
      var align, aligner, css, i, iconOffset, navlinks, notCatalog, notEither, position, _conf;

      css = "#navtopright .exlinksOptionsLink::after,\n#appchanOptions,\nbody > div.navLinks > a:first-of-type::after,\n" + (Conf['Slideout Watcher'] ? '#watcher::after,' : '') + "\n" + (Conf['Announcements'] === 'slideout' ? '#globalMessage::after,' : '') + "\n#boardNavDesktopFoot::after,\nbody > a[style=\"cursor: pointer; float: right;\"]::after,\n#img-controls,\n#catalog::after,\n#fappeTyme {\n  z-index: 18;\n  position: fixed;\n  display: block;\n  width: 15px;\n  height: 15px;\n  content: \"\";\n  opacity: " + (Conf['Invisible Icons'] ? 0 : 0.5) + ";\n}\n#navtopright .exlinksOptionsLink,\nbody > div.navLinks > a:first-of-type,\n" + (Conf['Slideout Watcher'] ? '#watcher,' : '') + "\n" + (Conf['Announcements'] === 'slideout' ? '#globalMessage,' : '') + "\n#boardNavDesktopFoot,\nbody > a[style=\"cursor: pointer; float: right;\"],\n#catalog {\n  z-index: 16;\n}\n#navtopright .exlinksOptionsLink:hover,\nbody > div.navLinks > a:first-of-type:hover,\n" + (Conf['Slideout Watcher'] ? '#watcher:hover,' : '') + "\n" + (Conf['Announcements'] === 'slideout' ? '#globalMessage:hover,' : '') + "\n#boardNavDesktopFoot:hover,\nbody > a[style=\"cursor: pointer; float: right;\"]:hover,\n#img-controls,\n#catalog:hover {\n  z-index: 17;\n}\n#appchanOptions {\n  visibility: visible;\n  background-position: 0 0;\n}\nbody > div.navLinks > a:first-of-type::after {\n  cursor: pointer;\n  background-position: 0 -15px;\n}\n#watcher::after {\n  background-position: 0 -30px;\n}\n#globalMessage::after {\n  background-position: 0 -45px;\n}\n#boardNavDesktopFoot::after {\n  background-position: 0 -60px;\n}\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  visibility: visible;\n  cursor: pointer;\n  background-position: 0 -75px;\n}\n#img-controls {\n  background-position: 0 -90px;\n}\n#navtopright .exlinksOptionsLink::after {\n  background-position: 0 -105px;\n}\n#catalog::after {\n  visibility: visible;\n  background-position: 0 -120px;\n}\n#fappeTyme {\n  background-position: 0 -135px;\n}\n#boardNavDesktopFoot:hover::after,\n#globalMessage:hover::after,\n#img-controls:hover,\n#navlinks a:hover,\n#appchanOptions:hover,\n#navtopright .exlinksOptionsLink:hover::after,\n#qr #qrtab,\n#watcher:hover::after,\n.thumbnail#selected,\nbody > a[style=\"cursor: pointer; float: right;\"]:hover::after,\ndiv.navLinks > a:first-of-type:hover::after,\n#catalog:hover::after,\n#fappeTyme:hover {\n  opacity: 1;\n}";
      i = 0;
      align = Style.sidebarLocation[0];
      _conf = Conf;
      notCatalog = g.VIEW !== 'catalog';
      notEither = notCatalog && g.BOARD !== 'f';
      aligner = function(first, checks) {
        var enabled, position, _i, _len;

        position = [first];
        for (_i = 0, _len = checks.length; _i < _len; _i++) {
          enabled = checks[_i];
          position.push(enabled ? first += 19 : first);
        }
        return position;
      };
      if (_conf["Icon Orientation"] === "horizontal") {
        position = aligner(2, [true, _conf['Slideout Navigation'] !== 'hide', _conf['Announcements'] === 'slideout' && $('#globalMessage', d.body), notCatalog && _conf['Slideout Watcher'] && _conf['Thread Watcher'], $('#navtopright .exlinksOptionsLink', d.body), notCatalog && $('body > a[style="cursor: pointer; float: right;"]', d.body), notEither && _conf['Image Expansion'], notEither, g.VIEW === 'thread', notEither && _conf['Fappe Tyme'], navlinks = ((g.VIEW !== 'thread' && _conf['Index Navigation']) || (g.VIEW === 'thread' && _conf['Reply Navigation'])) && notCatalog, navlinks]);
        iconOffset = position[position.length - 1] - (_conf['4chan SS Navigation'] ? 0 : Style.sidebar + parseInt(_conf["Right Thread Padding"], 10));
        if (iconOffset < 0) {
          iconOffset = 0;
        }
        css += "/* 4chan X Options */\n#appchanOptions {\n  " + align + ": " + position[i++] + "px;\n}\n/* Slideout Navigation */\n#boardNavDesktopFoot::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Global Message */\n#globalMessage::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Watcher */\n#watcher::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* ExLinks */\n#navtopright .exlinksOptionsLink::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* 4sight */\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Expand Images */\n#img-controls {\n  " + align + ": " + position[i++] + "px;\n}\n/* 4chan Catalog */\n#catalog::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Back */\ndiv.navLinks > a:first-of-type::after {\n  " + align + ": " + position[i++] + "px;\n}\n/* Fappe Tyme */\n#fappeTyme {\n  " + align + ": " + position[i++] + "px;\n}\n/* Thread Navigation Links */\n#navlinks a {\n  margin: 2px;\n  top: 1px;\n}\n#navlinks a:last-of-type {\n  " + align + ": " + position[i++] + "px;\n}\n#navlinks a:first-of-type {\n  " + align + ": " + position[i++] + "px;\n}\n#prefetch {\n  width: " + (248 + Style.sidebarOffset.W) + "px;\n  " + align + ": 2px;\n  top: 1.6em;\n  text-align: " + Style.sidebarLocation[1] + ";\n}\n#boardNavDesktopFoot::after,\n#navtopright .exlinksOptionsLink::after,\n#appchanOptions,\n#watcher::after,\n#globalMessage::after,\n#img-controls,\n#fappeTyme,\ndiv.navLinks > a:first-of-type::after,\n#catalog::after,\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  top: 1px !important;\n}\n" + (_conf["Announcements"] === "slideout" ? "#globalMessage," : "") + "\n" + (_conf["Slideout Watcher"] ? "#watcher," : "") + "\n#boardNavDesktopFoot {\n  top: 16px !important;\n}\n" + (_conf['Boards Navigation'] === 'top' || _conf['Boards Navigation'] === 'sticky top' ? '#boardNavDesktop' : _conf['Pagination'] === 'top' || _conf['Pagination'] === 'sticky top' ? '.pagelist' : void 0) + " {\n  " + (_conf['4chan SS Navigation'] ? "padding-" + align + ": " + iconOffset + "px;" : "margin-" + align + ": " + iconOffset + "px;") + "\n}\n";
        if (_conf["Updater Position"] !== 'moveable') {
          css += "/* Updater + Stats */\n#updater,\n#thread-stats {\n  " + align + ": " + (_conf["Updater Position"] === "bottom" && !_conf["Hide Delete UI"] ? 23 : 2) + "px !important;\n  " + Style.sidebarLocation[1] + ": auto !important;\n  top: auto !important;\n  bottom: auto !important;\n  " + (_conf["Updater Position"] === 'top' ? "top: 16px !important" : "bottom: 0 !important") + ";\n}";
        }
      } else {
        position = aligner(2 + (_conf["4chan Banner"] === "at sidebar top" ? Style.logoOffset + 19 : 0), [notEither && _conf['Image Expansion'], true, _conf['Slideout Navigation'] !== 'hide', _conf['Announcements'] === 'slideout' && $('#globalMessage', d.body), notCatalog && _conf['Slideout Watcher'] && _conf['Thread Watcher'], notCatalog && $('body > a[style="cursor: pointer; float: right;"]', d.body), $('#navtopright .exlinksOptionsLink', d.body), notEither, g.VIEW === 'thread', notEither && _conf['Fappe Tyme'], navlinks = ((g.VIEW !== 'thread' && _conf['Index Navigation']) || (g.VIEW === 'thread' && _conf['Reply Navigation'])) && notCatalog, navlinks]);
        iconOffset = (g.VIEW === 'thread' && _conf['Prefetch'] ? 250 + Style.sidebarOffset.W : 20 + (g.VIEW === 'thread' && _conf['Updater Position'] === 'top' ? 100 : 0)) - (_conf['4chan SS Navigation'] ? 0 : Style.sidebar + parseInt(_conf[align.capitalize() + " Thread Padding"], 10));
        css += "/* Expand Images */\n#img-controls {\n  top: " + position[i++] + "px;\n}\n/* 4chan X Options */\n#appchanOptions {\n  top: " + position[i++] + "px;\n}\n/* Slideout Navigation */\n#boardNavDesktopFoot,\n#boardNavDesktopFoot::after {\n  top: " + position[i++] + "px;\n}\n/* Global Message */\n#globalMessage,\n#globalMessage::after {\n  top: " + position[i++] + "px;\n}\n/* Watcher */\n" + (_conf["Slideout Watcher"] ? "#watcher, #watcher::after" : "") + " {\n  top: " + position[i++] + "px !important;\n}\n/* 4sight */\nbody > a[style=\"cursor: pointer; float: right;\"]::after {\n  top: " + position[i++] + "px;\n}\n/* ExLinks */\n#navtopright .exlinksOptionsLink::after {\n  top: " + position[i++] + "px;\n}\n/* 4chan Catalog */\n#catalog::after {\n  top: " + position[i++] + "px;\n}\n/* Back */\ndiv.navLinks > a:first-of-type::after {\n  top: " + position[i++] + "px;\n}\n/* Fappe Tyme */\n#fappeTyme {\n  top: " + position[i++] + "px;\n}\n/* Thread Navigation Links */\n#navlinks a:first-of-type {\n  top: " + position[i++] + "px !important;\n}\n#navlinks a:last-of-type {\n  top: " + position[i++] + "px !important;\n}\n#prefetch {\n  width: " + (248 + Style.sidebarOffset.W) + "px;\n  " + align + ": 2px;\n  top: 0;\n  text-align: " + Style.sidebarLocation[1] + ";\n}\n#navlinks a,\n#navtopright .exlinksOptionsLink::after,\n#appchanOptions,\n#boardNavDesktopFoot::after,\n#globalMessage::after,\n#img-controls,\n#fappeTyme,\n" + (_conf["Slideout Watcher"] ? "#watcher::after," : "") + "\nbody > a[style=\"cursor: pointer; float: right;\"]::after,\n#catalog::after,\ndiv.navLinks > a:first-of-type::after {\n  " + align + ": 3px !important;\n}\n#boardNavDesktopFoot,\n#globalMessage,\n#watcher {\n  width: " + (233 + Style.sidebarOffset.W) + "px !important;\n  " + align + ": 18px !important;\n}\n" + (_conf['Boards Navigation'] === 'top' || _conf['Boards Navigation'] === 'sticky top' ? '#boardNavDesktop' : _conf['Pagination'] === 'top' || _conf['Pagination'] === 'sticky top' ? '.pagelist' : void 0) + " {\n  " + (_conf['4chan SS Navigation'] ? "padding-" + align + ": " + iconOffset + "px;" : "margin-" + align + ": " + iconOffset + "px;") + "\n}";
        if (_conf["Updater Position"] !== 'moveable') {
          css += "/* Updater + Stats */\n#updater,\n#thread-stats {\n  " + align + ": " + (_conf["Updater Position"] === "top" || !_conf["Hide Delete UI"] ? 23 : 2) + "px !important; \n  " + Style.sidebarLocation[1] + ": auto !important;\n  top: " + (_conf["Updater Position"] === "top" ? "-1px" : "auto") + " !important;\n  bottom: " + (_conf["Updater Position"] === "bottom" ? "-2px" : "auto") + " !important;\n}";
        }
      }
      return Style.icons.textContent = css;
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
      if (Style.padding.pages && (_conf["Pagination"] === "sticky top" || _conf["Pagination"] === "sticky bottom")) {
        css += "  " + Style.padding.pages.property + ": " + Style.padding.pages.offsetHeight + "px !important;\n";
      }
      if (_conf["Boards Navigation"] === "sticky top" || _conf["Boards Navigation"] === "sticky bottom") {
        css += "  " + Style.padding.nav.property + ": " + Style.padding.nav.offsetHeight + "px !important;\n";
      }
      css += "}\nbody {\n  padding-bottom: 0;\n";
      if ((Style.padding.pages != null) && (_conf["Pagination"] === "sticky top" || _conf["Pagination"] === "sticky bottom" || _conf["Pagination"] === "top")) {
        css += "  padding-" + Style.padding.pages.property + ": " + Style.padding.pages.offsetHeight + "px;\n";
      }
      if (_conf["Boards Navigation"] !== "hide") {
        css += "  padding-" + Style.padding.nav.property + ": " + Style.padding.nav.offsetHeight + "px;\n";
      }
      css += "}";
      return sheet.textContent = css;
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
    }
  };

  Emoji = {
    init: function() {
      return Emoji.icons.not.push(['PlanNine', Emoji.icons.not[0][1]]);
    },
    css: function(position) {
      var category, css, icon, key, margin, name, _conf, _i, _len, _ref;

      _conf = Conf;
      css = [];
      margin = "margin-" + (position === "before" ? "right" : "left") + ": " + (parseInt(_conf['Emoji Spacing'])) + "px;";
      _ref = Emoji.icons;
      for (key in _ref) {
        category = _ref[key];
        if ((_conf['Emoji'] !== "disable ponies" && key === "pony") || (_conf['Emoji'] !== "only ponies" && key === "not")) {
          for (_i = 0, _len = category.length; _i < _len; _i++) {
            icon = category[_i];
            name = icon[0];
            css[css.length] = "a.useremail[href*='" + name + "']:last-of-type::" + position + ",\na.useremail[href*='" + (name.toLowerCase()) + "']:last-of-type::" + position + ",\na.useremail[href*='" + (name.toUpperCase()) + "']:last-of-type::" + position + " {\ncontent: url('data:image/png;base64," + icon[1] + "');\nvertical-align: top;\n" + margin + "\n}\n";
          }
        }
      }
      return css.join("");
    },
    icons: {
      pony: [['Pinkie', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3dJREFUGBlNwUtoXFUcB+Df/zzuY553pp2MmUwSk5TGpnamiokWRdNCSkCrUChKCnVZQUEUdy5sQZC6cyd2VWgoutCFXWTjIyp1UdqmEDBRsSZNmkmaZF6Zx32ccyzowu8j/M883pH5A9kBYfNkFOpu0OiulyqXmnhkDmdYHYJexzX1Ef51EQDhP9fxpjU0PDCd7IldYIxGVag3/KZ/ZX1p8/P0k/0U47qs291M2NS3f6ncuLeFeQ3A8KuYoNPoY/3e2Ej6scSnqUJ8gksmhC2y3OJHpSUHU0/3HU+WCuddyV6VSpVyYv/aUuPefWAP4iDG8AhJWyYYo972tg8DQ1wyWHGZSfcmZmQ+YeKTw1bQ70H8uJw3xtDp6NzG15VLf/DLWMBZHGPkwuWGyq7njLoZyzAiCtqRIddioifBxYBHIpeE0oaw0yoG7WA755dvi8Xih66BOSZj4rwds45bSQkuOeOCQYWG2PjjcEq94JwjQgQ+kCW+tBl3H7Ym4jnbE/nDmamwqz9mnEaYoBgiZaJIGW5zEIHEPheykMD2w12ztPIXCrZHec+GdOVAUI8ygjvifeHQESiNoKtMlIoRxSV0owMjAeY5+P3BKrbTDq3n02B/7yDTDkBANSXiewKgjFbahEwQe34IiVIfRNqCv1qDanQR9Di4+tU16N409o2WMXnyJeNWb9PO4s6WroZawOiSiozCoR7lPFUQezICCzXF+pPGYRna6/rotNqY/eJLUzh4mM5dP4Va0YXV45x0O9F9FhkN5auq4eznaq3WmP1pDkuibW5uraNaqyNh23ihPA6v7wAVS+PwXAGkbYiUnU3kYm8JzvgGpJGdG6vzm15+ce6H79/9bnnBhCxG702dwnTaw4nyM/jsiTHsHx+DEyjKWnGEUpBOyjTTgbpsNHyLojPe7PK3qci58NvNu0Gl0YA8NIxWp4MkdzCdK2Ci6iNYXIV6UEfUDBC2Q/A3WqVbUUfVucWftYhP9fLiFf7yRPGVmZmhE88dJVmpGRMqRH4E3emSbnQR3lkzaqNB3br/J39tb1ibJglGfJDZbMReb37Td/bFhcnB/iNppXNUbZEKFGBJ6FBT+9cVo5c3yd/trDV3OxdFDDHFOV8IffVJtNNOC+J3xtYqATWw0Mm6RIJ9YAy9rdtt07q1ZtjdVXCYFRBG4Bv8A+lliGhzN164AAAAAElFTkSuQmCC'], ['Applejack', 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAv9JREFUOE9dkmtIU2EYx88Roi9FfahkfQmS6kNGEBRlZWSY5tylTKepqR8MHYGl2R1POm2u5bCVlzbog2Ze591pzZPZxUskDZLMMLSWzcIca3MXt7N/55woqhf+PC8Pz+99n+fPQxAEQf6vhINb1nG5/ISdobWXo+9eSd4tyM7OJimKImmaJhsaGjjmX/DGqfDQmkvRg1x+9YrlZPd18fdupXiu6mxkOAcqlUqyuLiYB/+cayfD1rKFH0w3pYEHV4/omhTCyieVcYEB7TEYSyX21Mita/6u/91qUBMV00JrjmKwMg4zI2fgnlfD90PLx+nhMyinIrb91SFBFqaHBevPHb7G/fS06jhs0wXwO8rBOLXws2Kct/k4//HKRE+jZD0Pl2buD2FnmOlVSUFrpJg15/JFgcWKP0Bg8Q6fs1sVs+11wmAebKaEuiG1CC81Yozci+cL4KoC3JUIuCp4+R23+Ee4Dr5bisZmJi7fJzpLRJZPOin8vSlwdSXDO54Hz+vT8LzLh3uuCIuzBfDa1DzMPcrJMVfkIHpVEu94uYgH/aaTvOxdJzDZkI76smhY2mVwDmfg8zM5RukcvH8pbx96mLiPMBTG0nSpGK7mePg6k+DsSUZbSQwem02oba3DRsFKzNQfx9sHSdi1dzve5Ow4xM+ozorY1K2U2MY0IrhbEuB7lIqB6gxY7B9R3XoHAoEAivN74O5LAaXNwvNLe9PlcjlJACANRaIRztFh1iRvfRyYx5kIOCwY+GCE9GIUOjrzwZjS4H16FV80UT1WqzWIWFhYIBsLhDf7y46Ck1UvATNKgXlxHgHbJDyub2DGVPC2s+bVyGDTx74ym80kwe2fKvNASN8NySK3NeayWNagNPj7WaP62Uhn8HdPkwyWW3IoEjdv0Ol0JGE0GvmV0+dFpj9SS5kOKuahr01Wwbb2lXV6aakjkfF1p8DXlwHnaB5yTm1bbzAYfs34e/+0pyNic+N2ruIWmQWXcdE1dUEGd9UYq6kle1mXqVW6imWIn290AGVZutJTAAAAAElFTkSuQmCC'], ['Fluttershy', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA2xJREFUOE9dU91PWmcYP2uybDfrxdIlu9vN/oglverWNN3Fmu1iN7vY2q4utnE2Nu26ukyrUUGwExGpn3xY+TyACjrskFrcEYoWnCAM4YAgcJjROkFA1q789nJczNaTPHnfk+f5/d7n4/dQ1Cvf3Ut3Xp//Qnze36gYCt56kIgJpyqRFvrvcIvxMNxhSa9eV993XJK/+yqO/zdf7j7tbRz1RdstLzOKReRoLxJSOzb7HyKtdCEumgErmEbwO03U2aR8738kzq8ln8e6bXlWYMWmZA6Z8SUk5U5ytyPeY0Oy1w5O50FO+wQ5jbtG4lK19L5BGehzb9sE19+JtFt2c8ZlJPvmwAqtSA06EWs3g+2aQnacwdbwAmLknuiZxaZ4FiTD6tLFvi+pBeenb/3mvvo4Yu3D5v1ZsP1axHpUiAo0iPyg41/dGiNgiQI5PXmdXkai92dkVItYbZ6YpVZWLrrKFSOynBip9W6U/7LwViqZ8SykRWpcR8BqJNlmJCZp1LLMkIxSAw6s39WHqUCo/mDnWTdKhwRUMaNMzvLh5NFZsaBIbD+rJ34jgsxtcLQH3IQbKakDoVZDmnpk+irA/fEjCkXlv+AawX+MEJQJcaFEY8bWAJdMgYxyESn5PILNumUqJNVVA4EG7OXlx8Bf3T2QyRuh0X2P5ad9pCQTcjtqDI3UwTMuReIeaaKagb9u6B6VVi9Wg1YRUhkhH1g6NKFf3gD/2gAYz08YVd5AdltDfDS2d2QIrH6DcNcwUjLHc+aC8AMqLrW/4EwesBoligUTCgc05h52IH9gwu6+ERwBb+9pkc0IwLJNWHPXIyrUIdysW2POd52gopIZjtOSpgzOI2NToVAmwD0D9osmvvZSxcCXtr5wA08627Ah0yHZ74D3ysBNXokR8XQ8q2SQM3gQbZtAPm1AiZRyNIUawZGFl5qIRqbBdk4Sndjy1iviIymzIquXldirWRXDzzdOZr63q8J66OqOf+2yL8be+nMr3fry91A9NlRjvKT9tx88Pt6Djdaps0RZxQRZmCzpbHrMBV9b5/YM/dn7tSCT/cNTvpauFdasR5xkkCaS9n07Kj0mIKm+GbujP5OQ/vI8Ofyomhx0sOmxhU9W6wYp5uOO12qB3guik2TuI2QPXmwpXLGnjSMf3RRdO1Hz/QNneMt7Iqmg5QAAAABJRU5ErkJggg=='], ['Twilight', 'iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA6lJREFUOE+VlF9Mk1cYxj+Kc3+yXWimFxuk2zTIn4bQFkppF0hDNmBpBtgKixhhQZAhbSkFBp1uZWg3ZLRMxFKE0qKtrMy2E2ztn2+1tLQgbuJiorvQ7c5pgplZNjfmePZ9nwtZMm52kufqvOeX5zznfQ9B/M9l/8CXPP2R/6ajy+u0amZeoI8D2PpfTLqMlZQpT9vE2fPOc9l73302q7rs6Sz5K6zM3ZuJzD2EVf1VytejC4hNXoWj2/vlF71+FgVKIsZVHrbnEzLoPkYOqqtPNm7j1l1J4R9Y4wgVkOR3Qcvrg+uNXmTnt9zfmdcUFRd1XqQhC+eWMXP8MiwKdyUDOqMLEG49qYtYlhA+vQi7zocGmQHFYi2UnM9wq/RzNEsOQyDWMBIWtjNurjivw2ucg+toyM+A6LWZU72vvsqwFjwVZwrmrEvoq7DBLDDiltQAobidgeRRUipMTA0t32AU3hNzD7zGSANBZMi2UFe5nyZohrREB9dxEnMTS+jgnUBYMghv2afrbhhHb3aAnFxkQMHhOALDid8p0EHiKU6VklvQil0UiJakqBsf77dCmTmASPEAhoqPIEN4CGmCJvAkauzKfw/5pRr4J+JUTtfo693zGSM7iBdzan10sE9gh5AragNXoEKtvB+93ZMY0TthGraB92oJVlYewDTgQJ96DKTtiStXb8jvNoafIV7i19+lndC2X+bXPyqXffj4kmV+PYexY1aQMwnkv1YGWUUljryvQ0/dqfV9+Vs9zVTYLILKZ5UGsXMbb2/llJaWCN8OnzNMrxda9JNYjt+ENL0RrQol0nekQVtlRHA8gsWpZQhEmrviws5yIpXfcG87t+52UpY8NZXN3lIjPRiOReZxfugCA7s4EsCN727ArHChQiKDYGchRrumELbFEbQmkFvQ+ofg9TYX8Xx2zfnkLDmHbgM2m00M1tortQf06FC2Y2HqGgMjvSR+WfkVplYPzCoX3EOziDmuwjMSRk6BajVP1PYT/fzb/j0nZ7tmN+n3mUlpUTmCo1EGFHJE8NvDR/g+egd0fj5LDN6xKHo6bOAL1D/niTTRDUd2rMW13VBj/zFu/5YZBaYBp69j0blMPfs8zhj9KCjspPNZ+6fjd28IGld4MgIn5x/HJr9ByJRYDz5oS2B6KIT9Nf3IEaj+pCBrXFELOTERZm0Ichy+lHy2czZlpv+y80JfmILFVwPDsTvmo26SJ1I9zBU1/UVBfqAk35ujpb+RpL8BJjxIUjyXvSgAAAAASUVORK5CYII='], ['Rainbow', 'iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3tJREFUGBk9wV9MG3UAB/Dv7+531971aKGMlr+OwjoGBUZwRDrRBJwj0bHEmeiS6Xwyxn8x8UVNzHAPPvliFhMzsy0m8uDD5h/QZWoUNxYMBoZbZCBjZTBoKRwtLde7cv9+bg/6+ZDnzk6C44lw6f6whdOnETpzla+0803RMD3ZGSH95V62lzGQtMH9M7MhfpPUyIX5HE1uvNXDaCQgtykB70cR/4unrn3aqzYkZt7v18ZfezyTkfy0HlJ7FMWKEBJFpYMSVq7bngMlGvvc/OTiLzRYLp8K1waObaS16MDIRfupG9c6SuwCsSt2kJ+/B+3HMdC6MBofa0N1a2sVJTWj02mh4BFCCpV84jN4oHyX3KYEJAi2BWYR2CkPmMlBiOgwE0mYiymo1Qu0Mx4/8VLVnrtnF4VxfuCN9z5mDBA9FJt7mzDe3oXkjou69CqoxkA4gC9xQAggankMa7uTm3m32SLKD+Sz6XXGGCDJAv6j7di4MzqBo199Adk2EIqkQGQHDy3Ij2Q+bHr9g3UxyFHLdFyvJHAg+J/ipYgdjuMyzwELCfRsTWG/NQEwhqCVC0YLy/qKGJzmD77w9pHSoFyjbWWxtjAH5jIIHi8EKkCpq8JteCD2H0F2u4BwZhE+x8BEWbt6i6df8kr/s0+H/HKMc1yo02MYaG9APjGLxJ+T2NxYRV7fxu66GqjwYyrn2AG7YFGw4FygeYiXjva/KoipxoaKGPY1N+PJfRHEauvQaIj47vsLSN67i87ew6hOLGFeTS38FO45XhR8lQlffS0tmGViwbmCdKEb3tJSGLYLieMwMfQr1tZSqOzqheCVkDWIk7i/vvJ7WdVVxd96XWBU4kzb55qOiZvqJazmCxhLGzBFiqbnuzD71xyij8bxEN/XzXccf7PyxJ6+lkxuwknnftP4vorBd9O1mXBAnsbfaQW6VQadcWC7gmiIH0JlrBWuw+DYgFyiSGqu+O2NjZllPMBJRUevuH4Ipu1DyOefrS6RzmQN211iFGUtzSAcD8dh2Ll8cyStai8vra/8MQhgEADvjx/bX78c6rgT1ddl722/btSelEz69eaWoZqms1kwrGVt27xV1I1zgdWfRw6Ww8lmswQAo6QR2dnM6JC6HT3PEfvctjSsnx+3J1uob6qt6gAtSgEu4BbdV2KO80T3O0QQBFiWRQRBwL/txI3OlzkSKwAAAABJRU5ErkJggg=='], ['Rarity', 'iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAYAAAD0xERiAAAEEElEQVR4Xm2SW2xURRyHfzPnsmcvlO4ulN1uF2sLrIpdJNS0KUZFUq1t0AiKkpASbyQSjRKENEGrPuCTiUoTjSENKAnFYKokbZOmIBaoTRXB1AjbWmrabmVpt3SvZ899PFnTxAe+ZF7+D998mf/gbmwt30131B58YM+WTw7vbTnW/+oTHZda6490723uPP1KY0fna40dh/Y0fFz/4pq3XRFEsATB/2i71EauvDcplHN173p8of2gnI8KPHLxm/AEqwgIARUEeywyS1dVPZ+9kJ6OHdB/uzF2BmcYXRIdHxkhO/0vR/e9+c4p7+pIO+92+wlHaGE+QV1lYWpLCe90kdKVTvJo80rqDTic4nJfk7c62kM3rltfgQpSLGOM4ZfR0apQIPQTpSR04uhVqhUYSkoItLyMVFaEIjNENpTg8ZbVyGYK6PpyHIYGBhCmLiYHZ2NDzxZlpwYHaX3V2mMet3sPpZSbjc/B5y+Fw8GDgWEukcbURBLR2jB0TcPpz4cwO5aBBQJuWSnsbC09eeN50tnZSYy0s6p5V+MwIVghSQ4iFwqQHBIIIcVjGEaxXtd1XO2P4dr3N6EqCvJyFoqmgvqDlqZqp+jxD4/z8etKGxjxm6ZJxmIxnB8YwNDQEGITE5iemQHHcRAEATYIVPvB8ZQRQu05D45QGPNx2PYNNFxWV21y/h0AiCiKkGUZcwsZnDjTg7cOtuOr098hYxLYQJIklK8ps5hoaAyM2ZeAFwRQEJi5FEclT/BpxZBKFhdkQimFx+NBTbQG+1pfQFZ34tZtFd29PTAtC+N2dU9vH/t18sKCwPP4r46DQ3QySzcGKBGERzRFpYl4CkubPdd3Fj1nu5GduAxvdQNIPgNV1zBw/hy6+y+D510xUZQYzwlM5CXT5iID+5RailLNDINN/ZUCoQTLlnkQj8dx8uRJW2DA7V2F6H0RGJoGt8vFgqF7c2vD0T4wMANgd0yjP2Mqb+Ty2RkqMrhhmbh+JYnk7TSWl/pwuP0DrIvWoX73EWx/LIIV3lKIgoitT21Dy7aWPzU125/JpbOLukrA8U1ly8uGwxWVz1CXwOvE0qHIGq4NJ4qPHApVoKurC4defw6bKigCwfLiRkMBPzavL39w5/tPChk5vV+ZvzVHUknm4DhB13RKeZ5LlthlzDAQG00jkykU/5VTYKgJiTANE6LkhKIqTNW0nKqpvYauj89PzX5jcqxG0/WmeGK6bj6V+IHPy7nfV/hWbS5kM0gnC5iMLWBjXfhnAA0FRQGz0XVtzmJsZEHOH52a+uPirubtOmw2BfYmg9cSP2YsJ7uIbxlpfaitdk3l/Q/rlv7FnVzucmXdPS+1HtjyD8dzWCIvy76/Z6bY5MTs4tfjn7HBjwZxN/4Fq6rr1ZuF0oUAAAAASUVORK5CYII='], ['Spike', 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAsFJREFUOE+Fk1tM0nEUx/9QPtCD7z30nE9sbbVeXJJR6j8DkVsIhg6HTqSXnBHSMMEbEy+AgPwVQpcgNy+kKLc/lCgF09Wquaab67kHX1pulif+mHRdne3sd3Z2Pt/fOee3H4J8N/ow2lrj4H64OljRfEXBIZ/k/3lWquXIrQl2ROAVA98jOro2XKUtvV9Dpj/iFV/ppwvLVfzThEBZGRWh0S4hmFx+rId2ysmMSU6WAAUeMfDcdYe0gUrGdUOl7rZXBDRdRQtRp1PeIRlVctIzk+lHR6itJnwC1nkbgOXgZlhO3h6RY9rZKYT7W9NUKpUklUqRKjPDQADEjYTz3SLgzQjzMWua/5E5xLpQrqOX/jEzamTc4LqEX/KQRwRMBwfEDgnUOyXAdgk+1zr5e0w7J/vA15OfN28PW5SnZlRuVT3WeMia5oHW1AthawSS40mIjcWhW98HfF89Ifa6qb+hqAA6FA5xzIp/dVncYDc/hkQOiI/jBcctCegwdRJgsERWcszpZTrKU/3S7s+Ff4vn9UG4aWbGyofoaB60d05dDJuiR/8DcXMCpLY24GPsrlRWcxZxKmaqF0aCsDy8ArgtAVFL/Jc2C4LWBEwFNLCUbt9PZrpEiEk2VjbmMYIdm4TQ6Cq4RmYB02CwZAlB2ByBkHEVYhYcEmEreNZl4F+/C8F0+0vE2x1IL3qDsDgZhKg5Bt7ULAgHa+HVzlt4v7MHMQyHpM8LrlQzuNdaIfJCub+R0Z5DfNrAxsJAEHJbhXhue5nQJmS3t2D73S6suVK5XBKiYQMs4B3xSEbZ83xTc3ljq5eMmNts5/3d82/8jicQDc0Cbo8BjiVyQsez4rYkeNRzfqfadUYgEJBRFCVRKBQS0tTUSM7BxaauUelyenwunnZ+SnhXDkKG0EGgb+5g4p5dpa5TFEkk1bmfQSu8/TfTXs+Z8UbptgAAAABJRU5ErkJggg==']],
      not: [['Plan9', 'iVBORw0KGgoAAAANSUhEUgAAAAwAAAAPCAYAAAGn5h7fAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAzE15J1s7QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACAElEQVQoz3WSz4sSARTHvzMjygpqYg3+KIhkE83DKtKlf0C9SrTRuZNEx0VowU6CuSeJNlwwpEO2kJ6SQBiIUAzFjRDF4wrjKosnGx3HmdehFDfpe/2+z/s++D5gU7IsEwRByICIiAEAIiIAYAFAXsjYVr/fLxMRNVvN+prJ5/OA3+/XERFNf02JyeVyDx0OxyvLNQsnimLKfcf9KRQKXQAAnE6nlf5qMpnQycnbP/kAoKoqsSwLAJhOp+AAwOv1otvtpqxWq73dbt/r9XqvEQ6HUalUEvF4XLd5IpvNZqlerzd5nlf6/f6tTCZjBACk0+nb+XxeW4UrikLJZPImAGA0Gq0NIqJyuSyyANDr9Q5Wu1utFvR6/SULAI1G4+vK8Pv90DTtGwsAJpPpaGUYDAZ0Op3PHAAEg8H3tVqtbrtu21sqyxuRSOQJk0ql9IvF4r7b7f7pcrlejkaj57IsH58Pzp8dvjhc/lsBk0gkbLFYrFqtVvd27+4qOk733ePxPDCbzVBVFfP5fCiK4rvhxfDN/qP9wSasGwwGMv1HiqJQsVg8ZlfTHMepkiR1t05gGJBGmM/nMBqNj9nN9kql0lNN064ARISzH2cQBAGz2ewLu2na7XYLwzBbvxYIBBCNRrFj3BmsAZ/PZ+J5/kOhUIAkSVeA8XiMZqt5efrx9OA3GfcgvyVno9cAAAAASUVORK5CYII='], ['Neko', 'iVBORw0KGgoAAAANSUhEUgAAABMAAAARCAMAAAAIRmf1AAACoFBMVEUAAABnUFZoUVddU1T6+PvFwLzn4eFXVlT/+vZpZGCgm5dKU1Cfnpz//flbWljr5uLp5OCalpNZWFb//f3r6+n28ff9+PRaVVH59Pr//vr38vj57/Dp7eyjn5zq8O5aVVJbYV9nVFhjUFRiWFlZVlFgZGOboJzm5uZhamfz9/bt8fDw6+drb26bl5j/8/lkX1z06uldWFS5r61UT0tfWlbDwr3Ew76moqNRTU7Mx8P75OpeY19pWl1XW1qzr6x5eHaLiojv7+1UT0xIU0uzqadVS0nV0MxkZGT5+PPk497///ra29Xq5eFtY2H28e2hnJignJlUUE1dXV2vrqxkY2FkYF/m3d5vZmfDuruhl5aZlJHx8O75+PZWVVP29vT/9fTj3trv6ubh5eRdXFqTkpBOTUtqZmX88/RMQ0T78vPEvr7HwcHDwsDq6ef///3Gx8H++fXEv7tZWVedmZZXXVudnJp0c3FZU1f79fnb1dlXUVVjXWFrZmy8t7359/qLj455e3q4s69vamZjX1zy4+avpaReWFz/+f1NR0vu6Ozp4+f48/lnYmi8ur3Iw7/69fHz7+xbV1SZmJZVUk1ZV1zq5ez++f/c196uqbDn4uj9+P7z7vRVVVXt6ORiXl/OycXHw8CPi4ihoJ5aWF3/+v/k3+axrLOsp67LzMZYU1m2sq9dWF5WUU1WUk/Au7eYlJGqpqObmphYVV749f7p5Or38fPu6OpiXFz38fH79vLz7urv6+hhYF5cWWKal6D//f/Z09Xg29exraqbl5RqaW6kpKTq5uPv7Of/+PDj29D//vP18Ozs5+OloJymoZ1ZVVJZWVlkYF2hnpmblIyspJmVjYKQi4enop5STUlRTUpcWUhqY1BgWT9ZUjhcV1NiXVkkhke3AAAABHRSTlMA5vjapJ+a9wAAAP9JREFUGBk9wA1EAwEAhuHv3dTQAkLiUlJFJWF0QDLFYDRXIMkomBgxNIYxhOk4wwCqQhQjxgxSGIsALFA5BiYbMZHajz1oJlx51sBJpf6Gd3zONcrqm/r1W8ByK0r+XV1LXyOLLnjW6hMGpu0u1IzPSdO17DgrGC6AadrVodGcDQYbhguP6wAvAaC0BRZQalkUQ8UQDz5tAof0XbejOFcV5xiUoCfjj3O/nf0ZbqAMPYmzU18KSDaRQ08qnfw+B2JNdAEQt2O5vctUGjhoIBU4ygPsj2Vh5zYopDK73hsirdkPTwGCbSHpiYFwYVVC/17pCFSBeUmoqwYQuZtWxx+BVEz0LeVKIQAAAABJRU5ErkJggg=='], ['Madotsuki', 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAMAAADTRh9nAAAALVBMVEUAAAC3iopWLTtWPkHnvqUcBxx5GCZyAAARERGbdXJrRUyGRUyYbY23coZFGDRFGEYfAAAAAXRSTlMAQObYZgAAAGhJREFUeF5Vy1kOQyEMQ1Fshzd12P9y61AixLX4yJFo1cvVUfT23GaflF0HPLln6bhnZVKCcrIWGqpCUcKYSP3JSIRySKTtULPNwMaD8/NC8tsyqsd1hR+6qeqIDHc3LD0B3KdtV1f2A+LJBBIHSgcEAAAAAElFTkSuQmCC'], ['Sega', 'iVBORw0KGgoAAAANSUhEUgAAACwAAAALBAMAAAD2A3K8AAAAMFBMVEUAAACMjpOChImytLmdnqMrKzDIyM55dnkODQ94foQ7PkXm5Olsb3VUUVVhZmw8Sl6klHLxAAAAAXRSTlMAQObYZgAAANFJREFUGJVjYIACRiUlJUUGDHBk4syTkxQwhO3/rQ/4ZYsuymi3YEFUqAhC4LCJZJGIi1uimKKjk3KysbOxsaMnAwNLyqoopaXhttf2it1anrJqke1pr1DlBAZhicLnM5YXZ4RWlIYoezx0zrjYqG6czCDsYRzxIko6Q/qFaKy0690Ij0MxN8K2MIhJXF+hsfxJxuwdpYGVaUU3Mm5bqgKFOZOFit3Vp23J3pgsqLxFUXpLtlD5bgcGBs45794dn6mkOVFQUOjNmXPPz8ysOcAAANw6SHLtrqolAAAAAElFTkSuQmCC'], ['Sakamoto', 'iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAxVJREFUOE+Nk19IU1EYwK+GQQTVQ39egh6ibKlzw91z7rn3bvfOmddNszl1bjKXc5rJJGmBUr7Yg9qTD0IalFgRBEYg6EDQQB+GovQyQgiaUZsoLcgHMcr069w7MgcGXfi453zn+37fv3MYZt/n99e76tzVj4JN/hP79fvXnV3hnNabwUBjoOHcgTYOu/JQspgTzsqKgn9BfD4vkWTzur287PqLVy+zM+yePB7KsRXLywTjnSpnZctBkPCdW8ccDuU55vBO8RXbkC/oP5ph19V5+7LIky0OY1BKbZEbLcFSt7u6pN7jLmltCVrr3DV5jY3+KovFEsccB1KJNVpefe10BqS2tqqO4/AuphBB4L/LkrRqNgtJs1lMypLls1kU38mytMLz/E8VIlutqVqX6/weZG52OttRXjbE0cP/FYLRlpVjDXuQ/r77x2XZPKkCHA4HBAIBkCQpAygIAvh8Pu2MZgO0Lz+QSa/sQfwN9RfpVN66XC6Ynp6GhYUFGBwczAC1t7fD0tISxONx6O7upgHILmsqvLcHodOggfiV/v5+SCaT4HQ6IRaLgdfr1bIRRREmJyfBZrNBNBqF+fl5sNsdgE2GiAbp6bmbdbXC7qWQbxMTE7C2tgY6nQ5SqRSEw2ENopaoZpCXlwdTU1NaoECgCbgiU6y8QH+ECYWaTymK7TWdys7MzIwGaWtrg42NDejo6AB1WjU1NZo+FArB2NgYrK6uQrAlCASxn2z6wkuMp87VIAhkE2MEAwMDkEgkYHx8HBYXF0HtkQpRy1BLiEQisLy8rPVNKSsFjEzrXH4+z1hlS4xDhKadNu7t7YPR0VHweDzAEVWfHru6HxkZgeHhYVAURYNjkylVWKArZjjMzqmdVi+QCsLUkQiEjvDvncEkvU7/qQ0Vgukeo48Go87IiCJnZNmipxiz7wXEbVDnbUxQOgM12h9n6qTq6NvapRdtkwaP0XK8RmPuYSbxYfaQ/sJJhjfknuFRURUi7AMOozcCwl94hLZp5F+EioDQVwqYI6jomZU1NFtM+rOSxZjVazcyvwHr/p/Kws1jegAAAABJRU5ErkJggg=='], ['Baka', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA0pJREFUOE91k3tI01EUx39JOpA0H4jNx0pbD3XTalISWf8YFlEgldqDsBLLyqjEKBCiLLWiggh6/KEV1WZ7OaelLZvDdDafNW1JFraWe/32+01FrUZ9uy4ylLpw4Z5z7/nc77n3HIqaMRIjZJyEcNX+uFCFeGmI/GZciEIsCFJUTvoAzDz+1y7K76MSwhX5hXl6z+WSbrzU2KB8YEGDwgrTaxZ3b7xHcaHhR3xw7Z5/UviB1ReP5XSg3+TAqYJOxMzWISFIC0GQDomhTVA9skCnsaAwp/vnMq66dBokNuBR9uFd7T9Z1zCunjci0qcRJUVdoJ3DYOhRnC/qBZ+jQbfeCc+37yjY2UEg0iwvJE0k9l8Z+8xqHmTgot0QLdQgTaQFQ2AsOzlHvOu1S5pwOLsHHo8HjHMCq2MazNvTlByKHyrJLDvdR25jMWRxYx5HjeMH2r1BDOOeguRua4OI14jx8a8YH5tA+al3EHKlW6mYOapb2oZBOOwMbEMseAE12L+jjUh3w+VipyAZ65oxn1NP/GMYGR6Ftn4Qsf7qa9S82Y/l/X122G0uL2TbxmZEz1WhXW8mUol8moXu+SCi/OoQ6VsDh3UUwyQ1k9GOaI5MTkX4yWTGHutvgI1F28sviAlRgxeoRm62HvsyW8En9pZ1TYgi6TntoyQtFm86rVgUoJZRvDnKMmXVAGxWmkAYOBwudBqGcHCvHulrGpGT2Uy+z4yT+QYsCXtCUpp8GxbKhx8gDK0ro+KjJGvzdjfDZnN6VdisLD5/JjArQ2zW66PJOj2lEZtStaBphkwah7K6kMJ/GEulp1bMWhAmMbTozOQRaWRtfoZVgjo4iRra4SYgGi26TwjxVeDKhR7Y7U606ixICq9tr7hd7+OthRWL7yUnJ1WPmXotqLhpRICPHCePtuFV6xdUPTAhcWEtRHEqfHpPyto4hPXLXnzflSEJnFaN3OCKDcsFsrEntR9RUmxARLAUgT5iBPuJsXWDBj0dZjRU9yNV+PTbpjTp9OA/pOSk24nRkXf1J462oPxcJ65f6ULlHSMulepRerYDgvj7A0cKpNz/tyTZqbzXO4t0ZZGQJ34RH11lFHIlA8LIqreCCMUZRY3cd2bwL/5/RmjNSXqtAAAAAElFTkSuQmCC'], ['Ponyo', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAuNJREFUOE+Nk3tI01EUx39BTytConQTt1am07m5abi5KT5S8z2dj1yOEMUC7aUgIoimlmUEWX9kBZGWaamEmE6U1BI1XNPNGTrnHs33IwuSXrL4NgcJ0mNdOHDh3PPhnPP9XoKwcroJYvMQiRSicHCQKCgUyZC9/T5rNet5KUFs0zCZbZMsFmZ9fTEjEEBDp4/KSSSb/4JoGIyWaTYbiykpWEhOxhSHAzWD0aqkUGhWAcVkW58xlvuPhfh4zItEmOHxYDR3MhcdDaNAsKJydAz5IySKRNjEUmy88vjOVaU8F0iPCqCNjEBHkC/UYaGYFwqxmJoKLYOhkxPElg0QsbNtTlmox9yjRD9UCbnoOR+J/lwRWtOCcdXfDc2BPpg0d7CQlIQZPh9KKlVkAQjJ2x2zmOSsQu7hpzUJfBhLjsNQmADjxcT10Bcl4rE4EHc5LjBEhEPn7f1WTqXSLQB/s1Tp7vslsoIkyPPiMJAbi86McBguiaHKjoEqR4jJy2K0nAxApzMN5iUGrclrKVaz2fUvuF4tRbxDKA90w5VjTFyLZKHpTBSq4/1QnxGB2qxoVIZx0JopRCPHFSNOThfWZzfrXDcZEowH4iA05ATg68hDtBaL0HAuCm3lJ9Bfcx2fFNUoi/DCjRgfNHHd1wCZA2TyXjNkE6F0cBDpPFiojeNi8EkJdFoN3vXch0nbBJOhDd907dANv8JITxNqziag3ZsJbUDAwLin50Q9QWwl1qSYoNOVvUcOoqOqAAa9Fu9H2/F9+B5WZLcwOyxFX18flLI+VASyMGVeoJHD+Tzq5BS1PoaKRrNT8127P74swsq4FCa9FKvqBqwaOiz3hdEuLKueYSyECT2LNW0eIfo3E/WmEbvnG1MUJnWdpWhDGDvxQXZHo+RR0uW2tnv+auPX+TvtJm7zKpaen/4y2yjBUlcxlvtvmvT16ZWDpQeoVv3/60F/NrHjTf4ugazIXtJ8ivjnz/sJ+yGQRjcqUdIAAAAASUVORK5CYII='], ['Rabite', 'iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAD/0lEQVR4Xl2MXUxbdQDFz/9+9Lb3tkBLCxTKhzgoOOZAsokbJmZxDFHnd+LL4hKVzBgfNCY++ODbjDEaZowvErOM6HRu6hKZY2rIAOkCY4OSDTpFaAsrlJa2t5+39+NvjT7tnJzknIfzI98Nf/C6TuXdguWBd1q9rcb8/CwsZiu2Ywm4nDVo3VWLZCKDaDwJq9mCg31PgjAMKKUwmcyYvTbek9iJRDm6M/XswEDjwNz6plWW6wdZhjUAintFCEEhn0N04zYskljaDLaj8ar49oUrsYR6mrFJNj322w46H8y+mitM/ZJKZmyE4XAvjJSsazpyuSzslVZIkgWKOvvRgQ6Xrdlhqmds7o7bFZoLkctreKxf7GtuCE7IyUQjBQcQ8j/lvxCGQJZz0IoCVpamTtzfIh9nwiaIrCQyjNg8mq11oDLUhNXRJfT1Ozr3tS/PqpnQ80qRgjAmKIqBfK4ItbSLKoOZqR/6neLkENlSUAIhlktvEf+sD2rkm8nWTHtvZCGMVON1ePuaoBER31/MXGly1wSqq9Uug6FluYyWXJiPqFXmjd4Dh9oF9ZKKimYXRtYCx8lmMIDIxlIPGz591av0mtanF7FcCEN6iMXeox2wOJ0QJAmUAoRQaIqCnWAQY1/ewKNGNeQuYXkm0d2NC2e+wvmRr/Hx+6+8PHayrbDyyQBNDb9As3PHKDWG6MTM23RoeJAWsqeoWvyUUv0UHf7pBB0fe4OeeXe3/vmHbx3+8dwIGJ4IsFpMMFe0fbtAn+nwZePr1u4MBK8XIALG/Rt479wYrs2vgeNNAMNgMbiNzybuoKVvn+Gs9kbr6qpBfJfGYHFIkJUCoGwfqcoMX/b27EGhwgOjoCADDlP+CA51ugFFRzoB8FYNaQ1oqKD44+eNL+wNj7zJGQSIhe8+jgQ9thk+27v/KRY6L4FSCkVOwtlQj6P73Qgt/o1ERoKt4iUkE7+jrZMHyzIoK9cOBFfT4LbWAk+0a7ZLnvqHcTNdACgFScfAcjxEdy00VQclHGo7dqGeYxHbvIo6hwhSghCehb3G5p6eW7VxXC5/xGWToMgrKKoaCnIalI9CIARasQAqloMI/x4BWrLLYwE1AEPTwCGHaGjz7pw/leZUNV8wNm9BLy6CxsvxZ1kMbaY4TKIIXlNBsynoVjvAC4CuAoYOVi+CMfLYCUfg95tPHuzZB0YtKzsb58RMucWE/fZmhCbdOP9rNnLnxko6GVoB8lFwyVVw8b/AyeulHoJyN4Rb19dTFyeqBlu6njvfsWcvOJvLs7DMmw/7bvpeE4pU2OIcgcqmp4fGAgt2Txwvqr7lTp5V7LquZxXC6+BqEvGcY5pyjaM1tffJbk89NE3FP5VQ6y7a+paZAAAAAElFTkSuQmCC'], ['Arch', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABCFBMVEUAAAAA//8rqtVAqtUQj88tpdIYks46otwVldUbktEaldMjldM2qNcXk9IWktQZkdIYlc8mnNUXlNEZktEZlNIYktIWlNMXktE7o9klmdMXktFHqdkXk9EWk9EYk9IlmtQXlNEXktAWk9AWlNEYlNFDptkZldMYk9E4otg/p9kXktEXk9AXlNA4otclmdQXk9IYktEXlNEwn9YXk9IXk9FFp9o3otgXk9FPrdwXk9E2otdCptkXk9E/ptkcldIXk9Edl9IXk9EjmdUXk9EXk9EXk9EbldIcldIjmdMmmtQsndUvntYyn9YyoNYzoNc0odc1odc2odc6pNg7pNg9pdlDp9pJqttOrdzlYlFbAAAARXRSTlMAAQYMEBEVFhgcHR0mLS8zNTY3PT4/RU1kdXp6e3+Cg4WIiYqMjZGXl5mbnqSnrbS3zMzV3OPk7Ozv8fT29vf4+fz8/f7SyXIjAAAAmUlEQVR4XlXI1WLCUBQF0YM3SHB3a1B3l7Bx1///E6ANkDtva0jKbCW2XIH1z2hiZEZ4uUgxo7JedTQye/KN/Sb5tbJ+7V9OXd1n+O+38257TL+tah3mADAwSMM7wzQWF4Hff6ubQIZIAIb6vxEF4CZyATXhZa4HwEnEA+2QgoiyQDnIEWkjVSBBZBqXbCRlKYo8+Rwkyx54AOYfFe7HhFa7AAAAAElFTkSuQmCC'], ['CentOS', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAB5lBMVEUAAADy8tng4Ovs9tnk5O3c7bX44LLduNO1tdDh7r/eutj43q2kocX23az07N+qqsvUqcmXl7331ZXJj7r40o/Pn8T42qP63KjNw9n21p3Y387Ml7732JzR55z05MSxtMLGn8TC4Hx8eqt8e62Af6/B4HnG4oPC4HzH44fBf7LCgbOkoMTcsrmtn8PWqcfFtKrj4Jvs2ZOz2FnMqLXT3KfY5p60Z6NUU5XRuqHzwWSywqDn3JaiiLWahrWhkry5zJjRmqm1Z6P1wmb1y319fK632mK5cKi5nH+73Gu73Gy73W283W+9eK17e6y1yZS3aqRZWJdcW5ldXJplXZppaKBwb6VwcKV5eKswL306OYNPTpGkfK+m0kGpUJWq1EnEqIuXK3+Xh7ahP4qhkryMfK6BgK+CdpGMaKKMa6O9ea2+eq6+oYW/eq+NbqWVlL2Wlr7AjanA4HnA4HrBkqbBlafB33rCgbLCmKjCxIzC1mSs1UytV5mtxIWt1lCuz2evWpuvXJywxYzHjrvH4oXIjrrN2HXO5pTO5pXUlYnUlYvVl5Hb0G7e0XTg03rhr5fpzHPpzXTp0Hvtz3/wrDHytknyt0zyuE3yuVHzvVr0wGP1x3T1yHf1yXe0ZaL2zYP30o730pD31ZeRIcF5AAAAQ3RSTlMAFBkbHEhJS0xMTk5UWWBsd4SEiIiPkJCVlZaam6CjpK29wMPDxMTFxcnK193e3+Dg4uTn5+fo6e/v8/P4+fn7/P7+J4XBAAAAAOBJREFUeF5Vj1OvAwEYBb/yGlu717atLW0b17Zt2/6nze42TTpvMw8nOZCAmwUpiIY6c5IiLi9tPX64GairqszHQ4X2VB64v1Cs6PxMPJSdHM777s6/jyaMRGiRLyyrb88OpjZ3CzAXrm1sqzSNNeN7kVBPNgB7cG51abE5l9cXDces7emQ1uadHhutFUg6gpPKkSIqQGavwz7r7O/+/3t/rSdjI9XDM3qz4fr3B/3iA0aJTG9x71+9oR/PLDwUe2wm19bly+fTIxHyEETatbPewGEw6Mk/tKZCEqSQQUlIHB/QNBEjjVN1AAAAAElFTkSuQmCC'], ['Debian', 'iVBORw0KGgoAAAANSUhEUgAAAA0AAAAQCAYAAADNo/U5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAZ5JREFUOE+Nkk0oBHEYxv8fu5GQj3JwcaDkIAc5IpR87M7MKnIVJVKclaIQ5Sy5OLkgR7n5OigcSNpmd2c2Vyfl4KT8/muWiVU79TTv+7zv837NCBF6PG1X+NpZyEYSD9mIc+tHnBPe23B9xKrCuTmbQA/JKfABrhBswa1hH4A38IwfOxPdX1qcjiCQxO5NyrjKV70TnSbeRPwJvGN3i4yyqnEucPY8ZZX9GSEgGK+RvFfyjk2VKZxzBNG8wJWWgh/xtDOeUXZ7Slr6TrSLYL9N4SMgYTTcwdc2ArvJcElhSVcM6mCNSV8n9hA59yTU5UWMG6HIbLhIWlglgWiC2L4Z79qTdo40D6ISuOWwKCWHyk9Fv8ldpUHOuGTuynwSBUynddPdlbEosVpP9Eu4FnOsRzUYNTsdmZN/d5LDiqM0w+2CMdAFFsFGWgfXxZnheqe/z+0puwEM0HHYV3Z9Sgz8TEz7GkQvpuJ/36ggj2AaHLrSlkULWV5x+h2E8xkZL16YVjGNaAUscfZ/f6c/k9ywLKI2MMcRWl0RLy007idmRbQJ7RIfDAAAAABJRU5ErkJggg=='], ['Fedora', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABPlBMVEUAAAApQXIpQXIpQXIqQ3UpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIqQ3QpQXIpQXIqRHYpQXIpQXIqQ3QqRHYpQXI8brT///8uTYMpQnM5Zqg5ZqnS1+I4ZaY4ZactSn8uRnYrQ3MrRXgsRHUsR3s8bbM8brMtSX4wUosxVI01XZw2X50vUIguToQvR3c6X5o6aKs6aq08Un8qQnM9VIFDWINJXohKcKlXapEqQ3UvUIc2X55bhcBdcJVgcpdhfapmd5tuk8dxgqJ1hKR5jbB6iah/m8Shudq3v9C4wNG/x9bFy9nFzNnFzNrIz9zK0NzK0t/O2+3P1eA2YaDU2eTb3+jb4Oje4urj6fHm6e/s7/Tz9fj3+fz7/P38/f3+/v83YaEa/NNxAAAAHnRSTlMABAoVGyY1SVlpeIuQsLfDzdHW4+3y8/b39/n6+vr4+ns8AAAAyklEQVR4XiWN5XrDMAxF75KOknYdZJS0klNmHjMzMzO9/wvMcH7I37mSJShsJ+5NjMT6umDoHyXDcI/2qJadh++P3cle1de+9yPe3/bTY92wzfzr7wGtP3JrAI72BZGVtcAdQlwHy+JS1pDbBE9qamZF3BYrjQxPEXwKc6dC8bXFm0QIpmt8kn0Rn093q82UCtK8oXZckwFJzuulV8bHkajPyXdbnJnARfDHs0trz+JQ+5AFvzp/L0+cL2qPAINUPrq5OC6p/64F/AMnrST+Dq/r7QAAAABJRU5ErkJggg=='], ['FreeBSD', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAABIAAAASABGyWs+AAAABmJLR0QA/wD/AP+gvaeTAAADXklEQVQYGQXBS2wUZQDA8f83j33M9rF9d7u4loaWklaDpkSo9KDGaIKUaGxshD2YSPRiuDVeTDyhBxosJCoa40ktpAkPDcUqAYVIpUSUPrAulEdD2bbb7e7ObGcfM/P5+4kwKDvq6yJ1FYYcvb+YAkqAHo/HQ7FYrFIoCiurq9ZXJ06YSOkA+kBzfX06bys3zHxS9EL0tXDVyZfefacqV+X/ZSJx5+qLbx98LhaL9RiGEZWlEsWC/Thd9q6Pf3vs2u6Orc83rFsvTwwfLf5obgywT1Vjh2Hh+rbNsnTssJdNLedK5aIrpSuldKVXKsnH4+Pyn6FDXn5tMef9O+3NvdkvP1V4+EYw2AoQ+KSx8dRYS6NXXnwovaItXduSrrkinWxGOmZWJi9OyOK9m1LmsjIz9IH8QUMOd3WfAQwNKCy2tJwbHB5+XasPaxIHmc4g7WWEZ1MquBiRFlJTf1E7+Tl/H/8asavPzTY1nWd2ZkMDRPeBeHPz5ojwsilEQCBvTSKunCF3M8FSNkBGVTHDYYrLj8jVNhDZ2SMa2zo3MTamaIC/u6Ojr3DtrOrvP0BpdATnyBeIhTxpR5ABUlKSUlXS1dWstbVxdz6hPL0l1quGqkLaKwNvVcjEXNRd/4mit4Z19DjefBEPyCKxgQJQcF28dBrHNDGTSZSezsjeff0hraa2Vs2vrvit81O4vj9xLJcC4ADrQA7YAGqBGsAql/EtLdFQE/L7dF1XZmdnSrbPMJfXoLDmolQK8gJyQBowgQhQDRQBD+hsraVhd4e5MH+/oExfvWLJ9q3/3S7qMpNH2hsS40kFS4EUUAMA2IANRIBXv4uzuO67c2PykqkA5YmZ6bN18YPi0Yoknxc4AsJPCMLVAk2BLKDosCWqs/PZaulkuxk9fekcUBAAQGDks5FT0W++3NuYuC0DVUL4DIEdlIQDAj0IRkigaMjArkFx0tf523sffrQHyKsAgHPhwoXLL+yP9/kePNhk5ExUTyKFkJVAUAiCFZrQup4Rv9ftuLV/6ONBYBVABQAArMvJ5MXW7duD6P62sD8UrPAFRU1TpeCpCnGvPZr7WW///v0jpw+VC9ZdAAABAAAAAMLo7drWrmQyPWG/r8tnaGIjaM05ujr16x/ZBFh5AACA/wGZnIuw4Z4A3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMi0wNy0wNFQxMDowOTo0OS0wNDowMOPVpFwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDctMDRUMTA6MDk6NDktMDQ6MDCSiBzgAAAAAElFTkSuQmCC'], ['Gentoo', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAB9VBMVEUAAAD///+AgICqqv+AgIC/v9+Ojqqii9GAgKptYZKQkOmPj/ddUYBgW4eVjeCTgfiWjO5wbJaZkvPBvepkXomYkNldV4Bzbpl6dJ+Uj7ynoO6Vi+1qZI63se2mnudjXYjOy+GCfaqZjvWlm/Pc2e+Oh7NeWIOWjfeXjeW1sd+gl+diXIfp5/KHgKnn5/F2cZx6c6ZgWoXc2e6dltrAvNu0scrX1eTOyujCvup4c5qpovVpY43///+6uPPJyPXq6fvm5vrz8/z8/P7+/v/d3PixqvmxrPSyrfe0sPO0sfS3tMve2/3r6vy6ufPz8/3d3fi3tM63tPO4tsu5tsu5tvO6tfe6t/Vva5KRjKy7tvW7t/W9vPO/vM+/vvPCwfPEw/TFwvTFxOfGxfTGxvTHxvTIx/TJx/aTiOrNzPXNzfXQzfnRzuHS0fbS0vbT0uHU0e/U0uTU0/bW0+zW1ffX1vfY1/jZ2Pjb2/jc2uSTiemVkLSlnvbe3PTe3vng3fzg3f3g4Pnh4Pnh4fri4enj4/nk5Prl5Prm4/ymn/bn5vro5/rp6O/p6funoPWsqs3t7Pvt7fXv7vzv7v3w7/nx7/3y8f3y8v3z8vytqPWuqPX09P319P319P719f339v739/34+P35+f37+/+uqev9/f6vqvSwrPQAR0dcAAAAPHRSTlMAAQIDBAgJCwwVFyAsNUFHSVBneH+Bh4mVmZmanKCxsrK2tr3ExtDW19rb4ODl5u3t7u/w8/T6+/z9/f4MkNJ1AAAA8ElEQVR4XjXNw5aDURSE0YrRtm3b54+dtm3btm3bz9k3Wek9+2pSYFwT8ibzE93hwAtdJqK3nZo4J9hFXbP+vFHOthV6gnGzstZq94wdCs4UCCDymQ2v7X0LdYoSQ0MIENRYzJbRlPTTHu73ZNAL8vivmVui98PpzuqffX0mIPHJGtOQenukteJ+aS3b9htNpDnT9TeZH1bHAwBRMhGpd6e6uNrLoRgxBKmsX47nBlp678ojpEA40fejcmW4e/No0V8IIPfj6eKgbEJ3ZUnzgE1OqWp9Q3VeWRAsg51f1dZ8c31RmAsc+N5JGbG+zvj3BzDCPrzMDC9SAAAAAElFTkSuQmCC'], ['Mint', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAACVVBMVEUAAADh4eEAAAAAAAAAAAAAAAAAAAAsLCyXl5dgYGCnp6eTk5N3d3fBwcGqqqq8vLzNzc3Ozs7Ozs7Pz8/Pz9DQ0NHR0dLS0tLS0tPT09Pf3t/Pz8/i4eLb29vZ2drZ2tna2dra2trf3t/u7O/u7e/u7O/r6+vt7O/w7/Lw8PDy8fTz8fXz8fbx8fHz8/P19fb49/j49/n6+vuPxlmWyGOx437h9NDr9eD6/fj////+/v75/vTA5Jv6/fb7/fnL5bDL5q+AxjeDxUCEzTyGxUaGzjyHxkiHzz6J0D+Kxk6K0kCLyE2M00WNy06P00mSz1OUyF+W2FGX1FiY0F6Z02CZ21ac0Wiez2yfz2+f2mOh4GCi4GOi4WKi4mOk12+k3Wul32um1Hin0nun4G6n5Gin5Wmo23Op2Huq1n+q43Cr526s4Hit23+v6XSw34Cw34Gw6nWx4IKy4IOy44Cy63ez146z34az4IWz4YW03Y217nu38H2625e645G74pK83pu98Iq984W+4ZjA4px0tzDA5ZrB8ZDC5p7D55/E947F6KHF+JHH4qvH6qTI46/K5LLL5LN1tzLL5bN1uTDL57DM5bPM6qzM66/N5rTP6LbP6bTR6rfS573T67vT7LrV7r3X68XX7MHX773Y77/Y9rvZ8cHa7cjd88bi88/j8tTk8djk9tHm8trn89vo89zo9N3p9N3p9d7p9tvq9d/s+93s/dzy+erz+O73+vT4/PX5/fT5/fX5/vN1uzB3vTD6/ff6/fh5uTj8/fv9/vr9/vx8wjV/xDmrMRH0AAAAOXRSTlMAAAECAwQJDzk/RUlNU3F0kpSVlpeYmpucnaKjpKWqqqqtu8LExMTEzdTU1NXY4evy8vP+/v7+/v6LaR1mAAABD0lEQVR4XiXI03bEABAA0KltW9kaW3eSZW3btm3btm3b/q4mp/fxgqKOtpamhrqaqoqykrQYABh+PVMU9fjE5Xp8o54kgPHN0EBHU2N5YXZykiua0HHd2759VF2Sk5IYE5GGsmCEWLV1kVWwt5O+3x/qpgsy8k4ja+cJl2/v5C22tlgCAHtw9TQSa4s+AzfPSm0BRNl9SydhWJzLC567KrNhgrNwHIJ5qTz/2f9w7Jw/DNqIjVr04exW0AEOXcN3Ab7enr9eDW2VTJgehONyc2Z8XP5YdD0Tcuhcc4/r45OjGX51TEjYPbh8THRPvbz+CHusgSZlT7rP8PkCwfQKaQUi9Igr6JsRBMFiWZgb/AHKElRzKopZJQAAAABJRU5ErkJggg=='], ['Osx', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABrVBMVEUAAAD///////+qqqr///+ZmZn///+qqqqAgID///////+tra339/eAgICoqKjx8fGMjIzm5ubh4eGPj4/g4ODIyMiAgICSkpKLi4vS1tbPz8+Xl5eMjIypqanIyMjW1tZ2dnbR0dGamprFxcV3d3d+fn60tbV3d3dcXFx3d3epqal7fHxxcXF+foCnp6hYWFhyc3Ojo6SMjI5fX196enp+fn6Li4xERERqamqgoKFpaWmFhoeen6A/Pz9QUFCWlpeSk5SUlZWUlZaOjo+Tk5RHR0cuLi5YWFgwMDAeHh40NDQ3Nzc6OjpcXF1rbG0XFxdSU1NVVVVXV1dZWVlbW1tnZ2lwcHABAQEEBAQXFxchISI+P0BISUpaW1xHR0kNDg4qKyszNDU1NTY9Pj8NDQ1cXF4XFxhSU1QSEhIDAwMrKywtLS4uLi4wMDFHSElISEggISE0NDVJSktNTU1FRUVWVlhGRkYEBAVBQUE0NTZQUVJQUVMFBQUqKitWV1lXV1daWlpaWlw+Pj8bGxtcXV9dXV1fX19fYGFgYGBkZGRlZmhpaWlsbGxwcHB2dna844Y9AAAAV3RSTlMAAQIDAwUFBggMDhkeICMkKCgqMDIzPj9ERFBib4CCg4iMjZCcnp+jqamrw83W1tvb3ePl6Ojp6+vs7u7v8PHy9PT09PT3+vr7/f39/f39/v7+/v7+/v50ou7NAAAA30lEQVR4XkXIY3vDYABG4SepMdq2bRSz/capzdm2fvOuDO397Rw0Ly4tz2QAQPbcxuZ2E/STJwfxPhWgG355fRrVAIVb1zeP9UDLfiSwkAcADe8fn7tFxWuEXFRDoer/OgoMTRBCumj8yJwPBo8Zhpk14U856/HI8n0ZUtpZ1udrSzfVneA4roNKjdrwpcMRilb8d8G60+lKnrpWcn9bO+B23w2O8Tzfq4aiNSZJqzn5O4Kw16h06fPZ+VUlUHfo97+VAEb7rSh2UgDd4/U+TBlQY7FMj5gBIGvcarVVfQPVPTG94D0j9QAAAABJRU5ErkJggg=='], ['Rhel', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABj1BMVEUAAAD///////8AAAD///////8AAAD///8AAAD///////8AAAD///8AAAD+/v4AAAAAAAAAAAArKysAAAD///////8AAAAAAAAAAAAAAAD///8AAAAAAAAAAAD///8AAAD///8AAAAAAAAAAAAAAAB5eXn+/v5JSUnKysrS0tJ5eXmqqqqxsrL+/v4ZCgknJyeHh4eIiIjo6OgZCAdOTk7t7e3///8GCwwPAAArKyv19fX29vb9/f0EAAD////+/v4AAAAGBgYHAAAJAAAMAAANAQAPAQAVAQFyCQV9fX2pIRzmEQjn5+cBAAAFAAAAAADnEQjvEgn////uEQjyEgnsEQjzEgnxEgljBwPaEAj9EwnwEglHBQJHBQNNBQIBAAB3CQR5CQSHCgWLCgWRCgWTCwadDAWmDAapDAa/DgfKDwjWEAgGAADh4eHiEQjmEQjmEQkKAADoEQgLAQDtEQgMAQDuEQnvEQjvEQkPAQAfAgEuAwEvAwE8BAL1Egn3Egn4Egn6Egk+BAL+/v5CBQJrB0muAAAAT3RSTlMAAAMEBAkYGhsbMTRLUmpvcHeIjLe6vcHCxM3P0NbW3Ojp6u/w9ff5+fn6+vr6+/v7+/v8/Pz9/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+Q8UoNAAAAO5JREFUeF4tiwVPA0EYRL9SXIsWl+LuxfcOd2Z3764quLu788NZNrxkksmbDP2R7vH6GioLs+iffEzNXd4+TqPErUUpVqMOvwgdzMPn1rv5vPsVeufBTaBK/bH2FPvkEUuIG5jIIc+sHYn/HJ3dC/Hxuo4y8s44dzwBbFkisHN8bVIdXs6jb+H97aCwbHEIqgcml64CD7YllNkAVQC940MLYe5YzvIeQAXNrd19Roc5MdzfdQLUUKaUYyuG9I8y1g4gj6hIak4X5cBIT2MquZJrJdOqpY11ZpAiqVwbY/C7KY1cRCrZxX4pWXVuiuq/hs49kg4OyP4AAAAASUVORK5CYII='], ['Sabayon', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABvFBMVEUAAAAcUaYdVKwAAAAAAAUABAwWRY4YSZYhZtIhaNYHDx0KCgoFDBcKCgoRMmYSNm0fXL0fXb8AAAAYS5gaTp8fXLwgXsEGBgYFBQUZSpgZTZ4JFSgODg4IEiIOJkwOKVIkW7EnXbQLGzUTExMKGC8LHjwMIkITExMiIiIPEBEPJ00QEhMXOXAaPncOJEgoXbApXbEcHBwwMDAEAgAfHRgQDgo3NC8AAAAHBwcKCgoLCwsJCQkaGhofHx8lJSUwMDA0NDQ4ODiRkZEICQocHBweHh4GBgYHCg8mJiYnJycpKSkrKystLS0uLi4ICAgODg43NzcRERF1dXUUFBSjo6O1tbUbGxsEBAMLGS8MDA0iIiIjIyMkJCQNDQ0NHTYKCQkoKCgPDw8QEBArMDkKCgkRERIREhMxMTEyMjISIz00Njk1NTU2NjYCAgIVFRU5OTo5P0c8PD0+Pj4/QURAQEBHR0dKSkpMTExSUlJiYmJlZWVnZ2cWFhZ2dnZ4eHh8fHx9fX2FhYUXFxeVlZWXl5eYmJiZmZmcnJwZGRmlpaWrq6usrKyvr68KFiq/v7/FxcXY2Nji4uLn5+ft7e0yif9uAAAAN3RSTlMAAAApKSkqKioqg4OEhISEhoa1tra3t7y9vr7S09PT09TU+Pj5+fn5+/v7+/v7+/v7/v7+/v7+70RY/wAAAPpJREFUeF4dyWNjw2AUBeC7dfYyorM6rx1exKltzLZt2/rDa/J8OgBVVlFDX39jcTZoUqCse251a2dvu6ccUtWlanLQ4Vpel+ThlWq1l3wEz58tx4dOt1dMlAJk9A5gMjG75LHwo46hzkwosGOMbejumoRvubC9EOrMviT0E0Us9fvN9dA6zxJCNv6+ECGsb6oNWsgmpZT9/UTUZo3Em6AW34guTL4jiAudiCM1kLcw8/SmHERfT1/eueBiDqR1GK1n9w+K8nglxYxd6QAML4ztXoQuj8YFgWcgqdJp8qzty26vaboCNIxBCshyQDKov0aXr29v1ufq1PwPx5Q7bCoh6eoAAAAASUVORK5CYII='], ['Slackware', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AcEDi0qZWWDgAAAAx1JREFUOMt9kktoXHUchb/ffc1M7rySSdJMOknFPMRitLgoNKKI8ZHGKkgrjU8SitidimSh2UkXoQmoO1dGQSxJjdvOtqSaqlR0USEGSjVJGxuSmWR6M3fu4/93YX0g4rc9HA6cc4Q7DI+fpzz7PA8++2mxvZAeBZ4xhHtFcJRmXWsWvb36/OLcyxf5B/KHeYHy7DmGx1+YSDjmWTdlobTGMAStQGkNoLXS4tXDq7u7tUcWz49tA8jR8QUuzB5n5NTCV13F9JEo1JJwTLKuzU61QiOMcd0UDb+BncwQK3Rl15eNja3ui/Njq8aF2eMcO/XlBz0H8oO2ZUkum6A13WB99TtyzXlaCi24SaFa+ZFCzsG2DNnfkdbFjsI1APPhk+d6ujqznycdCxFozadYWvyMpx47wa+bPkGksKwUNnsk3TaCGASRXDZh5LpHXPPg4Rcni+3uYBxrtBbQghlscOVKmYHeEm0ZIZ9xyLffw41ND6VAa43SmjiMByzHYtjzwr9arfshxf5jOKlvKZfn8es77N2uks24PPfSFD/9Uvt7AtPKWmEU9d645eHYJo5tcKi/FX/zG+zmQxQH+rANk862DOW5N/hhaY64cJSa5xNFCgDDILZACMKYWAmh73HmzFsMlBQJ06LeiMinE1S3KzRCm5rXIIoUIoKIYCVM36urZFbEoiBLNMIhAE6/NsSB7h6SKZdL8xsUOnpx9j1KbTdARACIowArYe1ergfNT2i0mIbJys0GI6PT3N1/hJvrPxOFdRJNBQIy/FapI4Bpgohgcjuw+jq8jy8tV55MNBWI4ohS802CpizKv8q+FgALZAfYgSyAZtNro1oLaU1VvxCA029Oraxs7u/tKnXiNjn8HyKwur6lI++6vPK4V7IA7u+1Dyu1tr183ddNbkHuXP8/zEIYeFqiLRl6YO/p0bHJdflT/PD9qZa1W+ry99fcvlAlcZwUpuUAglIRYVgnDEIOlna4q0M/NPnuO1/PzMwg/045O/XeibUt5/Xangx6viSVFpK2jtMpvdyWCz+5ryf10clX3/amp6eZmJjgd441URWWJY8BAAAAAElFTkSuQmCC'], ['Trisquel', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABjFBMVEX///8AAAAAAAAAAAAAADMAAGYAAAAAHFUAGWYAF10AImYAIGAAHloAHGMAKGsAGmYAJmYAJGEAKnUAJ1gAMXYAJnEAJGQAI2EAK28AK3cAGTEAMHgALXEALXgALG0AFUAAI2oAK3EAMngANoYALXMANIAAM4IANIIAL3gANIcANokANoQANYQAOY0ANIYANooAN4kAN40AOY0APZMANIUAOY0AO5AAPZUAPJAAP5MAPpQAQJUAOYsAPpYANoUAPpoAPpUAM4AAQJkAPZIAPJEAQpgAN4cAPpQAPZUAPJEAO4oAOosAOo8AQJoAOYsAO44AQpsAO48AQp0AP5UAQpoARJwAQ58ARaAAQZgAQ54AQ50AQpgARaIARqMARaMARaIAR6QARaIARaEASakARKEAR6MASqsARKEASKcAR6MARqYAR6UATbEATa8ARqUARKAAR6oARqMASKgATK8AR6QATbIATbAASq0AR6cASKgASqwAR6UASKcATa8ASqoASqwAS6wASKoAS60ATbHn4CTpAAAAhHRSTlMAAQIFBQUGCQoLDxAREhMUFBUYGhobHB0eHh8gIiIjJCQkJCYoLC0xMTE0NDo6Oz1BQUNHSUxOVFVVVldaWl5iY2RkZWZoamtsb3FycnR1ent9f4KDhIiJioyNkJGYm5+foqOkpqamqKmqrKytsLKzs7e4uLy8v8TFxcXGx8rO0NXY2eZc4XYcAAAA00lEQVR4XkWN1VoCUQAG/3NWtwh7CTsQJOyk7BaDxuxA6bbrxf32gt25m7kZqDRYxziooDV7+1AalMUavQh2AsEZoWvzigLun+T17/c8QiJZ7qu2QKiNmyZthdcR1/as353jIeU1GxMHo5XHdqPFeX8IaDMdHPYN6dRN7LR4qQewdTa35HWkyh+fbxERAMjwlAWJv3CPSKDQ+H7XvHdkV4Pua3Gtm4sPKIF/WV8dop4VKBw/NU33B3x1JbTt+XwhkJQoqRfWvHOy28uqH8JIdomR/R+s9yR3Cso77AAAAABJRU5ErkJggg=='], ['Ubuntu', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABKVBMVEX////ojFzplGf1zbnqnHLvs5P10b3yuZv1xKrytZXvtJXys5LysI32waT0n3HxiVHwg0jxhk31kFn0h0zxf0P0hUrveTv2iU3yfkD1hEfyejv5eDLybSX0aR7zZxvyayH6ZxnxZBj4YhH7XAb5WALlUQLeTwHgUAHeTgHfTwD65NzdTQDdTQHdTgD31MfcTgLcTADcTQD////xt5/31Mf54dfmfE/dUAbeVQ/jcUDcTgHeWBnnflHohFvpjGbqkGztnX342Mz53dLgXiP65d399PHdUgrtoYLyu6Xzvaf76eLfXB/rkm/fWhvupojwrpTeVhTgYSfgYynzwa30xbL1ybnngFT31snngljhZS3539XhZzDiajbibDn77OX88Ovrl3X99vTjbz1fisGCAAAAMHRSTlMABgYGBwcHJiorMDA1NXGHjY2Nl5mZmZyfn6O5u8XHzc3X193j9fj4+vr6/f39/f08OUojAAAAx0lEQVR4Xi3HZVbDYBhGwQctWqzFPXiQ+36pu+LubvtfBKcN82/UEhld2vWXxyL6F92gbTPabse8hU/uHMx1SZoyyJWPTwq1Rs7GpYE9+Cg+OJcs1MHvU9y4fnrN31yUm18vMCIPjtw3QMndw4rs8ieVzAAcBlewpe1KM3uaBuD3Dda1BhWXAsi6AFY1a2SqifxZ+rnxWYcJDRkUS3fO1R5vwe+XZgw4D4L3RAJiknoXCVX3WeiUpJ5pIxTvVmg45pl5k4Ot/AGV2iqZBWgJJAAAAABJRU5ErkJggg=='], ['Windows', 'iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA+pJREFUOE+F0n84FHYcB3CWSsL9ojo/6ik64c6PnTjmSS0limmrpBm2G002y++xzXRz6zE0R4nbw+RnTj/WD4sbanLkkAe55ccYlyNme4SrO9u9d13PI3/saZ+/vs/3831ez+f9eb5aWsuqy2mjRYeNUa7YmtjfTico7jNJ8z0eG24NB9vvnDrvufzpq89Npnr8VjMddNmuRh9rDfp36mFg91oM7qPIc5JdbDJq3An/JfCu7Hl53W2lpS220pP2OuniN299jAYbYizSENIoAgbCTdrTKtxOJVdvGo8psUwKy7Vxe4ez1YEVudGP8YEZzyveInFJ6mZRHHqYazDspw/pJwTIuERM5JIwmUdGdyo9K7/BszGzzg6fXzZHGJ8KvzQqXKOpoIeZLjofWR++BPWyCEnPY4xFGEKWQcLjMjKmr1MwfcMYwmz/Y4KOgNki0V5k1dkjUWCK93Kp2PMFFawos8cm1gZ2GqjLXktL4mbQPHLQ4B9ZDFE5+S356fQlyuJMqzH++HnTo6ui2OO1ko9Ul+4fxfd3d4F7k4YTReqpuFS88bGZUE2QNNDobuIq8Q5CduHb7lFJaTnvnym9ergjMWD/FG8zf+aKS3G9JO5C01Asah6wUXrvALKEDoitMMHhDKrKJdg8RU2s0EB2EWWur8dd7PDPFv6dUC0Gv3kAN36VPRGP/5k5NS6lljWxG0TDiSr1VKhoPwhevRMSqkwRxDObc/DavGtpP6zoi8XOyZfhnyNEvKANBU0P8VPfI/wyNCGXSn7wlEmyA9KrgmOKGth3eDVvPfyywq2dnUEv2R9qG2rLsH7xJXziKnWcI8tlTvEC7Mu8hROlImTU9aKqcwQ1vWOihWFu+sJknmph5CvxQh87c7bNh/NXo03hrMCosyvLmMNgMF7TQL6J1dsZIUVwjKqEO+cajp5vxPN439U/gKBt8PTcYHzL/BgHCyOf4unAISj6mFC2bYC82kB5Ls460NHRUVsDeYSXpGw7UgC7sAtwShDgzdM38W7BbURXtqpqhfmB8sEQuXwoCM/6faGQuGCxyxyKWhIm+PrSD495WL3cT0hhi8Whc3NbAs9KaOyCTvrJ8qkdX19XBeTUDU00+55USFzVU2yHstcaix0mUAjJkJeuRU868Ucmk0lcguiBnMAVxjbbdHV1yeq8+u4Hgo22huSG+iQXp83ftaxW3lsPZcs6KG5T8OwaAfJiPcxlrVRVRhvF02i0F/t5VbHZ7JWDfErKTLnhE3mFPuRFepg/uxqz6TqLv6euGj3ut87t/4ylvre3t3ZehOWWO1zjSFEqMVP4GfGb/DBykJcjmaZOoLsc+hcVY/LaAgcTQAAAAABJRU5ErkJggg=='], ['OpenBSD', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAykIPu64pQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADTklEQVQ4y32RXUxTdxjGn3N6eujoKT3SUkuk3VoBGfVjgFXAsZ7WkipyYXQbuu3CzUXZmGRbssnFEseFkWzgcGzGXky9MWL8TsC4IeFgtK4oAqOnG5vMVl1pCMVWQD7b/y5M6jLdflfvxfPked/nBQA0NDSChqnGVrLuGkES742NhJAdhAKAuk9yyUs5Gry7RQMZAARCWgivpQiPe71P5DUfH0xaqTL7m/iiLkJmphawa+e4SM2PvUyC4yUIBu8CnAQKAK53rCA5OUtQtStVpJ4Gw/FOBddZVKhCfq4MP4n6+at+DUsJm/e0G9JZzYEvI2tHwlEYjDxomkZ+3nG8WroRtHihZVOhVlorDQzh0okhcByDP4ZGcf+X9XAsvY5/RsBa7Kq5H/CqLctKyl/g08S2i6fq8W/MS3P34T9wNDVYSeDX1eTD9xhiLXbtB/Akwmmv6Kr+ICFkLpGhtNSM3qsSstS3oX8lSsmsxS6ZVn3j6PvVVqhUcvC8AtPxVPxwygVKvngN89WOjgVprggGA4eenjB4nsXsTASpC63I0wVTZYPR11FoKRB8Ax54PCFk6BhMTk5CPR3GSbHouGzknr/bYFq9EAvfc9Tu1sLjHcXNKxLuTOTgzOlOe7IHBc/beAXWpWmXlz8a84nhcLQ+ecVzsAEQrMWuMX+f9HZF2YPZ28FVSNfoPWqOzMUmqYMAJm7+/OOzXQFwHGpyEV+vi+yvtxBC9pDmpgJC4tvI3mo9GTitIxvW24nT7ug67HY/3eDs2bbyrVsrY2day70rV6kRfDAHk5lDLJqAmmeRiD9GJDKHvwb74R8G0mkTPjrQTTG122xkTTbwaV2b1H4u16JQKXGr7yG2b8/H1MQ09IsTSEmRwzf4CCwzD+dmE1re8CI7wwi5XNlFf9vaTXX4dWJg4LLl7h05fpNGwNAMWpp9CIVYNO/tRCzGwpDFQaVMQTS2CKY0BWr3GVGWNSXKACDDaA4Mh976pq9f5Sy09GgKlmeAMIBKzUKpU+BFoxJecRhUfAbMxDi4eADfHVmE79v7q575gvvYeVvjZ58LD5mwsKUyX0hnf0feslnQCWD4zxnc6reKisxsfH2oscqcmTmK/+Ow252cna7K52r+Bky6PqmoT5HBAAAAAElFTkSuQmCC'], ['Gnu', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAywUV5gQrwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADcElEQVQ4y43Tb0jjBRzH8c9v+7nNMebcUW21Cc78g/wcuhByIScoMRwoTBmFlZCmIJ14axqkgoYIkXIqKIVBEuJNUBEUPRlpqDC3Q2Ex0nTezun2YOaPLXNIv7Vvj7zgiOj1+PPk/eADjuNEuHN6ekqMw+H4IzMz8xChUCjV1NT0JbO7uxtfXFy8NZvNr21tbd0AAEQikY6I0m1tbQbx2NjYZiqV+vn29jY+PDw8xhYWFj45PDzcb25uhlQqfSTief6X0dFRpqKigvF4PPPipaWlY7lcXhCLxXJnZmY+ZTY2NnzX19ePGxsbHw0MDLivrq5mc3Jy2pPJZLVWq/2cdbvdDSzLholoNJ1OMy6Xq0Ymk5HNZktOTU29qMgA8HYqlaKDgwNKp9M0PT09BgAM/iGuqqoimUx2yPP8U5/P9wEAMB0dHRUKheJHiUTyeGhoqAUAnE7nR0qlsjcQCLwjlsvlz+bm5mQWi0VSWlr6bXV1tU6hUMj6+/vfN5lMN0xxcfG1zWZ7SETTSqWSGhoamPHxcajV6s+8Xu9Xou7u7t9VKtW00+mkSCTC6PV6aDQa8Dw/Wl9fP8UAQCgUosvLSyovL2eWl5dRUFBw7Ha7v9vc3By5K3g1EAg8FQSBiIguLi4IgBwA2LtEjuPuJxKJ62AwKFpdXf0eQBIvYVmW/cLlchEAWK1WAADT09NzX6PR/OTz+eKVlZUzKpVqTyqVvsnzfLCkpGSrtrb2t97eXnFeXl5ZKpWyZ2RkPPP7/UUnJyefGI3GU+zt7aU4jotOTk7mAUBfX1+b1Wq9kcvlBIAcDgctLCyQxWKhoqIi6uzs/BoAVlZW3qqpqbllZmdnf1hfX//Q4/HEzWbzX+3t7fcMBgMFg0EYjUYmEolAEAREo1Hk5+fT+fk5Mzg4GD86OpJ0dXXJGQBoaWl5Ra/XP6yrq3tQVlam2N7ehslkAsuySCaTUKvVSCQS2NnZSXAcJxYEQTEyMvKeIAhLDADY7fZ7BoPhm6ysLFpbWzuan5//WKvVvsHzPEWjUSYSiSA3N5d0Oh0TjUaf+/1+S2Nj46/4FwYAr7e2tnbF4/E/iYjC4TCFw+F0LBaj/f19mpiYeID/IAagAyABYLXb7cLZ2Rml02nyer3POY6rwv8hEr34u0IkEk1mZ2cTgGMA7768/RtL5JKsGzrLIgAAAABJRU5ErkJggg=='], ['CrunchBang', 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAywUV5gQrwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADcElEQVQ4y43Tb0jjBRzH8c9v+7nNMebcUW21Cc78g/wcuhByIScoMRwoTBmFlZCmIJ14axqkgoYIkXIqKIVBEuJNUBEUPRlpqDC3Q2Ex0nTezun2YOaPLXNIv7Vvj7zgiOj1+PPk/eADjuNEuHN6ekqMw+H4IzMz8xChUCjV1NT0JbO7uxtfXFy8NZvNr21tbd0AAEQikY6I0m1tbQbx2NjYZiqV+vn29jY+PDw8xhYWFj45PDzcb25uhlQqfSTief6X0dFRpqKigvF4PPPipaWlY7lcXhCLxXJnZmY+ZTY2NnzX19ePGxsbHw0MDLivrq5mc3Jy2pPJZLVWq/2cdbvdDSzLholoNJ1OMy6Xq0Ymk5HNZktOTU29qMgA8HYqlaKDgwNKp9M0PT09BgAM/iGuqqoimUx2yPP8U5/P9wEAMB0dHRUKheJHiUTyeGhoqAUAnE7nR0qlsjcQCLwjlsvlz+bm5mQWi0VSWlr6bXV1tU6hUMj6+/vfN5lMN0xxcfG1zWZ7SETTSqWSGhoamPHxcajV6s+8Xu9Xou7u7t9VKtW00+mkSCTC6PV6aDQa8Dw/Wl9fP8UAQCgUosvLSyovL2eWl5dRUFBw7Ha7v9vc3By5K3g1EAg8FQSBiIguLi4IgBwA2LtEjuPuJxKJ62AwKFpdXf0eQBIvYVmW/cLlchEAWK1WAADT09NzX6PR/OTz+eKVlZUzKpVqTyqVvsnzfLCkpGSrtrb2t97eXnFeXl5ZKpWyZ2RkPPP7/UUnJyefGI3GU+zt7aU4jotOTk7mAUBfX1+b1Wq9kcvlBIAcDgctLCyQxWKhoqIi6uzs/BoAVlZW3qqpqbllZmdnf1hfX//Q4/HEzWbzX+3t7fcMBgMFg0EYjUYmEolAEAREo1Hk5+fT+fk5Mzg4GD86OpJ0dXXJGQBoaWl5Ra/XP6yrq3tQVlam2N7ehslkAsuySCaTUKvVSCQS2NnZSXAcJxYEQTEyMvKeIAhLDADY7fZ7BoPhm6ysLFpbWzuan5//WKvVvsHzPEWjUSYSiSA3N5d0Oh0TjUaf+/1+S2Nj46/4FwYAr7e2tnbF4/E/iYjC4TCFw+F0LBaj/f19mpiYeID/IAagAyABYLXb7cLZ2Rml02nyer3POY6rwv8hEr34u0IkEk1mZ2cTgGMA7768/RtL5JKsGzrLIgAAAABJRU5ErkJggg=='], ['Yuno', 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAYAAAD+pA/bAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAABDtJREFUOE+FlHtMm1UYxrtsi8aEgCb+oTFmZur+WNS5RaPERU10C2qGaBgb6hgwLwMmHTIKlIKlQIHSQrmU24BSSmnpBVooUmihtEC5yKWDjVu5uOkcEca4lG5E93j6EQmELX7Jky/fOed9fu973vMdGu0xT3Cgz57yXMZLDdXcy821PFWLKmuA6HqLMqtLX5POl4iYb2ukWW8IOOFe/qfe3/M4n0eOjwyZD8//bldODOk37N1yDJgl+LVdjEGLFKO9KkzZm8hbje7mIrTXZ7sMtTydrJh15H8hHW11XvN/jGS7VudcD5w34ZZzeQYb67fwYO03LN4exo1+LWzNxbA05O5QuzbHqRYn+++CHDx4YK9WLfaedfQzV5em54g5Zbi8OIml+VFMDLWQ7GXoaSmFWZsDZVGCO2u0EbkhHTrhFqi9PmelSsQ8tAtSVch60dpUeGe4kxgZxegzVkBzlQ2NKBG2+iJIMqMok9r8OLRIMqApToSqmAWTmk9B2+o2YW79oshU7ABcuvAFrVGWXkVKpBYoSaBSxIS2mINpiwbjZiUMZRloVfJQyaXDKObBpimBScpHFe8KmmXpaKhK3arGrBVuVBclHN2CiPNin1OVs1tVJYlQlyZBxA6DviQVo6ZaOKd7sTplw53BVugruBBzfsRslw7rZPxaczWutSpQV/gzJPxo1JexyfaxKBBpuiEx+tw+CpKdEvGWTprGlhcwqbIzL5/DYKMYndpK3L1hxf3ZfkrzwybUZjPhnOqmvlcmutFF1jis9QSShOrcWNSXJ1MA0ou/NZWc8Ddfe4VGO3bk0JON1dyMMlK+gmxNrZCFhZF2Kng7YNO0awt4b7wLNp2EqtAsF6ImP56SG0B6siovTYpIjg15gapCVhAfJRUyIBFEo6k8AyuTtkcC/qvG/XbDexulWJvqgYH0o0nKhVHFJ40XwFQnWM5OCX+XMg86c3KvVMSMapCmPpSTIygTxGKZZOcOXhrr3Mp4uzkFuG6B3ajE3TELDDU8qEmsmvRATxquKkxAnSTFjwKEfv3JU9JC5unG6rQ1bTkbQ4Yq/DVgxOqwBWt2K9Yne3ZCZvrgHO2k5paHzOhSiVCZSkdNTgzy40JRlPgDhDHBCxUZdCs91G8fLeK87zOl6XSOICZYXMGNhDqX9fDP/mbK2DXVi/szm03eLpejl5pzOfqwOt4JBT8OeYwQt/4R/BR0OzXiLCM5LOCji/4nXt46rpywgG+zor5RxgSdupBzJdglSY+5ZZbl3XNY6mbn7W0Lcx06zBg1WBjtcC6OmG+OmRTrFrnIUZESZeVeCpwh8TpiPsQ47/tloM97T+/6m8mg55mT3tStyL54mhlwwtszNvjzD8/6HH8i7PvvPPRioZdRWuDBZUR6pEWG7I8P9Xs1Jsj36MfvvO5J/+rTw58dP7afJPfBgeef3XGz/gskFVpJc4HwGwAAAABJRU5ErkJggg==']]
    }
  };

  Banner = {
    init: function() {
      return $.asap((function() {
        return d.body;
      }), function() {
        return $.asap((function() {
          return $('.abovePostForm');
        }), Banner.ready);
      });
    },
    ready: function() {
      var banner, child, children, i, nodes, title;

      banner = $(".boardBanner");
      title = $.el("div", {
        id: "boardTitle"
      });
      children = banner.children;
      i = children.length;
      nodes = [];
      while (i--) {
        child = children[i];
        if (child.tagName.toLowerCase() === "img") {
          child.id = "Banner";
          continue;
        }
        if (Conf['Custom Board Titles']) {
          Banner.custom(child);
        }
        nodes.push(child);
      }
      $.add(title, nodes.reverse());
      $.after(banner, title);
    },
    cb: {
      click: function(e) {
        if (e.shiftKey) {
          return this.contentEditable = true;
        }
      },
      keydown: function(e) {
        return e.stopPropagation();
      },
      focus: function() {
        var items, string;

        string = "" + g.BOARD + "." + this.className;
        items = {
          title: this.innerHTML
        };
        items["" + string] = '';
        items["" + string + ".orig"] = false;
        $.get(items, function(items) {
          if (!(items["" + string + ".orig"] && items.title === items["" + string])) {
            return $.set("" + string + ".orig", items.title);
          }
        });
        return this.textContent = this.innerHTML;
      },
      blur: function() {
        $.set("" + g.BOARD + "." + this.className, this.textContent);
        this.innerHTML = this.textContent;
        return this.contentEditable = false;
      }
    },
    custom: function(child) {
      var cachedTest;

      cachedTest = child.innerHTML;
      $.get("" + g.BOARD + "." + child.className, cachedTest, function(item) {
        var title;

        if (!(title = item["" + g.BOARD + "." + child.className])) {
          return;
        }
        if (Conf['Persistent Custom Board Titles']) {
          return child.innerHTML = title;
        } else {
          return $.get("" + g.BOARD + "." + child.className + ".orig", cachedTest, function(itemb) {
            if (cachedTest === itemb["" + g.BOARD + "." + child.className + ".orig"]) {
              return child.innerHTML = title;
            } else {
              $.set("" + g.BOARD + "." + child.className, cachedTest);
              return $.set("" + g.BOARD + "." + child.className + ".orig", cachedTest);
            }
          });
        }
      });
      $.on(child, 'click', Banner.cb.click);
      $.on(child, 'keydown', Banner.cb.keydown);
      $.on(child, 'focus', Banner.cb.focus);
      return $.on(child, 'blur', Banner.cb.blur);
    }
  };

  GlobalMessage = {
    init: function() {
      return $.asap((function() {
        return d.body;
      }), function() {
        return $.asap((function() {
          return $.id('delform');
        }), GlobalMessage.ready);
      });
    },
    ready: function() {
      var child, el, _i, _len, _ref;

      if (el = $("#globalMessage", d.body)) {
        _ref = el.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          child.cssText = "";
        }
      }
    }
  };

  Rice = {
    init: function() {
      $.ready(function() {
        return Rice.nodes(d.body);
      });
      return Post.prototype.callbacks.push({
        name: 'Rice Checkboxes',
        cb: this.node
      });
    },
    cb: {
      check: function() {
        return this.check.click();
      },
      option: function(e) {
        var container, select;

        e.stopPropagation();
        e.preventDefault();
        select = Rice.input;
        container = select.nextElementSibling;
        container.firstChild.textContent = this.textContent;
        select.value = this.getAttribute('data-value');
        $.event('change', null, select);
        return Rice.cleanup();
      },
      select: function(e) {
        var clientHeight, li, nodes, option, rect, select, style, ul, _i, _len, _ref;

        e.stopPropagation();
        e.preventDefault();
        ul = Rice.ul;
        if (!ul) {
          Rice.ul = ul = $.el('ul', {
            id: "selectrice"
          });
          $.add(d.body, ul);
        }
        if (ul.children.length > 0) {
          return Rice.cleanup();
        }
        rect = this.getBoundingClientRect();
        clientHeight = d.documentElement.clientHeight;
        style = ul.style;
        style.cssText = ("width: " + rect.width + "px; left: " + rect.left + "px;") + (clientHeight - rect.bottom < 200 ? "bottom: " + (clientHeight - rect.top) + "px" : "top: " + rect.bottom + "px");
        Rice.input = select = this.previousSibling;
        nodes = [];
        _ref = select.options;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          option = _ref[_i];
          li = $.el('li', {
            textContent: option.textContent
          });
          li.setAttribute('data-value', option.value);
          $.on(li, 'click', Rice.cb.option);
          nodes.push(li);
        }
        $.add(ul, nodes);
        $.on(ul, 'click scroll blur', function(e) {
          return e.stopPropagation();
        });
        return $.on(d, 'click scroll blur resize', Rice.cleanup);
      }
    },
    cleanup: function() {
      var child, _i, _len, _ref;

      $.off(d, 'click scroll blur resize', Rice.cleanup);
      _ref = __slice.call(Rice.ul.children);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        $.rm(child);
      }
    },
    nodes: function(root) {
      var checkboxes, checkrice, input, select, selectrice, selects, _i, _j, _len, _len1;

      root || (root = d.body);
      checkboxes = $$('[type=checkbox]:not(.riced)', root);
      checkrice = Rice.checkbox;
      for (_i = 0, _len = checkboxes.length; _i < _len; _i++) {
        input = checkboxes[_i];
        checkrice(input);
      }
      selects = $$('select:not(.riced)', root);
      selectrice = Rice.select;
      for (_j = 0, _len1 = selects.length; _j < _len1; _j++) {
        select = selects[_j];
        selectrice(select);
      }
    },
    node: function() {
      return Rice.checkbox($('.postInfo input', this.nodes.post));
    },
    checkbox: function(input) {
      var div;

      if ($.hasClass(input, 'riced')) {
        return;
      }
      $.addClass(input, 'riced');
      div = $.el('div', {
        className: 'rice'
      });
      div.check = input;
      $.after(input, div);
      if (div.parentElement.tagName !== 'LABEL') {
        return $.on(div, 'click', Rice.cb.check);
      }
    },
    select: function(select) {
      var div;

      $.addClass(select, 'riced');
      div = $.el('div', {
        className: 'selectrice',
        innerHTML: "<div>" + (select.options[select.selectedIndex].textContent || null) + "</div>"
      });
      $.on(div, "click", Rice.cb.select);
      return $.after(select, div);
    }
  };

  /*
    JSColor
    http://github.com/hotchpotch/jscolor/tree/master
  
    JSColor is color library for JavaScript.
    JSColor code is porting from AS3 Color library ColorSB < http://sketchbook.libspark.org/trac/wiki/ColorSB >.
  */


  JSColor = {
    css: function() {
      var agent;

      agent = Style.agent;
      return ".jscBox {\nwidth: 251px;\nheight: 155px;\n}\n.jscBoxB,\n.jscPadB,\n.jscPadM,\n.jscSldB,\n.jscSldM,\n.jscBtn {\nposition: absolute;\nclear: both;\n}\n.jscBoxB {\nleft: 320px;\nbottom: 20px;\nz-index: 30;\nborder: 1px solid;\nborder-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;\nbackground: ThreeDFace;\n}\n.jscPad {\nwidth: 181px;\nheight: 101px;\nbackground-image: " + agent + "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1)), " + agent + "linear-gradient(left, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);\nbackground-repeat: no-repeat;\nbackground-position: 0 0;\n}\n.jscPadB {\nleft: 10px;\ntop: 10px;\nborder: 1px solid;\nborder-color: ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow;\n}\n.jscPadM {\nleft: 0;\ntop: 0;\nwidth: 200px;\nheight: 121px;\ncursor: crosshair;\nbackground-image: url('data:image/gif;base64,R0lGODlhDwAPAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAPAA8AAAIklB8Qx53b4otSUWcvyiz4/4AeQJbmKY4p1HHapBlwPL/uVRsFADs=');\nbackground-repeat: no-repeat;\n}\n.jscSld {\nwidth: 16px;\nheight: 101px;\nbackground-image: " + agent + "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1));\n}\n.jscSldB {\nright: 10px;\ntop: 10px;\nborder: 1px solid;\nborder-color: ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow;\n}\n.jscSldM {\nright: 0;\ntop: 0;\nwidth: 36px;\nheight: 121px;\ncursor: pointer;\nbackground-image: url('data:image/gif;base64,R0lGODlhBwALAKECAAAAAP///6g8eKg8eCH5BAEKAAIALAAAAAAHAAsAAAITTIQYcLnsgGxvijrxqdQq6DRJAQA7');\nbackground-repeat: no-repeat;\n}\n.jscBtn {\nright: 10px;\nbottom: 10px;\npadding: 0 15px;\nheight: 18px;\nborder: 1px solid;\nborder-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;\ncolor: ButtonText;\ntext-align: center;\ncursor: pointer;\n}\n.jscBtnS {\nline-height: 10px;\n}";
    },
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
    fireEvent: function(el, event) {
      if (!el) {
        return;
      }
      return $.event(event, null, el);
    },
    getRelMousePos: function(e) {
      var x, y;

      e || (e = window.event);
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
        var box, boxB, btn, btnS, elements, item, p, pad, padB, padM, sld, sldB, sldM, _i, _len;

        if (!(p = JSColor.picker)) {
          elements = ['box', 'boxB', 'pad', 'padB', 'padM', 'sld', 'sldB', 'sldM', 'btn'];
          p = {};
          for (_i = 0, _len = elements.length; _i < _len; _i++) {
            item = elements[_i];
            p[item] = $.el('div', {
              className: "jsc" + (item.capitalize())
            });
          }
          p.btnS = $.el('span', {
            className: 'jscBtnS'
          });
          p.btnT = $.tn('Close');
          JSColor.picker = p;
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
      position = "" + (Conf['Mascot Position'] === 'bottom' || !(Conf['Mascot Position'] === "default" && Conf['Post Form Style'] === "fixed") ? 0 + ((g.VIEW !== 'thread' || Conf['Boards Navigation'] === 'sticky bottom') && Conf['4chan SS Navigation'] ? 1.6 : 0) : 20.3 + (g.VIEW !== 'thread' || !!$('#postForm input[name=spoiler]') ? 1.4 : 0) + (Conf['Show Post Form Header'] ? 1.5 : 0) + (Conf['Post Form Decorations'] ? 0.2 : 0)) + "em";
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
          return MascotTools.init();
        }
        MascotTools.addMascot(mascot);
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
      return Style.mascot.textContent = "#mascot img {\n  position: fixed;\n  z-index: " + (Conf['Mascots Overlap Posts'] ? '3' : '-1') + ";\n  " + (Style.sidebarLocation[0] === "left" ? "" + Style.agent + "transform: scaleX(-1);" : "") + "\n  bottom: " + (mascot.position === 'top' ? 'auto' : (mascot.position === 'bottom' && Conf['Mascot Position'] === 'default') || !$.id('postForm') ? '0' : position) + ";\n  " + location + ": " + ((mascot.hOffset || 0) + (Conf['Sidebar'] === 'large' && mascot.center ? 25 : 0)) + "px;\n  top: " + (mascot.position === 'top' ? '0' : 'auto') + ";\n  height: " + (mascot.height && isNaN(parseFloat(mascot.height)) ? mascot.height : mascot.height ? parseInt(mascot.height, 10) + 'px' : 'auto') + ";\n  width: " + (mascot.width && isNaN(parseFloat(mascot.width)) ? mascot.width : mascot.width ? parseInt(mascot.width, 10) + 'px' : 'auto') + ";\n  margin-" + location + ": " + (mascot.hOffset || 0) + "px;\n  margin-bottom: " + (mascot.vOffset || 0) + "px;\n  opacity: " + Conf['Mascot Opacity'] + ";\n  pointer-events: none;\n  " + (filters.length > 0 ? "filter: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"filters\">" + filters.join("") + "</filter></svg>#filters');" : "") + "\n}";
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
        name: ["Mascot Name", "", "text"],
        image: ["Image", "", "text"],
        category: ["Category", MascotTools.categories[0], "select", MascotTools.categories],
        position: ["Position", "default", "select", ["default", "top", "bottom"]],
        height: ["Height", "auto", "text"],
        width: ["Width", "auto", "text"],
        vOffset: ["Vertical Offset", "0", "number"],
        hOffset: ["Horizontal Offset", "0", "number"],
        center: ["Center Mascot", false, "checkbox"]
      };
      dialog = $.el("div", {
        id: "mascotConf",
        className: "reply dialog",
        innerHTML: "<div id=mascotbar></div><hr><div id=mascotcontent></div><div id=save>  <a href='javascript:;'>Save Mascot</a></div><div id=close>  <a href='javascript:;'>Close</a></div>"
      });
      for (name in layout) {
        item = layout[name];
        switch (item[2]) {
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
            optionHTML = "<div class=optionlabel>" + item[0] + "</div><div class=option><select name='" + name + "' value='" + value + "'><br>";
            _ref = item[3];
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
              innerHTML: "<label><input type=" + item[2] + " class=field name='" + name + "' " + (value ? 'checked' : void 0) + ">" + item[0] + "</label>"
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
      Rice.nodes(dialog);
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
        innerHTML: "<div class=optionlabel>" + item[0] + "</div><div class=option><input type=" + item[2] + " class=field name='" + name + "' placeholder='" + item[0] + "' value='" + value + "'></div>"
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
      var image, name, type, _i, _len, _ref;

      name = mascot.name, image = mascot.image;
      if ((name == null) || name === "") {
        alert("Please name your mascot.");
        return;
      }
      if ((image == null) || image === "") {
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
      return $.get("userMascots", {}, function(item) {
        var userMascots;

        userMascots = item['userMascots'];
        userMascots[name] = Mascots[name];
        $.set('userMascots', userMascots);
        return alert("Mascot \"" + name + "\" saved.");
      });
    },
    close: function() {
      Conf['editMode'] = false;
      editMascot = {};
      $.rm($.id('mascotConf'));
      Style.addStyle();
      return Settings.open("mascots");
    },
    importMascot: function(evt) {
      var file, reader;

      file = evt.target.files[0];
      reader = new FileReader();
      reader.onload = function(e) {
        var err, imported, name;

        try {
          imported = JSON.parse(e.target.result);
        } catch (_error) {
          err = _error;
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
        $.get("userMascots", {}, function(item) {
          var userMascots;

          userMascots = item['userMascots'];
          userMascots[name] = Mascots[name];
          return $.set('userMascots', userMascots);
        });
        alert("Mascot \"" + name + "\" imported!");
        $.rm($("#mascotContainer", d.body));
        return Settings.open('mascots');
      };
      return reader.readAsText(file);
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
        $.get("userThemes", {}, function(items) {
          if (items[key]) {
            return editTheme["Theme"] = key;
          } else {
            return editTheme["Theme"] = key += " [custom]";
          }
        });
      } else {
        editTheme = JSON.parse(JSON.stringify(Themes['Yotsuba B']));
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
              value: "#" + (Style.colorToHex(input.value) || 'aaaaaa')
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
            this.nextSibling.value = "#" + (Style.colorToHex(this.value) || 'aaaaaa');
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
        var bgColor, bgRPA, blinkColor, brderColor, err, imported, inputColor, inputbColor, jlinkColor, linkColor, linkHColor, mainColor, name, nameColor, quoteColor, sageColor, textColor, timeColor, titleColor, tripColor, userThemes;

        try {
          imported = JSON.parse(e.target.result);
        } catch (_error) {
          err = _error;
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
              'Background Image': "url('" + (imported.bgImg || '') + "')",
              'Background Attachment': "" + (bgRPA[3] || ''),
              'Background Position': "" + (bgRPA[1] || '') + " " + (bgRPA[2] || ''),
              'Background Repeat': "" + (bgRPA[0] || ''),
              'Background Color': "rgb(" + bgColor.rgb + ")",
              'Dialog Background': "rgba(" + mainColor.rgb + ",.98)",
              'Dialog Border': "rgb(" + brderColor.rgb + ")",
              'Thread Wrapper Background': "rgba(0,0,0,0)",
              'Thread Wrapper Border': "rgba(0,0,0,0)",
              'Reply Background': "rgba(" + mainColor.rgb + "," + imported.replyOp + ")",
              'Reply Border': "rgb(" + brderColor.rgb + ")",
              'Highlighted Reply Background': "rgba(" + (mainColor.shiftRGB(4, true)) + ", " + imported.replyOp + ")",
              'Highlighted Reply Border': "rgb(" + linkColor.rgb + ")",
              'Backlinked Reply Outline': "rgb(" + linkColor.rgb + ")",
              'Checkbox Background': "rgba(" + inputColor.rgb + ", " + imported.replyOp + ")",
              'Checkbox Border': "rgb(" + inputbColor.rgb + ")",
              'Checkbox Checked Background': "rgb(" + inputColor.rgb + ")",
              'Input Background': "rgba(" + inputColor.rgb + ", " + imported.replyOp + ")",
              'Input Border': "rgb(" + inputbColor.rgb + ")",
              'Hovered Input Background': "rgba(" + inputColor.hover + ", " + imported.replyOp + ")",
              'Hovered Input Border': "rgb(" + inputbColor.rgb + ")",
              'Focused Input Background': "rgba(" + inputColor.hover + ", " + imported.replyOp + ")",
              'Focused Input Border': "rgb(" + inputbColor.rgb + ")",
              'Buttons Background': "rgba(" + inputColor.rgb + ", " + imported.replyOp + ")",
              'Buttons Border': "rgb(" + inputbColor.rgb + ")",
              'Navigation Background': "rgba(" + bgColor.rgb + ", 0.8)",
              'Navigation Border': "rgb(" + mainColor.rgb + ")",
              'Quotelinks': "rgb(" + linkColor.rgb + ")",
              'Links': "rgb(" + linkColor.rgb + ")",
              'Hovered Links': "rgb(" + linkHColor.rgb + ")",
              'Navigation Links': "rgb(" + textColor.rgb + ")",
              'Hovered Navigation Links': "rgb(" + linkHColor.rgb + ")",
              'Subjects': "rgb(" + titleColor.rgb + ")",
              'Names': "rgb(" + nameColor.rgb + ")",
              'Sage': "rgb(" + sageColor.rgb + ")",
              'Tripcodes': "rgb(" + tripColor.rgb + ")",
              'Emails': "rgb(" + linkColor.rgb + ")",
              'Post Numbers': "rgb(" + linkColor.rgb + ")",
              'Text': "rgb(" + textColor.rgb + ")",
              'Backlinks': "rgb(" + linkColor.rgb + ")",
              'Greentext': "rgb(" + quoteColor.rgb + ")",
              'Board Title': "rgb(" + textColor.rgb + ")",
              'Timestamps': "rgb(" + timeColor.rgb + ")",
              'Inputs': "rgb(" + textColor.rgb + ")",
              'Warnings': "rgb(" + sageColor.rgb + ")",
              'Shadow Color': "rgba(0,0,0,0.1)",
              'Custom CSS': ".rice {\nbox-shadow:rgba(" + mainColor.shiftRGB(32) + (",.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n " + (imported.customCSS || ''))
            };
          } else if (origin === "SS") {
            Themes[name] = {
              'Author': "Anonymous",
              'Author Tripcode': "!.pC/AHOKAg",
              'Background Image': "url('" + (imported.bgImg || '') + "')",
              'Background Attachment': "" + (bgRPA[3] || ''),
              'Background Position': "" + (bgRPA[1] || '') + " " + (bgRPA[2] || ''),
              'Background Repeat': "" + (bgRPA[0] || ''),
              'Background Color': "rgb(" + bgColor.rgb + ")",
              'Dialog Background': "rgba(" + mainColor.rgb + ", .98)",
              'Dialog Border': "rgb(" + brderColor.rgb + ")",
              'Thread Wrapper Background': "rgba(" + mainColor.rgb + ", .5)",
              'Thread Wrapper Border': "rgba(" + brderColor.rgb + ", .9)",
              'Reply Background': "rgba(" + mainColor.rgb + ", .9)",
              'Reply Border': "rgb(" + brderColor.rgb + ")",
              'Highlighted Reply Background': "rgba(" + (mainColor.shiftRGB(4, true)) + ", .9)",
              'Highlighted Reply Border': "rgb(" + linkColor.rgb + ")",
              'Backlinked Reply Outline': "rgb(" + linkColor.rgb + ")",
              'Checkbox Background': "rgba(" + inputColor.rgb + ", .9)",
              'Checkbox Border': "rgb(" + inputbColor.rgb + ")",
              'Checkbox Checked Background': "rgb(" + inputColor.rgb + ")",
              'Input Background': "rgba(" + inputColor.rgb + ", .9)",
              'Input Border': "rgb(" + inputbColor.rgb + ")",
              'Hovered Input Background': "rgba(" + inputColor.hover + ", .9)",
              'Hovered Input Border': "rgb(" + inputbColor.rgb + ")",
              'Focused Input Background': "rgba(" + inputColor.hover + ", .9)",
              'Focused Input Border': "rgb(" + inputbColor.rgb + ")",
              'Buttons Background': "rgba(" + inputColor.rgb + ", .9)",
              'Buttons Border': "rgb(" + inputbColor.rgb + ")",
              'Navigation Background': "rgba(" + bgColor.rgb + "', 0.8)",
              'Navigation Border': "rgb(" + mainColor.rgb + ")",
              'Quotelinks': "rgb(" + linkColor.rgb + ")",
              'Links': "rgb(" + linkColor.rgb + ")",
              'Hovered Links': "rgb(" + linkHColor.rgb + ")",
              'Navigation Links': "rgb(" + textColor.rgb + ")",
              'Hovered Navigation Links': "rgb(" + linkHColor.rgb + ")",
              'Subjects': "rgb(" + titleColor.rgb + ")",
              'Names': "rgb(" + nameColor.rgb + ")",
              'Sage': "rgb(" + sageColor.rgb + ")",
              'Tripcodes': "rgb(" + tripColor.rgb + ")",
              'Emails': "rgb(" + linkColor.rgb + ")",
              'Post Numbers': "rgb(" + linkColor.rgb + ")",
              'Text': "rgb(" + textColor.rgb + ")",
              'Backlinks': "rgb(" + linkColor.rgb + ")",
              'Greentext': "rgb(" + quoteColor.rgb + ")",
              'Board Title': "rgb(" + textColor.rgb + ")",
              'Timestamps': "rgb(" + timeColor.rgb + ")",
              'Inputs': "rgb(" + textColor.rgb + ")",
              'Warnings': "rgb(" + sageColor.rgb + ")",
              'Shadow Color': "rgba(0,0,0,0.1)",
              'Custom CSS': ".board {\npadding: 1px 2px;\n}\n.rice {\nbox-shadow:rgba(" + mainColor.shiftRGB(32) + (",.3) 0 1px;\n}\ninput[type=password]:hover,\ninput[type=text]:not([disabled]):hover,\ninput#fs_search:hover,\ninput.field:hover,\n.webkit select:hover,\ntextarea:hover,\n#options input:not([type=checkbox]):hover {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\ninput[type=password]:focus,\ninput[type=text]:focus,\ninput#fs_search:focus,\ninput.field:focus,\n.webkit select:focus,\ntextarea:focus,\n#options input:focus {\n  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;\n}\nbutton,\ninput,\ntextarea,\n.rice {\n  transition:background .2s,box-shadow .2s;\n}\n " + (imported.customCSS || ''))
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
        return Settings.open('themes');
      };
      return reader.readAsText(file);
    },
    save: function(theme) {
      var name;

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
      return $.get("userThemes", {}, function(item) {
        var userThemes;

        userThemes = item["userThemes"];
        userThemes[name] = Themes[name];
        $.set('userThemes', userThemes);
        $.set("theme", Conf['theme'] = name);
        return alert("Theme \"" + name + "\" saved.");
      });
    },
    close: function() {
      Conf['editMode'] = false;
      $.rm($.id('themeConf'));
      Style.addStyle();
      return Settings.open('themes');
    }
  };

  Settings = {
    init: function() {
      var link, settings;

      link = $.el('a', {
        id: 'appchanOptions',
        className: 'settings-link',
        href: 'javascript:;'
      });
      $.on(link, 'click', Settings.open);
      $.asap((function() {
        return d.body;
      }), function() {
        if (!Main.isThisPageLegit()) {
          return;
        }
        return $.asap((function() {
          return $.id('boardNavMobile');
        }), function() {
          return $.prepend($.id('navtopright'), [$.tn(' ['), link, $.tn('] ')]);
        });
      });
      $.get('previousversion', null, function(item) {
        var changelog, curr, el, prev, previous;

        if (previous = item['previousversion']) {
          if (previous === g.VERSION) {
            return;
          }
          prev = previous.match(/\d+/g).map(Number);
          curr = g.VERSION.match(/\d+/g).map(Number);
          if (!(prev[0] <= curr[0] && prev[1] <= curr[1] && prev[2] <= curr[2])) {
            return;
          }
          changelog = 'https://github.com/zixaphir/appchan-x/blob/Av2/CHANGELOG.md';
          el = $.el('span', {
            innerHTML: "appchan x has been updated to <a href='" + changelog + "' target=_blank>version " + g.VERSION + "</a>."
          });
          new Notification('info', el, 30);
        } else {
          $.on(d, '4chanXInitFinished', Settings.open);
        }
        return $.set({
          lastupdate: Date.now(),
          previousversion: g.VERSION
        });
      });
      Settings.addSection('Style', Settings.style);
      Settings.addSection('Themes', Settings.themes);
      Settings.addSection('Mascots', Settings.mascots);
      Settings.addSection('Script', Settings.main);
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
      var dialog, link, links, overlay, section, sectionToOpen, _i, _len, _ref;

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
      if (Settings.overlay) {
        return;
      }
      $.event('CloseMenu');
      Settings.dialog = dialog = $.el('div', {
        id: 'appchanx-settings',
        "class": 'dialog',
        innerHTML: "<nav>\n  <div class=sections-list></div>\n  <div class=credits>\n    <a href='http://zixaphir.github.com/appchan-x/' target=_blank>appchan x</a> |\n    <a href='https://github.com/zixaphir/appchan-x/blob/Av2/CHANGELOG.md' target=_blank>" + g.VERSION + "</a> |\n    <a href='https://github.com/zixaphir/appchan-x/blob/Av2/CONTRIBUTING.md#reporting-bugs' target=_blank>Issues</a> |\n    <a href=javascript:; class=close title=Close>×</a>\n  </div>\n</nav>\n<hr>\n<div class=section-container><section></section></div>"
      });
      Settings.overlay = overlay = $.el('div', {
        id: 'overlay'
      });
      links = [];
      _ref = Settings.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        link = $.el('a', {
          className: "tab-" + section.hyphenatedTitle,
          textContent: section.title,
          href: 'javascript:;'
        });
        $.on(link, 'click', Settings.openSection.bind(section));
        links.push(link);
        if (section.title === openSection) {
          sectionToOpen = link;
        }
      }
      $.add($('.sections-list', dialog), links);
      (sectionToOpen ? sectionToOpen : links[0]).click();
      $.on($('.close', dialog), 'click', Settings.close);
      $.on(overlay, 'click', Settings.close);
      d.body.style.width = "" + d.body.clientWidth + "px";
      $.addClass(d.body, 'unscroll');
      return $.add(d.body, [overlay, dialog]);
    },
    close: function() {
      if (!Settings.dialog) {
        return;
      }
      d.body.style.removeProperty('width');
      $.rmClass(d.body, 'unscroll');
      $.rm(Settings.overlay);
      $.rm(Settings.dialog);
      delete Settings.overlay;
      return delete Settings.dialog;
    },
    sections: [],
    addSection: function(title, open) {
      var hyphenatedTitle, _ref;

      if (typeof title !== 'string') {
        _ref = title.detail, title = _ref.title, open = _ref.open;
      }
      hyphenatedTitle = title.toLowerCase().replace(/\s+/g, '-');
      return Settings.sections.push({
        title: title,
        hyphenatedTitle: hyphenatedTitle,
        open: open
      });
    },
    openSection: function(mode) {
      var section, selected;

      if (selected = $('.tab-selected', Settings.dialog)) {
        $.rmClass(selected, 'tab-selected');
      }
      $.addClass($(".tab-" + this.hyphenatedTitle, Settings.dialog), 'tab-selected');
      section = $('section', Settings.dialog);
      $.rmAll(section);
      section.className = "section-" + this.hyphenatedTitle;
      this.open(section, mode);
      return section.scrollTop = 0;
    },
    main: function(section) {
      var arr, button, description, div, fs, hiddenNum, input, inputs, items, key, obj, unhide, _ref;

      section.innerHTML = "<div class=imp-exp>\n  <button class=export>Export Settings</button>\n  <button class=import>Import Settings</button>\n  <input type=file style='visibility:hidden'>\n</div>\n<p class=imp-exp-result></p>";
      $.on($('.export', section), 'click', Settings["export"]);
      $.on($('.import', section), 'click', Settings["import"]);
      $.on($('input', section), 'change', Settings.onImport);
      items = {};
      inputs = {};
      _ref = Config.main;
      for (key in _ref) {
        obj = _ref[key];
        fs = $.el('fieldset', {
          innerHTML: "<legend>" + key + "</legend>"
        });
        for (key in obj) {
          arr = obj[key];
          description = arr[1];
          div = $.el('div', {
            innerHTML: "<label><input type=checkbox name='" + key + "'>" + key + "</label><span class=description>" + description + "</span>"
          });
          input = $('input', div);
          $.on($('label', div), 'mouseover', Settings.mouseover);
          $.on(input, 'change', $.cb.checked);
          items[key] = Conf[key];
          inputs[key] = input;
          $.add(fs, div);
        }
        Rice.nodes(fs);
        $.add(section, fs);
      }
      $.get(items, function(items) {
        var val;

        for (key in items) {
          val = items[key];
          inputs[key].checked = val;
        }
      });
      div = $.el('div', {
        innerHTML: "<button></button><span class=description>: Clear manually-hidden threads and posts on all boards. Refresh the page to apply."
      });
      button = $('button', div);
      hiddenNum = 0;
      $.get('hiddenThreads', {
        boards: {}
      }, function(item) {
        var ID, board, thread, _ref1;

        _ref1 = item.hiddenThreads.boards;
        for (ID in _ref1) {
          board = _ref1[ID];
          for (ID in board) {
            thread = board[ID];
            hiddenNum++;
          }
        }
        return button.textContent = "Hidden: " + hiddenNum;
      });
      $.get('hiddenPosts', {
        boards: {}
      }, function(item) {
        var ID, board, post, thread, _ref1;

        _ref1 = item.hiddenPosts.boards;
        for (ID in _ref1) {
          board = _ref1[ID];
          for (ID in board) {
            thread = board[ID];
            for (ID in thread) {
              post = thread[ID];
              hiddenNum++;
            }
          }
        }
        return button.textContent = "Hidden: " + hiddenNum;
      });
      $.on(button, 'click', function() {
        this.textContent = 'Hidden: 0';
        return $.get('hiddenThreads', {
          boards: {}
        }, function(item) {
          var boardID;

          for (boardID in item.hiddenThreads.boards) {
            localStorage.removeItem("4chan-hide-t-" + boardID);
          }
          return $["delete"](['hiddenThreads', 'hiddenPosts']);
        });
      });
      $.after($('input[name="Stubs"]', section).parentNode.parentNode, div);
      div = $.el('div', {
        innerHTML: "<button>Reset Header</button><span class=description>: Unhide the navigation bar."
      });
      unhide = $('button', div);
      $.on(unhide, 'click', function() {
        return Header.setBarPosition.call({
          textContent: "sticky top"
        });
      });
      return $.after($('input[name="Check for Updates"]', section).parentNode.parentNode, div);
    },
    "export": function(now, data) {
      var a, db, p, _i, _len;

      if (typeof now !== 'number') {
        now = Date.now();
        data = {
          version: g.VERSION,
          date: now
        };
        Conf['WatchedThreads'] = {};
        for (_i = 0, _len = DataBoards.length; _i < _len; _i++) {
          db = DataBoards[_i];
          Conf[db] = {
            boards: {}
          };
        }
        $.get(Conf, function(Conf) {
          data.Conf = Conf;
          return Settings["export"](now, data);
        });
        return;
      }
      a = $.el('a', {
        className: 'warning',
        textContent: 'Save me!',
        download: "appchan x v" + g.VERSION + "-" + now + ".json",
        href: "data:application/json;base64," + (btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))))),
        target: '_blank'
      });
      if ($.engine !== 'gecko') {
        a.click();
        return;
      }
      p = $('.imp-exp-result', Settings.dialog);
      $.rmAll(p);
      return $.add(p, a);
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
        var data, err;

        try {
          data = JSON.parse(e.target.result);
          Settings.loadSettings(data);
          if (confirm('Import successful. Refresh now?')) {
            return window.location.reload();
          }
        } catch (_error) {
          err = _error;
          output.textContent = 'Import failed due to an error.';
          return c.error(err.stack);
        }
      };
      return reader.readAsText(file);
    },
    loadSettings: function(data) {
      var key, val, version, _ref;

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
        data.Conf.WatchedThreads = data.WatchedThreads;
      }
      return $.set(data.Conf);
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
      return div.innerHTML = "<div class=warning " + (Conf['Filter'] ? 'hidden' : '') + "><code>Filter</code> is disabled.</div>\n<p>\n  Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>\n  Lines starting with a <code>#</code> will be ignored.<br>\n  For example, <code>/weeaboo/i</code> will filter posts containing the string `<code>weeaboo</code>`, case-insensitive.<br>\n  MD5 filtering uses exact string matching, not regular expressions.\n</p>\n<ul>You can use these settings with each regular expression, separate them with semicolons:\n  <li>\n    Per boards, separate them with commas. It is global if not specified.<br>\n    For example: <code>boards:a,jp;</code>.\n  </li>\n  <li>\n    Filter OPs only along with their threads (`only`), replies only (`no`), or both (`yes`, this is default).<br>\n    For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.\n  </li>\n  <li>\n    Overrule the `Show Stubs` setting if specified: create a stub (`yes`) or not (`no`).<br>\n    For example: <code>stub:yes;</code> or <code>stub:no;</code>.\n  </li>\n  <li>\n    Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>\n    For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.\n  </li>\n  <li>\n    Highlighted OPs will have their threads put on top of board pages by default.<br>\n    For example: <code>top:yes;</code> or <code>top:no;</code>.\n  </li>\n</ul>";
    },
    sauce: function(section) {
      var sauce;

      section.innerHTML = "<div class=warning " + (Conf['Sauce'] ? 'hidden' : '') + "><code>Sauce</code> is disabled.</div>\n<div>Lines starting with a <code>#</code> will be ignored.</div>\n<div>You can specify a display text by appending <code>;text:[text]</code> to the URL.</div>\n<ul>These parameters will be replaced by their corresponding values:\n  <li><code>%TURL</code>: Thumbnail URL.</li>\n  <li><code>%URL</code>: Full image URL.</li>\n  <li><code>%MD5</code>: MD5 hash.</li>\n  <li><code>%board</code>: Current board.</li>\n</ul>\n<textarea name=sauces class=field spellcheck=false></textarea>";
      sauce = $('textarea', section);
      $.get('sauces', Conf['sauces'], function(item) {
        return sauce.value = item['sauces'];
      });
      return $.on(sauce, 'change', $.cb.value);
    },
    rice: function(section) {
      var event, input, inputs, items, name, _i, _len, _ref;

      section.innerHTML = "<fieldset>\n  <legend>Custom Board Navigation <span class=warning " + (Conf['Custom Board Navigation'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=boardnav class=field spellcheck=false></div>\n  <div>In the following, <code>board</code> can translate to a board ID (<code>a</code>, <code>b</code>, etc...), the current board (<code>current</code>), or the Status/Twitter link (<code>status</code>, <code>@</code>).</div>\n  <div>Board link: <code>board</code></div>\n  <div>Title link: <code>board-title</code></div>\n  <div>Full text link: <code>board-full</code></div>\n  <div>Custom text link: <code>board-text:\"VIP Board\"</code></div>\n  <div>Index-only link: <code>board-index</code></div>\n  <div>Catalog-only link: <code>board-catalog</code></div>\n  <div>Combinations are possible: <code>board-index-text:\"VIP Index\"</code></div>\n  <div>Full board list toggle: <code>toggle-all</code></div>\n</fieldset>\n\n<fieldset>\n  <legend>Time Formatting <span class=warning " + (Conf['Time Formatting'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=time class=field spellcheck=false>: <span class=time-preview></span></div>\n  <div>Supported <a href=//en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</div>\n  <div>Day: <code>%a</code>, <code>%A</code>, <code>%d</code>, <code>%e</code></div>\n  <div>Month: <code>%m</code>, <code>%b</code>, <code>%B</code></div>\n  <div>Year: <code>%y</code></div>\n  <div>Hour: <code>%k</code>, <code>%H</code>, <code>%l</code>, <code>%I</code>, <code>%p</code>, <code>%P</code></div>\n  <div>Minute: <code>%M</code></div>\n  <div>Second: <code>%S</code></div>\n</fieldset>\n\n<fieldset>\n  <legend>Quote Backlinks formatting <span class=warning " + (Conf['Quote Backlinks'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=backlink class=field spellcheck=false>: <span class=backlink-preview></span></div>\n</fieldset>\n\n<fieldset>\n  <legend>File Info Formatting <span class=warning " + (Conf['File Info Formatting'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <div><input name=fileInfo class=field spellcheck=false>: <span class='fileText file-info-preview'></span></div>\n  <div>Link: <code>%l</code> (truncated), <code>%L</code> (untruncated), <code>%T</code> (Unix timestamp)</div>\n  <div>Original file name: <code>%n</code> (truncated), <code>%N</code> (untruncated), <code>%t</code> (Unix timestamp)</div>\n  <div>Spoiler indicator: <code>%p</code></div>\n  <div>Size: <code>%B</code> (Bytes), <code>%K</code> (KB), <code>%M</code> (MB), <code>%s</code> (4chan default)</div>\n  <div>Resolution: <code>%r</code> (Displays 'PDF' for PDF files)</div>\n</fieldset>\n\n<fieldset>\n  <legend>Unread Tab Icon <span class=warning " + (Conf['Unread Tab Icon'] ? 'hidden' : '') + ">is disabled.</span></legend>\n  <select name=favicon>\n    <option value=ferongr>ferongr</option>\n    <option value=xat->xat-</option>\n    <option value=Mayhem>Mayhem</option>\n    <option value=Original>Original</option>\n  </select>\n  <span class=favicon-preview></span>\n</fieldset>\n\n<fieldset>\n  <legend><input type=checkbox name='Custom CSS' " + (Conf['Custom CSS'] ? 'checked' : '') + "> Custom CSS</legend>\n  <button id=apply-css>Apply CSS</button>\n  <textarea name=usercss class=field spellcheck=false " + (Conf['Custom CSS'] ? '' : 'disabled') + "></textarea>\n</fieldset>";
      items = {};
      inputs = {};
      _ref = ['boardnav', 'time', 'backlink', 'fileInfo', 'favicon', 'usercss'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        input = $("[name='" + name + "']", section);
        items[name] = Conf[name];
        inputs[name] = input;
        event = ['favicon', 'usercss'].contains(name) ? 'change' : 'input';
        $.on(input, event, $.cb.value);
      }
      $.get(items, function(items) {
        var key, val;

        for (key in items) {
          val = items[key];
          input = inputs[key];
          input.value = val;
          if ('usercss' !== name) {
            $.on(input, event, Settings[key]);
            Settings[key].call(input);
          }
        }
      });
      Rice.nodes(section);
      $.on($('input[name="Custom CSS"]', section), 'change', Settings.togglecss);
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
      return this.nextElementSibling.innerHTML = "<img src=" + Favicon["default"] + ">\n<img src=" + Favicon.unreadSFW + ">\n<img src=" + Favicon.unreadNSFW + ">\n<img src=" + Favicon.unreadDead + ">";
    },
    togglecss: function() {
      if ($('textarea', this.parentNode.parentNode).disabled = !this.checked) {
        CustomCSS.rmStyle();
      } else {
        CustomCSS.addStyle();
      }
      return $.cb.checked.call(this);
    },
    usercss: function() {
      return CustomCSS.update();
    },
    keybinds: function(section) {
      var arr, input, inputs, items, key, tbody, tr, _ref;

      section.innerHTML = "<div class=warning " + (Conf['Keybinds'] ? 'hidden' : '') + "><code>Keybinds</code> are disabled.</div>\n<div>Allowed keys: <kbd>a-z</kbd>, <kbd>0-9</kbd>, <kbd>Ctrl</kbd>, <kbd>Shift</kbd>, <kbd>Alt</kbd>, <kbd>Meta</kbd>, <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Up</kbd>, <kbd>Down</kbd>, <kbd>Right</kbd>, <kbd>Left</kbd>.</div>\n<div>Press <kbd>Backspace</kbd> to disable a keybind.</div>\n<table><tbody>\n  <tr><th>Actions</th><th>Keybinds</th></tr>\n</tbody></table>";
      tbody = $('tbody', section);
      items = {};
      inputs = {};
      _ref = Config.hotkeys;
      for (key in _ref) {
        arr = _ref[key];
        tr = $.el('tr', {
          innerHTML: "<td>" + arr[1] + "</td><td><input class=field></td>"
        });
        input = $('input', tr);
        input.name = key;
        input.spellcheck = false;
        items[key] = Conf[key];
        inputs[key] = input;
        $.on(input, 'keydown', Settings.keybind);
        Rice.nodes(tr);
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
    },
    style: function(section) {
      var arr, description, div, fs, html, input, inputs, items, key, name, nodes, obj, type, value, _i, _len, _ref;

      nodes = $.frag();
      items = {};
      inputs = {};
      _ref = Config.style;
      for (key in _ref) {
        obj = _ref[key];
        fs = $.el('fieldset', {
          innerHTML: "<legend>" + key + "</legend>"
        });
        for (key in obj) {
          arr = obj[key];
          value = arr[0], description = arr[1], type = arr[2];
          div = $.el('div', {
            className: 'styleoption'
          });
          if (type) {
            if (type === 'text') {
              div.innerHTML = "<div class=option><span class=optionlabel>" + key + "</span></div><div class=description>" + description + "</div><div class=option><input name='" + key + "' style=width: 100%></div>";
              input = $("input", div);
            } else {
              html = "<div class=option><span class=optionlabel>" + key + "</span></div><div class=description>" + description + "</div><div class=option><select name='" + key + "'>";
              for (_i = 0, _len = type.length; _i < _len; _i++) {
                name = type[_i];
                html += "<option value='" + name + "'>" + name + "</option>";
              }
              html += "</select></div>";
              div.innerHTML = html;
              input = $("select", div);
            }
          } else {
            div.innerHTML = "<div class=option><label><input type=checkbox name='" + key + "'>" + key + "</label></div><span style='display:none;'>" + description + "</span>";
            input = $('input', div);
            input.bool = true;
          }
          items[key] = Conf[key];
          inputs[key] = input;
          $.on($('.option', div), 'mouseover', Settings.mouseover);
          $.on(input, 'change', Settings.change);
          $.add(fs, div);
        }
        $.add(nodes, fs);
      }
      return $.get(items, function(items) {
        var val;

        for (key in items) {
          val = items[key];
          input = inputs[key];
          if (input.bool) {
            input.checked = val;
            Rice.checkbox(input);
          } else {
            input.value = val;
            if (input.nodeName === 'SELECT') {
              Rice.select(input);
            }
          }
        }
        return $.add(section, nodes);
      });
    },
    change: function() {
      $.cb[this.bool ? 'checked' : 'value'].call(this);
      return Style.addStyle();
    },
    themes: function(section, mode) {
      var cb, div, keys, name, parentdiv, suboptions, theme, _i, _j, _len, _len1;

      if (typeof mode !== 'string') {
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
      cb = Settings.cb.theme;
      if (mode === "default") {
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          name = keys[_i];
          theme = Themes[name];
          if (!theme["Deleted"]) {
            div = $.el('div', {
              className: "theme " + (name === Conf['theme'] ? 'selectedtheme' : ''),
              id: name,
              innerHTML: "<div style='cursor: pointer; position: relative; margin-bottom: 2px; width: 100% !important; box-shadow: none !important; background:" + theme['Reply Background'] + "!important;border:1px solid " + theme['Reply Border'] + "!important;color:" + theme['Text'] + "!important'>  <div>    <div style='cursor: pointer; width: 9px; height: 9px; margin: 2px 3px; display: inline-block; vertical-align: bottom; background: " + theme['Checkbox Background'] + "; border: 1px solid " + theme['Checkbox Border'] + ";'></div>    <span style='color:" + theme['Subjects'] + "!important; font-weight: 600 !important'>      " + name + "    </span>    <span style='color:" + theme['Names'] + "!important; font-weight: 600 !important'>      " + theme['Author'] + "    </span>    <span style='color:" + theme['Sage'] + "!important'>      (SAGE)    </span>    <span style='color:" + theme['Tripcodes'] + "!important'>      " + theme['Author Tripcode'] + "    </span>    <time style='color:" + theme['Timestamps'] + "'>      20XX.01.01 12:00    </time>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Post Numbers'] + "!important&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important;&quot;)' style='color:" + theme['Post Numbers'] + "!important;' href='javascript:;'>      No.27583594    </a>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Backlinks'] + "!important;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important;&quot;)' style='color:" + theme['Backlinks'] + "!important;' href='javascript:;' name='" + name + "' class=edit>      &gt;&gt;edit    </a>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Backlinks'] + "!important;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important;&quot;)' style='color:" + theme['Backlinks'] + "!important;' href='javascript:;' name='" + name + "' class=export>      &gt;&gt;export    </a>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Backlinks'] + "!important;&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important;&quot;)' style='color:" + theme['Backlinks'] + "!important;' href='javascript:;' name='" + name + "' class=delete>      &gt;&gt;delete    </a>  </div>  <blockquote style='margin: 0; padding: 12px 40px 12px 38px'>    <a style='color:" + theme['Quotelinks'] + "!important; text-shadow: none;'>      &gt;&gt;27582902    </a>    <br>    Post content is right here.  </blockquote>  <h1 style='color: " + theme['Text'] + "'>    Selected  </h1></div>"
            });
            div.style.backgroundColor = theme['Background Color'];
            $.on($('a.edit', div), 'click', cb.edit);
            $.on($('a.export', div), 'click', cb["export"]);
            $.on($('a.delete', div), 'click', cb["delete"]);
            $.on(div, 'click', cb.select);
            $.add(suboptions, div);
          }
        }
        div = $.el('div', {
          id: 'addthemes',
          innerHTML: "<a id=newtheme href='javascript:;'>New Theme</a> / <a id=import href='javascript:;'>Import Theme</a><input id=importbutton type=file hidden> / <a id=SSimport href='javascript:;'>Import from 4chan SS</a><input id=SSimportbutton type=file hidden> / <a id=OCimport href='javascript:;'>Import from Oneechan</a><input id=OCimportbutton type=file hidden> / <a id=tUndelete href='javascript:;'>Undelete Theme</a>"
        });
        $.on($("#newtheme", div), 'click', function() {
          ThemeTools.init("untitled");
          return Settings.close();
        });
        $.on($("#import", div), 'click', function() {
          return this.nextSibling.click();
        });
        $.on($("#importbutton", div), 'change', function(e) {
          return ThemeTools.importtheme("appchan", e);
        });
        $.on($("#OCimport", div), 'click', function() {
          return this.nextSibling.click();
        });
        $.on($("#OCimportbutton", div), 'change', function(e) {
          return ThemeTools.importtheme("oneechan", e);
        });
        $.on($("#SSimportbutton", div), 'change', function(e) {
          return ThemeTools.importtheme("SS", e);
        });
        $.on($("#SSimport", div), 'click', function() {
          return this.nextSibling.click();
        });
        $.on($('#tUndelete', div), 'click', function() {
          $.rm($.id("themeContainer"));
          return Settings.openSection(themes, 'undelete');
        });
      } else {
        for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
          name = keys[_j];
          theme = Themes[name];
          if (theme["Deleted"]) {
            div = $.el('div', {
              id: name,
              className: theme,
              innerHTML: "<div style='cursor: pointer; position: relative; margin-bottom: 2px; width: 100% !important; box-shadow: none !important; background:" + theme['Reply Background'] + "!important;border:1px solid " + theme['Reply Border'] + "!important;color:" + theme['Text'] + "!important'>  <div style='padding: 3px 0px 0px 8px;'>    <span style='color:" + theme['Subjects'] + "!important; font-weight: 600 !important'>" + name + "</span>    <span style='color:" + theme['Names'] + "!important; font-weight: 600 !important'>" + theme['Author'] + "</span>    <span style='color:" + theme['Sage'] + "!important'>(SAGE)</span>    <span style='color:" + theme['Tripcodes'] + "!important'>" + theme['Author Tripcode'] + "</span>    <time style='color:" + theme['Timestamps'] + "'>20XX.01.01 12:00</time>    <a onmouseout='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Post Numbers'] + "!important&quot;)' onmouseover='this.setAttribute(&quot;style&quot;,&quot;color:" + theme['Hovered Links'] + "!important&quot;)' style='color:" + theme['Post Numbers'] + "!important;' href='javascript:;'>No.27583594</a>  </div>  <blockquote style='margin: 0; padding: 12px 40px 12px 38px'>    <a style='color:" + theme['Quotelinks'] + "!important; text-shadow: none;'>      &gt;&gt;27582902    </a>    <br>    I forgive you for using VLC to open me. ;__;  </blockquote></div>"
            });
            $.on(div, 'click', cb.restore);
            $.add(suboptions, div);
          }
        }
        div = $.el('div', {
          id: 'addthemes',
          innerHTML: "<a href='javascript:;'>Return</a>"
        });
        $.on($('a', div), 'click', function() {
          $.rm($.id("themeContainer"));
          return Settings.openSection(themes);
        });
      }
      $.add(parentdiv, suboptions);
      $.add(parentdiv, div);
      return $.add(section, parentdiv);
    },
    mouseover: function(e) {
      var mouseover;

      mouseover = $.el('div', {
        id: 'mouseover',
        className: 'dialog'
      });
      $.add(Header.hover, mouseover);
      mouseover.innerHTML = this.nextElementSibling.innerHTML;
      UI.hover({
        root: this,
        el: mouseover,
        latestEvent: e,
        endEvents: 'mouseout',
        asapTest: function() {
          return true;
        },
        close: true
      });
    },
    mascots: function(section, mode) {
      var batchmascots, categories, cb, header, keys, mascot, mascotEl, mascotHide, menu, name, option, parentdiv, suboptions, _i, _j, _k, _len, _len1, _len2, _ref;

      categories = {};
      menu = [];
      cb = Settings.cb.mascot;
      if (typeof mode !== 'string') {
        mode = 'default';
      }
      parentdiv = $.el("div", {
        id: "mascotContainer"
      });
      suboptions = $.el("div", {
        className: "suboptions"
      });
      mascotHide = $.el("div", {
        id: "mascot_hide",
        className: "reply",
        innerHTML: "Hide Categories <span class=drop-marker></span><div></div>"
      });
      keys = Object.keys(Mascots);
      keys.sort();
      if (mode === 'default') {
        _ref = MascotTools.categories;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          categories[name] = $.el("div", {
            className: "mascots",
            id: name
          });
          if (Conf["Hidden Categories"].contains(name)) {
            categories[name].hidden = true;
          }
          header = $.el("h3", {
            className: "mascotHeader",
            textContent: name
          });
          menu.push(option = $.el("label", {
            name: name,
            innerHTML: "<input name='" + name + "' type=checkbox " + (Conf["Hidden Categories"].contains(name) ? 'checked' : '') + ">" + name
          }));
          $.on($('input', option), 'change', Settings.cb.mascotCategory);
          $.add(categories[name], header);
          $.add(suboptions, categories[name]);
        }
        for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
          name = keys[_j];
          if (Conf["Deleted Mascots"].contains(name)) {
            continue;
          }
          mascot = Mascots[name];
          mascotEl = $.el('div', {
            className: 'mascot',
            id: name,
            innerHTML: "<div class='mascotname'>" + (name.replace(/_/g, " ")) + "</div><div class='mascotcontainer'><div class='mAlign " + mascot.category + "'><img class=mascotimg src='" + (Array.isArray(mascot.image) ? (Style.lightTheme ? mascot.image[1] : mascot.image[0]) : mascot.image) + "'></div></div><div class='mascotoptions'><a class=edit name='" + name + "' href='javascript:;'>Edit</a><a class=delete name='" + name + "' href='javascript:;'>Delete</a><a class=export name='" + name + "' href='javascript:;'>Export</a></div>"
          });
          if (Conf[g.MASCOTSTRING].contains(name)) {
            $.addClass(mascotEl, 'enabled');
          }
          $.on($('.edit', mascotEl), 'click', cb.edit);
          $.on($('.delete', mascotEl), 'click', cb["delete"]);
          $.on($('.export', mascotEl), 'click', cb["export"]);
          $.on(mascotEl, 'click', cb.select);
          if (MascotTools.categories.contains(mascot.category)) {
            $.add(categories[mascot.category], mascotEl);
          } else {
            $.add(categories[MascotTools.categories[0]], mascotEl);
          }
        }
        $.add($('div', mascotHide), menu);
        batchmascots = $.el('div', {
          id: "mascots_batch",
          innerHTML: "<a href=\"javascript:;\" id=clear>Clear All</a> /<a href=\"javascript:;\" id=selectAll>Select All</a> /<a href=\"javascript:;\" id=createNew>Add Mascot</a> /<a href=\"javascript:;\" id=importMascot>Import Mascot</a><input id=importMascotButton type=file hidden> /<a href=\"javascript:;\" id=undelete>Undelete Mascots</a> /<a href=\"http://appchan.booru.org/\" target=_blank>Get More Mascots!</a>  "
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
          return Settings.close();
        });
        $.on($("#importMascot", batchmascots), 'click', function() {
          return this.nextSibling.click();
        });
        $.on($("#importMascotButton", batchmascots), 'change', function(e) {
          return MascotTools.importMascot(e);
        });
        $.on($('#undelete', batchmascots), 'click', function() {
          if (!(Conf["Deleted Mascots"].length > 0)) {
            alert("No mascots have been deleted.");
            return;
          }
          $.rm($.id("mascotContainer"));
          return Settings.mascotTab.dialog(Settings.el, 'undelete');
        });
      } else {
        categories = $.el("div", {
          className: "mascots",
          id: name
        });
        for (_k = 0, _len2 = keys.length; _k < _len2; _k++) {
          name = keys[_k];
          if (!Conf["Deleted Mascots"].contains(name)) {
            continue;
          }
          mascot = Mascots[name];
          mascotEl = $.el('div', {
            className: 'mascot',
            id: name,
            innerHTML: "<div class='mascotname'>" + (name.replace(/_/g, " ")) + "</span><div class='container " + mascot.category + "'><img class=mascotimg src='" + (Array.isArray(mascot.image) ? (Style.lightTheme ? mascot.image[1] : mascot.image[0]) : mascot.image) + "'></div>"
          });
          $.on(mascotEl, 'click', Settings.cb.mascot.restore);
          $.add(categories, mascotEl);
        }
        $.add(suboptions, categories);
        batchmascots = $.el('div', {
          id: "mascots_batch",
          innerHTML: "<a href=\"javascript:;\" id=\"return\">Return</a>"
        });
        $.on($('#return', batchmascots), 'click', function() {
          $.rm($.id("mascotContainer"));
          return Settings.section('mascots');
        });
      }
      $.add(parentdiv, [suboptions, batchmascots, mascotHide]);
      Rice.nodes(parentdiv);
      return $.add(section, parentdiv);
    },
    cb: {
      mascot: {
        category: function() {
          var i, name, setting, test, type, _i, _len, _ref;

          if ($.id(this.name).hidden = this.checked) {
            Conf["Hidden Categories"].push(this.name);
            _ref = ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              type = _ref[_i];
              setting = Conf[type];
              i = setting.length;
              test = type === g.MASCOTSTRING;
              while (i--) {
                name = setting[i];
                if (Mascots[name].category !== this.name) {
                  continue;
                }
                setting.remove(name);
                if (!test) {
                  continue;
                }
                $.rmClass($.id(name), 'enabled');
              }
              $.set(type, setting);
            }
          } else {
            Conf["Hidden Categories"].remove(this.name);
          }
          return $.set("Hidden Categories", Conf["Hidden Categories"]);
        },
        edit: function(e) {
          e.stopPropagation();
          MascotTools.dialog(this.name);
          return Settings.close();
        },
        "delete": function(e) {
          var type, _i, _len, _ref;

          e.stopPropagation();
          if (confirm("Are you sure you want to delete \"" + this.name + "\"?")) {
            if (Conf['mascot'] === this.name) {
              MascotTools.init();
            }
            _ref = ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              type = _ref[_i];
              Conf[type].remove(this.name);
              $.set(type, Conf[type]);
            }
            Conf["Deleted Mascots"].push(this.name);
            $.set("Deleted Mascots", Conf["Deleted Mascots"]);
            return $.rm($.id(this.name));
          }
        },
        "export": function(e) {
          var exportMascot, exportedMascot;

          e.stopPropagation();
          exportMascot = Mascots[this.name];
          exportMascot['Mascot'] = this.name;
          exportedMascot = "data:application/json," + encodeURIComponent(JSON.stringify(exportMascot));
          if (window.open(exportedMascot, "_blank")) {

          } else if (confirm("Your popup blocker is preventing Appchan X from exporting this theme. Would you like to open the exported theme in this window?")) {
            return window.location(exportedMascot);
          }
        },
        restore: function() {
          if (confirm("Are you sure you want to restore \"" + this.id + "\"?")) {
            Conf["Deleted Mascots"].remove(this.id);
            $.set("Deleted Mascots", Conf["Deleted Mascots"]);
            return $.rm(this);
          }
        },
        select: function() {
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
        }
      },
      theme: {
        select: function() {
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
        edit: function(e) {
          e.preventDefault();
          e.stopPropagation();
          ThemeTools.init(this.name);
          return Settings.close();
        },
        "export": function(e) {
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
        },
        "delete": function(e) {
          var container, settheme;

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
            return $.get("userThemes", {}, function() {
              var userThemes;

              userThemes = items['userThemes'];
              userThemes[this.name] = Themes[this.name];
              $.set('userThemes', userThemes);
              return $.rm(container);
            });
          }
        },
        restore: function() {
          if (confirm("Are you sure you want to restore \"" + this.id + "\"?")) {
            Themes[this.id]["Deleted"] = false;
            return $.get("userThemes", {}, function(item) {
              var userThemes;

              userThemes = item["userThemes"];
              userThemes[this.id] = Themes[this.id];
              $.set('userThemes', userThemes);
              return $.rm(this);
            });
          }
        }
      }
    }
  };

  Header = {
    init: function() {
      var createSubEntry, setting, subEntries, _i, _len, _ref;

      this.menuButton = $.el('span', {
        className: 'menu-button',
        innerHTML: '<a class=brackets-wrap href=javascript:;><i class=drop-marker></i></a>'
      });
      this.menu = new UI.Menu('header');
      $.on(this.menuButton, 'click', this.menuToggle);
      $.on(this.toggle, 'mousedown', this.toggleBarVisibility);
      $.on(window, 'load hashchange', Header.hashScroll);
      this.positionToggler = $.el('span', {
        textContent: 'Header Position',
        className: 'header-position-link'
      });
      createSubEntry = Header.createSubEntry;
      subEntries = [];
      _ref = ['sticky top', 'sticky bottom', 'top', 'hide'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        setting = _ref[_i];
        subEntries.push(createSubEntry(setting));
      }
      $.event('AddMenuEntry', {
        type: 'header',
        el: this.positionToggler,
        order: 108,
        subEntries: subEntries
      });
      this.headerToggler = $.el('label', {
        innerHTML: "<input type=checkbox " + (Conf['Header auto-hide'] ? 'checked' : '') + "> Auto-hide header"
      });
      $.on(this.headerToggler.firstElementChild, 'change', this.toggleBarVisibility);
      $.event('AddMenuEntry', {
        type: 'header',
        el: this.headerToggler,
        order: 109
      });
      $.on(d, 'CreateNotification', this.createNotification);
      $.asap((function() {
        return d.body;
      }), function() {
        if (!Main.isThisPageLegit()) {
          return;
        }
        return $.asap((function() {
          return $.id('boardNavMobile');
        }), Header.setBoardList);
      });
      return $.ready(function() {
        return $.add(d.body, Header.hover);
      });
    },
    bar: $.el('div', {
      id: 'notifications'
    }),
    shortcuts: $.el('span', {
      id: 'shortcuts'
    }),
    hover: $.el('div', {
      id: 'hoverUI'
    }),
    toggle: $.el('div', {
      id: 'toggle-header-bar'
    }),
    createSubEntry: function(setting) {
      var label;

      label = $.el('label', {
        textContent: "" + setting
      });
      $.on(label, 'click', Header.setBarPosition);
      return {
        el: label
      };
    },
    setBoardList: function() {
      var a, btn, customBoardList, fullBoardList, nav;

      Header.nav = nav = $.id('boardNavDesktop');
      if (a = $("a[href*='/" + g.BOARD + "/']", nav)) {
        a.className = 'current';
      }
      fullBoardList = $.el('span', {
        id: 'full-board-list',
        hidden: true
      });
      customBoardList = $.el('span', {
        id: 'custom-board-list'
      });
      Header.setBarPosition.call({
        textContent: "" + Conf['Boards Navigation']
      });
      $.sync('Boards Navigation', function() {
        return Header.setBarPosition.call({
          textContent: "" + Conf['Boards Navigation']
        });
      });
      Header.setBarVisibility(Conf['Header auto-hide']);
      $.sync('Header auto-hide', Header.setBarVisibility);
      $.prepend(d.body, $.id('navtopright'));
      $.add(fullBoardList, __slice.call(nav.childNodes));
      $.add(nav, [Header.menuButton, customBoardList, fullBoardList, Header.shortcuts, Header.bar, Header.toggle]);
      if (Conf['Custom Board Navigation']) {
        Header.generateBoardList(Conf['boardnav']);
        $.sync('boardnav', Header.generateBoardList);
        btn = $.el('span', {
          className: 'hide-board-list-button',
          innerHTML: '[<a href=javascript:;> - </a>]\u00A0'
        });
        $.on(btn, 'click', Header.toggleBoardList);
        return $.prepend(fullBoardList, btn);
      } else {
        $.rm($('#custom-board-list', nav));
        return fullBoardList.hidden = false;
      }
    },
    generateBoardList: function(text) {
      var as, list, nodes;

      list = $('#custom-board-list', Header.nav);
      $.rmAll(list);
      if (!text) {
        return;
      }
      as = $$('#full-board-list a', Header.nav).slice(0, -2);
      nodes = text.match(/[\w@]+(-(all|title|full|index|catalog|text:"[^"]+"))*|[^\w@]+/g).map(function(t) {
        var a, board, m, _i, _len;

        if (/^[^\w@]/.test(t)) {
          return $.tn(t);
        }
        if (/^toggle-all/.test(t)) {
          a = $.el('a', {
            className: 'show-board-list-button',
            textContent: (t.match(/-text:"(.+)"/) || [null, '+'])[1],
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
            if (/-title/.test(t)) {
              a.textContent = a.title;
            } else if (/-full/.test(t)) {
              a.textContent = "/" + board + "/ - " + a.title;
            } else if (/-(index|catalog|text)/.test(t)) {
              if (m = t.match(/-(index|catalog)/)) {
                a.setAttribute('data-only', m[1]);
                a.href = "//boards.4chan.org/" + board + "/";
                if (m[1] === 'catalog') {
                  a.href += 'catalog';
                }
              }
              if (m = t.match(/-text:"(.+)"/)) {
                a.textContent = m[1];
              }
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
      var custom, full, nav, showBoardList;

      nav = Header.nav;
      custom = $('#custom-board-list', nav);
      full = $('#full-board-list', nav);
      showBoardList = !full.hidden;
      custom.hidden = !showBoardList;
      return full.hidden = showBoardList;
    },
    setBarPosition: function() {
      $.event('CloseMenu');
      switch (this.textContent) {
        case 'sticky top':
          $.addClass(doc, 'top');
          $.addClass(doc, 'fixed');
          $.rmClass(doc, 'bottom');
          $.rmClass(doc, 'hide');
          break;
        case 'sticky bottom':
          $.rmClass(doc, 'top');
          $.addClass(doc, 'fixed');
          $.addClass(doc, 'bottom');
          $.rmClass(doc, 'hide');
          break;
        case 'top':
          $.addClass(doc, 'top');
          $.rmClass(doc, 'fixed');
          $.rmClass(doc, 'bottom');
          $.rmClass(doc, 'hide');
          break;
        case 'hide':
          $.rmClass(doc, 'top');
          $.rmClass(doc, 'fixed');
          $.rmClass(doc, 'bottom');
          $.addClass(doc, 'hide');
      }
      Conf['Boards Navigation'] = this.textContent;
      return $.set('Boards Navigation', this.textContent);
    },
    setBarVisibility: function(hide) {
      Header.headerToggler.firstElementChild.checked = hide;
      return (hide ? $.addClass : $.rmClass)(Header.nav, 'autohide');
    },
    hashScroll: function() {
      var post;

      if (!(post = $.id(this.location.hash.slice(1)))) {
        return;
      }
      if ((Get.postFromRoot(post)).isHidden) {
        return;
      }
      return Header.scrollToPost(post);
    },
    scrollToPost: function(post) {
      var headRect, top;

      top = post.getBoundingClientRect().top;
      if (Conf['Boards Navigation'] === 'sticky top') {
        headRect = Header.bar.getBoundingClientRect();
        top += -headRect.top - headRect.height;
      }
      return ($.engine === 'webkit' ? d.body : doc).scrollTop += top;
    },
    toggleBarVisibility: function(e) {
      var hide, message;

      if (e.type === 'mousedown' && e.button !== 0) {
        return;
      }
      hide = this.nodeName === 'INPUT' ? this.checked : !$.hasClass(Header.nav, 'autohide');
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
      $.add(shortcut, [$.tn(' ['), el, $.tn(']')]);
      return $.add(Header.shortcuts, shortcut);
    },
    menuToggle: function(e) {
      return Header.menu.toggle(e, this, g);
    },
    createNotification: function(e) {
      var cb, content, lifetime, notif, type, _ref;

      _ref = e.detail, type = _ref.type, content = _ref.content, lifetime = _ref.lifetime, cb = _ref.cb;
      notif = new Notification(type, content, lifetime);
      if (cb) {
        return cb(notif);
      }
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
      return $.rm(this.el);
    };

    return Notification;

  })();

  CatalogLinks = {
    init: function() {
      var el;

      $.ready(this.ready);
      if (!Conf['Catalog Links']) {
        return;
      }
      el = $.el('a', {
        id: 'toggleCatalog',
        href: 'javascript:;',
        className: Conf['Header catalog links'] ? 'disabled' : '',
        textContent: 'Catalog',
        title: "Turn catalog links " + (Conf['Header catalog links'] ? 'off' : 'on') + "."
      });
      $.on(el, 'click', this.toggle);
      Header.addShortcut(el);
      return $.asap((function() {
        return d.body;
      }), function() {
        if (!Main.isThisPageLegit()) {
          return;
        }
        return $.asap((function() {
          return $.id('boardNavMobile');
        }), function() {
          return CatalogLinks.toggle.call(el);
        });
      });
    },
    toggle: function() {
      var a, board, useCatalog, _i, _len, _ref;

      $.set('Header catalog links', useCatalog = this.className === 'disabled');
      $.toggleClass(this, 'disabled');
      _ref = $$('a', $.id('boardNavDesktop'));
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        board = a.pathname.split('/')[1];
        if (['f', 'status', '4chan'].contains(board) || !board) {
          continue;
        }
        if (Conf['External Catalog']) {
          a.href = useCatalog ? CatalogLinks.external(board) : "//boards.4chan.org/" + board + "/";
        } else {
          a.pathname = "/" + board + "/" + (useCatalog ? 'catalog' : '');
        }
        a.title = useCatalog ? "" + a.title + " - Catalog" : a.title.replace(/\ -\ Catalog$/, '');
      }
      return this.title = "Turn catalog links " + (useCatalog ? 'off' : 'on') + ".";
    },
    external: function(board) {
      return (['a', 'c', 'g', 'co', 'k', 'm', 'o', 'p', 'v', 'vg', 'w', 'cm', '3', 'adv', 'an', 'cgl', 'ck', 'diy', 'fa', 'fit', 'int', 'jp', 'mlp', 'lit', 'mu', 'n', 'po', 'sci', 'toy', 'trv', 'tv', 'vp', 'x', 'q'].contains(board) ? "http://catalog.neet.tv/" + board : ['d', 'e', 'gif', 'h', 'hr', 'hc', 'r9k', 's', 'pol', 'soc', 'u', 'i', 'ic', 'hm', 'r', 'w', 'wg', 'wsg', 't', 'y'].contains(board) ? "http://4index.gropes.us/" + board : "//boards.4chan.org/" + board + "/catalog");
    },
    ready: function() {
      var catalogLink;

      if (catalogLink = $('.pages.cataloglink a', d.body) || $('[href=".././catalog"]', d.body)) {
        if (g.VIEW !== 'thread') {
          $.add(d.body, catalogLink);
        }
        return catalogLink.id = 'catalog';
      }
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
        $.globalEval("window.addEventListener('prettyprint', function(e) {\n  var pre = e.detail;\n  pre.innerHTML = prettyPrintOne(pre.innerHTML);\n}, false);");
        Post.prototype.callbacks.push({
          name: 'Parse /g/ code',
          cb: this.code
        });
      }
      if (board === 'sci') {
        $.globalEval("window.addEventListener('jsmath', function(e) {\n  if (jsMath.loaded) {\n    // process one post\n    jsMath.ProcessBeforeShowing(e.detail);\n  } else {\n    // load jsMath and process whole document\n    jsMath.Autoload.Script.Push('ProcessBeforeShowing', [null]);\n    jsMath.Autoload.LoadJsMath();\n  }\n}, false);");
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
        $.event('prettyprint', pre, window);
      }
    },
    math: function() {
      if (this.isClone || !$('.math', this.nodes.comment)) {
        return;
      }
      return $.event('jsmath', this.nodes.post, window);
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
      var boards, err, filter, hl, key, op, regexp, stub, top, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;

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
            } catch (_error) {
              err = _error;
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
              PostHiding.hide(this, result.stub);
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
        var re, type, value;

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
        return $.get(type, Conf[type], function(item) {
          var save, section, select, ta, tl;

          save = item[type];
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
        });
      }
    }
  };

  ThreadHiding = {
    init: function() {
      if (g.VIEW !== 'index' || !Conf['Thread Hiding'] && !Conf['Thread Hiding Link']) {
        return;
      }
      this.db = new DataBoard('hiddenThreads');
      this.syncCatalog();
      return Thread.prototype.callbacks.push({
        name: 'Thread Hiding',
        cb: this.node
      });
    },
    node: function() {
      var data;

      if (data = ThreadHiding.db.get({
        boardID: this.board.ID,
        threadID: this.ID
      })) {
        ThreadHiding.hide(this, data.makeStub);
      }
      if (!Conf['Thread Hiding']) {
        return;
      }
      return $.prepend(this.OP.nodes.info, ThreadHiding.makeButton(this, 'hide'));
    },
    syncCatalog: function() {
      var e, hiddenThreads, hiddenThreadsOnCatalog, threadID;

      hiddenThreads = ThreadHiding.db.get({
        boardID: g.BOARD.ID,
        defaultValue: {}
      });
      try {
        hiddenThreadsOnCatalog = JSON.parse(localStorage.getItem("4chan-hide-t-" + g.BOARD)) || {};
      } catch (_error) {
        e = _error;
        localStorage.setItem("4chan-hide-t-" + g.BOARD, JSON.stringify({}));
        return ThreadHiding.syncCatalog();
      }
      for (threadID in hiddenThreadsOnCatalog) {
        if (!(threadID in hiddenThreads)) {
          hiddenThreads[threadID] = {};
        }
      }
      for (threadID in hiddenThreads) {
        if (!(threadID in hiddenThreadsOnCatalog)) {
          delete hiddenThreads[threadID];
        }
      }
      if ((ThreadHiding.db.data.lastChecked || 0) > Date.now() - $.MINUTE) {
        ThreadHiding.cleanCatalog(hiddenThreadsOnCatalog);
      }
      return ThreadHiding.db.set({
        boardID: g.BOARD.ID,
        val: hiddenThreads
      });
    },
    cleanCatalog: function(hiddenThreadsOnCatalog) {
      return $.cache("//api.4chan.org/" + g.BOARD + "/threads.json", function() {
        var page, thread, threads, _i, _j, _len, _len1, _ref, _ref1;

        if (this.status !== 200) {
          return;
        }
        threads = {};
        _ref = JSON.parse(this.response);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          page = _ref[_i];
          _ref1 = page.threads;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            thread = _ref1[_j];
            if (thread.no in hiddenThreadsOnCatalog) {
              threads[thread.no] = hiddenThreadsOnCatalog[thread.no];
            }
          }
        }
        if (Object.keys(threads).length) {
          return localStorage.setItem("4chan-hide-t-" + g.BOARD, JSON.stringify(threads));
        } else {
          return localStorage.removeItem("4chan-hide-t-" + g.BOARD);
        }
      });
    },
    menu: {
      init: function() {
        var apply, div, makeStub;

        if (g.VIEW !== 'index' || !Conf['Menu'] || !Conf['Thread Hiding Link']) {
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
      var hiddenThreadsOnCatalog;

      hiddenThreadsOnCatalog = JSON.parse(localStorage.getItem("4chan-hide-t-" + g.BOARD)) || {};
      if (thread.isHidden) {
        ThreadHiding.db.set({
          boardID: thread.board.ID,
          threadID: thread.ID,
          val: {
            makeStub: makeStub
          }
        });
        hiddenThreadsOnCatalog[thread] = true;
      } else {
        ThreadHiding.db["delete"]({
          boardID: thread.board.ID,
          threadID: thread.ID
        });
        delete hiddenThreadsOnCatalog[thread];
      }
      return localStorage.setItem("4chan-hide-t-" + g.BOARD, JSON.stringify(hiddenThreadsOnCatalog));
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

  PostHiding = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Reply Hiding'] && !Conf['Reply Hiding Link']) {
        return;
      }
      this.db = new DataBoard('hiddenPosts');
      return Post.prototype.callbacks.push({
        name: 'Reply Hiding',
        cb: this.node
      });
    },
    node: function() {
      var data;

      if (!this.isReply || this.isClone) {
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
      if (!Conf['Reply Hiding']) {
        return;
      }
      return $.add($('.postInfo', this.nodes.post), PostHiding.makeButton(this, 'hide'));
    },
    menu: {
      init: function() {
        var apply, div, makeStub, replies, thisPost;

        if (g.VIEW === 'catalog' || !Conf['Menu'] || !Conf['Reply Hiding Link']) {
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
        $.on(apply, 'click', PostHiding.menu.hide);
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
          textContent: 'Show reply'
        });
        apply = $.el('a', {
          textContent: 'Apply',
          href: 'javascript:;'
        });
        $.on(apply, 'click', PostHiding.menu.show);
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
      }
    },
    makeButton: function(post, type) {
      var a;

      a = $.el('a', {
        className: "" + type + "-reply-button",
        innerHTML: "<span>[&nbsp;" + (type === 'hide' ? '-' : '+') + "&nbsp;]</span>",
        href: 'javascript:;'
      });
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
      if (post.isHidden) {
        PostHiding.show(post);
      } else {
        PostHiding.hide(post);
      }
      return PostHiding.saveHiddenState(post, post.isHidden);
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
        Recursive.apply(PostHiding.hide, post, makeStub, true);
        Recursive.add(PostHiding.hide, post, makeStub, true);
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
      a = PostHiding.makeButton(post, 'show');
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
        Recursive.apply(PostHiding.show, post, true);
        Recursive.rm(PostHiding.hide, post);
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
      if (g.VIEW === 'catalog' || !Conf['Reply Hiding'] && !Conf['Reply Hiding Link'] && !Conf['Filter']) {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Strike-through Quotes',
        cb: this.node
      });
    },
    node: function() {
      var boardID, postID, quotelink, _i, _len, _ref, _ref1, _ref2;

      if (this.isClone) {
        return;
      }
      _ref = this.nodes.quotelinks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        _ref1 = Get.postDataFromLink(quotelink), boardID = _ref1.boardID, postID = _ref1.postID;
        if ((_ref2 = g.posts["" + boardID + "." + postID]) != null ? _ref2.isHidden : void 0) {
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
          innerHTML: '[<span class=drop-marker></span>]',
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
          var node;

          if (post.isDead) {
            return false;
          }
          DeleteLink.post = post;
          node = div.firstChild;
          node.textContent = 'Delete';
          DeleteLink.cooldown.start(post, node);
          return true;
        },
        subEntries: [postEntry, fileEntry]
      });
    },
    "delete": function() {
      var fileOnly, form, link, m, post, pwd;

      post = DeleteLink.post;
      if (DeleteLink.cooldown.counting === post) {
        return;
      }
      $.off(this, 'click', DeleteLink["delete"]);
      this.textContent = "Deleting " + this.textContent + "...";
      pwd = (m = d.cookie.match(/4chan_pass=([^;]+)/)) ? decodeURIComponent(m[1]) : $.id('delPassword').value;
      fileOnly = $.hasClass(this, 'delete-file');
      form = {
        mode: 'usrdel',
        onlyimgdel: fileOnly,
        pwd: pwd
      };
      form[post.ID] = 'delete';
      link = this;
      return $.ajax($.id('delform').action.replace("/" + g.BOARD + "/", "/" + post.board + "/"), {
        onload: function() {
          return DeleteLink.load(link, post, fileOnly, this.response);
        },
        onerror: function() {
          return DeleteLink.error(link);
        }
      }, {
        cred: true,
        form: $.formData(form)
      });
    },
    load: function(link, post, fileOnly, html) {
      var msg, s, tmpDoc;

      tmpDoc = d.implementation.createHTMLDocument('');
      tmpDoc.documentElement.innerHTML = html;
      if (tmpDoc.title === '4chan - Banned') {
        s = 'Banned!';
      } else if (msg = tmpDoc.getElementById('errmsg')) {
        s = msg.textContent;
        $.on(link, 'click', DeleteLink["delete"]);
      } else {
        if (tmpDoc.title === 'Updating index...') {
          (post.origin || post).kill(fileOnly);
        }
        s = 'Deleted';
      }
      return link.textContent = s;
    },
    error: function(link) {
      link.textContent = 'Connection error, please retry.';
      return $.on(link, 'click', DeleteLink["delete"]);
    },
    cooldown: {
      start: function(post, node) {
        var length, seconds, _ref;

        if (!((_ref = QR.db) != null ? _ref.get({
          boardID: post.board.ID,
          threadID: post.thread.ID,
          postID: post.ID
        }) : void 0)) {
          delete DeleteLink.cooldown.counting;
          return;
        }
        DeleteLink.cooldown.counting = post;
        length = post.board.ID === 'q' ? 600 : 30;
        seconds = Math.ceil((length * $.SECOND - (Date.now() - post.info.date)) / $.SECOND);
        return DeleteLink.cooldown.count(post, seconds, length, node);
      },
      count: function(post, seconds, length, node) {
        if (DeleteLink.cooldown.counting !== post) {
          return;
        }
        if (!((0 <= seconds && seconds <= length))) {
          if (DeleteLink.cooldown.counting === post) {
            delete DeleteLink.cooldown.counting;
          }
          return;
        }
        setTimeout(DeleteLink.cooldown.count, 1000, post, seconds - 1, length, node);
        if (seconds === 0) {
          node.textContent = 'Delete';
          return;
        }
        return node.textContent = "Delete (" + seconds + ")";
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
          var ID, board, redirect, thread;

          ID = _arg.ID, thread = _arg.thread, board = _arg.board;
          redirect = Redirect.to({
            postID: ID,
            threadID: thread.ID,
            boardID: board.ID
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
      open = type === 'post' ? function(_arg) {
        var ID, board, thread;

        ID = _arg.ID, thread = _arg.thread, board = _arg.board;
        el.href = Redirect.to({
          postID: ID,
          threadID: thread.ID,
          boardID: board.ID
        });
        return true;
      } : function(post) {
        var value;

        value = Filter[type](post);
        if (!value) {
          return false;
        }
        el.href = Redirect.to({
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
      var form, key, notification, notifications, op, target, thread, threadRoot, _i, _len;

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
      if (op = $('.op', threadRoot)) {
        thread = Get.postFromNode(op).thread;
      }
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
          if ($.id('fourchanx-settings')) {
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
        case Conf['fappeTyme']:
          FappeTyme.toggle();
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

      if (Conf['Fixed Header'] && Conf['Bottom header']) {
        topMargin = 0;
      } else {
        headRect = Header.bar.getBoundingClientRect();
        topMargin = headRect.top + headRect.height;
      }
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
      return $.addClass(post, 'highlight');
    }
  };

  Nav = {
    init: function() {
      var next, prev, span;

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
        href: 'javascript:;'
      });
      next = $.el('a', {
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
    getThread: function(full) {
      var headRect, i, rect, thread, threads, topMargin, _i, _len;

      if (Conf['Bottom header']) {
        topMargin = 0;
      } else {
        headRect = Header.bar.getBoundingClientRect();
        topMargin = headRect.top + headRect.height;
      }
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
    image: function(boardID, filename) {
      switch (boardID) {
        case 'a':
        case 'gd':
        case 'jp':
        case 'm':
        case 'q':
        case 'tg':
        case 'vg':
        case 'vp':
        case 'vr':
        case 'wsg':
          return "//archive.foolz.us/" + boardID + "/full_image/" + filename;
        case 'u':
          return "//nsfw.foolz.us/" + boardID + "/full_image/" + filename;
        case 'po':
          return "//archive.thedarkcave.org/" + boardID + "/full_image/" + filename;
        case 'ck':
        case 'fa':
        case 'lit':
        case 's4s':
          return "//fuuka.warosu.org/" + boardID + "/full_image/" + filename;
        case 'cgl':
        case 'g':
        case 'mu':
        case 'w':
          return "//rbt.asia/" + boardID + "/full_image/" + filename;
        case 'an':
        case 'k':
        case 'toy':
        case 'x':
          return "http://archive.heinessen.com/" + boardID + "/full_image/" + filename;
        case 'c':
          return "//archive.nyafuu.org/" + boardID + "/full_image/" + filename;
      }
    },
    post: function(boardID, postID) {
      switch (boardID) {
        case 'a':
        case 'co':
        case 'gd':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'tv':
        case 'v':
        case 'vg':
        case 'vp':
        case 'vr':
        case 'wsg':
          return "https://archive.foolz.us/_/api/chan/post/?board=" + boardID + "&num=" + postID;
        case 'u':
          return "https://nsfw.foolz.us/_/api/chan/post/?board=" + boardID + "&num=" + postID;
        case 'c':
        case 'int':
        case 'out':
        case 'po':
          return "//archive.thedarkcave.org/_/api/chan/post/?board=" + boardID + "&num=" + postID;
      }
    },
    to: function(data) {
      var boardID;

      boardID = data.boardID;
      switch (boardID) {
        case 'a':
        case 'co':
        case 'gd':
        case 'jp':
        case 'm':
        case 'q':
        case 'sp':
        case 'tg':
        case 'tv':
        case 'v':
        case 'vg':
        case 'vp':
        case 'vr':
        case 'wsg':
          return Redirect.path('//archive.foolz.us', 'foolfuuka', data);
        case 'u':
          return Redirect.path('//nsfw.foolz.us', 'foolfuuka', data);
        case 'int':
        case 'out':
        case 'po':
          return Redirect.path('//archive.thedarkcave.org', 'foolfuuka', data);
        case 'ck':
        case 'fa':
        case 'lit':
        case 's4s':
          return Redirect.path('//fuuka.warosu.org', 'fuuka', data);
        case 'diy':
        case 'g':
        case 'sci':
          return Redirect.path('//archive.installgentoo.net', 'fuuka', data);
        case 'cgl':
        case 'mu':
        case 'w':
          return Redirect.path('//rbt.asia', 'fuuka', data);
        case 'an':
        case 'fit':
        case 'k':
        case 'mlp':
        case 'r9k':
        case 'toy':
        case 'x':
          return Redirect.path('http://archive.heinessen.com', 'fuuka', data);
        case 'c':
          return Redirect.path('//archive.nyafuu.org', 'fuuka', data);
        default:
          if (data.threadID) {
            return "//boards.4chan.org/" + boardID + "/";
          } else {
            return '';
          }
      }
    },
    path: function(base, archiver, data) {
      var boardID, path, postID, threadID, type, value;

      if (data.isSearch) {
        boardID = data.boardID, type = data.type, value = data.value;
        type = type === 'name' ? 'username' : type === 'MD5' ? 'image' : type;
        value = encodeURIComponent(value);
        if (archiver === 'foolfuuka') {
          return "" + base + "/" + boardID + "/search/" + type + "/" + value;
        } else if (type === 'image') {
          return "" + base + "/" + boardID + "/?task=search2&search_media_hash=" + value;
        } else {
          return "" + base + "/" + boardID + "/?task=search2&search_" + type + "=" + value;
        }
      }
      boardID = data.boardID, threadID = data.threadID, postID = data.postID;
      path = threadID ? "" + boardID + "/thread/" + threadID : "" + boardID + "/post/" + postID;
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
    postFromObject: function(data, boardID) {
      var o;

      o = {
        postID: data.no,
        threadID: data.resto || data.no,
        boardID: boardID,
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
          url: "//images.4chan.org/" + boardID + "/src/" + data.tim + data.ext,
          height: data.h,
          width: data.w,
          MD5: data.md5,
          size: data.fsize,
          turl: "//thumbs.4chan.org/" + boardID + "/thumb/" + data.tim + "s.jpg",
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

      var a, boardID, capcode, capcodeClass, capcodeStart, closed, comment, container, date, dateUTC, email, emailEnd, emailStart, ext, file, fileDims, fileHTML, fileInfo, fileSize, fileThumb, filename, flag, flagCode, flagName, href, imgSrc, isClosed, isOP, isSticky, name, postID, quote, shortFilename, spoilerRange, staticPath, sticky, subject, threadID, tripcode, uniqueID, userID, _i, _len, _ref;

      postID = o.postID, threadID = o.threadID, boardID = o.boardID, name = o.name, capcode = o.capcode, tripcode = o.tripcode, uniqueID = o.uniqueID, email = o.email, subject = o.subject, flagCode = o.flagCode, flagName = o.flagName, date = o.date, dateUTC = o.dateUTC, isSticky = o.isSticky, isClosed = o.isClosed, comment = o.comment, file = o.file;
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
      flag = flagCode ? (" <img src='" + staticPath + "/image/country/" + (boardID === 'pol' ? 'troll/' : '')) + flagCode.toLowerCase() + (".gif' alt=" + flagCode + " title='" + flagName + "' class=countryFlag>") : '';
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
            if (spoilerRange = Build.spoilerRange[boardID]) {
              fileThumb += ("-" + boardID) + Math.floor(1 + spoilerRange * Math.random());
            }
            fileThumb += '.png';
            file.twidth = file.theight = 100;
          }
        }
        if (boardID.ID !== 'f') {
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
        innerHTML: (isOP ? '' : "<div class=sideArrows id=sa" + postID + ">&gt;&gt;</div>") + ("<div id=p" + postID + " class='post " + (isOP ? 'op' : 'reply') + (capcode === 'admin_highlight' ? ' highlightPost' : '') + "'>") + ("<div class='postInfoM mobile' id=pim" + postID + ">") + ("<span class='nameBlock" + capcodeClass + "'>") + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + capcode + userID + flag + sticky + closed + ("<br>" + subject) + ("</span><span class='dateTime postNum' data-utc=" + dateUTC + ">" + date) + ("<a href=" + ("/" + boardID + "/res/" + threadID + "#p" + postID) + ">No.</a>") + ("<a href='" + (g.VIEW === 'thread' && g.THREADID === +threadID ? "javascript:quote(" + postID + ")" : "/" + boardID + "/res/" + threadID + "#q" + postID) + "'>" + postID + "</a>") + '</span>' + '</div>' + (isOP ? fileHTML : '') + ("<div class='postInfo desktop' id=pi" + postID + ">") + ("<input type=checkbox name=" + postID + " value=delete> ") + ("" + subject + " ") + ("<span class='nameBlock" + capcodeClass + "'>") + emailStart + ("<span class=name>" + (name || '') + "</span>") + tripcode + capcodeStart + emailEnd + capcode + userID + flag + sticky + closed + ' </span> ' + ("<span class=dateTime data-utc=" + dateUTC + ">" + date + "</span> ") + "<span class='postNum desktop'>" + ("<a href=" + ("/" + boardID + "/res/" + threadID + "#p" + postID) + " title='Highlight this post'>No.</a>") + ("<a href='" + (g.VIEW === 'thread' && g.THREADID === +threadID ? "javascript:quote(" + postID + ")" : "/" + boardID + "/res/" + threadID + "#q" + postID) + "' title='Quote this post'>" + postID + "</a>") + '</span>' + '</div>' + (isOP ? '' : fileHTML) + ("<blockquote class=postMessage id=m" + postID + ">" + (comment || '') + "</blockquote> ") + '</div>'
      });
      _ref = $$('.quotelink', container);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quote = _ref[_i];
        href = quote.getAttribute('href');
        if (href[0] === '/') {
          continue;
        }
        quote.href = "/" + boardID + "/res/" + href;
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
      var boardID, index, link, post, postID;

      link = $('a[title="Highlight this post"]', root);
      boardID = link.pathname.split('/')[1];
      postID = link.hash.slice(2);
      index = root.dataset.clone;
      post = g.posts["" + boardID + "." + postID];
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
      var boardID, path, postID, threadID;

      if (link.hostname === 'boards.4chan.org') {
        path = link.pathname.split('/');
        boardID = path[1];
        threadID = path[3];
        postID = link.hash.slice(2);
      } else {
        boardID = link.dataset.boardid;
        threadID = link.dataset.threadid || 0;
        postID = link.dataset.postid;
      }
      return {
        boardID: boardID,
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
        var boardID, postID, _ref4;

        _ref4 = Get.postDataFromLink(quotelink), boardID = _ref4.boardID, postID = _ref4.postID;
        return boardID === post.board.ID && postID === post.ID;
      });
    },
    postClone: function(boardID, threadID, postID, root, context) {
      var post, url;

      if (post = g.posts["" + boardID + "." + postID]) {
        Get.insert(post, root, context);
        return;
      }
      root.textContent = "Loading post No." + postID + "...";
      if (threadID) {
        return $.cache("//api.4chan.org/" + boardID + "/res/" + threadID + ".json", function() {
          return Get.fetchedPost(this, boardID, threadID, postID, root, context);
        });
      } else if (url = Redirect.post(boardID, postID)) {
        return $.cache(url, function() {
          return Get.archivedPost(this, boardID, postID, root, context);
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
      $.rmAll(nodes.root);
      $.add(nodes.root, nodes.post);
      $.rmAll(root);
      return $.add(root, nodes.root);
    },
    fetchedPost: function(req, boardID, threadID, postID, root, context) {
      var board, post, posts, status, thread, url, _i, _len;

      if (post = g.posts["" + boardID + "." + postID]) {
        Get.insert(post, root, context);
        return;
      }
      status = req.status;
      if (![200, 304].contains(status)) {
        if (url = Redirect.post(boardID, postID)) {
          $.cache(url, function() {
            return Get.archivedPost(this, boardID, postID, root, context);
          });
        } else {
          $.addClass(root, 'warning');
          root.textContent = status === 404 ? "Thread No." + threadID + " 404'd." : "Error " + req.statusText + " (" + req.status + ").";
        }
        return;
      }
      posts = JSON.parse(req.response).posts;
      Build.spoilerRange[boardID] = posts[0].custom_spoiler;
      for (_i = 0, _len = posts.length; _i < _len; _i++) {
        post = posts[_i];
        if (post.no === postID) {
          break;
        }
        if (post.no > postID) {
          if (url = Redirect.post(boardID, postID)) {
            $.cache(url, function() {
              return Get.archivedPost(this, boardID, postID, root, context);
            });
          } else {
            $.addClass(root, 'warning');
            root.textContent = "Post No." + postID + " was not found.";
          }
          return;
        }
      }
      board = g.boards[boardID] || new Board(boardID);
      thread = g.threads["" + boardID + "." + threadID] || new Thread(threadID, board);
      post = new Post(Build.postFromObject(post, boardID), thread, board);
      Main.callbackNodes(Post, [post]);
      return Get.insert(post, root, context);
    },
    archivedPost: function(req, boardID, postID, root, context) {
      var board, bq, comment, data, o, post, thread, threadID, _ref;

      if (post = g.posts["" + boardID + "." + postID]) {
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
        boardID: boardID,
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
          turl: data.media.thumb_link || ("//thumbs.4chan.org/" + boardID + "/thumb/" + data.media.preview_orig),
          theight: data.media.preview_h,
          twidth: data.media.preview_w,
          isSpoiler: data.media.spoiler === '1'
        };
      }
      board = g.boards[boardID] || new Board(boardID);
      thread = g.threads["" + boardID + "." + threadID] || new Thread(threadID, board);
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
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      return Post.prototype.callbacks.push({
        name: 'Resurrect Quotes',
        cb: this.node
      });
    },
    node: function() {
      var a, boardID, deadlink, m, post, postID, quote, quoteID, redirect, _i, _len, _ref, _ref1;

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
        if (!(postID = (_ref1 = quote.match(/\d+$/)) != null ? _ref1[0] : void 0)) {
          continue;
        }
        boardID = (m = quote.match(/^>>>\/([a-z\d]+)/)) ? m[1] : this.board.ID;
        quoteID = "" + boardID + "." + postID;
        if (post = g.posts[quoteID]) {
          if (!post.isDead) {
            a = $.el('a', {
              href: "/" + boardID + "/" + post.thread + "/res/#p" + postID,
              className: 'quotelink',
              textContent: quote
            });
          } else {
            a = $.el('a', {
              href: "/" + boardID + "/" + post.thread + "/res/#p" + postID,
              className: 'quotelink deadlink',
              target: '_blank',
              textContent: "" + quote + "\u00A0(Dead)"
            });
            a.setAttribute('data-boardid', boardID);
            a.setAttribute('data-threadid', post.thread.ID);
            a.setAttribute('data-postid', postID);
          }
        } else if (redirect = Redirect.to({
          boardID: boardID,
          threadID: 0,
          postID: postID
        })) {
          a = $.el('a', {
            href: redirect,
            className: 'deadlink',
            target: '_blank',
            textContent: "" + quote + "\u00A0(Dead)"
          });
          if (Redirect.post(boardID, postID)) {
            $.addClass(a, 'quotelink');
            a.setAttribute('data-boardid', boardID);
            a.setAttribute('data-postid', postID);
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
        a = null;
      }
    }
  };

  QuoteInline = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Quote Inlining']) {
        return;
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      return Post.prototype.callbacks.push({
        name: 'Quote Inlining',
        cb: this.node
      });
    },
    node: function() {
      var link, _i, _len, _ref;

      _ref = this.nodes.quotelinks.concat(__slice.call(this.nodes.backlinks));
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        $.on(link, 'click', QuoteInline.toggle);
      }
    },
    toggle: function(e) {
      var boardID, context, postID, threadID, _ref;

      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.button !== 0) {
        return;
      }
      e.preventDefault();
      _ref = Get.postDataFromLink(this), boardID = _ref.boardID, threadID = _ref.threadID, postID = _ref.postID;
      context = Get.contextFromLink(this);
      if ($.hasClass(this, 'inlined')) {
        QuoteInline.rm(this, boardID, threadID, postID, context);
      } else {
        if ($.x("ancestor::div[@id='p" + postID + "']", this)) {
          return;
        }
        QuoteInline.add(this, boardID, threadID, postID, context);
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
    add: function(quotelink, boardID, threadID, postID, context) {
      var inline, isBacklink, post;

      isBacklink = $.hasClass(quotelink, 'backlink');
      inline = $.el('div', {
        id: "i" + postID,
        className: 'inline'
      });
      $.after(QuoteInline.findRoot(quotelink, isBacklink), inline);
      Get.postClone(boardID, threadID, postID, inline, context);
      if (!((post = g.posts["" + boardID + "." + postID]) && context.thread === post.thread)) {
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
      var el, inlined, isBacklink, post, root, _ref;

      isBacklink = $.hasClass(quotelink, 'backlink');
      root = QuoteInline.findRoot(quotelink, isBacklink);
      root = $.x("following-sibling::div[@id='i" + postID + "'][1]", root);
      $.rm(root);
      if (!(el = root.firstElementChild)) {
        return;
      }
      post = g.posts["" + boardID + "." + postID];
      post.rmClone(el.dataset.clone);
      if (Conf['Forward Hiding'] && isBacklink && context.thread === g.threads["" + boardID + "." + threadID] && !--post.forwarded) {
        delete post.forwarded;
        $.rmClass(post.nodes.root, 'forwarded');
      }
      while (inlined = $('.inlined', el)) {
        _ref = Get.postDataFromLink(inlined), boardID = _ref.boardID, threadID = _ref.threadID, postID = _ref.postID;
        QuoteInline.rm(inlined, boardID, threadID, postID, context);
        $.rmClass(inlined, 'inlined');
      }
    }
  };

  QuotePreview = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Quote Previewing']) {
        return;
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      return Post.prototype.callbacks.push({
        name: 'Quote Previewing',
        cb: this.node
      });
    },
    node: function() {
      var link, _i, _len, _ref;

      _ref = this.nodes.quotelinks.concat(__slice.call(this.nodes.backlinks));
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        $.on(link, 'mouseover', QuotePreview.mouseover);
      }
    },
    mouseover: function(e) {
      var boardID, clone, origin, post, postID, posts, qp, quote, quoterID, threadID, _i, _j, _len, _len1, _ref, _ref1;

      if ($.hasClass(this, 'inlined')) {
        return;
      }
      _ref = Get.postDataFromLink(this), boardID = _ref.boardID, threadID = _ref.threadID, postID = _ref.postID;
      qp = $.el('div', {
        id: 'qp',
        className: 'dialog'
      });
      $.add(Header.hover, qp);
      Get.postClone(boardID, threadID, postID, qp, Get.contextFromLink(this));
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
      if (!(origin = g.posts["" + boardID + "." + postID])) {
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
      _ref1 = clone.nodes.quotelinks.concat(__slice.call(clone.nodes.backlinks));
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        quote = _ref1[_j];
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
        textContent: (QuoteBacklink.funk(this.ID)) + (Conf['Mark Quotes of You'] && this.info.yours ? QuoteYou.text : '')
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
      var quotelink, quotelinks, quotes, _i, _len;

      if (this.isClone) {
        return;
      }
      if (!(quotes = this.quotes).length) {
        return;
      }
      quotelinks = this.nodes.quotelinks;
      for (_i = 0, _len = quotelinks.length; _i < _len; _i++) {
        quotelink = quotelinks[_i];
        if (QR.db.get(Get.postDataFromLink(quotelink))) {
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
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      this.text = '\u00A0(OP)';
      return Post.prototype.callbacks.push({
        name: 'Mark OP Quotes',
        cb: this.node
      });
    },
    node: function() {
      var boardID, op, postID, quotelink, quotelinks, quotes, _i, _j, _len, _len1, _ref;

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
        _ref = Get.postDataFromLink(quotelink), boardID = _ref.boardID, postID = _ref.postID;
        if (("" + boardID + "." + postID) === op) {
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
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      this.text = '\u00A0(Cross-thread)';
      return Post.prototype.callbacks.push({
        name: 'Mark Cross-thread Quotes',
        cb: this.node
      });
    },
    node: function() {
      var board, boardID, quotelink, quotelinks, quotes, thread, threadID, _i, _len, _ref, _ref1;

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
        _ref1 = Get.postDataFromLink(quotelink), boardID = _ref1.boardID, threadID = _ref1.threadID;
        if (!threadID) {
          continue;
        }
        if (this.isClone) {
          quotelink.textContent = quotelink.textContent.replace(QuoteCT.text, '');
        }
        if (boardID === this.board.ID && threadID !== thread.ID) {
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
          singlePost.nodes.date.firstChild.textContent = relative;
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

      link = link.replace(/%(T?URL|MD5|board)/ig, function(parameter) {
        switch (parameter) {
          case '%TURL':
            return "' + encodeURIComponent(post.file.thumbURL) + '";
          case '%URL':
            return "' + encodeURIComponent(post.file.URL) + '";
          case '%MD5':
            return "' + encodeURIComponent(post.file.MD5) + '";
          case '%board':
            return "' + encodeURIComponent(post.board) + '";
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
        id: 'img-controls',
        className: 'expand-all-shortcut',
        title: 'Expand All Images',
        href: 'javascript:;'
      });
      $.on(this.EAI, 'click', ImageExpand.cb.toggleAll);
      Post.prototype.callbacks.push({
        name: 'Image Expansion',
        cb: this.node
      });
      return $.asap((function() {
        return $.id('delform');
      }), function() {
        return $.prepend($.id('delform'), ImageExpand.EAI);
      });
    },
    node: function() {
      var thumb, _ref;

      if (!((_ref = this.file) != null ? _ref.isImage : void 0)) {
        return;
      }
      thumb = this.file.thumb;
      $.on(thumb.parentNode, 'click', ImageExpand.cb.toggle);
      if (this.isClone && $.hasClass(thumb, 'expanding')) {
        ImageExpand.contract(this);
        ImageExpand.expand(this);
        return;
      }
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
      var headRect, rect, root, thumb, top;

      thumb = post.file.thumb;
      if (!(post.file.isExpanded || $.hasClass(thumb, 'expanding'))) {
        ImageExpand.expand(post);
        return;
      }
      ImageExpand.contract(post);
      rect = post.nodes.root.getBoundingClientRect();
      if (!(rect.top <= 0 || rect.left <= 0)) {
        return;
      }
      headRect = Header.bar.getBoundingClientRect();
      top = rect.top - headRect.top - headRect.height;
      root = $.engine === 'webkit' ? d.body : doc;
      if (rect.top < 0) {
        root.scrollTop += top;
      }
      if (rect.left < 0) {
        return root.scrollLeft = 0;
      }
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
      var prev, thumb;

      thumb = post.file.thumb;
      if (!$.hasClass(thumb, 'expanding')) {
        return;
      }
      post.file.isExpanded = true;
      if (!post.nodes.root.parentNode) {
        $.addClass(post.nodes.root, 'expanded-image');
        $.rmClass(post.file.thumb, 'expanding');
        return;
      }
      prev = post.nodes.root.getBoundingClientRect();
      return $.queueTask(function() {
        var curr, root;

        $.addClass(post.nodes.root, 'expanded-image');
        $.rmClass(post.file.thumb, 'expanding');
        if (!(prev.top + prev.height <= 0)) {
          return;
        }
        root = $.engine === 'webkit' ? d.body : doc;
        curr = post.nodes.root.getBoundingClientRect();
        return root.scrollTop += curr.height - prev.height + curr.top - prev.top;
      });
    },
    error: function() {
      var URL, post, src, timeoutID;

      post = Get.postFromNode(this);
      $.rm(this);
      delete post.file.fullImage;
      if (!($.hasClass(post.file.thumb, 'expanding') || $.hasClass(post.nodes.root, 'expanded-image'))) {
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
        if (type === 'Fit width' || type === 'Fit height') {
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
    },
    menuToggle: function(e) {
      return ImageExpand.opmenu.toggle(e, this, g);
    }
  };

  FappeTyme = {
    init: function() {
      var el;

      if (!Conf['Fappe Tyme'] && (g.VIEW === 'catalog' || g.BOARD === 'f')) {
        return;
      }
      el = $.el('a', {
        href: 'javascript:;',
        id: 'fappeTyme',
        title: 'Fappe Tyme'
      });
      $.on(el, 'click', FappeTyme.toggle);
      $.asap((function() {
        return $.id('boardNavMobile');
      }), function() {
        return $.add($.id('navtopright'), el);
      });
      return Post.prototype.callbacks.push({
        name: 'Fappe Tyme',
        cb: this.node
      });
    },
    node: function() {
      if (this.file) {
        return;
      }
      return $.addClass(this.nodes.root, "noFile");
    },
    toggle: function() {
      return $.toggleClass(doc, 'fappeTyme');
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

  ImageReplace = {
    init: function() {
      if (g.VIEW === 'catalog') {
        return;
      }
      return Post.prototype.callbacks.push({
        name: 'Image Replace',
        cb: this.node
      });
    },
    node: function() {
      var URL, img, style, thumb, type, _ref, _ref1;

      if (this.isClone || this.isHidden || this.thread.isHidden || !((_ref = this.file) != null ? _ref.isImage : void 0)) {
        return;
      }
      _ref1 = this.file, thumb = _ref1.thumb, URL = _ref1.URL;
      if (!(Conf["Replace " + ((type = (URL.match(/\w{3}$/))[0].toUpperCase()) === 'PEG' ? 'JPG' : type)] && !/spoiler/.test(thumb.src))) {
        return;
      }
      if (this.file.isSpoiler) {
        style = thumb.style;
        style.maxHeight = style.maxWidth = this.isReply ? '125px' : '250px';
      }
      img = $.el('img');
      $.on(img, 'load', function() {
        return thumb.src = URL;
      });
      return img.src = URL;
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
      $.add(Header.hover, el);
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
      if (g.BOARD.ID === 'g') {
        this.callbacks.push(Fourchan.code);
      }
      if (g.BOARD.ID === 'sci') {
        this.callbacks.push(Fourchan.math);
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
    callbacks: [],
    cb: function(e) {
      var post;

      e.preventDefault();
      post = Get.postFromNode(this);
      return ExpandComment.expand(post);
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
      var callback, clone, comment, href, postObj, posts, quote, spoilerRange, status, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;

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
      _ref1 = ExpandComment.callbacks;
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        callback = _ref1[_k];
        callback.call(post);
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
      var a, inlined, num, post, replies, reply, threadRoot, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;

      threadRoot = thread.OP.nodes.root.parentNode;
      a = $('.summary', threadRoot);
      switch (thread.isExpanded) {
        case false:
        case void 0:
          thread.isExpanded = 'loading';
          _ref = $$('.thread > .postContainer', threadRoot);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            post = _ref[_i];
            ExpandComment.expand(Get.postFromRoot(post));
          }
          if (!a) {
            thread.isExpanded = true;
            return;
          }
          thread.isExpanded = 'loading';
          a.textContent = a.textContent.replace('+', '× Loading...');
          $.cache("//api.4chan.org/" + thread.board + "/res/" + thread + ".json", function() {
            return ExpandThread.parse(this, thread, a);
          });
          break;
        case 'loading':
          thread.isExpanded = false;
          if (!a) {
            return;
          }
          a.textContent = a.textContent.replace('× Loading...', '+');
          break;
        case true:
          thread.isExpanded = false;
          if (a) {
            a.textContent = a.textContent.replace('-', '+');
            num = (function() {
              if (thread.isSticky) {
                return 1;
              } else {
                switch (g.BOARD.ID) {
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
      if (![200, 304].contains(status)) {
        a.textContent = "Error " + req.statusText + " (" + status + ")";
        $.off(a, 'click', ExpandThread.cb.toggle);
        return;
      }
      thread.isExpanded = true;
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
        return $.globalEval("Parser.parseThread(" + thread.ID + ", 1, " + nodes.length + ")");
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
      var excerpt;

      return d.title = (excerpt = Get.threadExcerpt(this)).length > 80 ? "" + excerpt.slice(0, 77) + "..." : excerpt;
    }
  };

  Unread = {
    init: function() {
      if (g.VIEW !== 'thread' || !Conf['Unread Count'] && !Conf['Unread Tab Icon']) {
        return;
      }
      this.db = new DataBoard('lastReadPosts', this.sync);
      this.hr = $.el('hr', {
        id: 'unread-line'
      });
      this.posts = [];
      this.postsQuotingYou = [];
      return Thread.prototype.callbacks.push({
        name: 'Unread',
        cb: this.node
      });
    },
    node: function() {
      var ID, hash, post, posts, root, _ref;

      Unread.thread = this;
      Unread.title = d.title;
      posts = [];
      _ref = this.posts;
      for (ID in _ref) {
        post = _ref[ID];
        if (post.isReply) {
          posts.push(post);
        }
      }
      Unread.lastReadPost = Unread.db.get({
        boardID: this.board.ID,
        threadID: this.ID,
        defaultValue: 0
      });
      Unread.addPosts(posts);
      $.on(d, 'ThreadUpdate', Unread.onUpdate);
      $.on(d, 'scroll visibilitychange', Unread.read);
      if (Conf['Unread Line']) {
        $.on(d, 'visibilitychange', Unread.setLine);
      }
      if (!Conf['Scroll to Last Read Post']) {
        return;
      }
      if ((hash = location.hash.match(/\d+/)) && hash[0] in this.posts) {
        return;
      }
      if (Unread.posts.length) {
        while (root = $.x('preceding-sibling::div[contains(@class,"postContainer")][1]', Unread.posts[0].nodes.root)) {
          if (!(Get.postFromRoot(root)).isHidden) {
            break;
          }
        }
        return root.scrollIntoView(false);
      } else if (posts.length) {
        return Header.scrollToPost(posts[posts.length - 1].nodes.root);
      }
    },
    sync: function() {
      var lastReadPost;

      lastReadPost = Unread.db.get({
        boardID: Unread.thread.board.ID,
        threadID: Unread.thread.ID,
        defaultValue: 0
      });
      if (!(Unread.lastReadPost < lastReadPost)) {
        return;
      }
      Unread.lastReadPost = lastReadPost;
      Unread.readArray(Unread.posts);
      Unread.readArray(Unread.postsQuotingYou);
      Unread.setLine();
      return Unread.update();
    },
    addPosts: function(newPosts) {
      var ID, data, post, _i, _len;

      for (_i = 0, _len = newPosts.length; _i < _len; _i++) {
        post = newPosts[_i];
        ID = post.ID;
        if (ID <= Unread.lastReadPost || post.isHidden) {
          continue;
        }
        if (QR.db) {
          data = {
            boardID: post.board.ID,
            threadID: post.thread.ID,
            postID: post.ID
          };
          if (QR.db.get(data)) {
            continue;
          }
        }
        Unread.posts.push(post);
        Unread.addPostQuotingYou(post);
      }
      if (Conf['Unread Line']) {
        Unread.setLine(newPosts.contains(Unread.posts[0]));
      }
      Unread.read();
      return Unread.update();
    },
    addPostQuotingYou: function(post) {
      var quotelink, _i, _len, _ref;

      if (!QR.db) {
        return;
      }
      _ref = post.nodes.quotelinks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        quotelink = _ref[_i];
        if (QR.db.get(Get.postDataFromLink(quotelink))) {
          Unread.postsQuotingYou.push(post);
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
    readSinglePost: function(post) {
      var i;

      if ((i = Unread.posts.indexOf(post)) === -1) {
        return;
      }
      Unread.posts.splice(i, 1);
      if (i === 0) {
        Unread.lastReadPost = post.ID;
        Unread.saveLastReadPost();
      }
      if ((i = Unread.postsQuotingYou.indexOf(post)) !== -1) {
        Unread.postsQuotingYou.splice(i, 1);
      }
      return Unread.update();
    },
    readArray: function(arr) {
      var i, post, _i, _len;

      for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
        post = arr[i];
        if (post.ID > Unread.lastReadPost) {
          break;
        }
      }
      return arr.splice(0, i);
    },
    read: function(e) {
      var bottom, height, i, post, _i, _len, _ref;

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
      Unread.posts.splice(0, i);
      Unread.readArray(Unread.postsQuotingYou);
      if (e) {
        return Unread.update();
      }
    },
    saveLastReadPost: $.debounce(2 * $.SECOND, function() {
      return Unread.db.set({
        boardID: Unread.thread.board.ID,
        threadID: Unread.thread.ID,
        val: Unread.lastReadPost
      });
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
      } else {
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
      Favicon.el.href = g.DEAD ? Unread.postsQuotingYou.length ? Favicon.unreadDeadY : count ? Favicon.unreadDead : Favicon.dead : count ? Unread.postsQuotingYou.length ? Favicon.unreadY : Favicon.unread : Favicon["default"];
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
      var unreadDead;

      unreadDead = Favicon.unreadDeadY = Favicon.unreadSFW = Favicon.unreadSFWY = Favicon.unreadNSFW = Favicon.unreadNSFWY = 'data:image/png;base64,';
      switch (Conf['favicon']) {
        case 'ferongr':
          Favicon.unreadDead += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEX///9zBQC/AADpDAP/gID/q6voCwJJTwpOAAAAAXRSTlMAQObYZgAAAGJJREFUeF5Fi7ENg0AQBCfa/AFdDh2gdwPIogMK2E2+/xLslwOvdqRJhv+GQQPUCtJM7svankLrq/I+TY5e6Ueh1jyBMX7AFJi9vwfyVO4CbbO6jNYpp9GyVPbdkFhVgAQ2H0NOE5jk9DT8AAAAAElFTkSuQmCC';
          Favicon.unreadDeadY += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAS1BMVEUAAAAAAAAAAAAJAAASAAAZAQAaAQAiAQAkAQAoFBQyAgAzAgA1AgA4AABBAgBXAwBzBQCEBgGvCAG/AADoCwLpDAP/gID/q6v///9zILr8AAAAA3RSTlMAx9dmesIgAAAAc0lEQVQY02WPgQ6DIBBDmTqnbE70Cvb/v3TAnW5OSKB9ybXg3HUBOAmEEH4FQtrSn4gxi+xjVC9SVOEiSvbZI8zSV+/Xo7icnryZ15GObMxvtWUkB/VJW57kHU7fUcHStm8FkncGE/mwP6CGzq/eauHwvT7sWQt3gZLW+AAAAABJRU5ErkJggg==';
          Favicon.unreadSFW += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEX///8AcH4AtswA2PJ55fKi6fIA1/FtpPADAAAAAXRSTlMAQObYZgAAAGJJREFUeF5Fi7ENg0AQBCfa/AFdDh2gdwPIogMK2E2+/xLslwOvdqRJhv+GQQPUCtJM7svankLrq/I+TY5e6Ueh1jyBMX7AFJi9vwfyVO4CbbO6jNYpp9GyVPbdkFhVgAQ2H0NOE5jk9DT8AAAAAElFTkSuQmCC';
          Favicon.unreadSFWY += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAASFBMVEUAAAAAAAAAAAAACAkAERMAGBsAGR0AISUALzQALzUAMTcANjwAP0cAVF8AcH4AeokAorYAtswA1/EA2PISIyV55fKi6fL////l+pZqAAAAA3RSTlMAx9dmesIgAAAAcklEQVQY02VPARLCIAxjsjnUWdcg6/9/ukIr00nvIMldEhrC/wHwA0BE3wBUtnICOStQnrNx5oqqzmzKx9vDPH1Nae3F9U4ig3OzjCIX51treYvMxou13EQmBPtHE14xLiawjgoPtfgOaKHP+9VrEXA8O1v7CmSPE3u0AAAAAElFTkSuQmCC';
          Favicon.unreadNSFW += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEX///8oeQBJ3ABV/wHM/7Lu/+ZU/gAqUP3dAAAAAXRSTlMAQObYZgAAAGJJREFUeF5Fi7ENg0AQBCfa/AFdDh2gdwPIogMK2E2+/xLslwOvdqRJhv+GQQPUCtJM7svankLrq/I+TY5e6Ueh1jyBMX7AFJi9vwfyVO4CbbO6jNYpp9GyVPbdkFhVgAQ2H0NOE5jk9DT8AAAAAElFTkSuQmCC';
          Favicon.unreadNSFWY += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAS1BMVEUAAAAAAAAAAAADCgAGEgAIGgAJGwALJAANJwASNwASOAATOgAVQQAWRAAeWwAgKBsoeQAwkQA/wABJ3ABU/gBV/wHM/7Lu/+b////r+K2AAAAAA3RSTlMAx9dmesIgAAAAc0lEQVQY02WPgQ6DIBBDmTonbk70Cvb/v3TAnW5OSKB9ybXg3HUBOAmEEH4FQtrSn4gxi+xjVC9SVOEiSvbZI8zSV+/Xo7icnryZ15GObMxvtWUmB/VJW0byDqfvqGBp20mB5J3Bi3zYH1BD38/eauHwvT7sEAt1Fb320QAAAABJRU5ErkJggg==';
          break;
        case 'xat-':
          Favicon.unreadDead += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAPFBMVEX9AAD8AAD/AAD+AADAExKKXl2CfHqLkZFub2yfaF3bZ2PzZGL/zs//iYr/AAASAAAGAAAAAAAAAAAAAADpOCseAAAADHRSTlP9MAcAATVYeprJ5O/MbzqoAAAAXklEQVQY03VPQQ7AIAgz8QAG4dL//3VVcVk2Vw4tDVQp9YVyMACIEkIxDEQEGjHFnBjCbPU5EXBfnBns6WRG1Wbuvbtb0z9jr6Qh2KGQenp2/+xpsFQnrePAuulz7QUTuwm5NnwmIAAAAABJRU5ErkJggg==';
          Favicon.unreadDeadY += 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAMAAACuAq9NAAAAY1BMVEUBAAACAQELCQkPDQwgFBMzKilOSEdva2iEgoCReHOadXClamDIaWbxcG7+hIX+mpv+m5z+oqP+tLX+zc7//f3+9PT97Oz23t750NDbra3zwL87LCwAAAAGAABHAADPAAD/AABkWeLDAAAAHHRSTlO5/fTv8Na2n42lsMvi8v3+/v749OaITDsDAQABSG2w8gAAAGdJREFUCNdNjtEKgDAIRYVGCmsyqCe7q/3/V2azQfpwPehVyQCIMIt4YYTeO7LHKMiGlDIkuh2qofR6obUqhtc4F637XreU1h+m41gcJX/DHyJWXYHzkCMm+hd3a4GezLNr8PQA4bQHEXEQFRJP5NAAAAAASUVORK5CYII=';
          Favicon.unreadSFW += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAPFBMVEUAAAAAAAAAAAAAAABFRUdsa2yRjop4dXVpZ2tdcI9dfKdBirUzlMBHpdxSquRisfOs2/99xv8umMMAAABljCUFAAAAEHRSTlN7FwUAQVt6kZ2/zej59vTv0aAplgAAAGNJREFUGNNtj1EOwCAIQ5eYIPCD0vvfdYi6LJvy0fICNVzl864DAECVuVKYAeDuEFVJkxPDmM1+TTh6n7oy0FvrWBmF1aIPYspnUGWvSE1A2KGgcvp2AtU3iGJOmcch6pHftTekXQrRd6slMAAAAABJRU5ErkJggg==';
          Favicon.unreadSFWY += 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAMAAACuAq9NAAAAY1BMVEUAAAAAAAAAAAAAAAAREBAWFRY1NDROTE1iYGFzdXp4eoCAgYVlc4mHjZiYoa6zvcqy1/Pg8v+e1f+b1P6X0f2DyP5jsu49msgymcctkLomc5QbPU0SIiwNFxwumMMAAAAAAADALpU1AAAAHnRSTlPNLgcBAAABBxhdc4WznarD8P7+/v3+8/z9/vz2+PUOYDHSAAAAZElEQVQI102OsQ6AMAhEMWGDpTbUQUvu/79ShDYRhuMFDiAGIKIqEgUT3B0akQVxyhgp1XWYldLnhfXTkF5WHdZb69cz9YdPazNQdA0vRK2ahftQDGNjfHHXZjgSV5cRGQHCwS8j7A9loVSnzwAAAABJRU5ErkJggg==';
          Favicon.unreadNSFW += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAPFBMVEUAAAAAAAAAAAAAAAAfJSBLUU1ydHR8fn6Ri5Frbm9dn19jvEFt30tv5VB082KR/33Z/9Gq/5tmzDMAAADw+5ntAAAAEHRSTlP++ywHAAE2Wnuayez19O/+EzXeOQAAAF9JREFUGNN1TzESwCAIc3AABxDy/78WFXu91oYhIYcRSn2hHAwAxAEKMQy4O1pgijkxhMjqc8KhujgzoGaKzKjcRK13U2n8Z+wnaRB2KKievt2bPY0o5knrOETd9Ln2AuDLCz1j8HTeAAAAAElFTkSuQmCC';
          Favicon.unreadNSFWY += 'iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAMAAACuAq9NAAAAY1BMVEUPGgsCBAIBAQEBAQAAAQAAAAABAQEFBQQQEw85SDdVa1GhzJm967TZ+NLP+sbM+8S6/a3k/9+s/pyr/puX/oSd15KIuoGBj39tfm1qj2RepFlu2VRkwzZlyTNatC5myzMAAAAOPREWAAAAHnRSTlP4/fz331IPBQIBAAECOly37/7+/v7XwpWktNDy+f7X56yoAAAAZElEQVQI102NwQ7AIAhDMdku3JwkIiaz//+VQ9FkcCgvpUAMoKpX9YEJYww0s7YG4iW9Lwl3QCSUZhZSHsHKslqXknPpRPpDypkmtr0cWBGntnseOeKgGd6UAr1Vj8vw9sKFmz+fERAp5vutHwAAAABJRU5ErkJggg==';
          break;
        case 'Mayhem':
          Favicon.unreadDead += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jZ2ScWuDMBDFgw4pIkU0WsoQkWAYIkXZH4N9/+/V3dmfXSrKYIFHwt17j8vdGWNMIkgFuaDgzgQnwRs4EQs5KdolUQtagRN0givEDBTEOjgtGs0Zq8F7cKqqusVxrMQLaDUWcjBSrXkn8gs51tpJSWLk9b3HUa0aNIL5gPBR1/V4kJvR7lTwl8GmAm1Gf9+c3S+89qBHa8502AsmSrtBaEBPbIbj0ah2madlNAPEccdgJDfAtWifBjqWKShRBT6KoiH8QlEUn/qt0CCjnNdmPUwmFWzj9Oe6LpKuZXcwqq88z78Pch3aZU3dPwwc2sWlfZKCW5tWluV8kGvXClLm6dYN4/aUqfCbnEOzNDGhGZbNargvxCzvMGfRJD8UaDVvgkzo6QAAAABJRU5ErkJggg==';
          Favicon.unreadDeadY += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABj0lEQVQ4y42TQUorQRCGv+oekpj43pOhOyIiKoHBxTMkuAnEtWcwx/AY3sUbBIRcwCw8gCfIMkaTOOUiNdgGRRuKoav+v2qq/i4BakBmXweUwDoxLF5ZhVkC64rYBHYMUAIvwKuBMEwdaFiCNbAAngEC0NHkxBi73vsOsG92HGPsphigY1wOzfNhqhpC6AEd730RQuh9hQEOAY6A/jeAs3a7/f+bWB84ckCpqg+I8Osjgqo+AKUDViJS8LkGMcY+sJrNZssYY387LiIFsBLgL9AC/pgaArzZlF+sZgO4BG7sfgvcA3MxUtOStBIpX7cS3Klqd9OBTIEr4DlLOsuAmqpODXQOiHMuy/O8FkLoJth/6Uh2gQPg87Q3k+7leX6hqnpmPvM/GWfXWeWGqj5+oUS9LMs6wF7iHAwGJ9ZW5uxpup+UGwEtEVoijEYjKl66PJujmvIW3vsFwBiYqzJXZTweY5wSU6Bd7UP1KoECODUrJpOJAtPhcKjAtXGaYptWs57qWyv9Zn/it1a5knj5Dm3v4q8APeACAAAAAElFTkSuQmCC';
          Favicon.unreadSFW += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZ2S4crCMAxF+0OGDJEPKYrIGKOsiJSx/fJRfSAfTJNyKqXfiuDg0C25N2RJjTGmEVrhTzhw7oStsIEtsVzT4o2Jo9ALThiEM8IdHIgNaHo8mjNWg6/ske8bohPo+63QOLzmooHp8fyAICBSQkVz0QKdsFQEV6WSW/D+7+BbgbIDHcb4Kp61XyjyI16zZ8JemGltQtDBSGxB4/GoN+7TpkkjDCsFArm0IYv3U0BbnYtf8BCy+JytsE0X6VyuKhPPK/GAJ14kvZZDZVV3pZIb8MZr6n4o4PDGKn0S5SdDmyq5PnXQsk+Xbhinp03FFzmHJw6xYRiWm9VxnohZ3vOcxdO8ARmXRvbWdtzQAAAAAElFTkSuQmCC';
          Favicon.unreadSFWY += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAkFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBQcHFx4KISoNLToaVW4oKCgul8M4ODg7OztMTEyRkZHBwcH///9dzWZ0AAAAI3RSTlMEBggKDA4QEhQWFxkbHR8hIyUmKCosLjAxN1hbYc7P0dLc3mzWzBUAAAC+SURBVBjTNY3pcsIwEIM3ePERx/bG5IIe0NIrhVbv/3Y4Ydj9Ic030ogqpY3mDdGGi1EVsYuSvGE2Pkl0TFYAdLGuY1eMWGowzzN6kX41DYVpNbvdKlO4Jx5gSbi2VO+Vcq2jrc/jNLQhtM+n05PfkrKxG/oFHIEXqwqQsVRy7n+AtwLYL3sYR3wA755Jp3Vvv8cn8Js0GXmA7/P5TwzpiLn8MOALuEZNygkm5JTy/+vl4BRVbJvQ1NbWRSxXN64PGOBlhG0qAAAAAElFTkSuQmCC';
          Favicon.unreadNSFW += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jZ2S0WrDMAxF/TBCCKWMYhZKCSGYmFJMSNjD/mhf239qJXNcjBdTWODgRLpXKJKNMaYROuFTOHEehFb4gJZYrunwxsSXMApOmIQzwgOciE1oRjyaM1aDj+yR7xuiHvT9VmgcXnPRwO/9+wWCgEgJFc1FCwzCVhFclUpuw/u3g3cFyg50GPOjePZ+ocjPeM2RCXthpbUFwQAzsQ2Nx6PeuE+bJo0w7BQI5NKGLN5XAW11LX7BQ8jia7bCLl2kc7mqTLzuxAOeeJH0Wk6VVf0oldyEN15T948CDm+sMiZRfjK0pZIbUwcd+3TphnF62lR8kXN44hAbhmG5WQNnT8zynucsnuYJhFpBfkMzqD4AAAAASUVORK5CYII=';
          Favicon.unreadNSFWY += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAkFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECAIQIAgWLAsePA8oKCg4ODg6dB07OztMTExmzDORkZHBwcH///92I3mvAAAAI3RSTlMEBggKDA4QEhQWFxkbHR8hIyUmKCosLjAxN1hbYc7P0dLc3mzWzBUAAAC+SURBVBjTNY3pcsIwEIM3ePERx/bG5IIe0NIT0ur93w4nDLs/pPlGGlGltNG8IdpwMaoidlGSN8zGJ4mOyQqALtZ17IoRSw3meUYv0q+moTCtZrdbZQr3xAMsCdeW6r1SrnW09XmchjaE9vl0evJbUjZ2Q7+AI/BiVQEylkrO/TfwVgD7ZQ/jiA/g3TPptO7t9/gEfpImIw/wez7/iSEdMZcfBnwB16hJOcGEnFL+f70cnKKKbROa2tq6iOXqBuMXGTe4CAUbAAAAAElFTkSuQmCC';
          break;
        case 'Original':
          Favicon.unreadDead += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX/////AAD///8AAABBZmS3AAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII=';
          Favicon.unreadDeadY += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALVBMVEUAAAAAAAAAAAAAAAAKAAAoAAAoKCg4AAA4ODg7OztMAACRAADBwcH/AAD///+WCcPSAAAAA3RSTlMAx9dmesIgAAAAZ0lEQVQI1z2LsQmAUAxEb4Isk0rwp3EPR3ECcRQrh7C3/nAasPwzmCgYuPBy5AH/NALSImqAK+H1oJRqyJVHNAnZqDITVhj7/PrAciJ9il0BHs/jjU+fnB9sQ0IxX6OBO6Xr0xKAxANLZzUanCWzZQAAAABJRU5ErkJggg==';
          Favicon.unreadSFW += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX///8ul8P///8AAACaqgkzAAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII=';
          Favicon.unreadSFWY += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALVBMVEUAAAAAAAAAAAAAAAABBQcHFx4KISoNLToaVW4oKCgul8M4ODg7OzvBwcH///8uS/CdAAAAA3RSTlMAx9dmesIgAAAAZ0lEQVQI1z2LsQ2AUAhEbwKWoftRGvdwBEewchM7d9BFbE6pbP4Mgj+R5MjjwgP+qQSkRtQAV8K3lVI2Q648oknIRpWZsMI4988HjgvpU+wO8HgeHzR9cjZYhoRiPkcDd0rXpyUAiRd5YjKC7MvNRgAAAABJRU5ErkJggg==';
          Favicon.unreadNSFW += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEX///9mzDP///8AAACT0n1lAAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII=';
          Favicon.unreadNSFWY += 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALVBMVEUAAAAAAAAAAAAAAAAECAIQIAgWLAsePA8oKCg4ODg6dB07OztmzDPBwcH///+rsf3XAAAAA3RSTlMAx9dmesIgAAAAZ0lEQVQI1z2LsQ2AUAhEbwKWofRL4x6O4AhuopWb2P4F7E5prP4MgiaSHHlceMA/jYC0iBrgSnjdKaUacuURTUI2qsyEFcaxvD6wnkifYleAx/N449Mn5wfbkFDM52jgTun6tAQg8QAEvjQg42KY2AAAAABJRU5ErkJggg==';
      }
      if (Favicon.SFW) {
        Favicon.unread = Favicon.unreadSFW;
        return Favicon.unreadY = Favicon.unreadSFWY;
      } else {
        Favicon.unread = Favicon.unreadNSFW;
        return Favicon.unreadY = Favicon.unreadNSFWY;
      }
    },
    empty: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEX////b29sAAAAJ2DVhAAAAAXRSTlMAQObYZgAAAD1JREFUeF5NyrENgEAMxVArFZcpaD4z/TKjZIwrMyoSQoJXuDKf7BhUyyyrkGVycviZhLD6Wd7sq4jzaABukdYKjYsxq7wAAAAASUVORK5CYII=',
    dead: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEX/////AAAAAACalQKRAAAAAXRSTlMAQObYZgAAAD1JREFUeF5NyrENgEAMxVArFZcpaD4z/TKjZIwrMyoSQoJXuDKf7BhUyyyrkGVycviZhLD6Wd7sq4jzaABukdYKjYsxq7wAAAAASUVORK5CYII='
  };

  ThreadStats = {
    init: function() {
      var html;

      if (g.VIEW !== 'thread' || !Conf['Thread Stats']) {
        return;
      }
      html = '<span id=post-count>0</span> / <span id=file-count>0</span>';
      if (Conf['Thread Updater']) {
        this.dialog = $.el('span', {
          innerHTML: "[ " + html + " ]"
        });
      } else {
        this.dialog = UI.dialog('thread-stats', 'bottom: 0; left: 0;', "<div class=move>" + html + "</div>");
      }
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
      ThreadStats.thread = this;
      ThreadStats.update(postCount, fileCount);
      $.on(d, 'ThreadUpdate', ThreadStats.onUpdate);
      if (Conf['Thread Updater']) {
        return $.asap((function() {
          return $('.move', ThreadUpdater.dialog);
        }), function() {
          return $.prepend($('.move', ThreadUpdater.dialog), ThreadStats.dialog);
        });
      } else {
        return $.add(d.body, ThreadStats.dialog);
      }
    },
    onUpdate: function(e) {
      var fileCount, postCount, _ref;

      if (e.detail[404]) {
        return;
      }
      _ref = e.detail, postCount = _ref.postCount, fileCount = _ref.fileCount;
      return ThreadStats.update(postCount, fileCount);
    },
    update: function(postCount, fileCount) {
      var fileCountEl, postCountEl, thread;

      thread = ThreadStats.thread, postCountEl = ThreadStats.postCountEl, fileCountEl = ThreadStats.fileCountEl;
      postCountEl.textContent = postCount;
      fileCountEl.textContent = fileCount;
      (thread.postLimit && !thread.isSticky ? $.addClass : $.rmClass)(postCountEl, 'warning');
      return (thread.fileLimit && !thread.isSticky ? $.addClass : $.rmClass)(fileCountEl, 'warning');
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
      this.checkPostCount = 0;
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
      Rice.nodes(ThreadUpdater.dialog);
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
      checkpost: function() {
        if (!(g.DEAD || ThreadUpdater.foundPost || ThreadUpdater.checkPostCount >= 10)) {
          return setTimeout(ThreadUpdater.update, ++ThreadUpdater.checkPostCount * 500);
        }
        ThreadUpdater.checkPostCount = 0;
        delete ThreadUpdater.foundPost;
        return delete ThreadUpdater.postID;
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

        val = parseInt(this.value, 10);
        ThreadUpdater.interval = this.value = val;
        return $.cb.value.call(this);
      },
      load: function() {
        var klass, req, text, _ref;

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

            _ref = [0, 304].contains(req.status) ? [null, null] : ["" + req.statusText + " (" + req.status + ")", 'warning'], text = _ref[0], klass = _ref[1];
            ThreadUpdater.set('status', text, klass);
        }
        if (ThreadUpdater.postID) {
          ThreadUpdater.cb.checkpost(this.status);
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
      return ThreadUpdater.seconds = Conf['Optional Increase'] ? Math.max(i, [0, 5, 10, 15, 20, 30, 60, 90, 120, 240, 300][j]) : i;
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
      ThreadUpdater.thread.postLimit = !!OP.bumplimit;
      ThreadUpdater.thread.fileLimit = !!OP.imagelimit;
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
        } else if (post.file && !post.file.isDead && !files.contains(ID)) {
          post.kill(true);
          deletedFiles.push(post);
        }
        if (ThreadUpdater.postID) {
          if (ID === ThreadUpdater.postID) {
            ThreadUpdater.foundPost = true;
          }
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
            Header.scrollToPost(nodes[0]);
          }
        }
        $.queueTask(function() {
          var length, threadID;

          threadID = ThreadUpdater.thread.ID;
          length = $$('.thread > .postContainer', ThreadUpdater.root).length;
          if (Conf['Enable 4chan\'s Extension']) {
            return $.globalEval("Parser.parseThread(" + threadID + ", " + (-count) + ")");
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
        fileCount: OP.images + (!!ThreadUpdater.thread.OP.file && !ThreadUpdater.thread.OP.file.isDead)
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
      var favicon,
        _this = this;

      favicon = $.el('img', {
        className: 'favicon'
      });
      $.on(favicon, 'click', ThreadWatcher.cb.toggle);
      $.before($('input', this.OP.nodes.post), favicon);
      if (g.VIEW !== 'thread') {
        return;
      }
      return $.get('AutoWatch', 0, function(item) {
        if (item['AutoWatch'] !== _this.ID) {
          return;
        }
        ThreadWatcher.watch(_this);
        return $["delete"]('AutoWatch');
      });
    },
    ready: function() {
      if (!Main.isThisPageLegit()) {
        return;
      }
      ThreadWatcher.refresh();
      return $.add(d.body, ThreadWatcher.dialog);
    },
    refresh: function(watched) {
      var ID, board, div, favicon, id, link, nodes, props, thread, x, _ref, _ref1;

      if (!watched) {
        $.get('WatchedThreads', {}, function(item) {
          return ThreadWatcher.refresh(item['WatchedThreads']);
        });
        return;
      }
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
      $.rmAll(ThreadWatcher.dialog);
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
      return $.get('WatchedThreads', {}, function(item) {
        var watched;

        watched = item['WatchedThreads'];
        delete watched[board][threadID];
        if (!Object.keys(watched[board]).length) {
          delete watched[board];
        }
        ThreadWatcher.refresh(watched);
        return $.set('WatchedThreads', watched);
      });
    },
    watch: function(thread) {
      return $.get('WatchedThreads', {}, function(item) {
        var watched, _name;

        watched = item['WatchedThreads'];
        watched[_name = thread.board] || (watched[_name] = {});
        watched[thread.board][thread] = {
          href: "/" + thread.board + "/res/" + thread,
          textContent: Get.threadExcerpt(thread)
        };
        ThreadWatcher.refresh(watched);
        return $.set('WatchedThreads', watched);
      });
    }
  };

  Linkify = {
    init: function() {
      if (g.VIEW === 'catalog' || !Conf['Linkify']) {
        return;
      }
      if (Conf['Comment Expansion']) {
        ExpandComment.callbacks.push(this.node);
      }
      return Post.prototype.callbacks.push({
        name: 'Linkify',
        cb: this.node
      });
    },
    regString: /(\b([a-z]+:\/\/|[a-z]{3,}\.[-a-z0-9]+\.[a-z]+|[-a-z0-9]+\.[a-z]|[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+|[a-z]{3,}:[a-z0-9?]|[a-z0-9._%+-:]+@[a-z0-9.-]+\.[a-z0-9])[^\s'"]+)/gi,
    cypher: $.el('div'),
    node: function() {
      var a, child, cypher, cypherText, data, embedder, i, index, len, link, links, lookahead, name, next, node, nodes, snapshot, spoiler, text, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;

      if (this.isClone && Conf['Embedding']) {
        _ref = $$('.embedder', this.nodes.comment);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          embedder = _ref[_i];
          $.on(embedder, "click", Linkify.toggle);
        }
        return;
      }
      snapshot = $.X('.//text()', this.nodes.comment);
      cypher = Linkify.cypher;
      i = -1;
      len = snapshot.snapshotLength;
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
        for (_j = 0, _len1 = links.length; _j < _len1; _j++) {
          link = links[_j];
          index = data.indexOf(link);
          if (text = data.slice(0, index)) {
            cypher.innerHTML = text;
            _ref1 = __slice.call(cypher.childNodes);
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              child = _ref1[_k];
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
          _ref2 = __slice.call(cypher.childNodes);
          for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
            child = _ref2[_l];
            $.add(nodes, child);
          }
        }
        $.replace(node, nodes);
      }
    },
    toggle: function() {
      var el, embed, items, style, type, url;

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
        if (style = type.style) {
          el.style.cssText = style;
        } else {
          items = {
            'embedWidth': Config['embedWidth'],
            'embedHeight': Config['embedHeight']
          };
          $.get(items, function(items) {
            return el.style.cssText = "border: 0; width: " + item[0] + "px; height: " + item[1] + "px";
          });
        }
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
          return $.ajax("//soundcloud.com/oembed?show_artwork=false&&maxwidth=500px&show_comments=false&format=json&url=" + (this.getAttribute('data-originalURL')) + "&color=" + (Style.colorToHex(Themes[Conf['theme']]['Background Color'])), {
            div: div,
            onloadend: function() {
              return this.div.innerHTML = JSON.parse(this.responseText).html;
            }
          }, false);
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
      var callbacks, embed, key, match, service, type, _ref;

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
          className: 'embedder',
          href: 'javascript:;',
          textContent: '(embed)'
        });
        embed.setAttribute('data-service', key);
        embed.setAttribute('data-originalURL', a.href);
        $.on(embed, 'click', Linkify.toggle);
        if (Conf['Link Title'] && (service = type.title)) {
          $.get('CachedTitles', {}, function(item) {
            var err, title, titles;

            titles = item['CachedTitles'];
            if (title = titles[match[1]]) {
              a.textContent = title[0];
              return embed.setAttribute('data-title', title[0]);
            } else {
              try {
                return $.cache(service.api.call(a), callbacks);
              } catch (_error) {
                err = _error;
                return a.innerHTML = "[" + key + "] <span class=warning>Title Link Blocked</span> (are you using NoScript?)</a>";
              }
            }
          });
        }
        return [a, $.tn(' '), embed];
      }
      return [a];
    }
  };

  QR = {
    init: function() {
      var sc;

      if (!Conf['Quick Reply']) {
        return;
      }
      this.db = new DataBoard('yourPosts');
      sc = $.el('a', {
        className: "qr-shortcut " + (!Conf['Persistent QR'] ? 'disabled' : ''),
        textContent: 'QR',
        title: 'Quick Reply',
        href: 'javascript:;'
      });
      $.on(sc, 'click', function() {
        if (!QR.nodes || QR.nodes.el.hidden) {
          $.event('CloseMenu');
          QR.open();
          QR.nodes.com.focus();
        } else {
          QR.close();
        }
        return $.toggleClass(this, 'disabled');
      });
      Header.addShortcut(sc);
      if (Conf['Hide Original Post Form']) {
        $.asap((function() {
          return doc;
        }), function() {
          return $.addClass(doc, 'hide-original-post-form');
        });
      }
      $.on(d, '4chanXInitFinished', this.initReady);
      return Post.prototype.callbacks.push({
        name: 'Quick Reply',
        cb: this.node
      });
    },
    initReady: function() {
      QR.postingIsEnabled = !!$.id('postForm');
      if (!QR.postingIsEnabled) {
        return;
      }
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
      var err;

      if (QR.nodes) {
        QR.nodes.el.hidden = false;
        QR.unhide();
        return;
      }
      try {
        return QR.dialog();
      } catch (_error) {
        err = _error;
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
    focusin: function() {
      return $.addClass(QR.nodes.el, 'has-focus');
    },
    focusout: function() {
      return $.rmClass(QR.nodes.el, 'has-focus');
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

        if (!Conf['Cooldown']) {
          return;
        }
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
        QR.cooldown.upSpd = 0;
        QR.cooldown.upSpdAccuracy = .5;
        $.get("cooldown." + board, {}, function(item) {
          QR.cooldown.cooldowns = item["cooldown." + board];
          return QR.cooldown.start();
        });
        return $.sync("cooldown." + board, QR.cooldown.sync);
      },
      start: function() {
        if (!Conf['Cooldown']) {
          return;
        }
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

        if (!Conf['Cooldown']) {
          return;
        }
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
        isReply = post.thread !== 'new';
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
      var OP, caretPos, com, post, range, s, sel, selectionRoot, text, thread, _ref;

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
      _ref = QR.nodes, com = _ref.com, thread = _ref.thread;
      if (!com.value) {
        thread.value = OP.ID;
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
    openFileInput: function(e) {
      if (e.keyCode && e.keyCode !== 32) {
        return;
      }
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
    posts: [],
    post: (function() {
      function _Class(select) {
        var el, event, prev, _i, _len, _ref,
          _this = this;

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
        this.thread = g.VIEW === 'thread' ? g.THREADID : 'new';
        prev = QR.posts[QR.posts.length - 1];
        QR.posts.push(this);
        this.nodes.spoiler.checked = this.spoiler = prev && Conf['Remember Spoiler'] ? prev.spoiler : false;
        $.get('QR.persona', {}, function(item) {
          var persona;

          persona = item['QR.persona'];
          _this.name = prev ? prev.name : persona.name;
          _this.email = prev && !/^sage$/.test(prev.email) ? prev.email : persona.email;
          if (Conf['Remember Subject']) {
            _this.sub = prev ? prev.sub : persona.sub;
          }
          if (QR.selected === _this) {
            return _this.load();
          }
        });
        if (select) {
          this.select();
        }
        this.unlock();
      }

      _Class.prototype.rm = function() {
        var index;

        $.rm(this.nodes.el);
        index = QR.posts.indexOf(this);
        if (QR.posts.length === 1) {
          new QR.post(true);
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
        _ref = ['thread', 'name', 'email', 'sub', 'com', 'spoiler'];
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
        var rectEl, rectList;

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
        return this.load();
      };

      _Class.prototype.load = function() {
        var name, _i, _len, _ref;

        _ref = ['thread', 'name', 'email', 'sub', 'com'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          QR.nodes[name].value = this[name] || null;
        }
        this.showFileData();
        return QR.characterCount();
      };

      _Class.prototype.save = function(input) {
        var value, _ref;

        if (input.type === 'checkbox') {
          this.spoiler = input.checked;
          return;
        }
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
        _ref = ['thread', 'name', 'email', 'sub', 'com', 'spoiler'];
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
          if (_this.file.type === 'image/gif') {
            s *= 3;
          }
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

      _Class.prototype.showFileData = function() {
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
        var MutationObserver, imgContainer, input, observer, setLifetime,
          _this = this;

        setLifetime = function(e) {
          return _this.lifetime = e.detail;
        };
        $.on(window, 'captcha:timeout', setLifetime);
        $.globalEval('window.dispatchEvent(new CustomEvent("captcha:timeout", {detail: RecaptchaState.timeout}))');
        $.off(window, 'captcha:timeout', setLifetime);
        imgContainer = $.el('div', {
          className: 'captcha-img',
          title: 'Reload',
          innerHTML: '<img>'
        });
        input = $.el('input', {
          className: 'captcha-input field',
          title: 'Verification',
          autocomplete: 'off',
          spellcheck: false,
          tabIndex: 55
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
        $.on(input, 'focus', function() {
          return $.addClass(QR.nodes.el, 'focus');
        });
        $.on(input, 'blur', function() {
          return $.rmClass(QR.nodes.el, 'focus');
        });
        $.get('captchas', [], function(item) {
          return _this.sync(item['captchas']);
        });
        $.sync('captchas', this.sync);
        this.reload();
        $.addClass(QR.nodes.el, 'has-captcha');
        return $.after(QR.nodes.dumpList.parentElement, [imgContainer, input]);
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
        this.timeout = Date.now() + this.lifetime * $.SECOND - $.MINUTE;
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
        $.globalEval('Recaptcha.reload("t")');
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
      var dialog, mimeTypes, name, nodes, thread, _i, _len, _ref;

      dialog = UI.dialog('qr', 'top:0;right:0;', "<div id=qrtab class=move>\n  <input type=checkbox id=autohide title=Auto-hide> Post Form\n  <a href=javascript:; class=close title=Close>×</a>\n</div>\n<form>\n  <div class=persona>\n    <input id=dump-button type=button title='Dump list' value=+ tabindex=0>\n    <input name=name  data-name=name  title=Name    placeholder=Name    class=field size=1 tabindex=10>\n    <input name=email data-name=email title=E-mail  placeholder=E-mail  class=field size=1 tabindex=20>\n    <input name=sub   data-name=sub   title=Subject placeholder=Subject class=field size=1 tabindex=30>\n  </div>\n  <div class=textarea>\n    <textarea data-name=com title=Comment placeholder=Comment class=field tabindex=40></textarea>\n    <span id=char-count></span>\n  </div>\n  <div id=dump-list-container>\n    <div id=dump-list></div>\n    <a id=add-post href=javascript:; title=\"Add a post\" tabindex=50>+</a>\n  </div>\n  <div id=file-n-submit>\n    <span id=qr-filename-container class=field tabindex=60>\n      <span id=qr-no-file>No selected file</span>\n      <span id=qr-filename></span>\n      <a id=qr-filerm href=javascript:; title='Remove file' tabindex=80>×</a>\n    </span>\n    <input type=submit tabindex=70>\n  </div>\n  <input type=file multiple>\n  <div id=qr-thread-select>\n    <select title='Create a new thread / Reply'>\n      <option value=new>New thread</option>\n    </select>\n  </div> \n  <label id=qr-spoiler-label>\n    <input type=checkbox id=qr-file-spoiler title='Spoiler image' tabindex=90>Spoiler?\n  </label>\n</form>".replace(/>\s+</g, '><'));
      QR.nodes = nodes = {
        el: dialog,
        move: $('.move', dialog),
        autohide: $('#autohide', dialog),
        thread: $('select', dialog),
        threadPar: $('#qr-thread-select', dialog),
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
      nodes.spoiler.parentElement.hidden = !QR.spoiler;
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
      $.on(nodes.filename.parentNode, 'click keyup', QR.openFileInput);
      $.on(QR.nodes.el, 'focusin', QR.focusin);
      $.on(QR.nodes.el, 'focusout', QR.focusout);
      $.on(nodes.autohide, 'change', QR.toggleHide);
      $.on(nodes.close, 'click', QR.close);
      $.on(nodes.dumpButton, 'click', function() {
        return nodes.el.classList.toggle('dump');
      });
      $.on(nodes.addPost, 'click', function() {
        return new QR.post(true);
      });
      $.on(nodes.form, 'submit', QR.submit);
      $.on(nodes.fileRM, 'click', function(e) {
        e.stopPropagation();
        return QR.selected.rmFile();
      });
      $.on(nodes.spoiler, 'change', function() {
        return QR.selected.nodes.spoiler.click();
      });
      $.on(nodes.fileInput, 'change', QR.fileInput);
      _ref = ['name', 'email', 'sub', 'com'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        $.on(nodes[name], 'input', function() {
          return QR.selected.save(this);
        });
      }
      $.on(nodes.thread, 'change', function() {
        return QR.selected.save(this);
      });
      new QR.post(true);
      QR.status();
      QR.cooldown.init();
      QR.captcha.init();
      Rice.nodes(dialog);
      $.add(d.body, dialog);
      if (Conf['Auto Hide QR']) {
        nodes.autohide.click();
      }
      return $.event('QRDialogCreation', null, dialog);
    },
    submit: function(e) {
      var callbacks, challenge, err, filetag, m, opts, post, postData, response, textOnly, thread, threadID, _ref;

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
      threadID = post.thread;
      thread = g.BOARD.threads[threadID];
      if (threadID === 'new') {
        threadID = null;
        if (['vg', 'q'].contains(g.BOARD.ID) && !post.sub) {
          err = 'New threads require a subject.';
        } else if (!(post.file || (textOnly = !!$('input[name=textonly]', $.id('postForm'))))) {
          err = 'No file selected.';
        }
      } else if (g.BOARD.threads[threadID].isClosed) {
        err = 'You can\'t reply to this thread anymore.';
      } else if (!(post.com || post.file)) {
        err = 'No file selected.';
      } else if (post.file && thread.fileLimit && !thread.isSticky) {
        err = 'Max limit of image replies has been reached.';
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
          return QR.error($.el('span', {
            innerHTML: 'Connection error. You may have been <a href=//www.4chan.org/banned target=_blank>banned</a>.'
          }));
        }
      };
      opts = {
        cred: true,
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
      var URL, ban, board, err, h1, isReply, m, post, postID, req, threadID, tmpDoc, _, _ref, _ref1;

      QR.req.upload.onload();
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
        } else if (err.textContent && (m = err.textContent.match(/wait\s(\d+)\ssecond/i))) {
          QR.cooldown.auto = QR.captcha.isEnabled ? !!QR.captcha.captchas.length : true;
          QR.cooldown.set({
            delay: m[1]
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
      $.get('QR.persona', {}, function(item) {
        var persona;

        persona = item['QR.persona'];
        persona = {
          name: post.name,
          email: /^sage$/.test(post.email) ? persona.email : post.email,
          sub: Conf['Remember Subject'] ? post.sub : null
        };
        return $.set('QR.persona', persona);
      });
      _ref1 = h1.nextSibling.textContent.match(/thread:(\d+),no:(\d+)/), _ = _ref1[0], threadID = _ref1[1], postID = _ref1[2];
      postID = +postID;
      threadID = +threadID || postID;
      isReply = threadID !== postID;
      QR.db.set({
        boardID: g.BOARD.ID,
        threadID: threadID,
        postID: postID,
        val: true
      });
      ThreadUpdater.postID = postID;
      $.event('QRPostSuccessful', {
        board: g.BOARD,
        threadID: threadID,
        postID: postID
      }, QR.nodes.el);
      QR.cooldown.auto = QR.posts.length > 1 && isReply;
      if (!(Conf['Persistent QR'] || QR.cooldown.auto)) {
        QR.close();
      } else {
        post.rm();
      }
      QR.cooldown.set({
        req: req,
        post: post,
        isReply: isReply
      });
      if (threadID === postID) {
        URL = "/" + g.BOARD + "/res/" + threadID;
      } else if (g.VIEW === 'index' && !QR.cooldown.auto && Conf['Open Post in New Tab']) {
        URL = "/" + g.BOARD + "/res/" + threadID + "#p" + postID;
      }
      if (URL) {
        if (Conf['Open Post in New Tab']) {
          $.open("/" + g.BOARD + "/res/" + threadID);
        } else {
          window.location = "/" + g.BOARD + "/res/" + threadID;
        }
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
          return $.globalEval('Recaptcha.reload("t")');
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

  DataBoards = ['hiddenThreads', 'hiddenPosts', 'lastReadPosts', 'yourPosts'];

  DataBoard = (function() {
    function DataBoard(key, sync) {
      var _this = this;

      this.key = key;
      this.data = Conf[key];
      $.sync(key, this.onSync.bind(this));
      this.clean();
      if (!sync) {
        return;
      }
      $.on(d, '4chanXInitFinished', function() {
        return _this.sync = sync;
      });
    }

    DataBoard.prototype["delete"] = function(_arg) {
      var boardID, postID, threadID;

      boardID = _arg.boardID, threadID = _arg.threadID, postID = _arg.postID;
      if (postID) {
        delete this.data.boards[boardID][threadID][postID];
        this.deleteIfEmpty({
          boardID: boardID,
          threadID: threadID
        });
      } else if (threadID) {
        delete this.data.boards[boardID][threadID];
        this.deleteIfEmpty({
          boardID: boardID
        });
      } else {
        delete this.data.boards[boardID];
      }
      return $.set(this.key, this.data);
    };

    DataBoard.prototype.deleteIfEmpty = function(_arg) {
      var boardID, threadID;

      boardID = _arg.boardID, threadID = _arg.threadID;
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

    DataBoard.prototype.set = function(_arg) {
      var boardID, postID, threadID, val, _base, _base1, _base2;

      boardID = _arg.boardID, threadID = _arg.threadID, postID = _arg.postID, val = _arg.val;
      if (postID) {
        ((_base = ((_base1 = this.data.boards)[boardID] || (_base1[boardID] = {})))[threadID] || (_base[threadID] = {}))[postID] = val;
      } else if (threadID) {
        ((_base2 = this.data.boards)[boardID] || (_base2[boardID] = {}))[threadID] = val;
      } else {
        this.data.boards[boardID] = val;
      }
      return $.set(this.key, this.data);
    };

    DataBoard.prototype.get = function(_arg) {
      var ID, board, boardID, defaultValue, postID, thread, threadID, val, _i, _len;

      boardID = _arg.boardID, threadID = _arg.threadID, postID = _arg.postID, defaultValue = _arg.defaultValue;
      if (board = this.data.boards[boardID]) {
        if (!threadID) {
          if (postID) {
            for (thread = _i = 0, _len = board.length; _i < _len; thread = ++_i) {
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
          val = postID ? thread[postID] : thread;
        }
      }
      return val || defaultValue;
    };

    DataBoard.prototype.clean = function() {
      var boardID, now;

      for (boardID in this.data.boards) {
        this.deleteIfEmpty({
          boardID: boardID
        });
      }
      now = Date.now();
      if ((this.data.lastChecked || 0) < now - 12 * $.HOUR) {
        this.data.lastChecked = now;
        for (boardID in this.data.boards) {
          this.ajaxClean(boardID);
        }
      }
      return $.set(this.key, this.data);
    };

    DataBoard.prototype.ajaxClean = function(boardID) {
      var _this = this;

      return $.cache("//api.4chan.org/" + boardID + "/threads.json", function(e) {
        var board, page, thread, threads, _i, _j, _len, _len1, _ref, _ref1;

        if (e.target.status === 404) {
          _this["delete"](boardID);
        } else if (e.target.status === 200) {
          board = _this.data.boards[boardID];
          threads = {};
          _ref = JSON.parse(e.target.response);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            page = _ref[_i];
            _ref1 = page.threads;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              thread = _ref1[_j];
              if (thread.no in board) {
                threads[thread.no] = board[thread.no];
              }
            }
          }
          _this.data.boards[boardID] = threads;
          _this.deleteIfEmpty({
            boardID: boardID
          });
        }
        return $.set(_this.key, _this.data);
      });
    };

    DataBoard.prototype.onSync = function(data) {
      this.data = data || {
        boards: {}
      };
      return typeof this.sync === "function" ? this.sync() : void 0;
    };

    return DataBoard;

  })();

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
      g.threads[this.fullID] = board.threads[this] = this;
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
      if (capcode = $('.capcode.hand', info)) {
        this.nodes.capcode = capcode;
        this.info.capcode = capcode.textContent.replace('## ', '');
      }
      if (flag = $('.countryFlag', info)) {
        this.nodes.flag = flag;
        this.info.flag = flag.title;
      }
      if (date = $('.dateTime', info)) {
        this.nodes.date = date;
        this.info.date = new Date(date.dataset.utc * 1000);
      }
      if (Conf['Quick Reply']) {
        this.info.yours = QR.db.get({
          boardID: this.board,
          threadID: this.thread,
          postID: this.ID
        });
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
      g.posts[this.fullID] = thread.posts[this] = board.posts[this] = this;
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
        if (this.file.isDead) {
          return;
        }
        this.file.isDead = true;
        this.file.timeOfDeath = now;
        $.addClass(this.nodes.root, 'deleted-file');
      } else {
        if (this.isDead) {
          return;
        }
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
    init: function(items) {
      var db, flatten, _i, _len;

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
      for (_i = 0, _len = DataBoards.length; _i < _len; _i++) {
        db = DataBoards[_i];
        Conf[db] = {
          boards: {}
        };
      }
      $.extend(Conf, {
        'userThemes': [],
        'userMascots': [],
        'Enabled Mascots': [],
        'Enabled Mascots sfw': [],
        'Enabled Mascots nsfw': [],
        'Deleted Mascots': [],
        'Hidden Categories': ["Questionable"]
      });
      return $.get(Conf, Main.initFeatures);
    },
    initFeatures: function(items) {
      var initFeatures, pathname;

      Conf = items;
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
        g.THREADID = +pathname[3];
      }
      if (['b', 'd', 'e', 'gif', 'h', 'hc', 'hm', 'hr', 'pol', 'r', 'r9k', 'rs', 's', 'soc', 't', 'u', 'y'].contains(g.BOARD)) {
        g.TYPE = 'nsfw';
      }
      $.extend(Themes, Conf["userThemes"]);
      $.extend(Mascots, Conf["userMascots"]);
      if (Conf["NSFW/SFW Mascots"]) {
        g.MASCOTSTRING = "Enabled Mascots " + g.TYPE;
      } else {
        g.MASCOTSTRING = "Enabled Mascots";
      }
      if (Conf["NSFW/SFW Themes"]) {
        Conf["theme"] = Conf["theme_" + g.TYPE];
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
      initFeatures = function(features) {
        var err, module, name;

        for (name in features) {
          module = features[name];
          try {
            module.init();
          } catch (_error) {
            err = _error;
            Main.handleErrors({
              message: "\"" + name + "\" initialization crashed.",
              error: err
            });
          }
        }
      };
      initFeatures({
        'Polyfill': Polyfill,
        'Emoji': Emoji,
        'Style': Style,
        'Rice': Rice,
        'Banner': Banner,
        'Announcements': GlobalMessage,
        'Header': Header,
        'Catalog Links': CatalogLinks,
        'Settings': Settings,
        'Fourchan thingies': Fourchan,
        'Custom CSS': CustomCSS,
        'Linkify': Linkify,
        'Resurrect Quotes': Quotify,
        'Filter': Filter,
        'Thread Hiding': ThreadHiding,
        'Reply Hiding': PostHiding,
        'Recursive': Recursive,
        'Strike-through Quotes': QuoteStrikeThrough,
        'Quick Reply': QR,
        'Menu': Menu,
        'Report Link': ReportLink,
        'Thread Hiding (Menu)': ThreadHiding.menu,
        'Reply Hiding (Menu)': PostHiding.menu,
        'Delete Link': DeleteLink,
        'Filter (Menu)': Filter.menu,
        'Download Link': DownloadLink,
        'Archive Link': ArchiveLink,
        'Quote Inlining': QuoteInline,
        'Quote Previewing': QuotePreview,
        'Quote Backlinks': QuoteBacklink,
        'Mark Quotes of You': QuoteYou,
        'Mark OP Quotes': QuoteOP,
        'Mark Cross-thread Quotes': QuoteCT,
        'Anonymize': Anonymize,
        'Time Formatting': Time,
        'Relative Post Dates': RelativeDates,
        'File Info Formatting': FileInfo,
        'Sauce': Sauce,
        'Image Expansion': ImageExpand,
        'Image Expansion (Menu)': ImageExpand.menu,
        'Reveal Spoilers': RevealSpoilers,
        'Image Replace': ImageReplace,
        'Image Hover': ImageHover,
        'Fappe Tyme': FappeTyme,
        'Comment Expansion': ExpandComment,
        'Thread Expansion': ExpandThread,
        'Thread Excerpt': ThreadExcerpt,
        'Favicon': Favicon,
        'Unread': Unread,
        'Thread Updater': ThreadUpdater,
        'Thread Stats': ThreadStats,
        'Thread Watcher': ThreadWatcher,
        'Index Navigation': Nav,
        'Keybinds': Keybinds
      });
      $.on(d, 'AddCallback', Main.addCallback);
      return $.ready(Main.initReady);
    },
    initReady: function() {
      var board, boardChild, err, errors, href, posts, thread, threadChild, threads, _i, _j, _len, _len1, _ref, _ref1;

      if (d.title === '4chan - 404 Not Found') {
        if (Conf['404 Redirect'] && g.VIEW === 'thread') {
          href = Redirect.to({
            boardID: g.BOARD.ID,
            threadID: g.THREADID,
            postID: +location.hash.match(/\d+/)
          });
          location.href = href || ("/" + g.BOARD + "/");
        }
        return;
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
            } catch (_error) {
              err = _error;
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
      $.event('4chanXInitFinished');
      return Main.checkUpdate();
    },
    callbackNodes: function(klass, nodes) {
      var callback, err, errors, i, len, node, _i, _j, _len, _ref;

      len = nodes.length;
      _ref = klass.prototype.callbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        for (i = _j = 0; 0 <= len ? _j < len : _j > len; i = 0 <= len ? ++_j : --_j) {
          node = nodes[i];
          try {
            callback.cb.call(node);
          } catch (_error) {
            err = _error;
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
      if (typeof obj.callback.name !== 'string') {
        throw new Error("Invalid callback name: " + obj.callback.name);
      }
      switch (obj.type) {
        case 'Post':
          Klass = Post;
          break;
        case 'Thread':
          Klass = Thread;
          break;
        default:
          return;
      }
      obj.callback.isAddon = true;
      return Klass.prototype.callbacks.push(obj.callback);
    },
    checkUpdate: function() {
      var freq, items, now;

      if (!(Conf['Check for Updates'] && Main.isThisPageLegit())) {
        return;
      }
      now = Date.now();
      freq = 6 * $.HOUR;
      items = {
        lastupdate: 0,
        lastchecked: 0
      };
      return $.get(items, function(items) {
        if (items.lastupdate > now - freq || items.lastchecked > now - $.DAY) {
          return;
        }
        return $.ajax('http://zixaphir.github.com/appchan-x/builds/version', {
          onload: function() {
            var el, version;

            if (this.status !== 200) {
              return;
            }
            version = this.response;
            if (!/^\d\.\d+\.\d+$/.test(version)) {
              return;
            }
            if (g.VERSION === version) {
              $.set('lastupdate', now);
              return;
            }
            $.set('lastchecked', now);
            el = $.el('span', {
              innerHTML: "Update: appchan x v" + version + " is out, get it <a href=http://zixaphir.github.com/appchan-x/ target=_blank>here</a>."
            });
            return new Notification('info', el, 120);
          }
        });
      });
    },
    handleErrors: function(errors) {
      var div, error, logs, _i, _len;

      if (!(errors instanceof Array)) {
        error = errors;
      } else if (errors.length === 1) {
        error = errors[0];
      }
      if (error) {
        new Notification('error', Main.parseError(error), 15);
        return;
      }
      div = $.el('div', {
        innerHTML: "" + errors.length + " errors occurred. [<a href=javascript:;>show</a>]"
      });
      $.on(div.lastElementChild, 'click', function() {
        var _ref;

        return _ref = this.textContent === 'show' ? ['hide', false] : ['show', true], this.textContent = _ref[0], logs.hidden = _ref[1], _ref;
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

      Main.logError(data);
      message = $.el('div', {
        textContent: data.message
      });
      error = $.el('div', {
        textContent: data.error
      });
      return [message, error];
    },
    errors: [],
    logError: function(data) {
      if (!Main.errors.length) {
        $.on(window, 'unload', Main.postErrors);
      }
      c.error(data.message, data.error.stack);
      return Main.errors.push(data);
    },
    postErrors: function() {
      var errors;

      errors = Main.errors.map(function(d) {
        return d.message + ' ' + d.error.stack;
      });
      return $.ajax('http://zixaphir.github.com/appchan-x/errors', {}, {
        sync: true,
        form: $.formData({
          n: "appchan x v" + g.VERSION,
          t: 'userjs',
          ua: window.navigator.userAgent,
          url: window.location.href,
          e: errors.join('\n')
        })
      });
    },
    isThisPageLegit: function() {
      var _ref;

      if (!('thisPageIsLegit' in Main)) {
        Main.thisPageIsLegit = location.hostname === 'boards.4chan.org' && !$('link[href*="favicon-status.ico"]', d.head) && ((_ref = d.title) !== '4chan - Temporarily Offline' && _ref !== '4chan - Error');
      }
      return Main.thisPageIsLegit;
    }
  };

  Main.init();

}).call(this);
