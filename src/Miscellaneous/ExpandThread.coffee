ExpandThread =
  init: ->
    return if g.VIEW isnt 'index' or !Conf['Thread Expansion']

    Thread::callbacks.push
      name: 'Thread Expansion'
      cb:   @node
  node: ->
    return unless span = $ '.summary', @OP.nodes.root.parentNode
    a = $.el 'a',
      textContent: "+ #{span.textContent}"
      className: 'summary'
      href: 'javascript:;'
    $.on a, 'click', ExpandThread.cbToggle
    $.replace span, a

  cbToggle: ->
    op = Get.postFromRoot @previousElementSibling
    ExpandThread.toggle op.thread

  toggle: (thread) ->
    threadRoot = thread.OP.nodes.root.parentNode
    a = $ '.summary', threadRoot

    switch thread.isExpanded
      when false, undefined
        thread.isExpanded = 'loading'
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
        if a
          a.textContent = a.textContent.replace '-', '+'
          #goddamit moot
          num = if thread.isSticky
            1
          else switch g.BOARD.ID
            # XXX boards config
            when 'b', 'vg', 'q' then 3
            when 't' then 1
            else 5
          replies = $$('.thread > .replyContainer', threadRoot)[...-num]
          for reply in replies
            if Conf['Quote Inlining']
              # rm clones
              inlined.click() while inlined = $ '.inlined', reply
            $.rm reply
        for post in $$ '.thread > .postContainer', threadRoot
          ExpandComment.contract Get.postFromRoot post
    return

  parse: (req, thread, a) ->
    return if a.textContent[0] is '+'
    {status} = req
    if status not in [200, 304]
      a.textContent = "Error #{req.statusText} (#{status})"
      $.off a, 'click', ExpandThread.cb.toggle
      return

    thread.isExpanded = true
    a.textContent = a.textContent.replace '× Loading...', '-'

    posts = JSON.parse(req.response).posts
    if spoilerRange = posts[0].custom_spoiler
      Build.spoilerRange[g.BOARD] = spoilerRange

    replies  = posts[1..]
    posts    = []
    nodes    = []
    for reply in replies
      if post = thread.posts[reply.no]
        nodes.push post.nodes.root
        continue
      node = Build.postFromObject reply, thread.board.ID
      post = new Post node, thread, thread.board
      link = $ 'a[title="Highlight this post"]', node
      link.href = "res/#{thread}#p#{post}"
      link.nextSibling.href = "res/#{thread}#q#{post}"
      posts.push post
      nodes.push node
    Main.callbackNodes Post, posts
    $.after a, nodes

    # Enable 4chan features.
    if Conf['Enable 4chan\'s Extension']
      $.globalEval "Parser.parseThread(#{thread.ID}, 1, #{nodes.length})"
    else
      Fourchan.parseThread thread.ID, 1, nodes.length
