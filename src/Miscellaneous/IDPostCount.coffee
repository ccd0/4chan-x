IDPostCount =
  init: ->
    return unless g.VIEW is 'thread' and Conf['Count Posts by ID']
    Callbacks.Thread.push
      name: 'Count Posts by ID'
      cb:   -> IDPostCount.thread = @
    Callbacks.Post.push
      name: 'Count Posts by ID'
      cb:   @node

  node: ->
    if @nodes.uniqueID and @thread is IDPostCount.thread
      $.on $('span.hand', @nodes.uniqueID), 'mouseover', IDPostCount.count

  count: ->
    {uniqueID} = Get.postFromNode(@).info
    n = 0
    IDPostCount.thread.posts.forEach (post) ->
      n++ if post.info.uniqueID is uniqueID
    @title = "#{n} post#{if n is 1 then '' else 's'} by this ID"

return IDPostCount
