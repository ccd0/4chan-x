ThreadWatcher =
  init: ->
    return if !Conf['Thread Watcher']

    @db     = new DataBoard 'watchedThreads', @refresh, true
    @dialog = UI.dialog 'thread-watcher', 'top: 50px; left: 0px;', """
    <%= grunt.file.read('html/Monitoring/ThreadWatcher.html').replace(/>\s+</g, '><').trim() %>
    """
    @list = @dialog.lastElementChild

    @menuInit()
    @addHeaderMenuEntry()

    $.on $('.menu-button', @dialog), 'click', @cb.menuToggle
    $.on d, 'QRPostSuccessful',   @cb.post
    $.on d, 'ThreadUpdate',       @cb.threadUpdate if g.VIEW is 'thread'
    $.on d, '4chanXInitFinished', @ready

    # XXX tmp conversion from old to new format
    $.get 'WatchedThreads', null, ({WatchedThreads}) ->
      return unless WatchedThreads
      for boardID, threads of ThreadWatcher.convert WatchedThreads
        for threadID, data of threads
          ThreadWatcher.db.set {boardID, threadID, val: data}
      $.delete 'WatchedThreads'

    Thread::callbacks.push
      name: 'Thread Watcher'
      cb:   @node

  node: ->
    toggler = $.el 'img',
      className: 'watcher-toggler'
    $.on toggler, 'click', ThreadWatcher.cb.toggle
    $.before $('input', @OP.nodes.post), toggler

    return if g.VIEW isnt 'thread' or !Conf['Auto Watch']
    $.get 'AutoWatch', 0, ({AutoWatch}) =>
      return if AutoWatch isnt @ID
      ThreadWatcher.add @
      $.delete 'AutoWatch'

  menuInit: ->
    ThreadWatcher.menu = new UI.Menu 'thread watcher'

    # `Open all` entry
    entry =
      type: 'thread watcher'
      el: $.el 'a',
        textContent: 'Open all threads'
        href: 'javascript:;'
      open: ->
        (if ThreadWatcher.list.firstElementChild then $.rmClass else $.addClass) @el, 'disabled'
        true
    $.event 'AddMenuEntry', entry
    $.on entry.el, 'click', ThreadWatcher.cb.openAll

    # `Prune 404'd threads` entry
    entry =
      type: 'thread watcher'
      el: $.el 'a',
        textContent: 'Prune 404\'d threads'
        href: 'javascript:;'
      open: ->
        (if $('.dead-thread', ThreadWatcher.list) then $.rmClass else $.addClass) @el, 'disabled'
        true
    $.event 'AddMenuEntry', entry
    $.on entry.el, 'click', ThreadWatcher.cb.pruneDeads

    # `Settings` entries:
    subEntries = []
    for name, conf of Config.threadWatcher
      subEntries.push ThreadWatcher.createSubEntry name, conf[1]
    $.event 'AddMenuEntry',
      type: 'thread watcher'
      el: $.el 'span', textContent: 'Settings'
      subEntries: subEntries
  createSubEntry: (name, desc) ->
    entry =
      type: 'thread watcher'
      el: $.el 'label',
        innerHTML: "<input type=checkbox name='#{name}'> #{name}"
        title: desc
    input = entry.el.firstElementChild
    input.checked = Conf[name]
    $.on input, 'change', $.cb.checked
    $.on input, 'change', ThreadWatcher.refresh if name is 'Current Board'
    entry
  addHeaderMenuEntry: ->
    return if g.VIEW isnt 'thread'
    ThreadWatcher.entryEl = $.el 'a', href: 'javascript:;'
    entry =
      type: 'header'
      el: ThreadWatcher.entryEl
      order: 60
    $.event 'AddMenuEntry', entry
    $.on entry.el, 'click', -> ThreadWatcher.toggle g.threads["#{g.BOARD}.#{g.THREADID}"]

  ready: ->
    $.off d, '4chanXInitFinished', ThreadWatcher.ready
    return unless Main.isThisPageLegit()
    ThreadWatcher.refresh()
    $.add d.body, ThreadWatcher.dialog

  cb:
    menuToggle: (e) ->
      ThreadWatcher.menu.toggle e, @, ThreadWatcher
    openAll: ->
      return if $.hasClass @, 'disabled'
      for a in $$ 'a[title]', ThreadWatcher.list
        $.open a.href
      $.event 'CloseMenu'
    pruneDeads: ->
      return if $.hasClass @, 'disabled'
      for boardID, threads of ThreadWatcher.db.data.boards
        if Conf['Current Board'] and boardID isnt g.BOARD.ID
          continue
        for threadID, data of threads
          continue unless data.isDead
          delete threads[threadID]
        ThreadWatcher.db.deleteIfEmpty {boardID}
      ThreadWatcher.db.save()
      ThreadWatcher.refresh()
      $.event 'CloseMenu'
    toggle: ->
      ThreadWatcher.toggle Get.postFromNode(@).thread
    rm: ->
      [boardID, threadID] = @parentNode.dataset.fullid.split '.'
      ThreadWatcher.rm boardID, +threadID
    post: (e) ->
      {board, postID, threadID} = e.detail
      if postID is threadID
        if Conf['Auto Watch']
          $.set 'AutoWatch', threadID
      else if Conf['Auto Watch Reply']
        ThreadWatcher.add board.threads[threadID]
    threadUpdate: (e) ->
      # Update 404 status.
      return unless e.detail[404]
      {thread} = e.detail
      return unless ThreadWatcher.db.get {boardID: thread.board.ID, threadID: thread.ID}
      ThreadWatcher.add thread

  refresh: ->
    nodes = []
    for boardID, threads of ThreadWatcher.db.data.boards
      if Conf['Current Board'] and boardID isnt g.BOARD.ID
        continue
      for threadID, data of threads
        x = $.el 'a',
          textContent: '×'
          href: 'javascript:;'
        $.on x, 'click', ThreadWatcher.cb.rm

        if data.isDead
          href = Redirect.to 'thread', {boardID, threadID}
        link = $.el 'a',
          href: href or "/#{boardID}/res/#{threadID}"
          textContent: data.excerpt
          title: data.excerpt

        nodes.push div = $.el 'div'
        div.setAttribute 'data-fullid', "#{boardID}.#{threadID}"
        $.addClass div, 'dead-thread' if data.isDead
        $.add div, [x, $.tn(' '), link]

    list = ThreadWatcher.dialog.lastElementChild
    $.rmAll list
    $.add list, nodes

    if g.VIEW is 'thread'
      {entryEl} = ThreadWatcher
      if div = $ "div[data-fullid='#{g.BOARD}.#{g.THREADID}']", list
        $.addClass div, 'current'
        $.addClass entryEl, 'unwatch-thread'
        $.rmClass  entryEl, 'watch-thread'
        entryEl.textContent = 'Unwatch thread'
      else
        $.addClass entryEl, 'watch-thread'
        $.rmClass  entryEl, 'unwatch-thread'
        entryEl.textContent = 'Watch thread'

    for threadID, thread of g.BOARD.threads
      toggler = $ '.watcher-toggler', thread.OP.nodes.post
      toggler.src = if ThreadWatcher.db.get {boardID: thread.board.ID, threadID}
        Favicon.default
      else
        Favicon.empty
    return

  toggle: (thread) ->
    boardID  = thread.board.ID
    threadID = thread.ID
    if ThreadWatcher.db.get {boardID, threadID}
      ThreadWatcher.rm boardID, threadID
    else
      ThreadWatcher.add thread
  add: (thread) ->
    data = excerpt: Get.threadExcerpt thread
    if thread.isDead
      data.isDead = true
    ThreadWatcher.db.set
      boardID:  thread.board.ID
      threadID: thread.ID
      val: data
    ThreadWatcher.refresh()
  rm: (boardID, threadID) ->
    ThreadWatcher.db.delete {boardID, threadID}
    ThreadWatcher.refresh()

  convert: (oldFormat) ->
    newFormat = {}
    for boardID, threads of oldFormat
      for threadID, data of threads
        (newFormat[boardID] or= {})[threadID] = excerpt: data.textContent
    newFormat
