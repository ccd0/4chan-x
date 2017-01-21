Sauce =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Sauce']

    links = []
    for link in Conf['sauces'].split '\n'
      if link[0] isnt '#' and (linkData = @parseLink link)
        links.push linkData
    return unless links.length

    @links = links
    @link  = $.el 'a',
      target:    '_blank'
      className: 'sauce'
    Callbacks.Post.push
      name: 'Sauce'
      cb:   @node

  parseLink: (link) ->
    return null if not (link = link.trim())
    parts = {}
    for part, i in link.split /;(?=(?:text|boards|types|sandbox):?)/
      if i is 0
        parts['url'] = part
      else
        m = part.match /^(\w*):?(.*)$/
        parts[m[1]] = m[2]
    parts['text'] or= parts['url'].match(/(\w+)\.\w+\//)?[1] or '?'
    parts

  createSauceLink: (link, post) ->
    ext = post.file.url.match(/[^.]*$/)[0]
    parts = {}
    $.extend parts, link

    return null unless !parts['boards'] or post.board.ID in parts['boards'].split ','
    return null unless !parts['types']  or ext           in parts['types'].split  ','

    skip = false
    for key in ['url', 'text']
      parts[key] = parts[key].replace /%(T?URL|IMG|[sh]?MD5|board|name|%|semi)/g, (_, parameter) ->
        type = Sauce.formatters[parameter] post, ext
        if not type?
          skip = true
          return ''

        if key is 'url' and parameter not in ['%', 'semi']
          type = JSON.stringify type if /^javascript:/i.test parts['url']
          type = encodeURIComponent type
        type

    return null if skip

    a = Sauce.link.cloneNode false
    a.href = parts['url']
    a.textContent = parts['text']
    a.removeAttribute 'target' if /^javascript:/i.test parts['url']
    a

  node: ->
    return if @isClone or !@file

    nodes = []
    skipped = []
    for link in Sauce.links
      if not (node = Sauce.createSauceLink link, @)
        node = Sauce.link.cloneNode false
        skipped.push [link, node]
      nodes.push $.tn(' '), node
    $.add @file.text, nodes

    if @board.ID is 'f'
      observer = new MutationObserver =>
        if @file.text.dataset.md5
          for [link, node] in skipped when (node2 = Sauce.createSauceLink link, @)
            $.replace node, node2
          observer.disconnect()
      observer.observe @file.text, {attributes: true}

  formatters:
    TURL:  (post) -> post.file.thumbURL
    URL:   (post) -> post.file.url
    IMG:   (post, ext) -> if ext in ['gif', 'jpg', 'png'] then post.file.url else post.file.thumbURL
    MD5:   (post) -> post.file.MD5
    sMD5:  (post) -> post.file.MD5?.replace /[+/=]/g, (c) -> ({'+': '-', '/': '_', '=': ''})[c]
    hMD5:  (post) -> if post.file.MD5 then ("0#{c.charCodeAt(0).toString(16)}"[-2..] for c in atob post.file.MD5).join('')
    board: (post) -> post.board.ID
    name:  (post) -> post.file.name
    '%':   -> '%'
    semi:  -> ';'
