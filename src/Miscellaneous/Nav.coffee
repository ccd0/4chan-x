Nav =
  init: ->
    switch g.VIEW
      when 'index'
        return unless Conf['Index Navigation']
      when 'thread'
        return unless Conf['Reply Navigation']
      else # catalog
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

  getThread: (full) ->
    if Conf['Bottom header']
      topMargin = 0
    else
      headRect  = Header.toggle.getBoundingClientRect()
      topMargin = headRect.top + headRect.height
    threads = $$('.thread').filter (thread) ->
      thread = Get.threadFromRoot thread
      !(thread.isHidden and !thread.stub)
    for thread, i in threads
      rect = thread.getBoundingClientRect()
      if rect.bottom > topMargin # not scrolled past
        return if full then [threads, thread, i, rect, topMargin] else thread
    return $ '.board'

  scroll: (delta) ->
    [threads, thread, i, rect, topMargin] = Nav.getThread true
    top = rect.top - topMargin

    # unless we're not at the beginning of the current thread
    # (and thus wanting to move to beginning)
    # or we're above the first thread and don't want to skip it
    if (delta is -1 and top > -5) or (delta is +1 and top < 5)
      top = threads[i + delta]?.getBoundingClientRect().top - topMargin

    window.scrollBy 0, top
