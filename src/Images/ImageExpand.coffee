ImageExpand =
  init: ->
    return if !Conf['Image Expansion']

    @EAI = $.el 'a',
      className: 'expand-all-shortcut fa fa-expand'
      title: 'Expand All Images'
      href: 'javascript:;'
    $.on @EAI, 'click', @cb.toggleAll
    Header.addShortcut @EAI, 3
    $.on d, 'scroll visibilitychange', @cb.playVideos

    Post.callbacks.push
      name: 'Image Expansion'
      cb:   @node
  node: ->
    return unless @file and (@file.isImage or @file.isVideo)
    $.on @file.thumb.parentNode, 'click', ImageExpand.cb.toggle
    if @isClone
      if @file.error
        @file.error = $ '.warning', @file.thumb.parentNode
      else if @file.isExpanding or @file.isExpanded
        # Re-expand to make sure everything works/loads fine.
        ImageExpand.contract @
        ImageExpand.expand @
        return
    if ImageExpand.on and !@isHidden and (Conf['Expand spoilers'] or !@file.isSpoiler)
      ImageExpand.expand @
  cb:
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      e.preventDefault()
      ImageExpand.toggle Get.postFromNode @
    toggleAll: ->
      $.event 'CloseMenu'
      if ImageExpand.on = $.hasClass ImageExpand.EAI, 'expand-all-shortcut'
        ImageExpand.EAI.className = 'contract-all-shortcut fa fa-compress'
        ImageExpand.EAI.title     = 'Contract All Images'
        func = ImageExpand.expand
      else
        ImageExpand.EAI.className = 'expand-all-shortcut fa fa-expand'
        ImageExpand.EAI.title     = 'Expand All Images'
        func = ImageExpand.contract
      for ID, post of g.posts when post.file and (post.file.isImage or post.file.isVideo)
        for post in [post].concat post.clones
          if ImageExpand.on and (
            post.isHidden or
            !Conf['Expand spoilers'] and post.file.isSpoiler or
            !doc.contains(post.nodes.root) or
            Conf['Expand from here'] and Header.getTopOf(post.file.thumb) < 0)
              continue
          $.queueTask func, post
      return
    playVideos: (e) ->
      for fullID, post of g.posts
        continue unless post.file and post.file.isVideo and post.file.isExpanded
        for post in [post].concat post.clones
          play = !d.hidden and !post.isHidden and doc.contains(post.nodes.root) and Header.isNodeVisible post.nodes.root
          if play then post.file.fullImage.play() else post.file.fullImage.pause()
      return
    setFitness: ->
      (if @checked then $.addClass else $.rmClass) doc, @name.toLowerCase().replace /\s+/g, '-'

  toggle: (post) ->
    {thumb} = post.file
    unless post.file.isExpanded or post.file.isExpanding
      ImageExpand.expand post
      return

    # Scroll back to the thumbnail when contracting the image
    # to avoid being left miles away from the relevant post.
    top = Header.getTopOf post.nodes.root
    if top < 0
      y = top
    if post.nodes.root.getBoundingClientRect().left < 0
      x = -window.scrollX
    window.scrollBy x, y if x or y
    ImageExpand.contract post

  contract: (post) ->
    $.rmClass post.nodes.root, 'expanded-image'
    $.rmClass post.file.thumb, 'expanding'
    delete post.file.isExpanding
    delete post.file.isExpanded
    post.file.fullImage.pause() if post.file.isVideo and post.file.fullImage

  expand: (post, src) ->
    # Do not expand images of hidden/filtered replies, or already expanded pictures.
    return if post.file.isExpanding or post.file.isExpanded
    if post.file.fullImage
      # Expand already-loaded/ing picture.
      ImageExpand.waitExpand post
      return
    post.file.fullImage = file = if post.file.isImage
      $.el 'img'
    else
      $.el 'video',
        loop: true
    file.className = 'full-image'
    file.src = src or post.file.URL
    $.on file, 'error', ImageExpand.error
    ImageExpand.waitExpand post
    if post.file.error
      $.rm post.file.error
      delete post.file.error
    $.after post.file.thumb, file

  waitExpand: (post) ->
    post.file.isExpanding = true
    if post.file.isReady
      ImageExpand.completeExpand post
      return

    $.addClass post.file.thumb, 'expanding'
    file = post.file.fullImage

    if post.file.isImage
      $.asap (-> if post.file.isExpanding then file.naturalHeight else true), ->
        ImageExpand.completeExpand post
      return

    # Expand the video when the first frame is available.
    if file.readyState >= file.HAVE_CURRENT_DATA
      ImageExpand.completeExpand post
      return

    complete = ->
      $.off file, 'loadeddata', complete
      ImageExpand.completeExpand post
    $.on file, 'loadeddata', complete

  completeExpand: (post) ->
    return unless post.file.isExpanding # contracted before the image loaded
    delete post.file.isExpanding
    post.file.isReady = true
    post.file.isExpanded = true
    if post.file.isVideo and !d.hidden and (post.isClone and !post.nodes.root.parentNode or Header.isNodeVisible post.nodes.root)
      # Play the video if it's in a clone that hasn't been inserted yet,
      # otherwise, check if it's in the viewport as usual.
      post.file.fullImage.play()
    unless post.nodes.root.parentNode
      # Image might start/finish loading before the post is inserted.
      # Don't scroll when it's expanded in a QP for example.
      $.addClass post.nodes.root, 'expanded-image'
      $.rmClass  post.file.thumb, 'expanding'
      return
    {bottom} = post.nodes.root.getBoundingClientRect()
    $.queueTask ->
      $.addClass post.nodes.root, 'expanded-image'
      $.rmClass  post.file.thumb, 'expanding'
      return unless bottom <= 0
      window.scrollBy 0, post.nodes.root.getBoundingClientRect().bottom - bottom

  error: ->
    post = Get.postFromNode @
    $.rm @
    delete post.file.isReady
    delete post.file.fullImage
    # Images can error:
    #  - before the image started loading.
    #  - after the image started loading.
    unless post.file.isExpanding or post.file.isExpanded
      # Don't try to re-expand if it was already contracted.
      return
    ImageExpand.contract post

    if @error and @error.code isnt @error.MEDIA_ERR_NETWORK # video
      error = switch @error.code
        when 1 then 'MEDIA_ERR_ABORTED'
        when 3 then 'MEDIA_ERR_DECODE'
        when 4 then 'MEDIA_ERR_SRC_NOT_SUPPORTED'
        when 5 then 'MEDIA_ERR_ENCRYPTED'
      post.file.error = $.el 'div',
        textContent: "Playback error: #{error}"
        className: 'warning'
      $.after post.file.thumb, post.file.error
      return

    src = @src.split '/'
    if src[2] is 'i.4cdn.org'
      URL = Redirect.to 'file',
        boardID:  src[3]
        filename: src[4].replace /\?.+$/, ''
      if URL
        setTimeout ImageExpand.expand, 10000, post, URL
        return
      if g.DEAD or post.isDead or post.file.isDead
        return

    timeoutID = setTimeout ImageExpand.expand, 10000, post
    <% if (type === 'crx') { %>
    $.ajax post.file.URL,
      onloadend: ->
        return if @status isnt 404
        clearTimeout timeoutID
        post.kill true
    ,
      type: 'head'
    <% } else { %>
    # XXX CORS for i.4cdn.org WHEN?
    $.ajax "//a.4cdn.org/#{post.board}/thread/#{post.thread}.json", onload: ->
      return if @status isnt 200
      for postObj in @response.posts
        break if postObj.no is post.ID
      if postObj.no isnt post.ID
        clearTimeout timeoutID
        post.kill()
      else if postObj.filedeleted
        clearTimeout timeoutID
        post.kill true
    <% } %>

  menu:
    init: ->
      return if !Conf['Image Expansion']

      el = $.el 'span',
        textContent: 'Image Expansion'
        className: 'image-expansion-link'

      {createSubEntry} = ImageExpand.menu
      subEntries = []
      for name, conf of Config.imageExpansion
        subEntries.push createSubEntry name, conf[1]

      $.event 'AddMenuEntry',
        type: 'header'
        el: el
        order: 80
        subEntries: subEntries

    createSubEntry: (name, desc) ->
      label = $.el 'label',
        innerHTML: "<input type=checkbox name='#{name}'> #{name}"
        title: desc
      input = label.firstElementChild
      if name in ['Fit width', 'Fit height']
        $.on input, 'change', ImageExpand.cb.setFitness
      input.checked = Conf[name]
      $.event 'change', null, input
      $.on input, 'change', $.cb.checked
      el: label
