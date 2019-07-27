CustomCSS =
  init: ->
    return unless Conf['Custom CSS']
    @addStyle()

  addStyle: ->
    @style = $.addStyle CSS.sub(Conf['usercss']), 'custom-css', '#fourchanx-css'

  rmStyle: ->
    if @style
      $.rm @style
      delete @style

  update: ->
    unless @style
      return @addStyle()
    @style.textContent = CSS.sub Conf['usercss']
