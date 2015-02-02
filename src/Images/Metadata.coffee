Metadata =
  init: ->
    return unless Conf['WEBM Metadata'] and g.VIEW in ['index', 'thread'] and g.BOARD.ID isnt 'f'

    Post.callbacks.push
      name: 'WEBM Metadata'
      cb:   @node

  node: ->
    return unless @file and /webm$/i.test @file.URL
    if @isClone
      link = $ '.webm-title', @file.text
    else
      link = $.el 'a',
        className:   'webm-title ready'
        href:        'javascript:;'
        textContent: 'title'
      $.add @file.text, [$.tn('\u00A0'), link]
    $.on link, 'click', Metadata[if link.dataset.title? then 'toggle' else 'load']

  load: ->
    $.off @, 'click', Metadata.load
    $.rmClass @, 'ready'
    @textContent = '...'
    CrossOrigin.binary Get.postFromNode(@).file.URL, (data) =>
      if data?
        Metadata.parse.call @, data
        $.on @, 'click', Metadata.toggle
      else
        @textContent = 'error'
        $.on @, 'click', Metadata.load
    ,
      Range: 'bytes=0-9999'

  parse: (data) ->
    readInt = ->
      n = data[i++]
      len = 0
      len++ while n < (0x80 >> len)
      n ^= (0x80 >> len)
      while len-- and i < data.length
        n = (n << 8) ^ data[i++]
      n

    i = 0
    while i < data.length
      element = readInt()
      size    = readInt()
      if element is 0x3BA9 # Title
        title = ''
        while size-- and i < data.length
          title += String.fromCharCode data[i++]
        @textContent = @dataset.title = decodeURIComponent escape title # UTF-8 decoding
        return
      else unless element in [0x8538067, 0x549A966] # Segment, Info
        i += size
    @textContent = 'not found'

  toggle: ->
    @textContent = if $.hasClass @, 'ready'
      @dataset.title or 'not found'
    else
      'title'
    $.toggleClass @, 'ready'
