Config =
  main:
    Enhancing:
      '404 Redirect':                 [true,  'Redirect dead threads and images']
      'Keybinds':                     [true,  'Binds actions to keys']
      'Time Formatting':              [true,  'Arbitrarily formatted timestamps, using your local time']
      'File Info Formatting':         [true,  'Reformats the file information']
      'Comment Expansion':            [true,  'Expand too long comments']
      'Thread Expansion':             [true,  'View all replies']
      'Index Navigation':             [true,  'Navigate to previous / next thread']
      'Reply Navigation':             [false, 'Navigate to top / bottom of thread']
      'Check for Updates':            [true,  'Check for updated versions of 4chan X']
    Filtering:
      'Anonymize':                    [false, 'Make everybody anonymous']
      'Filter':                       [true,  'Self-moderation placebo']
      'Recursive Filtering':          [true,  'Filter replies of filtered posts, recursively']
      'Reply Hiding':                 [true,  'Hide single replies']
      'Thread Hiding':                [true,  'Hide entire threads']
      'Show Stubs':                   [true,  'Of hidden threads / replies']
    Imaging:
      'Image Auto-Gif':               [false, 'Animate gif thumbnails']
      'Image Expansion':              [true,  'Expand images']
      'Image Hover':                  [false, 'Show full image on mouseover']
      'Sauce':                        [true,  'Add sauce to images']
      'Reveal Spoilers':              [false, 'Replace spoiler thumbnails by the original thumbnail']
      'Expand From Current':          [false, 'Expand images from current position to thread end.']
    Menu:
      'Menu':                         [true,  'Add a drop-down menu in posts.']
      'Report Link':                  [true,  'Add a report link to the menu.']
      'Delete Link':                  [true,  'Add post and image deletion links to the menu.']
      'Download Link':                [true,  'Add a download with original filename link to the menu. Chrome-only currently.']
      'Archive Link':                 [true,  'Add an archive link to the menu.']
    Monitoring:
      'Thread Updater':               [true,  'Update threads. Has more options in its own dialog.']
      'Unread Count':                 [true,  'Show unread post count in tab title']
      'Unread Favicon':               [true,  'Show a different favicon when there are unread posts']
      'Post in Title':                [true,  'Show the op\'s post in the tab title']
      'Thread Stats':                 [true,  'Display reply and image count']
      'Thread Watcher':               [true,  'Bookmark threads']
      'Auto Watch':                   [true,  'Automatically watch threads that you start']
      'Auto Watch Reply':             [false, 'Automatically watch threads that you reply to']
    Posting:
      'Quick Reply':                  [true,  'Reply without leaving the page.']
      'Cooldown':                     [true,  'Prevent "flood detected" errors.']
      'Persistent QR':                [false, 'The Quick reply won\'t disappear after posting.']
      'Auto Hide QR':                 [true,  'Automatically hide the quick reply when posting.']
      'Open Reply in New Tab':        [false, 'Open replies in a new tab that are made from the main board.']
      'Remember QR size':             [false, 'Remember the size of the Quick reply (Firefox only).']
      'Remember Subject':             [false, 'Remember the subject field, instead of resetting after posting.']
      'Remember Spoiler':             [false, 'Remember the spoiler state, instead of resetting after posting.']
      'Hide Original Post Form':      [true,  'Replace the normal post form with a shortcut to open the QR.']
    Quoting:
      'Quote Backlinks':              [true,  'Add quote backlinks']
      'OP Backlinks':                 [false, 'Add backlinks to the OP']
      'Quote Highlighting':           [true,  'Highlight the previewed post']
      'Quote Inline':                 [true,  'Show quoted post inline on quote click']
      'Quote Preview':                [true,  'Show quote content on hover']
      'Resurrect Quotes':             [true,  'Linkify dead quotes to archives']
      'Indicate OP quote':            [true,  'Add \'(OP)\' to OP quotes']
      'Indicate Cross-thread Quotes': [true,  'Add \'(Cross-thread)\' to cross-threads quotes']
      'Forward Hiding':               [true,  'Hide original posts of inlined backlinks']
  filter:
    name: [
      '# Filter any namefags:'
      '#/^(?!Anonymous$)/'
    ].join '\n'
    uniqueid: [
      '# Filter a specific ID:'
      '#/Txhvk1Tl/'
    ].join '\n'
    tripcode: [
      '# Filter any tripfags'
      '#/^!/'
    ].join '\n'
    mod: [
      '# Set a custom class for mods:'
      '#/Mod$/;highlight:mod;op:yes'
      '# Set a custom class for moot:'
      '#/Admin$/;highlight:moot;op:yes'
    ].join '\n'
    email: [
      '# Filter any e-mails that are not `sage` on /a/ and /jp/:'
      '#/^(?!sage$)/;boards:a,jp'
    ].join '\n'
    subject: [
      '# Filter Generals on /v/:'
      '#/general/i;boards:v;op:only'
    ].join '\n'
    comment: [
      '# Filter Stallman copypasta on /g/:'
      '#/what you\'re refer+ing to as linux/i;boards:g'
    ].join '\n'
    country: [
      ''
    ].join '\n'
    filename: [
      ''
    ].join '\n'
    dimensions: [
      '# Highlight potential wallpapers:'
      '#/1920x1080/;op:yes;highlight;top:no;boards:w,wg'
    ].join '\n'
    filesize: [
      ''
    ].join '\n'
    md5: [
      ''
    ].join '\n'
  sauces: [
    'http://iqdb.org/?url=$1'
    'http://www.google.com/searchbyimage?image_url=$1'
    '#http://tineye.com/search?url=$1'
    '#http://saucenao.com/search.php?db=999&url=$1'
    '#http://3d.iqdb.org/?url=$1'
    '#http://regex.info/exif.cgi?imgurl=$2'
    '# uploaders:'
    '#http://imgur.com/upload?url=$2;text:Upload to imgur'
    '#http://omploader.org/upload?url1=$2;text:Upload to omploader'
    '# "View Same" in archives:'
    '#http://archive.foolz.us/search/image/$3/;text:View same on foolz'
    '#http://archive.foolz.us/$4/search/image/$3/;text:View same on foolz /$4/'
    '#https://archive.installgentoo.net/$4/image/$3;text:View same on installgentoo /$4/'
  ].join '\n'
  time: '%m/%d/%y(%a)%H:%M'
  backlink: '>>%id'
  fileInfo: '%l (%p%s, %r)'
  favicon: 'ferongr'
  hotkeys:
    # QR & Options
    openQR:          ['i',      'Open QR with post number inserted']
    openEmptyQR:     ['I',      'Open QR without post number inserted']
    openOptions:     ['ctrl+o', 'Open Options']
    close:           ['Esc',    'Close Options or QR']
    spoiler:         ['ctrl+s', 'Quick spoiler tags']
    code:            ['alt+c',  'Quick code tags']
    submit:          ['alt+s',  'Submit post']
    # Thread related
    watch:           ['w',      'Watch thread']
    update:          ['u',      'Update now']
    unreadCountTo0:  ['z',      'Reset unread status']
    # Images
    expandImage:     ['m',      'Expand selected image']
    expandAllImages: ['M',      'Expand all images']
    # Board Navigation
    zero:            ['0',      'Jump to page 0']
    nextPage:        ['L',      'Jump to the next page']
    previousPage:    ['H',      'Jump to the previous page']
    # Thread Navigation
    nextThread:      ['n',      'See next thread']
    previousThread:  ['p',      'See previous thread']
    expandThread:    ['e',      'Expand thread']
    openThreadTab:   ['o',      'Open thread in current tab']
    openThread:      ['O',      'Open thread in new tab']
    # Reply Navigation
    nextReply:       ['J',      'Select next reply']
    previousReply:   ['K',      'Select previous reply']
    hide:            ['x',      'Hide thread']
  updater:
    checkbox:
      'Scrolling':   [false, 'Scroll updated posts into view. Only enabled at bottom of page.']
      'Scroll BG':   [false, 'Scroll background tabs']
      'Verbose':     [true,  'Show countdown timer, new post count']
      'Auto Update': [true,  'Automatically fetch new posts']
    'Interval': 30

Conf = {}
d = document
g = {}

UI =
  dialog: (id, position, html) ->
    el = d.createElement 'div'
    el.className = 'reply dialog'
    el.innerHTML = html
    el.id        = id
    el.style.cssText = localStorage.getItem("#{Main.namespace}#{id}.position") or position
    el.querySelector('.move').addEventListener 'mousedown', UI.dragstart, false
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
  SECOND: 1000
  MINUTE: 1000*60
  HOUR  : 1000*60*60
  DAY   : 1000*60*60*24
  log:
    # XXX GreaseMonkey can't into console.log.bind
    console.log.bind? console
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
    {type, headers, upCallbacks, form} = opts
    r = new XMLHttpRequest()
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
  addStyle: (css) ->
    style = $.el 'style',
      textContent: css
    $.add d.head, style
    style
  x: (path, root=d.body) ->
    # XPathResult.ANY_UNORDERED_NODE_TYPE is 8
    d.evaluate(path, root, null, 8, null).
      singleNodeValue
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
  open: (url) ->
    (GM_openInTab or window.open) location.protocol + url, '_blank'
  event: (el, e) ->
    el.dispatchEvent e
  globalEval: (code) ->
    script = $.el 'script', textContent: code
    $.add d.head, script
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

$$ = (selector, root=d.body) ->
  Array::slice.call root.querySelectorAll selector

Filter =
  filters: {}
  init: ->
    for key of Config.filter
      @filters[key] = []
      for filter in Conf[key].split '\n'
        continue if filter[0] is '#'

        unless regexp = filter.match /\/(.+)\/(\w*)/
          continue

        # Don't mix up filter flags with the regular expression.
        filter = filter.replace regexp[0], ''

        # Do not add this filter to the list if it's not a global one
        # and it's not specifically applicable to the current board.
        # Defaults to global.
        boards = filter.match(/boards:([^;]+)/)?[1].toLowerCase() or 'global'
        if boards isnt 'global' and boards.split(',').indexOf(g.BOARD) is -1
          continue

        try
          if key is 'md5'
            # MD5 filter will use strings instead of regular expressions.
            regexp = regexp[1]
          else
            # Please, don't write silly regular expressions.
            regexp = RegExp regexp[1], regexp[2]
        catch e
          # I warned you, bro.
          alert e.message
          continue

        # Filter OPs along with their threads, replies only, or both.
        # Defaults to replies only.
        op = filter.match(/[^t]op:(yes|no|only)/)?[1] or 'no'

        # Overrule the `Show Stubs` setting.
        # Defaults to stub showing.
        stub = switch filter.match(/stub:(yes|no)/)?[1]
          when 'yes'
            true
          when 'no'
            false
          else
            Conf['Show Stubs']

        # Highlight the post, or hide it.
        # If not specified, the highlight class will be filter_highlight.
        # Defaults to post hiding.
        if hl = /highlight/.test filter
          hl  = filter.match(/highlight:(\w+)/)?[1] or 'filter_highlight'
          # Put highlighted OP's thread on top of the board page or not.
          # Defaults to on top.
          top = filter.match(/top:(yes|no)/)?[1] or 'yes'
          top = top is 'yes' # Turn it into a boolean

        @filters[key].push @createFilter regexp, op, stub, hl, top

      # Only execute filter types that contain valid filters.
      unless @filters[key].length
        delete @filters[key]

    if Object.keys(@filters).length
      Main.callbacks.push @node

  createFilter: (regexp, op, stub, hl, top) ->
    test =
      if typeof regexp is 'string'
        # MD5 checking
        (value) -> regexp is value
      else
        (value) -> regexp.test value
    settings =
      hide:  !hl
      stub:  stub
      class: hl
      top:   top
    (value, isOP) ->
      if isOP and op is 'no' or !isOP and op is 'only'
        return false
      unless test value
        return false
      settings

  node: (post) ->
    return if post.isInlined
    isOP = post.ID is post.threadID
    {root} = post
    for key of Filter.filters
      value = Filter[key] post
      if value is false
        # Continue if there's nothing to filter (no tripcode for example).
        continue
      for filter in Filter.filters[key]
        unless result = filter value, isOP
          continue

        # Hide
        if result.hide
          if isOP
            unless g.REPLY
              ThreadHiding.hide root.parentNode, result.stub
            else
              continue
          else
            ReplyHiding.hide root, result.stub
          return

        # Highlight
        $.addClass root, result.class
        if isOP and result.top and not g.REPLY
          # Put the highlighted OPs' thread on top of the board page...
          thisThread = root.parentNode
          # ...before the first non highlighted thread.
          if firstThread = $('div[class="postContainer opContainer"]').parentNode
            $.before firstThread, [thisThread, thisThread.nextElementSibling]

  name: (post) ->
    $('.name', post.el).textContent
  uniqueid: (post) ->
    if uid = $ '.posteruid', post.el
      return uid.textContent[5...-1]
    false
  tripcode: (post) ->
    if trip = $ '.postertrip', post.el
      return trip.textContent
    false
  mod: (post) ->
    if mod = $ '.capcode', post.el
      return mod.textContent
    false
  email: (post) ->
    if mail = $ '.useremail', post.el
      # remove 'mailto:'
      # decode %20 into space for example
      return decodeURIComponent mail.href[7..]
    false
  subject: (post) ->
    $('.postInfo .subject', post.el).textContent or false
  comment: (post) ->
    text = []
    # XPathResult.ORDERED_NODE_SNAPSHOT_TYPE is 7
    nodes = d.evaluate './/br|.//text()', post.blockquote, null, 7, null
    for i in [0...nodes.snapshotLength]
      text.push if data = nodes.snapshotItem(i).data then data else '\n'
    text.join ''
  country: (post) ->
    if flag = $ '.countryFlag', post.el
      return flag.title
    false
  filename: (post) ->
    {fileInfo} = post
    if fileInfo
      if file = $ '.fileText > span', fileInfo
        return file.title
      else
        return fileInfo.firstElementChild.dataset.filename
    false
  dimensions: (post) ->
    {fileInfo} = post
    if fileInfo and match = fileInfo.textContent.match /\d+x\d+/
      return match[0]
    false
  filesize: (post) ->
    {img} = post
    if img
      return img.alt
    false
  md5: (post) ->
    {img} = post
    if img
      return img.dataset.md5
    false

  menuInit: ->
    div = $.el 'div',
      textContent: 'Filter'

    entry =
      el: div
      open: -> true
      children: []

    for type in [
      ['Name',             'name']
      ['Unique ID',        'uniqueid']
      ['Tripcode',         'tripcode']
      ['Admin/Mod',        'mod']
      ['E-mail',           'email']
      ['Subject',          'subject']
      ['Comment',          'comment']
      ['Country',          'country']
      ['Filename',         'filename']
      ['Image dimensions', 'dimensions']
      ['Filesize',         'filesize']
      ['Image MD5',        'md5']
    ]
      # Add a sub entry for each filter type.
      entry.children.push Filter.createSubEntry type[0], type[1]

    Menu.addEntry entry

  createSubEntry: (text, type) ->
    el = $.el 'a',
      href: 'javascript:;'
      textContent: text
    # Define the onclick var outside of open's scope to $.off it properly.
    onclick = null

    open = (post) ->
      value = Filter[type] post
      return false if value is false
      $.off el, 'click', onclick
      onclick = ->
        # Convert value -> regexp, unless type is md5
        re = if type is 'md5' then value else value.replace ///
          /
          | \\
          | \^
          | \$
          | \n
          | \.
          | \(
          | \)
          | \{
          | \}
          | \[
          | \]
          | \?
          | \*
          | \+
          | \|
          ///g, (c) ->
            if c is '\n'
              '\\n'
            else if c is '\\'
              '\\\\'
            else
              "\\#{c}"

        re =
          if type is 'md5'
            "/#{value}/"
          else
            "/^#{re}$/"
        if /\bop\b/.test post.class
          re += ';op:yes'

        # Add a new line before the regexp unless the text is empty.
        save = if save = $.get type, '' then "#{save}\n#{re}" else re
        $.set type, save

        # Open the options and display & focus the relevant filter textarea.
        Options.dialog()
        select = $ 'select[name=filter]', $.id 'options'
        select.value = type
        $.event select, new Event 'change'
        $.id('filter_tab').checked = true
        ta = select.nextElementSibling
        tl = ta.textLength
        ta.setSelectionRange tl, tl
        ta.focus()
      $.on el, 'click', onclick
      true

    return el: el, open: open

StrikethroughQuotes =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined
    for quote in post.quotes
      if (el = $.id quote.hash[1..]) and el.hidden
        $.addClass quote, 'filtered'
        if Conf['Recursive Filtering']
          show_stub = !!$.x 'preceding-sibling::div[contains(@class,"stub")]', el
          ReplyHiding.hide post.root, show_stub
    return

ExpandComment =
  init: ->
    for a in $$ '.abbr'
      $.on a.firstElementChild, 'click', ExpandComment.expand
    return
  expand: (e) ->
    e.preventDefault()
    [_, threadID, replyID] = @href.match /(\d+)#p(\d+)/
    @textContent = "Loading #{replyID}..."
    a = @
    $.cache @pathname, -> ExpandComment.parse @, a, threadID, replyID
  parse: (req, a, threadID, replyID) ->
    if req.status isnt 200
      a.textContent = "#{req.status} #{req.statusText}"
      return

    doc = d.implementation.createHTMLDocument ''
    doc.documentElement.innerHTML = req.response

    # Import the node to fix quote.hashes
    # as they're empty when in a different document.
    node = d.importNode doc.getElementById("m#{replyID}"), true

    quotes = node.getElementsByClassName 'quotelink'
    for quote in quotes
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote
      quote.href = "res/#{href}" # Fix pathnames
    post =
      blockquote: node
      threadID:   threadID
      quotes:     quotes
      backlinks:  []
    if Conf['Resurrect Quotes']
      Quotify.node      post
    if Conf['Quote Preview']
      QuotePreview.node post
    if Conf['Quote Inline']
      QuoteInline.node  post
    if Conf['Indicate OP quote']
      QuoteOP.node      post
    if Conf['Indicate Cross-thread Quotes']
      QuoteCT.node      post
    $.replace a.parentNode.parentNode, node
    Main.prettify node

