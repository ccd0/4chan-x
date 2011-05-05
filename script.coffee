# TODO
# option to skip post form directly to contents on first page,
# like what happens when using thread nav to go to next page
# (floating) qr no-quote button?
# updater cache hacks

# XXX chrome can't into `{log} = console`
if console?
  log = (arg) ->
    console.log arg

config =
  main:
    checkbox:
      '404 Redirect':      [true,  'Redirect dead threads']
      'Anonymize':         [false, 'Make everybody anonymous']
      'Auto Watch':        [true,  'Automatically watch threads that you start']
      'Comment Expansion': [true,  'Expand too long comments']
      'Cooldown':          [false, 'Prevent \'flood detected\' errors (buggy)']
      'Image Auto-Gif':    [false, 'Animate gif thumbnails']
      'Image Expansion':   [true,  'Expand images']
      'Image Hover':       [false, 'Show full image on mouseover']
      'Image Preloading':  [false, 'Preload Images']
      'Keybinds':          [false, 'Binds actions to keys']
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
    textarea:
      flavors: [
        'http://regex.info/exif.cgi?url='
        'http://iqdb.org/?url='
        'http://tineye.com/search?url='
      ].join '\n'
  updater:
    checkbox:
      'Verbose':     [true,  'Show countdown timer, new post count']
      'Auto Update': [false, 'Automatically fetch new posts']
    'Interval': 30

# FIXME this is fucking horrible
# create 'global' options, no namespacing
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
    el.querySelector('div.move').addEventListener 'mousedown', ui.dragstart, true
    el.querySelector('div.move a[name=close]')?.addEventListener 'click',
      (-> el.parentNode.removeChild(el)), true
    el
  dragstart: (e) ->
    ui.el = el = e.target.parentNode
    d = document
    d.body.className = 'noselect'
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
  dragend: ->
    #{id} = {el} = ui
    #equivalent to
    #{id} = ui; {el} = ui
    {el} = ui
    {id} = el
    localStorage["#{id}Left"] = el.style.left
    localStorage["#{id}Top"]  = el.style.top
    d = document
    d.body.className = ''
    d.removeEventListener 'mousemove', ui.drag, true
    d.removeEventListener 'mouseup',   ui.dragend, true

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
    $.remove script
  get: (url, cb) ->
    r = new XMLHttpRequest()
    r.onload = cb
    r.open 'get', url, true
    r.send()
    r
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
  result = root.querySelectorAll selector
  node for node in result

