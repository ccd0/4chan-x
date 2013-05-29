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
      'QR Shortcut': [
        false,
        'Adds a small [QR] link in the header.'
      ]
      'Announcement Hiding': [
        true
        'Add button to hide 4chan announcements.'
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
      <% if (type !== 'crx') { %>
      'Check for Updates': [
        true
        'Check for updated versions of <%= meta.name %>.'
      ]
      <% } %>
      'Emoji': [
        false
        'Adds icons next to names for different emails'
      ]
      'Color User IDs': [
        false
        'Assign unique colors to user IDs on boards that use them'
      ]
      'Remove Spoilers': [
        false
        'Remove all spoilers in text.'
      ]
      'Indicate Spoilers': [
        false
        'Indicate spoilers if Remove Spoilers is enabled.'
      ]

    'Linkification':
      'Linkify': [
        true
        'Convert text into links where applicable.'
      ]
      'Allow False Positives': [
        false
        'Linkify everything, allowing more false positives but reducing missed links'
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
        true
        'Add buttons to hide entire threads.'
      ]
      'Reply Hiding Buttons': [
        true
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
      'Image Prefetching': [
        false
        'Preload images'
      ]
      'Fappe Tyme': [
        false
        'Hide posts without images. *hint* *hint*'
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
      'Toggleable Thread Watcher': [
        false
        'Adds a shortcut for the thread watcher, hides the watcher by default, and makes it scroll with the page.'
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
      <% if (type === 'userscript') { %>
      'Remember QR Size': [
        false
        'Remember the size of the Quick reply.'
      ]
      <% } %>
      'Remember Spoiler': [
        false
        'Remember the spoiler state, instead of resetting after posting.'
      ]
      'Hide Original Post Form': [
        true
        'Hide the normal post form.'
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
    'Advance on contract': [
      false
      'Advance to next post when contracting an expanded image.'
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
  'sageEmoji': '4chan SS'
  
  'emojiPos': 'before'
  
  'Custom CSS': false

  Header:
    'Fixed Header':            true
    'Header auto-hide':        false
    'Bottom Header':           false
    'Centered links':          false
    'Header catalog links':    false
    'Bottom Board List':       true
    'Custom Board Navigation': true

  boardnav: """
[ toggle-all ]
[current-title]
[external-text:"FAQ","https://github.com/seaweedchan/4chan-x/wiki/Frequently-Asked-Questions"]
  """

  QR:
    'QR.personas': """
      #email:"sage";boards:jp;always
      """

  time: '%m/%d/%y(%a)%H:%M:%S'

  backlink: '>>%id'

  fileInfo: '%L (%p%s, %r)'

  favicon: 'ferongr'

  usercss: ''

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
