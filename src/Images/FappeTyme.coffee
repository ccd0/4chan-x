FappeTyme =
  init: ->
    return if !Conf['Fappe Tyme'] or g.VIEW is 'catalog' or g.BOARD is 'f'
    el = $.el 'label',
      innerHTML: "<input type=checkbox name=fappe-tyme> Fappe Tyme"
      title: 'Fappe Tyme'
    
    FappeTyme.input = input = el.firstElementChild

    $.on input, 'change', FappeTyme.toggle

    $.event 'AddMenuEntry',
      type:  'header'
      el:    el
      order: 97

    Post::callbacks.push
      name: 'Fappe Tyme'
      cb:   @node

  node: ->
    return if @file
    $.addClass @nodes.root, "noFile"

  toggle: ->
    $.event 'CloseMenu'
    (if @checked then $.addClass else $.rmClass) doc, 'fappeTyme'