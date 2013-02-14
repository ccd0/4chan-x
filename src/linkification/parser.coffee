LinkParser = (snapshot, regex, check) ->
  cypher  = Linkify.cypher
  i       = -1
  len     = snapshot.snapshotLength
  results = []

  while ++i < len
    node  = snapshot.snapshotItem i
    data  = node.data

    continue unless node.parentNode and regex.test data
    regex.lastIndex = 0

    continue unless check data

    cypherText = []

    if next = node.nextSibling
      cypher.textContent = node.textContent
      cypherText[0]      = cypher.innerHTML
      j = 0

      while ((name1 = next.nodeName) is 'WBR' or name1 is 'S') and (lookahead = next.nextSibling) and (name2 = lookahead.nodeName) is "#text" or name2 is 'BR'
        cypher.textContent = lookahead.textContent

        cypherText.push if spoiler = next.innerHTML then "<s>#{spoiler}</s>" else '<wbr>'
        cypherText.push cypher.innerHTML

        $.rm next
        next = lookahead.nextSibling
        if name2 is "#text"
          delete snapshot.snapshotItem k if snapshot.snapshotItem(k = ++j + i) is lookahead
          $.rm lookahead

        unless next
          break

    if cypherText.length
      data = cypherText.join ''
    
    results.push [node, data]

  results