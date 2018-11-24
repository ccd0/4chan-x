ThreadLinks =
  init: ->
    return unless g.VIEW is 'index' and Conf['Open Threads in New Tab']

    Callbacks.Post.push
      name: 'Thread Links'
      cb:   @node
    Callbacks.CatalogThread.push
      name: 'Thread Links'
      cb:   @catalogNode

  node: ->
    return if @isReply or @isClone
    ThreadLinks.process @nodes.reply

  catalogNode: ->
    ThreadLinks.process @nodes.thumb.parentNode

  process: (link) ->
    link.target = '_blank'
