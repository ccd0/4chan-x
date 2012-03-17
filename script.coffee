Config =
  main:
    Enhancing:
      '404 Redirect':                 [true,  'Redirect dead threads and images']
      'Keybinds':                     [true,  'Binds actions to keys']
      'Time Formatting':              [true,  'Arbitrarily formatted timestamps, using your local time']
      'File Info Formatting':         [true,  'Reformats the file information']
      'Report Button':                [true,  'Add report buttons']
      'Comment Expansion':            [true,  'Expand too long comments']
      'Thread Expansion':             [true,  'View all replies']
      'Index Navigation':             [true,  'Navigate to previous / next thread']
      'Reply Navigation':             [false, 'Navigate to top / bottom of thread']
      'Check for Updates':            [true,  'Check for updated versions of 4chan X']
    Filtering:
      'Anonymize':                    [false, 'Make everybody anonymous']
      'Filter':                       [true,  'Self-moderation placebo']
      'Recursive Filtering':          [true,  'Filter replies of filtered posts, recursively']
      'Reply Hiding':                 [true,  'Hide single replies']
      'Thread Hiding':                [true,  'Hide entire threads']
      'Show Stubs':                   [true,  'Of hidden threads / replies']
    Imaging:
      'Image Auto-Gif':               [false, 'Animate gif thumbnails']
      'Image Expansion':              [true,  'Expand images']
      'Image Hover':                  [false, 'Show full image on mouseover']
      'Sauce':                        [true,  'Add sauce to images']
      'Reveal Spoilers':              [false, 'Replace spoiler thumbnails by the original thumbnail']
      'Expand From Current':          [false, 'Expand images from current position to thread end.']
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
      'Quick Reply':                  [true,  'Reply without leaving the page.']
      'Cooldown':                     [true,  'Prevent "flood detected" errors.']
      'Persistent QR':                [false, 'The Quick reply won\'t disappear after posting.']
      'Auto Hide QR':                 [true,  'Automatically hide the quick reply when posting.']
      'Open Reply in New Tab':        [false, 'Open replies in a new tab that are made from the main board.']
      'Remember QR size':             [false, 'Remember the size of the Quick reply (Firefox only).']
      'Remember Subject':             [false, 'Remember the subject field, instead of resetting after posting.']
      'Remember Spoiler':             [false, 'Remember the spoiler state, instead of resetting after posting.']
      'Hide Original Post Form':      [true,  'Replace the normal post form with a shortcut to open the QR.']
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
    '#http://imgur.com/upload?url=$2'
    '#http://omploader.org/upload?url1=$2'
    '# "View Same" in archives:'
    '#http://archive.foolz.us/$4/image/$3/'
    '#https://archive.installgentoo.net/$4/image/$3'
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M'
  backlink: '>>%id'
  fileInfoR: '%l (%s, %r)'
  fileInfoT: '%l (%s, %r)'
  favicon: 'ferongr'
  hotkeys:
    # QR & Options
    openQR:          ['i',      'Open QR with post number inserted']
    openEmptyQR:     ['I',      'Open QR without post number inserted']
    openOptions:     ['ctrl+o', 'Open Options']
    close:           ['Esc',    'Close Options or QR']
    spoiler:         ['ctrl+s', 'Quick spoiler']
    submit:          ['alt+s',  'Submit post']
    # Thread related
    watch:           ['w',      'Watch thread']
    update:          ['u',      'Update now']
    unreadCountTo0:  ['z',      'Reset unread status']
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
    openThreadTab:   ['o',      'Open thread in current tab']
    openThread:      ['O',      'Open thread in new tab']
    # Reply Navigation
    nextReply:       ['J',      'Select next reply']
    previousReply:   ['K',      'Select previous reply']
    hide:            ['x',      'Hide thread']
  updater:
    checkbox:
      'Scrolling':   [false, 'Scroll updated posts into view. Only enabled at bottom of page.']
      'Scroll BG':   [false, 'Scroll background tabs']
      'Verbose':     [true,  'Show countdown timer, new post count']
      'Auto Update': [true,  'Automatically fetch new posts']
    'Interval': 30

# flatten the config
Conf = {}
(flatten = (parent, obj) ->
  if obj instanceof Array
    Conf[parent] = obj[0]
  else if typeof obj is 'object'
    for key, val of obj
      flatten key, val
  else # string or number
    Conf[parent] = obj
  return
) null, Config

d = document
g = {}

UI =
  dialog: (id, position, html) ->
    el = d.createElement 'div'
    el.className = 'reply dialog'
    el.innerHTML = html
    el.id = id
    el.style.cssText = if saved = localStorage["#{Main.namespace}#{id}.position"] then saved else position
    el.querySelector('.move').addEventListener 'mousedown', UI.dragstart, false
    el
  dragstart: (e) ->
    #prevent text selection
    e.preventDefault()
    UI.el = el = @parentNode
    d.addEventListener 'mousemove', UI.drag, false
    d.addEventListener 'mouseup',   UI.dragend, false
    #distance from pointer to el edge is constant; calculate it here.
    # XXX opera reports el.offsetLeft / el.offsetTop as 0
    rect = el.getBoundingClientRect()
    UI.dx = e.clientX - rect.left
    UI.dy = e.clientY - rect.top
    #factor out el from document dimensions
    UI.width  = d.body.clientWidth  - el.offsetWidth
    UI.height = d.body.clientHeight - el.offsetHeight
  drag: (e) ->
    left = e.clientX - UI.dx
    top = e.clientY - UI.dy
    left =
      if left < 10 then 0
      else if UI.width - left < 10 then null
      else left
    top =
      if top < 10 then 0
      else if UI.height - top < 10 then null
      else top
    right = if left is null then 0 else null
    bottom = if top is null then 0 else null
    #using null instead of '' is 4% faster
    #these 4 statements are 40% faster than 1 style.cssText
    {style} = UI.el
    style.top    = top
    style.right  = right
    style.bottom = bottom
    style.left   = left
  dragend: ->
    #$ coffee -bpe '{a} = {b} = c'
    #var a, b;
    #a = (b = c.b, c).a;
    {el} = UI
    localStorage["#{Main.namespace}#{el.id}.position"] = el.style.cssText
    d.removeEventListener 'mousemove', UI.drag, false
    d.removeEventListener 'mouseup',   UI.dragend, false
  hover: (e) ->
    {clientX, clientY} = e
    {el} = UI
    {style} = el
    {clientHeight, clientWidth} = d.body
    height = el.offsetHeight

    top = clientY - 120
    style.top =
      if clientHeight <= height or top <= 0
        0
      else if top + height >= clientHeight
        clientHeight - height
      else
        top

    if clientX <= clientWidth - 400
      style.left  = clientX + 45
      style.right = null
    else
      style.left  = null
      style.right = clientWidth - clientX + 45

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

$.extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  return

$.extend $,
  SECOND: 1000
  MINUTE: 1000*60
  HOUR  : 1000*60*60
  DAY   : 1000*60*60*24
  log:
    # XXX GreaseMonkey can't into console.log.bind
    console.log.bind? console
  engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase()
  ready: (fc) ->
    if /interactive|complete/.test d.readyState
      # Execute the functions in parallel.
      # If one fails, do not stop the others.
      return setTimeout fc
    cb = ->
      $.off d, 'DOMContentLoaded', cb
      fc()
    $.on d, 'DOMContentLoaded', cb
  sync: (key, cb) ->
    $.on window, 'storage', (e) ->
      cb JSON.parse e.newValue if e.key is "#{Main.namespace}#{key}"
  id: (id) ->
    d.getElementById id
  ajax: (url, callbacks, opts={}) ->
    {type, headers, upCallbacks, form} = opts
    r = new XMLHttpRequest()
    r.open type or 'get', url, true
    for key, val of headers
      r.setRequestHeader key, val
    $.extend r, callbacks
    $.extend r.upload, upCallbacks
    if typeof form is 'string' then r.sendAsBinary form else r.send form
    r
  cache: (url, cb) ->
    if req = $.cache.requests[url]
      if req.readyState is 4
        cb.call req
      else
        req.callbacks.push cb
    else
      req = $.ajax url,
        onload:  -> cb.call @ for cb in @callbacks
        onabort: -> delete $.cache.requests[url]
      req.callbacks = [cb]
      $.cache.requests[url] = req
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
    # XPathResult.ANY_UNORDERED_NODE_TYPE is 8
    d.evaluate(path, root, null, 8, null).
      singleNodeValue
  addClass: (el, className) ->
    el.classList.add className
  removeClass: (el, className) ->
    el.classList.remove className
  rm: (el) ->
    el.parentNode.removeChild el
  tn: (s) ->
    d.createTextNode s
  nodes: (nodes) ->
    if nodes instanceof Node
      return nodes
    frag = d.createDocumentFragment()
    for node in nodes
      frag.appendChild node
    frag
  add: (parent, children) ->
    parent.appendChild $.nodes children
  prepend: (parent, children) ->
    parent.insertBefore $.nodes(children), parent.firstChild
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
  on: (el, eventType, handler) ->
    el.addEventListener eventType, handler, false
  off: (el, eventType, handler) ->
    el.removeEventListener eventType, handler, false
  open: (url) ->
    (GM_openInTab or window.open) url, '_blank'
  isDST: ->
    ###
      http://en.wikipedia.org/wiki/Eastern_Time_Zone
      Its UTC time offset is −5 hrs (UTC−05) during standard time and −4
      hrs (UTC−04) during daylight saving time.

      Since 2007, the local time changes at 02:00 EST to 03:00 EDT on the second
      Sunday in March and returns at 02:00 EDT to 01:00 EST on the first Sunday
      in November, in the U.S. as well as in Canada.

      0200 EST (UTC-05) = 0700 UTC
      0200 EDT (UTC-04) = 0600 UTC
    ###

    D = new Date()
    date  = D.getUTCDate()
    day   = D.getUTCDay()
    hours = D.getUTCHours()
    month = D.getUTCMonth()

    #this is the easy part
    if month < 2 or 10 < month
      return false
    if 2 < month < 10
      return true

    # (sunday's date) = (today's date) - (number of days past sunday)
    # date is not zero-indexed
    sunday = date - day

    if month is 2
      #before second sunday
      if sunday < 8
        return false

      #during second sunday
      if sunday < 15 and day is 0
        if hours < 7
          return false
        return true

      #after second sunday
      return true

    #month is 10
    # before first sunday
    if sunday < 1
      return true

    # during first sunday
    if sunday < 8 and day is 0
      if hours < 6
        return true
      return false

    #after first sunday
    return false

$.cache.requests = {}

$.extend $,
  if GM_deleteValue?
    delete: (name) ->
      name = Main.namespace + name
      GM_deleteValue name
    get: (name, defaultValue) ->
      name = Main.namespace + name
      if value = GM_getValue name
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      name = Main.namespace + name
      # for `storage` events
      localStorage[name] = JSON.stringify value
      GM_setValue name, JSON.stringify value
  else
    delete: (name) ->
      name = Main.namespace + name
      delete localStorage[name]
    get: (name, defaultValue) ->
      name = Main.namespace + name
      if value = localStorage[name]
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      name = Main.namespace + name
      localStorage[name] = JSON.stringify value

$$ = (selector, root=d.body) ->
  Array::slice.call root.querySelectorAll selector

Filter =
  filters: {}
  init: ->
    for key of Config.filter
      @filters[key] = []
      for filter in Conf[key].split '\n'
        continue if filter[0] is '#'

        unless regexp = filter.match /\/(.+)\/(\w*)/
          continue

        # Don't mix up filter flags with the regular expression.
        filter = filter.replace regexp[0], ''

        # Do not add this filter to the list if it's not a global one
        # and it's not specifically applicable to the current board.
        # Defaults to global.
        boards = filter.match(/boards:([^;]+)/)?[1].toLowerCase() or 'global'
        if boards isnt 'global' and boards.split(',').indexOf(g.BOARD) is -1
          continue

        try
          if key is 'md5'
            # MD5 filter will use strings instead of regular expressions.
            regexp = regexp[1]
          else
            # Please, don't write silly regular expressions.
            regexp = RegExp regexp[1], regexp[2]
        catch e
          # I warned you, bro.
          alert e.message
          continue

        # Filter OPs along with their threads, replies only, or both.
        # Defaults to replies only.
        op = filter.match(/[^t]op:(yes|no|only)/)?[1].toLowerCase() or 'no'

        # Highlight the post, or hide it.
        # If not specified, the highlight class will be filter_highlight.
        # Defaults to post hiding.
        if hl = /highlight/.test filter
          hl  = filter.match(/highlight:(\w+)/)?[1].toLowerCase() or 'filter_highlight'
          # Put highlighted OP's thread on top of the board page or not.
          # Defaults to on top.
          top = filter.match(/top:(yes|no)/)?[1].toLowerCase() or 'yes'
          top = top is 'yes' # Turn it into a boolean

        @filters[key].push @createFilter regexp, op, hl, top

      # Only execute filter types that contain valid filters.
      unless @filters[key].length
        delete @filters[key]

    if Object.keys(@filters).length
      Main.callbacks.push @node

  createFilter: (regexp, op, hl, top) ->
    test =
      if typeof regexp is 'string'
        # MD5 checking
        (value) -> regexp is value
      else
        (value) -> regexp.test value
    (value, isOP) ->
      if isOP and op is 'no' or !isOP and op is 'only'
        return false
      unless test value
        return false
      if hl
        return [hl, top]
      true

  node: (post) ->
    return if post.isInlined
    {isOP, el} = post
    for key of Filter.filters
      value = Filter[key] post
      if value is false
        # Continue if there's nothing to filter (no tripcode for example).
        continue
      for filter in Filter.filters[key]
        unless result = filter value, isOP
          continue

        # Hide
        if result is true
          if isOP
            unless g.REPLY
              ThreadHiding.hide post.el.parentNode
            else
              continue
          else
            ReplyHiding.hide post.root
          return

        # Highlight
        if isOP
          $.addClass el, result[0]
        else
          $.addClass el.parentNode, result[0]
        if isOP and result[1] and not g.REPLY
          # Put the highlighted OPs' threads on top of the board pages...
          thisThread = el.parentNode
          # ...before the first non highlighted thread.
          if firstThread = $ 'div[class=op]'
            $.before firstThread.parentNode, [thisThread, thisThread.nextElementSibling]

  name: (post) ->
    name = if post.isOP then $ '.postername', post.el else $ '.commentpostername', post.el
    name.textContent
  uniqueid: (post) ->
    if uid = $ '.posteruid', post.el
      return uid.textContent
    false
  tripcode: (post) ->
    if trip = $ '.postertrip', post.el
      return trip.textContent
    false
  mod: (post) ->
    if mod = (if post.isOP then $ '.commentpostername', post.el else $ '.commentpostername ~ .commentpostername', post.el)
      return mod.textContent
    false
  email: (post) ->
    if mail = $ '.linkmail', post.el
      return mail.href
    false
  subject: (post) ->
    sub = if post.isOP then $ '.filetitle', post.el else $ '.replytitle', post.el
    sub.textContent
  comment: (post) ->
    text = []
    # XPathResult.ORDERED_NODE_SNAPSHOT_TYPE is 7
    nodes = d.evaluate './/br|.//text()', post.el.lastChild, null, 7, null
    for i in [0...nodes.snapshotLength]
      text.push if data = nodes.snapshotItem(i).data then data else '\n'
    text.join ''
  filename: (post) ->
    {filesize} = post
    if filesize and file = $ 'span', filesize
      return file.title
    false
  dimensions: (post) ->
    {filesize} = post
    if filesize and match = filesize.textContent.match /\d+x\d+/
      return match[0]
    false
  filesize: (post) ->
    {img} = post
    if img
      return img.alt
    false
  md5: (post) ->
    {img} = post
    if img
      return img.getAttribute 'md5'
    false

