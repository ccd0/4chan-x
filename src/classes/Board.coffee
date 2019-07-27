class Board
  toString: -> @ID

  constructor: (@ID) ->
    @boardID = @ID
    @siteID  = g.SITE.ID
    @threads = new SimpleDict()
    @posts   = new SimpleDict()
    @config  = BoardConfig.boards?[@ID] or {}

    g.boards[@] = @

  cooldowns: ->
    c2 = (@config or {}).cooldowns or {}
    c =
      thread: c2.threads or 0
      reply:  c2.replies or 0
      image:  c2.images  or 0
      thread_global: 300 # inter-board thread cooldown
    # Pass users have reduced cooldowns.
    if d.cookie.indexOf('pass_enabled=1') >= 0
      for key in ['reply', 'image']
        c[key] = Math.ceil(c[key] / 2)
    c
