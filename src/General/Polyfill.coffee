Polyfill =
  init: ->
    @toBlob()
  toBlob: ->
    return if HTMLCanvasElement::toBlob
    HTMLCanvasElement::toBlob = (cb, type='image/png', encoderOptions) ->
      url = @toDataURL type, encoderOptions
      data = atob url[url.indexOf(',')+1..]
      # DataUrl to Binary code from Aeosynth's 4chan X repo
      l = data.length
      ui8a = new Uint8Array l
      for i in [0...l] by 1
        ui8a[i] = data.charCodeAt i
      cb new Blob [ui8a], {type}
    $.globalEval "HTMLCanvasElement.prototype.toBlob = (#{HTMLCanvasElement::toBlob});"
