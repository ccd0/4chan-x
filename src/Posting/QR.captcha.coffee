QR.captcha =
  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    container = $.id 'captchaContainer'
    return unless @isEnabled = !!container

    imgContainer = $.el 'div',
      className: 'captcha-img'
      title: 'Reload reCAPTCHA'
      innerHTML: '<img>'
      hidden: true
    input = $.el 'input',
      className: 'captcha-input field'
      title: 'Verification'
      placeholder: 'Focus to load reCAPTCHA'
      autocomplete: 'off'
      spellcheck: false
    @nodes =
      img:   imgContainer.firstChild
      input: input

    $.on input, 'focus', @setup

    <% if (type === 'userscript') { %>
    # XXX Firefox lacks focusin/focusout support.
    $.on input, 'blur',  QR.focusout
    $.on input, 'focus', QR.focusin
    <% } %>

    $.addClass QR.nodes.el, 'has-captcha'
    $.after QR.nodes.com.parentNode, [imgContainer, input]

    @setupObserver = new MutationObserver @afterSetup
    @setupObserver.observe container, childList: true
    @afterSetup() # reCAPTCHA might have loaded before the QR.
  setup: ->
    $.globalEval 'loadRecaptcha()'
  afterSetup: ->
    return unless challenge = $.id 'recaptcha_challenge_field_holder'
    QR.captcha.setupObserver.disconnect()
    delete QR.captcha.setupObserver

    setLifetime = (e) -> QR.captcha.lifetime = e.detail
    $.on  window, 'captcha:timeout', setLifetime
    $.globalEval 'window.dispatchEvent(new CustomEvent("captcha:timeout", {detail: RecaptchaState.timeout}))'
    $.off window, 'captcha:timeout', setLifetime

    {img, input} = QR.captcha.nodes
    img.parentNode.hidden = false
    $.off input,         'focus',  QR.captcha.setup
    $.on input,          'keydown', QR.captcha.keydown.bind QR.captcha
    $.on img.parentNode, 'click',   QR.captcha.reload.bind  QR.captcha

    $.get 'captchas', [], ({captchas}) ->
      QR.captcha.sync captchas
    $.sync 'captchas', QR.captcha.sync

    QR.captcha.nodes.challenge = challenge
    new MutationObserver(QR.captcha.load.bind QR.captcha).observe challenge,
      childList: true
    QR.captcha.load()
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
      if response = @nodes.input.value then @reload()
    if response
      response = response.trim()
      # one-word-captcha:
      # If there's only one word, duplicate it.
      response = "#{response} #{response}" unless /\s/.test response
    {challenge, response}
  save: ->
    return unless response = @nodes.input.value.trim()
    @captchas.push
      challenge: @nodes.img.alt
      response:  response
      timeout:   @timeout
    @count()
    @reload()
    $.set 'captchas', @captchas
  clear: ->
    return unless @captchas # not loaded yet.
    now = Date.now()
    for captcha, i in @captchas
      break if captcha.timeout > now
    return unless i
    @captchas = @captchas[i..]
    @count()
    $.set 'captchas', @captchas
  load: ->
    return unless @nodes.challenge.firstChild
    # -1 minute to give upload some time.
    @timeout  = Date.now() + @lifetime * $.SECOND - $.MINUTE
    challenge = @nodes.challenge.firstChild.value
    @nodes.img.alt = challenge
    @nodes.img.src = "//www.google.com/recaptcha/api/image?c=#{challenge}"
    @nodes.input.value = null
    @clear()
  count: ->
    count = if @captchas then @captchas.length else 0
    @nodes.input.placeholder = switch count
      when 0
        'Verification (Shift + Enter to cache)'
      when 1
        'Verification (1 cached captcha)'
      else
        "Verification (#{count} cached captchas)"
    @nodes.input.alt = count # For XTRM RICE.
  reload: (focus) ->
    # the 't' argument prevents the input from being focused
    $.globalEval 'Recaptcha.reload("t")'
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
