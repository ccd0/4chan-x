Menu = do ->
  a = $.el 'a',
    className: 'menu-button brackets-wrap'
    innerHTML: '<span class=drop-marker></span>'
    href:      'javascript:;'

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
      button = a.cloneNode true
      $.add @nodes.info, [$.tn('\u00A0'), button]
    $.on button, 'click', Menu.toggle

  makeButton: ->
    el = a.cloneNode true
    $.on el, 'click', Menu.toggle
    el

  toggle: (e) ->
    Menu.menu.toggle e, @, Get.postFromNode @
  