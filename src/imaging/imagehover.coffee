ImageHover =
  init: ->
    QuoteInline.callbacks.push @node
    Main.callbacks.push @node

  node: (post) ->
    return if (!post.img or post.hasPDF)
    $.on post.img, 'mouseover', ImageHover.mouseover

  mouseover: ->
    # Make sure to remove the previous image hover
    # in case it got stuck. Opera-only bug?
    if el = $.id 'ihover'
      if el is UI.el
        delete UI.el
      $.rm el

    # Don't stop other elements from dragging
    return if UI.el

    el = UI.el = $.el 'img'
      id: 'ihover'
      src: @parentNode.href
    $.add d.body, el
    $.on el, 'load',      ImageHover.load
    $.on el, 'error',     ImageHover.error
    $.on @,  'mousemove', UI.hover
    $.on @,  'mouseout',  ImageHover.mouseout
  load: ->
    return unless @parentNode
    # 'Fake' mousemove event by giving required values.
    {style} = @
    UI.hover
      clientX: - 45 + parseInt style.left
      clientY:  120 + parseInt style.top
  error: ->
    src = @src.split '/'
    unless src[2] is 'images.4chan.org' and url = Redirect.image src[3], src[5]
      return if g.dead
      url = "//images.4chan.org/#{src[3]}/src/#{src[5]}"
    return if $.engine isnt 'webkit' and url.split('/')[2] is 'images.4chan.org'
    timeoutID = setTimeout (=> @src = url), 3000
    # Only Chrome let userscripts do cross domain requests.
    # Don't check for 404'd status in the archivers.
    return if $.engine isnt 'webkit' or url.split('/')[2] isnt 'images.4chan.org'
    $.ajax url, onreadystatechange: (-> clearTimeout timeoutID if @status is 404),
      type: 'head'
  mouseout: ->
    UI.hoverend()
    $.off @, 'mousemove', UI.hover
    $.off @, 'mouseout',  ImageHover.mouseout