Menu =
  entries: []
  init: ->
    @a = $.el 'a',
      className: 'menu_button'
      href:      'javascript:;'
      innerHTML: '[<span class=dropmarker></span>]'
    @el = $.el 'div',
      className: 'reply dialog'
      id:        'menu'
      tabIndex:  0
    $.on @el, 'click',   (e) -> e.stopPropagation()
    $.on @el, 'keydown', @keybinds

    # Doc here: https://github.com/MayhemYDG/4chan-x/wiki/Menu-API
    $.on d, 'AddMenuEntry', (e) -> Menu.addEntry e.detail

    Main.callbacks.push @node

  node: (post) ->
    if post.isInlined and !post.isCrosspost
      a = $ '.menu_button', post.el
    else
      a = Menu.a.cloneNode true
      # \u00A0 is nbsp
      $.add $('.postInfo', post.el), [$.tn('\u00A0'), a]
    $.on a, 'click', Menu.toggle

  toggle: (e) ->
    e.preventDefault()
    e.stopPropagation()

    if Menu.el.parentNode
      # Close if it's already opened.
      # Reopen if we clicked on another button.
      {lastOpener} = Menu
      Menu.close()
      return if lastOpener is @

    Menu.lastOpener = @
    post =
      if /\bhidden_thread\b/.test @parentNode.className
        $.x 'ancestor::div[parent::div[@class="board"]]/child::div[contains(@class,"opContainer")]', @
      else
        $.x 'ancestor::div[contains(@class,"postContainer")][1]', @
    Menu.open @, Main.preParse post

  open: (button, post) ->
    {el} = Menu
    # XXX GM/Scriptish require setAttribute
    el.setAttribute 'data-id', post.ID
    el.setAttribute 'data-rootid', post.root.id

    funk = (entry, parent) ->
      {children} = entry
      return unless entry.open post
      $.add parent, entry.el

      return unless children
      if subMenu = $ '.subMenu', entry.el
        # Reset sub menu, remove irrelevant entries.
        $.rm subMenu
      subMenu = $.el 'div',
        className: 'reply dialog subMenu'
      $.add entry.el, subMenu
      for child in children
        funk child, subMenu
      return
    for entry in Menu.entries
      funk entry, el

    Menu.focus $ '.entry', Menu.el
    $.on d, 'click', Menu.close
    $.add d.body, el

    # Position
    mRect = el.getBoundingClientRect()
    bRect = button.getBoundingClientRect()
    bTop  = d.documentElement.scrollTop  + d.body.scrollTop  + bRect.top
    bLeft = d.documentElement.scrollLeft + d.body.scrollLeft + bRect.left
    el.style.top =
      if bRect.top + bRect.height + mRect.height < d.documentElement.clientHeight
        bTop + bRect.height + 2 + 'px'
      else
        bTop - mRect.height - 2 + 'px'
    el.style.left =
      if bRect.left + mRect.width < d.documentElement.clientWidth
        bLeft + 'px'
      else
        bLeft + bRect.width - mRect.width + 'px'

    el.focus()

  close: ->
    el = Menu.el
    $.rm el
    for focused in $$ '.focused.entry', el
      $.rmClass focused, 'focused'
    el.innerHTML = null
    el.removeAttribute 'style'
    delete Menu.lastOpener
    delete Menu.focusedEntry
    $.off d, 'click', Menu.close

  keybinds: (e) ->
    el = Menu.focusedEntry

    switch Keybinds.keyCode(e) or e.keyCode
      when 'Esc'
        Menu.lastOpener.focus()
        Menu.close()
      when 13, 32 # 'Enter', 'Space'
        el.click()
      when 'Up'
        if next = el.previousElementSibling
          Menu.focus next
      when 'Down'
        if next = el.nextElementSibling
          Menu.focus next
      when 'Right'
        if (subMenu = $ '.subMenu', el) and next = subMenu.firstElementChild
          Menu.focus next
      when 'Left'
        if next = $.x 'parent::*[contains(@class,"subMenu")]/parent::*', el
          Menu.focus next
      else
        return

    e.preventDefault()
    e.stopPropagation()

  focus: (el) ->
    if focused = $.x 'parent::*/child::*[contains(@class,"focused")]', el
      $.rmClass focused, 'focused'
    for focused in $$ '.focused', el
      $.rmClass focused, 'focused'
    Menu.focusedEntry = el
    $.addClass el, 'focused'

  addEntry: (entry) ->
    funk = (entry) ->
      {el, children} = entry
      $.addClass el, 'entry'
      $.on el, 'focus mouseover', (e) ->
        e.stopPropagation()
        Menu.focus @
      return unless children
      $.addClass el, 'hasSubMenu'
      for child in children
        funk child
      return
    funk entry
    Menu.entries.push entry