Linkify =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Linkify']

    @catchAll = /\b(?:([a-z][\w-]+):(?:\/{1,3}|[a-z0-9%]|(\?(?:dn|xl|xt|as|xs|kt|mt|tr)=))|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])/i

    @globalCatchAll = ///#{@catchAll.source}///g

    Post::callbacks.push
      name: 'Linkify'
      cb:   @node

  node: ->
    return if @isClone or !links = @info.comment.match Linkify.globalCatchAll
    walker = d.createTreeWalker @nodes.comment, 4, null, false
    anchor = false
    while (node = walker.nextNode())?
      {parentNode} = node
      if parentNode.nodeName is 'A'
        # prettyprint has some issues
        if parentNode.textContent is links[0]
          delete links[0]
        walker.currentNode = parentNode.lastChild
        continue
      continue unless data = node.data
      while !anchor
        return unless link = links.shift()
        [anchor, link] = Linkify.parseLink link
      if data.length >= link.length and (index = data.indexOf link) >= 0
        walker.currentNode = Linkify.surround anchor, link, index, index + link.length, node
        anchor = false
        continue
      index = found = 0
      nextContent = node.nextSibling?.textContent
      while index isnt data.length
        start = data[index++..]
        startLength = start.length
        threshold   = startLength is 2
        if threshold and nextContent and link[...startLength + nextContent.length] is start + nextContent
          found = true
        if threshold or found = link[...startLength] is start
          index--
          break
      continue unless found
      startNode = node
      while start.length < link.length
        start += data = (node = walker.nextNode())?.data
        if Conf['Clean Links']
          {parentNode} = node
          if parentNode.nodeName is 'S' and parentNode.textContent.length < link.length
            $.replace parentNode, node
      continue unless start[...link.length] is link
      endIndex = link[start.length - data.length...].length
      walker.currentNode = Linkify.surround anchor, link, index, endIndex, startNode, node
      anchor = false
    return

  parseLink: (link) ->
    unless result = link.match @catchAll
      return false
    [link, protocol, isMagnet] = result
    try
      decodeURIComponent link
    catch
      return false
    target = if isMagnet or /^(irc|ftps?)$/.test protocol
      '_self'
    else
      '_blank'
    href = if protocol
      link
    else
      "http://#{link}"
    anchor = $.el 'a',
      target: target
      href: href
      rel: 'noreferrer'
    [anchor, link]

  surround: (anchor, link, startIndex, endIndex, startNode, endNode = startNode) ->
    parent = startNode.parentNode
    if parent?.nodeName is 'S' and parent.textContent.length < link.length
      parentClone = parent.cloneNode true
      $.replace parent, startNode
    range = d.createRange()
    range.setStart startNode, startIndex
    range.setEnd endNode, endIndex
    try
      range.surroundContents anchor
      if !Conf['Clean Links'] and parentClone and anchor.firstChild
        $.replace anchor.firstChild, parentClone
    endNode
