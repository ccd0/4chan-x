Sauce =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Sauce']

    links = []
    for link in Conf['sauces'].split '\n'
      try
        links.push link.trim() if link[0] isnt '#'
      catch err
        # Don't add random text plz.
    return unless links.length
    @links = links
    @link  = $.el 'a', target: '_blank'
    Post.callbacks.push
      name: 'Sauce'
      cb:   @node
  createSauceLink: (link, post, a) ->
    link = link.replace /%(T?URL|MD5|board|name)/g, (parameter) ->
      if type = {
        '%TURL':  post.file.thumbURL
        '%URL':   post.file.URL
        '%MD5':   post.file.MD5
        '%board': post.board
        '%name':  post.file.name
      }[parameter]
        encodeURIComponent(type)
      else
        parameter
    text = if m = link.match(/;text:(.+)$/) then m[1] else link.match(/(\w+)\.\w+\//)[1]
    link = link.replace /;text:.+$/, ''
    a.href = link
    a.textContent = text
    a
  node: ->
    return if @isClone or !@file
    nodes = []
    for link in Sauce.links
      # \u00A0 is nbsp
      nodes.push $.tn('\u00A0'), (Sauce.createSauceLink link, @, Sauce.link.cloneNode true)
    $.add @file.text, nodes
