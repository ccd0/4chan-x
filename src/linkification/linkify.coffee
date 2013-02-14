Linkify =
  init: ->
    Main.callbacks.push @node

  regString: ///(
    \b(
      [a-z]+:// # http://, ftp://
      |
      [-a-z0-9]+\.[-a-z0-9]+\.[-a-z0-9]+ # www.test-9.com
      |
      [-a-z0-9]+\.(com|net|tv|org|xxx|us) # this-is-my-web-sight.net.
      |
      [a-z]+:[a-z0-9?] # mailto:, magnet:
      |
      [a-z0-9._%+-:]+@[a-z0-9.-]+\.[a-z0-9] # E-mails, also possibly anonymous:password@192.168.2.1
    )
    [^\s,]+ # Terminate at Whitespace
  )///gi

  cypher: $.el 'div'

  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    
    Linkify.prep $.X './/text()', post.blockquote

    return
    
  prep: (snapshot) ->
    cypher = Linkify.cypher
    i      = -1
    len    = snapshot.snapshotLength

    while ++i < len
      nodes = []
      node  = snapshot.snapshotItem i
      data  = node.data

      continue unless node.parentNode and Linkify.regString.test data
      Linkify.regString.lastIndex = 0

      cypherText = []

      if next = node.nextSibling
        cypher.textContent = node.textContent
        cypherText[0]      = cypher.innerHTML

        while ((name = next.nodeName) is 'WBR' or name is 'S') and (lookahead = next.nextSibling) and (name = lookahead.nodeName) is "#text" or name is 'BR'
          cypher.textContent = lookahead.textContent

          cypherText.push if spoiler = next.innerHTML then "<s>#{spoiler}</s>" else '<wbr>'
          cypherText.push cypher.innerHTML

          $.rm next
          next = lookahead.nextSibling
          $.rm lookahead if name is "#text"

          unless next
            break

      if cypherText.length
        data = cypherText.join ''
        
      Linkify.replace data

  replace: (data) ->
    links = data.match Linkify.regString

    for link in links
      index = data.indexOf link

      if text = data[...index]
        # press button get bacon
        cypher.innerHTML = text
        for child in cypher.childNodes
          nodes.push child

      cypher.innerHTML = (if link.indexOf(':') < 0 then (if link.indexOf('@') > 0 then 'mailto:' + link else 'http://' + link) else link).replace /<(wbr|s|\/s)>/g, ''

      a = $.el 'a',
        innerHTML: link
        className: 'linkify'
        rel:       'nofollow noreferrer'
        target:    'blank'
        href:      cypher.textContent

      nodes = nodes.concat Embed.embedder a

      data = data[index + link.length..]

    if data
      cypher.innerHTML = data

      for child in cypher.childNodes
        nodes.push child

    $.replace node, nodes