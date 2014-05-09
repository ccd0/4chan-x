Flash =
  init: ->
    if g.BOARD.ID is 'f'
      $.ready Flash.initReady

  initReady: ->
    $.globalEval 'SWFEmbed.init()'

    return unless g.VIEW is 'thread'

    swfName = $ '.fileText > a'
    nav     = $ '.navLinks'
    swfName = swfName.href.replace /^(.*?)\/f\//g, ""
    sauceLink = $.el 'a',
      textContent: 'Check Sauce on SWFCHAN'
      href:        "http://eye.swfchan.com/search/?q=#{swfName}"
    $.addClass nav, 'swfSauce'
    $.rmClass nav, 'navLinks'
    $.rmAll nav
    $.add nav, [$.tn('['), sauceLink, $.tn(']')]