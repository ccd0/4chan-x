ArchiveLink =
  init: ->
    return unless g.SITE.software is 'yotsuba' and g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Archive Link']

    div = $.el 'div',
      textContent: 'Archive'

    entry =
      el: div
      order: 60
      open: ({ID, thread, board}) ->
        !!Redirect.to 'thread', {postID: ID, threadID: thread.ID, boardID: board.ID}
      subEntries: []

    for type in [
      ['Post',      'post']
      ['Name',      'name']
      ['Tripcode',  'tripcode']
      ['Capcode',   'capcode']
      ['Subject',   'subject']
      ['Flag',      'country']
      ['Filename',  'filename']
      ['Image MD5', 'MD5']
    ]
      # Add a sub entry for each type.
      entry.subEntries.push @createSubEntry type[0], type[1]

    Menu.menu.addEntry entry

  createSubEntry: (text, type) ->
    el = $.el 'a',
      textContent: text
      target: '_blank'

    open = if type is 'post'
      ({ID, thread, board}) ->
        el.href = Redirect.to 'thread', {postID: ID, threadID: thread.ID, boardID: board.ID}
        true
    else
      (post) ->
        typeParam = if type is 'country' and post.info.flagCodeTroll
          'troll_country'
        else
          type
        value = if type is 'country'
          post.info.flagCode or post.info.flagCodeTroll.toLowerCase()
        else
          Filter.values(type, post)[0]
        # We want to parse the exact same stuff as the filter does already.
        return false unless value
        el.href = Redirect.to 'search',
          boardID:  post.board.ID
          type:     typeParam
          value:    value
          isSearch: true
        true

    return {
      el: el
      open: open
    }
