Captcha.fixes =
  imageKeys: '789456123uiojklm'.split('').concat(['Comma', 'Period'])

  css: '''
    .rc-imageselect-target > div:focus {
      outline: 2px solid #4a90e2;
    }
    .rc-imageselect-target td:focus {
      box-shadow: inset 0 0 0 2px #4a90e2;
      outline: none;
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
    return unless @images.length is 9

    $.addStyle @cssNoscript
    @addLabels()
    $.on d, 'keydown', @keybinds.bind(@)
    $.on $('.fbc-imageselect-challenge > form'), 'submit', @checkForm.bind(@)

  fixImages: ->
    @images = $$ '.rc-imageselect-target > div, .rc-imageselect-target td'
    for img in @images
      img.tabIndex = 0
    @addTooltips @images if @images.length is 9
    @complaintLinks()

  complaintLinks: ->
    for errmsg in $$ '.rc-imageselect-incorrect-response, .rc-imageselect-error-select-one, .rc-imageselect-error-select-more'
      unless $ 'a', errmsg
        link = $.el 'a',
          href: 'https://www.4chan-x.net/captchas.html'
          target: '_blank'
          textContent: '[complain]'
        $.add errmsg, [$.tn(' '), link]
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
    @addTooltips labels

  addTooltips: (nodes) ->
    for node, i in nodes
      node.title = "#{@imageKeys[i]} or #{@imageKeys[i+9][0].toUpperCase()}#{@imageKeys[i+9][1..]}"
    return

  checkForm: (e) ->
    n = 0
    n++ for checkbox in @images when checkbox.checked
    e.preventDefault() if n is 0

  keybinds: (e) ->
    return unless @images and doc.contains(@images[0])
    n = @images.length
    w = Math.round Math.sqrt n
    last = n + w - 1

    reload = $ '#recaptcha-reload-button, .fbc-button-reload'
    verify = $ '#recaptcha-verify-button, .fbc-button-verify > input'
    x = @images.indexOf d.activeElement
    if x < 0
      x = if d.activeElement is verify then last else n
    key = Keybinds.keyCode e

    if !@noscript and key is 'Space' and x < n
      @images[x].click()
    else if n is 9 and (i = @imageKeys.indexOf key) >= 0
      @images[i % 9].click()
      verify.focus()
    else if dx = {'Up': n, 'Down': w, 'Left': last, 'Right': 1}[key]
      x = (x + dx) % (n + w)
      if n < x < last
        x = if dx is last then n else last
      (@images[x] or (if x is n then reload) or (if x is last then verify)).focus()
    else
      return

    e.preventDefault()
    e.stopPropagation()
