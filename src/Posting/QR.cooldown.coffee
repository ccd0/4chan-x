QR.cooldown =
  init: ->
    return unless Conf['Cooldown']
    setTimers = (e) => QR.cooldown.types = e.detail
    $.on  window, 'cooldown:timers', setTimers
    $.globalEval 'window.dispatchEvent(new CustomEvent("cooldown:timers", {detail: cooldowns}))'
    $.off window, 'cooldown:timers', setTimers
    for type of QR.cooldown.types
      QR.cooldown.types[type] = +QR.cooldown.types[type]
    key = "cooldown.#{g.BOARD}"
    $.get key, {}, (item) ->
      QR.cooldown.cooldowns = item[key]
      QR.cooldown.start()
    $.sync key, QR.cooldown.sync
  start: ->
    return if QR.cooldown.isCounting or !Object.keys(QR.cooldown.cooldowns).length
    QR.cooldown.isCounting = true
    QR.cooldown.count()
  sync: (cooldowns) ->
    # Add each cooldowns, don't overwrite everything in case we
    # still need to prune one in the current tab to auto-post.
    for id of cooldowns
      QR.cooldown.cooldowns[id] = cooldowns[id]
    QR.cooldown.start()
  set: (data) ->
    return unless Conf['Cooldown']
    {req, post, isReply, threadID, delay} = data
    start = if req then req.uploadEndTime else Date.now()
    if delay
      cooldown = {delay}
    else
      cooldown = {isReply, threadID}
    QR.cooldown.cooldowns[start] = cooldown
    $.set "cooldown.#{g.BOARD}", QR.cooldown.cooldowns
    QR.cooldown.start()
  unset: (id) ->
    delete QR.cooldown.cooldowns[id]
    if Object.keys(QR.cooldown.cooldowns).length
      $.set "cooldown.#{g.BOARD}", QR.cooldown.cooldowns
    else
      $.delete "cooldown.#{g.BOARD}"
  count: ->
    unless Object.keys(QR.cooldown.cooldowns).length
      $.delete "cooldown.#{g.BOARD}"
      delete QR.cooldown.isCounting
      delete QR.cooldown.seconds
      QR.status()
      return

    clearTimeout QR.cooldown.timeout
    QR.cooldown.timeout = setTimeout QR.cooldown.count, $.SECOND

    now     = Date.now()
    post    = QR.posts[0]
    isReply = post.thread isnt 'new'
    hasFile = !!post.file
    seconds = null
    {types, cooldowns} = QR.cooldown

    for start, cooldown of cooldowns
      start = +start
      if 'delay' of cooldown
        if cooldown.delay
          seconds = Math.max seconds, cooldown.delay--
        else
          seconds = Math.max seconds, 0
          QR.cooldown.unset start
        continue

      if isReply is cooldown.isReply
        # Only cooldowns relevant to this post can set the seconds variable:
        #   reply cooldown with a reply, thread cooldown with a thread
        elapsed = (now - start) // $.SECOND
        if elapsed < 0 # clock changed since then?
          QR.cooldown.unset start
          continue
        type = unless isReply
          'thread'
        else if hasFile
          'image'
        else
          'reply'
        maxTimer = Math.max types[type] or 0, types[type + '_intra'] or 0
        unless start <= now <= start + maxTimer * $.SECOND
          QR.cooldown.unset start
        type   += '_intra' if isReply and +post.thread is cooldown.threadID
        seconds = Math.max seconds, types[type] - elapsed

    # Update the status when we change posting type.
    # Don't get stuck at some random number.
    # Don't interfere with progress status updates.
    update = seconds isnt null or !!QR.cooldown.seconds
    QR.cooldown.seconds = seconds
    QR.status() if update
    QR.submit() if seconds is 0 and QR.cooldown.auto and !QR.req
