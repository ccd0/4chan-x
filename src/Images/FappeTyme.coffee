FappeTyme =
  init: ->
    return if !(Conf['Fappe Tyme'] or Conf['Werk Tyme']) or g.VIEW is 'catalog' or g.BOARD is 'f'

    if Conf['Fappe Tyme']
      el = $.el 'label',
        innerHTML: "<input type=checkbox name=fappe-tyme> Fappe Tyme"
        title: 'Fappe Tyme'

      FappeTyme.fappe = input = el.firstElementChild

      $.on input, 'change', FappeTyme.cb.fappe

      $.event 'AddMenuEntry',
        type:  'header'
        el:    el
        order: 97

    if Conf['Werk Tyme']
      el = $.el 'label',
        innerHTML: "<input type=checkbox name=werk-tyme> Werk Tyme"
        title: 'Werk Tyme'

      FappeTyme.werk = input = el.firstElementChild

      $.on input, 'change', FappeTyme.cb.werk

      $.event 'AddMenuEntry',
        type:  'header'
        el:    el
        order: 98

    Post.callbacks.push
      name: 'Fappe Tyme'
      cb:   @node

  node: ->
    return if @file
    $.addClass @nodes.root, "noFile"

  cb:
    fappe: ->
      $.toggleClass doc, 'fappeTyme'
      FappeTyme.fappe.checked = $.hasClass doc, 'fappeTyme'
    werk: ->
      $.toggleClass doc, 'werkTyme'
      FappeTyme.werk.checked = $.hasClass doc, 'werkTyme'