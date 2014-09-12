ThreadHiding =
  init: ->
    return if g.VIEW isnt 'index' or !Conf['Thread Hiding Buttons'] and !Conf['Thread Hiding Link']

    @db = new DataBoard 'hiddenThreads'
    Thread.callbacks.push
      name: 'Thread Hiding'
      cb:   @node

  node: ->
    if data = ThreadHiding.db.get {boardID: @board.ID, threadID: @ID}
      ThreadHiding.hide @, data.makeStub
    return unless Conf['Thread Hiding Buttons']
    $.prepend @OP.nodes.root, ThreadHiding.makeButton @, 'hide'

  onIndexBuild: (nodes) ->
    for root in nodes
      thread = Get.threadFromRoot root
      if thread.isHidden and thread.stub and !root.contains thread.stub
        ThreadHiding.makeStub thread, root
    return

  menu:
    init: ->
      return if g.VIEW isnt 'index' or !Conf['Menu'] or !Conf['Thread Hiding Link']

      div = $.el 'div',
        className: 'hide-thread-link'
        textContent: 'Hide thread'

      apply = $.el 'a',
        textContent: 'Apply'
        href: 'javascript:;'
      $.on apply, 'click', ThreadHiding.menu.hide

      makeStub = UI.checkbox 'Stubs', ' Make stub'

      Menu.menu.addEntry
        el: div
        order: 20
        open: ({thread, isReply}) ->
          if isReply or thread.isHidden
            return false
          ThreadHiding.menu.thread = thread
          true
        subEntries: [el: apply; el: makeStub]

      div = $.el 'a',
        className: 'show-thread-link'
        textContent: 'Show thread'
        href: 'javascript:;'
      $.on div, 'click', ThreadHiding.menu.show 

      Menu.menu.addEntry
        el: div
        order: 20
        open: ({thread, isReply}) ->
          if isReply or !thread.isHidden
            return false
          ThreadHiding.menu.thread = thread
          true

      hideStubLink = $.el 'a',
        textContent: 'Hide stub'
        href: 'javascript:;'
      $.on hideStubLink, 'click', ThreadHiding.menu.hideStub

      Menu.menu.addEntry
        el: hideStubLink
        order: 15
        open: ({thread, isReply}) ->
          if isReply or !thread.isHidden
            return false
          ThreadHiding.menu.thread = thread

    hide: ->
      makeStub = $('input', @parentNode).checked
      {thread} = ThreadHiding.menu
      ThreadHiding.hide thread, makeStub
      ThreadHiding.saveHiddenState thread, makeStub
      $.event 'CloseMenu'

    show: ->
      {thread} = ThreadHiding.menu
      ThreadHiding.show thread
      ThreadHiding.saveHiddenState thread
      $.event 'CloseMenu'

    hideStub: ->
      {thread} = ThreadHiding.menu
      ThreadHiding.hide thread, false
      $.event 'CloseMenu'
      return

  makeButton: (thread, type) ->
    a = $.el 'a',
      className: "#{type}-thread-button"
      href:      'javascript:;'
    $.extend a, <%= html('<span class="fa fa-${(type === "hide") ? "minus" : "plus"}-square"></span>') %>
    a.dataset.fullID = thread.fullID
    $.on a, 'click', ThreadHiding.toggle
    a
  makeStub: (thread, root) ->
    numReplies  = $$('.thread > .replyContainer', root).length
    numReplies += +summary.textContent.match /\d+/ if summary = $ '.summary', root
    opInfo = if Conf['Anonymize']
      'Anonymous'
    else
      $('.nameBlock', thread.OP.nodes.info).textContent

    a = ThreadHiding.makeButton thread, 'show'
    $.add a, $.tn " #{opInfo} (#{if numReplies is 1 then '1 reply' else "#{numReplies} replies"})"
    thread.stub = $.el 'div',
      className: 'stub'
    if Conf['Menu']
      $.add thread.stub, [a, Menu.makeButton()]
    else
      $.add thread.stub, a
    $.prepend root, thread.stub

  saveHiddenState: (thread, makeStub) ->
    if thread.isHidden
      ThreadHiding.db.set
        boardID:  thread.board.ID
        threadID: thread.ID
        val: {makeStub}
    else
      ThreadHiding.db.delete
        boardID:  thread.board.ID
        threadID: thread.ID

  toggle: (thread) ->
    unless thread instanceof Thread
      thread = g.threads[@dataset.fullID]
    if thread.isHidden
      ThreadHiding.show thread
    else
      ThreadHiding.hide thread
    ThreadHiding.saveHiddenState thread

  hide: (thread, makeStub=Conf['Stubs']) ->
    return if thread.isHidden
    threadRoot = thread.OP.nodes.root.parentNode
    thread.isHidden = true

    return threadRoot.hidden = true unless makeStub

    ThreadHiding.makeStub thread, threadRoot

  show: (thread) ->
    if thread.stub
      $.rm thread.stub
      delete thread.stub
    threadRoot = thread.OP.nodes.root.parentNode
    threadRoot.hidden = thread.isHidden = false
