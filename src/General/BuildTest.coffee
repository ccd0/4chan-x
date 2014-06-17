BuildTest =
  init: ->
    return if !Conf['Menu']

    a = $.el 'a',
      textContent: 'Test HTML building'
    $.on a, 'click', @testOne
    $.event 'AddMenuEntry',
      type: 'post'
      el: a
      open: (post) ->
        a.dataset.fullID = post.fullID
        true

    a2 = $.el 'a',
      textContent: 'Test HTML building'
    $.on a2, 'click', @testAll
    $.event 'AddMenuEntry',
      type: 'header'
      el: a2

  runTest: (post) ->
    $.cache "//a.4cdn.org/#{post.board.ID}/thread/#{post.thread.ID}.json", ->
      for postData in @response.posts
        if postData.no is post.ID
          root = Build.postFromObject postData, post.board.ID
          post2 = new Post root, post.thread, post.board
          if post.normalizedHTML is post2.normalizedHTML
            c.log "#{post.fullID} correct"
          else
            c.log "#{post.fullID} differs"
            i = 0
            while i < post.normalizedHTML.length and i < post2.normalizedHTML.length
              break unless post.normalizedHTML[i] is post2.normalizedHTML[i]
              i++
            c.log post.normalizedHTML[i..i+80]
            c.log post2.normalizedHTML[i..i+80]
            c.log post.normalizedHTML
            c.log post2.normalizedHTML
          post2.isFetchedQuote = true
          Main.callbackNodes Post, [post2]

  testOne: ->
    BuildTest.runTest g.posts[@dataset.fullID]

  testAll: ->
    g.posts.forEach (post) ->
      unless post.isClone or post.isFetchedQuote
        BuildTest.runTest post
