Nav =
  init: ->
    switch g.VIEW
      when 'index'
        return unless Conf['Index Navigation']
      when 'thread'
        return unless Conf['Reply Navigation']

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
    Header.scrollTo thread
