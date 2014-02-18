ThreadHiding =
  init: ->
    return if g.VIEW isnt 'index'

    @db = new DataBoard 'hiddenThreads'
    $.on d, 'IndexRefresh', @onIndexRefresh
    Thread.callbacks.push
      name: 'Thread Hiding'
      cb:   @node

  node: ->
    if data = ThreadHiding.db.get {boardID: @board.ID, threadID: @ID}
      ThreadHiding.hide @, data.makeStub
    return unless Conf['Thread Hiding']
    $.prepend @OP.nodes.root, ThreadHiding.makeButton @, 'hide'

  onIndexRefresh: ->
    for root, i in Index.nodes by 2
      thread = Get.threadFromRoot root
      continue unless thread.isHidden
      unless thread.stub
        Index.nodes[i + 1].hidden = true
      else unless root.contains thread.stub
        # When we come back to a page, the stub is already there.
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

      makeStub = $.el 'label',
        innerHTML: "<input type=checkbox checked=#{Conf['Stubs']}> Make stub"

      $.event 'AddMenuEntry',
        type: 'post'
        el: div
        order: 20
        open: ({thread, isReply}) ->
          if isReply or thread.isHidden or Conf['Index Mode'] is 'catalog'
            return false
          ThreadHiding.menu.thread = thread
          true
        subEntries: [el: apply; el: makeStub]
    hide: ->
      makeStub = $('input', @parentNode).checked
      {thread} = ThreadHiding.menu
      ThreadHiding.hide thread, makeStub
      ThreadHiding.saveHiddenState thread, makeStub
      $.event 'CloseMenu'

  makeButton: (thread, type) ->
    a = $.el 'a',
      className: "#{type}-thread-button"
      innerHTML: "<span>[&nbsp;#{if type is 'hide' then '-' else '+'}&nbsp;]</span>"
      href:      'javascript:;'
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
    Index.updateHideLabel()

    unless makeStub
      threadRoot.hidden = threadRoot.nextElementSibling.hidden = true # <hr>
      return

    ThreadHiding.makeStub thread, threadRoot

  show: (thread) ->
    if thread.stub
      $.rm thread.stub
      delete thread.stub
    threadRoot = thread.OP.nodes.root.parentNode
    threadRoot.nextElementSibling.hidden =
      threadRoot.hidden = thread.isHidden = false
    Index.updateHideLabel()