StrikethroughQuotes =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined
    for quote in post.quotes
      if (el = $.id quote.hash[1..]) and el.parentNode.parentNode.parentNode.hidden
        $.addClass quote, 'filtered'
        ReplyHiding.hide post.root if Conf['Recursive Filtering']
    return

ExpandComment =
  init: ->
    for a in $$ '.abbr > a'
      $.on a, 'click', ExpandComment.expand
    return
  expand: (e) ->
    e.preventDefault()
    [_, threadID, replyID] = @href.match /(\d+)#(\d+)/
    @textContent = "Loading #{replyID}..."
    threadID = @pathname.split('/').pop() or $.x('ancestor::div[@class="thread"]/div', @).id
    a = @
    $.cache @pathname, (-> ExpandComment.parse @, a, threadID, replyID)
  parse: (req, a, threadID, replyID) ->
    if req.status isnt 200
      a.textContent = "#{req.status} #{req.statusText}"
      return

    doc = d.implementation.createHTMLDocument null
    doc.documentElement.innerHTML = req.responseText

    Threading.op $('body > form', doc).firstChild
    # Import the node to fix quote.hashes
    # as they're empty when in a different document.
    node = d.importNode doc.getElementById replyID

    quotes = node.getElementsByClassName 'quotelink'
    for quote in quotes
      if quote.hash is quote.getAttribute 'href'
        quote.pathname = "/#{g.BOARD}/res/#{threadID}"
    post =
      el:        node
      threadId:  threadID
      quotes:    quotes
      backlinks: []
    if Conf['Resurrect Quotes']
      Quotify.node      post
    if Conf['Quote Preview']
      QuotePreview.node post
    if Conf['Quote Inline']
      QuoteInline.node  post
    if Conf['Indicate OP quote']
      QuoteOP.node      post
    if Conf['Indicate Cross-thread Quotes']
      QuoteCT.node      post
    $.replace a.parentNode.parentNode, node.lastChild

ExpandThread =
  init: ->
    for span in $$ '.omittedposts'
      a = $.el 'a',
        textContent: "+ #{span.textContent}"
        className: 'omittedposts'
        href: 'javascript:;'
      $.on a, 'click', ExpandThread.cb.toggle
      $.replace span, a

  cb:
    toggle: ->
      thread = @parentNode
      ExpandThread.toggle thread

  toggle: (thread) ->
    threadID = thread.firstChild.id
    pathname = "/#{g.BOARD}/res/#{threadID}"
    a = $ '.omittedposts', thread

    # \u00d7 is &times;

    switch a.textContent[0]
      when '+'
        $('.op .container', thread)?.textContent = ''
        a.textContent = a.textContent.replace '+', '\u00d7 Loading...'
        $.cache pathname, (-> ExpandThread.parse @, pathname, thread, a)

      when '\u00d7'
        a.textContent = a.textContent.replace '\u00d7 Loading...', '+'
        $.cache.requests[pathname].abort()

      when '-'
        a.textContent = a.textContent.replace '-', '+'
        #goddamit moot
        num = switch g.BOARD
          when 'b', 'vg' then 3
          when 't' then 1
          else 5
        table = $.x "following::br[@clear]/preceding::table[#{num}]", a
        while (prev = table.previousSibling) and (prev.nodeName isnt 'A')
          $.rm prev
        for backlink in $$ '.backlink', $ '.op', thread
          $.rm backlink if !$.id backlink.hash[1..]


  parse: (req, pathname, thread, a) ->
    if req.status isnt 200
      a.textContent = "#{req.status} #{req.statusText}"
      $.off a, 'click', ExpandThread.cb.toggle
      return

    a.textContent = a.textContent.replace '\u00d7 Loading...', '-'

    doc = d.implementation.createHTMLDocument null
    doc.documentElement.innerHTML = req.responseText

    nodes = []
    for reply in $$ '.reply', doc
      table = d.importNode reply.parentNode.parentNode.parentNode
      for quote in $$ '.quotelink', table
        if (href = quote.getAttribute 'href') is quote.hash #add pathname to normal quotes
          quote.pathname = pathname
        else if href isnt quote.href #fix x-thread links, not x-board ones
          quote.href = "res/#{href}"
      link = $ '.quotejs', table
      link.href = "res/#{thread.firstChild.id}##{reply.id}"
      link.nextSibling.href = "res/#{thread.firstChild.id}#q#{reply.id}"
      nodes.push table
    # eat everything, then replace with fresh full posts
    while (next = a.nextSibling) and not next.clear #br[clear]
      $.rm next
    $.before next, nodes

ReplyHiding =
  init: ->
    @td = $.el 'td',
      noWrap: true
      className: 'replyhider'
      innerHTML: '<a href="javascript:;">[ - ]</a>'
    Main.callbacks.push @node

  node: (post) ->
    return if post.class
    td = ReplyHiding.td.cloneNode true
    $.on td.firstChild, 'click', ReplyHiding.toggle
    $.replace post.el.previousSibling, td

    if post.id of g.hiddenReplies
      ReplyHiding.hide post.root

  toggle: ->
    parent = @parentNode
    if parent.className is 'replyhider'
      ReplyHiding.hide parent.parentNode.parentNode.parentNode
      id = parent.nextSibling.id
      for quote in $$ ".quotelink[href='##{id}'], .backlink[href='##{id}']"
        $.addClass quote, 'filtered'
      g.hiddenReplies[id] = Date.now()
    else
      table = parent.nextSibling
      table.hidden = false
      $.rm parent
      id = table.firstChild.firstChild.lastChild.id
      for quote in $$ ".quotelink[href='##{id}'], .backlink[href='##{id}']"
        $.removeClass quote, 'filtered'
      delete g.hiddenReplies[id]
    $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

  hide: (table) ->
    return if table.hidden # already hidden by filter

    table.hidden = true

    return unless Conf['Show Stubs']

    name = $('.commentpostername', table).textContent
    uid  = $('.posteruid',         table)?.textContent or ''
    trip = $('.postertrip',        table)?.textContent or ''

    div  = $.el 'div',
      className: 'stub'
      innerHTML: "<a href=javascript:;><span>[ + ]</span> #{name} #{uid} #{trip}</a>"
    $.on div.firstChild, 'click', ReplyHiding.toggle
    $.before table, div

Keybinds =
  init: ->
    for node in $$ '[accesskey]'
      node.removeAttribute 'accesskey'
    $.on d, 'keydown',  Keybinds.keydown

  keydown: (e) ->
    if not (key = Keybinds.keyCode(e)) or /TEXTAREA|INPUT/.test(e.target.nodeName) and not (e.altKey or e.ctrlKey or e.keyCode is 27)
      return

    thread = Nav.getThread()
    switch key
      # QR & Options
      when Conf.openQR
        Keybinds.qr thread, true
      when Conf.openEmptyQR
        Keybinds.qr thread
      when Conf.openOptions
        Options.dialog() unless $.id 'overlay'
      when Conf.close
        if o = $.id 'overlay'
          Options.close.call o
        else if QR.el
          QR.close()
      when Conf.submit
        QR.submit() if QR.el and !QR.status()
      when Conf.spoiler
        ta = e.target
        return if ta.nodeName isnt 'TEXTAREA'

        value    = ta.value
        selStart = ta.selectionStart
        selEnd   = ta.selectionEnd

        ta.value =
          value[...selStart] +
          '[spoiler]' + value[selStart...selEnd] + '[/spoiler]' +
          value[selEnd..]

        range = 9 + selEnd
        # Move the caret to the end of the selection.
        ta.setSelectionRange range, range
      # Thread related
      when Conf.watch
        Watcher.toggle thread
      when Conf.update
        Updater.update()
      when Conf.unreadCountTo0
        Unread.replies = []
        Unread.update()
      # Images
      when Conf.expandImage
        Keybinds.img thread
      when Conf.expandAllImages
        Keybinds.img thread, true
      # Board Navigation
      when Conf.zero
        window.location = "/#{g.BOARD}/0#0"
      when Conf.nextPage
        $('input[value=Next]')?.click()
      when Conf.previousPage
        $('input[value=Previous]')?.click()
      # Thread Navigation
      when Conf.nextThread
        return if g.REPLY
        Nav.scroll +1
      when Conf.previousThread
        return if g.REPLY
        Nav.scroll -1
      when Conf.expandThread
        ExpandThread.toggle thread
      when Conf.openThread
        Keybinds.open thread
      when Conf.openThreadTab
        Keybinds.open thread, true
      # Reply Navigation
      when Conf.nextReply
        Keybinds.hl +1, thread
      when Conf.previousReply
        Keybinds.hl -1, thread
      when Conf.hide
        ThreadHiding.toggle thread if /\bthread\b/.test thread.className
      else
        return
    e.preventDefault()

  keyCode: (e) ->
    key = switch kc = e.keyCode
      when 8
        ''
      when 27
        'Esc'
      when 37
        'Left'
      when 38
        'Up'
      when 39
        'Right'
      when 40
        'Down'
      when 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90 #0-9, A-Z
        c = String.fromCharCode kc
        if e.shiftKey then c else c.toLowerCase()
      else
        null
    if key
      if e.altKey  then key = 'alt+' + key
      if e.ctrlKey then key = 'ctrl+' + key
    key

  img: (thread, all) ->
    if all
      $.id('imageExpand').click()
    else
      thumb = $ 'img[md5]', $('.replyhl', thread) or thread
      ImageExpand.toggle thumb.parentNode

  qr: (thread, quote) ->
    if quote
      QR.quote.call $ '.quotejs + .quotejs', $('.replyhl', thread) or thread
    else
      QR.open()
    $('textarea', QR.el).focus()

  open: (thread, tab) ->
    id = thread.firstChild.id
    url = "//boards.4chan.org/#{g.BOARD}/res/#{id}"
    if tab
      $.open url
    else
      location.href = url

  hl: (delta, thread) ->
    if td = $ '.replyhl', thread
      td.className = 'reply'
      td.removeAttribute 'tabindex'
      rect = td.getBoundingClientRect()
      if rect.bottom >= 0 and rect.top <= d.body.clientHeight # We're at least partially visible
        next =
          if delta is +1
            $.x 'following::td[@class="reply"]', td
          else
            $.x 'preceding::td[@class="reply"]', td
        unless next
          td.className = 'replyhl'
          td.tabIndex  = 0
          td.focus()
          return
        return unless g.REPLY or $.x('ancestor::div[@class="thread"]', next) is thread
        rect = next.getBoundingClientRect()
        if rect.top < 0 or rect.bottom > d.body.clientHeight
          next.scrollIntoView delta is -1
        next.className = 'replyhl'
        next.tabIndex  = 0
        next.focus()
        return

    replies = $$ '.reply', thread
    replies.reverse() if delta is -1
    for reply in replies
      rect = reply.getBoundingClientRect()
      if delta is +1 and rect.top >= 0 or delta is -1 and rect.bottom <= d.body.clientHeight
        reply.className = 'replyhl'
        reply.tabIndex  = 0
        reply.focus()
        return

Nav =
  # ◀ ▶
  init: ->
    span = $.el 'span',
      id: 'navlinks'
    prev = $.el 'a',
      textContent: '▲'
      href: 'javascript:;'
    next = $.el 'a',
      textContent: '▼'
      href: 'javascript:;'

    $.on prev, 'click', @prev
    $.on next, 'click', @next

    $.add span, [prev, $.tn(' '), next]
    $.add d.body, span

  prev: ->
    if g.REPLY
      window.scrollTo 0, 0
    else
      Nav.scroll -1

  next: ->
    if g.REPLY
      window.scrollTo 0, d.body.scrollHeight
    else
      Nav.scroll +1

  getThread: (full) ->
    Nav.threads = $$ '.thread:not([hidden])'
    for thread, i in Nav.threads
      rect = thread.getBoundingClientRect()
      {bottom} = rect
      if bottom > 0 #we have not scrolled past
        if full
          return [thread, i, rect]
        return thread
    return $ 'form[name=delform]'

  scroll: (delta) ->
    [thread, i, rect] = Nav.getThread true
    {top} = rect

    #unless we're not at the beginning of the current thread
    # (and thus wanting to move to beginning)
    # or we're above the first thread and don't want to skip it
    unless (delta is -1 and Math.ceil(top) < 0) or (delta is +1 and top > 1)
      i += delta

    {top} = Nav.threads[i]?.getBoundingClientRect()
    window.scrollBy 0, top

