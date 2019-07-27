# loosely follows the jquery api:
# http://api.jquery.com/
# not chainable
$ = (selector, root=d.body) ->
  root.querySelector selector

$.DAY = 24 * (
  $.HOUR = 60 * (
    $.MINUTE = 60 * (
      $.SECOND = 1000
    )
  )
)

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
  if window.wrappedJSObject and not XMLHttpRequest.wrappedJSObject
    pageXHR = XPCNativeWrapper window.wrappedJSObject.XMLHttpRequest
  else
    pageXHR = XMLHttpRequest

  (url, options={}) ->
    options.responseType ?= 'json'
    options.type or= options.form and 'post' or 'get'
    # XXX https://forums.lanik.us/viewtopic.php?f=64&t=24173&p=78310
    url = url.replace /^((?:https?:)?\/\/(?:\w+\.)?(?:4chan|4channel|4cdn)\.org)\/adv\//, '$1//adv/'
    <% if (type === 'crx') { %>
    # XXX https://bugs.chromium.org/p/chromium/issues/detail?id=920638
    if Conf['Chromium CORB Bug'] and g.SITE.software is 'yotsuba' and !options.testCORB
      return $.ajaxPage url, options
    <% } %>
    {onloadend, timeout, responseType, withCredentials, type, onprogress, form, headers} = options
    r = new pageXHR()
    try
      r.open type, url, true
      for key, value of (headers or {})
        r.setRequestHeader key, value
      $.extend r, {onloadend, timeout, responseType, withCredentials}
      $.extend r.upload, {onprogress}
      # connection error or content blocker
      $.on r, 'error', -> (c.warn "4chan X failed to load: #{url}" unless r.status)
      <% if (type === 'crx') { %>
      # XXX https://bugs.chromium.org/p/chromium/issues/detail?id=920638
      $.on r, 'load', ->
        if !Conf['Chromium CORB Bug'] and r.readyState is 4 and r.status is 200 and r.statusText is '' and r.response is null
          $.set 'Chromium CORB Bug', (Conf['Chromium CORB Bug'] = Date.now())
      <% } %>
      r.send form
    catch err
      # XXX Some content blockers in Firefox (e.g. Adblock Plus and NoScript) throw an exception instead of simulating a connection error.
      throw err unless err.result is 0x805e0006
      r.onloadend = onloadend
      $.queueTask $.event, 'error',   null, r
      $.queueTask $.event, 'loadend', null, r
    r

<% if (type === 'crx') { %>
# XXX https://bugs.chromium.org/p/chromium/issues/detail?id=920638
do ->
  requestID = 0
  requests = {}

  $.ajaxPageInit = ->
    if Conf['Chromium CORB Bug'] and g.SITE.software is 'yotsuba'
      unless 0 <= Date.now() - Conf['Chromium CORB Bug'] < 2 * $.DAY
        $.ajax "#{location.protocol}//a.4cdn.org/boards.json",
          testCORB: true
          onloadend: ->
            if @response
              $.set 'Chromium CORB Bug', (Conf['Chromium CORB Bug'] = false)

    $.global ->
      window.FCX.requests = {}

      document.addEventListener '4chanXAjax', (e) ->
        {url, timeout, responseType, withCredentials, type, onprogress, form, headers, id} = e.detail
        window.FCX.requests[id] = r = new XMLHttpRequest()
        r.open type, url, true
        for key, value of (headers or {})
          r.setRequestHeader key, value
        r.responseType = if responseType is 'document' then 'text' else responseType
        r.timeout = timeout
        r.withCredentials = withCredentials
        if onprogress
          r.upload.onprogress = (e) ->
            {loaded, total} = e
            detail = {loaded, total, id}
            document.dispatchEvent new CustomEvent '4chanXAjaxProgress', {bubbles: true, detail}
        r.onloadend = ->
          delete window.FCX.requests[id]
          {status, statusText, response} = @
          responseHeaderString = @getAllResponseHeaders()
          detail = {status, statusText, response, responseHeaderString, id}
          document.dispatchEvent new CustomEvent '4chanXAjaxLoadend', {bubbles: true, detail}
        # connection error or content blocker
        r.onerror = ->
          console.warn "4chan X failed to load: #{url}" unless r.status
        if form
          fd = new FormData()
          for entry in form
            fd.append(entry[0], entry[1])
        else
          fd = null
        r.send fd
      , false

      document.addEventListener '4chanXAjaxAbort', (e) ->
        return unless (r = window.FCX.requests[e.detail.id])
        r.abort()
      , false

    $.on d, '4chanXAjaxProgress', (e) ->
      return unless (req = requests[e.detail.id])
      req.upload.onprogress.call req.upload, e.detail

    $.on d, '4chanXAjaxLoadend', (e) ->
      return unless (req = requests[e.detail.id])
      delete requests[e.detail.id]
      if e.detail.status
        $.extend req, e.detail
        if req.responseType is 'document'
          req.response = new DOMParser().parseFromString(e.detail.response, 'text/html')
      req.onloadend()

  $.ajaxPage = (url, options={}) ->
    {onloadend, timeout, responseType, withCredentials, type, onprogress, form, headers} = options
    id = requestID++
    requests[id] = req = new CrossOrigin.Request()
    $.extend req, {responseType, onloadend}
    req.upload = {onprogress}
    req.abort = ->
      $.event '4chanXAjaxAbort', {id}
    form = Array.from(form.entries()) if form
    $.event '4chanXAjax', {url, timeout, responseType, withCredentials, type, onprogress: !!onprogress, form, headers, id}
    req
<% } %>

