class Notice
  constructor: (type, content, @timeout, @onclose) ->
    @el = $.el 'div',
      `<%= html('<a href="javascript:;" class="close fourchan-x--icon icon--small" title="Close" data-icon="close">&{Icons.close}</a><div class="message"></div>') %>`
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
    return if @closed
    if d.hidden
      $.on d, 'visibilitychange', @add
      return
    $.off d, 'visibilitychange', @add
    $.add Header.noticesRoot, @el
    @el.clientHeight # force reflow
    @el.style.opacity = 1
    setTimeout @close, @timeout * $.SECOND if @timeout

  close: =>
    @closed = true
    $.off d, 'visibilitychange', @add
    $.rm @el
    @onclose?()
