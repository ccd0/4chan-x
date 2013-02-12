Nav =
  # ▲ ▼
  init: ->
    span = $.el 'span'
      id: 'navlinks'
    prev = $.el 'a'
      href: 'javascript:;'
    next = $.el 'a'
      href: 'javascript:;'

    $.on prev, 'click', @prev
    $.on next, 'click', @next

    $.add span, [prev, next]
    $.add d.body, span

  prev: ->
    if g.REPLY
      window.scrollTo 0, 0
    else
      Nav.scroll -1

  next: ->
    if g.REPLY
      window.scrollTo 0, d.body.scrollHeight
    else
      Nav.scroll +1

  getThread: (full) ->
    Nav.threads = $$ '.thread:not(.hidden)'
    for thread, i in Nav.threads
      rect = thread.getBoundingClientRect()
      {bottom} = rect
      if bottom > 0 # We have not scrolled past
        if full
          return [thread, i, rect]
        return thread
    return $ '.board'

  scroll: (delta) ->
    [thread, i, rect] = Nav.getThread true
    {top} = rect

    # unless we're not at the beginning of the current thread
    # (and thus wanting to move to beginning)
    # or we're above the first thread and don't want to skip it
    unless (delta is -1 and Math.ceil(top) < 0) or (delta is +1 and top > 1)
      i += delta

    {top} = Nav.threads[i]?.getBoundingClientRect()
    window.scrollBy 0, top