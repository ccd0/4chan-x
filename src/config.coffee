# JavaScript "Globals"
Config =
# Depending on the category, the following objects are used to store default settings, generate layouts, and hold the various settings available for 4chan x.
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
      'Append Delimiters': [
        false
        'Adds delimiters before and after custom navigation.'
      ]
      'Check for Updates': [
        true
        'Check for updated versions of 4chan X'
      ]
      'Check for Bans': [
        false
        'Check ban status and prepend it to the top of the page.'
      ]
      'Check for Bans constantly': [
        false
        'Optain ban status on every refresh. Note that this will cause delay on getting the result.'
      ]
      'Custom CSS': [
        false
        'Add your own CSS to 4chan.'
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
      'Fappe Tyme': [
        false
        'Toggle display of posts without images.'
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
      'Mark Owned Posts': [
        true
        'Mark quotes to posts you\'ve authored.'
      ]
      'Remove Spoilers': [
        false
        'Remove all spoilers in text.'
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
      'Per Board Persona': [
        false
        'Remember Name, Email, Subject, etc per board instead of globally.'
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
      'Quote Hash Navigation': [
         true
         'Show a "#" to jump around the thread as if Quote Inline were disabled.'
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
      'Beep': [
        false
        'Beep on new post to completely read thread'
      ]
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
    Interval:       30
    BGInterval:     60
  embedWidth:  640
  embedHeight: 390

# Opera doesn't support the @match metadata key,
# return 4chan X here if we're not on 4chan.
return unless /^[a-z]+\.4chan\.org$/.test(location.hostname)

Conf   = {}       # User configuration.
g      = {}       # "Globals"
d      = document # Shortcut
g.TYPE = 'sfw'		# 4chan Board Type.

userNavigation   = {}

# MutationObserver
MutationObserver = window.MutationObserver or window.WebKitMutationObserver or window.OMutationObserver