ExpandThread =
  init: ->
    for span in $$ '.summary'
      a = $.el 'a',
        textContent: "+ #{span.textContent}"
        className: 'summary desktop'
        href: 'javascript:;'
      $.on a, 'click', -> ExpandThread.toggle @parentNode
      $.replace span, a

  toggle: (thread) ->
    pathname = "/#{g.BOARD}/res/#{thread.id[1..]}"
    a = $ '.summary', thread

    switch a.textContent[0]
      when '+'
        a.textContent = a.textContent.replace '+', '× Loading...'
        $.cache pathname, -> ExpandThread.parse @, thread, a

      when '×'
        a.textContent = a.textContent.replace '× Loading...', '+'
        $.cache.requests[pathname].abort()

      when '-'
        a.textContent = a.textContent.replace '-', '+'
        #goddamit moot
        num = switch g.BOARD
          when 'b', 'vg' then 3
          when 't' then 1
          else 5
        replies = $$ '.replyContainer', thread
        replies.splice replies.length - num, num
        for reply in replies
          $.rm reply
    return

  parse: (req, thread, a) ->
    if req.status isnt 200
      a.textContent = "#{req.status} #{req.statusText}"
      $.off a, 'click', ExpandThread.cb.toggle
      return

    a.textContent = a.textContent.replace '× Loading...', '-'

    doc = d.implementation.createHTMLDocument ''
    doc.documentElement.innerHTML = req.response

    threadID = thread.id[1..]
    nodes    = []
    for reply in $$ '.replyContainer', doc
      reply = d.importNode reply, true
      for quote in $$ '.quotelink', reply
        href = quote.getAttribute 'href'
        continue if href[0] is '/' # Cross-board quote
        quote.href = "res/#{href}" # Fix pathnames
      id = reply.id[2..]
      link = $ 'a[title="Highlight this post"]', reply
      link.href = "res/#{threadID}#p#{id}"
      link.nextSibling.href = "res/#{threadID}#q#{id}"
      nodes.push reply
    # eat everything, then replace with fresh full posts
    for post in $$ '.summary ~ .replyContainer', a.parentNode
      $.rm post
    for backlink in $$ '.backlink', a.previousElementSibling
      # Keep backlinks from other threads.
      $.rm backlink unless $.id backlink.hash[1..]
    $.after a, nodes

ThreadHiding =
  init: ->
    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    for thread in $$ '.thread'
      a = $.el 'a',
        className: 'hide_thread_button'
        innerHTML: '<span>[ - ]</span>'
        href: 'javascript:;'
      $.on a, 'click', ThreadHiding.cb
      $.prepend thread, a

      if thread.id[1..] of hiddenThreads
        ThreadHiding.hide thread
    return

  cb: ->
    ThreadHiding.toggle $.x 'ancestor::div[parent::div[@class="board"]]', @

  toggle: (thread) ->
    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    id = thread.id[1..]
    if thread.hidden or /\bhidden_thread\b/.test thread.firstChild.className
      ThreadHiding.show thread
      delete hiddenThreads[id]
    else
      ThreadHiding.hide thread
      hiddenThreads[id] = Date.now()
    $.set "hiddenThreads/#{g.BOARD}/", hiddenThreads

  hide: (thread, show_stub=Conf['Show Stubs']) ->
    unless show_stub
      thread.hidden = true
      thread.nextElementSibling.hidden = true
      return

    return if /\bhidden_thread\b/.test thread.firstChild.className # already hidden once by the filter

    num     = 0
    if span = $ '.summary', thread
      num   = Number span.textContent.match /\d+/
    num    += $$('.opContainer ~ .replyContainer', thread).length
    text    = if num is 1 then '1 reply' else "#{num} replies"
    opInfo  = $('.op > .postInfo > .nameBlock', thread).textContent

    stub = $.el 'div',
      className: 'hide_thread_button hidden_thread'
      innerHTML: '<a href="javascript:;"><span>[ + ]</span> </a>'
    a = stub.firstChild
    $.on  a, 'click', ThreadHiding.cb
    $.add a, $.tn "#{opInfo} (#{text})"
    if Conf['Menu']
      menuButton = Menu.a.cloneNode true
      $.on menuButton, 'click', Menu.toggle
      $.add stub, [$.tn(' '), menuButton]
    $.prepend thread, stub

  show: (thread) ->
    if stub = $ '.hidden_thread', thread
      $.rm stub
    thread.hidden = false
    thread.nextElementSibling.hidden = false

ReplyHiding =
  init: ->
    Main.callbacks.push @node

  node: (post) ->
    return if post.isInlined or post.ID is post.threadID
    side = $ '.sideArrows', post.root
    $.addClass side, 'hide_reply_button'
    side.innerHTML = '<a href="javascript:;"><span>[ - ]</span></a>'
    $.on side.firstChild, 'click', ReplyHiding.toggle

    if post.ID of g.hiddenReplies
      ReplyHiding.hide post.root

  toggle: ->
    button = @parentNode
    root   = button.parentNode
    id     = root.id[2..]
    quotes = $$ ".quotelink[href$='#p#{id}'], .backlink[href$='#p#{id}']"
    if /\bstub\b/.test button.className
      ReplyHiding.show root
      for quote in quotes
        $.rmClass quote, 'filtered'
      delete g.hiddenReplies[id]
    else
      ReplyHiding.hide root
      for quote in quotes
        $.addClass quote, 'filtered'
      g.hiddenReplies[id] = Date.now()
    $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies

  hide: (root, show_stub=Conf['Show Stubs']) ->
    side = $ '.sideArrows', root
    return if side.hidden # already hidden once by the filter
    side.hidden = true
    el = side.nextElementSibling
    el.hidden = true

    return unless show_stub

    stub = $.el 'div',
      className: 'hide_reply_button stub'
      innerHTML: '<a href="javascript:;"><span>[ + ]</span> </a>'
    a = stub.firstChild
    $.on  a, 'click', ReplyHiding.toggle
    $.add a, $.tn $('.nameBlock', el).textContent
    if Conf['Menu']
      menuButton = Menu.a.cloneNode true
      $.on menuButton, 'click', Menu.toggle
      $.add stub, [$.tn(' '), menuButton]
    $.prepend root, stub

  show: (root) ->
    if stub = $ '.stub', root
      $.rm stub
    $('.sideArrows', root).hidden = false
    $('.post',       root).hidden = false

Menu =
  entries: []
  init: ->
    @a = $.el 'a',
      className: 'menu_button'
      href:      'javascript:;'
      innerHTML: '[<span></span>]'
    @el = $.el 'div',
      className: 'reply dialog'
      id:        'menu'
      tabIndex:  0
    $.on @el, 'click',   (e) -> e.stopPropagation()
    $.on @el, 'keydown', @keybinds

    # Doc here: https://github.com/MayhemYDG/4chan-x/wiki/Menu-API
    $.on d, 'AddMenuEntry', (e) -> Menu.addEntry e.detail

    Main.callbacks.push @node
  node: (post) ->
    if post.isInlined and !post.isCrosspost
      a = $ '.menu_button', post.el
    else
      a = Menu.a.cloneNode true
      $.add $('.postInfo', post.el), a
    $.on a, 'click', Menu.toggle

  toggle: (e) ->
    e.preventDefault()
    e.stopPropagation()

    if Menu.el.parentNode
      # Close if it's already opened.
      # Reopen if we clicked on another button.
      {lastOpener} = Menu
      Menu.close()
      return if lastOpener is @

    Menu.lastOpener = @
    post =
      if /\bhidden_thread\b/.test @parentNode.className
        $.x 'ancestor::div[parent::div[@class="board"]]/child::div[contains(@class,"opContainer")]', @
      else
        $.x 'ancestor::div[contains(@class,"postContainer")][1]', @
    Menu.open @, Main.preParse post
  open: (button, post) ->
    {el} = Menu
    # XXX GM/Scriptish require setAttribute
    el.setAttribute 'data-id', post.ID
    el.setAttribute 'data-rootid', post.root.id

    funk = (entry, parent) ->
      {children} = entry
      return unless entry.open post
      $.add parent, entry.el

      return unless children
      if subMenu = $ '.subMenu', entry.el
        # Reset sub menu, remove irrelevant entries.
        $.rm subMenu
      subMenu = $.el 'div',
        className: 'reply dialog subMenu'
      $.add entry.el, subMenu
      for child in children
        funk child, subMenu
      return
    for entry in Menu.entries
      funk entry, el

    Menu.focus $ '.entry', Menu.el
    $.on d, 'click', Menu.close
    $.add d.body, el

    # Position
    mRect = el.getBoundingClientRect()
    bRect = button.getBoundingClientRect()
    bTop  = d.documentElement.scrollTop  + d.body.scrollTop  + bRect.top
    bLeft = d.documentElement.scrollLeft + d.body.scrollLeft + bRect.left
    el.style.top =
      if bRect.top + bRect.height + mRect.height < d.documentElement.clientHeight
        bTop + bRect.height + 2 + 'px'
      else
        bTop - mRect.height - 2 + 'px'
    el.style.left =
      if bRect.left + mRect.width < d.documentElement.clientWidth
        bLeft + 'px'
      else
        bLeft + bRect.width - mRect.width + 'px'

    el.focus()
  close: ->
    {el} = Menu
    $.rm el
    for focused in $$ '.focused.entry', el
      $.rmClass focused, 'focused'
    el.innerHTML = null
    el.removeAttribute 'style'
    delete Menu.lastOpener
    delete Menu.focusedEntry
    $.off d, 'click', Menu.close

  keybinds: (e) ->
    el = Menu.focusedEntry

    switch Keybinds.keyCode(e) or e.keyCode
      when 'Esc'
        Menu.lastOpener.focus()
        Menu.close()
      when 13, 32 # 'Enter', 'Space'
        el.click()
      when 'Up'
        if next = el.previousElementSibling
          Menu.focus next
      when 'Down'
        if next = el.nextElementSibling
          Menu.focus next
      when 'Right'
        if (subMenu = $ '.subMenu', el) and next = subMenu.firstElementChild
          Menu.focus next
      when 'Left'
        if next = $.x 'parent::*[contains(@class,"subMenu")]/parent::*', el
          Menu.focus next
      else
        return

    e.preventDefault()
    e.stopPropagation()
  focus: (el) ->
    if focused = $.x 'parent::*/child::*[contains(@class,"focused")]', el
      $.rmClass focused, 'focused'
    for focused in $$ '.focused', el
      $.rmClass focused, 'focused'
    Menu.focusedEntry = el
    $.addClass el, 'focused'

  addEntry: (entry) ->
    funk = (entry) ->
      {el, children} = entry
      $.addClass el, 'entry'
      $.on el, 'focus mouseover', (e) ->
        e.stopPropagation()
        Menu.focus @
      return unless children
      $.addClass el, 'hasSubMenu'
      for child in children
        funk child
      return
    funk entry
    Menu.entries.push entry

Keybinds =
  init: ->
    for node in $$ '[accesskey]'
      node.removeAttribute 'accesskey'
    $.on d, 'keydown',  Keybinds.keydown

  keydown: (e) ->
    return unless key = Keybinds.keyCode e
    {target} = e
    if /TEXTAREA|INPUT/.test target.nodeName
      return unless (key is 'Esc') or (/\+/.test key)

    thread = Nav.getThread()
    switch key
      # QR & Options
      when Conf.openQR
        Keybinds.qr thread, true
      when Conf.openEmptyQR
        Keybinds.qr thread
      when Conf.openOptions
        Options.dialog() unless $.id 'overlay'
      when Conf.close
        if o = $.id 'overlay'
          Options.close.call o
        else if QR.el
          QR.close()
      when Conf.submit
        QR.submit() if QR.el and !QR.status()
      when Conf.spoiler
        return if target.nodeName isnt 'TEXTAREA'
        Keybinds.tags 'spoiler', target
      when Conf.code
        return if target.nodeName isnt 'TEXTAREA'
        Keybinds.tags 'code', target
      # Thread related
      when Conf.watch
        Watcher.toggle thread
      when Conf.update
        Updater.update()
      when Conf.unreadCountTo0
        Unread.replies = []
        Unread.update true
      # Images
      when Conf.expandImage
        Keybinds.img thread
      when Conf.expandAllImages
        Keybinds.img thread, true
      # Board Navigation
      when Conf.zero
        window.location = "/#{g.BOARD}/0#delform"
      when Conf.nextPage
        if link = $ 'link[rel=next]', d.head
          window.location = link.href
      when Conf.previousPage
        if link = $ 'link[rel=prev]', d.head
          window.location.href = link.href
      # Thread Navigation
      when Conf.nextThread
        return if g.REPLY
        Nav.scroll +1
      when Conf.previousThread
        return if g.REPLY
        Nav.scroll -1
      when Conf.expandThread
        ExpandThread.toggle thread
      when Conf.openThread
        Keybinds.open thread
      when Conf.openThreadTab
        Keybinds.open thread, true
      # Reply Navigation
      when Conf.nextReply
        Keybinds.hl +1, thread
      when Conf.previousReply
        Keybinds.hl -1, thread
      when Conf.hide
        ThreadHiding.toggle thread if /\bthread\b/.test thread.className
      else
        return
    e.preventDefault()

  keyCode: (e) ->
    key = switch kc = e.keyCode
      when 8
        ''
      when 27
        'Esc'
      when 37
        'Left'
      when 38
        'Up'
      when 39
        'Right'
      when 40
        'Down'
      when 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90 #0-9, A-Z
        c = String.fromCharCode kc
        if e.shiftKey then c else c.toLowerCase()
      else
        null
    if key
      if e.altKey  then key = 'alt+'  + key
      if e.ctrlKey then key = 'ctrl+' + key
      if e.metaKey then key = 'meta+' + key
    key

  tags: (tag, ta) ->
    value    = ta.value
    selStart = ta.selectionStart
    selEnd   = ta.selectionEnd

    ta.value =
      value[...selStart] +
      "[#{tag}]" + value[selStart...selEnd] + "[/#{tag}]" +
      value[selEnd..]

    range = "[#{tag}]".length + selEnd
    # Move the caret to the end of the selection.
    ta.setSelectionRange range, range

    # Fire the 'input' event
    $.event ta, new Event 'input'

  img: (thread, all) ->
    if all
      $.id('imageExpand').click()
    else
      thumb = $ 'img[data-md5]', $('.post.highlight', thread) or thread
      ImageExpand.toggle thumb.parentNode

  qr: (thread, quote) ->
    if quote
      QR.quote.call $ 'a[title="Quote this post"]', $('.post.highlight', thread) or thread
    else
      QR.open()
    $('textarea', QR.el).focus()

  open: (thread, tab) ->
    id = thread.id[1..]
    url = "//boards.4chan.org/#{g.BOARD}/res/#{id}"
    if tab
      $.open url
    else
      location.href = url

  hl: (delta, thread) ->
    if post = $ '.reply.highlight', thread
      $.rmClass post, 'highlight'
      post.removeAttribute 'tabindex'
      rect = post.getBoundingClientRect()
      if rect.bottom >= 0 and rect.top <= d.documentElement.clientHeight # We're at least partially visible
        next = $.x 'child::div[contains(@class,"post reply")]',
          if delta is +1 then post.parentNode.nextElementSibling else post.parentNode.previousElementSibling
        unless next
          @focus post
          return
        return unless g.REPLY or $.x('ancestor::div[parent::div[@class="board"]]', next) is thread
        rect = next.getBoundingClientRect()
        if rect.top < 0 or rect.bottom > d.documentElement.clientHeight
          next.scrollIntoView delta is -1
        @focus next
        return

    replies = $$ '.reply', thread
    replies.reverse() if delta is -1
    for reply in replies
      rect = reply.getBoundingClientRect()
      if delta is +1 and rect.top >= 0 or delta is -1 and rect.bottom <= d.documentElement.clientHeight
        @focus reply
        return

  focus: (post) ->
    $.addClass post, 'highlight'
    post.tabIndex = 0
    post.focus()

Nav =
  # ◀ ▶
  init: ->
    span = $.el 'span',
      id: 'navlinks'
    prev = $.el 'a',
      textContent: '▲'
      href: 'javascript:;'
    next = $.el 'a',
      textContent: '▼'
      href: 'javascript:;'

    $.on prev, 'click', @prev
    $.on next, 'click', @next

    $.add span, [prev, $.tn(' '), next]
    $.add d.body, span

  prev: ->
    if g.REPLY
      window.scrollTo 0, 0
    else
      Nav.scroll -1

  next: ->
    if g.REPLY
      window.scrollTo 0, d.body.scrollHeight
    else
      Nav.scroll +1

  getThread: (full) ->
    Nav.threads = $$ '.thread:not([hidden])'
    for thread, i in Nav.threads
      rect = thread.getBoundingClientRect()
      {bottom} = rect
      if bottom > 0 #we have not scrolled past
        if full
          return [thread, i, rect]
        return thread
    return $ '.board'

  scroll: (delta) ->
    [thread, i, rect] = Nav.getThread true
    {top} = rect

    #unless we're not at the beginning of the current thread
    # (and thus wanting to move to beginning)
    # or we're above the first thread and don't want to skip it
    unless (delta is -1 and Math.ceil(top) < 0) or (delta is +1 and top > 1)
      i += delta

    {top} = Nav.threads[i]?.getBoundingClientRect()
    window.scrollBy 0, top

