Config =
  main:
    'Miscellaneous':
      'Enable 4chan\'s Extension':    [false, 'Compatibility between <%= meta.name %> and 4chan\'s inline extension is NOT guaranteed.']
      'Desktop Notifications':        [true,  'Enables desktop notifications across various <%= meta.name %> features.']
      'Announcement Hiding':          [true,  'Add button to hide 4chan announcements.']
      '404 Redirect':                 [true,  'Redirect dead threads and images.']
      'Keybinds':                     [true,  'Bind actions to keyboard shortcuts.']
      'Time Formatting':              [true,  'Localize and format timestamps.']
      'Relative Post Dates':          [false, 'Display dates like "3 minutes ago". Tooltip shows the timestamp.']
      'File Info Formatting':         [true,  'Reformat the file information.']
      'Thread Expansion':             [true,  'Add buttons to expand threads.']
      'Index Navigation':             [false, 'Add buttons to navigate between threads.']
      'Reply Navigation':             [false, 'Add buttons to navigate to top / bottom of thread.']
      'Show Dice Roll':               [true,  'Show dice that were entered into the email field.']
    'Filtering':
      'Anonymize':                    [false, 'Make everyone Anonymous.']
      'Filter':                       [true,  'Self-moderation placebo.']
      'Recursive Hiding':             [true,  'Hide replies of hidden posts, recursively.']
      'Thread Hiding':                [true,  'Add buttons to hide entire threads.']
      'Reply Hiding':                 [true,  'Add buttons to hide single replies.']
      'Stubs':                        [true,  'Show stubs of hidden threads / replies.']
    'Images':
      'Auto-GIF':                     [false, 'Animate GIF thumbnails (disabled on /gif/, /wsg/).']
      'Image Expansion':              [true,  'Expand images inline.']
      'Image Hover':                  [false, 'Show a floating expanded image on hover.']
      'Sauce':                        [true,  'Add sauce links to images.']
      'Reveal Spoilers':              [false, 'Reveal spoiler thumbnails.']
    'Linkification':
      'Linkify':                      [true,  'Convert text links into hyperlinks.']
      'Clean Links':                  [true,  'Remove spoiler and code tags commonly used to bypass blocked links.']
    'Menu':
      'Menu':                         [true,  'Add a drop-down menu to posts.']
      'Report Link':                  [true,  'Add a report link to the menu.']
      'Thread Hiding Link':           [true,  'Add a link to hide entire threads.']
      'Reply Hiding Link':            [true,  'Add a link to hide single replies.']
      'Delete Link':                  [true,  'Add post and image deletion links to the menu.']
      <% if (type === 'crx') { %>
      'Download Link':                [true,  'Add a download with original filename link to the menu.']
      <% } %>
      'Archive Link':                 [true,  'Add an archive link to the menu.']
    'Monitoring':
      'Thread Updater':               [true,  'Fetch and insert new replies. Has more options in its own dialog.']
      'Unread Count':                 [true,  'Show the unread posts count in the tab title.']
      'Hide Unread Count at (0)':     [false, 'Hide the unread posts count when it reaches 0.']
      'Unread Tab Icon':              [true,  'Show a different favicon when there are unread posts.']
      'Unread Line':                  [true,  'Show a line to distinguish read posts from unread ones.']
      'Scroll to Last Read Post':     [true,  'Scroll back to the last read post when reopening a thread.']
      'Thread Excerpt':               [true,  'Show an excerpt of the thread in the tab title.']
      'Thread Stats':                 [true,  'Display reply, image, and page count.']
      'Thread Watcher':               [true,  'Bookmark threads.']
      'Color User IDs':               [true,  'Assign unique colors to user IDs on boards that use them.']
    'Posting':
      'Quick Reply':                  [true,  'All-in-one form to reply, create threads, automate dumping and more.']
      'Persistent QR':                [false, 'The Quick reply won\'t disappear after posting.']
      'Auto-Hide QR':                 [false, 'Automatically hide the quick reply when posting.']
      'Open Post in New Tab':         [true,  'Open new threads or replies to a thread from the index in a new tab.']
      <% if (type === 'userscript') { %>
      'Remember QR Size':             [false, 'Remember the size of the Quick reply.']
      <% } %>
      'Remember Subject':             [false, 'Remember the subject field, instead of resetting after posting.']
      'Remember Spoiler':             [false, 'Remember the spoiler state, instead of resetting after posting.']
      'Hide Original Post Form':      [true,  'Hide the normal post form.']
      'Cooldown':                     [true,  'Indicate the remaining time before posting again.']
      'Cooldown Prediction':          [true,  'Decrease the cooldown time by taking into account upload speed. Disable it if it\'s inaccurate for you.']
      <% if (type === 'crx') { %>
      'Tab to Choose Files First':    [false, 'Tab to the file input before the submit button.']
      <% } %>
    'Quote Links':
      'Quote Backlinks':              [true,  'Add quote backlinks.']
      'OP Backlinks':                 [true,  'Add backlinks to the OP.']
      'Quote Inlining':               [true,  'Inline quoted post on click.']
      'Forward Hiding':               [true,  'Hide original posts of inlined backlinks.']
      'Quote Previewing':             [true,  'Show quoted post on hover.']
      'Quote Highlighting':           [true,  'Highlight the previewed post.']
      'Resurrect Quotes':             [true,  'Link dead quotes to the archives.']
      'Mark Quotes of You':           [true,  'Add \'(You)\' to quotes linking to your posts.']
      'Mark OP Quotes':               [true,  'Add \'(OP)\' to OP quotes.']
      'Mark Cross-thread Quotes':     [true,  'Add \'(Cross-thread)\' to cross-threads quotes.']
  imageExpansion:
    'Fit width':        [true,  '']
    'Fit height':       [false, '']
    'Expand spoilers':  [false, 'Expand all images along with spoilers.']
    'Expand from here': [true,  'Expand all images only from current position to thread end.']
  threadWatcher:
    'Current Board':    [false, 'Only show watched threads from the current board.']
    'Auto Watch':       [true,  'Automatically watch threads you start.']
    'Auto Watch Reply': [false, 'Automatically watch threads you reply to.']
    'Auto Prune':       [false, 'Automatically prune 404\'d threads.']
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
      #/what you're refer+ing to as linux/i;boards:g
    """
    flag: ""
    filename: ""
    dimensions: """
      # Highlight potential wallpapers:
      #/1920x1080/;op:yes;highlight;top:no;boards:w,wg
    """
    filesize: ""
    MD5: ""
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
  Index:
    'Index Mode': 'paged'
    'Index Sort': 'bump'
    'Show Replies': true
    'Anchor Hidden Threads': true
  Header:
    'Header auto-hide':           false
    'Header auto-hide on scroll': false
    'Bottom header':              false
    'Header catalog links':       false
    'Top Board List':             false
    'Bottom Board List':          false
    'Custom Board Navigation':    true
  QR:
    'QR.personas': """
      #email:"sage";boards:jp;always
      email:"sage"
    """
  boardnav: '[current-title / toggle-all]'
  time: '%m/%d/%y(%a)%H:%M:%S'
  backlink: '>>%id'
  fileInfo: '%l (%p%s, %r)'
  favicon: 'ferongr'
  usercss: ''
  hotkeys:
    # Header, QR & Options
    'Toggle board list':  ['Ctrl+b',     'Toggle the full board list.']
    'Open empty QR':      ['q',          'Open QR without post number inserted.']
    'Open QR':            ['Shift+q',    'Open QR with post number inserted.']
    'Open settings':      ['Alt+o',      'Open Settings.']
    'Close':              ['Esc',        'Close Settings, Notifications or QR.']
    'Spoiler tags':       ['Ctrl+s',     'Insert spoiler tags.']
    'Code tags':          ['Alt+c',      'Insert code tags.']
    'Eqn tags':           ['Alt+e',      'Insert eqn tags.']
    'Math tags':          ['Alt+m',      'Insert math tags.']
    'Submit QR':          ['Alt+s',      'Submit post.']
    # Index/Thread related
    'Update':             ['r',          'Refresh the index/thread.']
    'Watch':              ['w',          'Watch thread.']
    # Images
    'Expand image':       ['Shift+e',    'Expand selected image.']
    'Expand images':      ['e',          'Expand all images.']
    # Board Navigation
    'Front page':         ['0',          'Jump to page 0.']
    'Open front page':    ['Shift+0',    'Open page 0 in a new tab.']
    'Next page':          ['Right',      'Jump to the next page.']
    'Previous page':      ['Left',       'Jump to the previous page.']
    'Search form':        ['Ctrl+Alt+s', 'Focus the search field on the board index.']
    # Thread Navigation
    'Next thread':        ['Down',       'See next thread.']
    'Previous thread':    ['Up',         'See previous thread.']
    'Expand thread':      ['Ctrl+e',     'Expand thread.']
    'Open thread':        ['o',          'Open thread in current tab.']
    'Open thread tab':    ['Shift+o',    'Open thread in new tab.']
    # Reply Navigation
    'Next reply':         ['j',          'Select next reply.']
    'Previous reply':     ['k',          'Select previous reply.']
    'Deselect reply':     ['Shift+d',    'Deselect reply.']
    'Hide':               ['x',          'Hide thread.']
  updater:
    checkbox:
      'Beep':          [false, 'Beep on new post to completely read thread.']
      'Auto Scroll':   [false, 'Scroll updated posts into view. Only enabled at bottom of page.']
      'Bottom Scroll': [false, 'Always scroll to the bottom, not the first new post. Useful for event threads.']
      'Scroll BG':     [false, 'Auto-scroll background tabs.']
      'Auto Update':   [true,  'Automatically fetch new posts.']
    'Interval': 30
