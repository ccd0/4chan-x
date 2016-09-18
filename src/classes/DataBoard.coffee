class DataBoard
  @keys = ['hiddenThreads', 'hiddenPosts', 'lastReadPosts', 'yourPosts', 'watchedThreads', 'customTitles']

  constructor: (@key, sync, dontClean) ->
    @data = Conf[@key]
    $.sync @key, @onSync
    @clean() unless dontClean
    return unless sync
    # Chrome also fires the onChanged callback on the current tab,
    # so we only start syncing when we're ready.
    init = =>
      $.off d, '4chanXInitFinished', init
      @sync = sync
    $.on d, '4chanXInitFinished', init

  save: (cb) -> $.set @key, @data, cb

  delete: ({boardID, threadID, postID}) ->
    $.forceSync @key
    if postID
      return unless @data.boards[boardID]?[threadID]
      delete @data.boards[boardID][threadID][postID]
      @deleteIfEmpty {boardID, threadID}
    else if threadID
      return unless @data.boards[boardID]
      delete @data.boards[boardID][threadID]
      @deleteIfEmpty {boardID}
    else
      delete @data.boards[boardID]
    @save()

  deleteIfEmpty: ({boardID, threadID}) ->
    $.forceSync @key
    if threadID
      unless Object.keys(@data.boards[boardID][threadID]).length
        delete @data.boards[boardID][threadID]
        @deleteIfEmpty {boardID}
    else unless Object.keys(@data.boards[boardID]).length
      delete @data.boards[boardID]

  set: (data, cb) ->
    $.forceSync @key
    @setUnsafe data, cb

  setUnsafe: ({boardID, threadID, postID, val}, cb) ->
    if postID isnt undefined
      ((@data.boards[boardID] or= {})[threadID] or= {})[postID] = val
    else if threadID isnt undefined
      (@data.boards[boardID] or= {})[threadID] = val
    else
      @data.boards[boardID] = val
    @save cb

  extend: ({boardID, threadID, postID, val}, cb) ->
    $.forceSync @key
    oldVal = @get {boardID, threadID, postID, val: {}}
    $.extend oldVal, val
    @setUnsafe {boardID, threadID, postID, val: oldVal}, cb

  get: ({boardID, threadID, postID, defaultValue}) ->
    if board = @data.boards[boardID]
      unless threadID?
        if postID?
          for ID, thread in board
            if postID of thread
              val = thread[postID]
              break
        else
          val = board
      else if thread = board[threadID]
        val = if postID?
          thread[postID]
        else
          thread
    val or defaultValue

  forceSync: ->
    $.forceSync @key

  clean: ->
    $.forceSync @key
    for boardID, val of @data.boards
      @deleteIfEmpty {boardID}

    now = Date.now()
    if (@data.lastChecked or 0) < now - 2 * $.HOUR
      @data.lastChecked = now
      for boardID of @data.boards
        @ajaxClean boardID
    return

  ajaxClean: (boardID) ->
    $.cache "//a.4cdn.org/#{boardID}/threads.json", (e1) =>
      return unless e1.target.status in [200, 404]
      $.cache "//a.4cdn.org/#{boardID}/archive.json", (e2) =>
        return unless e2.target.status in [200, 404]
        @ajaxCleanParse boardID, e1.target.response, e2.target.response

  ajaxCleanParse: (boardID, response1, response2) ->
    return unless (board = @data.boards[boardID])
    threads = {}
    if response1
      for page in response1
        for thread in page.threads
          ID = thread.no
          threads[ID] = board[ID] if ID of board
    if response2
      for ID in response2
        threads[ID] = board[ID] if ID of board
    @data.boards[boardID] = threads
    @deleteIfEmpty {boardID}
    @save()

  onSync: (data) =>
    @data = data or boards: {}
    @sync?()
