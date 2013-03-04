IDColor =
  init: ->
    QuotePreview.callbacks.push @node
    ExpandComment.callbacks.push @node
    Main.callbacks.push @node

  node: (post) ->
    return unless uid = $ '.postInfo .hand', post.el
    str = uid.textContent
    if uid.nodeName is 'SPAN'
      uid.style.cssText = IDColor.apply.call str

    unless IDColor.highlight[str]
      IDColor.highlight[str] = []

    if str is $.get "highlightedID/#{g.BOARD}/"
      IDColor.highlight.current.push post
      $.addClass post.el, 'highlight'

    IDColor.highlight[str].push post
    $.on uid, 'click', -> IDColor.idClick str

  ids: {}

  compute: (str) ->
    hash = @hash str

    rgb = [
      (hash >> 24) & 0xFF
      (hash >> 16) & 0xFF
      (hash >> 8)  & 0xFF
    ]
    rgb[3] = ((rgb[0] * 0.299) + (rgb[1] * 0.587) + (rgb[2] * 0.114)) > 125

    @ids[str] = rgb
    rgb

  apply: ->
    rgb = IDColor.ids[@] or IDColor.compute @
    "background-color: rgb(#{rgb[0]},#{rgb[1]},#{rgb[2]}); color: " + if rgb[3] then "black;" else "white;"

  hash: (str) ->
    msg = 0
    i = 0
    j = str.length
    while i < j
      msg = ((msg << 5) - msg) + str.charCodeAt i
      ++i
    msg
  highlight:
    current: []

  idClick: (str) ->
    for post in @highlight.current
      $.rmClass post.el, 'highlight'
    last = $.get value = "highlightedID/#{g.BOARD}/", false
    if str is last
      @highlight.current = []
      return $.delete value

    for post in @highlight[str]
      continue if post.isInlined
      $.addClass post.el, 'highlight'
      @highlight.current.push post
    $.set value, str