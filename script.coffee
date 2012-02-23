config =
  main:
    Enhancing:
      '404 Redirect':                 [true,  'Redirect dead threads and images']
      'Fix XXX\'d Post Numbers':      [true,  'Replace XXX\'d post numbers with their actual number']
      'Keybinds':                     [true,  'Binds actions to keys']
      'Time Formatting':              [true,  'Arbitrarily formatted timestamps, using your local time']
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
      'Indicate OP quote':            [true,  'Add \'(OP)\' to OP quotes']
      'Indicate Cross-thread Quotes': [true,  'Add \'(Cross-thread)\' to cross-threads quotes']
      'Forward Hiding':               [true,  'Hide original posts of inlined backlinks']
  filter:
    name: [
      '# Filter any namefags:'
      '#/^(?!Anonymous$)/'
    ].join '\n'
    tripcode: [
      '# Filter any tripfags'
      '#/^!/'
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
    '#http://archive.foolz.us/a/image/$3/'
    '#http://archive.installgentoo.net/g/image/$3'
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M'
  backlink: '>>%id'
  favicon: 'ferongr'
  hotkeys:
    openOptions:     ['ctrl+o', 'Open Options']
    close:           ['Esc',    'Close Options or QR']
    spoiler:         ['ctrl+s', 'Quick spoiler']
    openQR:          ['i',      'Open QR with post number inserted']
    openEmptyQR:     ['I',      'Open QR without post number inserted']
    submit:          ['alt+s',  'Submit post']
    nextReply:       ['J',      'Select next reply']
    previousReply:   ['K',      'Select previous reply']
    nextThread:      ['n',      'See next thread']
    previousThread:  ['p',      'See previous thread']
    nextPage:        ['L',      'Jump to the next page']
    previousPage:    ['H',      'Jump to the previous page']
    zero:            ['0',      'Jump to page 0']
    openThreadTab:   ['o',      'Open thread in current tab']
    openThread:      ['O',      'Open thread in new tab']
    expandThread:    ['e',      'Expand thread']
    watch:           ['w',      'Watch thread']
    hide:            ['x',      'Hide thread']
    expandImage:     ['m',      'Expand selected image']
    expandAllImages: ['M',      'Expand all images']
    update:          ['u',      'Update now']
    unreadCountTo0:  ['z',      'Reset unread status']
  updater:
    checkbox:
      'Scrolling':   [false, 'Scroll updated posts into view. Only enabled at bottom of page.']
      'Scroll BG':   [false, 'Scroll background tabs']
      'Verbose':     [true,  'Show countdown timer, new post count']
      'Auto Update': [true,  'Automatically fetch new posts']
    'Interval': 30

# XXX Chrome can't into {log} = console
# XXX GreaseMonkey can't into console.log.bind
log = console.log.bind? console

# flatten the config
conf = {}
(flatten = (parent, obj) ->
  if obj instanceof Array
    conf[parent] = obj[0]
  else if typeof obj is 'object'
    for key, val of obj
      flatten key, val
  else # string or number
    conf[parent] = obj
  return
) null, config

NAMESPACE = '4chan_x.'
VERSION = '2.27.1'
SECOND = 1000
MINUTE = 60*SECOND
HOUR   = 60*MINUTE
DAY    = 24*HOUR
engine = /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase()
d = document
g = callbacks: []

ui =
  dialog: (id, position, html) ->
    el = d.createElement 'div'
    el.className = 'reply dialog'
    el.innerHTML = html
    el.id = id
    el.style.cssText = if saved = localStorage["#{NAMESPACE}#{id}.position"] then saved else position
    el.querySelector('.move').addEventListener 'mousedown', ui.dragstart, false
    el
  dragstart: (e) ->
    #prevent text selection
    e.preventDefault()
    ui.el = el = @parentNode
    d.addEventListener 'mousemove', ui.drag, false
    d.addEventListener 'mouseup',   ui.dragend, false
    #distance from pointer to el edge is constant; calculate it here.
    # XXX opera reports el.offsetLeft / el.offsetTop as 0
    rect = el.getBoundingClientRect()
    ui.dx = e.clientX - rect.left
    ui.dy = e.clientY - rect.top
    #factor out el from document dimensions
    ui.width  = d.body.clientWidth  - el.offsetWidth
    ui.height = d.body.clientHeight - el.offsetHeight
  drag: (e) ->
    left = e.clientX - ui.dx
    top = e.clientY - ui.dy
    left =
      if left < 10 then 0
      else if ui.width - left < 10 then null
      else left
    top =
      if top < 10 then 0
      else if ui.height - top < 10 then null
      else top
    right = if left is null then 0 else null
    bottom = if top is null then 0 else null
    #using null instead of '' is 4% faster
    #these 4 statements are 40% faster than 1 style.cssText
    {style} = ui.el
    style.top    = top
    style.right  = right
    style.bottom = bottom
    style.left   = left
  dragend: ->
    #$ coffee -bpe '{a} = {b} = c'
    #var a, b;
    #a = (b = c.b, c).a;
    {el} = ui
    localStorage["#{NAMESPACE}#{el.id}.position"] = el.style.cssText
    d.removeEventListener 'mousemove', ui.drag, false
    d.removeEventListener 'mouseup',   ui.dragend, false
  hover: (e) ->
    {clientX, clientY} = e
    {el} = ui
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
    $.rm ui.el
    delete ui.el

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
      cb JSON.parse e.newValue if e.key is "#{NAMESPACE}#{key}"
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
      req = $.ajax url, onload: (-> cb.call @ for cb in @callbacks)
      req.callbacks = [cb]
      $.cache.requests[url] = req
  cb:
    checked: ->
      $.set @name, @checked
      conf[@name] = @checked
    value: ->
      $.set @name, @value
      conf[@name] = @value
  addStyle: (css) ->
    style = $.el 'style',
      textContent: css
    $.add d.head, style
    style
  x: (path, root=d.body) ->
    # XPathResult.ANY_UNORDERED_NODE_TYPE is 8
    d.evaluate(path, root, null, 8, null).
      singleNodeValue
  replace: (root, el) ->
    root.parentNode.replaceChild el, root
  addClass: (el, className) ->
    el.classList.add className
  removeClass: (el, className) ->
    el.classList.remove className
  rm: (el) ->
    el.parentNode.removeChild el
  tn: (s) ->
    d.createTextNode s
  nodes: (nodes) ->
    unless nodes instanceof Array
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
  el: (tag, properties) ->
    el = d.createElement tag
    $.extend el, properties if properties
    el
  on: (el, eventType, handler) ->
    el.addEventListener eventType, handler, false
  off: (el, eventType, handler) ->
    el.removeEventListener eventType, handler, false
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
      name = NAMESPACE + name
      GM_deleteValue name
    get: (name, defaultValue) ->
      name = NAMESPACE + name
      if value = GM_getValue name
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      name = NAMESPACE + name
      # for `storage` events
      localStorage[name] = JSON.stringify value
      GM_setValue name, JSON.stringify value
  else
    delete: (name) ->
      name = NAMESPACE + name
      delete localStorage[name]
    get: (name, defaultValue) ->
      name = NAMESPACE + name
      if value = localStorage[name]
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      name = NAMESPACE + name
      localStorage[name] = JSON.stringify value

#load values from localStorage
for key, val of conf
  conf[key] = $.get key, val

$$ = (selector, root=d.body) ->
  Array::slice.call root.querySelectorAll selector

filter =
  filters: {}
  init: ->
    for key of config.filter
      @filters[key] = []
      for filter in conf[key].split('\n')
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
      g.callbacks.push @node

  createFilter: (regexp, op, hl, top) ->
    (root, value, isOP) ->
      if isOP and op is 'no' or !isOP and op is 'only'
        return false
      if typeof regexp is 'string'
        # MD5 checking
        if regexp isnt value
          return false
      else unless regexp.test value
        return false
      if hl
        $.addClass root, hl
        if isOP and top and not g.REPLY
          # Put the highlighted OPs' threads on top of the board pages...
          thisThread = root.parentNode
          # ...before the first non highlighted thread.
          if firstThread = $ 'div[class=op]'
            $.before firstThread.parentNode, [thisThread, thisThread.nextElementSibling]
        # Continue the filter lookup to add more classes or hide it.
        return false
      if isOP
        unless g.REPLY
          threadHiding.hideHide root.parentNode
      else
        replyHiding.hideHide root
      true

  node: (root) ->
    klass = root.className
    return if /\binlined\b/.test klass
    unless isOP = klass is 'op'
      root = $ 'td[id]', root
    for key of filter.filters
      if filter.test root, key, isOP
        return

  test: (root, key, isOP) ->
    value = @[key] root, isOP
    if value is false
      # Return if there's nothing to filter (no tripcode for example).
      return false

    for filter in @filters[key]
      if filter root, value, isOP
        return true
    false

  name: (root, isOP) ->
    name = if isOP then $ '.postername', root else $ '.commentpostername', root
    name.textContent
  tripcode: (root) ->
    if trip = $ '.postertrip', root
      return trip.textContent
    false
  email: (root) ->
    if mail = $ '.linkmail', root
      return mail.href
    false
  subject: (root, isOP) ->
    sub = if isOP then $ '.filetitle', root else $ '.replytitle', root
    sub.textContent
  comment: (root) ->
    text = []
    # XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE is 7
    nodes = d.evaluate './/br|.//text()', root.lastChild, null, 7, null
    i = 0
    len = nodes.snapshotLength
    while i < len
      text.push if data = nodes.snapshotItem(i++).data then data else '\n'
    text.join ''
  filename: (root) ->
    if file = $ '.filesize > span', root
      return file.title
    false
  dimensions: (root) ->
    if span = $ '.filesize', root
      return span.textContent.match(/\d+x\d+/)[0]
    return false
  filesize: (root) ->
    if img = $ 'img[md5]', root
      return img.alt
    false
  md5: (root) ->
    if img = $ 'img[md5]', root
      return img.getAttribute 'md5'
    false

strikethroughQuotes =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    return if root.className is 'inline'
    for quote in $$ '.quotelink', root
      if (el = $.id quote.hash[1..]) and el.parentNode.parentNode.parentNode.hidden
        $.addClass quote, 'filtered'
        root.hidden = true if conf['Recursive Filtering']
    return

expandComment =
  init: ->
    for a in $$ '.abbr > a'
      $.on a, 'click', expandComment.expand
  expand: (e) ->
    e.preventDefault()
    [_, threadID, replyID] = @href.match /(\d+)#(\d+)/
    @textContent = "Loading #{replyID}..."
    threadID = @pathname.split('/').pop() or $.x('ancestor::div[@class="thread"]/div', @).id
    a = @
    $.cache @pathname, (-> expandComment.parse @, a, threadID, replyID)
  parse: (req, a, threadID, replyID) ->
    if req.status isnt 200
      a.textContent = "#{req.status} #{req.statusText}"
      return

    body = $.el 'body',
      innerHTML: req.responseText

    if threadID is replyID #OP
      bq = $ 'blockquote', body
    else
      #css selectors don't like ids starting with numbers,
      # getElementById only works for root document.
      for reply in $$ 'td[id]', body
        if reply.id == replyID
          bq = $ 'blockquote', reply
          break
    for quote in $$ '.quotelink', bq
      if quote.getAttribute('href') is quote.hash
        quote.pathname = "/#{g.BOARD}/res/#{threadID}"
    $.replace a.parentNode.parentNode, bq
    if conf['Quote Preview']
      quotePreview.node bq
    if conf['Quote Inline']
      quoteInline.node bq
    quoteIndicators.node bq

expandThread =
  init: ->
    for span in $$ '.omittedposts'
      a = $.el 'a',
        textContent: "+ #{span.textContent}"
        className: 'omittedposts'
        href: 'javascript:;'
      $.on a, 'click', expandThread.cb.toggle
      $.replace span, a

  cb:
    toggle: ->
      thread = @parentNode
      expandThread.toggle thread

  toggle: (thread) ->
    threadID = thread.firstChild.id
    pathname = "/#{g.BOARD}/res/#{threadID}"
    a = $ '.omittedposts', thread

    switch a.textContent[0]
      when '+'
        $('.op .container', thread)?.textContent = ''
        a.textContent = a.textContent.replace '+', 'X Loading...'
        $.cache pathname, (-> expandThread.parse @, pathname, thread, a)

      when 'X'
        a.textContent = a.textContent.replace 'X Loading...', '+'
        #FIXME this will kill all callbacks
        $.cache[pathname].abort()

      when '-'
        a.textContent = a.textContent.replace '-', '+'
        #goddamit moot
        num = switch g.BOARD
          when 'b' then 3
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
      $.off a, 'click', expandThread.cb.toggle
      return

    a.textContent = a.textContent.replace 'X Loading...', '-'

    body = $.el 'body',
      innerHTML: req.responseText

    nodes = []
    for reply in $$ '.reply', body
      for quote in $$ '.quotelink', reply
        if (href = quote.getAttribute('href')) is quote.hash #add pathname to normal quotes
          quote.pathname = pathname
        else if href isnt quote.href #fix x-thread links, not x-board ones
          quote.href = "res/#{href}"
      link = $ '.quotejs', reply
      link.href = "res/#{thread.firstChild.id}##{reply.id}"
      link.nextSibling.href = "res/#{thread.firstChild.id}#q#{reply.id}"
      nodes.push reply.parentNode.parentNode.parentNode
    # eat everything, then replace with fresh full posts
    while (next = a.nextSibling) and not next.clear #br[clear]
      $.rm next
    $.before next, nodes

replyHiding =
  init: ->
    g.callbacks.push @node

  node: (root) ->
    return unless dd = $ '.doubledash', root
    dd.className = 'replyhider'
    a = $.el 'a',
      textContent: '[ - ]'
      href: 'javascript:;'
    $.on a, 'click', replyHiding.cb.hide
    $.replace dd.firstChild, a

    reply = dd.nextSibling
    id = reply.id
    if id of g.hiddenReplies
      replyHiding.hide reply

  cb:
    hide: ->
      reply = @parentNode.nextSibling
      replyHiding.hide reply

    show: ->
      div = @parentNode
      table = div.nextSibling
      replyHiding.show table

      $.rm div

  hide: (reply) ->
    replyHiding.hideHide reply

    id = reply.id
    for quote in $$ ".quotelink[href='##{id}'], .backlink[href='##{id}']"
      $.addClass quote, 'filtered'

    g.hiddenReplies[id] = Date.now()
    $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

  hideHide: (reply) ->
    table = reply.parentNode.parentNode.parentNode
    return if table.hidden #already hidden by filter

    table.hidden = true

    if conf['Show Stubs']
      name = $('.commentpostername', reply).textContent
      uid = $('.posteruid', reply)?.textContent or ''
      trip = $('.postertrip', reply)?.textContent or ''

      div = $.el 'div',
        className: 'stub'
        innerHTML: "<a href=javascript:;><span>[ + ]</span> #{name} #{uid} #{trip}</a>"
      $.on $('a', div), 'click', replyHiding.cb.show
      $.before table, div

  show: (table) ->
    table.hidden = false

    id = $('td[id]', table).id
    for quote in $$ ".quotelink[href='##{id}'], .backlink[href='##{id}']"
      $.removeClass quote, 'filtered'

    delete g.hiddenReplies[id]
    $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

keybinds =
  init: ->
    for node in $$ '[accesskey]'
      node.removeAttribute 'accesskey'
    $.on d, 'keydown',  keybinds.keydown

  keydown: (e) ->
    if not (key = keybinds.keyCode(e)) or /TEXTAREA|INPUT/.test(e.target.nodeName) and not (e.altKey or e.ctrlKey or e.keyCode is 27)
      return

    thread = nav.getThread()
    switch key
      when conf.openOptions
        options.dialog() unless $.id 'overlay'
      when conf.close
        if o = $.id 'overlay'
          options.close.call o
        else if qr.el
          qr.close()
      when conf.spoiler
        ta = e.target
        return unless ta.nodeName is 'TEXTAREA'

        value    = ta.value
        selStart = ta.selectionStart
        selEnd   = ta.selectionEnd

        valStart = value[0...selStart] + '[spoiler]'
        valMid   = value[selStart...selEnd]
        valEnd   = '[/spoiler]' + value[selEnd..]

        ta.value = valStart + valMid + valEnd
        range = valStart.length + valMid.length
        ta.setSelectionRange range, range
      when conf.zero
        window.location = "/#{g.BOARD}/0#0"
      when conf.openEmptyQR
        keybinds.qr thread
      when conf.openQR
        keybinds.qr thread, true
      when conf.nextReply
        keybinds.hl.next thread
      when conf.previousReply
        keybinds.hl.prev thread
      when conf.expandAllImages
        keybinds.img thread, true
      when conf.openThread
        keybinds.open thread
      when conf.expandThread
        expandThread.toggle thread
      when conf.expandImage
        keybinds.img thread
      when conf.nextThread
        return if g.REPLY
        nav.scroll +1
      when conf.openThreadTab
        keybinds.open thread, true
      when conf.previousThread
        return if g.REPLY
        nav.scroll -1
      when conf.update
        updater.update()
      when conf.watch
        watcher.toggle thread
      when conf.hide
        threadHiding.toggle thread
      when conf.nextPage
        $('input[value=Next]')?.click()
      when conf.previousPage
        $('input[value=Previous]')?.click()
      when conf.submit
        qr.submit() if qr.el and !qr.status()
      when conf.unreadCountTo0
        unread.replies = []
        unread.update()
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
      $("#imageExpand").click()
    else
      thumb = $ 'img[md5]', $('.replyhl', thread) or thread
      imgExpand.toggle thumb.parentNode

  qr: (thread, quote) ->
    if quote
      qr.quote.call $ '.quotejs + .quotejs', $('.replyhl', thread) or thread
    else
      qr.open()
    $('textarea', qr.el).focus()

  open: (thread, tab) ->
    id = thread.firstChild.id
    url = "http://boards.4chan.org/#{g.BOARD}/res/#{id}"
    if tab
      open = GM_openInTab or window.open
      open url, "_blank"
    else
      location.href = url

  hl:
    next: (thread) ->
      if td = $ 'td.replyhl', thread
        td.className = 'reply'
        rect = td.getBoundingClientRect()
        if rect.top > 0 and rect.bottom < d.body.clientHeight #you're fully visible
          next = $.x 'following::td[@class="reply"]', td
          return if $.x('ancestor::div[@class="thread"]', next) isnt thread
          rect = next.getBoundingClientRect()
          if rect.top > 0 and rect.bottom < d.body.clientHeight #and so is the next
            next.className = 'replyhl'
          return

      replies = $$ 'td.reply', thread
      for reply in replies
        top = reply.getBoundingClientRect().top
        if top > 0
          reply.className = 'replyhl'
          return

    prev: (thread) ->
      if td = $ 'td.replyhl', thread
        td.className = 'reply'
        rect = td.getBoundingClientRect()
        if rect.top > 0 and rect.bottom < d.body.clientHeight #you're fully visible
          prev = $.x 'preceding::td[@class="reply"][1]', td
          rect = prev.getBoundingClientRect()
          if rect.top > 0 and rect.bottom < d.body.clientHeight #and so is the prev
            prev.className = 'replyhl'
          return

      replies = $$ 'td.reply', thread
      replies.reverse()
      height = d.body.clientHeight
      for reply in replies
        bot = reply.getBoundingClientRect().bottom
        if bot < height
          reply.className = 'replyhl'
          return

nav =
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

    $.on prev, 'click', nav.prev
    $.on next, 'click', nav.next

    $.add span, [prev, $.tn(' '), next]
    $.add d.body, span

  prev: ->
    if g.REPLY
      window.scrollTo 0, 0
    else
      nav.scroll -1

  next: ->
    if g.REPLY
      window.scrollTo 0, d.body.scrollHeight
    else
      nav.scroll +1

  threads: []

  getThread: (full) ->
    nav.threads = $$ '.thread:not([hidden])'
    for thread, i in nav.threads
      rect = thread.getBoundingClientRect()
      {bottom} = rect
      if bottom > 0 #we have not scrolled past
        if full
          return [thread, i, rect]
        return thread
    return null

  scroll: (delta) ->
    [thread, i, rect] = nav.getThread true
    {top} = rect

    #unless we're not at the beginning of the current thread
    # (and thus wanting to move to beginning)
    # or we're above the first thread and don't want to skip it
    unless (delta is -1 and Math.ceil(top) < 0) or (delta is +1 and top > 1)
      i += delta

    {top} = nav.threads[i]?.getBoundingClientRect()
    window.scrollBy 0, top

unxify =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    switch unxify.censor
      when true
        quote = $ '.quotejs + .quotejs', root
        quote.textContent = quote.previousElementSibling.hash[1..]
      when false
        # Don't execute on safe boards.
      else
        number = $('.quotejs + .quotejs', root).textContent
        # 3 digits long post numbers are not censored.
        return if number.length < 4
        # Test if the board's censored.
        unxify.censor = /\D/.test $('.quotejs + .quotejs', root).textContent
        unxify.node root

qr =
  init: ->
    return unless $.id 'recaptcha_challenge_field_holder'
    if conf['Hide Original Post Form']
      link = $.el 'h1', innerHTML: "<a href=javascript:;>#{if g.REPLY then 'Quick Reply' else 'New Thread'}</a>"
      $.on $('a', link), 'click', ->
        qr.open()
        $('textarea', qr.el).focus()
      form = d.forms[0]
      $.before form, link
    g.callbacks.push @node

    # CORS is ignored for content script on Chrome, but not Safari/Oprah/Firefox.
    if /chrome/i.test navigator.userAgent
      qr.status ready: true
    else
      iframe = $.el 'iframe',
        id: 'iframe'
        src: 'http://sys.4chan.org/robots.txt'
      $.on iframe, 'error', -> @src = @src
      # Greasemonkey ghetto fix
      loadChecking = (iframe) ->
        unless qr.status.ready
          iframe.src = 'about:blank'
          setTimeout (-> iframe.src = 'http://sys.4chan.org/robots.txt'), 100
      $.on iframe, 'load', -> if @src isnt 'about:blank' then setTimeout loadChecking, 500, @
      $.add d.head, iframe

    # Prevent original captcha input from being focused on reload.
    script = $.el 'script', textContent: 'Recaptcha.focus_response_field=function(){}'
    $.add d.head, script
    $.rm script

    if conf['Persistent QR']
      qr.dialog()
      qr.hide() if conf['Auto Hide QR']
    $.on d, 'dragover',  qr.dragOver
    $.on d, 'drop',      qr.dropFile
    $.on d, 'dragstart', qr.drag
    $.on d, 'dragend',   qr.drag

  node: (root) ->
    $.on $('.quotejs + .quotejs', root), 'click', qr.quote

  open: ->
    if qr.el
      qr.el.hidden = false
      qr.unhide()
    else
      qr.dialog()
  close: ->
    qr.el.hidden = true
    qr.message.send req: 'abort'
    d.activeElement.blur()
    $.removeClass qr.el, 'dump'
    for i in qr.replies
      qr.replies[0].rm()
    qr.cooldown.auto = false
    qr.status()
    qr.resetFileInput()
    if not conf['Remember Spoiler'] and (spoiler = $.id 'spoiler').checked
      spoiler.click()
    qr.cleanError()
  hide: ->
    d.activeElement.blur()
    $.addClass qr.el, 'autohide'
    $.id('autohide').checked = true
  unhide: ->
    $.removeClass qr.el, 'autohide'
    $.id('autohide').checked = false
  toggleHide: ->
    @checked and qr.hide() or qr.unhide()

  error: (err, node) ->
    el = $ '.warning', qr.el
    el.textContent = err
    $.replace el.firstChild, node if node
    qr.open()
    if /captcha|verification/i.test err
      # Focus the captcha input on captcha error.
      $('[autocomplete]', qr.el).focus()
    alert err if d.hidden or d.oHidden or d.mozHidden or d.webkitHidden
  cleanError: ->
    $('.warning', qr.el).textContent = null

  status: (data={}) ->
    if data.ready
      qr.status.ready  = true
      qr.status.banned = data.banned
    else unless qr.status.ready
      value    = 'Loading'
      disabled = true
    if g.dead
      value    = 404
      disabled = true
      qr.cooldown.auto = false
    else if qr.status.banned
      value    = 'Banned'
      disabled = true
    else
      # do not cancel `value = 'Loading'` once the cooldown is over
      value = qr.cooldown.seconds or data.progress or value
    return unless qr.el
    {input} = qr.status
    input.value =
      if qr.cooldown.auto and conf['Cooldown']
        if value then "Auto #{value}" else 'Auto'
      else
        value or 'Submit'
    input.disabled = disabled or false

  cooldown:
    init: ->
      return unless conf['Cooldown']
      qr.cooldown.start $.get "/#{g.BOARD}/cooldown", 0
      $.sync "/#{g.BOARD}/cooldown", qr.cooldown.start
    start: (timeout) ->
      seconds = Math.floor (timeout - Date.now()) / 1000
      qr.cooldown.count seconds
    set: (seconds) ->
      return unless conf['Cooldown']
      qr.cooldown.count seconds
      $.set "/#{g.BOARD}/cooldown", Date.now() + seconds*SECOND
    count: (seconds) ->
      return unless 0 <= seconds <= 60
      setTimeout qr.cooldown.count, 1000, seconds-1
      qr.cooldown.seconds = seconds
      if seconds is 0
        $.delete "/#{g.BOARD}/cooldown"
        qr.submit() if qr.cooldown.auto
      qr.status()

  quote: (e) ->
    e?.preventDefault()
    qr.open()
    unless g.REPLY
      $('select', qr.el).value = $.x('ancestor::div[@class="thread"]', @).firstChild.id

    # Make sure we get the correct number, even with XXX censors
    id = @previousElementSibling.hash[1..]
    text = ">>#{id}\n"

    sel = window.getSelection()
    if (s = sel.toString()) and id is $.x('ancestor-or-self::blockquote/preceding-sibling::input', sel.anchorNode)?.name
      s = s.replace /\n/g, '\n>'
      text += ">#{s}\n"

    ta = $ 'textarea', qr.el
    caretPos = ta.selectionStart
    # Replace selection for text.
    # onchange event isn't triggered, save value.
    qr.selected.el.lastChild.textContent =
      qr.selected.com =
        ta.value =
          ta.value[0...caretPos] + text + ta.value[ta.selectionEnd...ta.value.length]
    ta.focus()
    # Move the caret to the end of the new quote.
    ta.selectionEnd = ta.selectionStart = caretPos + text.length

  drag: (e) ->
    # Let it drag anything from the page.
    i = if e.type is 'dragstart' then 'off' else 'on'
    $[i] d, 'dragover', qr.dragOver
    $[i] d, 'drop',     qr.dropFile
  dragOver: (e) ->
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy' # cursor feedback
  dropFile: (e) ->
    # Let it only handle files from the desktop.
    return unless e.dataTransfer.files.length
    e.preventDefault()
    qr.open()
    qr.fileInput.call e.dataTransfer
    $.addClass qr.el, 'dump'
  fileInput: ->
    qr.cleanError()
    # Set or change current reply's file.
    if @files.length is 1
      file = @files[0]
      if file.size > @max
        qr.error 'File too large.'
        qr.resetFileInput()
      else if -1 is qr.mimeTypes.indexOf file.type
        qr.error 'Unsupported file type.'
        qr.resetFileInput()
      else
        qr.selected.setFile file
      return
    # Create new replies with these files.
    for file in @files
      if file.size > @max
        qr.error "File #{file.name} is too large."
        break
      else if -1 is qr.mimeTypes.indexOf file.type
        qr.error "#{file.name}: Unsupported file type."
        break
      unless qr.replies[qr.replies.length - 1].file
        # set last reply's file
        qr.replies[qr.replies.length - 1].setFile file
      else
        new qr.reply().setFile file
    $.addClass qr.el, 'dump'
    qr.resetFileInput() # reset input
  resetFileInput: ->
    $('[type=file]', qr.el).value = null

  replies: []
  reply: class
    constructor: ->
      # set values, or null, to avoid 'undefined' values in inputs
      prev     = qr.replies[qr.replies.length-1]
      persona  = $.get 'qr.persona', {}
      @name    = if prev then prev.name else persona.name or null
      @email   = if prev and !/^sage$/.test prev.email then prev.email   else persona.email or null
      @sub     = if prev and conf['Remember Subject']  then prev.sub     else if conf['Remember Subject'] then persona.sub else null
      @spoiler = if prev and conf['Remember Spoiler']  then prev.spoiler else false
      @com = null

      @el = $.el 'a',
        className: 'preview'
        draggable: true
        href: 'javascript:;'
        innerHTML: '<a class=remove>x</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
      $('input', @el).checked = @spoiler
      $.on @el,               'click',      => @select()
      $.on $('.remove', @el), 'click',  (e) =>
        e.stopPropagation()
        @rm()
      $.on $('label',   @el), 'click',  (e) => e.stopPropagation()
      $.on $('input',   @el), 'change', (e) =>
        @spoiler = e.target.checked
        $.id('spoiler').checked = @spoiler if @el.id is 'selected'
      $.before $('#addReply', qr.el), @el

      $.on @el, 'dragstart', @dragStart
      $.on @el, 'dragenter', @dragEnter
      $.on @el, 'dragleave', @dragLeave
      $.on @el, 'dragover',  @dragOver
      $.on @el, 'dragend',   @dragEnd
      $.on @el, 'drop',      @drop

      qr.replies.push @
    setFile: (@file) ->
      @el.title = file.name
      if file.type is 'application/pdf'
        @el.style.backgroundImage = null
        return
      $('label', @el).hidden = false if qr.spoiler
      url = window.URL or window.webkitURL
      url.revokeObjectURL @url
      @url = url.createObjectURL file
      @el.style.backgroundImage = "url(#{@url})"
    select: ->
      qr.selected?.el.id = null
      qr.selected = @
      @el.id = 'selected'
      # Scroll the list to center the focused reply.
      rectEl   = @el.getBoundingClientRect()
      rectList = @el.parentNode.getBoundingClientRect()
      @el.parentNode.scrollLeft += rectEl.left + rectEl.width/2 - rectList.left - rectList.width/2
      # Load this reply's values.
      for data in ['name', 'email', 'sub', 'com']
        $("[name=#{data}]", qr.el).value = @[data]
      $('#spoiler', qr.el).checked = @spoiler
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
      reply = qr.replies.splice(oldIndex, 1)[0]
      qr.replies.splice newIndex, 0, reply
    dragEnd: ->
      $.removeClass @, 'drag'
      if el = $ '.over', @parentNode
        $.removeClass el, 'over'
    rm: ->
      qr.resetFileInput()
      $.rm @el
      index = qr.replies.indexOf @
      if qr.replies.length is 1
        new qr.reply().select()
      else if @el.id is 'selected'
        (qr.replies[index-1] or qr.replies[index+1]).select()
      qr.replies.splice index, 1
      (window.URL or window.webkitURL).revokeObjectURL @url
      delete @

  captcha:
    init: ->
      @img       = $ '.captcha > img', qr.el
      @input     = $ '[autocomplete]', qr.el
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
      @timeout  = Date.now() + 26*MINUTE
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
      qr.captcha.input.focus() if focus
    keydown: (e) ->
      c = qr.captcha
      if e.keyCode is 8 and not c.input.value
        c.reload()
      else if e.keyCode is 13 and e.shiftKey
        c.save()
      else
        return
      e.preventDefault()

  dialog: ->
    qr.el = ui.dialog 'qr', 'top:0;right:0;', '
<div class=move>
  Quick Reply <input type=checkbox id=autohide title=Auto-hide>
  <span> <a class=close title=Close>x</a></span>
</div>
<form>
  <div><input id=dump class=field type=button title="Dump list" value=+><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>
  <div id=replies><div><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>
  <div><textarea name=com title=Comment placeholder=Comment class=field></textarea></div>
  <div class=captcha title=Reload><img></div>
  <div><input title=Verification class=field autocomplete=off size=1></div>
  <div><input type=file multiple size=16><input type=submit></div>
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image</label>
  <div class=warning></div>
</form>'

    if conf['Remember QR size'] and engine is 'gecko'
      $.on ta = $('textarea', qr.el), 'mouseup', ->
        $.set 'qr.size', @style.cssText
      ta.style.cssText = $.get 'qr.size', ''

    # Allow only this board's supported files.
    mimeTypes = $('.rules').firstChild.textContent.match(/: (.+) /)[1].toLowerCase().replace /\w+/g, (type) ->
      switch type
        when 'jpg'
          'image/jpeg'
        when 'pdf'
          'application/pdf'
        else
          "image/#{type}"
    qr.mimeTypes     = mimeTypes.split ', '
    fileInput        = $ '[type=file]', qr.el
    fileInput.max    = $('[name=MAX_FILE_SIZE]').value
    fileInput.accept = mimeTypes

    qr.spoiler     = !!$ '#com_submit + label'
    spoiler        = $ '#spoilerLabel', qr.el
    spoiler.hidden = !qr.spoiler

    unless g.REPLY
      # Make a list with visible threads and an option to create a new one.
      threads = '<option value=new>New thread</option>'
      for thread in $$ '.op'
        threads += "<option value=#{thread.id}>Thread #{thread.id}</option>"
      $.prepend $('.move > span', qr.el), $.el 'select'
        innerHTML: threads
        title: 'Create a new thread / Reply to a thread'
      $.on $('select',  qr.el), 'mousedown', (e) -> e.stopPropagation()
    $.on $('#autohide', qr.el), 'change',    qr.toggleHide
    $.on $('.close',    qr.el), 'click',     qr.close
    $.on $('#dump',     qr.el), 'click',     -> qr.el.classList.toggle 'dump'
    $.on $('#addReply', qr.el), 'click',     -> new qr.reply().select()
    $.on $('form',      qr.el), 'submit',    qr.submit
    $.on $('textarea',  qr.el), 'keyup',     -> qr.selected.el.lastChild.textContent = @value
    $.on fileInput,             'change',    qr.fileInput
    $.on spoiler.firstChild,    'change',    -> $('input', qr.selected.el).click()
    $.on $('.warning',  qr.el), 'click',     qr.cleanError

    new qr.reply().select()
    # save selected reply's data
    for name in ['name', 'email', 'sub', 'com']
      input = $ "[name=#{name}]", qr.el
      $.on input, 'keyup',  -> qr.selected[@name] = @value
      $.on input, 'change', -> qr.selected[@name] = @value
    # sync between tabs
    $.sync 'qr.persona', (persona) ->
      return unless qr.el.hidden
      for key, val of persona
        qr.selected[key] = val
        $("[name=#{key}]", qr.el).value = val

    qr.status.input = $ '[type=submit]', qr.el
    qr.status()
    qr.cooldown.init()
    qr.captcha.init()
    $.add d.body, qr.el

    # Create a custom event when the QR dialog is first initialized.
    # Use it to extend the QR's functionalities, or for XTRM RICE.
    e = d.createEvent 'CustomEvent'
    e.initEvent 'QRDialogCreation', true, false
    qr.el.dispatchEvent e

  submit: (e) ->
    e?.preventDefault()
    if qr.cooldown.seconds
      qr.cooldown.auto = !qr.cooldown.auto
      qr.status()
      return
    qr.message.send req: 'abort'
    reply = qr.replies[0]

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
        challenge   = qr.captcha.img.alt
        if response = qr.captcha.input.value then qr.captcha.reload()
      $.set 'captchas', captchas
      qr.captcha.count captchas.length
      unless response
        err = 'No valid captcha.'

    if err
      # stop auto-posting
      qr.cooldown.auto = false
      qr.status()
      qr.error err
      return
    qr.cleanError()

    threadID = g.THREAD_ID or $('select', qr.el).value

    # Enable auto-posting if we have stuff to post, disable it otherwise.
    qr.cooldown.auto = qr.replies.length > 1
    if conf['Auto Hide QR'] and not qr.cooldown.auto
      qr.hide()
    if conf['Thread Watcher'] and conf['Auto Watch Reply'] and threadID isnt 'new'
      watcher.watch threadID

    post =
      board:   g.BOARD
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
      recaptcha_response_field:  response

    # Starting to upload might take some time.
    # Provide some feedback that we're starting to submit.
    qr.status progress: '...'

    if engine is 'gecko' and reply.file
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
        qr.message.send post
      reader.readAsBinaryString reply.file
      return

    # CORS is ignored for content script on Chrome, but not Safari/Oprah/Firefox.
    if /chrome/i.test navigator.userAgent
      qr.message.post post
      return
    qr.message.send post

  response: (html) ->
    doc = $.el 'a', innerHTML: html
    # Check for ban.
    if $('title', doc).textContent is '4chan - Banned'
      qr.status ready: true, banned: true
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
        qr.cooldown.auto = !!$.get('captchas', []).length
        # Too many frequent mistyped captchas will auto-ban you!
        # On connection error, the post most likely didn't go through.
        qr.cooldown.set 2
      else # stop auto-posting
        qr.cooldown.auto = false
      qr.status()
      qr.error err, node
      return

    reply = qr.replies[0]

    persona = $.get 'qr.persona', {}
    persona =
      name:  reply.name
      email: if /^sage$/.test reply.email then persona.email else reply.email
      sub:   if conf['Remember Subject']  then reply.sub     else null
    $.set 'qr.persona', persona

    [_, thread, postNumber] = b.lastChild.textContent.match /thread:(\d+),no:(\d+)/
    if thread is '0' # new thread
      if conf['Thread Watcher'] and conf['Auto Watch']
        $.set 'autoWatch', postNumber
      # auto-noko
      location.pathname = "/#{g.BOARD}/res/#{postNumber}"
    else
      # Enable auto-posting if we have stuff to post, disable it otherwise.
      qr.cooldown.auto = qr.replies.length > 1
      qr.cooldown.set if /sage/i.test reply.email then 60 else 30
      if conf['Open Reply in New Tab'] && !g.REPLY && !qr.cooldown.auto
        open = GM_openInTab or window.open
        open "http://boards.4chan.org/#{g.BOARD}/res/#{thread}##{postNumber}", "_blank"

    if conf['Persistent QR'] or qr.cooldown.auto
      reply.rm()
    else
      qr.close()

    qr.status()
    qr.resetFileInput()

  message:
    send: (data) ->
      # CORS is ignored for content script on Chrome, but not Safari/Oprah/Firefox.
      if /chrome/i.test navigator.userAgent
        qr.message.receive data
        return
      data.qr = true
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
      delete data.qr
      switch req
        when 'abort'
          qr.ajax?.abort()
          qr.message.send req: 'status'
        when 'response' # xhr response
          qr.response data.html
        when 'status'
          qr.status data
        else
          qr.message.post data # Reply object: we're posting

    post: (data) ->

      url = "http://sys.4chan.org/#{data.board}/post"
      # Do not append these values to the form.
      delete data.board

      # File with filename upload fix from desuwa
      if engine is 'gecko' and data.upfile
        # All of this is fucking retarded.
        unless data.binary
          toBin = (data, name, val) ->
            bb = new MozBlobBuilder()
            bb.append val
            r = new FileReader()
            r.onload = ->
              data[name] = r.result
              unless --i
                qr.message.post data
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
          data.board  = url.split('/')[3]
          data.binary = true
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
          qr.message.send
            req:  'response'
            html: @response
      opts =
        form: form
        type: 'post'
        upCallbacks:
          onload: ->
            qr.message.send
              req:      'status'
              progress: '...'
          onprogress: (e) ->
            qr.message.send
              req:      'status'
              progress: "#{Math.round e.loaded / e.total * 100}%"
      if boundary
        opts.headers =
          'Content-Type': 'multipart/form-data;boundary=' + boundary

      try
        qr.ajax = $.ajax url, callbacks, opts
      catch e
        # CORS disabled error: redirecting to banned page ;_;
        if e.name is 'NETWORK_ERR'
          qr.message.send req: 'status', ready: true, banned: true

options =
  init: ->
    for home in [$.id('navtopr'), $.id('navbotr')]
      a = $.el 'a',
        textContent: '4chan X'
        href: 'javascript:;'
      $.on a, 'click', options.dialog
      $.replace home.firstElementChild, a
    unless $.get 'firstrun'
      $.set 'firstrun', true
      options.dialog()

  dialog: ->
    dialog = $.el 'div'
      id: 'options'
      className: 'reply dialog'
      innerHTML: '<div id=optionsbar>
  <div id=credits>
    <a target=_blank href=http://mayhemydg.github.com/4chan-x/>4chan X</a> | ' + VERSION + '
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
    <ul>These variables will be replaced by the corresponding url:
      <li>$1: Thumbnail.</li>
      <li>$2: Full image.</li>
      <li>$3: MD5 hash.</li>
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
    <p>Tripcode:<br><textarea name=tripcode></textarea></p>
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
    for key, obj of config.main
      ul = $.el 'ul',
        textContent: key
      for key, arr of obj
        checked = if conf[key] then 'checked' else ''
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
    $.on $('button', li), 'click', options.clearHidden
    $.add $('ul:nth-child(2)', dialog), li

    #filter & sauce
    for ta in $$ 'textarea', dialog
      ta.textContent = conf[ta.name]
      $.on ta, 'change', $.cb.value

    #rice
    (back = $ '[name=backlink]', dialog).value = conf['backlink']
    (time = $ '[name=time]',     dialog).value = conf['time']
    $.on back, 'keyup', $.cb.value
    $.on back, 'keyup', options.backlink
    $.on time, 'keyup', $.cb.value
    $.on time, 'keyup', options.time
    favicon = $ 'select', dialog
    favicon.value = conf['favicon']
    $.on favicon, 'change', $.cb.value
    $.on favicon, 'change', options.favicon

    #keybinds
    for key, arr of config.hotkeys
      tr = $.el 'tr',
        innerHTML: "<td>#{arr[1]}</td><td><input name=#{key}></td>"
      input = $ 'input', tr
      input.value = conf[key]
      $.on input, 'keydown', options.keybind
      $.add $('#keybinds_tab + div tbody', dialog), tr

    #indicate if the settings require a feature to be enabled
    indicators = {}
    for indicator in $$ '.warning', dialog
      key = indicator.firstChild.textContent
      indicator.hidden = conf[key]
      indicators[key] = indicator
      $.on $("[name='#{key}']", dialog), 'click', ->
        indicators[@name].hidden = @checked

    overlay = $.el 'div', id: 'overlay'
    $.on overlay, 'click', options.close
    $.on dialog,  'click', (e) -> e.stopPropagation()
    $.add overlay, dialog
    $.add d.body, overlay
    d.body.style.setProperty 'overflow', 'hidden', null

    options.backlink.call back
    options.time.call     time
    options.favicon.call  favicon

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
    return unless (key = keybinds.keyCode e)?
    @value = key
    $.cb.value.call @
  time: ->
    Time.foo()
    Time.date = new Date()
    $.id('timePreview').textContent = Time.funk Time
  backlink: ->
    $.id('backlinkPreview').textContent = conf['backlink'].replace /%id/, '123456789'
  favicon: ->
    Favicon.switch()
    unread.update true
    @nextElementSibling.innerHTML = "<img src=#{Favicon.unreadSFW}> <img src=#{Favicon.unreadNSFW}> <img src=#{Favicon.unreadDead}>"

threading =
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
    node = threading.op node

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
      threading.thread node

threadHiding =
  init: ->
    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    for thread in $$ '.thread'
      op = thread.firstChild
      a = $.el 'a',
        textContent: '[ - ]'
        href: 'javascript:;'
      $.on a, 'click', threadHiding.cb.hide
      $.prepend op, a

      if op.id of hiddenThreads
        threadHiding.hideHide thread

  cb:
    hide: ->
      thread = @parentNode.parentNode
      threadHiding.hide thread
    show: ->
      thread = @parentNode.parentNode
      threadHiding.show thread

  toggle: (thread) ->
    if /\bstub\b/.test(thread.className) or thread.hidden
      threadHiding.show thread
    else
      threadHiding.hide thread

  hide: (thread) ->
    threadHiding.hideHide thread

    id = thread.firstChild.id

    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    hiddenThreads[id] = Date.now()
    $.set "hiddenThreads/#{g.BOARD}/", hiddenThreads

  hideHide: (thread) ->
    if conf['Show Stubs']
      return if /stub/.test thread.className #already hidden by filter
      if span = $ '.omittedposts', thread
        num = Number span.textContent.match(/\d+/)[0]
      else
        num = 0
      num += $$('table', thread).length
      text = if num is 1 then "1 reply" else "#{num} replies"
      name = $('.postername', thread).textContent
      uid  = $('.posteruid', thread)?.textContent or ''
      trip = $('.postername + .postertrip', thread)?.textContent or ''

      a = $.el 'a',
        innerHTML: "<span>[ + ]</span> #{name}#{uid}#{trip} (#{text})"
        href: 'javascript:;'
      $.on a, 'click', threadHiding.cb.show

      div = $.el 'div',
        className: 'block'

      $.add div, a
      $.add thread, div
      $.addClass thread, 'stub'
    else
      thread.hidden = true
      thread.nextSibling.hidden = true

  show: (thread) ->
    $.rm $ 'div.block', thread
    $.removeClass thread, 'stub'
    thread.hidden = false
    thread.nextSibling.hidden = false

    id = thread.firstChild.id

    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    delete hiddenThreads[id]
    $.set "hiddenThreads/#{g.BOARD}/", hiddenThreads

updater =
  init: ->
    html = "<div class=move><span id=count></span> <span id=timer>-#{conf['Interval']}</span></div>"
    {checkbox} = config.updater
    for name of checkbox
      title = checkbox[name][1]
      checked = if conf[name] then 'checked' else ''
      html += "<div><label title='#{title}'>#{name}<input name='#{name}' type=checkbox #{checked}></label></div>"

    checked = if conf['Auto Update'] then 'checked' else ''
    html += "
      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox #{checked}></label></div>
      <div><label>Interval (s)<input name=Interval value=#{conf['Interval']} type=text></label></div>
      <div><input value='Update Now' type=button></div>"

    dialog = ui.dialog 'updater', 'bottom: 0; right: 0;', html

    updater.count = $ '#count', dialog
    updater.timer = $ '#timer', dialog
    updater.br    = $ 'br[clear]'

    for input in $$ 'input', dialog
      if input.type is 'checkbox'
        $.on input, 'click', $.cb.checked
        $.on input, 'click', -> conf[@name] = @checked
        if input.name is 'Scroll BG'
          $.on input, 'click', updater.cb.scrollBG
          updater.cb.scrollBG.call input
        if input.name is 'Verbose'
          $.on input, 'click', updater.cb.verbose
          updater.cb.verbose.call input
        else if input.name is 'Auto Update This'
          $.on input, 'click', updater.cb.autoUpdate
          updater.cb.autoUpdate.call input
      else if input.name is 'Interval'
        $.on input, 'change', -> conf['Interval'] = @value = parseInt(@value, 10) or conf['Interval']
        $.on input, 'change', $.cb.value
      else if input.type is 'button'
        $.on input, 'click', updater.update

    $.add d.body, dialog

    updater.retryCoef = 10
    updater.lastModified = 0

  cb:
    verbose: ->
      if conf['Verbose']
        updater.count.textContent = '+0'
        updater.timer.hidden = false
      else
        $.extend updater.count,
          className: ''
          textContent: 'Thread Updater'
        updater.timer.hidden = true
    autoUpdate: ->
      if @checked
        updater.timeoutID = setTimeout updater.timeout, 1000
      else
        clearTimeout updater.timeoutID
    scrollBG: ->
      updater.scrollBG =
        if @checked
          -> true
        else
          -> !(d.hidden or d.oHidden or d.mozHidden or d.webkitHidden)
    update: ->
      if @status is 404
        updater.timer.textContent = ''
        updater.count.textContent = 404
        updater.count.className = 'warning'
        clearTimeout updater.timeoutID
        g.dead = true
        if conf['Unread Count']
          unread.title = unread.title.match(/^.+-/)[0] + ' 404'
        else
          d.title = d.title.match(/^.+-/)[0] + ' 404'
        unread.update true
        qr.message.send req: 'abort'
        qr.status()
        Favicon.update()
        return

      updater.retryCoef = 10
      updater.timer.textContent = '-' + conf['Interval']

      ###
      Status Code 304: Not modified
      By sending the `If-Modified-Since` header we get a proper status code, and no response.
      This saves bandwidth for both the user and the servers, avoid unnecessary computation,
      and won't load images and scripts when parsing the response.
      ###
      if @status is 304
        if conf['Verbose']
          updater.count.textContent = '+0'
          updater.count.className = null
        return
      updater.lastModified = @getResponseHeader 'Last-Modified'

      body = $.el 'body',
        innerHTML: @responseText

      id = $('td[id]', updater.br.previousElementSibling)?.id or 0
      nodes = []
      for reply in $$('.reply', body).reverse()
        if reply.id <= id #make sure to not insert older posts
          break
        nodes.push reply.parentNode.parentNode.parentNode #table

      newPosts = nodes.length
      scroll = conf['Scrolling'] && updater.scrollBG() && newPosts &&
        updater.br.previousElementSibling.getBoundingClientRect().bottom - d.body.clientHeight < 25
      if conf['Verbose']
        updater.count.textContent = '+' + newPosts
        if newPosts is 0
          updater.count.className = null
        else
          updater.count.className = 'new'

      $.before updater.br, nodes.reverse()
      if scroll
        updater.br.previousSibling.scrollIntoView()

  timeout: ->
    updater.timeoutID = setTimeout updater.timeout, 1000
    n = 1 + Number updater.timer.textContent

    if n is 0
      updater.update()
    else if n is updater.retryCoef
      updater.retryCoef += 10 * (updater.retryCoef < 120)
      updater.retry()
    else
      updater.timer.textContent = n

  retry: ->
    updater.count.textContent = 'Retry'
    updater.count.className = ''
    updater.update()

  update: ->
    updater.timer.textContent = 0
    updater.request?.abort()
    #fool the cache
    url = location.pathname + '?' + Date.now()
    updater.request = $.ajax url, onload: updater.cb.update,
      headers: 'If-Modified-Since': updater.lastModified

watcher =
  init: ->
    html = '<div class=move>Thread Watcher</div>'
    watcher.dialog = ui.dialog 'watcher', 'top: 50px; left: 0px;', html
    $.add d.body, watcher.dialog

    #add watch buttons
    inputs = $$ '.op > input'
    for input in inputs
      favicon = $.el 'img',
        className: 'favicon'
      $.on favicon, 'click', watcher.cb.toggle
      $.before input, favicon

    if g.THREAD_ID is $.get 'autoWatch', 0
      watcher.watch g.THREAD_ID
      $.delete 'autoWatch'
    else
      #populate watcher, display watch buttons
      watcher.refresh()

    $.sync 'watched', watcher.refresh

  refresh: (watched) ->
    watched or= $.get 'watched', {}
    nodes = []
    for board of watched
      for id, props of watched[board]
        x = $.el 'a',
          textContent: 'X'
          href: 'javascript:;'
        $.on x, 'click', watcher.cb.x
        link = $.el 'a', props
        link.title = link.textContent

        div = $.el 'div'
        $.add div, [x, $.tn(' '), link]
        nodes.push div

    for div in $$ 'div:not(.move)', watcher.dialog
      $.rm div
    $.add watcher.dialog, nodes

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
      watcher.toggle @parentNode
    x: ->
      thread = @nextElementSibling.pathname.split '/'
      watcher.unwatch thread[3], thread[1]

  toggle: (thread) ->
    id = $('.favicon + input', thread).name
    watcher.watch(id) or watcher.unwatch id, g.BOARD

  unwatch: (id, board) ->
    watched = $.get 'watched', {}
    delete watched[board][id]
    $.set 'watched', watched
    watcher.refresh()

  watch: (id) ->
    thread = $.id id
    return false if $('.favicon', thread).src is Favicon.default

    watched = $.get 'watched', {}
    watched[g.BOARD] or= {}
    watched[g.BOARD][id] =
      href: "/#{g.BOARD}/res/#{id}"
      textContent: getTitle thread
    $.set 'watched', watched
    watcher.refresh()
    true

anonymize =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    name = $ '.commentpostername, .postername', root
    name.textContent = 'Anonymous'
    if trip = $ '.postertrip', root
      if trip.parentNode.nodeName is 'A'
        $.rm trip.parentNode
      else
        $.rm trip

sauce =
  init: ->
    return if g.BOARD is 'f'
    @links = []
    for link in conf['sauces'].split '\n'
      continue if link[0] is '#'
      @links.push @funk link
    return unless @links.length
    g.callbacks.push @node

  funk: (link) ->
    domain = link.match(/(\w+)\.\w+\//)[1]
    href   = link.replace /(\$\d)/, (fragment) ->
      switch fragment
        when '$1'
          "http://thumbs.4chan.org' + img.pathname.replace(/src(\\/\\d+).+$/, 'thumb$1s.jpg') + '"
        when '$2'
          "' + img.href + '"
        when '$3'
          "' + img.firstChild.getAttribute('md5').replace(/\=*$/, '') + '"
    href = Function 'img', "return '#{href}'"
    (img) ->
      $.el 'a',
        href: href img
        target: '_blank'
        textContent: domain

  node: (root) ->
    return if root.className is 'inline' or not span = $ '.filesize', root
    img = span.nextElementSibling.nextElementSibling
    nodes = []
    for link in sauce.links
      nodes.push $.tn(' '), link img
    $.add span, nodes

revealSpoilers =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    return if not (img = $ 'img[alt^=Spoil]', root) or root.className is 'inline'
    img.removeAttribute 'height'
    img.removeAttribute 'width'
    img.src = "http://thumbs.4chan.org#{img.parentNode.pathname.replace(/src(\/\d+).+$/, 'thumb$1s.jpg')}"

Time =
  init: ->
    Time.foo()

    # GMT -8 is given as +480; would GMT +8 be -480 ?
    chanOffset = 5 - new Date().getTimezoneOffset() / 60
    # 4chan = EST = GMT -5
    chanOffset-- if $.isDST()

    @parse =
      if Date.parse '10/11/11(Tue)18:53' is 1318351980000
        (node) -> new Date Date.parse(node.textContent) + chanOffset*HOUR
      else # Firefox and Opera do not parse 4chan's time format correctly
        (node) ->
          [_, month, day, year, hour, min] =
            node.textContent.match /(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\d+)/
          year = "20#{year}"
          month -= 1 #months start at 0
          hour = chanOffset + Number hour
          new Date year, month, day, hour, min

    g.callbacks.push @node
  node: (root) ->
    return if root.className is 'inline'
    node = $('.posttime', root) or $('span[id]', root).previousSibling
    Time.date = Time.parse node
    time = $.el 'time',
      textContent: ' ' + Time.funk(Time) + ' '
    $.replace node, time
  foo: ->
    code = conf['time'].replace /%([A-Za-z])/g, (s, c) ->
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

getTitle = (thread) ->
  el = $ '.filetitle', thread
  if not el.textContent
    el = $ 'blockquote', thread
    if not el.textContent
      el = $ '.postername', thread
  span = $.el 'span', innerHTML: el.innerHTML.replace /<br>/g, ' '
  "/#{g.BOARD}/ - #{span.textContent}"

titlePost =
  init: ->
    d.title = getTitle()

quoteBacklink =
  init: ->
    format = conf['backlink'].replace /%id/g, "' + id + '"
    quoteBacklink.funk = Function 'id', "return '#{format}'"
    g.callbacks.push @node
  node: (root) ->
    return if /\binline\b/.test root.className
    quotes = {}
    for quote in $$ '.quotelink', root
      # Don't process >>>/b/.
      if qid = quote.hash[1..]
        # Duplicate quotes get overwritten.
        quotes[qid] = true
    # OP or reply id.
    id = $('input', root).name
    a = $.el 'a',
      href: "##{id}"
      className: if root.hidden then 'filtered backlink' else 'backlink'
      textContent: quoteBacklink.funk id
    for qid of quotes
      # Don't backlink the OP.
      continue if !(el = $.id qid) or el.className is 'op' and !conf['OP Backlinks']
      link = a.cloneNode true
      if conf['Quote Preview']
        $.on link, 'mouseover', quotePreview.mouseover
      if conf['Quote Inline']
        $.on link, 'click', quoteInline.toggle
      unless (container = $ '.container', el) and container.parentNode is el
        container = $.el 'span', className: 'container'
        root = $('.reportbutton', el) or $('span[id]', el)
        $.after root, container
      $.add container, [$.tn(' '), link]
    return

quoteInline =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    for quote in $$ '.quotelink, .backlink', root
      continue unless quote.hash
      quote.removeAttribute 'onclick'
      $.on quote, 'click', quoteInline.toggle
    return
  toggle: (e) ->
    return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
    e.preventDefault()
    id = @hash[1..]
    if /\binlined\b/.test @className
      quoteInline.rm @, id
    else
      return if $.x "ancestor::*[@id='#{id}']", @
      quoteInline.add @, id
    @classList.toggle 'inlined'

  add: (q, id) ->
    root = if q.parentNode.nodeName is 'FONT' then q.parentNode else if q.nextSibling then q.nextSibling else q
    if el = $.id id
      inline = quoteInline.table id, el.innerHTML
      if (i = unread.replies.indexOf el.parentNode.parentNode.parentNode) isnt -1
        unread.replies.splice i, 1
        unread.update()
      if /\bbacklink\b/.test q.className
        $.after q.parentNode, inline
        if conf['Forward Hiding']
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
      $.cache pathname, (-> quoteInline.parse @, pathname, id, threadID, inline)

  rm: (q, id) ->
    #select the corresponding table or loading td
    table = $.x "following::*[@id='i#{id}']", q
    $.rm table
    return unless conf['Forward Hiding']
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

    body = $.el 'body',
      innerHTML: req.responseText
    if id is threadID #OP
      op = threading.op $('body > form', body).firstChild
      html = op.innerHTML
    else
      for reply in $$ '.reply', body
        if reply.id == id
          html = reply.innerHTML
          break
    newInline = quoteInline.table id, html
    for quote in $$ '.quotelink', newInline
      if (href = quote.getAttribute('href')) is quote.hash #add pathname to normal quotes
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

quotePreview =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    for quote in $$ '.quotelink, .backlink', root
      $.on quote, 'mouseover', quotePreview.mouseover if quote.hash
    return
  mouseover: (e) ->
    return if /\binlined\b/.test @className
    qp = ui.el = $.el 'div',
      id: 'qp'
      className: 'reply dialog'
    $.add d.body, qp

    id = @hash[1..]
    if el = $.id id
      qp.innerHTML = el.innerHTML
      $.addClass el, 'qphl' if conf['Quote Highlighting']
      if /\bbacklink\b/.test @className
        replyID = $.x('preceding-sibling::input', @parentNode).name
        for quote in $$ '.quotelink', qp
          if quote.hash[1..] is replyID
            quote.className = 'forwardlink'
    else
      qp.textContent = "Loading #{id}..."
      threadID = @pathname.split('/').pop() or $.x('ancestor::div[@class="thread"]', @).firstChild.id
      $.cache @pathname, (-> quotePreview.parse @, id, threadID)
      ui.hover e
    $.on @, 'mousemove', ui.hover
    $.on @, 'mouseout',  quotePreview.mouseout
    $.on @, 'click',     quotePreview.mouseout
  mouseout: ->
    if el = $.id @hash[1..]
      $.removeClass el, 'qphl'
    ui.hoverend()
    $.off @, 'mousemove', ui.hover
    $.off @, 'mouseout',  quotePreview.mouseout
    $.off @, 'click',     quotePreview.mouseout
  parse: (req, id, threadID) ->
    return unless (qp = ui.el) and (qp.innerHTML is "Loading #{id}...")

    if req.status isnt 200
      qp.textContent = "#{req.status} #{req.statusText}"
      return

    body = $.el 'body',
      innerHTML: req.responseText
    if id is threadID #OP
      op = threading.op $('body > form', body).firstChild
      html = op.innerHTML
    else
      for reply in $$ '.reply', body
        if reply.id == id
          html = reply.innerHTML
          break
    qp.innerHTML = html
    if conf['Image Auto-Gif']
      imgGif.node qp
    if conf['Time Formatting']
      Time.node   qp

quoteIndicators =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    return if root.className is 'inline'
    # We use contains() so that it works with hidden threads
    tid = g.THREAD_ID or $.x('ancestor::div[contains(@class,"thread")]', root).firstChild.id
    for quote in $$ '.quotelink', root
      hash = quote.hash[1..]
      if conf['Indicate OP quote'] and hash is tid
        # \u00A0 is nbsp
        $.add quote, $.tn '\u00A0(OP)'
        return
      path = quote.pathname
      #if quote leads to a different thread id and is located on the same board (index 0)
      if conf['Indicate Cross-thread Quotes'] and hash and path.lastIndexOf("/#{tid}") is -1 and path.indexOf("/#{g.BOARD}/") is 0
        # \u00A0 is nbsp
        $.add quote, $.tn '\u00A0(Cross-thread)'
    return

reportButton =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    if not a = $ '.reportbutton', root
      span = $ 'span[id]', root
      a = $.el 'a',
        className: 'reportbutton'
        innerHTML: '[&nbsp;!&nbsp;]'
        href: 'javascript:;'
      $.after span, [$.tn(' '), a]
    $.on a, 'click', reportButton.report
  report: ->
    url = "http://sys.4chan.org/#{g.BOARD}/imgboard.php?mode=report&no=#{$.x('preceding-sibling::input', @).name}"
    id  = Date.now()
    set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200"
    window.open url, id, set

threadStats =
  init: ->
    dialog = ui.dialog 'stats', 'bottom: 0; left: 0;', '<div class=move><span id=postcount>0</span> / <span id=imagecount>0</span></div>'
    dialog.className = 'dialog'
    $.add d.body, dialog
    threadStats.posts = threadStats.images = 0
    threadStats.imgLimit =
      switch g.BOARD
        when 'a', 'mlp', 'v'
          251
        when 'vg'
          501
        else
          151
    g.callbacks.push @node
  node: (root) ->
    return if /\binline\b/.test root.className
    $.id('postcount').textContent = ++threadStats.posts
    return unless $ 'img[md5]', root
    imgcount = $.id 'imagecount'
    imgcount.textContent = ++threadStats.images
    if threadStats.images > threadStats.imgLimit
      imgcount.className = 'warning'

unread =
  init: ->
    @title = d.title
    unread.update()
    $.on window, 'scroll', unread.scroll
    g.callbacks.push @node

  replies: []

  node: (root) ->
    return if root.hidden or root.className
    unread.replies.push root
    unread.update()

  scroll: ->
    height = d.body.clientHeight
    for reply, i in unread.replies
      {bottom} = reply.getBoundingClientRect()
      if bottom > height #post is not completely read
        break
    return if i is 0

    unread.replies = unread.replies[i..]
    unread.update()

  update: (forceUpdate) ->
    return unless g.REPLY

    count = unread.replies.length

    if conf['Unread Count']
      d.title = "(#{count}) #{unread.title}"

    unless conf['Unread Favicon'] and count < 2 or forceUpdate
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
    switch conf['favicon']
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

redirect =
  init: ->
    url =
      if location.hostname is 'images.4chan.org'
        redirect.image location.href
      else if /^\d+$/.test g.THREAD_ID
        redirect.thread()
    location.href = url if url
  image: (href) ->
    href = href.split '/'
    # Do not use g.BOARD, the image url can originate from a cross-quote.
    return unless conf['404 Redirect']
    switch href[3]
      when 'a', 'jp', 'm', 'tg', 'u'
        "http://archive.foolz.us/#{href[3]}/full_image/#{href[5]}"
  thread: ->
    return unless conf['404 Redirect']
    switch g.BOARD
      when 'a', 'jp', 'm', 'tg', 'tv', 'u', 'v', 'vg'
        "http://archive.foolz.us/#{g.BOARD}/thread/#{g.THREAD_ID}/"
      when 'lit'
        "http://fuuka.warosu.org/#{g.BOARD}/thread/#{g.THREAD_ID}"
      when 'diy', 'g', 'sci'
        "http://archive.installgentoo.net/#{g.BOARD}/thread/#{g.THREAD_ID}"
      when '3', 'adv', 'an', 'ck', 'co', 'fa', 'fit', 'int', 'k', 'mu', 'n', 'o', 'p', 'po', 'pol', 'r9k', 'soc', 'sp', 'toy', 'trv', 'vp', 'x'
        "http://archive.no-ip.org/#{g.BOARD}/thread/#{g.THREAD_ID}"
      else
        "http://boards.4chan.org/#{g.BOARD}/"

imgHover =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    return unless thumb = $ 'img[md5]', root
    $.on thumb, 'mouseover', imgHover.mouseover
  mouseover: ->
    ui.el = $.el 'img'
      id: 'ihover'
      src: @parentNode.href
    $.add d.body, ui.el
    $.on ui.el, 'load',      imgHover.load
    $.on @,     'mousemove', ui.hover
    $.on @,     'mouseout',  imgHover.mouseout
  load: ->
    return if @ isnt ui.el
    # 'Fake' mousemove event by giving required values.
    {style} = @
    ui.hover
      clientX: - 45 + parseInt style.left
      clientY:  120 + parseInt style.top
  mouseout: ->
    ui.hoverend()
    $.off @, 'mousemove', ui.hover
    $.off @, 'mouseout',  imgHover.mouseout

imgGif =
  init: ->
    g.callbacks.push @node
  node: (root) ->
    return if root.hidden or !thumb = $ 'img[md5]', root
    src = thumb.parentNode.href
    if /gif$/.test(src) and !/spoiler/.test src
      thumb.src = src

imgExpand =
  init: ->
    g.callbacks.push @node
    imgExpand.dialog()

  node: (root) ->
    return unless thumb = $ 'img[md5]', root
    a = thumb.parentNode
    $.on a, 'click', imgExpand.cb.toggle
    if imgExpand.on and !root.hidden and root.className isnt 'inline'
      imgExpand.expand a.firstChild
  cb:
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      e.preventDefault()
      imgExpand.toggle @
    all: ->
      imgExpand.on = @checked
      if imgExpand.on #expand
        thumbs = $$ 'img[md5]'
        if conf['Expand From Current']
          for thumb, i in thumbs
            if thumb.getBoundingClientRect().top > 0
              break
          thumbs = thumbs[i...]
        for thumb in thumbs
          imgExpand.expand thumb
      else #contract
        for thumb in $$ 'img[md5][hidden]'
          imgExpand.contract thumb
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
        $.on window, 'resize', imgExpand.resize
        unless imgExpand.style
          imgExpand.style = $.addStyle ''
        imgExpand.resize()
      else if imgExpand.style
        $.off window, 'resize', imgExpand.resize

  toggle: (a) ->
    thumb = a.firstChild
    if thumb.hidden
      rect = a.getBoundingClientRect()
      d.body.scrollTop += rect.top - 42 if rect.top < 0
      d.body.scrollLeft += rect.left if rect.left < 0
      imgExpand.contract thumb
    else
      imgExpand.expand thumb

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
    $.on img, 'error', imgExpand.error
    $.add a, img

  error: ->
    href  = @parentNode.href
    thumb = @previousSibling
    imgExpand.contract thumb
    $.rm @
    unless @src.split('/')[2] is 'images.4chan.org' and url = redirect.image href
      return if g.dead
      # CloudFlare may cache banned pages instead of images.
      # This will fool CloudFlare's cache.
      url = href + '?' + Date.now()
    #navigator.online is not x-browser/os yet
    timeoutID = setTimeout imgExpand.expand, 10000, thumb, url
    # Only Chrome let userscript break through cross domain requests.
    # Don't check it 404s in the archivers.
    return unless engine is 'webkit' and url.split('/')[2] is 'images.4chan.org'
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
    imgExpand.cb.typeChange.call select
    $.on select, 'change', $.cb.value
    $.on select, 'change', imgExpand.cb.typeChange
    $.on $('input', controls), 'click', imgExpand.cb.all

    form = $ 'body > form'
    $.prepend form, controls

  resize: ->
    imgExpand.style.textContent = ".fitheight img[md5] + img {max-height:#{d.body.clientHeight}px;}"

Main =
  init: ->
    path = location.pathname
    pathname = path[1..].split '/'
    [g.BOARD, temp] = pathname
    if temp is 'res'
      g.REPLY = true
      g.THREAD_ID = pathname[2]
    else
      g.PAGENUM = parseInt(temp) or 0

    $.on window, 'message', Main.message

    switch location.hostname
      when 'sys.4chan.org'
        if path is '/robots.txt'
          qr.message.send req: 'status', ready: true
        else if /report/.test location.search
          $.ready ->
            $.on $.id('recaptcha_response_field'), 'keydown', (e) ->
              window.location = 'javascript:Recaptcha.reload()' if e.keyCode is 8 and not e.target.value
        return
      when 'www.4chan.org'
        if path is '/banned'
          qr.message.send req: 'status', ready: true, banned: true
        return
      when 'images.4chan.org'
        $.ready -> redirect.init() if d.title is '4chan - 404'
        return

    $.ready options.init

    if conf['Quick Reply'] and conf['Hide Original Post Form']
      Main.css += 'form[name=post] { display: none; }'

    Main.addStyle()

    now = Date.now()
    if conf['Check for Updates'] and $.get('lastUpdate',  0) < now - 6*HOUR
      $.ready -> $.add d.head, $.el 'script', src: 'https://raw.github.com/mayhemydg/4chan-x/master/latest.js'
      $.set 'lastUpdate', now

    g.hiddenReplies = $.get "hiddenReplies/#{g.BOARD}/", {}
    if $.get('lastChecked', 0) < now - 1*DAY
      $.set 'lastChecked', now

      cutoff = now - 7*DAY
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
    if conf['Filter']
      filter.init()

    if conf['Reply Hiding']
      replyHiding.init()

    if conf['Filter'] or conf['Reply Hiding']
      strikethroughQuotes.init()

    if conf['Anonymize']
      anonymize.init()

    if conf['Time Formatting']
      Time.init()

    if conf['Sauce']
      sauce.init()

    if conf['Reveal Spoilers']
      revealSpoilers.init()

    if conf['Image Auto-Gif']
      imgGif.init()

    if conf['Image Hover']
      imgHover.init()

    if conf['Report Button']
      reportButton.init()

    if conf['Quote Inline']
      quoteInline.init()

    if conf['Quote Preview']
      quotePreview.init()

    if conf['Quote Backlinks']
      quoteBacklink.init()

    if conf['Indicate OP quote'] or conf['Indicate Cross-thread Quotes']
      quoteIndicators.init()

    if conf['Fix XXX\'d Post Numbers']
      unxify.init()

    $.ready Main.ready

  ready: ->
    if d.title is '4chan - 404'
      redirect.init()
      return
    if not $.id 'navtopr'
      return
    $.addClass d.body, "chanx_#{VERSION.match(/\.(\d+)/)[1]}"
    $.addClass d.body, engine
    form = $ 'form[name=delform]'
    threading.thread form.firstElementChild
    Favicon.init()

    #major features
    if conf['Quick Reply']
      qr.init()

    if conf['Image Expansion']
      imgExpand.init()

    if conf['Thread Watcher']
      watcher.init()

    if conf['Keybinds']
      keybinds.init()

    if g.REPLY
      if conf['Thread Updater']
        updater.init()

      if conf['Thread Stats']
        threadStats.init()

      if conf['Reply Navigation']
        nav.init()

      if conf['Post in Title']
        titlePost.init()

      if conf['Unread Count'] or conf['Unread Favicon']
        unread.init()

    else #not reply
      if conf['Thread Hiding']
        threadHiding.init()

      if conf['Thread Expansion']
        expandThread.init()

      if conf['Comment Expansion']
        expandComment.init()

      if conf['Index Navigation']
        nav.init()


    nodes = $$ '.op, a + table', form
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
    if data.qr
      qr.message.receive data
      return
    {version} = data
    if version and version isnt VERSION and confirm 'An updated version of 4chan X is available, would you like to install it now?'
      window.location = "https://raw.github.com/mayhemydg/4chan-x/#{version}/4chan_x.user.js"

  node: (nodes, notify) ->
    for callback in g.callbacks
      try
        callback node for node in nodes
      catch err
        alert err.message if notify
    return
  observer: (mutations) ->
    nodes = []
    for mutation in mutations
      for addedNode in mutation.addedNodes
        nodes.push addedNode if addedNode.nodeName is 'TABLE'
    Main.node nodes if nodes.length
  listener: (e) ->
    {target} = e
    Main.node [target] if target.nodeName is 'TABLE'

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

.thread.stub > :not(.block),
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
td.replyhider {
  vertical-align: top;
}

.filesize + br + a {
  float: left;
  pointer-events: none;
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
   this fixed "expanded" auto-gifs */
img[md5] {
  max-height: 126px;
  max-width: 126px;
}
.op > a > img[md5] {
  max-height: 251px;
  max-width: 251px;
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
.filter_highlight {
  box-shadow: -5px 0 rgba(255,0,0,0.5);
}
.filtered {
  text-decoration: line-through;
}
'

Main.init()
