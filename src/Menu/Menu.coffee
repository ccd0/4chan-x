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
    else
      $.add @nodes.info, [$.tn('\u00A0'), Menu.makeButton()]

  makeButton: do ->
    a = $.el 'a',
      className: 'menu-button brackets-wrap'
      innerHTML: '<span class=drop-marker></span>'
      href:      'javascript:;'
    ->
      button = a.cloneNode true
      $.on button, 'click', Menu.toggle
      button

  toggle: (e) ->
    Menu.menu.toggle e, @, Get.postFromNode @
