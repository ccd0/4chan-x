ReplyHideLink =
  init: ->
    # Fake reply hiding functionality if it is disabled.
    unless Conf['Reply Hiding']
      Main.callbacks.push @node

    a = $.el 'a',
      className: 'reply_hide_link'
      href: 'javascript:;'
      textContent: 'Hide / Restore Post'

    $.on a, 'click', ->
      menu   = $.id 'menu'
      id     = menu.dataset.id
      root   = $.id "pc#{id}"
      button = root.firstChild
      ReplyHiding.toggle button, root, id

    Menu.addEntry
      el: a
      open: (post) ->
        if post.isInlined or post.el.classList.contains 'op' then false else true

  node: (post) ->
    return if post.isInlined or post.ID is post.threadID

    if post.ID of g.hiddenReplies
      ReplyHiding.hide post.root