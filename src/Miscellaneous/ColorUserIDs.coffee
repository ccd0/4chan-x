IDColor =
  init: ->
    return if g.VIEW is 'catalog' or not Conf['Color User IDs']
    @ids = {}

    Post::callbacks.push
      name: 'Color User IDs'
      cb:   @node

  node: ->
    return if @isClone or not uid = @info.uniqueID
    span = $ '.hand', @nodes.uniqueID
    return unless span and span.nodeName is 'SPAN'
    rgb = IDColor.compute uid
    {style} = span
    style.color = rgb[3]
    style.backgroundColor = "rgb(#{rgb[0]},#{rgb[1]},#{rgb[2]})"
    $.addClass span, painted
    span.title = 'Highlight posts by this ID'

  compute: (uid) ->
    return IDColor.ids[uid] if IDColor.ids[uid]

    hash = IDColor.hash uid
    rgb = [
      (hash >> 24) & 0xFF
      (hash >> 16) & 0xFF
      (hash >> 8)  & 0xFF
    ]
    rgb[3] = if (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 125
      '#000'
    else
      '#fff'
    @ids[uid] = rgb

  hash: (uid) ->
    msg = 0
    i = 0
    while i < 8
      msg = (msg << 5) - msg + uid.charCodeAt i++
    msg