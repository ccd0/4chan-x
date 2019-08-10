DeleteLink =
  auto: [$.dict(), $.dict()]

  init: ->
    return unless g.VIEW in ['index', 'thread'] and Conf['Menu'] and Conf['Delete Link']

    div = $.el 'div',
      className: 'delete-link'
      textContent: 'Delete'
    postEl = $.el 'a',
      className: 'delete-post'
      href: 'javascript:;'
    fileEl = $.el 'a',
      className: 'delete-file'
      href: 'javascript:;'
    @nodes =
      menu:  div.firstChild
      links: [postEl, fileEl]

    postEntry =
      el: postEl
      open: ->
        postEl.textContent = DeleteLink.linkText false
        $.on postEl, 'click', DeleteLink.toggle
        true
    fileEntry =
      el: fileEl
      open: ({file}) ->
        return false if !file or file.isDead
        fileEl.textContent = DeleteLink.linkText true
        $.on fileEl, 'click', DeleteLink.toggle
        true

    Menu.menu.addEntry
      el: div
      order: 40
      open: (post) ->
        return false if post.isDead
        DeleteLink.post = post
        DeleteLink.nodes.menu.textContent = DeleteLink.menuText()
        DeleteLink.cooldown.start post
        true
      subEntries: [postEntry, fileEntry]

  menuText: ->
    if seconds = DeleteLink.cooldown.seconds[DeleteLink.post.fullID]
      "Delete (#{seconds})"
    else
      'Delete'

  linkText: (fileOnly) ->
    text = if fileOnly then 'File' else 'Post'
    if DeleteLink.auto[+fileOnly][DeleteLink.post.fullID]
      text = "Deleting #{text.toLowerCase()}..."
    text

  toggle: ->
    {post} = DeleteLink
    fileOnly = $.hasClass @, 'delete-file'
    auto = DeleteLink.auto[+fileOnly]

    if auto[post.fullID]
      delete auto[post.fullID]
    else
      auto[post.fullID] = true
    @textContent = DeleteLink.linkText fileOnly

    unless DeleteLink.cooldown.seconds[post.fullID]
      DeleteLink.delete post, fileOnly

  delete: (post, fileOnly) ->
    link = DeleteLink.nodes.links[+fileOnly]
    delete DeleteLink.auto[+fileOnly][post.fullID]
    $.off link, 'click', DeleteLink.toggle if post.fullID is DeleteLink.post.fullID

    form =
      mode: 'usrdel'
      onlyimgdel: fileOnly
      pwd: QR.persona.getPassword()
    form[+post.ID] = 'delete'

    $.ajax $.id('delform').action.replace("/#{g.BOARD}/", "/#{post.board}/"),
      responseType: 'document'
      withCredentials: true
      onloadend: -> DeleteLink.load link, post, fileOnly, @response
      form: $.formData form

  load: (link, post, fileOnly, resDoc) ->
    unless resDoc
      new Notice 'warning', 'Connection error, please retry.', 20
      $.on link, 'click', DeleteLink.toggle if post.fullID is DeleteLink.post.fullID
      return

    link.textContent = DeleteLink.linkText fileOnly
    if resDoc.title is '4chan - Banned' # Ban/warn check
      el = $.el 'span', `<%= html('You can&#039;t delete posts because you are <a href="//www.4chan.org/banned" target="_blank">banned</a>.') %>`
      new Notice 'warning', el, 20
    else if msg = resDoc.getElementById 'errmsg' # error!
      new Notice 'warning', msg.textContent, 20
      $.on link, 'click', DeleteLink.toggle if post.fullID is DeleteLink.post.fullID
      if QR.cooldown.data and Conf['Cooldown'] and /\bwait\b/i.test(msg.textContent)
        DeleteLink.cooldown.start post, 5
        DeleteLink.auto[+fileOnly][post.fullID] = true
        DeleteLink.nodes.links[+fileOnly].textContent = DeleteLink.linkText fileOnly
    else
      QR.cooldown.delete post unless fileOnly
      if resDoc.title is 'Updating index...'
        # We're 100% sure.
        (post.origin or post).kill fileOnly
      link.textContent = 'Deleted' if post.fullID is DeleteLink.post.fullID

  cooldown:
    seconds: $.dict()

    start: (post, seconds) ->
      # Already counting.
      return if DeleteLink.cooldown.seconds[post.fullID]?

      seconds ?= QR.cooldown.secondsDeletion post
      if seconds > 0
        DeleteLink.cooldown.seconds[post.fullID] = seconds
        DeleteLink.cooldown.count post

    count: (post) ->
      DeleteLink.nodes.menu.textContent = DeleteLink.menuText() if post.fullID is DeleteLink.post.fullID
      if DeleteLink.cooldown.seconds[post.fullID] > 0 and Conf['Cooldown']
        DeleteLink.cooldown.seconds[post.fullID]--
        setTimeout DeleteLink.cooldown.count, 1000, post
      else
        delete DeleteLink.cooldown.seconds[post.fullID]
        for fileOnly in [false, true] when DeleteLink.auto[+fileOnly][post.fullID]
          DeleteLink.delete post, fileOnly
      return
