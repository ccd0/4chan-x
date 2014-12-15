Menu = 
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Menu']

    @button = $.el 'a',
      className: 'menu-button'
      href:      'javascript:;'
    $.extend @button, <%= html('<i class="fa fa-bars"></i>') %>

    @menu = new UI.Menu 'post'
    Post.callbacks.push
      name: 'Menu'
      cb:   @node
    CatalogThread.callbacks.push
      name: 'Menu'
      cb:   @catalogNode

  node: ->
    if @isClone
      Menu.makeButton @, $('.menu-button', @nodes.info)
      return
    $.add @nodes.info, Menu.makeButton @

  catalogNode: ->
    $.after @nodes.icons, Menu.makeButton @thread.OP

  makeButton: (post, button) ->
    button or= Menu.button.cloneNode true
    $.on button, 'click', (e) ->
      Menu.menu.toggle e, @, post
    button
