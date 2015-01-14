Labels =
  init: ->
    return if !Conf['Menu']

    Menu.menu.addEntry
      el: $.el 'div', textContent: 'Labels'
      order: 60
      open: (post, addSubEntry) ->
        {labels} = post.origin or post
        return false unless labels.length
        @subEntries.length = 0
        @subEntries = (el: $.el 'div', textContent: label for label in labels)
        true
      subEntries: []