# Status Code 304: Not modified
# With the `If-Modified-Since` header we only receive the HTTP headers and no body for 304 responses.
# This saves a lot of bandwidth and CPU time for both the users and the servers.
$.lastModified = {}
$.whenModified = (url, bucket, cb, options={}) ->
  {timeout, ajax} = options
  params = []
  # XXX https://bugs.chromium.org/p/chromium/issues/detail?id=643659
  params.push "s=#{bucket}" if $.engine is 'blink'
  params.push "t=#{Date.now()}" if url.split('/')[2] is 'a.4cdn.org'
  url0 = url
  url += '?' + params.join('&') if params.length
  headers = {}
  if (t = $.lastModified[bucket]?[url0])?
    headers['If-Modified-Since'] = t
  r = (ajax or $.ajax) url, {
    onloadend: ->
      ($.lastModified[bucket] or= {})[url0] = @getResponseHeader('Last-Modified')
      cb.call @
    timeout
    headers
  }
  r

do ->
  reqs = {}
  $.cache = (url, cb, options={}) ->
    {ajax} = options
    if (req = reqs[url])
      if req.callbacks
        req.callbacks.push cb
      else
        $.queueTask -> cb.call req, {isCached: true}
      return req
    onloadend = ->
      unless @status
        delete reqs[url]
      for cb in @callbacks
        do (cb) => $.queueTask => cb.call @, {isCached: false}
      delete @callbacks
    req = (ajax or $.ajax) url, {onloadend}
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

$.onExists = (root, selector, cb) ->
  if el = $ selector, root
    return cb el
  observer = new MutationObserver ->
    if el = $ selector, root
      observer.disconnect()
      cb el
  observer.observe root, {childList: true, subtree: true}

$.addStyle = (css, id, test='head') ->
  style = $.el 'style',
    textContent: css
  style.id = id if id?
  $.onExists doc, test, ->
    $.add d.head, style
  style

$.addCSP = (policy) ->
  meta = $.el 'meta',
    httpEquiv: 'Content-Security-Policy'
    content:   policy
  if d.head
    $.add d.head, meta
    $.rm meta
  else
    head = $.add (doc or d), $.el('head')
    $.add head, meta
    $.rm head

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
  el?.remove()

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

$.el = (tag, properties, properties2) ->
  el = d.createElement tag
  $.extend el, properties  if properties
  $.extend el, properties2 if properties2
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
  root.dispatchEvent new CustomEvent event, {bubbles: true, cancelable: true, detail}

<% if (type === 'userscript') { %>
# XXX Make $.event work in Pale Moon with GM 3.x (no cloneInto function).
do ->
  return unless /PaleMoon\//.test(navigator.userAgent) and +GM_info?.version?.split('.')[0] >= 2 and typeof cloneInto is 'undefined'

  try
    new CustomEvent 'x', detail: {}
  catch err
    unsafeConstructors =
      Object: unsafeWindow.Object
      Array:  unsafeWindow.Array
    clone = (obj) ->
      if obj? and typeof obj is 'object' and (constructor = unsafeConstructors[obj.constructor.name])
        obj2 = new constructor()
        obj2[key] = clone val for key, val of obj
        obj2
      else
        obj
    $.event = (event, detail, root=d) ->
      root.dispatchEvent new CustomEvent event, {bubbles: true, cancelable: true, detail: clone detail}
<% } %>

$.modifiedClick = (e) ->
  e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0

