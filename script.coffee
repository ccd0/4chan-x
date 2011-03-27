{log} = console if console?

config =
  '404 Redirect':      [true,  'Redirect dead threads']
  'Anonymize':         [false, 'Make everybody anonymous']
  'Auto Watch':        [true,  'Automatically watch threads that you start (Firefox only)']
  'Comment Expansion': [true,  'Expand too long comments']
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
  'Reply Navigation':  [false, 'Navigate to the beginning / end of a thread']
  'Sauce':             [true,  'Add sauce to images']
  'Show Stubs':        [true,  'Of hidden threads / replies']
  'Thread Expansion':  [true,  'View all replies']
  'Thread Hiding':     [true,  'Hide entire threads']
  'Thread Navigation': [true,  'Navigate to previous / next thread']
  'Thread Updater':    [true,  'Update threads']
  'Thread Watcher':    [true,  'Bookmark threads']
  'Unread Count':      [true,  'Show unread post count in tab title']

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
  window.GM_addStyle = (css) ->
    style = document.createElement 'style'
    style.type = 'text/css'
    style.textContent = css
    document.getElementsByTagName('head')[0].appendChild style
  window.GM_openInTab = (url) ->
    window.open url, "_blank"

ui =
  dialog: (id, position, html) ->
    ui.el = el = document.createElement 'div'
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
    left = localStorage["#{id}Left"] or left
    top  = localStorage["#{id}Top"]  or top
    if left then el.style.left = left else el.style.right  = '0px'
    if top  then el.style.top  = top  else el.style.bottom = '0px'
    el.querySelector('div.move').addEventListener 'mousedown', ui.move, true
    el.querySelector('div.move a[name=close]')?.addEventListener 'click',
      (-> el.parentNode.removeChild(el)), true
    el
  move: (e) ->
    {el} = ui
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
  config: (name) ->
    GM_getValue name, config[name][0]
  zeroPad: (n) ->
    if n < 10 then '0' + n else n
  slice: (arr, id) ->
    # do I actually need this?
    for el, i in arr
      if id == el.id
        arr.splice i, 1
        return arr
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

clearHidden = ->
  #'hidden' might be misleading; it's the number of IDs we're *looking* for,
  # not the number of posts actually hidden on the page.
  GM_deleteValue("hiddenReplies/#{g.BOARD}/")
  GM_deleteValue("hiddenThreads/#{g.BOARD}/")
  @value = "hidden: 0"
  g.hiddenReplies = []
  g.hiddenThreads = []

editSauce = ->
  ta = $ '#options textarea'
  if ta.style.display then $.show ta else $.hide ta

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

expandThread = ->
  id = $.x('preceding-sibling::input[1]', this).name
  span = this
  #close expanded thread
  if span.textContent[0] is '-'
    #goddamit moot
    num = if board is 'b' then 3 else 5
    table = $.x "following::br[@clear][1]/preceding::table[#{num}]", span
    while (prev = table.previousSibling) and (prev.nodeName is 'TABLE')
      $.remove prev
    span.textContent = span.textContent.replace '-', '+'
    return
  span.textContent = span.textContent.replace '+', 'X Loading...'
  #load cache
  for xhr in g.xhrs
    if xhr.id == id
      #why can't we just xhr.r.onload()?
      onloadThread xhr.r.responseText, span
      return
  #create new request
  r = new XMLHttpRequest()
  r.onload = ->
    onloadThread @responseText, span
  r.open 'GET', "res/#{id}", true
  r.send()
  g.xhrs.push {
    r: r,
    id: id
  }

getThread = ->
  threads = $$ 'div.thread'
  for thread, i in threads
    bottom = thread.getBoundingClientRect().bottom
    if bottom > 0 #we have not scrolled past
      return [thread, i]

