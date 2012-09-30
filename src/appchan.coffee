Style =
  init: ->
    @addStyle()

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
    $.off d, 'DOMNodeInserted', Style.addStyle
    if d.head
      if !theme or !theme.Author
        theme = userThemes[Conf['theme']]
      if existingStyle = $.id 'appchan'
        $.rm existingStyle
      $.addStyle Style.css(theme), 'appchan'
    else # XXX fox
      $.on d, 'DOMNodeInserted', Style.addStyle

  remStyle: ->
    $.off d, 'DOMNodeInserted', @remStyle
    if d.head and d.head.childNodes.length > 10
      nodes = for node in d.head.childNodes
        if node.nodeType == 1 and (node.rel == 'stylesheet' or node.rel == 'alternate stylesheet' or node.tagName.toLowerCase() == 'style') and node.id != 'appchan'
          node
        else
          continue
      for node in nodes
        $.rm node
    else # XXX fox
      $.on d, 'DOMNodeInserted', @remStyle