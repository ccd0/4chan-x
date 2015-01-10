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
    return if target.nodeName is 'EMBED' # Prevent keybinds from firing on /f/ embeds.
    if target.nodeName in ['INPUT', 'TEXTAREA']
      return unless /(Esc|Alt|Ctrl|Meta|Shift\+\w{2,})/.test key
    unless g.VIEW not in ['index', 'thread'] or g.VIEW is 'index' and Conf['JSON Navigation'] and Conf['Index Mode'] is 'catalog'
      threadRoot = Nav.getThread()
      if op = $ '.op', threadRoot
        thread = Get.postFromNode(op).thread
    switch key
      # QR & Options
      when Conf['Toggle board list']
        Header.toggleBoardList() if Conf['Custom Board Navigation']
      when Conf['Toggle header']
        Header.toggleBarVisibility()
      when Conf['Open empty QR']
        Keybinds.qr()
      when Conf['Open QR']
        Keybinds.qr threadRoot if threadRoot
      when Conf['Open settings']
        Settings.open()
      when Conf['Close']
        if Settings.dialog
          Settings.close()
        else if (notifications = $$ '.notification').length
          for notification in notifications
            $('.close', notification).click()
        else if QR.nodes and not (QR.nodes.el.hidden or window.getComputedStyle(QR.nodes.form).display is 'none')
          if Conf['Persistent QR']
            QR.hide()
          else
            QR.close()
        else if Embedding.lastEmbed
          Embedding.closeFloat()
        return
      when Conf['Spoiler tags']
        Keybinds.tags 'spoiler', target if target.nodeName is 'TEXTAREA'
      when Conf['Code tags']
        Keybinds.tags 'code', target if target.nodeName is 'TEXTAREA'
      when Conf['Eqn tags']
        Keybinds.tags 'eqn', target if target.nodeName is 'TEXTAREA'
      when Conf['Math tags']
        Keybinds.tags 'math', target if target.nodeName is 'TEXTAREA'
      when Conf['Toggle sage']
        Keybinds.sage() if QR.nodes and !QR.nodes.el.hidden
      when Conf['Submit QR']
        QR.submit() if QR.nodes and !QR.nodes.el.hidden and !QR.status()
      when Conf['Post Without Name']
        return unless QR.nodes and !QR.status()
        Keybinds.name()
        QR.submit()
      # Index/Thread related
      when Conf['Update']
        switch g.VIEW
          when 'thread'
            ThreadUpdater.update() if Conf['Thread Updater']
          when 'index'
            Index.update() if Conf['JSON Navigation']
        return
      when Conf['Watch']
        ThreadWatcher.toggle thread unless thread
      # Images
      when Conf['Expand image']
        Keybinds.img threadRoot if threadRoot
      when Conf['Expand images']
        Keybinds.img threadRoot, true if threadRoot
      when Conf['Open Gallery']
        Gallery.cb.toggle() if g.VIEW in ['index', 'thread']
      when Conf['fappeTyme']
        FappeTyme.cb.toggle.call {name: 'fappe'} if Conf['Fappe Tyme'] and g.VIEW in ['index', 'thread'] and g.BOARD isnt 'f'
      when Conf['werkTyme']
        return if g.VIEW is 'catalog'
        FappeTyme.cb.toggle.call {name: 'werk'} if Conf['Fappe Tyme'] and g.VIEW in ['index', 'thread'] and g.BOARD isnt 'f'
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
      when Conf['Cycle sort type']
        Index.cycleSortType() if Conf['JSON Navigation'] and g.VIEW is 'index' and g.BOARD isnt 'f'
      # Thread Navigation
      when Conf['Next thread']
        Nav.scroll +1 if g.VIEW is 'index' and threadRoot
      when Conf['Previous thread']
        Nav.scroll -1 if g.VIEW is 'index' and threadRoot
      when Conf['Expand thread']
        ExpandThread.toggle thread if g.VIEW is 'index' and threadRoot
      when Conf['Open thread']
        Keybinds.open thread if g.VIEW is 'index' and threadRoot
      when Conf['Open thread tab']
        Keybinds.open thread, true if g.VIEW is 'index' and threadRoot
      # Reply Navigation
      when Conf['Next reply']
        Keybinds.hl +1, threadRoot if threadRoot
      when Conf['Previous reply']
        Keybinds.hl -1, threadRoot if threadRoot
      when Conf['Deselect reply']
        Keybinds.hl  0, threadRoot if threadRoot
      when Conf['Hide']
        PostHiding.toggle thread.OP
      when Conf['Previous Post Quoting You']
        QuoteMarkers.cb.seek 'preceding' if threadRoot
      when Conf['Next Post Quoting You']
        QuoteMarkers.cb.seek 'following' if threadRoot
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
    return unless QR.postingIsEnabled
    QR.open()
    if thread?
      QR.quote.call $ 'input', $('.post.highlight', thread) or thread

    QR.nodes.com.focus()
    if Conf['QR Shortcut']
      $.rmClass $('.qr-shortcut'), 'disabled'

  tags: (tag, ta) ->
    supported = switch tag
      when 'spoiler'     then !!$ '.postForm input[name=spoiler]'
      when 'code'        then g.BOARD.ID is 'g'
      when 'math', 'eqn' then g.BOARD.ID is 'sci'
    new Notice 'warning', "[#{tag}] tags are not supported on /#{g.BOARD}/.", 20 unless supported

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

  name: -> QR.nodes.name.value = ''

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
