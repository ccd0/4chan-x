BuildTest =
  init: ->
    return if !Conf['Menu']

    a = $.el 'a',
      textContent: 'Test HTML building'

    $.on a, 'click', @runTest

    $.event 'AddMenuEntry',
      type: 'post'
      el: a
      open: (post) ->
        a.dataset.fullID = post.fullID

  runTest: ->
    post = g.posts[@dataset.fullID]
    c.log post.originalHTML
    $.cache "//a.4cdn.org/#{post.board.ID}/thread/#{post.thread.ID}.json", ->
      for postData in @response.posts
        if postData.no is post.ID
          root = Build.postFromObject postData, post.board.ID
          post2 = new Post root, post.thread, post.board
          c.log post2.originalHTML

