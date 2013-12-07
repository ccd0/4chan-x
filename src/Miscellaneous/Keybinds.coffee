Keybinds =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Keybinds']

    for hotkey of Conf.hotkeys
      $.sync hotkey, Keybinds.sync

    init = ->
      $.off d, '4chanXInitFinished', init
      $.on d, 'keydown', Keybinds.keydown
      for node in $$ '[accesskey]'
        node.removeAttribute 'accesskey'
      return
    $.on d, '4chanXInitFinished', init

  sync: (key, hotkey) ->
    Conf[hotkey] = key

  keydown: (e) ->
    return unless key = Keybinds.keyCode e
    {target} = e
    if target.nodeName in ['INPUT', 'TEXTAREA']
      return unless /(Esc|Alt|Ctrl|Meta|Shift\+\w{2,})/.test key

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
      # Index/Thread related
      when Conf['Update']
        switch g.VIEW
          when 'thread'
            ThreadUpdater.update()
          when 'index'
            Index.update()
      when Conf['Watch']
        ThreadWatcher.toggle thread
      # Images
      when Conf['Expand image']
        Keybinds.img threadRoot
      when Conf['Expand images']
        Keybinds.img threadRoot, true
      # Board Navigation
      when Conf['Front page']
        if g.VIEW is 'index'
          Index.pageNav 0
        else
          window.location = "/#{g.BOARD}/"
      when Conf['Open front page']
        $.open "/#{g.BOARD}/"
      when Conf['Next page']
        return unless g.VIEW is 'index' and Conf['Index Mode'] is 'paged'
        $('.next button', Index.pagelist).click()
      when Conf['Previous page']
        return unless g.VIEW is 'index' and Conf['Index Mode'] is 'paged'
        $('.prev button', Index.pagelist).click()
      when Conf['Search form']
        Index.searchInput.focus()
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
        ThreadHiding.toggle thread if ThreadHiding.db
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
    postEl = $ '.reply.highlight', thread

    unless delta
      $.rmClass postEl, 'highlight' if postEl
      return

    if postEl
      {height} = postEl.getBoundingClientRect()
      if Header.getTopOf(postEl) >= -height and Header.getBottomOf(postEl) >= -height # We're at least partially visible
        root = postEl.parentNode
        axis = if delta is +1
          'following'
        else
          'preceding'
        return unless next = $.x "#{axis}-sibling::div[contains(@class,'replyContainer') and not(@hidden) and not(child::div[@class='stub'])][1]/child::div[contains(@class,'reply')]", root
        Header.scrollToIfNeeded next, delta is +1
        @focus next
        $.rmClass postEl, 'highlight'
        return
      $.rmClass postEl, 'highlight'

    replies = $$ '.reply', thread
    replies.reverse() if delta is -1
    for reply in replies
      if delta is +1 and Header.getTopOf(reply) > 0 or delta is -1 and Header.getBottomOf(reply) > 0
        @focus reply
        return

  focus: (post) ->
    $.addClass post, 'highlight'