QR =
  init: ->
    return unless $.id 'recaptcha_challenge_field_holder'
    Main.callbacks.push @node
    setTimeout @asyncInit

  asyncInit: ->
    if Conf['Hide Original Post Form']
      link = $.el 'h1', innerHTML: "<a href=javascript:;>#{if g.REPLY then 'Quick Reply' else 'New Thread'}</a>"
      $.on $('a', link), 'click', ->
        QR.open()
        $('select', QR.el).value = 'new' unless g.REPLY
        $('textarea', QR.el).focus()
      form = d.forms[0]
      $.before form, link

    # CORS is ignored for content script on Chrome, but not Safari/Oprah/Firefox.
    if /chrome/i.test navigator.userAgent
      QR.status ready: true
    else
      iframe = $.el 'iframe',
        id: 'iframe'
        src: 'https://sys.4chan.org/robots.txt'
      $.on iframe, 'error', -> @src = @src
      # Greasemonkey ghetto fix
      loadChecking = (iframe) ->
        unless QR.status.ready
          iframe.src = 'about:blank'
          setTimeout (-> iframe.src = 'https://sys.4chan.org/robots.txt'), 100
      $.on iframe, 'load', -> if @src isnt 'about:blank' then setTimeout loadChecking, 500, @
      $.add d.head, iframe

    # Prevent original captcha input from being focused on reload.
    script = $.el 'script', textContent: 'Recaptcha.focus_response_field=function(){}'
    $.add d.head, script
    $.rm script

    if Conf['Persistent QR']
      QR.dialog()
      QR.hide() if Conf['Auto Hide QR']
    $.on d, 'dragover',  QR.dragOver
    $.on d, 'drop',      QR.dropFile
    $.on d, 'dragstart', QR.drag
    $.on d, 'dragend',   QR.drag

  node: (post) ->
    $.on $('.quotejs + .quotejs', post.el), 'click', QR.quote

  open: ->
    if QR.el
      QR.el.hidden = false
      QR.unhide()
    else
      QR.dialog()
  close: ->
    QR.el.hidden = true
    QR.message.send req: 'abort'
    d.activeElement.blur()
    $.removeClass QR.el, 'dump'
    for i in QR.replies
      QR.replies[0].rm()
    QR.cooldown.auto = false
    QR.status()
    QR.resetFileInput()
    if not Conf['Remember Spoiler'] and (spoiler = $.id 'spoiler').checked
      spoiler.click()
    QR.cleanError()
  hide: ->
    d.activeElement.blur()
    $.addClass QR.el, 'autohide'
    $.id('autohide').checked = true
  unhide: ->
    $.removeClass QR.el, 'autohide'
    $.id('autohide').checked = false
  toggleHide: ->
    @checked and QR.hide() or QR.unhide()

  error: (err, node) ->
    el = $ '.warning', QR.el
    el.textContent = err
    $.replace el.firstChild, node if node
    QR.open()
    if /captcha|verification/i.test err
      # Focus the captcha input on captcha error.
      $('[autocomplete]', QR.el).focus()
    alert err if d.hidden or d.oHidden or d.mozHidden or d.webkitHidden
  cleanError: ->
    $('.warning', QR.el).textContent = null

  status: (data={}) ->
    if data.ready
      QR.status.ready  = true
      QR.status.banned = data.banned
    else unless QR.status.ready
      value    = 'Loading'
      disabled = true
    if g.dead
      value    = 404
      disabled = true
      QR.cooldown.auto = false
    else if QR.status.banned
      value    = 'Banned'
      disabled = true
    else
      # do not cancel `value = 'Loading'` once the cooldown is over
      value = QR.cooldown.seconds or data.progress or value
    return unless QR.el
    {input} = QR.status
    input.value =
      if QR.cooldown.auto and Conf['Cooldown']
        if value then "Auto #{value}" else 'Auto'
      else
        value or 'Submit'
    input.disabled = disabled or false

  cooldown:
    init: ->
      return unless Conf['Cooldown']
      QR.cooldown.start $.get "/#{g.BOARD}/cooldown", 0
      $.sync "/#{g.BOARD}/cooldown", QR.cooldown.start
    start: (timeout) ->
      seconds = Math.floor (timeout - Date.now()) / 1000
      QR.cooldown.count seconds
    set: (seconds) ->
      return unless Conf['Cooldown']
      QR.cooldown.count seconds
      $.set "/#{g.BOARD}/cooldown", Date.now() + seconds*$.SECOND
    count: (seconds) ->
      return unless 0 <= seconds <= 60
      setTimeout QR.cooldown.count, 1000, seconds-1
      QR.cooldown.seconds = seconds
      if seconds is 0
        $.delete "/#{g.BOARD}/cooldown"
        QR.submit() if QR.cooldown.auto
      QR.status()

  quote: (e) ->
    e?.preventDefault()
    QR.open()
    unless g.REPLY
      $('select', QR.el).value = $.x('ancestor::div[@class="thread"]', @).firstChild.id

    # Make sure we get the correct number, even with XXX censors
    id = @previousElementSibling.hash[1..]
    text = ">>#{id}\n"

    sel = window.getSelection()
    if (s = sel.toString()) and id is $.x('ancestor-or-self::blockquote/preceding-sibling::input', sel.anchorNode)?.name
      s = s.replace /\n/g, '\n>'
      text += ">#{s}\n"

    ta = $ 'textarea', QR.el
    caretPos = ta.selectionStart
    # Replace selection for text.
    # onchange event isn't triggered, save value.
    QR.selected.el.lastChild.textContent =
      QR.selected.com =
        ta.value =
          ta.value[...caretPos] + text + ta.value[ta.selectionEnd..]
    ta.focus()
    # Move the caret to the end of the new quote.
    ta.selectionEnd = ta.selectionStart = caretPos + text.length
    range = caretPos + text.length
    ta.setSelectionRange range, range

  drag: (e) ->
    # Let it drag anything from the page.
    i = if e.type is 'dragstart' then 'off' else 'on'
    $[i] d, 'dragover', QR.dragOver
    $[i] d, 'drop',     QR.dropFile
  dragOver: (e) ->
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy' # cursor feedback
  dropFile: (e) ->
    # Let it only handle files from the desktop.
    return unless e.dataTransfer.files.length
    e.preventDefault()
    QR.open()
    QR.fileInput.call e.dataTransfer
    $.addClass QR.el, 'dump'
  fileInput: ->
    QR.cleanError()
    # Set or change current reply's file.
    if @files.length is 1
      file = @files[0]
      if file.size > @max
        QR.error 'File too large.'
        QR.resetFileInput()
      else if -1 is QR.mimeTypes.indexOf file.type
        QR.error 'Unsupported file type.'
        QR.resetFileInput()
      else
        QR.selected.setFile file
      return
    # Create new replies with these files.
    for file in @files
      if file.size > @max
        QR.error "File #{file.name} is too large."
        break
      else if -1 is QR.mimeTypes.indexOf file.type
        QR.error "#{file.name}: Unsupported file type."
        break
      unless QR.replies[QR.replies.length - 1].file
        # set last reply's file
        QR.replies[QR.replies.length - 1].setFile file
      else
        new QR.reply().setFile file
    $.addClass QR.el, 'dump'
    QR.resetFileInput() # reset input
  resetFileInput: ->
    $('[type=file]', QR.el).value = null

  replies: []
  reply: class
    constructor: ->
      # set values, or null, to avoid 'undefined' values in inputs
      prev     = QR.replies[QR.replies.length-1]
      persona  = $.get 'QR.persona', {}
      @name    = if prev then prev.name else persona.name or null
      @email   = if prev and !/^sage$/.test prev.email then prev.email   else persona.email or null
      @sub     = if prev and Conf['Remember Subject']  then prev.sub     else if Conf['Remember Subject'] then persona.sub else null
      @spoiler = if prev and Conf['Remember Spoiler']  then prev.spoiler else false
      @com = null

      @el = $.el 'a',
        className: 'preview'
        draggable: true
        href: 'javascript:;'
        innerHTML: '<a class=remove>&times;</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
      $('input', @el).checked = @spoiler
      $.on @el,               'click',      => @select()
      $.on $('.remove', @el), 'click',  (e) =>
        e.stopPropagation()
        @rm()
      $.on $('label',   @el), 'click',  (e) => e.stopPropagation()
      $.on $('input',   @el), 'change', (e) =>
        @spoiler = e.target.checked
        $.id('spoiler').checked = @spoiler if @el.id is 'selected'
      $.before $('#addReply', QR.el), @el

      $.on @el, 'dragstart', @dragStart
      $.on @el, 'dragenter', @dragEnter
      $.on @el, 'dragleave', @dragLeave
      $.on @el, 'dragover',  @dragOver
      $.on @el, 'dragend',   @dragEnd
      $.on @el, 'drop',      @drop

      QR.replies.push @
    setFile: (@file) ->
      @el.title = file.name
      $('label', @el).hidden = false if QR.spoiler
      if file.type is 'application/pdf'
        @el.style.backgroundImage = null
        return
      url = window.URL or window.webkitURL
      url.revokeObjectURL @url

      # Create a redimensioned thumbnail.
      fileUrl = url.createObjectURL file
      img     = $.el 'img'

      $.on img, 'load', =>
        # Generate thumbnails only if they're really big.
        # Resized pictures through canvases look like ass,
        # so we generate thumbnails `s` times bigger then expected
        # to avoid crappy resized quality.
        s = 90*3
        if img.height < s or img.width < s
          @url = fileUrl
          @el.style.backgroundImage = "url(#{@url})"
          return
        if img.height <= img.width
          img.width  = s / img.height * img.width
          img.height = s
        else
          img.height = s / img.width  * img.height
          img.width  = s
        c = $.el 'canvas'
        c.height = img.height
        c.width  = img.width
        c.getContext('2d').drawImage img, 0, 0, img.width, img.height
        # Support for toBlob fucking when?
        data = atob c.toDataURL().split(',')[1]

        # DataUrl to Binary code from Aeosynth's 4chan X repo
        l = data.length
        ui8a = new Uint8Array l
        for i in  [0...l]
          ui8a[i] = data.charCodeAt i
        bb = new (window.MozBlobBuilder or window.WebKitBlobBuilder)()
        bb.append ui8a.buffer

        @url = url.createObjectURL bb.getBlob 'image/png'
        @el.style.backgroundImage = "url(#{@url})"
        url.revokeObjectURL fileUrl

      img.src = fileUrl
    rmFile: ->
      QR.resetFileInput()
      delete @file
      @el.title = null
      @el.style.backgroundImage = null
      $('label', @el).hidden = true if QR.spoiler
      (window.URL or window.webkitURL).revokeObjectURL @url
    select: ->
      QR.selected?.el.id = null
      QR.selected = @
      @el.id = 'selected'
      # Scroll the list to center the focused reply.
      rectEl   = @el.getBoundingClientRect()
      rectList = @el.parentNode.getBoundingClientRect()
      @el.parentNode.scrollLeft += rectEl.left + rectEl.width/2 - rectList.left - rectList.width/2
      # Load this reply's values.
      for data in ['name', 'email', 'sub', 'com']
        $("[name=#{data}]", QR.el).value = @[data]
      $('#spoiler', QR.el).checked = @spoiler
    dragStart: ->
      $.addClass    @, 'drag'
    dragEnter: ->
      $.addClass    @, 'over'
    dragLeave: ->
      $.removeClass @, 'over'
    dragOver: (e) ->
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    drop: ->
      el     = $ '.drag', @parentNode
      index  = (el) -> Array::slice.call(el.parentNode.children).indexOf el
      oldIndex = index el
      newIndex = index @
      if oldIndex < newIndex
        $.after  @, el
      else
        $.before @, el
      reply = QR.replies.splice(oldIndex, 1)[0]
      QR.replies.splice newIndex, 0, reply
    dragEnd: ->
      $.removeClass @, 'drag'
      if el = $ '.over', @parentNode
        $.removeClass el, 'over'
    rm: ->
      QR.resetFileInput()
      $.rm @el
      index = QR.replies.indexOf @
      if QR.replies.length is 1
        new QR.reply().select()
      else if @el.id is 'selected'
        (QR.replies[index-1] or QR.replies[index+1]).select()
      QR.replies.splice index, 1
      (window.URL or window.webkitURL).revokeObjectURL @url
      delete @

  captcha:
    init: ->
      @img       = $ '.captcha > img', QR.el
      @input     = $ '[autocomplete]', QR.el
      @challenge = $.id 'recaptcha_challenge_field_holder'
      $.on @img.parentNode, 'click',              @reload
      $.on @input,          'keydown',            @keydown
      $.on @challenge,      'DOMNodeInserted', => @load()
      $.sync 'captchas', (arr) => @count arr.length
      @count $.get('captchas', []).length
      # start with an uncached captcha
      @reload()
    save: ->
      return unless response = @input.value
      captchas = $.get 'captchas', []
      # Remove old captchas.
      while (captcha = captchas[0]) and captcha.time < Date.now()
        captchas.shift()
      captchas.push
        challenge: @challenge.firstChild.value
        response:  response
        time:      @timeout
      $.set 'captchas', captchas
      @count captchas.length
      @reload()
    load: ->
      # Timeout is available at RecaptchaState.timeout in seconds.
      @timeout  = Date.now() + 26*$.MINUTE
      challenge = @challenge.firstChild.value
      @img.alt  = challenge
      @img.src  = "http://www.google.com/recaptcha/api/image?c=#{challenge}"
      @input.value = null
    count: (count) ->
      @input.placeholder = switch count
        when 0
          'Verification (Shift + Enter to cache)'
        when 1
          'Verification (1 cached captcha)'
        else
          "Verification (#{count} cached captchas)"
      @input.alt = count # For XTRM RICE.
    reload: (focus) ->
      window.location = 'javascript:Recaptcha.reload()'
      # Focus if we meant to.
      QR.captcha.input.focus() if focus
    keydown: (e) ->
      c = QR.captcha
      if e.keyCode is 8 and not c.input.value
        c.reload()
      else if e.keyCode is 13 and e.shiftKey
        c.save()
      else
        return
      e.preventDefault()

  dialog: ->
    QR.el = UI.dialog 'qr', 'top:0;right:0;', '
<div class=move>
  Quick Reply <input type=checkbox id=autohide title=Auto-hide>
  <span> <a class=close title=Close>&times;</a></span>
</div>
<form>
  <div><input id=dump class=field type=button title="Dump list" value=+><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>
  <div id=replies><div><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>
  <div><textarea name=com title=Comment placeholder=Comment class=field></textarea></div>
  <div class=captcha title=Reload><img></div>
  <div><input title=Verification class=field autocomplete=off size=1></div>
  <div><input type=file title="Shift+Click to remove the selected file." multiple size=16><input type=submit></div>
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image</label>
  <div class=warning></div>
