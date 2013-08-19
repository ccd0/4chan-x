Linkify =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Linkify']

    # gruber revised + magnet support
    # http://rodneyrehm.de/t/url-regex.html
    @catchAll = /\b([a-z][\w-]+:(\/{1,3}|[a-z0-9%]|\?(dn|x[lts]|as|kt|mt|tr)=)|www\d{0,3}\.|[a-z0-9.\-]+\.[a-z]{2,4}\/)([^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])/g

    Post::callbacks.push
      name: 'Linkify'
      cb:   @node

  node: ->
    return if @isClone or !links = @info.comment.match Linkify.catchAll
    walker = d.createTreeWalker @nodes.comment, 4
    range  = d.createRange()
    for link in links
      boundaries = Linkify.find link, walker
      # continue unless boundaries
      anchor = Linkify.createLink link
      if Linkify.surround anchor, link, range, boundaries
        Linkify.cleanLink anchor if Conf['Clean Links']
        walker.currentNode = anchor.lastChild
      else
        walker.currentNode = boundaries.endNode
    range.detach()

  find: (link, walker) ->
    # Walk through the nodes until we find the entire link.
    text = ''
    while node = walker.nextNode()
      {data} = node
      text += node.data
      if text.indexOf(link) > -1
        startNode = endNode = node
        break

    # Walk backwards to find the startNode.
    text = data
    until (index = text.indexOf link) > -1
      startNode = walker.previousNode()
      text = "#{startNode.data}#{text}"

    return {
      startNode, endNode
      startOffset: index
      endOffset: endNode.length - (text.length - index - link.length)
    }

  createLink: (link) ->
    unless /^[a-z][\w-]+:/.test link
      link = "http://#{link}"
    a = $.el 'a',
      href: link
      target: '_blank'
    a

  surround: (anchor, link, range, {startOffset, endOffset, startNode, endNode}) ->
    # parent = startNode.parentNode
    # if parent?.nodeName is 'S' and parent.textContent.length < link.length
    #   parentClone = parent.cloneNode true
    #   $.replace parent, startNode
    range.setStart startNode, startOffset
    range.setEnd endNode, endOffset
    try
      range.surroundContents anchor
      # if !Conf['Clean Links'] and parentClone and anchor.firstChild
      #   $.replace anchor.firstChild, parentClone
      true
    catch
      false

  cleanLink: (anchor) ->
    # TODO
