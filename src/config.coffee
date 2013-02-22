Config =
  main:
    'Miscellaneous':
      'Enable 4chan\'s Extension':    [false, 'Compatibility between <%= meta.name %> and 4chan\'s inline extension is NOT guaranteed.']
      '404 Redirect':                 [true,  'Redirect dead threads and images.']
      'Keybinds':                     [true,  'Bind actions to keyboard shortcuts.']
      'Time Formatting':              [true,  'Localize and format timestamps arbitrarily.']
      'Relative Post Dates':          [false, 'Display dates like "3 minutes ago". Tooltip shows the timestamp.']
      'File Info Formatting':         [true,  'Reformat the file information.']
      'Comment Expansion':            [true,  'Can expand too long comments.']
      'Thread Expansion':             [true,  'Can expand threads to view all replies.']
      'Index Navigation':             [false, 'Navigate to previous / next thread.']
      'Check for Updates':            [true,  'Check for updated versions of <%= meta.name %>.']
    'Filtering':
      'Anonymize':                    [false, 'Turn everyone Anonymous.']
      'Filter':                       [true,  'Self-moderation placebo.']
      'Recursive Hiding':             [true,  'Hide replies of hidden posts, recursively.']
      'Thread Hiding':                [true,  'Hide entire threads.']
      'Reply Hiding':                 [true,  'Hide single replies.']
      'Hiding Buttons':               [true,  'Make buttons to hide threads / replies, in addition to menu links.']
      'Stubs':                        [true,  'Make stubs of hidden threads / replies.']
    'Images':
      'Auto-GIF':                     [false, 'Animate GIF thumbnails.']
      'Image Expansion':              [true,  'Expand images.']
      'Image Hover':                  [false, 'Show full image on mouseover.']
      'Sauce':                        [true,  'Add sauce links to images.']
      'Reveal Spoilers':              [false, 'Reveal spoiler thumbnails.']
    'Menu':
      'Menu':                         [true,  'Add a drop-down menu in posts.']
      'Report Link':                  [true,  'Add a report link to the menu.']
      'Delete Link':                  [true,  'Add post and image deletion links to the menu.']
      'Download Link':                [true,  'Add a download with original filename link to the menu. Chrome-only currently.']
      'Archive Link':                 [true,  'Add an archive link to the menu.']
    'Monitoring':
      'Thread Updater':               [true,  'Fetch and insert new replies. Has more options in its own dialog.']
      'Unread Count':                 [true,  'Show the unread posts count in the tab title.']
      'Unread Tab Icon':              [true,  'Show a different favicon when there are unread posts.']
      'Thread Excerpt':               [true,  'Show an excerpt of the thread in the tab title.']
      'Thread Stats':                 [true,  'Display reply and image count.']
      'Thread Watcher':               [true,  'Bookmark threads.']
      'Auto Watch':                   [true,  'Automatically watch threads you start.']
      'Auto Watch Reply':             [false, 'Automatically watch threads you reply to.']
    'Posting':
      'Quick Reply':                  [true,  'Weapon of mass destruction.']
      'Persistent QR':                [false, 'The Quick reply won\'t disappear after posting.']
      'Auto Hide QR':                 [false, 'Automatically hide the quick reply when posting.']
      'Remember Subject':             [false, 'Remember the subject field, instead of resetting after posting.']
      'Remember Spoiler':             [false, 'Remember the spoiler state, instead of resetting after posting.']
      'Hide Original Post Form':      [true,  'Hide the normal post form.']
    'Quote links':
      'Quote Backlinks':              [true,  'Add quote backlinks.']
      'OP Backlinks':                 [false, 'Add backlinks to the OP.']
      'Quote Inlining':               [true,  'Inline quoted post on click.']
      'Forward Hiding':               [true,  'Hide original posts of inlined backlinks.']
      'Quote Previewing':             [true,  'Show quoted post on hover.']
      'Quote Highlighting':           [true,  'Highlight the previewed post.']
      'Resurrect Quotes':             [true,  'Link dead quotes to the archives.']
      'Mark OP Quotes':               [true,  'Add \'(OP)\' to OP quotes.']
      'Mark Cross-thread Quotes':     [true,  'Add \'(Cross-thread)\' to cross-threads quotes.']
  imageExpansion:
    'Fit width':        [true,  null]
    'Fit height':       [false, null]
    'Expand spoilers':  [true,  'Expand all images along with spoilers.']
    'Expand from here': [true,  'Expand all images only from current position to thread end.']
  filter:
    name: [
      '# Filter any namefags:'
      '#/^(?!Anonymous$)/'
    ].join '\n'
    uniqueID: [
      '# Filter a specific ID:'
      '#/Txhvk1Tl/'
    ].join '\n'
    tripcode: [
      '# Filter any tripfag'
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
    MD5: [
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
    '#//archive.foolz.us/_/search/image/%MD5/;text:View same on foolz'
    '#//archive.foolz.us/%board/search/image/%MD5/;text:View same on foolz /%board/'
    '#//archive.installgentoo.net/%board/image/%MD5;text:View same on installgentoo /%board/'
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M:%S'
  backlink: '>>%id'
  fileInfo: '%l (%p%s, %r)'
  favicon: 'ferongr'
  hotkeys:
    # QR & Options
    'Open empty QR':      ['q',       'Open QR without post number inserted.']
    'Open QR':            ['Shift+q', 'Open QR with post number inserted.']
    'Open settings':      ['Alt+o',   'Open Settings.']
    'Close':              ['Esc',     'Close Settings, Notifications or QR.']
    'Spoiler tags':       ['Ctrl+s',  'Insert spoiler tags.']
    'Code tags':          ['Alt+c',   'Insert code tags.']
    'Math tags':          ['Alt+m',   'Insert math tags.']
    'Submit QR':          ['Alt+s',   'Submit post.']
    # Thread related
    'Watch':              ['w',       'Watch thread.']
    'Update':             ['u',       'Update the thread now.']
    # Images
    'Expand image':       ['Shift+e', 'Expand selected image.']
    'Expand images':      ['e',       'Expand all images.']
    # Board Navigation
    'Front page':         ['0',       'Jump to page 0.']
    'Open front page':    ['Shift+0', 'Open page 0 in a new tab.']
    'Next page':          ['Right',   'Jump to the next page.']
    'Previous page':      ['Left',    'Jump to the previous page.']
    # Thread Navigation
    'Next thread':        ['Down',    'See next thread.']
    'Previous thread':    ['Up',      'See previous thread.']
    'Expand thread':      ['Ctrl+e',  'Expand thread.']
    'Open thread':        ['o',       'Open thread in current tab.']
    'Open thread tab':    ['Shift+o', 'Open thread in new tab.']
    # Reply Navigation
    'Next reply':         ['j',       'Select next reply.']
    'Previous reply':     ['k',       'Select previous reply.']
    'Hide':               ['x',       'Hide thread.']
  updater:
    checkbox:
      'Beep':          [false, 'Beep on new post to completely read thread.']
      'Auto Scroll':   [false, 'Scroll updated posts into view. Only enabled at bottom of page.']
      'Bottom Scroll': [false, 'Always scroll to the bottom, not the first new post. Useful for event threads.']
      'Scroll BG':     [false, 'Auto-scroll background tabs.']
      'Auto Update':   [true,  'Automatically fetch new posts.']
    'Interval': 30
