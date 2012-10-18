Markdown =
  format: (text) ->
    tag_patterns =
      bi:   /(\*\*\*|___)(?=\S)([^\r\n]*?\S)\1/g
      b:    /(\*\*|__)(?=\S)([^\r\n]*?\S)\1/g
      i:    /(\*|_)(?=\S)([^\r\n]*?\S)\1/g
      code: /(`)(?=\S)([^\r\n]*?\S)\1/g
      ds:   /(\|\||__)(?=\S)([^\r\n]*?\S)\1/g
    unless text?
      for tag, pattern of tag_patterns
        text = text.replace pattern, Markdown.unicode_convert
      text

  unicode_convert: (str, tag, inner) ->
    if tag is "_" or tag is "*"
      fmt = "i"
    else if tag is "__" or tag is "**"
      fmt = "b"
    else if tag is "***" or tag is "___"
      fmt = "bi"
    else if tag is "||"
      fmt = "ds"
    else fmt = "code"  if tag is "`" or tag is "```"

    #Unicode codepoints for the characters '0', 'A', and 'a'
    #http://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols
    codepoints =
      b:    [ 0x1D7CE, 0x1D400, 0x1D41A ] #MATHEMATICAL BOLD
      i:    [ 0x1D7F6, 0x1D434, 0x1D44E ] #MATHEMATICAL ITALIC
      bi:   [ 0x1D7CE, 0x1D468, 0x1D482 ] #MATHEMATICAL BOLD ITALIC
      code: [ 0x1D7F6, 0x1D670, 0x1D68A ] #MATHEMATICAL MONOSPACE
      ds:   [ 0x1D7D8, 0x1D538, 0x1D552 ] #I FUCKING LOVE CAPS LOCK

    charcodes = (inner.charCodeAt i for c, i in inner)

    codes = for charcode in charcodes
      if charcode >= 48 and charcode <= 57
        charcode - 48 + codepoints[fmt][0]
      else if charcode >= 65 and charcode <= 90
        charcode - 65 + codepoints[fmt][1]
      else if charcode >= 97 and charcode <= 122
        if charcode is 104 and tag is "i"
          #http://blogs.msdn.com/b/michkap/archive/2006/04/21/580328.aspx
          #mathematical small h -> planck constant
          0x210E
        else
          charcode - 97 + codepoints[fmt][2]
      else
        charcode

    unicode_text = codes.map(Markdown.ucs2_encode).join ""
    unicode_text = unicode_text.replace(/\x20/g, "\xA0")  if tag is "code"
    unicode_text

  ucs2_encode: (value) ->
    #translates Unicode codepoint integers directly into text. Javascript does this in an ugly fashion by default.
    ###
    From Punycode.js: https://github.com/bestiejs/punycode.js

    Copyright Mathias Bynens <http://mathiasbynens.be/>

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF`
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    ###
    output = ""
    if value > 0xFFFF
      value -= 0x10000
      output += String.fromCharCode value >>> 10 & 0x3FF | 0xD800
      value = 0xDC00 | value & 0x3FF
    output += String.fromCharCode value
    output

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

        if key is 'md5'
          # MD5 filter will use strings instead of regular expressions.
          regexp = regexp[1]
        else
          try
            # Please, don't write silly regular expressions.
            regexp = RegExp regexp[1], regexp[2]
          catch err
            # I warned you, bro.
            alert err.message
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
            ReplyHiding.hide post.root, result.stub
          return

        # Highlight
        $.addClass root, result.class

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
    if subject = $ '.postInfo .subject', post.el
      return subject.textContent
    false
  comment: (post) ->
    text = []
    nodes = d.evaluate './/br|.//text()', post.blockquote, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
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
      return img.alt.replace 'Spoiler Image, ', ''
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
        if Conf['Recursive Filtering'] and post.ID isnt post.threadID
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
    @textContent = "Loading No.#{replyID}..."
    a = @
    $.cache "//api.4chan.org#{@pathname}.json", -> ExpandComment.parse @, a, threadID, replyID
  parse: (req, a, threadID, replyID) ->
    if req.status isnt 200
      a.textContent = "#{req.status} #{req.statusText}"
      return

    posts = JSON.parse(req.response).posts
    if spoilerRange = posts[0].custom_spoiler
      Build.spoilerRange[g.BOARD] = spoilerRange
    replyID = +replyID

    for post in posts
      break if post.no is replyID
    if post.no isnt replyID
      a.textContent = 'No.#{replyID} not found.'
      return

    bq = $.id "m#{replyID}"
    clone = bq.cloneNode false
    clone.innerHTML = post.com
    quotes = clone.getElementsByClassName 'quotelink'
    for quote in quotes
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote
      quote.href = "res/#{href}" # Fix pathnames
    post =
      blockquote: clone
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
    $.replace bq, clone
    if Conf['Linkify']
      Linkify.node      post
    Main.prettify clone

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
    url = "//api.4chan.org/#{g.BOARD}/res/#{thread.id[1..]}.json"
    a   = $ '.summary', thread

    switch a.textContent[0]
      when '+'
        a.textContent = a.textContent.replace '+', '× Loading...'
        $.cache url, -> ExpandThread.parse @, thread, a

      when 'X'
        a.textContent = a.textContent.replace '× Loading...', '+'
        $.cache.requests[url].abort()

      when '-'
        a.textContent = a.textContent.replace '-', '+'
        #goddamit moot
        num = switch g.BOARD
          when 'b', 'vg', 'q' then 3
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

    posts = JSON.parse(req.response).posts
    if spoilerRange = posts[0].custom_spoiler
      Build.spoilerRange[g.BOARD] = spoilerRange

    replies  = posts[1..]
    threadID = thread.id[1..]
    nodes    = []
    for reply in replies
      post = Build.postFromObject reply, g.BOARD
      id   = reply.no
      link = $ 'a[title="Highlight this post"]', post
      link.href = "res/#{threadID}#p#{id}"
      link.nextSibling.href = "res/#{threadID}#q#{id}"
      nodes.push post
    # eat everything, then replace with fresh full posts
    for post in $$ '.summary ~ .replyContainer', a.parentNode
      $.rm post
    for backlink in $$ '.backlink', a.previousElementSibling
      # Keep backlinks from other threads.
      $.rm backlink unless $.id backlink.hash[1..]
    $.after a, nodes

ThreadHiding =
  init: ->
    ThreadHiding.hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    for thread in $$ '.thread'
      a = $.el 'a',
        className: 'hide_thread_button'
        innerHTML: '<span>[ - ]</span>'
        href: 'javascript:;'
      $.on a, 'click', ->
        ThreadHiding.toggle @parentElement
      $.prepend thread, a

      if thread.id[1..] of ThreadHiding.hiddenThreads
        ThreadHiding.hide thread
    return


  toggle: (thread) ->
    id = thread.id[1..]
    if thread.hidden or /\bhidden_thread\b/.test thread.firstChild.className
      ThreadHiding.show thread
      delete ThreadHiding.hiddenThreads[id]
    else
      ThreadHiding.hide thread
      ThreadHiding.hiddenThreads[id] = Date.now()
    $.set "hiddenThreads/#{g.BOARD}/", ThreadHiding.hiddenThreads

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
    opInfo  = $('.desktop > .nameBlock', thread).textContent

    stub = $.el 'a',
      className: 'hidden_thread'
      innerHTML: '<span class=hide_thread_button>[ + ]</span>'
      href:      'javascript:;'
    $.on  stub, 'click', ->
      ThreadHiding.toggle @parentElement
    $.add stub, $.tn "#{opInfo} (#{text})"
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
    $.on side.firstChild, 'click', ->
      ReplyHiding.toggle button = @parentNode, root = button.parentNode, id = root.id[2..]

    if post.ID of g.hiddenReplies
      ReplyHiding.hide post.root

  toggle: (button, root, id) ->
    quotes = $$ ".quotelink[href$='#p#{id}'], .backlink[href$='#p#{id}']"
    if /\bstub\b/.test button.className
      ReplyHiding.show root
      $.rmClass root, 'hidden'
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
    $.addClass side.parentNode, 'hidden'
    return if side.hidden # already hidden once by the filter
    side.hidden = true
    el = side.nextElementSibling
    el.hidden = true

    $.addClass root, 'hidden'

    return unless show_stub

    stub = $.el 'div',
      className: 'hide_reply_button stub'
      innerHTML: '<a href="javascript:;"><span>[ + ]</span> </a>'
    a = stub.firstChild
    $.on  a, 'click', ->
      ReplyHiding.toggle button = @parentNode, root = button.parentNode, id = root.id[2..]
    $.add a, $.tn $('.desktop > .nameBlock', el).textContent
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

    $.rmClass root, 'hidden'

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
      # \u00A0 is nbsp
      $.add $('.postInfo', post.el), [$.tn('\u00A0'), a]
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
      when Conf.sageru
        $("[name=email]", QR.el).value = "sage"
        QR.selected.email = "sage"
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
          window.location = link.href + '#delform'
      when Conf.previousPage
        if link = $ 'link[rel=prev]', d.head
          window.location = link.href + '#delform'
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
      when 13
        'Enter'
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
      rect = post.getBoundingClientRect()
      if rect.bottom >= 0 and rect.top <= d.documentElement.clientHeight # We're at least partially visible
        axis = if delta is +1 then 'following' else 'preceding'
        next = $.x axis + '::div[contains(@class,"post reply")][1]', post
        return unless next
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
    post.focus()

Nav =
  # ▲ ▼
  init: ->
    span = $.el 'span',
      id: 'navlinks'
    prev = $.el 'a',
      textContent: '▲',
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
    Nav.threads = $$ '.thread:not(.hidden)'
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

    if Conf['Rollover']
      if i is -1
        if link = $ 'link[rel=prev]', d.head
          window.location = link.href + '#delform'
        else
          window.location = "/#{g.BOARD}/0#delform"
        return
      if (delta is +1) and ( (i is Nav.threads.length) or (innerHeight + pageYOffset == d.body.scrollHeight) )
        if link = $ 'link[rel=next]', d.head
          window.location = link.href + '#delform'
          return
    {top} = Nav.threads[i]?.getBoundingClientRect()
    window.scrollBy 0, top

Updater =
  init: ->
    # Setup basic HTML layout.
    html = '<div class=move><span id=count></span> <span id=timer></span></div>'

    # Gather possible toggle configuration variables from Config object
    {checkbox} = Config.updater

    # And create fields for them.
    for name of checkbox
      title = checkbox[name][1]

      # Gather user values.
      checked = if Conf[name] then 'checked' else ''

      # And create HTML for each checkbox.
      html += "<div><label title='#{title}'>#{name}<input name='#{name}' type=checkbox #{checked}></label></div>"

    checked = if Conf['Auto Update'] then 'checked' else ''

    # Per thread auto-update and global or per board update frequency.
    html += "
      <div><label title='Controls whether *this* thread automatically updates or not'>Auto Update This<input name='Auto Update This' type=checkbox #{checked}></label></div>
      <div><label>Interval (s)<input type=number name=Interval#{if Conf['Interval per board'] then "_" + g.BOARD else ''} class=field min=1></label></div>
      <div><label>BGInterval<input type=number name=BGInterval#{if Conf['Interval per board'] then "_" + g.BOARD else ''} class=field min=1></label></div>"

    html += "<div><input value='Update Now' type=button name='Update Now'></div>"

    # Create a moveable dialog. See UI.dialog for more information.
    dialog = UI.dialog 'updater', 'bottom: 0; right: 0;', html

    # Point updater variables at HTML elements for ease of access.
    @count  = $ '#count', dialog
    @timer  = $ '#timer', dialog
    @thread = $.id "t#{g.THREAD_ID}"

    @ccheck = true
    @cnodes = []

    # How many times we have failed to find new posts.
    @unsuccessfulFetchCount = 0

    # Track last modified headers.
    @lastModified = '0'

    # Add event listeners to updater dialogs.
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
        when 'Interval', 'BGInterval', "Interval_" + g.BOARD, "BGInterval_" + g.BOARD
          input.value = Conf[input.name]
          $.on input, 'change', @cb.interval
          @cb.interval.call input
        when 'Update Now'
          $.on input, 'click', @update

    $.add d.body, dialog

    # Check for new posts on post.
    $.on d, 'QRPostSuccessful', @cb.post

    $.on d, 'visibilitychange ovisibilitychange mozvisibilitychange webkitvisibilitychange', @cb.visibility

  cb:
    post: ->
      return unless Conf['Auto Update This']
      save = []
      text = $('textarea', QR.el).value.replace(/^\s\s*/, '').replace /\n/g, ''
      unless text.length is 0
        save.push QR.replies[0].file.name
        image = false
      else
        save.push file
        image = true
      checkpost = ->
        nodes = Updater.cnodes.childNodes
        unless Conf['File Info Formatting']
          iposts = $$ 'span.fileText span', nodes
        else iposts = $$ 'span.fileText a', nodes
        if image
          (node.innerHTML for node in iposts).indexOf save[0]
        else (node.textContent for node in $$ '.postMessage', nodes).indexOf save[0]
      Updater.unsuccessfulFetchCount = 0
      setTimeout Updater.update, 1000
      count = 0
      if checkpost() is -1 and Conf['Interval'] > 10 and ($ '#timer', Updater.dialog).textContent.replace(/^-/, '') > 5
        int = setInterval (->
          Updater.ccheck = true
          Updater.update()
          if checkpost() isnt -1 or count is 30
            Updater.ccheck = false
            Updater.cnodes = []
            clearInterval int
          Updater.ccheck = false
          count++
        ), 500
    visibility: ->
      state = d.visibilityState or d.oVisibilityState or d.mozVisibilityState or d.webkitVisibilityState
      return if state isnt 'visible'
      # Reset the counter when we focus this tab.
      Updater.unsuccessfulFetchCount = 0
      if Conf['Interval per board']
        if Updater.timer.textContent < -Conf['Interval_' + g.BOARD]
          Updater.set 'timer', -Updater.getInterval()
      else
        if Updater.timer.textContent < -Conf['Interval']
          Updater.set 'timer', -Updater.getInterval()
    interval: ->
      val = parseInt @value, 10
      @value = if val > 0 then val else 30
      $.cb.value.call @
      Updater.set 'timer', -Updater.getInterval()
    verbose: ->
      if Conf['Verbose']
        Updater.set 'count', '+0'
        Updater.timer.hidden = false
      else if Conf['Style']
        Updater.set 'count', '+0'
        Updater.count.className = ''
        Updater.timer.hidden = true
      else
        Updater.set 'count', 'Thread Updater'
        Updater.count.className = ''
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
    load: ->
      switch @status
        when 404
          Updater.set 'timer', ''
          Updater.set 'count', 404
          Updater.count.className = 'warning'
          clearTimeout Updater.timeoutID
          g.dead = true
          if Conf['Unread Count']
            Unread.title = Unread.title.match(/^.+-/)[0] + ' 404'
          else
            d.title = d.title.match(/^.+-/)[0] + ' 404'
          Unread.update true
          QR.abort()
        # XXX 304 -> 0 in Opera
        when 0, 304
          ###
          Status Code 304: Not modified
          By sending the `If-Modified-Since` header we get a proper status code, and no response.
          This saves bandwidth for both the user and the servers and avoid unnecessary computation.
          ###
          Updater.unsuccessfulFetchCount++
          Updater.set 'timer', -Updater.getInterval()
          if Conf['Verbose']
            Updater.set 'count', '+0'
            Updater.count.className = null
        when 200
          Updater.lastModified = @getResponseHeader 'Last-Modified'
          Updater.cb.update JSON.parse(@response).posts
          Updater.set 'timer', -Updater.getInterval()
        else
          Updater.unsuccessfulFetchCount++
          Updater.set 'timer', -Updater.getInterval()
          if Conf['Verbose']
            Updater.set 'count', @statusText
            Updater.count.className = 'warning'
      delete Updater.request
    update: (posts) ->
      if spoilerRange = posts[0].custom_spoiler
        Build.spoilerRange[g.BOARD] = spoilerRange

      lastPost = Updater.thread.lastElementChild
      id = +lastPost.id[2..]
      nodes = []
      for post in posts.reverse()
        break if post.no <= id # Make sure to not insert older posts.
        nodes.push Build.postFromObject post, g.BOARD
        Updater.cnodes.push Build.postFromObject post, g.BOARD

      count = nodes.length
      if Conf['Verbose']
        Updater.set 'count', "+#{count}"
        Updater.count.className = if count then 'new' else null

      if count
        Updater.unsuccessfulFetchCount = 0
      else
        Updater.unsuccessfulFetchCount++
        return

      scroll = Conf['Scrolling'] and Updater.scrollBG() and
        lastPost.getBoundingClientRect().bottom - d.documentElement.clientHeight < 25
      $.add Updater.thread, nodes.reverse()
      if scroll
        nodes[0].scrollIntoView()

  set: (name, text) ->
    el = Updater[name]
    if node = el.firstChild
      # Prevent the creation of a new DOM Node
      # by setting the text node's data.
      node.data = text
    else
      el.textContent = text

  getInterval: ->
    if Conf['Interval per board']
      i  = +Conf['Interval_' + g.BOARD]
      bg = +Conf['BGInterval_' + g.BOARD]
    else
      i  = +Conf['Interval']
      bg = +Conf['BGInterval']
    w  = Conf['updateIncrease'].split ','
    wb = Conf['updateIncreaseB'].split ','
    j  = Math.min @unsuccessfulFetchCount, 9
    oi = (y) ->
      while y.length < 10
        y.push y[y.length-1]
      Number x for x in y
    hidden = d.hidden or d.oHidden or d.mozHidden or d.webkitHidden
    unless hidden
      if Conf['Optional Increase']
        return Math.max i, oi(w)[j]
      else i
    else
      if Conf['Optional Increase']
        return Math.max bg, oi(wb)[j]
      else bg

  timeout: ->
    Updater.timeoutID = setTimeout Updater.timeout, 1000
    n = 1 + Number Updater.timer.firstChild.data

    if n is 0
      Updater.update()
    else if n >= Updater.getInterval()
      Updater.unsuccessfulFetchCount++
      Updater.set 'count', 'Retry'
      Updater.count.className = null
      Updater.update()
    else
      Updater.set 'timer', n

  update: ->
    unless @ccheck
      Updater.set 'timer', 0
    else @ccheck = false
    {request} = Updater
    if request
      # Don't reset the counter when aborting.
      request.onloadend = null
      request.abort()
    url = "//api.4chan.org/#{g.BOARD}/res/#{g.THREAD_ID}.json"
    Updater.request = $.ajax url, onloadend: Updater.cb.load,
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
    filename = $('span', node)?.title or node.title
    FileInfo.data =
      link:       post.img.parentNode.href
      spoiler:    /^Spoiler/.test alt
      size:       alt.match(/\d+\.?\d*/)[0]
      unit:       alt.match(/\w+$/)[0]
      resolution: node.textContent.match(/\d+x\d+|PDF/)[0]
      fullname:   filename
      shortname:  Build.shortFilename filename, post.ID is post.threadID
    # XXX GM/Scriptish
    node.setAttribute 'data-filename', filename
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
      $.cache "//api.4chan.org/#{board}/res/#{threadID}.json", ->
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
        $.addClass root, 'warning'
        root.textContent =
          if status is 404
            "Thread No.#{threadID} 404'd."
          else
            "Error #{req.status}: #{req.statusText}."
      return

    posts = JSON.parse(req.response).posts
    if spoilerRange = posts[0].custom_spoiler
      Build.spoilerRange[board] = spoilerRange
    postID = +postID
    for post in posts
      break if post.no is postID # we found it!
      if post.no > postID
        # The post can be deleted by the time we check a quote.
        if url = Redirect.post board, postID
          $.cache url, ->
            Get.parseArchivedPost @, board, postID, root, cb
        else
          $.addClass root, 'warning'
          root.textContent = "Post No.#{postID} was not found."
        return

    $.replace root.firstChild, Get.cleanPost Build.postFromObject post, board
    cb() if cb
  parseArchivedPost: (req, board, postID, root, cb) ->
    data = JSON.parse req.response
    if data.error
      $.addClass root, 'warning'
      root.textContent = data.error
      return

    # convert comment to html
    bq = $.el 'blockquote', textContent: data.comment # set this first to convert text to HTML entities
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
    comment = bq.innerHTML.replace /(^|>)(&gt;[^<$]+)(<|$)/g, '$1<span class=quote>$2</span>$3'

    o =
      # id
      postID:   postID
      threadID: data.thread_num
      board:    board
      # info
      name:     data.name_processed
      capcode:  switch data.capcode
        when 'M' then 'mod'
        when 'A' then 'admin'
        when 'D' then 'developer'
      tripcode: data.trip
      uniqueID: data.poster_hash
      email:    if data.email then encodeURIComponent data.email.replace /&quot;/g, '"' else ''
      subject:  data.title_processed
      flagCode: data.poster_country
      flagName: data.poster_country_name_processed
      date:     data.fourchan_date
      dateUTC:  data.timestamp
      comment:  comment
      # file
    if data.media?.media_filename
      o.file =
        name:      data.media.media_filename_processed
        timestamp: data.media.media_orig
        url:       data.media.media_link or data.media.remote_media_link
        height:    data.media.media_h
        width:     data.media.media_w
        MD5:       data.media.media_hash
        size:      data.media.media_size
        turl:      data.media.thumb_link or "//thumbs.4chan.org/#{board}/thumb/#{data.media.preview_orig}"
        theight:   data.media.preview_h
        twidth:    data.media.preview_w
        isSpoiler: data.media.spoiler is '1'

    $.replace root.firstChild, Get.cleanPost Build.post o, true
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
    el = $ '.postInfo .subject', op
    unless el.textContent
      el = $ 'blockquote', op
      unless el.textContent
        el = $ '.nameBlock', op
    span = $.el 'span', innerHTML: el.innerHTML.replace /<br>/g, ' '
    "/#{g.BOARD}/ - #{span.textContent.trim()}"

Build =
  spoilerRange: {}
  shortFilename: (filename, isOP) ->
    # FILENAME SHORTENING SCIENCE:
    # OPs have a +10 characters threshold.
    # The file extension is not taken into account.
    threshold = if isOP then 40 else 30
    if filename.length - 4 > threshold
      "#{filename[...threshold - 5]}(...).#{filename[-3..]}"
    else
      filename
  postFromObject: (data, board) ->
    o =
      # id
      postID:   data.no
      threadID: data.resto or data.no
      board:    board
      # info
      name:     data.name
      capcode:  data.capcode
      tripcode: data.trip
      uniqueID: data.id
      email:    if data.email then encodeURIComponent data.email.replace /&quot;/g, '"' else ''
      subject:  data.sub
      flagCode: data.country
      flagName: data.country_name
      date:     data.now
      dateUTC:  data.time
      comment:  data.com
      # thread status
      isSticky: !!data.sticky
      isClosed: !!data.closed
      # file
    if data.ext or data.filedeleted
      o.file =
        name:      data.filename + data.ext
        timestamp: "#{data.tim}#{data.ext}"
        url:       "//images.4chan.org/#{board}/src/#{data.tim}#{data.ext}"
        height:    data.h
        width:     data.w
        MD5:       data.md5
        size:      data.fsize
        turl:      "//thumbs.4chan.org/#{board}/thumb/#{data.tim}s.jpg"
        theight:   data.tn_h
        twidth:    data.tn_w
        isSpoiler: !!data.spoiler
        isDeleted: !!data.filedeleted
    Build.post o
  post: (o, isArchived) ->
    ###
    This function contains code from 4chan-JS (https://github.com/4chan/4chan-JS).
    @license: https://github.com/4chan/4chan-JS/blob/master/LICENSE
    ###
    {
      postID, threadID, board
      name, capcode, tripcode, uniqueID, email, subject, flagCode, flagName, date, dateUTC
      isSticky, isClosed
      comment
      file
    } = o
    isOP = postID is threadID

    staticPath = '//static.4chan.org'

    if email
      emailStart = '<a href="mailto:' + email + '" class="useremail">'
      emailEnd   = '</a>'
    else
      emailStart = ''
      emailEnd   = ''

    subject = "<span class=subject>#{subject or ''}</span>"

    userID =
      if !capcode and uniqueID
        " <span class='posteruid id_#{uniqueID}'>(ID: " +
          "<span class=hand title='Highlight posts by this ID'>#{uniqueID}</span>)</span> "
      else
        ''

    switch capcode
      when 'admin', 'admin_highlight'
        capcodeClass = " capcodeAdmin"
        capcodeStart = " <strong class='capcode hand id_admin'" +
          "title='Highlight posts by the Administrator'>## Admin</strong>"
        capcode      = " <img src='#{staticPath}/image/adminicon.gif' " +
          "alt='This user is the 4chan Administrator.' " +
          "title='This user is the 4chan Administrator.' class=identityIcon>"
      when 'mod'
        capcodeClass = " capcodeMod"
        capcodeStart = " <strong class='capcode hand id_mod' " +
          "title='Highlight posts by Moderators'>## Mod</strong>"
        capcode      = " <img src='#{staticPath}/image/modicon.gif' " +
          "alt='This user is a 4chan Moderator.' " +
          "title='This user is a 4chan Moderator.' class=identityIcon>"
      when 'developer'
        capcodeClass = " capcodeDeveloper"
        capcodeStart = " <strong class='capcode hand id_developer' " +
          "title='Highlight posts by Developers'>## Developer</strong>"
        capcode      = " <img src='#{staticPath}/image/developericon.gif' " +
          "alt='This user is a 4chan Developer.' " +
          "title='This user is a 4chan Developer.' class=identityIcon>"
      else
        capcodeClass = ''
        capcodeStart = ''
        capcode      = ''

    flag =
      if flagCode
       " <img src='#{staticPath}/image/country/#{if board is 'pol' then 'troll/' else ''}" +
        flagCode.toLowerCase() + ".gif' alt=#{flagCode} title='#{flagName}' class=countryFlag>"
      else
        ''

    if file?.isDeleted
      fileHTML =
        if isOP
          "<div class=file id=f#{postID}><div class=fileInfo></div><span class=fileThumb>" +
              "<img src='#{staticPath}/image/filedeleted.gif' alt='File deleted.' class='fileDeleted retina'>" +
          "</span></div>"
        else
          "<div id=f#{postID} class=file><span class=fileThumb>" +
            "<img src='#{staticPath}/image/filedeleted-res.gif' alt='File deleted.' class='fileDeletedRes retina'>" +
          "</span></div>"
    else if file
      ext = file.name[-3..]
      if !file.twidth and !file.theight and ext is 'gif' # wtf ?
        file.twidth  = file.width
        file.theight = file.height

      fileSize = $.bytesToString file.size

      fileThumb = file.turl
      if file.isSpoiler
        fileSize = "Spoiler Image, #{fileSize}"
        unless isArchived
          fileThumb = '//static.4chan.org/image/spoiler'
          if spoilerRange = Build.spoilerRange[board]
            # Randomize the spoiler image.
            fileThumb += "-#{board}" + Math.floor 1 + spoilerRange * Math.random()
          fileThumb += '.png'
          file.twidth = file.theight = 100

      imgSrc = "<a class='fileThumb#{if file.isSpoiler then ' imgspoiler' else ''}' href='#{file.url}' target=_blank>" +
        "<img src='#{fileThumb}' alt='#{fileSize}' data-md5=#{file.MD5} style='width:#{file.twidth}px;height:#{file.theight}px'></a>"

      # Ha Ha filenames.
      # html -> text, translate WebKit's %22s into "s
      a = $.el 'a', innerHTML: file.name
      filename = a.textContent.replace /%22/g, '"'

      # shorten filename, get html
      a.textContent = Build.shortFilename filename
      shortFilename = a.innerHTML

      # get html
      a.textContent = filename
      filename      = a.innerHTML.replace /'/g, '&apos;'

      fileDims = if ext is 'pdf' then 'PDF' else "#{file.width}x#{file.height}"
      fileInfo = "<span class=fileText id=fT#{postID}#{if file.isSpoiler then " title='#{filename}'" else ''}>File: <a href='#{file.url}' target=_blank>#{file.timestamp}</a>" +
        "-(#{fileSize}, #{fileDims}#{
          if file.isSpoiler
            ''
          else
            ", <span title='#{filename}'>#{shortFilename}</span>"
        }" + ")</span>"

      fileHTML = "<div id=f#{postID} class=file><div class=fileInfo>#{fileInfo}</div>#{imgSrc}</div>"
    else
      fileHTML = ''

    tripcode =
      if tripcode
        " <span class=postertrip>#{tripcode}</span>"
      else
        ''

    sticky =
      if isSticky
        ' <img src=//static.4chan.org/image/sticky.gif alt=Sticky title=Sticky style="height:16px;width:16px">'
      else
        ''
    closed =
      if isClosed
        ' <img src=//static.4chan.org/image/closed.gif alt=Closed title=Closed style="height:16px;width:16px">'
      else
        ''

    container = $.el 'div',
      id: "pc#{postID}"
      className: "postContainer #{if isOP then 'op' else 'reply'}Container"
      innerHTML: \
      (if isOP then '' else "<div class=sideArrows id=sa#{postID}>&gt;&gt;</div>") +
      "<div id=p#{postID} class='post #{if isOP then 'op' else 'reply'}#{
        if capcode is 'admin_highlight'
          ' highlightPost'
        else
          ''
        }'>" +

        "<div class='postInfoM mobile' id=pim#{postID}>" +
          "<span class='nameBlock#{capcodeClass}'>" +
              "<span class=name>#{name or ''}</span>" + tripcode +
            capcodeStart + capcode + userID + flag + sticky + closed +
            "<br>#{subject}" +
          "</span><span class='dateTime postNum' data-utc=#{dateUTC}>#{date}" +
          '<br><em>' +
            "<a href=#{"/#{board}/res/#{threadID}#p#{postID}"}>No.</a>" +
            "<a href='#{
              if g.REPLY and g.THREAD_ID is threadID
                "javascript:quote(#{postID})"
              else
                "/#{board}/res/#{threadID}#q#{postID}"
              }'>#{postID}</a>" +
          '</em></span>' +
        '</div>' +

        (if isOP then fileHTML else '') +

        "<div class='postInfo desktop' id=pi#{postID}>" +
          "<input type=checkbox name=#{postID} value=delete> " +
          "#{subject} " +
          "<span class='nameBlock#{capcodeClass}'>" +
            emailStart +
              "<span class=name>#{name or ''}</span>" + tripcode +
            capcodeStart + emailEnd + capcode + userID + flag + sticky + closed +
          ' </span> ' +
          "<span class=dateTime data-utc=#{dateUTC}>#{date}</span> " +
          "<span class='postNum desktop'>" +
            "<a href=#{"/#{board}/res/#{threadID}#p#{postID}"} title='Highlight this post'>No.</a>" +
            "<a href='#{
              if g.REPLY and +g.THREAD_ID is threadID
                "javascript:quote(#{postID})"
              else
                "/#{board}/res/#{threadID}#q#{postID}"
              }' title='Quote this post'>#{postID}</a>" +
          '</span>' +
        '</div>' +

        (if isOP then '' else fileHTML) +

        "<blockquote class=postMessage id=m#{postID}>#{comment or ''}</blockquote> " +

      '</div>'

    for quote in $$ '.quotelink', container
      href = quote.getAttribute 'href'
      continue if href[0] is '/' # Cross-board quote, or board link
      quote.href = "/#{board}/res/#{href}" # Fix pathnames

    container
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
      # Stop at 'Admin/Mod/Dev Replies:' on /q/
      break if quote.parentNode.parentNode.className is 'capcodeReplies'
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
      seconds =
        if g.BOARD is 'q'
          600
        else
          30
      DeleteLink.cooldown.count e.detail.postID, seconds, seconds
    count: (postID, seconds, length) ->
      return unless 0 <= seconds <= length
      setTimeout DeleteLink.cooldown.count, 1000, postID, seconds-1, length
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
    return unless $.el('a').download?
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
    div = $.el 'div',
      textContent: 'Archive'

    entry =
      el: div
      open: -> true
      children: []

    for type in [
      ['Post',             'apost'] 
      ['Name',             'name']
      ['Tripcode',         'tripcode']
      ['E-mail',           'email']
      ['Subject',          'subject']
     #['Comment',          'comment']
      ['Filename',         'filename']
     #['Image MD5',        'md5']
    ]
      # Add a sub entry for each filter type.
      entry.children.push ArchiveLink.createSubEntry type[0], type[1]

    Menu.addEntry entry

  createSubEntry: (text, type) ->
    el = $.el 'a',
      textContent: text
      target: '_blank'
    # Define the onclick var outside of open's scope to $.off it properly.
    onclick = null

    open = (post) ->
      value = Filter[type] post
      unless type is 'apost'
        value = Filter[type] post
      # We want to parse the exact same stuff as Filter does already + maybe a few extras.
      return false if value is false
      $.off el, 'click', onclick
      onclick = ->
        path = $('a[title="Highlight this post"]', post.el).pathname.split '/'
        thread = Redirect.thread path[1], path[3], post.ID
        if type is 'apost'
          href = Redirect.archiver path[1], value, type
          if (href = thread) is "//boards.4chan.org/#{path[1]}/"
            return false
        else 
          unless thread is "//boards.4chan.org/#{path[1]}/"
            href = Redirect.archiver path[1], value, type
          else return false
        el.href = href

      $.on el, 'click', onclick
      true

    return el: el, open: open

