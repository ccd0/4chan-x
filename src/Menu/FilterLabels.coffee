FilterLabels =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Filter Labels']

    div = $.el 'div',
      textContent: 'Labels'

    Menu.menu.addEntry
      el: div
      order: 117
      open: (post) ->
        {labels} = post.origin or post
        return false unless labels.length
        @subEntries.length = 0
        for label in labels
          @subEntries.push el: $.el 'div', textContent: label
        true
      subEntries: []