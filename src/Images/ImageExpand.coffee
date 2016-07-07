ImageExpand =
  init: ->
    return unless @enabled = Conf['Image Expansion'] and g.VIEW in ['index', 'thread'] and g.BOARD.ID isnt 'f'

    @EAI = $.el 'a',
      className: 'expand-all-shortcut fa fa-expand'
      textContent: 'EAI' 
      title: 'Expand All Images'
      href: 'javascript:;'

    $.on @EAI, 'click', @cb.toggleAll
    Header.addShortcut 'expand-all', @EAI, 520
    $.on d, 'scroll visibilitychange', @cb.playVideos
    @videoControls = $.el 'span', className: 'video-controls'
    $.extend @videoControls, <%= html(' <a href="javascript:;" title="You can also contract the video by dragging it to the left.">contract</a>') %>

    Callbacks.Post.push
      name: 'Image Expansion'
      cb: @node

  node: ->
    return unless @file and (@file.isImage or @file.isVideo)
    $.on @file.thumb.parentNode, 'click', ImageExpand.cb.toggle

    if @isClone 
      if @file.isExpanding
        # If we clone a post where the image is still loading,
        # make it loading in the clone too.
        ImageExpand.contract @
        ImageExpand.expand @

      else if @file.isExpanded and @file.isVideo
        Volume.setup @file.fullImage
        ImageExpand.setupVideoCB @
        ImageExpand.setupVideo @, !@origin.file.fullImage?.paused or @origin.file.wasPlaying, @file.fullImage.controls

    else if ImageExpand.on and !@isHidden and !@isFetchedQuote and
      (Conf['Expand spoilers'] or !@file.isSpoiler) and
      (Conf['Expand videos'] or !@file.isVideo)
        ImageExpand.expand @

  cb:
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button isnt 0
      post = Get.postFromNode @
      {file} = post
      return if file.isExpanded and ImageCommon.onControls e
      e.preventDefault()
      if !Conf['Autoplay'] and file.fullImage?.paused
        file.fullImage.play()
      else
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
        ImageExpand.EAI.className = 'contract-all-shortcut fa fa-compress'
        ImageExpand.EAI.title     = 'Contract All Images'
        func = ImageExpand.expand
      else
        ImageExpand.EAI.className = 'expand-all-shortcut fa fa-expand'
        ImageExpand.EAI.title     = 'Expand All Images'
        func = ImageExpand.contract

      g.posts.forEach (post) ->
        toggle post for post in [post, post.clones...]
        return

    playVideos: ->
      g.posts.forEach (post) ->
        for post in [post, post.clones...]
          {file} = post
          continue unless file and file.isVideo and file.isExpanded

          video = file.fullImage
          visible = ($.hasAudio(video) and not video.muted) or Header.isNodeVisible video
          if visible and file.wasPlaying
            delete file.wasPlaying
            video.play()
          else if !visible and !video.paused
            file.wasPlaying = true
            video.pause()
        return

    setFitness: ->
      $[if @checked then 'addClass' else 'rmClass'] doc, @name.toLowerCase().replace /\s+/g, '-'

  toggle: (post) ->
    unless post.file.isExpanding or post.file.isExpanded
      post.file.scrollIntoView = Conf['Scroll into view']
      ImageExpand.expand post
      return

    ImageExpand.contract post

    if Conf['Advance on contract']
      next = post.nodes.root
      while next = $.x "following::div[contains(@class,'postContainer')][1]", next
        break unless $('.stub', next) or next.offsetHeight is 0
      if next
        Header.scrollTo next

  contract: (post) ->
    {file} = post

    if el = file.fullImage
      top = Header.getTopOf el
      bottom = top + el.getBoundingClientRect().height
      oldHeight = d.body.clientHeight
      {scrollY} = window

    $.rmClass post.nodes.root, 'expanded-image'
    $.rmClass file.thumb,      'expanding'
    $.rm file.videoControls
    file.thumb.parentNode.href   = file.url
    file.thumb.parentNode.target = '_blank'
    for x in ['isExpanding', 'isExpanded', 'videoControls', 'wasPlaying', 'scrollIntoView']
      delete file[x]

    return unless el

    if doc.contains el
      if bottom <= 0
        # For images entirely above us, scroll to remain in place.
        window.scrollBy 0, scrollY - window.scrollY + d.body.clientHeight - oldHeight
      else
        # For images not above us that would be moved above us, scroll to the thumbnail.
        Header.scrollToIfNeeded post.nodes.root
      if window.scrollX > 0
        # If we have scrolled right viewing an expanded image, return to the left.
        window.scrollBy -window.scrollX, 0

    $.off el, 'error', ImageExpand.error
    ImageCommon.pushCache el
    if file.isVideo
      ImageCommon.pause el
      for eventName, cb of ImageExpand.videoCB
        $.off el, eventName, cb
    ImageCommon.rewind file.thumb if Conf['Restart when Opened']
    delete file.fullImage
    $.queueTask ->
      # XXX Work around Chrome/Chromium not firing mouseover on the thumbnail.
      return if file.isExpanding or file.isExpanded
      $.rmClass el, 'full-image'
      return if el.id
      $.rm el

  expand: (post, src) ->
    # Do not expand images of hidden/filtered replies, or already expanded pictures.
    {file} = post
    {thumb, isVideo} = file
    return if post.isHidden or file.isExpanding or file.isExpanded

    $.addClass thumb, 'expanding'
    file.isExpanding = true

    if file.fullImage
      el = file.fullImage
    else if ImageCommon.cache?.dataset.fullID is post.fullID
      el = file.fullImage = ImageCommon.popCache()
      $.on el, 'error', ImageExpand.error
      ImageCommon.rewind el if Conf['Restart when Opened'] and el.id isnt 'ihover'
      el.removeAttribute 'id'
    else
      el = file.fullImage = $.el (if isVideo then 'video' else 'img')
      el.dataset.fullID = post.fullID
      $.on el, 'error', ImageExpand.error
      el.src = src or file.url

    el.className = 'full-image'
    $.after thumb, el

    if isVideo
      # add contract link to file info
      if Conf['Show Controls'] and Conf['Click Passthrough'] and !file.videoControls
        file.videoControls = ImageExpand.videoControls.cloneNode true
        $.add file.text, file.videoControls

      # disable link to file so native controls can work
      thumb.parentNode.removeAttribute 'href'
      thumb.parentNode.removeAttribute 'target'

      el.loop = true
      Volume.setup el
      ImageExpand.setupVideoCB post

    if !isVideo
      $.asap (-> el.naturalHeight), -> ImageExpand.completeExpand post
    else if el.readyState >= el.HAVE_METADATA
      ImageExpand.completeExpand post
    else
      $.on el, 'loadedmetadata', -> ImageExpand.completeExpand post

  completeExpand: (post) ->
    {file} = post
    return unless file.isExpanding # contracted before the image loaded

    bottom = Header.getTopOf(file.thumb) + file.thumb.getBoundingClientRect().height
    oldHeight = d.body.clientHeight
    {scrollY} = window

    $.addClass post.nodes.root, 'expanded-image'
    $.rmClass  file.thumb,      'expanding'
    file.isExpanded = true
    delete file.isExpanding

    # Scroll to keep our place in the thread when images are expanded above us.
    if doc.contains(post.nodes.root) and bottom <= 0
      window.scrollBy 0, scrollY - window.scrollY + d.body.clientHeight - oldHeight

    # Scroll to display full image.
    if file.scrollIntoView
      delete file.scrollIntoView
      imageBottom = Math.min(doc.clientHeight - file.fullImage.getBoundingClientRect().bottom - 25, Header.getBottomOf file.fullImage)
      if imageBottom < 0
        window.scrollBy 0, Math.min(-imageBottom, Header.getTopOf file.fullImage)

    if file.isVideo
      ImageExpand.setupVideo post, Conf['Autoplay'], Conf['Show Controls']

  setupVideo: (post, playing, controls) ->
    {fullImage} = post.file
    unless playing
      fullImage.controls = controls
      return
    fullImage.controls = false
    $.asap (-> doc.contains fullImage), ->
      if !d.hidden and Header.isNodeVisible fullImage
        fullImage.play()
      else
        post.file.wasPlaying = true
    if controls
      ImageCommon.addControls fullImage

  videoCB: do ->
    # dragging to the left contracts the video
    mousedown = false
    mouseover:     -> mousedown = false
    mousedown: (e) -> mousedown = true  if e.button is 0
    mouseup:   (e) -> mousedown = false if e.button is 0
    mouseout:  (e) -> ImageExpand.toggle(Get.postFromNode @) if mousedown and e.clientX <= @getBoundingClientRect().left

  setupVideoCB: (post) ->
    for eventName, cb of ImageExpand.videoCB
      $.on post.file.fullImage, eventName, cb
    if post.file.videoControls
      $.on post.file.videoControls.firstElementChild, 'click', -> ImageExpand.toggle post

  error: ->
    post = Get.postFromNode @
    $.rm @
    delete post.file.fullImage
    # Images can error:
    #  - before the image started loading.
    #  - after the image started loading.
    # Don't try to re-expand if it was already contracted.
    return unless post.file.isExpanding or post.file.isExpanded
    if ImageCommon.decodeError @, post
      return ImageExpand.contract post
    # Don't autoretry images from the archive.
    unless @src.split('/')[2] is 'i.4cdn.org'
      return ImageExpand.contract post
    ImageCommon.error @, post, 10 * $.SECOND, (URL) ->
      if post.file.isExpanding or post.file.isExpanded
        ImageExpand.contract post
        ImageExpand.expand post, URL if URL

  menu:
    init: ->
      return unless ImageExpand.enabled

      el = $.el 'span',
        textContent: 'Image Expansion'
        className:   'image-expansion-link'

      {createSubEntry} = ImageExpand.menu
      subEntries = []
      for name, conf of Config.imageExpansion
        subEntries.push createSubEntry name, conf[1]

      Header.menu.addEntry
        el: el
        order: 105
        subEntries: subEntries

    createSubEntry: (name, desc) ->
      label = UI.checkbox name, name
      label.title = desc
      input = label.firstElementChild
      if name in ['Fit width', 'Fit height']
        $.on input, 'change', ImageExpand.cb.setFitness
      $.event 'change', null, input
      $.on input, 'change', $.cb.checked
      el: label

return ImageExpand
