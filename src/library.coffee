UI =
  dialog: (id, position, html) ->
    el = d.createElement 'div'
    el.className = 'reply dialog'
    el.innerHTML = html
    el.id        = id
    el.style.cssText = localStorage.getItem("#{Main.namespace}#{id}.position") or position
    el.querySelector('.move')?.addEventListener 'mousedown', UI.dragstart, false
    el
  dragstart: (e) ->
    #prevent text selection
    e.preventDefault()
    UI.el = el = @parentNode
    d.addEventListener 'mousemove', UI.drag,    false
    d.addEventListener 'mouseup',   UI.dragend, false
    # distance from pointer to el edge is constant; calculate it here.
    rect      = el.getBoundingClientRect()
    UI.dx     = e.clientX - rect.left
    UI.dy     = e.clientY - rect.top
    UI.width  = d.documentElement.clientWidth  - rect.width
    UI.height = d.documentElement.clientHeight - rect.height
  drag: (e) ->
    left = e.clientX - UI.dx
    top  = e.clientY - UI.dy
    left =
      if left < 10 then '0px'
      else if UI.width - left < 10 then null
      else left + 'px'
    top =
      if top < 10 then '0px'
      else if UI.height - top < 10 then null
      else top + 'px'
    #using null instead of '' is 4% faster
    #these 4 statements are 40% faster than 1 style.cssText
    {style} = UI.el
    style.left   = left
    style.top    = top
    style.right  = if left is null then '0px' else null
    style.bottom = if top  is null then '0px' else null
  dragend: ->
    localStorage.setItem "#{Main.namespace}#{UI.el.id}.position", UI.el.style.cssText
    d.removeEventListener 'mousemove', UI.drag,    false
    d.removeEventListener 'mouseup',   UI.dragend, false
    delete UI.el
  hover: (e) ->
    {clientX, clientY} = e
    {style} = UI.el
    {clientHeight, clientWidth} = d.documentElement
    height = UI.el.offsetHeight

    top = clientY - 120
    style.top =
      if clientHeight <= height or top <= 0
        '0px'
      else if top + height >= clientHeight
        clientHeight - height + 'px'
      else
        top + 'px'

    if clientX <= clientWidth - 400
      style.left  = clientX + 45 + 'px'
      style.right = null
    else
      style.left  = null
      style.right = clientWidth - clientX + 45 + 'px'
  hoverend: ->
    $.rm UI.el
    delete UI.el

###
loosely follows the jquery api:
http://api.jquery.com/
not chainable
###
$ = (selector, root=d.body) ->
  root.querySelector selector

$.extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  return

