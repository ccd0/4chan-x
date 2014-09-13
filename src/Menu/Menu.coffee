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

  node: ->
    if @isClone
      $.on $('.menu-button', @nodes.info), 'click', Menu.toggle
      return
    $.add @nodes.info, Menu.makeButton()

  makeButton: ->
    clone = Menu.button.cloneNode true
    $.on clone, 'click', Menu.toggle
    clone

  toggle: (e) ->
    post = Get.postFromNode @
    Menu.menu.toggle e, @, post
