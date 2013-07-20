Dice =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Show Dice Rolled']
    # or !Conf['Show dice being rolled']
    return if g.BOARD.ID isnt 'tg'
    Post::callbacks.push
      name: 'Dice roller'
      cb: @node
  node: ->
    return if @isClone
    email = @info.email
    dicestats = /dice\W(\d+)d(\d+)/.exec(email)
    return if not dicestats
    roll = ($$("b",@nodes.comment).filter (elem)->elem.innerHTML.lastIndexOf("Rolled", 0) == 0)[0]
    return if not roll
    rollResults = roll.innerHTML.slice 7
    dicestr = dicestats[1]+"d"+dicestats[2]
    roll.innerHTML = "Rolled " + dicestr + " and got " + rollResults


