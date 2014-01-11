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

    PSAHiding.btn = btn = $.el 'span',
      innerHTML: '[<a href=javascript:;>Dismiss</a>]'
      title:     'Mark announcement as read and hide.'
      className: 'hide-announcement' 
      href: 'javascript:;'
    $.on btn, 'click', PSAHiding.toggle

    $.get 'hiddenPSA', 0, ({hiddenPSA}) ->
      PSAHiding.sync hiddenPSA
      $.add psa, btn
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
