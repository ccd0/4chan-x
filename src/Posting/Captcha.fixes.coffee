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

  fixImages: ->
    return unless (images = $$ @selectors.image).length
    focus = images[0].tabIndex isnt 0
    for img in images
      img.tabIndex = 0
    @focusImage images[0] if focus

  focusImage: (img) ->
    # XXX Image is not focusable at first in Firefox; to be refactored when I figure out why.
    $.asap ->
      return true unless doc.contains img
      img.focus()
      d.activeElement is img
    , ->
