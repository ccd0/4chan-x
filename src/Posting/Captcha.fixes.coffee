Captcha.fixes =
  css: '''
    .rc-imageselect-target > div:focus {
      outline: 2px solid #4a90e2;
    }
    .rc-button-default:focus {
      box-shadow: inset 0 0 0 2px #0063d6;
    }
  '''

  cssNoscript: '''
    .fbc-payload-imageselect {
      position: relative;
    }
    .fbc-payload-imageselect > label {
      position: absolute;
      display: block;
      height: 93.3px;
      width: 93.3px;
    }
    label[data-row="0"] {top: 0px;}
    label[data-row="1"] {top: 93.3px;}
    label[data-row="2"] {top: 186.6px;}
    label[data-col="0"] {left: 0px;}
    label[data-col="1"] {left: 93.3px;}
    label[data-col="2"] {left: 186.6px;}
  '''

  init: ->
    switch location.pathname.split('/')[3]
      when 'anchor'   then @initMain()
      when 'frame'    then @initPopup()
      when 'fallback' then @initNoscript()

  initMain: ->
    $.onExists d.body, '#recaptcha-anchor', true, (checkbox) ->
      focus = ->
        if d.hasFocus() and d.activeElement isnt checkbox
          checkbox.focus()
      focus()
      $.on window, 'focus', ->
        $.queueTask focus

  initPopup: ->
    $.addStyle @css
    @fixImages()
    new MutationObserver(=> @fixImages()).observe d.body, {childList: true, subtree: true}
    $.on d, 'keydown', @keybinds.bind(@)

  initNoscript: ->
    @noscript = true
    @images = $$ '.fbc-payload-imageselect > input'
    $.addStyle @cssNoscript
    @addLabels()
    $.on d, 'keydown', @keybinds.bind(@)

  fixImages: ->
    @images = $$ '.rc-imageselect-target > div'
    for img in @images
      img.tabIndex = 0
    return

  addLabels: ->
    imageSelect = $ '.fbc-payload-imageselect'
    labels = for checkbox, i in @images
      checkbox.id = "checkbox-#{i}"
      label = $.el 'label',
        htmlFor: checkbox.id
      label.dataset.row = i // 3
      label.dataset.col = i % 3
      label
    $.add imageSelect, labels

  keybinds: (e) ->
    return unless @images and doc.contains(@images[0]) and d.activeElement
    reload = $ '#recaptcha-reload-button, .fbc-button-reload'
    verify = $ '#recaptcha-verify-button, .fbc-button-verify > input'

    x = @images.indexOf d.activeElement
    if x < 0
      if d.activeElement is verify
        x = 11
      else if $('.rc-controls, .fbc-buttons').contains d.activeElement
        x = 9
      else
        return

    if !@noscript and e.keyCode is 32 and x < 9 # space on image
      @images[x].click()
      e.preventDefault()
      e.stopPropagation()
    else if dx = {38: 9, 40: 3, 37: 11, 39: 1, 73: 9, 75: 3, 74: 11, 76: 1}[e.keyCode] # Up, Down, Left, Right, I, K, J, L
      x = (x + dx) % 12
      if x is 10
        x = if dx is 11 then 9 else 11
      (@images[x] or {9: reload, 11: verify}[x]).focus()
      e.preventDefault()
      e.stopPropagation()
