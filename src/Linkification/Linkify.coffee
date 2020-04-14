Linkify =
  init: ->
    return if g.VIEW not in ['index', 'thread', 'archive'] or not Conf['Linkify']

    if Conf['Comment Expansion']
      ExpandComment.callbacks.push @node

    Callbacks.Post.push
      name: 'Linkify'
      cb:   @node

    Embedding.init()

  node: ->
    return Embedding.events @ if @isClone
    return unless Linkify.regString.test @info.comment
    for link in $$ 'a', @nodes.comment when g.SITE.isLinkified?(link)
      $.addClass link, 'linkify'
      ImageHost.fixLinks [link] if ImageHost.useFaster
      Embedding.process link, @
    links = Linkify.process @nodes.comment
    ImageHost.fixLinks links if ImageHost.useFaster
    Embedding.process link, @ for link in links
    return

  process: (node) ->
    test     = /[^\s"]+/g
    space    = /[\s"]/
    snapshot = $.X './/br|.//text()', node
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
            if saved.nodeName is 'BR' or (saved.parentElement.nodeName is 'P' and !saved.previousSibling)
              if (
                # link deliberately split
                (part1 = word.match /(https?:\/\/)?([a-z\d-]+\.)*[a-z\d-]+$/i) and
                (part2 = snapshot.snapshotItem(i)?.data?.match /^(\.[a-z\d-]+)*\//i) and
                (part1[0] + part2[0]).search(Linkify.regString) is 0
              )
                continue
              else
                break

            if saved.parentElement.nodeName is "A" and not Linkify.regString.test(word)
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
          <% if (readJSON('/.tests_enabled')) { %>
          Test.assert ->
            word is links[links.length-1].toString()
          <% } %>

        break unless test.lastIndex and node is endNode

    i = links.length
    while i--
      links[i] = Linkify.makeLink links[i]
    links

  regString: ///(
    # http, magnet, ftp, etc
    (https?|mailto|git|magnet|ftp|irc):(
      [a-z\d%/?]
    )
    | # This should account for virtually all links posted without http:
    ([-a-z\d]+[.])+(
      aero|asia|biz|cat|com|coop|dance|info|int|jobs|mobi|moe|museum|name|net|org|post|pro|tel|travel|xxx|xyz|edu|gov|mil|[a-z]{2}
    )([:/]|(?![^\s"]))
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

    # Decode percent-encoded characters in domain so that they behave consistently across browsers.
    if encodedDomain = text.match /^(https?:\/\/[^/]*%[0-9a-f]{2})(.*)$/i
      text = encodedDomain[1].replace(/%([0-9a-f]{2})/ig, (x, y) ->
        if y is '25' then x else String.fromCharCode(parseInt y, 16)
      ) + encodedDomain[2]

    a = $.el 'a',
      className: 'linkify'
      rel:       'noreferrer noopener'
      target:    '_blank'
      href:      text

    # Insert the range into the anchor, the anchor into the range's DOM location, and destroy the range.
    $.add a, range.extractContents()
    range.insertNode a

    a
