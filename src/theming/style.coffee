Style =
  init: ->
    @agent = {
      'gecko':  '-moz-'
      'webkit': '-webkit-'
      'presto': '-o-'
    }[$.engine]

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
    
    Main.callbacks.push @node
    @setup()

  setup: ->
    if d.head
      @addStyleReady()
      @remStyle()
      unless Style.headCount
        return @cleanup()
    @observe()

  observe: ->
    if MutationObserver
      Style.observer = new MutationObserver onMutationObserver = @wrapper
      Style.observer.observe d,
        childList: true
        subtree:   true
    else
      $.on d, 'DOMNodeInserted', @wrapper

  wrapper: ->
    if d.head
      if Style.addStyleReady
        Style.addStyleReady()

      Style.remStyle()

      if not Style.headCount or d.readyState is 'complete'
        if Style.observer
          Style.observer.disconnect()
        else
          $.off d, 'DOMNodeInserted', Style.wrapper
        Style.cleanup()

  cleanup: ->
    delete Style.observe
    delete Style.wrapper
    delete Style.remStyle
    delete Style.headCount
    delete Style.cleanup

  addStyle: (theme) ->
    _conf = Conf
    unless theme
      theme = Themes[_conf['theme']]

    MascotTools.init _conf["mascot"]
    Style.layoutCSS.textContent = Style.layout()
    Style.themeCSS.textContent  = Style.theme(theme)
    Style.iconPositions()

  headCount: 12

  addStyleReady: ->
    theme = Themes[Conf['theme']]
    $.extend Style,
      layoutCSS:    $.addStyle Style.layout(),     'layout'
      themeCSS:     $.addStyle Style.theme(theme), 'theme'
      icons:        $.addStyle "",                 'icons'
      paddingSheet: $.addStyle "",                 'padding'
      mascot:       $.addStyle "",                 'mascotSheet'

    # Non-customizable
    $.addStyle Style.jsColorCSS(),                 'jsColor'

    delete Style.addStyleReady

  remStyle: ->
    nodes = d.head.children
    i     = nodes.length
    while i--
      break unless Style.headCount
      node = nodes[i]
      if (node.nodeName is 'STYLE' and !node.id) or ("#{node.rel}".contains('stylesheet') and node.href[..3] isnt 'data')
        Style.headCount--
        $.rm node
        continue
    return

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
  
  node: (post) ->
    Style.rice post.el

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
      r: parseInt(fgHex.substr(0, 2), 16) / 255
      g: parseInt(fgHex.substr(2, 2), 16) / 255
      b: parseInt(fgHex.substr(4, 2), 16) / 255
    }, {
      r: parseInt(bgHex.substr(0, 2), 16) / 255
      g: parseInt(bgHex.substr(2, 2), 16) / 255
      b: parseInt(bgHex.substr(4, 2), 16) / 255
    }

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

  iconPositions: ->
    css = """
#navtopright .exlinksOptionsLink::after,
#settingsWindowLink,
div.navLinks > a:first-of-type::after,
#{if Conf['Slideout Watcher'] then '#watcher::after,' else ''}
#{if Conf['Announcements'] is 'slideout' then '#globalMessage::after,' else ''}
#boardNavDesktopFoot::after,
body > a[style="cursor: pointer; float: right;"]::after,
#imgControls label:first-of-type::after,
#catalog::after,
#fappeTyme {
  position: fixed;
  display: block;
  width: 15px;
  height: 15px;
  content: "";
  overflow: hidden;
  opacity: #{if Conf['Invisible Icons'] then 0 else 0.5};
}
#imgControls {
  position: fixed;
}
#settingsWindowLink {
  visibility: visible;
  background-position: 0 0;
}
div.navLinks > a:first-of-type::after {
  visibility: visible;
  cursor: pointer;
  background-position: 0 -15px;
}
#watcher::after {
  background-position: 0 -30px;
}
#globalMessage::after {
  background-position: 0 -45px;
}
#boardNavDesktopFoot::after {
  background-position: 0 -60px;
}
body > a[style="cursor: pointer; float: right;"]::after {
  visibility: visible;
  cursor: pointer;
  background-position: 0 -75px;
}
#imgControls label:first-of-type::after {
  position: static;
  background-position: 0 -90px;
}
#navtopright .exlinksOptionsLink::after {
  background-position: 0 -105px;
}
#catalog::after {
  visibility: visible;
  background-position: 0 -120px;
}
#fappeTyme {
  background-position: 0 -135px;
}
#boardNavDesktopFoot:hover::after,
#globalMessage:hover::after,
#imgControls label:hover:first-of-type::after,
#navlinks a:hover,
#settingsWindowLink:hover,
#navtopright .exlinksOptionsLink:hover::after,
#qr #qrtab,
#watcher:hover::after,
.thumbnail#selected,
body > a[style="cursor: pointer; float: right;"]:hover::after,
div.navLinks > a:first-of-type:hover::after,
#catalog:hover::after,
#fappeTyme:hover {
  opacity: 1;
}
"""
    i = 0
    align = Style.sidebarLocation[0]

    _conf = Conf
    notCatalog = !g.CATALOG
    notEither  = notCatalog and g.BOARD isnt 'f'

    aligner = (first, spacer, checks) ->
      # Create a position to hold values
      position = [first]

      # Check which elements we actually have. Some are easy, because the script creates them so we'd know they're here
      # Some are hard, like 4sight, which we have no way of knowing if available without looking for it.
      for enabled in checks
        position[position.length] =
          if enabled
            first += spacer
          else
            first

      position

    if _conf["Icon Orientation"] is "horizontal"
      if align is 'left'
        first  = 231 + Style.sidebarOffset.W
        spacer = -19

      else
        first  = 2
        spacer = 19

      position = aligner(
        first
        spacer
        [
          true
          _conf['Slideout Navigation'] isnt 'hide'
          _conf['Announcements'] is 'slideout' and $ '#globalMessage', d.body
          notCatalog and _conf['Slideout Watcher'] and _conf['Thread Watcher']
          $ '#navtopright .exlinksOptionsLink', d.body
          notCatalog and $ 'body > a[style="cursor: pointer; float: right;"]', d.body
          notEither and _conf['Image Expansion']
          notEither
          g.REPLY
          notEither and _conf['Fappe Tyme']
          navlinks = ((!g.REPLY and _conf['Index Navigation']) or (g.REPLY and _conf['Reply Navigation'])) and notCatalog
          navlinks
        ]
      )

      iconOffset =
        if align is 'left'
          250 - Style.sidebar
        else
          position[position.length - 1] - (if _conf['4chan SS Sidebar']
            0
          else
            Style.sidebar + parseInt(_conf["Right Thread Padding"], 10))
      if iconOffset < 0 then iconOffset = 0

      css += """
div.navLinks > a:first-of-type::after {
  z-index: 99 !important;
}
#prefetch {
  z-index: 9;
}
/* 4chan X Options */
#settingsWindowLink {
  #{align}: #{position[i++]}px;
}
/* Slideout Navigation */
#boardNavDesktopFoot::after {
  #{align}: #{position[i++]}px;
}
/* Global Message */
#globalMessage::after {
  #{align}: #{position[i++]}px;
}
/* Watcher */
#watcher::after {
  #{align}: #{position[i++]}px;
}
/* ExLinks */
#navtopright .exlinksOptionsLink::after {
  #{align}: #{position[i++]}px;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  #{align}: #{position[i++]}px;
}
/* Expand Images */
#imgControls {
  #{align}: #{position[i++]}px;
}
/* 4chan Catalog */
#catalog::after {
  #{align}: #{position[i++]}px;
}
/* Back */
div.navLinks > a:first-of-type::after {
  #{align}: #{position[i++]}px;
}
/* Fappe Tyme */
#fappeTyme {
  #{align}: #{position[i++]}px;
}
/* Thread Navigation Links */
#navlinks a {
  margin: 2px;
  top: 2px;
}
#navlinks a:last-of-type {
  #{align}: #{position[i++]}px;
}
#navlinks a:first-of-type {
  #{align}: #{position[i++]}px;
}
#prefetch {
  width: #{248 + Style.sidebarOffset.W}px;
  #{align}: 2px;
  top: 20px;
  text-align: #{Style.sidebarLocation[1]};
}
#boardNavDesktopFoot::after,
#navtopright .exlinksOptionsLink::after,
#settingsWindowLink,
#watcher::after,
#globalMessage::after,
#imgControls,
#fappeTyme,
div.navLinks > a:first-of-type::after,
#catalog::after,
body > a[style="cursor: pointer; float: right;"]::after {
  top: 2px !important;
}
#{if _conf["Announcements"] is "slideout" then "#globalMessage," else ""}
#{if _conf["Slideout Watcher"] then "#watcher," else ""}
#boardNavDesktopFoot {
  top: 16px !important;
  z-index: 98 !important;
}
#globalMessage:hover,
#{if _conf["Slideout Watcher"] then "#watcher:hover," else ""}
#boardNavDesktopFoot:hover {
  z-index: 99 !important;
}
#{if _conf['Boards Navigation'] is 'top' or _conf['Boards Navigation'] is 'sticky top' then '#boardNavDesktop' else if _conf['Pagination'] is 'top' or _conf['Pagination'] is 'sticky top' then '.pagelist'} {
  padding-#{align}: #{iconOffset}px;
}\n
"""

      if _conf["Updater Position"] isnt 'moveable'
        css += """
/* Updater + Stats */
#updater,
#stats {
  #{align}: 2px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  top: auto !important;
  bottom: auto !important;
  #{_conf["Updater Position"]}: 1.6em !important;
}
"""
    else

      position = aligner(
        2 + (if _conf["4chan Banner"] is "at sidebar top" then (Style.logoOffset + 19) else 0)
        19
        [
          notEither and _conf['Image Expansion']
          true
          _conf['Slideout Navigation'] isnt 'hide'
          _conf['Announcements'] is 'slideout' and $ '#globalMessage', d.body
          notCatalog and _conf['Slideout Watcher'] and _conf['Thread Watcher']
          notCatalog and $ 'body > a[style="cursor: pointer; float: right;"]', d.body
          $ '#navtopright .exlinksOptionsLink', d.body
          notEither
          g.REPLY
          notEither and _conf['Fappe Tyme']
          navlinks = ((!g.REPLY and _conf['Index Navigation']) or (g.REPLY and _conf['Reply Navigation'])) and notCatalog
          navlinks
        ]
      )

      iconOffset = 20 - (if _conf['4chan SS Sidebar']
        0
      else
        Style.sidebar + parseInt _conf[align.capitalize() + " Thread Padding"], 10)

      css += """
div.navLinks > a:first-of-type::after {
  z-index: 89 !important;
}
#prefetch {
  z-index: 95;
}
/* Image Expansion */
#imgControls {
  top: #{position[i++]}px;
}
/* 4chan X Options */
#settingsWindowLink {
  top: #{position[i++]}px;
}
/* Slideout Navigation */
#boardNavDesktopFoot,
#boardNavDesktopFoot::after {
  top: #{position[i++]}px;
}
/* Global Message */
#globalMessage,
#globalMessage::after {
  top: #{position[i++]}px;
}
/* Watcher */
#{if _conf["Slideout Watcher"] then "#watcher, #watcher::after" else ""} {
  top: #{position[i++]}px !important;
}
/* 4sight */
body > a[style="cursor: pointer; float: right;"]::after {
  top: #{position[i++]}px;
}
/* ExLinks */
#navtopright .exlinksOptionsLink::after {
  top: #{position[i++]}px;
}
/* 4chan Catalog */
#catalog::after {
  top: #{position[i++]}px;
}
/* Back */
div.navLinks > a:first-of-type::after {
  top: #{position[i++]}px;
}
/* Fappe Tyme */
#fappeTyme {
  top: #{position[i++]}px;
}
/* Thread Navigation Links */
#navlinks a:first-of-type {
  top: #{position[i++]}px !important;
}
#navlinks a:last-of-type {
  top: #{position[i++]}px !important;
}
#prefetch {
  width: #{248 + Style.sidebarOffset.W}px;
  #{align}: 2px;
  top: 1px;
  text-align: #{Style.sidebarLocation[1]};
}
#navlinks a,
#navtopright .exlinksOptionsLink::after,
#settingsWindowLink,
#boardNavDesktopFoot::after,
#globalMessage::after,
#imgControls,
#fappeTyme,
#{if _conf["Slideout Watcher"] then "#watcher::after," else ""}
body > a[style="cursor: pointer; float: right;"]::after,
#catalog::after,
div.navLinks > a:first-of-type::after {
  #{align}: 3px !important;
}
#boardNavDesktopFoot {
  z-index: 97 !important;
}
#globalMessage {
  z-index: 98 !important;
}
#watcher {
  z-index: #{if _conf["Slideout Watcher"] then "99" else "10"} !important;
}
#{if _conf["Slideout Watcher"] then "#watcher:hover," else ""}
#boardNavDesktopFoot:hover,
#globalMessage:hover {
  z-index: 100 !important;
}
#boardNavDesktopFoot,
#globalMessage,
#watcher {
  width: #{233 + Style.sidebarOffset.W}px !important;
  #{align}: 18px !important;
}
#{if _conf['Boards Navigation'] is 'top' or _conf['Boards Navigation'] is 'sticky top' then '#boardNavDesktop' else if _conf['Pagination'] is 'top' or _conf['Pagination'] is 'sticky top' then '.pagelist'} {
  padding-#{align}: #{iconOffset}px;
}
"""

      if _conf["Updater Position"] isnt 'moveable'
        css += """
/* Updater + Stats */
#updater,
#stats {
  #{align}: #{if _conf["Updater Position"] is "top" then "24" else "2"}px !important;
  #{Style.sidebarLocation[1]}: auto !important;
  top: #{if _conf["Updater Position"] == "top" then "1px" else "auto"} !important;
  bottom: #{if _conf["Updater Position"] == "bottom" then "2px" else "auto"} !important;
  #{if _conf["Updater Position"] == "top" then "z-index: 96 !important;"}
}
"""

    Style.icons.textContent = css

  layout: ->

    _conf = Conf

    # Position of submenus in relation to the post menu.
    position = {
      right:
        {
          hide:
            if parseInt(_conf['Right Thread Padding'], 10) < 100
              "right"
            else
              "left"
          minimal: "right"
        }[_conf["Sidebar"]] or "left"
      left:
        if parseInt(_conf['Right Thread Padding'], 10) < 100
          "right"
        else
          "left"
    }[_conf["Sidebar Location"]]

    # Offsets various UI of the sidebar depending on the sidebar's width.
    # Only really used for the board banner or right sidebar.
    Style['sidebarOffset'] = if _conf["Sidebar"] is "large"
      {
        W: 51
        H: 17
      }
    else
      {
        W: 0
        H: 0
      }

    Style.logoOffset =
      if _conf["4chan Banner"] is "at sidebar top"
        83 + Style.sidebarOffset.H
      else
        0

    Style.sidebarLocation = if _conf["Sidebar Location"] is "left"
      ["left",  "right"]
    else
      ["right", "left" ]

    if _conf['editMode'] is "theme"
      editSpace = {}
      editSpace[Style.sidebarLocation[1]] = 300
      editSpace[Style.sidebarLocation[0]] = 0
    else
      editSpace =
        left:   0
        right:  0

    Style.sidebar = {
      minimal:  20
      hide:     2
    }[_conf.Sidebar] or (252 + Style.sidebarOffset.W)

    Style.replyMargin = {
      minimal:  1
      small:    2
      medium:   4
      large:    8
    }[_conf["Reply Spacing"]] or 0

    css = """
/* Cleanup */
#postForm,
.fileText:hover .fntrunc,
.fileText:not(:hover) .fnfull,
.hidden,
.hidden_thread ~ div,
.hidden_thread ~ a,
.mobile,
.postingMode,
.riced,
.sideArrows,
[hidden] {
  display: none;
}
/* Defaults */
a {
  text-decoration: none;
}
body {
  font-size: #{parseInt(_conf["Font Size"], 10)}px;
  font-family: #{_conf["Font"]};
  min-height: 100%;
  margin-top: 1px;
  margin-bottom: 1px;
  margin-#{Style.sidebarLocation[0]}: #{Style.sidebar}px;
  margin-#{Style.sidebarLocation[1]}: 2px;
  padding: 0 #{parseInt(_conf["Right Thread Padding"], 10) + editSpace["right"]}px 0 #{parseInt(_conf["Left Thread Padding"], 10) + editSpace["left"]}px;
}
hr {
  clear: both;
}
/* Symbols */
.dropmarker {
  display: inline-block;
  margin: 2px 2px 3px;
  border-top: .5em solid;
  border-right: .3em solid transparent;
  border-left: .3em solid transparent;
}
/* Dialogs */
#iHover,
#qp,
#qr {
  position: fixed;
}
#globalMessage {

}
#updater {
  position: fixed;
}
#watcher {
  position: fixed;
}
#menu {
  position: absolute
}
/* Posts */
.summary {
margin-bottom: #{Style.replyMargin}px;
}
.postContainer {
margin-bottom: #{Style.replyMargin}px;
}
.hide_reply_button {
  float: right;
  margin: 0 3px;
}
.post .menu_button {
  float: right;
  margin: 0 3px;
}
.fileThumb {
  float: left;
  margin: 3px 20px;
}
.reply.post {
  display: inline-block;
  #{if _conf["Fit Width Replies"] then "width: 100%;" else ""}
}
/* Reply Clearfix */
.reply.post blockquote {
  clear: right;
}
/* Element Replacing */
/* Checkboxes */
.rice {
  cursor: pointer;
  width: 9px;
  height: 9px;
  margin: 2px 3px;
  display: inline-block;
  vertical-align: bottom;
}
input:checked + .rice {
  background-attachment: scroll;
  background-repeat: no-repeat;
  background-position: bottom right;
}
/* Selects */
.selectrice {
  position: relative;
  cursor: default;
  overflow: hidden;
  text-align: left;
}
.selectrice::after {
  content: "";
  border-right: .25em solid transparent;
  border-left: .25em solid transparent;
  position: absolute;
  right: .4em;
  top: .5em;
}
.selectrice::before {
  content: "";
  height: 1.7em;
  position: absolute;
  right: 1.3em;
  top: 0;
}
/* Select Dropdown */
.selectrice ul {
  padding: 0;
  position: fixed;
  max-height: 120px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 99999;
}

/* Post Form */

"""

  theme: (theme) ->
    _conf = Conf

    bgColor = new Style.color Style.colorToHex backgroundC = theme["Background Color"]

    Style.lightTheme = bgColor.isLight()

    icons = Icons.header.png + Icons.themes[_conf["Icons"]][if Style.lightTheme then "light" else "dark"]

    css = """
.hide_thread_button span > span,
.hide_reply_button span > span {
  background-color: #{theme["Links"]};
}
#mascot_hide label {
  border-bottom: 1px solid #{theme["Reply Border"]};
}
#content .thumb {
  box-shadow: 0 0 5px #{theme["Reply Border"]};
}
.mascotname,
.mascotoptions {
  background: #{theme["Dialog Background"]};
  border: 1px solid #{theme["Buttons Border"]};
}
.opContainer.filter_highlight {
  box-shadow: inset 5px 0 #{theme["Backlinked Reply Outline"]};
}
.filter_highlight > .reply {
  box-shadow: -5px 0 #{theme["Backlinked Reply Outline"]};
}
::#{Style.agent}selection {
  background: #{theme["Text"]};
  color: #{backgroundC};
}
hr {
  border-bottom: 1px solid #{theme["Reply Border"]};
}
a[style="cursor: pointer; float: right;"] + div[style^="width: 100%;"] > table > tbody > tr > td {
  background: #{backgroundC} !important;
  border: 1px solid #{theme["Reply Border"]} !important;
}
#fs_status {
  background: #{theme["Dialog Background"]} !important;
}
#fs_data tr[style="background-color: #EA8;"] {
  background: #{theme["Reply Background"]} !important;
}
#fs_data,
#fs_data * {
  border-color: #{theme["Reply Border"]} !important;
}
html {
  background: #{backgroundC or ''};
  background-image: #{theme["Background Image"] or ''};
  background-repeat: #{theme["Background Repeat"] or ''};
  background-attachment: #{theme["Background Attachment"] or ''};
  background-position: #{theme["Background Position"] or ''};
}
#optionsContent,
#exlinks-options-content,
#mascotcontent,
#themecontent {
  background: #{backgroundC};
  border: 1px solid #{theme["Reply Border"]};
  padding: 5px;
}
#selected_tab {
  background: #{backgroundC};
  border-color: #{theme["Reply Border"]};
  border-style: solid;
}
.captchaimg img {
  #{Style.filter theme["Text"], theme["Input Background"]}
}
#boardTitle,
#prefetch,
#showQR,
#{unless _conf["Post Form Decorations"] then '#spoilerLabel,' else ''}
#stats,
#updater:not(:hover) .move {
  text-shadow:
     1px  1px 0 #{backgroundC},
    -1px -1px 0 #{backgroundC},
     1px -1px 0 #{backgroundC},
    -1px  1px 0 #{backgroundC},
     0    1px 0 #{backgroundC},
     0   -1px 0 #{backgroundC},
     1px  0   0 #{backgroundC},
    -1px  0   0 #{backgroundC}
    #{if _conf["Sidebar Glow"] then ", 0 2px 5px #{theme['Text']};" else ";"}
}
/* Fixes text spoilers */


    #{if _conf['Remove Spoilers'] and _conf['Indicate Spoilers'] then "
.spoiler::before,
s::before {
  content: '[spoiler]';
}
.spoiler::after,
s::after {
  content: '[/spoiler]';
}
" else unless _conf['Remove Spoilers'] then "
.spoiler:not(:hover) *,
s:not(:hover) * {
  color: rgb(0,0,0) !important;
  text-shadow: none !important;
}
.spoiler,
s {
  color: rgb(0,0,0);
  background-color: rgb(0,0,0);
}
.spoiler:hover,
s:hover {
  color: #{theme["Text"]};
  background-color: transparent;
}" else ""}
#exlinks-options,
#options,
#qrtab,
#{if _conf["Post Form Decorations"] then "#qr," else ""}
#updater:hover,
input[type="submit"],
input[value="Report"],
span[style="left: 5px; position: absolute;"] a {
  background: #{theme["Buttons Background"]};
  border: 1px solid #{theme["Buttons Border"]};
}
.enabled .mascotcontainer {
  background: #{theme["Buttons Background"]};
  border-color: #{theme["Buttons Border"]};
}
#dump,
#file,
#options input,
.captchaimg,
.dump #dump:not(:hover):not(:focus),
.selectrice,
button,
input,
textarea {
  background: #{theme["Input Background"]};
  border: 1px solid #{theme["Input Border"]};
  color: #{theme["Inputs"]};
}
#dump:hover,
#file:hover,
#options .selectrice li:nth-of-type(2n+1):hover,
.selectrice:hover,
.selectrice li:hover,
input:hover,
textarea:hover {
  background: #{theme["Hovered Input Background"]};
  border-color: #{theme["Hovered Input Border"]};
  color: #{theme["Inputs"]};
}
#dump:active,
#dump:focus,
.selectrice:focus,
.selectrice li:focus,
input:focus,
textarea:focus,
textarea.field:focus {
  background: #{theme["Focused Input Background"]};
  border-color: #{theme["Focused Input Border"]};
  color: #{theme["Inputs"]};
}
#mouseover,
#post-preview,
#qp .post,
#xupdater,
.reply.post {
  border: 1px solid #{theme["Reply Border"]};
  background: #{theme["Reply Background"]};
}
.exblock.reply,
.reply.post.highlight,
.reply.post:target {
  background: #{theme["Highlighted Reply Background"]};
  border: 1px solid #{theme["Highlighted Reply Border"]};
}
#boardNavDesktop,
.pagelist {
  background: #{theme["Navigation Background"]};
  border: 1px solid #{theme["Navigation Border"]};
}
#delform {
  background: #{theme["Thread Wrapper Background"]};
  border: 1px solid #{theme["Thread Wrapper Border"]};
}
#boardNavDesktopFoot,
#mascotConf,
#mascot_hide,
#menu,
#selectrice,
#themeConf,
#watcher,
#watcher:hover,
.subMenu,
a[style="cursor: pointer; float: right;"] ~ div[style^="width: 100%;"] > table {
  background: #{theme["Dialog Background"]};
  border: 1px solid #{theme["Dialog Border"]};
}
#qr .warning {
  background: #{theme["Input Background"]};
  border: 1px solid #{theme["Input Border"]};
}
.disabledwarning,
.warning {
  color: #{theme["Warnings"]};
}
#navlinks a:first-of-type {
  border-bottom: 11px solid rgb(#{if Style.lightTheme then "130,130,130" else "230,230,230"});
}
#navlinks a:last-of-type {
  border-top: 11px solid rgb(#{if Style.lightTheme then "130,130,130" else "230,230,230"});
}
#charCount {
  color: #{(if Style.lightTheme then "rgba(0,0,0,0.7)" else "rgba(255,255,255,0.7)")};
}
.postNum a {
  color: #{theme["Post Numbers"]};
}
.subject {
  color: #{theme["Subjects"]} !important;
  #{if _conf["Bolds"] then 'font-weight: 600;' else ''}
}
.dateTime,
.post-ago {
  color: #{theme["Timestamps"]} !important;
}
#fs_status a,
#imgControls label::after,
#updater #count:not(.new)::after,
#showQR,
#updater,
.abbr,
.boxbar,
.boxcontent,
.pages strong,
.pln,
.reply,
.reply.highlight,
.summary,
body,
button,
span[style="left: 5px; position: absolute;"] a,
input,
textarea {
  color: #{theme["Text"]};
}
#exlinks-options-content > table,
#options ul,
.selectrice ul {
  border-bottom: 1px solid #{theme["Reply Border"]};
  box-shadow: inset #{theme["Shadow Color"]} 0 0 5px;
}
.quote + .spoiler:hover,
.quote {
  color: #{theme["Greentext"]};
}
.forwardlink {
  text-decoration: none;
  border-bottom: 1px dashed #{theme["Backlinks"]};
}
.container::before {
  color: #{theme["Timestamps"]};
}
#menu,
#post-preview,
#qp .opContainer,
#qp .replyContainer,
.subMenu {
  box-shadow: #{if _conf['Quote Shadows'] then "5px 5px 5px #{theme['Shadow Color']}" else ""};
}
.rice {
  background: #{theme["Checkbox Background"]};
  border: 1px solid #{theme["Checkbox Border"]};
}
.selectrice::before {
  border-left: 1px solid #{theme["Input Border"]};
}
.selectrice::after {
  border-top: .45em solid #{theme["Inputs"]};
}
#updater input,
.bd {
  background: #{theme["Buttons Background"]};
  border: 1px solid #{theme["Buttons Border"]};
}
.pages a,
#boardNavDesktop a {
  color: #{theme["Navigation Links"]};
}
input[type=checkbox]:checked + .rice {
  background: #{theme["Checkbox Checked Background"]};
  background-image: url(#{Icons.header.png + (if Style.lightTheme then "AkAAAAJCAMAAADXT/YiAAAAWlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLSV5RAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==" else "AkAAAAJCAMAAADXT/YiAAAAWlBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jZLFEAAAAHXRSTlMAgVHwkF11LdsM9vm9n5x+ye0qMOfk/GzqSMC6EsZzJYoAAABBSURBVHheLcZHEoAwEMRArcHknNP8/5u4MLqo+SszcBMwFyt57cFXamjV0UtyDBotIIVFiiAJ33aijhOA67bnwwuZdAPNxckOUgAAAABJRU5ErkJggg==")});
}
#dump,
.button,
.entry,
.replylink,
a {
  color: #{theme["Links"]};
}
.backlink {
  color: #{theme["Backlinks"]};
}
.qiQuote,
.quotelink {
  color: #{theme["Quotelinks"]};
}
#dump:hover,
.entry:hover,
.sideArrows a:hover,
.replylink:hover,
.qiQuote:hover,
.quotelink:hover,
a .name:hover,
a .postertrip:hover,
a:hover {
  color: #{theme["Hovered Links"]};
}
#boardNavDesktop a:hover,
#boardTitle a:hover {
  color: #{theme["Hovered Navigation Links"]};
}
#boardTitle {
  color: #{theme["Board Title"]};
}
.name,
.post-author {
  color: #{theme["Names"]} !important;
}
.post-tripcode,
.postertrip,
.trip {
  color: #{theme["Tripcodes"]} !important;
}
a .postertrip,
a .name {
  color: #{theme["Emails"]};
}
.post.reply.qphl,
.post.op.qphl {
  border-color: #{theme["Backlinked Reply Outline"]};
  background: #{theme["Highlighted Reply Background"]};
}
.inline .post {
  box-shadow: #{if _conf['Quote Shadows'] then "5px 5px 5px #{theme['Shadow Color']}" else  ""};
}
.placeholder,
#qr input::#{Style.agent}placeholder,
#qr textarea::#{Style.agent}placeholder {
  color: #{if Style.lightTheme then "rgba(0,0,0,0.3)" else "rgba(255,255,255,0.2)"} !important;
}
#qr input:#{Style.agent}placeholder,
#qr textarea:#{Style.agent}placeholder,
.placeholder {
  color: #{if Style.lightTheme then "rgba(0,0,0,0.3)" else "rgba(255,255,255,0.2)"} !important;
}
#options ul,
.boxcontent dd,
.selectrice ul {
  border-color: #{if Style.lightTheme then "rgba(0,0,0,0.1)" else "rgba(255,255,255,0.1)"};
}
#options li,
.selectrice li:not(:first-of-type) {
  border-top: 1px solid #{if Style.lightTheme then "rgba(0,0,0,0.05)" else "rgba(255,255,255,0.025)"};
}
#mascot img {
  #{Style.agent}transform: scaleX(#{(if Style.sidebarLocation[0] is "left" then "-" else "")}1);
}

#navtopright .exlinksOptionsLink::after,
#settingsWindowLink,
.navLinks > a:first-of-type::after,
#watcher::after,
#globalMessage::after,
#boardNavDesktopFoot::after,
a[style="cursor: pointer; float: right;"]::after,
#imgControls label:first-of-type::after,
#catalog::after,
#fappeTyme {
  background-image: url('#{icons}');
}
#{theme["Custom CSS"]}\n
"""

    css += (if Style.lightTheme then """
.prettyprint {
  background-color: #e7e7e7;
  border: 1px solid #dcdcdc;
}
.com {
  color: #dd0000;
}
.str,
.atv {
  color: #7fa61b;
}
.pun {
  color: #61663a;
}
.tag {
  color: #117743;
}
.kwd {
  color: #5a6F9e;
}
.typ,
.atn {
  color: #9474bd;
}
.lit {
  color: #368c72;
}\n
""" else """
.prettyprint {
  background-color: rgba(0,0,0,.1);
  border: 1px solid rgba(0,0,0,0.5);
}
.tag {
  color: #96562c;
}
.pun {
  color: #5b6f2a;
}
.com {
  color: #a34443;
}
.str,
.atv {
  color: #8ba446;
}
.kwd {
  color: #987d3e;
}
.typ,
.atn {
  color: #897399;
}
.lit {
  color: #558773;
}\n
""")

    if _conf["Alternate Post Colors"]
      css += """
.replyContainer:not(.hidden):nth-of-type(2n+1) .post {
  background-image: #{Style.agent}linear-gradient(#{if Style.lightTheme then "rgba(0,0,0,0.05), rgba(0,0,0,0.05)" else "rgba(255,255,255,0.02), rgba(255,255,255,0.02)"});
}\n
"""

    if _conf["Color Reply Headings"]
      css += """
.postInfo {
  background: #{if (replyHeading = new Style.color Style.colorToHex theme["Reply Background"]) then "rgb(" + (replyHeading.shiftRGB 16, true) + ")" else "rgba(0,0,0,0.1)"};
}\n"""

    if _conf["Color File Info"]
      css += """
.file {
  background: #{if (fileHeading = new Style.color Style.colorToHex theme["Reply Background"]) then "rgb(" + (fileHeading.shiftRGB 8, true) + ")" else "rgba(0,0,0,0.1)"};
}\n
"""
    if _conf["OP Background"]
      css += """
.op.post {
  background: #{theme["Reply Background"]};
  border: 1px solid #{theme["Reply Border"]};
}
.op.post:target
.op.post.highlight {
  background: #{theme["Highlighted Reply Background"]};
  border: 1px solid #{theme["Highlighted Reply Border"]};
}\n
"""
    if _conf["4chan SS Sidebar"]
      background = new Style.color Style.colorToHex theme["Reply Background"]
      css += """
body::before {
  background: none repeat scroll 0% 0% rgba(#{background.shiftRGB -18}, 0.8);
  border-#{Style.sidebarLocation[1]}: 2px solid #{backgroundC};
  box-shadow:
    #{if _conf["Sidebar Location"] is "right" then "inset" else ""}  1px 0 0 #{theme["Thread Wrapper Border"]},
    #{if _conf["Sidebar Location"] is "left"  then "inset" else ""} -1px 0 0 #{theme["Thread Wrapper Border"]};
}\n
"""

    css += {
      text: """
a.useremail[href*="sage"]:last-of-type::#{_conf["Sage Highlight Position"]},
a.useremail[href*="Sage"]:last-of-type::#{_conf["Sage Highlight Position"]},
a.useremail[href*="SAGE"]:last-of-type::#{_conf["Sage Highlight Position"]} {
  content: " (sage) ";
  color: #{theme["Sage"]};
}\n
"""
      image: """
a.useremail[href*="sage"]:last-of-type::#{_conf["Sage Highlight Position"]},
a.useremail[href*="Sage"]:last-of-type::#{_conf["Sage Highlight Position"]},
a.useremail[href*="SAGE"]:last-of-type::#{_conf["Sage Highlight Position"]} {
  content: url("#{Icons.header.png}A4AAAAOCAMAAAAolt3jAAABa1BMVEUAAACqrKiCgYIAAAAAAAAAAACHmX5pgl5NUEx/hnx4hXRSUVMiIyKwrbFzn19SbkZ1d3OvtqtpaWhcX1ooMyRsd2aWkZddkEV8vWGcpZl+kHd7jHNdYFuRmI4bHRthaV5WhUFsfGZReUBFZjdJazpGVUBnamYfHB9TeUMzSSpHgS1cY1k1NDUyOC8yWiFywVBoh1lDSEAZHBpucW0ICQgUHhBjfFhCRUA+QTtEQUUBAQFyo1praWspKigWFRZHU0F6j3E9Oz5VWFN0j2hncWONk4sAAABASDxJWkJKTUgAAAAvNC0fJR0DAwMAAAA9QzoWGhQAAAA8YytvrFOJsnlqyT9oqExqtkdrsExpsUsqQx9rpVJDbzBBbi5utk9jiFRuk11iqUR64k5Wf0JIZTpadk5om1BkyjmF1GRNY0FheFdXpjVXhz86XSp2yFJwslR3w1NbxitbtDWW5nNnilhFXTtYqDRwp1dSijiJ7H99AAAAUnRSTlMAJTgNGQml71ypu3cPEN/RDh8HBbOwQN7wVg4CAQZ28vs9EDluXjo58Ge8xwMy0P3+rV8cT73sawEdTv63NAa3rQwo4cUdAl3hWQSWvS8qqYsjEDiCzAAAAIVJREFUeNpFx7GKAQAYAOD/A7GbZVAWZTBZFGQw6LyCF/MIkiTdcOmWSzYbJVE2u1KX0J1v+8QDv/EkyS0yXF/NgeEILiHfyc74mICTQltqYXBeAWU9HGxU09YqqEvAElGjyZYjPyLqitjzHSEiGkrsfMWr0VLe+oy/djGP//YwfbeP8bN3Or0bkqEVblAAAAAASUVORK5CYII=");
  vertical-align: top;
  margin-#{if _conf["Sage Highlight Position"] is "before" then "right" else "left"}: #{parseInt _conf['Emoji Spacing']}px;
}\n
"""
      none: ""
    }[_conf["Sage Highlighting"]]
    if _conf["Announcements"] is "slideout"
      css += """
#globalMessage {
  background: #{theme["Dialog Background"]};
  border: 1px solid #{theme["Dialog Border"]};
}\n
"""
    if _conf["Post Form Style"] is "float" or _conf["Post Form Decorations"]
      css += """
#qr {
  border: 1px solid #{theme["Buttons Border"]};
  background: #{backgroundC};
  box-shadow: #{if _conf['Quote Shadows'] then "5px 5px 5px #{theme['Shadow Color']}" else  ""};
}\n
"""
    css