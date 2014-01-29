Recursive =
  recursives: {}
  init: ->
    Post.callbacks.push
      name: 'Recursive'
      cb:   @node

  node: ->
    return if @isClone
    for quote in @quotes
      if obj = Recursive.recursives[quote]
        for recursive, i in obj.recursives
          recursive @, obj.args[i]...
    return

  add: (recursive, post, args...) ->
    obj = Recursive.recursives[post.fullID] or=
      recursives: []
      args: []
    obj.recursives.push recursive
    obj.args.push args

  rm: (recursive, post) ->
    return unless obj = Recursive.recursives[post.fullID]
    for rec, i in obj.recursives
      if rec is recursive
        obj.recursives.splice i, 1
        obj.args.splice i, 1
    return

  apply: (recursive, post, args...) ->
    {fullID} = post
    for ID, post of g.posts
      if fullID in post.quotes
        recursive post, args...
    return
