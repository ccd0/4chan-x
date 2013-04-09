Keybinds =
  init: ->
    @bindings = @bind()
    for node in $$ '[accesskey]'
      node.removeAttribute 'accesskey'
    $.on d, 'keydown',  Keybinds.keydown

  bind: ->
    _conf = Conf
    keys  = {}
    
    # QR & Options
    keys[_conf.openQR] = (thread, target, nodeName) ->
      Keybinds.qr thread, true
    keys[_conf.openEmptyQR] = (thread, target, nodeName) ->
      Keybinds.qr thread
    keys[_conf.openOptions] = ->
      Options.dialog() unless $.id 'overlay'
    keys[_conf.close] = ->
      if o = $.id 'overlay'
        Options.close.call o
      else if QR.el
        QR.close()
    keys[_conf.submit] = ->
      QR.submit() if QR.el and !QR.status()
    keys[_conf.hideQR] = (thread, target, nodeName) ->
      if QR.el
        return QR.el.hidden = false if QR.el.hidden
        QR.autohide.click()
      else QR.open()
    keys[_conf.toggleCatalog] = ->
      CatalogLinks.toggle()
    keys[_conf.spoiler] = (thread, target, nodeName) ->
      return unless ($ '[name=spoiler]') and nodeName is 'textarea'
      Keybinds.tags 'spoiler', target
    keys[_conf.math] = (thread, target, nodeName) ->
      return unless g.BOARD is (!! $ 'script[src^="//boards.4chan.org/jsMath/"]', d.head) and nodeName is 'textarea'
      Keybinds.tags 'math', target
    keys[_conf.eqn] = (thread, target, nodeName) ->
      return unless g.BOARD is (!! $ 'script[src^="//boards.4chan.org/jsMath/"]', d.head) and nodeName is 'textarea'
      Keybinds.tags 'eqn', target
    keys[_conf.code] = (thread, target, nodeName) ->
      return unless g.BOARD is 'g' and nodeName is 'textarea'
      Keybinds.tags 'code', target
    keys[_conf.sageru] = ->
      $("[name=email]", QR.el).value = "sage"
      QR.selected.email = "sage"

    # Thread related
    keys[_conf.watch] = (thread, target, nodeName) ->
      Watcher.toggle thread
    keys[_conf.update] = ->
      Updater.update()
    keys[_conf.unreadCountTo0] = ->
      Unread.replies = []
      Unread.update true

    # Images
    keys[_conf.expandImage] = (thread, target, nodeName) ->
      Keybinds.img thread
    keys[_conf.expandAllImages] = (thread, target, nodeName) ->
      Keybinds.img thread, true
    keys[_conf.fappeTyme] = (thread, target, nodeName) ->
      Keybinds.ft thread

    # Board Navigation
    keys[_conf.zero] = ->
      window.location = "/#{g.BOARD}/0#delform"
    keys[_conf.nextPage] = ->
      if form = $ '.next form'
        window.location = form.action
    keys[_conf.previousPage] = ->
     if form = $ '.prev form'
       window.location = form.action

    # Thread Navigation
    keys[_conf.nextThread] = ->
      return if g.REPLY
      Nav.scroll +1
    keys[_conf.previousThread] = ->
      return if g.REPLY
      Nav.scroll -1
    keys[_conf.expandThread] = (thread, target, nodeName) ->
      ExpandThread.toggle thread
    keys[_conf.openThread] = (thread, target, nodeName) ->
      Keybinds.open thread
    keys[_conf.openThreadTab] = (thread, target, nodeName) ->
      Keybinds.open thread, true

    # Reply Navigation
    keys[_conf.nextReply] = (thread, target, nodeName) ->
      Keybinds.hl +1, thread
    keys[_conf.previousReply] = (thread, target, nodeName) ->
      Keybinds.hl -1, thread
    keys[_conf.hide] = (thread, target, nodeName) ->
      ThreadHiding.toggle thread if /\bthread\b/.test thread.className
    return keys

  keydown: (e) ->
    return unless key = Keybinds.keyCode e
    {target} = e
    if (nodeName = target.nodeName.toLowerCase()) is 'textarea' or nodeName is 'input'
      return unless (key is 'Esc') or (/\+/.test key)

    thread = Nav.getThread()

    return unless bind = Keybinds.bindings[key]
    bind(thread, target, nodeName)

    e.preventDefault()

  keyCode: (e) ->
    key = if [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90].contains(kc = e.keyCode)
      c = String.fromCharCode kc
      if e.shiftKey then c else c.toLowerCase()
    else (switch kc
      when 8
        ''
      when 13
        'Enter'
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
      else
        null)
    if key
      if e.altKey  then key = 'alt+'  + key
      if e.ctrlKey then key = 'ctrl+' + key
      if e.metaKey then key = 'meta+' + key
    key

  tags: (tag, ta) ->
    value    = ta.value
    selStart = ta.selectionStart
    selEnd   = ta.selectionEnd

    ta.value =
      value[...selStart] +
      "[#{tag}]" + value[selStart...selEnd] + "[/#{tag}]" +
      value[selEnd..]

    range = "[#{tag}]".length + selEnd
    # Move the caret to the end of the selection.
    ta.setSelectionRange range, range

    # Fire the 'input' event
    $.event ta, new Event 'input'

  img: (thread, all) ->
    if all
      $.id('imageExpand').click()
    else
      thumb = $ 'img[data-md5]', $('.post.highlight', thread) or thread
      ImageExpand.toggle thumb.parentNode

  ft: (thread) ->
    $('#fappeTyme>input').click()

  qr: (thread, quote) ->
    if quote
      QR.quote.call $ 'a[title="Quote this post"]', $('.post.highlight', thread) or thread
    else
      QR.open()
    $('textarea', QR.el).focus()

  open: (thread, tab) ->
    return if g.REPLY
    id = thread.id[1..]
    url = "//boards.4chan.org/#{g.BOARD}/res/#{id}"
    if tab
      $.open url
    else
      location.href = url

  hl: (delta, thread) ->
    if post = $ '.reply.highlight', thread
      $.rmClass post, 'highlight'
      rect = post.getBoundingClientRect()
      if rect.bottom >= 0 and rect.top <= d.documentElement.clientHeight # We're at least partially visible
        axis = if delta is +1 then 'following' else 'preceding'
        next = $.x axis + '::div[contains(@class,"post reply")][1]', post
        return unless next
        return unless g.REPLY or $.x('ancestor::div[parent::div[@class="board"]]', next) is thread
        rect = next.getBoundingClientRect()
        if rect.top < 0 or rect.bottom > d.documentElement.clientHeight
          next.scrollIntoView delta is -1
        @focus next
        return

    replies = $$ '.reply', thread
    replies.reverse() if delta is -1
    for reply in replies
      rect = reply.getBoundingClientRect()
      if delta is +1 and rect.top >= 0 or delta is -1 and rect.bottom <= d.documentElement.clientHeight
        @focus reply
        return

  focus: (post) ->
    $.addClass post, 'highlight'
    post.focus()