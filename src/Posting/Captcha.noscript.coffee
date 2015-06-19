Captcha.noscript =
  initFrame: ->
    conn = new Connection window.parent, "#{location.protocol}//boards.4chan.org",
      response: (response) ->
        $.id('response').value = response
        $('.fbc-challenge > form').submit()
    conn.send
      token: $('.fbc-verification-token > textarea')?.value
      error: $('.fbc-error')?.textContent
    return unless img = $ '.fbc-payload > img'
    cb = ->
      canvas = $.el 'canvas'
      canvas.width  = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      conn.send {challenge: canvas.toDataURL()}
    if img.complete
      cb()
    else
      $.on img, 'load', cb
