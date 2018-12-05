Site =
  init: (cb) ->
    {hostname} = location
    while hostname and hostname not of Conf['siteProperties']
      hostname = hostname.replace(/^[^.]*\.?/, '')
    hostname = '4chan.org' if hostname is '4channel.org'
    if hostname and Conf['siteProperties'][hostname].software of SW
      @set hostname, Conf['siteProperties'][hostname]
      cb()
    else
      $.onExists doc, 'body', =>
        for software of SW
          if SW[software].detect?()
            properties = {software}
            @set location.hostname.replace(/^www\./, ''), properties
            Conf['siteProperties'][@hostname] = properties
            $.set 'siteProperties', Conf['siteProperties']
            cb()
        return

  set: (@hostname, @properties) ->
    @software = @properties.software
    $.extend @, SW[@software]
