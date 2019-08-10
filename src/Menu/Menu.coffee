Menu =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Menu']

    @button = $.el 'a',
      className: 'menu-button fourchan-x--icon icon--small'
      href:      'javascript:;'

    $.extend @button, `<%= html('&{Icons.angle_down}') %>`

    @menu = new UI.Menu 'post'
    Callbacks.Post.push
      name: 'Menu'
      cb:   @node

    Callbacks.CatalogThread.push
      name: 'Menu'
      cb:   @catalogNode

  node: ->
    if @isClone
      button = $ '.menu-button', @nodes.info
      $.rmClass button, 'active'
      $.rm $('.dialog', button)
      Menu.makeButton @, button
      return
    $.add @nodes.info, Menu.makeButton @

  catalogNode: ->
    $.after @nodes.icons, Menu.makeButton @thread.OP

  makeButton: (post, button) ->
    button or= Menu.button.cloneNode true
    $.on button, 'click', (e) ->
      Menu.menu.toggle e, @, post
    button
