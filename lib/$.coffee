# loosely follows the jquery api:
# http://api.jquery.com/
# not chainable
$ = (selector, root=d.body) ->
  root.querySelector selector
$$ = (selector, root=d.body) ->
  Array::slice.call root.querySelectorAll selector

$.extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  return

$.extend $,
  SECOND: 1000
  MINUTE: 1000 * 60
  HOUR  : 1000 * 60 * 60
  DAY   : 1000 * 60 * 60 * 24
  # XXX http://code.google.com/p/phantomjs/issues/detail?id=522
  log: console.log.bind? console
  engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase()
  id: (id) ->
    d.getElementById id
  ready: (fc) ->
    if /interactive|complete/.test d.readyState
      $.queueTask fc
      return
    cb = ->
      $.off d, 'DOMContentLoaded', cb
      fc()
    $.on d, 'DOMContentLoaded', cb
  sync: (key, cb) ->
    $.on window, 'storage', (e) ->
      if e.key is "#{g.NAMESPACE}#{key}"
        cb JSON.parse e.newValue
  formData: (form) ->
    if form instanceof HTMLFormElement
      return new FormData form
    fd = new FormData()
    for key, val of form
      fd.append key, val if val
    fd
  ajax: (url, callbacks, opts={}) ->
    {type, headers, upCallbacks, form} = opts
    r = new XMLHttpRequest()
    type or= form and 'post' or 'get'
    r.open type, url, true
    for key, val of headers
      r.setRequestHeader key, val
    $.extend r, callbacks
    $.extend r.upload, upCallbacks
    r.withCredentials = type is 'post'
    r.send form
    r
  cache: (->
    reqs = {}
    (url, cb) ->
      if req = reqs[url]
        if req.readyState is 4
          cb.call req
        else
          req.callbacks.push cb
        return
      req = $.ajax url,
        onload:  ->
          cb.call @ for cb in @callbacks
          delete @callbacks
        onabort: -> delete reqs[url]
        onerror: -> delete reqs[url]
      req.callbacks = [cb]
      reqs[url] = req
  )()
  cb:
    checked: ->
      $.set @name, @checked
      Conf[@name] = @checked
    value: ->
      $.set @name, @value.trim()
      Conf[@name] = @value
  addStyle: (css) ->
    style = $.el 'style',
      textContent: css
    # That's terrible.
    # XXX tmp fix for scriptish:
    # https://github.com/scriptish/scriptish/issues/16
    f = ->
      # XXX Only Chrome has no d.head on document-start.
      if root = d.head or d.documentElement
        $.add root, style
      else
        setTimeout f, 20
    f()
    style
  x: (path, root=d.body) ->
    # XPathResult.ANY_UNORDERED_NODE_TYPE === 8
    d.evaluate(path, root, null, 8, null).singleNodeValue
  addClass: (el, className) ->
    el.classList.add className
  rmClass: (el, className) ->
    el.classList.remove className
  hasClass: (el, className) ->
    el.classList.contains className
  rm: (el) ->
    el.parentNode.removeChild el
  tn: (s) ->
    d.createTextNode s
  nodes: (nodes) ->
    # In (at least) Chrome, elements created inside different
    # scripts/window contexts inherit from unequal prototypes.
    # window_context1.Node !== window_context2.Node
    unless nodes instanceof Array
      return nodes
    frag = d.createDocumentFragment()
    for node in nodes
      frag.appendChild node
    frag
  add: (parent, el) ->
    parent.appendChild $.nodes el
  prepend: (parent, el) ->
    parent.insertBefore $.nodes(el), parent.firstChild
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
  open: (url) ->
    (GM_openInTab or window.open) url, '_blank'
  queueTask: (->
    # inspired by https://www.w3.org/Bugs/Public/show_bug.cgi?id=15007
    taskQueue = []
    execTask = ->
      task = taskQueue.shift()
      func = task[0]
      args = Array::slice.call task, 1
      func.apply func, args
    if window.MessageChannel
      taskChannel = new MessageChannel()
      taskChannel.port1.onmessage = execTask
      ->
        taskQueue.push arguments
        taskChannel.port2.postMessage null
    else # XXX Firefox
      ->
        taskQueue.push arguments
        setTimeout execTask, 0
  )()
  globalEval: (code) ->
    script = $.el 'script',
      textContent: code
    $.add d.head, script
    $.rm script
  # http://mths.be/unsafewindow
  unsafeWindow:
    if unitTesting or # unit testing
      window.opera # Opera
        window
    else if unsafeWindow isnt window # Firefox
      unsafeWindow
    else # Chrome
      (->
        p = d.createElement 'p'
        p.setAttribute 'onclick', 'return window'
        p.onclick()
      )()
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

$.extend $,
  if GM_deleteValue?
    delete: (name) ->
      GM_deleteValue g.NAMESPACE + name
    get: (name, defaultValue) ->
      if value = GM_getValue g.NAMESPACE + name
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      name  = g.NAMESPACE + name
      value = JSON.stringify value
      # for `storage` events
      localStorage.setItem name, value
      GM_setValue name, value
  else if window.opera
    delete: (name)->
      delete opera.scriptStorage[g.NAMESPACE + name]
    get: (name, defaultValue) ->
      if value = opera.scriptStorage[g.NAMESPACE + name]
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      name  = g.NAMESPACE + name
      value = JSON.stringify value
      # for `storage` events
      localStorage.setItem name, value
      opera.scriptStorage[name] = value
  else
    delete: (name) ->
      localStorage.removeItem g.NAMESPACE + name
    get: (name, defaultValue) ->
      if value = localStorage.getItem g.NAMESPACE + name
        JSON.parse value
      else
        defaultValue
    set: (name, value) ->
      localStorage.setItem g.NAMESPACE + name, JSON.stringify value