</form>'

    if Conf['Remember QR size'] and $.engine is 'gecko'
      $.on ta = $('textarea', QR.el), 'mouseup', ->
        $.set 'QR.size', @style.cssText
      ta.style.cssText = $.get 'QR.size', ''

    # Allow only this board's supported files.
    mimeTypes = $('.rules').firstChild.textContent.match(/: (.+) /)[1].toLowerCase().replace /\w+/g, (type) ->
      switch type
        when 'jpg'
          'image/jpeg'
        when 'pdf'
          'application/pdf'
        else
          "image/#{type}"
    QR.mimeTypes = mimeTypes.split ', '
    # Add empty mimeType to avoid errors with URLs selected in Window's file dialog.
    QR.mimeTypes.push ''
    fileInput        = $ '[type=file]', QR.el
    fileInput.max    = $('[name=MAX_FILE_SIZE]').value
    fileInput.accept = mimeTypes

    QR.spoiler     = !!$ '#com_submit + label'
    spoiler        = $ '#spoilerLabel', QR.el
    spoiler.hidden = !QR.spoiler

    unless g.REPLY
      # Make a list with visible threads and an option to create a new one.
      threads = '<option value=new>New thread</option>'
      for thread in $$ '.op'
        threads += "<option value=#{thread.id}>Thread #{thread.id}</option>"
      $.prepend $('.move > span', QR.el), $.el 'select'
        innerHTML: threads
        title: 'Create a new thread / Reply to a thread'
      $.on $('select',  QR.el), 'mousedown', (e) -> e.stopPropagation()
    $.on $('#autohide', QR.el), 'change',    QR.toggleHide
    $.on $('.close',    QR.el), 'click',     QR.close
    $.on $('#dump',     QR.el), 'click',     -> QR.el.classList.toggle 'dump'
    $.on $('#addReply', QR.el), 'click',     -> new QR.reply().select()
    $.on $('form',      QR.el), 'submit',    QR.submit
    $.on $('textarea',  QR.el), 'keyup',     -> QR.selected.el.lastChild.textContent = @value
    $.on fileInput,             'change',    QR.fileInput
    $.on fileInput,             'click',     (e) -> if e.shiftKey then QR.selected.rmFile() or e.preventDefault()
    $.on spoiler.firstChild,    'change',    -> $('input', QR.selected.el).click()
    $.on $('.warning',  QR.el), 'click',     QR.cleanError

    new QR.reply().select()
    # save selected reply's data
    for name in ['name', 'email', 'sub', 'com']
      input = $ "[name=#{name}]", QR.el
      for event in ['input', 'keyup', 'change', 'paste']
        # The input event replaces keyup, change and paste events.
        # Firefox 12 will support the input event.
        # Oprah?
        $.on input, event, ->
          QR.selected[@name] = @value
          # Disable auto-posting if you're typing in the first reply
          # during the last 5 seconds of the cooldown.
          if QR.cooldown.auto and QR.selected is QR.replies[0] and parseInt(QR.status.input.value.match /\d+/) < 6
            QR.cooldown.auto = false
    # sync between tabs
    $.sync 'QR.persona', (persona) ->
      return unless QR.el.hidden
      for key, val of persona
        QR.selected[key] = val
        $("[name=#{key}]", QR.el).value = val

    QR.status.input = $ '[type=submit]', QR.el
    QR.status()
    QR.cooldown.init()
    QR.captcha.init()
    $.add d.body, QR.el

    # Create a custom event when the QR dialog is first initialized.
    # Use it to extend the QR's functionalities, or for XTRM RICE.
    e = d.createEvent 'CustomEvent'
    e.initEvent 'QRDialogCreation', true, false
    QR.el.dispatchEvent e

  submit: (e) ->
    e?.preventDefault()
    if QR.cooldown.seconds
      QR.cooldown.auto = !QR.cooldown.auto
      QR.status()
      return
    QR.message.send req: 'abort'
    reply = QR.replies[0]

    # prevent errors
    unless reply.com or reply.file
      err = 'No file selected.'
    else
      # get oldest valid captcha
      captchas = $.get 'captchas', []
      # remove old captchas
      while (captcha = captchas[0]) and captcha.time < Date.now()
        captchas.shift()
      if captcha  = captchas.shift()
        challenge = captcha.challenge
        response  = captcha.response
      else
        challenge   = QR.captcha.img.alt
        if response = QR.captcha.input.value then QR.captcha.reload()
      $.set 'captchas', captchas
      QR.captcha.count captchas.length
      unless response
        err = 'No valid captcha.'

    if err
      # stop auto-posting
      QR.cooldown.auto = false
      QR.status()
      QR.error err
      return
    QR.cleanError()

    threadID = g.THREAD_ID or $('select', QR.el).value

    # Enable auto-posting if we have stuff to post, disable it otherwise.
    QR.cooldown.auto = QR.replies.length > 1
    if Conf['Auto Hide QR'] and not QR.cooldown.auto
      QR.hide()
    if Conf['Thread Watcher'] and Conf['Auto Watch Reply'] and threadID isnt 'new'
      Watcher.watch threadID

    post =
      postURL: $('form[name=post]').action
      resto:   threadID
      name:    reply.name
      email:   reply.email
      sub:     reply.sub
      com:     reply.com
      upfile:  reply.file
      spoiler: reply.spoiler
      mode:    'regist'
      pwd: if m = d.cookie.match(/4chan_pass=([^;]+)/) then decodeURIComponent m[1] else $('[name=pwd]').value
      recaptcha_challenge_field: challenge
      recaptcha_response_field:  response + ' '

    # Starting to upload might take some time.
    # Provide some feedback that we're starting to submit.
    QR.status progress: '...'

    if $.engine is 'gecko' and reply.file
      # https://bugzilla.mozilla.org/show_bug.cgi?id=673742
      # We plan to allow postMessaging Files and FileLists across origins,
      # that just needs a more in depth security review.
      file = {}
      reader = new FileReader()
      reader.onload = ->
        file.buffer = @result
        file.name   = reply.file.name
        file.type   = reply.file.type
        post.upfile = file
        QR.message.send post
      reader.readAsBinaryString reply.file
      return

    # CORS is ignored for content script on Chrome, but not Safari/Oprah/Firefox.
    if /chrome/i.test navigator.userAgent
      QR.message.post post
      return
    QR.message.send post

  response: (html) ->
    doc = $.el 'a', innerHTML: html
    # Check for ban.
    if $('title', doc).textContent is '4chan - Banned'
      QR.status ready: true, banned: true
      return
    unless b = $ 'td b', doc
      err = 'Connection error with sys.4chan.org.'
    else if b.childElementCount # error!
      if b.firstChild.tagName # duplicate image link
        node = b.firstChild
        node.target = '_blank'
      err = b.firstChild.textContent

    if err
      if /captcha|verification/i.test(err) or err is 'Connection error with sys.4chan.org.'
        # Enable auto-post if we have some cached captchas.
        QR.cooldown.auto = !!$.get('captchas', []).length
        # Too many frequent mistyped captchas will auto-ban you!
        # On connection error, the post most likely didn't go through.
        QR.cooldown.set 2
      else # stop auto-posting
        QR.cooldown.auto = false
      QR.status()
      QR.error err, node
      return

    reply = QR.replies[0]

    persona = $.get 'QR.persona', {}
    persona =
      name:  reply.name
      email: if /^sage$/.test reply.email then persona.email else reply.email
      sub:   if Conf['Remember Subject']  then reply.sub     else null
    $.set 'QR.persona', persona

    [_, thread, postNumber] = b.lastChild.textContent.match /thread:(\d+),no:(\d+)/
    if thread is '0' # new thread
      if Conf['Thread Watcher'] and Conf['Auto Watch']
        $.set 'autoWatch', postNumber
      # auto-noko
      location.pathname = "/#{g.BOARD}/res/#{postNumber}"
    else
      # Enable auto-posting if we have stuff to post, disable it otherwise.
      QR.cooldown.auto = QR.replies.length > 1
      QR.cooldown.set if /sage/i.test reply.email then 60 else 30
      if Conf['Open Reply in New Tab'] && !g.REPLY && !QR.cooldown.auto
        $.open "//boards.4chan.org/#{g.BOARD}/res/#{thread}##{postNumber}"

    if Conf['Persistent QR'] or QR.cooldown.auto
      reply.rm()
    else
      QR.close()

    if g.REPLY and (Conf['Unread Count'] or Conf['Unread Favicon'])
      Unread.foresee.push postNumber
    if g.REPLY and Conf['Thread Updater'] and Conf['Auto Update This']
      Updater.update()

    QR.status()
    QR.resetFileInput()

  message:
    send: (data) ->
      # CORS is ignored for content script on Chrome, but not Safari/Oprah/Firefox.
      if /chrome/i.test navigator.userAgent
        QR.message.receive data
        return
      data.QR = true
      host = location.hostname
      window =
        if host is 'boards.4chan.org'
          $.id('iframe').contentWindow
        else
          parent
      window.postMessage data, '*'
    receive: (data) ->
      req = data.req
      delete data.req
      delete data.QR
      switch req
        when 'abort'
          QR.ajax?.abort()
          QR.message.send req: 'status'
        when 'response' # xhr response
          QR.response data.html
        when 'status'
          QR.status data
        else
          QR.message.post data # Reply object: we're posting

    post: (data) ->

      url = data.postURL
      # Do not append these values to the form.
      delete data.postURL

      # File with filename upload fix from desuwa
      if $.engine is 'gecko' and data.upfile
        # All of this is fucking retarded.
        unless data.binary
          toBin = (data, name, val) ->
            bb = new MozBlobBuilder()
            bb.append val
            r = new FileReader()
            r.onload = ->
              data[name] = r.result
              unless --i
                QR.message.post data
            r.readAsBinaryString bb.getBlob 'text/plain'
          i = Object.keys(data).length
          for name, val of data
            if typeof val is 'object' # File. toBin the filename.
              toBin data.upfile, 'name', data.upfile.name
            else if typeof val is 'boolean'
              if val
                toBin data, name, String val
              else
                i--
            else
              toBin data, name, val
          data.postURL = url
          data.binary  = true
          return

        delete data.binary

        boundary = '-------------SMCD' + Date.now();
        parts = []
        parts.push 'Content-Disposition: form-data; name="upfile"; filename="' + data.upfile.name + '"\r\n' + 'Content-Type: ' + data.upfile.type + '\r\n\r\n' + data.upfile.buffer + '\r\n'
        delete data.upfile

        for name, val of data
          parts.push 'Content-Disposition: form-data; name="' + name + '"\r\n\r\n' + val + '\r\n' if val
        form = '--' + boundary + '\r\n' + parts.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n'

      else
        form = new FormData()
        for name, val of data
          form.append name, val if val

      callbacks =
        onload: ->
          QR.message.send
            req:  'response'
            html: @response
      opts =
        form: form
        type: 'post'
        upCallbacks:
          onload: ->
            QR.message.send
              req:      'status'
              progress: '...'
          onprogress: (e) ->
            QR.message.send
              req:      'status'
              progress: "#{Math.round e.loaded / e.total * 100}%"
      if boundary
        opts.headers =
          'Content-Type': 'multipart/form-data;boundary=' + boundary

      try
        QR.ajax = $.ajax url, callbacks, opts
      catch e
        # CORS disabled error: redirecting to banned page ;_;
        if e.name is 'NETWORK_ERR'
          QR.message.send req: 'status', ready: true, banned: true

Options =
  init: ->
    for home in [$.id('navtopr'), $.id('navbotr')]
      a = $.el 'a',
        textContent: '4chan X'
        href: 'javascript:;'
      $.on a, 'click', Options.dialog
      $.replace home.firstElementChild, a
    unless $.get 'firstrun'
      $.set 'firstrun', true
      Options.dialog()

  dialog: ->
    dialog = $.el 'div'
      id: 'options'
      className: 'reply dialog'
      innerHTML: '<div id=optionsbar>
  <div id=credits>
    <a target=_blank href=http://mayhemydg.github.com/4chan-x/>4chan X</a>
    | <a target=_blank href=https://raw.github.com/mayhemydg/4chan-x/master/changelog>' + Main.version + '</a>
    | <a target=_blank href=http://mayhemydg.github.com/4chan-x/#bug-report>Issues</a>
  </div>
  <div>
    <label for=main_tab>Main</label>
    | <label for=filter_tab>Filter</label>
    | <label for=sauces_tab>Sauce</label>
    | <label for=rice_tab>Rice</label>
    | <label for=keybinds_tab>Keybinds</label>
  </div>
</div>
<hr>
<div id=content>
  <input type=radio name=tab hidden id=main_tab checked>
  <div></div>
  <input type=radio name=tab hidden id=sauces_tab>
  <div>
    <div class=warning><code>Sauce</code> is disabled.</div>
    Lines starting with a <code>#</code> will be ignored.
    <ul>These parameters will be replaced by their corresponding values:
      <li>$1: Thumbnail url.</li>
      <li>$2: Full image url.</li>
      <li>$3: MD5 hash.</li>
      <li>$4: Current board.</li>
    </ul>
    <textarea name=sauces id=sauces></textarea>
  </div>
  <input type=radio name=tab hidden id=filter_tab>
  <div>
    <div class=warning><code>Filter</code> is disabled.</div>
    Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>
    Lines starting with a <code>#</code> will be ignored.<br>
    For example, <code>/weeaboo/i</code> will filter posts containing `weeaboo` case-insensitive.
    <ul>You can use these settings with each regular expression, separate them with semicolons:
      <li>Per boards, separate them with commas. It is global if not specified.<br>For example: <code>boards:a,jp;</code>.</li>
      <li>Filter OPs only along with their threads (`only`), replies only (`no`, this is default), or both (`yes`).<br>For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.</li>
      <li>Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.</li>
      <li>Highlighted OPs will have their threads put on top of board pages by default.<br>For example: <code>top:yes</code> or <code>top:no</code>.</li>
    </ul>
    <p>Name:<br><textarea name=name></textarea></p>
    <p>Unique ID:<br><textarea name=uniqueid></textarea></p>
    <p>Tripcode:<br><textarea name=tripcode></textarea></p>
    <p>Admin/Mod:<br><textarea name=mod></textarea></p>
    <p>E-mail:<br><textarea name=email></textarea></p>
    <p>Subject:<br><textarea name=subject></textarea></p>
    <p>Comment:<br><textarea name=comment></textarea></p>
    <p>Filename:<br><textarea name=filename></textarea></p>
    <p>Image dimensions:<br><textarea name=dimensions></textarea></p>
    <p>Filesize:<br><textarea name=filesize></textarea></p>
    <p>Image MD5 (uses exact string matching, not regular expressions):<br><textarea name=md5></textarea></p>
  </div>
  <input type=radio name=tab hidden id=rice_tab>
  <div>
    <div class=warning><code>Quote Backlinks</code> are disabled.</div>
    <ul>
      Backlink formatting
      <li><input type=text name=backlink> : <span id=backlinkPreview></span></li>
    </ul>
    <div class=warning><code>Time Formatting</code> is disabled.</div>
    <ul>
      Time formatting
      <li><input type=text name=time> : <span id=timePreview></span></li>
      <li>Supported <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</li>
      <li>Day: %a, %A, %d, %e</li>
      <li>Month: %m, %b, %B</li>
      <li>Year: %y</li>
      <li>Hour: %k, %H, %l (lowercase L), %I (uppercase i), %p, %P</li>
      <li>Minutes: %M</li>
    </ul>
    <div class=warning><code>File Info Formatting</code> is disabled.</div>
    <ul>
      Thread File Info Formatting
      <li><input type=text name=fileInfoT> : <span id=fileInfoTPreview></span></li>
      <li>Link: %l (lowercase L)</li>
      <li>Size: %B (Bytes), %K (KB), %M (MB), %s (4chan default)</li>
      <li>Resolution: %r (Displays PDF on /po/, for PDFs)</li>
      Reply File Info Formatting
      <li><input type=text name=fileInfoR> : <span id=fileInfoRPreview></span></li>
      <li>All thread formatters also work for reply formatting.</li>
      <li>Link (with original file name): %l (lowercase L)(Truncated), %L (Untruncated)</li>
      <li>Original file name: %n (Truncated), %N (Untruncated)</li>
    </ul>
    <div class=warning><code>Unread Favicon</code> is disabled.</div>
    Unread favicons<br>
    <select name=favicon>
      <option value=ferongr>ferongr</option>
      <option value=xat->xat-</option>
      <option value=Mayhem>Mayhem</option>
      <option value=Original>Original</option>
    </select>
    <span></span>
  </div>
  <input type=radio name=tab hidden id=keybinds_tab>
  <div>
    <div class=warning><code>Keybinds</code> are disabled.</div>
    <div>Allowed keys: Ctrl, Alt, a-z, A-Z, 0-9, Up, Down, Right, Left.</div>
    <table><tbody>
      <tr><th>Actions</th><th>Keybinds</th></tr>
    </tbody></table>
  </div>
