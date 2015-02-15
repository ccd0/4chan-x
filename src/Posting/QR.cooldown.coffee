QR.cooldown =
  seconds: 0

  init: ->
    return unless Conf['Cooldown']

    # Read cooldown times
    QR.cooldown.delays = if m = Get.scriptData().match /\bcooldowns *= *({[^}]+})/
      JSON.parse m[1]
    else
      {thread: 0, reply: 0, image: 0, reply_intra: 0, image_intra: 0}

    # The longest reply cooldown, for use in pruning old reply data
    QR.cooldown.maxDelay = 0
    for type, delay of QR.cooldown.delays when type isnt 'thread'
      QR.cooldown.maxDelay = Math.max QR.cooldown.maxDelay, delay

    # There is a 300 second inter-board thread cooldown.
    QR.cooldown.delays['thread_global'] = 300

    # Retrieve recent posts and delays.
    keys = QR.cooldown.keys =
      local:  "cooldown.#{g.BOARD}"
      global: 'cooldown.global'
    items = {}
    items[key] = {} for scope, key of keys
    $.get items, (items) ->
      QR.cooldown[scope] = items[key] for scope, key of keys
      QR.cooldown.start()
    $.sync key, QR.cooldown.sync scope for scope, key of keys

  start: ->
    return if QR.cooldown.isCounting or Object.keys(QR.cooldown.local).length + Object.keys(QR.cooldown.global).length is 0
    QR.cooldown.isCounting = true
    QR.cooldown.count()

  sync: (scope) -> (cooldowns) ->
    QR.cooldown[scope] = cooldowns or {}
    QR.cooldown.start()

  add: (start, threadID, postID) ->
    return unless Conf['Cooldown']
    boardID = g.BOARD.ID
    QR.cooldown.set 'local', start, {threadID, postID}
    QR.cooldown.set 'global', start, {boardID, threadID, postID} if threadID is postID
    QR.cooldown.start()

  addDelay: (post, delay) ->
    return unless Conf['Cooldown']
    cooldown = QR.cooldown.categorize post
    cooldown.delay = delay
    QR.cooldown.set 'local', Date.now(), cooldown
    QR.cooldown.start()

  delete: (post) ->
    return unless Conf['Cooldown'] and g.BOARD.ID is post.board.ID
    $.forceSync QR.cooldown.keys.local
    for id, cooldown of QR.cooldown.local
      if !cooldown.delay? and cooldown.threadID is post.thread.ID and cooldown.postID is post.ID
        delete QR.cooldown.local[id]
    QR.cooldown.save 'local'

  categorize: (post) ->
    if post.thread is 'new'
      type: 'thread'
    else
      type: if !!post.file then 'image' else 'reply'
      threadID: +post.thread

  set: (scope, id, value) ->
    $.forceSync QR.cooldown.keys[scope]
    QR.cooldown[scope][id] = value
    $.set QR.cooldown.keys[scope], QR.cooldown[scope]

  save: (scope) ->
    if Object.keys(QR.cooldown[scope]).length
      $.set QR.cooldown.keys[scope], QR.cooldown[scope]
    else
      $.delete QR.cooldown.keys[scope]

  count: ->
    now = Date.now()
    {type, threadID} = QR.cooldown.categorize QR.posts[0]
    seconds = 0

    for scope, key of QR.cooldown.keys
      $.forceSync key
      save = false

      for start, cooldown of QR.cooldown[scope]
        start = +start
        elapsed = (now - start) // $.SECOND
        if elapsed < 0 # clock changed since then?
          delete QR.cooldown[scope][start]
          save = true
          continue

        # Explicit delays from error messages
        if cooldown.delay?
          if cooldown.delay <= elapsed
            delete QR.cooldown[scope][start]
            save = true
          else if cooldown.type is type and cooldown.threadID is threadID
            # Delays only apply to the given post type and thread.
            seconds = Math.max seconds, cooldown.delay - elapsed
          continue

        # Clean up expired cooldowns
        maxDelay = if cooldown.threadID isnt cooldown.postID
          QR.cooldown.maxDelay
        else
          QR.cooldown.delays[if scope is 'global' then 'thread_global' else 'thread']
        if maxDelay <= elapsed
          delete QR.cooldown[scope][start]
          save = true
          continue

        if (type is 'thread') is (cooldown.threadID is cooldown.postID) and cooldown.boardID isnt g.BOARD.ID
          # Only cooldowns relevant to this post can set the seconds variable:
          #   reply cooldown with a reply, thread cooldown with a thread.
          # Inter-board thread cooldowns only apply on boards other than the one they were posted on.
          suffix = if scope is 'global'
            '_global'
          else if type isnt 'thread' and threadID is cooldown.threadID
            '_intra'
          else
            ''
          seconds = Math.max seconds, QR.cooldown.delays[type + suffix] - elapsed

      QR.cooldown.save scope if save

    if Object.keys(QR.cooldown.local).length + Object.keys(QR.cooldown.global).length
      clearTimeout QR.cooldown.timeout
      QR.cooldown.timeout = setTimeout QR.cooldown.count, $.SECOND
    else
      delete QR.cooldown.isCounting

    # Update the status when we change posting type.
    # Don't get stuck at some random number.
    # Don't interfere with progress status updates.
    update = seconds isnt QR.cooldown.seconds
    QR.cooldown.seconds = seconds
    QR.status() if update
    QR.submit() if seconds is 0 and QR.cooldown.auto and !QR.req
