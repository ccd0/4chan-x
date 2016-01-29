class Board
  toString: -> @ID

  constructor: (@ID) ->
    @threads = new SimpleDict()
    @posts   = new SimpleDict()
    @config  = BoardConfig.boards?[@ID]

    g.boards[@] = @
