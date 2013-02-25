QR =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Quick Reply']

    Misc.clearThreads "yourPosts.#{g.BOARD}"
    @syncYourPosts()

    if Conf['Hide Original Post Form']
      $.addClass doc, 'hide-original-post-form'

    $.on d, '4chanXInitFinished', @initReady

    Post::callbacks.push
      name: 'Quick Reply'
      cb:   @node

  initReady: ->
    QR.postingIsEnable = !!$.id 'postForm'
    return unless QR.postingIsEnable

    link = $.el 'a',
      className: 'qr-shortcut'
      textContent: 'Quick Reply'
      href: 'javascript:;'
    $.on link, 'click', ->
      $.event 'CloseMenu'
      QR.open()
      QR.resetThreadSelector()
      QR.nodes.com.focus()
    $.event 'AddMenuEntry',
      type: 'header'
      el: link
      order: 10

    $.on d, 'dragover',           QR.dragOver
    $.on d, 'drop',               QR.dropFile
    $.on d, 'dragstart dragend',  QR.drag
    $.on d, 'ThreadUpdate', ->
      QR.abort() if g.DEAD

    QR.persist() if Conf['Persistent QR']

  node: ->
    $.on $('a[title="Quote this post"]', @nodes.info), 'click', QR.quote

  persist: ->
    QR.open()
    QR.hide() if Conf['Auto Hide QR']
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
    QR.nodes.el.hidden = true
    QR.abort()
    d.activeElement.blur()
    $.rmClass QR.nodes.el, 'dump'
    for i in QR.replies
      QR.replies[0].rm()
    QR.cooldown.auto = false
    QR.status()
    if !Conf['Remember Spoiler'] and QR.nodes.spoiler.checked
      QR.nodes.spoiler.click()
    QR.cleanNotifications()
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

  syncYourPosts: (yourPosts) ->
    if yourPosts
      QR.yourPosts = yourPosts
      return
    QR.yourPosts = $.get "yourPosts.#{g.BOARD}", threads: {}
    $.sync "yourPosts.#{g.BOARD}", QR.syncYourPosts

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

  status: (data={}) ->
    return unless QR.nodes
    if g.DEAD
      value    = 404
      disabled = true
      QR.cooldown.auto = false
    value = data.progress or QR.cooldown.seconds or value
    {status} = QR.nodes
    status.value =
      if QR.cooldown.auto
        if value then "Auto #{value}" else 'Auto'
      else
        value or 'Submit'
    status.disabled = disabled or false

  cooldown:
    init: ->
      board = g.BOARD.ID
      QR.cooldown.types =
        thread: switch board
          when 'q' then 86400
          when 'b', 'soc', 'r9k' then 600
          else 300
        sage: if board is 'q' then 600 else 60
        file: if board is 'q' then 300 else 30
        post: if board is 'q' then 60  else 30
      QR.cooldown.cooldowns = $.get "cooldown.#{board}", {}
      QR.cooldown.start()
      $.sync "cooldown.#{board}", QR.cooldown.sync
    start: ->
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
      start = Date.now()
      if data.delay
        cooldown = delay: data.delay
      else
        isSage  = /sage/i.test data.post.email
        hasFile = !!data.post.file
        isReply = data.isReply
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
      $.set "cooldown.#{g.BOARD}", QR.cooldown.cooldowns
    count: ->
      if Object.keys(QR.cooldown.cooldowns).length
        setTimeout QR.cooldown.count, 1000
      else
        $.delete "#{g.BOARD}.cooldown"
        delete QR.cooldown.isCounting
        delete QR.cooldown.seconds
        QR.status()
        return

      isReply = if g.BOARD.ID is 'f'
        g.VIEW is 'thread'
      else
        QR.nodes.thread.value isnt 'new'
      if isReply
        post    = QR.replies[0]
        isSage  = /sage/i.test post.email
        hasFile = !!post.file
      now     = Date.now()
      seconds = null
      {types, cooldowns} = QR.cooldown

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
          elapsed = Math.floor (now - start) / 1000
          if elapsed >= 0 # clock changed since then?
            seconds = Math.max seconds, types[type] - elapsed
        unless start <= now <= cooldown.timeout
          QR.cooldown.unset start

      # Update the status when we change posting type.
      # Don't get stuck at some random number.
      # Don't interfere with progress status updates.
      update = seconds isnt null or !!QR.cooldown.seconds
      QR.cooldown.seconds = seconds
      QR.status() if update
      QR.submit() if seconds is 0 and QR.cooldown.auto

  quote: (e) ->
    e?.preventDefault()
    return unless QR.postingIsEnable
    text = ""

    sel = d.getSelection()
    selectionRoot = $.x 'ancestor::div[contains(@class,"postContainer")][1]', sel.anchorNode
    post = Get.postFromNode @
    {OP} = Get.contextFromLink(@).thread

    if (s = sel.toString().trim()) and post.nodes.root is selectionRoot
      # XXX Opera doesn't retain `\n`s?
      s = s.replace /\n/g, '\n>'
      text += ">#{s}\n"

    text = if !text and post is OP and (!QR.nodes or QR.nodes.el.hidden)
      # Don't quote the OP unless the QR was already opened once.
      ""
    else
      ">>#{post}\n#{text}"

    QR.open()
    ta = QR.nodes.com
    if QR.nodes.thread and !ta.value
      QR.nodes.thread.value = OP.ID

    caretPos = ta.selectionStart
    # Replace selection for text.
    ta.value = ta.value[...caretPos] + text + ta.value[ta.selectionEnd..]
    # Move the caret to the end of the new quote.
    range = caretPos + text.length
    ta.setSelectionRange range, range
    ta.focus()

    # Fire the 'input' event
    $.event 'input', null, ta

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
  fileInput: (files) ->
    unless files instanceof FileList
      files = Array::slice.call @files
    QR.nodes.fileInput.value = null # Don't hold the files from being modified on windows
    {length} = files
    return unless length
    max = QR.nodes.fileInput.max
    QR.cleanNotifications()
    # Set or change current reply's file.
    if length is 1
      file = files[0]
      if file.size > max
        QR.error "File too large (file: #{$.bytesToString file.size}, max: #{$.bytesToString max})."
      else unless file.type in QR.mimeTypes
        QR.error 'Unsupported file type.'
      else
        QR.selected.setFile file
      return
    # Create new replies with these files.
    for file in files
      if file.size > max
        QR.error "#{file.name}: File too large (file: #{$.bytesToString file.size}, max: #{$.bytesToString max})."
      else unless file.type in QR.mimeTypes
        QR.error "#{file.name}: Unsupported file type."
      unless QR.replies[QR.replies.length - 1].file
        # set last reply's file
        QR.replies[QR.replies.length - 1].setFile file
      else
        new QR.reply().setFile file
    $.addClass QR.nodes.el, 'dump'
  resetThreadSelector: ->
    if g.BOARD.ID is 'f'
      if g.VIEW is 'index'
        QR.nodes.flashTag.value = '9999'
    else if g.VIEW is 'thread'
      QR.nodes.thread.value = g.THREAD
    else
      QR.nodes.thread.value = 'new'

  replies: []
  reply: class
    constructor: ->
      # set values, or null, to avoid 'undefined' values in inputs
      prev     = QR.replies[QR.replies.length - 1]
      persona  = $.get 'QR.persona', {}
      @name    = if prev then prev.name else persona.name or null
      @email   = if prev and !/^sage$/.test prev.email then prev.email   else persona.email or null
      @sub     = if prev and Conf['Remember Subject']  then prev.sub     else if Conf['Remember Subject'] then persona.sub else null
      @spoiler = if prev and Conf['Remember Spoiler']  then prev.spoiler else false
      @com = null

      el = $.el 'a',
        className: 'qrpreview'
        draggable: true
        href: 'javascript:;'
        innerHTML: '<a class=remove>×</a><label hidden><input type=checkbox> Spoiler</label><span></span>'

      @nodes =
        el:      el
        rm:      el.firstChild
        label:   $ 'label', el
        spoiler: $ 'input', el
        span:    el.lastChild

      @nodes.spoiler.checked = @spoiler

      $.on el,             'click',  @select.bind @
      $.on @nodes.rm,      'click',  (e) => e.stopPropagation(); @rm()
      $.on @nodes.label,   'click',  (e) => e.stopPropagation()
      $.on @nodes.spoiler, 'change', (e) =>
        @spoiler = e.target.checked
        QR.nodes.spoiler.checked = @spoiler if @ is QR.selected
      $.before QR.nodes.addReply, el

      for event in ['dragStart', 'dragEnter', 'dragLeave', 'dragOver', 'dragEnd', 'drop']
        $.on el, event.toLowerCase(), @[event]

      QR.replies.push @
    setFile: (@file) ->
      @filename           = "#{file.name} (#{$.bytesToString file.size})"
      @nodes.el.title     = @filename
      @nodes.label.hidden = false if QR.spoiler
      @showFileData()
      unless /^image/.test file.type
        @el.style.backgroundImage = null
        return
      # XXX Opera does not support blob URL
      return unless window.URL
      URL.revokeObjectURL @url

      # Create a redimensioned thumbnail.
      fileURL = URL.createObjectURL file
      img     = $.el 'img'

      $.on img, 'load', =>
        # Generate thumbnails only if they're really big.
        # Resized pictures through canvases look like ass,
        # so we generate thumbnails `s` times bigger then expected
        # to avoid crappy resized quality.
        s = 90*3
        if img.height < s or img.width < s
          @url = fileURL
          @nodes.el.style.backgroundImage = "url(#{@url})"
          return
        if img.height <= img.width
          img.width  = s / img.height * img.width
          img.height = s
        else
          img.height = s / img.width  * img.height
          img.width  = s
        c = $.el 'canvas'
        c.height = img.height
        c.width  = img.width
        c.getContext('2d').drawImage img, 0, 0, img.width, img.height
        applyBlob = (blob) =>
          @url = URL.createObjectURL blob
          @nodes.el.style.backgroundImage = "url(#{@url})"
          URL.revokeObjectURL fileURL
        if c.toBlob
          c.toBlob applyBlob
          return
        data = atob c.toDataURL().split(',')[1]

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
      URL.revokeObjectURL @url
    showFileData: (hide) ->
      if @file
        QR.nodes.filename.textContent = @filename
        QR.nodes.filename.title       = @filename
        QR.nodes.spoiler.checked      = @spoiler if QR.spoiler
        $.addClass QR.nodes.fileSubmit, 'has-file'
      else
        $.rmClass QR.nodes.fileSubmit, 'has-file'
    select: ->
      if QR.selected
        QR.selected.nodes.el.id = null
        QR.selected.forceSave()
      QR.selected = @
      @nodes.el.id = 'selected'
      # Scroll the list to center the focused reply.
      rectEl   = @nodes.el.getBoundingClientRect()
      rectList = @nodes.el.parentNode.getBoundingClientRect()
      @nodes.el.parentNode.scrollLeft += rectEl.left + rectEl.width/2 - rectList.left - rectList.width/2
      # Load this reply's values.
      for name in ['name', 'email', 'sub', 'com']
        QR.nodes[name].value = @[name]
      @showFileData()
      QR.characterCount()
    save: (input) ->
      {value} = input
      @[input.dataset.name] = value
      return if input.nodeName isnt 'TEXTAREA'
      @nodes.span.textContent = value
      QR.characterCount()
      # Disable auto-posting if you're typing in the first reply
      # during the last 5 seconds of the cooldown.
      if QR.cooldown.auto and @ is QR.replies[0] and 0 < QR.cooldown.seconds <= 5
        QR.cooldown.auto = false
    forceSave: ->
      # Do this in case people use extensions
      # that do not trigger the `input` event.
      for name in ['name', 'email', 'sub', 'com']
        @save QR.nodes[name]
      return
    dragStart: ->
      $.addClass @, 'drag'
    dragEnter: ->
      $.addClass @, 'over'
    dragLeave: ->
      $.rmClass @, 'over'
    dragOver: (e) ->
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    drop: ->
      el    = $ '.drag', @parentNode
      index = (el) -> Array::slice.call(el.parentNode.children).indexOf el
      oldIndex = index el
      newIndex = index @
      if oldIndex < newIndex
        $.after  @, el
      else
        $.before @, el
      reply = QR.replies.splice(oldIndex, 1)[0]
      QR.replies.splice newIndex, 0, reply
    dragEnd: ->
      $.rmClass @, 'drag'
      if el = $ '.over', @parentNode
        $.rmClass el, 'over'
    rm: ->
      $.rm @nodes.el
      index = QR.replies.indexOf @
      if QR.replies.length is 1
        new QR.reply().select()
      else if @ is QR.selected
        (QR.replies[index-1] or QR.replies[index+1]).select()
      QR.replies.splice index, 1
      return unless window.URL
      URL.revokeObjectURL @url

  captcha:
    init: ->
      return if d.cookie.indexOf('pass_enabled=1') >= 0
      return unless @isEnabled = !!$.id 'captchaFormPart'
      $.asap (-> $.id 'recaptcha_challenge_field_holder'), @ready.bind @
    ready: ->
      imgContainer = $.el 'div',
        className: 'captcha-img'
        title: 'Reload'
        innerHTML: '<img>'
      input = $.el 'input',
        className: 'captcha-input field'
        title: 'Verification'
        autocomplete: 'off'
      @nodes =
        challenge: $.id 'recaptcha_challenge_field_holder'
        img:       imgContainer.firstChild
        input:     input

      if MutationObserver = window.MutationObserver or window.WebKitMutationObserver or window.OMutationObserver
        observer = new MutationObserver @load.bind @
        observer.observe @nodes.challenge,
          childList: true
      else
        $.on @nodes.challenge, 'DOMNodeInserted', @load.bind @

      $.on imgContainer, 'click',   @reload.bind @
      $.on input,        'keydown', @keydown.bind @
      $.sync 'captchas', @sync.bind @
      @sync $.get 'captchas', []
      # start with an uncached captcha
      @reload()

      $.addClass QR.nodes.el, 'has-captcha'
      $.after QR.nodes.com.parentNode, [imgContainer, input]
    sync: (@captchas) ->
      @count()
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
      # -1 minute to give upload some time.
      @timeout  = Date.now() + $.unsafeWindow.RecaptchaState.timeout * $.SECOND - $.MINUTE
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
      $.unsafeWindow.Recaptcha.reload 't'
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
    <div>
      <input type=checkbox id=autohide title=Auto-hide>
      <span class=move></span>
      <a href=javascript:; class=close title=Close>×</a>
    </div>
    <form>
      <div class=persona>
        <input id=dump-button type=button title='Dump list' value=+>
        <input data-name=name  title=Name    placeholder=Name    class=field size=1>
        <input data-name=email title=E-mail  placeholder=E-mail  class=field size=1>
        <input data-name=sub   title=Subject placeholder=Subject class=field size=1>
      </div>
      <div id=dump-list-container>
        <div id=dump-list>
          <a id=addReply href=javascript:; title="Add a reply">+</a>
        </div>
      </div>
      <div class=textarea>
        <textarea data-name=com title=Comment placeholder=Comment class=field></textarea>
        <span id=char-count></span>
      </div>
      <div id=file-n-submit>
        <input id=qr-file-button type=button value='Choose files'>
        <span id=qr-filename-container>
          <span id=qr-no-file>No selected file</span>
          <span id=qr-filename></span>
        </span>
        <a id=qr-filerm href=javascript:; title='Remove file' tabindex=-1>×</a>
        <input type=checkbox id=qr-file-spoiler title='Spoiler image' tabindex=-1>
        <input type=submit>
      </div>
      <input type=file multiple>
    </form>
    """.replace />\s+</g, '><' # get rid of spaces between elements

    QR.nodes = nodes =
      el:         dialog
      move:       $ '.move',             dialog
      autohide:   $ '#autohide',         dialog
      close:      $ '.close',            dialog
      form:       $ 'form',              dialog
      dumpButton: $ '#dump-button',      dialog
      name:       $ '[data-name=name]',  dialog
      email:      $ '[data-name=email]', dialog
      sub:        $ '[data-name=sub]',   dialog
      com:        $ '[data-name=com]',   dialog
      addReply:   $ '#addReply',         dialog
      charCount:  $ '#char-count',       dialog
      fileSubmit: $ '#file-n-submit',    dialog
      fileButton: $ '#qr-file-button',   dialog
      filename:   $ '#qr-filename',      dialog
      fileRM:     $ '#qr-filerm',        dialog
      spoiler:    $ '#qr-file-spoiler',  dialog
      status:     $ '[type=submit]',     dialog
      fileInput:  $ '[type=file]',       dialog

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
    nodes.fileInput.max    = $('input[name=MAX_FILE_SIZE]').value
    nodes.fileInput.accept = mimeTypes if $.engine isnt 'presto' # Opera's accept attribute is fucked up

    QR.spoiler = !!$ 'input[name=spoiler]'
    nodes.spoiler.hidden = !QR.spoiler

    if g.BOARD.ID is 'f'
      if g.VIEW is 'index'
        nodes.flashTag = $('select[name=filetag]').cloneNode true
        $.after nodes.autohide, nodes.flashTag
    else # Make a list of visible threads.
      nodes.thread = $.el 'select',
        title: 'Create a new thread / Reply'
      threads = '<option value=new>New thread</option>'
      for key, thread of g.BOARD.threads
        threads += "<option value=#{thread.ID}>Thread No.#{thread.ID}</option>"
      nodes.thread.innerHTML = threads
      $.after nodes.autohide, nodes.thread
    QR.resetThreadSelector()

    $.on nodes.autohide,   'change', QR.toggleHide
    $.on nodes.close,      'click',  QR.close
    $.on nodes.dumpButton, 'click',  -> nodes.el.classList.toggle 'dump'
    $.on nodes.addReply,   'click',  -> new QR.reply().select()
    $.on nodes.form,       'submit', QR.submit
    $.on nodes.fileButton, 'click',  -> QR.nodes.fileInput.click()
    $.on nodes.fileRM,     'click',  -> QR.selected.rmFile()
    $.on nodes.spoiler,    'change', -> QR.selected.nodes.spoiler.click()
    $.on nodes.fileInput,  'change', QR.fileInput

    new QR.reply().select()
    # save selected reply's data
    for name in ['name', 'email', 'sub', 'com']
      $.on nodes[name], 'input', -> QR.selected.save @

    QR.status()
    QR.cooldown.init()
    QR.captcha.init()
    $.add d.body, dialog

    # Create a custom event when the QR dialog is first initialized.
    # Use it to extend the QR's functionalities, or for XTRM RICE.
    $.event 'QRDialogCreation', null, dialog

  submit: (e) ->
    e?.preventDefault()
    if QR.cooldown.seconds
      QR.cooldown.auto = !QR.cooldown.auto
      QR.status()
      return

    if QR.ajax
      QR.abort()
      return

    reply = QR.replies[0]
    reply.forceSave() if reply is QR.selected
    if g.BOARD.ID is 'f'
      if g.VIEW is 'index'
        filetag  = QR.nodes.flashTag.value
        threadID = 'new'
      else
        threadID = g.THREAD
    else
      threadID = QR.nodes.thread.value

    # prevent errors
    if threadID is 'new'
      threadID = null
      if g.BOARD.ID in ['vg', 'q'] and !reply.sub
        err = 'New threads require a subject.'
      else unless reply.file or textOnly = !!$ 'input[name=textonly]', $.id 'postForm'
        err = 'No file selected.'
      else if g.BOARD.ID is 'f' and filetag is '9999'
        err = 'Invalid tag specified.'
    else if g.BOARD.threads[threadID].isSticky
      err = 'You can\'t reply to this thread anymore.'
    else unless reply.com or reply.file
      err = 'No file selected.'

    if QR.captcha.isEnabled and !err
      {challenge, response} = QR.captcha.getOne()
      err = 'No valid captcha.' unless response

    if err
      # stop auto-posting
      QR.cooldown.auto = false
      QR.status()
      QR.error err
      return
    QR.cleanNotifications()

    # Enable auto-posting if we have stuff to post, disable it otherwise.
    QR.cooldown.auto = QR.replies.length > 1
    if Conf['Auto Hide QR'] and not QR.cooldown.auto
      QR.hide()
    if not QR.cooldown.auto and $.x 'ancestor::div[@id="qr"]', d.activeElement
      # Unfocus the focused element if it is one within the QR and we're not auto-posting.
      d.activeElement.blur()

    # Starting to upload might take some time.
    # Provide some feedback that we're starting to submit.
    QR.status progress: '...'

    post =
      resto:    threadID
      name:     reply.name
      email:    reply.email
      sub:      reply.sub
      com:      reply.com
      upfile:   reply.file
      filetag:  filetag
      spoiler:  reply.spoiler
      textonly: textOnly
      mode:     'regist'
      pwd: if m = d.cookie.match(/4chan_pass=([^;]+)/) then decodeURIComponent m[1] else $.id('postPassword').value
      recaptcha_challenge_field: challenge
      recaptcha_response_field:  response

    callbacks =
      onload: ->
        QR.response @
      onerror: ->
        delete QR.ajax
        # Connection error, or
        # CORS disabled error on www.4chan.org/banned
        QR.cooldown.auto = false
        QR.status()
        QR.error $.el 'a',
          href: '//www.4chan.org/banned',
          target: '_blank',
          textContent: 'Network error.'
    opts =
      form: $.formData post
      upCallbacks:
        onload: ->
          # Upload done, waiting for response.
          QR.status progress: '...'
        onprogress: (e) ->
          # Uploading...
          QR.status progress: "#{Math.round e.loaded / e.total * 100}%"

    QR.ajax = $.ajax $.id('postForm').parentNode.action, callbacks, opts

  response: (req) ->
    delete QR.ajax

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
          err = 'Error: You seem to have mistyped the CAPTCHA.'
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
      else # stop auto-posting
        QR.cooldown.auto = false
      QR.status()
      QR.error err
      return

    h1 = $ 'h1', tmpDoc
    QR.cleanNotifications()
    QR.notifications.push new Notification 'success', h1.textContent, 5

    reply = QR.replies[0]

    persona = $.get 'QR.persona', {}
    persona =
      name:  reply.name
      email: if /^sage$/.test reply.email then persona.email else reply.email
      sub:   if Conf['Remember Subject']  then reply.sub     else null
    $.set 'QR.persona', persona

    [_, threadID, postID] = h1.nextSibling.textContent.match /thread:(\d+),no:(\d+)/
    postID   = +postID
    threadID = +threadID or postID

    (QR.yourPosts.threads[threadID] or= []).push postID
    $.set "yourPosts.#{g.BOARD}", QR.yourPosts

    # Post/upload confirmed as successful.
    $.event 'QRPostSuccessful', {
      board: g.BOARD
      threadID
      postID
    }, QR.nodes.el

    QR.cooldown.set
      post:    reply
      isReply: !!threadID

    # Enable auto-posting if we have stuff to post, disable it otherwise.
    QR.cooldown.auto = QR.replies.length > 1

    if threadID is postID # new thread
      $.open "//boards.4chan.org/#{g.BOARD}/res/#{threadID}"
    else if g.VIEW is 'index' and !QR.cooldown.auto # posting from the index
      $.open "//boards.4chan.org/#{g.BOARD}/res/#{threadID}#p#{postID}"

    if Conf['Persistent QR'] or QR.cooldown.auto
      reply.rm()
    else
      QR.close()

    QR.status()

  abort: ->
    if QR.ajax
      QR.ajax.abort()
      delete QR.ajax
      QR.error 'QR upload aborted.'
    QR.status()
