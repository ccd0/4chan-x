CustomNavigation =
  init: ->
    navigation = $ "#boardNavDesktop", d.body

    # Gather default navigation
    nodes = for node in navigation.childNodes
      unless node.id == "navtopright"
        node
      else
        continue

    # And remove it.
    # We do this in two operations because gathering nodes while deleting them is _messy_
    # And mostly doesn't work.
    for node in nodes
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