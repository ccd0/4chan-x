Dice =
  init: ->
    return if g.BOARD.ID isnt 'tg' or g.VIEW is 'catalog' or !Conf['Show Dice Roll']
    Post::callbacks.push
      name: 'Show Dice Roll'
      cb:   @node
  node: ->
    return if @isClone or not dicestats = @info.email?.match /dice\+(\d+)d(\d+)/
    # Use the text node directly, as the <b> has two <br>.
    roll = $('b', @nodes.comment).firstChild
    # Stop here if it looks like this:
    #  Rolled 44
    # and not this:
    #  Rolled 9, 8, 10, 3, 5 = 35
    return unless rollResults = roll.textContent.match /^Rolled (\d+)$/
    roll.textContent = "Rolled #{dicestats[1]}d#{dicestats[2]} and got #{rollResults[1]}"
