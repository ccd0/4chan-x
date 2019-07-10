class DataBoard
  @keys = ['hiddenThreads', 'hiddenPosts', 'lastReadPosts', 'yourPosts', 'watchedThreads', 'watcherLastModified', 'customTitles']

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

  initData: (@data) ->
    if @data.boards
      {boards, lastChecked} = @data
      @data['4chan.org'] = {boards, lastChecked}
      delete @data.boards
      delete @data.lastChecked
    @data[g.SITE.ID] or= boards: {}

  changes: []

  save: (change, cb) ->
    change()
    @changes.push change
    $.get @key, {boards: {}}, (items) =>
      return unless @changes.length
      needSync = ((items[@key].version or 0) > (@data.version or 0))
      if needSync
        @initData items[@key]
        change() for change in @changes
      @changes = []
      @data.version = (@data.version or 0) + 1
      $.set @key, @data, =>
        @sync?() if needSync
        cb?()

  forceSync: (cb) ->
    $.get @key, {boards: {}}, (items) =>
      if (items[@key].version or 0) > (@data.version or 0)
        @initData items[@key]
        change() for change in @changes
        @sync?()
      cb?()

  delete: ({siteID, boardID, threadID, postID}) ->
    siteID or= g.SITE.ID
    return unless @data[siteID]
    @save =>
      if postID
        return unless @data[siteID].boards[boardID]?[threadID]
        delete @data[siteID].boards[boardID][threadID][postID]
        @deleteIfEmpty {siteID, boardID, threadID}
      else if threadID
        return unless @data[siteID].boards[boardID]
        delete @data[siteID].boards[boardID][threadID]
        @deleteIfEmpty {siteID, boardID}
      else
        delete @data[siteID].boards[boardID]

  deleteIfEmpty: ({siteID, boardID, threadID}) ->
    return unless @data[siteID]
    if threadID
      unless Object.keys(@data[siteID].boards[boardID][threadID]).length
        delete @data[siteID].boards[boardID][threadID]
        @deleteIfEmpty {siteID, boardID}
    else unless Object.keys(@data[siteID].boards[boardID]).length
      delete @data[siteID].boards[boardID]

  set: (data, cb) ->
    @save =>
      @setUnsafe data
    , cb

  setUnsafe: ({siteID, boardID, threadID, postID, val}) ->
    siteID or= g.SITE.ID
    @data[siteID] or= boards: {}
    if postID isnt undefined
      ((@data[siteID].boards[boardID] or= {})[threadID] or= {})[postID] = val
    else if threadID isnt undefined
      (@data[siteID].boards[boardID] or= {})[threadID] = val
    else
      @data[siteID].boards[boardID] = val

  extend: ({siteID, boardID, threadID, postID, val}, cb) ->
    @save =>
      oldVal = @get {siteID, boardID, threadID, postID, defaultValue: {}}
      for key, subVal of val
        if typeof subVal is 'undefined'
          delete oldVal[key]
        else
          oldVal[key] = subVal
      @setUnsafe {siteID, boardID, threadID, postID, val: oldVal}
    , cb

  setLastChecked: (key='lastChecked') ->
    @save =>
      @data[key] = Date.now()

  get: ({siteID, boardID, threadID, postID, defaultValue}) ->
    siteID or= g.SITE.ID
    if board = @data[siteID]?.boards[boardID]
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
    siteID = g.SITE.ID
    for boardID, val of @data[siteID].boards
      @deleteIfEmpty {siteID, boardID}
    now = Date.now()
    unless now - 2 * $.HOUR < (@data[siteID].lastChecked or 0) <= now
      @data[siteID].lastChecked = now
      for boardID of @data[siteID].boards
        @ajaxClean boardID
    return

  ajaxClean: (boardID) ->
    that = @
    siteID = g.SITE.ID
    threadsList = g.SITE.urls.threadsListJSON?({siteID, boardID})
    return unless threadsList
    $.cache threadsList, ->
      return unless @status is 200
      archiveList = g.SITE.urls.archiveListJSON?({siteID, boardID})
      return that.ajaxCleanParse(boardID, @response) unless archiveList
      response1 = @response
      $.cache archiveList, ->
        return unless @status is 200
        that.ajaxCleanParse(boardID, response1, @response)

  ajaxCleanParse: (boardID, response1, response2) ->
    siteID = g.SITE.ID
    return if not (board = @data[siteID].boards[boardID])
    threads = {}
    if response1
      for page in response1
        for thread in page.threads
          ID = thread.no
          threads[ID] = board[ID] if ID of board
    if response2
      for ID in response2
        threads[ID] = board[ID] if ID of board
    @data[siteID].boards[boardID] = threads
    @deleteIfEmpty {siteID, boardID}
    $.set @key, @data

  onSync: (data) =>
    return unless (data.version or 0) > (@data.version or 0)
    @initData data
    @sync?()
