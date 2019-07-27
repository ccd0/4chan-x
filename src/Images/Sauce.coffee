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
    for part, i in link.split /;(?=(?:text|boards|types|regexp|sandbox):?)/
      if i is 0
        parts['url'] = part
      else
        m = part.match /^(\w*):?(.*)$/
        parts[m[1]] = m[2]
    parts['text'] or= parts['url'].match(/(\w+)\.\w+\//)?[1] or '?'
    if 'boards' of parts
      parts['boards'] = Filter.parseBoards parts['boards']
    if 'regexp' of parts
      try
        if (regexp = parts['regexp'].match /^\/(.*)\/(\w*)$/)
          parts['regexp'] = RegExp regexp[1], regexp[2]
        else
          parts['regexp'] = RegExp parts['regexp']
      catch err
        new Notice 'warning', [
          $.tn "Invalid regexp for Sauce link:"
          $.el 'br'
          $.tn link
          $.el 'br'
          $.tn err.message
        ], 60
        return null
    parts

  createSauceLink: (link, post, file) ->
    ext = file.url.match(/[^.]*$/)[0]
    parts = {}
    $.extend parts, link

    return null unless !parts['boards'] or parts['boards']["#{post.siteID}/#{post.boardID}"] or parts['boards']["#{post.siteID}/*"]
    return null unless !parts['types']  or ext in parts['types'].split(',')
    return null unless !parts['regexp'] or (matches = file.name.match parts['regexp'])

    missing = []
    for key in ['url', 'text']
      parts[key] = parts[key].replace /%(T?URL|IMG|[sh]?MD5|board|name|%|semi|\$\d+)/g, (orig, parameter) ->
        if parameter[0] is '$'
          return orig unless matches
          type = matches[parameter[1..]] or ''
        else
          type = Sauce.formatters[parameter] post, file, ext
          if not type?
            missing.push parameter
            return ''

        if key is 'url' and parameter not in ['%', 'semi']
          type = JSON.stringify type if /^javascript:/i.test parts['url']
          type = encodeURIComponent type
        type

    if g.SITE.areMD5sDeferred?(post.board) and missing.length and !missing.filter((x) -> !/^.?MD5$/.test(x)).length
      a = Sauce.link.cloneNode false
      a.dataset.skip = '1'
      return a

    return null if missing.length

    a = Sauce.link.cloneNode false
    a.href = parts['url']
    a.textContent = parts['text']
    a.removeAttribute 'target' if /^javascript:/i.test parts['url']
    a

  node: ->
    return if @isClone
    for file in @files
      Sauce.file @, file
    return

  file: (post, file) ->
    nodes = []
    skipped = []
    for link in Sauce.links
      if (node = Sauce.createSauceLink link, post, file)
        nodes.push $.tn(' '), node
        skipped.push [link, node] if node.dataset.skip
    $.add file.text, nodes

    if skipped.length
      observer = new MutationObserver ->
        if file.text.dataset.md5
          for [link, node] in skipped when (node2 = Sauce.createSauceLink link, post, file)
            $.replace node, node2
          observer.disconnect()
      observer.observe file.text, {attributes: true}

  formatters:
    TURL:  (post, file) -> file.thumbURL
    URL:   (post, file) -> file.url
    IMG:   (post, file, ext) -> if ext in ['gif', 'jpg', 'png'] then file.url else file.thumbURL
    MD5:   (post, file) -> file.MD5
    sMD5:  (post, file) -> file.MD5?.replace /[+/=]/g, (c) -> ({'+': '-', '/': '_', '=': ''})[c]
    hMD5:  (post, file) -> if file.MD5 then ("0#{c.charCodeAt(0).toString(16)}"[-2..] for c in atob file.MD5).join('')
    board: (post) -> post.board.ID
    name:  (post, file) -> file.name
    '%':   -> '%'
    semi:  -> ';'
