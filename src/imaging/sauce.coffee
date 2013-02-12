Sauce =
  init: ->
    return if g.BOARD is 'f'
    @links = []
    for link in Conf['sauces'].split '\n'
      continue if link[0] is '#'
      # XXX .trim() is there to fix Opera reading two different line breaks.
      @links.push @createSauceLink link.trim()
    return unless @links.length
    Main.callbacks.push @node

  createSauceLink: (link) ->
    link = link.replace /(\$\d)/g, (parameter) ->
      switch parameter
        when '$1'
          "' + (isArchived ? img.firstChild.src : 'http://thumbs.4chan.org' + img.pathname.replace(/src(\\/\\d+).+$/, 'thumb$1s.jpg')) + '"
        when '$2'
          "' + img.href + '"
        when '$3'
          "' + encodeURIComponent(img.firstChild.dataset.md5) + '"
        when '$4'
          g.BOARD
        else
          parameter
    domain = if m = link.match(/;text:(.+)$/) then m[1] else link.match(/(\w+)\.\w+\//)[1]
    href = link.replace /;text:.+$/, ''
    href = Function 'img', 'isArchived', "return '#{href}'"
    el = $.el 'a',
      target: '_blank'
      textContent: domain
    (img, isArchived) ->
      a = el.cloneNode true
      a.href = href img, isArchived
      a

  node: (post) ->
    {img} = post
    return if post.isInlined and not post.isCrosspost or not img
    img   = img.parentNode
    nodes = []
    for link in Sauce.links
      # \u00A0 is nbsp
      nodes.push $.tn('\u00A0'), link img, post.isArchived
    $.add post.fileInfo, nodes