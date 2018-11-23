Site =
  init: (cb) ->
    swDict = {}
    for line in Conf['siteSoftware'].split('\n') when line[0] isnt '#'
      [hostname, software] = line.split(' ')
      swDict[hostname] = software if software of SW
    {hostname} = location
    while hostname and hostname not of swDict
      hostname = hostname.replace(/^[^.]*\.?/, '')
    hostname = '4chan.org' if hostname is '4channel.org'
    if hostname
      @set hostname, swDict[hostname]
      cb()
    else
      $.onExists doc, 'body', =>
        for software of SW
          if SW[software].detect?()
            @set location.hostname.replace(/^www\./, ''), software
            Conf['siteSoftware'] += "\n#{@hostname} #{@software}"
            $.set 'siteSoftware', Conf['siteSoftware']
            cb()
        return

  set: (@hostname, @software) ->
    $.extend @, SW[@software]
