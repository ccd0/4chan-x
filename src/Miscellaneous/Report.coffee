Report =
  init: ->
    return unless Conf['Archive Report'] and /\bmode=report\b/.test(location.search)
    return unless match = location.search.match /\bno=(\d+)/
    postID = +match[1]
    Redirect.init()
    if @archive = Redirect.to 'report', {boardID: g.BOARD.ID, postID}
      $.ready @ready

  ready: ->
    if (message = $ 'h3') and /Report submitted!/.test(message.textContent)
      location.replace Report.archive
      return
    link = $.el 'a',
      href: Report.archive
      textContent: 'Report to fgts'
    $.add d.body, [$.tn(' ['), link, $.tn(']')]
