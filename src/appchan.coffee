Style =
  init: ->
    @agent = {
      'gecko': '-moz-'
      'webkit': '-webkit-'
      'presto': '-o-'
    }[$.engine]

    @sizing = "#{if $.engine is 'gecko' then @agent else ''}box-sizing"

    $.asap (-> d.body), MascotTools.init

    $.ready ->
      return unless $.id 'navtopright'
      Style.padding.nav = $ "#boardNavDesktop", d.body
      Style.padding.pages = $(".pagelist", d.body)
      Style.padding()
      $.on window, "resize", Style.padding

      # Give ExLinks and 4sight a little time to append their dialog links
      setTimeout (->
        Style.iconPositions()
        if exLink = $ "#navtopright .exlinksOptionsLink", d.body
          $.on exLink, "click", ->
            setTimeout Rice.nodes, 100
        ), 500

    @setup()

  setup: ->
    @addStyleReady()
    if d.head
      @remStyle()
      unless Style.headCount
        return @cleanup()
    @observe()

  observe: ->
    if MutationObserver
      Style.observer = new MutationObserver onMutationObserver = @wrapper
      Style.observer.observe d,
        childList: true
        subtree: true
    else
      $.on d, 'DOMNodeInserted', @wrapper

  wrapper: ->
    if d.head
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
    Style.themeCSS.textContent = Style.theme(theme)
    Style.iconPositions()

  headCount: 12

  addStyleReady: ->
    theme = Themes[Conf['theme']]
    $.extend Style,
      layoutCSS:    $.addStyle Style.layout(),      'layout'
      themeCSS:     $.addStyle Style.theme(theme),  'theme'
      icons:        $.addStyle "",                  'icons'
      paddingSheet: $.addStyle "",                  'padding'
      mascot:       $.addStyle "",                  'mascotSheet'

    # Non-customizable
    $.addStyle JSColor.css(), 'jsColor'

    delete Style.addStyleReady

  remStyle: ->
    nodes = d.head.children
    i = nodes.length
    while i--
      break unless Style.headCount
      node = nodes[i]
      if (node.nodeName is 'STYLE' and !node.id) or ("#{node.rel}".contains('stylesheet') and node.href[..3] isnt 'data')
        Style.headCount--
        $.rm node
        continue
    return

  filter: (text, background) ->

    matrix = (fg, bg) -> "
 #{bg.r} #{-fg.r} 0 0 #{fg.r}
 #{bg.g} #{-fg.g} 0 0 #{fg.g}
 #{bg.b} #{-fg.b} 0 0 #{fg.b}
"

    fgHex = Style.colorToHex(text)
    bgHex = Style.colorToHex(background)
    string = matrix {
      r: parseInt(fgHex.substr(0, 2), 16) / 255
      g: parseInt(fgHex.substr(2, 2), 16) / 255
      b: parseInt(fgHex.substr(4, 2), 16) / 255
    }, {
      r: parseInt(bgHex.substr(0, 2), 16) / 255
      g: parseInt(bgHex.substr(2, 2), 16) / 255
      b: parseInt(bgHex.substr(4, 2), 16) / 255
    }

    return """filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='filters' color-interpolation-filters='sRGB'><feColorMatrix values='#{string} 0 0 0 1 0' /></filter></svg>#filters");"""

  layout: ->
    _conf   = Conf
    agent   = Style.agent
    xOffset = if _conf["Sidebar Location"] is "left" then '-' else ''

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
    Style['sidebarOffset'] = if _conf['Sidebar'] is "large"
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

    width = 248 + Style.sidebarOffset.W

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
    }[_conf['Sidebar']] or (252 + Style.sidebarOffset.W)

    Style.replyMargin = _conf["Post Spacing"]

    css = """<%= grunt.file.read('css/layout.css') %>"""

  theme: (theme) ->
    _conf = Conf
    agent = Style.agent

    bgColor = new Style.color(Style.colorToHex(backgroundC = theme["Background Color"]) or 'aaaaaa')

    Style.lightTheme = bgColor.isLight()

    icons = "data:image/png;base64,#{Icons[_conf["Icons"]]}"

    css = """<%= grunt.file.read('css/theme.css') %>"""

    <%= grunt.file.read('css/themeoptions.css') %>

  iconPositions: ->
    css = """<%= grunt.file.read('css/icons.base.css') %>"""
    i = 0
    align = Style.sidebarLocation[0]

    _conf = Conf
    notCatalog = g.VIEW isnt 'catalog'
    notEither  = notCatalog and g.BOARD isnt 'f'

    aligner = (first, checks) ->
      # Create a position to hold values
      position = [first]

      # Check which elements we actually have. Some are easy, because the script creates them so we'd know they're here
      # Some are hard, like 4sight, which we have no way of knowing if available without looking for it.
      for enabled in checks
        position.push(
          if enabled
            first += 19
          else
            first
        )

      position

    if _conf["Icon Orientation"] is "horizontal"

      position = aligner(
        2
        [
          notCatalog
          _conf['Slideout Navigation'] isnt 'hide'
          _conf['Announcements'] is 'slideout' and $ '#globalMessage', d.body
          notCatalog and _conf['Slideout Watcher'] and _conf['Thread Watcher']
          $ '#navtopright .exlinksOptionsLink', d.body
          notCatalog and $ 'body > a[style="cursor: pointer; float: right;"]', d.body
          notEither and _conf['Image Expansion']
          notEither and _conf['Image Expansion']
          notEither
          g.VIEW is 'thread'
          notEither and _conf['Fappe Tyme']
          navlinks = ((g.VIEW isnt 'thread' and _conf['Index Navigation']) or (g.VIEW is 'thread' and _conf['Reply Navigation'])) and notCatalog
          navlinks
        ]
      )

      iconOffset =
        position[position.length - 1] - (if _conf['4chan SS Navigation']
          0
        else
          Style.sidebar + parseInt(_conf["Right Thread Padding"], 10))
      if iconOffset < 0 then iconOffset = 0

      css += """<%= grunt.file.read('css/icons.horz.css') %>"""

      if _conf["Updater Position"] isnt 'moveable'
        css += """<%= grunt.file.read('css/icons.horz.tu.css') %>"""
    else

      position = aligner(
        2 + (if _conf["4chan Banner"] is "at sidebar top" then (Style.logoOffset + 19) else 0)
        [
          notEither and _conf['Image Expansion']
          notEither and _conf['Image Expansion']
          notCatalog
          _conf['Slideout Navigation'] isnt 'hide'
          _conf['Announcements'] is 'slideout' and $ '#globalMessage', d.body
          notCatalog and _conf['Slideout Watcher'] and _conf['Thread Watcher']
          notCatalog and $ 'body > a[style="cursor: pointer; float: right;"]', d.body
          $ '#navtopright .exlinksOptionsLink', d.body
          notEither
          g.VIEW is 'thread'
          notEither and _conf['Fappe Tyme']
          navlinks = ((g.VIEW isnt 'thread' and _conf['Index Navigation']) or (g.VIEW is 'thread' and _conf['Reply Navigation'])) and notCatalog
          navlinks
        ]
      )

      iconOffset = (
        if g.VIEW is 'thread' and _conf['Prefetch']
          250 + Style.sidebarOffset.W
        else
          20 + (
            if g.VIEW is 'thread' and _conf['Updater Position'] is 'top'
              100
            else
              0
          )
      ) - (
        if _conf['4chan SS Navigation']
          0
        else
          Style.sidebar + parseInt _conf[align.capitalize() + " Thread Padding"], 10
      )

      css += """<%= grunt.file.read('css/icons.vert.css') %>"""

      if _conf["Updater Position"] isnt 'moveable'
        css += """<%= grunt.file.read('css/icons.vert.tu.css') %>"""

    Style.icons.textContent = css

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
  padding-bottom: 0;\n
