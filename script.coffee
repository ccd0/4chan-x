Config =
  main:
    Enhancing:
      '404 Redirect':                 [true,  'Redirect dead threads and images.']
      'Keybinds':                     [true,  'Bind actions to keyboard shortcuts.']
      'Time Formatting':              [true,  'Localize and format timestamps arbitrarily.']
      'File Info Formatting':         [true,  'Reformat the file information.']
      'Comment Expansion':            [true,  'Can expand too long comments.']
      'Thread Expansion':             [true,  'Can expand threads to view all replies.']
      'Index Navigation':             [false, 'Navigate to previous / next thread.']
      'Reply Navigation':             [false, 'Navigate to top / bottom of thread.']
      'Check for Updates':            [true,  'Check for updated versions of 4chan X.']
    Filtering:
      'Anonymize':                    [false, 'Turn everyone Anonymous.']
      'Filter':                       [true,  'Self-moderation placebo.']
      'Recursive Filtering':          [true,  'Filter replies of filtered posts, recursively.']
      'Reply Hiding':                 [true,  'Hide single replies.']
      'Thread Hiding':                [true,  'Hide entire threads.']
      'Stubs':                        [true,  'Make stubs of hidden threads / replies.']
    Imaging:
      'Image Auto-Gif':               [false, 'Animate GIF thumbnails.']
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
      'Indicate OP quote':            [true,  'Add \'(OP)\' to OP quotes.']
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
    '#http://archive.foolz.us/search/image/$3/;text:View same on foolz'
    '#http://archive.foolz.us/$4/search/image/$3/;text:View same on foolz /$4/'
    '#https://archive.installgentoo.net/$4/image/$3;text:View same on installgentoo /$4/'
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M'
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

# Opera doesn't support the @match metadata key,
# return 4chan X here if we're not on 4chan.
return unless /^(boards|images|sys)\.4chan\.org$/.test location.hostname

Conf = {}
d = document
g =
  VERSION:   '3.0.0'
  NAMESPACE: '4chan_X.'
  boards:  {}
  threads: {}
  posts:   {}

UI =
  dialog: (id, position, html) ->
    el = d.createElement 'div'
    el.className = 'reply dialog'
    el.innerHTML = html
    el.id        = id
    el.style.cssText = localStorage.getItem("#{g.NAMESPACE}#{id}.position") or position
    el.querySelector('.move').addEventListener 'mousedown', UI.dragstart, false
    el
  dragstart: (e) ->
    # prevent text selection
    e.preventDefault()
    UI.el = el = @parentNode
    d.addEventListener 'mousemove', UI.drag,    false
    d.addEventListener 'mouseup',   UI.dragend, false
    # distance from pointer to el edge is constant; calculate it here.
    rect      = el.getBoundingClientRect()
    UI.dx     = e.clientX - rect.left
    UI.dy     = e.clientY - rect.top
    UI.width  = d.documentElement.clientWidth  - rect.width
    UI.height = d.documentElement.clientHeight - rect.height
  drag: (e) ->
    left = e.clientX - UI.dx
    top  = e.clientY - UI.dy
    left =
      if left < 10 then '0px'
      else if UI.width - left < 10 then null
      else left + 'px'
    top =
      if top < 10 then '0px'
      else if UI.height - top < 10 then null
      else top + 'px'
    {style} = UI.el
    style.left   = left
    style.top    = top
    style.right  = if left then null else '0px'
    style.bottom = if top  then null else '0px'
  dragend: ->
    localStorage.setItem "#{g.NAMESPACE}#{UI.el.id}.position", UI.el.style.cssText
    d.removeEventListener 'mousemove', UI.drag,    false
    d.removeEventListener 'mouseup',   UI.dragend, false
    delete UI.el
  hover: (e) ->
    {clientX, clientY} = e
    {style} = UI.el
    {clientHeight, clientWidth} = d.documentElement
    height = UI.el.offsetHeight

    top = clientY - 120
    style.top =
      if clientHeight <= height or top <= 0
        '0px'
      else if top + height >= clientHeight
        clientHeight - height + 'px'
      else
        top + 'px'

    if clientX <= clientWidth - 400
      style.left  = clientX + 45 + 'px'
      style.right = null
    else
      style.left  = null
      style.right = clientWidth - clientX + 45 + 'px'
  hoverend: ->
    $.rm UI.el
    delete UI.el

###
loosely follows the jquery api:
http://api.jquery.com/
not chainable
###
$ = (selector, root=d.body) ->
  root.querySelector selector
$$ = (selector, root=d.body) ->
  Array::slice.call root.querySelectorAll selector

$.extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  return

