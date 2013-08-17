class Notice
  constructor: (type, content, @timeout) ->
    @el = $.el 'div',
      innerHTML: '<a href=javascript:; class=close title=Close>×</a><div class=message></div>'
    @el.style.opacity = 0
    @setType type
    $.on @el.firstElementChild, 'click', @close
    if typeof content is 'string'
      content = $.tn content
    $.add @el.lastElementChild, content

    $.ready @add

  setType: (type) ->
    @el.className = "notification #{type}"

  add: =>
    if d.hidden
      $.on d, 'visibilitychange', @add
      return
    $.off d, 'visibilitychange', @add
    $.add $.id('notifications'), @el
    @el.clientHeight # force reflow
    @el.style.opacity = 1
    setTimeout @close, @timeout * $.SECOND if @timeout

  close: =>
    $.off d, 'visibilitychange', @add
    $.rm @el
