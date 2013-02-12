DeleteLink =
  init: ->
    div = $.el 'div',
      className: 'delete_link'
      textContent: 'Delete'
    aPost = $.el 'a',
      className: 'delete_post'
      href: 'javascript:;'
    aImage = $.el 'a',
      className: 'delete_image'
      href: 'javascript:;'

    children = []

    children.push
      el: aPost
      open: ->
        aPost.textContent = 'Post'
        $.on aPost, 'click', DeleteLink.delete
        true

    children.push
      el: aImage
      open: (post) ->
        return false unless post.img
        aImage.textContent = 'Image'
        $.on aImage, 'click', DeleteLink.delete
        true

    Menu.addEntry
      el: div
      open: (post) ->
        if post.isArchived
          return false
        node = div.firstChild
        if seconds = DeleteLink.cooldown[post.ID]
          node.textContent = "Delete (#{seconds})"
          DeleteLink.cooldown.el = node
        else
          node.textContent = 'Delete'
          delete DeleteLink.cooldown.el
        true
      children: children

    $.on d, 'QRPostSuccessful', @cooldown.start

  delete: ->
    menu = $.id 'menu'
    {id} = menu.dataset
    return if DeleteLink.cooldown[id]

    $.off @, 'click', DeleteLink.delete
    @textContent = 'Deleting...'

    pwd =
      if m = d.cookie.match /4chan_pass=([^;]+)/
        decodeURIComponent m[1]
      else
        $.id('delPassword').value

    board = $('a[title="Highlight this post"]',
      $.id menu.dataset.rootid).pathname.split('/')[1]
    self = @

    form =
      mode: 'usrdel'
      onlyimgdel: /\bdelete_image\b/.test @className
      pwd: pwd
    form[id] = 'delete'

    $.ajax $.id('delform').action.replace("/#{g.BOARD}/", "/#{board}/"), {
        onload:  -> DeleteLink.load  self, @response
        onerror: -> DeleteLink.error self
      }, {
        form: $.formData form
      }

  load: (self, html) ->
    doc = d.implementation.createHTMLDocument ''
    doc.documentElement.innerHTML = html
    if doc.title is '4chan - Banned' # Ban/warn check
      s = 'Banned!'
    else if msg = doc.getElementById 'errmsg' # error!
      s = msg.textContent
      $.on self, 'click', DeleteLink.delete
    else
      s = 'Deleted'
    self.textContent = s
  error: (self) ->
    self.textContent = 'Connection error, please retry.'
    $.on self, 'click', DeleteLink.delete

  cooldown:
    start: (e) ->
      seconds =
        if g.BOARD is 'q'
          600
        else
          30
      DeleteLink.cooldown.count e.detail.postID, seconds, seconds

    count: (postID, seconds, length) ->
      return unless 0 <= seconds <= length
      setTimeout DeleteLink.cooldown.count, 1000, postID, seconds-1, length
      {el} = DeleteLink.cooldown
      if seconds is 0
        el?.textContent = 'Delete'
        delete DeleteLink.cooldown[postID]
        delete DeleteLink.cooldown.el
        return
      el?.textContent = "Delete (#{seconds})"
      DeleteLink.cooldown[postID] = seconds