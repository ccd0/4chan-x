QR =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Quick Reply']

    if Conf['Hide Original Post Form']
      $.addClass doc, 'hide-original-post-form'

    link = $.el 'a',
      className: 'qr-shortcut'
      textContent: 'Quick Reply'
      href: 'javascript:;'
    $.on link, 'click', ->
      $.event 'CloseMenu'
      QR.open()
      if g.BOARD.ID is 'f'
        if g.VIEW is 'index'
          QR.threadSelector.value = '9999'
      else if g.VIEW is 'thread'
        QR.threadSelector.value = g.THREAD
      else
        QR.threadSelector.value = 'new'
      $('textarea', QR.el).focus()
    $.event 'AddMenuEntry',
      type: 'header'
      el: link
      order: 10

    $.on d, 'dragover',          QR.dragOver
    $.on d, 'drop',              QR.dropFile
    $.on d, 'dragstart dragend', QR.drag
    $.on d, '4chanXInitFinished', ->
      return unless Conf['Persistent QR']
      QR.open()
      QR.hide() if Conf['Auto Hide QR']

    Post::callbacks.push
      name: 'Quick Reply'
      cb:   @node

  node: ->
    $.on $('a[title="Quote this post"]', @nodes.info), 'click', QR.quote

  open: ->
    if QR.el
      QR.el.hidden = false
      QR.unhide()
      return
    try
      QR.dialog()
    catch err
      delete QR.el
      Main.handleErrors
        message: 'Quick Reply dialog creation crashed.'
        error: err
  close: ->
    QR.el.hidden = true
    QR.abort()
    d.activeElement.blur()
    $.rmClass QR.el, 'dump'
    for i in QR.replies
      QR.replies[0].rm()
    QR.cooldown.auto = false
    QR.status()
    QR.resetFileInput()
    if not Conf['Remember Spoiler'] and (spoiler = $.id 'spoiler').checked
      spoiler.click()
    QR.cleanNotification()
  hide: ->
    d.activeElement.blur()
    $.addClass QR.el, 'autohide'
    $.id('autohide').checked = true
  unhide: ->
    $.rmClass QR.el, 'autohide'
    $.id('autohide').checked = false
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
      $('[autocomplete]', QR.el).focus()
    alert el.textContent if d.hidden
    QR.lastNotification = new Notification 'warning', el
  cleanNotification: ->
    QR.lastNotification?.close()
    delete QR.lastNotification

  status: (data={}) ->
    return unless QR.el
    if g.DEAD
      value    = 404
      disabled = true
      QR.cooldown.auto = false
    value = data.progress or QR.cooldown.seconds or value
    {input} = QR.status
    input.value =
      if QR.cooldown.auto
        if value then "Auto #{value}" else 'Auto'
      else
        value or 'Submit'
    input.disabled = disabled or false

  cooldown:
    init: ->
      QR.cooldown.types =
        thread: switch g.BOARD
          when 'q' then 86400
          when 'b', 'soc', 'r9k' then 600
          else 300
        sage: if g.BOARD is 'q' then 600 else 60
        file: if g.BOARD is 'q' then 300 else 30
        post: if g.BOARD is 'q' then 60  else 30
      QR.cooldown.cooldowns = $.get "#{g.BOARD}.cooldown", {}
      QR.cooldown.start()
      $.sync "#{g.BOARD}.cooldown", QR.cooldown.sync
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
        type =
          unless isReply
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
      $.set "#{g.BOARD}.cooldown", QR.cooldown.cooldowns
      QR.cooldown.start()
    unset: (id) ->
      delete QR.cooldown.cooldowns[id]
      $.set "#{g.BOARD}.cooldown", QR.cooldown.cooldowns
    count: ->
      if Object.keys(QR.cooldown.cooldowns).length
        setTimeout QR.cooldown.count, 1000
      else
        $.delete "#{g.BOARD}.cooldown"
        delete QR.cooldown.isCounting
        delete QR.cooldown.seconds
        QR.status()
        return

      isReply =
        if g.BOARD.ID is 'f' and g.VIEW is 'thread'
          true
        else
          QR.threadSelector.value isnt 'new'
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
          type =
            unless isReply
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
    text = ""

    sel = d.getSelection()
    selectionRoot = $.x 'ancestor::div[contains(@class,"postContainer")][1]', sel.anchorNode
    post = Get.postFromRoot $.x 'ancestor::div[contains(@class,"postContainer")][1]', @
    thread = g.BOARD.posts[Get.contextFromLink(@).thread]

    if (s = sel.toString().trim()) and post.nodes.root is selectionRoot
      # XXX Opera doesn't retain `\n`s?
      s = s.replace /\n/g, '\n>'
      text += ">#{s}\n"

    text = if !text and post is thread and (!QR.el or QR.el.hidden)
      # Don't quote the OP unless the QR was already opened once.
      ""
    else
      ">>#{post}\n#{text}"

    QR.open()
    ta = $ 'textarea', QR.el
    if QR.threadSelector and !ta.value and g.BOARD.ID isnt 'f'
      QR.threadSelector.value = thread.ID
    # Make sure we get the correct number, even with XXX censors

    caretPos = ta.selectionStart
    # Replace selection for text.
    ta.value = ta.value[...caretPos] + text + ta.value[ta.selectionEnd..]
    # Move the caret to the end of the new quote.
    range = caretPos + text.length
    ta.setSelectionRange range, range
    ta.focus()

    # Fire the 'input' event
    ta.dispatchEvent new Event 'input'

  characterCount: ->
    counter = QR.charaCounter
    count   = @textLength
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
    QR.fileInput.call e.dataTransfer
    $.addClass QR.el, 'dump'
  fileInput: ->
    QR.cleanNotification()
    # Set or change current reply's file.
    if @files.length is 1
      file = @files[0]
      if file.size > @max
        QR.error 'File too large.'
        QR.resetFileInput()
      else if -1 is QR.mimeTypes.indexOf file.type
        QR.error 'Unsupported file type.'
        QR.resetFileInput()
      else
        QR.selected.setFile file
      return
    # Create new replies with these files.
    for file in @files
      if file.size > @max
        QR.error "File #{file.name} is too large."
        break
      else if -1 is QR.mimeTypes.indexOf file.type
        QR.error "#{file.name}: Unsupported file type."
        break
      unless QR.replies[QR.replies.length - 1].file
        # set last reply's file
        QR.replies[QR.replies.length - 1].setFile file
      else
        new QR.reply().setFile file
    $.addClass QR.el, 'dump'
    QR.resetFileInput() # reset input
  resetFileInput: ->
    $('[type=file]', QR.el).value = null

  replies: []
  reply: class
    constructor: ->
      # set values, or null, to avoid 'undefined' values in inputs
      prev     = QR.replies[QR.replies.length-1]
      persona  = $.get 'QR.persona', {}
      @name    = if prev then prev.name else persona.name or null
      @email   = if prev and !/^sage$/.test prev.email then prev.email   else persona.email or null
      @sub     = if prev and Conf['Remember Subject']  then prev.sub     else if Conf['Remember Subject'] then persona.sub else null
      @spoiler = if prev and Conf['Remember Spoiler']  then prev.spoiler else false
      @com = null

      @el = $.el 'a',
        className: 'qrpreview'
        draggable: true
        href: 'javascript:;'
        innerHTML: '<a class=remove>×</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
      $('input', @el).checked = @spoiler
      $.on @el,               'click',      => @select()
      $.on $('.remove', @el), 'click',  (e) =>
        e.stopPropagation()
        @rm()
      $.on $('label',   @el), 'click',  (e) => e.stopPropagation()
      $.on $('input',   @el), 'change', (e) =>
        @spoiler = e.target.checked
        $.id('spoiler').checked = @spoiler if @el.id is 'selected'
      $.before $('#addReply', QR.el), @el

      $.on @el, 'dragstart', @dragStart
      $.on @el, 'dragenter', @dragEnter
      $.on @el, 'dragleave', @dragLeave
      $.on @el, 'dragover',  @dragOver
      $.on @el, 'dragend',   @dragEnd
      $.on @el, 'drop',      @drop

      QR.replies.push @
    setFile: (@file) ->
      @el.title = "#{file.name} (#{$.bytesToString file.size})"
      $('label', @el).hidden = false if QR.spoiler
      unless /^image/.test file.type
        @el.style.backgroundImage = null
        return
      # XXX Opera does not support window.URL
      return unless url = window.URL or window.webkitURL
      url.revokeObjectURL @url

      # Create a redimensioned thumbnail.
      fileUrl = url.createObjectURL file
      img     = $.el 'img'

      $.on img, 'load', =>
        # Generate thumbnails only if they're really big.
        # Resized pictures through canvases look like ass,
        # so we generate thumbnails `s` times bigger then expected
        # to avoid crappy resized quality.
        s = 90*3
        if img.height < s or img.width < s
          @url = fileUrl
          @el.style.backgroundImage = "url(#{@url})"
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
        # Support for toBlob fucking when?
        data = atob c.toDataURL().split(',')[1]

        # DataUrl to Binary code from Aeosynth's 4chan X repo
        l = data.length
        ui8a = new Uint8Array l
        for i in  [0...l]
          ui8a[i] = data.charCodeAt i

        @url = url.createObjectURL new Blob [ui8a], type: 'image/png'
        @el.style.backgroundImage = "url(#{@url})"
        url.revokeObjectURL? fileUrl

      img.src = fileUrl
    rmFile: ->
      QR.resetFileInput()
      delete @file
      @el.title = null
      @el.style.backgroundImage = null
      $('label', @el).hidden = true if QR.spoiler
      (window.URL or window.webkitURL).revokeObjectURL? @url
    select: ->
      QR.selected?.el.id = null
      QR.selected = @
      @el.id = 'selected'
      # Scroll the list to center the focused reply.
      rectEl   = @el.getBoundingClientRect()
      rectList = @el.parentNode.getBoundingClientRect()
      @el.parentNode.scrollLeft += rectEl.left + rectEl.width/2 - rectList.left - rectList.width/2
      # Load this reply's values.
      for data in ['name', 'email', 'sub', 'com']
        $("[name=#{data}]", QR.el).value = @[data]
      QR.characterCount.call $ 'textarea', QR.el
      $('#spoiler', QR.el).checked = @spoiler
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
      QR.resetFileInput()
      $.rm @el
      index = QR.replies.indexOf @
      if QR.replies.length is 1
        new QR.reply().select()
      else if @el.id is 'selected'
        (QR.replies[index-1] or QR.replies[index+1]).select()
      QR.replies.splice index, 1
      (window.URL or window.webkitURL)?.revokeObjectURL @url

  captcha:
    init: ->
      return if -1 isnt d.cookie.indexOf 'pass_enabled='
      return unless @isEnabled = !!$.id 'captchaFormPart'
      if $.id 'recaptcha_challenge_field_holder'
        @ready()
      else
        @onready = => @ready()
        $.on $.id('recaptcha_widget_div'), 'DOMNodeInserted', @onready
    ready: ->
      if @challenge = $.id 'recaptcha_challenge_field_holder'
        $.off $.id('recaptcha_widget_div'), 'DOMNodeInserted', @onready
        delete @onready
      else
        return
      $.addClass QR.el, 'captcha'
      $.after $('.textarea', QR.el), $.el 'div',
        className: 'captchaimg'
        title: 'Reload'
        innerHTML: '<img>'
      $.after $('.captchaimg', QR.el), $.el 'div',
        className: 'captchainput'
        innerHTML: '<input title=Verification class=field autocomplete=off size=1>'
      @img   = $ '.captchaimg > img', QR.el
      @input = $ '.captchainput > input', QR.el
      $.on @img.parentNode, 'click',              @reload
      $.on @input,          'keydown',            @keydown
      $.on @challenge,      'DOMNodeInserted', => @load()
      $.sync 'captchas', (arr) => @count arr.length
      @count $.get('captchas', []).length
      # start with an uncached captcha
      @reload()
    save: ->
      return unless response = @input.value
      captchas = $.get 'captchas', []
      # Remove old captchas.
      while (captcha = captchas[0]) and captcha.time < Date.now()
        captchas.shift()
      captchas.push
        challenge: @challenge.firstChild.value
        response:  response
        time:      @timeout
      $.set 'captchas', captchas
      @count captchas.length
      @reload()
    load: ->
      # -1 minute to give upload some time.
      @timeout  = Date.now() + $.unsafeWindow.RecaptchaState.timeout * $.SECOND - $.MINUTE
      challenge = @challenge.firstChild.value
      @img.alt  = challenge
      @img.src  = "//www.google.com/recaptcha/api/image?c=#{challenge}"
      @input.value = null
    count: (count) ->
      @input.placeholder = switch count
        when 0
          'Verification (Shift + Enter to cache)'
        when 1
          'Verification (1 cached captcha)'
        else
          "Verification (#{count} cached captchas)"
      @input.alt = count # For XTRM RICE.
    reload: (focus) ->
      # the 't' argument prevents the input from being focused
      $.unsafeWindow.Recaptcha.reload 't'
      # Focus if we meant to.
      QR.captcha.input.focus() if focus
    keydown: (e) ->
      c = QR.captcha
      if e.keyCode is 8 and not c.input.value
        c.reload()
      else if e.keyCode is 13 and e.shiftKey
        c.save()
      else
        return
      e.preventDefault()

  dialog: ->
    QR.el = UI.dialog 'qr', 'top:0;right:0;', """
    <div class=move>Quick Reply <input type=checkbox id=autohide title=Auto-hide><span> <a class=close title=Close>×</a></span></div>
    <form>
      <div class=persona><input id=dump type=button title='Dump list' value=+><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>
      <div id=replies><div id=repliesList><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>
      <div class=textarea><textarea name=com title=Comment placeholder=Comment class=field></textarea><span id=charCount></span></div>
      <div><input type=file title="Shift+Click to remove the selected file." multiple size=16><input type=submit></div>
      <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image</label>
    </form>
    """

    # Allow only this board's supported files.
    mimeTypes = $('ul.rules').firstElementChild.textContent.trim().match(/: (.+)/)[1].toLowerCase().replace /\w+/g, (type) ->
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
    fileInput        = $ 'input[type=file]', QR.el
    fileInput.max    = $('input[name=MAX_FILE_SIZE]').value
    fileInput.accept = mimeTypes if $.engine isnt 'presto' # Opera's accept attribute is fucked up

    QR.spoiler     = !!$ 'input[name=spoiler]'
    spoiler        = $ '#spoilerLabel', QR.el
    spoiler.hidden = !QR.spoiler

    QR.charaCounter = $ '#charCount', QR.el
    ta              = $ 'textarea',    QR.el

    span = $('.move > span', QR.el)

    # Make a list of visible threads.
    if g.BOARD.ID is 'f'
      if g.VIEW is 'index'
        QR.threadSelector = $('select[name=filetag]').cloneNode true
    else
      QR.threadSelector = $.el 'select',
        title: 'Create a new thread / Reply to a thread'
      threads = '<option value=new>New thread</option>'
      for key, thread of g.BOARD.threads
        threads += "<option value=#{thread.ID}>Thread No.#{thread.ID}</option>"
      QR.threadSelector.innerHTML = threads
      if g.VIEW is 'thread'
        QR.threadSelector.value = g.THREAD
    if QR.threadSelector
      $.prepend span, QR.threadSelector
    $.on span,                  'mousedown', (e) -> e.stopPropagation()
    $.on $('#autohide', QR.el), 'change',    QR.toggleHide
    $.on $('.close',    QR.el), 'click',     QR.close
    $.on $('#dump',     QR.el), 'click',     -> QR.el.classList.toggle 'dump'
    $.on $('#addReply', QR.el), 'click',     -> new QR.reply().select()
    $.on $('form',      QR.el), 'submit',    QR.submit
    $.on ta,                    'input',     -> QR.selected.el.lastChild.textContent = @value
    $.on ta,                    'input',     QR.characterCount
    $.on fileInput,             'change',    QR.fileInput
    $.on fileInput,             'click',     (e) -> if e.shiftKey then QR.selected.rmFile() or e.preventDefault()
    $.on spoiler.firstChild,    'change',    -> $('input', QR.selected.el).click()

    new QR.reply().select()
    # save selected reply's data
    for name in ['name', 'email', 'sub', 'com']
      # The input event replaces keyup, change and paste events.
      $.on $("[name=#{name}]", QR.el), 'input', ->
        QR.selected[@name] = @value
        # Disable auto-posting if you're typing in the first reply
        # during the last 5 seconds of the cooldown.
        if QR.cooldown.auto and QR.selected is QR.replies[0] and 0 < QR.cooldown.seconds <= 5
          QR.cooldown.auto = false

    QR.status.input = $ 'input[type=submit]', QR.el
    QR.status()
    QR.cooldown.init()
    QR.captcha.init()
    $.add d.body, QR.el

    # Create a custom event when the QR dialog is first initialized.
    # Use it to extend the QR's functionalities, or for XTRM RICE.
    $.event new CustomEvent 'QRDialogCreation', null, QR.el

  submit: (e) ->
    e?.preventDefault()
    if QR.cooldown.seconds
      QR.cooldown.auto = !QR.cooldown.auto
      QR.status()
      return
    QR.abort()

    reply = QR.replies[0]
    if g.BOARD.ID is 'f' and g.VIEW is 'index'
      filetag  = QR.threadSelector.value
      threadID = 'new'
    else
      threadID = QR.threadSelector.value

    # prevent errors
    if threadID is 'new'
      threadID = null
      if g.BOARD.ID in ['vg', 'q'] and !reply.sub
        err = 'New threads require a subject.'
      else unless reply.file or textOnly = !!$ 'input[name=textonly]', $.id 'postForm'
        err = 'No file selected.'
      else if g.BOARD.ID is 'f' and filetag is '9999'
        err = 'Invalid tag specified.'
    else unless reply.com or reply.file
        err = 'No file selected.'

    if QR.captcha.isEnabled and !err
      # get oldest valid captcha
      captchas = $.get 'captchas', []
      # remove old captchas
      while (captcha = captchas[0]) and captcha.time < Date.now()
        captchas.shift()
      if captcha  = captchas.shift()
        challenge = captcha.challenge
        response  = captcha.response
      else
        challenge   = QR.captcha.img.alt
        if response = QR.captcha.input.value then QR.captcha.reload()
      $.set 'captchas', captchas
      QR.captcha.count captchas.length
      unless response
        err = 'No valid captcha.'
      else
        response = response.trim()
        # one-word-captcha:
        # If there's only one word, duplicate it.
        response = "#{response} #{response}" unless /\s/.test response

    if err
      # stop auto-posting
      QR.cooldown.auto = false
      QR.status()
      QR.error err
      return
    QR.cleanNotification()

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
      pwd: if m = d.cookie.match(/4chan_pass=([^;]+)/) then decodeURIComponent m[1] else $('input[name=pwd]').value
      recaptcha_challenge_field: challenge
      recaptcha_response_field:  response

    callbacks =
      onload: ->
        QR.response @response
      onerror: ->
        # Connection error, or
        # CORS disabled error on www.4chan.org/banned
        QR.cooldown.auto = false
        QR.status()
        QR.error $.el 'a',
          href: '//www.4chan.org/banned',
          target: '_blank',
          textContent: 'Connection error, or you are banned.'
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

  response: (html) ->
    tmpDoc = d.implementation.createHTMLDocument ''
    tmpDoc.documentElement.innerHTML = html
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

    if err
      if /captcha|verification/i.test(err.textContent) or err is 'Connection error with sys.4chan.org.'
        # Remove the obnoxious 4chan Pass ad.
        if /mistyped/i.test err.textContent
          err = 'Error: You seem to have mistyped the CAPTCHA.'
        # Enable auto-post if we have some cached captchas.
        QR.cooldown.auto =
          if QR.captcha.isEnabled
            !!$.get('captchas', []).length
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
    QR.lastNotification = new Notification 'success', h1.textContent, 5

    reply = QR.replies[0]

    persona = $.get 'QR.persona', {}
    persona =
      name:  reply.name
      email: if /^sage$/.test reply.email then persona.email else reply.email
      sub:   if Conf['Remember Subject']  then reply.sub     else null
    $.set 'QR.persona', persona

    [_, threadID, postID] = h1.nextSibling.textContent.match /thread:(\d+),no:(\d+)/

    # Post/upload confirmed as successful.
    $.event new CustomEvent 'QRPostSuccessful', {
      threadID
      postID
    }, QR.el

    QR.cooldown.set
      post:    reply
      isReply: threadID isnt '0'

    # Enable auto-posting if we have stuff to post, disable it otherwise.
    QR.cooldown.auto = QR.replies.length > 1

    if threadID is '0' # new thread
      $.open "/#{g.BOARD}/res/#{postID}"
    else if g.VIEW is 'reply' and !QR.cooldown.auto # posting from the index
      $.open "//boards.4chan.org/#{g.BOARD}/res/#{threadID}#p#{postID}"

    if Conf['Persistent QR'] or QR.cooldown.auto
      reply.rm()
    else
      QR.close()

    QR.status()
    QR.resetFileInput()

  abort: ->
    QR.ajax?.abort()
    delete QR.ajax
    QR.status()
