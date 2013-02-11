UI = (->
  dialog = (id, position, html) ->
    el = d.createElement 'div'
    el.className = 'reply dialog'
    el.innerHTML = html
    el.id        = id
    el.style.cssText = localStorage.getItem("#{g.NAMESPACE}#{id}.position") or position
    move = el.querySelector '.move'
    move.addEventListener 'touchstart', dragstart, false
    move.addEventListener 'mousedown',  dragstart, false
    el


  class Menu
    currentMenu       = null
    lastToggledButton = null

    constructor: (@type) ->
      # Doc here: https://github.com/MayhemYDG/4chan-x/wiki/Menu-API
      $.on d, 'AddMenuEntry', @addEntry.bind @
      @close   = close.bind @
      @entries = []

    makeMenu: ->
      menu = $.el 'div',
        className: 'reply dialog'
        id:        'menu'
        tabIndex:  0
      $.on menu, 'click', (e) -> e.stopPropagation()
      $.on menu, 'keydown', @keybinds.bind @
      menu

    toggle: (e, button, data) ->
      e.preventDefault()
      e.stopPropagation()

      if currentMenu
        # Close if it's already opened.
        # Reopen if we clicked on another button.
        previousButton = lastToggledButton
        @close()
        return if previousButton is button

      return unless @entries.length
      @open button, data

    open: (button, data) ->
      menu = @makeMenu()
      currentMenu       = menu
      lastToggledButton = button

      for entry in @entries
        @insertEntry entry, menu, data

      @focus $ '.entry', menu
      $.on d, 'click', @close
      $.add d.body, menu

      # Position
      mRect   = menu.getBoundingClientRect()
      bRect   = button.getBoundingClientRect()
      bTop    = doc.scrollTop  + d.body.scrollTop  + bRect.top
      bLeft   = doc.scrollLeft + d.body.scrollLeft + bRect.left
      cHeight = doc.clientHeight
      cWidth  = doc.clientWidth
      top =
        if bRect.top + bRect.height + mRect.height < cHeight
          bTop + bRect.height + 2
        else
          bTop - mRect.height - 2
      left =
        if bRect.left + mRect.width < cWidth
          bLeft
        else
          bLeft + bRect.width - mRect.width
      {style} = menu
      style.top  = top  + 'px'
      style.left = left + 'px'

      menu.focus()

    insertEntry: (entry, parent, data) ->
      if typeof entry.open is 'function'
        return unless entry.open data
      $.add parent, entry.el

      return unless entry.subEntries
      if submenu = $ '.submenu', entry.el
        # Reset sub menu, remove irrelevant entries.
        $.rm submenu
      submenu = $.el 'div',
        className: 'reply dialog submenu'
      for subEntry in entry.subEntries
        @insertEntry subEntry, submenu, data
      $.add entry.el, submenu
      return

    close = ->
      $.rm currentMenu
      currentMenu       = null
      lastToggledButton = null
      $.off d, 'click', @close

    keybinds: (e) ->
      entry = $ '.focused', currentMenu
      while subEntry = $ '.focused', entry
        entry = subEntry

      switch e.keyCode
        when 27 # Esc
          lastToggledButton.focus()
          @close()
        when 13, 32 # Enter, Space
          entry.click()
        when 38 # Up
          if next = entry.previousElementSibling
            @focus next
        when 40 # Down
          if next = entry.nextElementSibling
            @focus next
        when 39 # Right
          if (submenu = $ '.submenu', entry) and next = submenu.firstElementChild
            @focus next
        when 37 # Left
          if next = $.x 'parent::*[contains(@class,"submenu")]/parent::*', entry
            @focus next
        else
          return

      e.preventDefault()
      e.stopPropagation()

    focus: (entry) ->
      while focused = $.x 'parent::*/child::*[contains(@class,"focused")]', entry
        $.rmClass focused, 'focused'
      for focused in $$ '.focused', entry
        $.rmClass focused, 'focused'
      $.addClass entry, 'focused'

      # Submenu positioning.
      return unless submenu = $ '.submenu', entry
      sRect   = submenu.getBoundingClientRect()
      eRect   = entry.getBoundingClientRect()
      cHeight = doc.clientHeight
      cWidth  = doc.clientWidth
      if eRect.top + sRect.height < cHeight
        top    = '0px'
        bottom = 'auto'
      else
        top    = 'auto'
        bottom = '0px'
      if eRect.right + sRect.width < cWidth
        left  = '100%'
        right = 'auto'
      else
        left  = 'auto'
        right = '100%'
      {style} = submenu
      style.top    = top
      style.bottom = bottom
      style.left   = left
      style.right  = right

    addEntry: (e) ->
      entry = e.detail
      return if entry.type isnt @type
      @parseEntry entry
      @entries.push entry

    parseEntry: (entry) ->
      {el, subEntries} = entry
      $.addClass el, 'entry'
      $.on el, 'focus mouseover', ((e) ->
        e.stopPropagation()
        @focus el
      ).bind @
      return unless subEntries
      $.addClass el, 'has-submenu'
      for subEntry in subEntries
        @parseEntry subEntry
      return


  dragstart = (e) ->
    # prevent text selection
    e.preventDefault()
    el = @parentNode
    if isTouching = e.type is 'touchstart'
      e = e.changedTouches[e.changedTouches.length - 1]
    # distance from pointer to el edge is constant; calculate it here.
    rect = el.getBoundingClientRect()
    screenHeight = doc.clientHeight
    screenWidth  = doc.clientWidth
    o = {
      id:     el.id
      style:  el.style
      dx:     e.clientX - rect.left
      dy:     e.clientY - rect.top
      height: screenHeight - rect.height
      width:  screenWidth  - rect.width
      screenHeight: screenHeight
      screenWidth:  screenWidth
      isTouching:   isTouching
    }
    if isTouching
      o.identifier = e.identifier
      o.move = touchmove.bind o
      o.up   = touchend.bind  o
      d.addEventListener 'touchmove',   o.move, false
      d.addEventListener 'touchend',    o.up,   false
      d.addEventListener 'touchcancel', o.up,   false
    else # mousedown
      o.move = drag.bind    o
      o.up   = dragend.bind o
      d.addEventListener 'mousemove', o.move, false
      d.addEventListener 'mouseup',   o.up,   false
  touchmove = (e) ->
    for touch in e.changedTouches
      if touch.identifier is @identifier
        drag.call @, touch
        return
  drag = (e) ->
    {clientX, clientY} = e

    left = clientX - @dx
    left =
      if left < 10
        0
      else if @width - left < 10
        null
      else
        left / @screenWidth * 100 + '%'

    top = clientY - @dy
    top =
      if top < 10
        0
      else if @height - top < 10
        null
      else
        top / @screenHeight * 100 + '%'

    right =
      if left is null
        0
      else
        null
    bottom =
      if top is null
        0
      else
        null

    {style} = @
    style.left   = left
    style.right  = right
    style.top    = top
    style.bottom = bottom
  touchend = (e) ->
    for touch in e.changedTouches
      if touch.identifier is @identifier
        dragend.call @
        return
  dragend = ->
    if @isTouching
      d.removeEventListener 'touchmove',   @move, false
      d.removeEventListener 'touchend',    @up,   false
      d.removeEventListener 'touchcancel', @up,   false
    else # mouseup
      d.removeEventListener 'mousemove', @move, false
      d.removeEventListener 'mouseup',   @up,   false
    localStorage.setItem "#{g.NAMESPACE}#{@id}.position", @style.cssText

  hoverstart = (root, el, events, cb) ->
    o = {
      root:   root
      el:     el
      style:  el.style
      cb:     cb
      events: events.split ' '
      clientHeight: doc.clientHeight
      clientWidth:  doc.clientWidth
    }
    o.hover    = hover.bind    o
    o.hoverend = hoverend.bind o
    for event in o.events
      root.addEventListener event,     o.hoverend, false
    root.addEventListener 'mousemove', o.hover,    false
  hover = (e) ->
    height = @el.offsetHeight
    {clientX, clientY} = e

    top = clientY - 120
    top =
      if @clientHeight <= height or top <= 0
        0
      else if top + height >= @clientHeight
        @clientHeight - height
      else
        top

    if clientX <= @clientWidth - 400
      left  = clientX + 45 + 'px'
      right = null
    else
      left  = null
      right = @clientWidth - clientX + 45 + 'px'

    {style} = @
    style.top   = top + 'px'
    style.left  = left
    style.right = right
  hoverend = ->
    @el.parentNode.removeChild @el
    for event in @events
      @root.removeEventListener event,     @hoverend, false
    @root.removeEventListener 'mousemove', @hover,    false
    @cb.call @ if @cb


  return {
    dialog: dialog
    Menu:   Menu
    hover:  hoverstart
  }
)()
