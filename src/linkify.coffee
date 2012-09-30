###
Based on the Linkify scripts located at:
http://downloads.mozdev.org/greasemonkey/linkify.user.js
https://github.com/MayhemYDG/LinkifyPlusFork

Originally written by Anthony Lieuallen of http://arantius.com/
Licensed for unlimited modification and redistribution as long as
this notice is kept intact.

If possible, please contact me regarding new features, bugfixes
or changes that I could integrate into the existing code instead of
creating a different script. Thank you.
###

Linkify =
  init: ->
    # Add Linkification to callbacks, which will call linkification on every post parsed by Appchan X.
    Main.callbacks.push @node

  node: (post) ->
    # Built based on:
    # - http://en.wikipedia.org/wiki/URI_scheme
    # - http://www.regular-expressions.info/regexbuddy/email.html
    
    nodes = []

    blockquote = post.blockquote or $ 'blockquote', post.el
    
    # We collect all the text children before editting them
    # so that further children don't get offset and therefore
    # don't get parsed.
    for child in blockquote.childNodes
      if child.nodeType == Node.TEXT_NODE
        nodes.push child
      else if child.className == "quote"
        for node in child.childNodes
          if node.nodeType == Node.TEXT_NODE
            nodes.push node
    
    # After we generate our list of nodes to parse we can 
    # edit it without worrying about nodes getting orphaned.
    for node in nodes
      Linkify.text node

  text: (child, link) ->
    txt = child.textContent
    parent = child.parentNode
    p = 0
    regString = [
      '('
      # leading scheme:// or "www."
      '\\b('
      '[a-z][-a-z0-9+.]+://'
      '|'
      'www\\.'
      '|'
      # Various link handlers:
      'magnet:'
      '|'
      'mailto:'
      '|'
      'news:'
      ')'
      # everything until non-URL character
      '[^\\s\'"<>()]+'
      '|'
      # email
      '\\b[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}\\b'
      ')'
    ].join("")
    urlRE = new RegExp regString, 'gi'
    while m = urlRE.exec txt

      # Get the link without trailing dots as to not create an invalid link.
      l = m[0].replace /\.*$/, ''
      lLen = l.length
      # Put in text up to the link so we can insert the link after it.
      node = $.tn(txt.substring(p, m.index))
      if link
        $.replace link, node
      else
        $.replace child, node
      # Create a link and put it in the span
      a = $.el 'a'
        textContent: l
        className: 'linkify'
        rel:       'nofollow noreferrer'
        target:    'blank'
        href:      if l.indexOf(":") < 0 then (if l.indexOf("@") > 0 then "mailto:" + l else "http://" + l) else l

      $.on a, 'click', (e) ->
        if e.shiftKey and e.ctrlKey
          e.preventDefault()
          e.stopPropagation()
          if "br" == @.nextSibling.tagName.toLowerCase()
            $.rm @.nextSibling
            child = $.tn(@textContent + @.nextSibling.textContent)
            $.rm @.nextSibling
            Linkify.text(child, @)

      $.after node, a
      # Track insertion point
      p = m.index+lLen
      
      rest = $.tn(txt.substring(p, txt.length))

      unless rest.textContent == ""
        $.after a, rest
        @text rest