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
  blockedURLs = {}
  blockedError = (url) ->
    return if blockedURLs[url]
    blockedURLs[url] = true
    message = $.el 'div',
      <%= html(
        '${g.NAME} was blocked from loading the following URL:<br><span></span><br>' +
        '[<a href="${g.FAQ}#why-was-4chan-x-blocked-from-loading-a-url" target="_blank">More info</a>]'
      ) %>
    $('span', message).textContent = (if /^\/\//.test url then location.protocol else '') + url
    new Notice 'error', message, 30, -> delete blockedURLs[url]
  (url, options, extra={}) ->
    {type, whenModified, upCallbacks, form} = extra
    r = new XMLHttpRequest()
    type or= form and 'post' or 'get'
    try
      r.open type, url, true
    catch err
      blockedError url
      options.onerror?()
      return
    if whenModified
      r.setRequestHeader 'If-Modified-Since', lastModified[url] if url of lastModified
      $.on r, 'load', -> lastModified[url] = r.getResponseHeader 'Last-Modified'
    if /\.json$/.test url
      r.responseType = 'json'
    $.extend r, options
    $.extend r.upload, upCallbacks
    r.send form
    r

do ->
  reqs = {}
  $.cache = (url, cb, options) ->
    if req = reqs[url]
      if req.readyState is 4
        $.queueTask -> cb.call req, req.evt
      else
        req.callbacks.push cb
      return req
    rm = -> delete reqs[url]
    try
      return unless req = $.ajax url, options
    catch err
      return
    $.on req, 'load', (e) ->
      cb.call @, e for cb in @callbacks
      @evt = e
      @cached = true
      delete @callbacks
    $.on req, 'abort error', rm
    req.callbacks = [cb]
    reqs[url] = req
  $.cleanCache = (testf) ->
    for url of reqs when testf url
      delete reqs[url]
    return

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

$.onExists = (root, selector, subtree, cb) ->
  if el = $ selector, root
    return cb el
  observer = new MutationObserver ->
    if el = $ selector, root
      observer.disconnect()
      cb el
  observer.observe root, {childList: true, subtree}

$.addStyle = (css, id, test) ->
  style = $.el 'style',
    id: id
    textContent: css
  $.asap (-> d.head and (!test? or test())), ->
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

$.one = (el, events, handler) ->
  cb = (e) ->
    $.off el, events, cb
    handler.call @, e
  $.on el, events, cb

$.event = (event, detail, root=d) ->
  <% if (type === 'userscript') { %>
  if detail? and typeof cloneInto is 'function'
    detail = cloneInto detail, d.defaultView
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

$.hasAudio = (video) ->
  video.mozHasAudio or !!video.webkitAudioDecodedByteCount

$.item = (key, val) ->
  item = {}
  item[key] = val
  item

$.syncing = {}

<% if (type === 'crx') { %>
# https://developer.chrome.com/extensions/storage.html
$.localKeys = {}

chrome.storage.onChanged.addListener (changes, area) ->
  for key of changes
    cb = $.syncing[key]
    if cb and (key of $.localKeys) is (area is 'local')
      cb changes[key].newValue, key
  return
$.sync = (key, cb) ->
  $.syncing[key] = cb
$.forceSync = -> return

$.get = (key, val, cb) ->
  if typeof cb is 'function'
    data = $.item key, val
  else
    data = key
    cb = val

  results = {}
  get = (area) ->
    chrome.storage[area].get Object.keys(data), (result) ->
      if chrome.runtime.lastError
        c.error chrome.runtime.lastError.message
      results[area] = result
      if results.local and results.sync
        $.extend data, results.sync
        $.extend data, results.local
        $.localKeys[key] = true for key of results.local
        cb data
  get 'local'
  get 'sync'

do ->
  items =
    local: {}
    sync:  {}

  exceedsQuota = (key, value) ->
    # bytes in UTF-8
    unescape(encodeURIComponent(JSON.stringify(key))).length + unescape(encodeURIComponent(JSON.stringify(value))).length > chrome.storage.sync.QUOTA_BYTES_PER_ITEM

  $.delete = (keys) ->
    if typeof keys is 'string'
      keys = [keys]
    for key in keys
      delete items.local[key]
      delete items.sync[key]
      delete $.localKeys[key]
    chrome.storage.local.remove keys
    chrome.storage.sync.remove keys

  timeout = {}
  setArea = (area, cb) ->
    data = {}
    $.extend data, items[area]
    return if !Object.keys(data).length or timeout[area] > Date.now()
    chrome.storage[area].set data, ->
      if err = chrome.runtime.lastError
        c.error err.message
        setTimeout setArea, $.MINUTE, area
        timeout[area] = Date.now() + $.MINUTE
        return cb? err

      delete timeout[area]
      delete items[area][key] for key of data when items[area][key] is data[key]
      if area is 'local'
        items.sync[key] = val for key, val of data when not exceedsQuota(key, val)
        setSync()
      else
        oldLocal = for key of data when key not of items.local
          delete $.localKeys[key]
          key
        chrome.storage.local.remove oldLocal
      cb?()

  setSync = $.debounce $.SECOND, ->
    setArea 'sync'

  $.set = (key, val, cb) ->
    if typeof key is 'string'
      data = $.item key, val
    else
      data = key
      cb = val
    $.extend items.local, data
    $.localKeys[key] = true for key of data
    setArea 'local', cb

  $.clear = (cb) ->
    items.local = {}
    items.sync  = {}
    $.localKeys = {}
    count = 2
    err   = null
    done  = ->
      if chrome.runtime.lastError
        c.error chrome.runtime.lastError.message
      err ?= chrome.runtime.lastError
      cb? err unless --count
    chrome.storage.local.clear done
    chrome.storage.sync.clear  done
<% } else { %>

# http://wiki.greasespot.net/Main_Page
$.oldValue = {}

$.sync = (key, cb) ->
  key = g.NAMESPACE + key
  $.syncing[key] = cb
  $.oldValue[key] = GM_getValue key

do ->
  onChange = (key) ->
    return unless cb = $.syncing[key]
    newValue = GM_getValue key
    return if newValue is $.oldValue[key]
    if newValue?
      $.oldValue[key] = newValue
      cb JSON.parse(newValue), key
    else
      delete $.oldValue[key]
      cb undefined, key
  $.on window, 'storage', ({key}) -> onChange key

  $.forceSync = (key) ->
    # Storage events don't work across origins
    # e.g. http://boards.4chan.org and https://boards.4chan.org
    # so force a check for changes to avoid lost data.
    onChange g.NAMESPACE + key

$.delete = (keys) ->
  unless keys instanceof Array
    keys = [keys]
  for key in keys
    key = g.NAMESPACE + key
    GM_deleteValue key
    if key of $.syncing
      delete $.oldValue[key]
      # for `storage` events
      localStorage.removeItem key
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
    GM_setValue key, val
    if key of $.syncing
      $.oldValue[key] = val
      # for `storage` events
      localStorage.setItem key, val

  (keys, val, cb) ->
    if typeof keys is 'string'
      set keys, val
    else
      set key, value for key, value of keys
      cb = val
    cb?()

$.clear = (cb) ->
  try
    $.delete GM_listValues().map (key) -> key.replace g.NAMESPACE, ''
  catch err
    # XXX https://github.com/greasemonkey/greasemonkey/issues/2033
    $.delete Object.keys(Conf)
    $.delete ['previousversion', 'AutoWatch', 'cooldown.global', 'QR Size', 'captchas', 'QR.persona', 'hiddenPSA']
    $.delete ("#{id}.position" for id in ['embedding', 'updater', 'thread-stats', 'thread-watcher', 'qr'])
    boards = (a.textContent for a in $$ '#boardNavDesktop > .boardList > a')
    boards.push 'qa'
    $.delete ("cooldown.#{board}" for board in boards)
  cb?()
<% } %>

$$ = (selector, root=d.body) ->
  [root.querySelectorAll(selector)...]
