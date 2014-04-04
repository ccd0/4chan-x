ImageExpand =
  init: ->
    return if !Conf['Image Expansion']

    @EAI = $.el 'a',
      id:        'img-controls'
      className:   'expand-all-shortcut a-icon'
      title:       'Expand All Images'
      href:        'javascript:;'

    $.on @EAI, 'click', ImageExpand.cb.toggleAll

    Header.addShortcut @EAI, true

    Post.callbacks.push
      name: 'Image Expansion'
      cb: @node

  node: ->
    return unless @file?.isImage or @file?.isVideo
    {thumb} = @file
    $.on thumb.parentNode, 'click', ImageExpand.cb.toggle
    if @isClone and $.hasClass thumb, 'expanding'
      # If we clone a post where the image is still loading,
      # make it loading in the clone too.
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
        ImageExpand.EAI.className = 'contract-all-shortcut a-icon'
        ImageExpand.EAI.title     = 'Contract All Images'
        func = ImageExpand.expand
      else
        ImageExpand.EAI.className = 'expand-all-shortcut a-icon'
        ImageExpand.EAI.title     = 'Expand All Images'
        func = ImageExpand.contract

      g.posts.forEach (post) ->
        for post in [post].concat post.clones
          {file} = post
          return unless file and (file.isImage or file.isVideo) and doc.contains post.nodes.root
          if ImageExpand.on and
            (!Conf['Expand spoilers'] and file.isSpoiler or
            Conf['Expand from here'] and Header.getTopOf(file.thumb) < 0)
              return
          $.queueTask func, post
        return

    setFitness: ->
      (if @checked then $.addClass else $.rmClass) doc, @name.toLowerCase().replace /\s+/g, '-'

  toggle: (post) ->
    {thumb} = post.file
    unless post.file.isExpanded or $.hasClass thumb, 'expanding'
      ImageExpand.expand post
      return

    # Scroll back to the thumbnail when contracting the image
    # to avoid being left miles away from the relevant post.
    {root} = post.nodes
    {top, left} = (if Conf['Advance on contract'] then do ->
      next = root
      while next = $.x "following::div[contains(@class,'postContainer')][1]", next
        continue if $('.stub', next) or next.offsetHeight is 0
        return next
      root
    else 
      root
    ).getBoundingClientRect()

    if top < 0
      y = top
      if Conf['Fixed Header'] and not Conf['Bottom Header']
        headRect = Header.bar.getBoundingClientRect()
        y -= headRect.top + headRect.height

    if left < 0
      x = -window.scrollX
    window.scrollBy x, y if x or y
    ImageExpand.contract post

  contract: (post) ->
    post.file.fullImage?.pause() if post.file.isVideo
    $.rmClass post.nodes.root, 'expanded-image'
    $.rmClass post.file.thumb, 'expanding'
    post.file.isExpanded = false
    post.file.videoControls?.map($.rm)
    delete post.file.videoControls

  expand: (post, src) ->
    # Do not expand images of hidden/filtered replies, or already expanded pictures.
    {thumb, isVideo} = post.file
    return if post.isHidden or post.file.isExpanded or $.hasClass thumb, 'expanding'
    $.addClass thumb, 'expanding'
    naturalHeight = if isVideo then 'videoHeight' else 'naturalHeight'
    if img = post.file.fullImage
      # Expand already-loaded/ing picture.
      $.rmClass img, 'ihover'
      $.addClass img, 'full-image'
      img.controls = (img.parentNode isnt thumb.parentNode)
      $.asap (-> img[naturalHeight]), ->
        ImageExpand.completeExpand post
      return
    post.file.fullImage = img = $.el (if isVideo then 'video' else 'img'),
      className: 'full-image'
      src: src or post.file.URL
    if isVideo
      img.loop = true
      img.controls = Conf['Show Controls']
    $.on img, 'error', ImageExpand.error
    $.asap (-> post.file.fullImage[naturalHeight]), ->
      ImageExpand.completeExpand post
    $.after (if img.controls then thumb.parentNode else thumb), img

  completeExpand: (post) ->
    {thumb} = post.file
    return unless $.hasClass thumb, 'expanding' # contracted before the image loaded
    post.file.isExpanded = true
    ImageExpand.setupVideo post if post.file.isVideo
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

  setupVideo: (post) ->
    {file} = post
    video = file.fullImage
    file.videoControls = []
    video.muted = not Conf['Allow Sound']
    if video.controls
      # contract link in file info
      contract = $.el 'a',
        textContent: 'contract'
        href: 'javascript:;'
        title: 'You can also contract the video by dragging it to the left.'
      $.on contract, 'click', (e) -> ImageExpand.contract post
      file.videoControls.push $.tn('\u00A0'), contract
      # drag left to contract
      file.mousedown = false
      $.on video, 'mousedown', (e) -> file.mousedown = true  if e.button is 0
      $.on video, 'mouseup', (e) -> file.mousedown = false if e.button is 0
      $.on video, 'mouseover', (e) -> file.mousedown = false
      $.on video, 'mouseout', (e) ->
        if file.mousedown and e.clientX <= video.getBoundingClientRect().left
          ImageExpand.contract post
    if Conf['Autoplay']
      video.play()
    else unless video.controls
      play = $.el 'a',
        textContent: 'play'
        href: 'javascript:;'
      $.on play, 'click', (e) ->
        video[@textContent]()
        @textContent = if @textContent is 'play' then 'pause' else 'play'
      file.videoControls.push $.tn('\u00A0'), play
    $.add file.text, file.videoControls

  error: ->
    post = Get.postFromNode @
    $.rm @
    delete post.file.fullImage
    # Images can error:
    #  - before the image started loading.
    #  - after the image started loading.
    unless $.hasClass(post.file.thumb, 'expanding') or $.hasClass post.nodes.root, 'expanded-image'
      # Don't try to re-expend if it was already contracted.
      return
    ImageExpand.contract post

    src = @src.split '/'
    if src[2] is 'i.4cdn.org'
      URL = Redirect.to 'file',
        boardID:  src[3]
        filename: src[5]
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
    $.ajax "//a.4cdn.org/#{post.board}/res/#{post.thread}.json", onload: ->
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
        className:   'image-expansion-link'

      {createSubEntry} = ImageExpand.menu
      subEntries = []
      for name, conf of Config.imageExpansion
        subEntries.push createSubEntry name, conf[1]

      $.event 'AddMenuEntry',
        type: 'header'
        el: el
        order: 105
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
