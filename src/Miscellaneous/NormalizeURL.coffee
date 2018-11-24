NormalizeURL =
  init: ->
    return unless Conf['Normalize URL']

    pathname = location.pathname.split /\/+/
    switch g.VIEW
      when 'thread'
        pathname[2] = 'thread'
        pathname = pathname[0...4]
      when 'index'
        pathname = pathname[0...3]
    pathname = pathname.join '/'
    if location.pathname isnt pathname
      history.replaceState history.state, '', "#{location.protocol}//#{location.host}#{pathname}#{location.hash}"
