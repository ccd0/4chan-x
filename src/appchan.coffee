Style =
  init: ->

    Style.agent = (->
      switch $.engine
        when 'gecko'
          return '-moz-'
        when 'webkit'
          return '-webkit-'
        when 'presto'
          return '-o-')()

    Style.remStyle()
    Style.addStyle()

    $.ready ->
      Style.banner()
      Style.trimGlobalMessage()
      if exLink = $ "#navtopright .exlinksOptionsLink", d.body
        $.on exLink, "click", ->
          setTimeout Style.rice, 50
      iconPositions = ->
        $.rm $.id 'icons'
        $.addStyle(Style.iconPositions(), 'icons')
      # Give ExLinks and 4sight a little time to append their dialog links
      setTimeout iconPositions, 1000

  emoji: (position) ->
    css = ''
    for item in Emoji
      unless (Conf['Emoji'] == "disable ponies" and item[2] == "pony") or (Conf['Emoji'] == "only ponies" and item[2] != "pony")
        name  = item[0]
        image = Icons.header.png + item[1]
        css   += """
a.useremail[href*='#{name}']:last-of-type::#{position},
a.useremail[href*='#{name.toLowerCase()}']:last-of-type::#{position},
a.useremail[href*='#{name.toUpperCase()}']:last-of-type::#{position} {
  content: url('#{image}') " ";
  vertical-align: top;
}\n
"""
    return css

  rice: (source)->
    checkboxes = $$('[type=checkbox]:not(.riced)', source)
    for checkbox in checkboxes
      $.addClass checkbox, 'riced'
      div = $.el 'div',
        className: 'rice'
      $.after checkbox, div
      if div.parentElement.tagName.toLowerCase() != 'label'
        $.on div, 'click', ->
          checkbox.click()

  addStyle: (theme = userThemes[Conf['theme']]) ->
    $.off d, 'DOMNodeInserted', Style.addStyle
    unless Conf['styleInit']
      if d.head
        Conf['styleInit'] = true
        $.addStyle Style.css(userThemes[Conf['theme']]), 'appchan'
        $.addStyle Style.iconPositions(), 'icons'
      else # XXX fox
        $.on d, 'DOMNodeInserted', Style.addStyle
    else
      if el = $('#mascot', d.body) then $.rm el
      $.rm $.id 'appchan'
      $.rm $.id 'icons'
      $.addStyle Style.css(theme), 'appchan'
      $.addStyle Style.iconPositions(), 'icons'

  banner: ->
    banner = $ ".boardBanner", d.body
    title  = $.el "div"
      id:   "boardTitle"
    children = for child in banner.children
      continue unless child.tagName?
      if child.tagName.toLowerCase() == "img"
        child.id = "Banner"
        continue;
      child
    $.add title, children
    $.after banner, title

  padding: ->
    Style.padding.nav   = $ "#boardNavDesktop", d.body
    Style.padding.pages = $(".pages", d.body)
    if Style.padding.pages and (Conf["Pagination"] == "sticky top" or Conf["Pagination"] == "sticky bottom" or Conf["Pagination"] == "top")
      Style.padding.pages.property = Conf["Pagination"].split(" ")
      Style.padding.pages.property = Style.padding.pages.property[Style.padding.pages.property.length - 1]
      d.body.style["padding#{Style.padding.pages.property.capitalize()}"] = "#{Style.padding.pages.offsetHeight}px"

      $.on (window or unsafeWindow), "resize", ->
        d.body.style["padding#{Style.padding.pages.property.capitalize()}"] = "#{Style.padding.pages.offsetHeight}px"

    if Conf["Boards Navigation"] isnt "hide"
      Style.padding.nav.property = Conf["Boards Navigation"].split(" ")
      Style.padding.nav.property = Style.padding.nav.property[Style.padding.nav.property.length - 1]
      d.body.style["padding#{Style.padding.nav.property.capitalize()}"] = "#{Style.padding.nav.offsetHeight}px"

      $.on (window or unsafeWindow), "resize", ->
        d.body.style["padding#{Style.padding.nav.property.capitalize()}"] = "#{Style.padding.nav.offsetHeight}px"

    unless d.body.style.paddingBottom
      d.body.style.paddingBottom = '15px'

  remStyle: ->
    $.off d, 'DOMNodeInserted', @remStyle
    unless Conf['remInit']
      if d.head and d.head.children.length > 10
        Conf['remInit'] = true
        nodes = []
        for node in d.head.children
          if node.rel == 'stylesheet'
            nodes.push node
          else if node.tagName.toLowerCase() == 'style' and node.id != 'appchan' and node.id != 'icons'
            nodes.push node
          else
            continue
        for node in nodes
          $.rm node
      else
        $.on d, 'DOMNodeInserted', @remStyle

  trimGlobalMessage: ->
    if el = $ "#globalMessage", d.body
      for child in el.children
        child.style.color = ""

  color: (hex) ->
    @hex = "#" + hex

    @calc_rgb = (hex) ->
      rgb = []
      hex = parseInt hex, 16
      rgb[0] = (hex >> 16) & 0xFF
      rgb[1] = (hex >> 8) & 0xFF
      rgb[2] = hex & 0xFF
      return rgb;

    @private_rgb = @calc_rgb(hex)

    @rgb = @private_rgb.join ","

    @isLight = ->
      @private_rgb[0] + @private_rgb[1] + @private_rgb[2] >= 400

    @shiftRGB = (shift, smart) ->
      rgb = @private_rgb.slice 0
      shift = if smart
        if @isLight rgb
          if shift < 0
            shift
          else
            -shift
        else
          Math.abs shift

      else
        shift;

      rgb[0] = Math.min Math.max(rgb[0] + shift, 0), 255
      rgb[1] = Math.min Math.max(rgb[1] + shift, 0), 255
      rgb[2] = Math.min Math.max(rgb[2] + shift, 0), 255
      return rgb.join ","

    @hover = @shiftRGB 16, true

  colorToHex: (color) ->
    if color.substr(0, 1) is '#'
      return color

    if digits = /(.*?)rgba?\((\d+), ?(\d+), ?(\d+)(.*?)\)/.exec color

      red   = parseInt digits[2], 10
      green = parseInt digits[3], 10
      blue  = parseInt digits[4], 10

      rgb = blue | (green << 8) | (red << 16)
      hex = '#' + rgb.toString 16
      
      while hex.length < 4
        hex += 0
      
      hex

    else return false