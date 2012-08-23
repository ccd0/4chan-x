Style =
  init: ->
    Style.addStyle()

  emoji: (position, direction) ->
    css = ''
    for item in Emoji
      name  = item[0]
      image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA' + item[1]
      css   = css + '
a.useremail[href*="' + name + '"]:last-of-type::' + position + ',
a.useremail[href*="' + name.toLowerCase() + '"]:last-of-type::' + position + ',
a.useremail[href*="' + name.toUpperCase() + '"]:last-of-type::' + position + ' {
  content: url("' + image + '") " ";
  margin-' + direction + ': 4px !important;
}
'
    return css
  
  agent: ->
    switch $.engine
      when 'gecko'
        return '-moz-'
      when 'webkit'
        return '-webkit-'
      when 'presto'
        return '-o-'
  
  inputs: ->
    div = $.el div,
      className: 'fakecheckbox'

  addStyle: ->
    $.off d, 'DOMNodeInserted', Style.addStyle
    theme = Themes[Conf['theme']]
    if d.head
      $.addStyle Style.css(theme)
    else # XXX fox
      $.on d, 'DOMNodeInserted', Style.addStyle
    