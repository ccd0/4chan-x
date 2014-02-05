QR.post = class
  constructor: (select) ->
    el = $.el 'a',
      className: 'qr-preview'
      draggable: true
      href: 'javascript:;'
      innerHTML: '<a class="remove fa fa-times-circle" title=Remove></a><label hidden><input type=checkbox> Spoiler</label><span></span>'

    @nodes =
      el:      el
      rm:      el.firstChild
      label:   $ 'label', el
      spoiler: $ 'input', el
      span:    el.lastChild

    <% if (type === 'userscript') { %>
    # XXX Firefox lacks focusin/focusout support.
    for elm in $$ '*', el
      $.on elm, 'blur',  QR.focusout
      $.on elm, 'focus', QR.focusin
    <% } %>
    $.on el,             'click',  @select
    $.on @nodes.rm,      'click',  (e) => e.stopPropagation(); @rm()
    $.on @nodes.label,   'click',  (e) => e.stopPropagation()
    $.on @nodes.spoiler, 'change', (e) =>
      @spoiler = e.target.checked
      QR.nodes.spoiler.checked = @spoiler if @ is QR.selected
    $.add QR.nodes.dumpList, el

    for event in ['dragStart', 'dragEnter', 'dragLeave', 'dragOver', 'dragEnd', 'drop']
      $.on el, event.toLowerCase(), @[event]

    @thread = if g.VIEW is 'thread'
      g.THREADID
    else
      'new'

    [..., prev] = QR.posts
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
      else if prev and !/^sage$/.test prev.email
        prev.email
      else
        persona.email

      @sub = if 'sub' of QR.persona.always
        QR.persona.always.sub
      else if Conf['Remember Subject']
        if prev then prev.sub else persona.sub
      else
        ''

      if QR.nodes.flag
        @flag = if prev
          prev.flag
        else
          persona.flag
      @load() if QR.selected is @ # load persona
    @select() if select
    @unlock()
  rm: ->
    @delete()
    index = QR.posts.indexOf @
    if QR.posts.length is 1
      new QR.post true
    else if @ is QR.selected
      (QR.posts[index-1] or QR.posts[index+1]).select()
    QR.posts.splice index, 1
    QR.status()
  delete: ->
    $.rm @nodes.el
    URL.revokeObjectURL @URL
  lock: (lock=true) ->
    @isLocked = lock
    return unless @ is QR.selected
    for name in ['thread', 'name', 'email', 'sub', 'com', 'fileButton', 'filename', 'spoiler', 'flag']
      continue unless node = QR.nodes[name]
      node.disabled = lock
    @nodes.rm.style.visibility = if lock then 'hidden' else ''
    (if lock then $.off else $.on) QR.nodes.filename.previousElementSibling, 'click', QR.openFileInput
    @nodes.spoiler.disabled = lock
    @nodes.el.draggable = !lock
  unlock: ->
    @lock false
  select: =>
    if QR.selected
      QR.selected.nodes.el.id = null
      QR.selected.forceSave()
    QR.selected = @
    @lock @isLocked
    @nodes.el.id = 'selected'
    # Scroll the list to center the focused post.
    rectEl   = @nodes.el.getBoundingClientRect()
    rectList = @nodes.el.parentNode.getBoundingClientRect()
    @nodes.el.parentNode.scrollLeft += rectEl.left + rectEl.width/2 - rectList.left - rectList.width/2
    @load()
    $.event 'QRPostSelection', @
  load: ->
    # Load this post's values.
    for name in ['thread', 'name', 'email', 'sub', 'com', 'filename', 'flag']
      continue unless node = QR.nodes[name]
      node.value = @[name] or node.dataset.default or null
    @showFileData()
    QR.characterCount()
  save: (input) ->
    if input.type is 'checkbox'
      @spoiler = input.checked
      return
    {name}  = input.dataset
    @[name] = input.value or input.dataset.default or null
    switch name
      when 'thread'
        QR.status()
      when 'com'
        @nodes.span.textContent = @com
        QR.characterCount()
        # Disable auto-posting if you're typing in the first post
        # during the last 5 seconds of the cooldown.
        if QR.cooldown.auto and @ is QR.posts[0] and 0 < QR.cooldown.seconds <= 5
          QR.cooldown.auto = false
      when 'filename'
        return unless @file
        @file.newName = @filename.replace /[/\\]/g, '-'
        unless /\.(jpe?g|png|gif|pdf|swf)$/i.test @filename
          # 4chan will truncate the filename if it has no extension,
          # but it will always replace the extension by the correct one,
          # so we suffix it with '.jpg' when needed.
          @file.newName += '.jpg'
        @updateFilename()
  forceSave: ->
    return unless @ is QR.selected
    # Do this in case people use extensions
    # that do not trigger the `input` event.
    for name in ['thread', 'name', 'email', 'sub', 'com', 'filename', 'spoiler', 'flag']
      continue unless node = QR.nodes[name]
      @save node
    return
  setFile: (@file) ->
    @filename = file.name
    @filesize = $.bytesToString file.size
    @nodes.label.hidden = false if QR.spoiler
    URL.revokeObjectURL @URL
    if @ is QR.selected
      @showFileData()
    else
      @updateFilename()
    unless /^image/.test file.type
      @nodes.el.style.backgroundImage = null
      return
    @setThumbnail()
  setThumbnail: ->
    # Create a redimensioned thumbnail.
    img = $.el 'img'

    img.onload = =>
      # Generate thumbnails only if they're really big.
      # Resized pictures through canvases look like ass,
      # so we generate thumbnails `s` times bigger then expected
      # to avoid crappy resized quality.
      s = 90 * 2 * window.devicePixelRatio
      s *= 3 if @file.type is 'image/gif' # let them animate
      {height, width} = img
      if height < s or width < s
        @URL = fileURL
        @nodes.el.style.backgroundImage = "url(#{@URL})"
        return
      if height <= width
        width  = s / height * width
        height = s
      else
        height = s / width  * height
        width  = s
      cv = $.el 'canvas'
      cv.height = img.height = height
      cv.width  = img.width  = width
      cv.getContext('2d').drawImage img, 0, 0, width, height
      URL.revokeObjectURL fileURL
      cv.toBlob (blob) =>
        @URL = URL.createObjectURL blob
        @nodes.el.style.backgroundImage = "url(#{@URL})"

    fileURL = URL.createObjectURL @file
    img.src = fileURL
  rmFile: ->
    return if @isLocked
    delete @file
    delete @filename
    delete @filesize
    @nodes.el.title = null
    @nodes.el.style.backgroundImage = null
    @nodes.label.hidden = true if QR.spoiler
    @showFileData()
    URL.revokeObjectURL @URL
  updateFilename: ->
    long = "#{@filename} (#{@filesize})"
    @nodes.el.title = long
    return unless @ is QR.selected
    QR.nodes.filename.title = long
  showFileData: ->
    if @file
      @updateFilename()
      QR.nodes.filename.value       = @filename
      QR.nodes.filesize.textContent = @filesize
      QR.nodes.spoiler.checked      = @spoiler
      $.addClass QR.nodes.fileSubmit, 'has-file'
    else
      $.rmClass QR.nodes.fileSubmit, 'has-file'
  pasteText: (file) ->
    reader = new FileReader()
    reader.onload = (e) =>
      text = e.target.result
      if @com
        @com += "\n#{text}"
      else
        @com = text
      if QR.selected is @
        QR.nodes.com.value    = @com
      @nodes.span.textContent = @com
    reader.readAsText file
  dragStart: (e) ->
    e.dataTransfer.setDragImage @, e.layerX, e.layerY
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
    (if oldIndex < newIndex then $.after else $.before) @, el
    post = QR.posts.splice(oldIndex, 1)[0]
    QR.posts.splice newIndex, 0, post
    QR.status()
