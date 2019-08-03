IDColor =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Color User IDs']
    @ids = $.dict()
    @ids['Heaven'] = [0, 0, 0, '#fff']

    Callbacks.Post.push
      name: 'Color User IDs'
      cb:   @node

  node: ->
    return if @isClone or !((uid = @info.uniqueID) and (span = @nodes.uniqueID))

    rgb = IDColor.ids[uid] or IDColor.compute uid

    # Style the damn node.
    {style} = span
    style.color = rgb[3]
    style.backgroundColor = "rgb(#{rgb[0]},#{rgb[1]},#{rgb[2]})"
    $.addClass span, 'painted'

  compute: (uid) ->
    # Convert chars to integers, bitshift and math to create a larger integer
    # Create a nice string of binary
    hash = if g.SITE.uidColor then g.SITE.uidColor(uid) else parseInt(uid, 16)

    # Convert binary string to numerical values with bitshift and '&' truncation.
    rgb = [
      (hash >> 16) & 0xFF
      (hash >> 8)  & 0xFF
      hash & 0xFF
    ]

    # Weight color luminance values, assign a font color that should be readable. 
    rgb.push if $.luma(rgb) > 125
      '#000'
    else
      '#fff'

    # Cache.
    @ids[uid] = rgb
