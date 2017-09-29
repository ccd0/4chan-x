QR.cooldown =
  seconds: 0
  delays:
    deletion: 60 # cooldown for deleting posts/files

  # Called from Main
  init: ->
    return unless Conf['Quick Reply']
    @data = Conf['cooldowns']
    @changes = {}
    $.sync 'cooldowns', @sync

  # Called from QR
  setup: ->
    # Read cooldown times
    $.extend QR.cooldown.delays, g.BOARD.cooldowns()

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
    QR.cooldown.save()
    QR.cooldown.start()

  addDelay: (post, delay) ->
    return unless Conf['Cooldown']
    cooldown = QR.cooldown.categorize post
    cooldown.delay = delay
    QR.cooldown.set g.BOARD.ID, Date.now(), cooldown
    QR.cooldown.save()
    QR.cooldown.start()

  addMute: (delay) ->
    return unless Conf['Cooldown']
    QR.cooldown.set g.BOARD.ID, Date.now(), {type: 'mute', delay}
    QR.cooldown.save()
    QR.cooldown.start()

  delete: (post) ->
    return unless QR.cooldown.data
    cooldowns = (QR.cooldown.data[post.board.ID] or= {})
    for id, cooldown of cooldowns
      if !cooldown.delay? and cooldown.threadID is post.thread.ID and cooldown.postID is post.ID
        QR.cooldown.set post.board.ID, id, null
    QR.cooldown.save()

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

  mergeChange: (data, scope, id, value) ->
    if value
      (data[scope] or= {})[id] = value
    else if scope of data
      delete data[scope][id]
      delete data[scope] if Object.keys(data[scope]).length is 0

  set: (scope, id, value) ->
    QR.cooldown.mergeChange QR.cooldown.data, scope, id, value
    (QR.cooldown.changes[scope] or= {})[id] = value

  save: ->
    {changes} = QR.cooldown
    return unless Object.keys(changes).length
    $.get 'cooldowns', {}, ({cooldowns}) ->
      for scope of QR.cooldown.changes
        for id, value of QR.cooldown.changes[scope]
          QR.cooldown.mergeChange cooldowns, scope, id, value
        QR.cooldown.data = cooldowns
      $.set 'cooldowns', cooldowns, ->
        QR.cooldown.changes = {}

  update: ->
    return unless QR.cooldown.isCounting

    save = false
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
          QR.cooldown.set scope, start, null
          save = true
          continue

        # Explicit delays from error messages
        if cooldown.delay?
          if cooldown.delay <= elapsed
            QR.cooldown.set scope, start, null
            save = true
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
          QR.cooldown.set scope, start, null
          save = true
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

    QR.cooldown.save if save

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

  count: ->
    QR.cooldown.update()
    QR.submit() if QR.cooldown.seconds is 0 and QR.cooldown.auto and !QR.req
