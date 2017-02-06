Captcha.v1 =
  blank: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='57'/>"

  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return if not (@isEnabled = !!$ '#g-recaptcha, #captchaContainerAlt')

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

    @replace()
    @beforeSetup()
    @setup() if Conf['Auto-load captcha']
    new MutationObserver(@afterSetup).observe $.id('captchaContainerAlt'), childList: true
    @afterSetup() # reCAPTCHA might have loaded before the QR.

  replace: ->
    return if @script
    if not (@script = $ 'script[src="//www.google.com/recaptcha/api/js/recaptcha_ajax.js"]', d.head)
      @script = $.el 'script',
        src: '//www.google.com/recaptcha/api/js/recaptcha_ajax.js'
      $.add d.head, @script
    if old = $.id 'g-recaptcha'
      container = $.el 'div',
        id: 'captchaContainerAlt'
      $.replace old, container

  create: ->
    cont = $.id 'captchaContainerAlt'
    return if @occupied

    @occupied = true

    if (lang = Conf['captchaLanguage'].trim())
      cont.dataset.lang = lang

    $.onExists cont, '#recaptcha_image', (image) ->
      $.on image, 'click', ->
        if $.id 'recaptcha_challenge_image'
          $.global -> window.Recaptcha.reload()
    $.onExists cont, '#recaptcha_response_field', (field) ->
      $.on field, 'keydown', (e) ->
        if e.keyCode is 8 and not field.value
          $.global -> window.Recaptcha.reload()
      (field.focus() if location.hostname is 'sys.4chan.org')

    $.global ->
      container = document.getElementById 'captchaContainerAlt'
      options =
        theme:    'clean'
        tabindex: {"boards.4chan.org": 5}[location.hostname]
        lang:     container.dataset.lang
      if window.Recaptcha
        window.Recaptcha.create '<%= meta.recaptchaKey %>', container, options
      else
        script = document.head.querySelector 'script[src="//www.google.com/recaptcha/api/js/recaptcha_ajax.js"]'
        script.addEventListener 'load', ->
          window.Recaptcha.create '<%= meta.recaptchaKey %>', container, options
        , false

  cb:
    focus: -> QR.captcha.setup false, true

  beforeSetup: ->
    {img, input} = @nodes
    img.parentNode.hidden = true
    img.src = @blank
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
    return unless @isEnabled and (force or @needed())
    @create()
    if focus
      $.addClass QR.nodes.el, 'focus'
      @nodes.input.focus()

  afterSetup: ->
    return if not (challenge = $.id 'recaptcha_challenge_field_holder')
    return if challenge is QR.captcha.nodes.challenge

    setLifetime = (e) -> QR.captcha.lifetime = e.detail
    $.on window, 'captcha:timeout', setLifetime
    $.global -> window.dispatchEvent new CustomEvent 'captcha:timeout', {detail: window.RecaptchaState.timeout}
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
      QR.nodes.el.style.top    = ''
      QR.nodes.el.style.bottom = '0px'

  destroy: ->
    return unless @script
    $.global -> window.Recaptcha.destroy()
    delete @occupied
    @beforeSetup() if @nodes

  sync: (captchas=[]) ->
    QR.captcha.captchas = captchas
    QR.captcha.count()

  getOne: ->
    @clear()
    if captcha = @captchas.shift()
      @count()
      $.set 'captchas', @captchas
      captcha
    else
      challenge = @nodes.img.alt
      timeout   = @timeout
      if /\S/.test(response = @nodes.input.value)
        @destroy()
        {challenge, response, timeout}
      else
        null

  save: ->
    return unless /\S/.test(response = @nodes.input.value)
    @nodes.input.value = ''
    $.forceSync 'captchas'
    @captchas.push
      challenge: @nodes.img.alt
      response:  response
      timeout:   @timeout
    @captchas.sort (a, b) -> a.timeout - b.timeout
    @count()
    @destroy()
    @setup false, true
    $.set 'captchas', @captchas

  clear: ->
    $.forceSync 'captchas'
    return unless @captchas.length
    now = Date.now()
    for captcha, i in @captchas
      break if captcha.timeout > now
    return unless i
    @captchas = @captchas[i..]
    @count()
    $.set 'captchas', @captchas

  load: ->
    if $('#captchaContainerAlt[class~="recaptcha_is_showing_audio"]')
      @nodes.img.src = @blank
      return
    return unless @nodes.challenge.firstChild
    return if not (challenge_image = $.id 'recaptcha_challenge_image')
    # -1 minute to give upload some time.
    @timeout  = Date.now() + @lifetime * $.SECOND - $.MINUTE
    challenge = @nodes.challenge.firstChild.value
    @nodes.img.alt = challenge
    @nodes.img.src = challenge_image.src
    @nodes.input.value = ''
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
    clearTimeout @timer
    if count
      @timer = setTimeout @clear.bind(@), @captchas[0].timeout - Date.now()

  reload: (focus) ->
    # Recaptcha.should_focus = false: Hack to prevent the input from being focused
    $.global ->
      if window.Recaptcha.type is 'image'
        window.Recaptcha.reload()
      else
        window.Recaptcha.switch_type 'image'
      window.Recaptcha.should_focus = false
    @nodes.input.focus() if focus

  keydown: (e) ->
    if e.keyCode is 8 and not @nodes.input.value
      @reload()
    else if e.keyCode is 13 and e.shiftKey
      @save()
    else
      return
    e.preventDefault()
