Menu = 
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Menu']

    @menu = new UI.Menu 'post'
    Post.callbacks.push
      name: 'Menu'
      cb:   @node

  node: ->
    if @isClone
      $.on $('.menu-button', @nodes.info), 'click', Menu.toggle
      return
    $.add @nodes.info, Menu.makeButton()

  makeButton: do ->
    a = $.el 'a',
      className: 'menu-button'
      href:      'javascript:;'
    $.extend a, <%= html('<i class="fa fa-angle-down"></i>') %>
    ->
      button = a.cloneNode true
      $.on button, 'click', Menu.toggle
      button

  toggle: (e) ->
    post = Get.postFromNode @
    Menu.menu.toggle e, @, post
