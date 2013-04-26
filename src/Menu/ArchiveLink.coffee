ArchiveLink =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Menu'] or !Conf['Archive Link']

    div = $.el 'div',
      textContent: 'Archive'

    entry =
      type: 'post'
      el: div
      order: 90
      open: ({ID, thread, board}) ->
        redirect = Redirect.to {postID: ID, threadID: thread.ID, boardID: board.ID}
        redirect isnt "//boards.4chan.org/#{board}/"
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
        el.href = Redirect.to {postID: ID, threadID: thread.ID, boardID: board.ID}
        true
    else
      (post) ->
        value = Filter[type] post
        # We want to parse the exact same stuff as the filter does already.
        return false unless value
        el.href = Redirect.to
          boardID:  post.board.ID
          type:     type
          value:    value
          isSearch: true
        true

    return {
      el: el
      open: open
    }
