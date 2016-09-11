Nav =
  init: ->
    switch g.VIEW
      when 'index'
        return unless Conf['Index Navigation']
      when 'thread'
        return unless Conf['Reply Navigation']
      else
        return

    span = $.el 'span',
      id: 'navlinks'
    prev = $.el 'a',
      textContent: '▲'
      href: 'javascript:;'
    next = $.el 'a',
      textContent: '▼'
      href: 'javascript:;'

    $.on prev, 'click', @prev
    $.on next, 'click', @next

    $.add span, [prev, $.tn(' '), next]
    append = ->
      $.off d, '4chanXInitFinished', append
      $.add d.body, span
    $.on d, '4chanXInitFinished', append

  prev: ->
    if g.VIEW is 'thread'
      window.scrollTo 0, 0
    else
      Nav.scroll -1

  next: ->
    if g.VIEW is 'thread'
      window.scrollTo 0, d.body.scrollHeight
    else
      Nav.scroll +1

  getThread: ->
    for threadRoot in $$ '.thread'
      thread = Get.threadFromRoot threadRoot
      continue if thread.isHidden and !thread.stub
      if Header.getTopOf(threadRoot) >= -threadRoot.getBoundingClientRect().height # not scrolled past
        return threadRoot
    return $ '.board'

  scroll: (delta) ->
    d.activeElement?.blur()
    thread = Nav.getThread()
    axis = if delta is +1
      'following'
    else
      'preceding'
    if next = $.x "#{axis}-sibling::div[contains(@class,'thread') and not(@hidden)][1]", thread
      # Unless we're not at the beginning of the current thread,
      # and thus wanting to move to beginning,
      # or we're above the first thread and don't want to skip it.
      top = Header.getTopOf thread
      thread = next if delta is +1 and top < 5 or delta is -1 and top > -5
    # Add extra space to the end of the page if necessary so that all threads can be selected by keybinds.
    extra = Header.getTopOf(thread) + doc.clientHeight - d.body.getBoundingClientRect().bottom
    d.body.style.marginBottom = "#{extra}px" if extra > 0

    Header.scrollTo thread

    if extra > 0 and !Nav.haveExtra
      Nav.haveExtra = true
      $.on d, 'scroll', Nav.removeExtra

  removeExtra: ->
    extra = doc.clientHeight - d.body.getBoundingClientRect().bottom
    if extra > 0
      d.body.style.marginBottom = "#{extra}px"
    else
      d.body.style.marginBottom = ''
      delete Nav.haveExtra
      $.off d, 'scroll', Nav.removeExtra
