config =
  main:
    Posting:
      'Auto Noko':          [true,  'Always redirect to your post']
      'Cooldown':           [true,  'Prevent \'flood detected\' errors']
      'Quick Reply':        [true,  'Reply without leaving the page']
      'Persistent QR':      [false, 'Quick reply won\'t disappear after posting. Only in replies.']
    Quoting:
      'Quote Backlinks':    [true,  'Add quote backlinks']
      'OP Backlinks':       [false, 'Add backlinks to the OP']
      'Quote Highlighting': [true,  'Highlight the previewed post']
      'Quote Inline':       [true,  'Show quoted post inline on quote click']
      'Quote Preview':      [true,  'Show quote content on hover']
      'Indicate OP quote':  [true,  'Add \'(OP)\' to OP quotes']
    Monitoring:
      'Thread Updater':     [true,  'Update threads']
      'Unread Count':       [true,  'Show unread post count in tab title']
      'Post in Title':      [true,  'Show the op\'s post in the tab title']
      'Thread Stats':       [true,  'Display reply and image count']
      'Thread Watcher':     [true,  'Bookmark threads']
      'Auto Watch':         [true,  'Automatically watch threads that you start']
      'Auto Watch Reply':   [false, 'Automatically watch threads that you reply to']
    Imaging:
      'Image Auto-Gif':     [false, 'Animate gif thumbnails']
      'Image Expansion':    [true,  'Expand images']
      'Image Hover':        [false, 'Show full image on mouseover']
      'Image Preloading':   [false, 'Preload Images']
      'Sauce':              [true,  'Add sauce to images']
      'Reveal Spoilers':    [false, 'Replace spoiler thumbnails by the original thumbnail']
    Hiding:
      'Reply Hiding':       [true,  'Hide single replies']
      'Thread Hiding':      [true,  'Hide entire threads']
      'Show Stubs':         [true,  'Of hidden threads / replies']
    Enhancing:
      '404 Redirect':       [true,  'Redirect dead threads']
      'Anonymize':          [false, 'Make everybody anonymous']
      'Keybinds':           [false, 'Binds actions to keys']
      'Time Formatting':    [true,  'Arbitrarily formatted timestamps, using your local time']
      'Report Button':      [true,  'Add report buttons']
      'Comment Expansion':  [true,  'Expand too long comments']
      'Thread Expansion':   [true,  'View all replies']
      'Index Navigation':   [true,  'Navigate to previous / next thread']
      'Reply Navigation':   [false, 'Navigate to top / bottom of thread']
  flavors: [
    'http://regex.info/exif.cgi?url='
    'http://iqdb.org/?url='
    'http://google.com/searchbyimage?image_url='
    '#http://tineye.com/search?url='
    '#http://saucenao.com/search.php?db=999&url='
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M'
  hotkeys:
    close:           'Esc'
    spoiler:         'ctrl+s'
    openQR:          'i'
    openEmptyQR:     'I'
    submit:          'alt+s'
    nextReply:       'J'
    previousReply:   'K'
    nextThread:      'n'
    previousThread:  'p'
    nextPage:        'L'
    previousPage:    'H'
    zero:            '0'
    openThreadTab:   'o'
    openThread:      'O'
    expandThread:    'e'
    watch:           'w'
    hide:            'x'
    expandImages:    'm'
    expandAllImages: 'M'
    update:          'u'
  updater:
    checkbox:
      'Verbose':     [true, 'Show countdown timer, new post count']
      'Auto Update': [true, 'Automatically fetch new posts']
    'Interval': 30

# flatten the config
_config = {}
((parent, obj) ->
  if obj.length #array
    if typeof obj[0] is 'boolean'
      _config[parent] = obj[0]
    else
      _config[parent] = obj
  else if typeof obj is 'object'
    for key, val of obj
      arguments.callee key, val
  else #constant
    _config[parent] = obj
) null, config

# XXX chrome can't into `{log} = console`
if console?
  log = (arg) ->
    console.log arg

# XXX opera cannot into Object.keys
if not Object.keys
  Object.keys = (o) ->
    key for key in o

NAMESPACE = 'AEOS.4chan_x.'
d = document
g =
  callbacks: []

ui =
  dialog: (id, position, html) ->
    el = d.createElement 'div'
    el.className = 'reply dialog'
    el.innerHTML = html
    el.id = id
    {left, top} = position
    left = localStorage["#{NAMESPACE}#{id}Left"] ? left
    top  = localStorage["#{NAMESPACE}#{id}Top"]  ? top
    if left then el.style.left = left else el.style.right  = 0
    if top  then el.style.top  = top  else el.style.bottom = 0
    el.querySelector('div.move').addEventListener 'mousedown', ui.dragstart, false
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
    {el} = ui
    left = e.clientX - ui.dx
    if left < 10 then left = '0'
    else if ui.width - left < 10 then left = null
    right = if left then null else 0
    top = e.clientY - ui.dy
    if top < 10 then top = '0'
    else if ui.height - top < 10 then top = null
    bottom = if top then null else 0
    #using null instead of '' is 4% faster
    #these 4 statements are 40% faster than 1 style.cssText
    el.style.top    = top
    el.style.right  = right
    el.style.bottom = bottom
    el.style.left   = left
  dragend: ->
    #$ coffee -bpe '{a} = {b} = c'
    #var a, b;
    #a = (b = c.b, c).a;
    {el} = ui
    {id} = el
    localStorage["#{NAMESPACE}#{id}Left"] = el.style.left
    localStorage["#{NAMESPACE}#{id}Top"]  = el.style.top
    d.removeEventListener 'mousemove', ui.drag, false
    d.removeEventListener 'mouseup',   ui.dragend, false
  hover: (e) ->
    {clientX, clientY} = e
    {el} = ui
    {clientHeight, clientWidth} = d.body
    height = el.offsetHeight

    top = clientY - 120
    el.style.top =
      if clientHeight < height or top < 0
        0
      else if top + height > clientHeight
        clientHeight - height
      else
        top

    if clientX < clientWidth - 400
      el.style.left  = clientX + 45
      el.style.right = null
    else
      el.style.left  = null
      el.style.right = clientWidth - clientX + 45

  hoverend: (e) ->
    ui.el.style.top = '999%'

$ = (selector, root=d.body) ->
  root.querySelector selector

$.extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  object

$.extend $,
  globalEval: (code) ->
    script = $.el 'script',
      textContent: "(#{code})()"
    $.append d.head, script
    $.rm script
  get: (url, cb) ->
    r = new XMLHttpRequest()
    r.onload = cb
    r.open 'get', url, true
    r.send()
    r
  cache: (url, cb) ->
    if req = $.cache.requests[url]
      if req.readyState is 4
        cb.call req
      else
        req.callbacks.push cb
    else
      req = $.get url, (-> cb.call @ for cb in @callbacks)
      req.callbacks = [cb]
      $.cache.requests[url] = req
  cb:
    checked: ->
      $.setValue @name, @checked
    value: ->
      $.setValue @name, @value
  addStyle: (css) ->
    style = $.el 'style',
      textContent: css
    $.append d.head, style
    style
  config: (name) ->
    $.getValue name, _config[name]
  x: (path, root=d.body) ->
    d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).
      singleNodeValue
  tn: (s) ->
    d.createTextNode s
  replace: (root, el) ->
    root.parentNode.replaceChild el, root
  hide: (el) ->
    el.hidden = true
  show: (el) ->
    el.hidden = false
  addClass: (el, className) ->
    el.className += ' ' + className
  removeClass: (el, className) ->
    el.className = el.className.replace ' ' + className, ''
  rm: (el) ->
    el.parentNode.removeChild el
  append: (parent, children...) ->
    for child in children
      parent.appendChild child
  prepend: (parent, child) ->
    parent.insertBefore child, parent.firstChild
  after: (root, el) ->
    root.parentNode.insertBefore el, root.nextSibling
  before: (root, el) ->
    root.parentNode.insertBefore el, root
  el: (tag, properties) ->
    el = d.createElement tag
    $.extend el, properties if properties
    el
  bind: (el, eventType, handler) ->
    el.addEventListener eventType, handler, false
  unbind: (el, eventType, handler) ->
    el.removeEventListener eventType, handler, false
  isDST: ->
    # XXX this should check for DST in NY
    ###
       http://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States
       Since 2007, daylight saving time starts on the second Sunday of March
       and ends on the first Sunday of November, with all time changes taking
       place at 2:00 AM (0200) local time.
    ###

    date = new Date()
    month = date.getMonth()

    #this is the easy part
    if month < 2 or 10 < month
      return false
    if 2 < month < 10
      return true

    # (sunday's date) = (today's date) - (number of days past sunday)
    # date is not zero-indexed
    sunday = date.getDate() - date.getDay()

    if month is 2
      #before second sunday
      if sunday < 8
        return false

      #during second sunday
      if sunday < 15 and date.getDay() is 0
        if date.getHour() < 1
          return false
        return true

      #after second sunday
      return true

    if month is 10
      # before first sunday
      if sunday < 1
        return true

      # during first sunday
      if sunday < 8 and date.getDay() is 0
        if date.getHour() < 1
          return true
        return false

      #after first sunday
      return false