hideReply = (reply) ->
  if p = @parentNode
    reply = p.nextSibling
    g.hiddenReplies.push {
      id: reply.id
      timestamp: Date.now()
    }
    GM_setValue("hiddenReplies/#{g.BOARD}/", JSON.stringify(g.hiddenReplies))
  name = $('span.commentpostername', reply).textContent
  trip = $('span.postertrip', reply)?.textContent or ''
  table = $.x 'ancestor::table', reply
  $.hide table
  if $.config 'Show Stubs'
    a = $.el 'a',
      textContent: "[ + ] #{name} #{trip}"
      className: 'pointer'
    $.bind a, 'click', showReply
    div = $.el 'div'
    $.append div, a
    $.before table, div

hideThread = (div) ->
  if p = @parentNode
    div = p
    g.hiddenThreads.push {
      id: div.id
      timestamp: Date.now()
    }
    GM_setValue("hiddenThreads/#{g.BOARD}/", JSON.stringify(g.hiddenThreads))
  $.hide div
  if $.config 'Show Stubs'
    if span = $ '.omittedposts', div
      num = Number(span.textContent.match(/\d+/)[0])
    else
      num = 0
    num += $$('table', div).length
    text = if num is 1 then "1 reply" else "#{num} replies"
    name = $('span.postername', div).textContent
    trip = $('span.postername + span.postertrip', div)?.textContent || ''
    a = $.el 'a',
      textContent: "[ + ] #{name}#{trip} (#{text})"
      className: 'pointer'
    $.bind a, 'click', showThread
    $.before div, a

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
        thumb.addEventListener 'mouseover', imageHover.cb.mouseover, true
    mouseover: (e) ->
      {target, clientX, clientY} = e
      img = $ '#iHover'
      img.src = target.parentNode.href
      $.show img
      imageHover.winHeight = d.body.clientHeight
      imageHover.winWidth  = d.body.clientWidth
      target.addEventListener 'mousemove', imageHover.cb.mousemove, true
      target.addEventListener 'mouseout',  imageHover.cb.mouseout,  true
    mousemove: (e) ->
      {clientX, clientY} = e
      img = $ '#iHover'
      imgHeight = img.offsetHeight

      top = clientY + imageHover.offset.y
      bot = top + imgHeight
      log bot, imageHover.winHeight
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
      target.removeEventListener 'mousemove', imageHover.cb.mousemove, true
      target.removeEventListener 'mouseout',  imageHover.cb.mouseout,  true

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

keydown = (e) ->
  kc = e.keyCode
  g.keyCode = kc
  g.char = String.fromCharCode kc

keypress = (e) ->
  if d.activeElement.nodeName in ['TEXTAREA', 'INPUT']
    keyModeInsert e
  else
    keyModeNormal e

keyModeInsert = (e) ->
  kc = g.keyCode
  char = g.char
  if kc is 27 #escape
    $.remove $ '#qr'
    e.preventDefault()
  else if e.ctrlKey and char is "S"
    ta = d.activeElement
    return unless ta.nodeName is 'TEXTAREA'

    value  = ta.value
    selStart = ta.selectionStart
    selEnd   = ta.selectionEnd

    valStart = value[0...selStart] + '[spoiler]'
    valMid   = value[selStart...selEnd]
    valEnd   = '[/spoiler]' + value[selEnd..]

    ta.value = valStart + valMid + valEnd
    range = valStart.length + valMid.length
    ta.setSelectionRange range, range
    e.preventDefault()

keyModeNormal = (e) ->
  return if e.ctrlKey or e.altKey
  char = g.char
  hash = location.hash
  switch char
    when "0"
      location.pathname = "/#{g.BOARD}"
    when "G"
      if e.shiftKey
        window.scrollTo 0, 99999
      else
        window.scrollTo 0, 0
        location.hash = ''
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

