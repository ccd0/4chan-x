class DataBoard
  @keys = ['hiddenThreads', 'hiddenPosts', 'lastReadPosts', 'yourPosts', 'watchedThreads', 'customTitles']

  constructor: (@key, sync, dontClean) ->
    @initData Conf[@key]
    $.sync @key, @onSync
    @clean() unless dontClean
    return unless sync
    # Chrome also fires the onChanged callback on the current tab,
    # so we only start syncing when we're ready.
    init = =>
      $.off d, '4chanXInitFinished', init
      @sync = sync
    $.on d, '4chanXInitFinished', init

  initData: (@allData) ->
    if Site.hostname is '4chan.org' and @allData.boards
      @data = @allData
    else
      @data = (@allData[Site.hostname] or= boards: {})

  changes: []

  save: (change, cb) ->
    snapshot1 = JSON.stringify @allData
    change()
    {changes} = @
    changes.push change
    $.get @key, {boards: {}}, (items) =>
      @initData items[@key]
      snapshot2 = JSON.stringify @allData
      c() for c in changes
      $.set @key, @allData, =>
        @changes = []
        @sync?() if snapshot1 isnt snapshot2
        cb?()

  forceSync: (cb) ->
    snapshot1 = JSON.stringify @allData
    {changes} = @
    $.get @key, {boards: {}}, (items) =>
      @initData items[@key]
      snapshot2 = JSON.stringify @allData
      c() for c in changes
      @sync?() if snapshot1 isnt snapshot2
      cb?()

  delete: ({boardID, threadID, postID}) ->
    @save =>
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

  deleteIfEmpty: ({boardID, threadID}) ->
    if threadID
      unless Object.keys(@data.boards[boardID][threadID]).length
        delete @data.boards[boardID][threadID]
        @deleteIfEmpty {boardID}
    else unless Object.keys(@data.boards[boardID]).length
      delete @data.boards[boardID]

  set: (data, cb) ->
    @save =>
      @setUnsafe data
    , cb

  setUnsafe: ({boardID, threadID, postID, val}) ->
    if postID isnt undefined
      ((@data.boards[boardID] or= {})[threadID] or= {})[postID] = val
    else if threadID isnt undefined
      (@data.boards[boardID] or= {})[threadID] = val
    else
      @data.boards[boardID] = val

  extend: ({boardID, threadID, postID, val, rm}, cb) ->
    @save =>
      oldVal = @get {boardID, threadID, postID, val: {}}
      delete oldVal[key] for key in rm or []
      $.extend oldVal, val
      @setUnsafe {boardID, threadID, postID, val: oldVal}
    , cb

  setLastChecked: ->
    @save =>
      @data.lastChecked = Date.now()

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

  clean: ->
    # XXX not yet multisite ready
    return unless Site.software is 'yotsuba'

    for boardID, val of @data.boards
      @deleteIfEmpty {boardID}

    now = Date.now()
    unless now - 2 * $.HOUR < (@data.lastChecked or 0) <= now
      @data.lastChecked = now
      for boardID of @data.boards
        @ajaxClean boardID
    return

  ajaxClean: (boardID) ->
    $.cache "#{location.protocol}//a.4cdn.org/#{boardID}/threads.json", (e1) =>
      return unless e1.target.status in [200, 404]
      $.cache "#{location.protocol}//a.4cdn.org/#{boardID}/archive.json", (e2) =>
        return unless e2.target.status in [200, 404]
        @ajaxCleanParse boardID, e1.target.response, e2.target.response

  ajaxCleanParse: (boardID, response1, response2) ->
    return if not (board = @data.boards[boardID])
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
    $.set @key, @allData

  onSync: (data) =>
    @initData data
    @sync?()
