PassMessage =
  init: ->
    return if Conf['passMessageClosed']
    msg = $.el 'div',
      className: 'box-outer top-box'
    ,
      `<%= readHTML('PassMessage.html') %>`
    close = $ 'a', msg
    $.on close, 'click', ->
      $.rm msg
      $.set 'passMessageClosed', true
    $.ready ->
      if (hd = $.id 'hd')
        $.after hd, msg
      else
        $.prepend d.body, msg
