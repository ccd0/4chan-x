IDHighlight =
  init: ->
    return unless g.VIEW in ['index', 'thread']

    Callbacks.Post.push
      name: 'Highlight by User ID'
      cb:   @node

  uniqueID: null

  node: ->
    $.on @nodes.uniqueIDRoot, 'click', IDHighlight.click @ if @nodes.uniqueIDRoot
    $.on @nodes.capcode,      'click', IDHighlight.click @ if @nodes.capcode
    IDHighlight.set @ unless @isClone

  set: (post) ->
    match = (post.info.uniqueID or post.info.capcode) is IDHighlight.uniqueID
    $[if match then 'addClass' else 'rmClass'] post.nodes.post, 'highlight'

  click: (post) -> ->
    uniqueID = post.info.uniqueID or post.info.capcode
    IDHighlight.uniqueID = if IDHighlight.uniqueID is uniqueID then null else uniqueID
    g.posts.forEach IDHighlight.set