$.cache.requests = {}

if GM_deleteValue?
  $.extend $,
    deleteValue: (name) ->
      name = NAMESPACE + name
      GM_deleteValue name
    getValue: (name, defaultValue) ->
      name = NAMESPACE + name
      if value = GM_getValue name
        JSON.parse value
      else
        defaultValue
    openInTab: (url) ->
      GM_openInTab url
    setValue: (name, value) ->
      name = NAMESPACE + name
      # for `storage` events
      localStorage[name] = JSON.stringify value
      GM_setValue name, JSON.stringify value
else
  $.extend $,
    deleteValue: (name) ->
      name = NAMESPACE + name
      delete localStorage[name]
    getValue: (name, defaultValue) ->
      name = NAMESPACE + name
      if value = localStorage[name]
        JSON.parse value
      else
        defaultValue
    openInTab: (url) ->
      window.open url, "_blank"
    setValue: (name, value) ->
      name = NAMESPACE + name
      localStorage[name] = JSON.stringify value

$$ = (selector, root=d.body) ->
  Array::slice.call root.querySelectorAll selector

expandComment =
  init: ->
    for a in $$ 'span.abbr a'
      $.bind a, 'click', expandComment.expand
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
    $.replace a.parentNode.parentNode, bq

expandThread =
  init: ->
    for span in $$ 'span.omittedposts'
      a = $.el 'a',
        textContent: "+ #{span.textContent}"
        className: 'omittedposts'
      $.bind a, 'click', expandThread.cb.toggle
      $.replace span, a

  cb:
    toggle: (e) ->
      thread = @parentNode
      expandThread.toggle thread

  toggle: (thread) ->
    threadID = thread.firstChild.id
    pathname = "/#{g.BOARD}/res/#{threadID}"
    a = $ 'a.omittedposts', thread

    switch a.textContent[0]
      when '+'
        $('.op .container', thread)?.innerHTML = ''
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
        table = $.x "following::br[@clear][1]/preceding::table[#{num}]", a
        while (prev = table.previousSibling) and (prev.nodeName is 'TABLE')
          $.rm prev
        for backlink in $$ '.op a.backlink'
          $.rm backlink if !d.getElementById backlink.hash[1..]


  parse: (req, pathname, thread, a) ->
    if req.status isnt 200
      a.textContent = "#{req.status} #{req.statusText}"
      $.unbind a, 'click', expandThread.cb.toggle
      return

    a.textContent = a.textContent.replace 'X Loading...', '-'

    # eat everything, then replace with fresh full posts
    while (next = a.nextSibling) and not next.clear #br[clear]
      $.rm next
    br = next

    body = $.el 'body',
      innerHTML: req.responseText

    for quote in $$ 'a.quotelink', body
      if quote.getAttribute('href') is quote.hash
        quote.pathname = pathname
    tables = $$ 'form[name=delform] table', body
    tables.pop()
    for table in tables
      $.before br, table

replyHiding =
  init: ->
    g.callbacks.push (root) ->
      return unless dd = $ 'td.doubledash', root
      dd.className = 'replyhider'
      a = $.el 'a',
        textContent: '[ - ]'
      $.bind a, 'click', replyHiding.cb.hide
      $.replace dd.firstChild, a

      reply = dd.nextSibling
      id = reply.id
      if id of g.hiddenReplies
        replyHiding.hide reply

  cb:
    hide: (e) ->
      reply = @parentNode.nextSibling
      replyHiding.hide reply

    show: (e) ->
      div = @parentNode
      table = div.nextSibling
      replyHiding.show table

      $.rm div

  hide: (reply) ->
    table = reply.parentNode.parentNode.parentNode
    $.hide table

    if $.config 'Show Stubs'
      name = $('span.commentpostername', reply).textContent
      trip = $('span.postertrip', reply)?.textContent or ''
      a = $.el 'a',
        textContent: "[ + ] #{name} #{trip}"
      $.bind a, 'click', replyHiding.cb.show

      div = $.el 'div',
        className: 'stub'
      $.append div, a
      $.before table, div

    id = reply.id
    g.hiddenReplies[id] = Date.now()
    $.setValue "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

  show: (table) ->
    $.show table

    id = $('td[id]', table).id
    delete g.hiddenReplies[id]
    $.setValue "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

keybinds =
  init: ->
    for node in $$ '[accesskey]'
      node.removeAttribute 'accesskey'

    keybinds.close           = $.getValue 'key/close',           config.hotkeys.close
    keybinds.spoiler         = $.getValue 'key/spoiler',         config.hotkeys.spoiler
    keybinds.openQR          = $.getValue 'key/openQR',          config.hotkeys.openQR
    keybinds.openEmptyQR     = $.getValue 'key/openEmptyQR',     config.hotkeys.openEmptyQR
    keybinds.submit          = $.getValue 'key/submit',          config.hotkeys.submit
    keybinds.nextReply       = $.getValue 'key/nextReply',       config.hotkeys.nextReply
    keybinds.previousReply   = $.getValue 'key/previousReply',   config.hotkeys.previousReply
    keybinds.nextThread      = $.getValue 'key/nextThread',      config.hotkeys.nextThread
    keybinds.previousThread  = $.getValue 'key/previousThread',  config.hotkeys.previousThread
    keybinds.nextPage        = $.getValue 'key/nextPage',        config.hotkeys.nextPage
    keybinds.previousPage    = $.getValue 'key/previousPage',    config.hotkeys.previousPage
    keybinds.zero            = $.getValue 'key/zero',            config.hotkeys.zero
    keybinds.openThreadTab   = $.getValue 'key/openThreadTab',   config.hotkeys.openThreadTab
    keybinds.openThread      = $.getValue 'key/openThread',      config.hotkeys.openThread
    keybinds.expandThread    = $.getValue 'key/expandThread',    config.hotkeys.expandThread
    keybinds.watch           = $.getValue 'key/watch',           config.hotkeys.watch
    keybinds.hide            = $.getValue 'key/hide',            config.hotkeys.hide
    keybinds.expandImages    = $.getValue 'key/expandImages',    config.hotkeys.expandImages
    keybinds.expandAllImages = $.getValue 'key/expandAllImages', config.hotkeys.expandAllImages
    keybinds.update          = $.getValue 'key/update',          config.hotkeys.update

    $.bind d, 'keydown',  keybinds.cb.keydown

  cb:
    keydown: (e) ->
      return if d.activeElement.nodeName in ['TEXTAREA', 'INPUT'] and not e.altKey and not e.ctrlKey and not (e.keyCode is 27)
      key = keybinds.cb.keyCode e
      if e.altKey  then key = 'alt+' + key
      if e.ctrlKey then key = 'ctrl+' + key

      thread = nav.getThread()
      switch key
        when keybinds.close
          if o = $ '#overlay'
            $.rm o
          else if qr = $ '#qr'
            $.rm qr
        when keybinds.spoiler
          ta = d.activeElement
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
        when keybinds.zero
          window.location = "/#{g.BOARD}/0#0"
        when keybinds.openEmptyQR
          keybinds.qr thread
        when keybinds.nextReply
          keybinds.hl.next thread
        when keybinds.previousReply
          keybinds.hl.prev thread
        when keybinds.expandAllImages
          keybinds.img thread, true
        when keybinds.openThread
          keybinds.open thread
        when keybinds.expandThread
          expandThread.toggle thread
        when keybinds.openQR
          keybinds.qr thread, true
        when keybinds.expandImages
          keybinds.img thread
        when keybinds.nextThread
          nav.next()
        when keybinds.openThreadTab
          keybinds.open thread, true
        when keybinds.previousThread
          nav.prev()
        when keybinds.update
          updater.update()
        when keybinds.watch
          watcher.toggle thread
        when keybinds.hide
          threadHiding.toggle thread
        when keybinds.nextPage
          $('input[value=Next]')?.click()
        when keybinds.previousPage
          $('input[value=Previous]')?.click()
        when keybinds.submit
          if qr = $('#qr_form')
            qr.submit()
          else
            $('.postarea form').submit()
        else
          return
      e.preventDefault()

    keyCode: (e, options) ->
      kc = e.keyCode
      if 65 <= kc <= 90 #A-Z
        key = String.fromCharCode kc
        if !e.shiftKey
          key = key.toLowerCase()
      else if 48 <= kc <= 57 #0-9
        key = String.fromCharCode kc
      else if kc is 27
        key = 'Esc'
      else if options and kc is 8
        key = ''
      key

  img: (thread, all) ->
    if all
      $("#imageExpand").click()
    else
      root = $('td.replyhl', thread) or thread
      thumb = $ 'img[md5]', root
      imgExpand.toggle thumb.parentNode

  qr: (thread, quote) ->
    unless qrLink = $ 'td.replyhl span[id] a:not(:first-child)', thread
      qrLink = $ "span[id^=nothread] a:not(:first-child)", thread

    if quote
      qr.quote qrLink
    else
      unless $ '#qr'
        qr.dialog qrLink
      $('#qr textarea').focus()

  open: (thread, tab) ->
    id = thread.firstChild.id
    url = "http://boards.4chan.org/#{g.BOARD}/res/#{id}"
    if tab
      $.openInTab url
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
    next = $.el 'a',
      textContent: '▼'

    $.bind prev, 'click', nav.prev
    $.bind next, 'click', nav.next

    $.append span, prev, $.tn(' '), next
    $.append d.body, span

  prev: ->
    nav.scroll -1

  next: ->
    nav.scroll +1

  threads: []

  getThread: (full) ->
    nav.threads = $$ 'div.thread:not([hidden])'
    for thread, i in nav.threads
      rect = thread.getBoundingClientRect()
      {bottom} = rect
      if bottom > 0 #we have not scrolled past
        if full
          return [thread, i, rect]
        return thread
    return null

  scroll: (delta) ->
    if g.REPLY
      if delta is -1
        window.scrollTo 0,0
      else
        window.scrollTo 0, d.body.scrollHeight
      return

    [thread, i, rect] = nav.getThread true
    {top} = rect

    #unless we're not at the beginning of the current thread
    # (and thus wanting to move to beginning)
    # or we're above the first thread and don't want to skip it
    unless (delta is -1 and Math.ceil(top) < 0) or (delta is +1 and top > 1)
      i += delta

    if i is -1
      if g.PAGENUM is 0
        window.scrollTo 0, 0
      else
        window.location = "#{g.PAGENUM - 1}#0"
      return
    if delta is +1
      # if we're at the last thread, or we're at the bottom of the page.
      # kind of hackish, what we really need to do is make nav.getThread smarter.
      if i is nav.threads.length or (innerHeight + pageYOffset == d.body.scrollHeight)
        if $ 'table.pages input[value="Next"]'
          window.location = "#{g.PAGENUM + 1}#0"
          return
        #TODO sfx

    {top} = nav.threads[i].getBoundingClientRect()
    window.scrollBy 0, top

