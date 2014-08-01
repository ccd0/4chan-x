ImageCommon =
  decodeError: (file, post) ->
    return false unless file.error?.code is MediaError.MEDIA_ERR_DECODE
    unless message = $ '.warning', post.file.thumb.parentNode
      message = $.el 'div', className:   'warning'
      $.after post.file.thumb, message
    message.textContent = 'Error: Corrupt or unplayable video'
    return true

  error: (file, post, retryDelay, cb) ->
    return cb null unless file.src.split('/')[2] is 'i.4cdn.org'

    parts = post.file.URL.split '/'
    archiveURL = Redirect.to 'file',
      boardID:  post.board.ID
      filename: parts[parts.length - 1]
    unless archiveURL and (/^https:\/\//.test(archiveURL) or location.protocol is 'http:')
      archiveURL = null

    return cb archiveURL if post.isDead or post.file.isDead

    if retryDelay
      timeoutID = setTimeout (-> cb post.file.URL + '?' + Date.now()), retryDelay

    kill = (fileOnly) ->
      clearTimeout timeoutID if retryDelay
      if archiveURL
        cb archiveURL
      else
        post.kill fileOnly
        cb null

    <% if (type === 'crx') { %>
    $.ajax post.file.URL,
      onloadend: ->
        return if @status isnt 404
        kill true
    ,
      type: 'head'
    <% } else { %>
    # XXX CORS for i.4cdn.org WHEN?
    $.ajax "//a.4cdn.org/#{post.board}/thread/#{post.thread}.json", onload: ->
      return kill() if @status is 404
      return if @status isnt 200
      for postObj in @response.posts
        break if postObj.no is post.ID
      if postObj.no isnt post.ID
        kill()
      else if postObj.filedeleted
        kill true
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
