GlobalMessage =
  init: ->
    $.asap (-> d.body), ->
      $.asap (-> $.id 'delform'), GlobalMessage.ready

  ready: ->
    if el = $ "#globalMessage", d.body
      for child in el.children
        child.cssText = ""
    return