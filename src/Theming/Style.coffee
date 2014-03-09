Style =
  sheets: {}
  init: ->
    Style.svgs = {
<% if (type === 'crx') { %>
      el: $.el 'div',
        id: 'svg_filters'
<% } %>
    }

    theme = Themes[Conf[g.THEMESTRING]] or Themes['Yotsuba B']
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

    $.asap (-> d.body), @asapInit
    $.asap (-> Header.bar.parentElement), Style.padding
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

    Style.remStyle()

    for title, cat of Config.style
      for name, setting of cat
        continue if !Conf[name] or setting[2] is 'text' or name in ['NSFW/SFW Themes', 'NSFW/SFW Mascots']
        hyphenated = "#{name}#{if setting[2] then " #{Conf[name]}" else ""}".toLowerCase().replace(/^4/, 'four').replace /\s+/g, '-'
        $.addClass doc, hyphenated

    return

  readyInit: ->
    Style.iconPositions()
    if exLink = $ "#navtopright .exlinksOptionsLink", d.body
      $.on exLink, "click", ->
        setTimeout Rice.nodes, 100

  remStyle: ->
    for item in [
      '[title="switch"]'
      '[href="//s.4cdn.org/css/yotsubluemobile.540.css"]'
      '#base-css'
      '#mobile-css'
    ]
      item.disabled = true if item = $ item, d.head

    if g.VIEW is 'home'
      for item in $$ '[rel="stylesheet"], style[type="text/css"]', d.head
        item.disabled = true

    return

  generateFilter: (id, values) -> """<%= grunt.file.read('src/General/html/Features/Filters.svg').replace(/>\s+</g, '><') %>"""

  matrix: ->
    colors = []
    rgb    = ['r', 'g', 'b']
    for arg in arguments
      hex = (new Color arg).raw
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

  setTheme: (theme) -> Style.sheets.theme.textContent  = Style.theme theme

  theme: (theme) ->
    bgColor  = new Color backgroundC = theme["Background Color"]
    replybg  = new Color theme["Reply Background"]
    replyRGB = "rgb(#{replybg.shiftRGB parseInt(Conf['Silhouette Contrast'], 10), true})"

    Style.lightTheme = bgColor.isLight()

    svgs = [
      ['captcha-filter', "values='#{Style.filter Style.matrix theme["Text"], theme["Input Background"]} 0 0 0 1 0'"]
      ['mascot-filter',  "values='#{Style.silhouette Style.matrix replyRGB} 0 0 0 1 0'"]
      ['grayscale',      'id="color" type="saturate" values="0"']
      ['icons-filter',   "values='-.6 0 0 0 1 0 -.6 0 0 1 0 0 -.6 0 1 0 0 0 1 0'"]
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
    pageHeight = ($ '.pagelist', d.body)?.offsetHeight or 15
    Style.sheets.padding.textContent  = """<%= grunt.file.read('src/General/css/padding.nav.css').replace(/\s+/g, ' ').trim() %> """ +
      if pageHeight
        """<%= grunt.file.read('src/General/css/padding.pages.css').replace(/\s+/g, ' ').trim() %>"""
      else ''