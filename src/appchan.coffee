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
      Style.rice(d.body)
      Style.banner()
      Style.trimGlobalMessage()
      if exLink = $ "#navtopright .exlinksOptionsLink", d.body
        $.on exLink, "click", ->
          setTimeout Style.rice, 50
      Style.padding.nav   = $ "#boardNavDesktop", d.body
      Style.padding.pages = $(".pagelist", d.body)
      Style.padding()
      $.on (window or unsafeWindow), "resize", Style.padding
      # Give ExLinks and 4sight a little time to append their dialog links
      Style.iconPositions()

  emoji: (position) ->
    css = ''
    margin = if position is "before" then "right" else "left"
    for item in Emoji
      unless (Conf['Emoji'] is "disable ponies" and item[2] is "pony") or (Conf['Emoji'] is "only ponies" and item[2] != "pony")
        name  = item[0]
        image = Icons.header.png + item[1]
        css   += """
a.useremail[href*='#{name}']:last-of-type::#{position},
a.useremail[href*='#{name.toLowerCase()}']:last-of-type::#{position},
a.useremail[href*='#{name.toUpperCase()}']:last-of-type::#{position} {
  content: url('#{image}');
  vertical-align: top;
  margin-#{margin}: #{parseInt Conf['Emoji Spacing']}px;
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
    selects = $$('select:not(.riced)', source)
    for select in selects
      $.addClass select, 'riced'
      div = $.el 'div',
        className: 'selectrice'
        innerHTML: "<div>#{select.options[select.selectedIndex].textContent or null}</div>"
      $.on div, "click", (e) ->
        e.stopPropagation()
        if Style.ul
          return Style.rmOption()
        rect = @getBoundingClientRect()
        {clientHeight} = d.documentElement
        ul = Style.ul = $.el 'ul'
          id: "selectrice"
        {style} = ul
        style.width = "#{rect.width}px"
        if clientHeight - rect.bottom < 200
          style.bottom = "#{clientHeight - rect.top}px"
        else
          style.top = "#{rect.bottom}px"
        style.left = "#{rect.left}px"
        select = @previousSibling
        for option in select.options
          li = $.el 'li'
            textContent: option.textContent
          li.setAttribute 'data-value', option.value
          $.on li, 'click', (e) ->
            e.stopPropagation()
            container = @parentElement.parentElement
            select = container.previousSibling
            container.firstChild.textContent = @textContent
            select.value  = @getAttribute 'data-value'
            ev = document.createEvent 'HTMLEvents'
            ev.initEvent "change", true, true
            $.event select, ev
            Style.rmOption()
          $.add ul, li
        $.on ul, 'click scroll blur', (e) ->
          e.stopPropagation()
        Style.rmOption = ->
          $.off d, 'click scroll blur resize', Style.rmOption
          $.rm Style.ul
          delete Style.ul
        $.on d, 'click scroll blur resize', Style.rmOption
        $.add @, ul
      $.after select, div

  addStyle: (theme = Themes[Conf['theme']]) ->
    $.off d, 'DOMNodeInserted', Style.addStyle
    unless Conf['styleInit']
      if d.head
        Conf['styleInit']  = true
        unless theme = Themes[Conf['theme']]
          theme = Themes["Yotsuba B"]
          $.log "Invalid Theme #{Conf['theme']}!"
        Style.appchan      = $.addStyle Style.css(theme), 'appchan'
        Style.icons        = $.addStyle "", 'icons'
        Style.paddingSheet = $.addStyle "", 'padding'
        Style.mascot       = $.addStyle "", 'mascotSheet'
      else # XXX fox
        $.on d, 'DOMNodeInserted', Style.addStyle
    else
      MascotTools.init Conf["mascot"]
      Style.appchan.textContent = Style.css(theme)
      Style.iconPositions()

  headCount: 0
  
  remStyle: ->
    $.off d, 'DOMNodeInserted', @remStyle
    if Style.headCount < 11 and head = d.head
      nodes = []
      for node in head.children
        if /^.*\bstylesheet\b.*/.test(node.rel) or (/style/i.test(node.tagName) and !node.id)
            Style.headCount++
            nodes.push node
      for node in nodes
        $.rm node
      if Style.headCount < 10
        $.on d, 'DOMNodeInserted', @remStyle
    else
      $.on d, 'DOMNodeInserted', @remStyle

  banner: ->
    banner = $ ".boardBanner", d.body
    title  = $.el "div"
      id:   "boardTitle"
    children = for child in banner.children
      if child.tagName.toLowerCase() is "img"
        child.id = "Banner"
        continue;
      if Conf['Custom Board Titles']
        child.innerHTML = $.get "#{g.BOARD}#{child.className}", child.innerHTML
        $.on child, 'click', (e) ->
          if e.shiftKey
            @contentEditable = true
        $.on child, 'keydown', (e) ->
          e.stopPropagation()
        $.on child, 'focus', ->
          @textContent = @innerHTML
        $.on child, 'blur', ->
          $.set "#{g.BOARD}#{@className}", @textContent
          @innerHTML = @textContent
          @contentEditable = false
      child
    $.add title, children
    $.after banner, title

  padding: ->
    return unless sheet = Style.paddingSheet
    Style.padding.nav.property = Conf["Boards Navigation"].split(" ")
    Style.padding.nav.property = Style.padding.nav.property[Style.padding.nav.property.length - 1]
    if Style.padding.pages
      Style.padding.pages.property = Conf["Pagination"].split(" ")
      Style.padding.pages.property = Style.padding.pages.property[Style.padding.pages.property.length - 1]
    css = "body::before {\n"
    if Conf["4chan SS Emulation"]
      if Style.padding.pages and (Conf["Pagination"] is "sticky top"  or Conf["Pagination"] is "sticky bottom")
        css += "  #{Style.padding.pages.property}: #{Style.padding.pages.offsetHeight}px !important;\n"

      if Conf["Boards Navigation"] is "sticky top" or Conf["Boards Navigation"] is "sticky bottom"
        css += "  #{Style.padding.nav.property}: #{Style.padding.nav.offsetHeight}px !important;\n"

    css += """
}
body {
  padding-bottom: 15px;\n
"""

    if Style.padding.pages? and (Conf["Pagination"] is "sticky top" or Conf["Pagination"] is "sticky bottom" or Conf["Pagination"] is "top")
      css += "  padding-#{Style.padding.pages.property}: #{Style.padding.pages.offsetHeight}px;\n"

    unless Conf["Boards Navigation"] is "hide"
      css += "  padding-#{Style.padding.nav.property}: #{Style.padding.nav.offsetHeight}px;\n"

    css += "}"
    sheet.textContent = css

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
      return color.slice 1, color.length

    if digits = /(.*?)rgba?\((\d+), ?(\d+), ?(\d+)(.*?)\)/.exec color

      red   = parseInt digits[2], 10
      green = parseInt digits[3], 10
      blue  = parseInt digits[4], 10

      rgb = blue | (green << 8) | (red << 16)
      hex = rgb.toString 16

      while hex.length < 4
        hex += 0

      hex

    else return false