QR.captcha =
  lifetime: 120 * $.SECOND
  iframeURL: '//www.google.com/recaptcha/api/fallback?k=<%= meta.recaptchaKey %>'

  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return unless @isEnabled = !!$.id 'g-recaptcha'

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
    $.on @nodes.container, 'click', @reload.bind(@, true)

    @conn = new Connection null, "#{location.protocol}//www.google.com",
      challenge: @load.bind @
      token:     @save.bind @
      error:     @error.bind @

    $.addClass QR.nodes.el, 'has-captcha'
    $.after QR.nodes.com.parentNode, [container, input]

    @captchas = []
    $.get 'captchas', [], ({captchas}) ->
      QR.captcha.sync captchas
      QR.captcha.clear()
    $.sync 'captchas', @sync

    @beforeSetup()
    @setup() if Conf['Auto-load captcha']

  initFrame: ->
    conn = new Connection window.top, "#{location.protocol}//boards.4chan.org",
      queryChallenge: ->
        conn.send {challenge}
      response: (response) ->
        $.id('response').value = response
        $('.fbc-challenge > form').submit()
    challenge = $('.fbc-payload > img')?.src
    token     = $('.fbc-verification-token > textarea')?.value
    error     = $('.fbc-error')?.textContent
    conn.send {challenge, token, error}

  cb:
    focus: -> QR.captcha.setup()

  beforeSetup: ->
    {container, input} = @nodes
    container.hidden = true
    input.value = ''
    input.placeholder = 'Focus to load reCAPTCHA'
    @count()
    $.on input, 'focus', @cb.focus

  setup: ->
    if !@nodes.iframe
      @nodes.iframe = $.el 'iframe',
        id: 'qr-captcha-iframe'
        src: @iframeURL
      delete @iframeUsed
      $.add d.body, @nodes.iframe
      @conn.target = @nodes.iframe.contentWindow
    else if @iframeUsed or !@nodes.img
      @nodes.iframe.src = @iframeURL
      delete @iframeUsed
    else if !@nodes.img.complete
      @conn.send queryChallenge: null

  afterSetup: ->
    {container, input} = @nodes
    container.hidden = false
    input.placeholder = 'Verification'
    @count()
    $.off input, 'focus', @cb.focus

    if QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight
      QR.nodes.el.style.top    = null
      QR.nodes.el.style.bottom = '0px'

  destroy: ->
    $.rm @nodes.img
    delete @nodes.img
    $.rm @nodes.iframe
    delete @nodes.iframe
    @beforeSetup()

  sync: (captchas=[]) ->
    QR.captcha.captchas = captchas
    QR.captcha.count()

  getOne: ->
    @clear()
    if captcha = @captchas.shift()
      @count()
      $.set 'captchas', @captchas
      captcha.response
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
      @iframeUsed = true

  save: (token) ->
    @nodes.input.value = ''
    if @submitCB
      @submitCB token
      delete @submitCB
      if Conf['Auto-load captcha'] then @reload() else @destroy()
    else
      $.forceSync 'captchas'
      @captchas.push
        response: token
        timeout:  @timeout
      @count()
      $.set 'captchas', @captchas
      @reload()

  error: (message) ->
    @nodes.input.value = ''
    QR.error "CAPTCHA Error: #{message}"
    if @submitCB
      @submitCB()
      delete @submitCB

  clear: ->
    return unless @captchas.length
    $.forceSync 'captchas'
    now = Date.now()
    for captcha, i in @captchas
      break if captcha.timeout > now
    return unless i
    @captchas = @captchas[i..]
    @count()
    $.set 'captchas', @captchas

  load: (src) ->
    {container, input, img} = @nodes
    @timeout = Date.now() + @lifetime
    unless img
      img = @nodes.img = new Image
      $.one img, 'load', @afterSetup.bind @
      $.add container, img
    img.src = src
    input.value = ''
    @clear()
    setTimeout @reload.bind(@), @lifetime

  count: ->
    count = if @captchas then @captchas.length else 0
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
    clearTimeout @timeout
    if @captchas.length
      @timeout = setTimeout @clear.bind(@), @captchas[0].timeout - Date.now()

  reload: (focus) ->
    @nodes.iframe.src = @iframeURL
    delete @iframeUsed
    @nodes.input.focus() if focus

  keydown: (e) ->
    if e.keyCode is 8 and not @nodes.input.value
      @reload()
    else if e.keyCode is 13 and e.shiftKey
      @sendResponse()
    else
      return
    e.preventDefault()
