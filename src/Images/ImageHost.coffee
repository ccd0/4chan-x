ImageHost =
  init: ->
    return unless Conf['Use Faster Image Host'] and g.VIEW in ['index', 'thread']
    Callbacks.Post.push
      name: 'Image Host Rewriting'
      cb:   @node

  node: ->
    return if @isClone
    if @file and (m = @file.url.match /^https?:\/\/is\d*\.4chan\.org\/(.*)$/)
      @file.link.hostname = 'i.4cdn.org'
      @file.thumbLink.hostname = 'i.4cdn.org' if @file.thumbLink
      @file.url = @file.link.href
    for link in $$ 'a[href^="http://is.4chan.org/"], a[href^="https://is.4chan.org/"]', @nodes.comment
      link.hostname = 'i.4cdn.org'
    return
