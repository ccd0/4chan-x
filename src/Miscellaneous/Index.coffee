Index =
  init: ->
    return if g.VIEW isnt 'index'

    button = $.el 'a',
      className: 'index-refresh-shortcut fa fa-refresh'
      title: 'Refresh Index'
      href: 'javascript:;'
    $.on button, 'click', Index.update
    Header.addShortcut button, 1

    subEntries = []

    subEntry =
      el: $.el 'span', textContent: 'Index Mode'
      subEntries: [
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Mode" value="paged"> Paged' }
        { el: $.el 'label', innerHTML: '<input type=radio name="Index Mode" value="all pages"> All threads' }
      ]
    for label in subEntry.subEntries
      input = label.el.firstChild
      input.checked = Conf['Index Mode'] is input.value
      $.on input, 'change', $.cb.value
      $.on input, 'change', @update
    subEntries.push subEntry

    $.event 'AddMenuEntry',
      type: 'header'
      el: $.el 'span',
        textContent: 'Index Navigation'
      order: 90
      subEntries: subEntries

    $.on d, '4chanXInitFinished', @initReady

  initReady: ->
    $.off d, '4chanXInitFinished', Index.initReady
    Index.root = $ '.board'
    Index.setIndex $$ '.board > .thread, .board > hr', Index.root
    return if Conf['Index Mode'] is 'paged'
    Index.update()

  update: ->
    return unless navigator.onLine
    Index.req?.abort()
    Index.notice?.close()
    Index.notice = new Notice 'info', 'Refreshing index...'
    Index.req = $.ajax "//api.4chan.org/#{g.BOARD}/catalog.json",
      onabort:   Index.load
      onloadend: Index.load
    ,
      whenModified: true
  load: (e) ->
    {req, notice} = Index
    delete Index.req
    delete Index.notice

    if e.type is 'abort'
      req.onloadend = null
      notice.close()
      return

    try
      Index.parse JSON.parse req.response if req.status is 200
    catch err
      c.error err.stack
      # network error or non-JSON content for example.
      notice.setType 'error'
      notice.el.lastElementChild.textContent = 'Index refresh failed.'
      setTimeout notice.close, 2 * $.SECOND
      return

    notice.setType 'success'
    notice.el.lastElementChild.textContent = 'Index refreshed!'
    setTimeout notice.close, $.SECOND

    Header.scrollTo Index.root if Index.root.getBoundingClientRect().top < 0
  parse: (pages) ->
    if Conf['Index Mode'] is 'paged'
      pageNum = +window.location.pathname.split('/')[2]
      dataThr = pages[pageNum].threads
    else
      dataThr = []
      for page in pages
        dataThr.push page.threads...

    nodes       = []
    threads     = []
    liveThreads = []
    posts       = []
    for data in dataThr
      threadRoot = Build.thread g.BOARD, data
      nodes.push threadRoot, $.el 'hr'
      unless thread = g.threads["#{g.BOARD}.#{data.no}"]
        thread = new Thread data.no, g.BOARD
        threads.push thread
      liveThreads.push thread
      for postRoot in $$ '.thread > .postContainer', threadRoot
        continue if thread.posts[postRoot.id.match /\d+/]
        try
          posts.push new Post postRoot, thread, g.BOARD
        catch err
          # Skip posts that we failed to parse.
          unless errors
            errors = []
          errors.push
            message: "Parsing of Post No.#{postRoot.id.match /\d+/} failed. Post will be skipped."
            error: err
    Main.handleErrors errors if errors

    Index.collectDeadThreads liveThreads
    # Add the threads and <hr>s in a container to make sure all features work.
    $.nodes nodes
    Main.callbackNodes Thread, threads
    Main.callbackNodes Post, posts
    $.event 'IndexRefresh'

    Index.setIndex nodes
  setIndex: (nodes) ->
    $.rmAll Index.root
    $.add Index.root, Index.sort nodes
    $('.pagelist').hidden = Conf['Index Mode'] isnt 'paged'
  sort: (nodes) ->
    return nodes unless Conf['Filter']
    # Put the highlighted thread & <hr> on top of the index
    # while keeping the original order they appear in.
    i = offset = 0
    while threadRoot = nodes[i]
      if Get.threadFromRoot(threadRoot).isOnTop
        nodes.splice offset, 0, nodes.splice(i, 2)...
        offset += 2
      i += 2
    nodes

  collectDeadThreads: (liveThreads) ->
    for threadID, thread of g.threads when thread not in liveThreads
      thread.collect()
    return
