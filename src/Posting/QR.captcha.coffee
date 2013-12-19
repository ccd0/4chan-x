QR.captcha =
  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return unless @isEnabled = !!$.id 'captchaFormPart'
    $.asap (-> $.id 'recaptcha_challenge_field_holder'), @ready.bind @
  ready: ->
    setLifetime = (e) => @lifetime = e.detail
    $.on  window, 'captcha:timeout', setLifetime
    $.globalEval 'window.dispatchEvent(new CustomEvent("captcha:timeout", {detail: RecaptchaState.timeout}))'
    $.off window, 'captcha:timeout', setLifetime

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
      challenge: $.id 'recaptcha_challenge_field_holder'
      img:       imgContainer.firstChild
      input:     input

    new MutationObserver(@load.bind @).observe @nodes.challenge,
      childList: true

    $.on imgContainer, 'click',   @reload.bind @
    $.on input,        'keydown', @keydown.bind @
    $.get 'captchas', [], ({captchas}) =>
      @sync captchas
    $.sync 'captchas', @sync
    # start with an uncached captcha
    @reload()

    <% if (type === 'userscript') { %>
    # XXX Firefox lacks focusin/focusout support.
    $.on input, 'blur',  QR.focusout
    $.on input, 'focus', QR.focusin
    <% } %>

    $.addClass QR.nodes.el, 'has-captcha'
    $.after QR.nodes.com.parentNode, [imgContainer, input]
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
    count = @captchas.length
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