</div>'

    #main
    for key, obj of Config.main
      ul = $.el 'ul',
        textContent: key
      for key, arr of obj
        checked = if Conf[key] then 'checked' else ''
        description = arr[1]
        li = $.el 'li',
          innerHTML: "<label><input type=checkbox name=\"#{key}\" #{checked}>#{key}</label><span class=description>: #{description}</span>"
        $.on $('input', li), 'click', $.cb.checked
        $.add ul, li
      $.add $('#main_tab + div', dialog), ul

    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length
    li = $.el 'li',
      innerHTML: "<button>hidden: #{hiddenNum}</button> <span class=description>: Forget all hidden posts. Useful if you accidentally hide a post and have \"Show Stubs\" disabled."
    $.on $('button', li), 'click', Options.clearHidden
    $.add $('ul:nth-child(2)', dialog), li

    #filter & sauce
    for ta in $$ 'textarea', dialog
      ta.textContent = Conf[ta.name]
      $.on ta, 'change', $.cb.value

    #rice
    (back         = $ '[name=backlink]',     dialog).value = Conf['backlink']
    (time         = $ '[name=time]',         dialog).value = Conf['time']
    (fileInfoR = $ '[name=fileInfoR]', dialog).value = Conf['fileInfoR']
    (fileInfoT = $ '[name=fileInfoT]', dialog).value = Conf['fileInfoT']
    $.on back, 'keyup', $.cb.value
    $.on back, 'keyup', Options.backlink
    $.on time, 'keyup', $.cb.value
    $.on time, 'keyup', Options.time
    $.on fileInfoR, 'keyup', $.cb.value
    $.on fileInfoR, 'keyup', Options.fileInfo
    $.on fileInfoT, 'keyup', $.cb.value
    $.on fileInfoT, 'keyup', Options.fileInfo
    favicon = $ 'select', dialog
    favicon.value = Conf['favicon']
    $.on favicon, 'change', $.cb.value
    $.on favicon, 'change', Options.favicon

    #keybinds
    for key, arr of Config.hotkeys
      tr = $.el 'tr',
        innerHTML: "<td>#{arr[1]}</td><td><input name=#{key}></td>"
      input = $ 'input', tr
      input.value = Conf[key]
      $.on input, 'keydown', Options.keybind
      $.add $('#keybinds_tab + div tbody', dialog), tr

    #indicate if the settings require a feature to be enabled
    indicators = {}
    for indicator in $$ '.warning', dialog
      key = indicator.firstChild.textContent
      indicator.hidden = Conf[key]
      indicators[key] = indicator
      $.on $("[name='#{key}']", dialog), 'click', ->
        indicators[@name].hidden = @checked

    overlay = $.el 'div', id: 'overlay'
    $.on overlay, 'click', Options.close
    $.on dialog,  'click', (e) -> e.stopPropagation()
    $.add overlay, dialog
    $.add d.body, overlay
    d.body.style.setProperty 'overflow', 'hidden', null

    Options.backlink.call back
    Options.time.call     time
    Options.fileInfo.call fileInfoR
    Options.fileInfo.call fileInfoT
    Options.favicon.call  favicon

  close: ->
    $.rm this
    d.body.style.removeProperty 'overflow'

  clearHidden: ->
    #'hidden' might be misleading; it's the number of IDs we're *looking* for,
    # not the number of posts actually hidden on the page.
    $.delete "hiddenReplies/#{g.BOARD}/"
    $.delete "hiddenThreads/#{g.BOARD}/"
    @textContent = "hidden: 0"
    g.hiddenReplies = {}
  keybind: (e) ->
    return if e.keyCode is 9
    e.preventDefault()
    e.stopPropagation()
    return unless (key = Keybinds.keyCode e)?
    @value = key
    $.cb.value.call @
  time: ->
    Time.foo()
    Time.date = new Date()
    $.id('timePreview').textContent = Time.funk Time
  backlink: ->
    $.id('backlinkPreview').textContent = Conf['backlink'].replace /%id/, '123456789'
  fileInfo: ->
    type = if @name is 'fileInfoR' then 0 else 1
    FileInfo.data =
      link:       '<a href="javascript:;">1329791824.png</a>'
      size:       996
      unit:       'KB'
      resolution: '1366x768'
      fullname:   '[a.f.k.] Sayonara Zetsubou Sensei - 09.avi_snapshot_03.34_[2011.02.20_06.58.00].jpg'
      shortname:  '[a.f.k.] Sayonara Zetsubou Sen(...).jpg'
      type:       type
    FileInfo.setFormats()
    $.id("#{@name}Preview").innerHTML = FileInfo.funks[type] FileInfo
  favicon: ->
    Favicon.switch()
    Unread.update true
    @nextElementSibling.innerHTML = "<img src=#{Favicon.unreadSFW}> <img src=#{Favicon.unreadNSFW}> <img src=#{Favicon.unreadDead}>"

Threading =
  op: (node) ->
    nodes = []
    until node.nodeName is 'BLOCKQUOTE'
      nodes.push node
      node = node.nextSibling
    nodes.push node # Add the blockquote.
    node = node.nextSibling
    op = $.el 'div',
      className: 'op'
    $.add op, nodes
    op.id = $('input', op).name
    $.before node, op

  thread: (node) ->
    node = Threading.op node

    return if g.REPLY

    nodes = []
    until node.nodeName is 'HR'
      nodes.push node
      node = node.nextElementSibling # Skip text nodes.
    div = $.el 'div',
      className: 'thread'
    $.add div, nodes
    $.before node, div

    node = node.nextElementSibling
    # {N,}SFW
    unless node.align or node.nodeName is 'CENTER'
      Threading.thread node

ThreadHiding =
  init: ->
    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    for thread in $$ '.thread'
      op = thread.firstChild
      a  = $.el 'a',
        textContent: '[ - ]'
        href: 'javascript:;'
      $.on a, 'click', ThreadHiding.cb
      $.prepend op, a

      if op.id of hiddenThreads
        ThreadHiding.hide thread
    return

  cb: ->
    ThreadHiding.toggle @parentNode.parentNode

  toggle: (thread) ->
    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    id = $('.op', thread).id
    if thread.hidden or thread.firstChild.className is 'block'
      ThreadHiding.show thread
      delete hiddenThreads[id]
    else
      ThreadHiding.hide thread
      hiddenThreads[id] = Date.now()
    $.set "hiddenThreads/#{g.BOARD}/", hiddenThreads

  hide: (thread) ->
    unless Conf['Show Stubs']
      thread.hidden = true
      thread.nextSibling.hidden = true
      return

    return if thread.firstChild.className is 'block' # already hidden by filter

    num  = 0
    if span = $ '.omittedposts', thread
      num = Number span.textContent.match(/\d+/)[0]
    num += $$('.op ~ table', thread).length
    text = if num is 1 then '1 reply' else "#{num} replies"
    op   = $ '.op', thread
    name = $('.postername', op).textContent
    uid  = $('.posteruid',  op)?.textContent or ''
    trip = $('.postertrip', op)?.textContent or ''

    a = $.el 'a',
      innerHTML: "<span>[ + ]</span> #{name} #{uid} #{trip} (#{text})"
      href: 'javascript:;'
    $.on a, 'click', ThreadHiding.cb

    div = $.el 'div',
      className: 'block'

    $.add div, a
    $.prepend thread, div

  show: (thread, id) ->
    $.rm $ '.block', thread
    thread.hidden = false
    thread.nextSibling.hidden = false

Updater =
  init: ->
    html = "<div class=move><span id=count></span> <span id=timer>-#{Conf['Interval']}</span></div>"
    {checkbox} = Config.updater
    for name of checkbox
      title = checkbox[name][1]
      checked = if Conf[name] then 'checked' else ''
      html += "<div><label title='#{title}'>#{name}<input name='#{name}' type=checkbox #{checked}></label></div>"

    checked = if Conf['Auto Update'] then 'checked' else ''
    html += "
      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox #{checked}></label></div>
      <div><label>Interval (s)<input name=Interval value=#{Conf['Interval']} type=text></label></div>
      <div><input value='Update Now' type=button></div>"

    dialog = UI.dialog 'updater', 'bottom: 0; right: 0;', html

    @count = $ '#count', dialog
    @timer = $ '#timer', dialog
    @br    = $ 'br[clear]'

    for input in $$ 'input', dialog
      if input.type is 'checkbox'
        $.on input, 'click', $.cb.checked
        if input.name is 'Scroll BG'
          $.on input, 'click', @cb.scrollBG
          @cb.scrollBG.call input
        if input.name is 'Verbose'
          $.on input, 'click', @cb.verbose
          @cb.verbose.call input
        else if input.name is 'Auto Update This'
          $.on input, 'click', @cb.autoUpdate
          @cb.autoUpdate.call input
          # Required for the QR's update after posting.
          Conf[input.name] = input.checked
      else if input.name is 'Interval'
        $.on input, 'change', -> Conf['Interval'] = @value = parseInt(@value, 10) or Conf['Interval']
        $.on input, 'change', $.cb.value
      else if input.type is 'button'
        $.on input, 'click', @update

    $.add d.body, dialog

    @retryCoef = 10
    @lastModified = 0

  cb:
    verbose: ->
      if Conf['Verbose']
        Updater.count.textContent = '+0'
        Updater.timer.hidden = false
      else
        $.extend Updater.count,
          className: ''
          textContent: 'Thread Updater'
        Updater.timer.hidden = true
    autoUpdate: ->
      if @checked
        Updater.timeoutID = setTimeout Updater.timeout, 1000
      else
        clearTimeout Updater.timeoutID
    scrollBG: ->
      Updater.scrollBG =
        if @checked
          -> true
        else
          -> !(d.hidden or d.oHidden or d.mozHidden or d.webkitHidden)
    update: ->
      if @status is 404
        Updater.timer.textContent = ''
        Updater.count.textContent = 404
        Updater.count.className   = 'warning'
        clearTimeout Updater.timeoutID
        g.dead = true
        if Conf['Unread Count']
          Unread.title = Unread.title.match(/^.+-/)[0] + ' 404'
        else
          d.title = d.title.match(/^.+-/)[0] + ' 404'
        Unread.update true
        QR.message.send req: 'abort'
        QR.status()
        return

      Updater.retryCoef = 10
      Updater.timer.textContent = '-' + Conf['Interval']

      ###
      Status Code 304: Not modified
      By sending the `If-Modified-Since` header we get a proper status code, and no response.
      This saves bandwidth for both the user and the servers, avoid unnecessary computation,
      and won't load images and scripts when parsing the response.
      ###
      if @status is 304
        if Conf['Verbose']
          Updater.count.textContent = '+0'
          Updater.count.className = null
        return
      Updater.lastModified = @getResponseHeader 'Last-Modified'

      doc = d.implementation.createHTMLDocument null
      doc.documentElement.innerHTML = @responseText

      id = $('input', Updater.br.previousElementSibling).name
      nodes = []
      for reply in $$('.reply', doc).reverse()
        break if reply.id <= id #make sure to not insert older posts
        nodes.push reply.parentNode.parentNode.parentNode #table

      newPosts = nodes.length
      scroll = Conf['Scrolling'] && Updater.scrollBG() && newPosts &&
        Updater.br.previousElementSibling.getBoundingClientRect().bottom - d.body.clientHeight < 25
      if Conf['Verbose']
        Updater.count.textContent = "+#{newPosts}"
        Updater.count.className = if newPosts then 'new' else null

      $.before Updater.br, nodes.reverse()
      if scroll
        Updater.br.previousSibling.scrollIntoView()

  timeout: ->
    Updater.timeoutID = setTimeout Updater.timeout, 1000
    n = 1 + Number Updater.timer.textContent

    if n is 0
      Updater.update()
    else if n is Updater.retryCoef
      Updater.retryCoef += 10 * (Updater.retryCoef < 120)
      Updater.retry()
    else
      Updater.timer.textContent = n

  retry: ->
    @count.textContent = 'Retry'
    @count.className = ''
    @update()

  update: ->
    Updater.timer.textContent = 0
    Updater.request?.abort()
    #fool the cache
    url = location.pathname + '?' + Date.now()
    Updater.request = $.ajax url, onload: Updater.cb.update,
      headers: 'If-Modified-Since': Updater.lastModified

Watcher =
  init: ->
    html = '<div class=move>Thread Watcher</div>'
    @dialog = UI.dialog 'watcher', 'top: 50px; left: 0px;', html
    $.add d.body, @dialog

    #add watch buttons
    inputs = $$ '.op > input'
    for input in inputs
      favicon = $.el 'img',
        className: 'favicon'
      $.on favicon, 'click', @cb.toggle
      $.before input, favicon

    if g.THREAD_ID is $.get 'autoWatch', 0
      @watch g.THREAD_ID
      $.delete 'autoWatch'
    else
      #populate watcher, display watch buttons
      @refresh()

    $.sync 'watched', @refresh

  refresh: (watched) ->
    watched or= $.get 'watched', {}
    nodes = []
    for board of watched
      for id, props of watched[board]
        x = $.el 'a',
          # \u00d7 is &times;
          textContent: '\u00d7'
          href: 'javascript:;'
        $.on x, 'click', Watcher.cb.x
        link = $.el 'a', props
        link.title = link.textContent

        div = $.el 'div'
        $.add div, [x, $.tn(' '), link]
        nodes.push div

    for div in $$ 'div:not(.move)', Watcher.dialog
      $.rm div
    $.add Watcher.dialog, nodes

    watchedBoard = watched[g.BOARD] or {}
    for favicon in $$ '.favicon'
      id = favicon.nextSibling.name
      if id of watchedBoard
        favicon.src = Favicon.default
      else
        favicon.src = Favicon.empty
    return

  cb:
    toggle: ->
      Watcher.toggle @parentNode
    x: ->
      thread = @nextElementSibling.pathname.split '/'
      Watcher.unwatch thread[3], thread[1]

  toggle: (thread) ->
    id = $('.favicon + input', thread).name
    Watcher.watch(id) or Watcher.unwatch id, g.BOARD

  unwatch: (id, board) ->
    watched = $.get 'watched', {}
    delete watched[board][id]
    $.set 'watched', watched
    Watcher.refresh()

  watch: (id) ->
    thread = $.id id
    return false if $('.favicon', thread).src is Favicon.default

    watched = $.get 'watched', {}
    watched[g.BOARD] or= {}
    watched[g.BOARD][id] =
      href: "/#{g.BOARD}/res/#{id}"
      textContent: GetTitle thread
    $.set 'watched', watched
    Watcher.refresh()
    true

Anonymize =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.class is 'inline'
    name = $ '.commentpostername, .postername', post.el
    name.textContent = 'Anonymous'
    node = name.nextElementSibling
    if node.className is 'postertrip' or node.nodeName is 'A'
      $.rm node

