FappeTyme = 
  init: ->
    return if g.CATALOG or g.BOARD is 'f'
    el = $.el 'a',
      href:  'javascript:;'
      id:    'fappeTyme'
      title: 'Fappe Tyme'
    $.on el, 'click', FappeTyme.toggle
    $.add $.id('navtopright'), el
    Main.callbacks.push @node

  node: (post) ->
    return if post.img
    post.el.parentElement.classList.add "noFile"

  toggle: ->
    $.toggleClass d.body, 'fappeTyme'