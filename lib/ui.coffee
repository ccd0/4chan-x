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

  dragstart = (e) ->
    # prevent text selection
    e.preventDefault()
    el = @parentNode
    if isTouching = e.type is 'touchstart'
      e = e.changedTouches[e.changedTouches.length - 1]
    # distance from pointer to el edge is constant; calculate it here.
    rect = el.getBoundingClientRect()
    screenHeight = d.documentElement.clientHeight
    screenWidth  = d.documentElement.clientWidth
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
    left = e.clientX - @dx
    top  = e.clientY - @dy
    if left < 10 then left = 0
    else if @width - left < 10 then left = null
    if top < 10 then top = 0
    else if @height - top < 10 then top = null
    if left is null
      @style.left  = null
      @style.right = '0%'
    else
      @style.left  = left / @screenWidth * 100 + '%'
      @style.right = null
    if top is null
      @style.top    = null
      @style.bottom = '0%'
    else
      @style.top    = top / @screenHeight * 100 + '%'
      @style.bottom = null
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
      clientHeight: d.documentElement.clientHeight
      clientWidth:  d.documentElement.clientWidth
    }
    o.hover    = hover.bind    o
    o.hoverend = hoverend.bind o
    for event in o.events
      root.addEventListener event,     o.hoverend, false
    root.addEventListener 'mousemove', o.hover,    false
  hover = (e) ->
    height = @el.offsetHeight
    top = e.clientY - height / 2
    @style.top =
      if @clientHeight <= height or top <= 0
        '0px'
      else if top + height >= @clientHeight
        @clientHeight - height + 'px'
      else
        top + 'px'

    {clientX} = e
    if clientX <= @clientWidth - 400
      @style.left  = clientX + 45 + 'px'
      @style.right = null
    else
      @style.left  = null
      @style.right = @clientWidth - clientX + 45 + 'px'
  hoverend = ->
    @el.parentNode.removeChild @el
    for event in @events
      @root.removeEventListener event,     @hoverend, false
    @root.removeEventListener 'mousemove', @hover,    false
    @cb.call @ if @cb

  return {
    dialog: dialog
    hover:  hoverstart
  }
)()
