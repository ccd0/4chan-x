UI = do ->
  dialog = (id, position, html) ->
    el = $.el 'div',
      className: 'dialog'
      innerHTML: html
      id: id
    el.style.cssText = position
    $.get "#{id}.position", position, (item) ->
      el.style.cssText = item["#{id}.position"]
    $.on $('.move', el), 'touchstart mousedown', dragstart
    el


  class Menu
    currentMenu       = null
    lastToggledButton = null

    constructor: (@type) ->
      # Doc here: https://github.com/MayhemYDG/4chan-x/wiki/Menu-API
      $.on d, 'AddMenuEntry', @addEntry
      @entries = []

    makeMenu: ->
      menu = $.el 'div',
        className: 'dialog'
        id:        'menu'
        tabIndex:  0
      $.on menu, 'click', (e) -> e.stopPropagation()
      $.on menu, 'keydown', @keybinds
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

      entry = $ '.entry', menu
      while prevEntry = @findNextEntry entry, -1
        entry = prevEntry
      @focus entry
      $.on d, 'click',     @close
      $.on d, 'CloseMenu', @close
      $.add button, menu

      # Position
      mRect   = menu.getBoundingClientRect()
      bRect   = button.getBoundingClientRect()
      bTop    = window.scrollY + bRect.top
      bLeft   = window.scrollX + bRect.left
      cHeight = doc.clientHeight
      cWidth  = doc.clientWidth
      if bRect.top + bRect.height + mRect.height < cHeight
        $.addClass menu, 'top'
        $.rmClass  menu, 'bottom'
      else
        $.addClass menu, 'bottom'
        $.rmClass  menu, 'top'
      if bRect.left + mRect.width < cWidth
        $.addClass menu, 'left'
        $.rmClass  menu, 'right'
      else
        $.addClass menu, 'right'
        $.rmClass  menu, 'left'

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
        className: 'dialog submenu'
      for subEntry in entry.subEntries
        @insertEntry subEntry, submenu, data
      $.add entry.el, submenu
      return

    close: =>
      $.rm currentMenu
      currentMenu       = null
      lastToggledButton = null
      $.off d, 'click CloseMenu', @close

    findNextEntry: (entry, direction) ->
      entries = [entry.parentNode.children...]
      entries.sort (first, second) -> first.style.order - second.style.order
      entries[entries.indexOf(entry) + direction]

    keybinds: (e) =>
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
          if next = @findNextEntry entry, -1
            @focus next
        when 40 # Down
          if next = @findNextEntry entry, +1
            @focus next
        when 39 # Right
          if (submenu = $ '.submenu', entry) and next = submenu.firstElementChild
            while nextPrev = @findNextEntry next, -1
              next = nextPrev
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
        $.addClass submenu, 'top'
        $.rmClass  submenu, 'bottom'
      else
        $.addClass submenu, 'bottom'
        $.rmClass  submenu, 'top'
      if eRect.right + sRect.width < cWidth
        $.addClass submenu, 'left'
        $.rmClass  submenu, 'right'
      else
        $.addClass submenu, 'right'
        $.rmClass  submenu, 'left'

    addEntry: (e) =>
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
      el.style.order = entry.order or 100
      return unless subEntries
      $.addClass el, 'has-submenu'
      for subEntry in subEntries
        @parseEntry subEntry
      return


  dragstart = (e) ->
    return if e.type is 'mousedown' and e.button isnt 0 # not LMB
    # prevent text selection
    e.preventDefault()
    if isTouching = e.type is 'touchstart'
      e = e.changedTouches[e.changedTouches.length - 1]
    # distance from pointer to el edge is constant; calculate it here.
    el = $.x 'ancestor::div[contains(@class,"dialog")][1]', @
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
      $.on d, 'touchmove', o.move
      $.on d, 'touchend touchcancel', o.up
    else # mousedown
      o.move = drag.bind    o
      o.up   = dragend.bind o
      $.on d, 'mousemove', o.move
      $.on d, 'mouseup',   o.up
  touchmove = (e) ->
    for touch in e.changedTouches
      if touch.identifier is @identifier
        drag.call @, touch
        return
  drag = (e) ->
    {clientX, clientY} = e

    left = clientX - @dx
    left = if left < 10
      0
    else if @width - left < 10
      null
    else
      left / @screenWidth * 100 + '%'

    top = clientY - @dy
    top = if top < 10
      0
    else if @height - top < 10
      null
    else
      top / @screenHeight * 100 + '%'

    right = if left is null
      0
    else
      null
    bottom = if top is null
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
      $.off d, 'touchmove', @move
      $.off d, 'touchend touchcancel', @up
    else # mouseup
      $.off d, 'mousemove', @move
      $.off d, 'mouseup',   @up
    $.set "#{@id}.position", @style.cssText

  hoverstart = ({root, el, latestEvent, endEvents, asapTest, cb}) ->
    o = {
      root
      el
      style: el.style
      cb
      endEvents
      latestEvent
      clientHeight: doc.clientHeight
      clientWidth:  doc.clientWidth
    }
    o.hover    = hover.bind    o
    o.hoverend = hoverend.bind o

    $.asap ->
      !el.parentNode or asapTest()
    , ->
      o.hover o.latestEvent if el.parentNode

    $.on root, endEvents,   o.hoverend
    $.on root, 'mousemove', o.hover
    <% if (type === 'userscript') { %>
    # Workaround for https://github.com/MayhemYDG/4chan-x/issues/377
    o.workaround = (e) -> o.hoverend() unless root.contains e.target
    $.on doc,  'mousemove', o.workaround
    <% } %>
  hover = (e) ->
    @latestEvent = e
    height = @el.offsetHeight
    {clientX, clientY} = e

    top = clientY - 120
    top = if @clientHeight <= height or top <= 0
      0
    else if top + height >= @clientHeight
      @clientHeight - height
    else
      top

    [left, right] = if clientX <= @clientWidth - 400
      [clientX + 45 + 'px', null]
    else
      [null, @clientWidth - clientX + 45 + 'px']

    {style} = @
    style.top   = top + 'px'
    style.left  = left
    style.right = right
  hoverend = ->
    $.rm @el
    $.off @root, @endEvents,  @hoverend
    $.off @root, 'mousemove', @hover
    <% if (type === 'userscript') { %>
    # Workaround for https://github.com/MayhemYDG/4chan-x/issues/377
    $.off doc,   'mousemove', @workaround
    <% } %>
    @cb.call @ if @cb


  return {
    dialog: dialog
    Menu:   Menu
    hover:  hoverstart
  }
