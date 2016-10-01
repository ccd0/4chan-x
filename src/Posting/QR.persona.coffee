QR.persona =
  always: {}
  types:
    name:  []
    email: []
    sub:   []

  init: ->
    return unless Conf['Quick Reply'] or (Conf['Menu'] and Conf['Delete Link'])
    for item in Conf['QR.personas'].split '\n'
      QR.persona.parseItem item.trim()
    return

  parseItem: (item) ->
    return if item[0] is '#'
    return if not (match = item.match /(name|options|email|subject|password):"(.*)"/i)
    [match, type, val]  = match

    # Don't mix up item settings with val.
    item = item.replace match, ''

    boards = item.match(/boards:([^;]+)/i)?[1].toLowerCase() or 'global'
    return if boards isnt 'global' and g.BOARD.ID not in boards.split ','


    if type is 'password'
      QR.persona.pwd = val
      return

    type = 'email' if type is 'options'
    type = 'sub'   if type is 'subject'

    if /always/i.test item
      QR.persona.always[type] = val

    unless val in QR.persona.types[type]
      QR.persona.types[type].push val

  load: ->
    for type, arr of QR.persona.types
      list = $ "#list-#{type}", QR.nodes.el
      for val in arr when val
        $.add list, $.el 'option',
          textContent: val
    return

  getPassword: ->
    if QR.persona.pwd?
      QR.persona.pwd
    else if (m = d.cookie.match /4chan_pass=([^;]+)/)
      decodeURIComponent m[1]
    else
      ''

  get: (cb) ->
    $.get 'QR.persona', {}, ({'QR.persona': persona}) ->
      cb persona

  set: (post) ->
    $.get 'QR.persona', {}, ({'QR.persona': persona}) ->
      persona =
        name:  post.name
      $.set 'QR.persona', persona
