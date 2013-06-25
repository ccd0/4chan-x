Menu =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Menu']

    @menu = new UI.Menu 'post'
    Post::callbacks.push
      name: 'Menu'
      cb:   @node

  node: ->
    if @isClone
      button = $ '.menu-button', @nodes.info
    else
      button = Menu.makeButton @
      $.add @nodes.info, [$.tn('\u00A0'), button]
    $.on button, 'click', Menu.toggle

  makeButton: do ->
    a = null
    ->
      a or= $.el 'a',
        className: 'menu-button'
        innerHTML: '[<i></i>]'
        href:      'javascript:;'
      a.cloneNode true

  toggle: (e) ->
    Menu.menu.toggle e, @, Get.postFromNode @
