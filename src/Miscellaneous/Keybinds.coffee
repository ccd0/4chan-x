Keybinds =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Keybinds']

    init = ->
      $.off d, '4chanXInitFinished', init
      $.on d, 'keydown',  Keybinds.keydown
      for node in $$ '[accesskey]'
        node.removeAttribute 'accesskey'
      return
    $.on d, '4chanXInitFinished', init

  keydown: (e) ->
    return unless key = Keybinds.keyCode e
    {target} = e
    if target.nodeName in ['INPUT', 'TEXTAREA']
      return unless /(Esc|Alt|Ctrl|Meta)/.test key

    threadRoot = Nav.getThread()
    if op = $ '.op', threadRoot
      thread = Get.postFromNode(op).thread
    switch key
      # QR & Options
      when Conf['Toggle board list']
        if Conf['Custom Board Navigation']
          Header.toggleBoardList()
      when Conf['Open empty QR']
        Keybinds.qr threadRoot
      when Conf['Open QR']
        Keybinds.qr threadRoot, true
      when Conf['Open settings']
        Settings.open()
      when Conf['Close']
        if Settings.dialog
          Settings.close()
        else if (notifications = $$ '.notification').length
          for notification in notifications
            $('.close', notification).click()
        else if QR.nodes
          QR.close()
      when Conf['Spoiler tags']
        return if target.nodeName isnt 'TEXTAREA'
        Keybinds.tags 'spoiler', target
      when Conf['Code tags']
        return if target.nodeName isnt 'TEXTAREA'
        Keybinds.tags 'code', target
      when Conf['Eqn tags']
        return if target.nodeName isnt 'TEXTAREA'
        Keybinds.tags 'eqn', target
      when Conf['Math tags']
        return if target.nodeName isnt 'TEXTAREA'
        Keybinds.tags 'math', target
      when Conf['Submit QR']
        QR.submit() if QR.nodes and !QR.status()
      # Thread related
      when Conf['Watch']
        ThreadWatcher.toggle thread
      when Conf['Update']
        ThreadUpdater.update()
      # Images
      when Conf['Expand image']
        Keybinds.img threadRoot
      when Conf['Expand images']
        Keybinds.img threadRoot, true
      # Board Navigation
      when Conf['Front page']
        window.location = "/#{g.BOARD}/0#delform"
      when Conf['Open front page']
        $.open "/#{g.BOARD}/#delform"
      when Conf['Next page']
        if form = $ '.next form'
          window.location = form.action
      when Conf['Previous page']
        if form = $ '.prev form'
          window.location = form.action
      # Thread Navigation
      when Conf['Next thread']
        return if g.VIEW isnt 'index'
        Nav.scroll +1
      when Conf['Previous thread']
        return if g.VIEW isnt 'index'
        Nav.scroll -1
      when Conf['Expand thread']
        ExpandThread.toggle thread
      when Conf['Open thread']
        Keybinds.open thread
      when Conf['Open thread tab']
        Keybinds.open thread, true
      # Reply Navigation
      when Conf['Next reply']
        Keybinds.hl +1, threadRoot
      when Conf['Previous reply']
        Keybinds.hl -1, threadRoot
      when Conf['Deselect reply']
        Keybinds.hl  0, threadRoot
      when Conf['Hide']
        ThreadHiding.toggle thread if g.VIEW is 'index'
      else
        return
    e.preventDefault()
    e.stopPropagation()

  keyCode: (e) ->
    key = switch kc = e.keyCode
      when 8 # return
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
        if 48 <= kc <= 57 or 65 <= kc <= 90 # 0-9, A-Z
          String.fromCharCode(kc).toLowerCase()
        else
          null
    if key
      if e.altKey   then key = 'Alt+'   + key
      if e.ctrlKey  then key = 'Ctrl+'  + key
      if e.metaKey  then key = 'Meta+'  + key
      if e.shiftKey then key = 'Shift+' + key
    key

  qr: (thread, quote) ->
    return unless Conf['Quick Reply'] and QR.postingIsEnabled
    QR.open()
    if quote
      QR.quote.call $ 'input', $('.post.highlight', thread) or thread
    QR.nodes.com.focus()

  tags: (tag, ta) ->
    value    = ta.value
    selStart = ta.selectionStart
    selEnd   = ta.selectionEnd

    ta.value =
      value[...selStart] +
      "[#{tag}]" + value[selStart...selEnd] + "[/#{tag}]" +
      value[selEnd..]

    # Move the caret to the end of the selection.
    range = "[#{tag}]".length + selEnd
    ta.setSelectionRange range, range

    # Fire the 'input' event
    $.event 'input', null, ta

  img: (thread, all) ->
    if all
      ImageExpand.cb.toggleAll()
    else
      post = Get.postFromNode $('.post.highlight', thread) or $ '.op', thread
      ImageExpand.toggle post

  open: (thread, tab) ->
    return if g.VIEW isnt 'index'
    url = "/#{thread.board}/res/#{thread}"
    if tab
      $.open url
    else
      location.href = url

  hl: (delta, thread) ->
    unless delta
      if postEl = $ '.reply.highlight', thread
        $.rmClass postEl, 'highlight'
      return
    if Conf['Bottom header']
      topMargin = 0
    else
      headRect  = Header.toggle.getBoundingClientRect()
      topMargin = headRect.top + headRect.height
    if postEl = $ '.reply.highlight', thread
      $.rmClass postEl, 'highlight'
      rect = postEl.getBoundingClientRect()
      if rect.bottom >= topMargin and rect.top <= doc.clientHeight # We're at least partially visible
        root = postEl.parentNode
        axe = if delta is +1
          'following'
        else
          'preceding'
        next = $.x "#{axe}-sibling::div[contains(@class,'replyContainer')][1]/child::div[contains(@class,'reply')]", root
        unless next
          @focus postEl
          return
        return unless g.VIEW is 'thread' or $.x('ancestor::div[parent::div[@class="board"]]', next) is thread
        rect = next.getBoundingClientRect()
        if rect.top < 0 or rect.bottom > doc.clientHeight
          if delta is -1
            window.scrollBy 0, rect.top - topMargin
          else
            next.scrollIntoView false
        @focus next
        return

    replies = $$ '.reply', thread
    replies.reverse() if delta is -1
    for reply in replies
      rect = reply.getBoundingClientRect()
      if delta is +1 and rect.top >= topMargin or delta is -1 and rect.bottom <= doc.clientHeight
        @focus reply
        return

  focus: (post) ->
    $.addClass post, 'highlight'
