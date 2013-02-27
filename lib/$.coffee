# loosely follows the jquery api:
# http://api.jquery.com/
# not chainable
$ = (selector, root=d.body) ->
  root.querySelector selector
$$ = (selector, root=d.body) ->
  [root.querySelectorAll(selector)...]

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
  log: console.log.bind console
  engine: /WebKit|Presto|Gecko/.exec(navigator.userAgent)[0].toLowerCase()
  id: (id) ->
    d.getElementById id
  ready: (fc) ->
    if d.readyState in ['interactive', 'complete']
      $.queueTask fc
      return
    cb = ->
      $.off d, 'DOMContentLoaded', cb
      fc()
    $.on d, 'DOMContentLoaded', cb
  sync: (key, cb) ->
    key = "#{g.NAMESPACE}#{key}"
    $.on window, 'storage', (e) ->
      if e.key is key
        cb JSON.parse e.newValue
  formData: (form) ->
    if form instanceof HTMLFormElement
      return new FormData form
    fd = new FormData()
    for key, val of form
      if val instanceof Blob
        fd.append key, val, val.name
      else if val
        fd.append key, val
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
  cache: do ->
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
  cb:
    checked: ->
      $.set @name, @checked
      Conf[@name] = @checked
    value: ->
      $.set @name, @value.trim()
      Conf[@name] = @value
  asap: (test, cb) ->
    if test()
      cb()
    else
      setTimeout $.asap, 25, test, cb
  addStyle: (css, type) ->
    style = if type is 'style' or !window.URL
      $.el 'style',
        textContent: css
    else
      $.el 'link',
        rel: 'stylesheet'
        href: URL.createObjectURL new Blob([css], type: 'text/css')
    $.asap (-> d.head), ->
      $.add d.head, style
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
  event: (event, detail, root=d) ->
    root.dispatchEvent new CustomEvent event, {bubbles: true, detail}
  open: (url) ->
    (window.GM_openInTab or window.open) url, '_blank'
  debounce: (wait, fn) ->
    timeout = null
    that    = null
    args    = null
    exec    = ->
      fn.apply that, args
      timeout = null
    ->
      args = arguments
      that = this
      if timeout
        # stop current reset
        clearTimeout timeout
      else
        exec()

      # after wait, let next invocation execute immediately
      timeout = setTimeout exec, wait
  queueTask: do ->
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
  globalEval: (code) ->
    script = $.el 'script',
      textContent: code
    $.add d.head, script
    $.rm script
  # http://mths.be/unsafewindow
  unsafeWindow:
    if window.opera # Opera
      window
    else if unsafeWindow isnt window # Firefox
      unsafeWindow
    else # Chrome
      do ->
        p = d.createElement 'p'
        p.setAttribute 'onclick', 'return window'
        p.onclick()
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

if GM_deleteValue?
  $.delete = (name) ->
    GM_deleteValue g.NAMESPACE + name
  $.get = (name, defaultValue) ->
    if value = GM_getValue g.NAMESPACE + name
      JSON.parse value
    else
      defaultValue
  $.set = (name, value) ->
    name  = g.NAMESPACE + name
    value = JSON.stringify value
    # for `storage` events
    localStorage.setItem name, value
    GM_setValue name, value
else if window.opera
  do ->
    # http://www.opera.com/docs/userjs/specs/#scriptstorage
    # http://www.opera.com/docs/userjs/using/#securepages
    # >The scriptStorage object is available only during
    # the main User JavaScript thread, being therefore
    # accessible only in the main body of the user script.
    # To access the storage object later, keep a reference
    # to the object.
    {scriptStorage} = opera
    $.delete = (name) ->
      delete scriptStorage[g.NAMESPACE + name]
    $.get = (name, defaultValue) ->
      if value = scriptStorage[g.NAMESPACE + name]
        JSON.parse value
      else
        defaultValue
    $.set = (name, value) ->
      name  = g.NAMESPACE + name
      value = JSON.stringify value
      # for `storage` events
      localStorage.setItem name, value
      scriptStorage[name] = value
else
  $.delete = (name) ->
    localStorage.removeItem g.NAMESPACE + name
  $.get = (name, defaultValue) ->
    if value = localStorage.getItem g.NAMESPACE + name
      JSON.parse value
    else
      defaultValue
  $.set = (name, value) ->
    localStorage.setItem g.NAMESPACE + name, JSON.stringify value
