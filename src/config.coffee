Config =
  main:
    Enhancing:
      'Disable inline 4chan addon':   [true,  'Avoid conflicts between 4chan X and 4chan\'s inline extension. <span class=disabledwarning><code>Style</code> is enabled. This option will be enabled regardless of this setting\'s value.</span>']
      '404 Redirect':                 [true,  'Redirect dead threads and images']
      'Keybinds':                     [true,  'Binds actions to keys']
      'Time Formatting':              [true,  'Arbitrarily formatted timestamps, using your local time']
      'File Info Formatting':         [true,  'Reformats the file information']
      'Comment Expansion':            [true,  'Expand too long comments']
      'Thread Expansion':             [true,  'View all replies']
      'Index Navigation':             [true,  'Navigate to previous / next thread']
      'Rollover':                     [true,  'Index navigation will fallback to page navigation.']
      'Reply Navigation':             [false, 'Navigate to top / bottom of thread']
      'Style':                        [true,  'Custom theming and styling options.']
      'Check for Updates':            [false,  'Check for updated versions of Appchan X']
    Filtering:
      'Anonymize':                    [false, 'Make everybody anonymous']
      'Filter':                       [true,  'Self-moderation placebo']
      'Recursive Filtering':          [true,  'Filter replies of filtered posts, recursively']
      'Reply Hiding':                 [true,  'Hide single replies']
      'Thread Hiding':                [true,  'Hide entire threads']
      'Show Stubs':                   [true,  'Of hidden threads / replies']
    Imaging:
      'Image Auto-Gif':               [false, 'Animate gif thumbnails']
      'Png Thumbnail Fix':            [false, 'Fixes transparent png thumbnails']
      'Image Expansion':              [true,  'Expand images']
      'Image Hover':                  [false, 'Show full image on mouseover']
      'Sauce':                        [true,  'Add sauce to images']
      'Reveal Spoilers':              [false, 'Replace spoiler thumbnails by the original thumbnail']
      'Expand From Current':          [false, 'Expand images from current position to thread end.']
      'Prefetch':                     [false, 'Prefetch images.']
    Menu:
      'Menu':                         [true,  'Add a drop-down menu in posts.']
      'Report Link':                  [true,  'Add a report link to the menu.']
      'Delete Link':                  [true,  'Add post and image deletion links to the menu.']
      'Download Link':                [true,  'Add a download with original filename link to the menu. Chrome-only currently.']
      'Archive Link':                 [true,  'Add an archive link to the menu.']
    Monitoring:
      'Thread Updater':               [true,  'Update threads. Has more options in its own dialog.']
      'Unread Count':                 [true,  'Show unread post count in tab title']
      'Unread Favicon':               [true,  'Show a different favicon when there are unread posts']
      'Post in Title':                [true,  'Show the op\'s post in the tab title']
      'Thread Stats':                 [true,  'Display reply and image count']
      'Thread Watcher':               [true,  'Bookmark threads']
      'Auto Watch':                   [true,  'Automatically watch threads that you start']
      'Auto Watch Reply':             [false, 'Automatically watch threads that you reply to']
    Posting:
      'Quick Reply':                  [true,  'Reply without leaving the page. <span class=disabledwarning><code>Style</code> is enabled. This option will be enabled regardless of this setting\'s value.</span>']
      'Cooldown':                     [true,  'Prevent "flood detected" errors.']
      'Persistent QR':                [true,  'The Quick reply won\'t disappear after posting. <span class=disabledwarning><code>Style</code> is enabled. This option will be enabled regardless of this setting\'s value.</span>']
      'Auto Hide QR':                 [false, 'Automatically hide the quick reply when posting. <span class=disabledwarning><code>Style</code> is enabled. This option will be disabled regardless of this setting\'s value.</span>']
      'Open Reply in New Tab':        [false, 'Open replies in a new tab that are made from the main board.']
      'Remember QR size':             [false, 'Remember the size of the Quick reply (Firefox only).']
      'Remember Subject':             [false, 'Remember the subject field, instead of resetting after posting.']
      'Remember Spoiler':             [false, 'Remember the spoiler state, instead of resetting after posting.']
      'Hide Original Post Form':      [true,  'Replace the normal post form with a shortcut to open the QR. <span class=disabledwarning><code>Style</code> is enabled. This option will be disabled regardless of this setting\'s value.</span>']
      'Sage on /jp/':                 [true,  'Uses sage by default on /jp/']
      'Markdown':                     [false, 'Code, italic, bold, italic bold, double struck - `, *, **, ***, ||, respectively. _ can be used instead of *. <span class=warning><code>Markdown</code> is currently blocked server-side, and using it will simply remove markdowned elements from your post.</style>']
    Quoting:
      'Quote Backlinks':              [true,  'Add quote backlinks']
      'OP Backlinks':                 [false, 'Add backlinks to the OP']
      'Quote Highlighting':           [true,  'Highlight the previewed post']
      'Quote Inline':                 [true,  'Show quoted post inline on quote click']
      'Quote Preview':                [true,  'Show quote content on hover']
      'Resurrect Quotes':             [true,  'Linkify dead quotes to archives']
      'Indicate OP quote':            [true,  'Add \'(OP)\' to OP quotes']
      'Indicate Cross-thread Quotes': [true,  'Add \'(Cross-thread)\' to cross-threads quotes']
      'Forward Hiding':               [true,  'Hide original posts of inlined backlinks']
      'Quote Threading':              [false, 'Thread conversations']
  filter:
    name: [
      '# Filter any namefags:'
      '#/^(?!Anonymous$)/'
    ].join '\n'
    uniqueid: [
      '# Filter a specific ID:'
      '#/Txhvk1Tl/'
    ].join '\n'
    tripcode: [
      '# Filter any tripfags'
      '#/^!/'
    ].join '\n'
    mod: [
      '# Set a custom class for mods:'
      '#/Mod$/;highlight:mod;op:yes'
      '# Set a custom class for moot:'
      '#/Admin$/;highlight:moot;op:yes'
    ].join '\n'
    email: [
      '# Filter any e-mails that are not `sage` on /a/ and /jp/:'
      '#/^(?!sage$)/;boards:a,jp'
    ].join '\n'
    subject: [
      '# Filter Generals on /v/:'
      '#/general/i;boards:v;op:only'
    ].join '\n'
    comment: [
      '# Filter Stallman copypasta on /g/:'
      '#/what you\'re refer+ing to as linux/i;boards:g'
    ].join '\n'
    country: [
      ''
    ].join '\n'
    filename: [
      ''
    ].join '\n'
    dimensions: [
      '# Highlight potential wallpapers:'
      '#/1920x1080/;op:yes;highlight;top:no;boards:w,wg'
    ].join '\n'
    filesize: [
      ''
    ].join '\n'
    md5: [
      ''
    ].join '\n'
  sauces: [
    'http://iqdb.org/?url=$1'
    'http://www.google.com/searchbyimage?image_url=$1'
    '#http://tineye.com/search?url=$1'
    '#http://saucenao.com/search.php?db=999&url=$1'
    '#http://3d.iqdb.org/?url=$1'
    '#http://regex.info/exif.cgi?imgurl=$2'
    '# uploaders:'
    '#http://imgur.com/upload?url=$2;text:Upload to imgur'
    '#http://omploader.org/upload?url1=$2;text:Upload to omploader'
    '# "View Same" in archives:'
    '#http://archive.foolz.us/_/search/image/$3/;text:View same on foolz'
    '#http://archive.foolz.us/$4/search/image/$3/;text:View same on foolz /$4/'
    '#https://archive.installgentoo.net/$4/image/$3;text:View same on installgentoo /$4/'
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M'
  backlink: '>>%id'
  fileInfo: '%l (%p%s, %r)'
  favicon: 'ferongr'
  hotkeys:
    # QR & Options
    openQR:          ['i',      'Open QR with post number inserted']
    openEmptyQR:     ['I',      'Open QR without post number inserted']
    openOptions:     ['ctrl+o', 'Open Options']
    close:           ['Esc',    'Close Options or QR']
    spoiler:         ['ctrl+s', 'Quick spoiler tags']
    code:            ['alt+c',  'Quick code tags']
    sageru:          ['alt+n',  'Sage keybind']
    submit:          ['alt+s',  'Submit post']
    # Thread related
    watch:           ['w',      'Watch thread']
    update:          ['u',      'Update now']
    unreadCountTo0:  ['z',      'Mark thread as read']
    threading:       ['t',      'Toggle threading']
    # Images
    expandImage:     ['m',      'Expand selected image']
    expandAllImages: ['M',      'Expand all images']
    # Board Navigation
    zero:            ['0',      'Jump to page 0']
    nextPage:        ['L',      'Jump to the next page']
    previousPage:    ['H',      'Jump to the previous page']
    # Thread Navigation
    nextThread:      ['n',      'See next thread']
    previousThread:  ['p',      'See previous thread']
    expandThread:    ['e',      'Expand thread']
    openThreadTab:   ['o',      'Open thread in new tab']
    openThread:      ['O',      'Open thread in current tab']
    # Reply Navigation
    nextReply:       ['J',      'Select next reply']
    previousReply:   ['K',      'Select previous reply']
    hide:            ['x',      'Hide thread']
  updater:
    checkbox:
      'Scrolling':   [false,    'Scroll updated posts into view. Only enabled at bottom of page.']
      'Scroll BG':   [false,    'Scroll background tabs']
      'Verbose':     [true,     'Show countdown timer, new post count']
      'Auto Update': [true,     'Automatically fetch new posts']
    'Interval': 30
  style:
    Dialogs:
      'Announcements':             ['slideout',            'The style of announcements and the ability to hide them.', [
        '4chan default', 'slideout', 'hide'
      ]]
      'Post Form Style':           ['tabbed slideout', 'How the post form will sit on the page.', [
        'fixed', 'slideout', 'tabbed slideout', 'transparent fade'
      ]]
      'Slideout Navigation':       ['compact',         'How the slideout navigation will be displayed.', [
        'compact', 'list', 'hide'
      ]]
      'Slideout Watcher':          [true,              'Adds an icon you can hover over to show the watcher, as opposed to having the watcher always visible.']
      'Updater Position':          ['top',             'The position of 4chan thread updater', [
        'top', 'bottom'
      ]]
    Navigation:
      'Boards Navigation':         ['sticky top',      'The position of 4chan board navigation', [
        'sticky top', 'sticky bottom', 'top', 'hide'
      ]]
      'Pagination':                ['sticky bottom',   'The position of 4chan page navigation', [
        'sticky top', 'sticky bottom', 'top', 'bottom', 'on side', 'hide'
      ]]
    Rice:
      'Block Ads':                 [false,             'Block advertisements. It\'s probably better to use AdBlock for this.']
      'Checkboxes':                ['show',            'Alter checkboxes.', [
        'show', 'make checkboxes circular', 'hide', 'do not style checkboxes'
      ]]
      'Captcha Opacity':           ['1.00',            'Transparency of the 4chan Captcha', [
        '1.00', '.75', '.50', '.25'
      ]]
      'Emoji':                     ['enabled',         'Enable emoji', [
        'enabled', 'disable ponies', 'disable'
      ]]
      'Emoji Position':            ['before',          'Position of emoji icons, like sega and neko.', [
        'before', 'after'
      ]]
      'Filtered Backlinks':        [true,              'Mark backlinks to filtered posts.']
      'Font':                      ['Calibri',         'The font used by all elements of 4chan.', 'text']
      'Font Size':                 ['12px',            'The font size of posts and various UI. This does not change all font sizes.', 'text']
      'Mascots':                   [false,             'Add a pretty picture of your waifu to the sidebar.']
      'Mascots Overlap Posts':     [true,              'Mascots overlap threads and posts.']
      'Rounded Edges':             [true,              'Round the edges of various 4chan elements.']
      'Sage Highlighting':         ['image',           'Icons or text to highlight saged posts.', [
        'text', 'image', 'none'
      ]]
      'Underline Links':           [true,              'Put lines under hyperlinks.']
    Layout:
      '4chan Banner':              ['in sidebar',      'The positioning of 4chan\'s image banner.', [
        'in sidebar', 'at top', 'hide'
      ]]
      'Board Logo':                ['in sidebar',      'The positioning of the board\'s logo and subtitle.', [
        'in sidebar', 'at top', 'hide'
      ]]
      'Compact Post Form Inputs':  [true,              'Use compact inputs on the post form.']
      'Expand Post Form Textarea': [true,              'Expands the post form text area when in use.']
      'Fit Width Replies':         [true,              'Replies fit the entire width of the page.']
      'Page Margin':               ['fully centered',  'Additional layout options, allowing you to center the page or use additional page margins. Disabling the sidebar will cause this option to affect both sides of the page, essentially centering the page content with all options.', [
        'none', 'small', 'medium', 'large', 'fully centered'
      ]]
      'Reply Spacing':             ['small',           'The amount of space between replies.', [
        'none', 'small', 'medium', 'large'
      ]]
      'Sidebar':                   ['normal',          'Alter the sidebar size. Completely hiding it can cause content to overlap, but with the correct option combinations can create a minimal 4chan layout that has more efficient screen real-estate than vanilla 4chan.', [
        'normal', 'large', 'hide'
      ]]
  theme        : 'Yotsuba B'
  styleenabled : '0'
  navigation   : {}

Conf           = {}
userThemes     = {}
editTheme      = {}
userMascots    = {}
editMascot     = {}
editMode       = false
newTheme       = false
enabledmascots = {}
d              = document
g              = {}