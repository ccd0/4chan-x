ExpandThread =
  init: ->
    return if g.VIEW isnt 'index' or !Conf['Thread Expansion']

    Thread::callbacks.push
      name: 'Thread Expansion'
      cb:   @node
  node: ->
    return unless span = $.x 'following-sibling::span[contains(@class,"summary")][1]', @OP.nodes.root
    a = $.el 'a',
      textContent: "+ #{span.textContent}"
      className: 'summary'
      href: 'javascript:;'
    $.on a, 'click', ExpandThread.cbToggle
    $.replace span, a

  cbToggle: ->
    ExpandThread.toggle Get.threadFromRoot @parentNode

  toggle: (thread) ->
    threadRoot = thread.OP.nodes.root.parentNode
    a = $ '.summary', threadRoot

    switch thread.isExpanded
      when false, undefined
        for post in $$ '.thread > .postContainer', threadRoot
          ExpandComment.expand Get.postFromRoot post
        unless a
          thread.isExpanded = true
          return
        thread.isExpanded = 'loading'
        a.textContent = a.textContent.replace '+', '× Loading...'
        $.cache "//api.4chan.org/#{thread.board}/res/#{thread}.json", ->
          ExpandThread.parse @, thread, a

      when 'loading'
        thread.isExpanded = false
        return unless a
        a.textContent = a.textContent.replace '× Loading...', '+'

      when true
        thread.isExpanded = false
        #goddamit moot
        num = if thread.isSticky
          1
        else switch g.BOARD.ID
          # XXX boards config
          when 'b', 'vg', 'q' then 3
          when 't' then 1
          else 5
        posts = $$ ".thread > .replyContainer", threadRoot
        for post in [thread.OP.nodes.root].concat posts[-num..]
          ExpandComment.contract Get.postFromRoot post
        return unless a
        a.textContent = a.textContent.replace '-', '+'
        for reply in posts[...-num]
          if Conf['Quote Inlining']
            # rm clones
            inlined.click() while inlined = $ '.inlined', reply
          $.rm reply
    return

  parse: (req, thread, a) ->
    return if a.textContent[0] is '+'
    if req.status not in [200, 304]
      a.textContent = "Error #{req.statusText} (#{req.status})"
      $.off a, 'click', ExpandThread.cbToggle
      return

    thread.isExpanded = true
    a.textContent = a.textContent.replace '× Loading...', '-'

    {posts} = JSON.parse req.response
    if spoilerRange = posts.shift().custom_spoiler
      Build.spoilerRange[thread.board] = spoilerRange

    postsObj  = []
    postsRoot = []
    for post in posts
      if post = thread.posts[post.no]
        postsRoot.push post.nodes.root
        continue
      root = Build.postFromObject post, thread.board.ID
      post = new Post root, thread, thread.board
      link = $ 'a[title="Highlight this post"]', root
      link.href = "res/#{thread}#p#{post}"
      link.nextSibling.href = "res/#{thread}#q#{post}"
      postsObj.push  post
      postsRoot.push root
    Main.callbackNodes Post, postsObj
    $.after a, postsRoot

    # Enable 4chan features.
    if Conf['Enable 4chan\'s Extension']
      $.globalEval "Parser.parseThread(#{thread.ID}, 1, #{postsRoot.length})"
    else
      Fourchan.parseThread thread.ID, 1, postsRoot.length
