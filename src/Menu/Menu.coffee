Menu =
  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Menu']

    @button = $.el 'a',
      className: 'menu-button fourchan-x--icon icon--small'
      href:      'javascript:;'

    $.extend @button, <%= html('<svg xmlns="http://www.w3.org/2000/svg" class="svg-inline--fa fa-angle-down fa-w-10" viewBox="0 0 320 512"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"/></svg>') %>

    @menu = new UI.Menu 'post'
    Callbacks.Post.push
      name: 'Menu'
      cb:   @node

    Callbacks.CatalogThread.push
      name: 'Menu'
      cb:   @catalogNode

  node: ->
    if @isClone
      button = $ '.menu-button', @nodes.info
      $.rmClass button, 'active'
      $.rm $('.dialog', button)
      Menu.makeButton @, button
      return
    $.add @nodes.info, Menu.makeButton @

  catalogNode: ->
    $.after @nodes.icons, Menu.makeButton @thread.OP

  makeButton: (post, button) ->
    button or= Menu.button.cloneNode true
    $.on button, 'click', (e) ->
      Menu.menu.toggle e, @, post
    button
