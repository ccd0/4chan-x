CustomNavigation =
  init: ->
    setTimeout @asyncInit

  asyncInit: ->
    navigation  = $ "#boardNavDesktop", d.body
    navNodes    = navigation.childNodes
    i           = navNodes.length
    nodes       = if Conf['Append Delimiters'] then [$.tn "#{userNavigation.delimiter} "] else []

    # Gather default navigation and remove it.
    while i--
      continue if (node = navNodes[i]).id
      $.rm node

    # Add the first delimiter outside the for loop so we don't end up with hundreds.

    # Add the custom navigation.
    # It should be noted that doing this moves the #navtopright to the left. I could prepend it, but why?
    len = userNavigation.links.length - 1

    while i++ < len
      link = userNavigation.links[i]
      a = $.el 'a'
        textContent:    link[0]
        title:          link[1]
        href:           link[2]
      
      $.addClass(a, 'current') if a.href.contains "/#{g.BOARD}/"

      nodes[nodes.length] = a

      if Conf['Append Delimiters'] or i isnt len
        nodes[nodes.length] = $.tn " #{userNavigation.delimiter} "

    $.prepend navigation, nodes

    return