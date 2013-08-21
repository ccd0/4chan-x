Gallery =
  init: ->
    return if g.VIEW is 'catalog' or g.BOARD is 'f' or !Conf['Gallery']
    
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
<a href=javascript:; class=gal-close>✖</a>
<div class=gal-viewport>
  <div class=gal-prev></div>
  <div class=gal-image>
    <a><img></a>
  </div>
  <div class=gal-next></div>
</div>
<div class=gal-thumbnails></div>
"""
    Gallery.current = $ '.gal-image img',  dialog
    Gallery.url     = $ '.gal-image a',    dialog
    Gallery.thumbs  = $ '.gal-thumbnails', dialog
    Gallery.images  = []

    $.on Gallery.current, 'click', Gallery.cb.download

    $.on ($ '.gal-prev',  dialog), 'click', Gallery.cb.prev
    $.on ($ '.gal-next',  dialog), 'click', Gallery.cb.next
    $.on ($ '.gal-close', dialog), 'click', Gallery.cb.close

    $.on  d, 'keydown', Gallery.cb.keybinds
    $.off d, 'keydown', Keybinds.keydown

    i = 0
    files = $$ '.post .file'
    while file = files[i++]
      Gallery.generateThumb file
    $.add d.body, dialog

    Gallery.thumbs.scrollTop = 0
    Gallery.current.parentElement.scrollTop = 0

    Gallery.cb.open.call if @ isnt Gallery
      $ "[href=#{@href}]", Gallery.thumbs
    else
      Gallery.images[0]

    d.body.style.overflow = 'hidden'

  generateThumb: (file) ->
    title = ($ '.fileText a', file).textContent
    thumb = ($ '.fileThumb', file).cloneNode true
    if double = $ 'img + img', thumb
      $.rm double

    thumb.className = 'a-thumb'
    thumb.title = title
    thumb.dataset.id = Gallery.images.length
    thumb.firstElementChild.style.cssText = ''

    $.on thumb, 'click', Gallery.cb.open

    Gallery.images.push thumb
    $.add Gallery.thumbs, thumb

  cb:
    keybinds: (e) ->
      return unless key = Keybinds.keyCode e
      e.stopPropagation()
      switch key
        when 'Esc'
          e.stopPropagation()
          Gallery.cb.close()
        when 'Right', 'Enter'
          Gallery.cb.next()
        when 'Left', ''
          Gallery.cb.prev()
        when Conf['Open Gallery']
          Gallery.cb.close()
    open: (e) ->
      if e
        e.preventDefault()

      img = $.el 'img',
        src:   Gallery.url.href     = @href
        title: Gallery.url.download = @title

      img.dataset.id = @dataset.id
      $.replace Gallery.current, img
      Gallery.current = img
      Gallery.url.parentElement.scrollTop = 0
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
      d.body.style.overflow = ''

      $.off d, 'keydown', Gallery.cb.keybinds
      $.on  d, 'keydown', Keybinds.keydown