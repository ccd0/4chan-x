ImageHover =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Image Hover']

    Post.callbacks.push
      name: 'Image Hover'
      cb:   @node
  node: ->
    return unless @file?.isImage or @file?.isVideo
    $.on @file.thumb, 'mouseover', ImageHover.mouseover
  mouseover: (e) ->
    post = Get.postFromNode @
    {file} = post
    {isVideo} = file
    if el = file.fullImage
      el.id = 'ihover'
      TrashQueue.remove el
    else
      file.fullImage = el = $.el (if isVideo then 'video' else 'img'),
        className: 'full-image'
        id: 'ihover'
      el.dataset.fullID = post.fullID
      $.on el, 'error', ImageHover.error
      el.src = file.URL
      $.after file.thumb, el
    if isVideo
      el.loop     = true
      el.controls = false
      el.play() if Conf['Autoplay']
    UI.hover
      root: @
      el: el
      latestEvent: e
      endEvents: 'mouseout click'
      asapTest: -> (if isVideo then el.readyState >= el.HAVE_CURRENT_DATA else el.naturalHeight)
      noRemove: true
      cb: ->
        $.off el, 'error', ImageHover.error
        if isVideo
          el.pause()
          TrashQueue.add el, post
        el.removeAttribute 'id'
  error: ->
    return unless doc.contains @
    post = g.posts[@dataset.fullID]
    return if ImageCommon.decodeError @, post
    ImageCommon.error post, 3 * $.SECOND, ->
      @src = URL if URL
