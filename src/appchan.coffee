Style =
  init: ->
    Conf['styleenabled'] = '1'
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
    checkbox = $('[type=checkbox]', post.root)
    div = $.el 'div',
      className: 'rice'
    $.on div, 'click', ->
      checkbox.click()
    $.after checkbox, div

  agent: ->
    switch $.engine
      when 'gecko'
        return '-moz-'
      when 'webkit'
        return '-webkit-'
      when 'presto'
        return '-o-'

  button: (dialog, tab) ->
    if Conf['styleenabled'] == '1'
      save = $.el 'div',
        innerHTML: '<a href="javascript:void(0)">Save Style Settings</a>'
      $.on $('a', save), 'click', ->
        Style.addStyle(Conf['theme'])
      $.add $('#' + tab + ' + div', dialog), save

  addStyle: ->
    $.off d, 'DOMNodeInserted', Style.addStyle
    theme = Themes[Conf['theme']]
    if d.head
      if existingStyle = $.id 'appchan'
        $.rm existingStyle
      $.addStyle Style.css(theme), 'appchan'
    else # XXX fox
      $.on d, 'DOMNodeInserted', Style.addStyle
