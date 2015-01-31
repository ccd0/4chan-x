CustomCSS =
  init: ->
    return unless Conf['Custom CSS']
    @addStyle()

  addStyle: ->
    @style = $.addStyle Conf['usercss'], 'custom-css', -> $.id 'fourchanx-css'

  rmStyle: ->
    if @style
      $.rm @style
      delete @style

  update: ->
    unless @style
      return @addStyle()
    @style.textContent = Conf['usercss']
