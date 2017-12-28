BoardConfig =
  cbs: []

  init: ->
    now = Date.now()
    unless now - 2 * $.HOUR < (Conf['boardConfig'].lastChecked or 0) <= now and Conf['boardConfig'].troll_flags
      $.ajax "#{location.protocol}//a.4cdn.org/boards.json",
        onloadend: @load
    else
      {boards, troll_flags} = Conf['boardConfig']
      @set boards, troll_flags

  load: ->
    if @status is 200 and @response and @response.boards
      boards = {}
      for board in @response.boards
        boards[board.board] = board
      {troll_flags} = @response
      $.set 'boardConfig', {boards, troll_flags, lastChecked: Date.now()}
    else
      {boards, troll_flags} = Conf['boardConfig']
      err = switch @status
        when 0   then 'Connection Error'
        when 200 then 'Invalid Data'
        else          "Error #{@statusText} (#{@status})"
      new Notice 'warning', "Failed to load board configuration. #{err}", 20
    BoardConfig.set boards, troll_flags

  set: (@boards, @troll_flags) ->
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

  noAudio: (boardID) ->
    return false unless Site.software is 'yotsuba'
    boards = @boards or Conf['boardConfig'].boards
    boards and !boards[boardID].webm_audio
