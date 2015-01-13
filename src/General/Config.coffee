Config =
  main:
    'Miscellaneous':
      'JSON Navigation': [
        true
        'Use JSON for loading the Board Index and Threads. Also allows searching and sorting the board index and infinite scolling.'
      ]
      'Update Stale Index': [
        true
        'Updates the board index if it hasn\'t been updated in ten or more minutes when 4chan gains browser focus (like switching tabs or windows).'
      ]
      'Catalog Links': [
        true
        'Add toggle link in header menu to turn Navigation links into links to each board\'s catalog.'
      ]
      'External Catalog': [
        false
        'Link to external catalog instead of the internal one.'
      ]
      'Desktop Notifications': [
        false
        'Enables desktop notifications across various <%= meta.name %> features.'
      ]
      '404 Redirect': [
        true
        'Redirect dead threads and images.'
      ]
      'Exempt Archives from Encryption': [
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
      'Color User IDs': [
        true
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
      'Normalize URL': [
         true
        'Rewrite the URL of the current page, removing stubs and changing /res/ to /thread/.'
      ]
      'Announcement Hiding': [
        true
        'Enable announcements to be hidden.'
      ]

    'Linkification':
      'Linkify': [
        true
        'Convert text into links where applicable.'
      ]
      'Link Title': [
        true
        'Replace the link of a supported site with its actual title. Currently Supported: YouTube, Vimeo, SoundCloud, and Github gists'
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
        'Show full image / video on mouseover on hover in the catalog.'
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
        'Show controls on videos expanded inline. Turn this off if you want to contract videos by clicking on them.'
      ]
      'Loop in New Tab': [
        true
        'Loop videos opened in their own tabs.'
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
      'Post Hiding Link': [
        true
        'Add a link to hide posts.'
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
        'Fetch and insert new replies. Has more options in its own dialog.'
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
        'Show an excerpt of the thread in the tab title if not already present.'
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
      'Mark New IPs': [
        false
        'Label each post from a new IP with the thread\'s current IP count.'
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
      'Remember QR Size': [
        false
        'Remember the size of the quick reply\'s comment field.'
      ]
      'Remember Spoiler': [
        false
        'Remember the spoiler state, instead of resetting after posting.'
      ]
      'Show Name and Subject': [
        false
        'Show the classic name, email, and subject fields in the QR, even when 4chan doesn\'t use them all.'
      ]
      'Cooldown': [
        true
        'Indicate the remaining time before posting again.'
      ]
      'Posting Success Notifications': [
        true
        'Show notifications on successful post creation or file uploading.'
      ]
      'Force Noscript Captcha': [
        false
        'Use the non-Javascript fallback captcha in the QR even if Javascript is enabled.'
      ]
      'Captcha Warning Notifications': [
        true
        'When disabled, shows a red border on the CAPTCHA input until a key is pressed instead of a notification.'
      ]
      'Dump List Before Comment': [
        false
        'Position of the QR\'s Dump List.'
      ]
      'Auto-load captcha': [
        false
        'Automatically load the captcha in the QR even if your post is empty.'
      ]
      'Post on Captcha Completion': [
        false
        'Submit the post immediately when the captcha is completed.'
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
        'Highlights own posts if Quote Markers are enabled.'
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
      false
      'Expand all images along with spoilers.'
    ]
    'Expand videos': [
      false
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
      'Hide Navlinks': [
        false
        'Hides the UI at the top of the page that allows you to navigate between pages, like "Return", "Catalog", "Bottom".'
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
      <% if (type === 'userscript') { %>
      'Force Reply Break': [
        false
        'Force replies to occupy their own line and not be adjacent to the OP image.'
      ]
      <% } %>
      'Fit Width Replies': [
        false
        'Replies fit the entire width of the page.'
      ]
      'Indent Replies': [
        true
        'Indent posts under the OP.'
      ]
      'Hide Delete UI': [
        false
        'Hides vanilla report and delete functionality and UI. This does not affect Appchan\'s Menu functionality.'
      ]
      'Post Spacing': [
        '3'
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
      'Backlink Icons': [
        false
        'Replaces backlink text with a small, compact icon.'
      ]
      'Compact File Text': [
        false
        'Shrink the font of the file text to be less obtrusive.'
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
        ['fixed', 'slideout', 'tabbed slideout', 'slideup', 'tabbed slideup', 'float']
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
      'Captcha Filter': [
        true
        'Apply an SVG filter to the captcha to make it match your theme. WARNING: May cause invisible captchas.'
      ]

  threadWatcher:
    'Current Board': [
      false
      'Only show watched threads from the current board.'
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

  'Custom CSS': false

  Index:
    'Index Mode': 'paged'
    'Previous Index Mode': 'paged'
    'Index Sort': 'bump'
    'Index Size': 'small'
    'Threads per Page': 0
    'Open threads in a new tab': false
    'Show Replies': true
    'Pin Watched Threads': false
    'Anchor Hidden Threads': true
    'Refreshed Navigation': false

  Header:
    'Fixed Header':               true
    'Header auto-hide':           false
    'Header auto-hide on scroll': false
    'Bottom Header':              false
    'Header catalog links':       false
    'Bottom Board List':          true
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
      'Toggle sage in options field.'
    ]
    'Submit QR': [
      'Ctrl+Enter'
      'Submit post.'
    ]
    'Post Without Name': [
      'Alt+n'
      'Clear name field and then submits post.'
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
      'Toggle Werk Tyme'
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
    'Open catalog': [
      'Shift+c'
      'Open the catalog of the current board.'
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

  embedWidth:  640
  embedHeight: 390
  theme:        'Yotsuba B'
  'theme_sfw':  'Yotsuba B'
  'theme_nsfw': 'Yotsuba'
  mascot : ''
