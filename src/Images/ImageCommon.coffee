ImageCommon =
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

  decodeError: (file, post) ->
    return false unless file.error?.code is MediaError.MEDIA_ERR_DECODE
    unless message = $ '.warning', post.file.thumb.parentNode
      message = $.el 'div', className:   'warning'
      $.after post.file.thumb, message
    message.textContent = 'Error: Corrupt or unplayable video'
    return true

  error: (file, post, delay, cb) ->
    src = post.file.URL.split '/'
    URL = Redirect.to 'file',
      boardID:  post.board.ID
      filename: src[src.length - 1]
    unless Conf['404 Redirect'] and URL and Redirect.securityCheck URL
      URL = null

    return cb URL if (post.isDead or post.file.isDead) and file.src.split('/')[2] is 'i.4cdn.org'

    timeoutID = setTimeout (-> cb URL), delay if delay?
    return if post.isDead or post.file.isDead
    redirect = ->
      if file.src.split('/')[2] is 'i.4cdn.org'
        clearTimeout timeoutID if delay?
        cb URL

    <% if (type === 'crx') { %>
    $.ajax post.file.URL,
      onloadend: ->
        if @status is 200
          URL = post.file.URL
        else
          post.kill true if @status is 404
          redirect()
    ,
      type: 'head'
    <% } else { %>
    # XXX CORS for i.4cdn.org WHEN?
    $.ajax "//a.4cdn.org/#{post.board}/thread/#{post.thread}.json", onload: ->
      post.kill() if @status is 404
      return redirect() if @status isnt 200
      for postObj in @response.posts
        break if postObj.no is post.ID
      if postObj.no isnt post.ID
        post.kill()
        redirect()
      else if postObj.filedeleted
        post.kill true
        redirect()
      else
        URL = post.file.URL
    <% } %>

  # Add controls, but not until the mouse is moved over the video.
  addControls: (video) ->
    handler = ->
      $.off video, 'mouseover', handler
      # Hacky workaround for Firefox forever-loading bug for very short videos
      t = new Date().getTime()
      $.asap (-> chrome? or (video.readyState >= 3 and video.currentTime <= Math.max 0.1, (video.duration - 0.5)) or new Date().getTime() >= t + 1000), ->
        video.controls = true
    $.on video, 'mouseover', handler

  # XXX Estimate whether clicks are on the video controls and should be ignored.
  onControls: (e) ->
    (Conf['Show Controls'] and Conf['Click Passthrough'] and e.target.nodeName is 'VIDEO') or
      (e.target.controls and e.target.getBoundingClientRect().bottom - e.clientY < 35)

  download: (e) ->
    return true if @protocol is 'blob:'
    e.preventDefault()
    CrossOrigin.file @href, (blob) =>
      if blob
        @href = URL.createObjectURL blob
        @click()
      else
        new Notice 'error', "Could not download #{@href}", 30
