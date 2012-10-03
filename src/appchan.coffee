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

  remStyle: ->
    $.off d, 'DOMNodeInserted', @remStyle
    unless remInit
      if d.head and d.head.childNodes.length > 10
        remInit = true
        nodes = []
        for node in d.head.childNodes
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
    else # XXX fox
      $.on d, 'DOMNodeInserted', @remStyle