PSAHiding =
  init: ->
    return if !Conf['Announcement Hiding']

    $.addClass doc, 'hide-announcement'

    $.on d, '4chanXInitFinished', @setup

  setup: ->
    $.off d, '4chanXInitFinished', PSAHiding.setup

    unless psa = $.id 'globalMessage'
      $.rmClass doc, 'hide-announcement'
      return

    PSAHiding.btn = btn = $.el 'a',
      title: 'Toggle announcement.'
      innerHTML: '<span></span>'
      href: 'javascript:;'
    $.on btn, 'click', PSAHiding.toggle

    text = PSAHiding.trim psa
    $.get 'hiddenPSAs', [], (item) ->
      PSAHiding.sync item['hiddenPSAs']
      $.before psa, btn
      $.rmClass doc, 'hide-announcement'

    $.sync 'hiddenPSAs', PSAHiding.sync

  toggle: (e) ->
    hide = $.hasClass @, 'hide-announcement'
    text = PSAHiding.trim $.id 'globalMessage'
    $.get 'hiddenPSAs', [], ({hiddenPSAs}) -> 
      if hide
        hiddenPSAs.push text
      else
        i = hiddenPSAs.indexOf text
        hiddenPSAs.splice i, 1
      hiddenPSAs = hiddenPSAs[-5..]
      PSAHiding.sync hiddenPSAs
      $.set 'hiddenPSAs', hiddenPSAs

  sync: (hiddenPSAs) ->
    {btn} = PSAHiding
    psa   = $.id 'globalMessage'
    [psa.hidden, btn.firstChild.textContent, btn.className] = if PSAHiding.trim(psa) in hiddenPSAs
      [true,  '[\u00A0+\u00A0]', 'show-announcement'] 
    else
      [false, '[\u00A0-\u00A0]', 'hide-announcement'] 
  trim: (psa) ->
    psa.textContent.replace(/\W+/g, '').toLowerCase()