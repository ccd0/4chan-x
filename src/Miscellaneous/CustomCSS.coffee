CustomCSS =
  init: ->
    return if !Conf['Custom CSS']
    @addStyle()
  addStyle: ->
    @style = $.addStyle Conf['usercss']
  rmStyle: ->
    if @style
      $.rm @style
      delete @style
  update: ->
    unless @style
      @addStyle()
    @style.textContent = Conf['usercss']