ThreadHideLink =
  init: ->
    # If ThreadHiding hasn't been initialized, we have to fake it.
    unless Conf['Thread Hiding']
      $.ready @iterate

    a = $.el 'a',
      className: 'thread_hide_link'
      href: 'javascript:;'
      textContent: 'Hide / Restore Thread'
    $.on a, 'click', ->
      menu   = $.id 'menu'
      thread = $.id "t#{menu.dataset.id}"
      ThreadHiding.toggle thread
    Menu.addEntry
      el: a
      open: (post) ->
        if post.el.classList.contains 'op' then true else false

  iterate: ->
    ThreadHiding.hiddenThreads = $.get "hiddenThreads/#{g.BOARD}/", {}
    for thread in $$ '.thread'
      if thread.id[1..] of ThreadHiding.hiddenThreads
        ThreadHiding.hide thread


ReplyHideLink =
  init: ->
    # Fake reply hiding functionality if it is disabled.
    unless Conf['Reply Hiding']
      Main.callbacks.push @node

    a = $.el 'a',
      className: 'reply_hide_link'
      href: 'javascript:;'
      textContent: 'Hide / Restore Post'

    $.on a, 'click', ->
      menu   = $.id 'menu'
      id     = menu.dataset.id
      root   = $.id "pc#{id}"
      button = root.firstChild
      ReplyHiding.toggle button, root, id

    Menu.addEntry
      el: a
      open: (post) ->
        if post.isInlined or post.el.classList.contains 'op' then false else true

  node: (post) ->
    return if post.isInlined or post.ID is post.threadID

    if post.ID of g.hiddenReplies
      ReplyHiding.hide post.root

