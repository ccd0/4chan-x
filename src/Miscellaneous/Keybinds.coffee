Keybinds =
  init: ->
    return if !Conf['Keybinds']

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
    unless g.VIEW is 'catalog'
      threadRoot = Nav.getThread()
      if op = $ '.op', threadRoot
        thread = Get.postFromNode(op).thread
    switch key
      # QR & Options
      when Conf['Toggle board list']
        if Conf['Custom Board Navigation']
          Header.toggleBoardList()
      when Conf['Toggle header']
        Header.toggleBarVisibility()
      when Conf['Open empty QR']
        Keybinds.qr()
      when Conf['Open QR']
        return if g.VIEW is 'catalog'
        Keybinds.qr threadRoot
      when Conf['Open settings']
        Settings.open()
      when Conf['Close']
        if Settings.dialog
          Settings.close()
        else if (notifications = $$ '.notification').length
          for notification in notifications
            $('.close', notification).click()
        else if QR.nodes
          if Conf['Persistent QR']
            QR.hide()
          else
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
      when Conf['Toggle sage']
        Keybinds.sage() if QR.nodes
      when Conf['Submit QR']
        QR.submit() if QR.nodes and !QR.status()
      # Index/Thread related
      when Conf['Update']
        switch g.VIEW
          when 'thread'
            ThreadUpdater.update()
          when 'index'
            if Conf['JSON Navigation'] then Index.update()
      when Conf['Watch']
        return if g.VIEW is 'catalog'
        ThreadWatcher.toggle thread
      # Images
      when Conf['Expand image']
        return if g.VIEW is 'catalog'
        Keybinds.img threadRoot
      when Conf['Expand images']
        return if g.VIEW is 'catalog'
        Keybinds.img threadRoot, true
      when Conf['Open Gallery']
        return if g.VIEW is 'catalog'
        Gallery.cb.toggle()
      when Conf['fappeTyme']
        return if g.VIEW is 'catalog'
        FappeTyme.cb.toggle.call {name: 'fappe'}
      when Conf['werkTyme']
        return if g.VIEW is 'catalog'
        FappeTyme.cb.toggle.call {name: 'werk'}
      # Board Navigation
      when Conf['Front page']
        if Conf['JSON Navigation'] and g.VIEW is 'index'
          Index.userPageNav 1
        else
          window.location = "/#{g.BOARD}/"
      when Conf['Open front page']
        $.open "/#{g.BOARD}/"
      when Conf['Next page']
        return unless g.VIEW is 'index'
        if Conf['JSON Navigation']
          if Conf['Index Mode'] isnt 'all pages'
            $('.next button', Index.pagelist).click()
        else
          if form = $ '.next form'
            window.location = form.action
      when Conf['Previous page']
        return unless g.VIEW is 'index'
        if Conf['JSON Navigation']
          if Conf['Index Mode'] isnt 'all pages'
            $('.prev button', Index.pagelist).click()
        else
          if form = $ '.prev form'
            window.location = form.action
      when Conf['Search form']
        return unless g.VIEW is 'index'
        searchInput = if Conf['JSON Navigation'] then Index.searchInput else $.id('search-box')
        Header.scrollToIfNeeded searchInput
        searchInput.click()
        searchInput.focus()
      when Conf['Paged mode']
        return unless g.VIEW is 'index' and Conf['Index Mode'] isnt 'paged'
        Index.setIndexMode 'paged'
      when Conf['All pages mode']
        return unless g.VIEW is 'index' and Conf['Index Mode'] isnt 'all pages'
        Index.setIndexMode 'all pages'
      when Conf['Catalog mode']
        return unless g.VIEW is 'index' and Conf['Index Mode'] isnt 'catalog'
        Index.setIndexMode 'catalog'
      when Conf['Cycle sort type']
        return unless g.VIEW is 'index'
        Index.cycleSortType()
      when Conf['Open catalog']
        if Conf['External Catalog']
          window.location = CatalogLinks.external(g.BOARD.ID)
        else
          return window.location = "/#{g.BOARD}/catalog" unless Conf['JSON Navigation']
          return unless g.VIEW is 'index' and Conf['Index Mode'] isnt 'catalog'
          Index.setIndexMode 'catalog'
      # Thread Navigation
      when Conf['Next thread']
        return if g.VIEW isnt 'index'
        Nav.scroll +1
      when Conf['Previous thread']
        return if g.VIEW isnt 'index'
        Nav.scroll -1
      when Conf['Expand thread']
        return if g.VIEW isnt 'index'
        ExpandThread.toggle thread
      when Conf['Open thread']
        return if g.VIEW isnt 'index'
        Keybinds.open thread
      when Conf['Open thread tab']
        return if g.VIEW isnt 'index'
        Keybinds.open thread, true
      # Reply Navigation
      when Conf['Next reply']
        return if g.VIEW is 'catalog'
        Keybinds.hl +1, threadRoot
      when Conf['Previous reply']
        return if g.VIEW is 'catalog'
        Keybinds.hl -1, threadRoot
      when Conf['Deselect reply']
        return if g.VIEW is 'catalog'
        Keybinds.hl  0, threadRoot
      when Conf['Hide']
        PostHiding.toggle thread.OP
      when Conf['Previous Post Quoting You']
        QuoteYou.cb.seek 'preceding'
      when Conf['Next Post Quoting You']
        QuoteYou.cb.seek 'following'
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

  qr: (thread) ->
    return unless Conf['Quick Reply'] and QR.postingIsEnabled
    QR.open()
    if thread?
      QR.quote.call $ 'input', $('.post.highlight', thread) or thread
    QR.nodes.com.focus()
    if Conf['QR Shortcut']
      $.rmClass $('.qr-shortcut'), 'disabled'

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

  sage: ->
    isSage  = /sage/i.test QR.nodes.email.value
    QR.nodes.email.value = if isSage
      ""
    else "sage"

  img: (thread, all) ->
    if all
      ImageExpand.cb.toggleAll()
    else
      post = Get.postFromNode $('.post.highlight', thread) or $ '.op', thread
      ImageExpand.toggle post

  open: (thread, tab) ->
    return if g.VIEW isnt 'index'
    url = Build.path thread.board.ID, thread.ID
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
