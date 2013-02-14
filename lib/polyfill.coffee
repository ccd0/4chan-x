Polyfill =
  init: ->
    Polyfill.visibility()
  visibility: ->
    # page visibility API
    return if 'visibilityState' of document
    if 'webkitVisibilityState' of document
      prefix = 'webkit'
    else if 'mozVisibilityState' of document
      prefix = 'moz'
    else
      return

    property = prefix + 'VisibilityState'
    event    = prefix + 'visibilitychange'

    d.visibilityState = d[property]
    d.hidden = d.visibilityState is 'hidden'
    $.on d, event, ->
      d.visibilityState = d[property]
      d.hidden = d.visibilityState is 'hidden'
      $.event 'visibilitychange'
