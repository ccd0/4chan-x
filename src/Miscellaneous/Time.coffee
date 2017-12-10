Time =
  init: ->
    return unless g.VIEW in ['index', 'thread', 'archive'] and Conf['Time Formatting']

    Callbacks.Post.push
      name: 'Time Formatting'
      cb:   @node

  node: ->
    return if @isClone
    @nodes.date.textContent = Time.format Conf['time'], @info.date
  format: (formatString, date) ->
    formatString.replace /%(.)/g, (s, c) ->
      if c of Time.formatters
        Time.formatters[c].call(date)
      else
        s

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

  localeFormat: (date, options, defaultValue) ->
    if Conf['timeLocale']
      try
        return Intl.DateTimeFormat(Conf['timeLocale'], options).format(date)
    defaultValue

  localeFormatPart: (date, options, part, defaultValue) ->
    if Conf['timeLocale']
      try
        parts = Intl.DateTimeFormat(Conf['timeLocale'], options).formatToParts(date)
        return parts.map((x) -> if x.type is part then x.value else '').join('')
    defaultValue

  zeroPad: (n) -> if n < 10 then "0#{n}" else n

  formatters:
    a: -> Time.localeFormat @, {weekday: 'short'}, Time.day[@getDay()][...3]
    A: -> Time.localeFormat @, {weekday: 'long'},  Time.day[@getDay()]
    b: -> Time.localeFormat @, {month:   'short'}, Time.month[@getMonth()][...3]
    B: -> Time.localeFormat @, {month:   'long'},  Time.month[@getMonth()]
    d: -> Time.zeroPad @getDate()
    e: -> @getDate()
    H: -> Time.zeroPad @getHours()
    I: -> Time.zeroPad @getHours() % 12 or 12
    k: -> @getHours()
    l: -> @getHours() % 12 or 12
    m: -> Time.zeroPad @getMonth() + 1
    M: -> Time.zeroPad @getMinutes()
    p: -> Time.localeFormatPart @, {hour: 'numeric', hour12: true}, 'dayperiod', (if @getHours() < 12 then 'AM' else 'PM')
    P: -> Time.formatters.p.call(@).toLowerCase()
    S: -> Time.zeroPad @getSeconds()
    y: -> @getFullYear().toString()[2..]
    Y: -> @getFullYear()
    '%': -> '%'
