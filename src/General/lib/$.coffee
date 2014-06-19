# loosely follows the jquery api:
# http://api.jquery.com/
# not chainable
$ = (selector, root=d.body) ->
  root.querySelector selector

$.DAY = 24 * 
  $.HOUR = 60 * 
    $.MINUTE = 60 * 
      $.SECOND = 1000

$.id = (id) ->
  d.getElementById id

$.ready = (fc) ->
  unless d.readyState is 'loading'
    $.queueTask fc
    return
  cb = ->
    $.off d, 'DOMContentLoaded', cb
    fc()
  $.on d, 'DOMContentLoaded', cb

$.formData = (form) ->
  if form instanceof HTMLFormElement
    return new FormData form
  fd = new FormData()
  for key, val of form when val
    if typeof val is 'object' and 'newName' of val
      fd.append key, val, val.newName
    else
      fd.append key, val
  fd

$.extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  return

$.ajax = do ->
  # Status Code 304: Not modified
  # With the `If-Modified-Since` header we only receive the HTTP headers and no body for 304 responses.
  # This saves a lot of bandwidth and CPU time for both the users and the servers.
  lastModified = {}
  (url, options, extra={}) ->
    {type, whenModified, upCallbacks, form} = extra
    r = new XMLHttpRequest()
    type or= form and 'post' or 'get'
    r.open type, url, true
    if whenModified
      r.setRequestHeader 'If-Modified-Since', lastModified[url] if url of lastModified
      $.on r, 'load', -> lastModified[url] = r.getResponseHeader 'Last-Modified'
    if /\.json$/.test url
      r.responseType = 'json'
    $.extend r, options
    $.extend r.upload, upCallbacks
    r.send form
    r

$.cache = do ->
  reqs = {}
  (url, cb, options) ->
    if req = reqs[url]
      if req.readyState is 4
        cb.call req, req.evt
      else
        req.callbacks.push cb
      return
    rm = -> delete reqs[url]
    try
      req = $.ajax url, options
    catch err
      return
    $.on req, 'load', (e) ->
      cb.call @, e for cb in @callbacks
      @evt = e
      delete @callbacks
    $.on req, 'abort error', rm
    req.callbacks = [cb]
    reqs[url] = req

$.cb =
  checked: ->
    $.set @name, @checked
    Conf[@name] = @checked
  value: ->
    $.set @name, @value.trim()
    Conf[@name] = @value

$.asap = (test, cb) ->
  if test()
    cb()
  else
    setTimeout $.asap, 25, test, cb

$.addStyle = (css, id) ->
  style = $.el 'style',
    id: id
    textContent: css
  $.asap (-> d.head), ->
    $.add d.head, style
  style

$.x = (path, root) ->
  root or= d.body
  # XPathResult.ANY_UNORDERED_NODE_TYPE === 8
  d.evaluate(path, root, null, 8, null).singleNodeValue

$.X = (path, root) ->
  root or= d.body
  # XPathResult.ORDERED_NODE_SNAPSHOT_TYPE === 7
  d.evaluate path, root, null, 7, null

$.addClass = (el, classNames...) ->
  el.classList.add className for className in classNames
  return

$.rmClass = (el, classNames...) ->
  el.classList.remove className for className in classNames
  return

$.toggleClass = (el, className) ->
  el.classList.toggle className

$.hasClass = (el, className) ->
  className in el.classList

$.rm = (el) ->
  el.remove()

$.rmAll = (root) ->
  # https://gist.github.com/MayhemYDG/8646194
  root.textContent = null

$.tn = (s) ->
  d.createTextNode s

$.frag = ->
  d.createDocumentFragment()

$.nodes = (nodes) ->
  unless nodes instanceof Array
    return nodes
  frag = $.frag()
  for node in nodes
    frag.appendChild node
  frag

$.add = (parent, el) ->
  parent.appendChild $.nodes el

$.prepend = (parent, el) ->
  parent.insertBefore $.nodes(el), parent.firstChild

$.after = (root, el) ->
  root.parentNode.insertBefore $.nodes(el), root.nextSibling

$.before = (root, el) ->
  root.parentNode.insertBefore $.nodes(el), root

$.replace = (root, el) ->
  root.parentNode.replaceChild $.nodes(el), root

$.el = (tag, properties) ->
  el = d.createElement tag
  $.extend el, properties if properties
  el

$.on = (el, events, handler) ->
  for event in events.split ' '
    el.addEventListener event, handler, false
  return

$.off = (el, events, handler) ->
  for event in events.split ' '
    el.removeEventListener event, handler, false
  return

$.event = (event, detail, root=d) ->
  <% if (type === 'userscript') { %>
  if detail? and typeof cloneInto is 'function'
    detail = cloneInto detail, document.defaultView
  <% } %>
  root.dispatchEvent new CustomEvent event, {bubbles: true, detail}

