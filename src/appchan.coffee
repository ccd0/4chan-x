Style =
  init: ->
    if Conf['Checkboxes'] == 'show' or Conf['Checkboxes'] == 'make checkboxes circular'
      Main.callbacks.push @noderice
    @addStyle()

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
  
  noderice: (post) ->
    div = $.el 'div',
      className: 'rice'
    $.after $('[type=checkbox]', post.root), div
      
  
  agent: ->
    switch $.engine
      when 'gecko'
        return '-moz-'
      when 'webkit'
        return '-webkit-'
      when 'presto'
        return '-o-'

  addStyle: ->
    $.off d, 'DOMNodeInserted', Style.addStyle
    theme = Themes[Conf['theme']]
    if d.head
      $.addStyle Style.css(theme)
    else # XXX fox
      $.on d, 'DOMNodeInserted', Style.addStyle
    