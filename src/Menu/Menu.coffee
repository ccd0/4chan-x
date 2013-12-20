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
      unless frag
        a = $.el 'a',
          className: 'menu-button'
          innerHTML: '[<i></i>]'
          href:      'javascript:;'
        frag = $.nodes [$.tn(' '), a]
      clone = frag.cloneNode true
      $.on clone.lastElementChild, 'click', Menu.toggle
      clone

  toggle: (e) ->
    try
      # Posts, inlined posts, hidden replies.
      post = Get.postFromNode @
    catch
      # Hidden threads.
      post = Get.threadFromNode(@).OP
    Menu.menu.toggle e, @, post