$.extend $,
  SECOND: 1000
  MINUTE: 1000 * 60
  HOUR  : 1000 * 60 * 60
  DAY   : 1000 * 60 * 60 * 24
  log: console.log.bind console
  engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase()
  id: (id) ->
    d.getElementById id
  ready: (fc) ->
    if /interactive|complete/.test d.readyState
      $.queueTask fc
      return
    cb = ->
      $.off d, 'DOMContentLoaded', cb
      fc()
    $.on d, 'DOMContentLoaded', cb
  sync: (key, cb) ->
    $.on window, 'storage', (e) ->
      if e.key is "#{g.NAMESPACE}#{key}"
        cb JSON.parse e.newValue
  formData: (form) ->
    if form instanceof HTMLFormElement
      return new FormData form
    fd = new FormData()
    for key, val of form
      fd.append key, val if val
    fd
  ajax: (url, callbacks, opts={}) ->
    {type, headers, upCallbacks, form} = opts
    r = new XMLHttpRequest()
    type or= form and 'post' or 'get'
    r.open type, url, true
    for key, val of headers
      r.setRequestHeader key, val
    $.extend r, callbacks
    $.extend r.upload, upCallbacks
    r.send form
    r
  cache: (url, cb) ->
    reqs = $.cache.requests or= {}
    if req = reqs[url]
      if req.readyState is 4
        cb.call req
      else
        req.callbacks.push cb
      return
    req = $.ajax url,
      onload:  ->
        cb.call @ for cb in @callbacks
        return
      onabort: -> delete reqs[url]
      onerror: -> delete reqs[url]
    req.callbacks = [cb]
    reqs[url] = req
  cb:
    checked: ->
      $.set @name, @checked
      Conf[@name] = @checked
    value: ->
      $.set @name, @value.trim()
      Conf[@name] = @value
  addStyle: (css) ->
    style = $.el 'style',
      textContent: css
    $.add d.head, style
    style
  x: (path, root=d.body) ->
    # XPathResult.ANY_UNORDERED_NODE_TYPE === 8
    d.evaluate(path, root, null, 8, null).singleNodeValue
  addClass: (el, className) ->
    el.classList.add className
  rmClass: (el, className) ->
    el.classList.remove className
  hasClass: (el, className) ->
    el.classList.contains className
  rm: (el) ->
    el.parentNode.removeChild el
  tn: (s) ->
    d.createTextNode s
  nodes: (nodes) ->
    # In (at least) Chrome, elements created inside different
    # scripts/window contexts inherit from unequal prototypes.
    # window_context1.Node !== window_context2.Node
    unless nodes instanceof Array
      return nodes
    frag = d.createDocumentFragment()
    for node in nodes
      frag.appendChild node
    frag
  add: (parent, el) ->
    parent.appendChild $.nodes el
  prepend: (parent, el) ->
    parent.insertBefore $.nodes(el), parent.firstChild
  after: (root, el) ->
    root.parentNode.insertBefore $.nodes(el), root.nextSibling
  before: (root, el) ->
    root.parentNode.insertBefore $.nodes(el), root
  replace: (root, el) ->
    root.parentNode.replaceChild $.nodes(el), root
  el: (tag, properties) ->
    el = d.createElement tag
    $.extend el, properties if properties
    el
  on: (el, events, handler) ->
    for event in events.split ' '
      el.addEventListener event, handler, false
    return
  off: (el, events, handler) ->
    for event in events.split ' '
      el.removeEventListener event, handler, false
    return
  open: (url) ->
    (GM_openInTab or window.open) url, '_blank'
  queueTask:
    # inspired by https://www.w3.org/Bugs/Public/show_bug.cgi?id=15007
    (->
      taskQueue = []
      execTask = ->
        task = taskQueue.shift()
        func = task[0]
        args = Array::slice.call task, 1
        func.apply func, args
      if window.MessageChannel
        taskChannel = new MessageChannel()
        taskChannel.port1.onmessage = execTask
        ->
          taskQueue.push arguments
          taskChannel.port2.postMessage null
      else # XXX Firefox
        ->
          taskQueue.push arguments
          setTimeout execTask, 0
    )()
  globalEval: (code) ->
    script = $.el 'script',
      textContent: code
    $.add d.head, script
    $.rm script
  # http://mths.be/unsafewindow
  unsafeWindow:
    if window.opera # Opera
      window
    else if unsafeWindow isnt window # Firefox
      unsafeWindow
    else # Chrome
      (->
        p = d.createElement 'p'
        p.setAttribute 'onclick', 'return window'
        p.onclick()
      )()
  shortenFilename: (filename, isOP) ->
    # FILENAME SHORTENING SCIENCE:
    # OPs have a +10 characters threshold.
    # The file extension is not taken into account.
    threshold = if isOP then 40 else 30
    if filename.length - 4 > threshold
      "#{filename[...threshold - 5]}(...).#{filename.match(/\w+$/)}"
    else
      filename
  bytesToString: (size) ->
    unit = 0 # Bytes
    while size >= 1024
      size /= 1024
      unit++
    # Remove trailing 0s.
    size =
      if unit > 1
        # Keep the size as a float if the size is greater than 2^20 B.
        # Round to hundredth.
        Math.round(size * 100) / 100
      else
        # Round to an integer otherwise.
        Math.round size
    "#{size} #{['B', 'KB', 'MB', 'GB'][unit]}"

