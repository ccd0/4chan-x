ImageHost =
  init: ->
    return unless (@useFaster = Conf['Use Faster Image Host']) and g.VIEW in ['index', 'thread']
    Callbacks.Post.push
      name: 'Image Host Rewriting'
      cb:   @node

  host: ->
    if @useFaster then 'i.4cdn.org' else 'is.4chan.org'
  flashHost: ->
    'i.4cdn.org'
  thumbHost: ->
    'i.4cdn.org'
  test: (hostname) ->
    hostname is 'i.4cdn.org' or ImageHost.regex.test(hostname)

  regex: /^is\d*\.4chan\.org$/

  node: ->
    return if @isClone
    host = ImageHost.host()
    if @file and ImageHost.regex.test(@file.url.split('/')[2])
      @file.link.hostname = host
      @file.thumbLink.hostname = host if @file.thumbLink
      @file.url = @file.link.href
    ImageHost.fixLinks $$('a', @nodes.comment)

  fixLinks: (links) ->
    for link in links when ImageHost.regex.test(link.hostname)
      link.hostname = ImageHost.host()
    return
