Style =
  sheets: {}
  init: ->
    Style.svgs = { 
<% if (type === 'crx') { %>
      el: $.el 'div',
        id: 'svg_filters'
<% } %>
    }

    theme = Themes[Conf['theme']] or Themes['Yotsuba B']
    items = [
      ['layout',   Style.layout]
      ['theme',    Style.theme theme]
      ['emoji',    Emoji.css()]
      ['dynamic',  Style.dynamic()]
      ['padding',  ""]
      ['mascots',  ""]
    ]

    i = 0
    while item = items[i++]
      Style.sheets[item[0]] = $.addStyle item[1], item[0]

    # Non-customizable
    $.addStyle JSColor.css(), 'jsColor'

    $.asap (-> d.head), Style.observe

    $.asap (-> d.body), @asapInit
    $.on window, "resize", Style.padding
    $.ready @readyInit
  
  asapInit: ->
    <% if (type === 'crx') { %>
    $.addClass doc, 'blink'
    <% } else { %>
    $.addClass doc, 'gecko'
    <% } %>
    $.addClass doc, 'fourchan-x'
    $.addClass doc, 'appchan-x'
    $.addClass doc, g.VIEW

    <% if (type === 'crx') { %>
    $.add d.body, Style.svgs.el
    <% } %>

    for title, cat of Config.style
      for name, setting of cat
        continue if !Conf[name] or setting[2] is 'text'
        hyphenated = "#{name}#{if setting[2] then " #{Conf[name]}" else ""}".toLowerCase().replace(/^4/, 'four').replace /\s+/g, '-'
        $.addClass doc, hyphenated

    if g.VIEW is 'index'
      pages = (name, text) ->
        el = $ ".pagelist > .#{name}"
        elA = $.el 'a',
          textContent: text

        if (action = el.firstElementChild).nodeName is 'FORM'
          elA.href = 'javascript:;'
          $.on elA, 'click', ->
            action.firstElementChild.click()

        $.add el, elA

      $.asap (-> $ '.mPagelist'), ->
        pages 'prev', '<'
        pages 'next', '>'

  readyInit: ->
    Style.padding()
    Style.iconPositions()
    if exLink = $ "#navtopright .exlinksOptionsLink", d.body
      $.on exLink, "click", ->
        setTimeout Rice.nodes, 100

  observe: ->
    Style.observer = new MutationObserver onMutationObserver = Style.wrapper
    Style.observer.observe d.head,
      childList: true
      subtree: true

  wrapper: ->
    first = {addedNodes: d.head.children}
    Style.remStyle first

    if d.readyState is 'complete'
      Style.observer.disconnect()

  remStyle: ({addedNodes}) ->
    i = addedNodes.length
    while i--
      {nodeName, rel, id, href, textContent} = node = addedNodes[i]

      if nodeName is 'STYLE'
        continue if id or /\.typeset/.test textContent
      else if nodeName is 'LINK'
        continue if rel and (!/stylesheet/.test(rel) or /flags.*\.css$/.test(href) or href[..3] is 'data')
      else
        continue

      $.rm node 
      
    return
  
  generateFilter: (id, values) -> """<%= grunt.file.read('src/General/html/Features/Filters.svg').replace(/>\s+</g, '><') %>"""

  matrix: ->
    colors = []
    rgb    = ['r', 'g', 'b']
    for arg in arguments
      hex = (new Style.color arg).raw
      color = {}
      i     = 0
      while val = rgb[i]
        color[val] = parseInt(hex.substr((2 * i++), 2), 16) / 255
      colors.push color

    colors

  filter: ([fg, bg]) ->
    "#{bg.r} #{-fg.r} 0 0 #{fg.r} #{bg.g} #{-fg.g} 0 0 #{fg.g} #{bg.b} #{-fg.b} 0 0 #{fg.b}"

  silhouette: ([fg]) ->
    "0 0 0 0 #{fg.r} 0 0 0 0 #{fg.g} 0 0 0 0 #{fg.b}"

  layout: """<%=
    grunt.file.read('src/General/css/layout.css').replace(/\s+/g, ' ').trim()
    + ' ' +
    grunt.file.read('src/General/css/font-awesome.css').replace(/\s+/g, ' ').replace(/\\/g, '\\\\').trim()
  %>"""

  dynamic: ->
    sidebarLocation = if Conf["Sidebar Location"] is "left"
      ["left",  "right"]
    else
      ["right", "left" ]

    if Conf['editMode'] is "theme"
      editSpace = {}
      editSpace[sidebarLocation[1]] = 300
      editSpace[sidebarLocation[0]] = 0
    else
      editSpace =
        left:   0
        right:  0

    """<%= grunt.file.read('src/General/css/dynamic.css').replace(/\s+/g, ' ').trim() %>"""

  theme: (theme) ->
    bgColor  = new Style.color(backgroundC = theme["Background Color"])
    replybg  = new Style.color theme["Reply Background"]
    replyRGB = "rgb(#{replybg.shiftRGB parseInt(Conf['Silhouette Contrast'], 10), true})"

    Style.lightTheme = bgColor.isLight
    
    svgs = [
      ['captcha-filter', "values='#{Style.filter Style.matrix theme["Text"], theme["Input Background"]} 0 0 0 1 0'"]
      ['mascot-filter',  "values='#{Style.silhouette Style.matrix replyRGB} 0 0 0 1 0'"]
      ['grayscale',      'id="color" type="saturate" values="0"']
      ['icons-filter',   "values='-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0'"]
    ]
    
    for svg, i in svgs
      <% if (type === 'crx') { %>
      svgs[i] <% } else { %>
      Style.svgs[svg[0].replace /\-/, ""] <% } %> = Style.generateFilter svg[0], svg[1]

    <% if (type === 'crx') { %>
    Style.svgs.el.innerHTML = svgs.join ''
    <% } %>

    """<%= grunt.file.read('src/General/css/theme.css').replace(/\s+/g, ' ').trim() %>""" + <%= grunt.file.read('src/General/css/themeoptions.css').replace(/\s+/g, ' ').trim() %>

  iconPositions: ->
    # Slideout Navigation
    slideNav = $.el 'span',
      id: 'so-nav'
      innerHTML: '<i class=a-icon></a>'
    exec = -> if g.VIEW is 'catalog' then $ '#threads .thread' else true
    $.asap exec, -> 
      $.add slideNav, $.id('boardNavDesktopFoot')
      Header.addShortcut slideNav, true

      # Announcements
      if Conf['Announcements'] is 'slideout'
        if (psa = $.id 'globalMessage') and !psa.hidden
          psaIcon = $.el 'i',
            id: 'so-psa'
            innerHTML: '<i class=a-icon></a>'
          $.add psaIcon, psa
          Header.addShortcut psaIcon, true

    if g.VIEW is 'thread'
      el = $('body > div.navLinks > a')
      el.textContent = ''
      el.id = 'returnIcon'
      el.className = 'a-icon'
      Header.addShortcut el, true

  padding: ->
    navHeight  = Header.bar.offsetHeight
    pageHeight = ($ '.pagelist', d.body)?.offsetHeight
    Style.sheets.padding.textContent  = """<%= grunt.file.read('src/General/css/padding.nav.css').replace(/\s+/g, ' ').trim() %> """ +
      if pageHeight
        """<%= grunt.file.read('src/General/css/padding.pages.css').replace(/\s+/g, ' ').trim() %>"""
      else ''

  color: class
    minmax = (base) -> if base < 0 then 0 else if base > 255 then 255 else base

    calc_rgb = (value) ->
      hex = parseInt value, 16
      return [ # 0xRRGGBB to [R, G, B]
        (hex >> 16) & 0xFF
        (hex >> 8) & 0xFF
        hex & 0xFF
      ]

    colorToHex = (color) ->
      if color.substr(0, 1) is '#'
        if color.length isnt 4
          return color[1..]
        else 
          r = color.substr(1, 1)
          g = color.substr(2, 1)
          b = color.substr(3, 1)
          return [r,r,g,g,b,b].join ""

      if /[0-9a-f]{3}/i.test color
        return color if /[0-9a-f]{6}/i.test color

        r = color.substr(0, 1)
        g = color.substr(1, 1)
        b = color.substr(2, 1)
        return [r,r,g,g,b,b].join ""

      if digits = color.match /(.*?)rgba?\((\d+), ?(\d+), ?(\d+)(.*?)\)/
        # [R, G, B] to 0xRRGGBB
        hex = (
          (parseInt(digits[2], 10) << 16) |
          (parseInt(digits[3], 10) << 8)  |
          (parseInt(digits[4], 10))
        ).toString 16

        while hex.length < 6
          hex = "0#{hex}"
        return hex

      else
        "000000"

    isLight = (rgb) ->
      (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 125

    constructor: (@value) ->
      @raw         = colorToHex value
      @hex         = "#" + @raw
      @private_rgb = calc_rgb value
      @isLight     = isLight @private_rgb
      @rgb         = @private_rgb.join ","
      @hover       = @shiftRGB 16, true

    shiftRGB: (shift, smart) ->
      rgb = [@private_rgb...]
      shift = if smart
        (if @isLight then -1 else 1) * Math.abs shift
      else
        shift

      return (minmax color + shift for color in rgb).join ","