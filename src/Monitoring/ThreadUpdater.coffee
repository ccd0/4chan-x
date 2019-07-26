ThreadUpdater =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Thread Updater']
    @enabled = true

    # Chromium won't play audio created in an inactive tab until the tab has been focused, so set it up now.
    # XXX Sometimes the loading stalls in Firefox, esp. when opening in private browsing window followed by normal window.
    # Don't let it keep the loading icon on indefinitely.
    @audio = $.el 'audio'
    @audio.src = @beep unless $.engine is 'gecko'

    if Conf['Updater and Stats in Header']
      @dialog = sc = $.el 'span',
        id:        'updater'
      $.extend sc, `<%= html('<span id="update-status" class="empty"></span><span id="update-timer" class="empty" title="Update now"></span>') %>`
      Header.addShortcut 'updater', sc, 100
    else
      @dialog = sc = UI.dialog 'updater',
        `<%= html('<div class="move"></div><span id="update-status" class="empty"></span><span id="update-timer" class="empty" title="Update now"></span>') %>`
      $.addClass doc, 'float'
      $.ready ->
        $.add d.body, sc

    @checkPostCount = 0

    @timer  = $ '#update-timer', sc
    @status = $ '#update-status', sc

    $.on @timer,  'click', @update
    $.on @status, 'click', @update

    updateLink = $.el 'span',
      className: 'brackets-wrap updatelink'
    $.extend updateLink, `<%= html('<a href="javascript:;">Update</a>') %>`
    Main.ready ->
      ($.add navLinksBot, [$.tn(' '), updateLink] if (navLinksBot = $ '.navLinksBot'))
    $.on updateLink.firstElementChild, 'click', @update

    subEntries = []
    for name, conf of Config.updater.checkbox
      el = UI.checkbox name, name
      el.title = conf[1]
      input = el.firstElementChild
      $.on input, 'change', $.cb.checked
      if input.name is 'Scroll BG'
        $.on input, 'change', @cb.scrollBG
        @cb.scrollBG()
      else if input.name is 'Auto Update'
        $.on input, 'change', @setInterval
      subEntries.push el: el

    @settings = $.el 'span',
      `<%= html('<a href="javascript:;">Interval</a>') %>`

    $.on @settings, 'click', @intervalShortcut

    subEntries.push el: @settings

    Header.menu.addEntry @entry =
      el: $.el 'span',
        textContent: 'Updater'
      order: 110
      subEntries: subEntries

    Callbacks.Thread.push
      name: 'Thread Updater'
      cb:   @node
  
  node: ->
    ThreadUpdater.thread       = @
    ThreadUpdater.root         = @nodes.root
    ThreadUpdater.outdateCount = 0

    # We must keep track of our own list of live posts/files
    # to provide an accurate deletedPosts/deletedFiles on update
    # as posts may be `kill`ed elsewhere.
    ThreadUpdater.postIDs = []
    ThreadUpdater.fileIDs = []
    @posts.forEach (post) ->
      ThreadUpdater.postIDs.push post.ID
      (ThreadUpdater.fileIDs.push post.ID if post.file)

    ThreadUpdater.cb.interval.call $.el 'input', value: Conf['Interval']

    $.on d,      'QRPostSuccessful', ThreadUpdater.cb.checkpost
    $.on d,      'visibilitychange', ThreadUpdater.cb.visibility

    ThreadUpdater.setInterval()

  ###
  http://freesound.org/people/pierrecartoons1979/sounds/90112/
  cc-by-nc-3.0
  ###
  beep: 'data:audio/wav;base64,<%= readBase64("beep.wav") %>'

  playBeep: ->
    {audio} = ThreadUpdater
    audio.src or= ThreadUpdater.beep
    if audio.paused
      audio.play()
    else
      $.one audio, 'ended', ThreadUpdater.playBeep

  cb:
    checkpost: (e) ->
      return if e.detail.threadID isnt ThreadUpdater.thread.ID
      ThreadUpdater.postID = e.detail.postID
      ThreadUpdater.checkPostCount = 0
      ThreadUpdater.outdateCount = 0
      ThreadUpdater.setInterval()

    visibility: ->
      return if d.hidden
      # Reset the counter when we focus this tab.
      ThreadUpdater.outdateCount = 0
      if ThreadUpdater.seconds > ThreadUpdater.interval
        ThreadUpdater.setInterval()

    scrollBG: ->
      ThreadUpdater.scrollBG = if Conf['Scroll BG']
        -> true
      else
        -> not d.hidden

    interval: (e) ->
      val = parseInt @value, 10
      if val < 1 then val = 1
      ThreadUpdater.interval = @value = val
      $.cb.value.call @ if e

    load: ->
      return if @ isnt ThreadUpdater.req # aborted
      switch @status
        when 200
          ThreadUpdater.parse @
          if ThreadUpdater.thread.isArchived
            ThreadUpdater.kill()
          else
            ThreadUpdater.setInterval()
        when 404
          # XXX workaround for 4chan sending false 404s
          $.ajax g.SITE.urls.catalogJSON({boardID: ThreadUpdater.thread.board.ID}), onloadend: ->
            if @status is 200
              confirmed = true
              for page in @response
                for thread in page.threads
                  if thread.no is ThreadUpdater.thread.ID
                    confirmed = false
                    break
            else
              confirmed = false
            if confirmed
              ThreadUpdater.kill()
            else
              ThreadUpdater.error @
        else
          ThreadUpdater.error @

  kill: ->
    ThreadUpdater.thread.kill()
    ThreadUpdater.setInterval()
    $.event 'ThreadUpdate',
      404: true
      threadID: ThreadUpdater.thread.fullID

  error: (req) ->
    if req.status is 304
      ThreadUpdater.set 'status', ''
    ThreadUpdater.setInterval()
    unless req.status
      ThreadUpdater.set 'status', 'Connection Error', 'warning'
    else if req.status isnt 304
      ThreadUpdater.set 'status', "#{req.statusText} (#{req.status})", 'warning'

  setInterval: ->
    clearTimeout ThreadUpdater.timeoutID

    if ThreadUpdater.thread.isDead
      ThreadUpdater.set 'status', (if ThreadUpdater.thread.isArchived then 'Archived' else '404'), 'warning'
      ThreadUpdater.set 'timer', ''
      return

    # Fetching your own posts after posting
    if ThreadUpdater.postID and ThreadUpdater.checkPostCount < 5
      ThreadUpdater.set 'timer', '...', 'loading'
      ThreadUpdater.timeoutID = setTimeout ThreadUpdater.update, ++ThreadUpdater.checkPostCount * $.SECOND
      return

    unless Conf['Auto Update']
      ThreadUpdater.set 'timer', 'Update'
      return

    {interval} = ThreadUpdater
    if Conf['Optional Increase']
      # Lower the max refresh rate limit on visible tabs.
      limit = if d.hidden then 10 else 5
      j     = Math.min ThreadUpdater.outdateCount, limit

      # 1 second to 100, 30 to 300.
      cur = (Math.floor(interval * 0.1) or 1) * j * j
      ThreadUpdater.seconds = $.minmax cur, interval, 300
    else
      ThreadUpdater.seconds = interval

    ThreadUpdater.timeout()

  intervalShortcut: ->
    Settings.open 'Advanced'
    settings = $.id 'fourchanx-settings'
    $('input[name=Interval]', settings).focus()

  set: (name, text, klass) ->
    el = ThreadUpdater[name]
    if node = el.firstChild
      # Prevent the creation of a new DOM Node
      # by setting the text node's data.
      node.data = text
    else
      el.textContent = text
    el.className = klass ? (if text is '' then 'empty' else '')

  timeout: ->
    if ThreadUpdater.seconds
      ThreadUpdater.set 'timer', ThreadUpdater.seconds
      ThreadUpdater.timeoutID = setTimeout ThreadUpdater.timeout, 1000
    else
      ThreadUpdater.outdateCount++
      ThreadUpdater.update()
    ThreadUpdater.seconds--

  update: ->
    clearTimeout ThreadUpdater.timeoutID
    ThreadUpdater.set 'timer', '...', 'loading'
    if (oldReq = ThreadUpdater.req)
      delete ThreadUpdater.req
      oldReq.abort()
    ThreadUpdater.req = $.whenModified(
      g.SITE.urls.threadJSON({boardID: ThreadUpdater.thread.board.ID, threadID: ThreadUpdater.thread.ID}),
      'ThreadUpdater',
      ThreadUpdater.cb.load,
      {timeout: $.MINUTE}
    )

  updateThreadStatus: (type, status) ->
    return if not (hasChanged = ThreadUpdater.thread["is#{type}"] isnt status)
    ThreadUpdater.thread.setStatus type, status
    return if type is 'Closed' and ThreadUpdater.thread.isArchived
    change = if type is 'Sticky'
      if status
        'now a sticky'
      else
        'not a sticky anymore'
    else
      if status
        'now closed'
      else
        'not closed anymore'
    new Notice 'info', "The thread is #{change}.", 30

  parse: (req) ->
    postObjects = req.response.posts
    OP = postObjects[0]
    {thread} = ThreadUpdater
    {board} = thread
    [..., lastPost] = ThreadUpdater.postIDs

    # XXX Reject updates that falsely delete the last post.
    return if postObjects[postObjects.length-1].no < lastPost and
      new Date(req.getResponseHeader('Last-Modified')) - thread.posts[lastPost].info.date < 30 * $.SECOND

    g.SITE.Build.spoilerRange[board] = OP.custom_spoiler
    thread.setStatus 'Archived', !!OP.archived
    ThreadUpdater.updateThreadStatus 'Sticky', !!OP.sticky
    ThreadUpdater.updateThreadStatus 'Closed', !!OP.closed
    thread.postLimit = !!OP.bumplimit
    thread.fileLimit = !!OP.imagelimit
    thread.ipCount   = OP.unique_ips if OP.unique_ips?

    posts    = [] # new post objects
    index    = [] # existing posts
    files    = [] # existing files
    newPosts = [] # new post fullID list for API

    # Build the index, create posts.
    for postObject in postObjects
      ID = postObject.no
      index.push ID
      files.push ID if postObject.fsize

      # Insert new posts, not older ones.
      continue if ID <= lastPost

      # XXX Resurrect wrongly deleted posts.
      if (post = thread.posts[ID]) and not post.isFetchedQuote
        post.resurrect()
        continue

      newPosts.push "#{board}.#{ID}"
      node = g.SITE.Build.postFromObject postObject, board.ID
      posts.push new Post node, thread, board
      # Fetching your own posts after posting
      delete ThreadUpdater.postID if ThreadUpdater.postID is ID

    # Check for deleted posts.
    deletedPosts = []
    for ID in ThreadUpdater.postIDs when ID not in index
      thread.posts[ID].kill()
      deletedPosts.push "#{board}.#{ID}"
    ThreadUpdater.postIDs = index

    # Check for deleted files.
    deletedFiles = []
    for ID in ThreadUpdater.fileIDs when not (ID in files or "#{board}.#{ID}" in deletedPosts)
      thread.posts[ID].kill true
      deletedFiles.push "#{board}.#{ID}"
    ThreadUpdater.fileIDs = files

    unless posts.length
      ThreadUpdater.set 'status', ''
    else
      ThreadUpdater.set 'status', "+#{posts.length}", 'new'
      ThreadUpdater.outdateCount = 0

      unreadCount   = Unread.posts?.size
      unreadQYCount = Unread.postsQuotingYou?.size

      Main.callbackNodes 'Post', posts

      if d.hidden or not d.hasFocus()
        if Conf['Beep Quoting You'] and Unread.postsQuotingYou?.size > unreadQYCount
          ThreadUpdater.playBeep()
          ThreadUpdater.playBeep() if Conf['Beep']
        else if Conf['Beep'] and Unread.posts?.size > 0 and unreadCount is 0
          ThreadUpdater.playBeep()

      scroll = Conf['Auto Scroll'] and ThreadUpdater.scrollBG() and
        ThreadUpdater.root.getBoundingClientRect().bottom - doc.clientHeight < 25

      firstPost = null
      for post in posts
        unless QuoteThreading.insert post
          firstPost or= post.nodes.root
          $.add ThreadUpdater.root, post.nodes.root
      $.event 'PostsInserted', null, ThreadUpdater.root

      if scroll
        if Conf['Bottom Scroll']
          window.scrollTo 0, d.body.clientHeight
        else
          Header.scrollTo firstPost if firstPost

    # Update IP count in original post form.
    if OP.unique_ips? and (ipCountEl = $.id('unique-ips'))
      ipCountEl.textContent = OP.unique_ips
      ipCountEl.previousSibling.textContent = ipCountEl.previousSibling.textContent.replace(/\b(?:is|are)\b/, if OP.unique_ips is 1 then 'is' else 'are')
      ipCountEl.nextSibling.textContent = ipCountEl.nextSibling.textContent.replace(/\bposters?\b/, if OP.unique_ips is 1 then 'poster' else 'posters')

    $.event 'ThreadUpdate',
      404: false
      threadID: thread.fullID
      newPosts: newPosts
      deletedPosts: deletedPosts
      deletedFiles: deletedFiles
      postCount: OP.replies + 1
      fileCount: OP.images + !!OP.fsize
      ipCount: OP.unique_ips