options =
  init: ->
    home = $ '#navtopr a'
    a = $.el 'a',
      textContent: '4chan X'
    $.bind a, 'click', options.dialog
    $.replace home, a
    home = $ '#navbotr a'
    a = $.el 'a',
      textContent: '4chan X'
    $.bind a, 'click', options.dialog
    $.replace home, a

  dialog: ->
    hiddenThreads = $.getValue "hiddenThreads/#{g.BOARD}/", {}
    hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length
    html = "
      <div class='reply dialog'>
        <div id=optionsbar>
          <div id=floaty>
            <a name=main>main</a> | <a name=flavors>sauce</a> | <a name=time>time</a> | <a name=keybinds>keybinds</a>
          </div>
          <div id=credits>
            <a href=http://chat.now.im/x/aeos>support throd</a> |
            <a href=https://github.com/aeosynth/4chan-x/issues>github</a> |
            <a href=http://userscripts.org/scripts/show/51412>uso</a> |
            <a href=https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2DBVZBUAM4DHC&lc=US&item_name=Aeosynth&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted>donate</a>
          </div>
        </div>
        <hr>
        <div id=content>
          <div id=main>
          </div>
          <textarea name=flavors id=flavors hidden>#{$.config 'flavors'}</textarea>
          <div id=time hidden>
            <div><input type=text name=time value='#{$.config 'time'}'> <span id=timePreview></span></div>
            <table>
              <caption>Format specifiers <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>(source)</a></caption>
              <tbody>
                <tr><th>Specifier</th><th>Description</th><th>Values/Example</th></tr>
                <tr><td>%a</td><td>weekday, abbreviated</td><td>Sat</td></tr>
                <tr><td>%A</td><td>weekday, full</td><td>Saturday</td></tr>
                <tr><td>%b</td><td>month, abbreviated</td><td>Jun</td></tr>
                <tr><td>%B</td><td>month, full length</td><td>June</td></tr>
                <tr><td>%d</td><td>day of the month, zero padded</td><td>03</td></tr>
                <tr><td>%H</td><td>hour (24 hour clock) zero padded</td><td>13</td></tr>
                <tr><td>%I (uppercase i)</td><td>hour (12 hour clock) zero padded</td><td>02</td></tr>
                <tr><td>%m</td><td>month, zero padded</td><td>06</td></tr>
                <tr><td>%M</td><td>minutes, zero padded</td><td>54</td></tr>
                <tr><td>%p</td><td>upper case AM or PM</td><td>PM</td></tr>
                <tr><td>%P</td><td>lower case am or pm</td><td>pm</td></tr>
                <tr><td>%y</td><td>two digit year</td><td>00-99</td></tr>
              </tbody>
            </table>
          </div>
          <div id=keybinds hidden>
            <table>
              <tbody>
                <tr><th>Actions</th><th>Keybinds</th></tr>
                <tr><td>Close Options or QR</td><td><input type=text name=close></td></tr>
                <tr><td>Quick spoiler</td><td><input type=text name=spoiler></td></tr>
                <tr><td>Open QR with post number inserted</td><td><input type=text name=openQR></td></tr>
                <tr><td>Open QR without post number inserted</td><td><input type=text name=openEmptyQR></td></tr>
                <tr><td>Submit post</td><td><input type=text name=submit></td></tr>
                <tr><td>Select next reply</td><td><input type=text name=nextReply ></td></tr>
                <tr><td>Select previous reply</td><td><input type=text name=previousReply></td></tr>
                <tr><td>See next thread</td><td><input type=text name=nextThread></td></tr>
                <tr><td>See previous thread</td><td><input type=text name=previousThread></td></tr>
                <tr><td>Jump to the next page</td><td><input type=text name=nextPage></td></tr>
                <tr><td>Jump to the previous page</td><td><input type=text name=previousPage></td></tr>
                <tr><td>Jump to page 0</td><td><input type=text name=zero></td></tr>
                <tr><td>Open thread in current tab</td><td><input type=text name=openThread></td></tr>
                <tr><td>Open thread in new tab</td><td><input type=text name=openThreadTab></td></tr>
                <tr><td>Expand thread</td><td><input type=text name=expandThread></td></tr>
                <tr><td>Watch thread</td><td><input type=text name=watch></td></tr>
                <tr><td>Hide thread</td><td><input type=text name=hide></td></tr>
                <tr><td>Expand selected image</td><td><input type=text name=expandImages></td></tr>
                <tr><td>Expand all images</td><td><input type=text name=expandAllImages></td></tr>
                <tr><td>Update now</td><td><input type=text name=update></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    "

    dialog = $.el 'div', id: 'options', innerHTML: html
    main = $('#main', dialog)
    for key, obj of config.main
      ul = $.el 'ul',
        textContent: key
      hidingul = ul if key is 'Hiding'
      for key, arr of obj
        checked = if $.config key then "checked" else ""
        description = arr[1]
        li = $.el 'li',
          innerHTML: "<label><input type=checkbox name='#{key}' #{checked}>#{key}</label><span class=description>: #{description}</span>"
        $.append ul, li
      $.append main, ul
    li = $.el 'li',
      innerHTML: "<input type=button value='hidden: #{hiddenNum}'> <span class=description>: Forget all hidden posts. Useful if you accidentally hide a post and have `show stubs` disabled."
    $.append hidingul, li

    for input in $$ 'input[type=checkbox]', dialog
      $.bind input, 'click', $.cb.checked
    $.bind $('input[type=button]', dialog), 'click', options.clearHidden
    $.bind link, 'click', options.tab for link in $$ '#floaty a', dialog
    $.bind $('textarea[name=flavors]', dialog), 'change', $.cb.value
    $.bind $('input[name=time]', dialog), 'keyup', options.time
    for input in $$ '#keybinds input', dialog
      input.value = $.getValue "key/#{input.name}", config.hotkeys[input.name]
      $.bind input, 'keydown', options.keybind

    ###
    Two parent divs are necessary to center on all browsers.

    Only one when Firefox and Opera will support flexboxes correctly.
    https://bugzilla.mozilla.org/show_bug.cgi?id=579776
    ###
    overlay = $.el 'div', id: 'overlay'
    $.append overlay, dialog
    $.append d.body, overlay

    options.time.call $('input[name=time]', dialog)

    $.bind overlay, 'click', -> $.rm overlay
    $.bind dialog.firstElementChild, 'click', (e) -> e.stopPropagation()

  tab: ->
    for div in $('#content').children
      if div.id is @name
        $.show div
      else
        $.hide div

  clearHidden: (e) ->
    #'hidden' might be misleading; it's the number of IDs we're *looking* for,
    # not the number of posts actually hidden on the page.
    $.deleteValue "hiddenReplies/#{g.BOARD}/"
    $.deleteValue "hiddenThreads/#{g.BOARD}/"
    @value = "hidden: 0"
    g.hiddenReplies = {}
  keybind: (e) ->
    e.preventDefault()
    e.stopPropagation()
    key = keybinds.cb.keyCode e, true

    if key?
      if key
        key = 'alt+' + key  if e.altKey
        key = 'ctrl+' + key if e.ctrlKey
      @value = key
      $.setValue "key/#{@name}", key
      keybinds[@name] = key
  time: (e) ->
    $.setValue 'time', @value
    Time.foo()
    Time.date = new Date()
    $('#timePreview').textContent = Time.funk Time