QR =
  init: ->
    return unless $.id 'postForm'
    Main.callbacks.push @node
    setTimeout @asyncInit

  asyncInit: ->
    if Conf['Hide Original Post Form']
      link = $.el 'h1', innerHTML: "<a href=javascript:;>#{if g.REPLY then 'Reply to Thread' else 'Start a Thread'}</a>"
      $.on link.firstChild, 'click', ->
        QR.open()
        $('select',   QR.el).value = 'new' unless g.REPLY
        $('textarea', QR.el).focus()
      $.before $.id('postForm'), link

    if Conf['Persistent QR']
      QR.dialog()
      QR.hide() if Conf['Auto Hide QR']
    $.on d, 'dragover',          QR.dragOver
    $.on d, 'drop',              QR.dropFile
    $.on d, 'dragstart dragend', QR.drag

  node: (post) ->
    $.on $('a[title="Quote this post"]', post.el), 'click', QR.quote

  open: ->
    if QR.el
      QR.el.hidden = false
      QR.unhide()
    else
      QR.dialog()
  close: ->
    QR.el.hidden = true
    QR.abort()
    d.activeElement.blur()
    $.rmClass QR.el, 'dump'
    for i in QR.replies
      QR.replies[0].rm()
    QR.cooldown.auto = false
    QR.status()
    QR.resetFileInput()
    if not Conf['Remember Spoiler'] and (spoiler = $.id 'spoiler').checked
      spoiler.click()
    QR.cleanError()
  hide: ->
    d.activeElement.blur()
    $.addClass QR.el, 'autohide'
    $.id('autohide').checked = true
  unhide: ->
    $.rmClass QR.el, 'autohide'
    $.id('autohide').checked = false
  toggleHide: ->
    @checked and QR.hide() or QR.unhide()

  error: (err) ->
    el = $ '.warning', QR.el
    if typeof err is 'string'
      el.textContent = err
    else
      el.innerHTML = null
      $.add el, err
    QR.open()
    if /captcha|verification/i.test el.textContent
      # Focus the captcha input on captcha error.
      $('[autocomplete]', QR.el).focus()
    alert el.textContent if d.hidden or d.oHidden or d.mozHidden or d.webkitHidden
  cleanError: ->
    $('.warning', QR.el).textContent = null

  status: (data={}) ->
    return unless QR.el
    if g.dead
      value    = 404
      disabled = true
      QR.cooldown.auto = false
    value = QR.cooldown.seconds or data.progress or value
    {input} = QR.status
    input.value =
      if QR.cooldown.auto and Conf['Cooldown']
        if value then "Auto #{value}" else 'Auto'
      else
        value or 'Submit'
    input.disabled = disabled or false

  cooldown:
    init: ->
      return unless Conf['Cooldown']
      QR.cooldown.start $.get "/#{g.BOARD}/cooldown", 0
      $.sync "/#{g.BOARD}/cooldown", QR.cooldown.start
    start: (timeout) ->
      seconds = Math.floor (timeout - Date.now()) / 1000
      QR.cooldown.count seconds
    set: (seconds) ->
      return unless Conf['Cooldown']
      QR.cooldown.count seconds
      $.set "/#{g.BOARD}/cooldown", Date.now() + seconds*$.SECOND
    count: (seconds) ->
      return unless 0 <= seconds <= 60
      setTimeout QR.cooldown.count, 1000, seconds-1
      QR.cooldown.seconds = seconds
      if seconds is 0
        $.delete "/#{g.BOARD}/cooldown"
        QR.submit() if QR.cooldown.auto
      QR.status()

  quote: (e) ->
    e?.preventDefault()
    QR.open()
    unless g.REPLY
      $('select', QR.el).value = $.x('ancestor::div[parent::div[@class="board"]]', @).id[1..]
    # Make sure we get the correct number, even with XXX censors
    id   = @previousSibling.hash[2..]
    text = ">>#{id}\n"

    sel = window.getSelection()
    if (s = sel.toString()) and id is $.x('ancestor-or-self::blockquote', sel.anchorNode)?.id.match(/\d+$/)[0]
      # XXX Opera needs d.getSelection() to retain linebreaks from the selected text
      s = d.getSelection() if $.engine is 'presto'
      s = s.replace /\n/g, '\n>'
      text += ">#{s}\n"

    ta = $ 'textarea', QR.el
    caretPos = ta.selectionStart
    # Replace selection for text.
    ta.value = ta.value[...caretPos] + text + ta.value[ta.selectionEnd..]
    ta.focus()
    # Move the caret to the end of the new quote.
    range = caretPos + text.length
    # XXX Opera counts newlines as double
    range += text.match(/\n/g).length if $.engine is 'presto'
    ta.setSelectionRange range, range

    # Fire the 'input' event
    $.event ta, new Event 'input'

  characterCount: ->
    counter = QR.charaCounter
    count   = @textLength
    counter.textContent = count
    counter.hidden      = count < 1000
    (if count > 1500 then $.addClass else $.rmClass) counter, 'warning'

  drag: (e) ->
    # Let it drag anything from the page.
    i = if e.type is 'dragstart' then 'off' else 'on'
    $[i] d, 'dragover', QR.dragOver
    $[i] d, 'drop',     QR.dropFile
  dragOver: (e) ->
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy' # cursor feedback
  dropFile: (e) ->
    # Let it only handle files from the desktop.
    return unless e.dataTransfer.files.length
    e.preventDefault()
    QR.open()
    QR.fileInput.call e.dataTransfer
    $.addClass QR.el, 'dump'
  fileInput: ->
    QR.cleanError()
    # Set or change current reply's file.
    if @files.length is 1
      file = @files[0]
      if file.size > @max
        QR.error 'File too large.'
        QR.resetFileInput()
      else if -1 is QR.mimeTypes.indexOf file.type
        QR.error 'Unsupported file type.'
        QR.resetFileInput()
      else
        QR.selected.setFile file
      return
    # Create new replies with these files.
    for file in @files
      if file.size > @max
        QR.error "File #{file.name} is too large."
        break
      else if -1 is QR.mimeTypes.indexOf file.type
        QR.error "#{file.name}: Unsupported file type."
        break
      unless QR.replies[QR.replies.length - 1].file
        # set last reply's file
        QR.replies[QR.replies.length - 1].setFile file
      else
        new QR.reply().setFile file
    $.addClass QR.el, 'dump'
    QR.resetFileInput() # reset input
  resetFileInput: ->
    input = $ '[type=file]', QR.el
    input.value = null
    return unless $.engine is 'presto'
    # XXX Opera needs extra care to reset its file input's value
    clone = $.el 'input',
      type: 'file'
      accept:   input.accept
      max:      input.max
      multiple: input.multiple
      size:     input.size
      title:    input.title
    $.on clone, 'change', QR.fileInput
    $.on clone, 'click',  (e) -> if e.shiftKey then QR.selected.rmFile() or e.preventDefault()
    $.replace input, clone

  replies: []
  reply: class
    constructor: ->
      # set values, or null, to avoid 'undefined' values in inputs
      prev     = QR.replies[QR.replies.length-1]
      persona  = $.get 'QR.persona', {}
      @name    = if prev then prev.name else persona.name or null
      @email   = if prev and !/^sage$/.test prev.email then prev.email   else persona.email or null
      @sub     = if prev and Conf['Remember Subject']  then prev.sub     else if Conf['Remember Subject'] then persona.sub else null
      @spoiler = if prev and Conf['Remember Spoiler']  then prev.spoiler else false
      @com = null

      @el = $.el 'a',
        className: 'thumbnail'
        draggable: true
        href: 'javascript:;'
        innerHTML: '<a class=remove>×</a><label hidden><input type=checkbox> Spoiler</label><span></span>'
      $('input', @el).checked = @spoiler
      $.on @el,               'click',      => @select()
      $.on $('.remove', @el), 'click',  (e) =>
        e.stopPropagation()
        @rm()
      $.on $('label',   @el), 'click',  (e) => e.stopPropagation()
      $.on $('input',   @el), 'change', (e) =>
        @spoiler = e.target.checked
        $.id('spoiler').checked = @spoiler if @el.id is 'selected'
      $.before $('#addReply', QR.el), @el

      $.on @el, 'dragstart', @dragStart
      $.on @el, 'dragenter', @dragEnter
      $.on @el, 'dragleave', @dragLeave
      $.on @el, 'dragover',  @dragOver
      $.on @el, 'dragend',   @dragEnd
      $.on @el, 'drop',      @drop

      QR.replies.push @
    setFile: (@file) ->
      @el.title = "#{file.name} (#{$.bytesToString file.size})"
      $('label', @el).hidden = false if QR.spoiler
      unless /^image/.test file.type
        @el.style.backgroundImage = null
        return
      url = window.URL or window.webkitURL
      # XXX Opera does not support window.URL.revokeObjectURL
      url.revokeObjectURL? @url

      # Create a redimensioned thumbnail.
      fileUrl = url.createObjectURL file
      img     = $.el 'img'

      $.on img, 'load', =>
        # Generate thumbnails only if they're really big.
        # Resized pictures through canvases look like ass,
        # so we generate thumbnails `s` times bigger then expected
        # to avoid crappy resized quality.
        s = 90*3
        if img.height < s or img.width < s
          @url = fileUrl
          @el.style.backgroundImage = "url(#{@url})"
          return
        if img.height <= img.width
          img.width  = s / img.height * img.width
          img.height = s
        else
          img.height = s / img.width  * img.height
          img.width  = s
        c = $.el 'canvas'
        c.height = img.height
        c.width  = img.width
        c.getContext('2d').drawImage img, 0, 0, img.width, img.height
        # Support for toBlob fucking when?
        data = atob c.toDataURL().split(',')[1]

        # DataUrl to Binary code from Aeosynth's 4chan X repo
        l = data.length
        ui8a = new Uint8Array l
        for i in  [0...l]
          ui8a[i] = data.charCodeAt i
        bb = new (window.MozBlobBuilder or window.WebKitBlobBuilder)()
        bb.append ui8a.buffer

        @url = url.createObjectURL bb.getBlob 'image/png'
        @el.style.backgroundImage = "url(#{@url})"
        url.revokeObjectURL? fileUrl

      img.src = fileUrl
    rmFile: ->
      QR.resetFileInput()
      delete @file
      @el.title = null
      @el.style.backgroundImage = null
      $('label', @el).hidden = true if QR.spoiler
      (window.URL or window.webkitURL).revokeObjectURL? @url
    select: ->
      QR.selected?.el.id = null
      QR.selected = @
      @el.id = 'selected'
      # Scroll the list to center the focused reply.
      rectEl   = @el.getBoundingClientRect()
      rectList = @el.parentNode.getBoundingClientRect()
      @el.parentNode.scrollLeft += rectEl.left + rectEl.width/2 - rectList.left - rectList.width/2
      # Load this reply's values.
      for data in ['name', 'email', 'sub', 'com']
        $("[name=#{data}]", QR.el).value = @[data]
      QR.characterCount.call $ 'textarea', QR.el
      $('#spoiler', QR.el).checked = @spoiler
    dragStart: ->
      $.addClass @, 'drag'
    dragEnter: ->
      $.addClass @, 'over'
    dragLeave: ->
      $.rmClass @, 'over'
    dragOver: (e) ->
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    drop: ->
      el    = $ '.drag', @parentNode
      index = (el) -> Array::slice.call(el.parentNode.children).indexOf el
      oldIndex = index el
      newIndex = index @
      if oldIndex < newIndex
        $.after  @, el
      else
        $.before @, el
      reply = QR.replies.splice(oldIndex, 1)[0]
      QR.replies.splice newIndex, 0, reply
    dragEnd: ->
      $.rmClass @, 'drag'
      if el = $ '.over', @parentNode
        $.rmClass el, 'over'
    rm: ->
      QR.resetFileInput()
      $.rm @el
      index = QR.replies.indexOf @
      if QR.replies.length is 1
        new QR.reply().select()
      else if @el.id is 'selected'
        (QR.replies[index-1] or QR.replies[index+1]).select()
      QR.replies.splice index, 1
      (window.URL or window.webkitURL).revokeObjectURL? @url
      delete @

  captcha:
    init: ->
      return unless QR.captchaIsEnabled = !!$.id 'captchaFormPart'
      if $.id 'recaptcha_challenge_field_holder'
        @ready()
      else
        @onready = => @ready()
        $.on $.id('recaptcha_widget_div'), 'DOMNodeInserted', @onready
    ready: ->
      if @challenge = $.id 'recaptcha_challenge_field_holder'
        $.off $.id('recaptcha_widget_div'), 'DOMNodeInserted', @onready
        delete @onready
      else
        return
      $.after $('.textarea', QR.el), $.el 'div',
        className: 'captchaimg'
        title: 'Reload'
        innerHTML: '<img>'
      $.after $('.captchaimg', QR.el), $.el 'div',
        className: 'captchainput'
        innerHTML: '<input title=Verification class=field autocomplete=off size=1>'
      @img   = $ '.captchaimg > img', QR.el
      @input = $ '.captchainput > input', QR.el
      $.on @img.parentNode, 'click',              @reload
      $.on @input,          'keydown',            @keydown
      $.on @challenge,      'DOMNodeInserted', => @load()
      $.sync 'captchas', (arr) => @count arr.length
      @count $.get('captchas', []).length
      # start with an uncached captcha
      @reload()
    save: ->
      return unless response = @input.value
      captchas = $.get 'captchas', []
      # Remove old captchas.
      while (captcha = captchas[0]) and captcha.time < Date.now()
        captchas.shift()
      captchas.push
        challenge: @challenge.firstChild.value
        response:  response
        time:      @timeout
      $.set 'captchas', captchas
      @count captchas.length
      @reload()
    load: ->
      # Timeout is available at RecaptchaState.timeout in seconds.
      # We use 5-1 minutes to give upload some time.
      @timeout  = Date.now() + 4*$.MINUTE
      challenge = @challenge.firstChild.value
      @img.alt  = challenge
      @img.src  = "//www.google.com/recaptcha/api/image?c=#{challenge}"
      @input.value = null
    count: (count) ->
      @input.placeholder = switch count
        when 0
          'Verification (Shift + Enter to cache)'
        when 1
          'Verification (1 cached captcha)'
        else
          "Verification (#{count} cached captchas)"
      @input.alt = count # For XTRM RICE.
    reload: (focus) ->
      # the "t" argument prevents the input from being focused
      window.location = 'javascript:Recaptcha.reload("t")'
      # Focus if we meant to.
      QR.captcha.input.focus() if focus
    keydown: (e) ->
      c = QR.captcha
      if e.keyCode is 8 and not c.input.value
        c.reload()
      else if e.keyCode is 13 and e.shiftKey
        c.save()
      else
        return
      e.preventDefault()

  dialog: ->
    QR.el = UI.dialog 'qr', 'top:0;right:0;', '
<div class=move>
  Quick Reply <input type=checkbox id=autohide title=Auto-hide>
  <span> <a class=close title=Close>×</a></span>
</div>
<form>
  <div><input id=dump type=button title="Dump list" value=+ class=field><input name=name title=Name placeholder=Name class=field size=1><input name=email title=E-mail placeholder=E-mail class=field size=1><input name=sub title=Subject placeholder=Subject class=field size=1></div>
  <div id=replies><div><a id=addReply href=javascript:; title="Add a reply">+</a></div></div>
  <div class=textarea><textarea name=com title=Comment placeholder=Comment class=field></textarea><span id=charCount></span></div>
  <div><input type=file title="Shift+Click to remove the selected file." multiple size=16><input type=submit></div>
  <label id=spoilerLabel><input type=checkbox id=spoiler> Spoiler Image</label>
  <div class=warning></div>
