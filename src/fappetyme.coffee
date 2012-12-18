FappeTyme = 
  init: ->
    el = $.el 'a'
      href: 'javascript:;'
      id:   'fappeTyme'
    $.on el, 'click', FappeTyme.toggle
    $.add $.id('navtopright'), el
    Main.callbacks.push @node

  node: (post) ->
    return if post.img
    post.el.parentElement.classList.add "noFile"

  toggle: ->
    d.body.classList.toggle 'fappeTyme'