"""

    if Style.padding.pages? and (_conf["Pagination"] is "sticky top" or _conf["Pagination"] is "sticky bottom" or _conf["Pagination"] is "top")
      css += "  padding-#{Style.padding.pages.property}: #{Style.padding.pages.offsetHeight}px;\n"

    unless _conf["Boards Navigation"] is "hide"
      css += "  padding-#{Style.padding.nav.property}: #{Style.padding.nav.offsetHeight}px;\n"

    css += "}"
    sheet.textContent = css


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

Emoji =
  init: ->
    Emoji.icons.not.push ['PlanNine', Emoji.icons.not[0][1]]

  css: (position) ->
    _conf = Conf
    css = []
    margin = "margin-#{if position is "before" then "right" else "left"}: #{parseInt _conf['Emoji Spacing']}px;"

    for key, category of Emoji.icons
      if (_conf['Emoji'] isnt "disable ponies" and key is "pony") or (_conf['Emoji'] isnt "only ponies" and key is "not")
        for icon in category
          name = icon[0]
          css[css.length] = """
a.useremail[href*='#{name}']:last-of-type::#{position},
a.useremail[href*='#{name.toLowerCase()}']:last-of-type::#{position},
a.useremail[href*='#{name.toUpperCase()}']:last-of-type::#{position} {
content: url('data:image/png;base64,#{icon[1]}');
vertical-align: top;
#{margin}
}\n
"""
    css.join ""

  icons:
    pony: [
      ['Pinkie',     '<%= grunt.file.read("img/emoji/pinkie.png",       {encoding: "base64"}) %>']
      ['Applejack',  '<%= grunt.file.read("img/emoji/applejack.png",    {encoding: "base64"}) %>']
      ['Fluttershy', '<%= grunt.file.read("img/emoji/fluttershy.png",   {encoding: "base64"}) %>']
      ['Twilight',   '<%= grunt.file.read("img/emoji/twilight.png",     {encoding: "base64"}) %>']
      ['Rainbow',    '<%= grunt.file.read("img/emoji/rainbow.png",      {encoding: "base64"}) %>']
      ['Rarity',     '<%= grunt.file.read("img/emoji/rarity.png",       {encoding: "base64"}) %>']
      ['Spike',      '<%= grunt.file.read("img/emoji/spike.png",        {encoding: "base64"}) %>']
    ]
    not: [
      ['Plan9',      '<%= grunt.file.read("img/emoji/plan9.png",        {encoding: "base64"}) %>']
      ['Neko',       '<%= grunt.file.read("img/emoji/neko.png",         {encoding: "base64"}) %>']
      ['Madotsuki',  '<%= grunt.file.read("img/emoji/madotsuki.png",    {encoding: "base64"}) %>']
      ['Sega',       '<%= grunt.file.read("img/emoji/sega.png",         {encoding: "base64"}) %>']
      ['Sakamoto',   '<%= grunt.file.read("img/emoji/sakamoto.png",     {encoding: "base64"}) %>']
      ['Baka',       '<%= grunt.file.read("img/emoji/baka.png",         {encoding: "base64"}) %>']
      ['Ponyo',      '<%= grunt.file.read("img/emoji/ponyo.png",        {encoding: "base64"}) %>']
      ['Rabite',     '<%= grunt.file.read("img/emoji/rabite.png",       {encoding: "base64"}) %>']
      ['Arch',       '<%= grunt.file.read("img/emoji/arch.png",         {encoding: "base64"}) %>']
      ['CentOS',     '<%= grunt.file.read("img/emoji/centos.png",       {encoding: "base64"}) %>']
      ['Debian',     '<%= grunt.file.read("img/emoji/debian.png",       {encoding: "base64"}) %>']
      ['Fedora',     '<%= grunt.file.read("img/emoji/fedora.png",       {encoding: "base64"}) %>']
      ['FreeBSD',    '<%= grunt.file.read("img/emoji/freebsd.png",      {encoding: "base64"}) %>']
      ['Gentoo',     '<%= grunt.file.read("img/emoji/gentoo.png",       {encoding: "base64"}) %>']
      ['Mint',       '<%= grunt.file.read("img/emoji/mint.png",         {encoding: "base64"}) %>']
      ['Osx',        '<%= grunt.file.read("img/emoji/osx.png",          {encoding: "base64"}) %>']
      ['Rhel',       '<%= grunt.file.read("img/emoji/rhel.png",         {encoding: "base64"}) %>']
      ['Sabayon',    '<%= grunt.file.read("img/emoji/sabayon.png",      {encoding: "base64"}) %>']
      ['Slackware',  '<%= grunt.file.read("img/emoji/slackware.png",    {encoding: "base64"}) %>']
      ['Trisquel',   '<%= grunt.file.read("img/emoji/trisquel.png",     {encoding: "base64"}) %>']
      ['Ubuntu',     '<%= grunt.file.read("img/emoji/ubuntu.png",       {encoding: "base64"}) %>']
      ['Windows',    '<%= grunt.file.read("img/emoji/windows.png",      {encoding: "base64"}) %>']
      ['OpenBSD',    '<%= grunt.file.read("img/emoji/openbsd.png",      {encoding: "base64"}) %>']
      ['Gnu',        '<%= grunt.file.read("img/emoji/gnu.png",          {encoding: "base64"}) %>']
      ['CrunchBang', '<%= grunt.file.read("img/emoji/crunchbang.png",   {encoding: "base64"}) %>']
      ['Yuno',       '<%= grunt.file.read("img/emoji/yuno.png",         {encoding: "base64"}) %>']
    ]

Banner =
  init: ->
    $.asap (-> d.body), ->
      $.asap (-> $ '.abovePostForm'), Banner.ready

  ready: ->
    banner = $ ".boardBanner"
    title = $.el "div",
      id: "boardTitle"
    children = banner.children
    i = children.length
    nodes = []
    while i--
      child = children[i]
      if child.tagName.toLowerCase() is "img"
        child.id = "Banner"
        continue

      if Conf['Custom Board Titles']
        Banner.custom child

      nodes.push child

    $.add title, nodes.reverse()
    $.after banner, title
    return

  cb:
    click: (e) ->
      if e.shiftKey
        @contentEditable = true

    keydown: (e) ->
      e.stopPropagation()

    focus: ->
      string = "#{g.BOARD}.#{@className}"
      items = 
        title: @innerHTML
      items["#{string}"]      = ''
      items["#{string}.orig"] = false

      $.get items, (items) ->
        unless items["#{string}.orig"] and items.title is items["#{string}"]
          $.set "#{string}.orig", items.title
      @textContent = @innerHTML

    blur: ->
      $.set "#{g.BOARD}.#{@className}",           @textContent
      @innerHTML = @textContent
      @contentEditable = false

  custom: (child) ->
    cachedTest = child.innerHTML

    $.get "#{g.BOARD}.#{child.className}", cachedTest, (item) ->
      return unless title = item["#{g.BOARD}.#{child.className}"]
      if Conf['Persistent Custom Board Titles']
        child.innerHTML = title
      else
        $.get "#{g.BOARD}.#{child.className}.orig", cachedTest, (itemb) ->
          if cachedTest is itemb["#{g.BOARD}.#{child.className}.orig"]
            child.innerHTML = title
          else
            $.set "#{g.BOARD}.#{child.className}",      cachedTest
            $.set "#{g.BOARD}.#{child.className}.orig", cachedTest

    $.on child, 'click',   Banner.cb.click
    $.on child, 'keydown', Banner.cb.keydown
    $.on child, 'focus',   Banner.cb.focus
    $.on child, 'blur',    Banner.cb.blur

GlobalMessage =
  init: ->
    $.asap (-> d.body), ->
      $.asap (-> $.id 'delform'), GlobalMessage.ready

  ready: ->
    if el = $ "#globalMessage", d.body
      for child in el.children
        child.cssText = ""
    return

Rice =
  init: ->
    $.ready ->
      Rice.nodes d.body

    Post::callbacks.push
      name: 'Rice Checkboxes'
      cb:   @node

  cb:
    check: ->
      @check.click()

    option: (e) ->
      e.stopPropagation()
      e.preventDefault()
      select = Rice.input
      container = select.nextElementSibling
      container.firstChild.textContent = @textContent
      select.value = @getAttribute 'data-value'
      $.event 'change', null, select
      Rice.cleanup()

    select: (e) ->
      e.stopPropagation()
      e.preventDefault()

      {ul} = Rice

      unless ul
        Rice.ul = ul = $.el 'ul',
          id: "selectrice"
        $.add d.body, ul

      if ul.children.length > 0
        return Rice.cleanup()

      rect = @getBoundingClientRect()
      {clientHeight} = d.documentElement
      {style} = ul

      style.cssText = "width: #{rect.width}px; left: #{rect.left}px;" + (if clientHeight - rect.bottom < 200 then "bottom: #{clientHeight - rect.top}px" else "top: #{rect.bottom}px")
      Rice.input = select = @previousSibling
      nodes = []

      for option in select.options
        li = $.el 'li',
          textContent: option.textContent
        li.setAttribute 'data-value', option.value

        $.on li, 'click', Rice.cb.option
        nodes.push li
      $.add ul, nodes

      $.on ul, 'click scroll blur', (e) ->
        e.stopPropagation()

      $.on d, 'click scroll blur resize', Rice.cleanup

  cleanup: ->
    $.off d, 'click scroll blur resize', Rice.cleanup
    for child in [Rice.ul.children...]
      $.rm child
    return

  nodes: (root) ->
    root or= d.body

    checkboxes = $$('[type=checkbox]:not(.riced)', root)
    checkrice = Rice.checkbox

    for input in checkboxes
      checkrice input

    selects = $$('select:not(.riced)', root)
    selectrice = Rice.select

    for select in selects
      selectrice select

    return

  node: ->
    Rice.checkbox $ '.postInfo input', @nodes.post

  checkbox: (input) ->
    return if $.hasClass input, 'riced'
    $.addClass input, 'riced'
    div = $.el 'div',
      className: 'rice'
    div.check = input
    $.after input, div
    if div.parentElement.tagName isnt 'LABEL'
      $.on div, 'click', Rice.cb.check

  select: (select) ->
    $.addClass select, 'riced'
    div = $.el 'div',
      className: 'selectrice'
      innerHTML: "<div>#{select.options[select.selectedIndex].textContent or null}</div>"
    $.on div, "click", Rice.cb.select

    $.after select, div

###
  JSColor
  http://github.com/hotchpotch/jscolor/tree/master

  JSColor is color library for JavaScript.
  JSColor code is porting from AS3 Color library ColorSB < http://sketchbook.libspark.org/trac/wiki/ColorSB >.
###

JSColor =
  css: ->
    agent = Style.agent
    """<%= grunt.file.read('css/jscolor.css') %>"""

  bind: (el) ->
    el.color = new JSColor.color(el) if not el.color

  fetchElement: (mixed) ->
    if typeof mixed is "string" then $.id mixed else mixed

  fireEvent: (el, event) ->
    return unless el

    $.event event, null, el

  getRelMousePos: (e) ->
    e or= window.event
    x = 0
    y = 0
    if typeof e.offsetX is 'number'
      x = e.offsetX
      y = e.offsetY
    else if typeof e.layerX is 'number'
      x = e.layerX
      y = e.layerY
    x: x
    y: y

  color: (target) ->
    # Read Only
    @hsv = [0, 0, 1] # 0-6, 0-1, 0-1
    @rgb = [1, 1, 1] # 0-1, 0-1, 0-1

    # Writable.
    # Value holder / Where to reflect current color
    @valueElement = @styleElement = target

    # Blur / Drag trackers
    abortBlur = holdPad = holdSld = false

    @hidePicker = ->
      if isPickerOwner() then removePicker()

    @showPicker = ->
      unless isPickerOwner() then drawPicker()

    @importColor = ->
      unless valueElement
        @exportColor()
      else
        unless @fromString valueElement.value, leaveValue
          styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor
          @exportColor leaveValue | leaveStyle

    @exportColor = (flags) ->
      if !(flags & leaveValue) and valueElement
        value = '#' + @toString()
        valueElement.value = value
        valueElement.previousSibling.value = value
        editTheme[valueElement.previousSibling.name] = value

        setTimeout -> Style.themeCSS.textContent = Style.theme editTheme

      if not (flags & leaveStyle) and styleElement
        styleElement.style.backgroundColor = '#' + @toString()

      if not (flags & leavePad) and isPickerOwner()
        redrawPad()

      if not (flags & leaveSld) and isPickerOwner()
        redrawSld()

    @fromHSV = (h, s, v, flags) -> # null = don't change
      @hsv = [
        h =
          if h
            $.minmax h, 0.0, 6.0
          else
            @hsv[0]
        s =
          if s
            $.minmax s, 0.0, 1.0
          else
            @hsv[1]
        v =
          if v
            $.minmax v, 0.0, 1.0
          else
            @hsv[2]
      ]

      @rgb = HSV_RGB(h, s, v)

      @exportColor flags

    @fromRGB = (r, g, b, flags) -> # null = don't change
      r =
        if r?
          $.minmax r, 0.0, 1.0
        else
          @rgb[0]
      g =
        if g?
          $.minmax g, 0.0, 1.0
        else
          @rgb[1]
      b =
        if b?
          $.minmax b, 0.0, 1.0
        else
          @rgb[2]

      hsv = RGB_HSV(r, g, b)

      if hsv[0]?
        @hsv[0] = $.minmax hsv[0], 0.0, 6.0

      if hsv[2] isnt 0
        @hsv[1] =
          unless hsv[1]?
            null
          else
            $.minmax hsv[1], 0.0, 1.0

      @hsv[2] =
        unless hsv[2]?
          null
        else
          $.minmax hsv[2], 0.0, 1.0

      # update RGB according to final HSV, as some values might be trimmed
      @rgb = HSV_RGB @hsv[0], @hsv[1], @hsv[2]

      @exportColor flags

    @fromString = (number, flags) ->
      m = number.match /^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i
      unless m
        return false
      else
        if m[1].length is 6 # 6-char notation
          @fromRGB(
            parseInt(m[1].substr(0, 2), 16) / 255
            parseInt(m[1].substr(2, 2), 16) / 255
            parseInt(m[1].substr(4, 2), 16) / 255
            flags
          )
        else # 3-char notation
          @fromRGB(
            # Double-up each character to fake 6-char notation.
            parseInt((val = m[1].charAt 0) + val, 16) / 255
            parseInt((val = m[1].charAt 1) + val, 16) / 255
            parseInt((val = m[1].charAt 2) + val, 16) / 255
            flags
          )
        true

    @toString = ->
      (0x100 | Math.round(255 * @rgb[0])).toString(16).substr(1) +
      (0x100 | Math.round(255 * @rgb[1])).toString(16).substr(1) +
      (0x100 | Math.round(255 * @rgb[2])).toString(16).substr(1)

    RGB_HSV = (r, g, b) ->
      n = if (n = if r < g then r else g) < b then n else b
      v = if (v = if r > g then r else g) > b then v else b
      m = v - n

      return [ null, 0, v ] if m is 0

      h =
        if r is n
          3 + (b - g) / m
        else
          if g is n
            5 + (r - b) / m
          else
            1 + (g - r) / m
      [
        if h is 6 then 0 else h
        m / v
        v
      ]

    HSV_RGB = (h, s, v) ->

      return [ v, v, v ] unless h?

      i = Math.floor(h)
      f =
        if i % 2
          h - i
        else
          1 - (h - i)
      m = v * (1 - s)
      n = v * (1 - s * f)

      switch i
        when 6, 0
          [v,n,m]
        when 1
          [n,v,m]
        when 2
          [m,v,n]
        when 3
          [m,n,v]
        when 4
          [n,m,v]
        when 5
          [v,m,n]

    removePicker = ->
      delete JSColor.picker.owner
      $.rm JSColor.picker.boxB

    drawPicker = (x, y) ->
      unless p = JSColor.picker
        elements = ['box', 'boxB', 'pad', 'padB', 'padM', 'sld', 'sldB', 'sldM', 'btn']
        p = {}
        for item in elements
          p[item] = $.el 'div', {className: "jsc#{item.capitalize()}"}

        p.btnS = $.el 'span', {className: 'jscBtnS'}
        p.btnT = $.tn 'Close'

        JSColor.picker = p

        $.add p.box, [p.sldB, p.sldM, p.padB, p.padM, p.btn]
        $.add p.sldB, p.sld
        $.add p.padB, p.pad
        $.add p.btnS, p.btnT
        $.add p.btn, p.btnS
        $.add p.boxB, p.box

      # controls interaction
      {box, boxB, btn, btnS, pad, padB, padM, sld, sldB, sldM} = p
      box.onmouseup =
      box.onmouseout = -> target.focus()
      box.onmousedown = -> abortBlur=true
      box.onmousemove = (e) ->
        if holdPad or holdSld
          holdPad and setPad e
          holdSld and setSld e

          if d.selection
            d.selection.empty()
          else if window.getSelection
            window.getSelection().removeAllRanges()

      padM.onmouseup =
      padM.onmouseout = -> if holdPad
        holdPad = false
        JSColor.fireEvent valueElement, 'change'
      padM.onmousedown = (e) ->
        # If the slider is at the bottom, move it up

        if THIS.hsv[2] is 0
          THIS.fromHSV null, null, 1.0

        holdPad = true
        setPad e

      sldM.onmouseup =
      sldM.onmouseout = -> if holdSld
        holdSld = false
        JSColor.fireEvent valueElement, 'change'
      sldM.onmousedown = (e) ->
        holdSld = true
        setSld e

      btn.onmousedown = ->
        THIS.hidePicker()

      # place pointers
      redrawPad()
      redrawSld()

      JSColor.picker.owner = THIS
      $.add ThemeTools.dialog, p.boxB

    # redraw the pad pointer
    redrawPad = ->
      # The X and Y positions of the picker crosshair, based on the hsv Hue and Saturation values as percentages and the picker's dimensions.
      JSColor.picker.padM.style.backgroundPosition =
        "#{4 + Math.round (THIS.hsv[0] / 6) * 180}px #{4 + Math.round (1 - THIS.hsv[1]) * 100}px"

      rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1)
      JSColor.picker.sld.style.backgroundColor = "rgb(#{rgb[0] * 100}%, #{rgb[1] * 100}%, #{rgb[2] * 100}%)"

      return

    redrawSld = ->
      # redraw the slider pointer. X will always be 0, Y will always be a percentage of the HSV 'Value' value.
      JSColor.picker.sldM.style.backgroundPosition =
        "0 #{6 + Math.round (1 - THIS.hsv[2]) * 100}px"


    isPickerOwner = ->
      return JSColor.picker and JSColor.picker.owner is THIS

    blurTarget = ->
      if valueElement is target
        THIS.importColor()

    blurValue = ->
      if valueElement isnt target
        THIS.importColor()

    setPad = (e) ->
      mpos = JSColor.getRelMousePos e
      x = mpos.x - 11
      y = mpos.y - 11
      THIS.fromHSV(
        x * (1 / 30)
        1 - y / 100
        null
        leaveSld
      )

    setSld = (e) ->
      mpos = JSColor.getRelMousePos e
      y = mpos.y - 9
      THIS.fromHSV(
        null
        null
        1 - y / 100
        leavePad
      )

    THIS = @
    valueElement = JSColor.fetchElement @valueElement
    styleElement = JSColor.fetchElement @styleElement
    leaveValue = 1 << 0
    leaveStyle = 1 << 1
    leavePad = 1 << 2
    leaveSld = 1 << 3

    # target
    $.on target, 'focus', ->
      THIS.showPicker()

    $.on target, 'blur', ->
      unless abortBlur
        window.setTimeout(->
            abortBlur or blurTarget()
            abortBlur = false
          )
      else
        abortBlur = false

    # valueElement
    if valueElement
      $.on valueElement, 'keyup input', ->
        THIS.fromString valueElement.value, leaveValue

      $.on valueElement, 'blur', blurValue

      valueElement.setAttribute 'autocomplete', 'off'

    # styleElement
    if styleElement
      styleElement.jscStyle =
        backgroundColor: styleElement.style.backgroundColor

    @importColor()

MascotTools =
  init: (mascot = Conf[g.MASCOTSTRING][Math.floor(Math.random() * Conf[g.MASCOTSTRING].length)]) ->

    Conf['mascot'] = mascot
    @el = el = $('#mascot img', d.body)

    if !Conf['Mascots'] or (g.CATALOG and Conf['Hide Mascots on Catalog'])
      return if el then el.src = "" else null

    position = "#{if Conf['Mascot Position'] is 'bottom' or !(Conf['Mascot Position'] is "default" and Conf['Post Form Style'] is "fixed")
      0 + (if (g.VIEW isnt 'thread' or Conf['Boards Navigation'] is 'sticky bottom') and Conf['4chan SS Navigation'] then 1.6 else 0)
    else
      20.3 + (if g.VIEW isnt 'thread' or !!$ '#postForm input[name=spoiler]' then 1.4 else 0) + (if Conf['Show Post Form Header'] then 1.5 else 0) + (if Conf['Post Form Decorations'] then 0.2 else 0)
    }em"

    # If we're editting anything, let's not change mascots any time we change a value.
    if Conf['editMode']
      unless mascot = editMascot or mascot = Mascots[Conf["mascot"]]
        return

    else
      unless Conf["mascot"]
        return if el then el.src = "" else null

      unless mascot = Mascots[Conf["mascot"]]
        Conf[g.MASCOTSTRING].remove Conf["mascot"]
        return MascotTools.init()

      MascotTools.addMascot mascot

    if Conf["Sidebar Location"] is 'left'
      if Conf["Mascot Location"] is "sidebar"
        location = 'left'
      else
        location = 'right'
    else if Conf["Mascot Location"] is "sidebar"
      location = 'right'
    else
      location = 'left'

    filters = []

    if Conf["Grayscale Mascots"]
      filters.push '<feColorMatrix id="color" type="saturate" values="0" />'

    Style.mascot.textContent = """
