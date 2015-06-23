Captcha.replace =
  init: ->
    return unless d.cookie.indexOf('pass_enabled=1') < 0
    return if location.hostname is 'boards.4chan.org' and Conf['Hide Original Post Form']

    if Conf['captchaLanguage'].trim()
      if location.hostname is 'boards.4chan.org'
        $.onExists doc, '#captchaFormPart', true, (node) -> $.onExists node, 'iframe', true, Captcha.replace.iframe
      else
        $.onExists doc, 'iframe', true, Captcha.replace.iframe

  iframe: (el) ->
    return unless lang = Conf['captchaLanguage'].trim()
    src = if /[?&]hl=/.test el.src
      el.src.replace(/([?&]hl=)[^&]*/, '$1' + encodeURIComponent lang)
    else
      el.src + "&hl=#{encodeURIComponent lang}"
    el.src = src unless el.src is src