$.extend $,
  NBSP: '\u00A0'
  SECOND: 1000
  MINUTE: 1000*60
  HOUR  : 1000*60*60
  DAY   : 1000*60*60*24
  log: console = unsafeWindow.console if !console
  engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase()
  ready: (fc) ->
    if /interactive|complete/.test d.readyState
      # Execute the functions in parallel.
      # If one fails, do not stop the others.
      return setTimeout fc
    cb = ->
      $.off d, 'DOMContentLoaded', cb
      fc()
    $.on d, 'DOMContentLoaded', cb
  sync: (key, cb) ->
    $.on window, 'storage', (e) ->
      cb JSON.parse e.newValue if e.key is "#{Main.namespace}#{key}"
  id: (id) ->
    d.getElementById id
  formData: (arg) ->
    if arg instanceof HTMLFormElement
      fd = new FormData arg
    else
      fd = new FormData()
      for key, val of arg
        fd.append key, val if val
    fd
  ajax: (url, callbacks, opts={}) ->
    #XXX `form` should be `data`
    {type, headers, upCallbacks, form} = opts
    r = new XMLHttpRequest()
    r.overrideMimeType 'text/html'
    type or= form and 'post' or 'get'
    r.open type, url, true
    for key, val of headers
      r.setRequestHeader key, val
    $.extend r, callbacks
    $.extend r.upload, upCallbacks
    r.send form
    r
  cache: (url, cb) ->
    if req = $.cache.requests[url]
      if req.readyState is 4
        cb.call req
      else
        req.callbacks.push cb
    else
      req = $.ajax url,
        onload:  -> cb.call @ for cb in @callbacks
        onabort: -> delete $.cache.requests[url]
        onerror: -> delete $.cache.requests[url]
      req.callbacks = [cb]
      $.cache.requests[url] = req
  cb:
    checked: ->
      $.set @name, @checked
      Conf[@name] = @checked
    value: ->
      $.set @name, @value.trim()
      Conf[@name] = @value
  addStyle: (css, identifier) ->
    style = $.el 'style',
      textContent: css
      id:          identifier
    $.add d.head, style
    style
  x: (path, root=d.body) ->
    d.evaluate(path, root, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).
      singleNodeValue
  X: (path, root=d.body) ->
    d.evaluate(path, root, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
  addClass: (el, className) ->
    el.classList.add className
  rmClass: (el, className) ->
    el.classList.remove className
  rm: (el) ->
    el.parentNode.removeChild el
  tn: (s) ->
    d.createTextNode s
  nodes: (nodes) ->
    # In (at least) Chrome, elements created inside different
    # scripts/window contexts inherit from unequal prototypes.
    # window_ext1.Node !== window_ext2.Node
    unless nodes instanceof Array
      return nodes
    frag = d.createDocumentFragment()
    for node in nodes
      frag.appendChild node
    frag
  add: (parent, children) ->
    parent.appendChild $.nodes children
  prepend: (parent, children) ->
    parent.insertBefore $.nodes(children), parent.firstChild
  after: (root, el) ->
    root.parentNode.insertBefore $.nodes(el), root.nextSibling
  before: (root, el) ->
    root.parentNode.insertBefore $.nodes(el), root
  replace: (root, el) ->
    root.parentNode.replaceChild $.nodes(el), root
  el: (tag, properties) ->
    el = d.createElement tag
    $.extend el, properties if properties
    el
  on: (el, events, handler) ->
    for event in events.split ' '
      el.addEventListener event, handler, false
    return
  off: (el, events, handler) ->
    for event in events.split ' '
      el.removeEventListener event, handler, false
    return
  event: (el, e) ->
    el.dispatchEvent e
  globalEval: (code) ->
    script = $.el 'script', textContent: "(#{code})()"
    $.add d.head, script
    $.rm script
  shortenFilename: (filename, isOP) ->
    # FILENAME SHORTENING SCIENCE:
    # OPs have a +10 characters threshold.
    # The file extension is not taken into account.
    threshold = 30 + 10 * isOP
    if filename.replace(/\.\w+$/, '').length > threshold
      "#{filename[...threshold - 5]}(...)#{filename.match(/\.\w+$/)}"
    else
      filename
  bytesToString: (size) ->
    unit = 0 # Bytes
    while size >= 1024
      size /= 1024
      unit++
    # Remove trailing 0s.
    size =
      if unit > 1
        # Keep the size as a float if the size is greater than 2^20 B.
        # Round to hundredth.
        Math.round(size * 100) / 100
      else
        # Round to an integer otherwise.
        Math.round size
    "#{size} #{['B', 'KB', 'MB', 'GB'][unit]}"
  RandomAccessList: class
    constructor: ->
      @first = null
      @last = null
      @length = 0

    push: (id, el) ->
      {last} = @
      @[id] = item =
        prev: last
        next: null
        el: el
        id: id
      @last = item
      if last
        last.next = item
      else
        @first = item
      @length++

    shift: ->
      @rm @first.id

    after: (root, item) ->
      return if item.prev is root

      @rmi item

      {next} = root

      root.next = item
      item.prev = root
      item.next = next
      next.prev = item

    rm: (id) ->
      item = @[id]
      return unless item
      delete @[id]
      @length--
      @rmi item

    rmi: (item) ->
      {prev, next} = item
      if prev
        prev.next = next
      else
        @first = next
      if next
        next.prev = prev
      else
        @last = prev

$.cache.requests = {}

$.extend $,
  if GM_deleteValue?
    delete: (name) ->
      name = Main.namespace + name
      GM_deleteValue name
    get: (name, defaultValue) ->
      name = Main.namespace + name
      if value = GM_getValue name
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      name = Main.namespace + name
      # for `storage` events
      localStorage.setItem name, JSON.stringify value
      GM_setValue name, JSON.stringify value
    open: (url) ->
      #https://github.com/scriptish/scriptish/wiki/GM_openInTab
      #string url, bool loadInBackground, bool reuseTab
      GM_openInTab location.protocol + url, true
  else
    delete: (name) ->
      localStorage.removeItem Main.namespace + name
    get: (name, defaultValue) ->
      if value = localStorage.getItem Main.namespace + name
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      localStorage.setItem Main.namespace + name, JSON.stringify value
    open: (url) ->
      window.open location.protocol + url, '_blank'

$$ = (selector, root=d.body) ->
  Array::slice.call root.querySelectorAll selector
