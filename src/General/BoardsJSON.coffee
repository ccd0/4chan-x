BoardsJSON =
  cbs: []

  init: ->
    if (Conf['boardsJSON'].lastChecked or 0) < Date.now() - 2 * $.HOUR
      $.ajax '//a.4cdn.org/boards.json', onloadend: @load
    else
      @set Conf['boardsJSON'].boards

  load: ->
    if @status is 200
      boards = {}
      for board in @response.boards
        boards[board.board] = board
      $.set 'boardsJSON', {boards, lastChecked: Date.now()}
    else
      {boards} = Conf['boardsJSON']
      new Notice 'warning', "Failed to load boards JSON. Error #{@statusText} (#{@status})", 20
    BoardsJSON.set boards

  set: (@boards) ->
    for ID, board of @boards
      g.boards[ID]?.json = board
    for cb in @cbs
      $.queueTask cb
    return

  ready: (cb) ->
    if @boards
      cb()
    else
      @cbs.push cb
