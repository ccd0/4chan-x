CustomNavigation =
  init: ->
    navigation = $ "#boardNavDesktop", d.body

    for index of navigation.childNodes
      unless navigation.firstChild.id == "navtopright"
        $.rm navigation.firstChild

    #Add the first delimiter outside the for loop so we don't end up with hundreds.
    $.add navigation, $.tn " #{userNavigation.delimiter} "

    for link in userNavigation.links
      a = $.el 'a'
        href:           link[2]
        title:          link[1]
        textContent:    link[0]
      $.add navigation, a
      $.add navigation, $.tn " #{userNavigation.delimiter} "