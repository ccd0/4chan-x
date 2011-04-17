# TODO
# option to skip post form directly to contents on first page,
# like what happens when using thread nav to go to next page
# (floating) qr no-quote button?
# updater cache hacks

# XXX error on FUCKING CHROME
{log} = console if console?

# TODO reset defaults
config =
  main:
    checkbox:
      '404 Redirect':      [true,  'Redirect dead threads']
      'Anonymize':         [false, 'Make everybody anonymous']
      'Auto Watch':        [true,  'Automatically watch threads that you start (Firefox only)']
      'Comment Expansion': [true,  'Expand too long comments']
      'Image Auto-Gif':    [false, 'Animate gif thumbnails']
      'Image Expansion':   [true,  'Expand images']
      'Image Hover':       [false, 'Show full image on mouseover']
      'Image Preloading':  [false, 'Preload Images']
      'Keybinds':          [true, 'Binds actions to keys']
      'Localize Time':     [true,  'Show times based on your timezone']
      'Persistent QR':     [false, 'Quick reply won\'t disappear after posting. Only in replies.']
      'Post in Title':     [true,  'Show the op\'s post in the tab title']
      'Quick Reply':       [true,  'Reply without leaving the page']
      'Quick Report':      [true,  'Add quick report buttons']
      'Reply Hiding':      [true,  'Hide single replies']
      'Sauce':             [true,  'Add sauce to images']
      'Show Stubs':        [true,  'Of hidden threads / replies']
      'Thread Expansion':  [true,  'View all replies']
      'Thread Hiding':     [true,  'Hide entire threads']
      'Thread Navigation': [true,  'Navigate to previous / next thread']
      'Thread Updater':    [true,  'Update threads']
      'Thread Watcher':    [true,  'Bookmark threads']
      'Unread Count':      [true,  'Show unread post count in tab title']
  updater:
    checkbox:
      'Verbose':     [true,  'Show countdown timer, new post count']
      'Auto Update': [false, 'Automatically fetch new posts']
    'Interval': 30

# create 'global' options, no namespacing
_config = {}
((parent, obj) ->
  if obj.length #array
    _config[parent] = obj[0]
  else if typeof obj is 'object'
    for key, val of obj
      arguments.callee key, val
  else #constant
    _config[parent] = obj
) null, config

#x-browser
if typeof GM_deleteValue is 'undefined'
  window.GM_setValue = (name, value) ->
    value = (typeof value)[0] + value
    localStorage.setItem name, value
  window.GM_getValue = (name, defaultValue) ->
    unless value = localStorage.getItem name
      return defaultValue
    type = value[0]
    value = value[1..]
    switch type
      when 'b'
        value == 'true'
      when 'n'
        Number value
      else
        value
  window.GM_openInTab = (url) ->
    window.open url, "_blank"

ui =
  dialog: (id, position, html) ->
    el = document.createElement 'div'
    el.className = 'reply dialog'
    el.innerHTML = html
    el.id = id
    if typeof position is 'object'
      {left, top} = position
    else
      switch position
        when 'topleft'
          left = '0px'
          top  = '0px'
        when 'topright'
          left = null
          top  = '0px'
        when 'bottomleft'
          left = '0px'
          top  = null
        when 'bottomright'
          left = null
          top  = null
        when 'center'
          left = '50%'
          top  = '25%'
    left = localStorage["#{id}Left"] ? left
    top  = localStorage["#{id}Top"]  ? top
    if left then el.style.left = left else el.style.right  = '0px'
    if top  then el.style.top  = top  else el.style.bottom = '0px'
    el.querySelector('div.move').addEventListener 'mousedown', ui.move, true
    el.querySelector('div.move a[name=close]')?.addEventListener 'click',
      (-> el.parentNode.removeChild(el)), true
    el
  move: (e) ->
    ui.el = el = e.target.parentNode
    #distance from pointer to el edge is constant; calculate it here.
    # XXX opera reports el.offsetLeft / el.offsetTop as 0
    rect = el.getBoundingClientRect()
    ui.dx = e.clientX - rect.left
    ui.dy = e.clientY - rect.top
    #factor out el from document dimensions
    ui.width  = document.body.clientWidth  - el.offsetWidth
    ui.height = document.body.clientHeight - el.offsetHeight
    document.addEventListener 'mousemove', ui.moveMove, true
    document.addEventListener 'mouseup',   ui.moveEnd, true
  moveMove: (e) ->
    {el} = ui
    left = e.clientX - ui.dx
    if left < 20 then left = '0px'
    else if ui.width - left < 20 then left = ''
    right = if left then '' else '0px'
    el.style.left  = left
    el.style.right = right
    top = e.clientY - ui.dy
    if top < 20 then top = '0px'
    else if ui.height - top < 20 then top = ''
    bottom = if top then '' else '0px'
    el.style.top  = top
    el.style.bottom = bottom
  moveEnd: ->
    document.removeEventListener 'mousemove', ui.moveMove, true
    document.removeEventListener 'mouseup',   ui.moveEnd, true
    {el} = ui #{id} = {el} = ui doesn't work
    {id} = el
    localStorage["#{id}Left"] = el.style.left
    localStorage["#{id}Top"]  = el.style.top

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
  get: (url, cb) ->
    r = new XMLHttpRequest()
    r.onload = cb
    r.open 'get', url, true
    r.send()
    r
  cb:
    checked: ->
      $.getValue @name, @checked
    value: ->
      $.setValue @name, @value
  deleteValue: (name) ->
    name = NAMESPACE + name
    delete localStorage[name]
  getValue: (name, defaultValue) ->
    name = NAMESPACE + name
    if value = localStorage[name]
      JSON.parse value
    else
      defaultValue
  setValue: (name, value) ->
    name = NAMESPACE + name
    localStorage[name] = JSON.stringify value
  addStyle: (css) ->
    style = document.createElement 'style'
    style.type = 'text/css'
    style.textContent = css
    $.append d.head, style
  config: (name) ->
    $.getValue name, _config[name]
  zeroPad: (n) ->
    if n < 10 then '0' + n else n
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
  remove: (el) ->
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

