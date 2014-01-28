Index =
  init: ->
    return if g.BOARD.ID is 'f' or g.VIEW is 'catalog' or !Conf['JSON Navigation']

    @board = "#{g.BOARD}"

    @button = $.el 'a',
      className: 'index-refresh-shortcut fa'
      title: 'Refresh Index'
      href: 'javascript:;'
      textContent: "\uf021"
    $.on @button, 'click', @update
    Header.addShortcut @button, 1

    modeEntry =
      el: $.el 'span', textContent: 'Index mode'
      subEntries: [
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Mode" value="paged"> Paged' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Mode" value="infinite"> Infinite scrolling' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Mode" value="all pages"> All threads' }
      ]
    for label in modeEntry.subEntries
      input = label.el.firstChild
      input.checked = Conf['Index Mode'] is input.value
      $.on input, 'change', $.cb.value
      $.on input, 'change', @cb.mode

    sortEntry =
      el: $.el 'span', textContent: 'Sort by'
      subEntries: [
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="bump"> Bump order' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="lastreply"> Last reply' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="birth"> Creation date' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="replycount"> Reply count' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Sort" value="filecount"> File count' }
      ]
    for label in sortEntry.subEntries
      input = label.el.firstChild
      input.checked = Conf['Index Sort'] is input.value
      $.on input, 'change', $.cb.value
      $.on input, 'change', @cb.sort

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
    for label in [repliesEntry, anchorEntry, refNavEntry]
      input = label.el.firstChild
      {name} = input
      input.checked = Conf[name]
      $.on input, 'change', $.cb.checked
      switch name
        when 'Show Replies'
          $.on input, 'change', @cb.replies
        when 'Anchor Hidden Threads'
          $.on input, 'change', @cb.sort

    $.event 'AddMenuEntry',
      type: 'header'
      el: $.el 'span',
        textContent: 'Index Navigation'
      order: 98
      subEntries: [repliesEntry, anchorEntry, refNavEntry, modeEntry, sortEntry]

    $.addClass doc, 'index-loading'
    @root = $.el 'div', className: 'board'
    @pagelist = $.el 'div',
      className: 'pagelist'
      hidden: true
      innerHTML: <%= importHTML('Features/Index-pagelist') %>
    @navLinks = $.el 'div',
      className: 'navLinks'
      innerHTML: <%= importHTML('Features/Index-navlinks') %>
    @searchInput = $ '#index-search', @navLinks
    @currentPage = @getCurrentPage()

    $.on d, 'scroll', Index.scroll
    $.on @pagelist, 'click', @cb.pageNav
    $.on @searchInput, 'input', @onSearchInput
    $.on $('#index-search-clear', @navLinks), 'click', @clearSearch
    $.on $('#returnlink a',  @navLinks), 'click', Navigate.navigate

    @update() if g.VIEW is 'index'
    $.asap (-> $('.board', doc) or d.readyState isnt 'loading'), ->
      if g.VIEW is 'index'
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

      $.rm navLink for navLink in $$ '.navLinks'
      $.after $.x('child::form/preceding-sibling::hr[1]'), Index.navLinks
      $.rmClass doc, 'index-loading'

    $.asap (-> $('.pagelist', doc) or d.readyState isnt 'loading'), ->
      if pagelist = $('.pagelist')
        $.replace pagelist, Index.pagelist
      else
        $.after $.id('delform'), Index.pagelist

  scroll: $.debounce 100, ->
    return if Index.req or Conf['Index Mode'] isnt 'infinite' or (doc.scrollTop <= doc.scrollHeight - (300 + window.innerHeight)) or g.VIEW is 'thread'
    Index.pageNum = Index.getCurrentPage() unless Index.pageNum? # Avoid having to pushState to keep track of the current page

    pageNum = Index.pageNum++
    return Index.endNotice() if pageNum >= Index.pagesNum

    nodes = Index.buildSinglePage pageNum
    Index.buildReplies   nodes if Conf['Show Replies']
    Index.buildStructure nodes
    Index.setPage pageNum
    
  endNotice: do ->
    notify = false
    reset = -> notify = false
    return ->
      return if notify
      notify = true
      new Notice 'info', "Last page reached.", 2
      setTimeout reset, 3 * $.SECOND

  cb:
    mode: ->
      Index.togglePagelist()
      Index.buildIndex()
    sort: ->
      Index.sort()
      Index.buildIndex()
    replies: ->
      Index.buildThreads()
      Index.sort()
      Index.buildIndex()
    pageNav: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      return unless e.target.nodeName is 'A'
      a = e.target
      return if a.textContent is 'Catalog'
      e.preventDefault()
      Index.userPageNav +a.pathname.split('/')[2]

  scrollToIndex: ->
    Header.scrollToIfNeeded Index.root

  getCurrentPage: ->
    +window.location.pathname.split('/')[2]
  userPageNav: (pageNum) ->
    if Conf['Refreshed Navigation'] and Conf['Index Mode'] isnt 'all pages'
      Index.update pageNum
    else
      Index.pageNav pageNum
  pageNav: (pageNum) ->
    return if Index.currentPage is pageNum
    history.pushState null, '', if pageNum is 0 then './' else pageNum
    Index.pageLoad pageNum
  pageLoad: (pageNum) ->
    Index.currentPage = pageNum
    return if Conf['Index Mode'] is 'all pages'
    Index.buildIndex()
    Index.setPage()
    Index.scrollToIndex()

  getPagesNum: ->
    if Index.isSearching
      Math.ceil (Index.sortedNodes.length / 2) / Index.threadsNumPerPage
    else
      Index.pagesNum
  getMaxPageNum: ->
    Math.max 0, Index.getPagesNum() - 1
  togglePagelist: ->
    Index.pagelist.hidden = Conf['Index Mode'] is 'all pages'
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
  setPage: (pageNum) ->
    pageNum  or= Index.getCurrentPage()
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

  update: (pageNum) ->
    return unless navigator.onLine
    if g.VIEW is 'thread'
      return ThreadUpdater.update() if Conf['Thread Updater']
      return
    unless d.readyState is 'loading' or Index.root.parentElement
      $.replace $('.board'), Index.root
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

    pageNum = null if typeof pageNum isnt 'number' # event
    onload = (e) -> Index.load e, pageNum
    Index.req = $.ajax "//a.4cdn.org/#{g.BOARD}/catalog.json",
      onabort:   onload
      onloadend: onload
    ,
      whenModified: Index.board is "#{g.BOARD}"
    $.addClass Index.button, 'fa-spin'

  load: (e, pageNum) ->
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

    Navigate.title()
    Index.board = "#{g.BOARD}"

    try
      if req.status is 200
        Index.parse req.response, pageNum
      else if req.status is 304 and pageNum?
        Index.pageNav pageNum
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
        if thread = g.BOARD.threads[threadData.no]
          thread.setPage Math.floor i / Index.threadsNumPerPage
          thread.setStatus 'Sticky', !!threadData.sticky
          thread.setStatus 'Closed', !!threadData.closed
        else
          thread = new Thread threadData.no, g.BOARD
          threads.push thread
        Index.nodes.push threadRoot
        continue if thread.ID of thread.posts
        posts.push new Post $('.opContainer', threadRoot), thread, g.BOARD
      catch err
        # Skip posts that we failed to parse.
        errors = [] unless errors
        errors.push
          message: "Parsing of Thread No.#{thread} failed. Thread will be skipped."
          error: err
    Main.handleErrors errors if errors

    # Add the threads and <hr>s in a container to make sure all features work.
    $.nodes Index.nodes
    Main.callbackNodes Thread, threads
    Main.callbackNodes Post,   posts
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
    Index.sortedNodes = sortedNodes = new RandomAccessList
    {nodes} = Index
    for threadID in sortedThreadIDs
      sortedNodes.push nodes[Index.liveThreadIDs.indexOf(threadID)]
    if Index.isSearching and nodes = Index.querySearch(Index.searchInput.value)
      Index.sortedNodes = new RandomAccessList nodes
    items = [
      # Sticky threads
      fn:  (thread) -> thread.isSticky
      cnd: true
    , # Highlighted threads
      fn:  (thread) -> thread.isOnTop
      cnd: Conf['Filter']
    , # Non-hidden threads
      fn:  (thread) -> !thread.isHidden
      cnd: Conf['Anchor Hidden Threads']
    ]
    i = 0
    while item = items[i++]
      {fn, cnd} = item
      Index.sortOnTop fn if cnd
    return

  sortOnTop: (match) ->
    offset = 0
    {sortedNodes} = Index
    threadRoot = sortedNodes.first
    while threadRoot
      if match Get.threadFromRoot threadRoot.data
        target = sortedNodes.first
        j = 0
        while j++ < offset
          target = target.next
        unless threadRoot is target
          offset++
          sortedNodes.before target, threadRoot
      threadRoot = threadRoot.next
    return

  buildIndex: ->
    if Conf['Index Mode'] isnt 'all pages'
      nodes = Index.buildSinglePage Index.getCurrentPage()
    else
      nodes = [(target = Index.sortedNodes.first).data]
      while target = target.next
        nodes.push target.data
    $.rmAll Index.root
    $.rmAll Header.hover
    Index.buildReplies nodes if Conf['Show Replies']
    Index.buildStructure nodes

  buildSinglePage: (pageNum) ->
    nodes = []
    nodesPerPage = Index.threadsNumPerPage
    offset = nodesPerPage * pageNum
    end    = offset + nodesPerPage
    target = Index.sortedNodes.order()[offset]
    Index.sortedNodes
    while (offset++ <= end) and target
      nodes.push target.data
      target = target.next
    nodes

  buildStructure: (nodes) ->
    result = $.frag()
    i = 0
    $.add result, [node, $.el 'hr'] while node = nodes[i++]
    $.add Index.root, result
    $.rm hr for hr in $$ 'hr + hr', Index.root # Temp fix until I figure out where I fucked up
    $.event 'IndexBuild', result

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
    pageNum = Math.min pageNum, Index.getMaxPageNum() if Conf['Index Mode'] isnt 'all pages'
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
    found  = []
    target = Index.sortedNodes.first
    while target
      {data} = target
      if Index.searchMatch Get.threadFromRoot(data), keywords
        found.push data
      target = target.next
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