onloadThread = (responseText, span) ->
  [replies, opbq] = parseResponse responseText
  span.textContent = span.textContent.replace 'X Loading...', '- '
  #make sure all comments are fully expanded
  span.previousSibling.innerHTML = opbq.innerHTML
  while (next = span.nextSibling) and not next.clear#<br clear>
    $.remove next
  if next
    for reply in replies
      $.before next, $.x('ancestor::table', reply)
  else#threading
    div = span.parentNode
    for reply in replies
      $.append div, $.x('ancestor::table', reply)

changeCheckbox = ->
  GM_setValue @name, @checked

changeValue = ->
  GM_setValue @name, @value

options = ->
  if div = $ '#options'
    $.remove div
    return

  hiddenNum = g.hiddenReplies.length + g.hiddenThreads.length
  html = '<div class="move">Options <a name=close>X</a></div><div>'
  for option, value of config
    description  = value[1]
    checked = if $.config option then "checked" else ""
    html += "<label title=\"#{description}\">#{option}<input #{checked} name=\"#{option}\" type=\"checkbox\"></label><br>"
  html += "<div><a class=sauce>Flavors</a></div>"
  html += "<div><textarea style=\"display: none;\" name=flavors>#{GM_getValue 'flavors', g.flavors}</textarea></div>"
  html += "<input type=\"button\" value=\"hidden: #{hiddenNum}\"><br>"
  html += "<hr>"
  html += "<div><a href=\"http://chat.now.im/x/aeos\">support</a></div>"
  html += '<div><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=2DBVZBUAM4DHC&lc=US&item_name=Aeosynth&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted"><img alt="Donate" src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif"/></a></div>'

  div = ui.dialog 'options', 'center', html

  for input in $$ 'input[type="checkbox"]', div
    input.addEventListener 'change', changeCheckbox, true
  $('a.sauce', div).addEventListener 'click', editSauce, true
  $('textarea', div).addEventListener 'change', changeValue, true
  $('input[type="button"]', div).addEventListener 'click', clearHidden, true
  $.append d.body, div

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
      e.target.contentWindow.postMessage '', '*'

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
      if span = @nextSibling
        $.remove span
      recaptcha = $('input[name=recaptcha_response_field]', this)
      if recaptcha.value
        qr.autohide.set()
        g.sage = $('#qr input[name=email]').value == 'sage'
      else
        e.preventDefault()
        span = $.el 'span',
          className: 'error'
          textContent: 'You forgot to type in the verification.'
        $.append @parentNode, span
        alert 'You forgot to type in the verification.'
        recaptcha.focus()

    quote: (e) ->
      e.preventDefault()
      {target} = e
      unless dialog = $ '#qr'
        dialog = qr.dialog target
      qr.autohide.unset()

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
      submit = $ 'input[type=submit]', qr
      submit.value = if g.sage then 60 else 30
      submit.disabled = true
      window.setTimeout qr.cooldown, 1000
      auto = submit.previousSibling.lastChild
      if auto.checked
        #unhide the qr so you know it's ready for the next item
        $('input[title=autohide]:checked', qr)?.click()

  cooldown: ->
    submit = $ '#qr input[type=submit]'
    seconds = parseInt submit.value
    if seconds == 0
      submit.disabled = false
      submit.value = 'Submit'
      auto = submit.previousSibling.lastChild
      if auto.checked
        $('#qr form').submit()
        #submit.click() doesn't work
    else
      submit.value = seconds - 1
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
      input = $.el 'input',
        type: 'hidden'
        name: 'resto'
        value: $.x(xpath, link).name
      $.append clone, input
    else if $.config 'Persistent QR'
      submit = $ 'input[type=submit]', clone
      auto = $.el 'label',
        textContent: 'Auto'
      autobox = $.el 'input',
        type: 'checkbox'
      $.append auto, autobox
      $.before submit, auto

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

showReply = ->
  div = @parentNode
  table = div.nextSibling
  $.show table
  $.remove div
  id = $('td.reply, td.replyhl', table).id
  $.slice g.hiddenReplies, id
  GM_setValue "hiddenReplies/#{g.BOARD}/", JSON.stringify(g.hiddenReplies)

