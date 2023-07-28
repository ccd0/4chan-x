ThreadWatcher =
  init: ->
    return if not (@enabled = Conf['Thread Watcher'])

    @shortcut = sc = $.el 'a',
      id:   'watcher-link'
      textContent: 'Watcher'
      title: 'Thread Watcher'
      href: 'javascript:;'
      className: 'fa fa-eye'

    @db     = new DataBoard 'watchedThreads', @refresh, true
    @dbLM   = new DataBoard 'watcherLastModified', null, true
    @dialog = UI.dialog 'thread-watcher', `<%= readHTML('ThreadWatcher.html') %>`
    @status = $ '#watcher-status', @dialog
    @list   = @dialog.lastElementChild
    @refreshButton = $ '.refresh', @dialog
    @closeButton = $('.move > .close', @dialog)
    @unreaddb = Unread.db or UnreadIndex.db or new DataBoard 'lastReadPosts'
    @unreadEnabled = Conf['Remember Last Read Post']

    $.on d, 'QRPostSuccessful',   @cb.post
    $.on sc, 'click', @toggleWatcher
    $.on @refreshButton, 'click', @buttonFetchAll
    $.on @closeButton, 'click', @toggleWatcher

    @menu.addHeaderMenuEntry()
    $.onExists doc, 'body', @addDialog

    switch g.VIEW
      when 'index'
        $.on d, 'IndexUpdate', @cb.onIndexUpdate
      when 'thread'
        $.on d, 'ThreadUpdate', @cb.onThreadRefresh

    if Conf['Fixed Thread Watcher']
      $.addClass doc, 'fixed-watcher'
    if !Conf['Persistent Thread Watcher']
      $.addClass ThreadWatcher.shortcut, 'disabled'
      @dialog.hidden = true

    Header.addShortcut 'watcher', sc, 510

    ThreadWatcher.initLastModified()
    ThreadWatcher.fetchAuto()
    $.on window, 'visibilitychange focus', -> $.queueTask ThreadWatcher.fetchAuto

    if Conf['Menu'] and Index.enabled
      Menu.menu.addEntry
        el: $.el 'a',
          href:      'javascript:;'
          className: 'has-shortcut-text'
        , `<%= html('<span></span><span class="shortcut-text">Alt+click</span>') %>`
        order: 6
        open: ({thread}) ->
          return false if Conf['Index Mode'] isnt 'catalog'
          @el.firstElementChild.textContent = if ThreadWatcher.isWatched thread
            'Unwatch'
          else
            'Watch'
          $.off @el, 'click', @cb if @cb
          @cb = ->
            $.event 'CloseMenu'
            ThreadWatcher.toggle thread
          $.on @el, 'click', @cb
          true

    return unless g.VIEW in ['index', 'thread']

    Callbacks.Post.push
      name: 'Thread Watcher'
      cb:   @node
    Callbacks.CatalogThread.push
      name: 'Thread Watcher'
      cb:   @catalogNode

  isWatched: (thread) ->
    !!ThreadWatcher.db?.get {boardID: thread.board.ID, threadID: thread.ID}

  isWatchedRaw: (boardID, threadID) ->
    !!ThreadWatcher.db?.get {boardID, threadID}

  setToggler: (toggler, isWatched) ->
    toggler.classList.toggle 'watched', isWatched
    toggler.title = "#{if isWatched then 'Unwatch' else 'Watch'} Thread"

  node: ->
    return if @isReply
    if @isClone
      toggler = $ '.watch-thread-link', @nodes.info
    else
      toggler = $.el 'a',
        href: 'javascript:;'
        className: 'watch-thread-link'
      $.before $('input', @nodes.info), toggler
    siteID = g.SITE.ID
    boardID = @board.ID
    threadID = @thread.ID
    data = ThreadWatcher.db.get {siteID, boardID, threadID}
    ThreadWatcher.setToggler toggler, !!data
    $.on toggler, 'click', ThreadWatcher.cb.toggle
    # Add missing excerpt for threads added by Auto Watch
    if data and not data.excerpt?
      $.queueTask =>
        ThreadWatcher.update siteID, boardID, threadID, {excerpt: Get.threadExcerpt @thread}

  catalogNode: ->
    $.addClass @nodes.root, 'watched' if ThreadWatcher.isWatched @thread
    $.on @nodes.root, 'mousedown click', (e) =>
      return unless e.button is 0 and e.altKey
      ThreadWatcher.toggle @thread if e.type is 'click'
      e.preventDefault() # Also on mousedown to prevent highlighting thumbnail in Firefox.

  addDialog: ->
    return unless Main.isThisPageLegit()
    ThreadWatcher.build()
    $.prepend d.body, ThreadWatcher.dialog

  toggleWatcher: ->
    $.toggleClass ThreadWatcher.shortcut, 'disabled'
    ThreadWatcher.dialog.hidden = !ThreadWatcher.dialog.hidden

  cb:
    openAll: ->
      return if $.hasClass @, 'disabled'
      for a in $$ 'a.watcher-link', ThreadWatcher.list
        $.open a.href
      $.event 'CloseMenu'
    openUnread: ->
      return if $.hasClass @, 'disabled'
      for a in $$ '.replies-unread > a.watcher-link', ThreadWatcher.list
        $.open a.href
      $.event 'CloseMenu'
    openDeads: ->
      return if $.hasClass @, 'disabled'
      for a in $$ '.dead-thread > a.watcher-link', ThreadWatcher.list
        $.open a.href
      $.event 'CloseMenu'
    clear: ->
      return unless confirm "Delete ALL threads from watcher?"
      for {siteID, boardID, threadID} in ThreadWatcher.getAll()
        ThreadWatcher.db.delete {siteID, boardID, threadID}
      ThreadWatcher.refresh()
      $.event 'CloseMenu'
    pruneDeads: ->
      return if $.hasClass @, 'disabled'
      for {siteID, boardID, threadID, data} in ThreadWatcher.getAll() when data.isDead
        ThreadWatcher.db.delete {siteID, boardID, threadID}
      ThreadWatcher.refresh()
      $.event 'CloseMenu'
    dismiss: ->
      for {siteID, boardID, threadID, data} in ThreadWatcher.getAll() when data.quotingYou
        ThreadWatcher.update siteID, boardID, threadID, {dismiss: data.quotingYou or 0}
      $.event 'CloseMenu'
    toggle: ->
      {thread} = Get.postFromNode @
      ThreadWatcher.toggle thread
    rm: ->
      {siteID} = @parentNode.dataset
      [boardID, threadID] = @parentNode.dataset.fullID.split '.'
      ThreadWatcher.rm siteID, boardID, +threadID
    post: (e) ->
      {boardID, threadID, postID} = e.detail
      cb = PostRedirect.delay()
      if postID is threadID
        if Conf['Auto Watch']
          ThreadWatcher.addRaw boardID, threadID, {}, cb
      else if Conf['Auto Watch Reply']
        ThreadWatcher.add (g.threads.get(boardID + '.' + threadID) or new Thread(threadID, g.boards[boardID] or new Board(boardID))), cb
    onIndexUpdate: (e) ->
      {db}    = ThreadWatcher
      siteID  = g.SITE.ID
      boardID = g.BOARD.ID
      nKilled = 0
      for threadID, data of db.data[siteID].boards[boardID] when not data?.isDead and "#{boardID}.#{threadID}" not in e.detail.threads
        # Don't prune threads that have yet to appear in index.
        continue unless e.detail.threads.some (fullID) -> +fullID.split('.')[1] > threadID
        if Conf['Auto Prune'] or not (data and typeof data is 'object') # corrupt data
          db.delete {boardID, threadID}
          nKilled++
        else
          ThreadWatcher.fetchStatus {siteID, boardID, threadID, data}
      ThreadWatcher.refresh() if nKilled
    onThreadRefresh: (e) ->
      thread = g.threads.get(e.detail.threadID)
      return unless e.detail[404] and ThreadWatcher.isWatched thread
      # Update dead status.
      ThreadWatcher.add thread

  requests: []
  fetched:  0

  fetch: (url, {siteID, force}, args, cb) ->
    if ThreadWatcher.requests.length is 0
      ThreadWatcher.status.textContent = '...'
      $.addClass ThreadWatcher.refreshButton, 'fa-spin'
    onloadend = ->
      return if @finished
      @finished = true
      ThreadWatcher.fetched++
      if ThreadWatcher.fetched is ThreadWatcher.requests.length
        ThreadWatcher.clearRequests()
      else
        ThreadWatcher.status.textContent = "#{Math.round(ThreadWatcher.fetched / ThreadWatcher.requests.length * 100)}%"
      cb.apply @, args
    ajax = if siteID is g.SITE.ID then $.ajax else CrossOrigin.ajax
    if force
      delete $.lastModified.ThreadWatcher?[url]
    req = $.whenModified(
      url,
      'ThreadWatcher',
      onloadend,
      {timeout: $.MINUTE, ajax}
    )
    ThreadWatcher.requests.push req

  clearRequests: ->
    ThreadWatcher.requests = []
    ThreadWatcher.fetched = 0
    ThreadWatcher.status.textContent = ''
    $.rmClass ThreadWatcher.refreshButton, 'fa-spin'

  abort: ->
    delete ThreadWatcher.syncing
    for req in ThreadWatcher.requests when !req.finished
      req.finished = true
      req.abort()
    ThreadWatcher.clearRequests()

  initLastModified: ->
    lm = ($.lastModified['ThreadWatcher'] or= $.dict())
    for siteID, boards of ThreadWatcher.dbLM.data
      for boardID, data of boards.boards
        if ThreadWatcher.db.get {siteID, boardID}
          for url, date of data
            lm[url] = date
        else
          ThreadWatcher.dbLM.delete {siteID, boardID}
    return

  fetchAuto: ->
    clearTimeout ThreadWatcher.timeout
    return unless Conf['Auto Update Thread Watcher']
    {db} = ThreadWatcher
    interval = if Conf['Show Page'] or (ThreadWatcher.unreadEnabled and Conf['Show Unread Count']) then 5 * $.MINUTE else 2 * $.HOUR
    now = Date.now()
    unless now - interval < (db.data.lastChecked or 0) <= now or d.hidden or not d.hasFocus()
      ThreadWatcher.fetchAllStatus interval
    ThreadWatcher.timeout = setTimeout ThreadWatcher.fetchAuto, interval

  buttonFetchAll: ->
    if ThreadWatcher.syncing or ThreadWatcher.requests.length
      ThreadWatcher.abort()
    else
      ThreadWatcher.fetchAllStatus()

  fetchAllStatus: (interval=0) ->
    ThreadWatcher.status.textContent = '...'
    $.addClass ThreadWatcher.refreshButton, 'fa-spin'
    ThreadWatcher.syncing = true
    dbs = [ThreadWatcher.db, ThreadWatcher.unreaddb, QuoteYou.db].filter((x) -> x)
    n = 0
    for dbi in dbs
      dbi.forceSync ->
        if (++n) is dbs.length
          return if !ThreadWatcher.syncing # aborted
          delete ThreadWatcher.syncing
          unless 0 <= Date.now() - (ThreadWatcher.db.data.lastChecked or 0) < interval # not checked in another tab
            # XXX On vichan boards, last_modified field of threads.json does not account for sage posts.
            # Occasionally check replies field of catalog.json to find these posts.
            {db} = ThreadWatcher
            now = Date.now()
            deep = !(now - 2 * $.HOUR < (db.data.lastChecked2 or 0) <= now)
            boards = ThreadWatcher.getAll(true)
            for board in boards
              ThreadWatcher.fetchBoard board, deep
            db.setLastChecked()
            db.setLastChecked('lastChecked2') if deep
          if ThreadWatcher.fetched is ThreadWatcher.requests.length
            ThreadWatcher.clearRequests()

  fetchBoard: (board, deep) ->
    return unless board.some (thread) -> !thread.data.isDead
    force = false
    for thread in board
      {data} = thread
      if !data.isDead and data.last isnt -1
        force = true if Conf['Show Page'] and !data.page?
        force = thread.force = true if !data.modified?
    {siteID, boardID} = board[0]
    site = g.sites[siteID]
    return unless site
    urlF = if deep and site.threadModTimeIgnoresSage then 'catalogJSON' else 'threadsListJSON'
    url = site.urls[urlF]?({siteID, boardID})
    return unless url
    ThreadWatcher.fetch url, {siteID, force}, [board, url], ThreadWatcher.parseBoard

  parseBoard: (board, url) ->
    return unless @status is 200
    {siteID, boardID} = board[0]
    lmDate = @getResponseHeader('Last-Modified')
    ThreadWatcher.dbLM.extend {siteID, boardID, val: $.item(url, lmDate)}
    threads = $.dict()
    pageLength = 0
    nThreads = 0
    oldest = null
    try
      pageLength = @response[0]?.threads.length or 0
      for page, i in @response
        for item in page.threads
          threads[item.no] =
            page: i + 1
            index: nThreads
            modified: item.last_modified
            replies: item.replies
          nThreads++
          if !oldest? or item.no < oldest
            oldest = item.no
    catch
      for thread in board
        ThreadWatcher.fetchStatus thread
    for thread in board
      {threadID, data} = thread
      if threads[threadID]
        {page, index, modified, replies} = threads[threadID]
        if Conf['Show Page']
          lastPage = if g.sites[siteID].isPrunedByAge?({siteID, boardID})
            threadID is oldest
          else
            index >= nThreads - pageLength
          ThreadWatcher.update siteID, boardID, threadID, {page, lastPage}
        if ThreadWatcher.unreadEnabled and Conf['Show Unread Count']
          if modified isnt data.modified or (replies? and replies isnt data.replies)
            (thread.newData or= {}).modified = modified
            ThreadWatcher.fetchStatus thread
      else
        ThreadWatcher.fetchStatus thread
    return

  fetchStatus: (thread) ->
    {siteID, boardID, threadID, data, force} = thread
    url = g.sites[siteID]?.urls.threadJSON?({siteID, boardID, threadID})
    return unless url
    return if data.isDead and not force
    return if data.last is -1 # 404 or no JSON API
    ThreadWatcher.fetch url, {siteID, force}, [thread], ThreadWatcher.parseStatus

  parseStatus: (thread, isArchiveURL) ->
    {siteID, boardID, threadID, data, newData, force} = thread
    site = g.sites[siteID]
    if @status is 200 and @response
      last = @response.posts[@response.posts.length-1].no
      replies = @response.posts.length-1
      isDead = isArchived = !!(@response.posts[0].archived or isArchiveURL)
      if isDead and Conf['Auto Prune']
        ThreadWatcher.rm siteID, boardID, threadID
        return

      return if last is data.last and isDead is data.isDead and isArchived is data.isArchived

      lastReadPost = ThreadWatcher.unreaddb.get {siteID, boardID, threadID, defaultValue: 0}
      unread = data.unread or 0
      quotingYou = data.quotingYou or 0
      youOP = !!QuoteYou.db?.get {siteID, boardID, threadID, postID: threadID}

      for postObj in @response.posts
        continue unless postObj.no > (data.last or 0) and postObj.no > lastReadPost
        continue if QuoteYou.db?.get {siteID, boardID, threadID, postID: postObj.no}

        quotesYou = false
        if !Conf['Require OP Quote Link'] and youOP
          quotesYou = true
        else if QuoteYou.db and postObj.com
          regexp = site.regexp.quotelinkHTML
          regexp.lastIndex = 0
          while (match = regexp.exec postObj.com)
            if QuoteYou.db.get {
              siteID
              boardID:  if match[1] then encodeURIComponent(match[1]) else boardID
              threadID: match[2] or threadID
              postID:   match[3] or match[2] or threadID
            }
              quotesYou = true
              break

        if !unread or (!quotingYou and quotesYou)
          continue if Filter.isHidden(site.Build.parseJSON postObj, {siteID, boardID})

        unread++
        quotingYou = postObj.no if quotesYou

      newData or= {}
      $.extend newData, {last, replies, isDead, isArchived, unread, quotingYou}
      ThreadWatcher.update siteID, boardID, threadID, newData

    else if @status is 404
      archiveURL = g.sites[siteID]?.urls.archivedThreadJSON?({siteID, boardID, threadID})
      if !isArchiveURL and archiveURL
        ThreadWatcher.fetch archiveURL, {siteID, force}, [thread, true], ThreadWatcher.parseStatus
      else if site.mayLackJSON and !data.last?
        ThreadWatcher.update siteID, boardID, threadID, {last: -1}
      else
        ThreadWatcher.update siteID, boardID, threadID, {isDead: true}

  getAll: (groupByBoard) ->
    all = []
    for siteID, boards of ThreadWatcher.db.data
      for boardID, threads of boards.boards
        if Conf['Current Board'] and (siteID isnt g.SITE.ID or boardID isnt g.BOARD.ID)
          continue
        if groupByBoard
          all.push (cont = [])
        for threadID, data of threads when data and typeof data is 'object'
          (if groupByBoard then cont else all).push {siteID, boardID, threadID, data}
    all

  makeLine: (siteID, boardID, threadID, data) ->
    x = $.el 'a',
      className: 'fa fa-times'
      href: 'javascript:;'
    $.on x, 'click', ThreadWatcher.cb.rm

    {excerpt, isArchived} = data
    excerpt or= "/#{boardID}/ - No.#{threadID}"
    excerpt = ThreadWatcher.prefixes[siteID] + excerpt if Conf['Show Site Prefix']

    link = $.el 'a',
      href: g.sites[siteID]?.urls.thread({siteID, boardID, threadID}, isArchived) or ''
      title: excerpt
      className: 'watcher-link'

    if Conf['Show Page'] and data.page?
      page = $.el 'span',
        textContent: "[#{data.page}]"
        className: 'watcher-page'
      $.add link, page

    if ThreadWatcher.unreadEnabled and Conf['Show Unread Count'] and data.unread?
      count = $.el 'span',
        textContent: "(#{data.unread})"
        className: 'watcher-unread'
      $.add link, count

    title = $.el 'span',
      textContent: excerpt
      className: 'watcher-title'
    $.add link, title

    div = $.el 'div'
    fullID = "#{boardID}.#{threadID}"
    div.dataset.fullID = fullID
    div.dataset.siteID = siteID
    $.addClass div, 'current'     if g.VIEW is 'thread' and fullID is "#{g.BOARD}.#{g.THREADID}"
    $.addClass div, 'dead-thread' if data.isDead
    if Conf['Show Page']
      $.addClass div, 'last-page'  if data.lastPage
      div.dataset.page = data.page if data.page?
    if ThreadWatcher.unreadEnabled and Conf['Show Unread Count']
      $.addClass div, 'replies-read'        if data.unread is 0
      $.addClass div, 'replies-unread'      if data.unread
      $.addClass div, 'replies-quoting-you' if (data.quotingYou or 0) > (data.dismiss or 0)
    $.add div, [x, $.tn(' '), link]
    div

  setPrefixes: (threads) ->
    prefixes = $.dict()
    for {siteID} in threads
      continue if siteID of prefixes
      len = 0
      prefix = ''
      conflicts = Object.keys(prefixes)
      while conflicts.length > 0
        len++
        prefix = siteID[...len]
        conflicts2 = []
        for siteID2 in conflicts
          if siteID2[...len] is prefix
            conflicts2.push siteID2
          else if prefixes[siteID2].length < len
            prefixes[siteID2] = siteID2[...len]
        conflicts = conflicts2
      prefixes[siteID] = prefix
    ThreadWatcher.prefixes = prefixes

  build: ->
    nodes = []
    threads = ThreadWatcher.getAll()
    ThreadWatcher.setPrefixes threads
    for {siteID, boardID, threadID, data} in threads
      # Add missing excerpt for threads added by Auto Watch
      if not data.excerpt? and siteID is g.SITE.ID and (thread = g.threads.get("#{boardID}.#{threadID}")) and thread.OP
        ThreadWatcher.db.extend {boardID, threadID, val: {excerpt: Get.threadExcerpt thread}}
      nodes.push ThreadWatcher.makeLine siteID, boardID, threadID, data
    {list} = ThreadWatcher
    $.rmAll list
    $.add list, nodes

    ThreadWatcher.refreshIcon()

  refresh: ->
    ThreadWatcher.build()

    g.threads.forEach (thread) ->
      isWatched = ThreadWatcher.isWatched thread
      if thread.OP
        for post in [thread.OP, thread.OP.clones...]
          if (toggler = $ '.watch-thread-link', post.nodes.info)
            ThreadWatcher.setToggler toggler, isWatched
      (thread.catalogView.nodes.root.classList.toggle 'watched', isWatched if thread.catalogView)

    if Conf['Pin Watched Threads']
      $.event 'SortIndex', {deferred: Conf['Index Mode'] isnt 'catalog'}

  refreshIcon: ->
    for className in ['replies-unread', 'replies-quoting-you']
      ThreadWatcher.shortcut.classList.toggle className, !!$(".#{className}", ThreadWatcher.dialog)
    return

  update: (siteID, boardID, threadID, newData) ->
    return if not (data = ThreadWatcher.db?.get {siteID, boardID, threadID})
    if newData.isDead and Conf['Auto Prune']
      ThreadWatcher.rm siteID, boardID, threadID
      return
    if newData.isDead or newData.last is -1
      for key in ['isArchived', 'page', 'lastPage', 'unread', 'quotingyou'] when key not of newData
        newData[key] = undefined
    if newData.last? and newData.last < data.last
      newData.modified = undefined
    n = 0
    n++ for key, val of newData when data[key] isnt val
    return unless n
    ThreadWatcher.db.extend {siteID, boardID, threadID, val: newData}
    if (line = $ "#watched-threads > [data-site-i-d='#{siteID}'][data-full-i-d='#{boardID}.#{threadID}']", ThreadWatcher.dialog)
      newLine = ThreadWatcher.makeLine siteID, boardID, threadID, data
      $.replace line, newLine
      ThreadWatcher.refreshIcon()
    else
      ThreadWatcher.refresh()

  set404: (boardID, threadID, cb) ->
    return cb() if not (data = ThreadWatcher.db?.get {boardID, threadID})
    if Conf['Auto Prune']
      ThreadWatcher.db.delete {boardID, threadID}
      return cb()
    return cb() if data.isDead and not (data.isArchived? or data.page? or data.lastPage? or data.unread? or data.quotingYou?)
    ThreadWatcher.db.extend {boardID, threadID, val: {isDead: true, isArchived: undefined, page: undefined, lastPage: undefined, unread: undefined, quotingYou: undefined}}, cb

  toggle: (thread) ->
    siteID   = g.SITE.ID
    boardID  = thread.board.ID
    threadID = thread.ID
    if ThreadWatcher.db.get {boardID, threadID}
      ThreadWatcher.rm siteID, boardID, threadID
    else
      ThreadWatcher.add thread

  add: (thread, cb) ->
    data     = {}
    siteID   = g.SITE.ID
    boardID  = thread.board.ID
    threadID = thread.ID
    if thread.isDead
      if Conf['Auto Prune'] and ThreadWatcher.db.get {boardID, threadID}
        ThreadWatcher.rm siteID, boardID, threadID, cb
        return
      data.isDead = true
    data.excerpt = Get.threadExcerpt thread if thread.OP
    ThreadWatcher.addRaw boardID, threadID, data, cb

  addRaw: (boardID, threadID, data, cb) ->
    oldData = ThreadWatcher.db.get {boardID, threadID, defaultValue: $.dict()}
    delete oldData.last
    delete oldData.modified
    $.extend oldData, data
    ThreadWatcher.db.set {boardID, threadID, val: oldData}, cb
    ThreadWatcher.refresh()
    thread = {siteID: g.SITE.ID, boardID, threadID, data, force: true}
    if Conf['Show Page'] and !data.isDead
      ThreadWatcher.fetchBoard [thread]
    else if ThreadWatcher.unreadEnabled and Conf['Show Unread Count']
      ThreadWatcher.fetchStatus thread

  rm: (siteID, boardID, threadID, cb) ->
    ThreadWatcher.db.delete {siteID, boardID, threadID}, cb
    ThreadWatcher.refresh()

  menu:
    init: ->
      return if !Conf['Thread Watcher']
      menu = @menu = new UI.Menu 'thread watcher'
      $.on $('.menu-button', ThreadWatcher.dialog), 'click', (e) ->
        menu.toggle e, @, ThreadWatcher
      @addMenuEntries()

    addHeaderMenuEntry: ->
      return if g.VIEW isnt 'thread'
      entryEl = $.el 'a',
        href: 'javascript:;'
      Header.menu.addEntry
        el: entryEl
        order: 60
        open: ->
          [addClass, rmClass, text] = if !!ThreadWatcher.db.get {boardID: g.BOARD.ID, threadID: g.THREADID}
            ['unwatch-thread', 'watch-thread', 'Unwatch thread']
          else
            ['watch-thread', 'unwatch-thread', 'Watch thread']
          $.addClass entryEl, addClass
          $.rmClass  entryEl, rmClass
          entryEl.textContent = text
          true
      $.on entryEl, 'click', -> ThreadWatcher.toggle g.threads.get("#{g.BOARD}.#{g.THREADID}")

    addMenuEntries: ->
      entries = []

      # `Open all` entry
      entries.push
        text: 'Open all threads'
        cb: ThreadWatcher.cb.openAll
        open: ->
          @el.classList.toggle 'disabled', !ThreadWatcher.list.firstElementChild
          true

      # `Open Unread` entry
      entries.push
        text: 'Open unread threads'
        cb: ThreadWatcher.cb.openUnread
        open: ->
          @el.classList.toggle 'disabled', !$('.replies-unread', ThreadWatcher.list)
          true

      # `Open dead threads` entry
      entries.push
        text: 'Open dead threads'
        cb: ThreadWatcher.cb.openDeads
        open: ->
          @el.classList.toggle 'disabled', !$('.dead-thread', ThreadWatcher.list)
          true

      entries.push
        text: 'Clear all threads'
        cb: ThreadWatcher.cb.clear
        open: ->
          @el.classList.toggle 'disabled', !ThreadWatcher.list.firstElementChild
          true

      # `Prune dead threads` entry
      entries.push
        text: 'Prune dead threads'
        cb: ThreadWatcher.cb.pruneDeads
        open: ->
          @el.classList.toggle 'disabled', !$('.dead-thread', ThreadWatcher.list)
          true

      # `Dismiss posts quoting you` entry
      entries.push
        text: 'Dismiss posts quoting you'
        title: 'Unhighlight the thread watcher icon and threads until there are new replies quoting you.'
        cb: ThreadWatcher.cb.dismiss
        open: ->
          @el.classList.toggle 'disabled', !$.hasClass(ThreadWatcher.shortcut, 'replies-quoting-you')
          true

      for {text, title, cb, open} in entries
        entry =
          el: $.el 'a',
            textContent: text
            href: 'javascript:;'
        entry.el.title = title if title
        $.on entry.el, 'click', cb
        entry.open = open.bind(entry)
        @menu.addEntry entry

      # Settings checkbox entries:
      for name, conf of Config.threadWatcher
        @addCheckbox name, conf[1]

      return

    addCheckbox: (name, desc) ->
      entry =
        type: 'thread watcher'
        el: UI.checkbox name, name.replace(' Thread Watcher', '')
      entry.el.title = desc
      input = entry.el.firstElementChild
      if name is 'Show Unread Count' and not ThreadWatcher.unreadEnabled
        input.disabled = true
        $.addClass entry.el, 'disabled'
        entry.el.title += '\n[Remember Last Read Post is disabled.]'
      $.on input, 'change', $.cb.checked
      $.on input, 'change', ThreadWatcher.refresh   if name in ['Current Board', 'Show Page', 'Show Unread Count', 'Show Site Prefix']
      $.on input, 'change', ThreadWatcher.fetchAuto if name in ['Show Page', 'Show Unread Count', 'Auto Update Thread Watcher']
      @menu.addEntry entry
