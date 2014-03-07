Labels =
  init: ->
    return if !Conf['Menu']

    $.event 'AddMenuEntry',
      type: 'post'
      el: $.el 'div', textContent: 'Labels'
      order: 60
      open: (post, addSubEntry) ->
        {labels} = post.origin or post
        return false unless labels.length
        @subEntries.length = 0
        for label in labels
          addSubEntry el: $.el 'div', textContent: label
        true
      subEntries: []
