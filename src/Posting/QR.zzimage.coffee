QRImagePatch =
  updateNotice: (post, message, type) ->
    notice = post._imageNotice
    if !notice
      post._imageNotice = notice = new Notice(type or 'info', message)
      return notice
    notice.setType(type) if type
    if notice.el?.lastElementChild
      notice.el.lastElementChild.textContent = ''
      $.add notice.el.lastElementChild, $.tn(message)
    notice

  closeNotice: (post) ->
    if post._imageNotice
      post._imageNotice.close()
      delete post._imageNotice

  isImageFile: (file) ->
    return false unless file
    return true if /^image\//i.test(file.type or '')
    /\.(jpe?g|png|gif|webp|bmp|avif|heic|heif)$/i.test(file.name or '')

  isSupportedType: (type) ->
    type in ['image/jpeg', 'image/png', 'image/gif']

  normalizeExtension: (value) ->
    ext = (value or '').toLowerCase().trim().replace(/^\./, '')
    ext = 'jpg' if ext is 'jpeg'
    ext

  targetFormat: ->
    ext = QRImagePatch.normalizeExtension(Conf['processedImageExtension'])
    # Backward compatibility for existing configs from prior PNG toggle builds.
    if !Conf['processedImageExtension'] and Conf['Use PNG for Processed Images']
      ext = 'png'
    type = $.getOwn(QR.typeFromExtension, ext)
    if !type or !/^image\//.test(type) or type not in QR.mimeTypes or !QRImagePatch.isSupportedType(type)
      type = 'image/jpeg'
    ext = $.getOwn(QR.extensionFromType, type) or 'jpg'
    {type, ext}

  replaceExtension: (name, ext) ->
    base = (name or 'image').replace(/\.[^.\/\\]+$/, '')
    "#{base}.#{ext}"

  drawScaled: (img, maxWidth, maxHeight) ->
    width = img.naturalWidth or img.width
    height = img.naturalHeight or img.height
    ratio = Math.min(maxWidth / width, maxHeight / height, 1)
    outWidth = Math.max(1, Math.floor(width * ratio))
    outHeight = Math.max(1, Math.floor(height * ratio))
    cv = $.el 'canvas'
    cv.width = outWidth
    cv.height = outHeight
    cv.getContext('2d').drawImage img, 0, 0, outWidth, outHeight
    {canvas: cv, width, height, outWidth, outHeight}

  downscaleCanvas: (canvas, scale) ->
    next = $.el 'canvas'
    next.width = Math.max(1, Math.floor(canvas.width * scale))
    next.height = Math.max(1, Math.floor(canvas.height * scale))
    next.getContext('2d').drawImage canvas, 0, 0, next.width, next.height
    next

  encodeCanvas: (canvas, type, maxSize, cb) ->
    qualities = if type is 'image/jpeg' then [0.92, 0.82, 0.72, 0.62, 0.52] else [null]

    encode = (currentCanvas, qualityIndex = 0, downscalePass = 0) ->
      quality = qualities[qualityIndex]
      currentCanvas.toBlob ((blob) ->
        return cb(null) unless blob
        if blob.size <= maxSize
          cb(blob)
          return
        if qualityIndex < qualities.length - 1
          encode(currentCanvas, qualityIndex + 1, downscalePass)
          return
        if downscalePass < 3 and currentCanvas.width > 1 and currentCanvas.height > 1
          targetScale = Math.sqrt(maxSize / Math.max(blob.size, maxSize + 1)) * 0.98
          scale = if targetScale >= 0.99 then 0.85 else Math.max(0.5, targetScale)
          encode(QRImagePatch.downscaleCanvas(currentCanvas, scale), 0, downscalePass + 1)
          return
        cb(blob)
      ), type, quality

    encode(canvas)

  processImage: (post, file, done) ->
    format = QRImagePatch.targetFormat()
    targetType = format.type
    maxSize = QR.max_size
    maxWidth = QR.max_width
    maxHeight = QR.max_height
    url = URL.createObjectURL(file)
    img = $.el 'img'

    cleanup = ->
      URL.revokeObjectURL(url)
      img.onload = null
      img.onerror = null

    img.onerror = ->
      cleanup()
      done(new Error('Could not read image for processing.'))

    img.onload = ->
      try
        supported = QRImagePatch.isSupportedType(file.type)
        {canvas, width, height, outWidth, outHeight} = QRImagePatch.drawScaled(img, maxWidth, maxHeight)
        needsResize = outWidth < width or outHeight < height
        needsConvert = !supported
        needsReencodeForSize = file.size > maxSize

        if file.type is 'image/gif' and !needsConvert and !needsResize and !needsReencodeForSize
          cleanup()
          done(null, null)
          return

        if !needsResize and !needsConvert and !needsReencodeForSize
          cleanup()
          done(null, null)
          return

        QRImagePatch.encodeCanvas canvas, targetType, maxSize, (blob) ->
          cleanup()
          unless blob
            done(new Error('Could not encode processed image.'))
            return
          outFile = new File([blob], QRImagePatch.replaceExtension(file.name, format.ext), {type: targetType})
          QRImagePatch.updateNotice(post, 'Image converted.', 'success')
          done(null, outFile)
      catch err
        cleanup()
        done(err)

    img.src = url

