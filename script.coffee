config =
  main:
    Enhancing:
      '404 Redirect':       [true,  'Redirect dead threads']
      'Anonymize':          [false, 'Make everybody anonymous']
      'Keybinds':           [true,  'Binds actions to keys']
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
    'http://iqdb.org/?url='
    'http://google.com/searchbyimage?image_url='
    '#http://regex.info/exif.cgi?url='
    '#http://tineye.com/search?url='
    '#http://saucenao.com/search.php?db=999&url='
    '#http://imgur.com/upload?url='
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
  # XXX scriptish - console.log.apply is not a function
  # https://github.com/scriptish/scriptish/issues/3
  log = (arg) ->
    console.log arg

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
    el.style.cssText = if saved = localStorage["#{NAMESPACE}#{id}.position"] then saved else position
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
    localStorage["#{NAMESPACE}#{id}.position"] = el.style.cssText
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
    $.add d.head, script
    $.rm script
  ajax: (url, cb, type='get') ->
    r = new XMLHttpRequest()
    r.onload = cb
    r.open type, url, true
    r.send()
    r
  cache: (url, cb) ->
    if req = $.cache.requests[url]
      if req.readyState is 4
        cb.call req
      else
        req.callbacks.push cb
    else
      req = $.ajax url, (-> cb.call @ for cb in @callbacks)
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
    d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).
      singleNodeValue
  tn: (s) ->
    d.createTextNode s
  replace: (root, el) ->
    root.parentNode.replaceChild el, root
  addClass: (el, className) ->
    el.classList.add className
  removeClass: (el, className) ->
    el.classList.remove className
  rm: (el) ->
    el.parentNode.removeChild el
  add: (parent, children...) ->
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

pathname = location.pathname.substring(1).split('/')
[g.BOARD, temp] = pathname
if temp is 'res'
  g.REPLY = temp
  g.THREAD_ID = pathname[2]
else
  g.PAGENUM = parseInt(temp) or 0

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
      if quote.hash[1..] is threadID
        quote.innerHTML += '&nbsp;(OP)'
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
        if (href = quote.getAttribute('href')) is quote.hash #add pathname to normal quotes
          quote.pathname = pathname
        else if href isnt quote.href #fix x-thread links, not x-board ones
          quote.href = "res/#{href}"
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
    table.hidden = true

    if conf['Show Stubs']
      name = $('span.commentpostername', reply).textContent
      trip = $('span.postertrip', reply)?.textContent or ''
      a = $.el 'a',
        textContent: "[ + ] #{name} #{trip}"
      $.bind a, 'click', replyHiding.cb.show

      div = $.el 'div',
        className: 'stub'
      $.add div, a
      $.before table, div

    id = reply.id
    g.hiddenReplies[id] = Date.now()
    $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

  show: (table) ->
    table.hidden = false

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
      root = $('td.replyhl', thread) or thread
      thumb = $ 'img[md5]', root
      imgExpand.toggle thumb.parentNode

  qr: (thread, quote) ->
    if quote
      QR.quote.call $ 'a.quotejs + a', $('td.replyhl', thread) or thread
    else
      if QR.qr
        $('textarea', QR.qr).focus()
      else
        QR.dialog '', thread?.firstChild.id

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

    $.add span, prev, $.tn(' '), next
    $.add d.body, span

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
            <label for=main_tab>Main</label> | <label for=flavors_tab>Sauce</label> | <label for=rice_tab>Rice</label> | <label for=keybinds_tab>Keybinds</label>
          </div>
          <div id=credits>
            <a href=http://aeosynth.github.com/4chan-x/>4chan X</a> |
            <a href=http://chat.now.im/x/aeos>Support Throd</a> |
            <a href=https://github.com/aeosynth/4chan-x/issues>GitHub</a> |
            <a href=https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2DBVZBUAM4DHC&lc=US&item_name=Aeosynth&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted>Donate</a>
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
            <ul>
              Backlink formatting
              <li><input type=text name=backlink value='#{conf['backlink']}'> : <span id=backlinkPreview></span></li>
            </ul>
            <ul>
              Time formatting
              <li><input type=text name=time value='#{conf['time']}'> : <span id=timePreview></span></li>
              <li>Supported <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</li>
              <li>Day: %a, %A, %d, %e</li>
              <li>Month: %m, %b, %B</li>
              <li>Year: %y</li>
              <li>Hour: %k, %H, %l (lowercase L), %I (uppercase i), %p, %P</li>
              <li>Minutes: %M</li>
            </ul>
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
      for key, arr of obj
        checked = if conf[key] then "checked" else ""
        description = arr[1]
        li = $.el 'li',
          innerHTML: "<label><input type=checkbox name='#{key}' #{checked}>#{key}</label><span class=description>: #{description}</span>"
        $.bind $('input', li), 'click', $.cb.checked
        $.add ul, li
      $.add main, ul

    li = $.el 'li',
      innerHTML: "<button>hidden: #{hiddenNum}</button> <span class=description>: Forget all hidden posts. Useful if you accidentally hide a post and have `show stubs` disabled."
    $.bind $('button', li), 'click', options.clearHidden
    $.add $('ul:nth-child(2)', dialog), li

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
    $.add overlay, dialog
    $.add d.body, overlay

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

