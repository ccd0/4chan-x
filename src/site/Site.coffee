Site =
  defaultProperties:
    '4chan.org':    {software: 'yotsuba'}
    '4channel.org': {canonical: '4chan.org'}
    '4cdn.org':     {canonical: '4chan.org'}

  init: (cb) ->
    $.extend Conf['siteProperties'], Site.defaultProperties
    {hostname} = location
    while hostname and hostname not of Conf['siteProperties']
      hostname = hostname.replace(/^[^.]*\.?/, '')
    if hostname
      hostname = canonical if (canonical = Conf['siteProperties'][hostname].canonical)
      if Conf['siteProperties'][hostname].software of SW
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