cooldown =
  init: ->
    if /cooldown/.test location.search
      [_, time] = location.search.match /cooldown=(\d+)/
      $.setValue g.BOARD+'/cooldown', time if $.getValue(g.BOARD+'/cooldown', 0) < time
    cooldown.start() if Date.now() < $.getValue g.BOARD+'/cooldown', 0
    $.bind window, 'storage', (e) -> cooldown.start() if e.key is "#{NAMESPACE}#{g.BOARD}/cooldown"

    if g.REPLY
      form = $('.postarea form')
      form.action += '?cooldown'
      input = $('.postarea input[name=email]')
      if /sage/i.test input.value
        form.action += '?sage'
      $.bind input, 'keyup', cooldown.sage

  sage: ->
    form = $('.postarea form')
    if /sage/i.test @value
      unless /sage/.test form.action
        form.action += '?sage'
    else
      form.action = form.action.replace '?sage', ''

  start: ->
    cooldown.duration = Math.ceil ($.getValue(g.BOARD+'/cooldown', 0) - Date.now()) / 1000
    for submit in $$ '#com_submit'
      submit.value = cooldown.duration
      submit.disabled = true
    cooldown.interval = window.setInterval cooldown.cb, 1000

  cb: ->
    cooldown.duration--

    submits = $$ '#com_submit'
    if cooldown.duration
      for submit in submits
        submit.value = cooldown.duration
    else
      window.clearInterval cooldown.interval
      for submit in submits
        submit.disabled = false
        submit.value = 'Submit'
        $('#qr_form').submit() if $('#auto')?.checked

qr =
  init: ->
    g.callbacks.push qr.cb.node
    iframe = $.el 'iframe',
      name: 'iframe'
      hidden: true
    $.append d.body, iframe
    $.bind window, 'message', qr.cb.message

    #hack - nuke id so it doesn't grab focus when reloading
    $('#recaptcha_response_field').id = ''

  autohide:
    set: ->
      $('#qr input[title=autohide]:not(:checked)')?.click()
    unset: ->
      $('#qr input[title=autohide]:checked')?.click()

  cb:
    autohide: (e) ->
      dialog = $ '#qr'
      if @checked
        $.addClass dialog, 'auto'
      else
        $.removeClass dialog, 'auto'

    message: (e) ->
      Recaptcha.reload()
      $('iframe[name=iframe]').src = 'about:blank'

      {data} = e
      dialog = $ '#qr'
      if data # error message
        $('input[name=recaptcha_response_field]', dialog).value = ''
        $('#error').textContent = data
        qr.autohide.unset()
        return

      if dialog
        if g.REPLY and $.config 'Persistent QR'
          qr.refresh dialog
        else
          $.rm dialog
      if $.config 'Cooldown'
        duration = if qr.sage then 60 else 30
        $.setValue g.BOARD+'/cooldown', Date.now() + duration * 1000
        cooldown.start()

    node: (root) ->
      quote = $ 'a.quotejs:not(:first-child)', root
      $.bind quote, 'click', qr.cb.quote

    submit: (e) ->
      if $.config('Auto Watch Reply') and $.config('Thread Watcher')
        if g.REPLY and $('img.favicon').src is Favicon.empty
          watcher.watch null, g.THREAD_ID
        else
          id = $('input[name=resto]').value
          op = d.getElementById id
          if $('img.favicon', op).src is Favicon.empty
            watcher.watch op, id

      isQR = @id is 'qr_form'

      inputfile = $('input[type=file]', @)
      if inputfile.value and inputfile.files[0].size > $('input[name=MAX_FILE_SIZE]').value
        e.preventDefault()
        if isQR
          $('#error').textContent = 'Error: File too large.'
        else
          alert 'Error: File too large.'

      else if isQR
        $('#error').textContent = ''
        qr.autohide.set()
        qr.sage = /sage/i.test $('input[name=email]', @).value

    quote: (e) ->
      e.preventDefault()
      qr.quote @

  quote: (link) ->
    if dialog = $ '#qr'
      qr.autohide.unset()
    else
      dialog = qr.dialog link

    id = link.textContent
    text = ">>#{id}\n"

    selection = window.getSelection()
    if s = selection.toString()
      selectionID = $.x('preceding::input[@type="checkbox"][1]', selection.anchorNode)?.name
      if selectionID == id
        text += ">#{s}\n"

    ta = $ 'textarea', dialog
    ta.focus()
    ta.value += text

  refresh: (dialog) ->
    $('textarea', dialog).value = ''
    $('input[name=recaptcha_response_field]', dialog).value = ''
    $('input[name=spoiler]', dialog)?.checked = false
    # XXX file.value = '' doesn't work in opera
    f = $('input[type=file]', dialog).parentNode
    f.innerHTML = f.innerHTML

  dialog: (link) ->
    submitValue = $('#com_submit').value
    submitDisabled = if $('#com_submit').disabled then 'disabled' else ''
    #FIXME inlined cross-thread quotes
    THREAD_ID = g.THREAD_ID or $.x('ancestor::div[@class="thread"]/div', link).id
    challenge = $('input[name=recaptcha_challenge_field]').value
    src = "http://www.google.com/recaptcha/api/image?c=#{challenge}"
    c = d.cookie
    name = if m = c.match(/4chan_name=([^;]+)/)  then decodeURIComponent m[1] else ''
    mail = if m = c.match(/4chan_email=([^;]+)/) then decodeURIComponent m[1] else ''
    pass = if m = c.match(/4chan_pass=([^;]+)/)  then decodeURIComponent m[1] else $('input[name=pwd]').value
    html = "
      <div class=move>
        <input class=inputtext type=text name=name placeholder=Name form=qr_form value=\"#{name}\">
        Quick Reply
        <input type=checkbox id=autohide title=autohide>
        <a name=close title=close>X</a>
      </div>
      <form name=post action=http://sys.4chan.org/#{g.BOARD}/post method=POST enctype=multipart/form-data target=iframe id=qr_form>
        <input type=hidden name=resto value=#{THREAD_ID}>
        <input type=hidden name=recaptcha_challenge_field value=#{challenge}>
        <div><input class=inputtext type=text name=email placeholder=E-mail value=\"#{mail}\"></div>
        <div><input class=inputtext type=text name=sub placeholder=Subject><input type=submit value=#{submitValue} id=com_submit #{submitDisabled}><label><input type=checkbox id=auto>auto</label></div>
        <div><textarea class=inputtext name=com placeholder=Comment></textarea></div>
        <div><img src=#{src}></div>
        <div><input class=inputtext type=text name=recaptcha_response_field placeholder=Verification required autocomplete=off></div>
        <div><input type=file name=upfile></div>
        <div><input class=inputtext type=password name=pwd maxlength=8 placeholder=Password value=\"#{pass}\"><input type=hidden name=mode value=regist></div>
      </form>
      <div id=error class=error></div>
      "
    dialog = ui.dialog 'qr', top: '0px', left: '0px', html

    $.bind $('input[name=name]', dialog), 'mousedown', (e) -> e.stopPropagation()
    $.bind $('a[name=close]', dialog), 'click', -> $.rm dialog
    $.bind $('#autohide', dialog), 'click', qr.cb.autohide
    $.bind $('img', dialog), 'click', Recaptcha.reload

    if $ '.postarea label'
      spoiler = $.el 'label',
        innerHTML: " [<input type=checkbox name=spoiler>Spoiler Image?]"
      $.after $('input[name=email]', dialog), spoiler

    $.bind $('form', dialog), 'submit', qr.cb.submit
    $.bind $('input[name=recaptcha_response_field]', dialog), 'keydown', Recaptcha.listener

    $.append d.body, dialog

    dialog

  persist: ->
    $.append d.body, qr.dialog()
    qr.autohide.set()

  sys: ->
    if recaptcha = $ '#recaptcha_response_field' #post reporting
      $.bind recaptcha, 'keydown', Recaptcha.listener
      return

    ###
      http://code.google.com/p/chromium/issues/detail?id=20773
      Let content scripts see other frames (instead of them being undefined)

      To access the parent, we have to break out of the sandbox and evaluate
      in the global context.
    ###
    $.globalEval ->
      data = document.querySelector('table font b')?.firstChild.textContent or ''
      parent.postMessage data, '*'

    c = $('b').lastChild
    if c.nodeType is 8 #comment node
      [_, thread, id] = c.textContent.match(/thread:(\d+),no:(\d+)/)

      noko = /auto_noko/.test location.search
      if thread is '0'
        if /auto_watch/.test location.search
          window.location = "http://boards.4chan.org/#{g.BOARD}/res/#{id}#watch"
        else if noko
          window.location = "http://boards.4chan.org/#{g.BOARD}/res/#{id}"
      else if /cooldown/.test location.search
        duration = Date.now() + 30000
        duration += 30000 if /sage/.test location.search
        if noko
          window.location = "http://boards.4chan.org/#{g.BOARD}/res/#{thread}?cooldown=#{duration}##{id}"
        else
          window.location = "http://boards.4chan.org/#{g.BOARD}?cooldown=#{duration}"
      else if noko
        window.location = "http://boards.4chan.org/#{g.BOARD}/res/#{thread}##{id}"
      else
        window.location = "http://boards.4chan.org/#{g.BOARD}"

