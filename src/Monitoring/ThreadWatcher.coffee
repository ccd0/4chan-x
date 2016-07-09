ThreadWatcher =
  init: ->
    return unless (@enabled = Conf['Thread Watcher'])

    @shortcut = sc = $.el 'a',
      id:   'watcher-link'
      textContent: 'Watcher'
      title: 'Thread Watcher'
      href: 'javascript:;'
      className: 'disabled fa fa-eye'

    @db     = new DataBoard 'watchedThreads', @refresh, true
    @dialog = UI.dialog 'thread-watcher', 'top: 50px; left: 0px;', <%= readHTML('ThreadWatcher.html') %>

    @status = $ '#watcher-status', @dialog
    @list   = @dialog.lastElementChild
    @refreshButton = $ '.refresh', @dialog
    @closeButton = $('.move > .close', @dialog)
    @unreaddb = Unread.db or new DataBoard 'lastReadPosts'
    @unreadEnabled = Conf['Remember Last Read Post']

    $.on d, 'QRPostSuccessful',   @cb.post
    $.on sc, 'click', @toggleWatcher
    $.on @refreshButton, 'click', @buttonFetchAll
    $.on @closeButton, 'click', @toggleWatcher

    $.on d, '4chanXInitFinished', @ready

    switch g.VIEW
      when 'index'
        $.on d, 'IndexRefresh', @cb.onIndexRefresh
      when 'thread'
        $.on d, 'ThreadUpdate', @cb.onThreadRefresh

    if Conf['Fixed Thread Watcher']
      $.addClass doc, 'fixed-watcher'
    if !Conf['Persistent Thread Watcher']
      @dialog.hidden = true

    Header.addShortcut 'watcher', sc, 510

    ThreadWatcher.fetchAuto()

    if g.VIEW is 'index' and Conf['JSON Index'] and Conf['Menu'] and g.BOARD.ID isnt 'f'
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

    Callbacks.Post.push
      name: 'Thread Watcher'
      cb:   @node
    Callbacks.CatalogThread.push
      name: 'Thread Watcher'
      cb:   @catalogNode

  isWatched: (thread) ->
    ThreadWatcher.db?.get {boardID: thread.board.ID, threadID: thread.ID}

  node: ->
    return if @isReply
    if @isClone
      toggler = $ '.watch-thread-link', @nodes.post
    else
      toggler = $.el 'a',
        href: 'javascript:;'
        className: 'watch-thread-link'
      $.before $('input', @nodes.post), toggler
    $.on toggler, 'click', ThreadWatcher.cb.toggle

  catalogNode: ->
    $.addClass @nodes.root, 'watched' if ThreadWatcher.isWatched @thread
    $.on @nodes.thumb.parentNode, 'click', (e) =>
      return unless e.button is 0 and e.altKey
      ThreadWatcher.toggle @thread
      e.preventDefault()
    $.on @nodes.thumb.parentNode, 'mousedown', (e) ->
      # Prevent highlighting thumbnail in Firefox.
      e.preventDefault() if e.button is 0 and e.altKey

  ready: ->
    $.off d, '4chanXInitFinished', ThreadWatcher.ready
    return unless Main.isThisPageLegit()
    ThreadWatcher.refresh()
    $.add d.body, ThreadWatcher.dialog

    return unless Conf['Auto Watch']
    $.get 'AutoWatch', 0, ({AutoWatch}) ->
      return unless thread = g.BOARD.threads[AutoWatch]
      ThreadWatcher.add thread
      $.delete 'AutoWatch'

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
      ThreadWatcher.db.forceSync()
      for {boardID, threadID, data} in ThreadWatcher.getAll() when data.isDead
        delete ThreadWatcher.db.data.boards[boardID][threadID]
        ThreadWatcher.db.deleteIfEmpty {boardID}
      ThreadWatcher.db.save()
      ThreadWatcher.refresh()
      $.event 'CloseMenu'
    toggle: ->
      {thread} = Get.postFromNode @
      Index.followedThreadID = thread.ID
      ThreadWatcher.toggle thread
      delete Index.followedThreadID
    rm: ->
      [boardID, threadID] = @parentNode.dataset.fullID.split '.'
      ThreadWatcher.rm boardID, +threadID
    post: (e) ->
      {boardID, threadID, postID} = e.detail
      if postID is threadID
        if Conf['Auto Watch']
          $.set 'AutoWatch', threadID
      else if Conf['Auto Watch Reply']
        ThreadWatcher.add g.threads[boardID + '.' + threadID]
    onIndexRefresh: ->
      {db}    = ThreadWatcher
      boardID = g.BOARD.ID
      db.forceSync()
      for threadID, data of db.data.boards[boardID] when not data?.isDead and threadID not of g.BOARD.threads
        if Conf['Auto Prune'] or not (data and typeof data is 'object') # corrupt data
          db.delete {boardID, threadID}
        else
          if ThreadWatcher.unreadEnabled and Conf['Show Unread Count']
            ThreadWatcher.fetchStatus {boardID, threadID, data}
          data.isDead = true
          db.set {boardID, threadID, val: data}
      ThreadWatcher.refresh()
    onThreadRefresh: (e) ->
      thread = g.threads[e.detail.threadID]
      return unless e.detail[404] and ThreadWatcher.db.get {boardID: thread.board.ID, threadID: thread.ID}
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
    clearTimeout ThreadWatcher.timeout
    return unless Conf['Auto Update Thread Watcher']
    {db} = ThreadWatcher
    interval = if ThreadWatcher.unreadEnabled and Conf['Show Unread Count'] then 5 * $.MINUTE else 2 * $.HOUR
    now = Date.now()
    if now >= (db.data.lastChecked or 0) + interval
      db.data.lastChecked = now
      ThreadWatcher.fetchAllStatus()
      db.save()
    ThreadWatcher.timeout = setTimeout ThreadWatcher.fetchAuto, interval

  buttonFetchAll: ->
    if ThreadWatcher.requests.length
      ThreadWatcher.abort()
    else
      ThreadWatcher.fetchAllStatus()

  fetchAllStatus: ->
    ThreadWatcher.db.forceSync()
    ThreadWatcher.unreaddb.forceSync()
    QuoteYou.db?.forceSync()
    return unless (threads = ThreadWatcher.getAll()).length
    for thread in threads
      ThreadWatcher.fetchStatus thread
    return

  fetchStatus: (thread, force) ->
    {boardID, threadID, data} = thread
    return if data.isDead and not force
    if ThreadWatcher.requests.length is 0
      ThreadWatcher.status.textContent = '...'
      $.addClass ThreadWatcher.refreshButton, 'fa-spin'
    req = $.ajax "//a.4cdn.org/#{boardID}/thread/#{threadID}.json",
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

      unread = quotingYou = 0

      for postObj in @response.posts
        continue unless postObj.no > lastReadPost
        continue if QuoteYou.db?.get {boardID, threadID, postID: postObj.no}

        unread++

        continue unless QuoteYou.db and postObj.com

        quotesYou = false
        regexp = /<a [^>]*\bhref="(?:\/([^\/]+)\/thread\/)?(\d+)?(?:#p(\d+))?"/g
        while match = regexp.exec postObj.com
          if QuoteYou.db.get {
            boardID:  match[1] or boardID
            threadID: match[2] or threadID
            postID:   match[3] or match[2] or threadID
          }
            quotesYou = true
            break
        if quotesYou and not Filter.isHidden(Build.parseJSON postObj, boardID)
          quotingYou++

      if isDead isnt data.isDead or unread isnt data.unread or quotingYou isnt data.quotingYou
        data.isDead = isDead
        data.unread = unread
        data.quotingYou = quotingYou
        ThreadWatcher.db.set {boardID, threadID, val: data}
        ThreadWatcher.refresh()

    else if @status is 404
      if Conf['Auto Prune']
        ThreadWatcher.db.delete {boardID, threadID}
      else
        data.isDead = true
        delete data.unread
        delete data.quotingYou
        ThreadWatcher.db.set {boardID, threadID, val: data}

      ThreadWatcher.refresh()

  getAll: ->
    all = []
    for boardID, threads of ThreadWatcher.db.data.boards
      if Conf['Current Board'] and boardID isnt g.BOARD.ID
        continue
      for threadID, data of threads when data and typeof data is 'object'
        all.push {boardID, threadID, data}
    all

  makeLine: (boardID, threadID, data) ->
    x = $.el 'a',
      className: 'fa fa-times'
      href: 'javascript:;'
    $.on x, 'click', ThreadWatcher.cb.rm

    link = $.el 'a',
      href: "/#{boardID}/thread/#{threadID}"
      title: data.excerpt
      className: 'watcher-link'

    if ThreadWatcher.unreadEnabled and Conf['Show Unread Count'] and data.unread?
      count = $.el 'span',
        textContent: "(#{data.unread})"
        className: 'watcher-unread'
      $.add link, count

    title = $.el 'span',
      textContent: data.excerpt
      className: 'watcher-title'
    $.add link, title

    div = $.el 'div'
    fullID = "#{boardID}.#{threadID}"
    div.dataset.fullID = fullID
    $.addClass div, 'current'     if g.VIEW is 'thread' and fullID is "#{g.BOARD}.#{g.THREADID}"
    $.addClass div, 'dead-thread' if data.isDead
    if ThreadWatcher.unreadEnabled and Conf['Show Unread Count']
      $.addClass div, 'replies-read'        if data.unread is 0
      $.addClass div, 'replies-unread'      if data.unread
      $.addClass div, 'replies-quoting-you' if data.quotingYou
    $.add div, [x, $.tn(' '), link]
    div

  refresh: ->
    nodes = []
    for {boardID, threadID, data} in ThreadWatcher.getAll()
      nodes.push ThreadWatcher.makeLine boardID, threadID, data

    {list} = ThreadWatcher
    $.rmAll list
    $.add list, nodes

    g.threads.forEach (thread) ->
      helper = if ThreadWatcher.isWatched thread then ['addClass', 'Unwatch'] else ['rmClass', 'Watch']
      if thread.OP
        for post in [thread.OP, thread.OP.clones...]
          toggler = $ '.watch-thread-link', post.nodes.post
          $[helper[0]] toggler, 'watched'
          toggler.title = "#{helper[1]} Thread"
      $[helper[0]] thread.catalogView.nodes.root, 'watched' if thread.catalogView

    ThreadWatcher.refreshIcon()

    for refresher in ThreadWatcher.menu.refreshers
      refresher()

    if Index.nodes and Conf['Pin Watched Threads']
      Index.sort()
      Index.buildIndex()

  refreshIcon: ->
    for className in ['replies-unread', 'replies-quoting-you']
      ThreadWatcher.shortcut.classList.toggle className, !!$(".#{className}", ThreadWatcher.dialog)
    return

  update: (boardID, threadID, newData) ->
    return unless data = ThreadWatcher.db?.get {boardID, threadID}
    if newData.isDead and Conf['Auto Prune']
      ThreadWatcher.db.delete {boardID, threadID}
      ThreadWatcher.refresh()
      return
    n = 0
    n++ for key, val of newData when data[key] isnt val
    return unless n
    ThreadWatcher.db.forceSync()
    return unless data = ThreadWatcher.db.get {boardID, threadID}
    $.extend data, newData
    ThreadWatcher.db.set {boardID, threadID, val: data}
    if line = $ "#watched-threads > [data-full-i-d='#{boardID}.#{threadID}']", ThreadWatcher.dialog
      newLine = ThreadWatcher.makeLine boardID, threadID, data
      $.replace line, newLine
      ThreadWatcher.refreshIcon()
    else
      ThreadWatcher.refresh()

  set404: (boardID, threadID, cb) ->
    return cb() unless data = ThreadWatcher.db?.get {boardID, threadID}
    if Conf['Auto Prune']
      ThreadWatcher.db.delete {boardID, threadID}
      return cb()
    return cb() if data.isDead and not (data.unread? or data.quotingYou?)
    data.isDead = true
    delete data.unread
    delete data.quotingYou
    ThreadWatcher.db.set {boardID, threadID, val: data}, cb

  toggle: (thread) ->
    boardID  = thread.board.ID
    threadID = thread.ID
    if ThreadWatcher.db.get {boardID, threadID}
      ThreadWatcher.rm boardID, threadID
    else
      ThreadWatcher.add thread

  add: (thread) ->
    data     = {}
    boardID  = thread.board.ID
    threadID = thread.ID
    if thread.isDead
      if Conf['Auto Prune'] and ThreadWatcher.db.get {boardID, threadID}
        ThreadWatcher.rm boardID, threadID
        return
      data.isDead = true
    data.excerpt  = Get.threadExcerpt thread
    ThreadWatcher.db.set {boardID, threadID, val: data}
    ThreadWatcher.refresh()
    if ThreadWatcher.unreadEnabled and Conf['Show Unread Count']
      ThreadWatcher.fetchStatus {boardID, threadID, data}, true

  rm: (boardID, threadID) ->
    ThreadWatcher.db.delete {boardID, threadID}
    ThreadWatcher.refresh()

  menu:
    refreshers: []
    init: ->
      return if !Conf['Thread Watcher']
      menu = @menu = new UI.Menu 'thread watcher'
      $.on $('.menu-button', ThreadWatcher.dialog), 'click', (e) ->
        menu.toggle e, @, ThreadWatcher
      @addHeaderMenuEntry()
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
