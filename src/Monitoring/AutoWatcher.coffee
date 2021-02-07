AutoWatcher =
  init: ->
    return unless Conf['Filter']

    AutoWatcher.periodicScan()

  periodicScan: ->
    clearTimeout AutoWatcher.timeout

    interval = 5 * $.MINUTE

    now = Date.now()

    unless Conf['autoWatchLastScan'] and (now - interval < Conf['autoWatchLastScan'])
      AutoWatcher.scan()
      $.set 'autoWatchLastScan', now
    AutoWatcher.timeout = setTimeout AutoWatcher.periodicScan, interval

  scan: ->
    sitesAndBoards = (for own _, filters of Filter.filters
      Object.keys(filter.boards) for filter in filters when filter.watch and filter.boards
    ).flat(2).reduce (acc, i) ->
      [_, k, v] = i.match(/(.*)\/(.*)/)
      acc[k] ?= []
      acc[k].push(v)
      acc
    , {}
    for own rawSite, boards of sitesAndBoards
      break unless site = g.sites[rawSite]
      for boardID in boards
        AutoWatcher.fetchCatalog(boardID, site, AutoWatcher.parseCatalog)

  fetchCatalog: (boardID, site, cb) ->
    return unless url = site.urls['catalogJSON']?({boardID})

    ajax = if site.ID is g.SITE.ID then $.ajax else CrossOrigin.ajax

    onLoadEnd = ->
      cb.apply @, [site, boardID]

    $.whenModified(
      url,
      'AutoWatcher'
      onLoadEnd,
      {timeout: $.MINUTE, ajax}
    )

  parseCatalog: (site, boardID) ->
    addedThreads = false
    rawCatalog = @.response.reduce ((acc, i, idx) ->
      threads = for thread in i.threads
        thread.extraData = {
          page: idx + 1,
          modified: thread.last_modified,
          replies: thread.replies,
          unread: thread.replies
        }
        if thread.last_replies
          thread.extraData.last = thread.last_replies[thread.last_replies.length - 1].no
        thread
      acc.concat(threads)
    ), []
    for thread in rawCatalog
      continue if ThreadWatcher.isWatchedRaw(boardID, thread.no)
      parsedThread = site.Build.parseJSON(thread, {siteID: site.ID, boardID})

      # Hacks for ThreadWatcher
      parsedThread.isDead = false
      parsedThread.board = {ID: boardID}
      Object.assign(parsedThread, thread.extraData)

      # I wish destructuring was actually pattern matching
      {watch} = Filter.test(parsedThread)
      continue unless watch

      excerptName = (
        parsedThread?.info?.subject or
        parsedThread?.info?.comment.replace(/\n+/g, ' // ') or
        parsedThread?.file?.name or
        "No.#{parsedThread.ID}"
      )
      excerpt = "/#{boardID}/ - #{excerptName}"
      excerpt = "#{excerpt[...70]}..." if excerpt.length > 73
      data = Object.assign(thread.extraData, {excerpt})
      ThreadWatcher.addRaw(boardID, parsedThread.ID, data, null, true)
      addedThreads = true
    # Check to see if we added any threads. If so, trigger a refresh AFTER we're done adding them all, to avoid spamming the API
    # We already give the ThreadWatcher most of what it needs, this is just to get things like lastPage coloring
    ThreadWatcher.buttonFetchAll() if addedThreads