$$ = (selector, root=d.body) ->
  result = root.querySelectorAll selector
  node for node in result

#funks
autoWatch = ->
  #TODO look for subject
  autoText = $('textarea', this).value.slice(0, 25)
  GM_setValue('autoText', "/#{g.BOARD}/ - #{autoText}")

expandComment = (e) ->
  e.preventDefault()
  a = this
  href = a.getAttribute('href')
  r = new XMLHttpRequest()
  r.onload = ->
    onloadComment(@responseText, a, href)
  r.open('GET', href, true)
  r.send()
  g.xhrs.push {
    r: r,
    id: href.match(/\d+/)[0]
  }

expandThread =
  init: ->
    for span in $$ 'span.omittedposts'
      a = $.el 'a',
        textContent: "+ #{span.textContent}"
        className: 'omittedposts'
      $.bind a, 'click', expandThread.cb.toggle
      $.replace span, a

  cache: {}
  requests: {}

  cb:
    toggle: (e) ->
      thread = e.target.parentNode
      expandThread.toggle thread

    load: (xhr, thread, a) ->
      if xhr.status is 404
        a.textContent.replace 'X Loading...', '404'
        $.unbind a, 'click', expandThread.cb.toggle
      else
        html = xhr.responseText
        id = thread.firstChild.id
        expandThread.cache[id] = html
        expandThread.expand html, thread, a

  toggle: (thread) ->
    id = thread.firstChild.id
    a = $ 'a.omittedposts', thread

    switch a.textContent[0]
      when '+'
        a.textContent = a.textContent.replace '+', 'X Loading...'
        if html = expandThread.cache[id]
          expandThread.expand html, thread, a
        else
          expandThread.requests[id] =
            $.get "res/#{id}", (-> expandThread.cb.load this, thread, a)

      when 'X'
        a.textContent = a.textContent.replace 'X Loading...', '+'
        expandThread.requests[id].abort()

      when '-'
        a.textContent = a.textContent.replace '-', '+'
        #goddamit moot
        num = if g.BOARD is 'b' then 3 else 5
        table = $.x "following::br[@clear][1]/preceding::table[#{num}]", a
        while (prev = table.previousSibling) and (prev.nodeName is 'TABLE')
          $.remove prev

  expand: (html, thread, a) ->
    a.textContent = a.textContent.replace 'X Loading...', '-'

    # eat everything, then replace with fresh full posts
    while (next = a.nextSibling) and not next.clear #br[clear]
      $.remove next
    br = next

    body = $.el 'body',
      innerHTML: html

    tables = $$ 'form[name=delform] table', body
    tables.pop()
    for table in tables
      $.before br, table

replyHiding =
  init: ->
    g.callbacks.push replyHiding.cb.node

  cb:
    hide: (e) ->
      reply = e.target.parentNode.nextSibling
      replyHiding.hide reply

    node: (root) ->
      tds = $$('td.doubledash', root)
      for td in tds
        a = $.el 'a',
          textContent: '[ - ]'
        $.bind a, 'click', replyHiding.cb.hide
        $.replace td.firstChild, a

        reply = td.nextSibling
        id = reply.id
        if id of g.hiddenReply
          replyHiding.hide reply

    show: (e) ->
      div = e.target.parentNode
      table = div.nextSibling
      replyHiding.show table

      $.remove div

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
    g.hiddenReply[id] = Date.now()
    $.setValue "hiddenReply/#{g.BOARD}/", g.hiddenReply

  show: (table) ->
    $.show table

    id = $('td[id]', table).id
    delete g.hiddenReply[id]
    $.setValue "hiddenReply/#{g.BOARD}/", g.hiddenReply

imageHover =
  init: ->
    img = $.el 'img', id: 'iHover'
    $.hide img
    d.body.appendChild img
    g.callbacks.push imageHover.cb.node
  offset:
    x: 45
    y: -120
  cb:
    node: (root) ->
      thumbs = $$ 'img[md5]', root
      for thumb in thumbs
        $.bind thumb, 'mouseover', imageHover.cb.mouseover
    mouseover: (e) ->
      {target, clientX, clientY} = e
      img = $ '#iHover'
      img.src = target.parentNode.href
      $.show img
      imageHover.winHeight = d.body.clientHeight
      imageHover.winWidth  = d.body.clientWidth
      $.bind target, 'mousemove', imageHover.cb.mousemove
      $.bind target, 'mouseout',  imageHover.cb.mouseout
    mousemove: (e) ->
      {clientX, clientY} = e
      img = $ '#iHover'
      imgHeight = img.offsetHeight

      top = clientY + imageHover.offset.y
      bot = top + imgHeight
      img.style.top =
        if imageHover.winHeight < imgHeight or top < 0
          '0px'
        else if bot > imageHover.winHeight
          imageHover.winHeight - imgHeight + 'px'
        else
          top + 'px'
      img.style.left = clientX + imageHover.offset.x
    mouseout: (e) ->
      {target} = e
      img = $ '#iHover'
      $.hide img
      img.src = null
      $.unbind target, 'mousemove', imageHover.cb.mousemove
      $.unbind target, 'mouseout',  imageHover.cb.mouseout

imageClick = (e) ->
  return if e.shiftKey or e.altKey or e.ctrlKey
  e.preventDefault()
  imageToggle this

