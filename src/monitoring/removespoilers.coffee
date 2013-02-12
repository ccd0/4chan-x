RemoveSpoilers =
  init: ->
    Main.callbacks.push @node

  node: (post) ->
    spoilers = $$ 's', post.el
    for spoiler in spoilers
      $.replace spoiler, $.tn spoiler.textContent
    return