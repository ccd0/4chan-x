QuoteStrikeThrough =
  init: ->
    return if g.VIEW not in ['index', 'thread'] or !Conf['Reply Hiding Buttons'] and !(Conf['Menu'] and Conf['Reply Hiding Link']) and !Conf['Filter']

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