ThreadStats =
  init: ->
    ThreadStats.postcount = $.el 'span'
      id:          'postcount'
      textContent: '0'
    ThreadStats.imagecount = $.el 'span'
      id:          'imagecount'
      textContent: '0'
    if Conf['Style'] and Conf['Thread Updater'] and move = Updater.count.parentElement
      container = $.el 'span'
      $.add container, $.tn('[')
      $.add container, ThreadStats.postcount
      $.add container, $.tn(' / ')
      $.add container, ThreadStats.imagecount
      $.add container, $.tn('] ')
      $.prepend move, container
    else
      dialog = UI.dialog 'stats', 'bottom: 0; left: 0;', '<div class=move></div>'
      dialog.className = 'dialog'
      $.add $(".move", dialog), ThreadStats.postcount
      $.add $(".move", dialog), $.tn(" / ")
      $.add $(".move", dialog), ThreadStats.imagecount
      $.add d.body, dialog
    @posts = @images = 0
    @imgLimit =
      switch g.BOARD
        when 'a', 'b', 'v', 'co', 'mlp'
          251
        when 'vg'
          376
        else
          151
    Main.callbacks.push @node
  node: (post) ->
    return if post.isInlined
    ThreadStats.postcount.textContent = ++ThreadStats.posts
    return unless post.img
    ThreadStats.imagecount.textContent = ++ThreadStats.images
    if ThreadStats.images > ThreadStats.imgLimit
      $.addClass ThreadStats.imagecount, 'warning'

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
      when 'a', 'm', 'q', 'sp', 'tg', 'vg', 'wsg'
        "//archive.foolz.us/#{board}/full_image/#{filename}"
      when 'u'
        "//nsfw.foolz.us/#{board}/full_image/#{filename}"
      when 'ck', 'lit'
        "//fuuka.warosu.org/#{board}/full_image/#{filename}"
      when 'cgl', 'g', 'w'
        "//archive.rebeccablacktech.com/#{board}/full_image/#{filename}"
      when 'an', 'k', 'toy', 'x'
        "http://archive.heinessen.com/#{board}/full_image/#{filename}"
      # when 'e'
      #   "https://www.cliché.net/4chan/cgi-board.pl/#{board}/full_image/#{filename}"
  post: (board, postID) ->
    switch board
      when 'a', 'co', 'jp', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'wsg', 'dev', 'foolz'
        "//archive.foolz.us/_/api/chan/post/?board=#{board}&num=#{postID}"
      when 'u', 'kuku'
        "//nsfw.foolz.us/_/api/chan/post/?board=#{board}&num=#{postID}"
  thread: (board, threadID, postID) ->
    # keep the number only if the location.hash was sent f.e.
    postID = postID.match(/\d+/)[0] if postID
    path   =
      if threadID
        "#{board}/thread/#{threadID}"
      else
        "#{board}/post/#{postID}"
    switch board
      when 'a', 'co', 'm', 'q', 'sp', 'tg', 'tv', 'v', 'vg', 'wsg', 'dev', 'foolz'
        url = "//archive.foolz.us/#{path}/"
        if threadID and postID
          url += "##{postID}"
      when 'u', 'kuku'
        url = "//nsfw.foolz.us/#{path}/"
        if threadID and postID
          url += "##{postID}"
      when 'ck', 'jp', 'lit'
        url = "//fuuka.warosu.org/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'diy', 'sci'
        url = "//archive.installgentoo.net/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'cgl', 'g', 'mu', 'soc', 'w'
        url = "//archive.rebeccablacktech.com/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'an', 'fit', 'k', 'mlp', 'r9k', 'toy', 'x'
        url = "http://archive.heinessen.com/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      when 'e'
        url = "https://www.cliché.net/4chan/cgi-board.pl/#{path}"
        if threadID and postID
          url += "#p#{postID}"
      else
        if threadID
          url = "//boards.4chan.org/#{board}/"
    url or null
  archiver: (board, value, type) ->
    switch board
      when 'a', 'm', 'q', 'sp', 'tg', 'vg', 'wsg'
        unless type is 'name'
          "//archive.foolz.us/#{board}/search/#{type}/#{value}"
        else "//archive.foolz.us/#{board}/search/username/#{value}"
      when 'u'
        unless type is 'name'
          "//nsfw.foolz.us/#{board}/search/#{type}/#{value}"
        else "//nsfw.foolz.us/#{board}/search/username/#{value}"
      when 'cgl', 'g', 'w'
         "//archive.rebeccablacktech.com/#{board}/?task=search2&search_#{type}=#{value}"
      when 'an', 'k', 'toy', 'x'
        "http://archive.heinessen.com/#{board}/?task=search&ghost=&search_#{type}=#{value}"

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
    src = @src.split '/'
    unless src[2] is 'images.4chan.org' and url = Redirect.image src[3], src[5]
      return if g.dead
      url = "//images.4chan.org/#{src[3]}/src/#{src[5]}"
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

