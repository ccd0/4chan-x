Sauce =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Sauce']

    links = []
    for link in Conf['sauces'].split '\n'
      try
        links.push @createSauceLink link.trim() if link[0] isnt '#'
      catch err
        # Don't add random text plz.
    return unless links.length
    @links = links
    @link  = $.el 'a', target: '_blank'
    Post::callbacks.push
      name: 'Sauce'
      cb:   @node
  createSauceLink: (link) ->
    # XXX Remove $1-4 after 31-7-2013 (v1 transitioning)
    link = link.replace /(%(T?URL|MD5|board)|\$[1-4])/ig, (parameter) ->
      switch parameter
        when '%TURL', '$1'
          "' + encodeURIComponent(post.file.thumbURL) + '"
        when '%URL', '$2'
          "' + encodeURIComponent(post.file.URL) + '"
        when '%MD5', '$3'
          "' + encodeURIComponent(post.file.MD5) + '"
        when '%board', '$4'
          "' + encodeURIComponent(post.board) + '"
        else
          parameter
    text = if m = link.match(/;text:(.+)$/) then m[1] else link.match(/(\w+)\.\w+\//)[1]
    link = link.replace /;text:.+$/, ''
    Function 'post', 'a', """
      a.href = '#{link}';
      a.textContent = '#{text}';
      return a;
    """
  node: ->
    return if @isClone or !@file
    nodes = []
    for link in Sauce.links
      # \u00A0 is nbsp
      nodes.push $.tn('\u00A0'), link @, Sauce.link.cloneNode true
    $.add @file.info, nodes
