PostHiding =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Reply Hiding'] and !Conf['Reply Hiding Link']

    @db = new DataBoard 'hiddenPosts'
    Post.callbacks.push
      name: 'Reply Hiding'
      cb:   @node

  node: ->
    return if !@isReply or @isClone
    if data = PostHiding.db.get {boardID: @board.ID, threadID: @thread.ID, postID: @ID}
      if data.thisPost
        PostHiding.hide @, data.makeStub, data.hideRecursively
      else
        Recursive.apply PostHiding.hide, @, data.makeStub, true
        Recursive.add PostHiding.hide, @, data.makeStub, true
    return unless Conf['Reply Hiding']
    $.replace $('.sideArrows', @nodes.root), PostHiding.makeButton @, 'hide'

  menu:
    init: ->
      return if g.VIEW is 'catalog' or !Conf['Menu'] or !Conf['Reply Hiding Link']

      # Hide
      div = $.el 'div',
        className: 'hide-reply-link'
        textContent: 'Hide reply'

      apply = $.el 'a',
        textContent: 'Apply'
        href: 'javascript:;'
      $.on apply, 'click', PostHiding.menu.hide

      thisPost = $.el 'label',
        innerHTML: '<input type=checkbox name=thisPost checked> This post'
      replies  = $.el 'label',
        innerHTML: "<input type=checkbox name=replies  checked=#{Conf['Recursive Hiding']}> Hide replies"
      makeStub = $.el 'label',
        innerHTML: "<input type=checkbox name=makeStub checked=#{Conf['Stubs']}> Make stub"

      $.event 'AddMenuEntry',
        type: 'post'
        el: div
        order: 20
        open: (post) ->
          if !post.isReply or post.isClone or post.isHidden
            return false
          PostHiding.menu.post = post
          true
        subEntries: [{el: apply}, {el: thisPost}, {el: replies}, {el: makeStub}]

      # Show
      div = $.el 'div',
        className: 'show-reply-link'
        textContent: 'Show reply'

      apply = $.el 'a',
        textContent: 'Apply'
        href: 'javascript:;'
      $.on apply, 'click', PostHiding.menu.show

      thisPost = $.el 'label',
        innerHTML: '<input type=checkbox name=thisPost> This post'
      replies  = $.el 'label',
        innerHTML: "<input type=checkbox name=replies> Show replies"

      $.event 'AddMenuEntry',
        type: 'post'
        el: div
        order: 20
        open: (post) ->
          if !post.isReply or post.isClone or !post.isHidden
            return false
          unless data = PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}
            return false
          PostHiding.menu.post = post
          thisPost.firstChild.checked = post.isHidden
          replies.firstChild.checked  = if data?.hideRecursively? then data.hideRecursively else Conf['Recursive Hiding']
          true
        subEntries: [{el: apply}, {el: thisPost}, {el: replies}]
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
        Recursive.add PostHiding.hide, post, makeStub, true
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
        Recursive.rm PostHiding.hide, post, true
      else
        return
      if data = PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}
        PostHiding.saveHiddenState post, !(thisPost and replies), !thisPost, data.makeStub, !replies
      $.event 'CloseMenu'

  makeButton: (post, type) ->
    a = $.el 'a',
      className: "#{type}-reply-button"
      innerHTML: "<span>[&nbsp;#{if type is 'hide' then '-' else '+'}&nbsp;]</span>"
      href:      'javascript:;'
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
    if post.isHidden
      PostHiding.show post
    else
      PostHiding.hide post
    PostHiding.saveHiddenState post, post.isHidden

  hide: (post, makeStub=Conf['Stubs'], hideRecursively=Conf['Recursive Hiding']) ->
    return if post.isHidden
    post.isHidden = true

    if hideRecursively
      Recursive.apply PostHiding.hide, post, makeStub, true
      Recursive.add PostHiding.hide, post, makeStub, true

    for quotelink in Get.allQuotelinksLinkingTo post
      $.addClass quotelink, 'filtered'

    unless makeStub
      post.nodes.root.hidden = true
      return

    a = PostHiding.makeButton post, 'show'
    postInfo =
      if Conf['Anonymize']
        'Anonymous'
      else
        $('.nameBlock', post.nodes.info).textContent
    $.add a, $.tn " #{postInfo}"
    post.nodes.stub = $.el 'div',
      className: 'stub'
    $.add post.nodes.stub, a
    if Conf['Menu']
      $.add post.nodes.stub, [$.tn(' '), Menu.makeButton()]
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
      Recursive.rm PostHiding.hide, post
    for quotelink in Get.allQuotelinksLinkingTo post
      $.rmClass quotelink, 'filtered'
    return
