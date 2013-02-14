Linkify =
  init: ->
    Main.callbacks.push @node

  regString: ///(
    \b(
      [a-z]+:// # http://, ftp://
      |
      [a-z]{3,}\.[-a-z0-9]+\.[a-z]+
      |
      [-a-z0-9]+\.[a-z]{2,4} # this-is-my-web-sight.net.
      |
      [0-9]+\.[0-9]+\.[0-9]+\.[0-9]+ # IP Address
      |
      [a-z]{3,}:[a-z0-9?] # mailto:, magnet:
      |
      [a-z0-9._%+-:]+@[a-z0-9.-]+\.[a-z0-9] # E-mails, also possibly anonymous:password@192.168.2.1
    )
    [^\s'"]+ # Terminate at Whitespace
  )///gi

  check: ->
    true

  cypher: $.el 'div'

  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    Linkify.replace LinkParser $.X('.//text()', post.blockquote), Linkify.regString, Linkify.check

  replace: (parsed) ->
    cypher = Linkify.cypher
    for pair in parsed
      nodes = []
      [node, data] = pair
      links = data.match Linkify.regString

      for link in links
        index = data.indexOf link

        if text = data[...index]
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

        nodes.push a

        data = data[index + link.length..]

      if data
        cypher.innerHTML = data 

        nodes.push child for child in cypher.childNodes

      $.replace node, nodes