showThread = ->
  div = @nextSibling
  $.show div
  $.hide this
  id = div.id
  $.slice g.hiddenThreads, id
  GM_setValue("hiddenThreads/#{g.BOARD}/", JSON.stringify(g.hiddenThreads))

stopPropagation = (e) ->
  e.stopPropagation()

threadF = (current) ->
  div = $.el 'div',
    className: 'thread'
  a = $.el 'a',
    textContent: '[ - ]'
    className: 'pointer'
  $.bind a, 'click', hideThread
  $.append div, a
  $.before current, div
  while (!current.clear)#<br clear>
    $.append div, current
    current = div.nextSibling
  $.append div, current
  current = div.nextSibling
  id = $('input[value="delete"]', div).name
  div.id = id
  #check if we should hide the thread
  for hidden in g.hiddenThreads
    if id == hidden.id
      hideThread(div)
  current = current.nextSibling.nextSibling
  if current.nodeName isnt 'CENTER'
    threadF(current)

request = (url, callback) ->
  r = new XMLHttpRequest()
  r.onload = callback
  r.open 'get', url, true
  r.send()
  r

updateCallback = ->
  count = $ '#updater #count'
  timer = $ '#updater #timer'
  if @status is 404
    count.textContent = 404
    count.className = 'error'
    timer.textContent = ''
    clearInterval g.interval
    for input in $$ 'input[type=submit]'
      input.disabled = true
      input.value = 404
    s = ''
    if $.config 'Unread Count' then s += "(#{g.replies.length}) "
    s += "/#{g.BOARD}/ - 404"
    d.title = s
    g.dead = true
    updateFavicon()
    return
  body = $.el 'body', innerHTML: @responseText
  replies = $$ 'td.reply', body

  root = $('br[clear]')
  if reply = $ 'td.reply, td.replyhl', root.previousElementSibling
    id = Number reply.id
  else
    id = 0

  arr = []
  while (reply = replies.pop()) and (Number reply.id > id)
    arr.push reply

  if g.verbose
    l = arr.length
    count.textContent = "+#{l}"
    count.className = if l > 0 then 'new' else ''

  #insert replies in order, so backlinks resolve
  while reply = arr.pop()
    table = $.x 'ancestor::table', reply
    $.before root, table

  timer.textContent = -1 * GM_getValue 'Interval', 10

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

updateTime = ->
  span = $ '#updater #timer'
  time = Number span.textContent
  if ++time is 0
    updateNow()
  else if time > 10
    time = 0
    g.req.abort()
    updateNow()
    if g.verbose
      count = $ '#updater #count'
      count.textContent = 'retry'
      count.className = ''
  else
    span.textContent = time

updateTitle = ->
  len = g.replies.length
  d.title = d.title.replace /\d+/, len
  updateFavicon()

updateAuto = ->
  span = $ '#updater #timer'
  if @checked
    span.textContent = -1 * GM_getValue 'Interval', 10
    g.interval = window.setInterval updateTime, 1000
  else
    span.textContent = 'Thread Updater'
    clearInterval g.interval

updateInterval = ->
  unless num = Number @value
    num = 10
  @value = num
  GM_setValue 'Interval', num

  span = $ '#updater #timer'
  if 0 > Number span.textContent
    span.textContent = -1 * num

updateNow = ->
  url = location.href + '?' + Date.now() # fool the cache
  g.req = request url, updateCallback
  $("#updater #timer").textContent = 0

updateVerbose = ->
  g.verbose = @checked
  timer = $ '#updater #timer'
  if @checked
    timer.hidden = false
  else
    timer.hidden = true
    $("#updater #count").textContent = 'Thread Updater'

