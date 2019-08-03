class CatalogThreadNative
  toString: -> @ID

  constructor: (root) ->
    @nodes =
      root:  root
      thumb: $(g.SITE.selectors.catalog.thumb, root)
    @siteID  = g.SITE.ID
    @boardID = @nodes.thumb.parentNode.pathname.split(/\/+/)[1]
    @board = g.boards[@boardID] or new Board(@boardID)
    @ID = @threadID = +(root.dataset.id or root.id).match(/\d*$/)[0]
    @thread = @board.threads.get(@ID) or new Thread(@ID, @board)
