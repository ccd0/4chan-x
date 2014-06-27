BuildTest =
  init: ->
    return if !Conf['Menu']

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

  runTest: (post) ->
    $.cache "//a.4cdn.org/#{post.board.ID}/thread/#{post.thread.ID}.json", ->
      for postData in @response.posts
        if postData.no is post.ID
          root = Build.postFromObject postData, post.board.ID
          post2 = new Post root, post.thread, post.board
          if post.normalizedOriginal.isEqualNode post2.normalizedOriginal
            c.log "#{post.fullID} correct"
          else
            c.log "#{post.fullID} differs"
            html = post.normalizedOriginal.innerHTML
            html2 = post2.normalizedOriginal.innerHTML
            if html is html2
              c.log post.normalizedOriginal.outerHTML
              c.log post2.normalizedOriginal.outerHTML
            else
              i = 0
              while i < html.length and i < html2.length
                break unless html[i] is html2[i]
                i++
              c.log html[i..i+80]
              c.log html2[i..i+80]
              c.log html
              c.log html2
          post2.isFetchedQuote = true
          Main.callbackNodes Post, [post2]

  testOne: ->
    BuildTest.runTest g.posts[@dataset.fullID]

  testAll: ->
    g.posts.forEach (post) ->
      unless post.isClone or post.isFetchedQuote or $ '.abbr', post.nodes.comment
        BuildTest.runTest post