</form>'

    if Conf['Remember QR size'] and $.engine is 'gecko'
      $.on ta = $('textarea', QR.el), 'mouseup', ->
        $.set 'QR.size', @style.cssText
      ta.style.cssText = $.get 'QR.size', ''

    # Allow only this board's supported files.
    mimeTypes = $('ul.rules').firstElementChild.textContent.trim().match(/: (.+)/)[1].toLowerCase().replace /\w+/g, (type) ->
      switch type
        when 'jpg'
          'image/jpeg'
        when 'pdf'
          'application/pdf'
        when 'swf'
          'application/x-shockwave-flash'
        else
          "image/#{type}"
    QR.mimeTypes = mimeTypes.split ', '
    # Add empty mimeType to avoid errors with URLs selected in Window's file dialog.
    QR.mimeTypes.push ''
    fileInput        = $ 'input[type=file]', QR.el
    fileInput.max    = $('input[name=MAX_FILE_SIZE]').value
    fileInput.accept = mimeTypes if $.engine isnt 'presto' # Opera's accept attribute is fucked up

    QR.spoiler     = !!$ 'input[name=spoiler]'
    spoiler        = $ '#spoilerLabel', QR.el
    spoiler.hidden = !QR.spoiler

    QR.charaCounter = $ '#charCount', QR.el
    ta              = $ 'textarea',    QR.el

    unless g.REPLY
      # Make a list with visible threads and an option to create a new one.
      threads = '<option value=new>New thread</option>'
      for thread in $$ '.thread'
        id = thread.id[1..]
        threads += "<option value=#{id}>Thread #{id}</option>"
      $.prepend $('.move > span', QR.el), $.el 'select'
        innerHTML: threads
        title: 'Create a new thread / Reply to a thread'
      $.on $('select',  QR.el), 'mousedown', (e) -> e.stopPropagation()
    $.on $('#autohide', QR.el), 'change',    QR.toggleHide
    $.on $('.close',    QR.el), 'click',     QR.close
    $.on $('#dump',     QR.el), 'click',     -> QR.el.classList.toggle 'dump'
    $.on $('#addReply', QR.el), 'click',     -> new QR.reply().select()
    $.on $('form',      QR.el), 'submit',    QR.submit
    $.on ta,                    'input',     -> QR.selected.el.lastChild.textContent = @value
    $.on ta,                    'input',     QR.characterCount
    $.on fileInput,             'change',    QR.fileInput
    $.on fileInput,             'click',     (e) -> if e.shiftKey then QR.selected.rmFile() or e.preventDefault()
    $.on spoiler.firstChild,    'change',    -> $('input', QR.selected.el).click()
    $.on $('.warning',  QR.el), 'click',     QR.cleanError

    new QR.reply().select()
    # save selected reply's data
    for name in ['name', 'email', 'sub', 'com']
      # The input event replaces keyup, change and paste events.
      $.on $("[name=#{name}]", QR.el), 'input', ->
        QR.selected[@name] = @value
        # Disable auto-posting if you're typing in the first reply
        # during the last 5 seconds of the cooldown.
        if QR.cooldown.auto and QR.selected is QR.replies[0] and 0 < QR.cooldown.seconds < 6
          QR.cooldown.auto = false

    QR.status.input = $ 'input[type=submit]', QR.el
    QR.status()
    QR.cooldown.init()
    QR.captcha.init()
    $.add d.body, QR.el

    # Create a custom event when the QR dialog is first initialized.
    # Use it to extend the QR's functionalities, or for XTRM RICE.
    $.event QR.el, new CustomEvent 'QRDialogCreation',
      bubbles: true

  submit: (e) ->
    e?.preventDefault()
    if QR.cooldown.seconds
      QR.cooldown.auto = !QR.cooldown.auto
      QR.status()
      return
    QR.abort()
    reply = QR.replies[0]

    threadID = g.THREAD_ID or $('select', QR.el).value

    # prevent errors
    unless threadID is 'new' and reply.file or threadID isnt 'new' and (reply.com or reply.file)
      err = 'No file selected.'
    else if QR.captchaIsEnabled
      # get oldest valid captcha
      captchas = $.get 'captchas', []
      # remove old captchas
      while (captcha = captchas[0]) and captcha.time < Date.now()
        captchas.shift()
      if captcha  = captchas.shift()
        challenge = captcha.challenge
        response  = captcha.response
      else
        challenge   = QR.captcha.img.alt
        if response = QR.captcha.input.value then QR.captcha.reload()
      $.set 'captchas', captchas
      QR.captcha.count captchas.length
      unless response
        err = 'No valid captcha.'

    if err
      # stop auto-posting
      QR.cooldown.auto = false
      QR.status()
      QR.error err
      return
    QR.cleanError()

    # Enable auto-posting if we have stuff to post, disable it otherwise.
    QR.cooldown.auto = QR.replies.length > 1
    if Conf['Auto Hide QR'] and not QR.cooldown.auto
      QR.hide()
    if not QR.cooldown.auto and $.x 'ancestor::div[@id="qr"]', d.activeElement
      # Unfocus the focused element if it is one within the QR and we're not auto-posting.
      d.activeElement.blur()

    # Starting to upload might take some time.
    # Provide some feedback that we're starting to submit.
    QR.status progress: '...'

    post =
      resto:   threadID
      name:    reply.name
      email:   reply.email
      sub:     reply.sub
      com:     reply.com
      upfile:  reply.file
      spoiler: reply.spoiler
      mode:    'regist'
      pwd: if m = d.cookie.match(/4chan_pass=([^;]+)/) then decodeURIComponent m[1] else $('input[name=pwd]').value
      recaptcha_challenge_field: challenge
      recaptcha_response_field:  response + ' '

    callbacks =
      onload: ->
        QR.response @response
      onerror: ->
        # Connection error, or
        # CORS disabled error on www.4chan.org/banned
        QR.status()
        QR.error $.el 'a',
          href: '//www.4chan.org/banned'
          target: '_blank'
          textContent: 'Connection error, or you are banned.'
    opts =
      form: $.formData post
      upCallbacks:
        onload: ->
          # Upload done, waiting for response.
          QR.status progress: '...'
        onprogress: (e) ->
          # Uploading...
          QR.status progress: "#{Math.round e.loaded / e.total * 100}%"

    QR.ajax = $.ajax $.id('postForm').parentNode.action, callbacks, opts

  response: (html) ->
    doc = d.implementation.createHTMLDocument ''
    doc.documentElement.innerHTML = html
    if doc.title is '4chan - Banned' # Ban/warn check
      bs  = $$ 'b', doc
      err = $.el 'span',
        innerHTML:
          if /^You were issued a warning/.test $('.boxcontent', doc).textContent.trim()
            "You were issued a warning on #{bs[0].innerHTML} as #{bs[3].innerHTML}.<br>Warning reason: #{bs[1].innerHTML}"
          else
            "You are banned! ;_;<br>Please click <a href=//www.4chan.org/banned target=_blank>HERE</a> to see the reason."
    else if msg = doc.getElementById 'errmsg' # error!
      err = msg.textContent
      if msg.firstChild.tagName # duplicate image link
        err = msg.firstChild
        err.target = '_blank'
    else unless msg = $ 'b', doc
      err = 'Connection error with sys.4chan.org.'

    if err
      if /captcha|verification/i.test(err) or err is 'Connection error with sys.4chan.org.'
        # Enable auto-post if we have some cached captchas.
        QR.cooldown.auto = !!$.get('captchas', []).length
        # Too many frequent mistyped captchas will auto-ban you!
        # On connection error, the post most likely didn't go through.
        QR.cooldown.set 2
      else # stop auto-posting
        QR.cooldown.auto = false
      QR.status()
      QR.error err
      return

    reply = QR.replies[0]

    persona = $.get 'QR.persona', {}
    persona =
      name:  reply.name
      email: if /^sage$/.test reply.email then persona.email else reply.email
      sub:   if Conf['Remember Subject']  then reply.sub     else null
    $.set 'QR.persona', persona

    [_, threadID, postID] = msg.lastChild.textContent.match /thread:(\d+),no:(\d+)/

    # Post/upload confirmed as successful.
    $.event QR.el, new CustomEvent 'QRPostSuccessful',
      bubbles: true
      detail:
        threadID: threadID
        postID:   postID

    if threadID is '0' # new thread
      # auto-noko
      location.pathname = "/#{g.BOARD}/res/#{postID}"
    else
      # Enable auto-posting if we have stuff to post, disable it otherwise.
      QR.cooldown.auto = QR.replies.length > 1
      QR.cooldown.set if /sage/i.test reply.email then 60 else 30
      if Conf['Open Reply in New Tab'] && !g.REPLY && !QR.cooldown.auto
        $.open "//boards.4chan.org/#{g.BOARD}/res/#{threadID}#p#{postID}"

    if Conf['Persistent QR'] or QR.cooldown.auto
      reply.rm()
    else
      QR.close()

    QR.status()
    QR.resetFileInput()

  abort: ->
    QR.ajax?.abort()
    delete QR.ajax
    QR.status()

Options =
  init: ->
    for settings in ['navtopr', 'navbotr']
      a = $.el 'a',
        href: 'javascript:;'
        className: 'settingsWindowLink'
        textContent: '4chan X Settings'
      $.on a, 'click', Options.dialog
      el = $.id(settings).firstElementChild
      el.hidden = true
      $.before el, a
    unless $.get 'firstrun'
      # Prevent race conditions
      Favicon.init() unless Favicon.el
      $.set 'firstrun', true
      Options.dialog()

  dialog: ->
    dialog = $.el 'div'
      id: 'options'
      className: 'reply dialog'
      innerHTML: '<div id=optionsbar>
  <div id=credits>
    <a target=_blank href=http://mayhemydg.github.com/4chan-x/>4chan X</a>
    | <a target=_blank href=https://raw.github.com/mayhemydg/4chan-x/master/changelog>' + Main.version + '</a>
    | <a target=_blank href=http://mayhemydg.github.com/4chan-x/#bug-report>Issues</a>
  </div>
  <div>
    <label for=main_tab>Main</label>
    | <label for=filter_tab>Filter</label>
    | <label for=sauces_tab>Sauce</label>
    | <label for=rice_tab>Rice</label>
    | <label for=keybinds_tab>Keybinds</label>
  </div>
</div>
<hr>
<div id=content>
  <input type=radio name=tab hidden id=main_tab checked>
  <div></div>
  <input type=radio name=tab hidden id=sauces_tab>
  <div>
    <div class=warning><code>Sauce</code> is disabled.</div>
    Lines starting with a <code>#</code> will be ignored.<br>
    You can specify a certain display text by appending <code>;text:[text]</code> to the url.
    <ul>These parameters will be replaced by their corresponding values:
      <li>$1: Thumbnail url.</li>
      <li>$2: Full image url.</li>
      <li>$3: MD5 hash.</li>
      <li>$4: Current board.</li>
    </ul>
    <textarea name=sauces id=sauces class=field></textarea>
  </div>
  <input type=radio name=tab hidden id=filter_tab>
  <div>
    <div class=warning><code>Filter</code> is disabled.</div>
    <select name=filter>
      <option value=guide>Guide</option>
      <option value=name>Name</option>
      <option value=uniqueid>Unique ID</option>
      <option value=tripcode>Tripcode</option>
      <option value=mod>Admin/Mod</option>
      <option value=email>E-mail</option>
      <option value=subject>Subject</option>
      <option value=comment>Comment</option>
      <option value=country>Country</option>
      <option value=filename>Filename</option>
      <option value=dimensions>Image dimensions</option>
      <option value=filesize>Filesize</option>
      <option value=md5>Image MD5 (uses exact string matching, not regular expressions)</option>
    </select>
  </div>
  <input type=radio name=tab hidden id=rice_tab>
  <div>
    <div class=warning><code>Quote Backlinks</code> are disabled.</div>
    <ul>
      Backlink formatting
      <li><input name=backlink class=field> : <span id=backlinkPreview></span></li>
    </ul>
    <div class=warning><code>Time Formatting</code> is disabled.</div>
    <ul>
      Time formatting
      <li><input name=time class=field> : <span id=timePreview></span></li>
      <li>Supported <a href=http://en.wikipedia.org/wiki/Date_%28Unix%29#Formatting>format specifiers</a>:</li>
      <li>Day: %a, %A, %d, %e</li>
      <li>Month: %m, %b, %B</li>
      <li>Year: %y</li>
      <li>Hour: %k, %H, %l (lowercase L), %I (uppercase i), %p, %P</li>
      <li>Minutes: %M</li>
      <li>Seconds: %S</li>
    </ul>
    <div class=warning><code>File Info Formatting</code> is disabled.</div>
    <ul>
      File Info Formatting
      <li><input name=fileInfo class=field> : <span id=fileInfoPreview class=fileText></span></li>
      <li>Link (with original file name): %l (lowercase L, truncated), %L (untruncated)</li>
      <li>Original file name: %n (Truncated), %N (Untruncated)</li>
      <li>Spoiler indicator: %p</li>
      <li>Size: %B (Bytes), %K (KB), %M (MB), %s (4chan default)</li>
      <li>Resolution: %r (Displays PDF on /po/, for PDFs)</li>
    </ul>
    <div class=warning><code>Unread Favicon</code> is disabled.</div>
    Unread favicons<br>
    <select name=favicon>
      <option value=ferongr>ferongr</option>
      <option value=xat->xat-</option>
      <option value=Mayhem>Mayhem</option>
      <option value=Original>Original</option>
    </select>
    <span></span>
  </div>
  <input type=radio name=tab hidden id=keybinds_tab>
  <div>
    <div class=warning><code>Keybinds</code> are disabled.</div>
    <div>Allowed keys: Ctrl, Alt, Meta, a-z, A-Z, 0-9, Up, Down, Right, Left.</div>
    <table><tbody>
      <tr><th>Actions</th><th>Keybinds</th></tr>
    </tbody></table>
  </div>
</div>'

    #main
    for key, obj of Config.main
      ul = $.el 'ul',
        textContent: key
      for key, arr of obj
        checked = if $.get(key, Conf[key]) then 'checked' else ''
        description = arr[1]
        li = $.el 'li',
          innerHTML: "<label><input type=checkbox name=\"#{key}\" #{checked}>#{key}</label><span class=description>: #{description}</span>"
        $.on $('input', li), 'click', $.cb.checked
        $.add ul, li
      $.add $('#main_tab + div', dialog), ul

    hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    hiddenNum = Object.keys(g.hiddenReplies).length + Object.keys(hiddenThreads).length
    li = $.el 'li',
      innerHTML: "<button>hidden: #{hiddenNum}</button> <span class=description>: Forget all hidden posts. Useful if you accidentally hide a post and have \"Show Stubs\" disabled."
    $.on $('button', li), 'click', Options.clearHidden
    $.add $('ul:nth-child(2)', dialog), li

    #filter
    filter = $ 'select[name=filter]', dialog
    $.on filter, 'change', Options.filter

    #sauce
    sauce = $ '#sauces', dialog
    sauce.value = $.get sauce.name, Conf[sauce.name]
    $.on sauce, 'change', $.cb.value

    #rice
    (back     = $ '[name=backlink]', dialog).value = $.get 'backlink', Conf['backlink']
    (time     = $ '[name=time]',     dialog).value = $.get 'time',     Conf['time']
    (fileInfo = $ '[name=fileInfo]', dialog).value = $.get 'fileInfo', Conf['fileInfo']
    $.on back,     'input', $.cb.value
    $.on back,     'input', Options.backlink
    $.on time,     'input', $.cb.value
    $.on time,     'input', Options.time
    $.on fileInfo, 'input', $.cb.value
    $.on fileInfo, 'input', Options.fileInfo
    favicon = $ 'select[name=favicon]', dialog
    favicon.value = $.get 'favicon', Conf['favicon']
    $.on favicon, 'change', $.cb.value
    $.on favicon, 'change', Options.favicon

    #keybinds
    for key, arr of Config.hotkeys
      tr = $.el 'tr',
        innerHTML: "<td>#{arr[1]}</td><td><input name=#{key} class=field></td>"
      input = $ 'input', tr
      input.value = $.get key, Conf[key]
      $.on input, 'keydown', Options.keybind
      $.add $('#keybinds_tab + div tbody', dialog), tr

    #indicate if the settings require a feature to be enabled
    indicators = {}
    for indicator in $$ '.warning', dialog
      key = indicator.firstChild.textContent
      indicator.hidden = $.get key, Conf[key]
      indicators[key] = indicator
      $.on $("[name='#{key}']", dialog), 'click', ->
        indicators[@name].hidden = @checked

    overlay = $.el 'div', id: 'overlay'
    $.on overlay, 'click', Options.close
    $.on dialog,  'click', (e) -> e.stopPropagation()
    $.add overlay, dialog
    $.add d.body, overlay
    d.body.style.setProperty 'width', "#{d.body.clientWidth}px", null
    $.addClass d.body, 'unscroll'

    Options.filter.call   filter
    Options.backlink.call back
    Options.time.call     time
    Options.fileInfo.call fileInfo
    Options.favicon.call  favicon

  close: ->
    $.rm this
    d.body.style.removeProperty 'width'
    $.rmClass d.body, 'unscroll'

  clearHidden: ->
    #'hidden' might be misleading; it's the number of IDs we're *looking* for,
    # not the number of posts actually hidden on the page.
    $.delete "hiddenReplies/#{g.BOARD}/"
    $.delete "hiddenThreads/#{g.BOARD}/"
    @textContent = "hidden: 0"
    g.hiddenReplies = {}
  keybind: (e) ->
    return if e.keyCode is 9
    e.preventDefault()
    e.stopPropagation()
    return unless (key = Keybinds.keyCode e)?
    @value = key
    $.cb.value.call @
  filter: ->
    el = @nextSibling

    if (name = @value) isnt 'guide'
      ta = $.el 'textarea',
        name: name
        className: 'field'
        value: $.get name, Conf[name]
      $.on ta, 'change', $.cb.value
      $.replace el, ta
      return

    $.rm el if el
    $.after @, $.el 'article',
      innerHTML: '<p>Use <a href=https://developer.mozilla.org/en/JavaScript/Guide/Regular_Expressions>regular expressions</a>, one per line.<br>
  Lines starting with a <code>#</code> will be ignored.<br>
  For example, <code>/weeaboo/i</code> will filter posts containing the string `<code>weeaboo</code>`, case-insensitive.</p>
  <ul>You can use these settings with each regular expression, separate them with semicolons:
    <li>
      Per boards, separate them with commas. It is global if not specified.<br>
      For example: <code>boards:a,jp;</code>.
    </li>
    <li>
      Filter OPs only along with their threads (`only`), replies only (`no`, this is default), or both (`yes`).<br>
      For example: <code>op:only;</code>, <code>op:no;</code> or <code>op:yes;</code>.
    </li>
    <li>
      Overrule the `Show Stubs` setting if specified: create a stub (`yes`) or not (`no`).<br>
      For example: <code>stub:yes;</code> or <code>stub:no;</code>.
    </li>
    <li>
      Highlight instead of hiding. You can specify a class name to use with a userstyle.<br>
      For example: <code>highlight;</code> or <code>highlight:wallpaper;</code>.
    </li>
    <li>
      Highlighted OPs will have their threads put on top of board pages by default.<br>
      For example: <code>top:yes;</code> or <code>top:no;</code>.
    </li>
  </ul>'
  time: ->
    Time.foo()
    Time.date = new Date()
    $.id('timePreview').textContent = Time.funk Time
  backlink: ->
    $.id('backlinkPreview').textContent = Conf['backlink'].replace /%id/, '123456789'
  fileInfo: ->
    FileInfo.data =
      link:       'javascript:;'
      spoiler:    true
      size:       '276'
      unit:       'KB'
      resolution: '1280x720'
      fullname:   'd9bb2efc98dd0df141a94399ff5880b7.jpg'
      shortname:  'd9bb2efc98dd0df141a94399ff5880(...).jpg'
    FileInfo.setFormats()
    $.id('fileInfoPreview').innerHTML = FileInfo.funk FileInfo
  favicon: ->
    Favicon.switch()
    Unread.update true
    @nextElementSibling.innerHTML = "<img src=#{Favicon.unreadSFW}> <img src=#{Favicon.unreadNSFW}> <img src=#{Favicon.unreadDead}>"

