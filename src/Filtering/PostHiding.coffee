PostHiding =
  init: ->
    @db = new DataBoard 'hiddenPosts'
    @hideButton = $.el 'a',
      className: 'hide-post-button'
      innerHTML: '<i class="fa fa-minus-square-o"></i>'
      href: 'javascript:;'
    @showButton = $.el 'a',
      className: 'show-post-button'
      innerHTML: '<i class="fa fa-plus-square-o"></i>'
      href: 'javascript:;'

    Post.callbacks.push
      name: 'Post Hiding'
      cb:   @node

    # XXX tmp conversion
    $.get 'hiddenThreads', null, ({hiddenThreads}) ->
      return unless hiddenThreads
      for boardID, board of hiddenThreads.boards
        for threadID, val of board
          ((PostHiding.db.data.boards[boardID] or= {})[threadID] or= {})[threadID] = val
      PostHiding.db.save()
      $.delete 'hiddenThreads'

  node: ->
    return if !@isReply and g.VIEW isnt 'index' or @isClone

    if data = PostHiding.db.get {boardID: @board.ID, threadID: @thread.ID, postID: @ID}
      if data.thisPost is false
        label = "Recursively hidden for quoting No.#{@}"
        Recursive.apply 'hide', @, label, data.makeStub, true
        Recursive.add   'hide', @, label, data.makeStub, true
      else
        @hide 'Manually hidden', data.makeStub, data.hideRecursively

    return unless Conf['Post Hiding']
    a = PostHiding.makeButton true
    if @isReply
      $.replace $('.sideArrows', @nodes.root), a
    else
      $.prepend @nodes.root, a

  makeButton: (hide) ->
    a = (if hide then PostHiding.hideButton else PostHiding.showButton).cloneNode true
    $.on a, 'click', PostHiding.onToggleClick
    a

  onToggleClick: ->
    PostHiding.toggle if $.x 'ancestor::div[contains(@class,"postContainer")][1]', @
      Get.postFromNode @
    else
      Get.threadFromNode(@).OP
  toggle: (post) ->
    if post.isHidden
      post.show()
    else
      post.hide 'Manually hidden'
    PostHiding.saveHiddenState post

  saveHiddenState: (post, val) ->
    data =
      boardID:  post.board.ID
      threadID: post.thread.ID
      postID:   post.ID
    if post.isHidden or val and !val.thisPost
      data.val = val or {}
      PostHiding.db.set data
    else
      PostHiding.db.delete data

  menu:
    init: ->
      return if !Conf['Menu'] or !Conf['Post Hiding Link']

      # Hide
      apply =
        el: $.el 'a', textContent: 'Apply', href: 'javascript:;'
        open: (post) ->
          $.off @el, 'click', @cb if @cb
          @cb = -> PostHiding.menu.hide post
          $.on  @el, 'click', @cb
          true
      thisPost =
        el: $.el 'label', innerHTML: '<input type=checkbox name=thisPost checked> This post'
        open: (post) -> post.isReply
      replies  =
        el: $.el 'label', innerHTML: "<input type=checkbox name=replies  checked=#{Conf['Recursive Hiding']}> Hide replies"
        open: (post) -> post.isReply
      makeStub =
        el: $.el 'label', innerHTML: "<input type=checkbox name=makeStub checked=#{Conf['Stubs']}> Make stub"

      $.event 'AddMenuEntry',
        type: 'post'
        el: $.el 'div', className: 'hide-post-link'
        order: 20
        open: (post) ->
          if !post.isReply and g.VIEW isnt 'index' or Conf['Index Mode'] is 'catalog' and g.VIEW is 'index' or post.isClone or post.isHidden
            return false
          @el.textContent = if post.isReply then 'Hide reply' else 'Hide thread'
          true
        subEntries: [apply, thisPost, replies, makeStub]

      # Show
      apply =
        el: $.el 'a', textContent: 'Apply', href: 'javascript:;'
        open: (post) ->
          $.off @el, 'click', @cb if @cb
          @cb = -> PostHiding.menu.show post
          $.on  @el, 'click', @cb
          true
      thisPost =
        el: $.el 'label', innerHTML: '<input type=checkbox name=thisPost> This post'
        open: (post) ->
          @el.firstChild.checked = post.isHidden
          true
      replies  =
        el: $.el 'label', innerHTML: "<input type=checkbox name=replies> Unhide replies"
        open: (post) ->
          data = PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}
          @el.firstChild.checked = if 'hideRecursively' of data then data.hideRecursively else Conf['Recursive Hiding']
          true

      $.event 'AddMenuEntry',
        type: 'post'
        el: $.el 'div', className: 'show-post-link'
        order: 20
        open: (post) ->
          if !post.isReply or post.isClone or !post.isHidden
            return false
          unless PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}
            return false
          @el.textContent = if post.isReply then 'Unhide reply' else 'Unhide thread'
          true
        subEntries: [apply, thisPost, replies]
    hide: (post) ->
      parent   = @parentNode
      thisPost = $('input[name=thisPost]', parent).checked if post.isReply
      replies  = $('input[name=replies]',  parent).checked if post.isReply
      makeStub = $('input[name=makeStub]', parent).checked
      label    = 'Manually hidden'
      if !post.isReply
        post.hide label, makeStub
      else if thisPost
        post.hide label, makeStub, replies
      else if replies
        Recursive.apply 'hide', post, label, makeStub, true
        Recursive.add   'hide', post, label, makeStub, true
      else
        return
      val = if post.isReply
        {thisPost, hideRecursively: replies, makeStub}
      else
        {makeStub}
      PostHiding.saveHiddenState post, val
      $.event 'CloseMenu'
    show: (post) ->
      parent   = @parentNode
      thisPost = $('input[name=thisPost]', parent).checked
      replies  = $('input[name=replies]',  parent).checked
      if thisPost
        post.show replies
      else if replies
        Recursive.apply 'show', post, true
        Recursive.rm    'hide', post, true
      else
        return
      val = {thisPost: !thisPost, hideRecursively: !replies, makeStub: !!post.nodes.stub}
      PostHiding.saveHiddenState post, val
      $.event 'CloseMenu'
