Metadata =
  init: ->
    return unless Conf['WEBM Metadata'] and g.VIEW in ['index', 'thread'] and g.BOARD.ID isnt 'f'

    Callbacks.Post.push
      name: 'WEBM Metadata'
      cb:   @node

  node: ->
    return unless @file and /webm$/i.test @file.url
    if @isClone
      el = $ '.webm-title', @file.text
    else
      el = $.el 'span',
        className: 'webm-title'
      $.extend el,
        <%= html('<a href="javascript:;"></a>') %>
      $.add @file.text, [$.tn(' '), el]
    $.one el.lastElementChild, 'mouseover focus', Metadata.load if el.children.length is 1

  load: ->
    $.rmClass @parentNode, 'error'
    $.addClass @parentNode, 'loading'
    CrossOrigin.binary Get.postFromNode(@).file.url, (data) =>
      $.rmClass @parentNode, 'loading'
      if data?
        title = Metadata.parse data
        output = $.el 'span',
          textContent: title or ''
        $.addClass @parentNode, 'not-found' unless title?
        $.before @, output
        @parentNode.tabIndex = 0
        @parentNode.focus() if d.activeElement is @
        @tabIndex = -1
      else
        $.addClass @parentNode, 'error'
        $.one @, 'click', Metadata.load
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
        return decodeURIComponent escape title # UTF-8 decoding
      else unless element in [0x8538067, 0x549A966] # Segment, Info
        i += size
    null