Sauce =
  init: ->
    return if g.BOARD is 'f'
    @links = []
    for link in Conf['sauces'].split '\n'
      continue if link[0] is '#'
      @links.push @createSauceLink link
    return unless @links.length
    Main.callbacks.push @node

  createSauceLink: (link) ->
    domain = link.match(/(\w+)\.\w+\//)[1]
    href   = link.replace /(\d)/g, (parameter) ->
      switch parameter
        when '$1'
          "http://thumbs.4chan.org' + img.pathname.replace(/src(\\/\\d+).+$/, 'thumb$1s.jpg') + '"
        when '$2'
          "' + img.href + '"
        when '$3'
          "' + img.firstChild.getAttribute('md5').replace(/\=*$/, '') + '"
        when '$4'
          g.BOARD
    href = Function 'img', "return '#{href}'"
    el = $.el 'a',
      target: '_blank'
      textContent: domain
    (img) ->
      a = el.cloneNode true
      a.href = href img
      a

  node: (post) ->
    {img} = post
    return if post.class is 'inline' or not img
    img   = img.parentNode
    nodes = []
    for link in Sauce.links
      nodes.push $.tn(' '), link img
    $.add post.filesize, nodes

RevealSpoilers =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    {img} = post
    if not (img and /^Spoil/.test img.alt) or post.class is 'inline'
      return
    img.removeAttribute 'height'
    img.removeAttribute 'width'
    img.src = "//thumbs.4chan.org#{img.parentNode.pathname.replace(/src(\/\d+).+$/, 'thumb$1s.jpg')}"

Time =
  init: ->
    Time.foo()

    # GMT -8 is given as +480; would GMT +8 be -480 ?
    chanOffset = 5 - new Date().getTimezoneOffset() / 60
    # 4chan = EST = GMT -5
    chanOffset-- if $.isDST()

    @parse =
      if Date.parse('10/11/11(Tue)18:53') is 1318351980000
        (node) -> new Date Date.parse(node.textContent) + chanOffset*$.HOUR
      else # Firefox and Opera do not parse 4chan's time format correctly
        (node) ->
          [_, month, day, year, hour, min] =
            node.textContent.match /(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\d+)/
          year = "20#{year}"
          month -= 1 #months start at 0
          hour = chanOffset + Number hour
          new Date year, month, day, hour, min

    Main.callbacks.push @node
  node: (post) ->
    return if post.class is 'inline'
    # .posttime exists on every board except /f/
    node = $('.posttime', post.el) or $('span[id]', post.el).previousSibling
    Time.date = Time.parse node
    time = $.el 'time',
      textContent: ' ' + Time.funk(Time) + ' '
    $.replace node, time
  foo: ->
    code = Conf['time'].replace /%([A-Za-z])/g, (s, c) ->
      if c of Time.formatters
        "' + Time.formatters.#{c}() + '"
      else
        s
    Time.funk = Function 'Time', "return '#{code}'"
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
  zeroPad: (n) -> if n < 10 then '0' + n else n
  formatters:
    a: -> Time.day[Time.date.getDay()][...3]
    A: -> Time.day[Time.date.getDay()]
    b: -> Time.month[Time.date.getMonth()][...3]
    B: -> Time.month[Time.date.getMonth()]
    d: -> Time.zeroPad Time.date.getDate()
    e: -> Time.date.getDate()
    H: -> Time.zeroPad Time.date.getHours()
    I: -> Time.zeroPad Time.date.getHours() % 12 or 12
    k: -> Time.date.getHours()
    l: -> Time.date.getHours() % 12 or 12
    m: -> Time.zeroPad Time.date.getMonth() + 1
    M: -> Time.zeroPad Time.date.getMinutes()
    p: -> if Time.date.getHours() < 12 then 'AM' else 'PM'
    P: -> if Time.date.getHours() < 12 then 'am' else 'pm'
    y: -> Time.date.getFullYear() - 2000

FileInfo =
  init: ->
    return if g.BOARD is 'f'
    @setFormats()
    Main.callbacks.push @node
  node: (post) ->
    return if post.class is 'inline' or not node = post.filesize
    type   = if node.childElementCount is 2 then 0 else 1
    regexp =
      if type
        /^File: (<.+>)-\((?:Spoiler Image, )?([\d\.]+) (\w+), (\d+x\d+|PDF)/
      else
        /^File: (<.+>)-\((?:Spoiler Image, )?([\d\.]+) (\w+), (\d+x\d+|PDF), <span title="(.+)">([^<]+)/
    [_, link, size, unit, resolution, fullname, shortname] =
      node.innerHTML.match regexp
    FileInfo.data =
      link:       link
      size:       size
      unit:       unit
      resolution: resolution
      fullname:   fullname
      shortname:  shortname
      type:       type
    node.innerHTML = FileInfo.funks[type] FileInfo
  setFormats: ->
    funks = []
    for i in [0..1]
      format = if i then Conf['fileInfoT'] else Conf['fileInfoR']
      param  = if i then /%([BKlMrs])/g    else /%([BKlLMnNrs])/g
      code   = format.replace param, (s, c) ->
        if c of FileInfo.formatters
          "' + f.formatters.#{c}() + '"
        else
          s
      funks.push Function 'f', "return '#{code}'"
    @funks = funks
  convertUnit: (unitT) ->
    size  = @data.size
    unitF = @data.unit
    if unitF isnt unitT
      units = ['B', 'KB', 'MB']
      i     = units.indexOf(unitF) - units.indexOf unitT
      unitT = 'Bytes' if unitT is 'B'
      if i > 0
        size *= 1024 while i-- > 0
      else if i < 0
        size /= 1024 while i++ < 0
      if size < 1 and size.toString().length > size.toFixed(2).length
        size = size.toFixed 2
    "#{size} #{unitT}"
  formatters:
    l: ->
      if FileInfo.data.type is 0
        FileInfo.data.link.replace />\d+\.\w+</, ">#{@n()}<"
      else
        FileInfo.data.link
    L: -> FileInfo.data.link.replace />\d+\.\w+</, ">#{FileInfo.data.fullname}<"
    n: ->
      if FileInfo.data.fullname is FileInfo.data.shortname
        FileInfo.data.fullname
      else
        "<span class=filename><span class=fnfull>#{FileInfo.data.fullname}</span><span class=fntrunc>#{FileInfo.data.shortname}</span></span>"
    N: -> FileInfo.data.fullname
    s: -> "#{FileInfo.data.size} #{FileInfo.data.unit}"
    B: -> FileInfo.convertUnit 'B'
    K: -> FileInfo.convertUnit 'KB'
    M: -> FileInfo.convertUnit 'MB'
    r: -> FileInfo.data.resolution

GetTitle = (thread) ->
  el = $ '.filetitle', thread
  if not el.textContent
    el = $ 'blockquote', thread
    if not el.textContent
      el = $ '.postername', thread
  span = $.el 'span', innerHTML: el.innerHTML.replace /<br>/g, ' '
  "/#{g.BOARD}/ - #{span.textContent}"

TitlePost =
  init: ->
    d.title = GetTitle()

QuoteBacklink =
  init: ->
    format = Conf['backlink'].replace /%id/g, "' + id + '"
    @funk  = Function 'id', "return '#{format}'"
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined
    quotes = {}
    for quote in post.quotes
      # Don't process >>>/b/.
      if qid = quote.hash[1..]
        # Duplicate quotes get overwritten.
        quotes[qid] = true
    a = $.el 'a',
      href: "##{post.id}"
      className: if post.root.hidden then 'filtered backlink' else 'backlink'
      textContent: QuoteBacklink.funk post.id
    for qid of quotes
      # Don't backlink the OP.
      continue if !(el = $.id qid) or el.className is 'op' and !Conf['OP Backlinks']
      link = a.cloneNode true
      if Conf['Quote Preview']
        $.on link, 'mouseover', QuotePreview.mouseover
      if Conf['Quote Inline']
        $.on link, 'click', QuoteInline.toggle
      else
        link.setAttribute 'onclick', "replyhl('#{post.id}');"
      unless (container = $ '.container', el) and container.parentNode is el
        container = $.el 'span', className: 'container'
        $.add container, [$.tn(' '), link]
        root = $('.reportbutton', el) or $('span[id]', el)
        $.after root, container
      else
        $.add container, [$.tn(' '), link]
    return

QuoteInline =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    for quote in post.quotes
      continue unless quote.hash
      quote.removeAttribute 'onclick'
      $.on quote, 'click', QuoteInline.toggle
    for quote in post.backlinks
      $.on quote, 'click', QuoteInline.toggle
    return
  toggle: (e) ->
    return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
    e.preventDefault()
    id = @hash[1..]
    if /\binlined\b/.test @className
      QuoteInline.rm @, id
    else
      return if $.x "ancestor::*[@id='#{id}']", @
      QuoteInline.add @, id
    @classList.toggle 'inlined'

  add: (q, id) ->
    root = if q.parentNode.nodeName is 'FONT' then q.parentNode else if q.nextSibling then q.nextSibling else q
    if el = $.id id
      inline = QuoteInline.table id, el.innerHTML
      if (i = Unread.replies.indexOf el.parentNode.parentNode.parentNode) isnt -1
        Unread.replies.splice i, 1
        Unread.update()
      if /\bbacklink\b/.test q.className
        $.after q.parentNode, inline
        if Conf['Forward Hiding']
          table = $.x 'ancestor::table', el
          $.addClass table, 'forwarded'
          # Will only unhide if there's no inlined backlinks of it anymore.
          ++table.title or table.title = 1
        return
      $.after root, inline
    else
      inline = $.el 'td',
        className: 'reply inline'
        id: "i#{id}"
        innerHTML: "Loading #{id}..."
      $.after root, inline
      {pathname} = q
      threadID = pathname.split('/').pop()
      $.cache pathname, (-> QuoteInline.parse @, pathname, id, threadID, inline)

  rm: (q, id) ->
    #select the corresponding table or loading td
    table = $.x "following::*[@id='i#{id}']", q
    $.rm table
    return unless Conf['Forward Hiding']
    for inlined in $$ '.backlink.inlined', table
      table = $.x 'ancestor::table', $.id inlined.hash[1..]
      $.removeClass table, 'forwarded' unless --table.title
    if /\bbacklink\b/.test q.className
      table = $.x 'ancestor::table', $.id id
      $.removeClass table, 'forwarded' unless --table.title

  parse: (req, pathname, id, threadID, inline) ->
    return unless inline.parentNode

    if req.status isnt 200
      inline.textContent = "#{req.status} #{req.statusText}"
      return

    doc = d.implementation.createHTMLDocument null
    doc.documentElement.innerHTML = req.responseText

    node =
      if id is threadID #OP
        Threading.op $('body > form', doc).firstChild
      else
        doc.getElementById id
    newInline = QuoteInline.table id, node.innerHTML
    for quote in $$ '.quotelink', newInline
      if (href = quote.getAttribute 'href') is quote.hash #add pathname to normal quotes
        quote.pathname = pathname
      else if !g.REPLY and href isnt quote.href #fix x-thread links, not x-board ones
        quote.href = "res/#{href}"
    link = $ '.quotejs', newInline
    link.href = "#{pathname}##{id}"
    link.nextSibling.href = "#{pathname}#q#{id}"
    $.addClass newInline, 'crossquote'
    $.replace inline, newInline
  table: (id, html) ->
    $.el 'table',
      className: 'inline'
      id: "i#{id}"
      innerHTML: "<tbody><tr><td class=reply>#{html}</td></tr></tbody>"

QuotePreview =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    for quote in post.quotes
      $.on quote, 'mouseover', QuotePreview.mouseover if quote.hash
    for quote in post.backlinks
      $.on quote, 'mouseover', QuotePreview.mouseover
    return
  mouseover: (e) ->
    return if /\binlined\b/.test @className
    qp = UI.el = $.el 'div',
      id: 'qp'
      className: 'reply dialog'
    $.add d.body, qp

    id = @hash[1..]
    if el = $.id id
      qp.innerHTML = el.innerHTML
      $.addClass el, 'qphl' if Conf['Quote Highlighting']
      if /\bbacklink\b/.test @className
        replyID = $.x('preceding-sibling::input', @parentNode).name
        for quote in $$ '.quotelink', qp
          if quote.hash[1..] is replyID
            $.addClass quote, 'forwardlink'
    else
      qp.textContent = "Loading #{id}..."
      threadID = @pathname.split('/').pop() or $.x('ancestor::div[@class="thread"]', @).firstChild.id
      $.cache @pathname, (-> QuotePreview.parse @, id, threadID)
      UI.hover e
    $.on @, 'mousemove', UI.hover
    $.on @, 'mouseout',  QuotePreview.mouseout
    $.on @, 'click',     QuotePreview.mouseout
  mouseout: ->
    if el = $.id @hash[1..]
      $.removeClass el, 'qphl'
    UI.hoverend()
    $.off @, 'mousemove', UI.hover
    $.off @, 'mouseout',  QuotePreview.mouseout
    $.off @, 'click',     QuotePreview.mouseout
  parse: (req, id, threadID) ->
    return unless (qp = UI.el) and qp.textContent is "Loading #{id}..."

    if req.status isnt 200
      qp.textContent = "#{req.status} #{req.statusText}"
      return

    doc = d.implementation.createHTMLDocument null
    doc.documentElement.innerHTML = req.responseText

    node =
      if id is threadID #OP
        Threading.op $('body > form', doc).firstChild
      else
        doc.getElementById id
    qp.innerHTML = node.innerHTML
    post =
      root:     qp
      filesize: $ '.filesize', qp
      img:      $ 'img[md5]',  qp
    if Conf['Image Auto-Gif']
      AutoGif.node   post
    if Conf['Time Formatting']
      Time.node     post
    if Conf['File Info Formatting']
      FileInfo.node post

QuoteOP =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.class is 'inline'
    for quote in post.quotes
      if quote.hash[1..] is post.threadId
        # \u00A0 is nbsp
        $.add quote, $.tn '\u00A0(OP)'
    return

QuoteCT =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.class is 'inline'
    for quote in post.quotes
      unless quote.hash
        # Make sure this isn't a link to the board we're on.
        continue
      path = quote.pathname.split '/'
      # If quote leads to a different thread id and is located on the same board.
      if path[1] is g.BOARD and path[3] isnt post.threadId
        # \u00A0 is nbsp
        $.add quote, $.tn '\u00A0(Cross-thread)'
    return

Quotify =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.class is 'inline'

    # XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE is 6
    # Get all the text nodes that are not inside an anchor.
    snapshot = d.evaluate './/text()[not(parent::a)]', post.el.lastChild, null, 6, null

    for i in [0...snapshot.snapshotLength]
      node = snapshot.snapshotItem i
      data = node.data

      unless quotes = data.match />>(>\/[a-z\d]+\/)?\d+/g
        # Only accept nodes with potentially valid links
        continue

      nodes = []

      for quote in quotes
        index   = data.indexOf quote
        if text = data[...index]
          # Potential text before this valid quote.
          nodes.push $.tn text

        id = quote.match(/\d+$/)[0]
        board =
          if m = quote.match /^>>>\/([a-z\d]+)/
            m[1]
          else
            # Get the post's board, whether it's inlined or not.
            $('.quotejs', post.el).pathname.split('/')[1]

        nodes.push a = $.el 'a',
          # \u00A0 is nbsp
          textContent: "#{quote}\u00A0(Dead)"

        if board is g.BOARD and $.id id
          a.href      = "##{id}"
          a.className = 'quotelink'
          a.setAttribute 'onclick', "replyhl('#{id}');"
        else
          a.href      = Redirect.thread board, id, 'post'
          a.className = 'deadlink'
          a.target    = '_blank'

        data = data[index + quote.length..]

      if data
        # Potential text after the last valid quote.
        nodes.push $.tn data

      $.replace node, nodes
    return

ReportButton =
  init: ->
    @a = $.el 'a',
      className: 'reportbutton'
      innerHTML: '[&nbsp;!&nbsp;]'
      href: 'javascript:;'
    Main.callbacks.push @node
  node: (post) ->
    unless a = $ '.reportbutton', post.el
      a = ReportButton.a.cloneNode true
      $.after $('span[id]', post.el), [$.tn(' '), a]
    $.on a, 'click', ReportButton.report
  report: ->
    url = "//sys.4chan.org/#{g.BOARD}/imgboard.php?mode=report&no=#{$.x('preceding-sibling::input', @).name}"
    id  = Date.now()
    set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200"
    window.open url, id, set

ThreadStats =
  init: ->
    dialog = UI.dialog 'stats', 'bottom: 0; left: 0;', '<div class=move><span id=postcount>0</span> / <span id=imagecount>0</span></div>'
    dialog.className = 'dialog'
    $.add d.body, dialog
    @posts = @images = 0
    @imgLimit =
      switch g.BOARD
        when 'a', 'mlp', 'v'
          251
        when 'vg'
          501
        else
          151
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined
    $.id('postcount').textContent = ++ThreadStats.posts
    return unless post.img
    imgcount = $.id 'imagecount'
    imgcount.textContent = ++ThreadStats.images
    if ThreadStats.images > ThreadStats.imgLimit
      imgcount.className = 'warning'

Unread =
  init: ->
    @title = d.title
    @update()
    $.on window, 'scroll', Unread.scroll
    Main.callbacks.push @node

  replies: []
  foresee: []

  node: (post) ->
    if (index = Unread.foresee.indexOf post.id) isnt -1
      Unread.foresee.splice index, 1
      return
    return if post.root.hidden or post.class
    Unread.replies.push post.root
    Unread.update()

  scroll: ->
    height = d.body.clientHeight
    for reply, i in Unread.replies
      {bottom} = reply.getBoundingClientRect()
      if bottom > height #post is not completely read
        break
    return if i is 0

    Unread.replies = Unread.replies[i..]
    Unread.update()

  setTitle: (count) ->
    if @scheduled
      clearTimeout @scheduled
      delete Unread.scheduled
      @setTitle count
      return
    @scheduled = setTimeout (->
      d.title = "(#{count}) #{Unread.title}"
    ), 5

  update: (forceUpdate) ->
    return unless g.REPLY

    count = @replies.length

    if Conf['Unread Count']
      @setTitle count

    unless Conf['Unread Favicon'] and (count < 2 or forceUpdate)
      return

    Favicon.el.href =
      if g.dead
        if count
          Favicon.unreadDead
        else
          Favicon.dead
      else
        if count
          Favicon.unread
        else
          Favicon.default

    #`favicon.href = href` doesn't work on Firefox
    #`favicon.href = href` isn't enough on Opera
    #Opera won't always update the favicon if the href didn't not change
    $.add d.head, Favicon.el

Favicon =
  init: ->
    @el = $ 'link[rel="shortcut icon"]', d.head
    @el.type = 'image/x-icon'
    {href} = @el
    @SFW = /ws.ico$/.test href
    @default = href
    @switch()

  switch: ->
    switch Conf['favicon']
      when 'ferongr'
        @unreadDead = 'data:unreadDead;base64,R0lGODlhEAAQAOMHAOgLAnMFAL8AAOgLAukMA/+AgP+rq////////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw=='
        @unreadSFW  = 'data:unreadSFW;base64,R0lGODlhEAAQAOMHAADX8QBwfgC2zADX8QDY8nnl8qLp8v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw=='
        @unreadNSFW = 'data:unreadNSFW;base64,R0lGODlhEAAQAOMHAFT+ACh5AEncAFT+AFX/Acz/su7/5v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw=='
      when 'xat-'
        @unreadDead = 'data:unreadDead;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2ElEQVQ4y61TQQrCMBDMQ8WDIEV6LbT2A4og2Hq0veo7fIAH04dY9N4xmyYlpGmI2MCQTWYy3Wy2DAD7B2wWAzWgcTgVeZKlZRxHNYFi2jM18oBh0IcKtC6ixf22WT4IFLs0owxswXu9egm0Ls6bwfCFfNsJYJKfqoEkd3vgUgFVLWObtzNgVKyruC+ljSzr5OEnBzjvjcQecaQhbZgBb4CmGQw+PoMkTUtdbd8VSEPakcGxPOcsoIgUKy0LecY29BmdBrqRfjIwZ93KLs5loHvBnL3cLH/jF+C/+z5dgUysAAAAAElFTkSuQmCC'
        @unreadSFW  = 'data:unreadSFW;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA30lEQVQ4y2P4//8/AyWYgSoGQMF/GJ7Y11VVUVoyKTM9ey4Ig9ggMWQ1YA1IBvzXm34YjkH8mPyJB+Nqlp8FYRAbmxoMF6ArSNrw6T0Qf8Amh9cFMEWVR/7/A+L/uORxhgEIt5/+/3/2lf//5wAxiI0uj+4CBlBgxVUvOwtydgXQZpDmi2/+/7/0GmIQSAwkB1IDUkuUAZeABlx+g2zAZ9wGlAOjChba+LwAUgNSi2HA5Am9VciBhSsQQWyoWgZiovEDsdGI1QBYQiLJAGQalpSxyWEzAJYWkGm8clTJjQCZ1hkoVG0CygAAAABJRU5ErkJggg=='
        @unreadNSFW = 'data:unreadNSFW;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4y2P4//8/AyWYgSoGQMF/GJ7YNbGqrKRiUnp21lwQBrFBYshqwBqQDPifdsYYjkH8mInxB+OWx58FYRAbmxoMF6ArKPmU9B6IP2CTw+sCmKKe/5X/gPg/LnmcYQDCs/63/1/9fzYQzwGz0eXRXcAACqy4ZfFnQc7u+V/xD6T55v+LQHwJbBBIDCQHUgNSS5QBt4Cab/2/jDDgMx4DykrKJ8FCG58XQGpAajEMmNw7uQo5sHAFIogNVctATDR+IDYasRoAS0gkGYBMw5IyNjlsBsDSAjKNV44quREAx58Mr9vt5wQAAAAASUVORK5CYII='
      when 'Mayhem'
        @unreadDead = 'data:unreadDead;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jZ2ScWuDMBDFgw4pIkU0WsoQkWAYIkXZH4N9/+/V3dmfXSrKYIFHwt17j8vdGWNMIkgFuaDgzgQnwRs4EQs5KdolUQtagRN0givEDBTEOjgtGs0Zq8F7cKqqusVxrMQLaDUWcjBSrXkn8gs51tpJSWLk9b3HUa0aNIL5gPBR1/V4kJvR7lTwl8GmAm1Gf9+c3S+89qBHa8502AsmSrtBaEBPbIbj0ah2madlNAPEccdgJDfAtWifBjqWKShRBT6KoiH8QlEUn/qt0CCjnNdmPUwmFWzj9Oe6LpKuZXcwqq88z78Pch3aZU3dPwwc2sWlfZKCW5tWluV8kGvXClLm6dYN4/aUqfCbnEOzNDGhGZbNargvxCzvMGfRJD8UaDVvgkzo6QAAAABJRU5ErkJggg=='
        @unreadSFW  = 'data:unreadSFW;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZ2S4crCMAxF+0OGDJEPKYrIGKOsiJSx/fJRfSAfTJNyKqXfiuDg0C25N2RJjTGmEVrhTzhw7oStsIEtsVzT4o2Jo9ALThiEM8IdHIgNaHo8mjNWg6/ske8bohPo+63QOLzmooHp8fyAICBSQkVz0QKdsFQEV6WSW/D+7+BbgbIDHcb4Kp61XyjyI16zZ8JemGltQtDBSGxB4/GoN+7TpkkjDCsFArm0IYv3U0BbnYtf8BCy+JytsE0X6VyuKhPPK/GAJ14kvZZDZVV3pZIb8MZr6n4o4PDGKn0S5SdDmyq5PnXQsk+Xbhinp03FFzmHJw6xYRiWm9VxnohZ3vOcxdO8ARmXRvbWdtzQAAAAAElFTkSuQmCC'
        @unreadNSFW = 'data:unreadNSFW;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jZ2S0WrDMAxF/TBCCKWMYhZKCSGYmFJMSNjD/mhf239qJXNcjBdTWODgRLpXKJKNMaYROuFTOHEehFb4gJZYrunwxsSXMApOmIQzwgOciE1oRjyaM1aDj+yR7xuiHvT9VmgcXnPRwO/9+wWCgEgJFc1FCwzCVhFclUpuw/u3g3cFyg50GPOjePZ+ocjPeM2RCXthpbUFwQAzsQ2Nx6PeuE+bJo0w7BQI5NKGLN5XAW11LX7BQ8jia7bCLl2kc7mqTLzuxAOeeJH0Wk6VVf0oldyEN15T948CDm+sMiZRfjK0pZIbUwcd+3TphnF62lR8kXN44hAbhmG5WQNnT8zynucsnuYJhFpBfkMzqD4AAAAASUVORK5CYII='
      when 'Original'
        @unreadDead = 'data:unreadDead;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs='
        @unreadSFW  = 'data:unreadSFW;base64,R0lGODlhEAAQAKECAAAAAC6Xw////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs='
        @unreadNSFW = 'data:unreadNSFW;base64,R0lGODlhEAAQAKECAAAAAGbMM////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs='
    @unread = if @SFW then @unreadSFW else @unreadNSFW

  empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='

Redirect =
  init: ->
    url =
      if location.hostname is 'images.4chan.org'
        @image location.href
      else if /^\d+$/.test g.THREAD_ID
        @thread()
    location.href = url if url
  image: (href) ->
    href = href.split '/'
    # Do not use g.BOARD, the image url can originate from a cross-quote.
    return unless Conf['404 Redirect']
    switch href[3]
      when 'a', 'jp', 'm', 'tg', 'u', 'vg'
        "http://archive.foolz.us/#{href[3]}/full_image/#{href[5]}"
  thread: (board=g.BOARD, id=g.THREAD_ID, mode='thread') ->
    return unless Conf['404 Redirect'] or mode is 'post'
    switch g.BOARD
      when 'a', 'jp', 'm', 'tg', 'tv', 'u', 'v', 'vg'
        "http://archive.foolz.us/#{board}/thread/#{id}/"
      when 'lit'
        "http://fuuka.warosu.org/#{board}/#{mode}/#{id}"
      when 'diy', 'g', 'sci'
        "https://archive.installgentoo.net/#{board}/#{mode}/#{id}"
      when '3', 'adv', 'an', 'ck', 'co', 'fa', 'fit', 'int', 'k', 'mu', 'n', 'o', 'p', 'po', 'pol', 'r9k', 'soc', 'sp', 'toy', 'trv', 'vp', 'x'
        "http://archive.no-ip.org/#{board}/#{mode}/#{id}"
      else
        if mode is 'thread'
          "//boards.4chan.org/#{board}/"
        else
          null

ImageHover =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return unless post.img
    $.on post.img, 'mouseover', ImageHover.mouseover
  mouseover: ->
    UI.el = $.el 'img'
      id: 'ihover'
      src: @parentNode.href
    $.add d.body, UI.el
    $.on UI.el, 'load',      ImageHover.load
    $.on @,     'mousemove', UI.hover
    $.on @,     'mouseout',  ImageHover.mouseout
  load: ->
    return if @ isnt UI.el
    # 'Fake' mousemove event by giving required values.
    {style} = @
    UI.hover
      clientX: - 45 + parseInt style.left
      clientY:  120 + parseInt style.top
  mouseout: ->
    UI.hoverend()
    $.off @, 'mousemove', UI.hover
    $.off @, 'mouseout',  ImageHover.mouseout

AutoGif =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.root.hidden or not post.img
    src = post.img.parentNode.href
    if /gif$/.test(src) and !/spoiler/.test post.img.src
      img = $.el 'img'
      $.on img, 'load', ->
        # Replace the thumbnail once the GIF has finished loading.
        post.img.src = src
      img.src = src

ImageExpand =
  init: ->
    Main.callbacks.push @node
    @dialog()

  node: (post) ->
    return unless post.img
    a = post.img.parentNode
    $.on a, 'click', ImageExpand.cb.toggle
    if ImageExpand.on and !post.root.hidden and post.class isnt 'inline'
      ImageExpand.expand post.img
  cb:
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      e.preventDefault()
      ImageExpand.toggle @
    all: ->
      ImageExpand.on = @checked
      if ImageExpand.on #expand
        thumbs = $$ 'img[md5]'
        if Conf['Expand From Current']
          for thumb, i in thumbs
            if thumb.getBoundingClientRect().top > 0
              break
          thumbs = thumbs[i...]
        for thumb in thumbs
          ImageExpand.expand thumb
      else #contract
        for thumb in $$ 'img[md5][hidden]'
          ImageExpand.contract thumb
      return
    typeChange: ->
      switch @value
        when 'full'
          klass = ''
        when 'fit width'
          klass = 'fitwidth'
        when 'fit height'
          klass = 'fitheight'
        when 'fit screen'
          klass = 'fitwidth fitheight'
      $('body > form').className = klass
      if /\bfitheight\b/.test klass
        $.on window, 'resize', ImageExpand.resize
        unless ImageExpand.style
          ImageExpand.style = $.addStyle ''
        ImageExpand.resize()
      else if ImageExpand.style
        $.off window, 'resize', ImageExpand.resize

  toggle: (a) ->
    thumb = a.firstChild
    if thumb.hidden
      rect = a.getBoundingClientRect()
      d.body.scrollTop += rect.top - 42 if rect.top < 0
      d.body.scrollLeft += rect.left if rect.left < 0
      ImageExpand.contract thumb
    else
      ImageExpand.expand thumb

  contract: (thumb) ->
    thumb.hidden = false
    thumb.nextSibling.hidden = true

  expand: (thumb, url) ->
    # Do not expand images of hidden/filtered replies, or already expanded pictures.
    return if $.x 'ancestor-or-self::*[@hidden]', thumb
    thumb.hidden = true
    if img = thumb.nextSibling
      # Expand already loaded picture
      img.hidden = false
      return
    a = thumb.parentNode
    img = $.el 'img',
      src: url or a.href
    $.on img, 'error', ImageExpand.error
    $.add a, img

  error: ->
    href  = @parentNode.href
    thumb = @previousSibling
    ImageExpand.contract thumb
    $.rm @
    unless @src.split('/')[2] is 'images.4chan.org' and url = Redirect.image href
      return if g.dead
      # CloudFlare may cache banned pages instead of images.
      # This will fool CloudFlare's cache.
      url = href + '?' + Date.now()
    #navigator.online is not x-browser/os yet
    timeoutID = setTimeout ImageExpand.expand, 10000, thumb, url
    # Only Chrome let userscript break through cross domain requests.
    # Don't check it 404s in the archivers.
    return unless $.engine is 'webkit' and url.split('/')[2] is 'images.4chan.org'
    $.ajax url, onreadystatechange: (-> clearTimeout timeoutID if @status is 404),
      type: 'head'

  dialog: ->
    controls = $.el 'div',
      id: 'imgControls'
      innerHTML:
        "<select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label>Expand Images<input type=checkbox id=imageExpand></label>"
    imageType = $.get 'imageType', 'full'
    select = $ 'select', controls
    select.value = imageType
    ImageExpand.cb.typeChange.call select
    $.on select, 'change', $.cb.value
    $.on select, 'change', ImageExpand.cb.typeChange
    $.on $('input', controls), 'click', ImageExpand.cb.all

    form = $ 'body > form'
    $.prepend form, controls

  resize: ->
    ImageExpand.style.textContent = ".fitheight img[md5] + img {max-height:#{d.body.clientHeight}px;}"

Main =
  init: ->
    path = location.pathname
    pathname = path[1..].split '/'
    [g.BOARD, temp] = pathname
    if temp is 'res'
      g.REPLY = true
      g.THREAD_ID = pathname[2]

    #load values from localStorage
    for key, val of Conf
      Conf[key] = $.get key, val

    $.on window, 'message', Main.message

    switch location.hostname
      when 'sys.4chan.org'
        if path is '/robots.txt'
          QR.message.send req: 'status', ready: true
        else if /report/.test location.search
          $.ready ->
            $.on $.id('recaptcha_response_field'), 'keydown', (e) ->
              window.location = 'javascript:Recaptcha.reload()' if e.keyCode is 8 and not e.target.value
        return
      when 'www.4chan.org'
        if path is '/banned'
          QR.message.send req: 'status', ready: true, banned: true
        return
      when 'images.4chan.org'
        $.ready -> Redirect.init() if d.title is '4chan - 404'
        return

    $.ready Options.init

    if Conf['Quick Reply'] and Conf['Hide Original Post Form'] and g.BOARD isnt 'f'
      Main.css += 'form[name=post] { display: none; }'

    Main.addStyle()

    now = Date.now()
    if Conf['Check for Updates'] and $.get('lastUpdate',  0) < now - 6*$.HOUR
      $.ready -> $.add d.head, $.el 'script', src: 'https://raw.github.com/mayhemydg/4chan-x/master/latest.js'
      $.set 'lastUpdate', now

    g.hiddenReplies = $.get "hiddenReplies/#{g.BOARD}/", {}
    if $.get('lastChecked', 0) < now - 1*$.DAY
      $.set 'lastChecked', now

      cutoff = now - 7*$.DAY
      hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}

      for id, timestamp of hiddenThreads
        if timestamp < cutoff
          delete hiddenThreads[id]

      for id, timestamp of g.hiddenReplies
        if timestamp < cutoff
          delete g.hiddenReplies[id]

      $.set "hiddenThreads/#{g.BOARD}/", hiddenThreads
      $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies


    #major features
    if Conf['Filter']
      Filter.init()

    if Conf['Reply Hiding']
      ReplyHiding.init()

    if Conf['Filter'] or Conf['Reply Hiding']
      StrikethroughQuotes.init()

    if Conf['Anonymize']
      Anonymize.init()

    if Conf['Time Formatting']
      Time.init()

    if Conf['File Info Formatting']
      FileInfo.init()

    if Conf['Sauce']
      Sauce.init()

    if Conf['Reveal Spoilers']
      RevealSpoilers.init()

    if Conf['Image Auto-Gif']
      AutoGif.init()

    if Conf['Image Hover']
      ImageHover.init()

    if Conf['Report Button']
      ReportButton.init()

    if Conf['Resurrect Quotes']
      Quotify.init()

    if Conf['Quote Inline']
      QuoteInline.init()

    if Conf['Quote Preview']
      QuotePreview.init()

    if Conf['Quote Backlinks']
      QuoteBacklink.init()

    if Conf['Indicate OP quote']
      QuoteOP.init()

    if Conf['Indicate Cross-thread Quotes']
      QuoteCT.init()

    $.ready Main.ready

  ready: ->
    if d.title is '4chan - 404'
      Redirect.init()
      return
    unless $.id 'navtopr'
      return
    $.addClass d.body, "chanx_#{Main.version.split('.')[1]}"
    $.addClass d.body, $.engine
    for nav in ['navtop', 'navbot']
      $.addClass $("a[href$='/#{g.BOARD}/']", $.id nav), 'current'
    form = $ 'form[name=delform]'
    Threading.thread form.firstElementChild
    Favicon.init()

    # Major features.
    if Conf['Quick Reply']
      QR.init()

    if Conf['Image Expansion']
      ImageExpand.init()

    if Conf['Thread Watcher']
      setTimeout -> Watcher.init()

    if Conf['Keybinds']
      setTimeout -> Keybinds.init()

    if g.REPLY
      if Conf['Thread Updater']
        setTimeout -> Updater.init()

      if Conf['Thread Stats']
        ThreadStats.init()

      if Conf['Reply Navigation']
        setTimeout -> Nav.init()

      if Conf['Post in Title']
        TitlePost.init()

      if Conf['Unread Count'] or Conf['Unread Favicon']
        Unread.init()

    else #not reply
      if Conf['Thread Hiding']
        setTimeout -> ThreadHiding.init()

      if Conf['Thread Expansion']
        setTimeout -> ExpandThread.init()

      if Conf['Comment Expansion']
        setTimeout -> ExpandComment.init()

      if Conf['Index Navigation']
        setTimeout -> Nav.init()

    nodes = []
    for node in $$ '.op, a + table', form
      nodes.push Main.preParse node
    Main.node nodes, true

    if MutationObserver = window.WebKitMutationObserver or window.MozMutationObserver or window.OMutationObserver or window.MutationObserver
      observer = new MutationObserver Main.observer
      observer.observe form,
        childList: true
        subtree:   true
    else
      $.on form, 'DOMNodeInserted', Main.listener

  addStyle: ->
    $.off d, 'DOMNodeInserted', Main.addStyle
    if d.head
      $.addStyle Main.css
    else # XXX fox
      $.on d, 'DOMNodeInserted', Main.addStyle

  message: (e) ->
    {data} = e
    if data.QR
      QR.message.receive data
      return
    {version} = data
    if version and version isnt Main.version and confirm 'An updated version of 4chan X is available, would you like to install it now?'
      window.location = "https://raw.github.com/mayhemydg/4chan-x/#{version}/4chan_x.user.js"

  preParse: (node) ->
    klass = node.className
    post =
      root:      node
      el:        if klass is 'op' then node else node.firstChild.firstChild.lastChild
      class:     klass
      id:        node.getElementsByTagName('input')[0].name
      threadId:  g.THREAD_ID or $.x('ancestor::div[@class="thread"]', node).firstChild.id
      isOP:      klass is 'op'
      isInlined: /\binline\b/.test klass
      filesize:  node.getElementsByClassName('filesize')[0] or false
      quotes:    node.getElementsByClassName 'quotelink'
      backlinks: node.getElementsByClassName 'backlink'
    post.img = if post.filesize then node.getElementsByTagName('img')[0] else false
    post
  node: (nodes, notify) ->
    for callback in Main.callbacks
      try
        callback node for node in nodes
      catch err
        alert "4chan X (#{Main.version}) error: #{err.message}\nhttp://mayhemydg.github.com/4chan-x/#bug-report\n\n#{err.stack}" if notify
    return
  observer: (mutations) ->
    nodes = []
    for mutation in mutations
      for addedNode in mutation.addedNodes
        nodes.push Main.preParse addedNode if addedNode.nodeName is 'TABLE'
    Main.node nodes if nodes.length
  listener: (e) ->
    {target} = e
    Main.node [Main.preParse target] if target.nodeName is 'TABLE'

  namespace: '4chan_x.'
  version: '2.29.1'
  callbacks: []
  css: '
/* dialog styling */
.dialog {
  border: 1px solid rgba(0,0,0,.25);
}
.move {
  cursor: move;
}
label, .favicon {
  cursor: pointer;
}
a[href="javascript:;"] {
  text-decoration: none;
}

.block ~ .op,
.block ~ .omittedposts,
.block ~ table,
.block ~ br,
#content > [name=tab]:not(:checked) + div,
#updater:not(:hover) > :not(.move),
#qp > input, #qp .inline, .forwarded {
  display: none;
}

.autohide:not(:hover) > form {
  display: none;
}
#qr > .move {
  min-width: 300px;
  overflow: hidden;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  padding: 0 2px;
}
#qr > .move > span {
  float: right;
}
#autohide, .close, #qr select, #dump, .remove, .captcha, #qr .warning {
  cursor: pointer;
}
#qr select,
#qr > form {
  margin: 0;
}
#dump {
  background: -webkit-linear-gradient(#EEE, #CCC);
  background: -moz-linear-gradient(#EEE, #CCC);
  background: -o-linear-gradient(#EEE, #CCC);
  background: linear-gradient(#EEE, #CCC);
  width: 10%;
  padding: -moz-calc(1px) 0 2px;
}
#dump:hover, #dump:focus {
  background: -webkit-linear-gradient(#FFF, #DDD);
  background: -moz-linear-gradient(#FFF, #DDD);
  background: -o-linear-gradient(#FFF, #DDD);
  background: linear-gradient(#FFF, #DDD);
}
#dump:active, .dump #dump:not(:hover):not(:focus) {
  background: -webkit-linear-gradient(#CCC, #DDD);
  background: -moz-linear-gradient(#CCC, #DDD);
  background: -o-linear-gradient(#CCC, #DDD);
  background: linear-gradient(#CCC, #DDD);
}
#qr:not(.dump) #replies, .dump > form > label {
  display: none;
}
#replies {
  display: block;
  height: 100px;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
#replies > div {
  counter-reset: previews;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: 0; padding: 0;
  overflow: hidden;
  position: absolute;
  white-space: pre;
}
#replies > div:hover {
  bottom: -10px;
  overflow-x: auto;
  z-index: 1;
}
.preview {
  background-color: rgba(0,0,0,.2) !important;
  background-position: 50% 20% !important;
  background-size: cover !important;
  border: 1px solid #666;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  cursor: move;
  display: inline-block;
  height: 90px; width: 90px;
  margin: 5px; padding: 2px;
  opacity: .5;
  outline: none;
  overflow: hidden;
  position: relative;
  text-shadow: 0 1px 1px #000;
  -webkit-transition: .25s ease-in-out;
  -moz-transition: .25s ease-in-out;
  -o-transition: .25s ease-in-out;
  transition: .25s ease-in-out;
  vertical-align: top;
}
.preview:hover, .preview:focus {
  opacity: .9;
}
.preview#selected {
  opacity: 1;
}
.preview::before {
  counter-increment: previews;
  content: counter(previews);
  color: #FFF;
  font-weight: 700;
  padding: 3px;
  position: absolute;
  top: 0;
  right: 0;
  text-shadow: 0 0 3px #000, 0 0 8px #000;
}
.preview.drag {
  box-shadow: 0 0 10px rgba(0,0,0,.5);
}
.preview.over {
  border-color: #FFF;
}
.preview > span {
  color: #FFF;
}
.remove {
  background: none;
  color: #E00;
  font-weight: 700;
  padding: 3px;
}
.remove:hover::after {
  content: " Remove";
}
.preview > label {
  background: rgba(0,0,0,.5);
  color: #FFF;
  right: 0; bottom: 0; left: 0;
  position: absolute;
  text-align: center;
}
.preview > label > input {
  margin: 0;
}
#addReply {
  color: #333;
  font-size: 3.5em;
  line-height: 100px;
}
#addReply:hover, #addReply:focus {
  color: #000;
}
.field {
  border: 1px solid #CCC;
  color: #333;
  font: 13px sans-serif;
  margin: 0;
  padding: 2px 4px 3px;
  width: 30%;
  -webkit-transition: color .25s, border .25s;
  -moz-transition: color .25s, border .25s;
  -o-transition: color .25s, border .25s;
  transition: color .25s, border .25s;
}
.field:-moz-placeholder,
.field:hover:-moz-placeholder {
  color: #AAA;
}
.field:hover, .field:focus {
  border-color: #999;
  color: #000;
  outline: none;
}
textarea.field {
  min-height: 120px;
}
.field:only-child {
  min-width: 100%;
}
.captcha {
  background: #FFF;
  outline: 1px solid #CCC;
  outline-offset: -1px;
  text-align: center;
}
.captcha > img {
  height: 57px;
  width: 300px;
}
#qr [type=file] {
  margin: 1px 0;
  width: 70%;
}
#qr [type=submit] {
  margin: 1px 0;
  padding: 1px; /* not Gecko */
  padding: 0 -moz-calc(1px); /* Gecko does not respect box-sizing: border-box */
  width: 30%;
}

.new {
  background: lime;
}
.warning {
  color: red;
}
.replyhider {
  vertical-align: top;
}

.filesize + br + a {
  float: left;
  pointer-events: none;
}
.filename:hover > .fntrunc,
.filename:not(:hover) > .fnfull {
  display: none;
}
img[md5], img[md5] + img {
  pointer-events: all;
}
.fitwidth img[md5] + img {
  max-width: 100%;
}
.gecko  > .fitwidth img[md5] + img,
.presto > .fitwidth img[md5] + img {
  width: 100%;
}
/* revealed spoilers do not have height/width,
   this fixes "expanded" auto-gifs */
img[md5] {
  max-height: 251px;
  max-width: 251px;
}
input ~ a > img[md5] {
  max-height: 126px;
  max-width: 126px;
}

#qr, #qp, #updater, #stats, #ihover, #overlay, #navlinks {
  position: fixed;
}

