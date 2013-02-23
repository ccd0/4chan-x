ExpandThread =
  init: ->
    for span in $$ '.summary'
      a = $.el 'a',
        textContent: "+ #{span.textContent}"
        className: 'summary desktop'
        href: 'javascript:;'
      $.on a, 'click', -> ExpandThread.toggle @parentNode
      $.replace span, a
    return

  toggle: (thread) ->
    url = "//api.4chan.org/#{g.BOARD}/res/#{thread.id[1..]}.json"
    a   = $ '.summary', thread

    switch a.textContent[0]
      when '+'
        a.textContent = a.textContent.replace '+', 'Å~ Loading...'
        $.cache url, -> ExpandThread.parse @, thread, a

      when 'X'
        a.textContent = a.textContent.replace 'Å~ Loading...', '+'
        $.cache.requests[url].abort()

      when '-'
        a.textContent = a.textContent.replace '-', '+'
        #goddamit moot
        num = switch g.BOARD
          when 'b', 'vg', 'q' then 3
          when 't' then 1
          else 5
        replies = $$ '.replyContainer', thread
        replies.splice replies.length - num, num
        for reply in replies
          $.rm reply
    return

  parse: (req, thread, a) ->
    if (status = req.status) isnt 200
      a.textContent = "#{status} #{req.statusText}"
      $.off a, 'click', ExpandThread.cb.toggle
      return

    a.textContent = a.textContent.replace 'Å~ Loading...', '-'

    posts = JSON.parse(req.response).posts
    if spoilerRange = posts[0].custom_spoiler
      Build.spoilerRange[g.BOARD] = spoilerRange

    replies  = posts[1..]
    threadID = thread.id[1..]
    nodes    = []
    for reply in replies
      post = Build.postFromObject reply, g.BOARD
      id   = reply.no
      link = $ 'a[title="Highlight this post"]', post
      link.href = "res/#{threadID}#p#{id}"
      link.nextSibling.href = "res/#{threadID}#q#{id}"
      nodes.push post

    # Eat everything, then replace with fresh full posts
    for post in $$ '.summary ~ .replyContainer', a.parentNode
      $.rm post

    for backlink in $$ '.backlink', a.previousElementSibling
      # Keep backlinks from other threads.
      $.rm backlink unless $.id backlink.hash[1..]
    
    # Parse posts and add features.
    posts = []
    for node in nodes
      posts.push Main.preParse node
    Main.node posts

    $.after a, nodes