$.extend $,
  if GM_deleteValue?
    delete: (name) ->
      GM_deleteValue g.NAMESPACE + name
    get: (name, defaultValue) ->
      if value = GM_getValue g.NAMESPACE + name
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      name  = g.NAMESPACE + name
      value = JSON.stringify value
      # for `storage` events
      localStorage.setItem name, value
      GM_setValue name, value
  else if window.opera
    delete: (name)->
      delete opera.scriptStorage[g.NAMESPACE + name]
    get: (name, defaultValue) ->
      if value = opera.scriptStorage[g.NAMESPACE + name]
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      name  = g.NAMESPACE + name
      value = JSON.stringify value
      # for `storage` events
      localStorage.setItem name, value
      opera.scriptStorage[name] = value
  else
    delete: (name) ->
      localStorage.removeItem g.NAMESPACE + name
    get: (name, defaultValue) ->
      if value = localStorage.getItem g.NAMESPACE + name
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      localStorage.setItem g.NAMESPACE + name, JSON.stringify value


class Board
  toString: -> @ID

  constructor: (@ID) ->
    @threads = {}
    @posts   = {}

    g.boards[@] = @

class Thread
  callbacks: []
  toString: -> @ID

  constructor: (ID, @board) ->
    @ID = +ID
    @posts = {}

    # XXX Can't check when parsing single posts
    #     move to Post constructor? unless @isReply
    # postInfo  = $ '.postInfo', root.firstElementChild
    # @isClosed = !!$ 'img[title=Closed]', postInfo
    # @isSticky = !!$ 'img[title=Sticky]', postInfo

    g.threads["#{board}.#{@}"] = board.threads[@] = @

class Post
  callbacks: []
  toString: -> @ID

  constructor: (root, @thread, @board) ->
    @ID = +root.id[2..]

    post = $ '.post',     root
    info = $ '.postInfo', post
    @nodes =
      root: root
      post: post
      info: info
      comment: $ '.postMessage', post
      quotelinks: []
      backlinks: info.getElementsByClassName 'backlink'

    @info = {}
    if subject        = $ '.subject',     info
      @nodes.subject  = subject
      @info.subject   = subject.textContent
    if name           = $ '.name',        info
      @nodes.name     = name
      @info.name      = name.textContent
    if email          = $ '.useremail',   info
      @nodes.email    = email
      @info.email     = decodeURIComponent email.href[7..]
    if tripcode       = $ '.postertrip',  info
      @nodes.tripcode = tripcode
      @info.tripcode  = tripcode.textContent
    if uniqueID       = $ '.posteruid',   info
      @nodes.uniqueID = uniqueID
      @info.uniqueID  = uniqueID.textContent
    if capcode        = $ '.capcode',     info
      @nodes.capcode  = capcode
      @info.capcode   = capcode.textContent
    if flag           = $ '.countryFlag', info
      @nodes.flag     = flag
      @info.flag      = flag.title
    if date           = $ '.dateTime',    info
      @nodes.date     = date
      @info.date      = new Date date.dataset.utc * 1000

    # Get the comment's text.
    # <br> -> \n
    # Remove:
    #   'Comment too long'...
    #   Admin/Mod/Dev replies. (/q/)
    #   EXIF data. (/p/)
    #   Rolls. (/tg/)
    #   Preceding and following new lines.
    #   Trailing spaces.
    bq = @nodes.comment.cloneNode true
    for node in $$ '.abbr, .capcodeReplies, .exif, b', bq
      $.rm node
    text = []
    # XPathResult.ORDERED_NODE_SNAPSHOT_TYPE === 7
    nodes = d.evaluate './/br|.//text()', bq, null, 7, null
    for i in [0...nodes.snapshotLength]
      text.push if data = nodes.snapshotItem(i).data then data else '\n'
    @info.comment = text.join('').replace /^\n+|\n+$| +(?=\n|$)/g, ''

    quotes = {}
    for quotelink in $$ '.quotelink', @nodes.comment
      # Don't add board links. (>>>/b/)
      # Don't add text-board quotelinks. (>>>/img/1234)
      # Don't count capcode replies as quotes. (Admin/Mod/Dev Replies: ...)
      # Only add quotes that link to posts on an imageboard.
      if quotelink.hash
        @nodes.quotelinks.push quotelink
        continue if quotelink.parentNode.parentNode.className is 'capcodeReplies'
        quotes["#{quotelink.pathname.split('/')[1]}.#{quotelink.hash[2..]}"] = true
    @quotes = Object.keys quotes

    if (file = $ '.file', post) and thumb = $ 'img[data-md5]', file
      # Supports JPG/PNG/GIF/PDF.
      # Flash files are not supported.
      alt    = thumb.alt
      anchor = thumb.parentNode
      @file  =
        info:  $ '.fileInfo', file
        text:  $ '.fileText', file
        thumb: thumb
        URL:   anchor.href
        MD5:   thumb.dataset.md5
        size:  alt.match(/\d+(\.\d+)?\s\w+$/)[0]
        isSpoiler: $.hasClass anchor, 'imgspoiler'
      @file.thumbURL = "#{location.protocol}//thumbs.4chan.org/#{board}/thumb/#{@file.URL.match(/(\d+)\./)[1]}s.jpg"
      @file.name = $('span[title]', @file.info).title
      if @file.isImage = /(jpg|png|gif|svg)$/i.test @file.name # I want to believe.
        @file.dimensions = @file.text.textContent.match(/\d+x\d+/)[0]

    @isReply = $.hasClass post, 'reply'
    @clones  = []
    g.posts["#{board}.#{@}"] = thread.posts[@] = board.posts[@] = @

  addClone: ->
    new Clone @
  rmClone: (index) ->
    @clones.splice index, 1
    for i in [index...@clones.length]
      @clones[i].nodes.root.setAttribute 'data-clone', i
    return