threading =
  init: ->
    # don't thread image controls
    node = $ 'form[name=delform] > *:not([id])'
    threading.thread node

  op: (node) ->
    op = $.el 'div',
      className: 'op'
    $.before node, op
    while node.nodeName isnt 'BLOCKQUOTE'
      $.append op, node
      node = op.nextSibling
    $.append op, node #add the blockquote
    op.id = $('input[name]', op).name
    op

  thread: (node) ->
    node = threading.op node

    return if g.REPLY

    div = $.el 'div',
      className: 'thread'
    $.before node, div

    while node.nodeName isnt 'HR'
      $.append div, node
      node = div.nextSibling

    node = node.nextElementSibling #skip text node
    #{N,}SFW
    unless node.align or node.nodeName is 'CENTER'
      threading.thread node

threadHiding =
  init: ->
    hiddenThreads = $.getValue "hiddenThreads/#{g.BOARD}/", {}
    for thread in $$ 'div.thread'
      op = thread.firstChild
      a = $.el 'a',
        textContent: '[ - ]'
      $.bind a, 'click', threadHiding.cb.hide
      $.prepend op, a

      if op.id of hiddenThreads
        threadHiding.hideHide thread

  cb:
    hide: (e) ->
      thread = @parentNode.parentNode
      threadHiding.hide thread
    show: (e) ->
      thread = @parentNode.parentNode
      threadHiding.show thread

  toggle: (thread) ->
    if thread.className.indexOf('stub') != -1 or thread.hidden
      threadHiding.show thread
    else
      threadHiding.hide thread

  hide: (thread) ->
    threadHiding.hideHide thread

    id = thread.firstChild.id

    hiddenThreads = $.getValue "hiddenThreads/#{g.BOARD}/", {}
    hiddenThreads[id] = Date.now()
    $.setValue "hiddenThreads/#{g.BOARD}/", hiddenThreads

  hideHide: (thread) ->
    if $.config 'Show Stubs'
      if span = $ '.omittedposts', thread
        num = Number span.textContent.match(/\d+/)[0]
      else
        num = 0
      num += $$('table', thread).length
      text = if num is 1 then "1 reply" else "#{num} replies"
      name = $('span.postername', thread).textContent
      trip = $('span.postername + span.postertrip', thread)?.textContent or ''

      a = $.el 'a',
        textContent: "[ + ] #{name}#{trip} (#{text})"
      $.bind a, 'click', threadHiding.cb.show

      div = $.el 'div',
        className: 'block'

      $.append div, a
      $.append thread, div
      $.addClass thread, 'stub'
    else
      $.hide thread
      $.hide thread.nextSibling

  show: (thread) ->
    $.rm $ 'div.block', thread
    $.removeClass thread, 'stub'
    $.show thread
    $.show thread.nextSibling

    id = thread.firstChild.id

    hiddenThreads = $.getValue "hiddenThreads/#{g.BOARD}/", {}
    delete hiddenThreads[id]
    $.setValue "hiddenThreads/#{g.BOARD}/", hiddenThreads

updater =
  init: ->
    interval = $.config 'Interval'
    html = "<div class=move><span id=count></span> <span id=timer>-#{interval}</span></div>"
    conf = config.updater.checkbox
    for name of conf
      title = conf[name][1]
      checked = if $.config name then 'checked' else ''
      html += "<div><label title='#{title}'>#{name}<input name='#{name}' type=checkbox #{checked}></label></div>"

    checked = if $.config 'Auto Update' then 'checked' else ''
    html += "
      <div><label title='Controls whether *this* thread auotmatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox #{checked}></label></div>
      <div><label>Interval (s)<input name=Interval value=#{interval} type=text></label></div>
      <div><input value='Update Now' type=button></div>"

    dialog = ui.dialog 'updater', bottom: '0', right: '0', html

    for input in $$ 'input[type=checkbox]', dialog
      $.bind input, 'click', $.cb.checked

    verbose = $ 'input[name=Verbose]',  dialog
    autoUpT = $ 'input[name$=This]',    dialog
    interva = $ 'input[name=Interval]', dialog
    updNow  = $ 'input[type=button]',   dialog
    $.bind verbose, 'click',  updater.cb.verbose
    $.bind autoUpT, 'click',  updater.cb.autoUpdate
    $.bind interva, 'change', $.cb.value
    $.bind updNow,  'click',  updater.updateNow

    updater.count = $ '#count', dialog
    updater.timer = $ '#timer', dialog

    $.append d.body, dialog

    updater.cb.verbose.call    verbose
    updater.cb.autoUpdate.call autoUpT

  cb:
    verbose: (e) ->
      if @checked
        updater.count.textContent = '+0'
        $.show updater.timer
      else
        $.extend updater.count,
          className: ''
          textContent: 'Thread Updater'
        $.hide updater.timer
    autoUpdate: (e) ->
      if @checked
        updater.intervalID = window.setInterval updater.timeout, 1000
      else
        window.clearInterval updater.intervalID
    update: (e) ->
      if @status is 404
        updater.timer.textContent = ''
        updater.count.textContent = 404
        updater.count.className = 'error'
        window.clearInterval updater.intervalID
        for input in $$ '#com_submit'
          input.disabled = true
          input.value = 404
        d.title = d.title.match(/.+- /)[0] + 404
        g.dead = true
        Favicon.update()
        return

      br = $ 'br[clear]'
      id = Number $('td[id]', br.previousElementSibling)?.id or 0

      arr = []
      body = $.el 'body',
        innerHTML: @responseText
      replies = $$ 'td[id]', body
      while (reply = replies.pop()) and (reply.id > id)
        arr.push reply.parentNode.parentNode.parentNode #table

      updater.timer.textContent = '-' + $.config 'Interval'
      if $.config 'Verbose'
        updater.count.textContent = '+' + arr.length
        if arr.length is 0
          updater.count.className = ''
        else
          updater.count.className = 'new'

      #XXX add replies in correct order so /b/acklinks resolve
      while reply = arr.pop()
        $.before br, reply

  timeout: ->
    n = Number updater.timer.textContent
    ++n

    if n is 10
      updater.count.textContent = 'retry'
      updater.count.className = ''
      n = 0

    updater.timer.textContent = n

    if n is 0
      updater.update()

  updateNow: ->
    updater.timer.textContent = 0
    updater.update()

  update: ->
    updater.request?.abort()
    url = location.href + '?' + Date.now() # fool the cache
    cb = updater.cb.update
    updater.request = $.get url, cb

watcher =
  init: ->
    html = '<div class=move>Thread Watcher</div>'
    dialog = ui.dialog 'watcher', top: '50px', left: '0px', html
    $.append d.body, dialog

    #add watch buttons
    inputs = $$ 'form > input[value=delete], div.thread > input[value=delete]'
    for input in inputs
      favicon = $.el 'img',
        className: 'favicon'
      $.bind favicon, 'click', watcher.cb.toggle
      $.before input, favicon

    #populate watcher, display watch buttons
    watcher.refresh()

    $.bind window, 'storage', (e) -> watcher.refresh() if e.key is "#{NAMESPACE}watched"

  refresh: ->
    watched = $.getValue 'watched', {}
    dialog = $ '#watcher'
    for div in $$ 'div:not(.move)', dialog
      $.rm div
    for board of watched
      for id, props of watched[board]
        div = $.el 'div'
        x = $.el 'a',
          textContent: 'X'
        $.bind x, 'click', watcher.cb.x
        link = $.el 'a', props

        $.append div, x, $.tn(' '), link
        $.append dialog, div

    watchedBoard = watched[g.BOARD] or {}
    for favicon in $$ 'img.favicon'
      id = favicon.nextSibling.name
      if id of watchedBoard
        favicon.src = Favicon.default
      else
        favicon.src = Favicon.empty

  cb:
    toggle: (e) ->
      watcher.toggle @parentNode
    x: (e) ->
      [board, _, id] = @nextElementSibling
        .getAttribute('href').substring(1).split('/')
      watcher.unwatch board, id

  toggle: (thread) ->
    favicon = $ 'img.favicon', thread
    id = favicon.nextSibling.name
    if favicon.src == Favicon.empty
      watcher.watch thread, id
    else # favicon.src == Favicon.default
      watcher.unwatch g.BOARD, id

  unwatch: (board, id) ->
    watched = $.getValue 'watched', {}
    delete watched[board][id]
    $.setValue 'watched', watched
    watcher.refresh()

  watch: (thread, id) ->
    tc = $('span.filetitle', thread).textContent or $('blockquote', thread).textContent
    props =
      textContent: "/#{g.BOARD}/ - #{tc[...25]}"
      href: "/#{g.BOARD}/res/#{id}"

    watched = $.getValue 'watched', {}
    watched[g.BOARD] or= {}
    watched[g.BOARD][id] = props
    $.setValue 'watched', watched
    watcher.refresh()

