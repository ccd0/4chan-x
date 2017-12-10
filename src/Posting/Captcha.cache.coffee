Captcha.cache =
  init: ->
    $.get 'captchas', [], ({captchas}) =>
      @sync captchas
      @clear()
    $.sync 'captchas', @sync.bind(@)
    $.on d, 'SaveCaptcha', (e) =>
      @save e.detail

  captchas: []

  getCount: ->
    @captchas.length

  needed: ->
    captchaCount = @captchas.length
    captchaCount++ if QR.req
    postsCount = QR.posts.length
    postsCount = 0 if postsCount is 1 and !Conf['Auto-load captcha'] and !QR.posts[0].com and !QR.posts[0].file
    captchaCount < postsCount

  sync: (captchas=[]) ->
    captchas = [] unless captchas instanceof Array
    @captchas = captchas
    @count()

  getOne: (isReply) ->
    @clear()
    i = @captchas.findIndex((x) -> isReply or !x.challenge?)
    if i >= 0
      captcha = @captchas.splice(i, 1)[0]
      $.set 'captchas', @captchas
      @count()
      captcha
    else
      null

  save: (captcha) ->
    $.forceSync 'captchas'
    @captchas.push captcha
    @captchas.sort (a, b) -> a.timeout - b.timeout
    $.set 'captchas', @captchas
    @count()

  clear: ->
    $.forceSync 'captchas'
    if @captchas.length
      now = Date.now()
      for captcha, i in @captchas
        break if captcha.timeout > now
      if i
        @captchas = @captchas[i..]
        $.set 'captchas', @captchas
        @count()

  count: ->
    clearTimeout @timer
    if @captchas.length
      @timer = setTimeout @clear.bind(@), @captchas[0].timeout - Date.now()
    $.event 'CaptchaCount', @captchas.length
