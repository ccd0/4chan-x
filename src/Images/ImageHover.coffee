ImageHover =
  init: ->
    return if g.VIEW not in ['index', 'thread']
    if Conf['Image Hover']
      Post.callbacks.push
        name: 'Image Hover'
        cb:   @node
    if Conf['Image Hover in Catalog']
      CatalogThread.callbacks.push
        name: 'Image Hover'
        cb:   @catalogNode

  node: ->
    return unless @file and (@file.isImage or @file.isVideo)
    $.on @file.thumb, 'mouseover', ImageHover.mouseover

  catalogNode: ->
    {file} = @thread.OP
    return unless file and (file.isImage or file.isVideo)
    $.on @nodes.thumb, 'mouseover', ImageHover.mouseover

  mouseover: (e) ->
    post = if $.hasClass @, 'thumb'
      g.posts[@parentNode.dataset.fullID]
    else
      Get.postFromNode @
    {file}    = post
    {isVideo} = file
    return if file.isExpanding or file.isExpanded
    error = ImageHover.error post
    if ImageCommon.cache?.dataset.fullID is post.fullID
      el = ImageCommon.popCache()
      $.on el, 'error', error
    else
      el = $.el (if isVideo then 'video' else 'img')
      el.dataset.fullID = post.fullID
      $.on el, 'error', error
      el.src = file.URL

    if Conf['Restart when Opened']
      ImageCommon.rewind el
      ImageCommon.rewind @
    el.id = 'ihover'
    $.add Header.hover, el
    if isVideo
      el.loop     = true
      el.controls = false
      el.play() if Conf['Autoplay']
    [width, height] = (+x for x in file.dimensions.split 'x')
    {left, right} = @getBoundingClientRect()
    padding = 16
    maxWidth = Math.max left, doc.clientWidth - right
    maxHeight = doc.clientHeight - 16
    scale = Math.min 1, maxWidth / width, maxHeight / height
    el.style.maxWidth  = "#{scale * width}px"
    el.style.maxHeight = "#{scale * height}px"
    el.style.width     = "#{width}px"
    el.style.height    = "#{height}px"
    UI.hover
      root: @
      el: el
      latestEvent: e
      endEvents: 'mouseout click'
      asapTest: -> true
      height: scale * height + padding
      noRemove: true
      cb: ->
        $.off el, 'error', error
        ImageCommon.pushCache el
        el.pause() if isVideo
        $.rm el
        el.removeAttribute 'style'

  error: (post) -> ->
    return if ImageCommon.decodeError @, post
    ImageCommon.error @, post, 3 * $.SECOND, (URL) =>
      if URL
        @src = URL + if @src is URL then '?' + Date.now() else ''
      else
        $.rm @