Index =
  showHiddenThreads: false
  changed: {}

  init: ->
    return unless g.VIEW is 'index' and g.BOARD.ID isnt 'f'

    # For IndexRefresh events
    $.one d, '4chanXInitFinished', @cb.initFinished
    $.on  d, 'PostsInserted',      @cb.postsInserted

    return unless Conf['JSON Index']

    Callbacks.CatalogThread.push
      name: 'Catalog Features'
      cb:   @catalogNode

    @search = history.state?.searched or ''
    if history.state?.mode
      Conf['Index Mode'] = history.state?.mode
    @currentSort = history.state?.sort
    @currentSort or=
      if typeof Conf['Index Sort'] is 'object'
        Conf['Index Sort'][g.BOARD.ID] or 'bump'
      else
        Conf['Index Sort']
    @currentPage = @getCurrentPage()
    @processHash()

    $.addClass doc, 'index-loading', "#{Conf['Index Mode'].replace /\ /g, '-'}-mode"
    $.on window, 'popstate', @cb.popstate
    $.on d, 'scroll', @scroll
    $.on d, 'SortIndex', @cb.resort

    # Header refresh button
    @button = $.el 'a',
      className: 'fa fa-refresh'
      title: 'Refresh'
      href: 'javascript:;'
      textContent: 'Refresh Index'
    $.on @button, 'click', -> Index.update()
    Header.addShortcut 'index-refresh', @button, 590

    # Header "Index Navigation" submenu
    repliesEntry = el: UI.checkbox 'Show Replies',          'Show replies'
    hoverEntry   = el: UI.checkbox 'Catalog Hover Expand',  'Catalog hover expand'
    sortEntry    = el: UI.checkbox 'Per-Board Sort Type',   'Per-board sort type', (typeof Conf['Index Sort'] is 'object')
    pinEntry     = el: UI.checkbox 'Pin Watched Threads',   'Pin watched threads'
    anchorEntry  = el: UI.checkbox 'Anchor Hidden Threads', 'Anchor hidden threads'
    refNavEntry  = el: UI.checkbox 'Refreshed Navigation',  'Refreshed navigation'
    hoverEntry.el.title   = 'Expand the comment and show more details when you hover over a thread in the catalog.'
    sortEntry.el.title    = 'Set the sorting order of each board independently.'
    pinEntry.el.title     = 'Move watched threads to the start of the index.'
    anchorEntry.el.title  = 'Move hidden threads to the end of the index.'
    refNavEntry.el.title  = 'Refresh index when navigating through pages.'
    for label in [repliesEntry, hoverEntry, pinEntry, anchorEntry, refNavEntry]
      input = label.el.firstChild
      {name} = input
      $.on input, 'change', $.cb.checked
      switch name
        when 'Show Replies'
          $.on input, 'change', @cb.replies
        when 'Catalog Hover Expand'
          $.on input, 'change', @cb.hover
        when 'Pin Watched Threads', 'Anchor Hidden Threads'
          $.on input, 'change', @cb.resort
    $.on sortEntry.el.firstChild, 'change', @cb.perBoardSort

    Header.menu.addEntry
      el: $.el 'span',
        textContent: 'Index Navigation'
      order: 100
      subEntries: [repliesEntry, hoverEntry, sortEntry, pinEntry, anchorEntry, refNavEntry]

    # Navigation links at top of index
    @navLinks = $.el 'div', className: 'navLinks json-index'
    $.extend @navLinks, <%= readHTML('NavLinks.html') %>
    $('.cataloglink a', @navLinks).href = CatalogLinks.catalog()
    $('.archlistlink', @navLinks).hidden = true if g.BOARD.ID in ['b', 'trash']
    $.on $('#index-last-refresh a', @navLinks), 'click', @cb.refreshFront

    # Search field
    @searchInput = $ '#index-search', @navLinks
    @setupSearch()
    $.on @searchInput, 'input', @onSearchInput
    $.on $('#index-search-clear', @navLinks), 'click', @clearSearch

    # Hidden threads toggle
    @hideLabel = $ '#hidden-label', @navLinks
    $.on $('#hidden-toggle a', @navLinks), 'click', @cb.toggleHiddenThreads

    # Drop-down menus
    @selectMode  = $ '#index-mode', @navLinks
    @selectSort  = $ '#index-sort', @navLinks
    @selectSize  = $ '#index-size', @navLinks
    $.on @selectMode, 'change', @cb.mode
    $.on @selectSort, 'change', @cb.sort
    $.on @selectSize, 'change', $.cb.value
    $.on @selectSize, 'change', @cb.size
    for select in [@selectMode, @selectSize]
      select.value = Conf[select.name]
    @selectSort.value = Index.currentSort

    # Thread container
    @root = $.el 'div', className: 'board json-index'
    @cb.size()
    @cb.hover()

    # Page list
    @pagelist = $.el 'div', className: 'pagelist json-index'
    $.extend @pagelist, <%= readHTML('PageList.html') %>
    $('.cataloglink a', @pagelist).href = CatalogLinks.catalog()
    $.on @pagelist, 'click', @cb.pageNav

    @update true

    $.onExists doc, 'title + *', ->
      d.title = d.title.replace /\ -\ Page\ \d+/, ''

    $.onExists doc, '.board > .thread > .postContainer, .board + *', ->
      Build.hat = $ '.board > .thread > img:first-child'
      if Build.hat
        if Index.nodes
          for ID, threadRoot of Index.nodes
            $.prepend threadRoot, Build.hat.cloneNode false
        $.addClass doc, 'hats-enabled'
        $.addStyle ".catalog-thread::after {background-image: url(#{Build.hat.src});}"

      board = $ '.board'
      $.replace board, Index.root
      if Index.nodes
        $.event 'PostsInserted'
      # Hacks:
      # - When removing an element from the document during page load,
      #   its ancestors will still be correctly created inside of it.
      # - Creating loadable elements inside of an origin-less document
      #   will not download them.
      # - Combine the two and you get a download canceller!
      #   Does not work on Firefox unfortunately. bugzil.la/939713
      try
        d.implementation.createDocument(null, null, null).appendChild board

      $.rm el for el in $$ '.navLinks'
      $.rm $.id('ctrl-top')
      topNavPos = $.id('delform').previousElementSibling
      $.before topNavPos, $.el 'hr'
      $.before topNavPos, Index.navLinks

    Main.ready ->
      if (pagelist = $ '.pagelist')
        $.replace pagelist, Index.pagelist
      $.rmClass doc, 'index-loading'

  scroll: ->
    return if Index.req or !Index.liveThreadData or Conf['Index Mode'] isnt 'infinite' or (window.scrollY <= doc.scrollHeight - (300 + window.innerHeight))
    Index.pageNum ?= Index.currentPage # Avoid having to pushState to keep track of the current page

    pageNum = ++Index.pageNum
    return Index.endNotice() if pageNum > Index.pagesNum

    threads = Index.threadsOnPage pageNum
    Index.buildStructure threads
    
  endNotice: do ->
    notify = false
    reset = -> notify = false
    return ->
      return if notify
      notify = true
      new Notice 'info', "Last page reached.", 2
      setTimeout reset, 3 * $.SECOND

  menu:
    init: ->
      return if g.VIEW isnt 'index' or !Conf['JSON Index'] or !Conf['Menu'] or !Conf['Thread Hiding Link'] or g.BOARD.ID is 'f'

      Menu.menu.addEntry
        el: $.el 'a',
          href:      'javascript:;'
          className: 'has-shortcut-text'
        , <%= html('<span></span><span class="shortcut-text">Shift+click</span>') %>
        order: 20
        open: ({thread}) ->
          return false if Conf['Index Mode'] isnt 'catalog'
          @el.firstElementChild.textContent = if thread.isHidden
            'Unhide'
          else
            'Hide'
          $.off @el, 'click', @cb if @cb
          @cb = ->
            $.event 'CloseMenu'
            Index.toggleHide thread
          $.on @el, 'click', @cb
          true

  catalogNode: ->
    $.on @nodes.root, 'mousedown click', (e) =>
      return unless e.button is 0 and e.shiftKey
      Index.toggleHide @thread if e.type is 'click'
      e.preventDefault() # Also on mousedown to prevent highlighting text.

  toggleHide: (thread) ->
    $.rm thread.catalogView.nodes.root
    if Index.showHiddenThreads
      ThreadHiding.show thread
      return unless ThreadHiding.db.get {boardID: thread.board.ID, threadID: thread.ID}
      # Don't save when un-hiding filtered threads.
    else
      ThreadHiding.hide thread
    ThreadHiding.saveHiddenState thread

  cycleSortType: ->
    types = [Index.selectSort.options...].filter (option) -> !option.disabled
    for type, i in types
      break if type.selected
    types[(i + 1) % types.length].selected = true
    $.event 'change', null, Index.selectSort

  cb:
    initFinished: ->
      Index.initFinishedFired = true
      $.queueTask -> Index.cb.postsInserted()

    postsInserted: ->
      return unless Index.initFinishedFired
      n = 0
      g.posts.forEach (post) ->
        if !post.isFetchedQuote and !post.indexRefreshSeen and doc.contains(post.nodes.root)
          post.indexRefreshSeen = true
          n++
      $.event 'IndexRefresh' if n

    toggleHiddenThreads: ->
      $('#hidden-toggle a', Index.navLinks).textContent = if Index.showHiddenThreads = !Index.showHiddenThreads
        'Hide'
      else
        'Show'
      Index.buildIndex()

    mode: ->
      Index.pushState {mode: @value}
      Index.pageLoad false

    sort: ->
      Index.pushState {sort: @value}
      Index.pageLoad false

    resort: (e) ->
      Index.changed.order = true
      Index.pageLoad false unless e?.detail?.deferred

    perBoardSort: ->
      Conf['Index Sort'] = if @checked then {} else ''
      Index.saveSort()

    size: (e) ->
      if Conf['Index Mode'] isnt 'catalog'
        $.rmClass Index.root, 'catalog-small'
        $.rmClass Index.root, 'catalog-large'
      else if Conf['Index Size'] is 'small'
        $.addClass Index.root, 'catalog-small'
        $.rmClass Index.root,  'catalog-large'
      else
        $.addClass Index.root, 'catalog-large'
        $.rmClass Index.root,  'catalog-small'
      Index.buildIndex() if e

    replies: ->
      Index.buildThreads()
      Index.sort()
      Index.buildIndex()

    hover: ->
      doc.classList.toggle 'catalog-hover-expand', Conf['Catalog Hover Expand']
      Index.cb.replies() if Conf['Show Replies'] and Conf['Catalog Hover Expand']

    popstate: (e) ->
      if e?.state
        {searched, mode, sort} = e.state
        page = Index.getCurrentPage()
        Index.setState {search: searched, mode, sort, page}
        Index.pageLoad false
      else
        # page load or hash change
        nCommands = Index.processHash()
        if Conf['Refreshed Navigation'] and nCommands
          Index.update()
        else
          Index.pageLoad()

    pageNav: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      switch e.target.nodeName
        when 'BUTTON'
          e.target.blur()
          a = e.target.parentNode
        when 'A'
          a = e.target
        else
          return
      return if a.textContent is 'Catalog'
      e.preventDefault()
      Index.userPageNav +a.pathname.split(/\/+/)[2] or 1

    refreshFront: ->
      Index.pushState {page: 1}
      Index.update()

  scrollToIndex: ->
    # Scroll to navlinks, or top of board if navlinks are hidden.
    Header.scrollToIfNeeded (if Index.navLinks.getBoundingClientRect().height then Index.navLinks else Index.root)

  getCurrentPage: ->
    +window.location.pathname.split(/\/+/)[2] or 1

  userPageNav: (page) ->
    Index.pushState {page}
    if Conf['Refreshed Navigation']
      Index.update()
    else
      Index.pageLoad()

  hashCommands:
    mode:
      'paged':         'paged'
      'infinite-scrolling': 'infinite'
      'infinite':      'infinite'
      'all-threads':   'all pages'
      'all-pages':     'all pages'
      'catalog':       'catalog'
    sort:
      'bump-order':    'bump'
      'last-reply':    'lastreply'
      'last-long-reply': 'lastlong'
      'creation-date': 'birth'
      'reply-count':   'replycount'
      'file-count':    'filecount'

  processHash: ->
    # XXX https://bugzilla.mozilla.org/show_bug.cgi?id=483304
    hash = location.href.match(/#.*/)?[0] or ''
    state =
      replace: true
    commands = hash[1..].split '/'
    leftover = []
    for command in commands
      if (mode = Index.hashCommands.mode[command])
        state.mode = mode
      else if command is 'index'
        state.mode = Conf['Previous Index Mode']
        state.page = 1
      else if (sort = Index.hashCommands.sort[command])
        state.sort = sort
      else if /^s=/.test command
        state.search = decodeURIComponent(command[2..]).replace(/\+/g, ' ').trim()
      else
        leftover.push command
    hash = leftover.join '/'
    state.hash = "##{hash}" if hash
    Index.pushState state
    commands.length - leftover.length

  pushState: (state) ->
    {search, hash, replace} = state
    pageBeforeSearch = history.state?.oldpage
    if search? and search isnt Index.search
      state.page = if search then 1 else (pageBeforeSearch or 1)
      if !search
        pageBeforeSearch = undefined
      else if !Index.search
        pageBeforeSearch = Index.currentPage
    Index.setState state
    pathname = if Index.currentPage is 1 then "/#{g.BOARD}/" else "/#{g.BOARD}/#{Index.currentPage}"
    hash or= ''
    history[if replace then 'replaceState' else 'pushState']
      mode:     Conf['Index Mode']
      sort:     Index.currentSort
      searched: Index.search
      oldpage:  pageBeforeSearch
    , '', "#{location.protocol}//#{location.host}#{pathname}#{hash}"

  setState: ({search, mode, sort, page, hash}) ->
    if search? and search isnt Index.search
      Index.changed.search = true
      Index.search = search
    if mode? and mode isnt Conf['Index Mode']
      Index.changed.mode = true
      Conf['Index Mode'] = mode
      $.set 'Index Mode', mode
      unless mode is 'catalog' or Conf['Previous Index Mode'] is mode
        Conf['Previous Index Mode'] = mode
        $.set 'Previous Index Mode', mode
    if sort? and sort isnt Index.currentSort
      Index.changed.sort = true
      Index.currentSort = sort
      Index.saveSort()
    page = 1 if Conf['Index Mode'] in ['all pages', 'catalog']
    if page? and page isnt Index.currentPage
      Index.changed.page = true
      Index.currentPage = page
    if hash?
      Index.changed.hash = true

  saveSort: ->
    if typeof Conf['Index Sort'] is 'object'
      Conf['Index Sort'][g.BOARD.ID] = Index.currentSort
    else
      Conf['Index Sort'] = Index.currentSort
    $.set 'Index Sort', Conf['Index Sort']

  pageLoad: (scroll=true) ->
    return unless Index.liveThreadData
    {threads, order, search, mode, sort, page, hash} = Index.changed
    threads or= search
    order   or= sort
    Index.sort()          if threads or order
    Index.buildPagelist() if threads
    Index.setupSearch()   if search
    Index.setupMode()     if mode
    Index.setupSort()     if sort
    Index.buildIndex()    if threads or mode or page or order
    Index.setPage()       if threads or page
    Index.scrollToIndex() if scroll and not hash
    Header.hashScroll()   if hash
    Index.changed = {}

  setupMode: ->
    for mode in ['paged', 'infinite', 'all pages', 'catalog']
      $[if mode is Conf['Index Mode'] then 'addClass' else 'rmClass'] doc, "#{mode.replace /\ /g, '-'}-mode"
    Index.selectMode.value = Conf['Index Mode']
    Index.cb.size()
    Index.showHiddenThreads = false
    $('#hidden-toggle a', Index.navLinks).textContent = 'Show'

  setupSort: ->
    Index.selectSort.value = Index.currentSort

  getPagesNum: ->
    if Index.search
      Math.ceil Index.sortedThreads.length / Index.threadsNumPerPage
    else
      Index.pagesNum

  getMaxPageNum: ->
    Math.max 1, Index.getPagesNum()

  buildPagelist: ->
    pagesRoot = $ '.pages', Index.pagelist
    maxPageNum = Index.getMaxPageNum()
    if pagesRoot.childElementCount isnt maxPageNum
      nodes = []
      for i in [1..maxPageNum] by 1
        a = $.el 'a',
          textContent: i
          href: if i is 1 then './' else i
        nodes.push $.tn('['), a, $.tn '] '
      $.rmAll pagesRoot
      $.add pagesRoot, nodes

  setPage: ->
    pageNum    = Index.currentPage
    maxPageNum = Index.getMaxPageNum()
    pagesRoot  = $ '.pages', Index.pagelist

    # Previous/Next buttons
    prev = pagesRoot.previousSibling.firstChild
    next = pagesRoot.nextSibling.firstChild
    href = Math.max pageNum - 1, 1
    prev.href = if href is 1 then './' else href
    prev.firstChild.disabled = href is pageNum
    href = Math.min pageNum + 1, maxPageNum
    next.href = if href is 1 then './' else href
    next.firstChild.disabled = href is pageNum

    # <strong> current page
    if strong = $ 'strong', pagesRoot
      return if +strong.textContent is pageNum
      $.replace strong, strong.firstChild
    else
      strong = $.el 'strong'

    a = pagesRoot.children[pageNum - 1]
    $.before a, strong
    $.add strong, a

  updateHideLabel: ->
    hiddenCount = 0
    for threadID, thread of g.BOARD.threads when thread.isHidden
      hiddenCount++ if thread.ID in Index.liveThreadIDs
    unless hiddenCount
      Index.hideLabel.hidden = true
      Index.cb.toggleHiddenThreads() if Index.showHiddenThreads
      return
    Index.hideLabel.hidden = false
    $('#hidden-count', Index.navLinks).textContent = if hiddenCount is 1
      '1 hidden thread'
    else
      "#{hiddenCount} hidden threads"

  update: (firstTime) ->
    Index.req?.abort()
    Index.notice?.close()

    if Conf['Index Refresh Notifications'] and d.readyState isnt 'loading'
      # Optional notification for manual refreshes
      Index.notice = new Notice 'info', 'Refreshing index...'
    else
      # Also display notice if Index Refresh is taking too long
      now = Date.now()
      $.ready ->
        Index.nTimeout = setTimeout (->
          if Index.req and !Index.notice
            Index.notice = new Notice 'info', 'Refreshing index...'
        ), 3 * $.SECOND - (Date.now() - now)

    # Hard refresh in case of incomplete page load.
    if not firstTime and d.readyState isnt 'loading' and not $('.board + *')
      location.reload()
      return

    Index.req = $.ajax "//a.4cdn.org/#{g.BOARD}/catalog.json",
      onabort:   Index.load
      onloadend: Index.load
    ,
      whenModified: 'Index'
    $.addClass Index.button, 'fa-spin'

  load: (e) ->
    $.rmClass Index.button, 'fa-spin'
    {req, notice, nTimeout} = Index
    clearTimeout nTimeout if nTimeout
    delete Index.nTimeout
    delete Index.req
    delete Index.notice

    if e.type is 'abort'
      req.onloadend = null
      notice?.close()
      return

    if req.status not in [200, 304]
      err = "Index refresh failed. #{if req.status then "Error #{req.statusText} (#{req.status})" else 'Connection Error'}"
      if notice
        notice.setType 'warning'
        notice.el.lastElementChild.textContent = err
        setTimeout notice.close, $.SECOND
      else
        new Notice 'warning', err, 1
      return

    try
      if req.status is 200
        Index.parse req.response
      else if req.status is 304
        Index.pageLoad()
    catch err
      c.error "Index failure: #{err.message}", err.stack
      # network error or non-JSON content for example.
      if notice
        notice.setType 'error'
        notice.el.lastElementChild.textContent = 'Index refresh failed.'
        setTimeout notice.close, $.SECOND
      else
        new Notice 'error', 'Index refresh failed.', 1
      return

    if notice
      if Conf['Index Refresh Notifications']
        notice.setType 'success'
        notice.el.lastElementChild.textContent = 'Index refreshed!'
        setTimeout notice.close, $.SECOND
      else
        notice.close()

    timeEl = $ '#index-last-refresh time', Index.navLinks
    timeEl.dataset.utc = Date.parse req.getResponseHeader 'Last-Modified'
    RelativeDates.update timeEl

  parse: (pages) ->
    $.cleanCache (url) -> /^\/\/a\.4cdn\.org\//.test url
    Index.parseThreadList pages
    Index.buildThreads()
    Index.changed.threads = true
    Index.pageLoad()

  parseThreadList: (pages) ->
    Index.pagesNum          = pages.length
    Index.threadsNumPerPage = pages[0]?.threads.length or 1
    Index.liveThreadData    = pages.reduce ((arr, next) -> arr.concat next.threads), []
    Index.liveThreadIDs     = Index.liveThreadData.map (data) -> data.no
    Index.liveThreadDict    = {}
    for data in Index.liveThreadData
      Index.liveThreadDict[data.no] = data
    if Index.liveThreadData[0]
      Build.spoilerRange[g.BOARD.ID] = Index.liveThreadData[0].custom_spoiler
    g.BOARD.threads.forEach (thread) ->
      thread.collect() unless thread.ID in Index.liveThreadIDs
    return

  buildThreads: ->
    return unless Index.liveThreadData
    Index.nodes = {}
    threads     = []
    posts       = []
    for threadData, i in Index.liveThreadData
      try
        if (thread = g.BOARD.threads[threadData.no])
          thread.setCount 'post', threadData.replies + 1,                threadData.bumplimit
          thread.setCount 'file', threadData.images  + !!threadData.ext, threadData.imagelimit
          thread.setStatus 'Sticky', !!threadData.sticky
          thread.setStatus 'Closed', !!threadData.closed
          if thread.catalogView
            $.rm thread.catalogView.nodes.replies
            thread.catalogView.nodes.replies = null
        else
          thread = new Thread threadData.no, g.BOARD
          threads.push thread

        unless (OP = thread.OP) and not OP.isFetchedQuote
          OP = new Post Build.postFromObject(threadData, g.BOARD.ID, true), thread, g.BOARD
          posts.push OP
        thread.setPage i // Index.threadsNumPerPage + 1

        Index.nodes[thread.ID] = Build.thread thread, threadData
      catch err
        # Skip posts that we failed to parse.
        errors = [] unless errors
        errors.push
          message: "Parsing of Thread No.#{thread} failed. Thread will be skipped."
          error: err
    Main.handleErrors errors if errors

    Main.callbackNodes 'Thread', threads
    Main.callbackNodes 'Post',   posts
    Index.updateHideLabel()
    $.event 'IndexRefreshInternal'

  buildReplies: (threads) ->
    posts = []
    for thread in threads
      continue unless (lastReplies = Index.liveThreadDict[thread.ID].last_replies)
      nodes = []
      for data in lastReplies
        if (post = thread.posts[data.no]) and not post.isFetchedQuote
          nodes.push post.nodes.root
          continue
        nodes.push node = Build.postFromObject data, thread.board.ID
        try
          posts.push new Post node, thread, thread.board
        catch err
          # Skip posts that we failed to parse.
          errors = [] unless errors
          errors.push
            message: "Parsing of Post No.#{data.no} failed. Post will be skipped."
            error: err
      $.add Index.nodes[thread.ID], nodes

    Main.handleErrors errors if errors
    Main.callbackNodes 'Post', posts

  buildCatalogViews: (threads) ->
    catalogThreads = []
    for thread in threads when !thread.catalogView
      i = Index.liveThreadIDs.indexOf thread.ID
      root = Build.catalogThread thread, Index.liveThreadData[i], i // Index.threadsNumPerPage + 1
      catalogThreads.push new CatalogThread root, thread
    Main.callbackNodes 'CatalogThread', catalogThreads

  sizeCatalogViews: (threads) ->
    # XXX When browsers support CSS3 attr(), use it instead.
    size = if Conf['Index Size'] is 'small' then 150 else 250
    for thread in threads
      {thumb} = thread.catalogView.nodes
      {width, height} = thumb.dataset
      continue unless width
      ratio = size / Math.max width, height
      thumb.style.width  = width  * ratio + 'px'
      thumb.style.height = height * ratio + 'px'
    return

  buildCatalogReplies: (threads) ->
    for thread in threads
      {nodes} = thread.catalogView
      continue unless (lastReplies = Index.liveThreadDict[thread.ID].last_replies)

      if nodes.replies
        # RelativeDates will stop updating elements if they go out of document.
        RelativeDates.update timeEl for timeEl in $$ 'time', nodes.replies
        continue

      replies = []
      for data in lastReplies
        excerpt = ''
        if data.com
          excerpt = Build.parseCommentDisplay(data.com).replace(/>>\d+/g, '').trim().replace(/\n+/g, ' // ')
        if data.ext
          excerpt or= "#{data.filename}#{data.ext}"
        if data.com
          excerpt or= Build.unescape data.com.replace(/<br\b[^<]*>/gi, ' // ')
        excerpt or= '\xA0'
        excerpt = "#{excerpt[...70]}..." if excerpt.length > 73

        link = Build.postURL thread.board.ID, thread.ID, data.no
        reply = $.el 'div', {className: 'catalog-reply'},
          <%= readHTML('CatalogReply.html') %>
        RelativeDates.update $('time', reply)
        $.on $('.catalog-reply-preview', reply), 'mouseover', QuotePreview.mouseover
        replies.push reply

      nodes.replies = $.el 'div', className: 'catalog-replies'
      $.add nodes.replies, replies
      $.add thread.OP.nodes.post, nodes.replies
    return

  sort: ->
    {liveThreadIDs, liveThreadData} = Index
    return unless liveThreadData
    sortedThreadIDs = switch Index.currentSort
      when 'lastreply'
        [liveThreadData...].sort((a, b) ->
          a = num[num.length - 1] if (num = a.last_replies)
          b = num[num.length - 1] if (num = b.last_replies)
          b.no - a.no
        ).map (post) -> post.no
      when 'lastlong'
        lastlong = (thread) ->
          for r, i in (thread.last_replies or []) by -1
            return r if r.com and Build.parseComment(r.com).replace(/[^a-z]/ig, '').length >= 100
          thread
        [liveThreadData...].sort((a, b) ->
          lastlong(b).no - lastlong(a).no
        ).map (post) -> post.no
      when 'bump'       then liveThreadIDs
      when 'birth'      then [liveThreadIDs... ].sort (a, b) -> b - a
      when 'replycount' then [liveThreadData...].sort((a, b) -> b.replies - a.replies).map (post) -> post.no
      when 'filecount'  then [liveThreadData...].sort((a, b) -> b.images  - a.images ).map (post) -> post.no
    Index.sortedThreads = sortedThreadIDs.map (threadID) -> g.BOARD.threads[threadID]
    if Index.search and (threads = Index.querySearch Index.search)
      Index.sortedThreads = threads
    # Sticky threads
    Index.sortOnTop (thread) -> thread.isSticky
    # Highlighted threads
    Index.sortOnTop (thread) -> thread.isOnTop or Conf['Pin Watched Threads'] and ThreadWatcher.isWatched thread
    # Non-hidden threads
    Index.sortOnTop((thread) -> !thread.isHidden) if Conf['Anchor Hidden Threads']

  sortOnTop: (match) ->
    topThreads    = []
    bottomThreads = []
    for thread in Index.sortedThreads
      (if match thread then topThreads else bottomThreads).push thread
    Index.sortedThreads = topThreads.concat bottomThreads

  buildIndex: ->
    return unless Index.liveThreadData
    switch Conf['Index Mode']
      when 'all pages'
        threads = Index.sortedThreads
      when 'catalog'
        threads = Index.sortedThreads.filter (thread) -> !thread.isHidden isnt Index.showHiddenThreads
      else
        threads = Index.threadsOnPage Index.currentPage
    delete Index.pageNum
    $.rmAll Index.root
    $.rmAll Header.hover
    if Conf['Index Mode'] is 'catalog'
      Index.buildCatalog threads
    else
      Index.buildStructure threads

  threadsOnPage: (pageNum) ->
    nodesPerPage = Index.threadsNumPerPage
    offset = nodesPerPage * (pageNum - 1)
    Index.sortedThreads[offset ... offset + nodesPerPage]

  buildStructure: (threads) ->
    Index.buildReplies threads if Conf['Show Replies']
    nodes = []
    for thread in threads
      if thread.nodes.placeholder
        $.replace thread.nodes.placeholder, thread.OP.nodes.root
        thread.nodes.placeholder = null
        thread.OP.setCatalogOP false
      if (file = thread.OP.file) and (thumb = thread.OP.file.thumb) and thumb.dataset.src
        thumb.src = thumb.dataset.src
        # XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1021289
        thumb.removeAttribute 'data-src'
      nodes.push Index.nodes[thread.ID], $.el('hr')
    $.add Index.root, nodes
    if doc.contains Index.root
      $.event 'PostsInserted'

  buildCatalog: (threads) ->
    Index.buildCatalogViews threads
    Index.sizeCatalogViews threads
    Index.buildCatalogReplies threads if Conf['Show Replies'] and Conf['Catalog Hover Expand']
    nodes = []
    for thread in threads
      unless thread.nodes.placeholder
        thread.nodes.placeholder = $.el 'div'
        $.replace thread.OP.nodes.root, thread.nodes.placeholder
        $.add thread.catalogView.nodes.root, thread.OP.nodes.root
        thread.OP.setCatalogOP true
      nodes.push thread.catalogView.nodes.root
    $.add Index.root, nodes
    if doc.contains Index.root
      $.event 'PostsInserted'

  clearSearch: ->
    Index.searchInput.value = ''
    Index.onSearchInput()
    Index.searchInput.focus()

  setupSearch: ->
    Index.searchInput.value = Index.search
    if Index.search
      Index.searchInput.dataset.searching = 1
    else
      # XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1021289
      Index.searchInput.removeAttribute 'data-searching'

  onSearchInput: ->
    search = Index.searchInput.value.trim()
    return if search is Index.search
    Index.pushState
      search:  search
      replace: !!search is !!Index.search
    Index.pageLoad false

  querySearch: (query) ->
    return unless keywords = query.toLowerCase().match /\S+/g
    Index.sortedThreads.filter (thread) ->
      Index.searchMatch thread, keywords

  searchMatch: (thread, keywords) ->
    {info, file} = thread.OP
    text = []
    for key in ['comment', 'subject', 'name', 'tripcode', 'email']
      text.push info[key] if key of info
    text.push file.name if file
    text = text.join(' ').toLowerCase()
    for keyword in keywords
      return false if -1 is text.indexOf keyword
    return true