imageToggle = (image) ->
  # 'image' is actually the <a> container
  thumb = image.firstChild
  cw = d.body.clientWidth
  ch = d.body.clientHeight
  imageType = $("#imageType").value
  if thumb.className is 'hide'
    imageThumb thumb
  else
    imageExpand thumb, cw, ch, imageType

imageTypeChange = ->
  images = $$ 'img[md5] + img'
  cw = d.body.clientWidth
  ch = d.body.clientHeight
  imageType = @value
  for image in images
    imageResize cw, ch, imageType, image

imageExpandClick = ->
  thumbs = $$ 'img[md5]'
  g.expand = @checked
  cw = d.body.clientWidth
  ch = d.body.clientHeight
  imageType = $("#imageType").value
  if @checked #expand
    for thumb in thumbs
      if thumb.className isnt 'hide'
        #hide the thumb and show image
        imageExpand thumb, cw, ch, imageType
  else #contract
    for thumb in thumbs
      if thumb.className is 'hide'
        #unhide thumb and remove image
        imageThumb thumb


imageExpand = (thumb, cw, ch, imageType) ->
  thumb.className = 'hide'
  link = thumb.parentNode
  image = $.el 'img',
    src: link.href
  link.appendChild image

  imageResize cw, ch, imageType, image

imageResize = (cw, ch, imageType, image) ->
  [_, iw, ih] =
    $.x("preceding::span[@class][1]/text()[2]", image)
    .textContent.match(/(\d+)x(\d+)/)
  iw = Number iw
  ih = Number ih

  switch imageType
    when 'full'
      image.removeAttribute 'style'
      return
    when 'fit width'
      if iw > cw
        image.style.width = '100%'
        image.style.margin = '0px'
      break
    when 'fit screen'
      ratio = Math.min cw/iw, ch/ih
      if ratio < 1
        image.style.width = Math.floor ratio * iw
        image.style.margin = '0px'

imageThumb = (thumb) ->
  thumb.className = ''
  $.remove thumb.nextSibling

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
      keybinds.key = key

    keypress: (e) ->
      keybinds.mode e

  insert: (e) ->
    switch keybinds.key
      when '<Esc>'
        e.preventDefault()
        $.remove $ '#qr'
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
    switch keybinds.key
      when 'I'
        #qr no text
        return
      when 'J'
        #highlight next
        return
      when 'K'
        #highlight prev
        return
      when 'M'
        #expand all
        return
      when 'i'
        #qr
        return
      when 'm'
        #expand img
        return
      when 'n'
        nav.next()
      when 'o'
        #open in new tab
        return
      when 'p'
        nav.prev()
      when 'u'
        #update now
        return
      when 'w'
        thread = nav.getThread()
        watcher.toggle thread
      when 'x'
        thread = nav.getThread()
        threadHiding.toggle thread
        return

keyModeNormal = (e) ->
  return if e.ctrlKey or e.altKey
  char = g.char
  hash = location.hash
  switch char
    when "I"
      if g.REPLY
        unless qrLink = $ 'td.replyhl span[id] a:not(:first-child)'
          qrLink = $ "span[id^=nothread] a:not(:first-child)"
      else
        [thread] = getThread()
        unless qrLink = $ 'td.replyhl span[id] a:not(:first-child)', thread
          qrLink = $ "span#nothread#{thread.id} a:not(:first-child)", thread
      if e.shiftKey
        $.append d.body, qr.dialog qrLink
        $('#qr textarea').focus()
      else
        # qrLink.click() doesn't work, so use this hack
        e =
          preventDefault: ->
          target: qrLink
        qr.cb.quote e
    when "J"
      if e.shiftKey
        if not g.REPLY then [root] = getThread()
        if td = $ 'td.replyhl', root
          td.className = 'reply'
          rect = td.getBoundingClientRect()
          if rect.top > 0 and rect.bottom < d.body.clientHeight #you're visible
            next = $.x 'following::td[@class="reply"]', td
            rect = next.getBoundingClientRect()
            if rect.top > 0 and rect.bottom < d.body.clientHeight #and so is the next
              next.className = 'replyhl'
            return
        replies = $$ 'td.reply', root
        for reply in replies
          top = reply.getBoundingClientRect().top
          if top > 0
            reply.className = 'replyhl'
            break
      break
    when "K"
      if e.shiftKey
        if not g.REPLY then [root] = getThread()
        if td = $ 'td.replyhl', root
          td.className = 'reply'
          rect = td.getBoundingClientRect()
          if rect.top > 0 and rect.bottom < d.body.clientHeight #you're visible
            prev = $.x 'preceding::td[@class="reply"][1]', td
            rect = prev.getBoundingClientRect()
            if rect.top > 0 and rect.bottom < d.body.clientHeight #and so is the prev
              prev.className = 'replyhl'
            return
        replies = $$ 'td.reply', root
        replies.reverse()
        height = d.body.clientHeight
        for reply in replies
          bot = reply.getBoundingClientRect().bottom
          if bot < height
            reply.className = 'replyhl'
            break
      break
    when "M"
      if e.shiftKey
        $("#imageExpand").click()
      else
        if not g.REPLY then [root] = getThread()
        unless image = $ 'td.replyhl span.filesize ~ a[target]', root
          image = $ 'span.filesize ~ a[target]', root
        imageToggle image
    when "N"
      sign = if e.shiftKey then -1 else 1
      scrollThread sign
    when "O"
      href = $("#{hash} ~ span[id] a:last-of-type").href
      if e.shiftKey
        location.href = href
      else
        GM_openInTab href
    when "U"
      updateNow()
    when "W"
      root = if g.REPLY then null else getThread()[0]
      watchButton = $ "span.filesize ~ img", root
      watch.call watchButton

