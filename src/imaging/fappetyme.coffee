FappeTyme = 
  init: ->
    return if g.CATALOG or g.BOARD is 'f'

    el = $.el 'label',
      href:  'javascript:;'
      id:    'fappeTyme'
      title: 'Fappe Tyme'
      innerHTML: '<input type="checkbox"><span>Fappe Tyme</span>'
    $.add $.id('imgContainer'), el
    $.on $('input', el), 'click', FappeTyme.toggle
    Main.callbacks.push @node

  node: (post) ->
    return if post.img
    post.el.parentElement.classList.add "noFile"

  toggle: ->
    $.toggleClass d.body, 'fappeTyme'