PSAHiding =
  init: ->
    return unless Conf['Announcement Hiding'] and g.SITE.selectors.psa
    $.addClass doc, 'hide-announcement'
    $.onExists doc, g.SITE.selectors.psa, @setup
    $.ready ->
      $.rmClass doc, 'hide-announcement' if !$(g.SITE.selectors.psa)

  setup: (psa) ->
    PSAHiding.psa = psa
    PSAHiding.text = psa.dataset.utc ? psa.innerHTML
    if g.SITE.selectors.psaTop and (hr = $(g.SITE.selectors.psaTop)?.previousElementSibling) and hr.nodeName is 'HR'
      PSAHiding.hr = hr
    PSAHiding.content = $.el 'div'

    entry =
      el: $.el 'a',
        textContent: 'Show announcement'
        className: 'show-announcement'
        href: 'javascript:;'
      order: 50
      open: -> psa.hidden
    Header.menu.addEntry entry
    $.on entry.el, 'click', PSAHiding.toggle

    PSAHiding.btn = btn = $.el 'a',
      title:     'Mark announcement as read and hide.'
      className: 'hide-announcement-button fourchan-x--icon'
      href:      'javascript:;'
    Icon.set btn, 'minus_square'
    $.on btn, 'click', PSAHiding.toggle
    if psa.firstChild?.tagName is 'HR'
      $.after psa.firstChild, btn
    else
      $.prepend psa, btn

    PSAHiding.sync Conf['hiddenPSAList']
    $.rmClass doc, 'hide-announcement'

    $.sync 'hiddenPSAList', PSAHiding.sync

  toggle: ->
    hide = $.hasClass @, 'hide-announcement-button'
    set = (hiddenPSAList) ->
      if hide
        hiddenPSAList[g.SITE.ID] = PSAHiding.text
      else
        delete hiddenPSAList[g.SITE.ID]
    set Conf['hiddenPSAList']
    PSAHiding.sync Conf['hiddenPSAList']
    $.get 'hiddenPSAList', Conf['hiddenPSAList'], ({hiddenPSAList}) ->
      set hiddenPSAList
      $.set 'hiddenPSAList', hiddenPSAList

  sync: (hiddenPSAList) ->
    {psa, content} = PSAHiding
    psa.hidden = (hiddenPSAList[g.SITE.ID] is PSAHiding.text)
    # Remove content to prevent autoplaying sounds from hidden announcements
    if psa.hidden
      $.add content, [psa.childNodes...]
    else
      $.add psa, [content.childNodes...]
    PSAHiding.hr?.hidden = psa.hidden
