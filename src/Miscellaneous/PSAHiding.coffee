PSAHiding =
  init: ->
    return unless Conf['Announcement Hiding']
    $.addClass doc, 'hide-announcement'
    $.one d, '4chanXInitFinished', @setup

  setup: ->
    unless psa = PSAHiding.psa = $.id 'globalMessage'
      $.rmClass doc, 'hide-announcement'
      return
    if (hr = $.id('globalToggle')?.previousElementSibling) and hr.nodeName is 'HR'
      PSAHiding.hr = hr

    entry =
      el: $.el 'a',
        textContent: 'Show announcement'
        className: 'show-announcement'
        href: 'javascript:;'
      order: 50
      open: -> PSAHiding.hidden
    Header.menu.addEntry entry
    $.on entry.el, 'click', PSAHiding.toggle

    PSAHiding.btn = btn = $.el 'span',
      title:     'Mark announcement as read and hide.'
      className: 'hide-announcement' 

    $.extend btn, <%= html('[<a href="javascript:;">Dismiss</a>]') %>

    $.on btn, 'click', PSAHiding.toggle

    $.get 'hiddenPSA', 0, ({hiddenPSA}) ->
      PSAHiding.sync hiddenPSA
      $.add psa, btn
      $.rmClass doc, 'hide-announcement'

    $.sync 'hiddenPSA', PSAHiding.sync

  toggle: ->
    if $.hasClass @, 'hide-announcement'
      UTC = +$.id('globalMessage').dataset.utc
      $.set 'hiddenPSA', UTC
    else
      $.event 'CloseMenu'
      $.delete 'hiddenPSA'
    PSAHiding.sync UTC

  sync: (UTC) ->
    {psa} = PSAHiding
    PSAHiding.hidden = PSAHiding.btn.hidden = UTC? and UTC >= +psa.dataset.utc
    if PSAHiding.hidden
      $.rm psa
    else
      $.after $.id('globalToggle'), psa
    PSAHiding.hr?.hidden = PSAHiding.hidden
    return
