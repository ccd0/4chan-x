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
            setTimeout Style.rice, 100
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

    fgHex = Style.colorToHex text
    bgHex = Style.colorToHex background
    string = matrix {
      r: parseInt(fgHex.substr(0, 2), 16) / 255
      g: parseInt(fgHex.substr(2, 2), 16) / 255
      b: parseInt(fgHex.substr(4, 2), 16) / 255
    }, {
      r: parseInt(bgHex.substr(0, 2), 16) / 255
      g: parseInt(bgHex.substr(2, 2), 16) / 255
      b: parseInt(bgHex.substr(4, 2), 16) / 255
    }

    return "filter: url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='filters' color-interpolation-filters='sRGB'><feColorMatrix values='#{string} 0 0 0 1 0' /></filter></svg>#filters\");"

  layout: ->
    _conf   = Conf
    agent   = Style.agent
    xOffset = if _conf["Sidebar Location"] is "left" then '' else '-'

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
    }[_conf.Sidebar] or (252 + Style.sidebarOffset.W)

    Style.replyMargin = _conf["Post Spacing"]

    css = """<%= grunt.file.read('css/layout.css') %>"""

  theme: (theme) ->
    _conf = Conf
    agent = Style.agent

    bgColor = new Style.color Style.colorToHex backgroundC = theme["Background Color"]

    Style.lightTheme = bgColor.isLight()

    icons = Icons.header.png + Icons.themes[_conf["Icons"]]

    css = """<%= grunt.file.read('css/theme.css') %>"""

  iconPositions: ->
    css = """<%= grunt.file.read('css/icons.base.css') %>"""
    i = 0
    align = Style.sidebarLocation[0]

    _conf = Conf
    notCatalog = !g.CATALOG
    notEither  = notCatalog and g.BOARD isnt 'f'

    aligner = (first, checks) ->
      # Create a position to hold values
      position = [first]

      # Check which elements we actually have. Some are easy, because the script creates them so we'd know they're here
      # Some are hard, like 4sight, which we have no way of knowing if available without looking for it.
      for enabled in checks
        position[position.length] =
          if enabled
            first += 19
          else
            first

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
          notEither
          g.REPLY
          notEither and _conf['Fappe Tyme']
          navlinks = ((!g.REPLY and _conf['Index Navigation']) or (g.REPLY and _conf['Reply Navigation'])) and notCatalog
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
          notCatalog
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

      iconOffset = (
        if g.REPLY and _conf['Prefetch']
          250 + Style.sidebarOffset.W
        else
          20 + (
            if g.REPLY and _conf['Updater Position'] is 'top'
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
content: url('#{Icons.header.png + icon[1]}');
vertical-align: top;
#{margin}
}\n
"""
    css.join ""

  icons:
    pony: [
      ['Pinkie',     'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3dJREFUGBlNwUtoXFUcB+Df/zzuY553pp2MmUwSk5TGpnamiokWRdNCSkCrUChKCnVZQUEUdy5sQZC6cyd2VWgoutCFXWTjIyp1UdqmEDBRsSZNmkmaZF6Zx32ccyzowu8j/M883pH5A9kBYfNkFOpu0OiulyqXmnhkDmdYHYJexzX1Ef51EQDhP9fxpjU0PDCd7IldYIxGVag3/KZ/ZX1p8/P0k/0U47qs291M2NS3f6ncuLeFeQ3A8KuYoNPoY/3e2Ej6scSnqUJ8gksmhC2y3OJHpSUHU0/3HU+WCuddyV6VSpVyYv/aUuPefWAP4iDG8AhJWyYYo972tg8DQ1wyWHGZSfcmZmQ+YeKTw1bQ70H8uJw3xtDp6NzG15VLf/DLWMBZHGPkwuWGyq7njLoZyzAiCtqRIddioifBxYBHIpeE0oaw0yoG7WA755dvi8Xih66BOSZj4rwds45bSQkuOeOCQYWG2PjjcEq94JwjQgQ+kCW+tBl3H7Ym4jnbE/nDmamwqz9mnEaYoBgiZaJIGW5zEIHEPheykMD2w12ztPIXCrZHec+GdOVAUI8ygjvifeHQESiNoKtMlIoRxSV0owMjAeY5+P3BKrbTDq3n02B/7yDTDkBANSXiewKgjFbahEwQe34IiVIfRNqCv1qDanQR9Di4+tU16N409o2WMXnyJeNWb9PO4s6WroZawOiSiozCoR7lPFUQezICCzXF+pPGYRna6/rotNqY/eJLUzh4mM5dP4Va0YXV45x0O9F9FhkN5auq4eznaq3WmP1pDkuibW5uraNaqyNh23ihPA6v7wAVS+PwXAGkbYiUnU3kYm8JzvgGpJGdG6vzm15+ce6H79/9bnnBhCxG702dwnTaw4nyM/jsiTHsHx+DEyjKWnGEUpBOyjTTgbpsNHyLojPe7PK3qci58NvNu0Gl0YA8NIxWp4MkdzCdK2Ci6iNYXIV6UEfUDBC2Q/A3WqVbUUfVucWftYhP9fLiFf7yRPGVmZmhE88dJVmpGRMqRH4E3emSbnQR3lkzaqNB3br/J39tb1ibJglGfJDZbMReb37Td/bFhcnB/iNppXNUbZEKFGBJ6FBT+9cVo5c3yd/trDV3OxdFDDHFOV8IffVJtNNOC+J3xtYqATWw0Mm6RIJ9YAy9rdtt07q1ZtjdVXCYFRBG4Bv8A+lliGhzN164AAAAAElFTkSuQmCC']
      ['Applejack',  'A4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAv9JREFUOE9dkmtIU2EYx88Roi9FfahkfQmS6kNGEBRlZWSY5tylTKepqR8MHYGl2R1POm2u5bCVlzbog2Ze591pzZPZxUskDZLMMLSWzcIca3MXt7N/55woqhf+PC8Pz+99n+fPQxAEQf6vhINb1nG5/ISdobWXo+9eSd4tyM7OJimKImmaJhsaGjjmX/DGqfDQmkvRg1x+9YrlZPd18fdupXiu6mxkOAcqlUqyuLiYB/+cayfD1rKFH0w3pYEHV4/omhTCyieVcYEB7TEYSyX21Mita/6u/91qUBMV00JrjmKwMg4zI2fgnlfD90PLx+nhMyinIrb91SFBFqaHBevPHb7G/fS06jhs0wXwO8rBOLXws2Kct/k4//HKRE+jZD0Pl2buD2FnmOlVSUFrpJg15/JFgcWKP0Bg8Q6fs1sVs+11wmAebKaEuiG1CC81Yozci+cL4KoC3JUIuCp4+R23+Ee4Dr5bisZmJi7fJzpLRJZPOin8vSlwdSXDO54Hz+vT8LzLh3uuCIuzBfDa1DzMPcrJMVfkIHpVEu94uYgH/aaTvOxdJzDZkI76smhY2mVwDmfg8zM5RukcvH8pbx96mLiPMBTG0nSpGK7mePg6k+DsSUZbSQwem02oba3DRsFKzNQfx9sHSdi1dzve5Ow4xM+ozorY1K2U2MY0IrhbEuB7lIqB6gxY7B9R3XoHAoEAivN74O5LAaXNwvNLe9PlcjlJACANRaIRztFh1iRvfRyYx5kIOCwY+GCE9GIUOjrzwZjS4H16FV80UT1WqzWIWFhYIBsLhDf7y46Ck1UvATNKgXlxHgHbJDyub2DGVPC2s+bVyGDTx74ym80kwe2fKvNASN8NySK3NeayWNagNPj7WaP62Uhn8HdPkwyWW3IoEjdv0Ol0JGE0GvmV0+dFpj9SS5kOKuahr01Wwbb2lXV6aakjkfF1p8DXlwHnaB5yTm1bbzAYfs34e/+0pyNic+N2ruIWmQWXcdE1dUEGd9UYq6kle1mXqVW6imWIn290AGVZutJTAAAAAElFTkSuQmCC']
      ['Fluttershy', 'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA2xJREFUOE9dU91PWmcYP2uybDfrxdIlu9vN/oglverWNN3Fmu1iN7vY2q4utnE2Nu26ukyrUUGwExGpn3xY+TyACjrskFrcEYoWnCAM4YAgcJjROkFA1q789nJczNaTPHnfk+f5/d7n4/dQ1Cvf3Ut3Xp//Qnze36gYCt56kIgJpyqRFvrvcIvxMNxhSa9eV993XJK/+yqO/zdf7j7tbRz1RdstLzOKReRoLxJSOzb7HyKtdCEumgErmEbwO03U2aR8738kzq8ln8e6bXlWYMWmZA6Z8SUk5U5ytyPeY0Oy1w5O50FO+wQ5jbtG4lK19L5BGehzb9sE19+JtFt2c8ZlJPvmwAqtSA06EWs3g+2aQnacwdbwAmLknuiZxaZ4FiTD6tLFvi+pBeenb/3mvvo4Yu3D5v1ZsP1axHpUiAo0iPyg41/dGiNgiQI5PXmdXkai92dkVItYbZ6YpVZWLrrKFSOynBip9W6U/7LwViqZ8SykRWpcR8BqJNlmJCZp1LLMkIxSAw6s39WHqUCo/mDnWTdKhwRUMaNMzvLh5NFZsaBIbD+rJ34jgsxtcLQH3IQbKakDoVZDmnpk+irA/fEjCkXlv+AawX+MEJQJcaFEY8bWAJdMgYxyESn5PILNumUqJNVVA4EG7OXlx8Bf3T2QyRuh0X2P5ad9pCQTcjtqDI3UwTMuReIeaaKagb9u6B6VVi9Wg1YRUhkhH1g6NKFf3gD/2gAYz08YVd5AdltDfDS2d2QIrH6DcNcwUjLHc+aC8AMqLrW/4EwesBoligUTCgc05h52IH9gwu6+ERwBb+9pkc0IwLJNWHPXIyrUIdysW2POd52gopIZjtOSpgzOI2NToVAmwD0D9osmvvZSxcCXtr5wA08627Ah0yHZ74D3ysBNXokR8XQ8q2SQM3gQbZtAPm1AiZRyNIUawZGFl5qIRqbBdk4Sndjy1iviIymzIquXldirWRXDzzdOZr63q8J66OqOf+2yL8be+nMr3fry91A9NlRjvKT9tx88Pt6Djdaps0RZxQRZmCzpbHrMBV9b5/YM/dn7tSCT/cNTvpauFdasR5xkkCaS9n07Kj0mIKm+GbujP5OQ/vI8Ofyomhx0sOmxhU9W6wYp5uOO12qB3guik2TuI2QPXmwpXLGnjSMf3RRdO1Hz/QNneMt7Iqmg5QAAAABJRU5ErkJggg==']
      ['Twilight',   'BIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA6lJREFUOE+VlF9Mk1cYxj+Kc3+yXWimFxuk2zTIn4bQFkppF0hDNmBpBtgKixhhQZAhbSkFBp1uZWg3ZLRMxFKE0qKtrMy2E2ztn2+1tLQgbuJiorvQ7c5pgplZNjfmePZ9nwtZMm52kufqvOeX5zznfQ9B/M9l/8CXPP2R/6ajy+u0amZeoI8D2PpfTLqMlZQpT9vE2fPOc9l73302q7rs6Sz5K6zM3ZuJzD2EVf1VytejC4hNXoWj2/vlF71+FgVKIsZVHrbnEzLoPkYOqqtPNm7j1l1J4R9Y4wgVkOR3Qcvrg+uNXmTnt9zfmdcUFRd1XqQhC+eWMXP8MiwKdyUDOqMLEG49qYtYlhA+vQi7zocGmQHFYi2UnM9wq/RzNEsOQyDWMBIWtjNurjivw2ucg+toyM+A6LWZU72vvsqwFjwVZwrmrEvoq7DBLDDiltQAobidgeRRUipMTA0t32AU3hNzD7zGSANBZMi2UFe5nyZohrREB9dxEnMTS+jgnUBYMghv2afrbhhHb3aAnFxkQMHhOALDid8p0EHiKU6VklvQil0UiJakqBsf77dCmTmASPEAhoqPIEN4CGmCJvAkauzKfw/5pRr4J+JUTtfo693zGSM7iBdzan10sE9gh5AragNXoEKtvB+93ZMY0TthGraB92oJVlYewDTgQJ96DKTtiStXb8jvNoafIV7i19+lndC2X+bXPyqXffj4kmV+PYexY1aQMwnkv1YGWUUljryvQ0/dqfV9+Vs9zVTYLILKZ5UGsXMbb2/llJaWCN8OnzNMrxda9JNYjt+ENL0RrQol0nekQVtlRHA8gsWpZQhEmrviws5yIpXfcG87t+52UpY8NZXN3lIjPRiOReZxfugCA7s4EsCN727ArHChQiKDYGchRrumELbFEbQmkFvQ+ofg9TYX8Xx2zfnkLDmHbgM2m00M1tortQf06FC2Y2HqGgMjvSR+WfkVplYPzCoX3EOziDmuwjMSRk6BajVP1PYT/fzb/j0nZ7tmN+n3mUlpUTmCo1EGFHJE8NvDR/g+egd0fj5LDN6xKHo6bOAL1D/niTTRDUd2rMW13VBj/zFu/5YZBaYBp69j0blMPfs8zhj9KCjspPNZ+6fjd28IGld4MgIn5x/HJr9ByJRYDz5oS2B6KIT9Nf3IEaj+pCBrXFELOTERZm0Ichy+lHy2czZlpv+y80JfmILFVwPDsTvmo26SJ1I9zBU1/UVBfqAk35ujpb+RpL8BJjxIUjyXvSgAAAAASUVORK5CYII=']
      ['Rainbow',    'A8AAAAQCAYAAADJViUEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA3tJREFUGBk9wV9MG3UAB/Dv7+531971aKGMlr+OwjoGBUZwRDrRBJwj0bHEmeiS6Xwyxn8x8UVNzHAPPvliFhMzsy0m8uDD5h/QZWoUNxYMBoZbZCBjZTBoKRwtLde7cv9+bg/6+ZDnzk6C44lw6f6whdOnETpzla+0803RMD3ZGSH95V62lzGQtMH9M7MhfpPUyIX5HE1uvNXDaCQgtykB70cR/4unrn3aqzYkZt7v18ZfezyTkfy0HlJ7FMWKEBJFpYMSVq7bngMlGvvc/OTiLzRYLp8K1waObaS16MDIRfupG9c6SuwCsSt2kJ+/B+3HMdC6MBofa0N1a2sVJTWj02mh4BFCCpV84jN4oHyX3KYEJAi2BWYR2CkPmMlBiOgwE0mYiymo1Qu0Mx4/8VLVnrtnF4VxfuCN9z5mDBA9FJt7mzDe3oXkjou69CqoxkA4gC9xQAggankMa7uTm3m32SLKD+Sz6XXGGCDJAv6j7di4MzqBo199Adk2EIqkQGQHDy3Ij2Q+bHr9g3UxyFHLdFyvJHAg+J/ipYgdjuMyzwELCfRsTWG/NQEwhqCVC0YLy/qKGJzmD77w9pHSoFyjbWWxtjAH5jIIHi8EKkCpq8JteCD2H0F2u4BwZhE+x8BEWbt6i6df8kr/s0+H/HKMc1yo02MYaG9APjGLxJ+T2NxYRV7fxu66GqjwYyrn2AG7YFGw4FygeYiXjva/KoipxoaKGPY1N+PJfRHEauvQaIj47vsLSN67i87ew6hOLGFeTS38FO45XhR8lQlffS0tmGViwbmCdKEb3tJSGLYLieMwMfQr1tZSqOzqheCVkDWIk7i/vvJ7WdVVxd96XWBU4kzb55qOiZvqJazmCxhLGzBFiqbnuzD71xyij8bxEN/XzXccf7PyxJ6+lkxuwknnftP4vorBd9O1mXBAnsbfaQW6VQadcWC7gmiIH0JlrBWuw+DYgFyiSGqu+O2NjZllPMBJRUevuH4Ipu1DyOefrS6RzmQN211iFGUtzSAcD8dh2Ll8cyStai8vra/8MQhgEADvjx/bX78c6rgT1ddl722/btSelEz69eaWoZqms1kwrGVt27xV1I1zgdWfRw6Ww8lmswQAo6QR2dnM6JC6HT3PEfvctjSsnx+3J1uob6qt6gAtSgEu4BbdV2KO80T3O0QQBFiWRQRBwL/txI3OlzkSKwAAAABJRU5ErkJggg==']
      ['Rarity',     'BMAAAAQCAYAAAD0xERiAAAEEElEQVR4Xm2SW2xURRyHfzPnsmcvlO4ulN1uF2sLrIpdJNS0KUZFUq1t0AiKkpASbyQSjRKENEGrPuCTiUoTjSENKAnFYKokbZOmIBaoTRXB1AjbWmrabmVpt3SvZ899PFnTxAe+ZF7+D998mf/gbmwt30131B58YM+WTw7vbTnW/+oTHZda6490723uPP1KY0fna40dh/Y0fFz/4pq3XRFEsATB/2i71EauvDcplHN173p8of2gnI8KPHLxm/AEqwgIARUEeywyS1dVPZ+9kJ6OHdB/uzF2BmcYXRIdHxkhO/0vR/e9+c4p7+pIO+92+wlHaGE+QV1lYWpLCe90kdKVTvJo80rqDTic4nJfk7c62kM3rltfgQpSLGOM4ZfR0apQIPQTpSR04uhVqhUYSkoItLyMVFaEIjNENpTg8ZbVyGYK6PpyHIYGBhCmLiYHZ2NDzxZlpwYHaX3V2mMet3sPpZSbjc/B5y+Fw8GDgWEukcbURBLR2jB0TcPpz4cwO5aBBQJuWSnsbC09eeN50tnZSYy0s6p5V+MwIVghSQ4iFwqQHBIIIcVjGEaxXtd1XO2P4dr3N6EqCvJyFoqmgvqDlqZqp+jxD4/z8etKGxjxm6ZJxmIxnB8YwNDQEGITE5iemQHHcRAEATYIVPvB8ZQRQu05D45QGPNx2PYNNFxWV21y/h0AiCiKkGUZcwsZnDjTg7cOtuOr098hYxLYQJIklK8ps5hoaAyM2ZeAFwRQEJi5FEclT/BpxZBKFhdkQimFx+NBTbQG+1pfQFZ34tZtFd29PTAtC+N2dU9vH/t18sKCwPP4r46DQ3QySzcGKBGERzRFpYl4CkubPdd3Fj1nu5GduAxvdQNIPgNV1zBw/hy6+y+D510xUZQYzwlM5CXT5iID+5RailLNDINN/ZUCoQTLlnkQj8dx8uRJW2DA7V2F6H0RGJoGt8vFgqF7c2vD0T4wMANgd0yjP2Mqb+Ty2RkqMrhhmbh+JYnk7TSWl/pwuP0DrIvWoX73EWx/LIIV3lKIgoitT21Dy7aWPzU125/JpbOLukrA8U1ly8uGwxWVz1CXwOvE0qHIGq4NJ4qPHApVoKurC4defw6bKigCwfLiRkMBPzavL39w5/tPChk5vV+ZvzVHUknm4DhB13RKeZ5LlthlzDAQG00jkykU/5VTYKgJiTANE6LkhKIqTNW0nKqpvYauj89PzX5jcqxG0/WmeGK6bj6V+IHPy7nfV/hWbS5kM0gnC5iMLWBjXfhnAA0FRQGz0XVtzmJsZEHOH52a+uPirubtOmw2BfYmg9cSP2YsJ7uIbxlpfaitdk3l/Q/rlv7FnVzucmXdPS+1HtjyD8dzWCIvy76/Z6bY5MTs4tfjn7HBjwZxN/4Fq6rr1ZuF0oUAAAAASUVORK5CYII=']
      ['Spike',      'A4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAsFJREFUOE+Fk1tM0nEUx/9QPtCD7z30nE9sbbVeXJJR6j8DkVsIhg6HTqSXnBHSMMEbEy+AgPwVQpcgNy+kKLc/lCgF09Wquaab67kHX1pulif+mHRdne3sd3Z2Pt/fOee3H4J8N/ow2lrj4H64OljRfEXBIZ/k/3lWquXIrQl2ROAVA98jOro2XKUtvV9Dpj/iFV/ppwvLVfzThEBZGRWh0S4hmFx+rId2ysmMSU6WAAUeMfDcdYe0gUrGdUOl7rZXBDRdRQtRp1PeIRlVctIzk+lHR6itJnwC1nkbgOXgZlhO3h6RY9rZKYT7W9NUKpUklUqRKjPDQADEjYTz3SLgzQjzMWua/5E5xLpQrqOX/jEzamTc4LqEX/KQRwRMBwfEDgnUOyXAdgk+1zr5e0w7J/vA15OfN28PW5SnZlRuVT3WeMia5oHW1AthawSS40mIjcWhW98HfF89Ifa6qb+hqAA6FA5xzIp/dVncYDc/hkQOiI/jBcctCegwdRJgsERWcszpZTrKU/3S7s+Ff4vn9UG4aWbGyofoaB60d05dDJuiR/8DcXMCpLY24GPsrlRWcxZxKmaqF0aCsDy8ArgtAVFL/Jc2C4LWBEwFNLCUbt9PZrpEiEk2VjbmMYIdm4TQ6Cq4RmYB02CwZAlB2ByBkHEVYhYcEmEreNZl4F+/C8F0+0vE2x1IL3qDsDgZhKg5Bt7ULAgHa+HVzlt4v7MHMQyHpM8LrlQzuNdaIfJCub+R0Z5DfNrAxsJAEHJbhXhue5nQJmS3t2D73S6suVK5XBKiYQMs4B3xSEbZ83xTc3ljq5eMmNts5/3d82/8jicQDc0Cbo8BjiVyQsez4rYkeNRzfqfadUYgEJBRFCVRKBQS0tTUSM7BxaauUelyenwunnZ+SnhXDkKG0EGgb+5g4p5dpa5TFEkk1bmfQSu8/TfTXs+Z8UbptgAAAABJRU5ErkJggg==']
    ]
    not: [
      ['Plan9',      'AwAAAAPCAYAAAGn5h7fAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAzE15J1s7QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACAElEQVQoz3WSz4sSARTHvzMjygpqYg3+KIhkE83DKtKlf0C9SrTRuZNEx0VowU6CuSeJNlwwpEO2kJ6SQBiIUAzFjRDF4wrjKosnGx3HmdehFDfpe/2+z/s++D5gU7IsEwRByICIiAEAIiIAYAFAXsjYVr/fLxMRNVvN+prJ5/OA3+/XERFNf02JyeVyDx0OxyvLNQsnimLKfcf9KRQKXQAAnE6nlf5qMpnQycnbP/kAoKoqsSwLAJhOp+AAwOv1otvtpqxWq73dbt/r9XqvEQ6HUalUEvF4XLd5IpvNZqlerzd5nlf6/f6tTCZjBACk0+nb+XxeW4UrikLJZPImAGA0Gq0NIqJyuSyyANDr9Q5Wu1utFvR6/SULAI1G4+vK8Pv90DTtGwsAJpPpaGUYDAZ0Op3PHAAEg8H3tVqtbrtu21sqyxuRSOQJk0ql9IvF4r7b7f7pcrlejkaj57IsH58Pzp8dvjhc/lsBk0gkbLFYrFqtVvd27+4qOk733ePxPDCbzVBVFfP5fCiK4rvhxfDN/qP9wSasGwwGMv1HiqJQsVg8ZlfTHMepkiR1t05gGJBGmM/nMBqNj9nN9kql0lNN064ARISzH2cQBAGz2ewLu2na7XYLwzBbvxYIBBCNRrFj3BmsAZ/PZ+J5/kOhUIAkSVeA8XiMZqt5efrx9OA3GfcgvyVno9cAAAAASUVORK5CYII=']
      ['Neko',       'BMAAAARCAMAAAAIRmf1AAACoFBMVEUAAABnUFZoUVddU1T6+PvFwLzn4eFXVlT/+vZpZGCgm5dKU1Cfnpz//flbWljr5uLp5OCalpNZWFb//f3r6+n28ff9+PRaVVH59Pr//vr38vj57/Dp7eyjn5zq8O5aVVJbYV9nVFhjUFRiWFlZVlFgZGOboJzm5uZhamfz9/bt8fDw6+drb26bl5j/8/lkX1z06uldWFS5r61UT0tfWlbDwr3Ew76moqNRTU7Mx8P75OpeY19pWl1XW1qzr6x5eHaLiojv7+1UT0xIU0uzqadVS0nV0MxkZGT5+PPk497///ra29Xq5eFtY2H28e2hnJignJlUUE1dXV2vrqxkY2FkYF/m3d5vZmfDuruhl5aZlJHx8O75+PZWVVP29vT/9fTj3trv6ubh5eRdXFqTkpBOTUtqZmX88/RMQ0T78vPEvr7HwcHDwsDq6ef///3Gx8H++fXEv7tZWVedmZZXXVudnJp0c3FZU1f79fnb1dlXUVVjXWFrZmy8t7359/qLj455e3q4s69vamZjX1zy4+avpaReWFz/+f1NR0vu6Ozp4+f48/lnYmi8ur3Iw7/69fHz7+xbV1SZmJZVUk1ZV1zq5ez++f/c196uqbDn4uj9+P7z7vRVVVXt6ORiXl/OycXHw8CPi4ihoJ5aWF3/+v/k3+axrLOsp67LzMZYU1m2sq9dWF5WUU1WUk/Au7eYlJGqpqObmphYVV749f7p5Or38fPu6OpiXFz38fH79vLz7urv6+hhYF5cWWKal6D//f/Z09Xg29exraqbl5RqaW6kpKTq5uPv7Of/+PDj29D//vP18Ozs5+OloJymoZ1ZVVJZWVlkYF2hnpmblIyspJmVjYKQi4enop5STUlRTUpcWUhqY1BgWT9ZUjhcV1NiXVkkhke3AAAABHRSTlMA5vjapJ+a9wAAAP9JREFUGBk9wA1EAwEAhuHv3dTQAkLiUlJFJWF0QDLFYDRXIMkomBgxNIYxhOk4wwCqQhQjxgxSGIsALFA5BiYbMZHajz1oJlx51sBJpf6Gd3zONcrqm/r1W8ByK0r+XV1LXyOLLnjW6hMGpu0u1IzPSdO17DgrGC6AadrVodGcDQYbhguP6wAvAaC0BRZQalkUQ8UQDz5tAof0XbejOFcV5xiUoCfjj3O/nf0ZbqAMPYmzU18KSDaRQ08qnfw+B2JNdAEQt2O5vctUGjhoIBU4ygPsj2Vh5zYopDK73hsirdkPTwGCbSHpiYFwYVVC/17pCFSBeUmoqwYQuZtWxx+BVEz0LeVKIQAAAABJRU5ErkJggg==']
      ['Madotsuki',  'BQAAAAPCAMAAADTRh9nAAAALVBMVEUAAAC3iopWLTtWPkHnvqUcBxx5GCZyAAARERGbdXJrRUyGRUyYbY23coZFGDRFGEYfAAAAAXRSTlMAQObYZgAAAGhJREFUeF5Vy1kOQyEMQ1Fshzd12P9y61AixLX4yJFo1cvVUfT23GaflF0HPLln6bhnZVKCcrIWGqpCUcKYSP3JSIRySKTtULPNwMaD8/NC8tsyqsd1hR+6qeqIDHc3LD0B3KdtV1f2A+LJBBIHSgcEAAAAAElFTkSuQmCC']
      ['Sega',       'CwAAAALBAMAAAD2A3K8AAAAMFBMVEUAAACMjpOChImytLmdnqMrKzDIyM55dnkODQ94foQ7PkXm5Olsb3VUUVVhZmw8Sl6klHLxAAAAAXRSTlMAQObYZgAAANFJREFUGJVjYIACRiUlJUUGDHBk4syTkxQwhO3/rQ/4ZYsuymi3YEFUqAhC4LCJZJGIi1uimKKjk3KysbOxsaMnAwNLyqoopaXhttf2it1anrJqke1pr1DlBAZhicLnM5YXZ4RWlIYoezx0zrjYqG6czCDsYRzxIko6Q/qFaKy0690Ij0MxN8K2MIhJXF+hsfxJxuwdpYGVaUU3Mm5bqgKFOZOFit3Vp23J3pgsqLxFUXpLtlD5bgcGBs45794dn6mkOVFQUOjNmXPPz8ysOcAAANw6SHLtrqolAAAAAElFTkSuQmCC']
      ['Sakamoto',   'BEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAxVJREFUOE+Nk19IU1EYwK+GQQTVQ39egh6ibKlzw91z7rn3bvfOmddNszl1bjKXc5rJJGmBUr7Yg9qTD0IalFgRBEYg6EDQQB+GovQyQgiaUZsoLcgHMcr069w7MgcGXfi453zn+37fv3MYZt/n99e76tzVj4JN/hP79fvXnV3hnNabwUBjoOHcgTYOu/JQspgTzsqKgn9BfD4vkWTzur287PqLVy+zM+yePB7KsRXLywTjnSpnZctBkPCdW8ccDuU55vBO8RXbkC/oP5ph19V5+7LIky0OY1BKbZEbLcFSt7u6pN7jLmltCVrr3DV5jY3+KovFEsccB1KJNVpefe10BqS2tqqO4/AuphBB4L/LkrRqNgtJs1lMypLls1kU38mytMLz/E8VIlutqVqX6/weZG52OttRXjbE0cP/FYLRlpVjDXuQ/r77x2XZPKkCHA4HBAIBkCQpAygIAvh8Pu2MZgO0Lz+QSa/sQfwN9RfpVN66XC6Ynp6GhYUFGBwczAC1t7fD0tISxONx6O7upgHILmsqvLcHodOggfiV/v5+SCaT4HQ6IRaLgdfr1bIRRREmJyfBZrNBNBqF+fl5sNsdgE2GiAbp6bmbdbXC7qWQbxMTE7C2tgY6nQ5SqRSEw2ENopaoZpCXlwdTU1NaoECgCbgiU6y8QH+ECYWaTymK7TWdys7MzIwGaWtrg42NDejo6AB1WjU1NZo+FArB2NgYrK6uQrAlCASxn2z6wkuMp87VIAhkE2MEAwMDkEgkYHx8HBYXF0HtkQpRy1BLiEQisLy8rPVNKSsFjEzrXH4+z1hlS4xDhKadNu7t7YPR0VHweDzAEVWfHru6HxkZgeHhYVAURYNjkylVWKArZjjMzqmdVi+QCsLUkQiEjvDvncEkvU7/qQ0Vgukeo48Go87IiCJnZNmipxiz7wXEbVDnbUxQOgM12h9n6qTq6NvapRdtkwaP0XK8RmPuYSbxYfaQ/sJJhjfknuFRURUi7AMOozcCwl94hLZp5F+EioDQVwqYI6jomZU1NFtM+rOSxZjVazcyvwHr/p/Kws1jegAAAABJRU5ErkJggg==']
      ['Baka',       'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA0pJREFUOE91k3tI01EUx39JOpA0H4jNx0pbD3XTalISWf8YFlEgldqDsBLLyqjEKBCiLLWiggh6/KEV1WZ7OaelLZvDdDafNW1JFraWe/32+01FrUZ9uy4ylLpw4Z5z7/nc77n3HIqaMRIjZJyEcNX+uFCFeGmI/GZciEIsCFJUTvoAzDz+1y7K76MSwhX5hXl6z+WSbrzU2KB8YEGDwgrTaxZ3b7xHcaHhR3xw7Z5/UviB1ReP5XSg3+TAqYJOxMzWISFIC0GQDomhTVA9skCnsaAwp/vnMq66dBokNuBR9uFd7T9Z1zCunjci0qcRJUVdoJ3DYOhRnC/qBZ+jQbfeCc+37yjY2UEg0iwvJE0k9l8Z+8xqHmTgot0QLdQgTaQFQ2AsOzlHvOu1S5pwOLsHHo8HjHMCq2MazNvTlByKHyrJLDvdR25jMWRxYx5HjeMH2r1BDOOeguRua4OI14jx8a8YH5tA+al3EHKlW6mYOapb2oZBOOwMbEMseAE12L+jjUh3w+VipyAZ65oxn1NP/GMYGR6Ftn4Qsf7qa9S82Y/l/X122G0uL2TbxmZEz1WhXW8mUol8moXu+SCi/OoQ6VsDh3UUwyQ1k9GOaI5MTkX4yWTGHutvgI1F28sviAlRgxeoRm62HvsyW8En9pZ1TYgi6TntoyQtFm86rVgUoJZRvDnKMmXVAGxWmkAYOBwudBqGcHCvHulrGpGT2Uy+z4yT+QYsCXtCUpp8GxbKhx8gDK0ro+KjJGvzdjfDZnN6VdisLD5/JjArQ2zW66PJOj2lEZtStaBphkwah7K6kMJ/GEulp1bMWhAmMbTozOQRaWRtfoZVgjo4iRra4SYgGi26TwjxVeDKhR7Y7U606ixICq9tr7hd7+OthRWL7yUnJ1WPmXotqLhpRICPHCePtuFV6xdUPTAhcWEtRHEqfHpPyto4hPXLXnzflSEJnFaN3OCKDcsFsrEntR9RUmxARLAUgT5iBPuJsXWDBj0dZjRU9yNV+PTbpjTp9OA/pOSk24nRkXf1J462oPxcJ65f6ULlHSMulepRerYDgvj7A0cKpNz/tyTZqbzXO4t0ZZGQJ34RH11lFHIlA8LIqreCCMUZRY3cd2bwL/5/RmjNSXqtAAAAAElFTkSuQmCC']
      ['Ponyo',      'BAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAuNJREFUOE+Nk3tI01EUx39BTytConQTt1am07m5abi5KT5S8z2dj1yOEMUC7aUgIoimlmUEWX9kBZGWaamEmE6U1BI1XNPNGTrnHs33IwuSXrL4NgcJ0mNdOHDh3PPhnPP9XoKwcroJYvMQiRSicHCQKCgUyZC9/T5rNet5KUFs0zCZbZMsFmZ9fTEjEEBDp4/KSSSb/4JoGIyWaTYbiykpWEhOxhSHAzWD0aqkUGhWAcVkW58xlvuPhfh4zItEmOHxYDR3MhcdDaNAsKJydAz5IySKRNjEUmy88vjOVaU8F0iPCqCNjEBHkC/UYaGYFwqxmJoKLYOhkxPElg0QsbNtTlmox9yjRD9UCbnoOR+J/lwRWtOCcdXfDc2BPpg0d7CQlIQZPh9KKlVkAQjJ2x2zmOSsQu7hpzUJfBhLjsNQmADjxcT10Bcl4rE4EHc5LjBEhEPn7f1WTqXSLQB/s1Tp7vslsoIkyPPiMJAbi86McBguiaHKjoEqR4jJy2K0nAxApzMN5iUGrclrKVaz2fUvuF4tRbxDKA90w5VjTFyLZKHpTBSq4/1QnxGB2qxoVIZx0JopRCPHFSNOThfWZzfrXDcZEowH4iA05ATg68hDtBaL0HAuCm3lJ9Bfcx2fFNUoi/DCjRgfNHHd1wCZA2TyXjNkE6F0cBDpPFiojeNi8EkJdFoN3vXch0nbBJOhDd907dANv8JITxNqziag3ZsJbUDAwLin50Q9QWwl1qSYoNOVvUcOoqOqAAa9Fu9H2/F9+B5WZLcwOyxFX18flLI+VASyMGVeoJHD+Tzq5BS1PoaKRrNT8127P74swsq4FCa9FKvqBqwaOiz3hdEuLKueYSyECT2LNW0eIfo3E/WmEbvnG1MUJnWdpWhDGDvxQXZHo+RR0uW2tnv+auPX+TvtJm7zKpaen/4y2yjBUlcxlvtvmvT16ZWDpQeoVv3/60F/NrHjTf4ugazIXtJ8ivjnz/sJ+yGQRjcqUdIAAAAASUVORK5CYII=']
      ['Rabite',     'BIAAAAQCAYAAAAbBi9cAAAD/0lEQVR4Xl2MXUxbdQDFz/9+9Lb3tkBLCxTKhzgoOOZAsokbJmZxDFHnd+LL4hKVzBgfNCY++ODbjDEaZowvErOM6HRu6hKZY2rIAOkCY4OSDTpFaAsrlJa2t5+39+NvjT7tnJzknIfzI98Nf/C6TuXdguWBd1q9rcb8/CwsZiu2Ywm4nDVo3VWLZCKDaDwJq9mCg31PgjAMKKUwmcyYvTbek9iJRDm6M/XswEDjwNz6plWW6wdZhjUAintFCEEhn0N04zYskljaDLaj8ar49oUrsYR6mrFJNj322w46H8y+mitM/ZJKZmyE4XAvjJSsazpyuSzslVZIkgWKOvvRgQ6Xrdlhqmds7o7bFZoLkctreKxf7GtuCE7IyUQjBQcQ8j/lvxCGQJZz0IoCVpamTtzfIh9nwiaIrCQyjNg8mq11oDLUhNXRJfT1Ozr3tS/PqpnQ80qRgjAmKIqBfK4ItbSLKoOZqR/6neLkENlSUAIhlktvEf+sD2rkm8nWTHtvZCGMVON1ePuaoBER31/MXGly1wSqq9Uug6FluYyWXJiPqFXmjd4Dh9oF9ZKKimYXRtYCx8lmMIDIxlIPGz591av0mtanF7FcCEN6iMXeox2wOJ0QJAmUAoRQaIqCnWAQY1/ewKNGNeQuYXkm0d2NC2e+wvmRr/Hx+6+8PHayrbDyyQBNDb9As3PHKDWG6MTM23RoeJAWsqeoWvyUUv0UHf7pBB0fe4OeeXe3/vmHbx3+8dwIGJ4IsFpMMFe0fbtAn+nwZePr1u4MBK8XIALG/Rt479wYrs2vgeNNAMNgMbiNzybuoKVvn+Gs9kbr6qpBfJfGYHFIkJUCoGwfqcoMX/b27EGhwgOjoCADDlP+CA51ugFFRzoB8FYNaQ1oqKD44+eNL+wNj7zJGQSIhe8+jgQ9thk+27v/KRY6L4FSCkVOwtlQj6P73Qgt/o1ERoKt4iUkE7+jrZMHyzIoK9cOBFfT4LbWAk+0a7ZLnvqHcTNdACgFScfAcjxEdy00VQclHGo7dqGeYxHbvIo6hwhSghCehb3G5p6eW7VxXC5/xGWToMgrKKoaCnIalI9CIARasQAqloMI/x4BWrLLYwE1AEPTwCGHaGjz7pw/leZUNV8wNm9BLy6CxsvxZ1kMbaY4TKIIXlNBsynoVjvAC4CuAoYOVi+CMfLYCUfg95tPHuzZB0YtKzsb58RMucWE/fZmhCbdOP9rNnLnxko6GVoB8lFwyVVw8b/AyeulHoJyN4Rb19dTFyeqBlu6njvfsWcvOJvLs7DMmw/7bvpeE4pU2OIcgcqmp4fGAgt2Txwvqr7lTp5V7LquZxXC6+BqEvGcY5pyjaM1tffJbk89NE3FP5VQ6y7a+paZAAAAAElFTkSuQmCC']
      ['Arch',       'BAAAAAQCAMAAAAoLQ9TAAABCFBMVEUAAAAA//8rqtVAqtUQj88tpdIYks46otwVldUbktEaldMjldM2qNcXk9IWktQZkdIYlc8mnNUXlNEZktEZlNIYktIWlNMXktE7o9klmdMXktFHqdkXk9EWk9EYk9IlmtQXlNEXktAWk9AWlNEYlNFDptkZldMYk9E4otg/p9kXktEXk9AXlNA4otclmdQXk9IYktEXlNEwn9YXk9IXk9FFp9o3otgXk9FPrdwXk9E2otdCptkXk9E/ptkcldIXk9Edl9IXk9EjmdUXk9EXk9EXk9EbldIcldIjmdMmmtQsndUvntYyn9YyoNYzoNc0odc1odc2odc6pNg7pNg9pdlDp9pJqttOrdzlYlFbAAAARXRSTlMAAQYMEBEVFhgcHR0mLS8zNTY3PT4/RU1kdXp6e3+Cg4WIiYqMjZGXl5mbnqSnrbS3zMzV3OPk7Ozv8fT29vf4+fz8/f7SyXIjAAAAmUlEQVR4XlXI1WLCUBQF0YM3SHB3a1B3l7Bx1///E6ANkDtva0jKbCW2XIH1z2hiZEZ4uUgxo7JedTQye/KN/Sb5tbJ+7V9OXd1n+O+38257TL+tah3mADAwSMM7wzQWF4Hff6ubQIZIAIb6vxEF4CZyATXhZa4HwEnEA+2QgoiyQDnIEWkjVSBBZBqXbCRlKYo8+Rwkyx54AOYfFe7HhFa7AAAAAElFTkSuQmCC']
      ['CentOS',     'BAAAAAQCAMAAAAoLQ9TAAAB5lBMVEUAAADy8tng4Ovs9tnk5O3c7bX44LLduNO1tdDh7r/eutj43q2kocX23az07N+qqsvUqcmXl7331ZXJj7r40o/Pn8T42qP63KjNw9n21p3Y387Ml7732JzR55z05MSxtMLGn8TC4Hx8eqt8e62Af6/B4HnG4oPC4HzH44fBf7LCgbOkoMTcsrmtn8PWqcfFtKrj4Jvs2ZOz2FnMqLXT3KfY5p60Z6NUU5XRuqHzwWSywqDn3JaiiLWahrWhkry5zJjRmqm1Z6P1wmb1y319fK632mK5cKi5nH+73Gu73Gy73W283W+9eK17e6y1yZS3aqRZWJdcW5ldXJplXZppaKBwb6VwcKV5eKswL306OYNPTpGkfK+m0kGpUJWq1EnEqIuXK3+Xh7ahP4qhkryMfK6BgK+CdpGMaKKMa6O9ea2+eq6+oYW/eq+NbqWVlL2Wlr7AjanA4HnA4HrBkqbBlafB33rCgbLCmKjCxIzC1mSs1UytV5mtxIWt1lCuz2evWpuvXJywxYzHjrvH4oXIjrrN2HXO5pTO5pXUlYnUlYvVl5Hb0G7e0XTg03rhr5fpzHPpzXTp0Hvtz3/wrDHytknyt0zyuE3yuVHzvVr0wGP1x3T1yHf1yXe0ZaL2zYP30o730pD31ZeRIcF5AAAAQ3RSTlMAFBkbHEhJS0xMTk5UWWBsd4SEiIiPkJCVlZaam6CjpK29wMPDxMTFxcnK193e3+Dg4uTn5+fo6e/v8/P4+fn7/P7+J4XBAAAAAOBJREFUeF5Vj1OvAwEYBb/yGlu717atLW0b17Zt2/6nze42TTpvMw8nOZCAmwUpiIY6c5IiLi9tPX64GairqszHQ4X2VB64v1Cs6PxMPJSdHM777s6/jyaMRGiRLyyrb88OpjZ3CzAXrm1sqzSNNeN7kVBPNgB7cG51abE5l9cXDces7emQ1uadHhutFUg6gpPKkSIqQGavwz7r7O/+/3t/rSdjI9XDM3qz4fr3B/3iA0aJTG9x71+9oR/PLDwUe2wm19bly+fTIxHyEETatbPewGEw6Mk/tKZCEqSQQUlIHB/QNBEjjVN1AAAAAElFTkSuQmCC']
      ['Debian',     'A0AAAAQCAYAAADNo/U5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAZ5JREFUOE+Nkk0oBHEYxv8fu5GQj3JwcaDkIAc5IpR87M7MKnIVJVKclaIQ5Sy5OLkgR7n5OigcSNpmd2c2Vyfl4KT8/muWiVU79TTv+7zv837NCBF6PG1X+NpZyEYSD9mIc+tHnBPe23B9xKrCuTmbQA/JKfABrhBswa1hH4A38IwfOxPdX1qcjiCQxO5NyrjKV70TnSbeRPwJvGN3i4yyqnEucPY8ZZX9GSEgGK+RvFfyjk2VKZxzBNG8wJWWgh/xtDOeUXZ7Slr6TrSLYL9N4SMgYTTcwdc2ArvJcElhSVcM6mCNSV8n9hA59yTU5UWMG6HIbLhIWlglgWiC2L4Z79qTdo40D6ISuOWwKCWHyk9Fv8ldpUHOuGTuynwSBUynddPdlbEosVpP9Eu4FnOsRzUYNTsdmZN/d5LDiqM0w+2CMdAFFsFGWgfXxZnheqe/z+0puwEM0HHYV3Z9Sgz8TEz7GkQvpuJ/36ggj2AaHLrSlkULWV5x+h2E8xkZL16YVjGNaAUscfZ/f6c/k9ywLKI2MMcRWl0RLy007idmRbQJ7RIfDAAAAABJRU5ErkJggg==']
      ['Fedora',     'BAAAAAQCAMAAAAoLQ9TAAABPlBMVEUAAAApQXIpQXIpQXIqQ3UpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIpQXIqQ3QpQXIpQXIqRHYpQXIpQXIqQ3QqRHYpQXI8brT///8uTYMpQnM5Zqg5ZqnS1+I4ZaY4ZactSn8uRnYrQ3MrRXgsRHUsR3s8bbM8brMtSX4wUosxVI01XZw2X50vUIguToQvR3c6X5o6aKs6aq08Un8qQnM9VIFDWINJXohKcKlXapEqQ3UvUIc2X55bhcBdcJVgcpdhfapmd5tuk8dxgqJ1hKR5jbB6iah/m8Shudq3v9C4wNG/x9bFy9nFzNnFzNrIz9zK0NzK0t/O2+3P1eA2YaDU2eTb3+jb4Oje4urj6fHm6e/s7/Tz9fj3+fz7/P38/f3+/v83YaEa/NNxAAAAHnRSTlMABAoVGyY1SVlpeIuQsLfDzdHW4+3y8/b39/n6+vr4+ns8AAAAyklEQVR4XiWN5XrDMAxF75KOknYdZJS0klNmHjMzMzO9/wvMcH7I37mSJShsJ+5NjMT6umDoHyXDcI/2qJadh++P3cle1de+9yPe3/bTY92wzfzr7wGtP3JrAI72BZGVtcAdQlwHy+JS1pDbBE9qamZF3BYrjQxPEXwKc6dC8bXFm0QIpmt8kn0Rn093q82UCtK8oXZckwFJzuulV8bHkajPyXdbnJnARfDHs0trz+JQ+5AFvzp/L0+cL2qPAINUPrq5OC6p/64F/AMnrST+Dq/r7QAAAABJRU5ErkJggg==']
      ['FreeBSD',    'BAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAABIAAAASABGyWs+AAAABmJLR0QA/wD/AP+gvaeTAAADXklEQVQYGQXBS2wUZQDA8f83j33M9rF9d7u4loaWklaDpkSo9KDGaIKUaGxshD2YSPRiuDVeTDyhBxosJCoa40ktpAkPDcUqAYVIpUSUPrAulEdD2bbb7e7ObGcfM/P5+4kwKDvq6yJ1FYYcvb+YAkqAHo/HQ7FYrFIoCiurq9ZXJ06YSOkA+kBzfX06bys3zHxS9EL0tXDVyZfefacqV+X/ZSJx5+qLbx98LhaL9RiGEZWlEsWC/Thd9q6Pf3vs2u6Orc83rFsvTwwfLf5obgywT1Vjh2Hh+rbNsnTssJdNLedK5aIrpSuldKVXKsnH4+Pyn6FDXn5tMef9O+3NvdkvP1V4+EYw2AoQ+KSx8dRYS6NXXnwovaItXduSrrkinWxGOmZWJi9OyOK9m1LmsjIz9IH8QUMOd3WfAQwNKCy2tJwbHB5+XasPaxIHmc4g7WWEZ1MquBiRFlJTf1E7+Tl/H/8asavPzTY1nWd2ZkMDRPeBeHPz5ojwsilEQCBvTSKunCF3M8FSNkBGVTHDYYrLj8jVNhDZ2SMa2zo3MTamaIC/u6Ojr3DtrOrvP0BpdATnyBeIhTxpR5ABUlKSUlXS1dWstbVxdz6hPL0l1quGqkLaKwNvVcjEXNRd/4mit4Z19DjefBEPyCKxgQJQcF28dBrHNDGTSZSezsjeff0hraa2Vs2vrvit81O4vj9xLJcC4ADrQA7YAGqBGsAql/EtLdFQE/L7dF1XZmdnSrbPMJfXoLDmolQK8gJyQBowgQhQDRQBD+hsraVhd4e5MH+/oExfvWLJ9q3/3S7qMpNH2hsS40kFS4EUUAMA2IANRIBXv4uzuO67c2PykqkA5YmZ6bN18YPi0Yoknxc4AsJPCMLVAk2BLKDosCWqs/PZaulkuxk9fekcUBAAQGDks5FT0W++3NuYuC0DVUL4DIEdlIQDAj0IRkigaMjArkFx0tf523sffrQHyKsAgHPhwoXLL+yP9/kePNhk5ExUTyKFkJVAUAiCFZrQup4Rv9ftuLV/6ONBYBVABQAArMvJ5MXW7duD6P62sD8UrPAFRU1TpeCpCnGvPZr7WW///v0jpw+VC9ZdAAABAAAAAMLo7drWrmQyPWG/r8tnaGIjaM05ujr16x/ZBFh5AACA/wGZnIuw4Z4A3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMi0wNy0wNFQxMDowOTo0OS0wNDowMOPVpFwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMDctMDRUMTA6MDk6NDktMDQ6MDCSiBzgAAAAAElFTkSuQmCC']
      ['Gentoo',     'BAAAAAQCAMAAAAoLQ9TAAAB9VBMVEUAAAD///+AgICqqv+AgIC/v9+Ojqqii9GAgKptYZKQkOmPj/ddUYBgW4eVjeCTgfiWjO5wbJaZkvPBvepkXomYkNldV4Bzbpl6dJ+Uj7ynoO6Vi+1qZI63se2mnudjXYjOy+GCfaqZjvWlm/Pc2e+Oh7NeWIOWjfeXjeW1sd+gl+diXIfp5/KHgKnn5/F2cZx6c6ZgWoXc2e6dltrAvNu0scrX1eTOyujCvup4c5qpovVpY43///+6uPPJyPXq6fvm5vrz8/z8/P7+/v/d3PixqvmxrPSyrfe0sPO0sfS3tMve2/3r6vy6ufPz8/3d3fi3tM63tPO4tsu5tsu5tvO6tfe6t/Vva5KRjKy7tvW7t/W9vPO/vM+/vvPCwfPEw/TFwvTFxOfGxfTGxvTHxvTIx/TJx/aTiOrNzPXNzfXQzfnRzuHS0fbS0vbT0uHU0e/U0uTU0/bW0+zW1ffX1vfY1/jZ2Pjb2/jc2uSTiemVkLSlnvbe3PTe3vng3fzg3f3g4Pnh4Pnh4fri4enj4/nk5Prl5Prm4/ymn/bn5vro5/rp6O/p6funoPWsqs3t7Pvt7fXv7vzv7v3w7/nx7/3y8f3y8v3z8vytqPWuqPX09P319P319P719f339v739/34+P35+f37+/+uqev9/f6vqvSwrPQAR0dcAAAAPHRSTlMAAQIDBAgJCwwVFyAsNUFHSVBneH+Bh4mVmZmanKCxsrK2tr3ExtDW19rb4ODl5u3t7u/w8/T6+/z9/f4MkNJ1AAAA8ElEQVR4XjXNw5aDURSE0YrRtm3b54+dtm3btm3bz9k3Wek9+2pSYFwT8ibzE93hwAtdJqK3nZo4J9hFXbP+vFHOthV6gnGzstZq94wdCs4UCCDymQ2v7X0LdYoSQ0MIENRYzJbRlPTTHu73ZNAL8vivmVui98PpzuqffX0mIPHJGtOQenukteJ+aS3b9htNpDnT9TeZH1bHAwBRMhGpd6e6uNrLoRgxBKmsX47nBlp678ojpEA40fejcmW4e/No0V8IIPfj6eKgbEJ3ZUnzgE1OqWp9Q3VeWRAsg51f1dZ8c31RmAsc+N5JGbG+zvj3BzDCPrzMDC9SAAAAAElFTkSuQmCC']
      ['Mint',       'BAAAAAQCAMAAAAoLQ9TAAACVVBMVEUAAADh4eEAAAAAAAAAAAAAAAAAAAAsLCyXl5dgYGCnp6eTk5N3d3fBwcGqqqq8vLzNzc3Ozs7Ozs7Pz8/Pz9DQ0NHR0dLS0tLS0tPT09Pf3t/Pz8/i4eLb29vZ2drZ2tna2dra2trf3t/u7O/u7e/u7O/r6+vt7O/w7/Lw8PDy8fTz8fXz8fbx8fHz8/P19fb49/j49/n6+vuPxlmWyGOx437h9NDr9eD6/fj////+/v75/vTA5Jv6/fb7/fnL5bDL5q+AxjeDxUCEzTyGxUaGzjyHxkiHzz6J0D+Kxk6K0kCLyE2M00WNy06P00mSz1OUyF+W2FGX1FiY0F6Z02CZ21ac0Wiez2yfz2+f2mOh4GCi4GOi4WKi4mOk12+k3Wul32um1Hin0nun4G6n5Gin5Wmo23Op2Huq1n+q43Cr526s4Hit23+v6XSw34Cw34Gw6nWx4IKy4IOy44Cy63ez146z34az4IWz4YW03Y217nu38H2625e645G74pK83pu98Iq984W+4ZjA4px0tzDA5ZrB8ZDC5p7D55/E947F6KHF+JHH4qvH6qTI46/K5LLL5LN1tzLL5bN1uTDL57DM5bPM6qzM66/N5rTP6LbP6bTR6rfS573T67vT7LrV7r3X68XX7MHX773Y77/Y9rvZ8cHa7cjd88bi88/j8tTk8djk9tHm8trn89vo89zo9N3p9N3p9d7p9tvq9d/s+93s/dzy+erz+O73+vT4/PX5/fT5/fX5/vN1uzB3vTD6/ff6/fh5uTj8/fv9/vr9/vx8wjV/xDmrMRH0AAAAOXRSTlMAAAECAwQJDzk/RUlNU3F0kpSVlpeYmpucnaKjpKWqqqqtu8LExMTEzdTU1NXY4evy8vP+/v7+/v6LaR1mAAABD0lEQVR4XiXI03bEABAA0KltW9kaW3eSZW3btm3btm3b/q4mp/fxgqKOtpamhrqaqoqykrQYABh+PVMU9fjE5Xp8o54kgPHN0EBHU2N5YXZykiua0HHd2759VF2Sk5IYE5GGsmCEWLV1kVWwt5O+3x/qpgsy8k4ja+cJl2/v5C22tlgCAHtw9TQSa4s+AzfPSm0BRNl9SydhWJzLC567KrNhgrNwHIJ5qTz/2f9w7Jw/DNqIjVr04exW0AEOXcN3Ab7enr9eDW2VTJgehONyc2Z8XP5YdD0Tcuhcc4/r45OjGX51TEjYPbh8THRPvbz+CHusgSZlT7rP8PkCwfQKaQUi9Igr6JsRBMFiWZgb/AHKElRzKopZJQAAAABJRU5ErkJggg==']
      ['Osx',        'BAAAAAQCAMAAAAoLQ9TAAABrVBMVEUAAAD///////+qqqr///+ZmZn///+qqqqAgID///////+tra339/eAgICoqKjx8fGMjIzm5ubh4eGPj4/g4ODIyMiAgICSkpKLi4vS1tbPz8+Xl5eMjIypqanIyMjW1tZ2dnbR0dGamprFxcV3d3d+fn60tbV3d3dcXFx3d3epqal7fHxxcXF+foCnp6hYWFhyc3Ojo6SMjI5fX196enp+fn6Li4xERERqamqgoKFpaWmFhoeen6A/Pz9QUFCWlpeSk5SUlZWUlZaOjo+Tk5RHR0cuLi5YWFgwMDAeHh40NDQ3Nzc6OjpcXF1rbG0XFxdSU1NVVVVXV1dZWVlbW1tnZ2lwcHABAQEEBAQXFxchISI+P0BISUpaW1xHR0kNDg4qKyszNDU1NTY9Pj8NDQ1cXF4XFxhSU1QSEhIDAwMrKywtLS4uLi4wMDFHSElISEggISE0NDVJSktNTU1FRUVWVlhGRkYEBAVBQUE0NTZQUVJQUVMFBQUqKitWV1lXV1daWlpaWlw+Pj8bGxtcXV9dXV1fX19fYGFgYGBkZGRlZmhpaWlsbGxwcHB2dna844Y9AAAAV3RSTlMAAQIDAwUFBggMDhkeICMkKCgqMDIzPj9ERFBib4CCg4iMjZCcnp+jqamrw83W1tvb3ePl6Ojp6+vs7u7v8PHy9PT09PT3+vr7/f39/f39/v7+/v7+/v50ou7NAAAA30lEQVR4XkXIY3vDYABG4SepMdq2bRSz/capzdm2fvOuDO397Rw0Ly4tz2QAQPbcxuZ2E/STJwfxPhWgG355fRrVAIVb1zeP9UDLfiSwkAcADe8fn7tFxWuEXFRDoer/OgoMTRBCumj8yJwPBo8Zhpk14U856/HI8n0ZUtpZ1udrSzfVneA4roNKjdrwpcMRilb8d8G60+lKnrpWcn9bO+B23w2O8Tzfq4aiNSZJqzn5O4Kw16h06fPZ+VUlUHfo97+VAEb7rSh2UgDd4/U+TBlQY7FMj5gBIGvcarVVfQPVPTG94D0j9QAAAABJRU5ErkJggg==']
      ['Rhel',       'BAAAAAQCAMAAAAoLQ9TAAABj1BMVEUAAAD///////8AAAD///////8AAAD///8AAAD///////8AAAD///8AAAD+/v4AAAAAAAAAAAArKysAAAD///////8AAAAAAAAAAAAAAAD///8AAAAAAAAAAAD///8AAAD///8AAAAAAAAAAAAAAAB5eXn+/v5JSUnKysrS0tJ5eXmqqqqxsrL+/v4ZCgknJyeHh4eIiIjo6OgZCAdOTk7t7e3///8GCwwPAAArKyv19fX29vb9/f0EAAD////+/v4AAAAGBgYHAAAJAAAMAAANAQAPAQAVAQFyCQV9fX2pIRzmEQjn5+cBAAAFAAAAAADnEQjvEgn////uEQjyEgnsEQjzEgnxEgljBwPaEAj9EwnwEglHBQJHBQNNBQIBAAB3CQR5CQSHCgWLCgWRCgWTCwadDAWmDAapDAa/DgfKDwjWEAgGAADh4eHiEQjmEQjmEQkKAADoEQgLAQDtEQgMAQDuEQnvEQjvEQkPAQAfAgEuAwEvAwE8BAL1Egn3Egn4Egn6Egk+BAL+/v5CBQJrB0muAAAAT3RSTlMAAAMEBAkYGhsbMTRLUmpvcHeIjLe6vcHCxM3P0NbW3Ojp6u/w9ff5+fn6+vr6+/v7+/v8/Pz9/f39/f39/f7+/v7+/v7+/v7+/v7+/v7+Q8UoNAAAAO5JREFUeF4tiwVPA0EYRL9SXIsWl+LuxfcOd2Z3764quLu788NZNrxkksmbDP2R7vH6GioLs+iffEzNXd4+TqPErUUpVqMOvwgdzMPn1rv5vPsVeufBTaBK/bH2FPvkEUuIG5jIIc+sHYn/HJ3dC/Hxuo4y8s44dzwBbFkisHN8bVIdXs6jb+H97aCwbHEIqgcml64CD7YllNkAVQC940MLYe5YzvIeQAXNrd19Roc5MdzfdQLUUKaUYyuG9I8y1g4gj6hIak4X5cBIT2MquZJrJdOqpY11ZpAiqVwbY/C7KY1cRCrZxX4pWXVuiuq/hs49kg4OyP4AAAAASUVORK5CYII=']
      ['Sabayon',    'BAAAAAQCAMAAAAoLQ9TAAABvFBMVEUAAAAcUaYdVKwAAAAAAAUABAwWRY4YSZYhZtIhaNYHDx0KCgoFDBcKCgoRMmYSNm0fXL0fXb8AAAAYS5gaTp8fXLwgXsEGBgYFBQUZSpgZTZ4JFSgODg4IEiIOJkwOKVIkW7EnXbQLGzUTExMKGC8LHjwMIkITExMiIiIPEBEPJ00QEhMXOXAaPncOJEgoXbApXbEcHBwwMDAEAgAfHRgQDgo3NC8AAAAHBwcKCgoLCwsJCQkaGhofHx8lJSUwMDA0NDQ4ODiRkZEICQocHBweHh4GBgYHCg8mJiYnJycpKSkrKystLS0uLi4ICAgODg43NzcRERF1dXUUFBSjo6O1tbUbGxsEBAMLGS8MDA0iIiIjIyMkJCQNDQ0NHTYKCQkoKCgPDw8QEBArMDkKCgkRERIREhMxMTEyMjISIz00Njk1NTU2NjYCAgIVFRU5OTo5P0c8PD0+Pj4/QURAQEBHR0dKSkpMTExSUlJiYmJlZWVnZ2cWFhZ2dnZ4eHh8fHx9fX2FhYUXFxeVlZWXl5eYmJiZmZmcnJwZGRmlpaWrq6usrKyvr68KFiq/v7/FxcXY2Nji4uLn5+ft7e0yif9uAAAAN3RSTlMAAAApKSkqKioqg4OEhISEhoa1tra3t7y9vr7S09PT09TU+Pj5+fn5+/v7+/v7+/v7/v7+/v7+70RY/wAAAPpJREFUeF4dyWNjw2AUBeC7dfYyorM6rx1exKltzLZt2/rDa/J8OgBVVlFDX39jcTZoUqCse251a2dvu6ccUtWlanLQ4Vpel+ThlWq1l3wEz58tx4dOt1dMlAJk9A5gMjG75LHwo46hzkwosGOMbejumoRvubC9EOrMviT0E0Us9fvN9dA6zxJCNv6+ECGsb6oNWsgmpZT9/UTUZo3Em6AW34guTL4jiAudiCM1kLcw8/SmHERfT1/eueBiDqR1GK1n9w+K8nglxYxd6QAML4ztXoQuj8YFgWcgqdJp8qzty26vaboCNIxBCshyQDKov0aXr29v1ufq1PwPx5Q7bCoh6eoAAAAASUVORK5CYII=']
      ['Slackware',  'BAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AcEDi0qZWWDgAAAAx1JREFUOMt9kktoXHUchb/ffc1M7rySSdJMOknFPMRitLgoNKKI8ZHGKkgrjU8SitidimSh2UkXoQmoO1dGQSxJjdvOtqSaqlR0USEGSjVJGxuSmWR6M3fu4/93YX0g4rc9HA6cc4Q7DI+fpzz7PA8++2mxvZAeBZ4xhHtFcJRmXWsWvb36/OLcyxf5B/KHeYHy7DmGx1+YSDjmWTdlobTGMAStQGkNoLXS4tXDq7u7tUcWz49tA8jR8QUuzB5n5NTCV13F9JEo1JJwTLKuzU61QiOMcd0UDb+BncwQK3Rl15eNja3ui/Njq8aF2eMcO/XlBz0H8oO2ZUkum6A13WB99TtyzXlaCi24SaFa+ZFCzsG2DNnfkdbFjsI1APPhk+d6ujqznycdCxFozadYWvyMpx47wa+bPkGksKwUNnsk3TaCGASRXDZh5LpHXPPg4Rcni+3uYBxrtBbQghlscOVKmYHeEm0ZIZ9xyLffw41ND6VAa43SmjiMByzHYtjzwr9arfshxf5jOKlvKZfn8es77N2uks24PPfSFD/9Uvt7AtPKWmEU9d645eHYJo5tcKi/FX/zG+zmQxQH+rANk862DOW5N/hhaY64cJSa5xNFCgDDILZACMKYWAmh73HmzFsMlBQJ06LeiMinE1S3KzRCm5rXIIoUIoKIYCVM36urZFbEoiBLNMIhAE6/NsSB7h6SKZdL8xsUOnpx9j1KbTdARACIowArYe1ergfNT2i0mIbJys0GI6PT3N1/hJvrPxOFdRJNBQIy/FapI4Bpgohgcjuw+jq8jy8tV55MNBWI4ohS802CpizKv8q+FgALZAfYgSyAZtNro1oLaU1VvxCA029Oraxs7u/tKnXiNjn8HyKwur6lI++6vPK4V7IA7u+1Dyu1tr183ddNbkHuXP8/zEIYeFqiLRl6YO/p0bHJdflT/PD9qZa1W+ry99fcvlAlcZwUpuUAglIRYVgnDEIOlna4q0M/NPnuO1/PzMwg/045O/XeibUt5/Xangx6viSVFpK2jtMpvdyWCz+5ryf10clX3/amp6eZmJjgd441URWWJY8BAAAAAElFTkSuQmCC']
      ['Trisquel',   'BAAAAAQCAMAAAAoLQ9TAAABjFBMVEX///8AAAAAAAAAAAAAADMAAGYAAAAAHFUAGWYAF10AImYAIGAAHloAHGMAKGsAGmYAJmYAJGEAKnUAJ1gAMXYAJnEAJGQAI2EAK28AK3cAGTEAMHgALXEALXgALG0AFUAAI2oAK3EAMngANoYALXMANIAAM4IANIIAL3gANIcANokANoQANYQAOY0ANIYANooAN4kAN40AOY0APZMANIUAOY0AO5AAPZUAPJAAP5MAPpQAQJUAOYsAPpYANoUAPpoAPpUAM4AAQJkAPZIAPJEAQpgAN4cAPpQAPZUAPJEAO4oAOosAOo8AQJoAOYsAO44AQpsAO48AQp0AP5UAQpoARJwAQ58ARaAAQZgAQ54AQ50AQpgARaIARqMARaMARaIAR6QARaIARaEASakARKEAR6MASqsARKEASKcAR6MARqYAR6UATbEATa8ARqUARKAAR6oARqMASKgATK8AR6QATbIATbAASq0AR6cASKgASqwAR6UASKcATa8ASqoASqwAS6wASKoAS60ATbHn4CTpAAAAhHRSTlMAAQIFBQUGCQoLDxAREhMUFBUYGhobHB0eHh8gIiIjJCQkJCYoLC0xMTE0NDo6Oz1BQUNHSUxOVFVVVldaWl5iY2RkZWZoamtsb3FycnR1ent9f4KDhIiJioyNkJGYm5+foqOkpqamqKmqrKytsLKzs7e4uLy8v8TFxcXGx8rO0NXY2eZc4XYcAAAA00lEQVR4XkWN1VoCUQAG/3NWtwh7CTsQJOyk7BaDxuxA6bbrxf32gt25m7kZqDRYxziooDV7+1AalMUavQh2AsEZoWvzigLun+T17/c8QiJZ7qu2QKiNmyZthdcR1/as353jIeU1GxMHo5XHdqPFeX8IaDMdHPYN6dRN7LR4qQewdTa35HWkyh+fbxERAMjwlAWJv3CPSKDQ+H7XvHdkV4Pua3Gtm4sPKIF/WV8dop4VKBw/NU33B3x1JbTt+XwhkJQoqRfWvHOy28uqH8JIdomR/R+s9yR3Cso77AAAAABJRU5ErkJggg==']
      ['Ubuntu',     'BAAAAAQCAMAAAAoLQ9TAAABKVBMVEX////ojFzplGf1zbnqnHLvs5P10b3yuZv1xKrytZXvtJXys5LysI32waT0n3HxiVHwg0jxhk31kFn0h0zxf0P0hUrveTv2iU3yfkD1hEfyejv5eDLybSX0aR7zZxvyayH6ZxnxZBj4YhH7XAb5WALlUQLeTwHgUAHeTgHfTwD65NzdTQDdTQHdTgD31MfcTgLcTADcTQD////xt5/31Mf54dfmfE/dUAbeVQ/jcUDcTgHeWBnnflHohFvpjGbqkGztnX342Mz53dLgXiP65d399PHdUgrtoYLyu6Xzvaf76eLfXB/rkm/fWhvupojwrpTeVhTgYSfgYynzwa30xbL1ybnngFT31snngljhZS3539XhZzDiajbibDn77OX88Ovrl3X99vTjbz1fisGCAAAAMHRSTlMABgYGBwcHJiorMDA1NXGHjY2Nl5mZmZyfn6O5u8XHzc3X193j9fj4+vr6/f39/f08OUojAAAAx0lEQVR4Xi3HZVbDYBhGwQctWqzFPXiQ+36pu+LubvtfBKcN82/UEhld2vWXxyL6F92gbTPabse8hU/uHMx1SZoyyJWPTwq1Rs7GpYE9+Cg+OJcs1MHvU9y4fnrN31yUm18vMCIPjtw3QMndw4rs8ieVzAAcBlewpe1KM3uaBuD3Dda1BhWXAsi6AFY1a2SqifxZ+rnxWYcJDRkUS3fO1R5vwe+XZgw4D4L3RAJiknoXCVX3WeiUpJ5pIxTvVmg45pl5k4Ot/AGV2iqZBWgJJAAAAABJRU5ErkJggg==']
      ['Windows',    'BIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAA+pJREFUOE+F0n84FHYcB3CWSsL9ojo/6ik64c6PnTjmSS0limmrpBm2G002y++xzXRz6zE0R4nbw+RnTj/WD4sbanLkkAe55ccYlyNme4SrO9u9d13PI3/saZ+/vs/3831ez+f9eb5aWsuqy2mjRYeNUa7YmtjfTico7jNJ8z0eG24NB9vvnDrvufzpq89Npnr8VjMddNmuRh9rDfp36mFg91oM7qPIc5JdbDJq3An/JfCu7Hl53W2lpS220pP2OuniN299jAYbYizSENIoAgbCTdrTKtxOJVdvGo8psUwKy7Vxe4ez1YEVudGP8YEZzyveInFJ6mZRHHqYazDspw/pJwTIuERM5JIwmUdGdyo9K7/BszGzzg6fXzZHGJ8KvzQqXKOpoIeZLjofWR++BPWyCEnPY4xFGEKWQcLjMjKmr1MwfcMYwmz/Y4KOgNki0V5k1dkjUWCK93Kp2PMFFawos8cm1gZ2GqjLXktL4mbQPHLQ4B9ZDFE5+S356fQlyuJMqzH++HnTo6ui2OO1ko9Ul+4fxfd3d4F7k4YTReqpuFS88bGZUE2QNNDobuIq8Q5CduHb7lFJaTnvnym9ergjMWD/FG8zf+aKS3G9JO5C01Asah6wUXrvALKEDoitMMHhDKrKJdg8RU2s0EB2EWWur8dd7PDPFv6dUC0Gv3kAN36VPRGP/5k5NS6lljWxG0TDiSr1VKhoPwhevRMSqkwRxDObc/DavGtpP6zoi8XOyZfhnyNEvKANBU0P8VPfI/wyNCGXSn7wlEmyA9KrgmOKGth3eDVvPfyywq2dnUEv2R9qG2rLsH7xJXziKnWcI8tlTvEC7Mu8hROlImTU9aKqcwQ1vWOihWFu+sJknmph5CvxQh87c7bNh/NXo03hrMCosyvLmMNgMF7TQL6J1dsZIUVwjKqEO+cajp5vxPN439U/gKBt8PTcYHzL/BgHCyOf4unAISj6mFC2bYC82kB5Ls460NHRUVsDeYSXpGw7UgC7sAtwShDgzdM38W7BbURXtqpqhfmB8sEQuXwoCM/6faGQuGCxyxyKWhIm+PrSD495WL3cT0hhi8Whc3NbAs9KaOyCTvrJ8qkdX19XBeTUDU00+55USFzVU2yHstcaix0mUAjJkJeuRU868Ucmk0lcguiBnMAVxjbbdHV1yeq8+u4Hgo22huSG+iQXp83ftaxW3lsPZcs6KG5T8OwaAfJiPcxlrVRVRhvF02i0F/t5VbHZ7JWDfErKTLnhE3mFPuRFepg/uxqz6TqLv6euGj3ut87t/4ylvre3t3ZehOWWO1zjSFEqMVP4GfGb/DBykJcjmaZOoLsc+hcVY/LaAgcTQAAAAABJRU5ErkJggg==']
      ['OpenBSD',    'BAAAAAQCAYAAAFo9M/3AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAykIPu64pQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADTklEQVQ4y32RXUxTdxjGn3N6eujoKT3SUkuk3VoBGfVjgFXAsZ7WkipyYXQbuu3CzUXZmGRbssnFEseFkWzgcGzGXky9MWL8TsC4IeFgtK4oAqOnG5vMVl1pCMVWQD7b/y5M6jLdflfvxfPked/nBQA0NDSChqnGVrLuGkES742NhJAdhAKAuk9yyUs5Gry7RQMZAARCWgivpQiPe71P5DUfH0xaqTL7m/iiLkJmphawa+e4SM2PvUyC4yUIBu8CnAQKAK53rCA5OUtQtStVpJ4Gw/FOBddZVKhCfq4MP4n6+at+DUsJm/e0G9JZzYEvI2tHwlEYjDxomkZ+3nG8WroRtHihZVOhVlorDQzh0okhcByDP4ZGcf+X9XAsvY5/RsBa7Kq5H/CqLctKyl/g08S2i6fq8W/MS3P34T9wNDVYSeDX1eTD9xhiLXbtB/Akwmmv6Kr+ICFkLpGhtNSM3qsSstS3oX8lSsmsxS6ZVn3j6PvVVqhUcvC8AtPxVPxwygVKvngN89WOjgVprggGA4eenjB4nsXsTASpC63I0wVTZYPR11FoKRB8Ax54PCFk6BhMTk5CPR3GSbHouGzknr/bYFq9EAvfc9Tu1sLjHcXNKxLuTOTgzOlOe7IHBc/beAXWpWmXlz8a84nhcLQ+ecVzsAEQrMWuMX+f9HZF2YPZ28FVSNfoPWqOzMUmqYMAJm7+/OOzXQFwHGpyEV+vi+yvtxBC9pDmpgJC4tvI3mo9GTitIxvW24nT7ug67HY/3eDs2bbyrVsrY2day70rV6kRfDAHk5lDLJqAmmeRiD9GJDKHvwb74R8G0mkTPjrQTTG122xkTTbwaV2b1H4u16JQKXGr7yG2b8/H1MQ09IsTSEmRwzf4CCwzD+dmE1re8CI7wwi5XNlFf9vaTXX4dWJg4LLl7h05fpNGwNAMWpp9CIVYNO/tRCzGwpDFQaVMQTS2CKY0BWr3GVGWNSXKACDDaA4Mh976pq9f5Sy09GgKlmeAMIBKzUKpU+BFoxJecRhUfAbMxDi4eADfHVmE79v7q575gvvYeVvjZ58LD5mwsKUyX0hnf0feslnQCWD4zxnc6reKisxsfH2oscqcmTmK/+Ow252cna7K52r+Bky6PqmoT5HBAAAAAElFTkSuQmCC']
      ['Gnu',        'BAAAAAQCAYAAAFo9M/3AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AoYAywUV5gQrwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADcElEQVQ4y43Tb0jjBRzH8c9v+7nNMebcUW21Cc78g/wcuhByIScoMRwoTBmFlZCmIJ14axqkgoYIkXIqKIVBEuJNUBEUPRlpqDC3Q2Ex0nTezun2YOaPLXNIv7Vvj7zgiOj1+PPk/eADjuNEuHN6ekqMw+H4IzMz8xChUCjV1NT0JbO7uxtfXFy8NZvNr21tbd0AAEQikY6I0m1tbQbx2NjYZiqV+vn29jY+PDw8xhYWFj45PDzcb25uhlQqfSTief6X0dFRpqKigvF4PPPipaWlY7lcXhCLxXJnZmY+ZTY2NnzX19ePGxsbHw0MDLivrq5mc3Jy2pPJZLVWq/2cdbvdDSzLholoNJ1OMy6Xq0Ymk5HNZktOTU29qMgA8HYqlaKDgwNKp9M0PT09BgAM/iGuqqoimUx2yPP8U5/P9wEAMB0dHRUKheJHiUTyeGhoqAUAnE7nR0qlsjcQCLwjlsvlz+bm5mQWi0VSWlr6bXV1tU6hUMj6+/vfN5lMN0xxcfG1zWZ7SETTSqWSGhoamPHxcajV6s+8Xu9Xou7u7t9VKtW00+mkSCTC6PV6aDQa8Dw/Wl9fP8UAQCgUosvLSyovL2eWl5dRUFBw7Ha7v9vc3By5K3g1EAg8FQSBiIguLi4IgBwA2LtEjuPuJxKJ62AwKFpdXf0eQBIvYVmW/cLlchEAWK1WAADT09NzX6PR/OTz+eKVlZUzKpVqTyqVvsnzfLCkpGSrtrb2t97eXnFeXl5ZKpWyZ2RkPPP7/UUnJyefGI3GU+zt7aU4jotOTk7mAUBfX1+b1Wq9kcvlBIAcDgctLCyQxWKhoqIi6uzs/BoAVlZW3qqpqbllZmdnf1hfX//Q4/HEzWbzX+3t7fcMBgMFg0EYjUYmEolAEAREo1Hk5+fT+fk5Mzg4GD86OpJ0dXXJGQBoaWl5Ra/XP6yrq3tQVlam2N7ehslkAsuySCaTUKvVSCQS2NnZSXAcJxYEQTEyMvKeIAhLDADY7fZ7BoPhm6ysLFpbWzuan5//WKvVvsHzPEWjUSYSiSA3N5d0Oh0TjUaf+/1+S2Nj46/4FwYAr7e2tnbF4/E/iYjC4TCFw+F0LBaj/f19mpiYeID/IAagAyABYLXb7cLZ2Rml02nyer3POY6rwv8hEr34u0IkEk1mZ2cTgGMA7768/RtL5JKsGzrLIgAAAABJRU5ErkJggg==']
      ['CrunchBang', 'BYAAAAQCAQAAAC45EetAAAA8ElEQVR4XnWOsUpCYQBGz1TIHYu2Qix6g0DEtSeQu/UIISJtUS8gJq61F1wcdMohcBDxKUR8hsz1xA/y44/cs3znbB+RJ0Skl3pSkeFQbUs79VAPzrwPFRmN1Ja0Ug/16I93+1oi4lKte+zMXv32WuoAm43lXMrqzbFncgWw21lORf4+/PREKpAhYqZuPXZ+T/3yXbZEajV1JavUQ104sRcq0myqc5mnHurWqc/7yhExVwuPncl+C4Bu13L60ueAwcByOtLhgAIRCzU38fRGTmSxUBvSSD3Ui1NvQkXWa7Uq1dRD9R17HiqyRUSy1NP6B7e1Yu2GtlUKAAAAAElFTkSuQmCC']
      ['Yuno',       'BgAAAAPCAYAAAD+pA/bAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAABDtJREFUOE+FlHtMm1UYxrtsi8aEgCb+oTFmZur+WNS5RaPERU10C2qGaBgb6hgwLwMmHTIKlIKlQIHSQrmU24BSSmnpBVooUmihtEC5yKWDjVu5uOkcEca4lG5E93j6EQmELX7Jky/fOed9fu973vMdGu0xT3Cgz57yXMZLDdXcy821PFWLKmuA6HqLMqtLX5POl4iYb2ukWW8IOOFe/qfe3/M4n0eOjwyZD8//bldODOk37N1yDJgl+LVdjEGLFKO9KkzZm8hbje7mIrTXZ7sMtTydrJh15H8hHW11XvN/jGS7VudcD5w34ZZzeQYb67fwYO03LN4exo1+LWzNxbA05O5QuzbHqRYn+++CHDx4YK9WLfaedfQzV5em54g5Zbi8OIml+VFMDLWQ7GXoaSmFWZsDZVGCO2u0EbkhHTrhFqi9PmelSsQ8tAtSVch60dpUeGe4kxgZxegzVkBzlQ2NKBG2+iJIMqMok9r8OLRIMqApToSqmAWTmk9B2+o2YW79oshU7ABcuvAFrVGWXkVKpBYoSaBSxIS2mINpiwbjZiUMZRloVfJQyaXDKObBpimBScpHFe8KmmXpaKhK3arGrBVuVBclHN2CiPNin1OVs1tVJYlQlyZBxA6DviQVo6ZaOKd7sTplw53BVugruBBzfsRslw7rZPxaczWutSpQV/gzJPxo1JexyfaxKBBpuiEx+tw+CpKdEvGWTprGlhcwqbIzL5/DYKMYndpK3L1hxf3ZfkrzwybUZjPhnOqmvlcmutFF1jis9QSShOrcWNSXJ1MA0ou/NZWc8Ddfe4VGO3bk0JON1dyMMlK+gmxNrZCFhZF2Kng7YNO0awt4b7wLNp2EqtAsF6ImP56SG0B6siovTYpIjg15gapCVhAfJRUyIBFEo6k8AyuTtkcC/qvG/XbDexulWJvqgYH0o0nKhVHFJ40XwFQnWM5OCX+XMg86c3KvVMSMapCmPpSTIygTxGKZZOcOXhrr3Mp4uzkFuG6B3ajE3TELDDU8qEmsmvRATxquKkxAnSTFjwKEfv3JU9JC5unG6rQ1bTkbQ4Yq/DVgxOqwBWt2K9Yne3ZCZvrgHO2k5paHzOhSiVCZSkdNTgzy40JRlPgDhDHBCxUZdCs91G8fLeK87zOl6XSOICZYXMGNhDqX9fDP/mbK2DXVi/szm03eLpejl5pzOfqwOt4JBT8OeYwQt/4R/BR0OzXiLCM5LOCji/4nXt46rpywgG+zor5RxgSdupBzJdglSY+5ZZbl3XNY6mbn7W0Lcx06zBg1WBjtcC6OmG+OmRTrFrnIUZESZeVeCpwh8TpiPsQ47/tloM97T+/6m8mg55mT3tStyL54mhlwwtszNvjzD8/6HH8i7PvvPPRioZdRWuDBZUR6pEWG7I8P9Xs1Jsj36MfvvO5J/+rTw58dP7afJPfBgeef3XGz/gskFVpJc4HwGwAAAABJRU5ErkJggg==']
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
        cachedTest = child.innerHTML
        if not Conf['Persistent Custom Board Titles'] or cachedTest is $.get "#{g.BOARD}.#{child.className}.orig", cachedTest
          child.innerHTML = $.get "#{g.BOARD}.#{child.className}", cachedTest
        else
          $.set "#{g.BOARD}.#{child.className}.orig", cachedTest
          $.set "#{g.BOARD}.#{child.className}",      cachedTest

        $.on child, 'click', (e) ->
          if e.shiftKey
            @contentEditable = true

        $.on child, 'keydown', (e) ->
          e.stopPropagation()

        $.on child, 'focus', ->
          @textContent = @innerHTML

        $.on child, 'blur', ->
          $.set "#{g.BOARD}.#{@className}", @textContent
          @innerHTML = @textContent
          @contentEditable = false

      nodes.push child

    $.add title, nodes.reverse()
    $.after banner, title
    return

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

  checkclick: ->
    @check.click()

  selectclick: ->
    e.stopPropagation()
    if Rice.ul
      return Rice.remSelect()
    rect = @getBoundingClientRect()
    {clientHeight} = d.documentElement
    ul = Rice.ul = $.el 'ul',
      id: "selectrice"
    {style} = ul
    style.width = "#{rect.width}px"
    if clientHeight - rect.bottom < 200
      style.bottom = "#{clientHeight - rect.top}px"
    else
      style.top = "#{rect.bottom}px"
    style.left = "#{rect.left}px"
    input = @previousSibling
    for option in input.options
      li = $.el 'li',
        textContent: option.textContent
      li.setAttribute 'data-value', option.value
      $.on li, 'click', (e) ->
        e.stopPropagation()
        container = @parentElement.parentElement
        input = container.previousSibling
        container.firstChild.textContent = @textContent
        input.value = @getAttribute 'data-value'
        ev = document.createEvent 'HTMLEvents'
        ev.initEvent "change", true, true
        $.event input, ev
        Rice.remSelect()
      $.add ul, li
    $.on ul, 'click scroll blur', (e) ->
      e.stopPropagation()
    $.on d, 'click scroll blur resize', Rice.remSelect
    $.add @, ul

  remSelect: ->
    $.off d, 'click scroll blur resize', Rice.remSelect
    $.rm Rice.ul
    delete Rice.ul

  nodes: (source) ->
    checkboxes = $$('[type=checkbox]:not(.riced)', source)
    checkrice = Rice.checkbox
    for input in checkboxes
      checkrice input

    selects = $$('select:not(.riced)', source)
    selectrice = Rice.select
    for input in selects
      selectrice input
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
    if div.parentElement.tagName.toLowerCase() != 'label'
      $.on div, 'click', Rice.checkclick

  select: (input) ->
    $.addClass input, 'riced'
    div = $.el 'div',
      className: 'selectrice'
      innerHTML: "<div>#{input.options[input.selectedIndex].textContent or null}</div>"
    $.on div, "click", (e) ->
      Rice.selectclick

    $.after input, div

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

  fireEvent: (el, evnt) ->
    return unless el

    ev = document.createEvent 'HTMLEvents'
    ev.initEvent evnt, true, true
    el.dispatchEvent ev

  getRelMousePos: (e = window.event) ->
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
      0 + (if (!g.REPLY or Conf['Boards Navigation'] is 'sticky bottom') and Conf['4chan SS Navigation'] then 1.6 else 0)
    else
      20.3 + (if !g.REPLY or !!$ '#postForm input[name=spoiler]' then 1.4 else 0) + (if Conf['Show Post Form Header'] then 1.5 else 0) + (if Conf['Post Form Decorations'] then 0.2 else 0)
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
        return @init()

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
    Style.rice(dialog)
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
    userMascots = $.get "userMascots", {}
    userMascots[name] = Mascots[name]
    $.set 'userMascots', userMascots
    alert "Mascot \"#{name}\" saved."

  close: ->
    Conf['editMode'] = false
    editMascot = {}
    $.rm $("#mascotConf", d.body)
    Style.addStyle()
    Options.dialog("mascot")

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

      userMascots = $.get "userMascots", {}
      userMascots[name] = Mascots[name]
      $.set 'userMascots', userMascots

      alert "Mascot \"#{name}\" imported!"
      $.rm $("#mascotContainer", d.body)
      Options.mascotTab.dialog()

    reader.readAsText(file)

###
  Style.color adapted from 4chan Style Script
###

ThemeTools =
  init: (key) ->
    Conf['editMode'] = "theme"

    if Themes[key]
      editTheme = JSON.parse(JSON.stringify(Themes[key]))
      if ($.get "userThemes", {})[key]
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
            value: "##{Style.colorToHex input.value}"

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
          @nextSibling.value = "##{Style.colorToHex @value}"
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
          Themes[name] = {
            'Author'                      : "Anonymous"
            'Author Tripcode'             : "!POMF.9waa"
            'Background Image'            : 'url("' + (imported.bgImg or '') + '")'
            'Background Attachment'       : bgRPA[3] or ''
            'Background Position'         : ((bgRPA[1] + " ") or '') + (bgRPA[2] or '')
            'Background Repeat'           : bgRPA[0] or ''
            'Background Color'            : 'rgb(' + bgColor.rgb + ')'
            'Dialog Background'           : 'rgba(' + mainColor.rgb + ',.98)'
            'Dialog Border'               : 'rgb(' + brderColor.rgb + ')'
            'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
            'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
            'Reply Background'            : 'rgba(' + mainColor.rgb + ',' + imported.replyOp + ')'
            'Reply Border'                : 'rgb(' + brderColor.rgb + ')'
            'Highlighted Reply Background': 'rgba(' + mainColor.shiftRGB(4, true) + ',' + imported.replyOp + ')'
            'Highlighted Reply Border'    : 'rgb(' + linkColor.rgb + ')'
            'Backlinked Reply Outline'    : 'rgb(' + linkColor.rgb + ')'
            'Checkbox Background'         : 'rgba(' + inputColor.rgb + ',' + imported.replyOp + ')'
            'Checkbox Border'             : 'rgb(' + inputbColor.rgb + ')'
            'Checkbox Checked Background' : 'rgb(' + inputColor.rgb + ')'
            'Input Background'            : 'rgba(' + inputColor.rgb + ',' + imported.replyOp + ')'
            'Input Border'                : 'rgb(' + inputbColor.rgb + ')'
            'Hovered Input Background'    : 'rgba(' + inputColor.hover + ',' + imported.replyOp + ')'
            'Hovered Input Border'        : 'rgb(' + inputbColor.rgb + ')'
            'Focused Input Background'    : 'rgba(' + inputColor.hover + ',' + imported.replyOp + ')'
            'Focused Input Border'        : 'rgb(' + inputbColor.rgb + ')'
            'Buttons Background'          : 'rgba(' + inputColor.rgb + ',' + imported.replyOp + ')'
            'Buttons Border'              : 'rgb(' + inputbColor.rgb + ')'
            'Navigation Background'       : 'rgba(' + bgColor.rgb + ',0.8)'
            'Navigation Border'           : 'rgb(' + mainColor.rgb + ')'
            'Quotelinks'                  : 'rgb(' + linkColor.rgb + ')'
            'Links'                       : 'rgb(' + linkColor.rgb + ')'
            'Hovered Links'               : 'rgb(' + linkHColor.rgb + ')'
            'Navigation Links'            : 'rgb(' + textColor.rgb + ')'
            'Hovered Navigation Links'    : 'rgb(' + linkHColor.rgb + ')'
            'Subjects'                    : 'rgb(' + titleColor.rgb + ')'
            'Names'                       : 'rgb(' + nameColor.rgb + ')'
            'Sage'                        : 'rgb(' + sageColor.rgb + ')'
            'Tripcodes'                   : 'rgb(' + tripColor.rgb + ')'
            'Emails'                      : 'rgb(' + linkColor.rgb + ')'
            'Post Numbers'                : 'rgb(' + linkColor.rgb + ')'
            'Text'                        : 'rgb(' + textColor.rgb + ')'
            'Backlinks'                   : 'rgb(' + linkColor.rgb + ')'
            'Greentext'                   : 'rgb(' + quoteColor.rgb + ')'
            'Board Title'                 : 'rgb(' + textColor.rgb + ')'
            'Timestamps'                  : 'rgb(' + timeColor.rgb + ')'
            'Inputs'                      : 'rgb(' + textColor.rgb + ')'
            'Warnings'                    : 'rgb(' + sageColor.rgb + ')'
            'Shadow Color'                : 'rgba(0,0,0,0.1)'
            'Custom CSS'                  : """<%= grunt.file.read('css/theme.oneechan.css') %>""" + (imported.customCSS or '') }

        else if origin == "SS"
          Themes[name] = {
            'Author'                      : "Anonymous"
            'Author Tripcode'             : "!.pC/AHOKAg"
            'Background Image'            : 'url("' + (imported.bgImg or '') + '")'
            'Background Attachment'       : bgRPA[3] or ''
            'Background Position'         : ((bgRPA[1] + " ") or '') + (bgRPA[2] or '')
            'Background Repeat'           : bgRPA[0] or ''
            'Background Color'            : 'rgb(' + bgColor.rgb + ')'
            'Dialog Background'           : 'rgba(' + mainColor.rgb + ',.98)'
            'Dialog Border'               : 'rgb(' + brderColor.rgb + ')'
            'Thread Wrapper Background'   : 'rgba(' + mainColor.rgb + ',.5)'
            'Thread Wrapper Border'       : 'rgba(' + brderColor.rgb + ',.9)'
            'Reply Background'            : 'rgba(' + mainColor.rgb + ',.9)'
            'Reply Border'                : 'rgb(' + brderColor.rgb + ')'
            'Highlighted Reply Background': 'rgba(' + mainColor.shiftRGB(4, true) + ',.9)'
            'Highlighted Reply Border'    : 'rgb(' + linkColor.rgb + ')'
            'Backlinked Reply Outline'    : 'rgb(' + linkColor.rgb + ')'
            'Checkbox Background'         : 'rgba(' + inputColor.rgb + ',.9)'
            'Checkbox Border'             : 'rgb(' + inputbColor.rgb + ')'
            'Checkbox Checked Background' : 'rgb(' + inputColor.rgb + ')'
            'Input Background'            : 'rgba(' + inputColor.rgb + ',.9)'
            'Input Border'                : 'rgb(' + inputbColor.rgb + ')'
            'Hovered Input Background'    : 'rgba(' + inputColor.hover + ',.9)'
            'Hovered Input Border'        : 'rgb(' + inputbColor.rgb + ')'
            'Focused Input Background'    : 'rgba(' + inputColor.hover + ',.9)'
            'Focused Input Border'        : 'rgb(' + inputbColor.rgb + ')'
            'Buttons Background'          : 'rgba(' + inputColor.rgb + ',.9)'
            'Buttons Border'              : 'rgb(' + inputbColor.rgb + ')'
            'Navigation Background'       : 'rgba(' + bgColor.rgb + ',0.8)'
            'Navigation Border'           : 'rgb(' + mainColor.rgb + ')'
            'Quotelinks'                  : 'rgb(' + linkColor.rgb + ')'
            'Links'                       : 'rgb(' + linkColor.rgb + ')'
            'Hovered Links'               : 'rgb(' + linkHColor.rgb + ')'
            'Navigation Links'            : 'rgb(' + textColor.rgb + ')'
            'Hovered Navigation Links'    : 'rgb(' + linkHColor.rgb + ')'
            'Subjects'                    : 'rgb(' + titleColor.rgb + ')'
            'Names'                       : 'rgb(' + nameColor.rgb + ')'
            'Sage'                        : 'rgb(' + sageColor.rgb + ')'
            'Tripcodes'                   : 'rgb(' + tripColor.rgb + ')'
            'Emails'                      : 'rgb(' + linkColor.rgb + ')'
            'Post Numbers'                : 'rgb(' + linkColor.rgb + ')'
            'Text'                        : 'rgb(' + textColor.rgb + ')'
            'Backlinks'                   : 'rgb(' + linkColor.rgb + ')'
            'Greentext'                   : 'rgb(' + quoteColor.rgb + ')'
            'Board Title'                 : 'rgb(' + textColor.rgb + ')'
            'Timestamps'                  : 'rgb(' + timeColor.rgb + ')'
            'Inputs'                      : 'rgb(' + textColor.rgb + ')'
            'Warnings'                    : 'rgb(' + sageColor.rgb + ')'
            'Shadow Color'                : 'rgba(0,0,0,0.1)'
            'Custom CSS'                  : """<%= grunt.file.read('css/theme.4chanss.css') %>""" + (imported.customCSS or '') }

      else if origin == 'appchan'
        Themes[name] = imported

      userThemes = $.get "userThemes", {}
      userThemes[name] = Themes[name]
      $.set 'userThemes', userThemes
      alert "Theme \"#{name}\" imported!"
      $.rm $("#themes", d.body)
      Options.themeTab()

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
    userThemes = $.get "userThemes", {}
    userThemes[name] = Themes[name]
    $.set 'userThemes', userThemes
    $.set "theme", Conf['theme'] = name
    alert "Theme \"#{name}\" saved."

  close: ->
    Conf['editMode'] = false
    $.rm $("#themeConf", d.body)
    Style.addStyle()
    Options.dialog("theme")