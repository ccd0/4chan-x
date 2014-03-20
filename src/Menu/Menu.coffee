Menu =
  init: ->
    return if !Conf['Menu']

    a = $.el 'a',
      className: 'menu-button'
      innerHTML: '<i class="fa fa-bars"></i>'
      href:      'javascript:;'
    @frag = $.nodes [$.tn(' '), a]

    @menu = new UI.Menu 'post'
    Post.callbacks.push
      name: 'Menu'
      cb:   @node
    CatalogThread.callbacks.push
      name: 'Menu'
      cb:   @catalogNode

  node: ->
    if @isClone
      $.on $('.menu-button', @nodes.info), 'click', Menu.toggle
      return
    $.add @nodes.info, Menu.makeButton()
  catalogNode: ->
    $.add @nodes.thumb, Menu.makeButton()

  makeButton: ->
    clone = Menu.frag.cloneNode true
    $.on clone.lastElementChild, 'click', Menu.toggle
    clone

  toggle: (e) ->
    fullID = $.x('ancestor::*[@data-full-i-d][1]', @).dataset.fullID
    Menu.menu.toggle e, @, g.posts[fullID]