class Clone extends Post
  constructor: (@origin) ->
    for key in ['ID', 'board', 'thread', 'info', 'quotes', 'isReply']
      # Copy or point to the origin's key value.
      @[key] = origin[key]

    {nodes} = origin
    root = nodes.root.cloneNode true
    post = $ '.post',     root
    info = $ '.postInfo', post
    @nodes =
      root: root
      post: post
      info: info
      comment: $ '.postMessage', post
      quotelinks: []
      backlinks: info.getElementsByClassName 'backlink'

    # Remove inlined posts inside of this post.
    for inline  in $$ '.inline',  post
      $.rm inline
    for inlined in $$ '.inlined', post
      $.rmClass inlined, 'inlined'

    # root.hidden = false # post hiding
    $.rmClass root, 'forwarded' # quote inlining
    # $.rmClass post, 'highlight' # keybind navigation

    if nodes.subject
      @nodes.subject  = $ '.subject',     info
    if nodes.name
      @nodes.name     = $ '.name',        info
    if nodes.email
      @nodes.email    = $ '.useremail',   info
    if nodes.tripcode
      @nodes.tripcode = $ '.postertrip',  info
    if nodes.uniqueID
      @nodes.uniqueID = $ '.posteruid',   info
    if nodes.capcode
      @nodes.capcode  = $ '.capcode',     info
    if nodes.flag
      @nodes.flag     = $ '.countryFlag', info
    if nodes.date
      @nodes.date     = $ '.dateTime',    info

    for quotelink in $$ '.quotelink', @nodes.comment
      # See comments in Post's constructor.
      if quotelink.hash or $.hasClass quotelink, 'deadlink'
        @nodes.quotelinks.push quotelink

    if origin.file
      # Copy values, point to relevant elements.
      # See comments in Post's constructor.
      @file = {}
      for key, val of origin.file
        @file[key] = val
      file = $ '.file', post
      @file.info  = $ '.fileInfo',     file
      @file.text  = $ '.fileText',     file
      @file.thumb = $ 'img[data-md5]', file

    @isClone = true
    index = origin.clones.push(@) - 1
    root.setAttribute 'data-clone', index


