BoardConfig =
  cbs: []

  init: ->
    if (Conf['boardConfig'].lastChecked or 0) < Date.now() - 2 * $.HOUR
      $.ajax '//a.4cdn.org/boards.json',
        onloadend: @load
    else
      @set Conf['boardConfig'].boards

  load: ->
    if @status is 200 and @response and @response.boards
      boards = {}
      for board in @response.boards
        boards[board.board] = board
      $.set 'boardConfig', {boards, lastChecked: Date.now()}
    else
      {boards} = Conf['boardConfig']
      err = switch @status
        when 0   then 'Connection Error'
        when 200 then 'Invalid Data'
        else          "Error #{@statusText} (#{@status})"
      new Notice 'warning', "Failed to load board configuration. #{err}", 20
    BoardConfig.set boards

  set: (@boards) ->
    for ID, board of g.boards
      board.config = @boards[ID] or {}
    for cb in @cbs
      $.queueTask cb
    return

  ready: (cb) ->
    if @boards
      cb()
    else
      @cbs.push cb

  sfwBoards: (sfw) ->
    board for board, data of (@boards or Conf['boardConfig'].boards) when !!data.ws_board is sfw
