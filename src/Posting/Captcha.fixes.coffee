Captcha.fixes =
  selectors:
    image: '.rc-imageselect-target > .rc-imageselect-tile > img'

  init: ->
    switch location.pathname.split('/')[3]
      when 'anchor' then @initMain()
      when 'frame'  then @initPopup()

  initMain: ->
    $.onExists d.body, '#recaptcha-anchor', true, (checkbox) ->
      focus = ->
        if d.hasFocus() and d.activeElement isnt checkbox
          checkbox.focus()
      focus()
      $.on window, 'focus', ->
        $.queueTask focus

  initPopup: ->
    $.addStyle "#{@selectors.image}:focus {outline: 2px solid #4a90e2;}"
    @fixImages()
    new MutationObserver(=> @fixImages()).observe d.body, {childList: true, subtree: true}
    $.on d, 'keydown', @keybinds.bind(@)

  fixImages: ->
    return unless (@images = $$ @selectors.image).length
    focus = @images[0].tabIndex isnt 0
    for img in @images
      img.tabIndex = 0
    @focusImage() if focus

  focusImage: ->
    # XXX Image is not focusable at first in Firefox; to be refactored when I figure out why.
    img = @images[0]
    $.asap ->
      return true unless doc.contains img
      img.focus()
      d.activeElement is img
    , ->

  keybinds: (e) ->
    return unless @images and doc.contains(@images[0]) and d.activeElement
    x = @images.indexOf d.activeElement
    if x < 0
      return unless $('.rc-controls').contains d.activeElement
      x = 11
    return unless dx = {38: 9, 40: 3, 37: 11, 39: 1}[e.keyCode]
    if x is 11 and dx is 11 # left from buttons
      x = 8
    else
      x = (x + dx) % 12
    (@images[x] or $.id 'recaptcha-verify-button').focus()
    e.preventDefault()
    e.stopPropagation()
