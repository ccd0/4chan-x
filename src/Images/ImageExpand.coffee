ImageExpand =
  init: ->
    return if g.VIEW is 'catalog' or !Conf['Image Expansion']

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
    if @isClone 
      if $.hasClass thumb, 'expanding'
        # If we clone a post where the image is still loading,
        # make it loading in the clone too.
        ImageExpand.contract @
        ImageExpand.expand @

      else if @file.isExpanded and @file.isVideo
        clone = @
        ImageExpand.setupVideoControls clone
        unless clone.origin.file.fullImage.paused
          $.queueTask -> Video.start clone.file.fullImage

      return

    else if ImageExpand.on and !@isHidden and
      (Conf['Expand spoilers'] or !@file.isSpoiler) and
      (Conf['Expand videos'] or !@file.isVideo)
        ImageExpand.expand @, null, true
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
          !Conf['Expand videos']    and file.isVideo or
          Conf['Expand from here']  and Header.getTopOf(file.thumb) < 0)
            return
        $.queueTask func, post

      if ImageExpand.on = $.hasClass ImageExpand.EAI, 'expand-all-shortcut'
        ImageExpand.EAI.className = 'contract-all-shortcut a-icon'
        ImageExpand.EAI.title     = 'Contract All Images'
        func = (post) -> ImageExpand.expand post, null, true
      else
        ImageExpand.EAI.className = 'expand-all-shortcut a-icon'
        ImageExpand.EAI.title     = 'Expand All Images'
        func = ImageExpand.contract

      g.posts.forEach (post) ->
        toggle post for post in [post, post.clones...]
        return

    setFitness: ->
      (if @checked then $.addClass else $.rmClass) doc, @name.toLowerCase().replace /\s+/g, '-'

  toggle: (post) ->
    unless post.file.isExpanded or $.hasClass post.file.thumb, 'expanding'
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
    {thumb} = post.file
    if post.file.isVideo and video = post.file.fullImage
      video.pause()
      TrashQueue.add video, post
      thumb.parentNode.href   = video.src
      thumb.parentNode.target = '_blank'
      for eventName, cb of ImageExpand.videoCB
        $.off video, eventName, cb
      $.rm   post.file.videoControls
      delete post.file.videoControls
    $.rmClass post.nodes.root, 'expanded-image'
    $.rmClass post.file.thumb, 'expanding'
    delete post.file.isExpanding
    delete post.file.isExpanded
    post.file.fullImage.pause() if post.file.isVideo and post.file.fullImage

  expand: (post, src, disableAutoplay) ->
    # Do not expand images of hidden/filtered replies, or already expanded pictures.
    {thumb, isVideo} = post.file
    return if post.isHidden or post.file.isExpanded or $.hasClass thumb, 'expanding'
    $.addClass thumb, 'expanding'
    if el = post.file.fullImage
      # Expand already-loaded/ing picture.
      el.className = 'full-image'
      TrashQueue.remove el
    else
      el = post.file.fullImage = $.el (if isVideo then 'video' else 'img'),
        className: 'full-image'
      $.on el, 'error', ImageExpand.error
      el.src = src or post.file.URL
      if isVideo
        el.loop = true
    $.after thumb, el unless el is thumb.nextSibling
    $.asap (-> el.videoHeight or el.naturalHeight), ->
      ImageExpand.completeExpand post, disableAutoplay

  completeExpand: (post, disableAutoplay) ->
    return unless $.hasClass post.file.thumb, 'expanding' # contracted before the image loaded
    unless post.nodes.root.parentNode
      # Image might start/finish loading before the post is inserted.
      # Don't scroll when it's expanded in a QP for example.
      ImageExpand.completeExpand2 post
      return
    {bottom} = post.nodes.root.getBoundingClientRect()
    $.queueTask ->
      ImageExpand.completeExpand2 post, disableAutoplay
      return unless bottom <= 0
      window.scrollBy 0, post.nodes.root.getBoundingClientRect().bottom - bottom

  completeExpand2: (post, disableAutoplay) ->
    $.addClass post.nodes.root, 'expanded-image'
    $.rmClass  post.file.thumb, 'expanding'
    post.file.isExpanded = true
    if post.file.isVideo
      ImageExpand.setupVideoControls post
      Video.configure post.file.fullImage, disableAutoplay

  videoCB: do ->
    # dragging to the left contracts the video
    mousedown = false
    mouseover:     -> mousedown = false
    mousedown: (e) -> mousedown = true  if e.button is 0
    mouseup:   (e) -> mousedown = false if e.button is 0
    mouseout:  (e) -> ImageExpand.contract(Get.postFromNode @) if mousedown and e.clientX <= @getBoundingClientRect().left
    click:     (e) ->
      if @paused and not @controls
        @play()
        e.preventDefault()

  setupVideoControls: (post) ->
    {file}  = post
    {thumb} = file
    video   = file.fullImage

    # disable link to file so native controls can work
    file.thumb.parentNode.removeAttribute 'href'
    file.thumb.parentNode.removeAttribute 'target'

    # setup callbacks on video element
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

  error: ->
    post = Get.postFromNode @
    $.rm @
    delete post.file.isReady
    delete post.file.fullImage
    # Images can error:
    #  - before the image started loading.
    #  - after the image started loading.
    unless $.hasClass(post.file.thumb, 'expanding') or $.hasClass post.nodes.root, 'expanded-image'
      # Don't try to re-expend if it was already contracted.
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
    $.ajax @src,
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
      return if g.VIEW is 'catalog' or !Conf['Image Expansion']

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
