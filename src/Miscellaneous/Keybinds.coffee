Keybinds =
  init: ->
    return if !Conf['Keybinds']

    for hotkey of Config.hotkeys
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
    return if not (key = Keybinds.keyCode e)
    {target} = e
    if target.nodeName in ['INPUT', 'TEXTAREA']
      return unless /(Esc|Alt|Ctrl|Meta|Shift\+\w{2,})/.test(key) and not /^Alt\+(\d|Up|Down|Left|Right)$/.test(key)
    if g.VIEW in ['index', 'thread']
      threadRoot = Nav.getThread()
      thread = Get.threadFromRoot threadRoot
    switch key
      # QR & Options
      when Conf['Toggle board list']
        return unless Conf['Custom Board Navigation']
        Header.toggleBoardList()
      when Conf['Toggle header']
        Header.toggleBarVisibility()
      when Conf['Open empty QR']
        return unless QR.postingIsEnabled
        Keybinds.qr()
      when Conf['Open QR']
        return unless QR.postingIsEnabled and threadRoot
        Keybinds.qr threadRoot
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
        else
          return
      when Conf['Spoiler tags']
        return unless target.nodeName is 'TEXTAREA'
        Keybinds.tags 'spoiler', target
      when Conf['Code tags']
        return unless target.nodeName is 'TEXTAREA'
        Keybinds.tags 'code', target
      when Conf['Eqn tags']
        return unless target.nodeName is 'TEXTAREA'
        Keybinds.tags 'eqn', target
      when Conf['Math tags']
        return unless target.nodeName is 'TEXTAREA'
        Keybinds.tags 'math', target
      when Conf['SJIS tags']
        return unless target.nodeName is 'TEXTAREA'
        Keybinds.tags 'sjis', target
      when Conf['Toggle sage']
        return unless QR.nodes and !QR.nodes.el.hidden
        Keybinds.sage()
      when Conf['Toggle Cooldown']
        return unless QR.nodes and !QR.nodes.el.hidden and $.hasClass(QR.nodes.fileSubmit, 'custom-cooldown')
        QR.toggleCustomCooldown()
      when Conf['Post from URL']
        return unless QR.postingIsEnabled
        QR.handleUrl ''
      when Conf['Add new post']
        return unless QR.postingIsEnabled
        QR.addPost()
      when Conf['Submit QR']
        return unless QR.nodes and !QR.nodes.el.hidden
        QR.submit() if !QR.status()
      # Index/Thread related
      when Conf['Update']
        switch g.VIEW
          when 'thread'
            return unless ThreadUpdater.enabled
            ThreadUpdater.update()
          when 'index'
            return unless Index.enabled
            Index.update()
          else
            return
      when Conf['Watch']
        return unless ThreadWatcher.enabled and thread
        ThreadWatcher.toggle thread
      when Conf['Update thread watcher']
        return unless ThreadWatcher.enabled
        ThreadWatcher.buttonFetchAll()
      when Conf['Toggle thread watcher']
        return unless ThreadWatcher.enabled
        ThreadWatcher.toggleWatcher()
      when Conf['Toggle threading']
        return unless QuoteThreading.ready
        QuoteThreading.toggleThreading()
      when Conf['Mark thread read']
        return unless g.VIEW is 'index' and thread and UnreadIndex.enabled
        UnreadIndex.markRead.call threadRoot
      # Images
      when Conf['Expand image']
        return unless ImageExpand.enabled and threadRoot
        post = Get.postFromNode Keybinds.post threadRoot
        ImageExpand.toggle post if post.file
      when Conf['Expand images']
        return unless ImageExpand.enabled
        ImageExpand.cb.toggleAll()
      when Conf['Open Gallery']
        return unless Gallery.enabled
        Gallery.cb.toggle()
      when Conf['fappeTyme']
        return unless FappeTyme.nodes?.fappe
        FappeTyme.toggle 'fappe'
      when Conf['werkTyme']
        return unless FappeTyme.nodes?.werk
        FappeTyme.toggle 'werk'
      # Board Navigation
      when Conf['Front page']
        if Index.enabled
          Index.userPageNav 1
        else
          location.href = "/#{g.BOARD}/"
      when Conf['Open front page']
        $.open "#{location.origin}/#{g.BOARD}/"
      when Conf['Next page']
        return unless g.VIEW is 'index' and !g.SITE.isOnePage?(g.BOARD)
        if Index.enabled
          return unless Conf['Index Mode'] in ['paged', 'infinite']
          $('.next button', Index.pagelist).click()
        else
          $(g.SITE.selectors.nav.next)?.click()
      when Conf['Previous page']
        return unless g.VIEW is 'index' and !g.SITE.isOnePage?(g.BOARD)
        if Index.enabled
          return unless Conf['Index Mode'] in ['paged', 'infinite']
          $('.prev button', Index.pagelist).click()
        else
          $(g.SITE.selectors.nav.prev)?.click()
      when Conf['Search form']
        return unless g.VIEW is 'index'
        searchInput = if Index.enabled
          Index.searchInput
        else if g.SITE.selectors.searchBox
          $ g.SITE.selectors.searchBox
        else
          undefined
        return unless searchInput
        Header.scrollToIfNeeded searchInput
        searchInput.focus()
      when Conf['Paged mode']
        return unless Index.enabledOn(g.BOARD)
        location.href = if g.VIEW is 'index' then '#paged' else "/#{g.BOARD}/#paged"
      when Conf['Infinite scrolling mode']
        return unless Index.enabledOn(g.BOARD)
        location.href = if g.VIEW is 'index' then '#infinite' else "/#{g.BOARD}/#infinite"
      when Conf['All pages mode']
        return unless Index.enabledOn(g.BOARD)
        location.href = if g.VIEW is 'index' then '#all-pages' else "/#{g.BOARD}/#all-pages"
      when Conf['Open catalog']
        return unless (catalog = CatalogLinks.catalog())
        location.href = catalog
      when Conf['Cycle sort type']
        return unless Index.enabled
        Index.cycleSortType()
      # Thread Navigation
      when Conf['Next thread']
        return unless g.VIEW is 'index' and threadRoot
        Nav.scroll +1
      when Conf['Previous thread']
        return unless g.VIEW is 'index' and threadRoot
        Nav.scroll -1
      when Conf['Expand thread']
        return unless g.VIEW is 'index' and threadRoot
        ExpandThread.toggle thread
        # Keep thread from moving off screen when contracted.
        Header.scrollTo threadRoot
      when Conf['Open thread']
        return unless g.VIEW is 'index' and threadRoot
        Keybinds.open thread
      when Conf['Open thread tab']
        return unless g.VIEW is 'index' and threadRoot
        Keybinds.open thread, true
      # Reply Navigation
      when Conf['Next reply']
        return unless threadRoot
        Keybinds.hl +1, threadRoot
      when Conf['Previous reply']
        return unless threadRoot
        Keybinds.hl -1, threadRoot
      when Conf['Deselect reply']
        return unless threadRoot
        Keybinds.hl  0, threadRoot
      when Conf['Hide']
        return unless thread and ThreadHiding.db
        Header.scrollTo threadRoot
        ThreadHiding.toggle thread
      when Conf['Quick Filter MD5']
        return unless threadRoot
        post = Keybinds.post threadRoot
        Keybinds.hl +1, threadRoot
        Filter.quickFilterMD5.call post
      when Conf['Previous Post Quoting You']
        return unless threadRoot and QuoteYou.db
        QuoteYou.cb.seek 'preceding'
      when Conf['Next Post Quoting You']
        return unless threadRoot and QuoteYou.db
        QuoteYou.cb.seek 'following'
      <% if (readJSON('/.tests_enabled')) { %>
      when 'v'
        return unless threadRoot
        Test.testAll()
      <% } %>
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
      when 32
        'Space'
      when 37
        'Left'
      when 38
        'Up'
      when 39
        'Right'
      when 40
        'Down'
      when 188
        'Comma'
      when 190
        'Period'
      when 191
        'Slash'
      when 59, 186
        'Semicolon'
      else
        if 48 <= kc <= 57 or 65 <= kc <= 90 # 0-9, A-Z
          String.fromCharCode(kc).toLowerCase()
        else if 96 <= kc <= 105 # numpad 0-9
          String.fromCharCode(kc - 48).toLowerCase()
        else
          null
    if key
      if e.altKey   then key = 'Alt+'   + key
      if e.ctrlKey  then key = 'Ctrl+'  + key
      if e.metaKey  then key = 'Meta+'  + key
      if e.shiftKey then key = 'Shift+' + key
    key

  post: (thread) ->
    s = g.SITE.selectors
    (
      $("#{s.postContainer}#{s.highlightable.reply}.#{g.SITE.classes.highlight}", thread) or
      $("#{if g.SITE.isOPContainerThread then s.thread else s.postContainer}#{s.highlightable.op}", thread)
    )

  qr: (thread) ->
    QR.open()
    if thread?
      QR.quote.call Keybinds.post thread
    QR.nodes.com.focus()

  tags: (tag, ta) ->
    BoardConfig.ready ->
      {config} = g.BOARD
      supported = switch tag
        when 'spoiler'     then !!config.spoilers
        when 'code'        then !!config.code_tags
        when 'math', 'eqn' then !!config.math_tags
        when 'sjis'        then !!config.sjis_tags
      (new Notice 'warning', "[#{tag}] tags are not supported on /#{g.BOARD}/.", 20 unless supported)

    value    = ta.value
    selStart = ta.selectionStart
    selEnd   = ta.selectionEnd

    ta.value =
      value[...selStart] +
      "[#{tag}]" + value[selStart...selEnd] + "[/#{tag}]" +
      value[selEnd..]

    # Move the caret to the end of the selection.
    range = ("[#{tag}]").length + selEnd
    ta.setSelectionRange range, range

    # Fire the 'input' event
    $.event 'input', null, ta

  sage: ->
    isSage  = /sage/i.test QR.nodes.email.value
    QR.nodes.email.value = if isSage
      ""
    else "sage"

  open: (thread, tab) ->
    return if g.VIEW isnt 'index'
    url = Get.url 'thread', thread
    if tab
      $.open url
    else
      location.href = url

  hl: (delta, thread) ->
    replySelector = "#{g.SITE.selectors.postContainer}#{g.SITE.selectors.highlightable.reply}"
    {highlight} = g.SITE.classes

    postEl = $ "#{replySelector}.#{highlight}", thread

    unless delta
      $.rmClass postEl, highlight if postEl
      return

    if postEl
      {height} = postEl.getBoundingClientRect()
      if Header.getTopOf(postEl) >= -height and Header.getBottomOf(postEl) >= -height # We're at least partially visible
        {root} = Get.postFromNode(postEl).nodes
        axis = if delta is +1
          'following'
        else
          'preceding'
        return unless (next = $.x "#{axis}-sibling::#{g.SITE.xpath.replyContainer}[not(@hidden) and not(child::div[@class='stub'])][1]", root)
        next = $ replySelector, next unless next.matches(replySelector)
        Header.scrollToIfNeeded next, delta is +1
        $.addClass next, highlight
        $.rmClass postEl, highlight
        return
      $.rmClass postEl, highlight

    replies = $$ replySelector, thread
    replies.reverse() if delta is -1
    for reply in replies
      if delta is +1 and Header.getTopOf(reply) > 0 or delta is -1 and Header.getBottomOf(reply) > 0
        $.addClass reply, highlight
        return
    return
