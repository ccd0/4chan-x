Captcha.replace =
  init: ->
    return unless g.SITE.software is 'yotsuba' and d.cookie.indexOf('pass_enabled=1') < 0

    if Conf['Force Noscript Captcha'] and Main.jsEnabled
      $.ready Captcha.replace.noscript
      return

    if Conf['captchaLanguage'].trim()
      if location.hostname in ['boards.4chan.org', 'boards.4channel.org']
        $.onExists doc, '#captchaFormPart', (node) -> $.onExists node, 'iframe[src^="https://www.google.com/recaptcha/"]', Captcha.replace.iframe
      else
        $.onExists doc, 'iframe[src^="https://www.google.com/recaptcha/"]', Captcha.replace.iframe

  noscript: ->
    return if not ((original = $ '#g-recaptcha') and (noscript = $ 'noscript', original.parentNode))
    span = $.el 'span',
      id: 'captcha-forced-noscript'
    $.replace noscript, span
    $.rm original
    insert = ->
      span.innerHTML = noscript.textContent
      Captcha.replace.iframe $('iframe[src^="https://www.google.com/recaptcha/"]', span)
    if (toggle = $ '#togglePostFormLink a, #form-link')
      $.on toggle, 'click', insert
    else
      insert()

  iframe: (iframe) ->
    if (lang = Conf['captchaLanguage'].trim())
      src = if /[?&]hl=/.test iframe.src
        iframe.src.replace(/([?&]hl=)[^&]*/, '$1' + encodeURIComponent lang)
      else
        iframe.src + "&hl=#{encodeURIComponent lang}"
      iframe.src = src unless iframe.src is src
    return
