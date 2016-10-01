PassLink =
  init: ->
    return unless Conf['Pass Link']
    Main.ready @ready

  ready: ->
    return if not (styleSelector = $.id 'styleSelector')

    passLink = $.el 'span',
      className: 'brackets-wrap pass-link-container'
    $.extend passLink, <%= html('<a href="javascript:;">4chan Pass</a>') %>
    $.on passLink.firstElementChild, 'click', ->
      window.open '//sys.4chan.org/auth',
        Date.now()
        'width=500,height=280,toolbar=0'
    $.before styleSelector.previousSibling, [passLink, $.tn('\u00A0\u00A0')]
