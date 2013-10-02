QuoteStrikeThrough =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Reply Hiding'] and !Conf['Reply Hiding Link'] and !Conf['Filter']

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