do ->
  proto = QR.post and QR.post.prototype
  return unless proto

  origSetFile = proto.setFile
  origRm = proto.rm
  origDelete = proto.delete
  origRmFile = proto.rmFile
  origSubmit = QR.submit

  proto.cancelImageProcessing = (message, silent) ->
    if @_imageProcessing and @_imageProcessing.stop
      @_imageProcessing.cancelled = true
      @_imageProcessing.stop()
      delete @_imageProcessing
    if !@_videoProcessing
      delete @_pendingFile
    unless @file or @_videoProcessing
      $.rmClass @nodes.el, 'has-file'
      @nodes.el.removeAttribute 'title'
      @nodes.span.textContent = @com or ''
    QRImagePatch.closeNotice(@)
    if !silent and message
      QR.notifications.push(new Notice('info', message, 4))

  proto.setFile = (file) ->
    post = @
    post._imageTaskID = (post._imageTaskID or 0) + 1
    taskID = post._imageTaskID
    post.cancelImageProcessing(null, true)

    unless Conf['Auto-process Images'] and QRImagePatch.isImageFile(file)
      return origSetFile.call(post, file)

    post.filename = file.name
    post._pendingFile = true
    $.addClass post.nodes.el, 'has-file'
    post.nodes.el.title = file.name
    post.nodes.span.textContent = file.name
    QR.updatePreviewStrip?()

    QRImagePatch.updateNotice(post, 'Processing image...', 'info')
    post._imageProcessing =
      stop: ->
        QRImagePatch.closeNotice(post)
      cancelled: false

    QRImagePatch.processImage post, file, (err, outFile) ->
      return unless post._imageTaskID is taskID
      delete post._imageProcessing
      unless post._videoProcessing
        delete post._pendingFile
      if err
        QRImagePatch.closeNotice(post)
        unless post.file
          $.rmClass post.nodes.el, 'has-file'
        post.fileError(err.message or String(err))
        return
      if outFile
        setTimeout((-> QRImagePatch.closeNotice(post)), 1000)
        origSetFile.call(post, outFile)
      else
        QRImagePatch.closeNotice(post)
        origSetFile.call(post, file)

  proto.rm = ->
    @cancelImageProcessing(null, true)
    origRm.apply(@, arguments)

  proto.delete = ->
    @cancelImageProcessing(null, true)
    origDelete.apply(@, arguments)

  proto.rmFile = ->
    @cancelImageProcessing(null, true)
    origRmFile.apply(@, arguments)

  QR.submit = (e) ->
    if QR.selected and QR.selected._imageProcessing
      e?.preventDefault?()
      QR.selected.cancelImageProcessing('Image processing canceled.')
      return
    origSubmit.call(QR, e)
