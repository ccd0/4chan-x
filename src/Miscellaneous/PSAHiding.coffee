PSAHiding =
  init: ->
    return if !Conf['Announcement Hiding']

    $.addClass doc, 'hide-announcement', 'hide-announcement-enabled'

    $.on d, '4chanXInitFinished', @setup
  setup: ->
    $.off d, '4chanXInitFinished', PSAHiding.setup

    unless psa = $.id 'globalMessage'
      $.rmClass doc, 'hide-announcement', 'hide-announcement-enabled'
      return

    entry =
      type: 'header'
      el: $.el 'a',
        textContent: 'Show announcement'
        className: 'show-announcement'
        href: 'javascript:;'
      order: 50
      open: -> psa.hidden
    $.event 'AddMenuEntry', entry
    $.on entry.el, 'click', PSAHiding.toggle

    PSAHiding.btn = btn = $.el 'a',
      innerHTML: '<span>[&nbsp;-&nbsp;]</span>'
      title: 'Hide announcement.'
      className: 'hide-announcement'
      href: 'javascript:;'
    $.on btn, 'click', PSAHiding.toggle

    $.get 'hiddenPSA', 0, ({hiddenPSA}) ->
      PSAHiding.sync hiddenPSA
      $.before psa, btn
      $.rmClass doc, 'hide-announcement'

    $.sync 'hiddenPSA', PSAHiding.sync
  toggle: (e) ->
    if $.hasClass @, 'hide-announcement'
      UTC = +$.id('globalMessage').dataset.utc
      $.set 'hiddenPSA', UTC
    else
      $.event 'CloseMenu'
      $.delete 'hiddenPSA'
    PSAHiding.sync UTC
  sync: (UTC) ->
    psa = $.id 'globalMessage'
    psa.hidden = PSAHiding.btn.hidden = if UTC and UTC >= +psa.dataset.utc
      true
    else
      false
    if (hr = psa.nextElementSibling) and hr.nodeName is 'HR'
      hr.hidden = psa.hidden
