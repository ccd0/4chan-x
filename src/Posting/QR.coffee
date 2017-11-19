QR =
  mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/vnd.adobe.flash.movie', 'application/x-shockwave-flash', 'video/webm']

  validExtension: /\.(jpe?g|png|gif|pdf|swf|webm)$/i

  typeFromExtension:
    'jpg':  'image/jpeg'
    'jpeg': 'image/jpeg'
    'png':  'image/png'
    'gif':  'image/gif'
    'pdf':  'application/pdf'
    'swf':  'application/vnd.adobe.flash.movie'
    'webm': 'video/webm'

  extensionFromType:
    'image/jpeg': 'jpg'
    'image/png': 'png'
    'image/gif': 'gif'
    'application/pdf': 'pdf'
    'application/vnd.adobe.flash.movie': 'swf'
    'application/x-shockwave-flash': 'swf'
    'video/webm': 'webm'

  init: ->
    return unless Conf['Quick Reply']

    @posts = []

    return if g.VIEW is 'archive'

    version = if Conf[if g.VIEW is 'thread' then 'Use Recaptcha v1' else 'Use Recaptcha v1 on Index'] and (Main.jsEnabled or location.protocol is 'https:')
      noscript = location.protocol is 'https:' and (Conf['Force Noscript Captcha for v1'] or not Main.jsEnabled)
      # XXX Frames not yet supported in GM4.
      noscript = false if (info = GM?.info) and info.scriptHandler is 'Greasemonkey' and /^4\./.test(info.version)
      if noscript then 'noscript' else 'v1'
    else
      'v2'
    @captcha = Captcha[version]

    $.on d, '4chanXInitFinished', -> BoardConfig.ready QR.initReady

    Callbacks.Post.push
      name: 'Quick Reply'
      cb:   @node

    @shortcut = sc = $.el 'a',
      className: 'fa fa-comment-o disabled'
      textContent: 'QR'
      title: 'Quick Reply'
      href: 'javascript:;'
    $.on sc, 'click', ->
      return unless QR.postingIsEnabled
      if Conf['Persistent QR'] or !QR.nodes or QR.nodes.el.hidden
        QR.open()
        QR.nodes.com.focus()
      else
        QR.close()

    Header.addShortcut 'qr', sc, 540

  initReady: ->
    QR.postingIsEnabled = !!$.id 'postForm'
    return unless QR.postingIsEnabled

    {config} = g.BOARD
    prop = (key, def) -> +(config[key] ? def)

    QR.min_width  = prop 'min_image_width',  1
    QR.min_height = prop 'min_image_height', 1
    QR.max_width  = QR.max_height = 10000

    QR.max_size       = prop 'max_filesize',      4194304
    QR.max_size_video = prop 'max_webm_filesize', QR.max_size
    QR.max_comment    = prop 'max_comment_chars', 2000

    QR.max_width_video = QR.max_height_video = 2048
    QR.max_duration_video = prop 'max_webm_duration', 120

    QR.forcedAnon = !!config.forced_anon
    QR.spoiler    = !!config.spoilers

    link = $.el 'h1',
      className: "qr-link-container"
    $.extend link, <%= html('<a href="javascript:;" class="qr-link">?{g.VIEW === "thread"}{Reply to Thread}{Start a Thread}</a>') %>

    QR.link = link.firstElementChild
    $.on link.firstChild, 'click', ->
      QR.open()
      QR.nodes.com.focus()

    if g.VIEW is 'thread'
      linkBot = $.el 'div',
        className: "brackets-wrap qr-link-container-bottom"
      $.extend linkBot, <%= html('<a href="javascript:;" class="qr-link-bottom">Reply to Thread</a>') %>

      $.on linkBot.firstElementChild, 'click', ->
        QR.open()
        QR.nodes.com.focus()

      $.prepend navLinksBot, linkBot if (navLinksBot = $ '.navLinksBot')

    origToggle = $.id 'togglePostFormLink'
    $.before origToggle, link
    origToggle.firstElementChild.textContent = 'Original Form'

    $.on d, 'QRGetFile',          QR.getFile
    $.on d, 'QRSetFile',          QR.setFile

    $.on d, 'paste',              QR.paste
    $.on d, 'dragover',           QR.dragOver
    $.on d, 'drop',               QR.dropFile
    $.on d, 'dragstart dragend',  QR.drag

    $.on d, 'IndexRefreshInternal', QR.generatePostableThreadsList
    $.on d, 'ThreadUpdate', QR.statusCheck

    return if !Conf['Persistent QR']
    QR.open()
    QR.hide() if Conf['Auto Hide QR']

  statusCheck: ->
    return unless QR.nodes
    {thread} = QR.posts[0]
    if thread isnt 'new' and g.threads["#{g.BOARD}.#{thread}"].isDead
      QR.abort()
    else
      QR.status()

  node: ->
    $.on @nodes.quote, 'click', QR.quote
    QR.generatePostableThreadsList() if @isFetchedQuote

  open: ->
    if QR.nodes
      QR.captcha.setup() if QR.nodes.el.hidden
      QR.nodes.el.hidden = false
      QR.unhide()
    else
      try
        QR.dialog()
      catch err
        delete QR.nodes
        Main.handleErrors
          message: 'Quick Reply dialog creation crashed.'
          error: err
        return
    $.rmClass QR.shortcut, 'disabled'

  close: ->
    if QR.req
      QR.abort()
      return
    QR.nodes.el.hidden = true
    QR.cleanNotifications()
    QR.blur()
    $.rmClass QR.nodes.el, 'dump'
    $.addClass QR.shortcut, 'disabled'
    new QR.post true
    for post in QR.posts.splice 0, QR.posts.length - 1
      post.delete()
    QR.cooldown.auto = false
    QR.status()
    QR.captcha.destroy()

  focus: ->
    $.queueTask ->
      unless QR.inBubble()
        QR.hasFocus = d.activeElement and QR.nodes.el.contains(d.activeElement)
        QR.nodes.el.classList.toggle 'focus', QR.hasFocus

  inBubble: ->
    bubbles = $$ 'iframe[src^="https://www.google.com/recaptcha/api2/frame"]'
    d.activeElement in bubbles or bubbles.some (el) ->
      getComputedStyle(el).visibility isnt 'hidden' and el.getBoundingClientRect().bottom > 0

  hide: ->
    QR.blur()
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

  blur: ->
    d.activeElement.blur() if QR.nodes.el.contains(d.activeElement)

  toggleSJIS: (e) ->
    e.preventDefault()
    Conf['sjisPreview'] = !Conf['sjisPreview']
    $.set 'sjisPreview', Conf['sjisPreview']
    QR.nodes.el.classList.toggle 'sjis-preview', Conf['sjisPreview']

  texPreviewShow: ->
    return QR.texPreviewHide() if $.hasClass QR.nodes.el, 'tex-preview'
    $.addClass QR.nodes.el, 'tex-preview'
    QR.nodes.texPreview.textContent = QR.nodes.com.value
    $.event 'mathjax', null, QR.nodes.texPreview

  texPreviewHide: ->
    $.rmClass QR.nodes.el, 'tex-preview'

  addPost: ->
    wasOpen = (QR.nodes and !QR.nodes.el.hidden)
    QR.open()
    if wasOpen
      $.addClass QR.nodes.el, 'dump'
      new QR.post true
    QR.nodes.com.focus()

  setCustomCooldown: (enabled) ->
    Conf['customCooldownEnabled'] = enabled
    QR.cooldown.customCooldown = enabled
    QR.nodes.customCooldown.classList.toggle 'disabled', !enabled

  toggleCustomCooldown: ->
    enabled = $.hasClass QR.nodes.customCooldown, 'disabled'
    QR.setCustomCooldown enabled
    $.set 'customCooldownEnabled', enabled

  error: (err, focusOverride) ->
    QR.open()
    if typeof err is 'string'
      el = $.tn err
    else
      el = err
      el.removeAttribute 'style'
    notice = new Notice 'warning', el
    QR.notifications.push notice
    unless Header.areNotificationsEnabled
      alert el.textContent if d.hidden and not QR.cooldown.auto
    else if d.hidden or not (focusOverride or d.hasFocus())
      notif = new Notification el.textContent,
        body: el.textContent
        icon: Favicon.logo
      notif.onclick = -> window.focus()
      if $.engine isnt 'gecko'
        # Firefox automatically closes notifications
        # so we can't control the onclose properly.
        notif.onclose = -> notice.close()
        notif.onshow  = ->
          setTimeout ->
            notif.onclose = null
            notif.close()
          , 7 * $.SECOND

  connectionError: ->
    $.el 'span',
      <%= html(
        'Connection error while posting. ' +
        '[<a href="' + meta.faq + '#connection-errors" target="_blank">More info</a>]'
      ) %>

  notifications: []

  cleanNotifications: ->
    for notification in QR.notifications
      notification.close()
    QR.notifications = []

  status: ->
    return unless QR.nodes
    {thread} = QR.posts[0]
    if thread isnt 'new' and g.threads["#{g.BOARD}.#{thread}"].isDead
      value    = 'Dead'
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

  openPost: ->
    QR.open()
    if QR.selected.isLocked
      index = QR.posts.indexOf QR.selected
      (QR.posts[index+1] or new QR.post()).select()
      $.addClass QR.nodes.el, 'dump'
      QR.cooldown.auto = true

  quote: (e) ->
    e?.preventDefault()
    return unless QR.postingIsEnabled
    sel  = d.getSelection()
    post = Get.postFromNode @
    {root} = post.nodes
    postRange = new Range()
    postRange.selectNode root
    text = if post.board.ID is g.BOARD.ID then ">>#{post}\n" else ">>>/#{post.board}/#{post}\n"
    for i in [0...sel.rangeCount]
      range = sel.getRangeAt i
      # Trim range to be fully inside post
      if range.compareBoundaryPoints(Range.START_TO_START, postRange) < 0
        range.setStartBefore root
      if range.compareBoundaryPoints(Range.END_TO_END, postRange) > 0
        range.setEndAfter root

      continue unless range.toString().trim()

      frag  = range.cloneContents()
      ancestor = range.commonAncestorContainer
      # Quoting the insides of a spoiler/code tag.
      if $.x 'ancestor-or-self::*[self::s or contains(@class,"removed-spoiler")]', ancestor
        $.prepend frag, $.tn '[spoiler]'
        $.add     frag, $.tn '[/spoiler]'
      if insideCode = $.x 'ancestor-or-self::pre[contains(@class,"prettyprint")]', ancestor
        $.prepend frag, $.tn '[code]'
        $.add     frag, $.tn '[/code]'
      for node in $$ (if insideCode then 'br' else '.prettyprint br'), frag
        $.replace node, $.tn '\n'
      for node in $$ 'br', frag
        $.replace node, $.tn '\n>' unless node is frag.lastChild
      Post::insertTags frag
      for node in $$ '.linkify[data-original]', frag
        $.replace node, $.tn node.dataset.original
      for node in $$ '.embedder', frag
        $.rm node.previousSibling if node.previousSibling?.nodeValue is ' '
        $.rm node
      text += ">#{frag.textContent.trim()}\n"

    QR.openPost()
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
    count   = QR.nodes.com.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '_').length
    counter.textContent = count
    counter.hidden      = count < QR.max_comment/2
    (if count > QR.max_comment then $.addClass else $.rmClass) counter, 'warning'

  getFile: ->
    $.event 'QRFile', QR.selected?.file

  setFile: (e) ->
    {file, name, source} = e.detail
    file.name   = name   if name?
    file.source = source if source?
    QR.open()
    QR.handleFiles [file]

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
    return unless e.clipboardData.items
    file = null
    score = -1
    for item in e.clipboardData.items when item.kind is 'file' and (file2 = item.getAsFile())
      score2 = 2*(file2.size <= QR.max_size) + (file2.type is 'image/png')
      if score2 > score
        file = file2
        score = score2
    if file
      {type} = file
      blob = new Blob [file], {type}
      pastedname = Conf['pastedname']
      blob.name = "#{pastedname}.#{QR.extensionFromType[type] or 'jpg'}"
      QR.open()
      QR.handleFiles [blob]
      $.addClass QR.nodes.el, 'dump'
    return

  pasteFF: ->
    {pasteArea} = QR.nodes
    return unless pasteArea.childNodes.length
    images = $$ 'img', pasteArea
    $.rmAll pasteArea
    for img in images
      {src} = img
      if m = src.match /data:(image\/(\w+));base64,(.+)/
        bstr = atob m[3]
        arr = new Uint8Array(bstr.length)
        for i in [0...bstr.length]
          arr[i] = bstr.charCodeAt(i)
        blob = new Blob [arr], {type: m[1]}
        pastedname = Conf['pastedname']
        blob.name = "#{pastedname}.#{m[2]}"
        QR.handleFiles [blob]
      else if /^https?:\/\//.test src
        QR.handleUrl src
    return

  handleUrl: (urlDefault) ->
    QR.open()
    QR.selected.preventAutoPost()
    url = prompt 'Enter a URL:', urlDefault
    return if url is null
    QR.nodes.fileButton.focus()
    CrossOrigin.file url, (blob) ->
      if blob and not /^text\//.test blob.type
        QR.handleFiles [blob]
      else
        QR.error "Can't load file."

  handleFiles: (files) ->
    if @ isnt QR # file input
      files  = [@files...]
      @value = null
    return unless files.length
    QR.cleanNotifications()
    for file in files
      QR.handleFile file, files.length
    $.addClass QR.nodes.el, 'dump' unless files.length is 1
    if d.activeElement is QR.nodes.fileButton and $.hasClass QR.nodes.fileSubmit, 'has-file'
      QR.nodes.filename.focus()

  handleFile: (file, nfiles) ->
    isText = /^text\//.test file.type
    if nfiles is 1
      post = QR.selected
    else
      post = QR.posts[QR.posts.length - 1]
      if (if isText then post.com or post.pasting else post.file)
        post = new QR.post()
    post[if isText then 'pasteText' else 'setFile'] file

  openFileInput: ->
    return if QR.nodes.fileButton.disabled
    QR.nodes.fileInput.click()
    QR.nodes.fileButton.focus()

  generatePostableThreadsList: ->
    return unless QR.nodes
    list    = QR.nodes.thread
    options = [list.firstElementChild]
    for thread in g.BOARD.threads.keys
      options.push $.el 'option',
        value: thread
        textContent: "Thread #{thread}"
    val = list.value
    $.rmAll list
    $.add list, options
    list.value = val
    return if list.value is val
    # Fix the value if the option disappeared.
    list.value = if g.VIEW is 'thread'
      g.THREADID
    else
      'new'
    (if g.VIEW is 'thread' then $.addClass else $.rmClass) QR.nodes.el, 'reply-to-thread'

  dialog: ->
    QR.nodes = nodes =
      el: dialog = UI.dialog 'qr',
        <%= readHTML('QuickReply.html') %>

    setNode = (name, query) ->
      nodes[name] = $ query, dialog

    setNode 'move',           '.move'
    setNode 'autohide',       '#autohide'
    setNode 'close',          '.close'
    setNode 'thread',         'select'
    setNode 'form',           'form'
    setNode 'sjisToggle',     '#sjis-toggle'
    setNode 'texButton',      '#tex-preview-button'
    setNode 'name',           '[data-name=name]'
    setNode 'email',          '[data-name=email]'
    setNode 'sub',            '[data-name=sub]'
    setNode 'com',            '[data-name=com]'
    setNode 'charCount',      '#char-count'
    setNode 'texPreview',     '#tex-preview'
    setNode 'dumpList',       '#dump-list'
    setNode 'addPost',        '#add-post'
    setNode 'oekaki',         '.oekaki'
    setNode 'drawButton',     '#qr-draw-button'
    setNode 'fileSubmit',     '#file-n-submit'
    setNode 'fileButton',     '#qr-file-button'
    setNode 'noFile',         '#qr-no-file'
    setNode 'filename',       '#qr-filename'
    setNode 'spoiler',        '#qr-file-spoiler'
    setNode 'oekakiButton',   '#qr-oekaki-button'
    setNode 'fileRM',         '#qr-filerm'
    setNode 'urlButton',      '#url-button'
    setNode 'pasteArea',      '#paste-area'
    setNode 'customCooldown', '#custom-cooldown-button'
    setNode 'dumpButton',     '#dump-button'
    setNode 'status',         '[type=submit]'
    setNode 'flashTag',       '[name=filetag]'
    setNode 'fileInput',      '[type=file]'

    {config} = g.BOARD
    {classList} = QR.nodes.el
    classList.toggle 'forced-anon',  QR.forcedAnon
    classList.toggle 'has-spoiler',  QR.spoiler
    classList.toggle 'has-sjis',     !!config.sjis_tags
    classList.toggle 'has-math',     !!config.math_tags
    classList.toggle 'sjis-preview', !!config.sjis_tags and Conf['sjisPreview']
    classList.toggle 'show-new-thread-option', Conf['Show New Thread Option in Threads']

    if parseInt(Conf['customCooldown'], 10) > 0
      $.addClass QR.nodes.fileSubmit, 'custom-cooldown'
      $.get 'customCooldownEnabled', Conf['customCooldownEnabled'], ({customCooldownEnabled}) ->
        QR.setCustomCooldown customCooldownEnabled
        $.sync 'customCooldownEnabled', QR.setCustomCooldown

    QR.flagsInput()

    $.on nodes.autohide,       'change',    QR.toggleHide
    $.on nodes.close,          'click',     QR.close
    $.on nodes.form,           'submit',    QR.submit
    $.on nodes.sjisToggle,     'click',     QR.toggleSJIS
    $.on nodes.texButton,      'mousedown', QR.texPreviewShow
    $.on nodes.texButton,      'mouseup',   QR.texPreviewHide
    $.on nodes.addPost,        'click',     -> new QR.post true
    $.on nodes.drawButton,     'click',     QR.oekaki.draw
    $.on nodes.fileButton,     'click',     QR.openFileInput
    $.on nodes.noFile,         'click',     QR.openFileInput
    $.on nodes.filename,       'focus',     -> $.addClass @parentNode, 'focus'
    $.on nodes.filename,       'blur',      -> $.rmClass  @parentNode, 'focus'
    $.on nodes.spoiler,        'change',    -> QR.selected.nodes.spoiler.click()
    $.on nodes.oekakiButton,   'click',     QR.oekaki.button
    $.on nodes.fileRM,         'click',     -> QR.selected.rmFile()
    $.on nodes.urlButton,      'click',     -> QR.handleUrl ''
    $.on nodes.customCooldown, 'click',     QR.toggleCustomCooldown
    $.on nodes.dumpButton,     'click',     -> nodes.el.classList.toggle 'dump'
    $.on nodes.fileInput,      'change',    QR.handleFiles

    window.addEventListener 'focus', QR.focus, true
    window.addEventListener 'blur',  QR.focus, true
    # We don't receive blur events from captcha iframe.
    $.on d, 'click', QR.focus

    # XXX Workaround for image pasting in Firefox, obsolete as of v50.
    # https://bugzilla.mozilla.org/show_bug.cgi?id=906420
    if $.engine is 'gecko' and not window.DataTransferItemList
      nodes.pasteArea.hidden = false
    new MutationObserver(QR.pasteFF).observe nodes.pasteArea, {childList: true}

    # save selected post's data
    items = ['thread', 'name', 'email', 'sub', 'com', 'filename', 'flag']
    i = 0
    save = -> QR.selected.save @
    while name = items[i++]
      continue if not (node = nodes[name])
      event = if node.nodeName is 'SELECT' then 'change' else 'input'
      $.on nodes[name], event, save

    # XXX Blink and WebKit treat width and height of <textarea>s as min-width and min-height
    if $.engine is 'gecko' and Conf['Remember QR Size']
      $.get 'QR Size', '', (item) ->
        (nodes.com.style.cssText = item['QR Size'])
      $.on nodes.com, 'mouseup', (e) ->
        return if e.button isnt 0
        $.set 'QR Size', @style.cssText

    QR.generatePostableThreadsList()
    QR.persona.load()
    new QR.post true
    QR.status()
    QR.cooldown.setup()
    QR.captcha.init()

    $.add d.body, dialog
    QR.captcha.setup()
    QR.oekaki.setup()

    # Create a custom event when the QR dialog is first initialized.
    # Use it to extend the QR's functionalities, or for XTRM RICE.
    $.event 'QRDialogCreation', null, dialog

  flags: ->
    select = $.el 'select',
      name:      'flag'
      className: 'flagSelector'

    addFlag = (value, textContent) ->
      $.add select, $.el 'option', {value, textContent}

    addFlag '0', 'Geographic Location'
    for value, textContent of BoardConfig.troll_flags
      addFlag value, textContent

    select

  flagsInput: ->
    {nodes} = QR
    return if not nodes
    if nodes.flag
      $.rm nodes.flag
      delete nodes.flag

    if g.BOARD.ID is 'pol'
      flag = QR.flags()
      flag.dataset.name    = 'flag'
      flag.dataset.default = '0'
      nodes.flag = flag
      $.add nodes.form, flag

  submit: (e) ->
    e?.preventDefault()

    if QR.req
      QR.abort()
      return

    $.forceSync 'cooldowns'
    if QR.cooldown.seconds
      QR.cooldown.auto = !QR.cooldown.auto
      QR.status()
      return

    post = QR.posts[0]
    post.forceSave()
    threadID = post.thread
    thread = g.BOARD.threads[threadID]
    if g.BOARD.ID is 'f' and threadID is 'new'
      filetag = QR.nodes.flashTag.value

    # prevent errors
    if threadID is 'new'
      threadID = null
      if !!g.BOARD.config.require_subject and !post.sub
        err = 'New threads require a subject.'
      else unless !!g.BOARD.config.text_only or post.file
        err = 'No file selected.'
    else if g.BOARD.threads[threadID].isClosed
      err = 'You can\'t reply to this thread anymore.'
    else unless post.com or post.file
      err = 'No comment or file.'
    else if post.file and thread.fileLimit
      err = 'Max limit of image replies has been reached.'

    if g.BOARD.ID is 'r9k' and !post.com?.match(/[a-z-]/i)
      err or= 'Original comment required.'

    if QR.captcha.isEnabled and !err
      captcha = QR.captcha.getOne(!!threadID)
      unless captcha
        err = 'No valid captcha.'
        QR.captcha.setup(!QR.cooldown.auto or d.activeElement is QR.nodes.status)

    QR.cleanNotifications()
    if err
      # stop auto-posting
      QR.cooldown.auto = false
      QR.status()
      QR.error err
      return

    # Enable auto-posting if we have stuff to post, disable it otherwise.
    QR.cooldown.auto = QR.posts.length > 1

    post.lock()

    formData =
      resto:    threadID
      name:     post.name unless QR.forcedAnon
      email:    post.email
      sub:      post.sub unless QR.forcedAnon or threadID
      com:      post.com
      upfile:   post.file
      filetag:  filetag
      spoiler:  post.spoiler
      flag:     post.flag
      mode:     'regist'
      pwd:      QR.persona.getPassword()

    options =
      responseType: 'document'
      withCredentials: true
      onload: QR.response
      onerror: ->
        # On connection error, the post most likely didn't go through.
        # If the post did go through, it should be stopped by the duplicate reply cooldown.
        delete QR.req
        Captcha.cache.save QR.currentCaptcha if QR.currentCaptcha
        delete QR.currentCaptcha
        post.unlock()
        QR.cooldown.auto = true
        QR.cooldown.addDelay post, 2
        QR.status()
        QR.error QR.connectionError()
    extra =
      form: $.formData formData
    if Conf['Show Upload Progress']
      extra.upCallbacks =
        onload: ->
          # Upload done, waiting for server response.
          QR.req.isUploadFinished = true
          QR.req.progress = '...'
          QR.status()
        onprogress: (e) ->
          # Uploading...
          QR.req.progress = "#{Math.round e.loaded / e.total * 100}%"
          QR.status()

    cb = (response) ->
      if response?
        QR.currentCaptcha = response
        if response.challenge?
          extra.form.append 'recaptcha_challenge_field', response.challenge
          extra.form.append 'recaptcha_response_field', response.response
        else
          extra.form.append 'g-recaptcha-response', response.response
      QR.req = $.ajax "https://sys.4chan.org/#{g.BOARD}/post", options, extra
      QR.req.progress = '...'

    if typeof captcha is 'function'
      # Wait for captcha to be verified before submitting post.
      QR.req =
        progress: '...'
        abort: -> cb = null
      captcha (response) ->
        if response
          cb? response
        else
          delete QR.req
          post.unlock()
          QR.cooldown.auto = !!Captcha.cache.getCount()
          QR.status()
    else
      cb captcha

    # Starting to upload might take some time.
    # Provide some feedback that we're starting to submit.
    QR.status()

  response: ->
    {req} = QR
    delete QR.req

    post = QR.posts[0]
    post.unlock()

    resDoc  = req.response
    if (err = resDoc.getElementById 'errmsg') # error!
      $('a', err)?.target = '_blank' # duplicate image link
    else if (connErr = resDoc.title isnt 'Post successful!')
      err = QR.connectionError()
      Captcha.cache.save QR.currentCaptcha if QR.currentCaptcha
    else if req.status isnt 200
      err = "Error #{req.statusText} (#{req.status})"

    delete QR.currentCaptcha

    if err
      if /captcha|verification/i.test(err.textContent) or connErr
        # Remove the obnoxious 4chan Pass ad.
        if /mistyped/i.test err.textContent
          err = 'You mistyped the CAPTCHA, or the CAPTCHA malfunctioned.'
        else if /expired/i.test err.textContent
          err = 'This CAPTCHA is no longer valid because it has expired.'
        # Something must've gone terribly wrong if you get captcha errors without captchas.
        # Don't auto-post indefinitely in that case.
        QR.cooldown.auto = QR.captcha.isEnabled or connErr
        # Too many frequent mistyped captchas will auto-ban you!
        # On connection error, the post most likely didn't go through.
        # If the post did go through, it should be stopped by the duplicate reply cooldown.
        QR.cooldown.addDelay post, 2
      else if err.textContent and (m = err.textContent.match /(?:(\d+)\s+minutes?\s+)?(\d+)\s+second/i) and !/duplicate|hour/i.test(err.textContent)
        QR.cooldown.auto = !/have\s+been\s+muted/i.test(err.textContent)
        seconds = 60 * (+(m[1]||0)) + (+m[2])
        if /muted/i.test err.textContent
          QR.cooldown.addMute seconds
        else
          QR.cooldown.addDelay post, seconds
      else # stop auto-posting
        QR.cooldown.auto = false
      QR.captcha.setup(QR.cooldown.auto and d.activeElement in [QR.nodes.status, d.body])
      QR.status()
      QR.error err
      return

    h1 = $ 'h1', resDoc

    [_, threadID, postID] = h1.nextSibling.textContent.match /thread:(\d+),no:(\d+)/
    postID   = +postID
    threadID = +threadID or postID
    isReply  = threadID isnt postID

    # Post/upload confirmed as successful.
    $.event 'QRPostSuccessful', {
      boardID: g.BOARD.ID
      threadID
      postID
    }
    # XXX deprecated
    $.event 'QRPostSuccessful_', {boardID: g.BOARD.ID, threadID, postID}

    # Enable auto-posting if we have stuff left to post, disable it otherwise.
    postsCount = QR.posts.length - 1
    QR.cooldown.auto = postsCount and isReply

    lastPostToThread = not (do -> return true for p in QR.posts[1..] when p.thread is post.thread)

    if postsCount
      post.rm()
      QR.captcha.setup(d.activeElement is QR.nodes.status)
    else if Conf['Persistent QR']
      post.rm()
      if Conf['Auto Hide QR']
        QR.hide()
      else
        QR.blur()
    else
      QR.close()

    QR.cleanNotifications()
    if Conf['Posting Success Notifications']
      QR.notifications.push new Notice 'success', h1.textContent, 5

    QR.cooldown.add threadID, postID

    URL = if threadID is postID then ( # new thread
      "#{window.location.origin}/#{g.BOARD}/thread/#{threadID}"
    ) else if threadID isnt g.THREADID and lastPostToThread and Conf['Open Post in New Tab'] then ( # replying from the index or a different thread
      "#{window.location.origin}/#{g.BOARD}/thread/#{threadID}#p#{postID}"
    ) else undefined

    if URL
      open = if Conf['Open Post in New Tab'] or postsCount
        -> $.open URL
      else
        -> window.location = URL

      if threadID is postID
        # XXX 4chan sometimes responds before the thread exists.
        QR.waitForThread URL, open
      else
        open()

    QR.status()

  waitForThread: (url, cb) ->
    attempts = 0
    check = ->
      $.ajax url,
        onloadend: ->
          attempts++
          if attempts >= 6 or @status is 200
            cb()
          else
            setTimeout check, attempts * $.SECOND
      ,
        type: 'HEAD'
    check()

  abort: ->
    if QR.req and !QR.req.isUploadFinished
      QR.req.abort()
      delete QR.req
      Captcha.cache.save QR.currentCaptcha if QR.currentCaptcha
      delete QR.currentCaptcha
      QR.posts[0].unlock()
      QR.cooldown.auto = false
      QR.notifications.push new Notice 'info', 'QR upload aborted.', 5
    QR.status()
