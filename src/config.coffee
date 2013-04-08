Config =
  main:
    'Miscellaneous':
      'Catalog Links': [
        true
        'Turn Navigation links into links to each board\'s catalog.'
      ]
      'External Catalog': [
        false
        'Link to external catalog instead of the internal one.'
      ]
      'Enable 4chan\'s Extension': [
        false
        'Compatibility between <%= meta.name %> and 4chan\'s inline extension is NOT guaranteed.'
      ]
      'Custom Board Navigation': [
        true
        'Show custom links instead of the full board list.'
      ]
      '404 Redirect': [
        true
        'Redirect dead threads and images.'
      ]
      'Keybinds': [
        true
        'Bind actions to keyboard shortcuts.'
      ]
      'Time Formatting': [
        true
        'Localize and format timestamps.'
      ]
      'Relative Post Dates': [
        false
        'Display dates like "3 minutes ago". Tooltip shows the timestamp.'
      ]
      'File Info Formatting': [
        true
        'Reformat the file information.'
      ]
      'Comment Expansion': [
        true
        'Add buttons to expand long comments.'
      ]
      'Thread Expansion': [
        true
        'Add buttons to expand threads.'
      ]
      'Index Navigation': [
        false
        'Add buttons to navigate between threads.'
      ]
      'Reply Navigation': [
        false
        'Add buttons to navigate to top / bottom of thread.'
      ]
      'Check for Updates': [
        true
        'Check for updated versions of <%= meta.name %>.'
      ]

    'Linkification':
      'Linkify': [
        true
        'Convert text into links where applicable.'
      ]
      'Embedding': [
        true
        'Embed supported services.'
      ]
      'Link Title': [
        true
        'Replace the link of a supported site with its actual title. Currently Supported: YouTube, Vimeo, SoundCloud'
      ]

    'Filtering':
      'Anonymize': [
        false
        'Make everyone Anonymous.'
      ]
      'Filter': [
        true
        'Self-moderation placebo.'
      ]
      'Recursive Hiding': [
        true
        'Hide replies of hidden posts, recursively.'
      ]
      'Thread Hiding': [
        true
        'Add buttons to hide entire threads.'
      ]
      'Reply Hiding': [
        true
        'Add buttons to hide single replies.'
      ]
      'Hiding Buttons': [
        true
        'Add buttons to hide threads / replies, in addition to menu links.'
      ]
      'Stubs': [
        true
        'Show stubs of hidden threads / replies.'
      ]

    'Images':
      'Image Expansion': [
        true
        'Expand images.'
      ]
      'Image Hover': [
        false
        'Show full image on mouseover.'
      ]
      'Sauce': [
        true
        'Add sauce links to images.'
      ]
      'Reveal Spoilers': [
        false
        'Reveal spoiler thumbnails.'
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

    'Menu':
      'Menu': [
        true
        'Add a drop-down menu to posts.'
      ]
      'Thread Hiding Link': [
        true
        'Add a link to hide entire threads.'
      ]
      'Reply Hiding Link': [
        true
        'Add a link to hide single replies.'
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

    'Monitoring':
      'Thread Updater': [
        true
        'Fetch and insert new replies. Has more options in its own dialog.'
      ]
      'Unread Count': [
        true
        'Show the unread posts count in the tab title.'
      ]
      'Unread Tab Icon': [
        true
        'Show a different favicon when there are unread posts.'
      ]
      'Unread Line': [
        true
        'Show a line to distinguish read posts from unread ones.'
      ]
      'Thread Excerpt': [
        true
        'Show an excerpt of the thread in the tab title.'
      ]
      'Thread Stats': [
        true
        'Display reply and image count.'
      ]
      'Thread Watcher': [
        true
        'Bookmark threads.'
      ]
      'Auto Watch': [
        true
        'Automatically watch threads you start.'
      ]
      'Auto Watch Reply': [
        false
        'Automatically watch threads you reply to.'
      ]

    'Posting':
      'Quick Reply': [
        true
        'All-in-one form to reply, create threads, automate dumping and more.'
      ]
      'Persistent QR': [
        false
        'The Quick reply won\'t disappear after posting.'
      ]
      'Auto Hide QR': [
        false
        'Automatically hide the quick reply when posting.'
      ]
      'Open Post in New Tab': [
        true
        'Open new threads or replies to a thread from the index in a new tab.'
      ]
      'Remember Subject': [
        false
        'Remember the subject field, instead of resetting after posting.'
      ]
      'Remember Spoiler': [
        false
        'Remember the spoiler state, instead of resetting after posting.'
      ]
      'Hide Original Post Form': [
        true
        'Hide the normal post form.'
      ]

    'Quote Links':
      'Quote Backlinks': [
        true
        'Add quote backlinks.'
      ]
      'OP Backlinks': [
        true
        'Add backlinks to the OP.'
      ]
      'Quote Inlining': [
        true
        'Inline quoted post on click.'
      ]
      'Forward Hiding': [
        true
        'Hide original posts of inlined backlinks.'
      ]
      'Quote Previewing': [
        true
        'Show quoted post on hover.'
      ]
      'Quote Highlighting': [
        true
        'Highlight the previewed post.'
      ]
      'Resurrect Quotes': [
        true
        'Link dead quotes to the archives.'
      ]
      'Mark Quotes of You': [
        true
        'Add \'(You)\' to quotes linking to your posts.'
      ]
      'Mark OP Quotes': [
        true
        'Add \'(OP)\' to OP quotes.'
      ]
      'Mark Cross-thread Quotes': [
        true
        'Add \'(Cross-thread)\' to cross-threads quotes.'
      ]

  imageExpansion:
    'Fit width': [
      true
      ''
    ]
    'Fit height': [
      false
      ''
    ]
    'Expand spoilers': [
      true
      'Expand all images along with spoilers.'
    ]
    'Expand from here': [
      true
      'Expand all images only from current position to thread end.'
    ]

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
      'Top Thread Padding': [
        '0'
        'Add some spacing between the top edge of document and the threads.'
        'text'
      ]
      'Bottom Thread Padding': [
        '0'
        'Add some spacing between the bottom edge of document and the threads.'
        'text'
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
        false
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
        ['top', 'bottom', 'moveable']
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
      'Hide Delete UI': [
        false
        'Hides vanilla report and delete functionality and UI. This does not affect Appchan\'s Menu functionality.'
      ]
      'Post Spacing': [
        '2'
        'The amount of space between replies.'
        'text'
      ]
      'Vertical Post Padding': [
        '5'
        'The vertical padding around post content of replies.'
        'text'
      ]
      'Horizontal Post Padding': [
        '20'
        'The horizontal padding around post content of replies.'
        'text'
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
      'Shrink Ads': [
        false
        'Make 4chan advertisements smaller.'
      ]
      'Bolds': [
        true
        'Bold text for names and such.'
      ]
      'Italics': [
        false
        'Give tripcodes italics.'
      ]
      'Sidebar Glow': [
        false
        'Adds a glow to the sidebar\'s text.'
      ]
      'Circle Checkboxes': [
        false
        'Make checkboxes circular.'
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
      'Invisible Icons': [
        false
        'Makes icons invisible unless hovered. Invisible really is "invisible", so don\'t use it if you don\'t have your icons memorized or don\'t use keybinds.'
      ]
      'Quote Shadows': [
        true
        'Add shadows to the quote previews and inline quotes.'
      ]
      'Rounded Edges': [
        false
        'Round the edges of various 4chan elements.'
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
      'Compact Post Form Inputs': [
        true
        'Use compact inputs on the post form.'
      ]
      'Hide Show Post Form': [
        false
        'Hides the "Show Post Form" button when Persistent QR is disabled.'
      ]
      'Show Post Form Header': [
        false
        'Force the Post Form to have a header.'
      ]
      'Post Form Style': [
        'tabbed slideout'
        'How the post form will sit on the page.'
        ['fixed', 'slideout', 'tabbed slideout', 'transparent fade', 'float']
      ]
      'Post Form Slideout Transitions' : [
        true
        'Animate slideouts for the post form.'
      ]
      'Post Form Decorations': [
        false
        'Add a border and background to the post form (does not apply to the "float" post form style.'
      ]
      'Textarea Resize': [
        'vertical'
        'Options to resize the post form\'s comment box.'
        ['both', 'horizontal', 'vertical', 'none']
      ]
      'Tripcode Hider': [
        true
        'Intelligent name field hiding.'
      ]

  filter:
    name: """
# Filter any namefags:
#/^(?!Anonymous$)/
"""

    uniqueID: """
# Filter a specific ID:
#/Txhvk1Tl/
"""

    tripcode: """
# Filter any tripfag
#/^!/
"""

    capcode: """
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
#/general/i;boards:v;op:only
"""

    comment: """
# Filter Stallman copypasta on /g/:
#/what you\'re refer+ing to as linux/i;boards:g
"""

    flag: ''
    filename: ''
    dimensions: """
# Highlight potential wallpapers:
#/1920x1080/;op:yes;highlight;top:no;boards:w,wg
"""

    filesize: ''

    MD5: ''

  sauces: """
https://www.google.com/searchbyimage?image_url=%TURL
http://iqdb.org/?url=%TURL
#//tineye.com/search?url=%TURL
#http://saucenao.com/search.php?url=%TURL
#http://3d.iqdb.org/?url=%TURL
#http://regex.info/exif.cgi?imgurl=%URL
# uploaders:
#http://imgur.com/upload?url=%URL;text:Upload to imgur
#http://ompldr.org/upload?url1=%URL;text:Upload to ompldr
# "View Same" in archives:
#//archive.foolz.us/_/search/image/%MD5/;text:View same on foolz
#//archive.foolz.us/%board/search/image/%MD5/;text:View same on foolz /%board/
#//archive.installgentoo.net/%board/image/%MD5;text:View same on installgentoo /%board/
"""

  'Custom CSS': false 

  'Header auto-hide': false

  'Header catalog links': false

  boardnav: '[ toggle-all ] [current-title]'

  time: '%m/%d/%y(%a)%H:%M:%S'

  backlink: '>>%id'

  fileInfo: '%l (%p%s, %r)'

  favicon: 'ferongr'

  usercss: ''

  hotkeys:
    # QR & Options
    'Toggle board list': [
      'Ctrl+b'
      'Toggle the full board list.'
    ]
    'Open empty QR': [
      'q'
      'Open QR without post number inserted.'
    ]
    'Open QR': [
      'Shift+q'
      'Open QR with post number inserted.'
    ]
    'Open settings': [
      'Alt+o'
      'Open Settings.'
    ]
    'Close': [
      'Esc'
      'Close Settings, Notifications or QR.'
    ]
    'Spoiler tags': [
      'Ctrl+s'
      'Insert spoiler tags.'
    ]
    'Code tags': [
      'Alt+c'
      'Insert code tags.'
    ]
    'Eqn tags':  [
      'Alt+e'
      'Insert eqn tags.'
    ]
    'Math tags': [
      'Alt+m'
      'Insert math tags.'
    ]
    'Submit QR': [
      'Alt+s'
      'Submit post.'
    ]
    # Thread related
    'Watch': [
      'w'
      'Watch thread.'
    ]
    'Update': [
      'r'
      'Update the thread now.'
    ]
    # Images
    'Expand image': [
      'Shift+e'
      'Expand selected image.'
    ]
    'Expand images': [
      'e'
      'Expand all images.'
    ]
    # Board Navigation
    'Front page': [
      '0'
      'Jump to page 0.'
    ]
    'Open front page': [
      'Shift+0'
      'Open page 0 in a new tab.'
    ]
    'Next page': [
      'Right'
      'Jump to the next page.'
    ]
    'Previous page': [
      'Left'
      'Jump to the previous page.'
    ]
    # Thread Navigation
    'Next thread': [
      'Down'
      'See next thread.'
    ]
    'Previous thread': [
      'Up'
      'See previous thread.'
    ]
    'Expand thread': [
      'Ctrl+e'
      'Expand thread.'
    ]
    'Open thread': [
      'o'
      'Open thread in current tab.'
    ]
    'Open thread tab': [
      'Shift+o'
      'Open thread in new tab.'
    ]
    # Reply Navigation
    'Next reply': [
      'j'
      'Select next reply.'
    ]
    'Previous reply': [
      'k'
      'Select previous reply.'
    ]
    'Hide': [
      'x'
      'Hide thread.'
    ]

  updater:
    checkbox:
      'Beep': [
        false
        'Beep on new post to completely read thread.'
      ]
      'Auto Scroll': [
        false
        'Scroll updated posts into view. Only enabled at bottom of page.'
      ]
      'Bottom Scroll': [
        false
        'Always scroll to the bottom, not the first new post. Useful for event threads.'
      ]
      'Scroll BG': [
        false
        'Auto-scroll background tabs.'
      ]
      'Auto Update': [
        true
        'Automatically fetch new posts.'
      ]
      'Optional Increase': [
        false
        'Increase the intervals between updates on threads without new posts.'
      ]
    'Interval': 30

  embedWidth: 640
  embedHeight: 390
  theme : 'Yotsuba B'
  mascot : ''
