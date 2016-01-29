BoardConfig =
  cbs: []

  init: ->
    if (Conf['boardConfig'].lastChecked or 0) < Date.now() - 2 * $.HOUR
      $.ajax '//a.4cdn.org/boards.json', onloadend: @load
    else
      @set Conf['boardConfig'].boards

  load: ->
    if @status is 200
      boards = {}
      for board in @response.boards
        boards[board.board] = board
      $.set 'boardConfig', {boards, lastChecked: Date.now()}
    else
      {boards} = Conf['boardConfig']
      new Notice 'warning', "Failed to load board configuration data. Error #{@statusText} (#{@status})", 20
    BoardConfig.set boards

  set: (@boards) ->
    for ID, board of @boards
      g.boards[ID]?.config = board
    for cb in @cbs
      $.queueTask cb
    return

  ready: (cb) ->
    if @boards
      cb()
    else
      @cbs.push cb
