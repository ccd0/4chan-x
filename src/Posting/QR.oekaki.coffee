QR.oekaki =
  init: ->
    return unless Conf['Quick Reply'] and Conf['Oekaki Links']
    Post.callbacks.push
      name: 'Oekaki Links'
      cb:   @node

  node: ->
    return unless @file?.isImage
    if @isClone
      link = $ '.file-edit', @file.text
    else
      link = $.el 'a',
        className: 'file-edit'
        href: 'javascript:;'
        title: 'Edit image'
      $.extend link, <%= html('<i class="fa fa-edit"></i>') %>
      $.add @file.text, [$.tn('\u00A0'), link]
    $.on link, 'click', QR.oekaki.editFile

  editFile: ->
    post = Get.postFromNode @
    CrossOrigin.file post.file.url, (blob) ->
      QR.openPost()
      {com, thread} = QR.nodes
      thread.value = (post.context or post).thread.ID unless com.value
      QR.selected.save thread
      if blob
        blob.name = post.file.name
        QR.handleFiles [blob]
        QR.oekaki.edit()
      else
        QR.error "Can't load image."

  setup: ->
    $.global ->
      {FCX} = window
      FCX.oekakiCB = ->
        window.Tegaki.flatten().toBlob (file) ->
          document.dispatchEvent new CustomEvent 'QRSetFile',
            bubbles: true
            detail: {file, name: FCX.oekakiName}

  load: (cb) ->
    if $ 'script[src^="//s.4cdn.org/js/painter"]', d.head
      cb()
    else
      style = $.el 'link',
        rel: 'stylesheet'
        href: "//s.4cdn.org/css/painter.#{Date.now()}.css"
      script = $.el 'script',
        src: "//s.4cdn.org/js/painter.min.#{Date.now()}.js"
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
        onCancel: ->
        width:  +document.querySelector('#qr [name=oekaki-width]').value
        height: +document.querySelector('#qr [name=oekaki-height]').value

  edit: ->
    QR.oekaki.load -> $.global ->
      {Tegaki, FCX} = window
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
          FCX.oekakiName = name
          Tegaki.open
            onDone: FCX.oekakiCB
            onCancel: ->
            width:  img.naturalWidth
            height: img.naturalHeight
            bgColor: 'transparent'
          Tegaki.activeCtx.drawImage img, 0, 0
        img.src = URL.createObjectURL e.detail
      document.addEventListener 'QRFile', cb, false
      document.dispatchEvent new CustomEvent 'QRGetFile', {bubbles: true}
