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
    @dialog = UI.dialog 'thread-watcher', <%= readHTML('ThreadWatcher.html') %>

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

    @refreshButton.hidden = true unless Site.software is 'yotsuba'

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

    ThreadWatcher.fetchAuto()
    $.on window, 'visibilitychange focus', -> $.queueTask ThreadWatcher.fetchAuto

    if Conf['Menu'] and Index.enabled
      Menu.menu.addEntry
        el: $.el 'a',
          href:      'javascript:;'
          className: 'has-shortcut-text'
        , <%= html('<span></span><span class="shortcut-text">Alt+click</span>') %>
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
    boardID = @board.ID
    threadID = @thread.ID
    data = ThreadWatcher.db.get {boardID, threadID}
    ThreadWatcher.setToggler toggler, !!data
    $.on toggler, 'click', ThreadWatcher.cb.toggle
    # Add missing excerpt for threads added by Auto Watch
    if data and not data.excerpt?
      $.queueTask =>
        ThreadWatcher.db.extend {boardID, threadID, val: {excerpt: Get.threadExcerpt @thread}}
        ThreadWatcher.refresh()

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
      for a in $$ 'a[title]', ThreadWatcher.list
        $.open a.href
      $.event 'CloseMenu'
    pruneDeads: ->
      return if $.hasClass @, 'disabled'
      for {siteID, boardID, threadID, data} in ThreadWatcher.getAll() when data.isDead
        ThreadWatcher.db.delete {siteID, boardID, threadID}
      ThreadWatcher.refresh()
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
      if postID is threadID
        if Conf['Auto Watch']
          ThreadWatcher.addRaw boardID, threadID, {}
      else if Conf['Auto Watch Reply']
        ThreadWatcher.add g.threads[boardID + '.' + threadID]
    onIndexUpdate: (e) ->
      {db}    = ThreadWatcher
      siteID  = Site.hostname
      boardID = g.BOARD.ID
      nKilled = 0
      for threadID, data of db.data[siteID].boards[boardID] when not data?.isDead and "#{boardID}.#{threadID}" not in e.detail.threads
        # Don't prune threads that have yet to appear in index.
        continue unless e.detail.threads.some (fullID) -> +fullID.split('.')[1] > threadID
        nKilled++
        if Conf['Auto Prune'] or not (data and typeof data is 'object') # corrupt data
          db.delete {boardID, threadID}
        else
          db.extend {boardID, threadID, val: {isDead: true}}
          if ThreadWatcher.unreadEnabled and Conf['Show Unread Count']
            ThreadWatcher.fetchStatus {siteID, boardID, threadID, data}
      ThreadWatcher.refresh() if nKilled
    onThreadRefresh: (e) ->
      thread = g.threads[e.detail.threadID]
      return unless e.detail[404] and ThreadWatcher.isWatched thread
      # Update dead status.
      ThreadWatcher.add thread

  requests: []
  fetched:  0

  clearRequests: ->
    ThreadWatcher.requests = []
    ThreadWatcher.fetched = 0
    ThreadWatcher.status.textContent = ''
    $.rmClass ThreadWatcher.refreshButton, 'fa-spin'

  abort: ->
    for req in ThreadWatcher.requests when req.readyState isnt 4 # DONE
      req.abort()
    ThreadWatcher.clearRequests()

  fetchAuto: ->
    return unless Site.software is 'yotsuba'
    clearTimeout ThreadWatcher.timeout
    return unless Conf['Auto Update Thread Watcher']
    {db} = ThreadWatcher
    interval = if ThreadWatcher.unreadEnabled and Conf['Show Unread Count'] then 5 * $.MINUTE else 2 * $.HOUR
    now = Date.now()
    unless now - interval < (db.data[Site.hostname].lastChecked or 0) <= now or d.hidden or not d.hasFocus()
      ThreadWatcher.fetchAllStatus()
      db.setLastChecked()
    ThreadWatcher.timeout = setTimeout ThreadWatcher.fetchAuto, interval

  buttonFetchAll: ->
    if ThreadWatcher.requests.length
      ThreadWatcher.abort()
    else
      ThreadWatcher.fetchAllStatus()

  fetchAllStatus: ->
    return unless Site.software is 'yotsuba'
    dbs = [ThreadWatcher.db, ThreadWatcher.unreaddb, QuoteYou.db].filter((x) -> x)
    n = 0
    for db in dbs
      db.forceSync ->
        if (++n) is dbs.length
          threads = ThreadWatcher.getAll()
          for thread in threads
            ThreadWatcher.fetchStatus thread
          return

  fetchStatus: (thread, force) ->
    {siteID, boardID, threadID, data} = thread
    return unless Site.software is 'yotsuba' and siteID is Site.hostname
    return if data.isDead and not force
    if ThreadWatcher.requests.length is 0
      ThreadWatcher.status.textContent = '...'
      $.addClass ThreadWatcher.refreshButton, 'fa-spin'
    req = $.ajax "#{location.protocol}//a.4cdn.org/#{boardID}/thread/#{threadID}.json",
      onloadend: ->
        ThreadWatcher.parseStatus.call @, thread
      timeout: $.MINUTE
    ,
      whenModified: if force then false else 'ThreadWatcher'
    ThreadWatcher.requests.push req

  parseStatus: ({boardID, threadID, data}) ->
    ThreadWatcher.fetched++
    if ThreadWatcher.fetched is ThreadWatcher.requests.length
      ThreadWatcher.clearRequests()
    else
      ThreadWatcher.status.textContent = "#{Math.round(ThreadWatcher.fetched / ThreadWatcher.requests.length * 100)}%"

    if @status is 200 and @response
      isDead = !!@response.posts[0].archived
      if isDead and Conf['Auto Prune']
        ThreadWatcher.db.delete {boardID, threadID}
        ThreadWatcher.refresh()
        return

      lastReadPost = ThreadWatcher.unreaddb.get
        boardID: boardID
        threadID: threadID
        defaultValue: 0

      unread = 0
      quotingYou = false
      youOP = !!QuoteYou.db?.get {boardID, threadID, postID: threadID}

      for postObj in @response.posts
        continue unless postObj.no > lastReadPost
        continue if QuoteYou.db?.get {boardID, threadID, postID: postObj.no}

        unread++

        if !quotingYou and !Conf['Require OP Quote Link'] and youOP and not Filter.isHidden(Build.parseJSON postObj, boardID)
          quotingYou = true
          continue

        continue unless !quotingYou and QuoteYou.db and postObj.com

        quotesYou = false
        regexp = /<a [^>]*\bhref="(?:(?:\/\/boards\.4chan(?:nel)?\.org)?\/([^\/]+)\/thread\/)?(\d+)?(?:#p(\d+))?"/g
        while match = regexp.exec postObj.com
          if QuoteYou.db.get {
            boardID:  match[1] or boardID
            threadID: match[2] or threadID
            postID:   match[3] or match[2] or threadID
          }
            quotesYou = true
            break
        if quotesYou and not Filter.isHidden(Build.parseJSON postObj, boardID)
          quotingYou = true

      if isDead isnt data.isDead or unread isnt data.unread or quotingYou isnt data.quotingYou
        ThreadWatcher.db.extend {boardID, threadID, val: {isDead, unread, quotingYou}}
        ThreadWatcher.refresh()

    else if @status is 404
      if Conf['Auto Prune']
        ThreadWatcher.db.delete {boardID, threadID}
      else
        ThreadWatcher.db.extend {boardID, threadID, val: {isDead: true}, rm: ['unread', 'quotingYou']}

      ThreadWatcher.refresh()

  getAll: ->
    all = []
    for siteID, boards of ThreadWatcher.db.data
      for boardID, threads of boards.boards
        if Conf['Current Board'] and (siteID isnt Site.hostname or boardID isnt g.BOARD.ID)
          continue
        for threadID, data of threads when data and typeof data is 'object'
          all.push {siteID, boardID, threadID, data}
    all

  makeLine: (siteID, boardID, threadID, data) ->
    x = $.el 'a',
      className: 'fa fa-times'
      href: 'javascript:;'
    $.on x, 'click', ThreadWatcher.cb.rm

    {excerpt} = data
    excerpt or= "/#{boardID}/ - No.#{threadID}"

    link = $.el 'a',
      href: SW[Site.swDict[siteID]].urls.thread({siteID, boardID, threadID})
      title: excerpt
      className: 'watcher-link'

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
    if ThreadWatcher.unreadEnabled and Conf['Show Unread Count']
      $.addClass div, 'replies-read'        if data.unread is 0
      $.addClass div, 'replies-unread'      if data.unread
      $.addClass div, 'replies-quoting-you' if data.quotingYou
    $.add div, [x, $.tn(' '), link]
    div

  build: ->
    nodes = []
    for {siteID, boardID, threadID, data} in ThreadWatcher.getAll()
      # Add missing excerpt for threads added by Auto Watch
      if not data.excerpt? and siteID is Site.hostname and (thread = g.threads["#{boardID}.#{threadID}"])
        ThreadWatcher.db.extend {boardID, threadID, val: {excerpt: Get.threadExcerpt thread}}
      nodes.push ThreadWatcher.makeLine siteID, boardID, threadID, data
    {list} = ThreadWatcher
    $.rmAll list
    $.add list, nodes

    ThreadWatcher.refreshIcon()
    for refresher in ThreadWatcher.menu.refreshers
      refresher()
    return

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

  update: (boardID, threadID, newData) ->
    siteID = Site.hostname
    return if not (data = ThreadWatcher.db?.get {boardID, threadID})
    if newData.isDead and Conf['Auto Prune']
      ThreadWatcher.db.delete {boardID, threadID}
      ThreadWatcher.refresh()
      return
    n = 0
    n++ for key, val of newData when data[key] isnt val
    return unless n
    return if not (data = ThreadWatcher.db.get {boardID, threadID})
    ThreadWatcher.db.extend {boardID, threadID, val: newData}
    if line = $ "#watched-threads > [data-site-i-d='#{siteID}'][data-full-i-d='#{boardID}.#{threadID}']", ThreadWatcher.dialog
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
    return cb() if data.isDead and not (data.unread? or data.quotingYou?)
    ThreadWatcher.db.extend {boardID, threadID, val: {isDead: true}, rm: ['unread', 'quotingYou']}, cb

  toggle: (thread) ->
    siteID   = Site.hostname
    boardID  = thread.board.ID
    threadID = thread.ID
    if ThreadWatcher.db.get {boardID, threadID}
      ThreadWatcher.rm siteID, boardID, threadID
    else
      ThreadWatcher.add thread

  add: (thread) ->
    data     = {}
    siteID   = Site.hostname
    boardID  = thread.board.ID
    threadID = thread.ID
    if thread.isDead
      if Conf['Auto Prune'] and ThreadWatcher.db.get {boardID, threadID}
        ThreadWatcher.rm siteID, boardID, threadID
        return
      data.isDead = true
    data.excerpt  = Get.threadExcerpt thread
    ThreadWatcher.addRaw boardID, threadID, data

  addRaw: (boardID, threadID, data) ->
    ThreadWatcher.db.set {boardID, threadID, val: data}
    ThreadWatcher.refresh()
    if ThreadWatcher.unreadEnabled and Conf['Show Unread Count']
      ThreadWatcher.fetchStatus {siteID: Site.hostname, boardID, threadID, data}, true

  rm: (siteID, boardID, threadID) ->
    ThreadWatcher.db.delete {siteID, boardID, threadID}
    ThreadWatcher.refresh()

  menu:
    refreshers: []
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
      $.on entryEl, 'click', -> ThreadWatcher.toggle g.threads["#{g.BOARD}.#{g.THREADID}"]
      @refreshers.push ->
        [addClass, rmClass, text] = if $ '.current', ThreadWatcher.list
          ['unwatch-thread', 'watch-thread', 'Unwatch thread']
        else
          ['watch-thread', 'unwatch-thread', 'Watch thread']
        $.addClass entryEl, addClass
        $.rmClass  entryEl, rmClass
        entryEl.textContent = text

    addMenuEntries: ->
      entries = []

      # `Open all` entry
      entries.push
        cb: ThreadWatcher.cb.openAll
        entry:
          el: $.el 'a',
            textContent: 'Open all threads'
        refresh: -> (if ThreadWatcher.list.firstElementChild then $.rmClass else $.addClass) @el, 'disabled'

      # `Prune dead threads` entry
      entries.push
        cb: ThreadWatcher.cb.pruneDeads
        entry:
          el: $.el 'a',
            textContent: 'Prune dead threads'
        refresh: -> (if $('.dead-thread', ThreadWatcher.list) then $.rmClass else $.addClass) @el, 'disabled'

      # `Settings` entries:
      subEntries = []
      for name, conf of Config.threadWatcher
        subEntries.push @createSubEntry name, conf[1]
      entries.push
        entry:
          el: $.el 'span',
            textContent: 'Settings'
          subEntries: subEntries

      for {entry, cb, refresh} in entries
        entry.el.href = 'javascript:;' if entry.el.nodeName is 'A'
        $.on entry.el, 'click', cb if cb
        @refreshers.push refresh.bind entry if refresh
        @menu.addEntry entry
      return

    createSubEntry: (name, desc) ->
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
      $.on input, 'change', ThreadWatcher.refresh   if name in ['Current Board', 'Show Unread Count']
      $.on input, 'change', ThreadWatcher.fetchAuto if name in ['Show Unread Count', 'Auto Update Thread Watcher']
      entry
