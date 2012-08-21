Style =
  init: ->
    Style.setup()
    switch Conf['Emoji Position']
      when '0'
        Style.css = Style.css + Style.emoji('before', 'left')
      when '1'
        Style.css = Style.css + Style.emoji('after', 'right')

    if Conf['Compact Post Form Inputs']
      console.log Conf['Expand Post Form Textarea']

    if Conf['Expand Post Form Textarea']
      console.log Conf['Expand Post Form Textarea']

    if Conf['Filtered Backlinks']
      console.log Conf['Filtered Backlinks']

    if Conf['Fit Width Replies']
      console.log Conf['Fit Width Replies']

    if Conf['Rounded Edges']
      console.log Conf['Rounded Edges']

    if Conf['Slideout Watcher']
      console.log Conf['Slideout Watcher']

    if Conf['Underline Links']
      console.log Conf['Underline Links']

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
  
  inputs: ->
    div = $.el div,
      className: 'fakecheckbox'

  addStyle: ->
    $.off d, 'DOMNodeInserted', Style.addStyle
    if d.head
      $.addStyle Style.css
    else # XXX fox
      $.on d, 'DOMNodeInserted', Style.addStyle
      
  setup: ->
    themeName = Conf['theme']
    currentTheme = Themes[themeName]
    console.log currentTheme
    