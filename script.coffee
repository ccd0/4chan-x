# XXX chrome can't into `{log} = console`
if console?
  log = (arg) ->
    console.log arg

config =
  main:
    monitor:
      'Thread Updater':     [true,  'Update threads']
      'Unread Count':       [true,  'Show unread post count in tab title']
      'Post in Title':      [true,  'Show the op\'s post in the tab title']
      'Thread Stats':       [true,  'Display reply and image count']
      'Thread Watcher':     [true,  'Bookmark threads']
      'Auto Watch':         [true,  'Automatically watch threads that you start']
      'Auto Watch Reply':   [false, 'Automatically watch threads that you reply to']
    img:
      'Image Auto-Gif':     [false, 'Animate gif thumbnails']
      'Image Expansion':    [true,  'Expand images']
      'Image Hover':        [false, 'Show full image on mouseover']
      'Image Preloading':   [false, 'Preload Images']
      'Sauce':              [true,  'Add sauce to images']
    post:
      'Cooldown':           [true,  'Prevent \'flood detected\' errors']
      'Quick Reply':        [true,  'Reply without leaving the page']
      'Persistent QR':      [false, 'Quick reply won\'t disappear after posting. Only in replies.']
    quote:
      'Quote Backlinks':    [true,  'Add quote backlinks']
      'OP Backlinks':       [false, 'Add backlinks to the OP']
      'Quote Highlighting': [true,  'Highlight the previewed post']
      'Quote Inline':       [true,  'Show quoted post inline on quote click']
      'Quote Preview':      [true,  'Show quote content on hover']
      'Indicate OP quote':  [true,  'Add \'(OP)\' to OP quotes']
    hide:
      'Reply Hiding':       [true,  'Hide single replies']
      'Thread Hiding':      [true,  'Hide entire threads']
      'Show Stubs':         [true,  'Of hidden threads / replies']
    misc:
      '404 Redirect':       [true,  'Redirect dead threads']
      'Anonymize':          [false, 'Make everybody anonymous']
      'Keybinds':           [false, 'Binds actions to keys']
      'Time Formatting':    [false, 'Arbitrarily formatted timestamps, using your local time']
      'Report Button':      [true,  'Add report buttons']
      'Comment Expansion':  [true,  'Expand too long comments']
      'Thread Expansion':   [true,  'View all replies']
      'Thread Navigation':  [true,  'Navigate to previous / next thread']
  flavors: [
    'http://regex.info/exif.cgi?url='
    'http://iqdb.org/?url='
    'http://tineye.com/search?url='
    '#http://saucenao.com/search.php?db=999&url='
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M'
  updater:
    checkbox:
      'Verbose':     [true,  'Show countdown timer, new post count']
      'Auto Update': [false, 'Automatically fetch new posts']
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

ui =
  dialog: (id, position, html) ->
    el = document.createElement 'div'
    el.className = 'reply dialog'
    el.innerHTML = html
    el.id = id
    {left, top} = position
    left = localStorage["#{id}Left"] ? left
    top  = localStorage["#{id}Top"]  ? top
    if left then el.style.left = left else el.style.right  = '0px'
    if top  then el.style.top  = top  else el.style.bottom = '0px'
    el.querySelector('div.move').addEventListener 'mousedown', ui.dragstart, false
    el.querySelector('div.move a[name=close]')?.addEventListener 'click',
      (-> el.parentNode.removeChild(el)), true
    el
  dragstart: (e) ->
    #prevent text selection
    e.preventDefault()
    ui.el = el = @parentNode
    d = document
    d.addEventListener 'mousemove', ui.drag, true
    d.addEventListener 'mouseup',   ui.dragend, true
    #distance from pointer to el edge is constant; calculate it here.
    # XXX opera reports el.offsetLeft / el.offsetTop as 0
    rect = el.getBoundingClientRect()
    ui.dx = e.clientX - rect.left
    ui.dy = e.clientY - rect.top
    #factor out el from document dimensions
    ui.width  = document.body.clientWidth  - el.offsetWidth
    ui.height = document.body.clientHeight - el.offsetHeight
  drag: (e) ->
    e.preventDefault()
    {el} = ui
    left = e.clientX - ui.dx
    if left < 10 then left = '0px'
    else if ui.width - left < 10 then left = ''
    right = if left then '' else '0px'
    el.style.left  = left
    el.style.right = right
    top = e.clientY - ui.dy
    if top < 10 then top = '0px'
    else if ui.height - top < 10 then top = ''
    bottom = if top then '' else '0px'
    el.style.top  = top
    el.style.bottom = bottom
  dragend: ->
    #{id} = {el} = ui
    #equivalent to
    #{id} = ui; {el} = ui
    {el} = ui
    {id} = el
    localStorage["#{id}Left"] = el.style.left
    localStorage["#{id}Top"]  = el.style.top
    d = document
    d.removeEventListener 'mousemove', ui.drag, true
    d.removeEventListener 'mouseup',   ui.dragend, true
  hover: (e) ->
    {clientX, clientY} = e
    {el} = ui
    {clientHeight, clientWidth} = d.body
    height = el.offsetHeight

    top = clientY - 120
    bot = top + height
    el.style.top =
      if clientHeight < height or top < 0
        '0px'
      else if bot > clientHeight
        clientHeight - height + 'px'
      else
        top + 'px'

    if clientX < clientWidth - 400
      el.style.left = clientX + 45 + 'px'
      el.style.right = ''
    else
      el.style.left = ''
      el.style.right = clientWidth - clientX + 45 + 'px'

  hoverend: (e) ->
    ui.el.style.top = 'auto'
    $.hide ui.el

#convenience
d = document
g = null #globals

#utility
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
    style = document.createElement 'style'
    style.type = 'text/css'
    style.textContent = css
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
    el.style.display = 'none'
  show: (el) ->
    el.style.display = ''
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
    el.addEventListener eventType, handler, true
  unbind: (el, eventType, handler) ->
    el.removeEventListener eventType, handler, true
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

# XXX opera cannot into Object.keys
if not Object.keys
  Object.keys = (o) ->
    key for key in o

# upgrade your firefox god damn it!
if not d.head then d.head = $('head', d)

$$ = (selector, root=d.body) ->
  Array::slice.call root.querySelectorAll selector

#funks
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
        num = if g.BOARD is 'b' then 3 else 5
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
    g.callbacks.push replyHiding.cb.node

  cb:
    hide: (e) ->
      reply = @parentNode.nextSibling
      replyHiding.hide reply

    node: (root) ->
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

      div = $.el 'div'
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
    $.bind d, 'keydown',  keybinds.cb.keydown
    $.bind d, 'keypress', keybinds.cb.keypress

  cb:
    keydown: (e) ->
      if d.activeElement.nodeName in ['TEXTAREA', 'INPUT']
        keybinds.mode = keybinds.insert
      else
        keybinds.mode = keybinds.normal

      kc = e.keyCode
      if 65 <= kc <= 90 #A-Z
        key = String.fromCharCode kc
        if !e.shiftKey
          key = key.toLowerCase()
        if e.ctrlKey then key = '^' + key
      else
        if kc is 27
          key = '<Esc>'
        else if 48 <= kc <= 57 #0-9
          key = String.fromCharCode kc
      keybinds.key = key

    keypress: (e) ->
      keybinds.mode e

  insert: (e) ->
    switch keybinds.key
      when '<Esc>'
        e.preventDefault()
        $.rm $ '#qr'
      when '^s'
        ta = d.activeElement
        return unless ta.nodeName is 'TEXTAREA'

        e.preventDefault()

        value    = ta.value
        selStart = ta.selectionStart
        selEnd   = ta.selectionEnd

        valStart = value[0...selStart] + '[spoiler]'
        valMid   = value[selStart...selEnd]
        valEnd   = '[/spoiler]' + value[selEnd..]

        ta.value = valStart + valMid + valEnd
        range = valStart.length + valMid.length
        ta.setSelectionRange range, range

  normal: (e) ->
    thread = nav.getThread()
    switch keybinds.key
      when '0'
        window.location = "/#{g.BOARD}/0#0"
      when 'I'
        keybinds.qr thread
      when 'J'
        keybinds.hl.next thread
      when 'K'
        keybinds.hl.prev thread
      when 'M'
        keybinds.img thread, true
      when 'O'
        keybinds.open thread
      when 'e'
        expandThread.toggle thread
      when 'i'
        keybinds.qr thread, true
      when 'm'
        keybinds.img thread
      when 'n'
        nav.next()
      when 'o'
        keybinds.open thread, true
      when 'p'
        nav.prev()
      when 'u'
        updater.update()
      when 'w'
        watcher.toggle thread
      when 'x'
        threadHiding.toggle thread

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
    nav.threads = $$ 'div.thread:not([style])'
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
    $.bind a, 'click', options.toggle
    $.replace home, a
    home = $ '#navbotr a'
    a = $.el 'a',
      textContent: '4chan X'
    $.bind a, 'click', options.toggle
    $.replace home, a

  toggle: ->
    if dialog = $ '#options'
      $.rm dialog
    else
      options.dialog()

  dialog: ->
    hiddenThreads = $.getValue "hiddenThreads/#{g.BOARD}/", {}
    hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length
    html = "
      <div class=move>Options <a name=close>X</a></div>
      <hr>
      <div id=main>
      </div>
      <hr>
      <div id=floaty>
        <div><input type=button value='hidden: #{hiddenNum}'></div>
        <div><a name=flavors>Sauce flavors</a></div>
        <div><a name=time>Time Formatting</a></div>
      </div>
      <div id=credits>
        <div><a href=https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2DBVZBUAM4DHC&lc=US&item_name=Aeosynth&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted><img alt=Donate src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAaCAYAAAA67jspAAAEsUlEQVRo3u2a/W9TVRjH9yf0T+hPRhONMzNm2gB1S8SOIBshKpCwDsWXDdYSYGQbWwtMBBnddC8yda2L8mKDbWQbyuJW2ND5tg7IIFk2OlARNKaLmhj9wft4nudwTntv77p1PeGn2+ST7Xk5z3Pv95x7etvbgoIlvKCnCCwWpyDfFxUa3QYwewrgzxsA//1jYcbfdwFunQX42rM84UnoS9UA81MA/yYtcuGvOYAJ39KFJ7FvRtis3bbIh7uji4tOYv/Yz7aPGQsV/Da+sOgk9uRBto1ctVDJT/3mokPkMTYjYwC/f2OhmqF1kLG6tdGtoP16QRnBj4NQUPSKDnvZTvAFOiCZGFLaK1ewPx7ffesZ9+tXOZx5BLSxl0G7M6QM74GjUmSnu5GwrawhX3mNX2mvXIh/FeYTf6z9/vWdaALUOLV3n3WA9uV60G6eBu2XASU43Q0k7sj5D6UvcTksRY9fOpExBnOR5Ew0a22MYx7WM4tnq1Ne00z9I5EPTGumH68yLlaC1r+Cr3LaTgZLQRtaC9r4dtB+jipBbCPJ6bDO791/iPyB7jbpC/Z1yokQYJ5ZPV/rUV1u5MzxrHXQJ+LGmLtuP/mNNe0uDyTiJ9VocaWFa8s0Tgn++bMpfqgH7VY4L+IXeuWBG2O+tw5z4dhftIOhdrJtK6vp/0i4Cwo37OJiMTu9HoIxzHHv8ZPtrNxLOcnrJ2UdjAe6WqWN8cT3feD1taQmjvXHuiIP644M9si65dWNeeugTb/LxH5Oapu2wkv0jFaBdiPEtpgTyyLQeYSvoN3NGTGv7wBf4SwHbburlm89g10yJxJ+m5/06w1kB0PH7k1gLSSv9el8Zj2QeKxHiit82IMmaUud9OGEoC/xXS/ZWN84bllMNGToKgUH3F+MnGOXwLdshU6zS3KuLyfcu/dxUTvezIjZXTv4Hh7rJriQO3Q5IwPv3BNmj66e70jLgj2SU73kE/UFogaC42m78vnJFv1FnkAKnuN5a7PvsTuSRoAvysw1lYJ/Vpyd82sAxtmlOdkE2tWWRSms2M5XbXifzh9o3csFXl1NNsbpZDfXmua5PTsXrGf0YQ26KrZ5yOc7yIXz1u+SY7AebVXd9br+eDyYb2Qp54qgNhB7YXEdpeCfPgoQLVKGWCHCnj/1BLTVu6Q/1u4k/1zoSX7CpW7KEbk2x0u6PGM9M5/Rdq7fSHbI/4z0YR/0TR5fkdFf5GAserhUqR4EaiwFDz9I94kqiAUcGR940gk1l+jynRUv8jetss3g97rAXlLJV3dVha4exo090n1iXPnGDYScXJYrcuQd0GtrIXpoFflELh4H+m2OrXxSuoqVaUKEH0p9+JGiKyD6hoMd/PMZ+D2rYe79woz8+Y8eBu+ra8D2FD9Re8kWyjXWa6srzeqLtRbTWKyD4xHMmex8XOagT/QJNa2S/d3uddJvHKMM3SdNFPyTB9Q3seCgtsYvsEh0vHWxUI/pt4Uo+MDTABerLFSCmmb9TnxkE8CE30IFqOWSnvrgg+PpoEU+oIY5Pdc8x+4UZk8D3B62yAXUDLVb9tP7YXZZTHUA3BkD+GPGwgzUBjUa3qTw9ykWSn4I9D+H+C08gjS7eAAAAABJRU5ErkJggg==></a></div>
        <div><a href=http://chat.now.im/x/aeos>support throd</a> | <a href=https://github.com/aeosynth/4chan-x/issues>github</a> | <a href=http://userscripts.org/scripts/show/51412>uso</a></div>
      </div>
      <div><textarea style='display: none;' name=flavors>#{$.config 'flavors'}</textarea></div>
      <div id=time style='display: none;'>
        <div><input name=time value=#{$.config 'time'}> <span id=timePreview></span></div>
        <table>
          <caption>Format specifiers <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>(source)</a></caption>
          <tbody>
            <tr><th>Specifier</th><th>Description</th><th>Values/Example</th></tr>
            <tr><td>%a</td><td>weekday, abbreviated</td><td>Fri</td></tr>
            <tr><td>%d</td><td>day of the month (dd), zero padded</td><td>03</td></tr>
            <tr><td>%H</td><td>hour (24 hour clock) zero padded</td><td>13</td></tr>
            <tr><td>%I</td><td>hour (12 hour clock) zero padded</td><td>02</td></tr>
            <tr><td>%m</td><td>mm month</td><td>06</td></tr>
            <tr><td>%M</td><td>MM minutes</td><td>54</td></tr>
            <tr><td>%p</td><td>upper case AM or PM</td><td>PM</td>
            <tr><td>%P</td><td>lower case am or pm</td><td>PM</td>
            <tr><td>%y</td><td>yy two digit year</td><td>00-99</td></tr>
          </tbody>
        </table>
      </div>
    "

    dialog = ui.dialog 'options', top: '25%', left: '25%', html
    main = $('#main', dialog)
    for key, obj of config.main
      ul = $.el 'ul',
        textContent: key
      for key, arr of obj
        checked = if $.config key then "checked" else ""
        description = arr[1]
        li = $.el 'li',
          innerHTML: "<label><input type=checkbox name='#{key}' #{checked}>#{key}</label><span class=description>#{description}</span>"
        $.append ul, li
      $.append main, ul
    for input in $$ 'input[type=checkbox]', dialog
      $.bind input, 'click', $.cb.checked
    $.bind $('input[type=button]', dialog), 'click', options.cb.clearHidden
    $.bind $('a[name=flavors]', dialog), 'click', options.flavors
    $.bind $('a[name=time]', dialog), 'click', options.time
    $.bind $('textarea[name=flavors]', dialog), 'change', $.cb.value
    $.bind $('input[name=time]', dialog), 'keyup', options.cb.time
    $.append d.body, dialog
    options.cb.time.call $('input[name=time]', dialog)

  flavors: ->
    ta = $ '#options textarea[name=flavors]'
    if ta.style.display then $.show ta else $.hide ta

  time: ->
    div = $ '#time'
    if div.style.display then $.show div else $.hide div

  cb:
    clearHidden: (e) ->
      #'hidden' might be misleading; it's the number of IDs we're *looking* for,
      # not the number of posts actually hidden on the page.
      $.deleteValue "hiddenReplies/#{g.BOARD}/"
      $.deleteValue "hiddenThreads/#{g.BOARD}/"
      @value = "hidden: 0"
      g.hiddenReplies = {}
    time: (e) ->
      $.setValue 'time', @value
      time.foo()
      time.date = new Date()
      $('#timePreview').textContent = time.funk time

cooldown =
  init: ->
    cooldown.start() if Date.now() < $.getValue g.BOARD+'/cooldown', 0
    $.bind window, 'storage', (e) -> cooldown.start() if e.key is "AEOS.4chan_x.#{g.BOARD}/cooldown"

  start: ->
    cooldown.duration = Math.ceil ($.getValue(g.BOARD+'/cooldown', 0) - Date.now()) / 1000
    for submit in $$ '#com_submit'
      submit.value = cooldown.duration
      submit.disabled = true
    cooldown.interval = window.setInterval cooldown.cb, 1000

  cb: ->
    cooldown.duration--

    for submit in $$ '#com_submit'
      if cooldown.duration
        submit.value = cooldown.duration
      else
        submit.disabled = false
        submit.value = 'Submit'
        $('#qr_form').submit() if $('#auto')?.checked

    window.clearInterval cooldown.interval unless cooldown.duration

qr =
  init: ->
    g.callbacks.push qr.cb.node
    iframe = $.el 'iframe',
      name: 'iframe'
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
      {data} = e
      dialog = $ '#qr'
      if data # error message
        $('#error').textContent = data
        qr.autohide.unset()
      else # success
        if dialog
          if g.REPLY and $.config 'Persistent QR'
            qr.refresh dialog
          else
            $.rm dialog
        if $.config 'Cooldown'
          duration = if qr.sage then 60 else 30
          $.setValue g.BOARD+'/cooldown', Date.now() + duration * 1000
          cooldown.start()

      Recaptcha.reload()
      $('iframe[name=iframe]').src = 'about:blank'

    node: (root) ->
      quote = $ 'a.quotejs:not(:first-child)', root
      $.bind quote, 'click', qr.cb.quote

    submit: (e) ->
      form = @
      isQR = form.parentNode.id == 'qr'

      if $.config('Auto Watch Reply') and $.config('Thread Watcher')
        if g.REPLY and $('img.favicon').src is Favicon.empty
          watcher.watch null, g.THREAD_ID
        else
          id = $('input[name=resto]').value
          op = d.getElementById id
          if $('img.favicon', op).src is Favicon.empty
            watcher.watch op, id

      if isQR
        $('#error').textContent = ''

      qr.sage = $('input[name=email]', form).value == 'sage'
      if isQR
        qr.autohide.set()

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
    # XXX file.value = '' doesn't work in opera
    f = $('input[type=file]', dialog).parentNode
    f.innerHTML = f.innerHTML

  dialog: (link) ->
    #maybe should be global
    MAX_FILE_SIZE = $('input[name="MAX_FILE_SIZE"]').value
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
        <input type=hidden name=MAX_FILE_SIZE value=#{MAX_FILE_SIZE}>
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
      if thread is '0'
        window.location = "http://boards.4chan.org/#{g.BOARD}/res/#{id}#watch"
      else
        window.location = "http://boards.4chan.org/#{g.BOARD}/res/#{thread}##{id}"

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
    if thread.className.indexOf('stub') != -1 or thread.style.display is 'none'
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
    html  = "<div class=move><span id=count></span> <span id=timer>-#{$.config 'Interval'}</span></div>"
    conf = config.updater.checkbox
    for name of conf
      title = conf[name][1]
      checked = if $.config name then "checked" else ""
      html += "<div><label title=\"#{title}\">#{name}<input name=\"#{name}\" #{checked} type=checkbox></label></div>"

    name = 'Auto Update This'
    title = 'Controls whether *this* thread auotmatically updates or not'
    checked = if $.config 'Auto Update' then 'checked' else ''
    html += "<div><label title=\"#{title}\">#{name}<input name=\"#{name}\" #{checked} type=checkbox></label></div>"

    html += "<div><label>Interval (s)<input name=Interval value=#{$.config 'Interval'} type=text></label></div>"
    html += "<div><input value=\"Update Now\" type=button></div>"

    dialog = ui.dialog 'updater', bottom: '0px', right: '0px', html

    for input in $$ 'input[type=checkbox]', dialog
      $.bind input, 'click', $.cb.checked
    $.bind $('input[type=text]', dialog), 'change', $.cb.value

    verbose = $ 'input[name=\"Verbose\"]',          dialog
    autoUpT = $ 'input[name=\"Auto Update This\"]', dialog
    interva = $ 'input[name=\"Interval\"]', dialog
    updNow  = $ 'input[type=button]', dialog
    $.bind verbose, 'click', updater.cb.verbose
    $.bind autoUpT, 'click', updater.cb.autoUpdate
    $.bind updNow,  'click', updater.updateNow

    $.append d.body, dialog

    updater.cb.verbose.call    verbose
    updater.cb.autoUpdate.call autoUpT

  cb:
    verbose: (e) ->
      count = $ '#count'
      timer = $ '#timer'
      if @checked
        count.textContent = '+0'
        $.show timer
      else
        $.extend count,
          className: ''
          textContent: 'Thread Updater'
        $.hide timer
    autoUpdate: (e) ->
      if @checked
        updater.intervalID = window.setInterval updater.timeout, 1000
      else
        window.clearInterval updater.intervalID
    update: (e) ->
      count = $ '#count'
      timer = $ '#timer'

      if @status is 404
        count.textContent = 404
        count.className = 'error'
        timer.textContent = ''
        window.clearInterval updater.intervalID
        for input in $$ 'input[type=submit]'
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

      timer.textContent = '-' + $.config 'Interval'
      if $.config 'Verbose'
        count.textContent = '+' + arr.length
        if arr.length is 0
          count.className = ''
        else
          count.className = 'new'

      #XXX add replies in correct order so /b/acklinks resolve
      while reply = arr.pop()
        $.before br, reply

  timeout: ->
    timer = $ '#timer'
    n = Number timer.textContent
    n += 1

    if n == 10
      count = $ '#count'
      count.textContent = 'retry'
      count.className = ''
      n = 0

    timer.textContent = n

    if n == 0
      updater.update()

  updateNow: ->
    $('#timer').textContent = 0
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

    $.bind window, 'storage', (e) -> watcher.refresh() if e.key is 'AEOS.4chan_x.watched'

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
    g.callbacks.push anonymize.cb.node
  cb:
    node: (root) ->
      name = $ 'span.commentpostername, span.postername', root
      name.textContent = 'Anonymous'
      if trip = $ 'span.postertrip', root
        if trip.parentNode.nodeName is 'A'
          $.rm trip.parentNode
        else
          $.rm trip

sauce =
  init: ->
    g.callbacks.push sauce.cb.node
  cb:
    node: (root) ->
      return if root.className is 'inline'
      prefixes = (s for s in ($.config('flavors').split '\n') when s[0] != '#')
      names = (prefix.match(/(\w+)\./)[1] for prefix in prefixes)
      if span = $ 'span.filesize', root
        suffix = $('a', span).href
        for prefix, i in prefixes
          link = $.el 'a',
            textContent: names[i]
            href: prefix + suffix
          $.append span, $.tn(' '), link

time =
  init: ->
    time.foo()
    g.callbacks.push (root) ->
      return if root.className is 'inline'
      s = $('span[id^=no]', root).previousSibling
      [_, month, day, year, hour, min] =
        s.textContent.match /(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\d+)/
      year = "20#{year}"
      month -= 1 #months start at 0
      hour = g.chanOffset + Number hour
      time.date = new Date year, month, day, hour, min
      #XXX /b/ will have seconds cut off

      timeEl = $.el 'time',
        textContent: ' ' + time.funk(time) + ' '
      $.replace s, timeEl

  foo: ->
    code = $.config('time').replace /%([A-Za-z])/g, (s, c) ->
      switch c
        when 'a', 'd', 'H', 'm', 'M', 'p', 'P', 'y' then "' + time.#{c}() + '"
        else s
    time.funk = Function 'time', "return '#{code}'"

  zeroPad: (n) -> if n < 10 then '0' + n else n
  a: -> [
    'Sun'
    'Mon'
    'Tue'
    'Wed'
    'Thu'
    'Fri'
    'Sat'
  ][@date.getDay()]
  d: -> @zeroPad @date.getDate()
  H: -> @zeroPad @date.getHours()
  I: -> @zeroPad @date.getHours() % 12 or 12
  m: -> @zeroPad @date.getMonth() + 1
  M: -> @zeroPad @date.getMinutes()
  p: -> if @date.getHours() < 12 then 'AM' else 'PM'
  P: -> if @date.getHours < 12 then 'am' else 'pm'
  y: -> @date.getFullYear() - 2000

titlePost =
  init: ->
    if tc = $('span.filetitle').textContent or $('blockquote').textContent
      d.title = "/#{g.BOARD}/ - #{tc}"

quoteBacklink =
  init: ->
    g.callbacks.push quoteBacklink.node
  node: (root) ->
    return if /inline/.test root.className
    container = $.el 'span',
      className: 'container'
    $.after $('span[id^=no]', root), container
    id = root.id or $('td[id]', root).id
    quotes = {}
    tid = g.THREAD_ID or root.parentNode.firstChild.id
    opbl = $.config 'OP Backlinks'
    for quote in $$ 'a.quotelink', root
      continue unless qid = quote.hash[1..]
      #don't backlink the op
      continue if !opbl and qid is tid
      #duplicate quotes get overwritten
      quotes[qid] = quote
    for qid, quote of quotes
      continue unless el = d.getElementById qid
      link = $.el 'a',
        href: '#'+id
        className: 'backlink'
        textContent: '>>'+id
      if $.config 'Quote Preview'
        $.bind link, 'mouseover', quotePreview.mouseover
        $.bind link, 'mousemove', ui.hover
        $.bind link, 'mouseout',  ui.hoverend
        $.bind link, 'mouseout',  quotePreview.mouseout
      if $.config 'Quote Inline'
        $.bind link, 'click', quoteInline.toggle
      $.append $('.container', el), $.tn(' '), link

quoteInline =
  init: ->
    g.callbacks.push quoteInline.node
  node: (root) ->
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
      if @className is 'backlink'
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
    $.hide preview
    $.append d.body, preview
  node: (root) ->
    for quote in $$ 'a.quotelink, a.backlink', root
      continue unless quote.hash
      $.bind quote, 'mouseover', quotePreview.mouseover
      $.bind quote, 'mousemove', ui.hover
      $.bind quote, 'mouseout',  ui.hoverend
      $.bind quote, 'mouseout',  quotePreview.mouseout
  mouseout: ->
    $.removeClass el, 'qphl' if el = d.getElementById @hash[1..]
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
    $.show qp
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

quoteOP =
  init: ->
    g.callbacks.push quoteOP.node
  node: (root) ->
    return if root.className is 'inline'
    tid = g.THREAD_ID or $.x('ancestor::div[contains(@class,"thread")]/div', root).id
    for quote in $$ 'a.quotelink', root
      if quote.hash[1..] is tid
        quote.innerHTML += '&nbsp;(OP)'

reportButton =
  init: ->
    g.callbacks.push reportButton.cb.node
  cb:
    node: (root) ->
      if not a = $ 'a.reportbutton', root
        span = $ 'span[id^=no]', root
        a = $.el 'a',
          className: 'reportbutton'
          innerHTML: '[&nbsp;!&nbsp;]'
        $.after span, a
        $.after span, $.tn(' ')
      $.bind a, 'click', reportButton.cb.report
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
    $.append d.body, dialog
    g.callbacks.push threadStats.node
  node: (root) ->
    return if root.className
    threadStats.posts++
    if $ 'img[md5]', root
      threadStats.images++
      if threadStats.images > 150
        $('#imagecount').className = 'error'
    $('#postcount').textContent = threadStats.posts
    $('#imagecount').textContent = threadStats.images

unread =
  init: ->
    unread.replies = []
    d.title = '(0) ' + d.title
    $.bind window, 'scroll', unread.cb.scroll
    g.callbacks.push unread.cb.node

  cb:
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
    when 'a', 'g', 'lit', 'sci', 'tv'
      url = "http://green-oval.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when 'jp', 'm', 'tg'
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
    recaptcha = $ '#recaptcha_response_field'
    $.bind recaptcha, 'keydown', Recaptcha.listener
  listener: (e) ->
    if e.keyCode is 8 and @value is ''
      Recaptcha.reload()
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
    $.hide img
    $.append d.body, img
    g.callbacks.push imageHover.cb.node
  cb:
    node: (root) ->
      return unless thumb = $ 'img[md5]', root
      $.bind thumb, 'mouseover', imageHover.cb.mouseover
      $.bind thumb, 'mousemove', ui.hover
      $.bind thumb, 'mouseout',  ui.hoverend
    mouseover: (e) ->
      el = $ '#iHover'
      el.src = null
      el.src = @parentNode.href
      ui.el = el
      $.show el

imgPreloading =
  init: ->
    g.callbacks.push (root) ->
      thumbs = $$ 'img[md5]', root
      for thumb in thumbs
        parent = thumb.parentNode
        el = $.el 'img', src: parent.href

imgGif =
  init: ->
    g.callbacks.push (root) ->
      thumbs = $$ 'img[md5]', root
      for thumb in thumbs
        src = thumb.parentNode.href
        if /gif$/.test src
          thumb.src = src

imgExpand =
  init: ->
    g.callbacks.push imgExpand.cb.node
    imgExpand.dialog()
    $.bind window, 'resize', imgExpand.resize
    imgExpand.resize()

  cb:
    node: (root) ->
      return unless thumb = $ 'img[md5]', root
      a = thumb.parentNode
      $.bind a, 'click', imgExpand.cb.toggle
      if imgExpand.on then imgExpand.toggle a
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.button isnt 0
      e.preventDefault()
      imgExpand.toggle @
    all: (e) ->
      thumbs = $$ 'img[md5]'
      imgExpand.on = @checked
      if imgExpand.on #expand
        for thumb in thumbs
          unless thumb.style.display #thumbnail hidden, image already expanded
            imgExpand.expand thumb
      else #contract
        for thumb in thumbs
          if thumb.style.display #thumbnail hidden - unhide it
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
    if thumb.style.display
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
      img.setAttribute 'style', "max-width: -moz-calc(#{max}px);"
    a.appendChild img

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

#main
NAMESPACE = 'AEOS.4chan_x.'
g =
  callbacks: []

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

    if form = $ 'form[name=post]'
      Recaptcha.init()
      $.bind form, 'submit', qr.cb.submit

    #major features
    if $.config 'Cooldown'
      cooldown.init()

    if $.config 'Image Expansion'
      imgExpand.init()

    if $.config 'Image Auto-Gif'
      imgGif.init()

    if $.config 'Time Formatting'
      time.init()

    if $.config 'Sauce'
      sauce.init()

    if $.config 'Anonymize'
      anonymize.init()

    if $.config 'Image Hover'
      imageHover.init()

    if $.config 'Reply Hiding'
      replyHiding.init()

    if form and $.config 'Quick Reply'
      qr.init()

    if $.config 'Quote Backlinks'
      quoteBacklink.init()

    if $.config 'Quote Inline'
      quoteInline.init()

    if $.config 'Quote Preview'
      quotePreview.init()

    if $.config 'Indicate OP quote'
      quoteOP.init()

    if $.config 'Report Button'
      reportButton.init()

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

      if $.config('Auto Watch') and $.config('Thread Watcher') and
        location.hash is '#watch' and $('img.favicon').src is Favicon.empty
          watcher.watch null, g.THREAD_ID

    else #not reply
      if $.config 'Thread Hiding'
        threadHiding.init()

      if $.config 'Thread Navigation'
        nav.init()

      if $.config 'Thread Expansion'
        expandThread.init()

      if $.config 'Comment Expansion'
        expandComment.init()

    for op in $$ 'div.op'
      for callback in g.callbacks
        callback op
    for reply in $$ 'td[id]'
      table = reply.parentNode.parentNode.parentNode
      for callback in g.callbacks
        callback table
    $.bind d.body, 'DOMNodeInserted', nodeInserted
    options.init()

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

      img[md5] + img {
        float: left;
      }
      body.fitwidth img[md5] + img {
        max-width: 100%;
      }
      body.fitwidth table img[md5] + img {
        width: -moz-calc(100%); /* hack so only firefox sees this */
      }

      iframe {
        display: none;
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

      #options {
        position: fixed;
        padding: 5px;
      }
      #options .move, #credits {
        text-align: right;
      }
      #options ul {
        list-style: none;
        padding: 0;
      }
      #floaty {
        float: left;
      }
      #options textarea {
        height: 100px;
        width: 100%;
      }
      #options #main {
        overflow: auto;
        height: 500px;
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
    '

main.init()