nav =
  #TODO page nav
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

    nav.threads = $$ 'div.thread'

  prev: ->
    nav.scroll -1

  next: ->
    nav.scroll +1

  getThread: (full) ->
    for thread, i in nav.threads
      rect = thread.getBoundingClientRect()
      {bottom} = rect
      if bottom > 0 #we have not scrolled past
        if full
          return [thread, i, rect]
        return thread

  scroll: (delta) ->
    [thread, i, rect] = nav.getThread true
    {top} = rect

    #unless we're not at the beginning of the current thread
    # (and thus wanting to move to beginning)
    # or we're above the first thread and don't want to skip it
    unless (delta is -1 and Math.ceil(top) < 0) or (delta is +1 and top > 1)
      i += delta

    if i is -1
      window.scrollTo 0, 0
      return
    if i is 10
      window.location = "#{g.PAGENUM + 1}#p0"
      return

    {top} = nav.threads[i].getBoundingClientRect()
    window.scrollBy 0, top

scrollThread = (count) ->
  [thread, idx] = getThread()
  top = thread.getBoundingClientRect().top
  if idx is 0 and top > 1
    #we haven't scrolled to the first thread
    idx = -1
  if count < 0 and top < -1
    #we've started scrolling past this thread,
    # but now want to read from the beginning
    count++
  temp = idx + count
  if temp < 0
    hash = ''
  else if temp > 9
    hash = 'p9'
  else
    hash = "p#{temp}"
  location.hash = hash

nodeInserted = (e) ->
  target = e.target
  if target.nodeName is 'TABLE'
    for callback in g.callbacks
      callback target
  else if target.id is 'recaptcha_challenge_field' and dialog = $ '#qr'
    $('#recaptcha_image img', dialog).src = "http://www.google.com/recaptcha/api/image?c=" + target.value
    $('#recaptcha_challenge_field', dialog).value = target.value

onloadComment = (responseText, a, href) ->
  [_, op, id] = href.match /(\d+)#(\d+)/
  [replies, opbq] = parseResponse responseText
  if id is op
    html = opbq.innerHTML
  else
    #css selectors don't like ids starting with numbers,
    # getElementById only works for root document.
    for reply in replies
      if reply.id == id
        html = $('blockquote', reply).innerHTML
  bq = $.x 'ancestor::blockquote', a
  bq.innerHTML = html

changeCheckbox = ->
  GM_setValue @name, @checked

changeValue = ->
  GM_setValue @name, @value

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
      $.remove dialog
    else
      options.dialog()

  dialog: ->
    html  = "<div class=move>Options <a name=close>X</a></div>"
    conf = config.main.checkbox
    for name of conf
      title = conf[name][1]
      checked = if $.config name then "checked" else ""
      html += "<div><label title=\"#{title}\">#{name}<input name=\"#{name}\" #{checked} type=checkbox></label></div>"
    html += "<div><a name=flavors>Flavors</a></div>"
    html += "<div><textarea style=\"display: none;\" name=flavors>#{GM_getValue 'flavors', g.flavors}</textarea></div>"

    hiddenThread = $.getValue "hiddenThread/#{g.BOARD}/", {}
    hiddenNum = Object.keys(g.hiddenReply).length + Object.keys(hiddenThread).length
    html += "<div><input type=\"button\" value=\"hidden: #{hiddenNum}\"></div>"

    html += "<hr>"
    html += "<div><a href=\"http://chat.now.im/x/aeos\">support throd</a></div>"
    html += '<div><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2DBVZBUAM4DHC&lc=US&item_name=Aeosynth&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted"><img alt="Donate" src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif"/></a></div>'

    dialog = ui.dialog 'options', top: '25%', left: '50%', html
    for input in $$ 'input[type=checkbox]', dialog
      $.bind input, 'click', $.cb.checked
    $.bind $('input[type=button]', dialog), 'click', options.cb.clearHidden
    $.bind $('a[name=flavors]', dialog), 'click', options.flavors
    $.bind $('textarea', dialog), 'change', $.cb.value
    $.append d.body, dialog

  flavors: ->
    ta = $ '#options textarea'
    if ta.style.display then $.show ta else $.hide ta

  cb:
    clearHidden: (e) ->
      #'hidden' might be misleading; it's the number of IDs we're *looking* for,
      # not the number of posts actually hidden on the page.
      $.deleteValue "hiddenReply/#{g.BOARD}/"
      $.deleteValue "hiddenThread/#{g.BOARD}/"
      @value = "hidden: 0"
      g.hiddenReplies = {}

parseResponse = (responseText) ->
  body = $.el 'body',
    innerHTML: responseText
  replies = $$ 'td.reply', body
  opbq = $ 'blockquote', body
  return [replies, opbq]

