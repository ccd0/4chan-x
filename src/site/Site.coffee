Site =
  defaultProperties:
    '4chan.org':    {software: 'yotsuba'}
    '4channel.org': {canonical: '4chan.org'}
    '4cdn.org':     {canonical: '4chan.org'}
    'notso.smuglo.li': {canonical: 'smuglo.li'}
    'smugloli.net':    {canonical: 'smuglo.li'}
    'smug.nepu.moe':   {canonical: 'smuglo.li'}
    'original.kissu.moe': {canonical: 'kissu.moe'}

  init: (cb) ->
    $.extend Conf['siteProperties'], Site.defaultProperties
    hostname = Site.resolve()
    if hostname and $.hasOwn(SW, Conf['siteProperties'][hostname].software)
      @set hostname
      cb()
    $.onExists doc, 'body', =>
      for software of SW when (changes = SW[software].detect?())
        changes.software = software
        hostname = location.hostname.replace(/^www\./, '')
        properties = (Conf['siteProperties'][hostname] or= $.dict())
        changed = 0
        for key of changes when properties[key] isnt changes[key]
          properties[key] = changes[key]
          changed++
        if changed
          $.set 'siteProperties', Conf['siteProperties']
        unless g.SITE
          @set hostname
          cb()
        return
      return

  resolve: (url=location) ->
    {hostname} = url
    while hostname and not $.hasOwn(Conf['siteProperties'], hostname)
      hostname = hostname.replace(/^[^.]*\.?/, '')
    if hostname
      hostname = canonical if (canonical = Conf['siteProperties'][hostname].canonical)
    hostname

  parseURL: (url) ->
    siteID = Site.resolve url
    Main.parseURL g.sites[siteID], url

  set: (hostname) ->
    for ID, properties of Conf['siteProperties']
      continue if properties.canonical
      software = properties.software
      continue unless software and $.hasOwn(SW, software)
      g.sites[ID] = site = Object.create SW[software]
      $.extend site, {ID, siteID: ID, properties, software}
    g.SITE = g.sites[hostname]
