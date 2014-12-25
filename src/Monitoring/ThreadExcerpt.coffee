ThreadExcerpt =
  init: ->
    return if (g.BOARD.ID isnt 'f' and g.BOARD.ID isnt 'pol') or g.VIEW isnt 'thread' or !Conf['Thread Excerpt'] or Conf['Remove Thread Excerpt']

    Thread.callbacks.push
      name: 'Thread Excerpt'
      cb:   @node
  node: -> d.title = Get.threadExcerpt @
