<% if (tests_enabled) { %>
BuildTest =
  init: ->
    return if !Conf['Menu'] or g.VIEW is 'catalog'

    a = $.el 'a',
      textContent: 'Test HTML building'
    $.on a, 'click', @testOne
    Menu.menu.addEntry
      el: a
      open: (post) ->
        a.dataset.fullID = post.fullID
        true

    a2 = $.el 'a',
      textContent: 'Test HTML building'
    $.on a2, 'click', @testAll
    Header.menu.addEntry
      el: a2

  firstDiff: (x, y) ->
    x2 = x.cloneNode false
    y2 = y.cloneNode false
    if !x2.isEqualNode y2
      return [x2, y2]
    i = 0
    while !!(x2 = x.childNodes[i]) & !!(y2 = y.childNodes[i++])
      if !x2.isEqualNode y2
        return BuildTest.firstDiff x2, y2
    return [x2, y2]

  runTest: (post) ->
    BuildTest.postsRemaining++
    $.cache "//a.4cdn.org/#{post.board.ID}/thread/#{post.thread.ID}.json", ->
      {posts} = @response
      Build.spoilerRange[post.board.ID] = posts[0].custom_spoiler
      for postData in posts
        if postData.no is post.ID
          root = Build.postFromObject postData, post.board.ID
          post2 = new Post root, post.thread, post.board
          x = post.normalizedOriginal
          y = post2.normalizedOriginal
          if x.isEqualNode y
            c.log "#{post.fullID} correct"
          else
            c.log "#{post.fullID} differs"
            BuildTest.postsFailed++
            [x2, y2] = BuildTest.firstDiff x, y
            c.log x2
            c.log y2
            c.log x.outerHTML
            c.log y.outerHTML
          BuildTest.postsRemaining--
          BuildTest.report() if BuildTest.postsRemaining is 0
          post2.isFetchedQuote = true
          Main.callbackNodes Post, [post2]

  postsRemaining: 0
  postsFailed: 0

  report: ->
    if BuildTest.postsFailed
      new Notice 'warning', "#{BuildTest.postsFailed} post(s) differ", 30
    else
      new Notice 'success', 'All correct', 5
    BuildTest.postsFailed = 0

  testOne: ->
    BuildTest.runTest g.posts[@dataset.fullID]
    Menu.menu.close()

  testAll: ->
    g.posts.forEach (post) ->
      unless post.isClone or post.isFetchedQuote or $ '.abbr', post.nodes.comment
        BuildTest.runTest post
    Header.menu.close()
<% } %>
