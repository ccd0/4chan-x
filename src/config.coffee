Config =
  main:
    Enhancing:
      'Disable 4chan\'s extension':   [true,  'Avoid conflicts between <%= meta.name %> and 4chan\'s inline extension.']
      '404 Redirect':                 [true,  'Redirect dead threads and images.']
      'Keybinds':                     [true,  'Bind actions to keyboard shortcuts.']
      'Time Formatting':              [true,  'Localize and format timestamps arbitrarily.']
      'File Info Formatting':         [true,  'Reformat the file information.']
      'Comment Expansion':            [true,  'Can expand too long comments.']
      'Thread Expansion':             [true,  'Can expand threads to view all replies.']
      'Index Navigation':             [false, 'Navigate to previous / next thread.']
      'Reply Navigation':             [false, 'Navigate to top / bottom of thread.']
      'Check for Updates':            [true,  'Check for updated versions of <%= meta.name %>.']
    Filtering:
      'Anonymize':                    [false, 'Turn everyone Anonymous.']
      'Filter':                       [true,  'Self-moderation placebo.']
      'Recursive Filtering':          [true,  'Filter replies of filtered posts, recursively.']
      'Reply Hiding':                 [true,  'Hide single replies.']
      'Thread Hiding':                [true,  'Hide entire threads.']
      'Stubs':                        [true,  'Make stubs of hidden threads / replies.']
    Imaging:
      'Auto-GIF':                     [false, 'Animate GIF thumbnails.']
      'Image Expansion':              [true,  'Expand images.']
      'Expand From Position':         [true,  'Expand all images only from current position to thread end.']
      'Image Hover':                  [false, 'Show full image on mouseover.']
      'Sauce':                        [true,  'Add sauce links to images.']
      'Reveal Spoilers':              [false, 'Reveal spoiler thumbnails.']
    Menu:
      'Menu':                         [true,  'Add a drop-down menu in posts.']
      'Report Link':                  [true,  'Add a report link to the menu.']
      'Delete Link':                  [true,  'Add post and image deletion links to the menu.']
      'Download Link':                [true,  'Add a download with original filename link to the menu. Chrome-only currently.']
      'Archive Link':                 [true,  'Add an archive link to the menu.']
    Monitoring:
      'Thread Updater':               [true,  'Fetch and insert new replies. Has more options in its own dialog.']
      'Unread Count':                 [true,  'Show the unread posts count in the tab title.']
      'Unread Favicon':               [true,  'Show a different favicon when there are unread posts.']
      'Post in Title':                [true,  'Show the thread\'s subject in the tab title.']
      'Thread Stats':                 [true,  'Display reply and image count.']
      'Thread Watcher':               [true,  'Bookmark threads.']
      'Auto Watch':                   [true,  'Automatically watch threads that you start.']
      'Auto Watch Reply':             [false, 'Automatically watch threads that you reply to.']
    Posting:
      'Quick Reply':                  [true,  'WMD.']
      'Persistent QR':                [false, 'The Quick reply won\'t disappear after posting.']
      'Auto Hide QR':                 [false, 'Automatically hide the quick reply when posting.']
      'Open Reply in New Tab':        [false, 'Open replies posted from the board pages in a new tab.']
      'Remember Subject':             [false, 'Remember the subject field, instead of resetting after posting.']
      'Remember Spoiler':             [false, 'Remember the spoiler state, instead of resetting after posting.']
      'Hide Original Post Form':      [true,  'Replace the normal post form with a shortcut to open the QR.']
    Quoting:
      'Quote Backlinks':              [true,  'Add quote backlinks.']
      'OP Backlinks':                 [false, 'Add backlinks to the OP.']
      'Quote Inline':                 [true,  'Inline quoted post on click.']
      'Forward Hiding':               [true,  'Hide original posts of inlined backlinks.']
      'Quote Preview':                [true,  'Show quoted post on hover.']
      'Quote Highlighting':           [true,  'Highlight the previewed post.']
      'Resurrect Quotes':             [true,  'Linkify dead quotes to archives.']
      'Indicate OP Quotes':           [true,  'Add \'(OP)\' to OP quotes.']
      'Indicate Cross-thread Quotes': [true,  'Add \'(Cross-thread)\' to cross-threads quotes.']
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
    capcode: [
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
    flag: [
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
    'http://iqdb.org/?url=%turl'
    'http://www.google.com/searchbyimage?image_url=%turl'
    '#http://tineye.com/search?url=%turl'
    '#http://saucenao.com/search.php?db=999&url=%turl'
    '#http://3d.iqdb.org/?url=%turl'
    '#http://regex.info/exif.cgi?imgurl=%url'
    '# uploaders:'
    '#http://imgur.com/upload?url=%url;text:Upload to imgur'
    '#http://omploader.org/upload?url1=%url;text:Upload to omploader'
    '# "View Same" in archives:'
    '#//archive.foolz.us/_/search/image/%md5/;text:View same on foolz'
    '#//archive.foolz.us/%board/search/image/%md5/;text:View same on foolz /%board/'
    '#//archive.installgentoo.net/%board/image/%md5;text:View same on installgentoo /%board/'
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M:%S'
  backlink: '>>%id'
  fileInfo: '%l (%p%s, %r)'
  favicon: 'ferongr'
  hotkeys:
    # QR & Options
    'open QR':            ['q',      'Open QR with post number inserted.']
    'open empty QR':      ['Q',      'Open QR without post number inserted.']
    'open options':       ['alt+o',  'Open Options.']
    'close':              ['Esc',    'Close Options or QR.']
    'spoiler tags':       ['ctrl+s', 'Insert spoiler tags.']
    'code tags':          ['alt+c',  'Insert code tags.']
    'submit QR':          ['alt+s',  'Submit post.']
    # Thread related
    'watch':              ['w',      'Watch thread.']
    'update':             ['u',      'Update the thread now.']
    'read thread':        ['r',      'Mark thread as read.']
    # Images
    'expand image':       ['E',      'Expand selected image.']
    'expand images':      ['e',      'Expand all images.']
    # Board Navigation
    'front page':         ['0',      'Jump to page 0.']
    'next page':          ['Right',  'Jump to the next page.']
    'previous page':      ['Left',   'Jump to the previous page.']
    # Thread Navigation
    'next thread':        ['Down',   'See next thread.']
    'previous thread':    ['Up',     'See previous thread.']
    'expand thread':      ['ctrl+e', 'Expand thread.']
    'open thread':        ['o',      'Open thread in current tab.']
    'open thread tab':    ['O',      'Open thread in new tab.']
    # Reply Navigation
    'next reply':         ['j',      'Select next reply.']
    'previous reply':     ['k',      'Select previous reply.']
    'hide':               ['x',      'Hide thread.']
  updater:
    checkbox:
      'Auto Scroll': [false, 'Scroll updated posts into view. Only enabled at bottom of page.']
      'Scroll BG':   [false, 'Auto-scroll background tabs.']
      'Auto Update': [true,  'Automatically fetch new posts.']
    'Interval': 30
  imageFit: 'fit width'
