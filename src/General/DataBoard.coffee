DataBoards = ['hiddenThreads', 'hiddenPosts', 'lastReadPosts', 'yourPosts', 'watchedThreads']

class DataBoard
  constructor: (@key, sync, dontClean) ->
    @data = Conf[key]
    $.sync key, @onSync.bind @
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
    for boardID, val of @data.boards
      @deleteIfEmpty {boardID}

    now = Date.now()
    if (@data.lastChecked or 0) < now - 2 * $.HOUR
      @data.lastChecked = now
      for boardID of @data.boards
        @ajaxClean boardID

    @save()
  ajaxClean: (boardID) ->
    $.cache "//api.4chan.org/#{boardID}/threads.json", (e) =>
      if e.target.status is 404
        # Deleted board.
        @delete boardID
      else if e.target.status is 200
        board   = @data.boards[boardID]
        threads = {}
        for page in JSON.parse e.target.response
          for thread in page.threads
            if thread.no of board
              threads[thread.no] = board[thread.no]
        @data.boards[boardID] = threads
        @deleteIfEmpty {boardID}
      @save()

  onSync: (data) ->
    @data = data or boards: {}
    @sync?()
