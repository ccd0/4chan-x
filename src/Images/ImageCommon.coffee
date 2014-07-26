ImageCommon =
  error: (file, post, redirect, reload) ->
    if file.error and file.error.code isnt file.error.MEDIA_ERR_NETWORK # video
      error = switch file.error.code
        when 1 then 'MEDIA_ERR_ABORTED'
        when 3 then 'MEDIA_ERR_DECODE'
        when 4 then 'MEDIA_ERR_SRC_NOT_SUPPORTED'
        when 5 then 'MEDIA_ERR_ENCRYPTED'
      unless message = $ '.warning', post.file.thumb.parentNode
        message = $.el 'div', className: 'warning'
        $.after post.file.thumb, message
      message.textContent = "Playback error: #{error}"
      return

    src = file.src.split '/'
    if src[2] is 'i.4cdn.org'
      URL = Redirect.to 'file',
        boardID:  src[3]
        filename: src[src.length - 1].replace /\?.+$/, ''
      if URL and (/^https:\/\//.test(URL) or location.protocol is 'http:')
        return redirect URL
      if g.DEAD or post.isDead or post.file.isDead
        return

    timeoutID = reload?()
    <% if (type === 'crx') { %>
    $.ajax post.file.URL,
      onloadend: ->
        return if @status isnt 404
        clearTimeout timeoutID
        post.kill true
    ,
      type: 'head'
    <% } else { %>
    # XXX CORS for i.4cdn.org WHEN?
    $.ajax "//a.4cdn.org/#{post.board}/thread/#{post.thread}.json", onload: ->
      return if @status isnt 200
      for postObj in @response.posts
        break if postObj.no is post.ID
      if postObj.no isnt post.ID
        clearTimeout timeoutID
        post.kill()
      else if postObj.filedeleted
        clearTimeout timeoutID
        post.kill true
    <% } %>
