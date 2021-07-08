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

  getThread: ->
    boardID = g.BOARD.ID
    if QR.posts[0].thread is 'new'
      threadID = '0'
    else
      threadID = '' + QR.posts[0].thread
    {boardID, threadID}

  setup: (focus) ->
    return unless @isEnabled

    if !@nodes.container
      @nodes.container = $.el 'div', className: 'captcha-container'
      $.prepend @nodes.root, @nodes.container
      Captcha.t.currentThread = Captcha.t.getThread()
      $.global ->
        el = document.querySelector '#qr .captcha-container'
        window.TCaptcha.init el, @boardID, +@threadID
        window.TCaptcha.setErrorCb (err) ->
          window.dispatchEvent new CustomEvent('CreateNotification', {detail: {
            type: 'warning',
            content: '' + err
          }})
      , Captcha.t.currentThread

    if focus
      $('#t-resp').focus()

  destroy: ->
    return unless @isEnabled and @nodes.container
    $.global ->
      window.TCaptcha.destroy()
    $.rm @nodes.container
    delete @nodes.container

  updateThread: ->
    return unless @isEnabled
    {boardID, threadID} = (Captcha.t.currentThread or {})
    newThread = Captcha.t.getThread()
    unless newThread.boardID is boardID and newThread.threadID is threadID
      Captcha.t.destroy()
      Captcha.t.setup()

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
