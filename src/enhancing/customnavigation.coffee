CustomNavigation =
  init: ->
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

Navigation =
  delimiter: "/"
  links: [
    ["a", "Anime & Manga", "//boards.4chan.org/a/"]
    ["b", "Random", "//boards.4chan.org/b/"]
    ["c", "Cute/Anime", "//boards.4chan.org/c/"]
    ["d", "Hentai/Alternative", "//boards.4chan.org/d/"]
    ["e", "Ecchi", "//boards.4chan.org/e/"]
    ["f", "Flash", "//boards.4chan.org/f/"]
    ["g", "Technology", "//boards.4chan.org/g/"]
    ["gif", "Animated Gifs", "//boards.4chan.org/gif/"]
    ["h", "Hentai", "//boards.4chan.org/h/"]
    ["hr", "High Resolution", "//boards.4chan.org/hr/"]
    ["k", "Weapons", "//boards.4chan.org/k/"]
    ["l", "Lolicon", "http://7chan.org/cake/"]
    ["m", "Mecha", "//boards.4chan.org/m/"]
    ["o", "Auto", "//boards.4chan.org/o/"]
    ["p", "Pictures", "//boards.4chan.org/p/"]
    ["r", "Requests", "//boards.4chan.org/r/"]
    ["s", "Sexy Beautiful Women", "//boards.4chan.org/s/"]
    ["t", "Torrents", "//boards.4chan.org/t/"]
    ["u", "Yuri", "//boards.4chan.org/u/"]
    ["v", "Video Games", "//boards.4chan.org/v/"]
    ["vg", "Video Game Generals", "//boards.4chan.org/vg/"]
    ["w", "Anime/Wallpapers", "//boards.4chan.org/w/"]
    ["wg", "Wallpapers/General", "//boards.4chan.org/wg/"]
    ["i", "Oekaki", "//boards.4chan.org/i/"]
    ["ic", "Artwork/Critique", "//boards.4chan.org/ic/"]
    ["r9k", "Robot 9K", "//boards.4chan.org/r9k/"]
    ["cm", "Cute/Male", "//boards.4chan.org/cm/"]
    ["hm", "Handsome Men", "//boards.4chan.org/hm/"]
    ["y", "Yaoi", "//boards.4chan.org/y/"]
    ["3", "3DCG", "//boards.4chan.org/3/"]
    ["adv", "Advice", "//boards.4chan.org/adv/"]
    ["an", "Animals", "//boards.4chan.org/an/"]
    ["cgl", "Cosplay & EGL", "//boards.4chan.org/cgl/"]
    ["ck", "Food & Cooking", "//boards.4chan.org/ck/"]
    ["co", "Comics & Cartoons", "//boards.4chan.org/co/"]
    ["diy", "Do It Yourself", "//boards.4chan.org/diy/"]
    ["fa", "Fashion", "//boards.4chan.org/fa/"]
    ["fit", "Health & Fitness", "//boards.4chan.org/fit/"]
    ["hc", "Hardcore", "//boards.4chan.org/hc/"]
    ["int", "International", "//boards.4chan.org/int/"]
    ["jp", "Otaku Culture", "//boards.4chan.org/jp/"]
    ["lit", "Literature", "//boards.4chan.org/lit/"]
    ["mlp", "My Little Pony", "//boards.4chan.org/mlp/"]
    ["mu", "Music", "//boards.4chan.org/mu/"]
    ["n", "Transportation", "//boards.4chan.org/n/"]
    ["po", "Papercraft & Origami", "//boards.4chan.org/po/"]
    ["pol", "Politically Incorrect", "//boards.4chan.org/pol/"]
    ["sci", "Science & Math", "//boards.4chan.org/sci/"]
    ["soc", "Social", "//boards.4chan.org/soc/"]
    ["sp", "Sports", "//boards.4chan.org/sp/"]
    ["tg", "Traditional Games", "//boards.4chan.org/tg/"]
    ["toy", "Toys", "//boards.4chan.org/toys/"]
    ["trv", "Travel", "//boards.4chan.org/trv/"]
    ["tv", "Television & Film", "//boards.4chan.org/tv/"]
    ["vp", "Pok&eacute;mon", "//boards.4chan.org/vp/"]
    ["wsg", "Worksafe GIF", "//boards.4chan.org/wsg/"]
    ["x", "Paranormal", "//boards.4chan.org/x/"]
    ["rs", "Rapidshares", "http://rs.4chan.org/"]
    ["status", "4chan Status", "http://status.4chan.org/"]
    ["q", "4chan Discussion", "//boards.4chan.org/q/"]
    ["@", "4chan Twitter", "http://www.twitter.com/4chan"]
  ]