updaterMake = ->
  html  = "<div class=move><span id=count>Thread Updater</span> <span id=timer></span></div>"
  html += "<div><label>Verbose<input type=checkbox name=verbose></label></div>"
  html += "<div><label title=\"Make all threads auto update\">Auto Update Global<input type=checkbox name=autoG></label></div>"
  html += "<div><label title=\"Make this thread auto update\">Auto Update Local<input type=checkbox name=autoL></label></div>"
  html += "<div><label>Interval (s)<input type=text name=interval></label></div>"
  html += "<div><input type=button value='Update Now'></div>"
  div = ui.dialog 'updater', 'bottomright', html

  for input in $$ 'input[type=checkbox]', div
    input.addEventListener 'click', changeCheckbox, true
    name = input.name
    if name is 'autoL'
      input.checked = GM_getValue 'autoG', true
    else
      input.checked = GM_getValue name, true
    switch name
      when 'autoL'
        input.addEventListener 'click', updateAuto, true
      when 'verbose'
        input.addEventListener 'click', updateVerbose, true

  unless g.verbose = GM_getValue 'verbose', true
    $("#timer", div).hidden = true

  interval = $ 'input[name=interval]', div
  interval.value = GM_getValue 'Interval', 10
  interval.addEventListener 'change', updateInterval, true

  $('input[type=button]', div).addEventListener 'click', updateNow, true

  d.body.appendChild div

  if GM_getValue 'autoG' then updateAuto.call $("input[name=autoL]", div)

watch = ->
  id = @nextSibling.name
  if @src is g.favEmpty
    @src = g.favDefault
    text = "/#{g.BOARD}/ - " +
      $.x('following-sibling::blockquote', this).textContent.slice(0,25)
    g.watched[g.BOARD] or= []
    g.watched[g.BOARD].push {
      id: id,
      text: text
    }
  else
    @src = g.favEmpty
    g.watched[g.BOARD] = $.slice(g.watched[g.BOARD], id)
  GM_setValue('watched', JSON.stringify(g.watched))
  watcherUpdate()

watcherUpdate = ->
  div = $.el 'div'
  for board of g.watched
    for thread in g.watched[board]
      a = $.el 'a',
        textContent: 'X'
        className: 'pointer'
      $.bind a, 'click', watchX
      link = $.el 'a',
        textContent: thread.text
        href: "/#{board}/res/#{thread.id}"
      $.append div, a, $.tn(' '), link, $.el('br')
  old = $('#watcher div:last-child')
  $.replace(old, div)

watchX = ->
  [board, _, id] = @nextElementSibling.
    getAttribute('href').substring(1).split('/')
  g.watched[board] = $.slice(g.watched[board], id)
  GM_setValue('watched', JSON.stringify(g.watched))
  watcherUpdate()
  if input = $("input[name=\"#{id}\"]")
    favicon = input.previousSibling
    favicon.src = g.favEmpty


#main
g =
  callbacks: []
  expand: false
  favDead: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAD/AAA9+90tAAAAAXRSTlMAQObYZgAAADtJREFUCB0FwUERxEAIALDszMG730PNSkBEBSECoU0AEPe0mly5NWprRUcDQAdn68qtkVsj3/84z++CD5u7CsnoBJoaAAAAAElFTkSuQmCC'
  favDeadHalo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVR4XrWSAQoAIAgD/f+njSApsTqjGoTQ5oGWPJMOOs60CzsWwIwz1I4PUIYh+WYEMGQ6I/txw91kP4oA9BdwhKp1My4xQq6e8Q9ANgDJjOErewFiNesV2uGSfGv1/HYAAAAASUVORK5CYII='
  favDefault: $('link[rel="shortcut icon"]', d)?.href or '' #no favicon in `post successful` page
  favEmpty: 'http://static.4chan.org/image/favicon-dis.ico'
  flavors: [
    'http://regex.info/exif.cgi?url='
    'http://iqdb.org/?url='
    'http://saucenao.com/search.php?db=999&url='
    'http://tineye.com/search?url='
  ].join '\n'
  watched: JSON.parse(GM_getValue('watched', '{}'))
  xhrs: []
