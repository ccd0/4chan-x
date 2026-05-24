Captcha.t =
  init: ->
    return if d.cookie.indexOf('pass_enabled=1') >= 0
    return if not (@isEnabled = !!$('#t-root') or !$.id('postForm'))

    root = $.el 'div', className: 'captcha-root'
    @nodes = {root}

    $.addClass QR.nodes.el, 'has-captcha', 'captcha-t'
    $.after QR.nodes.com.parentNode, root

  moreNeeded: ->
    return

  getThread: ->
    boardID = g.BOARD.ID
    if QR.posts[0].thread is 'new'
      threadID = '0'
    else
      threadID = '' + QR.posts[0].thread
    {boardID, threadID}

  setup: (focus) ->
    return unless @isEnabled
    @patchFormatter()
    stacked = !!Conf['Stacked TCaptcha']

    if !@nodes.container
      @nodes.container = $.el 'div', className: 'captcha-container'
      $.prepend @nodes.root, @nodes.container
      Captcha.t.currentThread = Captcha.t.getThread()
      $.global ->
        el = document.querySelector '#qr .captcha-container'
        window.TCaptcha.init el, @boardID, +@threadID
        window.TCaptcha4chanXPatch?(@stacked is '1')
        window.TCaptcha.setErrorCb (err) ->
          window.dispatchEvent new CustomEvent('CreateNotification', {detail: {
            type: 'warning',
            content: '' + err
          }})
      ,
        boardID: Captcha.t.currentThread.boardID
        threadID: Captcha.t.currentThread.threadID
        stacked: if stacked then '1' else '0'
    else
      $.global ->
        window.TCaptcha4chanXPatch?(@stacked is '1')
      ,
        stacked: if stacked then '1' else '0'

    if focus
      $('#t-resp').focus()

  destroy: ->
    return unless @isEnabled and @nodes.container
    $.global ->
      window.TCaptcha.destroy()
    $.rm @nodes.container
    delete @nodes.container

  updateThread: ->
    return unless @isEnabled
    {boardID, threadID} = (Captcha.t.currentThread or {})
    newThread = Captcha.t.getThread()
    unless newThread.boardID is boardID and newThread.threadID is threadID
      Captcha.t.destroy()
      Captcha.t.setup()

  getOne: ->
    statusRoot = @nodes.container or d
    response = {}
    if @nodes.container
      for key in ['t-response', 't-challenge']
        response[key] = $("[name='#{key}']", @nodes.container)?.value

    verificationNotRequired = !!(
      (el = $('#t-msg, #t-task', statusRoot)) and
      /Verification not required/i.test(el.textContent)
    )

    return null unless response['t-response'] or verificationNotRequired
    response

  setUsed: ->
    return unless @isEnabled
    if @nodes.container
      $.global ->
        window.TCaptcha.clearChallenge()

  occupied: ->
    !!@nodes.container

  patchFormatter: ->
    return if @formatterPatched
    @formatterPatched = true
    $.global ->
      return unless window.TCaptcha

      selectors =
        image: '.tcaptcha-image'
        container: '#t-task'
        closeNotify: '#notifications .notification.warning a.close'

      styleID = 'fourchanx-tcaptcha-formatter-style'
      unless document.getElementById styleID
        style = document.createElement 'style'
        style.id = styleID
        style.textContent = '''
          #qr.fourchanx-stacked-captcha .tcaptcha-image {
            padding: 0;
            margin: 3px;
            border: none;
            background: none;
            cursor: pointer !important;
          }
          #qr.fourchanx-stacked-captcha .tcaptcha-image img {
            width: 100%;
            height: 100%;
          }
          #qr.fourchanx-stacked-captcha .tcaptcha-image.active {
            outline: 3px solid #00c06f;
          }
          #qr.fourchanx-stacked-captcha #t-desc {
            white-space: pre-line;
            text-align: center;
            font-size: 14px;
            user-select: none;
            width: 100%;
          }
          #qr.fourchanx-stacked-captcha #t-desc img {
            margin: 3px !important;
            max-width: 100%;
            height: auto;
          }
          #qr.fourchanx-stacked-captcha #t-task {
            display: flex;
            flex-wrap: wrap;
            gap: 3px;
            width: 100%;
            justify-content: center;
            margin: 0 auto;
            overflow: auto;
            max-height: 70vh;
            padding: 0 !important;
            height: auto !important;
            white-space: normal !important;
            align-items: normal !important;
            scrollbar-gutter: stable;
            overflow-x: hidden;
            box-sizing: border-box;
          }
          #qr.fourchanx-stacked-captcha #t-load {
            cursor: pointer !important;
          }
          #qr.fourchanx-stacked-captcha #t-next {
            margin-left: auto;
            font-weight: bold;
          }
        '''
        document.head.appendChild style

      unless window.TCaptcha.__fourchanXOriginal
        window.TCaptcha.__fourchanXOriginal =
          setChallenge: window.TCaptcha.setChallenge
          setTaskId: window.TCaptcha.setTaskId
          setTaskNodeContent: window.TCaptcha.setTaskNodeContent
          buildSliderNode: window.TCaptcha.buildSliderNode
          buildNextNode: window.TCaptcha.buildNextNode

      original = window.TCaptcha.__fourchanXOriginal
      currentHighlightIndex = -1
      cachedButtons = []

      updateHighlight = ->
        for btn, index in cachedButtons
          isActive = index is currentHighlightIndex
          btn.classList.toggle 'active', isActive
          btn.scrollIntoView(block: 'nearest') if isActive

      formatDescription = (str) ->
        (
          str
            .replace(/Use the scroll bar below to\s*|,\s*then click next\.?/gi, '')
            .replace(/(?:^|>)\s*([a-z])/i, (m) -> m.toUpperCase())
        ) + '.'

      initializeEventHandler = (container) ->
        return unless container
        return if container.dataset.hasListener
        container.addEventListener 'click', (e) ->
          button = e.target.closest selectors.image
          return unless button and cachedButtons.length > 0
          index = cachedButtons.indexOf button
          submitCaptchaAnswer index if index >= 0
        container.dataset.hasListener = 'true'

      createImageGrid = ->
        container = document.querySelector selectors.container
        task = window.TCaptcha.getCurrentTask?()
        return unless window.TCaptcha.node and container and task

        window.TCaptcha.node.style.height = 'auto'
        window.TCaptcha.node.style.overflow = 'visible'

        descriptionHTML = if task.img
          """<div id="t-desc"><img src="data:image/png;base64,#{task.img}"/></div>"""
        else if task.str
          "<div id=\"t-desc\">#{formatDescription task.str}</div>"
        else
          '<div id="t-desc"></div>'

        imageHTMLs = (task.items or []).map((bitmap) ->
          """<button class="tcaptcha-image"><img src="data:image/png;base64,#{bitmap}"/></button>"""
        ).join('')

        container.innerHTML = descriptionHTML + imageHTMLs
        cachedButtons = Array::slice.call container.querySelectorAll selectors.image
        initializeEventHandler container
        window.TCaptcha.taskNode = container
        currentHighlightIndex = -1

      submitCaptchaAnswer = (imageNumber) ->
        captcha = window.TCaptcha
        return unless captcha?.respNode and captcha.tasks
        totalTasks = captcha.tasks.length - 1
        return if totalTasks < 0 or imageNumber < 0

        captcha.respNode.value += imageNumber
        nextId = captcha.taskId + 1

        if nextId <= totalTasks
          captcha.setTaskId nextId
          createImageGrid()
        else
          captcha.setTaskNodeContent 'Done.'
          cachedButtons = []

      applyStacked = ->
        root = document.querySelector '#qr'
        root?.classList.add 'fourchanx-stacked-captcha'
        window.TCaptcha.__fourchanXStackedEnabled = true

        window.submitCaptchaAnswer = submitCaptchaAnswer

        window.TCaptcha.setChallenge = (challenge) ->
          return original.setChallenge.call(@, challenge) unless challenge?.tasks
          @challengeIdNode.value = challenge.challenge
          @respNode.value = ''
          @tasks = challenge.tasks
          @setTaskId 0
          createImageGrid()

        window.TCaptcha.setTaskId = (index) ->
          @taskId = index
          @nextNode.textContent = "#{index + 1}/#{@tasks.length}"

        window.TCaptcha.setTaskNodeContent = (text) ->
          @taskNode.innerHTML = "<div id=\"t-desc\">#{text}</div>"

        window.TCaptcha.buildSliderNode = ->
          slider = document.createElement 'span'
          slider.id = 't-slider'
          slider.hidden = true
          slider

        window.TCaptcha.buildNextNode = ->
          next = document.createElement 'span'
          next.id = 't-next'
          next

      restoreRegular = ->
        root = document.querySelector '#qr'
        root?.classList.remove 'fourchanx-stacked-captcha'
        window.TCaptcha.__fourchanXStackedEnabled = false
        cachedButtons = []
        currentHighlightIndex = -1
        return unless original
        window.TCaptcha.setChallenge = original.setChallenge if original.setChallenge
        window.TCaptcha.setTaskId = original.setTaskId if original.setTaskId
        window.TCaptcha.setTaskNodeContent = original.setTaskNodeContent if original.setTaskNodeContent
        window.TCaptcha.buildSliderNode = original.buildSliderNode if original.buildSliderNode
        window.TCaptcha.buildNextNode = original.buildNextNode if original.buildNextNode

      window.TCaptcha4chanXPatch = (enabled=true) ->
        return unless window.TCaptcha
        if enabled then applyStacked() else restoreRegular()

      return if window.TCaptcha.__fourchanXKeyHandlerInstalled
      window.TCaptcha.__fourchanXKeyHandlerInstalled = true

      window.addEventListener 'keydown', (e) ->
        return unless window.TCaptcha?.__fourchanXStackedEnabled
        key = e.key or ''
        inQR = (root = document.querySelector('#qr')) and !root.hidden
        return unless inQR and document.querySelector selectors.container
        cachedButtons = cachedButtons.filter (btn) -> document.body.contains btn

        if e.shiftKey and (key is ' ' or key is 'Spacebar' or e.code is 'Space')
          e.preventDefault()
          e.stopImmediatePropagation()
          document.querySelector(selectors.closeNotify)?.closest('.notification')?.remove()

          if cachedButtons.length > 0
            currentHighlightIndex = (currentHighlightIndex + 1) % cachedButtons.length
            updateHighlight()
          else
            window.TCaptcha.onReloadClick?()
          return

        return unless key is 'Enter'
        return unless cachedButtons.length > 0 and currentHighlightIndex >= 0
        e.preventDefault()
        e.stopImmediatePropagation()
        submitCaptchaAnswer currentHighlightIndex
      , true
