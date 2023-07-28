ThreadStats =
  postCount: 0
  fileCount: 0
  postIndex: 0

  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Thread Stats']

    if Conf['Page Count in Stats']
      @[if g.SITE.isPrunedByAge?(g.BOARD) then 'showPurgePos' else 'showPage'] = true

    statsHTML = `<%= html(
      '<span id="post-count">?</span> / <span id="file-count">?</span>' +
      '?{Conf["IP Count in Stats"] && g.SITE.hasIPCount}{ / <span id="ip-count">?</span>}' +
      '?{Conf["Page Count in Stats"]}{ / <span id="page-count">?</span>}'
    ) %>`
    statsTitle = 'Posts / Files'
    statsTitle += ' / IPs'  if Conf['IP Count in Stats'] and g.SITE.hasIPCount
    statsTitle += (if @showPurgePos then ' / Purge Position' else ' / Page') if Conf['Page Count in Stats']

    if Conf['Updater and Stats in Header']
      @dialog = sc = $.el 'span',
        id:    'thread-stats'
        title: statsTitle
      $.extend sc, statsHTML
      Header.addShortcut 'stats', sc, 200

    else
      @dialog = sc = UI.dialog 'thread-stats',
        `<%= html('<div class="move" title="${statsTitle}">&{statsHTML}</div>') %>`
      $.addClass doc, 'float'
      $.ready ->
        $.add d.body, sc

    @postCountEl = $ '#post-count', sc
    @fileCountEl = $ '#file-count', sc
    @ipCountEl   = $ '#ip-count',   sc
    @pageCountEl = $ '#page-count', sc

    $.on @pageCountEl, 'click', ThreadStats.fetchPage if @pageCountEl

    Callbacks.Thread.push
      name: 'Thread Stats'
      cb:   @node

  node: ->
    ThreadStats.thread = @
    ThreadStats.count()
    ThreadStats.update()
    ThreadStats.fetchPage()
    $.on d, 'PostsInserted', -> $.queueTask ThreadStats.onPostsInserted
    $.on d, 'ThreadUpdate', ThreadStats.onUpdate

  count: ->
    {posts} = ThreadStats.thread
    n = posts.keys.length
    for i in [ThreadStats.postIndex...n] by 1
      post = posts.get(posts.keys[i])
      unless post.isFetchedQuote
        ThreadStats.postCount++
        ThreadStats.fileCount += post.files.length
    ThreadStats.postIndex = n

  onUpdate: (e) ->
    return if e.detail[404]
    {postCount, fileCount} = e.detail
    $.extend ThreadStats, {postCount, fileCount}
    ThreadStats.postIndex = ThreadStats.thread.posts.keys.length
    ThreadStats.update()
    if ThreadStats.showPage and ThreadStats.pageCountEl.textContent isnt '1'
      ThreadStats.fetchPage()

  onPostsInserted: ->
    return unless ThreadStats.thread.posts.keys.length > ThreadStats.postIndex
    ThreadStats.count()
    ThreadStats.update()
    if ThreadStats.showPage and ThreadStats.pageCountEl.textContent isnt '1'
      ThreadStats.fetchPage()

  update: ->
    {thread, postCountEl, fileCountEl, ipCountEl} = ThreadStats
    postCountEl.textContent = ThreadStats.postCount
    fileCountEl.textContent = ThreadStats.fileCount
    ipCountEl?.textContent  = thread.ipCount ? '?'
    postCountEl.classList.toggle 'warning', (thread.postLimit and !thread.isSticky)
    fileCountEl.classList.toggle 'warning', (thread.fileLimit and !thread.isSticky)

  fetchPage: ->
    return unless ThreadStats.pageCountEl
    clearTimeout ThreadStats.timeout
    if ThreadStats.thread.isDead
      ThreadStats.pageCountEl.textContent = 'Dead'
      $.addClass ThreadStats.pageCountEl, 'warning'
      return
    ThreadStats.timeout = setTimeout ThreadStats.fetchPage, 2 * $.MINUTE / (23 * (ThreadStats.pageCountEl.classList.contains 'warning') + 1)
    $.whenModified(
      g.SITE.urls.threadsListJSON(ThreadStats.thread),
      'ThreadStats',
      ThreadStats.onThreadsLoad
    )

  onThreadsLoad: ->
    if @status is 200
      if ThreadStats.showPurgePos
        purgePos = 1
        for page in @response
          for thread in page.threads
            if thread.no < ThreadStats.thread.ID
              purgePos++
        ThreadStats.pageCountEl.textContent = purgePos
        ThreadStats.pageCountEl.classList.toggle 'warning', (purgePos is 1)
      else
        i = nThreads = 0
        for page in @response
          nThreads += page.threads.length
        for page, pageNum in @response
          for thread in page.threads
            if thread.no is ThreadStats.thread.ID
              ThreadStats.pageCountEl.textContent = pageNum + 1
              ThreadStats.pageCountEl.classList.toggle 'warning', (i >= nThreads - @response[0].threads.length)
              if ThreadStats.pageCountEl.classList.contains 'warning'
                ThreadStats.pageCountEl.textContent += " (" + (nThreads - i - 1) + ")"
              ThreadStats.lastPageUpdate = new Date(thread.last_modified * $.SECOND)
              ThreadStats.retry()
              return
            i++
    else if @status is 304
      ThreadStats.retry()

  retry: ->
    # If thread data is stale (modification date given < time of last post), try again.
    # Skip this on vichan sites due to sage posts not updating modification time in threads.json.
    return unless (
      ThreadStats.showPage and
      ThreadStats.pageCountEl.textContent isnt '1' and
      !g.SITE.threadModTimeIgnoresSage and
      ThreadStats.thread.posts.get(ThreadStats.thread.lastPost).info.date > ThreadStats.lastPageUpdate
    )
    clearTimeout ThreadStats.timeout
    ThreadStats.timeout = setTimeout ThreadStats.fetchPage, 5 * $.SECOND