#mascot img {
  position: fixed;
  z-index: #{
    if Conf['Mascots Overlap Posts']
      '3'
    else
      '-1'
  };
  #{if Style.sidebarLocation[0] is "left" then "#{Style.agent}transform: scaleX(-1);" else ""}
  bottom: #{
    if mascot.position is 'top'
      'auto'
    else if (mascot.position is 'bottom' and Conf['Mascot Position'] is 'default') or !$.id 'postForm'
      '0'
    else
      position
  };
  #{location}: #{
    (mascot.hOffset or 0) + (
      if Conf['Sidebar'] is 'large' and mascot.center
        25
      else
        0
    )
  }px;
  top: #{
    if mascot.position is 'top'
      '0'
    else
      'auto'
  };
  height: #{
    if mascot.height and isNaN parseFloat mascot.height
      mascot.height
    else if mascot.height
      parseInt(mascot.height, 10) + 'px'
    else
      'auto'
  };
  width: #{
    if mascot.width and isNaN parseFloat mascot.width
      mascot.width
    else if mascot.width
      parseInt(mascot.width,  10) + 'px'
    else
      'auto'
  };
  margin-#{location}: #{mascot.hOffset or 0}px;
  margin-bottom: #{mascot.vOffset or 0}px;
  opacity: #{Conf['Mascot Opacity']};
  pointer-events: none;
  #{if filters.length > 0 then "filter: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"filters\">" + filters.join("") + "</filter></svg>#filters');" else ""}
}
"""

  categories: [
    'Anime'
    'Ponies'
    'Questionable'
    'Silhouette'
    'Western'
  ]

  dialog: (key) ->
    Conf['editMode'] = 'mascot'
    if Mascots[key]
      editMascot = JSON.parse(JSON.stringify(Mascots[key]))
    else
      editMascot = {}
    editMascot.name = key or ''
    MascotTools.addMascot editMascot
    Style.addStyle()
    layout =
      name: [
        "Mascot Name"
        ""
        "text"
      ]
      image: [
        "Image"
        ""
        "text"
      ]
      category: [
        "Category"
        MascotTools.categories[0]
        "select"
        MascotTools.categories
      ]
      position: [
        "Position"
        "default"
        "select"
        ["default", "top", "bottom"]
      ]
      height: [
        "Height"
        "auto"
        "text"
      ]
      width: [
        "Width"
        "auto"
        "text"
      ]
      vOffset: [
        "Vertical Offset"
        "0"
        "number"
      ]
      hOffset: [
        "Horizontal Offset"
        "0"
        "number"
      ]
      center: [
        "Center Mascot"
        false
        "checkbox"
      ]

    dialog = $.el "div",
      id: "mascotConf"
      className: "reply dialog"
      innerHTML: "
<div id=mascotbar>
</div>
<hr>
<div id=mascotcontent>
</div>
<div id=save>
  <a href='javascript:;'>Save Mascot</a>
</div>
<div id=close>
  <a href='javascript:;'>Close</a>
</div>
"
    for name, item of layout

      switch item[2]

        when "text"
          div = @input item, name
          input = $ 'input', div

          if name is 'image'

            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              Style.addStyle()

            fileInput = $.el 'input',
              type:     "file"
              accept:   "image/*"
              title:    "imagefile"
              hidden:   "hidden"

            $.on input, 'click', (evt) ->
              if evt.shiftKey
                @.nextSibling.click()

            $.on fileInput, 'change', (evt) ->
              MascotTools.uploadImage evt, @

            $.after input, fileInput

          if name is 'name'

            $.on input, 'blur', ->
              @value = @value.replace /[^a-z-_0-9]/ig, "_"
              unless /^[a-z]/i.test @value
                return alert "Mascot names must start with a letter."
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              Style.addStyle()

          else

            $.on input, 'blur', ->
              editMascot[@name] = @value
              MascotTools.addMascot editMascot
              Style.addStyle()

        when "number"
          div = @input item, name
          $.on $('input', div), 'blur', ->
            editMascot[@name] = parseInt @value
            MascotTools.addMascot editMascot
            Style.addStyle()

        when "select"
          value = editMascot[name] or item[1]
          optionHTML = "<div class=optionlabel>#{item[0]}</div><div class=option><select name='#{name}' value='#{value}'><br>"
          for option in item[3]
            optionHTML = optionHTML + "<option value=\"#{option}\">#{option}</option>"
          optionHTML = optionHTML + "</select>"
          div = $.el 'div',
            className: "mascotvar"
            innerHTML: optionHTML
          setting = $ "select", div
          setting.value = value

          $.on $('select', div), 'change', ->
            editMascot[@name] = @value
            MascotTools.addMascot editMascot
            Style.addStyle()

        when "checkbox"
          value = editMascot[name] or item[1]
          div = $.el "div",
            className: "mascotvar"
            innerHTML: "<label><input type=#{item[2]} class=field name='#{name}' #{if value then 'checked'}>#{item[0]}</label>"
          $.on $('input', div), 'click', ->
            editMascot[@name] = if @checked then true else false
            MascotTools.addMascot editMascot
            Style.addStyle()

      $.add $("#mascotcontent", dialog), div

    $.on $('#save > a', dialog), 'click', ->
      MascotTools.save editMascot

    $.on  $('#close > a', dialog), 'click', MascotTools.close
    Rice.nodes(dialog)
    $.add d.body, dialog

  input: (item, name) ->
    if Array.isArray(editMascot[name])
      if Style.lightTheme
        value = editMascot[name][1]
      else
        value = editMascot[name][0]
    else
      value = editMascot[name] or item[1]

    editMascot[name] = value

    div = $.el "div",
      className: "mascotvar"
      innerHTML: "<div class=optionlabel>#{item[0]}</div><div class=option><input type=#{item[2]} class=field name='#{name}' placeholder='#{item[0]}' value='#{value}'></div>"

    return div

  uploadImage: (evt, el) ->
    file = evt.target.files[0]
    reader = new FileReader()

    reader.onload = (evt) ->
      val = evt.target.result

      el.previousSibling.value = val
      editMascot.image = val
      Style.addStyle()

    reader.readAsDataURL file

  addMascot: (mascot) ->
    if el = @el
      el.src = if Array.isArray(mascot.image) then (if Style.lightTheme then mascot.image[1] else mascot.image[0]) else mascot.image
    else
      @el = el = $.el 'div',
        id: "mascot"
        innerHTML: "<img src='#{if Array.isArray(mascot.image) then (if Style.lightTheme then mascot.image[1] else mascot.image[0]) else mascot.image}'>"

      $.add d.body, el

  save: (mascot) ->
    {name, image} = mascot
    if !name? or name is ""
      alert "Please name your mascot."
      return

    if !image? or image is ""
      alert "Your mascot must contain an image."
      return

    unless mascot.category
      mascot.category = MascotTools.categories[0]

    if Mascots[name]

      if Conf["Deleted Mascots"].contains name
        Conf["Deleted Mascots"].remove name
        $.set "Deleted Mascots", Conf["Deleted Mascots"]

      else
        if confirm "A mascot named \"#{name}\" already exists. Would you like to over-write?"
          delete Mascots[name]
        else
          return alert "Creation of \"#{name}\" aborted."

    for type in ["Enabled Mascots", "Enabled Mascots sfw", "Enabled Mascots nsfw"]
      unless Conf[type].contains name
        Conf[type].push name
        $.set type, Conf[type]
    Mascots[name]        = JSON.parse(JSON.stringify(mascot))
    Conf["mascot"]       = name
    delete Mascots[name].name
    $.get "userMascots", {}, (item) ->
      userMascots = item['userMascots']
      userMascots[name] = Mascots[name]
      $.set 'userMascots', userMascots
      alert "Mascot \"#{name}\" saved."

  close: ->
    Conf['editMode'] = false
    editMascot = {}
    $.rm $.id 'mascotConf'
    Style.addStyle()
    Settings.open "mascots"

  importMascot: (evt) ->
    file = evt.target.files[0]
    reader = new FileReader()

    reader.onload = (e) ->

      try
        imported = JSON.parse e.target.result
      catch err
        alert err
        return

      unless (imported["Mascot"])
        alert "Mascot file is invalid."

      name = imported["Mascot"]
      delete imported["Mascot"]

      if Mascots[name] and not Conf["Deleted Mascots"].remove name
        unless confirm "A mascot with this name already exists. Would you like to over-write?"
          return

      Mascots[name] = imported

      $.get "userMascots", {}, (item) ->
        userMascots = item['userMascots']
        userMascots[name] = Mascots[name]
        $.set 'userMascots', userMascots

      alert "Mascot \"#{name}\" imported!"
      $.rm $("#mascotContainer", d.body)
      Settings.open 'mascots'

    reader.readAsText(file)

###
  Style.color adapted from 4chan Style Script
###

ThemeTools =
  init: (key) ->
    Conf['editMode'] = "theme"

    if Themes[key]
      editTheme = JSON.parse(JSON.stringify(Themes[key]))
      $.get "userThemes", {}, (items) ->
        if items[key]
          editTheme["Theme"] = key
        else
          editTheme["Theme"] = key += " [custom]"
    else
      editTheme = JSON.parse(JSON.stringify(Themes['Yotsuba B']))
      editTheme["Theme"] = "Untitled"
      editTheme["Author"] = "Author"
      editTheme["Author Tripcode"] = "Unknown"

    # Objects are not guaranteed to have any type of arrangement, so we use a presorted
    # array to generate the layout of of the theme editor.
    # (Themes aren't even guaranteed to have any of these values, actually)
    layout = [
      "Background Image"
      "Background Attachment"
      "Background Position"
      "Background Repeat"
      "Background Color"
      "Thread Wrapper Background"
      "Thread Wrapper Border"
      "Dialog Background"
      "Dialog Border"
      "Reply Background"
      "Reply Border"
      "Highlighted Reply Background"
      "Highlighted Reply Border"
      "Backlinked Reply Outline"
      "Input Background"
      "Input Border"
      "Hovered Input Background"
      "Hovered Input Border"
      "Focused Input Background"
      "Focused Input Border"
      "Checkbox Background"
      "Checkbox Border"
      "Checkbox Checked Background"
      "Buttons Background"
      "Buttons Border"
      "Navigation Background"
      "Navigation Border"
      "Links"
      "Hovered Links"
      "Quotelinks"
      "Backlinks"
      "Navigation Links"
      "Hovered Navigation Links"
      "Names"
      "Tripcodes"
      "Emails"
      "Subjects"
      "Text"
      "Inputs"
      "Post Numbers"
      "Greentext"
      "Sage"
      "Board Title"
      "Timestamps"
      "Warnings"
      "Shadow Color"
    ]

    ThemeTools.dialog = $.el "div",
      id: "themeConf"
      className: "reply dialog"
      innerHTML: "
<div id=themebar>
</div>
<hr>
<div id=themecontent>
</div>
<div id=save>
  <a href='javascript:;'>Save</a>
</div>
<div id=upload>
  <a href='javascript:;'>Select Image</a>
</div>
<div id=close>
  <a href='javascript:;'>Close</a>
</div>
"

    header = $.el "div",
      innerHTML: "
<input class='field subject' name='Theme' placeholder='Theme' value='#{key}'> by
<input class='field name' name='Author' placeholder='Author' value='#{editTheme['Author']}'>
<input class='field postertrip' name='Author Tripcode' placeholder='Author Tripcode' value='#{editTheme['Author Tripcode']}'>"

    #Setup inputs that are not generated from the layout variable.
    for input in $$("input", header)
      $.on input, 'blur', ->
        editTheme[@name] = @value
    $.add $("#themebar", ThemeTools.dialog), header
    themecontent = $("#themecontent", ThemeTools.dialog)

    for item in layout
      unless editTheme[item]
        editTheme[item] = ''

      div = $.el "div",
        className: "themevar"
        innerHTML: "<div class=optionname><b>#{item}</b></div><div class=option><input name='#{item}' placeholder='#{if item == "Background Image" then "Shift+Click to upload image" else item}'>"

      input = $('input', div)

      input.value = editTheme[item]

      switch item
        when "Background Image"
          input.className = 'field'
          fileInput = $.el 'input',
            type: 'file'
            accept:   "image/*"
            title:    "BG Image"
            hidden:   "hidden"

          $.on input, 'click', (evt) ->
            if evt.shiftKey
              @nextSibling.click()

          $.on fileInput, 'change', (evt) ->
            ThemeTools.uploadImage evt, @

          $.after input, fileInput

        when "Background Attachment" ,"Background Position", "Background Repeat"
          input.className = 'field'

        else
          input.className = "colorfield"

          colorInput = $.el 'input',
            className: 'color'
            value: "##{Style.colorToHex(input.value) or 'aaaaaa'}"

          JSColor.bind colorInput

          $.after input, colorInput

      $.on input, 'blur', ->
        depth = 0

        unless @value.length > 1000
          for i in [0..@value.length - 1]
            switch @value[i]
              when '(' then depth++
              when ')' then depth--
              when '"' then toggle1 = not toggle1
              when "'" then toggle2 = not toggle2

        if depth != 0 or toggle1 or toggle2
          return alert "Syntax error on #{@name}."

        if @className == "colorfield"
          @nextSibling.value = "##{Style.colorToHex(@value) or 'aaaaaa'}"
          @nextSibling.color.importColor()

        editTheme[@name] = @value

      Style.addStyle(editTheme)

      $.add themecontent, div

    $.add themecontent, div

    unless editTheme["Custom CSS"]
      editTheme["Custom CSS"] = ""

    div = $.el "div",
      className: "themevar"
      innerHTML: "<div class=optionname><b>Custom CSS</b></div><div class=option><textarea name='Custom CSS' placeholder='Custom CSS'>#{editTheme['Custom CSS']}</textarea>"

    $.on $('textarea', div), 'blur', ->
      editTheme["Custom CSS"] = @value
      Style.themeCSS.textContent  = Style.theme editTheme

    $.add themecontent, div

    $.on $('#save > a', ThemeTools.dialog), 'click', ->
      ThemeTools.save editTheme

    $.on  $('#close > a', ThemeTools.dialog), 'click', ThemeTools.close
    $.add d.body, ThemeTools.dialog
    Style.themeCSS.textContent  = Style.theme editTheme

  uploadImage: (evt, el) ->
    file = evt.target.files[0]
    reader = new FileReader()

    reader.onload = (evt) ->
      val = 'url("' + evt.target.result + '")'

      el.previousSibling.value = val
      editTheme["Background Image"] = val
      Style.themeCSS.textContent  = Style.theme editTheme

    reader.readAsDataURL file

  importtheme: (origin, evt) ->
    file = evt.target.files[0]
    reader = new FileReader()

    reader.onload = (e) ->

      try
        imported = JSON.parse e.target.result
      catch err
        alert err
        return

      unless (origin != 'appchan' and imported.mainColor) or (origin == 'appchan' and imported["Author Tripcode"])
        alert "Theme file is invalid."
        return
      name = imported.name or imported["Theme"]
      delete imported.name

      if Themes[name] and not Themes[name]["Deleted"]
        if confirm "A theme with this name already exists. Would you like to over-write?"
          delete Themes[name]
        else
          return

      if origin == "oneechan" or origin == "SS"
        bgColor     = new Style.color(imported.bgColor);
        mainColor   = new Style.color(imported.mainColor);
        brderColor  = new Style.color(imported.brderColor);
        inputColor  = new Style.color(imported.inputColor);
        inputbColor = new Style.color(imported.inputbColor);
        blinkColor  = new Style.color(imported.blinkColor);
        jlinkColor  = new Style.color(imported.jlinkColor);
        linkColor   = new Style.color(imported.linkColor);
        linkHColor  = new Style.color(imported.linkHColor);
        nameColor   = new Style.color(imported.nameColor);
        quoteColor  = new Style.color(imported.quoteColor);
        sageColor   = new Style.color(imported.sageColor);
        textColor   = new Style.color(imported.textColor);
        titleColor  = new Style.color(imported.titleColor);
        tripColor   = new Style.color(imported.tripColor);
        timeColor   = new Style.color(imported.timeColor || imported.textColor);

        if imported.bgRPA
          bgRPA = imported.bgRPA.split(' ')
        else
          bgRPA = ['no-repeat', 'bottom', 'left', 'fixed']

        if origin == "oneechan"
          Themes[name] =
            'Author'                      : "Anonymous"
            'Author Tripcode'             : "!POMF.9waa"
            'Background Image'            : "url('#{imported.bgImg or ''}')"
            'Background Attachment'       : "#{bgRPA[3] or ''}"
            'Background Position'         : "#{bgRPA[1] or ''} #{bgRPA[2] or ''}"
            'Background Repeat'           : "#{bgRPA[0] or ''}"
            'Background Color'            : "rgb(#{bgColor.rgb})"
            'Dialog Background'           : "rgba(#{mainColor.rgb},.98)"
            'Dialog Border'               : "rgb(#{brderColor.rgb})"
            'Thread Wrapper Background'   : "rgba(0,0,0,0)"
            'Thread Wrapper Border'       : "rgba(0,0,0,0)"
            'Reply Background'            : "rgba(#{mainColor.rgb},#{imported.replyOp})"
            'Reply Border'                : "rgb(#{brderColor.rgb})"
            'Highlighted Reply Background': "rgba(#{mainColor.shiftRGB(4, true)}, #{imported.replyOp})"
            'Highlighted Reply Border'    : "rgb(#{linkColor.rgb})"
            'Backlinked Reply Outline'    : "rgb(#{linkColor.rgb})"
            'Checkbox Background'         : "rgba(#{inputColor.rgb}, #{imported.replyOp})"
            'Checkbox Border'             : "rgb(#{inputbColor.rgb})"
            'Checkbox Checked Background' : "rgb(#{inputColor.rgb})"
            'Input Background'            : "rgba(#{inputColor.rgb}, #{imported.replyOp})"
            'Input Border'                : "rgb(#{inputbColor.rgb})"
            'Hovered Input Background'    : "rgba(#{inputColor.hover}, #{imported.replyOp})"
            'Hovered Input Border'        : "rgb(#{inputbColor.rgb})"
            'Focused Input Background'    : "rgba(#{inputColor.hover}, #{imported.replyOp})"
            'Focused Input Border'        : "rgb(#{inputbColor.rgb})"
            'Buttons Background'          : "rgba(#{inputColor.rgb}, #{imported.replyOp})"
            'Buttons Border'              : "rgb(#{inputbColor.rgb})"
            'Navigation Background'       : "rgba(#{bgColor.rgb}, 0.8)"
            'Navigation Border'           : "rgb(#{mainColor.rgb})"
            'Quotelinks'                  : "rgb(#{linkColor.rgb})"
            'Links'                       : "rgb(#{linkColor.rgb})"
            'Hovered Links'               : "rgb(#{linkHColor.rgb})"
            'Navigation Links'            : "rgb(#{textColor.rgb})"
            'Hovered Navigation Links'    : "rgb(#{linkHColor.rgb})"
            'Subjects'                    : "rgb(#{titleColor.rgb})"
            'Names'                       : "rgb(#{nameColor.rgb})"
            'Sage'                        : "rgb(#{sageColor.rgb})"
            'Tripcodes'                   : "rgb(#{tripColor.rgb})"
            'Emails'                      : "rgb(#{linkColor.rgb})"
            'Post Numbers'                : "rgb(#{linkColor.rgb})"
            'Text'                        : "rgb(#{textColor.rgb})"
            'Backlinks'                   : "rgb(#{linkColor.rgb})"
            'Greentext'                   : "rgb(#{quoteColor.rgb})"
            'Board Title'                 : "rgb(#{textColor.rgb})"
            'Timestamps'                  : "rgb(#{timeColor.rgb})"
            'Inputs'                      : "rgb(#{textColor.rgb})"
            'Warnings'                    : "rgb(#{sageColor.rgb})"
            'Shadow Color'                : "rgba(0,0,0,0.1)"
            'Custom CSS'                  : """<%= grunt.file.read('css/theme.oneechan.css') %> #{imported.customCSS or ''}"""

        else if origin == "SS"
          Themes[name] =
            'Author'                      : "Anonymous"
            'Author Tripcode'             : "!.pC/AHOKAg"
            'Background Image'            : "url('#{imported.bgImg or ''}')"
            'Background Attachment'       : "#{bgRPA[3] or ''}"
            'Background Position'         : "#{bgRPA[1] or ''} #{bgRPA[2] or ''}"
            'Background Repeat'           : "#{bgRPA[0] or ''}"
            'Background Color'            : "rgb(#{bgColor.rgb})"
            'Dialog Background'           : "rgba(#{mainColor.rgb}, .98)"
            'Dialog Border'               : "rgb(#{brderColor.rgb})"
            'Thread Wrapper Background'   : "rgba(#{mainColor.rgb}, .5)"
            'Thread Wrapper Border'       : "rgba(#{brderColor.rgb}, .9)"
            'Reply Background'            : "rgba(#{mainColor.rgb}, .9)"
            'Reply Border'                : "rgb(#{brderColor.rgb})"
            'Highlighted Reply Background': "rgba(#{mainColor.shiftRGB(4, true)}, .9)"
            'Highlighted Reply Border'    : "rgb(#{linkColor.rgb})"
            'Backlinked Reply Outline'    : "rgb(#{linkColor.rgb})"
            'Checkbox Background'         : "rgba(#{inputColor.rgb}, .9)"
            'Checkbox Border'             : "rgb(#{inputbColor.rgb})"
            'Checkbox Checked Background' : "rgb(#{inputColor.rgb})"
            'Input Background'            : "rgba(#{inputColor.rgb}, .9)"
            'Input Border'                : "rgb(#{inputbColor.rgb})"
            'Hovered Input Background'    : "rgba(#{inputColor.hover}, .9)"
            'Hovered Input Border'        : "rgb(#{inputbColor.rgb})"
            'Focused Input Background'    : "rgba(#{inputColor.hover}, .9)"
            'Focused Input Border'        : "rgb(#{inputbColor.rgb})"
            'Buttons Background'          : "rgba(#{inputColor.rgb}, .9)"
            'Buttons Border'              : "rgb(#{inputbColor.rgb})"
            'Navigation Background'       : "rgba(#{bgColor.rgb}', 0.8)"
            'Navigation Border'           : "rgb(#{mainColor.rgb})"
            'Quotelinks'                  : "rgb(#{linkColor.rgb})"
            'Links'                       : "rgb(#{linkColor.rgb})"
            'Hovered Links'               : "rgb(#{linkHColor.rgb})"
            'Navigation Links'            : "rgb(#{textColor.rgb})"
            'Hovered Navigation Links'    : "rgb(#{linkHColor.rgb})"
            'Subjects'                    : "rgb(#{titleColor.rgb})"
            'Names'                       : "rgb(#{nameColor.rgb})"
            'Sage'                        : "rgb(#{sageColor.rgb})"
            'Tripcodes'                   : "rgb(#{tripColor.rgb})"
            'Emails'                      : "rgb(#{linkColor.rgb})"
            'Post Numbers'                : "rgb(#{linkColor.rgb})"
            'Text'                        : "rgb(#{textColor.rgb})"
            'Backlinks'                   : "rgb(#{linkColor.rgb})"
            'Greentext'                   : "rgb(#{quoteColor.rgb})"
            'Board Title'                 : "rgb(#{textColor.rgb})"
            'Timestamps'                  : "rgb(#{timeColor.rgb})"
            'Inputs'                      : "rgb(#{textColor.rgb})"
            'Warnings'                    : "rgb(#{sageColor.rgb})"
            'Shadow Color'                : "rgba(0,0,0,0.1)"
            'Custom CSS'                  : """<%= grunt.file.read('css/theme.4chanss.css') %> #{imported.customCSS or ''}"""

      else if origin == 'appchan'
        Themes[name] = imported

      userThemes = $.get "userThemes", {}
      userThemes[name] = Themes[name]
      $.set 'userThemes', userThemes
      alert "Theme \"#{name}\" imported!"
      $.rm $("#themes", d.body)
      Settings.open 'themes'

    reader.readAsText(file)

  save: (theme) ->
    name = theme["Theme"]

    if Themes[name] and not Themes[name]["Deleted"]
      if confirm "A theme with this name already exists. Would you like to over-write?"
        delete Themes[name]
      else
        return

    Themes[name] = JSON.parse(JSON.stringify(theme))
    delete Themes[name]["Theme"]
    $.get "userThemes", {}, (item) ->
      userThemes = item["userThemes"]
      userThemes[name] = Themes[name]
      $.set 'userThemes', userThemes
      $.set "theme", Conf['theme'] = name
      alert "Theme \"#{name}\" saved."

  close: ->
    Conf['editMode'] = false
    $.rm $.id 'themeConf'
    Style.addStyle()
    Settings.open 'themes'