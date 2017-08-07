CopyTextLink =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Copy Text Link']

    a = $.el 'a',
      className: 'copy-text-link'
      href: 'javascript:;'
      textContent: 'Copy Text'
    $.on a, 'click', CopyTextLink.copy

    Menu.menu.addEntry
      el: a
      order: 12
      open: (post) ->
        CopyTextLink.text = post.commentOrig()
        true

  copy: ->
    el = $.el 'textarea',
      className: 'copy-text-element',
      value: CopyTextLink.text
    $.add d.body, el
    el.select()
    try
      d.execCommand 'copy'
    $.rm el
