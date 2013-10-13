ThreadExcerpt =
  init: ->
    return if g.VIEW isnt 'thread' or !Conf['Thread Excerpt']

    Thread.callbacks.push
      name: 'Thread Excerpt'
      cb:   @node
  node: ->
    d.title = Get.threadExcerpt @
