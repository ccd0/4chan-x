RelativeDates =
  INTERVAL: $.MINUTE / 2
  init: ->
    switch g.VIEW
      when 'index'
        @flush()
        $.on d, 'visibilitychange', @flush
        return unless Conf['Relative Post Dates']
      when 'thread'
        return unless Conf['Relative Post Dates']
        @flush()
        $.on d, 'visibilitychange ThreadUpdate', @flush if g.VIEW is 'thread'
      else
        return

    Post.callbacks.push
      name: 'Relative Post Dates'
      cb:   @node
  node: ->
    return if @isClone

    # Show original absolute time as tooltip so users can still know exact times
    # Since "Time Formatting" runs its `node` before us, the title tooltip will
    # pick up the user-formatted time instead of 4chan time when enabled.
    dateEl = @nodes.date
    dateEl.title = dateEl.textContent

    RelativeDates.update @

  # diff is milliseconds from now.
  relative: (diff, now, date) ->
    unit = if (number = (diff / $.DAY)) >= 1
      years  = now.getYear()  - date.getYear()
      months = now.getMonth() - date.getMonth()
      days   = now.getDate()  - date.getDate()
      if years > 1
        number = years - (months < 0 or months is 0 and days < 0)
        'year'
      else if years is 1 and (months > 0 or months is 0 and days >= 0)
        number = years
        'year'
      else if (months = (months+12)%12 ) > 1
        number = months - (days < 0)
        'month'
      else if months is 1 and days >= 0
        number = months
        'month'
      else
        'day'
    else if (number = (diff / $.HOUR)) >= 1
      'hour'
    else if (number = (diff / $.MINUTE)) >= 1
      'minute'
    else
      # prevent "-1 seconds ago"
      number = Math.max(0, diff) / $.SECOND
      'second'

    rounded = Math.round number
    unit += 's' if rounded isnt 1 # pluralize

    "#{rounded} #{unit} ago"

  # Changing all relative dates as soon as possible incurs many annoying
  # redraws and scroll stuttering. Thus, sacrifice accuracy for UX/CPU economy,
  # and perform redraws when the DOM is otherwise being manipulated (and scroll
  # stuttering won't be noticed), falling back to INTERVAL while the page
  # is visible.
  #
  # Each individual dateTime element will add its update() function to the stale list
  # when it is to be called.
  stale: []
  flush: ->
    # No point in changing the dates until the user sees them.
    return if d.hidden

    now = new Date()
    RelativeDates.update data, now for data in RelativeDates.stale
    RelativeDates.stale = []

    # Reset automatic flush.
    clearTimeout RelativeDates.timeout
    RelativeDates.timeout = setTimeout RelativeDates.flush, RelativeDates.INTERVAL

  # `update()`, when called from `flush()`, updates the elements,
  # and re-calls `setOwnTimeout()` to re-add `data` to the stale list later.
  update: (data, now) ->
    isPost = data instanceof Post
    date = if isPost
      data.info.date
    else
      new Date +data.dataset.utc
    now or= new Date()
    diff = now - date
    relative = RelativeDates.relative diff, now, date
    if isPost
      for singlePost in [data].concat data.clones
        singlePost.nodes.date.firstChild.textContent = relative
    else
      data.firstChild.textContent = relative
    RelativeDates.setOwnTimeout diff, data
  setOwnTimeout: (diff, data) ->
    delay = if diff < $.MINUTE
      $.SECOND - (diff + $.SECOND / 2) % $.SECOND
    else if diff < $.HOUR
      $.MINUTE - (diff + $.MINUTE / 2) % $.MINUTE
    else if diff < $.DAY
      $.HOUR - (diff + $.HOUR / 2) % $.HOUR
    else
      $.DAY - (diff + $.DAY / 2) % $.DAY
    setTimeout RelativeDates.markStale, delay, data
  markStale: (data) ->
    return if data in RelativeDates.stale # We can call RelativeDates.update() multiple times.
    return if data instanceof Post and !g.posts[data.fullID] # collected post.
    RelativeDates.stale.push data
