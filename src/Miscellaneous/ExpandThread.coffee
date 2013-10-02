ExpandThread =
  init: ->
    return if g.VIEW isnt 'index' or !Conf['Thread Expansion']

    Thread.callbacks.push
      name: 'Thread Expansion'
      cb:   @node
  node: ->
    return unless span = $.x 'following-sibling::span[contains(@class,"summary")][1]', @OP.nodes.root
    [posts, files] = span.textContent.match /\d+/g
    a = $.el 'a',
      textContent: ExpandThread.text '+', posts, files
      className: 'summary'
      href: 'javascript:;'
    $.on a, 'click', ExpandThread.cbToggle
    $.replace span, a

  text: (status, posts, files) ->
    text = [status]
    text.push "#{posts} post#{if posts > 1 then 's' else ''}"
    text.push "and #{files} image repl#{if files > 1 then 'ies' else 'y'}" if +files
    text.push if status is '-' then 'shown' else 'omitted'
    text.join(' ') + '.'

  cbToggle: ->
    ExpandThread.toggle Get.threadFromNode @

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
        [posts, files] = a.textContent.match /\d+/g
        a.textContent  = ExpandThread.text '...', posts, files
        $.cache "//api.4chan.org/#{thread.board}/res/#{thread}.json", ->
          ExpandThread.parse @, thread, a

      when 'loading'
        thread.isExpanded = false
        return unless a
        [posts, files] = a.textContent.match /\d+/g
        a.textContent  = ExpandThread.text '+', posts, files

      when true
        thread.isExpanded = false
        #goddamit moot
        num = if thread.isSticky
          1
        else switch g.BOARD.ID
          # XXX boards config
          when 'b', 'vg' then 3
          when 't' then 1
          else 5
        posts = $$ ".thread > .replyContainer", threadRoot
        for post in [thread.OP.nodes.root].concat posts[-num..]
          ExpandComment.contract Get.postFromRoot post
        return unless a
        postsCount = 0
        filesCount = 0
        for reply in posts[...-num]
          if Conf['Quote Inlining']
            # rm clones
            inlined.click() while inlined = $ '.inlined', reply
          postsCount++
          filesCount++ if 'file' of Get.postFromRoot reply
          $.rm reply
        a.textContent = ExpandThread.text '+', postsCount, filesCount
    return

  parse: (req, thread, a) ->
    return if a.textContent[0] is '+'
    if req.status not in [200, 304]
      a.textContent = "Error #{req.statusText} (#{req.status})"
      $.off a, 'click', ExpandThread.cbToggle
      return

    thread.isExpanded = true

    {posts} = JSON.parse req.response
    if spoilerRange = posts.shift().custom_spoiler
      Build.spoilerRange[thread.board] = spoilerRange

    postsObj   = []
    postsRoot  = []
    filesCount = 0
    for reply in posts
      if post = thread.posts[reply.no]
        filesCount++ if 'file' of post
        postsRoot.push post.nodes.root
        continue
      root = Build.postFromObject reply, thread.board.ID
      post = new Post root, thread, thread.board
      link = $ 'a[title="Highlight this post"]', root
      link.href = "res/#{thread}#p#{post}"
      link.nextSibling.href = "res/#{thread}#q#{post}"
      filesCount++ if 'file' of post
      postsObj.push  post
      postsRoot.push root
    Main.callbackNodes Post, postsObj
    $.after a, postsRoot

    postsCount = postsRoot.length
    a.textContent = ExpandThread.text '-', postsCount, filesCount

    # Enable 4chan features.
    if Conf['Enable 4chan\'s Extension']
      $.globalEval "Parser.parseThread(#{thread.ID}, 1, #{postsCount})"
    else
      Fourchan.parseThread thread.ID, 1, postsCount
