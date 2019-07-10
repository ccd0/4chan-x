ThreadStats =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Thread Stats']

    statsHTML = <%= html(
      '<span id="post-count">?</span> / <span id="file-count">?</span>' +
      '?{Conf["IP Count in Stats"]}{ / <span id="ip-count">?</span>}' +
      '?{Conf["Page Count in Stats"]}{ / <span id="page-count">?</span>}'
    ) %>
    statsTitle = 'Posts / Files'
    statsTitle += ' / IPs'  if Conf['IP Count in Stats']
    statsTitle += (if g.BOARD.ID is 'f' then ' / Purge Position' else ' / Page') if Conf['Page Count in Stats']

    if Conf['Updater and Stats in Header']
      @dialog = sc = $.el 'span',
        id:    'thread-stats'
        title: statsTitle
      $.extend sc, statsHTML
      Header.addShortcut 'stats', sc, 200

    else
      @dialog = sc = UI.dialog 'thread-stats',
        <%= html('<div class="move" title="${statsTitle}">&{statsHTML}</div>') %>
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
    postCount = 0
    fileCount = 0
    @posts.forEach (post) ->
      postCount++
      fileCount++ if post.file
      (ThreadStats.lastPost = post.info.date if ThreadStats.pageCountEl)
    ThreadStats.thread = @
    ThreadStats.fetchPage()
    ThreadStats.update postCount, fileCount, @ipCount
    $.on d, 'ThreadUpdate', ThreadStats.onUpdate

  onUpdate: (e) ->
    return if e.detail[404]
    {postCount, fileCount, ipCount, newPosts} = e.detail
    ThreadStats.update postCount, fileCount, ipCount
    return unless ThreadStats.pageCountEl
    if newPosts.length
      ThreadStats.lastPost = g.posts[newPosts[newPosts.length - 1]].info.date
    if g.BOARD.ID isnt 'f' and ThreadStats.pageCountEl?.textContent isnt '1'
      ThreadStats.fetchPage()

  update: (postCount, fileCount, ipCount) ->
    {thread, postCountEl, fileCountEl, ipCountEl} = ThreadStats
    postCountEl.textContent = postCount
    fileCountEl.textContent = fileCount
    if ipCount? and ipCountEl
      ipCountEl.textContent = ipCount
    (if thread.postLimit and !thread.isSticky then $.addClass else $.rmClass) postCountEl, 'warning'
    (if thread.fileLimit and !thread.isSticky then $.addClass else $.rmClass) fileCountEl, 'warning'

  fetchPage: ->
    return unless ThreadStats.pageCountEl
    clearTimeout ThreadStats.timeout
    if ThreadStats.thread.isDead
      ThreadStats.pageCountEl.textContent = 'Dead'
      $.addClass ThreadStats.pageCountEl, 'warning'
      return
    ThreadStats.timeout = setTimeout ThreadStats.fetchPage, 2 * $.MINUTE
    $.whenModified(
      g.SITE.urls.threadsListJSON({boardID: ThreadStats.thread.board}),
      'ThreadStats',
      ThreadStats.onThreadsLoad
    )

  onThreadsLoad: ->
    if @status is 200
      for page in @response
        if g.BOARD.ID is 'f'
          purgePos = 1
          for thread in page.threads
            if thread.no < ThreadStats.thread.ID
              purgePos++
          ThreadStats.pageCountEl.textContent = purgePos
        else
          for thread in page.threads when thread.no is ThreadStats.thread.ID
            ThreadStats.pageCountEl.textContent = page.page
            (if page.page is @response.length then $.addClass else $.rmClass) ThreadStats.pageCountEl, 'warning'
            ThreadStats.lastPageUpdate = new Date thread.last_modified * $.SECOND
            ThreadStats.retry()
            return
    else if @status is 304
      ThreadStats.retry()

  retry: ->
    # If thread data is stale (modification date given < time of last post), try again.
    if g.BOARD.ID isnt 'f' and ThreadStats.lastPost > ThreadStats.lastPageUpdate and ThreadStats.pageCountEl?.textContent isnt '1'
      clearTimeout ThreadStats.timeout
      ThreadStats.timeout = setTimeout ThreadStats.fetchPage, 5 * $.SECOND
