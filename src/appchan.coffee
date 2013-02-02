Style =
  init: ->

    Style.setup()

    $.ready ->
      Style.rice(d.body)
      return unless $.id 'navtopright'
      Style.banner()
      Style.trimGlobalMessage()
      Style.padding.nav   = $ "#boardNavDesktop", d.body
      Style.padding.pages = $(".pagelist", d.body)
      Style.padding()
      $.on (window or unsafeWindow), "resize", Style.padding

      if catalogLink = ($('.pages.cataloglink a', d.body) or $ '[href=".././catalog"]', d.body)
        if !g.REPLY
          $.add d.body, catalogLink
        catalogLink.id = 'catalog'
        

      # Give ExLinks and 4sight a little time to append their dialog links
      setTimeout (->
        Style.iconPositions()
        if exLink = $ "#navtopright .exlinksOptionsLink", d.body
          $.on exLink, "click", ->
            setTimeout Style.rice, 100
        ), 500
  

  agent: {
    'gecko':  '-moz-'
    'webkit': '-webkit-'
    'presto': '-o-'
  }[$.engine]

  emoji: (position) ->
    _conf = Conf
    css = []
    margin = "margin-#{if position is "before" then "right" else "left"}: #{parseInt _conf['Emoji Spacing']}px;"

    for key, category of Emoji
      if (_conf['Emoji'] isnt "disable ponies" and key is "pony") or (_conf['Emoji'] isnt "only ponies" and key is "not")
        for icon in category
          name = icon[0]
          css[css.length] = """
a.useremail[href*='#{name}']:last-of-type::#{position},
a.useremail[href*='#{name.toLowerCase()}']:last-of-type::#{position},
a.useremail[href*='#{name.toUpperCase()}']:last-of-type::#{position} {
  content: url('#{Icons.header.png + icon[1]}');
  vertical-align: top;
  #{margin}
}\n
"""
    css.join ""

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

  filter: (text, background) ->

    css = (fg, bg) -> "
filter: url(\"
data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='filters' color-interpolation-filters='sRGB'><feColorMatrix values='
#{bg.r} #{-fg.r} 0 0 #{fg.r}
 #{bg.g} #{-fg.g} 0 0 #{fg.g}
 #{bg.b} #{-fg.b} 0 0 #{fg.b}
 0 0 0 1 0' /></filter></svg>#filters
\");
"

    fgHex = Style.colorToHex text
    bgHex = Style.colorToHex background
    css {
      r: Number(parseInt(fgHex.substr(0, 2), 16) / 255).toFixed 1
      g: Number(parseInt(fgHex.substr(2, 2), 16) / 255).toFixed 1
      b: Number(parseInt(fgHex.substr(4, 2), 16) / 255).toFixed 1
    }, {
      r: Number(parseInt(bgHex.substr(0, 2), 16) / 255).toFixed 1
      g: Number(parseInt(bgHex.substr(2, 2), 16) / 255).toFixed 1
      b: Number(parseInt(bgHex.substr(4, 2), 16) / 255).toFixed 1
    }

  addStyle: (theme) ->
    _conf = Conf
    unless theme
      theme = Themes[_conf['theme']]

    MascotTools.init _conf["mascot"]
    Style.layoutCSS.textContent = Style.layout()
    Style.themeCSS.textContent  = Style.theme(theme)
    Style.iconPositions()

  setup: ->
    if d.head
      @addStyleReady()
      @remStyle()
      if Style.headCount > 8
        @cleanup()
        return
    @observe()

  headCount: 0

  cleanup: ->
    delete Style.setup
    delete Style.observe
    delete Style.wrapper
    delete Style.remStyle
    delete Style.headCount
    delete Style.cleanup
    
  observe: ->
    if MutationObserver
      observer = new MutationObserver onMutationObserver = @wrapper
      observer.observe d,
        childList: true
        subtree:   true
    else
      $.on d, 'DOMNodeInserted', @wrapper
      
  wrapper: ->
    if d.head
      if Style.addStyleReady
        Style.addStyleReady()

      Style.remStyle()

      if Style.headcount > 8

        if observer
          observer.disconnect()
        else
          $.off d, 'DOMNodeInserted', Style.wrapper

        Style.cleanup()

  addStyleReady: ->
    theme = Themes[Conf['theme']]
    $.extend Style,
      layoutCSS:    $.addStyle Style.layout(),     'layout'
      themeCSS:     $.addStyle Style.theme(theme), 'theme'
      icons:        $.addStyle "",                 'icons'
      paddingSheet: $.addStyle "",                 'padding'
      mascot:       $.addStyle "",                 'mascotSheet'

    # As JSColor doesn't really have any customization,
    # we don't save its sheet as a variable.
    $.addStyle Style.jsColorCSS(),                 'jsColor'
    
    delete Style.addStyleReady

  remStyle: ->
    head  = d.head
    nodes = head.children
    len   = nodes.length
    i     = 0
    while i < len
      break if Style.headCount > 8
      node = nodes[i]
      if (node.nodeName is 'style' and !node.id) or "#{node.rel}".contains 'stylesheet'
        Style.headCount++
        $.rm node
        len--
        continue
      i++

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
          
      $.prepend title, child
      
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