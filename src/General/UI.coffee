UI = do ->
  dialog = (id, position, html) ->
    el = $.el 'div',
      className: 'dialog'
      innerHTML: html
      id: id
    el.style.cssText = position
    $.get "#{id}.position", position, (item) ->
      el.style.cssText = item["#{id}.position"]

    move = $ '.move', el
    $.on move, 'touchstart mousedown', dragstart

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

      @entries.sort (first, second) ->
        first.order - second.order

      for entry in @entries
        @insertEntry entry, menu, data

      $.addClass lastToggledButton, 'active'

      $.on d, 'click',     @close
      $.on d, 'CloseMenu', @close
      Rice.nodes menu
      $.add Header.hover, menu

      # Position
      mRect   = menu.getBoundingClientRect()
      bRect   = button.getBoundingClientRect()
      bTop    = window.scrollY + bRect.top
      bLeft   = window.scrollX + bRect.left
      cHeight = doc.clientHeight
      cWidth  = doc.clientWidth
      [top, bottom] = if bRect.top + bRect.height + mRect.height < cHeight
        [bRect.bottom, null]
      else
        [null, cHeight - bRect.top]
      [left, right] = if bRect.left + mRect.width < cWidth
        [bRect.left, null]
      else
        [null, cWidth - bRect.right]
      {style} = menu
      style.top    = "#{top}px"
      style.right  = "#{right}px"
      style.bottom = "#{bottom}px"
      style.left   = "#{left}px"
      if right
        $.addClass menu, 'left'

      entry = $ '.entry', menu
      # We've removed flexbox, so we don't use order anymore.
      # while prevEntry = @findNextEntry entry, -1
      #   entry = prevEntry
      @focus entry

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
      $.rmClass lastToggledButton, 'active'
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
      [top, bottom] = if eRect.top + sRect.height < cHeight
        ['0px', 'auto']
      else
        ['auto', '0px']
      [left, right] = if eRect.right + sRect.width < cWidth
        ['100%', 'auto']
      else
        ['auto', '100%']
      {style} = submenu
      style.top    = top
      style.bottom = bottom
      style.left   = left
      style.right  = right

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

    [o.topBorder, o.bottomBorder] = if Conf['Header auto-hide'] or not Conf['Fixed Header']
      [0, 0]
    else if Conf['Bottom Header']
      [0, Header.bar.getBoundingClientRect().height]
    else
      [Header.bar.getBoundingClientRect().height, 0]

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
    top = if top < (10 + @topBorder)
      @topBorder + 'px'
    else if @height - top < (10 + @bottomBorder)
      null
    else
      top / @screenHeight * 100 + '%'

    right = if left is null
      0
    else
      null

    bottom = if top is null
      @bottomBorder + 'px'
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

  hoverstart = ({root, el, latestEvent, endEvents, asapTest, cb, close}) ->
    o = {
      root
      el
      style: el.style
      cb
      close:  close
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
    if $.x 'ancestor::div[contains(@class,"inline")][1]', root
      $.on d,    'keydown',   o.hoverend
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

    top = clientY + (if close then 0 else -120)
    top = if @clientHeight <= height or top <= 0
      0
    else if top + height >= @clientHeight
      @clientHeight - height
    else
      top

    [left, right] = if close or clientX <= @clientWidth - 400
      [clientX + (if @close then 15 else 45) + 'px', null]
    else
      [null, @clientWidth - clientX + 45 + 'px']

    {style} = @
    style.top   = top + 'px'
    style.left  = left
    style.right = right

  hoverend = (e) ->
    return if e.type is 'keydown' and e.keyCode isnt 13 or e.target.nodeName is "TEXTAREA"
    $.rm @el
    $.off @root, @endEvents,  @hoverend
    $.off d,     'keydown',   @hoverend
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
