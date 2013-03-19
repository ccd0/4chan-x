Polyfill =
  init: ->
    Polyfill.visibility()
  visibility: ->
    # page visibility API
    return if 'visibilityState' of document
    return unless prefix = (
      if 'webkitVisibilityState' of document
        'webkit'
      else if 'mozVisibilityState' of document
        'moz'
    )

    property = prefix + 'VisibilityState'
    event    = prefix + 'visibilitychange'

    d.visibilityState = d[property]
    d.hidden = d.visibilityState is 'hidden'
    $.on d, event, ->
      d.visibilityState = d[property]
      d.hidden = d.visibilityState is 'hidden'
      $.event 'visibilitychange'
