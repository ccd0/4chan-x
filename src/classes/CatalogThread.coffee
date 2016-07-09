class CatalogThread
  toString: -> @ID

  constructor: (root, @thread) ->
    @ID    = @thread.ID
    @board = @thread.board
    @nodes =
      root: root
      thumb:     $ '.catalog-thumb', root
      icons:     $ '.catalog-icons', root
      postCount: $ '.post-count',    root
      fileCount: $ '.file-count',    root
      pageCount: $ '.page-count',    root
      comment:   $ '.comment',       root
    @thread.catalogView = @
