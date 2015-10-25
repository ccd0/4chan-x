QR.oekaki =
  draw: ->
    $.globalEval '''
      Tegaki.open({
        onDone: function() {
          Tegaki.flatten().toBlob(function (blob) {
            var detail = {file: blob, name: 'tegaki.png'};
            var event = new CustomEvent('QRSetFile', {bubbles: true, detail: detail});
            document.dispatchEvent(event);
          });
        },
        onCancel: function() {},
        width: +document.querySelector('#qr [name=oekaki-width]').value,
        height: +document.querySelector('#qr [name=oekaki-height]').value
      });
    '''

  edit: ->
    $.global ->
      {Tegaki} = window
      name = document.getElementById('qr-filename').value.replace(/\.\w+$/, '') + '.png'
      error = (content) ->
        document.dispatchEvent new CustomEvent 'CreateNotification',
          bubbles: true
          detail: {type: 'warning', content, lifetime: 20}
      cb = (e) ->
        document.removeEventListener 'QRFile', cb, false
        return error 'No file to edit.' unless e.detail
        return error 'Not an image.'    unless /^image\//.test e.detail.type
        img = new Image()
        img.onerror = -> error 'Could not open image.'
        img.onload = ->
          Tegaki.destroy() if Tegaki.bg
          Tegaki.open
            onDone: ->
              Tegaki.flatten().toBlob (file) ->
                document.dispatchEvent new CustomEvent 'QRSetFile',
                  bubbles: true
                  detail: {file, name}
            onCancel: ->
            width:  img.naturalWidth
            height: img.naturalHeight
          Tegaki.activeCtx.drawImage img, 0, 0
        img.src = URL.createObjectURL e.detail
      document.addEventListener 'QRFile', cb, false
      document.dispatchEvent new CustomEvent 'QRGetFile', {bubbles: true}
