RelativeDates =
  INTERVAL: $.MINUTE
  init: ->
    Main.callbacks.push @node

    # flush when page becomes visible again
    $.on d, 'visibilitychange', @flush
  node: (post) ->
    dateEl = $ '.postInfo > .dateTime', post.el

    # Show original absolute time as tooltip so users can still know exact times
    # Since "Time Formatting" runs `node` before us, the title tooltip will
    # pick up the user-formatted time instead of 4chan time when enabled.
    dateEl.title = dateEl.textContent

    # convert data-utc to milliseconds
    utc = dateEl.dataset.utc * 1000

    diff = Date.now() - utc

    dateEl.textContent = RelativeDates.relative diff
    RelativeDates.setUpdate dateEl, utc, diff

    # Main calls @node whenever a DOM node is added (update, inline post,
    # whatever), so use also this reflow opportunity to flush any other dates
    # flush is debounced, so this won't burn too much cpu
    RelativeDates.flush()

  # diff is milliseconds from now
  relative: (diff) ->
    unit = if (number = (diff / $.DAY)) > 1
      'day'
    else if (number = (diff / $.HOUR)) > 1
      'hour'
    else if (number = (diff / $.MINUTE)) > 1
      'minute'
    else
      number = diff / $.SECOND
      'second'

    rounded = Math.round number
    unit += 's' if rounded isnt 1 # pluralize

    "#{rounded} #{unit} ago"

  # changing all relative dates as soon as possible incurs many annoying
  # redraws and scroll stuttering. Thus, sacrifice accuracy for UX/CPU economy,
  # and perform redraws when the DOM is otherwise being manipulated (and scroll
  # stuttering won't be noticed), falling back to INTERVAL while the page
  # is visible.
  #
  # each individual dateTime element will add its update() function to the stale list
  # when it to be called.
  stale: []
  flush: $.debounce($.SECOND, ->
    # no point in changing the dates until the user sees them
    return if d.hidden

    now = Date.now()
    update now for update in RelativeDates.stale
    RelativeDates.stale = []

    # reset automatic flush
    clearTimeout RelativeDates.timeout
    RelativeDates.timeout = setTimeout RelativeDates.flush, RelativeDates.INTERVAL)

  # create function `update()`, closed over dateEl and diff, that, when called
  # from `flush()`, updates the element, and re-calls `setOwnTimeout()` to
  # re-add `update()` to the stale list later.
  setUpdate: (dateEl, utc, diff) ->
    setOwnTimeout = (diff) ->
      delay = if diff < $.MINUTE
        $.SECOND - (diff + $.SECOND / 2) % $.SECOND
      else if diff < $.HOUR
        $.MINUTE - (diff + $.MINUTE / 2) % $.MINUTE
      else
        $.HOUR - (diff + $.HOUR / 2) % $.HOUR
      setTimeout markStale, delay

    update = (now) ->
      if d.contains dateEl # not removed from DOM
        diff = now - utc
        dateEl.textContent = RelativeDates.relative diff
        setOwnTimeout diff

    markStale = -> RelativeDates.stale.push update

    # kick off initial timeout with current diff
    setOwnTimeout diff