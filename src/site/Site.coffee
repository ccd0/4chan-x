Site =
  defaultProperties:
    '4chan.org':    {software: 'yotsuba'}
    '4channel.org': {software: 'yotsuba'}
    '4cdn.org':     {software: 'yotsuba'}

  init: (cb) ->
    $.extend Conf['siteProperties'], Site.defaultProperties
    {hostname} = location
    while hostname and hostname not of Conf['siteProperties']
      hostname = hostname.replace(/^[^.]*\.?/, '')
    hostname = '4chan.org' if hostname is '4channel.org'
    if hostname and Conf['siteProperties'][hostname].software of SW
      @set hostname
      cb()
    $.onExists doc, 'body', =>
      for software of SW when (changes = SW[software].detect?())
        changes.software = software
        hostname = location.hostname.replace(/^www\./, '')
        properties = (Conf['siteProperties'][hostname] or= {})
        changed = 0
        for key of changes when properties[key] isnt changes[key]
          properties[key] = changes[key]
          changed++
        if changed
          $.set 'siteProperties', Conf['siteProperties']
        unless @hostname
          @set hostname
          cb()
        return
      return

  set: (@hostname) ->
    @properties = Conf['siteProperties'][@hostname]
    @software = @properties.software
    $.extend @, SW[@software]