Main =
  init: ->
    # flatten Config into Conf
    # and get saved or default values
    flatten = (parent, obj) ->
      if obj instanceof Array
        Conf[parent] = obj[0]
      else if typeof obj is 'object'
        for key, val of obj
          flatten key, val
      else # string or number
        Conf[parent] = obj
      return
    flatten null, Config
    for key, val of Conf
      Conf[key] = $.get key, val

    pathname = location.pathname.split '/'
    g.BOARD  = new Board pathname[1]
    if g.REPLY = pathname[2] is 'res'
      g.THREAD = +pathname[3]

    switch location.hostname
      when 'boards.4chan.org'
        Main.addStyle()
        Main.initHeader()
        Main.initFeatures()
      when 'sys.4chan.org'
        return
      when 'images.4chan.org'
        return

  initHeader: ->
    Main.header = $.el 'div',
      className: 'reply'
      innerHTML: '<div class=extra></div>'
    # disable 4chan's features
    localStorage.setItem '4chan_settings', false
    $.ready Main.initHeaderReady
  initHeaderReady: ->
    return unless $.id 'navtopr'
    header = Main.header
    $.prepend d.body, header

    nav = $.id 'boardNavDesktop'
    header.id = nav.id
    $.prepend header, nav
    nav.id = nav.className = null
    nav.lastElementChild.hidden = true
    settings = $.el 'span',
      id: 'settings'
      innerHTML: '[<a href=javascript:;>Settings</a>]'
    $.on settings.firstElementChild, 'click', Main.settings
    $.add nav, settings
    $("a[href$='/#{g.BOARD}/']", nav)?.className = 'current'

    $.addClass d.body, $.engine
    $.addClass d.body, 'fourchan_x'

    # disable the mobile layout
    $('link[href*=mobile]', d.head)?.disabled = true
    $.id('boardNavDesktopFoot')?.hidden = true

  initFeatures: ->
    if Conf['Resurrect Quotes']
      try
        Quotify.init()
      catch err
        # XXX handle error
        $.log err, 'Resurrect Quotes'

    if Conf['Quote Inline']
      try
        QuoteInline.init()
      catch err
        # XXX handle error
        $.log err, 'Quote Inline'

    if Conf['Quote Preview']
      try
        QuotePreview.init()
      catch err
        # XXX handle error
        $.log err, 'Quote Preview'

    if Conf['Quote Backlinks']
      try
        QuoteBacklink.init()
      catch err
        # XXX handle error
        $.log err, 'Quote Backlinks'

    if Conf['Time Formatting']
      try
        Time.init()
      catch err
        # XXX handle error
        $.log err, 'Time Formatting'

    $.ready Main.initFeaturesReady
  initFeaturesReady: ->
    return unless $.id 'navtopr'

    threads = []
    posts   = []

    for boardChild in $('.board').children
      continue unless $.hasClass boardChild, 'thread'
      thread = new Thread boardChild.id[1..], g.BOARD
      threads.push thread
      for threadChild in boardChild.children
        continue unless $.hasClass threadChild, 'postContainer'
        try
          posts.push new Post threadChild, thread, g.BOARD
        catch err
          # Skip posts that we failed to parse.
          # XXX handle error
          # Post parser crashed for post No.#{threadChild.id[2..]}
          $.log threadChild, err

    Main.callbackNodes Thread, threads, true
    Main.callbackNodes Post,   posts,   true

  callbackNodes: (klass, nodes, notify) ->
    # get the nodes' length only once
    len = nodes.length
    for callback in klass::callbacks
      try
        for i in [0...len]
          callback.cb.call nodes[i]
      catch err
        # XXX handle error if notify
        $.log callback.name, 'crashed. error:', err.message, nodes[i], err
    return

  settings: ->
    alert 'Here be settings'

  addStyle: ->
    $.off d, 'DOMNodeInserted', Main.addStyle
    if d.head
      $.addStyle Main.css
    else
      $.on d, 'DOMNodeInserted', Main.addStyle
  css: """
/* general */
.dialog.reply {
  display: block;
  border: 1px solid rgba(0, 0, 0, .25);
  padding: 0;
}
.move {
  cursor: move;
}
label {
  cursor: pointer;
}
a[href="javascript:;"] {
  text-decoration: none;
}
.warning {
  color: red;
}

/* 4chan style fixes */
.opContainer, .op {
  display: block !important;
}
.post {
  overflow: visible !important;
}

/* header */
body.fourchan_x {
  margin-top: 2.5em;
}
#boardNavDesktop.reply {
  border-width: 0 0 1px;
  padding: 4px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  transition: opacity .1s ease-in-out;
  -o-transition: opacity .1s ease-in-out;
  -moz-transition: opacity .1s ease-in-out;
  -webkit-transition: opacity .1s ease-in-out;
  z-index: 1;
}
#boardNavDesktop.reply:not(:hover) {
  opacity: .4;
  transition: opacity 1.5s .5s ease-in-out;
  -o-transition: opacity 1.5s .5s ease-in-out;
  -moz-transition: opacity 1.5s .5s ease-in-out;
  -webkit-transition: opacity 1.5s .5s ease-in-out;
}
#boardNavDesktop.reply a {
  margin: -1px;
}
#settings {
  float: right;
}

/* quote related */
.inlined {
  opacity: .5;
}
#qp input, .forwarded {
  display: none;
}
.quotelink.forwardlink,
.backlink.forwardlink {
  text-decoration: none;
  border-bottom: 1px dashed;
}
.inline {
  border: 1px solid rgba(128, 128, 128, .5);
  display: table;
  margin: 2px 0;
}
.inline .post {
  border: 0 !important;
  display: table !important;
  margin: 0 !important;
  padding: 1px 2px !important;
}
#qp {
  position: fixed;
  padding: 2px 2px 5px;
}
#qp .post {
  border: none;
  margin: 0;
  padding: 0;
}
#qp img {
  max-height: 300px;
  max-width: 500px;
}
.qphl {
  outline: 2px solid rgba(216, 94, 49, .7);
}
"""