#funks
expandComment =
  init: ->
    for a in $$ 'span.abbr a'
      $.bind a, 'click', expandComment.cb.expand

  cb:
    expand: (e) ->
      e.preventDefault()
      a = e.target
      a.textContent = 'Loading...'
      href = a.getAttribute 'href'
      [_, threadID, replyID] = href.match /(\d+)#(\d+)/
      g.cache[threadID] = $.get href, (->
        expandComment.load this, a, threadID, replyID)
  load: (xhr, a, threadID, replyID) ->
    body = $.el 'body',
      innerHTML: xhr.responseText

    if threadID is replyID
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
      thread = e.target.parentNode
      expandThread.toggle thread

    load: (xhr, thread, a) ->
      if xhr.status is 404
        a.textContent.replace 'X Loading...', '404'
        $.unbind a, 'click', expandThread.cb.toggle
      else
        html = xhr.responseText
        id = thread.firstChild.id
        g.cache[id] = html
        expandThread.expand html, thread, a

  toggle: (thread) ->
    id = thread.firstChild.id
    a = $ 'a.omittedposts', thread

    switch a.textContent[0]
      when '+'
        a.textContent = a.textContent.replace '+', 'X Loading...'
        if html = g.cache[id]
          expandThread.expand html, thread, a
        else
          g.requests[id] =
            $.get "res/#{id}", (-> expandThread.cb.load this, thread, a)

      when 'X'
        a.textContent = a.textContent.replace 'X Loading...', '+'
        g.requests[id].abort()

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
        if id of g.hiddenReplies
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
    thread = nav.getThread()
    switch keybinds.key
      when '0'
        window.location = "/#{g.BOARD}/#0"
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
      imgExpand.toggle thumb

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
    html += "<div><textarea style=\"display: none;\" name=flavors>#{$.config 'flavors'}</textarea></div>"

    hiddenThreads = $.getValue "hiddenThreads/#{g.BOARD}/", {}
    hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length
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
      $.deleteValue "hiddenReplies/#{g.BOARD}/"
      $.deleteValue "hiddenThreads/#{g.BOARD}/"
      @value = "hidden: 0"
      g.hiddenReplies = {}

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
        error = $.el 'span',
          className: 'error'
          textContent: data
        $.append dialog, error
        qr.autohide.unset()
      else # success
        if dialog
          if $.config 'Persistent QR'
            qr.refresh dialog
          else
            $.remove dialog
        if $.config 'Cooldown'
          qr.cooldown true

      Recaptcha.reload()
      $('iframe[name=iframe]').src = 'about:blank'

    node: (root) ->
      quotes = $$ 'a.quotejs:not(:first-child)', root
      for quote in quotes
        $.bind quote, 'click', qr.cb.quote

    submit: (e) ->
      form = e.target
      isQR = form.parentNode.id == 'qr'

      if isQR
        if span = @nextSibling
          $.remove span

      if $.config 'Cooldown'
        # check if we've posted on this board in another tab
        if qr.cooldown()
          e.preventDefault()
          alert 'Stop posting so often!'

          if isQR
            span = $.el 'span',
              className: 'error'
              textContent: 'Stop posting so often!'
            $.append @parentNode, span

          return

      recaptcha = $('input[name=recaptcha_response_field]', this)
      if recaptcha.value
        qr.sage = $('input[name=email]', form).value == 'sage'
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
      qr.quote e.target

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

  cooldown: (restart) ->
    now = Date.now()

    if restart
      duration = if qr.sage then 60 else 30
      qr.cooldownStart duration
      $.setValue "#{g.BOARD}/cooldown", now + duration * 1000
      return

    end = $.getValue "#{g.BOARD}/cooldown", 0
    if now < end
      duration = Math.ceil (end - now) / 1000
      qr.cooldownStart duration
      return true

  cooldownStart: (duration) ->
    submits = $$ '#qr input[type=submit], form[name=post] input[type=submit]'
    for submit in submits
      submit.value = duration
      submit.disabled = true
    qr.cooldownIntervalID = window.setInterval qr.cooldownCB, 1000
    qr.duration = duration

  cooldownCB: ->
    qr.duration = qr.duration - 1

    submits = $$ '#qr input[type=submit], form[name=post] input[type=submit]'
    for submit in submits
      if qr.duration == 0
        submit.disabled = false
        submit.value = 'Submit'
      else
        submit.value = qr.duration

    if qr.duration == 0
      clearInterval qr.cooldownIntervalID

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
    $.bind $('input[name=recaptcha_response_field]', clone), 'keydown', Recaptcha.listener

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
    if recaptcha = $ '#recaptcha_response_field' #post reporting
      $.bind recaptcha, 'keydown', Recaptcha.listener
      return

    c = $('b').lastChild
    if c.nodeType is 8 #comment node
      [_, thread, id] = c.textContent.match(/thread:(\d+),no:(\d+)/)
      if thread is '0'
        [_, board] = $('meta', d).content.match(/4chan.org\/(\w+)\//)
        window.location = "http://boards.4chan.org/#{board}/res/#{id}#watch"
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

threading =
  init: ->
    # don't thread image controls
    node = $ 'form[name=delform] > *:not([id])'
    # don't confuse other scripts *cough*/b/ackwash*cough*
    # gotta have a named function to unbind.
    $.bind   d, 'DOMNodeInserted', threading.stopPropagation
    threading.thread node
    $.unbind d, 'DOMNodeInserted', threading.stopPropagation

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
    #{N,}SFW
    unless node.align or node.nodeName is 'CENTER'
      threading.thread node

  stopPropagation: (e) ->
    e.stopPropagation()

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
        clearInterval updater.intervalID
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

    #populate watcher
    watched = $.getValue 'watched', {}
    watcher.refresh watched

    #add watch buttons
    watchedBoard = watched[g.BOARD] or {}
    inputs = $$ 'form > input[value=delete], div.thread > input[value=delete]'
    for input in inputs
      id = input.name
      if id of watchedBoard
        src = Favicon.default
      else
        src = Favicon.empty
      favicon = $.el 'img',
        src: src
        className: 'favicon'
      $.bind favicon, 'click', watcher.cb.toggle
      $.before input, favicon

  refresh: (watched) ->
    for div in $$ '#watcher > div:not(.move)'
      $.remove div
    for board of watched
      for id, props of watched[board]
        watcher.addLink props, $ '#watcher'

  addLink: (props, dialog) ->
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
    if favicon.src == Favicon.empty
      watcher.watch thread
    else # favicon.src == Favicon.default
      watcher.unwatch g.BOARD, id

  unwatch: (board, id) ->
    if input = $ "input[name=\"#{id}\"]"
      favicon = input.previousSibling
      favicon.src = Favicon.empty

    watched = $.getValue 'watched', {}
    delete watched[board][id]
    $.setValue 'watched', watched

    watcher.refresh watched

  watch: (thread) ->
    favicon = $ 'img.favicon', thread

    #this happens if we try to auto-watch an already watched thread.
    return if favicon.src is Favicon.default

    favicon.src = Favicon.default
    id = favicon.nextSibling.name
    tc = $('span.filetitle', thread).textContent or $('blockquote', thread).textContent
    props =
      textContent: "/#{g.BOARD}/ - #{tc[...25]}"
      href: "/#{g.BOARD}/res/#{id}"

    watched = $.getValue 'watched', {}
    watched[g.BOARD] or= {}
    watched[g.BOARD][id] = props
    $.setValue 'watched', watched

    watcher.refresh watched

anonymize =
  init: ->
    g.callbacks.push anonymize.cb.node
  cb:
    node: (root) ->
      names = $$ 'span.postername, span.commentpostername', root
      for name in names
        name.innerHTML = 'Anonymous'
      for trip in $$ 'span.postertrip', root
        if trip.parentNode.nodeName is 'A'
          $.remove trip.parentNode
        else
          $.remove trip

sauce =
  init: ->
    g.callbacks.push sauce.cb.node
  cb:
    node: (root) ->
      prefixes = $.config('flavors').split '\n'
      names = (prefix.match(/(\w+)\./)[1] for prefix in prefixes)
      for span in $$ 'span.filesize', root
        suffix = $('a', span).href
        for prefix, i in prefixes
          link = $.el 'a',
            textContent: names[i]
            href: prefix + suffix
          $.append span, $.tn(' '), link

localize =
  init: ->
    g.callbacks.push (root) ->
      for span in $$ 'span[id^=no]', root
        s = span.previousSibling
        [_, month, day, year, hour, min_sec] =
          s.textContent.match /(\d+)\/(\d+)\/(\d+)\(\w+\)(\d+):(\S+)/
        year = "20#{year}"
        month -= 1 #months start at 0
        hour = g.chanOffset + Number hour
        date = new Date year, month, day, hour
        year = date.getFullYear() - 2000
        month = $.zeroPad date.getMonth() + 1
        day   = $.zeroPad date.getDate()
        hour  = $.zeroPad date.getHours()
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

titlePost =
  init: ->
    if tc = $('span.filetitle').textContent or $('blockquote').textContent
      d.title = "/#{g.BOARD}/ - #{tc}"

quickReport =
  init: ->
    g.callbacks.push quickReport.cb.node
  cb:
    node: (root) ->
      arr = $$ 'span[id^=no]', root
      for el in arr
        a = $.el 'a',
          textContent: '[ ! ]'
        $.bind a, 'click', quickReport.cb.report
        $.after el, a
        $.after el, $.tn(' ')
    report: (e) ->
      {target} = e
      quickReport.report target
  report: (target) ->
    input = $.x('preceding-sibling::input[1]', target)
    input.click()
    $('input[value="Report"]').click()
    input.click()

unread =
  init: ->
    unread.replies = []
    d.title = '(0) ' + d.title
    $.bind window, 'scroll', unread.cb.scroll
    g.callbacks.push unread.cb.node

  cb:
    node: (root) ->
      unread.replies = unread.replies.concat $$ 'td[id]', root
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
    clone.setAttribute 'type', 'image/x-icon'
    $.replace favicon, clone


redirect = ->
  switch g.BOARD
    when 'a', 'g', 'lit', 'sci', 'tv'
      url = "http://green-oval.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when 'jp', 'm', 'tg'
      url = "http://archive.easymodo.net/cgi-board.pl/#{g.BOARD}/thread/#{g.THREAD_ID}"
    when '3', 'adv', 'an', 'c', 'ck', 'co', 'fa', 'fit', 'int', 'k', 'mu', 'n', 'o', 'p', 'po', 'soc', 'sp', 'toy', 'trv', 'v', 'vp', 'x'
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
    $('#recaptcha_image img', dialog).src = "http://www.google.com/recaptcha/api/image?c=" + target.value
    $('#recaptcha_challenge_field', dialog).value = target.value

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

  cb:
    node: (root) ->
      for thumb in $$ 'img[md5]', root
        $.bind thumb.parentNode, 'click', imgExpand.cb.toggle
        if imgExpand.on then imgExpand.toggle thumb
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.button isnt 0
      e.preventDefault()
      imgExpand.toggle e.target
    all: (e) ->
      thumbs = $$ 'img[md5]'
      imgExpand.on = e.target.checked
      imgExpand.foo()
      if imgExpand.on #expand
        for thumb in thumbs
          unless thumb.style.display #thumbnail hidden, image already expanded
            imgExpand.expand thumb
      else #contract
        for thumb in thumbs
          if thumb.style.display #thumbnail hidden - unhide it
            imgExpand.contract thumb
    typeChange: (e) ->
      imgExpand.foo()
      for img in $$ 'img[md5] + img'
        imgExpand.resize img

  toggle: (img) ->
    thumb = img.parentNode.firstChild
    imgExpand.foo()
    if thumb.style.display
      imgExpand.contract thumb
    else
      imgExpand.expand thumb

  contract: (thumb) ->
    $.show thumb
    $.remove thumb.nextSibling

  expand: (thumb) ->
    $.hide thumb
    a = thumb.parentNode
    img = $.el 'img',
      src: a.href
    a.appendChild img

    imgExpand.resize img

  foo: ->
    formWidth = $('form[name=delform]').getBoundingClientRect().width
    if td = $('td.reply')
      table = td.parentNode.parentNode.parentNode
      left = td.getBoundingClientRect().left - table.getBoundingClientRect().left
      crap = td.getBoundingClientRect().width - parseInt(getComputedStyle(td).width)

    imgExpand.maxWidthOP    = formWidth
    imgExpand.maxWidthReply = formWidth - left - crap
    imgExpand.maxHeight = d.body.clientHeight
    imgExpand.type = $('#imageType').value

  resize: (img) ->
    {maxWidthOP, maxWidthReply, maxHeight, type} = imgExpand
    [_, imgWidth, imgHeight] = $
      .x("preceding::span[@class][1]/text()[2]", img)
      .textContent.match(/(\d+)x(\d+)/)
    imgWidth  = Number imgWidth
    imgHeight = Number imgHeight

    if img.parentNode.parentNode.nodeName == 'TD'
      maxWidth = maxWidthReply
    else
      maxWidth = maxWidthOP

    switch type
      when 'full'
        img.removeAttribute 'style'
      when 'fit width'
        if imgWidth > maxWidth
          img.style.width = maxWidth
      when 'fit screen'
        ratio = Math.min maxWidth/imgWidth, maxHeight/imgHeight
        if ratio < 1
          img.style.width = Math.floor ratio * imgWidth

  dialog: ->
    controls = $.el 'div',
      id: 'imgControls'
      innerHTML:
        "<select id=imageType name=imageType><option>full</option><option>fit width</option><option>fit screen</option></select>
        <label>Expand Images<input type=checkbox id=imageExpand></label>"
    imageType = $.getValue 'imageType', 'full'
    for option in $$ 'option', controls
      if option.textContent is imageType
        option.selected = true
        break
    $.bind $('select', controls), 'change', $.cb.value
    $.bind $('select', controls), 'change', imgExpand.cb.typeChange
    $.bind $('input',  controls), 'click',  imgExpand.cb.all

    delform = $ 'form[name=delform]'
    $.prepend delform, controls

#main
NAMESPACE = 'AEOS.4chan_x.'
g =
  cache: {}
  requests: {}
  callbacks: []

main =
  init: ->
    pathname = location.pathname.substring(1).split('/')
    [g.BOARD, temp] = pathname
    if temp is 'res'
      g.REPLY = temp
      g.THREAD_ID = pathname[2]
    else
      g.PAGENUM = parseInt(temp) || 0

    if location.hostname is 'sys.4chan.org'
      qr.sys()
      return
    if $.config('404 Redirect') and d.title is '4chan - 404' and /^\d+$/.test g.THREAD_ID
      redirect()
      return
    if not $ '#navtopr'
      return

    Favicon.halo = if /ws/.test Favicon.default then Favicon.haloSFW else Favicon.haloNSFW
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

    Recaptcha.init()

    $.bind $('form[name=post]'), 'submit', qr.cb.submit

    #major features
    if $.config 'Cooldown'
      qr.cooldown()

    if $.config 'Image Expansion'
      imgExpand.init()

    if $.config 'Image Auto-Gif'
      imgGif.init()

    if $.config 'Localize Time'
      localize.init()

    if $.config 'Sauce'
      sauce.init()

    if $.config 'Anonymize'
      anonymize.init()

    if $.config 'Image Hover'
      imageHover.init()

    if $.config 'Reply Hiding'
      replyHiding.init()

    if $.config 'Quick Reply'
      qr.init()

    if $.config 'Quick Report'
      quickReport.init()

    if $.config 'Thread Watcher'
      watcher.init()

    if $.config 'Keybinds'
      keybinds.init()

    if g.REPLY
      if $.config 'Thread Updater'
        updater.init()

      if $.config 'Image Preloading'
        imgPreloading.init()

      if $.config('Quick Reply') and $.config 'Persistent QR'
        qr.persist()

      if $.config 'Post in Title'
        titlePost.init()

      if $.config 'Unread Count'
        unread.init()

      if $.config('Auto Watch') and location.hash is '#watch'
        watcher.watch()

    else #not reply
      threading.init()

      if $.config 'Thread Hiding'
        threadHiding.init()

      if $.config 'Thread Navigation'
        nav.init()

      if $.config 'Thread Expansion'
        expandThread.init()

      if $.config 'Comment Expansion'
        expandComment.init()

    callback() for callback in g.callbacks
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
      label, a {
        cursor: pointer;
      }

      .new {
        background: lime;
      }
      .favicon {
        cursor: pointer;
      }
      .error {
        color: red;
      }

      div.thread.stub > *:not(.block) {
        display: none;
      }

      form[name=delform] a img {
        border: 0px;
        float: left;
      }
      form[name=delform] a img:first-child {
        margin: 0px 20px;
      }
      iframe {
        display: none;
      }

      #iHover {
        position: fixed;
      }

      #navlinks {
        position: fixed;
        top: 25px;
        right: 5px;
      }
      #navlinks > a {
        font-size: 16px;
      }

      #options {
        position: fixed;
        padding: 5px;
        text-align: right;
      }
      #options textarea {
        height: 100px;
        width: 500px;
      }

      #qr {
        position: fixed;
      }
      #qr > div.move {
        text-align: right;
      }
      #qr > form > div, /* ad */
      #qr #recaptcha_table td:nth-of-type(3), /* captcha logos */
      #qr td.rules {
        display: none;
      }
      #qr.auto:not(:hover) form {
        display: none;
      }
      #qr span.error {
        position: absolute;
        bottom: 0;
        left: 0;
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

      body.noselect {
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        user-select: none;
      }
    '

main.init()