qr =
  ###
  lol chrome - http://code.google.com/p/chromium/issues/detail?id=20773
  we can't access other frames, so no error checking until I make a workaround
  ###
  init: ->
    g.callbacks.push qr.cb.node
    iframe = $.el 'iframe',
      name: 'iframe'
    $.append d.body, iframe
    $.bind iframe, 'load', qr.cb.load
    $.bind window, 'message', qr.cb.messageTop

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

    load: (e) ->
      recaptchaReload()
      try
        e.target.contentWindow.postMessage '', '*'
      catch err
        # fucking chrome
        dialog = $ '#qr'
        if g.REPLY and $.config 'Persistent QR'
          qr.refresh dialog
        else
          $.remove dialog

    messageIframe: (e) ->
      message = $('table b').firstChild.textContent
      e.source.postMessage message, '*'
      window.location = 'about:blank'

    messageTop: (e) ->
      {data} = e
      dialog = $ '#qr'
      if data is 'Post successful!'
        if dialog
          if $.config 'Persistent QR'
            qr.refresh dialog
          else
            $.remove dialog
        g.seconds = if g.sage then 60 else 30
        qr.cooldownStart()
      else
        error = $.el 'span',
          className: 'error'
          textContent: data
        $.append dialog, error
        qr.autohide.unset()

      recaptchaReload()

    node: (root) ->
      quotes = $$ 'a.quotejs:not(:first-child)', root
      for quote in quotes
        $.bind quote, 'click', qr.cb.quote

    submit: (e) ->
      isQR = e.target.parentNode.id == 'qr'

      if isQR
        if span = @nextSibling
          $.remove span

      if g.seconds = GM_getValue 'seconds'
        e.preventDefault()
        qr.cooldownStart()
        alert 'Stop posting so often!'

        if isQR
          span = $.el 'span',
            className: 'error'
            textContent: 'Stop posting so often!'
          $.append @parentNode, span

        return

      recaptcha = $('input[name=recaptcha_response_field]', this)
      if recaptcha.value
        g.sage = $('#qr input[name=email]').value == 'sage'
        if isQR
          qr.autohide.set()
      else
        e.preventDefault()
        alert 'You forgot to type in the verification.'
        recaptcha.focus()

        if isQR
          span = $.el 'span',
            className: 'error'
            textContent: 'You forgot to type in the verification.'
          $.append @parentNode, span

    quote: (e) ->
      e.preventDefault()
      {target} = e
      if dialog = $ '#qr'
        qr.autohide.unset()
      else
        dialog = qr.dialog target

      id = target.textContent
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

  cooldown: ->
    submits = $$ '#qr input[type=submit], form[name=post] input[type=submit]'
    for submit in submits
      if g.seconds == 0
        submit.disabled = false
        submit.value = 'Submit'
      else
        submit.value = g.seconds = g.seconds - 1
        GM_setValue 'seconds', g.seconds

    if g.seconds != 0
      window.setTimeout qr.cooldown, 1000

  cooldownStart: ->
    GM_setValue 'seconds', g.seconds
    submits = $$ '#qr input[type=submit], form[name=post] input[type=submit]'
    for submit in submits
      submit.value = g.seconds
      submit.disabled = true
    window.setTimeout qr.cooldown, 1000

  dialog: (link) ->
    html = "<div class=move>Quick Reply <input type=checkbox title=autohide> <a name=close title=close>X</a></div>"
    dialog = ui.dialog 'qr', top: '0px', left: '0px', html
    el = $ 'input[title=autohide]', dialog
    $.bind el, 'click', qr.cb.autohide

    clone = $('form[name=post]').cloneNode(true)
    for script in $$ 'script', clone
      $.remove script
    clone.target = 'iframe'
    $.bind clone, 'submit', qr.cb.submit
    $.bind $('input[name=recaptcha_response_field]', clone), 'keydown', recaptchaListener

    if not g.REPLY
      #figure out which thread we're replying to
      xpath = 'preceding::span[@class="postername"][1]/preceding::input[1]'
      resto = $.el 'input',
        type: 'hidden'
        name: 'resto'
        value: $.x(xpath, link).name

      # place resto before table to let userstyles know we're responding to a thread
      $.before clone.lastChild, resto

    $.append dialog, clone
    $.append d.body, dialog
    dialog.style.width = dialog.offsetWidth # lock

    dialog

  persist: ->
    $.append d.body, qr.dialog()
    qr.autohide.set()

  sys: ->
    $.bind window, 'message', qr.cb.messageIframe
    if recaptcha = $ '#recaptcha_response_field'
      # post reporting
      $.bind recaptcha, 'keydown', recaptchaListener
    if $.config 'Auto Watch'
      html = $('b').innerHTML
      [_, thread, id] = html.match(/<!-- thread:(\d+),no:(\d+) -->/)
      if thread is '0'
        [_, board] = $('meta', d).content.match(/4chan.org\/(\w+)\//)
        g.watched[board] or= []
        g.watched[board].push {
          id: id,
          text: GM_getValue 'autoText'
        }
        GM_setValue 'watched', JSON.stringify g.watched

recaptchaListener = (e) ->
  if e.keyCode is 8 and @value is ''
    recaptchaReload()

recaptchaReload = ->
  window.location = 'javascript:Recaptcha.reload()'

redirect = ->
  switch g.BOARD
    when 'a', 'g', 'lit', 'sci', 'tv'
      url = "http://green-oval.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when 'cgl', 'jp', 'm', 'tg'
      url = "http://archive.easymodo.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when '3', 'adv', 'an', 'c', 'ck', 'co', 'fa', 'fit', 'int', 'k', 'mu', 'n', 'o', 'p', 'po', 'soc', 'sp', 'toy', 'trv', 'v', 'vp', 'x'
      url = "http://archive.no-ip.org/#{g.BOARD}/thread/#{g.THREAD_ID}"
    else
      url = "http://boards.4chan.org/#{g.BOARD}"
  location.href = url

replyNav = ->
  if g.REPLY
    window.location = if @textContent is '▲' then '#navtop' else '#navbot'
  else
    direction = if @textContent is '▲' then 'preceding' else 'following'
    op = $.x("#{direction}::span[starts-with(@id, 'nothread')][1]", this).id
    window.location = "##{op}"

report = ->
  input = $.x('preceding-sibling::input[1]', this)
  input.click()
  $('input[value="Report"]').click()
  input.click()

threadHiding =
  init: ->
    node = $ 'form[name=delform] > *'
    threadHiding.thread node

    hiddenThreads = $.getValue "hiddenThread/#{g.BOARD}/", {}
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
      thread = e.target.parentNode.parentNode
      threadHiding.hide thread
    show: (e) ->
      thread = e.target.parentNode.parentNode
      threadHiding.show thread

  toggle: (thread) ->
    if thread.className.indexOf('stub') != -1 or thread.style.display is 'none'
      threadHiding.show thread
    else
      threadHiding.hide thread

  hide: (thread) ->
    threadHiding.hideHide thread

    id = thread.firstChild.id

    hiddenThreads = $.getValue "hiddenThread/#{g.BOARD}/", {}
    hiddenThreads[id] = Date.now()
    $.setValue "hiddenThread/#{g.BOARD}/", hiddenThreads

  hideHide: (thread) ->
    if $.config 'Show Stubs'
      if span = $ '.omittedposts', thread
        num = Number span.textContent.match(/\d+/)[0]
      else
        num = 0
      num += $$('table', thread).length
      text = if num is 1 then "1 reply" else "#{num} replies"
      name = $('span.postername', thread).textContent
      trip = $('span.postername + span.postertrip', thread)?.textContent || ''

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
    $.remove $ 'div.block', thread
    $.removeClass thread, 'stub'
    $.show thread
    $.show thread.nextSibling

    id = thread.firstChild.id

    hiddenThreads = $.getValue "hiddenThread/#{g.BOARD}/", {}
    delete hiddenThreads[id]
    $.setValue "hiddenThread/#{g.BOARD}/", hiddenThreads

  thread: (node) ->
    op = $.el 'div',
      className: 'op'
    $.before node, op
    while node.nodeName isnt 'BLOCKQUOTE'
      $.append op, node
      node = op.nextSibling
    $.append op, node #add the blockquote
    op.id = $('input[name]', op).name

    node = op

    div = $.el 'div',
      className: 'thread'
    $.before node, div

    while node.nodeName isnt 'HR'
      $.append div, node
      node = div.nextSibling

    node = node.nextElementSibling #skip text node
    unless node.nodeName is 'CENTER'
      threadHiding.thread node

updateFavicon = ->
  len = g.replies.length
  if g.dead
    if len > 0
      href = g.favDeadHalo
    else
      href = g.favDead
  else
    if len > 0
      href = g.favHalo
    else
      href = g.favDefault
  favicon = $ 'link[rel="shortcut icon"]', d
  clone = favicon.cloneNode true
  clone.href = href
  $.replace favicon, clone

updateTitle = ->
  len = g.replies.length
  d.title = d.title.replace /\d+/, len
  updateFavicon()

updater =
  init: ->
    html  = "<div class=move><span id=count></span> <span id=timer></span></div>"
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
    $.bind updNow,  'click', updater.update

    $.append d.body, dialog

    updater.cb.verbose.call    verbose
    updater.cb.autoUpdate.call autoUpT

  cb:
    verbose: (e) ->
      if @checked
        $.show $ '#count'
        $('#timer').textContent = if t = updater.timer then t else 'Thread Updater'
      else
        $.hide $ '#count'
        $('#timer').textContent = 'Thread Updater'
    autoUpdate: (e) ->
      timer = $ '#timer'
      if @checked
        timer.textContent = '-' + $.config 'Interval'
        updater.intervalID = window.setInterval updater.timeout, 1000
      else
        timer.textContent = 'Thread Updater'
        window.clearInterval updater.intervalID
    update: (e) ->
      count = $ '#count'
      timer = $ '#timer'

      if @status is 404
        count.textContent = 404
        count.className = 'error'
        timer.textContent = ''
        clearInterval updater.intervalID
        for input in $$ 'input[type=submit]'
          input.disabled = true
          input.value = 404
        s = d.title.match(/.+- /)[0]
        s += '404'
        # TODO
        #updateFavicon()
        return

      br = $ 'br[clear]'
      id = Number $('td[id]', br.previousElementSibling)?.id or 0

      arr = []
      body = $.el 'body',
        innerHTML: @responseText
      replies = $$ 'td[id]', body
      while (reply = replies.pop()) and (reply.id > id)
        arr.push reply.parentNode.parentNode.parentNode #table

      if $.config 'Verbose'
        timer.textContent = '-' + $.config 'Interval'
        count.textContent = '+' + arr.length
        if arr.length > 0
          count.className = 'new'

      #XXX add replies in correct order so /b/acklinks resolve
      while reply = arr.pop()
        $.before br, reply

  timeout: ->
    timer = $ '#timer'
    n = Number timer.textContent
    n += 1
    timer.textContent = n

    if n == 10
      updater.r.abort()
      count = $ '#count'
      counte.textContent = 'retry'
      count.className = ''
      n = 0

    if n == 0
      updater.update()

  update: ->
    updater.request?.abort()
    url = location.href #+ '?' + Date.now() # fool the cache
    cb = updater.cb.update
    updater.request = $.get url, cb

watcher =
  init: ->
    html = '<div class=move>Thread Watcher</div>'
    dialog = ui.dialog 'watcher', top: '50px', left: '0px', html
    $.append d.body, dialog

    #populate watcher
    watched = $.getValue 'watched', {}
    for board of watched
      for id, props of watched[board]
        watcher.addLink props, dialog

    #add watch buttons
    watchedBoard = watched[g.BOARD] or {}
    inputs = $$ 'form > input[value=delete], div.thread > input[value=delete]'
    for input in inputs
      id = input.name
      if id of watchedBoard
        src = g.favDefault
      else
        src = g.favEmpty
      favicon = $.el 'img',
        src: src
        className: 'favicon'
      $.bind favicon, 'click', watcher.cb.toggle
      $.before input, favicon

  addLink: (props, dialog) ->
    dialog or= $ '#watcher'
    div = $.el 'div'
    x = $.el 'a',
      textContent: 'X'
    $.bind x, 'click', watcher.cb.x
    link = $.el 'a', props

    $.append div, x, $.tn(' '), link
    $.append dialog, div

  cb:
    toggle: (e) ->
      watcher.toggle e.target.parentNode
    x: (e) ->
      [board, _, id] = e.target.nextElementSibling
        .getAttribute('href').substring(1).split('/')
      watcher.unwatch board, id

  toggle: (thread) ->
    favicon = $ 'img.favicon', thread
    id = favicon.nextSibling.name
    if favicon.src == g.favEmpty
      watcher.watch id, favicon
    else # favicon.src == g.favDefault
      watcher.unwatch g.BOARD, id

  unwatch: (board, id) ->
    href = "/#{board}/res/#{id}"
    div = $("#watcher a[href=\"#{href}\"]").parentNode
    $.remove div

    if input = $ "input[name=\"#{id}\"]"
      favicon = input.previousSibling
      favicon.src = g.favEmpty

    watched = $.getValue 'watched', {}
    delete watched[board][id]
    $.setValue 'watched', watched

  watch: (id, favicon) ->
    favicon.src = g.favDefault
    props =
      textContent: "/#{g.BOARD}/ - " +
        $.x('following-sibling::blockquote', favicon)
        .textContent.slice(0,25)
      href: "/#{g.BOARD}/res/#{id}"

    watched = $.getValue 'watched', {}
    watched[g.BOARD] or= {}
    watched[g.BOARD][id] = props
    $.setValue 'watched', watched

    watcher.addLink props

#main
NAMESPACE = 'AEOS.4chan_x.'
g =
  callbacks: []
  expand: false
  favDead: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAD/AAA9+90tAAAAAXRSTlMAQObYZgAAADtJREFUCB0FwUERxEAIALDszMG730PNSkBEBSECoU0AEPe0mly5NWprRUcDQAdn68qtkVsj3/84z++CD5u7CsnoBJoaAAAAAElFTkSuQmCC'
  favDeadHalo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVR4XrWSAQoAIAgD/f+njSApsTqjGoTQ5oGWPJMOOs60CzsWwIwz1I4PUIYh+WYEMGQ6I/txw91kP4oA9BdwhKp1My4xQq6e8Q9ANgDJjOErewFiNesV2uGSfGv1/HYAAAAASUVORK5CYII='
  favDefault: $('link[rel="shortcut icon"]', d)?.href or '' #no favicon in `post successful` page
  favEmpty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  flavors: [
    'http://regex.info/exif.cgi?url='
    'http://iqdb.org/?url='
    'http://tineye.com/search?url='
  ].join '\n'
  xhrs: []
g.favHalo = if /ws/.test g.favDefault then 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVR4XrWRQQoAIQwD+6L97j7Ih9WTQQxhDqJQCk4Mranuvqod6LgwawSqSuUmWSPw/UNlJlnDAmA2ARjABLYj8ZyCzJHHqOg+GdAKZmKPIQUzuYrxicHqEgHzP9g7M0+hj45sAnRWxtPj3zSPAAAAAElFTkSuQmCC' else 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABmzDP///8AAABet0i+AAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII='
pathname = location.pathname.substring(1).split('/')
[g.BOARD, temp] = pathname
if temp is 'res'
  g.REPLY = temp
  g.THREAD_ID = pathname[2]
else
  g.PAGENUM = parseInt(temp) || 0
g.hiddenReply = $.getValue "hiddenReply/#{g.BOARD}/", {}
tzOffset = (new Date()).getTimezoneOffset() / 60
# GMT -8 is given as +480; would GMT +8 be -480 ?
g.chanOffset = 5 - tzOffset# 4chan = EST = GMT -5
if $.isDST() then g.chanOffset -= 1

###
lastChecked = Number GM_getValue('lastChecked', '0')
now = Date.now()
DAY = 24 * 60 * 60
if lastChecked < now - 1*DAY
  cutoff = now - 7*DAY
  while g.hiddenThreads.length
    if g.hiddenThreads[0].timestamp > cutoff
      break
    g.hiddenThreads.shift()

  while g.hiddenReplies.length
    if g.hiddenReplies[0].timestamp > cutoff
      break
    g.hiddenReplies.shift()

  GM_setValue("hiddenThreads/#{g.BOARD}/", JSON.stringify(g.hiddenThreads))
  GM_setValue("hiddenReplies/#{g.BOARD}/", JSON.stringify(g.hiddenReplies))
  GM_setValue('lastChecked', now.toString())
###

$.addStyle '
  /* dialog styling */
  div.dialog {
    border: 1px solid;
  }
  div.dialog > div.move {
    cursor: move;
  }
  label, a {
    cursor: pointer;
  }

  #iHover {
    position: fixed;
  }
  #options textarea {
    height: 100px;
    width: 500px;
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
  #watcher {
    position: absolute;
  }
  #watcher > div.move {
    text-decoration: underline;
    padding: 5px 5px 0 5px;
  }
  #watcher > div:last-child {
    padding: 0 5px 5px 5px;
  }
  span.error {
    color: red;
  }
  #qr.auto:not(:hover) form {
    display: none;
  }
  #qr span.error {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  #qr {
    position: fixed;
  }
  #qr > div {
    text-align: right;
  }
  #qr > form > div, /* ad */
  #qr td.rules {
    display: none;
  }
  #options {
    position: fixed;
    padding: 5px;
    text-align: right;
  }
  form[name=delform] a img {
    border: 0px;
    float: left;
    margin: 0px 20px;
  }
  iframe {
    display: none;
  }
  #navlinks {
    position: fixed;
    top: 25px;
    right: 5px;
  }
  #navlinks > a {
    font-size: 16px;
  }
  div.thread.stub > *:not(.block) {
    display: none;
  }
  .hide {
    display: none;
  }
  .new {
    background: lime;
  }
  .favicon {
    cursor: pointer;
  }
