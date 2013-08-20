Gallery =
  init: ->
    el = $.el 'a',
      href: 'javascript:;'
      id:   'appchan-gal'
      title: 'Gallery'
      className: 'icon'
      textContent: '\uf03e'

    $.on el, 'click', @cb.toggle

    Header.addShortcut el

    Post::callbacks.push
      name: 'Gallery'
      cb: @node
  
  node: ->
    return unless Gallery.el and @file?.isImage

    Gallery.generateThumb $ '.file', @nodes.root

  build: ->
    Gallery.el = dialog = $.el 'div',
      id: 'a-gallery'
      innerHTML: """
<a href=javascript:; class=gal-close></a>
<div class=gal-viewport>
  <div class=gal-prev></div>
  <div class=gal-image>
    <img>
  </div>
  <div class=gal-next></div>
</div>
<div class=gal-thumbnails></div>
"""
    files = $$ '.post .file'
    Gallery.current = $ '.gal-image img', dialog
    Gallery.thumbs  = $ '.gal-thumbnails', dialog
    Gallery.images  = []

    $.on ($ '.gal-prev', dialog), 'click', Gallery.cb.prev
    $.on ($ '.gal-next', dialog), 'click', Gallery.cb.next
    
    i = 0
    while file = files[i++]
      Gallery.generateThumb file
    $.add d.body, dialog

  generateThumb: (file) ->
    image = $ '.fileThumb', file
    name  = ($ '.fileText a', file).textContent
    thumb = image.cloneNode true

    thumb.className = 'a-thumb'
    thumb.name = name
    thumb.dataset.id   = Gallery.images.length

    $.on thumb, 'click', Gallery.cb.open

    Gallery.images.push thumb
    $.add Gallery.thumbs, thumb
  
  cb:
    open: (e) ->
      if e
        e.preventDefault()
      Gallery.current.dataset.id = @dataset.id
      Gallery.current.src = @href
      Gallery.current.name = @name
    prev: ->
      Gallery.cb.open.call Gallery.images[+Gallery.current.dataset.id - 1]
    next: ->
      Gallery.cb.open.call Gallery.images[+Gallery.current.dataset.id + 1]
    toggle: ->
      if Gallery.el
        return Gallery.close()
      Gallery.build()
    close: ->
      $.rm Gallery.el
      delete Gallery.el