QR =
  #captcha caching for report form
  #report queueing
  #check if captchas can be reused on eg dup file error
  init: ->
    #can't reply in some stickies, recaptcha may be blocked, eg by noscript
    return unless $('form[name=post]') and $('#recaptcha_response_field')
    g.callbacks.push (root) ->
      quote = $ 'a.quotejs + a', root
      $.bind quote, 'click', QR.quote
    $.add d.body, $.el 'iframe',
      name: 'iframe'
      hidden: true
    # nuke id so qr's field focuses on recaptcha reload, instead of normal form's
    $('#recaptcha_response_field').id = ''
    holder = $ '#recaptcha_challenge_field_holder'
    $.bind holder, 'DOMNodeInserted', QR.captchaNode
    QR.captchaNode target: holder.firstChild
    QR.accept = $('.rules').textContent.match(/: (.+) /)[1].replace /\w+/g, (type) ->
      switch type
        when 'JPG'
          'image/JPEG'
        when 'PDF'
          'application/' + type
        else
          'image/' + type
    QR.MAX_FILE_SIZE = $('input[name=MAX_FILE_SIZE]').value
    QR.spoiler = if $('.postarea label') then ' <label>[<input type=checkbox name=spoiler>Spoiler Image?]</label>' else ''
    if conf['Persistent QR']
      QR.dialog()
      $('textarea', QR.qr).blur()
      if conf['Auto Hide QR']
        $('#autohide', QR.qr).checked = true
    if conf['Cooldown']
      $.bind window, 'storage', (e) -> QR.cooldown() if e.key is "#{NAMESPACE}cooldown/#{g.BOARD}"
  attach: ->
    #$('#autopost', QR.qr).checked = true
    files = $ '#files', QR.qr
    box = $.el 'li',
      innerHTML: "<img><input type=file name=upfile accept='#{QR.accept}'><a class=x>X</a>"
    file = $ 'input', box
    $.bind file, 'change', QR.change
    $.bind $('.x', box), 'click', QR.rmThumb
    $.add files, box
    file.click()
    QR.stats()
  rmThumb: ->
    $.rm @parentNode
    QR.stats()
  captchaNode: (e) ->
    QR.captcha =
      challenge: e.target.value
      time: Date.now()
    QR.captchaImg()
  captchaImg: ->
    {qr} = QR
    return unless qr
    c = QR.captcha.challenge
    $('#captcha img', qr).src = "http://www.google.com/recaptcha/api/image?c=#{c}"
  captchaPush: (el) ->
    {captcha} = QR
    captcha.response = el.value
    captchas = $.get 'captchas', []
    captchas.push captcha
    $.set 'captchas', captchas
    el.value = ''
    QR.captchaReload()
    QR.stats captchas
  captchaShift: ->
    captchas = $.get 'captchas', []
    cutoff = Date.now() - 5*HOUR + 5*MINUTE
    while captcha = captchas.shift()
      if captcha.time > cutoff
        break
    $.set 'captchas', captchas
    QR.stats captchas
    captcha
  stats: (captchas) ->
    {qr} = QR
    captchas or= $.get 'captchas', []
    images = $$ '#files input', qr
    $('#qr_stats', qr).textContent = "#{images.length} / #{captchas.length}"
  captchaReload: ->
    window.location = 'javascript:Recaptcha.reload()'
  change: (e) ->
    file = @files[0]
    if file.size > QR.MAX_FILE_SIZE
      alert 'Error: File too large.'
      $.rm @parentNode
      QR.attach()
      return
    {qr} = QR
    fr = new FileReader()
    img = $ 'img', @parentNode
    fr.onload = (e) ->
      img.src = e.target.result
    fr.readAsDataURL file
  close: ->
    $.rm QR.qr
    QR.qr = null
  cooldown: ->
    return unless g.REPLY and QR.qr
    cooldown = $.get "cooldown/#{g.BOARD}", 0
    now = Date.now()
    n = Math.ceil (cooldown - now) / 1000
    b = $ 'form button', QR.qr
    if n > 0
      $.extend b,
        textContent: n
        disabled: true
      setTimeout QR.cooldown, 1000
    else
      $.extend b,
        textContent: 'Submit'
        disabled: false
      QR.submit() if $('#autopost', QR.qr).checked
  dialog: (text='', tid) ->
    tid or= g.THREAD_ID or ''
    QR.qr = qr = ui.dialog 'qr', 'top: 0; right: 0;', "
    <a class=close>X</a>
    <input type=checkbox id=autohide title=autohide>
    <div class=move>
      <span id=qr_stats></span>
    </div>
    <div class=autohide>
      <button>File</button>
      <input form=qr_form placeholder=Name name=name>
      <input form=qr_form placeholder=Email name=email>
      <input form=qr_form placeholder=Subject name=sub>
      <ul id=files></ul>
      <form enctype=multipart/form-data method=post action=http://sys.4chan.org/#{g.BOARD}/post target=iframe id=qr_form>
        <textarea placeholder=Comment name=com></textarea>
        <div hidden>
          <input name=pwd>
          <input name=mode value=regist>
          <input name=recaptcha_challenge_field id=challenge>
          <input name=recaptcha_response_field id=response>
        </div>
        <div id=captcha>
          <div><img></div>
          <input id=recaptcha_response_field autocomplete=off>
        </div>
        <div>
          <button>Submit</button>
          #{if g.REPLY then "<label>[<input type=checkbox id=autopost title=autopost> Autopost]</label>" else ''}
          <input form=qr_form placeholder=Thread name=resto value=#{tid} #{if g.REPLY then 'hidden' else ''}>
          #{QR.spoiler}
        </div>
      </form>
    </div>
    <a class=error></a>
    "
    #XXX use dom methods to set values instead of injecting raw user input into your html -_-;
    c = d.cookie
    $('[name=name]', qr).value  = if m = c.match(/4chan_name=([^;]+)/)  then decodeURIComponent m[1] else ''
    $('[name=email]', qr).value = if m = c.match(/4chan_email=([^;]+)/) then decodeURIComponent m[1] else ''
    $('[name=pwd]', qr).value   = if m = c.match(/4chan_pass=([^;]+)/)  then decodeURIComponent m[1] else $('input[name=pwd]').value
    $('textarea', qr).value = text
    QR.cooldown() if conf['Cooldown']
    $.bind $('button', qr), 'click', QR.attach
    $.bind $('.close', qr), 'click', QR.close
    $.bind $('form', qr), 'submit', QR.submit
    $.bind $('#recaptcha_response_field', qr), 'keydown', QR.keydown
    QR.captchaImg()
    QR.stats()
    $.add d.body, qr
    ta = $ 'textarea', qr
    l = text.length
    ta.setSelectionRange l, l
    ta.focus()
  keydown: (e) ->
    kc = e.keyCode
    v = @value
    if kc is 8 and not v #backspace, empty
      QR.captchaReload()
      return
    return unless e.keyCode is 13 and v #enter, not empty
    QR.captchaPush @
    e.preventDefault()
    QR.submit() #derpy, but prevents checking for content twice
  quote: (e, blank) ->
    e?.preventDefault()
    tid = $.x('ancestor::div[@class="thread"]/div', @)?.id
    id = @textContent
    text = ">>#{id}\n"
    sel = getSelection()
    if id == $.x('preceding::input[@type="checkbox"][1]', sel.anchorNode)?.name
      if s = sel.toString().replace /\n/g, '\n>'
        text += ">#{s}\n"
    {qr} = QR
    if not qr
      QR.dialog text, tid
      return
    $('#autohide', qr).checked = false
    ta = $ 'textarea', qr
    v  = ta.value
    ss = ta.selectionStart
    ta.value = v[0...ss] + text + v[ss..]
    i = ss + text.length
    ta.setSelectionRange i, i
    ta.focus()
    $('[name=resto]', qr).value or= tid
  receive: (data) ->
    $('iframe[name=iframe]').src = 'about:blank'
    {qr} = QR
    row = $('#files input[form]', qr)?.parentNode
    if data
      if QR.op
        window.location = data
        return
      data = JSON.parse data
      $.extend $('a.error', qr), data
      tc = data.textContent
      if tc is 'Error: Duplicate file entry detected.'
        $.rm row if row
        QR.stats()
        setTimeout QR.submit, 1000
      else if tc is 'You seem to have mistyped the verification.'
        setTimeout QR.submit, 1000
      return
    $.rm row if row
    QR.stats()
    if conf['Persistent QR'] or $('#files input', qr)?.files.length
      QR.reset()
    else
      QR.close()
    if conf['Cooldown']
      cooldown = Date.now() + (if QR.sage then 60 else 30)*SECOND
      $.set "cooldown/#{g.BOARD}", cooldown
      QR.cooldown()
  reset: ->
    $('[name=spoiler]', QR.qr)?.checked = false unless conf['Remember Spoiler']
    $('textarea', QR.qr).value = ''
  submit: (e) ->
    return if $('form button', qr).disabled
    #XXX e is undefined if method is called explicitly, eg, from auto posting
    unless $('textarea', QR.qr).value or $('[type=file]', QR.qr)?.files.length
      if e
        alert 'Error: No text entered.'
        e.preventDefault()
      return
    {qr} = QR
    $('.error', qr).textContent = ''
    if e and (el = $('#recaptcha_response_field', qr)).value
      QR.captchaPush el
    if not captcha = QR.captchaShift()
      alert 'You forgot to type in the verification.'
      e?.preventDefault()
      return
    {challenge, response} = captcha
    $('#challenge', qr).value = challenge
    $('#response',  qr).value = response
    $('#autohide', qr).checked = true if conf['Auto Hide QR']
    if input = $ '#files input', qr
      input.setAttribute 'form', 'qr_form'
    $('#qr_form', qr).submit() if not e
    QR.sage = /sage/i.test $('[name=email]', qr).value
    id = $('input[name=resto]', qr).value
    QR.op = not id
    $('[name=email]', qr).value = 'noko' if QR.op
    if conf['Thread Watcher'] and conf['Auto Watch Reply']
      op = $.id id
      if $('img.favicon', op).src is Favicon.empty
        watcher.watch op, id
  sys: ->
    if recaptcha = $ '#recaptcha_response_field' #post reporting
      $.bind recaptcha, 'keydown', QR.keydown
      return
    ###
    http://code.google.com/p/chromium/issues/detail?id=20773
    Let content scripts see other frames (instead of them being undefined)

    To access the parent, we have to break out of the sandbox and evaluate
    in the global context.
    ###
    $.globalEval ->
      $ = (css) -> document.querySelector css
      if node = $('table font b')?.firstChild
        {textContent, href} = node
        data = JSON.stringify {textContent, href}
      else if node = $ 'meta'
        data = node.content.match(/url=(.+)/)[1]
        if /#/.test data then data = '' #not op
      parent.postMessage data, '*'
      #if we're an iframe, parent will blank us

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
      $.add op, node
      node = op.nextSibling
    $.add op, node #add the blockquote
    op.id = $('input[name]', op).name
    op

  thread: (node) ->
    node = threading.op node

    return if g.REPLY

    div = $.el 'div',
      className: 'thread'
    $.before node, div

    while node.nodeName isnt 'HR'
      $.add div, node
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
      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox #{checked}></label></div>
      <div><label>Interval (s)<input name=Interval value=#{conf['Interval']} type=text></label></div>
      <div><input value='Update Now' type=button></div>"

    dialog = ui.dialog 'updater', 'bottom: 0; right: 0;', html

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

    $.add d.body, dialog

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
    update: ->
      if @status is 404
        updater.timer.textContent = ''
        updater.count.textContent = 404
        updater.count.className = 'error'
        clearTimeout updater.timeoutID
        for input in $$ '#com_submit'
          input.disabled = true
          input.value = 404
        # XXX trailing spaces are trimmed
        d.title = d.title.match(/.+-/)[0] + ' 404'
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
    updater.request = $.ajax url, cb