Updater =
  init: ->
    html = '<div class=move><span id=count></span> <span id=timer></span></div>'
    {checkbox} = Config.updater
    for name of checkbox
      title = checkbox[name][1]
      checked = if Conf[name] then 'checked' else ''
      html += "<div><label title='#{title}'>#{name}<input name='#{name}' type=checkbox #{checked}></label></div>"

    checked = if Conf['Auto Update'] then 'checked' else ''
    html += "
      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox #{checked}></label></div>
      <div><label>Interval (s)<input type=number name=Interval class=field min=5></label></div>
      <div><input value='Update Now' type=button name='Update Now'></div>"

    dialog = UI.dialog 'updater', 'bottom: 0; right: 0;', html

    @count  = $ '#count', dialog
    @timer  = $ '#timer', dialog
    @thread = $.id "t#{g.THREAD_ID}"

    @unsuccessfulFetchCount = 0
    @lastModified = '0'

    for input in $$ 'input', dialog
      if input.type is 'checkbox'
        $.on input, 'click', $.cb.checked
      switch input.name
        when 'Scroll BG'
          $.on input, 'click', @cb.scrollBG
          @cb.scrollBG.call input
        when 'Verbose'
          $.on input, 'click', @cb.verbose
          @cb.verbose.call input
        when 'Auto Update This'
          $.on input, 'click', @cb.autoUpdate
          @cb.autoUpdate.call input
        when 'Interval'
          input.value = Conf['Interval']
          $.on input, 'change', @cb.interval
          @cb.interval.call input
        when 'Update Now'
          $.on input, 'click', @update

    $.add d.body, dialog

    $.on d, 'QRPostSuccessful', @cb.post
    $.on d, 'visibilitychange ovisibilitychange mozvisibilitychange webkitvisibilitychange', @cb.visibility

  cb:
    post: ->
      return unless Conf['Auto Update This']
      Updater.unsuccessfulFetchCount = 0
      setTimeout Updater.update, 500
    visibility: ->
      state = d.visibilityState or d.oVisibilityState or d.mozVisibilityState or d.webkitVisibilityState
      return if state isnt 'visible'
      # Reset the counter when we focus this tab.
      Updater.unsuccessfulFetchCount = 0
      if Updater.timer.textContent < -Conf['Interval']
        Updater.timer.textContent = -Updater.getInterval()
    interval: ->
      val = parseInt @value, 10
      @value = if val > 5 then val else 5
      $.cb.value.call @
      Updater.timer.textContent = -Updater.getInterval()
    verbose: ->
      if Conf['Verbose']
        Updater.count.textContent = '+0'
        Updater.timer.hidden = false
      else
        $.extend Updater.count,
          className: ''
          textContent: 'Thread Updater'
        Updater.timer.hidden = true
    autoUpdate: ->
      if Conf['Auto Update This'] = @checked
        Updater.timeoutID = setTimeout Updater.timeout, 1000
      else
        clearTimeout Updater.timeoutID
    scrollBG: ->
      Updater.scrollBG =
        if @checked
          -> true
        else
          -> !(d.hidden or d.oHidden or d.mozHidden or d.webkitHidden)
    update: ->
      if @status is 404
        Updater.timer.textContent = ''
        Updater.count.textContent = 404
        Updater.count.className   = 'warning'
        clearTimeout Updater.timeoutID
        g.dead = true
        if Conf['Unread Count']
          Unread.title = Unread.title.match(/^.+-/)[0] + ' 404'
        else
          d.title = d.title.match(/^.+-/)[0] + ' 404'
        Unread.update true
        QR.abort()
        return
      unless @status in [0, 200, 304]
        # XXX 304 -> 0 in Opera
        if Conf['Verbose']
          Updater.count.textContent = @statusText
          Updater.count.className   = 'warning'
        Updater.unsuccessfulFetchCount++
        return

      Updater.unsuccessfulFetchCount++
      Updater.timer.textContent = -Updater.getInterval()

      ###
      Status Code 304: Not modified
      By sending the `If-Modified-Since` header we get a proper status code, and no response.
      This saves bandwidth for both the user and the servers, avoid unnecessary computation,
      and won't load images and scripts when parsing the response.
      ###
      if @status in [0, 304]
        # XXX 304 -> 0 in Opera
        if Conf['Verbose']
          Updater.count.textContent = '+0'
          Updater.count.className   = null
        return
      Updater.lastModified = @getResponseHeader 'Last-Modified'

      doc = d.implementation.createHTMLDocument ''
      doc.documentElement.innerHTML = @response

      lastPost = Updater.thread.lastElementChild
      id = lastPost.id[2..]
      nodes = []
      for reply in $$('.replyContainer', doc).reverse()
        break if reply.id[2..] <= id #make sure to not insert older posts
        nodes.push reply

      count = nodes.length
      if Conf['Verbose']
        Updater.count.textContent = "+#{count}"
        Updater.count.className   = if count then 'new' else null

      return unless count

      Updater.unsuccessfulFetchCount = 0
      Updater.timer.textContent = -Updater.getInterval()
      scroll = Conf['Scrolling'] && Updater.scrollBG() &&
        lastPost.getBoundingClientRect().bottom - d.documentElement.clientHeight < 25
      $.add Updater.thread, nodes.reverse()
      if scroll
        nodes[0].scrollIntoView()

  getInterval: ->
    i = +Conf['Interval']
    j = Math.min @unsuccessfulFetchCount, 9
    unless d.hidden or d.oHidden or d.mozHidden or d.webkitHidden
      # Don't increase the refresh rate too much on visible tabs.
      j = Math.min j, 6
    Math.max i, [5, 10, 15, 20, 30, 60, 90, 120, 240, 300][j]

  timeout: ->
    Updater.timeoutID = setTimeout Updater.timeout, 1000
    n = 1 + Number Updater.timer.textContent

    if n is 0
      Updater.update()
    else if n >= Updater.getInterval()
      Updater.unsuccessfulFetchCount++
      Updater.count.textContent = 'Retry'
      Updater.count.className   = null
      Updater.update()
    else
      Updater.timer.textContent = n

  update: ->
    Updater.timer.textContent = 0
    Updater.request?.abort()
    # Fool the cache.
    url = location.pathname + '?' + Date.now()
    Updater.request = $.ajax url, onload: Updater.cb.update,
      headers: 'If-Modified-Since': Updater.lastModified

Watcher =
  init: ->
    html = '<div class=move>Thread Watcher</div>'
    @dialog = UI.dialog 'watcher', 'top: 50px; left: 0px;', html
    $.add d.body, @dialog

    #add watch buttons
    for input in $$ '.op input'
      favicon = $.el 'img',
        className: 'favicon'
      $.on favicon, 'click', @cb.toggle
      $.before input, favicon

    if g.THREAD_ID is $.get 'autoWatch', 0
      @watch g.THREAD_ID
      $.delete 'autoWatch'
    else
      #populate watcher, display watch buttons
      @refresh()

    $.on d, 'QRPostSuccessful', @cb.post
    $.sync 'watched', @refresh

  refresh: (watched) ->
    watched or= $.get 'watched', {}
    nodes = []
    for board of watched
      for id, props of watched[board]
        x = $.el 'a',
          textContent: '×'
          href: 'javascript:;'
        $.on x, 'click', Watcher.cb.x
        link = $.el 'a', props
        link.title = link.textContent

        div = $.el 'div'
        $.add div, [x, $.tn(' '), link]
        nodes.push div

    for div in $$ 'div:not(.move)', Watcher.dialog
      $.rm div
    $.add Watcher.dialog, nodes

    watchedBoard = watched[g.BOARD] or {}
    for favicon in $$ '.favicon'
      id = favicon.nextSibling.name
      if id of watchedBoard
        favicon.src = Favicon.default
      else
        favicon.src = Favicon.empty
    return

  cb:
    toggle: ->
      Watcher.toggle @parentNode
    x: ->
      thread = @nextElementSibling.pathname.split '/'
      Watcher.unwatch thread[3], thread[1]
    post: (e) ->
      {postID, threadID} = e.detail
      if threadID is '0'
        if Conf['Auto Watch']
          $.set 'autoWatch', postID
      else if Conf['Auto Watch Reply']
        Watcher.watch threadID

  toggle: (thread) ->
    id = $('.favicon + input', thread).name
    Watcher.watch(id) or Watcher.unwatch id, g.BOARD

  unwatch: (id, board) ->
    watched = $.get 'watched', {}
    delete watched[board][id]
    $.set 'watched', watched
    Watcher.refresh()

  watch: (id) ->
    thread = $.id "t#{id}"
    return false if $('.favicon', thread).src is Favicon.default

    watched = $.get 'watched', {}
    watched[g.BOARD] or= {}
    watched[g.BOARD][id] =
      href: "/#{g.BOARD}/res/#{id}"
      textContent: Get.title thread
    $.set 'watched', watched
    Watcher.refresh()
    true

Anonymize =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    name = $ '.postInfo .name', post.el
    name.textContent = 'Anonymous'
    if (trip = name.nextElementSibling) and trip.className is 'postertrip'
      $.rm trip
    if (parent = name.parentNode).className is 'useremail' and not /^mailto:sage$/i.test parent.href
      $.replace parent, name

