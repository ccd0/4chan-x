config =
  main:
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
    Hiding:
      'Reply Hiding':       [true,  'Hide single replies']
      'Thread Hiding':      [true,  'Hide entire threads']
      'Show Stubs':         [true,  'Of hidden threads / replies']
    Imaging:
      'Image Auto-Gif':     [false, 'Animate gif thumbnails']
      'Image Expansion':    [true,  'Expand images']
      'Image Hover':        [false, 'Show full image on mouseover']
      'Image Preloading':   [false, 'Preload Images']
      'Sauce':              [true,  'Add sauce to images']
      'Reveal Spoilers':    [false, 'Replace spoiler thumbnails by the original thumbnail']
    Monitoring:
      'Thread Updater':     [true,  'Update threads. Has more options in its own dialog.']
      'Unread Count':       [true,  'Show unread post count in tab title']
      'Post in Title':      [true,  'Show the op\'s post in the tab title']
      'Thread Stats':       [true,  'Display reply and image count']
      'Thread Watcher':     [true,  'Bookmark threads']
      'Auto Watch':         [true,  'Automatically watch threads that you start']
      'Auto Watch Reply':   [false, 'Automatically watch threads that you reply to']
    Posting:
      'Auto Noko':          [true,  'Always redirect to your post']
      'Cooldown':           [true,  'Prevent \'flood detected\' errors']
      'Quick Reply':        [true,  'Reply without leaving the page']
      'Persistent QR':      [false, 'Quick reply won\'t disappear after posting. Only in replies.']
      'Auto Hide QR':       [true,  'Automatically auto-hide the quick reply when posting']
      'Remember Spoiler':   [false, 'Remember the spoiler state, instead of resetting after posting']
    Quoting:
      'Quote Backlinks':    [true,  'Add quote backlinks']
      'OP Backlinks':       [false, 'Add backlinks to the OP']
      'Quote Highlighting': [true,  'Highlight the previewed post']
      'Quote Inline':       [true,  'Show quoted post inline on quote click']
      'Quote Preview':      [true,  'Show quote content on hover']
      'Indicate OP quote':  [true,  'Add \'(OP)\' to OP quotes']
  flavors: [
    'http://regex.info/exif.cgi?url='
    'http://iqdb.org/?url='
    'http://google.com/searchbyimage?image_url='
    '#http://tineye.com/search?url='
    '#http://saucenao.com/search.php?db=999&url='
    '#http://imgur.com/upload?url='
    '#http://anonym.to/?'
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M'
  backlink: '>>%id'
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
    unreadCountTo0:  'z'
  updater:
    checkbox:
      'Scrolling':    [false, 'Scroll updated posts into view. Only enabled at bottom of page.']
      'Scroll BG':    [false, 'Scroll background tabs']
      'Verbose':      [true,  'Show countdown timer, new post count']
      'Auto Update':  [true,  'Automatically fetch new posts']
    'Interval': 30

# XXX chrome can't into `{log} = console`
if console?
  log = ->
    console.log arguments...

# XXX opera cannot into Object.keys
if not Object.keys
  Object.keys = (o) ->
    key for key in o

# flatten the config
conf = {}
((parent, obj) ->
  if obj.length #array
    if typeof obj[0] is 'boolean'
      conf[parent] = obj[0]
    else
      conf[parent] = obj
  else if typeof obj is 'object'
    for key, val of obj
      arguments.callee key, val
  else #constant
    conf[parent] = obj
) null, config

NAMESPACE = 'AEOS.4chan_x.'
SECOND = 1000
MINUTE = 60*SECOND
HOUR   = 60*MINUTE
DAY    = 24*HOUR
d = document
g = callbacks: []

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
    {style} = el
    style.top    = top
    style.right  = right
    style.bottom = bottom
    style.left   = left
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
    {style} = el
    {clientHeight, clientWidth} = d.body
    height = el.offsetHeight

    top = clientY - 120
    style.top =
      if clientHeight < height or top < 0
        0
      else if top + height > clientHeight
        clientHeight - height
      else
        top

    if clientX < clientWidth - 400
      style.left  = clientX + 45
      style.right = null
    else
      style.left  = null
      style.right = clientWidth - clientX + 45

  hoverend: (e) ->
    ui.el.parentNode.removeChild ui.el

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
  object

$.extend $,
  id: (id) ->
    d.getElementById id
  globalEval: (code) ->
    script = $.el 'script',
      textContent: "(#{code})()"
    $.append d.head, script
    $.rm script
  xhr: (url, cb) ->
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
      req = $.xhr url, (-> cb.call @ for cb in @callbacks)
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
    $.append d.head, style
    style
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
    el.classList.add className
  removeClass: (el, className) ->
    el.classList.remove className
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

    #month is 10
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
    delete: (name) ->
      name = NAMESPACE + name
      GM_deleteValue name
    get: (name, defaultValue) ->
      name = NAMESPACE + name
      if value = GM_getValue name
        JSON.parse value
      else
        defaultValue
    openInTab: (url) ->
      GM_openInTab url
    set: (name, value) ->
      name = NAMESPACE + name
      # for `storage` events
      localStorage[name] = JSON.stringify value
      GM_setValue name, JSON.stringify value
else
  $.extend $,
    delete: (name) ->
      name = NAMESPACE + name
      delete localStorage[name]
    get: (name, defaultValue) ->
      name = NAMESPACE + name
      if value = localStorage[name]
        JSON.parse value
      else
        defaultValue
    openInTab: (url) ->
      window.open url, "_blank"
    set: (name, value) ->
      name = NAMESPACE + name
      localStorage[name] = JSON.stringify value

#load values from localStorage
for key, val of conf
  conf[key] = $.get key, val

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
    for quote in $$ 'a.quotelink', bq
      if quote.getAttribute('href') is quote.hash
        quote.pathname = "/#{g.BOARD}/res/#{threadID}"
      if conf['Quote Preview']
        $.bind quote, 'mouseover', quotePreview.mouseover
        $.bind quote, 'mousemove', ui.hover
        $.bind quote, 'mouseout',  quotePreview.mouseout
      if conf['Quote Inline']
        $.bind quote, 'click', quoteInline.toggle
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
          $.rm backlink if !$.id backlink.hash[1..]


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

    for reply in $$ 'td[id]', body
      for quote in $$ 'a.quotelink', reply
        if quote.getAttribute('href') is quote.hash
          quote.pathname = pathname
      link = $ 'a.quotejs', reply
      link.href = "res/#{thread.firstChild.id}##{reply.id}"
      link.nextSibling.href = "res/#{thread.firstChild.id}#q#{reply.id}"
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

    if conf['Show Stubs']
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
    $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

  show: (table) ->
    $.show table

    id = $('td[id]', table).id
    delete g.hiddenReplies[id]
    $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

keybinds =
  init: ->
    for node in $$ '[accesskey]'
      node.removeAttribute 'accesskey'
    $.bind d, 'keydown',  keybinds.keydown

  keydown: (e) ->
    updater.focus = true
    return if e.target.nodeName in ['TEXTAREA', 'INPUT'] and not e.altKey and not e.ctrlKey and not (e.keyCode is 27)
    return unless key = keybinds.keyCode e

    thread = nav.getThread()
    switch key
      when conf.close
        if o = $ '#overlay'
          $.rm o
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
      when conf.openQR
        keybinds.qr thread, true
      when conf.expandImages
        keybinds.img thread
      when conf.nextThread
        nav.next()
      when conf.openThreadTab
        keybinds.open thread, true
      when conf.previousThread
        nav.prev()
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
        if qr.el
          qr.submit.call $ 'form', qr.el
        else
          $('.postarea form').submit()
      when conf.unreadCountTo0
        unread.replies.length = 0
        unread.updateTitle()
        Favicon.update()
      else
        return
    e.preventDefault()

  keyCode: (e) ->
    kc = e.keyCode
    if 65 <= kc <= 90 #A-Z
      key = String.fromCharCode kc
      if !e.shiftKey
        key = key.toLowerCase()
    else if 48 <= kc <= 57 #0-9
      key = String.fromCharCode kc
    else if kc is 27
      key = 'Esc'
    else if kc is 8
      key = ''
    else
      key = null
    if key
      if e.altKey  then key = 'alt+' + key
      if e.ctrlKey then key = 'ctrl+' + key
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
      qr.quote.call qrLink
    else
      unless qr.el
        qr.dialog qrLink
      $('textarea', qr.el).focus()

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
    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length
    html = "
      <div class='reply dialog'>
        <div id=optionsbar>
          <div id=floaty>
            <label for=main_tab>main</label> | <label for=flavors_tab>sauce</label> | <label for=rice_tab>rice</label> | <label for=keybinds_tab>keybinds</label>
          </div>
          <div id=credits>
            <a href=http://aeosynth.github.com/4chan-x/>4chan X</a> |
            <a href=http://chat.now.im/x/aeos>support throd</a> |
            <a href=https://github.com/aeosynth/4chan-x/issues>github</a> |
            <a href=https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2DBVZBUAM4DHC&lc=US&item_name=Aeosynth&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted>donate</a>
          </div>
        </div>
        <hr>
        <div id=content>
          <input type=radio name=tab hidden id=main_tab checked>
          <div id=main></div>
          <input type=radio name=tab hidden id=flavors_tab>
          <textarea name=flavors id=flavors>#{conf['flavors']}</textarea>
          <input type=radio name=tab hidden id=rice_tab>
          <div id=rice>
            <div><input type=text name=backlink value='#{conf['backlink']}'> : <span id=backlinkPreview></span></div>
            <div><input type=text name=time value='#{conf['time']}'> : <span id=timePreview></span></div>
            <div>Supported <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:
              <ul>
                <li>Day: %a, %A, %d, %e</li>
                <li>Month: %m, %b, %B</li>
                <li>Year: %y</li>
                <li>Hour: %k, %H, %l (lowercase L), %I (uppercase i)</li>
                <li>Month: %M, %p, %P</li>
              </ul>
            </div>
          </div>
          <input type=radio name=tab hidden id=keybinds_tab>
          <div id=keybinds>
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
                <tr><td>Reset the unread count to 0</td><td><input type=text name=unreadCountTo0></td></tr>
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
        checked = if conf[key] then "checked" else ""
        description = arr[1]
        li = $.el 'li',
          innerHTML: "<label><input type=checkbox name='#{key}' #{checked}>#{key}</label><span class=description>: #{description}</span>"
        $.bind $('input', li), 'click', $.cb.checked
        $.append ul, li
      $.append main, ul
    li = $.el 'li',
      innerHTML: "<button>hidden: #{hiddenNum}</button> <span class=description>: Forget all hidden posts. Useful if you accidentally hide a post and have `show stubs` disabled."
    $.append hidingul, li
    $.bind $('button', li), 'click', options.clearHidden

    $.bind $('#flavors', dialog), 'change', $.cb.value
    $.bind $('input[name=time]', dialog), 'keyup', options.time
    $.bind $('input[name=backlink]', dialog), 'keyup', options.backlink
    for input in $$ '#keybinds input', dialog
      input.value = conf[input.name]
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
    options.backlink.call $('input[name=backlink]', dialog)

    $.bind overlay, 'click', -> $.rm overlay
    $.bind dialog.firstElementChild, 'click', (e) -> e.stopPropagation()

  clearHidden: (e) ->
    #'hidden' might be misleading; it's the number of IDs we're *looking* for,
    # not the number of posts actually hidden on the page.
    $.delete "hiddenReplies/#{g.BOARD}/"
    $.delete "hiddenThreads/#{g.BOARD}/"
    @textContent = "hidden: 0"
    g.hiddenReplies = {}
  keybind: (e) ->
    e.preventDefault()
    e.stopPropagation()
    return unless (key = keybinds.keyCode e)?
    @value = key
    $.set @name, key
    conf[@name] = key
  time: (e) ->
    $.set 'time', @value
    conf['time'] = @value
    Time.foo()
    Time.date = new Date()
    $('#timePreview').textContent = Time.funk Time
  backlink: (e) ->
    $.set 'backlink', @value
    conf['backlink'] = @value
    $('#backlinkPreview').textContent = conf['backlink'].replace /%id/, '123456789'

cooldown =
  #TODO merge into qr
  init: ->
    if match = location.search.match /cooldown=(\d+)/
      [_, time] = match
      $.set g.BOARD+'/cooldown', time if $.get(g.BOARD+'/cooldown', 0) < time
    cooldown.start() if Date.now() < $.get g.BOARD+'/cooldown', 0
    $.bind window, 'storage', (e) -> cooldown.start() if e.key is "#{NAMESPACE}#{g.BOARD}/cooldown"
    $('.postarea form').action += '?cooldown' if g.REPLY

  start: ->
    cooldown.duration = Math.ceil ($.get(g.BOARD+'/cooldown', 0) - Date.now()) / 1000
    return unless cooldown.duration > 0
    for submit in $$ '#com_submit'
      submit.value = cooldown.duration
      submit.disabled = true
    setTimeout cooldown.cb, 1000

  cb: ->
    submits = $$ '#com_submit'
    if --cooldown.duration
      setTimeout cooldown.cb, 1000
      for submit in submits
        submit.value = cooldown.duration
    else
      for submit in submits
        submit.disabled = false
        submit.value = 'Submit'
      qr.autoPost()

qr =
  # TODO
  # error handling / logging
  # persistent captcha
  # rm Recaptcha
  # email reverts
  init: ->
    g.callbacks.push qr.node
    $.bind window, 'message', qr.message
    $.bind $('#recaptcha_challenge_field_holder'), 'DOMNodeInserted', qr.captchaNode
    qr.captchaTime = Date.now()

    qr.spoiler = if $('.postarea label') then '<label> [<input type=checkbox name=spoiler>Spoiler Image?]</label>' else ''
    qr.acceptFiles = $('.rules').textContent.match(/: (.+) /)[1].replace /\w+/g, (type) ->
      switch type
        when 'JPG'
          'image/JPEG'
        when 'PDF'
          'application/' + type
        else
          'image/' + type

    iframe = $.el 'iframe',
      name: 'iframe'
      hidden: true
    $.append d.body, iframe

    #hack - nuke id so it doesn't grab focus when reloading
    $('#recaptcha_response_field').id = ''

  attach: ->
    fileDiv = $.el 'div', innerHTML: "<input type=file name=upfile accept='#{qr.acceptFiles}'><a>X</a>"
    $.bind fileDiv.firstChild, 'change', qr.validateFileSize
    $.bind fileDiv.lastChild, 'click', (-> $.rm @parentNode)
    $.append $('#files', qr.el), fileDiv

  attachNext: ->
    fileDiv = $.rm $('#files div', qr.el)
    file = fileDiv.firstChild
    oldFile = $ '#qr_form input[type=file]', qr.el
    $.replace oldFile, file

  autoPost: ->
    if qr.el and $('#auto', qr.el).checked
      qr.submit.call $ 'form', qr.el

  captchaNode: (e) ->
    return unless qr.el
    val = e.target.value
    $('img', qr.el).src = "http://www.google.com/recaptcha/api/image?c=" + val
    qr.challenge = val
    qr.captchaTime = Date.now()

  captchaKeydown: (e) ->
    return unless e.keyCode is 13 and @value #enter, captcha filled

    captchas = $.get 'captchas', []
    captchas.push
      challenge: qr.challenge
      response: @value
      time: qr.captchaTime
    $.set 'captchas', captchas
    $('#captchas', qr.el).textContent = captchas.length + ' captchas'
    Recaptcha.reload()
    @value = ''

    if !$('textarea', qr.el).value and !$('input[type=file]', qr.el).files.length
      e.preventDefault()

  close: ->
    $.rm qr.el
    qr.el = null

  dialog: (link) ->
    c = d.cookie
    name  = if m = c.match(/4chan_name=([^;]+)/)  then decodeURIComponent m[1] else ''
    email = if m = c.match(/4chan_email=([^;]+)/) then decodeURIComponent m[1] else ''
    pwd   = if m = c.match(/4chan_pass=([^;]+)/)  then decodeURIComponent m[1] else $('input[name=pwd]').value
    submitValue = $('#com_submit').value
    submitDisabled = if $('#com_submit').disabled then 'disabled' else ''
    #FIXME inlined cross-thread quotes
    THREAD_ID = g.THREAD_ID or $.x('ancestor::div[@class="thread"]/div', link).id
    qr.challenge = $('#recaptcha_challenge_field').value

    html = "
      <a id=close title=close>X</a>
      <input type=checkbox id=autohide title=autohide>
      <div class=move>
        <input class=inputtext type=text name=name value='#{name}' placeholder=Name form=qr_form>
        Quick Reply
      </div>
      <div class=autohide>
        <form name=post action=http://sys.4chan.org/#{g.BOARD}/post method=POST enctype=multipart/form-data target=iframe id=qr_form>
          <input type=hidden name=resto value=#{THREAD_ID}>
          <input type=hidden name=mode value=regist>
          <input type=hidden name=recaptcha_challenge_field id=recaptcha_challenge_field>
          <input type=hidden name=recaptcha_response_field id=recaptcha_response_field>
          <div><input class=inputtext type=text name=email value='#{email}' placeholder=E-mail>#{qr.spoiler}</div>
          <div><input class=inputtext type=text name=sub placeholder=Subject><input type=submit value=#{submitValue} id=com_submit #{submitDisabled}><label><input type=checkbox id=auto>auto</label></div>
          <div><textarea class=inputtext name=com placeholder=Comment></textarea></div>
          <div><img src=http://www.google.com/recaptcha/api/image?c=#{qr.challenge}></div>
          <div><input class=inputtext type=text autocomplete=off placeholder=Verification id=dummy><span id=captchas>#{$.get('captchas', []).length} captchas</span></div>
          <div><input type=file name=upfile accept='#{qr.acceptFiles}'></div>
        </form>
        <div id=files></div>
        <div><input class=inputtext type=password name=pwd value='#{pwd}' placeholder=Password form=qr_form maxlength=8><a id=attach>attach another file</a></div>
      </div>
      <a id=error class=error></a>
      "
    qr.el = ui.dialog 'qr', top: '0px', left: '0px', html

    $.bind $('input[name=name]',   qr.el), 'mousedown', (e) -> e.stopPropagation()
    $.bind $('input[name=upfile]', qr.el), 'change', qr.validateFileSize
    $.bind $('#close',             qr.el), 'click', qr.close
    $.bind $('form',               qr.el), 'submit', qr.submit
    $.bind $('#attach',            qr.el), 'click', qr.attach
    $.bind $('img',                qr.el), 'click', Recaptcha.reload
    $.bind $('#dummy',             qr.el), 'keydown', Recaptcha.listener
    $.bind $('#dummy',             qr.el), 'keydown', qr.captchaKeydown

    $.append d.body, qr.el

  message: (e) ->
    $('iframe[name=iframe]').src = 'about:blank'
    fileCount = $('#files', qr.el).childElementCount

    {data} = e
    if data # error message
      data = JSON.parse data
      $.extend $('#error', qr.el), data
      $('#recaptcha_response_field', qr.el).value = ''
      $('#autohide', qr.el).checked = false
      if data.textContent is 'You seem to have mistyped the verification.'
        setTimeout qr.autoPost, 1000
      else if data.textContent is 'Error: Duplicate file entry detected.' and fileCount
        $('textarea', qr.el).value += '\n' + data.textContent + ' ' + data.href
        qr.attachNext()
        setTimeout qr.autoPost, 1000
      return

    if qr.el
      if g.REPLY and (conf['Persistent QR'] or fileCount)
        qr.refresh()
        if fileCount
          qr.attachNext()
      else
        qr.close()
    if conf['Cooldown']
      duration = if qr.sage then 60 else 30
      $.set g.BOARD+'/cooldown', Date.now() + duration * 1000
      cooldown.start()

  node: (root) ->
    quote = $ 'a.quotejs:not(:first-child)', root
    $.bind quote, 'click', qr.quote

  postInvalid: ->
    content = $('textarea', qr.el).value or $('input[type=file]', qr.el).files.length
    return 'Error: No text entered.' unless content

    ###
    captchas expire after 5 hours (emperically verified). cutoff 5 minutes
    before then, b/c posting takes time.
    ###

    cutoff = Date.now() - 5*HOUR + 5*MINUTE
    captchas = $.get 'captchas', []
    while captcha = captchas.shift()
      if captcha.time > cutoff
        break
    $.set 'captchas', captchas

    $('#captchas', qr.el).textContent = captchas.length + ' captchas'

    unless captcha
      dummy = $ '#dummy', qr.el
      return 'You forgot to type in the verification' unless response = dummy.value
      captcha =
        challenge: qr.challenge
        response: response
      dummy.value = ''
      Recaptcha.reload()

    $('#recaptcha_challenge_field', qr.el).value = captcha.challenge
    $('#recaptcha_response_field',  qr.el).value = captcha.response

    false

  quote: (e) ->
    e.preventDefault() if e

    if qr.el
      $('#autohide', qr.el).checked = false
    else
      qr.dialog @

    id = @textContent
    text = ">>#{id}\n"

    selection = window.getSelection()
    if s = selection.toString()
      selectionID = $.x('preceding::input[@type="checkbox"][1]', selection.anchorNode)?.name
      if selectionID == id
        s = s.replace /\n/g, '\n>'
        text += ">#{s}\n"

    ta = $ 'textarea', qr.el
    ta.focus()
    ta.value += text

  refresh: ->
    $('[name=sub]', qr.el).value = ''
    $('[name=email]', qr.el).value = if m = d.cookie.match(/4chan_email=([^;]+)/) then decodeURIComponent m[1] else ''
    $('[name=com]', qr.el).value = ''
    $('[name=recaptcha_response_field]', qr.el).value = ''
    $('[name=spoiler]', qr.el)?.checked = false unless conf['Remember Spoiler']
    # XXX opera doesn't allow resetting file inputs w/ file.value = ''
    oldFile = $ '[type=file]', qr.el
    newFile = $.el 'input', type: 'file', name: 'upfile', accept: qr.acceptFiles
    $.replace oldFile, newFile

  submit: (e) ->
    #XXX `e` won't exist if we're here from `qr.submit.call form`.
    if msg = qr.postInvalid()
      e.preventDefault?()
      alert msg
      if msg is 'You forgot to type in the verification.'
        $('#dummy', qr.el).focus()
      return

    if conf['Auto Watch Reply'] and conf['Thread Watcher']
      if g.REPLY and $('img.favicon').src is Favicon.empty
        watcher.watch null, g.THREAD_ID
      else
        id = $('input[name=resto]', qr.el).value
        op = $.id id
        if $('img.favicon', op).src is Favicon.empty
          watcher.watch op, id

    if !e then @submit()
    $('#error', qr.el).textContent = ''
    $('#autohide', qr.el).checked = true if conf['Auto Hide QR']
    qr.sage = /sage/i.test $('input[name=email]', @).value

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
      if node = document.querySelector('table font b')?.firstChild
        {textContent, href} = node
        data = JSON.stringify {textContent, href}
      else
        data = ''
      parent.postMessage data, '*'

    c = $('b')?.lastChild

    return unless c and c.nodeType is 8 #comment node

    [_, thread, id] = c.textContent.match(/thread:(\d+),no:(\d+)/)

    {search} = location
    cooldown = /cooldown/.test search
    noko     = /noko/    .test search
    sage     = /sage/    .test search
    watch    = /watch/   .test search

    url = "http://boards.4chan.org/#{g.BOARD}"

    if watch and thread is '0'
      url += "/res/#{id}?watch"
    else if noko
      url += '/res/'
      url += if thread is '0' then id else thread
    if cooldown
      duration = Date.now() + (if sage then 60 else 30) * 1000
      url += '?cooldown=' + duration
    if noko
      url += '#' + id

    window.location = url

  validateFileSize: (e) ->
    return unless @files[0].size > $('input[name=MAX_FILE_SIZE]').value

    file = $.el 'input', type: 'file', name: 'upfile', accept: qr.acceptFiles
    $.bind file, 'change', qr.validateFileSize
    $.replace @, file

    $('#error', qr.el).textContent = 'Error: File too large.'
    alert 'Error: File too large.'

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
    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
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
    if thread.classList.contains('stub') or thread.hidden
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

    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    delete hiddenThreads[id]
    $.set "hiddenThreads/#{g.BOARD}/", hiddenThreads

updater =
  init: ->
    if conf['Scrolling']
      if conf['Scroll BG']
        updater.focus = true
      else
        $.bind window, 'focus', (-> updater.focus = true)
        $.bind window, 'blur',  (-> updater.focus = false)
    html = "<div class=move><span id=count></span> <span id=timer>-#{conf['Interval']}</span></div>"
    {checkbox} = config.updater
    for name of checkbox
      title = checkbox[name][1]
      checked = if conf[name] then 'checked' else ''
      html += "<div><label title='#{title}'>#{name}<input name='#{name}' type=checkbox #{checked}></label></div>"

    checked = if conf['Auto Update'] then 'checked' else ''
    html += "
      <div><label title='Controls whether *this* thread auotmatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox #{checked}></label></div>
      <div><label>Interval (s)<input name=Interval value=#{conf['Interval']} type=text></label></div>
      <div><input value='Update Now' type=button></div>"

    dialog = ui.dialog 'updater', bottom: '0', right: '0', html

    updater.count = $ '#count', dialog
    updater.timer = $ '#timer', dialog
    updater.br    = $ 'br[clear]'

    for input in $$ 'input', dialog
      if input.type is 'checkbox'
        $.bind input, 'click', $.cb.checked
        $.bind input, 'click', -> conf[@name] = @checked
        if input.name is 'Verbose'
          $.bind input, 'click', updater.cb.verbose
          updater.cb.verbose.call input
        else if input.name is 'Auto Update This'
          $.bind input, 'click', updater.cb.autoUpdate
          updater.cb.autoUpdate.call input
      else if input.name is 'Interval'
        $.bind input, 'change', -> conf['Interval'] = @value = parseInt(@value) or conf['Interval']
        $.bind input, 'change', $.cb.value
      else if input.type is 'button'
        $.bind input, 'click', updater.updateNow

    $.append d.body, dialog

  cb:
    verbose: ->
      if conf['Verbose']
        updater.count.textContent = '+0'
        $.show updater.timer
      else
        $.extend updater.count,
          className: ''
          textContent: 'Thread Updater'
        $.hide updater.timer
    autoUpdate: ->
      if @checked
        updater.timeoutID = setTimeout updater.timeout, 1000
      else
        clearTimeout updater.timeoutID
    update: ->
      if @status is 404
        updater.timer.textContent = ''
        updater.count.textContent = 404
        updater.count.className = 'error'
        clearTimeout updater.timeoutID
        for input in $$ '#com_submit'
          input.disabled = true
          input.value = 404
        # XXX Firefox - trailing spaces are trimmed
        d.title = d.title.match(/.+-/)[0] + ' ' + 404
        g.dead = true
        Favicon.update()
        return

      id = Number $('td[id]', updater.br.previousElementSibling)?.id or 0

      arr = []
      body = $.el 'body',
        innerHTML: @responseText
      replies = $$ '.reply', body
      while (reply = replies.pop()) and (reply.id > id)
        arr.push reply.parentNode.parentNode.parentNode #table

      scroll = conf['Scrolling'] && updater.focus && arr.length && (d.body.scrollHeight - d.body.clientHeight - window.scrollY < 20)

      updater.timer.textContent = '-' + conf['Interval']
      if conf['Verbose']
        updater.count.textContent = '+' + arr.length
        if arr.length is 0
          updater.count.className = ''
        else
          updater.count.className = 'new'

      #XXX add replies in correct order so backlinks resolve
      while reply = arr.pop()
        $.before updater.br, reply
      if scroll
        scrollTo 0, d.body.scrollHeight

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

    updater.timeoutID = setTimeout updater.timeout, 1000

  updateNow: ->
    updater.timer.textContent = 0
    updater.update()

  update: ->
    updater.request?.abort()
    url = location.pathname + '?' + Date.now() # fool the cache
    cb = updater.cb.update
    updater.request = $.xhr url, cb

watcher =
  init: ->
    html = '<div class=move>Thread Watcher</div>'
    watcher.dialog = ui.dialog 'watcher', top: '50px', left: '0px', html
    $.append d.body, watcher.dialog

    #add watch buttons
    inputs = $$ '.op input'
    for input in inputs
      favicon = $.el 'img',
        className: 'favicon'
      $.bind favicon, 'click', watcher.cb.toggle
      $.before input, favicon

    #populate watcher, display watch buttons
    watcher.refresh()

    $.bind window, 'storage', (e) -> watcher.refresh() if e.key is "#{NAMESPACE}watched"

  refresh: ->
    watched = $.get 'watched', {}
    for div in $$ 'div:not(.move)', watcher.dialog
      $.rm div
    for board of watched
      for id, props of watched[board]
        div = $.el 'div'
        x = $.el 'a',
          textContent: 'X'
        $.bind x, 'click', watcher.cb.x
        link = $.el 'a', props

        $.append div, x, $.tn(' '), link
        $.append watcher.dialog, div

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
    watched = $.get 'watched', {}
    delete watched[board][id]
    $.set 'watched', watched
    watcher.refresh()

  watch: (thread, id) ->
    props =
      href: "/#{g.BOARD}/res/#{id}"
      textContent: getTitle(thread)[...30]

    watched = $.get 'watched', {}
    watched[g.BOARD] or= {}
    watched[g.BOARD][id] = props
    $.set 'watched', watched
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
    sauce.prefixes = (s for s in (conf['flavors'].split '\n') when s[0] != '#')
    sauce.names = (prefix.match(/(\w+)\./)[1] for prefix in sauce.prefixes)
    g.callbacks.push (root) ->
      return if root.className is 'inline'
      if span = $ 'span.filesize', root
        suffix = $('a', span).href
        for prefix, i in sauce.prefixes
          link = $.el 'a',
            textContent: sauce.names[i]
            href: prefix + suffix
            target: '_blank'
          $.append span, $.tn(' '), link

revealSpoilers =
  init: ->
    g.callbacks.push (root) ->
      return if not (img = $ 'img[alt^=Spoiler]', root) or root.className is 'inline'
      img.removeAttribute 'height'
      img.removeAttribute 'width'
      [_, board, imgID] = img.parentNode.href.match /(\w+)\/src\/(\d+)/
      img.src = "http://0.thumbs.4chan.org/#{board}/thumb/#{imgID}s.jpg"

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
  el = $ 'span.filetitle', thread
  if not el.textContent
    el = $ 'blockquote', thread
    if not el.textContent
      el = $ 'span.postername', thread
  span = $.el 'span', innerHTML: el.innerHTML.replace /<br>/g, ' '
  "/#{g.BOARD}/ - #{span.textContent}"

titlePost =
  init: ->
    d.title = getTitle()

quoteBacklink =
  init: ->
    format = conf['backlink'].replace /%id/, "' + id + '"
    quoteBacklink.funk = Function 'id', "return'#{format}'"
    g.callbacks.push (root) ->
      return if /inline/.test root.className
      # op or reply
      id = root.id or $('td[id]', root).id
      quotes = {}
      for quote in $$ 'a.quotelink', root
        #don't process >>>/b/
        continue unless qid = quote.hash[1..]
        #duplicate quotes get overwritten
        quotes[qid] = quote
      for qid of quotes
        continue unless el = $.id qid
        #don't backlink the op
        continue if !conf['OP Backlinks'] and el.className is 'op'
        link = $.el 'a',
          href: "##{id}"
          className: 'backlink'
          textContent: quoteBacklink.funk id
        if conf['Quote Preview']
          $.bind link, 'mouseover', quotePreview.mouseover
          $.bind link, 'mousemove', ui.hover
          $.bind link, 'mouseout',  quotePreview.mouseout
        if conf['Quote Inline']
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
    return if e.shiftKey or e.altKey or e.ctrlKey or e.button isnt 0

    e.preventDefault()
    id = @hash[1..]
    if table = $ "#i#{id}", $.x 'ancestor::td[1]', @
      $.rm table
      $.removeClass @, 'inlined'
      for inlined in $$ 'input', table
        if hidden = $.id inlined.name
          $.show $.x 'ancestor::table[1]', hidden
      return
    root = if @parentNode.nodeName is 'FONT' then @parentNode else if @nextSibling then @nextSibling else @
    if el = $.id id
      inline = quoteInline.table id, el.innerHTML
      if @className is 'backlink'
        return if $("a.backlink[href='##{id}']", el)
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
    return unless inline.parentNode

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
    g.callbacks.push (root) ->
      for quote in $$ 'a.quotelink, a.backlink', root
        continue unless quote.hash
        $.bind quote, 'mouseover', quotePreview.mouseover
        $.bind quote, 'mousemove', ui.hover
        $.bind quote, 'mouseout',  quotePreview.mouseout
  mouseover: (e) ->
    qp = ui.el = $.el 'div',
      id: 'qp'
      className: 'replyhl'
    $.append d.body, qp

    id = @hash[1..]
    if el = $.id id
      qp.innerHTML = el.innerHTML
      $.addClass el, 'qphl' if conf['Quote Highlighting']
      if /backlink/.test @className
        replyID = $.x('ancestor::*[@id][1]', @).id.match(/\d+/)[0]
        for quote in $$ 'a.quotelink', qp
          if quote.hash[1..] is replyID
            quote.className = 'forwardlink'
    else
      qp.innerHTML = "Loading #{id}..."
      threadID = @pathname.split('/').pop() or $.x('ancestor::div[@class="thread"]/div', @).id
      $.cache @pathname, (-> quotePreview.parse @, id, threadID)
      ui.hover e
  mouseout: ->
    $.removeClass el, 'qphl' if el = $.id @hash[1..]
    ui.hoverend()
  parse: (req, id, threadID) ->
    return unless (qp = ui.el) and (qp.innerHTML is "Loading #{id}...")

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
      $.bind a, 'click', reportButton.report
  report: ->
    url = "http://sys.4chan.org/#{g.BOARD}/imgboard.php?mode=report&no=#{@previousElementSibling.childNodes[1].textContent}"
    id  = "#{NAMESPACE}popup"
    set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200"
    window.open url, id, set

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
    updater.focus = true
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
  dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  deadHalo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jZ2ScWuDMBDFgw4pIkU0WsoQkWAYIkXZH4N9/+/V3dmfXSrKYIFHwt17j8vdGWNMIkgFuaDgzgQnwRs4EQs5KdolUQtagRN0givEDBTEOjgtGs0Zq8F7cKqqusVxrMQLaDUWcjBSrXkn8gs51tpJSWLk9b3HUa0aNIL5gPBR1/V4kJvR7lTwl8GmAm1Gf9+c3S+89qBHa8502AsmSrtBaEBPbIbj0ah2madlNAPEccdgJDfAtWifBjqWKShRBT6KoiH8QlEUn/qt0CCjnNdmPUwmFWzj9Oe6LpKuZXcwqq88z78Pch3aZU3dPwwc2sWlfZKCW5tWluV8kGvXClLm6dYN4/aUqfCbnEOzNDGhGZbNargvxCzvMGfRJD8UaDVvgkzo6QAAAABJRU5ErkJggg=='
  default: $('link[rel="shortcut icon"]', d.head)?.href or '' #no favicon in `post successful` page
  empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  haloSFW: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZ2S4crCMAxF+0OGDJEPKYrIGKOsiJSx/fJRfSAfTJNyKqXfiuDg0C25N2RJjTGmEVrhTzhw7oStsIEtsVzT4o2Jo9ALThiEM8IdHIgNaHo8mjNWg6/ske8bohPo+63QOLzmooHp8fyAICBSQkVz0QKdsFQEV6WSW/D+7+BbgbIDHcb4Kp61XyjyI16zZ8JemGltQtDBSGxB4/GoN+7TpkkjDCsFArm0IYv3U0BbnYtf8BCy+JytsE0X6VyuKhPPK/GAJ14kvZZDZVV3pZIb8MZr6n4o4PDGKn0S5SdDmyq5PnXQsk+Xbhinp03FFzmHJw6xYRiWm9VxnohZ3vOcxdO8ARmXRvbWdtzQAAAAAElFTkSuQmCC'
  haloNSFW: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jZ2S0WrDMAxF/TBCCKWMYhZKCSGYmFJMSNjD/mhf239qJXNcjBdTWODgRLpXKJKNMaYROuFTOHEehFb4gJZYrunwxsSXMApOmIQzwgOciE1oRjyaM1aDj+yR7xuiHvT9VmgcXnPRwO/9+wWCgEgJFc1FCwzCVhFclUpuw/u3g3cFyg50GPOjePZ+ocjPeM2RCXthpbUFwQAzsQ2Nx6PeuE+bJo0w7BQI5NKGLN5XAW11LX7BQ8jia7bCLl2kc7mqTLzuxAOeeJH0Wk6VVf0oldyEN15T948CDm+sMiZRfjK0pZIbUwcd+3TphnF62lR8kXN44hAbhmG5WQNnT8zynucsnuYJhFpBfkMzqD4AAAAASUVORK5CYII='

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
      url = "http://archive.gentoomen.org/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
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
  reload: ->
    window.location = 'javascript:Recaptcha.reload()'

nodeInserted = (e) ->
  {target} = e
  if target.nodeName is 'TABLE'
    for callback in g.callbacks
      callback target

imgHover =
  init: ->
    g.callbacks.push (root) ->
      return unless thumb = $ 'img[md5]', root
      $.bind thumb, 'mouseover', imgHover.mouseover
      $.bind thumb, 'mousemove', ui.hover
      $.bind thumb, 'mouseout',  ui.hoverend
  mouseover: (e) ->
    ui.el = $.el 'img'
      id: 'iHover'
      src: @parentNode.href
    $.append d.body, ui.el

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
    imgExpand.style = $.addStyle ''
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
    imageType = $.get 'imageType', 'full'
    for option in $$ 'option', controls
      if option.textContent is imageType
        option.selected = true
        break
    select = $ 'select', controls
    imgExpand.cb.typeChange.call select
    $.bind select, 'change', $.cb.value
    $.bind select, 'change', imgExpand.cb.typeChange
    $.bind $('input', controls), 'click', imgExpand.cb.all

    delform = $ 'form[name=delform]'
    $.prepend delform, controls

  resize: (e) ->
    imgExpand.style.innerHTML = "body.fitheight img[md5] + img { max-height: #{d.body.clientHeight}px }"

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
            <p>Updater options are in the updater dialog in replies at the bottom-right corner of the window.</p>
            <p>If you don't see the buttons, try disabling your userstyles.</p>
          </div>
        </div>"
    $.append d.body, dialog

    $.bind window, 'click', firstRun.close

  close: ->
    $.set 'firstrun', true
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
    if conf['404 Redirect'] and d.title is '4chan - 404' and /^\d+$/.test g.THREAD_ID
      redirect()
      return
    if not $ '#navtopr'
      return

    Favicon.halo = if /ws/.test Favicon.default then Favicon.haloSFW else Favicon.haloNSFW
    $('link[rel="shortcut icon"]', d.head).setAttribute 'type', 'image/x-icon'
    g.hiddenReplies = $.get "hiddenReplies/#{g.BOARD}/", {}
    tzOffset = (new Date()).getTimezoneOffset() / 60
    # GMT -8 is given as +480; would GMT +8 be -480 ?
    g.chanOffset = 5 - tzOffset# 4chan = EST = GMT -5
    if $.isDST() then g.chanOffset -= 1

    lastChecked = $.get 'lastChecked', 0
    now = Date.now()
    if lastChecked < now - 1*DAY
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
      $.set 'lastChecked', now

    $.addStyle main.css

    #recaptcha may be blocked, eg by noscript
    if (form = $ 'form[name=post]') and (canPost = !!$ '#recaptcha_response_field')
      Recaptcha.init()
      if g.REPLY and conf['Auto Watch Reply'] and conf['Thread Watcher']
        $.bind form, 'submit', -> if $('img.favicon').src is Favicon.empty
            watcher.watch null, g.THREAD_ID

    #major features
    threading.init()

    # scroll to bottom if post isn't found
    # thumbnail generation takes time
    if g.REPLY and (id = location.hash[1..]) and /\d/.test(id[0]) and !$.id(id)
      scrollTo 0, d.body.scrollHeight

    if conf['Auto Noko'] and canPost
      form.action += '?noko'

    if conf['Cooldown'] and canPost
      cooldown.init()

    if conf['Image Expansion']
      imgExpand.init()

    if conf['Image Auto-Gif']
      imgGif.init()

    if conf['Time Formatting']
      Time.init()

    if conf['Sauce']
      sauce.init()

    if conf['Reveal Spoilers']
      revealSpoilers.init()

    if conf['Anonymize']
      anonymize.init()

    if conf['Image Hover']
      imgHover.init()

    if conf['Reply Hiding']
      replyHiding.init()

    if conf['Quick Reply'] and canPost
      qr.init()

    if conf['Report Button']
      reportButton.init()

    if conf['Quote Backlinks']
      quoteBacklink.init()

    if conf['Quote Inline']
      quoteInline.init()

    if conf['Quote Preview']
      quotePreview.init()

    if conf['Indicate OP quote']
      quoteOP.init()

    if conf['Thread Watcher']
      watcher.init()

    if conf['Keybinds']
      keybinds.init()

    if g.REPLY
      if conf['Thread Updater']
        updater.init()

      if conf['Image Preloading']
        imgPreloading.init()

      if conf['Quick Reply'] and conf['Persistent QR'] and canPost
        qr.dialog()
        if conf['Auto Hide QR']
          $('#autohide', qr.el).checked = true

      if conf['Post in Title']
        titlePost.init()

      if conf['Thread Stats']
        threadStats.init()

      if conf['Unread Count']
        unread.init()

      if conf['Reply Navigation']
        nav.init()

      if conf['Auto Watch'] and conf['Thread Watcher'] and
        /watch/.test(location.search) and $('img.favicon').src is Favicon.empty
          watcher.watch null, g.THREAD_ID

    else #not reply
      if conf['Index Navigation']
        nav.init()

      if conf['Thread Hiding']
        threadHiding.init()

      if conf['Thread Expansion']
        expandThread.init()

      if conf['Comment Expansion']
        expandComment.init()

      if conf['Auto Watch']
        $('.postarea form').action += '?watch'

    for op in $$ 'div.op'
      for callback in g.callbacks
        callback op
    for table in $$ 'a + table'
      for callback in g.callbacks
        callback table
    $.bind $('form[name=delform]'), 'DOMNodeInserted', nodeInserted
    options.init()

    unless $.get 'firstrun'
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
      #error {
        cursor: default;
      }
      #error[href] {
        cursor: pointer;
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
      #options label {
        text-decoration: underline;
      }
      #floaty {
        float: left;
      }
      #options [name=tab]:not(:checked) + * {
        display: none;
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
        max-height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
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
        height: 125px;
      }
      #qr #close, #qr #autohide {
        float: right;
      }
      #qr:not(:hover) > #autohide:checked ~ .autohide {
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

      #files > input {
        display: block;
      }
    '

main.init()