watcher =
  init: ->
    html = '<div class=move>Thread Watcher</div>'
    watcher.dialog = ui.dialog 'watcher', 'top: 50px; left: 0px;', html
    $.add d.body, watcher.dialog

    #add watch buttons
    inputs = $$ '.op input'
    for input in inputs
      favicon = $.el 'img',
        className: 'favicon'
      $.bind favicon, 'click', watcher.cb.toggle
      $.before input, favicon

    #populate watcher, display watch buttons
    watcher.refresh()

    if conf['Auto Watch']
      unless g.REPLY
        $('.postarea form').action += '?watch'
      else if /watch/.test(location.search) and $('img.favicon').src is Favicon.empty
        watcher.watch null, g.THREAD_ID

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

        $.add div, x, $.tn(' '), link
        $.add watcher.dialog, div

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
    sauce.prefixes = (s for s in (conf['flavors'].split '\n') when s and s[0] != '#')
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
          $.add span, $.tn(' '), link

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
    node = if posttime = $('.posttime', root) then posttime else $('span[id]', root).previousSibling
    [_, month, day, year, hour, min] =
      node.textContent.match /(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\d+)/
    year = "20#{year}"
    month -= 1 #months start at 0
    hour = g.chanOffset + Number hour
    Time.date = new Date year, month, day, hour, min
    #XXX /b/ will have seconds cut off

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
        unless (container = $ '.container', el) and container.parentNode is el
          container = $.el 'span', className: 'container'
          root = $('.reportbutton', el) or $('span[id^=no]', el)
          $.after root, container
        $.add container, $.tn(' '), link

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
          $.x('ancestor::table[1]', hidden).hidden = false
      return
    root = if @parentNode.nodeName is 'FONT' then @parentNode else if @nextSibling then @nextSibling else @
    if el = $.id id
      inline = quoteInline.table id, el.innerHTML
      if @className is 'backlink'
        return if $("a.backlink[href='##{id}']", el)
        $.after @parentNode, inline
        $.x('ancestor::table[1]', el).hidden = true
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
      if (href = quote.getAttribute('href')) is quote.hash #add pathname to normal quotes
        quote.pathname = pathname
      else if !g.REPLY and href isnt quote.href #fix x-thread links, not x-board ones
        quote.href = "res/#{href}"
    link = $ 'a.quotejs', newInline
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
    g.callbacks.push (root) ->
      for quote in $$ 'a.quotelink, a.backlink', root
        continue unless quote.hash
        $.bind quote, 'mouseover', quotePreview.mouseover
        $.bind quote, 'mousemove', ui.hover
        $.bind quote, 'mouseout',  quotePreview.mouseout
  mouseover: (e) ->
    qp = ui.el = $.el 'div',
      id: 'qp'
      className: 'reply'
    $.add d.body, qp

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
    dialog = ui.dialog 'stats', 'bottom: 0; left: 0;', html
    dialog.className = 'dialog'
    threadStats.postcountEl  = $ '#postcount',  dialog
    threadStats.imagecountEl = $ '#imagecount', dialog
    $.add d.body, dialog
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
  init: ->
    favicon = $  'link[rel="shortcut icon"]', d.head
    favicon.type = 'image/x-icon'
    {href} = favicon
    Favicon.default = href
    Favicon.unread = if /ws/.test href then Favicon.unreadSFW else Favicon.unreadNSFW
  dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  unreadDead: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANhJREFUOMutU0EKwjAQzEPFgyBFei209gOKINh6tL3qO3yAB9OHWPTeMZsmJaRpiNjAkE1mMt1stgwA+wdsFgM1oHE4FXmSpWUcRzWBYtozNfKAYdCHCrQuosX9tlk+CBS7NKMMbMF7vXoJtC7Om8HwhXzbCWCSn6qBJHd74FIBVS1jm7czYFSsq7gvpY0s6+ThJwc4743EHnGkIW2YAW+AphkMPj6DJE1LXW3fFUhD2pHBsTznLKCIFCstC3nGNvQZnQa6kX4yMGfdyi7OZaB7wZy93Cx/4xfgv/s+XYFMrAAAAABJRU5ErkJggg%3D%3D'
  unreadSFW: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAN9JREFUOMtj+P//PwMlmIEqBkDBfxie2NdVVVFaMikzPXsuCIPYIDFkNWANSAb815t+GI5B/Jj8iQfjapafBWEQG5saDBegK0ja8Ok9EH/AJofXBTBFlUf+/wPi/7jkcYYBCLef/v9/9pX//+cAMYiNLo/uAgZQYMVVLzsLcnYF0GaQ5otv/v+/9BpiEEgMJAdSA1JLlAGXgAZcfoNswGfcBpQDowoW2vi8AFIDUothwOQJvVXIgYUrEEFsqFoGYqLxA7HRiNUAWEIiyQBkGpaUsclhMwCWFpBpvHJUyY0AmdYZKFRtAsoAAAAASUVORK5CYII%3D'
  unreadNSFW: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAOBJREFUOMtj+P//PwMlmIEqBkDBfxie2DWxqqykYlJ6dtZcEAaxQWLIasAakAz4n3bGGI5B/JiJ8QfjlsefBWEQG5saDBegKyj5lPQeiD9gk8PrApiinv+V/4D4Py55nGEAwrP+t/9f/X82EM8Bs9Hl0V3AAAqsuGXxZ0HO7vlf8Q+k+eb/i0B8CWwQSAwkB1IDUkuUAbeAmm/9v4ww4DMeA8pKyifBQhufF0BqQGoxDJjcO7kKObBwBSKIDVXLQEw0fiA2GrEaAEtIJBmATMOSMjY5bAbA0gIyjVeOKrkRAMefDK/b7ecEAAAAAElFTkSuQmCC'

  update: ->
    l = unread.replies.length
    if g.dead
      if l > 0
        href = Favicon.unreadDead
      else
        href = Favicon.dead
    else
      if l > 0
        href = Favicon.unread
      else
        href = Favicon.default

    #XXX `favicon.href = href` doesn't work on Firefox
    favicon = $ 'link[rel="shortcut icon"]', d.head
    clone = favicon.cloneNode true
    clone.href = href
    $.replace favicon, clone

