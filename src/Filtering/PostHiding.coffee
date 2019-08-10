PostHiding =
  init: ->
    return if g.VIEW not in ['index', 'thread'] or !Conf['Reply Hiding Buttons'] and !(Conf['Menu'] and Conf['Reply Hiding Link'])

    if Conf['Reply Hiding Buttons']
      $.addClass doc, "reply-hide"

    @db = new DataBoard 'hiddenPosts'
    Callbacks.Post.push
      name: 'Reply Hiding'
      cb:   @node

  isHidden: (boardID, threadID, postID) ->
    !!(PostHiding.db and PostHiding.db.get {boardID, threadID, postID})

  node: ->
    return if !@isReply or @isClone or @isFetchedQuote

    if data = PostHiding.db.get {boardID: @board.ID, threadID: @thread.ID, postID: @ID}
      if data.thisPost
        PostHiding.hide @, data.makeStub, data.hideRecursively
      else
        Recursive.apply PostHiding.hide, @, data.makeStub, true
        Recursive.add   PostHiding.hide, @, data.makeStub, true

    return unless Conf['Reply Hiding Buttons']

    button = PostHiding.makeButton @, 'hide'
    if (sa = g.SITE.selectors.sideArrows)
      sideArrows = $ sa, @nodes.root
      $.replace sideArrows.firstChild, button
      sideArrows.removeAttribute 'class'
    else
      $.prepend @nodes.root, button

  menu:
    init: ->
      return if g.VIEW not in ['index', 'thread'] or !Conf['Menu'] or !Conf['Reply Hiding Link']

      # Hide
      div = $.el 'div',
        className: 'hide-reply-link'
        textContent: 'Hide'

      apply = $.el 'a',
        textContent: 'Apply'
        href: 'javascript:;'
      $.on apply, 'click', PostHiding.menu.hide

      thisPost = UI.checkbox 'thisPost', 'This post',    true
      replies  = UI.checkbox 'replies',  'Hide replies', Conf['Recursive Hiding']
      makeStub = UI.checkbox 'makeStub', 'Make stub',    Conf['Stubs']

      Menu.menu.addEntry
        el: div
        order: 20
        open: (post) ->
          if !post.isReply or post.isClone or post.isHidden
            return false
          PostHiding.menu.post = post
          true
        subEntries: [
            el: apply
          ,
            el: thisPost
          ,
            el: replies
          ,
            el: makeStub
        ]

      # Show
      div = $.el 'div',
        className: 'show-reply-link'
        textContent: 'Show'

      apply = $.el 'a',
        textContent: 'Apply'
        href: 'javascript:;'
      $.on apply, 'click', PostHiding.menu.show

      thisPost = UI.checkbox 'thisPost', 'This post',    false
      replies  = UI.checkbox 'replies',  'Show replies', false
      hideStubLink = $.el 'a',
        textContent: 'Hide stub'
        href: 'javascript:;'
      $.on hideStubLink, 'click', PostHiding.menu.hideStub

      Menu.menu.addEntry
        el: div
        order: 20
        open: (post) ->
          if !post.isReply or post.isClone or !post.isHidden
            return false
          if not (data = PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID})
            return false
          PostHiding.menu.post = post
          thisPost.firstChild.checked = post.isHidden
          replies.firstChild.checked  = if data?.hideRecursively? then data.hideRecursively else Conf['Recursive Hiding']
          true
        subEntries: [
            el: apply
          ,
            el: thisPost
          ,
            el: replies
        ]

      Menu.menu.addEntry
        el: hideStubLink
        order: 15
        open: (post) ->
          if !post.isReply or post.isClone or !post.isHidden
            return false
          if not (data = PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID})
            return false
          PostHiding.menu.post = post

    hide: ->
      parent   = @parentNode
      thisPost = $('input[name=thisPost]', parent).checked
      replies  = $('input[name=replies]',  parent).checked
      makeStub = $('input[name=makeStub]', parent).checked
      {post}   = PostHiding.menu
      if thisPost
        PostHiding.hide post, makeStub, replies
      else if replies
        Recursive.apply PostHiding.hide, post, makeStub, true
        Recursive.add   PostHiding.hide, post, makeStub, true
      else
        return
      PostHiding.saveHiddenState post, true, thisPost, makeStub, replies
      $.event 'CloseMenu'

    show: ->
      parent   = @parentNode
      thisPost = $('input[name=thisPost]', parent).checked
      replies  = $('input[name=replies]',  parent).checked
      {post}   = PostHiding.menu
      if thisPost
        PostHiding.show post, replies
      else if replies
        Recursive.apply PostHiding.show, post, true
        Recursive.rm    PostHiding.hide, post, true
      else
        return
      if data = PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}
        PostHiding.saveHiddenState post, !(thisPost and replies), !thisPost, data.makeStub, !replies
      $.event 'CloseMenu'
    hideStub: ->
      {post} = PostHiding.menu
      if data = PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}
        PostHiding.show post, data.hideRecursively
        PostHiding.hide post, false, data.hideRecursively
        PostHiding.saveHiddenState post, true, true, false, data.hideRecursively
      $.event 'CloseMenu'
      return

  makeButton: (post, type) ->
    span = $.el 'span',
      className:   "fourchan-x--icon icon--small"
    $.extend span, `<%= html('&{type === "hide" ? Icons.minus_square_o : Icons.plus_square_o}') %>`
    a = $.el 'a',
      className: "#{type}-reply-button"
      href:      'javascript:;'
    $.add a, span
    $.on a, 'click', PostHiding.toggle
    a

  saveHiddenState: (post, isHiding, thisPost, makeStub, hideRecursively) ->
    data =
      boardID:  post.board.ID
      threadID: post.thread.ID
      postID:   post.ID
    if isHiding
      data.val =
        thisPost: thisPost isnt false # undefined -> true
        makeStub: makeStub
        hideRecursively: hideRecursively
      PostHiding.db.set data
    else
      PostHiding.db.delete data

  toggle: ->
    post = Get.postFromNode @
    PostHiding[(if post.isHidden then 'show' else 'hide')] post
    PostHiding.saveHiddenState post, post.isHidden

  hide: (post, makeStub=Conf['Stubs'], hideRecursively=Conf['Recursive Hiding']) ->
    return if post.isHidden
    post.isHidden = true

    if hideRecursively
      Recursive.apply PostHiding.hide, post, makeStub, true
      Recursive.add   PostHiding.hide, post, makeStub, true

    for quotelink in Get.allQuotelinksLinkingTo post
      $.addClass quotelink, 'filtered'

    unless makeStub
      post.nodes.root.hidden = true
      return

    a = PostHiding.makeButton post, 'show'
    $.add a, $.tn " #{post.info.nameBlock}"
    post.nodes.stub = $.el 'div',
      className: 'stub'
    $.add post.nodes.stub, a
    if Conf['Menu']
      $.add post.nodes.stub, Menu.makeButton post
    $.prepend post.nodes.root, post.nodes.stub

  show: (post, showRecursively=Conf['Recursive Hiding']) ->
    if post.nodes.stub
      $.rm post.nodes.stub
      delete post.nodes.stub
    else
      post.nodes.root.hidden = false
    post.isHidden = false
    if showRecursively
      Recursive.apply PostHiding.show, post, true
      Recursive.rm    PostHiding.hide, post
    for quotelink in Get.allQuotelinksLinkingTo post
      $.rmClass quotelink, 'filtered'
    return