$.open = 
<% if (type === 'userscript') { %>
  GM_openInTab
<% } else { %>
  (URL) -> window.open URL, '_blank'
<% } %>

$.debounce = (wait, fn) ->
  lastCall = 0
  timeout  = null
  that     = null
  args     = null
  exec = ->
    lastCall = Date.now()
    fn.apply that, args
  ->
    args = arguments
    that = this
    if lastCall < Date.now() - wait
      return exec()
    # stop current reset
    clearTimeout timeout
    # after wait, let next invocation execute immediately
    timeout = setTimeout exec, wait

$.queueTask = do ->
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

$.globalEval = (code) ->
  script = $.el 'script',
    textContent: code
  $.add (d.head or doc), script
  $.rm script

$.bytesToString = (size) ->
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

$.minmax = (value, min, max) ->
  return (
    if value < min
      min
    else
      if value > max
        max
      else
        value
    )

$.item = (key, val) ->
  item = {}
  item[key] = val
  item

$.syncing = {}

<% if (type === 'crx') { %>
$.sync = do ->
  chrome.storage.onChanged.addListener (changes) ->
    for key of changes
      if cb = $.syncing[key]
        cb changes[key].newValue, key
    return
  (key, cb) -> $.syncing[key] = cb

$.desync = (key) -> delete $.syncing[key]

$.localKeys = [
  # filters
  'name',
  'uniqueID',
  'tripcode',
  'capcode',
  'email',
  'subject',
  'comment',
  'flag',
  'filename',
  'dimensions',
  'filesize',
  'MD5',
  # custom css
  'usercss'
]

# https://developer.chrome.com/extensions/storage.html

$.delete = (keys) ->
  chrome.storage.sync.remove keys

$.get = (key, val, cb) ->
  if typeof cb is 'function'
    items = $.item key, val
  else
    items = key
    cb = val
  localItems = null
  syncItems  = null
  for key, val of items
    if key in $.localKeys
      (localItems or= {})[key] = val
    else
      (syncItems  or= {})[key] = val

  count = 0
  done  = (item) ->
    if chrome.runtime.lastError
      c.error chrome.runtime.lastError.message
    $.extend items, item
    cb items unless --count

  if localItems
    count++
    chrome.storage.local.get localItems, done
  if syncItems
    count++
    chrome.storage.sync.get  syncItems,  done

$.set = do ->
  items =
    sync: {}
    local: {}
  timeout = {}

  setArea = (area) ->
    data = items[area]
    return if !Object.keys(data).length or timeout[area]
    items[area] = {}
    chrome.storage[area].set data, ->
      if chrome.runtime.lastError
        c.error chrome.runtime.lastError.message
        for key, val of data when key not of items[area]
          items[area][key] = val
        timeout[area] = setTimeout setArea, $.MINUTE, area
        return
      delete timeout[area]

  setAll = $.debounce $.SECOND, ->
    for key in $.localKeys
      if key of items.sync
        items.local[key] = items.sync[key]
        delete items.sync[key]
    try
      setArea 'local'
      setArea 'sync'
    catch err
      c.error err.stack

  (key, val) ->
    if typeof key is 'string'
      items.sync[key] = val
    else
      $.extend items.sync, key
    setAll()
$.clear = (cb) ->
  count = 2
  done = ->
    if chrome.runtime.lastError
      c.error chrome.runtime.lastError.message
      return
    cb?() unless --count
  chrome.storage.local.clear done
  chrome.storage.sync.clear done
<% } else { %>

# http://wiki.greasespot.net/Main_Page
$.sync = do ->
  $.on window, 'storage', ({key, newValue}) ->
    if cb = $.syncing[key]
      cb JSON.parse(newValue), key
  (key, cb) -> $.syncing[g.NAMESPACE + key] = cb

$.desync = (key) -> delete $.syncing[g.NAMESPACE + key]

$.delete = (keys) ->
  unless keys instanceof Array
    keys = [keys]
  for key in keys
    key = g.NAMESPACE + key
    localStorage.removeItem key
    GM_deleteValue key
  return

$.get = (key, val, cb) ->
  if typeof cb is 'function'
    items = $.item key, val
  else
    items = key
    cb = val
  $.queueTask ->
    for key of items
      if val = GM_getValue g.NAMESPACE + key
        items[key] = JSON.parse val
    cb items

$.set = do ->
  set = (key, val) ->
    key = g.NAMESPACE + key
    val = JSON.stringify val
    if key of $.syncing
      # for `storage` events
      localStorage.setItem key, val
    GM_setValue key, val
  (keys, val) ->
    if typeof keys is 'string'
      set keys, val
      return
    for key, val of keys
      set key, val
    return
$.clear = (cb) ->
  $.delete GM_listValues().map (key) -> key.replace g.NAMESPACE, ''
  cb?()
<% } %>

$$ = (selector, root=d.body) ->
  [root.querySelectorAll(selector)...]
