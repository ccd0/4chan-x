CustomCSS =
  init: ->
    return unless Conf['Custom CSS']
    @addStyle()
  addStyle: ->
    $.asap (-> $.id 'fourchanx-css'), =>
      @style = $.addStyle Conf['usercss'], 'custom-css'
  rmStyle: ->
    if @style
      $.rm @style
      delete @style
  update: ->
    unless @style
      @addStyle()
    @style.textContent = Conf['usercss']
