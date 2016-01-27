class Board
  toString: -> @ID

  constructor: (@ID) ->
    @threads = new SimpleDict()
    @posts   = new SimpleDict()
    @json    = BoardsJSON.boards?[@ID]

    g.boards[@] = @
