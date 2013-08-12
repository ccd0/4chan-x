Polyfill =
  init: ->
    Polyfill.visibility()
  visibility: ->
    # page visibility API
    return unless 'webkitHidden' of document
    Object.defineProperties HTMLDocument.prototype,
      visibilityState:
        get: -> @webkitVisibilityState
      hidden:
        get: -> @webkitHidden
    $.on d, 'webkitvisibilitychange', -> $.event 'visibilitychange'