'

if location.hostname is 'sys.4chan.org'
  qr.sys()
  return
if navtopr = $ '#navtopr'
  options.init()
else if $.config('404 Redirect') and d.title is '4chan - 404'
  redirect()
else
  return

#hack to tab from comment straight to recaptcha
for el in $$ '#recaptcha_table a'
  el.tabIndex = 1
recaptcha = $ '#recaptcha_response_field'
$.bind recaptcha, 'keydown', recaptchaListener

$.bind $('form[name=post]'), 'submit', qr.cb.submit

scroll = ->
  height = d.body.clientHeight
  for reply, i in g.replies
    bottom = reply.getBoundingClientRect().bottom
    if bottom > height #post is not completely read
      break
  if i is 0 then return
  g.replies = g.replies[i..]
  updateTitle()

#major features
if $.config 'Image Expansion'
  delform = $ 'form[name=delform]'
  expand = $.el 'div',
    innerHTML:
      "<select id=imageType name=imageType><option>full</option><option>fit width</option><option>fit screen</option></select>
      <label>Expand Images<input type=checkbox id=imageExpand></label>"
  imageType = GM_getValue 'imageType', 'full'
  for option in $$("option", expand)
    if option.textContent is imageType
      option.selected = true
      break
  $.bind $('select', expand), 'change', changeValue
  $.bind $('select', expand), 'change', imageTypeChange
  $.bind $('input', expand),  'click', imageExpandClick
  $.before delform.firstChild, expand

  g.callbacks.push (root) ->
    thumbs = $$ 'img[md5]', root
    for thumb in thumbs
      $.bind thumb.parentNode, 'click', imageClick
      if g.expand then imageToggle thumb.parentNode

