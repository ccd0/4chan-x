RemoveSpoilers =
  init: ->
    return unless Conf['Remove Spoilers']

    if Conf['Indicate Spoilers']
      @wrapper = (text) ->
        "[spoiler]#{text}[/spoiler]"

    Post::callbacks.push
      name: 'Reveal Spoilers'
      cb:   @node
  
  wrapper: (text) ->
    text

  node: (post) ->
    spoilers = $$ 's', @nodes.comment
    for spoiler in spoilers
      $.replace spoiler, $.tn RemoveSpoilers.wrapper spoiler.textContent
    return