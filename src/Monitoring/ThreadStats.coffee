ThreadStats =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Thread Stats']

    if Conf['Updater and Stats in Header']
      @dialog = sc = $.el 'span',
        innerHTML: "<span id=post-count>0</span> / <span id=file-count>0</span>"
        id:        'thread-stats'
      $.ready =>
        Header.addShortcut sc
    else 
      @dialog = sc = UI.dialog 'thread-stats', 'bottom: 0px; right: 0px;',
        "<div class=move><span id=post-count>0</span> / <span id=file-count>0</span></div>"
      $.ready => 
        $.add d.body, sc    

    @postCountEl = $ '#post-count', sc
    @fileCountEl = $ '#file-count', sc

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