if $.config 'Image Hover'
  imageHover.init()

if $.config 'Image Auto-Gif'
  g.callbacks.push (root) ->
    thumbs = $$ 'img[md5]', root
    for thumb in thumbs
      src = thumb.parentNode.href
      if /gif$/.test src
        thumb.src = src

if $.config 'Localize Time'
  g.callbacks.push (root) ->
    spans = $$ 'span[id^=no]', root
    for span in spans
      s = span.previousSibling
      [_, month, day, year, hour, min_sec] =
        s.textContent.match /(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\S+)/
      year = "20#{year}"
      month -= 1 #months start at 0
      hour = g.chanOffset + Number hour
      date = new Date year, month, day, hour
      year = date.getFullYear() - 2000
      month = $.zeroPad date.getMonth() + 1
      day = $.zeroPad date.getDate()
      hour = $.zeroPad date.getHours()
      dotw = [
        'Sun'
        'Mon'
        'Tue'
        'Wed'
        'Thu'
        'Fri'
        'Sat'
      ][date.getDay()]
      s.textContent = " #{month}/#{day}/#{year}(#{dotw})#{hour}:#{min_sec} "

if $.config 'Sauce'
  g.callbacks.push (root) ->
    spans = $$ 'span.filesize', root
    prefixes = GM_getValue('flavors', g.flavors).split '\n'
    names = (prefix.match(/(\w+)\./)[1] for prefix in prefixes)
    for span in spans
      suffix = $('a', span).href
      i = 0; l = names.length
      while i < l
        link = $.el 'a',
          textContent: names[i]
          href: prefixes[i] + suffix
        $.append span, $.tn(' '), link
        i++

