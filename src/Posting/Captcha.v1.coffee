Captcha.v1 =
  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return unless @isEnabled = !!$.id 'g-recaptcha'

    script = $.el 'script',
      src: '//www.google.com/recaptcha/api/js/recaptcha_ajax.js'
    $.add d.head, script
    captchaContainer = $.el 'div',
      id: 'captchaContainer'
      hidden: true
    $.add d.body, captchaContainer

    imgContainer = $.el 'div',
      className: 'captcha-img'
      title: 'Reload reCAPTCHA'
    $.extend imgContainer, <%= html('<img>') %>
    input = $.el 'input',
      className: 'captcha-input field'
      title: 'Verification'
      autocomplete: 'off'
      spellcheck: false
    @nodes =
      img:       imgContainer.firstChild
      input:     input

    $.on input, 'blur',  QR.focusout
    $.on input, 'focus', QR.focusin
    $.on input, 'keydown', QR.captcha.keydown.bind QR.captcha
    $.on @nodes.img.parentNode, 'click', QR.captcha.reload.bind QR.captcha

    $.addClass QR.nodes.el, 'has-captcha', 'captcha-v1'
    $.after QR.nodes.com.parentNode, [imgContainer, input]

    @captchas = []
    $.get 'captchas', [], ({captchas}) ->
      QR.captcha.sync captchas
      QR.captcha.clear()
    $.sync 'captchas', @sync

    new MutationObserver(@afterSetup).observe $.id('captchaContainer'), childList: true

    @beforeSetup()
    @setup() if Conf['Auto-load captcha']

  cb:
    focus: -> QR.captcha.setup false, true

  beforeSetup: ->
    {img, input} = @nodes
    img.parentNode.hidden = true
    input.value = ''
    input.placeholder = 'Focus to load reCAPTCHA'
    @count()
    $.on input, 'focus click', @cb.focus

  needed: ->
    captchaCount = @captchas.length
    captchaCount++ if QR.req
    postsCount = QR.posts.length
    postsCount = 0 if postsCount is 1 and !Conf['Auto-load captcha'] and !QR.posts[0].com and !QR.posts[0].file
    captchaCount < postsCount

  onNewPost: ->

  onPostChange: ->

  setup: (focus, force) ->
    return unless @isEnabled and (@needed() or force)
    $.globalEval '''
      (function() {
        var captchaContainer = document.getElementById("captchaContainer");
        if (captchaContainer.firstChild) return;
        function setup() {
          if (window.Recaptcha) {
            Recaptcha.create(recaptchaKey, captchaContainer, {theme: "clean"});
          } else {
            setTimeout(setup, 25);
          }
        }
        setup();
      })()
    '''
    @nodes.input.focus() if focus

  afterSetup: ->
    return unless challenge = $.id 'recaptcha_challenge_field_holder'
    return if challenge is QR.captcha.nodes.challenge

    setLifetime = (e) -> QR.captcha.lifetime = e.detail
    $.on window, 'captcha:timeout', setLifetime
    $.globalEval 'window.dispatchEvent(new CustomEvent("captcha:timeout", {detail: RecaptchaState.timeout}))'
    $.off window, 'captcha:timeout', setLifetime

    {img, input} = QR.captcha.nodes
    img.parentNode.hidden = false
    input.placeholder = 'Verification'
    QR.captcha.count()
    $.off input, 'focus click', QR.captcha.cb.focus

    QR.captcha.nodes.challenge = challenge
    new MutationObserver(QR.captcha.load.bind QR.captcha).observe challenge,
      childList: true
      subtree: true
      attributes: true
    QR.captcha.load()

    if QR.nodes.el.getBoundingClientRect().bottom > doc.clientHeight
      QR.nodes.el.style.top    = null
      QR.nodes.el.style.bottom = '0px'

  destroy: ->
    return unless @isEnabled
    $.globalEval 'Recaptcha.destroy()'
    @beforeSetup()

  sync: (captchas=[]) ->
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
      if /\S/.test(response = @nodes.input.value)
        @destroy()
      else
        return null
    {challenge, response}

  save: ->
    return unless /\S/.test(response = @nodes.input.value)
    @nodes.input.value = ''
    @captchas.push
      challenge: @nodes.img.alt
      response:  response
      timeout:   @timeout
    @count()
    @destroy()
    @setup false, true
    $.set 'captchas', @captchas

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
