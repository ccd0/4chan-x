# loosely follows the jquery api:
# http://api.jquery.com/
# not chainable
$ = (selector, root=d.body) ->
  root.querySelector selector
$$ = (selector, root=d.body) ->
  [root.querySelectorAll(selector)...]

$.SECOND = 1000
$.MINUTE = 1000 * 60
$.HOUR   = 1000 * 60 * 60
$.DAY    = 1000 * 60 * 60 * 24
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
    {type, whenModified, upCallbacks, form, sync} = extra
    r = new XMLHttpRequest()
    type or= form and 'post' or 'get'
    r.open type, url, !sync
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
    req = $.ajax url, options
    $.on req, 'load', (e) ->
      cb.call @, e for cb in @callbacks
      @evt = e
      delete @callbacks
    $.on req, 'abort', rm
    $.on req, 'error', rm
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
$.addStyle = (css) ->
  style = $.el 'style',
    textContent: css
  $.asap (-> d.head), ->
    $.add d.head, style
  style
$.x = (path, root=d.body) ->
  # XPathResult.ANY_UNORDERED_NODE_TYPE === 8
  d.evaluate(path, root, null, 8, null).singleNodeValue
$.addClass = (el, className...) ->
  el.classList.add className...
$.rmClass = (el, className...) ->
  el.classList.remove className...
$.hasClass = (el, className) ->
  el.classList.contains className
$.rm = (el) ->
  el.remove()
$.rmAll = (root) ->
  # https://gist.github.com/MayhemYDG/8646194
  root.textContent = null
$.tn = (s) ->
  d.createTextNode s
$.nodes = (nodes) ->
  unless nodes instanceof Array
    return nodes
  frag = d.createDocumentFragment()
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
  root.dispatchEvent new CustomEvent event, {bubbles: true, detail}
<% if (type === 'userscript') { %>
$.open = GM_openInTab
<% } else { %>
$.open = (URL) -> window.open URL, '_blank'
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
do ->
  items =
    local: {}
    sync:  {}

  $.delete = (keys) ->
    if typeof keys is 'string'
      keys = [keys]
    for key in keys
      delete items.local[key]
      delete items.sync[key]
    chrome.storage.sync.remove keys

  $.get = (key, val, cb) ->
    if typeof cb is 'function'
      data = $.item key, val
    else
      data = key
      cb = val

    localItems = null
    syncItems  = null
    for key, val of data
      if key in $.localKeys
        (localItems or= {})[key] = val
      else
        (syncItems  or= {})[key] = val

    count = 0
    done  = (result) ->
      if chrome.runtime.lastError
        c.error chrome.runtime.lastError.message
      $.extend data, result
      cb data unless --count

    if localItems
      count++
      chrome.storage.local.get localItems, done
    if syncItems
      count++
      chrome.storage.sync.get  syncItems,  done

  timeout = {}
  setArea = (area) ->
    data = items[area]
    return if !Object.keys(data).length or timeout[area] > Date.now()
    chrome.storage[area].set data, ->
      if chrome.runtime.lastError
        c.error chrome.runtime.lastError.message
        for key, val of data when key not of items[area]
          if area is 'sync' and chrome.storage.sync.QUOTA_BYTES_PER_ITEM < JSON.stringify(val).length + key.length
            c.error chrome.runtime.lastError.message, key, val
            continue
          items[area][key] = val
        setTimeout setArea, $.MINUTE, area
        timeout[area] = Date.now() + $.MINUTE
        return
      delete timeout[area]
    items[area] = {}

  setSync = $.debounce $.SECOND, ->
    setArea 'sync'

  $.set = (key, val) ->
    if typeof key is 'string'
      items.sync[key] = val
    else
      $.extend items.sync, key
    for key in $.localKeys when key of items.sync
      items.local[key] = items.sync[key]
      delete items.sync[key]
    setArea 'local'
    setSync()

  $.clear = (cb) ->
    items.local = {}
    items.sync  = {}
    count = 2
    done  = ->
      if chrome.runtime.lastError
        c.error chrome.runtime.lastError.message
        return
      cb?() unless --count
    chrome.storage.local.clear done
    chrome.storage.sync.clear  done
<% } else { %>
# http://wiki.greasespot.net/Main_Page
$.sync = do ->
  $.on window, 'storage', ({key, newValue}) ->
    if cb = $.syncing[key]
      cb JSON.parse(newValue), key
  (key, cb) -> $.syncing[g.NAMESPACE + key] = cb
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
