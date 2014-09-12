CatalogHiding =
  init: ->
    return if g.VIEW isnt 'catalog' or !Conf['Hide Threads in 4chan\'s Catalog']
    @db = new DataBoard 'hiddenThreads'
    # 4chan catalog code also runs on DOMContentLoaded, but we register first.
    $.ready @ready

  # Parse script tag where catalog data is set.
  # It contains statements of the form
  #   var [variable name] = [JSON expression];
  catalog: ->
    scriptText = ''
    for script in $$ 'script', d.head
      if /^\s+var\b/.test script.textContent
        scriptText = script.textContent
        break
    regexp = /\b(\S+)\s*=\s*((?:[^;"]+|"(?:[^"\\]+|\\.)*")+)/g
    while result = regexp.exec scriptText
      if result[1] is 'catalog'
        return JSON.parse result[2]
    null

  ready: ->
    # Convert hidden thread list to 4chan's format.
    hiddenThreads = CatalogHiding.hiddenThreads = CatalogHiding.db.get
      boardID: g.BOARD.ID
      defaultValue: {}
    hiddenThreads[threadID] = true for threadID of hiddenThreads

    # Add filtered threads.
    if Conf['Filter']
      if catalog = CatalogHiding.catalog()
        for threadID, o of catalog.threads
          hidden = Filter.testObject
            isReply:  false
            name:     Build.unescape o.author
            tripcode: o.trip
            capcode:  if o.capcode then o.capcode[0].toUpperCase() + o.capcode[1..]
            subject:  Build.unescape (o.sub or undefined)
            comment:  Build.unescape o.teaser
            filename: Build.unescape o.file
          hiddenThreads[threadID] = true if hidden
      else
        new Notice 'error', 'Could not parse catalog data', 30

    localStorage.setItem "4chan-hide-t-#{g.BOARD}", JSON.stringify hiddenThreads

    # 4chan sets CSS display to "none" when hiding or unhiding a thread.
    new MutationObserver(CatalogHiding.update).observe $.id('threads'),
      attributes: true
      subtree: true
      attributeFilter: ['style']

  # Save threads hidden or unhidden in the catalog.
  update: ->
    hiddenThreads2 = JSON.parse localStorage.getItem "4chan-hide-t-#{g.BOARD}"
    for threadID of hiddenThreads2 when !(threadID of CatalogHiding.hiddenThreads)
      CatalogHiding.db.set
        boardID:  g.BOARD.ID
        threadID: threadID
        val:      {makeStub: Conf['Stubs']}
    for threadID of CatalogHiding.hiddenThreads when !(threadID of hiddenThreads2)
      CatalogHiding.db.delete
        boardID:  g.BOARD.ID
        threadID: threadID
    CatalogHiding.hiddenThreads = hiddenThreads2
