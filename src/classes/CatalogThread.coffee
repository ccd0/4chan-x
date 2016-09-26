class CatalogThread
  toString: -> @ID

  constructor: (root, @thread) ->
    @ID    = @thread.ID
    @board = @thread.board
    {post} = @thread.OP.nodes
    @nodes =
      root: root
      thumb:     $ '.catalog-thumb', post
      icons:     $ '.catalog-icons', post
      postCount: $ '.post-count',    post
      fileCount: $ '.file-count',    post
      pageCount: $ '.page-count',    post
    @thread.catalogView = @