Get =
  postFromRoot: (root) ->
    link   = $ 'a[title="Highlight this post"]', root
    board  = link.pathname.split('/')[1]
    postID = link.hash[2..]
    index  = root.dataset.clone
    post   = g.posts["#{board}.#{postID}"]
    if index then post.clones[index] else post
  postDataFromLink: (link) ->
    if link.host is 'boards.4chan.org'
      path     = link.pathname.split '/'
      board    = path[1]
      threadID = path[3]
      postID   = link.hash[2..]
    # XXX
    # else # quote resurrection
    #   board    = ???
    #   threadID = ???
    #   postID   = ???
    return {
      board:    board
      threadID: threadID
      postID:   postID
    }
  postClone: (board, threadID, postID, root) ->
    if origin = g.posts["#{board}.#{postID}"]
      clone = origin.addClone()
      Main.callbackNodes Post, [clone]
      $.add root, Get.cleanRoot clone
      return

    root.textContent = "Loading post No.#{postID}..."
    if threadID
      $.cache "/#{board}/res/#{threadID}", ->
        Get.parsePost @, board, threadID, postID, root
    # else if url = Redirect.post board, postID
    #   $.cache url, ->
    #     Get.parseArchivedPost @, board, postID, root
  cleanRoot: (clone) ->
    {root, post} = clone.nodes
    for child in Array::slice.call root.childNodes
      $.rm child unless child is post
    root
  parsePost: (req, board, threadID, postID, root) ->
    {status} = req
    if status isnt 200
      # The thread can die by the time we check a quote.
      # XXX
      # if url = Redirect.post board, postID
      #   $.cache url, ->
      #     Get.parseArchivedPost @, board, postID, root
      # else
      $.addClass root, 'warning'
      root.textContent =
        if status is 404
          "Thread No.#{threadID} has not been found."
        else
          "Error #{req.status}: #{req.statusText}."
      return

    doc = d.implementation.createHTMLDocument ''
    doc.documentElement.innerHTML = req.response

    unless pc = doc.getElementById "pc#{postID}"
      # The post can be deleted by the time we check a quote.
      # XXX
      # if url = Redirect.post board, postID
      #   $.cache url, ->
      #     Get.parseArchivedPost @, board, postID, root
      # else
      root.textContent = "Post No.#{postID} has not been found."
      return
    pc = d.importNode pc, true

    for quote in $$ '.quotelink', pc
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote, or board link
      quote.href = "/#{board}/res/#{href}" # Fix pathnames
    link = $ 'a[title="Highlight this post"]', pc
    link.href = "/#{board}/res/#{threadID}#p#{postID}"
    link.nextSibling.href = "/#{board}/res/#{threadID}#q#{postID}"

    inBoard = g.boards[board] or
      new Board board
    inThread = g.threads["#{board}.#{threadID}"] or
      new Thread threadID, inBoard
    post = new Post pc, inThread, inBoard
    Main.callbackNodes Post, [post]

    # Stop here if the container has been removed while loading.
    return unless root.parentNode
    clone = post.addClone()
    Main.callbackNodes Post, [clone]
    $.replace root.firstChild, Get.cleanRoot clone

Quotify =
  init: ->
    Post::callbacks.push
      name: 'Resurrect Quotes'
      cb:   @node
  node: ->
    return if @isClone

    # XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE === 6
    # Get all the text nodes that are not inside an anchor.
    snapshot = d.evaluate './/text()[not(parent::a)]', @nodes.comment, null, 6, null

    for i in [0...snapshot.snapshotLength]
      node = snapshot.snapshotItem i
      data = node.data

      # Only accept nodes with potentially valid links
      continue unless quotes = data.match />>(>\/[a-z\d]+\/)?\d+/g

      nodes = []

      for quote in quotes
        index   = data.indexOf quote
        if text = data[...index]
          # Potential text before this valid quote.
          nodes.push $.tn text

        ID = quote.match(/\d+$/)[0]
        board =
          if m = quote.match /^>>>\/([a-z\d]+)/
            m[1]
          else
            @board.ID

        quoteID = "#{board}.#{ID}"
        if @quotes.indexOf(quoteID) is -1
          @quotes.push quoteID

        a = $.el 'a',
          # \u00A0 is nbsp
          # textContent: "#{quote}\u00A0(Dead)"
          textContent: quote
          # XXX
          className: 'quotelink deadlink'

        # if board is g.BOARD and $.id "p#{ID}"
        #   a.href      = "#p#{ID}"
        #   a.className = 'quotelink'
        # else
        #   a.href      = Redirect.thread board, 0, ID
        #   a.className = 'deadlink'
        #   a.target    = '_blank'
        #   if Redirect.post board, ID
        #     $.addClass a, 'quotelink'
        #     a.setAttribute 'data-board', board
        #     a.setAttribute 'data-id',    ID

        @nodes.quotelinks.push a
        nodes.push a
        data = data[index + quote.length..]

      if data
        # Potential text after the last valid quote.
        nodes.push $.tn data

      $.replace node, nodes
    return

