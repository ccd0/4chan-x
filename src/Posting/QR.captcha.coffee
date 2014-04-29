QR.captcha =
  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return unless @isEnabled = !!$.id 'captchaContainer'

    $.globalEval 'loadRecaptcha()' if Conf['Auto-load captcha']

    imgContainer = $.el 'div',
      className: 'captcha-img'
      title: 'Reload reCAPTCHA'
      innerHTML: '<img>'
    input = $.el 'input',
      className: 'captcha-input field'
      title: 'Verification'
      autocomplete: 'off'
      spellcheck: false
      tabIndex: 45
    @nodes =
      img:       imgContainer.firstChild
      input:     input

    $.on input, 'blur',  QR.focusout
    $.on input, 'focus', QR.focusin
    $.on input, 'keydown', QR.captcha.keydown.bind QR.captcha
    $.on @nodes.img.parentNode, 'click', QR.captcha.reload.bind QR.captcha

    $.addClass QR.nodes.el, 'has-captcha'
    $.after QR.nodes.com.parentNode, [imgContainer, input]

    @captchas = []
    $.get 'captchas', [], ({captchas}) ->
      QR.captcha.sync captchas
      QR.captcha.clear()
    $.sync 'captchas', @sync

    @beforeSetup()
    @afterSetup() # reCAPTCHA might have loaded before the QR.
  beforeSetup: ->
    {img, input} = @nodes
    img.parentNode.hidden = true
    input.value = ''
    input.placeholder = 'Focus to load reCAPTCHA'
    @count()
    $.on input, 'focus', @setup
    @setupObserver = new MutationObserver @afterSetup
    @setupObserver.observe $.id('captchaContainer'), childList: true
  setup: ->
    $.globalEval 'loadRecaptcha()'
  afterSetup: ->
    return unless challenge = $.id 'recaptcha_challenge_field_holder'
    QR.captcha.setupObserver.disconnect()
    delete QR.captcha.setupObserver

    setLifetime = (e) -> QR.captcha.lifetime = e.detail
    $.on window, 'captcha:timeout', setLifetime
    $.globalEval 'window.dispatchEvent(new CustomEvent("captcha:timeout", {detail: RecaptchaState.timeout}))'
    $.off window, 'captcha:timeout', setLifetime

    {img, input} = QR.captcha.nodes
    img.parentNode.hidden = false
    input.placeholder = 'Verification'
    QR.captcha.count()
    $.off input, 'focus', QR.captcha.setup

    QR.captcha.nodes.challenge = challenge
    new MutationObserver(QR.captcha.load.bind QR.captcha).observe challenge,
      childList: true
      subtree: true
      attributes: true
    QR.captcha.load()
  destroy: ->
    $.globalEval 'Recaptcha.destroy()'
    @beforeSetup()

  sync: (captchas) ->
    QR.captcha.captchas = captchas
    QR.captcha.count()

  getOne: ->
    @clear()
    if captcha = @captchas.shift()
      {challenge, response} = captcha
      @count()
      $.set 'captchas', @captchas
    else
      challenge   = @nodes.img.alt
      if response = @nodes.input.value
        if Conf['Auto-load captcha'] then @reload() else @destroy()
    if response
      response = response.trim()
      # one-word-captcha:
      # If there's only one word, duplicate it.
      response = "#{response} #{response}" unless /\s/.test response
    {challenge, response}

  save: ->
    return unless response = @nodes.input.value.trim()
    @nodes.input.value = ''
    @captchas.push
      challenge: @nodes.img.alt
      response:  response
      timeout:   @timeout
    @count()
    @reload()
    $.set 'captchas', @captchas

  clear: ->
    return unless @captchas.length
    now = Date.now()
    for captcha, i in @captchas
      break if captcha.timeout > now
    return unless i
    @captchas = @captchas[i..]
    @count()
    $.set 'captchas', @captchas

  load: ->
    return unless @nodes.challenge.firstChild
    return unless challenge_image = $.id 'recaptcha_challenge_image'
    # -1 minute to give upload some time.
    @timeout  = Date.now() + @lifetime * $.SECOND - $.MINUTE
    challenge = @nodes.challenge.firstChild.value
    @nodes.img.alt = challenge
    @nodes.img.src = challenge_image.src
    @nodes.input.value = null
    @clear()

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

  reload: (focus) ->
    # Hack to prevent the input from being focused
    $.globalEval 'Recaptcha.reload(); Recaptcha.should_focus = false;'
    # Focus if we meant to.
    @nodes.input.focus() if focus

  keydown: (e) ->
    if e.keyCode is 8 and not @nodes.input.value
      @reload()
    else if e.keyCode is 13 and e.shiftKey
      @save()
    else
      return
    e.preventDefault()
