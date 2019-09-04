PassMessage =
  init: ->
    msg = $.el 'div',
      className: 'box-outer top-box'
    ,
      `<%= readHTML('PassMessage.html') %>`
    $.ready ->
      if (hd = $.id 'hd')
        $.after hd, msg
      else
        $.prepend d.body, msg
