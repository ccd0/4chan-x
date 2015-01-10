Dice =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and g.BOARD.ID is 'tg' and Conf['Show Dice Roll']
    Post.callbacks.push
      name: 'Show Dice Roll'
      cb:   @node
  node: ->
    return if @isClone or not dicestats = @info.email?.match /dice[+\s](\d+)d(\d+)/
    # Use the text node directly, as the <b> has two <br>.
    roll = $('b', @nodes.comment).firstChild
    roll.data = "Rolled #{dicestats[1]}d#{dicestats[2]}: #{roll.data.slice 7}"
