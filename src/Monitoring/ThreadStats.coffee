ThreadStats =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Thread Stats']
    @dialog = UI.dialog 'thread-stats', 'bottom: 0; left: 0;', """
      <div class=move><span id=post-count>0</span> / <span id=file-count>0</span></div>
      """

    @postCountEl = $ '#post-count', @dialog
    @fileCountEl = $ '#file-count', @dialog

    Thread::callbacks.push
      name: 'Thread Stats'
      cb:   @node
  node: ->
    postCount = 0
    fileCount = 0
    for ID, post of @posts
      postCount++
      fileCount++ if post.file
    ThreadStats.thread = @
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
