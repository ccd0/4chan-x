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

    Header.addShortcut el, true

    Post::callbacks.push
      name: 'Gallery'
      cb: @node

  node: ->
    return unless @file?.isImage
    if Gallery.el
      Gallery.generateThumb $ '.file', @nodes.root
      Gallery.total.textContent = Gallery.images.length

    unless Conf['Image Expansion']
      $.on @file.thumb.parentNode, 'click', Gallery.cb.image

  build: (image) ->
    Gallery.el = dialog = $.el 'div',
      id: 'a-gallery'
      innerHTML: """
<div class=gal-viewport>
  <div class=gal-info>
    <a href=javascript:; class=gal-close>✖</a>
    <a class=gal-name></a>
    <span class=gal-count>(<span class='count'></span> / <span class='total'></span>)</a>
  </div>
  <div class=gal-prev></div>
  <div class=gal-image>
    <a href=javascript:;><img></a>
  </div>
  <div class=gal-next></div>
</div>
<div class=gal-thumbnails></div>
"""
    Gallery[key] = $ value, dialog for key, value of {
      frame:   '.gal-image'
      name:    '.gal-name'
      count:   '.count'
      total:   '.total'
      thumbs:  '.gal-thumbnails'
      next:    '.gal-image a'
      current: '.gal-image img'
    }

    Gallery.images  = []

    $.on Gallery.frame,            'click', Gallery.cb.blank
    $.on Gallery.current,          'click', Gallery.cb.download
    $.on Gallery.next,             'click', Gallery.cb.next
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

    Gallery.cb.open.call if image
      $ "[href='#{image.href.replace /https?:/, ''}']", Gallery.thumbs
    else
      Gallery.images[0]

    d.body.style.overflow = 'hidden'
    Gallery.total.textContent = --i

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

      cb = switch key
        when 'Esc', Conf['Open Gallery']
          Gallery.cb.close
        when 'Right', 'Enter'
          Gallery.cb.next
        when 'Left', ''
          Gallery.cb.prev

      return unless cb
      e.stopPropagation()
      e.preventDefault()
      cb()
        
    open: (e) ->
      e.preventDefault() if e

      $.rmClass  el, 'gal-highlight' if el = $ '.gal-highlight', Gallery.thumbs
      $.addClass @,  'gal-highlight'

      img = $.el 'img',
        src:   Gallery.name.href     = @href
        title: Gallery.name.download = Gallery.name.textContent = @title

      img.dataset.id = @dataset.id
      $.replace Gallery.current, img
      Gallery.count.textContent = +@dataset.id + 1
      Gallery.current = img
      Gallery.frame.scrollTop = 0
      Gallery.current.focus()

    image: (e) ->
      e.preventDefault()
      e.stopPropagation()
      Gallery.build @

    prev:   -> Gallery.cb.open.call Gallery.images[+Gallery.current.dataset.id - 1]
    next:   -> Gallery.cb.open.call Gallery.images[+Gallery.current.dataset.id + 1]
    toggle: -> (if Gallery.el then Gallery.cb.close else Gallery.build)()
    blank: (e) -> Gallery.cb.close() if e.target is @

    close: ->
      $.rm Gallery.el
      delete Gallery.el
      d.body.style.overflow = ''

      $.off d, 'keydown', Gallery.cb.keybinds
      $.on  d, 'keydown', Keybinds.keydown