ArchiveLink =
  init: ->
    return if !Conf['Menu'] or !Conf['Archive Link']

    div = $.el 'div',
      textContent: 'Archive'

    entry =
      type: 'post'
      el: div
      order: 90
      open: ({ID, thread, board}) ->
        !!Redirect.to 'thread', {postID: ID, threadID: thread.ID, boardID: board.ID}
      subEntries: []

    for type in [
      ['Post',      'post']
      ['Name',      'name']
      ['Tripcode',  'tripcode']
      ['E-mail',    'email']
      ['Subject',   'subject']
      ['Filename',  'filename']
      ['Image MD5', 'MD5']
    ]
      # Add a sub entry for each type.
      entry.subEntries.push @createSubEntry type[0], type[1]

    $.event 'AddMenuEntry', entry

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
        value = Filter[type] post
        # We want to parse the exact same stuff as the filter does already.
        return false unless value
        el.href = Redirect.to 'search',
          boardID:  post.board.ID
          type:     type
          value:    value
        true

    return {
      el: el
      open: open
    }
