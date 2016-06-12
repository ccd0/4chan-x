QuotePreview =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Quote Previewing']

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    Callbacks.Post.push
      name: 'Quote Previewing'
      cb:   @node

  node: ->
    for link in @nodes.quotelinks.concat [@nodes.backlinks...], @nodes.archivelinks
      $.on link, 'mouseover', QuotePreview.mouseover
    return

  mouseover: (e) ->
    return if $.hasClass(@, 'inlined') or !d.contains(@)

    {boardID, threadID, postID} = Get.postDataFromLink @

    qp = $.el 'div',
      id: 'qp'
      className: 'dialog'

    $.add Header.hover, qp
    new Fetcher boardID, threadID, postID, qp, Get.postFromNode(@)

    UI.hover
      root: @
      el: qp
      latestEvent: e
      endEvents: 'mouseout click'
      cb: QuotePreview.mouseout

    if Conf['Quote Highlighting'] and (origin = g.posts["#{boardID}.#{postID}"])
      posts = [origin].concat origin.clones
      # Remove the clone that's in the qp from the array.
      posts.pop()
      for post in posts
        $.addClass post.nodes.post, 'qphl'
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
