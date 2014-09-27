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
    return unless doc.contains @
    post = Get.postFromNode @
    {file} = post
    {isVideo} = file
    return if file.isExpanding or file.isExpanded
    file.isHovered = true
    if ImageCommon.cache?.dataset.fullID is post.fullID
      el = ImageCommon.cache
      delete ImageCommon.cache
      $.queueTask(-> el.src = el.src) if /\.gif$/.test el.src
      el.currentTime = 0 if isVideo and el.readyState >= el.HAVE_METADATA
    else
      el = $.el (if isVideo then 'video' else 'img')
      el.dataset.fullID = post.fullID
      $.on el, 'error', ImageHover.error
      el.src = file.URL
    el.id = 'ihover'
    $.after Header.hover, el
    if isVideo
      el.loop     = true
      el.controls = false
      el.play() if Conf['Autoplay']
    [width, height] = file.dimensions.split('x').map (x) -> +x
    {left, right} = @getBoundingClientRect()
    padding = 16
    maxWidth = Math.max left, doc.clientWidth - right
    maxHeight = doc.clientHeight - padding
    scale = Math.min 1, maxWidth / width, maxHeight / height
    el.style.maxWidth = "#{scale * width}px"
    el.style.maxHeight = "#{scale * height}px"
    UI.hover
      root: @
      el: el
      latestEvent: e
      endEvents: 'mouseout click'
      asapTest: -> true
      height: scale * height + padding
      noRemove: true
      cb: ->
        if isVideo
          el.pause()
        $.rm el
        el.removeAttribute 'id'
        el.removeAttribute 'style'
        ImageCommon.cache = el
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
    else
      $.rm @
