ThreadStats =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Thread Stats']
    @dialog = UI.dialog 'thread-stats', 'bottom: 0; left: 0;', <%= importHTML('Monitoring/ThreadStats') %>

    @postCountEl  = $ '#post-count', @dialog
    @fileCountEl  = $ '#file-count', @dialog
    @pageCountEl  = $ '#page-count', @dialog

    Thread.callbacks.push
      name: 'Thread Stats'
      cb:   @node
  node: ->
    postCount = 0
    fileCount = 0
    for ID, post of @posts
      postCount++
      fileCount++ if post.file
    ThreadStats.thread = @
    ThreadStats.fetchPage()
    ThreadStats.update postCount, fileCount
    $.on d, 'ThreadUpdate', ThreadStats.onUpdate
    $.add d.body, ThreadStats.dialog
  onUpdate: (e) ->
    return if e.detail[404]
    {postCount, fileCount} = e.detail
    ThreadStats.update postCount, fileCount
  update: (postCount, fileCount) ->
    {thread, postCountEl, fileCountEl} = ThreadStats
    postCountEl.textContent = postCount
    fileCountEl.textContent = fileCount
    (if thread.postLimit and !thread.isSticky then $.addClass else $.rmClass) postCountEl, 'warning'
    (if thread.fileLimit and !thread.isSticky then $.addClass else $.rmClass) fileCountEl, 'warning'
  fetchPage: ->
    if ThreadStats.thread.isDead
      ThreadStats.pageCountEl.textContent = 'Dead'
      $.addClass ThreadStats.pageCountEl, 'warning'
      return
    setTimeout ThreadStats.fetchPage, 2 * $.MINUTE
    $.ajax "//a.4cdn.org/#{ThreadStats.thread.board}/threads.json", onload: ThreadStats.onThreadsLoad,
      whenModified: true
  onThreadsLoad: ->
    return if @status isnt 200
    for page in @response
      for thread in page.threads
        if thread.no is ThreadStats.thread.ID
          ThreadStats.pageCountEl.textContent = page.page
          (if page.page is @response.length - 1 then $.addClass else $.rmClass) ThreadStats.pageCountEl, 'warning'
          return