Sauce =
  init: ->
    return if g.BOARD is 'f'
    @links = []
    for link in Conf['sauces'].split '\n'
      continue if link[0] is '#'
      # XXX .trim() is there to fix Opera reading two different line breaks.
      @links.push @createSauceLink link.trim()
    return unless @links.length
    Main.callbacks.push @node

  createSauceLink: (link) ->
    link = link.replace /(\$\d)/g, (parameter) ->
      switch parameter
        when '$1'
          "' + (isArchived ? img.firstChild.src : 'http://thumbs.4chan.org' + img.pathname.replace(/src(\\/\\d+).+$/, 'thumb$1s.jpg')) + '"
        when '$2'
          "' + img.href + '"
        when '$3'
          "' + encodeURIComponent(img.firstChild.dataset.md5) + '"
        when '$4'
          g.BOARD
        else
          parameter
    domain = if m = link.match(/;text:(.+)$/) then m[1] else link.match(/(\w+)\.\w+\//)[1]
    href = link.replace /;text:.+$/, ''
    href = Function 'img', 'isArchived', "return '#{href}'"
    el = $.el 'a',
      target: '_blank'
      textContent: domain
    (img, isArchived) ->
      a = el.cloneNode true
      a.href = href img, isArchived
      a

  node: (post) ->
    {img} = post
    return if post.isInlined and not post.isCrosspost or not img
    img   = img.parentNode
    nodes = []
    for link in Sauce.links
      # \u00A0 is nbsp
      nodes.push $.tn('\u00A0'), link img, post.isArchived
    $.add post.fileInfo, nodes

RevealSpoilers =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    {img} = post
    if not (img and /^Spoiler/.test img.alt) or post.isInlined and not post.isCrosspost or post.isArchived
      return
    img.removeAttribute 'style'
    # revealed spoilers do not have height/width set, this fixes auto-gifs dimensions.
    s = img.style
    s.maxHeight = s.maxWidth = if /\bop\b/.test post.class then '250px' else '125px'
    img.src = "//thumbs.4chan.org#{img.parentNode.pathname.replace /src(\/\d+).+$/, 'thumb$1s.jpg'}"

Time =
  init: ->
    Time.foo()
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    node             = $ '.postInfo > .dateTime', post.el
    Time.date        = new Date node.dataset.utc * 1000
    node.textContent = Time.funk Time
  foo: ->
    code = Conf['time'].replace /%([A-Za-z])/g, (s, c) ->
      if c of Time.formatters
        "' + Time.formatters.#{c}() + '"
      else
        s
    Time.funk = Function 'Time', "return '#{code}'"
  day: [
    'Sunday'
    'Monday'
    'Tuesday'
    'Wednesday'
    'Thursday'
    'Friday'
    'Saturday'
  ]
  month: [
    'January'
    'February'
    'March'
    'April'
    'May'
    'June'
    'July'
    'August'
    'September'
    'October'
    'November'
    'December'
  ]
  zeroPad: (n) -> if n < 10 then '0' + n else n
  formatters:
    a: -> Time.day[Time.date.getDay()][...3]
    A: -> Time.day[Time.date.getDay()]
    b: -> Time.month[Time.date.getMonth()][...3]
    B: -> Time.month[Time.date.getMonth()]
    d: -> Time.zeroPad Time.date.getDate()
    e: -> Time.date.getDate()
    H: -> Time.zeroPad Time.date.getHours()
    I: -> Time.zeroPad Time.date.getHours() % 12 or 12
    k: -> Time.date.getHours()
    l: -> Time.date.getHours() % 12 or 12
    m: -> Time.zeroPad Time.date.getMonth() + 1
    M: -> Time.zeroPad Time.date.getMinutes()
    p: -> if Time.date.getHours() < 12 then 'AM' else 'PM'
    P: -> if Time.date.getHours() < 12 then 'am' else 'pm'
    S: -> Time.zeroPad Time.date.getSeconds()
    y: -> Time.date.getFullYear() - 2000

FileInfo =
  init: ->
    return if g.BOARD is 'f'
    @setFormats()
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined and not post.isCrosspost or not post.fileInfo
    node = post.fileInfo.firstElementChild
    alt  = post.img.alt
    span = $ 'span', node
    FileInfo.data =
      link:       post.img.parentNode.href
      spoiler:    /^Spoiler/.test alt
      size:       alt.match(/\d+\.?\d*/)[0]
      unit:       alt.match(/\w+$/)[0]
      resolution: span.previousSibling.textContent.match(/\d+x\d+|PDF/)[0]
      fullname:   span.title
      shortname:  span.textContent
    # XXX GM/Scriptish
    node.setAttribute 'data-filename', span.title
    node.innerHTML = FileInfo.funk FileInfo
  setFormats: ->
    code = Conf['fileInfo'].replace /%([BKlLMnNprs])/g, (s, c) ->
      if c of FileInfo.formatters
        "' + f.formatters.#{c}() + '"
      else
        s
    @funk = Function 'f', "return '#{code}'"
  convertUnit: (unitT) ->
    size  = @data.size
    unitF = @data.unit
    if unitF isnt unitT
      units = ['B', 'KB', 'MB']
      i     = units.indexOf(unitF) - units.indexOf unitT
      unitT = 'Bytes' if unitT is 'B'
      if i > 0
        size *= 1024 while i-- > 0
      else if i < 0
        size /= 1024 while i++ < 0
      if size < 1 and size.toString().length > size.toFixed(2).length
        size = size.toFixed 2
    "#{size} #{unitT}"
  formatters:
    l: -> "<a href=#{FileInfo.data.link} target=_blank>#{@n()}</a>"
    L: -> "<a href=#{FileInfo.data.link} target=_blank>#{@N()}</a>"
    n: ->
      if FileInfo.data.fullname is FileInfo.data.shortname
        FileInfo.data.fullname
      else
        "<span class=fntrunc>#{FileInfo.data.shortname}</span><span class=fnfull>#{FileInfo.data.fullname}</span>"
    N: -> FileInfo.data.fullname
    p: -> if FileInfo.data.spoiler then 'Spoiler, ' else ''
    s: -> "#{FileInfo.data.size} #{FileInfo.data.unit}"
    B: -> FileInfo.convertUnit 'B'
    K: -> FileInfo.convertUnit 'KB'
    M: -> FileInfo.convertUnit 'MB'
    r: -> FileInfo.data.resolution

Get =
  post: (board, threadID, postID, root, cb) ->
    if board is g.BOARD and post = $.id "pc#{postID}"
      $.add root, Get.cleanPost post.cloneNode true
      return

    root.textContent = "Loading post No.#{postID}..."
    if threadID
      $.cache "/#{board}/res/#{threadID}", ->
        Get.parsePost @, board, threadID, postID, root, cb
    else if url = Redirect.post board, postID
      $.cache url, ->
        Get.parseArchivedPost @, board, postID, root, cb
  parsePost: (req, board, threadID, postID, root, cb) ->
    {status} = req
    if status isnt 200
      # The thread can die by the time we check a quote.
      if url = Redirect.post board, postID
        $.cache url, ->
          Get.parseArchivedPost @, board, postID, root, cb
      else
        root.textContent =
          if status is 404
            "Thread No.#{threadID} has not been found."
          else
            "Error #{req.status}: #{req.statusText}."
      return

    doc = d.implementation.createHTMLDocument ''
    doc.documentElement.innerHTML = req.response

    unless pc = doc.getElementById "pc#{postID}"
      # The post can be deleted by the time we check a quote.
      if url = Redirect.post board, postID
        $.cache url, ->
          Get.parseArchivedPost @, board, postID, root, cb
      else
        root.textContent = "Post No.#{postID} has not been found."
      return
    pc = Get.cleanPost d.importNode pc, true

    for quote in $$ '.quotelink', pc
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote, or board link
      quote.href = "/#{board}/res/#{href}" # Fix pathnames
    link = $ 'a[title="Highlight this post"]', pc
    link.href = "/#{board}/res/#{threadID}#p#{postID}"
    link.nextSibling.href = "/#{board}/res/#{threadID}#q#{postID}"

    $.replace root.firstChild, pc
    cb() if cb
  parseArchivedPost: (req, board, postID, root, cb) ->
    data = JSON.parse req.response
    $.addClass root, 'archivedPost'
    if data.error
      root.textContent = data.error
      return

    threadID = data.thread_num
    isOP = postID is threadID
    {name, trip, timestamp} = data
    subject = data.title

    # post info (mobile)
    piM = $.el 'div',
      id: "pim#{postID}"
      className: 'postInfoM mobile'
      innerHTML: "<span class=nameBlock><span class=name></span><br><span class=subject></span></span><span class='dateTime postNum' data-utc=#{timestamp}>#{data.fourchan_date}<br><em></em><a href='/#{board}/res/#{threadID}#p#{postID}'>No.</a><a href='/#{board}/res/#{threadID}#q#{postID}'>#{postID}</a></span>"
    $('.name',    piM).textContent = name
    $('.subject', piM).textContent = subject
    br = $ 'br', piM
    if trip
      $.before br, [$.tn(' '), $.el 'span',
        className: 'postertrip'
        textContent: trip
      ]
    {capcode} = data
    if capcode isnt 'N' # 'A'dmin or 'M'od
      $.addClass br.parentNode, if capcode is 'A' then 'capcodeAdmin' else 'capcodeMod'
      $.before br, [
        $.tn(' '),
        $.el('strong',
          className: 'capcode',
          textContent: if capcode is 'A' then '## Admin' else '## Mod'
        ),
        $.tn(' '),
        $.el('img',
          src:   if capcode is 'A' then '//static.4chan.org/image/adminicon.gif' else  '//static.4chan.org/image/modicon.gif',
          alt:   if capcode is 'A' then 'This user is the 4chan Administrator.' else 'This user is a 4chan Moderator.',
          title: if capcode is 'A' then 'This user is the 4chan Administrator.' else 'This user is a 4chan Moderator.',
          className: 'identityIcon'
        )
      ]

    # post info
    pi = $.el 'div',
      id: "pi#{postID}"
      className: 'postInfo desktop'
      innerHTML: "<input type=checkbox name=#{postID} value=delete> <span class=subject></span> <span class=nameBlock></span> <span class=dateTime data-utc=#{timestamp}>data.fourchan_date</span> <span class='postNum desktop'><a href='/#{board}/res/#{threadID}#p#{postID}' title='Highlight this post'>No.</a><a href='/#{board}/res/#{threadID}#q#{postID}' title='Quote this post'>#{postID}</a>#{if isOP then ' &nbsp; ' else ''}</span> "
    # subject
    $('.subject', pi).textContent = subject
    nameBlock = $ '.nameBlock', pi
    if data.email
      email = $.el 'a',
        className: 'useremail'
        href: "mailto:#{data.email}"
      $.add nameBlock, email
      nameBlock = email
    $.add nameBlock, $.el 'span',
      className: 'name'
      textContent: data.name
    if trip
      $.add nameBlock, [$.tn(' '), $.el('span', className: 'postertrip', textContent: trip)]
    if capcode isnt 'N' # 'A'dmin or 'M'od
      $.add nameBlock, [
        $.tn(' '),
        $.el('strong',
          className:   if capcode is 'A' then 'capcode capcodeAdmin' else 'capcode',
          textContent: if capcode is 'A' then '## Admin' else '## Mod'
        )
      ]
      nameBlock = $ '.nameBlock', pi
      $.addClass nameBlock, if capcode is 'A' then 'capcodeAdmin' else 'capcodeMod'
      $.add nameBlock, [
        $.tn(' '),
        $.el('img',
          src:   if capcode is 'A' then '//static.4chan.org/image/adminicon.gif' else  '//static.4chan.org/image/modicon.gif',
          alt:   if capcode is 'A' then 'This user is the 4chan Administrator.' else 'This user is a 4chan Moderator.',
          title: if capcode is 'A' then 'This user is the 4chan Administrator.' else 'This user is a 4chan Moderator.',
          className: 'identityIcon'
        )
      ]

    # comment
    bq = $.el 'blockquote',
      id: "m#{postID}"
      className: 'postMessage'
      textContent: data.comment # set this first to convert text to HTML entities
    # https://github.com/eksopl/fuuka/blob/master/Board/Yotsuba.pm#L413-452
    # https://github.com/eksopl/asagi/blob/master/src/main/java/net/easymodo/asagi/Yotsuba.java#L109-138
    bq.innerHTML = bq.innerHTML.replace ///
      \n
      | \[/?b\]
      | \[/?spoiler\]
      | \[/?code\]
      | \[/?moot\]
      | \[/?banned\]
      ///g, (text) ->
        switch text
          when '\n'
            '<br>'
          when '[b]'
            '<b>'
          when '[/b]'
            '</b>'
          when '[spoiler]'
            '<span class=spoiler>'
          when '[/spoiler]'
            '</span>'
          when '[code]'
            '<pre class=prettyprint>'
          when '[/code]'
            '</pre>'
          when '[moot]'
            '<div style="padding:5px;margin-left:.5em;border-color:#faa;border:2px dashed rgba(255,0,0,.1);border-radius:2px">'
          when '[/moot]'
            '</div>'
          when '[banned]'
            '<b style="color: red;">'
          when '[/banned]'
            '</b>'
    # greentext
    bq.innerHTML = bq.innerHTML.replace /(^|>)(&gt;[^<$]+)(<|$)/g, '$1<span class=quote>$2</span>$3'

    # post container
    pc = $.el 'div',
      id: "pc#{postID}"
      className: "postContainer #{if isOP then 'op' else 'reply'}Container"
      innerHTML: "<div id=p#{postID} class='post #{if isOP then 'op' else 'reply'}'></div>"
    $.add pc.firstChild, [piM, pi, bq]

    # file
    if filename = data.media_filename
      file = $.el 'div',
        id: "f#{postID}"
        className: 'file'
      spoiler  = data.spoiler is '1'
      filesize = $.bytesToString data.media_size
      $.add file, $.el 'div',
        className: 'fileInfo'
        innerHTML: "<span id=fT#{postID} class=fileText>File: <a href='#{data.media_link or data.remote_media_link}' target=_blank>#{data.media_orig}</a>-(#{if spoiler then 'Spoiler Image, ' else ''}#{filesize}, #{data.media_w}x#{data.media_h}, <span title></span>)</span>"
      span = $ 'span[title]', file
      span.title = filename
      threshold = if isOP then 40 else 30
      span.textContent =
        # FILENAME SHORTENING SCIENCE:
        # OPs have a +10 characters threshold.
        # The file extension is not taken into account.
        if filename.replace(/\.\w+$/, '').length > threshold
          "#{filename[...threshold - 5]}(...)#{filename.match(/\.\w+$/)}"
        else
          filename
      thumb_src = if data.media_status is 'available' then "src=#{data.thumb_link}" else ''
      $.add file, $.el 'a',
        className: if spoiler then 'fileThumb imgspoiler' else 'fileThumb'
        href: data.media_link or data.remote_media_link
        target: '_blank'
        innerHTML: "<img #{thumb_src} alt='#{if data.media_status isnt 'available' then "Error: #{data.media_status}, " else ''}#{if spoiler then 'Spoiler Image, ' else ''}#{filesize}' data-md5=#{data.media_hash} style='height: #{data.preview_h}px; width: #{data.preview_w}px;'>"
      $.after (if isOP then piM else pi), file

    $.replace root.firstChild, Get.cleanPost pc
    cb() if cb
  cleanPost: (root) ->
    post = $ '.post', root
    for child in Array::slice.call root.childNodes
      $.rm child unless child is post

    # Remove inlined posts inside of this post.
    for inline  in $$ '.inline',  post
      $.rm inline
    for inlined in $$ '.inlined', post
      $.rmClass inlined, 'inlined'

    # Don't mess with other features
    now = Date.now()
    els = $$ '[id]', root
    els.push root
    for el in els
      el.id = "#{now}_#{el.id}"

    $.rmClass root, 'forwarded'
    $.rmClass root, 'qphl' # op
    $.rmClass post, 'highlight'
    $.rmClass post, 'qphl' # reply
    root.hidden = post.hidden = false

    root
  title: (thread) ->
    op = $ '.op', thread
    el = $ '.subject', op
    unless el.textContent
      el = $ 'blockquote', op
      unless el.textContent
        el = $ '.nameBlock', op
    span = $.el 'span', innerHTML: el.innerHTML.replace /<br>/g, ' '
    "/#{g.BOARD}/ - #{span.textContent.trim()}"

TitlePost =
  init: ->
    d.title = Get.title()

QuoteBacklink =
  init: ->
    format = Conf['backlink'].replace /%id/g, "' + id + '"
    @funk  = Function 'id', "return '#{format}'"
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined
    quotes = {}
    for quote in post.quotes
      # Don't process >>>/b/.
      if qid = quote.hash[2..]
        # Duplicate quotes get overwritten.
        quotes[qid] = true
    a = $.el 'a',
      href: "/#{g.BOARD}/res/#{post.threadID}#p#{post.ID}"
      className: if post.el.hidden then 'filtered backlink' else 'backlink'
      textContent: QuoteBacklink.funk post.ID
    for qid of quotes
      # Don't backlink the OP.
      continue if !(el = $.id "pi#{qid}") or !Conf['OP Backlinks'] and /\bop\b/.test el.parentNode.className
      link = a.cloneNode true
      if Conf['Quote Preview']
        $.on link, 'mouseover', QuotePreview.mouseover
      if Conf['Quote Inline']
        $.on link, 'click', QuoteInline.toggle
      else
        link.setAttribute 'onclick', "replyhl('#{post.ID}');"
      unless container = $.id "blc#{qid}"
        container = $.el 'span',
          className: 'container'
          id: "blc#{qid}"
        $.add el, container
      $.add container, [$.tn(' '), link]
    return

QuoteInline =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    for quote in post.quotes
      continue unless quote.hash or /\bdeadlink\b/.test quote.className
      quote.removeAttribute 'onclick'
      $.on quote, 'click', QuoteInline.toggle
    for quote in post.backlinks
      $.on quote, 'click', QuoteInline.toggle
    return
  toggle: (e) ->
    return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
    e.preventDefault()
    id = @dataset.id or @hash[2..]
    if /\binlined\b/.test @className
      QuoteInline.rm @, id
    else
      return if $.x "ancestor::div[contains(@id,'p#{id}')]", @
      QuoteInline.add @, id
    @classList.toggle 'inlined'

  add: (q, id) ->
    if q.host is 'boards.4chan.org'
      path     = q.pathname.split '/'
      board    = path[1]
      threadID = path[3]
      postID   = id
    else
      board    = q.dataset.board
      threadID = 0
      postID   = q.dataset.id

    el = if board is g.BOARD then $.id "p#{postID}" else false
    inline = $.el 'div',
      id: "i#{postID}"
      className: if el then 'inline' else 'inline crosspost'

    root =
      if isBacklink = /\bbacklink\b/.test q.className
        q.parentNode
      else
        $.x 'ancestor-or-self::*[parent::blockquote][1]', q
    $.after root, inline
    Get.post board, threadID, postID, inline

    return unless el

    # Will only unhide if there's no inlined backlinks of it anymore.
    if isBacklink and Conf['Forward Hiding']
      $.addClass el.parentNode, 'forwarded'
      ++el.dataset.forwarded or el.dataset.forwarded = 1

    # Decrease the unread count if this post is in the array of unread reply.
    if (i = Unread.replies.indexOf el) isnt -1
      Unread.replies.splice i, 1
      Unread.update true

  rm: (q, id) ->
    # select the corresponding inlined quote or loading quote
    div = $.x "following::div[@id='i#{id}']", q
    $.rm div
    return unless Conf['Forward Hiding']
    for inlined in $$ '.backlink.inlined', div
      div = $.id inlined.hash[1..]
      $.rmClass div.parentNode, 'forwarded' unless --div.dataset.forwarded
    if /\bbacklink\b/.test q.className
      div = $.id "p#{id}"
      $.rmClass div.parentNode, 'forwarded' unless --div.dataset.forwarded

QuotePreview =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    for quote in post.quotes
      $.on quote, 'mouseover', QuotePreview.mouseover if quote.hash or /\bdeadlink\b/.test quote.className
    for quote in post.backlinks
      $.on quote, 'mouseover', QuotePreview.mouseover
    return
  mouseover: (e) ->
    return if /\binlined\b/.test @className

    # Make sure to remove the previous qp
    # in case it got stuck. Opera-only bug?
    if qp = $.id 'qp'
      if qp is UI.el
        delete UI.el
      $.rm qp

    # Don't stop other elements from dragging
    return if UI.el

    if @host is 'boards.4chan.org'
      path     = @pathname.split '/'
      board    = path[1]
      threadID = path[3]
      postID   = @hash[2..]
    else
      board    = @dataset.board
      threadID = 0
      postID   = @dataset.id

    qp = UI.el = $.el 'div',
      id: 'qp'
      className: 'reply dialog'
    UI.hover e
    $.add d.body, qp
    el = $.id "p#{postID}" if board is g.BOARD
    Get.post board, threadID, postID, qp, ->
      bq = $ 'blockquote', qp
      Main.prettify bq
      post =
        el: qp
        blockquote: bq
        isArchived: /\barchivedPost\b/.test qp.className
      if img = $ 'img[data-md5]', qp
        post.fileInfo = img.parentNode.previousElementSibling
        post.img      = img
      if Conf['Reveal Spoilers']
        RevealSpoilers.node post
      if Conf['Image Auto-Gif']
        AutoGif.node        post
      if Conf['Time Formatting']
        Time.node           post
      if Conf['File Info Formatting']
        FileInfo.node       post
      if Conf['Resurrect Quotes']
        Quotify.node        post

    $.on @, 'mousemove',      UI.hover
    $.on @, 'mouseout click', QuotePreview.mouseout

    return unless el
    if Conf['Quote Highlighting']
      if /\bop\b/.test el.className
        $.addClass el.parentNode, 'qphl'
      else
        $.addClass el, 'qphl'
    quoterID = $.x('ancestor::*[@id][1]', @).id.match(/\d+$/)[0]
    for quote in $$ '.quotelink, .backlink', qp
      if quote.hash[2..] is quoterID
        $.addClass quote, 'forwardlink'
    return
  mouseout: (e) ->
    UI.hoverend()
    if el = $.id @hash[1..]
      $.rmClass el,            'qphl' # reply
      $.rmClass el.parentNode, 'qphl' # op
    $.off @, 'mousemove',      UI.hover
    $.off @, 'mouseout click', QuotePreview.mouseout

QuoteOP =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    for quote in post.quotes
      if quote.hash[2..] is post.threadID
        # \u00A0 is nbsp
        $.add quote, $.tn '\u00A0(OP)'
    return

QuoteCT =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined and not post.isCrosspost
    for quote in post.quotes
      unless quote.hash
        # Make sure this isn't a link to the board we're on.
        continue
      path = quote.pathname.split '/'
      # If quote leads to a different thread id and is located on the same board.
      if path[1] is g.BOARD and path[3] isnt post.threadID
        # \u00A0 is nbsp
        $.add quote, $.tn '\u00A0(Cross-thread)'
    return

Quotify =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined and not post.isCrosspost

    # XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE is 6
    # Get all the text nodes that are not inside an anchor.
    snapshot = d.evaluate './/text()[not(parent::a)]', post.blockquote, null, 6, null

    for i in [0...snapshot.snapshotLength]
      node = snapshot.snapshotItem i
      data = node.data

      unless quotes = data.match />>(>\/[a-z\d]+\/)?\d+/g
        # Only accept nodes with potentially valid links
        continue

      nodes = []

      for quote in quotes
        index   = data.indexOf quote
        if text = data[...index]
          # Potential text before this valid quote.
          nodes.push $.tn text

        id = quote.match(/\d+$/)[0]
        board =
          if m = quote.match /^>>>\/([a-z\d]+)/
            m[1]
          else
            # Get the post's board, whether it's inlined or not.
            $('a[title="Highlight this post"]', post.el).pathname.split('/')[1]

        nodes.push a = $.el 'a',
          # \u00A0 is nbsp
          textContent: "#{quote}\u00A0(Dead)"

        if board is g.BOARD and $.id "p#{id}"
          a.href      = "#p#{id}"
          a.className = 'quotelink'
          a.setAttribute 'onclick', "replyhl('#{id}');"
        else
          a.href      = Redirect.thread board, 0, id
          a.className = 'deadlink'
          a.target    = '_blank'
          if Redirect.post board, id
            $.addClass a, 'quotelink'
            # XXX WTF Scriptish/Greasemonkey?
            # Setting dataset attributes that way doesn't affect the HTML,
            # but are, I suspect, kept as object key/value pairs and GC'd later.
            # a.dataset.board = board
            # a.dataset.id    = id
            a.setAttribute 'data-board', board
            a.setAttribute 'data-id',    id

        data = data[index + quote.length..]

      if data
        # Potential text after the last valid quote.
        nodes.push $.tn data

      $.replace node, nodes
    return

DeleteLink =
  init: ->
    div = $.el 'div',
      className: 'delete_link'
      textContent: 'Delete'
    aPost = $.el 'a',
      className: 'delete_post'
      href: 'javascript:;'
    aImage = $.el 'a',
      className: 'delete_image'
      href: 'javascript:;'

    children = []

    children.push
      el: aPost
      open: ->
        aPost.textContent = 'Post'
        $.on aPost, 'click', DeleteLink.delete
        true

    children.push
      el: aImage
      open: (post) ->
        return false unless post.img
        aImage.textContent = 'Image'
        $.on aImage, 'click', DeleteLink.delete
        true

    Menu.addEntry
      el: div
      open: (post) ->
        if post.isArchived
          return false
        node = div.firstChild
        if seconds = DeleteLink.cooldown[post.ID]
          node.textContent = "Delete (#{seconds})"
          DeleteLink.cooldown.el = node
        else
          node.textContent = 'Delete'
          delete DeleteLink.cooldown.el
        true
      children: children

    $.on d, 'QRPostSuccessful', @cooldown.start

  delete: ->
    menu = $.id 'menu'
    {id} = menu.dataset
    return if DeleteLink.cooldown[id]

    $.off @, 'click', DeleteLink.delete
    @textContent = 'Deleting...'

    pwd =
      if m = d.cookie.match /4chan_pass=([^;]+)/
        decodeURIComponent m[1]
      else
        $.id('delPassword').value

    board = $('a[title="Highlight this post"]',
      $.id menu.dataset.rootid).pathname.split('/')[1]
    self = @

    form =
      mode: 'usrdel'
      onlyimgdel: /\bdelete_image\b/.test @className
      pwd: pwd
    form[id] = 'delete'

    $.ajax $.id('delform').action.replace("/#{g.BOARD}/", "/#{board}/"), {
        onload:  -> DeleteLink.load  self, @response
        onerror: -> DeleteLink.error self
      }, {
        form: $.formData form
      }
  load: (self, html) ->
    doc = d.implementation.createHTMLDocument ''
    doc.documentElement.innerHTML = html
    if doc.title is '4chan - Banned' # Ban/warn check
      s = 'Banned!'
    else if msg = doc.getElementById 'errmsg' # error!
      s = msg.textContent
      $.on self, 'click', DeleteLink.delete
    else
      s = 'Deleted'
    self.textContent = s
  error: (self) ->
    self.textContent = 'Connection error, please retry.'
    $.on self, 'click', DeleteLink.delete

  cooldown:
    start: (e) ->
      DeleteLink.cooldown.count e.detail.postID, 30
    count: (postID, seconds) ->
      return unless 0 <= seconds <= 30
      setTimeout DeleteLink.cooldown.count, 1000, postID, seconds-1
      {el} = DeleteLink.cooldown
      if seconds is 0
        el?.textContent = 'Delete'
        delete DeleteLink.cooldown[postID]
        delete DeleteLink.cooldown.el
        return
      el?.textContent = "Delete (#{seconds})"
      DeleteLink.cooldown[postID] = seconds

ReportLink =
  init: ->
    a = $.el 'a',
      className: 'report_link'
      href: 'javascript:;'
      textContent: 'Report this post'
    $.on a, 'click', @report
    Menu.addEntry
      el: a
      open: (post) ->
        post.isArchived is false
  report: ->
    a   = $ 'a[title="Highlight this post"]', $.id @parentNode.dataset.rootid
    url = "//sys.4chan.org/#{a.pathname.split('/')[1]}/imgboard.php?mode=report&no=#{@parentNode.dataset.id}"
    id  = Date.now()
    set = "toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=685,height=200"
    window.open url, id, set

DownloadLink =
  init: ->
    # Test for download feature support.
    return if $.el('a').download is undefined
    a = $.el 'a',
      className: 'download_link'
      textContent: 'Download file'
    Menu.addEntry
      el: a
      open: (post) ->
        unless post.img
          return false
        a.href     = post.img.parentNode.href
        fileText   = post.fileInfo.firstElementChild
        a.download =
          if Conf['File Info Formatting']
            fileText.dataset.filename
          else
            $('span', fileText).title
        true

ArchiveLink =
  init: ->
    a = $.el 'a',
      className:   'archive_link'
      target:      '_blank'
      textContent: 'Archived post'
    Menu.addEntry
      el: a
      open: (post) ->
        path = $('a[title="Highlight this post"]', post.el).pathname.split '/'
        if (href = Redirect.thread path[1], path[3], post.ID) is "//boards.4chan.org/#{path[1]}/"
          return false
        a.href = href
        true

ThreadStats =
  init: ->
    dialog = UI.dialog 'stats', 'bottom: 0; left: 0;', '<div class=move><span id=postcount>0</span> / <span id=imagecount>0</span></div>'
    dialog.className = 'dialog'
    $.add d.body, dialog
    @posts = @images = 0
    @imgLimit =
      switch g.BOARD
        when 'a', 'b', 'v', 'co', 'mlp'
          251
        when 'vg'
          501
        else
          151
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined
    $.id('postcount').textContent = ++ThreadStats.posts
    return unless post.img
    imgcount = $.id 'imagecount'
    imgcount.textContent = ++ThreadStats.images
    if ThreadStats.images > ThreadStats.imgLimit
      $.addClass imgcount, 'warning'

Unread =
  init: ->
    @title = d.title
    $.on d, 'QRPostSuccessful', @post
    @update()
    $.on window, 'scroll', Unread.scroll
    Main.callbacks.push @node

  replies: []
  foresee: []

  post: (e) ->
    Unread.foresee.push e.detail.postID

  node: (post) ->
    if (index = Unread.foresee.indexOf post.ID) isnt -1
      Unread.foresee.splice index, 1
      return
    {el} = post
    return if el.hidden or /\bop\b/.test(post.class) or post.isInlined
    count = Unread.replies.push el
    Unread.update count is 1

  scroll: ->
    height = d.documentElement.clientHeight
    for reply, i in Unread.replies
      {bottom} = reply.getBoundingClientRect()
      if bottom > height #post is not completely read
        break
    return if i is 0

    Unread.replies = Unread.replies[i..]
    Unread.update Unread.replies.length is 0

  setTitle: (count) ->
    if @scheduled
      clearTimeout @scheduled
      delete Unread.scheduled
      @setTitle count
      return
    @scheduled = setTimeout (->
      d.title = "(#{count}) #{Unread.title}"
    ), 5

  update: (updateFavicon) ->
    return unless g.REPLY

    count = @replies.length

    if Conf['Unread Count']
      @setTitle count

    unless Conf['Unread Favicon'] and updateFavicon
      return

    if $.engine is 'presto'
      $.rm Favicon.el

    Favicon.el.href =
      if g.dead
        if count
          Favicon.unreadDead
        else
          Favicon.dead
      else
        if count
          Favicon.unread
        else
          Favicon.default

    if g.dead
      $.addClass    Favicon.el, 'dead'
    else
      $.rmClass Favicon.el, 'dead'
    if count
      $.addClass    Favicon.el, 'unread'
    else
      $.rmClass Favicon.el, 'unread'

    # `favicon.href = href` doesn't work on Firefox
    # `favicon.href = href` isn't enough on Opera
    # Opera won't always update the favicon if the href didn't change
    unless $.engine is 'webkit'
      $.add d.head, Favicon.el

Favicon =
  init: ->
    return if @el # Prevent race condition with options first run
    @el = $ 'link[rel="shortcut icon"]', d.head
    @el.type = 'image/x-icon'
    {href} = @el
    @SFW = /ws.ico$/.test href
    @default = href
    @switch()

  switch: ->
    switch Conf['favicon']
      when 'ferongr'
        @unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAOMHAOgLAnMFAL8AAOgLAukMA/+AgP+rq////////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw=='
        @unreadSFW  = 'data:image/gif;base64,R0lGODlhEAAQAOMHAADX8QBwfgC2zADX8QDY8nnl8qLp8v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw=='
        @unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAOMHAFT+ACh5AEncAFT+AFX/Acz/su7/5v///////////////////////////////////yH5BAEKAAcALAAAAAAQABAAAARZ8MhJ6xwDWIBv+AM1fEEIBIVRlNKYrtpIECuGzuwpCLg974EYiXUYkUItjGbC6VQ4omXFiKROA6qSy0A8nAo9GS3YCswIWnOvLAi0be23Z1QtdSUaqXcviQAAOw=='
      when 'xat-'
        @unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2ElEQVQ4y61TQQrCMBDMQ8WDIEV6LbT2A4og2Hq0veo7fIAH04dY9N4xmyYlpGmI2MCQTWYy3Wy2DAD7B2wWAzWgcTgVeZKlZRxHNYFi2jM18oBh0IcKtC6ixf22WT4IFLs0owxswXu9egm0Ls6bwfCFfNsJYJKfqoEkd3vgUgFVLWObtzNgVKyruC+ljSzr5OEnBzjvjcQecaQhbZgBb4CmGQw+PoMkTUtdbd8VSEPakcGxPOcsoIgUKy0LecY29BmdBrqRfjIwZ93KLs5loHvBnL3cLH/jF+C/+z5dgUysAAAAAElFTkSuQmCC'
        @unreadSFW  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA30lEQVQ4y2P4//8/AyWYgSoGQMF/GJ7Y11VVUVoyKTM9ey4Ig9ggMWQ1YA1IBvzXm34YjkH8mPyJB+Nqlp8FYRAbmxoMF6ArSNrw6T0Qf8Amh9cFMEWVR/7/A+L/uORxhgEIt5/+/3/2lf//5wAxiI0uj+4CBlBgxVUvOwtydgXQZpDmi2/+/7/0GmIQSAwkB1IDUkuUAZeABlx+g2zAZ9wGlAOjChba+LwAUgNSi2HA5Am9VciBhSsQQWyoWgZiovEDsdGI1QBYQiLJAGQalpSxyWEzAJYWkGm8clTJjQCZ1hkoVG0CygAAAABJRU5ErkJggg=='
        @unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4ElEQVQ4y2P4//8/AyWYgSoGQMF/GJ7YNbGqrKRiUnp21lwQBrFBYshqwBqQDPifdsYYjkH8mInxB+OWx58FYRAbmxoMF6ArKPmU9B6IP2CTw+sCmKKe/5X/gPg/LnmcYQDCs/63/1/9fzYQzwGz0eXRXcAACqy4ZfFnQc7u+V/xD6T55v+LQHwJbBBIDCQHUgNSS5QBt4Cab/2/jDDgMx4DykrKJ8FCG58XQGpAajEMmNw7uQo5sHAFIogNVctATDR+IDYasRoAS0gkGYBMw5IyNjlsBsDSAjKNV44quREAx58Mr9vt5wQAAAAASUVORK5CYII='
      when 'Mayhem'
        @unreadDead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jZ2ScWuDMBDFgw4pIkU0WsoQkWAYIkXZH4N9/+/V3dmfXSrKYIFHwt17j8vdGWNMIkgFuaDgzgQnwRs4EQs5KdolUQtagRN0givEDBTEOjgtGs0Zq8F7cKqqusVxrMQLaDUWcjBSrXkn8gs51tpJSWLk9b3HUa0aNIL5gPBR1/V4kJvR7lTwl8GmAm1Gf9+c3S+89qBHa8502AsmSrtBaEBPbIbj0ah2madlNAPEccdgJDfAtWifBjqWKShRBT6KoiH8QlEUn/qt0CCjnNdmPUwmFWzj9Oe6LpKuZXcwqq88z78Pch3aZU3dPwwc2sWlfZKCW5tWluV8kGvXClLm6dYN4/aUqfCbnEOzNDGhGZbNargvxCzvMGfRJD8UaDVvgkzo6QAAAABJRU5ErkJggg=='
        @unreadSFW  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZ2S4crCMAxF+0OGDJEPKYrIGKOsiJSx/fJRfSAfTJNyKqXfiuDg0C25N2RJjTGmEVrhTzhw7oStsIEtsVzT4o2Jo9ALThiEM8IdHIgNaHo8mjNWg6/ske8bohPo+63QOLzmooHp8fyAICBSQkVz0QKdsFQEV6WSW/D+7+BbgbIDHcb4Kp61XyjyI16zZ8JemGltQtDBSGxB4/GoN+7TpkkjDCsFArm0IYv3U0BbnYtf8BCy+JytsE0X6VyuKhPPK/GAJ14kvZZDZVV3pZIb8MZr6n4o4PDGKn0S5SdDmyq5PnXQsk+Xbhinp03FFzmHJw6xYRiWm9VxnohZ3vOcxdO8ARmXRvbWdtzQAAAAAElFTkSuQmCC'
        @unreadNSFW = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCklEQVQ4jZ2S0WrDMAxF/TBCCKWMYhZKCSGYmFJMSNjD/mhf239qJXNcjBdTWODgRLpXKJKNMaYROuFTOHEehFb4gJZYrunwxsSXMApOmIQzwgOciE1oRjyaM1aDj+yR7xuiHvT9VmgcXnPRwO/9+wWCgEgJFc1FCwzCVhFclUpuw/u3g3cFyg50GPOjePZ+ocjPeM2RCXthpbUFwQAzsQ2Nx6PeuE+bJo0w7BQI5NKGLN5XAW11LX7BQ8jia7bCLl2kc7mqTLzuxAOeeJH0Wk6VVf0oldyEN15T948CDm+sMiZRfjK0pZIbUwcd+3TphnF62lR8kXN44hAbhmG5WQNnT8zynucsnuYJhFpBfkMzqD4AAAAASUVORK5CYII='
      when 'Original'
        @unreadDead = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs='
        @unreadSFW  = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAC6Xw////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs='
        @unreadNSFW = 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAGbMM////////yH5BAEKAAMALAAAAAAQABAAAAI/nI95wsqygIRxDgGCBhTrwF3Zxowg5H1cSopS6FrGQ82PU1951ckRmYKJVCXizLRC9kAnT0aIiR6lCFT1cigAADs='
    @unread = if @SFW then @unreadSFW else @unreadNSFW

  empty: 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP///9vb2////yH5BAEAAAMALAAAAAAQABAAAAIvnI+pq+D9DBAUoFkPFnbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='
  dead: 'data:image/gif;base64,R0lGODlhEAAQAKECAAAAAP8AAP///////yH5BAEKAAIALAAAAAAQABAAAAIvlI+pq+D9DAgUoFkPDlbs7lFZKIJOJJ3MyraoB14jFpOcVMpzrnF3OKlZYsMWowAAOw=='

Redirect =
  image: (board, filename) ->
    # Do not use g.BOARD, the image url can originate from a cross-quote.
    switch board
      when 'a', 'jp', 'm', 'sp', 'tg', 'vg', 'wsg'
        "//archive.foolz.us/#{board}/full_image/#{filename}"
      when 'u'
        "//nsfw.foolz.us/#{board}/full_image/#{filename}"
      # these will work whenever https://github.com/eksopl/fuuka/issues/23 is done
      # when 'cgl', 'g', 'w'
      #   "//archive.rebeccablacktech.com/#{board}/full_image/#{filename}"
      # when 'an', 'toy', 'x'
      #   "http://archive.maidlab.jp/#{board}/full_image/#{filename}"
      # when 'e'
      #   "https://md401.homelinux.net/4chan/cgi-board.pl/#{board}/full_image/#{filename}"
  post: (board, postID) ->
    switch board
      when 'a', 'co', 'jp', 'm', 'sp', 'tg', 'tv', 'v', 'vg', 'wsg', 'dev', 'foolz'
        "//archive.foolz.us/api/chan/post/board/#{board}/num/#{postID}/format/json"
      when 'u', 'kuku'
        "//nsfw.foolz.us/api/chan/post/board/#{board}/num/#{postID}/format/json"
  thread: (board, threadID, postID) ->
    # keep the number only if the location.hash was sent f.e.
    postID = postID.match(/\d+/)[0] if postID
    path   =
      if threadID
        "#{board}/thread/#{threadID}"
      else
        "#{board}/post/#{postID}"
    switch board
      when 'a', 'co', 'jp', 'm', 'sp', 'tg', 'tv', 'v', 'vg', 'wsg', 'dev', 'foolz'
        url = "//archive.foolz.us/#{path}/"
        if threadID and postID
          url += "##{postID}"
      when 'u', 'kuku'
        url = "//nsfw.foolz.us/#{path}/"
        if threadID and postID
          url += "##{postID}"
      when 'ck', 'lit'
        url = "//fuuka.warosu.org/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'diy', 'g', 'k', 'sci'
        url = "//archive.installgentoo.net/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'cgl', 'mu', 'soc', 'w'
        url = "//archive.rebeccablacktech.com/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'an', 'fit', 'r9k', 'toy', 'x'
        url = "http://archive.maidlab.jp/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'e'
        url = "https://md401.homelinux.net/4chan/cgi-board.pl/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      else
        if threadID
          url = "//boards.4chan.org/#{board}/"
    url or null

ImageHover =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    return unless post.img
    $.on post.img, 'mouseover', ImageHover.mouseover
  mouseover: ->
    # Make sure to remove the previous image hover
    # in case it got stuck. Opera-only bug?
    if el = $.id 'ihover'
      if el is UI.el
        delete UI.el
      $.rm el

    # Don't stop other elements from dragging
    return if UI.el

    el = UI.el = $.el 'img'
      id: 'ihover'
      src: @parentNode.href
    $.add d.body, el
    $.on el, 'load',      ImageHover.load
    $.on el, 'error',     ImageHover.error
    $.on @,  'mousemove', UI.hover
    $.on @,  'mouseout',  ImageHover.mouseout
  load: ->
    return unless @parentNode
    # 'Fake' mousemove event by giving required values.
    {style} = @
    UI.hover
      clientX: - 45 + parseInt style.left
      clientY:  120 + parseInt style.top
  error: ->
    src = @src.replace(/\?\d+$/, '').split '/'
    unless src[2] is 'images.4chan.org' and url = Redirect.image src[3], src[5]
      return if g.dead
      # This will fool CloudFlare's cache.
      url = "//images.4chan.org/#{src[3]}/src/#{src[5]}?#{Date.now()}"
    return if $.engine isnt 'webkit' and url.split('/')[2] is 'images.4chan.org'
    timeoutID = setTimeout (=> @src = url), 3000
    # Only Chrome let userscripts do cross domain requests.
    # Don't check for 404'd status in the archivers.
    return if $.engine isnt 'webkit' or url.split('/')[2] isnt 'images.4chan.org'
    $.ajax url, onreadystatechange: (-> clearTimeout timeoutID if @status is 404),
      type: 'head'
  mouseout: ->
    UI.hoverend()
    $.off @, 'mousemove', UI.hover
    $.off @, 'mouseout',  ImageHover.mouseout

AutoGif =
  init: ->
    return if g.BOARD in ['gif', 'wsg']
    Main.callbacks.push @node
  node: (post) ->
    {img} = post
    return if post.el.hidden or not img
    src = img.parentNode.href
    if /gif$/.test(src) and !/spoiler/.test img.src
      gif = $.el 'img'
      $.on gif, 'load', ->
        # Replace the thumbnail once the GIF has finished loading.
        img.src = src
      gif.src = src

ImageExpand =
  init: ->
    Main.callbacks.push @node
    @dialog()

  node: (post) ->
    return unless post.img
    a = post.img.parentNode
    $.on a, 'click', ImageExpand.cb.toggle
    if ImageExpand.on and !post.el.hidden
      ImageExpand.expand post.img
  cb:
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      e.preventDefault()
      ImageExpand.toggle @
    all: ->
      ImageExpand.on = @checked
      if ImageExpand.on #expand
        thumbs = $$ 'img[data-md5]'
        if Conf['Expand From Current']
          for thumb, i in thumbs
            if thumb.getBoundingClientRect().top > 0
              break
          thumbs = thumbs[i...]
        for thumb in thumbs
          ImageExpand.expand thumb
      else #contract
        for thumb in $$ 'img[data-md5][hidden]'
          ImageExpand.contract thumb
      return
    typeChange: ->
      switch @value
        when 'full'
          klass = ''
        when 'fit width'
          klass = 'fitwidth'
        when 'fit height'
          klass = 'fitheight'
        when 'fit screen'
          klass = 'fitwidth fitheight'
      $.id('delform').className = klass
      if /\bfitheight\b/.test klass
        $.on window, 'resize', ImageExpand.resize
        unless ImageExpand.style
          ImageExpand.style = $.addStyle ''
        ImageExpand.resize()
      else if ImageExpand.style
        $.off window, 'resize', ImageExpand.resize

  toggle: (a) ->
    thumb = a.firstChild
    if thumb.hidden
      rect = a.getBoundingClientRect()
      if $.engine is 'webkit'
        d.body.scrollTop  += rect.top - 42 if rect.top < 0
        d.body.scrollLeft += rect.left     if rect.left < 0
      else
        d.documentElement.scrollTop  += rect.top - 42 if rect.top < 0
        d.documentElement.scrollLeft += rect.left     if rect.left < 0
      ImageExpand.contract thumb
    else
      ImageExpand.expand thumb

  contract: (thumb) ->
    thumb.hidden = false
    thumb.nextSibling.hidden = true
    $.rmClass thumb.parentNode.parentNode.parentNode, 'image_expanded'

  expand: (thumb, url) ->
    # Do not expand images of hidden/filtered replies, or already expanded pictures.
    return if $.x 'ancestor-or-self::*[@hidden]', thumb
    thumb.hidden = true
    $.addClass thumb.parentNode.parentNode.parentNode, 'image_expanded'
    if img = thumb.nextSibling
      # Expand already loaded picture
      img.hidden = false
      return
    a = thumb.parentNode
    img = $.el 'img',
      src: url or a.href
    $.on img, 'error', ImageExpand.error
    $.add a, img

  error: ->
    thumb = @previousSibling
    ImageExpand.contract thumb
    $.rm @
    src = @src.replace(/\?\d+$/, '').split '/'
    unless src[2] is 'images.4chan.org' and url = Redirect.image src[3], src[5]
      return if g.dead
      # This will fool CloudFlare's cache.
      url = "//images.4chan.org/#{src[3]}/src/#{src[5]}?#{Date.now()}"
    return if $.engine isnt 'webkit' and url.split('/')[2] is 'images.4chan.org'
    timeoutID = setTimeout ImageExpand.expand, 10000, thumb, url
    # Only Chrome let userscripts do cross domain requests.
    # Don't check for 404'd status in the archivers.
    return if $.engine isnt 'webkit' or url.split('/')[2] isnt 'images.4chan.org'
    $.ajax url, onreadystatechange: (-> clearTimeout timeoutID if @status is 404),
      type: 'head'

  dialog: ->
    controls = $.el 'div',
      id: 'imgControls'
      innerHTML:
        "<select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label>Expand Images<input type=checkbox id=imageExpand></label>"
    imageType = $.get 'imageType', 'full'
    select = $ 'select', controls
    select.value = imageType
    ImageExpand.cb.typeChange.call select
    $.on select, 'change', $.cb.value
    $.on select, 'change', ImageExpand.cb.typeChange
    $.on $('input', controls), 'click', ImageExpand.cb.all

    $.prepend $.id('delform'), controls

  resize: ->
    ImageExpand.style.textContent = ".fitheight img[data-md5] + img {max-height:#{d.documentElement.clientHeight}px;}"

Main =
  init: ->
    Main.flatten null, Config

    path = location.pathname
    pathname = path[1..].split '/'
    [g.BOARD, temp] = pathname
    if temp is 'res'
      g.REPLY = true
      g.THREAD_ID = pathname[2]

    # Load values from localStorage.
    for key, val of Conf
      Conf[key] = $.get key, val

    switch location.hostname
      when 'sys.4chan.org'
        if /report/.test location.search
          $.ready ->
            $.on $.id('recaptcha_response_field'), 'keydown', (e) ->
              window.location = 'javascript:Recaptcha.reload()' if e.keyCode is 8 and not e.target.value
        return
      when 'images.4chan.org'
        $.ready ->
          if /^4chan - 404/.test(d.title) and Conf['404 Redirect']
            path = location.pathname.split '/'
            url  = Redirect.image path[1], path[3]
            location.href = url if url
        return

    $.ready Options.init

    if Conf['Quick Reply'] and Conf['Hide Original Post Form']
      Main.css += '#postForm { display: none; }'

    Main.addStyle()

    now = Date.now()
    if Conf['Check for Updates'] and $.get('lastUpdate',  0) < now - 6*$.HOUR
      $.ready ->
        $.on window, 'message', Main.message
        $.set 'lastUpdate', now
        $.add d.head, $.el 'script',
          src: 'https://github.com/MayhemYDG/4chan-x/raw/master/latest.js'

    g.hiddenReplies = $.get "hiddenReplies/#{g.BOARD}/", {}
    if $.get('lastChecked', 0) < now - 1*$.DAY
      $.set 'lastChecked', now

      cutoff = now - 7*$.DAY
      hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}

      for id, timestamp of hiddenThreads
        if timestamp < cutoff
          delete hiddenThreads[id]

      for id, timestamp of g.hiddenReplies
        if timestamp < cutoff
          delete g.hiddenReplies[id]

      $.set "hiddenThreads/#{g.BOARD}/", hiddenThreads
      $.set "hiddenReplies/#{g.BOARD}/", g.hiddenReplies


    #major features
    if Conf['Filter']
      Filter.init()

    if Conf['Reply Hiding']
      ReplyHiding.init()

    if Conf['Filter'] or Conf['Reply Hiding']
      StrikethroughQuotes.init()

    if Conf['Anonymize']
      Anonymize.init()

    if Conf['Time Formatting']
      Time.init()

    if Conf['File Info Formatting']
      FileInfo.init()

    if Conf['Sauce']
      Sauce.init()

    if Conf['Reveal Spoilers']
      RevealSpoilers.init()

    if Conf['Image Auto-Gif']
      AutoGif.init()

    if Conf['Image Hover']
      ImageHover.init()

    if Conf['Menu']
      Menu.init()

      if Conf['Report Link']
        ReportLink.init()

      if Conf['Delete Link']
        DeleteLink.init()

      if Conf['Filter']
        Filter.menuInit()

      if Conf['Download Link']
        DownloadLink.init()

      if Conf['Archive Link']
        ArchiveLink.init()

    if Conf['Resurrect Quotes']
      Quotify.init()

    if Conf['Quote Inline']
      QuoteInline.init()

    if Conf['Quote Preview']
      QuotePreview.init()

    if Conf['Quote Backlinks']
      QuoteBacklink.init()

    if Conf['Indicate OP quote']
      QuoteOP.init()

    if Conf['Indicate Cross-thread Quotes']
      QuoteCT.init()

    $.ready Main.ready

  ready: ->
    if /^4chan - 404/.test d.title
      if Conf['404 Redirect'] and /^\d+$/.test g.THREAD_ID
        location.href = Redirect.thread g.BOARD, g.THREAD_ID, location.hash
      return
    unless $.id 'navtopr'
      return
    $.addClass d.body, $.engine
    $.addClass d.body, 'fourchan_x'
    for nav in ['boardNavDesktop', 'boardNavDesktopFoot']
      if a = $ "a[href$='/#{g.BOARD}/']", $.id nav
        # Gotta make it work in temporary boards.
        $.addClass a, 'current'
    Favicon.init()

    # Major features.
    if Conf['Quick Reply']
      QR.init()

    if Conf['Image Expansion']
      ImageExpand.init()

    if Conf['Thread Watcher']
      setTimeout -> Watcher.init()

    if Conf['Keybinds']
      setTimeout -> Keybinds.init()

    if g.REPLY
      if Conf['Thread Updater']
        setTimeout -> Updater.init()

      if Conf['Thread Stats']
        ThreadStats.init()

      if Conf['Reply Navigation']
        setTimeout -> Nav.init()

      if Conf['Post in Title']
        TitlePost.init()

      if Conf['Unread Count'] or Conf['Unread Favicon']
        Unread.init()

    else #not reply
      if Conf['Thread Hiding']
        ThreadHiding.init()

      if Conf['Thread Expansion']
        setTimeout -> ExpandThread.init()

      if Conf['Comment Expansion']
        setTimeout -> ExpandComment.init()

      if Conf['Index Navigation']
        setTimeout -> Nav.init()

    board = $ '.board'
    nodes = []
    for node in $$ '.postContainer', board
      nodes.push Main.preParse node
    Main.node nodes, true

    # Execute these scripts on inserted posts, not page init.
    Main.hasCodeTags = !! $ 'script[src="//static.4chan.org/js/prettify/prettify.js"]'

    if MutationObserver = window.WebKitMutationObserver or window.MozMutationObserver or window.OMutationObserver or window.MutationObserver
      observer = new MutationObserver Main.observer
      observer.observe board,
        childList: true
        subtree:   true
    else
      $.on board, 'DOMNodeInserted', Main.listener
    return

  flatten: (parent, obj) ->
    if obj instanceof Array
      Conf[parent] = obj[0]
    else if typeof obj is 'object'
      for key, val of obj
        Main.flatten key, val
    else # string or number
      Conf[parent] = obj
    return

  addStyle: ->
    $.off d, 'DOMNodeInserted', Main.addStyle
    if d.head
      $.addStyle Main.css
    else # XXX fox
      $.on d, 'DOMNodeInserted', Main.addStyle

  message: (e) ->
    {version} = e.data
    if version and version isnt Main.version and confirm 'An updated version of 4chan X is available, would you like to install it now?'
      window.location = "https://raw.github.com/mayhemydg/4chan-x/#{version}/4chan_x.user.js"

  preParse: (node) ->
    parentClass = node.parentNode.className
    el   = $ '.post', node
    post =
      root:        node
      el:          el
      class:       el.className
      ID:          el.id.match(/\d+$/)[0]
      threadID:    g.THREAD_ID or $.x('ancestor::div[parent::div[@class="board"]]', node).id.match(/\d+$/)[0]
      isArchived:  /\barchivedPost\b/.test parentClass
      isInlined:   /\binline\b/.test       parentClass
      isCrosspost: /\bcrosspost\b/.test    parentClass
      blockquote:  el.lastElementChild
      quotes:      el.getElementsByClassName 'quotelink'
      backlinks:   el.getElementsByClassName 'backlink'
      fileInfo:    false
      img:         false
    if img = $ 'img[data-md5]', el
      # Make sure to not add deleted images,
      # those do not have a data-md5 attribute.
      post.fileInfo = img.parentNode.previousElementSibling
      post.img      = img
    Main.prettify post.blockquote
    post
  node: (nodes, notify) ->
    for callback in Main.callbacks
      try
        callback node for node in nodes
      catch err
        alert "4chan X (#{Main.version}) error: #{err.message}\nReport the bug at mayhemydg.github.com/4chan-x/#bug-report\n\nURL: #{window.location}\n#{err.stack}" if notify
    return
  observer: (mutations) ->
    nodes = []
    for mutation in mutations
      for addedNode in mutation.addedNodes
        if /\bpostContainer\b/.test addedNode.className
          nodes.push Main.preParse addedNode
    Main.node nodes if nodes.length
  listener: (e) ->
    {target} = e
    if /\bpostContainer\b/.test target.className
      Main.node [Main.preParse target]

  prettify: (bq) ->
    return unless Main.hasCodeTags
    code = ->
      for pre in document.getElementById('_id_').getElementsByClassName 'prettyprint'
        pre.innerHTML = prettyPrintOne pre.innerHTML.replace /\s/g, '&nbsp;'
      return
    $.globalEval "(#{code})()".replace '_id_', bq.id

  namespace: '4chan_x.'
  version: '2.34.2'
  callbacks: []
  css: '
