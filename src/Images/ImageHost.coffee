ImageHost =
  init: ->
    return unless (@enabled = Conf['Use Faster Image Host'] and g.VIEW in ['index', 'thread'])
    Callbacks.Post.push
      name: 'Image Host Rewriting'
      cb:   @node

  regex: /^is\d*\.4chan\.org$/

  node: ->
    return if @isClone
    if @file and ImageHost.regex.test(@file.url.split('/')[2])
      @file.link.hostname = 'i.4cdn.org'
      @file.thumbLink.hostname = 'i.4cdn.org' if @file.thumbLink
      @file.url = @file.link.href
    ImageHost.fixLinks $$('a', @nodes.comment)

  fixLinks: (links) ->
    for link in links when ImageHost.regex.test(link.hostname)
      link.hostname = 'i.4cdn.org'
    return
