Config =
  main:
    Enhancing:
      'Disable 4chan\'s extension':   [true,  'Avoid conflicts between 4chan X and 4chan\'s inline extension.']
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
    'http://iqdb.org/?url=$turl'
    'http://www.google.com/searchbyimage?image_url=$turl'
    '#http://tineye.com/search?url=$turl'
    '#http://saucenao.com/search.php?db=999&url=$turl'
    '#http://3d.iqdb.org/?url=$turl'
    '#http://regex.info/exif.cgi?imgurl=$url'
    '# uploaders:'
    '#http://imgur.com/upload?url=$url;text:Upload to imgur'
    '#http://omploader.org/upload?url1=$url;text:Upload to omploader'
    '# "View Same" in archives:'
    '#http://archive.foolz.us/_/search/image/$md5/;text:View same on foolz'
    '#http://archive.foolz.us/$board/search/image/$md5/;text:View same on foolz /$board/'
    '#https://archive.installgentoo.net/$board/image/$md5;text:View same on installgentoo /$board/'
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
  cache: (->
    reqs = {}
    (url, cb) ->
      if req = reqs[url]
        if req.readyState is 4
          cb.call req
        else
          req.callbacks.push cb
        return
      req = $.ajax url,
        onload:  ->
          cb.call @ for cb in @callbacks
          delete @callbacks
        onabort: -> delete reqs[url]
        onerror: -> delete reqs[url]
      req.callbacks = [cb]
      reqs[url] = req
  )()
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
    # XXX Only Chrome has no d.head on document-start.
    $.add d.head or d.documentElement, style
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
  queueTask: (->
    # inspired by https://www.w3.org/Bugs/Public/show_bug.cgi?id=15007
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

  constructor: (root, @thread, @board, that={}) ->
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
        isSpoiler: $.hasClass anchor, 'imgspoiler'
      size = +alt.match(/\d+(\.\d+)?/)[0]
      unit = ['B', 'KB', 'MB', 'GB'].indexOf alt.match(/\w+$/)[0]
      while unit--
        size *= 1024
      @file.size = size
      @file.thumbURL =
        if that.isArchived
          thumb.src
        else
          "#{location.protocol}//thumbs.4chan.org/#{board}/thumb/#{@file.URL.match(/(\d+)\./)[1]}s.jpg"
      # replace %22 with quotes, see:
      # crbug.com/81193
      # webk.it/62107
      # https://www.w3.org/Bugs/Public/show_bug.cgi?id=16909
      # http://www.whatwg.org/specs/web-apps/current-work/#multipart-form-data
      @file.name = $('span[title]', @file.info).title.replace /%22/g, '"'
      if @file.isImage = /(jpg|png|gif)$/i.test @file.name
        @file.dimensions = @file.text.textContent.match(/\d+x\d+/)[0]

    @isReply = $.hasClass post, 'reply'
    @clones  = []
    g.posts["#{board}.#{@}"] = thread.posts[@] = board.posts[@] = @
    @kill() if that.isArchived

  kill: (img) ->
    if @file and !@file.isDead
      @file.isDead = true
    return if img
    @isDead = true
    $.addClass @nodes.root, 'dead'
    # XXX style dead posts.

    # Get quote/backlinks to this post,
    # and paint them (Dead).
    # First:
    #   In every posts,
    #   if it did quote this post,
    #   get all their backlinks.
    # Second:
    #   If we have quote backlinks,
    #   in all posts this post quoted,
    #   and their clones,
    #   get all of their backlinks.
    # Third:
    #   In all collected links,
    #   apply (Dead) if relevant.
    quotelinks = []
    num = "#{@board}.#{@}"
    for ID, post of g.posts
      if -1 < post.quotes.indexOf num
        for post in [post].concat post.clones
          quotelinks.push.apply quotelinks, post.nodes.quotelinks
    if Conf['Quote Backlinks']
      for quote in @quotes
        post = g.posts[quote]
        for post in [post].concat post.clones
          quotelinks.push.apply quotelinks, Array::slice.call post.nodes.backlinks
    for quotelink in quotelinks
      continue if $.hasClass quotelink, 'deadlink'
      {board, postID} = Get.postDataFromLink quotelink
      if board is @board.ID postID is @ID
        $.add quotelink, $.tn '\u00A0(Dead)'
        $.addClass quotelinks, 'deadlink'
    return
  addClone: (context) ->
    new Clone @, context
  rmClone: (index) ->
    @clones.splice index, 1
    for i in [index...@clones.length]
      @clones[i].nodes.root.setAttribute 'data-clone', i
    return

class Clone extends Post
  constructor: (@origin, @context) ->
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

    @isDead  = true if origin.isDead
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
        Main.initHeader()
        Main.initFeatures()
      when 'sys.4chan.org'
        return
      when 'images.4chan.org'
        $.ready ->
          if Conf['404 Redirect'] and d.title is '4chan - 404 Not Found'
            path = location.pathname.split '/'
            url  = Redirect.image path[1], path[3]
            location.href = url if url
        return

  initHeader: ->
    $.addStyle Main.css
    Main.header = $.el 'div',
      className: 'reply'
      innerHTML: '<div class=extra></div>'
    $.ready Main.initHeaderReady
  initHeaderReady: ->
    header = Main.header
    $.prepend d.body, header

    if nav = $.id 'boardNavDesktop'
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
    if Conf['Disable 4chan\'s extension']
      localStorage.setItem '4chan-settings', '{"disableAll":true}'

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

    if Conf['Indicate OP Quotes']
      try
        QuoteOP.init()
      catch err
        # XXX handle error
        $.log err, 'Indicate OP Quotes'

    if Conf['Indicate Cross-thread Quotes']
      try
        QuoteCT.init()
      catch err
        # XXX handle error
        $.log err, 'Indicate Cross-thread Quotes'

    if Conf['Time Formatting']
      try
        Time.init()
      catch err
        # XXX handle error
        $.log err, 'Time Formatting'

    if Conf['File Info Formatting']
      try
        FileInfo.init()
      catch err
        # XXX handle error
        $.log err, 'File Info Formatting'

    if Conf['Sauce']
      try
        Sauce.init()
      catch err
        # XXX handle error
        $.log err, 'Sauce'

    if Conf['Reveal Spoilers']
      try
        RevealSpoilers.init()
      catch err
        # XXX handle error
        $.log err, 'Reveal Spoilers'

    if Conf['Auto-GIF']
      try
        AutoGIF.init()
      catch err
        # XXX handle error
        $.log err, 'Auto-GIF'

    if Conf['Image Hover']
      try
        ImageHover.init()
      catch err
        # XXX handle error
        $.log err, 'Image Hover'

    if Conf['Thread Updater']
      try
        ThreadUpdater.init()
      catch err
        # XXX handle error
        $.log err, 'Thread Updater'

    $.ready Main.initFeaturesReady
  initFeaturesReady: ->
    if d.title is '4chan - 404 Not Found'
      if Conf['404 Redirect'] and g.REPLY
        location.href = Redirect.thread g.BOARD, g.THREAD, location.hash
      return

    return unless $.id 'navtopright'

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

/* fixed, z-index */
#qp, #ihover,
#updater, #stats,
#boardNavDesktop.reply,
#qr, #watcher {
  position: fixed;
}
#qp, #ihover {
  z-index: 100;
}
#updater, #stats {
  z-index: 90;
}
#boardNavDesktop.reply:hover {
  z-index: 80;
}
#qr {
  z-index: 50;
}
#watcher {
  z-index: 30;
}
#boardNavDesktop.reply {
  z-index: 10;
}


