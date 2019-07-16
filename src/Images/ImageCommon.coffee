ImageCommon =
  # Pause and mute video in preparation for removing the element from the document.
  pause: (video) ->
    return unless video.nodeName is 'VIDEO'
    video.pause()
    $.off video, 'volumechange', Volume.change
    video.muted = true

  rewind: (el) ->
    if el.nodeName is 'VIDEO'
      el.currentTime = 0 if el.readyState >= el.HAVE_METADATA
    else if /\.gif$/.test el.src
      $.queueTask -> el.src = el.src

  pushCache: (el) ->
    ImageCommon.cache = el
    $.on el, 'error', ImageCommon.cacheError

  popCache: ->
    el = ImageCommon.cache
    $.off el, 'error', ImageCommon.cacheError
    delete ImageCommon.cache
    el

  cacheError: ->
    delete ImageCommon.cache if ImageCommon.cache is @

  decodeError: (file, fileObj) ->
    return false unless file.error?.code is MediaError.MEDIA_ERR_DECODE
    if not (message = $ '.warning', fileObj.thumb.parentNode)
      message = $.el 'div', className:   'warning'
      $.after fileObj.thumb, message
    message.textContent = 'Error: Corrupt or unplayable video'
    return true

  isFromArchive: (file) ->
    g.SITE.software is 'yotsuba' and !ImageHost.test(file.src.split('/')[2])

  error: (file, post, fileObj, delay, cb) ->
    src = fileObj.url.split '/'
    url = null
    if g.SITE.software is 'yotsuba' and Conf['404 Redirect']
      url = Redirect.to 'file', {
        boardID:  post.board.ID
        filename: src[src.length - 1]
      }
    url = null unless url and Redirect.securityCheck(url)

    return cb url if (post.isDead or fileObj.isDead) and not ImageCommon.isFromArchive(file)

    timeoutID = setTimeout (-> cb url), delay if delay?
    return if post.isDead or fileObj.isDead
    redirect = ->
      unless ImageCommon.isFromArchive file
        clearTimeout timeoutID if delay?
        cb url

    threadJSON = g.SITE.urls.threadJSON?(post)
    return unless threadJSON
    $.ajax threadJSON, onloadend: ->
      post.kill !post.isClone if @status is 404
      return redirect() if @status isnt 200
      for postObj in @response.posts
        break if postObj.no is post.ID
      if postObj.no isnt post.ID
        post.kill()
        redirect()
      else if fileObj.docIndex in g.SITE.Build.parseJSON(postObj, post.board).filesDeleted
        post.kill true
        redirect()
      else
        url = fileObj.url

  # Add controls, but not until the mouse is moved over the video.
  addControls: (video) ->
    handler = ->
      $.off video, 'mouseover', handler
      # Hacky workaround for Firefox forever-loading bug for very short videos
      t = new Date().getTime()
      $.asap (-> $.engine isnt 'gecko' or (video.readyState >= 3 and video.currentTime <= Math.max 0.1, (video.duration - 0.5)) or new Date().getTime() >= t + 1000), ->
        video.controls = true
    $.on video, 'mouseover', handler

  # XXX Estimate whether clicks are on the video controls and should be ignored.
  onControls: (e) ->
    (Conf['Show Controls'] and Conf['Click Passthrough'] and e.target.nodeName is 'VIDEO') or
      (e.target.controls and e.target.getBoundingClientRect().bottom - e.clientY < 35)

  download: (e) ->
    return true if @protocol is 'blob:'
    e.preventDefault()
    {href, download} = @
    CrossOrigin.file href, (blob) ->
      if blob
        a = $.el 'a',
          href: URL.createObjectURL(blob)
          download: download
          hidden: true
        $.add d.body, a
        a.click()
        $.rm a
      else
        new Notice 'warning', "Could not download #{href}", 20
