class Board
  toString: -> @ID

  constructor: (@ID) ->
    @threads = new SimpleDict()
    @posts   = new SimpleDict()

    g.boards[@] = @
