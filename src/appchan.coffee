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
      setTimeout Style.iconPositions, 100

  emoji: (position) ->
    css = ''
    margin = if position is "before" then "right" else "left"
    _conf = Conf
    for key, category of Emoji
      unless (_conf['Emoji'] is "disable ponies" and key is "pony") or (_conf['Emoji'] is "only ponies" and key is "not")
        for name, image of category
          css   += """
a.useremail[href*='#{name}']:last-of-type::#{position},
a.useremail[href*='#{name.toLowerCase()}']:last-of-type::#{position},
a.useremail[href*='#{name.toUpperCase()}']:last-of-type::#{position} {
  content: url('#{Icons.header.png + image}');
  vertical-align: top;
  margin-#{margin}: #{parseInt _conf['Emoji Spacing']}px;
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
    return

  addStyle: ->
    theme = Themes[Conf['theme']]
    $.off d, 'DOMNodeInserted', Style.addStyle
    if d.head
      Style.layoutCSS    = $.addStyle Style.layout(),     'layout'
      Style.themeCSS     = $.addStyle Style.theme(theme), 'theme'
      Style.icons        = $.addStyle "",                 'icons'
      Style.paddingSheet = $.addStyle "",                 'padding'
      Style.mascot       = $.addStyle "",                 'mascotSheet'

      # As JSColor doesn't really have any customization,
      # we don't save its sheet as a variable.
      $.addStyle Style.jsColorCSS(),                 'jsColor'
      
      # After this has run correctly, this function becomes our go-to function for changing options.
      Style.addStyle = (theme) ->
        _conf = Conf
        unless theme
          theme = Themes[_conf['theme']]

        MascotTools.init _conf["mascot"]
        Style.layoutCSS.textContent = Style.layout()
        Style.themeCSS.textContent  = Style.theme(theme)
        Style.iconPositions()
    else # XXX fox
      $.on d, 'DOMNodeInserted', Style.addStyle

  headCount: 0

  remStyle: ->
    $.off d, 'DOMNodeInserted', @remStyle
    if Style.headCount < 11 and head = d.head
      nodes = head.children
      i     = nodes.length
      while i--
        node = nodes[i]
        if /^.*\bstylesheet\b.*/.test(node.rel) or (/style/i.test(node.tagName) and !node.id)
          Style.headCount++
          $.rm node
      if Style.headCount < 10
        $.on d, 'DOMNodeInserted', @remStyle
    else
      $.on d, 'DOMNodeInserted', @remStyle

  banner: ->
    banner   = $ ".boardBanner", d.body
    title    = $.el "div"
      id:    "boardTitle"
    children = banner.children
    i        = children.length
    while i--
      child = children[i]
      if child.tagName.toLowerCase() is "img"
        child.id = "Banner"
        continue
        
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
          
      $.add title, child
      
    $.after banner, title

  padding: ->
    return unless sheet = Style.paddingSheet
    _conf = Conf
    Style.padding.nav.property = _conf["Boards Navigation"].split(" ")
    Style.padding.nav.property = Style.padding.nav.property[Style.padding.nav.property.length - 1]
    if Style.padding.pages
      Style.padding.pages.property = _conf["Pagination"].split(" ")
      Style.padding.pages.property = Style.padding.pages.property[Style.padding.pages.property.length - 1]
    css = "body::before {\n"
    if _conf["4chan SS Emulation"]
      if Style.padding.pages and (_conf["Pagination"] is "sticky top"  or _conf["Pagination"] is "sticky bottom")
        css += "  #{Style.padding.pages.property}: #{Style.padding.pages.offsetHeight}px !important;\n"

      if _conf["Boards Navigation"] is "sticky top" or _conf["Boards Navigation"] is "sticky bottom"
        css += "  #{Style.padding.nav.property}: #{Style.padding.nav.offsetHeight}px !important;\n"

    css += """
}
body {
  padding-bottom: 15px;\n
"""

    if Style.padding.pages? and (_conf["Pagination"] is "sticky top" or _conf["Pagination"] is "sticky bottom" or _conf["Pagination"] is "top")
      css += "  padding-#{Style.padding.pages.property}: #{Style.padding.pages.offsetHeight}px;\n"

    unless _conf["Boards Navigation"] is "hide"
      css += "  padding-#{Style.padding.nav.property}: #{Style.padding.nav.offsetHeight}px;\n"

    css += "}"
    sheet.textContent = css

  trimGlobalMessage: ->
    if el = $ "#globalMessage", d.body
      for child in el.children
        child.style.color = ""
    return

  color: (hex) ->
    @hex = "#" + hex

    @calc_rgb = (hex) ->
      hex = parseInt hex, 16
      [ # 0xRRGGBB to [R, G, B]
        (hex >> 16) & 0xFF
        (hex >> 8) & 0xFF
        hex & 0xFF
      ]

    @private_rgb = @calc_rgb(hex)

    @rgb = @private_rgb.join ","

    @isLight = ->
      rgb = @private_rgb
      return (rgb[0] + rgb[1] + rgb[2]) >= 400

    @shiftRGB = (shift, smart) ->
      minmax = (base) ->
        Math.min Math.max(base, 0), 255
      rgb = @private_rgb.slice 0
      shift = if smart
        (
          if @isLight rgb
            -1
          else
            1
        ) * Math.abs shift
      else
        shift

      return [ 
        minmax rgb[0] + shift
        minmax rgb[1] + shift
        minmax rgb[2] + shift
      ].join ","

    @hover = @shiftRGB 16, true

  colorToHex: (color) ->
    if color.substr(0, 1) is '#'
      return color.slice 1, color.length

    if digits = color.match /(.*?)rgba?\((\d+), ?(\d+), ?(\d+)(.*?)\)/
      # [R, G, B] to 0xRRGGBB
      hex = (
        (parseInt(digits[2], 10) << 16) |
        (parseInt(digits[3], 10) << 8)  |
        (parseInt(digits[4], 10))
      ).toString 16

      while hex.length < 6
        hex = "0#{hex}"

      hex

    else
      false

  jsColorCSS: -> """
.jscBox {
  width: 251px;
  height: 155px;
}
.jscBoxB,
.jscPadB,
.jscPadM,
.jscSldB,
.jscSldM,
.jscBtn {
  position: absolute;
  clear: both;
}
.jscBoxB {
  left: 320px;
  bottom: 20px;
  z-index: 1000;
  border: 1px solid;
  border-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;
  background: ThreeDFace;
}
.jscPad {
  width: 181px;
  height: 101px;
  background-image: #{Style.agent}linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1)), #{Style.agent}linear-gradient(left, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  background-repeat: no-repeat;
  background-position: 0 0;
}
.jscPadB {
  left: 10px; 
  top: 10px; 
  border: 1px solid; 
  border-color: ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow;
}
.jscPadM {
  left: 0;
  top: 0;
  width: 200px;
  height: 121px;
  cursor: crosshair;
  background-image: url('data:image/gif;base64,R0lGODlhDwAPAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAPAA8AAAIklB8Qx53b4otSUWcvyiz4/4AeQJbmKY4p1HHapBlwPL/uVRsFADs=');
  background-repeat: no-repeat;
}
.jscSld {
  width: 16px;
  height: 101px;
  background-image: #{Style.agent}linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1));
}
.jscSldB {
  right: 10px;
  top: 10px;
  border: 1px solid;
  border-color: ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow;
}
.jscSldM {
  right: 0;
  top: 0;
  width: 36px;
  height: 121px;
  cursor: pointer;
  background-image: url('data:image/gif;base64,R0lGODlhBwALAKECAAAAAP///6g8eKg8eCH5BAEKAAIALAAAAAAHAAsAAAITTIQYcLnsgGxvijrxqdQq6DRJAQA7');
  background-repeat: no-repeat;
}
.jscBtn {
  right: 10px;
  bottom: 10px;
  padding: 0 15px;
  height: 18px;
  border: 1px solid;
  border-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;
  color: ButtonText;
  text-align: center;
  cursor: pointer;
}
.jscBtnS {
  line-height: 10px;
}"""