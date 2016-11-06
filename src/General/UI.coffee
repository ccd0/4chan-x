dialog = (id, properties) ->
  el = $.el 'div',
    className: 'dialog'
    id: id
  $.extend el, properties
  el.style.cssText = Conf["#{id}.position"]

  move = $ '.move', el
  $.on move, 'touchstart mousedown', dragstart
  for child in move.children
    continue unless child.tagName
    $.on child, 'touchstart mousedown', (e) ->
      e.stopPropagation()

  el

class Menu
  currentMenu       = null
  lastToggledButton = null

  constructor: (@type) ->
    # XXX AddMenuEntry event is deprecated
    $.on d, 'AddMenuEntry', ({detail}) =>
      return if detail.type isnt @type
      delete detail.open
      @addEntry detail
    @entries = []

  makeMenu: ->
    menu = $.el 'div',
      className: 'dialog'
      id:        'menu'
      tabIndex:  0
    menu.dataset.type = @type
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
      currentMenu.close()
      return if previousButton is button

    return unless @entries.length
    @open button, data

  open: (button, data) ->
    menu = @menu = @makeMenu()
    currentMenu       = @
    lastToggledButton = button

    @entries.sort (first, second) ->
      first.order - second.order

    for entry in @entries
      @insertEntry entry, menu, data

    $.addClass lastToggledButton, 'active'

    $.on d, 'click CloseMenu', @close
    $.on d, 'scroll', @setPosition
    $.on window, 'resize', @setPosition
    $.add button, menu

    @setPosition()

    entry = $ '.entry', menu
    # We've removed flexbox, so we don't use order anymore.
    # while prevEntry = @findNextEntry entry, -1
    #   entry = prevEntry
    @focus entry

    menu.focus()

  setPosition: =>
    mRect   = @menu.getBoundingClientRect()
    bRect   = lastToggledButton.getBoundingClientRect()
    bTop    = window.scrollY + bRect.top
    bLeft   = window.scrollX + bRect.left
    cHeight = doc.clientHeight
    cWidth  = doc.clientWidth
    [top, bottom] = if bRect.top + bRect.height + mRect.height < cHeight
      ["#{bRect.bottom}px", '']
    else
      ['', "#{cHeight - bRect.top}px"]
    [left, right] = if bRect.left + mRect.width < cWidth
      ["#{bRect.left}px", '']
    else
      ['', "#{cWidth - bRect.right}px"]
    $.extend @menu.style, {top, right, bottom, left}
    @menu.classList.toggle 'left', right

  insertEntry: (entry, parent, data) ->
    if typeof entry.open is 'function'
      try
        return unless entry.open data
      catch err
        Main.handleErrors
          message: "Error in building the #{@type} menu."
          error: err
        return
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
    $.rm @menu
    delete @menu
    $.rmClass lastToggledButton, 'active'
    currentMenu       = null
    lastToggledButton = null
    $.off d, 'click scroll CloseMenu', @close
    $.off d, 'scroll', @setPosition
    $.off window, 'resize', @setPosition

  findNextEntry: (entry, direction) ->
    entries = [entry.parentNode.children...]
    entries.sort (first, second) -> first.style.order - second.style.order
    entries[entries.indexOf(entry) + direction]

  keybinds: (e) =>
    entry = $ '.focused', @menu
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
        if (submenu = $ '.submenu', entry) and (next = submenu.firstElementChild)
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

  onFocus: (e) =>
    e.stopPropagation()
    @focus e.target

  focus: (entry) ->
    while focused = $.x 'parent::*/child::*[contains(@class,"focused")]', entry
      $.rmClass focused, 'focused'
    for focused in $$ '.focused', entry
      $.rmClass focused, 'focused'
    $.addClass entry, 'focused'

    # Submenu positioning.
    return if not (submenu = $ '.submenu', entry)
    sRect   = submenu.getBoundingClientRect()
    eRect   = entry.getBoundingClientRect()
    cHeight = doc.clientHeight
    cWidth  = doc.clientWidth
    [top, bottom] = if eRect.top + sRect.height < cHeight
      ['0px', 'auto']
    else
      ['auto', '0px']
    [left, right] = if eRect.right + sRect.width < cWidth - 150
      ['100%', 'auto']
    else
      ['auto', '100%']
    {style} = submenu
    style.top    = top
    style.bottom = bottom
    style.left   = left
    style.right  = right

  addEntry: (entry) =>
    @parseEntry entry
    @entries.push entry

  parseEntry: (entry) ->
    {el, subEntries} = entry
    $.addClass el, 'entry'
    $.on el, 'focus mouseover', @onFocus
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
    ''
  else
    left / @screenWidth * 100 + '%'

  top = clientY - @dy
  top = if top < (10 + @topBorder)
    @topBorder + 'px'
  else if @height - top < (10 + @bottomBorder)
    ''
  else
    top / @screenHeight * 100 + '%'

  right = if left is ''
    0
  else
    ''

  bottom = if top is ''
    @bottomBorder + 'px'
  else
    ''

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

hoverstart = ({root, el, latestEvent, endEvents, height, cb, noRemove}) ->
  o = {
    root
    el
    style: el.style
    isImage: el.nodeName in ['IMG', 'VIDEO']
    cb
    endEvents
    latestEvent
    clientHeight: doc.clientHeight
    clientWidth:  doc.clientWidth
    height
    noRemove
  }
  o.hover    = hover.bind    o
  o.hoverend = hoverend.bind o

  o.hover o.latestEvent
  new MutationObserver(->
    o.hover o.latestEvent if el.parentNode
  ).observe el, {childList: true}

  $.on root, endEvents,   o.hoverend
  if $.x 'ancestor::div[contains(@class,"inline")][1]', root
    $.on d,    'keydown',   o.hoverend
  $.on root, 'mousemove', o.hover

  # Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=674955
  o.workaround = (e) -> o.hoverend(e) unless root.contains e.target
  $.on doc,  'mousemove', o.workaround

hoverstart.padding = 25

hover = (e) ->
  @latestEvent = e
  height = (@height or @el.offsetHeight) + hoverstart.padding
  {clientX, clientY} = e

  top = if @isImage
    Math.max 0, clientY * (@clientHeight - height) / @clientHeight
  else
    Math.max 0, Math.min(@clientHeight - height, clientY - 120)

  threshold = @clientWidth / 2
  threshold = Math.max threshold, @clientWidth - 400 unless @isImage
  [left, right] = if clientX <= threshold
    [clientX + 45 + 'px', '']
  else
    ['', @clientWidth - clientX + 45 + 'px']

  {style} = @
  style.top   = top + 'px'
  style.left  = left
  style.right = right

hoverend = (e) ->
  return if e.type is 'keydown' and e.keyCode isnt 13 or e.target.nodeName is "TEXTAREA"
  $.rm @el unless @noRemove
  $.off @root, @endEvents,  @hoverend
  $.off d,     'keydown',   @hoverend
  $.off @root, 'mousemove', @hover
  # Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=674955
  $.off doc,   'mousemove', @workaround
  @cb.call @ if @cb

checkbox = (name, text, checked) ->
  checked = Conf[name] unless checked?
  label = $.el 'label'
  input = $.el 'input', {type: 'checkbox', name, checked}
  $.add label, [input, $.tn " #{text}"]
  label

UI = {
  dialog:   dialog
  Menu:     Menu
  hover:    hoverstart
  checkbox: checkbox
}