anonymize =
  init: ->
    g.callbacks.push (root) ->
      name = $ 'span.commentpostername, span.postername', root
      name.textContent = 'Anonymous'
      if trip = $ 'span.postertrip', root
        if trip.parentNode.nodeName is 'A'
          $.rm trip.parentNode
        else
          $.rm trip

sauce =
  init: ->
    sauce.prefixes = (s for s in ($.config('flavors').split '\n') when s[0] != '#')
    sauce.names = (prefix.match(/(\w+)\./)[1] for prefix in sauce.prefixes)
    g.callbacks.push (root) ->
      return if root.className is 'inline'
      if span = $ 'span.filesize', root
        suffix = $('a', span).href
        for prefix, i in sauce.prefixes
          link = $.el 'a',
            textContent: sauce.names[i]
            href: prefix + suffix
          $.append span, $.tn(' '), link

revealSpoilers =
  init: ->
    g.callbacks.push (root) ->
      return if root.className is 'inline' or not img = $ 'img[alt^=Spoiler]', root
      img.removeAttribute 'height'
      img.removeAttribute 'width'
      [_, board, nb] = img.parentNode.href.match /(\w+)\/src\/(\d+)/
      img.src = "http://0.thumbs.4chan.org/#{board}/thumb/#{nb}s.jpg"

Time =
  init: ->
    Time.foo()
    g.callbacks.push Time.node
  node: (root) ->
    return if root.className is 'inline'
    s = $('span[id^=no]', root).previousSibling
    [_, month, day, year, hour, min] =
      s.textContent.match /(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\d+)/
    year = "20#{year}"
    month -= 1 #months start at 0
    hour = g.chanOffset + Number hour
    Time.date = new Date year, month, day, hour, min
    #XXX /b/ will have seconds cut off

    time = $.el 'time',
      textContent: ' ' + Time.funk(Time) + ' '
    $.replace s, time
  foo: ->
    code = $.config('time').replace /%([A-Za-z])/g, (s, c) ->
      switch c
        when 'a', 'A', 'b', 'B', 'd', 'H', 'I', 'm', 'M', 'p', 'P', 'y' then "' + Time.#{c}() + '"
        else s
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
  a: -> @day[@date.getDay()][...3]
  A: -> @day[@date.getDay()]
  b: -> @month[@date.getMonth()][...3]
  B: -> @month[@date.getMonth()]
  d: -> @zeroPad @date.getDate()
  H: -> @zeroPad @date.getHours()
  I: -> @zeroPad @date.getHours() % 12 or 12
  m: -> @zeroPad @date.getMonth() + 1
  M: -> @zeroPad @date.getMinutes()
  p: -> if @date.getHours() < 12 then 'AM' else 'PM'
  P: -> if @date.getHours() < 12 then 'am' else 'pm'
  y: -> @date.getFullYear() - 2000

titlePost =
  init: ->
    if tc = $('span.filetitle').textContent or $('blockquote').textContent
      d.title = "/#{g.BOARD}/ - #{tc}"

quoteBacklink =
  init: ->
    g.callbacks.push (root) ->
      return if /inline/.test root.className
      # op or reply
      id = root.id or $('td[id]', root).id
      quotes = {}
      opbl = ! $.config 'OP Backlinks'
      for quote in $$ 'a.quotelink', root
        #don't process >>>/b/
        continue unless qid = quote.hash[1..]
        #duplicate quotes get overwritten
        quotes[qid] = quote
      for qid of quotes
        continue unless el = d.getElementById qid
        #don't backlink the op
        continue if opbl and el.className is 'op'
        link = $.el 'a',
          href: "##{id}"
          className: 'backlink'
          textContent: ">>#{id}"
        if $.config 'Quote Preview'
          $.bind link, 'mouseover', quotePreview.mouseover
          $.bind link, 'mousemove', ui.hover
          $.bind link, 'mouseout',  quotePreview.mouseout
        if $.config 'Quote Inline'
          $.bind link, 'click', quoteInline.toggle
        unless container = $ '.container', el
          container = $.el 'span', className: 'container'
          root = $('.reportbutton', el) or $('span[id^=no]', el)
          $.after root, container
        $.append container, $.tn(' '), link

quoteInline =
  init: ->
    g.callbacks.push (root) ->
      for quote in $$ 'a.quotelink, a.backlink', root
        continue unless quote.hash
        quote.removeAttribute 'onclick'
        $.bind quote, 'click', quoteInline.toggle
  toggle: (e) ->
    e.preventDefault()
    id = @hash[1..]
    if table = $ "#i#{id}", $.x 'ancestor::td[1]', @
      $.rm table
      $.removeClass @, 'inlined'
      for inlined in $$ 'input', table
        $.show $.x 'ancestor::table[1]', d.getElementById inlined.name
      return
    root = if @parentNode.nodeName is 'FONT' then @parentNode else @nextSibling
    if el = d.getElementById id
      inline = quoteInline.table id, el.innerHTML
      if @className is 'backlink'
        $.after @parentNode, inline
        $.hide $.x 'ancestor::table[1]', el
      else
        $.after root, inline
    else
      inline = $.el 'td',
        className: 'reply inline'
        id: "i#{id}"
        innerHTML: "Loading #{id}..."
      $.after root, inline
      {pathname} = @
      threadID = pathname.split('/').pop()
      $.cache pathname, (-> quoteInline.parse @, pathname, id, threadID, inline)
    $.addClass @, 'inlined'
  parse: (req, pathname, id, threadID, inline) ->
    if req.status isnt 200
      inline.innerHTML = "#{req.status} #{req.statusText}"
      return

    body = $.el 'body',
      innerHTML: req.responseText
    if id == threadID #OP
      op = threading.op $ 'form[name=delform] > *', body
      html = op.innerHTML
    else
      for reply in $$ 'td.reply', body
        if reply.id == id
          html = reply.innerHTML
          break
    newInline = quoteInline.table id, html
    for quote in $$ 'a.quotelink', newInline
      if quote.getAttribute('href') is quote.hash
        quote.pathname = pathname
    $.addClass newInline, 'crossquote'
    $.replace inline, newInline
  table: (id, html) ->
    $.el 'table',
      className: 'inline'
      id: "i#{id}"
      innerHTML: "<tbody><tr><td class=reply>#{html}</td></tr></tbody>"

quotePreview =
  init: ->
    g.callbacks.push quotePreview.node
    preview = $.el 'div',
      id: 'qp'
      className: 'replyhl'
    $.append d.body, preview
  node: (root) ->
    for quote in $$ 'a.quotelink, a.backlink', root
      continue unless quote.hash
      $.bind quote, 'mouseover', quotePreview.mouseover
      $.bind quote, 'mousemove', ui.hover
      $.bind quote, 'mouseout',  quotePreview.mouseout
  mouseout: ->
    $.removeClass el, 'qphl' if el = d.getElementById @hash[1..]
    ui.hoverend()
  mouseover: (e) ->
    id = @hash[1..]
    qp = $ '#qp'
    if el = d.getElementById id
      qp.innerHTML = el.innerHTML
      $.addClass el, 'qphl' if $.config 'Quote Highlighting'
      if /backlink/.test @className
        replyID = $.x('ancestor::*[@id][1]', @).id.match(/\d+/)[0]
        for quote in $$ 'a.quotelink', qp
          if quote.hash[1..] is replyID
            quote.className = 'forwardlink'
    else
      qp.innerHTML = "Loading #{id}..."
      threadID = @pathname.split('/').pop() or $.x('ancestor::div[@class="thread"]/div', @).id
      $.cache @pathname, (-> quotePreview.parse @, id, threadID)
    ui.el = qp
  parse: (req, id, threadID) ->
    qp = $ '#qp'
    return unless qp.innerHTML is "Loading #{id}..."

    if req.status isnt 200
      qp.innerHTML = "#{req.status} #{req.statusText}"
      return

    body = $.el 'body',
      innerHTML: req.responseText
    if id == threadID #OP
      op = threading.op $ 'form[name=delform] > *', body
      html = op.innerHTML
    else
      for reply in $$ 'td.reply', body
        if reply.id == id
          html = reply.innerHTML
          break
    qp.innerHTML = html
    Time.node qp

quoteOP =
  init: ->
    g.callbacks.push (root) ->
      return if root.className is 'inline'
      tid = g.THREAD_ID or $.x('ancestor::div[contains(@class,"thread")]/div', root).id
      for quote in $$ 'a.quotelink', root
        if quote.hash[1..] is tid
          quote.innerHTML += '&nbsp;(OP)'

reportButton =
  init: ->
    g.callbacks.push (root) ->
      if not a = $ 'a.reportbutton', root
        span = $ 'span[id^=no]', root
        a = $.el 'a',
          className: 'reportbutton'
          innerHTML: '[&nbsp;!&nbsp;]'
        $.after span, a
        $.after span, $.tn(' ')
      $.bind a, 'click', reportButton.cb.report
  cb:
    report: (e) ->
      reportButton.report @
  report: (target) ->
    input = $ 'input', target.parentNode
    input.click()
    $('input[value="Report"]').click()
    input.click()

