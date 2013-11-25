QR =
  init: ->
    return if !Conf['Quick Reply']

    @db = new DataBoard 'yourPosts'

    if Conf['Hide Original Post Form']
      $.addClass doc, 'hide-original-post-form'

    $.on d, '4chanXInitFinished', @initReady

    Post.callbacks.push
      name: 'Quick Reply'
      cb:   @node

  initReady: ->
    $.off d, '4chanXInitFinished', QR.initReady
    QR.postingIsEnabled = !!$.id 'postForm'
    return unless QR.postingIsEnabled

    sc = $.el 'a',
      className: 'qr-shortcut fa fa-comment-o'
      title: 'Quick Reply'
      href: 'javascript:;'
    $.on sc, 'click', ->
      $.event 'CloseMenu'
      QR.open()
      QR.nodes.com.focus()
    Header.addShortcut sc, 2

    $.on d, 'QRGetSelectedPost', ({detail: cb}) ->
      cb QR.selected
    $.on d, 'QRAddPreSubmitHook', ({detail: cb}) ->
      QR.preSubmitHooks.push cb

    <% if (type === 'crx') { %>
    $.on d, 'paste',              QR.paste
    <% } %>
    $.on d, 'dragover',           QR.dragOver
    $.on d, 'drop',               QR.dropFile
    $.on d, 'dragstart dragend',  QR.drag
    switch g.VIEW
      when 'index'
        $.on d, 'IndexRefresh', QR.generatePostableThreadsList
      when 'thread'
        $.on d, 'ThreadUpdate', ->
          if g.DEAD
            QR.abort()
          else
            QR.status()

    QR.persist() if Conf['Persistent QR']

  node: ->
    $.on $('a[title="Quote this post"]', @nodes.info), 'click', QR.quote

  persist: ->
    QR.open()
    QR.hide() if Conf['Auto-Hide QR'] or g.VIEW is 'catalog'
  open: ->
    if QR.nodes
      QR.nodes.el.hidden = false
      QR.unhide()
      return
    try
      QR.dialog()
    catch err
      delete QR.nodes
      Main.handleErrors
        message: 'Quick Reply dialog creation crashed.'
        error: err
  close: ->
    if QR.req
      QR.abort()
      return
    QR.nodes.el.hidden = true
    QR.cleanNotifications()
    d.activeElement.blur()
    $.rmClass QR.nodes.el, 'dump'
    new QR.post true
    for post in QR.posts.splice 0, QR.posts.length - 1
      post.delete()
    QR.cooldown.auto = false
    QR.status()
  focusin: ->
    $.addClass QR.nodes.el, 'has-focus'
  focusout: ->
    <% if (type === 'crx') { %>
    $.rmClass QR.nodes.el, 'has-focus'
    <% } else { %>
    $.queueTask ->
      return if $.x 'ancestor::div[@id="qr"]', d.activeElement
      $.rmClass QR.nodes.el, 'has-focus'
    <% } %>
  hide: ->
    d.activeElement.blur()
    $.addClass QR.nodes.el, 'autohide'
    QR.nodes.autohide.checked = true
  unhide: ->
    $.rmClass QR.nodes.el, 'autohide'
    QR.nodes.autohide.checked = false
  toggleHide: ->
    if @checked
      QR.hide()
    else
      QR.unhide()

  error: (err) ->
    QR.open()
    if typeof err is 'string'
      el = $.tn err
    else
      el = err
      el.removeAttribute 'style'
    if QR.captcha.isEnabled and /captcha|verification/i.test el.textContent
      # Focus the captcha input on captcha error.
      QR.captcha.nodes.input.focus()
    notice = new Notice 'warning', el
    QR.notifications.push notice
    return unless Header.areNotificationsEnabled
    notif = new Notification 'Quick reply warning',
      body: el.textContent
      icon: Favicon.logo
    notif.onclick = -> window.focus()
    <% if (type === 'crx') { %>
    # Firefox automatically closes notifications
    # so we can't control the onclose properly.
    notif.onclose = -> notice.close()
    notif.onshow  = ->
      setTimeout ->
        notif.onclose = null
        notif.close()
      , 7 * $.SECOND
    <% } %>
  notifications: []
  cleanNotifications: ->
    for notification in QR.notifications
      notification.close()
    QR.notifications = []

  status: ->
    return unless QR.nodes
    {thread} = QR.posts[0]
    if thread isnt 'new' and g.threads["#{g.BOARD}.#{thread}"].isDead
      value    = 404
      disabled = true
      QR.cooldown.auto = false

    value = if QR.req
      QR.req.progress
    else
      QR.cooldown.seconds or value

    {status} = QR.nodes
    status.value = unless value
      'Submit'
    else if QR.cooldown.auto
      "Auto #{value}"
    else
      value
    status.disabled = disabled or false

  persona:
    pwd: ''
    always: {}
    init: ->
      QR.persona.getPassword()
      $.get 'QR.personas', Conf['QR.personas'], ({'QR.personas': personas}) ->
        types =
          name:  []
          email: []
          sub:   []
        for item in personas.split '\n'
          QR.persona.parseItem item.trim(), types
        for type, arr of types
          QR.persona.loadPersonas type, arr
        return
    parseItem: (item, types) ->
      return if item[0] is '#'
      return unless match = item.match /(name|email|subject|password):"(.*)"/i
      [match, type, val]  = match

      # Don't mix up item settings with val.
      item = item.replace match, ''

      boards = item.match(/boards:([^;]+)/i)?[1].toLowerCase() or 'global'
      if boards isnt 'global' and not (g.BOARD.ID in boards.split ',')
        return

      if type is 'password'
        QR.persona.pwd = val
        return

      type = 'sub' if type is 'subject'

      if /always/i.test item
        QR.persona.always[type] = val

      unless val in types[type]
        types[type].push val
    loadPersonas: (type, arr) ->
      list = $ "#list-#{type}", QR.nodes.el
      for val in arr when val
        $.add list, $.el 'option',
          textContent: val
      return
    getPassword: ->
      unless QR.persona.pwd
        QR.persona.pwd = if m = d.cookie.match /4chan_pass=([^;]+)/
          decodeURIComponent m[1]
        else if input = $.id 'postPassword'
          input.value
        else
          # If we're in a closed thread, #postPassword isn't available.
          # And since #delPassword.value is only filled on window.onload
          # we'd rather use #postPassword when we can.
          $.id('delPassword').value
      return QR.persona.pwd
    get: (cb) ->
      $.get 'QR.persona', {}, ({'QR.persona': persona}) ->
        cb persona
    set: (post) ->
      $.get 'QR.persona', {}, ({'QR.persona': persona}) ->
        persona =
          name:  post.name
          email: if /^sage$/.test post.email then persona.email else post.email
          sub:   if Conf['Remember Subject'] then post.sub      else undefined
          flag:  post.flag
        $.set 'QR.persona', persona

  cooldown:
    init: ->
      return unless Conf['Cooldown']
      setTimers = (e) => QR.cooldown.types = e.detail
      $.on  window, 'cooldown:timers', setTimers
      $.globalEval 'window.dispatchEvent(new CustomEvent("cooldown:timers", {detail: cooldowns}))'
      $.off window, 'cooldown:timers', setTimers
      for type of QR.cooldown.types
        QR.cooldown.types[type] = +QR.cooldown.types[type]
      QR.cooldown.upSpd = 0
      QR.cooldown.upSpdAccuracy = .5
      key = "cooldown.#{g.BOARD}"
      $.get key, {}, (item) ->
        QR.cooldown.cooldowns = item[key]
        QR.cooldown.start()
      $.sync key, QR.cooldown.sync
    start: ->
      return unless Conf['Cooldown']
      return if QR.cooldown.isCounting
      QR.cooldown.isCounting = true
      QR.cooldown.count()
    sync: (cooldowns) ->
      # Add each cooldowns, don't overwrite everything in case we
      # still need to prune one in the current tab to auto-post.
      for id of cooldowns
        QR.cooldown.cooldowns[id] = cooldowns[id]
      QR.cooldown.start()
    set: (data) ->
      return unless Conf['Cooldown']
      {req, post, isReply, threadID, delay} = data
      start = if req then req.uploadEndTime else Date.now()
      if delay
        cooldown = {delay}
      else
        if post.file
          upSpd = post.file.size / ((start - req.uploadStartTime) / $.SECOND)
          QR.cooldown.upSpdAccuracy = ((upSpd > QR.cooldown.upSpd * .9) + QR.cooldown.upSpdAccuracy) / 2
          QR.cooldown.upSpd = upSpd
        cooldown = {isReply, threadID}
      QR.cooldown.cooldowns[start] = cooldown
      $.set "cooldown.#{g.BOARD}", QR.cooldown.cooldowns
      QR.cooldown.start()
    unset: (id) ->
      delete QR.cooldown.cooldowns[id]
      if Object.keys(QR.cooldown.cooldowns).length
        $.set "cooldown.#{g.BOARD}", QR.cooldown.cooldowns
      else
        $.delete "cooldown.#{g.BOARD}"
    count: ->
      unless Object.keys(QR.cooldown.cooldowns).length
        $.delete "#{g.BOARD}.cooldown"
        delete QR.cooldown.isCounting
        delete QR.cooldown.seconds
        QR.status()
        return

      clearTimeout QR.cooldown.timeout
      QR.cooldown.timeout = setTimeout QR.cooldown.count, $.SECOND

      now     = Date.now()
      post    = QR.posts[0]
      isReply = post.thread isnt 'new'
      hasFile = !!post.file
      seconds = null
      {types, cooldowns, upSpd, upSpdAccuracy} = QR.cooldown

      for start, cooldown of cooldowns
        if 'delay' of cooldown
          if cooldown.delay
            seconds = Math.max seconds, cooldown.delay--
          else
            seconds = Math.max seconds, 0
            QR.cooldown.unset start
          continue

        if isReply is cooldown.isReply
          # Only cooldowns relevant to this post can set the seconds variable:
          #   reply cooldown with a reply, thread cooldown with a thread
          elapsed = Math.floor (now - start) / $.SECOND
          continue if elapsed < 0 # clock changed since then?
          type = unless isReply
            'thread'
          else if hasFile
            'image'
          else
            'reply'
          maxTimer = Math.max types[type] or 0, types[type + '_intra'] or 0
          unless start <= now <= start + maxTimer * $.SECOND
            QR.cooldown.unset start
          type   += '_intra' if isReply and +post.thread is cooldown.threadID
          seconds = Math.max seconds, types[type] - elapsed

      if seconds and Conf['Cooldown Prediction'] and hasFile and upSpd
        seconds -= Math.floor post.file.size / upSpd * upSpdAccuracy
        seconds  = Math.max seconds, 0
      # Update the status when we change posting type.
      # Don't get stuck at some random number.
      # Don't interfere with progress status updates.
      update = seconds isnt null or !!QR.cooldown.seconds
      QR.cooldown.seconds = seconds
      QR.status() if update
      QR.submit() if seconds is 0 and QR.cooldown.auto and !QR.req

  quote: (e) ->
    e?.preventDefault()
    return unless QR.postingIsEnabled

    sel   = d.getSelection()
    post  = Get.postFromNode @
    text  = ">>#{post}\n"
    if (s = sel.toString().trim()) and post is Get.postFromNode sel.anchorNode
      s = s.replace /\n/g, '\n>'
      text += ">#{s}\n"

    QR.open()
    if QR.selected.isLocked
      index = QR.posts.indexOf QR.selected
      (QR.posts[index+1] or new QR.post()).select()
      $.addClass QR.nodes.el, 'dump'
      QR.cooldown.auto = true
    {com, thread} = QR.nodes
    thread.value = Get.threadFromNode @ unless com.value

    caretPos = com.selectionStart
    # Replace selection for text.
    com.value = com.value[...caretPos] + text + com.value[com.selectionEnd..]
    # Move the caret to the end of the new quote.
    range = caretPos + text.length
    com.setSelectionRange range, range
    com.focus()

    QR.selected.save com
    QR.selected.save thread

  characterCount: ->
    counter = QR.nodes.charCount
    count   = QR.nodes.com.textLength
    counter.textContent = count
    counter.hidden      = count < 1000
    (if count > 1500 then $.addClass else $.rmClass) counter, 'warning'

  drag: (e) ->
    # Let it drag anything from the page.
    toggle = if e.type is 'dragstart' then $.off else $.on
    toggle d, 'dragover', QR.dragOver
    toggle d, 'drop',     QR.dropFile
  dragOver: (e) ->
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy' # cursor feedback
  dropFile: (e) ->
    # Let it only handle files from the desktop.
    return unless e.dataTransfer.files.length
    e.preventDefault()
    QR.open()
    QR.handleFiles e.dataTransfer.files
  paste: (e) ->
    files = []
    for item in e.clipboardData.items when item.kind is 'file'
      blob = item.getAsFile()
      blob.name  = 'file'
      blob.name += '.' + blob.type.split('/')[1] if blob.type
      files.push blob
    return unless files.length
    QR.open()
    QR.handleFiles files
    $.addClass QR.nodes.el, 'dump'
  handleFiles: (files) ->
    if @ isnt QR # file input
      files  = [@files...]
      @value = null
    return unless files.length
    max = QR.nodes.fileInput.max
    isSingle = files.length is 1
    QR.cleanNotifications()
    for file in files
      QR.handleFile file, isSingle, max
    $.addClass QR.nodes.el, 'dump' unless isSingle
  handleFile: (file, isSingle, max) ->
    if file.size > max
      QR.error "#{file.name}: File too large (file: #{$.bytesToString file.size}, max: #{$.bytesToString max})."
      return
    unless file.type in QR.mimeTypes
      unless /^text/.test file.type
        QR.error "#{file.name}: Unsupported file type."
        return
      if isSingle
        post = QR.selected
      else if (post = QR.posts[QR.posts.length - 1]).com
        post = new QR.post()
      post.pasteText file
      return
    if isSingle
      post = QR.selected
    else if (post = QR.posts[QR.posts.length - 1]).file
      post = new QR.post()
    post.setFile file
  openFileInput: ->
    QR.nodes.fileInput.click()

  posts: []
  post: class
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
      @showFileData() if @ is QR.selected
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

  captcha:
    init: ->
      return if d.cookie.indexOf('pass_enabled=1') >= 0
      return unless @isEnabled = !!$.id 'captchaFormPart'
      $.asap (-> $.id 'recaptcha_challenge_field_holder'), @ready.bind @
    ready: ->
      setLifetime = (e) => @lifetime = e.detail
      $.on  window, 'captcha:timeout', setLifetime
      $.globalEval 'window.dispatchEvent(new CustomEvent("captcha:timeout", {detail: RecaptchaState.timeout}))'
      $.off window, 'captcha:timeout', setLifetime

      imgContainer = $.el 'div',
        className: 'captcha-img'
        title: 'Reload reCAPTCHA'
        innerHTML: '<img>'
      input = $.el 'input',
        className: 'captcha-input field'
        title: 'Verification'
        autocomplete: 'off'
        spellcheck: false
      @nodes =
        challenge: $.id 'recaptcha_challenge_field_holder'
        img:       imgContainer.firstChild
        input:     input

      new MutationObserver(@load.bind @).observe @nodes.challenge,
        childList: true

      $.on imgContainer, 'click',   @reload.bind @
      $.on input,        'keydown', @keydown.bind @
      $.get 'captchas', [], ({captchas}) =>
        @sync captchas
      $.sync 'captchas', @sync
      # start with an uncached captcha
      @reload()

      <% if (type === 'userscript') { %>
      # XXX Firefox lacks focusin/focusout support.
      $.on input, 'blur',  QR.focusout
      $.on input, 'focus', QR.focusin
      <% } %>

      $.addClass QR.nodes.el, 'has-captcha'
      $.after QR.nodes.com.parentNode, [imgContainer, input]
    sync: (captchas) ->
      QR.captcha.captchas = captchas
      QR.captcha.count()
    getOne: ->
      @clear()
      if captcha = @captchas.shift()
        {challenge, response} = captcha
        @count()
        $.set 'captchas', @captchas
      else
        challenge   = @nodes.img.alt
        if response = @nodes.input.value then @reload()
      if response
        response = response.trim()
        # one-word-captcha:
        # If there's only one word, duplicate it.
        response = "#{response} #{response}" unless /\s/.test response
      {challenge, response}
    save: ->
      return unless response = @nodes.input.value.trim()
      @captchas.push
        challenge: @nodes.img.alt
        response:  response
        timeout:   @timeout
      @count()
      @reload()
      $.set 'captchas', @captchas
    clear: ->
      now = Date.now()
      for captcha, i in @captchas
        break if captcha.timeout > now
      return unless i
      @captchas = @captchas[i..]
      @count()
      $.set 'captchas', @captchas
    load: ->
      return unless @nodes.challenge.firstChild
      # -1 minute to give upload some time.
      @timeout  = Date.now() + @lifetime * $.SECOND - $.MINUTE
      challenge = @nodes.challenge.firstChild.value
      @nodes.img.alt = challenge
      @nodes.img.src = "//www.google.com/recaptcha/api/image?c=#{challenge}"
      @nodes.input.value = null
      @clear()
    count: ->
      count = @captchas.length
      @nodes.input.placeholder = switch count
        when 0
          'Verification (Shift + Enter to cache)'
        when 1
          'Verification (1 cached captcha)'
        else
          "Verification (#{count} cached captchas)"
      @nodes.input.alt = count # For XTRM RICE.
    reload: (focus) ->
      # the 't' argument prevents the input from being focused
      $.globalEval 'Recaptcha.reload("t")'
      # Focus if we meant to.
      @nodes.input.focus() if focus
    keydown: (e) ->
      if e.keyCode is 8 and not @nodes.input.value
        @reload()
      else if e.keyCode is 13 and e.shiftKey
        @save()
      else
        return
      e.preventDefault()

  generatePostableThreadsList: ->
    return unless QR.nodes
    list    = QR.nodes.thread
    options = [list.firstChild]
    for thread of g.BOARD.threads
      options.push $.el 'option',
        value: thread
        textContent: "Thread No.#{thread}"
    val = list.value
    $.rmAll list
    $.add list, options
    list.value = val
    return unless list.value
    # Fix the value if the option disappeared.
    list.value = if g.VIEW is 'thread'
      g.THREADID
    else
      'new'

  dialog: ->
    dialog = UI.dialog 'qr', 'top:0;right:0;', <%= importHTML('Posting/QR') %>

    QR.nodes = nodes =
      el:         dialog
      move:       $ '.move',             dialog
      autohide:   $ '#autohide',         dialog
      thread:     $ 'select',            dialog
      close:      $ '.close',            dialog
      form:       $ 'form',              dialog
      dumpButton: $ '#dump-button',      dialog
      name:       $ '[data-name=name]',  dialog
      email:      $ '[data-name=email]', dialog
      sub:        $ '[data-name=sub]',   dialog
      com:        $ '[data-name=com]',   dialog
      dumpList:   $ '#dump-list',        dialog
      addPost:    $ '#add-post',         dialog
      charCount:  $ '#char-count',       dialog
      fileSubmit: $ '#file-n-submit',    dialog
      fileButton: $ '#qr-file-button',   dialog
      filename:   $ '#qr-filename',      dialog
      filesize:   $ '#qr-filesize',      dialog
      fileRM:     $ '#qr-filerm',        dialog
      spoiler:    $ '#qr-file-spoiler',  dialog
      status:     $ '[type=submit]',     dialog
      fileInput:  $ '[type=file]',       dialog

    if Conf['Tab to Choose Files First']
      $.add nodes.fileSubmit, nodes.status

    # Allow only this board's supported files.
    mimeTypes = $('ul.rules > li').textContent.trim().match(/: (.+)/)[1].toLowerCase().replace /\w+/g, (type) ->
      switch type
        when 'jpg'
          'image/jpeg'
        when 'pdf'
          'application/pdf'
        when 'swf'
          'application/x-shockwave-flash'
        else
          "image/#{type}"
    QR.mimeTypes = mimeTypes.split ', '
    # Add empty mimeType to avoid errors with URLs selected in Window's file dialog.
    QR.mimeTypes.push ''
    nodes.fileInput.max = $('input[name=MAX_FILE_SIZE]').value

    QR.spoiler = !!$ 'input[name=spoiler]'
    nodes.spoiler.hidden = !QR.spoiler

    if g.BOARD.ID is 'f'
      nodes.flashTag = $.el 'select',
        name: 'filetag'
        innerHTML: """
          <option value=0>Hentai</option>
          <option value=6>Porn</option>
          <option value=1>Japanese</option>
          <option value=2>Anime</option>
          <option value=3>Game</option>
          <option value=5>Loop</option>
          <option value=4 selected>Other</option>
        """
      nodes.flashTag.dataset.default = '4'
      $.add nodes.form, nodes.flashTag
    if flagSelector = $ '.flagSelector'
      nodes.flag = flagSelector.cloneNode true
      nodes.flag.dataset.name    = 'flag'
      nodes.flag.dataset.default = '0'
      $.add nodes.form, nodes.flag

    <% if (type === 'userscript') { %>
    # XXX Firefox lacks focusin/focusout support.
    for elm in $$ '*', QR.nodes.el
      $.on elm, 'blur',  QR.focusout
      $.on elm, 'focus', QR.focusin
    <% } %>
    $.on dialog, 'focusin',  QR.focusin
    $.on dialog, 'focusout', QR.focusout
    $.on nodes.fileButton, 'click',  QR.openFileInput
    $.on nodes.autohide,   'change', QR.toggleHide
    $.on nodes.close,      'click',  QR.close
    $.on nodes.dumpButton, 'click',  -> nodes.el.classList.toggle 'dump'
    $.on nodes.addPost,    'click',  -> new QR.post true
    $.on nodes.form,       'submit', QR.submit
    $.on nodes.fileRM,     'click',  -> QR.selected.rmFile()
    $.on nodes.spoiler,    'change', -> QR.selected.nodes.spoiler.click()
    $.on nodes.fileInput,  'change', QR.handleFiles
    # save selected post's data
    save = -> QR.selected.save @
    for name in ['thread', 'name', 'email', 'sub', 'com', 'filename', 'flag']
      continue unless node = nodes[name]
      event = if node.nodeName is 'SELECT' then 'change' else 'input'
      $.on nodes[name], event, save

    <% if (type === 'userscript') { %>
    if Conf['Remember QR Size']
      $.get 'QR Size', '', (item) ->
        nodes.com.style.cssText = item['QR Size']
      $.on nodes.com, 'mouseup', (e) ->
        return if e.button isnt 0
        $.set 'QR Size', @style.cssText
    <% } %>

    QR.generatePostableThreadsList()
    QR.persona.init()
    new QR.post true
    QR.status()
    QR.cooldown.init()
    QR.captcha.init()
    $.add d.body, dialog

    # Create a custom event when the QR dialog is first initialized.
    # Use it to extend the QR's functionalities, or for XTRM RICE.
    $.event 'QRDialogCreation', null, dialog

  preSubmitHooks: []
  submit: (e) ->
    e?.preventDefault()

    if QR.req
      QR.abort()
      return

    if QR.cooldown.seconds
      QR.cooldown.auto = !QR.cooldown.auto
      QR.status()
      return

    post = QR.posts[0]
    post.forceSave()
    if g.BOARD.ID is 'f'
      filetag = QR.nodes.flashTag.value
    threadID = post.thread
    thread = g.BOARD.threads[threadID]

    # prevent errors
    if threadID is 'new'
      threadID = null
      if g.BOARD.ID is 'vg' and !post.sub
        err = 'New threads require a subject.'
      else unless post.file or textOnly = !!$ 'input[name=textonly]', $.id 'postForm'
        err = 'No file selected.'
    else if g.BOARD.threads[threadID].isClosed
      err = 'You can\'t reply to this thread anymore.'
    else unless post.com or post.file
      err = 'No file selected.'
    else if post.file and thread.fileLimit
      err = 'Max limit of image replies has been reached.'
    else for hook in QR.preSubmitHooks
      if err = hook post, thread
        break

    if QR.captcha.isEnabled and !err
      {challenge, response} = QR.captcha.getOne()
      err = 'No valid captcha.' unless response

    QR.cleanNotifications()
    if err
      # stop auto-posting
      QR.cooldown.auto = false
      QR.status()
      QR.error err
      return

    # Enable auto-posting if we have stuff to post, disable it otherwise.
    QR.cooldown.auto = QR.posts.length > 1
    if Conf['Auto-Hide QR'] and !QR.cooldown.auto
      QR.hide()
    if !QR.cooldown.auto and $.x 'ancestor::div[@id="qr"]', d.activeElement
      # Unfocus the focused element if it is one within the QR and we're not auto-posting.
      d.activeElement.blur()

    post.lock()

    formData =
      resto:    threadID
      name:     post.name
      email:    post.email
      sub:      post.sub
      com:      post.com
      upfile:   post.file
      filetag:  filetag
      spoiler:  post.spoiler
      flag:     post.flag
      textonly: textOnly
      mode:     'regist'
      pwd:      QR.persona.pwd
      recaptcha_challenge_field: challenge
      recaptcha_response_field:  response

    options =
      responseType: 'document'
      withCredentials: true
      onload: QR.response
      onerror: ->
        # Connection error, or
        # www.4chan.org/banned
        delete QR.req
        post.unlock()
        QR.cooldown.auto = false
        QR.status()
        QR.error $.el 'span',
          innerHTML: """
          Connection error. You may have been <a href=//www.4chan.org/banned target=_blank>banned</a>.
          [<a href="https://github.com/MayhemYDG/4chan-x/wiki/FAQ#what-does-connection-error-you-may-have-been-banned-mean" target=_blank>FAQ</a>]
          """
    extra =
      form: $.formData formData
      upCallbacks:
        onload: ->
          # Upload done, waiting for server response.
          QR.req.isUploadFinished = true
          QR.req.uploadEndTime    = Date.now()
          QR.req.progress = '...'
          QR.status()
        onprogress: (e) ->
          # Uploading...
          QR.req.progress = "#{Math.round e.loaded / e.total * 100}%"
          QR.status()

    QR.req = $.ajax $.id('postForm').parentNode.action, options, extra
    # Starting to upload might take some time.
    # Provide some feedback that we're starting to submit.
    QR.req.uploadStartTime = Date.now()
    QR.req.progress = '...'
    QR.status()

  response: ->
    {req} = QR
    delete QR.req

    post = QR.posts[0]
    post.unlock()

    resDoc  = req.response
    if ban  = $ '.banType', resDoc # banned/warning
      board = $('.board', resDoc).innerHTML
      err   = $.el 'span', innerHTML:
        if ban.textContent.toLowerCase() is 'banned'
          """
          You are banned on #{board}! ;_;<br>
          Click <a href=//www.4chan.org/banned target=_blank>here</a> to see the reason.
          """
        else
          """
          You were issued a warning on #{board} as #{$('.nameBlock', resDoc).innerHTML}.<br>
          Reason: #{$('.reason', resDoc).innerHTML}
          """
    else if err = resDoc.getElementById 'errmsg' # error!
      $('a', err)?.target = '_blank' # duplicate image link
    else if resDoc.title isnt 'Post successful!'
      err = 'Connection error with sys.4chan.org.'
    else if req.status isnt 200
      err = "Error #{req.statusText} (#{req.status})"

    if err
      if /captcha|verification/i.test(err.textContent) or err is 'Connection error with sys.4chan.org.'
        # Remove the obnoxious 4chan Pass ad.
        if /mistyped/i.test err.textContent
          err = 'You seem to have mistyped the CAPTCHA.'
        # Enable auto-post if we have some cached captchas.
        QR.cooldown.auto = if QR.captcha.isEnabled
          !!QR.captcha.captchas.length
        else if err is 'Connection error with sys.4chan.org.'
          true
        else
          # Something must've gone terribly wrong if you get captcha errors without captchas.
          # Don't auto-post indefinitely in that case.
          false
        # Too many frequent mistyped captchas will auto-ban you!
        # On connection error, the post most likely didn't go through.
        QR.cooldown.set delay: 2
      else if err.textContent and m = err.textContent.match /wait\s(\d+)\ssecond/i
        QR.cooldown.auto = if QR.captcha.isEnabled
          !!QR.captcha.captchas.length
        else
          true
        QR.cooldown.set delay: m[1]
      else # stop auto-posting
        QR.cooldown.auto = false
      QR.status()
      QR.error err
      return

    h1 = $ 'h1', resDoc
    QR.cleanNotifications()
    QR.notifications.push new Notice 'success', h1.textContent, 5

    QR.persona.set post

    [_, threadID, postID] = h1.nextSibling.textContent.match /thread:(\d+),no:(\d+)/
    postID   = +postID
    threadID = +threadID or postID
    isReply  = threadID isnt postID

    QR.db.set
      boardID: g.BOARD.ID
      threadID: threadID
      postID: postID
      val: true

    # Post/upload confirmed as successful.
    $.event 'QRPostSuccessful', {
      board: g.BOARD
      threadID
      postID
    }
    $.event 'QRPostSuccessful_', {threadID, postID}

    # Enable auto-posting if we have stuff left to post, disable it otherwise.
    postsCount = QR.posts.length - 1
    QR.cooldown.auto = postsCount and isReply
    if QR.cooldown.auto and QR.captcha.isEnabled and (captchasCount = QR.captcha.captchas.length) < 3 and captchasCount < postsCount
      notif = new Notification 'Quick reply warning',
        body: "You are running low on cached captchas. Cache count: #{captchasCount}."
        icon: Favicon.logo
      notif.onclick = ->
        QR.open()
        QR.captcha.nodes.input.focus()
        window.focus()
      notif.onshow = ->
        setTimeout ->
          notif.close()
        , 7 * $.SECOND

    unless Conf['Persistent QR'] or QR.cooldown.auto
      QR.close()
    else
      post.rm()

    QR.cooldown.set {req, post, isReply, threadID}

    URL = if threadID is postID # new thread
      "/#{g.BOARD}/res/#{threadID}"
    else if g.VIEW is 'index' and !QR.cooldown.auto and Conf['Open Post in New Tab'] # replying from the index
      "/#{g.BOARD}/res/#{threadID}#p#{postID}"
    if URL
      if Conf['Open Post in New Tab']
        $.open URL
      else
        window.location = URL

    QR.status()

  abort: ->
    if QR.req and !QR.req.isUploadFinished
      QR.req.abort()
      delete QR.req
      QR.posts[0].unlock()
      QR.cooldown.auto = false
      QR.notifications.push new Notice 'info', 'QR upload aborted.', 5
    QR.status()
