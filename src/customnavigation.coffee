CustomNavigation =
  init: ->
    navigation  = $ "#boardNavDesktop", d.body
    navNodes    = navigation.childNodes
    i           = navNodes.length

    # Gather default navigation and remove it.
    while i--
      node = navNodes[i]
      continue if node.id is "navtopright"
      $.rm node

    # Add the first delimiter outside the for loop so we don't end up with hundreds.
    $.add navigation, $.tn "#{userNavigation.delimiter} "

    # Add the custom navigation.
    # It should be noted that doing this moves the #navtopright to the left. I could prepend it, but why?
    for link in userNavigation.links
      a = $.el 'a'
        textContent:    link[0]
        title:          link[1]
        href:           link[2]
      $.add navigation, a
      $.add navigation, $.tn " #{userNavigation.delimiter} "

    return