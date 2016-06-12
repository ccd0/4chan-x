ThreadExcerpt =
  init: ->
    return if g.BOARD.ID isnt 'f' or g.VIEW isnt 'thread' or !Conf['Thread Excerpt']

    Callbacks.Thread.push
      name: 'Thread Excerpt'
      cb:   @node
  node: -> d.title = Get.threadExcerpt @
