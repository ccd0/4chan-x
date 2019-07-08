RemoveSpoilers =
  init: ->
    if Conf['Reveal Spoilers']
      $.addClass doc, 'reveal-spoilers'

    return unless Conf['Remove Spoilers']

    Callbacks.Post.push
      name: 'Reveal Spoilers'
      cb:   @node

    if g.VIEW is 'archive'
      $.ready -> RemoveSpoilers.unspoiler $.id 'arc-list'

  node: ->
    RemoveSpoilers.unspoiler @nodes.comment

  unspoiler: (el) ->
    spoilers = $$ Site.selectors.spoiler, el
    for spoiler in spoilers
      span = $.el 'span', className: 'removed-spoiler'
      $.replace spoiler, span
      $.add span, [spoiler.childNodes...]
    return
