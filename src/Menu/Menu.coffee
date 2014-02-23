Menu = 
  init: ->
    return if !Conf['Menu']

    a = $.el 'a',
      className: 'menu-button'
      innerHTML: '<i class="fa fa-bars"></i>'
      href:      'javascript:;'

    @menu = new UI.Menu 'post'
    Post.callbacks.push
      name: 'Menu'
      cb:   @node

    CatalogThread.callbacks.push
      name: 'Menu'
      cb:   @catalogNode

  node: ->
    if @isClone
      $.on $('.menu-button', @nodes.info), 'click', Menu.toggle
      return
    $.add @nodes.info, Menu.makeButton()
  catalogNode: ->
    $.add @nodes.thumb, Menu.makeButton()

  makeButton: do ->
    a = $.el 'a',
      className: 'menu-button'
      innerHTML: '<i class="fa fa-angle-down"></i>'
      href:      'javascript:;'
    ->
      button = a.cloneNode true
      $.on button, 'click', Menu.toggle
      button

  toggle: (e) ->
    try
      # Posts, inlined posts, hidden replies.
      post = Get.postFromNode @
    catch
      post = if fullID = @parentNode.parentNode.dataset.fullID
        g.threads[fullID].OP
      else
        # Hidden threads.
        Get.threadFromNode(@).OP
    Menu.menu.toggle e, @, post
