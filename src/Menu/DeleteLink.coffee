DeleteLink =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Menu'] or !Conf['Delete Link']

    div = $.el 'div',
      className: 'delete-link'
      textContent: 'Delete'
    postEl = $.el 'a',
      className: 'delete-post'
      href: 'javascript:;'
    fileEl = $.el 'a',
      className: 'delete-file'
      href: 'javascript:;'

    postEntry =
      el: postEl
      open: ->
        postEl.textContent = 'Post'
        $.on postEl, 'click', DeleteLink.delete
        true
    fileEntry =
      el: fileEl
      open: ({file}) ->
        return false if !file or file.isDead
        fileEl.textContent = 'File'
        $.on fileEl, 'click', DeleteLink.delete
        true

    $.event 'AddMenuEntry',
      type: 'post'
      el: div
      order: 40
      open: (post) ->
        return false if post.isDead or post.board.ID is 'q'
        DeleteLink.post = post
        node = div.firstChild
        node.textContent = 'Delete'
        DeleteLink.cooldown.start post, node
        true
      subEntries: [postEntry, fileEntry]

  delete: ->
    {post} = DeleteLink
    return if DeleteLink.cooldown.counting is post

    $.off @, 'click', DeleteLink.delete
    fileOnly = $.hasClass @, 'delete-file'
    @textContent = "Deleting #{if fileOnly then 'file' else 'post'}..."

    form =
      mode: 'usrdel'
      onlyimgdel: fileOnly
      pwd: QR.persona.getPassword()
    form[post.ID] = 'delete'

    link = @
    $.ajax $.id('delform').action.replace("/#{g.BOARD}/", "/#{post.board}/"),
      onload:  -> DeleteLink.load  link, post, fileOnly, @response
      onerror: -> DeleteLink.error link
    ,
      cred: true
      form: $.formData form
  load: (link, post, fileOnly, html) ->
    tmpDoc = d.implementation.createHTMLDocument ''
    tmpDoc.documentElement.innerHTML = html
    if tmpDoc.title is '4chan - Banned' # Ban/warn check
      s = 'Banned!'
    else if msg = tmpDoc.getElementById 'errmsg' # error!
      s = msg.textContent
      $.on link, 'click', DeleteLink.delete
    else
      if tmpDoc.title is 'Updating index...'
        # We're 100% sure.
        (post.origin or post).kill fileOnly
      s = 'Deleted'
    link.textContent = s
  error: (link) ->
    link.textContent = 'Connection error, please retry.'
    $.on link, 'click', DeleteLink.delete

  cooldown:
    start: (post, node) ->
      unless QR.db?.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}
        # Only start counting on our posts.
        delete DeleteLink.cooldown.counting
        return
      DeleteLink.cooldown.counting = post
      length = 30
      seconds = Math.ceil (length * $.SECOND - (Date.now() - post.info.date)) / $.SECOND
      DeleteLink.cooldown.count post, seconds, length, node
    count: (post, seconds, length, node) ->
      return if DeleteLink.cooldown.counting isnt post
      unless 0 <= seconds <= length
        if DeleteLink.cooldown.counting is post
          node.textContent = 'Delete'
          delete DeleteLink.cooldown.counting
        return
      setTimeout DeleteLink.cooldown.count, 1000, post, seconds - 1, length, node
      node.textContent = "Delete (#{seconds})"
