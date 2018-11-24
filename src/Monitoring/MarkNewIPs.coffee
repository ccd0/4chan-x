MarkNewIPs =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Mark New IPs']
    Callbacks.Thread.push
      name: 'Mark New IPs'
      cb:   @node

  node: ->
    MarkNewIPs.ipCount = @ipCount
    MarkNewIPs.postCount = @posts.keys.length
    $.on d, 'ThreadUpdate', MarkNewIPs.onUpdate

  onUpdate: (e) ->
    {ipCount, postCount, newPosts, deletedPosts} = e.detail
    return unless ipCount?

    switch ipCount - MarkNewIPs.ipCount
      when postCount - MarkNewIPs.postCount + deletedPosts.length
        i = MarkNewIPs.ipCount
        for fullID in newPosts
          MarkNewIPs.markNew g.posts[fullID], ++i
      when -deletedPosts.length
        for fullID in newPosts
          MarkNewIPs.markOld g.posts[fullID]
    MarkNewIPs.ipCount = ipCount
    MarkNewIPs.postCount = postCount

  markNew: (post, ipCount) ->
    suffix = if (ipCount // 10) % 10 is 1
      'th'
    else
      ['st', 'nd', 'rd'][ipCount % 10 - 1] or 'th' # fuck switches
    counter = $.el 'span',
      className: 'ip-counter'
      textContent: "(#{ipCount})"
    post.nodes.nameBlock.title = "This is the #{ipCount}#{suffix} IP in the thread."
    $.add post.nodes.nameBlock, [$.tn(' '), counter]
    $.addClass post.nodes.root, 'new-ip'

  markOld: (post) ->
    post.nodes.nameBlock.title = 'Not the first post from this IP.'
    $.addClass post.nodes.root, 'old-ip'
