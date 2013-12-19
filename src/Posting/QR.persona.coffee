QR.persona =
  pwd: ''
  always: {}
  init: ->
    QR.persona.getPassword()
    $.get 'QR.personas', Conf['QR.personas'], ({'QR.personas': personas}) ->
      types =
        name:  []
        email: []
        sub:   []
      for item in personas.split '\n'
        QR.persona.parseItem item.trim(), types
      for type, arr of types
        QR.persona.loadPersonas type, arr
      return
  parseItem: (item, types) ->
    return if item[0] is '#'
    return unless match = item.match /(name|email|subject|password):"(.*)"/i
    [match, type, val]  = match

    # Don't mix up item settings with val.
    item = item.replace match, ''

    boards = item.match(/boards:([^;]+)/i)?[1].toLowerCase() or 'global'
    if boards isnt 'global' and not (g.BOARD.ID in boards.split ',')
      return

    if type is 'password'
      QR.persona.pwd = val
      return

    type = 'sub' if type is 'subject'

    if /always/i.test item
      QR.persona.always[type] = val

    unless val in types[type]
      types[type].push val
  loadPersonas: (type, arr) ->
    list = $ "#list-#{type}", QR.nodes.el
    for val in arr when val
      $.add list, $.el 'option',
        textContent: val
    return
  getPassword: ->
    unless QR.persona.pwd
      QR.persona.pwd = if m = d.cookie.match /4chan_pass=([^;]+)/
        decodeURIComponent m[1]
      else if input = $.id 'postPassword'
        input.value
      else
        # If we're in a closed thread, #postPassword isn't available.
        # And since #delPassword.value is only filled on window.onload
        # we'd rather use #postPassword when we can.
        $.id('delPassword').value
    return QR.persona.pwd
  get: (cb) ->
    $.get 'QR.persona', {}, ({'QR.persona': persona}) ->
      cb persona
  set: (post) ->
    $.get 'QR.persona', {}, ({'QR.persona': persona}) ->
      persona =
        name:  post.name
        email: if /^sage$/.test post.email then persona.email else post.email
        sub:   if Conf['Remember Subject'] then post.sub      else undefined
        flag:  post.flag
      $.set 'QR.persona', persona