g.favHalo = if /ws/.test g.favDefault then 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVR4XrWRQQoAIQwD+6L97j7Ih9WTQQxhDqJQCk4Mranuvqod6LgwawSqSuUmWSPw/UNlJlnDAmA2ARjABLYj8ZyCzJHHqOg+GdAKZmKPIQUzuYrxicHqEgHzP9g7M0+hj45sAnRWxtPj3zSPAAAAAElFTkSuQmCC' else 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABmzDP///8AAABet0i+AAAAAXRSTlMAQObYZgAAAExJREFUeF4tyrENgDAMAMFXKuQswQLBG3mOlBnFS1gwDfIYLpEivvjq2MlqjmYvYg5jWEzCwtDSQlwcXKCVLrpFbvLvvSf9uZJ2HusDtJAY7Tkn1oYAAAAASUVORK5CYII='
pathname = location.pathname.substring(1).split('/')
[g.BOARD, temp] = pathname
if temp is 'res'
  g.REPLY = temp
  g.THREAD_ID = pathname[2]
else
  g.PAGENUM = parseInt(temp) || 0
g.hiddenThreads = JSON.parse(GM_getValue("hiddenThreads/#{g.BOARD}/", '[]'))
g.hiddenReplies = JSON.parse(GM_getValue("hiddenReplies/#{g.BOARD}/", '[]'))
tzOffset = (new Date()).getTimezoneOffset() / 60
# GMT -8 is given as +480; would GMT +8 be -480 ?
g.chanOffset = 5 - tzOffset# 4chan = EST = GMT -5
if $.isDST() then g.chanOffset -= 1

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

GM_addStyle '
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
  span.navlinks {
    position: absolute;
    right: 5px;
  }
  span.navlinks > a {
    font-size: 16px;
    text-decoration: none;
  }
  .hide {
    display: none;
  }
  .new {
    background: lime;
  }
'

if location.hostname is 'sys.4chan.org'
  qr.sys()
  return
if navtopr = $ '#navtopr a'
  a = $.el 'a',
    textContent: '4chan X'
    className: 'pointer'
  $.bind a, 'click', options
  $.replace navtopr, a
  navbotr = $ '#navbotr a'
  a = $.el 'a',
    textContent: '4chan X'
    className: 'pointer'
  $.bind a, 'click', options
  $.replace navbotr, a
else if $.config('404 Redirect') and d.title is '4chan - 404'
  redirect()
else
  return

#hack to tab from comment straight to recaptcha
for el in $$ '#recaptcha_table a'
  el.tabIndex = 1
recaptcha = $ '#recaptcha_response_field'
recaptcha.addEventListener('keydown', recaptchaListener, true)

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
  $("select", expand).addEventListener 'change', changeValue, true
  $("select", expand).addEventListener 'change', imageTypeChange, true
  $("input", expand).addEventListener 'click', imageExpandClick, true
  $.before delform.firstChild, expand

  g.callbacks.push (root) ->
    thumbs = $$ 'img[md5]', root
    for thumb in thumbs
      thumb.parentNode.addEventListener 'click', imageClick, true
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
  g.callbacks.push (root) ->
    tds = $$('td.doubledash', root)
    for td in tds
      a = $.el 'a',
        textContent: '[ - ]'
        className: 'pointer'
      $.bind a, 'click', hideReply
      $.replace(td.firstChild, a)

      next = td.nextSibling
      id = next.id
      for obj in g.hiddenReplies
        if obj.id is id
          hideReply(next)

if $.config 'Quick Reply'
  qr.init()

if $.config 'Quick Report'
  g.callbacks.push (root) ->
    arr = $$('span[id^=no]', root)
    for el in arr
      a = $.el 'a',
        textContent: '[ ! ]'
        className: 'pointer'
      $.bind a, 'click', report
      $.after el, a
      $.after el, $.tn(' ')

