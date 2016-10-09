Site =
  init: ->
    swDict = {}
    for line in Conf['siteSoftware'].split('\n') when line[0] isnt '#'
      [hostname, software] = line.split(' ')
      swDict[hostname] = software if software of SW
    {hostname} = location
    while hostname and hostname not of swDict
      hostname = hostname.replace(/^[^.]*\.?/, '')
    return unless hostname
    @hostname = hostname
    @software = swDict[hostname]
    $.extend @, SW[@software]
