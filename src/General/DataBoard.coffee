class DataBoard
  @keys = ['pinnedThreads', 'hiddenThreads', 'hiddenPosts', 'lastReadPosts', 'yourPosts', 'watchedThreads']

  constructor: (@key, sync, dontClean) ->
    @data = Conf[key]
    $.sync key, @onSync
    @clean() unless dontClean
    return unless sync
    # Chrome also fires the onChanged callback on the current tab,
    # so we only start syncing when we're ready.
    init = =>
      $.off d, '4chanXInitFinished', init
      @sync = sync
    $.on d, '4chanXInitFinished', init

  save: ->
    $.set @key, @data
  delete: ({boardID, threadID, postID}) ->
    if postID
      delete @data.boards[boardID][threadID][postID]
      @deleteIfEmpty {boardID, threadID}
    else if threadID
      delete @data.boards[boardID][threadID]
      @deleteIfEmpty {boardID}
    else
      delete @data.boards[boardID]
    @save()
  deleteIfEmpty: ({boardID, threadID}) ->
    if threadID
      unless Object.keys(@data.boards[boardID][threadID]).length
        delete @data.boards[boardID][threadID]
        @deleteIfEmpty {boardID}
    else unless Object.keys(@data.boards[boardID]).length
      delete @data.boards[boardID]
  set: ({boardID, threadID, postID, val}) ->
    if postID isnt undefined
      ((@data.boards[boardID] or= {})[threadID] or= {})[postID] = val
    else if threadID isnt undefined
      (@data.boards[boardID] or= {})[threadID] = val
    else
      @data.boards[boardID] = val
    @save()
  get: ({boardID, threadID, postID, defaultValue}) ->
    if board = @data.boards[boardID]
      unless threadID
        if postID
          for ID, thread in board
            if postID of thread
              val = thread[postID]
              break
        else
          val = board
      else if thread = board[threadID]
        val = if postID
          thread[postID]
        else
          thread
    val or defaultValue

  clean: ->
    now = Date.now()
    return if (@data.lastChecked or 0) > now - 2 * $.HOUR

    for boardID of @data.boards
      @deleteIfEmpty {boardID}
      @ajaxClean boardID if boardID of @data.boards

    @data.lastChecked = now
    @save()
  ajaxClean: (boardID) ->
    $.cache "//a.4cdn.org/#{boardID}/threads.json", (e) =>
      if e.target.status isnt 200
        @delete {boardID} if e.target.status is 404
        return
      board   = @data.boards[boardID]
      threads = {}
      for page in e.target.response
        for thread in page.threads when thread.no of board
          threads[thread.no] = board[thread.no]
      count = Object.keys(threads).length
      return if count is Object.keys(board).length # Nothing changed.
      if count
        @set {boardID, val: threads}
      else
        @delete {boardID}

  onSync: (data) =>
    @data = data or boards: {}
    @sync?()
