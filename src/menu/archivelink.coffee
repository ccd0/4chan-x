ArchiveLink =
  init: ->
    div = $.el 'div',
      textContent: 'Archive'

    entry =
      el: div
      open: (post) ->
        path = $('a[title="Highlight this post"]', post.el).pathname.split '/'
        if (Redirect.to {board: path[1], threadID: path[3], postID: post.ID}) is "//boards.4chan.org/#{path[1]}/"
          return false
        post.info = [path[1], path[3]]
        true
      children: []

    for key, type of {
      Post:        'apost'
      Name:        'name'
      Tripcode:    'tripcode'
      'E-mail':    'email'
      Subject:     'subject'
      Filename:    'filename'
      'Image MD5': 'md5'
    }
      # Add a sub entry for each type.
      entry.children.push @createSubEntry key, type

    Menu.addEntry entry

  createSubEntry: (text, type) ->

    el = $.el 'a',
      textContent: text
      target: '_blank'

    open = (post) ->
      if type is 'apost'
        el.href =
          Redirect.to
            board:    post.info[0]
            threadID: post.info[1]
            postID:   post.ID
        return true
      value = Filter[type] post
      # We want to parse the exact same stuff as Filter does already.
      return false unless value
      el.href =
        Redirect.to
          board:    post.info[0]
          type:     type
          value:    value
          isSearch: true

    return el: el, open: open