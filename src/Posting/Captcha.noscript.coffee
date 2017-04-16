Captcha.noscript =
  lifetime: 30 * $.MINUTE

  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return if not (@isEnabled = !!$ '#g-recaptcha, #captchaContainerAlt')

    container = $.el 'div',
      className: 'captcha-img'
      title: 'Reload reCAPTCHA'

    input = $.el 'input',
      className: 'captcha-input field'
      title: 'Verification'
      autocomplete: 'off'
      spellcheck: false
    @nodes = {container, input}

    $.on input, 'blur',  QR.focusout
    $.on input, 'focus', QR.focusin
    $.on input, 'keydown', @keydown.bind @
    # Disable auto-posting if you're typing the captcha during the last 5 seconds of the cooldown.
    $.on input, 'input', -> QR.posts[0].preventAutoPost() unless Captcha.cache.getCount()
    $.on @nodes.container, 'click', =>
      @reload()
      @nodes.input.focus()

    @conn = new Connection null, 'https://www.google.com',
      challenge: @load.bind @
      token:     @save.bind @
      error:     @error.bind @

    $.addClass QR.nodes.el, 'has-captcha', 'captcha-v1', 'noscript-captcha'
    $.after QR.nodes.com.parentNode, [container, input]

    Captcha.cache.init()
    $.on d, 'CaptchaCount', @count.bind(@)

    @beforeSetup()
    @setup()

  initFrame: ->
    conn = new Connection window.parent, 'https://boards.4chan.org',
      response: (response) ->
        $.id('recaptcha_response_field').value = response
        # The form has a field named 'submit'
        HTMLFormElement.prototype.submit.call $('form')
    if location.hash is '#response'
      conn.send
        token: $('textarea')?.value
        error: $('.recaptcha_input_area')?.textContent.replace(/:$/, '')
    return unless img = $ 'img'
    $('form').action = '#response'
    cb = ->
      canvas = $.el 'canvas'
      canvas.width  = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      conn.send {challenge: canvas.toDataURL()}
    if img.complete
      cb()
    else
      $.on img, 'load', cb

  timers: {}

  iframeURL: ->
    url = 'https://www.google.com/recaptcha/api/noscript?k=<%= meta.recaptchaKey %>'
    if lang = Conf['captchaLanguage'].trim()
      url += "&hl=#{encodeURIComponent lang}"
    url

  cb:
    focus: -> QR.captcha.setup false, true

  beforeSetup: ->
    {container, input} = @nodes
    container.hidden = true
    input.value = ''
    input.placeholder = 'Focus to load reCAPTCHA'
    @count()
    $.on input, 'focus click', @cb.focus

  moreNeeded: ->

  setup: (focus, force) ->
    return unless @isEnabled and (force or Captcha.cache.needed())
    if !@nodes.iframe
      @nodes.iframe = $.el 'iframe',
        id: 'qr-captcha-iframe'
        src: @iframeURL()
      $.add QR.nodes.el, @nodes.iframe
      @conn.target = @nodes.iframe
    else if !@occupied or force
      @nodes.iframe.src = @iframeURL()
    @occupied = true
    @nodes.input.focus() if focus

  afterSetup: ->
    {container, input} = @nodes
    container.hidden = false
    input.placeholder = 'Verification'
    @count()
    $.off input, 'focus click', @cb.focus

    if QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight
      QR.nodes.el.style.top    = ''
      QR.nodes.el.style.bottom = '0px'

  destroy: ->
    return unless @isEnabled
    $.rm @nodes.img
    delete @nodes.img
    $.rm @nodes.iframe
    delete @nodes.iframe
    delete @occupied
    @beforeSetup()

  getOne: (isReply) ->
    if (captcha = Captcha.cache.getOne isReply)
      captcha
    else if /\S/.test @nodes.input.value
      (cb) =>
        @submitCB = cb
        @sendResponse()
    else
      null

  sendResponse: ->
    response = @nodes.input.value
    if /\S/.test response
      @conn.send {response}

  save: (token) ->
    delete @occupied
    @nodes.input.value = ''
    captcha =
      challenge: token
      response:  'manual_challenge'
      timeout:   @timeout
    if @submitCB
      @submitCB captcha
      delete @submitCB
      if Captcha.cache.needed() then @reload() else @destroy()
    else
      Captcha.cache.save captcha
      @reload()

  error: (message) ->
    @occupied = true
    @nodes.input.value = ''
    if @submitCB
      @submitCB()
      delete @submitCB
    QR.error "Captcha Error: #{message}"

  load: (src) ->
    {container, input, img} = @nodes
    @occupied = true
    @timeout = Date.now() + @lifetime
    unless img
      img = @nodes.img = new Image()
      $.one img, 'load', @afterSetup.bind @
      $.on img, 'load', -> @hidden = false
      $.add container, img
    img.src = src
    input.value = ''
    clearTimeout @timers.expire
    @timers.expire = setTimeout @expire.bind(@), @lifetime

  count: ->
    count = Captcha.cache.getCount()
    placeholder = @nodes.input.placeholder.replace /\ \(.*\)$/, ''
    placeholder += switch count
      when 0
        if placeholder is 'Verification' then ' (Shift + Enter to cache)' else ''
      when 1
        ' (1 cached captcha)'
      else
        " (#{count} cached captchas)"
    @nodes.input.placeholder = placeholder
    @nodes.input.alt = count # For XTRM RICE.

  expire: ->
    return unless @nodes.iframe
    if not d.hidden and (Captcha.cache.needed() or d.activeElement is @nodes.input)
      @reload()
    else
      @destroy()

  reload: ->
    @nodes.iframe.src = @iframeURL()
    @occupied = true
    @nodes.img?.hidden = true

  keydown: (e) ->
    if e.keyCode is 8 and not @nodes.input.value
      if @nodes.iframe then @reload() else @setup()
    else if e.keyCode is 13 and e.shiftKey
      @sendResponse()
    else
      return
    e.preventDefault()
