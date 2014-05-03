Config =
  main:
    'Miscellaneous':
      'JSON Navigation' : [
        true
        'Use JSON for loading the Board Index and Threads. Also allows searching and sorting the board index and infinite scolling.'
      ]
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
      'Desktop Notifications': [
        false
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
      'Thread Expansion': [
        true
        'Add buttons to expand threads.'
      ]
      'Comment Expansion': [
        false
        'Expand Comments that are too long to display on the index. Does not work with JSON Navigation.'
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
      'Custom Board Titles': [
        true
        'Allow editing of the board title and subtitle by ctrl+clicking them'
      ]
      'Persistent Custom Board Titles': [
        false
        'Force custom board titles to be persistent, even if moot updates the board titles.'
      ]
      'Show Updated Notifications': [
        true
        'Show notifications when 4chan X is successfully updated.'
      ]
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
      'Reveal Spoilers': [
        false
        'Indicate spoilers if Remove Spoilers is enabled, or make the text appear hovered if Remove Spoiler is disabled.'
      ]
      'Show Support Message': [
        true
        'Warn if your browser is unsupported. 4chan X may not operate correctly on unsupported browser versions.'
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
      'Post Hiding': [
        false
        'Add buttons to hide posts.'
      ]
      'Filtered Backlinks': [
        true
        'When enabled, shows backlinks to filtered posts with a line-through decoration. Otherwise, hides the backlinks.'
      ]
      'Stubs': [
        true
        'Show stubs of hidden threads / replies.'
      ]

    'Images and Videos':
      'Image Expansion': [
        true
        'Expand images / videos.'
      ]
      'Image Hover': [
        true
        'Show full image / video on mouseover.'
      ]
      'Image Hover in Catalog': [
        false
        'Show a floating expanded image on hover in the catalog.'
      ]
      'Gallery': [
        true
        'Adds a simple and cute image gallery.' 
      ]
      'PDF in Gallery': [
        false
        'Show PDF files in gallery.'
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
        'Replace gif thumbnails with the actual image.'
      ]
      'Replace JPG': [
        false
        'Replace jpg thumbnails with the actual image.'
      ]
      'Replace PNG': [
        false
        'Replace png thumbnails with the actual image.'
      ]
      'Replace WEBM': [
        false
        'Replace webm thumbnails with the actual webm video. Probably will degrade browser performance ;)'
      ]
      'Image Prefetching': [
        false
        'Preload images'
      ]
      'Fappe Tyme': [
        false
        'Hide posts without images. *hint* *hint*'
      ]
      'Werk Tyme': [
        false
        'Hide all post images.'
      ]
      'Autoplay': [
        true
        'Videos begin playing immediately when opened.'
      ]
      'Show Controls': [
        true
        'Show controls on videos expanded inline. Turn this off if you want to contract videos by clicking on them.'
      ]
      'Allow Sound': [
        true
        'Allow sound in videos.'
      ]
      'Loop in New Tab': [
        true
        'Loop videos opened in their own tabs, and apply settings for inline expanded videos to them.'
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
      'Post Hiding Link': [
        true
        'Add a link to hide posts.'
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
        true
        'Adds a shortcut for the thread watcher, hides the watcher by default, and makes it scroll with the page.'
      ]

    'Posting':
      'Quick Reply': [
        true
        'All-in-one form to reply, create threads, automate dumping and more.'
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
      'Posting Success Notifications': [
        true
        'Show notifications on successful post creation or file uploading.'
      ]
      'Captcha Warning Notifications': [
        true
        'When disabled, shows a red border on the CAPTCHA input until a key is pressed instead of a notification.'
      ]
      'Auto-load captcha': [
        false
        'Automatically load the captcha when you open a thread, and reload it after you post.'
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
        'Highlights own posts if Quote Markers are enabled.'
      ]
      'Quote Threading': [
        false
        'Thread conversations'
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
        'Highlights own posts if Quote Markers are enabled.'
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
    'Expand videos': [
      false
      'Expand all images also expands videos (no autoplay).'
    ]
    'Expand from here': [
      false
      'Expand all images only from current position to thread end.'
    ]
    'Advance on contract': [
      false
      'Advance to next post when contracting an expanded image.'
    ]
  
  gallery:
    'Hide Thumbnails': [
      false
    ]
    # Fit Width =/= Fit width
    'Fit Width': [
      true
    ]
    'Fit Height': [
      true
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

    email: ""

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

  FappeT:
    fappe: false
    werk:  false

  'sageEmoji': '4chan SS'
  
  'emojiPos': 'before'
  
  'Custom CSS': false

  Index:
    'Index Mode': 'paged'
    'Previous Index Mode': 'paged'
    'Index Sort': 'bump'
    'Index Size': 'small'
    'Threads per Page': 0
    'Open threads in a new tab': false
    'Show Replies': true
    'Refreshed Navigation': false

  Header:
    'Fixed Header':               true
    'Header auto-hide':           false
    'Header auto-hide on scroll': false
    'Bottom Header':              false
    'Centered links':             false
    'Header catalog links':       false
    'Bottom Board List':          true
    'Shortcut Icons':             true
    'Custom Board Navigation':    true

  boardnav: """
[ toggle-all ]
a-replace
c-replace
g-replace
k-replace
v-replace
vg-replace
vr-replace
ck-replace
co-replace
fit-replace
jp-replace
mu-replace
sp-replace
tv-replace
vp-replace
[external-text:"FAQ","https://github.com/ccd0/4chan-x/wiki/Frequently-Asked-Questions"]
  """

  QR:
    'QR.personas': """
      #email:"sage";boards:jp;always
    """

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
    'Open Gallery': [
      'g'
      'Opens the gallery.'
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
      '1'
      'Jump to front page.'
    ]
    'Open front page': [
      'Shift+1'
      'Open front page in a new tab.'
    ]
    'Next page': [
      'Ctrl+Right'
      'Jump to the next page.'
    ]
    'Previous page': [
      'Ctrl+Left'
      'Jump to the previous page.'
    ]
    'Search form': [
      'Ctrl+Alt+s'
      'Focus the search field on the board index.'
    ]
    'Paged mode': [
      'Alt+1'
      'Sets the index mode to paged.'
    ]
    'All pages mode': [
      'Alt+2'
      'Sets the index mode to all threads.'
    ]
    'Catalog mode': [
      'Alt+3'
      'Sets the index mode to catalog.'
    ]
    'Cycle sort type': [
      'Alt+x'
      'Cycle through index sort types.'
    ]
    # Thread Navigation
    'Next thread': [
      'Ctrl+Down'
      'See next thread.'
    ]
    'Previous thread': [
      'Ctrl+Up'
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
