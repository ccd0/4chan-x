QR.oekaki =
  menu:
    init: ->
      return unless g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Edit Link'] and Conf['Quick Reply']

      a = $.el 'a',
        className: 'edit-link'
        href: 'javascript:;'
        textContent: 'Edit image'
      $.on a, 'click', @editFile

      Menu.menu.addEntry
        el: a
        order: 90
        open: (post) ->
          QR.oekaki.menu.post = post
          {file} = post
          QR.postingIsEnabled and !!file and (file.isImage or file.isVideo)

    editFile: ->
      {post} = QR.oekaki.menu
      QR.quote.call post.nodes.post
      {isVideo} = post.file
      currentTime = post.file.fullImage?.currentTime or 0
      CrossOrigin.file post.file.url, (blob) ->
        if !blob
          QR.error "Can't load file."
        else if isVideo
          video = $.el 'video'
          $.on video, 'loadedmetadata', ->
            $.on video, 'seeked', ->
              canvas = $.el 'canvas',
                width: video.videoWidth
                height: video.videoHeight
              canvas.getContext('2d').drawImage(video, 0, 0)
              canvas.toBlob (snapshot) ->
                snapshot.name = post.file.name.replace(/\.\w+$/, '') + '.png'
                QR.handleFiles [snapshot]
                QR.oekaki.edit()
            video.currentTime = currentTime
          $.on video, 'error', -> QR.openError()
          video.src = URL.createObjectURL blob
        else
          blob.name = post.file.name
          QR.handleFiles [blob]
          QR.oekaki.edit()

  setup: ->
    $.global ->
      {FCX} = window
      FCX.oekakiCB = ->
        window.Tegaki.flatten().toBlob (file) ->
          source = "oekaki-#{Date.now()}"
          FCX.oekakiLatest = source
          document.dispatchEvent new CustomEvent 'QRSetFile', {
            bubbles: true
            detail: {file, name: FCX.oekakiName, source}
          }
      if window.Tegaki
        document.querySelector('#qr .oekaki').hidden = false

  load: (cb) ->
    if $ 'script[src^="//s.4cdn.org/js/tegaki"]', d.head
      cb()
    else
      style = $.el 'link',
        rel: 'stylesheet'
        href: "//s.4cdn.org/css/tegaki.#{Date.now()}.css"
      script = $.el 'script',
        src: "//s.4cdn.org/js/tegaki.min.#{Date.now()}.js"
      n = 0
      onload = ->
        cb() if ++n is 2
      $.on style,  'load', onload
      $.on script, 'load', onload
      $.add d.head, [style, script]

  draw: ->
    $.global ->
      {Tegaki, FCX} = window
      Tegaki.destroy() if Tegaki.bg
      FCX.oekakiName = 'tegaki.png'
      Tegaki.open
        onDone: FCX.oekakiCB
        onCancel: -> Tegaki.bgColor = '#ffffff'
        width:  +document.querySelector('#qr [name=oekaki-width]').value
        height: +document.querySelector('#qr [name=oekaki-height]').value
        bgColor:
          if document.querySelector('#qr [name=oekaki-bg]').checked
            document.querySelector('#qr [name=oekaki-bgcolor]').value
          else
            'transparent'

  button: ->
    if QR.selected.file
      QR.oekaki.edit()
    else
      QR.oekaki.toggle()

  edit: ->
    QR.oekaki.load -> $.global ->
      {Tegaki, FCX} = window
      name     = document.getElementById('qr-filename').value.replace(/\.\w+$/, '') + '.png'
      {source} = document.getElementById('file-n-submit').dataset
      error = (content) ->
        document.dispatchEvent new CustomEvent 'CreateNotification', {
          bubbles: true
          detail: {type: 'warning', content, lifetime: 20}
        }
      cb = (e) ->
        @removeEventListener('QRMetadata', cb, false) if e
        selected = document.getElementById 'selected'
        return error 'No file to edit.'        unless selected?.dataset.type
        return error 'Not an image.'           unless /^(image|video)\//.test selected.dataset.type
        return error 'Metadata not available.' unless selected.dataset.height
        if selected.dataset.height is 'loading'
          selected.addEventListener('QRMetadata', cb, false)
          return
        Tegaki.destroy() if Tegaki.bg
        FCX.oekakiName = name
        Tegaki.open
          onDone: FCX.oekakiCB
          onCancel: -> Tegaki.bgColor = '#ffffff'
          width:  +selected.dataset.width
          height: +selected.dataset.height
          bgColor: 'transparent'
        canvas = document.createElement 'canvas'
        canvas.width  = canvas.naturalWidth  = +selected.dataset.width
        canvas.height = canvas.naturalHeight = +selected.dataset.height
        canvas.hidden = true
        document.body.appendChild canvas
        canvas.addEventListener 'QRImageDrawn', ->
          @remove()
          Tegaki.onOpenImageLoaded.call @
        , false
        canvas.dispatchEvent new CustomEvent 'QRDrawFile', {bubbles: true}
      if Tegaki.bg and Tegaki.onDoneCb is FCX.oekakiCB and source is FCX.oekakiLatest
        FCX.oekakiName = name
        Tegaki.resume()
      else
        cb()

  toggle: ->
    QR.oekaki.load ->
      QR.nodes.oekaki.hidden = !QR.nodes.oekaki.hidden
