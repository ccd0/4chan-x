Captcha.language =
  init: ->
    return unless Conf['captchaLanguage'].trim() and d.cookie.indexOf('pass_enabled=1') < 0 and !Conf['Hide Original Post Form']
    $.onExists doc, '#captchaFormPart', true, (node) ->
      $.onExists node, 'iframe', true, Captcha.language.fixIframe

  fixPage: ->
    return unless Conf['captchaLanguage'].trim() and d.cookie.indexOf('pass_enabled=1') < 0
    $.onExists doc, 'iframe', true, Captcha.language.fixIframe

  fixIframe: (el) ->
    return unless lang = Conf['captchaLanguage'].trim()
    src = if /[?&]hl=/.test el.src
      el.src.replace(/([?&]hl=)[^&]*/, '$1' + encodeURIComponent lang)
    else
      el.src + "&hl=#{encodeURIComponent lang}"
    el.src = src unless el.src is src
