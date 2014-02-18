Index =
  showHiddenThreads: false
  init: ->
    if g.VIEW isnt 'index'
      $.ready @setupNavLinks
      return
    return if g.BOARD.ID is 'f'

    @db = new DataBoard 'pinnedThreads'
    Thread.callbacks.push
      name: 'Thread Pinning'
      cb:   @threadNode
    CatalogThread.callbacks.push
      name: 'Catalog Features'
      cb:   @catalogNode

    @button = $.el 'a',
      className: 'index-refresh-shortcut fa fa-refresh'
      title: 'Refresh Index'
      href: 'javascript:;'
    $.on @button, 'click', @update
    Header.addShortcut @button, 1

    threadNumEntry =
      el: $.el 'span', textContent: 'Threads per page'
      subEntries: [
        { el: $.el 'label', innerHTML: '<input type=number min=0 name="Threads per Page">', title: 'Use 0 for default value' }
      ]
    threadsNumInput = threadNumEntry.subEntries[0].el.firstChild
    threadsNumInput.value = Conf['Threads per Page']
    $.on threadsNumInput, 'change', $.cb.value
    $.on threadsNumInput, 'change', @cb.threadsNum

    targetEntry =
      el: $.el 'label',
        innerHTML: '<input type=checkbox name="Open threads in a new tab"> Open threads in a new tab'
        title: 'Catalog-only setting.'
    repliesEntry =
      el: $.el 'label',
        innerHTML: '<input type=checkbox name="Show Replies"> Show replies'
    anchorEntry =
      el: $.el 'label',
        innerHTML: '<input type=checkbox name="Anchor Hidden Threads"> Anchor hidden threads'
        title: 'Move hidden threads at the end of the index.'
    refNavEntry =
      el: $.el 'label',
        innerHTML: '<input type=checkbox name="Refreshed Navigation"> Refreshed navigation'
        title: 'Refresh index when navigating through pages.'
    for label in [targetEntry, repliesEntry, anchorEntry, refNavEntry]
      input = label.el.firstChild
      {name} = input
      input.checked = Conf[name]
      $.on input, 'change', $.cb.checked
      switch name
        when 'Open threads in a new tab'
          $.on input, 'change', @cb.target
        when 'Show Replies'
          $.on input, 'change', @cb.replies
        when 'Anchor Hidden Threads'
          $.on input, 'change', @cb.sort

    $.event 'AddMenuEntry',
      type: 'header'
      el: $.el 'span',
        textContent: 'Index Navigation'
      order: 90
      subEntries: [threadNumEntry, targetEntry, repliesEntry, anchorEntry, refNavEntry]

    $.addClass doc, 'index-loading'
    @update()

    @navLinks = $.el 'div',
      id: 'nav-links'
      innerHTML: <%= importHTML('General/Index-navlinks') %>
    @searchInput = $ '#index-search', @navLinks
    @hideLabel   = $ '#hidden-label', @navLinks
    @selectMode  = $ '#index-mode',   @navLinks
    @selectSort  = $ '#index-sort',   @navLinks
    @selectSize  = $ '#index-size',   @navLinks
    $.on @searchInput, 'input', @onSearchInput
    $.on $('#index-search-clear', @navLinks), 'click', @clearSearch
    $.on $('#hidden-toggle a',    @navLinks), 'click', @cb.toggleHiddenThreads
    for select in [@selectMode, @selectSort, @selectSize]
      select.value = Conf[select.name]
      $.on select, 'change', $.cb.value
    $.on @selectMode, 'change', @cb.mode
    $.on @selectSort, 'change', @cb.sort
    $.on @selectSize, 'change', @cb.size

    @root = $.el 'div', className: 'board'
    @pagelist = $.el 'div',
      className: 'pagelist'
      hidden: true
      innerHTML: <%= importHTML('General/Index-pagelist') %>
    @currentPage = @getCurrentPage()
    $.on window, 'popstate', @cb.popstate
    $.on @pagelist, 'click', @cb.pageNav
    $.on $('#custom-board-list', Header.bar), 'click', @cb.headerNav

    @cb.toggleCatalogMode()

    $.asap (-> $('.board', doc) or d.readyState isnt 'loading'), ->
      board = $ '.board'
      $.replace board, Index.root
      # Hacks:
      # - When removing an element from the document during page load,
      #   its ancestors will still be correctly created inside of it.
      # - Creating loadable elements inside of an origin-less document
      #   will not download them.
      # - Combine the two and you get a download canceller!
      #   Does not work on Firefox unfortunately. bugzil.la/939713
      d.implementation.createDocument(null, null, null).appendChild board

      for navLink in $$ '.navLinks'
        $.rm navLink
      $.before $.id('delform'), [Index.navLinks, $.x 'child::form/preceding-sibling::hr[1]']
      $.rmClass doc, 'index-loading'
      $.asap (-> $('.pagelist') or d.readyState isnt 'loading'), ->
        $.replace $('.pagelist'), Index.pagelist
  menu:
    init: ->
      return if g.VIEW isnt 'index' or !Conf['Menu'] or g.BOARD.ID is 'f'

      $.event 'AddMenuEntry',
        type: 'post'
        el: $.el 'a', href: 'javascript:;'
        order: 5
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

      $.event 'AddMenuEntry',
        type: 'post'
        el: $.el 'a', href: 'javascript:;'
        order: 6
        open: ({thread}) ->
          return false if Conf['Index Mode'] isnt 'catalog'
          @el.textContent = if thread.isPinned
            'Unpin thread'
          else
            'Pin thread'
          $.off @el, 'click', @cb if @cb
          @cb = ->
            $.event 'CloseMenu'
            Index.togglePin thread
          $.on @el, 'click', @cb
          true

  threadNode: ->
    return unless Index.db.get {boardID: @board.ID, threadID: @ID}
    @pin()
  catalogNode: ->
    $.on @nodes.thumb, 'click', Index.onClick
    return if Conf['Image Hover in Catalog']
    $.on @nodes.thumb, 'mouseover', Index.onOver
  onClick: (e) ->
    return if e.button isnt 0
    thread = g.threads[@parentNode.dataset.fullID]
    if e.shiftKey
      Index.toggleHide thread
    else if e.altKey
      Index.togglePin thread
    else
      return
    e.preventDefault()
  onOver: (e) ->
    # 4chan's less than stellar CSS forces us to include a .post and .postInfo
    # in order to have proper styling for the .nameBlock's content.
    {nodes} = g.threads[@parentNode.dataset.fullID].OP
    el = $.el 'div',
      innerHTML: '<div class=post><div class=postInfo>'
      className: 'thread-info'
      hidden: true
    $.add el.firstElementChild.firstElementChild, [
      $('.nameBlock', nodes.info).cloneNode true
      $.tn ' '
      nodes.date.cloneNode true
    ]
    $.add d.body, el
    UI.hover
      root: @
      el: el
      latestEvent: e
      endEvents: 'mouseout'
      offsetX: 15
      offsetY: -20
    setTimeout (-> el.hidden = false if el.parentNode), .25 * $.SECOND
  toggleHide: (thread) ->
    $.rm thread.catalogView.nodes.root
    if Index.showHiddenThreads
      ThreadHiding.show thread
      return unless ThreadHiding.db.get {boardID: thread.board.ID, threadID: thread.ID}
      # Don't save when un-hiding filtered threads.
    else
      ThreadHiding.hide thread
    ThreadHiding.saveHiddenState thread
  togglePin: (thread) ->
    data =
      boardID:  thread.board.ID
      threadID: thread.ID
    if thread.isPinned
      thread.unpin()
      Index.db.delete data
    else
      thread.pin()
      data.val = true
      Index.db.set data
    Index.sort()
    Index.buildIndex()
  setIndexMode: (mode) ->
    Index.selectMode.value = mode
    $.event 'change', null, Index.selectMode
  cycleSortType: ->
    types = [Index.selectSort.options...].filter (option) -> !option.disabled
    for type, i in types
      break if type.selected
    types[(i + 1) % types.length].selected = true
    $.event 'change', null, Index.selectSort
  addCatalogSwitch: ->
    a = $.el 'a',
      href: 'javascript:;'
      textContent: 'Switch to <%= meta.name %>\'s catalog'
      className: 'btn-wrap'
    $.on a, 'click', ->
      $.set 'Index Mode', 'catalog'
      window.location = './'
    $.add $.id('info'), a
  setupNavLinks: ->
    for el in $$ '.navLinks.desktop > a'
      if el.getAttribute('href') is '.././catalog'
        el.href = '.././'
      $.on el, 'click', ->
        switch @textContent
          when 'Return'
            $.set 'Index Mode', Conf['Previous Index Mode']
          when 'Catalog'
            $.set 'Index Mode', 'catalog'
    return

  cb:
    toggleCatalogMode: ->
      if Conf['Index Mode'] is 'catalog'
        $.addClass doc, 'catalog-mode'
      else
        $.rmClass doc, 'catalog-mode'
      Index.cb.size()
    toggleHiddenThreads: ->
      $('#hidden-toggle a', Index.navLinks).textContent = if Index.showHiddenThreads = !Index.showHiddenThreads
        'Hide'
      else
        'Show'
      Index.sort()
      Index.buildIndex()
    mode: (e) ->
      Index.cb.toggleCatalogMode()
      Index.togglePagelist()
      Index.buildIndex() if e
      mode = Conf['Index Mode']
      if mode not in ['catalog', Conf['Previous Index Mode']]
        Conf['Previous Index Mode'] = mode
        $.set 'Previous Index Mode', mode
      return unless QR.nodes
      if mode is 'catalog'
        QR.hide()
      else
        QR.unhide()
    sort: (e) ->
      Index.sort()
      Index.buildIndex() if e
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
    threadsNum: ->
      return unless Conf['Index Mode'] is 'paged'
      Index.buildPagelist()
      Index.buildIndex()
    target: ->
      for threadID, thread of g.BOARD.threads when thread.catalogView
        {thumb} = thread.catalogView.nodes
        if Conf['Open threads in a new tab']
          thumb.target = '_blank'
        else
          thumb.removeAttribute 'target'
      return
    replies: ->
      Index.buildThreads()
      Index.sort()
      Index.buildIndex()
    popstate: (e) ->
      pageNum = Index.getCurrentPage()
      Index.pageLoad pageNum if Index.currentPage isnt pageNum
    pageNav: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      switch e.target.nodeName
        when 'BUTTON'
          a = e.target.parentNode
        when 'A'
          a = e.target
        else
          return
      e.preventDefault()
      return if Index.cb.indexNav a, true
      Index.userPageNav +a.pathname.split('/')[2]
    headerNav: (e) ->
      a = e.target
      return if e.button isnt 0 or a.nodeName isnt 'A' or a.hostname isnt 'boards.4chan.org'
      # Save settings
      onSameBoard = a.pathname.split('/')[1] is g.BOARD.ID
      Index.cb.indexNav a, onSameBoard
      # Do nav if this isn't a simple click, or different board.
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or !onSameBoard
      e.preventDefault()
    indexNav: (a, onSameBoard) ->
      {indexMode, indexSort} = a.dataset
      if indexMode
        $.set 'Index Mode', indexMode
        Conf['Index Mode'] = indexMode
        if g.VIEW is 'index' and onSameBoard
          Index.selectMode.value = indexMode
          Index.cb.mode()
      if indexSort
        $.set 'Index Sort', indexSort
        Conf['Index Sort'] = indexSort
        if g.VIEW is 'index' and onSameBoard
          Index.selectSort.value = indexSort
          Index.cb.sort()
      if g.VIEW is 'index' and onSameBoard and (indexMode or indexSort)
        Index.buildIndex()
        Index.scrollToIndex()
        return true
      false

  scrollToIndex: ->
    Header.scrollToIfNeeded Index.navLinks

  getCurrentPage: ->
    +window.location.pathname.split('/')[2]
  userPageNav: (pageNum) ->
    if Conf['Refreshed Navigation'] and Conf['Index Mode'] is 'paged'
      Index.update pageNum
    else
      Index.pageNav pageNum
  pageNav: (pageNum) ->
    return if Index.currentPage is pageNum
    history.pushState null, '', if pageNum is 0 then './' else pageNum
    Index.pageLoad pageNum
  pageLoad: (pageNum) ->
    Index.currentPage = pageNum
    return if Conf['Index Mode'] isnt 'paged'
    Index.buildIndex()
    Index.setPage()
    Index.scrollToIndex()

  getThreadsNumPerPage: ->
    if Conf['Threads per Page'] > 0
      +Conf['Threads per Page']
    else
      Index.threadsNumPerPage
  getPagesNum: ->
    numThreads = if Index.isSearching
      Index.sortedNodes.length / 2
    else
      Index.liveThreadIDs.length
    Math.ceil numThreads / Index.getThreadsNumPerPage()
  getMaxPageNum: ->
    Math.max 0, Index.getPagesNum() - 1
  togglePagelist: ->
    Index.pagelist.hidden = Conf['Index Mode'] isnt 'paged'
  buildPagelist: ->
    pagesRoot = $ '.pages', Index.pagelist
    maxPageNum = Index.getMaxPageNum()
    if pagesRoot.childElementCount isnt maxPageNum + 1
      nodes = []
      for i in [0..maxPageNum] by 1
        a = $.el 'a',
          textContent: i
          href: if i then i else './'
        nodes.push $.tn('['), a, $.tn '] '
      $.rmAll pagesRoot
      $.add pagesRoot, nodes
    Index.togglePagelist()
  setPage: ->
    pageNum    = Index.getCurrentPage()
    maxPageNum = Index.getMaxPageNum()
    pagesRoot  = $ '.pages', Index.pagelist
    # Previous/Next buttons
    prev = pagesRoot.previousSibling.firstChild
    next = pagesRoot.nextSibling.firstChild
    href = Math.max pageNum - 1, 0
    prev.href = if href is 0 then './' else href
    prev.firstChild.disabled = href is pageNum
    href = Math.min pageNum + 1, maxPageNum
    next.href = if href is 0 then './' else href
    next.firstChild.disabled = href is pageNum
    # <strong> current page
    if strong = $ 'strong', pagesRoot
      return if +strong.textContent is pageNum
      $.replace strong, strong.firstChild
    else
      strong = $.el 'strong'
    a = pagesRoot.children[pageNum]
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

  update: (pageNum) ->
    return unless navigator.onLine
    Index.req?.abort()
    Index.notice?.close()
    if d.readyState isnt 'loading'
      Index.notice = new Notice 'info', 'Refreshing index...'
    else
      # Delay the notice on initial page load
      # and only display it for slow connections.
      now = Date.now()
      $.ready ->
        setTimeout (->
          return unless Index.req and !Index.notice
          Index.notice = new Notice 'info', 'Refreshing index...'
        ), 5 * $.SECOND - (Date.now() - now)
    pageNum = null if typeof pageNum isnt 'number' # event
    onload = (e) -> Index.load e, pageNum
    Index.req = $.ajax "//a.4cdn.org/#{g.BOARD}/catalog.json",
      onabort:   onload
      onloadend: onload
    ,
      whenModified: true
    $.addClass Index.button, 'fa-spin'
  load: (e, pageNum) ->
    $.rmClass Index.button, 'fa-spin'
    {req, notice} = Index
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
        Index.parse req.response, pageNum
      else if req.status is 304 and pageNum?
        Index.pageNav pageNum
    catch err
      c.error 'Index failure:', err.stack
      # network error or non-JSON content for example.
      if notice
        notice.setType 'error'
        notice.el.lastElementChild.textContent = 'Index refresh failed.'
        setTimeout notice.close, $.SECOND
      else
        new Notice 'error', 'Index refresh failed.', 1
      return

    if notice
      notice.setType 'success'
      notice.el.lastElementChild.textContent = 'Index refreshed!'
      setTimeout notice.close, $.SECOND

    timeEl = $ '#index-last-refresh', Index.navLinks
    timeEl.dataset.utc = Date.parse req.getResponseHeader 'Last-Modified'
    RelativeDates.update timeEl
    Index.scrollToIndex()
  parse: (pages, pageNum) ->
    Index.parseThreadList pages
    Index.buildThreads()
    Index.sort()
    Index.buildPagelist()
    if pageNum?
      Index.pageNav pageNum
      return
    Index.buildIndex()
    Index.setPage()
  parseThreadList: (pages) ->
    Index.threadsNumPerPage = pages[0].threads.length
    Index.liveThreadData    = pages.reduce ((arr, next) -> arr.concat next.threads), []
    Index.liveThreadIDs     = Index.liveThreadData.map (data) -> data.no
    for threadID, thread of g.BOARD.threads when thread.ID not in Index.liveThreadIDs
      thread.collect()
    return
  buildThreads: ->
    Index.nodes = []
    threads     = []
    posts       = []
    for threadData, i in Index.liveThreadData
      threadRoot = Build.thread g.BOARD, threadData
      Index.nodes.push threadRoot, $.el 'hr'
      if thread = g.BOARD.threads[threadData.no]
        thread.setPage i // Index.threadsNumPerPage
        thread.setCount 'post', threadData.replies + 1,                threadData.bumplimit
        thread.setCount 'file', threadData.images  + !!threadData.ext, threadData.imagelimit
        thread.setStatus 'Sticky', !!threadData.sticky
        thread.setStatus 'Closed', !!threadData.closed
      else
        thread = new Thread threadData.no, g.BOARD
        threads.push thread
      continue if thread.ID of thread.posts
      try
        posts.push new Post $('.opContainer', threadRoot), thread, g.BOARD
      catch err
        # Skip posts that we failed to parse.
        errors = [] unless errors
        errors.push
          message: "Parsing of Post No.#{thread} failed. Post will be skipped."
          error: err
    Main.handleErrors errors if errors

    # Add the threads and <hr>s in a container to make sure all features work.
    $.nodes Index.nodes
    Main.callbackNodes Thread, threads
    Main.callbackNodes Post,   posts
    Index.updateHideLabel()
    $.event 'IndexRefresh'
  buildReplies: (threadRoots) ->
    posts = []
    for threadRoot in threadRoots by 2
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
      .filter (n, i) -> !(i % 2)
      .map (threadRoot) -> Get.threadFromRoot threadRoot
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
      thumb = node.firstElementChild
      {width, height} = thumb.dataset
      continue unless width
      ratio = size / Math.max width, height
      thumb.style.width  = width  * ratio + 'px'
      thumb.style.height = height * ratio + 'px'
    return
  sort: ->
    switch Conf['Index Sort']
      when 'bump'
        sortedThreadIDs = Index.liveThreadIDs
      when 'lastreply'
        sortedThreadIDs = [Index.liveThreadData...].sort (a, b) ->
          [..., a] = a.last_replies if 'last_replies' of a
          [..., b] = b.last_replies if 'last_replies' of b
          b.no - a.no
        .map (data) -> data.no
      when 'birth'
        sortedThreadIDs = [Index.liveThreadIDs...].sort (a, b) -> b - a
      when 'replycount'
        sortedThreadIDs = [Index.liveThreadData...].sort((a, b) -> b.replies - a.replies).map (data) -> data.no
      when 'filecount'
        sortedThreadIDs = [Index.liveThreadData...].sort((a, b) -> b.images - a.images).map (data) -> data.no
    Index.sortedNodes = []
    for threadID in sortedThreadIDs
      i = Index.liveThreadIDs.indexOf(threadID) * 2
      Index.sortedNodes.push Index.nodes[i], Index.nodes[i + 1]
    if Index.isSearching
      Index.sortedNodes = Index.querySearch(Index.searchInput.value) or Index.sortedNodes
    # Sticky threads
    Index.sortOnTop (thread) -> thread.isSticky
    # Highlighted threads
    Index.sortOnTop (thread) -> thread.isOnTop or thread.isPinned
    # Non-hidden threads
    Index.sortOnTop((thread) -> !thread.isHidden) if Conf['Anchor Hidden Threads']
  sortOnTop: (match) ->
    offset = 0
    for threadRoot, i in Index.sortedNodes by 2 when match Get.threadFromRoot threadRoot
      Index.sortedNodes.splice offset++ * 2, 0, Index.sortedNodes.splice(i, 2)...
    return
  buildIndex: ->
    switch Conf['Index Mode']
      when 'paged'
        pageNum = Index.getCurrentPage()
        nodesPerPage = Index.getThreadsNumPerPage() * 2
        nodes = Index.sortedNodes[nodesPerPage * pageNum ... nodesPerPage * (pageNum + 1)]
      when 'catalog'
        nodes = Index.buildCatalogViews()
        Index.sizeCatalogViews nodes
      else
        nodes = Index.sortedNodes
    $.rmAll Index.root
    Index.buildReplies nodes if Conf['Show Replies'] and Conf['Index Mode'] isnt 'catalog'
    $.add Index.root, nodes
    $.event 'IndexBuild', nodes

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
        pageNum = 0
      else
        pageNum = Index.getCurrentPage()
    else
      return unless Index.searchInput.dataset.searching
      pageNum = Index.pageBeforeSearch
      delete Index.pageBeforeSearch
      <% if (type === 'userscript') { %>
      # XXX https://github.com/greasemonkey/greasemonkey/issues/1571
      Index.searchInput.removeAttribute 'data-searching'
      <% } else { %>
      delete Index.searchInput.dataset.searching
      <% } %>
    Index.sort()
    # Go to the last available page if we were past the limit.
    pageNum = Math.min pageNum, Index.getMaxPageNum() if Conf['Index Mode'] is 'paged'
    Index.buildPagelist()
    if Index.currentPage is pageNum
      Index.buildIndex()
      Index.setPage()
    else
      Index.pageNav pageNum
  querySearch: (query) ->
    return unless keywords = query.toLowerCase().match /\S+/g
    Index.search keywords
  search: (keywords) ->
    found = []
    for threadRoot, i in Index.sortedNodes by 2
      if Index.searchMatch Get.threadFromRoot(threadRoot), keywords
        found.push Index.sortedNodes[i], Index.sortedNodes[i + 1]
    found
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
