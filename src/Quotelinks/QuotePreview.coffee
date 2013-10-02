QuotePreview =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Quote Previewing']

    Post.callbacks.push
      name: 'Quote Previewing'
      cb:   @node
  node: ->
    for link in @nodes.quotelinks.concat [@nodes.backlinks...]
      $.on link, 'mouseover', QuotePreview.mouseover
    return
  mouseover: (e) ->
    return if $.hasClass @, 'inlined'

    {boardID, threadID, postID} = Get.postDataFromLink @

    qp = $.el 'div',
      id: 'qp'
      className: 'dialog'
    $.add d.body, qp
    Get.postClone boardID, threadID, postID, qp, Get.contextFromNode @

    UI.hover
      root: @
      el: qp
      latestEvent: e
      endEvents: 'mouseout click'
      cb: QuotePreview.mouseout
      asapTest: -> qp.firstElementChild

    return unless origin = g.posts["#{boardID}.#{postID}"]

    if Conf['Quote Highlighting']
      posts = [origin].concat origin.clones
      # Remove the clone that's in the qp from the array.
      posts.pop()
      for post in posts
        $.addClass post.nodes.post, 'qphl'

    quoterID = $.x('ancestor::*[@id][1]', @).id.match(/\d+$/)[0]
    clone = Get.postFromRoot qp.firstChild
    for quote in clone.nodes.quotelinks.concat [clone.nodes.backlinks...]
      if quote.hash[2..] is quoterID
        $.addClass quote, 'forwardlink'
    return
  mouseout: ->
    # Stop if it only contains text.
    return unless root = @el.firstElementChild

    clone = Get.postFromRoot root
    post  = clone.origin
    post.rmClone root.dataset.clone

    return unless Conf['Quote Highlighting']
    for post in [post].concat post.clones
      $.rmClass post.nodes.post, 'qphl'
    return
