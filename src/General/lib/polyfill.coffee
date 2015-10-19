Polyfill =
  init: ->
    @toBlob()
  toBlob: ->
    return if HTMLCanvasElement::toBlob
    HTMLCanvasElement::toBlob = (cb) ->
      data = atob @toDataURL()[22..]
      # DataUrl to Binary code from Aeosynth's 4chan X repo
      l = data.length
      ui8a = new Uint8Array l
      for i in [0...l] by 1
        ui8a[i] = data.charCodeAt i
      cb new Blob [ui8a], type: 'image/png'
    $.globalEval "HTMLCanvasElement.prototype.toBlob = (#{HTMLCanvasElement::toBlob});"
