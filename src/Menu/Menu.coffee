Menu =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Menu']

    @menu = new UI.Menu 'post'
    Post.callbacks.push
      name: 'Menu'
      cb:   @node

  node: ->
    if @isClone
      button = $ '.menu-button', @nodes.info
      $.on button, 'click', Menu.toggle
      return
    button = Menu.makeButton()
    $.add @nodes.info, [$.tn('\u00A0'), button]

  makeButton: do ->
    a = null
    ->
      a or= $.el 'a',
        className: 'menu-button'
        innerHTML: '[<i></i>]'
        href:      'javascript:;'
      button = a.cloneNode true
      $.on button, 'click', Menu.toggle
      button

  toggle: (e) ->
    try
      # Posts, inlined posts, hidden replies.
      post = Get.postFromNode @
    catch
      # Hidden threads.
      post = Get.threadFromNode(@).OP
    Menu.menu.toggle e, @, post
