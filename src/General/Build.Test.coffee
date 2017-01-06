<% if (readJSON('/.tests_enabled')) { %>
Build.Test =
  init: ->
    return if !Conf['Menu'] or g.VIEW not in ['index', 'thread']

    a = $.el 'a',
      textContent: 'Test HTML building'
    $.on a, 'click', @cb.testOne
    Menu.menu.addEntry
      el: a
      open: (post) ->
        a.dataset.fullID = post.fullID
        true

    a2 = $.el 'a',
      textContent: 'Test HTML building'
    $.on a2, 'click', @cb.testAll
    Header.menu.addEntry
      el: a2

  normalize: (root) ->
    root2 = root.cloneNode true
    for el in $$ '.mobile', root2
      $.rm el
    for el in $$ 'a[href]', root2
      href = el.href
      href = href.replace /(^\w+:\/\/boards.4chan.org\/[^\/]+\/thread\/\d+)\/.*/, '$1'
      el.setAttribute 'href', href
    ImageHost.fixLinks $$('.fileText > a, a.fileThumb', root2)
    for el in $$ 'img[src]', root2
      el.src = el.src.replace /(spoiler-\w+)\d(\.png)$/, '$11$2'
    for el in $$ 'pre.prettyprinted', root2
      nodes = $.X './/br|.//wbr|.//text()', el
      i = 0
      nodes = (node while (node = nodes.snapshotItem i++))
      $.rmAll el
      $.add el, nodes
      el.normalize()
      $.rmClass el, 'prettyprinted'
    for el in $$ 'pre[style=""]', root2
      el.removeAttribute 'style'
    textNodes = $.X './/text()', root2
    i = 0
    while (node = textNodes.snapshotItem i++)
      node.data = node.data.replace /\ +/g, ' '
      # XXX https://a.4cdn.org/sci/thread/5942502.json, https://a.4cdn.org/news/thread/6.json, https://a.4cdn.org/wsg/thread/957536.json
      node.data = node.data.replace /^\n+/g, '' if node.previousSibling?.nodeName is 'BR'
      node.data = node.data.replace /\n+$/g, '' if node.nextSibling?.nodeName is 'BR'
      $.rm node if node.data is ''
    root2

  firstDiff: (x, y) ->
    x2 = x.cloneNode false
    y2 = y.cloneNode false
    return [x2, y2] unless x2.isEqualNode y2
    i = 0
    while true
      x2 = x.childNodes[i]
      y2 = y.childNodes[i]
      return [x2, y2] unless x2 and y2
      return Build.Test.firstDiff(x2, y2) unless x2.isEqualNode y2
      i++

  testOne: (post) ->
    Build.Test.postsRemaining++
    $.cache "//a.4cdn.org/#{post.board.ID}/thread/#{post.thread.ID}.json", ->
      {posts} = @response
      Build.spoilerRange[post.board.ID] = posts[0].custom_spoiler
      for postData in posts
        if postData.no is post.ID
          t1 = new Date().getTime()
          obj = Build.parseJSON postData, post.board.ID
          root = Build.post obj
          t2 = new Date().getTime()
          Build.Test.time += t2 - t1
          post2 = new Post root, post.thread, post.board, 'forBuildTest'
          fail = false

          x = post.normalizedOriginal
          y = post2.normalizedOriginal
          unless x.isEqualNode y
            fail = true
            c.log "#{post.fullID} differs"
            [x2, y2] = Build.Test.firstDiff x, y
            c.log x2
            c.log y2
            c.log x.outerHTML
            c.log y.outerHTML

          for key of Config.filter when not (key is 'MD5' and post.board.ID is 'f')
            val1 = Filter[key] obj
            val2 = Filter[key] post2
            if val1 isnt val2
              fail = true
              c.log "#{post.fullID} has filter bug in #{key}"
              c.log val1
              c.log val2

          if fail
            Build.Test.postsFailed++
          else
            c.log "#{post.fullID} correct"
          Build.Test.postsRemaining--
          Build.Test.report() if Build.Test.postsRemaining is 0
      return

  testAll: ->
    g.posts.forEach (post) ->
      unless post.isClone or post.isFetchedQuote
        if not ((abbr = $ '.abbr', post.nodes.comment) and /Comment too long\./.test(abbr.textContent))
          Build.Test.testOne post
    return

  postsRemaining: 0
  postsFailed: 0
  time: 0

  report: ->
    if Build.Test.postsFailed
      new Notice 'warning', "#{Build.Test.postsFailed} post(s) differ (#{Build.Test.time} ms)", 30
    else
      new Notice 'success', "All correct (#{Build.Test.time} ms)", 5
    Build.Test.postsFailed = Build.Test.time = 0

  cb:
    testOne: ->
      Build.Test.testOne g.posts[@dataset.fullID]
      Menu.menu.close()

    testAll: ->
      Build.Test.testAll()
      Header.menu.close()
<% } %>