redirect = ->
  switch g.BOARD
    when 'g', 'sci'
      url = "http://archive.installgentoo.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when 'lit', 'tv'
      url = "http://archive.gentoomen.org/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when 'a', 'jp', 'm', 'tg'
      url = "http://archive.easymodo.net/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when '3', 'adv', 'an', 'ck', 'co', 'fa', 'fit', 'int', 'k', 'mu', 'n', 'o', 'p', 'po', 'soc', 'sp', 'toy', 'trv', 'v', 'vp', 'x'
      url = "http://archive.no-ip.org/#{g.BOARD}/thread/#{g.THREAD_ID}"
    else
      url = "http://boards.4chan.org/#{g.BOARD}"
  location.href = url

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
    $.add d.body, ui.el

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
    if imgExpand.on and root.className isnt 'inline' then imgExpand.expand a.firstChild
  cb:
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.button isnt 0
      e.preventDefault()
      imgExpand.toggle @
    all: (e) ->
      imgExpand.on = @checked
      if imgExpand.on #expand
        for thumb in $$ 'img[md5]:not([hidden])'
          imgExpand.expand thumb
      else #contract
        for thumb in $$ 'img[md5][hidden]'
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
    thumb.hidden = false
    $.rm thumb.nextSibling

  expand: (thumb) ->
    a = thumb.parentNode
    img = $.el 'img',
      src: a.href
    unless a.parentNode.className is 'op'
      filesize = $ 'span.filesize', a.parentNode
      [_, max] = filesize.textContent.match /(\d+)x/
      img.style.maxWidth = "-moz-calc(#{max}px)"
    $.bind img, 'error', imgExpand.error
    thumb.hidden = true
    $.add a, img

  error: (e) ->
    thumb = @previousSibling
    imgExpand.contract thumb
    #navigator.online is not x-browser/os yet
    req = $.ajax @src, null, 'head'
    req.onreadystatechange = (e) -> setTimeout imgExpand.retry, 10000, thumb if @status isnt 404
  retry: (thumb) ->
    imgExpand.expand thumb unless thumb.hidden

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
    imgExpand.style.innerHTML = ".fitheight img[md5] + img {max-height:#{d.body.clientHeight}px;}"

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
    $.add d.body, dialog

    $.bind window, 'click', firstRun.close

  close: ->
    $.set 'firstrun', true
    $.rm $ 'style.firstrun', d.head
    $.rm $ '#overlay'
    $.unbind window, 'click', firstRun.close