if $.config 'Reply Hiding'
  replyHiding.init()

if $.config 'Quick Reply'
  qr.init()

if $.config 'Quick Report'
  g.callbacks.push (root) ->
    arr = $$('span[id^=no]', root)
    for el in arr
      a = $.el 'a',
        textContent: '[ ! ]'
      $.bind a, 'click', report
      $.after el, a
      $.after el, $.tn(' ')

if $.config 'Thread Watcher'
  watcher.init()

if $.config 'Anonymize'
  g.callbacks.push (root) ->
    names = $$('span.postername, span.commentpostername', root)
    for name in names
      name.innerHTML = 'Anonymous'
    trips = $$('span.postertrip', root)
    for trip in trips
      if trip.parentNode.nodeName is 'A'
        $.remove trip.parentNode
      else
        $.remove trip

if $.config 'Keybinds'
  keybinds.init()

if g.REPLY
  if $.config 'Thread Updater'
    updater.init()

  if $.config 'Image Preloading'
    g.callbacks.push (root) ->
      thumbs = $$ 'img[md5]', root
      for thumb in thumbs
        parent = thumb.parentNode
        el = $.el 'img', src: parent.href
  if $.config('Quick Reply') and $.config 'Persistent QR'
    qr.persist()
  if $.config 'Post in Title'
    unless text = $('span.filetitle').textContent
      text = $('blockquote').textContent
    if text
      d.title = "/#{g.BOARD}/ - #{text}"
  if $.config 'Unread Count'
    g.replies = []
    d.title = '(0) ' + d.title
    $.bind window, 'scroll', scroll
    g.callbacks.push (root) ->
      g.replies = g.replies.concat $$ 'td.reply, td.replyhl', root
      updateTitle()

else #not reply
  if $.config 'Thread Hiding'
    threadHiding.init()

  if $.config 'Thread Navigation'
    nav.init()

  if $.config 'Auto Watch'
    $.bind $('form[name=post]'), 'submit', autoWatch

  if $.config 'Thread Expansion'
    expandThread.init()

  if $.config 'Comment Expansion'
    as = $$('span.abbr a')
    for a in as
      $.bind a, 'click', expandComment

callback() for callback in g.callbacks
$.bind d.body, 'DOMNodeInserted', nodeInserted
