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
    return if file.isExpanding or file.isExpanded
    file.isHovered = true
    if el = file.fullImage
      el.id = 'ihover'
      TrashQueue.remove el
      $.queueTask(-> el.src = el.src) if /\.gif$/.test el.src
      el.currentTime = 0 if isVideo and el.readyState >= el.HAVE_METADATA
    else
      file.fullImage = el = $.el (if isVideo then 'video' else 'img'),
        className: 'full-image'
        id: 'ihover'
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
        if isVideo
          el.pause()
          TrashQueue.add el, post
        el.removeAttribute 'id'
        $.queueTask -> delete file.isHovered
  error: ->
    post = Get.postFromNode @
    return if post.file.isExpanding or post.file.isExpanded
    if @id is 'ihover' # still hovering
      return if ImageCommon.decodeError @, post
      ImageCommon.error @, post, 3 * $.SECOND, (URL) =>
        if URL
          @src = URL + if @src is URL then '?' + Date.now() else ''
        else
          $.rm @
          delete post.file.fullImage
    else
      $.rm @
      delete post.file.fullImage
