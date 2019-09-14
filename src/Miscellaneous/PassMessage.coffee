PassMessage =
  init: ->
    return if Conf['passMessageClosed']
    msg = $.el 'div',
      className: 'box-outer top-box'
    ,
      `<%= readHTML('PassMessage.html') %>`
    msg.style.cssText = 'padding-bottom: 0;'
    close = $ 'a', msg
    $.on close, 'click', ->
      $.rm msg
      $.set 'passMessageClosed', true
    $.ready ->
      if (hd = $.id 'hd')
        $.after hd, msg
      else
        $.prepend d.body, msg
