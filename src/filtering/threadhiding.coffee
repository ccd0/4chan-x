ThreadHiding =
  init: ->
    @hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    ThreadHiding.sync()
    return if g.CATALOG
    for thread in $$ '.thread'
      a = $.el 'a',
        className: 'hide_thread_button'
        innerHTML: '<span>[ - ]</span>'
        href: 'javascript:;'
      $.on a, 'click', ->
        ThreadHiding.toggle $.x 'ancestor::div[@class="thread"][1]', @
      $.add $('.op .postInfo', thread), a

      if thread.id[1..] of @hiddenThreads
        ThreadHiding.hide thread
    return

  sync: ->
    hiddenThreadsCatalog = JSON.parse(localStorage.getItem "4chan-hide-t-#{g.BOARD}") or {}
    if g.CATALOG
      for id of @hiddenThreads
        hiddenThreadsCatalog[id] = true
      localStorage.setItem "4chan-hide-t-#{g.BOARD}", JSON.stringify hiddenThreadsCatalog
    else
      for id of hiddenThreadsCatalog
        unless id of @hiddenThreads
          @hiddenThreads[id] = Date.now()
      $.set "hiddenThreads/#{g.BOARD}/", @hiddenThreads

  toggle: (thread) ->
    id = thread.id[1..]
    if thread.hidden or /\bhidden_thread\b/.test thread.firstChild.className
      ThreadHiding.show thread
      delete ThreadHiding.hiddenThreads[id]
    else
      ThreadHiding.hide thread
      ThreadHiding.hiddenThreads[id] = Date.now()
    $.set "hiddenThreads/#{g.BOARD}/", ThreadHiding.hiddenThreads

  hide: (thread) ->
    unless Conf['Show Stubs']
      thread.hidden = true
      thread.nextElementSibling.hidden = true
      return

    return if /\bhidden_thread\b/.test thread.firstChild.className # already hidden once by the filter

    num     = 0
    if span = $ '.summary', thread
      num   = Number span.textContent.match /\d+/
    num    += $$('.opContainer ~ .replyContainer', thread).length
    text    = if num is 1 then '1 reply' else "#{num} replies"
    opInfo  = $('.desktop > .nameBlock', thread).textContent

    stub = $.el 'a',
      className: 'hidden_thread'
      innerHTML: '<span class=hide_thread_button>[ + ]</span>'
      href:      'javascript:;'
    $.on  stub, 'click', ->
      ThreadHiding.toggle @parentElement
    $.add stub, $.tn "#{opInfo} (#{text})"
    if Conf['Menu']
      menuButton = Menu.a.cloneNode true
      $.on menuButton, 'click', Menu.toggle
      $.add stub, [$.tn(' '), menuButton]
    $.prepend thread, stub

  show: (thread) ->
    if stub = $ '.hidden_thread', thread
      $.rm stub
    thread.hidden = false
    thread.nextElementSibling.hidden = false