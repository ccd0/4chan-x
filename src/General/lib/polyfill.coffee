Polyfill =
  init: ->
    <% if (type === 'crx') { %>
    Polyfill.toBlob()
    Polyfill.visibility()
    <% } %>
  toBlob: ->
    HTMLCanvasElement::toBlob or= (cb) ->
      data = atob @toDataURL()[22..]
      # DataUrl to Binary code from Aeosynth's 4chan X repo
      l = data.length
      ui8a = new Uint8Array l
      for i in  [0...l]
        ui8a[i] = data.charCodeAt i
      cb new Blob [ui8a], type: 'image/png'
  visibility: ->
    # page visibility API
    return unless 'webkitHidden' of document
    Object.defineProperties HTMLDocument.prototype,
      visibilityState:
        get: -> @webkitVisibilityState
      hidden:
        get: -> @webkitHidden
    $.on d, 'webkitvisibilitychange', -> $.event 'visibilitychange'
