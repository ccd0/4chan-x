ImageHover =
  init: ->
    return if g.VIEW not in ['index', 'thread']
    if Conf['Image Hover']
      Callbacks.Post.push
        name: 'Image Hover'
        cb:   @node
    if Conf['Image Hover in Catalog']
      Callbacks.CatalogThread.push
        name: 'Image Hover'
        cb:   @catalogNode

  node: ->
    for file in @files when (file.isImage or file.isVideo) and file.thumb
      $.on file.thumb, 'mouseover', ImageHover.mouseover(@, file)

  catalogNode: ->
    file = @thread.OP.files[0]
    return unless file and (file.isImage or file.isVideo)
    $.on @nodes.thumb, 'mouseover', ImageHover.mouseover(@thread.OP, file)

  mouseover: (post, file) -> (e) ->
    return unless doc.contains @
    {isVideo} = file
    return if file.isExpanding or file.isExpanded or g.SITE.isThumbExpanded?(file)
    error = ImageHover.error post, file
    if ImageCommon.cache?.dataset.fileID is "#{post.fullID}.#{file.index}"
      el = ImageCommon.popCache()
      $.on el, 'error', error
    else
      el = $.el (if isVideo then 'video' else 'img')
      el.dataset.fileID = "#{post.fullID}.#{file.index}"
      $.on el, 'error', error
      el.src = file.url

    if Conf['Restart when Opened']
      ImageCommon.rewind el
      ImageCommon.rewind @
    el.id = 'ihover'
    $.add Header.hover, el
    if isVideo
      el.loop     = true
      el.controls = false
      Volume.setup el
      if Conf['Autoplay']
        el.play()
        @currentTime = el.currentTime if @nodeName is 'VIDEO'
    if file.dimensions
      [width, height] = (+x for x in file.dimensions.split 'x')
      maxWidth = doc.clientWidth
      maxHeight = doc.clientHeight - UI.hover.padding
      scale = Math.min 1, maxWidth / width, maxHeight / height
      width *= scale
      height *= scale
      el.style.maxWidth  = "#{width}px"
      el.style.maxHeight = "#{height}px"
    UI.hover
      root: @
      el: el
      latestEvent: e
      endEvents: 'mouseout click'
      height: height
      width: width
      noRemove: true
      cb: ->
        $.off el, 'error', error
        ImageCommon.pushCache el
        ImageCommon.pause el
        $.rm el
        el.removeAttribute 'style'

  error: (post, file) -> ->
    return if ImageCommon.decodeError @, file
    ImageCommon.error @, post, file, 3 * $.SECOND, (URL) =>
      if URL
        @src = URL + if @src is URL then '?' + Date.now() else ''
      else
        $.rm @
