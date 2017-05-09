Captcha.replace =
  init: ->
    return unless d.cookie.indexOf('pass_enabled=1') < 0

    if location.hostname is 'sys.4chan.org' and /[?&]altc\b/.test(location.search) and Main.jsEnabled
      $.onExists doc, 'script[src="//www.google.com/recaptcha/api/js/recaptcha_ajax.js"]', ->
        $.global -> window.el.onload = null
        Captcha.v1.create()
      return

    if Conf['Force Noscript Captcha'] and Main.jsEnabled
      $.ready Captcha.replace.noscript
      return

    if Conf['captchaLanguage'].trim() or Conf['Captcha Fixes']
      if location.hostname is 'boards.4chan.org'
        $.onExists doc, '#captchaFormPart', (node) -> $.onExists node, 'iframe', Captcha.replace.iframe
      else
        $.onExists doc, 'iframe', Captcha.replace.iframe

  noscript: ->
    return if not ((original = $ '#g-recaptcha') and (noscript = $ 'noscript', original.parentNode))
    span = $.el 'span',
      id: 'captcha-forced-noscript'
    $.replace noscript, span
    $.rm original
    insert = ->
      span.innerHTML = noscript.textContent
      Captcha.replace.iframe $('iframe', span)
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
    Captcha.replace.autocopy iframe

  autocopy: (iframe) ->
    return unless Conf['Captcha Fixes'] and /^https:\/\/www\.google\.com\/recaptcha\/api\/fallback\?/.test(iframe.src)
    new Connection iframe, 'https://www.google.com',
      working: ->
        if $.id('qr')?.contains iframe
          $('#qr .captcha-container textarea')?.parentNode.hidden = true
      token: (token) ->
        node = iframe
        while (node = node.parentNode)
          break if (textarea = $ 'textarea', node)
        textarea.value = token
        $.event 'input', null, textarea
