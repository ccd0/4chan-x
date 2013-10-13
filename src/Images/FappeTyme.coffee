FappeTyme =
  init: ->
    return if !(Conf['Fappe Tyme'] or Conf['Werk Tyme']) or g.VIEW is 'catalog' or g.BOARD is 'f'

    if Conf['Fappe Tyme']
      el = $.el 'a',
        href: 'javascript:;'
        id:   'fappeTyme'
        title: 'Fappe Tyme'
        className: 'a-icon'

      $.on el, 'click', FappeTyme.cb.fappe

      Header.addShortcut el, true

    if Conf['Werk Tyme']
      el = $.el 'a',
        href: 'javascript:;'
        id:   'werkTyme'
        title: 'Werk Tyme'
        className: 'icon'
        textContent: '\uf0b1'

      $.on el, 'click', FappeTyme.cb.werk

      Header.addShortcut el, true

    Post.callbacks.push
      name: 'Fappe Tyme'
      cb:   @node

  node: ->
    return if @file
    $.addClass @nodes.root, "noFile"

  cb:
    fappe: ->
      $.toggleClass doc, 'fappeTyme'
    werk: ->
      $.toggleClass doc, 'werkTyme'
