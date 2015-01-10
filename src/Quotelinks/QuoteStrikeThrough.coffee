QuoteStrikeThrough =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and 
      (Conf['Post Hiding'] or Conf['Post Hiding Link'] or Conf['Filter'])

    Post.callbacks.push
      name: 'Strike-through Quotes'
      cb:   @node

  node: ->
    return if @isClone
    for quotelink in @nodes.quotelinks
      {boardID, postID} = Get.postDataFromLink quotelink
      if g.posts["#{boardID}.#{postID}"]?.isHidden
        $.addClass quotelink, 'filtered'
    return
