PostHiding =
  init: ->
    @db = new DataBoard 'hiddenPosts'
    @hideButton = $.el 'a',
      className: 'hide-post-button fa fa-minus-square-o'
      href: 'javascript:;'
    @showButton = $.el 'a',
      className: 'show-post-button fa fa-plus-square-o'
      href: 'javascript:;'

    Post.callbacks.push
      name: 'Post Hiding'
      cb:   @node

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
    if @isReply
      a = PostHiding.makeButton true
      a.hidden = true if @isHidden
      $.replace $('.sideArrows', @nodes.root), a
    else
      $.prepend @nodes.root, PostHiding.makeButton !@isHidden

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
    return if post.isReply
    Index.updateHideLabel()
    if Conf['Index Mode'] is 'all pages' # ssllooooww
      root = post.nodes.root.parentNode
      $.rm root.nextElementSibling
      $.rm root
      return
    Index.sort()
    Index.buildIndex()

  saveHiddenState: (post, val) ->
    data =
      boardID:  post.board.ID
      threadID: post.thread.ID
      postID:   post.ID
    if post.isHidden or val and !val.thisPost
      data.val = val or {}
      PostHiding.db.set data
    else if PostHiding.db.get data # unhiding a filtered post f.e.
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
      replies  =
        el: $.el 'label', innerHTML: "<input type=checkbox name=replies  checked=#{Conf['Recursive Hiding']}> Hide replies"
      makeStub =
        el: $.el 'label', innerHTML: "<input type=checkbox name=makeStub checked=#{Conf['Stubs']}> Make stub"

      Menu.menu.addEntry
        el: $.el 'div',
          textContent: 'Hide post'
          className: 'hide-post-link'
        order: 20
        open: (post) -> !(post.isHidden or !post.isReply or post.isClone)
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
        el: $.el 'label', innerHTML: '<input type=checkbox name=replies> Unhide replies'
        open: (post) ->
          data = PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}
          @el.firstChild.checked = if 'hideRecursively' of data then data.hideRecursively else Conf['Recursive Hiding']
          true

      Menu.menu.addEntry
        el: $.el 'div',
          textContent: 'Unhide post'
          className: 'show-post-link'
        order: 20
        open: (post) ->
          if !post.isHidden or !post.isReply or post.isClone
            return false
          unless PostHiding.db.get {boardID: post.board.ID, threadID: post.thread.ID, postID: post.ID}
            return false
          true
        subEntries: [apply, thisPost, replies]

      return if g.VIEW isnt 'index'
      Menu.menu.addEntry
        el: $.el 'a', href: 'javascript:;'
        order: 20
        open: (post) ->
          return false if post.isReply
          @el.textContent = if post.isHidden
            'Unhide thread'
          else
            'Hide thread'
          $.off @el, 'click', @cb if @cb
          @cb = ->
            $.event 'CloseMenu'
            PostHiding.toggle post
          $.on @el, 'click', @cb
          true

    hide: (post) ->
      parent   = @parentNode
      thisPost = $('input[name=thisPost]', parent).checked
      replies  = $('input[name=replies]',  parent).checked
      makeStub = $('input[name=makeStub]', parent).checked
      label    = 'Manually hidden'
      if thisPost
        post.hide label, makeStub, replies
      else if replies
        Recursive.apply 'hide', post, label, makeStub, true
        Recursive.add   'hide', post, label, makeStub, true
      else
        return
      PostHiding.saveHiddenState post, {thisPost, hideRecursively: replies, makeStub}
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
