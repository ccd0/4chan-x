Captcha.cache =
  init: ->
    $.on d, 'SaveCaptcha', (e) =>
      @saveAPI e.detail
    $.on d, 'NoCaptcha', (e) =>
      @noCaptcha e.detail

  captchas: []

  getCount: ->
    @captchas.length

  neededRaw: ->
    not (
      @haveCookie() or @captchas.length or QR.req or @submitCB
    ) and (
      QR.posts.length > 1 or Conf['Auto-load captcha'] or /^\s*[^\s>]/m.test(QR.posts[0].com or '') or QR.posts[0].file
    )

  needed: ->
    @neededRaw() and $.event('LoadCaptcha')

  prerequest: ->
    return unless Conf['Prerequest Captcha']
    # Post count temporarily off by 1 when called from QR.post.rm, QR.close, or QR.submit
    $.queueTask =>
      if (
        !@prerequested and
        @neededRaw() and
        !$.event('LoadCaptcha') and
        !QR.captcha.occupied() and
        QR.cooldown.seconds <= 60 and
        QR.selected is QR.posts[QR.posts.length - 1] and
        /^\s*[^\s>]/m.test(QR.selected.com or '')
      )
        isReply = (QR.selected.thread isnt 'new')
        if !$.event('RequestCaptcha', {isReply})
          @prerequested = true
          @submitCB = @save.bind(@)

  haveCookie: ->
    /\b_ct=/.test(d.cookie) and QR.posts[0].thread isnt 'new'

  getOne: ->
    delete @prerequested
    @clear()
    if (captcha = @captchas.shift())
      @count()
      captcha
    else
      null

  request: (isReply) ->
    if !@submitCB
      return if $.event('RequestCaptcha', {isReply})
    (cb) => @submitCB = cb

  abort: ->
    if @submitCB
      delete @submitCB
      $.event 'AbortCaptcha'

  saveAPI: (captcha) ->
    if (cb = @submitCB)
      delete @submitCB
      cb captcha
    else
      @save captcha

  noCaptcha: (detail) ->
    if (cb = @submitCB)
      if !@haveCookie() or detail?.error
        QR.error(detail?.error or 'Failed to retrieve captcha.')
        QR.captcha.setup(d.activeElement is QR.nodes.status)
      delete @submitCB
      cb()

  save: (captcha) ->
    if (cb = @submitCB)
      @abort()
      cb captcha
      return
    @captchas.push captcha
    @captchas.sort (a, b) -> a.timeout - b.timeout
    @count()

  clear: ->
    if @captchas.length
      now = Date.now()
      for captcha, i in @captchas
        break if captcha.timeout > now
      if i
        @captchas = @captchas[i..]
        @count()

  count: ->
    clearTimeout @timer
    if @captchas.length
      @timer = setTimeout @clear.bind(@), @captchas[0].timeout - Date.now()
    $.event 'CaptchaCount', @captchas.length
