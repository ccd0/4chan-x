Unread =
  init: ->
    @title = d.title
    $.on d, 'QRPostSuccessful', @post
    @update()
    $.on window, 'scroll', Unread.scroll
    $.on window, 'focus', Unread.focus
    Main.callbacks.push @node

  replies: []
  foresee: []

  post: (e) ->
    Unread.foresee.push e.detail.postID

  node: (post) ->
    if (index = Unread.foresee.indexOf post.ID) isnt -1
      Unread.foresee.splice index, 1
      return
    {el, root} = post
    return if root.hidden or /\bop\b/.test(post.class) or post.isInlined
    count = Unread.replies.push el
    Unread.update count is 1

  focus: ->
    Unread.count() unless Unread.replies is 0

  scroll: ->
    Unread.count() unless $.hidden() or Unread.replies is 0

  count: ->
    height = d.documentElement.clientHeight
    for reply, i in Unread.replies
      {bottom} = reply.getBoundingClientRect()
      if bottom > height # Post is not completely read
        break
    return if i is 0

    Unread.replies = Unread.replies[i..]
    Unread.update Unread.replies.length is 0

  setTitle: (count) ->
    if @scheduled
      clearTimeout @scheduled
      delete Unread.scheduled
      @setTitle count
      return
    @scheduled = setTimeout (->
      d.title = "(#{count}) #{Unread.title}"
    ), 5

  update: (updateFavicon) ->
    return unless g.REPLY

    count = @replies.length

    if Conf['Unread Count']
      @setTitle count

    unless Conf['Unread Favicon'] and updateFavicon
      return

    if $.engine is 'presto'
      $.rm Favicon.el

    Favicon.el.href =
      if g.dead
        if count
          Favicon.unreadDead
        else
          Favicon.dead
      else
        if count
          Favicon.unread
        else
          Favicon.default

    if g.dead
      $.addClass    Favicon.el, 'dead'
    else
      $.rmClass     Favicon.el, 'dead'
    if count
      $.addClass    Favicon.el, 'unread'
    else
      $.rmClass     Favicon.el, 'unread'

    # `favicon.href = href` doesn't work on Firefox
    # `favicon.href = href` isn't enough on Opera
    # Opera won't always update the favicon if the href didn't change
    unless $.engine is 'webkit'
      $.add d.head, Favicon.el