PSAHiding =
  init: ->
    return unless Conf['Announcement Hiding']

    $.on d, '4chanXInitFinished', @setup

  setup: ->
    $.off d, '4chanXInitFinished', PSAHiding.setup

    unless psa = $.id 'globalMessage'
      return

    PSAHiding.btn = btn = $.el 'a',
      title: 'Toggle announcement.'
      href: 'javascript:;'
      textContent: '[ - ]'
    $.on btn, 'click', PSAHiding.toggle

    $.prepend psa, btn

    text = PSAHiding.trim psa
    $.get 'hiddenPSAs', [], (item) ->
      PSAHiding.sync item['hiddenPSAs']

  toggle: (e) ->
    text = PSAHiding.trim $.id 'globalMessage'
    $.get 'hiddenPSAs', [], (item) ->
      {hiddenPSAs} = item
      hiddenPSAs.push text
      hiddenPSAs = hiddenPSAs[-5..]
      PSAHiding.sync hiddenPSAs
      $.set 'hiddenPSAs', hiddenPSAs

  sync: (hiddenPSAs) ->
    {btn} = PSAHiding
    psa   = $.id 'globalMessage'
    if hiddenPSAs.contains PSAHiding.trim psa
      $.rm psa
      do Style.iconPositions

  trim: (psa) ->
    psa.textContent.replace(/\W+/g, '').toLowerCase()