if $.config 'Thread Watcher'
  #create watcher
  html = '<div class="move">Thread Watcher</div><div></div>'
  watcher = ui.dialog 'watcher', top: '50px', left: '0px', html
  $.append d.body, watcher
  watcherUpdate()

  #add buttons
  threads = g.watched[g.BOARD] || []
  #normal, threading
  inputs = $$('form > input[value="delete"], div > input[value="delete"]')
  for input in inputs
    id = input.name
    src = (->
      for thread in threads
        if id is thread.id
          return g.favDefault
      g.favEmpty
    )()
    img = $.el 'img',
      src: src
      className: 'pointer'
    $.bind img, 'click', watch
    $.before input, img

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

if $.config 'Reply Navigation'
  g.callbacks.push (root) ->
    arr = $$('span[id^=norep]', root)
    for el in arr
      span = $.el 'span'
      up = $.el 'a',
        textContent: '▲'
        className: 'pointer'
      $.bind up, 'click', replyNav
      down = $.el 'a',
        textContent: '▼'
        className: 'pointer'
      $.bind down, 'click', replyNav
      $.append span, $.tn(' '), up, $.tn(' '), down
      $.after el, span

if $.config 'Keybinds'
  d.addEventListener 'keydown', keydown, true
  d.addEventListener 'keypress', keypress, true

if g.REPLY
  if $.config 'Image Preloading'
    g.callbacks.push (root) ->
      thumbs = $$ 'img[md5]', root
      for thumb in thumbs
        parent = thumb.parentNode
        el = $.el 'img', src: parent.href
  if $.config 'Thread Updater'
    updaterMake()
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
    window.addEventListener 'scroll', scroll, true
    g.callbacks.push (root) ->
      g.replies = g.replies.concat $$ 'td.reply, td.replyhl', root
      updateTitle()

else #not reply
  if $.config 'Thread Hiding'
    delform = $('form[name=delform]')
    start = $ 'form[name=delform] > *'
    start = start.nextSibling if $.config 'Image Expansion' #skip over image expansion dialog
    #don't confuse other scripts
    d.addEventListener('DOMNodeInserted', stopPropagation, true)
    threadF start
    d.removeEventListener('DOMNodeInserted', stopPropagation, true)

  if $.config 'Auto Watch'
    $('form[name="post"]').addEventListener('submit', autoWatch, true)

  if $.config 'Thread Navigation'
    arr = $$ 'div > span.filesize, form > span.filesize'
    l1 = arr.length - 1
    for el, i in arr
      span = $.el 'span',
        className: 'navlinks'
        id: 'p' + i
      if i
        textContent = '▲'
        href = "#p#{i - 1}"
      else if g.PAGENUM
        textContent = '◀'
        href = "#{g.PAGENUM - 1}#p0"
      else
        textContent = '▲'
        href = "#navtop"
      up = $.el 'a',
        className: 'pointer'
        textContent: textContent
        href: href
      if i < l1
        textContent = '▼'
        href = "#p#{i + 1}"
      else
        textContent = '▶'
        href = "#{g.PAGENUM + 1}#p0"
      down = $.el 'a',
        className: 'pointer'
        textContent: textContent
        href: href
      $.append span, up, $.tn(' '), down
      $.before el, span
    if location.hash is '#p0'
      window.location = window.location

  if $.config 'Thread Expansion'
    omitted = $$('span.omittedposts')
    for span in omitted
      a = $.el 'a',
        className: 'pointer omittedposts'
        textContent: "+ #{span.textContent}"
      $.bind a, 'click', expandThread
      $.replace(span, a)

  if $.config 'Comment Expansion'
    as = $$('span.abbr a')
    for a in as
      a.addEventListener('click', expandComment, true)

callback() for callback in g.callbacks
d.body.addEventListener('DOMNodeInserted', nodeInserted, true)
