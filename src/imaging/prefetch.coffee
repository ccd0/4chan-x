Prefetch =
  init: ->
    return if g.BOARD is 'f'
    @dialog()
  dialog: ->
    controls = $.el 'label',
      id: 'prefetch'
      innerHTML:
        "<input type=checkbox>Prefetch Images"
    input = $ 'input', controls
    $.on input, 'change', Prefetch.change

    first = $.id('delform').firstElementChild
    if first.id is 'imgControls'
      $.after first, controls
    else
      $.before first, controls

  change: ->
    $.off @, 'change', Prefetch.change
    for thumb in $$ 'a.fileThumb'
      $.el 'img',
        src: thumb.href
    Main.callbacks.push Prefetch.node

  node: (post) ->
    {img} = post
    return if post.el.hidden or not img
    $.el 'img',
      src: img.parentNode.href