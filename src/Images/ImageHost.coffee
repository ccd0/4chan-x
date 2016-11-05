ImageHost =
  init: ->
    return unless Conf['Use Faster Image Host'] and g.VIEW in ['index', 'thread']
    Callbacks.Post.push
      name: 'Image Host Rewriting'
      cb:   @node

  node: ->
    return unless @file and not @isClone and (m = @file.url.match /^https?:\/\/is\.4chan\.org\/(.*)$/)
    @file.link.hostname = 'i.4cdn.org'
    @file.thumbLink.hostname = 'i.4cdn.org' if @file.thumbLink
    @file.url = @file.link.href
