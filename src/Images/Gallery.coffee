Gallery =
  init: ->
    return if g.VIEW not in ['index', 'thread'] or g.BOARD is 'f' or !Conf['Gallery']

    @delay = Conf['Slide Delay']

    el = $.el 'a',
      href: 'javascript:;'
      id:   'appchan-gal'
      title: 'Gallery'
      className: 'fa fa-picture-o'
      textContent: 'Gallery'

    $.on el, 'click', @cb.toggle

    Header.addShortcut el

    Post.callbacks.push
      name: 'Gallery'
      cb:   @node

  node: ->
    return unless @file
    if Gallery.nodes
      Gallery.generateThumb @
      Gallery.nodes.total.textContent = Gallery.images.length

    unless Conf['Image Expansion']
      $.on @file.thumb.parentNode, 'click', Gallery.cb.image

  build: (image) ->
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
    $.extend dialog, <%= importHTML('Features/Gallery') %>

    nodes[key] = $ value, dialog for key, value of {
      buttons: '.gal-buttons'
      name:    '.gal-name'
      count:   '.count'
      total:   '.total'
      frame:   '.gal-image'
      next:    '.gal-image a'
      current: '.gal-image img'
      thumbs:  '.gal-thumbnails'
    }

    menuButton = $ '.menu-button', dialog
    nodes.menu = new UI.Menu 'gallery'

    {cb} = Gallery
    $.on nodes.frame, 'click', cb.blank
    $.on nodes.next,  'click', cb.click
    $.on nodes.name,  'click', DownloadLink.download

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
    for file in $$ '.post .file' when !$ '.fileDeletedRes, .fileDeleted', file
      post = Get.postFromNode file
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
    return unless post.file and (post.file.isImage or post.file.isVideo or Conf['PDF in Gallery'])
    return if Gallery.fullIDs[post.fullID]
    Gallery.fullIDs[post.fullID] = true

    thumb = $.el 'a',
      className: 'gal-thumb'
      href:      post.file.URL
      target:    '_blank'
      title:     post.file.name
    thumb.dataset.id = Gallery.images.length
    thumb.dataset.post = post.fullID

    thumbImg = post.file.thumb.cloneNode false
    thumbImg.style.cssText = ''
    $.add thumb, thumbImg
 
    $.on thumb, 'click', Gallery.cb.open

    Gallery.images.push thumb
    $.add Gallery.nodes.thumbs, thumb

  open: (thumb) ->
    {nodes} = Gallery
    {name}  = nodes
    oldID = +nodes.current.dataset.id
    newID = +thumb.dataset.id
    slideshow = Gallery.slideshow and (newID > oldID or (oldID is Gallery.images.length-1 and newID is 0))

    $.rmClass  el,    'gal-highlight' if el = $ '.gal-highlight', nodes.thumbs
    $.addClass thumb, 'gal-highlight'

    elType = 'img'
    elType = 'video' if /\.webm$/.test(thumb.href)
    elType = 'iframe' if /\.pdf$/.test(thumb.href)
    $[if elType is 'iframe' then 'addClass' else 'rmClass'] doc, 'gal-pdf'
    file = $.el elType,
      title: name.download = name.textContent = thumb.title
    $.on file, 'error', =>
      Gallery.error file, thumb
    file.src = name.href = thumb.href

    $.extend  file.dataset, thumb.dataset
    nodes.current.pause?() unless nodes.current.error
    $.replace nodes.current, file
    if elType is 'video'
      file.loop = true
      file.play() if Conf['Autoplay']
      ImageCommon.addControls file if Conf['Show Controls']
    nodes.count.textContent = +thumb.dataset.id + 1
    nodes.current           = file
    nodes.frame.scrollTop   = 0
    nodes.next.focus()
    if slideshow
      Gallery.setupTimer()
    else
      Gallery.cb.stop()

    # Scroll to post
    if Conf['Scroll to Post'] and post = (post = g.posts[file.dataset.post])?.nodes.root
      Header.scrollTo post

    # Center selected thumbnail
    nodes.thumbs.scrollTop = thumb.offsetTop + thumb.offsetHeight/2 - nodes.thumbs.clientHeight/2

  error: (file, thumb) ->
    if file.error?.code is MediaError.MEDIA_ERR_DECODE
      return new Notice 'error', 'Corrupt or unplayable video', 30
    return unless file.src.split('/')[2] is 'i.4cdn.org'
    ImageCommon.error file, g.posts[file.dataset.post], null, (URL) ->
      return unless URL
      thumb.href = URL
      file.src = URL if Gallery.nodes.current is file

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
    advance:   -> if Gallery.nodes.current.paused then Gallery.nodes.current.play() else Gallery.cb.next()
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
      Gallery.nodes.current.pause?()
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
      clearTimeout Gallery.timeoutID

    setFitness: ->
      (if @checked then $.addClass else $.rmClass) doc, "gal-#{@name.toLowerCase().replace /\s+/g, '-'}"

    setDelay: -> Gallery.delay = +@value

  menu:
    init: ->
      return if g.VIEW not in ['index', 'thread'] or !Conf['Gallery']

      el = $.el 'span',
        textContent: 'Gallery'
        className: 'gallery-link'

      Header.menu.addEntry
        el: el
        order: 105
        subEntries: Gallery.menu.createSubEntries()

    createSubEntry: (name) ->
      label = UI.checkbox name, " #{name}"
      input = label.firstElementChild
      $.on input, 'change', Gallery.cb.setFitness
      $.event 'change', null, input
      $.on input, 'change', $.cb.checked
      el: label

    createSubEntries: ->
      subEntries = ['Hide Thumbnails', 'Fit Width', 'Fit Height', 'Scroll to Post'].map Gallery.menu.createSubEntry

      delayLabel = $.el 'label', <%= html('Slide Delay: <input type="number" name="Slide Delay" min="0" step="any" class="field">') %>
      delayInput = delayLabel.firstElementChild
      delayInput.value = Gallery.delay
      $.on delayInput, 'change', Gallery.cb.setDelay
      $.on delayInput, 'change', $.cb.value
      subEntries.push el: delayLabel

      subEntries
