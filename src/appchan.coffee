Style =
  init: ->
    @addStyle()
    
    if Conf["Style"]
      $.ready @banner

  emoji: (position) ->
    css = ''
    for item in Emoji
      unless Conf['Emoji'] == "disable ponies" and item[2] == "pony"
        name  = item[0]
        image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA' + item[1]
        css   = css + '
a.useremail[href*="' + name + '"]:last-of-type::' + position + ',
a.useremail[href*="' + name.toLowerCase() + '"]:last-of-type::' + position + ',
a.useremail[href*="' + name.toUpperCase() + '"]:last-of-type::' + position + ' {
  content: url("' + image + '") " ";
}
'
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

  agent: ->
    switch $.engine
      when 'gecko'
        return '-moz-'
      when 'webkit'
        return '-webkit-'
      when 'presto'
        return '-o-'

  addStyle: (theme) ->
    unless styleInit
      $.off d, 'DOMNodeInserted', Style.addStyle
      if d.head
        styleInit = true
        $.addStyle Style.css(userThemes[Conf['theme']]), 'appchan'
      else # XXX fox
        $.on d, 'DOMNodeInserted', Style.addStyle
    else
      if !theme or !theme.Author
        theme = userThemes[Conf['theme']]
      if el = $('#mascot', d.body) then $.rm el
      $.rm $.id 'appchan'
      $.addStyle Style.css(theme), 'appchan'
  
  banner: ->
    banner = $ ".boardBanner", d.body
    title  = $.el "div"
      id:   "boardTitle"
    children = for child in banner.children
      if child.tagName == "IMG"
        continue;
      child
    $.add title, children
    $.after banner, title
  
  padding: ->
    Style.padding.nav   = $ "#boardNavDesktop", d.body
    Style.padding.pages = $(".pages", d.body)
    if Conf["Boards Navigation"] == "sticky top" or Conf["Boards Navigation"] == "sticky bottom"
      Style.padding.nav.property = Conf["Boards Navigation"].split(" ")[1]
      d.body.style["padding#{Style.padding.nav.property.capitalize()}"] = "#{Style.padding.nav.offsetHeight}px"

      $.on (window or unsafeWindow), "resize", ->
        d.body.style["padding#{Style.padding.nav.property.capitalize()}"] = "#{Style.padding.nav.offsetHeight}px"

    if Style.padding.pages and (Conf["Pagination"] == "sticky top" or Conf["Pagination"] == "sticky bottom")
      Style.padding.pages.property = Conf["Pagination"].split(" ")[1]
      d.body.style["padding#{Style.padding.pages.property.capitalize()}"] = "#{Style.padding.pages.offsetHeight}px"

      $.on (window or unsafeWindow), "resize", ->
        d.body.style["padding#{Style.padding.pages.property.capitalize()}"] = "#{Style.padding.pages.offsetHeight}px"


  remStyle: ->
    $.off d, 'DOMNodeInserted', @remStyle
    unless remInit
      if d.head and d.head.children.length > 10
        remInit = true
        nodes = []
        for node in d.head.children
          if node.rel == 'stylesheet'
            nodes.push node
          else if node.tagName == 'STYLE' and node.id != 'appchan'
            nodes.push node
            break
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