# <% if (readJSON('/.tests_enabled')) { %>
Test =
  init: ->
    return unless g.SITE.software is 'yotsuba' and g.VIEW in ['index', 'thread']

    if Conf['Menu']
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

    if Unread.posts
      testOrderLink = $.el 'a',
        textContent: 'Test Post Order'
      $.on testOrderLink, 'click', @cb.testOrder
      Header.menu.addEntry
        el: testOrderLink

    $.on d, 'keydown', @cb.keydown

  assert: (condition) ->
    unless condition()
      new Notice 'warning', "Assertion failed: #{condition}", 30

  normalize: (root) ->
    root2 = root.cloneNode true
    for el in $$ '.mobile', root2
      $.rm el
    for el in $$ 'a[href]', root2
      href = el.href
      href = href.replace /(^\w+:\/\/boards\.4chan(?:nel)?\.org\/[^\/]+\/thread\/\d+)\/.*/, '$1'
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
    # XXX https://bugzilla.mozilla.org/show_bug.cgi?id=1021289
    $('.fileInfo[data-md5]', root2)?.removeAttribute 'data-md5'
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
      return Test.firstDiff(x2, y2) unless x2.isEqualNode y2
      i++

  testOne: (post) ->
    Test.postsRemaining++
    $.cache g.SITE.urls.threadJSON({boardID: post.boardID, threadID: post.threadID}), ->
      return unless @response
      {posts} = @response
      g.SITE.Build.spoilerRange[post.board.ID] = posts[0].custom_spoiler
      for postData in posts
        if postData.no is post.ID
          t1 = new Date().getTime()
          obj = g.SITE.Build.parseJSON postData, post.board
          root = g.SITE.Build.post obj
          t2 = new Date().getTime()
          Test.time += t2 - t1
          post2 = new Post root, post.thread, post.board, {forBuildTest: true}
          fail = false

          x = post.normalizedOriginal
          y = post2.normalizedOriginal
          unless x.isEqualNode y
            fail = true
            c.log "#{post.fullID} differs"
            [x2, y2] = Test.firstDiff x, y
            c.log x2
            c.log y2
            c.log x.outerHTML
            c.log y.outerHTML

          for key of Config.filter when not key is 'General' and not (key is 'MD5' and post.board.ID is 'f')
            val1 = Filter.values key, obj
            val2 = Filter.values key, post2
            unless val1.length is val2.length and val1.every((x, i) -> x is val2[i])
              fail = true
              c.log "#{post.fullID} has filter bug in #{key}"
              c.log val1
              c.log val2

          if fail
            Test.postsFailed++
          else
            c.log "#{post.fullID} correct"
          Test.postsRemaining--
          Test.report() if Test.postsRemaining is 0
      return

  testAll: ->
    g.posts.forEach (post) ->
      unless post.isClone or post.isFetchedQuote
        if not ((abbr = $ '.abbr', post.nodes.comment) and /Comment too long\./.test(abbr.textContent))
          Test.testOne post
    return

  postsRemaining: 0
  postsFailed: 0
  time: 0

  report: ->
    if Test.postsFailed
      new Notice 'warning', "#{Test.postsFailed} post(s) differ (#{Test.time} ms)", 30
    else
      new Notice 'success', "All correct (#{Test.time} ms)", 5
    Test.postsFailed = Test.time = 0

  cb:
    testOne: ->
      Test.testOne g.posts.get(@dataset.fullID)
      Menu.menu.close()

    testAll: ->
      Test.testAll()
      Header.menu.close()

    testOrder: ->
      list1 = (x.ID for x in Unread.order.order())
      list2 = (+x.id.match(/\d*$/)[0] for x in $$ (if g.SITE.isOPContainerThread then "#{g.SITE.selectors.thread}, " else '') + g.SITE.selectors.postContainer)
      pass = do ->
        return false unless list1.length is list2.length
        for i in [0...list1.length] by 1
          return false if list1[i] isnt list2[i]
        true
      if pass
        new Notice 'success', "Orders same (#{list1.length} posts)", 5
      else
        new Notice 'warning', 'Orders differ.', 30
        c.log list1
        c.log list2

    keydown: (e) ->
      return unless Keybinds.keyCode(e) is 'v'
      return if e.target.nodeName in ['INPUT', 'TEXTAREA']
      Test.testAll()
      e.preventDefault()
      e.stopPropagation()
# <% } %>
