QR.cooldown =
  seconds: 0

  # Called from Main
  init: ->
    return unless Conf['Quick Reply']
    @data = Conf['cooldowns']
    $.sync 'cooldowns', @sync

  # Called from QR
  setup: ->
    # Read cooldown times
    QR.cooldown.delays = g.BOARD.cooldowns()

    # The longest reply cooldown, for use in pruning old reply data
    QR.cooldown.maxDelay = 0
    for type, delay of QR.cooldown.delays when type not in ['thread', 'thread_global']
      QR.cooldown.maxDelay = Math.max QR.cooldown.maxDelay, delay

    QR.cooldown.isSetup = true
    QR.cooldown.start()

  start: ->
    {data} = QR.cooldown
    return unless (
      Conf['Cooldown'] and
      QR.cooldown.isSetup and
      !QR.cooldown.isCounting and
      Object.keys(data[g.BOARD.ID] or {}).length + Object.keys(data.global or {}).length > 0
    )
    QR.cooldown.isCounting = true
    QR.cooldown.count()

  sync: (data) ->
    QR.cooldown.data = data or {}
    QR.cooldown.start()

  add: (threadID, postID) ->
    return unless Conf['Cooldown']
    start = Date.now()
    boardID = g.BOARD.ID
    QR.cooldown.set boardID, start, {threadID, postID}
    QR.cooldown.set 'global', start, {boardID, threadID, postID} if threadID is postID
    QR.cooldown.start()

  addDelay: (post, delay) ->
    return unless Conf['Cooldown']
    cooldown = QR.cooldown.categorize post
    cooldown.delay = delay
    QR.cooldown.set g.BOARD.ID, Date.now(), cooldown
    QR.cooldown.start()

  addMute: (delay) ->
    return unless Conf['Cooldown']
    QR.cooldown.set g.BOARD.ID, Date.now(), {type: 'mute', delay}
    QR.cooldown.start()

  delete: (post) ->
    return unless QR.cooldown.data
    $.forceSync 'cooldowns'
    cooldowns = (QR.cooldown.data[post.board.ID] or= {})
    for id, cooldown of cooldowns
      if !cooldown.delay? and cooldown.threadID is post.thread.ID and cooldown.postID is post.ID
        delete cooldowns[id]
    QR.cooldown.save [post.board.ID]

  secondsDeletion: (post) ->
    return 0 unless QR.cooldown.data and Conf['Cooldown']
    cooldowns = QR.cooldown.data[post.board.ID] or {}
    for start, cooldown of cooldowns
      if !cooldown.delay? and cooldown.threadID is post.thread.ID and cooldown.postID is post.ID
        seconds = QR.cooldown.delays.deletion - (Date.now() - start) // $.SECOND
        return Math.max seconds, 0
    0

  categorize: (post) ->
    if post.thread is 'new'
      type: 'thread'
    else
      type: if !!post.file then 'image' else 'reply'
      threadID: +post.thread

  set: (scope, id, value) ->
    $.forceSync 'cooldowns'
    cooldowns = (QR.cooldown.data[scope] or= {})
    cooldowns[id] = value
    $.set 'cooldowns', QR.cooldown.data

  save: (scopes) ->
    {data} = QR.cooldown
    for scope in scopes when scope of data and !Object.keys(data[scope]).length
      delete data[scope]
    $.set 'cooldowns', data

  count: ->
    $.forceSync 'cooldowns'
    save = []
    nCooldowns = 0
    now = Date.now()
    {type, threadID} = QR.cooldown.categorize QR.posts[0]
    seconds = 0

    if Conf['Cooldown'] then for scope in [g.BOARD.ID, 'global']
      cooldowns = (QR.cooldown.data[scope] or= {})

      for start, cooldown of cooldowns
        start = +start
        elapsed = (now - start) // $.SECOND
        if elapsed < 0 # clock changed since then?
          delete cooldowns[start]
          save.push scope
          continue

        # Explicit delays from error messages
        if cooldown.delay?
          if cooldown.delay <= elapsed
            delete cooldowns[start]
            save.push scope
          else if (cooldown.type is type and cooldown.threadID is threadID) or cooldown.type is 'mute'
            # Delays only apply to the given post type and thread.
            seconds = Math.max seconds, cooldown.delay - elapsed
          continue

        # Clean up expired cooldowns
        maxDelay = if cooldown.threadID isnt cooldown.postID
          QR.cooldown.maxDelay
        else
          QR.cooldown.delays[if scope is 'global' then 'thread_global' else 'thread']
        if QR.cooldown.customCooldown
          maxDelay = Math.max maxDelay, parseInt(Conf['customCooldown'], 10)
        if maxDelay <= elapsed
          delete cooldowns[start]
          save.push scope
          continue

        if (type is 'thread') is (cooldown.threadID is cooldown.postID) and cooldown.boardID isnt g.BOARD.ID
          # Only cooldowns relevant to this post can set the seconds variable:
          #   reply cooldown with a reply, thread cooldown with a thread.
          # Inter-board thread cooldowns only apply on boards other than the one they were posted on.
          suffix = if scope is 'global'
            '_global'
          else
            ''
          seconds = Math.max seconds, QR.cooldown.delays[type + suffix] - elapsed

        # If additional cooldown is enabled, add the configured seconds to the count.
        if QR.cooldown.customCooldown
          seconds = Math.max seconds, parseInt(Conf['customCooldown'], 10) - elapsed

      nCooldowns += Object.keys(cooldowns).length

    QR.cooldown.save save if save.length

    if nCooldowns
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
