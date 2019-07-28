Captcha.fixes =
  imageKeys: '789456123uiojklm'.split('').concat(['Comma', 'Period'])
  imageKeys16: '7890uiopjkl'.split('').concat(['Semicolon', 'm', 'Comma', 'Period', 'Slash'])

  css: '''
    .rc-imageselect-target > div:focus, .rc-image-tile-target:focus {
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
      /* XXX Fixes for Google's broken CSS */
      display: inline-block;
      margin-left: 0;
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
    .fbc-payload-imageselect > input:focus + label {
      outline: 2px solid #4a90e2;
    }
    .fbc-button-verify input:focus {
      box-shadow: inset 0 0 0 2px #0063d6;
    }
    body.focus .fbc {
      box-shadow: inset 0 0 0 2px #4a90e2;
    }
  '''

  init: ->
    switch location.pathname.split('/')[3]
      when 'anchor'   then @initMain()
      when 'frame', 'bframe' then @initPopup()
      when 'fallback' then @initNoscript()

  initMain: ->
    $.onExists d.body, '#recaptcha-anchor', (checkbox) ->
      focus = ->
        if d.hasFocus() and d.activeElement in [d.documentElement, d.body]
          checkbox.focus()
      focus()
      $.on window, 'focus', ->
        $.queueTask focus

    # Remove Privacy and Terms links from tab order.
    for a in $$ '.rc-anchor-pt a'
      a.tabIndex = -1
    return

  initPopup: ->
    $.addStyle @css
    @fixImages()
    new MutationObserver(=> @fixImages()).observe d.body, {childList: true, subtree: true}
    $.on d, 'keydown', @keybinds.bind(@)

  initNoscript: ->
    @noscript = true
    form = $ '.fbc-imageselect-challenge > form'
    data =
      if (token = $('.fbc-verification-token > textarea')?.value)
        {token}
      else if $('.fbc-imageselect-challenge > form')
        {working: true}
      else
        null
    new Connection(window.parent, '*').send data if data
    d.body.classList.toggle 'focus', d.hasFocus()
    $.on window, 'focus blur', -> d.body.classList.toggle 'focus', d.hasFocus()

    @images = $$ '.fbc-payload-imageselect > input'
    @width  = 3
    return unless @images.length is 9

    $.addStyle @cssNoscript
    @addLabels()
    $.on d, 'keydown', @keybinds.bind(@)
    $.on form, 'submit', @checkForm.bind(@)

  fixImages: ->
    @images = $$ '.rc-image-tile-target'
    @images = $$ '.rc-imageselect-target > div, .rc-imageselect-target td' unless @images.length
    @width  = $$('.rc-imageselect-target tr:first-of-type td').length or Math.round(Math.sqrt @images.length)
    for img in @images
      img.tabIndex = 0
    if @images.length is 9
      @addTooltips @images
    else
      @addTooltips16 @images

  addLabels: ->
    labels = for checkbox, i in @images
      checkbox.id = "checkbox-#{i}"
      label = $.el 'label',
        htmlFor: checkbox.id
      label.dataset.row = i // 3
      label.dataset.col = i % 3
      $.after checkbox, label
      label
    @addTooltips labels

  addTooltips: (nodes) ->
    for node, i in nodes
      node.title = "#{@imageKeys[i]} or #{@imageKeys[i+9][0].toUpperCase()}#{@imageKeys[i+9][1..]}"
    return

  addTooltips16: (nodes) ->
    for key, i in @imageKeys16
      if i % 4 < @width and (node = nodes[nodes.length - (4 - i//4)*@width + (i % 4)])
        node.title = "#{key[0].toUpperCase()}#{key[1..]}"
    return

  checkForm: (e) ->
    n = 0
    n++ for checkbox in @images when checkbox.checked
    e.preventDefault() if n is 0

  keybinds: (e) ->
    return unless @images and doc.contains(@images[0])
    n = @images.length
    w = @width
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
    else if n isnt 9 and (i = @imageKeys16.indexOf key) >= 0 and i % 4 < w and (img = @images[n - (4 - i//4)*w + (i % 4)])
      img.click()
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
