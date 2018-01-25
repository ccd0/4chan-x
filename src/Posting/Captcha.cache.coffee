Captcha.cache =
  init: ->
    $.on d, 'SaveCaptcha', (e) =>
      @save e.detail

  captchas: []

  getCount: ->
    @captchas.length

  needed: ->
    not (
      /\b_ct=/.test(d.cookie) or @captchas.length or QR.req
    ) and (
      QR.posts.length > 1 or Conf['Auto-load captcha'] or QR.posts[0].com or QR.posts[0].file
    )

  getOne: (isReply) ->
    @clear()
    i = @captchas.findIndex((x) -> isReply or !x.challenge?)
    if i >= 0
      captcha = @captchas.splice(i, 1)[0]
      @count()
      captcha
    else
      null

  save: (captcha) ->
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
