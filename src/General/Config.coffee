Config =
  main:
    'Miscellaneous':
      'Catalog Links': [
        true
        'Add toggle link in header menu to turn Navigation links into links to each board\'s catalog.'
      ]
      'External Catalog': [
        false
        'Link to external catalog instead of the internal one.'
      ]
      'Announcement Hiding': [
        true
        'Add button to hide 4chan announcements.'
      ]
      'Desktop Notifications': [
        true
        'Enables desktop notifications across various <%= meta.name %> features.'
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
        true
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
      'Show Dice Roll': [
        true
        'Show dice that were entered into the email field.'
      ]
      'Color User IDs': [
        false
        'Assign unique colors to user IDs on boards that use them'
      ]
      'Remove Spoilers': [
        false
        'Remove all spoilers in text.'
      ]
      'Reveal Spoilers': [
        false
        'Indicate spoilers if Remove Spoilers is enabled, or make the text appear hovered if Remove Spoiler is disabled.'
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
      'Auto-embed': [
        false
        'Auto-embed Linkify Embeds.'
      ]
      'Link Title': [
        true
        'Replace the link of a supported site with its actual title. Currently Supported: YouTube, Vimeo, SoundCloud, and Github gists'
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
      'Thread Hiding Buttons': [
        false
        'Add buttons to hide entire threads.'
      ]
      'Reply Hiding Buttons': [
        false
        'Add buttons to hide single replies.'
      ]
      'Filtered Backlinks': [
        true
        'When enabled, shows backlinks to filtered posts with a line-through decoration. Otherwise, hides the backlinks.'
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
        true
        'Show full image on mouseover.'
      ]
      'Sauce': [
        true
        'Add sauce links to images.'
      ]
      'Reveal Spoiler Thumbnails': [
        false
        'Replace spoiler thumbnails with the original image.'
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
      'Image Prefetching': [
        false
        'Preload images'
      ]
      'Fappe Tyme': [
        false
        'Hide posts without images when toggled. *hint* *hint*'
      ]
      'Werk Tyme': [
        false
        'Hide images when toggled.'
      ]

    'Menu':
      'Menu': [
        true
        'Add a drop-down menu to posts.'
      ]
      'Report Link': [
        true
        'Add a report link to the menu.'
      ]
      'Thread Hiding Link': [
        true
        'Add a link to hide entire threads.'
      ]
      'Reply Hiding Link': [
        true
        'Add a link to hide single replies.'
      ]
      'Delete Link': [
        true
        'Add post and image deletion links to the menu.'
      ]
      <% if (type === 'crx') { %>
      'Download Link': [
        true
        'Add a download with original filename link to the menu. Chrome-only currently.'
      ]
      <% } %>
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
      'Hide Unread Count at (0)': [
        false
        'Hide the unread posts count in the tab title when it reaches 0.'
      ]
      'Unread Favicon': [
        true
        'Show a different favicon when there are unread posts.'
      ]
      'Unread Line': [
        true
        'Show a line to distinguish read posts from unread ones.'
      ]
      'Scroll to Last Read Post': [
        true
        'Scroll back to the last read post when reopening a thread.'
      ]
      'Thread Excerpt': [
        true
        'Show an excerpt of the thread in the tab title.'
      ]
      'Thread Stats': [
        true
        'Display reply and image count.'
      ]
      'Page Count in Stats': [
        false
        'Display the page count in the thread stats as well.'
      ]
      'Updater and Stats in Header': [
        true,
        'Places the thread updater and thread stats in the header instead of floating them.'
      ]
      'Thread Watcher': [
        true
        'Bookmark threads.'
      ]

    'Posting':
      'Header Shortcut': [
        true
        'Add a shortcut to the header to toggle the QR.'
      ]
      'Page Shortcut': [
        false
        'Add a shortcut to the top of the page to toggle the QR.'
      ]
      'Persistent QR': [
        true
        'The Quick reply won\'t disappear after posting.'
      ]
      'Auto Hide QR': [
        true
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
      'Remember QR Size': [
        false
        'Remember the size of the quick reply\'s comment field.'
      ]
      'Cooldown': [
        true
        'Indicate the remaining time before posting again.'
      ]
      'Cooldown Prediction': [
        true
        'Decrease the cooldown time by taking into account upload speed. Disable it if it\'s inaccurate for you.'
      ]
      'Posting Success Notifications': [
        true
        'Show notifications on successful post creation or file uploading.'
      ]
      'Captcha Warning Notifications': [
        true
        'When disabled, shows a red border on the CAPTCHA input until a key is pressed instead of a notification.'
      ]
      'Dump List Before Comment': [
        false
        'Position of the QR\'s Dump List.'
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
      'Quote Hash Navigation': [
        false
        'Include an extra link after quotes for autoscrolling to quoted posts.'
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
      'Quoted Title': [
        false
        'Change the page title to reflect you\'ve been quoted.'
      ]
      'Highlight Posts Quoting You': [
        false
        'Highlights any posts that contain a quote to your post.'
      ]
      'Highlight Own Posts': [
        false
        'Highlights own posts if Mark Quotes of You is enabled.'
      ]
      'Mark OP Quotes': [
        true
        'Add \'(OP)\' to OP quotes.'
      ]
      'Mark Cross-thread Quotes': [
        true
        'Add \'(Cross-thread)\' to cross-threads quotes.'
      ]
      'Quote Threading': [
        false
        'Thread conversations'
      ]

  imageExpansion:
    'Fit width': [
      false
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
      false
      'Expand all images only from current position to thread end.'
    ]
    'Advance on contract': [
      false
      'Advance to next post when contracting an expanded image.'
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
      'Persistent Custom Board Titles': [
        false
        'Forces custom board titles to be persistent, even if moot updates the board titles.'
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
      'Icon Orientation': [
        'horizontal'
        'Change the orientation of the appchan x icons.'
        ['horizontal', 'vertical']
      ]
      'Slideout Watcher': [
        true
        'Adds an icon you can hover over to show the watcher, as opposed to having the watcher always visible.'
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
      'Filtered Backlinks': [
        true
        'Hide backlinks to filtered posts.'
      ]
      'Force Reply Break': [
        false
        'Force replies to occupy their own line and not be adjacent to the OP image.'
      ]
      'Fit Width Replies': [
        true
        'Replies fit the entire width of the page.'
      ]
      'Indent Replies': [
        false
        'Indent posts under the OP.'
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

    Aesthetics:
      '4chan SS Navigation': [
        false
        'Try to emulate the appearance of 4chan SS\'s Navigation.'
      ]
      '4chan SS Sidebar': [
        false
        'Try to emulate the appearance of 4chan SS\'s Sidebar.'
      ]
      '4chan Banner Reflection': [
        false
        'Adds reflection effects to 4chan\'s image banner.'
      ]
      'Faded 4chan Banner': [
        true
        'Make 4chan\'s image banner translucent.'
      ]
      'Hide Ads': [
        false
        'Block advertisements. It\'s probably better to use AdBlock for this.'
      ]
      'Shrink Ads': [
        false
        'Make 4chan advertisements smaller.'
      ]
      'Fade Ads': [
        true
        'Make 4chan\'s ads translucent.'
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
      'Font': [
        'sans-serif'
        'The font used by all elements of 4chan.'
        'text'
      ]
      'Font Size': [
        '13'
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
      'Click to Toggle': [
        true
        'Click your current mascot to switch between your enabled mascots.'
      ]
      'Mascot Location': [
        'sidebar'
        'Change where your mascot is located.'
        ['sidebar', 'opposite']
      ]
      'Mascot Position': [
        'default'
        'Change where your mascot is placed in relation to the post form.'
        ['above post form', 'default', 'bottom', 'middle']
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
      'Silhouettize Mascots': [
        false
        'Apply a filter to mascots to try to turn them into silhouettes.'
      ]
      'Silhouette Contrast': [
        '0'
        'A number to increase the contrast of silhouettes. Suggested values: 0, 8, 16 ...'
        'text'
      ]

    Navigation:
      'Navigation Alignment': [
        'left'
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
        'Hide non-link text in the board navigation and pagination. This also disables the delimiters in <code>Custom Navigation</code>'
      ]

    'Post Form':
      'Compact Post Form Inputs': [
        true
        'Use compact inputs on the post form.'
      ]
      'Show Post Form Header': [
        false
        'Force the Post Form to have a header.'
      ]
      'Post Form Style': [
        'tabbed slideout'
        'How the post form will sit on the page.'
        ['fixed', 'slideout', 'tabbed slideout', 'float']
      ]
      'Post Form Slideout Transitions' : [
        true
        'Animate slideouts for the post form.'
      ]
      'Transparent Post Form': [
        false
        'Make the post form almost invisible.'
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
      'Images Overlap Post Form': [
        true
        'Images expand over the post form and sidebar content, usually used with "Expand images" set to "full".'
      ]

    Indicators:
      'Emoji': [
        'enabled'
        'Add icons besides usernames with triggered e-mails, like sega and neko.'
        ['enabled', 'disable ponies', 'only ponies', 'disable']
      ]
      'Emoji Position': [
        'before'
        'Position of emoji icons.'
        ['before', 'after']
      ]
      'Emoji Spacing': [
        '5'
        'Add some spacing between emoji and text.'
        'text'
      ]
      'Sage Highlighting': [
        'image'
        'Icons or text to highlight saged posts.'
        ['text', 'image', 'none']
      ]
      'Sage Image': [
        'appchan'
        'Image to use for sage highlighting.'
        ['4chan SS', 'appchan']
      ]
      'Sage Highlight Position': [
        'after'
        'Position of Sage Highlighting'
        ['before', 'after']
      ]

  threadWatcher:
    'Current Board': [
      false
      'Only show watched threads from the current board.'
    ]
    'Auto Watch': [
      true
      'Automatically watch threads you start.'
    ]
    'Auto Watch Reply': [
      false
      'Automatically watch threads you reply to.'
    ]
    'Auto Prune': [
      false
      'Automatically prune 404\'d threads.'
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

  Header:
    'Fixed Header':            true
    'Header auto-hide':        false
    'Bottom Header':           false
    'Header catalog links':    false
    'Bottom Board List':       true
    'Shortcut Icons':          false
    'Custom Board Navigation': true

  boardnav: """
[ toggle-all ]
[current-title]
[external-text:"FAQ","https://github.com/seaweedchan/4chan-x/wiki/Frequently-Asked-Questions"]
  """

  QR:
    'QR.personas': """#email:"sage";boards:jp;always"""

  time: '%m/%d/%y(%a)%H:%M:%S'

  backlink: '>>%id'

  fileInfo: '%L (%p%s, %r)'

  favicon: 'ferongr'

  usercss: """
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
    'Toggle board list': [
      'Ctrl+b'
      'Toggle the full board list.'
    ]
    'Toggle header': [
      'Shift+h'
      'Toggle the auto-hide option of the header.'
    ]
    'Open empty QR': [
      'i'
      'Open QR without post number inserted.'
    ]
    'Open QR': [
      'Shift+i'
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
    'Toggle sage': [
      'Alt+s'
      'Toggle sage in email field'
    ]
    'Submit QR': [
      'Ctrl+Enter'
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
    'fappeTyme': [
      'f'
      'Fappe Tyme.'
    ]
    'werkTyme': [
      'Shift+w'
      'Werk Tyme'
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
      'Shift+Right'
      'Jump to the next page.'
    ]
    'Previous page': [
      'Shift+Left'
      'Jump to the previous page.'
    ]
    'Open catalog': [
      'Shift+c'
      'Open the catalog of the current board'
    ]
    # Thread Navigation
    'Next thread': [
      'Shift+Down'
      'See next thread.'
    ]
    'Previous thread': [
      'Shift+Up'
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
    'Deselect reply': [
      'Shift+d'
      'Deselect reply.'
    ]
    'Hide': [
      'x'
      'Hide thread.'
    ]
    'Previous Post Quoting You': [
      'Alt+Up'
      'Scroll to the previous post that quotes you.'
    ]
    'Next Post Quoting You': [
      'Alt+Down'
      'Scroll to the next post that quotes you.'
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

  embedWidth:  640
  embedHeight: 390
  theme:        'Yotsuba B'
  'theme_sfw':  'Yotsuba B'
  'theme_nsfw': 'Yotsuba'
  mascot : ''
