Config =
  main:
    'Miscellaneous':
      'JSON Navigation': [
        true
        'Replace the original board index with one supporting searching, sorting, infinite scrolling, and a catalog mode.'
      ]
      'Use <%= meta.name %> Catalog': [
        true
        'Link to <%= meta.name %>\'s catalog instead of the native 4chan one.'
        1
      ]
      'Index Refresh Notifications': [
        false
        'Show a notice at the top of the page when the index is refreshed.'
        1
      ]
      'External Catalog': [
        false
        'Link to external catalog instead of the internal one.'
      ]
      'Catalog Links': [
        false
        'Add toggle link in header menu to turn Navigation links into links to each board\'s catalog.'
      ]
      'Announcement Hiding': [
        true
        'Add button to hide 4chan announcements.'
      ]
      'Desktop Notifications': [
        false
        'Enables desktop notifications across various <%= meta.name %> features.'
      ]
      '404 Redirect': [
        true
        'Redirect dead threads and images to the archives.'
      ]
      'Except Archives from Encryption': [
        false
        'Permit loading content from, and warningless redirects to, HTTP-only archives from HTTPS pages.'
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
      'Relative Date Title': [
        true
        'Show Relative Post Date only when hovering over dates.'
        1
      ]
      'Comment Expansion': [
        true
        'Expand comments that are too long to display on the index. Not applicable with JSON Navigation.'
      ]
      'File Info Formatting': [
        true
        'Reformat the file information.'
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
      'Custom Board Titles': [
        true
        'Allow editing of the board title and subtitle by ctrl/\u2318+clicking them.'
      ]
      'Persistent Custom Board Titles': [
        false
        'Force custom board titles to be persistent, even if the board titles are updated.'
        1
      ]
      'Show Updated Notifications': [
        true
        'Show notifications when <%= meta.name %> is successfully updated.'
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
        'Warn if your browser or configuration is unsupported and may cause <%= meta.name %> to not operate correctly.'
      ]
      'Normalize URL': [
        true
        'Rewrite the URL of the current page, removing stubs and changing /res/ to /thread/.'
      ]
      'Disable Autoplaying Sounds': [
        false
        'Prevent sounds on the page from autoplaying.'
      ]
      'Disable Native Extension': [
        true
        '<%= meta.name %> is NOT designed to work with the native extension.'
      ]

    'Linkification':
      'Linkify': [
        true
        'Convert text into links where applicable.'
      ]
      'Link Title': [
        true
        'Replace the link of a supported site with its actual title. Currently supported: YouTube, Vimeo, SoundCloud, and Github gists.'
        1
      ]
      'Embedding': [
        true
        'Embed supported services. Note: Some services don\'t work on HTTPS.'
        1
      ]
      'Auto-embed': [
        false
        'Auto-embed Linkify Embeds.'
        2
      ]
      'Floating Embeds': [
        false
        'Embed content in a frame that remains in place when the page is scrolled.'
        2
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
      'Filtered Backlinks': [
        false
        'When enabled, shows backlinks to filtered posts with a line-through decoration. Otherwise, hides the backlinks.'
        1
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
        'Show full image / video on mouseover in <%= meta.name %> catalog.'
      ]
      'Gallery': [
        true
        'Adds a simple and cute image gallery.'
      ]
      'Fullscreen Gallery': [
        false
        'Open gallery in fullscreen mode.'
        1
      ]
      'PDF in Gallery': [
        false
        'Show PDF files in gallery.'
        1
      ]
      'Sauce': [
        true
        'Add sauce links to images.'
      ]
      'WEBM Metadata': [
        true
        'Add link to fetch title metadata from webm videos.'
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
        'Add link in header menu to turn on image preloading.'
      ]
      'Fappe Tyme': [
        false
        'Hide posts without images when header menu item is checked. *hint* *hint*'
      ]
      'Werk Tyme': [
        false
        'Hide all post images when header menu item is checked.'
      ]
      'Autoplay': [
        true
        'Videos begin playing immediately when opened.'
      ]
      'Restart when Opened': [
        true
        'Restart GIFs and WebMs when you hover over or expand them.'
      ]
      'Show Controls': [
        true
        'Show controls on videos expanded inline.'
      ]
      'Click Passthrough': [
        false
        'Clicks on videos trigger your browser\'s default behavior. Videos can be contracted with button / dragging to the left.'
        1
      ]
      'Allow Sound': [
        true
        'Open videos with the sound unmuted.'
      ]
      'Mouse Wheel Volume': [
        true
        'Adjust volume of videos with the mouse wheel over the thumbnail/filename/gallery.'
      ]
      'Loop in New Tab': [
        true
        'Loop videos opened in their own tabs.'
      ]
      'Volume in New Tab': [
        true
        'Apply <%= meta.name %> mute and volume settings to videos opened in their own tabs.'
      ]

    'Menu':
      'Menu': [
        true
        'Add a drop-down menu to posts.'
      ]
      'Report Link': [
        true
        'Add a report link to the menu.'
        1
      ]
      'Thread Hiding Link': [
        true
        'Add a link to hide entire threads.'
        1
      ]
      'Reply Hiding Link': [
        true
        'Add a link to hide single replies.'
        1
      ]
      'Delete Link': [
        true
        'Add post and image deletion links to the menu.'
        1
      ]
      'Download Link': [
        true
        'Add a download with original filename link to the menu.'
        1
      ]
      'Archive Link': [
        true
        'Add an archive link to the menu.'
        1
      ]

    'Monitoring':
      'Thread Updater': [
        true
        'Fetch and insert new replies. Has more options in the header menu and the "Advanced" tab.'
      ]
      'Unread Count': [
        true
        'Show the unread posts count in the tab title.'
      ]
      'Quoted Title': [
        false
        'Change the page title to reflect you\'ve been quoted.'
        1
      ]
      'Hide Unread Count at (0)': [
        false
        'Hide the unread posts count in the tab title when it reaches 0.'
        1
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
        'Show an excerpt of the thread in the tab title for threads in /f/.'
      ]
      'Remove Thread Excerpt': [
        false
        'Replace the excerpt of the thread in the tab title with the board title.'
      ]
      'Thread Stats': [
        true
        'Display reply and image count.'
      ]
      'IP Count in Stats': [
        true
        'Display the unique IP count in the thread stats.'
        1
      ]
      'Page Count in Stats': [
        true
        'Display the page count in the thread stats.'
        1
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
        1
      ]
      'Mark New IPs': [
        false
        'Label each post from a new IP with the thread\'s current IP count.'
      ]

    'Posting':
      'Quick Reply': [
        true
        'All-in-one form to reply, create threads, automate dumping and more.'
      ]
      'QR Shortcut': [
        true
        'Add a shortcut to the header to toggle the QR.'
        1
      ]
      'Persistent QR': [
        true
        'The Quick reply won\'t disappear after posting.'
        1
      ]
      'Auto Hide QR': [
        true
        'Automatically hide the quick reply when posting.'
        1
      ]
      'Open Post in New Tab': [
        true
        'Open new threads or replies to a thread from the index in a new tab.'
        1
      ]
      <% if (type === 'userscript') { %>
      'Remember QR Size': [
        false
        'Remember the size of the Quick reply.'
        1
      ]
      <% } %>
      'Remember Spoiler': [
        false
        'Remember the spoiler state, instead of resetting after posting.'
        1
      ]
      'Show New Thread Option in Threads': [
        false
        'Show the option to post a new / different thread from inside a thread.'
        1
      ]
      'Show Name and Subject': [
        false
        'Show the classic name, email, and subject fields in the QR, even when 4chan doesn\'t use them all.'
        1
      ]
      'Hide Original Post Form': [
        true
        'Hide the normal post form.'
        1
      ]
      'Cooldown': [
        true
        'Indicate the remaining time before posting again.'
        1
      ]
      'Posting Success Notifications': [
        true
        'Show notifications on successful post creation or file uploading.'
        1
      ]
      'Force Noscript Captcha': [
        false
        'Use the non-Javascript fallback captcha in the QR even if Javascript is enabled.'
        1
      ]
      'Captcha Warning Notifications': [
        true
        'When disabled, shows a red border on the CAPTCHA input until a key is pressed instead of a notification.'
        1
      ]
      'Auto-load captcha': [
        false
        'Automatically load the captcha in the QR even if your post is empty.'
        1
      ]
      'Post on Captcha Completion': [
        false
        'Submit the post immediately when the captcha is completed.'
        1
      ]
      'Bottom QR Link': [
        true
        'Places a link on the bottom of threads to open the QR.'
        1
      ]

    'Quote Links':
      'Quote Backlinks': [
        true
        'Add quote backlinks.'
      ]
      'OP Backlinks': [
        true
        'Add backlinks to the OP.'
        1
      ]
      'Quote Inlining': [
        true
        'Inline quoted post on click.'
      ]
      'Quote Hash Navigation': [
        false
        'Include an extra link after quotes for autoscrolling to quoted posts.'
        1
      ]
      'Forward Hiding': [
        true
        'Hide original posts of inlined backlinks.'
        1
      ]
      'Quote Previewing': [
        true
        'Show quoted post on hover.'
      ]
      'Quote Highlighting': [
        true
        'Highlight the previewed post.'
        1
      ]
      'Resurrect Quotes': [
        true
        'Link dead quotes to the archives.'
      ]
      'Mark Quotes of You': [
        true
        'Add \'(You)\' to quotes linking to your posts.'
      ]
      'Highlight Posts Quoting You': [
        false
        'Highlights any posts that contain a quote to your post.'
        1
      ]
      'Highlight Own Posts': [
        false
        'Highlights own posts if Mark Quotes of You is enabled.'
        1
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
    'Scroll into view': [
      true
      'Scroll down when expanding images to bring the full image into view.'
    ]
    'Expand spoilers': [
      true
      'Expand all images along with spoilers.'
    ]
    'Expand videos': [
      true
      'Expand all images also expands videos.'
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
    'Fit Width': [ # 'Fit width' (lowercase W) belongs to Image Expansion. Engine limitations, heh.
      true
    ]
    'Fit Height': [
      true
    ]
    'Scroll to Post': [
      true
    ]
    'Slide Delay': [
      6.0
    ]

  'Default Volume': 1.0

  threadWatcher:
    'Current Board': [
      false
      'Only show watched threads from the current board.'
    ]
    'Auto Update Thread Watcher': [
      true
      'Periodically check status of watched threads.'
    ]
    'Auto Watch': [
      false
      'Automatically watch threads you start.'
    ]
    'Auto Watch Reply': [
      false
      'Automatically watch threads you reply to.'
    ]
    'Auto Prune': [
      false
      'Automatically remove dead threads.'
    ]
    'Show Unread Count': [
      true
      'Show number of unread posts in watched threads.'
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
    #//saucenao.com/search.php?url=%TURL
    #http://3d.iqdb.org/?url=%TURL
    #http://regex.info/exif.cgi?imgurl=%URL
    # uploaders:
    #//imgur.com/upload?url=%URL;text:Upload to imgur
    # "View Same" in archives:
    #https://archive.moe/_/search/image/%MD5/;text:View same on archive.moe
    #https://archive.moe/%board/search/image/%MD5/;text:View same on archive.moe/%board/;boards:<%=
      grunt.file.readJSON('src/Archive/archives.json').filter(function(x) {return x.uid === 0})[0].files.join(',')
    %>
    #https://rbt.asia/%board/image/%MD5;text:View same on RBT /%board/;boards:<%=
      grunt.file.readJSON('src/Archive/archives.json').filter(function(x) {return x.uid === 8})[0].files.join(',')
    %>
    # Search with full image only for image file types:
    #https://www.google.com/searchbyimage?image_url=%URL;types:gif,jpg,png
    #https://www.google.com/searchbyimage?image_url=%TURL;types:webm,pdf
  """

  FappeT:
    werk:  false

  'Custom CSS': false

  Index:
    'Index Mode': 'paged'
    'Previous Index Mode': 'paged'
    'Index Sort': 'bump'
    'Index Size': 'small'
    'Show Replies': true
    'Pin Watched Threads': false
    'Anchor Hidden Threads': true
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
    [external-text:"FAQ","<%= meta.faq %>"]
  """

  QR:
    'QR.personas': """
      #options:"sage";boards:jp;always
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
      'Close dialogs or notifications.'
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
      'Toggle sage in options field.'
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
      'Update the thread / refresh the index.'
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
    'Pause': [
      'p'
      'Pause/play videos in the gallery.'
    ]
    'Slideshow': [
      's'
      'Toggle the gallery slideshow mode.'
    ]
    'fappeTyme': [
      'f'
      'Toggle Fappe Tyme.'
    ]
    'werkTyme': [
      'Shift+w'
      'Toggle Werk Tyme.'
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
    'Paged mode': [
      'Alt+1'
      'Open the index in paged mode.'
    ]
    'Infinite scrolling mode': [
      'Alt+2'
      'Open the index in infinite scrolling mode.'
    ]
    'All pages mode': [
      'Alt+3'
      'Open the index in all threads mode.'
    ]
    'Open catalog': [
      'Shift+c'
      'Open the catalog of the current board.'
    ]
    'Search form': [
      'Ctrl+Alt+s'
      'Focus the search field on the board index.'
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
      'Ignore Offline Status': [
        false
        'Update even if your browser reports you are offline.'
      ]
      'Optional Increase': [
        false
        'Increase the intervals between updates on threads without new posts.'
      ]
    'Interval': 30

  customCooldown: 0
  customCooldownEnabled: true
