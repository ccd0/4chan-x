Anonymize =
  init: ->
    return if g.VIEW not in ['index', 'thread'] or !Conf['Anonymize']

    Post.callbacks.push
      name: 'Anonymize'
      cb:   @node
  node: ->
    return if @info.capcode or @isClone
    {name, tripcode, email} = @nodes
    if @info.name isnt 'Anonymous'
      name.textContent = 'Anonymous'
    if tripcode
      $.rm tripcode
      delete @nodes.tripcode
    if @info.email
      $.replace email, name
      delete @nodes.email
