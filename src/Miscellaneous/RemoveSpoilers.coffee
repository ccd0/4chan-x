RemoveSpoilers =
  init: ->
    if Conf['Reveal Spoilers']
      $.addClass doc, 'reveal-spoilers'

    return unless Conf['Remove Spoilers']

    Post.callbacks.push
      name: 'Reveal Spoilers'
      cb:   @node
    CatalogThread.callbacks.push
      name: 'Reveal Spoilers'
      cb:   @node
  
  node: (post) ->
    spoilers = $$ 's', @nodes.comment
    for spoiler in spoilers
      span = $.el 'span', className: 'removed-spoiler'
      $.replace spoiler, span
      $.add span, [spoiler.childNodes...]
    return
