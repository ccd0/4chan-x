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
      open: (post) ->
        CopyTextLink.text = post.nodes.commentClean.innerText
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
