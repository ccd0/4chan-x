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
  createSauceLink: (link, post) ->
    parts = {}
    for part, i in link.split /;(?=(?:text|boards|types):)/
      if i is 0
        parts['url'] = part
      else
        m = part.match /^(\w*):(.*)$/
        parts[m[1]] = m[2]
    parts['text'] or= parts['url'].match(/(\w+)\.\w+\//)?[1] or '?'
    for key of parts
      parts[key] = parts[key].replace /%(T?URL|MD5|board|name|%|semi)/g, (parameter) ->
        type = {
          '%TURL':  post.file.thumbURL
          '%URL':   post.file.URL
          '%MD5':   post.file.MD5
          '%board': post.board
          '%name':  post.file.name
          '%%':     '%'
          '%semi':  ';'
        }[parameter]
        if key is 'url' and parameter isnt '%%' and parameter isnt '%semi'
          encodeURIComponent type
        else
          type
    ext = post.file.URL.match(/\.([^\.]*)$/)?[1] or ''
    if (!parts['boards'] or post.board.ID in parts['boards'].split ',') and (!parts['types'] or ext in parts['types'].split ',')
      a = Sauce.link.cloneNode true
      a.href = parts['url']
      a.textContent = parts['text']
      a
    else
      null
  node: ->
    return if @isClone or !@file
    nodes = []
    for link in Sauce.links
      if node = Sauce.createSauceLink link, @
        # \u00A0 is nbsp
        nodes.push $.tn('\u00A0'), node
    $.add @file.text, nodes