QuoteInline =
  init: ->
    Post::callbacks.push
      name: 'Quote Inline'
      cb:   @node
  node: ->
    for link in @nodes.quotelinks
      $.on link, 'click', QuoteInline.toggle
    for link in @nodes.backlinks
      $.on link, 'click', QuoteInline.toggle
    return
  toggle: (e) ->
    return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
    e.preventDefault()
    {board, threadID, postID} = Get.postDataFromLink @
    if $.hasClass @, 'inlined'
      QuoteInline.rm @, board, threadID, postID
    else
      return if $.x "ancestor::div[@id='p#{postID}']", @
      QuoteInline.add @, board, threadID, postID
    @classList.toggle 'inlined'

  add: (quotelink, board, threadID, postID) ->
    inline = $.el 'div',
      id: "i#{postID}"
      className: 'inline'

    root =
      if isBacklink = $.hasClass quotelink, 'backlink'
        quotelink.parentNode.parentNode
      else
        $.x 'ancestor-or-self::*[parent::blockquote][1]', quotelink
    $.after root, inline
    Get.postClone board, threadID, postID, inline

    return unless board is g.BOARD.ID and $.x "ancestor::div[@id='t#{threadID}']", quotelink
    post = g.posts["#{board}.#{postID}"]

    # Hide forward post if it's a backlink of a post in this thread.
    # Will only unhide if there's no inlined backlinks of it anymore.
    if isBacklink and Conf['Forward Hiding']
      $.addClass post.nodes.root, 'forwarded'
      post.forwarded++ or post.forwarded = 1

    # Decrease the unread count if this post is in the array of unread reply.
    # XXX
    # if (i = Unread.replies.indexOf el) isnt -1
    #   Unread.replies.splice i, 1
    #   Unread.update true

  rm: (quotelink, board, threadID, postID) ->
    # Select the corresponding inlined quote, and remove it.
    root =
      if $.hasClass quotelink, 'backlink'
        quotelink.parentNode.parentNode
      else
        $.x 'ancestor-or-self::*[parent::blockquote][1]', quotelink
    root = $.x "following-sibling::div[@id='i#{postID}'][1]", root
    $.rm root

    # Stop if it only contains text.
    return unless el = root.firstElementChild

    # Dereference clone.
    post = g.posts["#{board}.#{postID}"]
    post.rmClone el.dataset.clone

    inThreadID = $.x('ancestor::div[@class="thread"]', quotelink).id[1..]

    # Decrease forward count and unhide.
    if Conf['Forward Hiding'] and
      board is g.BOARD.ID and
      threadID is inThreadID and
      $.hasClass quotelink, 'backlink'
        unless --post.forwarded
          delete post.forwarded
          $.rmClass post.nodes.root, 'forwarded'

    # Repeat.
    inlines = $$ '.inlined', el
    for inline in inlines
      {board, threadID, postID} = Get.postDataFromLink inline
      root =
        if $.hasClass inline, 'backlink'
          inline.parentNode.parentNode
        else
          $.x 'ancestor-or-self::*[parent::blockquote][1]', inline
      root = $.x "following-sibling::div[@id='i#{postID}'][1]", root
      continue unless el = root.firstElementChild
      post  = g.posts["#{board}.#{postID}"]
      post.rmClone el.dataset.clone

      if Conf['Forward Hiding'] and
        board is g.BOARD.ID and
        threadID is inThreadID and
        $.hasClass inline, 'backlink'
          unless --post.forwarded
            delete post.forwarded
            $.rmClass post.nodes.root, 'forwarded'
    return

QuotePreview =
  init: ->
    Post::callbacks.push
      name: 'Quote Preview'
      cb:   @node
  node: ->
    for link in @nodes.quotelinks
      $.on link, 'mouseover', QuotePreview.mouseover
    for link in @nodes.backlinks
      $.on link, 'mouseover', QuotePreview.mouseover
    return
  mouseover: (e) ->
    return if $.hasClass @, 'inlined'

    # Don't stop other elements from dragging
    return if UI.el

    {board, threadID, postID} = Get.postDataFromLink @

    qp = UI.el = $.el 'div',
      id: 'qp'
      className: 'reply dialog'
    UI.hover e
    Get.postClone board, threadID, postID, qp
    $.add d.body, qp

    $.on @, 'mousemove',      UI.hover
    $.on @, 'mouseout click', QuotePreview.mouseout

    return unless origin = g.posts["#{board}.#{postID}"]

    if Conf['Quote Highlighting']
      posts = [origin].concat origin.clones
      # Remove the clone that's in the qp from the array.
      posts.pop()
      for post in posts
        $.addClass post.nodes.post, 'qphl'

    quoterID = $.x('ancestor::*[@id][1]', @).id.match(/\d+$/)[0]
    clone = Get.postFromRoot qp.firstChild
    for quote in clone.nodes.quotelinks
      if quote.hash[2..] is quoterID
        $.addClass quote, 'forwardlink'
    for quote in clone.nodes.backlinks
      if quote.hash[2..] is quoterID
        $.addClass quote, 'forwardlink'
    return
  mouseout: (e) ->
    root = UI.el.firstElementChild
    UI.hoverend()
    $.off @, 'mousemove',      UI.hover
    $.off @, 'mouseout click', QuotePreview.mouseout

    # Stop if it only contains text.
    return unless root

    clone = Get.postFromRoot root
    post  = clone.origin
    post.rmClone root.dataset.clone

    return unless Conf['Quote Highlighting']
    for post in [post].concat post.clones
      $.rmClass post.nodes.post, 'qphl'
    return

