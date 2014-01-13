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
      innerHTML: '<i class=fa>\uf107</i>'
      href:      'javascript:;'
    ->
      clone = a.cloneNode true
      $.on clone, 'click', Menu.toggle
      clone

  toggle: (e) ->
    Menu.menu.toggle e, @, Get.postFromNode @
