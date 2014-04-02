QR.captcha =
  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return unless @isEnabled = !!$.id 'captchaContainer'

    imgContainer = $.el 'div',
      className: 'captcha-img'
      title: 'Reload reCAPTCHA'
      innerHTML: '<img>'
    input = $.el 'input',
      className: 'captcha-input field'
      title: 'Verification'
      autocomplete: 'off'
      spellcheck: false
    @nodes =
      img:   imgContainer.firstChild
      input: input

    <% if (type === 'userscript') { %>
    # XXX Firefox lacks focusin/focusout support.
    $.on input, 'blur',  QR.focusout
    $.on input, 'focus', QR.focusin
    <% } %>

    $.addClass QR.nodes.el, 'has-captcha'
    $.after QR.nodes.com.parentNode, [imgContainer, input]

    @beforeSetup()
    @afterSetup() # reCAPTCHA might have loaded before the QR.
  beforeSetup: ->
    {img, input} = @nodes
    img.parentNode.hidden = true
    input.value = ''
    input.placeholder = 'Focus to load reCAPTCHA'
    $.on input, 'focus', @setup
    @setupObserver = new MutationObserver @afterSetup
    @setupObserver.observe $.id('captchaContainer'), childList: true
  setup: ->
    $.globalEval 'loadRecaptcha()'
  afterSetup: ->
    return unless challenge = $.id 'recaptcha_challenge_field_holder'
    QR.captcha.setupObserver.disconnect()
    delete QR.captcha.setupObserver

    {img, input} = QR.captcha.nodes
    img.parentNode.hidden = false
    input.placeholder = 'Verification'
    $.off input,         'focus',   QR.captcha.setup
    $.on input,          'keydown', QR.captcha.keydown.bind QR.captcha
    $.on img.parentNode, 'click',   QR.captcha.reload.bind  QR.captcha

    QR.captcha.nodes.challenge = challenge
    new MutationObserver(QR.captcha.load.bind QR.captcha).observe challenge,
      childList: true
      subtree: true
      attributes: true
    QR.captcha.load()
  destroy: ->
    $.globalEval 'Recaptcha.destroy()'
    @beforeSetup()
  getOne: ->
    challenge = @nodes.img.alt
    response  = @nodes.input.value.trim()
    if response and !/\s/.test response
      # one-word-captcha:
      # If there's only one word, duplicate it.
      response = "#{response} #{response}"
    {challenge, response}
  load: ->
    return unless @nodes.challenge.firstChild
    # -1 minute to give upload some time.
    challenge = @nodes.challenge.firstChild.value
    @nodes.img.alt = challenge
    @nodes.img.src = "//www.google.com/recaptcha/api/image?c=#{challenge}"
    @nodes.input.value = null
  reload: (focus) ->
    # the 't' argument prevents the input from being focused
    $.globalEval 'Recaptcha.reload("t")'
    # Focus if we meant to.
    @nodes.input.focus() if focus
  keydown: (e) ->
    if e.keyCode is 8 and not @nodes.input.value
      @reload()
    else
      return
    e.preventDefault()
