Sauce =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Sauce']

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
    return null unless link = link.trim()

    parts = {}
    for part, i in link.split /;(?=(?:text|boards|types):)/
      if i is 0
        parts['url'] = part
      else
        m = part.match /^(\w*):(.*)$/
        parts[m[1]] = m[2]
    parts['text'] or= parts['url'].match(/(\w+)\.\w+\//)?[1] or '?'
    ext = post.file.url.match(/[^.]*$/)[0]

    skip = false
    for key of parts
      parts[key] = parts[key].replace /%(T?URL|IMG|MD5|board|name|%|semi)/g, (parameter) ->
        type = {
          '%TURL':  post.file.thumbURL
          '%URL':   post.file.url
          '%IMG':   if ext in ['gif', 'jpg', 'png'] then post.file.url else post.file.thumbURL
          '%MD5':   post.file.MD5
          '%board': post.board.ID
          '%name':  post.file.name
          '%%':     '%'
          '%semi':  ';'
        }[parameter]
        if not type?
          skip = true
          return ''

        if key is 'url' and parameter isnt '%%' and parameter isnt '%semi'
          type = JSON.stringify type if /^javascript:/i.test parts['url']
          type = encodeURIComponent type
        type

    return null if skip
    return null unless !parts['boards'] or post.board.ID in parts['boards'].split ','
    return null unless !parts['types']  or ext           in parts['types'].split  ','

    a = Sauce.link.cloneNode true
    a.href = parts['url']
    a.textContent = parts['text']
    a.removeAttribute 'target' if /^javascript:/i.test parts['url']
    a

  node: ->
    return if @isClone or !@file

    nodes = []
    for link in Sauce.links when node = Sauce.createSauceLink link, @
      # \u00A0 is nbsp
      nodes.push $.tn('\u00A0'), node
    $.add @file.text, nodes
