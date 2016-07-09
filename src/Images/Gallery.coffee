Gallery =
  init: ->
    return unless @enabled = Conf['Gallery'] and g.VIEW in ['index', 'thread'] and g.BOARD.ID isnt 'f'

    @delay = Conf['Slide Delay']

    el = $.el 'a',
      href: 'javascript:;'
      title: 'Gallery'
      className: 'fa fa-picture-o'
      textContent: 'Gallery'

    $.on el, 'click', @cb.toggle

    Header.addShortcut 'gallery', el, 530

    Callbacks.Post.push
      name: 'Gallery'
      cb:   @node

  node: ->
    return unless @file?.thumb
    if Gallery.nodes
      Gallery.generateThumb @
      Gallery.nodes.total.textContent = Gallery.images.length

    unless Conf['Image Expansion']
      $.on @file.thumb.parentNode, 'click', Gallery.cb.image

  build: (image) ->
    {cb} = Gallery

    if Conf['Fullscreen Gallery']
      $.one d, 'fullscreenchange mozfullscreenchange webkitfullscreenchange', ->
        $.on d, 'fullscreenchange mozfullscreenchange webkitfullscreenchange', cb.close
      doc.mozRequestFullScreen?()
      doc.webkitRequestFullScreen?(Element.ALLOW_KEYBOARD_INPUT)

    Gallery.images  = []
    nodes = Gallery.nodes = {}
    Gallery.fullIDs = {}
    Gallery.slideshow = false

    nodes.el = dialog = $.el 'div',
      id: 'a-gallery'
    $.extend dialog, <%= readHTML('Gallery.html') %>

    nodes[key] = $ value, dialog for key, value of {
      buttons: '.gal-buttons'
      frame:   '.gal-image'
      name:    '.gal-name'
      count:   '.count'
      total:   '.total'
      thumbs:  '.gal-thumbnails'
      next:    '.gal-image a'
      current: '.gal-image img'
    }

    menuButton = $ '.menu-button', dialog
    nodes.menu = new UI.Menu 'gallery'

    $.on nodes.frame, 'click', cb.blank
    $.on nodes.frame, 'wheel', Volume.wheel if Conf['Mouse Wheel Volume']
    $.on nodes.next,  'click', cb.click
    $.on nodes.name,  'click', ImageCommon.download

    $.on $('.gal-prev',  dialog), 'click', cb.prev
    $.on $('.gal-next',  dialog), 'click', cb.next
    $.on $('.gal-start', dialog), 'click', cb.start
    $.on $('.gal-stop',  dialog), 'click', cb.stop
    $.on $('.gal-close', dialog), 'click', cb.close

    $.on menuButton, 'click', (e) ->
      nodes.menu.toggle e, @, g

    for entry in Gallery.menu.createSubEntries()
      entry.order = 0
      nodes.menu.addEntry entry

    $.on  d, 'keydown', cb.keybinds
    $.off d, 'keydown', Keybinds.keydown if Conf['Keybinds']

    $.on window, 'resize', Gallery.cb.setHeight

    for file in $$ '.post .file'
      post = Get.postFromNode file
      continue unless post.file?.thumb
      Gallery.generateThumb post
      # If no image to open is given, pick image we have scrolled to.
      if !image and Gallery.fullIDs[post.fullID]
        candidate = post.file.thumb.parentNode
        if Header.getTopOf(candidate) + candidate.getBoundingClientRect().height >= 0
          image = candidate
    $.addClass doc, 'gallery-open'

    $.add d.body, dialog

    nodes.thumbs.scrollTop = 0
    nodes.current.parentElement.scrollTop = 0

    thumb = $ "[href='#{image.href}']", nodes.thumbs if image
    thumb or= Gallery.images[Gallery.images.length-1]
    Gallery.open thumb if thumb

    doc.style.overflow = 'hidden'
    nodes.total.textContent = Gallery.images.length

  generateThumb: (post) ->
    return if post.isClone or post.isHidden
    return unless post.file and post.file.thumb and (post.file.isImage or post.file.isVideo or Conf['PDF in Gallery'])
    return if Gallery.fullIDs[post.fullID]

    Gallery.fullIDs[post.fullID] = true

    thumb = $.el 'a',
      className: 'gal-thumb'
      href:      post.file.url
      target:    '_blank'
      title:     post.file.name

    thumb.dataset.id   = Gallery.images.length
    thumb.dataset.post = post.fullID

    thumbImg = post.file.thumb.cloneNode false
    thumbImg.style.cssText = ''
    $.add thumb, thumbImg

    $.on thumb, 'click', Gallery.cb.open

    Gallery.images.push thumb
    $.add Gallery.nodes.thumbs, thumb

  load: (thumb, errorCB) ->
    ext = thumb.href.match /\w*$/
    elType = {'webm': 'video', 'pdf': 'iframe'}[ext] or 'img'
    file = $.el elType,
      title: thumb.title
    $.extend file.dataset, thumb.dataset
    $.on file, 'error', errorCB
    file.src = thumb.href
    file

  open: (thumb) ->
    {nodes} = Gallery
    oldID = +nodes.current.dataset.id
    newID = +thumb.dataset.id

    # Highlight, center selected thumbnail
    $.rmClass  el,    'gal-highlight' if el = Gallery.images[oldID]
    $.addClass thumb, 'gal-highlight'
    nodes.thumbs.scrollTop = thumb.offsetTop + thumb.offsetHeight/2 - nodes.thumbs.clientHeight/2

    # Load image or use preloaded image
    if Gallery.cache?.dataset.id is ''+newID
      file = Gallery.cache
      $.off file, 'error', Gallery.cacheError
      $.on file, 'error', Gallery.error
    else
      file = Gallery.load thumb, Gallery.error

    # Replace old image with new one
    $.off nodes.current, 'error', Gallery.error
    ImageCommon.pause nodes.current
    $.replace nodes.current, file
    nodes.current = file

    if file.nodeName is 'VIDEO'
      file.loop = true
      Volume.setup file
      file.play() if Conf['Autoplay']
      ImageCommon.addControls file if Conf['Show Controls']

    doc.classList.toggle 'gal-pdf', file.nodeName is 'IFRAME'
    Gallery.cb.setHeight()
    nodes.count.textContent = +thumb.dataset.id + 1
    nodes.name.download     = nodes.name.textContent = thumb.title
    nodes.name.href         = thumb.href
    nodes.frame.scrollTop   = 0
    nodes.next.focus()

    # Continue slideshow if moving forward, stop otherwise
    if Gallery.slideshow and (newID > oldID or (oldID is Gallery.images.length-1 and newID is 0))
      Gallery.setupTimer()
    else
      Gallery.cb.stop()

    # Scroll to post
    if Conf['Scroll to Post'] and (post = g.posts[file.dataset.post])
      Header.scrollTo post.nodes.root

    # Preload next image
    if isNaN(oldID) or newID is (oldID + 1) % Gallery.images.length
      Gallery.cache = Gallery.load Gallery.images[(newID + 1) % Gallery.images.length], Gallery.cacheError

  error: ->
    if @error?.code is MediaError.MEDIA_ERR_DECODE
      return new Notice 'error', 'Corrupt or unplayable video', 30
    return unless @src.split('/')[2] is 'i.4cdn.org'
    ImageCommon.error @, g.posts[@dataset.post], null, (url) =>
      return unless url
      Gallery.images[@dataset.id].href = url
      @src = url if Gallery.nodes.current is @

  cacheError: ->
    delete Gallery.cache

  cleanupTimer: ->
    clearTimeout Gallery.timeoutID
    {current} = Gallery.nodes
    $.off current, 'canplaythrough load', Gallery.startTimer
    $.off current, 'ended', Gallery.cb.next

  startTimer: ->
    Gallery.timeoutID = setTimeout Gallery.checkTimer, Gallery.delay * $.SECOND

  setupTimer: ->
    Gallery.cleanupTimer()
    {current} = Gallery.nodes
    isVideo = current.nodeName is 'VIDEO'
    current.play() if isVideo
    if (if isVideo then current.readyState >= 4 else current.complete) or current.nodeName is 'IFRAME'
      Gallery.startTimer()
    else
      $.on current, (if isVideo then 'canplaythrough' else 'load'), Gallery.startTimer

  checkTimer: ->
    {current} = Gallery.nodes
    if current.nodeName is 'VIDEO' and !current.paused
      $.on current, 'ended', Gallery.cb.next
      current.loop = false
    else
      Gallery.cb.next()

  cb:
    keybinds: (e) ->
      return unless key = Keybinds.keyCode e

      cb = switch key
        when Conf['Close'], Conf['Open Gallery']
          Gallery.cb.close
        when 'Right'
          Gallery.cb.next
        when 'Enter'
          Gallery.cb.advance
        when 'Left', ''
          Gallery.cb.prev
        when Conf['Pause']
          Gallery.cb.pause
        when Conf['Slideshow']
          Gallery.cb.toggleSlideshow

      return unless cb
      e.stopPropagation()
      e.preventDefault()
      cb()

    open: (e) ->
      e.preventDefault() if e
      if @ then Gallery.open @

    image: (e) ->
      e.preventDefault()
      e.stopPropagation()
      Gallery.build @

    prev:      ->
      Gallery.cb.open.call(
        Gallery.images[+Gallery.nodes.current.dataset.id - 1] or Gallery.images[Gallery.images.length - 1]
      )
    next:      ->
      Gallery.cb.open.call(
        Gallery.images[+Gallery.nodes.current.dataset.id + 1] or Gallery.images[0]
      )

    click: (e) ->
      return if ImageCommon.onControls e
      e.preventDefault()
      Gallery.cb.advance()

    advance:   -> if !Conf['Autoplay'] and Gallery.nodes.current.paused then Gallery.nodes.current.play() else Gallery.cb.next()
    toggle:    -> (if Gallery.nodes then Gallery.cb.close else Gallery.build)()
    blank: (e) -> Gallery.cb.close() if e.target is @
    toggleSlideshow: ->  Gallery.cb[if Gallery.slideshow then 'stop' else 'start']()

    pause: ->
      Gallery.cb.stop()
      {current} = Gallery.nodes
      current[if current.paused then 'play' else 'pause']() if current.nodeName is 'VIDEO'

    start: ->
      $.addClass Gallery.nodes.buttons, 'gal-playing'
      Gallery.slideshow = true
      Gallery.setupTimer()

    stop: ->
      return unless Gallery.slideshow
      Gallery.cleanupTimer()
      {current} = Gallery.nodes
      current.loop = true if current.nodeName is 'VIDEO'
      $.rmClass Gallery.nodes.buttons, 'gal-playing'
      Gallery.slideshow = false

    close: ->
      $.off Gallery.nodes.current, 'error', Gallery.error
      ImageCommon.pause Gallery.nodes.current
      $.rm Gallery.nodes.el
      $.rmClass doc, 'gallery-open'
      if Conf['Fullscreen Gallery']
        $.off d, 'fullscreenchange mozfullscreenchange webkitfullscreenchange', Gallery.cb.close
        d.mozCancelFullScreen?()
        d.webkitExitFullscreen?()
      delete Gallery.nodes
      delete Gallery.fullIDs
      doc.style.overflow = ''

      $.off d, 'keydown', Gallery.cb.keybinds
      $.on  d, 'keydown', Keybinds.keydown if Conf['Keybinds']
      $.off window, 'resize', Gallery.cb.setHeight
      clearTimeout Gallery.timeoutID

    setFitness: ->
      (if @checked then $.addClass else $.rmClass) doc, "gal-#{@name.toLowerCase().replace /\s+/g, '-'}"

    setHeight: $.debounce 100, ->
      {current, frame} = Gallery.nodes
      {style} = current
      if Conf['Stretch to Fit'] and (dim = g.posts[current.dataset.post]?.file.dimensions)
        [width, height] = dim.split 'x'
        minHeight = Math.min(doc.clientHeight - 25, height / width * frame.clientWidth)
        style.minHeight = minHeight + 'px'
        style.minWidth = (width / height * minHeight) + 'px'
      else
        style.minHeight = style.minWidth = null

    setDelay: -> Gallery.delay = +@value

  menu:
    init: ->
      return unless Gallery.enabled

      el = $.el 'span',
        textContent: 'Gallery'
        className: 'gallery-link'

      Header.menu.addEntry
        el: el
        order: 105
        subEntries: Gallery.menu.createSubEntries()

    createSubEntry: (name) ->
      label = UI.checkbox name, name
      input = label.firstElementChild
      $.on input, 'change', Gallery.cb.setFitness if name in ['Hide Thumbnails', 'Fit Width', 'Fit Height']
      $.event 'change', null, input
      $.on input, 'change', $.cb.checked
      $.on input, 'change', Gallery.cb.setHeight  if name in ['Hide Thumbnails', 'Fit Width', 'Fit Height', 'Stretch to Fit']
      el: label

    createSubEntries: ->
      subEntries = (Gallery.menu.createSubEntry item for item in ['Hide Thumbnails', 'Fit Width', 'Fit Height', 'Stretch to Fit', 'Scroll to Post'])

      delayLabel = $.el 'label', <%= html('Slide Delay: <input type="number" name="Slide Delay" min="0" step="any" class="field">') %>
      delayInput = delayLabel.firstElementChild
      delayInput.value = Gallery.delay
      $.on delayInput, 'change', Gallery.cb.setDelay
      $.on delayInput, 'change', $.cb.value
      subEntries.push el: delayLabel

      subEntries
