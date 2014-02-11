Index =
  showHiddenThreads: false
  init: ->
    return if g.BOARD.ID is 'f' or !Conf['JSON Navigation'] or g.VIEW isnt 'index'

    @board = "#{g.BOARD}"

    CatalogThread.callbacks.push
      name: 'Catalog Features'
      cb:   @catalogNode

    if history.state?.mode
      Conf['Index Mode'] = history.state?.mode
    @pushState
      command: location.hash[1..]
      replace: true

    @button = $.el 'a',
      className: 'index-refresh-shortcut fa fa-refresh'
      title: 'Refresh'
      href: 'javascript:;'
      textContent: 'Refresh Index'
    $.on @button, 'click', -> Index.update()
    Header.addShortcut @button, 1

    modeEntry =
      el: $.el 'span', textContent: 'Index mode'
      subEntries: [
        { el: $.el 'label', <%= html('<input type="radio" name="Index Mode" value="paged"> Paged') %> }
        { el: $.el 'label', <%= html('<input type="radio" name="Index Mode" value="infinite"> Infinite scrolling') %> }
        { el: $.el 'label', <%= html('<input type="radio" name="Index Mode" value="all pages"> All threads') %> }
        { el: $.el 'label', <%= html('<input type="radio" name="Index Mode" value="catalog"> Catalog') %> }
      ]
      open: ->
        for label in @subEntries
          input = label.el.firstChild
          input.checked = Conf['Index Mode'] is input.value
        true
    for label in modeEntry.subEntries
      input = label.el.firstChild
      $.on input, 'change', @cb.mode

    repliesEntry = el: UI.checkbox 'Show Replies',          ' Show replies'
    anchorEntry  = el: UI.checkbox 'Anchor Hidden Threads', ' Anchor hidden threads'
    refNavEntry  = el: UI.checkbox 'Refreshed Navigation',  ' Refreshed navigation'
    anchorEntry.el.title = 'Move hidden threads at the end of the index.'
    refNavEntry.el.title = 'Refresh index when navigating through pages.'
    for label in [repliesEntry, anchorEntry, refNavEntry]
      input = label.el.firstChild
      {name} = input
      $.on input, 'change', $.cb.checked
      switch name
        when 'Show Replies'
          $.on input, 'change', @cb.replies
        when 'Anchor Hidden Threads'
          $.on input, 'change', @cb.sort

    Header.menu.addEntry
      el: $.el 'span',
        textContent: 'Index Navigation'
      order: 98
      subEntries: [repliesEntry, anchorEntry, refNavEntry, modeEntry]

    $.addClass doc, 'index-loading', "#{Conf['Index Mode'].replace /\ /g, '-'}-mode"
    @root     = $.el 'div', className: 'board'
    @cb.size()
    @pagelist = $.el 'div', className: 'pagelist'
    $.extend @pagelist, <%= importHTML('Features/Index-pagelist') %>
    $('.cataloglink a', @pagelist).href = CatalogLinks.catalog()
    @navLinks = $.el 'div', className: 'navLinks'
    $.extend @navLinks, <%= importHTML('Features/Index-navlinks') %>
    $('.returnlink a',  @navLinks).href = CatalogLinks.index()
    $('.cataloglink a', @navLinks).href = CatalogLinks.catalog()
    @searchInput = $ '#index-search', @navLinks
    @hideLabel   = $ '#hidden-label', @navLinks
    @selectSort  = $ '#index-sort',   @navLinks
    @selectSize  = $ '#index-size',   @navLinks
    @currentPage = @getCurrentPage()
    $.on window, 'popstate', @cb.popstate

    $.on d, 'scroll', Index.scroll
    $.on @pagelist, 'click', @cb.pageNav
    $.on @searchInput, 'input', @onSearchInput
    $.on $('#index-search-clear', @navLinks), 'click', @clearSearch
    $.on $('#hidden-toggle a',    @navLinks), 'click', @cb.toggleHiddenThreads
    $.on $('.returnlink a',       @navLinks), 'click', @cb.frontPage unless Conf['Use 4chan X Catalog']
    for select in [@selectSort, @selectSize]
      select.value = Conf[select.name]
      $.on select, 'change', $.cb.value
    $.on @selectSort, 'change', @cb.sort
    $.on @selectSize, 'change', @cb.size

    @update()
    $.asap (-> $('.board > .thread > .postContainer', doc) or d.readyState isnt 'loading'), ->
      Index.hat = $ '.board > .thread > img:first-child'
      if Index.hat and Index.nodes
        for threadRoot in Index.nodes
          $.prepend threadRoot, Index.hat.cloneNode false

      board = $ '.board'
      $.replace board, Index.root
      $.event 'PostsInserted'
      # Hacks:
      # - When removing an element from the document during page load,
      #   its ancestors will still be correctly created inside of it.
      # - Creating loadable elements inside of an origin-less document
      #   will not download them.
      # - Combine the two and you get a download canceller!
      #   Does not work on Firefox unfortunately. bugzil.la/939713
      d.implementation.createDocument(null, null, null).appendChild board

      $.rm el for el in $$ '.navLinks'
      $.id('search-box')?.parentNode.remove()
      topNavPos = $.id('delform').previousElementSibling
      $.before topNavPos, $.el 'hr'
      $.before topNavPos, Index.navLinks

    $.asap (-> $('.pagelist', doc) or d.readyState isnt 'loading'), ->
      if pagelist = $('.pagelist')
        $.replace pagelist, Index.pagelist
      else
        $.after $.id('delform'), Index.pagelist
      $.rmClass doc, 'index-loading'

  scroll: ->
    return if Index.req or Conf['Index Mode'] isnt 'infinite' or (window.scrollY <= doc.scrollHeight - (300 + window.innerHeight))
    Index.pageNum = Index.getCurrentPage() unless Index.pageNum? # Avoid having to pushState to keep track of the current page

    pageNum = ++Index.pageNum
    return Index.endNotice() if pageNum > Index.pagesNum

    nodes = Index.buildSinglePage pageNum
    Index.buildReplies   nodes if Conf['Show Replies']
    Index.buildStructure nodes
    
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
      return if g.VIEW isnt 'index' or !Conf['JSON Navigation'] or !Conf['Menu'] or !Conf['Thread Hiding Link'] or g.BOARD.ID is 'f'

      Menu.menu.addEntry
        el: $.el 'a', href: 'javascript:;'
        order: 20
        open: ({thread}) ->
          return false if Conf['Index Mode'] isnt 'catalog'
          @el.textContent = if thread.isHidden
            'Unhide thread'
          else
            'Hide thread'
          $.off @el, 'click', @cb if @cb
          @cb = ->
            $.event 'CloseMenu'
            Index.toggleHide thread
          $.on @el, 'click', @cb
          true

  catalogNode: ->
    $.on @nodes.thumb.parentNode, 'click', Index.onClick
  onClick: (e) ->
    return if e.button isnt 0
    thread = g.threads[@parentNode.dataset.fullID]
    if e.shiftKey
      Index.toggleHide thread
    else
      return
    e.preventDefault()
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
    toggleHiddenThreads: ->
      $('#hidden-toggle a', Index.navLinks).textContent = if Index.showHiddenThreads = !Index.showHiddenThreads
        'Hide'
      else
        'Show'
      Index.sort()
      Index.buildIndex()
    mode: ->
      mode = @value
      $.set 'Index Mode', mode
      unless mode is 'catalog'
        Conf['Previous Index Mode'] = mode
        $.set 'Previous Index Mode', mode
      state = Index.pushState {mode}
      if state.mode
        Index.applyMode()
        Index.buildIndex()
        Index.setPage()
    sort: ->
      Index.sort()
      Index.buildIndex()
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
    popstate: (e) ->
      unless e?.state
        # page load or hash change
        state = Index.pushState
          command: location.hash[1..]
          replace: true
        if state.command
          Index[if Conf['Refreshed Navigation'] then 'update' else 'pageLoad'] state
        return
      {mode} = e.state
      pageNum = Index.getCurrentPage()
      unless Conf['Index Mode'] is mode and Index.currentPage is pageNum
        unless Conf['Index Mode'] is mode
          Conf['Index Mode'] = mode
          Index.applyMode()
        Index.currentPage = pageNum
        Index.buildIndex()
        Index.setPage()
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
      Index.userPageNav +a.pathname.split('/')[2] or 1
    frontPage: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      e.preventDefault()
      Index.userPageNav 1

  scrollToIndex: ->
    Header.scrollToIfNeeded Index.navLinks

  getCurrentPage: ->
    if Conf['Index Mode'] in ['all pages', 'catalog']
      1
    else
      +window.location.pathname.split('/')[2] or 1
  userPageNav: (page) ->
    state = Index.pushState {page}
    if Conf['Refreshed Navigation']
      Index.update state
    else
      Index.pageLoad state if state.page
  pushState: (state) ->
    {pathname, hash} = location
    {command} = state
    switch command
      when 'paged', 'infinite', 'all-pages', 'catalog'
        state.mode = command.replace /-/g, ' '
      when 'index'
        state.mode = Conf['Previous Index Mode']
        state.page = 1
      else
        delete state.command
    {mode} = state
    if mode
      delete state.mode if mode is Conf['Index Mode']
      Conf['Index Mode'] = mode
      state.page = 1 if mode in ['all pages', 'catalog']
      hash = ''
    {page} = state
    if page
      delete state.page if page is Index.currentPage
      Index.currentPage = page
      pathname = if page is 1 then "/#{g.BOARD}/" else "/#{g.BOARD}/#{page}"
      hash = ''
    history[if state.replace then 'replaceState' else 'pushState'] {mode: Conf['Index Mode']}, '', pathname + hash
    state
  pageLoad: ({mode}) ->
    Index.applyMode() if mode
    Index.buildIndex()
    Index.setPage()
    Index.scrollToIndex()
  applyMode: ->
    for mode in ['paged', 'infinite', 'all pages', 'catalog']
      $[if mode is Conf['Index Mode'] then 'addClass' else 'rmClass'] doc, "#{mode.replace /\ /g, '-'}-mode"
    Index.cb.size()
    Index.showHiddenThreads = false
    $('#hidden-toggle a', Index.navLinks).textContent = 'Show'

  getPagesNum: ->
    if Index.isSearching
      Math.ceil Index.sortedNodes.length / Index.threadsNumPerPage
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
    pageNum    = Index.getCurrentPage()
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

  update: (state) ->
    return unless navigator.onLine
    delete Index.pageNum
    Index.req?.abort()
    Index.notice?.close()

    # This notice only displays if Index Refresh is taking too long
    now = Date.now()
    $.ready ->
      Index.nTimeout = setTimeout (->
        if Index.req and !Index.notice
          Index.notice = new Notice 'info', 'Refreshing index...', 2
      ), 3 * $.SECOND - (Date.now() - now)

    Index.req = $.ajax "//a.4cdn.org/#{g.BOARD}/catalog.json",
      onloadend: (e) -> Index.load e, state
    ,
      whenModified: true
    $.addClass Index.button, 'fa-spin'

  load: (e, state) ->
    $.rmClass Index.button, 'fa-spin'
    {req, notice, nTimeout} = Index
    clearTimeout nTimeout if nTimeout
    delete Index.nTimeout
    delete Index.req
    delete Index.notice

    if e.type is 'abort'
      req.onloadend = null
      notice.close()
      return

    if req.status not in [200, 304]
      err = "Index refresh failed. Error #{req.statusText} (#{req.status})"
      if notice
        notice.setType 'warning'
        notice.el.lastElementChild.textContent = err
        setTimeout notice.close, $.SECOND
      else
        new Notice 'warning', err, 1
      return

    try
      if req.status is 200
        Index.parse req.response, state
      else if req.status is 304 and state?
        Index.pageLoad state
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

    timeEl = $ '#index-last-refresh time', Index.navLinks
    timeEl.dataset.utc = Date.parse req.getResponseHeader 'Last-Modified'
    RelativeDates.update timeEl
    Index.scrollToIndex()

  parse: (pages, state) ->
    $.cleanCache (url) -> /^\/\/a\.4cdn\.org\//.test url
    Index.parseThreadList pages
    Index.buildThreads()
    Index.sort()
    Index.buildPagelist()
    if state?
      Index.pageLoad state
      return
    Index.buildIndex()
    Index.setPage()

  parseThreadList: (pages) ->
    Index.pagesNum          = pages.length
    Index.threadsNumPerPage = pages[0].threads.length
    Index.liveThreadData    = pages.reduce ((arr, next) -> arr.concat next.threads), []
    Index.liveThreadIDs     = Index.liveThreadData.map (data) -> data.no
    g.BOARD.threads.forEach (thread) ->
      thread.collect() unless thread.ID in Index.liveThreadIDs
    return

  buildThreads: ->
    Index.nodes = []
    threads     = []
    posts       = []
    for threadData, i in Index.liveThreadData
      try
        threadRoot = Build.thread g.BOARD, threadData
        $.prepend threadRoot, Index.hat.cloneNode false if Index.hat
        if thread = g.BOARD.threads[threadData.no]
          thread.setCount 'post', threadData.replies + 1,                threadData.bumplimit
          thread.setCount 'file', threadData.images  + !!threadData.ext, threadData.imagelimit
          thread.setStatus 'Sticky', !!threadData.sticky
          thread.setStatus 'Closed', !!threadData.closed
        else
          thread = new Thread threadData.no, g.BOARD
          threads.push thread
        Index.nodes.push threadRoot
        unless thread.ID of thread.posts
          posts.push new Post $('.opContainer', threadRoot), thread, g.BOARD
        thread.setPage i // Index.threadsNumPerPage + 1
      catch err
        # Skip posts that we failed to parse.
        errors = [] unless errors
        errors.push
          message: "Parsing of Thread No.#{thread} failed. Thread will be skipped."
          error: err
    Main.handleErrors errors if errors

    # Add the threads in a container to make sure all features work.
    $.nodes Index.nodes
    Main.callbackNodes Thread, threads
    Main.callbackNodes Post,   posts
    Index.updateHideLabel()
    $.event 'IndexRefresh'

  buildReplies: (threadRoots) ->
    posts = []
    for threadRoot in threadRoots
      thread = Get.threadFromRoot threadRoot
      i = Index.liveThreadIDs.indexOf thread.ID
      continue unless lastReplies = Index.liveThreadData[i].last_replies
      nodes = []
      for data in lastReplies
        if post = thread.posts[data.no]
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
      $.add threadRoot, nodes

    Main.handleErrors errors if errors
    Main.callbackNodes Post, posts

  buildCatalogViews: ->
    threads = Index.sortedNodes
      .map((threadRoot) -> Get.threadFromRoot threadRoot)
      .filter (thread) -> !thread.isHidden isnt Index.showHiddenThreads
    catalogThreads = []
    for thread in threads when !thread.catalogView
      catalogThreads.push new CatalogThread Build.catalogThread(thread), thread
    Main.callbackNodes CatalogThread, catalogThreads
    threads.map (thread) -> thread.catalogView.nodes.root

  sizeCatalogViews: (nodes) ->
    # XXX When browsers support CSS3 attr(), use it instead.
    size = if Conf['Index Size'] is 'small' then 150 else 250
    for node in nodes
      thumb = $ '.catalog-thumb', node
      {width, height} = thumb.dataset
      continue unless width
      ratio = size / Math.max width, height
      thumb.style.width  = width  * ratio + 'px'
      thumb.style.height = height * ratio + 'px'
    return

  sort: ->
    {liveThreadIDs, liveThreadData} = Index
    sortedThreadIDs = {
      lastreply:
        [liveThreadData...].sort((a, b) ->
          a = num[num.length - 1] if (num = a.last_replies)
          b = num[num.length - 1] if (num = b.last_replies)
          b.no - a.no
        ).map (post) -> post.no
      bump:       liveThreadIDs
      birth:      [liveThreadIDs... ].sort (a, b) -> b - a
      replycount: [liveThreadData...].sort((a, b) -> b.replies - a.replies).map (post) -> post.no
      filecount:  [liveThreadData...].sort((a, b) -> b.images  - a.images ).map (post) -> post.no
    }[Conf['Index Sort']]
    Index.sortedNodes = sortedNodes = []
    {nodes} = Index
    for threadID in sortedThreadIDs
      sortedNodes.push nodes[Index.liveThreadIDs.indexOf(threadID)]
    if Index.isSearching and nodes = Index.querySearch(Index.searchInput.value)
      Index.sortedNodes = nodes
    # Sticky threads
    Index.sortOnTop (thread) -> thread.isSticky
    # Highlighted threads
    Index.sortOnTop (thread) -> thread.isOnTop
    # Non-hidden threads
    Index.sortOnTop((thread) -> !thread.isHidden) if Conf['Anchor Hidden Threads']

  sortOnTop: (match) ->
    topNodes    = []
    bottomNodes = []
    for threadRoot in Index.sortedNodes
      (if match Get.threadFromRoot threadRoot then topNodes else bottomNodes).push threadRoot
    Index.sortedNodes = topNodes.concat(bottomNodes)

  buildIndex: ->
    switch Conf['Index Mode']
      when 'all pages'
        nodes = Index.sortedNodes
      when 'catalog'
        nodes = Index.buildCatalogViews()
        Index.sizeCatalogViews nodes
      else
        nodes = Index.buildSinglePage Index.getCurrentPage()
    $.rmAll Index.root
    $.rmAll Header.hover
    if Conf['Index Mode'] is 'catalog'
      $.add Index.root, nodes
    else
      Index.buildReplies nodes if Conf['Show Replies']
      Index.buildStructure nodes

  buildSinglePage: (pageNum) ->
    nodesPerPage = Index.threadsNumPerPage
    offset = nodesPerPage * (pageNum - 1)
    Index.sortedNodes.slice offset, offset + nodesPerPage

  buildStructure: (nodes) ->
    for node in nodes
      $.add Index.root, [node, $.el 'hr']
    $.event 'PostsInserted' if doc.contains Index.root
    ThreadHiding.onIndexBuild nodes

  isSearching: false

  clearSearch: ->
    Index.searchInput.value = null
    Index.onSearchInput()
    Index.searchInput.focus()

  onSearchInput: ->
    if Index.isSearching = !!Index.searchInput.value.trim()
      unless Index.searchInput.dataset.searching
        Index.searchInput.dataset.searching = 1
        Index.pageBeforeSearch = Index.getCurrentPage()
        pageNum = 1
      else
        pageNum = Index.getCurrentPage()
    else
      return unless Index.searchInput.dataset.searching
      pageNum = Index.pageBeforeSearch
      delete Index.pageBeforeSearch
      # XXX https://github.com/greasemonkey/greasemonkey/issues/1571
      Index.searchInput.removeAttribute 'data-searching'
    Index.sort()
    # Go to the last available page if we were past the limit.
    pageNum = Math.min pageNum, Index.getMaxPageNum() if Conf['Index Mode'] isnt 'all pages'
    Index.buildPagelist()
    if Index.currentPage is pageNum
      Index.buildIndex()
      Index.setPage()
    else
      Index.pageLoad Index.pushState {page: pageNum}

  querySearch: (query) ->
    return unless keywords = query.toLowerCase().match /\S+/g
    Index.search keywords

  search: (keywords) -> 
    Index.sortedNodes.filter (threadRoot) ->
      Index.searchMatch Get.threadFromRoot(threadRoot), keywords

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
