RemoveSpoilers =
  init: ->
    if Conf['Indicate Spoilers']
      @wrapper = (text) ->
        "[spoiler]#{text}[/spoiler]"
    Main.callbacks.push @node
  
  wrapper: (text) ->
    text

  node: (post) ->
    spoilers = $$ 's', post.el
    for spoiler in spoilers
      $.replace spoiler, $.tn RemoveSpoilers.wrapper spoiler.textContent
    return