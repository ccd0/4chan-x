QR =
  init: ->
    return if !Conf['Quick Reply']

    @db = new DataBoard 'yourPosts'

    if Conf['Hide Original Post Form']
      $.addClass doc, 'hide-original-post-form'

    $.on d, '4chanXInitFinished', @initReady

    Post::callbacks.push
      name: 'Quick Reply'
      cb:   @node

  initReady: ->
    $.off d, '4chanXInitFinished', QR.initReady
    QR.postingIsEnabled = !!$.id 'postForm'
    return unless QR.postingIsEnabled

    sc = $.el 'a',
      className: 'qr-shortcut'
      textContent: 'QR'
      title: 'Quick Reply'
      href: 'javascript:;'
    $.on sc, 'click', ->
      $.event 'CloseMenu'
      QR.open()
      QR.nodes.com.focus()
    Header.addShortcut sc

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
    QR.hide() if Conf['Auto-Hide QR']
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
    for i in QR.posts
      QR.posts[0].rm()
    QR.cooldown.auto = false
    QR.status()
  focusin: ->
    $.addClass QR.nodes.el, 'has-focus'
  focusout: ->
    $.rmClass QR.nodes.el, 'has-focus'
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
    alert el.textContent if d.hidden
    QR.notifications.push new Notification 'warning', el
  notifications: []
  cleanNotifications: ->
    for notification in QR.notifications
      notification.close()
    QR.notifications = []

  status: ->
    return unless QR.nodes
    if g.DEAD
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
      for val in arr
        # XXX Firefox displays empty <option>s in the completion list.
        continue unless val
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
        $.set 'QR.persona', persona

  cooldown:
    init: ->
      return unless Conf['Cooldown']
      board = g.BOARD.ID
      QR.cooldown.types =
        thread: switch board
          when 'q' then 86400
          when 'b', 'soc', 'r9k' then 600
          else 300
        sage: if board is 'q' then 600 else 60
        file: if board is 'q' then 300 else 30
        post: if board is 'q' then 150 else 30
      QR.cooldown.upSpd = 0
      QR.cooldown.upSpdAccuracy = .5
      $.get "cooldown.#{board}", {}, (item) ->
        QR.cooldown.cooldowns = item["cooldown.#{board}"]
        QR.cooldown.start()
      $.sync "cooldown.#{board}", QR.cooldown.sync
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
      {req, post, isReply, delay} = data
      start = if req then req.uploadEndTime else Date.now()
      if delay
        cooldown = {delay}
      else
        if post.file
          upSpd = post.file.size / ((req.uploadEndTime - req.uploadStartTime) / $.SECOND)
          QR.cooldown.upSpdAccuracy = ((upSpd > QR.cooldown.upSpd * .9) + QR.cooldown.upSpdAccuracy) / 2
          QR.cooldown.upSpd = upSpd
        isSage  = /sage/i.test post.email
        hasFile = !!post.file
        type = unless isReply
          'thread'
        else if isSage
          'sage'
        else if hasFile
          'file'
        else
          'post'
        cooldown =
          isReply: isReply
          isSage:  isSage
          hasFile: hasFile
          timeout: start + QR.cooldown.types[type] * $.SECOND
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

      setTimeout QR.cooldown.count, $.SECOND

      now     = Date.now()
      post    = QR.posts[0]
      isReply = post.thread isnt 'new'
      isSage  = /sage/i.test post.email
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
          # Only cooldowns relevant to this post can set the seconds value.
          # Unset outdated cooldowns that can no longer impact us.
          type = unless isReply
            'thread'
          else if isSage and cooldown.isSage
            'sage'
          else if hasFile and cooldown.hasFile
            'file'
          else
            'post'
          elapsed = Math.floor (now - start) / $.SECOND
          if elapsed >= 0 # clock changed since then?
            seconds = Math.max seconds, types[type] - elapsed
            if Conf['Cooldown Prediction'] and hasFile and upSpd
              seconds -= Math.floor post.file.size / upSpd * upSpdAccuracy
              seconds  = Math.max seconds, 0
        unless start <= now <= cooldown.timeout
          QR.cooldown.unset start

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

    sel = d.getSelection()
    selectionRoot = $.x 'ancestor::div[contains(@class,"postContainer")][1]', sel.anchorNode
    post = Get.postFromNode @
    {OP} = Get.contextFromLink(@).thread

    text = ">>#{post}\n"
    if (s = sel.toString().trim()) and post.nodes.root is selectionRoot
      # XXX Opera doesn't retain `\n`s?
      s = s.replace /\n/g, '\n>'
      text += ">#{s}\n"

    QR.open()
    if QR.selected.isLocked
      index = QR.posts.indexOf QR.selected
      (QR.posts[index+1] or new QR.post()).select()
      $.addClass QR.nodes.el, 'dump'
      QR.cooldown.auto = true
    {com, thread} = QR.nodes
    thread.value = OP.ID unless com.value

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
    QR.fileInput e.dataTransfer.files
    $.addClass QR.nodes.el, 'dump'
  paste: (e) ->
    files = []
    for item in e.clipboardData.items
      if item.kind is 'file'
        blob = item.getAsFile()
        blob.name  = 'file'
        blob.name += '.' + blob.type.split('/')[1] if blob.type
        files.push blob
    return unless files.length
    QR.open()
    QR.fileInput files
  openFileInput: ->
    QR.nodes.fileInput.click()
  fileInput: (files) ->
    if @ instanceof Element #or files instanceof Event # file input
      files = [@files...]
      QR.nodes.fileInput.value = null # Don't hold the files from being modified on windows
    {length} = files
    return unless length
    max = QR.nodes.fileInput.max
    QR.cleanNotifications()
    # Set or change current post's file.
    if length is 1
      file = files[0]
      if /^text/.test file.type
        QR.selected.pasteText file
      else if file.size > max
        QR.error "File too large (file: #{$.bytesToString file.size}, max: #{$.bytesToString max})."
      else unless file.type in QR.mimeTypes
        QR.error 'Unsupported file type.'
      else
        QR.selected.setFile file
      return
    # Create new posts with these files.
    for file in files
      if /^text/.test file.type
        if (post = QR.posts[QR.posts.length - 1]).com
          post = new QR.post()
        post.pasteText file
      else if file.size > max
        QR.error "#{file.name}: File too large (file: #{$.bytesToString file.size}, max: #{$.bytesToString max})."
      else unless file.type in QR.mimeTypes
        QR.error "#{file.name}: Unsupported file type."
      else
        if (post = QR.posts[QR.posts.length - 1]).file
          post = new QR.post()
        post.setFile file
    $.addClass QR.nodes.el, 'dump'

  posts: []
  post: class
    constructor: (select) ->
      el = $.el 'a',
        className: 'qr-preview'
        draggable: true
        href: 'javascript:;'
        innerHTML: '<a class=remove>×</a><label hidden><input type=checkbox> Spoiler</label><span></span>'

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
      $.on el,             'click',  @select.bind @
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
        @load() if QR.selected is @ # load persona
      @select() if select
      @unlock()
    rm: ->
      $.rm @nodes.el
      index = QR.posts.indexOf @
      if QR.posts.length is 1
        new QR.post true
      else if @ is QR.selected
        (QR.posts[index-1] or QR.posts[index+1]).select()
      QR.posts.splice index, 1
      return unless window.URL
      URL.revokeObjectURL @URL
    lock: (lock=true) ->
      @isLocked = lock
      return unless @ is QR.selected
      for name in ['thread', 'name', 'email', 'sub', 'com', 'fileButton', 'spoiler']
        QR.nodes[name].disabled = lock
      @nodes.rm.style.visibility =
        QR.nodes.fileRM.style.visibility = if lock then 'hidden' else ''
      (if lock then $.off else $.on) QR.nodes.filename.parentNode, 'click', QR.openFileInput
      @nodes.spoiler.disabled = lock
      @nodes.el.draggable = !lock
    unlock: ->
      @lock false
    select: ->
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
      for name in ['thread', 'name', 'email', 'sub', 'com']
        QR.nodes[name].value = @[name] or null
      @showFileData()
      QR.characterCount()
    save: (input) ->
      if input.type is 'checkbox'
        @spoiler = input.checked
        return
      {value} = input
      @[input.dataset.name] = value
      return if input.nodeName isnt 'TEXTAREA'
      @nodes.span.textContent = value
      QR.characterCount()
      # Disable auto-posting if you're typing in the first post
      # during the last 5 seconds of the cooldown.
      if QR.cooldown.auto and @ is QR.posts[0] and 0 < QR.cooldown.seconds <= 5
        QR.cooldown.auto = false
    forceSave: ->
      return unless @ is QR.selected
      # Do this in case people use extensions
      # that do not trigger the `input` event.
      for name in ['thread', 'name', 'email', 'sub', 'com', 'spoiler']
        @save QR.nodes[name]
      return
    setFile: (@file) ->
      @filename           = "#{file.name} (#{$.bytesToString file.size})"
      @nodes.el.title     = @filename
      @nodes.label.hidden = false if QR.spoiler
      URL.revokeObjectURL @URL if window.URL
      @showFileData()
      unless /^image/.test file.type
        @nodes.el.style.backgroundImage = null
        return
      @setThumbnail()
    setThumbnail: (fileURL) ->
      # XXX Opera does not support blob URL
      # Create a redimensioned thumbnail.
      unless window.URL
        unless fileURL
          reader = new FileReader()
          reader.onload = (e) =>
            @setThumbnail e.target.result
          reader.readAsDataURL @file
          return
      else
        fileURL = URL.createObjectURL @file

      img = $.el 'img'

      img.onload = =>
        # Generate thumbnails only if they're really big.
        # Resized pictures through canvases look like ass,
        # so we generate thumbnails `s` times bigger then expected
        # to avoid crappy resized quality.
        s = 90*2
        s *= 3 if @file.type is 'image/gif' # let them animate
        {height, width} = img
        if height < s or width < s
          @URL = fileURL if window.URL
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
        unless window.URL
          @nodes.el.style.backgroundImage = "url(#{cv.toDataURL()})"
          delete @URL
          return
        URL.revokeObjectURL fileURL
        applyBlob = (blob) =>
          @URL = URL.createObjectURL blob
          @nodes.el.style.backgroundImage = "url(#{@URL})"
        if cv.toBlob
          cv.toBlob applyBlob
          return
        data = atob cv.toDataURL().split(',')[1]

        # DataUrl to Binary code from Aeosynth's 4chan X repo
        l = data.length
        ui8a = new Uint8Array l
        for i in  [0...l]
          ui8a[i] = data.charCodeAt i

        applyBlob new Blob [ui8a], type: 'image/png'

      img.src = fileURL
    rmFile: ->
      delete @file
      delete @filename
      @nodes.el.title = null
      @nodes.el.style.backgroundImage = null
      @nodes.label.hidden = true if QR.spoiler
      @showFileData()
      return unless window.URL
      URL.revokeObjectURL @URL
    showFileData: ->
      if @file
        QR.nodes.filename.textContent = @filename
        QR.nodes.filename.title       = @filename
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
    dragStart: ->
      $.addClass @, 'drag'
    dragEnd: ->
      $.rmClass @, 'drag'
    dragEnter: ->
      $.addClass @, 'over'
    dragLeave: ->
      $.rmClass @, 'over'
    dragOver: (e) ->
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    drop: ->
      el = $ '.drag', @parentNode
      $.rmClass el, 'drag' # Opera doesn't fire dragEnd if we drop it on something else
      $.rmClass @,  'over'
      return unless @draggable
      index    = (el) -> [el.parentNode.children...].indexOf el
      oldIndex = index el
      newIndex = index @
      (if oldIndex < newIndex then $.after else $.before) @, el
      post = QR.posts.splice(oldIndex, 1)[0]
      QR.posts.splice newIndex, 0, post

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
        title: 'Reload'
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

      if window.MutationObserver
        observer = new MutationObserver @load.bind @
        observer.observe @nodes.challenge,
          childList: true
      else
        $.on @nodes.challenge, 'DOMNodeInserted', @load.bind @

      $.on imgContainer, 'click',   @reload.bind @
      $.on input,        'keydown', @keydown.bind @
      $.get 'captchas', [], (item) =>
        @sync item['captchas']
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
    sync: (@captchas) ->
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

  dialog: ->
    dialog = UI.dialog 'qr', 'top:0;right:0;', """
    <%= grunt.file.read('html/Posting/QR.html').replace(/>\s+</g, '><').trim() %>
    """

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
    <% if (type !== 'userjs') { %>
    # Opera's accept attribute is fucked up
    nodes.fileInput.accept = "text/*, #{mimeTypes}"
    <% } %>

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
      $.add nodes.form, nodes.flashTag

    # Make a list of threads.
    for thread of g.BOARD.threads
      $.add nodes.thread, $.el 'option',
        value: thread
        textContent: "Thread No.#{thread}"

    <% if (type === 'userscript') { %>
    # XXX Firefox lacks focusin/focusout support.
    for elm in $$ '*', QR.nodes.el
      $.on elm, 'blur',  QR.focusout
      $.on elm, 'focus', QR.focusin
    <% } %>
    $.on dialog,          'focusin',  QR.focusin
    $.on dialog,          'focusout', QR.focusout
    for node in [nodes.fileButton, nodes.filename.parentNode]
      $.on node,           'click',  QR.openFileInput
    $.on nodes.autohide,   'change', QR.toggleHide
    $.on nodes.close,      'click',  QR.close
    $.on nodes.dumpButton, 'click',  -> nodes.el.classList.toggle 'dump'
    $.on nodes.addPost,    'click',  -> new QR.post true
    $.on nodes.form,       'submit', QR.submit
    $.on nodes.fileRM,     'click',  -> QR.selected.rmFile()
    $.on nodes.spoiler,    'change', -> QR.selected.nodes.spoiler.click()
    $.on nodes.fileInput,  'change', QR.fileInput
    # save selected post's data
    for name in ['name', 'email', 'sub', 'com']
      $.on nodes[name], 'input',  -> QR.selected.save @
    $.on nodes.thread,  'change', -> QR.selected.save @

    <% if (type === 'userscript') { %>
    if Conf['Remember QR Size']
      $.get 'QR Size', '', (item) ->
        nodes.com.style.cssText = item['QR Size']
      $.on nodes.com, 'mouseup', (e) ->
        return if e.button isnt 0
        $.set 'QR Size', @style.cssText
    <% } %>

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
      if g.BOARD.ID in ['vg', 'q'] and !post.sub
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

    postData =
      resto:    threadID
      name:     post.name
      email:    post.email
      sub:      post.sub
      com:      post.com
      upfile:   post.file
      filetag:  filetag
      spoiler:  post.spoiler
      textonly: textOnly
      mode:     'regist'
      pwd:      QR.persona.pwd
      recaptcha_challenge_field: challenge
      recaptcha_response_field:  response

    callbacks =
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
    opts =
      cred: true
      form: $.formData postData
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

    QR.req = $.ajax $.id('postForm').parentNode.action, callbacks, opts
    # Starting to upload might take some time.
    # Provide some feedback that we're starting to submit.
    QR.req.uploadStartTime = Date.now()
    QR.req.progress = '...'
    QR.status()

  response: ->
    <% if (type === 'userjs') { %>
    # The upload.onload callback is not called
    # or at least not in time with Opera.
    QR.req.upload.onload()
    <% } %>
    {req} = QR
    delete QR.req

    post = QR.posts[0]
    post.unlock()

    tmpDoc = d.implementation.createHTMLDocument ''
    tmpDoc.documentElement.innerHTML = req.response
    if ban  = $ '.banType', tmpDoc # banned/warning
      board = $('.board', tmpDoc).innerHTML
      err   = $.el 'span', innerHTML:
        if ban.textContent.toLowerCase() is 'banned'
          "You are banned on #{board}! ;_;<br>" +
          "Click <a href=//www.4chan.org/banned target=_blank>here</a> to see the reason."
        else
          "You were issued a warning on #{board} as #{$('.nameBlock', tmpDoc).innerHTML}.<br>" +
          "Reason: #{$('.reason', tmpDoc).innerHTML}"
    else if err = tmpDoc.getElementById 'errmsg' # error!
      $('a', err)?.target = '_blank' # duplicate image link
    else if tmpDoc.title isnt 'Post successful!'
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

    h1 = $ 'h1', tmpDoc
    QR.cleanNotifications()
    QR.notifications.push new Notification 'success', h1.textContent, 5

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

    # Enable auto-posting if we have stuff to post, disable it otherwise.
    QR.cooldown.auto = QR.posts.length > 1 and isReply

    unless Conf['Persistent QR'] or QR.cooldown.auto
      QR.close()
    else
      post.rm()

    QR.cooldown.set {req, post, isReply}

    URL = if threadID is postID # new thread
      "/#{g.BOARD}/res/#{threadID}"
    else if g.VIEW is 'index' and !QR.cooldown.auto and Conf['Open Post in New Tab'] # replying from the index
      "/#{g.BOARD}/res/#{threadID}#p#{postID}"
    (if Conf['Open Post in New Tab'] then $.open else location.assign) URL if URL

    QR.status()

  abort: ->
    if QR.req and !QR.req.isUploadFinished
      QR.req.abort()
      delete QR.req
      QR.posts[0].unlock()
      QR.notifications.push new Notification 'info', 'QR upload aborted.', 5
    QR.status()
