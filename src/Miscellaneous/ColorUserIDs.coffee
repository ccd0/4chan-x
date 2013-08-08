IDColor =
  init: ->
    return unless Conf['Color User IDs']

    Post::callbacks.push
      name: 'Color User IDs'
      cb:   @node

  node: (post) ->
    return unless $('.hand', @nodes.uniqueID)?.nodeName is 'SPAN'
    str = @info.uniqueID
    uid.style.cssText = IDColor.css IDColor.ids[str] or IDColor.compute str

  ids: {}

  compute: (str) ->
    hash = @hash str

    rgb = [
      (hash >> 24) & 0xFF
      (hash >> 16) & 0xFF
      (hash >> 8) & 0xFF
    ]

    rgb[3] = ((rgb[0] * 0.299) + (rgb[1] * 0.587) + (rgb[2] * 0.114)) > 125

    @ids[str] = rgb
    rgb

  css: (rgb) -> "background-color: rgb(#{rgb[0]},#{rgb[1]},#{rgb[2]}); color: #{if rgb[3] then "black;" else "white;"} border-radius: 3px; padding: 0px 2px;"

  hash: (str) ->
    msg = 0
    i = 0
    j = str.length
    while i < j
      msg = ((msg << 5) - msg) + str.charCodeAt i
      ++i
    msg
