QR.post = class
  constructor: (select) ->
    el = $.el 'a',
      className: 'qr-preview'
      draggable: true
      href: 'javascript:;'
    $.extend el, <%= html('<a class="remove fa fa-times-circle" title="Remove"></a><label class="qr-preview-spoiler"><input type="checkbox"> Spoiler</label><span></span>') %>

    @nodes =
      el:      el
      rm:      el.firstChild
      spoiler: $ '.qr-preview-spoiler input', el
      span:    el.lastChild

    $.on el,             'click',  @select
    $.on @nodes.rm,      'click',  (e) => e.stopPropagation(); @rm()
    $.on @nodes.spoiler, 'change', (e) =>
      @spoiler = e.target.checked
      QR.nodes.spoiler.checked = @spoiler if @ is QR.selected
      @preventAutoPost()
    for label in $$ 'label', el
      $.on label, 'click', (e) -> e.stopPropagation()
    $.add QR.nodes.dumpList, el

    for event in ['dragStart', 'dragEnter', 'dragLeave', 'dragOver', 'dragEnd', 'drop']
      $.on el, event.toLowerCase(), @[event]

    @thread = if g.VIEW is 'thread'
      g.THREADID
    else
      'new'

    prev = QR.posts[QR.posts.length - 1]
    QR.posts.push @
    @nodes.spoiler.checked = @spoiler = if prev and Conf['Remember Spoiler']
      prev.spoiler
    else
      false
    QR.persona.get (persona) =>
      @name = if 'name' of QR.persona.always
        QR.persona.always.name
      else if prev
        prev.name
      else
        persona.name

      @email = if 'email' of QR.persona.always
        QR.persona.always.email
      else
        ''

      @sub = if 'sub' of QR.persona.always
        QR.persona.always.sub
      else
        ''

      if QR.nodes.flag
        @flag = if prev
          prev.flag
        else
          persona.flag
      (@load() if QR.selected is @) # load persona
    @select() if select
    @unlock()
    QR.captcha.moreNeeded()

  rm: ->
    @delete()
    index = QR.posts.indexOf @
    if QR.posts.length is 1
      new QR.post true
      $.rmClass QR.nodes.el, 'dump'
    else if @ is QR.selected
      (QR.posts[index-1] or QR.posts[index+1]).select()
    QR.posts.splice index, 1
    QR.status()

  delete: ->
    $.rm @nodes.el
    URL.revokeObjectURL @URL
    @dismissErrors()

  lock: (lock=true) ->
    @isLocked = lock
    return unless @ is QR.selected
    for name in ['thread', 'name', 'email', 'sub', 'com', 'fileButton', 'filename', 'spoiler', 'flag'] when node = QR.nodes[name]
      node.disabled = lock
    @nodes.rm.style.visibility = if lock then 'hidden' else ''
    @nodes.spoiler.disabled = lock
    @nodes.el.draggable = !lock

  unlock: ->
    @lock false

  select: =>
    if QR.selected
      QR.selected.nodes.el.removeAttribute 'id'
      QR.selected.forceSave()
    QR.selected = @
    @lock @isLocked
    @nodes.el.id = 'selected'
    # Scroll the list to center the focused post.
    rectEl   = @nodes.el.getBoundingClientRect()
    rectList = @nodes.el.parentNode.getBoundingClientRect()
    @nodes.el.parentNode.scrollLeft += rectEl.left + rectEl.width/2 - rectList.left - rectList.width/2
    @load()

  load: ->
    # Load this post's values.

    for name in ['thread', 'name', 'email', 'sub', 'com', 'filename', 'flag']
      continue if not (node = QR.nodes[name])
      node.value = @[name] or node.dataset.default or ''

    (if @thread isnt 'new' then $.addClass else $.rmClass) QR.nodes.el, 'reply-to-thread'

    @showFileData()
    QR.characterCount()

  save: (input, forced) ->
    if input.type is 'checkbox'
      @spoiler = input.checked
      return
    {name}  = input.dataset
    prev    = @[name]
    @[name] = input.value or input.dataset.default or null
    switch name
      when 'thread'
        (if @thread isnt 'new' then $.addClass else $.rmClass) QR.nodes.el, 'reply-to-thread'
        QR.status()
      when 'com'
        @updateComment()
      when 'filename'
        return unless @file
        @saveFilename()
        @updateFilename()
      when 'name', 'flag'
        if @[name] isnt prev # only save manual changes, not values filled in by persona settings
          QR.persona.set @
    @preventAutoPost() unless forced

  forceSave: ->
    return unless @ is QR.selected
    # Do this in case people use extensions
    # that do not trigger the `input` event.
    for name in ['thread', 'name', 'email', 'sub', 'com', 'filename', 'spoiler', 'flag']
      continue if not (node = QR.nodes[name])
      @save node, true
    return

  preventAutoPost: ->
    # Disable auto-posting if you're editing the first post
    # during the last 5 seconds of the cooldown.
    if QR.cooldown.auto and @ is QR.posts[0]
      QR.cooldown.update() # adding/removing file can change cooldown
      QR.cooldown.auto = false if QR.cooldown.seconds <= 5

  setComment: (com) ->
    @com = com or null
    if @ is QR.selected
      QR.nodes.com.value = @com
    @updateComment()

  updateComment: ->
    if @ is QR.selected
      QR.characterCount()
    @nodes.span.textContent = @com
    QR.captcha.moreNeeded()

  @rmErrored: (e) ->
    e.stopPropagation()
    for post in QR.posts by -1 when errors = post.errors
      for error in errors when doc.contains error
        post.rm()
        break
    return

  error: (className, message, link) ->
    div = $.el 'div', {className}
    $.extend div, <%= html('${message}?{link}{ [<a href="${link}" target="_blank">More info</a>]}<br>[<a href="javascript:;">delete post</a>] [<a href="javascript:;">delete all</a>]') %>
    (@errors or= []).push div
    [rm, rmAll] = $$ 'a', div
    $.on div, 'click', =>
      (@select() if @ in QR.posts)
    $.on rm, 'click', (e) =>
      e.stopPropagation()
      (@rm() if @ in QR.posts)
    $.on rmAll, 'click', QR.post.rmErrored
    QR.error div, true

  fileError: (message, link) ->
    @error 'file-error', "#{@filename}: #{message}", link

  dismissErrors: (test = -> true) ->
    if @errors
      for error in @errors when doc.contains(error) and test error
        error.parentNode.previousElementSibling.click()
    return

  setFile: (@file) ->
    if Conf['Randomize Filename'] and g.BOARD.ID isnt 'f'
      @filename  = "#{Date.now() - Math.floor(Math.random() * 365 * $.DAY)}"
      @filename += ext[0] if ext = @file.name.match QR.validExtension
    else
      @filename  = @file.name
    @filesize = $.bytesToString @file.size
    @checkSize()
    $.addClass @nodes.el, 'has-file'
    QR.captcha.moreNeeded()
    URL.revokeObjectURL @URL
    @saveFilename()
    if @ is QR.selected
      @showFileData()
    else
      @updateFilename()
    @nodes.el.style.backgroundImage = ''
    unless @file.type in QR.mimeTypes
      @fileError 'Unsupported file type.'
    else if /^(image|video)\//.test @file.type
      @readFile()
    @preventAutoPost()

  checkSize: ->
    max = QR.max_size
    max = Math.min(max, QR.max_size_video) if /^video\//.test @file.type
    if @file.size > max
      @fileError "File too large (file: #{@filesize}, max: #{$.bytesToString max})."

  readFile: ->
    isVideo = /^video\//.test @file.type
    el = $.el(if isVideo then 'video' else 'img')
    return if isVideo and !el.canPlayType @file.type

    event = if isVideo then 'loadeddata' else 'load'
    onload = =>
      $.off el, event, onload
      $.off el, 'error', onerror
      @checkDimensions el
      @setThumbnail el
    onerror = =>
      $.off el, event, onload
      $.off el, 'error', onerror
      @fileError "Corrupt #{if isVideo then 'video' else 'image'} or error reading metadata.", '<%= meta.faq %>#error-reading-metadata'
      URL.revokeObjectURL el.src
    $.on el, event, onload
    $.on el, 'error', onerror
    el.src = URL.createObjectURL @file

  checkDimensions: (el) ->
    if el.tagName is 'IMG'
      {height, width} = el
      if height > QR.max_height or width > QR.max_width
        @fileError "Image too large (image: #{height}x#{width}px, max: #{QR.max_height}x#{QR.max_width}px)"
      if height < QR.min_height or width < QR.min_width
        @fileError "Image too small (image: #{height}x#{width}px, min: #{QR.min_height}x#{QR.min_width}px)"
    else
      {videoHeight, videoWidth, duration} = el
      max_height = Math.min(QR.max_height, QR.max_height_video)
      max_width  = Math.min(QR.max_width,  QR.max_width_video)
      if videoHeight > max_height or videoWidth > max_width
        @fileError "Video too large (video: #{videoHeight}x#{videoWidth}px, max: #{max_height}x#{max_width}px)"
      if videoHeight < QR.min_height or videoWidth < QR.min_width
        @fileError "Video too small (video: #{videoHeight}x#{videoWidth}px, min: #{QR.min_height}x#{QR.min_width}px)"
      unless isFinite duration
        @fileError 'Video lacks duration metadata (try remuxing)'
      else if duration > QR.max_duration_video
        @fileError "Video too long (video: #{duration}s, max: #{QR.max_duration_video}s)"
      if BoardConfig.noAudio(g.BOARD.ID) and $.hasAudio(el)
        @fileError 'Audio not allowed'

  setThumbnail: (el) ->
    # Create a redimensioned thumbnail.
    isVideo = el.tagName is 'VIDEO'

    # Generate thumbnails only if they're really big.
    # Resized pictures through canvases look like ass,
    # so we generate thumbnails `s` times bigger then expected
    # to avoid crappy resized quality.
    s = 90 * 2 * window.devicePixelRatio
    s *= 3 if @file.type is 'image/gif' # let them animate
    if isVideo
      height = el.videoHeight
      width = el.videoWidth
    else
      {height, width} = el
      if height < s or width < s
        @URL = el.src
        @nodes.el.style.backgroundImage = "url(#{@URL})"
        return

    if height <= width
      width  = s / height * width
      height = s
    else
      height = s / width  * height
      width  = s
    cv = $.el 'canvas'
    cv.height = height
    cv.width  = width
    cv.getContext('2d').drawImage el, 0, 0, width, height
    URL.revokeObjectURL el.src
    cv.toBlob (blob) =>
      @URL = URL.createObjectURL blob
      @nodes.el.style.backgroundImage = "url(#{@URL})"

  rmFile: ->
    return if @isLocked
    delete @file
    delete @filename
    delete @filesize
    @nodes.el.removeAttribute 'title'
    QR.nodes.filename.removeAttribute 'title'
    @nodes.el.style.backgroundImage = ''
    $.rmClass @nodes.el, 'has-file'
    @showFileData()
    URL.revokeObjectURL @URL
    @dismissErrors (error) -> $.hasClass error, 'file-error'
    @preventAutoPost()

  saveFilename: ->
    @file.newName = (@filename or '').replace /[/\\]/g, '-'
    unless QR.validExtension.test @filename
      # 4chan will truncate the filename if it has no extension.
      @file.newName += ".#{QR.extensionFromType[@file.type] or 'jpg'}"

  updateFilename: ->
    long = "#{@filename} (#{@filesize})"
    @nodes.el.title = long
    return unless @ is QR.selected
    QR.nodes.filename.title = long

  showFileData: ->
    if @file
      @updateFilename()
      QR.nodes.filename.value = @filename
      $.addClass QR.nodes.oekaki,     'has-file'
      $.addClass QR.nodes.fileSubmit, 'has-file'
    else
      $.rmClass QR.nodes.oekaki,     'has-file'
      $.rmClass QR.nodes.fileSubmit, 'has-file'
    if @file?.source?
      QR.nodes.fileSubmit.dataset.source = @file.source
    else
      QR.nodes.fileSubmit.removeAttribute 'data-source'
    QR.nodes.spoiler.checked = @spoiler

  pasteText: (file) ->
    @pasting = true
    @preventAutoPost()
    reader = new FileReader()
    reader.onload = (e) =>
      {result} = e.target
      @setComment (if @com then "#{@com}\n#{result}" else result)
      delete @pasting
    reader.readAsText file

  dragStart: (e) ->
    {left, top} = @getBoundingClientRect()
    e.dataTransfer.setDragImage @, e.clientX - left, e.clientY - top
    $.addClass @, 'drag'
  dragEnd:   -> $.rmClass  @, 'drag'
  dragEnter: -> $.addClass @, 'over'
  dragLeave: -> $.rmClass  @, 'over'

  dragOver: (e) ->
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

  drop: ->
    $.rmClass @, 'over'
    return unless @draggable
    el       = $ '.drag', @parentNode
    index    = (el) -> [el.parentNode.children...].indexOf el
    oldIndex = index el
    newIndex = index @
    return if QR.posts[oldIndex].isLocked or QR.posts[newIndex].isLocked
    (if oldIndex < newIndex then $.after else $.before) @, el
    post = QR.posts.splice(oldIndex, 1)[0]
    QR.posts.splice newIndex, 0, post
    QR.status()