$.open = 
<% if (type === 'userscript') { %>
  if GM?.openInTab?
    GM.openInTab
  else if GM_openInTab?
    GM_openInTab
  else
    (url) -> window.open url, '_blank'
<% } else { %>
  (url) -> window.open url, '_blank'
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

$.globalEval = (code, data) ->
  script = $.el 'script',
    textContent: code
  $.extend script.dataset, data if data
  $.add (d.head or doc), script
  $.rm script

$.global = (fn, data) ->
  if doc
    $.globalEval "(#{fn})();", data
  else
    # XXX dwb
    fn()

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

$.luma = (rgb) ->
  rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114

$.unescape = (text) ->
  return text unless text?
  text.replace(/<[^>]*>/g, '').replace /&(amp|#039|quot|lt|gt|#44);/g, (c) ->
    (({'&amp;': '&', '&#039;': "'", '&quot;': '"', '&lt;': '<', '&gt;': '>', '&#44;': ','})[c])

$.engine = do ->
  return 'edge'   if /Edge\//.test navigator.userAgent
  return 'blink'  if /Chrome\//.test navigator.userAgent
  return 'webkit' if /WebKit\//.test navigator.userAgent
  return 'gecko'  if /Gecko\/|Goanna/.test navigator.userAgent # Goanna = Pale Moon 26+

$.platform = '<%= type %>';

$.hasStorage = do ->
  try
    return true if localStorage[g.NAMESPACE + 'hasStorage'] is 'true'
    localStorage[g.NAMESPACE + 'hasStorage'] = 'true'
    return localStorage[g.NAMESPACE + 'hasStorage'] is 'true'
  catch
    false

$.item = (key, val) ->
  item = {}
  item[key] = val
  item

$.oneItemSugar = (fn) ->
  (key, val, cb) ->
    if typeof key is 'string'
      fn $.item(key, val), cb
    else
      fn key, val

$.syncing = {}

$.securityCheck = (data) ->
  if location.protocol isnt 'https:'
    delete data['Redirect to HTTPS']

<% if (type === 'crx') { %>
# https://developer.chrome.com/extensions/storage.html
$.oldValue =
  local: {}
  sync:  {}

chrome.storage.onChanged.addListener (changes, area) ->
  for key of changes
    oldValue = $.oldValue.local[key] ? $.oldValue.sync[key]
    $.oldValue[area][key] = changes[key].newValue
    newValue = $.oldValue.local[key] ? $.oldValue.sync[key]
    cb = $.syncing[key]
    if cb and JSON.stringify(newValue) isnt JSON.stringify(oldValue)
      cb newValue, key
  return
$.sync = (key, cb) ->
  $.syncing[key] = cb
$.forceSync = -> return

$.crxWorking = ->
  try
    if chrome.runtime.getManifest()
      return true
  unless $.crxWarningShown
    msg = $.el 'div',
      <%= html('4chan X seems to have been updated. You will need to <a href="javascript:;">reload</a> the page.') %>
    $.on $('a', msg), 'click', -> location.reload()
    new Notice 'warning', msg
    $.crxWarningShown = true
  false

$.get = $.oneItemSugar (data, cb) ->
  return unless $.crxWorking()
  results = {}
  get = (area) ->
    keys = Object.keys data
    # XXX slow performance in Firefox
    if $.engine is 'gecko' and area is 'sync' and keys.length > 3
      keys = null
    chrome.storage[area].get keys, (result) ->
      if chrome.runtime.lastError
        c.error chrome.runtime.lastError.message
      if keys is null
        result2 = {}
        result2[key] = val for key, val of result when key of data
        result = result2
      for key of data
        $.oldValue[area][key] = result[key]
      results[area] = result
      if results.local and results.sync
        $.extend data, results.sync
        $.extend data, results.local
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
    return unless $.crxWorking()
    if typeof keys is 'string'
      keys = [keys]
    for key in keys
      delete items.local[key]
      delete items.sync[key]
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
        chrome.storage.local.remove (key for key of data when not (key of items.local))
      cb?()

  setSync = $.debounce $.SECOND, ->
    setArea 'sync'

  $.set = $.oneItemSugar (data, cb) ->
    return unless $.crxWorking()
    $.securityCheck data
    $.extend items.local, data
    setArea 'local', cb

  $.clear = (cb) ->
    return unless $.crxWorking()
    items.local = {}
    items.sync  = {}
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
# https://tampermonkey.net/documentation.php

if GM?.deleteValue? and window.BroadcastChannel and not GM_addValueChangeListener?

  $.syncChannel = new BroadcastChannel(g.NAMESPACE + 'sync')

  $.on $.syncChannel, 'message', (e) ->
    for key, val of e.data when (cb = $.syncing[key])
      cb JSON.parse(JSON.stringify(val)), key

  $.sync = (key, cb) ->
    $.syncing[key] = cb

  $.forceSync = ->

  $.delete = (keys, cb) ->
    unless keys instanceof Array
      keys = [keys]
    Promise.all(GM.deleteValue(g.NAMESPACE + key) for key in keys).then ->
      items = {}
      items[key] = undefined for key in keys
      $.syncChannel.postMessage items
      cb?()

  $.get = $.oneItemSugar (items, cb) ->
    keys = Object.keys items
    Promise.all(GM.getValue(g.NAMESPACE + key) for key in keys).then (values) ->
      for val, i in values when val
        items[keys[i]] = JSON.parse val
      cb items

  $.set = $.oneItemSugar (items, cb) ->
    $.securityCheck items
    Promise.all(GM.setValue(g.NAMESPACE + key, JSON.stringify(val)) for key, val of items).then ->
      $.syncChannel.postMessage items
      cb?()

  $.clear = (cb) ->
    GM.listValues().then((keys) ->
      $.delete keys.map((key) -> key.replace g.NAMESPACE, ''), cb
    ).catch( ->
      $.delete Object.keys(Conf).concat(['previousversion', 'QR Size', 'QR.persona']), cb
    )
else

  unless GM_deleteValue?
    $.perProtocolSettings = true

  if GM_deleteValue?
    $.getValue   = GM_getValue
    $.listValues = -> GM_listValues() # error when called if missing
  else if $.hasStorage
    $.getValue = (key) -> localStorage[key]
    $.listValues = ->
      key for key of localStorage when key[...g.NAMESPACE.length] is g.NAMESPACE
  else
    $.getValue   = ->
    $.listValues = -> []

  if GM_addValueChangeListener?
    $.setValue    = GM_setValue
    $.deleteValue = GM_deleteValue
  else if GM_deleteValue?
    $.oldValue = {}
    $.setValue = (key, val) ->
      GM_setValue key, val
      if key of $.syncing
        $.oldValue[key]   = val
        localStorage[key] = val if $.hasStorage # for `storage` events
    $.deleteValue = (key) ->
      GM_deleteValue key
      if key of $.syncing
        delete $.oldValue[key]
        localStorage.removeItem key if $.hasStorage # for `storage` events
    $.cantSync = true if !$.hasStorage
  else if $.hasStorage
    $.oldValue = {}
    $.setValue = (key, val) ->
      $.oldValue[key]   = val if key of $.syncing
      localStorage[key] = val
    $.deleteValue = (key) ->
      delete $.oldValue[key] if key of $.syncing
      localStorage.removeItem key
  else
    $.setValue = ->
    $.deleteValue = ->
    $.cantSync = $.cantSet = true

  if GM_addValueChangeListener?
    $.sync = (key, cb) ->
      $.syncing[key] = GM_addValueChangeListener g.NAMESPACE + key, (key2, oldValue, newValue, remote) ->
        if remote
          newValue = JSON.parse newValue unless newValue is undefined
          cb newValue, key
    $.forceSync = ->
  else if GM_deleteValue? or $.hasStorage
    $.sync = (key, cb) ->
      key = g.NAMESPACE + key
      $.syncing[key] = cb
      $.oldValue[key] = $.getValue key

    do ->
      onChange = ({key, newValue}) ->
        return if not (cb = $.syncing[key])
        if newValue?
          return if newValue is $.oldValue[key]
          $.oldValue[key] = newValue
          cb JSON.parse(newValue), key[g.NAMESPACE.length..]
        else
          return unless $.oldValue[key]?
          delete $.oldValue[key]
          cb undefined, key[g.NAMESPACE.length..]
      $.on window, 'storage', onChange

      $.forceSync = (key) ->
        # Storage events don't work across origins
        # e.g. http://boards.4chan.org and https://boards.4chan.org
        # so force a check for changes to avoid lost data.
        key = g.NAMESPACE + key
        onChange {key, newValue: $.getValue key}
  else
    $.sync = ->
    $.forceSync = ->

  $.delete = (keys) ->
    unless keys instanceof Array
      keys = [keys]
    for key in keys
      $.deleteValue g.NAMESPACE + key
    return

  $.get = $.oneItemSugar (items, cb) ->
    $.queueTask $.getSync, items, cb

  $.getSync = (items, cb) ->
    for key of items when (val2 = $.getValue g.NAMESPACE + key)
      try
        items[key] = JSON.parse val2
      catch err
        # XXX https://github.com/ccd0/4chan-x/issues/2218
        unless /^(?:undefined)*$/.test(val2)
          throw err
    cb items

  $.set = $.oneItemSugar (items, cb) ->
    $.securityCheck items
    $.queueTask ->
      for key, value of items
        $.setValue(g.NAMESPACE + key, JSON.stringify value)
      cb?()

  $.clear = (cb) ->
    # XXX https://github.com/greasemonkey/greasemonkey/issues/2033
    # Also support case where GM_listValues is not defined.
    $.delete Object.keys(Conf)
    $.delete ['previousversion', 'QR Size', 'QR.persona']
    try
      $.delete $.listValues().map (key) -> key.replace g.NAMESPACE, ''
    cb?()

<% } %>
