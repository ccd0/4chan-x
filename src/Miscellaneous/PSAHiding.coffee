PSAHiding =
  init: ->
    return if !Conf['Announcement Hiding']

    $.addClass doc, 'hide-announcement'

    entry =
      type: 'header'
      el: $.el 'a',
        textContent: 'Show announcement'
        className: 'show-announcement'
        href: 'javascript:;'
      order: 50
      open: ->
        if $.id('globalMessage')?.hidden
          return true
        false
    $.event 'AddMenuEntry', entry

    $.on entry.el, 'click', PSAHiding.toggle
    $.on d, '4chanXInitFinished', @setup
  setup: ->
    $.off d, '4chanXInitFinished', PSAHiding.setup

    unless psa = $.id 'globalMessage'
      $.rmClass doc, 'hide-announcement'
      return

    PSAHiding.btn = btn = $.el 'a',
      innerHTML: '<span>[&nbsp;-&nbsp;]</span>'
      title: 'Hide announcement.'
      className: 'hide-announcement'
      href: 'javascript:;'
    $.on btn, 'click', PSAHiding.toggle

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
        hiddenPSAs = hiddenPSAs[-5..]
      else
        $.event 'CloseMenu'
        i = hiddenPSAs.indexOf text
        hiddenPSAs.splice i, 1
      PSAHiding.sync hiddenPSAs
      $.set 'hiddenPSAs', hiddenPSAs
  sync: (hiddenPSAs) ->
    psa = $.id 'globalMessage'
    psa.hidden = PSAHiding.btn.hidden = if PSAHiding.trim(psa) in hiddenPSAs
      true
    else
      false
    if (hr = psa.nextElementSibling) and hr.nodeName is 'HR'
      hr.hidden = psa.hidden
  trim: (psa) ->
    psa.textContent.replace(/\W+/g, '').toLowerCase()
