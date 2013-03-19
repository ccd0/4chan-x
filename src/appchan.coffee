Style =
  init: ->
    @agent = {
      'gecko': '-moz-'
      'webkit': '-webkit-'
      'presto': '-o-'
    }[$.engine]

    @sizing = "#{if $.engine is 'gecko' then @agent else ''}box-sizing"

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
        subtree: true
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
    Style.themeCSS.textContent = Style.theme(theme)
    Style.iconPositions()

  headCount: 12

  addStyleReady: ->
    theme = Themes[Conf['theme']]
    $.extend Style,
      layoutCSS: $.addStyle Style.layout(), 'layout'
      themeCSS: $.addStyle Style.theme(theme), 'theme'
      icons: $.addStyle "", 'icons'
      paddingSheet: $.addStyle "", 'padding'
      mascot: $.addStyle "", 'mascotSheet'

    # Non-customizable
    $.addStyle Style.jsColorCSS(), 'jsColor'

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

Banner =
  init: ->
    $.asap (-> doc), ->
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
    $.asap (-> doc), ->
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
    Rice.checkbox $ '.postInfo input', @

  checkbox: (input) ->
    return if $.hasClass input, 'riced'
    $.addClass input, 'riced'
    div = $.el 'div',
      className: 'rice'
    div.check = input
    $.after input, div
    if div.parentElement.tagName.toLowerCase() != 'label'
      $.on div, 'click', Rice.click

  select: (input) ->
    $.addClass input, 'riced'
    div = $.el 'div',
      className: 'selectrice'
      innerHTML: "<div>#{input.options[input.selectedIndex].textContent or null}</div>"
    $.on div, "click", (e), 
      
    $.after input, div
