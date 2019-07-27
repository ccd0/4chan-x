ImageHost =
  init: ->
    return unless (@useFaster = /\S/.test(Conf['fourchanImageHost'])) and g.SITE.software is 'yotsuba' and g.VIEW in ['index', 'thread']
    Callbacks.Post.push
      name: 'Image Host Rewriting'
      cb:   @node

  suggestions: ['i.4cdn.org', 'is2.4chan.org']

  host: ->
    Conf['fourchanImageHost'].trim() or 'i.4cdn.org'
  flashHost: ->
    'i.4cdn.org'
  thumbHost: ->
    'i.4cdn.org'
  test: (hostname) ->
    hostname is 'i.4cdn.org' or ImageHost.regex.test(hostname)

  regex: /^is\d*\.4chan(?:nel)?\.org$/

  node: ->
    return if @isClone
    host = ImageHost.host()
    if @file and ImageHost.test(@file.url.split('/')[2]) and not /\.swf$/.test(@file.url)
      @file.link.hostname = host
      @file.thumbLink.hostname = host if @file.thumbLink
      @file.url = @file.link.href
    ImageHost.fixLinks $$('a', @nodes.comment)

  fixLinks: (links) ->
    for link in links when ImageHost.test(link.hostname) and not /\.swf$/.test(link.pathname)
      host = ImageHost.host()
      link.hostname = host unless link.hostname is host
    return