/* dialog styling */
.dialog.reply {
  display: block;
  border: 1px solid rgba(0,0,0,.25);
  padding: 0;
}
.move {
  cursor: move;
}
label, .favicon {
  cursor: pointer;
}
a[href="javascript:;"] {
  text-decoration: none;
}
.warning {
  color: red;
}

.hide_thread_button:not(.hidden_thread) {
  float: left;
}

.thread > .hidden_thread ~ *,
[hidden],
#content > [name=tab]:not(:checked) + div,
#updater:not(:hover) > :not(.move),
.autohide:not(:hover) > form,
#qp input, #qp .inline, .forwarded {
  display: none !important;
}

.menu_button {
  display: inline-block;
}
.menu_button > span {
  border-top:   .5em solid;
  border-right: .3em solid transparent;
  border-left:  .3em solid transparent;
  display: inline-block;
  margin: 2px;
  vertical-align: middle;
}
#menu {
  position: absolute;
  outline: none;
}
.entry {
  border-bottom: 1px solid rgba(0, 0, 0, .25);
  cursor: pointer;
  display: block;
  outline: none;
  padding: 3px 7px;
  position: relative;
  text-decoration: none;
  white-space: nowrap;
}
.entry:last-child {
  border: none;
}
.focused.entry {
  background: rgba(255, 255, 255, .33);
}
.entry.hasSubMenu {
  padding-right: 1.5em;
}
.hasSubMenu::after {
  content: "";
  border-left:   .5em solid;
  border-top:    .3em solid transparent;
  border-bottom: .3em solid transparent;
  display: inline-block;
  margin: .3em;
  position: absolute;
  right: 3px;
}
.hasSubMenu:not(.focused) > .subMenu {
  display: none;
}
.subMenu {
  position: absolute;
  left: 100%;
  top: 0;
  margin-top: -1px;
}

