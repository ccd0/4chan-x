MarkNewIPs =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Mark New IPs']
    Thread.callbacks.push
      name: 'Mark New IPs'
      cb:   @node

  node: ->
    MarkNewIPs.ipCount = @ipCount
    MarkNewIPs.postIDs = @posts.keys.map (x) -> +x
    $.on d, 'ThreadUpdate', MarkNewIPs.onUpdate

  onUpdate: (e) ->
    {ipCount, newPosts} = e.detail
    {postIDs} = ThreadUpdater
    return unless ipCount?
    if newPosts.length
      obj = {}
      obj[x] = true for x in MarkNewIPs.postIDs
      added = 0
      added++ for x in postIDs when not (x of obj)
      removed = MarkNewIPs.postIDs.length + added - postIDs.length
      switch ipCount - MarkNewIPs.ipCount
        when added
          i = MarkNewIPs.ipCount
          for fullID in newPosts
            MarkNewIPs.mark g.posts[fullID], ++i
        when -removed
          for fullID in newPosts
            $.addClass g.posts[fullID].nodes.root, 'old-ip'
    MarkNewIPs.ipCount = ipCount
    MarkNewIPs.postIDs = postIDs

  mark: (post, ipCount) ->
    suffix = switch ipCount
      when 1 then 'st'
      when 2 then 'nd'
      when 3 then 'rd'
      else 'th'
    counter = $.el 'span',
      className: 'ip-counter'
      textContent: "(#{ipCount})"
      title: "This is the #{ipCount}#{suffix} IP in the thread."
    nameBlock = $ '.nameBlock', post.nodes.info
    $.add nameBlock, [$.tn(' '), counter]
    $.addClass post.nodes.root, 'new-ip'
