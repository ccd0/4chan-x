class Thread
  @callbacks = []
  toString: -> @ID

  constructor: (@ID, @board) ->
    @fullID = "#{@board}.#{@ID}"
    @posts  = {}

    g.threads[@fullID] = board.threads[@] = @

  kill: ->
    @isDead = true
    @timeOfDeath = Date.now()

  collect: ->
    for postID, post in @posts
      post.collect()
    delete g.threads[@fullID]
    delete @board.threads[@]
