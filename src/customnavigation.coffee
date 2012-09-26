CustomNavigation =
  init: ->
    delimiter = " #{userNavigation.delimiter} "
    html = delimiter
    navigation = $ "#boardNavDesktop", d.body

    for index of navigation.childNodes
      unless navigation.firstChild.id == "navtopright"
        $.rm navigation.firstChild

    for link in userNavigation.links
      html = "#{html}<a href=\"#{link[2]}\" title=\"#{link[1]}\">#{link[0]}</a>#{delimiter}"
    navigation.innerHTML = navigation.innerHTML + html