Prefetch =
  init: ->
    @dialog()
  dialog: ->
    controls = $.el 'label',
      id: 'prefetch'
      innerHTML:
        "<input type=checkbox>Prefetch Images"
    input = $ 'input', controls
    $.on input, 'change', Prefetch.change

    first = $.id('delform').firstElementChild
    if first.id is 'imgControls'
      $.after first, controls
    else
      $.before first, controls

  change: ->
    $.off @, 'change', Prefetch.change
    for thumb in $$ 'a.fileThumb'
      img = $.el 'img',
        src: thumb.href
    Main.callbacks.push Prefetch.node

  node: (post) ->
    {img} = post
    return unless img
    $.el 'img',
      src: img.parentNode.href

PngFix =
  init: ->
    Main.callbacks.push @node
  node: (post) ->
    {img} = post
    return if post.el.hidden or not img
    src = img.parentNode.href
    if /png$/.test(src) and !/spoiler/.test img.src
      png = $.el 'img'
      $.on png, 'load', ->
        img.src = src
      png.src = src

ImageExpand =
  init: ->
    Main.callbacks.push @node
    @dialog()

  node: (post) ->
    return unless post.img
    a = post.img.parentNode
    $.on a, 'click', ImageExpand.cb.toggle
    if Conf['Don\'t Expand Spoilers'] and !Conf['Reveal Spoilers']
      return if $ '.fileThumb.imgspoiler'
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
    $.rmClass thumb.parentNode.parentNode.parentNode.parentNode, 'image_expanded'

  expand: (thumb, url) ->
    # Do not expand images of hidden/filtered replies, or already expanded pictures.
    return if $.x 'ancestor-or-self::*[@hidden]', thumb
    thumb.hidden = true
    $.addClass thumb.parentNode.parentNode.parentNode.parentNode, 'image_expanded'
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
    src = @src.split '/'
    unless src[2] is 'images.4chan.org' and url = Redirect.image src[3], src[5]
      return if g.dead
      url = "//images.4chan.org/#{src[3]}/src/#{src[5]}"
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
        "<div id=imgContainer><select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label>Expand Images<input type=checkbox id=imageExpand></label></div>"
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