Main =
  init: ->
    $.unbind document, 'DOMContentLoaded', Main.init
    if location.hostname is 'sys.4chan.org'
      QR.sys()
      return
    if conf['404 Redirect'] and d.title is '4chan - 404' and /^\d+$/.test g.THREAD_ID
      redirect()
      return
    if not $ '#navtopr'
      return

    $.bind window, 'message', Main.message
    Favicon.init()
    g.hiddenReplies = $.get "hiddenReplies/#{g.BOARD}/", {}
    tzOffset = (new Date()).getTimezoneOffset() / 60
    # GMT -8 is given as +480; would GMT +8 be -480 ?
    g.chanOffset = 5 - tzOffset# 4chan = EST = GMT -5
    if $.isDST() then g.chanOffset -= 1

    lastChecked = $.get 'lastChecked', 0
    now = Date.now()
    if lastChecked < now - 1*DAY
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

    $.addStyle Main.css

    #major features
    threading.init()

    # scroll to bottom if post isn't found
    # thumbnail generation takes time
    if g.REPLY and (id = location.hash[1..]) and /\d/.test(id[0]) and !$.id(id)
      scrollTo 0, d.body.scrollHeight

    if conf['Image Expansion']
      imgExpand.init()

    if conf['Image Auto-Gif']
      imgGif.init()

    if conf['Time Formatting']
      Time.init()

    if conf['Sauce']
      sauce.init()

    if conf['Reveal Spoilers'] and $('.postarea label')
      revealSpoilers.init()

    if conf['Anonymize']
      anonymize.init()

    if conf['Image Hover']
      imgHover.init()

    if conf['Reply Hiding']
      replyHiding.init()

    if conf['Quick Reply']
      QR.init()

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

      if conf['Post in Title']
        titlePost.init()

      if conf['Thread Stats']
        threadStats.init()

      if conf['Unread Count']
        unread.init()

      if conf['Reply Navigation']
        nav.init()

    else #not reply
      if conf['Index Navigation']
        nav.init()

      if conf['Thread Hiding']
        threadHiding.init()

      if conf['Thread Expansion']
        expandThread.init()

      if conf['Comment Expansion']
        expandComment.init()

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

  message: (e) ->
    {origin, data} = e
    if origin is 'http://sys.4chan.org'
      QR.receive data

  css: '
      /* dialog styling */
      div.dialog {
        border: 1px solid;
      }
      div.dialog > div.move {
        cursor: move;
      }
      label, a, .favicon {
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
      #qp input, #qp .inline {
        display: none;
      }
      .qphl {
        outline: 2px solid rgba(216, 94, 49, .7);
      }
      .inlined {
        opacity: .5;
      }
      .inline td.reply {
        background-color: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(128, 128, 128, 0.5);
      }
      .filetitle, .replytitle, .postername, .commentpostername, .postertrip {
        background: none;
      }

      /* Firefox bug: hidden tables are not hidden */
      [hidden] {
        display: none;
      }

      #files > input {
        display: block;
      }
      #qr {
        position: fixed;
      }
      #qr .close, #qr #autohide {
        float: right;
      }
      #qr > .move {
        text-align: right;
      }
      #qr .autohide input {
        width: 82px;
      }
      #qr #recaptcha_response_field {
        width: 100%;
      }
      #qr form {
        margin: 0;
      }
      #qr .autohide {
        clear: both;
      }
      #qr:not(:hover) #autohide:checked ~ .autohide {
        height: 0;
        overflow: hidden;
      }
      #qr textarea {
        border: 0;
        height: 150px;
        width: 100%;
      }
      #qr #captcha {
        position: relative;
      }
      #qr #files {
        width: 300px;
        white-space: nowrap;
        overflow: auto;
        margin: 0;
        padding: 0;
      }
      #qr #files li {
        position: relative;
        display: inline-block;
        width: 100px;
        height: 100px;
        overflow: hidden;
      }
      #qr #files a {
        position: absolute;
        left: 0;
        font-size: 50px;
        color: red;
      }
      #qr #cl {
        right: 0;
        padding: 2px;
        position: absolute;
      }
      #qr #files input {
        /* cannot use `display: none;`
        https://bugs.webkit.org/show_bug.cgi?id=58208
        http://code.google.com/p/chromium/issues/detail?id=78961
        */
        font-size: 100px;
        position: absolute;
        left: 0;
        opacity: 0;
      }
      #qr #files img {
        max-height: 100px;
        max-width:  100px;
      }
      #qr input[name=resto] {
        width: 80px;
      }
    '

if d.body
  Main.init()
else
  $.bind document, 'DOMContentLoaded', Main.init
