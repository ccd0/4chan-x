QuoteStrikeThrough =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and
      (Conf['Reply Hiding Buttons'] or (Conf['Menu'] and Conf['Reply Hiding Link']) or Conf['Filter'])

    Callbacks.Post.push
      name: 'Strike-through Quotes'
      cb:   @node

  node: ->
    return if @isClone
    for quotelink in @nodes.quotelinks
      {boardID, postID} = Get.postDataFromLink quotelink
      if g.posts.get("#{boardID}.#{postID}")?.isHidden
        $.addClass quotelink, 'filtered'
    return
