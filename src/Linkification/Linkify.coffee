Linkify =
  init: ->
    return if g.VIEW is 'catalog' or not Conf['Linkify']

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    Post.callbacks.push
      name: 'Linkify'
      cb:   @node

    Embedding.init()

  node: ->
    return Embedding.events @ if @isClone
    return unless Linkify.regString.test @info.comment

    test     = /[^\s'"]+/g
    space    = /[\s'"]/
    snapshot = $.X './/br|.//text()', @nodes.comment
    i = 0
    links = []
    while node = snapshot.snapshotItem i++
      {data} = node
      continue if !data or node.parentElement.nodeName is "A"

      while result = test.exec data
        {index} = result
        endNode = node
        word    = result[0]
        # End of node, not necessarily end of space-delimited string
        if (length = index + word.length) is data.length
          test.lastIndex = 0

          while (saved = snapshot.snapshotItem i++)
            if saved.nodeName is 'BR'
              break

            endNode  = saved
            {data}   = saved

            if end = space.exec data
              # Set our snapshot and regex to start on this node at this position when the loop resumes
              word += data[...end.index]
              test.lastIndex = length = end.index
              i--
              break
            else
              {length} = data
              word    += data

        if Linkify.regString.test word
          links.push Linkify.makeRange node, endNode, index, length
          <%= assert('word is links[links.length-1].toString()') %>

        break unless test.lastIndex and node is endNode

    i = links.length
    while i--
      link = Linkify.makeLink links[i]
      Embedding.process link, @
    return

  regString: ///(
    # http, magnet, ftp, etc
    (https?|mailto|git|magnet|ftp|irc):(
      [a-z\d%/?]
    )
    | # This should account for virtually all links posted without http:
    ([-a-z\d]+[.])+(
      aero|asia|biz|cat|com|coop|info|int|jobs|mobi|moe|museum|name|net|org|post|pro|tel|travel|xxx|edu|gov|mil|[a-z]{2}
    )([:/]|(?![^\s'"]))
    | # IPv4 Addresses
    [\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}
    | # E-mails
    [-\w\d.@]+@[a-z\d.-]+\.[a-z\d]
  )///i

  makeRange: (startNode, endNode, startOffset, endOffset) ->
    range = document.createRange()
    range.setStart startNode, startOffset
    range.setEnd   endNode,   endOffset
    range

  makeLink: (range) ->
    text = range.toString()

    # Clean start of range
    i = text.search Linkify.regString

    if i > 0
      text = text.slice i
      i-- while range.startOffset + i >= range.startContainer.data.length

      range.setStart range.startContainer, range.startOffset + i if i

    # Clean end of range
    i = 0
    while /[)\]}>.,]/.test t = text.charAt text.length - (1 + i)
      break unless /[.,]/.test(t) or (text.match /[()\[\]{}<>]/g).length % 2
      i++

    if i
      text = text.slice 0, -i
      i-- while range.endOffset - i < 0

      if i
        range.setEnd range.endContainer, range.endOffset - i

    # Make our link 'valid' if it is formatted incorrectly.
    unless /((mailto|magnet):|.+:\/\/)/.test text
      text = (
        if /@/.test text
          'mailto:'
        else
          'http://'
      ) + text

    a = $.el 'a',
      className: 'linkify'
      rel:       'nofollow noreferrer'
      target:    '_blank'
      href:      text

    # Insert the range into the anchor, the anchor into the range's DOM location, and destroy the range.
    $.add a, range.extractContents()
    range.insertNode a
    range.detach()

    a
