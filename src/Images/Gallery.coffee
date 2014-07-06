Gallery =
  init: ->
    return if g.VIEW is 'catalog' or g.BOARD is 'f' or !Conf['Gallery']

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
      Gallery.generateThumb $ '.file', @nodes.root
      Gallery.nodes.total.textContent = Gallery.images.length

    unless Conf['Image Expansion']
      $.on @file.thumb.parentNode, 'click', Gallery.cb.image

  build: (image) ->
    Gallery.images  = []
    nodes = Gallery.nodes = {}
    Gallery.fullIDs = {}
    Gallery.slideshow = false

    nodes.el = dialog = $.el 'div',
      id: 'a-gallery'
      innerHTML: <%= importHTML('Features/Gallery') %>

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
    $.on nodes.frame,             'click', cb.blank
    $.on nodes.next,              'click', cb.click
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
    $.off d, 'keydown', Keybinds.keydown
    Gallery.generateThumb file for file in $$ '.post .file' when !$ '.fileDeletedRes, .fileDeleted', file
    $.add d.body, dialog

    nodes.thumbs.scrollTop = 0
    nodes.current.parentElement.scrollTop = 0

    Gallery.cb.open.call if image
      $ "[href='#{image.href.replace /https?:/, ''}']", nodes.thumbs
    else
      Gallery.images[0]

    d.body.style.overflow = 'hidden'
    nodes.total.textContent = Gallery.images.length

  generateThumb: (file) ->
    post  = Get.postFromNode file
    return unless post.file and (post.file.isImage or post.file.isVideo or Conf['PDF in Gallery'])
    return if Gallery.fullIDs[post.fullID]
    Gallery.fullIDs[post.fullID] = true

    title = ($ '.fileText a', file).textContent
    thumb = $.el 'a',
      className: 'gal-thumb'
      href:      post.file.URL
      target:    '_blank'
      title:     title
    thumb.dataset.id = Gallery.images.length
    thumb.dataset.post = $('a[title="Link to this post"]', post.nodes.info).href

    thumbImg = post.file.thumb.cloneNode false
    thumbImg.style.cssText = ''
    $.add thumb, thumbImg
 
    $.on thumb, 'click', Gallery.cb.open

    Gallery.images.push thumb
    $.add Gallery.nodes.thumbs, thumb

  cb:
    keybinds: (e) ->
      return unless key = Keybinds.keyCode e

      cb = switch key
        when 'Esc', Conf['Open Gallery']
          Gallery.cb.close
        when 'Right'
          Gallery.cb.next
        when 'Enter'
          Gallery.cb.enterKey
        when 'Left', ''
          Gallery.cb.prev
        when 'p'
          Gallery.cb.pause
        when 's'
          Gallery.cb.toggleSlideshow

      return unless cb
      e.stopPropagation()
      e.preventDefault()
      cb()

    open: (e) ->
      e.preventDefault() if e
      return unless @

      {nodes} = Gallery
      {name}  = nodes
      slideshow = Gallery.slideshow and +@dataset.id > +nodes.current.dataset.id

      $.rmClass  el, 'gal-highlight' if el = $ '.gal-highlight', nodes.thumbs
      $.addClass @,  'gal-highlight'

      elType = 'img'
      elType = 'video' if /\.webm$/.test(@href)
      elType = 'iframe' if /\.pdf$/.test(@href)
      $[if elType is 'iframe' then 'addClass' else 'rmClass'] doc, 'gal-pdf'
      file = $.el elType,
        title: name.download = name.textContent = @title
      $.on file, 'error', ->
        Gallery.cb.error file, thumb
      file.src = name.href = @href

      $.extend  file.dataset,   @dataset
      nodes.current.pause?()
      $.replace nodes.current,  file
      Video.configure file if elType is 'video'
      nodes.count.textContent = +@dataset.id + 1
      nodes.current           = file
      nodes.frame.scrollTop   = 0
      nodes.next.focus()
      Gallery.cb[if slideshow then 'setupTimer' else 'stop']()

      # Center selected thumbnail
      nodes.thumbs.scrollTop = @offsetTop + @offsetHeight/2 - nodes.thumbs.clientHeight/2

    image: (e) ->
      e.preventDefault()
      e.stopPropagation()
      Gallery.build @

    error: (file, thumb) ->
      post = Get.postFromLink $.el 'a', href: file.dataset.post
      delete post.file.fullImage

      src = @src.split '/'
      if src[2] is 'i.4cdn.org'
        URL = Redirect.to 'file',
          boardID:  src[3]
          filename: src[src.length - 1]
        if URL
          thumb.href = URL
          return unless Gallery.nodes.current is file
          file.src = URL
          return
        if g.DEAD or post.isDead or post.file.isDead
          return

      # XXX CORS for i.4cdn.org WHEN?
      $.ajax "//a.4cdn.org/#{post.board}/thread/#{post.thread}.json", onload: ->
        return if @status isnt 200
        i = 0
        {posts} = @response
        while postObj = posts[i++]
          break if postObj.no is post.ID
        unless postObj.no
          return post.kill()
        if postObj.filedeleted
          post.kill true

    prev:      -> Gallery.cb.open.call Gallery.images[+Gallery.nodes.current.dataset.id - 1]
    next:      -> Gallery.cb.open.call Gallery.images[+Gallery.nodes.current.dataset.id + 1]
    enterKey:  -> if Gallery.nodes.current.paused then Gallery.nodes.current.play() else Gallery.cb.next()
    click:     -> Gallery.cb[if Gallery.nodes.current.controls then 'stop' else 'enterKey']()
    toggle:    -> (if Gallery.nodes then Gallery.cb.close else Gallery.build)()
    blank: (e) -> Gallery.cb.close() if e.target is @
    toggleSlideshow: ->  Gallery.cb[if Gallery.slideshow then 'stop' else 'start']()

    pause: ->
      Gallery.cb.stop()
      {current} = Gallery.nodes
      current[if current.paused then 'play' else 'pause']() if current.nodeName is 'VIDEO'

    cleanupTimer: ->
      clearTimeout Gallery.timeoutID
      {current} = Gallery.nodes
      $.off current, 'canplaythrough load', Gallery.cb.startTimer
      $.off current, 'ended', Gallery.cb.next

    setupTimer: ->
      Gallery.cb.cleanupTimer()
      {current} = Gallery.nodes
      isVideo = current.nodeName is 'VIDEO'
      Video.start current if isVideo
      return Gallery.cb.stop() if !Gallery.images[+Gallery.nodes.current.dataset.id + 1]
      if (if isVideo then current.readyState > 4 else current.complete) or current.nodeName is 'IFRAME'
        Gallery.cb.startTimer()
      else
        $.on current, (if isVideo then 'canplaythrough' else 'load'), Gallery.cb.startTimer

    startTimer: ->
      Gallery.timeoutID = setTimeout Gallery.cb.checkTimer, Gallery.delay * $.SECOND

    checkTimer: ->
      {current} = Gallery.nodes
      if current.nodeName is 'VIDEO' and !current.paused
        $.on current, 'ended', Gallery.cb.next
        current.loop = false
      else
        Gallery.cb.next()

    start: ->
      $.addClass Gallery.nodes.buttons, 'gal-playing'
      Gallery.slideshow = true
      Gallery.cb.setupTimer()

    stop: ->
      return unless Gallery.slideshow
      Gallery.cb.cleanupTimer()
      {current} = Gallery.nodes
      current.loop = true if current.nodeName is 'VIDEO'
      $.rmClass Gallery.nodes.buttons, 'gal-playing'
      Gallery.slideshow = false

    close: ->
      Gallery.nodes.current.pause?()
      $.rm Gallery.nodes.el
      delete Gallery.nodes
      delete Gallery.fullIDs
      d.body.style.overflow = ''

      $.off d, 'keydown', Gallery.cb.keybinds
      $.on  d, 'keydown', Keybinds.keydown
      clearTimeout Gallery.timeoutID

    setFitness: ->
      (if @checked then $.addClass else $.rmClass) doc, "gal-#{@name.toLowerCase().replace /\s+/g, '-'}"

    setDelay: -> Gallery.delay = +@value

  menu:
    init: ->
      return if g.VIEW is 'catalog' or !Conf['Gallery']

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
      subEntries = ['Hide Thumbnails', 'Fit Width', 'Fit Height'].map Gallery.menu.createSubEntry

      delayLabel = $.el 'label', innerHTML: 'Slide Delay: <input type="number" name="Slide Delay" min="0" step="any" class="field">'
      delayInput = delayLabel.firstElementChild
      delayInput.value = Gallery.delay
      $.on delayInput, 'change', Gallery.cb.setDelay
      $.on delayInput, 'change', $.cb.value
      subEntries.push el: delayLabel

      subEntries
