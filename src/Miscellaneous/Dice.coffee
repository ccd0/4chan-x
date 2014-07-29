Dice =
  init: ->
    return if g.BOARD.ID isnt 'tg' or g.VIEW is 'catalog' or !Conf['Show Dice Roll']
    Post.callbacks.push
      name: 'Show Dice Roll'
      cb:   @node
  node: ->
    return if @isClone or not dicestats = @info.email?.match /dice[+\s](\d+)d(\d+)/
    # Use the text node directly, as the <b> has two <br>. Count dice since 4chan imposes a maximum.
    roll = $('b', @nodes.comment).firstChild
    roll.data = "Rolled #{roll.data.split(',').length}d#{dicestats[2]}: #{roll.data.slice 7}"