/* header */
body.fourchan_x {
  margin-top: 2.5em;
}
#boardNavDesktop.reply {
  border-width: 0 0 1px;
  padding: 4px;
  top: 0;
  right: 0;
  left: 0;
  transition: opacity .1s ease-in-out;
  -o-transition: opacity .1s ease-in-out;
  -moz-transition: opacity .1s ease-in-out;
  -webkit-transition: opacity .1s ease-in-out;
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

/* thread updater */
#updater {
  text-align: right;
}
#updater:not(:hover) {
  background: none;
  border: none;
}
#updater input[type=number] {
  width: 4em;
}
#updater:not(:hover) > div:not(.move) {
  display: none;
}
.new {
  color: limegreen;
}

/* quote */
.quotelink.deadlink {
  text-decoration: underline !important;
}
.deadlink:not(.quotelink) {
  text-decoration: none !important;
}
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

/* file */
.fileText:hover .fntrunc,
.fileText:not(:hover) .fnfull {
  display: none;
}
#ihover {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  max-height: 100%;
  max-width: 75%;
  padding-bottom: 16px;
}
"""



Redirect =
  image: (board, filename) ->
    # Do not use g.BOARD, the image url can originate from a cross-quote.
    switch board
      when 'a', 'co', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'wsg'
        "//archive.foolz.us/#{board}/full_image/#{filename}"
      when 'u'
        "//nsfw.foolz.us/#{board}/full_image/#{filename}"
      when 'ck', 'lit'
        "//fuuka.warosu.org/#{board}/full_image/#{filename}"
      # when 'diy', 'sci'
      #   "//archive.installgentoo.net/#{board}/full_image/#{filename}"
      when 'cgl', 'g', 'mu', 'soc', 'w'
        "//archive.rebeccablacktech.com/#{board}/full_image/#{filename}"
      when 'an', 'fit', 'k', 'mlp', 'r9k', 'toy', 'x'
        "http://archive.heinessen.com/#{board}/full_image/#{filename}"
      # when 'e'
      #   "https://www.cliché.net/4chan/cgi-board.pl/#{board}/full_image/#{filename}"
  post: (board, postID) ->
    switch board
      when 'a', 'co', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'wsg', 'dev', 'foolz'
        "//archive.foolz.us/_/api/chan/post/?board=#{board}&num=#{postID}"
      when 'u', 'kuku'
        "//nsfw.foolz.us/_/api/chan/post/?board=#{board}&num=#{postID}"
    # for fuuka-based archives:
    # https://github.com/eksopl/fuuka/issues/27
  thread: (board, threadID, postID) ->
    # keep the number only, if the location.hash was sent f.e.
    postID = postID.match(/\d+/)[0] if postID
    path   =
      if threadID
        "#{board}/thread/#{threadID}"
      else
        "#{board}/post/#{postID}"
    switch "#{board}"
      when 'a', 'co', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'wsg', 'dev', 'foolz'
        url = "//archive.foolz.us/#{path}/"
        if threadID and postID
          url += "##{postID}"
      when 'u', 'kuku'
        url = "//nsfw.foolz.us/#{path}/"
        if threadID and postID
          url += "##{postID}"
      when 'ck', 'lit'
        url = "//fuuka.warosu.org/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'diy', 'g', 'sci'
        url = "//archive.installgentoo.net/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'cgl', 'mu', 'soc', 'w'
        url = "//archive.rebeccablacktech.com/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'an', 'fit', 'k', 'mlp', 'r9k', 'toy', 'x'
        url = "http://archive.heinessen.com/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'e'
        url = "https://www.cliché.net/4chan/cgi-board.pl/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      else
        if threadID
          url = "//boards.4chan.org/#{board}/"
    url or ''

Build =
  spoilerRange: {}
  shortFilename: (filename, isReply) ->
    # FILENAME SHORTENING SCIENCE:
    # OPs have a +10 characters threshold.
    # The file extension is not taken into account.
    threshold = if isReply then 30 else 40
    if filename.length - 4 > threshold
      "#{filename[...threshold - 5]}(...).#{filename[-3..]}"
    else
      filename
  postFromObject: (data, board) ->
    o =
      # id
      postID:   data.no
      threadID: data.resto or data.no
      board:    board
      # info
      name:     data.name
      capcode:  data.capcode
      tripcode: data.trip
      uniqueID: data.id
      email:    if data.email then encodeURIComponent data.email.replace /&quot;/g, '"' else ''
      subject:  data.sub
      flagCode: data.country
      flagName: data.country_name
      date:     data.now
      dateUTC:  data.time
      comment:  data.com
      # thread status
      isSticky: !!data.sticky
      isClosed: !!data.closed
      # file
    if data.ext or data.filedeleted
      o.file =
        name:      data.filename + data.ext
        timestamp: "#{data.tim}#{data.ext}"
        url:       "//images.4chan.org/#{board}/src/#{data.tim}#{data.ext}"
        height:    data.h
        width:     data.w
        MD5:       data.md5
        size:      data.fsize
        turl:      "//thumbs.4chan.org/#{board}/thumb/#{data.tim}s.jpg"
        theight:   data.tn_h
        twidth:    data.tn_w
        isSpoiler: !!data.spoiler
        isDeleted: !!data.filedeleted
    Build.post o
  post: (o, isArchived) ->
    ###
    This function contains code from 4chan-JS (https://github.com/4chan/4chan-JS).
    @license: https://github.com/4chan/4chan-JS/blob/master/LICENSE
    ###
    {
      postID, threadID, board
      name, capcode, tripcode, uniqueID, email, subject, flagCode, flagName, date, dateUTC
      isSticky, isClosed
      comment
      file
    } = o
    isOP = postID is threadID

    staticPath = '//static.4chan.org'

    if email
      emailStart = '<a href="mailto:' + email + '" class="useremail">'
      emailEnd   = '</a>'
    else
      emailStart = ''
      emailEnd   = ''

    subject =
      if subject
        "<span class=subject>#{subject}</span>"
      else
        ''

    userID =
      if !capcode and uniqueID
        " <span class='posteruid id_#{uniqueID}'>(ID: " +
          "<span class=hand title='Highlight posts by this ID'>#{uniqueID}</span>)</span> "
      else
        ''

    switch capcode
      when 'admin', 'admin_highlight'
        capcodeClass = " capcodeAdmin"
        capcodeStart = " <strong class='capcode hand id_admin'" +
          "title='Highlight posts by the Administrator'>## Admin</strong>"
        capcode      = " <img src='#{staticPath}/image/adminicon.gif' " +
          "alt='This user is the 4chan Administrator.' " +
          "title='This user is the 4chan Administrator.' class=identityIcon>"
      when 'mod'
        capcodeClass = " capcodeMod"
        capcodeStart = " <strong class='capcode hand id_mod' " +
          "title='Highlight posts by Moderators'>## Mod</strong>"
        capcode      = " <img src='#{staticPath}/image/modicon.gif' " +
          "alt='This user is a 4chan Moderator.' " +
          "title='This user is a 4chan Moderator.' class=identityIcon>"
      when 'developer'
        capcodeClass = " capcodeDeveloper"
        capcodeStart = " <strong class='capcode hand id_developer' " +
          "title='Highlight posts by Developers'>## Developer</strong>"
        capcode      = " <img src='#{staticPath}/image/developericon.gif' " +
          "alt='This user is a 4chan Developer.' " +
          "title='This user is a 4chan Developer.' class=identityIcon>"
      else
        capcodeClass = ''
        capcodeStart = ''
        capcode      = ''

    flag =
      if flagCode
       " <img src='#{staticPath}/image/country/#{if board is 'pol' then 'troll/' else ''}" +
        flagCode.toLowerCase() + ".gif' alt=#{flagCode} title='#{flagName}' class=countryFlag>"
      else
        ''

    if file?.isDeleted
      fileHTML =
        if isOP
          "<div class=file id=f#{postID}><div class=fileInfo></div><span class=fileThumb>" +
              "<img src='#{staticPath}/image/filedeleted.gif' alt='File deleted.'>" +
          "</span></div>"
        else
          "<div id=f#{postID} class=file><span class=fileThumb>" +
            "<img src='#{staticPath}/image/filedeleted-res.gif' alt='File deleted.'>" +
          "</span></div>"
    else if file
      ext = file.name[-3..]
      if !file.twidth and !file.theight and ext is 'gif' # wtf ?
        file.twidth  = file.width
        file.theight = file.height

      fileSize = $.bytesToString file.size

      fileThumb = file.turl
      if file.isSpoiler
        fileSize = "Spoiler Image, #{fileSize}"
        unless isArchived
          fileThumb = '//static.4chan.org/image/spoiler'
          if spoilerRange = Build.spoilerRange[board]
            # Randomize the spoiler image.
            fileThumb += "-#{board}" + Math.floor 1 + spoilerRange * Math.random()
          fileThumb += '.png'
          file.twidth = file.theight = 100

      imgSrc = "<a class='fileThumb#{if file.isSpoiler then ' imgspoiler' else ''}' href='#{file.url}' target=_blank>" +
        "<img src='#{fileThumb}' alt='#{fileSize}' data-md5=#{file.MD5} style='width:#{file.twidth}px;height:#{file.theight}px'></a>"

      # Ha Ha filenames.
      # html -> text, translate WebKit's %22s into "s
      a = $.el 'a', innerHTML: file.name
      filename = a.textContent.replace /%22/g, '"'

      # shorten filename, get html
      a.textContent = Build.shortFilename filename
      shortFilename = a.innerHTML

      # get html
      a.textContent = filename
      filename      = a.innerHTML.replace /'/g, '&apos;'

      fileDims = if ext is 'pdf' then 'PDF' else "#{file.width}x#{file.height}"
      fileInfo = "<span class=fileText id=fT#{postID}#{if file.isSpoiler then " title='#{filename}'" else ''}>File: <a href='#{file.url}' target=_blank>#{file.timestamp}</a>" +
        "-(#{fileSize}, #{fileDims}#{
          if file.isSpoiler
            ''
          else
            ", <span title='#{filename}'>#{shortFilename}</span>"
        }" + ")</span>"

      fileHTML = "<div id=f#{postID} class=file><div class=fileInfo>#{fileInfo}</div>#{imgSrc}</div>"
    else
      fileHTML = ''

    tripcode =
      if tripcode
        " <span class=postertrip>#{tripcode}</span>"
      else
        ''

    sticky =
      if isSticky
        ' <img src=//static.4chan.org/image/sticky.gif alt=Sticky title=Sticky style="height:16px;width:16px">'
      else
        ''
    closed =
      if isClosed
        ' <img src=//static.4chan.org/image/closed.gif alt=Closed title=Closed style="height:16px;width:16px">'
      else
        ''

    container = $.el 'div',
      id: "pc#{postID}"
      className: "postContainer #{if isOP then 'op' else 'reply'}Container"
      innerHTML: \
      (if isOP then '' else "<div class=sideArrows id=sa#{postID}>&gt;&gt;</div>") +
      "<div id=p#{postID} class='post #{if isOP then 'op' else 'reply'}#{
        if capcode is 'admin_highlight'
          ' highlightPost'
        else
          ''
        }'>" +

        "<div class='postInfoM mobile' id=pim#{postID}>" +
          "<span class='nameBlock#{capcodeClass}'>" +
              "<span class=name>#{name or ''}</span>" + tripcode +
            capcodeStart + capcode + userID + flag + sticky + closed +
            "<br>#{subject}" +
          "</span><span class='dateTime postNum' data-utc=#{dateUTC}>#{date}" +
          '<br><em>' +
            "<a href=#{"/#{board}/res/#{threadID}#p#{postID}"}>No.</a>" +
            "<a href='#{
              if g.REPLY and g.THREAD_ID is threadID
                "javascript:quote(#{postID})"
              else
                "/#{board}/res/#{threadID}#q#{postID}"
              }'>#{postID}</a>" +
          '</em></span>' +
        '</div>' +

        (if isOP then fileHTML else '') +

        "<div class='postInfo desktop' id=pi#{postID}>" +
          "<input type=checkbox name=#{postID} value=delete> " +
          "#{subject} " +
          "<span class='nameBlock#{capcodeClass}'>" +
            emailStart +
              "<span class=name>#{name or ''}</span>" + tripcode +
            capcodeStart + emailEnd + capcode + userID + flag + sticky + closed +
          ' </span> ' +
          "<span class=dateTime data-utc=#{dateUTC}>#{date}</span> " +
          "<span class='postNum desktop'>" +
            "<a href=#{"/#{board}/res/#{threadID}#p#{postID}"} title='Highlight this post'>No.</a>" +
            "<a href='#{
              if g.REPLY and g.THREAD_ID is threadID
                "javascript:quote(#{postID})"
              else
                "/#{board}/res/#{threadID}#q#{postID}"
              }' title='Quote this post'>#{postID}</a>" +
          '</span>' +
        '</div>' +

        (if isOP then '' else fileHTML) +

        "<blockquote class=postMessage id=m#{postID}>#{comment or ''}</blockquote> " +

      '</div>'

    for quote in $$ '.quotelink', container
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote, or board link
      quote.href = "/#{board}/res/#{href}" # Fix pathnames

    container

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
      threadID = +path[3]
      postID   = +link.hash[2..]
    else # resurrected quote
      board    = link.dataset.board
      threadID = +link.dataset.threadid or ''
      postID   = +link.dataset.postid
    return {
      board:    board
      threadID: threadID
      postID:   postID
    }
  postClone: (board, threadID, postID, root, context) ->
    if post = g.posts["#{board}.#{postID}"]
      Get.insert post, root, context
      return

    root.textContent = "Loading post No.#{postID}..."
    if threadID
      $.cache "//api.4chan.org/#{board}/res/#{threadID}.json", ->
        Get.fetchedPost @, board, threadID, postID, root, context
    else if url = Redirect.post board, postID
      $.cache url, ->
        Get.archivedPost @, board, postID, root, context
  insert: (post, root, context) ->
    # Stop here if the container has been removed while loading.
    return unless root.parentNode
    clone = post.addClone context
    Main.callbackNodes Post, [clone]

    # Get rid of the side arrows.
    {nodes} = clone
    nodes.root.innerHTML = null
    $.add nodes.root, nodes.post

    root.innerHTML = null
    $.add root, nodes.root
  fetchedPost: (req, board, threadID, postID, root, context) ->
    # In case of multiple callbacks for the same request,
    # don't parse the same original post more than once.
    if post = g.posts["#{board}.#{postID}"]
      Get.insert post, root, context
      return
    {status} = req
    if status isnt 200
      # The thread can die by the time we check a quote.
      if url = Redirect.post board, postID
        $.cache url, ->
          Get.archivedPost @, board, postID, root, context
      else
        $.addClass root, 'warning'
        root.textContent =
          if status is 404
            "Thread No.#{threadID} 404'd."
          else
            "Error #{req.status}: #{req.statusText}."
      return

    posts = JSON.parse(req.response).posts
    if spoilerRange = posts[0].custom_spoiler
      Build.spoilerRange[board] = spoilerRange
    postID = +postID
    for post in posts
      break if post.no is postID # we found it!
      if post.no > postID
        # The post can be deleted by the time we check a quote.
        if url = Redirect.post board, postID
          $.cache url, ->
            Get.archivedPost @, board, postID, root, context
        else
          $.addClass root, 'warning'
          root.textContent = "Post No.#{postID} was not found."
        return

    board = g.boards[board] or
      new Board board
    thread = g.threads["#{board}.#{threadID}"] or
      new Thread threadID, board
    post = new Post Build.postFromObject(post, board), thread, board
    Main.callbackNodes Post, [post]
    Get.insert post, root, context
  archivedPost: (req, board, postID, root, context) ->
    # In case of multiple callbacks for the same request,
    # don't parse the same original post more than once.
    if post = g.posts["#{board}.#{postID}"]
      Get.insert post, root, context
      return
    data = JSON.parse req.response
    if data.error
      $.addClass root, 'warning'
      root.textContent = data.error
      return

    # convert comment to html
    bq = $.el 'blockquote', textContent: data.comment # set this first to convert text to HTML entities
    # https://github.com/eksopl/fuuka/blob/master/Board/Yotsuba.pm#L413-452
    # https://github.com/eksopl/asagi/blob/master/src/main/java/net/easymodo/asagi/Yotsuba.java#L109-138
    bq.innerHTML = bq.innerHTML.replace ///
      \n
      | \[/?b\]
      | \[/?spoiler\]
      | \[/?code\]
      | \[/?moot\]
      | \[/?banned\]
      ///g, (text) ->
        switch text
          when '\n'
            '<br>'
          when '[b]'
            '<b>'
          when '[/b]'
            '</b>'
          when '[spoiler]'
            '<span class=spoiler>'
          when '[/spoiler]'
            '</span>'
          when '[code]'
            '<pre class=prettyprint>'
          when '[/code]'
            '</pre>'
          when '[moot]'
            '<div style="padding:5px;margin-left:.5em;border-color:#faa;border:2px dashed rgba(255,0,0,.1);border-radius:2px">'
          when '[/moot]'
            '</div>'
          when '[banned]'
            '<b style="color: red;">'
          when '[/banned]'
            '</b>'
    # greentext
    comment = bq.innerHTML.replace /(^|>)(&gt;[^<$]+)(<|$)/g, '$1<span class=quote>$2</span>$3'

    threadID = data.thread_num
    o =
      # id
      postID:   "#{postID}"
      threadID: "#{threadID}"
      board:    board
      # info
      name:     data.name_processed
      capcode:  switch data.capcode
        when 'M' then 'mod'
        when 'A' then 'admin'
        when 'D' then 'developer'
      tripcode: data.trip
      uniqueID: data.poster_hash
      email:    if data.email then encodeURIComponent data.email else ''
      subject:  data.title_processed
      flagCode: data.poster_country
      flagName: data.poster_country_name_processed
      date:     data.fourchan_date
      dateUTC:  data.timestamp
      comment:  comment
      # file
    if data.media?.media_filename
      o.file =
        name:      data.media.media_filename_processed
        timestamp: data.media.media_orig
        url:       data.media.media_link or data.media.remote_media_link
        height:    data.media.media_h
        width:     data.media.media_w
        MD5:       data.media.media_hash
        size:      data.media.media_size
        turl:      data.media.thumb_link or "//thumbs.4chan.org/#{board}/thumb/#{data.media.preview_orig}"
        theight:   data.media.preview_h
        twidth:    data.media.preview_w
        isSpoiler: data.media.spoiler is '1'

    board = g.boards[board] or
      new Board board
    thread = g.threads["#{board}.#{threadID}"] or
      new Thread threadID, board
    post = new Post Build.post(o, true), thread, board,
      isArchived: true
    Main.callbackNodes Post, [post]
    Get.insert post, root, context

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

        # \u00A0 is nbsp
        if post = g.posts[quoteID]
          if post.isDead
            a = $.el 'a',
              href:        Redirect.thread board, 0, ID
              className:   'quotelink deadlink'
              textContent: "#{quote}\u00A0(Dead)"
              target:      '_blank'
            a.setAttribute 'data-board',    board
            a.setAttribute 'data-threadid', post.thread.ID
            a.setAttribute 'data-postid',   ID
          else
            # Don't (Dead) when quotifying in an archived post,
            # and we know the post still exists.
            a = $.el 'a',
              href:        "/#{board}/#{post.thread}/res/#p#{ID}"
              className:   'quotelink'
              textContent: quote
        else
          a = $.el 'a',
            href:        Redirect.thread board, 0, ID
            className:   'deadlink'
            target:      '_blank'
            textContent: "#{quote}\u00A0(Dead)"
          if Redirect.post board, ID
            $.addClass a, 'quotelink'
            a.setAttribute 'data-board',  board
            a.setAttribute 'data-postid', ID

        if @quotes.indexOf(quoteID) is -1
          @quotes.push quoteID
        if $.hasClass a, 'quotelink'
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
    context = Get.postFromRoot $.x 'ancestor::div[parent::div[@class="thread"]][1]', quotelink
    $.after root, inline
    Get.postClone board, threadID, postID, inline, context

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

    inThreadID = +$.x('ancestor::div[@class="thread"]', quotelink).id[1..]

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
      post = g.posts["#{board}.#{postID}"]
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
    context = Get.postFromRoot $.x 'ancestor::div[parent::div[@class="thread"]][1]', @
    $.add d.body, qp
    Get.postClone board, threadID, postID, qp, context

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

QuoteOP =
  init: ->
    # \u00A0 is nbsp
    @text = '\u00A0(OP)'
    Post::callbacks.push
      name: 'Indicate OP Quotes'
      cb:   @node
  node: ->
    # Stop there if it's a clone of a post in the same thread.
    return if @isClone and @thread is @context.thread
    # Stop there if there's no quotes in that post.
    return unless (quotes = @quotes).length
    quotelinks = @nodes.quotelinks

    # rm (OP) from cross-thread quotes.
    if @isClone and -1 < quotes.indexOf "#{@board}.#{@thread}"
      for quote in quotelinks
        quote.textContent = quote.textContent.replace QuoteOP.text, ''

    {board, thread} = if @isClone then @context else @
    op = "#{board}.#{thread}"
    # add (OP) to quotes quoting this context's OP.
    return unless -1 < quotes.indexOf op
    for quote in quotelinks
      {board, postID} = Get.postDataFromLink quote
      if "#{board}.#{postID}" is op
        $.add quote, $.tn QuoteOP.text
    return

QuoteCT =
  init: ->
    # \u00A0 is nbsp
    @text = '\u00A0(Cross-thread)'
    Post::callbacks.push
      name: 'Indicate Cross-thread Quotes'
      cb:   @node
  node: ->
    # Stop there if it's a clone of a post in the same thread.
    return if @isClone and @thread is @context.thread
    # Stop there if there's no quotes in that post.
    return unless (quotes = @quotes).length
    quotelinks = @nodes.quotelinks

    {board, thread} = if @isClone then @context else @
    for quote in quotelinks
      data = Get.postDataFromLink quote
      continue if data.threadID is '' # deadlink
      if @isClone
        quote.textContent = quote.textContent.replace QuoteCT.text, ''
      if data.board is board.ID and data.threadID isnt thread.ID
        $.add quote, $.tn QuoteCT.text
    return

Time =
  init: ->
    @funk = @createFunc Conf['time']
    Post::callbacks.push
      name: 'Time Formatting'
      cb:   @node
  node: ->
    return if @isClone
    @nodes.date.textContent = Time.funk Time, @info.date
  createFunc: (format) ->
    code = format.replace /%([A-Za-z])/g, (s, c) ->
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

FileInfo =
  init: ->
    @funk = @createFunc Conf['fileInfo']
    Post::callbacks.push
      name: 'File Info Formatting'
      cb:   @node
  node: ->
    return if !@file or @isClone
    @file.text.innerHTML = FileInfo.funk FileInfo, @
  createFunc: (format) ->
    code = format.replace /%([BKlLMnNprs])/g, (s, c) ->
      if c of FileInfo.formatters
        "' + FileInfo.formatters.#{c}.call(post) + '"
      else
        s
    Function 'FileInfo', 'post', "return '#{code}'"
  convertUnit: (size, unit) ->
    if unit is 'B'
      return "#{size.toFixed()} Bytes"
    i = 1 + ['KB', 'MB'].indexOf unit
    size /= 1024 while i--
    size =
      if unit is 'MB'
        Math.round(size * 100) / 100
      else
        size.toFixed()
    "#{size} #{unit}"
  escape: (name) ->
    name.replace /<|>/g, (c) ->
      c is '<' and '&lt;' or '&gt;'
  formatters:
    l: -> "<a href=#{@file.URL} target=_blank>#{FileInfo.formatters.n.call @}</a>"
    L: -> "<a href=#{@file.URL} target=_blank>#{FileInfo.formatters.N.call @}</a>"
    n: ->
      fullname  = @file.name
      shortname = Build.shortFilename @file.name, @isReply
      if fullname is shortname
        FileInfo.escape fullname
      else
        "<span class=fntrunc>#{FileInfo.escape shortname}</span><span class=fnfull>#{FileInfo.escape fullname}</span>"
    N: -> FileInfo.escape @file.name
    p: -> if @file.isSpoiler then 'Spoiler, ' else ''
    s: -> $.bytesToString @file.size
    B: -> FileInfo.convertUnit @file.size, 'B'
    K: -> FileInfo.convertUnit @file.size, 'KB'
    M: -> FileInfo.convertUnit @file.size, 'MB'
    r: -> if @file.isImage then @file.dimensions else 'PDF'

Sauce =
  init: ->
    links = []
    for link in Conf['sauces'].split '\n'
      continue if link[0] is '#'
      # XXX .trim() is there to fix Opera reading two different line breaks.
      links.push @createSauceLink link.trim()
    return unless links.length
    @links = links
    Post::callbacks.push
      name: 'Sauce'
      cb:   @node
  createSauceLink: (link) ->
    link = link.replace /\$(turl|url|md5|board)/g, (parameter) ->
      switch parameter
        when '$turl'
          "' + post.file.thumbURL + '"
        when '$url'
          "' + post.file.URL + '"
        when '$md5'
          "' + encodeURIComponent(post.file.MD5) + '"
        when '$board'
          "' + post.board + '"
        else
          parameter
    text = if m = link.match(/;text:(.+)$/) then m[1] else link.match(/(\w+)\.\w+\//)[1]
    link = link.replace /;text:.+$/, ''
    href = Function 'post', "return '#{link}'"
    el = $.el 'a',
      target: '_blank'
      textContent: text
    (post) ->
      a = el.cloneNode true
      a.href = href post
      a
  node: ->
    return if @isClone or !@file
    nodes = []
    for link in Sauce.links
      # \u00A0 is nbsp
      nodes.push $.tn('\u00A0'), link @
    $.add @file.info, nodes

RevealSpoilers =
  init: ->
    Post::callbacks.push
      name: 'Reveal Spoilers'
      cb:   @node
  node: ->
    return if @isClone or !@file?.isSpoiler
    {thumb} = @file
    thumb.removeAttribute 'style'
    thumb.src = @file.thumbURL

AutoGIF =
  init: ->
    return if g.BOARD.ID in ['gif', 'wsg']
    Post::callbacks.push
      name: 'Auto-GIF'
      cb:   @node
  node: ->
    # XXX return if @hidden?
    return if @isClone or !@file?.isImage
    {thumb, URL} = @file
    return unless /gif$/.test(URL) and !/spoiler/.test thumb.src
    if @file.isSpoiler
      # Revealed spoilers do not have height/width set, this fixes auto-gifs dimensions.
      {style} = thumb
      style.maxHeight = style.maxWidth = if @isReply then '125px' else '250px'
    gif = $.el 'img'
    $.on gif, 'load', ->
      # Replace the thumbnail once the GIF has finished loading.
      thumb.src = URL
    gif.src = URL

ImageHover =
  init: ->
    return if g.BOARD.ID in ['gif', 'wsg']
    Post::callbacks.push
      name: 'Auto-GIF'
      cb:   @node
  node: ->
    return unless @file?.isImage
    $.on @file.thumb, 'mouseover', ImageHover.mouseover
  mouseover: ->
    # Don't stop other elements from dragging
    return if UI.el
    el = UI.el = $.el 'img'
      id: 'ihover'
      src: @parentNode.href
    $.add d.body, el
    $.on el, 'load',      ImageHover.load
    $.on el, 'error',     ImageHover.error
    $.on @,  'mousemove', UI.hover
    $.on @,  'mouseout',  ImageHover.mouseout
  load: ->
    return unless @parentNode
    # 'Fake' mousemove event by giving required values.
    {style} = @
    UI.hover
      clientX: - 45 + parseInt style.left
      clientY:  120 + parseInt style.top
  error: ->
    return unless @parentNode
    src = @src.split '/'
    unless src[2] is 'images.4chan.org' and url = Redirect.image src[3], src[5]
      return if g.DEAD
      url = "//images.4chan.org/#{src[3]}/src/#{src[5]}"
    return if $.engine isnt 'webkit' and url.split('/')[2] is 'images.4chan.org'
    timeoutID = setTimeout (=> @src = url), 3000
    # Only Chrome let userscripts do cross domain requests.
    # Don't check for 404'd status in the archivers.
    return if $.engine isnt 'webkit' or url.split('/')[2] isnt 'images.4chan.org'
    $.ajax url, onreadystatechange: (-> clearTimeout timeoutID if @status is 404),
      type: 'head'
  mouseout: ->
    UI.hoverend()
    $.off @, 'mousemove', UI.hover
    $.off @, 'mouseout',  ImageHover.mouseout

ThreadUpdater =
  init: ->
    return unless g.REPLY
    Thread::callbacks.push
      name: 'Thread Updater'
      cb:   @node
  node: ->
    new ThreadUpdater.Updater @

  Updater: class
    constructor: (@thread) ->
      html = '<div class=move><span id=status></span> <span id=timer></span></div>'
      for name, val of Config.updater.checkbox
        title   = val[1]
        checked = if Conf[name] then 'checked' else ''
        html    += "<div><label title='#{title}'>#{name}<input name='#{name}' type=checkbox #{checked}></label></div>"

      checked = if Conf['Auto Update'] then 'checked' else ''
      html += """
        <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox #{checked}></label></div>
        <div><label>Interval (s)<input type=number name=Interval class=field min=5 value=#{Conf['Interval']}></label></div>
        <div><input value='Update Now' type=button name='Update Now'></div>
        """

      dialog = UI.dialog 'updater', 'bottom: 0; right: 0;', html

      @timer  = $ '#timer',  dialog
      @status = $ '#status', dialog

      @unsuccessfulFetchCount = 0
      @lastModified = '0'
      @threadRoot = thread.posts[thread].nodes.root.parentNode
      @lastPost = +@threadRoot.lastElementChild.id[2..]

      for input in $$ 'input', dialog
        if input.type is 'checkbox'
          $.on input, 'click', @cb.checkbox.bind @
          input.dispatchEvent new Event 'click'
        switch input.name
          when 'Scroll BG'
            $.on input, 'click', @cb.scrollBG.bind @
            @cb.scrollBG.call @
          when 'Auto Update This'
            $.on input, 'click', @cb.autoUpdate.bind @
          when 'Interval'
            $.on input, 'change', @cb.interval.bind @
            input.dispatchEvent new Event 'change'
          when 'Update Now'
            $.on input, 'click', @update.bind @

      $.on window, 'online offline', @cb.online.bind @
      $.on d, 'QRPostSuccessful', @cb.post.bind @
      $.on d, 'visibilitychange ovisibilitychange mozvisibilitychange webkitvisibilitychange', @cb.visibility.bind @

      @cb.online.call @
      $.add d.body, dialog

    cb:
      online: ->
        if @online = navigator.onLine
          @unsuccessfulFetchCount = 0
          @set 'timer', @getInterval()
          @set 'status', null
          @status.className = null
        else
          @status.className = 'warning'
          @set 'status', 'Offline'
          @set 'timer',  null
        @cb.autoUpdate.call @
      post: (e) ->
        return unless @['Auto Update This'] and +e.detail.threadID is @thread.ID
        @unsuccessfulFetchCount = 0
        setTimeout @update.bind(@), 1000 if @seconds > 2
      visibility: ->
        state = d.visibilityState or d.oVisibilityState or d.mozVisibilityState or d.webkitVisibilityState
        return if state isnt 'visible'
        # Reset the counter when we focus this tab.
        @unsuccessfulFetchCount = 0
        if @seconds > @interval
          @set 'timer', @getInterval()
      checkbox: (e) ->
        input = e.target
        {checked, name} = input
        @[name] = checked
        $.cb.checked.call input
      scrollBG: ->
        @scrollBG =
          if @['Scroll BG']
            -> true
          else
            -> !(d.hidden or d.oHidden or d.mozHidden or d.webkitHidden)
      autoUpdate: ->
        if @['Auto Update This'] and @online
          @timeoutID = setTimeout @timeout.bind(@), 1000
        else
          clearTimeout @timeoutID
      interval: (e) ->
        input = e.target
        val = Math.max 5, parseInt input.value, 10
        @interval = input.value = val
        $.cb.value.call input
      load: ->
        switch @req.status
          when 404
            @set 'timer', null
            @set 'status', '404'
            @status.className = 'warning'
            clearTimeout @timeoutID
            @thread.isDead = true
            # if Conf['Unread Count']
            #   Unread.title = Unread.title.match(/^.+-/)[0] + ' 404'
            # else
            #   d.title = d.title.match(/^.+-/)[0] + ' 404'
            # Unread.update true
            # QR.abort()
          # XXX 304 -> 0 in Opera
          when 0, 304
            ###
            Status Code 304: Not modified
            By sending the `If-Modified-Since` header we get a proper status code, and no response.
            This saves bandwidth for both the user and the servers and avoid unnecessary computation.
            ###
            @unsuccessfulFetchCount++
            @set 'timer', @getInterval()
            @set 'status', null
            @status.className = null
          when 200
            @lastModified = @req.getResponseHeader 'Last-Modified'
            @parse JSON.parse(@req.response).posts
            @set 'timer', @getInterval()
          else
            @unsuccessfulFetchCount++
            @set 'timer',  @getInterval()
            @set 'status', "#{@req.statusText} (#{@req.status})"
            @status.className = 'warning'
        delete @req

    getInterval: ->
      i = @interval
      j = Math.min @unsuccessfulFetchCount, 10
      unless d.hidden or d.oHidden or d.mozHidden or d.webkitHidden
        # Lower the max refresh rate limit on visible tabs.
        j = Math.min j, 7
      @seconds = Math.max i, [0, 5, 10, 15, 20, 30, 60, 90, 120, 240, 300][j]

    set: (name, text) ->
      el = @[name]
      if node = el.firstChild
        # Prevent the creation of a new DOM Node
        # by setting the text node's data.
        node.data = text
      else
        el.textContent = text

    timeout: ->
      @timeoutID = setTimeout @timeout.bind(@), 1000
      unless n = --@seconds
        @update()
      else if n <= -60
        @set 'status', 'Retrying'
        @status.className = null
        @update()
      else if n > 0
        @set 'timer', n

    update: ->
      return unless @online
      @seconds = 0
      @set 'timer', '...'
      if @req
        # abort() triggers onloadend, we don't want that.
        @req.onloadend = null
        @req.abort()
      url = "//api.4chan.org/#{@thread.board}/res/#{@thread}.json"
      @req = $.ajax url, onloadend: @cb.load.bind @,
        headers: 'If-Modified-Since': @lastModified

    parse: (postObjects) ->
      Build.spoilerRange[@thread.board] = postObjects[0].custom_spoiler

      nodes = [] # post container elements
      posts = [] # post objects
      index = [] # existing posts
      image = [] # existing images
      count = 0  # new posts count
      # Build the index, create posts.
      for postObject in postObjects
        num = postObject.no
        index.push num
        image.push num if postObject.ext
        continue if num <= @lastPost
        # Insert new posts, not older ones.
        count++
        node = Build.postFromObject postObject, @thread.board.ID
        nodes.push node
        posts.push new Post node, @thread, @thread.board

      # Check for deleted posts and deleted images.
      for i, post of @thread.posts
        continue if post.isDead
        {ID} = post
        if -1 is index.indexOf ID
          post.kill()
        else if post.file and !post.file.isDead and -1 is image.indexOf ID
          post.kill true

      if count
        @set 'status', "+#{count}"
        @status.className = 'new'
        @unsuccessfulFetchCount = 0
      else
        @set 'status', null
        @status.className = null
        @unsuccessfulFetchCount++
        return

      @lastPost = posts[count - 1].ID
      Main.callbackNodes Post, posts

      scroll = @['Auto Scroll'] and @scrollBG() and
        @threadRoot.getBoundingClientRect().bottom - d.documentElement.clientHeight < 25
      $.add @threadRoot, nodes
      if scroll
        nodes[0].scrollIntoView()



Main.init()
