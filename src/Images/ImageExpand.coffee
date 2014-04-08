ImageExpand =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Image Expansion']

    @EAI = $.el 'a',
      className: 'expand-all-shortcut fa fa-expand'
      textContent: 'EAI' 
      title: 'Expand All Images'
      href: 'javascript:;'
    $.on @EAI, 'click', ImageExpand.cb.toggleAll
    Header.addShortcut @EAI, 3

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
    else if @isClone and @file.isExpanded and @file.isVideo
      clone = @
      ImageExpand.setupVideoControls clone
      unless clone.origin.file.fullImage.paused
        $.queueTask -> ImageExpand.startVideo clone
    else if ImageExpand.on and !@isHidden and (Conf['Expand spoilers'] or !@file.isSpoiler)
      ImageExpand.expand @
  cb:
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      post = Get.postFromNode @
      return if post.file.isExpanded and post.file.fullImage?.controls
      e.preventDefault()
      ImageExpand.toggle post

    toggleAll: ->
      $.event 'CloseMenu'
      toggle = (post) ->
        {file} = post
        return unless file and (file.isImage or file.isVideo) and doc.contains post.nodes.root
        if ImageExpand.on and
          (!Conf['Expand spoilers'] and file.isSpoiler or
          Conf['Expand from here'] and Header.getTopOf(file.thumb) < 0)
            return
        $.queueTask func, post

      if ImageExpand.on = $.hasClass ImageExpand.EAI, 'expand-all-shortcut'
        ImageExpand.EAI.className = 'contract-all-shortcut fa fa-compress'
        ImageExpand.EAI.title     = 'Contract All Images'
        func = ImageExpand.expand
      else
        ImageExpand.EAI.className = 'expand-all-shortcut fa fa-expand'
        ImageExpand.EAI.title     = 'Expand All Images'
        func = ImageExpand.contract

      g.posts.forEach (post) ->
        toggle post
        toggle post for post in post.clones
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
    if post.file.isVideo and video = post.file.fullImage
      video.pause()
      TrashQueue.add video, post
      post.file.thumb.parentNode.href = video.src
      post.file.thumb.parentNode.target = '_blank'
      for eventName, cb of ImageExpand.videoCB
        $.off video, eventName, cb
      $.rm post.file.videoControls
      delete post.file.videoControls
    $.rmClass post.nodes.root, 'expanded-image'
    $.rmClass post.file.thumb, 'expanding'
    post.file.isExpanded = false

  expand: (post, src) ->
    # Do not expand images of hidden/filtered replies, or already expanded pictures.
    {thumb, isVideo} = post.file
    return if post.isHidden or post.file.isExpanded or $.hasClass thumb, 'expanding'
    $.addClass thumb, 'expanding'
    if el = post.file.fullImage
      # Expand already-loaded/ing picture.
      TrashQueue.remove el
    else
      el = post.file.fullImage = $.el (if isVideo then 'video' else 'img'),
        className: 'full-image'
      el.loop = true if isVideo
      $.on el, 'error', ImageExpand.error
      el.src = src or post.file.URL
    $.after thumb, el unless el is thumb.nextSibling
    $.asap (-> if isVideo then el.videoHeight else el.naturalHeight), ->
      ImageExpand.completeExpand post

  completeExpand: (post) ->
    {thumb} = post.file
    return unless $.hasClass thumb, 'expanding' # contracted before the image loaded
    unless post.nodes.root.parentNode
      # Image might start/finish loading before the post is inserted.
      # Don't scroll when it's expanded in a QP for example.
      ImageExpand.completeExpand2 post
      return
    {bottom} = post.nodes.root.getBoundingClientRect()
    $.queueTask ->
      ImageExpand.completeExpand2 post
      return unless bottom <= 0
      window.scrollBy 0, post.nodes.root.getBoundingClientRect().bottom - bottom

  completeExpand2: (post) ->
    {thumb} = post.file
    $.addClass post.nodes.root, 'expanded-image'
    $.rmClass  post.file.thumb, 'expanding'
    post.file.isExpanded = true
    if post.file.isVideo
      ImageExpand.setupVideoControls post
      post.file.fullImage.muted = !Conf['Allow Sound']
      post.file.fullImage.controls = Conf['Show Controls']
      ImageExpand.startVideo post if Conf['Autoplay']

  videoCB:
    click: (e) ->
      if @paused and not @controls
        @play()
        e.stopPropagation()

    # dragging to the left contracts the video
    mousedown: (e) -> @dataset.mousedown = 'true' if e.button is 0
    mouseup: (e) -> @dataset.mousedown = 'false' if e.button is 0
    mouseover: (e) -> @dataset.mousedown = 'false'
    mouseout: (e) ->
      if @dataset.mousedown is 'true' and e.clientX <= @getBoundingClientRect().left
        ImageExpand.contract (Get.postFromNode @)

  setupVideoControls: (post) ->
    {file} = post
    video = file.fullImage

    # disable link to file so native controls can work
    file.thumb.parentNode.removeAttribute 'href'
    file.thumb.parentNode.removeAttribute 'target'

    # setup callbacks on video element
    video.dataset.mousedown = 'false'
    $.on video, eventName, cb for eventName, cb of ImageExpand.videoCB

    # setup controls in file info
    file.videoControls = $.el 'span',
      className: 'video-controls'
    if Conf['Show Controls']
      contract = $.el 'a',
        textContent: 'contract'
        href: 'javascript:;'
        title: 'You can also contract the video by dragging it to the left.'
      $.on contract, 'click', (e) -> ImageExpand.contract post
      $.add file.videoControls, [$.tn('\u00A0'), contract]
    $.add file.text, file.videoControls

  startVideo: (post) ->
    {file} = post
    video = file.fullImage
    {controls} = video
    video.controls = false
    video.play()
    # Hacky workaround for Firefox forever-loading bug for very short videos
    if controls
      $.asap (-> (video.readyState >= 3 and video.currentTime <= Math.max 0.1, (video.duration - 0.5)) or !file.isExpanded), ->
        video.controls = true if file.isExpanded
      , 500

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
    $.ajax @src,
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
      return if g.VIEW is 'catalog' or !Conf['Image Expansion']

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
