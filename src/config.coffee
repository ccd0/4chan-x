# JavaScript "Globals"
Config =
# Depending on the category, the following objects are used to store default settings, generate layouts, and hold the various settings available for appchan x.
  main:

    Enhancing:
      'Catalog Links': [
        true
        'Turn Navigation links into links to each board\'s catalog.'
      ]
      'External Catalog': [
        false
        'Link to external catalog instead of the internal one.'
      ]
      '404 Redirect': [
        true
        'Redirect dead threads and images'
      ]
      'Keybinds': [
        true
        'Binds actions to keys'
      ]
      'Time Formatting': [
        true
        'Arbitrarily formatted timestamps, using your local time'
      ]
      'File Info Formatting': [
        true
        'Reformats the file information'
      ]
      'Comment Expansion': [
        true
        'Expand too long comments'
      ]
      'Thread Expansion': [
        true
        'View all replies'
      ]
      'Index Navigation': [
        true
        'Navigate to previous / next thread'
      ]
      'Reply Navigation': [
        false
        'Navigate to top / bottom of thread'
      ]
      'Custom Navigation': [
        false
        'Customize your Navigation bar.'
      ]
      'Check for Updates': [
        true
        'Check for updated versions of Appchan X'
      ]
      'Check for Bans': [
        false
        'Check ban status and prepend it to the top of the page.'
      ]
      'Check for Bans constantly': [
        false
        'Optain ban status on every refresh. Note that this will cause delay on getting the result.'
      ]

    Linkification:
      'Linkify': [
        true
        'Convert text into links where applicable. If a link is too long and only partially linkified, shift+ctrl+click it to merge the next line.'
      ]
      'Embedding': [
        true
        'Add a link to linkified audio and video links. Supported sites: YouTube, Vimeo, SoundCloud, Vocaroo, and some audio links, depending on your browser.'
      ]
      'Link Title': [
        true
        'Replace the link of a supported site with its actual title. Currently Supported: YouTube, Vimeo, SoundCloud'
      ]

    Filtering:
      'Anonymize': [
        false
        'Make everybody anonymous'
      ]
      'Filter': [
        true
        'Self-moderation placebo'
      ]
      'Recursive Filtering': [
        true
        'Filter replies of filtered posts, recursively'
      ]
      'Reply Hiding': [
        false
        'Hide single replies'
      ]
      'Thread Hiding': [
        false
        'Hide entire threads'
      ]
      'Show Stubs': [
        true
        'Of hidden threads / replies'
      ]

    Imaging:
      'Image Expansion': [
        true
        'Expand images'
      ]
      'Image Hover': [
        false
        'Show full image on mouseover'
      ]
      'Sauce': [
        true
        'Add sauce to images'
      ]
      'Reveal Spoilers': [
        false
        'Replace spoiler thumbnails by the original thumbnail'
      ]
      'Don\'t Expand Spoilers': [
        true
        'Don\'t expand spoilers when using ImageExpand.'
      ]
      'Expand From Current': [
        false
        'Expand images from current position to thread end.'
      ]
      'Prefetch': [
        false
        'Prefetch images.'
      ]
      'Replace GIF': [
        false
        'Replace thumbnail of gifs with its actual image.'
      ]
      'Replace PNG': [
        false
        'Replace pngs.'
      ]
      'Replace JPG': [
        false
        'Replace jpgs.'
      ]

    Menu:
      'Menu': [
        true
        'Add a drop-down menu in posts.'
      ]
      'Report Link': [
        true
        'Add a report link to the menu.'
      ]
      'Delete Link': [
        true
        'Add post and image deletion links to the menu.'
      ]
      'Download Link': [
        true
        'Add a download with original filename link to the menu. Chrome-only currently.'
      ]
      'Archive Link': [
        true
        'Add an archive link to the menu.'
      ]
      'Embed Link': [
        true
        'Add an embed link to the menu to embed all supported formats in a post.'
      ]
      'Thread Hiding Link': [
        true
        'Add a link to hide entire threads.'
      ]
      'Reply Hiding Link': [
        true
        'Add a link to hide single replies.'
      ]

    Monitoring:
      'Thread Updater': [
        true
        'Update threads. Has more options in its own dialog.'
      ]
      'Optional Increase': [
        false
        'Increase value of Updater over time.'
      ]
      'Interval per board': [
        false
        'Change the intervals of updates on a board-by-board basis.'
      ]
      'Unread Count': [
        true
        'Show unread post count in tab title'
      ]
      'Unread Favicon': [
        true
        'Show a different favicon when there are unread posts'
      ]
      'Post in Title': [
        true
        'Show the op\'s post in the tab title'
      ]
      'Thread Stats': [
        true
        'Display reply and image count'
      ]
      'Thread Watcher': [
        true
        'Bookmark threads'
      ]
      'Auto Watch': [
        true
        'Automatically watch threads that you start'
      ]
      'Auto Watch Reply': [
        false
        'Automatically watch threads that you reply to'
      ]
      'Color user IDs': [
        false
        'Assign unique colors to user IDs on boards that use them'
      ]

    Posting:
      'Cooldown': [
        true
        'Prevent "flood detected" errors.'
      ]
      'Persistent QR': [
        true
        'The Quick reply won\'t disappear after posting.'
      ]
      'Auto Hide QR': [
        false
        'Automatically hide the quick reply when posting.'
      ]
      'Open Reply in New Tab': [
        false
        'Open replies in a new tab that are made from the main board.'
      ]
      'Remember QR size': [
        false
        'Remember the size of the Quick reply (Firefox only).'
      ]
      'Remember Subject': [
        false
        'Remember the subject field, instead of resetting after posting.'
      ]
      'Remember Spoiler': [
        false
        'Remember the spoiler state, instead of resetting after posting.'
      ]
      'Remember Sage': [
        false
        'Remember email even if it contains sage.'
      ]
      'Markdown': [
        false
        'Code, italic, bold, italic bold, double struck - `, *, **, ***, ||, respectively. _ can be used instead of *.'
      ]

    Quoting:
      'Quote Backlinks': [
        true
        'Add quote backlinks'
      ]
      'OP Backlinks': [
        false
        'Add backlinks to the OP'
      ]
      'Quote Highlighting': [
        true
        'Highlight the previewed post'
      ]
      'Quote Inline': [
        true
        'Show quoted post inline on quote click'
      ]
      'Quote Preview': [
        true
        'Show quote content on hover'
      ]
      'Resurrect Quotes': [
        true
        'Linkify dead quotes to archives'
      ]
      'Indicate OP quote': [
        true
        'Add \'(OP)\' to OP quotes'
      ]
      'Indicate Cross-thread Quotes': [
        true
        'Add \'(Cross-thread)\' to cross-threads quotes'
      ]
      'Forward Hiding': [
        true
        'Hide original posts of inlined backlinks'
      ]

  filter:
    name: """
# Filter any namefags:
#/^(?!Anonymous$)/
"""

    uniqueid: """
# Filter a specific ID:
#/Txhvk1Tl/
"""

    tripcode: """
# Filter any tripfags
#/^!/
"""

    mod: """
# Set a custom class for mods:
#/Mod$/;highlight:mod;op:yes
# Set a custom class for moot:
#/Admin$/;highlight:moot;op:yes
"""

    email: """
# Filter any e-mails that are not `sage` on /a/ and /jp/:
#/^(?!sage$)/;boards:a,jp
"""

    subject: """
# Filter Generals on /v/:
#/general/i;boards:v;op:only'
"""

    comment: """
# Filter Stallman copypasta on /g/:
#/what you\'re refer+ing to as linux/i;boards:g
"""

    country: ''

    filename: ''

    dimensions: """
# Highlight potential wallpapers:
#/1920x1080/;op:yes;highlight;top:no;boards:w,wg
"""

    filesize: ''

    md5: ''

  sauces: """
http://iqdb.org/?url=$1
http://www.google.com/searchbyimage?image_url=$1
#http://tineye.com/search?url=$1
#http://saucenao.com/search.php?db=999&url=$1
#http://3d.iqdb.org/?url=$1
#http://regex.info/exif.cgi?imgurl=$2
# uploaders:
#http://imgur.com/upload?url=$2;text:Upload to imgur
#http://omploader.org/upload?url1=$2;text:Upload to omploader
# "View Same" in archives:
#http://archive.foolz.us/_/search/image/$3/;text:View same on foolz
#http://archive.foolz.us/$4/search/image/$3/;text:View same on foolz /$4/
#https://archive.installgentoo.net/$4/image/$3;text:View same on installgentoo /$4/
"""

  time:             '%m/%d/%y(%a)%H:%M'
  backlink:         '>>%id'
  fileInfo:         '%l (%p%s, %r)'
  favicon:          'ferongr'
  updateIncrease:   '5,10,15,20,30,60,90,120,240,300'
  updateIncreaseB:  '5,10,15,20,30,60,90,120,240,300'

  customCSS: """
/* Tripcode Italics: */
/*
span.postertrip {
  font-style: italic;
}
*/

/* Add a rounded border to thumbnails (but not expanded images): */
/*
.fileThumb > img:first-child {
  border: solid 2px rgba(0,0,100,0.5);
  border-radius: 10px;
}
*/

/* Make highlighted posts look inset on the page: */
/*
div.post:target,
div.post.highlight {
  box-shadow: inset 2px 2px 2px rgba(0,0,0,0.2);
}
*/
"""

  hotkeys:
    # QR & Options
    openQR: [
      'I'
      'Open QR with post number inserted'
    ]
    openEmptyQR: [
      'i'
      'Open QR without post number inserted'
    ]
    openOptions: [
      'ctrl+o'
      'Open Options'
    ]
    close: [
      'Esc'
      'Close Options or QR'
    ]
    spoiler: [
      'ctrl+s'
      'Quick spoiler tags'
    ]
    math: [
      'ctrl+m'
      'Quick math tags'
    ]
    eqn: [
      'ctrl+e'
      'Quick eqn tags'
    ]
    code: [
      'alt+c'
      'Quick code tags'
    ]
    sageru: [
      'alt+n'
      'Sage keybind'
    ]
    submit: [
      'alt+s'
      'Submit post'
    ]
    hideQR: [
      'h'
      'Toggle hide status of QR'
    ]
    toggleCatalog: [
      'alt+t'
      'Toggle links in nav bar'
    ]
    # Thread related
    watch: [
      'w'
      'Watch thread'
    ]
    update: [
      'u'
      'Update now'
    ]
    unreadCountTo0: [
      'z'
      'Mark thread as read'
    ]
    # Images
    expandImage: [
      'm'
      'Expand selected image'
    ]
    expandAllImages: [
      'M'
      'Expand all images'
    ]
    # Board Navigation
    zero: [
      '0'
      'Jump to page 0'
    ]
    nextPage: [
      'L'
      'Jump to the next page'
    ]
    previousPage: [
      'H'
      'Jump to the previous page'
    ]
    # Thread Navigation
    nextThread: [
      'n'
      'See next thread'
    ]
    previousThread: [
      'p'
      'See previous thread'
    ]
    expandThread: [
      'e'
      'Expand thread'
    ]
    openThreadTab: [
      'o'
      'Open thread in new tab'
    ]
    openThread: [
      'O'
      'Open thread in current tab'
    ]
    # Reply Navigation
    nextReply: [
      'J'
      'Select next reply'
    ]
    previousReply: [
      'K'
      'Select previous reply'
    ]
    hide:            [
      'x'
      'Hide thread'
    ]

  updater:
    checkbox:
      'Scrolling': [
        false
        'Scroll updated posts into view. Only enabled at bottom of page.'
      ]
      'Scroll BG': [
        false
        'Scroll background tabs'
      ]
      'Verbose': [
        true
        'Show countdown timer, new post count'
      ]
      'Auto Update': [
        true
        'Automatically fetch new posts'
      ]
    'Interval':       30
    'BGInterval':     60

  style:

    # Style Options are either booleans, select options, or text, depending on the value of optionName[2].
    # If it doesn't exist, it is a boolean, if it does, it's either an array of the select options or "text".

    Interface:
      'Single Column Mode': [
        true
        'Presents options in a single column, rather than in blocks.'
      ]
      'Sidebar': [
        'normal'
        'Alter the sidebar size. Completely hiding it can cause content to overlap, but with the correct option combinations can create a minimal 4chan layout that has more efficient screen real-estate than vanilla 4chan.'
        ['large', 'normal', 'minimal', 'hide']
      ]
      'Sidebar Location': [
        'right'
        'The side of the page the sidebar content is on. It is highly recommended that you do not hide the sidebar if you change this option.'
        ['left', 'right']
      ]
      'Left Thread Padding': [
        '0'
        'Add some spacing between the left edge of document and the threads.'
        'text'
      ]
      'Right Thread Padding': [
        '0'
        'Add some spacing between the right edge of document and the threads.'
        'text'
      ]
      'Announcements': [
        'slideout'
        'The style of announcements and the ability to hide them.'
        ['4chan default', 'slideout', 'hide']
      ]
      'Board Title': [
        'at sidebar top'
        'The positioning of the board\'s logo and subtitle.'
        ['at sidebar top', 'at sidebar bottom', 'at top', 'under post form', 'hide']
      ]
      'Custom Board Titles': [
        false
        'Customize Board Titles by shift-clicking the board title or subtitle.'
      ]
      'Board Subtitle': [
        true
        'Show the board subtitle.'
      ]
      '4chan Banner': [
        'at sidebar top'
        'The positioning of 4chan\'s image banner.'
        ['at sidebar top', 'at sidebar bottom', 'under post form', 'at top', 'hide']
      ]
      '4chan Banner Reflection': [
        true
        'Adds reflection effects to 4chan\'s image banner.'
      ]
      'Faded 4chan Banner': [
        true
        'Make 4chan\'s image banner translucent.'
      ]
      'Icon Orientation': [
        'horizontal'
        'Change the orientation of the appchan x icons.'
        ['horizontal', 'vertical']
      ]
      'Slideout Watcher': [
        true
        'Adds an icon you can hover over to show the watcher, as opposed to having the watcher always visible.'
      ]
      'Updater Position': [
        'top'
        'The position of 4chan thread updater and stats'
        ['top', 'bottom']
      ]

    Posts:
      'Alternate Post Colors': [
        false
        'Make post background colors alternate every other post.'
      ]
      'Color Reply Headings': [
        false
        'Give the post info a background.'
      ]
      'Color File Info': [
        false
        'Give the file info a background.'
      ]
      'OP Background': [
        false
        'Adds a border and background color to the OP Post, as if it were a reply.'
      ]
      'Backlinks Position': [
        'default'
        'The position of backlinks in relation to the post.'
        ['default', 'lower left', 'lower right']
      ]
      'Sage Highlighting': [
        'image'
        'Icons or text to highlight saged posts.'
        ['text', 'image', 'none']
      ]
      'Sage Highlight Position': [
        'after'
        'Position of Sage Highlighting'
        ['before', 'after']
      ]
      'Filtered Backlinks': [
        true
        'Mark backlinks to filtered posts.'
      ]
      'Force Reply Break': [
        false
        'Force replies to occupy their own line and not be adjacent to the OP image.'
      ]
      'Fit Width Replies': [
        true
        'Replies fit the entire width of the page.'
      ]
      'Reply Spacing': [
        'small'
        'The amount of space between replies.'
        ['none', 'minimal', 'small', 'medium', 'large']
      ]
      'Reply Padding': [
        'normal'
        'The padding around post content of replies.'
        ['phat', 'normal', 'slim', 'super slim', 'anorexia']
      ]
      'Hide Horizontal Rules': [
        false
        'Hides lines between threads.'
      ]
      'Images Overlap Post Form': [
        true
        'Images expand over the post form and sidebar content, usually used with "Expand images" set to "full".'
      ]

    Aesthetics:
      '4chan SS Navigation': [
        false
        'Try to emulate the appearance of 4chan SS\'s Navigation.'
      ]
      '4chan SS Sidebar': [
        false
        'Try to emulate the appearance of 4chan SS\'s Sidebar.'
      ]
      'Block Ads': [
        false
        'Block advertisements. It\'s probably better to use AdBlock for this.'
      ]
      'Sidebar Glow': [
        false
        'Adds a glow to the sidebar\'s text.'
      ]
      'Checkboxes': [
        'show'
        'Alter checkboxes.'
        ['show', 'make checkboxes circular', 'hide', 'do not style checkboxes']
      ]
      'Custom CSS': [
        false
        'Add (more) custom CSS to Appchan X'
      ]
      'Emoji': [
        'enabled'
        'Enable emoji'
        ['enabled', 'disable ponies', 'only ponies', 'disable']
      ]
      'Emoji Position': [
        'before'
        'Position of emoji icons, like sega and neko.'
        ['before', 'after']
      ]
      'Emoji Spacing': [
        '5'
        'Add some spacing between emoji and text.'
        'text'
      ]
      'Font': [
        'sans-serif'
        'The font used by all elements of 4chan.'
        'text'
      ]
      'Font Size': [
        '12'
        'The font size of posts and various UI. This changes most, but not all, font sizes.'
        'text'
      ]
      'Icons': [
        'oneechan'
        'Icon theme which Appchan will use.'
        ['oneechan', '4chan SS']
      ]
      'Quote Shadows': [
        true
        'Add shadows to the quote previews and inline quotes.'
      ]
      'Rounded Edges': [
        false
        'Round the edges of various 4chan elements.'
      ]
      'Slideout Transitions' : [
        true
        'Animate slideouts.'
      ]
      'Underline Links': [
        false
        'Put lines under hyperlinks.'
      ]
      'NSFW/SFW Themes': [
        false
        'Choose your theme based on the SFW status of the board you are viewing.'
      ]

    Mascots:
      'Mascots': [
        true
        'Add a pretty picture of your waifu to Appchan.'
      ]
      'Mascot Location': [
        'sidebar'
        'Change where your mascot is located.'
        ['sidebar', 'opposite']
      ]
      'Mascot Position': [
        'default'
        'Change where your mascot is placed in relation to the post form.'
        ['above post form', 'default', 'bottom']
      ]
      'Mascots Overlap Posts': [
        true
        'Mascots overlap threads and posts.'
      ]
      'NSFW/SFW Mascots': [
        false
        'Enable or disable mascots based on the SFW status of the board you are viewing.'
      ]
      'Grayscale Mascots': [
        false
        'Force mascots to be monochrome.'
      ]
      'Mascot Opacity': [
        '1.00'
        'Make Mascots transparent.'
        'text'
      ]
      'Hide Mascots on Catalog': [
        false
        'Do not show mascots on the official catalog pages.'
      ]

    Navigation:
      'Boards Navigation': [
        'sticky top'
        'The position of 4chan board navigation'
        ['sticky top', 'sticky bottom', 'top', 'hide']
      ]
      'Navigation Alignment': [
        'center'
        'Change the text alignment of the navigation.'
        ['left', 'center', 'right']
      ]
      'Slideout Navigation': [
        'compact'
        'How the slideout navigation will be displayed.'
        ['compact', 'list', 'hide']
      ]
      'Pagination': [
        'sticky bottom'
        'The position of 4chan page navigation'
        ['sticky top', 'sticky bottom', 'top', 'bottom', 'on side', 'hide']
      ]
      'Pagination Alignment': [
        'center'
        'Change the text alignment of the pagination.'
        ['left', 'center', 'right']
      ]
      'Hide Navigation Decorations': [
        false
        'Hide non-link text in the board navigation and pagination. This also disables the delimiter in <code>Custom Navigation</code>'
      ]

    'Post Form':
      'Captcha Opacity': [
        '1.00'
        'Transparency of the 4chan Captcha'
        ['1.00', '.75', '.50', '.25']
      ]
      'Compact Post Form Inputs':[
        true
        'Use compact inputs on the post form.'
      ]
      'Hide Show Post Form': [
        false
        'Hides the "Show Post Form" button when Persistent QR is disabled.'
      ]
      'Post Form Style': [
        'tabbed slideout'
        'How the post form will sit on the page.'
        ['fixed', 'slideout', 'tabbed slideout', 'transparent fade', 'float']
      ]
      'Post Form Decorations': [
        false
        'Add a border and background to the post form (does not apply to the "float" post form style.'
      ]
      'Textarea Resize': [
        'vertical'
        'Options to resize the post form\'s comment box.'
        ['both', 'horizontal', 'vertical', 'none', 'auto-expand']
      ]
      'Tripcode Hider': [
        true
        'Intelligent name field hiding.'
      ]

  theme        : 'Yotsuba B'
  mascot       : ''

# Opera doesn't support the @match metadata key,
# return 4chan X here if we're not on 4chan.
return unless /^[a-z]+\.4chan\.org$/.test(location.hostname)
  
Conf             = {}       # User configuration.
editTheme        = {}       # Currently editted theme.
editMascot       = {}       # Which mascot we're editting.
userNavigation   = {}       # ...
d                = document # Shortcut
g                = {}       # "Globals"
g.TYPE         = 'sfw'		# 4chan Board Type.