threadStats =
  init: ->
    threadStats.posts = 1
    threadStats.images = if $ '.op img[md5]' then 1 else 0
    html = "<div class=move><span id=postcount>#{threadStats.posts}</span> / <span id=imagecount>#{threadStats.images}</span></div>"
    dialog = ui.dialog 'stats', bottom: '0px', left: '0px', html
    dialog.className = 'dialog'
    threadStats.postcountEl  = $ '#postcount',  dialog
    threadStats.imagecountEl = $ '#imagecount', dialog
    $.append d.body, dialog
    g.callbacks.push threadStats.node
  node: (root) ->
    return if root.className
    threadStats.postcountEl.textContent = ++threadStats.posts
    if $ 'img[md5]', root
      threadStats.imagecountEl.textContent = ++threadStats.images
      if threadStats.images > 150
        threadStats.imagecountEl.className = 'error'

unread =
  init: ->
    unread.replies = []
    d.title = '(0) ' + d.title
    $.bind window, 'scroll', unread.scroll
    g.callbacks.push unread.node

  node: (root) ->
    return if root.className
    unread.replies.push root
    unread.updateTitle()
    Favicon.update()

  scroll: (e) ->
    height = d.body.clientHeight
    for reply, i in unread.replies
      {bottom} = reply.getBoundingClientRect()
      if bottom > height #post is not completely read
        break
    return if i is 0

    unread.replies = unread.replies[i..]
    unread.updateTitle()
    if unread.replies.length is 0
      Favicon.update()

  updateTitle: ->
    d.title = d.title.replace /\d+/, unread.replies.length

Favicon =
  dead: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAD/AAA9+90tAAAAAXRSTlMAQObYZgAAADtJREFUCB0FwUERxEAIALDszMG730PNSkBEBSECoU0AEPe0mly5NWprRUcDQAdn68qtkVsj3/84z++CD5u7CsnoBJoaAAAAAElFTkSuQmCC'
  deadHalo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVR4XrWSAQoAIAgD/f+njSApsTqjGoTQ5oGWPJMOOs60CzsWwIwz1I4PUIYh+WYEMGQ6I/txw91kP4oA9BdwhKp1My4xQq6e8Q9ANgDJjOErewFiNesV2uGSfGv1/HYAAAAASUVORK5CYII='
  default: $('link[rel="shortcut icon"]', d.head)?.href or '' #no favicon in `post successful` page
  empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  haloSFW: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVR4XrWRQQoAIQwD+6L97j7Ih9WTQQxhDqJQCk4Mranuvqod6LgwawSqSuUmWSPw/UNlJlnDAmA2ARjABLYj8ZyCzJHHqOg+GdAKZmKPIQUzuYrxicHqEgHzP9g7M0+hj45sAnRWxtPj3zSPAAAAAElFTkSuQmCC'
  haloNSFW: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABmzDP///8AAABet0i+AAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII='

  update: ->
    l = unread.replies.length
    if g.dead
      if l > 0
        href = Favicon.deadHalo
      else
        href = Favicon.dead
    else
      if l > 0
        href = Favicon.halo
      else
        href = Favicon.default

    #XXX `favicon.href = href` doesn't work on Firefox
    favicon = $ 'link[rel="shortcut icon"]', d.head
    clone = favicon.cloneNode true
    clone.href = href
    $.replace favicon, clone

redirect = ->
  switch g.BOARD
    when 'g', 'lit', 'sci', 'tv'
      url = "http://green-oval.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when 'a', 'jp', 'm', 'tg'
      url = "http://archive.easymodo.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when '3', 'adv', 'an', 'ck', 'co', 'fa', 'fit', 'int', 'k', 'mu', 'n', 'o', 'p', 'po', 'soc', 'sp', 'toy', 'trv', 'v', 'vp', 'x'
      url = "http://archive.no-ip.org/#{g.BOARD}/thread/#{g.THREAD_ID}"
    else
      url = "http://boards.4chan.org/#{g.BOARD}"
  location.href = url

Recaptcha =
  init: ->
    #hack to tab from comment straight to recaptcha
    for el in $$ '#recaptcha_table a'
      el.tabIndex = 1
    $.bind $('#recaptcha_response_field'), 'keydown', Recaptcha.listener
  listener: (e) ->
    if e.keyCode is 8 and @value is '' # backspace to reload
      Recaptcha.reload()
    if e.keyCode is 13 and cooldown.duration # press enter to enable auto-post if cooldown is still running
      $('#auto').checked = true
      qr.autohide.set()
  reload: ->
    window.location = 'javascript:Recaptcha.reload()'

nodeInserted = (e) ->
  {target} = e
  if target.nodeName is 'TABLE'
    for callback in g.callbacks
      callback target
  else if target.id is 'recaptcha_challenge_field' and dialog = $ '#qr'
    $('img', dialog).src = "http://www.google.com/recaptcha/api/image?c=" + target.value
    $('input[name=recaptcha_challenge_field]', dialog).value = target.value

imageHover =
  init: ->
    img = $.el 'img', id: 'iHover'
    $.append d.body, img
    g.callbacks.push imageHover.node
  node: (root) ->
    return unless thumb = $ 'img[md5]', root
    $.bind thumb, 'mouseover', imageHover.mouseover
    $.bind thumb, 'mousemove', ui.hover
    $.bind thumb, 'mouseout',  ui.hoverend
  mouseover: (e) ->
    el = $ '#iHover'
    el.src = null
    el.src = @parentNode.href
    ui.el = el

imgPreloading =
  init: ->
    g.callbacks.push (root) ->
      return unless thumb = $ 'img[md5]', root
      src = thumb.parentNode.href
      el = $.el 'img', { src }

imgGif =
  init: ->
    g.callbacks.push (root) ->
      return unless thumb = $ 'img[md5]', root
      src = thumb.parentNode.href
      if /gif$/.test src
        thumb.src = src

imgExpand =
  init: ->
    g.callbacks.push imgExpand.node
    imgExpand.dialog()
    $.bind window, 'resize', imgExpand.resize
    imgExpand.resize()

  node: (root) ->
    return unless thumb = $ 'img[md5]', root
    a = thumb.parentNode
    $.bind a, 'click', imgExpand.cb.toggle
    if imgExpand.on and root.className isnt 'inline' then imgExpand.toggle a
  cb:
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.button isnt 0
      e.preventDefault()
      imgExpand.toggle @
    all: (e) ->
      thumbs = $$ 'img[md5]'
      imgExpand.on = @checked
      if imgExpand.on #expand
        for thumb in thumbs
          unless thumb.hidden #thumbnail hidden, image already expanded
            imgExpand.expand thumb
      else #contract
        for thumb in thumbs
          if thumb.hidden #thumbnail hidden - unhide it
            imgExpand.contract thumb
    typeChange: (e) ->
      switch @value
        when 'full'
          klass = ''
        when 'fit width'
          klass = 'fitwidth'
        when 'fit height'
          klass = 'fitheight'
        when 'fit screen'
          klass = 'fitwidth fitheight'
      d.body.className = klass

  toggle: (a) ->
    thumb = a.firstChild
    if thumb.hidden
      imgExpand.contract thumb
    else
      imgExpand.expand thumb

  contract: (thumb) ->
    $.show thumb
    $.rm thumb.nextSibling

  expand: (thumb) ->
    $.hide thumb
    a = thumb.parentNode
    img = $.el 'img',
      src: a.href
    unless a.parentNode.className is 'op'
      filesize = $ 'span.filesize', a.parentNode
      [_, max] = filesize.textContent.match /(\d+)x/
      img.style.maxWidth = "-moz-calc(#{max}px)"
    $.append a, img

  dialog: ->
    controls = $.el 'div',
      id: 'imgControls'
      innerHTML:
        "<select id=imageType name=imageType><option>full</option><option>fit width</option><option>fit height</option><option>fit screen</option></select>
        <label>Expand Images<input type=checkbox id=imageExpand></label>"
    imageType = $.getValue 'imageType', 'full'
    for option in $$ 'option', controls
      if option.textContent is imageType
        option.selected = true
        break
    select = $ 'select', controls
    imgExpand.cb.typeChange.call select
    $.bind select, 'change', $.cb.value
    $.bind select, 'change', imgExpand.cb.typeChange
    $.bind $('input',  controls), 'click',  imgExpand.cb.all

    delform = $ 'form[name=delform]'
    $.prepend delform, controls

  resize: (e) ->
    $.rm style if style = $ 'style.height', d.head
    style = $.addStyle "body.fitheight img[md5] + img { max-height: #{d.body.clientHeight}px }"
    style.className = 'height'

