CustomNavigation =
  init: ->
    navigation  = $ "#boardNavDesktop", d.body
    navNodes    = navigation.childNodes
    i           = navNodes.length

    # Gather default navigation and remove it.
    while i--
      continue if (node = navNodes[i]).id is "navtopright"
      $.rm node

    # Add the first delimiter outside the for loop so we don't end up with hundreds.
    if Conf['Append Delimiters']
      $.add navigation, $.tn "#{userNavigation.delimiter} "

    # Add the custom navigation.
    # It should be noted that doing this moves the #navtopright to the left. I could prepend it, but why?
    len = userNavigation.links.length - 1

    while i++ < len
      link = userNavigation.links[i]
      a = $.el 'a'
        textContent:    link[0]
        title:          link[1]
        href:           link[2]
      $.add navigation, a
      if Conf['Append Delimiters'] or i isnt len
        $.add navigation, $.tn " #{userNavigation.delimiter} "

    return