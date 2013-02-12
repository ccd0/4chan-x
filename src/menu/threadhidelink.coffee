ThreadHideLink =
  init: ->
    # If ThreadHiding hasn't been initialized, we have to fake it.
    unless Conf['Thread Hiding']
      $.ready @iterate

    a = $.el 'a',
      className: 'thread_hide_link'
      href: 'javascript:;'
      textContent: 'Hide / Restore Thread'
    $.on a, 'click', ->
      menu   = $.id 'menu'
      thread = $.id "t#{menu.dataset.id}"
      ThreadHiding.toggle thread
    Menu.addEntry
      el: a
      open: (post) ->
        if post.el.classList.contains 'op' then true else false

  iterate: ->
    ThreadHiding.hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    for thread in $$ '.thread'
      if thread.id[1..] of ThreadHiding.hiddenThreads
        ThreadHiding.hide thread
    return