#ihover {
  max-height: 97%;
  max-width: 75%;
  padding-bottom: 18px;
}

#navlinks {
  font-size: 16px;
  top: 25px;
  right: 5px;
}

#overlay {
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  text-align: center;
  background: rgba(0,0,0,.5);
  z-index: 1;
}
#overlay::after {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
#options {
  display: inline-block;
  padding: 5px;
  text-align: left;
  vertical-align: middle;
  width: 600px;
}
#credits {
  float: right;
}
#options ul {
  list-style: none;
  padding: 0;
}
#options label {
  text-decoration: underline;
}
#content > div {
  height: 450px;
  overflow: auto;
}
#content textarea {
  margin: 0;
  min-height: 100px;
  resize: vertical;
  width: 100%;
}
#sauces {
  height: 320px;
}

#updater {
  text-align: right;
}
#updater input[type=text] {
  width: 50px;
}
#updater:not(:hover) {
  border: none;
  background: transparent;
}

#stats {
  border: none;
}

#watcher {
  padding-bottom: 5px;
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
}
#watcher:not(:hover) {
  max-height: 220px;
}
#watcher > div {
  max-width: 200px;
  overflow: hidden;
  padding-left: 5px;
  padding-right: 5px;
  text-overflow: ellipsis;
}
#watcher > .move {
  padding-top: 5px;
  text-decoration: underline;
}

#qp {
  padding-bottom: 5px;
}
#qp > a > img {
  max-height: 300px;
  max-width: 500px;
}
.qphl {
  outline: 2px solid rgba(216, 94, 49, .7);
}
.inlined {
  opacity: .5;
}
.inline .reply {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(128, 128, 128, 0.5);
}
.filetitle, .replytitle, .postername, .commentpostername, .postertrip {
  background: none;
}
.filter_highlight.op,
.filter_highlight > td[id] {
  box-shadow: -5px 0 rgba(255,0,0,0.5);
}
.filtered {
  text-decoration: line-through;
}
.quotelink.forwardlink {
  color: #2C2C63;
}
'

Main.init()
