ImageReplace =
  init: ->
    return if g.BOARD is 'f'
    QuoteInline.callbacks.push @node
    QuotePreview.callbacks.push @node
    Main.callbacks.push @node

  node: (post) ->
    {img} = post
    return if post.el.hidden or !img or /spoiler/.test img.src
    if Conf["Replace #{if (type = ((href = img.parentNode.href).match /\w{3}$/)[0].toUpperCase()) is 'PEG' then 'JPG' else type}"]
      el = $.el 'img'
      el.setAttribute 'data-id', post.ID
      $.on el, 'load', ->
        img.src = el.src
      el.src = href