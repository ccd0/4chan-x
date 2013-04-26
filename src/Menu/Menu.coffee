Menu =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Menu']

    @menu = new UI.Menu 'post'
    Post::callbacks.push
      name: 'Menu'
      cb:   @node

  node: ->
    button = Menu.makeButton @
    if @isClone
      $.replace $('.menu-button', @nodes.info), button
      return
    $.add @nodes.info, [$.tn('\u00A0'), button]

  makeButton: do ->
    a = null
    (post) ->
      a or= $.el 'a',
        className: 'menu-button'
        innerHTML: '[<i></i>]'
        href:      'javascript:;'
      clone = a.cloneNode true
      clone.setAttribute 'data-postid', post.fullID
      clone.setAttribute 'data-clone', true if post.isClone
      $.on clone, 'click', Menu.toggle
      clone

  toggle: (e) ->
    post =
      if @dataset.clone
        Get.postFromNode @
      else
        g.posts[@dataset.postid]
    Menu.menu.toggle e, @, post