QuoteBacklink =
  # Backlinks appending need to work for:
  #  - previous, same, and following posts.
  #  - existing and yet-to-exist posts.
  #  - newly fetched posts.
  #  - in copies.
  # XXX what about order for fetched posts?
  #
  # First callback creates backlinks and add them to relevant containers.
  # Second callback adds relevant containers into posts.
  # This is is so that fetched posts can get their backlinks,
  # and that as much backlinks are appended in the background as possible.
  init: ->
    format = Conf['backlink'].replace /%id/g, "' + id + '"
    @funk  = Function 'id', "return '#{format}'"
    @containers = {}
    Post::callbacks.push
      name: 'Quote Backlinking Part 1'
      cb:   @firstNode
    Post::callbacks.push
      name: 'Quote Backlinking Part 2'
      cb:   @secondNode
  firstNode: ->
    return if @isClone or !@quotes.length
    a = $.el 'a',
      href: "/#{@board}/res/#{@thread}#p#{@}"
      # XXX className: if post.el.hidden then 'filtered backlink' else 'backlink'
      className: 'backlink'
      textContent: QuoteBacklink.funk @ID
    for quote in @quotes
      containers = [QuoteBacklink.getContainer quote]
      if post = g.posts[quote]
        for clone in post.clones
          containers.push clone.nodes.backlinkContainer
      for container in containers
        link = a.cloneNode true
        if Conf['Quote Preview']
          $.on link, 'mouseover', QuotePreview.mouseover
        if Conf['Quote Inline']
          $.on link, 'click', QuoteInline.toggle
        $.add container, [$.tn(' '), link]
    return
  secondNode: ->
    if @isClone and @origin.nodes.backlinkContainer
      @nodes.backlinkContainer = $ '.container', @nodes.info
      return
    # Don't backlink the OP.
    return unless Conf['OP Backlinks'] or @isReply
    container = QuoteBacklink.getContainer "#{@board}.#{@}"
    @nodes.backlinkContainer = container
    $.add @nodes.info, container
  getContainer: (id) ->
    @containers[id] or=
      $.el 'span', className: 'container'

Time =
  init: ->
    @funk = @createFunc()
    Post::callbacks.push
      name: 'Time Formatting'
      cb:   @node
  node: ->
    return if @isClone
    @nodes.date.textContent = Time.funk Time, @info.date
  createFunc: ->
    code = Conf['time'].replace /%([A-Za-z])/g, (s, c) ->
      if c of Time.formatters
        "' + Time.formatters.#{c}.call(date) + '"
      else
        s
    Function 'Time', 'date', "return '#{code}'"
  day: [
    'Sunday'
    'Monday'
    'Tuesday'
    'Wednesday'
    'Thursday'
    'Friday'
    'Saturday'
  ]
  month: [
    'January'
    'February'
    'March'
    'April'
    'May'
    'June'
    'July'
    'August'
    'September'
    'October'
    'November'
    'December'
  ]
  zeroPad: (n) -> if n < 10 then "0#{n}" else n
  formatters:
    a: -> Time.day[@getDay()][...3]
    A: -> Time.day[@getDay()]
    b: -> Time.month[@getMonth()][...3]
    B: -> Time.month[@getMonth()]
    d: -> Time.zeroPad @getDate()
    e: -> @getDate()
    H: -> Time.zeroPad @getHours()
    I: -> Time.zeroPad @getHours() % 12 or 12
    k: -> @getHours()
    l: -> @getHours() % 12 or 12
    m: -> Time.zeroPad @getMonth() + 1
    M: -> Time.zeroPad @getMinutes()
    p: -> if @getHours() < 12 then 'AM' else 'PM'
    P: -> if @getHours() < 12 then 'am' else 'pm'
    S: -> Time.zeroPad @getSeconds()
    y: -> @getFullYear() - 2000



Main.init()
