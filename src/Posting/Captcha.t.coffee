Captcha.t =
  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return if not (@isEnabled = !!$('#t-root') or !$.id('postForm'))

    root = $.el 'div', className: 'captcha-root'
    @nodes = {root}

    $.addClass QR.nodes.el, 'has-captcha', 'captcha-t'
    $.after QR.nodes.com.parentNode, root

  moreNeeded: ->
    return

  setup: (focus) ->
    return unless @isEnabled

    if !@nodes.container
      @nodes.container = $.el 'div', className: 'captcha-container'
      $.prepend @nodes.root, @nodes.container
      boardID = g.BOARD.ID
      threadID = '' + QR.posts[0].thread
      $.global ->
        el = document.querySelector '#qr .captcha-container'
        window.TCaptcha.init el, @boardID, +@threadID
        window.TCaptcha.setErrorCb (err) ->
          window.dispatchEvent new CustomEvent('CreateNotification', {detail: {
            type: 'warning',
            content: '' + err
          }})
      , {boardID, threadID}

    if focus
      $('#t-resp').focus()

  destroy: ->
    return unless @isEnabled and @nodes.container
    $.global ->
      window.TCaptcha.destroy()
    $.rm @nodes.container
    delete @nodes.container

  getOne: ->
    response = {}
    if @nodes.container
      for key in ['t-response', 't-challenge']
        response[key] = $("[name='#{key}']", @nodes.container).value
    if !response['t-response']
      response = null
    response

  setUsed: ->
    if @nodes.container
      $.global ->
        window.TCaptcha.clearChallenge()

  occupied: ->
    !!@nodes.container
