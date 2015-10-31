ThreadLinks =
  init: ->
    return unless g.VIEW is 'index' and Conf['Open Threads in New Tab']

    Post.callbacks.push
      name: 'Thread Links'
      cb:   @node
    CatalogThread.callbacks.push
      name: 'Thread Links'
      cb:   @catalogNode

  node: ->
    return if @isReply or @isClone
    ThreadLinks.process $('.replylink', @nodes.info)

  catalogNode: ->
    ThreadLinks.process @nodes.thumb.parentNode

  process: (link) ->
    link.target = '_blank'
