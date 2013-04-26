class Board
  toString: -> @ID

  constructor: (@ID) ->
    @threads = {}
    @posts   = {}

    g.boards[@] = @
