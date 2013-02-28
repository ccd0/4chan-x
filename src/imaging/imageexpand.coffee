ImageExpand =
  init: ->
    return if g.BOARD is 'f'
    QuoteInline.callbacks.push @node
    Main.callbacks.push @node
    @dialog()

  node: (post) ->
    return if (!post.img or post.hasPDF)
    a = post.img.parentNode
    $.on a, 'click', ImageExpand.cb.toggle

    # Detect Spoilers in this post.
    return if Conf['Don\'t Expand Spoilers'] and !Conf['Reveal Spoilers'] and /^spoiler\ image/i.test a.firstChild.alt

    # Expand the image if "Expand All" is enabled.
    if ImageExpand.on and !post.el.hidden
      ImageExpand.expand post.img

  cb:
    toggle: (e) ->
      return if e.shiftKey or e.altKey or e.ctrlKey or e.metaKey or e.button
      e.preventDefault()
      ImageExpand.toggle @

    all: ->
      ImageExpand.on = @checked
      if ImageExpand.on # Expand
        thumbs = $$ 'img[data-md5]'
        if Conf['Expand From Current']
          for thumb, i in thumbs
            break if thumb.getBoundingClientRect().top > 0
          thumbs = thumbs[i...]
        for thumb in thumbs
          continue if Conf['Don\'t Expand Spoilers'] and !Conf['Reveal Spoilers'] and /^spoiler\ image/i.test thumb.alt
          ImageExpand.expand thumb
      else # Contract
        for thumb in $$ 'img[data-md5][hidden]'
          ImageExpand.contract thumb
      return

    typeChange: ->
      klass = switch @value
        when 'full'
          ''
        when 'fit width'
          'fitwidth'
        when 'fit height'
          'fitheight'
        when 'fit screen'
          'fitwidth fitheight'
      $.id('delform').className = klass
      if /\bfitheight\b/.test klass
        $.on window, 'resize', ImageExpand.resize
        unless ImageExpand.style
          ImageExpand.style = $.addStyle ''
        ImageExpand.resize()
      else if ImageExpand.style
        $.off window, 'resize', ImageExpand.resize

  toggle: (a) ->
    thumb = a.firstChild
    if thumb.hidden
      rect = a.getBoundingClientRect()
      if rect.bottom > 0 # should be at least partially visible.
        # Scroll back to the thumbnail when contracting the image
        # to avoid being left miles away from the relevant post.
        if $.engine is 'webkit'
          d.body.scrollTop  += rect.top - 42 if rect.top < 0
          d.body.scrollLeft += rect.left     if rect.left < 0
        else
          d.documentElement.scrollTop  += rect.top - 42 if rect.top < 0
          d.documentElement.scrollLeft += rect.left     if rect.left < 0
      ImageExpand.contract thumb
    else
      ImageExpand.expand thumb

  contract: (thumb) ->
    thumb.hidden = false
    thumb.nextSibling.hidden = true
    $.rmClass thumb.parentNode.parentNode.parentNode.parentNode, 'image_expanded'

  expand: (thumb, src) ->
    # Do not expand images of hidden/filtered replies, or already expanded pictures.
    return if $.x 'ancestor-or-self::*[@hidden]', thumb
    a = thumb.parentNode
    src or= a.href
    return if /\.pdf$/.test src
    thumb.hidden = true
    $.addClass thumb.parentNode.parentNode.parentNode.parentNode, 'image_expanded'
    if (img = thumb.nextSibling) and img.tagName.toLowerCase() is 'img'
      # Expand already loaded picture
      img.hidden = false
      return
    img = $.el 'img',
      src:       src
      className: 'fullSize'
    $.on img, 'error', ImageExpand.error
    $.after thumb, img

  error: ->
    thumb = @previousSibling
    ImageExpand.contract thumb
    $.rm @
    src = @src.split '/'
    unless src[2] is 'images.4chan.org' and url = Redirect.image src[3], src[5]
      return if g.dead
      url = "//images.4chan.org/#{src[3]}/src/#{src[5]}"
    return if $.engine isnt 'webkit' and url.split('/')[2] is 'images.4chan.org'
    timeoutID = setTimeout ImageExpand.expand, 10000, thumb, url
    # Only Chrome let userscripts do cross domain requests.
    # Don't check for 404'd status in the archivers.
    return if $.engine isnt 'webkit' or url.split('/')[2] isnt 'images.4chan.org'
    $.ajax url, onreadystatechange: (-> clearTimeout timeoutID if @status is 404),
      type: 'head'

  dialog: ->
    controls = $.el 'div',
      id: 'imgControls'
      innerHTML:
        "<div id=imgContainer><select id=imageType name=imageType><option value=full>Full</option><option value='fit width'>Fit Width</option><option value='fit height'>Fit Height</option value='fit screen'><option value='fit screen'>Fit Screen</option></select><label><input type=checkbox id=imageExpand></label></div>"
    imageType = $.get 'imageType', 'full'
    select = $ 'select', controls
    select.value = imageType
    ImageExpand.cb.typeChange.call select
    $.on select, 'change', $.cb.value
    $.on select, 'change', ImageExpand.cb.typeChange
    $.on $('input', controls), 'click', ImageExpand.cb.all
    Style.rice controls

    $.prepend $.id('delform'), controls

  resize: ->
    ImageExpand.style.textContent = ".fitheight img[data-md5] + img {max-height:#{d.documentElement.clientHeight}px;}"