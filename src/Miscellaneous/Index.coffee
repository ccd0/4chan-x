Index =
  init: ->
    return if g.VIEW isnt 'index'

    label = $.el 'label',
      innerHTML: """
      <select name='Index Mode' title='Change the index view mode.'>
        <option disabled>Index Mode</option>
        <option value='paged'>Paged</option>
        <option value='all pages'>All threads</option>
      <select>
      """
    select = label.firstChild
    select.value = Conf['Index Mode']
    $.on select, 'change', $.cb.value
    $.on select, 'change', @update

    $.event 'AddMenuEntry',
      type: 'header'
      el: $.el 'span',
        textContent: 'Index Navigation'
      order: 90
      subEntries: [el: label]

    $.on d, '4chanXInitFinished', @initReady

  initReady: ->
    $.off d, '4chanXInitFinished', Index.initReady
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

    Header.scrollTo $.id 'delform'
  parse: (pages) ->
    if Conf['Index Mode'] is 'paged'
      pageNum = +window.location.pathname.split('/')[2]
      dataThr = pages[pageNum].threads
    else
      dataThr = []
      for page in pages
        dataThr.push page.threads...

    nodes   = []
    threads = []
    posts   = []
    for data in dataThr
      threadRoot = Build.thread g.BOARD, data
      nodes.push threadRoot, $.el 'hr'
      unless thread = g.threads["#{g.BOARD}.#{data.no}"]
        thread = new Thread data.no, g.BOARD
      threads.push thread
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

    Main.callbackNodes Thread, threads
    Main.callbackNodes Post, posts

    board = $ '.board'
    $.rmAll board
    $.add board, nodes
    $('.pagelist').hidden = Conf['Index Mode'] isnt 'paged'
