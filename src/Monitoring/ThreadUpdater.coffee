ThreadUpdater =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Thread Updater']

    if Conf['Updater and Stats in Header']
      @dialog = sc = $.el 'span',
        id:        'updater'
      $.extend sc, <%= html('<span id="update-status" class="empty"></span><span id="update-timer" class="empty" title="Update now"></span>') %>
      $.ready ->
        Header.addShortcut sc
    else
      @dialog = sc = UI.dialog 'updater', 'bottom: 0px; left: 0px;',
        <%= html('<div class="move"></div><span id="update-status"></span><span id="update-timer" title="Update now"></span>') %>
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
    $.extend updateLink, <%= html('<a href="javascript:;">Update</a>') %>
    Main.ready ->
      $.add $('.navLinksBot'), [$.tn(' '), updateLink]
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
      <%= html('<a href="javascript:;">Interval</a>') %>

    $.on @settings, 'click', @intervalShortcut

    subEntries.push el: @settings

    Header.menu.addEntry @entry =
      el: $.el 'span',
        textContent: 'Updater'
      order: 110
      subEntries: subEntries

    Thread.callbacks.push
      name: 'Thread Updater'
      cb:   @node
  
  node: ->
    ThreadUpdater.thread       = @
    ThreadUpdater.root         = @OP.nodes.root.parentNode
    ThreadUpdater.lastPost     = +@posts.keys[@posts.keys.length - 1]
    ThreadUpdater.outdateCount = 0

    # We must keep track of our own list of live posts/files
    # to provide an accurate deletedPosts/deletedFiles on update
    # as posts may be `kill`ed elsewhere.
    ThreadUpdater.postIDs = []
    ThreadUpdater.fileIDs = []
    @posts.forEach (post) ->
      ThreadUpdater.postIDs.push post.ID
      ThreadUpdater.fileIDs.push post.ID if post.file and not post.file.isDead

    ThreadUpdater.cb.interval.call $.el 'input', value: Conf['Interval']

    $.on window, 'online offline',   ThreadUpdater.cb.online
    $.on d,      'QRPostSuccessful', ThreadUpdater.cb.checkpost
    $.on d,      'visibilitychange', ThreadUpdater.cb.visibility

    ThreadUpdater.setInterval()

  ###
  http://freesound.org/people/pierrecartoons1979/sounds/90112/
  cc-by-nc-3.0
  ###
  beep: 'data:audio/wav;base64,<%= grunt.file.read("src/General/audio/beep.wav", {encoding: "base64"}) %>'

  cb:
    online: ->
      return if ThreadUpdater.thread.isDead

      if navigator.onLine
        ThreadUpdater.set 'status', ''
      else
        ThreadUpdater.set 'status', 'Offline', 'warning'

      if Conf['Auto Update'] and not Conf['Ignore Offline Status']
        ThreadUpdater.outdateCount = 0
        ThreadUpdater.setInterval()

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
      {req} = ThreadUpdater
      switch req.status
        when 200
          ThreadUpdater.parse req
          if ThreadUpdater.thread.isArchived
            ThreadUpdater.kill()
          else
            ThreadUpdater.setInterval()
        when 404
          # XXX workaround for 4chan sending false 404s
          $.ajax "//a.4cdn.org/#{ThreadUpdater.thread.board}/catalog.json", onloadend: ->
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
              ThreadUpdater.error req
        else
          ThreadUpdater.error req

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
      ThreadUpdater.set 'status', 'Connection Failed', 'warning'
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

    unless navigator.onLine
      ThreadUpdater.set 'status', 'Offline', 'warning'
      unless Conf['Ignore Offline Status']
        ThreadUpdater.set 'timer', ''
        return

    {interval} = ThreadUpdater
    if Conf['Optional Increase']
      # Lower the max refresh rate limit on visible tabs.
      limit = if d.hidden then 7 else 10
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
    ThreadUpdater.req?.abort()
    ThreadUpdater.req = $.ajax "//a.4cdn.org/#{ThreadUpdater.thread.board}/thread/#{ThreadUpdater.thread}.json",
      onloadend: ThreadUpdater.cb.load
      timeout:   $.MINUTE
    ,
      whenModified: true

  updateThreadStatus: (type, status) ->
    return unless hasChanged = ThreadUpdater.thread["is#{type}"] isnt status
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
    # XXX 4chan sometimes sends outdated JSON which would result in false-positive dead posts.
    lastModified = new Date req.getResponseHeader('Last-Modified')
    return if ThreadUpdater.lastModified and lastModified < ThreadUpdater.lastModified
    ThreadUpdater.lastModified = lastModified

    postObjects = req.response.posts
    OP = postObjects[0]
    Build.spoilerRange[ThreadUpdater.thread.board] = OP.custom_spoiler

    # XXX Some threads such as /g/'s sticky https://a.4cdn.org/g/thread/39894014.json still use a string as the archived property.
    ThreadUpdater.thread.setStatus 'Archived', !!+OP.archived
    ThreadUpdater.updateThreadStatus 'Sticky', !!OP.sticky
    ThreadUpdater.updateThreadStatus 'Closed', !!OP.closed
    ThreadUpdater.thread.postLimit = !!OP.bumplimit
    ThreadUpdater.thread.fileLimit = !!OP.imagelimit
    ThreadUpdater.thread.ipCount   = OP.unique_ips if OP.unique_ips?

    posts = [] # post objects
    index = [] # existing posts
    files = [] # existing files
    count = 0  # new posts count
    # Build the index, create posts.
    for postObject in postObjects
      num = postObject.no
      index.push num
      files.push num if postObject.fsize
      continue if num <= ThreadUpdater.lastPost
      # Insert new posts, not older ones.
      count++
      node = Build.postFromObject postObject, ThreadUpdater.thread.board.ID
      posts.push new Post node, ThreadUpdater.thread, ThreadUpdater.thread.board
      # Fetching your own posts after posting
      delete ThreadUpdater.postID if ThreadUpdater.postID is num

    # Check for deleted posts.
    deletedPosts = []
    for ID in ThreadUpdater.postIDs when ID not in index
      ThreadUpdater.thread.posts[ID].kill()
      deletedPosts.push ID
    ThreadUpdater.postIDs = index

    # Check for deleted files.
    deletedFiles = []
    for ID in ThreadUpdater.fileIDs when not (ID in files or ID in deletedPosts)
      ThreadUpdater.thread.posts[ID].kill true
      deletedFiles.push ID
    ThreadUpdater.fileIDs = files

    unless count
      ThreadUpdater.set 'status', ''
    else
      ThreadUpdater.set 'status', "+#{count}", 'new'
      ThreadUpdater.outdateCount = 0
      if Conf['Beep'] and d.hidden and Unread.posts and !Unread.posts.length
        unless ThreadUpdater.audio
          ThreadUpdater.audio = $.el 'audio', src: ThreadUpdater.beep
        ThreadUpdater.audio.play()

      ThreadUpdater.lastPost = posts[count - 1].ID
      Main.callbackNodes Post, posts

      scroll = Conf['Auto Scroll'] and ThreadUpdater.scrollBG() and
        ThreadUpdater.root.getBoundingClientRect().bottom - doc.clientHeight < 25

      for post in posts
        root = post.nodes.root
        unless QuoteThreading.insert post
          $.add ThreadUpdater.root, post.nodes.root
      $.event 'PostsInserted'

      if scroll
        if Conf['Bottom Scroll']
          window.scrollTo 0, d.body.clientHeight
        else
          Header.scrollTo root if root

    # Update IP count in original post form.
    if OP.unique_ips? and ipCountEl = $.id('unique-ips')
      ipCountEl.textContent = OP.unique_ips
      ipCountEl.previousSibling.textContent = ipCountEl.previousSibling.textContent.replace(/\b(?:is|are)\b/, if OP.unique_ips is 1 then 'is' else 'are')
      ipCountEl.nextSibling.textContent = ipCountEl.nextSibling.textContent.replace(/\bposters?\b/, if OP.unique_ips is 1 then 'poster' else 'posters')

    $.event 'ThreadUpdate',
      404: false
      threadID: ThreadUpdater.thread.fullID
      newPosts: (post.fullID for post in posts)
      deletedPosts: deletedPosts
      deletedFiles: deletedFiles
      postCount: OP.replies + 1
      fileCount: OP.images + (!!ThreadUpdater.thread.OP.file and !ThreadUpdater.thread.OP.file.isDead)
      ipCount: OP.unique_ips
