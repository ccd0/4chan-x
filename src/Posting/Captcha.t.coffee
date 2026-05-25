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
        window.TCaptcha4chanXPatch?(true) if @stacked is '1'
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
      root = document.querySelector '#qr'
      delete root.dataset.fourchanxCaptchaPending if root?.dataset?.fourchanxCaptchaPending?
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
        root = document.querySelector '#qr'
        delete root.dataset.fourchanxCaptchaPending if root?.dataset?.fourchanxCaptchaPending?
        return unless window.TCaptcha?.__fourchanXStackedEnabled
        task = document.querySelector '#t-task'
        return unless task
        if (nextNode = window.TCaptcha?.nextNode or document.querySelector '#t-next')
          nextNode.dataset.fourchanxStatusHidden = '1'
          nextNode.style.visibility = 'hidden'
          nextNode.textContent = ''
        task.classList.remove 'is-success', 'is-error'
        task.classList.add 'fourchanx-stacked-status'
        task.innerHTML = '<div class="fourchanx-stacked-placeholder"><span class="fa fa-th-large" aria-hidden="true"></span><span class="label">Stacked Captcha</span><span class="detail">Click Get Captcha to display captcha images.</span></div>'

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
            min-height: 24px;
            padding: 0 8px;
          }
          #qr.fourchanx-stacked-captcha #t-next {
            display: none !important;
          }
          #qr.fourchanx-stacked-captcha #t-slider {
            display: none !important;
          }
          #qr.fourchanx-stacked-captcha #t-task.fourchanx-stacked-status {
            display: flex;
            flex-direction: column;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 5px;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 0 15px 0 !important;
            overflow: visible !important;
          }
          #qr.fourchanx-stacked-captcha #t-task.fourchanx-stacked-status .fourchanx-stacked-placeholder {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            text-align: center;
            opacity: 0.72;
            transform: none;
            margin: 0;
            user-select: none;
            pointer-events: none;
          }
          #qr.fourchanx-stacked-captcha #t-task.fourchanx-stacked-status .fourchanx-stacked-placeholder .fa {
            font-size: 18px;
          }
          #qr.fourchanx-stacked-captcha #t-task.fourchanx-stacked-status .fourchanx-stacked-placeholder .label {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0;
          }
          #qr.fourchanx-stacked-captcha #t-task.fourchanx-stacked-status.is-success .fourchanx-stacked-placeholder .fa,
          #qr.fourchanx-stacked-captcha #t-task.fourchanx-stacked-status.is-success .fourchanx-stacked-placeholder .label {
            color: #468f3f;
          }
          #qr.fourchanx-stacked-captcha #t-task.fourchanx-stacked-status.is-error .fourchanx-stacked-placeholder .fa,
          #qr.fourchanx-stacked-captcha #t-task.fourchanx-stacked-status.is-error .fourchanx-stacked-placeholder .label {
            color: #b14d4d;
          }
          #qr.fourchanx-stacked-captcha #t-task.fourchanx-stacked-status .fourchanx-stacked-placeholder .detail {
            font-size: 11px;
            opacity: 0.8;
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

      buildStackedSliderNode = ->
        slider = document.createElement 'span'
        slider.id = 't-slider'
        slider.dataset.fourchanxStacked = '1'
        slider.hidden = true
        slider

      ensureStackedSliderNode = ->
        slider = document.querySelector '#t-slider'
        return unless slider
        return if slider.dataset.fourchanxStacked is '1'
        replacement = buildStackedSliderNode()
        slider.parentNode?.replaceChild replacement, slider

      setStackedStatusPlaceholder = (label, detail='', icon='fa-th-large', tone='neutral') ->
        container = document.querySelector selectors.container
        return unless container
        if window.TCaptcha?.node
          window.TCaptcha.node.style.height = 'auto'
          window.TCaptcha.node.style.minHeight = '0'
          window.TCaptcha.node.style.overflow = 'visible'
        if (nextNode = window.TCaptcha?.nextNode or document.querySelector('#t-next'))
          nextNode.dataset.fourchanxStatusHidden = '1'
          nextNode.style.visibility = 'hidden'
          nextNode.textContent = ''
        container.style.height = 'auto'
        container.style.minHeight = '0'
        detailHTML = if detail then "<span class=\"detail\">#{detail}</span>" else ''
        container.classList.remove 'is-success', 'is-error'
        container.classList.add 'fourchanx-stacked-status'
        container.classList.add "is-#{tone}" if tone in ['success', 'error']
        container.innerHTML = "<div class=\"fourchanx-stacked-placeholder\"><span class=\"fa #{icon}\" aria-hidden=\"true\"></span><span class=\"label\">#{label}</span>#{detailHTML}</div>"

      clearStackedStatusPlaceholder = ->
        container = document.querySelector selectors.container
        return unless container
        container.classList.remove 'fourchanx-stacked-status'
        container.classList.remove 'is-success', 'is-error'
        if (nextNode = window.TCaptcha?.nextNode or document.querySelector('#t-next')) and nextNode.dataset.fourchanxStatusHidden is '1'
          nextNode.style.visibility = ''
          delete nextNode.dataset.fourchanxStatusHidden
        placeholder = container.querySelector '.fourchanx-stacked-placeholder'
        placeholder?.parentNode?.removeChild placeholder

      formatDescription = (str) ->
        (
          str
            .replace(/Use the scroll bar below to\s*|,\s*then click next\.?/gi, '')
            .replace(/(?:^|>)\s*([a-z])/i, (m) -> m.toUpperCase())
        ) + '.'

      setStackedStatusFromText = (text) ->
        message = ('' + (text or '')).replace(/\s+/g, ' ').trim()
        unless message
          setStackedStatusPlaceholder 'Stacked Captcha', 'Click Get Captcha to display captcha images.'
          return
        if /verification not required/i.test(message)
          detail = if /^verification not required[.!]?$/i.test(message)
            ''
          else
            'You can submit without solving a new captcha.'
          setStackedStatusPlaceholder 'Verification Not Required', detail, 'fa-check-circle', 'success'
        else if /done\.?$/i.test(message)
          setStackedStatusPlaceholder 'Captcha Completed', '', 'fa-check-circle', 'success'
        else if /expir|error|invalid|fail|incorrect|mistyped/i.test(message)
          setStackedStatusPlaceholder 'Captcha Error', message, 'fa-exclamation-circle', 'error'
        else
          setStackedStatusPlaceholder 'Stacked Captcha', message, 'fa-info-circle', 'neutral'

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
        root = document.querySelector '#qr'
        delete root.dataset.fourchanxCaptchaPending if root?.dataset?.fourchanxCaptchaPending?
        container = document.querySelector selectors.container
        task = window.TCaptcha.getCurrentTask?()
        return unless window.TCaptcha.node and container and task

        clearStackedStatusPlaceholder()
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
          ensureStackedSliderNode()

        window.TCaptcha.setTaskId = (index) ->
          @taskId = index
          @nextNode.textContent = "#{index + 1}/#{@tasks.length}"

        window.TCaptcha.setTaskNodeContent = (text) ->
          clearStackedStatusPlaceholder()
          setStackedStatusFromText text

        window.TCaptcha.buildSliderNode = ->
          buildStackedSliderNode()

        window.TCaptcha.buildNextNode = ->
          next = document.createElement 'span'
          next.id = 't-next'
          next

        ensureStackedSliderNode()
        setStackedStatusPlaceholder 'Stacked Captcha', 'Click Get Captcha to display captcha images.'
        loadButton = document.querySelector '#t-load'
        if loadButton and loadButton.dataset.fourchanxStackedLoadBound isnt '1'
          loadButton.dataset.fourchanxStackedLoadBound = '1'
          loadButton.addEventListener 'click', ->
            root = document.querySelector '#qr'
            root.dataset.fourchanxCaptchaPending = '1' if root?.dataset?
            clearStackedStatusPlaceholder()
        if window.requestAnimationFrame
          window.requestAnimationFrame ensureStackedSliderNode
        else
          setTimeout ensureStackedSliderNode, 0

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
        slider = document.querySelector '#t-slider'
        if slider?.dataset.fourchanxStacked is '1' and original.buildSliderNode and slider.parentNode
          slider.parentNode.replaceChild original.buildSliderNode.call(window.TCaptcha), slider

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
