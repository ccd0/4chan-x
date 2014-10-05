QR.cooldown =
  seconds: 0

  init: ->
    return unless Conf['Cooldown']
    setTimers = (e) => QR.cooldown.types = e.detail
    $.on window, 'cooldown:timers', setTimers
    $.globalEval 'window.dispatchEvent(new CustomEvent("cooldown:timers", {detail: cooldowns}))'
    $.off window, 'cooldown:timers', setTimers
    QR.cooldown.types['thread_global'] = 300
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
    return unless Conf['Cooldown']
    return if QR.cooldown.isCounting or Object.keys(QR.cooldown.local).length + Object.keys(QR.cooldown.global).length is 0 and !QR.posts[0].delay?
    QR.cooldown.isCounting = true
    QR.cooldown.count()

  sync: (scope) -> (cooldowns) ->
    QR.cooldown[scope] = cooldowns or {}
    QR.cooldown.start()

  add: ({threadID, postID, start}) ->
    return unless Conf['Cooldown']
    id = "#{g.BOARD}.#{postID}"
    if postID is threadID
      cooldown = {start}
      QR.cooldown.set 'global', id, cooldown
    else
      cooldown = {start, threadID}
    QR.cooldown.set 'local', id, cooldown

  set: (scope, id, value) ->
    key = QR.cooldown.keys[scope]
    $.forceSync key
    cooldowns = QR.cooldown[scope]
    if value?
      cooldowns[id] = value
    else
      delete cooldowns[id]
    if Object.keys(cooldowns).length
      $.set key, cooldowns
    else
      $.delete key

  count: ->
    QR.cooldown.update()
    {seconds} = QR.cooldown
    if seconds is 0 and Object.keys(QR.cooldown.local).length + Object.keys(QR.cooldown.global).length is 0
      delete QR.cooldown.isCounting
    else
      clearTimeout QR.cooldown.timeout
      QR.cooldown.timeout = setTimeout QR.cooldown.count, $.SECOND
    QR.submit() if seconds is 0 and QR.cooldown.auto and !QR.req

  update: ->
    return unless Conf['Cooldown']

    now     = Date.now()
    post    = QR.posts[0]
    isReply = post.thread isnt 'new'
    hasFile = !!post.file
    seconds = 0

    for scope of QR.cooldown.keys
      for id, cooldown of QR.cooldown[scope]
        if !cooldown.start?
          # XXX clean up old format cooldown data
          QR.cooldown.set scope, id
          continue

        elapsed = (now - cooldown.start) // $.SECOND
        if elapsed < 0 # clock changed since then?
          QR.cooldown.set scope, id
          continue

        # Clean up expired cooldowns
        maxTimer = 0
        types1 = if cooldown.threadID? then ['image', 'reply'] else ['thread']
        types2 = if scope is 'global' then ['_global'] else ['', '_intra']
        for t1 in types1
          for t2 in types2
            maxTimer = Math.max maxTimer, QR.cooldown.types[t1 + t2]
        if maxTimer <= elapsed
          QR.cooldown.set scope, id
          continue

        if isReply is cooldown.threadID?
          # Only cooldowns relevant to this post can set the seconds variable:
          #   reply cooldown with a reply, thread cooldown with a thread
          type = unless isReply then 'thread' else if hasFile then 'image' else 'reply'
          if scope is 'global'
            type += '_global'
          else if isReply and +post.thread is cooldown.threadID
            type += '_intra'
          seconds = Math.max seconds, QR.cooldown.types[type] - elapsed

    if post.delay?
      seconds = Math.max 0, Math.ceil (post.delay - now) / $.SECOND

    # Update the status when we change posting type.
    # Don't get stuck at some random number.
    # Don't interfere with progress status updates.
    update = seconds isnt QR.cooldown.seconds
    QR.cooldown.seconds = seconds
    QR.status() if update
