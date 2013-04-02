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
  engine: '<% if (type === 'crx') { %>webkit<% } else if (type === 'userjs') { %>presto<% } else { %>gecko<% } %>'
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
  formData: (form) ->
    if form instanceof HTMLFormElement
      return new FormData form
    fd = new FormData()
    for key, val of form
      continue unless val
      # XXX GM bug
      # if val instanceof Blob
      if val.size and val.name
        fd.append key, val, val.name
      else
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
  addStyle: (css) ->
    style = $.el 'style',
      textContent: css
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
  open: do ->
    if GM_openInTab?
      (URL) ->
        # XXX fix GM opening file://// for protocol-less URLs.
        a = $.el 'a', href: URL
        GM_openInTab a.href
    else
      (URL) -> window.open URL, '_blank'
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
    $.add (d.head or doc), script
    $.rm script
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
  syncing: {}
  sync: do ->
<% if (type === 'crx') { %>
    chrome.storage.onChanged.addListener (changes) ->
      for key of changes
        if cb = $.syncing[key]
          cb changes[key].newValue
      return
    (key, cb) -> $.syncing[key] = cb
<% } else { %>
    window.addEventListener 'storage', (e) ->
      if cb = $.syncing[e.key]
        cb JSON.parse e.newValue
    , false
    (key, cb) -> $.syncing[g.NAMESPACE + key] = cb
<% } %>
  item: (key, val) ->
    item = {}
    item[key] = val
    item
<% if (type === 'crx') { %>
  # https://developer.chrome.com/extensions/storage.html
  delete: (keys) ->
    chrome.storage.sync.remove keys
  get: (key, val, cb) ->
    if arguments.length is 2
      items = key
      cb = val
    else
      items = $.item key, val
    chrome.storage.sync.get items, cb
  set: (key, val) ->
    items = if arguments.length is 2
      $.item key, val
    else
      key
    chrome.storage.sync.set items
<% } else if (type === 'userjs') { %>
do ->
  # http://www.opera.com/docs/userjs/specs/#scriptstorage
  # http://www.opera.com/docs/userjs/using/#securepages
  # The scriptStorage object is available only during
  # the main User JavaScript thread, being therefore
  # accessible only in the main body of the user script.
  # To access the storage object later, keep a reference
  # to the object.
  {scriptStorage} = opera
  $.delete = (keys) ->
    unless keys instanceof Array
      keys = [keys]
    for key in keys
      key = g.NAMESPACE + key
      localStorage.removeItem key
      delete scriptStorage[key]
    return
  $.get = (key, val, cb) ->
    if arguments.length is 2
      items = key
      cb = val
    else
      items = $.item key, val
    $.queueTask ->
      for key of items
        if val = scriptStorage[g.NAMESPACE + key]
          items[key] = JSON.parse val
      cb items
  $.set = do ->
    set = (key, val) ->
      key = g.NAMESPACE + key
      val = JSON.stringify val
      if key of $.syncing
        # for `storage` events
        localStorage.setItem key, val
      scriptStorage[key] = val
    (key, val) ->
      if arguments.length is 1
        for key, val of key
          set key, val
      else
        set key, val
<% } else { %>
  # http://wiki.greasespot.net/Main_Page
  delete: (key) ->
    unless keys instanceof Array
      keys = [keys]
    for key in keys
      key = g.NAMESPACE + key
      localStorage.removeItem key
      GM_deleteValue key
    return
  get: (key, val, cb) ->
    if arguments.length is 2
      items = key
      cb = val
    else
      items = $.item key, val
    $.queueTask ->
      for key of items
        if val = GM_getValue g.NAMESPACE + key
          items[key] = JSON.parse val
      cb items
  set: do ->
    set = (key, val) ->
      key = g.NAMESPACE + key
      val = JSON.stringify val
      if key of $.syncing
        # for `storage` events
        localStorage.setItem key, val
      GM_setValue key, val
    (key, val) ->
      if arguments.length is 1
        for key, val of key
          set key, val
      else
        set key, val
<% } %>
