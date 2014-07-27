IDColor =
  init: ->
    return if !Conf['Color User IDs']
    @ids = {
      Heaven: [0, 0, 0, '#fff']
    }

    Post.callbacks.push
      name: 'Color User IDs'
      cb:   @node

  node: ->
    return if @isClone or !((uid = @info.uniqueID) and (span = $ 'span.hand', @nodes.uniqueID))

    rgb = IDColor.ids[uid] or IDColor.compute uid

    # Style the damn node.
    span.style.color = rgb[3]
    span.style.backgroundColor = "rgb(#{rgb[0]},#{rgb[1]},#{rgb[2]})"
    $.addClass span, 'painted'
    span.title = 'Highlight posts by this ID'

  compute: (uid) ->
    # Convert chars to integers, bitshift and math to create a larger integer
    # Create a nice string of binary
    i    = 1
    hash = uid.charCodeAt 0
    hash = (hash << 5) - hash + uid.charCodeAt i++ while i < 8

    # Convert binary string to numerical values with bitshift and '&' truncation.
    rgb = [
      (hash >> 24) & 0xFF
      (hash >> 16) & 0xFF
      (hash >> 8)  & 0xFF
    ]

    # Weight color luminance values, assign a font color that should be readable. 
    rgb.push if (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 125
      '#000' 
    else
      '#fff'

    # Cache.
    @ids[uid] = rgb