h1 {
  text-align: center;
}
#qr > .move {
  min-width: 300px;
  overflow: hidden;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  padding: 0 2px;
}
#qr > .move > span {
  float: right;
}
#autohide, .close, #qr select, #dump, .remove, .captchaimg, #qr div.warning {
  cursor: pointer;
}
#qr select,
#qr > form {
  margin: 0;
}
#dump {
  background: -webkit-linear-gradient(#EEE, #CCC);
  background: -moz-linear-gradient(#EEE, #CCC);
  background: -o-linear-gradient(#EEE, #CCC);
  background: linear-gradient(#EEE, #CCC);
  width: 10%;
  padding: -moz-calc(1px) 0 2px;
}
#dump:hover, #dump:focus {
  background: -webkit-linear-gradient(#FFF, #DDD);
  background: -moz-linear-gradient(#FFF, #DDD);
  background: -o-linear-gradient(#FFF, #DDD);
  background: linear-gradient(#FFF, #DDD);
}
#dump:active, .dump #dump:not(:hover):not(:focus) {
  background: -webkit-linear-gradient(#CCC, #DDD);
  background: -moz-linear-gradient(#CCC, #DDD);
  background: -o-linear-gradient(#CCC, #DDD);
  background: linear-gradient(#CCC, #DDD);
}
#qr:not(.dump) #replies, .dump > form > label {
  display: none;
}
#replies {
  display: block;
  height: 100px;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
#replies > div {
  counter-reset: thumbnails;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: 0; padding: 0;
  overflow: hidden;
  position: absolute;
  white-space: pre;
}
#replies > div:hover {
  bottom: -10px;
  overflow-x: auto;
  z-index: 1;
}
.thumbnail {
  background-color: rgba(0,0,0,.2) !important;
  background-position: 50% 20% !important;
  background-size: cover !important;
  border: 1px solid #666;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  cursor: move;
  display: inline-block;
  height: 90px; width: 90px;
  margin: 5px; padding: 2px;
  opacity: .5;
  outline: none;
  overflow: hidden;
  position: relative;
  text-shadow: 0 1px 1px #000;
  -webkit-transition: opacity .25s ease-in-out;
  -moz-transition: opacity .25s ease-in-out;
  -o-transition: opacity .25s ease-in-out;
  transition: opacity .25s ease-in-out;
  vertical-align: top;
}
.thumbnail:hover, .thumbnail:focus {
  opacity: .9;
}
.thumbnail#selected {
  opacity: 1;
}
.thumbnail::before {
  counter-increment: thumbnails;
  content: counter(thumbnails);
  color: #FFF;
  font-weight: 700;
  padding: 3px;
  position: absolute;
  top: 0;
  right: 0;
  text-shadow: 0 0 3px #000, 0 0 8px #000;
}
.thumbnail.drag {
  box-shadow: 0 0 10px rgba(0,0,0,.5);
}
.thumbnail.over {
  border-color: #FFF;
}
.thumbnail > span {
  color: #FFF;
}
.remove {
  background: none;
  color: #E00;
  font-weight: 700;
  padding: 3px;
}
.remove:hover::after {
  content: " Remove";
}
.thumbnail > label {
  background: rgba(0,0,0,.5);
  color: #FFF;
  right: 0; bottom: 0; left: 0;
  position: absolute;
  text-align: center;
}
.thumbnail > label > input {
  margin: 0;
}
#addReply {
  color: #333;
  font-size: 3.5em;
  line-height: 100px;
}
#addReply:hover, #addReply:focus {
  color: #000;
}
.field {
  border: 1px solid #CCC;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  color: #333;
  font: 13px sans-serif;
  margin: 0;
  padding: 2px 4px 3px;
  -webkit-transition: color .25s, border .25s;
  -moz-transition: color .25s, border .25s;
  -o-transition: color .25s, border .25s;
  transition: color .25s, border .25s;
}
.field:-moz-placeholder,
.field:hover:-moz-placeholder {
  color: #AAA;
}
.field:hover, .field:focus {
  border-color: #999;
  color: #000;
  outline: none;
}
#qr > form > div:first-child > .field:not(#dump) {
  width: 30%;
}
#qr textarea.field {
  display: -webkit-box;
  min-height: 120px;
  min-width: 100%;
}
.textarea {
  position: relative;
}
#charCount {
  color: #000;
  background: hsla(0, 0%, 100%, .5);
  position: absolute;
  top: 100%;
  right: 0;
}
#charCount.warning {
  color: red;
}
.captchainput > .field {
  min-width: 100%;
}
.captchaimg {
  background: #FFF;
  outline: 1px solid #CCC;
  outline-offset: -1px;
  text-align: center;
}
.captchaimg > img {
  display: block;
  height: 57px;
  width: 300px;
}
#qr [type=file] {
  margin: 1px 0;
  width: 70%;
}
#qr [type=submit] {
  margin: 1px 0;
  padding: 1px; /* not Gecko */
  padding: 0 -moz-calc(1px); /* Gecko does not respect box-sizing: border-box */
  width: 30%;
}

.fileText:hover .fntrunc,
.fileText:not(:hover) .fnfull {
  display: none;
}
.fitwidth img[data-md5] + img {
  max-width: 100%;
}
.gecko  .fitwidth img[data-md5] + img,
.presto .fitwidth img[data-md5] + img {
  width: 100%;
}

#qr, #qp, #updater, #stats, #ihover, #overlay, #navlinks {
  position: fixed;
}

#ihover {
  max-height: 97%;
  max-width: 75%;
  padding-bottom: 18px;
}

#navlinks {
  font-size: 16px;
  top: 25px;
  right: 5px;
}

body {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}
body.unscroll {
  overflow: hidden;
}
#overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0,0,0,.5);
  z-index: 1;
}
#overlay::after {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
#options {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  display: inline-block;
  padding: 5px;
  position: relative;
  text-align: left;
  vertical-align: middle;
  width: 600px;
  max-width: 100%;
  height: 500px;
  max-height: 100%;
}
#credits {
  float: right;
}
#options ul {
  padding: 0;
}
#options article li {
  margin: 10px 0 10px 2em;
}
#options code {
  background: hsla(0, 0%, 100%, .5);
  color: #000;
  padding: 0 1px;
}
#options label {
  text-decoration: underline;
}
#content {
  overflow: auto;
  position: absolute;
  top: 2.5em;
  right: 5px;
  bottom: 5px;
  left: 5px;
}
#content textarea {
  font-family: monospace;
  min-height: 350px;
  resize: vertical;
  width: 100%;
}

#updater {
  text-align: right;
}
#updater:not(:hover) {
  border: none;
  background: transparent;
}
#updater input[type=number] {
  width: 4em;
}
.new {
  background: lime;
}

#watcher {
  padding-bottom: 5px;
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
}
#watcher:not(:hover) {
  max-height: 220px;
}
#watcher > div {
  max-width: 200px;
  overflow: hidden;
  padding-left: 5px;
  padding-right: 5px;
  text-overflow: ellipsis;
}
#watcher > .move {
  padding-top: 5px;
  text-decoration: underline;
}

#qp {
  padding: 2px 2px 5px;
}
#qp .post {
  border: none;
  margin: 0;
  padding: 0;
}
#qp img {
  max-height: 300px;
  max-width: 500px;
}
.qphl {
  outline: 2px solid rgba(216, 94, 49, .7);
}
.inlined {
  opacity: .5;
}
.inline {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(128, 128, 128, 0.5);
  display: table;
  margin: 2px;
  padding: 2px;
}
.inline .post {
  background: none;
  border: none;
  margin: 0;
  padding: 0;
}
div.opContainer {
  display: block !important;
}
.opContainer.filter_highlight {
  box-shadow: inset 5px 0 rgba(255,0,0,0.5);
}
.filter_highlight > .reply {
  box-shadow: -5px 0 rgba(255,0,0,0.5);
}
.filtered {
  text-decoration: underline line-through;
}
.quotelink.forwardlink,
.backlink.forwardlink {
  text-decoration: none;
  border-bottom: 1px dashed;
}
'

Main.init()
