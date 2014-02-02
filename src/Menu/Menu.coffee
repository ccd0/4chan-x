Menu = 
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Menu']

    @button = $.el 'a',
      className: 'menu-button'
      href:      'javascript:;'
    $.extend @button, <%= html('<i class="fa fa-angle-down"></i>') %>

    @menu = new UI.Menu 'post'
    Post.callbacks.push
      name: 'Menu'
      cb:   @node
    CatalogThread.callbacks.push
      name: 'Image Hover'
      cb:   @catalogNode

  node: ->
    if @isClone
      $.on $('.menu-button', @nodes.info), 'click', Menu.toggle
      return
    $.add @nodes.info, Menu.makeButton()

  catalogNode: ->
    $.add @nodes.icons, Menu.makeButton()

  makeButton: ->
    clone = Menu.button.cloneNode true
    $.on clone, 'click', Menu.toggle
    clone

  toggle: (e) ->
    try
      post = Get.postFromNode @
    catch
      fullID = @parentNode.parentNode.parentNode.dataset.fullID
      post = g.threads[fullID].OP
    Menu.menu.toggle e, @, post
