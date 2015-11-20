Captcha.replace =
  init: ->
    return unless d.cookie.indexOf('pass_enabled=1') < 0
    return if location.hostname is 'boards.4chan.org' and Conf['Hide Original Post Form']

    if Conf['Force Noscript Captcha'] and Main.jsEnabled
      $.ready Captcha.replace.noscript
      return

    if location.hostname is 'sys.4chan.org' and Conf['Use Recaptcha v2 in Reports'] and Main.jsEnabled
      $.ready Captcha.replace.v2
      return

    if Conf['Use Recaptcha v1'] and Main.jsEnabled and location.hostname isnt 'www.4chan.org'
      $.ready Captcha.replace.v1
      return

    if Conf['captchaLanguage'].trim()
      if location.hostname is 'boards.4chan.org'
        $.onExists doc, '#captchaFormPart', true, (node) -> $.onExists node, 'iframe', true, Captcha.replace.iframe
      else
        $.onExists doc, 'iframe', true, Captcha.replace.iframe

  noscript: ->
    return unless (original = $ '#g-recaptcha, #captchaContainerAlt') and (noscript = $ 'noscript')
    span = $.el 'span',
      innerHTML: noscript.textContent
    Captcha.replace.iframe $('iframe', span)
    $.replace noscript, span
    original.hidden = true

  v1: ->
    return unless $.id 'g-recaptcha'
    Captcha.v1.replace()
    if link = $.id 'form-link'
      $.on link, 'click', -> Captcha.v1.create()
    else if location.hostname is 'boards.4chan.org'
      form = $.id 'postForm'
      form.addEventListener 'focus', (-> Captcha.v1.create()), true
    else
      Captcha.v1.create()

  v2: ->
    return unless old = $.id 'captchaContainerAlt'
    container = $.el 'div',
      className: 'g-recaptcha'
    $.extend container.dataset,
      sitekey: '<%= meta.recaptchaKey %>'
      tabindex: 3
    $.replace old, container
    url = 'https://www.google.com/recaptcha/api.js'
    if lang = Conf['captchaLanguage'].trim()
      url += "?hl=#{encodeURIComponent lang}"
    script = $.el 'script',
      src: url
    $.add d.head, script

  iframe: (el) ->
    return unless lang = Conf['captchaLanguage'].trim()
    src = if /[?&]hl=/.test el.src
      el.src.replace(/([?&]hl=)[^&]*/, '$1' + encodeURIComponent lang)
    else
      el.src + "&hl=#{encodeURIComponent lang}"
    el.src = src unless el.src is src
