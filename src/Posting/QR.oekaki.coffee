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
    if $ 'link[href^="//s.4cdn.org/css/painter"]', d.head
      QR.oekaki.load ->
        $('#qr .oekaki').hidden = false

  load: (cb) ->
    n = 0
    onload = ->
      cb() if ++n is 2
    onerror = ->
      $.rm @
      script = $.el 'script',
        src: 'https://rawgit.com/desuwa/tegaki/master/tegaki.js'
      $.on script, 'load', onload
      $.add d.head, script
    script = $ 'script[src^="//s.4cdn.org/js/painter"], script[src="https://rawgit.com/desuwa/tegaki/master/tegaki.js"]', d.head
    if script
      if !script.dataset.success
        $.global ->
          document.querySelector('script[src^="//s.4cdn.org/js/painter"], script[src="https://rawgit.com/desuwa/tegaki/master/tegaki.js"]').dataset.success = !!window.Tegaki
      if script.dataset.success is 'true'
        cb()
      else
        n = 1
        onerror.call script
    else
      style = $.el 'link',
        rel: 'stylesheet'
        href: "//s.4cdn.org/css/painter.#{Date.now()}.css"
      script = $.el 'script',
        src: "//s.4cdn.org/js/painter.min.#{Date.now()}.js"
      $.on style,  'load', onload
      $.on script, 'load', onload
      $.on script, 'error', onerror
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
        document.removeEventListener 'QRFile', cb, false
        return error 'No file to edit.' unless e.detail
        return error 'Not an image.'    unless /^(image|video)\//.test e.detail.type
        isVideo = /^video\//.test e.detail.type
        file = document.createElement(if isVideo then 'video' else 'img')
        file.addEventListener 'error', -> error 'Could not open file.', false
        file.addEventListener (if isVideo then 'loadeddata' else 'load'), ->
          Tegaki.destroy() if Tegaki.bg
          FCX.oekakiName = name
          Tegaki.open
            onDone: FCX.oekakiCB
            onCancel: -> Tegaki.bgColor = '#ffffff'
            width:  file.naturalWidth  or file.videoWidth
            height: file.naturalHeight or file.videoHeight
            bgColor: 'transparent'
          Tegaki.activeCtx.drawImage file, 0, 0
        , false
        file.src = URL.createObjectURL e.detail
      if Tegaki.bg and Tegaki.onDoneCb is FCX.oekakiCB and source is FCX.oekakiLatest
        FCX.oekakiName = name
        Tegaki.resume()
      else
        document.addEventListener 'QRFile', cb, false
        document.dispatchEvent new CustomEvent 'QRGetFile', {bubbles: true}

  toggle: ->
    QR.oekaki.load ->
      QR.nodes.oekaki.hidden = !QR.nodes.oekaki.hidden
