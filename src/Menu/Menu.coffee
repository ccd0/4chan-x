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
      innerHTML: '<i></i>'
      href:      'javascript:;'
    ->
      button = a.cloneNode true
      $.on button, 'click', Menu.toggle
      button

  toggle: (e) ->
    post = Get.postFromNode @
    Menu.menu.toggle e, @, post
