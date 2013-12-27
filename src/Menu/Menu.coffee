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
    frag = null
    ->
      unless frag?
        frag = $.nodes [
          $.tn(' ')
          $.el 'a',
            className: 'menu-button'
            innerHTML: '[<i></i>]'
            href:      'javascript:;'
          ]
      clone = frag.cloneNode true
      $.on clone.lastElementChild, 'click', Menu.toggle
      clone

  toggle: (e) ->
    post = Get.postFromNode @
    Menu.menu.toggle e, @, post
