FappeTyme =
  init: ->
    return if !Conf['Fappe Tyme'] or g.VIEW is 'catalog' or g.BOARD is 'f'
    el = $.el 'a',
      href: 'javascript:;'
      id:   'fappeTyme'
      title: 'Fappe Tyme'

    $.on el, 'click', FappeTyme.toggle

    Header.addShortcut el

    Post::callbacks.push
      name: 'Fappe Tyme'
      cb:   @node

  node: ->
    return if @file
    $.addClass @nodes.root, "noFile"

  toggle: ->
    $.toggleClass doc, 'fappeTyme'