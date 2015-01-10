RemoveSpoilers =
  init: ->
    if Conf['Reveal Spoilers']
      $.addClass doc, 'reveal-spoilers'

    return unless Conf['Remove Spoilers']

    $.addClass doc, 'remove-spoilers'

    Post.callbacks.push
      name: 'Reveal Spoilers'
      cb:   @node

    CatalogThread.callbacks.push
      name: 'Reveal Spoilers'
      cb:   @node

    if g.VIEW is 'archive'
      $.ready -> RemoveSpoilers.unspoiler $.id 'arc-list'

  node: (post) ->
    RemoveSpoilers.unspoiler @nodes.comment

  unspoiler: (el) ->
    spoilers = $$ 's', el
    for spoiler in spoilers
      span = $.el 'span', className: 'removed-spoiler'
      $.replace spoiler, span
      $.add span, [spoiler.childNodes...]
    return