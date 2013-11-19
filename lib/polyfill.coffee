Polyfill =
  init: ->
    <% if (type === 'crx') { %>
    @notificationPermission()
    @toBlob()
    @visibility()
    <% } %>
  notificationPermission: ->
    return if !window.Notification or 'permission' of Notification or !window.webkitNotifications
    Object.defineProperty Notification, 'permission',
      get: ->
        switch webkitNotifications.checkPermission()
          when 0
            'granted'
          when 1
            'default'
          when 2
            'denied'
  toBlob: ->
    HTMLCanvasElement::toBlob or= (cb) ->
      data = atob @toDataURL()[22..]
      # DataUrl to Binary code from Aeosynth's 4chan X repo
      l = data.length
      ui8a = new Uint8Array l
      for i in [0...l] by 1
        ui8a[i] = data.charCodeAt i
      cb new Blob [ui8a], type: 'image/png'
  visibility: ->
    # page visibility API
    return if 'visibilityState' of d
    Object.defineProperties HTMLDocument.prototype,
      visibilityState:
        get: -> @webkitVisibilityState
      hidden:
        get: -> @webkitHidden
    $.on d, 'webkitvisibilitychange', -> $.event 'visibilitychange'