firstRun =
  init: ->
    style = $.addStyle "
      #navtopr, #navbotr {
        position: relative;
      }
      #navtopr::before {
        content: '';
        height: 50px;
        width: 100px;
        background: red;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        -webkit-transform-origin: 100% 200%;
        -moz-transform-origin: 100% 200%;
        -o-transform-origin: 100% 200%;
        position: absolute;
        top: 100%;
        right: 100%;
        z-index: 999;
      }
      #navtopr::after {
        content: '';
        border-top: 100px solid red;
        border-left: 100px solid transparent;
        position: absolute;
        top: 100%;
        right: 100%;
        z-index: 999;
      }
      #navbotr::before {
        content: '';
        height: 50px;
        width: 100px;
        background: red;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        -webkit-transform-origin: 100% -100%;
        -moz-transform-origin: 100% -100%;
        -o-transform-origin: 100% -100%;
        position: absolute;
        bottom: 100%;
        right: 100%;
        z-index: 999;
      }
      #navbotr::after {
        content: '';
        border-bottom: 100px solid red;
        border-left: 100px solid transparent;
        position: absolute;
        bottom: 100%;
        right: 100%;
        z-index: 999;
      }
    "
    style.className = 'firstrun'

    dialog = $.el 'div',
      id: 'overlay'
      className: 'firstrun'
      innerHTML: "
        <div id=options>
          <div class='reply dialog'>
            <p>Click the <strong>4chan X</strong> buttons for options; they are at the top and bottom of the page.</p>
            <p>If you don't see the buttons, try disabling your userstyles.</p>
          </div>
        </div>"
    $.append d.body, dialog

    $.bind window, 'click', firstRun.close

  close: ->
    $.setValue 'firstrun', true
    $.rm $ 'style.firstrun', d.head
    $.rm $ '#overlay'
    $.unbind window, 'click', firstRun.close

main =
  init: ->
    pathname = location.pathname.substring(1).split('/')
    [g.BOARD, temp] = pathname
    if temp is 'res'
      g.REPLY = temp
      g.THREAD_ID = pathname[2]
    else
      g.PAGENUM = parseInt(temp) or 0

    if location.hostname is 'sys.4chan.org'
      qr.sys()
      return
    if $.config('404 Redirect') and d.title is '4chan - 404' and /^\d+$/.test g.THREAD_ID
      redirect()
      return
    if not $ '#navtopr'
      return

    Favicon.halo = if /ws/.test Favicon.default then Favicon.haloSFW else Favicon.haloNSFW
    $('link[rel="shortcut icon"]', d.head).setAttribute 'type', 'image/x-icon'
    g.hiddenReplies = $.getValue "hiddenReplies/#{g.BOARD}/", {}
    tzOffset = (new Date()).getTimezoneOffset() / 60
    # GMT -8 is given as +480; would GMT +8 be -480 ?
    g.chanOffset = 5 - tzOffset# 4chan = EST = GMT -5
    if $.isDST() then g.chanOffset -= 1

    lastChecked = $.getValue 'lastChecked', 0
    now = Date.now()
    DAY = 1000 * 60 * 60 * 24
    if lastChecked < now - 1*DAY
      cutoff = now - 7*DAY
      hiddenThreads = $.getValue "hiddenThreads/#{g.BOARD}/", {}

      for id, timestamp of hiddenThreads
        if timestamp < cutoff
          delete hiddenThreads[id]

      for id, timestamp of g.hiddenReplies
        if timestamp < cutoff
          delete g.hiddenReplies[id]

      $.setValue "hiddenThreads/#{g.BOARD}/", hiddenThreads
      $.setValue "hiddenReplies/#{g.BOARD}/", g.hiddenReplies
      $.setValue 'lastChecked', now

    $.addStyle main.css

    if (form = $ 'form[name=post]') and canPost = !!$ '#recaptcha_response_field'
      Recaptcha.init()
      $.bind form, 'submit', qr.cb.submit

    #major features
    if $.config 'Auto Noko'
      $('.postarea form').action += '?auto_noko'

    if $.config 'Cooldown'
      cooldown.init()

    if $.config 'Image Expansion'
      imgExpand.init()

    if $.config 'Image Auto-Gif'
      imgGif.init()

    if $.config 'Time Formatting'
      Time.init()

    if $.config 'Sauce'
      sauce.init()

    if $.config 'Reveal Spoilers'
      revealSpoilers.init()

    if $.config 'Anonymize'
      anonymize.init()

    if $.config 'Image Hover'
      imageHover.init()

    if $.config 'Reply Hiding'
      replyHiding.init()

    if canPost and $.config 'Quick Reply'
      qr.init()

    if $.config 'Report Button'
      reportButton.init()

    if $.config 'Quote Backlinks'
      quoteBacklink.init()

    if $.config 'Quote Inline'
      quoteInline.init()

    if $.config 'Quote Preview'
      quotePreview.init()

    if $.config 'Indicate OP quote'
      quoteOP.init()

    if $.config 'Thread Watcher'
      watcher.init()

    if $.config 'Keybinds'
      keybinds.init()

    threading.init()

    if g.REPLY
      if $.config 'Thread Updater'
        updater.init()

      if $.config 'Image Preloading'
        imgPreloading.init()

      if $.config('Quick Reply') and $.config 'Persistent QR'
        qr.persist()

      if $.config 'Post in Title'
        titlePost.init()

      if $.config 'Thread Stats'
        threadStats.init()

      if $.config 'Unread Count'
        unread.init()

      if $.config 'Reply Navigation'
        nav.init()

      if $.config('Auto Watch') and $.config('Thread Watcher') and
        location.hash is '#watch' and $('img.favicon').src is Favicon.empty
          watcher.watch null, g.THREAD_ID

    else #not reply
      if $.config 'Index Navigation'
        nav.init()

      if $.config 'Thread Hiding'
        threadHiding.init()

      if $.config 'Thread Expansion'
        expandThread.init()

      if $.config 'Comment Expansion'
        expandComment.init()

      if $.config('Auto Watch')
        $('.postarea form').action += '?auto_watch'

    for op in $$ 'div.op'
      for callback in g.callbacks
        callback op
    for table in $$ 'a + table'
      for callback in g.callbacks
        callback table
    $.bind d.body, 'DOMNodeInserted', nodeInserted
    options.init()

    unless $.getValue 'firstrun'
      firstRun.init()

  css: '
      /* dialog styling */
      div.dialog {
        border: 1px solid;
      }
      div.dialog > div.move {
        cursor: move;
      }
      label, a, .favicon, #qr img {
        cursor: pointer;
      }

      .new {
        background: lime;
      }
      .error {
        color: red;
      }
      td.replyhider {
        vertical-align: top;
      }

      div.thread.stub > *:not(.block) {
        display: none;
      }

      .filesize + br + a {
        float: left;
        pointer-events: none;
      }
      img[md5], img[md5] + img {
        pointer-events: all;
      }
      body.fitwidth img[md5] + img {
        max-width: 100%;
        width: -moz-calc(100%); /* hack so only firefox sees this */
      }

      #qp, #iHover {
        position: fixed;
      }

      #iHover {
        max-height: 100%;
      }

      #navlinks {
        font-size: 16px;
        position: fixed;
        top: 25px;
        right: 5px;
      }

      #overlay {
        display: table;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,.5);
      }
      #options {
        display: table-cell;
        vertical-align: middle;
      }
      #options .dialog {
        margin: auto;
        padding: 5px;
        width: 500px;
      }
      #credits {
        text-align: right;
      }
      #options ul {
        list-style: none;
        padding: 0;
      }
      #floaty {
        float: left;
      }
      #content > * {
        height: 450px;
        overflow: auto;
      }
      #content textarea {
        margin: 0;
        width: 100%;
      }

      #qr {
        position: fixed;
      }
      #qr > div.move {
        text-align: right;
      }
      #qr input[name=name] {
        float: left;
      }
      #qr_form {
        clear: left;
      }
      #qr_form, #qr #com_submit, #qr input[name=upfile] {
        margin: 0;
      }
      #qr textarea {
        width: 100%;
        height: 120px;
      }
      #qr.auto:not(:hover) > form {
        height: 0;
        overflow: hidden;
      }
      /* http://stackoverflow.com/questions/2610497/change-an-inputs-html5-placeholder-color-with-css */
      #qr input::-webkit-input-placeholder {
        color: grey;
      }
      #qr input:-moz-placeholder {
        color: grey;
      }
      /* qr reCAPTCHA */
      #qr img {
        border: 1px solid #AAA;
      }

      #updater {
        position: fixed;
        text-align: right;
      }
      #updater input[type=text] {
        width: 50px;
      }
      #updater:not(:hover) {
        border: none;
        background: transparent;
      }
      #updater:not(:hover) > div:not(.move) {
        display: none;
      }

      #stats {
        border: none;
        position: fixed;
      }

      #watcher {
        position: absolute;
      }
      #watcher > div {
        padding-right: 5px;
        padding-left: 5px;
      }
      #watcher > div.move {
        text-decoration: underline;
        padding-top: 5px;
      }
      #watcher > div:last-child {
        padding-bottom: 5px;
      }

      #qp {
        border: 1px solid;
        padding-bottom: 5px;
      }
      #qp input {
        display: none;
      }
      .qphl {
        outline: 2px solid rgba(216, 94, 49, .7);
      }
      .inlined {
        opacity: .5;
      }

      /* Firefox bug: hidden tables are not hidden */
      [hidden] {
        display: none;
      }
    '

main.init()
